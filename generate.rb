require 'rubygems'
require 'nokogiri'
require 'maruku'
require 'erubis'
require 'date'
require 'fileutils'
require 'coderay'
require 'htmlentities'

$URL_BASE = ""
puts ARGV[0]
if ARGV[0] == "--staging" then
    $URL_BASE = "http://localhost/"
else
    $URL_BASE = "http://stevebob.net/"
end

$NUM_SIDEBAR_POSTS = 10;
$NUM_APPS_PER_COL  = 13;
$NUM_POSTS_PER_COL  = 13;
$NUM_HOMEPAGE_POSTS = 10;

$image_template = File.read("image_template.erb");
$left_image_template = File.read("left_image_template.erb");
$right_image_template = File.read("right_image_template.erb");
$centre_image_template = File.read("centre_image_template.erb");
$master_template = File.read("master_template.erb");
$about = File.read("about.erb");
$posts_template = File.read("posts.erb");
$apps_template = File.read("apps.erb");

$post_template = File.read("post_template.erb");
$divider_template = File.read("divider_template.erb");

$rss_template = File.read("rss.erb");


class Post

    def initialize(file)
        @dir = File.dirname(file)

# returns true iff the argument array has at least one entry which
# evaluates to true
        def test_array(arr)
            for i in arr
                if i then
                    return true
                end
            end
            return false
        end

# takes a text node from the xml file and returns some html to appear
# in the page in that position in the post
        def compile_text(text)
            Maruku.new(text.to_s.lstrip).to_html
        end

        def compile_img(img)

            align = img['align']
            caption = img.xpath('./caption/* | ./caption/text()').to_s.lstrip

            if align == nil then
                align = 'centre'
            end

            src = ""

            if img['src'] =~ /^http/ then
                src = img['src']
            else
                src = "#{$URL_BASE}#{@permalink}/#{img['src']}"
            end

            eruby = Erubis::Eruby.new($image_template)
            eruby.result({:type => align, :img => img, :caption => caption, :src => src})
        end

        def compile_code(code)
            language = code['language']
            code = code.xpath('./text()').to_s
            #code = code.gsub /&gt;/, '>'
            
            output = ""
            if language then
                IO.popen("python2 #{language}formatter.py", 'r+') do |pipe|
                    
                    pipe.puts code
                    pipe.close_write
                    output = pipe.read
                    
                end
            else
                puts code
                output = "<div class='highlight'><pre>" + code + "</pre></div>"
            end

            return output
        end

        def compile_html(html)
            html.xpath('./*').to_s
        end

        def compile_element(element)

            tag = element.node_name

            if tag == "img" then
                compile_img element
            elsif tag == "html" then
                compile_html element
            elsif tag == "code" then
                compile_code element
            else
                if element['src'] != nil then
                    element['src'] = "#{$URL_BASE}#{@permalink}/#{element['src']}"
                end
                return element.to_s
            end

        end

        # load the xml file
        f = File.open(file)

        # parse the file
        doc = Nokogiri::XML(f) do |config|
            config.noblanks
        end
        f.close

        post = doc.xpath('/post')[0]
        
        @heading = post['heading']
        @permalink = post['permalink']
        @text_only = "";
        # extract the parts of the post
        parts = doc.xpath("/post/* | /post/text()").
            # filter out empty text segments
            select do |i|
                i.class == Nokogiri::XML::Element or 
                test_array( i.to_s.lines.map { |l| not l =~ /^\s*$/ } )     
            end.
            map do |i|
                if i.class == Nokogiri::XML::Element then
                    compile_element i
                else
                    result = compile_text i
                    @text_only += result
                    result
                end
            end
        
        @description = (HTMLEntities.new.encode(parts.to_s)).delete "\n"

        
        eruby = Erubis::Eruby.new($post_template)
        output = eruby.result({
            :body => parts.to_s, 
            :heading => @heading,
            :date => post['date'],
            :permalink => @permalink})
        
        @date_string = post['date']

        @date_string =~ /(\d+)-(\d+)-(\d+)\s+(\d+):(\d+)/
        @date = DateTime.new($1.to_i, $2.to_i, $3.to_i, $4.to_i, $5.to_i, $6.to_i)
        @date_int = @date.strftime("%s").to_i

        @html = output

    end

    def description
        @description
    end

    def text_only
        @text_only
    end

    def dir
        @dir
    end

    def heading
        @heading
    end

    def permalink
        @permalink
    end

    def html
        @html
    end

    def date_string
        @date_string
    end

    def date
        @date
    end

    def date_int
        @date_int
    end
end

class App

    def initialize(file)
        @dir = File.dirname(file)
        
        f = File.open(file)
        doc = Nokogiri::XML(f) do |config|
            config.noblanks
        end
        f.close

        app = doc.xpath('/app')[0]

        @name = app['name']
        @url_end = app['url-end']
        
        @permalink = app['url']

        if app['url'] =~ /^http:\/\// then
            @url = app['url']
            @local = false

            puts "non local app"
        else
            @url = "#{$URL_BASE}#{app['url']}"
            @local = true
        end
        @favourite = false
        if app['favourite'] and app['favourite'] == 'true' then
            @favourite = true
        end

        @description_str = doc.xpath('/app/description/text()')[0].to_s.lstrip
        @description_html = Maruku.new(@description_str).to_html
    end
    
    def permalink
        @permalink
    end

    def local
        @local
    end

    def url
        @url
    end

    def description_str
        @description_str
    end

    def name
        @name
    end

    def description_html
        @description_html
    end

    def url_end
        @url_end
    end

    def dir
        @dir
    end

    def favourite
        @favourite
    end
end


posts = []
posts_dir = Dir.new("posts")

# populate posts with all the posts
posts_dir.each do |post_dir|
    name = post_dir.to_s
    if name != '.' and name != '..' then
        path = "posts/#{name}/#{name}.xml"
        if File.exists? path then
            posts << Post.new(path)
        end
    end

end

# sort posts by date
posts = posts.sort {|i, j| j.date_int <=> i.date_int}

sidebar_posts = posts.take($NUM_SIDEBAR_POSTS)

def column_split(arr, rows)

    ret = []
    i = 0
    j = 0
    arr.each do |p|
        if ret[j] == nil then
            ret[j] = []
        end

        ret[j] << p

        i += 1
        if i == rows then
            i = 0
            j += 1
        end
    end

    return ret
end

post_columns = column_split(posts, $NUM_POSTS_PER_COL);
page_posts = posts.take($NUM_HOMEPAGE_POSTS);

apps = []
apps_dir = Dir.new("apps")
apps_dir.each do |app_dir|
    name = app_dir.to_s
    if not name =~ /^\./ then
        path = "apps/#{name}/#{name}.xml"
        if File.exists? path then
          apps << App.new(path)
        end
    end
end

apps = apps.sort{|i, j| i.name <=> j.name}
favourite_apps = apps.select{|i| i.favourite}
app_columns = column_split(apps, $NUM_APPS_PER_COL);

puts apps.map{|i| i.url}.join("\n")


divider = File.read("divider_template.erb")
eruby = Erubis::Eruby.new($master_template)
template = eruby.result({
    :base => "<%= base %>",
    :body => page_posts.map{|i| i.html}.join(divider),
    :sidebar_posts => sidebar_posts,
    :sidebar_apps => favourite_apps,
    :post_columns => post_columns,
    :app_columns => app_columns
})

puts "---"

if File.directory? "output" then
    FileUtils.rm_r "output"
end


Dir.mkdir "output"

# Create app directory structure
apps.each do |app|
    
    if app.local

        Dir.mkdir "output/#{app.permalink}"
        files = Dir.glob("#{app.dir}/*")
        files.each do |f|
            FileUtils.cp_r f, "output/#{app.permalink}"
        end
    else
        puts "non local app"
        puts app.url
    end
end

Dir.glob("resources/*.less").each do |f|
    f =~ /(.*).less/
    name = "#{$1}.css"
    `lessc #{f} > #{name}`
end

Dir.glob("resources/*").each do |f|
    FileUtils.cp_r f, "output"
end

# Generate home page
eruby = Erubis::Eruby.new(template)
File.open("output/index.html", 'w') do |f|
    f.write(eruby.result({
        :body => page_posts[0].html,
        :base => $URL_BASE,
        :selected => "home",
        :title => page_posts[0].heading
    }))
end

rss_eruby = Erubis::Eruby.new($rss_template)
File.open("output/rss.xml", 'w') do |f|
    f.write(rss_eruby.result({
        :posts => posts
    }))
end

# Generate all posts
posts.each do |post|
    

    Dir.mkdir "output/#{post.permalink}"
    files = Dir.glob("#{post.dir}/*")
    files.each do |f|
        FileUtils.cp_r f, "output/#{post.permalink}"
    end

    File.open("output/#{post.permalink}/index.html", 'w') do |f|
        f.write(eruby.result({
            :body => post.html,
            :base => $URL_BASE,
            :title => post.heading
        }))
    end

end

Dir.mkdir "output/about"
File.open("output/about/index.html", 'w') do |f|
    f.write(eruby.result({
        :body => $about,
        :base => $URL_BASE,
        :selected => "about",
        :title => "About"
    }))
end
FileUtils.cp "me.jpg", "output/about"


Dir.mkdir "output/posts"
File.open("output/posts/index.html", 'w') do |f|
    f.write(eruby.result({
        :body => Erubis::Eruby.new($posts_template).result({
            :posts => posts,
            :base => $URL_BASE   
        }),
        :base => $URL_BASE,
        :selected => "posts",
        :title => "Posts"
    }))
end


Dir.mkdir "output/apps"
File.open("output/apps/index.html", 'w') do |f|
    f.write(eruby.result({
        :body => Erubis::Eruby.new($apps_template).result({
            :apps => apps,
            :base => $URL_BASE   
        }),
        :base => $URL_BASE,
        :selected => "apps",
        :title => "Apps"
    }))
end




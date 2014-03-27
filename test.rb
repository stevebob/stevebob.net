require 'rubygems'
require 'maruku'

file = File.open("a.md", "rb")
str = file.read

puts Maruku.new(str).to_html

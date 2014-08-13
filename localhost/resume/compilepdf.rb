require 'rubygems'
require 'pdfkit'
require 'erb'

content = File.read('resume-print.erb')
template = ERB.new(content)
html = template.result(binding)
#htmlnew = html.gsub(/<hr \/>\s*<h2>Work/, '<br/><br/><br/><br/><br/><br/><br/><h2>Work')
kit = PDFKit.new(html)
file = kit.to_file('resume.pdf')

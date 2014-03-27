require 'rubygems'
require 'pdfkit'
require 'erb'

content = File.read('resume-print.erb')
template = ERB.new(content)
html = template.result(binding)
htmlnew = html.gsub(/<hr \/>\s*<h2>Achievements/, '<br/><br/><br/><br/><br/><br/><br/><h2>Achievements')
puts htmlnew
kit = PDFKit.new(htmlnew)
file = kit.to_file('resume.pdf')

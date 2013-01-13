from pygments import highlight
from pygments.lexers import HaskellLexer
from pygments.formatters import HtmlFormatter

buf = ""
while True:
    try:
        line = raw_input()
        buf += (line + "\n")
    except EOFError:
        break

print highlight(buf, HaskellLexer(), HtmlFormatter())

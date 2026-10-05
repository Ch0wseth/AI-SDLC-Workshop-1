import re, sys
fname = sys.argv[1]
outname = sys.argv[2]
html = open(fname, encoding='utf-8').read()
html = re.sub(r'<script.*?</script>', '', html, flags=re.S)
html = re.sub(r'<style.*?</style>', '', html, flags=re.S)
text = re.sub(r'<[^>]+>', ' ', html)
text = text.replace('&nbsp;', ' ').replace('&amp;', '&').replace('&quot;', '"').replace('&#39;', "'")
text = re.sub(r'[ \t]+', ' ', text)
text = re.sub(r'\n\s*\n+', '\n', text)
open(outname, 'w', encoding='utf-8').write(text)
print(len(text))

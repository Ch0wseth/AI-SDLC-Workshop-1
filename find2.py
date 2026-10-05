import re
html = open('ems.html', encoding='utf-8').read()
idx = html.find('th scope="row"><code>extra')
print(idx)
print(html[idx:idx+600])

import re
html = open('ems.html', encoding='utf-8').read()
html = html.replace('<wbr/>', '').replace('<wbr>', '')
pattern = re.compile(r'<th scope="row"><code>([^<]+)</code></th><td>([^<]*)</td>(.*?)</tr>', re.S)
cols = ['Copilot CLI','VS Code','GitHub Copilot app','Copilot cloud agent','JetBrains IDEs']
for m in pattern.finditer(html):
    key = m.group(1)
    rest = m.group(3)
    labels = re.findall(r'aria-label="(Supported|Not supported)"', rest)
    if key in ('enabledPlugins','extraKnownMarketplaces','strictKnownMarketplaces','model','allowedMcpServers'):
        print(key, dict(zip(cols, labels)))

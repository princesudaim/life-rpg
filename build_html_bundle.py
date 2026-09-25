import re

with open("/home/user/life-rpg/style.css", "r", encoding="utf-8") as f:
    css_content = f.read()

with open("/home/user/life-rpg/app.js", "r", encoding="utf-8") as f:
    js_content = f.read()

with open("/home/user/life-rpg/index.html", "r", encoding="utf-8") as f:
    html_orig = f.read()

# Extract head before <style>
head_match = re.search(r'([\s\S]*?<head>[\s\S]*?)(<style>[\s\S]*?</style>)', html_orig)
assert head_match, "Could not match head and style"
pre_style = head_match.group(1)

# Extract body between </style> and <script>
body_match = re.search(r'</style>([\s\S]*?)<script>[\s\S]*?const KEY =', html_orig)
assert body_match, "Could not match body markup"
body_markup = body_match.group(1)

# Ensure viewport meta tag has maximum-scale=1.0, user-scalable=no
pre_style = re.sub(
    r'<meta name="viewport"[^>]*>',
    '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">',
    pre_style
)

# Update cache version to v=69
pre_style = re.sub(r'v=\d+', 'v=69', pre_style)
js_content = re.sub(r'sw\.js\?v=\d+', 'sw.js?v=69', js_content)

# Build bundled html
bundled = f"""{pre_style}<style>
{css_content}
</style>{body_markup}<script>
{js_content}
</script>
</body>
</html>
"""

with open("/home/user/life-rpg/index.html", "w", encoding="utf-8") as f:
    f.write(bundled.strip() + "\n")

with open("/home/user/life-rpg/app.js", "w", encoding="utf-8") as f:
    f.write(js_content)

print(f"Successfully bundled index.html ({len(bundled)} bytes) with cache v=69")

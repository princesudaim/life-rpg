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

# Update cache version in pre_style
pre_style = re.sub(r'v=\d+', 'v=67', pre_style)

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

print(f"Successfully bundled index.html ({len(bundled)} bytes)")

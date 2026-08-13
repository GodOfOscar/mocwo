from pathlib import Path

path = Path('backend/server.js')
text = path.read_text(encoding='utf-8')
needle = "const normalizePage = (page) => normalizeMonth(page);\n\napp.get('/api/admin-news/list', async (req, res) => {"
if needle not in text:
    raise SystemExit('needle not found')
replacement = "const normalizePage = (page) => normalizeMonth(page);\nconst normalizeLink = (link) => {\n  let value = String(link || '').trim();\n  if (!value) return value;\n  value = value.replace(/^\\/+/, '');\n  return f'/{value}';\n};\n\napp.get('/api/admin-news/list', async (req, res) => {"
text = text.replace(needle, replacement)
needle2 = "  if (!title || !excerpt || !content) {\n    return res.status(400).json({ success: false, error: 'Missing required news fields.' });\n  }\n\n  try {\n    let result;\n    if (id) {\n      result = await supabase.from('news').update({ title, excerpt, content, date, image, link }).eq('id', id);\n    } else {\n      result = await supabase.from('news').insert([{ title, excerpt, content, date, image, link }]);\n    }"
if needle2 not in text:
    raise SystemExit('needle2 not found')
replacement2 = "  if (!title || !excerpt || !content) {\n    return res.status(400).json({ success: false, error: 'Missing required news fields.' });\n  }\n\n  const normalizedLink = normalizeLink(link);\n\n  try {\n    let result;\n    if (id) {\n      result = await supabase.from('news').update({ title, excerpt, content, date, image, link: normalizedLink }).eq('id', id);\n    } else {\n      result = await supabase.from('news').insert([{ title, excerpt, content, date, image, link: normalizedLink }]);\n    }"
text = text.replace(needle2, replacement2)
path.write_text(text, encoding='utf-8')
print('patched server.js')

from pathlib import Path
path = Path(r'c:\Users\user\Desktop\moc\src\pages\News.tsx')
text = path.read_text(encoding='utf-8')
old = '''      <main className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Latest Articles</h2>
          <div className="text-sm text-muted-foreground">Total: <span className="font-semibold text-foreground">{newsItems.length}</span></div>
        </div>

        {error && (
          <div className="mb-6 text-sm text-red-600">{error}</div>
        )}
'''
new = '''      <main className="container mx-auto px-4 py-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between mb-10">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-purple-600">Featured news</p>
            <h2 className="text-3xl md:text-4xl font-bold">Latest Articles</h2>
          </div>
          <div className="text-sm text-muted-foreground">Total: <span className="font-semibold text-foreground">{newsItems.length}</span></div>
        </div>

        {error && (
          <div className="mb-6 text-sm text-red-600">{error}</div>
        )}

        {newsItems.length > 0 && !loading && (
          <div className="mb-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm uppercase tracking-[0.24em] text-purple-600 mb-3">Spotlight</p>
                <h3 className="text-3xl font-semibold text-slate-900">{newsItems[0].title}</h3>
                <p className="mt-4 text-slate-600 text-lg leading-8 line-clamp-3">{newsItems[0].excerpt}</p>
                <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                  <span className="inline-flex items-center gap-2"><Calendar className="w-4 h-4" />{newsItems[0].date}</span>
                  {newsItems[0].author && <span className="inline-flex items-center gap-2"><User className="w-4 h-4" />{newsItems[0].author}</span>}
                  {newsItems[0].category && <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{newsItems[0].category}</span>}
                </div>
              </div>
              <div className="w-full max-w-md overflow-hidden rounded-3xl bg-slate-100">
                {newsItems[0].image ? (
                  <img src={newsItems[0].image} alt={newsItems[0].title} className="h-64 w-full object-cover" />
                ) : (
                  <div className="flex h-64 items-center justify-center text-slate-500">No featured image</div>
                )}
              </div>
            </div>
            <div className="mt-6">
              <Link to={newsItems[0].link || `/news/${newsItems[0].id}`} className="inline-flex items-center rounded-full bg-purple-700 px-5 py-3 text-sm font-semibold text-white shadow hover:bg-purple-800 transition">Read featured story</Link>
            </div>
          </div>
        )}
'''
old2 = '''          <div className="mt-8 mb-6">
            <Button variant="ghost" onClick={() => navigate('/news')}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
          </div>
'''
new2 = '''          <div className="mt-8 mb-6 sticky top-4 z-20 bg-slate-50/90 backdrop-blur-md py-4 sm:py-0">
            <Button variant="ghost" onClick={() => navigate('/news')}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
          </div>
'''
if old not in text:
    raise RuntimeError('Old intro block not found')
text = text.replace(old, new, 1)
if old2 not in text:
    raise RuntimeError('Old back button block not found')
text = text.replace(old2, new2, 1)
path.write_text(text, encoding='utf-8')
print('patched')

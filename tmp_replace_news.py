from pathlib import Path
p = Path('src/pages/News.tsx')
text = p.read_text(encoding='utf-8')
marker = '// LIST VIEW (full redesign)'
if marker not in text:
    raise SystemExit('marker not found')
head, tail = text.split(marker, 1)
if 'export default News;' not in tail:
    raise SystemExit('export default not found')
_, rest = tail.split('export default News;', 1)
new_block = '''// LIST VIEW (full redesign)
  return (
    <div className="min-h-screen bg-[#f8f2e8] text-slate-900">
      <section className="relative overflow-hidden bg-[#f7efe1]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(128,85,56,0.14),_transparent_42%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(247,239,225,0.96),_rgba(248,242,232,0.98))]" />
        <div className="container mx-auto px-4 py-20 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[1.35fr_0.85fr] lg:items-center">
            <div className="space-y-6">
              <p className="inline-flex rounded-full bg-[#e9d7c2] px-4 py-2 text-sm font-semibold uppercase tracking-[0.22em] text-[#5f3d26]">Church News</p>
              <h1 className="max-w-3xl text-4xl font-serif font-semibold leading-tight text-[#243c5a] sm:text-5xl">Stories of faith, mission, and community</h1>
              <p className="max-w-2xl text-base leading-8 text-slate-700 sm:text-lg">Discover the latest updates, events, and reflections from our church family in a warm and welcoming news space.</p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:max-w-xl">
                <div className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm">
                  <p className="text-sm font-semibold text-[#5f3d26]">Weekly update</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">Faith stories, event highlights, and mission moments to inspire the week.</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm">
                  <p className="text-sm font-semibold text-[#5f3d26]">Community care</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">Important announcements, volunteer news, and ways to connect with the congregation.</p>
                </div>
              </div>
            </div>
            <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-400/10 backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Welcome note</p>
              <h2 className="mt-4 text-3xl font-semibold text-[#243c5a]">A gentle place for every church story</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">Bookmark announcements, event invitations, and faith-filled reflections made just for our church family.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <span className="rounded-full bg-[#5f3d26] px-4 py-2 text-sm font-semibold text-white">All Updates</span>
                <span className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700">Encouraging & Hopeful</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12 lg:py-16">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
        </div>

        <div className="grid gap-8 xl:grid-cols-[2fr_0.95fr]">
          <div className="space-y-8">
            <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-2xl font-serif font-semibold text-[#243c5a]">Featured Story</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">A highlighted update from the heart of our community.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  {categories.map(category => (
                    <button
                      key={category.key}
                      onClick={() => setActiveCategory(category.key)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeCategory === category.key ? 'bg-[#243c5a] text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
              <article className="rounded-[30px] border border-slate-200 bg-white shadow-sm overflow-hidden transition hover:shadow-xl">
                <div className="relative h-96 overflow-hidden bg-slate-100">
                  {heroStory?.image ? (
                    <img src={heroStory.image} alt={heroStory.title} className="h-full w-full object-cover transition duration-500 hover:scale-105" />
                  ) : (
                    <div className="h-full w-full bg-[#d9c7af]" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    {heroStory?.category && <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-white/90">{heroStory.category}</span>}
                    <h3 className="mt-4 text-3xl font-semibold leading-tight">{heroStory?.title}</h3>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-100 line-clamp-3">{heroStory?.excerpt}</p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                    {heroStory?.author && <span>By {heroStory.author}</span>}
                    {heroStory?.date && <span>{heroStory.date}</span>}
                    <span>{heroStory?.readTime || '3 min read'}</span>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link to={heroStory?.link || `/news/${heroStory?.id}`} className="inline-flex items-center rounded-full bg-[#243c5a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-900">Read More</Link>
                    <button className="inline-flex items-center rounded-full border border-slate-300 bg-slate-50 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100">Save for later</button>
                  </div>
                </div>
              </article>

              <aside className="space-y-6">
                <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-[#243c5a]">Upcoming Events</h3>
                  <div className="mt-6 space-y-4">
                    {sidebarEvents.map((event, index) => (
                      <div key={index} className="rounded-3xl bg-[#f5ece1] p-4">
                        <p className="text-sm font-semibold text-slate-900">{event.title}</p>
                        <p className="mt-2 text-sm text-slate-600">{event.date}</p>
                        <p className="mt-1 text-sm text-slate-500">{event.location}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-[#243c5a]">Stay Connected</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">Subscribe to receive weekly church news, event reminders, and community blessings.</p>
                  <form className="mt-6 space-y-4">
                    <label className="block text-sm font-medium text-slate-700">Email address</label>
                    <input type="email" placeholder="you@example.com" className="w-full rounded-3xl border border-slate-300 bg-[#fbf6ef] px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#243c5a] focus:ring-2 focus:ring-[#243c5a]/10" />
                    <button type="submit" className="inline-flex w-full justify-center rounded-3xl bg-[#243c5a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-900">Subscribe</button>
                  </form>
                </div>
              </aside>
            </div>

            <div className="space-y-4">
              <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-[#243c5a]">Latest Articles</h3>
                <p className="mt-2 text-sm text-slate-600">Browse our latest church updates, reflections, and community stories.</p>
              </div>
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i} className="p-0 overflow-hidden">
                      <div className="h-40 bg-muted animate-pulse" />
                      <CardContent>
                        <div className="h-4 bg-muted rounded w-3/4 mb-3 animate-pulse" />
                        <div className="h-4 bg-muted rounded w-5/6 mb-3 animate-pulse" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredNews.slice(1).map(item => (
                    <Card key={String(item.id)} className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition hover:shadow-xl">
                      <Link to={item.link || `/news/${item.id}`} className="block h-48 overflow-hidden bg-slate-100">
                        {item.image ? (
                          <img src={item.image} alt={item.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                        ) : (
                          <div className="h-full w-full bg-[#e5dbcb]" />
                        )}
                      </Link>
                      <div className="p-6">
                        <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.22em] text-slate-400">
                          <span>{item.category || 'Update'}</span>
                          <span>{item.date}</span>
                        </div>
                        <h3 className="mt-4 text-xl font-semibold text-slate-900 line-clamp-2">{item.title}</h3>
                        <p className="mt-3 text-sm leading-6 text-slate-600 line-clamp-3">{item.excerpt}</p>
                        <div className="mt-6 flex items-center justify-between text-sm text-slate-500">
                          <span>{item.readTime || '3 min read'}</span>
                          <Link to={item.link || `/news/${item.id}`} className="font-semibold text-[#243c5a]">Read More</Link>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>

          <aside className="space-y-8">
            <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-[#243c5a]">Filter by category</h3>
              <p className="mt-3 text-sm text-slate-600">Choose the category that speaks to you and refine the latest church news.</p>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-1">
                {categories.slice(1).map(category => (
                  <button
                    key={category.key}
                    onClick={() => setActiveCategory(category.key)}
                    className={`w-full rounded-3xl px-4 py-3 text-left text-sm font-semibold transition ${activeCategory === category.key ? 'bg-[#243c5a] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                    {category.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-[#243c5a]">Join our mailing list</h3>
              <p className="mt-3 text-sm text-slate-600">Receive prayer updates, event reminders, and church reflections each week.</p>
              <form className="mt-6 space-y-4">
                <label className="block text-sm font-medium text-slate-700">Email address</label>
                <input type="email" placeholder="you@example.com" className="w-full rounded-3xl border border-slate-300 bg-[#fbf6ef] px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#243c5a] focus:ring-2 focus:ring-[#243c5a]/10" />
                <button type="submit" className="inline-flex w-full justify-center rounded-3xl bg-[#243c5a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-900">Subscribe</button>
              </form>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
'''
p.write_text(head + new_block + 'export default News;', encoding='utf-8')
print('updated')

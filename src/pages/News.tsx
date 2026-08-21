// src/pages/News.tsx
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User, Clock, Tag } from "lucide-react";
import { news as staticNews, NewsItem } from "@/data/news";

interface PublicNewsItem extends NewsItem {
  // We accept either string or number IDs from API vs static data.
  id: string | number;
}

const News = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newsItems, setNewsItems] = useState<PublicNewsItem[]>(staticNews);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/news');
        const json = await response.json();
        if (!response.ok) throw new Error(json.error || 'Unable to fetch news');
        setNewsItems(json.data || staticNews);
      } catch (err: any) {
        console.warn('Public news fetch failed, using static fallback:', err.message || err);
        setNewsItems(staticNews);
        setError(err.message || 'Unable to load news.');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // If we have an ID parameter, show the detailed news view
  if (id) {
    const matchesId = (item: PublicNewsItem, idValue: string) => {
      const iid = String(item.id || "");
      const link = String(item.link || "");
      if (iid === idValue) return true;
      if (link === `/news/${idValue}`) return true;
      if (link === `/${idValue}`) return true;
      if (link.endsWith(`/${idValue}`)) return true;
      if (link === idValue) return true;
      return false;
    };

    const newsItem = newsItems.find(item => matchesId(item, String(id)));

    if (!newsItem) {
      return (
        <div className="min-h-screen py-12">
          <div className="container mx-auto px-4 pt-16">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">News Not Found</h1>
              <p className="text-muted-foreground mb-8">The news article you're looking for doesn't exist.</p>
              <Link to="/news">
                <Button>Back to News</Button>
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate('/news')}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-3 text-sm mb-6 pb-6 border-b border-muted/50">
            {newsItem.category && (
              <span className="px-2 py-1 rounded bg-purple-100/50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-medium">
                {newsItem.category}
              </span>
            )}
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{newsItem.date}</span>
            </div>
            {newsItem.readTime && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{newsItem.readTime}</span>
              </div>
            )}
            {newsItem.author && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <User className="w-4 h-4" />
                <span>{newsItem.author}</span>
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
            {newsItem.title}
          </h1>

          {/* Featured Image */}
          <div className="w-full mb-10 rounded-lg overflow-hidden border border-muted/50">
            <img
              src={newsItem.image}
              alt={newsItem.title}
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Article Content */}
          <div className="prose dark:prose-invert max-w-none mb-12">
            {newsItem.content ? (
              <div dangerouslySetInnerHTML={{ __html: newsItem.content }} />
            ) : (
              <div className="space-y-4">
                <p className="text-lg text-muted-foreground">{newsItem.excerpt}</p>
                <p className="text-muted-foreground italic">
                  Full article content coming soon.
                </p>
              </div>
            )}
          </div>

          {/* Gallery */}
          {newsItem.images && newsItem.images.length > 1 && (
            <div className="mb-12 pb-12 border-b border-muted/50">
              <h3 className="text-2xl font-bold mb-6">Gallery</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {newsItem.images.slice(1).map((image, index) => (
                  <div key={index} className="rounded-lg overflow-hidden border border-muted/50">
                    <img
                      src={image}
                      alt={`Gallery ${index + 2}`}
                      className="w-full h-32 object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Videos */}
          {newsItem.videos && newsItem.videos.length > 0 && (
            <div className="mb-12 pb-12 border-b border-muted/50">
              <h3 className="text-2xl font-bold mb-6">Videos</h3>
              <div className="space-y-4">
                {newsItem.videos.map((video, index) => (
                  <div key={index} className="aspect-video rounded-lg overflow-hidden border border-muted/50">
                    <video
                      controls
                      className="w-full h-full"
                      poster={newsItem.image}
                    >
                      <source src={video} type="video/mp4" />
                      Your browser does not support video.
                    </video>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Articles */}
          <div>
            <h3 className="text-2xl font-bold mb-6">Related</h3>
            <div className="space-y-3">
              {newsItems
                .filter(item => String(item.id) !== String(newsItem.id))
                .slice(0, 2)
                .map((relatedItem) => (
                  <Link
                    key={relatedItem.id}
                    to={relatedItem.link || `/news/${relatedItem.id}`}
                    className="group"
                  >
                    <Card className="border border-muted/50 hover:bg-muted/50 transition-colors">
                      <div className="flex gap-4 p-4">
                        <div className="h-24 w-24 bg-muted rounded flex-shrink-0 overflow-hidden">
                          <img
                            src={relatedItem.image}
                            alt={relatedItem.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-muted-foreground mb-1">{relatedItem.date}</p>
                          <h4 className="font-semibold line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 mb-1">
                            {relatedItem.title}
                          </h4>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {relatedItem.excerpt}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default news list view
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Enhanced */}
      <div className="relative overflow-hidden border-b border-muted/20 bg-gradient-to-br from-background via-background to-purple-50/30 dark:to-purple-950/20">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-600/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-indigo-600/5 rounded-full blur-3xl" />
        <div className="relative container mx-auto px-4 py-14">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 text-sm font-semibold mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-600 dark:bg-purple-400" />
              Latest Updates
            </p>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              News & Articles
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Stay updated with the latest stories and announcements from our community
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-14">
        {/* Section Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Recent Articles</h2>
          </div>
          <div className="px-3 py-1.5 rounded-full bg-purple-100/50 dark:bg-purple-900/30 text-sm font-semibold text-purple-700 dark:text-purple-300">
            {newsItems.length} articles
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card
                key={i}
                className="border border-muted/30 shadow-sm rounded-xl"
              >
                <div className="flex gap-5 p-5">
                  <div className="h-36 w-40 bg-gradient-to-br from-muted to-muted/50 rounded-lg flex-shrink-0 animate-pulse" />
                  <div className="flex-1 space-y-3 py-1">
                    <div className="h-3 bg-muted rounded-full w-1/3 animate-pulse" />
                    <div className="h-4 bg-muted rounded-lg w-3/4 animate-pulse" />
                    <div className="h-4 bg-muted rounded-lg w-full animate-pulse" />
                    <div className="h-3 bg-muted rounded-full w-2/5 animate-pulse" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* News List */}
        {!loading && newsItems.length > 0 && (
          <div className="space-y-4">
            {newsItems.map((item: PublicNewsItem) => (
              <Link
                key={item.id}
                to={item.link || `/news/${item.id}`}
                className="group block"
              >
                <Card className="border border-muted/30 shadow-sm hover:shadow-lg hover:border-purple-300/50 dark:hover:border-purple-700/50 transition-all duration-300 rounded-xl overflow-hidden">
                  <div className="flex gap-5 p-5">
                    {/* Image */}
                    <div className="h-36 w-40 bg-muted rounded-lg flex-shrink-0 overflow-hidden relative">
                      {item.image ? (
                        <>
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm bg-gradient-to-br from-muted to-muted/50">
                          No image
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        {/* Category Badge */}
                        {item.category && (
                          <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-100 to-purple-50 dark:from-purple-900/40 dark:to-purple-900/20 text-xs font-bold text-purple-700 dark:text-purple-300 mb-3 uppercase tracking-wide">
                            {item.category}
                          </div>
                        )}

                        {/* Title */}
                        <h3 className="text-lg font-bold line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors mb-2">
                          {item.title}
                        </h3>

                        {/* Excerpt */}
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                          {item.excerpt}
                        </p>
                      </div>

                      {/* Meta */}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-3 pt-3 border-t border-muted/20">
                        <span className="inline-flex items-center gap-1.5 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-purple-600/60" />
                          {item.date}
                        </span>
                        {item.readTime && (
                          <span className="inline-flex items-center gap-1.5 font-medium">
                            <Clock className="w-3.5 h-3.5 text-purple-600/60" />
                            {item.readTime}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && newsItems.length === 0 && (
          <div className="text-center py-20">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center mb-6">
              <Tag className="w-8 h-8 text-muted-foreground/40" />
            </div>
            <h3 className="text-2xl font-bold mb-3">No articles yet</h3>
            <p className="text-muted-foreground text-lg">Check back soon for updates and stories from our community.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default News;

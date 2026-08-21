import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Play, Users, MessageSquare, Heart, Settings, Maximize, Volume2, Share, X, Calendar, Loader2, Radio, Info, ArrowDown, Pin } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { NotificationSignup } from "@/components/NotificationSignup";
import { useToast } from "@/hooks/use-toast";
import { verifyAdmin } from "@/lib/api";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// YouTube Configuration
const YOUTUBE_CHANNEL_ID = import.meta.env.VITE_YOUTUBE_CHANNEL_ID || "";
const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || "";

// Fallback video link if YouTube API is not configured
const FALLBACK_VIDEO_URL = "https://www.youtube.com/watch?v=2AXtwCNMVKc";

const ScriptureReference = ({ reference }: { reference: string }) => {
  const [text, setText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchVerse = async () => {
    if (text) return;
    setLoading(true);
    try {
      const response = await fetch(`https://bible-api.com/${encodeURIComponent(reference)}`);
      const data = await response.json();
      setText(data.text || "Verse not found.");
    } catch (error) {
      setText("Error fetching verse.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild>
        <span 
          onMouseEnter={fetchVerse}
          className="text-blue-600 font-bold cursor-help underline decoration-dotted underline-offset-2 hover:text-blue-800 transition-colors"
        >
          {reference}
        </span>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs p-3 bg-slate-900 text-white border-slate-800 shadow-xl z-[200]">
        {loading ? (
          <div className="flex items-center gap-2 py-1">
            <Loader2 className="w-3 h-3 animate-spin text-blue-400" />
            <span className="text-xs text-slate-300">Fetching Scripture...</span>
          </div>
        ) : (
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase text-blue-400 tracking-wider">{reference}</p>
            <p className="text-sm leading-relaxed italic text-slate-100">"{text?.trim()}"</p>
          </div>
        )}
      </TooltipContent>
    </Tooltip>
  );
};

const LivePage = () => {
  const [liveService, setLiveService] = useState<any>(null);
  const [viewerCount, setViewerCount] = useState(0);
  const [chatMessage, setChatMessage] = useState("");
  const [showChat, setShowChat] = useState(true);
  const [selectedQuality, setSelectedQuality] = useState("720p HD");
  const [iframeError, setIframeError] = useState(false);
  const [showPrayerModal, setShowPrayerModal] = useState(false);
  const [prayerRequest, setPrayerRequest] = useState("");
  const [isLoadingLiveStream, setIsLoadingLiveStream] = useState(false);
  const [services, setServices] = useState<any[]>([]);
  const { toast } = useToast();

  const [chatMessages, setChatMessages] = useState<Array<{id:string;user_name:string;message:string;created_at:string;is_highlighted:boolean}>>([]);
  const [displayName, setDisplayName] = useState<string>("Guest");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [showNewMessageNotification, setShowNewMessageNotification] = useState(false);
  const [pinnedMessage, setPinnedMessage] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPinningMode, setIsPinningMode] = useState(false);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      setShowNewMessageNotification(false);
      setIsAtBottom(true);
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      // If we are within 100px of the bottom, consider it "at bottom"
      const atBottom = scrollHeight - clientHeight - scrollTop < 100;
      setIsAtBottom(atBottom);
      if (atBottom) {
        setShowNewMessageNotification(false);
      }
    }
  };

  useEffect(() => {
    if (showChat) {
      if (isAtBottom) {
        scrollToBottom();
      } else {
        setShowNewMessageNotification(true);
      }
    }
  }, [chatMessages]);

  useEffect(() => {
    if (showChat) {
      scrollToBottom();
    }
  }, [showChat]);

  // Function to fetch current live video from YouTube API
  const fetchCurrentLiveVideo = async () => {
    if (!YOUTUBE_CHANNEL_ID || !YOUTUBE_API_KEY) {
      console.warn("YouTube API credentials not configured");
      return null;
    }

    setIsLoadingLiveStream(true);
    try {
      const searchUrl = new URL("https://www.googleapis.com/youtube/v3/search");
      searchUrl.searchParams.set("part", "snippet");
      searchUrl.searchParams.set("channelId", YOUTUBE_CHANNEL_ID);
      searchUrl.searchParams.set("eventType", "live");
      searchUrl.searchParams.set("type", "video");
      searchUrl.searchParams.set("key", YOUTUBE_API_KEY);
      searchUrl.searchParams.set("maxResults", "1");
      searchUrl.searchParams.set("order", "date");

      const response = await fetch(searchUrl.toString());
      const data = await response.json();

      if (data.items && data.items.length > 0) {
        const videoId = data.items[0].id.videoId;
        console.log("Found live video:", videoId);
        return videoId;
      }

      console.log("No live video currently streaming");
      return null;
    } catch (error) {
      console.error("Failed to fetch live video from YouTube:", error);
      return null;
    } finally {
      setIsLoadingLiveStream(false);
    }
  };

const streamQualities = [
  { quality: "1080p HD", bandwidth: "High" },
  { quality: "720p HD", bandwidth: "Medium" },
  { quality: "480p", bandwidth: "Low" },
  { quality: "Auto", bandwidth: "Adaptive" }
];

const [iframeKey, setIframeKey] = useState(0);
const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
const [externalSource, setExternalSource] = useState<string | null>(null);
const [searchParams] = useSearchParams();
const [iframeErrorHandled, setIframeErrorHandled] = useState(false);

// Helper: extract YouTube video id from various URL formats
const getYouTubeVideoId = (url: string) => {
  try {
    // direct id
    if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;
      // youtu.be short links
      const short = url.match(/youtu\.be\/([-_a-zA-Z0-9]{11})/);
    if (short) return short[1];
    // watch?v= links
    const watch = url.match(/[?&]v=([-_a-zA-Z0-9]{11})/);
    if (watch) return watch[1];
    // embed/ links
    const embed = url.match(/embed\/([-_a-zA-Z0-9]{11})/);
    if (embed) return embed[1];
      // live/<id> links
      const live = url.match(/live\/([-_a-zA-Z0-9]{11})/);
      if (live) return live[1];
    return null;
  } catch (e) {
    return null;
  }
};

const extractChannelHandle = (url: string) => {
  // get @handle from urls like https://www.youtube.com/@handle
  const m = url.match(/youtube\.com\/(?:@[-_a-zA-Z0-9]+)/);
  if (!m) return null;
  const handle = m[0].split('/').pop();
  return handle || null;
};

const handleQualityChange = (quality: string) => {
  setSelectedQuality(quality);
  // Force iframe to reload by changing key
  setIframeKey(prev => prev + 1);
};

  const renderMessage = (content: string) => {
    const regex = /\b(?:[1-3]\s+)?(?:[A-Z][a-z]+)\s+\d+:\d+(?:-\d+)?\b/g;
    const parts = content.split(regex);
    const matches = content.match(regex);

    if (!matches) return content;

    return (
      <>
        {parts.map((part, i) => (
          <span key={i}>
            {part}
            {matches[i] && <ScriptureReference reference={matches[i]} />}
          </span>
        ))}
      </>
    );
  };

  // Fetch services and live status
  useEffect(() => {
    const fetchData = async () => {
      // Fetch all services and determine live status client-side
      const { data: scheduleData, error } = await supabase
        .from('church_schedule')
        .select('*')
        .order('order_index', { ascending: true });
      
      if (!error && Array.isArray(scheduleData)) {
        setServices(scheduleData);
        const liveItem = scheduleData.find((item: any) => item.is_live === true);
        if (liveItem) {
          setLiveService(liveItem);
          setViewerCount(Math.floor(Math.random() * 500) + 1240);
        }
      } else if (error) {
        console.error("Error fetching live schedule:", error);
      }
    };
    fetchData();
  }, []);

// read optional `videoId` or `source` query params to pick a stream
useEffect(() => {
  const vid = searchParams.get("videoId");
  const source = searchParams.get("source");
  if (vid) {
    setSelectedVideoId(vid);
    setExternalSource(null);
    setIframeKey(k => k + 1);
    return;
  }
  if (source) {
    const decoded = decodeURIComponent(source);
    const id = getYouTubeVideoId(decoded);
    if (id) {
      setSelectedVideoId(id);
      setExternalSource(null);
      setIframeKey(k => k + 1);
      return;
    }
    // try channel handle -> use live_stream embed param (may work for channel handles)
    const handle = extractChannelHandle(decoded);
    if (handle) {
      // store the channel handle in externalSource so UI can attempt channel embed
      setExternalSource(`channel:${handle}`);
      setSelectedVideoId(null);
      setIframeKey(k => k + 1);
      return;
    }

    // unknown external source; show a link to open externally
    setExternalSource(decoded);
    setSelectedVideoId(null);
    setIframeKey(k => k + 1);
  }
}, [searchParams]);

  const handleSendMessage = () => {
    const text = chatMessage.trim();
    if (!text) return;

    const isHighlighted = isAdmin && isPinningMode;

    const payload = {
      user_name: displayName,
      message: text,
      is_highlighted: isHighlighted,
    };

    (async () => {
      const { error } = await supabase.from("live_messages" as any).insert([payload]);
      if (error) console.error("Failed to send message:", error);
      setChatMessage("");
      if (isPinningMode) setIsPinningMode(false);
    })();
  };

  const handleUnpin = async () => {
    if (!pinnedMessage) return;
    try {
      const { error } = await supabase
        .from("live_messages" as any)
        .update({ is_highlighted: false })
        .eq("id", pinnedMessage.id);
      if (error) throw error;
      setPinnedMessage(null);
    } catch (err) {
      console.error("Failed to unpin message:", err);
    }
  };

  // Fetch live video on component mount
  useEffect(() => {
    const initializeLiveStream = async () => {
      const liveVideoId = await fetchCurrentLiveVideo();
      if (liveVideoId) {
        setSelectedVideoId(liveVideoId);
        setExternalSource(null);
        setIframeKey(k => k + 1);
        console.log("Live stream initialized with video:", liveVideoId);
      } else {
        console.log("No live stream detected, using default or fallback");
      }
    };

    initializeLiveStream();
    
    if (liveService) {
      const id = getYouTubeVideoId(liveService.live_link);
      if (id) {
        setSelectedVideoId(id);
        setIframeKey(k => k + 1);
      }
    }

    // Refresh live status every 2 minutes
    const interval = setInterval(initializeLiveStream, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        const result = await verifyAdmin(session.user.email);
        if (result.success && result.data?.isAdmin) {
          setIsAdmin(true);
        }
      }
    };
    checkAdminStatus();

    // generate or reuse a guest display name
    let name = localStorage.getItem("moc_display_name");
    if (!name) {
      name = `Guest-${Math.floor(Math.random() * 9000) + 1000}`;
      localStorage.setItem("moc_display_name", name);
    }
    setDisplayName(name);

    let mounted = true;

    const loadRecent = async () => {
      const { data, error } = await supabase
        .from("live_messages" as any)
        .select("id,user_name,message,created_at,is_highlighted")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) return console.error("Error loading messages:", error);
      if (!mounted) return;
      
      const messages = (data as unknown || []) as Array<{id:string;user_name:string;message:string;created_at:string;is_highlighted:boolean}>;
      
      // Find the most recent highlighted message to pin
      const latestPinned = messages.find(m => m.is_highlighted);
      if (latestPinned) setPinnedMessage(latestPinned);
      
      setChatMessages(messages.reverse());
    };

    loadRecent();

    const channel = supabase
      .channel("public:live_messages")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "live_messages" }, (payload) => {
        const msg = payload.new as {id:string;user_name:string;message:string;created_at:string;is_highlighted:boolean};
        if (msg.is_highlighted) setPinnedMessage(msg);
        setChatMessages((prev) => [...prev, msg]);
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "live_messages" }, (payload) => {
        const msg = payload.new as any;
        if (!msg.is_highlighted) {
          setPinnedMessage(current => (current?.id === msg.id ? null : current));
        } else {
          setPinnedMessage(msg);
        }
      })
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const handlePrayerRequest = async () => {
    if (!prayerRequest.trim()) return;
    
    try {
      // Find user name if possible, otherwise use Guest
      const { data: { session } } = await supabase.auth.getSession();
      const name = session?.user?.user_metadata?.full_name || displayName;

      const { error } = await supabase
        .from("prayer_requests")
        .insert([{
          name: name,
          prayer_text: prayerRequest,
          status: 'received',
          method: 'live-page'
        }]);

      if (error) throw error;
      
      toast({
        title: "Prayer Request Sent",
        description: "Our prayer team has received your request and is praying with you.",
      });
      setPrayerRequest("");
      setShowPrayerModal(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen pt-16 bg-slate-950">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6 min-h-[calc(100vh-8rem)]">
          {/* Main Video Player */}
          <div className="lg:col-span-3 order-1 space-y-4">
            {liveService && (
              <div className="bg-red-600/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3 text-red-100 animate-in fade-in duration-500">
                <Radio className="w-5 h-5 animate-pulse text-red-500" />
                <div>
                  <span className="font-black text-sm uppercase tracking-tighter mr-2">LIVE:</span>
                  <span className="font-bold text-sm md:text-base tracking-tight">{liveService.title}</span>
                </div>
              </div>
            )}
            <Card className="border-0 shadow-2xl bg-black overflow-hidden rounded-xl">
              <div className="relative">
                {/* Video Player Area - YouTube Embed */}
                <div className="aspect-video bg-black flex items-center justify-center relative">
                  {/* Use the selected stream's videoId in a proper embed URL */}
                  {(() => {
                    // prefer an explicitly selected video id (via query param or clicking a link)
                    let src: string | null = null;
                    if (selectedVideoId) {
                      src = `https://www.youtube.com/embed/${selectedVideoId}?autoplay=1&rel=0`;
                    } else if (liveService) {
                      const dbVidId = getYouTubeVideoId(liveService.live_link);
                      if (dbVidId) src = `https://www.youtube.com/embed/${dbVidId}?autoplay=1&rel=0`;
                    } else if (externalSource && externalSource.startsWith("channel:")) {
                      const handle = externalSource.replace("channel:", "");
                      src = `https://www.youtube.com/embed/live_stream?channel=${encodeURIComponent(handle)}`;
                    } else if (!externalSource) {
                      src = `https://www.youtube.com/embed/yNB1h2ubyYM?autoplay=1&mute=1&rel=0`;
                    }

                    const embedNoCookie = src ? src.replace("youtube.com/embed", "youtube-nocookie.com/embed") : null;
                    const watchUrl = selectedVideoId ? `https://www.youtube.com/watch?v=${selectedVideoId}` : externalSource;

                    // Auto-open the watch URL if embedding fails and we haven't handled it yet
                    useEffect(() => {
                      if (iframeError && !iframeErrorHandled && watchUrl) {
                        try {
                          window.open(watchUrl, "_blank");
                        } catch (e) {
                          console.warn("Failed to auto-open watch URL", e);
                        }
                        setIframeErrorHandled(true);
                      }
                    }, [iframeError, iframeErrorHandled, watchUrl]);

                    return (
                      <>
                        {src ? (
                          <iframe
                            key={iframeKey}
                            className="w-full h-full"
                            src={src}
                            title="Sunday Service - Live"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; autoplay"
                            allowFullScreen
                            onLoad={() => { console.debug("iframe loaded", src); setIframeError(false); }}
                            onError={() => { console.debug("iframe error", src); setIframeError(true); }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-white mb-2">This stream cannot be embedded.</div>
                              {externalSource ? (
                                <div className="flex space-x-2 justify-center">
                                  <Button size="sm" onClick={() => window.open(externalSource, "_blank")}>Open External</Button>
                                </div>
                              ) : (
                                <div className="text-sm text-muted-foreground">No embeddable stream available.</div>
                              )}
                            </div>
                          </div>
                        )}

                        {iframeError && (
                          <div className="absolute inset-0 bg-black/70 z-20 flex flex-col items-center justify-center text-center p-4">
                            <div className="text-white font-semibold mb-2">Unable to play the stream.</div>
                            <div className="text-sm text-muted-foreground mb-4">Embedding was blocked — YouTube may have disabled embedding for this stream.</div>
                            <div className="flex flex-col sm:flex-row items-center gap-2">
                              <Button size="sm" onClick={() => { setIframeKey(k => k + 1); setIframeError(false); }}>Retry</Button>
                              {embedNoCookie && (
                                <Button size="sm" variant="outline" onClick={() => window.open(embedNoCookie, "_blank")}>Open Embed (nocookie)</Button>
                              )}
                              {watchUrl && (
                                <Button size="sm" variant="ghost" onClick={() => window.open(watchUrl, "_blank")}>Open on YouTube</Button>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground mt-3 break-words">Embed URL: {src}</div>
                          </div>
                        )}
                      </>
                    );
                  })()}
                  {/* Live Indicator */}
                  {(liveService || selectedVideoId) && (
                    <div className="absolute top-4 left-4 flex items-center space-x-2 z-10">
                      <Badge className="bg-red-600 text-white animate-pulse px-3 py-1">
                        ● LIVE
                      </Badge>
                      <Badge variant="secondary" className="bg-background/80">
                        <Users className="w-4 h-4 mr-1" />
                        {viewerCount.toLocaleString()} watching
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Stream Info Area */}
                <div className="p-6 bg-slate-900 border-t border-slate-800 text-white">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h2 className="text-xl font-bold mb-1">
                        {liveService?.title || (selectedVideoId ? "Special Broadcast" : "Fathers Heart Chapel Live")}
                      </h2>
                      <p className="text-slate-400 text-sm flex items-center gap-2">
                        <Radio className="w-3 h-3 text-red-500" />
                        Rev. Prince Appau Bediako
                        <span className="text-slate-600">•</span>
                        <span className="flex items-center gap-1"><Users size={12}/> {viewerCount.toLocaleString()} online</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-full px-6"
                        onClick={() => setShowPrayerModal(true)}
                      >
                        <Heart className="w-4 h-4 mr-2" />
                        I Need Prayer
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-slate-700 hover:bg-slate-800 rounded-full"
                        onClick={() => {
                          navigator.share({
                            title: "Join Our Live Service",
                            text: "Watch live worship and teaching",
                            url: window.location.href
                          }).catch(err => console.log("Error sharing:", err))
                        }}
                      >
                        <Share className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Service Details Card */}
            {(liveService?.description || liveService?.details) && (
              <Card className="border-0 shadow-xl bg-slate-900 text-white overflow-hidden rounded-xl">
                <CardHeader className="bg-slate-800/50 pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Info className="w-4 h-4 text-blue-400" />
                    About this Service
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 pb-6">
                  <p className="text-slate-300 leading-relaxed">{liveService.description}</p>
                  {liveService.details && <p className="text-slate-400 mt-2 text-sm italic">{liveService.details}</p>}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4 lg:space-y-6 order-2 lg:order-none">
            {/* Live Chat */}
            <Card className="border-0 shadow-2xl h-[450px] lg:h-[550px] flex flex-col bg-white rounded-xl overflow-hidden">
              <CardHeader className="pb-3 border-b border-border">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Live Chat
                  </CardTitle>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowChat(!showChat)}
                  >
                    {showChat ? <X className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
                  </Button>
                </div>
              </CardHeader>
              {showChat && (
                <CardContent className="flex flex-col flex-1 pb-0 overflow-hidden relative">
                  {/* Pinned Message Section */}
                  {pinnedMessage && (
                    <div className="mx-[-1.5rem] px-4 py-3 bg-blue-50 border-b border-blue-100 flex items-start gap-3 animate-in slide-in-from-top duration-300 z-20">
                      <div className="p-1.5 bg-blue-600 rounded-md text-white shrink-0">
                        <Pin size={14} className="fill-current" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-[10px] font-black text-blue-700 uppercase tracking-tighter">Pinned by Admin</span>
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] text-blue-400 font-bold">{new Date(pinnedMessage.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            {isAdmin && (
                              <button onClick={handleUnpin} className="text-blue-400 hover:text-blue-600 transition-colors">
                                <X size={12} />
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-slate-800 font-medium leading-relaxed italic">
                          "{renderMessage(pinnedMessage.message)}"
                        </p>
                      </div>
                    </div>
                  )}

                  {/* New Message Notification Bubble */}
                  {showNewMessageNotification && (
                    <div className="absolute bottom-20 left-0 right-0 flex justify-center z-30 pointer-events-none">
                      <Button 
                        size="sm" 
                        onClick={scrollToBottom}
                        className="pointer-events-auto bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center gap-2 animate-bounce h-8"
                      >
                        <ArrowDown size={14} /> New Messages
                      </Button>
                    </div>
                  )}
                  
                  {/* Messages */}
                  <div 
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="flex-1 overflow-y-auto space-y-3 mb-4 py-4 scrollbar-thin scrollbar-thumb-slate-200"
                  >
                    {chatMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-2.5 rounded-lg text-sm transition-all ${
                          msg.is_highlighted
                            ? "bg-primary/10 border border-primary/20"
                            : "bg-muted/50 hover:bg-muted"
                        }`}
                      >
                        <div className="font-bold text-blue-700 text-xs flex items-center justify-between">
                          {msg.user_name}
                          <span className="text-[10px] text-slate-400 font-normal">{new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                        <div className="text-foreground text-sm">{renderMessage(msg.message)}</div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Message Input */}
                  <div className="flex flex-col gap-2 pb-4 border-t border-border pt-3">
                    <div className="flex space-x-2">
                      {isAdmin && (
                        <Button
                          size="icon"
                          variant={isPinningMode ? "default" : "outline"}
                          onClick={() => setIsPinningMode(!isPinningMode)}
                          className={`shrink-0 ${isPinningMode ? 'bg-blue-600' : 'text-slate-400'}`}
                          title={isPinningMode ? "Unpin message" : "Pin message to top"}
                        >
                          <Pin size={16} />
                        </Button>
                      )}
                      <Input
                        placeholder={isPinningMode ? "Type pinned announcement..." : "Type message..."}
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                        className={`flex-1 text-sm ${isPinningMode ? 'border-blue-500 ring-1 ring-blue-500/20' : ''}`}
                      />
                    </div>
                    <Button 
                      size="sm" 
                      onClick={handleSendMessage}
                      className="px-3"
                    >
                      Send
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Community Connect */}
            <Card className="border-0 shadow-card bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-xl">
              <CardContent className="p-5 text-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-sm mb-1">New to MOC?</h3>
                <p className="text-xs text-blue-100 mb-4 opacity-90">We'd love to connect and welcome you to our family!</p>
                <Link to="/membership">
                  <Button size="sm" className="w-full bg-white text-blue-700 hover:bg-blue-50 font-bold rounded-full">
                    Join Our Family
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Give Offering */}
            <Link to="/give/offering" className="block">
              <Button className="w-full py-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:shadow-lg hover:scale-[1.02] transition-all font-black text-base rounded-xl shadow-md">
                <Heart className="w-5 h-5 mr-2 fill-current" />
                GIVE OFFERING
              </Button>
            </Link>

            {/* Quick Actions */}
            <Card className="border-0 shadow-card">
              <CardContent className="p-4 space-y-3">
                <Link to="/partnership" className="block">
                  <Button variant="outline" className="w-full border-slate-200 text-slate-700 hover:bg-slate-50 font-bold">
                    <Heart className="w-4 h-4 mr-2" /> Partnership
                  </Button>
                </Link>
                <Link to="/resources" className="block">
                  <Button variant="outline" className="w-full border-slate-200 text-slate-700 hover:bg-slate-50 font-bold">
                    <Settings className="w-4 h-4 mr-2" /> Study Materials
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Upcoming Services */}
            <Card className="border-0 shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  Weekly Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {services.slice(0, 4).map((service, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border transition-all ${
                      service.is_live
                        ? "border-red-500 bg-red-500/5 shadow-sm"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <div className="font-semibold text-sm">{service.title}</div>
                      {service.is_live && <Badge className="bg-red-600 text-[10px] h-4">LIVE</Badge>}
                    </div>
                    <div className="text-blue-600 text-xs font-bold">{service.day} • {service.time_string}</div>
                  </div>
                ))}
                <Link to="/services">
                  <Button variant="outline" className="w-full" size="sm">
                    View Full Schedule
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Notification Signup */}
            <NotificationSignup
              variant="card"
              title="Never Miss a Stream"
              description="Get notifications about upcoming livestreams and programs"
              defaultNotificationType="livestream"
            />
          </div>
        </div>
      </div>

      {/* Prayer Request Modal */}
      {showPrayerModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md border-0 shadow-divine">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-border">
              <CardTitle>Submit Prayer Request</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPrayerModal(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Your Prayer Request</label>
                <textarea
                  placeholder="Share your prayer request..."
                  value={prayerRequest}
                  onChange={(e) => setPrayerRequest(e.target.value)}
                  className="min-h-24 w-full px-3 py-2 rounded-md border border-input bg-background text-foreground placeholder-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowPrayerModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-primary hover:bg-primary/90"
                  onClick={handlePrayerRequest}
                >
                  Submit
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default LivePage;
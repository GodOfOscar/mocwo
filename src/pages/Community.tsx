import { useState, useEffect, useRef, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageSquare, 
  Heart, 
  Star, 
  Users, 
  Megaphone, 
  Flame, 
  Share2, 
  Image as ImageIcon,
  MoreHorizontal,
  Search,
  Info,
  Lock,
  UserPlus,
  UserCheck,
  UserMinus,
  ChevronRight,
  PlusSquare,
  Send,
  Paperclip,
  ShieldCheck,
  Check,
  XCircle,
  Clock,
  Loader2,
  Home
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { 
  Link, 
  useSearchParams 
} from "react-router-dom";
import { NotificationsDropdown } from "./NotificationsDropdown";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const Community = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [newPost, setNewPost] = useState("");
  const [selectedTab, setSelectedTab] = useState("feed");
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State management for user profiles and group filtering
  const [currentUser, setCurrentUser] = useState<{ full_name: string; avatar_url: string } | null>(null);
  const [groupSearch, setGroupSearch] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  
  // State for group chat
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [newChatMessage, setNewChatMessage] = useState("");
  const [activeGroupTab, setActiveGroupTab] = useState("about");
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const postCreatorRef = useRef<HTMLDivElement>(null);
  const chatFileInputRef = useRef<HTMLInputElement>(null);

  // State for group membership and management
  const [joinedGroupIds, setJoinedGroupIds] = useState<string[]>([]);
  const [managedGroups, setManagedGroups] = useState<any[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);

  // State for announcement posting
  const [announcementContent, setAnnouncementContent] = useState("");
  const [announcementGroupId, setAnnouncementGroupId] = useState<string | "">("");

  // State for group membership details
  const [membershipStatus, setMembershipStatus] = useState<string | null>(null);
  const [groupMembers, setGroupMembers] = useState<any[]>([]);
  const [groupEvents, setGroupEvents] = useState<any[]>([]);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // State for the 'About Group' information modal
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [groupToView, setGroupToView] = useState<any>(null);
  
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchGroups();
    fetchPosts();
    fetchAnnouncements();
    fetchCurrentUser();
  }, [selectedTab, selectedGroupId, joinedGroupIds.length]);

  useEffect(() => {
    if (aboutModalOpen && groupToView) {
      checkMembership(groupToView.id);
      fetchGroupMembers(groupToView.id);
      fetchGroupEvents(groupToView.id);
      setActiveGroupTab("about");
    }
  }, [aboutModalOpen, groupToView]);

  const fetchCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', user.id)
        .single();
      if (data) setCurrentUser({ ...data, id: user.id } as any);

      // Fetch groups the current user has joined
      const { data: joined } = await supabase
        .from('group_members')
        .select('group_id')
        .eq('user_id', user.id)
        .eq('status', 'approved');
      if (joined) setJoinedGroupIds(joined.map(m => m.group_id));

      // Fetch groups where the user is a coordinator (admin)
      const { data: managed } = await supabase
        .from('group_members')
        .select('group_id, community_groups(name)')
        .eq('user_id', user.id)
        .eq('role', 'admin');
      if (managed) {
        setManagedGroups(managed);
        fetchPendingRequests(managed.map(m => m.group_id));
      }
    }
  };

  useEffect(() => {
    let channel: any;

    const subscribeToNotifications = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Listen for new notifications belonging to the current user
      channel = supabase
        .channel(`user-notifications-${user.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`,
          },
          (payload: any) => {
            const type = payload.new.type;
            let title = "New Interaction! ❤️";
            let description = "Someone liked your post.";

            if (type === 'comment') {
              title = "New Comment! 💬";
              description = "Someone commented on your post.";
            } else if (type === 'message') {
              title = "New Group Message! 📩";
              description = "There is a new message in your ministry group.";
              // Optional: Play a sound or request browser notification permission here
              if (Notification.permission === "granted") new Notification(title, { body: description });
            }

            toast({ title, description });
          }
        )
        .subscribe();
    };

    subscribeToNotifications();
    return () => { if (channel) supabase.removeChannel(channel); };
  }, []);

  const fetchGroups = async () => {
    const { data } = await supabase.from('community_groups').select('*');
    if (data) setGroups(data);
  };

  const fetchPosts = async () => {
    if (selectedTab === 'manage') return;

    let query = supabase
      .from('community_posts')
      .select('*, author:profiles(full_name, avatar_url), post_likes(count), post_comments(count)')
      .order('created_at', { ascending: false });

    if (selectedTab === 'testimonies') {
      query = query.eq('post_type', 'testimony');
    } else if (selectedTab === 'youth') {
      query = query.eq('post_type', 'youth');
    } else if (selectedTab === 'feed' && !selectedGroupId) {
      // Main community feed shows only posts from joined groups
      if (joinedGroupIds.length > 0) {
        query = query.in('group_id', joinedGroupIds);
      } else {
        setPosts([]);
        return;
      }
    }
    
    if (selectedGroupId) {
      query = query.eq('group_id', selectedGroupId);
    }
    
    const { data } = await query;
    if (data) setPosts(data);
  };

  const fetchPendingRequests = async (groupIds: string[]) => {
    if (groupIds.length === 0) return;
    const { data } = await supabase
      .from('group_members')
      .select('*, profiles(full_name, avatar_url), community_groups(name)')
      .in('group_id', groupIds)
      .eq('status', 'pending');
    if (data) setPendingRequests(data);
  };

  const fetchAnnouncements = async () => {
    const { data } = await supabase.from('announcements').select('*').eq('is_active', true).limit(3);
    if (data) setAnnouncements(data);
  };

  const handlePostSubmit = async () => {
    if (!newPost.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from('community_posts').insert([{
      content: newPost,
      post_type: selectedTab === 'testimonies' ? 'testimony' : 'discussion',
      user_id: user.id
    }]);

    if (!error) {
      setNewPost("");
      fetchPosts();
      toast({ title: "Post published!", description: "Your message is live in the community." });
    }
  };

  const filteredGroups = groups.filter(group => 
    group.name.toLowerCase().includes(groupSearch.toLowerCase())
  );

  const checkMembership = async (groupId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    const { data } = await supabase
      .from('group_members')
      .select('status')
      .eq('group_id', groupId)
      .eq('user_id', user.id)
      .maybeSingle();
    
    setMembershipStatus(data?.status || null);
  };

  const fetchGroupMembers = async (groupId: string) => {
    const { data } = await supabase
      .from('group_members')
      .select('*, profiles(full_name, avatar_url)')
      .eq('group_id', groupId)
      .eq('status', 'approved')
      .limit(15);
    
    if (data) setGroupMembers(data);
  };

  const fetchGroupEvents = async (groupId: string) => {
    const { data } = await supabase
      .from('events')
      .select('*')
      .eq('group_id', groupId)
      .eq('is_active', true)
      .order('start_date', { ascending: true });
    if (data) setGroupEvents(data);
  };

  const handleJoinGroup = async () => {
    if (!groupToView) return;
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ 
        title: "Sign in required", 
        description: "Please log in to join groups.", 
        variant: "destructive" 
      });
      return;
    }

    setIsActionLoading(true);
    const isPrivate = groupToView.is_private;

    const { error } = await supabase
      .from('group_members')
      .insert([{
        group_id: groupToView.id,
        user_id: user.id,
        status: isPrivate ? 'pending' : 'approved'
      }]);

    if (!error) {
      toast({ 
        title: isPrivate ? "Request sent!" : "Joined successfully!", 
        description: isPrivate ? "The group coordinator will review your request." : `Welcome to ${groupToView.name}!`
      });
      checkMembership(groupToView.id);
    }
    setIsActionLoading(false);
  };

  const handleLeaveGroup = async () => {
    if (!groupToView || !currentUser) return;
    if (!confirm(`Are you sure you want to leave ${groupToView.name}?`)) return;

    setIsActionLoading(true);
    const { error } = await supabase
      .from('group_members')
      .delete()
      .eq('group_id', groupToView.id)
      .eq('user_id', (currentUser as any).id);

    if (!error) {
      toast({ title: "Left group", description: `You are no longer a member of ${groupToView.name}.` });
      checkMembership(groupToView.id);
      fetchCurrentUser();
    }
    setIsActionLoading(false);
  };

  const fetchChatMessages = async (groupId: string) => {
    const { data } = await supabase
      .from('group_chat_messages')
      .select('*, profiles(full_name, avatar_url)')
      .eq('group_id', groupId)
      .order('created_at', { ascending: true })
      .limit(50);
    if (data) setChatMessages(data);
  };

  const handleSendChatMessage = async () => {
    if (!newChatMessage.trim() || !groupToView) return;
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from('group_chat_messages').insert([{
      content: newChatMessage,
      group_id: groupToView.id,
      user_id: user.id
    }]);

    if (!error) {
      setNewChatMessage("");
      fetchChatMessages(groupToView.id);
    }
  };

  const handleChatImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !groupToView || !currentUser) return;

    setIsActionLoading(true);
    try {
      const fileName = `chat/${groupToView.id}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('media-files')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from('media-files').getPublicUrl(fileName);
      
      const { error: msgError } = await supabase.from('group_chat_messages').insert([{
        content: "Shared a photo",
        image_url: urlData.publicUrl,
        group_id: groupToView.id,
        user_id: (currentUser as any).id
      }]);

      if (msgError) throw msgError;
      fetchChatMessages(groupToView.id);
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleAnnouncementSubmit = async () => {
    if (!announcementContent.trim() || !announcementGroupId) return;
    setIsActionLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from('community_posts').insert([{
      content: announcementContent,
      group_id: announcementGroupId,
      post_type: 'announcement',
      user_id: user.id
    }]);

    if (!error) {
      setAnnouncementContent("");
      setAnnouncementGroupId("");
      fetchPosts();
      toast({ title: "Announcement posted!", description: "Members of the group will see this in their feed." });
    }
    setIsActionLoading(false);
  };

  const handleRequestAction = async (requestId: string, approve: boolean) => {
    setIsActionLoading(true);
    if (approve) {
      await supabase.from('group_members').update({ status: 'approved' }).eq('id', requestId);
    } else {
      await supabase.from('group_members').delete().eq('id', requestId);
    }
    
    const { data: { user } } = await supabase.auth.getUser();
    if (user) await fetchCurrentUser(); // Refresh data to update joined lists and pending count
    toast({ 
      title: approve ? "Request approved!" : "Request declined", 
      description: approve ? "The member has been added to the group." : "The request was removed." 
    });
    setIsActionLoading(false);
  };

  const handleInvite = (group: any) => {
    const inviteUrl = `${window.location.origin}/community?groupId=${group.id}`;
    navigator.clipboard.writeText(inviteUrl);
    toast({ 
      title: "Invite link copied! 🔗", 
      description: "Share this link with friends to invite them to the group." 
    });
  };

  const startPress = (group: any) => {
    longPressTimer.current = setTimeout(() => {
      setGroupToView(group);
      setAboutModalOpen(true);
    }, 600); // Threshold for long press
  };

  const endPress = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
  };

  const handleLike = async (postId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ 
        title: "Sign in required", 
        description: "Please log in to like posts.", 
        variant: "destructive" 
      });
      return;
    }

    const { error } = await supabase.from('post_likes').insert([{
      post_id: postId,
      user_id: user.id
    }]);

    if (error && error.code === '23505') {
      // User already liked, so we unlike it
      await supabase.from('post_likes').delete().match({ post_id: postId, user_id: user.id });
    }
    
    fetchPosts();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Community Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-30">
        <div className="container mx-auto px-4 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            <Link to="/" className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-blue-600 flex-shrink-0" title="Back to Home">
              <Home size={20} />
            </Link>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight truncate">
              The Martyrs World
            </h2>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden text-slate-500 hover:text-blue-600"
              onClick={() => postCreatorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
              title="Create Post"
            >
              <PlusSquare size={22} />
            </Button>
            <NotificationsDropdown />
            <Link to="/profile" className="flex-shrink-0 hover:opacity-80 transition-opacity">
              {currentUser?.avatar_url ? (
                <img src={currentUser.avatar_url} className="w-9 h-9 rounded-full object-cover border-2 border-slate-100" alt="Profile" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center text-white text-[11px] font-black">
                  {currentUser?.full_name?.[0] || 'U'}
                </div>
              )}
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Groups Navigation: Horizontal on mobile, Vertical Sidebar on desktop */}
          <div className="lg:col-span-3">
            <Card className="border-0 shadow-sm rounded-2xl lg:sticky lg:top-20">
              <CardHeader className="pb-2 hidden lg:block">
                <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400">Groups</CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                {/* Groups Search Bar */}
                <div className="px-2 pb-3 mb-2 border-b border-slate-50 lg:block hidden">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search groups..."
                      className="pl-9 h-9 text-xs bg-slate-50 border-none rounded-lg focus-visible:ring-1 focus-visible:ring-blue-100"
                      value={groupSearch}
                      onChange={(e) => setGroupSearch(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex lg:flex-col gap-2 lg:gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  {filteredGroups.map((group) => (
                    <Button 
                      key={group.id} 
                      variant="ghost" 
                      onClick={() => setSelectedGroupId(selectedGroupId === group.id ? null : group.id)}
                      onPointerDown={() => startPress(group)}
                      onPointerUp={endPress}
                      onPointerLeave={endPress}
                      className={`flex-shrink-0 lg:w-full justify-between gap-3 h-10 lg:h-12 rounded-xl font-bold px-4 lg:px-3 transition-all group/btn ${
                        selectedGroupId === group.id 
                          ? "bg-blue-50 text-blue-700 hover:bg-blue-100 shadow-sm" 
                          : "hover:bg-blue-50 text-slate-700 hover:text-blue-700"
                      }`}
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className={`w-7 h-7 lg:w-8 lg:h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                          selectedGroupId === group.id ? "bg-blue-600 text-white shadow-inner" : "bg-blue-100"
                        }`}>
                          <Users size={14} className="lg:size-4" />
                        </div>
                        <span className="whitespace-nowrap truncate">{group.name}</span>
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setGroupToView(group);
                          setAboutModalOpen(true);
                        }}
                        className="p-1 rounded-full hover:bg-slate-200/50 text-slate-400 hover:text-blue-600 transition-colors lg:block hidden"
                        title="Group information"
                      >
                        <Info size={14} />
                      </button>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Center Column: Feed */}
          <div className="lg:col-span-6 space-y-6">
            {/* Post Creator */}
            <Card ref={postCreatorRef} className="border-0 shadow-md rounded-2xl overflow-hidden scroll-mt-20">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex-shrink-0" />
                  <div className="flex-1 space-y-4">
                    <Textarea 
                      placeholder={selectedTab === 'testimonies' ? "Share what God has done..." : "What's on your mind?"}
                      className="border-none bg-slate-50 focus-visible:ring-0 text-lg resize-none min-h-[100px] rounded-xl"
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                    />
                    <div className="flex justify-between items-center pt-2 border-t">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="text-slate-500 gap-2"><ImageIcon size={18} /> Photo</Button>
                        <Button variant="ghost" size="sm" className="text-slate-500 gap-2"><Flame size={18} /> Tag</Button>
                      </div>
                      <Button onClick={handlePostSubmit} className="bg-blue-600 hover:bg-blue-700 rounded-full px-6 font-bold">Post</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feed Navigation */}
            <Tabs defaultValue="feed" onValueChange={setSelectedTab} className="w-full">
              <TabsList className="bg-white p-1 rounded-xl shadow-sm w-full justify-between h-14">
                <TabsTrigger value="feed" className="flex-1 rounded-lg gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"><MessageSquare size={18} /> Feed</TabsTrigger>
                <TabsTrigger value="testimonies" className="flex-1 rounded-lg gap-2 data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700"><Star size={18} /> Testimonies</TabsTrigger>
                <TabsTrigger value="youth" className="flex-1 rounded-lg gap-2 data-[state=active]:bg-orange-50 data-[state=active]:text-orange-700"><Flame size={18} /> Youth</TabsTrigger>
                {managedGroups.length > 0 && (
                  <TabsTrigger value="manage" className="flex-1 rounded-lg gap-2 data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700"><ShieldCheck size={18} /> Management</TabsTrigger>
                )}
              </TabsList>

              <div className="mt-6 space-y-6">
                {selectedTab !== 'manage' ? (
                  posts.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-slate-200">
                      <p className="text-slate-400 font-medium">
                        {selectedTab === 'feed' && !selectedGroupId ? "Join some groups to see posts in your feed!" : "No posts found for this selection."}
                      </p>
                    </div>
                  ) : (
                    posts.map((post) => (
                  <Card key={post.id} className="border-0 shadow-sm rounded-2xl group animate-in fade-in slide-in-from-bottom-4">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-200" />
                          <div>
                            <h4 className="font-bold text-slate-900">Member</h4>
                            <p className="text-xs text-slate-500">2 hours ago</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="rounded-full text-slate-400"><MoreHorizontal size={20}/></Button>
                      </div>
                      
                      <div className="space-y-4">
                        {post.post_type === 'testimony' && (
                          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-black uppercase tracking-tighter">
                            <Star size={12} className="fill-current" /> Testimony
                          </div>
                        )}
                        {post.post_type === 'announcement' && (
                          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-black uppercase tracking-tighter mb-2">
                            <Megaphone size={12} className="fill-current" /> Official Update
                          </div>
                        )}
                        <p className="text-slate-800 leading-relaxed">{post.content}</p>
                      </div>

                      <div className="flex items-center gap-6 mt-6 pt-4 border-t text-slate-500">
                        <button 
                          onClick={() => handleLike(post.id)}
                          className="flex items-center gap-2 hover:text-red-500 transition-colors"
                        >
                          <Heart size={20} /> <span className="text-sm font-bold">{post.post_likes?.[0]?.count || 0}</span>
                        </button>
                        <button className="flex items-center gap-2 hover:text-blue-500 transition-colors">
                          <MessageSquare size={20} /> <span className="text-sm font-bold">{post.post_comments?.[0]?.count || 0}</span>
                        </button>
                        <button className="flex items-center gap-2 hover:text-slate-900 transition-colors ml-auto">
                          <Share2 size={20} />
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                    ))
                  )
                ) : (
                  <div className="space-y-4">
                    {/* Announcement Form for Coordinators */}
                    <Card className="border-0 shadow-sm rounded-2xl mb-8 bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                          <Megaphone className="text-purple-600" size={20} />
                          Post Group Announcement
                        </h3>
                        <div className="space-y-4">
                          <Select value={announcementGroupId} onValueChange={setAnnouncementGroupId}>
                            <SelectTrigger className="w-full bg-white border-slate-200 h-11 rounded-xl">
                              <SelectValue placeholder="Select a group to update..." />
                            </SelectTrigger>
                            <SelectContent>
                              {managedGroups.map((m) => (
                                <SelectItem key={m.group_id} value={m.group_id}>
                                  {m.community_groups?.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Textarea 
                            placeholder="Post an official update to members..."
                            className="bg-white border-slate-200 rounded-xl resize-none min-h-[80px] focus-visible:ring-purple-200"
                            value={announcementContent}
                            onChange={(e) => setAnnouncementContent(e.target.value)}
                          />
                          <div className="flex justify-end">
                            <Button 
                              onClick={handleAnnouncementSubmit}
                              disabled={isActionLoading || !announcementContent || !announcementGroupId}
                              className="bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl px-8"
                            >
                              {isActionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Post Update"}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <h3 className="text-lg font-black text-slate-900 px-2 flex items-center gap-2">
                      Pending Membership Requests
                      <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 border-0">{pendingRequests.length}</Badge>
                    </h3>
                    {pendingRequests.length === 0 ? (
                      <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-slate-200">
                        <p className="text-slate-400 font-medium">You're all caught up! No pending membership requests.</p>
                      </div>
                    ) : (
                      pendingRequests.map((req) => (
                        <Card key={req.id} className="border-0 shadow-sm rounded-2xl overflow-hidden group">
                          <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {req.profiles?.avatar_url ? (
                                <img src={req.profiles.avatar_url} className="w-12 h-12 rounded-full object-cover border border-slate-100" />
                              ) : (
                                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                                  {req.profiles?.full_name?.[0] || 'U'}
                                </div>
                              )}
                              <div>
                                <p className="font-bold text-slate-900">{req.profiles?.full_name || 'Member'}</p>
                                <p className="text-xs text-blue-600 font-bold">Request for: {req.community_groups?.name}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                onClick={() => handleRequestAction(req.id, true)}
                                className="bg-green-600 hover:bg-green-700 rounded-xl h-10 px-4"
                                disabled={isActionLoading}
                              >
                                <Check size={18} className="mr-2" /> Approve
                              </Button>
                              <Button 
                                onClick={() => handleRequestAction(req.id, false)}
                                variant="outline"
                                className="text-red-600 hover:bg-red-50 border-red-100 rounded-xl h-10 px-4"
                                disabled={isActionLoading}
                              >
                                <XCircle size={18} className="mr-2" /> Decline
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                )}
              </div>
            </Tabs>
          </div>

          {/* Right Sidebar: Announcements */}
          <div className="lg:col-span-3 space-y-6">
            <Card className="border-0 shadow-sm rounded-2xl bg-gradient-to-br from-blue-900 to-blue-950 text-white">
              <CardHeader>
                <div className="flex items-center gap-2 mb-1">
                  <Megaphone className="text-blue-400" size={20} />
                  <CardTitle className="text-sm font-black uppercase tracking-widest opacity-70">Announcements</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {announcements.map((ann) => (
                  <div key={ann.id} className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                    <h5 className="font-bold text-sm mb-1">{ann.title}</h5>
                    <p className="text-xs opacity-70 line-clamp-2">{ann.content}</p>
                  </div>
                ))}
                <Button variant="outline" className="w-full border-white/20 hover:bg-white/10 text-white text-xs font-bold rounded-xl h-10">
                  View All Updates
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm rounded-2xl">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">
                  <Flame size={24} />
                </div>
                <h4 className="font-bold text-slate-900">Youth Night</h4>
                <p className="text-xs text-slate-500">Every Friday @ 6:00 PM in the Main Sanctuary.</p>
                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl">Join Us</Button>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>

      <Dialog open={aboutModalOpen} onOpenChange={setAboutModalOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl border-0 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-slate-900">
              About {groupToView?.name}
            </DialogTitle>
            <DialogDescription className="capitalize font-bold text-blue-600 flex items-center gap-2">
              {groupToView?.group_type} Group
              {groupToView?.is_private && <span className="text-[10px] px-2 py-0.5 uppercase font-black tracking-tighter bg-amber-50 text-amber-700 border border-amber-200 rounded-full">Private</span>}
            </DialogDescription>
          </DialogHeader>
          <Tabs value={activeGroupTab} onValueChange={setActiveGroupTab} className="w-full mt-2">
            <TabsList className="w-full grid grid-cols-4 mb-6 bg-slate-50 p-1 rounded-2xl h-12">
              <TabsTrigger value="about" className="rounded-xl font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">About</TabsTrigger>
              <TabsTrigger value="members" className="rounded-xl font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">Members</TabsTrigger>
              <TabsTrigger value="events" className="rounded-xl font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">Events</TabsTrigger>
              <TabsTrigger value="chat" disabled={membershipStatus !== 'approved'} className="rounded-xl font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">Chat</TabsTrigger>
            </TabsList>
            
            <TabsContent value="about" className="space-y-4 focus-visible:ring-0">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 min-h-[120px]">
                <p className="text-slate-700 leading-relaxed text-sm">
                  {groupToView?.description || "No description available for this group. Join the conversation and connect with other members to learn more about our mission."}
                </p>
              </div>
              {groupToView?.is_private && (
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-50/50 p-3 rounded-xl border border-amber-100">
                  <Lock size={12} />
                  Membership requires coordinator approval
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="members" className="focus-visible:ring-0">
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar min-h-[120px]">
                {groupMembers.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-sm italic">No visible members yet</div>
                ) : (
                  groupMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between group/member">
                      <div className="flex items-center gap-3">
                        {member.profiles?.avatar_url ? (
                          <img src={member.profiles.avatar_url} className="w-10 h-10 rounded-full object-cover border border-slate-100" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                            {member.profiles?.full_name?.[0] || 'U'}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{member.profiles?.full_name || 'Member'}</p>
                          <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">{member.role}</p>
                        </div>
                      </div>
                      <button className="text-blue-600 opacity-0 group-hover/member:opacity-100 transition-opacity">
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="events" className="focus-visible:ring-0">
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar min-h-[120px]">
                {groupEvents.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-sm italic">No upcoming events for this group.</div>
                ) : (
                  groupEvents.map((event) => (
                    <Card key={event.id} className="border-0 shadow-sm bg-slate-50 rounded-2xl overflow-hidden group/event">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex flex-col items-center justify-center shadow-sm">
                            <span className="text-[10px] font-black text-blue-600 uppercase leading-none">{new Date(event.start_date).toLocaleString('default', { month: 'short' })}</span>
                            <span className="text-sm font-black text-slate-900 leading-none mt-0.5">{new Date(event.start_date).getDate()}</span>
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{event.title}</p>
                            <p className="text-[10px] text-slate-500 flex items-center gap-1"><MapPin size={10}/> {event.location}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="chat" className="focus-visible:ring-0">
              <div className="flex flex-col h-[350px]">
                <div 
                  ref={chatScrollRef}
                  className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4 custom-scrollbar"
                >
                  {chatMessages.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-slate-400 text-sm italic">
                      Start the conversation!
                    </div>
                  ) : (
                    chatMessages.map((msg) => (
                      <div key={msg.id} className={`flex items-start gap-3 ${msg.user_id === currentUser?.id ? 'flex-row-reverse' : ''}`}>
                        {msg.profiles?.avatar_url ? (
                          <img src={msg.profiles.avatar_url} className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">
                            {msg.profiles?.full_name?.[0] || 'U'}
                          </div>
                        )}
                        <div className={`flex flex-col ${msg.user_id === currentUser?.id ? 'items-end' : ''}`}>
                          <span className="text-[10px] font-bold text-slate-400 mb-1">{msg.profiles?.full_name}</span>
                          <div className={`px-4 py-2 rounded-2xl text-sm ${
                            msg.user_id === currentUser?.id 
                              ? 'bg-blue-600 text-white rounded-tr-none' 
                              : 'bg-slate-100 text-slate-800 rounded-tl-none'
                          }`}>
                            {msg.image_url && (
                              <img src={msg.image_url} alt="" className="max-w-full rounded-lg mb-2 cursor-pointer hover:opacity-90 transition-opacity" onClick={() => window.open(msg.image_url, '_blank')} />
                            )}
                            {msg.content}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="flex gap-2 bg-slate-50 p-2 rounded-2xl">
                  <input 
                    type="file" 
                    ref={chatFileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleChatImageUpload} 
                  />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-xl text-slate-400 hover:text-blue-600"
                    onClick={() => chatFileInputRef.current?.click()}
                    disabled={isActionLoading}
                  >
                    <Paperclip size={18} />
                  </Button>
                  <Input 
                    value={newChatMessage}
                    onChange={(e) => setNewChatMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
                    placeholder="Type a message..."
                    className="border-none bg-transparent focus-visible:ring-0"
                  />
                  <Button onClick={handleSendChatMessage} size="icon" className="rounded-xl bg-blue-600">
                    <Send size={18} />
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex gap-3 mt-4">
            {membershipStatus === 'approved' ? (
              <Button 
                onClick={handleLeaveGroup}
                disabled={isActionLoading}
                variant="outline"
                className="flex-1 border-red-100 text-red-600 hover:bg-red-50 rounded-full font-bold group/leave"
              >
                {isActionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                  <><UserMinus className="mr-2 h-4 w-4" /> Leave Group</>
                )}
              </Button>
            ) : membershipStatus === 'pending' ? (
              <Button disabled className="flex-1 bg-amber-50 text-amber-700 border border-amber-100 rounded-full font-bold">
                <Clock className="mr-2 h-4 w-4 animate-pulse" /> Request Pending
              </Button>
            ) : (
              <Button 
                onClick={handleJoinGroup}
                disabled={isActionLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 rounded-full font-bold shadow-lg"
              >
                {isActionLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <><UserPlus className="mr-2 h-4 w-4" /> {groupToView?.is_private ? 'Request to Join' : 'Join Group'}</>
                )}
              </Button>
            )}
            <Button 
              variant="outline"
              onClick={() => handleInvite(groupToView)}
              className="flex-1 rounded-full font-bold border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              <Share2 className="mr-2 h-4 w-4" /> Invite
            </Button>
            <Button 
              variant="outline"
              onClick={() => setAboutModalOpen(false)}
              className="flex-1 rounded-full font-bold border-slate-200"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Community;
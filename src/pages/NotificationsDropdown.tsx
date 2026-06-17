import { useState, useEffect } from "react";
import { Bell, Heart, MessageSquare, CheckCheck, Circle, PlusCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const NotificationsDropdown = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { toast } = useToast();

  const fetchNotifications = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('notifications')
      .select('*, actor:actor_id(full_name, avatar_url)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (data) {
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.is_read).length);
    }
  };

  const markAllAsRead = async () => {
    const { error } = await supabase.rpc('mark_all_notifications_read');
    if (!error) {
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
      toast({ title: "Notifications cleared", description: "All messages marked as read." });
    }
  };

  const markAsRead = async (id: string) => {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    fetchNotifications();
  };

  useEffect(() => {
    fetchNotifications();

    // Real-time listener for new notifications
    const setupSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const channel = supabase
        .channel('schema-db-changes')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
          () => fetchNotifications()
        )
        .subscribe();

      return () => { supabase.removeChannel(channel); };
    };

    setupSubscription();
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-slate-100">
          <Bell size={22} className="text-slate-600" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 px-1.5 min-w-[1.2rem] h-5 flex items-center justify-center bg-red-500 hover:bg-red-600 border-2 border-white text-[10px] font-bold rounded-full">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 p-0 rounded-2xl shadow-xl border-slate-100" align="end">
        <div className="flex items-center justify-between p-4">
          <DropdownMenuLabel className="p-0 font-black text-slate-900">Notifications</DropdownMenuLabel>
          <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-8 text-xs font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 gap-1">
            <CheckCheck size={14} /> Mark all read
          </Button>
        </div>
        <DropdownMenuSeparator className="m-0" />
        <div className="max-h-[400px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm italic">No recent activity</div>
          ) : (
            notifications.map((n) => (
              <DropdownMenuItem key={n.id} onClick={() => markAsRead(n.id)} className={`p-4 cursor-pointer focus:bg-slate-50 border-b border-slate-50 last:border-0 ${!n.is_read ? 'bg-blue-50/30' : ''}`}>
                <div className="flex gap-3 items-start w-full">
                  <div className="relative flex-shrink-0">
                    {n.actor?.avatar_url ? (
                      <img src={n.actor.avatar_url} alt="" className="w-9 h-9 rounded-full object-cover border border-slate-100 shadow-sm" />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-[10px] font-black text-slate-500 border border-slate-200">
                        {n.actor?.full_name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || '?'}
                      </div>
                    )}
                    <div className={`absolute -bottom-1 -right-1 p-1 rounded-full border-2 border-white shadow-sm ${
                      n.type === 'like' ? 'bg-red-500 text-white' : 
                      n.type === 'comment' ? 'bg-blue-500 text-white' : 
                      n.type === 'message' ? 'bg-green-500 text-white' : 
                      'bg-green-500 text-white'
                    }`}>
                      {n.type === 'like' ? <Heart size={8} fill="currentColor" /> : 
                       n.type === 'comment' ? <MessageSquare size={8} /> : 
                       n.type === 'message' ? <MessageSquare size={8} /> : 
                       <PlusCircle size={8} />}
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-800 font-medium leading-tight">
                      <span className="font-bold text-slate-950">{n.actor?.full_name || 'A member'}</span> 
                      {n.type === 'like' ? ' liked your post.' : 
                       n.type === 'comment' ? ' commented on your post.' : 
                       n.type === 'message' ? ' sent a message to the group.' : 
                       ' shared a new post.'}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">{new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  {!n.is_read && <Circle size={8} className="fill-blue-600 text-blue-600 mt-2" />}
                </div>
              </DropdownMenuItem>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
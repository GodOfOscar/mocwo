import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { subscribeToNotifications } from "@/lib/notifications";
import { Bell } from "lucide-react";

interface NotificationSignupProps {
  title?: string;
  description?: string;
  variant?: "default" | "compact" | "card";
  defaultNotificationType?: "livestream" | "programs" | "all";
  onSuccess?: () => void;
}

export const NotificationSignup = ({
  title = "Get Notified",
  description = "Be the first to know about upcoming livestreams and programs",
  variant = "default",
  defaultNotificationType = "all",
  onSuccess,
}: NotificationSignupProps) => {
  const [email, setEmail] = useState("");
  const [notificationType, setNotificationType] = useState(defaultNotificationType);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const result = await subscribeToNotifications(email, notificationType);

    if (result.success) {
      toast({
        title: "✅ Subscribed!",
        description: result.message,
      });
      setEmail("");
      onSuccess?.();
    } else {
      toast({
        title: "Subscription Failed",
        description: result.message,
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  if (variant === "compact") {
    return (
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1"
        />
        <Button
          type="submit"
          disabled={isLoading}
          className="gap-2"
        >
          <Bell className="w-4 h-4" />
          {isLoading ? "Subscribing..." : "Notify"}
        </Button>
      </form>
    );
  }

  if (variant === "card") {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <div className="flex items-start gap-3 mb-4">
          <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
              {title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {description}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10"
            />
          </div>

          <div>
            <Label htmlFor="notification-type" className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Notify me about:
            </Label>
            <Select value={notificationType} onValueChange={(value) => setNotificationType(value as any)}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="livestream">Livestreams only</SelectItem>
                <SelectItem value="programs">Programs only</SelectItem>
                <SelectItem value="all">Everything</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLoading ? "Subscribing..." : "Subscribe to Notifications"}
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email" className="text-sm font-medium">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 text-base"
            required
          />
        </div>

        <div>
          <Label htmlFor="notification-type-full" className="text-sm font-medium">
            Notification Preference
          </Label>
          <Select value={notificationType} onValueChange={(value) => setNotificationType(value as any)}>
            <SelectTrigger className="h-12" id="notification-type-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="livestream">Livestreams only</SelectItem>
              <SelectItem value="programs">Programs & Events only</SelectItem>
              <SelectItem value="all">All updates (Livestreams & Programs)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 text-base font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
        >
          {isLoading ? "Subscribing..." : "Subscribe to Notifications"}
        </Button>
      </form>

      <p className="text-xs text-muted-foreground text-center">
        We'll send you email notifications about upcoming livestreams and programs. You can unsubscribe anytime.
      </p>
    </div>
  );
};

export default NotificationSignup;

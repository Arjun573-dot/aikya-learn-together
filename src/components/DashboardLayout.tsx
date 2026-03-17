import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getUser, isDarkMode, setDarkMode, logout, getNotifications, markNotificationRead, type Notification } from "@/lib/store";
import { LayoutDashboard, Users, MessageCircle, FileText, Bell, Moon, Sun, LogOut, Menu, X, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { id: "groups", label: "Groups", icon: Users, path: "/dashboard/groups" },
  { id: "chat", label: "Chat", icon: MessageCircle, path: "/dashboard/chat" },
  { id: "notes", label: "Notes", icon: FileText, path: "/dashboard/notes" },
  { id: "ai", label: "Aikya AI", icon: Bot, path: "/dashboard/ai" },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();
  const [dark, setDark] = useState(isDarkMode());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(getNotifications());

  useEffect(() => {
    if (!user) navigate("/auth");
  }, [user, navigate]);

  useEffect(() => {
    setDarkMode(dark);
  }, [dark]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkRead = (id: string) => {
    markNotificationRead(id);
    setNotifications(getNotifications());
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user) return null;

  const activeNav = navItems.find(n => location.pathname === n.path)?.id || "dashboard";

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed h-full z-50 w-64 glass flex flex-col p-6 transition-transform duration-300 lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-sm">A</div>
          <span className="text-xl font-heading font-bold tracking-tight">Aikya</span>
          <button className="ml-auto lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => { navigate(item.path); setSidebarOpen(false); }}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-left transition-colors text-sm font-medium",
                activeNav === item.id
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-muted"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="pt-6 border-t border-border space-y-1">
          <button
            onClick={() => setDark(!dark)}
            className="flex items-center gap-3 px-3 py-2.5 w-full text-left rounded-lg text-sidebar-foreground hover:bg-muted transition-colors text-sm"
          >
            {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            {dark ? "Light Mode" : "Dark Mode"}
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full text-left rounded-lg text-destructive hover:bg-destructive/10 transition-colors text-sm"
          >
            <LogOut className="w-5 h-5" />
            Log out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 lg:ml-64 min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <p className="text-sm text-muted-foreground">Welcome back,</p>
              <p className="font-heading font-bold text-sm">{user.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 rounded-full bg-card card-shadow hover:bg-muted transition"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive rounded-full text-[10px] text-destructive-foreground flex items-center justify-center font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-12 w-80 bg-card rounded-xl card-shadow-lg border border-border overflow-hidden z-50">
                  <div className="p-4 border-b border-border">
                    <h3 className="font-heading font-bold text-sm">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="p-4 text-sm text-muted-foreground text-center">No notifications</p>
                    ) : notifications.map(n => (
                      <button
                        key={n.id}
                        onClick={() => handleMarkRead(n.id)}
                        className={cn(
                          "w-full text-left p-4 border-b border-border hover:bg-muted/50 transition text-sm",
                          !n.read && "bg-primary/5"
                        )}
                      >
                        <p className={cn("leading-snug", !n.read && "font-medium")}>{n.text}</p>
                        <p className="text-xs text-muted-foreground mt-1 font-mono">{n.date}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="w-9 h-9 rounded-full bg-muted border-2 border-background overflow-hidden">
              <img src={user.avatar} alt={user.name} className="w-full h-full" />
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}

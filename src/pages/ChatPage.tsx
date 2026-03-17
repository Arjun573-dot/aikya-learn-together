import { useState } from "react";
import { getChat, addChatMessage, getSessions } from "@/lib/store";
import { useAuth } from "@/contexts/AuthContext";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ChatPage() {
  const { profile } = useAuth();
  const sessions = getSessions();
  const [activeGroup, setActiveGroup] = useState(sessions[0]?.id || "");
  const [messages, setMessages] = useState(getChat(activeGroup));
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim() || !profile) return;
    addChatMessage({
      id: `m_${Date.now()}`,
      groupId: activeGroup,
      senderId: profile.id,
      senderName: profile.name,
      text: text.trim(),
      timestamp: new Date().toISOString(),
    });
    setMessages(getChat(activeGroup));
    setText("");
  };

  const switchGroup = (id: string) => {
    setActiveGroup(id);
    setMessages(getChat(id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-heading font-bold">Group Chat</h1>
        <p className="text-muted-foreground mt-1">Communicate with your learning group</p>
      </div>

      <div className="flex gap-4 h-[60vh]">
        <div className="w-56 shrink-0 bg-card rounded-xl card-shadow overflow-y-auto hidden md:block">
          <div className="p-3 border-b border-border">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Groups</p>
          </div>
          {sessions.map(s => (
            <button
              key={s.id}
              onClick={() => switchGroup(s.id)}
              className={cn(
                "w-full text-left p-3 border-b border-border hover:bg-muted/50 transition text-sm",
                activeGroup === s.id && "bg-primary/5 border-l-2 border-l-primary"
              )}
            >
              <p className="font-heading font-bold text-sm truncate">{s.title}</p>
              <p className="text-xs text-muted-foreground truncate">{s.members.length} members</p>
            </button>
          ))}
        </div>

        <div className="flex-1 bg-card rounded-xl card-shadow flex flex-col">
          <div className="p-4 border-b border-border">
            <h3 className="font-heading font-bold text-sm">
              {sessions.find(s => s.id === activeGroup)?.title || "Select a group"}
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <p className="text-sm text-muted-foreground text-center mt-8">No messages yet. Start the conversation!</p>
            )}
            {messages.map(m => (
              <div key={m.id} className={cn("flex", m.senderId === profile?.id && "justify-end")}>
                <div className={cn(
                  "max-w-[70%] p-3 rounded-xl text-sm",
                  m.senderId === profile?.id
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-muted rounded-bl-sm"
                )}>
                  {m.senderId !== profile?.id && (
                    <p className="text-xs font-bold mb-1 opacity-70">{m.senderName}</p>
                  )}
                  <p>{m.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-border flex gap-2">
            <input
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSend()}
              placeholder="Type a message..."
              className="flex-1 h-10 px-4 rounded-lg border border-input bg-background focus:ring-2 focus:ring-ring outline-none text-sm"
            />
            <Button size="icon" onClick={handleSend}><Send className="w-4 h-4" /></Button>
          </div>
        </div>
      </div>
    </div>
  );
}

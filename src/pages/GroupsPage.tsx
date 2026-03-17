import { getSessions } from "@/lib/store";
import { Users, BookOpen, Video } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GroupsPage() {
  const sessions = getSessions();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl lg:text-3xl font-heading font-bold">Groups</h1>
        <p className="text-muted-foreground mt-1">View all active learning groups</p>
      </div>

      <div className="grid gap-4">
        {sessions.map(s => (
          <div key={s.id} className="bg-card p-6 rounded-xl card-shadow">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <BookOpen className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.subject} · {s.topic}</p>
                  <p className="text-xs text-muted-foreground mt-1">Teacher: {s.teacherName} · <span className="font-mono">{s.time}</span></p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="font-mono text-sm">{s.members.length}/{s.maxMembers}</span>
                </div>
                {/* Slot visualization */}
                <div className="flex gap-1">
                  {Array.from({ length: s.maxMembers }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-8 rounded-sm ${i < s.members.length ? (i === 0 ? "bg-primary" : "bg-accent") : "bg-muted"}`}
                    />
                  ))}
                </div>
                {s.meetLink && (
                  <a href={s.meetLink} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm"><Video className="w-4 h-4 mr-1" /> Meet</Button>
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, getSessions, addSession, joinSession, getReviews, type Session } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Plus, Video, Star, Clock, Users, BookOpen, Bot, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

function SessionCard({ session, isTeacher, onJoin }: { session: Session; isTeacher: boolean; onJoin: () => void }) {
  const user = getUser();
  const isMember = user ? session.members.includes(user.id) : false;
  const isFull = session.members.length >= session.maxMembers;

  return (
    <div className="bg-card p-5 rounded-xl card-shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:ring-2 ring-primary/20 transition-all">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
          <BookOpen className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-heading font-bold">{session.title}</h3>
          <p className="text-sm text-muted-foreground">
            {session.teacherName} · <span className="font-mono text-xs">{session.time}</span> · {session.date}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
        {/* Member slots */}
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {Array.from({ length: session.members.length }).map((_, i) => (
              <div key={i} className="w-7 h-7 rounded-full border-2 border-card bg-muted" />
            ))}
            {Array.from({ length: session.maxMembers - session.members.length }).map((_, i) => (
              <div key={i} className="w-7 h-7 rounded-full border-2 border-dashed border-border" />
            ))}
          </div>
          <span className="text-xs font-mono text-muted-foreground">{session.members.length}/{session.maxMembers}</span>
        </div>
        <div className="flex items-center gap-2">
          {session.meetLink && (
            <a href={session.meetLink} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm"><Video className="w-4 h-4" /></Button>
            </a>
          )}
          {!isTeacher && !isMember && !isFull && (
            <Button size="sm" onClick={onJoin}>Join</Button>
          )}
          {isMember && <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-md">Joined</span>}
          {isFull && !isMember && <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-md">Full</span>}
        </div>
      </div>
    </div>
  );
}

function CreateSessionModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const user = getUser()!;
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("Programming");
  const [topic, setTopic] = useState("");
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [meetLink, setMeetLink] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !time || !date) return;
    addSession({
      id: `s_${Date.now()}`,
      title,
      subject,
      topic,
      teacherId: user.id,
      teacherName: user.name,
      time,
      date,
      meetLink,
      members: [user.id],
      maxMembers: 4,
    });
    onCreated();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card w-full max-w-md rounded-2xl p-8 card-shadow-lg"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-xl font-heading font-bold mb-6">Create Session</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1.5">Topic Name</label>
            <input required value={title} onChange={e => setTitle(e.target.value)} className="w-full h-11 px-4 rounded-lg border border-input bg-background focus:ring-2 focus:ring-ring outline-none" placeholder="Advanced React Patterns" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">Subject</label>
              <select value={subject} onChange={e => setSubject(e.target.value)} className="w-full h-11 px-4 rounded-lg border border-input bg-background focus:ring-2 focus:ring-ring outline-none">
                <option>Programming</option>
                <option>Science</option>
                <option>Math</option>
                <option>Design</option>
                <option>Language</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">Topic</label>
              <input value={topic} onChange={e => setTopic(e.target.value)} className="w-full h-11 px-4 rounded-lg border border-input bg-background focus:ring-2 focus:ring-ring outline-none" placeholder="React Hooks" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">Date</label>
              <input required type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full h-11 px-4 rounded-lg border border-input bg-background focus:ring-2 focus:ring-ring outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">Time</label>
              <input required type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full h-11 px-4 rounded-lg border border-input bg-background focus:ring-2 focus:ring-ring outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1.5">Google Meet Link</label>
            <input value={meetLink} onChange={e => setMeetLink(e.target.value)} className="w-full h-11 px-4 rounded-lg border border-input bg-background focus:ring-2 focus:ring-ring outline-none" placeholder="https://meet.google.com/..." />
          </div>
          <Button type="submit" className="w-full" size="lg">Launch Session</Button>
          <button type="button" onClick={onClose} className="w-full text-center text-sm text-muted-foreground hover:text-foreground">Cancel</button>
        </form>
      </motion.div>
    </div>
  );
}

function ReviewModal({ onClose }: { onClose: () => void }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");

  return (
    <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card w-full max-w-sm rounded-2xl p-8 card-shadow-lg"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-xl font-heading font-bold mb-4">Rate Teacher</h2>
        <div className="flex gap-1 mb-4 justify-center">
          {[1, 2, 3, 4, 5].map(i => (
            <button key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(0)} onClick={() => setRating(i)}>
              <Star className={`w-8 h-8 transition ${i <= (hover || rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
            </button>
          ))}
        </div>
        <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Share your feedback..." className="w-full h-24 px-4 py-3 rounded-lg border border-input bg-background resize-none focus:ring-2 focus:ring-ring outline-none mb-4" />
        <Button className="w-full" size="lg" onClick={onClose}>Submit Review</Button>
      </motion.div>
    </div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const user = getUser();
  const [sessions, setSessions] = useState(getSessions());
  const [showCreate, setShowCreate] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const isTeacher = user?.role === "teacher";
  const reviews = getReviews();

  const refresh = () => setSessions(getSessions());

  const handleJoin = (sessionId: string) => {
    if (user) {
      joinSession(sessionId, user.id);
      refresh();
    }
  };

  const avgRating = reviews.length > 0 ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1) : "—";

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-heading font-bold">
            {isTeacher ? "Teacher Dashboard" : "Learner Dashboard"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isTeacher ? "Manage your sessions and view feedback" : "Discover sessions and join groups"}
          </p>
        </div>
        {isTeacher && (
          <Button onClick={() => setShowCreate(true)}>
            <Plus className="w-4 h-4 mr-1" /> Create Session
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card p-5 rounded-xl card-shadow">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Active Groups</p>
          <p className="text-3xl font-heading font-bold mt-1 font-mono">{String(sessions.length).padStart(2, "0")}</p>
        </div>
        <div className="bg-card p-5 rounded-xl card-shadow border-b-4 border-primary">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            {isTeacher ? "Sessions Created" : "Hours Learned"}
          </p>
          <p className="text-3xl font-heading font-bold mt-1 font-mono">
            {isTeacher ? String(sessions.filter(s => s.teacherId === user?.id).length).padStart(2, "0") : "12.5"}
          </p>
        </div>
        <div className="bg-card p-5 rounded-xl card-shadow">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            {isTeacher ? "Avg. Rating" : "Peer Rating"}
          </p>
          <p className="text-3xl font-heading font-bold mt-1 font-mono">{avgRating}<span className="text-sm text-muted-foreground ml-1">/5.0</span></p>
        </div>
      </div>

      {/* Sessions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-heading font-bold flex items-center gap-2">
            <Clock className="w-5 h-5 text-muted-foreground" /> Upcoming Sessions
          </h2>
          {!isTeacher && (
            <button onClick={() => setShowReview(true)} className="text-sm font-medium text-primary hover:underline">Rate a Teacher</button>
          )}
        </div>
        <div className="space-y-3">
          {sessions.map((s, i) => (
            <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <SessionCard session={s} isTeacher={isTeacher} onJoin={() => handleJoin(s.id)} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* AI Chatbot + Progress (sidebar widgets) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-primary rounded-2xl p-6 text-primary-foreground card-shadow relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-lg font-heading font-bold mb-2">Aikya AI</h3>
            <p className="text-primary-foreground/80 text-sm mb-4">Stuck on a problem? Ask your peer-learning assistant.</p>
            <div className="bg-primary-foreground/10 rounded-xl p-3 mb-4 h-32 overflow-y-auto text-xs space-y-2">
              <div className="bg-primary-foreground/20 p-2 rounded-lg w-3/4">How can I help you learn today?</div>
            </div>
            <input
              type="text"
              placeholder="Ask anything..."
              className="w-full bg-primary-foreground/15 border border-primary-foreground/20 rounded-lg px-4 py-2.5 text-sm placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 ring-primary-foreground/30"
            />
          </div>
          <div className="absolute -bottom-6 -right-6 w-28 h-28 bg-primary-foreground/10 rounded-full blur-2xl" />
        </div>

        <div className="bg-card p-6 rounded-2xl card-shadow">
          <h3 className="font-heading font-bold mb-4">Weekly Goal</h3>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Learning Progress</span>
            <span className="font-heading font-bold">75%</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: "75%" }} />
          </div>
          <p className="text-xs text-muted-foreground mt-4">You're 2 hours away from your weekly goal. Keep it up!</p>
        </div>
      </div>

      {showCreate && <CreateSessionModal onClose={() => setShowCreate(false)} onCreated={refresh} />}
      {showReview && <ReviewModal onClose={() => setShowReview(false)} />}
    </div>
  );
}

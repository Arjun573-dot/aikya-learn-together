import { useState } from "react";
import { getNotes, addNote, getUser } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Download } from "lucide-react";
import { motion } from "framer-motion";

export default function NotesPage() {
  const user = getUser();
  const [notes, setNotes] = useState(getNotes(user?.id || ""));
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [subject, setSubject] = useState("Programming");

  const handleCreate = () => {
    if (!title || !user) return;
    addNote({
      id: `n_${Date.now()}`,
      userId: user.id,
      title,
      content,
      subject,
      date: new Date().toISOString().split("T")[0],
    });
    setNotes(getNotes(user.id));
    setTitle("");
    setContent("");
    setShowCreate(false);
  };

  const handleDownload = (note: typeof notes[0]) => {
    const blob = new Blob([`# ${note.title}\n\nSubject: ${note.subject}\nDate: ${note.date}\n\n${note.content}`], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${note.title.replace(/\s+/g, "-")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-heading font-bold">Notes</h1>
          <p className="text-muted-foreground mt-1">Your offline learning notes</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="w-4 h-4 mr-1" /> New Note
        </Button>
      </div>

      {showCreate && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card p-6 rounded-xl card-shadow space-y-4"
        >
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Note title..." className="w-full text-lg font-heading font-bold bg-transparent border-b border-border pb-2 focus:outline-none focus:border-primary" />
          <select value={subject} onChange={e => setSubject(e.target.value)} className="h-9 px-3 rounded-md border border-input bg-background text-sm">
            <option>Programming</option>
            <option>Science</option>
            <option>Math</option>
            <option>Design</option>
          </select>
          <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Write your notes..." className="w-full h-32 px-4 py-3 rounded-lg border border-input bg-background resize-none focus:ring-2 focus:ring-ring outline-none text-sm" />
          <div className="flex gap-2">
            <Button onClick={handleCreate}>Save Note</Button>
            <Button variant="ghost" onClick={() => setShowCreate(false)}>Cancel</Button>
          </div>
        </motion.div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {notes.map((n, i) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card p-5 rounded-xl card-shadow group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                <FileText className="w-5 h-5" />
              </div>
              <button onClick={() => handleDownload(n)} className="opacity-0 group-hover:opacity-100 transition p-1.5 rounded-md hover:bg-muted">
                <Download className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <h3 className="font-heading font-bold mb-1">{n.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{n.content}</p>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="bg-muted px-2 py-0.5 rounded">{n.subject}</span>
              <span className="font-mono">{n.date}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

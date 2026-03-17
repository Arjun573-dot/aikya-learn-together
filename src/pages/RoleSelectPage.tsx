import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, type UserRole } from "@/contexts/AuthContext";
import { BookOpen, GraduationCap, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function RoleSelectPage() {
  const navigate = useNavigate();
  const { profile, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleRole = async (role: UserRole) => {
    setLoading(true);
    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(profile?.name || profile?.email || "user")}`;
    await updateProfile({
      role,
      avatar_url: avatarUrl,
      subjects: ["Programming", "Science"],
    });
    setLoading(false);
    navigate("/dashboard");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold text-lg mx-auto mb-4">A</div>
          <h1 className="text-2xl font-heading font-bold">Choose your role</h1>
          <p className="text-muted-foreground mt-1">How would you like to participate?</p>
        </div>
        <div className="bg-card rounded-2xl p-8 card-shadow space-y-4">
          <button
            onClick={() => handleRole("teacher")}
            className="w-full p-5 rounded-xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-all text-left group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <p className="font-heading font-bold">Student Teacher</p>
                <p className="text-sm text-muted-foreground">Create sessions and teach peers</p>
              </div>
            </div>
          </button>
          <button
            onClick={() => handleRole("learner")}
            className="w-full p-5 rounded-xl border-2 border-border hover:border-accent hover:bg-accent/5 transition-all text-left group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <p className="font-heading font-bold">Learner</p>
                <p className="text-sm text-muted-foreground">Join groups and learn from peers</p>
              </div>
            </div>
          </button>
        </div>
      </motion.div>
    </div>
  );
}

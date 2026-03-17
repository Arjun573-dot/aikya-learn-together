import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { setUser, type UserRole } from "@/lib/store";
import { BookOpen, GraduationCap, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AuthPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"auth" | "role">("auth");
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStep("role");
  };

  const handleRole = (role: UserRole) => {
    const user = {
      id: `user_${Date.now()}`,
      name: name || email.split("@")[0],
      email,
      role,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name || email)}`,
      subjects: ["Programming", "Science"],
    };
    setUser(user);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <button onClick={() => navigate("/")} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </button>
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold text-lg mx-auto mb-4">A</div>
          <h1 className="text-2xl font-heading font-bold">Welcome to Aikya</h1>
          <p className="text-muted-foreground mt-1">Learn Together, Grow Together</p>
        </div>

        <div className="bg-card rounded-2xl p-8 card-shadow">
          <AnimatePresence mode="wait">
            {step === "auth" ? (
              <motion.form
                key="auth"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleAuth}
                className="space-y-4"
              >
                <h2 className="text-lg font-heading font-bold">{isLogin ? "Log in" : "Create account"}</h2>
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1.5">Full Name</label>
                    <input
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full h-11 px-4 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-ring outline-none transition"
                      placeholder="Alex Johnson"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1.5">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full h-11 px-4 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-ring outline-none transition"
                    placeholder="you@university.edu"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1.5">Password</label>
                  <input
                    type="password"
                    required
                    className="w-full h-11 px-4 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-ring outline-none transition"
                    placeholder="••••••••"
                  />
                </div>
                <Button type="submit" className="w-full" size="lg">Continue</Button>
                <p className="text-center text-sm text-muted-foreground">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                  <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-primary font-medium hover:underline">
                    {isLogin ? "Sign up" : "Log in"}
                  </button>
                </p>
              </motion.form>
            ) : (
              <motion.div
                key="role"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h2 className="text-lg font-heading font-bold">Choose your role</h2>
                <p className="text-sm text-muted-foreground">How would you like to participate?</p>
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

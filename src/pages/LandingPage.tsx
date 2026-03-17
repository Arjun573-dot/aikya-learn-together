import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BookOpen, Users, Star, Zap, ArrowRight } from "lucide-react";

const features = [
  { icon: Users, title: "Smart Grouping", desc: "AI-matched teams of 4 — 1 teacher, 3 learners" },
  { icon: BookOpen, title: "Live Sessions", desc: "Scheduled peer sessions with Google Meet integration" },
  { icon: Star, title: "Peer Reviews", desc: "Rate & review teachers to improve quality" },
  { icon: Zap, title: "AI Assistant", desc: "Personal chatbot to help with your learning" },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-sm">A</div>
            <span className="text-xl font-heading font-bold tracking-tight">Aikya</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate("/auth")}>Log in</Button>
            <Button onClick={() => navigate("/auth")}>Get Started</Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
              <Zap className="w-4 h-4" />
              Peer-to-peer collaborative learning
            </div>
            <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tight leading-[1.1] mb-6">
              Learn Together,
              <br />
              <span className="text-primary">Grow Together.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Aikya groups students into focused teams of 4 — one student teacher, three learners — matched by subject and skill level for maximum impact.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Button variant="hero" size="lg" onClick={() => navigate("/auth")}>
                Start Learning <ArrowRight className="w-5 h-5 ml-1" />
              </Button>
              <Button variant="hero-outline" size="lg" onClick={() => navigate("/auth")}>
                Become a Teacher
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 border-y border-border bg-muted/30">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            ["2,400+", "Active Learners"],
            ["580+", "Student Teachers"],
            ["4.8/5", "Avg. Rating"],
            ["12K+", "Sessions Held"],
          ].map(([stat, label]) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-3xl md:text-4xl font-heading font-bold">{stat}</p>
              <p className="text-sm text-muted-foreground mt-1">{label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Everything you need to learn effectively</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">Small groups, smart matching, and real accountability — built for students, by students.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card p-6 rounded-xl card-shadow hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-heading font-bold mb-2">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto bg-primary rounded-2xl p-10 md:p-14 text-center text-primary-foreground">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Ready to learn smarter?</h2>
          <p className="text-primary-foreground/80 mb-8 text-lg">Join thousands of students already learning together on Aikya.</p>
          <Button variant="outline" size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 border-0 font-bold" onClick={() => navigate("/auth")}>
            Get Started Free <ArrowRight className="w-5 h-5 ml-1" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center text-primary-foreground font-bold text-xs">A</div>
            <span className="font-heading font-bold">Aikya</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 Aikya. Learn Together, Grow Together.</p>
        </div>
      </footer>
    </div>
  );
}

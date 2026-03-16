// app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans overflow-x-hidden">
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .fade-up { animation: fadeUp 0.6s ease both; }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.3s; }
        .delay-4 { animation-delay: 0.4s; }
        .float { animation: float 4s ease-in-out infinite; }
        .float-slow { animation: float 5s ease-in-out infinite; animation-delay: 0.8s; }
        .shimmer-text {
          background: linear-gradient(90deg, #7c3aed, #a855f7, #7c3aed);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }
        .card-hover { transition: all 0.3s cubic-bezier(0.4,0,0.2,1); }
        .card-hover:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px rgba(124,58,237,0.12);
          border-color: #a855f7 !important;
        }
        .card-hover:hover .feat-icon { transform: scale(1.15) rotate(-5deg); }
        .feat-icon { transition: transform 0.3s ease; }
        .btn-glow { transition: all 0.2s ease; }
        .btn-glow:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(124,58,237,0.4);
        }
        .bg-dots {
          background-image: radial-gradient(circle, rgba(168,85,247,0.15) 1px, transparent 1px);
          background-size: 28px 28px;
        }
        .stat-hover { transition: all 0.2s ease; cursor: default; }
        .stat-hover:hover { transform: scale(1.05); border-radius: 12px; }
        .mockup-card { background: hsl(var(--card)); border: 1px solid hsl(var(--border)); }
        .mockup-inner { background: hsl(var(--muted)/0.5); }
      `}</style>

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur border-b border-border px-8 py-4 flex items-center justify-between">
        <div className="fade-up text-xl font-black text-foreground tracking-tight">
          Book<span className="text-purple-500">Studio</span>
        </div>
        <div className="fade-up flex items-center gap-3">
          <Link
            href="/signin"
            className="text-sm text-muted-foreground hover:text-foreground px-4 py-2 transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/signin"
            className="btn-glow text-sm bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-full font-medium"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="bg-dots pt-28 pb-20 px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-112px)]">
          {/* Left */}
          <div>
            <div className="fade-up inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 text-purple-500 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse" />
              AI-Powered Admin Platform
            </div>

            <h1 className="fade-up delay-1 text-5xl xl:text-6xl font-black text-foreground leading-[1.1] tracking-tight mb-6">
              Manage your
              <br />
              <span className="shimmer-text">book business</span>
              <br />
              with AI
            </h1>

            <p className="fade-up delay-2 text-lg text-muted-foreground leading-relaxed mb-8 max-w-md">
              A complete admin dashboard for publishers. Manage books, users,
              orders, and revenue — with an AI assistant that acts, not just
              answers.
            </p>

            <div className="fade-up delay-3 flex items-center gap-3 flex-wrap">
              <Link
                href="/signin"
                className="btn-glow bg-purple-600 hover:bg-purple-700 text-white px-7 py-3.5 rounded-full font-semibold text-sm"
              >
                Enter Dashboard →
              </Link>
              <Link
                href="/signup"
                className="border border-border hover:border-purple-500/50 hover:text-purple-500 text-muted-foreground px-7 py-3.5 rounded-full font-medium text-sm transition-all"
              >
                Create account
              </Link>
            </div>

            <div className="fade-up delay-4 mt-10 pt-8 border-t border-border grid grid-cols-3 gap-4">
              {[
                { num: "$24k+", label: "Monthly revenue" },
                { num: "3,800+", label: "Active users" },
                { num: "382", label: "Books published" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="stat-hover p-3 hover:bg-purple-500/5"
                >
                  <div className="text-2xl font-black text-foreground">
                    {s.num}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — mockup */}
          <div className="fade-up delay-2 relative flex justify-center lg:justify-end">
            <div className="float w-full max-w-md relative">
              <div className="mockup-card rounded-2xl shadow-2xl overflow-hidden">
                {/* Window bar */}
                <div className="bg-muted/50 border-b border-border px-4 py-3 flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                  <span className="text-xs text-muted-foreground ml-2 font-medium">
                    Dashboard — AI Active
                  </span>
                </div>

                {/* Stat cards */}
                <div className="p-4 border-b border-border">
                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      {
                        label: "Total Revenue",
                        val: "$24,582",
                        trend: "↑ 12.5%",
                        bg: "bg-purple-500/10",
                        text: "text-purple-500",
                        tc: "text-green-500",
                      },
                      {
                        label: "Active Users",
                        val: "3,847",
                        trend: "↑ 8.2%",
                        bg: "bg-blue-500/10",
                        text: "text-blue-500",
                        tc: "text-green-500",
                      },
                      {
                        label: "Books Published",
                        val: "382",
                        trend: "↑ 5 new",
                        bg: "bg-amber-500/10",
                        text: "text-amber-500",
                        tc: "text-green-500",
                      },
                      {
                        label: "Orders Pending",
                        val: "42",
                        trend: "Awaiting",
                        bg: "bg-orange-500/10",
                        text: "text-orange-500",
                        tc: "text-orange-500",
                      },
                    ].map((c) => (
                      <div key={c.label} className={`${c.bg} rounded-xl p-3`}>
                        <div className={`text-xs font-medium ${c.text} mb-1`}>
                          {c.label}
                        </div>
                        <div className="text-xl font-black text-foreground">
                          {c.val}
                        </div>
                        <div className={`text-xs mt-0.5 font-medium ${c.tc}`}>
                          {c.trend}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Chat */}
                <div className="p-4">
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
                    AI Assistant
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-end">
                      <div className="bg-purple-600 text-white text-xs px-3 py-2 rounded-2xl rounded-tr-sm max-w-[85%] leading-relaxed">
                        Show revenue stats & update dashboard
                      </div>
                    </div>
                    <div className="flex gap-2 items-start">
                      <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center shrink-0">
                        <span className="text-white text-xs font-bold">AI</span>
                      </div>
                      <div className="bg-muted text-foreground text-xs px-3 py-2 rounded-2xl rounded-tl-sm leading-relaxed">
                        Revenue $24,582 — up 12.5% 📊 Update dashboard?
                      </div>
                    </div>
                    <div className="ml-8 flex gap-2">
                      <button className="bg-purple-600 text-white text-xs px-3 py-1.5 rounded-full font-medium hover:bg-purple-700 transition-colors">
                        ✅ Update
                      </button>
                      <button className="bg-muted text-muted-foreground text-xs px-3 py-1.5 rounded-full hover:bg-muted/80 transition-colors">
                        ❌ Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <div className="float-slow absolute -bottom-3 -left-6 bg-card border border-border rounded-xl px-4 py-2.5 shadow-lg">
                <div className="text-xs text-muted-foreground">Powered by</div>
                <div className="text-sm font-bold text-foreground">
                  CopilotKit + LangGraph
                </div>
              </div>
              <div className="float absolute -top-3 -right-3 bg-purple-600 text-white text-xs font-bold rounded-xl px-3 py-2 shadow-lg">
                🤖 AI Active
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-xs font-semibold text-purple-500 uppercase tracking-wider mb-2">
              Platform Features
            </div>
            <h2 className="text-3xl font-black text-foreground">
              Everything in one place
            </h2>
            <p className="text-muted-foreground mt-3 max-w-md mx-auto text-sm">
              Built for publishers who want speed, clarity, and AI that actually
              helps.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: "📚",
                title: "Book Management",
                desc: "Add, edit, publish books. AI filters by category, status, or keyword instantly.",
                color: "bg-purple-500/10 text-purple-500",
              },
              {
                icon: "📊",
                title: "Live Analytics",
                desc: "Revenue, user growth, order stats — real-time with AI-generated insights.",
                color: "bg-blue-500/10 text-blue-500",
              },
              {
                icon: "🤖",
                title: "AI Writing",
                desc: "Write chapters and outlines with LangGraph agents. Human approval on every change.",
                color: "bg-green-500/10 text-green-500",
              },
              {
                icon: "📦",
                title: "Order Tracking",
                desc: "Monitor PENDING, SHIPPED, DELIVERED orders. AI reports on demand.",
                color: "bg-amber-500/10 text-amber-500",
              },
              {
                icon: "👥",
                title: "User Management",
                desc: "Track NORMAL vs PREMIUM users, active buyers, and new signups.",
                color: "bg-pink-500/10 text-pink-500",
              },
              {
                icon: "✅",
                title: "Todo & Activity",
                desc: "AI manages your todo list by date. Activity feed keeps you informed.",
                color: "bg-indigo-500/10 text-indigo-500",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="card-hover bg-card border border-border rounded-2xl p-6 group"
              >
                <div
                  className={`feat-icon w-11 h-11 ${f.color} rounded-xl flex items-center justify-center text-xl mb-4`}
                >
                  {f.icon}
                </div>
                <div className="font-bold text-foreground mb-2 group-hover:text-purple-500 transition-colors">
                  {f.title}
                </div>
                <div className="text-sm text-muted-foreground leading-relaxed">
                  {f.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-8 bg-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-dots opacity-20" />
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <h2 className="text-4xl font-black text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-purple-200 text-lg mb-8">
            Sign in to your dashboard and let AI handle the heavy lifting.
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <Link
              href="/signin"
              className="btn-glow bg-white text-purple-600 font-bold px-8 py-3 rounded-full text-sm hover:bg-purple-50"
            >
              Sign in →
            </Link>
            <Link
              href="/signup"
              className="border border-purple-400 text-white font-medium px-8 py-3 rounded-full text-sm hover:bg-purple-500 transition-colors"
            >
              Create account
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-card border-t border-border px-8 py-6 flex items-center justify-between">
        <div className="text-lg font-black text-foreground">
          Book<span className="text-purple-500">Studio</span>
        </div>
        <div className="text-sm text-muted-foreground">
          Admin platform for ebook publishers
        </div>
      </footer>
    </div>
  );
}

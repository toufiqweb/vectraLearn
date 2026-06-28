import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  Clock,
  User,
  ArrowRight,
  Search,
  TrendingUp,
  Calendar,
  ChevronRight,
  Mail,
  Flame,
  Terminal,
  Activity,
  Award,
  Globe,
} from "lucide-react";

// Expanded mock dataset structured around an advanced engineering ecosystem
const MOCK_CATEGORIES = [
  { name: "All Engineering Core", count: 42 },
  { name: "Next.js & React Frameworks", count: 18 },
  { name: "Tailwind & Design Systems", count: 12 },
  { name: "Database & Session Engines", count: 7 },
  { name: "Dependency & Compilation Trees", count: 5 },
];

const QUICK_TRENDS = [
  "Next.js 15.2 Partial Prerendering",
  "Vite 8.0 Module Resolution",
  "Tailwind CSS Layer Optimization",
  "Edge Telemetry Metrics",
];

const MOCK_POSTS = [
  {
    id: "1",
    title: "Mastering Server Component Architecture & Streaming in Next.js 15",
    excerpt:
      "Dive deep into modern stream parsing, asymmetric state hydration parameters, and high-performance dynamic routing optimizations without sacrificing time-to-first-byte (TTFB) metrics.",
    category: "Next.js & React Frameworks",
    author: "Alex Rivers",
    date: "May 2026",
    readTime: "6 min read",
    image:
      "https://i.pinimg.com/1200x/18/a3/3d/18a33d89164fb9f67360537922cf43c0.jpg",
  },
  {
    id: "2",
    title: "Advanced Cryptographic Session Protocols & Multi-Factor Auth Flow",
    excerpt:
      "An in-depth structural review of decentralized access management topologies, edge session parameter checks, and secure fallback credential verification workflows.",
    category: "Database & Session Engines",
    author: "Sarah Chen",
    date: "May 2026",
    readTime: "8 min read",
    image:
      "https://i.pinimg.com/736x/d5/b2/75/d5b2759e6d562a4ea5f5dde382b6a130.jpg",
  },
  {
    id: "3",
    title:
      "Building Fluid Glassmorphism Frameworks with Tailwind CSS Variable APIs",
    excerpt:
      "Unlock responsive micro-frontend layout strategies using unified CSS variable design token layers to maintain flawless theme synchronization across system environments.",
    category: "Tailwind & Design Systems",
    author: "Marcus Vance",
    date: "Apr 2026",
    readTime: "5 min read",
    image:
      "https://i.pinimg.com/736x/76/4e/79/764e79916817cf84a8bca7fdc2f7dd48.jpg",
  },
  {
    id: "4",
    title: "Resolving Complex Dependency Trees and Layer Instability in Vite 8",
    excerpt:
      "Demystifying strict ES module resolution caching rules, handling peer dependency configuration drift, and setting optimal pre-bundling parameters for micro-apps.",
    category: "Dependency & Compilation Trees",
    author: "Jon Snow ",
    date: "Apr 2026",
    readTime: "7 min read",
    image:
      "https://i.ibb.co.com/BHGfHYMz/Gemini-Generated-Image-z638kgz638kgz638.png",
  },
  {
    id: "5",
    title:
      "Optimizing Recharts Responsive Containers for High-Throughput Live Dashboards",
    excerpt:
      "A tactical architectural blueprint for reducing layout reflow loops when monitoring live system telemetry pipelines with SVG and HTML5 Canvas backends.",
    category: "Tailwind & Design Systems",
    author: "Tajah M.",
    date: "Mar 2026",
    readTime: "9 min read",
    image:
      "https://i.ibb.co.com/1yrGPdV/Gemini-Generated-Image-99csxg99csxg99cs.png",
  },
];

const BlogPage = () => {
  const featuredPost = MOCK_POSTS[0];
  const regularPosts = MOCK_POSTS.slice(1);

  return (
    <div className="relative min-h-screen bg-background transition-colors duration-300 py-12 pt-28 lg:pt-36 px-4 overflow-hidden">
      {/* Background Graphic Curves & Neon Spot Highlights */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-1/4 left-[-10%] w-[600px] h-[600px] bg-brand-ocean/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 right-[-10%] w-[500px] h-[500px] bg-brand-cyan/5 rounded-full blur-[140px]" />
        <div className="absolute top-[60%] right-[-5%] w-[400px] h-[400px] bg-brand-mint/[0.02] rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-12 max-w-7xl relative z-10">
        {/* =========================================================
            SECTION 1: Dynamic Page Header Context
            ========================================================= */}
        <div className="text-center max-w-3xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-ocean/30 bg-brand-ocean/10 text-xs font-bold tracking-wider uppercase text-brand-ocean">
            <BookOpen className="w-3.5 h-3.5" /> Core Technology
            Logs
          </div>

          <h2 className="section-title">
            Ecosystem Insights &
            <span className="text-main-gradient">
              {" "}
              Deep System Blueprints
            </span>
          </h2>
          <p className="section-desc max-w-2xl mx-auto">
            Maintain total synchronization with advanced technical updates,
            microservice layouts, build compilation telemetry, and modern client
            interface rendering strategies.
          </p>
        </div>

        {/* =========================================================
            NEW SUB-SECTION: Live Trending Ticker Bar
            ========================================================= */}
        <div className="bg-card-bg/40 border border-card-border rounded-2xl p-3 flex flex-col md:flex-row items-center gap-4 text-xs max-w-7xl mx-auto">
          <div className="flex items-center gap-1.5 shrink-0 text-brand-ocean font-black uppercase tracking-wider bg-brand-ocean/10 px-2.5 py-1 rounded-lg border border-brand-ocean/20">
            <Flame className="w-3.5 h-3.5" /> Community Pulse:
          </div>
          <div className="flex flex-wrap gap-2 md:gap-6 justify-center md:justify-start font-medium text-muted">
            {QUICK_TRENDS.map((trend, idx) => (
              <span key={idx} className="flex items-center gap-2 text-[11px]">
                <Terminal className="w-3 h-3 text-brand-cyan" /> {trend}
              </span>
            ))}
          </div>
        </div>

        {/* =========================================================
            SECTION 2: Featured Showcase Blueprint (Hero Layout)
            ========================================================= */}
        {featuredPost && (
          <div className="glass-card rounded-[32px] overflow-hidden grid lg:grid-cols-12 items-center gap-0 group">
            {/* Featured Image Frame */}
            <div className="lg:col-span-7 h-64 sm:h-96 w-full relative overflow-hidden bg-card-bg/60">
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60 z-10 pointer-events-none" />
              <Image
                src={featuredPost.image}
                alt={featuredPost.title}
                fill
                unoptimized
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                priority
              />
            </div>

            {/* Featured Card Content */}
            <div className="lg:col-span-5 p-8 sm:p-10 space-y-5">
              <span className="inline-block px-3 py-1 rounded-xl bg-brand-ocean/10 border border-brand-ocean/20 text-brand-ocean font-bold text-[11px] uppercase tracking-wider">
                {featuredPost.category}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight leading-tight group-hover:text-brand-cyan transition-colors duration-200">
                <Link href={`/blog/${featuredPost.id}`}>
                  {featuredPost.title}
                </Link>
              </h2>
              <p className="text-secondary text-xs sm:text-sm font-medium leading-relaxed">
                {featuredPost.excerpt}
              </p>

              <div className="flex items-center gap-4 text-[11px] text-muted pt-3 border-t border-card-border">
                <span className="flex items-center gap-1 font-bold">
                  <User className="w-3.5 h-3.5 text-brand-cyan" />{" "}
                  {featuredPost.author}
                </span>
                <span className="flex items-center gap-1 font-semibold">
                  <Calendar className="w-3.5 h-3.5" /> {featuredPost.date}
                </span>
                <span className="flex items-center gap-1 font-semibold">
                  <Clock className="w-3.5 h-3.5" /> {featuredPost.readTime}
                </span>
              </div>

              <div className="pt-2">
                <Link
                  href={`/blog/${featuredPost.id}`}
                  className="bg-main-gradient text-white px-5 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-glow hover:scale-[1.02] transition-all duration-200"
                >
                  <span>Read Featured Blueprint</span>{" "}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            SECTION 3: Multi-Column Main Workspace Matrix Split
            ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT SUBGRID: Main Article Stream Feed */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {regularPosts.map((post) => (
              <div
                key={post.id}
                className="glass-card rounded-[28px] overflow-hidden flex flex-col justify-between group hover:shadow-glow transition-all duration-300"
              >
                <div>
                  {/* Article Stream Image Box */}
                  <div className="h-48 w-full relative overflow-hidden bg-card-bg/60">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-40" />
                  </div>

                  <div className="p-6 space-y-3">
                    <span className="text-[10px] font-black tracking-wider uppercase text-brand-ocean">
                      {post.category}
                    </span>
                    <h3 className="text-base sm:text-[17px] font-black text-foreground tracking-tight leading-snug group-hover:text-brand-cyan transition-colors duration-200">
                      <Link href={`/blog/${post.id}`}>{post.title}</Link>
                    </h3>
                    <p className="text-secondary text-xs font-medium line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 mt-auto">
                  <div className="flex items-center justify-between text-[11px] text-muted pb-4 border-b border-card-border">
                    <span className="flex items-center gap-1 font-bold">
                      <User className="w-3.5 h-3.5 text-brand-cyan" />{" "}
                      {post.author}
                    </span>
                    <span className="flex items-center gap-1 font-semibold">
                      <Clock className="w-3.5 h-3.5" /> {post.readTime}
                    </span>
                  </div>
                  <Link
                    href={`/blog/${post.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-brand-ocean pt-4 tracking-wide uppercase group-hover:gap-2 transition-all"
                  >
                    <span>Analyze Logs</span>{" "}
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT SUBGRID: Sidebar Widgets */}
          <div className="lg:col-span-4 space-y-6">
            {/* Widget 1: Search */}
            <div className="glass-card rounded-3xl p-6 space-y-4">
              <h4 className="text-xs font-black text-foreground tracking-widest uppercase flex items-center gap-2">
                <Search className="w-4 h-4 text-brand-ocean" /> Target Registry
                Search
              </h4>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Query architecture paradigms..."
                  className="w-full pl-4 pr-10 py-3.5 rounded-xl bg-background/50 border border-card-border text-xs text-foreground placeholder:text-muted focus:border-brand-cyan focus:bg-background outline-none transition-all duration-200"
                />
                <Search className="w-4 h-4 text-muted absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Widget 2: Custom Architecture Taxonomy Categories */}
            <div className="glass-card rounded-3xl p-6 space-y-4">
              <h4 className="text-xs font-black text-foreground tracking-widest uppercase flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-brand-cyan" /> Structural
                Taxonomies
              </h4>
              <div className="space-y-2">
                {MOCK_CATEGORIES.map((category, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-xl border border-card-border bg-card-bg/30 hover:bg-foreground/5 transition-all duration-200 cursor-pointer group active:scale-[0.99]"
                  >
                    <span className="text-xs font-bold text-secondary group-hover:text-foreground">
                      {category.name}
                    </span>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-background border border-card-border text-muted">
                      {category.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* NEW Widget 3: Live Engineering Metrics Ledger */}
            <div className="glass-card rounded-3xl p-6 space-y-4">
              <h4 className="text-xs font-black text-foreground tracking-widest uppercase flex items-center gap-2">
                <Activity className="w-4 h-4 text-brand-mint" /> Documentation
                Metadata
              </h4>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 bg-card-bg/40 border border-card-border rounded-xl">
                  <p className="text-lg font-black text-foreground tracking-tight">
                    1,240+
                  </p>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-muted mt-0.5 flex items-center justify-center gap-1">
                    <Award className="w-2.5 h-2.5 text-brand-ocean" /> Code
                    Snippets
                  </p>
                </div>
                <div className="p-3 bg-card-bg/40 border border-card-border rounded-xl">
                  <p className="text-lg font-black text-foreground tracking-tight">
                    142
                  </p>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-muted mt-0.5 flex items-center justify-center gap-1">
                    <Globe className="w-2.5 h-2.5 text-brand-cyan" /> Global
                    Authors
                  </p>
                </div>
              </div>
            </div>

            {/* Widget 4: Newsletter Engine Dispatch */}
            <div className="glass-card rounded-3xl p-6 bg-gradient-to-b from-card-bg/60 to-brand-ocean/5 relative overflow-hidden space-y-4">
              <div className="w-8 h-8 rounded-xl bg-brand-ocean/10 border border-brand-ocean/20 text-brand-ocean flex items-center justify-center">
                <Mail className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-black text-foreground tracking-tight">
                  Join the Engineering Dispatch
                </h4>
                <p className="text-secondary text-xs font-medium leading-relaxed">
                  Get compiled telemetry updates and structural development
                  patterns delivered directly to your profile stack.
                </p>
              </div>
              <div className="space-y-2 pt-1">
                <input
                  type="email"
                  placeholder="secure@pipeline.com"
                  className="w-full px-4 py-3.5 rounded-xl bg-background/50 border border-card-border text-xs text-foreground placeholder:text-muted focus:border-brand-ocean focus:bg-background outline-none transition-all duration-200"
                  required
                />
                <button className="w-full bg-main-gradient text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider shadow-glow hover:scale-[1.02] cursor-pointer active:scale-[0.99] transition-all">
                  Subscribe Setup
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;

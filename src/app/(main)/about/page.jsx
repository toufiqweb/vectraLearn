import React from "react";
import { 
  Sparkles, 
  Target, 
  Cpu, 
  Users, 
  Compass, 
  ShieldCheck, 
  Layers, 
  Milestone,
  ArrowUpRight,
  History,
  Code2,
  HelpCircle,
  ChevronDown
} from "lucide-react";

// Server-side static dataset parameters
const stats = [
  { value: "45K+", label: "Active Learners", icon: Users },
  { value: "180+", label: "Skill Spheres", icon: Layers },
  { value: "99.4%", label: "Completion Rate", icon: Target },
  { value: "24/7", label: "Runtime Support", icon: Cpu },
];

const pillars = [
  {
    title: "Adaptive Frameworks",
    description: "Curating rigid production topologies tailored directly to modern tech paradigms instead of traditional static curricula.",
    icon: Compass,
    color: "#8b7eff",
  },
  {
    title: "Cryptographic Trust",
    description: "Ensuring verifiable validation parameters and persistent on-chain certificate generation metrics.",
    icon: ShieldCheck,
    color: "#10b981",
  },
  {
    title: "Continuous Synthesis",
    description: "Iterating structural code pipelines constantly to stay synchronized with bleeding-edge microservice updates.",
    icon: Milestone,
    color: "#6d5dfc",
  },
];

const milestones = [
  { year: "2023", title: "Protocol Baseline Initialized", desc: "Alpha engine launch focusing on core Next.js system architecture maps." },
  { year: "2024", title: "Distributed Learning Sync", desc: "Integrated microservice-driven analytics tracking to compute precise learner velocity metrics." },
  { year: "2025", title: "Enterprise Sandbox Deployment", desc: "Scaled runtime environments to accommodate isolated organizational development testbeds." },
  { year: "2026", title: "Autonomous Knowledge Synthesis", desc: "Leveraging cutting-edge architectural structures to dynamically generate adaptive learning nodes." },
];

const techStack = [
  { category: "Core Framework", name: "Next.js 15 App Router", utility: "Server Component telemetry optimization" },
  { category: "Styling Engine", name: "Tailwind CSS v4.0", utility: "Zero-runtime CSS variable configuration mapping" },
  { category: "Identity Protocol", name: "Better Auth Client", utility: "Secure edge session parameter checks" },
  { category: "Data Pipeline", name: "GraphQL & Prisma", utility: "High-throughput operational relational indexing" },
];

const faqs = [
  { q: "How does the autonomous skill verification pipeline function?", a: "Each track compiles your sandbox execution parameters and commits an immutable validation metric to your profile state, generating cryptographic certificates upon deployment." },
  { q: "Can corporate configurations integrate with custom API parameters?", a: "Yes. Our enterprise tiers allow structural workspace binding to sync internal tooling telemetry with active training matrices." },
  { q: "What distinguishes this from legacy learning pipelines?", a: "Traditional architectures utilize static video timelines; our engine maps your code execution metrics directly against active production baselines." },
];

const team = [
  { name: "Dr. Evelyn Vance", role: "Chief Architect", initial: "E" },
  { name: "Marcus Kane", role: "Lead Systems Engineer", initial: "M" },
  { name: "Sora Takahashi", role: "Principal Data Strategist", initial: "S" },
];

const AboutPage = () => {
  return (
    <div className="relative min-h-screen bg-background py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      
      {/* Background Ambient Radial Space Lights */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-10 right-[-10%] w-[600px] h-[600px] bg-brand-cyan/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/3 left-[-10%] w-[500px] h-[500px] bg-brand-ocean/5 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-24">
        
        {/* =========================================================
            HEADER TITLE BLOCK
            ========================================================= */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-brand-ocean/10 border border-brand-ocean/20 backdrop-blur-md text-xs font-bold tracking-wider text-brand-ocean uppercase">
            <Sparkles className="w-3 h-3" />
            Our Protocol Baseline
          </span>
          <h1 className="section-title">
            Architecting the Next <span className="text-main-gradient">Knowledge Epoch</span>
          </h1>
          <p className="section-desc max-w-xl mx-auto">
            We build advanced cognitive transmission frameworks designed to construct structural learning modules for modern tech professionals.
          </p>
        </div>

        {/* =========================================================
            HIGH-FIDELITY METRICS GRID
            ========================================================= */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div 
                key={index} 
                className="glass-card rounded-2xl p-5 md:p-6 flex flex-col justify-between group hover:border-brand-cyan transition-all duration-300"
              >
                <div className="w-8 h-8 rounded-lg bg-brand-ocean/10 border border-brand-ocean/20 text-brand-ocean flex items-center justify-center shrink-0 mb-4 transition-transform duration-300 group-hover:scale-105">
                  <IconComponent className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">{stat.value}</h3>
                  <p className="text-[10px] sm:text-xs font-bold text-muted uppercase tracking-wider mt-0.5">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* =========================================================
            CORE STORY SPLIT CONTAINER
            ========================================================= */}
        <div className="grid lg:grid-cols-12 gap-8 items-center glass-card rounded-[32px] p-6 md:p-10">
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-xs font-black text-foreground uppercase tracking-widest flex items-center gap-2">
              <Cpu className="w-4 h-4 text-brand-ocean" /> System Synthesis History
            </h2>
            <h3 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight leading-snug">
              Breaking standard institutional loops to unleash localized talent paradigms.
            </h3>
            <p className="text-secondary font-medium leading-relaxed text-xs sm:text-sm">
              Established as an alternative vector to legacy engineering pipelines, our application integrates structural case configurations explicitly targeted at real-time telemetry datasets. We empower technical units to self-deploy knowledge matrices autonomously.
            </p>
          </div>
          <div className="lg:col-span-5 relative h-48 sm:h-64 lg:h-full min-h-[220px] w-full rounded-2xl overflow-hidden border border-card-border bg-card-bg/60 flex flex-col justify-center items-center p-6 text-center group">
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-cyan/10 via-transparent to-brand-ocean/10 opacity-60 group-hover:opacity-80 transition-opacity" />
            <div className="relative z-10 space-y-3">
              <p className="text-3xl sm:text-4xl font-black text-main-gradient">99.4% API</p>
              <p className="text-muted text-xs font-medium max-w-xs leading-normal">Operational capability sync matrix optimized across distributed continuous learning sectors.</p>
            </div>
          </div>
        </div>

        {/* =========================================================
            OPERATIONAL HISTORICAL TIMELINE
            ========================================================= */}
        <div className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-xs font-black text-foreground uppercase tracking-widest flex items-center gap-2">
              <History className="w-4 h-4 text-brand-ocean" /> Framework Progression Blueprint
            </h2>
            <p className="text-muted text-xs font-bold uppercase tracking-wider">Tracing our structural evolution markers from inception</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative before:absolute before:top-4 before:left-0 before:w-full before:h-[1px] before:bg-foreground/5 hidden lg:grid">
            {milestones.map((ms, idx) => (
              <div key={idx} className="relative pt-6 space-y-2">
                <div className="w-3 h-3 rounded-full bg-brand-ocean border-4 border-background absolute top-2.5 left-0 z-10" />
                <span className="text-xs font-black text-brand-cyan">{ms.year}</span>
                <h4 className="text-sm font-bold text-primary">{ms.title}</h4>
                <p className="text-xs text-secondary leading-relaxed font-medium">{ms.desc}</p>
              </div>
            ))}
          </div>
          {/* Mobile Fallback list */}
          <div className="space-y-4 lg:hidden">
            {milestones.map((ms, idx) => (
              <div key={idx} className="p-4 glass-card rounded-2xl flex gap-4">
                <span className="text-sm font-black text-brand-ocean shrink-0">{ms.year}</span>
                <div className="space-y-1">
                  <h4 className="text-xs sm:text-sm font-bold text-primary">{ms.title}</h4>
                  <p className="text-xs text-secondary font-medium">{ms.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* =========================================================
            PILLARS / CORE MISSION GRID
            ========================================================= */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-xs font-black text-foreground uppercase tracking-widest flex items-center justify-center gap-2">
              <Target className="w-4 h-4 text-brand-ocean" /> Strategic Foundations
            </h2>
            <p className="text-muted text-xs font-bold uppercase tracking-wider">The baseline metrics empowering our deployment framework</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {pillars.map((pillar, idx) => {
              const IconComp = pillar.icon;
              return (
                <div 
                  key={idx} 
                  className="glass-card rounded-2xl p-6 space-y-4 hover:bg-foreground/5 duration-200"
                >
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center border shrink-0"
                    style={{ backgroundColor: `${pillar.color}08`, borderColor: `${pillar.color}20`, color: pillar.color }}
                  >
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="font-bold text-primary text-sm sm:text-base tracking-tight">{pillar.title}</h4>
                    <p className="text-secondary text-xs font-medium leading-relaxed">{pillar.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* =========================================================
            ARCHITECTURAL TECHNICAL LEDGER (TECH STACK)
            ========================================================= */}
        <div className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-xs font-black text-foreground uppercase tracking-widest flex items-center gap-2">
              <Code2 className="w-4 h-4 text-brand-mint" /> Platform Core Infrastructure
            </h2>
            <p className="text-muted text-xs font-bold uppercase tracking-wider">Verified production frameworks operating under the hood</p>
          </div>
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="grid grid-cols-3 bg-card-bg/80 p-4 border-b border-card-border text-[10px] font-black tracking-widest uppercase text-muted">
              <div>Sub-Layer Stack</div>
              <div>Dependency Engine</div>
              <div className="text-right">Runtime Application</div>
            </div>
            <div className="divide-y divide-white/5">
              {techStack.map((tech, idx) => (
                <div key={idx} className="grid grid-cols-3 p-4 items-center text-xs font-medium hover:bg-white/[0.01]">
                  <div className="text-muted font-bold">{tech.category}</div>
                  <div className="text-primary font-black tracking-tight">{tech.name}</div>
                  <div className="text-muted text-right text-[11px] truncate">{tech.utility}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* =========================================================
            SERVER COMPONENT NATIVE FAQ ACCORDION (using <details>)
            ========================================================= */}
        <div className="grid lg:grid-cols-12 gap-8 items-start border-t border-card-border pt-16">
          <div className="lg:col-span-4 space-y-2">
            <h2 className="text-xs font-black text-foreground uppercase tracking-widest flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-brand-cyan" /> System Queries Center
            </h2>
            <p className="text-muted text-xs font-bold uppercase tracking-wider leading-relaxed">
              Addressing terminal configurations, security vectors, and parsing methodology dependencies.
            </p>
          </div>
          <div className="lg:col-span-8 space-y-3">
            {faqs.map((faq, idx) => (
              <details 
                key={idx} 
                className="glass-card rounded-2xl overflow-hidden group [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="list-none w-full text-left p-4 sm:p-5 flex justify-between items-center gap-4 hover:bg-white/[0.02] cursor-pointer select-none">
                  <span className="text-xs sm:text-sm font-bold text-primary tracking-tight">{faq.q}</span>
                  <ChevronDown className="w-4 h-4 text-muted shrink-0 transition-transform duration-300 group-open:rotate-180 group-open:text-brand-ocean" />
                </summary>
                <div className="border-t border-card-border transition-all duration-300">
                  <p className="p-4 sm:p-5 text-xs sm:text-sm text-secondary leading-relaxed font-medium bg-card-bg/20">
                    {faq.a}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* =========================================================
            ARCHITECTURAL TEAM CONTAINER
            ========================================================= */}
        <div className="border-t border-card-border pt-16 space-y-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
            <div className="space-y-2">
              <h2 className="text-xs font-black text-foreground uppercase tracking-widest flex items-center gap-2">
                <Users className="w-4 h-4 text-brand-ocean" /> Core Faculty Nodes
              </h2>
              <p className="text-muted text-xs font-bold uppercase tracking-wider">The engineering minds operating the deployment engines.</p>
            </div>
            <div className="inline-flex items-center gap-1 text-[11px] font-black text-brand-cyan border border-brand-cyan/20 bg-brand-cyan/10 px-3 py-1.5 rounded-lg hover:bg-brand-cyan/20 transition-all uppercase tracking-wider cursor-pointer">
              Faculty Framework <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {team.map((member, index) => (
              <div 
                key={index} 
                className="flex items-center gap-4 p-4 rounded-2xl glass-card hover:border-brand-cyan transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-main-gradient text-white font-black text-lg flex items-center justify-center shrink-0 shadow-card">
                  {member.initial}
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-primary truncate text-sm sm:text-base">{member.name}</h4>
                  <p className="text-[11px] text-muted font-bold tracking-tight truncate mt-0.5 uppercase tracking-wide">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutPage;
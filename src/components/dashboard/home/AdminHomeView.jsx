"use client";

import { useEffect, useState } from "react";
import { getPlatformAnalyticsClient } from "@/lib/api/analytics";
import { getPendingCoursesClient } from "@/lib/api/course";
import { Banknote, Users, BookOpen, AlertCircle, Loader2, ArrowRight, ShieldCheck, TrendingUp, BarChart3, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

// --- MOCK DATA FALLBACKS ---
const mockRevenueData = [
  { month: "Jan", revenue: 12500 },
  { month: "Feb", revenue: 18000 },
  { month: "Mar", revenue: 24000 },
  { month: "Apr", revenue: 32000 },
  { month: "May", revenue: 41000 },
  { month: "Jun", revenue: 58000 },
];

const mockUserDistribution = [
  { name: "Students", value: 85 },
  { name: "Instructors", value: 12 },
  { name: "Admins", value: 3 },
];
const PIE_COLORS = ['#0ea5e9', '#f59e0b', '#ef4444'];

const mockCoursePipeline = [
  { name: "W1", approved: 20, pending: 5 },
  { name: "W2", approved: 35, pending: 12 },
  { name: "W3", approved: 28, pending: 8 },
  { name: "W4", approved: 45, pending: 15 },
  { name: "W5", approved: 50, pending: 3 },
];

const AdminHomeView = ({ user }) => {
  const [analytics, setAnalytics] = useState(null);
  const [pendingCourses, setPendingCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, pendingRes] = await Promise.all([
          getPlatformAnalyticsClient(user.id),
          getPendingCoursesClient(user.id),
        ]);

        if (analyticsRes.success) setAnalytics(analyticsRes);
        if (pendingRes.success) setPendingCourses(pendingRes.data?.slice(0, 4) || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user.id]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-ocean" />
      </div>
    );
  }

  // Use dynamic data if available, otherwise use mock/static data
  const { globalOverview, chartData } = analytics || {};
  
  const totalRevenue = globalOverview?.totalPlatformRevenue || 58000;
  const activeStudents = globalOverview?.totalStudents || 12500;
  const totalInstructors = globalOverview?.totalInstructors || 420;
  const activeCourses = globalOverview?.totalCourses || 850;
  
  const activeRevenueChart = chartData?.length > 0 ? chartData : mockRevenueData;

  return (
    <div className="flex flex-col gap-6">
      {/* =========================================================================
          TOP BANNER & WELCOME
          ========================================================================= */}
      <div className="glass-card rounded-[24px] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-purple-500/10 blur-[80px]" />
        
        <div className="flex items-center gap-5 relative z-10">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-main-gradient text-2xl font-black text-white shadow-card shrink-0">
            {user.name?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-foreground tracking-tight">
              Admin Control Center
            </h2>
            <p className="text-sm font-medium text-muted">
              System overview: Monitor platform health, revenue, and active moderation pipelines.
            </p>
          </div>
        </div>

        <div className="relative z-10 hidden sm:flex items-center gap-3 bg-card-bg/60 border border-card-border px-5 py-3 rounded-2xl shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500 border border-purple-500/20">
            <ShieldCheck size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted">System Status</p>
            <p className="text-xl font-black text-foreground tracking-tight">Healthy</p>
          </div>
        </div>
      </div>

      {/* =========================================================================
          KEY METRICS GRID
          ========================================================================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {[
          { label: "Platform Revenue", value: `$${totalRevenue.toLocaleString()}`, icon: Banknote, color: "text-brand-mint", bg: "bg-brand-mint/10", border: "border-brand-mint/20" },
          { label: "Total Students", value: activeStudents.toLocaleString(), icon: Users, color: "text-brand-ocean", bg: "bg-brand-ocean/10", border: "border-brand-ocean/20" },
          { label: "Active Instructors", value: totalInstructors.toLocaleString(), icon: Users, color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20" },
          { label: "Published Courses", value: activeCourses.toLocaleString(), icon: BookOpen, color: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
        ].map((stat, idx) => (
          <div key={idx} className="glass-card rounded-[20px] p-5 flex flex-col gap-4 group hover:border-foreground/20 transition-all duration-300">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg} ${stat.color} border ${stat.border} transition-transform duration-300 group-hover:scale-110`}>
              <stat.icon size={18} />
            </div>
            <div>
              <p className="text-2xl font-black text-foreground tracking-tight">{stat.value}</p>
              <p className="text-[11px] font-bold text-muted uppercase tracking-wider mt-1">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* =========================================================================
          CHARTS ROW 1: Platform Revenue (Area) & User Demographics (Pie)
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Platform Revenue Chart */}
        <div className="lg:col-span-2 glass-card rounded-[24px] p-6 sm:p-8 flex flex-col h-[380px]">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
              <h3 className="text-lg font-black text-foreground flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-brand-mint" />
                Global Revenue Growth
              </h3>
              <p className="text-xs font-medium text-muted">Platform-wide earnings over the last 6 months</p>
            </div>
            <Link href="/dashboard/platform-analytics" className="text-xs font-bold text-brand-cyan hover:text-brand-ocean transition-colors flex items-center gap-1">
              Full Report <ArrowRight size={14} />
            </Link>
          </div>
          <div className="flex-1 w-full mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activeRevenueChart} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorGlobalRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" vertical={false} />
                <XAxis dataKey="month" stroke="#888" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#888" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}
                  itemStyle={{ color: 'var(--foreground)' }}
                  formatter={(value) => [`$${value}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorGlobalRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Distribution Chart */}
        <div className="glass-card rounded-[24px] p-6 sm:p-8 flex flex-col h-[380px]">
          <div className="space-y-1 mb-2">
            <h3 className="text-lg font-black text-foreground flex items-center gap-2">
              <Users className="h-5 w-5 text-brand-ocean" />
              Demographics
            </h3>
            <p className="text-xs font-medium text-muted">Platform role split</p>
          </div>
          <div className="flex-1 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockUserDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {mockUserDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}
                  itemStyle={{ color: 'var(--foreground)' }}
                  formatter={(value) => [`${value}%`, 'Share']}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', paddingTop: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* =========================================================================
          CHARTS ROW 2: Course Pipeline (Bar) & Pending Actions List
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Course Pipeline Bar Chart */}
        <div className="lg:col-span-2 glass-card rounded-[24px] p-6 sm:p-8 flex flex-col h-[360px]">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
              <h3 className="text-lg font-black text-foreground flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-500" />
                Course Verification Pipeline
              </h3>
              <p className="text-xs font-medium text-muted">Approved vs Pending courses per week</p>
            </div>
          </div>
          <div className="flex-1 w-full mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockCoursePipeline} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" vertical={false} />
                <XAxis dataKey="name" stroke="#888" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#888" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}
                  itemStyle={{ color: 'var(--foreground)' }}
                  cursor={{ fill: 'var(--foreground)', opacity: 0.05 }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
                <Bar dataKey="approved" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} barSize={30} />
                <Bar dataKey="pending" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Action Required: Pending Approvals */}
        <div className="glass-card rounded-[24px] p-6 sm:p-8 flex flex-col h-[360px]">
          <div className="mb-6 flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-black text-foreground flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                Action Required
              </h3>
              <p className="text-xs font-medium text-muted">Pending course approvals</p>
            </div>
          </div>

          <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
            {pendingCourses.length > 0 ? (
              pendingCourses.map((course) => (
                <div key={course._id} className="p-3 rounded-xl border border-card-border bg-card-bg/40 hover:bg-foreground/5 transition-colors group flex items-center gap-4">
                  <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md border border-card-border">
                    <Image
                      src={course.image || "/placeholder-course.jpg"}
                      alt={course?.title || "Course Image"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <h4 className="text-sm font-bold text-foreground group-hover:text-brand-cyan transition-colors truncate">
                      {course.title}
                    </h4>
                    <p className="text-[10px] font-bold text-muted flex items-center gap-1 mt-1">
                      <Clock size={10} /> Needs Review
                    </p>
                  </div>
                  <Link 
                    href={`/dashboard/pending-courses`}
                    className="shrink-0 rounded-lg bg-foreground/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-foreground transition-colors hover:bg-brand-cyan hover:text-background"
                  >
                    Review
                  </Link>
                </div>
              ))
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-card-border p-4 text-center">
                <ShieldCheck className="h-8 w-8 text-brand-mint/50 mb-2" />
                <p className="text-sm font-bold text-muted">All caught up!</p>
                <p className="text-xs font-medium text-muted/70 mt-1">No pending approvals.</p>
              </div>
            )}
          </div>

          <Link href="/dashboard/pending-courses" className="mt-auto pt-4 text-xs font-bold text-brand-cyan hover:text-brand-ocean transition-colors flex items-center gap-1 w-full justify-center border-t border-card-border/50">
            View All Pending <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminHomeView;

"use client";

import { useEffect, useState } from "react";
import { getCoursesByInstructorClient } from "@/lib/api/course";
import { getInstructorAnalyticsClient } from "@/lib/api/analytics";
import { Users, Star, BookOpen, Loader2, ArrowRight, DollarSign, Activity, TrendingUp, BarChart3, MessageSquare, AlertCircle } from "lucide-react";
import Link from "next/link";
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
import Image from "next/image";

// --- MOCK DATA ---
const mockEarningsData = [
  { month: "Jan", revenue: 450 },
  { month: "Feb", revenue: 900 },
  { month: "Mar", revenue: 1200 },
  { month: "Apr", revenue: 1600 },
  { month: "May", revenue: 2100 },
  { month: "Jun", revenue: 2800 },
];

const mockEnrollmentData = [
  { name: "W1", students: 45 },
  { name: "W2", students: 85 },
  { name: "W3", students: 60 },
  { name: "W4", students: 110 },
  { name: "W5", students: 145 },
  { name: "W6", students: 95 },
  { name: "W7", students: 160 },
];

const mockCourseDistribution = [
  { name: "React Pro", value: 45 },
  { name: "Next.js Mastery", value: 30 },
  { name: "UI Design", value: 15 },
  { name: "Node.js", value: 10 },
];
const PIE_COLORS = ['#10b981', '#0ea5e9', '#f59e0b', '#8b5cf6'];

const mockInstructorTasks = [
  { id: 1, title: "Grade Final Projects", course: "React Pro", type: "Grading", due: "Today", priority: "High" },
  { id: 2, title: "Answer Q&A Threads (5)", course: "Next.js Mastery", type: "Support", due: "Tomorrow", priority: "Medium" },
  { id: 3, title: "Update Module 4 Videos", course: "UI Design", type: "Content", due: "In 3 Days", priority: "Low" },
];

const InstructorHomeView = ({ user }) => {
  const [analytics, setAnalytics] = useState(null);
  const [courses, setCourses] = useState([]);
  const [totalCourses, setTotalCourses] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, coursesRes] = await Promise.all([
          getInstructorAnalyticsClient(user.id),
          getCoursesByInstructorClient(user.id, 1, 4),
        ]);

        if (analyticsRes.success) setAnalytics(analyticsRes);
        if (coursesRes.success) {
          setCourses(coursesRes.data || []);
          setTotalCourses(coursesRes.meta?.totalCourses || 0);
        }
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

  const { overview, chartData, enrollmentData, courseDistribution, upcomingTasks } = analytics || {};
  
  const activeChartData = chartData?.length > 0 ? chartData : mockEarningsData;
  const activeEnrollmentData = enrollmentData?.length > 0 ? enrollmentData : mockEnrollmentData;
  const activeCourseDistribution = courseDistribution?.length > 0 ? courseDistribution : mockCourseDistribution;
  const activeInstructorTasks = upcomingTasks?.length > 0 ? upcomingTasks : mockInstructorTasks;
  
  const totalRevenue = overview?.totalRevenue ?? 12450; // Mocked if missing
  const activeStudents = overview?.totalEnrollments ?? 1248; // Mocked if missing

  return (
    <div className="flex flex-col gap-6">
      {/* =========================================================================
          TOP BANNER & WELCOME
          ========================================================================= */}
      <div className="glass-card rounded-[24px] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-brand-mint/10 blur-[80px]" />
        
        <div className="flex items-center gap-5 relative z-10">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-main-gradient text-2xl font-black text-white shadow-card shrink-0">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-foreground tracking-tight">
              Instructor Dashboard
            </h2>
            <p className="text-sm font-medium text-muted">
              Welcome back, {user.name}! Track your revenue, students, and course engagement.
            </p>
          </div>
        </div>

        <div className="relative z-10 hidden sm:flex items-center gap-3 bg-card-bg/60 border border-card-border px-5 py-3 rounded-2xl shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-mint/10 text-brand-mint border border-brand-mint/20">
            <Activity size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted">Profile Status</p>
            <p className="text-xl font-black text-foreground tracking-tight">Top Rated</p>
          </div>
        </div>
      </div>

      {/* =========================================================================
          KEY METRICS GRID
          ========================================================================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {[
          { label: "Total Revenue", value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, color: "text-brand-mint", bg: "bg-brand-mint/10", border: "border-brand-mint/20" },
          { label: "Active Students", value: activeStudents.toLocaleString(), icon: Users, color: "text-brand-ocean", bg: "bg-brand-ocean/10", border: "border-brand-ocean/20" },
          { label: "Average Rating", value: overview?.avgRating?.toFixed(1) || "4.8", icon: Star, color: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
          { label: "Published Courses", value: totalCourses || 4, icon: BookOpen, color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20" },
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
          CHARTS ROW 1: Earnings (Area) & Distribution (Pie)
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Earnings Chart */}
        <div className="lg:col-span-2 glass-card rounded-[24px] p-6 sm:p-8 flex flex-col h-[380px]">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
              <h3 className="text-lg font-black text-foreground flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-brand-mint" />
                Revenue Growth
              </h3>
              <p className="text-xs font-medium text-muted">Monthly earnings over the last 6 months</p>
            </div>
          </div>
          <div className="flex-1 w-full mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activeChartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" vertical={false} />
                <XAxis dataKey="month" stroke="#888" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#888" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}
                  itemStyle={{ color: 'var(--foreground)' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorEarnings)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Course Distribution Chart */}
        <div className="glass-card rounded-[24px] p-6 sm:p-8 flex flex-col h-[380px]">
          <div className="space-y-1 mb-2">
            <h3 className="text-lg font-black text-foreground flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-brand-ocean" />
              Enrollment Share
            </h3>
            <p className="text-xs font-medium text-muted">By course</p>
          </div>
          <div className="flex-1 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={activeCourseDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {activeCourseDistribution.map((entry, index) => (
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
          CHARTS ROW 2: Enrollments (Bar) & Tasks List
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Enrollments Bar Chart */}
        <div className="lg:col-span-2 glass-card rounded-[24px] p-6 sm:p-8 flex flex-col h-[360px]">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
              <h3 className="text-lg font-black text-foreground flex items-center gap-2">
                <Users className="h-5 w-5 text-brand-ocean" />
                Weekly New Enrollments
              </h3>
              <p className="text-xs font-medium text-muted">Student acquisition over the last 7 weeks</p>
            </div>
          </div>
          <div className="flex-1 w-full mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activeEnrollmentData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" vertical={false} />
                <XAxis dataKey="name" stroke="#888" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#888" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}
                  itemStyle={{ color: 'var(--foreground)' }}
                  cursor={{ fill: 'var(--foreground)', opacity: 0.05 }}
                />
                <Bar dataKey="students" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Instructor Tasks / Action Items */}
        <div className="glass-card rounded-[24px] p-6 sm:p-8 flex flex-col h-[360px]">
          <div className="space-y-1 mb-6">
            <h3 className="text-lg font-black text-foreground flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              Action Items
            </h3>
            <p className="text-xs font-medium text-muted">Pending instructor tasks</p>
          </div>

          <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
            {activeInstructorTasks.map((task) => (
              <div key={task.id} className="p-4 rounded-xl border border-card-border bg-card-bg/40 hover:bg-foreground/5 transition-colors cursor-pointer group">
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                    task.type === 'Grading' ? 'text-brand-mint bg-brand-mint/10 border-brand-mint/20' :
                    task.type === 'Support' ? 'text-brand-ocean bg-brand-ocean/10 border-brand-ocean/20' :
                    'text-purple-500 bg-purple-500/10 border-purple-500/20'
                  }`}>
                    {task.type}
                  </span>
                  <span className={`text-[10px] font-bold ${task.priority === 'High' ? 'text-red-500' : 'text-muted'}`}>
                    {task.due}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-foreground group-hover:text-brand-cyan transition-colors line-clamp-1">{task.title}</h4>
                <p className="text-xs font-medium text-muted mt-1 truncate">{task.course}</p>
              </div>
            ))}
          </div>

          <button className="mt-auto pt-4 text-xs font-bold text-brand-cyan hover:text-brand-ocean transition-colors flex items-center gap-1 w-full justify-center border-t border-card-border/50">
            View All Tasks <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* =========================================================================
          MY PUBLISHED COURSES GRID
          ========================================================================= */}
      <div className="space-y-4 mt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-foreground">
            My Published Courses
          </h3>
          <Link href="/dashboard/my-courses" className="text-xs font-bold text-brand-cyan hover:text-brand-ocean transition-colors flex items-center gap-1">
            View All <ArrowRight size={14} />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {courses.map((course) => (
            <div key={course._id} className="group flex flex-col overflow-hidden rounded-[20px] glass-card hover:border-foreground/20 transition-all duration-300 hover:shadow-card hover:-translate-y-1">
              <div className="relative h-36 w-full overflow-hidden border-b border-card-border">
                <Image
                  src={course.image || "/placeholder-course.jpg"}
                  alt={course?.title || "Course Image"}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-3 right-3 rounded-md bg-black/60 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white backdrop-blur-md border border-white/10 shadow-lg">
                  {course.status === "approved" ? "Live" : course.status}
                </div>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h4 className="line-clamp-2 text-sm font-bold text-foreground group-hover:text-brand-cyan transition-colors leading-snug">
                  {course.title}
                </h4>
                <div className="mt-3 flex items-center justify-between text-xs font-bold">
                  <span className="text-muted flex items-center gap-1"><Users size={12}/> {course.enrolledStudents || 0}</span>
                  <span className="text-brand-mint">${course.price}</span>
                </div>
                <div className="mt-auto pt-4">
                  <Link 
                    href={`/dashboard/my-courses/edit/${course._id}`}
                    className="block w-full rounded-xl bg-foreground/5 py-2.5 text-center text-xs font-bold text-foreground transition-colors hover:bg-foreground/10 border border-card-border"
                  >
                    Manage Course
                  </Link>
                </div>
              </div>
            </div>
          ))}
          
          {courses.length === 0 && (
            <div className="col-span-full flex h-48 flex-col gap-3 items-center justify-center rounded-[24px] glass-card border-dashed">
              <BookOpen className="h-8 w-8 text-muted" />
              <p className="text-sm font-bold text-muted">You haven't published any courses yet.</p>
              <Link href="/dashboard/create-course" className="mt-2 px-4 py-2 rounded-lg bg-brand-cyan/10 text-xs font-bold text-brand-cyan hover:bg-brand-cyan/20 transition-colors">
                Create First Course
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstructorHomeView;

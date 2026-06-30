"use client";

import { useEffect, useState } from "react";
import { getEnrolledCoursesClient } from "@/lib/api/course";
import { BookOpen, Flame, Clock, PlayCircle, Loader2, CheckCircle, TrendingUp, Target, Calendar, ArrowRight } from "lucide-react";
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
} from "recharts";

const learningActivityData = [
  { name: "Mon", hours: 1.5 },
  { name: "Tue", hours: 2.5 },
  { name: "Wed", hours: 1.0 },
  { name: "Thu", hours: 3.2 },
  { name: "Fri", hours: 4.0 },
  { name: "Sat", hours: 2.1 },
  { name: "Sun", hours: 3.5 },
];

const upcomingTasks = [
  { id: 1, title: "React Context API Quiz", course: "Advanced React Patterns", due: "Today, 11:59 PM", type: "Quiz" },
  { id: 2, title: "Build a Custom Hook", course: "Advanced React Patterns", due: "Tomorrow, 8:00 PM", type: "Assignment" },
  { id: 3, title: "Next.js App Router Review", course: "Next.js Enterprise", due: "Fri, 11:59 PM", type: "Review" },
];

const StudentHomeView = ({ user }) => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await getEnrolledCoursesClient(user.id);
        if (res.success && res.data) {
          setCourses(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, [user.id]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-ocean" />
      </div>
    );
  }

  const totalEnrolled = courses?.length || 0;
  const completed = user?.stats?.completedCourses ?? 2;
  const watchHours = user?.stats?.watchHours ?? 24.5;
  const streak = user?.stats?.streak ?? 7;

  const activeLearningActivity = user?.stats?.learningActivity?.length > 0 ? user.stats.learningActivity : learningActivityData;
  const activeUpcomingTasks = user?.stats?.upcomingTasks?.length > 0 ? user.stats.upcomingTasks : upcomingTasks;

  const lastAccessedEnrollment = courses[0]; // Just taking the first for demo
  const lastAccessed = lastAccessedEnrollment?.course;

  return (
    <div className="flex flex-col gap-6">
      
      {/* =========================================================================
          TOP BANNER & WELCOME
          ========================================================================= */}
      <div className="glass-card rounded-[24px] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-brand-ocean/10 blur-[80px]" />
        
        <div className="flex items-center gap-5 relative z-10">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-main-gradient text-2xl font-black text-white shadow-card shrink-0">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-foreground tracking-tight">
              Welcome back, {user.name}!
            </h2>
            <p className="text-sm font-medium text-muted">
              You are currently on a <span className="text-orange-500 font-bold">{streak}-day learning streak</span>. Keep it up!
            </p>
          </div>
        </div>

        <div className="relative z-10 hidden sm:flex items-center gap-3 bg-card-bg/60 border border-card-border px-5 py-3 rounded-2xl shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500 border border-orange-500/20">
            <Flame size={20} fill="currentColor" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted">Current Streak</p>
            <p className="text-xl font-black text-foreground tracking-tight">{streak} Days</p>
          </div>
        </div>
      </div>

      {/* =========================================================================
          KEY METRICS GRID
          ========================================================================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {[
          { label: "Enrolled Courses", value: totalEnrolled, icon: BookOpen, color: "text-brand-ocean", bg: "bg-brand-ocean/10", border: "border-brand-ocean/20" },
          { label: "Completed Courses", value: completed, icon: CheckCircle, color: "text-brand-mint", bg: "bg-brand-mint/10", border: "border-brand-mint/20" },
          { label: "Watch Hours", value: watchHours, icon: Clock, color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20" },
          { label: "Overall Progress", value: "68%", icon: TrendingUp, color: "text-brand-cyan", bg: "bg-brand-cyan/10", border: "border-brand-cyan/20" },
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* =========================================================================
            CHART: LEARNING ACTIVITY (Left - 2 Cols)
            ========================================================================= */}
        <div className="lg:col-span-2 glass-card rounded-[24px] p-6 sm:p-8 flex flex-col h-full">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
              <h3 className="text-lg font-black text-foreground flex items-center gap-2">
                <Target className="h-5 w-5 text-brand-cyan" />
                Learning Activity
              </h3>
              <p className="text-xs font-medium text-muted">Hours spent learning over the last 7 days</p>
            </div>
            <select className="bg-card-bg border border-card-border text-foreground text-xs font-bold rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-cyan/50">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>

          <div className="h-[280px] w-full mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activeLearningActivity} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" vertical={false} />
                <XAxis dataKey="name" stroke="#888" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#888" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}
                  itemStyle={{ color: 'var(--foreground)' }}
                />
                <Area type="monotone" dataKey="hours" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* =========================================================================
            UPCOMING TASKS (Right - 1 Col)
            ========================================================================= */}
        <div className="glass-card rounded-[24px] p-6 sm:p-8 flex flex-col h-full">
          <div className="space-y-1 mb-6">
            <h3 className="text-lg font-black text-foreground flex items-center gap-2">
              <Calendar className="h-5 w-5 text-brand-ocean" />
              Upcoming Tasks
            </h3>
            <p className="text-xs font-medium text-muted">Deadlines and pending assignments</p>
          </div>

          <div className="flex flex-col gap-4">
            {activeUpcomingTasks.map((task) => (
              <div key={task.id} className="p-4 rounded-xl border border-card-border bg-card-bg/40 hover:bg-foreground/5 transition-colors cursor-pointer group">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-brand-ocean bg-brand-ocean/10 px-2 py-0.5 rounded-md border border-brand-ocean/20">
                    {task.type}
                  </span>
                  <span className="text-[10px] font-bold text-muted">{task.due}</span>
                </div>
                <h4 className="text-sm font-bold text-foreground group-hover:text-brand-cyan transition-colors line-clamp-1">{task.title}</h4>
                <p className="text-xs font-medium text-muted mt-1 truncate">{task.course}</p>
              </div>
            ))}
          </div>

          <button className="mt-auto pt-6 text-xs font-bold text-brand-cyan hover:text-brand-ocean transition-colors flex items-center gap-1 w-full justify-center">
            View All Tasks <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* =========================================================================
          ACTIVE LEARNING TRACK (Recent Course)
          ========================================================================= */}
      {lastAccessed && (
        <div className="glass-card rounded-[24px] p-6 sm:p-8 relative overflow-hidden group mt-2">
          <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-brand-ocean/5 to-transparent pointer-events-none" />
          
          <h3 className="mb-6 text-lg font-black text-foreground flex items-center gap-2">
            <PlayCircle className="h-5 w-5 text-brand-mint" /> Continue Learning
          </h3>
          
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center relative z-10">
            <div className="h-32 w-full shrink-0 overflow-hidden rounded-xl sm:w-56 border border-card-border relative shadow-lg">
              <Image
                src={lastAccessed.image || "/fallback-course.jpg"}
                alt={lastAccessed?.title || "Course Image"}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <PlayCircle className="text-white h-12 w-12" />
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xl font-black text-foreground tracking-tight">
                    {lastAccessed.title}
                  </h4>
                  <p className="mt-1 text-sm font-medium text-muted line-clamp-2 max-w-2xl">
                    {lastAccessed.description}
                  </p>
                </div>
              </div>
              
              <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-6">
                <div className="flex-1 w-full max-w-md">
                  <div className="mb-2 flex items-center justify-between text-xs font-bold">
                    <span className="text-muted uppercase tracking-wider">Module Progress</span>
                    <span className="text-brand-cyan">35%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-foreground/10 border border-card-border">
                    <div className="h-full rounded-full bg-main-gradient relative" style={{ width: "35%" }}>
                      <div className="absolute right-0 top-0 bottom-0 w-4 bg-white/20 blur-sm" />
                    </div>
                  </div>
                </div>
                
                <Link 
                  href={`/dashboard/my-learning/${lastAccessed._id || lastAccessed.id}`}
                  className="inline-flex items-center justify-center rounded-xl bg-foreground px-6 py-2.5 text-xs font-bold text-background transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Resume Lesson
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          ALL ENROLLED COURSES GRID
          ========================================================================= */}
      <div className="space-y-4 mt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-foreground">
            Your Course Library
          </h3>
          <Link href="/dashboard/my-learning" className="text-xs font-bold text-brand-cyan hover:text-brand-ocean transition-colors">
            View All
          </Link>
        </div>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {courses.slice(1).map((enrollment) => {
            const course = enrollment.course;
            if (!course) return null;
            return (
              <Link key={enrollment._id} href={`/dashboard/my-learning/${course._id || course.id}`} className="group flex flex-col overflow-hidden rounded-[20px] glass-card hover:border-foreground/20 transition-all duration-300 hover:shadow-card hover:-translate-y-1">
                <div className="relative h-36 w-full overflow-hidden border-b border-card-border bg-foreground/5">
                  <Image
                    src={course.image || "/fallback-course.jpg"}
                    alt={course?.title || "Course Image"}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h4 className="line-clamp-2 text-sm font-bold text-foreground group-hover:text-brand-cyan transition-colors leading-snug">
                    {course.title}
                  </h4>
                  <div className="mt-auto pt-5">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-foreground/10">
                      <div className="h-full rounded-full bg-brand-cyan/70" style={{ width: "10%" }}></div>
                    </div>
                    <p className="text-[10px] font-bold text-muted mt-2 uppercase tracking-wider text-right">10% Complete</p>
                  </div>
                </div>
              </Link>
            );
          })}
          {courses.length <= 1 && (
            <div className="col-span-full flex h-48 flex-col gap-3 items-center justify-center rounded-[24px] glass-card border-dashed">
              <BookOpen className="h-8 w-8 text-muted" />
              <p className="text-sm font-bold text-muted">Enroll in more courses to see them here.</p>
              <Link href="/courses" className="mt-2 px-4 py-2 rounded-lg bg-foreground/10 text-xs font-bold text-foreground hover:bg-foreground/20 transition-colors">
                Browse Courses
              </Link>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default StudentHomeView;

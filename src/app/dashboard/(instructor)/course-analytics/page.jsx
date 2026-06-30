"use client";

import React, { useState, useEffect } from "react";
import { DollarSign, Users, Star, Loader2, TrendingUp, Activity, PlayCircle } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { getInstructorAnalyticsClient } from "@/lib/api/analytics";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";
import DashboardPageHeader from "@/components/ui/DashboardPageHeader";

export default function CourseAnalyticsPage() {
  const { data: session, isPending } = useSession();
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!session?.user?.id) return;
      
      setIsLoading(true);
      try {
        const data = await getInstructorAnalyticsClient(session.user.id);
        if (data.success) {
          setAnalytics(data);
        } else {
          console.error("Failed to fetch analytics:", data.message);
        }
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [session?.user?.id]);

  if (isPending || isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-[70vh] gap-4">
        <Loader2 className="w-10 h-10 text-[var(--brand-cyan)] animate-spin" />
        <p className="text-sm font-medium text-muted">Loading Analytics...</p>
      </div>
    );
  }

  const overview = analytics?.overview || { totalEarnings: 0, totalEnrollments: 0, avgRating: 0 };
  
  // Static Mock Data for Fallback
  const staticChartData = [
    { month: "Jan", earnings: 120, enrollments: 10 },
    { month: "Feb", earnings: 250, enrollments: 15 },
    { month: "Mar", earnings: 180, enrollments: 12 },
    { month: "Apr", earnings: 320, enrollments: 20 },
    { month: "May", earnings: 450, enrollments: 25 },
    { month: "Jun", earnings: 600, enrollments: 30 },
  ];
  
  const staticCoursePerformance = [
    { name: "React Masterclass", revenue: 800, rating: 4.8 },
    { name: "Next.js for Beginners", revenue: 550, rating: 4.7 },
    { name: "UI/UX Design", revenue: 400, rating: 4.5 },
  ];

  const hasChartData = analytics?.chartData && analytics.chartData.length > 0;
  const chartData = hasChartData ? analytics.chartData : staticChartData;
  const coursePerformance = analytics?.coursePerformance?.length > 0 ? analytics.coursePerformance : staticCoursePerformance;

  return (
    <div className="w-full space-y-8 pb-12">
      <DashboardPageHeader
        icon={TrendingUp}
        title={
          <>
            Course <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-ocean">Analytics</span>
          </>
        }
        subtitle="Track your financial performance and student engagement."
        rightContent={
          <span className="px-4 py-2 rounded-xl bg-foreground/5 border border-card-border text-xs font-bold text-muted flex items-center gap-2 shadow-sm">
            <Activity size={16} className="text-brand-mint" /> 
            Real-time Metrics
          </span>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Earnings */}
        <div className="glass-card rounded-[24px] p-6 shadow-card hover:-translate-y-1 transition-transform duration-300 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 flex items-center justify-center bg-[var(--brand-mint)]/10 border border-[var(--brand-mint)]/20 rounded-[16px] shadow-inner">
              <DollarSign className="w-6 h-6 text-[var(--brand-mint)] fill-[var(--brand-mint)]/20" />
            </div>
            <h3 className="font-bold text-muted text-sm uppercase tracking-wider">Total Earnings</h3>
          </div>
          <p className="text-3xl sm:text-4xl font-black text-foreground">
            ${overview.totalEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        {/* Total Enrollments */}
        <div className="glass-card rounded-[24px] p-6 shadow-card hover:-translate-y-1 transition-transform duration-300 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 flex items-center justify-center bg-[var(--brand-cyan)]/10 border border-[var(--brand-cyan)]/20 rounded-[16px] shadow-inner">
              <Users className="w-6 h-6 text-[var(--brand-cyan)] fill-[var(--brand-cyan)]/20" />
            </div>
            <h3 className="font-bold text-muted text-sm uppercase tracking-wider">Enrollments</h3>
          </div>
          <p className="text-3xl sm:text-4xl font-black text-foreground">
            {overview.totalEnrollments.toLocaleString()}
          </p>
        </div>

        {/* Average Rating */}
        <div className="glass-card rounded-[24px] p-6 shadow-card hover:-translate-y-1 transition-transform duration-300 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 flex items-center justify-center bg-amber-500/10 border border-amber-500/20 rounded-[16px] shadow-inner">
              <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
            </div>
            <h3 className="font-bold text-muted text-sm uppercase tracking-wider">Avg Rating</h3>
          </div>
          <div className="flex items-end gap-2">
            <p className="text-3xl sm:text-4xl font-black text-foreground">
              {overview.avgRating.toFixed(1)}
            </p>
            <p className="text-sm font-bold text-muted mb-1">/ 5.0</p>
          </div>
        </div>
      </div>

      {!hasChartData && (
        <div className="p-4 bg-[var(--brand-ocean)]/10 border border-[var(--brand-ocean)]/30 rounded-xl text-[var(--brand-ocean)] text-sm font-medium flex items-center gap-2 shadow-sm">
          <Activity className="w-5 h-5 shrink-0" />
          No sufficient data yet. Showing sample analytics below to demonstrate the dashboard features.
        </div>
      )}

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* Revenue & Enrollments Area Chart */}
        <div className="glass-card rounded-[28px] p-6 sm:p-8 shadow-card flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-foreground tracking-tight">Revenue Trend</h2>
            <div className="flex items-center gap-4 text-xs font-bold">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[var(--brand-cyan)] shadow-[0_0_10px_var(--brand-cyan)]" />
                <span className="text-muted">Earnings</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[var(--brand-ocean)] shadow-[0_0_10px_var(--brand-ocean)]" />
                <span className="text-muted">Enrollments</span>
              </div>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--brand-cyan)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--brand-cyan)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorEnrollments" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--brand-ocean)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--brand-ocean)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-card-border" opacity={0.5} />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'var(--text-muted)', fontSize: 12, fontWeight: 500 }} 
                  dy={10}
                />
                <YAxis 
                  yAxisId="left"
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'var(--text-muted)', fontSize: 12, fontWeight: 500 }}
                  tickFormatter={(value) => `$${value}`}
                  width={60}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'var(--text-muted)', fontSize: 12, fontWeight: 500 }}
                  width={40}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: '1px solid var(--card-border)', boxShadow: 'var(--shadow-card)', backgroundColor: 'var(--card-bg)', color: 'var(--foreground)' }}
                  itemStyle={{ fontSize: '14px', fontWeight: 'bold' }}
                />
                <Area 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="earnings" 
                  stroke="var(--brand-cyan)" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorEarnings)" 
                  activeDot={{ r: 6, strokeWidth: 2, fill: 'var(--card-bg)', stroke: 'var(--brand-cyan)' }}
                />
                <Area 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="enrollments" 
                  stroke="var(--brand-ocean)" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorEnrollments)" 
                  activeDot={{ r: 6, strokeWidth: 2, fill: 'var(--card-bg)', stroke: 'var(--brand-ocean)' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Courses Bar Chart */}
        <div className="glass-card rounded-[28px] p-6 sm:p-8 shadow-card flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-foreground tracking-tight">Top Performing Courses</h2>
            <div className="flex items-center gap-2 text-xs font-bold">
              <span className="w-3 h-3 rounded-full bg-[var(--brand-deep)] shadow-[0_0_10px_var(--brand-deep)]" />
              <span className="text-muted">Revenue</span>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={coursePerformance} margin={{ top: 10, right: 0, left: -20, bottom: 0 }} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="currentColor" className="text-card-border" opacity={0.5} />
                <XAxis 
                  type="number"
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'var(--text-muted)', fontSize: 12, fontWeight: 500 }}
                  tickFormatter={(value) => `$${value}`}
                />
                <YAxis 
                  type="category"
                  dataKey="name"
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'var(--text-muted)', fontSize: 12, fontWeight: 500 }}
                  width={140}
                />
                <Tooltip 
                  cursor={{ fill: 'var(--foreground)', opacity: 0.05 }}
                  contentStyle={{ borderRadius: '16px', border: '1px solid var(--card-border)', boxShadow: 'var(--shadow-card)', backgroundColor: 'var(--card-bg)', color: 'var(--foreground)' }}
                  itemStyle={{ fontSize: '14px', fontWeight: 'bold' }}
                />
                <Bar 
                  dataKey="revenue" 
                  fill="var(--brand-deep)" 
                  radius={[0, 8, 8, 0]}
                  barSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

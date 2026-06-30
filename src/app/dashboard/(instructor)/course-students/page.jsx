"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Users, Mail, BookOpen, Clock, Loader2 } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import Pagination from "@/components/ui/Pagination";
import { getInstructorEnrolledStudentsClient } from "@/lib/api/user";
import SearchFilterBar from "@/components/ui/SearchFilterBar";
import DashboardPageHeader from "@/components/ui/DashboardPageHeader";


export default function CourseStudentsPage() {
  const { data: session, isPending } = useSession();
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      if (!session?.user?.id) return;
      
      setIsLoading(true);
      try {
        const data = await getInstructorEnrolledStudentsClient(session.user.id, currentPage, 10);
        
        if (data.success) {
          setStudents(data.data);
          setTotalPages(data.totalPages || 1);
        } else {
          console.error("Failed to fetch students:", data.message);
        }
      } catch (error) {
        console.error("Error fetching students:", error);

      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, [currentPage, session?.user?.id]);

  // Format date helper
  const formatDate = (isoString) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    return new Intl.DateTimeFormat("en-US", { 
      year: "numeric", 
      month: "short", 
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(date);
  };

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-10">
      {/* Header Area */}
      <DashboardPageHeader
        icon={Users}
        title={
          <>
            Enrolled <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-ocean">Students</span>
          </>
        }
        subtitle="Monitor and manage students registered for your published courses."
      />

      <SearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onClearSearch={() => setSearchQuery("")}
        searchPlaceholder="Search by student name, email, or course..."
        filters={[]}
      />

      {/* Content Area */}
      <div className="glass-card rounded-[28px] shadow-card overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center py-24">
            <Loader2 className="w-8 h-8 text-[var(--brand-cyan)] animate-spin" />
          </div>
        ) : students.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
            <div className="w-16 h-16 bg-foreground/5 rounded-full flex items-center justify-center mb-4 border border-card-border">
              <Users className="w-8 h-8 text-muted" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              No students found
            </h3>
            <p className="text-muted max-w-sm mx-auto font-medium">
              No students found matching your criteria. Once they enroll, their details will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-foreground/5 text-xs uppercase font-extrabold text-muted tracking-wider border-b border-card-border">
                <tr>
                  <th scope="col" className="px-6 py-4">Student Info</th>
                  <th scope="col" className="px-6 py-4">Enrolled Course</th>
                  <th scope="col" className="px-6 py-4">Enrollment Date</th>
                  <th scope="col" className="px-6 py-4 text-right">Amount Paid</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-card-border">
                {students.filter(student => 
                  (student.studentName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                  (student.studentEmail || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                  (student.courseTitle || "").toLowerCase().includes(searchQuery.toLowerCase())
                ).map((student) => (
                  <tr key={student._id} className="hover:bg-foreground/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-foreground/10 overflow-hidden shrink-0 border border-card-border shadow-inner">
                          {student.studentImage ? (
                            <Image 
                              src={student.studentImage} 
                              alt={student.studentName || "Student"} 
                              width={40} 
                              height={40}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-[var(--brand-cyan)]/10 text-[var(--brand-cyan)] font-black text-sm">
                              {(student.studentName || "S").charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-foreground">
                            {student.studentName || "Unknown Student"}
                          </div>
                          <div className="text-xs font-medium text-muted flex items-center gap-1 mt-0.5">
                            <Mail className="w-3 h-3" />
                            {student.studentEmail || "No email"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-[var(--brand-ocean)]" />
                        <span className="font-bold text-foreground max-w-[200px] truncate">
                          {student.courseTitle}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 font-medium text-muted">
                        <Clock className="w-4 h-4 text-muted/60" />
                        {formatDate(student.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center justify-center px-3 py-1 rounded-xl bg-[var(--brand-mint)]/10 text-[var(--brand-mint)] border border-[var(--brand-mint)]/20 font-black text-sm shadow-sm">
                        ${student.amount?.toFixed(2) || "0.00"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* COMPULSORY PAGINATION */}
      {students.length > 0 && (
        <Pagination 
          currentPage={currentPage} 
          onPageChange={(page) => setCurrentPage(page)} 
          totalPages={totalPages} 
          useUrlQuery={false}
        />
      )}
    </div>
  );
}

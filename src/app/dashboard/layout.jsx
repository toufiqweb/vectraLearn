export default async function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-muted/20">
        {children}
      </main>
    </div>
  );
}

import AdminSidebar from "../components/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-gray-100 text-gray-900">
      
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main content */}
      <main className="flex-1 p-6">
        {children}
      </main>

    </div>
  );
}

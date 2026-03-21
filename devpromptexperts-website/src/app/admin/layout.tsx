import AdminNavbar from '@/components/AdminNavbar'; // Adjust the import path as needed

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-slate-100">
            {/* Imported Admin Navbar - appears on all admin pages */}
            <AdminNavbar />

            {/* Page content */}
            <main>
                {children}
            </main>
        </div>
    );
}
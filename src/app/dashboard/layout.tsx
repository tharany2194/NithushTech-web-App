import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-slate-50">
            <Sidebar />
            <main className="ml-64 p-8">
                <div className="w-full max-w-6xl">
                    {children}
                </div>
            </main>
        </div>
    );
}

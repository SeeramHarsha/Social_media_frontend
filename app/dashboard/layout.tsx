import { Sidebar } from '@/components/Sidebar';
import { Footer } from '@/components/Footer';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-8">
                {children}
                <Footer />
            </main>
        </div>
    );
}

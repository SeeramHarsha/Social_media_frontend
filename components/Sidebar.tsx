"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Link as LinkIcon, PenTool, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function Sidebar() {
    const pathname = usePathname();
    const { logout } = useAuth();

    const links = [
        { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
        { href: '/dashboard/connections', label: 'Connections', icon: LinkIcon },
        { href: '/dashboard/generate', label: 'Generate Post', icon: PenTool },
        { href: '/dashboard/poster', label: 'Poster Generator', icon: PenTool },
        { href: '/dashboard/create', label: 'Create Post', icon: PenTool },
        { href: '/dashboard/posts', label: 'Posts', icon: LayoutDashboard },
    ];

    return (
        <div className="flex flex-col h-screen w-64 bg-white border-r">
            <div className="p-6">
                <h1 className="text-2xl font-bold">Social SaaS</h1>
            </div>
            <nav className="flex-1 px-4 space-y-2">
                {links.map((link) => {
                    const Icon = link.icon;
                    return (
                        <Link key={link.href} href={link.href}>
                            <Button
                                variant={pathname === link.href ? "secondary" : "ghost"}
                                className="w-full justify-start"
                            >
                                <Icon className="mr-2 h-4 w-4" />
                                {link.label}
                            </Button>
                        </Link>
                    );
                })}
            </nav>
            <div className="p-4 border-t">
                <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50" onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </Button>
            </div>
        </div>
    );
}

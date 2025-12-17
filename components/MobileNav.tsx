"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Link as LinkIcon, PenTool, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function MobileNav() {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();
    const { logout } = useAuth();

    // Copying links from Sidebar for consistency or reusing Sidebar component
    // Reusing Sidebar content within the Sheet is better, but Sidebar has fixed width classes.
    // Let's create a mobile-friendly version of the nav links or cleaner: refactor Sidebar to not have fixed width wrapper if possible,
    // or just render the nav links directly here for simplicity and control.

    const links = [
        { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
        { href: '/dashboard/connections', label: 'Connections', icon: LinkIcon },
        { href: '/dashboard/generate', label: 'Generate Post', icon: PenTool },
        { href: '/dashboard/poster', label: 'Poster Generator', icon: PenTool },
        { href: '/dashboard/create', label: 'Create Post', icon: PenTool },
        { href: '/dashboard/posts', label: 'Posts', icon: LayoutDashboard },
    ];

    return (
        <div className="flex md:hidden items-center p-4 border-b bg-white">
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="mr-2">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle Menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 bg-white w-72">
                    <div className="flex flex-col h-full bg-white">
                        <div className="p-6 border-b">
                            <h1 className="text-2xl font-bold">Social SaaS</h1>
                        </div>
                        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
                            {links.map((link) => {
                                const Icon = link.icon;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setOpen(false)}
                                    >
                                        <Button
                                            variant={pathname === link.href ? "secondary" : "ghost"}
                                            className="w-full justify-start mb-1"
                                        >
                                            <Icon className="mr-2 h-4 w-4" />
                                            {link.label}
                                        </Button>
                                    </Link>
                                );
                            })}
                        </nav>
                        <div className="p-4 border-t">
                            <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => {
                                setOpen(false);
                                logout();
                            }}>
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                            </Button>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
            <h1 className="text-lg font-bold">Social SaaS</h1>
        </div>
    );
}

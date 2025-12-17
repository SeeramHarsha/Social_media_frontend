"use client";

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Plus, Trash2 } from 'lucide-react';

interface SocialAccount {
    _id: string;
    platform: string;
    username?: string;
    connected: boolean;
}

const PLATFORMS = [
    { id: 'facebook_page', authId: 'facebook', name: 'Facebook Page', color: 'bg-blue-600' },
    { id: 'instagram', authId: 'facebook', name: 'Instagram Business', color: 'bg-pink-600' },
    { id: 'linkedin', name: 'LinkedIn', color: 'bg-blue-700' },
    { id: 'twitter', name: 'X (Twitter)', color: 'bg-black' },
    { id: 'youtube', name: 'YouTube', color: 'bg-red-600' },
];

export default function ConnectionsPage() {
    const [accounts, setAccounts] = useState<SocialAccount[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAccounts = async () => {
        try {
            const res = await api.get('/social/');
            setAccounts(res.data);
        } catch (error) {
            console.error("Failed to fetch accounts", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    useEffect(() => {
        // Check for OAuth callback params
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            console.log("DEBUG: Connections Page Mounted. Params:", Object.fromEntries(params.entries()));

            const code = params.get('code');
            const platform = params.get('platform');

            // OAuth 1.0a params
            const oauth_token = params.get('oauth_token');
            const oauth_verifier = params.get('oauth_verifier');

            if (platform && (code || (oauth_token && oauth_verifier))) {
                const connect = async () => {
                    try {
                        await api.post('/social/connect', {
                            platform,
                            code,
                            oauth_token,
                            oauth_verifier
                        });
                        // Clear params
                        window.history.replaceState({}, '', '/dashboard/connections');
                        fetchAccounts();
                    } catch (error) {
                        console.error("Failed to connect platform", error);
                    }
                };
                connect();
            }
        }
    }, []);

    const handleConnect = async (platform: any) => {
        try {
            const authPlatform = platform.authId || platform.id;
            const res = await api.get(`/social/auth/${authPlatform}`);
            if (res.data.url) {
                window.location.href = res.data.url;
            }
        } catch (error) {
            console.error("Failed to get auth url", error);
        }
    };

    const handleDisconnect = async (platform: string) => {
        try {
            await api.delete(`/social/${platform}`);
            fetchAccounts();
        } catch (error) {
            console.error("Failed to disconnect", error);
        }
    };

    const isConnected = (platformId: string) => {
        return accounts.find(acc => acc.platform === platformId && acc.connected);
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Connected Accounts</h2>
                <p className="text-muted-foreground">Manage your social media connections.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {PLATFORMS.map((platform) => {
                    const account = isConnected(platform.id);
                    return (
                        <Card key={platform.id}>
                            <CardHeader>
                                <CardTitle>{platform.name}</CardTitle>
                                <CardDescription>
                                    {account ? `Connected as ${account.username || 'User'}` : 'Not connected'}
                                </CardDescription>
                            </CardHeader>
                            <CardFooter>
                                {account ? (
                                    <Button variant="outline" className="w-full text-red-500 hover:text-red-600" onClick={() => handleDisconnect(platform.id)}>
                                        <Trash2 className="mr-2 h-4 w-4" /> Disconnect
                                    </Button>
                                ) : (
                                    <Button className={`w-full ${platform.color} text-white hover:opacity-90`} onClick={() => handleConnect(platform)}>
                                        <Plus className="mr-2 h-4 w-4" /> {platform.id === 'instagram' ? 'Connect via Facebook' : 'Connect'}
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}

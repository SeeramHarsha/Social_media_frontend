"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { Loader2 } from 'lucide-react';

import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Post {
    _id: string;
    topic: string;
    content: {
        text?: string;
        short_caption?: string;
        long_caption?: string;
        images?: { url: string }[];
    };
    platforms: string[];

    results: Record<string, string | { status: string; url?: string; error?: string }>;
    status: string;
    created_at: string;
}

export default function HistoryPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await api.get('/posts/');
                setPosts(res.data);
            } catch (error) {
                console.error("Failed to fetch posts", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    const handleDelete = async (postId: string) => {
        if (!confirm("Are you sure you want to delete this post?")) return;

        try {
            await api.delete(`/posts/${postId}`);
            setPosts(posts.filter(p => p._id !== postId));
        } catch (error) {
            console.error("Failed to delete post", error);
            alert("Failed to delete post");
        }
    };

    if (loading) {
        return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Posts</h2>
                <p className="text-muted-foreground">View your published posts and their status.</p>
            </div>

            {posts.length === 0 ? (
                <Card>
                    <CardContent className="p-8 text-center text-muted-foreground">
                        No posts found. Start by generating or creating a new post!
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {posts.map((post) => (
                        <Card key={post._id}>
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-lg">{post.topic || "Untitled Post"}</CardTitle>
                                        <CardDescription>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</CardDescription>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                                            {post.status}
                                        </Badge>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(post._id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-4">
                                    {post.content.images && post.content.images.length > 0 && (
                                        <img
                                            src={post.content.images[0].url}
                                            alt="Post"
                                            className="w-24 h-24 object-cover rounded-md border"
                                        />
                                    )}
                                    <div className="flex-1 space-y-2">
                                        <p className="text-sm line-clamp-2">
                                            {post.content.text || post.content.short_caption || post.content.long_caption || "No text content"}
                                        </p>

                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {(post.platforms || []).map(platform => {
                                                const result = (post.results || {})[platform];
                                                const status = typeof result === 'string' ? result : result?.status;
                                                const url = typeof result === 'object' ? result?.url : null;

                                                return (
                                                    <div key={platform} className="flex items-center text-xs border rounded-full px-2 py-1">
                                                        <span className="capitalize font-medium mr-1">{platform}:</span>
                                                        {url ? (
                                                            <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                                View Post
                                                            </a>
                                                        ) : (
                                                            <span className={
                                                                status === 'success'
                                                                    ? 'text-green-600'
                                                                    : 'text-red-600'
                                                            }>
                                                                {status || 'Pending'}
                                                            </span>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Send, Upload, X } from 'lucide-react';

interface SocialAccount {
    _id: string;
    platform: string;
    username?: string;
    connected: boolean;
}

export default function CreatePostPage() {
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [accounts, setAccounts] = useState<SocialAccount[]>([]);
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
    const [publishing, setPublishing] = useState(false);
    const [publishResult, setPublishResult] = useState<any>(null);
    const [uploading, setUploading] = useState(false);

    // Scheduling State
    const [isScheduled, setIsScheduled] = useState(false);
    const [scheduledTime, setScheduledTime] = useState('');

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const res = await api.get('/social/');
                setAccounts(res.data.filter((acc: SocialAccount) => acc.connected));
            } catch (error) {
                console.error("Failed to fetch accounts", error);
            }
        };
        fetchAccounts();
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setImage(null);
        setImagePreview(null);
    };

    const togglePlatform = (platform: string) => {
        setSelectedPlatforms(prev =>
            prev.includes(platform)
                ? prev.filter(p => p !== platform)
                : [...prev, platform]
        );
    };

    const handlePublish = async () => {
        if (!caption && !image) return;
        if (selectedPlatforms.length === 0) return;

        setPublishing(true);
        setPublishResult(null);

        try {
            let imageUrl = null;

            // 1. Upload Image if exists
            if (image) {
                setUploading(true);
                const formData = new FormData();
                formData.append('image', image);

                const uploadRes = await api.post('/posts/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                imageUrl = uploadRes.data.url;
                setUploading(false);
            }

            // 2. Publish
            const content = {
                text: caption,
                images: imageUrl ? [{ url: imageUrl }] : []
            };

            const res = await api.post('/posts/publish', {
                content,
                platforms: selectedPlatforms,
                scheduled_time: isScheduled ? scheduledTime : undefined
            });
            setPublishResult(res.data);

        } catch (error) {
            console.error("Failed to publish", error);
            setPublishResult({ error: "Failed to publish" });
        } finally {
            setPublishing(false);
            setUploading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Create Post</h2>
                <p className="text-muted-foreground">Manually create and publish content.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Post Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Caption</Label>
                        <Textarea
                            placeholder="What's on your mind?"
                            rows={5}
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Image</Label>
                        {!imagePreview ? (
                            <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 transition-colors cursor-pointer relative">
                                <Input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={handleImageChange}
                                />
                                <Upload className="h-8 w-8 mb-2" />
                                <p className="text-sm">Click to upload image</p>
                            </div>
                        ) : (
                            <div className="relative rounded-md overflow-hidden border">
                                <img src={imagePreview} alt="Preview" className="w-full h-64 object-cover" />
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-2 right-2 h-8 w-8"
                                    onClick={removeImage}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2 pt-4">
                        <Label>Publish To</Label>
                        {accounts.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No accounts connected.</p>
                        ) : (
                            <div className="grid grid-cols-2 gap-4">
                                {accounts.map((acc) => (
                                    <div key={acc._id} className="flex items-center space-x-2 border p-3 rounded-md">
                                        <Checkbox
                                            id={acc.platform}
                                            checked={selectedPlatforms.includes(acc.platform)}
                                            onCheckedChange={() => togglePlatform(acc.platform)}
                                        />
                                        <Label htmlFor={acc.platform} className="capitalize cursor-pointer flex-1">{acc.platform}</Label>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="space-y-4 pt-4 border-t">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="schedule"
                                checked={isScheduled}
                                onCheckedChange={(checked) => setIsScheduled(checked as boolean)}
                            />
                            <Label htmlFor="schedule" className="cursor-pointer">Schedule for later</Label>
                        </div>

                        {isScheduled && (
                            <div className="space-y-2">
                                <Label>Select Date & Time</Label>
                                <Input
                                    type="datetime-local"
                                    value={scheduledTime}
                                    onChange={(e) => setScheduledTime(e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground">Select a future date and time for your post.</p>
                            </div>
                        )}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button
                        className="w-full"
                        onClick={handlePublish}
                        disabled={publishing || selectedPlatforms.length === 0 || (!caption && !image) || (isScheduled && !scheduledTime)}
                    >
                        {publishing ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {uploading ? "Uploading..." : "Publishing..."}
                            </>
                        ) : (
                            <>
                                <Send className="mr-2 h-4 w-4" />
                                {isScheduled ? "Schedule Post" : "Publish Now"}
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>

            {
                publishResult && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Results</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {Object.entries(publishResult).map(([platform, result]: [string, any]) => {
                                    const status = typeof result === 'string' ? result : result?.status;
                                    const url = typeof result === 'object' ? result?.url : null;
                                    const error = typeof result === 'object' ? result?.error : null;

                                    return (
                                        <div key={platform} className="flex justify-between items-center border-b pb-2">
                                            <span className="capitalize font-medium">{platform}</span>
                                            <div className="flex flex-col items-end">
                                                <span className={status === 'success' ? 'text-green-600' : 'text-red-600'}>
                                                    {status}
                                                </span>
                                                {url && (
                                                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                                                        View Post
                                                    </a>
                                                )}
                                                {error && (
                                                    <span className="text-xs text-red-500">{error}</span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                )
            }
        </div >
    );
}

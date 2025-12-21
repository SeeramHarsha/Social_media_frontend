"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Send, ArrowLeft, Check, Upload, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface GeneratedContent {
    caption: string;
    hashtags: string[];
    images: { url: string; thumb: string; credit: string }[];
    main_keyword: string;
}

interface SocialAccount {
    _id: string;
    platform: string;
    username?: string;
    connected: boolean;
}

export default function CreatePostPage() {
    const [topic, setTopic] = useState('');
    const [loading, setLoading] = useState(false);
    const [generatedOptions, setGeneratedOptions] = useState<GeneratedContent[]>([]);
    const [selectedOption, setSelectedOption] = useState<GeneratedContent | null>(null);
    const [accounts, setAccounts] = useState<SocialAccount[]>([]);
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
    const [publishing, setPublishing] = useState(false);
    const [publishResult, setPublishResult] = useState<any>(null);

    // Scheduling State
    const [isScheduled, setIsScheduled] = useState(false);
    const [scheduledTime, setScheduledTime] = useState('');
    const [useAiSchedule, setUseAiSchedule] = useState(false);

    const [keywords, setKeywords] = useState<string[]>([]);
    const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
    const [generatingKeywords, setGeneratingKeywords] = useState(false);

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
        // fetchAccounts(); // duplicate call
    }, []);

    const handleGenerateKeywords = async () => {
        if (!topic) return;
        setGeneratingKeywords(true);
        try {
            // Reusing the poster keyword endpoint as it is generic
            const res = await api.post('/poster/keywords', { topic });
            if (res.data.keywords) {
                setKeywords(res.data.keywords);
                setSelectedKeywords([]);
            }
        } catch (error) {
            console.error("Failed to generate keywords", error);
        } finally {
            setGeneratingKeywords(false);
        }
    };

    const toggleKeyword = (keyword: string) => {
        if (selectedKeywords.includes(keyword)) {
            setSelectedKeywords(selectedKeywords.filter(k => k !== keyword));
        } else {
            setSelectedKeywords([...selectedKeywords, keyword]);
        }
    };

    const handleGenerate = async () => {
        if (!topic) return;
        setLoading(true);
        setGeneratedOptions([]);
        setSelectedOption(null);
        setPublishResult(null);

        try {
            const res = await api.post('/posts/generate', {
                topic,
                keywords: selectedKeywords.length > 0 ? selectedKeywords : undefined
            });
            // Backend now returns an array of options
            setGeneratedOptions(res.data);
        } catch (error) {
            console.error("Failed to generate post", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePublish = async () => {
        if (!selectedOption || selectedPlatforms.length === 0) return;
        setPublishing(true);

        // Determine text based on active tab
        let textToPublish = selectedOption.caption;

        try {
            const res = await api.post('/posts/publish', {
                content: { ...selectedOption, text: textToPublish },
                platforms: selectedPlatforms,
                scheduled_time: isScheduled && !useAiSchedule ? new Date(scheduledTime).toISOString() : undefined,
                schedule_type: isScheduled && useAiSchedule ? 'ai' : undefined
            });
            setPublishResult(res.data);
        } catch (error) {
            console.error("Failed to publish", error);
        } finally {
            setPublishing(false);
        }
    };

    const togglePlatform = (platform: string) => {
        setSelectedPlatforms(prev =>
            prev.includes(platform)
                ? prev.filter(p => p !== platform)
                : [...prev, platform]
        );
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Generate Post</h2>
                <p className="text-muted-foreground">Generate AI content and publish to your networks.</p>
            </div>

            {/* Step 1: Topic Input */}
            {!selectedOption && generatedOptions.length === 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Topic</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-4">
                            <Input
                                placeholder="Enter a topic (e.g., 'New AI trends in 2025')"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                disabled={loading}
                            />
                            <Button onClick={handleGenerate} disabled={loading || !topic}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Generate
                            </Button>
                        </div>

                        <div className="space-y-2 mt-4">
                            <Label>AI Keywords (Optional)</Label>
                            <div className="flex gap-2 items-center">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="sm"
                                    onClick={handleGenerateKeywords}
                                    disabled={!topic || generatingKeywords}
                                >
                                    {generatingKeywords ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                                    Generate Keywords
                                </Button>
                                <span className="text-xs text-muted-foreground">
                                    Use AI to find trending keywords for better content.
                                </span>
                            </div>
                        </div>

                        {keywords.length > 0 && (
                            <div className="space-y-2">
                                <Label>Select Keywords</Label>
                                <div className="flex flex-wrap gap-2">
                                    {keywords.map((keyword) => (
                                        <Badge
                                            key={keyword}
                                            variant={selectedKeywords.includes(keyword) ? "default" : "outline"}
                                            className="cursor-pointer hover:opacity-80"
                                            onClick={() => toggleKeyword(keyword)}
                                        >
                                            {keyword}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Step 2: Select Option */}
            {!selectedOption && generatedOptions.length > 0 && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold">Select a Post Option</h3>
                        <Button variant="outline" onClick={() => setGeneratedOptions([])}>Back to Topic</Button>
                    </div>
                    <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
                        {generatedOptions.map((option, index) => (
                            <Card key={index} className="cursor-pointer hover:border-blue-500 transition-colors" onClick={() => setSelectedOption(option)}>
                                <CardHeader>
                                    <CardTitle>Option {index + 1}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {option.images.length > 0 && (
                                        <img src={option.images[0].thumb} alt="Preview" className="w-full h-32 object-cover rounded-md" />
                                    )}
                                    <p className="text-sm text-muted-foreground line-clamp-4">{option.caption}</p>
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full">Select This Post</Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* Step 3: Preview & Publish */}
            {selectedOption && (
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={() => setSelectedOption(null)}>
                                <ArrowLeft className="h-4 w-4 mr-1" /> Back to Options
                            </Button>
                        </div>
                        <Card>
                            <CardHeader>
                                <CardTitle>Preview</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="mt-4">
                                    <Label>Caption</Label>
                                    <Textarea
                                        value={selectedOption.caption}
                                        onChange={(e) => setSelectedOption({ ...selectedOption, caption: e.target.value })}
                                        rows={8}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="mt-4">
                                    <Label>Hashtags</Label>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {selectedOption.hashtags.map((tag, i) => (
                                            <span key={i} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </CardContent >
                        </Card >

                        <Card>
                            <CardHeader>
                                <CardTitle>Select Image</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-2">
                                    {/* Upload Button */}
                                    <div className="relative border-2 border-dashed rounded-md p-4 flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 transition-colors cursor-pointer">
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            onChange={async (e) => {
                                                if (e.target.files && e.target.files[0]) {
                                                    const file = e.target.files[0];
                                                    const formData = new FormData();
                                                    formData.append('image', file);

                                                    try {
                                                        // Show loading state if needed
                                                        const res = await api.post('/posts/upload', formData, {
                                                            headers: { 'Content-Type': 'multipart/form-data' }
                                                        });

                                                        const newImage = {
                                                            url: res.data.url,
                                                            thumb: res.data.url, // Use same URL for thumb
                                                            credit: 'You'
                                                        };

                                                        // Add to images and select it
                                                        const newImages = [newImage, ...selectedOption.images];
                                                        setSelectedOption({ ...selectedOption, images: newImages });

                                                    } catch (error) {
                                                        console.error("Failed to upload image", error);
                                                    }
                                                }
                                            }}
                                        />
                                        <Upload className="h-6 w-6 mb-1" />
                                        <span className="text-xs text-center">Upload Custom</span>
                                    </div>

                                    {selectedOption.images.map((img, i) => (
                                        <div
                                            key={i}
                                            className={`relative group cursor-pointer border-2 rounded-md overflow-hidden ${selectedOption.images[0].url === img.url ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent hover:border-blue-300'}`}
                                            onClick={() => {
                                                // Move selected image to index 0 so it's used for publishing
                                                const newImages = [...selectedOption.images];
                                                const selected = newImages.splice(i, 1)[0];
                                                newImages.unshift(selected);
                                                setSelectedOption({ ...selectedOption, images: newImages });
                                            }}
                                        >
                                            <img src={img.thumb} alt="Preview" className="w-full h-32 object-cover" />
                                            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 truncate">
                                                by {img.credit}
                                            </div>
                                            {selectedOption.images[0].url === img.url && (
                                                <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                                                    <Check className="h-3 w-3" />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div >

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Publish To</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {accounts.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">No accounts connected. Go to Connections to add accounts.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {accounts.map((acc) => (
                                            <div key={acc._id} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={acc.platform}
                                                    checked={selectedPlatforms.includes(acc.platform)}
                                                    onCheckedChange={() => togglePlatform(acc.platform)}
                                                />
                                                <Label htmlFor={acc.platform} className="capitalize">{acc.platform} ({acc.username || 'Connected'})</Label>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="space-y-4 pt-4 mt-4 border-t">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="schedule"
                                            checked={isScheduled}
                                            onCheckedChange={(checked) => setIsScheduled(checked as boolean)}
                                        />
                                        <Label htmlFor="schedule" className="cursor-pointer">Schedule for later</Label>
                                    </div>

                                    {isScheduled && (
                                        <div className="space-y-4 pl-6 border-l-2">
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="aischedule"
                                                    checked={useAiSchedule}
                                                    onCheckedChange={(checked) => setUseAiSchedule(checked as boolean)}
                                                />
                                                <Label htmlFor="aischedule" className="cursor-pointer flex items-center">
                                                    <Sparkles className="h-3 w-3 mr-1 text-purple-500" />
                                                    Smart Schedule (AI Recommended)
                                                </Label>
                                            </div>

                                            {!useAiSchedule && (
                                                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                                    <Label>Select Date & Time</Label>
                                                    <Input
                                                        type="datetime-local"
                                                        value={scheduledTime}
                                                        onChange={(e) => setScheduledTime(e.target.value)}
                                                    />
                                                    <p className="text-xs text-muted-foreground">Select a future date and time.</p>
                                                </div>
                                            )}
                                            {useAiSchedule && (
                                                <p className="text-sm text-muted-foreground italic">
                                                    AI will analyze your content and pick the best engagement time for the next 24 hours.
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    className="w-full"
                                    onClick={handlePublish}
                                    disabled={publishing || selectedPlatforms.length === 0 || (isScheduled && !useAiSchedule && !scheduledTime)}
                                >
                                    {publishing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    <Send className="mr-2 h-4 w-4" />
                                    {isScheduled ? "Schedule Post" : "Publish Post"}
                                </Button>
                            </CardFooter>
                        </Card>

                        {publishResult && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Publishing Results</CardTitle>
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
                        )}
                    </div>
                </div >
            )
            }
        </div >
    );
}

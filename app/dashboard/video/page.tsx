"use client";

import { useState } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Video, Play, Upload } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

export default function VideoGeneratorPage() {
    const [topic, setTopic] = useState('');
    const [loading, setLoading] = useState(false);
    const [script, setScript] = useState<any[]>([]);
    const [videoUrl, setVideoUrl] = useState('');
    const [generating, setGenerating] = useState(false);

    const generateScript = async () => {
        if (!topic) return;
        setLoading(true);
        try {
            const res = await api.post('/video/generate-script', { topic });
            setScript(res.data);
        } catch (error) {
            console.error("Failed to generate script", error);
        } finally {
            setLoading(false);
        }
    };

    const createVideo = async () => {
        if (!script.length) return;
        setGenerating(true);
        try {
            const res = await api.post('/video/create', { script });
            setVideoUrl(res.data.url);
        } catch (error) {
            console.error("Failed to create video", error);
        } finally {
            setGenerating(false);
        }
    };

    const handleSceneChange = (index: number, field: string, value: string) => {
        const newScript = [...script];
        newScript[index][field] = value;
        setScript(newScript);
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-10">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">AI Video Generator</h2>
                <p className="text-muted-foreground">Create short marketing videos for YouTube Shorts & Reels.</p>
            </div>

            <div className="flex gap-4">
                <Input
                    placeholder="Enter video topic (e.g. 'Coffee Shop Promo')"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                />
                <Button onClick={generateScript} disabled={loading || !topic}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Video className="mr-2 h-4 w-4" />}
                    Generate Script
                </Button>
            </div>

            {script.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Review Script & Visuals</h3>
                    {script.map((scene, index) => (
                        <Card key={index}>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Scene {index + 1}</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-xs font-medium">Narration</label>
                                    <Textarea
                                        value={scene.narration}
                                        onChange={(e) => handleSceneChange(index, 'narration', e.target.value)}
                                    />
                                    <label className="text-xs font-medium">Text Overlay</label>
                                    <Input
                                        value={scene.text_overlay}
                                        onChange={(e) => handleSceneChange(index, 'text_overlay', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium">Visual</label>
                                    {scene.selected_image && (
                                        <img src={scene.selected_image} alt="Scene" className="h-32 w-full object-cover rounded-md" />
                                    )}
                                    <p className="text-xs text-muted-foreground">{scene.visual_description}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    <Button onClick={createVideo} disabled={generating} className="w-full" size="lg">
                        {generating ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Video (this may take a minute)...
                            </>
                        ) : (
                            <>
                                <Play className="mr-2 h-4 w-4" /> Create Video
                            </>
                        )}
                    </Button>
                </div>
            )}

            {videoUrl && (
                <Card className="bg-slate-950 border-slate-800">
                    <CardContent className="p-6 flex flex-col items-center space-y-4">
                        <h3 className="text-xl font-semibold text-white">Your Video is Ready!</h3>
                        <video controls className="w-full max-w-md rounded-lg shadow-lg" src={videoUrl} />
                        <Button variant="secondary" onClick={() => window.open(videoUrl, '_blank')}>
                            Download Video
                        </Button>
                        <p className="text-sm text-muted-foreground">
                            To publish to YouTube, go to the <b>Create Post</b> page and upload this video file.
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

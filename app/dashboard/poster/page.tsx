"use client";

import { useState } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2, Upload, Download, RefreshCw, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function PosterGeneratorPage() {
    const [productImage, setProductImage] = useState<File | null>(null);
    const [productPreview, setProductPreview] = useState<string | null>(null);


    const [heading, setHeading] = useState('');
    const [offer, setOffer] = useState('');
    const [contact, setContact] = useState('');
    const [tagline, setTagline] = useState('');

    const [topic, setTopic] = useState('');
    const [keywords, setKeywords] = useState<string[]>([]);
    const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
    const [generatingKeywords, setGeneratingKeywords] = useState(false);

    const [generating, setGenerating] = useState(false);
    const [generatedPoster, setGeneratedPoster] = useState<string | null>(null);

    const handleProductChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setProductImage(file);
            setProductPreview(URL.createObjectURL(file));
        }
    };



    const handleGenerateKeywords = async () => {
        if (!topic) return;
        setGeneratingKeywords(true);
        console.log("Generating keywords for topic:", topic);
        try {
            const res = await api.post('/poster/keywords', { topic });
            console.log("Keyword response:", res.data);
            if (res.data.keywords && res.data.keywords.length > 0) {
                setKeywords(res.data.keywords);
                setSelectedKeywords([]); // Reset selection
            } else {
                alert("No keywords generated. Please try a different topic.");
            }
        } catch (error) {
            console.error("Failed to generate keywords", error);
            alert("Failed to generate keywords. See console for details.");
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
        if (!productImage) return;

        setGenerating(true);
        setGeneratedPoster(null);

        const formData = new FormData();
        formData.append('product_image', productImage);
        formData.append('heading', heading);
        formData.append('offer', offer);
        formData.append('contact', contact);
        formData.append('tagline', tagline);
        formData.append('keywords', JSON.stringify(selectedKeywords));

        try {
            const res = await api.post('/poster/generate', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (res.data.image) {
                setGeneratedPoster(res.data.image);
            }
        } catch (error) {
            console.error("Failed to generate poster", error);
            alert("Failed to generate poster. Please try again.");
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Poster Generator</h2>
                <p className="text-muted-foreground">Create professional marketing posters with AI.</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Inputs */}
                <Card>
                    <CardHeader>
                        <CardTitle>Poster Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                                <Label>Product Image</Label>
                                <div className="border-2 border-dashed rounded-md p-4 flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 transition-colors cursor-pointer relative h-32">
                                    <Input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleProductChange} />
                                    {productPreview ? (
                                        <img src={productPreview} alt="Product" className="h-full w-full object-contain" />
                                    ) : (
                                        <>
                                            <Upload className="h-6 w-6 mb-1" />
                                            <span className="text-xs">Upload Product</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Topic for AI Context</Label>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="e.g. Summer Beach Party"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                />
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={handleGenerateKeywords}
                                    disabled={!topic || generatingKeywords}
                                >
                                    {generatingKeywords ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                                </Button>
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
                                <p className="text-xs text-muted-foreground">Select keywords to influence the poster style.</p>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label>Heading</Label>
                            <Input placeholder="e.g. Summer Sale" value={heading} onChange={(e) => setHeading(e.target.value)} />
                        </div>

                        <div className="space-y-2">
                            <Label>Offer</Label>
                            <Input placeholder="e.g. 50% OFF" value={offer} onChange={(e) => setOffer(e.target.value)} />
                        </div>

                        <div className="space-y-2">
                            <Label>Contact Info</Label>
                            <Input placeholder="e.g. www.example.com" value={contact} onChange={(e) => setContact(e.target.value)} />
                        </div>

                        <div className="space-y-2">
                            <Label>Tagline / Extra Text</Label>
                            <Input placeholder="e.g. Limited time only" value={tagline} onChange={(e) => setTagline(e.target.value)} />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            className="w-full"
                            onClick={handleGenerate}
                            disabled={generating || !productImage}
                        >
                            {generating ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Generating Poster...
                                </>
                            ) : (
                                <>
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Generate Poster
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </Card>

                {/* Output */}
                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle>Generated Poster</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex items-center justify-center bg-muted/20 min-h-[400px]">
                        {generatedPoster ? (
                            <img src={generatedPoster} alt="Generated Poster" className="max-w-full max-h-[600px] shadow-lg rounded-md" />
                        ) : (
                            <div className="text-center text-muted-foreground">
                                <p>Your generated poster will appear here.</p>
                            </div>
                        )}
                    </CardContent>
                    {generatedPoster && (
                        <CardFooter>
                            <Button className="w-full" variant="outline" asChild>
                                <a href={generatedPoster} download="poster.png">
                                    <Download className="mr-2 h-4 w-4" />
                                    Download Poster
                                </a>
                            </Button>
                        </CardFooter>
                    )}
                </Card>
            </div>
        </div>
    );
}

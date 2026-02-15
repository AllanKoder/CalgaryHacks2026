import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Calendar } from 'lucide-react';
import { eventsShow } from '@/route-helpers';

interface SimilarReflection {
    id: number;
    title: string;
    description: string;
    category?: string;
    similarity_score?: number;
    text_score?: number;
    created_at: number;
}

interface SimilarReflectionsProps {
    eventId: number;
}

export default function SimilarReflections({ eventId }: SimilarReflectionsProps) {
    const [similar, setSimilar] = useState<SimilarReflection[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchSimilar();
    }, [eventId]);

    const fetchSimilar = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/events/${eventId}/similar`);
            if (!response.ok) {
                throw new Error('Failed to fetch similar reflections');
            }
            const data = await response.json();
            setSimilar(data.similar_reflections || []);
        } catch (err) {
            console.error('Error fetching similar reflections:', err);
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-purple-500" />
                        Similar Reflections
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground animate-pulse">Finding similar reflections...</p>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-purple-500" />
                        Similar Reflections
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">Unable to find similar reflections at this time.</p>
                </CardContent>
            </Card>
        );
    }

    if (similar.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-purple-500" />
                        Similar Reflections
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        No similar reflections found yet. As you add more reflections, we'll find patterns and connections for you.
                    </p>
                </CardContent>
            </Card>
        );
    }

    const formatDate = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-500" />
                    Similar Reflections
                    <Badge variant="secondary" className="ml-auto">
                        {similar.length} found
                    </Badge>
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-2">
                    Past reflections with similar themes and patterns
                </p>
            </CardHeader>
            <CardContent className="space-y-3">
                {similar.map((reflection) => (
                    <Link
                        key={reflection.id}
                        href={eventsShow(reflection.id)}
                        className="block p-3 rounded-lg border hover:bg-accent transition-colors"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm truncate mb-1">
                                    {reflection.title}
                                </h4>
                                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                                    {reflection.description}
                                </p>
                                <div className="flex items-center gap-2 flex-wrap">
                                    {reflection.category && (
                                        <Badge variant="outline" className="text-xs">
                                            {reflection.category}
                                        </Badge>
                                    )}
                                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <Calendar className="h-3 w-3" />
                                        {formatDate(reflection.created_at)}
                                    </span>
                                </div>
                            </div>
                            {reflection.similarity_score !== undefined && (
                                <Badge
                                    variant="secondary"
                                    className="text-xs shrink-0"
                                >
                                    {Math.round((1 - reflection.similarity_score) * 100)}% match
                                </Badge>
                            )}
                        </div>
                    </Link>
                ))}
            </CardContent>
        </Card>
    );
}

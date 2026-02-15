import { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface User {
    id: number;
    name: string;
}

interface Comment {
    id: number;
    content: string;
    created_at: string;
    user: User;
}

interface CommentsProps {
    commentableType: 'event' | 'identification';
    commentableId: number;
}

export default function Comments({ commentableType, commentableId }: CommentsProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);

    const { data, setData, post, reset, processing, errors } = useForm({
        commentable_type: commentableType,
        commentable_id: commentableId,
        content: '',
    });

    const fetchComments = async () => {
        try {
            const response = await fetch(
                `/comments?commentable_type=${commentableType}&commentable_id=${commentableId}`
            );
            const data = await response.json();
            setComments(data);
        } catch (error) {
            console.error('Failed to fetch comments:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [commentableType, commentableId]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/comments', {
            preserveScroll: true,
            onSuccess: () => {
                reset('content');
                fetchComments();
            },
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Community Comments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Add Comment Form */}
                <form onSubmit={handleSubmit} className="space-y-3">
                    <Textarea
                        placeholder="Share advice, relate a similar experience, recommend resources, or offer support"
                        value={data.content}
                        onChange={(e) => setData('content', e.target.value)}
                        rows={4}
                        maxLength={1000}
                        className="resize-none"
                    />
                    {errors.content && (
                        <p className="text-sm text-destructive">{errors.content}</p>
                    )}
                    <Button type="submit" disabled={processing || !data.content.trim()}>
                        Post Comment
                    </Button>
                </form>

                {/* Comments List */}
                <div className="space-y-3 mt-6">
                    {loading ? (
                        <p className="text-sm text-muted-foreground">Loading comments...</p>
                    ) : comments.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                            No comments yet. Be the first to share your thoughts!
                        </p>
                    ) : (
                        comments.map((comment) => (
                            <div
                                key={comment.id}
                                className="flex gap-3 p-4 rounded-lg border bg-card"
                            >
                                <Avatar className="h-10 w-10">
                                    <AvatarFallback>
                                        {comment.user.name.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-sm">
                                            {comment.user.name}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(comment.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-sm leading-relaxed">{comment.content}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

import { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { commentsStore } from '@/route-helpers';

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
        type: 'advice',
    });

    const commentTypes = [
        { value: 'advice', label: 'Advice', description: 'Share what you would do differently' },
        { value: 'experience', label: 'Similar Experience',  description: 'Share a similar situation you faced' },
        { value: 'resource', label: 'Resource', description: 'Recommend helpful articles, books, or tools' },
        { value: 'support', label: 'Support', description: 'Offer encouragement and empathy' },
    ];

    const getCommentTypeBadge = (type: string) => {
        const typeInfo = commentTypes.find(t => t.value === type);
        return typeInfo ? { label: typeInfo.label }: { label: type };
    };

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
        post(commentsStore(), {
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
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-3">
                        <Label>What kind of support would you like to offer?</Label>
                        <RadioGroup
                            value={data.type}
                            onValueChange={(value) => setData('type', value)}
                            className="grid grid-cols-2 gap-3"
                        >
                            {commentTypes.map((type) => (
                                <div key={type.value} className="flex items-start space-x-2">
                                    <RadioGroupItem value={type.value} id={type.value} />
                                    <Label
                                        htmlFor={type.value}
                                        className="flex-1 cursor-pointer"
                                    >
                                        <div className="flex items-center gap-1">
                                        </div>
                                        <p className="text-xs text-muted-foreground font-normal">
                                            {type.description}
                                        </p>
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>

                    <div className="space-y-2">
                        <Textarea
                            placeholder="Share your thoughts..."
                            value={data.content}
                            onChange={(e) => setData('content', e.target.value)}
                            rows={3}
                            maxLength={1000}
                        />
                        {errors.content && (
                            <p className="text-sm text-destructive">{errors.content}</p>
                        )}
                    </div>

                    <Button type="submit" disabled={processing || !data.content.trim()}>
                        Post {commentTypes.find(t => t.value === data.type)?.label}
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

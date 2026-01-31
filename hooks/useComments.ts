import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Comment, NewComment } from '@/types';

// Mock data store
// Key format: `${targetType}_${targetId}`
const MOCK_COMMENTS: Record<string, Comment[]> = {};

export function useComments(targetId: number, targetType: 'post' | 'location') {
    return useQuery({
        queryKey: ['comments', targetType, targetId],
        queryFn: async () => {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));
            const key = `${targetType}_${targetId}`;
            return MOCK_COMMENTS[key] || [];
        },
        enabled: !!targetId,
    });
}

export function useCommentCount(targetId?: number, targetType: 'post' | 'location' = 'post') {
    return useQuery({
        queryKey: ['comments', 'count', targetType, targetId],
        queryFn: async () => {
            if (!targetId) return 0;
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 200));
            const key = `${targetType}_${targetId}`;
            return (MOCK_COMMENTS[key] || []).length;
        },
        enabled: !!targetId,
    });
}

export function useCreateComment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (newComment: NewComment) => {
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const comment: Comment = {
                id: Date.now(),
                content: newComment.content,
                authorId: newComment.authorId,
                targetId: newComment.targetId,
                targetType: newComment.targetType,
                createdAt: new Date().toISOString(),
                // Mock author details - in real app this comes from backend join
                author: {
                    firstName: 'You',
                    lastName: '',
                }
            };
            
            const key = `${newComment.targetType}_${newComment.targetId}`;
            if (!MOCK_COMMENTS[key]) {
                MOCK_COMMENTS[key] = [];
            }
            MOCK_COMMENTS[key].push(comment);
            return comment;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['comments', variables.targetType, variables.targetId] });
            queryClient.invalidateQueries({ queryKey: ['comments', 'count', variables.targetType, variables.targetId] });
        },
    });
}

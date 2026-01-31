/**
 * Shared UI state components for loading, empty, and error states.
 * Reduces duplication across list components.
 */

import { View, StyleSheet } from 'react-native';
import { Text, ActivityIndicator, Button } from 'react-native-paper';
import { ReactNode } from 'react';

// ============================================
// Loading State Component
// ============================================

type LoadingStateProps = {
    /** Loading message to display */
    message?: string;
    /** Size of the activity indicator */
    size?: 'small' | 'large';
    /** Whether to take full flex space */
    fullScreen?: boolean;
};

/**
 * Reusable loading state with spinner and optional message
 * 
 * @example
 * <LoadingState message="Chargement des lieux..." />
 */
export function LoadingState({
    message = 'Chargement...',
    size = 'large',
    fullScreen = true,
}: Readonly<LoadingStateProps>) {
    return (
        <View style={[styles.container, fullScreen && styles.fullScreen]}>
            <ActivityIndicator size={size} color="#6366f1" />
            {message && (
                <Text variant="bodyMedium" style={styles.loadingText}>
                    {message}
                </Text>
            )}
        </View>
    );
}

// ============================================
// Empty State Component
// ============================================

type EmptyStateProps = {
    /** Main title text */
    title?: string;
    /** Subtitle or description */
    subtitle?: string;
    /** Optional icon component */
    icon?: ReactNode;
    /** Optional action button */
    actionLabel?: string;
    /** Action button callback */
    onAction?: () => void;
    /** Whether to take full flex space */
    fullScreen?: boolean;
};

/**
 * Reusable empty state with title, subtitle, icon, and optional action
 * 
 * @example
 * <EmptyState 
 *   title="Aucun lieu" 
 *   subtitle="Ajoutez votre premier lieu"
 *   actionLabel="Ajouter"
 *   onAction={() => openCreateModal()}
 * />
 */
export function EmptyState({
    title = 'Aucun élément',
    subtitle,
    icon,
    actionLabel,
    onAction,
    fullScreen = true,
}: Readonly<EmptyStateProps>) {
    return (
        <View style={[styles.container, fullScreen && styles.fullScreen]}>
            {icon && <View style={styles.iconContainer}>{icon}</View>}
            <Text variant="bodyLarge" style={styles.emptyTitle}>
                {title}
            </Text>
            {subtitle && (
                <Text variant="bodyMedium" style={styles.emptySubtitle}>
                    {subtitle}
                </Text>
            )}
            {actionLabel && onAction && (
                <Button 
                    mode="contained" 
                    onPress={onAction}
                    style={styles.actionButton}
                >
                    {actionLabel}
                </Button>
            )}
        </View>
    );
}

// ============================================
// Error State Component
// ============================================

type ErrorStateProps = {
    /** Error message to display */
    message?: string;
    /** Optional error details */
    details?: string;
    /** Retry button label */
    retryLabel?: string;
    /** Retry callback */
    onRetry?: () => void;
    /** Whether to take full flex space */
    fullScreen?: boolean;
};

/**
 * Reusable error state with message and optional retry
 * 
 * @example
 * <ErrorState 
 *   message="Erreur de chargement"
 *   onRetry={() => refetch()}
 * />
 */
export function ErrorState({
    message = 'Une erreur est survenue',
    details,
    retryLabel = 'Réessayer',
    onRetry,
    fullScreen = true,
}: Readonly<ErrorStateProps>) {
    return (
        <View style={[styles.container, styles.errorContainer, fullScreen && styles.fullScreen]}>
            <Text variant="bodyLarge" style={styles.errorTitle}>
                {message}
            </Text>
            {details && (
                <Text variant="bodySmall" style={styles.errorDetails}>
                    {details}
                </Text>
            )}
            {onRetry && (
                <Button 
                    mode="outlined" 
                    onPress={onRetry}
                    style={styles.retryButton}
                >
                    {retryLabel}
                </Button>
            )}
        </View>
    );
}

// ============================================
// List Wrapper Component
// ============================================

type ListWrapperProps = {
    /** Whether data is loading */
    isLoading?: boolean;
    /** Error object if any */
    error?: Error | null;
    /** Whether the data is empty */
    isEmpty?: boolean;
    /** Loading message */
    loadingMessage?: string;
    /** Empty state title */
    emptyTitle?: string;
    /** Empty state subtitle */
    emptySubtitle?: string;
    /** Empty state icon */
    emptyIcon?: ReactNode;
    /** Error message */
    errorMessage?: string;
    /** Retry callback for error state */
    onRetry?: () => void;
    /** Children to render when data is ready */
    children: ReactNode;
};

/**
 * Wrapper component that handles loading, error, and empty states
 * 
 * @example
 * <ListWrapper
 *   isLoading={isLoading}
 *   error={error}
 *   isEmpty={data?.length === 0}
 *   loadingMessage="Chargement..."
 *   emptyTitle="Aucun lieu"
 *   onRetry={refetch}
 * >
 *   <FlatList data={data} ... />
 * </ListWrapper>
 */
export function ListWrapper({
    isLoading = false,
    error = null,
    isEmpty = false,
    loadingMessage,
    emptyTitle,
    emptySubtitle,
    emptyIcon,
    errorMessage,
    onRetry,
    children,
}: Readonly<ListWrapperProps>) {
    if (isLoading) {
        return <LoadingState message={loadingMessage} />;
    }

    if (error) {
        return (
            <ErrorState 
                message={errorMessage ?? 'Erreur de chargement'} 
                details={error.message}
                onRetry={onRetry}
            />
        );
    }

    if (isEmpty) {
        return (
            <EmptyState 
                title={emptyTitle} 
                subtitle={emptySubtitle}
                icon={emptyIcon}
            />
        );
    }

    return <>{children}</>;
}

// ============================================
// Styles
// ============================================

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
    },
    fullScreen: {
        flex: 1,
    },
    loadingText: {
        marginTop: 16,
        color: '#6b7280',
    },
    iconContainer: {
        marginBottom: 16,
    },
    emptyTitle: {
        textAlign: 'center',
        color: '#374151',
        fontWeight: '600',
    },
    emptySubtitle: {
        textAlign: 'center',
        color: '#6b7280',
        marginTop: 8,
    },
    actionButton: {
        marginTop: 24,
    },
    errorContainer: {
        backgroundColor: '#fef2f2',
        borderRadius: 12,
        margin: 16,
    },
    errorTitle: {
        textAlign: 'center',
        color: '#dc2626',
        fontWeight: '600',
    },
    errorDetails: {
        textAlign: 'center',
        color: '#991b1b',
        marginTop: 8,
    },
    retryButton: {
        marginTop: 16,
        borderColor: '#dc2626',
    },
});

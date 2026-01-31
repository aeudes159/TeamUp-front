/**
 * Shared utility functions for the TeamUp application.
 * Consolidates common patterns to reduce code duplication.
 */

/**
 * Parse an ID that can be a string or number into a number.
 * Returns undefined if the ID is invalid.
 * 
 * @param id - The ID to parse (string, number, or undefined)
 * @returns The parsed numeric ID, or undefined if invalid
 * 
 * @example
 * parseId('123') // 123
 * parseId(456) // 456
 * parseId('abc') // undefined
 * parseId(undefined) // undefined
 */
export function parseId(id: string | number | undefined | null): number | undefined {
    if (id === undefined || id === null) return undefined;
    const num = typeof id === 'string' ? parseInt(id, 10) : id;
    return isNaN(num) ? undefined : num;
}

/**
 * Check if a parsed ID is valid (truthy and not NaN)
 * 
 * @param id - The ID to check
 * @returns true if the ID is valid
 */
export function isValidId(id: number | undefined): id is number {
    return id !== undefined && !isNaN(id);
}

/**
 * Format a date string to a localized French format.
 * 
 * @param dateString - ISO date string or null
 * @param options - Intl.DateTimeFormatOptions for customization
 * @returns Formatted date string
 * 
 * @example
 * formatDate('2026-01-30T14:30:00Z') // "30 janvier à 14:30"
 * formatDate(null) // ''
 */
export function formatDate(
    dateString: string | null | undefined,
    options: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit',
    }
): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', options);
}

/**
 * Format a date to relative time (e.g., "il y a 2 heures" or "dans 3 jours")
 * 
 * @param dateString - ISO date string
 * @returns Relative time string
 */
export function formatRelativeTime(dateString: string | null | undefined): string {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const absDiffMs = Math.abs(diffMs);
    const isPast = diffMs > 0;
    
    const absDiffMinutes = Math.floor(absDiffMs / 60000);
    const absDiffHours = Math.floor(absDiffMinutes / 60);
    const absDiffDays = Math.floor(absDiffHours / 24);

    if (absDiffMinutes < 1) return 'À l\'instant';
    
    if (isPast) {
        // Past dates
        if (absDiffMinutes < 60) return `Il y a ${absDiffMinutes} min`;
        if (absDiffHours < 24) return `Il y a ${absDiffHours}h`;
        if (absDiffDays < 7) return `Il y a ${absDiffDays}j`;
    } else {
        // Future dates
        if (absDiffMinutes < 60) return `Dans ${absDiffMinutes} min`;
        if (absDiffHours < 24) return `Dans ${absDiffHours}h`;
        if (absDiffDays < 7) return `Dans ${absDiffDays}j`;
    }
    
    return formatDate(dateString, { day: 'numeric', month: 'short' });
}

/**
 * Format a price with Euro currency
 * 
 * @param price - The price value
 * @param showFree - Whether to show "Gratuit" for 0 values
 * @returns Formatted price string
 * 
 * @example
 * formatPrice(25) // "25 €"
 * formatPrice(0) // "Gratuit"
 * formatPrice(null) // ""
 */
export function formatPrice(
    price: number | null | undefined,
    showFree: boolean = true
): string {
    if (price === null || price === undefined) return '';
    if (price === 0 && showFree) return 'Gratuit';
    return `${price} €`;
}

/**
 * Truncate a string to a maximum length with ellipsis
 * 
 * @param text - The text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated string
 */
export function truncate(text: string | null | undefined, maxLength: number): string {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return `${text.slice(0, maxLength - 3)}...`;
}

/**
 * Get initials from a name
 * 
 * @param firstName - First name
 * @param lastName - Last name  
 * @returns Initials (e.g., "JD")
 */
export function getInitials(
    firstName: string | null | undefined,
    lastName: string | null | undefined
): string {
    const first = firstName?.charAt(0)?.toUpperCase() ?? '';
    const last = lastName?.charAt(0)?.toUpperCase() ?? '';
    return `${first}${last}` || '?';
}

/**
 * Get full name from first and last name
 * 
 * @param firstName - First name
 * @param lastName - Last name
 * @param fallback - Fallback value if both are empty
 * @returns Full name
 */
export function getFullName(
    firstName: string | null | undefined,
    lastName: string | null | undefined,
    fallback: string = 'Utilisateur'
): string {
    const name = `${firstName ?? ''} ${lastName ?? ''}`.trim();
    return name || fallback;
}

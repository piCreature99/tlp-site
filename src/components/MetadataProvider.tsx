import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { Brand, Category, Tag } from './types/types';

// 1. Define the shape of your metadata
interface Metadata {
    categories: Category[];
    brands: Brand[];
    tags: Tag[];
}

interface MetadataContextType extends Metadata {
    loading: boolean;
    error: string | null;
}

// 2. Initialize the Context with an undefined default
const MetadataContext = createContext<MetadataContextType | undefined>(undefined);

export const MetadataProvider = ({ children }: { children: React.ReactNode }) => {
    const [data, setData] = useState<Metadata>({ categories: [], brands: [], tags: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [catRes, brandRes, tagRes] = await Promise.all([
                    fetch('/api/categories'),
                    fetch('/api/brands'),
                    fetch('/api/tags')
                ]);

                setData({
                    categories: await catRes.json(),
                    brands: await brandRes.json(),
                    tags: await tagRes.json()
                });
            } catch (err) {
                setError('Failed to load metadata');
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    const value = useMemo(() => ({ ...data, loading, error }), [data, loading, error]);

    return <MetadataContext.Provider value={value}>{children}</MetadataContext.Provider>;
};

// 3. Create a custom hook for easy access
export const useMetadata = () => {
    const context = useContext(MetadataContext);
    if (context === undefined) {
        throw new Error('useMetadata must be used within a MetadataProvider');
    }
    return context;
};
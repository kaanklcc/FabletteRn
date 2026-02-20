/**
 * ═══════════════════════════════════════════════════════════════
 * FEATURED STORY REPOSITORY IMPLEMENTATION
 * ═══════════════════════════════════════════════════════════════
 * 
 * Firestore Collection: /featuredStories
 * 
 * Her şey Firebase'den gelir: yazı, görsel, ses
 */

import {
    collection,
    getDocs,
    getDoc,
    doc,
    query,
    where,
    orderBy,
    Timestamp,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { FeaturedStory, StoryPage } from '@/domain/entities/FeaturedStory';
import { IFeaturedStoryRepository } from '@/domain/repositories/IFeaturedStoryRepository';

export class FeaturedStoryRepositoryImpl implements IFeaturedStoryRepository {
    private collectionName = 'featuredStories';

    /**
     * Tüm aktif featured hikayeleri getir
     */
    async getFeaturedStories(): Promise<FeaturedStory[]> {
        try {
            const ref = collection(db, this.collectionName);
            const q = query(
                ref,
                where('active', '==', true),
                orderBy('order', 'asc')
            );

            const snapshot = await getDocs(q);
            return snapshot.docs.map((d) => this.mapDoc(d.id, d.data()));
        } catch (error) {
            console.error('❌ Featured stories fetch error:', error);
            throw error;
        }
    }

    /**
     * ID ile tek bir featured hikaye getir
     */
    async getFeaturedStoryById(storyId: string): Promise<FeaturedStory | null> {
        try {
            const ref = doc(db, this.collectionName, storyId);
            const snap = await getDoc(ref);

            if (!snap.exists()) return null;
            return this.mapDoc(snap.id, snap.data());
        } catch (error) {
            console.error('❌ Featured story fetch error:', error);
            return null;
        }
    }

    /**
     * Firestore document → FeaturedStory entity
     */
    private mapDoc(id: string, data: any): FeaturedStory {
        // Pages array'ini map et (lokalize alanlar dahil)
        const pages: StoryPage[] = (data.pages || []).map((p: any, index: number) => ({
            pageNumber: p.pageNumber || index + 1,
            content: p.content || '',
            content_tr: p.content_tr || undefined,
            imageUrl: p.imageUrl || '',
            audioUrl: p.audioUrl || undefined,
            audio_tr: p.audio_tr || undefined,
        }));

        return {
            id,
            title: data.title || '',
            title_tr: data.title_tr || undefined,
            coverImageUrl: data.coverImageUrl || '',
            pages,
            audioUrl: data.audioUrl || undefined,
            theme: data.theme || '',
            order: data.order || 0,
            active: data.active ?? true,
            createdAt: data.createdAt
                ? (data.createdAt as Timestamp).toDate()
                : new Date(),
        };
    }
}

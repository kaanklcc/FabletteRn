/**
 * ═══════════════════════════════════════════════════════════════
 * STORY REPOSITORY IMPLEMENTATION
 * ═══════════════════════════════════════════════════════════════
 * 
 * IStoryRepository interface'inin Firestore implementasyonu
 */

import {
    collection,
    addDoc,
    getDocs,
    getDoc,
    deleteDoc,
    doc,
    serverTimestamp,
    query,
    orderBy,
    Timestamp,
} from 'firebase/firestore';
import { db, auth } from '@/config/firebase';
import { Story, CreateStoryDTO } from '@/domain/entities/Story';
import { IStoryRepository } from '@/domain/repositories/IStoryRepository';
import { STORY_GENERATION } from '@/config/constants';

export class StoryRepositoryImpl implements IStoryRepository {
    /**
     * Hikaye kaydet
     * Firestore: users/{userId}/hikayeler
     * 
     * DiscoveryBox2'deki saveStoryForUserWithMultipleImages() karşılığı
     */
    async saveStory(story: CreateStoryDTO): Promise<string> {
        const storiesRef = collection(db, 'users', story.userId, 'hikayeler');

        const docRef = await addDoc(storiesRef, {
            title: story.title,
            hikaye: story.content,
            imageUrl: story.imageUrls[0] || null,
            imageUrls: story.imageUrls,
            timestamp: serverTimestamp(),
        });

        return docRef.id;
    }

    /**
     * Kullanıcının tüm hikayelerini getir
     */
    async getUserStories(userId: string): Promise<Story[]> {
        const storiesRef = collection(db, 'users', userId, 'hikayeler');
        const q = query(storiesRef, orderBy('timestamp', 'desc'));
        const querySnapshot = await getDocs(q);

        const stories: Story[] = [];
        querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            stories.push({
                id: docSnap.id,
                title: data.title || '',
                content: data.hikaye || '',
                imageUrl: data.imageUrl || undefined,
                imageUrls: data.imageUrls || [],
                timestamp: data.timestamp
                    ? (data.timestamp as Timestamp).toDate()
                    : new Date(),
            });
        });

        return stories;
    }

    /**
     * Hikaye sil
     */
    async deleteStory(userId: string, storyId: string): Promise<void> {
        const storyRef = doc(db, 'users', userId, 'hikayeler', storyId);
        await deleteDoc(storyRef);
    }

    /**
     * Tek bir hikayeyi ID ile getir
     * Kaydedilen hikayeyi sayfa formatına dönüştürür
     */
    async getStoryById(storyId: string): Promise<Story | null> {
        const userId = auth.currentUser?.uid;
        if (!userId) {
            throw new Error('Kullanıcı girişi gerekli');
        }

        const storyRef = doc(db, 'users', userId, 'hikayeler', storyId);
        const storyDoc = await getDoc(storyRef);

        if (!storyDoc.exists()) {
            return null;
        }

        const data = storyDoc.data();
        const content = data.hikaye || '';
        const imageUrls: string[] = data.imageUrls || [];

        // İçeriği sayfalara ayır (---SAYFA--- ile bölünmüşse)
        const rawPages = content
            .split(STORY_GENERATION.PAGE_DELIMITER)
            .map((p: string) => p.trim())
            .filter((p: string) => p.length > 0);

        // İlk sayfanın başındaki olası başlığı temizle
        if (rawPages.length > 0) {
            const firstLines = rawPages[0].split('\n');
            if (firstLines.length > 1) {
                const firstLine = firstLines[0].replace(/^[#*]+\s*/, '').replace(/[*#]/g, '').trim();
                if (firstLine.length > 0 && firstLine.length < 80) {
                    rawPages[0] = firstLines.slice(1).join('\n').trim();
                }
            }
        }

        // Sayfaları oluştur
        const pages = rawPages.length > 0
            ? rawPages.map((pageContent: string, index: number) => ({
                pageNumber: index + 1,
                content: pageContent,
                imageUrl: imageUrls[index] || '',
                imagePrompt: '',
            }))
            : [{
                pageNumber: 1,
                content: content,
                imageUrl: imageUrls[0] || '',
                imagePrompt: '',
            }];

        return {
            id: storyDoc.id,
            title: data.title || '',
            content,
            imageUrl: data.imageUrl || undefined,
            imageUrls,
            timestamp: data.timestamp
                ? (data.timestamp as Timestamp).toDate()
                : new Date(),
            pages,
        };
    }

    async generateStory(prompt: string): Promise<string> {
        throw new Error('Cloud Functions kullanılıyor - CloudFunctionsService.ts');
    }

    async generateImage(prompt: string): Promise<string> {
        throw new Error('Cloud Functions kullanılıyor - CloudFunctionsService.ts');
    }
}

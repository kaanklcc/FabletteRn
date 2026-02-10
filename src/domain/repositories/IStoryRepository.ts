/**
 * IStoryRepository Interface
 * 
 * Hikaye işlemleri için sözleşme.
 * 
 * Kotlin karşılığı:
 * DiscoveryBox2'de repository pattern yok, doğrudan DataSource kullanılıyor.
 * Clean Architecture'da önce interface, sonra implementation.
 */

import { Story, CreateStoryDTO } from '../entities/Story';

export interface IStoryRepository {
    /**
     * Kullanıcının tüm hikayelerini getir
     * 
     * @param userId - Kullanıcı ID
     * @returns Promise<Story[]>
     * 
     * Kotlin karşılığı:
     * DiscoveryBoxDataSource.getUserStories(userId, onResult)
     */
    getUserStories(userId: string): Promise<Story[]>;

    /**
     * Yeni hikaye kaydet
     * 
     * @param story - Kaydedilecek hikaye
     * @returns Promise<string> - Oluşturulan hikaye ID'si
     * 
     * Kotlin karşılığı:
     * DiscoveryBoxDataSource.saveStoryForUserWithMultipleImages(...)
     */
    saveStory(story: CreateStoryDTO): Promise<string>;

    /**
     * Hikaye sil
     * 
     * @param userId - Kullanıcı ID
     * @param storyId - Silinecek hikaye ID
     * @returns Promise<void>
     * 
     * Kotlin karşılığı:
     * DiscoveryBoxDataSource.deleteStory(userId, storyId, onResult)
     */
    deleteStory(userId: string, storyId: string): Promise<void>;

    /**
     * Tek bir hikayeyi ID ile getir
     * 
     * @param storyId - Hikaye ID
     * @returns Promise<Story | null>
     */
    getStoryById(storyId: string): Promise<Story | null>;

    /**
     * AI ile hikaye oluştur
     * 
     * @param prompt - Hikaye oluşturma prompt'u
     * @returns Promise<string> - Oluşturulan hikaye metni
     * 
     * Kotlin karşılığı:
     * DiscoveryBoxDataSource.generateStory(prompt)
     * (Cloud Functions üzerinden Gemini API çağrısı)
     */
    generateStory(prompt: string): Promise<string>;

    /**
     * AI ile görsel oluştur
     * 
     * @param prompt - Görsel oluşturma prompt'u
     * @returns Promise<string> - Oluşturulan görsel URL'i
     * 
     * Kotlin karşılığı:
     * DiscoveryBoxDataSource.generateImageWithGemini(prompt)
     */
    generateImage(prompt: string): Promise<string>;
}

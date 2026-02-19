/**
 * ═══════════════════════════════════════════════════════════════
 * STORY HELPERS
 * ═══════════════════════════════════════════════════════════════
 *
 * Dil seçimine göre doğru hikaye içeriğini döndüren yardımcı
 * fonksiyonlar.
 */

import { FeaturedStory, StoryPage } from '@/domain/entities/FeaturedStory';

/** Dile göre doğru başlığı döndürür */
export function getLocalizedTitle(story: FeaturedStory, language: 'tr' | 'en'): string {
    if (language === 'tr' && story.title_tr) return story.title_tr;
    return story.title;
}

/** Dile göre doğru sayfa içeriğini döndürür */
export function getLocalizedPageContent(page: StoryPage, language: 'tr' | 'en'): string {
    if (language === 'tr' && page.content_tr) return page.content_tr;
    return page.content;
}

/** Dile göre doğru sayfa sesini döndürür */
export function getLocalizedPageAudio(page: StoryPage, language: 'tr' | 'en'): string | undefined {
    if (language === 'tr' && page.audio_tr) return page.audio_tr;
    return page.audioUrl;
}

/** Tüm sayfaları dile göre localize eder (ViewerPage formatında) */
export function getLocalizedPages(
    pages: StoryPage[],
    language: 'tr' | 'en'
): { pageNumber: number; content: string; imageUrl: string; audioUrl?: string }[] {
    return pages.map(p => ({
        pageNumber: p.pageNumber,
        content: getLocalizedPageContent(p, language),
        imageUrl: p.imageUrl,
        audioUrl: getLocalizedPageAudio(p, language),
    }));
}

/**
 * ═══════════════════════════════════════════════════════════════
 * MOCK STORY DATA
 * ═══════════════════════════════════════════════════════════════
 * 
 * Test için kullanılacak mock hikaye verisi.
 * API çağrıları yapmadan loading ekranlarını ve story viewer'ı test etmek için.
 */

import { GeneratedStory } from '@/store/queries/useStoryGeneration';

export const MOCK_STORY_DATA: GeneratedStory = {
    title: "Küçük Ayı'nın Uyku Macerası",
    fullContent: `Bir zamanlar, küçük bir ayı vardı. Her gece uyumakta zorluk çekiyordu.

---SAYFA---

Bir gece, annesi ona ay ışığının büyüsünü anlattı. "Ay seni koruyacak" dedi.

---SAYFA---

Küçük ayı pencereden aya baktı, gözleri yavaşça kapandı ve tatlı rüyalara daldı.`,
    pages: [
        {
            pageNumber: 1,
            content: "Bir zamanlar, küçük bir ayı vardı. Her gece uyumakta zorluk çekiyordu. Yatağında dönüp durur, uyku bir türlü gelmezdi. Annesi her gece ona ninni söylerdi ama küçük ayı hala uyanık kalırdı.",
            imagePrompt: "Cute little bear cub in pajamas lying in bed, unable to sleep, children's book illustration style",
            imageUrl: null, // Will be set to local asset
            audioUrl: null,
        },
        {
            pageNumber: 2,
            content: "Bir gece, annesi ona ay ışığının büyüsünü anlattı. 'Ay seni koruyacak ve güzel rüyalar getirecek' dedi. Küçük ayı merakla dinledi. Belki de ay gerçekten yardım edebilirdi.",
            imagePrompt: "Mother bear telling bedtime story to little bear cub, moonlight coming through window, warm and cozy atmosphere",
            imageUrl: null, // Will be set to local asset
            audioUrl: null,
        },
        {
            pageNumber: 3,
            content: "Küçük ayı pencereden parlayan aya baktı. Ay ona gülümsüyor gibiydi. Gözleri yavaşça kapandı ve tatlı rüyalara daldı. O geceden sonra her gece ayın ışığında huzurla uyudu.",
            imagePrompt: "Little bear sleeping peacefully in bed with moonlight shining through window, dreamy atmosphere",
            imageUrl: null, // Will be set to local asset
            audioUrl: null,
        },
    ],
};

/**
 * Mock görselleri yerel asset'lerden yükle
 */
export function getMockStoryWithImages(): GeneratedStory {
    const story = { ...MOCK_STORY_DATA };

    // Her sayfa için yerel görselleri ata
    story.pages = story.pages.map((page, index) => ({
        ...page,
        // Sırayla sleepy, ay, anne görsellerini kullan
        imageUrl: index === 0
            ? require('../../../assets/sleepy.png')
            : index === 1
                ? require('../../../assets/ay.png')
                : require('../../../assets/anne.png'),
    }));

    return story;
}

/**
 * Türkçe çeviri dosyası
 */
export default {
    // ─── Common ──────────────────────────────────────────────
    common: {
        cancel: 'İptal',
        delete: 'Sil',
        yes: 'Evet',
        no: 'Hayır',
        ok: 'Tamam',
        error: 'Hata',
        warning: 'Uyarı',
        loading: 'Yükleniyor...',
        or: 'veya',
        next: 'İleri',
        premium: 'Premium',
    },

    // ─── Profile Screen ──────────────────────────────────────
    profile: {
        title: 'Profil',
        accountStatus: 'Hesap Durumu',
        premiumMember: 'Premium Üye',
        freeMember: 'Ücretsiz Üye',
        upgrade: 'Yükselt',
        privacyPolicy: 'Gizlilik Politikası',
        termsOfUse: 'Kullanım Şartları',
        aiDisclosureTitle: 'Yapay Zeka İçeriği',
        aiDisclosureMessage:
            'Bu uygulama hikaye, görsel ve ses üretmek için yapay zeka modelleri (OpenAI GPT, Google Gemini) kullanır. İçerikler otomatik olarak oluşturulur ve her zaman çocuklar için uygun olmayabilir. Paylaşmadan önce lütfen gözden geçirin.',
        logout: 'Çıkış Yap',
        logoutTitle: 'Çıkış Yapmak İstiyor Musunuz?',
        logoutMessage: 'Çıkış yapmak istediğinize emin misiniz?',
        deleteAccount: 'Hesabı Sil',
        deleteAccountTitle: 'Hesabı Sil',
        deleteAccountMessage:
            'Bu işlem geri alınamaz. Tüm verileriniz silinecektir.',
        defaultUser: 'Kullanıcı',
    },

    // ─── Create Story Screen ─────────────────────────────────
    create: {
        headerTitle: 'Hikayeni Oluştur',
        headerSubtitle: 'Hayal gücün yaşasın',
        themeTitle: 'Tema',
        themeSubtitle: 'Tema seç',
        themes: {
            adventure: 'Macera',
            love: 'Aşk',
            friendship: 'Dostluk',
            family: 'Aile',
            action: 'Aksiyon',
            scifi: 'Bilim Kurgu',
        },
        lengthTitle: 'Hikaye Uzunluğu',
        lengthSubtitle: 'Uzunluk seç',
        lengths: {
            short: 'Kısa',
            medium: 'Orta',
            long: 'Uzun',
        },
        topicTitle: 'Konu',
        topicPlaceholder: 'Örn: Uzay macerası',
        mainCharacterTitle: 'Ana Karakter',
        mainCharacterPlaceholder: 'Örn: Cesur bir astronot',
        supportingTitle: 'Yardımcı Karakterler',
        supportingSubtitle: 'Karakter ekle',
        locationTitle: 'Mekan',
        locationPlaceholder: 'Örn: Uzak bir galaksi',
        traitTitle: 'Ana Karakter Özelliği',
        traitPlaceholder: 'Örn: Cesur ve meraklı',
        generateButton: 'Hikayeyi Oluştur',
        validation: {
            fillFields: 'Lütfen tüm alanları doldurun',
            selectTheme: 'Lütfen bir tema seçin',
            selectLength: 'Lütfen hikaye uzunluğu seçin',
            loginRequired: 'Giriş yapmanız gerekiyor',
        },
        noCredits: {
            title: 'Hikaye Hakkınız Bitti',
            message:
                'Hikaye oluşturmak için premium satın alın veya reklam izleyin.',
            buyPremium: 'Premium Al',
        },
        premiumRequired: {
            title: 'Premium Gerekli',
            message: 'Bu uzunluk için premium üyelik gereklidir',
        },
    },

    // ─── Saved Stories Screen ────────────────────────────────
    saved: {
        title: 'Hikaye Koleksiyonum',
        storySaved: '{{count}} sihirli hikaye kaydedildi',
        loading: 'Hikayeler yükleniyor...',
        errorTitle: 'Hikayeler yüklenemedi',
        errorSubtitle: 'Lütfen tekrar deneyin',
        deleteTitle: 'Hikayeyi Sil',
        deleteMessage: 'Bu hikayeyi silmek istediğinize emin misiniz?',
        deleteError: 'Hikaye silinemedi',
        emptyTitle: 'Henüz kaydedilmiş hikaye yok',
        emptySubtitle: 'İlk hikayeni oluştur ve buradan tekrar oku!',
        createButton: 'Hikaye Oluştur',
    },

    // ─── Story Viewer ─────────────────────────────────────────
    storyViewer: {
        pageIndicator: 'Sayfa {{current}} / {{total}}',
        saveButton: 'Hikayeyi Kaydet',
        savedBadge: '✅ Hikaye kaydedildi',
        loading: 'Hikaye yükleniyor...',
        generating: 'Hazırlanıyor...',
        generatingHint: 'Bu birkaç dakika sürebilir...',
        errorTitle: 'Hikaye oluşturulamadı',
        errorTitleNotFound: 'Hikaye bulunamadı',
        retryButton: 'Tekrar Dene',
        goBackButton: 'Geri Dön',
        voiceFree: '🔊 Ücretsiz Ses',
        voicePremium: '👑 Premium Ses',
        previous: 'Önceki',
        next: 'Sonraki',
    },

    // ─── Home Screen Components ──────────────────────────────
    home: {
        subtitle: 'AI Hikaye Arkadaşın',
        welcome: 'Hoş geldin küçük hikaye anlatıcısı! 🌟',
        createTitle: 'Hikaye Oluşturmaya Başla',
        createSubtitle: 'Hikayeni sen belirle, biz sana yardımcı olalım',
        createCta: 'Sihirli Hikaye Oluştur',
        featuredTitle: 'Öne Çıkan Hikayeler',
        featuredLoading: 'Hikayeler yükleniyor...',
        featuredError: 'Hikayeler yüklenemedi',
        featuredErrorSub: 'Lütfen internet bağlantınızı kontrol edin',
        featuredEmpty: 'Henüz hikaye yok',
    },

    // ─── Onboarding ──────────────────────────────────────────
    onboarding: {
        screen1: {
            welcome: 'Hoş geldin, küçük hikaye anlatıcısı!',
            storyMagic: 'Hikaye Sihri',
            infoTitle: 'AI sihriyle harika hikayeler oluştur!',
            infoDesc:
                'Her hikaye benzersiz ve sadece senin için özel yapılmış. Hayal gücün kanat çırpsın!',
        },
        screen2: {
            safe: 'Güvenli & Güvenilir',
            forParents: 'Ebeveynler İçin',
            infoTitle: 'Çocuklarınız İçin Güvenilir AI',
            infoDesc:
                'AI ile oluşturulan güvenli, yaşa uygun hikayeler. Çocuğunuzun yaratıcılığını ve hayal gücünü güvenli bir ortamda izleyin.',
        },
    },

    // ─── Premium Screen ──────────────────────────────────────
    premium: {
        title: 'Çocuğunuza Özel\nKişiselleştirilmiş Hikayeler',
        bullets: {
            bullet1: 'Çocuğunuzun adı.',
            bullet2: 'Seçtiğiniz ders.',
            bullet3: 'Saniyeler içinde yepyeni bir uyku hikayesi.',
        },
        features: {
            feature1: 'Çocuğunuzun yaşına uygun hikayeler',
            feature2: 'Eğitici & değer odaklı hikaye anlatımı',
            feature3: 'Yüksek kaliteli doğal seslendirme',
            feature4: 'İstediğiniz zaman yeni hikayeler',
        },
        packages: {
            weekly: {
                label: 'Haftalık Plan',
                stories: '3 Hikaye',
                price: '₺99.99',
                period: '/ hafta',
                subtitle: 'Denemek için ideal.',
            },
            monthly: {
                label: 'Aylık Plan',
                stories: '20 Hikaye',
                price: '₺349.99',
                period: '/ ay',
                subtitle: 'Günlük uyku hikayeleri için en iyi değer.',
            },
            popularBadge: 'En Popüler – {{label}}',
        },
        ctaButton: 'Hikayeleri Oluşturmaya Başla',
        cancelText: 'İstediğiniz zaman iptal edin. Taahhüt yok.',
        disclaimer: 'Abonelik iptal edilmediği sürece otomatik olarak yenilenir.\nApp Store ayarlarınızdan yönetebilir veya iptal edebilirsiniz.',
        termsOfUse: 'Kullanım Şartları',
        privacyPolicy: 'Gizlilik Politikası',
        parentalGate: {
            title: 'Ebeveyn Onayı',
            message: 'Lütfen devam etmek için aşağıdaki soruyu cevaplayın:',
            placeholder: 'Cevabınız',
            wrongAnswer: 'Yanlış cevap!',
            cancel: 'İptal',
            continue: 'Devam Et',
        },
        alerts: {
            userNotFound: 'Kullanıcı bulunamadı',
        },
        purchaseSuccess: 'Satın Alma Başarılı',
        purchaseMessage: 'Premium üyeliğiniz aktif edildi! ({{days}} gün, {{stories}} hikaye)',
        purchaseError: 'Premium aktivasyonu sırasında bir hata oluştu.',
        userNotFound: 'Kullanıcı bulunamadı',
    },
} as const;

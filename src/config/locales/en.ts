/**
 * English translation file
 */
export default {
  // ─── Common ──────────────────────────────────────────────
  common: {
    cancel: "Cancel",
    delete: "Delete",
    yes: "Yes",
    no: "No",
    ok: "OK",
    error: "Error",
    warning: "Warning",
    loading: "Loading...",
    or: "or",
    next: "Next",
    premium: "Premium",
  },

  // ─── Profile Screen ──────────────────────────────────────
  profile: {
    title: "Profile",
    accountStatus: "Account Status",
    premiumMember: "Premium Member",
    freeMember: "Free Member",
    upgrade: "Upgrade",
    privacyPolicy: "Privacy Policy",
    termsOfUse: "Terms of Use",
    aiDisclosureTitle: "AI-Generated Content",
    aiDisclosureMessage:
      "This app uses artificial intelligence models (OpenAI GPT, Google Gemini) to generate stories, images, and audio. Content is automatically generated and may not always be appropriate for children. Please review before sharing.",
    logout: "Log Out",
    logoutTitle: "Log Out?",
    logoutMessage: "Are you sure you want to log out?",
    deleteAccount: "Delete Account",
    deleteAccountTitle: "Delete Account",
    deleteAccountMessage:
      "This action cannot be undone. All your data will be deleted.",
    defaultUser: "User",
  },

  // ─── Create Story Screen ─────────────────────────────────
  create: {
    headerTitle: "Create Your Story",
    headerSubtitle: "Let your imagination fly",
    themeTitle: "Theme",
    themeSubtitle: "Select a theme",
    themes: {
      adventure: "Adventure",
      love: "Love",
      friendship: "Friendship",
      family: "Family",
      action: "Action",
      scifi: "Sci-Fi",
    },
    lengthTitle: "Story Length",
    lengthSubtitle: "Select length",
    lengths: {
      short: "Short",
      medium: "Medium",
      long: "Long",
    },
    topicTitle: "Topic",
    topicPlaceholder: "e.g. Space adventure",
    mainCharacterTitle: "Main Character",
    mainCharacterPlaceholder: "e.g. A brave astronaut",
    supportingTitle: "Supporting Characters",
    supportingSubtitle: "Add characters",
    locationTitle: "Location",
    locationPlaceholder: "e.g. A distant galaxy",
    traitTitle: "Main Character Trait",
    traitPlaceholder: "e.g. Brave and curious",
    generateButton: "Generate Story",
    validation: {
      fillFields: "Please fill in all required fields",
      selectTheme: "Please select a theme",
      selectLength: "Please select a story length",
      loginRequired: "You need to sign in first",
    },
    noCredits: {
      title: "Out of Stories",
      message: "Purchase premium or watch an ad to create more stories.",
      buyPremium: "Get Premium",
    },
    premiumRequired: {
      title: "Premium Required",
      message: "This length requires a premium membership",
    },
  },

  // ─── Saved Stories Screen ────────────────────────────────
  saved: {
    title: "My Story Collection",
    storySaved: "{{count}} magical stories saved",
    loading: "Loading stories...",
    errorTitle: "Could not load stories",
    errorSubtitle: "Please try again",
    deleteTitle: "Delete Story",
    deleteMessage: "Are you sure you want to delete this story?",
    deleteError: "Could not delete story",
    emptyTitle: "No saved stories yet",
    emptySubtitle: "Create your first story and read it again here!",
    createButton: "Create Story",
  },

  // ─── Story Viewer ─────────────────────────────────────────
  storyViewer: {
    pageIndicator: "Page {{current}} / {{total}}",
    saveButton: "Save Story",
    savedBadge: "✅ Story saved",
    loading: "Loading story...",
    generating: "Preparing...",
    generatingHint: "This may take a few minutes...",
    errorTitle: "Story could not be created",
    errorTitleNotFound: "Story not found",
    retryButton: "Try Again",
    goBackButton: "Go Back",
    voiceFree: "🔊 Free Voice",
    voicePremium: "👑 Premium Voice",
    previous: "Previous",
    next: "Next",
  },

  // ─── Home Screen Components ──────────────────────────────
  home: {
    subtitle: "Your AI Story Friend",
    welcome: "Welcome, little storyteller! 🌟",
    createTitle: "Start Creating a Story",
    createSubtitle: "You decide the story, we help you along",
    createCta: "Create Magical Story",
    featuredTitle: "Featured Stories",
    featuredLoading: "Loading stories...",
    featuredError: "Could not load stories",
    featuredErrorSub: "Please check your internet connection",
    featuredEmpty: "No stories yet",
  },

  // ─── Onboarding ──────────────────────────────────────────
  onboarding: {
    screen1: {
      welcome: "Welcome, little storyteller!",
      storyMagic: "Story Magic",
      infoTitle: "Create amazing stories with AI magic!",
      infoDesc:
        "Every tale is unique and specially made just for you. Let your imagination soar!",
    },
    screen2: {
      safe: "Safe & Trusted",
      forParents: "For Parents",
      infoTitle: "Trusted AI for Your Children",
      infoDesc:
        "Safe, age-appropriate stories created with AI. Monitor your child's creativity and imagination in a secure environment.",
    },
  },

  // ─── Premium Screen ──────────────────────────────────────
  premium: {
    title: "Personalized Stories\nSpecially for Your Child",
    bullets: {
      bullet1: "Your child's name.",
      bullet2: "The lesson you choose.",
      bullet3: "A brand new bedtime story in seconds.",
    },
    features: {
      feature1: "Age-appropriate stories for your child",
      feature2: "Educational & value-focused storytelling",
      feature3: "High-quality natural voice narration",
      feature4: "New stories whenever you want",
    },
    packages: {
      weekly: {
        label: "Weekly Plan",
        stories: "3 Stories",
        price: "$2.99",
        period: "/ week",
        subtitle: "Perfect for trying out.",
      },
      monthly: {
        label: "Monthly Plan",
        stories: "20 Stories",
        price: "$9.99",
        period: "/ month",
        subtitle: "Best value for daily bedtime stories.",
      },
      popularBadge: "Most Popular – {{label}}",
    },
    ctaButton: "Start Creating Stories",
    cancelText: "Cancel anytime. No commitment.",
    disclaimer:
      "Subscription automatically renews unless cancelled.\nManage or cancel from your App Store settings.",
    termsOfUse: "Terms of Use",
    privacyPolicy: "Privacy Policy",
    parentalGate: {
      title: "Parental Consent",
      message: "Please answer the following question to continue:",
      placeholder: "Your answer",
      wrongAnswer: "Wrong answer!",
      cancel: "Cancel",
      continue: "Continue",
    },
    alerts: {
      userNotFound: "User not found",
    },
    purchaseSuccess: "Purchase Successful",
    purchaseMessage:
      "Your premium membership is active! ({{days}} days, {{stories}} stories)",
    purchaseError: "An error occurred during premium activation.",
    userNotFound: "User not found",
  },
} as const;

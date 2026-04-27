/**
 * Marketing / app-shell strings (landing, pricing, auth, account, paywall…).
 * Three locales — Portuguese, Spanish, English. Browser language is auto-detected
 * on first visit; users can switch via the language picker in the nav.
 */

export type Locale = 'en' | 'pt' | 'es'
export const SUPPORTED_LOCALES: Locale[] = ['en', 'pt', 'es']

export interface MarketingStrings {
  // Nav
  navPricing: string
  navHowItWorks: string
  navFAQ: string
  navLogin: string
  navGetStarted: string
  navOpenApp: string
  navAccount: string

  // Footer
  footerTagline: string
  footerProduct: string
  footerAccount: string
  footerLegal: string
  footerSignup: string
  footerManage: string
  footerPrivacy: string
  footerTerms: string
  footerMade: string

  // Hero
  heroBadge: string
  heroTitle1: string
  heroTitle2: string
  heroSubtitle: string
  heroCtaFree: string
  heroCtaApp: string
  heroCtaPricing: string

  // How it works
  howTitle: string
  howSubtitle: string
  howStep1Title: string
  howStep1Body: string
  howStep2Title: string
  howStep2Body: string
  howStep3Title: string
  howStep3Body: string

  // Features
  featuresTitle: string
  featTalkTitle: string
  featTalkBody: string
  featPacksTitle: string
  featPacksBody: string
  featStreakTitle: string
  featStreakBody: string
  featReferTitle: string
  featReferBody: string
  featPrivacyTitle: string
  featPrivacyBody: string
  featPwaTitle: string
  featPwaBody: string

  // Pricing teaser
  pricingTitle: string
  pricingSubtitle: string
  pricingFreeName: string
  pricingFreeTagline: string
  pricingFreeCtaGuest: string
  pricingFreeCtaUser: string
  pricingBasicName: string
  pricingBasicTagline: string
  pricingBasicCta: string
  pricingProName: string
  pricingProTagline: string
  pricingProCta: string
  pricingPriceFree: string
  pricingPriceBasic: string
  pricingPriceBasicCadence: string
  pricingPricePro: string
  pricingPriceProCadence: string
  pricingMostPopular: string
  pricingCurrentPlan: string

  // Plan features (lists)
  planFreeFeats: string[]
  planBasicFeats: string[]
  planProFeats: string[]
  planFreeTeaserFeats: string[]
  planBasicTeaserFeats: string[]
  planProTeaserFeats: string[]

  // FAQ
  faqTitle: string
  faqQ1: string
  faqA1: string
  faqQ2: string
  faqA2: string
  faqQ3: string
  faqA3: string
  faqQ4: string
  faqA4: string
  faqQ5: string
  faqA5: string

  // Final CTA
  finalCtaTitle: string
  finalCtaSubtitle: string

  // Pricing page extras
  pricingPageTitle: string
  pricingPageSubtitle: string
  pricingPageGuarantee: string
  pricingPageManage: string
  pricingPageRedirecting: string
  pricingPageBillingDisabled: string

  // Auth shared
  authEmail: string
  authPassword: string
  authName: string
  authNameOptional: string
  authReferral: string
  authReferralPlaceholder: string

  // Login
  loginPageTitle: string
  loginWelcome: string
  loginSubtitle: string
  loginCta: string
  loginSubmitting: string
  loginNoAccount: string
  loginCreate: string
  loginFailed: string

  // Signup
  signupPageTitle: string
  signupTitle: string
  signupSubtitle: string
  signupPasswordHint: string
  signupCta: string
  signupSubmitting: string
  signupTerms1: string
  signupTermsAnd: string
  signupAlready: string
  signupLogin: string
  signupFailed: string
  signupShortPassword: string

  // Account
  accountTitle: string
  accountPlan: string
  accountStatusActive: string
  accountStatusCanceled: string
  accountStatusPastDue: string
  accountUpgradePro: string
  accountChooseBasic: string
  accountManageBilling: string
  accountStreak: string
  accountStreakDays: string
  accountStreakHint: string
  accountStreakLast: (date: string) => string
  accountUsage: string
  accountUsageTranslations: string
  accountUsageSynth: string
  accountUsageClones: string
  accountReferral: string
  accountReferralCopy: string
  accountReferralCopied: string
  accountReferralCount: (n: number) => string
  accountReferralCopyDescription: string
  accountOpenApp: string
  accountSeePlans: string
  accountLogout: string
  accountCheckoutSuccess: string
  accountCheckoutPending: (tier: string) => string
  accountContinueCheckout: string
  accountCheckoutFailed: string
  accountPortalFailed: string
  accountLoadFailed: string

  // Paywall
  paywallVoiceCloneTitle: string
  paywallVoiceCloneCopy: string
  paywallTalkModeTitle: string
  paywallTalkModeCopy: string
  paywallUnlimitedTitle: string
  paywallUnlimitedCopy: string
  paywallPacksTitle: string
  paywallPacksCopy: string
  paywallUpgradeBasic: string
  paywallUpgradePro: string
  paywallRedirecting: string
  paywallBillingDisabled: string
  paywallCompare: string
  paywallClose: string

  // Upgrade banner
  bannerFree: string
  bannerBasic: string
  bannerSeePlans: string
  bannerUpgrade: string
  bannerBetaTitle: string
  bannerBetaBody: string

  // Legal
  legalLastUpdated: string
  privacyTitle: string
  privacyIntro: string
  privacyDataHeader: string
  privacyDataItems: string[]
  privacyNeverHeader: string
  privacyNeverItems: string[]
  privacyDeleteHeader: string
  privacyDeleteBody: string
  termsTitle: string
  termsIntro: string
  termsSubsHeader: string
  termsSubsBody: string
  termsRefundsHeader: string
  termsRefundsBody: string
  termsLiabilityHeader: string
  termsLiabilityBody: string

  // Misc
  loading: string
  errorGeneric: string
  langPickerLabel: string
  appBackHome: string
}

const en: MarketingStrings = {
  navPricing: 'Pricing',
  navHowItWorks: 'How it works',
  navFAQ: 'FAQ',
  navLogin: 'Log in',
  navGetStarted: 'Get started',
  navOpenApp: 'Open app',
  navAccount: 'Account',

  footerTagline: 'Speak any language — in your own voice.',
  footerProduct: 'Product',
  footerAccount: 'Account',
  footerLegal: 'Legal',
  footerSignup: 'Sign up',
  footerManage: 'Manage account',
  footerPrivacy: 'Privacy',
  footerTerms: 'Terms',
  footerMade: 'Made with care.',

  heroBadge: 'Voice cloning · Real-time translation',
  heroTitle1: 'Speak any language',
  heroTitle2: 'in your own voice.',
  heroSubtitle:
    'CAPPISCO clones your voice once and lets you hear yourself speaking Italian, Spanish, French, English, Portuguese and more. Real-time, two-way, with cultural notes.',
  heroCtaFree: 'Start free — no card needed',
  heroCtaApp: 'Open the app',
  heroCtaPricing: 'See pricing',

  howTitle: 'How it works',
  howSubtitle: 'Three steps. About a minute the first time. Then it just works.',
  howStep1Title: 'Record once',
  howStep1Body:
    'Read a short passage out loud — about 30 seconds. We create a personal voice profile tied to your account.',
  howStep2Title: 'Translate anything',
  howStep2Body:
    "Speak or type a phrase. We translate it into the language you're learning, with cultural notes for tricky idioms.",
  howStep3Title: 'Hear yourself',
  howStep3Body:
    'The translation plays back in your own voice. Hear what you sound like in another language — instantly.',

  featuresTitle: 'Built for real conversations',
  featTalkTitle: 'Talk mode (Pro)',
  featTalkBody:
    "A real-time, two-way translator. Each person speaks their own language; the other hears it — in the speaker's own voice. Hand the phone over and keep the chat going.",
  featPacksTitle: 'Phrase packs',
  featPacksBody:
    'Travel, restaurants, business, small talk. Curated phrases ready to practice in your voice — perfect for trips and presentations.',
  featStreakTitle: 'Daily streak',
  featStreakBody: 'Practice every day, build the streak. Small dopamine hits, big language gains.',
  featReferTitle: 'Refer friends, get a free month',
  featReferBody:
    'Share your code. Friends get 14 days free; you get a month off your subscription for every paid signup.',
  featPrivacyTitle: 'Private by design',
  featPrivacyBody:
    'Your voice clone is bound to your account. We never share or train on your voice. Cancel anytime, full deletion in one click.',
  featPwaTitle: 'Mobile-first PWA',
  featPwaBody: 'Works in the browser, installs to your home screen. No app store, no waiting.',

  pricingTitle: 'Pricing',
  pricingSubtitle:
    "Start free. Unlock voice cloning on Basic. Add the two-way Talk mode on Pro.",
  pricingFreeName: 'Free',
  pricingFreeTagline: 'See it in action',
  pricingFreeCtaGuest: 'Start free',
  pricingFreeCtaUser: 'Open the app',
  pricingBasicName: 'Basic',
  pricingBasicTagline: 'Your own voice, unlimited',
  pricingBasicCta: 'Choose Basic',
  pricingProName: 'Pro',
  pricingProTagline: 'Two voices, two languages',
  pricingProCta: 'Choose Pro',
  pricingPriceFree: '$0',
  pricingPriceBasic: '$9.99',
  pricingPriceBasicCadence: '/month',
  pricingPricePro: '$19.99',
  pricingPriceProCadence: '/month',
  pricingMostPopular: 'Most popular',
  pricingCurrentPlan: 'Your current plan',

  planFreeFeats: [
    '5 translations / day',
    'System voice fallback',
    'Cultural notes',
    'All 9 languages',
  ],
  planBasicFeats: [
    'Everything in Free',
    'Clone your voice',
    'Unlimited translations',
    'Phrase packs (travel, restaurant, business…)',
    'Download MP3 audio',
    '50,000 synthesis chars / month',
  ],
  planProFeats: [
    'Everything in Basic',
    '✨ Talk mode (live two-way translator)',
    "Clone a partner's voice",
    '250,000 synthesis chars / month',
    'Priority support',
  ],
  planFreeTeaserFeats: [
    '5 translations / day',
    "System voice (your phone's)",
    'Cultural notes',
    'All 9 languages',
  ],
  planBasicTeaserFeats: [
    'Everything in Free',
    'Clone your voice (ElevenLabs)',
    'Unlimited translations',
    'Phrase packs',
    'Download MP3 audio',
  ],
  planProTeaserFeats: [
    'Everything in Basic',
    '✨ Talk mode (real-time chat)',
    "Clone a partner's voice",
    'Higher monthly limits',
    'Priority support',
  ],

  faqTitle: 'Questions',
  faqQ1: 'Is it really my voice?',
  faqA1:
    'Yes. We use ElevenLabs voice cloning under the hood — about 30 seconds of clear speech is enough. Your clone is tied to your account.',
  faqQ2: "What's the difference between Basic and Pro?",
  faqA2:
    "Basic gives you voice cloning for yourself, unlimited translations and phrase packs. Pro adds Talk mode: clone a partner's voice too and have a real two-way translated conversation, where each person hears the other in the speaker's own voice.",
  faqQ3: 'Can I cancel anytime?',
  faqA3:
    'Yes. Manage everything from the account dashboard — change plan, update card, or cancel. No phone calls.',
  faqQ4: 'What about my privacy?',
  faqA4:
    "Your voice clone lives in your account and is never shared. We don't train models on your data. You can delete your account and all clones at any time.",
  faqQ5: 'Which browsers work?',
  faqA5:
    'Anything modern. Voice mode requires Chrome/Edge for speech recognition; text mode works everywhere including Safari.',

  finalCtaTitle: 'Hear yourself speak another language.',
  finalCtaSubtitle: "It's strangely magical. Try it free.",

  pricingPageTitle: 'Simple pricing',
  pricingPageSubtitle: 'No hidden fees. Cancel anytime. 14-day money-back guarantee.',
  pricingPageGuarantee: '14-day money-back guarantee',
  pricingPageManage: 'Already a member? Manage your subscription',
  pricingPageRedirecting: 'Redirecting…',
  pricingPageBillingDisabled:
    'Billing is not configured yet on this server. Add your Stripe keys to enable checkout.',

  authEmail: 'Email',
  authPassword: 'Password',
  authName: 'Name',
  authNameOptional: 'Name (optional)',
  authReferral: 'Referral code (optional)',
  authReferralPlaceholder: 'e.g. ABC123',

  loginPageTitle: 'Log in',
  loginWelcome: 'Welcome back',
  loginSubtitle: 'Log in to continue.',
  loginCta: 'Log in',
  loginSubmitting: 'Logging in…',
  loginNoAccount: 'New here?',
  loginCreate: 'Create an account',
  loginFailed: 'Login failed.',

  signupPageTitle: 'Create your account',
  signupTitle: 'Create your account',
  signupSubtitle: "Start free. Upgrade when you're ready.",
  signupPasswordHint: 'Password (min. 8 chars)',
  signupCta: 'Create account',
  signupSubmitting: 'Creating…',
  signupTerms1: 'By signing up, you agree to our',
  signupTermsAnd: 'and',
  signupAlready: 'Already have an account?',
  signupLogin: 'Log in',
  signupFailed: 'Signup failed.',
  signupShortPassword: 'Password must be at least 8 characters.',

  accountTitle: 'Account',
  accountPlan: 'Plan',
  accountStatusActive: 'Active',
  accountStatusCanceled: 'Canceled',
  accountStatusPastDue: 'Past due',
  accountUpgradePro: 'Upgrade to Pro',
  accountChooseBasic: 'Choose Basic',
  accountManageBilling: 'Manage billing',
  accountStreak: 'Streak',
  accountStreakDays: 'days',
  accountStreakHint: 'Translate today to start your streak.',
  accountStreakLast: (d) => `Last activity: ${d}`,
  accountUsage: 'Usage',
  accountUsageTranslations: 'Translations today',
  accountUsageSynth: 'Voice synthesis (chars this month)',
  accountUsageClones: 'Voice clones',
  accountReferral: 'Referral',
  accountReferralCopy: 'Copy invite link',
  accountReferralCopied: 'Copied!',
  accountReferralCount: (n) => `${n} signed up`,
  accountReferralCopyDescription:
    'Invite a friend. They get 14 days free; you get a free month for every paid signup.',
  accountOpenApp: 'Open the app',
  accountSeePlans: 'See plans',
  accountLogout: 'Log out',
  accountCheckoutSuccess: '🎉 Payment confirmed. Your plan is now active. Enjoy CAPPISCO.',
  accountCheckoutPending: (tier) =>
    `You picked the ${tier} plan. Continue to checkout to activate it.`,
  accountContinueCheckout: 'Continue to checkout →',
  accountCheckoutFailed: 'Checkout failed.',
  accountPortalFailed: 'Could not open billing portal.',
  accountLoadFailed: 'Could not load account.',

  paywallVoiceCloneTitle: 'Clone your voice',
  paywallVoiceCloneCopy:
    'Hear translations spoken in your own voice. Available on the Basic plan and up.',
  paywallTalkModeTitle: 'Talk mode',
  paywallTalkModeCopy:
    "Real-time, two-way translation between two people. Each speaks their language and the other hears it in the speaker's own voice.",
  paywallUnlimitedTitle: 'Daily quota reached',
  paywallUnlimitedCopy:
    "You've used all 5 free translations today. Upgrade to Basic for unlimited translations and your own cloned voice.",
  paywallPacksTitle: 'Phrase packs',
  paywallPacksCopy:
    'Curated phrases for travel, restaurants, business and small talk. Available on the Basic plan and up.',
  paywallUpgradeBasic: 'Upgrade to Basic — $9.99/mo',
  paywallUpgradePro: 'Upgrade to Pro — $19.99/mo',
  paywallRedirecting: 'Redirecting…',
  paywallBillingDisabled:
    'Billing is not configured yet. Add your Stripe keys to enable checkout.',
  paywallCompare: 'Compare all plans',
  paywallClose: 'Close',

  bannerFree: 'Upgrade to Basic',
  bannerBasic: 'Talk mode',
  bannerSeePlans: 'See plans →',
  bannerUpgrade: 'Upgrade →',
  bannerBetaTitle: 'Open beta',
  bannerBetaBody: 'all features unlocked, free during the beta',

  legalLastUpdated: 'Last updated: today.',
  privacyTitle: 'Privacy',
  privacyIntro:
    'We take your privacy seriously. CAPPISCO is built around the idea that your voice belongs to you. This page summarizes what we collect and why.',
  privacyDataHeader: 'Data we store',
  privacyDataItems: [
    'Your email and a hashed password.',
    'Your subscription status (provided by Stripe).',
    'Usage counters (translations, synthesis characters) for quota enforcement.',
    'References to voice clones you create (the audio is stored at ElevenLabs, never on our servers).',
  ],
  privacyNeverHeader: 'We never',
  privacyNeverItems: [
    'Sell your data.',
    'Train models on your voice.',
    'Share your voice clone with anyone else.',
  ],
  privacyDeleteHeader: 'Account deletion',
  privacyDeleteBody:
    'You can delete your account at any time by contacting support; we wipe all clones and data within 7 days.',
  termsTitle: 'Terms',
  termsIntro:
    'By using CAPPISCO you agree to use the service for lawful, personal purposes. You will not use it to impersonate others, generate misleading audio, or violate any applicable law.',
  termsSubsHeader: 'Subscriptions',
  termsSubsBody:
    'Subscriptions renew automatically on a monthly basis. You can cancel at any time through the billing portal; cancellation takes effect at the end of the current period.',
  termsRefundsHeader: 'Refunds',
  termsRefundsBody:
    'We offer a 14-day money-back guarantee on first-time subscriptions. After that, no partial refunds for the current period.',
  termsLiabilityHeader: 'Liability',
  termsLiabilityBody:
    'The service is provided "as is" without warranties. We do our best, but translations are machine-generated and should not be relied upon for legal, medical, or critical purposes.',

  loading: 'Loading…',
  errorGeneric: 'Something went wrong.',
  langPickerLabel: 'Language',
  appBackHome: 'Home',
}

const pt: MarketingStrings = {
  navPricing: 'Planos',
  navHowItWorks: 'Como funciona',
  navFAQ: 'FAQ',
  navLogin: 'Entrar',
  navGetStarted: 'Começar',
  navOpenApp: 'Abrir app',
  navAccount: 'Conta',

  footerTagline: 'Fale qualquer idioma — na sua própria voz.',
  footerProduct: 'Produto',
  footerAccount: 'Conta',
  footerLegal: 'Jurídico',
  footerSignup: 'Cadastrar',
  footerManage: 'Gerenciar conta',
  footerPrivacy: 'Privacidade',
  footerTerms: 'Termos',
  footerMade: 'Feito com carinho.',

  heroBadge: 'Clonagem de voz · Tradução em tempo real',
  heroTitle1: 'Fale qualquer idioma',
  heroTitle2: 'na sua própria voz.',
  heroSubtitle:
    'O CAPPISCO clona a sua voz uma vez e te deixa ouvir você mesmo falando italiano, espanhol, francês, inglês, português e mais. Em tempo real, nos dois sentidos, com notas culturais.',
  heroCtaFree: 'Comece grátis — sem cartão',
  heroCtaApp: 'Abrir o app',
  heroCtaPricing: 'Ver planos',

  howTitle: 'Como funciona',
  howSubtitle: 'Três passos. Cerca de 1 minuto da primeira vez. Depois é só usar.',
  howStep1Title: 'Grave uma vez',
  howStep1Body:
    'Leia um trecho curto em voz alta — uns 30 segundos. Criamos um perfil de voz pessoal vinculado à sua conta.',
  howStep2Title: 'Traduza qualquer coisa',
  howStep2Body:
    'Fale ou digite uma frase. Traduzimos para o idioma que você está aprendendo, com notas culturais para gírias e expressões.',
  howStep3Title: 'Ouça você mesmo',
  howStep3Body:
    'A tradução é reproduzida na sua própria voz. Ouça como você soa em outro idioma — na hora.',

  featuresTitle: 'Feito para conversas reais',
  featTalkTitle: 'Modo conversa (Pro)',
  featTalkBody:
    'Tradutor bidirecional em tempo real. Cada um fala a sua língua; o outro ouve — na voz de quem está falando. Passa o celular e segue a conversa.',
  featPacksTitle: 'Pacotes de frases',
  featPacksBody:
    'Viagem, restaurante, negócios, papo casual. Frases curadas prontas pra praticar na sua voz — perfeitas pra viagens e apresentações.',
  featStreakTitle: 'Streak diário',
  featStreakBody:
    'Pratique todos os dias e mantenha o streak. Pequenos triunfos diários, grandes ganhos no idioma.',
  featReferTitle: 'Indique amigos, ganhe um mês grátis',
  featReferBody:
    'Compartilhe seu código. Amigos ganham 14 dias grátis; você ganha um mês de assinatura a cada cadastro pago.',
  featPrivacyTitle: 'Privacidade por design',
  featPrivacyBody:
    'Seu clone de voz é vinculado à sua conta. Nunca compartilhamos nem treinamos modelos com sua voz. Cancele a qualquer momento, exclusão total em um clique.',
  featPwaTitle: 'PWA mobile-first',
  featPwaBody: 'Funciona no navegador, instala na tela inicial. Sem loja de apps, sem espera.',

  pricingTitle: 'Planos',
  pricingSubtitle:
    'Comece grátis. Desbloqueie a clonagem de voz no Basic. Adicione o modo Talk no Pro.',
  pricingFreeName: 'Grátis',
  pricingFreeTagline: 'Veja em ação',
  pricingFreeCtaGuest: 'Começar grátis',
  pricingFreeCtaUser: 'Abrir o app',
  pricingBasicName: 'Basic',
  pricingBasicTagline: 'Sua voz, ilimitado',
  pricingBasicCta: 'Escolher Basic',
  pricingProName: 'Pro',
  pricingProTagline: 'Duas vozes, dois idiomas',
  pricingProCta: 'Escolher Pro',
  pricingPriceFree: 'R$0',
  pricingPriceBasic: 'R$29',
  pricingPriceBasicCadence: '/mês',
  pricingPricePro: 'R$59',
  pricingPriceProCadence: '/mês',
  pricingMostPopular: 'Mais popular',
  pricingCurrentPlan: 'Seu plano atual',

  planFreeFeats: [
    '5 traduções / dia',
    'Voz do sistema (do celular)',
    'Notas culturais',
    'Todos os 9 idiomas',
  ],
  planBasicFeats: [
    'Tudo do Grátis',
    'Clonagem da sua voz',
    'Traduções ilimitadas',
    'Pacotes de frases (viagem, restaurante, negócios…)',
    'Download MP3 dos áudios',
    '50.000 caracteres de síntese / mês',
  ],
  planProFeats: [
    'Tudo do Basic',
    '✨ Modo conversa (tradutor bidirecional ao vivo)',
    'Clone a voz de um parceiro',
    '250.000 caracteres de síntese / mês',
    'Suporte prioritário',
  ],
  planFreeTeaserFeats: [
    '5 traduções / dia',
    'Voz do sistema (do celular)',
    'Notas culturais',
    'Todos os 9 idiomas',
  ],
  planBasicTeaserFeats: [
    'Tudo do Grátis',
    'Clonagem da sua voz (ElevenLabs)',
    'Traduções ilimitadas',
    'Pacotes de frases',
    'Download MP3',
  ],
  planProTeaserFeats: [
    'Tudo do Basic',
    '✨ Modo conversa (chat em tempo real)',
    'Clone a voz de um parceiro',
    'Limites mensais maiores',
    'Suporte prioritário',
  ],

  faqTitle: 'Perguntas',
  faqQ1: 'É realmente a minha voz?',
  faqA1:
    'Sim. Usamos a clonagem de voz da ElevenLabs por baixo dos panos — uns 30 segundos de áudio claro já bastam. O clone fica vinculado à sua conta.',
  faqQ2: 'Qual a diferença entre Basic e Pro?',
  faqA2:
    'O Basic clona a sua voz, dá traduções ilimitadas e pacotes de frases. O Pro adiciona o modo Talk: você também clona a voz de um parceiro e tem uma conversa traduzida bidirecional de verdade, onde cada um ouve o outro na voz de quem falou.',
  faqQ3: 'Posso cancelar quando quiser?',
  faqA3:
    'Sim. Faça tudo pelo painel da conta — mude de plano, atualize cartão ou cancele. Sem ligações.',
  faqQ4: 'E a minha privacidade?',
  faqA4:
    'O seu clone fica na sua conta e nunca é compartilhado. Não treinamos modelos com seus dados. Você pode apagar a conta e todos os clones a qualquer momento.',
  faqQ5: 'Quais navegadores funcionam?',
  faqA5:
    'Qualquer um moderno. O modo voz precisa de Chrome/Edge pelo reconhecimento de fala; o modo texto funciona em qualquer navegador, inclusive Safari.',

  finalCtaTitle: 'Ouça você falando outro idioma.',
  finalCtaSubtitle: 'É estranhamente mágico. Teste grátis.',

  pricingPageTitle: 'Planos simples',
  pricingPageSubtitle:
    'Sem taxas escondidas. Cancele quando quiser. Garantia de 14 dias para devolução.',
  pricingPageGuarantee: 'Garantia de 14 dias',
  pricingPageManage: 'Já é membro? Gerencie sua assinatura',
  pricingPageRedirecting: 'Redirecionando…',
  pricingPageBillingDisabled:
    'Pagamento ainda não configurado neste servidor. Adicione suas chaves Stripe para liberar o checkout.',

  authEmail: 'E-mail',
  authPassword: 'Senha',
  authName: 'Nome',
  authNameOptional: 'Nome (opcional)',
  authReferral: 'Código de indicação (opcional)',
  authReferralPlaceholder: 'ex.: ABC123',

  loginPageTitle: 'Entrar',
  loginWelcome: 'Bem-vindo de volta',
  loginSubtitle: 'Entre para continuar.',
  loginCta: 'Entrar',
  loginSubmitting: 'Entrando…',
  loginNoAccount: 'Novo por aqui?',
  loginCreate: 'Crie uma conta',
  loginFailed: 'Falha no login.',

  signupPageTitle: 'Crie sua conta',
  signupTitle: 'Crie sua conta',
  signupSubtitle: 'Comece grátis. Faça upgrade quando quiser.',
  signupPasswordHint: 'Senha (mín. 8 caracteres)',
  signupCta: 'Criar conta',
  signupSubmitting: 'Criando…',
  signupTerms1: 'Ao se cadastrar, você concorda com os nossos',
  signupTermsAnd: 'e a',
  signupAlready: 'Já tem uma conta?',
  signupLogin: 'Entrar',
  signupFailed: 'Falha no cadastro.',
  signupShortPassword: 'A senha precisa ter pelo menos 8 caracteres.',

  accountTitle: 'Conta',
  accountPlan: 'Plano',
  accountStatusActive: 'Ativo',
  accountStatusCanceled: 'Cancelado',
  accountStatusPastDue: 'Pagamento em atraso',
  accountUpgradePro: 'Upgrade para Pro',
  accountChooseBasic: 'Escolher Basic',
  accountManageBilling: 'Gerenciar pagamento',
  accountStreak: 'Streak',
  accountStreakDays: 'dias',
  accountStreakHint: 'Traduza algo hoje pra começar o streak.',
  accountStreakLast: (d) => `Última atividade: ${d}`,
  accountUsage: 'Uso',
  accountUsageTranslations: 'Traduções hoje',
  accountUsageSynth: 'Síntese de voz (caracteres este mês)',
  accountUsageClones: 'Clones de voz',
  accountReferral: 'Indicação',
  accountReferralCopy: 'Copiar link de convite',
  accountReferralCopied: 'Copiado!',
  accountReferralCount: (n) => `${n} cadastrado${n === 1 ? '' : 's'}`,
  accountReferralCopyDescription:
    'Convide um amigo. Ele ganha 14 dias grátis; você ganha um mês grátis a cada cadastro pago.',
  accountOpenApp: 'Abrir o app',
  accountSeePlans: 'Ver planos',
  accountLogout: 'Sair',
  accountCheckoutSuccess: '🎉 Pagamento confirmado. Seu plano está ativo. Aproveite o CAPPISCO!',
  accountCheckoutPending: (tier) =>
    `Você escolheu o plano ${tier}. Continue para o checkout para ativar.`,
  accountContinueCheckout: 'Continuar para o checkout →',
  accountCheckoutFailed: 'Falha no checkout.',
  accountPortalFailed: 'Não foi possível abrir o portal de pagamento.',
  accountLoadFailed: 'Não foi possível carregar a conta.',

  paywallVoiceCloneTitle: 'Clone sua voz',
  paywallVoiceCloneCopy:
    'Ouça as traduções na sua própria voz. Disponível no plano Basic ou superior.',
  paywallTalkModeTitle: 'Modo conversa',
  paywallTalkModeCopy:
    'Tradução bidirecional em tempo real entre duas pessoas. Cada uma fala a sua língua e a outra ouve na voz de quem falou.',
  paywallUnlimitedTitle: 'Quota diária esgotada',
  paywallUnlimitedCopy:
    'Você usou as 5 traduções gratuitas de hoje. Faça upgrade para o Basic e tenha traduções ilimitadas + sua voz clonada.',
  paywallPacksTitle: 'Pacotes de frases',
  paywallPacksCopy:
    'Frases curadas para viagem, restaurante, negócios e papo casual. Disponíveis no plano Basic ou superior.',
  paywallUpgradeBasic: 'Upgrade para Basic — R$29/mês',
  paywallUpgradePro: 'Upgrade para Pro — R$59/mês',
  paywallRedirecting: 'Redirecionando…',
  paywallBillingDisabled:
    'Pagamento ainda não configurado. Adicione suas chaves Stripe para liberar o checkout.',
  paywallCompare: 'Comparar todos os planos',
  paywallClose: 'Fechar',

  bannerFree: 'Upgrade para Basic',
  bannerBasic: 'Modo conversa',
  bannerSeePlans: 'Ver planos →',
  bannerUpgrade: 'Upgrade →',
  bannerBetaTitle: 'Beta aberto',
  bannerBetaBody: 'todas as features liberadas grátis durante o teste',

  legalLastUpdated: 'Última atualização: hoje.',
  privacyTitle: 'Privacidade',
  privacyIntro:
    'Levamos a sua privacidade a sério. O CAPPISCO foi pensado em torno da ideia de que a sua voz é sua. Esta página resume o que coletamos e por quê.',
  privacyDataHeader: 'Dados que armazenamos',
  privacyDataItems: [
    'Seu e-mail e uma senha com hash.',
    'Seu status de assinatura (fornecido pelo Stripe).',
    'Contadores de uso (traduções, caracteres de síntese) para limites de plano.',
    'Referências aos clones de voz que você cria (o áudio fica na ElevenLabs, nunca nos nossos servidores).',
  ],
  privacyNeverHeader: 'Nós nunca',
  privacyNeverItems: [
    'Vendemos seus dados.',
    'Treinamos modelos com sua voz.',
    'Compartilhamos seu clone de voz com terceiros.',
  ],
  privacyDeleteHeader: 'Exclusão de conta',
  privacyDeleteBody:
    'Você pode apagar sua conta a qualquer momento entrando em contato com o suporte; apagamos todos os clones e dados em até 7 dias.',
  termsTitle: 'Termos',
  termsIntro:
    'Ao usar o CAPPISCO você concorda em utilizar o serviço para fins legais e pessoais. Você não vai usá-lo para se passar por outras pessoas, gerar áudios enganosos ou violar leis aplicáveis.',
  termsSubsHeader: 'Assinaturas',
  termsSubsBody:
    'As assinaturas renovam automaticamente a cada mês. Você pode cancelar a qualquer momento pelo portal de pagamento; o cancelamento entra em vigor no fim do período atual.',
  termsRefundsHeader: 'Reembolsos',
  termsRefundsBody:
    'Oferecemos garantia de 14 dias para a primeira assinatura. Após esse prazo, não há reembolsos parciais para o período em curso.',
  termsLiabilityHeader: 'Responsabilidade',
  termsLiabilityBody:
    'O serviço é fornecido "como está", sem garantias. Fazemos o nosso melhor, mas as traduções são geradas por máquina e não devem ser usadas para fins jurídicos, médicos ou críticos.',

  loading: 'Carregando…',
  errorGeneric: 'Algo deu errado.',
  langPickerLabel: 'Idioma',
  appBackHome: 'Início',
}

const es: MarketingStrings = {
  navPricing: 'Planes',
  navHowItWorks: 'Cómo funciona',
  navFAQ: 'FAQ',
  navLogin: 'Iniciar sesión',
  navGetStarted: 'Empezar',
  navOpenApp: 'Abrir app',
  navAccount: 'Cuenta',

  footerTagline: 'Habla cualquier idioma — con tu propia voz.',
  footerProduct: 'Producto',
  footerAccount: 'Cuenta',
  footerLegal: 'Legal',
  footerSignup: 'Registrarse',
  footerManage: 'Gestionar cuenta',
  footerPrivacy: 'Privacidad',
  footerTerms: 'Términos',
  footerMade: 'Hecho con cariño.',

  heroBadge: 'Clonación de voz · Traducción en tiempo real',
  heroTitle1: 'Habla cualquier idioma',
  heroTitle2: 'con tu propia voz.',
  heroSubtitle:
    'CAPPISCO clona tu voz una vez y te deja escucharte hablando italiano, español, francés, inglés, portugués y más. En tiempo real, en ambos sentidos, con notas culturales.',
  heroCtaFree: 'Empieza gratis — sin tarjeta',
  heroCtaApp: 'Abrir el app',
  heroCtaPricing: 'Ver planes',

  howTitle: 'Cómo funciona',
  howSubtitle: 'Tres pasos. Aproximadamente un minuto la primera vez. Después solo funciona.',
  howStep1Title: 'Graba una vez',
  howStep1Body:
    'Lee un texto corto en voz alta — unos 30 segundos. Creamos un perfil de voz personal vinculado a tu cuenta.',
  howStep2Title: 'Traduce lo que sea',
  howStep2Body:
    'Habla o escribe una frase. La traducimos al idioma que estás aprendiendo, con notas culturales para modismos difíciles.',
  howStep3Title: 'Escúchate a ti mismo',
  howStep3Body:
    'La traducción suena en tu propia voz. Escucha cómo suenas en otro idioma — al instante.',

  featuresTitle: 'Pensado para conversaciones reales',
  featTalkTitle: 'Modo Talk (Pro)',
  featTalkBody:
    'Un traductor bidireccional en tiempo real. Cada uno habla su idioma; el otro lo oye — en la voz de quien habla. Pasa el móvil y sigue la conversación.',
  featPacksTitle: 'Paquetes de frases',
  featPacksBody:
    'Viajes, restaurantes, negocios, charla casual. Frases listas para practicar con tu voz — perfectas para viajes y presentaciones.',
  featStreakTitle: 'Racha diaria',
  featStreakBody:
    'Practica cada día y mantén la racha. Pequeñas dosis de dopamina, grandes ganancias en el idioma.',
  featReferTitle: 'Recomienda y gana un mes gratis',
  featReferBody:
    'Comparte tu código. Tus amigos reciben 14 días gratis; tú ganas un mes gratis por cada registro de pago.',
  featPrivacyTitle: 'Privacidad por diseño',
  featPrivacyBody:
    'Tu clon de voz está vinculado a tu cuenta. Nunca lo compartimos ni entrenamos modelos con tu voz. Cancela cuando quieras, eliminación total en un clic.',
  featPwaTitle: 'PWA mobile-first',
  featPwaBody: 'Funciona en el navegador, se instala en la pantalla de inicio. Sin tienda, sin esperas.',

  pricingTitle: 'Planes',
  pricingSubtitle:
    'Empieza gratis. Desbloquea la clonación de voz en Basic. Añade el modo Talk en Pro.',
  pricingFreeName: 'Gratis',
  pricingFreeTagline: 'Pruébalo en acción',
  pricingFreeCtaGuest: 'Empezar gratis',
  pricingFreeCtaUser: 'Abrir el app',
  pricingBasicName: 'Basic',
  pricingBasicTagline: 'Tu voz, sin límites',
  pricingBasicCta: 'Elegir Basic',
  pricingProName: 'Pro',
  pricingProTagline: 'Dos voces, dos idiomas',
  pricingProCta: 'Elegir Pro',
  pricingPriceFree: '€0',
  pricingPriceBasic: '€9,99',
  pricingPriceBasicCadence: '/mes',
  pricingPricePro: '€19,99',
  pricingPriceProCadence: '/mes',
  pricingMostPopular: 'Más popular',
  pricingCurrentPlan: 'Tu plan actual',

  planFreeFeats: [
    '5 traducciones / día',
    'Voz del sistema (la del móvil)',
    'Notas culturales',
    'Los 9 idiomas',
  ],
  planBasicFeats: [
    'Todo lo de Gratis',
    'Clona tu voz',
    'Traducciones ilimitadas',
    'Paquetes de frases (viajes, restaurante, negocios…)',
    'Descarga del audio MP3',
    '50.000 caracteres de síntesis / mes',
  ],
  planProFeats: [
    'Todo lo de Basic',
    '✨ Modo Talk (traductor bidireccional en vivo)',
    'Clona la voz de un compañero',
    '250.000 caracteres de síntesis / mes',
    'Soporte prioritario',
  ],
  planFreeTeaserFeats: [
    '5 traducciones / día',
    'Voz del sistema (la del móvil)',
    'Notas culturales',
    'Los 9 idiomas',
  ],
  planBasicTeaserFeats: [
    'Todo lo de Gratis',
    'Clona tu voz (ElevenLabs)',
    'Traducciones ilimitadas',
    'Paquetes de frases',
    'Descarga MP3',
  ],
  planProTeaserFeats: [
    'Todo lo de Basic',
    '✨ Modo Talk (chat en tiempo real)',
    'Clona la voz de un compañero',
    'Límites mensuales más altos',
    'Soporte prioritario',
  ],

  faqTitle: 'Preguntas',
  faqQ1: '¿Es realmente mi voz?',
  faqA1:
    'Sí. Usamos la clonación de voz de ElevenLabs detrás — unos 30 segundos de audio claro bastan. Tu clon está vinculado a tu cuenta.',
  faqQ2: '¿Cuál es la diferencia entre Basic y Pro?',
  faqA2:
    'Basic te da clonación de voz para ti, traducciones ilimitadas y paquetes de frases. Pro añade el modo Talk: también clonas la voz de un compañero y tienes una conversación traducida real bidireccional, donde cada uno escucha al otro en la voz del que habla.',
  faqQ3: '¿Puedo cancelar cuando quiera?',
  faqA3:
    'Sí. Gestiona todo desde el panel de tu cuenta — cambia de plan, actualiza la tarjeta o cancela. Sin llamadas.',
  faqQ4: '¿Y mi privacidad?',
  faqA4:
    'Tu clon de voz vive en tu cuenta y nunca se comparte. No entrenamos modelos con tus datos. Puedes borrar tu cuenta y todos los clones cuando quieras.',
  faqQ5: '¿Qué navegadores funcionan?',
  faqA5:
    'Cualquiera moderno. El modo voz necesita Chrome/Edge para el reconocimiento; el modo texto funciona en todos, incluido Safari.',

  finalCtaTitle: 'Escúchate hablar otro idioma.',
  finalCtaSubtitle: 'Es extrañamente mágico. Pruébalo gratis.',

  pricingPageTitle: 'Planes sencillos',
  pricingPageSubtitle: 'Sin tarifas ocultas. Cancela cuando quieras. Garantía de 14 días.',
  pricingPageGuarantee: 'Garantía de 14 días',
  pricingPageManage: '¿Ya eres miembro? Gestiona tu suscripción',
  pricingPageRedirecting: 'Redirigiendo…',
  pricingPageBillingDisabled:
    'Los pagos aún no están configurados en este servidor. Añade tus claves de Stripe para activar el checkout.',

  authEmail: 'Email',
  authPassword: 'Contraseña',
  authName: 'Nombre',
  authNameOptional: 'Nombre (opcional)',
  authReferral: 'Código de referido (opcional)',
  authReferralPlaceholder: 'p. ej. ABC123',

  loginPageTitle: 'Iniciar sesión',
  loginWelcome: 'Bienvenido de vuelta',
  loginSubtitle: 'Inicia sesión para continuar.',
  loginCta: 'Iniciar sesión',
  loginSubmitting: 'Entrando…',
  loginNoAccount: '¿Nuevo aquí?',
  loginCreate: 'Crea una cuenta',
  loginFailed: 'Error al iniciar sesión.',

  signupPageTitle: 'Crea tu cuenta',
  signupTitle: 'Crea tu cuenta',
  signupSubtitle: 'Empieza gratis. Mejora cuando quieras.',
  signupPasswordHint: 'Contraseña (mín. 8 caracteres)',
  signupCta: 'Crear cuenta',
  signupSubmitting: 'Creando…',
  signupTerms1: 'Al registrarte, aceptas nuestros',
  signupTermsAnd: 'y la',
  signupAlready: '¿Ya tienes cuenta?',
  signupLogin: 'Iniciar sesión',
  signupFailed: 'Error al crear la cuenta.',
  signupShortPassword: 'La contraseña debe tener al menos 8 caracteres.',

  accountTitle: 'Cuenta',
  accountPlan: 'Plan',
  accountStatusActive: 'Activo',
  accountStatusCanceled: 'Cancelado',
  accountStatusPastDue: 'Pago atrasado',
  accountUpgradePro: 'Cambiar a Pro',
  accountChooseBasic: 'Elegir Basic',
  accountManageBilling: 'Gestionar pago',
  accountStreak: 'Racha',
  accountStreakDays: 'días',
  accountStreakHint: 'Traduce algo hoy para empezar tu racha.',
  accountStreakLast: (d) => `Última actividad: ${d}`,
  accountUsage: 'Uso',
  accountUsageTranslations: 'Traducciones hoy',
  accountUsageSynth: 'Síntesis de voz (caracteres este mes)',
  accountUsageClones: 'Clones de voz',
  accountReferral: 'Referidos',
  accountReferralCopy: 'Copiar enlace de invitación',
  accountReferralCopied: '¡Copiado!',
  accountReferralCount: (n) => `${n} registrado${n === 1 ? '' : 's'}`,
  accountReferralCopyDescription:
    'Invita a un amigo. Recibe 14 días gratis; tú obtienes un mes gratis por cada registro de pago.',
  accountOpenApp: 'Abrir el app',
  accountSeePlans: 'Ver planes',
  accountLogout: 'Salir',
  accountCheckoutSuccess: '🎉 Pago confirmado. Tu plan ya está activo. ¡Disfruta CAPPISCO!',
  accountCheckoutPending: (tier) =>
    `Has elegido el plan ${tier}. Continúa al checkout para activarlo.`,
  accountContinueCheckout: 'Continuar al checkout →',
  accountCheckoutFailed: 'Error en el checkout.',
  accountPortalFailed: 'No se pudo abrir el portal de pagos.',
  accountLoadFailed: 'No se pudo cargar la cuenta.',

  paywallVoiceCloneTitle: 'Clona tu voz',
  paywallVoiceCloneCopy:
    'Escucha las traducciones en tu propia voz. Disponible en el plan Basic y superior.',
  paywallTalkModeTitle: 'Modo Talk',
  paywallTalkModeCopy:
    'Traducción bidireccional en tiempo real entre dos personas. Cada uno habla su idioma y el otro lo oye en la voz del que habla.',
  paywallUnlimitedTitle: 'Cuota diaria agotada',
  paywallUnlimitedCopy:
    'Has usado las 5 traducciones gratis de hoy. Pásate a Basic para tener traducciones ilimitadas y tu propia voz clonada.',
  paywallPacksTitle: 'Paquetes de frases',
  paywallPacksCopy:
    'Frases curadas para viajes, restaurantes, negocios y charla casual. Disponibles en el plan Basic o superior.',
  paywallUpgradeBasic: 'Cambiar a Basic — €9,99/mes',
  paywallUpgradePro: 'Cambiar a Pro — €19,99/mes',
  paywallRedirecting: 'Redirigiendo…',
  paywallBillingDisabled:
    'Los pagos aún no están configurados. Añade tus claves de Stripe para activar el checkout.',
  paywallCompare: 'Comparar todos los planes',
  paywallClose: 'Cerrar',

  bannerFree: 'Cambiar a Basic',
  bannerBasic: 'Modo Talk',
  bannerSeePlans: 'Ver planes →',
  bannerUpgrade: 'Mejorar →',
  bannerBetaTitle: 'Beta abierto',
  bannerBetaBody: 'todas las funciones desbloqueadas, gratis durante el beta',

  legalLastUpdated: 'Última actualización: hoy.',
  privacyTitle: 'Privacidad',
  privacyIntro:
    'Nos tomamos tu privacidad en serio. CAPPISCO se basa en la idea de que tu voz te pertenece. Esta página resume qué recopilamos y por qué.',
  privacyDataHeader: 'Datos que guardamos',
  privacyDataItems: [
    'Tu email y una contraseña con hash.',
    'El estado de tu suscripción (provisto por Stripe).',
    'Contadores de uso (traducciones, caracteres de síntesis) para los límites del plan.',
    'Referencias a los clones que creas (el audio se guarda en ElevenLabs, nunca en nuestros servidores).',
  ],
  privacyNeverHeader: 'Nunca',
  privacyNeverItems: [
    'Vendemos tus datos.',
    'Entrenamos modelos con tu voz.',
    'Compartimos tu clon de voz con nadie.',
  ],
  privacyDeleteHeader: 'Eliminación de cuenta',
  privacyDeleteBody:
    'Puedes eliminar tu cuenta cuando quieras contactando con soporte; borramos todos los clones y datos en 7 días.',
  termsTitle: 'Términos',
  termsIntro:
    'Al usar CAPPISCO aceptas usar el servicio con fines legales y personales. No lo usarás para suplantar a otras personas, generar audios engañosos ni violar la ley.',
  termsSubsHeader: 'Suscripciones',
  termsSubsBody:
    'Las suscripciones se renuevan automáticamente cada mes. Puedes cancelar cuando quieras desde el portal de pagos; el cancelamiento entra en vigor al final del periodo actual.',
  termsRefundsHeader: 'Reembolsos',
  termsRefundsBody:
    'Ofrecemos una garantía de 14 días en la primera suscripción. Después no hay reembolsos parciales del periodo en curso.',
  termsLiabilityHeader: 'Responsabilidad',
  termsLiabilityBody:
    'El servicio se ofrece "tal cual", sin garantías. Hacemos lo posible, pero las traducciones se generan por máquina y no deben usarse para fines legales, médicos o críticos.',

  loading: 'Cargando…',
  errorGeneric: 'Algo salió mal.',
  langPickerLabel: 'Idioma',
  appBackHome: 'Inicio',
}

const DICT: Record<Locale, MarketingStrings> = { en, pt, es }

export function getMarketingStrings(locale: Locale): MarketingStrings {
  return DICT[locale] ?? en
}

/** Map a browser language tag (e.g. "pt-BR", "es", "en-US") to a supported locale. */
export function resolveLocale(tag: string | null | undefined): Locale {
  if (!tag) return 'en'
  const lower = tag.toLowerCase()
  if (lower.startsWith('pt')) return 'pt'
  if (lower.startsWith('es')) return 'es'
  return 'en'
}

import { SUPPORTED_LANGUAGES, LanguageCode } from '../constants';

/**
 * Translation Engine
 * A lightweight, high-performance internationalization engine.
 * Supports dynamic language switching and RTL/LTR layout orchestration.
 */
export class TranslationEngine {
  /**
   * Centralized translation dictionary.
   * Keys are dot-namespaced (e.g. 'hero.title', 'nav.timeline').
   * Each key maps to a Record of language code -> translated string.
   * Falls back to English, then the raw key if no translation is found.
   */
  private static readonly translations: Record<string, Record<string, string>> = {
    // ── Navigation ──────────────────────────────────────────────
    'nav.dashboard':    { en: 'Dashboard',   hi: 'डैशबोर्ड',        es: 'Tablero',    ar: 'لوحة القيادة', fr: 'Tableau de bord', de: 'Übersicht',   zh: '仪表板' },
    'nav.timeline':     { en: 'Journey',     hi: 'यात्रा',           es: 'Viaje',      ar: 'الرحلة',        fr: 'Parcours',        de: 'Zeitstrahl',  zh: '旅程' },
    'nav.checklist':    { en: 'Checklist',   hi: 'चेकलिस्ट',        es: 'Lista',      ar: 'قائمة التحقق',   fr: 'Liste',           de: 'Checkliste',  zh: '清单' },
    'nav.askCivicIQ':   { en: 'Ask CivicIQ', hi: 'CivicIQ से पूछें', es: 'Preguntar',  ar: 'اسأل',          fr: 'Demander',        de: 'Fragen',      zh: '提问' },
    'nav.signIn':       { en: 'Sign in with Google', hi: 'Google से साइन इन करें', es: 'Iniciar sesión', ar: 'تسجيل الدخول', fr: 'Se connecter', de: 'Anmelden', zh: '登录' },
    'nav.signOut':      { en: 'Sign out',    hi: 'साइन आउट',         es: 'Cerrar sesión', ar: 'تسجيل الخروج', fr: 'Déconnexion',  de: 'Abmelden',   zh: '退出' },
    'nav.userMenu':     { en: 'User menu',   hi: 'उपयोगकर्ता मेनू',   es: 'Menú',       ar: 'القائمة',       fr: 'Menu',            de: 'Menü',        zh: '用户菜单' },

    // ── Hero Section ─────────────────────────────────────────────
    'hero.title':       { en: 'Democracy starts with understanding.', hi: 'लोकतंत्र समझ से शुरू होता है।', es: 'La democracia empieza con entender.', ar: 'الديمقراطية تبدأ بالفهم.', fr: 'La démocratie commence par la compréhension.', de: 'Demokratie beginnt mit Verstehen.', zh: '民主从理解开始。' },
    'hero.subtitle':    { en: 'CivicIQ guides you through every step of the election process — from voter registration to final results.', hi: 'CivicIQ आपको मतदाता पंजीकरण से अंतिम परिणाम तक हर कदम पर मार्गदर्शन करता है।', es: 'CivicIQ le guía en cada paso del proceso electoral.', ar: 'يرشدك CivicIQ خلال كل خطوة في العملية الانتخابية.', fr: 'CivicIQ vous guide à travers chaque étape du processus électoral.', de: 'CivicIQ führt Sie durch jeden Schritt des Wahlprozesses.', zh: 'CivicIQ 指导您完成选举过程的每一步。' },
    'hero.cta.explore': { en: 'Explore the process', hi: 'प्रक्रिया देखें', es: 'Explorar el proceso', ar: 'استكشف العملية', fr: 'Explorer le processus', de: 'Prozess erkunden', zh: '探索流程' },
    'hero.cta.howItWorks': { en: 'How it works', hi: 'यह कैसे काम करता है', es: 'Cómo funciona', ar: 'كيف يعمل', fr: 'Comment ça marche', de: 'Wie es funktioniert', zh: '如何运作' },

    // ── Feature Cards ────────────────────────────────────────────
    'feature.timeline.title':      { en: 'Interactive timeline',   hi: 'इंटरैक्टिव टाइमलाइन',  es: 'Línea de tiempo',     ar: 'جدول زمني تفاعلي',    fr: 'Chronologie interactive', de: 'Interaktiver Zeitplan', zh: '互动时间线' },
    'feature.timeline.desc':       { en: 'Follow every election phase step by step, with plain-language explanations.', hi: 'सरल भाषा में प्रत्येक चुनाव चरण का अनुसरण करें।', es: 'Siga cada fase electoral paso a paso.', ar: 'تابع كل مرحلة انتخابية خطوة بخطوة.', fr: 'Suivez chaque phase électorale étape par étape.', de: 'Folgen Sie jeder Wahlphase Schritt für Schritt.', zh: '逐步跟踪每个选举阶段。' },
    'feature.chat.title':          { en: 'Ask CivicIQ',            hi: 'CivicIQ से पूछें',       es: 'Preguntar a CivicIQ', ar: 'اسأل CivicIQ',         fr: 'Demandez à CivicIQ',      de: 'CivicIQ fragen',       zh: '询问CivicIQ' },
    'feature.chat.desc':           { en: 'Get instant answers about any part of the process, powered by Gemini AI.', hi: 'Gemini AI द्वारा संचालित किसी भी प्रक्रिया के बारे में तुरंत उत्तर पाएं।', es: 'Obtenga respuestas instantáneas sobre cualquier parte del proceso.', ar: 'احصل على إجابات فورية حول أي جزء من العملية.', fr: 'Obtenez des réponses instantanées sur n\'importe quelle partie du processus.', de: 'Erhalten Sie sofortige Antworten zu jedem Teil des Prozesses.', zh: '获取关于任何流程环节的即时答案。' },
    'feature.checklist.title':     { en: 'Civic readiness',        hi: 'नागरिक तैयारी',          es: 'Preparación cívica',  ar: 'الجاهزية المدنية',    fr: 'Préparation civique',     de: 'Bürgerbereitschaft',   zh: '公民准备' },
    'feature.checklist.desc':      { en: 'Track your personal checklist so you are fully prepared on election day.', hi: 'अपनी व्यक्तिगत चेकलिस्ट ट्रैक करें ताकि आप चुनाव के दिन पूरी तरह तैयार हों।', es: 'Realice un seguimiento de su lista de verificación personal.', ar: 'تتبع قائمة التحقق الشخصية لتكون مستعداً تماماً.', fr: 'Suivez votre liste personnelle pour être prêt le jour J.', de: 'Verfolgen Sie Ihre persönliche Checkliste für den Wahltag.', zh: '追踪您的个人清单，确保选举日万全准备。' },

    // ── Checklist Page ───────────────────────────────────────────
    'checklist.title':             { en: 'Your Civic Checklist',   hi: 'आपकी नागरिक चेकलिस्ट',  es: 'Tu lista cívica',     ar: 'قائمة التحقق المدنية',  fr: 'Votre liste civique',     de: 'Ihre Bürgerliste',     zh: '您的公民清单' },
    'checklist.subtitle':          { en: 'Complete these steps to be fully prepared for election day.', hi: 'चुनाव दिवस के लिए पूरी तरह तैयार होने के लिए इन चरणों को पूरा करें।', es: 'Complete estos pasos para estar listo el día de las elecciones.', ar: 'أكمل هذه الخطوات لتكون مستعداً ليوم الانتخابات.', fr: 'Complétez ces étapes pour être prêt le jour du scrutin.', de: 'Erledigen Sie diese Schritte, um am Wahltag vorbereitet zu sein.', zh: '完成这些步骤，为选举日做好充分准备。' },
    'checklist.progress':          { en: 'Progress',               hi: 'प्रगति',                  es: 'Progreso',            ar: 'التقدم',               fr: 'Progression',             de: 'Fortschritt',          zh: '进度' },
    'checklist.complete':          { en: 'Complete',               hi: 'पूर्ण',                   es: 'Completo',            ar: 'مكتمل',                fr: 'Terminé',                 de: 'Abgeschlossen',        zh: '完成' },
    'checklist.learnMore':         { en: 'Learn more',             hi: 'और जानें',               es: 'Saber más',           ar: 'اعرف المزيد',          fr: 'En savoir plus',          de: 'Mehr erfahren',        zh: '了解更多' },

    // ── Timeline / Journey ───────────────────────────────────────
    'timeline.title':              { en: 'Election Journey',       hi: 'चुनाव यात्रा',            es: 'Recorrido Electoral',  ar: 'رحلة الانتخابات',     fr: 'Parcours électoral',      de: 'Wahlreise',            zh: '选举旅程' },
    'timeline.subtitle':           { en: 'Your step-by-step guide through the entire election process.', hi: 'पूरी चुनाव प्रक्रिया के माध्यम से आपका चरण-दर-चरण मार्गदर्शिका।', es: 'Su guía paso a paso a través de todo el proceso electoral.', ar: 'دليلك خطوة بخطوة خلال العملية الانتخابية بأكملها.', fr: 'Votre guide étape par étape tout au long du processus électoral.', de: 'Ihre Schritt-für-Schritt-Anleitung durch den gesamten Wahlprozess.', zh: '您的整个选举过程分步指南。' },
    'timeline.completion':         { en: 'Journey Completion',     hi: 'यात्रा पूर्णता',           es: 'Finalización',        ar: 'إكمال الرحلة',         fr: 'Achèvement du parcours', de: 'Reise abgeschlossen',  zh: '旅程完成度' },
    'timeline.phase.keyActors':    { en: 'Key Actors',             hi: 'प्रमुख कर्ता',             es: 'Actores Clave',       ar: 'الجهات الرئيسية',      fr: 'Acteurs Clés',            de: 'Hauptakteure',         zh: '关键参与者' },
    'timeline.phase.steps':        { en: 'Steps',                  hi: 'चरण',                     es: 'Pasos',               ar: 'الخطوات',              fr: 'Étapes',                  de: 'Schritte',             zh: '步骤' },
    'timeline.phase.markViewed':   { en: 'Mark as viewed',         hi: 'देखा हुआ चिह्नित करें',   es: 'Marcar como visto',   ar: 'وضع علامة كمشاهد',    fr: 'Marquer comme vu',        de: 'Als angesehen markieren', zh: '标记为已查看' },

    // ── Chat Panel ───────────────────────────────────────────────
    'chat.placeholder':            { en: 'Ask about elections...', hi: 'चुनाव के बारे में पूछें...', es: 'Pregunte sobre las elecciones...', ar: 'اسأل عن الانتخابات...', fr: 'Posez une question sur les élections...', de: 'Frage zu Wahlen stellen...', zh: '询问选举相关问题...' },
    'chat.title':                  { en: 'Ask CivicIQ',            hi: 'CivicIQ से पूछें',          es: 'Preguntar a CivicIQ', ar: 'اسأل CivicIQ',          fr: 'Demandez à CivicIQ',    de: 'CivicIQ fragen',  zh: '询问CivicIQ' },
    'chat.send':                   { en: 'Send',                   hi: 'भेजें',                    es: 'Enviar',              ar: 'إرسال',                 fr: 'Envoyer',               de: 'Senden',          zh: '发送' },
    'chat.disclaimer':             { en: 'Non-partisan & powered by Gemini AI', hi: 'गैर-पक्षपाती और Gemini AI द्वारा संचालित', es: 'No partidista, impulsado por Gemini AI', ar: 'محايد ومدعوم بـ Gemini AI', fr: 'Non partisan, propulsé par Gemini AI', de: 'Unparteiisch, angetrieben von Gemini AI', zh: '无党派，由 Gemini AI 提供支持' },
    'chat.empty':                  { en: 'Ask me anything about the election process.', hi: 'चुनाव प्रक्रिया के बारे में कुछ भी पूछें।', es: 'Pregúntame cualquier cosa sobre el proceso electoral.', ar: 'اسألني أي شيء عن العملية الانتخابية.', fr: 'Posez-moi n\'importe quelle question sur le processus électoral.', de: 'Fragen Sie mich alles über den Wahlprozess.', zh: '向我询问任何关于选举流程的问题。' },

    // ── Footer / About ───────────────────────────────────────────
    'footer.tagline':              { en: 'Making democracy accessible to every citizen.', hi: 'हर नागरिक के लिए लोकतंत्र को सुलभ बनाना।', es: 'Haciendo la democracia accesible para todos.', ar: 'جعل الديمقراطية في متناول كل مواطن.', fr: 'Rendre la démocratie accessible à chaque citoyen.', de: 'Demokratie für jeden Bürger zugänglich machen.', zh: '让民主惠及每一位公民。' },
    'footer.rights':               { en: 'All rights reserved.', hi: 'सर्वाधिकार सुरक्षित।', es: 'Todos los derechos reservados.', ar: 'جميع الحقوق محفوظة.', fr: 'Tous droits réservés.', de: 'Alle Rechte vorbehalten.', zh: '版权所有。' },
    'about.title':                 { en: 'About CivicIQ',          hi: 'CivicIQ के बारे में',      es: 'Acerca de CivicIQ',   ar: 'حول CivicIQ',          fr: 'À propos de CivicIQ',   de: 'Über CivicIQ',    zh: '关于CivicIQ' },

    // ── Auth / Common ────────────────────────────────────────────
    'common.loading':              { en: 'Loading...',             hi: 'लोड हो रहा है...',         es: 'Cargando...',         ar: 'جار التحميل...',        fr: 'Chargement...',         de: 'Laden...',        zh: '加载中...' },
    'common.error':                { en: 'Something went wrong.',  hi: 'कुछ गलत हो गया।',          es: 'Algo salió mal.',     ar: 'حدث خطأ ما.',           fr: 'Une erreur est survenue.', de: 'Etwas ist schiefgelaufen.', zh: '出现错误。' },
    'common.retry':                { en: 'Try again',              hi: 'पुनः प्रयास करें',          es: 'Intentar de nuevo',  ar: 'حاول مرة أخرى',        fr: 'Réessayer',             de: 'Erneut versuchen', zh: '重试' },
  };

  /**
   * Translates a given key into the target language.
   * Falls back to English, then returns the raw key if no translation exists.
   * @param {string} key The localization key (e.g. 'hero.title').
   * @param {LanguageCode} lang The target language code.
   * @returns {string} The translated string.
   */
  public static t(key: string, lang: LanguageCode): string {
    return (
      TranslationEngine.translations[key]?.[lang] ||
      TranslationEngine.translations[key]?.['en'] ||
      key
    );
  }

  /**
   * Returns the text direction (RTL/LTR) for a given language.
   * @param {LanguageCode} lang The language code.
   * @returns {'rtl' | 'ltr'}
   */
  public static getDirection(lang: LanguageCode): 'rtl' | 'ltr' {
    const language = SUPPORTED_LANGUAGES.find(l => l.code === lang);
    return (language?.dir as 'rtl' | 'ltr') || 'ltr';
  }
}

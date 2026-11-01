/* =========================================================
   English / Urdu language switch
   ---------------------------------------------------------
   English lives in index.html. Urdu is defined below as
   "CSS selector → translation(s)":
     - a string        → used for every matching element
     - an array        → matched in document order (null = keep English)
     - { text: true }  → only the text is swapped, child icons (SVG) stay
     - { dict: {...} } → looked up by the element's English text
   The original English is cached on each element, so switching
   back is instant and lossless.
   ========================================================= */
(() => {
  const $$ = (s) => [...document.querySelectorAll(s)];
  const root = document.documentElement;
  const URDU_FONT = 'https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;500;600;700&display=swap';

  // Short strings used by script.js (toasts, form messages, buttons)
  const STRINGS = {
    en: {
      copied: 'Email copied to clipboard ✓',
      copy: 'Copy',
      copiedLabel: 'Copied',
      formInvalid: 'Please fill in every field with a valid email.',
      formSent: 'Opening your email app… thanks for reaching out!',
      formSending: 'Sending…',
      formDelivered: '✓ Message sent! I\'ll get back to you soon.',
      formFailed: 'Sorry, the message could not be sent.',
      formFallback: 'Send it by email instead',
      switchTo: 'Switch language to Urdu',
      langLabel: 'اردو',
    },
    ur: {
      copied: 'ای میل کاپی ہو گئی ✓',
      copy: 'کاپی',
      copiedLabel: 'کاپی ہو گئی',
      formInvalid: 'براہِ کرم تمام خانے درست ای میل کے ساتھ پُر کریں۔',
      formSent: 'آپ کی ای میل ایپ کھل رہی ہے… رابطہ کرنے کا شکریہ!',
      formSending: 'بھیجا جا رہا ہے…',
      formDelivered: '✓ پیغام بھیج دیا گیا! میں جلد جواب دوں گا۔',
      formFailed: 'معذرت، پیغام نہیں بھیجا جا سکا۔',
      formFallback: 'ای میل کے ذریعے بھیجیں',
      switchTo: 'Switch language to English',
      langLabel: 'English',
    },
  };

  const UR = {
    /* Nav */
    '.nav-links a': ['ہوم', 'تعارف', 'خدمات', 'کام', 'سفر', 'سرٹیفیکیٹس', 'رابطہ'],

    /* Hero */
    '.hero .label': 'فل اسٹیک سافٹ ویئر انجینئر',
    '.hero-sub': 'میں ڈیٹا بیس سے لے کر یوزر انٹرفیس تک صاف ستھری اور قابلِ توسیع ویب ایپلیکیشنز بناتا ہوں — جو حقیقی مسائل حل کریں اور استعمال میں خوشگوار ہوں۔',
    '.hero-cta .btn': { text: true, value: ['میرا کام دیکھیں', 'رابطہ کریں'] },
    '.hero-meta .link-line': ['سی وی ڈاؤن لوڈ کریں ↓', null, null],
    '.note-2 .status': '<i></i>نئے مواقع کے لیے دستیاب',
    '.values li': ['صاف کوڈ', 'قابلِ توسیع سسٹمز', 'سوچا سمجھا ڈیزائن', 'ٹیسٹ شدہ اور لائیو'],

    /* About */
    '#about .about-copy > .label': 'میرا تعارف',
    '#about .h2': 'خیالات کو<br><em>حقیقی پراڈکٹس</em> میں بدلنا۔',
    '.about-copy > p.reveal:not(.label):not(.signature)': [
      'السلام علیکم، میں <b>محمد عمر فاروقی</b> ہوں — CodingPixel میں ایسوسی ایٹ سافٹ ویئر انجینئر اور یونیورسٹی آف ہری پور سے سافٹ ویئر انجینئرنگ کا گریجویٹ۔ میں پورے اسٹیک پر کام کر کے خیالات کو صاف اور قابلِ اعتماد پراڈکٹس میں بدلتا ہوں۔',
      'میں مؤثر بیک اینڈ لاجک لکھتا ہوں، آسان انٹرفیس ڈیزائن کرتا ہوں اور یقینی بناتا ہوں کہ سب کچھ شروع سے آخر تک درست چلے — ٹیسٹ، CI اور حقیقی ڈیپلائمنٹ کے ساتھ، صرف ڈیمو نہیں۔ آج کل میری توجہ ہر جگہ TypeScript پر ہے: فرنٹ اینڈ پر <b>Next.js</b> اور <b>React</b>، بیک اینڈ پر <b>NestJS</b>، <b>Node.js</b> اور <b>PostgreSQL</b>۔',
    ],
    '.traits li': ['<span>✓</span>صاف کوڈ', '<span>✓</span>قابلِ توسیع APIs', '<span>✓</span>مسائل کا حل', '<span>✓</span>ٹیم پلیئر', '<span>✓</span>ٹیسٹ پر مبنی', '<span>✓</span>ہمیشہ سیکھنے والا'],
    '.about-card .label': 'میرا اصول',
    '.about-card blockquote p': '“صاف بنائیں، اچھی طرح ٹیسٹ کریں، اعتماد سے لانچ کریں۔”',
    '.stats small': ['بنائے گئے پروجیکٹس', 'Deskly کے ٹیسٹ', 'سرٹیفیکیٹس', 'GitHub ریپوز'],

    /* Services */
    '#services .label': 'خدمات',
    '#services .h2': 'میں آپ کے لیے<br><em>کیا بنا سکتا ہوں</em>',
    '#services .head-note': 'ایک API سے لے کر مکمل پراڈکٹ تک — توجہ سے ڈیزائن، تیار، ٹیسٹ اور ڈیپلائے کیا ہوا۔',
    '.service h3': ['فل اسٹیک ویب ایپس', 'APIs اور بیک اینڈ', 'فرنٹ اینڈ اور UI', 'ٹیسٹنگ اور ڈیپلائمنٹ'],
    '.service p': [
      'ڈیٹا بیس، API اور UI سمیت مکمل پراڈکٹس — جو بڑھنے کے لیے ڈیزائن اور آسانی سے سنبھالنے کے لیے بنائی گئی ہوں۔',
      'محفوظ اور typed REST APIs — صاف آرکیٹیکچر، ویلیڈیشن، مائیگریشنز اور درست error handling کے ساتھ۔',
      'React اور Next.js میں تیز، ریسپانسیو اور سب کے لیے قابلِ رسائی انٹرفیس، UX اصولوں کے مطابق۔',
      'یونٹ اور e2e ٹیسٹ، CI پائپ لائنز اور قابلِ اعتماد ڈیپلائمنٹ تاکہ ہر فیچر اعتماد سے لائیو ہو۔',
    ],
    '.service ul li': [null, 'لاگ اِن اور رولز', 'ڈیش بورڈز', null, null, null, null, null, 'ریسپانسیو', null, null, null],
    '.steps b': ['سمجھنا', 'ڈیزائن', 'بنانا اور ٹیسٹ', 'لانچ اور بہتری'],
    '.steps small': [
      'مسئلہ، صارفین اور کامیابی کا معیار واضح کرنا۔',
      'ڈیٹا ماڈل، API کا خاکہ اور UI فلو طے کرنا۔',
      'چھوٹے، typed اور ٹیسٹ شدہ حصوں میں کام مکمل کرنا۔',
      'CI کے ساتھ لائیو کرنا، پھر جانچنا اور بہتر بنانا۔',
    ],

    /* Skills */
    '#skills .label': 'مہارتیں اور ٹیکنالوجیز',
    '#skills .h2': 'میں کن چیزوں سے<br><em>بناتا ہوں</em>',
    '.skills-copy > p:not(.label)': 'پورے اسٹیک کے لیے جدید اور typed ٹولز — بھروسے، رفتار اور آسان دیکھ بھال کے لیے منتخب کیے گئے۔',
    '.pillars b': ['صاف کوڈ', 'آرکیٹیکچر', 'پراڈکٹ سوچ'],
    '.pillars small': ['پڑھنے میں آسان، typed اور قابلِ دیکھ بھال۔', 'پراڈکٹ کے ساتھ بڑھنے کے لیے تیار۔', 'اصل مسئلے کا حل۔'],
    '.node b': ['فرنٹ اینڈ', 'بیک اینڈ', 'ڈیٹا بیس', 'DevOps', 'ٹیسٹنگ', 'AI / ڈیٹا'],

    /* Work */
    '#work .head-row .label': 'منتخب کام',
    '#work .h2': 'وہ پروجیکٹس جن پر<br><em>مجھے فخر ہے</em>',
    '#work .head-note': 'حقیقی، لائیو اور ٹیسٹ شدہ — ہر ایک نے مجھے اچھا سافٹ ویئر بنانے کے بارے میں کچھ نیا سکھایا۔',
    '.dk-brand .label': 'نمایاں کیس اسٹڈی · فل اسٹیک',
    '.dk-brand .featured-tag': 'ہر درخواست، حل شدہ۔',
    '.dk-live .status': '<i></i>پروڈکشن میں لائیو',
    '.dk-live .btn': 'لائیو ایپ کھولیں ↗',
    '.dk-tab': ['لاگ اِن', 'رجسٹر', 'برانڈ'],
    '.dk-intro': 'ایک پروڈکشن طرز کا <b>کسٹمر سپورٹ ڈیسک</b> جس میں تین رولز ہیں — کسٹمر، ایجنٹ اور ایڈمن۔ کسٹمر ٹکٹ بناتے ہیں، ایجنٹ انہیں ایک سخت اسٹیٹس مشین کے ذریعے حل کرتے ہیں، ایڈمن سب کی نگرانی کرتے ہیں — اور ہر تبدیلی آڈٹ ٹریل میں محفوظ ہوتی ہے۔',
    '.dk-metrics small': ['یوزر رولز', 'کامیاب ٹیسٹ', 'حقیقی Postgres پر E2E'],
    '.dk-demo .label': 'ڈیمو آزمائیں',
    '.dk-demo p': 'بطور کسٹمر دیکھنے کے لیے <a href="https://trydeskly.vercel.app/register" target="_blank" rel="noopener">لائیو ایپ</a> پر مفت اکاؤنٹ بنائیں۔ ایجنٹ یا ایڈمن ڈیمو کے لیے <a href="#contact">رابطہ کریں</a>۔',
    '.dk-features b': ['لاگ اِن اور رولز', 'اسٹیٹس مشین', 'آڈٹ ٹریل', 'URL پر مبنی فہرستیں', 'CI میں ٹیسٹ شدہ', 'ڈیپلائے شدہ'],
    '.dk-features small': [
      'رول گارڈز کے ساتھ JWT لاگ اِن — کسٹمر صرف اپنے ٹکٹ دیکھ سکتے ہیں۔',
      'ٹکٹ صرف اجازت شدہ مراحل سے گزرتے ہیں، اور ایجنٹس کو تفویض کرنے کے اصول طے ہیں۔',
      'کمنٹس، ٹیگز اور <code>ticket_events</code> لاگ ریکارڈ رکھتے ہیں کہ کس نے کیا اور کب بدلا۔',
      'فلٹر، سرچ، ترتیب اور صفحات — سب URL میں محفوظ، اس لیے ہر ویو شیئر ہو سکتا ہے۔',
      'mocked repositories کے ساتھ 28 یونٹ ٹیسٹ اور حقیقی HTTP و Postgres پر 25 اینڈ ٹو اینڈ ٹیسٹ۔',
      'رن بُک، ہیلتھ چیک اور رول بیک پلان کے ساتھ پروڈکشن کے لیے مضبوط۔',
    ],
    '.arch-node small': ['کلائنٹ', 'API', 'ڈیٹا بیس'],
    '.dk-foot .btn': ['لائیو ڈیمو ↗', 'کلائنٹ کوڈ', 'API کوڈ'],
    '.filter': ['سب', 'فل اسٹیک', 'بیک اینڈ', 'فرنٹ اینڈ', 'AI / ML'],
    '.proj-kind': ['فائنل ایئر پروجیکٹ', 'REST API', 'کلائنٹ ایپ', 'ویب ایپ', 'ڈیٹا بیس', 'CLI ٹول'],
    '.proj p': [
      'مشین لرننگ سسٹم جو سورس کوڈ میٹرکس کا تجزیہ کر کے ڈیپلائمنٹ سے پہلے بگز اور کمزوریوں کی پیش گوئی کرتا ہے، Jenkins اور GitLab CI کے ساتھ۔',
      'NestJS کے ساتھ محفوظ REST API — JWT سے محفوظ روٹس، PostgreSQL پر TypeORM، CORS اور یونٹ + e2e ٹیسٹ۔',
      'Tasks API کے لیے Next.js کلائنٹ — سائن اِن، فہرست، اسٹیٹس فلٹر، ٹاسک بنانا اور حذف کرنا۔',
      'سرور سے حاصل کردہ ممالک کی فہرست، ڈائنامک روٹس، لوڈنگ اور ایرر باؤنڈریز — پہلے React + Vite، پھر Next.js میں۔',
      'PostgreSQL پر typed entities، مائیگریشنز، seed اسکرپٹ اور چھ typed query فنکشنز۔',
      'TypeScript CLI جو صارفین، پوسٹس اور ٹوڈوز ایک ساتھ حاصل کر کے درجہ بندی کی رپورٹ بناتی ہے۔',
    ],
    '.proj-link': 'کوڈ دیکھیں ↗',

    /* Journey */
    '#journey .label': 'کیریئر کا سفر',
    '#journey .h2': 'ترقی اور<br><em>مہارت کا سفر</em>۔',
    '.journey-copy > p:not(.label)': 'سافٹ ویئر کیوں ناکام ہوتا ہے یہ پڑھنے سے لے کر ایسے سسٹمز بنانے تک جو ناکام نہ ہوں — ہر قدم بہتر سافٹ ویئر بنانا سیکھنے کے بارے میں رہا ہے۔',
    '.journey-copy .btn': 'ریزیومے ڈاؤن لوڈ کریں ↓',
    '.tl-when': ['2026 — اب تک · فل ٹائم', '2021 — 2025 · ڈگری', 'Google · Cisco · Coursera · Simplilearn'],
    '.tl h3': ['ایسوسی ایٹ سافٹ ویئر انجینئر', 'بی ایس سافٹ ویئر انجینئرنگ', 'پروفیشنل سرٹیفیکیٹس'],
    '.tl-org': [null, 'یونیورسٹی آف ہری پور', '10 سرٹیفیکیٹس اور گائیڈڈ پروجیکٹس'],
    '.tl li': [
      'TypeScript، Next.js، NestJS اور PostgreSQL کے ساتھ فل اسٹیک فیچرز بنانا۔',
      '<b>Deskly</b> لانچ کیا — Railway، Neon Postgres اور Vercel پر رول بیسڈ سپورٹ ڈیسک، CI میں 53 کامیاب ٹیسٹوں کے ساتھ۔',
      'TypeORM سے اسکیمہ اور مائیگریشنز ڈیزائن کیں؛ JWT اور رول گارڈز سے APIs محفوظ کیں۔',
      'فائنل ایئر پروجیکٹ: کوڈ میٹرکس پر مشین لرننگ کے ذریعے <b>CI/CD پائپ لائنز میں AI سے بگ کی نشاندہی</b>۔',
      'سافٹ ویئر ڈیزائن، ڈیٹا اسٹرکچرز، ڈیٹا بیس اور سافٹ ویئر کوالٹی کی مضبوط بنیاد۔',
      'پانچ Google پروفیشنل سرٹیفیکیٹس — سائبر سیکیورٹی، ڈیٹا اینالیٹکس، ایڈوانسڈ ڈیٹا اینالیٹکس، UX ڈیزائن اور ڈیجیٹل مارکیٹنگ و ای کامرس۔',
      'Canva ویب ڈیزائن اور WordPress ویب سائٹس پر Coursera کے گائیڈڈ پروجیکٹس۔',
      'Git اور Docker میں Simplilearn SkillUp سرٹیفیکیٹس۔',
      'Cisco Networking Academy — JavaScript Essentials 1۔',
    ],

    /* GitHub */
    '#github .label': 'اوپن سورس',
    '#github .h2': 'GitHub سے<br><em>براہِ راست</em>',
    '#github .head-note': 'ہر بار صفحہ کھلنے پر GitHub API سے تازہ معلومات۔',
    '.gh-stats small': ['ریپوز', 'فالوورز', 'زبانیں'],
    '.gh-profile .btn': 'GitHub پر فالو کریں ↗',
    '.gh-chart-head b': 'کنٹریبیوشن سرگرمی',
    '.gh-chart-head .status': '<i></i>لائیو',

    /* Certifications */
    '#certifications .label': 'اسناد',
    '#certifications .h2': '<em>سرٹیفیکیٹس</em>',
    '#certifications .head-note': 'Google، Cisco، Coursera اور Simplilearn کے پروفیشنل سرٹیفیکیٹس اور کورسز۔',
    '.cert-verify': { dict: { 'View program ↗': 'پروگرام دیکھیں ↗', 'View course ↗': 'کورس دیکھیں ↗', 'View certificate ↗': 'سرٹیفیکیٹ دیکھیں ↗', 'Verify credential ↗': 'سند کی تصدیق ↗' } },

    /* Contact */
    '#contact .label': 'رابطہ',
    '#contact .h2': 'آئیے مل کر کچھ<br><em>شاندار</em> بنائیں۔',
    '.contact-copy > p:not(.label)': 'کوئی جاب، پروجیکٹ یا صرف سلام کہنا ہو؟ میرا ان باکس ہمیشہ کھلا ہے — میں عموماً ایک دن کے اندر جواب دیتا ہوں۔',
    '.copy-label': 'کاپی',
    '.contact-links a': [null, null, 'ریزیومے ↓'],
    '.field label': ['آپ کا نام', 'آپ کی ای میل', 'آپ کا پیغام'],
    '.contact-form .btn': { text: true, value: 'پیغام بھیجیں' },

    /* Footer */
    '.footer-inner p:not(.muted)': `© <span id="year">${new Date().getFullYear()}</span> محمد عمر فاروقی۔ جملہ حقوق محفوظ ہیں۔`,
    '.footer-inner p.muted': 'نیویگیشن کے لیے <kbd>Ctrl</kbd> + <kbd>K</kbd> دبائیں',
  };

  // Replace the first meaningful text node (keeps icons/SVG intact)
  const firstTextNode = (el) => [...el.childNodes].find((n) => n.nodeType === 3 && n.textContent.trim());

  const applyTo = (el, value, textOnly) => {
    if (!('en' in el.dataset)) el.dataset.en = textOnly ? firstTextNode(el)?.textContent ?? '' : el.innerHTML;
    if (textOnly) {
      const node = firstTextNode(el);
      if (node) node.textContent = value === null ? el.dataset.en : ` ${value} `;
    } else {
      el.innerHTML = value === null ? el.dataset.en : value;
    }
  };

  const restore = (el, textOnly) => {
    if (!('en' in el.dataset)) return;
    if (textOnly) { const node = firstTextNode(el); if (node) node.textContent = el.dataset.en; }
    else el.innerHTML = el.dataset.en;
  };

  const translate = (lang) => {
    Object.entries(UR).forEach(([selector, rule]) => {
      const els = $$(selector);
      const textOnly = typeof rule === 'object' && !Array.isArray(rule) && rule.text;
      const value = textOnly ? rule.value : rule;
      els.forEach((el, i) => {
        if (lang === 'en') return restore(el, textOnly);
        if (rule && rule.dict) {
          if (!('en' in el.dataset)) el.dataset.en = el.innerHTML;
          const ur = rule.dict[el.dataset.en.trim()];
          if (ur) el.innerHTML = ur;
          return;
        }
        const v = Array.isArray(value) ? value[i] : value;
        if (v === undefined) return;
        applyTo(el, v, textOnly);
      });
    });
  };

  const loadUrduFont = () => {
    if (document.getElementById('urduFont')) return;
    const link = document.createElement('link');
    link.id = 'urduFont';
    link.rel = 'stylesheet';
    link.href = URDU_FONT;
    document.head.appendChild(link);
  };

  const setLang = (lang, { save = true } = {}) => {
    if (lang === 'ur') loadUrduFont();
    root.lang = lang;
    root.dir = lang === 'ur' ? 'rtl' : 'ltr';
    translate(lang);
    const btn = document.getElementById('langToggle');
    if (btn) {
      btn.querySelector('.lang-label').textContent = STRINGS[lang].langLabel;
      btn.setAttribute('aria-label', STRINGS[lang].switchTo);
    }
    if (save) { try { localStorage.setItem('lang', lang); } catch (e) {} }
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
  };

  window.i18n = {
    get lang() { return root.lang === 'ur' ? 'ur' : 'en'; },
    t: (key) => STRINGS[root.lang === 'ur' ? 'ur' : 'en'][key] ?? key,
    set: setLang,
    toggle: () => setLang(root.lang === 'ur' ? 'en' : 'ur'),
  };

  document.getElementById('langToggle')?.addEventListener('click', () => window.i18n.toggle());
  // The <head> script already set lang/dir before paint; now translate the content
  if (root.lang === 'ur') setLang('ur', { save: false });
})();

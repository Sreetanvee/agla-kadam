import type {
  AchievementRecord,
  LanguageCode,
  OpportunityCategory,
  StudentStage,
} from '../types/domain';

type LocalizedPair = { hi: string; te: string };
type LocalizedCategoryMeta = {
  hi: { name: string; shortName: string; description: string };
  te: { name: string; shortName: string; description: string };
};

export const CATEGORY_TRANSLATIONS: Record<string, LocalizedCategoryMeta> = {
  'school-academic-pathways': {
    hi: {
      name: 'स्कूल और शैक्षिक रास्ते (School & Academic Pathways)',
      shortName: 'स्कूल और रास्ते',
      description: 'कक्षा 10 और 12 के बाद के स्ट्रीम, बोर्ड, पॉलिटेक्निक डिप्लोमा, ITI और ओपन स्कूलिंग के विकल्प।',
    },
    te: {
      name: 'పాఠశాల & విద్యా మార్గాలు',
      shortName: 'స్కూల్ & మార్గాలు',
      description: '10వ & 12వ తరగతి తర్వాత స్ట్రీమ్స్, పాలిటెక్నిక్ డిప్లొమా, ITI మరియు ఓపెన్ స్కూలింగ్ ఎంపికలు.',
    },
  },
  'competitive-examinations': {
    hi: {
      name: 'प्रतियोगी परीक्षाएँ (Competitive Examinations)',
      shortName: 'प्रतियोगी परीक्षाएँ',
      description: 'UPSC, GATE, JEE, NEET, CUET, CLAT, CAT, SSC और अन्य राष्ट्रीय/राज्य परीक्षाओं की स्पष्ट जानकारी।',
    },
    te: {
      name: 'పోటీ పరీక్షలు (Competitive Exams)',
      shortName: 'పోటీ పరీక్షలు',
      description: 'UPSC, GATE, JEE, NEET, CUET, CLAT, CAT, SSC మరియు జాతీయ/రాష్ట్ర పరీక్షల వివరాలు.',
    },
  },
  'government-jobs-public-sector': {
    hi: {
      name: 'सरकारी नौकरियाँ और सार्वजनिक क्षेत्र (Govt & PSU)',
      shortName: 'सरकारी और PSU',
      description: 'केंद्र व राज्य सरकार की सेवाएँ, PSU भर्तियाँ, बैंकिंग, रेलवे, रक्षा और शिक्षण अवसर।',
    },
    te: {
      name: 'ప్రభుత్వ ఉద్యోగాలు & పబ్లిక్ సెక్టార్',
      shortName: 'ప్రభుత్వ రంగం',
      description: 'కేంద్ర, రాష్ట్ర ప్రభుత్వ ఉద్యోగాలు, PSUలు, బ్యాంకింగ్, రైల్వే మరియు రక్షణ సేవలు.',
    },
  },
  'higher-education-admissions': {
    hi: {
      name: 'उच्च शिक्षा और विश्वविद्यालय प्रवेश (Higher Education)',
      shortName: 'उच्च शिक्षा',
      description: 'UG, PG, इंटीग्रेटेड डिग्री, काउंसलिंग, क्रेडिट सिस्टम और भारत के प्रमुख विश्वविद्यालय।',
    },
    te: {
      name: 'ఉన్నత విద్య & విశ్వవిద్యాలయ ప్రవేశాలు',
      shortName: 'ఉన్నత విద్య',
      description: 'UG, PG, ఇంటిగ్రేటెడ్ డిగ్రీలు, కౌన్సెలింగ్ మరియు భారత విశ్వవిద్యాలయాల ప్రవేశ విధానాలు.',
    },
  },
  'research-and-academia': {
    hi: {
      name: 'रिसर्च और अकादमिक करियर (Research & Academia)',
      shortName: 'रिसर्च और अकादमिक',
      description: 'रिसर्च इंटर्नशिप, JRF, PhD प्रवेश, प्रयोगशालाएँ और प्रोफ़ेसर/वैज्ञानिक बनने की राह।',
    },
    te: {
      name: 'పరిశోధన & అకాడెమియా (Research)',
      shortName: 'పరిశోధన',
      description: 'రీసెర్చ్ ఇంటర్న్‌షిప్‌లు, JRF, PhD ప్రవేశాలు మరియు శాస్త్రీయ పరిశోధన మార్గాలు.',
    },
  },
  'research-papers-publishing': {
    hi: {
      name: 'रिसर्च पेपर और प्रकाशन (Research Publishing)',
      shortName: 'रिसर्च प्रकाशन',
      description: 'अपना पहला रिसर्च पेपर लिखना, Peer Review समझना और नक़ली (Predatory) जर्नल से बचना।',
    },
    te: {
      name: 'పరిశోధనా పత్రాలు & ప్రచురణ',
      shortName: 'పబ్లిషింగ్',
      description: 'మొదటి రీసెర్చ్ పేపర్ రాయడం, పీర్ రివ్యూ మరియు నకిలీ జర్నల్స్ గుర్తించడం.',
    },
  },
  'patents-intellectual-property': {
    hi: {
      name: 'पेटेंट और बौद्धिक संपदा (Patents & IP)',
      shortName: 'पेटेंट और IP',
      description: 'भारत में पेटेंट, कॉपीराइट और ट्रेडमार्क कैसे काम करते हैं और छात्र कैसे फाइल कर सकते हैं।',
    },
    te: {
      name: 'పేటెంట్లు & మేధో సంపత్తి (Patents & IP)',
      shortName: 'పేటెంట్లు & IP',
      description: 'భారతదేశంలో పేటెంట్, కాపీరైట్ మరియు ట్రేడ్‌మార్క్ దరఖాస్తు విధానాలు.',
    },
  },
  'internships-professional-experience': {
    hi: {
      name: 'इंटर्नशिप और व्यावहारिक अनुभव (Internships)',
      shortName: 'इंटर्नशिप',
      description: 'कॉलेज के दौरान सार्थक इंटर्नशिप, IIT/IISc समर प्रोग्राम और प्रोफ़ेसर को कोल्ड ईमेल लिखना।',
    },
    te: {
      name: 'ఇంటర్న్‌షిప్‌లు & వృత్తి అనుభవం',
      shortName: 'ఇంటర్న్‌షిప్‌లు',
      description: 'అర్థవంతమైన ఇంటర్న్‌షిప్‌లు, IIT/IISc సమ్మర్ ప్రోగ్రామ్‌లు మరియు ప్రాజెక్ట్ అనుభవం.',
    },
  },
  'careers-and-employment': {
    hi: {
      name: 'करियर और रोज़गार (Careers & Employment)',
      shortName: 'करियर और नौकरी',
      description: 'रेज़्यूमे, इंटरव्यू, ऑफ़-कैंपस आवेदन और CTC बनाम In-Hand Salary को समझना।',
    },
    te: {
      name: 'కెరీర్లు & ఉపాధి',
      shortName: 'కెరీర్ & ఉద్యోగాలు',
      description: 'రెజ్యూమే, ఇంటర్వ్యూలు, ఆఫ్-క్యాంపస్ దరఖాస్తులు మరియు CTC vs In-Hand జీతం.',
    },
  },
  'scholarships-financial-assistance': {
    hi: {
      name: 'छात्रवृत्तियाँ और आर्थिक सहायता (Scholarships & Aid)',
      shortName: 'छात्रवृत्तियाँ',
      description: 'NSP, केंद्रीय व राज्य छात्रवृत्तियाँ, मेरिट-कम-मीन्स सहायता और शिक्षा ऋण (Education Loan)।',
    },
    te: {
      name: 'స్కాలర్‌షిప్‌లు & ఆర్థిక సహాయం',
      shortName: 'స్కాలర్‌షిప్‌లు',
      description: 'NSP, కేంద్ర, రాష్ట్ర స్కాలర్‌షిప్‌లు, ఫెలోషిప్‌లు మరియు విద్యా రుణాలు.',
    },
  },
  'international-education-opportunities': {
    hi: {
      name: 'अंतर्राष्ट्रीय शिक्षा और वैश्विक अवसर (Global Pathways)',
      shortName: 'विदेश में पढ़ाई',
      description: 'बिना भ्रामक एजेंट के विदेश में फंडेड पढ़ाई, SOP, LOR, IELTS/GRE और ग्लोबल फ़ेलोशिप।',
    },
    te: {
      name: 'అంతర్జాతీయ విద్య & అవకాశాలు',
      shortName: 'గ్లోబల్ మార్గాలు',
      description: 'స్కాలర్‌షిప్‌లతో విదేశీ విద్య, SOP, LOR, IELTS/GRE మరియు అంతర్జాతీయ ఫెలోషిప్‌లు.',
    },
  },
  'entrepreneurship-startups': {
    hi: {
      name: 'उद्यमिता और स्टार्टअप्स (Entrepreneurship & Startups)',
      shortName: 'स्टार्टअप्स',
      description: 'स्टूडेंट स्टार्टअप की शुरुआत, आइडिया वैलिडेशन, कॉलेज इनक्यूबेटर, DPIIT और सरकारी ग्रांट।',
    },
    te: {
      name: 'వ్యాపారవేత్తత్వం & స్టార్టప్‌లు',
      shortName: 'స్టార్టప్‌లు',
      description: 'స్టూడెంట్ స్టార్టప్‌లు, ఇంక్యుబేటర్లు, DPIIT నమోదు మరియు స్టార్టప్ గ్రాంట్లు.',
    },
  },
  'skills-certifications': {
    hi: {
      name: 'कौशल और प्रमाणपत्र (Skills & Certifications)',
      shortName: 'कौशल और सर्टिफ़िकेट',
      description: 'SWAYAM, NPTEL, अप्रेंटिसशिप और वास्तव में मूल्यवान प्रैक्टिकल स्किल्स चुनना।',
    },
    te: {
      name: 'నైపుణ్యాలు & సర్టిఫికేషన్లు',
      shortName: 'నైపుణ్యాలు',
      description: 'SWAYAM, NPTEL, అప్రెంటిస్‌షిప్‌లు మరియు విలువైన నైపుణ్యాల ఎంపిక.',
    },
  },
  'personal-development-mindset': {
    hi: {
      name: 'व्यक्तित्व विकास और मानसिकता (Mindset & Growth)',
      shortName: 'व्यक्तित्व विकास',
      description: 'संवाद कौशल, निर्णय लेने की समझ, परीक्षा तनाव प्रबंधन और आत्मविश्वास निर्माण।',
    },
    te: {
      name: 'వ్యక్తిత్వ వికాసం & మైండ్‌సెట్',
      shortName: 'వ్యక్తిత్వ వికాసం',
      description: 'కమ్యూనికేషన్, నిర్ణయాధికారం, ఒత్తిడి నిర్వహణ మరియు ఆత్మవిశ్వాసం.',
    },
  },
  'study-techniques-exam-skills': {
    hi: {
      name: 'अध्ययन तकनीक और परीक्षा कौशल (Study Methods)',
      shortName: 'पढ़ाई के तरीके',
      description: 'एक्टिव रिकॉल, मॉक टेस्ट विश्लेषण, नोट्स बनाना और वैज्ञानिक रिवीज़न रणनीति।',
    },
    te: {
      name: 'అధ్యయన పద్ధతులు & పరీక్ష నైపుణ్యాలు',
      shortName: 'చదువు పద్ధతులు',
      description: 'యాక్టివ్ రీకాల్, మాక్ టెస్ట్ విశ్లేషణ మరియు శాస్త్రీయ రివిజన్ పద్ధతులు.',
    },
  },
  'digital-professional-life': {
    hi: {
      name: 'डिजिटल और प्रोफ़ेशनल जीवन (Digital Life)',
      shortName: 'डिजिटल जीवन',
      description: 'प्रोफ़ेशनल ईमेल, LinkedIn, GitHub पोर्टफ़ोलियो और डिजिटल सुरक्षा।',
    },
    te: {
      name: 'డిజిటల్ & వృత్తిపరమైన జీవితం',
      shortName: 'డిజిటల్ జీవితం',
      description: 'ప్రొఫెషనల్ ఇమెయిల్స్, LinkedIn, పోర్ట్‌ఫోలియో మరియు డిజిటల్ భద్రత.',
    },
  },
  'government-services-public-processes': {
    hi: {
      name: 'सरकारी सेवाएँ और ज़रूरी दस्तावेज़ (Public Processes)',
      shortName: 'सरकारी प्रक्रियाएँ',
      description: 'DigiLocker, APAAR/ABC ID, PAN, भारतीय पासपोर्ट, जाति/आय प्रमाणपत्र और RTI।',
    },
    te: {
      name: 'ప్రభుత్వ సేవలు & పౌర ప్రక్రియలు',
      shortName: 'ప్రభుత్వ ప్రక్రియలు',
      description: 'DigiLocker, APAAR/ABC ID, PAN, పాస్‌పోర్ట్ మరియు అవసరమైన సర్టిఫికెట్లు.',
    },
  },
  'financial-literacy-career-planning': {
    hi: {
      name: 'वित्तीय साक्षरता और करियर योजना (Financial Literacy)',
      shortName: 'वित्तीय समझ',
      description: 'बजट, छात्र बैंकिंग, शिक्षा ऋण की शर्तें, टैक्स की बुनियादी समझ और ऑनलाइन धोखाधड़ी से बचाव।',
    },
    te: {
      name: 'ఆర్థిక అక్షరాస్యత & కెరీర్ ప్రణాళిక',
      shortName: 'ఆర్థిక అవగాహన',
      description: 'బడ్జెట్, స్టూడెంట్ బ్యాంకింగ్, విద్యా రుణ నిబంధనలు మరియు ఆర్థిక భద్రత.',
    },
  },
};

export const COMPLETE_GUIDE_LIST_TRANSLATIONS: Record<
  string,
  { hi: { title: string; summary: string }; te: { title: string; summary: string } }
> = {
  'after-class-10-pathways': {
    hi: {
      title: 'कक्षा 10 के बाद क्या करें: स्ट्रीम, डिप्लोमा, ITI और ओपन स्कूलिंग (NIOS)',
      summary: '10वीं के बाद Science, Commerce, Humanities, Polytechnic Diploma, ITI और NIOS के सभी वास्तविक विकल्पों की साफ़ तुलना।',
    },
    te: {
      title: '10వ తరగతి తర్వాత ఏమి చేయాలి: స్ట్రీమ్స్, డిప్లొమా, ITI & NIOS',
      summary: '10వ తరగతి తర్వాత ఇంటర్మీడియట్, పాలిటెక్నిక్ డిప్లొమా, ITI మరియు NIOS ఎంపికల స్పష్టమైన వివరణ.',
    },
  },
  'class-12-beyond-engineering-medicine': {
    hi: {
      title: 'कक्षा 12 के बाद इंजीनियरिंग और मेडिकल से आगे के बेहतरीन रास्ते',
      summary: 'JEE और NEET के अलावा Law (CLAT), Design (NID/UCEED), Pure Science (IISER), Economics, रक्षा और लिबरल आर्ट्स के अवसर।',
    },
    te: {
      title: '12వ తరగతి తర్వాత ఇంజనీరింగ్ & మెడిసిన్ దాటి ఉన్న మార్గాలు',
      summary: 'JEE/NEET కాకుండా లా, డిజైన్, IISER పరిశోధన, ఎకనామిక్స్ మరియు CUET ద్వారా ఉన్నత విద్యా అవకాశాలు.',
    },
  },
  'upsc-civil-services-from-zero': {
    hi: {
      title: 'UPSC सिविल सेवा परीक्षा (IAS, IPS, IFS) बिल्कुल शुरुआत से',
      summary: 'UPSC CSE की पात्रता, Prelims-Mains-Interview पैटर्न, NCERT आधार, अटेम्प्ट नियम और ईमानदार बैकअप योजना।',
    },
    te: {
      title: 'UPSC సివిల్ సర్వీసెస్ పరీక్ష (IAS, IPS, IFS) సున్నా నుండి',
      summary: 'UPSC CSE అర్హత, ప్రిలిమ్స్-మెయిన్స్-ఇంటర్వ్యూ విధానం, ప్రిపరేషన్ మరియు బ్యాకప్ ప్రణాళిక.',
    },
  },
  'gate-exam-pg-and-psu-guide': {
    hi: {
      title: 'GATE परीक्षा: M.Tech, PhD, PSU नौकरियाँ और अंतर्राष्ट्रीय मान्यता',
      summary: 'GATE के ज़रिए IIT/IISc में स्टाइपेंड सहित उच्च शिक्षा, महारत्न PSU नौकरियाँ और विदेशों में अवसर।',
    },
    te: {
      title: 'GATE పరీక్ష: M.Tech, PhD, PSU ఉద్యోగాలు & అంతర్జాతీయ గుర్తింపు',
      summary: 'GATE ద్వారా IIT/IISc లో M.Tech/PhD స్టైపెండ్, PSU ఉద్యోగాలు మరియు విదేశీ ప్రవేశాల పూర్తి గైడ్.',
    },
  },
  'cuet-ug-central-university-admissions': {
    hi: {
      title: 'CUET UG और PG: केंद्रीय व प्रमुख विश्वविद्यालयों में प्रवेश',
      summary: 'DU, BHU, JNU, हैदराबाद विश्वविद्यालय सहित केंद्रीय विश्वविद्यालयों के लिए CUET विषय चयन और काउंसलिंग प्रक्रिया।',
    },
    te: {
      title: 'CUET UG & PG: కేంద్ర & భాగస్వామ్య విశ్వవిద్యాలయ ప్రవేశాలు',
      summary: 'DU, BHU, JNU, HCU వంటి కేంద్ర విశ్వవిద్యాలయాలలో CUET పరీక్ష మరియు కౌన్సెలింగ్ విధానం.',
    },
  },
  'clat-nlu-law-admissions': {
    hi: {
      title: 'CLAT और नेशनल लॉ यूनिवर्सिटी (NLU) में कानून की पढ़ाई',
      summary: '12वीं के बाद 5-वर्षीय BA LLB, CLAT परीक्षा की तैयारी, NLU शुल्क सहायता और कानूनी करियर के विकल्प।',
    },
    te: {
      title: 'CLAT & నేషనల్ లా యూనివర్సిటీ (NLU) ప్రవేశాలు',
      summary: '12వ తరగతి తర్వాత 5-ఏళ్ల లా డిగ్రీ, CLAT పరీక్ష విధానం మరియు NLU కెరీర్ మార్గాలు.',
    },
  },
  'write-publish-first-research-paper': {
    hi: {
      title: 'अपना पहला रिसर्च पेपर कैसे लिखें और प्रकाशित करें',
      summary: 'रिसर्च विषय चुनने, Literature Review, लेखन संरचना (IMRaD), मेंटर खोजने और सही जर्नल में सबमिट करने की पूरी प्रक्रिया।',
    },
    te: {
      title: 'మీ మొదటి రీసెర్చ్ పేపర్ ఎలా రాయాలి మరియు ప్రచురించాలి',
      summary: 'పరిశోధన అంశం ఎంపిక, సాహిత్య సమీక్ష, పేపర్ నిర్మాణం మరియు సరైన జర్నల్‌లో ప్రచురణ విధానం.',
    },
  },
  'peer-review-journals-predatory-check': {
    hi: {
      title: 'Peer Review, जर्नल इंडेक्सिंग और नक़ली (Predatory) प्रकाशकों से बचाव',
      summary: 'Scopus, Web of Science और UGC-CARE की समझ, तथा पैसे लेकर फ़र्ज़ी प्रकाशन करने वाले जर्नल की पहचान।',
    },
    te: {
      title: 'పీర్ రివ్యూ, జర్నల్ ఇండెక్సింగ్ & నకిలీ ప్రచురణకర్తల నుండి రక్షణ',
      summary: 'అసలైన పీర్-రివ్యూడ్ జర్నల్స్ గుర్తించడం మరియు నకిలీ జర్నల్స్ బారిన పడకుండా జాగ్రత్తలు.',
    },
  },
  'patents-intellectual-property-india': {
    hi: {
      title: 'भारत में पेटेंट और बौद्धिक संपदा (IP): अपना पहला पेटेंट कैसे फाइल करें',
      summary: 'पेटेंट की शर्तें, Prior Art Search, प्रोविज़नल बनाम कम्प्लीट आवेदन, छात्र शुल्क छूट और IP India पोर्टल प्रक्रिया।',
    },
    te: {
      title: 'భారతదేశంలో పేటెంట్లు & మేధో సంపత్తి: మొదటి పేటెంట్ ఫైలింగ్',
      summary: 'పేటెంట్ అర్హత, ప్రయర్ ఆర్ట్ సెర్చ్, విద్యార్థి ఫీజు రాయితీలు మరియు IP India పోర్టల్ విధానం.',
    },
  },
  'finding-completing-first-internship': {
    hi: {
      title: 'अपनी पहली सार्थक इंटर्नशिप कैसे खोजें और पूरी करें',
      summary: 'AICTE, IIT/IISc समर फ़ेलोशिप, प्रोफ़ेसर को प्रभावी कोल्ड ईमेल और नक़ली पेड इंटर्नशिप से बचने के तरीके।',
    },
    te: {
      title: 'మీ మొదటి అర్థవంతమైన ఇంటర్న్‌షిప్ ఎలా పొందాలి & పూర్తి చేయాలి',
      summary: 'AICTE, IIT సమ్మర్ ఫెలోషిప్‌లు, ప్రొఫెసర్లకు కోల్డ్ ఇమెయిల్స్ మరియు నకిలీ ఇంటర్న్‌షిప్‌ల నుండి రక్షణ.',
    },
  },
  'resumes-interviews-offer-letters': {
    hi: {
      title: 'रेज़्यूमे, इंटरव्यू और जॉब ऑफ़र लेटर समझना (CTC बनाम In-Hand Salary)',
      summary: 'ATS-फ़्रेंडली रेज़्यूमे बनाना, इंटरव्यू तैयारी और ऑफ़र लेटर में CTC, वेरिएबल पे, PF व सर्विस बॉन्ड की सही समझ।',
    },
    te: {
      title: 'రెజ్యూమే, ఇంటర్వ్యూలు & జాబ్ ఆఫర్ లెటర్ (CTC vs In-Hand) వివరణ',
      summary: 'ATS రెజ్యూమే తయారీ, ఇంటర్వ్యూ సిద్ధత మరియు ఆఫర్ లెటర్‌లోని CTC, బాండ్ నిబంధనల వివరణ.',
    },
  },
  'scholarships-financial-assistance-india': {
    hi: {
      title: 'भारत में छात्रवृत्तियाँ और आर्थिक सहायता: NSP, केंद्रीय, राज्य व निजी सहायता',
      summary: 'National Scholarship Portal (NSP), पोस्ट-मैट्रिक, मेरिट-कम-मीन्स, INSPIRE और शिक्षा ऋण (Vidya Lakshmi) गाइड।',
    },
    te: {
      title: 'భారతదేశంలో స్కాలర్‌షిప్‌లు & ఆర్థిక సహాయం: NSP, కేంద్ర, రాష్ట్ర పథకాలు',
      summary: 'నేషనల్ స్కాలర్‌షిప్ పోర్టల్ (NSP), INSPIRE, రాష్ట్ర స్కాలర్‌షిప్‌లు మరియు విద్యా రుణాల గైడ్.',
    },
  },
  'studying-abroad-sops-lors-funding': {
    hi: {
      title: 'बिल्कुल शुरुआत से विदेश में पढ़ाई: देश, SOP, LOR, टेस्ट और पूर्ण फ़ंडिंग',
      summary: 'जर्मनी/यूरोप में कम या शून्य ट्यूशन फ़ीस, DAAD, Erasmus Mundus, Chevening, SOP-LOR लेखन और एजेंट धोखाधड़ी से बचाव।',
    },
    te: {
      title: 'సున్నా నుండి విదేశీ విద్య: దేశాలు, SOPలు, LORలు & పూర్తి స్కాలర్‌షిప్‌లు',
      summary: 'జర్మనీ/యూరప్ ఉచిత ట్యూషన్, DAAD, Erasmus Mundus, SOP/LOR రాయడం మరియు ఏజెంట్ మోసాల నుండి రక్షణ.',
    },
  },
  'student-startups-dpiit-incubation-grants': {
    hi: {
      title: 'भारत में स्टूडेंट स्टार्टअप की शुरुआत: वैलिडेशन, DPIIT, इनक्यूबेटर और ग्रांट',
      summary: 'ग्राहक समस्या जाँचना, कॉलेज इनक्यूबेटर, Startup India DPIIT मान्यता, NIDHI PRAYAS व सीड फंडिंग।',
    },
    te: {
      title: 'భారతదేశంలో స్టూడెంట్ స్టార్టప్ ప్రారంభం: DPIIT, ఇంక్యుబేటర్లు & గ్రాంట్లు',
      summary: 'ఐడియా వాలిడేషన్, కాలేజ్ ఇంక్యుబేటర్లు, DPIIT నమోదు మరియు ప్రభుత్వ స్టార్టప్ గ్రాంట్లు.',
    },
  },
  'essential-student-documents-digilocker-pan-passport': {
    hi: {
      title: 'ज़रूरी विद्यार्थी दस्तावेज़: DigiLocker, APAAR/ABC ID, PAN और भारतीय पासपोर्ट',
      summary: 'हर भारतीय छात्र के लिए ज़रूरी डिजिटल दस्तावेज़, ऑनलाइन आवेदन प्रक्रिया और दस्तावेज़ों में नाम सुधार के नियम।',
    },
    te: {
      title: 'విద్యార్థులకు అవసరమైన డాక్యుమెంట్లు: DigiLocker, APAAR/ABC ID, PAN & పాస్‌పోర్ట్',
      summary: 'ప్రతి విద్యార్థి వద్ద ఉండాల్సిన డిజిటల్ డాక్యుమెంట్లు మరియు అధికారిక దరఖాస్తు విధానాలు.',
    },
  },
};

export const JOURNEY_LIST_TRANSLATIONS: Record<
  string,
  { hi: { title: string; subtitle: string }; te: { title: string; subtitle: string } }
> = {
  'become-ias-ips-officer': {
    hi: { title: 'IAS या IPS अधिकारी बनने की यात्रा', subtitle: 'कॉलेज स्तर से UPSC Prelims, Mains, Interview और प्रशिक्षण तक क्रमबद्ध मार्ग।' },
    te: { title: 'IAS లేదా IPS అధికారి కావడానికి ప్రయాణం', subtitle: 'డిగ్రీ నుండి UPSC ప్రిలిమ్స్, మెయిన్స్, ఇంటర్వ్యూ మరియు శిక్షణ వరకు.' },
  },
  'prepare-government-examinations': {
    hi: { title: 'भारतीय सरकारी परीक्षाओं की तैयारी', subtitle: 'SSC, बैंकिंग, रेलवे, राज्य PSC और रक्षा परीक्षाओं के लिए स्मार्ट व समयबद्ध तैयारी।' },
    te: { title: 'భారత ప్రభుత్వ పరీక్షలకు సిద్ధత', subtitle: 'SSC, బ్యాంకింగ్, రైల్వే, రాష్ట్ర PSC మరియు రక్షణ పరీక్షలకు వ్యూహాత్మక మార్గం.' },
  },
  'write-publish-research-paper': {
    hi: { title: 'रिसर्च पेपर लिखना और प्रकाशित करना', subtitle: 'पहली बार शोध शुरू करने से लेकर सही Peer-Reviewed जर्नल में प्रकाशन तक।' },
    te: { title: 'రీసెర్చ్ పేపర్ రాయడం & ప్రచురించడం', subtitle: 'పరిశోధన ఆలోచన నుండి పీర్-రివ్యూడ్ జర్నల్ ప్రచురణ వరకు దశలవారీ ప్రయాణం.' },
  },
  'applying-for-a-patent': {
    hi: { title: 'भारत में पेटेंट के लिए आवेदन करना', subtitle: 'अन्वेषण (Invention) की जाँच से लेकर IP India पोर्टल पर पेटेंट ग्रांट तक।' },
    te: { title: 'భారతదేశంలో పేటెంట్ కోసం దరఖాస్తు', subtitle: 'ఆవిష్కరణ పరిశీలన నుండి IP India పోర్టల్‌లో పేటెంట్ పొందే వరకు.' },
  },
  'find-complete-internship': {
    hi: { title: 'सार्थक इंटर्नशिप खोजना और पूरी करना', subtitle: 'कौशल निर्माण, आवेदन, प्रोजेक्ट डिलीवरी और PPO/सर्टिफ़िकेट तक का रास्ता।' },
    te: { title: 'అర్థవంతమైన ఇంటర్న్‌షిప్ పొందడం & పూర్తి చేయడం', subtitle: 'నైపుణ్యాలు, దరఖాస్తులు, ప్రాజెక్ట్ పని మరియు రికమెండేషన్ వరకు.' },
  },
  'starting-a-company': {
    hi: { title: 'भारत में कंपनी या स्टार्टअप शुरू करना', subtitle: 'प्रोटोटाइप, इनक्यूबेशन, DPIIT पंजीकरण और शुरुआती फंडिंग के चरण।' },
    te: { title: 'భారతదేశంలో స్టార్టప్ లేదా కంపెనీ ప్రారంభం', subtitle: 'ప్రోటోటైప్, ఇంక్యుబేషన్, DPIIT రిజిస్ట్రేషన్ మరియు ప్రాథమిక నిధుల వరకు.' },
  },
  'studying-abroad-journey': {
    hi: { title: 'बिना भ्रामक एजेंट के विदेश में पढ़ाई', subtitle: 'देश और कोर्स चयन, स्कॉलरशिप, SOP/LOR, आवेदन और वीज़ा तक पारदर्शी यात्रा।' },
    te: { title: 'మోసపూరిత ఏజెంట్లు లేకుండా విదేశీ విద్య', subtitle: 'దేశం ఎంపిక, స్కాలర్‌షిప్‌లు, SOP/LOR మరియు వీసా వరకు పారదర్శక ప్రయాణం.' },
  },
  'applying-for-scholarships': {
    hi: { title: 'छात्रवृत्ति और आर्थिक सहायता के लिए आवेदन', subtitle: 'दस्तावेज़ तैयारी, NSP पोर्टल, सत्यापन और हर वर्ष नवीनीकरण (Renewal) तक।' },
    te: { title: 'స్కాలర్‌షిప్‌లు & ఆర్థిక సహాయం కోసం దరఖాస్తు', subtitle: 'డాక్యుమెంట్ల సిద్ధత, NSP పోర్టల్ మరియు వార్షిక పునరుద్ధరణ వరకు.' },
  },
  'getting-first-job': {
    hi: { title: 'अपनी पहली नौकरी पाना (कैंपस और ऑफ़-कैंपस)', subtitle: 'रेज़्यूमे, पोर्टफ़ोलियो, इंटरव्यू अभ्यास और ऑफ़र लेटर मूल्यांकन तक।' },
    te: { title: 'మీ మొదటి ఉద్యోగం పొందడం (క్యాంపస్ & ఆఫ్-క్యాంపస్)', subtitle: 'రెజ్యూమే, పోర్ట్‌ఫోలియో, ఇంటర్వ్యూలు మరియు ఆఫర్ లెటర్ తనిఖీ వరకు.' },
  },
  'pursuing-higher-education': {
    hi: { title: 'भारत में उच्च शिक्षा (PG और ऑनर्स)', subtitle: 'GATE, CUET-PG, CAT, JAM और केंद्रीय/प्रमुख संस्थानों में प्रवेश की तैयारी।' },
    te: { title: 'భారతదేశంలో ఉన్నత విద్య (PG & ఆనర్స్)', subtitle: 'GATE, CUET-PG, CAT, JAM ద్వారా ప్రతిష్టాత్మక సంస్థలలో ప్రవేశం.' },
  },
  'entering-research-and-academia': {
    hi: { title: 'रिसर्च और अकादमिक क्षेत्र में प्रवेश', subtitle: 'UG रिसर्च, CSIR/UGC-NET JRF, PhD इंटरव्यू और फ़ैकल्टी/वैज्ञानिक करियर।' },
    te: { title: 'పరిశోధన & అకాడెమియా రంగంలోకి ప్రవేశం', subtitle: 'UG రీసెర్చ్, NET/JRF, PhD ప్రవేశాలు మరియు శాస్త్రవేత్త/ప్రొఫెసర్ మార్గం.' },
  },
};

export const STAGE_LABELS: Record<StudentStage, LocalizedPair> = {
  school: { hi: 'स्कूल (कक्षा 8–10)', te: 'పాఠశాల (8–10)' },
  'after-10': { hi: 'कक्षा 10 के बाद', te: '10వ తరగతి తర్వాత' },
  'class-11-12': { hi: 'कक्षा 11–12', te: '11–12వ తరగతి' },
  diploma: { hi: 'डिप्लोमा / पॉलिटेक्निक', te: 'డిప్లొమా / పాలిటెక్నిక్' },
  undergraduate: { hi: 'अंडरग्रेजुएट (UG)', te: 'అండర్ గ్రాడ్యుయేట్ (UG)' },
  postgraduate: { hi: 'पोस्टग्रेजुएट (PG)', te: 'పోస్ట్ గ్రాడ్యుయేట్ (PG)' },
  research: { hi: 'रिसर्च / PhD', te: 'పరిశోధన / PhD' },
  'graduate-jobseeker': { hi: 'ग्रेजुएट / नौकरी खोजने वाले', te: 'గ్రాడ్యుయేట్ / ఉద్యోగ అన్వేషకులు' },
  'early-career': { hi: 'शुरुआती करियर', te: 'ప్రారంభ కెరీర్' },
  entrepreneurship: { hi: 'स्टार्टअप और उद्यमिता', te: 'స్టార్టప్‌లు' },
  international: { hi: 'अंतर्राष्ट्रीय शिक्षा', te: 'అంతర్జాతీయ విద్య' },
};

export const TRACK_LABELS: Record<string, LocalizedPair> = {
  academic: { hi: 'शैक्षिक (Academic)', te: 'విద్యా (Academic)' },
  competitive: { hi: 'प्रतियोगी परीक्षा', te: 'పోటీ పరీక్షలు' },
  vocational: { hi: 'व्यावसायिक / कौशल', te: 'వృత్తి / నైపుణ్య' },
  research: { hi: 'रिसर्च (Research)', te: 'పరిశోధన (Research)' },
  career: { hi: 'करियर और नौकरी', te: 'కెరీర్ & ఉద్యోగం' },
  entrepreneurship: { hi: 'स्टार्टअप / व्यवसाय', te: 'స్టార్టప్ / వ్యాపారం' },
  international: { hi: 'अंतर्राष्ट्रीय (Global)', te: 'అంతర్జాతీయ (Global)' },
};

export const OPP_CATEGORY_LABELS: Record<OpportunityCategory, LocalizedPair> = {
  scholarship: { hi: 'छात्रवृत्तियाँ (Scholarships)', te: 'స్కాలర్‌షిప్‌లు' },
  internship: { hi: 'इंटर्नशिप (Internships)', te: 'ఇంటర్న్‌షిప్‌లు' },
  research: { hi: 'रिसर्च अवसर (Research)', te: 'పరిశోధన అవకాశాలు' },
  fellowship: { hi: 'फ़ेलोशिप (Fellowships)', te: 'ఫెలోషిప్‌లు' },
  hackathon: { hi: 'हैकाथॉन (Hackathons)', te: 'హ్యాకథాన్లు' },
  competition: { hi: 'प्रतियोगिताएँ', te: 'పోటీలు' },
  conference: { hi: 'सम्मेलन (Conferences)', te: 'సదస్సులు' },
  workshop: { hi: 'कार्यशालाएँ (Workshops)', te: 'వర్క్‌షాపులు' },
  exchange: { hi: 'एक्सचेंज प्रोग्राम', te: 'ఎక్స్ఛేంజ్ ప్రోగ్రామ్స్' },
  'entrance-exam': { hi: 'प्रवेश परीक्षाएँ', te: 'ప్రవేశ పరీక్షలు' },
  'government-recruitment': { hi: 'सरकारी भर्तियाँ', te: 'ప్రభుత్వ నియామకాలు' },
  'startup-programme': { hi: 'स्टार्टअप कार्यक्रम', te: 'స్టార్టప్ కార్యక్రమాలు' },
  volunteering: { hi: 'स्वयंसेवा (Volunteering)', te: 'వాలంటీరింగ్' },
  international: { hi: 'अंतर्राष्ट्रीय अवसर', te: 'అంతర్జాతీయ అవకాశాలు' },
};

export const ACHIEVEMENT_CATEGORY_LABELS: Record<AchievementRecord['category'], LocalizedPair> = {
  academic: { hi: 'शैक्षिक उपलब्धि', te: 'విద్యా మైలురాయి' },
  examination: { hi: 'प्रतियोगी परीक्षा', te: 'పోటీ పరీక్ష' },
  internship: { hi: 'इंटर्नशिप / अनुभव', te: 'ఇంటర్న్‌షిప్ / అనుభవం' },
  research: { hi: 'रिसर्च / पेपर / पेटेंट', te: 'పరిశోధన / పేపర్ / పేటెంట్' },
  scholarship: { hi: 'छात्रवृत्ति / फ़ेलोशिप', te: 'స్కాలర్‌షిప్ / ఫెలోషిప్' },
  certification: { hi: 'कौशल / सर्टिफ़िकेट', te: 'నైపుణ్యం / సర్టిఫికెట్' },
  competition: { hi: 'प्रतियोगिता / हैकाथॉन', te: 'పోటీ / హ్యాకథాన్' },
  startup: { hi: 'स्टार्टअप / प्रोजेक्ट', te: 'స్టార్టప్ / ప్రాజెక్ట్' },
  volunteering: { hi: 'नेतृत्व / स्वयंसेवा', te: 'నాయకత్వం / వాలంటీరింగ్' },
};

export const QUALIFICATION_GROUP_LABELS: Record<
  string,
  { en: string; hi: string; te: string; homeSubEn: string; homeSubHi: string; homeSubTe: string }
> = {
  'class-10': {
    en: 'After Class 10',
    hi: 'कक्षा 10 के बाद',
    te: '10వ తరగతి తర్వాత',
    homeSubEn: 'Streams, Polytechnic, ITI & NIOS',
    homeSubHi: 'स्ट्रीम, पॉलिटेक्निक डिप्लोमा, ITI और NIOS',
    homeSubTe: 'స్ట్రీమ్స్, పాలిటెక్నిక్, ITI & NIOS',
  },
  'class-12': {
    en: 'Class 11 & 12',
    hi: 'कक्षा 11 और 12',
    te: '11 & 12వ తరగతి',
    homeSubEn: 'Beyond JEE/NEET: Law, Design, Research & CUET',
    homeSubHi: 'JEE/NEET से आगे: Law, Design, रिसर्च और CUET',
    homeSubTe: 'JEE/NEET దాటి: లా, డిజైన్, రీసెర్చ్ & CUET',
  },
  diploma: {
    en: 'Diploma / Polytechnic',
    hi: 'डिप्लोमा / पॉलिटेक्निक',
    te: 'డిప్లొమా / పాలిటెక్నిక్',
    homeSubEn: 'Lateral Entry B.Tech, SSC/RRB JE & NATS',
    homeSubHi: 'लेटरल एंट्री B.Tech, SSC/RRB JE और NATS',
    homeSubTe: 'లాటరల్ ఎంట్రీ B.Tech, SSC/RRB JE & NATS',
  },
  undergraduate: {
    en: 'Undergraduate',
    hi: 'अंडरग्रेजुएट (UG)',
    te: 'అండర్ గ్రాడ్యుయేట్ (UG)',
    homeSubEn: 'Internships, GATE, Research, Startups & Jobs',
    homeSubHi: 'इंटर्नशिप, GATE, रिसर्च, स्टार्टअप और नौकरियाँ',
    homeSubTe: 'ఇంటర్న్‌షిప్‌లు, GATE, రీసెర్చ్, స్టార్టప్‌లు & ఉద్యోగాలు',
  },
  'postgraduate-research': {
    en: 'PG & Research',
    hi: 'पोस्टग्रेजुएट और रिसर्च',
    te: 'PG & పరిశోధన',
    homeSubEn: 'PhD, JRF, Publishing, Patents & R&D',
    homeSubHi: 'PhD, JRF, रिसर्च प्रकाशन, पेटेंट और R&D',
    homeSubTe: 'PhD, JRF, పబ్లిషింగ్, పేటెంట్లు & R&D',
  },
  'alternative-vocational': {
    en: 'Alternative & Vocational',
    hi: 'वैकल्पिक और करियर स्विच',
    te: 'ప్రత్యామ్నాయ & కెరీర్ మార్పు',
    homeSubEn: 'Online BS, Apprenticeships & Skills',
    homeSubHi: 'ऑनलाइन BS डिग्री, अप्रेंटिसशिप और कौशल-आधारित रास्ते',
    homeSubTe: 'ఆన్‌లైన్ BS, అప్రెంటిస్‌షిప్‌లు & నైపుణ్యాలు',
  },
};

export const CLASS_12_STREAM_TRANSLATIONS: Record<
  string,
  { en: { label: string; hint: string }; hi: { label: string; hint: string }; te: { label: string; hint: string } }
> = {
  'class-12-science': {
    en: { label: 'Science (PCM / PCB / PCMB)', hint: 'Engineering, Pure Sciences, Medicine, Design, Tech & Law' },
    hi: { label: 'विज्ञान (Science — PCM / PCB / PCMB)', hint: 'इंजीनियरिंग, प्योर साइंस (IISER), मेडिकल, डिज़ाइन, टेक और लॉ' },
    te: { label: 'సైన్స్ (PCM / PCB / PCMB)', hint: 'ఇంజనీరింగ్, ప్యూర్ సైన్స్, మెడిసిన్, డిజైన్, టెక్ & లా' },
  },
  'class-12-commerce': {
    en: { label: 'Commerce & Economics', hint: 'CA/CS/CMA, Economics, Finance, Management & Law' },
    hi: { label: 'वाणिज्य और अर्थशास्त्र (Commerce)', hint: 'CA/CS/CMA, अर्थशास्त्र, फ़ाइनेंस, मैनेजमेंट और लॉ' },
    te: { label: 'కామర్స్ & ఎకనామిక్స్', hint: 'CA/CS/CMA, ఎకనామిక్స్, ఫైనాన్స్, మేనేజ్‌మెంట్ & లా' },
  },
  'class-12-humanities': {
    en: { label: 'Humanities & Social Sciences', hint: 'Law, Public Policy, Liberal Arts, Design, Journalism & UPSC' },
    hi: { label: 'मानविकी और कला (Humanities & Arts)', hint: 'लॉ (CLAT), पब्लिक पॉलिसी, लिबरल आर्ट्स, डिज़ाइन, पत्रकारिता और UPSC' },
    te: { label: 'హ్యుమానిటీస్ & సోషల్ సైన్సెస్', hint: 'లా, పబ్లిక్ పాలసీ, లిబరల్ ఆర్ట్స్, డిజైన్, జర్నలిజం & UPSC' },
  },
};

export function getLanguageNativeName(lang: LanguageCode): string {
  if (lang === 'hi') return 'हिन्दी';
  if (lang === 'te') return 'తెలుగు';
  return 'English';
}

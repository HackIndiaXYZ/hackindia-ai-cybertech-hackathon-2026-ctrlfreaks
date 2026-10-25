from typing import List, Dict, Any, Optional
from ..models.schemas import HoneyShieldScenario, HoneyShieldOption, HoneyShieldEvaluateResponse

SCENARIOS: List[Dict[str, Any]] = [
    {
        "id": "scenario_kyc",
        "title_en": "Urgent Bank KYC Account Block",
        "title_hi": "बैंक केवाईसी खाता ब्लॉक चेतावनी",
        "category_en": "Banking & Financial Scam",
        "category_hi": "बैंकिंग एवं वित्तीय धोखाधड़ी",
        "sender": "VK-SBISEC (Spoofed SMS)",
        "message_en": "Dear Customer, Your SBI account will be permanently suspended within 2 hours due to pending KYC update. Click http://sbi-kyc-verify-portal.xyz/login immediately to update PAN and Aadhaar.",
        "message_hi": "प्रिय ग्राहक, आपका एसबीआई खाता 2 घंटे में स्थायी रूप से बंद कर दिया जाएगा क्योंकि आपकी केवाईसी अधूरी है। तुरंत http://sbi-kyc-verify-portal.xyz/login पर क्लिक करके पैन और आधार अपडेट करें।",
        "options_en": [
            {
                "id": "opt_a",
                "label": "Click the link and submit PAN/Aadhaar to prevent account closure.",
                "description": "Quickly resolve the issue so your account remains active."
            },
            {
                "id": "opt_b",
                "label": "Ignore the message and open the official YONO SBI app or visit branch.",
                "description": "Verify directly through official bank channels without clicking the SMS link."
            },
            {
                "id": "opt_c",
                "label": "Call the sender number or reply asking for more time.",
                "description": "Engage with the sender to clarify the urgency."
            }
        ],
        "options_hi": [
            {
                "id": "opt_a",
                "label": "खाता बंद होने से बचाने के लिए लिंक पर क्लिक करें और पैन/आधार विवरण भरें।",
                "description": "समस्या को जल्दी से हल करें ताकि आपका खाता चालू रहे।"
            },
            {
                "id": "opt_b",
                "label": "संदेश को अनदेखा करें और आधिकारिक योनो एसबीआई ऐप खोलें या शाखा जाएं।",
                "description": "एसएमएस लिंक पर क्लिक किए बिना आधिकारिक माध्यम से सीधे जांच करें।"
            },
            {
                "id": "opt_c",
                "label": "प्रेषक के नंबर पर कॉल करें या अधिक समय मांगने के लिए उत्तर दें।",
                "description": "तात्कालिकता स्पष्ट करने के लिए प्रेषक से बात करें।"
            }
        ],
        "tactics_en": ["Urgency & Time Pressure (2 hours)", "Fear of Account Loss", "False Bank Authority", "Deceptive Domain (.xyz)"],
        "tactics_hi": ["जल्दबाजी और समय का दबाव (2 घंटे)", "खाता बंद होने का डर", "फर्जी बैंक पहचान", "नकली डोमेन (.xyz)"],
        "evaluations": {
            "opt_a": {
                "is_safe": False,
                "outcome_type": "DANGEROUS",
                "feedback_en": "High Risk Choice! The link leads to a credential harvesting site that captures your net banking credentials and Aadhaar details.",
                "feedback_hi": "अत्यधिक जोखिम भरा कदम! यह लिंक एक फर्जी फ़िशिंग साइट पर ले जाता है जो आपका नेट बैंकिंग पासवर्ड और आधार विवरण चुरा लेती है।",
                "why_en": "Banks never send SMS with third-party unofficial links (.xyz) asking for immediate KYC update under threat of suspension.",
                "why_hi": "बैंक कभी भी निलंबन की धमकी देकर अनधिकृत लिंक (.xyz) के माध्यम से तत्काल केवाईसी की मांग नहीं करते।",
                "score_impact": -20
            },
            "opt_b": {
                "is_safe": True,
                "outcome_type": "SAFE",
                "feedback_en": "Excellent Cyber Resilience! You broke the manipulation cycle by checking through the official banking portal.",
                "feedback_hi": "शानदार साइबर सतर्कता! आपने अज्ञात लिंक पर क्लिक न करके सीधे आधिकारिक बैंक ऐप के माध्यम से जांच करने का सुरक्षित निर्णय लिया।",
                "why_en": "Always verify account status independently. Legitimate KYC requirements can always be completed in branch or official apps.",
                "why_hi": "हमेशा स्वतंत्र रूप से जांचें। वास्तविक केवाईसी प्रक्रिया आधिकारिक बैंक ऐप या शाखा से सुरक्षित रूप से पूरी होती है।",
                "score_impact": 25
            },
            "opt_c": {
                "is_safe": False,
                "outcome_type": "VULNERABLE",
                "feedback_en": "Vulnerable! Replying or calling the number provided connects you directly with the fraudster posing as an agent.",
                "feedback_hi": "जोखिम भरा! प्रेषक को कॉल करने से आप सीधे जालसाज से जुड़ जाते हैं जो बैंक कर्मचारी बनकर आपको बातों में फंसा लेता है।",
                "why_en": "Never use contact information provided inside a suspicious message. Scammers staff these numbers to sound authentic.",
                "why_hi": "संदिग्ध संदेश में दिए गए नंबर पर कभी संपर्क न करें। जालसाज अक्सर सहायता केंद्र बनकर बात करते हैं।",
                "score_impact": -10
            }
        },
        "safe_alternative_en": "Ignore suspicious SMS links. Verify KYC status inside your verified banking app or official branch.",
        "safe_alternative_hi": "संदिग्ध एसएमएस लिंक को अनदेखा करें। अपने सत्यापित बैंक ऐप या शाखा से सीधे स्थिति की पुष्टि करें।"
    },
    {
        "id": "scenario_electricity",
        "title_en": "Electricity Disconnection Threat",
        "title_hi": "बिजली कनेक्शन काटने की धमकी",
        "category_en": "Utility & Fear-Based Scam",
        "category_hi": "उपयोगिता सेवा व डर आधारित धोखा",
        "sender": "DISCOM Officer (Unknown Mobile)",
        "message_en": "Dear Consumer, your electricity power will be disconnected tonight at 9:30 PM because your previous month bill was not updated. Please contact our Electricity Officer immediately at 98765-XXXXX.",
        "message_hi": "प्रिय उपभोक्ता, आपकी बिजली आज रात 9:30 बजे काट दी जाएगी क्योंकि आपका पिछले महीने का बिल अपडेट नहीं हुआ है। तुरंत हमारे बिजली अधिकारी से 98765-XXXXX पर संपर्क करें।",
        "options_en": [
            {
                "id": "opt_a",
                "label": "Call the mobile number in the message and pay the bill as instructed.",
                "description": "Ensure your home power is not shut off tonight."
            },
            {
                "id": "opt_b",
                "label": "Check your official DISCOM consumer portal or electricity board receipts.",
                "description": "Independently check your payment history and customer account."
            },
            {
                "id": "opt_c",
                "label": "Download an app suggested by the officer to verify your smart meter.",
                "description": "Follow instructions to update meter reading software."
            }
        ],
        "options_hi": [
            {
                "id": "opt_a",
                "label": "संदेश में दिए गए मोबाइल नंबर पर कॉल करें और बताए अनुसार बिल का भुगतान करें।",
                "description": "सुनिश्चित करें कि आज रात आपके घर की बिजली न कटे।"
            },
            {
                "id": "opt_b",
                "label": "अपने आधिकारिक बिजली बोर्ड (DISCOM) पोर्टल या रसीद से स्थिति जांचें।",
                "description": "अपने भुगतान इतिहास और ग्राहक खाते की स्वतंत्र रूप से जांच करें।"
            },
            {
                "id": "opt_c",
                "label": "स्मार्ट मीटर सत्यापित करने के लिए अधिकारी द्वारा बताया गया ऐप डाउनलोड करें।",
                "description": "मीटर अपडेट सॉफ्टवेयर डाउनलोड करने के निर्देशों का पालन करें।"
            }
        ],
        "tactics_en": ["Fear of Immediate Disconnection", "Nighttime Urgency (9:30 PM)", "Personal Mobile Number as 'Official'"],
        "tactics_hi": ["बिजली कटने का तात्कालिक डर", "रात का समय बताकर दबाव (9:30 बजे)", "निजी मोबाइल नंबर को आधिकारिक बताना"],
        "evaluations": {
            "opt_a": {
                "is_safe": False,
                "outcome_type": "DANGEROUS",
                "feedback_en": "High Risk! The caller will ask you to transfer money or install a remote payment tool.",
                "feedback_hi": "भारी खतरा! कॉल पर जालसाज आपसे पैसे भेजने या स्क्रीन शेयरिंग ऐप डाउनलोड करने को कहेगा।",
                "why_en": "State electricity boards never disconnect power at night based on an SMS from an individual mobile number.",
                "why_hi": "बिजली बोर्ड कभी भी किसी निजी मोबाइल नंबर से एसएमएस भेजकर रात में अचानक बिजली नहीं काटते।",
                "score_impact": -20
            },
            "opt_b": {
                "is_safe": True,
                "outcome_type": "SAFE",
                "feedback_en": "Safe and Smart! Checking the official consumer portal protects you from utility extortion.",
                "feedback_hi": "सुरक्षित और समझदारी भरा कदम! आधिकारिक पोर्टल पर बिल की स्थिति जांचने से आप धोखाधड़ी से सुरक्षित रहे।",
                "why_en": "All official utility bills reflect on your official state discom website or bill receipt.",
                "why_hi": "सभी आधिकारिक बिजली बिल राज्य के डिस्कॉम पोर्टल या आधिकारिक रसीदों पर दिखाई देते हैं।",
                "score_impact": 25
            },
            "opt_c": {
                "is_safe": False,
                "outcome_type": "DANGEROUS",
                "feedback_en": "Extremely Dangerous! The requested app is a malicious APK or screen-sharing tool (AnyDesk/RustDesk).",
                "feedback_hi": "अत्यंत खतरनाक! यह ऐप कोई मैलवेयर या स्क्रीन-शेयरिंग ऐप (जैसे AnyDesk) होता है जो फोन का नियंत्रण चुरा लेता है।",
                "why_en": "Scammers use remote access apps to read your banking OTPs and steal funds invisibly.",
                "why_hi": "ठग रिमोट ऐप के जरिए आपकी स्क्रीन देखकर आपके बैंक खाते से पैसे उड़ा लेते हैं।",
                "score_impact": -25
            }
        },
        "safe_alternative_en": "Check your actual electricity bill on the official state DISCOM portal or app.",
        "safe_alternative_hi": "अपने राज्य के आधिकारिक बिजली बोर्ड पोर्टल या ऐप पर अपने वास्तविक बिल की स्थिति देखें।"
    },
    {
        "id": "scenario_police",
        "title_en": "Digital Arrest & Fake Police Authority",
        "title_hi": "डिजिटल अरेस्ट और फर्जी पुलिस कॉल",
        "category_en": "High-Pressure Impersonation (Extortion)",
        "category_hi": "अत्यधिक दबाव वाली जबरन वसूली",
        "sender": "Cyber Crime Head Office (Video Call)",
        "message_en": "A person in a police uniform calls stating: 'A courier containing contraband was seized in your name. You are under Digital Arrest. Do not disconnect the video call, do not inform family, and transfer funds to the RBI verification escrow account immediately.'",
        "message_hi": "पुलिस वर्दी पहने एक व्यक्ति वीडियो कॉल पर कहता है: 'आपके नाम से एक पार्सल में अवैध सामान पकड़ा गया है। आप डिजिटल अरेस्ट के तहत हैं। वीडियो कॉल डिस्कनेक्ट न करें, परिवार को न बताएं और आरबीआई सत्यापन खाते में तुरंत फंड ट्रांसफर करें।'",
        "options_en": [
            {
                "id": "opt_a",
                "label": "Panic, stay on call, and wire money to the verification escrow account.",
                "description": "Comply with the legal orders to clear your name."
            },
            {
                "id": "opt_b",
                "label": "Recognize that 'Digital Arrest' is fake, disconnect immediately, and dial 1930.",
                "description": "Reject the coercive authority and report to legitimate cybercrime police."
            },
            {
                "id": "opt_c",
                "label": "Argue with the caller and beg for mercy on the video call.",
                "description": "Try to persuade them you are innocent while remaining on video."
            }
        ],
        "options_hi": [
            {
                "id": "opt_a",
                "label": "घबराएं, कॉल पर बने रहें और नाम साफ करने के लिए सत्यापन खाते में पैसे ट्रांसफर करें।",
                "description": "कानूनी परेशानी से बचने के लिए आदेश का पालन करें।"
            },
            {
                "id": "opt_b",
                "label": "पहचानें कि 'डिजिटल अरेस्ट' कानून में होता ही नहीं, तुरंत कॉल काटें और 1930 पर कॉल करें।",
                "description": "दबाव को नकारें और वास्तविक साइबर हेल्पलाइन पर रिपोर्ट करें।"
            },
            {
                "id": "opt_c",
                "label": "कॉलर से बहस करें और वीडियो कॉल पर अपनी बेगुनाही की गुहार लगाएं।",
                "description": "कॉल पर रहकर उन्हें समझाने का प्रयास करें।"
            }
        ],
        "tactics_en": ["Fake Police Uniform & Authority", "Extreme Fear of Imprisonment", "Isolation & Secrecy ('Do not tell anyone')", "Fake Legal Term ('Digital Arrest')"],
        "tactics_hi": ["फर्जी पुलिस वर्दी और अधिकार", "जेल जाने का अत्यधिक डर", "अलगाव और गोपनीयता ('किसी को मत बताना')", "काल्पनिक कानूनी शब्द ('डिजिटल अरेस्ट')"],
        "evaluations": {
            "opt_a": {
                "is_safe": False,
                "outcome_type": "DANGEROUS",
                "feedback_en": "Disastrous! You would transfer your life savings to a scammer syndicate.",
                "feedback_hi": "अत्यंत विनाशकारी! आप अपनी गाढ़ी कमाई साइबर अपराधियों के फर्जी खाते में भेज देंगे।",
                "why_en": "No police officer, court, or enforcement agency ever conducts 'Digital Arrest' or requests money transfers.",
                "why_hi": "भारतीय कानून में 'डिजिटल अरेस्ट' नाम की कोई व्यवस्था नहीं है। पुलिस कभी वीडियो कॉल पर पैसे नहीं मांगती।",
                "score_impact": -30
            },
            "opt_b": {
                "is_safe": True,
                "outcome_type": "SAFE",
                "feedback_en": "Superb Defense! You recognized the #1 extortion scam in India.",
                "feedback_hi": "उत्कृष्ट साइबर सुरक्षा! आपने भारत के सबसे कुख्यात 'डिजिटल अरेस्ट' षड्यंत्र को तुरंत पहचान लिया।",
                "why_en": "The Indian Government has clarified that no police or law enforcement agency uses video calls to arrest citizens or demand funds.",
                "why_hi": "भारत सरकार और पुलिस ने स्पष्ट किया है कि वीडियो कॉल पर न तो गिरफ्तारी होती है और न ही पैसे मांगे जाते हैं।",
                "score_impact": 30
            },
            "opt_c": {
                "is_safe": False,
                "outcome_type": "VULNERABLE",
                "feedback_en": "Vulnerable! Remaining on the call gives psychological manipulators more time to exploit your fear.",
                "feedback_hi": "कमजोर स्थिति! कॉल पर बने रहने से ठगों को आपकी घबराहट का फायदा उठाने और ब्लैकमेल करने का मौका मिलता है।",
                "why_en": "Never negotiate with cyber extortionists. Disconnect immediately.",
                "why_hi": "साइबर ठगों से कभी बातचीत न बढ़ाएं। तुरंत कॉल काटें और परिजनों को सूचित करें।",
                "score_impact": -15
            }
        },
        "safe_alternative_en": "Hang up immediately. Police never arrest citizens over Skype/WhatsApp or demand money transfers.",
        "safe_alternative_hi": "तुरंत कॉल काटें। पुलिस कभी व्हाट्सएप या वीडियो कॉल पर गिरफ्तारी नहीं करती और न ही पैसे मांगती है।"
    },
    {
        "id": "scenario_lottery",
        "title_en": "Unexpected Lucky Draw & Upfront Fee",
        "title_hi": "अचानक लॉटरी जीत और अग्रिम शुल्क",
        "category_en": "Greed & Reward Enticement",
        "category_hi": "इनाम और लालच आधारित धोखा",
        "sender": "KBC Lucky Draw Management",
        "message_en": "Congratulations! Your mobile number won 25 Lakhs in the WhatsApp Special Lucky Draw! To claim your cash prize directly in your bank account, transfer Rs 2,500 government registration fee to Account 91823XXXXX.",
        "message_hi": "बधाई हो! आपके मोबाइल नंबर ने व्हाट्सएप स्पेशल लकी ड्रा में ₹25 लाख जीते हैं! पुरस्कार राशि सीधे अपने बैंक खाते में प्राप्त करने के लिए खाता 91823XXXXX में ₹2,500 सरकारी पंजीकरण शुल्क जमा करें।",
        "options_en": [
            {
                "id": "opt_a",
                "label": "Pay Rs 2,500 since Rs 25 Lakhs is a huge reward worth the small risk.",
                "description": "Take a chance on the prize."
            },
            {
                "id": "opt_b",
                "label": "Recognize that genuine lotteries never ask for upfront transfer fees.",
                "description": "Block the sender and report the scam message."
            },
            {
                "id": "opt_c",
                "label": "Ask the sender to deduct Rs 2,500 from the 25 Lakh prize and send the rest.",
                "description": "Test the legitimacy by bargaining."
            }
        ],
        "options_hi": [
            {
                "id": "opt_a",
                "label": "₹2,500 भेजें क्योंकि ₹25 लाख के इनाम के सामने यह छोटा जोखिम है।",
                "description": "इनाम पाने के लिए मौका लें।"
            },
            {
                "id": "opt_b",
                "label": "पहचानें कि वास्तविक लॉटरी में कभी अग्रिम शुल्क नहीं मांगा जाता।",
                "description": "संदेश को ब्लॉक करें और रिपोर्ट करें।"
            },
            {
                "id": "opt_c",
                "label": "प्रेषक से कहें कि ₹25 लाख में से ₹2,500 काटकर बाकी पैसे भेज दे।",
                "description": "मोलभाव करके प्रेषक की सच्चाई परखने की कोशिश करें।"
            }
        ],
        "tactics_en": ["Enticement of Huge Wealth (25 Lakhs)", "Small Upfront Fee Trap", "Misuse of Popular Brand (KBC)"],
        "tactics_hi": ["विशाल धन का लालच (₹25 लाख)", "छोटा अग्रिम शुल्क का जाल", "प्रसिद्ध नाम का दुरुपयोग (KBC)"],
        "evaluations": {
            "opt_a": {
                "is_safe": False,
                "outcome_type": "DANGEROUS",
                "feedback_en": "Loss of money! Once you send Rs 2,500, they will demand Rs 15,000 for GST, then customs fees, until you run out of money.",
                "feedback_hi": "पैसों का नुकसान! एक बार ₹2,500 भेजने के बाद वे जीएसटी या टैक्स के नाम पर और पैसे मांगते रहेंगे।",
                "why_en": "There is no lottery. You cannot win a contest or lottery you never bought tickets for.",
                "why_hi": "कोई लॉटरी नहीं है। जिस प्रतियोगिता में आपने भाग ही नहीं लिया, आप उसे जीत नहीं सकते।",
                "score_impact": -20
            },
            "opt_b": {
                "is_safe": True,
                "outcome_type": "SAFE",
                "feedback_en": "Perfect! You applied the Golden Rule of Cyber Safety.",
                "feedback_hi": "एकदम सही! आपने साइबर सुरक्षा के बुनियादी नियम का पालन किया।",
                "why_en": "Genuine prizes or contests never require winning participants to send money upfront to personal accounts.",
                "why_hi": "वास्तविक संस्थाएं कभी पुरस्कार देने के बदले व्यक्तिगत खाते में अग्रिम पैसे जमा करने को नहीं कहतीं।",
                "score_impact": 25
            },
            "opt_c": {
                "is_safe": False,
                "outcome_type": "VULNERABLE",
                "feedback_en": "Ineffective! Scammers will invent official excuses (like tax rules) to insist on an upfront transfer.",
                "feedback_hi": "असरदार नहीं! ठग टैक्स नियमों का बहाना बनाकर आपको फिर भी पैसे भेजने के लिए मजबूर करेंगे।",
                "why_en": "Engaging in conversation encourages fraudsters to refine their social engineering script.",
                "why_hi": "बातचीत जारी रखने से जालसाजों को आपके साथ छल करने के नए अवसर मिल जाते हैं।",
                "score_impact": -5
            }
        },
        "safe_alternative_en": "Never send money to claim prizes. Block the sender immediately.",
        "safe_alternative_hi": "इनाम पाने के लिए कभी पैसे न भेजें। संदेश भेजने वाले को तुरंत ब्लॉक करें।"
    },
    {
        "id": "scenario_job",
        "title_en": "Part-Time Work-From-Home Task Scam",
        "title_hi": "वर्क-फ्रॉम-होम पार्ट-टाइम जॉब घोटाला",
        "category_en": "Employment & Investment Fraud",
        "category_hi": "रोजगार एवं निवेश धोखाधड़ी",
        "sender": "Global Media HR via Telegram",
        "message_en": "Earn Rs 3,000 to Rs 8,000 daily by simply liking YouTube videos and rating hotels on Google Maps! Join our Telegram VIP task group. To unlock premium level payout, deposit Rs 5,000 refundable security deposit.",
        "message_hi": "घर बैठे यूट्यूब वीडियो लाइक करके और गूगल मैप पर रेटिंग देकर रोज ₹3,000 से ₹8,000 कमाएं! हमारे टेलीग्राम वीआईपी ग्रुप से जुड़ें। प्रीमियम कार्य अनलॉक करने के लिए ₹5,000 रिफंडेबल सुरक्षा राशि जमा करें।",
        "options_en": [
            {
                "id": "opt_a",
                "label": "Pay the Rs 5,000 deposit to start earning daily high income.",
                "description": "Invest a small amount to secure a high-paying online gig."
            },
            {
                "id": "opt_b",
                "label": "Recognize this as a classic 'Task Scam' and leave the group immediately.",
                "description": "Never pay money to get a job."
            },
            {
                "id": "opt_c",
                "label": "Do the free likes for Rs 150 payout, then invest large amounts when trusted.",
                "description": "Play along to extract the initial bait payment."
            }
        ],
        "options_hi": [
            {
                "id": "opt_a",
                "label": "दैनिक मोटी कमाई शुरू करने के लिए ₹5,000 जमा करें।",
                "description": "ऑनलाइन काम पाने के लिए छोटी राशि का निवेश करें।"
            },
            {
                "id": "opt_b",
                "label": "पहचानें कि यह 'टास्क स्कैम' है और तुरंत ग्रुप छोड़ दें।",
                "description": "नौकरी पाने के लिए कभी पैसे न दें।"
            },
            {
                "id": "opt_c",
                "label": "शुरुआती ₹150 पाने के लिए फ्री लाइक करें, फिर भरोसा होने पर पैसे लगाएं।",
                "description": "शुरुआती लालच का फायदा उठाने की कोशिश करें।"
            }
        ],
        "tactics_en": ["Unrealistic Easy Money (Rs 8,000/day)", "Upfront Security Deposit Trap", "Telegram Anonymous Channels"],
        "tactics_hi": ["अवास्तविक आसान कमाई (₹8,000/दिन)", "अग्रिम सुरक्षा राशि का जाल", "टेलीग्राम अज्ञात चैनल"],
        "evaluations": {
            "opt_a": {
                "is_safe": False,
                "outcome_type": "DANGEROUS",
                "feedback_en": "Major Financial Loss! This is the notorious 'Task Scam'. Your deposit will never be returned.",
                "feedback_hi": "बड़ा आर्थिक नुकसान! यह कुख्यात 'टास्क स्कैम' है। आपकी जमा राशि कभी वापस नहीं मिलेगी।",
                "why_en": "Legitimate employers never demand payment or deposits from employees to perform work.",
                "why_hi": "वास्तविक कंपनियां कभी भी काम देने के बदले कर्मचारियों से पैसे या डिपॉजिट नहीं मांगतीं।",
                "score_impact": -25
            },
            "opt_b": {
                "is_safe": True,
                "outcome_type": "SAFE",
                "feedback_en": "Sharp Intuition! Paying money to get a job is the classic red flag of employment scams.",
                "feedback_hi": "सटीक समझदारी! नौकरी के लिए पैसे मांगना रोजगार घोटालों का सबसे बड़ा संकेत है।",
                "why_en": "Genuine recruitment does not happen over unsolicited Telegram or WhatsApp groups demanding deposits.",
                "why_hi": "वास्तविक नौकरियां अज्ञात टेलीग्राम ग्रुप में डिपॉजिट की मांग के जरिए नहीं दी जातीं।",
                "score_impact": 25
            },
            "opt_c": {
                "is_safe": False,
                "outcome_type": "VULNERABLE",
                "feedback_en": "Dangerous Trap! The initial Rs 150 is intentional bait designed to build psychological trust before demanding Lakhs.",
                "feedback_hi": "खतरनाक जाल! शुरुआती ₹150 केवल आपका विश्वास जीतने का चारा होता है ताकि बाद में आपसे लाखों रुपये ऐंठे जा सकें।",
                "why_en": "Scammers knowingly pay small amounts initially so victims invest life savings into fake crypto wallets.",
                "why_hi": "अपराधी जानबूझकर शुरू में थोड़ा पैसा देते हैं ताकि पीड़ित भारी रकम लगा दे।",
                "score_impact": -15
            }
        },
        "safe_alternative_en": "Legitimate jobs pay you; you never pay them. Avoid Telegram work tasks.",
        "safe_alternative_hi": "वास्तविक नौकरी में आपको वेतन मिलता है, आपसे पैसे नहीं लिए जाते। टेलीग्राम टास्क से बचें।"
    },
    {
        "id": "scenario_apk",
        "title_en": "Courier Delivery Failure & Malicious APK",
        "title_hi": "कूरियर डिलीवरी विफलता और फर्जी APK ऐप",
        "category_en": "Technical Deception & Malware",
        "category_hi": "तकनीकी छल और मैलवेयर ऐप",
        "sender": "SpeedPost Delivery Support",
        "message_en": "Your parcel address is incomplete and delivery is on hold. Download and install 'IndiaPost_AddressUpdate.apk' from this link to rectify your address and pay Rs 5 re-delivery charge.",
        "message_hi": "आपका पार्सल पता अधूरा है और डिलीवरी रोक दी गई है। अपना पता सुधारने और ₹5 पुन: डिलीवरी शुल्क देने के लिए इस लिंक से 'IndiaPost_AddressUpdate.apk' डाउनलोड और इंस्टॉल करें।",
        "options_en": [
            {
                "id": "opt_a",
                "label": "Download and install the APK file to ensure your package arrives.",
                "description": "It is only a Rs 5 charge and needed for delivery."
            },
            {
                "id": "opt_b",
                "label": "Never install unknown APKs from SMS. Check parcel tracking on indiapost.gov.in.",
                "description": "Inspect your tracking number directly on the official postal portal."
            },
            {
                "id": "opt_c",
                "label": "Forward the APK file to friends to ask if it looks safe.",
                "description": "Share the file with family for opinion."
            }
        ],
        "options_hi": [
            {
                "id": "opt_a",
                "label": "पार्सल प्राप्त करने के लिए एपीके फ़ाइल डाउनलोड और इंस्टॉल करें।",
                "description": "यह केवल ₹5 का शुल्क है और डिलीवरी के लिए जरूरी लगता है।"
            },
            {
                "id": "opt_b",
                "label": "एसएमएस से कभी एपीके इंस्टॉल न करें। indiapost.gov.in पर ट्रैकिंग देखें।",
                "description": "सीधे आधिकारिक डाक विभाग की वेबसाइट पर ट्रैकिंग नंबर जांचें।"
            },
            {
                "id": "opt_c",
                "label": "एपीके फ़ाइल को दोस्तों को फॉरवर्ड करके पूछें कि क्या यह सुरक्षित है।",
                "description": "राय जानने के लिए फ़ाइल को दूसरों के साथ साझा करें।"
            }
        ],
        "tactics_en": ["Direct .APK File Installation", "Trivial Charge (Rs 5) as Cover for Screen Takeover", "Impersonating India Post / Courier"],
        "tactics_hi": ["सीधी .APK फ़ाइल इंस्टॉलेशन", "मामूली ₹5 शुल्क की आड़ में डेटा चोरी", "भारतीय डाक / कूरियर का फर्जी रूप"],
        "evaluations": {
            "opt_a": {
                "is_safe": False,
                "outcome_type": "DANGEROUS",
                "feedback_en": "Catastrophic! The APK is a banking Trojan that forwards your incoming OTPs to the scammer and steals your money.",
                "feedback_hi": "गंभीर खतरा! यह एपीके एक बैंकिंग ट्रोजन वायरस है जो आपके सभी बैंक ओटीपी चुराकर ठगों को भेज देता है।",
                "why_en": "Legitimate couriers never distribute Android APK packages outside Google Play Store.",
                "why_hi": "वास्तविक कूरियर कंपनियां कभी भी ऐप स्टोर के बाहर व्हाट्सएप या एसएमएस से एपीके फाइलें नहीं भेजतीं।",
                "score_impact": -30
            },
            "opt_b": {
                "is_safe": True,
                "outcome_type": "SAFE",
                "feedback_en": "First-Class Defense! You blocked the dangerous vector of side-loaded mobile malware.",
                "feedback_hi": "सर्वश्रेष्ठ सुरक्षा! आपने संदिग्ध मोबाइल मैलवेयर के घातक हमले को नाकाम कर दिया।",
                "why_en": "Only install applications from verified official app stores. Check delivery status on indiapost.gov.in.",
                "why_hi": "ऐप्स केवल गूगल प्ले स्टोर या एप्पल ऐप स्टोर से ही डाउनलोड करें। डाक स्थिति आधिकारिक पोर्टल पर देखें।",
                "score_impact": 25
            },
            "opt_c": {
                "is_safe": False,
                "outcome_type": "RISKY",
                "feedback_en": "Risky! Forwarding malicious APKs risks infecting the devices of your friends or relatives.",
                "feedback_hi": "जोखिम भरा! मैलवेयर फ़ाइलों को दूसरों को भेजने से उनके फोन भी संक्रमित हो सकते हैं।",
                "why_en": "Do not propagate dangerous files. Delete and warn others instead.",
                "why_hi": "खतरनाक फाइलों को आगे न बढ़ाएं। उन्हें तुरंत डिलीट करें।",
                "score_impact": -10
            }
        },
        "safe_alternative_en": "Never install .apk files received in text messages. Track packages on official websites.",
        "safe_alternative_hi": "टेक्स्ट मैसेज में आई किसी भी .apk फ़ाइल को कभी इंस्टॉल न करें। केवल आधिकारिक वेबसाइट से ट्रैक करें।"
    }
]

def get_scenarios(language: str = "en") -> List[HoneyShieldScenario]:
    result = []
    for s in SCENARIOS:
        is_hi = language == "hi"
        options_data = s["options_hi"] if is_hi else s["options_en"]
        opts = [HoneyShieldOption(id=o["id"], label=o["label"], description=o["description"]) for o in options_data]
        
        result.append(HoneyShieldScenario(
            id=s["id"],
            title=s["title_hi"] if is_hi else s["title_en"],
            category=s["category_hi"] if is_hi else s["category_en"],
            sender=s["sender"],
            message=s["message_hi"] if is_hi else s["message_en"],
            options=opts,
            manipulation_tactics=s["tactics_hi"] if is_hi else s["tactics_en"],
            safe_alternative=s["safe_alternative_hi"] if is_hi else s["safe_alternative_en"],
            educational_summary=s["safe_alternative_hi"] if is_hi else s["safe_alternative_en"]
        ))
    return result

def evaluate_scenario_choice(scenario_id: str, option_id: str, language: str = "en") -> HoneyShieldEvaluateResponse:
    scenario = next((s for s in SCENARIOS if s["id"] == scenario_id), None)
    if not scenario:
        return HoneyShieldEvaluateResponse(
            scenario_id=scenario_id,
            selected_option_id=option_id,
            is_safe=False,
            outcome_type="UNKNOWN",
            feedback_title="Scenario Not Found",
            feedback="Scenario was not found in simulation database.",
            why_risky_or_safe="Unknown scenario",
            tactics_exposed=[],
            safer_response="",
            score_impact=0
        )

    eval_data = scenario["evaluations"].get(option_id)
    if not eval_data:
        return HoneyShieldEvaluateResponse(
            scenario_id=scenario_id,
            selected_option_id=option_id,
            is_safe=False,
            outcome_type="UNKNOWN",
            feedback_title="Invalid Option",
            feedback="The option selected is invalid.",
            why_risky_or_safe="",
            tactics_exposed=[],
            safer_response="",
            score_impact=0
        )

    is_hi = language == "hi"
    is_safe = eval_data["is_safe"]
    outcome_type = eval_data["outcome_type"]
    
    if is_hi:
        feedback_title = "सुरक्षित विकल्प! (Safe Choice)" if is_safe else "चेतावनी! जोखिम भरा विकल्प (Dangerous Step)"
        feedback = eval_data["feedback_hi"]
        why = eval_data["why_hi"]
        tactics = scenario["tactics_hi"]
        safer_resp = scenario["safe_alternative_hi"]
    else:
        feedback_title = "Safe Choice! Excellent Reaction" if is_safe else "Warning! Dangerous Step"
        feedback = eval_data["feedback_en"]
        why = eval_data["why_en"]
        tactics = scenario["tactics_en"]
        safer_resp = scenario["safe_alternative_en"]

    return HoneyShieldEvaluateResponse(
        scenario_id=scenario_id,
        selected_option_id=option_id,
        is_safe=is_safe,
        outcome_type=outcome_type,
        feedback_title=feedback_title,
        feedback=feedback,
        why_risky_or_safe=why,
        tactics_exposed=tactics,
        safer_response=safer_resp,
        score_impact=eval_data["score_impact"]
    )

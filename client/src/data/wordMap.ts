// Centralized vocabulary data for Word Map
// Structure: Level > Grade/Topic > Theme/Unit > Words

export interface Word {
  word: string;
  turkish: string;
}

export interface Theme {
  id: string;
  name: string;
  nameTr: string;
  notes: string; // Grammar topics, themes, etc.
  words: Word[];
}

export interface Grade {
  id: string;
  name: string;
  nameTr: string;
  themes: Theme[];
}

export interface Level {
  id: string;
  name: string;
  nameTr: string;
  emoji: string;
  grades: Grade[];
}

export const wordMapData: Level[] = [
  {
    id: "preschool",
    name: "Pre-School",
    nameTr: "Okul Öncesi",
    emoji: "🌈",
    grades: [
      {
        id: "preschool-topics",
        name: "Topics",
        nameTr: "Konular",
        themes: [
          {
            id: "0.0-alphabet",
            name: "Alphabet",
            nameTr: "Alfabe",
            notes: "",
            words: [
              { word: "A", turkish: "A" },
              { word: "B", turkish: "B" },
              { word: "C", turkish: "C" },
              { word: "D", turkish: "D" },
              { word: "E", turkish: "E" },
              { word: "F", turkish: "F" },
              { word: "G", turkish: "G" },
              { word: "H", turkish: "H" },
              { word: "I", turkish: "I" },
              { word: "J", turkish: "J" },
              { word: "K", turkish: "K" },
              { word: "L", turkish: "L" },
              { word: "M", turkish: "M" },
              { word: "N", turkish: "N" },
              { word: "O", turkish: "O" },
              { word: "P", turkish: "P" },
              { word: "Q", turkish: "Q" },
              { word: "R", turkish: "R" },
              { word: "S", turkish: "S" },
              { word: "T", turkish: "T" },
              { word: "U", turkish: "U" },
              { word: "V", turkish: "V" },
              { word: "W", turkish: "W" },
              { word: "X", turkish: "X" },
              { word: "Y", turkish: "Y" },
              { word: "Z", turkish: "Z" },
            ],
          },
          {
            id: "0.1-numbers",
            name: "Numbers",
            nameTr: "Sayılar",
            notes: "",
            words: [
              { word: "one", turkish: "bir" },
              { word: "two", turkish: "iki" },
              { word: "three", turkish: "üç" },
              { word: "four", turkish: "dört" },
              { word: "five", turkish: "beş" },
              { word: "six", turkish: "altı" },
              { word: "seven", turkish: "yedi" },
              { word: "eight", turkish: "sekiz" },
              { word: "nine", turkish: "dokuz" },
              { word: "ten", turkish: "on" },
            ],
          },
          {
            id: "0.2-colours",
            name: "Colours",
            nameTr: "Renkler",
            notes: "",
            words: [
              { word: "red", turkish: "kırmızı" },
              { word: "blue", turkish: "mavi" },
              { word: "yellow", turkish: "sarı" },
              { word: "green", turkish: "yeşil" },
              { word: "orange", turkish: "turuncu" },
              { word: "purple", turkish: "mor" },
              { word: "pink", turkish: "pembe" },
              { word: "brown", turkish: "kahverengi" },
              { word: "gray", turkish: "gri" },
              { word: "white", turkish: "beyaz" },
              { word: "black", turkish: "siyah" },
            ],
          },
          {
            id: "0.3-greetings",
            name: "Greetings",
            nameTr: "Selamlaşma",
            notes: "",
            words: [
              { word: "hello", turkish: "merhaba" },
              { word: "hi", turkish: "selam" },
              { word: "good morning", turkish: "günaydın" },
              { word: "good afternoon", turkish: "iyi günler" },
              { word: "good evening", turkish: "iyi akşamlar" },
              { word: "good night", turkish: "iyi geceler" },
              { word: "goodbye", turkish: "hoşça kal" },
              { word: "bye", turkish: "görüşürüz" },
              { word: "see you", turkish: "görüşürüz" },
              { word: "how are you", turkish: "nasılsın" },
              { word: "I am fine", turkish: "iyiyim" },
              { word: "thank you", turkish: "teşekkür ederim" },
              { word: "please", turkish: "lütfen" },
              { word: "sorry", turkish: "özür dilerim" },
              { word: "yes", turkish: "evet" },
              { word: "no", turkish: "hayır" },
            ],
          },
          {
            id: "0.4-actions",
            name: "Actions",
            nameTr: "Eylemler",
            notes: "",
            words: [
              { word: "run", turkish: "koşmak" },
              { word: "walk", turkish: "yürümek" },
              { word: "jump", turkish: "zıplamak" },
              { word: "sit", turkish: "oturmak" },
              { word: "stand", turkish: "ayakta durmak" },
              { word: "eat", turkish: "yemek" },
              { word: "drink", turkish: "içmek" },
              { word: "sleep", turkish: "uyumak" },
              { word: "read", turkish: "okumak" },
              { word: "write", turkish: "yazmak" },
              { word: "draw", turkish: "çizmek" },
              { word: "play", turkish: "oynamak" },
              { word: "sing", turkish: "şarkı söylemek" },
              { word: "dance", turkish: "dans etmek" },
              { word: "clap", turkish: "alkışlamak" },
            ],
          },
          {
            id: "0.5-ourbody",
            name: "Our Body",
            nameTr: "Vücudumuz",
            notes: "",
            words: [
              { word: "head", turkish: "baş" },
              { word: "hair", turkish: "saç" },
              { word: "face", turkish: "yüz" },
              { word: "eye", turkish: "göz" },
              { word: "ear", turkish: "kulak" },
              { word: "nose", turkish: "burun" },
              { word: "mouth", turkish: "ağız" },
              { word: "teeth", turkish: "dişler" },
              { word: "arm", turkish: "kol" },
              { word: "hand", turkish: "el" },
              { word: "finger", turkish: "parmak" },
              { word: "leg", turkish: "bacak" },
              { word: "foot", turkish: "ayak" },
              { word: "toe", turkish: "ayak parmağı" },
              { word: "body", turkish: "vücut" },
            ],
          },
          {
            id: "0.6-ourclassroom",
            name: "Our Classroom",
            nameTr: "Sınıfımız",
            notes: "",
            words: [
              { word: "classroom", turkish: "sınıf" },
              { word: "teacher", turkish: "öğretmen" },
              { word: "student", turkish: "öğrenci" },
              { word: "desk", turkish: "sıra" },
              { word: "chair", turkish: "sandalye" },
              { word: "board", turkish: "tahta" },
              { word: "book", turkish: "kitap" },
              { word: "pencil", turkish: "kalem" },
              { word: "pen", turkish: "tükenmez kalem" },
              { word: "eraser", turkish: "silgi" },
              { word: "ruler", turkish: "cetvel" },
              { word: "bag", turkish: "çanta" },
              { word: "notebook", turkish: "defter" },
              { word: "crayon", turkish: "pastel boya" },
              { word: "scissors", turkish: "makas" },
            ],
          },
          {
            id: "0.7-things",
            name: "Things",
            nameTr: "Eşyalar",
            notes: "",
            words: [
              { word: "ball", turkish: "top" },
              { word: "doll", turkish: "oyuncak bebek" },
              { word: "car", turkish: "araba" },
              { word: "teddy bear", turkish: "oyuncak ayı" },
              { word: "kite", turkish: "uçurtma" },
              { word: "bicycle", turkish: "bisiklet" },
              { word: "balloon", turkish: "balon" },
              { word: "puzzle", turkish: "yapboz" },
              { word: "blocks", turkish: "bloklar" },
              { word: "robot", turkish: "robot" },
            ],
          },
          {
            id: "0.8-people",
            name: "People",
            nameTr: "İnsanlar",
            notes: "",
            words: [
              { word: "mother", turkish: "anne" },
              { word: "father", turkish: "baba" },
              { word: "sister", turkish: "kız kardeş" },
              { word: "brother", turkish: "erkek kardeş" },
              { word: "grandmother", turkish: "büyükanne" },
              { word: "grandfather", turkish: "büyükbaba" },
              { word: "baby", turkish: "bebek" },
              { word: "friend", turkish: "arkadaş" },
              { word: "boy", turkish: "erkek çocuk" },
              { word: "girl", turkish: "kız çocuk" },
            ],
          },
          {
            id: "0.9-animals",
            name: "Animals",
            nameTr: "Hayvanlar",
            notes: "",
            words: [
              { word: "cat", turkish: "kedi" },
              { word: "dog", turkish: "köpek" },
              { word: "bear", turkish: "ayı" },
              { word: "frog", turkish: "kurbağa" },
              { word: "elephant", turkish: "fil" },
              { word: "whale", turkish: "balina" },
              { word: "flamingo", turkish: "flamingo" },
              { word: "rabbit", turkish: "tavşan" },
              { word: "monkey", turkish: "maymun" },
              { word: "sheep", turkish: "koyun" },
              { word: "horse", turkish: "at" },
              { word: "cow", turkish: "inek" },
              { word: "lion", turkish: "aslan" },
              { word: "mouse", turkish: "fare" },
              { word: "chicken", turkish: "tavuk" },
            ],
          },
          {
            id: "0.10-aroundus",
            name: "Around Us",
            nameTr: "Çevremizdekiler",
            notes: "",
            words: [
              { word: "house", turkish: "ev" },
              { word: "tree", turkish: "ağaç" },
              { word: "flower", turkish: "çiçek" },
              { word: "sun", turkish: "güneş" },
              { word: "moon", turkish: "ay" },
              { word: "star", turkish: "yıldız" },
              { word: "cloud", turkish: "bulut" },
              { word: "rain", turkish: "yağmur" },
              { word: "sky", turkish: "gökyüzü" },
              { word: "grass", turkish: "çimen" },
              { word: "water", turkish: "su" },
              { word: "mountain", turkish: "dağ" },
            ],
          },
          {
            id: "0.11-food",
            name: "Food",
            nameTr: "Yiyecekler",
            notes: "",
            words: [
              { word: "apple", turkish: "elma" },
              { word: "banana", turkish: "muz" },
              { word: "orange", turkish: "portakal" },
              { word: "bread", turkish: "ekmek" },
              { word: "cheese", turkish: "peynir" },
              { word: "milk", turkish: "süt" },
              { word: "egg", turkish: "yumurta" },
              { word: "water", turkish: "su" },
              { word: "juice", turkish: "meyve suyu" },
              { word: "cake", turkish: "pasta" },
              { word: "cookie", turkish: "kurabiye" },
              { word: "ice cream", turkish: "dondurma" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "primary",
    name: "Primary School",
    nameTr: "İlkokul",
    emoji: "📚",
    grades: [
      {
        id: "grade-2",
        name: "Grade 2",
        nameTr: "2. Sınıf",
        themes: [
          {
            id: "2.1",
            name: "Theme 1: School Life",
            nameTr: "Tema 1: Okul Hayatı",
            notes: `GRAMMAR:
• Greetings: Hello, Hi, Goodbye
• Introducing oneself: I'm..., My name is...
• Asking about well-being: How are you? I'm fine, thank you.
• Days of the week
• Question words: What, Where, Who

FUNCTIONS:
• Greeting people
• Introducing yourself
• Talking about school places
• Asking and answering about days`,
            words: [
              { word: "hello", turkish: "merhaba" },
              { word: "goodbye", turkish: "hoşça kalın" },
              { word: "How are you", turkish: "nasılsın" },
              { word: "I am fine", turkish: "iyiyim" },
              { word: "school", turkish: "okul" },
              { word: "classroom", turkish: "sınıf" },
              { word: "library", turkish: "kütüphane" },
              { word: "canteen", turkish: "kafeterya" },
              { word: "sports hall", turkish: "spor salonu" },
              { word: "playground", turkish: "oyun alanı" },
              { word: "garden", turkish: "bahçe" },
              { word: "teacher", turkish: "öğretmen" },
              { word: "student", turkish: "öğrenci" },
              { word: "girl", turkish: "kız" },
              { word: "boy", turkish: "erkek" },
              { word: "friend", turkish: "arkadaş" },
              { word: "day", turkish: "gün" },
              { word: "week", turkish: "hafta" },
              { word: "Monday", turkish: "Pazartesi" },
              { word: "Tuesday", turkish: "Salı" },
              { word: "Wednesday", turkish: "Çarşamba" },
              { word: "Thursday", turkish: "Perşembe" },
              { word: "Friday", turkish: "Cuma" },
              { word: "Saturday", turkish: "Cumartesi" },
              { word: "Sunday", turkish: "Pazar" },
              { word: "what", turkish: "ne" },
              { word: "where", turkish: "nerede" },
              { word: "who", turkish: "kim" },
            ],
          },
          {
            id: "2.2",
            name: "Theme 2: My Classroom",
            nameTr: "Tema 2: Sınıfım",
            notes: `GRAMMAR:
• Imperatives: Stand up, Sit down, Open your book
• Colors as adjectives
• Singular/Plural nouns
• This is a/an...

FUNCTIONS:
• Following classroom instructions
• Identifying classroom objects
• Describing colors
• Giving simple commands`,
            words: [
              { word: "colour", turkish: "renk" },
              { word: "yellow", turkish: "sarı" },
              { word: "blue", turkish: "mavi" },
              { word: "red", turkish: "kırmızı" },
              { word: "green", turkish: "yeşil" },
              { word: "purple", turkish: "mor" },
              { word: "pink", turkish: "pembe" },
              { word: "brown", turkish: "kahverengi" },
              { word: "orange", turkish: "turuncu" },
              { word: "black", turkish: "siyah" },
              { word: "white", turkish: "beyaz" },
              { word: "watch", turkish: "izle" },
              { word: "listen", turkish: "dinle" },
              { word: "write", turkish: "yaz" },
              { word: "raise", turkish: "kaldır" },
              { word: "hand", turkish: "el" },
              { word: "open", turkish: "aç" },
              { word: "close", turkish: "kapat" },
              { word: "repeat", turkish: "tekrarla" },
              { word: "stand up", turkish: "ayağa kalk" },
              { word: "sit down", turkish: "otur" },
              { word: "hurry up", turkish: "acele et" },
              { word: "be quiet", turkish: "sessiz ol" },
              { word: "look", turkish: "bak" },
              { word: "come", turkish: "gel" },
              { word: "go", turkish: "git" },
              { word: "point", turkish: "göster" },
              { word: "match", turkish: "eşleştir" },
              { word: "table", turkish: "masa" },
              { word: "pencil", turkish: "kalem" },
              { word: "pencil case", turkish: "kalem kutusu" },
              { word: "book", turkish: "kitap" },
              { word: "bookshelf", turkish: "kitaplık" },
              { word: "bag", turkish: "çanta" },
              { word: "notebook", turkish: "defter" },
              { word: "eraser", turkish: "silgi" },
              { word: "sharpener", turkish: "kalemtıraş" },
              { word: "crayon", turkish: "pastel boya" },
              { word: "board", turkish: "tahta" },
              { word: "window", turkish: "pencere" },
            ],
          },
          {
            id: "2.3",
            name: "Theme 3: My Body",
            nameTr: "Tema 3: Vücudum",
            notes: `GRAMMAR:
• Parts of the body (singular/plural)
• Describing physical appearance
• Has/Have for descriptions
• Adjectives: long, short, curly, straight

FUNCTIONS:
• Naming body parts
• Describing people's appearance
• Identifying shapes
• Simple descriptions`,
            words: [
              { word: "body", turkish: "vücut" },
              { word: "head", turkish: "baş" },
              { word: "hair", turkish: "saç" },
              { word: "face", turkish: "yüz" },
              { word: "eyes", turkish: "gözler" },
              { word: "mouth", turkish: "ağız" },
              { word: "ears", turkish: "kulaklar" },
              { word: "arms", turkish: "kollar" },
              { word: "hands", turkish: "eller" },
              { word: "legs", turkish: "bacaklar" },
              { word: "nose", turkish: "burun" },
              { word: "blonde", turkish: "sarışın" },
              { word: "brown", turkish: "kahverengi" },
              { word: "black", turkish: "siyah" },
              { word: "straight", turkish: "düz" },
              { word: "curly", turkish: "kıvırcık" },
              { word: "wavy", turkish: "dalgalı" },
              { word: "blue", turkish: "mavi" },
              { word: "green", turkish: "yeşil" },
              { word: "circle", turkish: "daire" },
              { word: "square", turkish: "kare" },
              { word: "triangle", turkish: "üçgen" },
              { word: "rectangle", turkish: "dikdörtgen" },
              { word: "star", turkish: "yıldız" },
              { word: "heart", turkish: "kalp" },
              { word: "oval", turkish: "oval" },
              { word: "diamond", turkish: "eşkenar dörtgen" },
              { word: "robot", turkish: "robot" },
              { word: "clown", turkish: "palyaço" },
              { word: "monster", turkish: "canavar" },
            ],
          },
          {
            id: "2.4",
            name: "Theme 4: My Family",
            nameTr: "Tema 4: Ailem",
            notes: `GRAMMAR:
• Family members vocabulary
• Possessive adjectives: my, your, his, her
• This is my... / Who is this?
• Adjectives for describing people

FUNCTIONS:
• Introducing family members
• Describing family relationships
• Talking about physical characteristics
• Expressing love and feelings`,
            words: [
              { word: "family", turkish: "aile" },
              { word: "member", turkish: "üye" },
              { word: "father", turkish: "baba" },
              { word: "mother", turkish: "anne" },
              { word: "brother", turkish: "erkek kardeş" },
              { word: "sister", turkish: "kız kardeş" },
              { word: "son", turkish: "oğul" },
              { word: "daughter", turkish: "kız" },
              { word: "grandfather", turkish: "büyükbaba" },
              { word: "grandmother", turkish: "büyükanne" },
              { word: "grandchild", turkish: "torun" },
              { word: "child", turkish: "çocuk" },
              { word: "baby", turkish: "bebek" },
              { word: "man", turkish: "erkek" },
              { word: "woman", turkish: "kadın" },
              { word: "old", turkish: "yaşlı" },
              { word: "young", turkish: "genç" },
              { word: "long", turkish: "uzun" },
              { word: "short", turkish: "kısa" },
              { word: "tall", turkish: "uzun boylu" },
              { word: "handsome", turkish: "yakışıklı" },
              { word: "beautiful", turkish: "güzel" },
              { word: "big", turkish: "büyük" },
              { word: "small", turkish: "küçük" },
              { word: "hair", turkish: "saç" },
              { word: "eyes", turkish: "gözler" },
              { word: "who", turkish: "kim" },
              { word: "this", turkish: "bu" },
              { word: "love", turkish: "sevmek" },
              { word: "friend", turkish: "arkadaş" },
            ],
          },
          {
            id: "2.5",
            name: "Theme 5: My Home",
            nameTr: "Tema 5: Evim",
            notes: `GRAMMAR:
• Rooms of the house
• Prepositions of place: in, on, under
• There is/There are
• Pet vocabulary

FUNCTIONS:
• Describing rooms in a house
• Talking about furniture
• Describing pets
• Saying where things are`,
            words: [
              { word: "house", turkish: "ev" },
              { word: "garden", turkish: "bahçe" },
              { word: "living room", turkish: "oturma odası" },
              { word: "dining room", turkish: "yemek odası" },
              { word: "bedroom", turkish: "yatak odası" },
              { word: "bathroom", turkish: "banyo" },
              { word: "kitchen", turkish: "mutfak" },
              { word: "door", turkish: "kapı" },
              { word: "window", turkish: "pencere" },
              { word: "sofa", turkish: "kanepe" },
              { word: "bed", turkish: "yatak" },
              { word: "chair", turkish: "sandalye" },
              { word: "coffee table", turkish: "sehpa" },
              { word: "dog", turkish: "köpek" },
              { word: "cat", turkish: "kedi" },
              { word: "goldfish", turkish: "japon balığı" },
              { word: "bird", turkish: "kuş" },
              { word: "rabbit", turkish: "tavşan" },
              { word: "turtle", turkish: "kaplumbağa" },
              { word: "paw", turkish: "pati" },
              { word: "claw", turkish: "pençe" },
              { word: "tail", turkish: "kuyruk" },
              { word: "whiskers", turkish: "bıyık" },
              { word: "beak", turkish: "gaga" },
              { word: "fur", turkish: "kürk" },
              { word: "wings", turkish: "kanatlar" },
              { word: "where", turkish: "nerede" },
              { word: "find", turkish: "bul" },
              { word: "here", turkish: "burada" },
              { word: "happy", turkish: "mutlu" },
            ],
          },
        ],
      },
    ],
  },
];

// Helper function to count total words
export function getTotalWordCount(): number {
  let count = 0;
  wordMapData.forEach((level) => {
    level.grades.forEach((grade) => {
      grade.themes.forEach((theme) => {
        count += theme.words.length;
      });
    });
  });
  return count;
}

// Helper function to get unique words (removing duplicates)
export function getUniqueWords(): Word[] {
  const wordMap = new Map<string, Word>();
  wordMapData.forEach((level) => {
    level.grades.forEach((grade) => {
      grade.themes.forEach((theme) => {
        theme.words.forEach((word) => {
          if (!wordMap.has(word.word.toLowerCase())) {
            wordMap.set(word.word.toLowerCase(), word);
          }
        });
      });
    });
  });
  return Array.from(wordMap.values());
}

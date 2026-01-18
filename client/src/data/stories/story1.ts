// Story data for "Let's Find the Clues" - English Year 2 Book 1

import type { Story } from './types';

export const story1: Story = {
  id: 'story1',
  title: "Let's Find the Clues",
  titleTurkish: 'İpuçlarını Bulalım',
  description: 'A story about friendship and sensitivity featuring Clara, Efe, and Sude.',
  descriptionTurkish: 'Clara, Efe ve Sude\'nin yer aldığı dostluk ve duyarlılık hakkında bir hikaye.',
  thumbnailUrl: '/images/stories/story1/thumbnail.png',
  audioUrl: '/sounds/stories/story1.mp3',
  pages: [
    {
      pageNumber: 1,
      imageUrl: '/images/stories/story1/book 1-01.png',
      sentences: [
        {
          english: 'English Year 2 Book 1',
          turkish: 'İngilizce 2. Sınıf Kitap 1',
          words: [
            { text: 'English Year 2 Book 1', role: 'subject', turkishText: 'İngilizce 2. Sınıf Kitap 1' },
          ],
        },
        {
          english: 'Let\'s Find the Clues',
          turkish: 'İpuçlarını Bulalım',
          words: [
            { text: 'Let\'s Find', role: 'verb', turkishText: 'Bulalım' },
            { text: 'the Clues', role: 'object', turkishText: 'İpuçlarını' },
          ],
        },
      ],
    },
    {
      pageNumber: 2,
      imageUrl: '/images/stories/story1/book 1-02.png',
      sentences: [
        {
          english: 'English Year 2 Book 1',
          turkish: 'İngilizce 2. Sınıf Kitap 1',
          words: [
            { text: 'English Year 2 Book 1', role: 'subject', turkishText: 'İngilizce 2. Sınıf Kitap 1' },
          ],
        },
        {
          english: 'Let\'s Find the Clues',
          turkish: 'İpuçlarını Bulalım',
          words: [
            { text: 'Let\'s Find', role: 'verb', turkishText: 'Bulalım' },
            { text: 'the Clues', role: 'object', turkishText: 'İpuçlarını' },
          ],
        },
        {
          english: 'Friendship & Sensitivity',
          turkish: 'Dostluk ve Duyarlılık',
          words: [
            { text: 'Friendship', role: 'subject', turkishText: 'Dostluk' },
            { text: '&', role: 'other', turkishText: 've' },
            { text: 'Sensitivity', role: 'subject', turkishText: 'Duyarlılık' },
          ],
        },
      ],
    },
    {
      pageNumber: 3,
      imageUrl: '/images/stories/story1/book 1-03.png',
      sentences: [],
    },
    {
      pageNumber: 4,
      imageUrl: '/images/stories/story1/book 1-04.png',
      sentences: [
        {
          english: 'It\'s Monday morning.',
          turkish: 'Pazartesi sabahı.',
          words: [
            { text: 'It', role: 'subject', turkishText: 'O' },
            { text: '\'s', role: 'verb', turkishText: 'var' },
            { text: 'Monday morning', role: 'time', turkishText: 'Pazartesi sabahı' },
          ],
        },
        {
          english: 'Clara is at school now.',
          turkish: 'Clara şimdi okulda.',
          words: [
            { text: 'Clara', role: 'subject', turkishText: 'Clara' },
            { text: 'is', role: 'verb', turkishText: 'var' },
            { text: 'at school', role: 'object', turkishText: 'okulda' },
            { text: 'now', role: 'time', turkishText: 'şimdi' },
          ],
        },
        {
          english: 'It is the first day of school.',
          turkish: 'Okulun ilk günü.',
          words: [
            { text: 'It', role: 'subject', turkishText: 'O' },
            { text: 'is', role: 'verb', turkishText: 'var' },
            { text: 'the first day', role: 'object', turkishText: 'ilk gün' },
            { text: 'of school', role: 'object', turkishText: 'okulun' },
          ],
        },
        {
          english: 'She is very happy.',
          turkish: 'O çok mutlu.',
          words: [
            { text: 'She', role: 'subject', turkishText: 'O' },
            { text: 'is', role: 'verb', turkishText: 'var' },
            { text: 'very happy', role: 'adjective', turkishText: 'çok mutlu' },
          ],
        },
      ],
    },
    {
      pageNumber: 5,
      imageUrl: '/images/stories/story1/book 1-05.png',
      sentences: [
        {
          english: 'Sude: Good morning.',
          turkish: 'Sude: Günaydın.',
          words: [
            { text: 'Sude', role: 'subject', turkishText: 'Sude' },
            { text: 'Good morning', role: 'other', turkishText: 'Günaydın' },
          ],
        },
        {
          english: 'Clara: Hello!',
          turkish: 'Clara: Merhaba!',
          words: [
            { text: 'Clara', role: 'subject', turkishText: 'Clara' },
            { text: 'Hello', role: 'other', turkishText: 'Merhaba' },
          ],
        },
        {
          english: 'Efe: What is your name?',
          turkish: 'Efe: Adın ne?',
          words: [
            { text: 'Efe', role: 'subject', turkishText: 'Efe' },
            { text: 'What', role: 'object', turkishText: 'Ne' },
            { text: 'is', role: 'verb', turkishText: 'var' },
            { text: 'your name', role: 'object', turkishText: 'adın' },
          ],
        },
        {
          english: 'Clara: My name is Clara. What\'s your name?',
          turkish: 'Clara: Benim adım Clara. Adın ne?',
          words: [
            { text: 'Clara', role: 'subject', turkishText: 'Clara' },
            { text: 'My name', role: 'subject', turkishText: 'Benim adım' },
            { text: 'is', role: 'verb', turkishText: 'var' },
            { text: 'Clara', role: 'object', turkishText: 'Clara' },
            { text: 'What', role: 'object', turkishText: 'Ne' },
            { text: 'your name', role: 'object', turkishText: 'adın' },
          ],
        },
        {
          english: 'Efe: My name is Efe. This is Sude.',
          turkish: 'Efe: Benim adım Efe. Bu Sude.',
          words: [
            { text: 'Efe', role: 'subject', turkishText: 'Efe' },
            { text: 'My name', role: 'subject', turkishText: 'Benim adım' },
            { text: 'is', role: 'verb', turkishText: 'var' },
            { text: 'Efe', role: 'object', turkishText: 'Efe' },
            { text: 'This', role: 'subject', turkishText: 'Bu' },
            { text: 'is', role: 'verb', turkishText: 'var' },
            { text: 'Sude', role: 'object', turkishText: 'Sude' },
          ],
        },
      ],
    },
    {
      pageNumber: 6,
      imageUrl: '/images/stories/story1/book 1-06.png',
      sentences: [
        {
          english: 'Clara: Nice to meet you.',
          turkish: 'Clara: Tanıştığımıza memnun oldum.',
          words: [
            { text: 'Clara', role: 'subject', turkishText: 'Clara' },
            { text: 'Nice', role: 'adjective', turkishText: 'memnun' },
            { text: 'to meet', role: 'verb', turkishText: 'tanışmak' },
            { text: 'you', role: 'object', turkishText: 'sen' },
          ],
        },
        {
          english: 'Sude: Nice to meet you, Clara.',
          turkish: 'Sude: Tanıştığımıza memnun oldum, Clara.',
          words: [
            { text: 'Sude', role: 'subject', turkishText: 'Sude' },
            { text: 'Nice', role: 'adjective', turkishText: 'memnun' },
            { text: 'to meet', role: 'verb', turkishText: 'tanışmak' },
            { text: 'you, Clara', role: 'object', turkishText: 'sen, Clara' },
          ],
        },
        {
          english: 'Efe: Let me help you.',
          turkish: 'Efe: Sana yardım edeyim.',
          words: [
            { text: 'Efe', role: 'subject', turkishText: 'Efe' },
            { text: 'Let me', role: 'verb', turkishText: 'Bırak' },
            { text: 'help', role: 'verb', turkishText: 'yardım et' },
            { text: 'you', role: 'object', turkishText: 'sana' },
          ],
        },
        {
          english: 'Clara: Thank you, Efe. That\'s very kind of you.',
          turkish: 'Clara: Teşekkür ederim, Efe. Bu çok naziksin.',
          words: [
            { text: 'Clara', role: 'subject', turkishText: 'Clara' },
            { text: 'Thank you', role: 'verb', turkishText: 'Teşekkür ederim' },
            { text: 'Efe', role: 'object', turkishText: 'Efe' },
            { text: 'That', role: 'subject', turkishText: 'Bu' },
            { text: '\'s', role: 'verb', turkishText: 'var' },
            { text: 'very kind', role: 'adjective', turkishText: 'nazik' },
            { text: 'of you', role: 'object', turkishText: 'sensin' },
          ],
        },
        {
          english: 'Efe: You\'re welcome, Clara!',
          turkish: 'Efe: Rica ederim, Clara!',
          words: [
            { text: 'Efe', role: 'subject', turkishText: 'Efe' },
            { text: 'You', role: 'subject', turkishText: 'Sen' },
            { text: '\'re welcome', role: 'verb', turkishText: 'rica ederim' },
            { text: 'Clara', role: 'object', turkishText: 'Clara' },
          ],
        },
      ],
    },
    {
      pageNumber: 7,
      imageUrl: '/images/stories/story1/book 1-07.png',
      sentences: [
        {
          english: 'Efe: This board is for Republic Day.',
          turkish: 'Efe: Bu pano Cumhuriyet Bayramı için.',
          words: [
            { text: 'Efe', role: 'subject', turkishText: 'Efe' },
            { text: 'This board', role: 'subject', turkishText: 'Bu pano' },
            { text: 'is', role: 'verb', turkishText: 'var' },
            { text: 'for Republic Day', role: 'object', turkishText: 'Cumhuriyet Bayramı için' },
          ],
        },
        {
          english: 'Sude: We celebrate Republic Day on 29 October.',
          turkish: 'Sude: 29 Ekim\'de Cumhuriyet Bayramını kutluyoruz.',
          words: [
            { text: 'Sude', role: 'subject', turkishText: 'Sude' },
            { text: 'We', role: 'subject', turkishText: 'Biz' },
            { text: 'celebrate', role: 'verb', turkishText: 'kutluyoruz' },
            { text: 'Republic Day', role: 'object', turkishText: 'Cumhuriyet Bayramını' },
            { text: 'on 29 October', role: 'time', turkishText: '29 Ekim\'de' },
          ],
        },
        {
          english: 'Clara: That\'s great.',
          turkish: 'Clara: Bu harika.',
          words: [
            { text: 'Clara', role: 'subject', turkishText: 'Clara' },
            { text: 'That', role: 'subject', turkishText: 'Bu' },
            { text: '\'s', role: 'verb', turkishText: 'var' },
            { text: 'great', role: 'adjective', turkishText: 'harika' },
          ],
        },
      ],
    },
    {
      pageNumber: 8,
      imageUrl: '/images/stories/story1/book 1-08.png',
      sentences: [
        {
          english: 'Ding! Dong!',
          turkish: 'Ding! Dong!',
          words: [
            { text: 'Ding! Dong!', role: 'other', turkishText: 'Ding! Dong!' },
          ],
        },
        {
          english: 'Clara: The school bell is ringing.',
          turkish: 'Clara: Okul zili çalıyor.',
          words: [
            { text: 'Clara', role: 'subject', turkishText: 'Clara' },
            { text: 'The school bell', role: 'subject', turkishText: 'Okul zili' },
            { text: 'is ringing', role: 'verb', turkishText: 'çalıyor' },
          ],
        },
        {
          english: 'Sude: Time to go to class!',
          turkish: 'Sude: Sınıfa gitme zamanı!',
          words: [
            { text: 'Sude', role: 'subject', turkishText: 'Sude' },
            { text: 'Time', role: 'time', turkishText: 'zamanı' },
            { text: 'to go', role: 'verb', turkishText: 'gitme' },
            { text: 'to class', role: 'object', turkishText: 'sınıfa' },
          ],
        },
      ],
    },
    {
      pageNumber: 9,
      imageUrl: '/images/stories/story1/book 1-09.png',
      sentences: [
        {
          english: 'Lesson: English',
          turkish: 'Ders: İngilizce',
          words: [
            { text: 'Lesson', role: 'subject', turkishText: 'Ders' },
            { text: 'English', role: 'object', turkishText: 'İngilizce' },
          ],
        },
        {
          english: 'All the students are in the classroom now.',
          turkish: 'Tüm öğrenciler şimdi sınıfta.',
          words: [
            { text: 'All the students', role: 'subject', turkishText: 'Tüm öğrenciler' },
            { text: 'are', role: 'verb', turkishText: 'var' },
            { text: 'in the classroom', role: 'object', turkishText: 'sınıfta' },
            { text: 'now', role: 'time', turkishText: 'şimdi' },
          ],
        },
        {
          english: 'Mrs Yalçın: Hello, kids! Welcome back to school! This is Clara. She is a new student.',
          turkish: 'Bayan Yalçın: Merhaba çocuklar! Okula hoş geldiniz! Bu Clara. O yeni bir öğrenci.',
          words: [
            { text: 'Mrs Yalçın', role: 'subject', turkishText: 'Bayan Yalçın' },
            { text: 'Hello, kids', role: 'other', turkishText: 'Merhaba çocuklar' },
            { text: 'Welcome back', role: 'verb', turkishText: 'hoş geldiniz' },
            { text: 'to school', role: 'object', turkishText: 'okula' },
            { text: 'This', role: 'subject', turkishText: 'Bu' },
            { text: 'is', role: 'verb', turkishText: 'var' },
            { text: 'Clara', role: 'object', turkishText: 'Clara' },
            { text: 'She', role: 'subject', turkishText: 'O' },
            { text: 'is', role: 'verb', turkishText: 'var' },
            { text: 'a new student', role: 'object', turkishText: 'yeni bir öğrenci' },
          ],
        },
        {
          english: 'She is from England. Say hello to Clara!',
          turkish: 'O İngiltere\'den. Clara\'ya merhaba deyin!',
          words: [
            { text: 'She', role: 'subject', turkishText: 'O' },
            { text: 'is', role: 'verb', turkishText: 'var' },
            { text: 'from England', role: 'object', turkishText: 'İngiltere\'den' },
            { text: 'Say hello', role: 'verb', turkishText: 'merhaba deyin' },
            { text: 'to Clara', role: 'object', turkishText: 'Clara\'ya' },
          ],
        },
        {
          english: 'Students: Hello, Clara!',
          turkish: 'Öğrenciler: Merhaba, Clara!',
          words: [
            { text: 'Students', role: 'subject', turkishText: 'Öğrenciler' },
            { text: 'Hello', role: 'other', turkishText: 'Merhaba' },
            { text: 'Clara', role: 'object', turkishText: 'Clara' },
          ],
        },
      ],
    },
    {
      pageNumber: 10,
      imageUrl: '/images/stories/story1/book 1-10.png',
      sentences: [
        {
          english: 'Mrs Yalçın: I have a surprise for you. Let\'s play a game.',
          turkish: 'Bayan Yalçın: Sizin için bir sürprizim var. Bir oyun oynayalım.',
          words: [
            { text: 'Mrs Yalçın', role: 'subject', turkishText: 'Bayan Yalçın' },
            { text: 'I', role: 'subject', turkishText: 'Ben' },
            { text: 'have', role: 'verb', turkishText: 'var' },
            { text: 'a surprise', role: 'object', turkishText: 'bir sürpriz' },
            { text: 'for you', role: 'object', turkishText: 'sizin için' },
            { text: 'Let\'s play', role: 'verb', turkishText: 'oynayalım' },
            { text: 'a game', role: 'object', turkishText: 'bir oyun' },
          ],
        },
        {
          english: 'Efe: What is the name of the game, Mrs Yalçın?',
          turkish: 'Efe: Oyunun adı ne, Bayan Yalçın?',
          words: [
            { text: 'Efe', role: 'subject', turkishText: 'Efe' },
            { text: 'What', role: 'object', turkishText: 'Ne' },
            { text: 'is', role: 'verb', turkishText: 'var' },
            { text: 'the name', role: 'object', turkishText: 'adı' },
            { text: 'of the game', role: 'object', turkishText: 'oyunun' },
            { text: 'Mrs Yalçın', role: 'object', turkishText: 'Bayan Yalçın' },
          ],
        },
        {
          english: 'Mrs Yalçın: It\'s the \'Find the Clues\' game. First, go to the library and find Mr Bilir. He has a clue.',
          turkish: 'Bayan Yalçın: \'İpuçlarını Bul\' oyunu. Önce kütüphaneye gidin ve Bay Bilir\'i bulun. Onun bir ipucu var.',
          words: [
            { text: 'Mrs Yalçın', role: 'subject', turkishText: 'Bayan Yalçın' },
            { text: 'It', role: 'subject', turkishText: 'O' },
            { text: '\'s', role: 'verb', turkishText: 'var' },
            { text: 'the \'Find the Clues\' game', role: 'object', turkishText: '\'İpuçlarını Bul\' oyunu' },
            { text: 'First', role: 'time', turkishText: 'Önce' },
            { text: 'go', role: 'verb', turkishText: 'gidin' },
            { text: 'to the library', role: 'object', turkishText: 'kütüphaneye' },
            { text: 'find', role: 'verb', turkishText: 'bulun' },
            { text: 'Mr Bilir', role: 'object', turkishText: 'Bay Bilir\'i' },
            { text: 'He', role: 'subject', turkishText: 'O' },
            { text: 'has', role: 'verb', turkishText: 'var' },
            { text: 'a clue', role: 'object', turkishText: 'bir ipucu' },
          ],
        },
        {
          english: 'Sude: Hurray! Let\'s start.',
          turkish: 'Sude: Yaşasın! Başlayalım.',
          words: [
            { text: 'Sude', role: 'subject', turkishText: 'Sude' },
            { text: 'Hurray', role: 'other', turkishText: 'Yaşasın' },
            { text: 'Let\'s start', role: 'verb', turkishText: 'Başlayalım' },
          ],
        },
      ],
    },
    {
      pageNumber: 11,
      imageUrl: '/images/stories/story1/book 1-11.png',
      sentences: [
        {
          english: 'Efe: Hello, Mr Bilir. We are here for the \'Find the Clues\' game.',
          turkish: 'Efe: Merhaba, Bay Bilir. \'İpuçlarını Bul\' oyunu için buradayız.',
          words: [
            { text: 'Efe', role: 'subject', turkishText: 'Efe' },
            { text: 'Hello', role: 'other', turkishText: 'Merhaba' },
            { text: 'Mr Bilir', role: 'object', turkishText: 'Bay Bilir' },
            { text: 'We', role: 'subject', turkishText: 'Biz' },
            { text: 'are', role: 'verb', turkishText: 'var' },
            { text: 'here', role: 'object', turkishText: 'burada' },
            { text: 'for the \'Find the Clues\' game', role: 'object', turkishText: '\'İpuçlarını Bul\' oyunu için' },
          ],
        },
        {
          english: 'Mr Bilir: OK! This is for you. Here you are. Open it, please, Efe.',
          turkish: 'Bay Bilir: Tamam! Bu sizin için. İşte burada. Lütfen aç, Efe.',
          words: [
            { text: 'Mr Bilir', role: 'subject', turkishText: 'Bay Bilir' },
            { text: 'OK', role: 'other', turkishText: 'Tamam' },
            { text: 'This', role: 'subject', turkishText: 'Bu' },
            { text: 'is', role: 'verb', turkishText: 'var' },
            { text: 'for you', role: 'object', turkishText: 'sizin için' },
            { text: 'Here you are', role: 'other', turkishText: 'İşte burada' },
            { text: 'Open', role: 'verb', turkishText: 'aç' },
            { text: 'it', role: 'object', turkishText: 'onu' },
            { text: 'Efe', role: 'object', turkishText: 'Efe' },
          ],
        },
        {
          english: 'Efe: Look, a note! It says, \'Go to the lunch hall and find the headmaster, Mr Eren.\'',
          turkish: 'Efe: Bak, bir not! Diyor ki, \'Yemekhaneye git ve müdür Bay Eren\'i bul.\'',
          words: [
            { text: 'Efe', role: 'subject', turkishText: 'Efe' },
            { text: 'Look', role: 'verb', turkishText: 'Bak' },
            { text: 'a note', role: 'object', turkishText: 'bir not' },
            { text: 'It', role: 'subject', turkishText: 'O' },
            { text: 'says', role: 'verb', turkishText: 'diyor' },
            { text: 'Go', role: 'verb', turkishText: 'git' },
            { text: 'to the lunch hall', role: 'object', turkishText: 'yemekhaneye' },
            { text: 'find', role: 'verb', turkishText: 'bul' },
            { text: 'the headmaster, Mr Eren', role: 'object', turkishText: 'müdür Bay Eren\'i' },
          ],
        },
        {
          english: 'Sude: Let\'s go to the lunch hall, then.',
          turkish: 'Sude: O zaman yemekhaneye gidelim.',
          words: [
            { text: 'Sude', role: 'subject', turkishText: 'Sude' },
            { text: 'Let\'s go', role: 'verb', turkishText: 'gidelim' },
            { text: 'to the lunch hall', role: 'object', turkishText: 'yemekhaneye' },
            { text: 'then', role: 'time', turkishText: 'o zaman' },
          ],
        },
      ],
    },
    {
      pageNumber: 12,
      imageUrl: '/images/stories/story1/book 1-12.png',
      sentences: [
        {
          english: 'Mr Eren: Good morning, kids! How are you?',
          turkish: 'Bay Eren: Günaydın çocuklar! Nasılsınız?',
          words: [
            { text: 'Mr Eren', role: 'subject', turkishText: 'Bay Eren' },
            { text: 'Good morning', role: 'other', turkishText: 'Günaydın' },
            { text: 'kids', role: 'object', turkishText: 'çocuklar' },
            { text: 'How', role: 'object', turkishText: 'Nasıl' },
            { text: 'are', role: 'verb', turkishText: 'var' },
            { text: 'you', role: 'object', turkishText: 'siz' },
          ],
        },
        {
          english: 'Efe: I\'m fine, thanks! And you?',
          turkish: 'Efe: İyiyim, teşekkürler! Ya sen?',
          words: [
            { text: 'Efe', role: 'subject', turkishText: 'Efe' },
            { text: 'I', role: 'subject', turkishText: 'Ben' },
            { text: '\'m fine', role: 'verb', turkishText: 'iyiyim' },
            { text: 'thanks', role: 'other', turkishText: 'teşekkürler' },
            { text: 'And you', role: 'other', turkishText: 'Ya sen' },
          ],
        },
        {
          english: 'Mr Eren: I\'m fine, thank you. This is for you.',
          turkish: 'Bay Eren: İyiyim, teşekkür ederim. Bu sizin için.',
          words: [
            { text: 'Mr Eren', role: 'subject', turkishText: 'Bay Eren' },
            { text: 'I', role: 'subject', turkishText: 'Ben' },
            { text: '\'m fine', role: 'verb', turkishText: 'iyiyim' },
            { text: 'thank you', role: 'verb', turkishText: 'teşekkür ederim' },
            { text: 'This', role: 'subject', turkishText: 'Bu' },
            { text: 'is', role: 'verb', turkishText: 'var' },
            { text: 'for you', role: 'object', turkishText: 'sizin için' },
          ],
        },
        {
          english: 'Clara: Thank you, Mr Eren.',
          turkish: 'Clara: Teşekkür ederim, Bay Eren.',
          words: [
            { text: 'Clara', role: 'subject', turkishText: 'Clara' },
            { text: 'Thank you', role: 'verb', turkishText: 'Teşekkür ederim' },
            { text: 'Mr Eren', role: 'object', turkishText: 'Bay Eren' },
          ],
        },
        {
          english: 'Sude: Look, a note! \'Go to the teacher\'s room and find Mrs Yaman.\'',
          turkish: 'Sude: Bak, bir not! \'Öğretmenler odasına git ve Bayan Yaman\'ı bul.\'',
          words: [
            { text: 'Sude', role: 'subject', turkishText: 'Sude' },
            { text: 'Look', role: 'verb', turkishText: 'Bak' },
            { text: 'a note', role: 'object', turkishText: 'bir not' },
            { text: 'Go', role: 'verb', turkishText: 'git' },
            { text: 'to the teacher\'s room', role: 'object', turkishText: 'öğretmenler odasına' },
            { text: 'find', role: 'verb', turkishText: 'bul' },
            { text: 'Mrs Yaman', role: 'object', turkishText: 'Bayan Yaman\'ı' },
          ],
        },
      ],
    },
    {
      pageNumber: 13,
      imageUrl: '/images/stories/story1/book 1-13.png',
      sentences: [
        {
          english: 'Efe: Hello, Mrs Yaman.',
          turkish: 'Efe: Merhaba, Bayan Yaman.',
          words: [
            { text: 'Efe', role: 'subject', turkishText: 'Efe' },
            { text: 'Hello', role: 'other', turkishText: 'Merhaba' },
            { text: 'Mrs Yaman', role: 'object', turkishText: 'Bayan Yaman' },
          ],
        },
        {
          english: 'Mrs Yaman: Hi, kids! This note is for you. Open and read.',
          turkish: 'Bayan Yaman: Merhaba çocuklar! Bu not sizin için. Aç ve oku.',
          words: [
            { text: 'Mrs Yaman', role: 'subject', turkishText: 'Bayan Yaman' },
            { text: 'Hi, kids', role: 'other', turkishText: 'Merhaba çocuklar' },
            { text: 'This note', role: 'subject', turkishText: 'Bu not' },
            { text: 'is', role: 'verb', turkishText: 'var' },
            { text: 'for you', role: 'object', turkishText: 'sizin için' },
            { text: 'Open', role: 'verb', turkishText: 'Aç' },
            { text: 'read', role: 'verb', turkishText: 'oku' },
          ],
        },
        {
          english: 'Sude: \'Go to the playground and find the boy in the red T-shirt.\'',
          turkish: 'Sude: \'Oyun alanına git ve kırmızı tişörtlü çocuğu bul.\'',
          words: [
            { text: 'Sude', role: 'subject', turkishText: 'Sude' },
            { text: 'Go', role: 'verb', turkishText: 'git' },
            { text: 'to the playground', role: 'object', turkishText: 'oyun alanına' },
            { text: 'find', role: 'verb', turkishText: 'bul' },
            { text: 'the boy', role: 'object', turkishText: 'çocuğu' },
            { text: 'in the red T-shirt', role: 'object', turkishText: 'kırmızı tişörtlü' },
          ],
        },
        {
          english: 'Clara: Let\'s go.',
          turkish: 'Clara: Gidelim.',
          words: [
            { text: 'Clara', role: 'subject', turkishText: 'Clara' },
            { text: 'Let\'s go', role: 'verb', turkishText: 'Gidelim' },
          ],
        },
      ],
    },
    {
      pageNumber: 14,
      imageUrl: '/images/stories/story1/book 1-14.png',
      sentences: [
        {
          english: 'Efe: Here is the boy.',
          turkish: 'Efe: İşte çocuk.',
          words: [
            { text: 'Efe', role: 'subject', turkishText: 'Efe' },
            { text: 'Here', role: 'other', turkishText: 'İşte' },
            { text: 'is', role: 'verb', turkishText: 'var' },
            { text: 'the boy', role: 'object', turkishText: 'çocuk' },
          ],
        },
        {
          english: 'Fatih: Hi, friends! This is for you.',
          turkish: 'Fatih: Merhaba arkadaşlar! Bu sizin için.',
          words: [
            { text: 'Fatih', role: 'subject', turkishText: 'Fatih' },
            { text: 'Hi, friends', role: 'other', turkishText: 'Merhaba arkadaşlar' },
            { text: 'This', role: 'subject', turkishText: 'Bu' },
            { text: 'is', role: 'verb', turkishText: 'var' },
            { text: 'for you', role: 'object', turkishText: 'sizin için' },
          ],
        },
        {
          english: 'Clara: Look, a note again. \'Go to the canteen and find the big table.\'',
          turkish: 'Clara: Bak, yine bir not. \'Kantene git ve büyük masayı bul.\'',
          words: [
            { text: 'Clara', role: 'subject', turkishText: 'Clara' },
            { text: 'Look', role: 'verb', turkishText: 'Bak' },
            { text: 'a note', role: 'object', turkishText: 'bir not' },
            { text: 'again', role: 'time', turkishText: 'yine' },
            { text: 'Go', role: 'verb', turkishText: 'git' },
            { text: 'to the canteen', role: 'object', turkishText: 'kantene' },
            { text: 'find', role: 'verb', turkishText: 'bul' },
            { text: 'the big table', role: 'object', turkishText: 'büyük masayı' },
          ],
        },
      ],
    },
    {
      pageNumber: 15,
      imageUrl: '/images/stories/story1/book 1-15.png',
      sentences: [
        {
          english: 'Sude: Here is the big table.',
          turkish: 'Sude: İşte büyük masa.',
          words: [
            { text: 'Sude', role: 'subject', turkishText: 'Sude' },
            { text: 'Here', role: 'other', turkishText: 'İşte' },
            { text: 'is', role: 'verb', turkishText: 'var' },
            { text: 'the big table', role: 'object', turkishText: 'büyük masa' },
          ],
        },
        {
          english: 'Efe: Look, there is a small box.',
          turkish: 'Efe: Bak, küçük bir kutu var.',
          words: [
            { text: 'Efe', role: 'subject', turkishText: 'Efe' },
            { text: 'Look', role: 'verb', turkishText: 'Bak' },
            { text: 'there is', role: 'verb', turkishText: 'var' },
            { text: 'a small box', role: 'object', turkishText: 'küçük bir kutu' },
          ],
        },
        {
          english: 'Clara: Let\'s open it.',
          turkish: 'Clara: Açalım.',
          words: [
            { text: 'Clara', role: 'subject', turkishText: 'Clara' },
            { text: 'Let\'s open', role: 'verb', turkishText: 'Açalım' },
            { text: 'it', role: 'object', turkishText: 'onu' },
          ],
        },
      ],
    },
    {
      pageNumber: 16,
      imageUrl: '/images/stories/story1/book 1-16.png',
      sentences: [
        {
          english: 'Clara: What is in it?',
          turkish: 'Clara: İçinde ne var?',
          words: [
            { text: 'Clara', role: 'subject', turkishText: 'Clara' },
            { text: 'What', role: 'object', turkishText: 'Ne' },
            { text: 'is', role: 'verb', turkishText: 'var' },
            { text: 'in it', role: 'object', turkishText: 'içinde' },
          ],
        },
        {
          english: 'Efe: Wow! They are theatre tickets.',
          turkish: 'Efe: Vay be! Onlar tiyatro biletleri.',
          words: [
            { text: 'Efe', role: 'subject', turkishText: 'Efe' },
            { text: 'Wow', role: 'other', turkishText: 'Vay be' },
            { text: 'They', role: 'subject', turkishText: 'Onlar' },
            { text: 'are', role: 'verb', turkishText: 'var' },
            { text: 'theatre tickets', role: 'object', turkishText: 'tiyatro biletleri' },
          ],
        },
        {
          english: 'Sude: Really? What a nice surprise!',
          turkish: 'Sude: Gerçekten mi? Ne güzel bir sürpriz!',
          words: [
            { text: 'Sude', role: 'subject', turkishText: 'Sude' },
            { text: 'Really', role: 'other', turkishText: 'Gerçekten mi' },
            { text: 'What', role: 'object', turkishText: 'Ne' },
            { text: 'a nice surprise', role: 'object', turkishText: 'güzel bir sürpriz' },
          ],
        },
      ],
    },
    {
      pageNumber: 17,
      imageUrl: '/images/stories/story1/book 1-17.png',
      sentences: [
        {
          english: 'Efe: Look, Mrs Yalçın!',
          turkish: 'Efe: Bak, Bayan Yalçın!',
          words: [
            { text: 'Efe', role: 'subject', turkishText: 'Efe' },
            { text: 'Look', role: 'verb', turkishText: 'Bak' },
            { text: 'Mrs Yalçın', role: 'object', turkishText: 'Bayan Yalçın' },
          ],
        },
        {
          english: 'Sude: We have the theatre tickets!',
          turkish: 'Sude: Tiyatro biletlerimiz var!',
          words: [
            { text: 'Sude', role: 'subject', turkishText: 'Sude' },
            { text: 'We', role: 'subject', turkishText: 'Biz' },
            { text: 'have', role: 'verb', turkishText: 'var' },
            { text: 'the theatre tickets', role: 'object', turkishText: 'tiyatro biletleri' },
          ],
        },
        {
          english: 'Mrs Yalçın: That\'s great! Well done, kids.',
          turkish: 'Bayan Yalçın: Bu harika! Aferin çocuklar.',
          words: [
            { text: 'Mrs Yalçın', role: 'subject', turkishText: 'Bayan Yalçın' },
            { text: 'That', role: 'subject', turkishText: 'Bu' },
            { text: '\'s', role: 'verb', turkishText: 'var' },
            { text: 'great', role: 'adjective', turkishText: 'harika' },
            { text: 'Well done', role: 'other', turkishText: 'Aferin' },
            { text: 'kids', role: 'object', turkishText: 'çocuklar' },
          ],
        },
        {
          english: 'Clara: Thank you for the game and the tickets.',
          turkish: 'Clara: Oyun ve biletler için teşekkür ederim.',
          words: [
            { text: 'Clara', role: 'subject', turkishText: 'Clara' },
            { text: 'Thank you', role: 'verb', turkishText: 'teşekkür ederim' },
            { text: 'for the game', role: 'object', turkishText: 'oyun için' },
            { text: 'the tickets', role: 'object', turkishText: 'biletler' },
          ],
        },
        {
          english: 'Mrs Yalçın: You\'re welcome!',
          turkish: 'Bayan Yalçın: Rica ederim!',
          words: [
            { text: 'Mrs Yalçın', role: 'subject', turkishText: 'Bayan Yalçın' },
            { text: 'You', role: 'subject', turkishText: 'Sen' },
            { text: '\'re welcome', role: 'verb', turkishText: 'rica ederim' },
          ],
        },
      ],
    },
    {
      pageNumber: 18,
      imageUrl: '/images/stories/story1/book 1-18.png',
      sentences: [
        {
          english: 'GLOSSARY',
          turkish: 'SÖZLÜK',
          words: [
            { text: 'GLOSSARY', role: 'other', turkishText: 'SÖZLÜK' },
          ],
        },
      ],
    },
    {
      pageNumber: 19,
      imageUrl: '/images/stories/story1/book 1-19.png',
      sentences: [
        {
          english: 'GLOSSARY',
          turkish: 'SÖZLÜK',
          words: [
            { text: 'GLOSSARY', role: 'other', turkishText: 'SÖZLÜK' },
          ],
        },
      ],
    },
    {
      pageNumber: 20,
      imageUrl: '/images/stories/story1/book 1-20.png',
      sentences: [
        {
          english: 'LET\'S CHECK',
          turkish: 'KONTROL EDELİM',
          words: [
            { text: 'LET\'S CHECK', role: 'other', turkishText: 'KONTROL EDELİM' },
          ],
        },
        {
          english: 'A) Read and answer.',
          turkish: 'A) Oku ve cevapla.',
          words: [
            { text: 'Read', role: 'verb', turkishText: 'Oku' },
            { text: 'answer', role: 'verb', turkishText: 'cevapla' },
          ],
        },
        {
          english: '1. Who is she?',
          turkish: '1. O kim?',
          words: [
            { text: 'Who', role: 'object', turkishText: 'Kim' },
            { text: 'is', role: 'verb', turkishText: 'var' },
            { text: 'she', role: 'subject', turkishText: 'o' },
          ],
        },
        {
          english: 'She is Clara.',
          turkish: 'O Clara.',
          words: [
            { text: 'She', role: 'subject', turkishText: 'O' },
            { text: 'is', role: 'verb', turkishText: 'var' },
            { text: 'Clara', role: 'object', turkishText: 'Clara' },
          ],
        },
        {
          english: '2. Who is he?',
          turkish: '2. O kim?',
          words: [
            { text: 'Who', role: 'object', turkishText: 'Kim' },
            { text: 'is', role: 'verb', turkishText: 'var' },
            { text: 'he', role: 'subject', turkishText: 'o' },
          ],
        },
        {
          english: '3. Where is Mr Bilir?',
          turkish: '3. Bay Bilir nerede?',
          words: [
            { text: 'Where', role: 'object', turkishText: 'Nerede' },
            { text: 'is', role: 'verb', turkishText: 'var' },
            { text: 'Mr Bilir', role: 'subject', turkishText: 'Bay Bilir' },
          ],
        },
        {
          english: '4. Where are they?',
          turkish: '4. Onlar nerede?',
          words: [
            { text: 'Where', role: 'object', turkishText: 'Nerede' },
            { text: 'are', role: 'verb', turkishText: 'var' },
            { text: 'they', role: 'subject', turkishText: 'onlar' },
          ],
        },
      ],
    },
    {
      pageNumber: 21,
      imageUrl: '/images/stories/story1/book 1-21.png',
      sentences: [
        {
          english: 'B) Choose and write.',
          turkish: 'B) Seç ve yaz.',
          words: [
            { text: 'Choose', role: 'verb', turkishText: 'Seç' },
            { text: 'write', role: 'verb', turkishText: 'yaz' },
          ],
        },
        {
          english: 'REFERENCES',
          turkish: 'KAYNAKLAR',
          words: [
            { text: 'REFERENCES', role: 'other', turkishText: 'KAYNAKLAR' },
          ],
        },
      ],
    },
    {
      pageNumber: 22,
      imageUrl: '/images/stories/story1/book 1-22.png',
      sentences: [],
    },
  ],
};

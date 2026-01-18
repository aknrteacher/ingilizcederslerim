// Story data for "The Kind Cat" - English Year 2 Book 2

import type { Story } from './types';

export const story2: Story = {
  id: 'story2',
  title: 'The Kind Cat',
  titleTurkish: 'Nazik Kedi',
  description: 'A story about respect and kindness featuring Mrs Kaya and her students.',
  descriptionTurkish: 'Bayan Kaya ve öğrencilerinin yer aldığı saygı ve nezaket hakkında bir hikaye.',
  thumbnailUrl: '/images/stories/story2/thumbnail.png',
  audioUrl: '/sounds/stories/story2.mp3',
  pages: [
    {
      pageNumber: 1,
      imageUrl: '/images/stories/story2/book 2-01.png',
      audioStartTime: 0.00,
      audioEndTime: 5.08,
      sentences: [
        {
          english: 'English',
          turkish: 'İngilizce',
          words: [
            { text: 'English', role: 'subject', turkishText: 'İngilizce' },
          ],
        },
        {
          english: 'Year 2',
          turkish: '2. Sınıf',
          words: [
            { text: 'Year 2', role: 'subject', turkishText: '2. Sınıf' },
          ],
        },
        {
          english: 'Book 2',
          turkish: 'Kitap 2',
          words: [
            { text: 'Book 2', role: 'subject', turkishText: 'Kitap 2' },
          ],
        },
        {
          english: 'The Kind Cat',
          turkish: 'Nazik Kedi',
          words: [
            { text: 'The Kind Cat', role: 'subject', turkishText: 'Nazik Kedi' },
          ],
        },
      ],
    },
    {
      pageNumber: 2,
      imageUrl: '/images/stories/story2/book 2-02.png',
      audioStartTime: 5.08,
      audioEndTime: 11.00,
      sentences: [
        {
          english: 'English Year 2 Book 2',
          turkish: 'İngilizce 2. Sınıf Kitap 2',
          words: [
            { text: 'English Year 2 Book 2', role: 'subject', turkishText: 'İngilizce 2. Sınıf Kitap 2' },
          ],
        },
        {
          english: 'The Kind Cat',
          turkish: 'Nazik Kedi',
          words: [
            { text: 'The Kind Cat', role: 'subject', turkishText: 'Nazik Kedi' },
          ],
        },
        {
          english: 'Respect & Kindness',
          turkish: 'Saygı ve Nezaket',
          words: [
            { text: 'Respect', role: 'subject', turkishText: 'Saygı' },
            { text: '&', role: 'other', turkishText: 've' },
            { text: 'Kindness', role: 'subject', turkishText: 'Nezaket' },
          ],
        },
      ],
    },
    {
      pageNumber: 3,
      imageUrl: '/images/stories/story2/book 2-03.png',
      audioStartTime: 11.00,
      audioEndTime: 12.50,
      sentences: [],
    },
    {
      pageNumber: 4,
      imageUrl: '/images/stories/story2/book 2-04.png',
      audioStartTime: 12.50,
      audioEndTime: 18.30,
      sentences: [
        {
          english: 'Teacher: Good morning, class!',
          turkish: 'Öğretmen: Günaydın sınıf!',
          words: [
            { text: 'Teacher', role: 'subject', turkishText: 'Öğretmen' },
            { text: 'Good morning', role: 'other', turkishText: 'Günaydın' },
            { text: 'class', role: 'object', turkishText: 'sınıf' },
          ],
        },
        {
          english: 'All the students: Good morning, Mrs Kaya!',
          turkish: 'Tüm öğrenciler: Günaydın, Bayan Kaya!',
          words: [
            { text: 'All the students', role: 'subject', turkishText: 'Tüm öğrenciler' },
            { text: 'Good morning', role: 'other', turkishText: 'Günaydın' },
            { text: 'Mrs Kaya', role: 'object', turkishText: 'Bayan Kaya' },
          ],
        },
      ],
    },
    {
      pageNumber: 5,
      imageUrl: '/images/stories/story2/book 2-05.png',
      audioStartTime: 18.30,
      audioEndTime: 38.00,
      sentences: [
        {
          english: 'Teacher: Let\'s start our lesson. Open your books, please.',
          turkish: 'Öğretmen: Dersimize başlayalım. Lütfen kitaplarınızı açın.',
          words: [
            { text: 'Teacher', role: 'subject', turkishText: 'Öğretmen' },
            { text: 'Let\'s start', role: 'verb', turkishText: 'başlayalım' },
            { text: 'our lesson', role: 'object', turkishText: 'dersimiz' },
            { text: 'Open', role: 'verb', turkishText: 'açın' },
            { text: 'your books', role: 'object', turkishText: 'kitaplarınızı' },
          ],
        },
        {
          english: 'Selin: Is it the red book or the blue book, Mrs Kaya?',
          turkish: 'Selin: Kırmızı kitap mı yoksa mavi kitap mı, Bayan Kaya?',
          words: [
            { text: 'Selin', role: 'subject', turkishText: 'Selin' },
            { text: 'Is it', role: 'verb', turkishText: 'var mı' },
            { text: 'the red book', role: 'object', turkishText: 'kırmızı kitap' },
            { text: 'or', role: 'other', turkishText: 'yoksa' },
            { text: 'the blue book', role: 'object', turkishText: 'mavi kitap' },
            { text: 'Mrs Kaya', role: 'object', turkishText: 'Bayan Kaya' },
          ],
        },
        {
          english: 'Teacher: The red book, Selin.',
          turkish: 'Öğretmen: Kırmızı kitap, Selin.',
          words: [
            { text: 'Teacher', role: 'subject', turkishText: 'Öğretmen' },
            { text: 'The red book', role: 'object', turkishText: 'Kırmızı kitap' },
            { text: 'Selin', role: 'object', turkishText: 'Selin' },
          ],
        },
        {
          english: 'Teacher: Doruk, where are your books? Put them on your desk, please.',
          turkish: 'Öğretmen: Doruk, kitapların nerede? Lütfen onları masana koy.',
          words: [
            { text: 'Teacher', role: 'subject', turkishText: 'Öğretmen' },
            { text: 'Doruk', role: 'object', turkishText: 'Doruk' },
            { text: 'where', role: 'object', turkishText: 'nerede' },
            { text: 'are', role: 'verb', turkishText: 'var' },
            { text: 'your books', role: 'object', turkishText: 'kitapların' },
            { text: 'Put', role: 'verb', turkishText: 'koy' },
            { text: 'on your desk', role: 'object', turkishText: 'masana' },
          ],
        },
        {
          english: 'Doruk: Okay, Mrs Kaya.',
          turkish: 'Doruk: Tamam, Bayan Kaya.',
          words: [
            { text: 'Doruk', role: 'subject', turkishText: 'Doruk' },
            { text: 'Okay', role: 'other', turkishText: 'Tamam' },
            { text: 'Mrs Kaya', role: 'object', turkishText: 'Bayan Kaya' },
          ],
        },
      ],
    },
    {
      pageNumber: 6,
      imageUrl: '/images/stories/story2/book 2-06.png',
      audioStartTime: 38.00,
      audioEndTime: 61.50,
      sentences: [
        {
          english: 'Leyla: Mrs Kaya, my notebooks, books and pencil case are on my desk.',
          turkish: 'Leyla: Bayan Kaya, defterlerim, kitaplarım ve kalem kutum masamda.',
          words: [
            { text: 'Leyla', role: 'subject', turkishText: 'Leyla' },
            { text: 'Mrs Kaya', role: 'object', turkishText: 'Bayan Kaya' },
            { text: 'my notebooks', role: 'subject', turkishText: 'defterlerim' },
            { text: 'books', role: 'subject', turkishText: 'kitaplarım' },
            { text: 'pencil case', role: 'subject', turkishText: 'kalem kutum' },
            { text: 'are', role: 'verb', turkishText: 'var' },
            { text: 'on my desk', role: 'object', turkishText: 'masamda' },
          ],
        },
        {
          english: 'Teacher: Well done, Leyla!',
          turkish: 'Öğretmen: Aferin, Leyla!',
          words: [
            { text: 'Teacher', role: 'subject', turkishText: 'Öğretmen' },
            { text: 'Well done', role: 'other', turkishText: 'Aferin' },
            { text: 'Leyla', role: 'object', turkishText: 'Leyla' },
          ],
        },
        {
          english: 'Mete: I can\'t find the page.',
          turkish: 'Mete: Sayfayı bulamıyorum.',
          words: [
            { text: 'Mete', role: 'subject', turkishText: 'Mete' },
            { text: 'I', role: 'subject', turkishText: 'Ben' },
            { text: 'can\'t find', role: 'verb', turkishText: 'bulamıyorum' },
            { text: 'the page', role: 'object', turkishText: 'sayfayı' },
          ],
        },
        {
          english: 'Doruk: I can help you Mete. Here it is.',
          turkish: 'Doruk: Sana yardım edebilirim Mete. İşte burada.',
          words: [
            { text: 'Doruk', role: 'subject', turkishText: 'Doruk' },
            { text: 'I', role: 'subject', turkishText: 'Ben' },
            { text: 'can help', role: 'verb', turkishText: 'yardım edebilirim' },
            { text: 'you', role: 'object', turkishText: 'sana' },
            { text: 'Mete', role: 'object', turkishText: 'Mete' },
            { text: 'Here it is', role: 'other', turkishText: 'İşte burada' },
          ],
        },
        {
          english: 'Mete: Thank you, Doruk.',
          turkish: 'Mete: Teşekkür ederim, Doruk.',
          words: [
            { text: 'Mete', role: 'subject', turkishText: 'Mete' },
            { text: 'Thank you', role: 'verb', turkishText: 'Teşekkür ederim' },
            { text: 'Doruk', role: 'object', turkishText: 'Doruk' },
          ],
        },
        {
          english: 'Doruk: You\'re welcome, Mete.',
          turkish: 'Doruk: Rica ederim, Mete.',
          words: [
            { text: 'Doruk', role: 'subject', turkishText: 'Doruk' },
            { text: 'You\'re welcome', role: 'verb', turkishText: 'Rica ederim' },
            { text: 'Mete', role: 'object', turkishText: 'Mete' },
          ],
        },
        {
          english: 'Teacher: Doruk, thank you for helping your friend. You are very kind.',
          turkish: 'Öğretmen: Doruk, arkadaşına yardım ettiğin için teşekkür ederim. Çok naziksin.',
          words: [
            { text: 'Teacher', role: 'subject', turkishText: 'Öğretmen' },
            { text: 'Doruk', role: 'object', turkishText: 'Doruk' },
            { text: 'thank you', role: 'verb', turkishText: 'teşekkür ederim' },
            { text: 'for helping', role: 'object', turkishText: 'yardım ettiğin için' },
            { text: 'your friend', role: 'object', turkishText: 'arkadaşına' },
            { text: 'You', role: 'subject', turkishText: 'Sen' },
            { text: 'are', role: 'verb', turkishText: 'var' },
            { text: 'very kind', role: 'adjective', turkishText: 'çok nazik' },
          ],
        },
      ],
    },
    {
      pageNumber: 7,
      imageUrl: '/images/stories/story2/book 2-07.png',
      audioStartTime: 61.50,
      audioEndTime: 65.30,
      sentences: [
        {
          english: 'Beep beep! Kind! Kind! Kind!',
          turkish: 'Bip bip! Nazik! Nazik! Nazik!',
          words: [
            { text: 'Beep beep', role: 'other', turkishText: 'Bip bip' },
            { text: 'Kind', role: 'adjective', turkishText: 'Nazik' },
          ],
        },
      ],
    },
    {
      pageNumber: 8,
      imageUrl: '/images/stories/story2/book 2-08.png',
      audioStartTime: 65.30,
      audioEndTime: 73.71,
      sentences: [
        {
          english: 'Children: Wow!',
          turkish: 'Çocuklar: Vay be!',
          words: [
            { text: 'Children', role: 'subject', turkishText: 'Çocuklar' },
            { text: 'Wow', role: 'other', turkishText: 'Vay be' },
          ],
        },
        {
          english: 'Doruk: What is it, Mrs Kaya?',
          turkish: 'Doruk: Bu nedir, Bayan Kaya?',
          words: [
            { text: 'Doruk', role: 'subject', turkishText: 'Doruk' },
            { text: 'What', role: 'object', turkishText: 'Ne' },
            { text: 'is it', role: 'verb', turkishText: 'var' },
            { text: 'Mrs Kaya', role: 'object', turkishText: 'Bayan Kaya' },
          ],
        },
        {
          english: 'Teacher: Our computer! Look! A dancing cat!',
          turkish: 'Öğretmen: Bilgisayarımız! Bak! Dans eden bir kedi!',
          words: [
            { text: 'Teacher', role: 'subject', turkishText: 'Öğretmen' },
            { text: 'Our computer', role: 'subject', turkishText: 'Bilgisayarımız' },
            { text: 'Look', role: 'verb', turkishText: 'Bak' },
            { text: 'A dancing cat', role: 'object', turkishText: 'Dans eden bir kedi' },
          ],
        },
      ],
    },
    {
      pageNumber: 9,
      imageUrl: '/images/stories/story2/book 2-09.png',
      audioStartTime: 73.71,
      audioEndTime: 78.50,
      sentences: [
        {
          english: 'Mete: Cool, a dancing cat! Let\'s have a look!',
          turkish: 'Mete: Harika, dans eden bir kedi! Bir bakalım!',
          words: [
            { text: 'Mete', role: 'subject', turkishText: 'Mete' },
            { text: 'Cool', role: 'adjective', turkishText: 'Harika' },
            { text: 'a dancing cat', role: 'object', turkishText: 'dans eden bir kedi' },
            { text: 'Let\'s have a look', role: 'verb', turkishText: 'bir bakalım' },
          ],
        },
      ],
    },
    {
      pageNumber: 10,
      imageUrl: '/images/stories/story2/book 2-10.png',
      audioStartTime: 78.50,
      audioEndTime: 86.62,
      sentences: [
        {
          english: 'Cat: Hello, children! I am Kind Cat. I have a quiz show for you.',
          turkish: 'Kedi: Merhaba çocuklar! Ben Nazik Kedi. Sizin için bir bilgi yarışması var.',
          words: [
            { text: 'Cat', role: 'subject', turkishText: 'Kedi' },
            { text: 'Hello, children', role: 'other', turkishText: 'Merhaba çocuklar' },
            { text: 'I', role: 'subject', turkishText: 'Ben' },
            { text: 'am', role: 'verb', turkishText: 'var' },
            { text: 'Kind Cat', role: 'object', turkishText: 'Nazik Kedi' },
            { text: 'I', role: 'subject', turkishText: 'Ben' },
            { text: 'have', role: 'verb', turkishText: 'var' },
            { text: 'a quiz show', role: 'object', turkishText: 'bir bilgi yarışması' },
            { text: 'for you', role: 'object', turkishText: 'sizin için' },
          ],
        },
        {
          english: 'Children: OK, Kind Cat!',
          turkish: 'Çocuklar: Tamam, Nazik Kedi!',
          words: [
            { text: 'Children', role: 'subject', turkishText: 'Çocuklar' },
            { text: 'OK', role: 'other', turkishText: 'Tamam' },
            { text: 'Kind Cat', role: 'object', turkishText: 'Nazik Kedi' },
          ],
        },
      ],
    },
    {
      pageNumber: 11,
      imageUrl: '/images/stories/story2/book 2-11.png',
      audioStartTime: 86.62,
      audioEndTime: 92.60,
      sentences: [
        {
          english: 'Cat: Question one.',
          turkish: 'Kedi: Birinci soru.',
          words: [
            { text: 'Cat', role: 'subject', turkishText: 'Kedi' },
            { text: 'Question one', role: 'object', turkishText: 'Birinci soru' },
          ],
        },
        {
          english: 'You need an eraser. How do you ask your friend?',
          turkish: 'Bir silgiye ihtiyacın var. Arkadaşına nasıl sorarsın?',
          words: [
            { text: 'You', role: 'subject', turkishText: 'Sen' },
            { text: 'need', role: 'verb', turkishText: 'ihtiyacın var' },
            { text: 'an eraser', role: 'object', turkishText: 'bir silgi' },
            { text: 'How', role: 'object', turkishText: 'Nasıl' },
            { text: 'do you ask', role: 'verb', turkishText: 'sorarsın' },
            { text: 'your friend', role: 'object', turkishText: 'arkadaşına' },
          ],
        },
      ],
    },
    {
      pageNumber: 12,
      imageUrl: '/images/stories/story2/book 2-12.png',
      audioStartTime: 92.60,
      audioEndTime: 99.46,
      sentences: [
        {
          english: 'Leyla: Can I have your eraser, please?',
          turkish: 'Leyla: Silginizi alabilir miyim, lütfen?',
          words: [
            { text: 'Leyla', role: 'subject', turkishText: 'Leyla' },
            { text: 'Can I have', role: 'verb', turkishText: 'alabilir miyim' },
            { text: 'your eraser', role: 'object', turkishText: 'silginizi' },
            { text: 'please', role: 'other', turkishText: 'lütfen' },
          ],
        },
        {
          english: 'Cat: Very good! You are polite.',
          turkish: 'Kedi: Çok iyi! Sen naziksin.',
          words: [
            { text: 'Cat', role: 'subject', turkishText: 'Kedi' },
            { text: 'Very good', role: 'adjective', turkishText: 'Çok iyi' },
            { text: 'You', role: 'subject', turkishText: 'Sen' },
            { text: 'are', role: 'verb', turkishText: 'var' },
            { text: 'polite', role: 'adjective', turkishText: 'nazik' },
          ],
        },
      ],
    },
    {
      pageNumber: 13,
      imageUrl: '/images/stories/story2/book 2-13.png',
      audioStartTime: 99.46,
      audioEndTime: 111.90,
      sentences: [
        {
          english: 'Cat: Question two.',
          turkish: 'Kedi: İkinci soru.',
          words: [
            { text: 'Cat', role: 'subject', turkishText: 'Kedi' },
            { text: 'Question two', role: 'object', turkishText: 'İkinci soru' },
          ],
        },
        {
          english: 'You are late to class. What do you say?',
          turkish: 'Sınıfa geç kaldın. Ne dersin?',
          words: [
            { text: 'You', role: 'subject', turkishText: 'Sen' },
            { text: 'are late', role: 'verb', turkishText: 'geç kaldın' },
            { text: 'to class', role: 'object', turkishText: 'sınıfa' },
            { text: 'What', role: 'object', turkishText: 'Ne' },
            { text: 'do you say', role: 'verb', turkishText: 'dersin' },
          ],
        },
        {
          english: 'Selin: I\'m sorry, Mrs Kaya. I\'m late.',
          turkish: 'Selin: Özür dilerim, Bayan Kaya. Geç kaldım.',
          words: [
            { text: 'Selin', role: 'subject', turkishText: 'Selin' },
            { text: 'I\'m sorry', role: 'verb', turkishText: 'Özür dilerim' },
            { text: 'Mrs Kaya', role: 'object', turkishText: 'Bayan Kaya' },
            { text: 'I', role: 'subject', turkishText: 'Ben' },
            { text: '\'m late', role: 'verb', turkishText: 'geç kaldım' },
          ],
        },
        {
          english: 'Cat: Wonderful! You are very kind.',
          turkish: 'Kedi: Harika! Sen çok naziksin.',
          words: [
            { text: 'Cat', role: 'subject', turkishText: 'Kedi' },
            { text: 'Wonderful', role: 'adjective', turkishText: 'Harika' },
            { text: 'You', role: 'subject', turkishText: 'Sen' },
            { text: 'are', role: 'verb', turkishText: 'var' },
            { text: 'very kind', role: 'adjective', turkishText: 'çok nazik' },
          ],
        },
      ],
    },
    {
      pageNumber: 14,
      imageUrl: '/images/stories/story2/book 2-14.png',
      audioStartTime: 111.90,
      audioEndTime: 124.44,
      sentences: [
        {
          english: 'Cat: Question three.',
          turkish: 'Kedi: Üçüncü soru.',
          words: [
            { text: 'Cat', role: 'subject', turkishText: 'Kedi' },
            { text: 'Question three', role: 'object', turkishText: 'Üçüncü soru' },
          ],
        },
        {
          english: 'You want to go to the toilet. What do you say?',
          turkish: 'Tuvalete gitmek istiyorsun. Ne dersin?',
          words: [
            { text: 'You', role: 'subject', turkishText: 'Sen' },
            { text: 'want', role: 'verb', turkishText: 'istiyorsun' },
            { text: 'to go', role: 'verb', turkishText: 'gitmek' },
            { text: 'to the toilet', role: 'object', turkishText: 'tuvalete' },
            { text: 'What', role: 'object', turkishText: 'Ne' },
            { text: 'do you say', role: 'verb', turkishText: 'dersin' },
          ],
        },
        {
          english: 'Mete: Can I go to the toilet, please?',
          turkish: 'Mete: Tuvalete gidebilir miyim, lütfen?',
          words: [
            { text: 'Mete', role: 'subject', turkishText: 'Mete' },
            { text: 'Can I go', role: 'verb', turkishText: 'gidebilir miyim' },
            { text: 'to the toilet', role: 'object', turkishText: 'tuvalete' },
            { text: 'please', role: 'other', turkishText: 'lütfen' },
          ],
        },
        {
          english: 'Cat: Excellent! You are a polite boy.',
          turkish: 'Kedi: Mükemmel! Sen nazik bir çocuksun.',
          words: [
            { text: 'Cat', role: 'subject', turkishText: 'Kedi' },
            { text: 'Excellent', role: 'adjective', turkishText: 'Mükemmel' },
            { text: 'You', role: 'subject', turkishText: 'Sen' },
            { text: 'are', role: 'verb', turkishText: 'var' },
            { text: 'a polite boy', role: 'object', turkishText: 'nazik bir çocuk' },
          ],
        },
      ],
    },
    {
      pageNumber: 15,
      imageUrl: '/images/stories/story2/book 2-15.png',
      audioStartTime: 124.44,
      audioEndTime: 131.01,
      sentences: [
        {
          english: 'Cat: Last question.',
          turkish: 'Kedi: Son soru.',
          words: [
            { text: 'Cat', role: 'subject', turkishText: 'Kedi' },
            { text: 'Last question', role: 'object', turkishText: 'Son soru' },
          ],
        },
        {
          english: 'Your teacher asks a question. What do you do?',
          turkish: 'Öğretmenin bir soru soruyor. Ne yaparsın?',
          words: [
            { text: 'Your teacher', role: 'subject', turkishText: 'Öğretmenin' },
            { text: 'asks', role: 'verb', turkishText: 'soruyor' },
            { text: 'a question', role: 'object', turkishText: 'bir soru' },
            { text: 'What', role: 'object', turkishText: 'Ne' },
            { text: 'do you do', role: 'verb', turkishText: 'yaparsın' },
          ],
        },
      ],
    },
    {
      pageNumber: 16,
      imageUrl: '/images/stories/story2/book 2-16.png',
      audioStartTime: 131.01,
      audioEndTime: 142.25,
      sentences: [
        {
          english: 'Leyla: I raise my hand and answer.',
          turkish: 'Leyla: Elimı kaldırırım ve cevaplarım.',
          words: [
            { text: 'Leyla', role: 'subject', turkishText: 'Leyla' },
            { text: 'I', role: 'subject', turkishText: 'Ben' },
            { text: 'raise', role: 'verb', turkishText: 'kaldırırım' },
            { text: 'my hand', role: 'object', turkishText: 'elimı' },
            { text: 'answer', role: 'verb', turkishText: 'cevaplarım' },
          ],
        },
        {
          english: 'Cat: Well done, kids! You are polite and kind.',
          turkish: 'Kedi: Aferin çocuklar! Siz nazik ve kibarısınız.',
          words: [
            { text: 'Cat', role: 'subject', turkishText: 'Kedi' },
            { text: 'Well done', role: 'other', turkishText: 'Aferin' },
            { text: 'kids', role: 'object', turkishText: 'çocuklar' },
            { text: 'You', role: 'subject', turkishText: 'Siz' },
            { text: 'are', role: 'verb', turkishText: 'var' },
            { text: 'polite and kind', role: 'adjective', turkishText: 'nazik ve kibar' },
          ],
        },
        {
          english: 'Teacher: Excellent work, children!',
          turkish: 'Öğretmen: Mükemmel iş, çocuklar!',
          words: [
            { text: 'Teacher', role: 'subject', turkishText: 'Öğretmen' },
            { text: 'Excellent work', role: 'adjective', turkishText: 'Mükemmel iş' },
            { text: 'children', role: 'object', turkishText: 'çocuklar' },
          ],
        },
      ],
    },
    {
      pageNumber: 17,
      imageUrl: '/images/stories/story2/book 2-17.png',
      audioStartTime: 142.25,
      audioEndTime: 150.09,
      sentences: [
        {
          english: 'Cat: Here is your kindness cup!',
          turkish: 'Kedi: İşte nezaket kupası!',
          words: [
            { text: 'Cat', role: 'subject', turkishText: 'Kedi' },
            { text: 'Here is', role: 'other', turkishText: 'İşte' },
            { text: 'your kindness cup', role: 'object', turkishText: 'nezaket kupası' },
          ],
        },
        {
          english: 'Goodbye, polite friends!',
          turkish: 'Hoşça kalın, nazik arkadaşlar!',
          words: [
            { text: 'Goodbye', role: 'other', turkishText: 'Hoşça kalın' },
            { text: 'polite friends', role: 'object', turkishText: 'nazik arkadaşlar' },
          ],
        },
        {
          english: 'Children: Thank you, Kind Cat!',
          turkish: 'Çocuklar: Teşekkür ederiz, Nazik Kedi!',
          words: [
            { text: 'Children', role: 'subject', turkishText: 'Çocuklar' },
            { text: 'Thank you', role: 'verb', turkishText: 'Teşekkür ederiz' },
            { text: 'Kind Cat', role: 'object', turkishText: 'Nazik Kedi' },
          ],
        },
      ],
    },
    {
      pageNumber: 18,
      imageUrl: '/images/stories/story2/book 2-18.png',
      audioStartTime: 150.09,
      audioEndTime: 152.40,
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
      imageUrl: '/images/stories/story2/book 2-19.png',
      audioStartTime: 152.40,
      audioEndTime: 154.32,
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
      imageUrl: '/images/stories/story2/book 2-20.png',
      audioStartTime: 154.32,
      audioEndTime: 165.70,
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
          english: 'She is Mrs Kaya.',
          turkish: 'O Bayan Kaya.',
          words: [
            { text: 'She', role: 'subject', turkishText: 'O' },
            { text: 'is', role: 'verb', turkishText: 'var' },
            { text: 'Mrs Kaya', role: 'object', turkishText: 'Bayan Kaya' },
          ],
        },
        {
          english: '2. What is it?',
          turkish: '2. Bu nedir?',
          words: [
            { text: 'What', role: 'object', turkishText: 'Ne' },
            { text: 'is it', role: 'verb', turkishText: 'var' },
          ],
        },
        {
          english: '3. What colour is it?',
          turkish: '3. Rengi ne?',
          words: [
            { text: 'What colour', role: 'object', turkishText: 'Ne renk' },
            { text: 'is it', role: 'verb', turkishText: 'var' },
          ],
        },
        {
          english: '4. What is it?',
          turkish: '4. Bu nedir?',
          words: [
            { text: 'What', role: 'object', turkishText: 'Ne' },
            { text: 'is it', role: 'verb', turkishText: 'var' },
          ],
        },
      ],
    },
    {
      pageNumber: 21,
      imageUrl: '/images/stories/story2/book 2-21.png',
      audioStartTime: 165.70,
      audioEndTime: 200, // End of audio (adjust if audio is longer)
      sentences: [
        {
          english: 'B) Read and write True(T) or False(F).',
          turkish: 'B) Oku ve Doğru(D) veya Yanlış(Y) yaz.',
          words: [
            { text: 'Read', role: 'verb', turkishText: 'Oku' },
            { text: 'write', role: 'verb', turkishText: 'yaz' },
            { text: 'True', role: 'other', turkishText: 'Doğru' },
            { text: 'False', role: 'other', turkishText: 'Yanlış' },
          ],
        },
        {
          english: '1. They open the blue books. False',
          turkish: '1. Mavi kitapları açıyorlar. Yanlış',
          words: [
            { text: 'They', role: 'subject', turkishText: 'Onlar' },
            { text: 'open', role: 'verb', turkishText: 'açıyorlar' },
            { text: 'the blue books', role: 'object', turkishText: 'mavi kitapları' },
            { text: 'False', role: 'other', turkishText: 'Yanlış' },
          ],
        },
        {
          english: '2. Leyla\'s notebooks, books, pencil case are on her desk.',
          turkish: '2. Leyla\'nın defterleri, kitapları, kalem kutusu masasında.',
          words: [
            { text: 'Leyla\'s notebooks', role: 'subject', turkishText: 'Leyla\'nın defterleri' },
            { text: 'books', role: 'subject', turkishText: 'kitapları' },
            { text: 'pencil case', role: 'subject', turkishText: 'kalem kutusu' },
            { text: 'are', role: 'verb', turkishText: 'var' },
            { text: 'on her desk', role: 'object', turkishText: 'masasında' },
          ],
        },
        {
          english: '3. The pupils see a dog on the computer.',
          turkish: '3. Öğrenciler bilgisayarda bir köpek görüyorlar.',
          words: [
            { text: 'The pupils', role: 'subject', turkishText: 'Öğrenciler' },
            { text: 'see', role: 'verb', turkishText: 'görüyorlar' },
            { text: 'a dog', role: 'object', turkishText: 'bir köpek' },
            { text: 'on the computer', role: 'object', turkishText: 'bilgisayarda' },
          ],
        },
        {
          english: '4. The cat gives them a kindness cup.',
          turkish: '4. Kedi onlara bir nezaket kupası veriyor.',
          words: [
            { text: 'The cat', role: 'subject', turkishText: 'Kedi' },
            { text: 'gives', role: 'verb', turkishText: 'veriyor' },
            { text: 'them', role: 'object', turkishText: 'onlara' },
            { text: 'a kindness cup', role: 'object', turkishText: 'bir nezaket kupası' },
          ],
        },
        {
          english: 'REFERENCES',
          turkish: 'KAYNAKLAR',
          words: [
            { text: 'REFERENCES', role: 'other', turkishText: 'KAYNAKLAR' },
          ],
        },
        {
          english: 'Answer Key',
          turkish: 'Cevap Anahtarı',
          words: [
            { text: 'Answer Key', role: 'other', turkishText: 'Cevap Anahtarı' },
          ],
        },
        {
          english: 'VISUAL AND GENERAL WEB REFERENCES',
          turkish: 'GÖRSEL VE GENEL WEB KAYNAKLARI',
          words: [
            { text: 'VISUAL AND GENERAL WEB REFERENCES', role: 'other', turkishText: 'GÖRSEL VE GENEL WEB KAYNAKLARI' },
          ],
        },
        {
          english: 'Artificial intelligence has been used in the visuals of the material.',
          turkish: 'Materyalin görsellerinde yapay zeka kullanılmıştır.',
          words: [
            { text: 'Artificial intelligence', role: 'subject', turkishText: 'Yapay zeka' },
            { text: 'has been used', role: 'verb', turkishText: 'kullanılmıştır' },
            { text: 'in the visuals', role: 'object', turkishText: 'görsellerinde' },
            { text: 'of the material', role: 'object', turkishText: 'materyalin' },
          ],
        },
      ],
    },
  ],
};

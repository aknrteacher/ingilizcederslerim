document.addEventListener('DOMContentLoaded', () => {
    // Get HTML elements
    const flashcard = document.getElementById('flashcard');
    const wordEl = document.getElementById('word');
    const imageEl = document.getElementById('image');
    const pronunciationBtn = document.getElementById('pronunciation-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const numberReelContainer = document.querySelector('.number-reel-container');
    const numberReel = document.getElementById('number-reel');
    const flipBtn = document.getElementById('flip-btn');
    const imageOverlay = document.getElementById('image-overlay');
    const zoomedImage = document.getElementById('zoomed-image');

    // --- MANAGE YOUR IMAGES HERE ---
    const imageFiles = [
'hello.png','goodbye.png','how are you.png','I m fine.png','school.png','classroom.png','library.png','canteen.png','sports hall.png','playground.png','garden.png','teacher.png','student.png','girl.png','boy.png','friend.png','day.png','week.png','Monday.png','Tuesday.png','Wednesday.png','Thursday.png','Friday.png','Saturday.png','Sunday.png','what.png','where.png','who.png'

];
    const vocabulary = imageFiles.map(filename => ({ word: filename.substring(0, filename.lastIndexOf('.')), imageUrl: `images/${filename}` }));
    let currentCardIndex = 0;

    // --- NEW: Separate Audio and Visual Reaction Logic ---
    const reactionEmojis = ['👍', '🔥', '💯', '✅', '🤩', '🚀', '✨', '🧠', '💡'];
    const EMOJI_CHANCE = 0.5; // 50% chance for an emoji
    const SOUND_CHANCE = 0.25; // 25% chance for a sound

    // --- IMPORTANT: UPDATE WITH YOUR FILENAMES ---
    const reactionSounds = [
        'sounds/yay.mp3',
        'sounds/woosh.mp3',
	'sounds/tennis.mp3',
        'sounds/tap.mp3',
        'sounds/tada.mp3',
        'sounds/sword.mp3',
	'sounds/swoosh.mp3',
        'sounds/switch2.mp3',
        'sounds/switch.mp3',
        'sounds/swipe.mp3',
	'sounds/sparkle.mp3',
        'sounds/shutter.mp3',
        'sounds/select2.mp3',
	'sounds/select.mp3',
        'sounds/rclick.mp3',
        'sounds/radio.mp3',
        'sounds/pop.mp3',
	'sounds/pick.mp3',
        'sounds/pen.mp3',
        'sounds/notice.mp3',
        'sounds/multipop.mp3',
	'sounds/mouse.mp3',
        'sounds/low.mp3',
        'sounds/levelup.mp3',
        'sounds/level.mp3',
        'sounds/keyboard.mp3',
        'sounds/interface.mp3',
        'sounds/hit.mp3',
        'sounds/game.mp3',
        'sounds/flip.mp3',
        'sounds/fist.mp3',
        'sounds/fall.mp3',
        'sounds/error.mp3',
        'sounds/eating.mp3',
        'sounds/click6.mp3',
        'sounds/click5.mp3',
        'sounds/click3.mp3',
        'sounds/click2.mp3',
        'sounds/click1.mp3',
        'sounds/cash.mp3',
        'sounds/button.mp3',
        'sounds/bubble.mp3',
        'sounds/blip.mp3',
        'sounds/bell.mp3',
        'sounds/arcade.mp3',
        'sounds/amongus.mp3'
    ];

    // This function only creates the visual emoji
    function spawnFlyingEmoji(event) {
        if (Math.random() > EMOJI_CHANCE) {
            return;
        }
        const reaction = document.createElement('span');
        reaction.classList.add('flying-reaction');
        reaction.textContent = reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)];
        reaction.style.left = `${event.pageX}px`;
        reaction.style.top = `${event.pageY}px`;
        document.body.appendChild(reaction);
        reaction.addEventListener('animationend', () => {
            reaction.remove();
        });
    }

    // This function only plays the random sound
    function playRandomSound() {
        if (reactionSounds.length === 0 || Math.random() > SOUND_CHANCE) {
            return;
        }
        const soundToPlay = reactionSounds[Math.floor(Math.random() * reactionSounds.length)];
        const audio = new Audio(soundToPlay);
        audio.play().catch(e => console.error("Error playing sound:", e));
    }

    // --- Core Functions (no changes needed) ---
    function centerActiveNumber() {
        setTimeout(() => {
            const activeEl = numberReel.querySelector('.active');
            if (activeEl) {
                const containerHeight = numberReelContainer.offsetHeight;
                const scrollTop = activeEl.offsetTop - (containerHeight / 2) + (activeEl.offsetHeight / 2);
                numberReel.style.transform = `translateY(-${scrollTop}px)`;
            }
        }, 0);
    }
    
    function buildNumberReel() {
        numberReel.innerHTML = '';
        if (vocabulary.length === 0) return;
        const windowSize = 2; 
        const start = Math.max(0, currentCardIndex - windowSize);
        const end = Math.min(vocabulary.length - 1, currentCardIndex + windowSize);

        for (let i = start; i <= end; i++) {
            const numberItem = document.createElement('div');
            numberItem.classList.add('number-item');
            numberItem.textContent = i + 1;
            numberItem.dataset.index = i;
            if (i === currentCardIndex) { numberItem.classList.add('active'); }
            
            numberItem.addEventListener('click', (e) => {
                spawnFlyingEmoji(e); // Play visual
                playRandomSound();   // Play audio
                navigateTo(parseInt(e.target.dataset.index));
            });
            numberReel.appendChild(numberItem);
        }
    }

    function updateFlashcard() {
        if (vocabulary.length === 0) {
            wordEl.textContent = 'No Cards';
            imageEl.style.display = 'none';
        } else {
            imageEl.style.display = 'block';
            const currentCard = vocabulary[currentCardIndex];
            wordEl.textContent = currentCard.word;
            imageEl.src = currentCard.imageUrl;
            imageEl.alt = currentCard.word;
            flashcard.classList.remove('flipped');
        }
        buildNumberReel();
        centerActiveNumber();
    }
    
    function navigateTo(newIndex) {
        const totalCards = vocabulary.length;
        if (totalCards === 0) return;

        if (currentCardIndex === totalCards - 1 && newIndex === 0 && typeof confetti === 'function') {
            confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
        }

        const isLooping = (currentCardIndex === totalCards - 1 && newIndex === 0) || (currentCardIndex === 0 && newIndex === totalCards - 1);
        const isJumping = Math.abs(newIndex - currentCardIndex) > 1;
        if (isLooping || isJumping) {
            numberReel.classList.add('no-transition');
        }
        currentCardIndex = newIndex;
        updateFlashcard();
        setTimeout(() => numberReel.classList.remove('no-transition'), 50);
    }

    // --- UPDATED Event Listeners ---
    flipBtn.addEventListener('click', (e) => {
        spawnFlyingEmoji(e);
        playRandomSound();
        flashcard.classList.toggle('flipped');
    });

    imageEl.addEventListener('click', () => {
        zoomedImage.src = imageEl.src;
        imageOverlay.classList.add('visible');
    });

    imageOverlay.addEventListener('click', () => {
        imageOverlay.classList.remove('visible');
    });
    
    pronunciationBtn.addEventListener('click', (e) => {
        spawnFlyingEmoji(e); // Only spawn the visual emoji
        // NO call to playRandomSound() here
        e.stopPropagation();
        const utterance = new SpeechSynthesisUtterance(wordEl.textContent);
        speechSynthesis.speak(utterance);
    });

    nextBtn.addEventListener('click', (e) => {
        spawnFlyingEmoji(e);
        playRandomSound();
        navigateTo((currentCardIndex + 1) % vocabulary.length);
    });

    prevBtn.addEventListener('click', (e) => {
        spawnFlyingEmoji(e);
        playRandomSound();
        navigateTo((currentCardIndex - 1 + vocabulary.length) % vocabulary.length);
    });

    // Initial load
    updateFlashcard();
});
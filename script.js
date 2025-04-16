    // Game configuration
    const config = {
      totalPairs: 8,
      images: [
        'images/chrome.png',
        'images/github.png',
        'images/javascript.png',
        'images/linux.png',
        'images/mysql.png',
        'images/open_source.png',
        'images/react.png',
        'images/ubuntu.png'
      ]
    };
    
    // Game state
    let state = {
      cards: [],
      flippedCards: [],
      matchedPairs: 0,
      isLocked: false,
      moves: 0,
      gameStarted: false,
      startTime: null,
      timer: null
    };
    
    // DOM Elements
    const gameContainer = document.getElementById('game-container');
    const movesCount = document.getElementById('moves-count');
    const timeElement = document.getElementById('time');
    const resetButton = document.getElementById('reset');
    const gameCompleteScreen = document.getElementById('game-complete');
    const finalMoves = document.getElementById('final-moves');
    const finalTime = document.getElementById('final-time');
    const playAgainButton = document.getElementById('play-again');
    
    // Initialize game
    function initializeGame() {
      resetState();
      const cardPairs = [];
      
      // Create pairs of cards
      for (let i = 0; i < config.totalPairs; i++) {
        const imageIndex = i % config.images.length;
        const cardValue = {
          id: i + 1,
          image: config.images[imageIndex],
          isMatched: false
        };
        
        // Add two of each card
        cardPairs.push({...cardValue});
        cardPairs.push({...cardValue});
      }
      
      // Shuffle cards
      state.cards = shuffleArray(cardPairs);
      
      // Create card elements
      renderCards();
      
      // Reset UI
      movesCount.textContent = state.moves;
      timeElement.textContent = '00:00';
      gameCompleteScreen.classList.remove('show');
    }
    
    // Reset game state
    function resetState() {
      state = {
        cards: [],
        flippedCards: [],
        matchedPairs: 0,
        isLocked: false,
        moves: 0,
        gameStarted: false,
        startTime: null,
        timer: null
      };
      
      if (state.timer) {
        clearInterval(state.timer);
        state.timer = null;
      }
      
      // Clear game container
      gameContainer.innerHTML = '';
    }
    
    // Render cards to the game container
    function renderCards() {
      state.cards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.index = index;
        
        // Card back (showing when card is not flipped)
        const cardBack = document.createElement('div');
        cardBack.classList.add('card-face', 'card-back');
        cardBack.innerHTML = '?';
        
        // Card front (showing when card is flipped)
        const cardFront = document.createElement('div');
        cardFront.classList.add('card-face', 'card-front');
        
        const image = document.createElement('img');
        // In a real implementation, you would replace this with actual image paths
        // The placeholder is just for demonstration
        image.src = card.image;
        image.alt = `Card ${card.id}`;
        
        cardFront.appendChild(image);
        cardElement.appendChild(cardBack);
        cardElement.appendChild(cardFront);
        
        cardElement.addEventListener('click', () => flipCard(index));
        gameContainer.appendChild(cardElement);
      });
    }
    
    // Handle card flip
    function flipCard(index) {
      const card = state.cards[index];
      const cardElement = document.querySelector(`.card[data-index="${index}"]`);
      
      // Don't allow flipping if game is locked, card is already flipped, or already matched
      if (state.isLocked || state.flippedCards.includes(index) || card.isMatched) {
        return;
      }
      
      // Start timer on first card flip
      if (!state.gameStarted) {
        startTimer();
        state.gameStarted = true;
      }
      
      // Flip the card
      cardElement.classList.add('flipped');
      state.flippedCards.push(index);
      
      // Check for match if we have flipped two cards
      if (state.flippedCards.length === 2) {
        state.moves++;
        movesCount.textContent = state.moves;
        
        const [firstIndex, secondIndex] = state.flippedCards;
        const firstCard = state.cards[firstIndex];
        const secondCard = state.cards[secondIndex];
        
        if (firstCard.id === secondCard.id) {
          // We have a match
          handleMatch(firstIndex, secondIndex);
        } else {
          // No match, flip cards back
          handleMismatch(firstIndex, secondIndex);
        }
      }
    }
    
    // Handle matched cards
    function handleMatch(firstIndex, secondIndex) {
      state.cards[firstIndex].isMatched = true;
      state.cards[secondIndex].isMatched = true;
      
      // Add matched class to the cards
      const firstCard = document.querySelector(`.card[data-index="${firstIndex}"]`);
      const secondCard = document.querySelector(`.card[data-index="${secondIndex}"]`);
      
      firstCard.classList.add('matched');
      secondCard.classList.add('matched');
      
      state.matchedPairs++;
      state.flippedCards = [];
      
      // Check if the game is complete
      if (state.matchedPairs === config.totalPairs) {
        setTimeout(() => {
          endGame();
        }, 1000);
      }
    }
    
    // Handle mismatched cards
    function handleMismatch(firstIndex, secondIndex) {
      state.isLocked = true;
      
      // Flip cards back after a short delay
      setTimeout(() => {
        const firstCard = document.querySelector(`.card[data-index="${firstIndex}"]`);
        const secondCard = document.querySelector(`.card[data-index="${secondIndex}"]`);
        
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        
        state.flippedCards = [];
        state.isLocked = false;
      }, 1000);
    }
    
    // End the game
    function endGame() {
      clearInterval(state.timer);
      
      finalMoves.textContent = state.moves;
      finalTime.textContent = timeElement.textContent;
      
      gameCompleteScreen.classList.add('show');
    }
    
    // Shuffle an array (Fisher-Yates algorithm)
    function shuffleArray(array) {
      const newArray = [...array];
      for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
      }
      return newArray;
    }
    
    // Event listeners
    resetButton.addEventListener('click', initializeGame);
    playAgainButton.addEventListener('click', initializeGame);
    
    // Initialize the game when the page loads
    document.addEventListener('DOMContentLoaded', initializeGame);

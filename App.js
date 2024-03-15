import React, { useState } from 'react';
import './App.css';

const url = 'https://quotes-inspirational-quotes-motivational-quotes.p.rapidapi.com/quote?token=ipworld.info';
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'e793d70246mshac8ab796a6b2277p1a4c5ejsn5e422de5ac30',
		'X-RapidAPI-Host': 'quotes-inspirational-quotes-motivational-quotes.p.rapidapi.com'
	}
};

const CARD_VALUES = {
  '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
  'J': 10, 'Q': 10, 'K': 10, 'A': 11
};

function App() {

  const [quote, setQuote] = useState('');

  
  
  const fetchNewQuote = async () => {
    try {
      const response = await fetch(url, options);
      const result = await response.json();
    


      setQuote(result.text);
    } catch (error) {
      console.error(error);
    }
  }



  const [rows, setRows] = useState(8);
  const [bet, setBet] = useState(0);
  const [score, setScore] = useState(0);
  const [totalPoints, setTotalPoints] = useState(100);
  const [gameLog, setGameLog] = useState([]);

  const handleRowChange = (event) => {
    setRows(parseInt(event.target.value));
  };




  const [playerCards, setPlayerCards] = useState([]);
  const [dealerCards, setDealerCards] = useState([]);
  const [playerScore, setPlayerScore] = useState(0);
  const [dealerScore, setDealerScore] = useState(0);
  const [playerMoney, setPlayerMoney] = useState(100);

  const startGame = () => {
    setPlayerScore(0);
    setPlayerCards([]);
    setDealerCards([]);
    dealCardToPlayer();
    dealCardToDealer();
    dealCardToPlayer();
    dealCardToDealer(true);
    setPlayerScore(calculateScore(playerCards));
    setDealerScore(calculateScore(dealerCards));
  };

  const dealCardToPlayer = () => {
    const card = getRandomCard();
    setPlayerCards([...playerCards, card]);
    setPlayerScore(calculateScore([...playerCards, card]));
  };

  const dealCardToDealer = (hideCard = false) => {
    const card = getRandomCard();
    setDealerCards([...dealerCards, { value: card.value, hidden: hideCard }]);
    setDealerScore(calculateScore([...dealerCards, card]));
  };

  const calculateScore = (cards) => {
    let score = cards.reduce((acc, card) => acc + CARD_VALUES[card.value], 0);
    cards.forEach(card => {
      if (card.value === 'A' && score > 21) {
        score -= 10;
      }
    });
    return score;
  };

  const hit = () => {
    dealCardToPlayer();
    if (playerScore > 21) {
      endGame();
    }
  };

  const stay = () => {
    const updatedDealerCards = dealerCards.map(card => ({ ...card, hidden: false }));
    setDealerCards(updatedDealerCards);
    while (dealerScore < playerScore && dealerScore <= 21) {
      dealCardToDealer();
    }
    endGame();
  };

  const endGame = () => {
    let outcome;
    if (playerScore > 21) {
      outcome = 'Player busts. Dealer wins.';
      setPlayerMoney(playerMoney - 10);
    } else if (dealerScore > 21 || playerScore > dealerScore) {
      outcome = 'Player wins!';
      setPlayerMoney(playerMoney + 10);
    } else if (playerScore === dealerScore) {
      outcome = 'It\'s a tie.';
    } else {
      outcome = 'Dealer wins.';
      setPlayerMoney(playerMoney - 10);
    }
    alert(outcome);
  };

  const getRandomCard = () => {
    const values = Object.keys(CARD_VALUES);
    const value = values[Math.floor(Math.random() * values.length)];
    return { value };
  };




  const dropPlinkoChip = () => {
    const randomColumn = Math.floor(Math.random() * (rows + 1));
    const points = Math.pow(2, rows - randomColumn);
    setScore(score + points);
    setTotalPoints(totalPoints - 1);
    setGameLog([...gameLog, `Dropped chip into column ${randomColumn}. Earned ${points} points.`]);
  };

  return (
    <div className="App">
    

     
      <div>
        <h2>Plinko</h2>
        <label>Rows: </label>
        <input type="number" value={rows} onChange={handleRowChange} />
        <p>Score: {score}</p>
        <p>Total Points: {totalPoints}</p>
        <button onClick={dropPlinkoChip}>Drop Plinko Chip</button>
        <div>
          <h3>Game Log</h3>
          <ul>
            {gameLog.map((log, index) => (
              <li key={index}>{log}</li>
            ))}
          </ul>
        </div>
      </div>

      
      



      <div>
        <h2>Blackjack</h2>
        <h2>Player Score: {playerScore}</h2>
        <h2>Dealer Score: {dealerScore}</h2>
        <h2>Player Money: {playerMoney}</h2>
        <button onClick={startGame}>Start Game</button>
        <button onClick={hit}>Hit</button>
        <button onClick={stay}>Stay</button>
      </div>

     

      <div className="cards">
        <h3>Player's Cards</h3>
        {playerCards.map((card, index) => (
          <div key={index} className="card">{card.value}</div>
        ))}
      </div>
      <div className="cards">
        <h3>Dealer's Cards</h3>
        {dealerCards.map((card, index) => (
          <div key={index} className={`card ${card.hidden ? 'hidden' : ''}`}>{card.hidden ? '?' : card.value}</div>
        ))}
      </div>

   
   

      <div>
  
        <p>{quote}</p>
        <button onClick={fetchNewQuote}>I Feel like quitting</button>
      </div>
    </div>
  );
}

export default App;

import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const App = () => {
  const [author, setAuthor] = useState('');
  const [quote, setQuote] = useState('');
  const [quotes, setQuotes] = useState([]);
  const [allAuthors, setAllAuthors] = useState([]);
  const [currentAuthorIndex, setCurrentAuthorIndex] = useState(0);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const response = await fetch('https://random-quote-server-illw.onrender.com/quotes'); // Fetch from your Express server
        const data = await response.json();
        const quotesData = data.quotes;

        setQuotes(quotesData);

        const uniqueAuthors = [...new Set(quotesData.map(quote => quote.author))];
        setAllAuthors(uniqueAuthors);

        // Set a random quote initially
        if (quotesData.length > 0) {
          const randomIndex = Math.floor(Math.random() * quotesData.length);
          setQuote(`${quotesData[randomIndex].quote} --- ${quotesData[randomIndex].author}`);
        }
      } catch (error) {
        console.error('Error fetching quotes:', error);
      }
    };

    fetchQuotes();
  }, []);

  useEffect(() => {
    if (sidebarRef.current) {
      sidebarRef.current.scrollTo({
        top: currentAuthorIndex * 30, 
        behavior: 'smooth',
      });
    }
  }, [currentAuthorIndex]);

  const handleSearch = () => {
    if (author.trim() === '') {
      alert('Please enter an author name.');
      return;
    }

    const filteredQuotes = quotes.filter(quote =>
      quote.author && quote.author.toLowerCase().includes(author.toLowerCase())
    );

    if (filteredQuotes.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
      setQuote(`${filteredQuotes[randomIndex].quote} --- ${filteredQuotes[randomIndex].author}`);
    } else {
      setQuote('No quotes found for this author.');
    }
  };

  const handleAuthorClick = (clickedAuthor) => {
    setAuthor(clickedAuthor);
    handleSearch();
  };

  const handleNextAuthor = () => {
    setCurrentAuthorIndex((prevIndex) => (prevIndex + 1) % allAuthors.length);
  };

  const handlePrevAuthor = () => {
    setCurrentAuthorIndex((prevIndex) => (prevIndex - 1 + allAuthors.length) % allAuthors.length);
  };

  // Today's date 
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="App">
      <header className="App-header">
        <h1>Quote Search</h1>
        <p>Today's Date: {today}</p>
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Enter author name"
        />
        <button onClick={handleSearch}>Search</button>
        {quote && (
          <div className="quote-box">
            <p>{quote}</p>
          </div>
        )}
      </header>
<h2> Example Authors are:</h2>
      <footer className="App-footer">
        <div className="sidebar" ref={sidebarRef}>
          {allAuthors.map((authorName, index) => (
            <div key={index} className={`author-item ${index === currentAuthorIndex ? 'active' : ''}`} onClick={() => handleAuthorClick(authorName)}>
              {authorName}
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
};

export default App;

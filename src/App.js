import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './App.css';

function App() {
  const nominationsLocal = localStorage.getItem('nominations');
  const nominations = nominationsLocal ? JSON.parse(nominationsLocal) : [];
  const [nominatedMovies, setNominatedMovies] = useState(nominations);
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const getData = async () => {
      const url = `https://www.omdbapi.com/?apikey=${process.env.REACT_APP_API_KEY}&type=movie&s=${searchTerm}`;

      const moviesData = await fetch(url)
                                .then((response) => response.json())
                                .then((data) => data)
                                .catch((error) => error);

      setMovies(moviesData.Search ? moviesData.Search : []);
    }

    if (searchTerm.length > 0) {
      getData();
    } else if (searchTerm.length === 0) {
      setMovies([]);
    }
  }, [searchTerm]);

  const handleClick = (movie) => {
    const movieFound = nominatedMovies.some(nm => nm.imdbID === movie.imdbID);

    const movies = movieFound
                    ? nominatedMovies.filter(m => m.imdbID !== movie.imdbID)
                    : [...nominatedMovies, movie];

    setNominatedMovies(movies);
  }

  useEffect(() => {
    localStorage.setItem('nominations', JSON.stringify(nominatedMovies));
  }, [nominatedMovies]);

  return (
    <div className="App" role="main">
      <h1>The Shoppies</h1>
      <div className="search">
        <label htmlFor="searchTerm">Search for a movie title</label>
        <input
          type="text"
          id="searchTerm"
          name="searchTerm"
          placeholder="Movie title"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="banner">
        {nominatedMovies.length === 5 && <h2>Nominations list is full</h2>}
      </div>
      <div className="allMovies">
        <div>
          {searchTerm && <h2>Results for {`"${searchTerm}"`}</h2>}
          <div>
            {movies.map(movie =>
              <Movie
                key={movie.imdbID}
                m={movie}
                nms={nominatedMovies}
                buttonText="Nominate"
                handleClick={handleClick} />
            )}
          </div>
        </div>

        <div>
          <h2>Nominations</h2>
          {nominatedMovies.map(movie =>
            <Movie
              key={movie.imdbID}
              m={movie}
              nms={nominatedMovies}
              buttonText="Remove"
              handleClick={handleClick} />
          )}
        </div>
      </div>
    </div>
  );
}

function Movie({ m, nms, buttonText, handleClick }) {
  return (
    <motion.div
      className="movie"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: .8 }}>
        {buttonText === "Remove" && <img src={m.Poster} alt="" />}
        <p>
          <a href={`https://www.imdb.com/title/${m.imdbID}`} target="_blank" rel="noopener noreferrer">
            {m.Title} {`(${m.Year})`}
          </a>
        </p>
        <motion.button
          whileHover={{
            scale: 1.1,
            transition: { duration: .2 },
          }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleClick(m)}
          disabled={(buttonText === "Nominate")
            && (nms.length === 5 || nms.some(nm => nm.imdbID === m.imdbID))}>
          {buttonText}
        </motion.button>
    </motion.div>
  )
}

export default App;

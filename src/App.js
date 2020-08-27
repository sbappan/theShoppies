import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [nominatedMovies, setNominatedMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const getData = async () => {
      const url = `https://www.omdbapi.com/?apikey=${process.env.REACT_APP_API_KEY}&type=movie&s=${searchTerm}`;

      const moviesData = await fetch(url)
                              .then((response) => response.json())
                              .then((data) => data)
                              .catch((error) => error);
      
      if (moviesData.Search) {
        setMovies(moviesData.Search);
      }
      else {
        setMovies([]);
      }
    }

    if (searchTerm.length > 0) {
      getData();
    }
  }, [searchTerm]);

  const handleClick = (movie) => {
    const movieFound = nominatedMovies.some(nm => nm.imdbID === movie.imdbID);

    if (movieFound) {
      const movies = nominatedMovies.filter(m => m.imdbID !== movie.imdbID);
      setNominatedMovies(movies);
    } 
    else {
      setNominatedMovies([...nominatedMovies, movie]);
    }
  }

  return (
    <div className="App">
      <h1>The Shoppies</h1>
      <div className="search">
        <p>Movie title</p>
        <input
          type="text"
          name="searchTerm"
          placeholder="Movie title"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          />
      </div>

      <div className="allMovies">
        <div>
          <h3>Results for {`"${searchTerm}"`}</h3>
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
          <h3>Nominations</h3>
          {nominatedMovies.map(movie => 
            <Movie 
              key={movie.imdbID} 
              m={movie} 
              nms={nominatedMovies} 
              buttonText="Remove" 
              handleClick={handleClick} />
          )}
          {nominatedMovies.length === 5 && <h4>Nominations list is full</h4>}
        </div>
      </div>
    </div>
  );
}

function Movie ({m, nms, buttonText, handleClick}) {
  return (
    <div className="movie">
      <img src={m.Poster} alt=""/>
      <p>
        {m.Title} {`(${m.Year})`}
      </p>
      <button 
      onClick={() => handleClick(m)} 
      disabled={(buttonText==="Nominate") 
                && (nms.length === 5 || nms.some(nm => nm.imdbID === m.imdbID))}>
      {buttonText}
      </button>
    </div>
  )
}

export default App;

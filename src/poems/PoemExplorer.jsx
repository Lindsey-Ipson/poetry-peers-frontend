import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { hashPoem } from './poemUtils';
import { useNavigate } from 'react-router-dom';

function PoemExplorer() {
  const [poems, setPoems] = useState([]);
  const [query, setQuery] = useState('');
  const [resultsAreRandom, setResultsAreRandom] = useState(false);
  const navigate = useNavigate();

  // Fetches 20 random poems
  const fetchRandomPoems = async () => {
    try {
      const response = await fetch('https://poetrydb.org/random/20');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setResultsAreRandom(true);
      setPoems(data);
    } catch (error) {
      console.error("Could not fetch poems:", error);
    }
  };

  // Fetch random poems on mount
  useEffect(() => {
    fetchRandomPoems();
  }, []);

  // Effect to fetch random poems when the search query is cleared
  useEffect(() => {
    if (query === '') {
      fetchRandomPoems();
    }
  }, [query]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return; // Early return if query is empty

    setResultsAreRandom(false);
    try {
      const response = await fetch(`https://poetrydb.org/title/${query}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      setPoems(data);
    } catch (error) {
      console.error('Failed to fetch poems:', error);
    }
  };

  const routeToPoem = (poem) => {
    let hashedId = hashPoem(poem);
    poem.id = hashedId;
    navigate(`/poems/${hashedId}`, { state: { data: poem } });
  };

	return (
		<div className="container-fluid  text-center">
			<h1>Explore Poems</h1>
			<div>Search by title, or enjoy some random poems below</div>
			<div className="row ">
				<div className="col-12">
					<form onSubmit={handleSearch}>
						<div className="row">
							<div className="col-9">
								<input
									className="form-control me-2"
									type="search"
									placeholder="Search"
									aria-label="Search"
									value={query}
									onChange={handleInputChange}
								/>
							</div>
							<div className="col-3">
								<button className="btn btn-outline-success col-3" type="submit">
									Search
								</button>
							</div>
						</div>
					</form>
				</div>
			</div>
			{resultsAreRandom && <h2>Here are 20 random poems to explore:</h2>}
			<div className="row justify-content-md-center">
				<div className="col-9">
					<div className="list-group">
						{poems.map((poem) => (
							<button
								key={uuidv4()}
								className="list-group-item list-group-item-action"
								onClick={() => routeToPoem(poem)}
							>
								<h4>{poem.title}</h4>
								<p>{poem.author}</p>
							</button>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

export default PoemExplorer;










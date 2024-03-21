import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { hashPoem } from "./poemUtils";
import { useNavigate, useLocation } from "react-router-dom";
import "./PoemExplorer.css";

function PoemExplorer () {
  const [poems, setPoems] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultsAreRandom, setResultsAreRandom] = useState(false);
  const navigate = useNavigate();

  const location = useLocation();
  const [alertInfo, setAlertInfo] = useState({ show: false, message: '' });

  // Fetches 20 random poems
  const fetchRandomPoems = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://poetrydb.org/random/20");
      if (!response.ok) {
        throw new Error(`Error connecting with PoetryDB external API. Status: ${response.status}`);
      }
      const data = await response.json();
      setResultsAreRandom(true);
      setPoems(data);
    } catch (error) {
      console.error("Could not fetch poems:", error);
    }
    setLoading(false);
  };

  // Effect to fetch random poems when the search query is cleared
  useEffect(() => {
    if (query === "") {
      fetchRandomPoems();
    }
  }, [query]);

  // Check for state passed on navigation and set up the alert
  useEffect(() => {
    if (location.state?.alert) {
      setAlertInfo({ show: true, message: location.state.message });

      // Hide the alert after a few seconds
      const timer = setTimeout(() => {
        setAlertInfo({ show: false, message: '' });
      }, 5000); // 5000ms = 5 seconds

      // Clean up the timer if the component unmounts
      return () => clearTimeout(timer);
    }
  }, [location]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!query) {
        fetchRandomPoems();
      } else {
        setResultsAreRandom(false);

        try {
          const response = await fetch(`https://poetrydb.org/title/${query}`);
          if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
          }
          const data = await response.json();
          setPoems(data);
        } catch (error) {
          console.error("Could not fetch poems:", error);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRouteToPoem = (poem) => {
    let hashedId = hashPoem(poem);
    poem.id = hashedId;
    navigate(`/poems/${hashedId}`, { state: { data: poem } });
  };

  return (
    <div className="PoemExplorer container-xl">

      <div>
        {alertInfo.show && <div className="alert alert-danger">{alertInfo.message}</div>}
      </div>

      <h1>Explore Poems</h1>
      <div className="PoemExplorer-instructions">Search by title, or enjoy some random poems below</div>
      <div className="row ">
        <div className="row justify-content-center">
          <div className="col-auto">
            <form onSubmit={handleSearch}>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="i.e. The Raven"
                  value={query}
                  onChange={handleInputChange}
                  disabled={loading}
                />
                <button
                  className="PoemExplorer-button btn btn-outline-secondary"
                  type="action"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>{" "}
                      Loading...
                    </>
                  ) : (
                    "Search"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <br></br>
      {resultsAreRandom && <h2>Here are 20 random poems to explore:</h2>}
      <div className="row justify-content-md-center">

      {poems.map((poem) => (
        <div className="col-lg-4" key={uuidv4()}>
          <div className="card poem-card" onClick={() => handleRouteToPoem(poem)}>
            <div className="card-header">
              <strong>{poem.title}</strong> - <em>by {poem.author}</em>
            </div>
            <div className="card-body">
              {poem.lines.slice(0, 5).map((line, index) => (
                <p key={index} className="card-text">
                  {line}
                </p>
              ))}
              <p className="card-text">
                ...
              </p>
              <div className="d-flex justify-content-end"> {/* Flex container to align button to the right */}
                <a href="#" className="btn btn-primary">
                  Analyze
                </a>
              </div>
            </div>
          </div>
          <br />
        </div>
      ))}

      </div>
    </div>
  );
}

export default PoemExplorer;

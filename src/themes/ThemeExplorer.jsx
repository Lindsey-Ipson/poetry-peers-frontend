import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate, useLocation } from 'react-router-dom';
import BackendApi from '../common/backendApi';
import './ThemeExplorer.css';

function ThemeExplorer () {
	const [themes, setThemes] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const [alertInfo, setAlertInfo] = useState({ show: false, message: '' });
 
  async function fetchThemesWithPoems () {
    setLoading(true);

    let themesData = await BackendApi.getThemes();
    for (let themeData of themesData) {
      let tagsForTheme = await BackendApi.getTagsByThemeName(themeData.name);
      themeData.tags = tagsForTheme;

      themeData.poems = [];
      for (let tag of tagsForTheme) {
        let poemForTag = await BackendApi.getPoemById(tag.poemId);
        // Check if the poem is already in the themeData.poems array
        const isPoemAlreadyAdded = themeData.poems.find(poem => poem.id === poemForTag.id);
        // Only push the poem if it wasn't found
        if (!isPoemAlreadyAdded) {
          themeData.poems.push(poemForTag);
        }
      }
    }
    setLoading(false);
    setThemes(themesData);
  };

  // Check for state passed on navigation and set up alert if needed
  useEffect(() => {
    function setupAlertFromLocation() {
      if (location.state?.alert) {
        setAlertInfo({ show: true, message: location.state.message });
        const timer = setTimeout(() => {
          setAlertInfo({ show: false, message: '' });
        }, 5000);
        // Clean up the timer if the component unmounts
        return () => clearTimeout(timer);
      }
    }
    setupAlertFromLocation();
  }, [location]);

	useEffect(() => {
		fetchThemesWithPoems();
	}, []);

  // Effect to fetch all themes again when the search query is cleared
  useEffect(() => {
    if (query === "") {
      fetchThemesWithPoems();
    }
  }, [query]);

  function handleInputChange (event) {
    setQuery(event.target.value);
  };

  async function handleSearch (event) {
    event.preventDefault();
    setLoading(true);
    
    try {
      if (!query) {
        fetchThemesWithPoems();
      } else {
        let themesData = await BackendApi.getThemes(query);
    
        for (let themeData of themesData) {
          let tagsForTheme = await BackendApi.getTagsByThemeName(themeData.name);
          themeData.poems = [];
        
          for (let tag of tagsForTheme) {
            let poemForTag = await BackendApi.getPoemById(tag.poemId);
            const isPoemAlreadyAdded = themeData.poems.find(poem => poem.id === poemForTag.id);
            if (!isPoemAlreadyAdded) {
              themeData.poems.push(poemForTag);
            }
          }
        }
        setThemes(themesData);
        }
    } finally {
      setLoading(false);
    }
  };

  function handleRouteToPoem (event, themeName, poem) {
    event.stopPropagation(); // Prevent event from bubbling up
		return navigate(`/poems/${poem.id}`, { state: { data: { poem, themeName } } });
	};

  function handleRouteToTheme (themeName) {
    return navigate(`/themes/${themeName}`);
  };

  return (
    <div className="ThemeExplorer container ">

      <div>
        {alertInfo.show && <div className="alert alert-danger">{alertInfo.message}</div>}
      </div>

      <h1 className="text-center mb-4">Themes</h1>

      <form onSubmit={handleSearch}>
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="i.e. Friendship"
            value={query}
            onChange={handleInputChange}
            disabled={loading}
          />
          <button
            className="ThemeExplorer-button btn btn-outline-secondary"
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

        {loading && <div className="ThemeExplorer-loading-message text-center mt-3">Please allow a moment for the themes to be fetched...</div>}
      
        {!loading &&
          <ul className="list-group ">
          
            {themes.map((theme) => (
              <li key={uuidv4()} className="list-group-item" onClick={() => handleRouteToTheme(theme.name)}>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="ThemeExplorer-theme-name fw-bold mb-1">{theme.name}</h5>
            
                    {theme.poems.map((poem) => (
                      <p key={poem.id} className="poem-item mb-1" onClick={(event) => handleRouteToPoem(event, theme.name, poem)}>
                        <span className="ThemeExplorer-poem-title">"{poem.title}"</span> <span className="text-muted">by {poem.author}</span>
                      </p>
                    ))}

                  </div>
                  <span className="ThemeExplorer-poem-count">
                    {theme.poems.length !== 1 ? `${theme.poems.length} poems` : '1 poem'}                
                  </span>
                </div>
              </li>
            ))}
          </ul>
        
        } 
    </div>
  );
}

export default ThemeExplorer;
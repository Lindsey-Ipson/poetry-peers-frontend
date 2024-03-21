import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import BackendApi from '../common/backendApi';
import './ThemeExplorer.css';

function ThemeExplorer () {
	const [themes, setThemes] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

	const navigate = useNavigate();
 
  const fetchThemesWithPoems = async () => {
    let themesData = await BackendApi.getThemes();
    for (let themeData of themesData) {
      let tagsForTheme = await BackendApi.getTagsByThemeName(themeData.name);



      themeData.tags = tagsForTheme;





      // Initialize poems as an empty array to accumulate poems
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

    setThemes(themesData);
  };

  useEffect(() => {
    console.log(themes);
  }), [themes];






	useEffect(() => {
		fetchThemesWithPoems();
	}, []);

  // Effect to fetch all themes again when the search query is cleared
  useEffect(() => {
    if (query === "") {
      fetchThemesWithPoems();
    }
  }, [query]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
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

  const handlePoemClick = (poem) => {
    navigate(`/poems/${poem.id}`, { state: { data: poem } });
  };

  return (
    <div className="ThemeExplorer container ">
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

      <ul className="list-group ">
        {themes.map((theme) => (
          <li key={uuidv4()} className="list-group-item">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h5 className="ThemeExplorer-theme-name fw-bold mb-1">{theme.name}</h5>

                {theme.poems.map((poem) => (
                  <p key={poem.id} className="poem-item mb-1" onClick={() => handlePoemClick(poem)}>
                    <i className="ThemeExplorer-poem-title">{poem.title}</i> <span className="text-muted">by {poem.author}</span>
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
    </div>
  );

	
}

export default ThemeExplorer;

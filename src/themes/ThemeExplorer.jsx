import { useEffect, useState } from 'react';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import BackendApi from '../common/backendApi';
import './ThemeExplorer.css';


function ThemeExplorer () {
	const [themes, setThemes] = useState([]);

	const navigate = useNavigate();
 
  const fetchThemesWithPoems = async () => {
    let themesData = await BackendApi.getThemes();
    for (let themeData of themesData) {
      let tagsForTheme = await BackendApi.getTagsByThemeName(themeData.name);
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
    console.log('themesData:', themesData);
    setThemes(themesData);
  };

	useEffect(() => {
		fetchThemesWithPoems();
	}, []);

  const handlePoemClick = (poem) => {
    navigate(`/poems/${poem.id}`, { state: { data: poem } });
  };

  return (
    <div className="ThemeExplorer container mt-5">
      <h1 className="text-center mb-4">Themes</h1>
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

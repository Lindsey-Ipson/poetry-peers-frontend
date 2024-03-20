import { useEffect, useState } from 'react';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import BackendApi from '../common/backendApi';


function ThemeExplorer() {
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
    <div>
      <h1>Themes</h1>
      <ol className="list-group list-group-light list-group-numbered" style={{ width: '50%', margin: '0 auto' }}>
        {themes.map((theme) => (
          <React.Fragment key={uuidv4()}>
            <li className="list-group-item d-flex justify-content-between align-items-start">
              <div className="ms-2 me-auto">
                <div className="fw-bold">{theme.name}</div>
                {theme.poems.map((poem) => (
                  <p key={poem.id}
                  onClick={() => theme.poems.length > 0 && handlePoemClick(poem)}> 
                    {poem.title} by {poem.author}</p>
                ))}
              </div>
                <span className="badge badge-primary rounded-pill" style={{ color: "blue" }}>
                  {theme.poems.length !== 1 ? `${theme.poems.length} poems` : '1 poem'}                
                </span>             
            </li>
          </React.Fragment>
        ))}
      </ol>
    </div>
  );

	
}

export default ThemeExplorer;

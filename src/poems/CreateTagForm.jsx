import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import backendApi from '../common/backendApi';

function CreateTagForm () {
	const navigate = useNavigate();
  const location = useLocation();
  const initialState = location.state?.data;
  const [themes, setThemes] = useState(null); 
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [customTheme, setCustomTheme] = useState('');
	const [analysis, setAnalysis] = useState('');

	const { selectedIndices, poem, currentUser } = initialState || {};

  useEffect(() => {
    console.log('Component mounted');

    const fetchThemes = async () => {
      try {
        const themesData = await backendApi.getThemes();

        setThemes(themesData.map((theme) => {
					return theme.name}));
      } catch (error) {
        console.error('Failed to fetch themes:', error);
      }
    };

    fetchThemes();
  }, [initialState]);

	const handleSubmit = async (event) => {
		event.preventDefault();
		let finalTheme = selectedTheme || customTheme; // Use selected theme or custom theme
	
		if (themes && !themes.includes(finalTheme)) {
			try {
				// Add new theme to database and update finalTheme to be returned new theme name -- necessary since lowercased first letters of each word will be uppercased before being added to database
				const themeResponse = await backendApi.addTheme({name: finalTheme});
				finalTheme = themeResponse.name;
			} catch (error) {
				console.error('Failed to add theme:', error);
			}
		}

		try {
			await backendApi.addTag({
				themeName: finalTheme,
				poemId: poem.id,
				highlightedLines: selectedIndices,
				analysis: analysis,
				username: currentUser.username,
			});
		} catch (error) {
			console.error('Failed to add tag:', error);
		}

		// Redirect to poem page
		navigate(`/poems/${poem.id}`, { state: { data: poem } });

	};
	
  const handleThemeChange = (event) => {
    setSelectedTheme(event.target.value);
  };

  const handleCustomThemeChange = (event) => {
    setCustomTheme(event.target.value); 
  };

	const handleAnalysisChange = (event) => {
		setAnalysis(event.target.value);
	}

  return (
    <div className="CreateTagForm">
      <h1>Create a new tag</h1>
      <h2>For poem "{poem.title}" by {poem.author}</h2>

      <h3>Lines you've selected:</h3>
      <div>
        {selectedIndices.map((index) => (
          <p key={index}>{poem.lines[index]}</p>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <h3>Select a theme:</h3>
        {themes && themes.map((theme, index) => (
          <div key={index}>
            <input
              type="radio"
              id={`theme-${index}`}
              name="theme"
              value={theme}
              checked={selectedTheme === theme}
              onChange={handleThemeChange}
            />
            <label htmlFor={`theme-${index}`}>{theme}</label>
          </div>
        ))}
        <div>
          <input
            type="radio"
            id="custom-theme"
            name="theme"
            value=""
            checked={!selectedTheme && !customTheme}
            onChange={() => setSelectedTheme('')} // Unselect theme when custom input is used
          />
          <label htmlFor="custom-theme">New Theme:</label>
          <input
            type="text"
            id="custom-theme-input"
            value={customTheme}
            onChange={handleCustomThemeChange}
            disabled={!!selectedTheme} // Disable custom input if a theme is selected
          />
        </div>

				<h3>Provide your analysis:</h3>
				<p>Please explain how this theme pertains to these lines, and how it contributes to the overall meaning of the poem.</p>
				<label htmlFor="analysis"></label>
				<input 
					type="text"
					id="analysis"
					value={analysis}
					onChange={handleAnalysisChange}
				/>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default CreateTagForm;


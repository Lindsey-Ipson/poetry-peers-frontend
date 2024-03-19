import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import backendApi from '../common/backendApi';

function CreateTagForm() {
  const location = useLocation();
  const initialState = location.state?.data;
  const [themes, setThemes] = useState(null); 
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [customTheme, setCustomTheme] = useState('');

  let selectedIndices = initialState.selectedIndices;
  let poem = initialState.poem;

  useEffect(() => {
    console.log('Component mounted');

    const fetchThemes = async () => {
      try {
        const themesData = await backendApi.getThemes();
        console.log(themesData)
        setThemes(themesData);
      } catch (error) {
        console.error('Failed to fetch themes:', error);
      }
    };

    fetchThemes();
  }, [initialState]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const finalTheme = selectedTheme || customTheme; // Use selected theme or custom theme
    // Handle form submission with finalTheme
  };

  const handleThemeChange = (event) => {
    setSelectedTheme(event.target.value);
  };

  const handleCustomThemeChange = (event) => {
    setCustomTheme(event.target.value); 
  };

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
              value={theme.name}
              checked={selectedTheme === theme.name}
              onChange={handleThemeChange}
            />
            <label htmlFor={`theme-${index}`}>{theme.name}</label>
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
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default CreateTagForm;



// import React, { useState, useEffect } from 'react';
// import { useLocation } from 'react-router-dom';
// import backendApi from '../common/backendApi';

// function CreateTagForm() {
//   const location = useLocation();
//   const initialState = location.state?.data;
//   const [themes, setThemes] = useState(null); 
//   const [selectedTheme, setSelectedTheme] = useState(null); // State to hold selected theme

//   let selectedIndices = initialState.selectedIndices;
//   let poem = initialState.poem;

//   useEffect(() => {
//     console.log('Component mounted');

//     const fetchThemes = async () => {
//       try {
//         const themesData = await backendApi.getThemes();
//         console.log(themesData)
//         setThemes(themesData); // Set themes in state
//       } catch (error) {
//         console.error('Failed to fetch themes:', error);
//       }
//     };

//     fetchThemes(); // Call the fetchThemes function
//   }, [initialState]);

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     // Handle form submission
//   };

//   const handleThemeChange = (event) => {
//     setSelectedTheme(event.target.value); // Update selected theme
//   };

//   return (
//     <div className="CreateTagForm">
//       <h1>Create a new tag</h1>
//       <h2>For poem "{poem.title}" by {poem.author}</h2>

//       <h3>Lines you've selected:</h3>
//       <div>
//         {selectedIndices.map((index) => (
//           <p key={index}>{poem.lines[index]}</p>
//         ))}
//       </div>

//       <form onSubmit={handleSubmit}>
//         <h3>Select a theme:</h3>
//         {themes && themes.map((theme, index) => (
//           <div key={index}>
//             <input
//               type="radio"
//               id={`theme-${index}`}
//               name="theme"
//               value={theme.name}
//               checked={selectedTheme === theme.name}
//               onChange={handleThemeChange}
//             />
//             <label htmlFor={`theme-${index}`}>{theme.name}</label>
//           </div>
//         ))}
//         <button type="submit">Submit</button>
//       </form>
//     </div>
//   );
// }

// export default CreateTagForm;





// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { useLocation } from 'react-router-dom';
// import backendApi from '../common/backendApi';

// function CreateTagForm() {
// 	const location = useLocation();
// 	const initialState = location.state?.data;
// 	const [themes, setThemes] = useState(null); 

// 	let selectedIndices = initialState.selectedIndices;
// 	let poem = initialState.poem;

// 	useEffect(() => {
//     console.log('Component mounted');

//     const fetchThemes = async () => {
//       try {
//         const themesData = await backendApi.getThemes();
// 				console.log(themesData)
//         setThemes(themesData); // Set themes in state
//       } catch (error) {
//         console.error('Failed to fetch themes:', error);
//       }
//     };

//     fetchThemes(); // Call the fetchThemes function
//   }, [initialState]);

// 	const handleSubmit = (event) => {
// 		event.preventDefault();
// 	};

// 	return (
// 		<div className="CreateTagForm">
// 			<h1>Create a new tag</h1>
// 			<h2>For poem "{poem.title}" by {poem.author}</h2>

// 			<h3>Lines you've selected:</h3>
// 			<div>
// 				{selectedIndices.map((index) => (
// 					<p key={index}>{poem.lines[index]}</p>
// 				))}
// 			</div>


// 		</div>


// 	);
// }

// export default CreateTagForm;


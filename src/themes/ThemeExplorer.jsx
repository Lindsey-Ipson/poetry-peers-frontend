import { useEffect, useState } from 'react';
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

          for (let tag of tagsForTheme) {
            let poemsForTag = await BackendApi.getPoemById(tag.poemId);
            themeData.poems = poemsForTag;
          }

      }
      console.log('themesData:', themesData);
			setThemes(themesData);

	}; 

	useEffect(() => {
		fetchThemesWithPoems();
	}, []);

	return (
		<div>
			<h1>Themes</h1>
			<ul>
				{themes.map((theme) => (
					<li key={uuidv4()}>{theme.name}</li>
				))}
			</ul>
		</div>
	);
}

export default ThemeExplorer;
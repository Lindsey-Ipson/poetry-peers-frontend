import React, { useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getOrAddPoemToDb } from './poemUtils';
import { useNavigate } from 'react-router-dom';
import UserContext from '../common/UserContext';
import backendApi from '../common/backendApi';
import { lightColors} from './poemUtils';

function AnalyzePoem() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialState = location.state?.data;

  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [poem, setPoem] = useState(initialState);
  const [tags, setTags] = useState([]);

	let selectedIndices;

	console.log(tags, '<---------- tags a')

  useEffect(() => {
    const fetchPoemAndTags = async () => {
      try {
        const updatedPoem = await getOrAddPoemToDb(initialState);
        const poemTags = await backendApi.getTagsByPoemId(updatedPoem.id);
        setPoem(updatedPoem);
				for (let i = 0; i < poemTags.length; i++) {
					poemTags[i].color = lightColors[i];
				}
				setTags(poemTags);
      } catch (error) {
        console.error('Failed to fetch or add poem', error);
      }
    };

    fetchPoemAndTags();
  }, [initialState]);

	const handleTextSelection = (event) => {
		const selection = window.getSelection();

		if (selection && selection.toString()) {
			const range = selection.getRangeAt(0);
			const selectedElements = range.cloneContents().querySelectorAll('p');
			selectedIndices = Array.from(selectedElements).map((element) =>
				parseInt(element.getAttribute('data-key'))
			);
			// If portion of single line selected 
			if (!selectedIndices.length) {
				const selectedElement = event.target;
				const key = selectedElement.getAttribute('data-key');
				selectedIndices = [parseInt(key)];
			}
		}
		navigate('/poems/CreateTagForm', {
			state: { data: { selectedIndices, poem, currentUser } },
		});
	};

  if (!poem) {
    return <div>Loading...</div>;
  }

  return (
    <div className="AnalyzePoem container-fluid text-center">
      <h1>{poem.title}</h1>
      <h2>{poem.author}</h2>
      <div className="AnalyzePoems-poemLines" onMouseUp={handleTextSelection}>
        {poem.lines.map((line, index) => {
          const highlightedTags = tags.filter((tag) =>
            tag.highlightedLines.includes(index)
          );
          return (
            <p
              key={index}
              data-key={index}
              className={highlightedTags.length > 0 ? 'highlighted' : ''}
            >
              {line}{' '}
              {highlightedTags.map((tag, tagIndex) => (
								<span key={tagIndex} className="badge" style={{ backgroundColor: tag.color, color: 'white' }}>
                  {tag.themeName}
                </span>
              ))}
            </p>
          );
        })}
      </div>
    </div>
  );
}

export default AnalyzePoem;

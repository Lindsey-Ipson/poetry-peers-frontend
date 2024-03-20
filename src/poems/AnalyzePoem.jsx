import React, { useContext, useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getOrAddPoemToDb } from './poemUtils';
import UserContext from '../common/UserContext';
import backendApi from '../common/backendApi';
import { lightColors} from './poemUtils';
import { Toast } from 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function AnalyzePoem() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialState = location.state?.data;

  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [poem, setPoem] = useState(initialState);
  const [tags, setTags] = useState([]);

	const [showToast, setShowToast] = useState(false);
  const [toastPosition, setToastPosition] = useState({ x: 0, y: 0 });
	const [toastContent, setToastContent] = useState('');

	let selectedIndices;

	  // Handle hover on badge to show toast
		const handleBadgeHover = (event, themeName) => {
			const rect = event.target.getBoundingClientRect();
			const posX = rect.left + window.scrollX + rect.width / 2; // Center X of the badge
			const posY = rect.top + window.scrollY; // Top Y of the badge
			setToastPosition({ x: posX, y: posY });
			setToastContent(themeName);
			setShowToast(true);
		};

		// Toast initialization and display logic
		useEffect(() => {
			let toastEl = document.getElementById('liveToast');
			if (showToast && toastEl) {
				const toast = new Toast(toastEl);
				toast.show();
			}
		}, [showToast, toastPosition, toastContent]);


  useEffect(() => {
    const fetchPoemAndTags = async () => {
      try {
        const updatedPoem = await getOrAddPoemToDb(initialState);
        const poemTags = await backendApi.getTagsByPoemId(updatedPoem.id);
        setPoem(updatedPoem);
        for (let i = 0; i < poemTags.length; i++) {
          poemTags[i].color = lightColors[i % lightColors.length]; // Ensure cycling through colors if more tags than colors
        }
        setTags(poemTags);
      } catch (error) {
        console.error('Failed to fetch or add poem', error);
      }
    };

    fetchPoemAndTags();

  }, [initialState]); // Adjust useEffect dependencies as needed


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
      {/* Toast container adjusted for hover functionality */}
      <div
        className="toast-container position-fixed"
        style={{ left: `${toastPosition.x}px`, top: `${toastPosition.y}px`, display: showToast ? 'block' : 'none' }}
      >
        <div id="liveToast" className="toast" role="alert" aria-live="assertive" aria-atomic="true">
          <div className="toast-header">
            <strong className="me-auto">Theme</strong>
            <button type="button" className="btn-close" data-bs-dismiss="toast" onClick={() => setShowToast(false)}></button>
          </div>
          <div className="toast-body">
            {toastContent}
          </div>
        </div>
      </div>

      <h1>{poem.title}</h1>
      <h2>{poem.author}</h2>
      <div className="AnalyzePoems-poemLines">
        {poem.lines.map((line, index) => {
          const highlightedTags = tags.filter((tag) => tag.highlightedLines.includes(index));
          return (
            <p key={index} data-key={index}>
              {line}{' '}
              {highlightedTags.map((tag, tagIndex) => (
                <span
                  key={tagIndex}
                  className="badge"
                  style={{ backgroundColor: tag.color, color: 'white', cursor: 'pointer' }}
                  onClick={(e) => handleBadgeHover(e, tag.themeName)}
                >
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

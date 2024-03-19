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

	let selectedIndices;

	const toastTriggerRef = useRef(null);
  const toastRef = useRef(null);

	const [showToast, setShowToast] = useState(false);
  const [toastPosition, setToastPosition] = useState({ x: 0, y: 0 });

  // Adjust this function to handle the toast appearance
  const handleShowToastAtPosition = (event) => {
    const { clientX, clientY } = event;
    setToastPosition({ x: clientX, y: clientY });
    setShowToast(true);
  };

  useEffect(() => {
    let toastEl = document.getElementById('liveToast');
    if (showToast && toastEl) {
      const toast = new Toast(toastEl);
      toast.show();
    }
  }, [showToast, toastPosition]);


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

    // Toast logic
    const toastTrigger = toastTriggerRef.current;
    const toastEl = toastRef.current;

		if (toastTrigger && toastEl) {
			const toast = new Toast(toastEl); // Use the imported Toast
			toastTrigger.addEventListener('click', () => {
				toast.show();
			});
		
			// Cleanup
			return () => {
				toastTrigger.removeEventListener('click', () => {
					toast.show();
				});
			};
		}
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

		{/* Assuming this button triggers the toast for demonstration */}
		<button type="button" className="btn btn-primary" onClick={handleShowToastAtPosition}>
        Show live toast
      </button>

      {/* Adjusted toast container */}
      <div
        className="toast-container position-fixed"
        style={{ left: `${toastPosition.x}px`, top: `${toastPosition.y}px`, display: showToast ? 'block' : 'none' }}
      >
        <div id="liveToast" className="toast" role="alert" aria-live="assertive" aria-atomic="true">
          <div className="toast-header">
            <strong className="me-auto">Bootstrap</strong>
            <button type="button" className="btn-close" data-bs-dismiss="toast" onClick={() => setShowToast(false)}></button>
          </div>
          <div className="toast-body">
            Hello, world! This is a toast message.
          </div>
        </div>
      </div>
		
		{/* Rest of your component */}

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

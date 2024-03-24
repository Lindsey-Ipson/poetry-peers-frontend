
import React, { useContext, useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getOrAddPoemToDb } from './poemUtils';
import UserContext from '../common/UserContext';
import BackendApi from '../common/backendApi';
import { lightColors } from './poemUtils';
import { Toast } from 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { formatDateFromDatetime } from '../common/generalUtils';
import './AnalyzePoem.css';

function AnalyzePoem () {
	const navigate = useNavigate();
	const location = useLocation();
	const { poemId } = useParams();
	const initialState = location.state?.data;

	const { currentUser, setCurrentUser } = useContext(UserContext);
	const [poem, setPoem] = useState(location.state?.data.poem);
	const themeName = location.state?.data.themeName;
	const [tags, setTags] = useState([]);
  const [matchingTag, setMatchingTag] = useState(null);

	const [showToast, setShowToast] = useState(false);
	const [toastPosition, setToastPosition] = useState({ x: 0, y: 0 });
	const [toastContent, setToastContent] = useState({});

	let selectedIndices;

	const handleBadgeClick = (event, themeName, username, datetime, analysis, themeColor) => {
		event.stopPropagation(); // Prevent event from bubbling up
		const element = event.target;
		const rect = element.getBoundingClientRect();
		const posX = rect.left;
		const posY = rect.top;
		setToastPosition({ x: posX, y: posY });
		const formattedDate = formatDateFromDatetime(datetime);
		setToastContent({themeName, username, formattedDate, analysis, themeColor});
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
      let fetchedPoem;
      let poemTags = []; // Declare poemTags here so it's accessible throughout the function

      try {
        // Check if initialState is available; if not, fetch the poem by ID
        if (poemId && !initialState) {
          fetchedPoem = await BackendApi.getPoemById(poemId);
        } else {
          fetchedPoem = await getOrAddPoemToDb(initialState.poem);
        }

        poemTags = await BackendApi.getTagsByPoemId(fetchedPoem.id); // Fetch and set poemTags
        setPoem(fetchedPoem);

        poemTags.forEach((tag, i) => {
          tag.color = lightColors[i % lightColors.length];
        });

        setTags(poemTags);
      } catch (error) {
        console.error('Failed to add poem to database and/or retrieve tags:', error);
      }

      // Now that poemTags is defined, check for themeName
      if (themeName) {
        const matchingTag = poemTags.find(tag => tag.themeName === themeName);
        if (matchingTag) {

          // Prepare the toast content for the first matching tag
          setToastContent({
            themeName: matchingTag.themeName,
            username: matchingTag.username,
            formattedDate: formatDateFromDatetime(matchingTag.datetime),
            analysis: matchingTag.analysis,
            themeColor: matchingTag.color, // Assuming color is assigned in the forEach loop above
          });
          setMatchingTag(matchingTag);
      }
    };
  }
    fetchPoemAndTags();
  }, []);

  useEffect(() => {
    const renderToastIfMatchingTag = () => {
      if (matchingTag) {
        // Wait for the DOM to stabilize before attempting to find and click the badge
        setTimeout(() => {
          const badgeElement = document.querySelector(`[data-theme-name="${themeName}"]`);
          if (badgeElement) {
            badgeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // After ensuring the element is visible and events are attached, simulate the click
            setTimeout(() => {
              badgeElement.click();
            }, 800); 
            // Can be adjusted based on scroll and event setup -- if extra long poems added to database eventually, may need to increased
          }
        }, 100); 
        // Can be adjusted based on when elements expected to be ready -- if extra long poems added to database eventually, may need to increased
      }
    }
    renderToastIfMatchingTag();
  }, [matchingTag, themeName, tags]);


	const handleTextSelection = (event) => {
		const selection = window.getSelection();

		// Check if there's actual text selected and not just click
		if (selection && selection.toString().trim().length > 0) {
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
			navigate('/poems/CreateTagForm', {
				state: { data: { selectedIndices, poem, currentUser } },
			});
		}
	};

	const handleRouteToTheme = (themeName) => {
    navigate(`/themes/${themeName}`);
  };

	if (!poem) {
		return <div>Loading...</div>;
	}

	return (
		<div className="AnalyzePoem container-fluid text-center">
			<div
				className="toast-container position-fixed"
				style={{
					left: `${toastPosition.x}px`,
					top: `${toastPosition.y}px`,
					display: showToast ? 'block' : 'none',
				}}
			>
				<div
					id="liveToast"
					className="toast"
					role="alert"
					aria-live="assertive"
					aria-atomic="true"
					data-bs-autohide="false"
					style={{ backgroundColor: '#fff', borderRadius: '.25rem' }}
				>
					{' '}
	
					<div
						className="toast-header"
						style={{
							backgroundColor: toastContent.themeColor,
							borderTopLeftRadius: '.25rem',
							borderTopRightRadius: '.25rem',
						}}
					>
						<strong className="me-auto" style={{ color: 'white' }} onClick={() => handleRouteToTheme(toastContent.themeName)}>
							{toastContent.themeName}
						</strong>
						<button
							type="button"
							className="btn-close"
							data-bs-dismiss="toast"
							onClick={() => setShowToast(false)}
						></button>
					</div>
					<div
						className="toast-body"
						style={{
							backgroundColor: '#fff',
							borderBottomLeftRadius: '.25rem',
							borderBottomRightRadius: '.25rem',
						}}
					>
						<small className="AnalyzePoem-tag-author">
							Submitted by <b>{toastContent.username}</b> on{' '}
							<b>{toastContent.formattedDate}</b>
						</small>
						<p className="AnalyzePoem-tag-analysis">
							<b>Analysis:</b> {toastContent.analysis}
						</p>
					</div>
				</div>
			</div>

			<div className="AnalyzePoem-poem">

			<h1>{poem.title}</h1>
			<h2>by {poem.author}</h2>

			<div className="AnalyzePoems-poemLines" onMouseUp={handleTextSelection}>
			  {poem.lines.map((line, index) => {
			    // Check if line is an empty string to determine how to render
			    if (line.trim() === '') {
			      // Render a simple paragraph for empty lines to maintain visual spacing
			      return <p key={index} data-key={index}>&nbsp;</p>;
			    } else {
			      // For non-empty lines, filter tags that highlight this line
			      const highlightedTags = tags.filter((tag) => tag.highlightedLines.includes(index));
			      return (
			        <p key={index} data-key={index}>
			          {line}{' '}
			          {highlightedTags.map((tag, tagIndex) => (
			            // Only render badges for non-empty lines
			            <span
										data-theme-name={tag.themeName}
			              key={tagIndex}
			              className="badge"
			              style={{
			                backgroundColor: tag.color,
			                color: 'white',
			                cursor: 'pointer',
			              }}
			              onClick={(e) =>
			                handleBadgeClick(
			                  e,
			                  tag.themeName,
			                  tag.username,
			                  tag.datetime,
			                  tag.analysis,
			                  tag.color
			                )
			              }
			            >
			              {tag.themeName}
			            </span>
			          ))}
			        </p>
			      );
			    }
			  })}
			</div>
			</div>
		</div>
	);
}

export default AnalyzePoem;

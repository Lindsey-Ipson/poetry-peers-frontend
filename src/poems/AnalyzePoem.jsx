import React, { useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { getOrAddPoemToDb } from './poemUtils';
import { useNavigate } from 'react-router-dom';
import UserContext from '../common/UserContext';
import backendApi from '../common/backendApi';


function AnalyzePoem() {
	const navigate = useNavigate();
	const location = useLocation();
	const initialState = location.state?.data;

  const { currentUser, setCurrentUser } = useContext(UserContext);
	const [poem, setPoem] = useState(initialState);
	const [tags, setTags] = useState([]);

	let selectedIndices;

	useEffect(() => {
		const fetchPoemAndTags = async () => {
			try {
				const updatedPoem = await getOrAddPoemToDb(initialState);
				const poemTags = await backendApi.getTagsByPoemId(updatedPoem.id);
				setPoem(updatedPoem);
				setTags(poemTags);
				console.log('poemTags', poemTags);
			} catch (error) {
				console.error('Failed to fetch or add poem', error);
			}
		};

		fetchPoemAndTags();
	}, [initialState]);

	// Function to handle text selection
	const handleTextSelection = (event) => {
		const selection = window.getSelection();

		if (selection && selection.toString()) {
			const range = selection.getRangeAt(0);
			const selectedElements = range.cloneContents().querySelectorAll('p');
			selectedIndices = Array.from(selectedElements).map((element) =>
				parseInt(element.getAttribute('data-key'))
			);

			if (!selectedIndices.length) {
				const selectedElement = event.target;
				const key = selectedElement.getAttribute('data-key');
				selectedIndices = [parseInt(key)];
			}
		}
		console.log('selectedIndices', selectedIndices);

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
				{poem.lines.map((line, index) => (
					<p key={index} data-key={index}>
						{line}
					</p>
				))}
			</div>
		</div>

	);
}

export default AnalyzePoem;

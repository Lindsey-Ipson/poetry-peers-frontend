import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BackendApi from '../common/backendApi';
import { v4 as uuidv4 } from 'uuid';
import { formatDateFromDatetime } from '../common/generalUtils';
import './ViewTheme.css';

function ViewTheme () {
	const navigate = useNavigate();
	const { themeName } = useParams();
	const [themePoems, setThemePoems] = useState([]);

	useEffect(() => {
		async function fetchPoemsAndTagsByTheme (themeName) {
			try {
				// Fetch tags by theme name
				const themeTags = await BackendApi.getTagsByThemeName(themeName);

				// Aggregate unique poem IDs
				const poemIds = [...new Set(themeTags.map(tag => tag.poemId))];

				// Collect all relevant data for tags with themeName and poemId
				let themePoems = [];
				for (let id of poemIds) {
					let poem = await BackendApi.getPoemById(id);
					let poemTags = await BackendApi.getTagsByPoemId(id);
					let poemThemeTags = poemTags.filter(tag => tag.themeName === themeName);
					poem.relevantTags = poemThemeTags.map(tag => (
						{highlightedLines: tag.highlightedLines, 
						analysis: tag.analysis, 
						username: tag.username, 
						datetime: tag.datetime, 
						formattedDate: formatDateFromDatetime(tag.datetime)}));
					themePoems.push(poem);
				}

				setThemePoems(themePoems);
			} catch (error) {
				console.error("Error fetching poems and tags by theme:", error);
				throw error;
			}
		}

		fetchPoemsAndTagsByTheme(themeName);
	}, [themeName]);

	function handleRouteToPoem (poemId, poem) {
		return navigate(`/poems/${poemId}`, { state: { data: { poem, themeName } } });
	};

	return (
		<div className="ViewTheme" id="test">
			<h1 className="text-center">{themeName}</h1>
			<h4 className="text-center">Explore poems that deal with the theme of {themeName}:</h4>
	
			{themePoems.map((poem) => (
				<div key={poem.id} onClick={() => handleRouteToPoem(poem.id, poem)}>
					<div className="ViewTheme-theme card fade show d-block" tabIndex="-1" role="dialog" key={uuidv4()}>
						<div className="card-dialog card-xl" role="document">
							<div className="card-content">
								<div className="card-header">
									<h5 className="card-title">&quot;{poem.title}&quot;<span className="ViewTheme-poem-author"> by {poem.author}</span></h5>
								</div>
								<div className="card-body">
									<div className="container-fluid">
										{poem.relevantTags.map((tag, index) => (
											<div key={index} className="row mb-3">
												<div className="ViewTheme-poem-lines col-sm list-group-item">
													{tag.highlightedLines[0] > 1 && <p className="text-center ViewTheme-font-weight-light">...</p>}
													{tag.highlightedLines[0] > 0 && <p className="text-center ViewTheme-font-weight-light">{poem.lines[tag.highlightedLines[0] - 1]}</p>}
													{tag.highlightedLines.map((lineIndex) => (
														<p className="text-center" key={lineIndex}>
															<strong>{poem.lines[lineIndex]}</strong>
														</p>
													))}
													{tag.highlightedLines.length - 1 < poem.lines.length && <p className="text-center ViewTheme-font-weight-light">...</p>}
												</div>
												<div className="ViewTheme-analysis col-sm">
													<p className="text-center ViewTheme-font-weight-light">{tag.analysis}</p>
												</div>
												<div className="col-12">
													<p className="ViewTheme-tag-author ViewTheme-font-weight-light text-center">
														Submitted by <b>{tag.username}</b> on <b>{tag.formattedDate}</b>
													</p>
												</div>
												{index !== poem.relevantTags.length - 1 && <div className="col-12"><hr className="ViewTheme-custom-hr" /></div>}
											</div>
										))}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			))}
		</div>
	);

}

export default ViewTheme;
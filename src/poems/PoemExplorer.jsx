import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { hashPoem } from './poem-utils';
import { useNavigate } from 'react-router-dom';
import backendApi from '../common/backendApi';

function PoemExplorer({ onSearch }) {
	const [poems, setPoems] = useState([]);
	const [query, setQuery] = useState('');
  const navigate = useNavigate();

	const handleInputChange = (e) => {
		setQuery(e.target.value);
	};

	const handleSearch = async (e) => {
		e.preventDefault(); // Prevent form submission
		const url = `https://poetrydb.org/title/${query}`;

		try {
			const response = await fetch(url);
			if (!response.ok) {
				throw new Error(`Error: ${response.status}`);
			}
			const data = await response.json();
			setPoems(data);
			// Here you could do something with the data, like setting state or calling a parent component function
		} catch (error) {
			console.error('Failed to fetch poems:', error);
		}
	};

	const routeToPoem = async (poem) => {
		let analysisId = hashPoem(poem);
		poem.id = analysisId;

		try {
			let response = await backendApi.getPoemById(analysisId);

			if (response.title) {
					let poemInDb = response;
					let poemTags = await backendApi.getTagsByPoemId(analysisId);
					poemInDb.tags = poemTags;

					if (poemTags.length) {
						for (let tag of poemTags) {
							let tagComments = await backendApi.getCommentsByTag(tag.themeName, tag.poemId, tag.highlightedLines);
							tag.comments = tagComments;
						}
					}
					// Set poem to send in state to retrieved poem from database
					poem = poemInDb;
			}
	} catch (error) {
			if (error.some(element => {
				return element.includes('No such poem with id');
			})) {
				// Change linecount property from external API to camelCase
				poem.lineCount = poem.lineCount || poem.lines.length;
				delete poem.linecount;
				const newPoemInDb = await backendApi.addPoem(poem);
				newPoemInDb.tags = [];
				// Set poem to send in state to newly added poem
				poem = newPoemInDb;
			}
	}

		navigate(`/poems/${analysisId}`, { state: { data: poem } });
	};

	return (
		<div className="container-fluid  text-center">
			<div className="row ">
				<div className="col-12">
					<form onSubmit={handleSearch}>
						<div className="row">
							<div className="col-9">
								<input
									className="form-control me-2"
									type="search"
									placeholder="Search"
									aria-label="Search"
									value={query}
									onChange={handleInputChange}
								/>
							</div>
							<div className="col-3">
								<button className="btn btn-outline-success col-3" type="submit">
									Search
								</button>
							</div>
						</div>
					</form>
				</div>
			</div>
			<div className="row justify-content-md-center">
				<div className="col-9">
					<div className="list-group">
						{poems.map((poem) => (
							<button
								key={uuidv4()}
								className="list-group-item list-group-item-action"
								onClick={() => routeToPoem(poem)}
							>
								<h4>{poem.title}</h4>
								<p>{poem.author}</p>
							</button>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

export default PoemExplorer;

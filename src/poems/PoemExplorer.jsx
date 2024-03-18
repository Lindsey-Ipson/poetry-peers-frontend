import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { hashPoem } from './poem-utils';
import { useNavigate } from 'react-router-dom';

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

	const routeToPoem = (poem) => {
		var analysisId = hashPoem(poem);
		poem.id = analysisId;
		console.log(analysisId);
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

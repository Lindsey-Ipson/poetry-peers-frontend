import React from 'react';
import { useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

function AnalyzePoem() {
	const location = useLocation();
  const poem = location.state?.data;

	return (
		<div className="container-fluid  text-center">
			<h1>{poem.title}</h1>
			<h2>{poem.author}</h2>
			{poem.lines.map((line) => 
				<p key={uuidv4()}>{line}</p>
			)}
		</div>
	);
}

export default AnalyzePoem;

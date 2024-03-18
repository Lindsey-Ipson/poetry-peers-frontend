import React from 'react';
import { useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

function AnalyzePoem() {
  const location = useLocation();
  const poem = location.state?.data; // Assume poem includes tags and comments
	console.log(poem, 'poem in analyze poem');
	console.log(poem.tags, 'poem tags in analyze poem')

  // Create a map where keys are line indices and values are arrays of theme names
  const lineThemesMap = {};
	if (poem.tags.length) {
  poem.tags.forEach(tag => {
    tag.highlighted_lines.forEach(lineIndex => {
      if (!lineThemesMap[lineIndex]) {
        lineThemesMap[lineIndex] = [tag.theme_name];
      } else {
        lineThemesMap[lineIndex].push(tag.theme_name);
      }
    });
  });
}

  return (
    <div className="container-fluid text-center">
      <h1>{poem.title}</h1>
      <h2>{poem.author}</h2>
      {poem.lines.map((line, index) => (
        <p key={uuidv4()}>
          {line}
          {lineThemesMap[index] && <span> - Themes: {lineThemesMap[index].join(', ')}</span>}
        </p>
      ))}
    </div>
  );
}

export default AnalyzePoem;






// import React from 'react';
// import { useLocation } from 'react-router-dom';
// import { v4 as uuidv4 } from 'uuid';

// function AnalyzePoem() {
// 	const location = useLocation();
//   const poem = location.state?.data;
// 	console.log(poem, 'poem in analyze poem');

// 	return (
// 		<div className="container-fluid  text-center">
// 			<h1>{poem.title}</h1>
// 			<h2>{poem.author}</h2>
// 			{poem.lines.map((line) => 
// 				<p key={uuidv4()}>{line}</p>
// 			)}
// 		</div>
// 	);
// }

// export default AnalyzePoem;
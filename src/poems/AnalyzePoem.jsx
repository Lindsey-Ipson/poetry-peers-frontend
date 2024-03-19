import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { getOrAddPoemToDb } from './poemUtils';

function AnalyzePoem() {
  const location = useLocation();
  const initialState = location.state?.data;

  const [poem, setPoem] = useState(initialState);

  useEffect(() => {
    const fetchPoem = async () => {
      try {
        const updatedPoem = await getOrAddPoemToDb(initialState);
        setPoem(updatedPoem);
      } catch (error) {
        console.error("Failed to fetch or add poem", error);
      }
    };

    fetchPoem();
  }, [initialState]);

  // Function to handle text selection
  const handleTextSelection = (e) => {
    console.log(e, 'e')
    console.log(e.target, 'e.target')
    console.log(e.target.data, 'e.target.data-key')
    const selectedElement = e.target;
    const key = selectedElement.getAttribute('data-key');
    console.log("Key of selected <p> tag:", key);


    const selection = window.getSelection();
    console.log(selection, 'selection')
    if (selection && selection.toString()) {
      const range = selection.getRangeAt(0);
      console.log(range, 'range')
      const selectedElements = range.cloneContents().querySelectorAll('p');
      console.log(selectedElements, 'selectedElements')
      const selectedIndices = Array.from(selectedElements).map(element => parseInt(element.getAttribute('data-key')));
      console.log("Indices of selected lines:", selectedIndices);
      if (!selectedIndices.length) {
        const selection = window.getSelection();
        if (selection && selection.toString()) {
          const selectedText = selection.toString();
          const selectedIndices = [];
          poem.lines.forEach((line, index) => {
            if (line.includes(selectedText)) {
              selectedIndices.push(index);
            }
          });
          console.log("Indices of selected lines:", selectedIndices);
        }
      }
    }
  };

  if (!poem) {
    return <div>Loading...</div>;
  }

  return (
    <div className="AnalyzePoem container-fluid text-center">
      <h1>{poem.title}</h1> 
      <h2>{poem.author}</h2>
      <div className="AnalyzePoems-poemLines" onMouseUp={handleTextSelection}>
        {poem.lines.map((line, index) => 
          <p key={index} data-key={index}>{line}</p>
        )}
      </div>
    </div>
  );
}

export default AnalyzePoem;

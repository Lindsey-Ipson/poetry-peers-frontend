import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { getOrAddPoemToDb } from './poemUtils';

function AnalyzePoem () {
  const location = useLocation();
  const initialState = location.state?.data;
  
  const [poem, setPoem] = useState(initialState);

  // useEffect to fetch the poem data asynchronously
  useEffect(() => {
    console.log('in useEffect 1')
    const fetchPoem = async () => {
      try {
        const updatedPoem = await getOrAddPoemToDb(initialState);
        console.log(updatedPoem, 'poem in analyze poem after getOrAddPoemToDb');
        setPoem(updatedPoem); // Update the poem state
      } catch (error) {
        console.error("Failed to fetch or add poem", error);
      }
    };

    fetchPoem();
  }, [initialState]); // Depend on initialState so this runs once upon component mount

  // Conditional rendering to handle the state before and after async operation
  if (!poem) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container-fluid text-center">
      <h1>{poem.title}</h1>
      <h2>{poem.author}</h2>
      {poem.lines.map((line, index) => 
        <p key={uuidv4()}>{line}</p>
      )}
    </div>
  );
}

export default AnalyzePoem;

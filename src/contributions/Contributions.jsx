import React from 'react';
import { useEffect, useState, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import BackendApi from '../common/backendApi';
import UserContext from '../common/UserContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Contributions.css';

function Contributions() {
  const [tags, setTags] = useState([]);
  const [uniquePoemIds, setUniquePoemIds] = useState(new Set());
  const [uniqueThemeNames, setUniqueThemeNames] = useState(new Set());
  const [deleteMessage, setDeleteMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    async function fetchTagsAndPoems () {
      let tagsData = await BackendApi.getTagsByUsername(currentUser.username);
      const localUniquePoemIds = new Set();
      const localUniqueThemeNames = new Set();

      for (let tag of tagsData) {
        let poemForTag = await BackendApi.getPoemById(tag.poemId);
        tag.poem = poemForTag;
        localUniquePoemIds.add(tag.poemId);
        localUniqueThemeNames.add(tag.themeName);
      }

      setTags(tagsData);
      setUniquePoemIds(localUniquePoemIds);
      setUniqueThemeNames(localUniqueThemeNames);
      setLoading(false);
    };

    fetchTagsAndPoems();
  }, []); 

  async function handleDeleteTag (themeName, poemId, highlightedLines) {
    await BackendApi.deleteTag(themeName, poemId, highlightedLines);
    let newTags = tags.filter(tag => !(tag.themeName === themeName && tag.poemId === poemId && JSON.stringify(tag.highlightedLines) === JSON.stringify(highlightedLines)));
    
    setTags(newTags);

    // Recompute uniquePoemIds and uniqueThemeNames based on newTags, and ensure React recognizes the Sets as new objects
    const updatedUniquePoemIds = new Set(newTags.map(tag => tag.poemId));
    const updatedUniqueThemeNames = new Set(newTags.map(tag => tag.themeName));
    setUniquePoemIds(new Set(updatedUniquePoemIds));
    setUniqueThemeNames(new Set(updatedUniqueThemeNames));

    // Navigate to the top of the page and show deletion success message
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setDeleteMessage('Tag successfully deleted.');
    setTimeout(() => setDeleteMessage(''), 3500); 
  };

  function handleRouteToPoem (poemId, poem, themeName) {
    return navigate(`/poems/${poemId}`, { state: { data: { poem, themeName } } });
  };

  function handleRouteToTheme (themeName) {
    return navigate(`/themes/${themeName}`);
  };

  return (
    <div className="Contributions">
      {loading && <div id="loading" className="Contributions-loading-message text-center mt-3">Please allow a moment for your contributions to be fetched...</div>}
      {!loading && (
        <div>
          <div className="Contributions-info">
            <h1>Your Contributions</h1>
            <h4>You've identified {uniqueThemeNames.size} {uniqueThemeNames.size === 1 ? 'theme' : 'themes'} in {uniquePoemIds.size} {uniquePoemIds.size === 1 ? 'poem' : 'poems'}</h4>
            <h5>Your total tags: {tags.length}</h5>
            <div className="Contributions-delete-message">
              {deleteMessage && <div className="alert alert-success">{deleteMessage}</div>}
            </div>
          </div>
  
          {tags.map((tag) => (
            <div className="Contributions-contribution card fade show d-block" tabIndex="-1" role="dialog" key={uuidv4()}>
              <div className="card-dialog card-xl" role="document">
                <div className="card-content">
                  <div className="card-header">
                    <h5 className="card-title"><b onClick={() => handleRouteToTheme(tag.themeName)}>{tag.themeName}</b> in &quot;{tag.poem.title}&quot; by {tag.poem.author}</h5>
                  </div>
                  <div className="card-body">
                    <div className="container-fluid">
                      <div className="row">
                        <div className="Contributions-poem-lines col-md verticalLineStyle"
                        onClick={() => handleRouteToPoem(tag.poemId, tag.poem, tag.themeName)}>
                          <h5>Relevant Lines:</h5>
                          {tag.highlightedLines[0] > 1 && (
                            <p className="text-center" style={{ fontWeight: "300" }}>
                              ...
                            </p>
                          )}
                          {tag.highlightedLines[0] > 0 && (
                            <p className="text-center" style={{ fontWeight: "300" }}>
                              {tag.poem.lines[tag.highlightedLines[0] - 1]}
                            </p>
                          )}
                          {tag.highlightedLines.map((index) => (
                            <p className="text-center" key={index}>
                              <strong>{tag.poem.lines[index]}</strong>
                            </p>
                          ))}
                          {tag.highlightedLines.length - 1 < tag.poem.lines.length && (
                            <p className="text-center" style={{ fontWeight: "300" }}>
                              {
                                tag.poem.lines[
                                  tag.highlightedLines[tag.highlightedLines.length - 1] + 1
                                ]
                              }
                            </p>
                          )}
                          {tag.highlightedLines.length < tag.poem.lines.length && (
                            <p className="text-center" style={{ fontWeight: "300" }}>
                              ...
                            </p>
                          )}
                        </div>
  
                        <div className="Contributions-tag-info col-md">
                          <h5>Your Analysis:</h5>
                          <p>{tag.analysis}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-footer d-flex justify-content-end">
                    <button type="button" className="btn btn-danger" data-dismiss="card" onClick={() => handleDeleteTag(tag.themeName, tag.poemId, tag.highlightedLines)}>
                      Delete tag
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
  
}

export default Contributions;

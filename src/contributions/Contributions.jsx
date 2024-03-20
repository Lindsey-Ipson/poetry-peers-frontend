import { useEffect, useState, useContext } from 'react';
// import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import BackendApi from '../common/backendApi';
// import './ThemeExplorer.css';
import UserContext from '../common/UserContext';
import 'bootstrap/dist/css/bootstrap.min.css';


function Contributions() {
	const [tags, setTags] = useState([]);

	const navigate = useNavigate();

	const { currentUser } = useContext(UserContext);

  useEffect(() => {
		const fetchTagsAndPoems = async () => {
			let tagsData = await BackendApi.getTagsByUsername(currentUser.username);
      for (let tag of tagsData) {
        let poemForTag = await BackendApi.getPoemById(tag.poemId);
        tag.poemTitle = poemForTag.title;
        tag.poemAuthor = poemForTag.author;
        tag.poemLines = poemForTag.lines;
      }
			setTags(tagsData);
		};
		fetchTagsAndPoems();
	}, []);


  const verticalLineStyle = {
    borderRight: "1px solid rgb(230, 230, 230)",
  };


  const deleteATag = async (themeName, poemId, highlightedLines) => {
    try {
      const response = await BackendApi.deleteTag(themeName, poemId, highlightedLines);
      return response; // return the response to use it when the promise resolves
    } catch (error) {
      console.error(error);
    }
  };
  
  // Call the deleteATag function correctly within an async context
  (async () => {
    try {
      const response = await deleteATag('Sundays', 'd5a8e8810af0a465', [0,1]);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  })();
  


    
    // Assuming 'deleteATag' is being called with the correct parameters somewhere in the code.
    



  return (
    // <div className="Contributions">
    //   <h1>Your Conributions</h1>
    //   {tags.map((tag) => (
    //     <div key={uuidv4()}>
    //       <p>You identified <b>{tag.themeName}</b> in <i>{tag.poemTitle}</i> by {tag.poemAuthor}</p>
    //       <p>{tag.highlightedLines}</p>
    //     </div>
    //   ))
    //   }
    // </div>



<div className="CreateTagForm">
      <div
        className="card fade show d-block"
        tabIndex="-1"
        role="dialog"
        style={{ backgroundColor: "rgba(0,0,0,0.5)"}}
      >
        <div className="card-dialog card-xl" role="document">
          <div className="card-content">
            <div className="card-header">
              <h5 className="card-title">Create a new tag</h5>
            </div>
            <div className="card-body">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-lg" style={verticalLineStyle}>
                    <h1>Left side</h1>
                  </div>



                  <div className="col-lg">
                    <form>
                      <h5>Right side</h5>
  
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="card"
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>


  );
}

export default Contributions;



import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import backendApi from "../common/backendApi";

function CreateTagForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialState = location.state?.data;
  const [themes, setThemes] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [customTheme, setCustomTheme] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [show, setShow] = useState(true);

  const handleClose = () => {
		setShow(false);
		navigate(`/poems/${poem.id}`, { state: { data: poem } });
	}


  const handleShow = () => setShow(true);

  const { selectedIndices, poem, currentUser } = initialState || {};

  useEffect(() => {
    console.log("Component mounted");

    const fetchThemes = async () => {
      try {
        const themesData = await backendApi.getThemes();

        setThemes(
          themesData.map((theme) => {
            return theme.name;
          })
        );
        setSelectedTheme(themesData[0].name);
      } catch (error) {
        console.error("Failed to fetch themes:", error);
      }
    };

    fetchThemes();
  }, [initialState]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    let finalTheme = selectedTheme || customTheme; // Use selected theme or custom theme

    if (themes && !themes.includes(finalTheme)) {
      try {
        // Add new theme to database and update finalTheme to be returned new theme name -- necessary since lowercased first letters of each word will be uppercased before being added to database
        const themeResponse = await backendApi.addTheme({ name: finalTheme });
        finalTheme = themeResponse.name;
      } catch (error) {
        console.error("Failed to add theme:", error);
      }
    }

    try {
      await backendApi.addTag({
        themeName: finalTheme,
        poemId: poem.id,
        highlightedLines: selectedIndices,
        analysis: analysis,
        username: currentUser.username,
      });
    } catch (error) {
      console.error("Failed to add tag:", error);
    }

    // Redirect to poem page
    navigate(`/poems/${poem.id}`, { state: { data: poem } });
  };

  const handleThemeChange = (event) => {
    console.log(event.target.value);
    console.log(themes);
    setSelectedTheme(event.target.value);
  };

  const handleCustomThemeChange = (event) => {
    setCustomTheme(event.target.value);
  };

  const handleAnalysisChange = (event) => {
    setAnalysis(event.target.value);
  };

  const verticalLineStyle = {
    borderRight: "1px solid rgb(230, 230, 230)",
  };

  return (
    <div className="CreateTagForm">
      <div
        className={show ? "modal fade show d-block" : "modal fade"}
        tabIndex="-1"
        role="dialog"
        style={{ backgroundColor: show ? "rgba(0,0,0,0.5)" : "" }}
      >
        <div className="modal-dialog modal-xl" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Create a new tag</h5>
            </div>
            <div className="modal-body">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-lg" style={verticalLineStyle}>
                    <h5>
                      &quot;{poem.title}&quot; by {poem.author}
                    </h5>
                    {selectedIndices[0] > 1 && (
                      <p className="text-center" style={{ fontWeight: "300" }}>
                        ...
                      </p>
                    )}
                    {selectedIndices[0] > 0 && (
                      <p className="text-center" style={{ fontWeight: "300" }}>
                        {poem.lines[selectedIndices[0] - 1]}
                      </p>
                    )}
                    {selectedIndices.map((index) => (
                      <p className="text-center" key={index}>
                        <strong>{poem.lines[index]}</strong>
                      </p>
                    ))}
                    {selectedIndices.length - 1 < poem.lines.length && (
                      <p className="text-center" style={{ fontWeight: "300" }}>
                        {
                          poem.lines[
                            selectedIndices[selectedIndices.length - 1] + 1
                          ]
                        }
                      </p>
                    )}
                    {selectedIndices.length < poem.lines.length && (
                      <p className="text-center" style={{ fontWeight: "300" }}>
                        ...
                      </p>
                    )}
                  </div>
                  <div className="col-lg">
                    <form onSubmit={handleSubmit}>
                      <h5>Select a theme:</h5>
                      {themes &&
                        themes.map((theme, index) => (
                          <div key={index} className="form-check-inline">
                            <input
                              type="radio"
                              id={`theme-${index}`}
                              name="theme"
                              value={theme}
                              checked={selectedTheme === theme}
                              onChange={handleThemeChange}
                              className="form-check-input"
                            />
                            <label
                              className="form-check-label"
                              htmlFor={`theme-${index}`}
                            >
                              {"  "}
                              {theme}
                            </label>
                          </div>
                        ))}
                      <br></br>
                      <input
                        type="radio"
                        id="custom-theme"
                        name="theme"
                        value=""
                        checked={!selectedTheme && !customTheme}
                        onChange={() => setSelectedTheme("")} // Unselect theme when custom input is used
                        className="form-check-input"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="custom-theme"
                      >
                        {"  Other"}
                      </label>
                      <input
                        type="text"
                        id="custom-theme-input"
                        value={customTheme}
                        onChange={handleCustomThemeChange}
                        hidden={!!selectedTheme} // Disable custom input if a theme is selected
                        className="form-control"
                        placeholder="Create a new theme here"
                      />
                      <hr></hr>
                      <h5>Provide your analysis:</h5>
                      <textarea
                        type="text"
                        id="analysis"
                        value={analysis}
                        onChange={handleAnalysisChange}
                        className="form-control"
                        rows="10"
                        placeholder="Please explain how this theme pertains to these lines, and how it contributes to the overall meaning of the poem."
                      />
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
                onClick={handleClose}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit}
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

export default CreateTagForm;



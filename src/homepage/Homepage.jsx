import React from "react";
import "./Homepage.css";

function Homepage() {
  return (
    <div className="Homepage">
      <div className="Homepage-ContentBox">
        <h1>Welcome to Poetry Peers!</h1>
        <h3>Start analyzing poetry alongside the Poetry Peers community today!</h3>
        
        <p>Explore new poems through the Poems tab, where you can read twenty new random poems each time!</p>
          
        <p>If you find any themes you'd like to tag, simply highlight the relevant lines and provide your analysis for other members to see!</p>
           
        <p>Or, explore different themes in poetry through the Themes tab. You can review or delete any tags you've made through the Contributions tab.</p>
      </div>
    </div>
  );
}

export default Homepage;
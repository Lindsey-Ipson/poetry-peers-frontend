import React from "react";
import "./Homepage.css";

function Homepage() {
  return (
    <div className="Homepage">
      <div className="Homepage-ContentBox">
        <h1>Welcome to Poetry Peers!</h1>
        <h3>Start analyzing poetry alongside the Poetry Peers community today!</h3>
        
        <p>Explore new poems in the Poems tab, where you can read twenty new random poems each time, or search by poem title.</p>
          
        <p>If you find any themes you'd like to tag in any poem, simply highlight the relevant lines and provide your analysis for other members to see!</p>
           
        <p>You can also explore different themes or search for specific themes others have tagged in the Themes tab.</p>
        
        <p>To review or delete tags you've made, see the Contributions tab.</p>
      </div>
    </div>
  );
}

export default Homepage;
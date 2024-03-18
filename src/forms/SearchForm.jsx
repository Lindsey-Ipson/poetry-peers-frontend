import React from "react";
import "./SearchForm.css";
import useFields from "../hooks/useFields";

const SearchForm = ({ searchItems }) => {
  const initialState = {
    term: '',
  };

  const [formData, handleChange] = useFields(initialState);

  const handleSubmit = (evt) => {
    evt.preventDefault();
    searchItems(formData.term.trim() || undefined);
  };

  return (
    <form onSubmit={handleSubmit} className="SearchForm">
      <input
        id="term"
        name="term"
        value={formData.term}
        onChange={handleChange}
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default SearchForm;
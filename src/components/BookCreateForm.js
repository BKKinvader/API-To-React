import React, { useState } from "react";
import Constants from "../utilities/Constants";
import PropTypes from "prop-types";
import "../App.css";

export default function BookCreateForm(props) {
  const initialFormData = {
    title: "",
    author: "",
    genre: "",
    description: "",
    isAvailable: true,
    created: new Date().toISOString().substr(0, 10), // Set the initial date value as a string in "YYYY-MM-DD" format
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const bookToCreate = {
      id: 0,
      title: formData.title,
      author: formData.author,
      genre: formData.genre,
      description: formData.description,
      IsAvailable: formData.isAvailable,
      created: formData.created,
    };

    const url = Constants.API_URL_CREATE_BOOK;
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookToCreate),
    })
      .then((response) => response.json())
      .then((booksFromServer) => {
        console.log(booksFromServer); // Log the entire response object for debugging
        // Reset the form after successful submission
        setFormData(initialFormData);
        // Call the callback function with the created book data
        props.onBookCreated(bookToCreate);
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  };

  return (
    <div className="w-50 ">
      <form className="w-100 px-5" onSubmit={handleSubmit}>
      <h1 className="mt-5">Create new book</h1>
      <div className="mb-3">
          <label htmlFor="title" className="form-label h3">
            Title
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="author" className="form-label h3">
            Author
          </label>
          <input
            type="text"
            className="form-control"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="genre" className="form-label h3">
            Genre
          </label>
          <input
            type="text"
            className="form-control"
            id="genre"
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label h3">
            Description
          </label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div className="mt-5">
          <label className="h3 form-label">Available</label>
          <input
            name="isAvailable"
            className="checkboxDesign"
            type="checkbox"
            checked={formData.isAvailable}
            onChange={handleChange}
          />
        </div>

        <div className="mt-5">
          <label className="h3 form-label">Created Date</label>
          <input
            value={formData.created}
            name="created"
            type="date"
            className="form-control"
            onChange={handleChange}
            required
            max={new Date().toISOString().substr(0, 10)}
          />
        </div>

        <button
          onClick={handleSubmit}
          className="btn btn-dark btn-lg w-100 mt-5"
        >
          Submit
        </button>
        <button
          onClick={() => props.onBookCreated(null)}
          className="btn btn-secondary btn-lg w-100 mt-3"
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

// Define propTypes for the component
BookCreateForm.propTypes = {
  onBookCreated: PropTypes.func.isRequired,
};

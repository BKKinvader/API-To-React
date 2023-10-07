import React, { useState } from "react";
import Constants from "../utilities/Constants";
import PropTypes from "prop-types";
import "../App.css";

export default function BookUpdateForm(props) {
  const initialFormData = {
    id: props.book.id,
    title: props.book.title,
    author: props.book.author,
    genre: props.book.genre,
    description: props.book.description,
    isAvailable: props.book.isAvailable,
    created: props.book.created,
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

    // Format the date as "yyyy-MM-dd"
    const formattedDate = new Date(formData.created)
      .toISOString()
      .substr(0, 10);

    const bookToUpdate = {
      id: formData.id,
      title: formData.title,
      author: formData.author,
      genre: formData.genre,
      description: formData.description,
      IsAvailable: formData.isAvailable,
      created: formattedDate,
    };

    const url = Constants.API_URL_UPDATE_BOOK;
    fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookToUpdate),
    })
      .then((response) => response.json())
      .then((booksFromServer) => {
        console.log(booksFromServer);
        setFormData(initialFormData);
        props.onBookUpdate(bookToUpdate);
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  };

  return (
    <div className="w-50 ">
      <form className="w-100 px-5" onSubmit={handleSubmit}>
        <h1 className="mt-5">Update book titled "{props.book.title}"</h1>
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
            value={formData.created.substring(0, 10)}
            name="created"
            type="date"
            className="form-control"
            onChange={handleChange}
            required
            max={new Date().toISOString().substr(0, 10)}
          />
        </div>
        <input type="hidden" name="id" value={props.book.id} />
        <button
          type="submit"
          className="btn btn-dark btn-lg w-100 mt-5"
        >
          Submit
        </button>
        <button
          type="button" // Change the type to "button" to prevent form submission
          onClick={() => props.onBookUpdate(null)}
          className="btn btn-secondary btn-lg w-100 mt-3"
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

// Define propTypes for the component
BookUpdateForm.propTypes = {
  onBookUpdate: PropTypes.func.isRequired,
};

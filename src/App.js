import React, { useEffect, useState } from "react";
import Constants from "./utilities/Constants";
import BookCreateForm from "./components/BookCreateForm";
import BookUpdateForm from "./components/BookUpdateForm";
import 'bootstrap/dist/css/bootstrap.css';

export default function App() {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showingCreateNewBookForm, setShowingCreateNewBookForm] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null); // Add selectedBook state
  const [showingUpdateBookForm, setShowingUpdateBookForm] = useState(false); // Add showingUpdateBookForm state
  


  useEffect(() => {
    if (isLoading) {
      BookList();
    }
  }, [isLoading]);

  function BookList() {
    const apiUrl = Constants.API_URL_GET_ALL_BOOKS;

    fetch(apiUrl, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((responseObj) => {
        console.log(responseObj); // Log the entire response object for debugging
        if (responseObj.isSuccess) {
          // Access the array of books from the 'result' property
          const booksFromServer = responseObj.result;
          console.log(booksFromServer); // Log the books array
          setBooks(booksFromServer);
        } else {
          // Handle any errors or error messages if needed
          console.error("Request was not successful.");
        }
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      })
      .finally(() => {
        setIsLoading(false); // Set this state to true to show the form
      });
  }

  function handleGetBooksClick() {
    setIsLoading(true); // Set isLoading to true when the "Get Books from server" button is clicked
  }

  function handleCreateNewBookClick() {
    setShowingCreateNewBookForm(true); // Set this state to true to show the form
  }

  function handleUpdateBookClick(book) {
    setSelectedBook(book); // Set the selected book when "Update" is clicked
    setShowingUpdateBookForm(true); // Show the update form
  }

  function deleteBook(bookId){
    const apiUrl = `${Constants.API_URL_DELETE_BOOK_BY_ID}/${bookId}`;

    fetch(apiUrl, {
      method: "DELETE",
    })
    .then((response) => {
      if(!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((responseObj) => {
      console.log(responseObj);
      if (responseObj.isSuccess){
        const booksFromServer = responseObj.result;
        console.log(booksFromServer);
        setBooks(booksFromServer)
      }
      else{
        console.error("Request was not successful.");
      }
    })
    .catch((error) => {
      console.error(error);
      alert("An error occurred while deleting the book");
    })
    .finally(() => {
      setIsLoading(false);
    });
  }

  

  return (
    <div className="container">
      <div className="row min-vh-100">
        <div className="col d-flex flex-column justify-content-center align-items-center">
          {showingCreateNewBookForm === false && (
            <div className="text-center;">
              <h1 style={{ textAlign: 'center' }}>Welcome To Library Of Junior Dev</h1>
              <div className="mt-5">
                <button
                  onClick={handleGetBooksClick}
                  className="btn btn-dark btn-lg w-100" >Get Books from server</button>
                <button onClick={handleCreateNewBookClick} className="btn btn-secondary btn-lg w-100 mt-4">Create new book</button>
              </div>
            </div>
          )}

          {isLoading && <p>Loading...</p>}
          {!isLoading && books && books.length > 0 && !showingCreateNewBookForm && !showingUpdateBookForm && renderLibraryTable()}
 
          {showingCreateNewBookForm && (
            <BookCreateForm onBookCreated={onBookCreated} />
          )}
          {showingUpdateBookForm && ( 
            <BookUpdateForm
              book={selectedBook}
              onBookUpdate={onBookUpdate}
            />
          )}

        </div>
      </div>
    </div>
  );

  function renderLibraryTable() {
    console.log("Inside renderLibraryTable");
    console.log("Number of books:", books.length);
    return (
      <div className="table-responsive mt-5">
        <table className="table table-bordered border-dark">
          <thead>
            <tr>
            
              <th scope="col">Title</th>
              <th scope="col">Author</th>
              <th scope="col">Genre</th>
              <th scope="col">Description</th>
              <th scope="col">Available</th>
              <th scope="col">Created</th>
              <th scope="col">Edit</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id}>
              <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.genre}</td>
                <td>{book.description}</td>
                <td>
                  {book.isAvailable ? (
                    <span className="badge bg-success">Available</span>
                  ) : (
                    <span className="badge bg-danger">Not Available</span>
                  )}
                </td>
                <td>{book.created}</td>
                <td>
                <button
                    className="btn btn-dark btn-lg mx-3 my-3"
                    onClick={() => handleUpdateBookClick(book)} 
                  >
                    Update
                  </button>
                  <button onClick={() => {if(window.confirm(`Are you sure you want to delete "${book.title}" ?`)) deleteBook(book.id)}} className="btn btn-dark btn-lg mx-3 my-3">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          onClick={() => setBooks([])}
          className="btn btn-dark btn-lg w-100"
        >
          Empty React book array
        </button>
      </div>
    );
  }

  // Close the BookCreateForm
  function onBookCreated(createdBook) {
    console.log("OnBookCreate")
    setShowingCreateNewBookForm(false);
    if (createdBook === null) {
      return;
    }
    alert(
      `Book successfully created. After clicking ok, your new post title "${createdBook.title}" will show up in the table below.`
    );
    BookList();
  }

  // Close the BookUpdateForm
  function onBookUpdate(updatedBook) {
    
    setShowingUpdateBookForm(false);
  
    if (updatedBook === null) {
      return;
    }
    alert(`Book successfully updated. Title: "${updatedBook.title}"`);
    BookList();
  }
}

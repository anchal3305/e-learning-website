import React, { useState } from 'react';
import styles from '../../pages/Notes/UpdateNote.module.css';

const UpdateNote = ({ setOpen, setNotes }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const newNote = { title, content };
  
    // Get the token from localStorage (make sure you store it during login)
    const token = localStorage.getItem('authToken');
  
    if (!token) {
      console.error("No authentication token found");
      alert("You need to log in to create a note.");
      return;
    }
  
    try {
      const response = await fetch('http://127.0.0.1:8000/api/notes/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Add the token to the Authorization header
        },
        body: JSON.stringify(newNote),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Note created:', data);
        setOpen(false); // Close the modal after saving
        setNotes(prevNotes => [...prevNotes, data]); // Update notes list
      } else {
        const errorData = await response.json();
        console.error('Error details:', errorData);
        alert(`Error: ${errorData.detail || 'Something went wrong!'}`);
      }
    } catch (error) {
      console.error('Network Error:', error);
      alert('Network error occurred.');
    }
  };  

  return (
    <div className={`${styles.updateNote} modal modal-sheet position-fixed d-block p-4 py-md-5`} tabIndex="-1" role="dialog" id="modalSheet">
      <div className="modal-dialog" role="document">
        <div className="modal-content rounded-4 shadow">
          <div className="modal-header border-bottom-0">
            <h1 className="modal-title fs-5">Add Note</h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={() => setOpen(false)}
            ></button>
          </div>

          <form className="updateForm" onSubmit={handleSubmit}>
            <div className="modal-body py-2">
              <div className="mb-3">
                <label htmlFor="noteTitle" className="form-label">
                  Title
                </label>
                <input
                  type="text"
                  id="noteTitle"
                  className="form-control"
                  placeholder="Enter Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="noteContent" className="form-label">
                  Content
                </label>
                <textarea
                  className="form-control"
                  id="noteContent"
                  rows="10"
                  placeholder="Enter your Note"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                ></textarea>
              </div>
            </div>

            <div className="modal-footer d-flex flex-row align-items-center justify-content-center gap-2 pb-3 border-top-0">
              <button
                type="button"
                className="btn btn-lg btn-secondary"
                onClick={() => {
                  setTitle('');
                  setContent('');
                }}
              >
                Clear
              </button>
              <button type="submit" className="btn btn-lg btn-primary">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateNote;

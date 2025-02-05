import React, { useState, useEffect } from 'react';
import { IoSearchSharp } from 'react-icons/io5';
import { FaPlus } from 'react-icons/fa6';
import NoteCard from '../../components/Notes/NoteCard';
import axios from 'axios';
import styles from '../../pages/Notes/Notes.module.css';
import UpdateNote from '../../pages/Notes/UpdateNote';
import NoteDetails from '../../pages/Notes/NoteDetails';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [onCreateNote, setOnCreateNote] = useState(false);
  const [onViewNote, setOnViewNote] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  // Fetch notes from the backend
  useEffect(() => {
    axios
      .get('http://localhost:8000/api/notes/')  // Adjust with your API URL
      .then((response) => {
        setNotes(response.data);
      })
      .catch((error) => {
        console.error('Error fetching notes:', error);
      });
  }, []);

  const handleViewNote = (note) => {
    setSelectedNote(note);
    setOnViewNote(true);
  };

  return (
    <div className={styles.wrapperContainer}>
      <div className={`${styles.notesNavbar} shadow p-3 mb-5 bg-body-tertiary rounded`}>
        <div className="logo">Notes</div>
        <div className={styles.navPlusIcon} onClick={() => setOnCreateNote(true)}>
          <FaPlus />
        </div>
      </div>

      <div className="notesContainer">
        <div className={styles.searchWrapper}>
          <input type="text" placeholder="Search notes" className={styles.searchInput}></input>
          <button type="button" className={styles.searchButton}>
            <IoSearchSharp />
          </button>
        </div>

        <div className={styles.notesWrapper}>
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} setView={() => handleViewNote(note)} />
          ))}
        </div>
        {onCreateNote && <UpdateNote setOpen={setOnCreateNote} />}
        {onViewNote && <NoteDetails setView={setOnViewNote} selectedNote={selectedNote} />}
      </div>
    </div>
  );
};

export default Notes;

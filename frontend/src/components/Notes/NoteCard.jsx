import React from 'react';
import { FiEdit } from 'react-icons/fi';
import { MdDelete } from 'react-icons/md';
import axios from 'axios';
import styles from '../../components/Notes/NoteCard.module.css';

const NoteCard = ({ note, setView }) => {
  const handleDelete = () => {
    axios
      .delete(`http://localhost:8000/api/notes/${note.id}/`)  // Adjust with your API URL
      .then((response) => {
        console.log('Note deleted:', response.data);
        // Optionally, trigger re-fetch of notes or update state to remove the note from the UI
      })
      .catch((error) => {
        console.error('Error deleting note:', error);
      });
  };

  return (
    <div className={`shadow-sm p-3 mb-5 bg-body-tertiary rounded border border-1 ${styles.noteCardContainer}`}>
      <div className={styles.noteCardWrapper}>
        <h2 className={styles.cardTitle} onClick={() => setView(true)}>
          {note.title}
        </h2>

        <p className="cardBody">{note.content}</p>

        <span className={styles.cardDetails} onClick={() => setView(true)}>
          Read More
        </span>

        <div className={styles.cardFooter}>
          <span>{new Date(note.created_at).toDateString()}</span>

          <div className={styles.cardActions}>
            <div className={`${styles.actionItem} ${styles.editIcon}`}>
              <FiEdit />
            </div>
            <div className={`${styles.actionItem} ${styles.deleteIcon}`} onClick={handleDelete}>
              <MdDelete />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;

import React from 'react';
import { IoArrowBack } from 'react-icons/io5';
import styles from '../../pages/Notes/NoteDetails.module.css';

const NoteDetails = ({ setView, selectedNote }) => {
  return (
    <div className="noteDetails d-flex justify-content-center align-items-center position-fixed w-100 h-100 top-0 start-0">
      <div className="detailsWrapper shadow-sm p-3 mb-5 bg-body-tertiary rounded border border-1 w-25">
        <div className={styles.backButton} onClick={() => setView(false)}>
          <IoArrowBack />
        </div>

        <h2 className="detailsTitle">{selectedNote?.title}</h2>

        <div className="detailsTimeline mb-3">
          <span>{new Date(selectedNote?.created_at).toDateString()}</span>
        </div>

        <p className="detailsBody">{selectedNote?.content}</p>
      </div>
    </div>
  );
};

export default NoteDetails;

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import styles from './Forum.module.css';
import Modal from '../../components/Modal/Modal';
import { AuthContext } from '../../context/AuthContext';

const Forum = () => {
  const [forums, setForums] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [newForum, setNewForum] = useState({ title: '', description: '' });
  const { user } = useContext(AuthContext); // Assuming AuthContext provides user info

  useEffect(() => {
    if (user) {
      fetchForums();
    }
  }, [user]);

  const fetchForums = async () => {
    if (!user) {
      console.error('User is not authenticated');
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`, // Include the token in the headers
        },
      };
      const response = await axios.get('http://localhost:8000/api/forum/categories/', config);
      if (Array.isArray(response.data)) {
        setForums(response.data);
      } else {
        console.error('Fetched data is not an array:', response.data);
      }
    } catch (error) {
      console.error('Error fetching forums:', error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewForum({ ...newForum, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      console.error('User is not authenticated');
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`, // Include the token in the headers
        },
      };
      await axios.post('http://localhost:8000/api/forum/categories/', newForum, config);
      setNewForum({ title: '', description: '' });
      setShowForm(false);
      fetchForums();
    } catch (error) {
      console.error('Error creating forum:', error);
    }
  };

  const filteredForums = forums.filter(forum =>
    forum.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.forumContainer}>
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search forums..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <button className={styles.addButton} onClick={() => setShowForm(true)}>+</button>
      </div>
      <Modal show={showForm} onClose={() => setShowForm(false)}>
        <form className={styles.forumForm} onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={newForum.title}
            onChange={handleInputChange}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={newForum.description}
            onChange={handleInputChange}
            required
          />
          <button type="submit">Create Forum</button>
        </form>
      </Modal>
      <div className={styles.forumList}>
        {filteredForums.map(forum => (
          <div key={forum.id} className={styles.forumItem}>
            <h3>{forum.title}</h3>
            <p>{forum.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forum;
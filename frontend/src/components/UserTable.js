import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';


function UserTable() {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3001/api/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        setUsers(response.data);
        
      } catch (error) {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          navigate('/login');
        } else {
          console.error('Error fetching users:', error);
        }
      }
    };

    fetchUsers();
  }, [navigate]);

  const handleBlock = async () => {
    const token = localStorage.getItem('token');
    try {
      for (const userId of selectedUsers) {
        await axios.put(`http://localhost:3001/api/users/${userId}/block`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          selectedUsers.includes(user.id) ? { ...user, blocked: true } : user
        )
      );
      setSelectedUsers([]);
      setIsAllSelected(false);
    } catch (error) {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        navigate('/login');
      } else {
        console.error('Error blocking users:', error);
      }
    }
  };

  const handleUnblock = async () => {
    const token = localStorage.getItem('token');
    try {
      for (const userId of selectedUsers) {
        await axios.put(`http://localhost:3001/api/users/${userId}/unblock`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          selectedUsers.includes(user.id) ? { ...user, blocked: false } : user
        )
      );
      setSelectedUsers([]);
      setIsAllSelected(false);
    } catch (error) {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        navigate('/login');
      } else {
        console.error('Error unblocking users:', error);
      }
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    try {
      for (const userId of selectedUsers) {
        await axios.delete(`http://localhost:3001/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setUsers((prevUsers) =>
        prevUsers.filter((user) => !selectedUsers.includes(user.id))
      );
      setSelectedUsers([]);
      setIsAllSelected(false);
    } catch (error) {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        navigate('/login');
      } else {
        console.error('Error deleting users:', error);
      }
    }
  };

  const toggleSelection = (userId) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId]
    );
  };

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map((user) => user.id));
    }
    setIsAllSelected(!isAllSelected);
  };

  return (
    <div className="container-fluid position-relative">
      <div className="position-absolute top-0 start-0 p-3">
        <button
          type="button"
          className="btn btn-outline-primary me-2 bi bi-lock-fill"
          data-bs-toggle="tooltip"
          data-bs-placement="bottom"
          title="block"
          onClick={handleBlock}
        >
          Block
        </button>
        <button
          type="button"
          className="btn btn-outline-primary me-2 bi bi-unlock-fill"
          data-bs-toggle="tooltip"
          data-bs-placement="bottom"
          title="unblock"
          onClick={handleUnblock}
        >
        </button>
        <button type="button" 
        className="btn btn-outline-danger bi bi-trash3"
        data-bs-toggle="tooltip"
          data-bs-placement="bottom"
          title="delete" 
        onClick={handleDelete}>
        </button>
      </div>
      <div className="mt-5 pt-5">
        <table className="table">
          <thead>
            <tr>
              <th>
                <i
                  className={`bi ${isAllSelected ? 'bi-x-square' : 'bi-check2-square'}`}
                  data-bs-toggle="tooltip"
                  data-bs-placement="bottom"
                  title={`${isAllSelected ? 'deselect all' : 'select all'}`}
                  style={{ cursor: 'pointer' }}
                  onClick={toggleSelectAll}
                ></i>
              </th>
              <th>Name</th>
              <th>Email</th>
              <th>Last Seen</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <input
                    type="checkbox"
                    style={{ cursor: 'pointer' }}
                    data-bs-toggle="tooltip"
                    data-bs-placement="bottom"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => toggleSelection(user.id)}
                    title={selectedUsers.includes(user.id) ? "uncheck" : "check"}
                  />
                </td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{moment(user.lastLogin).fromNow()}</td>
                <td>{user.blocked ? 'Blocked' : 'Active'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserTable;

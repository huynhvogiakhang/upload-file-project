import React, { useState } from 'react';
import axios from 'axios';

const UploadMenu: React.FC = () => {
  const [accessToken, setAccessToken] = useState('');
  const [username, setUsername] = useState('');
  const [feedback, setFeedback] = useState('');
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://127.0.0.1:8081/user/login', { username });
      const token = response.data.data.accessToken;
      setAccessToken(token);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = () => {
    setAccessToken('');
  };

  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://127.0.0.1:8081/file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${accessToken}`
        },
      });

      const data = response.data;
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const fetchData = async (page: number, size: number) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8081/file?page=${page}&size=${size}`, {
                headers: {
                  Authorization: `Bearer ${accessToken}`
                }
              });
              const { userData, totalPages } = response.data.data;
              setData(userData);
              setTotalPages(totalPages);
              setCurrentPage(page);
        } catch (error) {
        console.error('Error:', error);
        }
    }   
    
    const handleNextPage = () => {
        const nextPage = currentPage + 1;
        if (nextPage <= totalPages) {
          fetchData(nextPage, 10); 
        }
      };
    
      const handlePreviousPage = () => {
        const previousPage = currentPage - 1;
        if (previousPage >= 1) {
          fetchData(previousPage, 10); 
        }
      };

      const handleFeedbackChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFeedback(event.target.value);
      };
    
      const handleFeedbackSubmit = async () => {
        try {
          const response = await axios.post('http://127.0.0.1:8081/feedback', { feedBack: feedback }, {
            headers: {              
              Authorization: `Bearer ${accessToken}`
            },
          });          
          alert('Feedback sent successfully!');
        } catch (error) {
          console.error(error);
          alert('Failed to send feedback.');
        }
      };
    
  return (
    <div>
      {!accessToken ? (
        <form onSubmit={handleLogin}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
          <button type="submit">Login</button>
        </form>
      ) : (
        
        <div>          
        <h1>Get data uploaded to the system</h1>
          <button onClick={() => fetchData(1,10)}>Fetch Data</button>
            <table>
                <thead>
                <tr>
                    <th>Post ID</th>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Body</th>
                    <th>User ID</th>
                </tr>
                </thead>
                <tbody>
                {data &&
                    data.map((item: any) => (
                    <tr key={item.id}>
                        <td>{item.postId}</td>
                        <td>{item.id}</td>
                        <td>{item.name}</td>
                        <td>{item.email}</td>
                        <td>{item.body}</td>
                        <td>{item.userId}</td>
                    </tr>
                    ))}
                </tbody>
            </table>
            <div>
                <button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous Page</button>
                <span>Page {currentPage} of {totalPages}</span>
                <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next Page</button>
            </div>
            <h1>Upload to the system</h1>
          <form onSubmit={handleUpload}>
            <input type="file" onChange={handleFileChange} />
            <button type="submit">Upload</button>
          </form>
          <h1>Feedback upload data performance</h1>
          <div>
            <textarea
                value={feedback}
                onChange={handleFeedbackChange}
                placeholder="Enter your feedback on the application's performance"
            ></textarea>
            <button onClick={handleFeedbackSubmit}>Send Feedback</button>
           </div>
        </div>
      )}
    </div>
  );
};

export default UploadMenu;
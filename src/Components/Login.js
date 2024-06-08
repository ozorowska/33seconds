import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/users/login', { username, password });
      onLogin(response.data);
      navigate('/quiz'); // Navigate after successful login
    } catch (err) {
      setError('Invalid username or password');
      console.error('Error logging in', err);
    }
  };

  return (
    
      <div className="row justify-content-center">
        <div className="col-md-6">
          
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    className="form-control"
                    id="floatingPassword"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-block mt-3">Login</button>
              </form>
              <p className="mt-3 text-center">
                Don't have an account? <button onClick={() => navigate('/register')} className="btn btn-link">Register</button>
              </p>
            </div>
          </div>
        </div>
      
   
  );
}

export default Login;

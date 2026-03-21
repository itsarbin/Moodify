import React from 'react'
import { useState } from 'react';
import '../styles/form.scss';
import { useAuth } from '../useAuth';
import { useNavigate } from 'react-router';

const Register = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const navigate = useNavigate();

  const { handleRegister } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission logic here
    try{
      const response = await handleRegister(name, email, password);
      navigate('/')

    }catch(err){
      alert(err.message)
    }

  };

  return (
    <main className='login-page'>
      <div className="form-container">
        <div className="form-header">
          <h2>Create account</h2>
          <p>Set up your Moodify account in a few quick steps.</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-field">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="submit-btn" type="submit">Create account</button>
        </form>
      </div>
    </main>
  )
}

export default Register
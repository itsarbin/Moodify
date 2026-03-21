import React from 'react'
import '../styles/form.scss';
import { useState } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../useAuth';
import { useNavigate } from 'react-router';
const Login = () => {

  const {handleLogin} = useAuth();
  const navigate = useNavigate();



  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")

  const handleSubmit = async (e)=>{
    e.preventDefault();
    try{
      await handleLogin(username, email, password);
      navigate('/')
    }catch(err){
      alert(err.message)
    }


  }



  return (
    <main className='login-page'>
      <div className="form-container">
        <div className="form-header">
          <h2>Login</h2>
          <p>Welcome back. Sign in to continue.</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-field">
            <label htmlFor="username">Username:</label>
            <input type="text" id="username"
            value={username}
            onChange={(e)=> setUsername(e.target.value)} />
          </div>
          <div className="form-field">
            <label htmlFor="password">Password:</label>
            <input type="password" id="password"
            value={password}
            onChange={(e)=> setPassword(e.target.value)}/>
          </div>
          <button className="submit-btn" type="submit">Login</button>
        </form>
        <p className='link'>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </main>
  )
}

export default Login
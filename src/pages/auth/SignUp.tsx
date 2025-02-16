import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../../config/encore';
import { saveAuthData } from '../../utils/auth';

const SignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await client.users.createUser({ email, password });
      saveAuthData(response);
      navigate('/');
    } catch (err) {
      setError('Failed to create account');
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const response = await client.users.googleLogin({ token: 'google-token' });
      saveAuthData(response);
      navigate('/');
    } catch (err) {
      setError('Google sign up failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Sign Up</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSignUp}>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-primary">
            Sign Up
          </button>
        </form>
        <div className="divider">or</div>
        <button onClick={handleGoogleSignUp} className="btn-google">
          Sign up with Google
        </button>
        <p className="auth-footer">
          Already have an account? <a href="/signin">Sign In</a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;

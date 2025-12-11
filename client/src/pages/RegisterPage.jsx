import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { username, email, password, confirmPassword } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await api.post('/auth/register', {
        username,
        email,
        password,
      });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-brand-dark mb-2">Create Account</h1>
          <p className="text-gray-500">Join the Gorama community</p>
        </div>

        {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-6 text-sm text-center">{error}</div>}
        
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={onChange}
              className="w-full px-6 py-4 rounded-full bg-brand-gray border-none focus:ring-2 focus:ring-brand-orange/20 outline-none transition-all placeholder-gray-400"
              placeholder="Full Name"
              required
            />
          </div>
          <div>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={onChange}
              className="w-full px-6 py-4 rounded-full bg-brand-gray border-none focus:ring-2 focus:ring-brand-orange/20 outline-none transition-all placeholder-gray-400"
              placeholder="Email Address"
              required
            />
          </div>
          <div>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={onChange}
              className="w-full px-6 py-4 rounded-full bg-brand-gray border-none focus:ring-2 focus:ring-brand-orange/20 outline-none transition-all placeholder-gray-400"
              placeholder="Password"
              required
            />
          </div>
          <div>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={onChange}
              className="w-full px-6 py-4 rounded-full bg-brand-gray border-none focus:ring-2 focus:ring-brand-orange/20 outline-none transition-all placeholder-gray-400"
              placeholder="Confirm Password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-brand-orange hover:bg-orange-600 text-white font-bold py-4 rounded-full shadow-lg transform transition hover:-translate-y-1 duration-200 mt-4"
          >
            Sign Up
          </button>
        </form>
        <div className="mt-8 text-center">
          <p className="text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-orange font-bold hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

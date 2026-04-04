import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store';
import apiClient from '../api/client';
import type { SignUpData } from '../types';
import { Mail, Lock, User, AlertCircle, UserPlus } from 'lucide-react';

export default function SignupPage() {
  const navigate = useNavigate();
  const { setUser, setToken } = useAuthStore();
  const [formData, setFormData] = useState<SignUpData>({
    username: '',
    email: '',
    password: '',
    full_name: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await apiClient.signup(formData);
      
      // Auto-login after signup
      const response = await apiClient.login({
        username: formData.username,
        password: formData.password,
      });
      setToken(response.access_token);
      
      const user = await apiClient.getCurrentUser();
      setUser(user);
      
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Signup failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements - Legal Network Theme */}
      <style>{`
        @keyframes pulse-node {
          0%, 100% { r: 3px; opacity: 0.2; }
          50% { r: 5px; opacity: 0.4; }
        }
        @keyframes flow-line {
          0%, 100% { stroke-dashoffset: 1000; opacity: 0.1; }
          50% { stroke-dashoffset: 0; opacity: 0.3; }
        }
        @keyframes icon-pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
          50% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
        }
        @keyframes title-glow {
          0%, 100% { text-shadow: 0 0 10px rgba(59, 130, 246, 0.3); }
          50% { text-shadow: 0 0 20px rgba(59, 130, 246, 0.6); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .icon-pulse {
          animation: icon-pulse 2.5s infinite;
        }
        .title-glow {
          animation: title-glow 3s ease-in-out infinite;
        }
        .form-item {
          animation: slide-up 0.6s ease-out backwards;
        }
        .form-item:nth-child(1) { animation-delay: 0.1s; }
        .form-item:nth-child(2) { animation-delay: 0.2s; }
        .form-item:nth-child(3) { animation-delay: 0.3s; }
        .form-item:nth-child(4) { animation-delay: 0.4s; }
        .form-item:nth-child(5) { animation-delay: 0.5s; }
        button:hover:not(:disabled) {
          background-color: #1e3a8a;
        }
      `}</style>

      {/* Legal Network SVG - Connected nodes representing AI knowledge network */}
      <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" preserveAspectRatio="xMidYMid slice">
        {/* Network Lines */}
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e40af" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        
        {/* Connecting lines forming a knowledge network */}
        <line x1="20%" y1="10%" x2="40%" y2="30%" stroke="url(#lineGradient)" strokeWidth="1.5" strokeDasharray="100" style={{animation: 'flow-line 15s infinite ease-in-out'}} />
        <line x1="40%" y1="30%" x2="60%" y2="20%" stroke="url(#lineGradient)" strokeWidth="1.5" strokeDasharray="100" style={{animation: 'flow-line 15s infinite ease-in-out', animationDelay: '2s'}} />
        <line x1="60%" y1="20%" x2="80%" y2="35%" stroke="url(#lineGradient)" strokeWidth="1.5" strokeDasharray="100" style={{animation: 'flow-line 15s infinite ease-in-out', animationDelay: '4s'}} />
        <line x1="80%" y1="35%" x2="70%" y2="60%" stroke="url(#lineGradient)" strokeWidth="1.5" strokeDasharray="100" style={{animation: 'flow-line 15s infinite ease-in-out', animationDelay: '1s'}} />
        <line x1="70%" y1="60%" x2="40%" y2="70%" stroke="url(#lineGradient)" strokeWidth="1.5" strokeDasharray="100" style={{animation: 'flow-line 15s infinite ease-in-out', animationDelay: '3s'}} />
        
        {/* Network Nodes */}
        <circle cx="20%" cy="10%" r="3" fill="#3b82f6" opacity="0.3">
          <animate attributeName="r" values="3;5;3" dur="6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.2;0.4;0.2" dur="6s" repeatCount="indefinite" />
        </circle>
        <circle cx="40%" cy="30%" r="4" fill="#3b82f6" opacity="0.25">
          <animate attributeName="r" values="4;6;4" dur="7s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.15;0.35;0.15" dur="7s" repeatCount="indefinite" />
        </circle>
        <circle cx="60%" cy="20%" r="3" fill="#3b82f6" opacity="0.3">
          <animate attributeName="r" values="3;5;3" dur="5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.2;0.4;0.2" dur="5s" repeatCount="indefinite" />
        </circle>
      </svg>

      <div className="w-full max-w-md animate-in fade-in zoom-in duration-700 relative z-10">
        <div className="text-center">
          {/* Circular Icon */}
          <div className="flex justify-center mb-12 form-item">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-900 to-blue-950 rounded-full flex items-center justify-center shadow-2xl border border-blue-800 icon-pulse">
              <UserPlus size={48} className="text-white" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-black text-white mb-3 tracking-wider antialiased title-glow form-item">LEXI</h1>
          <p className="text-sm tracking-widest text-gray-400 font-semibold antialiased mb-12 uppercase form-item">Create Your Account</p>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-3 p-4 mb-8 bg-red-950/30 border border-red-700 rounded-lg text-red-300 text-sm form-item">
              <AlertCircle size={20} className="flex-shrink-0" />
              <span className="font-medium antialiased">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8 form-item">
            {/* Username Input */}
            <div>
              <div className="relative flex items-center border-b border-gray-600 pb-3 focus-within:border-blue-400 input-focus">
                <User className="text-gray-500 mr-3" size={20} />
                <input
                  id="username"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Username"
                  className="flex-1 bg-transparent text-white text-sm antialiased placeholder-gray-500 focus:outline-none font-medium smooth-transition"
                  required
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <div className="relative flex items-center border-b border-gray-600 pb-3 focus-within:border-blue-400 input-focus">
                <Mail className="text-gray-500 mr-3" size={20} />
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="flex-1 bg-transparent text-white text-sm antialiased placeholder-gray-500 focus:outline-none font-medium smooth-transition"
                  required
                />
              </div>
            </div>

            {/* Full Name Input */}
            <div>
              <div className="relative flex items-center border-b border-gray-600 pb-3 focus-within:border-blue-400 input-focus">
                <User className="text-gray-500 mr-3" size={20} />
                <input
                  id="full_name"
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Full Name (Optional)"
                  className="flex-1 bg-transparent text-white text-sm antialiased placeholder-gray-500 focus:outline-none font-medium smooth-transition"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="relative flex items-center border-b border-gray-600 pb-3 focus-within:border-blue-400 input-focus">
                <Lock className="text-gray-500 mr-3" size={20} />
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password (min. 6 characters)"
                  className="flex-1 bg-transparent text-white text-sm antialiased placeholder-gray-500 focus:outline-none font-medium smooth-transition"
                  required
                />
              </div>
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-950 hover:bg-blue-900 disabled:opacity-50 text-white font-bold py-3 rounded-lg hover-scale smooth-transition text-sm tracking-widest antialiased uppercase mt-10"
            >
              {isSubmitting ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-10 text-center text-gray-400 text-sm antialiased form-item">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition antialiased">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

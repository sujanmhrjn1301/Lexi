import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store';
import apiClient from '../api/client';
import type { LoginData } from '../types';
import { Mail, Lock, AlertCircle, User } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const { setUser, setToken } = useAuthStore();
  const [formData, setFormData] = useState<LoginData>({ username: '', password: '' });
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
      const response = await apiClient.login(formData);
      console.log('Login response:', response);
      console.log('Access token:', response.access_token);
      
      setToken(response.access_token);
      console.log('Token set, localStorage:', localStorage.getItem('token'));
      
      const user = await apiClient.getCurrentUser();
      setUser(user);
      
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed. Please try again.');
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
        <line x1="40%" y1="70%" x2="15%" y2="60%" stroke="url(#lineGradient)" strokeWidth="1.5" strokeDasharray="100" style={{animation: 'flow-line 15s infinite ease-in-out', animationDelay: '2.5s'}} />
        <line x1="15%" y1="60%" x2="20%" y2="10%" stroke="url(#lineGradient)" strokeWidth="1.5" strokeDasharray="100" style={{animation: 'flow-line 15s infinite ease-in-out', animationDelay: '4.5s'}} />
        
        {/* Cross connections */}
        <line x1="40%" y1="30%" x2="70%" y2="60%" stroke="url(#lineGradient)" strokeWidth="1" strokeDasharray="80" style={{animation: 'flow-line 12s infinite ease-in-out', animationDelay: '1.5s'}} opacity="0.5" />
        <line x1="60%" y1="20%" x2="40%" y2="70%" stroke="url(#lineGradient)" strokeWidth="1" strokeDasharray="80" style={{animation: 'flow-line 12s infinite ease-in-out', animationDelay: '3.5s'}} opacity="0.5" />
        
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
        <circle cx="80%" cy="35%" r="3.5" fill="#3b82f6" opacity="0.25">
          <animate attributeName="r" values="3.5;5.5;3.5" dur="8s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.18;0.38;0.18" dur="8s" repeatCount="indefinite" />
        </circle>
        <circle cx="70%" cy="60%" r="4" fill="#3b82f6" opacity="0.2">
          <animate attributeName="r" values="4;6;4" dur="6.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.15;0.35;0.15" dur="6.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="40%" cy="70%" r="3" fill="#3b82f6" opacity="0.25">
          <animate attributeName="r" values="3;5;3" dur="7.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.2;0.4;0.2" dur="7.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="15%" cy="60%" r="3.5" fill="#3b82f6" opacity="0.3">
          <animate attributeName="r" values="3.5;5.5;3.5" dur="6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.2;0.4;0.2" dur="6s" repeatCount="indefinite" />
        </circle>
      </svg>

      <div className="w-full max-w-md animate-in fade-in zoom-in duration-700 relative z-10">
        <div className="text-center">
          {/* Circular Icon */}
          <div className="flex justify-center mb-12 form-item">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-900 to-blue-950 rounded-full flex items-center justify-center shadow-2xl border border-blue-800 icon-pulse">
              <User size={48} className="text-white" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-black text-white mb-3 tracking-wider antialiased title-glow form-item">LEXI</h1>
          <p className="text-sm tracking-widest text-gray-400 font-semibold antialiased mb-12 uppercase form-item">Legal Authentication</p>

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
                <Mail className="text-gray-500 mr-3 flex-shrink-0" size={20} />
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

            {/* Password Input */}
            <div>
              <div className="relative flex items-center border-b border-gray-600 pb-3 focus-within:border-blue-400 input-focus">
                <Lock className="text-gray-500 mr-3 flex-shrink-0" size={20} />
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="flex-1 bg-transparent text-white text-sm antialiased placeholder-gray-500 focus:outline-none font-medium smooth-transition"
                  required
                />
              </div>
            </div>

            {/* Remember & Forgot Password */}
            <div className="flex items-center justify-between text-xs form-item">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 border border-gray-500 rounded bg-black accent-blue-500 cursor-pointer transition" />
                <span className="text-gray-400 group-hover:text-gray-300 transition">Remember me</span>
              </label>
              <Link to="#" className="text-gray-400 hover:text-blue-400 transition font-medium antialiased">
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-950 hover:bg-blue-900 disabled:opacity-50 text-white font-bold py-3 rounded-lg hover-scale smooth-transition text-sm tracking-widest antialiased uppercase mt-10 form-item"
            >
              {isSubmitting ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          {/* Signup Link */}
          <p className="mt-10 text-center text-gray-400 text-sm antialiased form-item">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-semibold transition antialiased">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

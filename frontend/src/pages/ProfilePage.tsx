import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User as UserIcon, Mail, Calendar, Save, Upload } from 'lucide-react';
import { useAuthStore } from '../store';
import apiClient from '../api/client';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-blue-400 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Update user data via API
      await apiClient.updateUserProfile({
        full_name: fullName,
        email: email,
      });

      // Update local store
      setUser({
        ...user,
        full_name: fullName,
        email: email,
      });

      setMessage('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Failed to update profile:', error);
      setMessage('Failed to update profile. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleProfilePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // For now, we'll just show a preview
    // In a real app, you'd upload this to a server
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      setUser({
        ...user,
        profile_image: imageUrl,
      });
      setMessage('Profile picture updated! (Local preview)');
      setTimeout(() => setMessage(''), 3000);
    };
    reader.readAsDataURL(file);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Background */}
      <svg
        className="fixed inset-0 w-full h-full opacity-5"
        viewBox="0 0 400 400"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="blur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1" />
          </filter>
        </defs>
        <circle cx="100" cy="100" r="2" fill="#3b82f6" filter="url(#blur)" />
        <circle cx="300" cy="100" r="2" fill="#1e40af" filter="url(#blur)" />
        <circle cx="100" cy="300" r="2" fill="#1e3a8a" filter="url(#blur)" />
        <circle cx="300" cy="300" r="2" fill="#3b82f6" filter="url(#blur)" />
      </svg>

      <div className="relative z-10">
        {/* Header */}
        <div className="border-b border-blue-900 border-opacity-30 p-6 bg-gradient-to-r from-blue-950 to-black">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-blue-900 hover:bg-opacity-30 rounded-lg hover-scale smooth-transition text-blue-400"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-4xl font-black tracking-wider">Profile</h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex items-center justify-center min-h-[calc(100vh-120px)] p-6">
          <div className="w-full max-w-md">
            {/* Profile Picture */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-900 to-blue-950 border-2 border-blue-800 border-opacity-60 flex items-center justify-center overflow-hidden shadow-lg shadow-blue-900 shadow-opacity-40">
                  {user.profile_image ? (
                    <img
                      src={user.profile_image}
                      alt={user.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserIcon size={48} className="text-blue-400" />
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-blue-900 p-3 rounded-full hover:bg-blue-800 hover-scale smooth-transition shadow-lg"
                >
                  <Upload size={18} className="text-white" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Message */}
            {message && (
              <div className="mb-6 p-4 rounded-lg bg-blue-900 bg-opacity-30 border border-blue-800 border-opacity-40 text-blue-200 text-center animate-fade-in">
                {message}
              </div>
            )}

            {/* Profile Information */}
            <div className="space-y-4 p-6 rounded-lg bg-gradient-to-br from-blue-950 to-blue-900 bg-opacity-30 border border-blue-900 border-opacity-40">
              {/* Username (read-only) */}
              <div>
                <label className="text-xs font-semibold text-blue-400 text-opacity-70 tracking-widest">
                  USERNAME
                </label>
                <div className="mt-2 px-4 py-3 rounded-lg bg-black bg-opacity-50 border border-blue-900 border-opacity-30 flex items-center gap-2">
                  <UserIcon size={18} className="text-blue-400" />
                  <span className="font-semibold text-white">{user.username}</span>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-xs font-semibold text-blue-400 text-opacity-70 tracking-widest">
                  EMAIL
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!isEditing}
                  className="mt-2 w-full px-4 py-3 rounded-lg bg-black bg-opacity-50 border border-blue-900 border-opacity-30 text-white placeholder-blue-400 placeholder-opacity-50 disabled:opacity-60 focus:outline-none focus-within:border-blue-400 focus-within:border-opacity-60 input-focus"
                />
              </div>

              {/* Full Name */}
              <div>
                <label className="text-xs font-semibold text-blue-400 text-opacity-70 tracking-widest">
                  FULL NAME
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={!isEditing}
                  className="mt-2 w-full px-4 py-3 rounded-lg bg-black bg-opacity-50 border border-blue-900 border-opacity-30 text-white placeholder-blue-400 placeholder-opacity-50 disabled:opacity-60 focus:outline-none focus-within:border-blue-400 focus-within:border-opacity-60 input-focus"
                />
              </div>

              {/* Member Since */}
              <div>
                <label className="text-xs font-semibold text-blue-400 text-opacity-70 tracking-widest">
                  MEMBER SINCE
                </label>
                <div className="mt-2 px-4 py-3 rounded-lg bg-black bg-opacity-50 border border-blue-900 border-opacity-30 flex items-center gap-2">
                  <Calendar size={18} className="text-blue-400" />
                  <span className="text-blue-200">{formatDate(user.created_at)}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex gap-3">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-900 to-blue-950 hover:from-blue-800 hover:to-blue-900 text-white rounded-lg font-black tracking-wider hover-scale smooth-transition shadow-lg shadow-blue-900 shadow-opacity-40 flex items-center justify-center gap-2"
                >
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setFullName(user.full_name || '');
                      setEmail(user.email);
                    }}
                    className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-black tracking-wider hover-scale smooth-transition flex items-center justify-center gap-2"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-900 to-green-950 hover:from-green-800 hover:to-green-900 disabled:opacity-50 text-white rounded-lg font-black tracking-wider hover-scale smooth-transition shadow-lg shadow-green-900 shadow-opacity-40 flex items-center justify-center gap-2"
                  >
                    <Save size={18} />
                    Save
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

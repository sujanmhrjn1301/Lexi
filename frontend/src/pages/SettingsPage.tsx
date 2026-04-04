import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Moon, Sun, LogOut } from 'lucide-react';
import apiClient from '../api/client';
import { useAuthStore } from '../store';
import type { UserSettings } from '../types';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      loadSettings();
    }
  }, [user]);

  const loadSettings = async () => {
    try {
      if (!user?.id) return;
      const response = await apiClient.getUserSettings(user.id);
      setSettings(response);
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const handleSaveSettings = async () => {
    if (!settings || !user) return;
    
    setIsSaving(true);
    try {
      const response = await apiClient.updateUserSettings(user.id, {
        theme: settings.theme,
        language: settings.language,
        notifications_enabled: settings.notifications_enabled,
      });
      setSettings(response);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!settings) {
    return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-400">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-4">
          <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-800 rounded-lg hover-scale smooth-transition text-gray-400 hover:text-white">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* User Info */}
        <div className="bg-gray-900 rounded-lg border border-gray-800 mb-6 p-6">
          <h2 className="text-xl font-bold mb-4 text-white">User Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Username</label>
              <input
                type="text"
                value={user?.username || ''}
                disabled
                className="w-full px-4 py-2 border border-gray-800 rounded-lg bg-gray-800 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-2 border border-gray-800 rounded-lg bg-gray-800 text-white"
              />
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-gray-900 rounded-lg border border-gray-800 mb-6 p-6">
          <h2 className="text-xl font-bold mb-4 text-white">Preferences</h2>
          <div className="space-y-4">
            {/* Theme */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Theme</label>
              <div className="flex gap-4">
                {['light', 'dark'].map((theme) => (
                  <label key={theme} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="theme"
                      value={theme}
                      checked={settings.theme === theme}
                      onChange={(e) =>
                        setSettings({ ...settings, theme: e.target.value as 'light' | 'dark' })
                      }
                      className="w-4 h-4"
                    />
                    <span className="flex items-center gap-2 capitalize text-gray-300 hover:text-white transition">
                      {theme === 'light' ? <Sun size={18} /> : <Moon size={18} />}
                      {theme}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Language */}
            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-400 mb-2">
                Language
              </label>
              <select
                id="language"
                value={settings.language}
                onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                className="w-full px-4 py-2 border border-gray-800 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 input-focus"
              >
                <option value="en" className="bg-gray-800">English</option>
                <option value="ne" className="bg-gray-800">Nepali</option>
              </select>
            </div>

            {/* Notifications */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-400">Enable Notifications</span>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications_enabled}
                  onChange={(e) =>
                    setSettings({ ...settings, notifications_enabled: e.target.checked })
                  }
                  className="w-4 h-4 rounded"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="flex-1 bg-gray-800 hover:bg-gray-900 disabled:opacity-50 text-white font-semibold py-3 rounded-lg hover-scale smooth-transition"
          >
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 rounded-lg hover-scale smooth-transition"
          >
            Cancel
          </button>
        </div>

        {/* Danger Zone */}
        <div className="bg-gray-900 rounded-lg">
          
          <button
            onClick={handleLogout}
            className="w-full bg-red-900 hover:bg-red-800 text-white font-semibold py-3 rounded-lg hover-scale smooth-transition flex items-center justify-center gap-2"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

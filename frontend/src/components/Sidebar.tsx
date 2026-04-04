import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Edit, LogOut, Settings, Trash2, MessageSquare, PanelLeftOpen, PanelLeftClose } from 'lucide-react';
import apiClient from '../api/client';
import { useChatStore, useAuthStore } from '../store';
import Logo from './Logo';
import type { Chat } from '../types';

export default function Sidebar() {
  const navigate = useNavigate();
  const { chatId } = useParams<{ chatId: string }>();
  const { chats, setChats, setCurrentChat } = useChatStore();
  const { user, logout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle responsive breakpoints
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile && !isCollapsed) {
        setIsCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isCollapsed]);

  useEffect(() => {
    loadChats();
  }, []);

  // Auto-redirect to first chat or create one if needed
  useEffect(() => {
    if (!isLoading && chats.length > 0 && !chatId) {
      // Redirect to first chat if we have chats but no chatId in URL
      const firstChat = chats[0];
      setCurrentChat(firstChat);
      navigate(`/chat/${firstChat.id}`);
    }
  }, [isLoading, chats, chatId, navigate, setCurrentChat]);

  const loadChats = async () => {
    try {
      const data = await apiClient.getChats();
      setChats(data);
      
      // If no chats exist, auto-create one
      if (data.length === 0) {
        const newChat = await apiClient.createChat({ title: 'General' });
        setChats([newChat]);
        setCurrentChat(newChat);
        navigate(`/chat/${newChat.id}`);
      }
    } catch (error) {
      console.error('Failed to load chats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = async () => {
    setIsLoading(true);
    try {
      const newChat = await apiClient.createChat({ title: 'New Chat' });
      setChats([newChat, ...chats]);
      setCurrentChat(newChat);
      navigate(`/chat/${newChat.id}`);
    } catch (error) {
      console.error('Failed to create chat:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteChat = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this chat?')) {
      try {
        await apiClient.deleteChat(id);
        const updatedChats = chats.filter((c) => c.id !== id);
        setChats(updatedChats);
        
        if (parseInt(chatId || '0') === id) {
          // If we deleted the current chat, navigate to the first remaining chat
          if (updatedChats.length > 0) {
            navigate(`/chat/${updatedChats[0].id}`);
          } else {
            navigate('/');
          }
        }
      } catch (error) {
        console.error('Failed to delete chat:', error);
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile hamburger button */}
      {isMobile && (
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="fixed top-4 right-4 z-50 p-2 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white md:hidden"
          title="Toggle menu"
        >
          {isCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
        </button>
      )}

      {/* Mobile overlay */}
      {isMobile && !isCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      <div
        className={`${
          isMobile
            ? `fixed left-0 top-0 h-screen z-50 w-[288px] transition-transform duration-300 ${
                isCollapsed ? '-translate-x-full' : 'translate-x-0'
              }`
            : `${isCollapsed ? 'w-20' : 'w-[288px]'} transition-all duration-300`
        } bg-gray-900 text-white flex flex-col h-screen shadow-lg`}
      >
      {/* Header */}
      <div className={`p-2 sm:p-3 md:p-4 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} gap-3`}>
        <div className={`flex items-center gap-2 sm:gap-3 transition-all duration-300 ${isCollapsed ? 'hidden' : ''}`}>
          {!isCollapsed && <Logo />}
          {!isCollapsed && <h1 className="text-xl sm:text-2xl font-bold"></h1>}
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-950 hover-scale text-gray-400 hover:text-white flex-shrink-0 hidden md:flex"
          title={isCollapsed ? 'Expand' : 'Collapse'}
        >
          {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      {/* New Chat Button */}
      <div className={`px-2 py-1 flex ${isCollapsed ? 'justify-center' : ''}`}>
        <button
          onClick={handleNewChat}
          disabled={isLoading}
          className={`bg-gray-700 bg-opacity-0 hover:bg-gray-950 disabled:opacity-50 text-white rounded-lg p-3 flex items-center gap-2 font-semibold hover-scale smooth-transition ${
            isCollapsed ? 'justify-center' : 'w-full justify-start'
          }`}
          title="New Chat"
        >
          <Edit size={18} />
          {!isCollapsed && <span>New Chat</span>}
        </button>
      </div>

      {/* Chat History */}
      {!isCollapsed && (
        <div className="px-2 py-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Your chats</p>
        </div>
      )}
      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="px-2 py-4 space-y-2">
          {chats.length === 0 ? (
            <p className={`text-gray-500 text-sm px-2 py-4 ${isCollapsed ? '' : 'text-center'}`}>
              {isCollapsed ? '—' : 'No chats yet'}
            </p>
          ) : (
            chats.map((chat: Chat) => (
              <div
                key={chat.id}
                onClick={() => {
                  setCurrentChat(chat);
                  navigate(`/chat/${chat.id}`);
                }}
                className={`p-3 rounded-lg cursor-pointer flex items-center justify-between group chat-item-hover smooth-transition ${
                  isCollapsed ? 'w-12 h-12 justify-center' : ''
                } ${
                  parseInt(chatId || '0') === chat.id
                    ? 'bg-gray-700'
                    : 'hover:bg-gray-950'
                }`}
                title={isCollapsed ? chat.title : ''}
              >
                {isCollapsed ? (
                  <MessageSquare size={16} className="flex-shrink-0" />
                ) : (
                  <>
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <MessageSquare size={16} className="flex-shrink-0" />
                      <span className="text-sm truncate">{chat.title}</span>
                    </div>
                    <button
                      onClick={(e) => handleDeleteChat(e, chat.id)}
                      className="opacity-0 group-hover:opacity-100 hover:text-red-400 smooth-transition hover-scale"
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                )}
              </div>
            ))
          )}
        </div>
        </div>
      )}

      {/* Footer */}
      <div className="p-2 sm:p-3 md:p-[1.9rem] mt-auto">
        {user && (
          <>
            {!isCollapsed && (
              <div className={`flex items-center justify-between gap-2 mt-8 text-sm sm:text-base`}>
                <div
                  onClick={() => navigate('/profile')}
                  className={`cursor-pointer hover:opacity-80 transition min-w-0 hover:bg-gray-950 px-3 py-1 rounded-lg transition-colors`}
                >
                  <p className="text-sm text-gray-400 leading-tight">Logged in as</p>
                  <p className="font-semibold truncate text-white text-sm">{user.username}</p>
                </div>
                <div className={`flex items-center gap-1 flex-shrink-0`}>
                  <button
                    onClick={() => navigate('/settings')}
                    className="p-2 rounded-lg hover:bg-gray-950 hover-scale smooth-transition text-gray-400 hover:text-white"
                    title="Settings"
                  >
                    <Settings size={18} />
                  </button>
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-lg hover:bg-red-800 hover-scale smooth-transition text-red-400"
                    title="Logout"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              </div>
            )}
            {isCollapsed && (
              <div className="flex justify-center">
                <button
                  onClick={() => navigate('/settings')}
                  className="p-2 rounded-lg hover:bg-gray-950 transition text-gray-400 hover:text-white"
                  title="Settings"
                >
                  <Settings size={18} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
      </div>
    </>
  );
}

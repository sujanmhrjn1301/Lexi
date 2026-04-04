import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SendHorizontal, AlertCircle, CheckCircle, Info, BookOpen, ArrowUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import apiClient from '../api/client';
import { useChatStore, useAuthStore } from '../store';
import type { Message } from '../types';

const styles = `
  @keyframes rotate3d {
    from {
      transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);
    }
    to {
      transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg);
    }
  }
  
  .cube-3d {
    width: 14px;
    height: 14px;
    position: relative;
    transform-style: preserve-3d;
    animation: rotate3d 2s infinite linear;
  }
  
  .cube-3d div {
    position: absolute;
    width: 14px;
    height: 14px;
    border: 2.5px solid rgba(156, 163, 175, 0.6);
    opacity: 0.8;
  }
  
  .cube-3d .front  { transform: rotateY(0deg) translateZ(7px); }
  .cube-3d .back   { transform: rotateY(180deg) translateZ(7px); }
  .cube-3d .right  { transform: rotateY(90deg) translateZ(7px); }
  .cube-3d .left   { transform: rotateY(-90deg) translateZ(7px); }
  .cube-3d .top    { transform: rotateX(90deg) translateZ(7px); }
  .cube-3d .bottom { transform: rotateX(-90deg) translateZ(7px); }
`;

const Cube3D = () => (
  <>
    <style>{styles}</style>
    <div className="cube-3d" style={{ perspective: '1000px' }}>
      <div className="front"></div>
      <div className="back"></div>
      <div className="right"></div>
      <div className="left"></div>
      <div className="top"></div>
      <div className="bottom"></div>
    </div>
  </>
);

export default function ChatArea() {
  const { chatId } = useParams<{ chatId: string }>();
  const { currentChat, messages, setMessages, addMessage } = useChatStore();
  const { user } = useAuthStore();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [displayedContent, setDisplayedContent] = useState<{ [key: number]: string }>({});
  const [loadingDots, setLoadingDots] = useState('.');
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const typewriterTimerRef = React.useRef<number | null>(null);
  const dotsTimerRef = React.useRef<number | null>(null);
  const charIndexRef = React.useRef<number>(0);
  const processedMessageIdsRef = React.useRef<Set<number>>(new Set());

  // Animate loading dots
  useEffect(() => {
    if (isLoading) {
      dotsTimerRef.current = setInterval(() => {
        setLoadingDots(prev => {
          if (prev === '.') return '..';
          if (prev === '..') return '...';
          return '.';
        });
      }, 500);
    }
    return () => {
      if (dotsTimerRef.current) clearInterval(dotsTimerRef.current);
    };
  }, [isLoading]);

  // Display AI messages with typewriter effect for new messages only
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === 'assistant' && !isLoading) {
      const messageId = lastMessage.id;
      const fullContent = lastMessage.content;

      // Check if this message has already been processed (from page load)
      if (processedMessageIdsRef.current.has(messageId)) {
        // Already processed, show full content immediately
        setDisplayedContent(prev => ({
          ...prev,
          [messageId]: fullContent
        }));
        return;
      }

      // New message - start typewriter effect
      let charIndex = 0;
      charIndexRef.current = 0;
      
      // Start with empty content
      setDisplayedContent(prev => ({
        ...prev,
        [messageId]: ''
      }));

      // Typewriter animation
      typewriterTimerRef.current = window.setInterval(() => {
        if (charIndex < fullContent.length) {
          setDisplayedContent(prev => ({
            ...prev,
            [messageId]: fullContent.slice(0, charIndex + 1)
          }));
          charIndex++;
        } else {
          // Animation complete
          if (typewriterTimerRef.current) {
            clearInterval(typewriterTimerRef.current);
            typewriterTimerRef.current = null;
          }
          // Mark as processed so it won't retrigger
          processedMessageIdsRef.current.add(messageId);
        }
      }, 10);

      return () => {
        if (typewriterTimerRef.current) {
          clearInterval(typewriterTimerRef.current);
          typewriterTimerRef.current = null;
        }
      };
    }
  }, [messages, isLoading]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, displayedContent, loadingDots]);

  useEffect(() => {
    if (chatId) {
      loadMessages(parseInt(chatId));
    }
  }, [chatId]);

  const loadMessages = async (id: number) => {
    try {
      const msgs = await apiClient.getMessages(id);
      setMessages(msgs);
      
      // Initialize displayedContent with full content of all messages
      // and mark them as already processed so typewriter doesn't replay
      const initialDisplayedContent: { [key: number]: string } = {};
      msgs.forEach(msg => {
        if (msg.role === 'assistant') {
          initialDisplayedContent[msg.id] = msg.content;
          processedMessageIdsRef.current.add(msg.id);
        }
      });
      setDisplayedContent(initialDisplayedContent);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !chatId) return;

    setIsLoading(true);
    const messageContent = input;
    setInput('');

    try {
      // Display user message immediately
      const userMsg = {
        id: Date.now(),
        chat_id: parseInt(chatId),
        user_id: 1,
        content: messageContent,
        role: 'user' as const,
        created_at: new Date().toISOString(),
      };
      addMessage(userMsg);

      // Send to backend and get response
      const response = await apiClient.sendMessage(parseInt(chatId), {
        content: messageContent,
      });
      
      addMessage(response);
      
      // Fetch all messages to ensure consistency
      const messages = await apiClient.getMessages(parseInt(chatId));
      setMessages(messages);
    } catch (error) {
      console.error('Failed to send message:', error);
      setInput(messageContent);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-gray-950">
      {/* Header */}
      <div className="p-2 sm:p-3 md:p-4 pl-4 sm:pl-6 md:pl-10 bg-gray-950">
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-widest">LEXI</h1>
      </div>

      {/* Messages Area */}
      <div className={`flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 scrollbar-hide bg-gray-950 flex flex-col items-center ${messages.length === 0 ? 'justify-center' : 'justify-start'}`}>
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-8 sm:gap-12 md:gap-16">
            <h2 style={{ fontFamily: '"Playwrite IE", cursive', fontWeight: '600', letterSpacing: '0.02em' }} className="text-2xl sm:text-3xl md:text-4xl text-white/90 text-center leading-relaxed">Welcome to Lexi,<br /><span className="block mt-2">{user?.username || 'User'}</span></h2>
            <form onSubmit={handleSendMessage} className="w-full max-w-xs sm:max-w-md md:max-w-4xl px-2 sm:px-4 md:px-8">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Lexi..."
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 pr-12 sm:pr-16 border border-gray-900 rounded-xl sm:rounded-2xl bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600 input-focus text-sm sm:text-base"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="absolute right-1.5 sm:right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 hover:bg-gray-600 disabled:opacity-50 text-white w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl font-medium flex items-center justify-center"
                >
                  {isLoading ? (
                    <Cube3D />
                  ) : (
                    <ArrowUp size={18} />
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="w-full max-w-xs sm:max-w-md md:max-w-3xl space-y-4 sm:space-y-6 px-2 sm:px-4">

        {messages.map((message: Message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs sm:max-w-md md:max-w-2xl px-3 sm:px-6 py-2 sm:py-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-gray-900 text-white rounded-br-none user-message'
                  : 'assistant-message'
              }`}
            >
              <div className="text-sm sm:text-base break-words leading-relaxed">
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className="text-gray-100 mb-3 leading-relaxed first:mt-0 last:mb-0">{children}</p>,
                    
                    h1: ({ children }) => <h1 className="text-2xl font-bold mb-4 mt-6 text-white border-b-2 border-gray-600 pb-2">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-xl font-bold mb-3 mt-5 text-white">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-lg font-semibold mb-2 mt-3 text-gray-100">{children}</h3>,
                    h4: ({ children }) => <h4 className="font-semibold mb-2 text-gray-100">{children}</h4>,
                    
                    ul: ({ children }) => <ul className="list-disc list-outside mb-4 ml-6 space-y-2 text-gray-100">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-outside mb-4 ml-6 space-y-2 text-gray-100">{children}</ol>,
                    li: ({ children }) => <li className="ml-2 text-gray-100 leading-relaxed">{children}</li>,
                    
                    strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
                    em: ({ children }) => <em className="italic text-gray-300">{children}</em>,
                    
                    blockquote: ({ children }) => (
                      <div className="border-l-4 border-blue-500 bg-blue-50 bg-opacity-10 pl-4 py-3 my-4 rounded text-gray-200 italic">
                        {children}
                      </div>
                    ),
                    
                    code: ({ inline, children }) => 
                      inline ? (
                        <code className="bg-gray-800 px-2 py-1 rounded text-sm text-yellow-300 font-mono border border-gray-700">
                          {children}
                        </code>
                      ) : (
                        <pre className="bg-gray-950 border border-gray-700 rounded-lg p-4 my-4 overflow-x-auto">
                          <code className="text-gray-200 font-mono text-sm leading-relaxed">{children}</code>
                        </pre>
                      ),
                    
                    table: ({ children }) => (
                      <div className="overflow-x-auto my-4">
                        <table className="w-full border-collapse border border-gray-600">
                          {children}
                        </table>
                      </div>
                    ),
                    thead: ({ children }) => (
                      <thead className="bg-gray-800">
                        {children}
                      </thead>
                    ),
                    tbody: ({ children }) => (
                      <tbody>{children}</tbody>
                    ),
                    tr: ({ children }) => (
                      <tr className="border-b border-gray-600 hover:bg-gray-800 hover:bg-opacity-50 transition">
                        {children}
                      </tr>
                    ),
                    th: ({ children }) => (
                      <th className="border border-gray-600 px-4 py-2 text-left font-bold text-gray-100">
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td className="border border-gray-600 px-4 py-2 text-gray-200">
                        {children}
                      </td>
                    ),
                    
                    hr: () => <hr className="my-6 border-t border-gray-600" />,
                  }}
                >
                  {displayedContent[message.id] !== undefined ? displayedContent[message.id] : message.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start w-full px-2 sm:px-4 md:px-6">
            <div className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 rounded-lg sm:rounded-2xl md:rounded-3xl rounded-bl-none">
              <div className="flex gap-1.5 sm:gap-2 items-center">
                <div className="flex gap-1 sm:gap-1.5">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area - Only show when messages exist */}
      {messages.length > 0 && (
        <div className="p-3 sm:p-4 md:p-6 bg-gray-950 flex justify-center">
          <form onSubmit={handleSendMessage} className="w-full max-w-xs sm:max-w-md md:max-w-3xl px-2 sm:px-0">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Lexi..."
                className="w-full px-4 sm:px-6 py-2.5 sm:py-3 pr-11 sm:pr-14 border border-gray-900 rounded-lg bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600 input-focus text-sm sm:text-base"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="absolute right-1.5 sm:right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 hover:bg-gray-600 disabled:opacity-50 text-white w-8 h-8 sm:w-9 sm:h-9 rounded font-medium flex items-center justify-center"
              >
                {isLoading ? (
                  <Cube3D />
                ) : (
                  <ArrowUp size={20} />
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

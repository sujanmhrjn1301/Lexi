import React from 'react';
import Sidebar from '../components/Sidebar';
import ChatArea from '../components/ChatArea';

export default function ChatPage() {
  return (
    <div className="flex h-screen w-screen max-w-full overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-hidden flex flex-col">
        <ChatArea />
      </div>
    </div>
  );
}

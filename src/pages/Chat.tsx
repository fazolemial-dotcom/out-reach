import React, { useState, useEffect, useRef } from 'react';
import { chatApi } from '../services/api';
import { ChatSession } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';

const Chat: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await chatApi.getSessions();
        setSessions(response.data.sessions);
      } catch (error) {
        console.error('Failed to fetch chat sessions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSession?.messages]);

  const createNewSession = async () => {
    try {
      const response = await chatApi.createSession({
        title: 'New Chat',
      });
      setSessions([response.data.session, ...sessions]);
      setActiveSession(response.data.session);
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  };

  const selectSession = async (sessionId: string) => {
    try {
      const response = await chatApi.getSession(sessionId);
      setActiveSession(response.data.session);
    } catch (error) {
      console.error('Failed to fetch session:', error);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !activeSession || sending) return;

    setSending(true);
    try {
      const response = await chatApi.sendMessage(activeSession.id, message);
      setActiveSession(response.data.session);
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="h-full flex">
      {/* Chat Sessions Sidebar */}
      <div className="w-1/3 bg-white border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">AI Chat</h2>
          <button
            onClick={createNewSession}
            className="mt-2 w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            New Chat
          </button>
        </div>
        
        <div className="overflow-y-auto h-full">
          {sessions.length > 0 ? (
            <div className="space-y-1 p-2">
              {sessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => selectSession(session.id)}
                  className={`w-full text-left p-3 rounded-lg ${
                    activeSession?.id === session.id
                      ? 'bg-primary-100 text-primary-900'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <p className="font-medium truncate">{session.title}</p>
                  <p className="text-sm text-gray-500 truncate">
                    {session.messages.length > 0 
                      ? session.messages[session.messages.length - 1].content.substring(0, 50) + '...'
                      : 'No messages yet'
                    }
                  </p>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              No chat sessions yet
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeSession ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <h3 className="font-semibold text-gray-900">{activeSession.title}</h3>
              <p className="text-sm text-gray-500">
                AI Assistant for your outreach needs
              </p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeSession.messages.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Start a conversation with the AI assistant</p>
                  <p className="text-sm text-gray-400 mt-2">
                    I can help you write emails, analyze responses, and optimize your campaigns.
                  </p>
                </div>
              ) : (
                activeSession.messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.role === 'user'
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-200 text-gray-900'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      <p className={`text-xs mt-1 ${
                        msg.role === 'user' ? 'text-primary-100' : 'text-gray-500'
                      }`}>
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <form onSubmit={sendMessage} className="flex space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  disabled={sending}
                />
                <button
                  type="submit"
                  disabled={sending || !message.trim()}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <PaperAirplaneIcon className="h-5 w-5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-500">Select a chat session or create a new one</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
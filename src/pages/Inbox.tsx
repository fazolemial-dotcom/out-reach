import React, { useState, useEffect } from 'react';
import { inboxApi } from '../services/api';
import { Reply } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import { EnvelopeIcon } from '@heroicons/react/24/outline';

const Inbox: React.FC = () => {
  const [replies, setReplies] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  useEffect(() => {
    const fetchReplies = async () => {
      try {
        const params = filter === 'all' ? {} : { status: filter };
        const response = await inboxApi.getReplies(params);
        setReplies(response.data.replies);
      } catch (error) {
        console.error('Failed to fetch replies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReplies();
  }, [filter]);

  const getInitials = (name?: string) => {
    if (!name) return '?';
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase();
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Inbox</h1>
          <p className="mt-2 text-sm text-gray-700">
            View and respond to incoming emails and replies
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mt-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'all', label: 'All' },
            { key: 'unread', label: 'Unread' },
            { key: 'read', label: 'Read' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                filter === tab.key
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Replies List */}
      <div className="mt-6 bg-white shadow rounded-lg">
        {replies.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {replies.map((reply) => (
              <div
                key={reply.id}
                className={`p-6 hover:bg-gray-50 cursor-pointer ${
                  !reply.is_read ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-700">
                        {getInitials(reply.from_name)}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm font-medium ${
                        reply.is_read ? 'text-gray-900' : 'text-gray-900 font-semibold'
                      }`}>
                        {reply.from_name || reply.from_email}
                      </p>
                      <div className="flex items-center space-x-2">
                        {!reply.is_read && (
                          <span className="inline-block h-2 w-2 rounded-full bg-blue-600"></span>
                        )}
                        <p className="text-sm text-gray-500">
                          {new Date(reply.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                      <span className="font-medium">Re: </span>
                      {reply.subject}
                    </p>
                    <p className="mt-2 text-sm text-gray-700 line-clamp-3">
                      {reply.body}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <EnvelopeIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No messages</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter === 'all' 
                ? "You haven't received any replies yet." 
                : `No ${filter} messages.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inbox;
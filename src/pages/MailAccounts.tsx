import React, { useState, useEffect } from 'react';
import { mailAccountsApi } from '../services/api';
import { MailAccount } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import { PlusIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const MailAccounts: React.FC = () => {
  const [accounts, setAccounts] = useState<MailAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await mailAccountsApi.getMailAccounts();
        setAccounts(response.data.accounts);
      } catch (error) {
        console.error('Failed to fetch mail accounts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  const testConnection = async (accountId: string) => {
    setTesting(accountId);
    try {
      const response = await mailAccountsApi.testConnection(accountId);
      const { smtp, imap, errors } = response.data;
      
      if (smtp && imap) {
        alert('Connection successful! Both SMTP and IMAP are working.');
      } else {
        const errorMsg = `Connection issues detected:\nSMTP: ${errors.smtp || 'OK'}\nIMAP: ${errors.imap || 'OK'}`;
        alert(errorMsg);
      }
    } catch (error) {
      alert('Failed to test connection');
    } finally {
      setTesting(null);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Mail Accounts</h1>
          <p className="mt-2 text-sm text-gray-700">
            Connect your email accounts for sending and receiving
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Account
          </button>
        </div>
      </div>

      {/* Accounts List */}
      <div className="mt-8 space-y-4">
        {accounts.length > 0 ? (
          accounts.map((account) => (
            <div key={account.id} className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`h-3 w-3 rounded-full ${
                    account.is_active ? 'bg-green-400' : 'bg-gray-400'
                  }`} />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {account.display_name}
                    </h3>
                    <p className="text-sm text-gray-500">{account.email}</p>
                    <p className="text-xs text-gray-400">{account.provider}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="text-right text-sm">
                    <p className="text-gray-500">
                      {account.emails_sent_today} / {account.daily_send_limit} sent today
                    </p>
                    <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ 
                          width: `${Math.min((account.emails_sent_today / account.daily_send_limit) * 100, 100)}%` 
                        }}
                      />
                    </div>
                  </div>
                  
                  <button
                    onClick={() => testConnection(account.id)}
                    disabled={testing === account.id}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ArrowPathIcon className={`h-4 w-4 ${testing === account.id ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">SMTP:</span>
                  <span className="ml-1 font-medium">
                    {account.smtp_host}:{account.smtp_port}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">IMAP:</span>
                  <span className="ml-1 font-medium">
                    {account.imap_host}:{account.imap_port}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  Created {new Date(account.created_at).toLocaleDateString()}
                </span>
                <div className="space-x-2">
                  <button className="text-primary-600 hover:text-primary-900 text-sm font-medium">
                    Edit
                  </button>
                  <button className="text-red-600 hover:text-red-900 text-sm font-medium">
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No mail accounts connected yet.</p>
            <p className="text-sm text-gray-400 mt-2">
              Connect your first email account to start sending campaigns.
            </p>
          </div>
        )}
      </div>

      {/* Connection Instructions */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-2">Connection Setup</h3>
        <div className="text-sm text-blue-800 space-y-1">
          <p><strong>Gmail:</strong> Use App Passwords or OAuth2 (recommended)</p>
          <p><strong>Outlook:</strong> Use App Passwords or OAuth2</p>
          <p><strong>Yahoo:</strong> Requires App Passwords</p>
          <p><strong>Custom SMTP:</strong> Enter your SMTP server details</p>
        </div>
      </div>
    </div>
  );
};

export default MailAccounts;
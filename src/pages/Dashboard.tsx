import React, { useState, useEffect } from 'react';
import { dashboardApi } from '../services/api';
import { DashboardMetrics } from '../types';
import {
  UserGroupIcon,
  PaperAirplaneIcon,
  ChatBubbleLeftRightIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await dashboardApi.getMetrics();
        setMetrics(response.data.metrics);
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return <div className="animate-pulse">Loading dashboard...</div>;
  }

  if (!metrics) {
    return <div>Failed to load dashboard</div>;
  }

  const stats = [
    {
      name: 'Total Contacts',
      value: metrics.contacts.total,
      subtext: `${metrics.contacts.consented} with consent`,
      icon: UserGroupIcon,
      color: 'bg-blue-500',
    },
    {
      name: 'Emails Sent',
      value: metrics.emails.sent,
      subtext: `${metrics.emails.bounces} bounces`,
      icon: PaperAirplaneIcon,
      color: 'bg-green-500',
    },
    {
      name: 'Replies Received',
      value: metrics.replies.received,
      subtext: 'This month',
      icon: ChatBubbleLeftRightIcon,
      color: 'bg-purple-500',
    },
    {
      name: 'Active Campaigns',
      value: metrics.campaigns.active,
      subtext: 'Currently sending',
      icon: ExclamationTriangleIcon,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-700">
          Overview of your outreach activity
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`p-3 rounded-md ${stat.color}`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stat.value}
                    </dd>
                    <dd className="text-sm text-gray-500">{stat.subtext}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mail Accounts Overview */}
      {metrics.mailAccounts.length > 0 && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Mail Accounts
            </h3>
            <div className="space-y-3">
              {metrics.mailAccounts.map((account) => (
                <div key={account.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`h-3 w-3 rounded-full mr-3 ${
                      account.is_active ? 'bg-green-400' : 'bg-gray-400'
                    }`} />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{account.email}</p>
                      <p className="text-sm text-gray-500">
                        {account.emails_sent_today} / {account.daily_send_limit} sent today
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {account.is_active ? 'Active' : 'Inactive'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {metrics.contacts.total === 0 && (
        <div className="text-center py-12">
          <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No contacts yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by importing your first contacts.
          </p>
          <div className="mt-6">
            <a
              href="/contacts"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              Import Contacts
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
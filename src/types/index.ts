export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  company?: string;
  email_verified_at?: string;
  last_login_at?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Contact {
  id: string;
  user_id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  company?: string;
  phone?: string;
  notes?: string;
  consent_flag: boolean;
  consent_source?: string;
  consent_timestamp?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface MailAccount {
  id: string;
  user_id: string;
  provider: string;
  email: string;
  display_name: string;
  encrypted_password: string;
  smtp_host?: string;
  smtp_port?: number;
  smtp_secure: boolean;
  imap_host?: string;
  imap_port?: number;
  oauth_token?: string;
  refresh_token?: string;
  token_expires_at?: string;
  is_active: boolean;
  daily_send_limit: number;
  emails_sent_today: number;
  last_reset_date: string;
  created_at: string;
  updated_at: string;
}

export interface Campaign {
  id: string;
  user_id: string;
  mail_account_id: string;
  name: string;
  subject: string;
  body: string;
  status: 'draft' | 'scheduled' | 'sending' | 'completed' | 'paused' | 'cancelled';
  scheduled_at?: string;
  started_at?: string;
  completed_at?: string;
  target_contacts: number;
  emails_sent: number;
  replies_received: number;
  bounces: number;
  unsubscribes: number;
  rate_limit_per_hour: number;
  created_at: string;
  updated_at: string;
}

export interface Email {
  id: string;
  user_id: string;
  campaign_id?: string;
  mail_account_id: string;
  contact_id: string;
  to_email: string;
  to_name?: string;
  from_email: string;
  from_name: string;
  subject: string;
  body: string;
  status: 'pending' | 'sent' | 'delivered' | 'bounced' | 'failed';
  message_id?: string;
  error_message?: string;
  retry_count: number;
  sent_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Reply {
  id: string;
  user_id: string;
  mail_account_id: string;
  original_email_id?: string;
  from_email: string;
  from_name?: string;
  to_email: string;
  subject: string;
  body: string;
  html_body?: string;
  message_id: string;
  in_reply_to?: string;
  importance: number;
  is_read: boolean;
  auto_responded: boolean;
  created_at: string;
  updated_at: string;
}

export interface ChatSession {
  id: string;
  user_id: string;
  title: string;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }>;
  context_type?: string;
  context_id?: string;
  created_at: string;
  updated_at: string;
}

export interface DashboardMetrics {
  contacts: {
    total: number;
    consented: number;
  };
  emails: {
    sent: number;
    bounces: number;
  };
  replies: {
    received: number;
  };
  campaigns: {
    active: number;
  };
  mailAccounts: Array<{
    id: string;
    email: string;
    is_active: boolean;
    daily_send_limit: number;
    emails_sent_today: number;
  }>;
  lastUpdated: string;
}
import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Bell, Check, CheckCheck, Trash2, Calendar, ArrowLeft } from 'lucide-react';
import axios from '@/lib/axios';

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  action_url: string | null;
  is_read: boolean;
  created_at: string;
  read_at: string | null;
}

interface Props {
  notifications: {
    data: Notification[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export default function NotificationsPage({ notifications }: Props) {
  const [notifList, setNotifList] = useState(notifications.data);

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Baru saja';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} menit lalu`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} jam lalu`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} hari lalu`;
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const markAsRead = async (id: number) => {
    try {
      await axios.post(`/api/notifications/${id}/read`);
      setNotifList(prev =>
        prev.map(notif =>
          notif.id === id ? { ...notif, is_read: true, read_at: new Date().toISOString() } : notif
        )
      );
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.post('/api/notifications/mark-all-read');
      setNotifList(prev =>
        prev.map(notif => ({ ...notif, is_read: true, read_at: new Date().toISOString() }))
      );
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const deleteNotification = async (id: number) => {
    try {
      await axios.delete(`/api/notifications/${id}`);
      setNotifList(prev => prev.filter(notif => notif.id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.is_read) {
      markAsRead(notification.id);
    }
    if (notification.action_url) {
      router.visit(notification.action_url);
    }
  };

  const getNotificationColor = (type: string) => {
    if (type.includes('approved')) return 'border-l-4 border-l-green-500 bg-green-50/30';
    if (type.includes('rejected')) return 'border-l-4 border-l-red-500 bg-red-50/30';
    if (type.includes('revision')) return 'border-l-4 border-l-orange-500 bg-orange-50/30';
    if (type.includes('submitted')) return 'border-l-4 border-l-blue-500 bg-blue-50/30';
    return 'border-l-4 border-l-gray-500 bg-gray-50/30';
  };

  const unreadCount = notifList.filter(n => !n.is_read).length;

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-[#0B132B] hover:text-[#1C2541] mb-4 font-medium transition"
          >
            <ArrowLeft size={20} />
            Kembali ke Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#0B132B] mb-2">Notifikasi</h1>
              <p className="text-gray-600">
                {unreadCount > 0 ? `${unreadCount} notifikasi belum dibaca` : 'Semua notifikasi sudah dibaca'}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-2 px-4 py-2 bg-[#0B132B] text-white rounded-lg hover:bg-[#1C2541] transition font-medium"
              >
                <CheckCheck size={18} />
                Tandai Semua Sudah Dibaca
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {notifList.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <Bell size={64} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Tidak Ada Notifikasi</h3>
              <p className="text-gray-500">Notifikasi akan muncul di sini ketika ada update</p>
            </div>
          ) : (
            notifList.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition hover:shadow-md ${
                  !notification.is_read ? 'ring-2 ring-blue-500/20' : ''
                } ${getNotificationColor(notification.type)}`}
              >
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Unread Indicator */}
                    <div className="flex-shrink-0 mt-1">
                      {!notification.is_read ? (
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                      ) : (
                        <div className="w-3 h-3 bg-gray-300 rounded-full" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="text-lg font-bold text-[#0B132B]">
                          {notification.title}
                        </h3>
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="text-gray-400 hover:text-red-500 transition flex-shrink-0"
                          title="Hapus notifikasi"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <p className="text-gray-700 mb-3 leading-relaxed">
                        {notification.message}
                      </p>

                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar size={14} />
                          {timeAgo(notification.created_at)}
                        </div>

                        <div className="flex items-center gap-2">
                          {!notification.is_read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition"
                            >
                              <Check size={14} />
                              Tandai sudah dibaca
                            </button>
                          )}
                          {notification.action_url && (
                            <button
                              onClick={() => handleNotificationClick(notification)}
                              className="px-4 py-2 bg-[#0B132B] text-white rounded-lg hover:bg-[#1C2541] transition text-sm font-medium"
                            >
                              Lihat Detail
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {notifications.last_page > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            {Array.from({ length: notifications.last_page }, (_, i) => i + 1).map((page) => (
              <Link
                key={page}
                href={`/notifications?page=${page}`}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  page === notifications.current_page
                    ? 'bg-[#0B132B] text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {page}
              </Link>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Total Notifikasi</span>
            <span className="font-bold text-[#0B132B]">{notifications.total}</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

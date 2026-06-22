'use client';

import Link from 'next/link';
import { Bell, CheckCheck } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '@/libs/api.js';
import { NOTIFICATION_POLL_MS } from '@/data/notification-config.js';
import { isDismissKey, shouldDismissPopover } from '@/libs/popover.js';

export default function NotificationBell() {
  const pathname = usePathname();
  const containerRef = useRef(null);
  const [openedPath, setOpenedPath] = useState(null);
  const open = openedPath === pathname;
  const [items, setItems] = useState([]);
  const [unread, setUnread] = useState(0);
  const loadCount = useCallback(() => api('/notifications/unread-count').then((data) => setUnread(data.unread)).catch(() => {}), []);
  const loadItems = useCallback(() => api('/notifications').then((data) => { setItems(data.notifications); setUnread(data.unread); }).catch((error) => toast.error(error.message)), []);

  useEffect(() => { loadCount(); const timer = setInterval(loadCount, NOTIFICATION_POLL_MS); return () => clearInterval(timer); }, [loadCount]);
  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (event) => {
      if (shouldDismissPopover(containerRef.current, event.target)) setOpenedPath(null);
    };
    const onKeyDown = (event) => {
      if (isDismissKey(event.key)) setOpenedPath(null);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);
  const toggle = () => { const next = !open; setOpenedPath(next ? pathname : null); if (next) loadItems(); };
  const read = async (notification) => { if (!notification.readAt) { await api(`/notifications/${notification._id}/read`, { method: 'PATCH' }); setItems((current) => current.map((item) => item._id === notification._id ? { ...item, readAt: new Date().toISOString() } : item)); setUnread((count) => Math.max(0, count - 1)); } setOpenedPath(null); };
  const readAll = async () => { await api('/notifications/read-all', { method: 'PATCH' }); setItems((current) => current.map((item) => ({ ...item, readAt: item.readAt || new Date().toISOString() }))); setUnread(0); };

  return (
    <div ref={containerRef} className="relative">
      <button onClick={toggle} className="btn-outline icon-button relative rounded-full p-3" aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`} aria-expanded={open}>
        <Bell className="h-5 w-5" />
        {unread ? <span className="absolute -right-1 -top-1 grid min-h-5 min-w-5 place-items-center rounded-full bg-red-500 px-1 text-[10px] font-black text-white">{unread > 99 ? '99+' : unread}</span> : null}
      </button>
      {open ? (
        <div className="hard-card absolute right-0 top-14 z-[70] w-[min(24rem,calc(100vw-2rem))] rounded-3xl p-4 shadow-2xl">
          <div className="flex items-center justify-between gap-3"><b className="font-display text-lg">Notifications</b>{unread ? <button onClick={readAll} className="flex items-center gap-1 text-xs font-black underline"><CheckCheck className="h-4 w-4" /> Read all</button> : null}</div>
          <div className="mt-3 max-h-96 space-y-2 overflow-y-auto">
            {items.map((item) => <Link key={item._id} href={item.href || '/dashboard'} onClick={() => read(item)} className={`block rounded-2xl border border-[var(--line)] p-3 text-sm ${item.readAt ? 'opacity-65' : 'bg-[var(--lime)]/10'}`}><b>{item.title}</b><p className="mt-1 muted">{item.message}</p></Link>)}
            {!items.length ? <p className="rounded-2xl p-4 text-center text-sm muted">No notifications yet.</p> : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

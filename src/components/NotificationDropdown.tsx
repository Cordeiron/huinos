/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Bell, Check, Trash2, Award, FileText, Calendar, Shield, Heart } from "lucide-react";
import { SystemNotification } from "../types";

interface NotificationDropdownProps {
  notifications: SystemNotification[];
  isOpen: boolean;
  onToggle: () => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onNavigateTo: (view: string) => void;
}

export default function NotificationDropdown({
  notifications,
  isOpen,
  onToggle,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
  onNavigateTo
}: NotificationDropdownProps) {
  const unreadCount = notifications.filter((n) => !n.read).length;

  if (!isOpen) return null;

  const getNotificationStyles = (type: string) => {
    switch (type) {
      case "desafio":
        return { icon: Award, color: "text-emerald-500 bg-emerald-500/10", view: "Desafio Jovem" };
      case "noticia":
        return { icon: FileText, color: "text-amber-500 bg-amber-500/10", view: "Notícias" };
      case "evento":
        return { icon: Calendar, color: "text-red-500 bg-red-500/10", view: "Agenda" };
      case "oracao":
        return { icon: Heart, color: "text-rose-500 bg-rose-500/10", view: "Pedidos de Oração" };
      default:
        return { icon: Shield, color: "text-blue-500 bg-blue-500/10", view: "Home" };
    }
  };

  return (
    <div
      id="notifications-panel"
      className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl border border-neutral-200 bg-white p-4 shadow-xl dark:border-neutral-800 dark:bg-neutral-900 z-50 animate-in fade-in slide-in-from-top-3 duration-200"
    >
      <div className="mb-3 flex items-center justify-between border-b border-neutral-100 pb-2 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-neutral-500" />
          <span className="font-display text-xs font-bold text-neutral-800 dark:text-neutral-200">
            Notificações ({unreadCount})
          </span>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="text-[10px] font-bold text-red-600 hover:underline dark:text-red-400"
            >
              Lidas
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={onClearAll}
              className="flex items-center gap-0.5 text-[10px] font-bold text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
            >
              <Trash2 className="h-3 w-3" /> Limpar
            </button>
          )}
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto space-y-1.5 pr-1">
        {notifications.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
              Nenhuma notificação por aqui. Tudo em paz! 🌟
            </p>
          </div>
        ) : (
          notifications.map((n) => {
            const config = getNotificationStyles(n.type);
            const Icon = config.icon;
            return (
              <div
                key={n.id}
                onClick={() => {
                  onMarkAsRead(n.id);
                  onNavigateTo(config.view);
                  onToggle();
                }}
                className={`flex items-start gap-3 rounded-xl p-2.5 transition-all duration-200 cursor-pointer ${
                  n.read
                    ? "opacity-60 hover:opacity-100 bg-transparent"
                    : "bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100/50 dark:border-neutral-800/50"
                }`}
              >
                <div className={`p-1.5 rounded-lg ${config.color} shrink-0`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-xs font-bold text-neutral-800 dark:text-neutral-200 truncate">
                      {n.title}
                    </span>
                    {!n.read && (
                      <span className="h-1.5 w-1.5 rounded-full bg-red-600 shrink-0" />
                    )}
                  </div>
                  <p className="text-[10px] text-neutral-500 dark:text-neutral-400 leading-normal mt-0.5 line-clamp-2">
                    {n.message}
                  </p>
                  <span className="block text-[8px] text-neutral-400 dark:text-neutral-500 mt-1">
                    {n.date}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

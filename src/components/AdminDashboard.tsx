/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  TrendingUp, Users, Heart, FileText, Calendar, Award, Lightbulb, Bell, Settings, Plus, Trash2, Check, X, ShieldAlert, BookOpen, Clock, PlayCircle, Edit, Image
} from "lucide-react";
import {
  UserRole, UserProfile, EventItem, NewsItem, Announcement, PrayerRequest, SuggestionItem, Challenge, ChallengeSubmission, SystemNotification, VerseOfTheWeek, AccessLog
} from "../types";
import { api } from "../lib/api";

interface AdminDashboardProps {
  currentRole: UserRole;
  stats: {
    membersCount: number;
    prayersCount: number;
    newsCount: number;
    eventsCount: number;
    challengesCount: number;
    suggestionsCount: number;
  };
  news: NewsItem[];
  events: EventItem[];
  challenges: Challenge[];
  submissions: ChallengeSubmission[];
  prayers: PrayerRequest[];
  suggestions: SuggestionItem[];
  accessLogs: AccessLog[];
  verse: VerseOfTheWeek;
  bannerImage: string;
  onAddNews: (title: string, subtitle: string, content: string, category: "Geral" | "Avisos" | "Acampamento" | "Espiritual" | "Eventos", author: string, coverImage: string) => void;
  onDeleteNews: (id: string) => void;
  onAddEvent: (title: string, description: string, date: string, time: string, address: string, category: any, responsible: string, mapEmbedUrl?: string, imageUrl?: string) => void;
  onUpdateEvent: (id: string, eventData: any) => void;
  onDeleteEvent: (id: string) => void;
  onAddChallenge: (title: string, description: string, startDate: string, endDate: string, prize: string, maxWinners: number, points: number, imageUrl: string) => void;
  onUpdateChallenge: (id: string, chalData: any) => void;
  onDeleteChallenge: (id: string) => void;
  galleryImages: string[];
  onAddGalleryImage: (url: string) => void;
  onApproveSubmission: (id: string, feedback: string) => void;
  onRejectSubmission: (id: string, feedback: string) => void;
  onReplyPrayer: (id: string, response: string, status: "Novo" | "Em oração" | "Respondido") => void;
  onReplySuggestion: (id: string, response: string, status: "Pendente" | "Aceita" | "Recusada") => void;
  onSendNotification: (title: string, message: string, type: "desafio" | "noticia" | "evento" | "oracao" | "aviso") => void;
  onUpdateSettings: (verseText: string, verseRef: string, bannerUrl: string) => void;
}

const INSIGNIAS_LIST = [
  { id: "ins-1", title: "Pescador de Amigos", description: "Levou 1 amigo ao grupo.", category: "Participação" },
  { id: "ins-2", title: "Rede Cheia", description: "Levou 5 amigos diferentes.", category: "Participação" },
  { id: "ins-3", title: "Influenciador", description: "Levou 10 amigos diferentes.", category: "Participação" },
  { id: "ins-4", title: "Anfitrião", description: "Recebeu e acompanhou um visitante.", category: "Participação" },
  { id: "ins-5", title: "Louvor em Ação", description: "Participou de 5 ministrações.", category: "Louvor" },
  { id: "ins-6", title: "Músico Fiel", description: "Participou de 20 ministrações.", category: "Louvor" },
  { id: "ins-7", title: "Adorador", description: "6 meses ativos no louvor.", category: "Louvor" },
  { id: "ins-8", title: "Mãos que Servem", description: "Ajudou em 3 eventos.", category: "Serviço" },
  { id: "ins-9", title: "Servo Dedicado", description: "Ajudou em 10 eventos.", category: "Serviço" },
  { id: "ins-10", title: "Bastidores do Reino", description: "Trabalhou em montagem, recepção ou limpeza.", category: "Serviço" },
  { id: "ins-11", title: "Conhecedor da Palavra", description: "Participou de 10 estudos bíblicos.", category: "Bíblia" },
  { id: "ins-12", title: "Intercessor", description: "Participou de 3 reuniões de oração.", category: "Oração" },
  { id: "ins-13", title: "Sentinela", description: "Participou de uma vigília.", category: "Oração" },
  { id: "ins-14", title: "Guerreiro de Oração", description: "Participou de 10 reuniões de oração.", category: "Oração" },
  { id: "ins-15", title: "Presença Fiel", description: "1 mês sem faltas.", category: "Comunhão" },
  { id: "ins-16", title: "Comprometido", description: "3 meses sem faltas.", category: "Comunhão" },
  { id: "ins-17", title: "Exemplo de Fidelidade", description: "6 meses sem faltas.", category: "Comunhão" },
  { id: "ins-18", title: "Evangelista", description: "Compartilhou o evangelho com 3 pessoas.", category: "Desafios" },
  { id: "ins-19", title: "Missionário de Um Dia", description: "Participou de ação evangelística.", category: "Desafios" },
  { id: "ins-20", title: "Impacto Social", description: "Participou de ação solidária.", category: "Desafios" }
];

export default function AdminDashboard({
  currentRole,
  stats,
  news,
  events,
  challenges,
  submissions,
  prayers,
  suggestions,
  accessLogs,
  verse,
  bannerImage,
  onAddNews,
  onDeleteNews,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
  onAddChallenge,
  onUpdateChallenge,
  onDeleteChallenge,
  galleryImages = [],
  onAddGalleryImage,
  onApproveSubmission,
  onRejectSubmission,
  onReplyPrayer,
  onReplySuggestion,
  onSendNotification,
  onUpdateSettings
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<"dashboard" | "news" | "events" | "challenges" | "prayers" | "suggestions" | "notifications" | "settings" | "users" | "gallery">("dashboard");

  // User management states
  const [usersList, setUsersList] = useState<any[]>([]);

  // Calculation of birthdays today
  const getBirthdaysToday = () => {
    const today = new Date();
    const todayMonth = String(today.getMonth() + 1).padStart(2, "0");
    const todayDay = String(today.getDate()).padStart(2, "0");
    const matchMD = `${todayMonth}-${todayDay}`;

    return usersList.filter((u: any) => {
      if (!u.birthDate) return false;
      let birthMD = "";
      if (u.birthDate.includes("-")) {
        const parts = u.birthDate.split("-");
        if (parts.length >= 3) {
          birthMD = `${parts[1]}-${parts[2]}`;
        }
      } else if (u.birthDate.includes("/")) {
        const parts = u.birthDate.split("/");
        if (parts.length >= 2) {
          birthMD = `${parts[1]}-${parts[0]}`;
        }
      }
      return birthMD === matchMD;
    });
  };

  const birthdaysToday = getBirthdaysToday();
  const activeUsersCount = React.useMemo(() => {
    if (!accessLogs || accessLogs.length === 0) return 0;
    // Count unique users who logged in or performed actions
    const uniqueUsernames = new Set(accessLogs.map(log => log.userName.trim().toLowerCase()));
    return uniqueUsernames.size;
  }, [accessLogs]);

  const [usersLoading, setUsersLoading] = useState(false);
  const [userFormName, setUserFormName] = useState("");
  const [userFormEmail, setUserFormEmail] = useState("");
  const [userFormPassword, setUserFormPassword] = useState("");
  const [userFormRole, setUserFormRole] = useState<UserRole>(UserRole.MEMBER);
  const [userFormPhone, setUserFormPhone] = useState("");
  const [userFormBirthDate, setUserFormBirthDate] = useState("");
  const [userFormCellGroup, setUserFormCellGroup] = useState("");
  const [userFormPoints, setUserFormPoints] = useState(0);
  const [userFormAchievements, setUserFormAchievements] = useState<any[]>([]);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  const fetchUsersList = async () => {
    setUsersLoading(true);
    try {
      const data = await api.getUsers();
      setUsersList(data);
    } catch (err: any) {
      showToast(err.message || "Erro ao carregar lista de usuários");
    } finally {
      setUsersLoading(false);
    }
  };

  // Fetch users when active tab is users, dashboard, challenges or on component mount
  React.useEffect(() => {
    if (activeTab === "users" || activeTab === "dashboard" || activeTab === "challenges") {
      fetchUsersList();
    }
  }, [activeTab]);

  const handleCreateOrUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userFormName || !userFormEmail || (!editingUserId && !userFormPassword)) {
      showToast("Preencha todos os campos obrigatórios");
      return;
    }

    try {
      if (editingUserId) {
        // Update
        const payload: any = {
          name: userFormName,
          email: userFormEmail,
          phone: userFormPhone,
          birthDate: userFormBirthDate,
          cellGroup: userFormCellGroup,
          points: Number(userFormPoints),
          achievements: userFormAchievements
        };
        if (userFormPassword) {
          payload.password = userFormPassword;
        }
        if (currentRole === UserRole.ADMIN) {
          payload.role = userFormRole;
        }

        await api.updateUser(editingUserId, payload);
        showToast("Usuário atualizado com sucesso!");
      } else {
        // Create
        const payload = {
          name: userFormName,
          email: userFormEmail,
          password: userFormPassword,
          role: currentRole === UserRole.ADMIN ? userFormRole : UserRole.MEMBER,
          phone: userFormPhone,
          birthDate: userFormBirthDate,
          cellGroup: userFormCellGroup,
          achievements: userFormAchievements
        };

        await api.createUser(payload);
        showToast("Novo usuário cadastrado com sucesso!");
      }

      // Reset form
      setUserFormName("");
      setUserFormEmail("");
      setUserFormPassword("");
      setUserFormRole(UserRole.MEMBER);
      setUserFormPhone("");
      setUserFormBirthDate("");
      setUserFormCellGroup("");
      setUserFormPoints(0);
      setUserFormAchievements([]);
      setEditingUserId(null);

      // Reload
      fetchUsersList();
    } catch (err: any) {
      showToast(err.message || "Erro ao salvar usuário");
    }
  };

  const startEditUser = (user: any) => {
    setEditingUserId(user.id);
    setUserFormName(user.name);
    setUserFormEmail(user.email);
    setUserFormPassword(""); // Leave empty for no change
    setUserFormRole(user.role);
    setUserFormPhone(user.phone || "");
    setUserFormBirthDate(user.birthDate || "");
    setUserFormCellGroup(user.cellGroup || "");
    setUserFormPoints(user.points || 0);
    setUserFormAchievements(user.achievements || []);
  };

  const cancelEditUser = () => {
    setEditingUserId(null);
    setUserFormName("");
    setUserFormEmail("");
    setUserFormPassword("");
    setUserFormRole(UserRole.MEMBER);
    setUserFormPhone("");
    setUserFormBirthDate("");
    setUserFormCellGroup("");
    setUserFormPoints(0);
    setUserFormAchievements([]);
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("Tem certeza que deseja excluir permanentemente este usuário?")) {
      return;
    }
    try {
      await api.deleteUser(userId);
      showToast("Usuário excluído com sucesso!");
      fetchUsersList();
    } catch (err: any) {
      showToast(err.message || "Erro ao excluir usuário");
    }
  };

  // Auto-correct active tab if restricted for Leader
  React.useEffect(() => {
    if (currentRole !== UserRole.ADMIN && currentRole !== UserRole.LEADER) {
      if (activeTab === "challenges" || activeTab === "prayers" || activeTab === "suggestions") {
        setActiveTab("dashboard");
      }
    } else if (currentRole !== UserRole.ADMIN) {
      if (activeTab === "prayers" || activeTab === "suggestions") {
        setActiveTab("dashboard");
      }
    }
  }, [currentRole, activeTab]);

  // Local state for non-blocking toast notifications
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  // Local form states
  const [newsTitle, setNewsTitle] = useState("");
  const [newsSubtitle, setNewsSubtitle] = useState("");
  const [newsContent, setNewsContent] = useState("");
  const [newsCat, setNewsCat] = useState<any>("Geral");
  const [newsCover, setNewsCover] = useState("");

  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [editingChallengeId, setEditingChallengeId] = useState<string | null>(null);

  const [evtTitle, setEvtTitle] = useState("");
  const [evtDesc, setEvtDesc] = useState("");
  const [evtDate, setEvtDate] = useState("");
  const [evtTime, setEvtTime] = useState("");
  const [evtAddr, setEvtAddr] = useState("");
  const [evtCat, setEvtCat] = useState<any>("Culto");
  const [evtResp, setEvtResp] = useState("");
  const [evtMap, setEvtMap] = useState("");
  const [evtImg, setEvtImg] = useState("");

  const [chalTitle, setChalTitle] = useState("");
  const [chalDesc, setChalDesc] = useState("");
  const [chalStart, setChalStart] = useState("");
  const [chalEnd, setChalEnd] = useState("");
  const [chalPrize, setChalPrize] = useState("");
  const [chalPoints, setChalPoints] = useState(100);
  const [chalImg, setChalImg] = useState("");

  const [prayerResponseText, setPrayerResponseText] = useState<{ [key: string]: string }>({});
  const [sugResponseText, setSugResponseText] = useState<{ [key: string]: string }>({});

  const [notifTitle, setNotifTitle] = useState("");
  const [notifMsg, setNotifMsg] = useState("");
  const [notifType, setNotifType] = useState<any>("aviso");

  const [settingsVerse, setSettingsVerse] = useState(verse.text);
  const [settingsRef, setSettingsRef] = useState(verse.reference);
  const [settingsBanner, setSettingsBanner] = useState(bannerImage);

  const [feedbackText, setFeedbackText] = useState<{ [key: string]: string }>({});

  const handleCreateNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitle || !newsContent) return;
    onAddNews(newsTitle, newsSubtitle, newsContent, newsCat, "Administrador HUIOS", newsCover || "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800");
    setNewsTitle("");
    setNewsSubtitle("");
    setNewsContent("");
    setNewsCover("");
    showToast("Notícia publicada com sucesso!");
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evtTitle || !evtDate || !evtTime || !evtAddr) return;
    if (editingEventId) {
      onUpdateEvent(editingEventId, {
        title: evtTitle,
        description: evtDesc,
        date: evtDate,
        time: evtTime,
        address: evtAddr,
        category: evtCat,
        responsible: evtResp,
        mapEmbedUrl: evtMap,
        imageUrl: evtImg
      });
      setEditingEventId(null);
      showToast("Evento atualizado com sucesso!");
    } else {
      onAddEvent(evtTitle, evtDesc, evtDate, evtTime, evtAddr, evtCat, evtResp, evtMap, evtImg);
      showToast("Evento adicionado com sucesso!");
    }
    setEvtTitle("");
    setEvtDesc("");
    setEvtDate("");
    setEvtTime("");
    setEvtAddr("");
    setEvtResp("");
    setEvtMap("");
    setEvtImg("");
  };

  const startEditEvent = (evt: EventItem) => {
    setEditingEventId(evt.id);
    setEvtTitle(evt.title || "");
    setEvtDesc(evt.description || "");
    setEvtDate(evt.date || "");
    setEvtTime(evt.time || "");
    setEvtAddr(evt.address || "");
    setEvtCat(evt.category || "Culto");
    setEvtResp(evt.responsible || "");
    setEvtMap(evt.mapEmbedUrl || "");
    setEvtImg(evt.imageUrl || "");
  };

  const cancelEditEvent = () => {
    setEditingEventId(null);
    setEvtTitle("");
    setEvtDesc("");
    setEvtDate("");
    setEvtTime("");
    setEvtAddr("");
    setEvtResp("");
    setEvtMap("");
    setEvtImg("");
  };

  const handleCreateChallenge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chalTitle || !chalEnd) return;
    if (editingChallengeId) {
      onUpdateChallenge(editingChallengeId, {
        title: chalTitle,
        description: chalDesc,
        startDate: chalStart || "2026-06-30",
        endDate: chalEnd,
        prize: chalPrize || "Prêmio de Honra",
        points: chalPoints,
        imageUrl: chalImg || "https://images.unsplash.com/photo-1504052434569-70ad58565b90?auto=format&fit=crop&q=80&w=600"
      });
      setEditingChallengeId(null);
      showToast("Desafio atualizado com sucesso!");
    } else {
      onAddChallenge(chalTitle, chalDesc, chalStart || "2026-06-30", chalEnd, chalPrize || "Prêmio de Honra", 3, chalPoints, chalImg || "https://images.unsplash.com/photo-1504052434569-70ad58565b90?auto=format&fit=crop&q=80&w=600");
      showToast("Desafio criado com sucesso!");
    }
    setChalTitle("");
    setChalDesc("");
    setChalStart("");
    setChalEnd("");
    setChalPrize("");
    setChalImg("");
  };

  const startEditChallenge = (chal: Challenge) => {
    setEditingChallengeId(chal.id);
    setChalTitle(chal.title || "");
    setChalDesc(chal.description || "");
    setChalStart(chal.startDate || "");
    setChalEnd(chal.endDate || "");
    setChalPrize(chal.prize || "");
    setChalPoints(chal.points || 100);
    setChalImg(chal.imageUrl || "");
  };

  const cancelEditChallenge = () => {
    setEditingChallengeId(null);
    setChalTitle("");
    setChalDesc("");
    setChalStart("");
    setChalEnd("");
    setChalPrize("");
    setChalImg("");
  };

  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle || !notifMsg) return;
    onSendNotification(notifTitle, notifMsg, notifType);
    setNotifTitle("");
    setNotifMsg("");
    showToast("Notificação enviada a todos os jovens!");
  };

  const handleUpdateSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(settingsVerse, settingsRef, settingsBanner);
    showToast("Configurações atualizadas!");
  };

  return (
    <div id="admin-dashboard-container" className="space-y-6 pb-16 text-left">
      {/* Non-blocking custom toast message */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 bg-[#C62828] text-white py-3.5 px-6 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <Check className="h-5 w-5 text-white shrink-0" />
          <span className="text-xs font-bold tracking-wide">{toastMsg}</span>
        </div>
      )}

      {/* Header with security note */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#C62828]/15 px-3 py-1 border border-red-500/20 text-[10px] font-bold text-red-500 tracking-wider">
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>PAINEL DE CONTROLE PROTEGIDO (LGPD SECURE)</span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-black text-neutral-800 dark:text-white mt-2">
            Administração Geral HUIOS
          </h2>
        </div>

        <div className="text-[10px] bg-[#252525] rounded-xl px-4 py-2 font-mono text-neutral-400 text-left border border-white/5 shadow-inner">
          <span className="text-[#C62828] font-bold">●</span> SESSÃO SECURE: SSL ACTIVE
        </div>
      </section>

      {/* Main navigation tabs for dashboard */}
      <section className="flex flex-wrap gap-1.5 bg-[#252525] p-2 rounded-2xl border border-white/5 shadow-md">
        {[
          { id: "dashboard", label: "Dashboard", icon: TrendingUp },
          { id: "users", label: "Usuários", icon: Users },
          { id: "news", label: "Notícias", icon: FileText },
          { id: "events", label: "Agenda", icon: Calendar },
          ...(currentRole === UserRole.ADMIN || currentRole === UserRole.LEADER
            ? [{ id: "challenges", label: "Desafios", icon: Award }]
            : []),
          ...(currentRole === UserRole.ADMIN
            ? [
                { id: "prayers", label: "Pedidos Oração", icon: Heart },
                { id: "suggestions", label: "Sugestões", icon: Lightbulb }
              ]
            : []),
          { id: "notifications", label: "Notificações", icon: Bell },
          { id: "gallery", label: "Banco de Imagens", icon: Image },
          { id: "settings", label: "Configurações", icon: Settings }
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                isSelected
                  ? "bg-[#C62828] text-white shadow-lg shadow-red-950/20"
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </section>

      {/* TAB 1: GENERAL STATS DASHBOARD */}
      {activeTab === "dashboard" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Card stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            {[
              { label: "Membros Ativos", val: stats.membersCount, icon: Users, col: "text-blue-400 bg-blue-950/35" },
              { label: "Pedidos Oração", val: stats.prayersCount, icon: Heart, col: "text-red-400 bg-red-950/35" },
              { label: "Notícias e Artigos", val: stats.newsCount, icon: FileText, col: "text-amber-400 bg-amber-950/35" },
              { label: "Próximos Eventos", val: stats.eventsCount, icon: Calendar, col: "text-emerald-400 bg-emerald-950/35" },
              { label: "Desafios Ativos", val: stats.challengesCount, icon: Award, col: "text-indigo-400 bg-indigo-950/35" },
              { label: "Novas Sugestões", val: stats.suggestionsCount, icon: Lightbulb, col: "text-purple-400 bg-purple-950/35" }
            ].map((card, idx) => {
              const Icon = card.icon;
              return (
                <div key={idx} className="bg-[#252525] p-5 rounded-3xl border border-white/5 shadow-md flex flex-col justify-between hover:border-white/10 transition-all duration-300">
                  <div className={`p-3 rounded-2xl inline-block self-start ${card.col}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="mt-5">
                    <span className="block text-[9px] uppercase font-bold text-neutral-400 tracking-wider">{card.label}</span>
                    <span className="text-2xl font-black text-white mt-1 block tracking-tight">{card.val}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Elegant SVG visual chart representation (lg:col-span-5) */}
            <div className="lg:col-span-5 bg-[#252525] rounded-3xl p-6 border border-white/5 shadow-lg space-y-4 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-[#C62828]/5 blur-3xl pointer-events-none" />
              <div>
                <h3 className="font-display text-xs font-bold text-white flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-[#C62828]" />
                  <span>Engajamento de Participação</span>
                </h3>
              </div>
              
              {/* Counter Display */}
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl font-black text-white tracking-tight">{activeUsersCount}</span>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider font-mono bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  Usuários Ativos Online
                </span>
              </div>

              {/* Custom SVG Line Chart */}
              <div className="h-32 w-full pt-2">
                <svg viewBox="0 0 500 120" className="w-full h-full text-[#C62828]">
                  <defs>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>
                  
                  {/* Grid lines */}
                  <line x1="20" y1="20" x2="480" y2="20" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
                  <line x1="20" y1="60" x2="480" y2="60" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
                  <line x1="20" y1="100" x2="480" y2="100" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />

                  <path
                    d={`M 20 100 Q 150 ${100 - activeUsersCount * 8} 300 ${100 - activeUsersCount * 12} T 480 ${100 - activeUsersCount * 15}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    filter="url(#glow)"
                  />
                  <circle cx="20" cy="100" r="5" fill="currentColor" />
                  <circle cx="200" cy={Math.max(10, 100 - activeUsersCount * 10)} r="5" fill="currentColor" />
                  <circle cx="350" cy={Math.max(10, 100 - activeUsersCount * 12)} r="5" fill="currentColor" />
                  <circle cx="480" cy={Math.max(10, 100 - activeUsersCount * 15)} r="5" fill="currentColor" />
                  
                  {/* labels */}
                  <text x="20" y="115" fontSize="9" fill="#666">Membros</text>
                  <text x="200" y="115" fontSize="9" fill="#666">Registrados</text>
                  <text x="350" y="115" fontSize="9" fill="#666">Acessando</text>
                  <text x="440" y="115" fontSize="9" fill="#999">Hoje</text>
                </svg>
              </div>
              <p className="text-[10px] text-neutral-400 text-center font-light">Quantidade de membros que acessaram e interagiram na plataforma recentemente.</p>
            </div>

            {/* 🎉 Birthdays of the Day (lg:col-span-4) */}
            <div className="lg:col-span-4 bg-[#252525] rounded-3xl p-6 border border-white/5 shadow-lg space-y-4 flex flex-col">
              <h3 className="font-display text-xs font-bold text-white flex items-center gap-1.5">
                <span className="text-base">🎉</span>
                <span>Aniversariantes do Dia</span>
              </h3>

              <div className="space-y-3 overflow-y-auto pr-1 flex-1 max-h-64">
                {birthdaysToday.length === 0 ? (
                  <div className="text-center py-10 rounded-2xl border border-dashed border-white/5 flex flex-col items-center justify-center h-full">
                    <span className="text-2xl mb-2">🎂</span>
                    <p className="text-[10px] text-neutral-400 italic">Nenhum membro faz aniversário hoje.</p>
                  </div>
                ) : (
                  birthdaysToday.map((member) => (
                    <div key={member.id} className="p-3 bg-[#1B1B1B]/40 border border-white/5 rounded-2xl flex items-center justify-between gap-3 hover:border-[#C62828]/30 transition-all duration-300">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-[#C62828] to-amber-500 text-white flex items-center justify-center text-xs font-black uppercase shrink-0">
                          {member.name.slice(0, 2)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-white text-xs truncate">{member.name}</p>
                          <p className="text-[9px] text-neutral-400 mt-0.5 truncate">{member.cellGroup || "Sem célula"}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end shrink-0">
                        <span className="text-xs">🎈</span>
                        <span className="text-[8px] font-bold text-amber-400 uppercase tracking-wider font-mono">PARABÉNS!</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <p className="text-[9px] text-neutral-500 text-center italic">Gerado automaticamente a partir do cadastro de membros.</p>
            </div>

            {/* Access Logs (Right column, lg:col-span-3) */}
            <div className="lg:col-span-3 bg-[#252525] rounded-3xl p-6 border border-white/5 shadow-lg space-y-4 flex flex-col">
              <h3 className="font-display text-xs font-bold text-white flex items-center gap-1.5">
                <Clock className="h-4.5 w-4.5 text-[#C62828]" />
                <span>Auditoria de Acessos</span>
              </h3>
 
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1 flex-1">
                {accessLogs
                  .filter((log) => log.role === UserRole.LEADER || log.role === "Líder" || log.role === UserRole.ADMIN || log.role === "Administrador")
                  .map((log) => (
                    <div key={log.id} className="text-[10px] border-b border-white/5 pb-2.5 flex justify-between items-start last:border-0 last:pb-0">
                      <div>
                        <div className="flex items-center gap-1">
                          <p className="font-bold text-white truncate max-w-[120px]">
                            {log.userName}
                          </p>
                          <span className="text-[7px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#C62828]/10 text-[#C62828] scale-90">
                            Líder
                          </span>
                        </div>
                        <p className="text-neutral-400 mt-0.5 text-[9px]">{log.action}</p>
                      </div>
                      <span className="font-mono text-neutral-500 text-[8px] shrink-0">{log.timestamp}</span>
                    </div>
                  ))}
                {accessLogs.filter((log) => log.role === UserRole.LEADER || log.role === "Líder" || log.role === UserRole.ADMIN || log.role === "Administrador").length === 0 && (
                  <p className="text-[10px] text-neutral-400 italic text-center py-4">Nenhuma ação de liderança registrada.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: NEWS MANAGER */}
      {activeTab === "news" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start animate-in fade-in duration-200">
          {/* Add News Form */}
          <div className="bg-[#252525] rounded-3xl p-6 border border-white/5 shadow-xl space-y-5">
            <h3 className="font-display text-sm font-bold text-white flex items-center gap-1.5">
              <Plus className="h-4.5 w-4.5 text-[#C62828]" />
              <span>Escrever Artigo ou Notícia</span>
            </h3>

            <form onSubmit={handleCreateNews} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-neutral-400 uppercase">Título da Notícia</label>
                <input
                  type="text"
                  value={newsTitle}
                  onChange={(e) => setNewsTitle(e.target.value)}
                  placeholder="Ex: Novo ciclo de estudos bíblicos inicia na próxima célula"
                  required
                  className="w-full py-2.5 px-3 text-xs bg-[#1B1B1B] border border-white/5 rounded-xl outline-none text-white focus:border-[#C62828]/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-neutral-400 uppercase">Subtítulo / Chamada Rápida</label>
                <input
                  type="text"
                  value={newsSubtitle}
                  onChange={(e) => setNewsSubtitle(e.target.value)}
                  placeholder="Resumo curto de uma frase que aparece na listagem principal..."
                  className="w-full py-2.5 px-3 text-xs bg-[#1B1B1B] border border-white/5 rounded-xl outline-none text-white focus:border-[#C62828]/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-neutral-400 uppercase">Categoria</label>
                  <select
                    value={newsCat}
                    onChange={(e) => setNewsCat(e.target.value as any)}
                    className="w-full py-2.5 px-3 text-xs bg-[#1B1B1B] border border-white/5 rounded-xl outline-none text-white cursor-pointer focus:border-[#C62828]/50"
                  >
                    <option value="Geral">Geral</option>
                    <option value="Avisos">Avisos</option>
                    <option value="Acampamento">Acampamento</option>
                    <option value="Espiritual">Espiritual</option>
                    <option value="Eventos">Eventos</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-neutral-400 uppercase">Imagem de Capa (URL)</label>
                  <input
                    type="text"
                    value={newsCover}
                    onChange={(e) => setNewsCover(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full py-2.5 px-3 text-xs bg-[#1B1B1B] border border-white/5 rounded-xl outline-none text-white focus:border-[#C62828]/50"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-neutral-400 uppercase">Texto Formatado</label>
                <textarea
                  value={newsContent}
                  onChange={(e) => setNewsContent(e.target.value)}
                  required
                  rows={6}
                  placeholder="Escreva aqui todo o corpo de texto de sua notícia..."
                  className="w-full py-2.5 px-3 text-xs bg-[#1B1B1B] border border-white/5 rounded-xl outline-none text-white resize-none focus:border-[#C62828]/50"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#C62828] text-white text-xs font-bold py-2.5 shadow-md hover:bg-red-700 transition-colors"
              >
                <span>Publicar Notícia</span>
              </button>
            </form>
          </div>

          {/* Listing Active News */}
          <div className="bg-[#252525] rounded-3xl p-6 border border-white/5 shadow-xl space-y-4">
            <h3 className="font-display text-sm font-bold text-white">
              Notícias Publicadas ({news.length})
            </h3>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {news.map((item) => (
                <div key={item.id} className="flex gap-4 border-b border-white/5 pb-3 last:border-0 last:pb-0 justify-between items-center">
                  <div className="flex gap-3 min-w-0">
                    <img src={item.coverImage} className="h-12 w-16 object-cover rounded-xl shrink-0 border border-white/5" alt="" />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                      <p className="text-[9px] text-neutral-400 mt-1">{item.category} • {item.date}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onDeleteNews(item.id);
                      showToast("Notícia removida!");
                    }}
                    className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/5 transition-colors shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: EVENTS MANAGER */}
      {activeTab === "events" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start animate-in fade-in duration-200">
          {/* Add Event Form */}
          <div className="bg-[#252525] rounded-3xl p-6 border border-white/5 shadow-xl space-y-5">
            <h3 className="font-display text-sm font-bold text-white flex items-center gap-1.5">
              <Plus className="h-4.5 w-4.5 text-[#C62828]" />
              <span>{editingEventId ? "Editar Evento" : "Cadastrar Novo Evento"}</span>
            </h3>

            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-neutral-400 uppercase">Título do Evento</label>
                <input
                  type="text"
                  value={evtTitle}
                  onChange={(e) => setEvtTitle(e.target.value)}
                  placeholder="Ex: Culto Temático HUIOS"
                  required
                  className="w-full py-2.5 px-3 text-xs bg-[#1B1B1B] border border-white/5 rounded-xl outline-none text-white focus:border-[#C62828]/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-neutral-400 uppercase">Descrição</label>
                <textarea
                  value={evtDesc}
                  onChange={(e) => setEvtDesc(e.target.value)}
                  rows={3}
                  placeholder="Breve descrição dos preletores, workshops, etc..."
                  className="w-full py-2.5 px-3 text-xs bg-[#1B1B1B] border border-white/5 rounded-xl outline-none text-white resize-none focus:border-[#C62828]/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-neutral-400 uppercase">Data</label>
                  <input
                    type="date"
                    value={evtDate}
                    onChange={(e) => setEvtDate(e.target.value)}
                    required
                    className="w-full py-2.5 px-3 text-xs bg-[#1B1B1B] border border-white/5 rounded-xl outline-none text-white focus:border-[#C62828]/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-neutral-400 uppercase">Horário</label>
                  <input
                    type="time"
                    value={evtTime}
                    onChange={(e) => setEvtTime(e.target.value)}
                    required
                    className="w-full py-2.5 px-3 text-xs bg-[#1B1B1B] border border-white/5 rounded-xl outline-none text-white focus:border-[#C62828]/50"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-neutral-400 uppercase">Endereço Completo</label>
                <input
                  type="text"
                  value={evtAddr}
                  onChange={(e) => setEvtAddr(e.target.value)}
                  placeholder="Ex: Av. Nações Unidas, 1500, São Paulo"
                  required
                  className="w-full py-2.5 px-3 text-xs bg-[#1B1B1B] border border-white/5 rounded-xl outline-none text-white focus:border-[#C62828]/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-neutral-400 uppercase">Categoria</label>
                  <select
                    value={evtCat}
                    onChange={(e) => setEvtCat(e.target.value as any)}
                    className="w-full py-2.5 px-3 text-xs bg-[#1B1B1B] border border-white/5 rounded-xl outline-none text-white cursor-pointer focus:border-[#C62828]/50"
                  >
                    <option value="Culto">Culto</option>
                    <option value="Célula">Célula</option>
                    <option value="Acampamento">Acampamento</option>
                    <option value="Conferência">Conferência</option>
                    <option value="Reunião">Reunião</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-neutral-400 uppercase">Responsável / Discente</label>
                  <input
                    type="text"
                    value={evtResp}
                    onChange={(e) => setEvtResp(e.target.value)}
                    placeholder="Ex: Pastor Daniel"
                    className="w-full py-2.5 px-3 text-xs bg-[#1B1B1B] border border-white/5 rounded-xl outline-none text-white focus:border-[#C62828]/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-neutral-400 uppercase">Imagem de Fundo (URL)</label>
                  <input
                    type="text"
                    value={evtImg}
                    onChange={(e) => setEvtImg(e.target.value)}
                    placeholder="https://..."
                    className="w-full py-2.5 px-3 text-xs bg-[#1B1B1B] border border-white/5 rounded-xl outline-none text-white focus:border-[#C62828]/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-neutral-400 uppercase">Embed Google Map URL</label>
                  <input
                    type="text"
                    value={evtMap}
                    onChange={(e) => setEvtMap(e.target.value)}
                    placeholder="https://google.com/maps/embed?..."
                    className="w-full py-2.5 px-3 text-xs bg-[#1B1B1B] border border-white/5 rounded-xl outline-none text-white focus:border-[#C62828]/50"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                {editingEventId && (
                  <button
                    type="button"
                    onClick={cancelEditEvent}
                    className="flex-1 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-bold py-2.5 hover:bg-neutral-700 transition-colors"
                  >
                    Cancelar
                  </button>
                )}
                <button
                  type="submit"
                  className="flex-[2] flex items-center justify-center gap-2 rounded-xl bg-[#C62828] text-white text-xs font-bold py-2.5 shadow-md hover:bg-red-700 transition-colors"
                >
                  <span>{editingEventId ? "Salvar Alterações" : "Adicionar ao Calendário"}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Listing Active Events */}
          <div className="bg-[#252525] rounded-3xl p-6 border border-white/5 shadow-xl space-y-4">
            <h3 className="font-display text-sm font-bold text-white">
              Cronograma de Eventos Ativos ({events.length})
            </h3>

            <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-1">
              {events.map((item) => (
                <div key={item.id} className="flex gap-4 border-b border-white/5 pb-3.5 last:border-0 last:pb-0 justify-between items-center text-xs">
                  <div>
                    <h4 className="font-bold text-white">{item.title}</h4>
                    <p className="text-[9px] text-neutral-400 mt-1">{item.date} às {item.time} — <span className="text-[#C62828] font-bold">{item.category}</span></p>
                    <p className="text-[9px] text-neutral-500 truncate max-w-[200px] mt-0.5">{item.address}</p>
                  </div>

                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => startEditEvent(item)}
                      className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
                      title="Editar Evento"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        onDeleteEvent(item.id);
                        showToast("Evento removido!");
                      }}
                      className="p-2 rounded-xl text-neutral-400 hover:text-red-500 hover:bg-white/5 transition-colors"
                      title="Excluir Evento"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CHALLENGES & PROOFS MODERATOR */}
      {activeTab === "challenges" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start animate-in fade-in duration-200">
          {/* Add / Edit Challenge */}
          <div className="space-y-6">
            <div className="bg-[#252525] rounded-3xl p-6 border border-white/5 shadow-xl space-y-5">
              <h3 className="font-display text-sm font-bold text-white flex items-center gap-1.5">
                <Plus className="h-4.5 w-4.5 text-[#C62828]" />
                <span>{editingChallengeId ? "Editar Desafio Jovem" : "Criar Desafio Jovem"}</span>
              </h3>

              <form onSubmit={handleCreateChallenge} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-neutral-400 uppercase">Título do Desafio</label>
                  <input
                    type="text"
                    value={chalTitle}
                    onChange={(e) => setChalTitle(e.target.value)}
                    placeholder="Ex: Leia João capítulo 3"
                    required
                    className="w-full py-2.5 px-3 text-xs bg-[#1B1B1B] border border-white/5 rounded-xl outline-none text-white focus:border-[#C62828]/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-neutral-400 uppercase">Descrição / Tarefas</label>
                  <textarea
                    value={chalDesc}
                    onChange={(e) => setChalDesc(e.target.value)}
                    rows={3}
                    placeholder="Explique os requisitos mínimos para o jovem concluir com sucesso..."
                    className="w-full py-2.5 px-3 text-xs bg-[#1B1B1B] border border-white/5 rounded-xl outline-none text-white resize-none focus:border-[#C62828]/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-neutral-400 uppercase">Pontuação Concedida</label>
                    <input
                      type="number"
                      value={chalPoints}
                      onChange={(e) => setChalPoints(parseInt(e.target.value) || 100)}
                      required
                      className="w-full py-2.5 px-3 text-xs bg-[#1B1B1B] border border-white/5 rounded-xl outline-none text-white focus:border-[#C62828]/50"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-neutral-400 uppercase">Prêmio Recomendado</label>
                    <input
                      type="text"
                      value={chalPrize}
                      onChange={(e) => setChalPrize(e.target.value)}
                      placeholder="Ex: Livro Cristão Clássico"
                      className="w-full py-2.5 px-3 text-xs bg-[#1B1B1B] border border-white/5 rounded-xl outline-none text-white focus:border-[#C62828]/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-neutral-400 uppercase">Data Limite de Envio</label>
                    <input
                      type="date"
                      value={chalEnd}
                      onChange={(e) => setChalEnd(e.target.value)}
                      required
                      className="w-full py-2.5 px-3 text-xs bg-[#1B1B1B] border border-white/5 rounded-xl outline-none text-white focus:border-[#C62828]/50"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-neutral-400 uppercase">Imagem Ilustrativa (URL)</label>
                    <input
                      type="text"
                      value={chalImg}
                      onChange={(e) => setChalImg(e.target.value)}
                      placeholder="https://..."
                      className="w-full py-2.5 px-3 text-xs bg-[#1B1B1B] border border-white/5 rounded-xl outline-none text-white focus:border-[#C62828]/50"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  {editingChallengeId && (
                    <button
                      type="button"
                      onClick={cancelEditChallenge}
                      className="flex-1 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-bold py-2.5 hover:bg-neutral-700 transition-colors"
                    >
                      Cancelar
                    </button>
                  )}
                  <button
                    type="submit"
                    className="flex-[2] flex items-center justify-center gap-2 rounded-xl bg-[#C62828] text-white text-xs font-bold py-2.5 shadow-md hover:bg-red-700 transition-colors"
                  >
                    <span>{editingChallengeId ? "Salvar Alterações" : "Liberar Desafio Jovem"}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* List and Manage Challenges */}
            <div className="bg-[#252525] rounded-3xl p-6 border border-white/5 shadow-xl space-y-4">
              <h3 className="font-display text-sm font-bold text-white flex items-center gap-1.5">
                <Award className="h-4.5 w-4.5 text-[#C62828]" />
                <span>Gerenciamento de Desafios ({challenges.length})</span>
              </h3>

              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                {challenges.map((chal) => (
                  <div key={chal.id} className="flex gap-4 border-b border-white/5 pb-3 last:border-0 last:pb-0 justify-between items-center text-xs bg-[#1B1B1B]/20 p-2.5 rounded-xl">
                    <div className="truncate max-w-[240px]">
                      <h4 className="font-bold text-white truncate">{chal.title}</h4>
                      <p className="text-[9px] text-neutral-400 mt-1">Expira em: <span className="text-white font-medium">{chal.endDate}</span> — <span className="text-red-400 font-bold">{chal.points} pts</span></p>
                    </div>

                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => startEditChallenge(chal)}
                        className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
                        title="Editar Desafio"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Tem certeza que deseja apagar este desafio?")) {
                            onDeleteChallenge(chal.id);
                            showToast("Desafio excluído com sucesso!");
                          }
                        }}
                        className="p-2 rounded-xl text-neutral-400 hover:text-red-500 hover:bg-white/5 transition-colors"
                        title="Apagar Desafio"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Review Pending submissions (Desafios Pendentes) */}
          <div className="bg-[#252525] rounded-3xl p-6 border border-white/5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm font-bold text-white flex items-center gap-1.5">
                <Award className="h-4.5 w-4.5 text-[#C62828]" />
                <span>Desafios Pendentes</span>
              </h3>
              <span className="rounded-full bg-[#C62828]/10 px-2.5 py-0.5 text-[10px] font-bold text-[#C62828] border border-[#C62828]/20">
                {submissions.filter((s) => s.status === "Pendente" || s.status === "Pendente de Aprovação").length} Pendentes
              </span>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
              {submissions.filter((s) => s.status === "Pendente" || s.status === "Pendente de Aprovação").length === 0 ? (
                <div className="text-center py-12 rounded-2xl border border-dashed border-white/10">
                  <p className="text-xs text-neutral-400 italic">Nenhum desafio pendente de aprovação. Bom trabalho!</p>
                </div>
              ) : (
                submissions
                  .filter((s) => s.status === "Pendente" || s.status === "Pendente de Aprovação")
                  .map((sub) => {
                    // Dynamically resolve cell group for the member
                    const memberProfile = usersList.find((u) => u.id === sub.userId);
                    const cellGroup = memberProfile?.cellGroup || "Sem célula";

                    // Format Date & Time beautifully
                    let displayDate = sub.date;
                    try {
                      const d = new Date(sub.date);
                      if (!isNaN(d.getTime())) {
                        displayDate = d.toLocaleString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        });
                      }
                    } catch (e) {
                      // fallback to original date string
                    }

                    return (
                      <div key={sub.id} className="p-4 border border-white/5 rounded-2xl space-y-4 bg-[#1B1B1B]/40 text-xs hover:border-white/10 transition-colors">
                        {/* Member Information & Cell Group */}
                        <div className="flex items-start justify-between gap-2 border-b border-white/5 pb-3">
                          <div className="flex items-center gap-2.5">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-[#C62828] to-red-400 text-white flex items-center justify-center text-xs font-black uppercase shrink-0">
                              {sub.userName.slice(0, 2)}
                            </div>
                            <div>
                              <p className="font-bold text-white text-xs">{sub.userName}</p>
                              <p className="text-[9px] text-neutral-400 mt-0.5">Célula: <span className="text-white font-medium">{cellGroup}</span></p>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-[9px] text-neutral-400 font-mono">{displayDate}</p>
                            <span className="inline-block rounded-full bg-amber-500/10 px-2 py-0.5 text-[8px] font-bold text-amber-500 border border-amber-500/20 uppercase mt-1">
                              Aguardando Líder
                            </span>
                          </div>
                        </div>

                        {/* Challenge details */}
                        <div className="space-y-2">
                          <div>
                            <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">
                              Desafio:
                            </span>
                            <p className="text-white font-bold text-xs mt-0.5">{sub.challengeTitle}</p>
                          </div>

                          <div>
                            <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">
                              Texto enviado pelo membro:
                            </span>
                            <p className="text-neutral-300 leading-relaxed italic bg-[#1B1B1B] p-3 rounded-xl border border-white/5 mt-1 whitespace-pre-wrap">
                              "{sub.text}"
                            </p>
                          </div>

                          {/* Link informado */}
                          <div>
                            <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                              Link informado:
                            </span>
                            {sub.fileUrl && sub.fileUrl !== "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=600" ? (
                              <div className="text-[10px] text-neutral-300 flex items-center gap-1.5 bg-[#1B1B1B] px-3 py-2 rounded-xl border border-white/5 hover:border-red-500/20 transition-colors">
                                <span className="text-red-400">🔗</span>
                                <a href={sub.fileUrl} target="_blank" rel="noreferrer" className="text-red-400 font-bold hover:underline break-all">
                                  {sub.fileUrl}
                                </a>
                              </div>
                            ) : (
                              <p className="text-[10px] text-neutral-500 italic bg-[#1B1B1B] px-3 py-2 rounded-xl border border-white/5">
                                Nenhum link informado.
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Actions & Feedback */}
                        <div className="space-y-3 pt-2 border-t border-white/5">
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-neutral-400 uppercase block">
                              Motivo da Rejeição / Feedback de Incentivo
                            </label>
                            <input
                              type="text"
                              placeholder="Feedback de incentivo para Aprovar ou motivo obrigatório para Rejeitar..."
                              value={feedbackText[sub.id] || ""}
                              onChange={(e) => setFeedbackText({ ...feedbackText, [sub.id]: e.target.value })}
                              className="w-full py-2.5 px-3 text-xs bg-[#1B1B1B] border border-white/5 text-white rounded-xl outline-none focus:border-[#C62828]/40"
                            />
                          </div>

                          <div className="flex gap-3">
                            <button
                              onClick={() => {
                                onApproveSubmission(sub.id, feedbackText[sub.id] || "Excelente trabalho! Desafio aprovado com sucesso.");
                                showToast("Envio aprovado com sucesso!");
                              }}
                              className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 text-white font-bold py-2.5 text-xs hover:bg-emerald-700 transition-colors shadow-md"
                            >
                              <Check className="h-4 w-4" /> Aprovar e dar pontos
                            </button>
                            <button
                              onClick={() => {
                                if (!feedbackText[sub.id]) {
                                  showToast("Por favor, preencha o motivo da rejeição no campo acima.");
                                  return;
                                }
                                onRejectSubmission(sub.id, feedbackText[sub.id]);
                                showToast("Envio rejeitado.");
                              }}
                              className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-[#C62828] text-white font-bold py-2.5 text-xs hover:bg-red-700 transition-colors shadow-md"
                            >
                              <X className="h-4 w-4" /> Rejeitar
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: PRAYER REQUESTS MANAGER */}
      {activeTab === "prayers" && (
        <div className="bg-[#252525] rounded-3xl p-6 border border-white/5 shadow-xl space-y-4 animate-in fade-in duration-200 max-w-3xl mx-auto">
          <h3 className="font-display text-sm font-bold text-white">
            Gerenciamento de Pedidos de Oração ({prayers.length})
          </h3>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
            {prayers.map((item) => (
              <div key={item.id} className="p-4 border border-white/5 rounded-2xl space-y-3 bg-[#1B1B1B]/40 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white">Enviado por: {item.isAnonymous ? "Anônimo" : item.name}</span>
                  <span className={`rounded-full px-2.5 py-0.5 text-[8px] font-bold uppercase border ${
                    item.status === "Respondido"
                      ? "bg-emerald-950/40 text-emerald-400 border-emerald-500/20"
                      : item.status === "Em oração"
                      ? "bg-amber-950/40 text-amber-400 border-amber-500/20"
                      : "bg-red-950/40 text-red-400 border-red-500/20"
                  }`}>
                    {item.status}
                  </span>
                </div>

                <p className="text-neutral-300 italic">"{item.request}"</p>

                {/* Response / Status Edit Form */}
                <div className="space-y-2 pt-2.5 border-t border-white/5">
                  <div className="flex gap-2">
                    <select
                      id={`status-select-${item.id}`}
                      defaultValue={item.status}
                      className="py-2 px-3 bg-[#1B1B1B] border border-white/5 text-white text-[10px] rounded-xl outline-none cursor-pointer"
                    >
                      <option value="Novo">Novo</option>
                      <option value="Em oração">Em oração</option>
                      <option value="Respondido">Respondido</option>
                    </select>

                    <input
                      type="text"
                      placeholder="Escreva uma palavra de apoio ou resposta..."
                      id={`response-input-${item.id}`}
                      defaultValue={item.adminResponse || ""}
                      className="flex-1 py-2 px-3 bg-[#1B1B1B] border border-white/5 text-white text-[10px] rounded-xl outline-none focus:border-[#C62828]/40"
                    />

                    <button
                      onClick={() => {
                        const statusVal = (document.getElementById(`status-select-${item.id}`) as HTMLSelectElement).value as any;
                        const responseVal = (document.getElementById(`response-input-${item.id}`) as HTMLInputElement).value;
                        onReplyPrayer(item.id, responseVal, statusVal);
                        showToast("Pedido de oração atualizado!");
                      }}
                      className="bg-[#C62828] hover:bg-red-700 text-white rounded-xl px-4 text-[10px] font-bold transition-colors"
                    >
                      Salvar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: SUGGESTIONS MODERATOR */}
      {activeTab === "suggestions" && (
        <div className="bg-[#252525] rounded-3xl p-6 border border-white/5 shadow-xl space-y-4 animate-in fade-in duration-200 max-w-3xl mx-auto">
          <h3 className="font-display text-sm font-bold text-white">
            Moderação de Ideias e Sugestões ({suggestions.length})
          </h3>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
            {suggestions.map((item) => (
              <div key={item.id} className="p-4 border border-white/5 rounded-2xl space-y-3 bg-[#1B1B1B]/40 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white">Enviada por: {item.name} ({item.category})</span>
                  <span className={`rounded-full px-2.5 py-0.5 text-[8px] font-bold uppercase border ${
                    item.status === "Aceita"
                      ? "bg-emerald-950/40 text-emerald-400 border-emerald-500/20"
                      : item.status === "Recusada"
                      ? "bg-red-950/40 text-red-400 border-red-500/20"
                      : "bg-[#1B1B1B] text-neutral-400 border-white/5"
                  }`}>
                    {item.status}
                  </span>
                </div>

                <p className="text-neutral-300 italic">"{item.suggestion}"</p>

                {/* Reply Form */}
                <div className="space-y-2 pt-2.5 border-t border-white/5">
                  <div className="flex gap-2">
                    <select
                      id={`sug-status-${item.id}`}
                      defaultValue={item.status}
                      className="py-2 px-3 bg-[#1B1B1B] border border-white/5 text-white text-[10px] rounded-xl outline-none cursor-pointer"
                    >
                      <option value="Pendente">Pendente</option>
                      <option value="Aceita">Aceita</option>
                      <option value="Recusada">Recusada</option>
                    </select>

                    <input
                      type="text"
                      placeholder="Escreva seu parecer/retorno para a ideia..."
                      id={`sug-response-${item.id}`}
                      defaultValue={item.adminResponse || ""}
                      className="flex-1 py-2 px-3 bg-[#1B1B1B] border border-white/5 text-white text-[10px] rounded-xl outline-none focus:border-[#C62828]/40"
                    />

                    <button
                      onClick={() => {
                        const statusVal = (document.getElementById(`sug-status-${item.id}`) as HTMLSelectElement).value as any;
                        const responseVal = (document.getElementById(`sug-response-${item.id}`) as HTMLInputElement).value;
                        onReplySuggestion(item.id, responseVal, statusVal);
                        showToast("Parecer da sugestão atualizado!");
                      }}
                      className="bg-[#C62828] hover:bg-red-700 text-white rounded-xl px-4 text-[10px] font-bold transition-colors"
                    >
                      Salvar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: SEND NOTIFICATION */}
      {activeTab === "notifications" && (
        <div className="bg-[#252525] rounded-3xl p-6 border border-white/5 shadow-xl max-w-xl mx-auto space-y-5 animate-in fade-in duration-200">
          <h3 className="font-display text-sm font-bold text-white flex items-center gap-1.5">
            <Bell className="h-4.5 w-4.5 text-[#C62828] animate-pulse" />
            <span>Emitir Alerta em Tempo Real</span>
          </h3>

          <form onSubmit={handleSendNotification} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-neutral-400 uppercase">Título do Alerta</label>
              <input
                type="text"
                value={notifTitle}
                onChange={(e) => setNotifTitle(e.target.value)}
                placeholder="Ex: Evento amanhã às 19:30!"
                required
                className="w-full py-2.5 px-3 text-xs bg-[#1B1B1B] border border-white/5 rounded-xl outline-none text-white focus:border-[#C62828]/50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold text-neutral-400 uppercase">Tipo de Mídia / Alerta</label>
              <select
                value={notifType}
                onChange={(e) => setNotifType(e.target.value as any)}
                className="w-full py-2.5 px-3 text-xs bg-[#1B1B1B] border border-white/5 rounded-xl outline-none text-white cursor-pointer focus:border-[#C62828]/50"
              >
                <option value="aviso">Aviso Geral</option>
                <option value="desafio">Novo Desafio Jovem</option>
                <option value="noticia">Nova Notícia Publicada</option>
                <option value="evento">Lembrete de Evento / Agenda</option>
                <option value="oracao">Motivo de Oração</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold text-neutral-400 uppercase">Mensagem Completa</label>
              <textarea
                value={notifMsg}
                onChange={(e) => setNotifMsg(e.target.value)}
                required
                rows={4}
                placeholder="Escreva o texto descritivo do alerta que aparecerá no dropdown dos membros..."
                className="w-full py-2.5 px-3 text-xs bg-[#1B1B1B] border border-white/5 rounded-xl outline-none text-white resize-none focus:border-[#C62828]/50"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#C62828] text-white text-xs font-bold py-2.5 shadow-md hover:bg-red-700 transition-colors"
            >
              <span>Transmitir Alerta</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 8: IMAGE GALLERY */}
      {activeTab === "gallery" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-[#252525] rounded-3xl p-6 border border-white/5 shadow-xl space-y-5">
            <h3 className="font-display text-sm font-bold text-white flex items-center gap-1.5">
              <Image className="h-4.5 w-4.5 text-[#C62828]" />
              <span>Banco de Imagens Compartilhado</span>
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Adicione links de imagens ou use as imagens recomendadas do portal. Você pode copiar o link de qualquer imagem clicando nela para usar nos banners, desafios, notícias ou eventos!
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const input = form.elements.namedItem("imageUrl") as HTMLInputElement;
                if (input && input.value) {
                  onAddGalleryImage(input.value);
                  input.value = "";
                  showToast("Imagem adicionada à galeria!");
                }
              }}
              className="flex gap-2"
            >
              <input
                name="imageUrl"
                type="text"
                required
                placeholder="Insira a URL de uma nova imagem (https://...)"
                className="flex-1 py-2.5 px-3 text-xs bg-[#1B1B1B] border border-white/5 rounded-xl outline-none text-white focus:border-[#C62828]/50"
              />
              <button
                type="submit"
                className="bg-[#C62828] text-white text-xs font-bold px-4 rounded-xl shadow-md hover:bg-red-700 transition-colors shrink-0"
              >
                Salvar Imagem
              </button>
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Custom Admin Images */}
            <div className="bg-[#252525] rounded-3xl p-6 border border-white/5 shadow-xl space-y-4">
              <h4 className="font-display text-xs font-bold text-white uppercase tracking-wider text-neutral-400">
                Imagens Adicionadas ({galleryImages.length})
              </h4>
              
              {galleryImages.length === 0 ? (
                <div className="text-center py-12 rounded-2xl border border-dashed border-white/10">
                  <p className="text-xs text-neutral-400 italic">Nenhuma imagem personalizada adicionada ainda.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-1">
                  {galleryImages.map((imgUrl, i) => (
                    <div key={i} className="group relative bg-[#1B1B1B] rounded-xl overflow-hidden border border-white/5 shadow">
                      <img
                        src={imgUrl}
                        alt={`Galeria ${i}`}
                        className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=400";
                        }}
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                        <span className="text-[8px] text-neutral-300 truncate font-mono">{imgUrl}</span>
                        <div className="flex gap-1.5 justify-end">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(imgUrl);
                              showToast("Link copiado para a área de transferência!");
                            }}
                            className="bg-[#C62828] text-white text-[9px] font-bold py-1 px-2 rounded-lg hover:bg-red-700 transition-colors"
                          >
                            Copiar Link
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Standard System Images */}
            <div className="bg-[#252525] rounded-3xl p-6 border border-white/5 shadow-xl space-y-4">
              <h4 className="font-display text-xs font-bold text-white uppercase tracking-wider text-neutral-400">
                Imagens Disponíveis no Site (Padrão)
              </h4>
              
              <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-1">
                {[
                  { title: "Louvor & Adoração", url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800" },
                  { title: "Comunhão", url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=800" },
                  { title: "Ação Solidária", url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800" },
                  { title: "Integração", url: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=800" },
                  { title: "Capacitação", url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800" },
                  { title: "Estudos Bíblicos", url: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=800" },
                  { title: "Acampamento Jovem", url: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&q=80&w=800" },
                  { title: "Desafios Recompensas", url: "https://images.unsplash.com/photo-1504052434569-70ad58565b90?auto=format&fit=crop&q=80&w=800" }
                ].map((img, i) => (
                  <div key={i} className="group relative bg-[#1B1B1B] rounded-xl overflow-hidden border border-white/5 shadow">
                    <img
                      src={img.url}
                      alt={img.title}
                      className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                      <span className="text-[10px] text-white font-bold truncate">{img.title}</span>
                      <div className="flex gap-1.5 justify-end">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(img.url);
                            showToast(`Link para "${img.title}" copiado!`);
                          }}
                          className="bg-[#C62828] text-white text-[9px] font-bold py-1 px-2 rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Copiar Link
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: GLOBAL SYSTEM CONFIG */}
      {activeTab === "settings" && (
        <div className="bg-[#252525] rounded-3xl p-6 border border-white/5 shadow-xl max-w-xl mx-auto space-y-5 animate-in fade-in duration-200">
          <h3 className="font-display text-sm font-bold text-white flex items-center gap-1.5">
            <Settings className="h-4.5 w-4.5 text-[#C62828]" />
            <span>Configurações do Portal</span>
          </h3>

          <form onSubmit={handleUpdateSettings} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-neutral-400 uppercase">Versículo da Semana</label>
              <textarea
                value={settingsVerse}
                onChange={(e) => setSettingsVerse(e.target.value)}
                required
                rows={3}
                placeholder="Cole o texto bíblico selecionado..."
                className="w-full py-2.5 px-3 text-xs bg-[#1B1B1B] border border-white/5 text-white rounded-xl outline-none resize-none focus:border-[#C62828]/50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold text-neutral-400 uppercase">Referência Bíblica</label>
              <input
                type="text"
                value={settingsRef}
                onChange={(e) => setSettingsRef(e.target.value)}
                placeholder="Ex: Romanos 8:14"
                required
                className="w-full py-2.5 px-3 text-xs bg-[#1B1B1B] border border-white/5 text-white rounded-xl outline-none focus:border-[#C62828]/50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold text-neutral-400 uppercase">Banner Principal da Home (URL)</label>
              <input
                type="text"
                value={settingsBanner}
                onChange={(e) => setSettingsBanner(e.target.value)}
                required
                className="w-full py-2.5 px-3 text-xs bg-[#1B1B1B] border border-white/5 text-white rounded-xl outline-none focus:border-[#C62828]/50"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#C62828] text-white text-xs font-bold py-2.5 shadow-md hover:bg-red-700 transition-colors"
            >
              <span>Salvar Alterações</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 9: USER MANAGEMENT (ADMIN & LEADER REAL SECURE RBAC UI) */}
      {activeTab === "users" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
          
          {/* USER FORM (CREATE & EDIT) */}
          <div className="lg:col-span-1 bg-[#252525] rounded-3xl p-6 border border-white/5 shadow-xl space-y-4 h-fit">
            <h3 className="font-display text-sm font-bold text-white flex items-center gap-1.5">
              <Plus className="h-4.5 w-4.5 text-[#C62828]" />
              <span>{editingUserId ? "Editar Usuário" : "Cadastrar Novo"}</span>
            </h3>
            
            <form onSubmit={handleCreateOrUpdateUser} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-neutral-400 uppercase">Nome Completo *</label>
                <input
                  type="text"
                  value={userFormName}
                  onChange={(e) => setUserFormName(e.target.value)}
                  placeholder="Nome do usuário"
                  required
                  className="w-full py-2.5 px-3 text-xs bg-[#1B1B1B] border border-white/5 text-white rounded-xl outline-none focus:border-[#C62828]/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-neutral-400 uppercase">Endereço de E-mail *</label>
                <input
                  type="email"
                  value={userFormEmail}
                  onChange={(e) => setUserFormEmail(e.target.value)}
                  placeholder="email@exemplo.com"
                  required
                  className="w-full py-2.5 px-3 text-xs bg-[#1B1B1B] border border-white/5 text-white rounded-xl outline-none focus:border-[#C62828]/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-neutral-400 uppercase">
                  {editingUserId ? "Nova Senha (deixe em branco para não alterar)" : "Senha de Acesso *"}
                </label>
                <input
                  type="password"
                  value={userFormPassword}
                  onChange={(e) => setUserFormPassword(e.target.value)}
                  placeholder={editingUserId ? "Preencha apenas para mudar" : "Senha de 6+ dígitos"}
                  required={!editingUserId}
                  className="w-full py-2.5 px-3 text-xs bg-[#1B1B1B] border border-white/5 text-white rounded-xl outline-none focus:border-[#C62828]/50"
                />
              </div>

              {currentRole === UserRole.ADMIN ? (
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-neutral-400 uppercase">Nível de Permissão (Role) *</label>
                  <select
                    value={userFormRole}
                    onChange={(e) => setUserFormRole(e.target.value as any)}
                    className="w-full py-2.5 px-3 text-xs bg-[#1B1B1B] border border-white/5 text-white rounded-xl outline-none focus:border-[#C62828]/50"
                  >
                    <option value={UserRole.MEMBER}>Membro</option>
                    <option value={UserRole.LEADER}>Líder de Célula</option>
                    <option value={UserRole.ADMIN}>Administrador</option>
                  </select>
                </div>
              ) : (
                <div className="space-y-1 bg-[#1B1B1B] p-3 rounded-xl border border-white/5">
                  <div className="text-[9px] font-bold text-neutral-400 uppercase">Nível de Permissão</div>
                  <div className="text-xs font-bold text-neutral-200 mt-1">Membro (Lock)</div>
                  <div className="text-[9px] text-neutral-500 mt-0.5">Líderes de célula só podem criar contas do tipo Membro.</div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-neutral-400 uppercase">Telefone / WhatsApp</label>
                <input
                  type="text"
                  value={userFormPhone}
                  onChange={(e) => setUserFormPhone(e.target.value)}
                  placeholder="(11) 99999-9999"
                  className="w-full py-2.5 px-3 text-xs bg-[#1B1B1B] border border-white/5 text-white rounded-xl outline-none focus:border-[#C62828]/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-neutral-400 uppercase">Data de Nascimento</label>
                <input
                  type="date"
                  value={userFormBirthDate}
                  onChange={(e) => setUserFormBirthDate(e.target.value)}
                  className="w-full py-2.5 px-3 text-xs bg-[#1B1B1B] border border-white/5 text-white rounded-xl outline-none focus:border-[#C62828]/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-neutral-400 uppercase">Célula / Grupo de Vínculo</label>
                <input
                  type="text"
                  value={userFormCellGroup}
                  onChange={(e) => setUserFormCellGroup(e.target.value)}
                  placeholder="Ex: Célula Koinonia"
                  className="w-full py-2.5 px-3 text-xs bg-[#1B1B1B] border border-white/5 text-white rounded-xl outline-none focus:border-[#C62828]/50"
                />
              </div>

              {editingUserId && (currentRole === UserRole.ADMIN || currentRole === UserRole.LEADER) && (
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-neutral-400 uppercase">Pontuação no Ranking</label>
                  <input
                    type="number"
                    value={userFormPoints}
                    onChange={(e) => setUserFormPoints(Number(e.target.value))}
                    className="w-full py-2.5 px-3 text-xs bg-[#1B1B1B] border border-white/5 text-white rounded-xl outline-none focus:border-[#C62828]/50"
                  />
                </div>
              )}

              {/* INSIGNIAS CHECKBOXES (ADMINS & LEADERS ONLY) */}
              {(currentRole === UserRole.ADMIN || currentRole === UserRole.LEADER) && (
                <div className="space-y-2 bg-[#1B1B1B]/40 p-4 rounded-2xl border border-white/5">
                  <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">Insígnias do Membro</span>
                  <div className="max-h-[220px] overflow-y-auto space-y-2 pr-1 scrollbar-thin">
                    {INSIGNIAS_LIST.map((ins) => {
                      const isChecked = userFormAchievements.some((a: any) => a.id === ins.id || a.title === ins.title);
                      return (
                        <label key={ins.id} className="flex items-start gap-2.5 p-2 bg-[#1B1B1B] hover:bg-[#202020] rounded-xl border border-white/5 cursor-pointer transition-colors text-left">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setUserFormAchievements([
                                  ...userFormAchievements,
                                  { id: ins.id, title: ins.title, description: ins.description, unlockedAt: new Date().toISOString() }
                                ]);
                              } else {
                                setUserFormAchievements(
                                  userFormAchievements.filter((a: any) => a.id !== ins.id && a.title !== ins.title)
                                );
                              }
                            }}
                            className="mt-0.5 rounded border-white/10 text-[#C62828] focus:ring-[#C62828]/50 focus:ring-offset-0 bg-[#121212]"
                          />
                          <div>
                            <div className="text-[10px] font-bold text-white">{ins.title}</div>
                            <div className="text-[9px] text-neutral-400 font-light mt-0.5 leading-tight">{ins.description}</div>
                            <span className="inline-block text-[8px] font-bold uppercase text-[#C62828] tracking-widest mt-1 opacity-80">{ins.category}</span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                {editingUserId && (
                  <button
                    type="button"
                    onClick={cancelEditUser}
                    className="flex-1 py-2.5 bg-[#353535] text-white text-xs font-bold rounded-xl hover:bg-[#404040] transition-colors"
                  >
                    Cancelar
                  </button>
                )}
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#C62828] text-white text-xs font-bold rounded-xl hover:bg-red-700 transition-colors shadow-md"
                >
                  {editingUserId ? "Salvar" : "Cadastrar"}
                </button>
              </div>
            </form>
          </div>

          {/* USER LIST TABLE */}
          <div className="lg:col-span-2 bg-[#252525] rounded-3xl p-6 border border-white/5 shadow-xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <h3 className="font-display text-sm font-bold text-white flex items-center gap-1.5">
                <Users className="h-4.5 w-4.5 text-[#C62828]" />
                <span>Membros & Líderes Cadastrados</span>
              </h3>
              <button
                onClick={fetchUsersList}
                className="text-[10px] text-neutral-400 hover:text-white font-mono bg-white/5 py-1 px-3.5 rounded-lg border border-white/5 transition-colors"
              >
                Atualizar Lista
              </button>
            </div>

            {usersLoading ? (
              <div className="py-12 text-center text-xs text-neutral-400 font-mono">
                Carregando banco de dados de usuários...
              </div>
            ) : usersList.length === 0 ? (
              <div className="py-12 text-center text-xs text-neutral-400">
                Nenhum usuário gerenciado sob o seu nível de acesso.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-neutral-300">
                  <thead>
                    <tr className="text-[10px] text-neutral-400 uppercase tracking-wider border-b border-white/5 font-bold">
                      <th className="py-2.5">Nome / Email</th>
                      <th className="py-2.5 text-center">Permissão</th>
                      <th className="py-2.5">Vínculo</th>
                      <th className="py-2.5 text-center">Pontos</th>
                      <th className="py-2.5 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {usersList.map((user) => (
                      <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 pr-2">
                          <div className="flex items-center gap-2.5">
                            <div className="h-7 w-7 rounded-full bg-neutral-800 text-white text-[10px] font-black flex items-center justify-center uppercase select-none">
                              {user.name.slice(0, 2)}
                            </div>
                            <div>
                              <div className="font-bold text-white">{user.name}</div>
                              <div className="text-[10px] text-neutral-400 font-mono">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 text-center">
                          {user.role === UserRole.ADMIN ? (
                            <span className="bg-red-500/10 border border-red-500/20 text-red-500 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                              Admin
                            </span>
                          ) : user.role === UserRole.LEADER ? (
                            <span className="bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                              Líder
                            </span>
                          ) : (
                            <span className="bg-neutral-500/10 border border-neutral-500/20 text-neutral-400 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                              Membro
                            </span>
                          )}
                        </td>
                        <td className="py-3">
                          <div className="font-semibold text-neutral-200">{user.cellGroup || "Sem Célula"}</div>
                          <div className="text-[10px] text-neutral-400 font-mono">{user.phone || "Sem Telefone"}</div>
                        </td>
                        <td className="py-3 text-center font-mono font-bold text-neutral-100">
                          {user.points || 0} xp
                        </td>
                        <td className="py-3 text-right space-x-1.5">
                          <button
                            onClick={() => startEditUser(user)}
                            className="bg-white/5 hover:bg-[#C62828] hover:text-white text-neutral-300 py-1 px-2.5 rounded-lg border border-white/5 transition-all text-[10px] font-bold"
                          >
                            Editar
                          </button>
                          {user.email !== "nauham86@gmail.com" && (
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="bg-red-950/15 text-red-400 border border-red-950/30 hover:bg-red-600 hover:text-white py-1 px-2.5 rounded-lg transition-all text-[10px] font-bold"
                            >
                              Excluir
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

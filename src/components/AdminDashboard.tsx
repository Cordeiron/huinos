/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  TrendingUp, Users, Heart, FileText, Calendar, Award, Lightbulb, Bell, Settings, Plus, Trash2, Check, X, ShieldAlert, BookOpen, Clock, PlayCircle
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
  onDeleteEvent: (id: string) => void;
  onAddChallenge: (title: string, description: string, startDate: string, endDate: string, prize: string, maxWinners: number, points: number, imageUrl: string) => void;
  onApproveSubmission: (id: string, feedback: string) => void;
  onRejectSubmission: (id: string, feedback: string) => void;
  onReplyPrayer: (id: string, response: string, status: "Novo" | "Em oração" | "Respondido") => void;
  onReplySuggestion: (id: string, response: string, status: "Pendente" | "Aceita" | "Recusada") => void;
  onSendNotification: (title: string, message: string, type: "desafio" | "noticia" | "evento" | "oracao" | "aviso") => void;
  onUpdateSettings: (verseText: string, verseRef: string, bannerUrl: string) => void;
}

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
  onDeleteEvent,
  onAddChallenge,
  onApproveSubmission,
  onRejectSubmission,
  onReplyPrayer,
  onReplySuggestion,
  onSendNotification,
  onUpdateSettings
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<"dashboard" | "news" | "events" | "challenges" | "prayers" | "suggestions" | "notifications" | "settings" | "users">("dashboard");

  // User management states
  const [usersList, setUsersList] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userFormName, setUserFormName] = useState("");
  const [userFormEmail, setUserFormEmail] = useState("");
  const [userFormPassword, setUserFormPassword] = useState("");
  const [userFormRole, setUserFormRole] = useState<UserRole>(UserRole.MEMBER);
  const [userFormPhone, setUserFormPhone] = useState("");
  const [userFormBirthDate, setUserFormBirthDate] = useState("");
  const [userFormCellGroup, setUserFormCellGroup] = useState("");
  const [userFormPoints, setUserFormPoints] = useState(0);
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

  // Fetch users when active tab is users or on component mount
  React.useEffect(() => {
    if (activeTab === "users" || activeTab === "dashboard") {
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
          points: Number(userFormPoints)
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
          cellGroup: userFormCellGroup
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
    if (currentRole !== UserRole.ADMIN) {
      if (activeTab === "challenges" || activeTab === "prayers" || activeTab === "suggestions") {
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
    onAddEvent(evtTitle, evtDesc, evtDate, evtTime, evtAddr, evtCat, evtResp, evtMap, evtImg);
    setEvtTitle("");
    setEvtDesc("");
    setEvtDate("");
    setEvtTime("");
    setEvtAddr("");
    setEvtResp("");
    setEvtMap("");
    setEvtImg("");
    showToast("Evento adicionado com sucesso!");
  };

  const handleCreateChallenge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chalTitle || !chalEnd) return;
    onAddChallenge(chalTitle, chalDesc, chalStart || "2026-06-30", chalEnd, chalPrize || "Medalha de Honra", 3, chalPoints, chalImg || "https://images.unsplash.com/photo-1504052434569-70ad58565b90?auto=format&fit=crop&q=80&w=600");
    setChalTitle("");
    setChalDesc("");
    setChalStart("");
    setChalEnd("");
    setChalPrize("");
    setChalImg("");
    showToast("Desafio criado com sucesso!");
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
          ...(currentRole === UserRole.ADMIN
            ? [
                { id: "challenges", label: "Desafios", icon: Award },
                { id: "prayers", label: "Pedidos Oração", icon: Heart },
                { id: "suggestions", label: "Sugestões", icon: Lightbulb }
              ]
            : []),
          { id: "notifications", label: "Notificações", icon: Bell },
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
            {/* Elegant SVG visual chart representation */}
            <div className="lg:col-span-7 bg-[#252525] rounded-3xl p-6 border border-white/5 shadow-lg space-y-4 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-[#C62828]/5 blur-3xl pointer-events-none" />
              <div>
                <h3 className="font-display text-xs font-bold text-white flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-[#C62828]" />
                  <span>Engajamento Semanal dos Jovens (Histórico)</span>
                </h3>
              </div>
              
              {/* Custom SVG Line Chart */}
              <div className="h-44 w-full pt-4">
                <svg viewBox="0 0 500 150" className="w-full h-full text-[#C62828]">
                  <defs>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>
                  <path
                    d="M 20 120 Q 100 80 180 90 T 340 40 T 480 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    filter="url(#glow)"
                  />
                  <circle cx="20" cy="120" r="5" fill="currentColor" />
                  <circle cx="180" cy="90" r="5" fill="currentColor" />
                  <circle cx="340" cy="40" r="5" fill="currentColor" />
                  <circle cx="480" cy="20" r="5" fill="currentColor" />
                  
                  {/* labels */}
                  <text x="20" y="145" fontSize="9" fill="#999">Semana 1</text>
                  <text x="180" y="145" fontSize="9" fill="#999">Semana 2</text>
                  <text x="340" y="145" fontSize="9" fill="#999">Semana 3</text>
                  <text x="430" y="145" fontSize="9" fill="#999">Semana Ativa</text>
                </svg>
              </div>
              <p className="text-[10px] text-neutral-400 text-center font-light">Gráfico ilustra o crescimento contínuo de desafios concluídos e interações no sistema HUIOS.</p>
            </div>

            {/* Access Logs (Right 5) */}
            <div className="lg:col-span-5 bg-[#252525] rounded-3xl p-6 border border-white/5 shadow-lg space-y-4 flex flex-col">
              <h3 className="font-display text-xs font-bold text-white flex items-center gap-1.5">
                <Clock className="h-4.5 w-4.5 text-[#C62828]" />
                <span>Auditoria de Logs de Acesso Recentes</span>
              </h3>

              <div className="space-y-3 max-h-64 overflow-y-auto pr-1 flex-1">
                {accessLogs.map((log) => (
                  <div key={log.id} className="text-[10px] border-b border-white/5 pb-2.5 flex justify-between items-start last:border-0 last:pb-0">
                    <div>
                      <p className="font-bold text-white">
                        {log.userName} <span className="font-normal text-neutral-400">({log.role})</span>
                      </p>
                      <p className="text-neutral-400 mt-1">{log.action}</p>
                    </div>
                    <span className="font-mono text-neutral-500 shrink-0">{log.timestamp}</span>
                  </div>
                ))}
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
              <span>Cadastrar Novo Evento</span>
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

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#C62828] text-white text-xs font-bold py-2.5 shadow-md hover:bg-red-700 transition-colors"
              >
                <span>Adicionar ao Calendário</span>
              </button>
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

                  <button
                    onClick={() => {
                      onDeleteEvent(item.id);
                      showToast("Evento removido!");
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

      {/* TAB 4: CHALLENGES & PROOFS MODERATOR */}
      {activeTab === "challenges" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start animate-in fade-in duration-200">
          {/* Add Challenge */}
          <div className="bg-[#252525] rounded-3xl p-6 border border-white/5 shadow-xl space-y-5">
            <h3 className="font-display text-sm font-bold text-white flex items-center gap-1.5">
              <Plus className="h-4.5 w-4.5 text-[#C62828]" />
              <span>Criar Desafio Jovem</span>
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

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#C62828] text-white text-xs font-bold py-2.5 shadow-md hover:bg-red-700 transition-colors"
              >
                <span>Liberar Desafio Jovem</span>
              </button>
            </form>
          </div>

          {/* Review Pending submissions */}
          <div className="bg-[#252525] rounded-3xl p-6 border border-white/5 shadow-xl space-y-4">
            <h3 className="font-display text-sm font-bold text-white">
              Moderação de Envios ({submissions.filter((s) => s.status === "Pendente").length} Pendentes)
            </h3>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
              {submissions.filter((s) => s.status === "Pendente").length === 0 ? (
                <div className="text-center py-12 rounded-2xl border border-dashed border-white/10">
                  <p className="text-xs text-neutral-400 italic">Nenhum envio pendente de validação. Bom trabalho!</p>
                </div>
              ) : (
                submissions
                  .filter((s) => s.status === "Pendente")
                  .map((sub) => (
                    <div key={sub.id} className="p-4 border border-white/5 rounded-2xl space-y-3 bg-[#1B1B1B]/40 text-xs">
                      <div className="flex items-center gap-2 justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-red-600/25 text-red-400 flex items-center justify-center text-[9px] font-black uppercase shrink-0">
                            {sub.userName.slice(0, 2)}
                          </div>
                          <span className="font-bold text-white">{sub.userName}</span>
                        </div>
                        <span className="text-[9px] text-neutral-400 font-mono">{sub.date}</span>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[8px] font-bold text-red-400 uppercase block tracking-wider">
                          Para o desafio: {sub.challengeTitle}
                        </span>
                        <p className="text-neutral-300 leading-relaxed italic bg-[#1B1B1B] p-2.5 rounded-xl border border-white/5">
                          "{sub.text}"
                        </p>
                      </div>

                      {sub.fileUrl && sub.fileUrl !== "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=600" && (
                        <div className="text-[9px] text-neutral-400 flex items-center gap-1 bg-[#1B1B1B] px-2 py-1 rounded-xl border border-white/5">
                          Anexo comprovante: <a href={sub.fileUrl} target="_blank" rel="noreferrer" className="text-red-400 font-bold hover:underline">Ver link completo</a>
                        </div>
                      )}

                      {/* Feedback Form */}
                      <div className="space-y-2 pt-1">
                        <input
                          type="text"
                          placeholder="Feedback de incentivo (opcional)..."
                          value={feedbackText[sub.id] || ""}
                          onChange={(e) => setFeedbackText({ ...feedbackText, [sub.id]: e.target.value })}
                          className="w-full py-2 px-3 text-[10px] bg-[#1B1B1B] border border-white/5 text-white rounded-lg outline-none focus:border-[#C62828]/40"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              onApproveSubmission(sub.id, feedbackText[sub.id] || "Ótimo trabalho! Desafio validado com sucesso.");
                              showToast("Envio aprovado com sucesso!");
                            }}
                            className="flex-1 flex items-center justify-center gap-1 rounded-xl bg-emerald-600 text-white font-bold py-2 text-[10px] hover:bg-emerald-700 transition-colors"
                          >
                            <Check className="h-3.5 w-3.5" /> Aprovar e dar pontos
                          </button>
                          <button
                            onClick={() => {
                              onRejectSubmission(sub.id, feedbackText[sub.id] || "Requisitos incompletos. Refaça e envie novamente.");
                              showToast("Envio reprovado.");
                            }}
                            className="flex-1 flex items-center justify-center gap-1 rounded-xl bg-[#C62828] text-white font-bold py-2 text-[10px] hover:bg-red-700 transition-colors"
                          >
                            <X className="h-3.5 w-3.5" /> Reprovar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
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

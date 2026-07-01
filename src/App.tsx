/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  Bell, Search, Menu, X, Sun, Moon, Sparkles, BookOpen, User, ShieldAlert, Compass, Calendar, Heart, FileText, Lightbulb, Phone, Shield
} from "lucide-react";

import Logo from "./components/Logo";
import Footer from "./components/Footer";
import GlobalSearch from "./components/GlobalSearch";
import NotificationDropdown from "./components/NotificationDropdown";

import HomeView from "./components/HomeView";
import AboutView from "./components/AboutView";
import ScheduleView from "./components/ScheduleView";
import NewsView from "./components/NewsView";
import PrayerRequestsView from "./components/PrayerRequestsView";
import SuggestionsView from "./components/SuggestionsView";
import ChallengesView from "./components/ChallengesView";
import ProfileView from "./components/ProfileView";
import AdminDashboard from "./components/AdminDashboard";
import LoginView from "./components/LoginView";

import { api } from "./lib/api";

import { UserRole, UserProfile, EventItem, NewsItem, PrayerRequest, SuggestionItem, Challenge, ChallengeSubmission, SystemNotification, VerseOfTheWeek, AccessLog } from "./types";
import {
  initialVerse,
  mockUsers,
  mockEvents,
  mockNews,
  mockAnnouncements,
  mockPrayerRequests,
  mockSuggestions,
  mockChallenges,
  mockSubmissions,
  mockNotifications,
  mockAccessLogs
} from "./data";

export default function App() {
  // --- Persistent Local Storage Core State ---
  const [activeView, setActiveView] = useState<string>(() => {
    return localStorage.getItem("huios_active_view") || "Home";
  });

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  const [currentRole, setCurrentRole] = useState<UserRole>(UserRole.VISITOR);

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("huios_dark_mode") === "true";
  });

  const [events, setEvents] = useState<EventItem[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [prayers, setPrayers] = useState<PrayerRequest[]>([]);
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [submissions, setSubmissions] = useState<ChallengeSubmission[]>([]);
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  
  const [verse, setVerse] = useState<VerseOfTheWeek>(initialVerse);

  const [bannerImage, setBannerImage] = useState<string>(() => {
    return localStorage.getItem("huios_banner_image") || "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200";
  });

  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  // UI state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedNewsIdFromSearch, setSelectedNewsIdFromSearch] = useState<string | undefined>(undefined);

  // Sync state to local storage on changes
  useEffect(() => {
    localStorage.setItem("huios_active_view", activeView);
  }, [activeView]);

  useEffect(() => {
    localStorage.setItem("huios_dark_mode", String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("huios_banner_image", bannerImage);
  }, [bannerImage]);

  // Auth initialization on mount
  useEffect(() => {
    const initAuth = async () => {
      if (api.getToken()) {
        try {
          const profile = await api.me();
          setCurrentUser(profile);
          setCurrentRole(profile.role);
        } catch (e) {
          api.clearToken();
          setCurrentUser(null);
          setCurrentRole(UserRole.VISITOR);
        }
      } else {
        setCurrentRole(UserRole.VISITOR);
      }
    };
    initAuth();
  }, []);

  // Fetch all database contents from server
  const loadAllData = async () => {
    try {
      const evts = await api.getEvents();
      setEvents(evts);

      const nw = await api.getNews();
      setNews(nw);

      const anns = await api.getAnnouncements(); // Announcements can be handled locally or shown in events/announcements

      if (api.getToken()) {
        try {
          const profile = await api.me();
          setCurrentUser(profile);
        } catch (err) {
          console.error("Erro ao recarregar perfil do usuário:", err);
        }

        const prs = await api.getPrayers();
        setPrayers(prs);

        const sugs = await api.getSuggestions();
        setSuggestions(sugs);

        const chals = await api.getChallenges();
        setChallenges(chals);

        const subs = await api.getSubmissions();
        setSubmissions(subs);

        const notifs = await api.getNotifications();
        setNotifications(notifs);

        if (currentUser?.role === UserRole.ADMIN || currentRole === UserRole.ADMIN) {
          const logs = await api.getLogs();
          setAccessLogs(logs);
        }

        // Load all users for dashboard stats
        const allUsers = await api.getUsers();
        setUsers(allUsers);
      }
    } catch (err) {
      console.error("Erro de sincronização com o banco de dados:", err);
    }
  };

  // Fetch all data when role changes (login/logout)
  useEffect(() => {
    loadAllData();
  }, [currentRole]);

  // Load settings (verse + banner) from database on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await api.request("/api/settings");
        if (settings) {
          setVerse({
            text: settings.verseText || initialVerse.text,
            reference: settings.verseReference || initialVerse.reference,
            translation: settings.verseTranslation || initialVerse.translation
          });
          if (settings.bannerUrl) {
            setBannerImage(settings.bannerUrl);
          }
        }
      } catch (err) {
        console.error("Erro ao carregar configurações do servidor:", err);
      }
    };
    loadSettings();
  }, []);

  // Bind active profile dynamically to chosen role for a premium simulated multi-user feel
  const getActiveUser = (): UserProfile => {
    if (currentUser) {
      return currentUser;
    }
    // Guest Visitor
    return {
      id: "visitor-guest",
      name: "Visitante",
      email: "visitante@huios.com",
      phone: "(11) 90000-0000",
      birthDate: "2006-01-01",
      cellGroup: "Sem célula vinculada",
      role: UserRole.VISITOR,
      avatarUrl: "",
      points: 0,
      medals: { gold: 0, silver: 0, bronze: 0 },
      achievements: []
    };
  };

  const activeUser = getActiveUser();

  // Log user action helper
  const logAction = (action: string) => {
    // Session operations can optionally log locally or write to logs
  };

  // --- Handlers for User Interactions ---

  const handleLikeNews = async (newsId: string) => {
    try {
      await api.likeNews(newsId);
      loadAllData();
    } catch (err) {
      console.error("Erro ao curtir notícia:", err);
    }
  };

  const handleCommentNews = async (newsId: string, commentText: string) => {
    try {
      await api.commentNews(newsId, commentText);
      loadAllData();
    } catch (err) {
      console.error("Erro ao comentar notícia:", err);
    }
  };

  const handlePrayAlong = async (prayerId: string) => {
    try {
      await api.prayAlong(prayerId);
      loadAllData();
    } catch (err) {
      console.error("Erro ao apoiar oração:", err);
    }
  };

  const handleSubmitPrayer = async (name: string, requestText: string, isAnonymous: boolean) => {
    try {
      await api.createPrayer({
        name: isAnonymous ? "Anônimo" : name,
        request: requestText,
        isAnonymous
      });
      loadAllData();
    } catch (err) {
      console.error("Erro ao criar oração:", err);
    }
  };

  const handleSubmitSuggestion = async (name: string, category: string, suggestionText: string) => {
    try {
      await api.createSuggestion({
        name,
        category,
        suggestion: suggestionText
      });
      loadAllData();
    } catch (err) {
      console.error("Erro ao criar sugestão:", err);
    }
  };

  const handleCompleteChallenge = async (challengeId: string, text: string, fileUrl: string, mediaType: "text" | "image" | "video") => {
    try {
      await api.submitChallenge({
        challengeId,
        text,
        fileUrl,
        mediaType
      });
      loadAllData();
    } catch (err) {
      console.error("Erro ao submeter desafio:", err);
    }
  };

  const handleUpdateProfile = async (name: string, phone: string, email: string, cellGroup: string, birthDate: string) => {
    try {
      if (currentUser?.id) {
        const updated = await api.updateUser(currentUser.id, {
          name,
          phone,
          email,
          cellGroup,
          birthDate
        });
        setCurrentUser(updated);
        loadAllData();
      }
    } catch (err) {
      console.error("Erro ao atualizar perfil:", err);
    }
  };

  // --- Administrative Handlers ---

  const handleAddNews = async (title: string, subtitle: string, content: string, category: any, author: string, coverImage: string) => {
    try {
      await api.createNews({
        title,
        subtitle,
        content,
        category,
        author,
        coverImage
      });
      loadAllData();
    } catch (err) {
      console.error("Erro ao adicionar notícia:", err);
    }
  };

  const handleDeleteNews = async (id: string) => {
    try {
      await api.deleteNews(id);
      loadAllData();
    } catch (err) {
      console.error("Erro ao excluir notícia:", err);
    }
  };

  const handleAddEvent = async (title: string, description: string, date: string, time: string, address: string, category: any, responsible: string, mapEmbedUrl?: string, imageUrl?: string) => {
    try {
      await api.createEvent({
        title,
        description,
        date,
        time,
        address,
        category,
        responsible,
        mapEmbedUrl,
        imageUrl
      });
      loadAllData();
    } catch (err) {
      console.error("Erro ao adicionar evento:", err);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      await api.deleteEvent(id);
      loadAllData();
    } catch (err) {
      console.error("Erro ao excluir evento:", err);
    }
  };

  const handleAddChallenge = async (title: string, description: string, startDate: string, endDate: string, prize: string, maxWinners: number, points: number, imageUrl: string) => {
    try {
      await api.createChallenge({
        title,
        description,
        startDate,
        endDate,
        prize,
        maxWinners,
        points,
        imageUrl
      });
      loadAllData();
    } catch (err) {
      console.error("Erro ao adicionar desafio:", err);
    }
  };

  const handleApproveSubmission = async (subId: string, feedback: string) => {
    try {
      await api.reviewSubmission(subId, "Aprovado", feedback);
      loadAllData();
    } catch (err) {
      console.error("Erro ao aprovar comprovação:", err);
    }
  };

  const handleRejectSubmission = async (subId: string, feedback: string) => {
    try {
      await api.reviewSubmission(subId, "Reprovado", feedback);
      loadAllData();
    } catch (err) {
      console.error("Erro ao reprovar comprovação:", err);
    }
  };

  const handleReplyPrayer = async (prayerId: string, adminResponse: string, status: any) => {
    try {
      await api.respondPrayer(prayerId, status, adminResponse);
      loadAllData();
    } catch (err) {
      console.error("Erro ao responder oração:", err);
    }
  };

  const handleReplySuggestion = async (sugId: string, adminResponse: string, status: any) => {
    try {
      await api.respondSuggestion(sugId, status, adminResponse);
      loadAllData();
    } catch (err) {
      console.error("Erro ao responder sugestão:", err);
    }
  };

  const handleSendNotification = async (title: string, message: string, type: any) => {
    try {
      await api.request("/api/notifications", {
        method: "POST",
        body: JSON.stringify({ title, message, type })
      });
      loadAllData();
    } catch (err) {
      console.error("Erro ao disparar notificação:", err);
    }
  };

  const handleUpdateSettings = async (verseText: string, verseRef: string, bannerUrl: string) => {
    try {
      await api.request("/api/settings", {
        method: "PUT",
        body: JSON.stringify({ verseText, verseReference: verseRef, bannerUrl })
      });
      setVerse({
        text: verseText,
        reference: verseRef,
        translation: "Almeida Revista e Corrigida"
      });
      setBannerImage(bannerUrl);
      loadAllData();
    } catch (err) {
      console.error("Erro ao atualizar configurações:", err);
    }
  };

  // Global Navigation callback from subcomponents
  const handleNavigateFromSearch = (view: string, itemId?: string) => {
    setActiveView(view);
    if (view === "Notícias" && itemId) {
      setSelectedNewsIdFromSearch(itemId);
    }
  };

  const handleLoginSuccess = (user: any, token: string) => {
    setCurrentUser(user);
    setCurrentRole(user.role);
    loadAllData();
  };

  const handleLogout = () => {
    api.clearToken();
    setCurrentUser(null);
    setCurrentRole(UserRole.VISITOR);
    setActiveView("Home");
  };

  // --- Render Active View Core Switcher ---
  const renderActiveView = () => {
    const isPrivateView = ["Pedidos de Oração", "Desafio Jovem", "Sugestões", "Perfil", "Admin"].includes(activeView);
    if (isPrivateView && currentRole === UserRole.VISITOR) {
      return (
        <div className="max-w-md mx-auto py-12">
          <LoginView onLoginSuccess={handleLoginSuccess} />
        </div>
      );
    }

    switch (activeView) {
      case "Login":
        return (
          <div className="max-w-md mx-auto py-12">
            <LoginView onLoginSuccess={(user, token) => {
              handleLoginSuccess(user, token);
              setActiveView("Perfil");
            }} />
          </div>
        );
      case "Sobre":
        return <AboutView currentRole={currentRole} />;
      case "Agenda":
        return <ScheduleView events={events} />;
      case "Notícias":
        return (
          <NewsView
            news={news}
            activeUser={activeUser}
            onLikeNews={handleLikeNews}
            onCommentNews={handleCommentNews}
            initiallySelectedNewsId={selectedNewsIdFromSearch}
            onClearSelectedNewsId={() => setSelectedNewsIdFromSearch(undefined)}
          />
        );
      case "Pedidos de Oração":
        return (
          <PrayerRequestsView
            prayers={prayers}
            activeUser={activeUser}
            onSubmitPrayer={handleSubmitPrayer}
            onPrayAlong={handlePrayAlong}
          />
        );
      case "Desafio Jovem":
        return (
          <ChallengesView
            challenges={challenges}
            submissions={submissions}
            activeUser={activeUser}
            rankingUsers={users.length > 0 ? users : mockUsers}
            onCompleteChallenge={handleCompleteChallenge}
          />
        );
      case "Sugestões":
        return (
          <SuggestionsView
            suggestions={suggestions}
            activeUser={activeUser}
            onSubmitSuggestion={handleSubmitSuggestion}
          />
        );
      case "Perfil":
        return (
          <ProfileView
            activeUser={activeUser}
            onUpdateProfile={handleUpdateProfile}
            onLogout={handleLogout}
          />
        );
      case "Admin":
        return (
          <AdminDashboard
            currentRole={currentRole}
            stats={{
              membersCount: users.length,
              prayersCount: prayers.length,
              newsCount: news.length,
              eventsCount: events.length,
              challengesCount: challenges.length,
              suggestionsCount: suggestions.length
            }}
            news={news}
            events={events}
            challenges={challenges}
            submissions={submissions}
            prayers={prayers}
            suggestions={suggestions}
            accessLogs={accessLogs}
            verse={verse}
            bannerImage={bannerImage}
            onAddNews={handleAddNews}
            onDeleteNews={handleDeleteNews}
            onAddEvent={handleAddEvent}
            onDeleteEvent={handleDeleteEvent}
            onAddChallenge={handleAddChallenge}
            onApproveSubmission={handleApproveSubmission}
            onRejectSubmission={handleRejectSubmission}
            onReplyPrayer={handleReplyPrayer}
            onReplySuggestion={handleReplySuggestion}
            onSendNotification={handleSendNotification}
            onUpdateSettings={handleUpdateSettings}
          />
        );
      default:
        return (
          <HomeView
            events={events}
            news={news}
            verse={verse}
            bannerImage={bannerImage}
            onNavigateTo={handleNavigateFromSearch}
            prayers={prayers}
          />
        );
    }
  };

  const getNavLinksByRole = () => {
    const base = [
      { id: "Home", label: "Início" },
      { id: "Sobre", label: "Sobre" },
      { id: "Agenda", label: "Agenda" },
      { id: "Notícias", label: "Notícias" }
    ];
    if (currentRole === UserRole.VISITOR) {
      return base;
    }
    return [
      ...base,
      { id: "Pedidos de Oração", label: "Pedidos de Oração" },
      { id: "Desafio Jovem", label: "Desafio Jovem" },
      { id: "Sugestões", label: "Sugestões" }
    ];
  };

  const navLinks = getNavLinksByRole();

  const unreadNotifications = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white text-[#1B1B1B] dark:bg-[#1B1B1B] dark:text-neutral-100 transition-colors duration-300 antialiased font-sans">
      {/* 1. Header/Navbar */}
      <header id="main-navigation" className="sticky top-0 z-40 w-full border-b border-neutral-100 bg-white/80 backdrop-blur-md dark:border-neutral-800 dark:bg-[#1B1B1B]/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <button onClick={() => setActiveView("Home")} className="flex items-center">
            <Logo showText={true} size="md" />
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isSelected = activeView === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setActiveView(link.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    isSelected
                      ? "bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-500"
                      : "text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
                  }`}
                >
                  {link.label}
                </button>
              );
            })}

            {/* Display Admin panel tab only if Leader or Admin roles are simulated */}
            {(currentRole === UserRole.ADMIN || currentRole === UserRole.LEADER) && (
              <button
                onClick={() => setActiveView("Admin")}
                className={`flex items-center gap-1 ml-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeView === "Admin"
                    ? "bg-red-600 text-white shadow-sm"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300"
                }`}
              >
                <ShieldAlert className="h-3.5 w-3.5" />
                <span>Painel Admin</span>
              </button>
            )}
          </nav>

          {/* Controls & Icons Column */}
          <div className="flex items-center gap-2">
            {/* Global Spotlight Search */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 rounded-xl text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800 transition-colors"
              title="Pesquisa Global"
            >
              <Search className="h-4.5 w-4.5" />
            </button>

            {/* Dark Mode toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800 transition-colors"
              title="Alternar Tema"
            >
              {darkMode ? <Sun className="h-4.5 w-4.5 text-yellow-500" /> : <Moon className="h-4.5 w-4.5" />}
            </button>

            {/* Notification Dropdown Container */}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="p-2 rounded-xl text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800 transition-colors relative"
                title="Notificações"
              >
                <Bell className="h-4.5 w-4.5" />
                {unreadNotifications > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-600 animate-pulse" />
                )}
              </button>

              <NotificationDropdown
                notifications={notifications}
                isOpen={isNotifOpen}
                onToggle={() => setIsNotifOpen(false)}
                onMarkAsRead={async (id) => {
                  try {
                    await api.markNotificationRead(id);
                    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
                  } catch (err) {
                    console.error("Erro ao marcar notificação como lida:", err);
                  }
                }}
                onMarkAllAsRead={async () => {
                  try {
                    await api.readAllNotifications();
                    setNotifications(notifications.map((n) => ({ ...n, read: true })));
                  } catch (err) {
                    console.error("Erro ao marcar notificações como lidas:", err);
                  }
                }}
                onClearAll={async () => {
                  try {
                    await api.deleteAllNotifications();
                    setNotifications([]);
                  } catch (err) {
                    console.error("Erro ao limpar notificações:", err);
                  }
                }}
                onNavigateTo={setActiveView}
              />
            </div>

            {/* Profile Avatar or Entrar Trigger */}
            {currentRole === UserRole.VISITOR ? (
              <button
                onClick={() => setActiveView("Login")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all bg-red-600 hover:bg-red-700 text-white shadow-sm flex items-center gap-1.5`}
                title="Entrar"
              >
                <User className="h-3.5 w-3.5" />
                <span>Entrar</span>
              </button>
            ) : (
              <button
                onClick={() => setActiveView("Perfil")}
                className={`h-8 w-8 rounded-full overflow-hidden border-2 transition-all ${
                  activeView === "Perfil" ? "border-red-600 scale-105" : "border-transparent"
                }`}
                title="Meu Perfil"
              >
                <div className="h-full w-full bg-red-600 text-white text-[11px] font-black flex items-center justify-center uppercase tracking-tighter">
                  {activeUser.name.slice(0, 2)}
                </div>
              </button>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800 lg:hidden transition-colors"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-neutral-100 bg-white/95 px-4 py-3 dark:border-neutral-800 dark:bg-[#1B1B1B]/95 space-y-1">
            {navLinks.map((link) => {
              const isSelected = activeView === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    setActiveView(link.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold ${
                    isSelected
                      ? "bg-red-50 text-red-600 dark:bg-red-950/20"
                      : "text-neutral-600 dark:text-neutral-400"
                  }`}
                >
                  {link.label}
                </button>
              );
            })}

            {(currentRole === UserRole.ADMIN || currentRole === UserRole.LEADER) && (
              <button
                onClick={() => {
                  setActiveView("Admin");
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-red-600 mt-2`}
              >
                Painel Administrativo HUIOS
              </button>
            )}
          </div>
        )}
      </header>

      {/* 2. Main Page Stage / Content Area */}
      <main id="applet-main-stage" className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 pt-8">
        {renderActiveView()}
      </main>

      {/* 3. High Fidelity Footer */}
      <Footer onNavigateTo={setActiveView} />

      {/* 4. Global Spotlight Search Modal overlay */}
      <GlobalSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        events={events}
        news={news}
        challenges={challenges}
        verse={verse}
        onNavigateTo={handleNavigateFromSearch}
      />
    </div>
  );
}

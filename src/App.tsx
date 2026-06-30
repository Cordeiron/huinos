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
import RoleSwitcher from "./components/RoleSwitcher";
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

  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    return (localStorage.getItem("huios_current_role") as UserRole) || UserRole.MEMBER;
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("huios_dark_mode") === "true";
  });

  const [events, setEvents] = useState<EventItem[]>(() => {
    const local = localStorage.getItem("huios_events");
    return local ? JSON.parse(local) : mockEvents;
  });

  const [news, setNews] = useState<NewsItem[]>(() => {
    const local = localStorage.getItem("huios_news");
    return local ? JSON.parse(local) : mockNews;
  });

  const [prayers, setPrayers] = useState<PrayerRequest[]>(() => {
    const local = localStorage.getItem("huios_prayers");
    return local ? JSON.parse(local) : mockPrayerRequests;
  });

  const [suggestions, setSuggestions] = useState<SuggestionItem[]>(() => {
    const local = localStorage.getItem("huios_suggestions");
    return local ? JSON.parse(local) : mockSuggestions;
  });

  const [challenges, setChallenges] = useState<Challenge[]>(() => {
    const local = localStorage.getItem("huios_challenges");
    return local ? JSON.parse(local) : mockChallenges;
  });

  const [submissions, setSubmissions] = useState<ChallengeSubmission[]>(() => {
    const local = localStorage.getItem("huios_submissions");
    return local ? JSON.parse(local) : mockSubmissions;
  });

  const [notifications, setNotifications] = useState<SystemNotification[]>(() => {
    const local = localStorage.getItem("huios_notifications");
    return local ? JSON.parse(local) : mockNotifications;
  });

  const [verse, setVerse] = useState<VerseOfTheWeek>(() => {
    const local = localStorage.getItem("huios_verse");
    return local ? JSON.parse(local) : initialVerse;
  });

  const [bannerImage, setBannerImage] = useState<string>(() => {
    return localStorage.getItem("huios_banner_image") || "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200";
  });

  const [accessLogs, setAccessLogs] = useState<AccessLog[]>(() => {
    const local = localStorage.getItem("huios_access_logs");
    return local ? JSON.parse(local) : mockAccessLogs;
  });

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
    localStorage.setItem("huios_current_role", currentRole);
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem("huios_dark_mode", String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("huios_events", JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem("huios_news", JSON.stringify(news));
  }, [news]);

  useEffect(() => {
    localStorage.setItem("huios_prayers", JSON.stringify(prayers));
  }, [prayers]);

  useEffect(() => {
    localStorage.setItem("huios_suggestions", JSON.stringify(suggestions));
  }, [suggestions]);

  useEffect(() => {
    localStorage.setItem("huios_challenges", JSON.stringify(challenges));
  }, [challenges]);

  useEffect(() => {
    localStorage.setItem("huios_submissions", JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem("huios_notifications", JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem("huios_verse", JSON.stringify(verse));
  }, [verse]);

  useEffect(() => {
    localStorage.setItem("huios_banner_image", bannerImage);
  }, [bannerImage]);

  useEffect(() => {
    localStorage.setItem("huios_access_logs", JSON.stringify(accessLogs));
  }, [accessLogs]);

  // Bind active profile dynamically to chosen role for a premium simulated multi-user feel
  const getActiveUser = (): UserProfile => {
    if (currentRole === UserRole.ADMIN) {
      return mockUsers[0]; // Gabriel (Admin)
    } else if (currentRole === UserRole.LEADER) {
      return mockUsers[1]; // Beatriz (Leader)
    } else if (currentRole === UserRole.MEMBER) {
      return mockUsers[2]; // Lucas (Member)
    } else {
      // Guest Visitor
      return {
        id: "visitor-guest",
        name: "Visitante Convidado",
        email: "convidado@huios.com",
        phone: "(11) 90000-0000",
        birthDate: "2006-01-01",
        cellGroup: "Sem célula vinculada",
        role: UserRole.VISITOR,
        avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200",
        points: 0,
        medals: { gold: 0, silver: 0, bronze: 0 },
        achievements: []
      };
    }
  };

  const activeUser = getActiveUser();

  // Log user action helper
  const logAction = (action: string) => {
    const newLog: AccessLog = {
      id: `log-${Date.now()}`,
      userName: activeUser.name,
      email: activeUser.email,
      role: activeUser.role,
      action,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 16)
    };
    setAccessLogs([newLog, ...accessLogs].slice(0, 50));
  };

  // --- Handlers for User Interactions ---

  const handleLikeNews = (newsId: string) => {
    setNews(
      news.map((n) => {
        if (n.id === newsId) {
          const alreadyLiked = n.likedBy.includes(activeUser.id);
          const updatedLikedBy = alreadyLiked
            ? n.likedBy.filter((uid) => uid !== activeUser.id)
            : [...n.likedBy, activeUser.id];
          return {
            ...n,
            likes: alreadyLiked ? n.likes - 1 : n.likes + 1,
            likedBy: updatedLikedBy
          };
        }
        return n;
      })
    );
    logAction(`Curtiu a notícia ${newsId}`);
  };

  const handleCommentNews = (newsId: string, commentText: string) => {
    const newComment = {
      id: `comment-${Date.now()}`,
      userName: activeUser.name,
      userAvatar: activeUser.avatarUrl,
      content: commentText,
      date: new Date().toLocaleDateString("pt-BR")
    };

    setNews(
      news.map((n) => {
        if (n.id === newsId) {
          return {
            ...n,
            comments: [...n.comments, newComment]
          };
        }
        return n;
      })
    );
    logAction(`Comentou na notícia ${newsId}`);
  };

  const handlePrayAlong = (prayerId: string) => {
    setPrayers(
      prayers.map((p) => {
        if (p.id === prayerId) {
          const alreadyPrayed = p.prayedBy.includes(activeUser.id);
          const updatedPrayedBy = alreadyPrayed
            ? p.prayedBy.filter((uid) => uid !== activeUser.id)
            : [...p.prayedBy, activeUser.id];
          return {
            ...p,
            prayedCount: alreadyPrayed ? p.prayedCount - 1 : p.prayedCount + 1,
            prayedBy: updatedPrayedBy
          };
        }
        return p;
      })
    );
    logAction(`Uniu-se em oração no clamor ${prayerId}`);
  };

  const handleSubmitPrayer = (name: string, requestText: string, isAnonymous: boolean) => {
    const newPrayer: PrayerRequest = {
      id: `prayer-${Date.now()}`,
      name: isAnonymous ? "Anônimo" : name,
      request: requestText,
      isAnonymous,
      date: new Date().toLocaleDateString("pt-BR"),
      status: "Novo",
      prayedCount: 0,
      prayedBy: []
    };
    setPrayers([newPrayer, ...prayers]);
    logAction("Enviou um pedido de oração");
  };

  const handleSubmitSuggestion = (name: string, category: string, suggestionText: string) => {
    const newSug: SuggestionItem = {
      id: `sug-${Date.now()}`,
      name,
      email: activeUser.email,
      suggestion: suggestionText,
      category: category as any,
      date: new Date().toLocaleDateString("pt-BR"),
      status: "Pendente"
    };
    setSuggestions([newSug, ...suggestions]);
    logAction(`Sugeriu uma ideia na categoria ${category}`);
  };

  const handleCompleteChallenge = (challengeId: string, text: string, fileUrl: string, mediaType: "text" | "image" | "video") => {
    const currentChal = challenges.find((c) => c.id === challengeId);
    if (!currentChal) return;

    const newSub: ChallengeSubmission = {
      id: `sub-${Date.now()}`,
      challengeId,
      challengeTitle: currentChal.title,
      userId: activeUser.id,
      userName: activeUser.name,
      userAvatar: activeUser.avatarUrl,
      date: new Date().toLocaleDateString("pt-BR"),
      text,
      fileUrl,
      mediaType,
      status: "Pendente"
    };

    setSubmissions([newSub, ...submissions]);
    logAction(`Submeteu comprovação para o desafio ${challengeId}`);
  };

  const handleUpdateProfile = (name: string, phone: string, email: string, cellGroup: string, birthDate: string) => {
    // In a real database we would persist this user.
    // For local mockup we can simply alert and log
    logAction(`Atualizou perfil: ${name}`);
  };

  // --- Administrative Handlers ---

  const handleAddNews = (title: string, subtitle: string, content: string, category: any, author: string, coverImage: string) => {
    const newArt: NewsItem = {
      id: `news-${Date.now()}`,
      title,
      subtitle,
      content,
      coverImage,
      author,
      authorRole: "Coordenação HUIOS",
      date: new Date().toLocaleDateString("pt-BR"),
      likes: 0,
      likedBy: [],
      comments: [],
      category
    };
    setNews([newArt, ...news]);
    logAction(`Cadastrou notícia: ${title}`);
  };

  const handleDeleteNews = (id: string) => {
    setNews(news.filter((n) => n.id !== id));
    logAction(`Excluiu notícia ${id}`);
  };

  const handleAddEvent = (title: string, description: string, date: string, time: string, address: string, category: any, responsible: string, mapEmbedUrl?: string, imageUrl?: string) => {
    const newEvt: EventItem = {
      id: `event-${Date.now()}`,
      title,
      description,
      date,
      time,
      address,
      mapEmbedUrl,
      responsible,
      category,
      imageUrl: imageUrl || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800"
    };
    setEvents([newEvt, ...events]);
    logAction(`Criou evento: ${title}`);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter((e) => e.id !== id));
    logAction(`Excluiu evento ${id}`);
  };

  const handleAddChallenge = (title: string, description: string, startDate: string, endDate: string, prize: string, maxWinners: number, points: number, imageUrl: string) => {
    const newChal: Challenge = {
      id: `chal-${Date.now()}`,
      title,
      description,
      imageUrl,
      startDate,
      endDate,
      prize,
      maxWinners,
      points,
      active: true
    };
    setChallenges([newChal, ...challenges]);
    logAction(`Criou desafio: ${title}`);
  };

  const handleApproveSubmission = (subId: string, feedback: string) => {
    setSubmissions(
      submissions.map((sub) => {
        if (sub.id === subId) {
          return { ...sub, status: "Aprovado", feedback };
        }
        return sub;
      })
    );
    logAction(`Aprovou envio ${subId}`);
  };

  const handleRejectSubmission = (subId: string, feedback: string) => {
    setSubmissions(
      submissions.map((sub) => {
        if (sub.id === subId) {
          return { ...sub, status: "Reprovado", feedback };
        }
        return sub;
      })
    );
    logAction(`Reprovou envio ${subId}`);
  };

  const handleReplyPrayer = (prayerId: string, adminResponse: string, status: any) => {
    setPrayers(
      prayers.map((p) => {
        if (p.id === prayerId) {
          return { ...p, adminResponse, status };
        }
        return p;
      })
    );
    logAction(`Moderou pedido de oração ${prayerId}: status ${status}`);
  };

  const handleReplySuggestion = (sugId: string, adminResponse: string, status: any) => {
    setSuggestions(
      suggestions.map((s) => {
        if (s.id === sugId) {
          return { ...s, adminResponse, status };
        }
        return s;
      })
    );
    logAction(`Moderou sugestão ${sugId}: status ${status}`);
  };

  const handleSendNotification = (title: string, message: string, type: any) => {
    const newNotif: SystemNotification = {
      id: `not-${Date.now()}`,
      title,
      message,
      date: new Date().toLocaleDateString("pt-BR"),
      type,
      read: false
    };
    setNotifications([newNotif, ...notifications]);
    logAction(`Disparou notificação geral: ${title}`);
  };

  const handleUpdateSettings = (verseText: string, verseRef: string, bannerUrl: string) => {
    setVerse({
      text: verseText,
      reference: verseRef,
      translation: "Almeida Revista e Corrigida"
    });
    setBannerImage(bannerUrl);
    logAction("Atualizou configurações visuais do portal");
  };

  // Global Navigation callback from subcomponents
  const handleNavigateFromSearch = (view: string, itemId?: string) => {
    setActiveView(view);
    if (view === "Notícias" && itemId) {
      setSelectedNewsIdFromSearch(itemId);
    }
  };

  // --- Render Active View Core Switcher ---
  const renderActiveView = () => {
    switch (activeView) {
      case "Sobre":
        return <AboutView />;
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
            rankingUsers={mockUsers}
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
          />
        );
      case "Admin":
        return (
          <AdminDashboard
            stats={{
              membersCount: 124,
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
          />
        );
    }
  };

  const navLinks = [
    { id: "Home", label: "Início" },
    { id: "Sobre", label: "Sobre" },
    { id: "Agenda", label: "Agenda" },
    { id: "Notícias", label: "Notícias" },
    { id: "Pedidos de Oração", label: "Pedidos de Oração" },
    { id: "Desafio Jovem", label: "Desafio Jovem" },
    { id: "Sugestões", label: "Sugestões" }
  ];

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
                onMarkAsRead={(id) => {
                  setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
                }}
                onMarkAllAsRead={() => {
                  setNotifications(notifications.map((n) => ({ ...n, read: true })));
                }}
                onClearAll={() => setNotifications([])}
                onNavigateTo={setActiveView}
              />
            </div>

            {/* Profile Avatar Trigger */}
            {currentRole !== UserRole.VISITOR && (
              <button
                onClick={() => setActiveView("Perfil")}
                className={`h-8 w-8 rounded-full overflow-hidden border-2 transition-all ${
                  activeView === "Perfil" ? "border-red-600 scale-105" : "border-transparent"
                }`}
              >
                <img src={activeUser.avatarUrl} alt="Perfil" className="h-full w-full object-cover" />
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

      {/* 5. Floating Glassmorphic Role Simulator Switcher */}
      <RoleSwitcher
        currentRole={currentRole}
        onChangeRole={(role) => {
          setCurrentRole(role);
          logAction(`Simulou papel de permissão: ${role}`);
        }}
        activeUserName={activeUser.name}
      />
    </div>
  );
}

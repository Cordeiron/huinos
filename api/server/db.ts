import { supabase } from "./supabase";
import {
  UserProfile,
  UserRole,
  EventItem,
  NewsItem,
  Announcement,
  PrayerRequest,
  SuggestionItem,
  Challenge,
  ChallengeSubmission,
  SystemNotification,
  AccessLog
} from "../../src/types";

// ====================================================================
// MAPPING HELPER FUNCTIONS
// ====================================================================

export const mapUserFromDb = (dbUser: any): any => {
  if (!dbUser) return null;
  return {
    id: dbUser.id,
    name: dbUser.name,
    email: dbUser.email,
    passwordHash: dbUser.password_hash,
    phone: dbUser.phone || "",
    birthDate: dbUser.birth_date || "",
    cellGroup: dbUser.cell_group || "",
    role: dbUser.role as UserRole,
    avatarUrl: dbUser.avatar_url || "",
    points: dbUser.points || 0,
    medals: dbUser.medals || { gold: 0, silver: 0, bronze: 0 },
    achievements: dbUser.achievements || [],
    createdBy: dbUser.created_by,
    createdAt: dbUser.created_at
  };
};

export const mapUserToDb = (user: any): any => {
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    password_hash: user.passwordHash,
    phone: user.phone || "",
    birth_date: user.birthDate || "",
    cell_group: user.cellGroup || "",
    role: user.role,
    avatar_url: user.avatarUrl || "",
    points: user.points || 0,
    medals: user.medals || { gold: 0, silver: 0, bronze: 0 },
    achievements: user.achievements || [],
    created_by: user.createdBy,
    created_at: user.createdAt
  };
};

export const mapAnnFromDb = (dbAnn: any): any => {
  if (!dbAnn) return null;
  return {
    id: dbAnn.id,
    title: dbAnn.title,
    content: dbAnn.content,
    category: dbAnn.category,
    important: !!dbAnn.important,
    date: dbAnn.date,
    createdBy: dbAnn.created_by
  };
};

export const mapAnnToDb = (ann: any): any => {
  if (!ann) return null;
  return {
    id: ann.id,
    title: ann.title,
    content: ann.content,
    category: ann.category,
    important: !!ann.important,
    date: ann.date,
    created_by: ann.createdBy
  };
};

export const mapNewsFromDb = (dbNews: any): any => {
  if (!dbNews) return null;
  return {
    id: dbNews.id,
    title: dbNews.title,
    subtitle: dbNews.subtitle || "",
    content: dbNews.content,
    coverImage: dbNews.cover_image || "",
    category: dbNews.category,
    author: dbNews.author,
    authorRole: dbNews.author_role || "",
    date: dbNews.date,
    likes: dbNews.likes || 0,
    likedBy: dbNews.liked_by || [],
    comments: dbNews.comments || []
  };
};

export const mapNewsToDb = (n: any): any => {
  if (!n) return null;
  return {
    id: n.id,
    title: n.title,
    subtitle: n.subtitle || "",
    content: n.content,
    cover_image: n.coverImage || "",
    category: n.category,
    author: n.author,
    author_role: n.authorRole || "",
    date: n.date,
    likes: n.likes || 0,
    liked_by: n.likedBy || [],
    comments: n.comments || []
  };
};

export const mapEventFromDb = (dbEvent: any): any => {
  if (!dbEvent) return null;
  return {
    id: dbEvent.id,
    title: dbEvent.title,
    description: dbEvent.description,
    date: dbEvent.date,
    time: dbEvent.time,
    address: dbEvent.address,
    mapEmbedUrl: dbEvent.map_embed_url || "",
    responsible: dbEvent.responsible,
    category: dbEvent.category,
    imageUrl: dbEvent.image_url || ""
  };
};

export const mapEventToDb = (e: any): any => {
  if (!e) return null;
  return {
    id: e.id,
    title: e.title,
    description: e.description,
    date: e.date,
    time: e.time,
    address: e.address,
    map_embed_url: e.mapEmbedUrl || "",
    responsible: e.responsible,
    category: e.category,
    image_url: e.imageUrl || ""
  };
};

export const mapPrayerFromDb = (dbPrayer: any): any => {
  if (!dbPrayer) return null;
  return {
    id: dbPrayer.id,
    name: dbPrayer.name || "",
    request: dbPrayer.request,
    isAnonymous: !!dbPrayer.is_anonymous,
    date: dbPrayer.date,
    status: dbPrayer.status,
    adminResponse: dbPrayer.admin_response || "",
    prayedCount: dbPrayer.prayed_count || 0,
    prayedBy: dbPrayer.prayed_by || []
  };
};

export const mapPrayerToDb = (p: any): any => {
  if (!p) return null;
  return {
    id: p.id,
    name: p.name || "",
    request: p.request,
    is_anonymous: !!p.isAnonymous,
    date: p.date,
    status: p.status,
    admin_response: p.adminResponse || "",
    prayed_count: p.prayedCount || 0,
    prayed_by: p.prayedBy || []
  };
};

export const mapSuggestionFromDb = (dbSug: any): any => {
  if (!dbSug) return null;
  return {
    id: dbSug.id,
    name: dbSug.name,
    email: dbSug.email || "",
    suggestion: dbSug.suggestion,
    category: dbSug.category,
    date: dbSug.date,
    status: dbSug.status,
    adminResponse: dbSug.admin_response || ""
  };
};

export const mapSuggestionToDb = (s: any): any => {
  if (!s) return null;
  return {
    id: s.id,
    name: s.name,
    email: s.email || "",
    suggestion: s.suggestion,
    category: s.category,
    date: s.date,
    status: s.status,
    admin_response: s.adminResponse || ""
  };
};

export const mapChallengeFromDb = (dbChal: any): any => {
  if (!dbChal) return null;
  return {
    id: dbChal.id,
    title: dbChal.title,
    description: dbChal.description,
    imageUrl: dbChal.image_url || "",
    startDate: dbChal.start_date,
    endDate: dbChal.end_date,
    prize: dbChal.prize || "Nenhum",
    maxWinners: dbChal.max_winners || 5,
    points: dbChal.points || 0,
    active: !!dbChal.active
  };
};

export const mapChallengeToDb = (c: any): any => {
  if (!c) return null;
  return {
    id: c.id,
    title: c.title,
    description: c.description,
    image_url: c.imageUrl || "",
    start_date: c.startDate,
    end_date: c.endDate,
    prize: c.prize || "Nenhum",
    max_winners: c.maxWinners || 5,
    points: c.points || 0,
    active: !!c.active
  };
};

export const mapSubmissionFromDb = (dbSub: any): any => {
  if (!dbSub) return null;
  return {
    id: dbSub.id,
    challengeId: dbSub.challenge_id,
    challengeTitle: dbSub.challenge_title,
    userId: dbSub.user_id,
    userName: dbSub.user_name,
    userAvatar: dbSub.user_avatar || "",
    date: dbSub.date,
    text: dbSub.text || "",
    fileUrl: dbSub.file_url || "",
    mediaType: dbSub.media_type || "text",
    status: dbSub.status,
    feedback: dbSub.feedback || ""
  };
};

export const mapSubmissionToDb = (s: any): any => {
  if (!s) return null;
  return {
    id: s.id,
    challenge_id: s.challengeId,
    challenge_title: s.challengeTitle,
    user_id: s.userId,
    user_name: s.userName,
    user_avatar: s.userAvatar || "",
    date: s.date,
    text: s.text || "",
    file_url: s.fileUrl || "",
    media_type: s.mediaType || "text",
    status: s.status,
    feedback: s.feedback || ""
  };
};

export const mapNotificationFromDb = (dbNotif: any): any => {
  if (!dbNotif) return null;
  return {
    id: dbNotif.id,
    title: dbNotif.title,
    message: dbNotif.message,
    date: dbNotif.date,
    type: dbNotif.type,
    read: !!dbNotif.read,
    targetRole: dbNotif.target_role
  };
};

export const mapNotificationToDb = (n: any): any => {
  if (!n) return null;
  return {
    id: n.id,
    title: n.title,
    message: n.message,
    date: n.date,
    type: n.type,
    read: !!n.read,
    target_role: n.targetRole
  };
};

export const mapLogFromDb = (dbLog: any): any => {
  if (!dbLog) return null;
  return {
    id: dbLog.id,
    userName: dbLog.user_name,
    email: dbLog.email,
    role: dbLog.role,
    action: dbLog.action,
    timestamp: dbLog.timestamp
  };
};

export const mapLogToDb = (l: any): any => {
  if (!l) return null;
  return {
    id: l.id,
    user_name: l.userName,
    email: l.email,
    role: l.role,
    action: l.action,
    timestamp: l.timestamp
  };
};

// ====================================================================
// SUPABASE OPERATIONS INTERFACE
// ====================================================================

export const db = {
  // --- USERS ---
  async getUsers(): Promise<any[]> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.error("Erro ao buscar usuários do Supabase:", error);
      return [];
    }
    return (data || []).map(mapUserFromDb);
  },

  async getUserById(id: string): Promise<any | null> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error(`Erro ao buscar usuário por ID (${id}):`, error);
      return null;
    }
    return mapUserFromDb(data);
  },

  async getUserByEmail(email: string): Promise<any | null> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email.toLowerCase())
      .maybeSingle();

    if (error) {
      console.error(`Erro ao buscar usuário por email (${email}):`, error);
      return null;
    }
    return mapUserFromDb(data);
  },

  async createUser(user: any): Promise<any> {
    const dbPayload = mapUserToDb(user);
    const { data, error } = await supabase
      .from("users")
      .insert([dbPayload])
      .select()
      .single();

    if (error) {
      console.error("Erro ao criar usuário no Supabase:", error);
      throw new Error(error.message);
    }
    return mapUserFromDb(data);
  },

  async updateUser(id: string, updates: any): Promise<any> {
    // Read the current user first to merge properties properly
    const currentUser = await this.getUserById(id);
    if (!currentUser) throw new Error("Usuário não encontrado.");

    const merged = { ...currentUser, ...updates };
    const dbPayload = mapUserToDb(merged);

    const { data, error } = await supabase
      .from("users")
      .update(dbPayload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(`Erro ao atualizar usuário (${id}) no Supabase:`, error);
      throw new Error(error.message);
    }
    return mapUserFromDb(data);
  },

  async deleteUser(id: string): Promise<boolean> {
    const { error } = await supabase
      .from("users")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(`Erro ao deletar usuário (${id}) no Supabase:`, error);
      throw new Error(error.message);
    }
    return true;
  },

  // --- ANNOUNCEMENTS ---
  async getAnnouncements(): Promise<any[]> {
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      console.error("Erro ao buscar comunicados do Supabase:", error);
      return [];
    }
    return (data || []).map(mapAnnFromDb);
  },

  async createAnnouncement(ann: any): Promise<any> {
    const dbPayload = mapAnnToDb(ann);
    const { data, error } = await supabase
      .from("announcements")
      .insert([dbPayload])
      .select()
      .single();

    if (error) {
      console.error("Erro ao criar comunicado no Supabase:", error);
      throw new Error(error.message);
    }
    return mapAnnFromDb(data);
  },

  async deleteAnnouncement(id: string): Promise<boolean> {
    const { error } = await supabase
      .from("announcements")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(`Erro ao deletar comunicado (${id}) no Supabase:`, error);
      throw new Error(error.message);
    }
    return true;
  },

  // --- NEWS ---
  async getNews(): Promise<any[]> {
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      console.error("Erro ao buscar notícias do Supabase:", error);
      return [];
    }
    return (data || []).map(mapNewsFromDb);
  },

  async getNewsById(id: string): Promise<any | null> {
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error(`Erro ao buscar notícia (${id}) do Supabase:`, error);
      return null;
    }
    return mapNewsFromDb(data);
  },

  async createNews(newsItem: any): Promise<any> {
    const dbPayload = mapNewsToDb(newsItem);
    const { data, error } = await supabase
      .from("news")
      .insert([dbPayload])
      .select()
      .single();

    if (error) {
      console.error("Erro ao criar notícia no Supabase:", error);
      throw new Error(error.message);
    }
    return mapNewsFromDb(data);
  },

  async updateNews(id: string, updates: any): Promise<any> {
    const current = await this.getNewsById(id);
    if (!current) throw new Error("Notícia não encontrada.");

    const merged = { ...current, ...updates };
    const dbPayload = mapNewsToDb(merged);

    const { data, error } = await supabase
      .from("news")
      .update(dbPayload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(`Erro ao atualizar notícia (${id}) no Supabase:`, error);
      throw new Error(error.message);
    }
    return mapNewsFromDb(data);
  },

  async deleteNews(id: string): Promise<boolean> {
    const { error } = await supabase
      .from("news")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(`Erro ao deletar notícia (${id}) no Supabase:`, error);
      throw new Error(error.message);
    }
    return true;
  },

  // --- EVENTS ---
  async getEvents(): Promise<any[]> {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("date", { ascending: true });

    if (error) {
      console.error("Erro ao buscar eventos do Supabase:", error);
      return [];
    }
    return (data || []).map(mapEventFromDb);
  },

  async createEvent(eventItem: any): Promise<any> {
    const dbPayload = mapEventToDb(eventItem);
    const { data, error } = await supabase
      .from("events")
      .insert([dbPayload])
      .select()
      .single();

    if (error) {
      console.error("Erro ao criar evento no Supabase:", error);
      throw new Error(error.message);
    }
    return mapEventFromDb(data);
  },

  async deleteEvent(id: string): Promise<boolean> {
    const { error } = await supabase
      .from("events")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(`Erro ao deletar evento (${id}) no Supabase:`, error);
      throw new Error(error.message);
    }
    return true;
  },

  // --- PRAYER REQUESTS ---
  async getPrayers(): Promise<any[]> {
    const { data, error } = await supabase
      .from("prayer_requests")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      console.error("Erro ao buscar orações do Supabase:", error);
      return [];
    }
    return (data || []).map(mapPrayerFromDb);
  },

  async getPrayerById(id: string): Promise<any | null> {
    const { data, error } = await supabase
      .from("prayer_requests")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error(`Erro ao buscar pedido de oração (${id}):`, error);
      return null;
    }
    return mapPrayerFromDb(data);
  },

  async createPrayer(prayer: any): Promise<any> {
    const dbPayload = mapPrayerToDb(prayer);
    const { data, error } = await supabase
      .from("prayer_requests")
      .insert([dbPayload])
      .select()
      .single();

    if (error) {
      console.error("Erro ao criar oração no Supabase:", error);
      throw new Error(error.message);
    }
    return mapPrayerFromDb(data);
  },

  async updatePrayer(id: string, updates: any): Promise<any> {
    const current = await this.getPrayerById(id);
    if (!current) throw new Error("Pedido de oração não encontrado.");

    const merged = { ...current, ...updates };
    const dbPayload = mapPrayerToDb(merged);

    const { data, error } = await supabase
      .from("prayer_requests")
      .update(dbPayload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(`Erro ao atualizar pedido de oração (${id}) no Supabase:`, error);
      throw new Error(error.message);
    }
    return mapPrayerFromDb(data);
  },

  // --- SUGGESTIONS ---
  async getSuggestions(): Promise<any[]> {
    const { data, error } = await supabase
      .from("suggestions")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      console.error("Erro ao buscar sugestões do Supabase:", error);
      return [];
    }
    return (data || []).map(mapSuggestionFromDb);
  },

  async getSuggestionById(id: string): Promise<any | null> {
    const { data, error } = await supabase
      .from("suggestions")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error(`Erro ao buscar sugestão (${id}):`, error);
      return null;
    }
    return mapSuggestionFromDb(data);
  },

  async createSuggestion(suggestion: any): Promise<any> {
    const dbPayload = mapSuggestionToDb(suggestion);
    const { data, error } = await supabase
      .from("suggestions")
      .insert([dbPayload])
      .select()
      .single();

    if (error) {
      console.error("Erro ao criar sugestão no Supabase:", error);
      throw new Error(error.message);
    }
    return mapSuggestionFromDb(data);
  },

  async updateSuggestion(id: string, updates: any): Promise<any> {
    const current = await this.getSuggestionById(id);
    if (!current) throw new Error("Sugestão não encontrada.");

    const merged = { ...current, ...updates };
    const dbPayload = mapSuggestionToDb(merged);

    const { data, error } = await supabase
      .from("suggestions")
      .update(dbPayload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(`Erro ao atualizar sugestão (${id}) no Supabase:`, error);
      throw new Error(error.message);
    }
    return mapSuggestionFromDb(data);
  },

  // --- CHALLENGES ---
  async getChallenges(): Promise<any[]> {
    const { data, error } = await supabase
      .from("challenges")
      .select("*")
      .order("start_date", { ascending: false });

    if (error) {
      console.error("Erro ao buscar desafios do Supabase:", error);
      return [];
    }
    return (data || []).map(mapChallengeFromDb);
  },

  async getChallengeById(id: string): Promise<any | null> {
    const { data, error } = await supabase
      .from("challenges")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error(`Erro ao buscar desafio (${id}):`, error);
      return null;
    }
    return mapChallengeFromDb(data);
  },

  async createChallenge(challenge: any): Promise<any> {
    const dbPayload = mapChallengeToDb(challenge);
    const { data, error } = await supabase
      .from("challenges")
      .insert([dbPayload])
      .select()
      .single();

    if (error) {
      console.error("Erro ao criar desafio no Supabase:", error);
      throw new Error(error.message);
    }
    return mapChallengeFromDb(data);
  },

  // --- CHALLENGE SUBMISSIONS ---
  async getSubmissions(): Promise<any[]> {
    const { data, error } = await supabase
      .from("submissions")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      console.error("Erro ao buscar envios do Supabase:", error);
      return [];
    }
    return (data || []).map(mapSubmissionFromDb);
  },

  async getSubmissionById(id: string): Promise<any | null> {
    const { data, error } = await supabase
      .from("submissions")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error(`Erro ao buscar envio (${id}):`, error);
      return null;
    }
    return mapSubmissionFromDb(data);
  },

  async createSubmission(sub: any): Promise<any> {
    const dbPayload = mapSubmissionToDb(sub);
    const { data, error } = await supabase
      .from("submissions")
      .insert([dbPayload])
      .select()
      .single();

    if (error) {
      console.error("Erro ao criar comprovação no Supabase:", error);
      throw new Error(error.message);
    }
    return mapSubmissionFromDb(data);
  },

  async updateSubmission(id: string, updates: any): Promise<any> {
    const current = await this.getSubmissionById(id);
    if (!current) throw new Error("Submissão não encontrada.");

    const merged = { ...current, ...updates };
    const dbPayload = mapSubmissionToDb(merged);

    const { data, error } = await supabase
      .from("submissions")
      .update(dbPayload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(`Erro ao atualizar submissão (${id}) no Supabase:`, error);
      throw new Error(error.message);
    }
    return mapSubmissionFromDb(data);
  },

  // --- NOTIFICATIONS ---
  async getNotifications(): Promise<any[]> {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      console.error("Erro ao buscar notificações do Supabase:", error);
      return [];
    }
    return (data || []).map(mapNotificationFromDb);
  },

  async createNotification(notif: any): Promise<any> {
    const dbPayload = mapNotificationToDb(notif);
    const { data, error } = await supabase
      .from("notifications")
      .insert([dbPayload])
      .select()
      .single();

    if (error) {
      console.error("Erro ao criar notificação no Supabase:", error);
      throw new Error(error.message);
    }
    return mapNotificationFromDb(data);
  },

  async markAllNotificationsRead(): Promise<boolean> {
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("read", false);

    if (error) {
      console.error("Erro ao marcar notificações como lidas no Supabase:", error);
      return false;
    }
    return true;
  },

  // --- ACCESS LOGS ---
  async getLogs(): Promise<any[]> {
    const { data, error } = await supabase
      .from("access_logs")
      .select("*")
      .order("timestamp", { ascending: false });

    if (error) {
      console.error("Erro ao buscar logs do Supabase:", error);
      return [];
    }
    return (data || []).map(mapLogFromDb);
  },

  async logAction(userName: string, email: string, role: string, action: string): Promise<any> {
    const dbPayload = mapLogToDb({
      id: "log-" + Math.random().toString(36).substr(2, 9),
      userName,
      email,
      role,
      action,
      timestamp: new Date().toLocaleString("pt-BR")
    });

    const { data, error } = await supabase
      .from("access_logs")
      .insert([dbPayload])
      .select()
      .single();

    if (error) {
      console.error("Erro ao registrar log de ação no Supabase:", error);
    }
    return mapLogFromDb(data);
  }
};

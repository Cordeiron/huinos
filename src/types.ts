/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum UserRole {
  VISITOR = "VISITOR",
  MEMBER = "MEMBER",
  LEADER = "LEADER",
  ADMIN = "ADMIN"
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  cellGroup: string;
  role: UserRole;
  avatarUrl: string;
  points: number;
  medals: {
    gold: number;
    silver: number;
    bronze: number;
  };
  achievements: {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlockedAt: string;
  }[];
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  address: string;
  mapEmbedUrl?: string;
  responsible: string;
  category: "Célula" | "Culto" | "Acampamento" | "Conferência" | "Reunião" | "Outro";
  imageUrl?: string;
}

export interface NewsComment {
  id: string;
  userName: string;
  userAvatar?: string;
  content: string;
  date: string;
}

export interface NewsItem {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  coverImage: string;
  author: string;
  authorRole: string;
  date: string;
  likes: number;
  likedBy: string[]; // List of user IDs who liked
  comments: NewsComment[];
  category: "Geral" | "Avisos" | "Acampamento" | "Espiritual" | "Eventos";
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  category: "Mudança de Horário" | "Acampamento" | "Jejum" | "Conferência" | "Escalas" | "Reunião";
  important: boolean;
  createdBy: string;
}

export interface PrayerRequest {
  id: string;
  name?: string;
  request: string;
  isAnonymous: boolean;
  date: string;
  status: "Novo" | "Em oração" | "Respondido";
  adminResponse?: string;
  prayedCount: number; // counter of people praying along
  prayedBy: string[]; // list of user IDs who prayed along
}

export interface SuggestionItem {
  id: string;
  name: string;
  email?: string;
  suggestion: string;
  category: "Célula" | "Culto" | "Estrutura" | "Eventos" | "Música" | "Social" | "Outro";
  date: string;
  status: "Pendente" | "Aceita" | "Recusada";
  adminResponse?: string;
}

export interface ChallengeSubmission {
  id: string;
  challengeId: string;
  challengeTitle: string;
  userId: string;
  userName: string;
  userAvatar: string;
  date: string;
  text?: string;
  fileUrl?: string; // photo/video simulation
  mediaType?: "image" | "video" | "document" | "text";
  status: "Pendente" | "Pendente de Aprovação" | "Aprovado" | "Reprovado" | "Rejeitado";
  feedback?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  startDate: string;
  endDate: string;
  prize: string;
  maxWinners: number;
  points: number;
  active: boolean;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  type: "desafio" | "noticia" | "evento" | "oracao" | "aviso";
  read: boolean;
  targetRole?: UserRole;
}

export interface VerseOfTheWeek {
  reference: string;
  text: string;
  translation: string;
}

export interface AccessLog {
  id: string;
  userName: string;
  email: string;
  role: string;
  action: string;
  timestamp: string;
}

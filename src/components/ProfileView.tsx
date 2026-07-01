/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { User, Phone, Mail, Calendar, Home, Award, Sparkles, Shield, Compass, BookOpen, Users, CheckCircle, Music, Briefcase, Heart, Target, Flame } from "lucide-react";
import { UserProfile } from "../types";

interface ProfileViewProps {
  activeUser: UserProfile;
  onUpdateProfile: (name: string, phone: string, email: string, cellGroup: string, birthDate: string) => void;
  onLogout: () => void;
}

export default function ProfileView({ activeUser, onUpdateProfile, onLogout }: ProfileViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(activeUser.name);
  const [phone, setPhone] = useState(activeUser.phone);
  const [email, setEmail] = useState(activeUser.email);
  const [cellGroup, setCellGroup] = useState(activeUser.cellGroup);
  const [birthDate, setBirthDate] = useState(activeUser.birthDate);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(name, phone, email, cellGroup, birthDate);
    setIsEditing(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 4000);
  };

  const insigniaCategories = [
    {
      category: "🤝 PARTICIPAÇÃO E CONVITES",
      icon: Users,
      items: [
        { id: "ins-1", title: "Pescador de Amigos", description: "Levou 1 amigo ao grupo." },
        { id: "ins-2", title: "Rede Cheia", description: "Levou 5 amigos diferentes." },
        { id: "ins-3", title: "Influenciador", description: "Levou 10 amigos diferentes." },
        { id: "ins-4", title: "Anfitrião", description: "Recebeu e acompanhou um visitante." }
      ]
    },
    {
      category: "🎵 MINISTÉRIO DE LOUVOR",
      icon: Music,
      items: [
        { id: "ins-5", title: "Louvor em Ação", description: "Participou de 5 ministrações." },
        { id: "ins-6", title: "Músico Fiel", description: "Participou de 20 ministrações." },
        { id: "ins-7", title: "Adorador", description: "6 meses ativos no louvor." }
      ]
    },
    {
      category: "🛠️ SERVIÇO",
      icon: Briefcase,
      items: [
        { id: "ins-8", title: "Mãos que Servem", description: "Ajudou em 3 eventos." },
        { id: "ins-9", title: "Servo Dedicado", description: "Ajudou em 10 eventos." },
        { id: "ins-10", title: "Bastidores do Reino", description: "Trabalhou em montagem, recepção ou limpeza." }
      ]
    },
    {
      category: "📖 BÍBLIA",
      icon: BookOpen,
      items: [
        { id: "ins-11", title: "Conhecedor da Palavra", description: "Participou de 10 estudos bíblicos." }
      ]
    },
    {
      category: "🙏 ORAÇÃO",
      icon: Flame,
      items: [
        { id: "ins-12", title: "Intercessor", description: "Participou de 3 reuniões de oração." },
        { id: "ins-13", title: "Sentinela", description: "Participou de uma vigília." },
        { id: "ins-14", title: "Guerreiro de Oração", description: "Participou de 10 reuniões de oração." }
      ]
    },
    {
      category: "❤️ COMUNHÃO",
      icon: Heart,
      items: [
        { id: "ins-15", title: "Presença Fiel", description: "1 mês sem faltas." },
        { id: "ins-16", title: "Comprometido", description: "3 meses sem faltas." },
        { id: "ins-17", title: "Exemplo de Fidelidade", description: "6 meses sem faltas." }
      ]
    },
    {
      category: "🎯 DESAFIOS ESPECIAIS",
      icon: Target,
      items: [
        { id: "ins-18", title: "Evangelista", description: "Compartilhou o evangelho com 3 pessoas." },
        { id: "ins-19", title: "Missionário de Um Dia", description: "Participou de ação evangelística." },
        { id: "ins-20", title: "Impacto Social", description: "Participou de ação solidária." }
      ]
    }
  ];

  const checkUnlocked = (item: { id: string; title: string }) => {
    return activeUser.achievements.some((a) => {
      if (a.id === item.id || a.title === item.title) return true;
      if (a.id === "ach-1" && item.id === "ins-1") return true;
      if (a.id === "ach-2" && item.id === "ins-11") return true;
      if (a.id === "ach-3" && item.id === "ins-18") return true;
      if (a.id === "ach-4" && item.id === "ins-12") return true;
      if (a.id === "ach-5" && item.id === "ins-20") return true;
      return false;
    });
  };

  const totalInsignias = 20;
  let unlockedCount = 0;
  insigniaCategories.forEach((cat) => {
    cat.items.forEach((item) => {
      if (checkUnlocked(item)) {
        unlockedCount++;
      }
    });
  });

  return (
    <div id="profile-view-container" className="space-y-6 pb-16 text-left max-w-4xl mx-auto">
      {/* Visual profile header - Premium Bento Box */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#2D2D2D] via-[#1B1B1B] to-[#141414] text-white p-8 border border-white/5 shadow-xl">
        <div className="absolute top-0 right-0 h-44 w-44 rounded-full bg-[#C62828]/10 blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
          <div className="relative shrink-0">
            <div className="h-24 w-24 rounded-full bg-[#C62828] text-white flex items-center justify-center font-display text-2xl font-black uppercase shadow-2xl border-4 border-white/10">
              {activeUser.name.slice(0, 2)}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-[#C62828] text-white p-1.5 rounded-full shadow-lg">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <h2 className="font-display text-3xl font-black tracking-tight">{activeUser.name}</h2>
              <span className="inline-block self-center rounded-full bg-[#C62828]/20 px-3 py-0.5 text-[9px] font-bold text-red-400 uppercase border border-red-500/20 tracking-wider">
                {activeUser.role}
              </span>
            </div>
            <p className="text-xs text-neutral-400 font-medium">Célula ativa: <span className="text-white font-bold">{activeUser.cellGroup}</span></p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
              <div className="bg-white/5 rounded-2xl px-4 py-2 text-center min-w-[100px] border border-white/5">
                <span className="block text-[9px] uppercase tracking-wider text-neutral-400">Pontuação</span>
                <span className="font-mono text-lg font-black text-[#C62828]">{activeUser.points} pts</span>
              </div>
              <div className="bg-white/5 rounded-2xl px-4 py-2 text-center min-w-[100px] border border-white/5">
                <span className="block text-[9px] uppercase tracking-wider text-neutral-400">Medalhas</span>
                <span className="font-mono text-lg font-black text-white">🥇 {activeUser.medals.gold} 🥈 {activeUser.medals.silver}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 shrink-0">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="rounded-xl border border-white/10 px-5 py-2.5 text-xs font-bold text-white bg-white/5 hover:bg-white/10 transition-colors"
            >
              {isEditing ? "Cancelar" : "Editar Cadastro"}
            </button>
            <button
              onClick={onLogout}
              className="rounded-xl bg-red-600/20 hover:bg-red-600/30 border border-red-500/20 px-5 py-2.5 text-xs font-bold text-red-400 hover:text-red-300 transition-colors"
            >
              Sair da Conta
            </button>
          </div>
        </div>
      </section>

      {showSuccess && (
        <div className="rounded-2xl bg-emerald-950/30 border border-emerald-900/30 p-4 text-xs font-bold text-emerald-400 flex gap-2">
          <CheckCircle className="h-4 w-4 shrink-0 text-emerald-500" />
          <span>Cadastro atualizado com sucesso! Suas informações foram salvas localmente.</span>
        </div>
      )}

      {/* Main Grid: Bento pieces */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Profile info / form (Left 5) */}
        <div className="lg:col-span-5 rounded-3xl border border-white/5 bg-[#252525] p-6 shadow-md">
          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-4">
              <h3 className="font-display text-sm font-bold text-white border-b border-white/5 pb-2.5">
                Editar Informações Pessoais
              </h3>
              
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-neutral-400 uppercase">Nome Completo</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full py-2.5 px-3 text-xs bg-[#1B1B1B] border border-white/5 rounded-xl outline-none text-white focus:border-[#C62828]/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-neutral-400 uppercase">WhatsApp / Celular</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full py-2.5 px-3 text-xs bg-[#1B1B1B] border border-white/5 rounded-xl outline-none text-white focus:border-[#C62828]/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-neutral-400 uppercase">Email de Contato</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full py-2.5 px-3 text-xs bg-[#1B1B1B] border border-white/5 rounded-xl outline-none text-white focus:border-[#C62828]/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-neutral-400 uppercase">Sua Célula HUIOS</label>
                <input
                  type="text"
                  value={cellGroup}
                  onChange={(e) => setCellGroup(e.target.value)}
                  className="w-full py-2.5 px-3 text-xs bg-[#1B1B1B] border border-white/5 rounded-xl outline-none text-white focus:border-[#C62828]/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-neutral-400 uppercase">Data de Nascimento</label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full py-2.5 px-3 text-xs bg-[#1B1B1B] border border-white/5 rounded-xl outline-none text-white focus:border-[#C62828]/50"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 rounded-xl border border-white/10 py-2.5 text-xs font-bold text-neutral-400 hover:bg-white/5 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-[#C62828] text-white py-2.5 text-xs font-bold hover:bg-red-700 transition-colors shadow-md"
                >
                  Salvar
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-5">
              <h3 className="font-display text-sm font-bold text-white border-b border-white/5 pb-2.5">
                Ficha Cadastral
              </h3>

              <div className="space-y-4 text-xs text-neutral-300">
                <div className="flex items-center gap-3 bg-[#1B1B1B]/40 p-3 rounded-2xl border border-white/5">
                  <User className="h-5 w-5 text-[#C62828] shrink-0" />
                  <div>
                    <span className="text-[9px] text-neutral-500 uppercase block font-bold">Nome</span>
                    <span className="font-semibold text-white">{activeUser.name}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-[#1B1B1B]/40 p-3 rounded-2xl border border-white/5">
                  <Phone className="h-5 w-5 text-[#C62828] shrink-0" />
                  <div>
                    <span className="text-[9px] text-neutral-500 uppercase block font-bold">Celular</span>
                    <span className="font-semibold text-white">{activeUser.phone}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-[#1B1B1B]/40 p-3 rounded-2xl border border-white/5">
                  <Mail className="h-5 w-5 text-[#C62828] shrink-0" />
                  <div>
                    <span className="text-[9px] text-neutral-500 uppercase block font-bold">Email</span>
                    <span className="font-semibold text-white">{activeUser.email}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-[#1B1B1B]/40 p-3 rounded-2xl border border-white/5">
                  <Home className="h-5 w-5 text-[#C62828] shrink-0" />
                  <div>
                    <span className="text-[9px] text-neutral-500 uppercase block font-bold">Célula</span>
                    <span className="font-semibold text-white">{activeUser.cellGroup}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-[#1B1B1B]/40 p-3 rounded-2xl border border-white/5">
                  <Calendar className="h-5 w-5 text-[#C62828] shrink-0" />
                  <div>
                    <span className="text-[9px] text-neutral-500 uppercase block font-bold">Nascimento</span>
                    <span className="font-semibold text-white">{activeUser.birthDate}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Achievements grid (Right 7) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h3 className="font-display text-sm font-bold text-white flex items-center gap-1.5">
              <Award className="h-4 w-4 text-[#C62828]" />
              <span>Suas Insígnias HUIOS ({unlockedCount} de {totalInsignias})</span>
            </h3>
            <span className="text-[10px] text-neutral-400 font-mono">Progresso: {Math.round((unlockedCount / totalInsignias) * 100)}%</span>
          </div>

          <div className="space-y-6 max-h-[800px] overflow-y-auto pr-1">
            {insigniaCategories.map((cat) => {
              const CatIcon = cat.icon;
              return (
                <div key={cat.category} className="space-y-3">
                  <h4 className="text-xs font-bold text-[#C62828] flex items-center gap-2 uppercase tracking-wider font-display">
                    <CatIcon className="h-4 w-4 shrink-0" />
                    <span>{cat.category}</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {cat.items.map((item) => {
                      const isUnlocked = checkUnlocked(item);
                      return (
                        <div
                          key={item.id}
                          className={`rounded-2xl border p-4 text-left flex items-start gap-3.5 transition-all duration-300 ${
                            isUnlocked
                              ? "bg-[#252525] border-white/10 opacity-100 shadow-md"
                              : "bg-[#1E1E1E] border-white/5 opacity-40 hover:opacity-55"
                          }`}
                        >
                          <div className={`p-2.5 rounded-xl shrink-0 ${
                            isUnlocked 
                              ? "bg-[#C62828]/10 text-[#C62828]" 
                              : "bg-[#1B1B1B] text-neutral-600"
                          }`}>
                            <CatIcon className="h-4.5 w-4.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 justify-between">
                              <h5 className={`text-xs font-bold truncate ${isUnlocked ? "text-white" : "text-neutral-500"}`}>
                                {item.title}
                              </h5>
                              {isUnlocked && <span className="text-[10px] shrink-0">✨</span>}
                            </div>
                            <p className="text-[10px] text-neutral-400 leading-snug mt-1 font-light line-clamp-2">{item.description}</p>
                            <span className={`block text-[8px] font-bold uppercase mt-2.5 tracking-wider ${
                              isUnlocked ? "text-emerald-400" : "text-neutral-600"
                            }`}>
                              {isUnlocked ? "✅ DESBLOQUEADO" : "🔒 BLOQUEADO"}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

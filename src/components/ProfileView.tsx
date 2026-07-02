/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { User, Phone, Mail, Calendar, Home, Award, Sparkles, Shield, Compass, BookOpen, Users, CheckCircle, Music, Briefcase, Heart, Target, Flame, Gift, Lock } from "lucide-react";
import { UserProfile } from "../types";
import { api } from "../lib/api";

interface ProfileViewProps {
  activeUser: UserProfile;
  onUpdateProfile: (name: string, phone: string, email: string, cellGroup: string, birthDate: string) => void;
  onLogout: () => void;
  onNavigateTo?: (view: string) => void;
}

export default function ProfileView({ activeUser, onUpdateProfile, onLogout, onNavigateTo }: ProfileViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(activeUser.name);
  const [phone, setPhone] = useState(activeUser.phone);
  const [email, setEmail] = useState(activeUser.email);
  const [cellGroup, setCellGroup] = useState(activeUser.cellGroup);
  const [birthDate, setBirthDate] = useState(activeUser.birthDate);
  const [showSuccess, setShowSuccess] = useState(false);

  const [benefitStatus, setBenefitStatus] = useState<"idle" | "sent" | "error">("idle");
  const [isSendingBenefit, setIsSendingBenefit] = useState(false);

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

  const handleClaimBenefits = async () => {
    if (benefitStatus === "sent") return;
    setIsSendingBenefit(true);
    try {
      await api.request("/api/notifications", {
        method: "POST",
        body: JSON.stringify({
          title: "🎁 Solicitação de Benefício HUIOS",
          message: `O jovem ${activeUser.name} (${activeUser.email}) solicitou o resgate de seus benefícios. Ele possui ${unlockedCount} de ${totalInsignias} insígnias conquistadas.`,
          type: "desafio"
        })
      });
      setBenefitStatus("sent");
    } catch (err) {
      console.error("Erro ao solicitar benefícios:", err);
      setBenefitStatus("error");
    } finally {
      setIsSendingBenefit(false);
    }
  };

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
            </div>
          </div>

          <div className="flex flex-wrap gap-2 shrink-0">
            {onNavigateTo && (
              <>
                <button
                  onClick={() => onNavigateTo("Home")}
                  className="rounded-xl border border-white/10 px-5 py-2.5 text-xs font-bold text-white bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-1.5"
                >
                  <Home className="h-3.5 w-3.5 text-neutral-400" />
                  Início
                </button>
                <button
                  onClick={() => onNavigateTo("Desafio Jovem")}
                  className="rounded-xl border border-white/10 px-5 py-2.5 text-xs font-bold text-white bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-1.5"
                >
                  <Award className="h-3.5 w-3.5 text-neutral-400" />
                  Desafios
                </button>
              </>
            )}
            <button
              onClick={onLogout}
              className="rounded-xl bg-red-600/20 hover:bg-red-600/30 border border-red-500/20 px-5 py-2.5 text-xs font-bold text-red-400 hover:text-red-300 transition-colors"
            >
              Sair da Conta
            </button>
          </div>
        </div>
      </section>

      {/* Main Grid: Bento pieces */}
      <section className="w-full">
        {/* Achievements grid */}
        <div className="w-full space-y-6">
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
                          className={`relative rounded-2xl border p-4 text-left flex items-center gap-4 transition-all duration-500 overflow-hidden ${
                            isUnlocked
                              ? "bg-gradient-to-br from-[#2D2222] via-[#201D1D] to-[#1C1818] border-amber-500/30 opacity-100 shadow-[0_4px_20px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.05)] hover:border-amber-400/50 hover:shadow-[0_8px_30px_rgba(245,158,11,0.15)] group"
                              : "bg-[#161616] border-white/5 opacity-40 hover:opacity-60"
                          }`}
                        >
                          {/* Premium metallic badge overlay for active ones */}
                          {isUnlocked && (
                            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-400/10 transition-all duration-500" />
                          )}
                          
                          {/* Physical Medallion */}
                          <div className="relative shrink-0">
                            {isUnlocked ? (
                              <div className="relative w-14 h-14 rounded-full flex items-center justify-center border-2 border-amber-500 bg-gradient-to-b from-neutral-800 via-neutral-900 to-neutral-950 text-amber-400 shadow-[0_4px_12px_rgba(0,0,0,0.5),0_0_8px_rgba(245,158,11,0.3)] group-hover:scale-105 transition-transform duration-300">
                                {/* Golden shining ring */}
                                <div className="absolute inset-0.5 rounded-full border border-amber-400/20 pointer-events-none" />
                                <div className="absolute -inset-[3px] rounded-full border border-amber-500/10 pointer-events-none animate-pulse" />
                                
                                <CatIcon className="h-6 w-6 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
                                
                                {/* Tiny shiny emblem star */}
                                <span className="absolute -top-1 -right-1 text-[8px] animate-bounce">✨</span>
                              </div>
                            ) : (
                              <div className="relative w-14 h-14 rounded-full flex items-center justify-center border border-white/10 bg-[#1A1A1A] text-neutral-600">
                                <div className="absolute inset-0.5 rounded-full border border-dashed border-white/5" />
                                <CatIcon className="h-5 w-5 opacity-40" />
                                <Lock className="absolute h-3 w-3 bottom-0 right-0 text-neutral-500 bg-[#161616] rounded-full p-0.5 border border-white/5" />
                              </div>
                            )}
                          </div>

                          {/* Info Text */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 justify-between">
                              <h5 className={`text-xs font-black tracking-wide font-display ${isUnlocked ? "bg-gradient-to-r from-white via-neutral-100 to-amber-200 bg-clip-text text-transparent" : "text-neutral-500"}`}>
                                {item.title}
                              </h5>
                              {isUnlocked && (
                                <span className="text-[8px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded-full font-mono shrink-0">
                                  HUIOS
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-neutral-400 leading-relaxed mt-1 font-light line-clamp-2">
                              {item.description}
                            </p>
                            <div className="flex items-center gap-1 mt-2.5">
                              {isUnlocked ? (
                                <>
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                  <span className="text-[8px] font-black text-emerald-400 uppercase tracking-wider">
                                    CONQUISTADO
                                  </span>
                                </>
                              ) : (
                                <>
                                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-600" />
                                  <span className="text-[8px] font-bold text-neutral-500 uppercase tracking-wider">
                                    BLOQUEADO
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Resgatar Benefícios Section */}
          <div className="bg-[#1E1E1E] rounded-2xl border border-white/5 p-5 mt-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className={`p-2.5 rounded-xl ${unlockedCount === totalInsignias ? "bg-[#C62828]/10 text-[#C62828]" : "bg-neutral-800 text-neutral-500"}`}>
                <Gift className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <h4 className="text-xs font-bold text-white font-display">Benefícios Exclusivos HUIOS</h4>
                <p className="text-[10px] text-neutral-400 mt-1 leading-relaxed font-light">
                  Ao conquistar todas as 20 insígnias de estudo, oração, comunhão e desafios, você desbloqueia o direito de resgatar prêmios e benefícios com seus líderes.
                </p>
              </div>
            </div>

            {benefitStatus === "sent" ? (
              <div className="rounded-xl bg-emerald-950/30 border border-emerald-900/30 p-3 text-[10px] font-bold text-emerald-400 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 shrink-0 text-emerald-500" />
                <span>Solicitação de resgate enviada com sucesso para os líderes e administradores!</span>
              </div>
            ) : benefitStatus === "error" ? (
              <div className="rounded-xl bg-red-950/30 border border-red-900/30 p-3 text-[10px] font-bold text-red-400 flex items-center gap-2">
                <Shield className="h-4 w-4 shrink-0 text-red-500" />
                <span>Ocorreu um erro ao enviar a solicitação. Tente novamente mais tarde.</span>
              </div>
            ) : null}

            <button
              onClick={handleClaimBenefits}
              disabled={benefitStatus === "sent" || isSendingBenefit}
              className={`w-full py-3 px-4 rounded-xl font-display text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                unlockedCount === totalInsignias && benefitStatus !== "sent"
                  ? "bg-[#C62828] text-white hover:bg-[#D32F2F] shadow-lg shadow-[#C62828]/20 cursor-pointer"
                  : "bg-[#1B1B1B] text-neutral-500 border border-white/5 cursor-not-allowed opacity-60"
              }`}
            >
              {isSendingBenefit ? (
                <span>Processando...</span>
              ) : unlockedCount === totalInsignias ? (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Resgatar Benefícios</span>
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  <span>Resgatar Benefícios (Bloqueado - Conclua as {totalInsignias} Insígnias)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

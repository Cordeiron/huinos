/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Award, Target, Calendar, Trophy, Medal, Star, ShieldCheck, History, Upload, Image, ArrowRight, Video, Sparkles, Compass } from "lucide-react";
import { Challenge, ChallengeSubmission, UserProfile } from "../types";

interface ChallengesViewProps {
  challenges: Challenge[];
  submissions: ChallengeSubmission[];
  activeUser: UserProfile;
  rankingUsers: UserProfile[];
  onCompleteChallenge: (challengeId: string, text: string, fileUrl: string, mediaType: "text" | "image" | "video") => void;
}

export default function ChallengesView({
  challenges,
  submissions,
  activeUser,
  rankingUsers,
  onCompleteChallenge
}: ChallengesViewProps) {
  const [activeTab, setActiveTab] = useState<"desafios" | "ranking" | "historico">("desafios");
  const [rankingPeriod, setRankingPeriod] = useState<"mensal" | "anual" | "geral">("geral");
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  
  // Submission form state
  const [responseText, setResponseText] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState<"text" | "image" | "video">("text");
  const [showSuccess, setShowSuccess] = useState(false);

  // Filter rankings according to period
  const sortedRanking = [...rankingUsers].sort((a, b) => {
    if (rankingPeriod === "mensal") {
      // simulate slightly different order for periods
      return (b.points * 0.7 + b.medals.gold * 30) - (a.points * 0.7 + a.medals.gold * 30);
    } else if (rankingPeriod === "anual") {
      return (b.points * 0.9 + b.medals.silver * 15) - (a.points * 0.9 + a.medals.silver * 15);
    }
    return b.points - a.points; // general
  });

  const top10Ranking = sortedRanking.slice(0, 10);

  const activeChallenges = challenges.filter((c) => c.active);

  const handleOpenSubmission = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setResponseText("");
    setMediaUrl("");
    setMediaType("text");
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChallenge) return;

    onCompleteChallenge(
      selectedChallenge.id,
      responseText,
      mediaUrl.trim(),
      mediaUrl.trim() ? "image" : "text"
    );

    setSelectedChallenge(null);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
  };

  const getMedalIcon = (index: number) => {
    switch (index) {
      case 0:
        return <span className="text-xl shrink-0">🥇</span>;
      case 1:
        return <span className="text-xl shrink-0">🥈</span>;
      case 2:
        return <span className="text-xl shrink-0">🥉</span>;
      default:
        return <span className="text-xs font-mono font-bold text-neutral-400 shrink-0 w-5 text-center">#{index + 1}</span>;
    }
  };

  // Check if active user already submitted this challenge
  const isAlreadySubmitted = (challengeId: string) => {
    return submissions.some((s) => s.challengeId === challengeId && s.userId === activeUser.id);
  };

  const getSubmissionStatus = (challengeId: string) => {
    const sub = submissions.find((s) => s.challengeId === challengeId && s.userId === activeUser.id);
    return sub ? sub.status : null;
  };

  return (
    <div id="challenges-view-container" className="space-y-8 pb-16">
      {/* Header section */}
      <section className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-red-600/10 px-3 py-1 border border-red-500/10 text-xs font-bold text-red-600">
          <Trophy className="h-3.5 w-3.5 animate-bounce" />
          <span>DESAFIOS & RANKING</span>
        </div>
        <h2 className="font-display text-2xl md:text-4xl font-black text-neutral-800 dark:text-white">
          Desafio Jovem & Medalhas
        </h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Mergulhe de cabeça na Palavra e no serviço! Conclua desafios semanais, ganhe pontos no ranking do grupo, desbloqueie medalhas exclusivas e seja edificado.
        </p>
      </section>

      {/* Tabs Switcher */}
      <section className="flex justify-center border-b border-neutral-100 dark:border-neutral-800">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab("desafios")}
            className={`pb-3 text-xs font-bold transition-all border-b-2 px-1 ${
              activeTab === "desafios"
                ? "border-red-600 text-red-600"
                : "border-transparent text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
            }`}
          >
            🎯 Desafios Ativos
          </button>
          <button
            onClick={() => setActiveTab("ranking")}
            className={`pb-3 text-xs font-bold transition-all border-b-2 px-1 ${
              activeTab === "ranking"
                ? "border-red-600 text-red-600"
                : "border-transparent text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
            }`}
          >
            🏆 Leaderboard / Ranking
          </button>
          <button
            onClick={() => setActiveTab("historico")}
            className={`pb-3 text-xs font-bold transition-all border-b-2 px-1 ${
              activeTab === "historico"
                ? "border-red-600 text-red-600"
                : "border-transparent text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
            }`}
          >
            📜 Seus Envios & Medalhas
          </button>
        </div>
      </section>

      {/* Success notification for completion */}
      {showSuccess && (
        <div className="max-w-xl mx-auto rounded-xl bg-emerald-50 border border-emerald-100 p-4 flex gap-3 text-left dark:bg-emerald-950/20 dark:border-emerald-900/40">
          <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-emerald-800 dark:text-emerald-400">Desafio enviado com sucesso!</p>
            <p className="text-[10px] text-emerald-600/90 mt-0.5">Sua participação foi enviada para validação da liderança. Após a aprovação, seus pontos e medalhas serão creditados!</p>
          </div>
        </div>
      )}

      {/* TAB 1: ACTIVE CHALLENGES */}
      {activeTab === "desafios" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {activeChallenges.map((item) => {
            const submitted = isAlreadySubmitted(item.id);
            const status = getSubmissionStatus(item.id);
            return (
              <div
                key={item.id}
                className="group flex flex-col justify-between rounded-3xl border border-neutral-100 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 dark:border-neutral-800 dark:bg-neutral-900/40 text-left"
              >
                <div className="space-y-4">
                  {/* Challenge Image */}
                  <div className="relative h-44 rounded-2xl overflow-hidden bg-neutral-100">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                    <div className="absolute top-3 right-3 rounded-full bg-neutral-900/80 px-2.5 py-1 text-[10px] font-bold text-white border border-neutral-700">
                      ⚡ {item.points} Pontos
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-display text-base font-bold text-neutral-800 dark:text-neutral-100">
                      {item.title}
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-light">
                      {item.description}
                    </p>
                  </div>

                  {/* Challenge metadata */}
                  <div className="grid grid-cols-2 gap-2 text-[10px] border-t border-neutral-50 pt-3 dark:border-neutral-800">
                    <div className="space-y-0.5">
                      <span className="text-neutral-400 block uppercase font-bold text-[8px]">Prêmio:</span>
                      <span className="font-semibold text-neutral-700 dark:text-neutral-300 truncate block">{item.prize}</span>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-neutral-400 block uppercase font-bold text-[8px]">Limite:</span>
                      <span className="font-semibold text-neutral-700 dark:text-neutral-300">{item.endDate}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  {submitted ? (
                    <div className={`w-full rounded-xl py-2 px-3 text-center text-xs font-bold border flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
                      status === "Aprovado"
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                        : status === "Rejeitado" || status === "Reprovado"
                        ? "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400"
                        : "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400"
                    }`}>
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="h-4 w-4" />
                        <span>Desafio Concluído • Status:</span>
                      </div>
                      <span className="uppercase font-extrabold">{status}</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleOpenSubmission(item)}
                      className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-neutral-900 text-white text-xs font-bold py-2.5 hover:bg-neutral-800 transition-colors"
                    >
                      <span>Concluir desafio</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: LEADERBOARD / RANKING */}
      {activeTab === "ranking" && (
        <div className="max-w-2xl mx-auto space-y-6 text-left">
          {/* Period selector */}
          <div className="flex justify-between items-center bg-neutral-50 dark:bg-neutral-900/40 p-4 rounded-2xl border border-neutral-100 dark:border-neutral-800">
            <h3 className="font-display text-xs font-bold text-neutral-800 dark:text-neutral-200">
              Classificação dos Jovens
            </h3>
            <div className="flex gap-1">
              {(["mensal", "anual", "geral"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setRankingPeriod(p)}
                  className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                    rankingPeriod === p
                      ? "bg-red-600 text-white"
                      : "bg-white border border-neutral-200 text-neutral-600 dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-300 hover:bg-neutral-50"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Podium Highlights (Visual Top 3) */}
          <div className="grid grid-cols-3 gap-3 items-end pt-8 pb-4">
            {/* Second place */}
            {top10Ranking[1] && (
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="h-14 w-14 rounded-full border-2 border-slate-300 bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 flex items-center justify-center font-display text-xs font-black uppercase">
                    {top10Ranking[1].name.slice(0, 2)}
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-slate-300 text-neutral-800 rounded-full h-5 w-5 flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                </div>
                <p className="mt-2 text-[10px] font-bold text-neutral-700 dark:text-neutral-300 truncate max-w-full text-center">
                  {top10Ranking[1].name.split(" ")[0]}
                </p>
                <p className="text-[10px] font-mono text-red-600 dark:text-red-500 font-extrabold">
                  {top10Ranking[1].points} pts
                </p>
                <div className="h-16 w-full bg-slate-200/60 dark:bg-slate-800/60 rounded-t-xl mt-3 border-t border-slate-300/30" />
              </div>
            )}

            {/* First place */}
            {top10Ranking[0] && (
              <div className="flex flex-col items-center">
                <div className="relative -translate-y-2">
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-yellow-500 animate-bounce">
                    👑
                  </div>
                  <div className="h-18 w-18 rounded-full border-4 border-amber-400 bg-amber-500/10 text-amber-500 flex items-center justify-center font-display text-sm font-black uppercase shadow-lg">
                    {top10Ranking[0].name.slice(0, 2)}
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-amber-400 text-neutral-900 rounded-full h-6 w-6 flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                </div>
                <p className="mt-1 text-xs font-black text-neutral-800 dark:text-neutral-100 truncate max-w-full text-center">
                  {top10Ranking[0].name.split(" ")[0]}
                </p>
                <p className="text-xs font-mono text-red-600 dark:text-red-500 font-black">
                  {top10Ranking[0].points} pts
                </p>
                <div className="h-24 w-full bg-gradient-to-t from-red-600/20 to-amber-100/60 dark:from-red-950/20 dark:to-amber-950/20 rounded-t-xl mt-3 border-t-2 border-amber-400/50" />
              </div>
            )}

            {/* Third place */}
            {top10Ranking[2] && (
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="h-12 w-12 rounded-full border-2 border-amber-700/60 bg-neutral-200 text-amber-700 dark:bg-neutral-800 dark:text-amber-500 flex items-center justify-center font-display text-[11px] font-bold uppercase">
                    {top10Ranking[2].name.slice(0, 2)}
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-amber-700/60 text-white rounded-full h-5 w-5 flex items-center justify-center font-bold text-[10px]">
                    3
                  </div>
                </div>
                <p className="mt-2 text-[10px] font-bold text-neutral-700 dark:text-neutral-300 truncate max-w-full text-center">
                  {top10Ranking[2].name.split(" ")[0]}
                </p>
                <p className="text-[10px] font-mono text-red-600 dark:text-red-500 font-extrabold">
                  {top10Ranking[2].points} pts
                </p>
                <div className="h-12 w-full bg-amber-800/10 dark:bg-amber-900/10 rounded-t-xl mt-3 border-t border-amber-700/20" />
              </div>
            )}
          </div>

          {/* General List ranking */}
          <div className="space-y-1 bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl p-3 shadow-inner max-h-96 overflow-y-auto">
            {top10Ranking.map((user, index) => (
              <div
                key={user.id}
                className={`flex items-center justify-between p-2.5 rounded-xl transition-colors ${
                  user.id === activeUser.id
                    ? "bg-red-50/50 border border-red-200/50 dark:bg-red-950/10 dark:border-red-900/20"
                    : "hover:bg-neutral-50 dark:hover:bg-neutral-800/30"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {getMedalIcon(index)}
                  <div className="h-8 w-8 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 flex items-center justify-center text-[10px] font-black uppercase shrink-0">
                    {user.name.slice(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-neutral-800 dark:text-neutral-100 truncate">
                      {user.name} {user.id === activeUser.id && <span className="text-[9px] font-mono font-bold text-red-600 ml-1">(Você)</span>}
                    </p>
                    <p className="text-[9px] text-neutral-400">
                      {user.cellGroup}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs font-mono font-bold text-red-600 dark:text-red-500">
                    {user.points} pts
                  </p>
                  <div className="flex gap-0.5 justify-end mt-0.5 text-[8px] text-neutral-400">
                    <span>🥇 {user.medals.gold}</span>
                    <span>🥈 {user.medals.silver}</span>
                    <span>🥉 {user.medals.bronze}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: USER HISTORY & MEDALS */}
      {activeTab === "historico" && (
        <div className="max-w-2xl mx-auto space-y-8 text-left">
          {/* Medal grid summary for active user */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/20 dark:to-neutral-900 rounded-2xl p-4 border border-amber-200/40">
              <span className="text-3xl block">🥇</span>
              <span className="block text-lg font-black font-mono text-neutral-800 dark:text-white mt-1">{activeUser.medals.gold}</span>
              <span className="text-[9px] font-bold uppercase text-neutral-400">Medalhas de Ouro</span>
            </div>
            <div className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-900/40 dark:to-neutral-900 rounded-2xl p-4 border border-slate-200/40">
              <span className="text-3xl block">🥈</span>
              <span className="block text-lg font-black font-mono text-neutral-800 dark:text-white mt-1">{activeUser.medals.silver}</span>
              <span className="text-[9px] font-bold uppercase text-neutral-400">Medalhas de Prata</span>
            </div>
            <div className="bg-gradient-to-br from-amber-900/5 to-white dark:from-amber-950/20 dark:to-neutral-900 rounded-2xl p-4 border border-amber-900/10">
              <span className="text-3xl block">🥉</span>
              <span className="block text-lg font-black font-mono text-neutral-800 dark:text-white mt-1">{activeUser.medals.bronze}</span>
              <span className="text-[9px] font-bold uppercase text-neutral-400">Medalhas de Bronze</span>
            </div>
          </div>

          {/* Submission history list */}
          <div className="space-y-3">
            <h3 className="font-display text-sm font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
              <History className="h-4 w-4 text-red-600" />
              <span>Seu Histórico de Envios</span>
            </h3>

            {submissions.filter((s) => s.userId === activeUser.id).length === 0 ? (
              <div className="text-center py-8 rounded-2xl border border-dashed border-neutral-100 dark:border-neutral-800">
                <p className="text-xs text-neutral-400">Você ainda não enviou participações para nenhum desafio. Complete um acima!</p>
              </div>
            ) : (
              submissions
                .filter((s) => s.userId === activeUser.id)
                .map((sub) => (
                  <div
                    key={sub.id}
                    className="rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/30 space-y-3"
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-display text-xs font-bold text-neutral-800 dark:text-neutral-200">
                        {sub.challengeTitle}
                      </h4>
                      <span className={`rounded-full px-2.5 py-0.5 text-[8px] font-bold uppercase border ${
                        sub.status === "Aprovado"
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/20"
                          : sub.status === "Reprovado" || sub.status === "Rejeitado"
                          ? "bg-red-50 text-red-600 border-red-100 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/20"
                          : "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/10 dark:text-amber-400 dark:border-amber-900/20"
                      }`}>
                        {sub.status || "Pendente de Aprovação"}
                      </span>
                    </div>

                    <p className="text-[11px] text-neutral-500 italic dark:text-neutral-400">
                      "{sub.text}"
                    </p>

                    {sub.fileUrl && (
                      <p className="text-[9px] text-neutral-400 flex items-center gap-1">
                        <span>🔗 Link Comprovante:</span>
                        <a href={sub.fileUrl} target="_blank" rel="noreferrer" className="text-red-600 dark:text-red-400 hover:underline break-all">
                          {sub.fileUrl}
                        </a>
                      </p>
                    )}

                    {sub.feedback && (
                      <div className={`rounded-xl p-2.5 border text-[10px] ${
                        sub.status === "Rejeitado" || sub.status === "Reprovado"
                          ? "bg-red-50/50 border-red-100/40 text-red-700 dark:bg-red-950/10 dark:border-red-900/20 dark:text-red-400"
                          : "bg-neutral-50 border-neutral-100 text-neutral-600 dark:bg-neutral-900/40 dark:border-neutral-800 dark:text-neutral-400"
                      }`}>
                        <span className="font-bold block mb-0.5">
                          {sub.status === "Rejeitado" || sub.status === "Reprovado" ? "❌ Motivo da Rejeição:" : "💬 Retorno do Líder:"}
                        </span>
                        "{sub.feedback}"
                      </div>
                    )}
                  </div>
                ))
            )}
          </div>
        </div>
      )}

      {/* SUBMISSION FORM MODAL */}
      {selectedChallenge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div
            className="w-full max-w-lg overflow-hidden rounded-3xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900 text-left space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <span className="text-[10px] uppercase font-bold text-red-600">Comprovar Desafio</span>
              <h3 className="font-display text-base font-bold text-neutral-800 dark:text-white mt-1">
                {selectedChallenge.title}
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                Envie suas evidências, fotos, anotações ou links para receber sua pontuação correspondente de {selectedChallenge.points} pts.
              </p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase">Descrição da Conclusão (Obrigatório)</label>
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  required
                  rows={4}
                  placeholder="Escreva detalhadamente como você concluiu este desafio (mínimo de informações para validação)..."
                  className="w-full py-2 px-3 text-xs bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 rounded-xl outline-none text-neutral-800 dark:text-neutral-100 focus:border-red-600 resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase">Link de Comprovação (Opcional)</label>
                <input
                  type="url"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  placeholder="Link do YouTube, Instagram, Google Drive, Facebook, etc."
                  className="w-full py-2 px-3 text-xs bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 rounded-xl outline-none text-neutral-800 dark:text-neutral-100 focus:border-red-600"
                />
              </div>

              <div className="flex gap-2 pt-2 justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedChallenge(null)}
                  className="rounded-xl border border-neutral-200 px-4 py-2 text-xs font-bold text-neutral-500 hover:bg-neutral-50 dark:border-neutral-800 dark:text-neutral-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-red-600 px-5 py-2 text-xs font-bold text-white hover:bg-red-700 shadow-md"
                >
                  Enviar Conclusão
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Heart, Send, Sparkles, ShieldCheck, Clock, CheckCircle2, User, HelpCircle, AlertCircle } from "lucide-react";
import { PrayerRequest, UserProfile } from "../types";

interface PrayerRequestsViewProps {
  prayers: PrayerRequest[];
  activeUser: UserProfile;
  onSubmitPrayer: (name: string, requestText: string, isAnonymous: boolean) => void;
  onPrayAlong: (id: string) => void;
}

export default function PrayerRequestsView({
  prayers,
  activeUser,
  onSubmitPrayer,
  onPrayAlong
}: PrayerRequestsViewProps) {
  const [name, setName] = useState("");
  const [requestText, setRequestText] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestText.trim()) return;
    
    // Submit
    onSubmitPrayer(isAnonymous ? "Anônimo" : name.trim() || "Visitante", requestText, isAnonymous);
    
    // Clear & show success state
    setName("");
    setRequestText("");
    setIsAnonymous(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
  };

  const getStatusBadge = (status: "Novo" | "Em oração" | "Respondido") => {
    switch (status) {
      case "Em oração":
        return {
          icon: Clock,
          text: "Em oração",
          color: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200/50"
        };
      case "Respondido":
        return {
          icon: CheckCircle2,
          text: "Respondido",
          color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/50"
        };
      default:
        return {
          icon: AlertCircle,
          text: "Novo",
          color: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400 border border-red-200/50"
        };
    }
  };

  return (
    <div id="prayer-requests-container" className="space-y-12 pb-16">
      {/* Header section */}
      <section className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-red-600/10 px-3 py-1 border border-red-500/10 text-xs font-bold text-red-600">
          <Heart className="h-3.5 w-3.5 animate-pulse" />
          <span>PEDIDOS DE ORAÇÃO</span>
        </div>
        <h2 className="font-display text-2xl md:text-4xl font-black text-neutral-800 dark:text-white">
          Clamor, Intercessão e Respostas
        </h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          A Bíblia diz: "Orai uns pelos outros". Envie as suas petições de oração ou agradecimentos, e nossa equipe pastoral e jovens intercessores estarão clamando por você semanalmente.
        </p>
      </section>

      {/* Main split: Submit form on left, active prayers on right */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Submit Form */}
        <div className="lg:col-span-5 rounded-3xl border border-neutral-100 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50 space-y-6">
          <div className="text-left">
            <h3 className="font-display text-sm font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-red-600" />
              <span>Apresente o seu pedido</span>
            </h3>
            <p className="text-[11px] text-neutral-400 mt-1">
              Sua privacidade é respeitada. Você pode optar por permanecer completamente anônimo se preferir.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {!isAnonymous && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-neutral-400 uppercase">Seu Nome (Opcional)</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Gabriel Santos"
                  className="w-full py-2 px-3 text-xs bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 rounded-xl outline-none text-neutral-800 dark:text-neutral-100 focus:border-red-600"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-400 uppercase">Seu Pedido de Oração / Clamor</label>
              <textarea
                value={requestText}
                onChange={(e) => setRequestText(e.target.value)}
                required
                rows={4}
                placeholder="Descreva detalhadamente o seu motivo de oração ou agradecimento para que possamos clamar de forma direcionada..."
                className="w-full py-2 px-3 text-xs bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 rounded-xl outline-none text-neutral-800 dark:text-neutral-100 focus:border-red-600 resize-none"
              />
            </div>

            <div className="flex items-center gap-2 py-1">
              <input
                type="checkbox"
                id="is-anonymous-toggle"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="h-4 w-4 rounded border-neutral-300 text-red-600 focus:ring-red-500 accent-red-600"
              />
              <label htmlFor="is-anonymous-toggle" className="text-xs font-semibold text-neutral-600 dark:text-neutral-300 select-none cursor-pointer">
                Desejo permanecer anônimo(a)
              </label>
            </div>

            <button
              type="submit"
              disabled={!requestText.trim()}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-600 text-white text-xs font-bold py-2.5 shadow-md transition-all hover:bg-red-700 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              <span>Enviar Motivo de Oração</span>
            </button>
          </form>

          {showSuccess && (
            <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3 flex gap-2.5 text-left dark:bg-emerald-950/20 dark:border-emerald-900/40">
              <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-emerald-800 dark:text-emerald-400">Pedido enviado com sucesso!</p>
                <p className="text-[10px] text-emerald-600/90 mt-0.5">Nossa equipe de intercessores já recebeu sua petição e começará a clamar por esta causa.</p>
              </div>
            </div>
          )}
        </div>

        {/* Public Requests list */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm font-bold text-neutral-800 dark:text-neutral-200">
              Mural de Intercessão Recente
            </h3>
            <span className="text-[10px] text-neutral-400 font-mono">
              Total: {prayers.length} pedidos
            </span>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {prayers.length === 0 ? (
              <div className="text-center py-12 rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800">
                <p className="text-xs text-neutral-400 font-medium">Nenhum pedido de oração cadastrado no momento.</p>
              </div>
            ) : (
              prayers.map((item) => {
                const badge = getStatusBadge(item.status);
                const BadgeIcon = badge.icon;
                const hasPrayed = item.prayedBy.includes(activeUser.id);
                return (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm text-left dark:border-neutral-800 dark:bg-neutral-900/30 space-y-3.5 transition-all hover:border-neutral-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-neutral-100 flex items-center justify-center dark:bg-neutral-800 text-neutral-500">
                          <User className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                          {item.isAnonymous ? "Anônimo" : item.name}
                        </span>
                        <span className="text-[9px] text-neutral-400 font-mono">
                          {item.date}
                        </span>
                      </div>

                      <div className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider ${badge.color}`}>
                        <BadgeIcon className="h-3 w-3" />
                        <span>{badge.text}</span>
                      </div>
                    </div>

                    <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                      "{item.request}"
                    </p>

                    {/* Admin response if exists */}
                    {item.adminResponse && (
                      <div className="rounded-xl bg-red-50/50 dark:bg-red-950/10 border border-red-100/40 dark:border-red-900/20 p-3 text-left space-y-1">
                        <p className="text-[9px] font-bold text-red-600 dark:text-red-400 uppercase tracking-widest">
                          Palavra da Liderança Pastoral:
                        </p>
                        <p className="text-xs text-neutral-600 italic dark:text-neutral-400">
                          "{item.adminResponse}"
                        </p>
                      </div>
                    )}

                    <div className="border-t border-neutral-100/50 pt-3 dark:border-neutral-800 flex items-center justify-between">
                      <span className="text-[10px] text-neutral-400">
                        {item.prayedCount > 0
                          ? `🙏 ${item.prayedCount} pessoa(s) orando por esta causa`
                          : "Seja o primeiro a interceder"}
                      </span>

                      <button
                        onClick={() => onPrayAlong(item.id)}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          hasPrayed
                            ? "bg-red-50 text-red-600 border border-red-200/50 dark:bg-red-950/20 dark:border-red-900/30 scale-95"
                            : "bg-neutral-50 border border-neutral-100 text-neutral-500 dark:bg-neutral-900 dark:border-neutral-800 hover:bg-neutral-100"
                        }`}
                      >
                        <Heart className={`h-3.5 w-3.5 ${hasPrayed ? "fill-red-600 text-red-600" : "text-neutral-400"}`} />
                        <span>{hasPrayed ? "Orando Junto" : "Orar Junto"}</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { MessageSquare, Send, Sparkles, ShieldCheck, ThumbsUp, Lightbulb } from "lucide-react";
import { SuggestionItem, UserProfile } from "../types";

interface SuggestionsViewProps {
  suggestions: SuggestionItem[];
  activeUser: UserProfile;
  onSubmitSuggestion: (name: string, category: string, suggestion: string) => void;
}

export default function SuggestionsView({
  suggestions,
  activeUser,
  onSubmitSuggestion
}: SuggestionsViewProps) {
  const [name, setName] = useState(activeUser.name || "");
  const [category, setCategory] = useState<string>("Eventos");
  const [suggestionText, setSuggestionText] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const categories = ["Célula", "Culto", "Estrutura", "Eventos", "Música", "Social", "Outro"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestionText.trim()) return;

    onSubmitSuggestion(name.trim() || "Anônimo", category, suggestionText);

    setSuggestionText("");
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
  };

  const acceptedSuggestions = suggestions.filter((s) => s.status === "Aceita");

  return (
    <div id="suggestions-view-container" className="space-y-12 pb-16">
      {/* Header */}
      <section className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-red-600/10 px-3 py-1 border border-red-500/10 text-xs font-bold text-red-600">
          <Lightbulb className="h-3.5 w-3.5 animate-pulse" />
          <span>SUGESTÕES & IDEIAS</span>
        </div>
        <h2 className="font-display text-2xl md:text-4xl font-black text-neutral-800 dark:text-white">
          Co-criando o Futuro HUIOS
        </h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Você tem uma ideia para um novo evento, melhoria na estrutura ou dinâmicas nas células? Compartilhe seu insight! A liderança avalia e responde a cada sugestão.
        </p>
      </section>

      {/* Grid split */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input box */}
        <div className="lg:col-span-5 rounded-3xl border border-neutral-100 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50 space-y-6">
          <div className="text-left">
            <h3 className="font-display text-sm font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-red-600" />
              <span>Envie sua proposta</span>
            </h3>
            <p className="text-[11px] text-neutral-400 mt-1">
              Ideias fundamentadas que tragam edificação e aproximação de jovens serão implementadas!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-400 uppercase">Seu Nome</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Lucas Mendonça"
                required
                className="w-full py-2 px-3 text-xs bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 rounded-xl outline-none text-neutral-800 dark:text-neutral-100 focus:border-red-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-400 uppercase">Categoria</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full py-2 px-3 text-xs bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 rounded-xl outline-none text-neutral-800 dark:text-neutral-100 focus:border-red-600 cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-400 uppercase">Sua Sugestão / Detalhes</label>
              <textarea
                value={suggestionText}
                onChange={(e) => setSuggestionText(e.target.value)}
                required
                rows={5}
                placeholder="Explique sua ideia, quais recursos seriam necessários, público alvo, e como isso abençoará a juventude..."
                className="w-full py-2 px-3 text-xs bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 rounded-xl outline-none text-neutral-800 dark:text-neutral-100 focus:border-red-600 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={!suggestionText.trim()}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-600 text-white text-xs font-bold py-2.5 shadow-md transition-all hover:bg-red-700 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              <span>Enviar Proposta</span>
            </button>
          </form>

          {showSuccess && (
            <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3 flex gap-2.5 text-left dark:bg-emerald-950/20 dark:border-emerald-900/40">
              <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-emerald-800 dark:text-emerald-400">Sugestão enviada!</p>
                <p className="text-[10px] text-emerald-600/90 mt-0.5">Sua ideia foi enviada ao painel de moderação de líderes. Obrigado por somar!</p>
              </div>
            </div>
          )}
        </div>

        {/* List of active accepted suggestions */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm font-bold text-neutral-800 dark:text-neutral-200">
              Sugestões Aceitas & Em Planejamento
            </h3>
            <span className="text-[10px] text-neutral-400 font-mono">
              Pronto: {acceptedSuggestions.length} ideias
            </span>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {acceptedSuggestions.length === 0 ? (
              <div className="text-center py-12 rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800">
                <p className="text-xs text-neutral-400 font-medium">As ideias aceitas pela liderança serão exibidas aqui para transparência.</p>
              </div>
            ) : (
              acceptedSuggestions.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm text-left dark:border-neutral-800 dark:bg-neutral-900/30 space-y-3 transition-all hover:border-neutral-200"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                      Enviada por: {item.name}
                    </span>
                    <span className="rounded-md bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/20">
                      {item.category}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-normal">
                    "{item.suggestion}"
                  </p>

                  {item.adminResponse && (
                    <div className="rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-100/50 dark:border-neutral-800 p-3 space-y-1">
                      <p className="text-[9px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest flex items-center gap-1">
                        <ThumbsUp className="h-3 w-3 text-red-600" /> Resposta da Coordenação:
                      </p>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed italic">
                        "{item.adminResponse}"
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

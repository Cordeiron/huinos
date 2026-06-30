/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { Search, Calendar, FileText, Award, Book, HelpCircle, ArrowRight, X } from "lucide-react";
import { EventItem, NewsItem, Challenge, VerseOfTheWeek } from "../types";

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  events: EventItem[];
  news: NewsItem[];
  challenges: Challenge[];
  verse: VerseOfTheWeek;
  onNavigateTo: (view: string, itemId?: string) => void;
}

export default function GlobalSearch({
  isOpen,
  onClose,
  events,
  news,
  challenges,
  verse,
  onNavigateTo
}: GlobalSearchProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const lowercaseQuery = query.toLowerCase().trim();

  // Filter lists based on search
  const filteredEvents = lowercaseQuery
    ? events.filter(
        (e) =>
          e.title.toLowerCase().includes(lowercaseQuery) ||
          e.description.toLowerCase().includes(lowercaseQuery) ||
          e.address.toLowerCase().includes(lowercaseQuery)
      )
    : [];

  const filteredNews = lowercaseQuery
    ? news.filter(
        (n) =>
          n.title.toLowerCase().includes(lowercaseQuery) ||
          n.subtitle.toLowerCase().includes(lowercaseQuery) ||
          n.content.toLowerCase().includes(lowercaseQuery)
      )
    : [];

  const filteredChallenges = lowercaseQuery
    ? challenges.filter(
        (c) =>
          c.title.toLowerCase().includes(lowercaseQuery) ||
          c.description.toLowerCase().includes(lowercaseQuery)
      )
    : [];

  const isVerseMatch =
    lowercaseQuery &&
    (verse.text.toLowerCase().includes(lowercaseQuery) ||
      verse.reference.toLowerCase().includes(lowercaseQuery));

  const totalResults =
    filteredEvents.length +
    filteredNews.length +
    filteredChallenges.length +
    (isVerseMatch ? 1 : 0);

  const handleSelect = (view: string, itemId?: string) => {
    onNavigateTo(view, itemId);
    setQuery("");
    onClose();
  };

  return (
    <div
      id="global-search-overlay"
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 pt-[10vh] px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        id="global-search-modal"
        className="w-full max-w-2xl overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900 transition-all duration-300 transform scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center border-b border-neutral-200 p-4 dark:border-neutral-800">
          <Search className="h-5 w-5 text-neutral-400 dark:text-neutral-500" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquise por eventos, notícias, desafios, versículos..."
            className="ml-3 flex-1 bg-transparent text-sm font-medium text-neutral-800 outline-none placeholder-neutral-400 dark:text-neutral-100 dark:placeholder-neutral-500"
          />
          <kbd className="hidden sm:inline-block rounded border border-neutral-200 bg-neutral-100 px-1.5 py-0.5 text-[10px] font-mono text-neutral-500 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-400">
            ESC
          </kbd>
          <button
            onClick={onClose}
            className="ml-3 rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4">
          {!query ? (
            <div className="text-center py-8">
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                Digite algo acima para iniciar sua busca inteligente.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-2 max-w-md mx-auto text-left">
                <button
                  onClick={() => handleSelect("Agenda")}
                  className="flex items-center gap-2 rounded-xl border border-neutral-100 bg-neutral-50 p-2.5 hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900/50 dark:hover:bg-neutral-800 transition-all text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                >
                  <Calendar className="h-4 w-4 text-red-500" />
                  <span>Agenda de Eventos</span>
                </button>
                <button
                  onClick={() => handleSelect("Notícias")}
                  className="flex items-center gap-2 rounded-xl border border-neutral-100 bg-neutral-50 p-2.5 hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900/50 dark:hover:bg-neutral-800 transition-all text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                >
                  <FileText className="h-4 w-4 text-amber-500" />
                  <span>Notícias do Grupo</span>
                </button>
                <button
                  onClick={() => handleSelect("Desafio Jovem")}
                  className="flex items-center gap-2 rounded-xl border border-neutral-100 bg-neutral-50 p-2.5 hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900/50 dark:hover:bg-neutral-800 transition-all text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                >
                  <Award className="h-4 w-4 text-emerald-500" />
                  <span>Desafios & Ranking</span>
                </button>
                <button
                  onClick={() => handleSelect("Sobre")}
                  className="flex items-center gap-2 rounded-xl border border-neutral-100 bg-neutral-50 p-2.5 hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900/50 dark:hover:bg-neutral-800 transition-all text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                >
                  <Book className="h-4 w-4 text-purple-500" />
                  <span>Nossa História</span>
                </button>
              </div>
            </div>
          ) : totalResults === 0 ? (
            <div className="text-center py-8">
              <HelpCircle className="mx-auto h-8 w-8 text-neutral-400 dark:text-neutral-600 mb-2" />
              <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                Nenhum resultado encontrado
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Não encontramos correspondências para "{query}". Tente outras palavras-chave.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Versículo Match */}
              {isVerseMatch && (
                <div>
                  <h3 className="mb-2 text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                    Versículo Correspondente
                  </h3>
                  <div
                    onClick={() => handleSelect("Home")}
                    className="group flex cursor-pointer items-start justify-between rounded-xl border border-neutral-100 bg-neutral-50/50 p-3 hover:bg-red-50/40 dark:border-neutral-800 dark:bg-neutral-900/30 dark:hover:bg-red-950/10 transition-all"
                  >
                    <div className="flex gap-3">
                      <div className="mt-0.5 rounded-lg bg-red-100 p-1.5 text-red-600 dark:bg-red-950/40 dark:text-red-400">
                        <Book className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs italic text-neutral-600 dark:text-neutral-300 line-clamp-2">
                          "{verse.text}"
                        </p>
                        <p className="mt-1 text-[10px] font-bold text-neutral-400 dark:text-neutral-500">
                          {verse.reference} — {verse.translation}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-neutral-400 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              )}

              {/* Eventos Match */}
              {filteredEvents.length > 0 && (
                <div>
                  <h3 className="mb-2 text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                    Eventos da Agenda ({filteredEvents.length})
                  </h3>
                  <div className="space-y-1.5">
                    {filteredEvents.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleSelect("Agenda", item.id)}
                        className="group flex cursor-pointer items-center justify-between rounded-xl border border-transparent p-2.5 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-red-100/60 p-2 text-red-600 dark:bg-red-950/40 dark:text-red-400">
                            <Calendar className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                              {item.title}
                            </p>
                            <p className="text-[10px] text-neutral-400 dark:text-neutral-500">
                              {item.date} às {item.time} — {item.address}
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-neutral-400 transition-transform group-hover:translate-x-1" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notícias Match */}
              {filteredNews.length > 0 && (
                <div>
                  <h3 className="mb-2 text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                    Notícias & Artigos ({filteredNews.length})
                  </h3>
                  <div className="space-y-1.5">
                    {filteredNews.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleSelect("Notícias", item.id)}
                        className="group flex cursor-pointer items-center justify-between rounded-xl border border-transparent p-2.5 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-amber-100/60 p-2 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                            <FileText className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                              {item.title}
                            </p>
                            <p className="text-[10px] text-neutral-400 dark:text-neutral-500">
                              Escrito por {item.author} em {item.date} — {item.category}
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-neutral-400 transition-transform group-hover:translate-x-1" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Desafios Match */}
              {filteredChallenges.length > 0 && (
                <div>
                  <h3 className="mb-2 text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                    Desafios Recentes ({filteredChallenges.length})
                  </h3>
                  <div className="space-y-1.5">
                    {filteredChallenges.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleSelect("Desafio Jovem", item.id)}
                        className="group flex cursor-pointer items-center justify-between rounded-xl border border-transparent p-2.5 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-emerald-100/60 p-2 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                            <Award className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                              {item.title}
                            </p>
                            <p className="text-[10px] text-neutral-400 dark:text-neutral-500">
                              Pontos: <span className="font-bold text-emerald-600 dark:text-emerald-400">{item.points}</span> — Prêmio: {item.prize}
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-neutral-400 transition-transform group-hover:translate-x-1" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="border-t border-neutral-100 bg-neutral-50 p-3 text-center dark:border-neutral-800 dark:bg-neutral-900/50">
          <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-medium">
            Pressione <span className="font-bold">ESC</span> para fechar. Dica: Pesquise termos como "Bíblia", "Célula" ou "Acampamento".
          </p>
        </div>
      </div>
    </div>
  );
}

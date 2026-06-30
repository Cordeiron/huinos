/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Search, Heart, MessageSquare, Share2, ArrowLeft, Send, Sparkles, AlertCircle, FileText } from "lucide-react";
import { NewsItem, UserProfile } from "../types";

interface NewsViewProps {
  news: NewsItem[];
  activeUser: UserProfile;
  onLikeNews: (id: string) => void;
  onCommentNews: (id: string, commentText: string) => void;
  initiallySelectedNewsId?: string;
  onClearSelectedNewsId?: () => void;
}

export default function NewsView({
  news,
  activeUser,
  onLikeNews,
  onCommentNews,
  initiallySelectedNewsId,
  onClearSelectedNewsId
}: NewsViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const categories = ["Todos", "Geral", "Avisos", "Acampamento", "Espiritual", "Eventos"];

  // Respond to global search item click
  useEffect(() => {
    if (initiallySelectedNewsId) {
      setSelectedNewsId(initiallySelectedNewsId);
    }
  }, [initiallySelectedNewsId]);

  const handleBackToGrid = () => {
    setSelectedNewsId(null);
    if (onClearSelectedNewsId) onClearSelectedNewsId();
  };

  const activeArticle = news.find((item) => item.id === selectedNewsId);

  // Filter lists based on search & category
  const filteredArticles = news.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "Todos" || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleShare = (article: NewsItem) => {
    const text = `Confira esse artigo incrível do grupo HUIOS: ${article.title}`;
    navigator.clipboard.writeText(`${window.location.origin}/?news=${article.id}`);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !selectedNewsId) return;
    onCommentNews(selectedNewsId, newComment);
    setNewComment("");
  };

  return (
    <div id="news-view-container" className="space-y-8 pb-16">
      {/* Article Detail View */}
      {activeArticle ? (
        <div className="space-y-6 max-w-3xl mx-auto text-left">
          <button
            onClick={handleBackToGrid}
            className="flex items-center gap-2 text-xs font-bold text-neutral-500 hover:text-red-600 dark:text-neutral-400 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar para Artigos</span>
          </button>

          <div className="space-y-4">
            <span className="inline-block rounded-md bg-red-100 dark:bg-red-950/40 px-2.5 py-0.5 text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
              {activeArticle.category}
            </span>
            <h2 className="font-display text-2xl md:text-4xl font-extrabold text-neutral-800 dark:text-white leading-tight">
              {activeArticle.title}
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
              {activeArticle.subtitle}
            </p>

            <div className="flex items-center gap-4 py-2 border-y border-neutral-100 dark:border-neutral-800">
              <div className="h-10 w-10 rounded-full bg-red-600/10 flex items-center justify-center font-display text-xs font-bold text-red-600 border border-red-200">
                {activeArticle.author.substring(0, 2).toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">{activeArticle.author}</p>
                <p className="text-[10px] text-neutral-400">{activeArticle.authorRole} • {activeArticle.date}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onLikeNews(activeArticle.id)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    activeArticle.likedBy.includes(activeUser.id)
                      ? "bg-red-50 text-red-600 border border-red-200/50 dark:bg-red-950/20 dark:border-red-900/30"
                      : "bg-neutral-50 border border-neutral-200 text-neutral-500 dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-300"
                  }`}
                >
                  <Heart className={`h-4 w-4 ${activeArticle.likedBy.includes(activeUser.id) ? "fill-red-600 text-red-600" : ""}`} />
                  <span>{activeArticle.likes}</span>
                </button>
                <button
                  onClick={() => handleShare(activeArticle)}
                  className="flex items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 p-2 text-neutral-500 dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-300 hover:bg-neutral-100"
                >
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Cover image */}
          <div className="rounded-2xl overflow-hidden aspect-video bg-neutral-100 shadow-sm border border-neutral-100 dark:border-neutral-800">
            <img src={activeArticle.coverImage} alt={activeArticle.title} className="w-full h-full object-cover" />
          </div>

          {/* Formatted Text Content */}
          <article className="prose dark:prose-invert max-w-none text-xs md:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed space-y-4">
            {activeArticle.content.split("\n\n").map((p, idx) => {
              if (p.startsWith("* ") || p.startsWith("1. ")) {
                return (
                  <ul key={idx} className="list-disc pl-5 space-y-1">
                    {p.split("\n").map((li, i) => (
                      <li key={i}>{li.replace(/^(\*\s|1\.\s|\d+\.\s)/, "")}</li>
                    ))}
                  </ul>
                );
              }
              return <p key={idx}>{p}</p>;
            })}
          </article>

          {/* Sharing Status Tooltip */}
          {isCopied && (
            <div className="flex items-center gap-2 bg-neutral-900 text-white rounded-xl py-2.5 px-4 text-xs font-bold fixed bottom-10 left-1/2 -translate-x-1/2 shadow-xl z-50">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span>Link copiado com sucesso!</span>
            </div>
          )}

          {/* Comments Panel */}
          <div className="border-t border-neutral-100 pt-8 dark:border-neutral-800 space-y-6">
            <h3 className="font-display text-sm font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-red-600" />
              <span>Comentários ({activeArticle.comments.length})</span>
            </h3>

            {/* Post comment form */}
            <form onSubmit={handleCommentSubmit} className="flex gap-3">
              <img
                src={activeUser.avatarUrl}
                alt={activeUser.name}
                className="h-9 w-9 rounded-full object-cover shrink-0"
              />
              <div className="flex-1 relative flex items-center">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Deixe uma palavra de encorajamento ou dúvida..."
                  className="w-full py-2 pl-3 pr-10 text-xs bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 rounded-xl outline-none text-neutral-800 dark:text-neutral-100 focus:border-red-600"
                />
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="absolute right-2 text-neutral-400 hover:text-red-600 disabled:opacity-50 transition-colors"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>

            {/* Comments list */}
            <div className="space-y-3.5">
              {activeArticle.comments.length === 0 ? (
                <div className="text-center py-6 border border-dashed border-neutral-100 rounded-xl dark:border-neutral-800">
                  <p className="text-[10px] text-neutral-400 italic">Nenhum comentário por enquanto. Seja o primeiro a edificar!</p>
                </div>
              ) : (
                activeArticle.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <img
                      src={comment.userAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=50"}
                      alt={comment.userName}
                      className="h-8 w-8 rounded-full object-cover shrink-0"
                    />
                    <div className="flex-1 rounded-xl bg-neutral-50 dark:bg-neutral-900/40 p-3 border border-neutral-100/50 dark:border-neutral-800/50">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-display text-[10px] font-bold text-neutral-800 dark:text-neutral-200">{comment.userName}</span>
                        <span className="text-[8px] text-neutral-400">{comment.date}</span>
                      </div>
                      <p className="text-[11px] text-neutral-600 dark:text-neutral-300 leading-normal">{comment.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : (
        /* News Grid View */
        <div className="space-y-8">
          {/* Section title */}
          <section className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-red-600/10 px-3 py-1 border border-red-500/10 text-xs font-bold text-red-600">
              <FileText className="h-3.5 w-3.5 animate-pulse" />
              <span>PORTAL DE CONTEÚDO</span>
            </div>
            <h2 className="font-display text-2xl md:text-4xl font-black text-neutral-800 dark:text-white">
              Notícias, Avisos e Artigos
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Mantenha-se atualizado sobre comunicados importantes, escalas, retiros e artigos pastorais inspiradores.
            </p>
          </section>

          {/* Search and Category Filters */}
          <section className="flex flex-col md:flex-row gap-4 items-center justify-between bg-neutral-50 dark:bg-neutral-900/40 p-4 rounded-2xl border border-neutral-100 dark:border-neutral-800">
            <div className="relative w-full md:max-w-xs flex items-center">
              <Search className="absolute left-3 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar notícias ou avisos..."
                className="pl-9 pr-4 py-2 w-full text-xs font-medium bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl outline-none text-neutral-800 dark:text-neutral-100 focus:border-red-600"
              />
            </div>

            <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    selectedCategory === cat
                      ? "bg-red-600 text-white shadow-sm"
                      : "bg-white border border-neutral-200 text-neutral-600 dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-300 hover:bg-neutral-50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </section>

          {/* Articles Grid */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredArticles.length === 0 ? (
              <div className="col-span-1 md:col-span-3 text-center py-16 rounded-3xl border border-dashed border-neutral-200 dark:border-neutral-800">
                <AlertCircle className="mx-auto h-8 w-8 text-neutral-400 mb-2" />
                <p className="text-xs text-neutral-400 font-medium">Nenhum artigo encontrado correspondente aos filtros.</p>
              </div>
            ) : (
              filteredArticles.map((article) => (
                <div
                  key={article.id}
                  onClick={() => setSelectedNewsId(article.id)}
                  className="group flex flex-col justify-between rounded-2xl border border-neutral-100 bg-white shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer dark:border-neutral-800 dark:bg-neutral-900/40 overflow-hidden text-left"
                >
                  <div className="relative h-48 overflow-hidden bg-neutral-100 shrink-0">
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="rounded-md bg-red-600 px-2 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider">
                        {article.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-display text-sm font-bold text-neutral-800 dark:text-neutral-100 line-clamp-1 group-hover:text-red-600 transition-colors">
                        {article.title}
                      </h4>
                      <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-1">
                        Por {article.author} em {article.date}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-3 line-clamp-3 leading-relaxed font-light">
                        {article.subtitle}
                      </p>
                    </div>

                    <div className="mt-5 border-t border-neutral-50 pt-3 flex items-center justify-between text-[10px] text-neutral-400 dark:border-neutral-800">
                      <span className="flex items-center gap-1">
                        <Heart className="h-3.5 w-3.5 text-red-500" /> {article.likes} curtidas
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3.5 w-3.5 text-neutral-400" /> {article.comments.length} comentários
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </section>
        </div>
      )}
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { ArrowRight, Calendar, Heart, ShieldAlert, Award, ChevronRight, Volume2, Share2, Sparkles } from "lucide-react";
import { EventItem, NewsItem, VerseOfTheWeek } from "../types";

interface HomeViewProps {
  events: EventItem[];
  news: NewsItem[];
  verse: VerseOfTheWeek;
  onNavigateTo: (view: string, itemId?: string) => void;
  bannerImage: string;
}

export default function HomeView({ events, news, verse, onNavigateTo, bannerImage }: HomeViewProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [nextEvent, setNextEvent] = useState<EventItem | null>(null);

  // Determine the next event chronologically and run the countdown
  useEffect(() => {
    const activeEvents = [...events].filter(e => new Date(`${e.date}T${e.time}`) > new Date());
    activeEvents.sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());
    
    const target = activeEvents[0] || events[0]; // fallback to first event if all in past
    setNextEvent(target);

    if (!target) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const eventTime = new Date(`${target.date}T${target.time}`).getTime();
      let diff = eventTime - now;

      if (diff < 0) {
        // If event is past, calculate countdown to next week same time
        diff = diff + 7 * 24 * 60 * 60 * 1000;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, [events]);

  const latestArticles = news.slice(0, 2);

  return (
    <div id="home-view-container" className="space-y-6 pb-16">
      {/* Bento Grid Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* 1. Banner Principal / Welcome (col-span-8) */}
        <div className="lg:col-span-8 bg-gradient-to-br from-[#2D2D2D] via-[#1B1B1B] to-[#141414] rounded-3xl p-8 md:p-10 flex flex-col justify-center border border-white/5 relative overflow-hidden min-h-[360px] lg:min-h-[400px]">
          <div className="absolute inset-0 bg-radial-at-t from-[#C62828]/10 via-transparent to-transparent pointer-events-none" />
          <img
            src={bannerImage}
            alt="HUIOS Banner"
            className="absolute inset-0 h-full w-full object-cover opacity-15 mix-blend-luminosity scale-100 transition-all duration-700 hover:scale-[1.03] pointer-events-none"
          />
          <div className="relative z-10 space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#C62828]/15 px-3 py-1 border border-[#C62828]/20 text-[10px] font-bold text-red-500 tracking-wider">
              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
              <span>CRESCIMENTO ESPIRITUAL • FRUTOS • EXCELÊNCIA</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-black text-white leading-tight tracking-tight">
              Crescimento Espiritual e <span className="text-[#C62828]">Excelência</span>.
            </h1>
            <p className="text-neutral-400 text-sm md:text-base font-light max-w-lg leading-relaxed">
              Seja bem-vindo ao portal HUIOS. Aqui construímos raízes profundas em Cristo para colher frutos consistentes e duradouros de vida.
            </p>
            <div className="flex flex-wrap gap-3 pt-4">
              <button
                onClick={() => onNavigateTo("Agenda")}
                className="flex items-center gap-2 rounded-xl bg-[#C62828] px-5 py-2.5 text-xs font-bold text-white transition-all duration-300 hover:bg-red-700 hover:shadow-lg hover:shadow-red-900/20"
              >
                <Calendar className="h-4 w-4" />
                <span>Próximos Encontros</span>
              </button>
              <button
                onClick={() => onNavigateTo("Pedidos de Oração")}
                className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-5 py-2.5 text-xs font-bold text-white transition-all duration-300 hover:bg-white/10"
              >
                <Heart className="h-4 w-4 text-[#C62828]" />
                <span>Pedir Oração</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2. Próximo Encontro (Countdown) (col-span-4) */}
        <div className="lg:col-span-4 bg-[#C62828] rounded-3xl p-8 flex flex-col justify-between shadow-2xl shadow-red-950/40 text-white min-h-[360px] lg:min-h-[400px]">
          <div>
            <p className="text-white/80 text-[10px] font-bold uppercase tracking-widest mb-1">Próximo Encontro</p>
            <h2 className="font-display text-3xl font-black tracking-tight truncate max-w-full">
              {nextEvent ? nextEvent.title : "HUIOS Night"}
            </h2>
            <p className="text-[11px] text-white/70 mt-1 uppercase tracking-wider font-mono">
              {nextEvent ? `${nextEvent.date} às ${nextEvent.time}` : "Sábado das Nações"}
            </p>
          </div>

          <div className="my-6 flex gap-4 items-end justify-center">
            <div className="text-center flex-1">
              <div className="text-4xl font-black font-mono tracking-tighter">{timeLeft.days}</div>
              <div className="text-[9px] uppercase font-bold text-white/70 mt-0.5">Dias</div>
            </div>
            <div className="text-4xl font-light opacity-50 mb-3">:</div>
            <div className="text-center flex-1">
              <div className="text-4xl font-black font-mono tracking-tighter">{timeLeft.hours}</div>
              <div className="text-[9px] uppercase font-bold text-white/70 mt-0.5">Horas</div>
            </div>
            <div className="text-4xl font-light opacity-50 mb-3">:</div>
            <div className="text-center flex-1">
              <div className="text-4xl font-black font-mono tracking-tighter">{timeLeft.minutes}</div>
              <div className="text-[9px] uppercase font-bold text-white/70 mt-0.5">Min</div>
            </div>
          </div>

          <button
            onClick={() => onNavigateTo("Agenda")}
            className="w-full py-3 bg-white text-[#C62828] rounded-xl font-bold text-xs uppercase tracking-wider transition-all hover:bg-neutral-50 hover:shadow-lg"
          >
            Confirmar Presença
          </button>
        </div>

        {/* 3. Versículo da Semana (col-span-4) - Stand-out crisp white card with black text */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-8 flex flex-col justify-between border border-gray-200/80 shadow-md text-[#1B1B1B] min-h-[280px]">
          <div className="text-[#C62828] mb-4">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21L14.017 18C14.017 16.8954 13.1216 16 12.017 16C10.9124 16 10.017 16.8954 10.017 18L10.017 21H4.017V3H20.017V21H14.017ZM12.017 5C10.3601 5 9.017 6.34315 9.017 8C9.017 9.65685 10.3601 11 12.017 11C13.6738 11 15.017 9.65685 15.017 8C15.017 6.34315 13.6738 5 12.017 5Z"/>
            </svg>
          </div>
          <p className="font-display text-lg md:text-xl font-semibold italic text-[#1B1B1B] leading-relaxed flex-grow">
            "{verse.text}"
          </p>
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-gray-500 font-bold uppercase text-xs tracking-tighter">{verse.reference}</p>
            <p className="text-[9px] text-gray-400 font-mono tracking-wider">{verse.translation}</p>
          </div>
        </div>

        {/* 4. Three Pillars inside a sleek bento span-8 block */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col justify-between rounded-3xl border border-white/5 bg-[#252525] p-6 text-left">
            <div className="p-3 bg-[#C62828]/10 rounded-xl text-[#C62828] w-fit">
              <Volume2 className="h-5 w-5" />
            </div>
            <div className="mt-6">
              <h3 className="font-display font-bold text-white text-sm">Comunidade Prática</h3>
              <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed font-light">
                Células semanais nas casas para acolhimento, partilhas sinceras e oração com amigos de verdade.
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-3xl border border-white/5 bg-[#252525] p-6 text-left">
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500 w-fit">
              <Award className="h-5 w-5" />
            </div>
            <div className="mt-6">
              <h3 className="font-display font-bold text-white text-sm">Desafio Jovem</h3>
              <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed font-light">
                Leitura diária e ações práticas semanais que geram medalhas, conquistas e pontos de engajamento.
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-3xl border border-white/5 bg-[#252525] p-6 text-left">
            <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-500 w-fit">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div className="mt-6">
              <h3 className="font-display font-bold text-white text-sm">Liderança HUIOS</h3>
              <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed font-light">
                Pastores e líderes de célula capacitados para mentorias sérias e discipulado bíblico.
              </p>
            </div>
          </div>
        </div>

        {/* 5. Sua Célula / Informativos (col-span-4) */}
        <div className="lg:col-span-4 bg-gradient-to-tr from-[#1B1B1B] to-[#252525] rounded-3xl p-6 border border-white/5 flex flex-col justify-between min-h-[300px]">
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest">Sua Célula</h4>
                <p className="font-display text-xl font-black text-white mt-0.5">Célula Kairós</p>
              </div>
              <div className="p-2 bg-white/5 rounded-lg text-[#C62828]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeWidth="2"/>
                </svg>
              </div>
            </div>
            <div className="space-y-2 mt-4 text-xs text-neutral-400">
              <p className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C62828]" /> Quinta-feira, às 19:30
              </p>
              <p className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C62828]" /> Av. das Palmeiras, 450
              </p>
            </div>
          </div>
          <div className="mt-6">
            <div className="flex -space-x-2 mb-4">
              <div className="w-7 h-7 rounded-full border border-neutral-900 bg-neutral-600 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" className="object-cover h-full w-full" alt="" />
              </div>
              <div className="w-7 h-7 rounded-full border border-neutral-900 bg-neutral-500 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" className="object-cover h-full w-full" alt="" />
              </div>
              <div className="w-7 h-7 rounded-full border border-neutral-900 bg-neutral-700 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=100" className="object-cover h-full w-full" alt="" />
              </div>
              <div className="w-7 h-7 rounded-full border border-neutral-900 bg-[#C62828] flex items-center justify-center text-[9px] font-black text-white">
                +12
              </div>
            </div>
            <button
              onClick={() => onNavigateTo("Agenda")}
              className="w-full flex items-center justify-center gap-1 w-full rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-neutral-300 py-2.5 hover:bg-white/10"
            >
              <span>Localizar Célula</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* 6. Latest News (col-span-5) */}
        <div className="lg:col-span-5 bg-[#252525] rounded-3xl p-6 border border-white/5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400">
                📢 Últimas Novidades
              </span>
              <button
                onClick={() => onNavigateTo("Notícias")}
                className="text-xs font-bold text-red-500 hover:underline flex items-center gap-0.5"
              >
                <span>Ver todas</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="space-y-3.5">
              {latestArticles.map((article) => (
                <div
                  key={article.id}
                  onClick={() => onNavigateTo("Notícias", article.id)}
                  className="flex items-start gap-3 rounded-2xl border border-white/5 bg-[#1B1B1B] p-3 shadow-sm hover:bg-neutral-800 transition-all cursor-pointer"
                >
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="h-14 w-20 rounded-xl object-cover bg-neutral-900 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="inline-block rounded bg-[#C62828]/10 px-2 py-0.5 text-[8px] font-bold text-red-400 uppercase">
                      {article.category}
                    </span>
                    <h4 className="font-display text-xs font-bold text-white mt-1 line-clamp-1">
                      {article.title}
                    </h4>
                    <p className="text-[10px] text-neutral-400 mt-0.5 line-clamp-1">
                      {article.subtitle}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <button
              onClick={() => onNavigateTo("Desafio Jovem")}
              className="w-full rounded-2xl bg-gradient-to-r from-[#C62828] to-rose-700 px-4 py-2.5 text-xs font-bold text-white text-center hover:opacity-95"
            >
              🏆 Desafios Ativos
            </button>
          </div>
        </div>

        {/* 7. Pedidos de Oração / Em Oração (col-span-3) */}
        <div className="lg:col-span-3 bg-[#333333] rounded-3xl p-6 border border-white/5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-1.5">
              <span>🙏 Em Oração</span>
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-[#1B1B1B] rounded-2xl border border-white/5">
                <p className="text-[10px] text-[#C62828] font-bold mb-0.5">Anônimo</p>
                <p className="text-xs text-neutral-300 line-clamp-3 italic font-light leading-relaxed">
                  "Peço oração pela saúde da minha família e por direcionamento profissional..."
                </p>
                <div className="mt-2.5 flex items-center justify-between text-[8px] text-neutral-500 font-mono">
                  <span>2h atrás</span>
                  <span className="bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded uppercase">Intercedendo</span>
                </div>
              </div>

              <div className="p-3 bg-[#1B1B1B] rounded-2xl border border-white/5">
                <p className="text-[10px] text-[#C62828] font-bold mb-0.5">Gabriel M.</p>
                <p className="text-xs text-neutral-300 line-clamp-3 italic font-light leading-relaxed">
                  "Agradecimento pela aprovação no vestibular e pedido de sabedoria."
                </p>
                <div className="mt-2.5 flex items-center justify-between text-[8px] text-neutral-500 font-mono">
                  <span>Ontem</span>
                  <span className="bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded uppercase">Respondido</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateTo("Pedidos de Oração")}
            className="mt-4 w-full py-2.5 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-wider text-white hover:bg-white/5 transition-all"
          >
            Enviar Pedido
          </button>
        </div>

      </div>
    </div>
  );
}

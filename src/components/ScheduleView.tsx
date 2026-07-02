/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Search, Calendar, MapPin, User, ChevronRight, Sparkles, Filter, ExternalLink, CalendarPlus } from "lucide-react";
import { EventItem } from "../types";

interface ScheduleViewProps {
  events: EventItem[];
}

export default function ScheduleView({ events }: ScheduleViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");

  const todayStr = new Date().toISOString().split("T")[0];
  const upcomingEvents = events.filter((e) => e.date >= todayStr);

  const [activeEventId, setActiveEventId] = useState<string>(upcomingEvents[0]?.id || "");

  const categories = ["Todos", "Culto", "Célula", "Conferência", "Reunião"];

  // Filter events based on search and category
  const filteredEvents = upcomingEvents.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.address.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "Todos" || e.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const activeEvent = upcomingEvents.find((e) => e.id === activeEventId) || filteredEvents[0];

  // Helper to generate real Google Calendar link
  const generateGoogleCalendarUrl = (item: EventItem) => {
    const title = encodeURIComponent(item.title);
    const description = encodeURIComponent(item.description + `\n\nResponsável: ${item.responsible}`);
    const location = encodeURIComponent(item.address);
    
    // Format YYYYMMDD
    const dateClean = item.date.replace(/-/g, "");
    const timeClean = item.time.replace(/:/g, "");
    
    // Estimate end time as 2 hours later
    const startHour = parseInt(item.time.split(":")[0]);
    const endHour = (startHour + 2) % 24;
    const endHourStr = endHour.toString().padStart(2, "0");
    const endMinute = item.time.split(":")[1];
    
    const dates = `${dateClean}T${timeClean}00/${dateClean}T${endHourStr}${endMinute}00`;
    
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${description}&location=${location}`;
  };

  return (
    <div id="schedule-view-container" className="space-y-8 pb-16">
      {/* Header section */}
      <section className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-red-600/10 px-3 py-1 border border-red-500/10 text-xs font-bold text-red-600">
          <Calendar className="h-3.5 w-3.5 animate-pulse" />
          <span>AGENDA DE ENCONTROS</span>
        </div>
        <h2 className="font-display text-2xl md:text-4xl font-black text-neutral-800 dark:text-white">
          Cronograma HUIOS & Eventos
        </h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Não caminhe sozinho! Participe das nossas programações, cultos gerais, conferências de ativação e reuniões de discipulado.
        </p>
      </section>

      {/* Search and category filters */}
      <section className="flex flex-col md:flex-row gap-4 items-center justify-between bg-neutral-50 dark:bg-neutral-900/40 p-4 rounded-2xl border border-neutral-100 dark:border-neutral-800">
        <div className="relative w-full md:max-w-xs flex items-center">
          <Search className="absolute left-3 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquise por palavra-chave..."
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

      {/* Main split display: Events list on the left, Active details & map on the right */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Events list */}
        <div className="lg:col-span-6 space-y-3 max-h-[600px] overflow-y-auto pr-2">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12 rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800">
              <p className="text-xs text-neutral-400 font-medium">Nenhum evento corresponde aos seus filtros de pesquisa.</p>
            </div>
          ) : (
            filteredEvents.map((item) => {
              const isSelected = activeEvent?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setActiveEventId(item.id)}
                  className={`group rounded-2xl border p-4 cursor-pointer text-left transition-all duration-300 ${
                    isSelected
                      ? "bg-red-50/50 border-red-200/60 dark:bg-red-950/10 dark:border-red-900/30 shadow-sm"
                      : "bg-white border-neutral-100 dark:bg-neutral-900/40 dark:border-neutral-800 hover:border-neutral-200"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`rounded-xl px-3 py-2.5 text-center shrink-0 flex flex-col justify-center min-w-[56px] transition-colors ${
                      isSelected ? "bg-red-600 text-white" : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300"
                    }`}>
                      <span className="block text-[10px] uppercase font-bold tracking-wider leading-none">
                        {new Date(`${item.date}T00:00:00`).toLocaleDateString("pt-BR", { month: "short" })}
                      </span>
                      <span className="block text-lg font-black mt-0.5 leading-none">
                        {item.date.split("-")[2]}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <span className={`inline-block rounded-md px-2 py-0.5 text-[9px] font-bold uppercase ${
                        isSelected ? "bg-red-600/15 text-red-600 dark:bg-red-950/30" : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500"
                      }`}>
                        {item.category}
                      </span>
                      <h4 className="font-display text-xs font-bold text-neutral-800 dark:text-neutral-200 mt-1 line-clamp-1">
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-1 line-clamp-2">
                        {item.description}
                      </p>
                      
                      <div className="mt-3 flex items-center gap-4 text-[9px] text-neutral-400">
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3 text-red-600" /> {item.address.split(",")[0]}</span>
                        <span className="flex items-center gap-1"><User className="h-3 w-3 text-red-600" /> Discente: {item.responsible}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Event Details & Maps */}
        {activeEvent && (
          <div className="lg:col-span-6 rounded-3xl border border-neutral-100 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50 space-y-6">
            {activeEvent.imageUrl && (
              <img
                src={activeEvent.imageUrl}
                alt={activeEvent.title}
                className="w-full h-44 rounded-2xl object-cover bg-neutral-100"
              />
            )}

            <div className="space-y-2 text-left">
              <span className="inline-block rounded-md bg-red-100 dark:bg-red-950/40 px-2 py-0.5 text-[9px] font-bold text-red-600 dark:text-red-400 uppercase">
                {activeEvent.category}
              </span>
              <h3 className="font-display text-base md:text-lg font-bold text-neutral-800 dark:text-neutral-100">
                {activeEvent.title}
              </h3>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed font-light">
                {activeEvent.description}
              </p>
            </div>

            <div className="space-y-3 border-t border-neutral-100 pt-4 text-left text-xs text-neutral-500 dark:border-neutral-800">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-red-600 shrink-0" />
                <div>
                  <span className="block font-semibold text-neutral-700 dark:text-neutral-300">Data e Horário</span>
                  <span className="text-[10px]">{activeEvent.date} às {activeEvent.time}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-red-600 shrink-0" />
                <div>
                  <span className="block font-semibold text-neutral-700 dark:text-neutral-300">Endereço Completo</span>
                  <span className="text-[10px] leading-normal">{activeEvent.address}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-red-600 shrink-0" />
                <div>
                  <span className="block font-semibold text-neutral-700 dark:text-neutral-300">Responsável pelo Evento</span>
                  <span className="text-[10px]">{activeEvent.responsible}</span>
                </div>
              </div>
            </div>

            {/* Google Calendar real Integration */}
            <a
              href={generateGoogleCalendarUrl(activeEvent)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full rounded-xl bg-neutral-900 text-white text-xs font-bold py-2.5 shadow-sm transition-all hover:bg-neutral-800 hover:-translate-y-0.5"
            >
              <CalendarPlus className="h-4 w-4 text-red-500" />
              <span>Adicionar ao Google Agenda</span>
              <ExternalLink className="h-3 w-3 opacity-60" />
            </a>

            {/* Embedded interactive styled Map */}
            {activeEvent.mapEmbedUrl ? (
              <div className="rounded-2xl overflow-hidden border border-neutral-100 dark:border-neutral-800 h-48 bg-neutral-100 shadow-inner">
                <iframe
                  title="Localização do Evento"
                  src={activeEvent.mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            ) : (
              <div className="rounded-2xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/30 p-4 text-center text-[10px] text-neutral-400">
                Sem mapa disponível para este endereço interno.
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

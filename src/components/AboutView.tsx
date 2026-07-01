/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Sparkles, Heart, Shield, Target, Eye, Plus, Trash2, Edit2, Check, X, Camera, Image } from "lucide-react";
import { api } from "../lib/api";
import { UserRole } from "../types";

interface AboutViewProps {
  currentRole: string;
}

export default function AboutView({ currentRole }: AboutViewProps) {
  const [leaders, setLeaders] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit states
  const [isEditingLeaders, setIsEditingLeaders] = useState(false);
  const [editableLeaders, setEditableLeaders] = useState<any[]>([]);

  const [isEditingGallery, setIsEditingGallery] = useState(false);
  const [editableGallery, setEditableGallery] = useState<any[]>([]);

  const values = [
    {
      icon: Target,
      title: "Missão",
      text: "Evangelizar e discipular jovens, inserindo-os em uma comunidade ativa e saudável, capacitando-os a frutificar em todas as esferas da sociedade com integridade e excelência cristã."
    },
    {
      icon: Eye,
      title: "Visão",
      text: "Ser um referencial de juventude cristã vibrante, espiritualmente madura e tecnologicamente integrada, impactando a cidade através de células multiplicadoras e engajamento social ativo."
    },
    {
      icon: Shield,
      title: "Valores",
      text: "Fidelidade às Escrituras, excelência em tudo o que fazemos, amor prático e intencional, honra à liderança, autenticidade e comunhão transparente nas relações diárias."
    }
  ];

  const loadAboutData = async () => {
    try {
      setLoading(true);
      const data = await api.getAbout();
      setLeaders(data.leaders || []);
      setGallery(data.gallery || []);
    } catch (err: any) {
      console.error(err);
      setError("Erro ao carregar dados do servidor. Exibindo dados locais de backup.");
      // Fallback fallback static data
      setLeaders([
        {
          name: "Pr. Daniel Lemos",
          role: "Pastor Geral de Jovens",
          bio: "Bacharel em Teologia pelo Seminário Bíblico Nacional, apaixonado por discipulado de jovens e mentoria de novas lideranças na igreja local.",
          image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300"
        },
        {
          name: "Gabriel Santos",
          role: "Coordenador de Células & Social",
          bio: "Formado em Administração, gerencia as células HUIOS e lidera as frentes de apoio social em comunidades carentes de São Paulo.",
          image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300"
        },
        {
          name: "Beatriz Oliveira",
          role: "Líder de Comunicação & Mídia",
          bio: "Designer de Produto com foco em interfaces digitais. Responsável por garantir a excelência visual e a identidade premium das mídias HUIOS.",
          image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300"
        }
      ]);
      setGallery([
        { title: "Culto Start HUIOS", url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=400" },
        { title: "Comunhão nas Casas", url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=400" },
        { title: "Ação Social HUIOS", url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=400" },
        { title: "Gincana e Integração", url: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=400" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAboutData();
  }, []);

  const startEditingLeaders = () => {
    setEditableLeaders([...leaders]);
    setIsEditingLeaders(true);
  };

  const startEditingGallery = () => {
    setEditableGallery([...gallery]);
    setIsEditingGallery(true);
  };

  const handleSaveLeaders = async () => {
    try {
      await api.updateAbout({ leaders: editableLeaders });
      setLeaders(editableLeaders);
      setIsEditingLeaders(false);
    } catch (err: any) {
      alert(err.message || "Erro ao salvar líderes.");
    }
  };

  const handleSaveGallery = async () => {
    try {
      await api.updateAbout({ gallery: editableGallery });
      setGallery(editableGallery);
      setIsEditingGallery(false);
    } catch (err: any) {
      alert(err.message || "Erro ao salvar galeria.");
    }
  };

  const handleAddLeader = () => {
    setEditableLeaders([
      ...editableLeaders,
      {
        name: "Novo Integrante",
        role: "Líder / Apoio",
        bio: "Biografia resumida...",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300"
      }
    ]);
  };

  const handleRemoveLeader = (index: number) => {
    setEditableLeaders(editableLeaders.filter((_, i) => i !== index));
  };

  const handleLeaderChange = (index: number, field: string, value: string) => {
    const updated = [...editableLeaders];
    updated[index] = { ...updated[index], [field]: value };
    setEditableLeaders(updated);
  };

  const handleAddGalleryItem = () => {
    setEditableGallery([
      ...editableGallery,
      {
        title: "Novo Registro",
        url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=400"
      }
    ]);
  };

  const handleRemoveGalleryItem = (index: number) => {
    setEditableGallery(editableGallery.filter((_, i) => i !== index));
  };

  const handleGalleryChange = (index: number, field: string, value: string) => {
    const updated = [...editableGallery];
    updated[index] = { ...updated[index], [field]: value };
    setEditableGallery(updated);
  };

  const isAdmin = currentRole === UserRole.ADMIN;
  const isLeaderOrAdmin = currentRole === UserRole.ADMIN || currentRole === UserRole.LEADER;

  return (
    <div id="about-view-container" className="space-y-12 pb-16">
      {/* Header Banner Section */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#C62828]/15 px-3 py-1 border border-red-500/20 text-xs font-bold text-red-500">
          <Sparkles className="h-3.5 w-3.5" />
          <span>NOSSA IDENTIDADE</span>
        </div>
        <h2 className="font-display text-3xl md:text-5xl font-black text-neutral-800 dark:text-white">
          A História do Movimento HUIOS
        </h2>
        <p className="text-sm md:text-base text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
          Entenda o significado por trás do nosso nome, nosso chamado espiritual e como nos organizamos para servir a Deus com integridade e paixão contagiante.
        </p>
      </section>

      {/* History Split Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 bg-[#252525] rounded-3xl p-8 border border-white/5 flex flex-col justify-center space-y-5 shadow-lg">
          <h3 className="font-display text-2xl font-black text-white">
            O que significa <span className="text-[#C62828]">HUIOS</span>?
          </h3>
          <p className="text-xs md:text-sm text-neutral-300 leading-relaxed font-light">
            No grego clássico do Novo Testamento, existem duas palavras comuns para descrever um filho: <span className="font-semibold text-white">Téknon</span>, que se refere a um filho por nascimento natural, uma criança que ainda está em desenvolvimento e necessita de tutela constante; e <span className="font-semibold text-[#C62828]">HUIOS</span>, que descreve um filho maduro, posicionado, aquele que cresceu, assumiu a responsabilidade da herança e representa fielmente o caráter de seu pai.
          </p>
          <p className="text-xs md:text-sm text-neutral-300 leading-relaxed font-light">
            Nós escolhemos este nome para marcar o nosso chamado: não queremos ser apenas crianças espirituais oscilando com o vento da cultura secular, mas sim <span className="font-semibold text-white">filhos maduros de Deus</span>. Jovens que entendem sua identidade em Cristo, fincam raízes profundas em solo espiritual fértil e dão frutos dignos e duradouros para a glória do Pai.
          </p>
          <div className="border-l-4 border-[#C62828] pl-4 py-1 italic text-xs text-neutral-400">
            "Porque todos os que são guiados pelo Espírito de Deus, esses são filhos [HUIOS] de Deus." — Romanos 8:14
          </div>
        </div>

        <div className="lg:col-span-5 relative rounded-3xl overflow-hidden shadow-xl min-h-[300px] bg-neutral-900 border border-white/5">
          <img
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800"
            alt="Grupo de jovens orando"
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <p className="text-white text-xs font-bold uppercase tracking-wider font-mono">Unidade & Profundidade</p>
            <p className="text-neutral-300 text-[10px] mt-1 font-light">Encontros focados na busca constante pela excelência.</p>
          </div>
        </div>
      </section>

      {/* Mission Vision Values Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {values.map((v, idx) => {
          const Icon = v.icon;
          return (
            <div
              key={idx}
              className="rounded-3xl border border-white/5 bg-[#252525] p-6 shadow-md hover:-translate-y-1 transition-all duration-300"
            >
              <div className="mb-4 inline-block rounded-2xl bg-[#C62828]/10 p-3.5 text-[#C62828]">
                <Icon className="h-6 w-6" />
              </div>
              <h4 className="font-display text-base font-bold text-white mb-2">
                {v.title}
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed font-light">
                {v.text}
              </p>
            </div>
          );
        })}
      </section>

      {/* Leadership Section */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-neutral-800 pb-4">
          <div className="text-left space-y-1">
            <h3 className="font-display text-xl md:text-3xl font-extrabold text-neutral-800 dark:text-white">
              Nossa Liderança de Apoio
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Líderes de célula e pastores capacitados para guiar o movimento com retidão espiritual e excelência.
            </p>
          </div>
          {isAdmin && (
            <div className="shrink-0">
              {!isEditingLeaders ? (
                <button
                  onClick={startEditingLeaders}
                  className="flex items-center gap-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 text-xs font-bold text-white transition-colors"
                >
                  <Edit2 className="h-4 w-4 text-[#C62828]" />
                  <span>Gerenciar Líderes</span>
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveLeaders}
                    className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-xs font-black text-white transition-colors"
                  >
                    <Check className="h-4 w-4" />
                    <span>Salvar Alterações</span>
                  </button>
                  <button
                    onClick={() => setIsEditingLeaders(false)}
                    className="flex items-center gap-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-2 text-xs font-bold text-white transition-colors"
                  >
                    <X className="h-4 w-4 text-red-500" />
                    <span>Cancelar</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Leaders edit/view layout */}
        {isEditingLeaders ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {editableLeaders.map((leader, index) => (
                <div key={index} className="rounded-3xl border border-[#C62828]/20 bg-[#1F1F1F] p-6 space-y-4 relative">
                  <button
                    onClick={() => handleRemoveLeader(index)}
                    className="absolute top-4 right-4 p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors"
                    title="Remover Líder"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                    <div className="sm:col-span-4 space-y-2">
                      <div className="relative aspect-square rounded-2xl overflow-hidden bg-neutral-900 border border-white/5">
                        <img src={leader.image} alt="" className="w-full h-full object-cover" />
                      </div>
                      <input
                        type="text"
                        value={leader.image}
                        onChange={(e) => handleLeaderChange(index, "image", e.target.value)}
                        placeholder="Link da imagem (Unsplash)"
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-1 text-[10px] text-neutral-300 font-mono"
                      />
                    </div>
                    
                    <div className="sm:col-span-8 space-y-3">
                      <div>
                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">Nome Completo</label>
                        <input
                          type="text"
                          value={leader.name}
                          onChange={(e) => handleLeaderChange(index, "name", e.target.value)}
                          placeholder="Nome do líder"
                          className="w-full bg-black/40 border border-white/10 focus:border-[#C62828] rounded-xl px-3 py-1.5 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">Cargo / Função</label>
                        <input
                          type="text"
                          value={leader.role}
                          onChange={(e) => handleLeaderChange(index, "role", e.target.value)}
                          placeholder="Ex: Pastor Geral, Líder de Comunicação"
                          className="w-full bg-black/40 border border-white/10 focus:border-[#C62828] rounded-xl px-3 py-1.5 text-xs text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">Biografia Resumida</label>
                    <textarea
                      value={leader.bio}
                      onChange={(e) => handleLeaderChange(index, "bio", e.target.value)}
                      placeholder="Fale um pouco sobre o líder e o seu chamado no Huios..."
                      rows={3}
                      className="w-full bg-black/40 border border-white/10 focus:border-[#C62828] rounded-xl px-3 py-2 text-xs text-white resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={handleAddLeader}
              className="flex items-center gap-1.5 rounded-xl border-2 border-dashed border-neutral-800 hover:border-[#C62828]/50 w-full py-4 justify-center text-xs font-bold text-neutral-400 hover:text-white transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Adicionar Novo Integrante</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {leaders.map((leader, index) => (
              <div
                key={index}
                className="group overflow-hidden rounded-3xl border border-white/5 bg-[#252525] shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative h-64 overflow-hidden bg-neutral-900">
                  <img
                    src={leader.image}
                    alt={leader.name}
                    className="h-full w-full object-cover opacity-85 transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1B1B1B] via-black/10 to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5">
                    <h4 className="font-display text-base font-bold text-white">{leader.name}</h4>
                    <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mt-0.5">{leader.role}</p>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-[11px] text-neutral-300 leading-relaxed font-light">
                    {leader.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Beautiful Photo Gallery Section */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-neutral-800 pb-4">
          <div className="text-left space-y-1">
            <h3 className="font-display text-xl md:text-3xl font-extrabold text-neutral-800 dark:text-white">
              Galeria de Momentos Recentes
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Registros visuais de nossas celebrações, comunhões semanais e ações de impacto social.
            </p>
          </div>
          {isLeaderOrAdmin && (
            <div className="shrink-0">
              {!isEditingGallery ? (
                <button
                  onClick={startEditingGallery}
                  className="flex items-center gap-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 text-xs font-bold text-white transition-colors"
                >
                  <Camera className="h-4 w-4 text-[#C62828]" />
                  <span>Gerenciar Galeria</span>
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveGallery}
                    className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-xs font-black text-white transition-colors"
                  >
                    <Check className="h-4 w-4" />
                    <span>Salvar Galeria</span>
                  </button>
                  <button
                    onClick={() => setIsEditingGallery(false)}
                    className="flex items-center gap-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-2 text-xs font-bold text-white transition-colors"
                  >
                    <X className="h-4 w-4 text-red-500" />
                    <span>Cancelar</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Gallery list view/edit layout */}
        {isEditingGallery ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {editableGallery.map((img, idx) => (
                <div key={idx} className="rounded-3xl border border-[#C62828]/20 bg-[#1F1F1F] p-4 space-y-3 relative">
                  <button
                    onClick={() => handleRemoveGalleryItem(idx)}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors z-10"
                    title="Remover Imagem"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>

                  <div className="aspect-video rounded-2xl overflow-hidden bg-neutral-900 border border-white/5 relative">
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </div>

                  <div className="space-y-2">
                    <input
                      type="text"
                      value={img.title}
                      onChange={(e) => handleGalleryChange(idx, "title", e.target.value)}
                      placeholder="Título ou descrição da foto"
                      className="w-full bg-black/40 border border-white/10 focus:border-[#C62828] rounded-xl px-3 py-1.5 text-xs text-white"
                    />
                    <input
                      type="text"
                      value={img.url}
                      onChange={(e) => handleGalleryChange(idx, "url", e.target.value)}
                      placeholder="Link da imagem (Unsplash)"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-2.5 py-1 text-[10px] text-neutral-400 font-mono"
                    />
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={handleAddGalleryItem}
              className="flex items-center gap-1.5 rounded-xl border-2 border-dashed border-neutral-800 hover:border-[#C62828]/50 w-full py-4 justify-center text-xs font-bold text-neutral-400 hover:text-white transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Adicionar Nova Foto</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {gallery.map((img, idx) => (
              <div
                key={idx}
                className="relative overflow-hidden rounded-3xl aspect-square bg-neutral-900 border border-white/5 group shadow-sm"
              >
                <img
                  src={img.url}
                  alt={img.title}
                  className="w-full h-full object-cover opacity-75 transition-all duration-500 group-hover:scale-[1.04]"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4" />
                <div className="absolute bottom-4 left-4 right-4 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all">
                  <p className="text-xs font-bold text-white">{img.title}</p>
                  <p className="text-[9px] text-[#C62828] font-mono mt-0.5">Movimento HUIOS</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

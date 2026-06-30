/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Sparkles, Heart, Compass, Shield, Target, Award, Eye } from "lucide-react";

export default function AboutView() {
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

  const leaders = [
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
  ];

  const gallery = [
    { title: "Culto Start HUIOS", url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=400" },
    { title: "Comunhão nas Casas", url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=400" },
    { title: "Ação Social HUIOS", url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=400" },
    { title: "Gincana e Integração", url: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=400" }
  ];

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
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h3 className="font-display text-xl md:text-3xl font-extrabold text-neutral-800 dark:text-white">
            Nossa Liderança de Apoio
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Jovens e pastores comprometidos em guiar o movimento com retidão espiritual, excelência técnica e acolhimento contínuo.
          </p>
        </div>

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
      </section>

      {/* Beautiful Photo Gallery */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h3 className="font-display text-xl md:text-3xl font-extrabold text-neutral-800 dark:text-white">
            Galeria de Momentos Recentes
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Lampejos visuais de nossas ministrações, comunhões nas casas e ações sociais.
          </p>
        </div>

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
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4" />
              <div className="absolute bottom-4 left-4 right-4 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all">
                <p className="text-xs font-bold text-white">{img.title}</p>
                <p className="text-[9px] text-[#C62828] font-mono mt-0.5">Movimento HUIOS</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

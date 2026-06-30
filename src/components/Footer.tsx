/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import Logo from "./Logo";
import { MessageSquare, Instagram, Facebook, Mail, MapPin, Smartphone, ShieldCheck, Heart } from "lucide-react";

interface FooterProps {
  onNavigateTo: (view: string) => void;
}

export default function Footer({ onNavigateTo }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="main-footer" className="bg-[#1B1B1B] text-neutral-400 border-t border-neutral-800 pt-16 pb-8 text-left transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Brand details column (Left 4 cols) */}
        <div className="md:col-span-4 space-y-4">
          <Logo showText={true} size="md" className="text-white" />
          <p className="text-xs text-neutral-400 leading-relaxed font-light">
            Somos um ministério cristão focado em inspirar a juventude a focar em raízes maduras, crescimento contínuo e frutos espirituais consistentes. Servindo a Deus com excelência e tecnologia.
          </p>
          <div className="flex gap-3 pt-2">
            <a
              href="https://wa.me/5511987654321"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl bg-neutral-800 hover:bg-red-600 text-white transition-colors"
            >
              <Smartphone className="h-4 w-4" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl bg-neutral-800 hover:bg-red-600 text-white transition-colors"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl bg-neutral-800 hover:bg-red-600 text-white transition-colors"
            >
              <Facebook className="h-4 w-4" />
            </a>
            <a
              href="mailto:contato@huios.com"
              className="p-2 rounded-xl bg-neutral-800 hover:bg-red-600 text-white transition-colors"
            >
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Navigation links (4 cols) */}
        <div className="md:col-span-4 space-y-4">
          <h4 className="font-display text-xs font-bold uppercase tracking-widest text-white">Navegação Rápida</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              { id: "Home", label: "Página Inicial" },
              { id: "Sobre", label: "Nossa História" },
              { id: "Agenda", label: "Calendário Geral" },
              { id: "Notícias", label: "Portal Conteúdo" },
              { id: "Pedidos de Oração", label: "Clamor & Oração" },
              { id: "Desafio Jovem", label: "Desafios Semanais" },
              { id: "Sugestões", label: "Canal de Ideias" }
            ].map((link) => (
              <button
                key={link.id}
                onClick={() => onNavigateTo(link.id)}
                className="text-left text-neutral-400 hover:text-red-500 transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>

        {/* Contact info (4 cols) */}
        <div className="md:col-span-4 space-y-4">
          <h4 className="font-display text-xs font-bold uppercase tracking-widest text-white">Localização & Contato</h4>
          <div className="space-y-3 text-xs leading-relaxed font-light">
            <div className="flex items-start gap-2.5">
              <MapPin className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
              <span>
                Av. das Nações Unidas, 1500, Pinheiros<br />
                São Paulo - SP, CEP 05425-070
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <Smartphone className="h-4 w-4 text-red-500 shrink-0" />
              <span>(11) 98765-4321 / Atendimento 24h</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 text-red-500 shrink-0" />
              <span>suporte@huios.com</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-12 pt-8 border-t border-neutral-800 text-center flex flex-col md:flex-row items-center justify-between gap-4 text-[10px]">
        <div className="flex items-center gap-1">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          <span>Este site está em total conformidade com a LGPD e políticas de privacidade.</span>
        </div>

        <p className="font-light">
          &copy; {currentYear} Movimento HUIOS. Todos os direitos reservados. Feito com <Heart className="inline h-3 w-3 text-red-600 fill-red-600 animate-pulse" /> para o Reino de Deus.
        </p>

        <div className="flex gap-4">
          <span className="cursor-pointer hover:text-white transition-colors">Políticas de Uso</span>
          <span className="cursor-pointer hover:text-white transition-colors">PWA Instalável</span>
        </div>
      </div>
    </footer>
  );
}

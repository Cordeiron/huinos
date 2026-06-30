/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { UserRole } from "../types";
import { Shield, User, Users, ShieldAlert, ChevronUp, Check, Info } from "lucide-react";

interface RoleSwitcherProps {
  currentRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  activeUserName: string;
}

export default function RoleSwitcher({ currentRole, onChangeRole, activeUserName }: RoleSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);

  const roles = [
    {
      id: UserRole.VISITOR,
      name: "Visitante",
      description: "Pode ver agenda, notícias, enviar pedidos de oração e sugestões.",
      icon: User,
      color: "text-gray-400 border-gray-400/20 bg-gray-500/10",
      badgeColor: "bg-gray-500/10 text-gray-400"
    },
    {
      id: UserRole.MEMBER,
      name: "Membro",
      description: "Tem perfil completo, participa de desafios, pontua, vê o ranking e conquistas.",
      icon: Users,
      color: "text-blue-500 border-blue-500/20 bg-blue-500/10",
      badgeColor: "bg-blue-500/10 text-blue-500"
    },
    {
      id: UserRole.LEADER,
      name: "Líder",
      description: "Gerencia sua Célula, ajuda com desafios, adiciona eventos e modera sugestões.",
      icon: Shield,
      color: "text-amber-500 border-amber-500/20 bg-amber-500/10",
      badgeColor: "bg-amber-500/10 text-amber-500"
    },
    {
      id: UserRole.ADMIN,
      name: "Administrador",
      description: "Controle total: edita banner, envia notificações, cria desafios, gerencia notícias e usuários.",
      icon: ShieldAlert,
      color: "text-red-600 border-red-600/20 bg-red-600/10",
      badgeColor: "bg-red-600/10 text-red-500"
    }
  ];

  const currentRoleConfig = roles.find((r) => r.id === currentRole) || roles[0];

  return (
    <div id="role-switcher-root" className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="mb-3 w-80 rounded-2xl border border-neutral-200 bg-white/90 p-4 shadow-xl backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-900/90"
          >
            <div className="mb-3 flex items-center justify-between border-b border-neutral-100 pb-2 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-red-600 animate-pulse" />
                <span className="font-display text-sm font-bold text-neutral-800 dark:text-neutral-200">
                  Simulador de Permissões
                </span>
              </div>
              <span className="text-[10px] uppercase tracking-wider text-neutral-400">
                HUIOS Demo
              </span>
            </div>

            <p className="mb-3 text-[11px] leading-relaxed text-neutral-500 dark:text-neutral-400">
              Alterne de perfil para testar todas as áreas e fluxos do sistema completo (inclusive o painel administrativo).
            </p>

            <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
              {roles.map((r) => {
                const Icon = r.icon;
                const isSelected = r.id === currentRole;
                return (
                  <button
                    key={r.id}
                    onClick={() => {
                      onChangeRole(r.id);
                      setIsOpen(false);
                    }}
                    className={`flex w-full text-left items-start gap-3 rounded-xl p-2.5 transition-all duration-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 ${
                      isSelected
                        ? "bg-red-50/70 border border-red-200/50 dark:bg-red-950/20 dark:border-red-900/30"
                        : "border border-transparent"
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg ${r.color} shrink-0`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-display text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                          {r.name}
                        </span>
                        {isSelected && (
                          <Check className="h-3.5 w-3.5 text-red-600 shrink-0" />
                        )}
                      </div>
                      <span className="block text-[10px] text-neutral-500 dark:text-neutral-400 leading-normal mt-0.5">
                        {r.description}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-3 border-t border-neutral-100 pt-2 flex items-center justify-between text-[11px] text-neutral-500 dark:border-neutral-800">
              <span>Usuário ativo:</span>
              <span className="font-semibold text-neutral-800 dark:text-neutral-200 max-w-[120px] truncate">
                {activeUserName}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-xs font-bold text-neutral-800 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 bg-gradient-to-r from-white to-neutral-50/80 dark:from-neutral-900 dark:to-neutral-950"
      >
        <span className={`h-2 w-2 rounded-full bg-red-600 animate-pulse`} />
        <span>Perfil:</span>
        <span className="font-extrabold text-red-600 dark:text-red-500">
          {currentRoleConfig.name}
        </span>
        <ChevronUp className={`h-3.5 w-3.5 text-neutral-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>
    </div>
  );
}

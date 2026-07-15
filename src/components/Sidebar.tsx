/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Utensils,
  Package,
  DollarSign,
  TrendingUp,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Grid,
  ChefHat,
  LogOut,
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  usuarioNome: string;
  onLogout: () => void;
  isOfflineMode?: boolean;
  onToggleMode?: () => void;
}

export default function Sidebar({
  currentView,
  onNavigate,
  usuarioNome,
  onLogout,
  isOfflineMode = false,
  onToggleMode
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: '' },
    { id: 'novo_pedido', label: 'Novo Pedido', icon: ShoppingCart, badge: 'PDV' },
    { id: 'clientes', label: 'Clientes', icon: Users, badge: '' },
    { id: 'produtos', label: 'Produtos', icon: Utensils, badge: '' },
    { id: 'estoque', label: 'Estoque', icon: Package, badge: '' },
    { id: 'caixa', label: 'Caixa', icon: DollarSign, badge: '' },
    { id: 'cozinha', label: 'Cozinha', icon: ChefHat, badge: 'KDS' },
    { id: 'relatorios', label: 'Relatórios', icon: TrendingUp, badge: '' },
    { id: 'configuracoes', label: 'Configurações', icon: Settings, badge: '' },
  ];

  const handleNav = (id: string) => {
    onNavigate(id);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden h-16 bg-orange-500 text-white flex items-center justify-between px-4 fixed top-0 left-0 right-0 z-40 shadow-md">
        <div className="flex items-center gap-2" onClick={() => onNavigate('central')}>
          <span className="text-2xl">🥟</span>
          <span className="font-bold text-lg tracking-tight">Salgadaria ERP</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 hover:bg-orange-600 rounded-xl transition-colors cursor-pointer"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-orange-500 text-white h-screen sticky top-0 transition-all duration-300 shadow-xl z-30 ${
          isOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-20 flex items-center justify-between px-5 border-b border-orange-400/30">
          <div
            className="flex items-center gap-3 overflow-hidden cursor-pointer active:scale-95 transition-transform duration-100"
            onClick={() => onNavigate('central')}
          >
            <span className="text-3xl shrink-0">🥟</span>
            {isOpen && (
              <span className="font-bold text-lg tracking-tight whitespace-nowrap animate-fade-in">
                Salgadaria CRM
              </span>
            )}
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 bg-orange-600/30 hover:bg-orange-600/60 rounded-lg transition-colors cursor-pointer"
          >
            {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>

        {/* User Info */}
        {isOpen && (
          <div className="px-5 py-4 bg-orange-600/20 border-b border-orange-400/20 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-400 flex items-center justify-center font-bold text-lg border border-orange-300">
                {usuarioNome.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs text-orange-200">Operador</p>
                <p className="text-sm font-semibold truncate">{usuarioNome}</p>
              </div>
            </div>
            {isOfflineMode && (
              <div className="mt-1 flex flex-col gap-1 bg-amber-600/30 border border-amber-400/30 rounded-xl p-2.5">
                <p className="text-[10px] font-bold text-amber-200 font-mono tracking-wide uppercase">🔴 Modo Demo Offline</p>
                <p className="text-[9px] text-orange-100 leading-tight">Dados salvos localmente.</p>
                {onToggleMode && (
                  <button
                    onClick={onToggleMode}
                    className="mt-1.5 w-full py-1 bg-orange-500 hover:bg-orange-600 text-[10px] font-bold text-white rounded-md transition duration-200 cursor-pointer text-center"
                  >
                    Ativar Nuvem (Firebase)
                  </button>
                )}
              </div>
            )}
            {!isOfflineMode && (
              <div className="mt-1 bg-emerald-600/30 border border-emerald-400/30 rounded-xl p-2 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                <p className="text-[10px] font-bold text-emerald-200 font-mono uppercase">🟢 Nuvem Sincronizada</p>
              </div>
            )}
          </div>
        )}

        {/* Menu Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {/* Back to Central Hub */}
          <button
            onClick={() => handleNav('central')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer text-orange-100 hover:bg-orange-600/40 hover:text-white group ${
              !isOpen ? 'justify-center' : ''
            }`}
            title="Central de Operações"
          >
            <Grid size={20} className="shrink-0 text-orange-200 group-hover:scale-110 transition-transform" />
            {isOpen && <span className="font-semibold text-sm">Central de Módulos</span>}
          </button>

          <div className="h-px bg-orange-400/30 my-2"></div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-white text-orange-600 shadow-md font-bold'
                    : 'text-orange-100 hover:bg-white/10 hover:text-white font-medium'
                } ${!isOpen ? 'justify-center' : ''}`}
                title={item.label}
              >
                <Icon size={20} className="shrink-0" />
                {isOpen && (
                  <span className="text-sm truncate flex-1 text-left">{item.label}</span>
                )}
                {isOpen && item.badge && (
                  <span className="px-1.5 py-0.5 bg-orange-600/30 group-hover:bg-orange-600/50 text-[10px] font-bold rounded-md uppercase text-orange-100 font-mono">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer Logout */}
        <div className="p-3 border-t border-orange-400/30">
          <button
            onClick={onLogout}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-orange-100 hover:bg-rose-600 hover:text-white transition-all duration-200 cursor-pointer ${
              !isOpen ? 'justify-center' : ''
            }`}
            title="Sair"
          >
            <LogOut size={20} className="shrink-0" />
            {isOpen && <span className="text-sm font-semibold">Sair do Sistema</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Drawer (Overlay) */}
      <div
        className={`lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileOpen(false)}
      >
        <div
          className={`w-72 bg-orange-500 h-full text-white p-5 flex flex-col transition-transform duration-300 ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-orange-400/30">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🥟</span>
              <span className="font-bold text-xl">Salgadaria CRM</span>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-1 hover:bg-orange-600 rounded-lg cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Mobile User Info & Offline status */}
          <div className="mb-4 pb-4 border-b border-orange-400/30 flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center font-bold text-sm border border-orange-300">
                {usuarioNome.charAt(0)}
              </div>
              <div>
                <p className="text-[10px] text-orange-200">Operador</p>
                <p className="text-xs font-semibold truncate">{usuarioNome}</p>
              </div>
            </div>
            {isOfflineMode && (
              <div className="flex items-center justify-between bg-amber-600/30 border border-amber-400/30 rounded-xl px-3 py-2 text-[10px]">
                <div className="flex flex-col">
                  <span className="font-bold text-amber-200 font-mono">🔴 DEMO OFFLINE</span>
                  <span className="text-[8px] text-orange-100">Dados locais</span>
                </div>
                {onToggleMode && (
                  <button
                    onClick={() => {
                      onToggleMode();
                      setMobileOpen(false);
                    }}
                    className="px-2 py-1 bg-orange-500 hover:bg-orange-600 text-[9px] font-bold text-white rounded-md transition cursor-pointer"
                  >
                    Ativar Nuvem
                  </button>
                )}
              </div>
            )}
            {!isOfflineMode && (
              <div className="bg-emerald-600/30 border border-emerald-400/30 rounded-xl px-3 py-2 text-[10px] flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                <span className="font-bold text-emerald-200 font-mono">🟢 NUVEM SINCRONIZADA</span>
              </div>
            )}
          </div>

          <nav className="flex-1 space-y-1.5 overflow-y-auto">
            <button
              onClick={() => handleNav('central')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-orange-100 hover:bg-orange-600 font-bold"
            >
              <Grid size={20} />
              <span>Central de Módulos</span>
            </button>
            <div className="h-px bg-orange-400/30 my-2"></div>

            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm ${
                    isActive ? 'bg-white text-orange-600 font-bold' : 'text-orange-100 font-medium'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 bg-orange-600/50 hover:bg-rose-600 text-white rounded-xl font-bold mt-4"
          >
            <LogOut size={20} />
            <span>Sair do Sistema</span>
          </button>
        </div>
      </div>
    </>
  );
}

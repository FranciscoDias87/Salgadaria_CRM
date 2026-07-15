/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, Package, DollarSign, BarChart3, Truck, Settings, LogOut, Bell, AlertTriangle } from 'lucide-react';
import { Pedido, Ingrediente } from '../types';

interface CentralModulosViewProps {
  usuarioNome: string;
  pedidos: Pedido[];
  ingredientes: Ingrediente[];
  onLogout: () => void;
  onNavigate: (view: string) => void;
}

export default function CentralModulosView({
  usuarioNome,
  pedidos,
  ingredientes,
  onLogout,
  onNavigate,
}: CentralModulosViewProps) {
  // Real calculations based on active state
  const vendasHoje = pedidos
    .filter(p => p.status !== 'Pendente') // assume processed
    .reduce((sum, p) => sum + p.total, 0);

  const totalPedidos = pedidos.length;

  const estoqueBaixo = ingredientes.filter(i => i.quantidade < i.minimo).length;

  const entregasPendentes = pedidos.filter(p => p.status === 'Preparando' || p.status === 'Pronto').length;

  const alertasCriticos = ingredientes.filter(i => i.quantidade <= i.minimo * 0.4).length;

  const modulos = [
    {
      id: 'dashboard',
      titulo: 'Vendas & PDV',
      icone: '🛒',
      lucideIcon: ShoppingCart,
      cor: 'from-orange-500 to-amber-500',
      subitens: ['Dashboard Principal', 'Frente de Caixa / PDV', 'Controle de Pedidos', 'Gestão de Clientes'],
      targetView: 'dashboard',
    },
    {
      id: 'estoque',
      titulo: 'Estoque & Insumos',
      icone: '📦',
      lucideIcon: Package,
      cor: 'from-amber-500 to-orange-600',
      subitens: ['Catálogo de Produtos', 'Ingredientes & Receitas', 'Histórico de Compras', 'Fornecedores'],
      targetView: 'estoque',
    },
    {
      id: 'caixa',
      titulo: 'Financeiro & Caixa',
      icone: '💰',
      lucideIcon: DollarSign,
      cor: 'from-emerald-500 to-teal-600',
      subitens: ['Fluxo de Caixa', 'Abertura/Fechamento', 'Contas a Pagar/Receber', 'Relatório de Sangria'],
      targetView: 'caixa',
    },
    {
      id: 'relatorios',
      titulo: 'Gestão & Relatórios',
      icone: '📊',
      lucideIcon: BarChart3,
      cor: 'from-blue-500 to-indigo-600',
      subitens: ['Análise de Vendas', 'Faturamento Mensal', 'Ranking de Mais Vendidos', 'Exportação de Dados'],
      targetView: 'relatorios',
    },
    {
      id: 'cozinha',
      titulo: 'Operação & Cozinha',
      icone: '🚚',
      lucideIcon: Truck,
      cor: 'from-indigo-500 to-violet-600',
      subitens: ['Monitor da Cozinha (KDS)', 'Logística de Delivery', 'Fila de Produção', 'Painel de Entregas'],
      targetView: 'cozinha',
    },
    {
      id: 'configuracoes',
      titulo: 'Configurações',
      icone: '⚙️',
      lucideIcon: Settings,
      cor: 'from-slate-600 to-slate-800',
      subitens: ['Dados da Empresa', 'Controle de Usuários', 'Impressoras de Cupom', 'Formas de Pagamento'],
      targetView: 'configuracoes',
    },
  ];

  const formatCurrency = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-12 select-none">
      {/* Dynamic Modern Header */}
      <header className="h-20 bg-orange-500 text-white flex justify-between items-center px-6 md:px-12 shadow-lg relative z-10">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🥟</span>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">Salgadaria ERP</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-right">
            <p className="text-xs text-orange-100 font-medium">Operador Ativo</p>
            <p className="text-sm font-semibold">{usuarioNome}</p>
          </div>
          <button
            onClick={onLogout}
            className="p-2.5 bg-orange-600/50 hover:bg-orange-700/60 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center text-white"
            title="Sair do Sistema"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-7xl w-full mx-auto px-4 md:px-8 mt-8 flex-1">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">
            Central de Operações
          </h1>
          <p className="text-slate-500 mt-2">
            Seja bem-vindo de volta! Escolha um dos módulos abaixo para gerenciar sua salgadaria.
          </p>
        </div>

        {/* Real-time calculated KPI grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Vendas Hoje</span>
            <span className="text-2xl md:text-3xl font-extrabold text-orange-500 mt-2">
              {formatCurrency(vendasHoje)}
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pedidos Hoje</span>
            <span className="text-2xl md:text-3xl font-extrabold text-slate-800 mt-2">
              {totalPedidos}
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Estoque Baixo</span>
              {estoqueBaixo > 0 && <span className="w-2 h-2 bg-amber-500 rounded-full animate-ping"></span>}
            </div>
            <span className="text-2xl md:text-3xl font-extrabold text-amber-500 mt-2">
              {estoqueBaixo}
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Na Cozinha</span>
            <span className="text-2xl md:text-3xl font-extrabold text-indigo-500 mt-2">
              {entregasPendentes}
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between col-span-2 md:col-span-1">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Alertas Críticos</span>
              {alertasCriticos > 0 && <AlertTriangle size={14} className="text-rose-500" />}
            </div>
            <span className="text-2xl md:text-3xl font-extrabold text-rose-500 mt-2">
              {alertasCriticos}
            </span>
          </div>
        </div>

        {/* Modular Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {modulos.map((modulo, index) => {
            const IconComponent = modulo.lucideIcon;
            return (
              <motion.div
                key={modulo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ y: -6, scale: 1.01 }}
                onClick={() => onNavigate(modulo.targetView)}
                className="group bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:border-orange-500/20 hover:bg-orange-500 transition-all duration-300 cursor-pointer flex flex-col justify-between select-none min-h-[260px]"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-4xl group-hover:scale-110 transition-transform duration-200">
                      {modulo.icone}
                    </span>
                    <IconComponent className="text-slate-300 group-hover:text-orange-200 transition-colors duration-200" size={24} />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-800 group-hover:text-white transition-colors duration-200">
                    {modulo.titulo}
                  </h2>
                  <ul className="mt-4 space-y-1">
                    {modulo.subitens.map((item, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-slate-500 group-hover:text-orange-50/85 flex items-center gap-1.5 font-medium transition-colors duration-200"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-orange-200"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-6 flex items-center text-xs font-semibold text-orange-500 group-hover:text-white group-hover:translate-x-1 transition-all duration-200">
                  Acessar Módulo &rarr;
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 text-center text-slate-400 text-xs">
        <p className="font-semibold">Salgadaria ERP &bull; Gestão Profissional</p>
        <p className="mt-1 font-mono text-[10px]">Versão 1.0.0 &bull; 2026</p>
      </footer>
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShoppingCart, UserPlus, DollarSign, BarChart3, Plus, ArrowUpRight, TrendingUp } from 'lucide-react';
import { Pedido, Cliente, CaixaTransacao } from '../types';

interface DashboardViewProps {
  pedidos: Pedido[];
  clientes: Cliente[];
  transacoes: CaixaTransacao[];
  onNavigate: (view: string) => void;
  onAdicionarCliente: (cliente: Omit<Cliente, 'id' | 'totalGasto' | 'cadastroData' | 'fiadoUsado'>) => void;
}

export default function DashboardView({
  pedidos,
  clientes,
  transacoes,
  onNavigate,
  onAdicionarCliente,
}: DashboardViewProps) {
  const [modalNovoClienteOpen, setModalNovoClienteOpen] = useState(false);
  const [novoClienteNome, setNovoClienteNome] = useState('');
  const [novoClienteTelefone, setNovoClienteTelefone] = useState('');
  const [novoClienteEmail, setNovoClienteEmail] = useState('');
  const [novoClienteLimite, setNovoClienteLimite] = useState(100);

  // Dynamic calculations
  const totalVendasHoje = pedidos
    .reduce((sum, p) => sum + p.total, 0);

  const totalPedidos = pedidos.length;
  const totalClientes = clientes.length;

  // Cash balance calculation
  const saldoCaixa = transacoes.reduce((sum, t) => {
    return t.tipo === 'entrada' ? sum + t.valor : sum - t.valor;
  }, 0);

  const formatCurrency = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const handleSalvarCliente = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoClienteNome.trim()) return;

    onAdicionarCliente({
      nome: novoClienteNome,
      telefone: novoClienteTelefone || '(11) 99999-9999',
      email: novoClienteEmail || 'cliente@email.com',
      fiadoLimite: novoClienteLimite,
    });

    setNovoClienteNome('');
    setNovoClienteTelefone('');
    setNovoClienteEmail('');
    setNovoClienteLimite(100);
    setModalNovoClienteOpen(false);
  };

  return (
    <div className="space-y-8 select-none">
      {/* Top Banner with dynamic stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Painel de Vendas</h1>
          <p className="text-slate-500 mt-1">Acompanhe a atividade em tempo real da sua Salgadaria.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3.5 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-xs font-semibold border border-emerald-100 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Sistema Online
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-orange-50 rounded-full group-hover:scale-110 transition-transform"></div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider relative z-10">Vendas Hoje</h3>
          <p className="text-2xl md:text-3xl font-black text-slate-800 mt-3 relative z-10">
            {formatCurrency(totalVendasHoje)}
          </p>
          <p className="text-[10px] text-emerald-500 font-bold mt-1.5 flex items-center gap-0.5 relative z-10">
            <TrendingUp size={12} /> +12.4% vs ontem
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-orange-50 rounded-full group-hover:scale-110 transition-transform"></div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider relative z-10">Pedidos</h3>
          <p className="text-2xl md:text-3xl font-black text-slate-800 mt-3 relative z-10">
            {totalPedidos}
          </p>
          <p className="text-[10px] text-slate-400 font-medium mt-1.5 relative z-10">Fila da cozinha ativa</p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-orange-50 rounded-full group-hover:scale-110 transition-transform"></div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider relative z-10">Clientes</h3>
          <p className="text-2xl md:text-3xl font-black text-slate-800 mt-3 relative z-10">
            {totalClientes}
          </p>
          <p className="text-[10px] text-slate-400 font-medium mt-1.5 relative z-10">Consumidores cadastrados</p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-orange-50 rounded-full group-hover:scale-110 transition-transform"></div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider relative z-10">Saldo Caixa</h3>
          <p className="text-2xl md:text-3xl font-black text-emerald-600 mt-3 relative z-10">
            {formatCurrency(saldoCaixa)}
          </p>
          <p className="text-[10px] text-slate-400 font-medium mt-1.5 relative z-10">Disponível em caixa físico</p>
        </div>
      </div>

      {/* Quick Access Actions Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          onClick={() => onNavigate('novo_pedido')}
          className="bg-white hover:bg-orange-500 hover:text-white p-6 rounded-2xl shadow-sm border border-slate-100 text-left flex flex-col justify-between h-40 transition-all duration-300 group cursor-pointer relative overflow-hidden hover:shadow-lg hover:border-orange-500/20"
        >
          <div className="w-12 h-12 rounded-xl bg-orange-50 group-hover:bg-orange-600 flex items-center justify-center text-orange-500 group-hover:text-white text-2xl transition-colors duration-200">
            🛒
          </div>
          <div>
            <h4 className="font-bold text-slate-800 group-hover:text-white text-base">Novo Pedido</h4>
            <p className="text-xs text-slate-400 group-hover:text-orange-100 mt-1">Iniciar nova venda balcão</p>
          </div>
        </button>

        <button
          onClick={() => setModalNovoClienteOpen(true)}
          className="bg-white hover:bg-orange-500 hover:text-white p-6 rounded-2xl shadow-sm border border-slate-100 text-left flex flex-col justify-between h-40 transition-all duration-300 group cursor-pointer relative overflow-hidden hover:shadow-lg hover:border-orange-500/20"
        >
          <div className="w-12 h-12 rounded-xl bg-orange-50 group-hover:bg-orange-600 flex items-center justify-center text-orange-500 group-hover:text-white text-2xl transition-colors duration-200">
            👤
          </div>
          <div>
            <h4 className="font-bold text-slate-800 group-hover:text-white text-base">Novo Cliente</h4>
            <p className="text-xs text-slate-400 group-hover:text-orange-100 mt-1">Cadastrar consumidor</p>
          </div>
        </button>

        <button
          onClick={() => onNavigate('caixa')}
          className="bg-white hover:bg-orange-500 hover:text-white p-6 rounded-2xl shadow-sm border border-slate-100 text-left flex flex-col justify-between h-40 transition-all duration-300 group cursor-pointer relative overflow-hidden hover:shadow-lg hover:border-orange-500/20"
        >
          <div className="w-12 h-12 rounded-xl bg-orange-50 group-hover:bg-orange-600 flex items-center justify-center text-orange-500 group-hover:text-white text-2xl transition-colors duration-200">
            💰
          </div>
          <div>
            <h4 className="font-bold text-slate-800 group-hover:text-white text-base">Fluxo de Caixa</h4>
            <p className="text-xs text-slate-400 group-hover:text-orange-100 mt-1">Lançar entradas e saídas</p>
          </div>
        </button>

        <button
          onClick={() => onNavigate('relatorios')}
          className="bg-white hover:bg-orange-500 hover:text-white p-6 rounded-2xl shadow-sm border border-slate-100 text-left flex flex-col justify-between h-40 transition-all duration-300 group cursor-pointer relative overflow-hidden hover:shadow-lg hover:border-orange-500/20"
        >
          <div className="w-12 h-12 rounded-xl bg-orange-50 group-hover:bg-orange-600 flex items-center justify-center text-orange-500 group-hover:text-white text-2xl transition-colors duration-200">
            📊
          </div>
          <div>
            <h4 className="font-bold text-slate-800 group-hover:text-white text-base">Relatórios</h4>
            <p className="text-xs text-slate-400 group-hover:text-orange-100 mt-1">Ver gráficos de faturamento</p>
          </div>
        </button>
      </div>

      {/* Recent Orders table */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Últimos Pedidos Realizados</h2>
            <p className="text-xs text-slate-400 mt-1">Histórico recente de compras da loja.</p>
          </div>
          <button
            onClick={() => onNavigate('novo_pedido')}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-orange-500/10 cursor-pointer"
          >
            <Plus size={14} /> Novo Pedido
          </button>
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-xs font-semibold">
                <th className="py-4 px-4 font-semibold uppercase tracking-wider">Cliente</th>
                <th className="py-4 px-4 font-semibold uppercase tracking-wider">Produtos do Pedido</th>
                <th className="py-4 px-4 font-semibold uppercase tracking-wider">Total</th>
                <th className="py-4 px-4 font-semibold uppercase tracking-wider">F. Pagamento</th>
                <th className="py-4 px-4 font-semibold uppercase tracking-wider text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-slate-700 text-sm">
              {pedidos.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 text-xs">
                    Nenhum pedido realizado hoje.
                  </td>
                </tr>
              ) : (
                [...pedidos].reverse().map((pedido) => (
                  <tr key={pedido.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-4 font-medium text-slate-800">{pedido.clienteNome}</td>
                    <td className="py-4 px-4 text-xs text-slate-500 max-w-xs truncate" title={pedido.itens.map(i => `${i.quantidade}x ${i.nome}`).join(', ')}>
                      {pedido.itens.map(i => `${i.quantidade}x ${i.nome}`).join(' + ')}
                    </td>
                    <td className="py-4 px-4 font-bold text-slate-800">
                      {formatCurrency(pedido.total)}
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-1 bg-slate-100 rounded-md text-[11px] font-medium text-slate-600 border border-slate-200">
                        {pedido.pagamento}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          pedido.status === 'Entregue'
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                            : pedido.status === 'Pronto'
                            ? 'bg-blue-50 text-blue-600 border border-blue-100'
                            : pedido.status === 'Preparando'
                            ? 'bg-amber-50 text-amber-600 border border-amber-100'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {pedido.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Order Cards */}
        <div className="md:hidden space-y-4">
          {pedidos.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              Nenhum pedido realizado hoje.
            </div>
          ) : (
            [...pedidos].reverse().map((pedido) => (
              <div key={pedido.id} className="bg-slate-50/60 p-4 rounded-2xl border border-slate-100 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{pedido.clienteNome}</h4>
                    <p className="text-[10px] text-slate-400 font-semibold">ID: #{pedido.id.toUpperCase()}</p>
                  </div>
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      pedido.status === 'Entregue'
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                        : pedido.status === 'Pronto'
                        ? 'bg-blue-50 text-blue-600 border border-blue-100'
                        : pedido.status === 'Preparando'
                        ? 'bg-amber-50 text-amber-600 border border-amber-100'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {pedido.status}
                  </span>
                </div>
                <div className="text-xs text-slate-500 font-medium bg-white/75 p-2 rounded-xl border border-slate-100/50">
                  {pedido.itens.map(i => `${i.quantidade}x ${i.nome}`).join(' + ')}
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-600">
                    {pedido.pagamento}
                  </span>
                  <span className="font-extrabold text-slate-800 text-sm">
                    {formatCurrency(pedido.total)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal - Novo Cliente */}
      {modalNovoClienteOpen && (
        <div className="fixed inset-0 bg-black/55 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-slate-100 animate-scale-up">
            <h3 className="text-xl font-bold text-slate-800 mb-2">👤 Adicionar Novo Cliente</h3>
            <p className="text-xs text-slate-400 mb-6">Cadastre o cliente para permitir pedidos no fiado e históricos.</p>

            <form onSubmit={handleSalvarCliente} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Nome Completo *</label>
                <input
                  type="text"
                  required
                  value={novoClienteNome}
                  onChange={(e) => setNovoClienteNome(e.target.value)}
                  placeholder="Ex: Maria José de Souza"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Telefone</label>
                  <input
                    type="text"
                    value={novoClienteTelefone}
                    onChange={(e) => setNovoClienteTelefone(e.target.value)}
                    placeholder="Ex: (11) 98888-8888"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Limite Fiado (R$)</label>
                  <input
                    type="number"
                    value={novoClienteLimite}
                    onChange={(e) => setNovoClienteLimite(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Email</label>
                <input
                  type="email"
                  value={novoClienteEmail}
                  onChange={(e) => setNovoClienteEmail(e.target.value)}
                  placeholder="Ex: cliente@email.com"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>

              <div className="flex items-center gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setModalNovoClienteOpen(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl text-xs transition cursor-pointer"
                >
                  Salvar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

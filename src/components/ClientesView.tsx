/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, UserPlus, Phone, Mail, Award, BookOpen, Trash2, Edit, AlertCircle } from 'lucide-react';
import { Cliente } from '../types';

interface ClientesViewProps {
  clientes: Cliente[];
  onAdicionarCliente: (cliente: Omit<Cliente, 'id' | 'totalGasto' | 'cadastroData' | 'fiadoUsado'>) => void;
  onEditarCliente: (cliente: Cliente) => void;
  onExcluirCliente: (id: string) => void;
}

export default function ClientesView({
  clientes,
  onAdicionarCliente,
  onEditarCliente,
  onExcluirCliente,
}: ClientesViewProps) {
  const [busca, setBusca] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null);

  // Form states
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [fiadoLimite, setFiadoLimite] = useState(100);

  // Filter clients
  const clientesFiltrados = clientes.filter((c) => {
    const termo = busca.toLowerCase();
    return c.nome.toLowerCase().includes(termo) || c.telefone.includes(termo) || c.email.toLowerCase().includes(termo);
  });

  // Calculate statistics
  const totalClientes = clientes.length;
  const totalGeralGasto = clientes.reduce((sum, c) => sum + c.totalGasto, 0);
  const fiadoEmAberto = clientes.reduce((sum, c) => sum + c.fiadoUsado, 0);
  const devedoresQtd = clientes.filter((c) => c.fiadoUsado > 0).length;

  const handleOpenAdicionar = () => {
    setClienteEditando(null);
    setNome('');
    setTelefone('');
    setEmail('');
    setFiadoLimite(100);
    setModalOpen(true);
  };

  const handleOpenEditar = (cliente: Cliente) => {
    setClienteEditando(cliente);
    setNome(cliente.nome);
    setTelefone(cliente.telefone);
    setEmail(cliente.email);
    setFiadoLimite(cliente.fiadoLimite);
    setModalOpen(true);
  };

  const handleSalvar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return;

    if (clienteEditando) {
      onEditarCliente({
        ...clienteEditando,
        nome,
        telefone: telefone || '(11) 99999-9999',
        email: email || 'cliente@email.com',
        fiadoLimite,
      });
    } else {
      onAdicionarCliente({
        nome,
        telefone: telefone || '(11) 99999-9999',
        email: email || 'cliente@email.com',
        fiadoLimite,
      });
    }

    setModalOpen(false);
  };

  const formatCurrency = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="space-y-6 select-none">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <span>👥</span> Carteira de Clientes
          </h1>
          <p className="text-slate-500 mt-1">Monitore o consumo dos fregueses, cadastros e limites de caderneta.</p>
        </div>

        <div className="flex w-full md:w-auto gap-3 shrink-0">
          <div className="relative flex-1 md:w-72">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <Search size={18} />
            </span>
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Pesquisar cliente por nome, fone..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>
          <button
            onClick={handleOpenAdicionar}
            className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5 shadow-md shadow-orange-500/10 shrink-0 cursor-pointer"
          >
            <UserPlus size={15} /> + Novo Cliente
          </button>
        </div>
      </div>

      {/* Stats cards for CRM */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total de Clientes</span>
          <span className="text-2xl font-extrabold text-slate-800 mt-2">{totalClientes}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Consumo Acumulado</span>
          <span className="text-2xl font-extrabold text-orange-500 mt-2">{formatCurrency(totalGeralGasto)}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Fiado em Aberto</span>
          <span className="text-2xl font-extrabold text-rose-500 mt-2">{formatCurrency(fiadoEmAberto)}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Devedores Ativos</span>
          <span className="text-2xl font-extrabold text-slate-700 mt-2">{devedoresQtd} clientes</span>
        </div>
      </div>

      {/* Main Customer Table & Cards */}
      <div className="hidden md:block bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-xs font-semibold bg-slate-50/50">
                <th className="py-4 px-6 font-semibold uppercase tracking-wider">Freguês</th>
                <th className="py-4 px-6 font-semibold uppercase tracking-wider">Contato / Email</th>
                <th className="py-4 px-6 font-semibold uppercase tracking-wider">Total Consumido</th>
                <th className="py-4 px-6 font-semibold uppercase tracking-wider">Caderneta (Fiado)</th>
                <th className="py-4 px-6 font-semibold uppercase tracking-wider">Data Cadastro</th>
                <th className="py-4 px-6 font-semibold uppercase tracking-wider text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-slate-700 text-sm">
              {clientesFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                    Nenhum cliente cadastrado ou encontrado.
                  </td>
                </tr>
              ) : (
                clientesFiltrados.map((cliente) => {
                  const devedor = cliente.fiadoUsado > 0;
                  return (
                    <tr key={cliente.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm">
                            {cliente.nome.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-sm">{cliente.nome}</p>
                            <p className="text-[10px] text-slate-400 font-semibold">Cód: #{cliente.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="space-y-0.5">
                          <p className="text-xs text-slate-600 font-medium flex items-center gap-1">
                            <Phone size={10} className="text-slate-400" /> {cliente.telefone}
                          </p>
                          <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                            <Mail size={10} className="text-slate-400" /> {cliente.email}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-bold text-slate-800">
                        {formatCurrency(cliente.totalGasto)}
                      </td>
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className={devedor ? 'text-rose-500 font-bold' : 'text-slate-400'}>
                              {formatCurrency(cliente.fiadoUsado)}
                            </span>
                            <span className="text-slate-400">/ {formatCurrency(cliente.fiadoLimite)}</span>
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${devedor ? 'bg-rose-500' : 'bg-orange-500'}`}
                              style={{ width: `${Math.min((cliente.fiadoUsado / cliente.fiadoLimite) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-xs text-slate-500 font-medium">{cliente.cadastroData}</td>
                      <td className="py-4 px-6 text-center">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => handleOpenEditar(cliente)}
                            className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-700 rounded-lg cursor-pointer transition"
                            title="Editar Dados"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => onExcluirCliente(cliente.id)}
                            className="p-1.5 hover:bg-rose-50 text-rose-400 hover:text-rose-600 rounded-lg cursor-pointer transition"
                            title="Excluir Cliente"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Client Cards */}
      <div className="md:hidden space-y-4">
        {clientesFiltrados.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs bg-white rounded-3xl border border-slate-100">
            Nenhum cliente cadastrado ou encontrado.
          </div>
        ) : (
          clientesFiltrados.map((cliente) => {
            const devedor = cliente.fiadoUsado > 0;
            return (
              <div key={cliente.id} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm space-y-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-black text-sm">
                    {cliente.nome.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{cliente.nome}</p>
                    <p className="text-[10px] text-slate-400 font-semibold">Cód: #{cliente.id}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs border-t border-b border-slate-50 py-2.5 font-medium text-slate-600">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Contato</span>
                    {cliente.telefone}
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Total Gasto</span>
                    <span className="font-bold text-slate-800">{formatCurrency(cliente.totalGasto)}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className={devedor ? 'text-rose-500' : 'text-slate-400'}>
                      Caderneta: {formatCurrency(cliente.fiadoUsado)}
                    </span>
                    <span className="text-slate-400">Limite: {formatCurrency(cliente.fiadoLimite)}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${devedor ? 'bg-rose-500' : 'bg-orange-500'}`}
                      style={{ width: `${Math.min((cliente.fiadoUsado / cliente.fiadoLimite) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-1 border-t border-slate-50">
                  <span className="text-[10px] text-slate-400 font-semibold">Cadastro: {cliente.cadastroData}</span>
                  <div className="inline-flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditar(cliente)}
                      className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-700 rounded-lg cursor-pointer transition"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => onExcluirCliente(cliente.id)}
                      className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-500 hover:text-rose-700 rounded-lg cursor-pointer transition"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/55 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-slate-100 animate-scale-up">
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              {clienteEditando ? '✏️ Editar Cliente' : '👤 Adicionar Novo Cliente'}
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              {clienteEditando ? 'Edite as informações cadastrais do freguês.' : 'Insira as informações básicas para registrar o freguês.'}
            </p>

            <form onSubmit={handleSalvar} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Nome Completo *</label>
                <input
                  type="text"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Carlos Santana Melo"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Telefone</label>
                  <input
                    type="text"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    placeholder="Ex: (11) 98888-7777"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Limite Fiado (R$)</label>
                  <input
                    type="number"
                    value={fiadoLimite}
                    onChange={(e) => setFiadoLimite(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ex: carlos@email.com"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>

              <div className="flex items-center gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
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

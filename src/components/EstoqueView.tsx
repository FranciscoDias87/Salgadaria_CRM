/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Plus, Edit, Minus, Layers, AlertOctagon, DollarSign, Package } from 'lucide-react';
import { Ingrediente } from '../types';

interface EstoqueViewProps {
  ingredientes: Ingrediente[];
  onAdicionarIngrediente: (ingrediente: Omit<Ingrediente, 'id'>) => void;
  onEditarIngrediente: (ingrediente: Ingrediente) => void;
  onAjustarEstoque: (id: string, novaQtd: number) => void;
}

export default function EstoqueView({
  ingredientes,
  onAdicionarIngrediente,
  onEditarIngrediente,
  onAjustarEstoque,
}: EstoqueViewProps) {
  const [busca, setBusca] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [ingredienteEditando, setIngredienteEditando] = useState<Ingrediente | null>(null);

  // Quick adjust states
  const [quickAdjustId, setQuickAdjustId] = useState<string | null>(null);
  const [quickAdjustValue, setQuickAdjustValue] = useState<number>(0);

  // Form states
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('Produção');
  const [quantidade, setQuantidade] = useState(10);
  const [unidade, setUnidade] = useState('Kg');
  const [minimo, setMinimo] = useState(5);

  const categoriasInsumos = ['Produção', 'Proteína', 'Cozinha', 'Laticínios', 'Bebidas', 'Embalagens'];

  // Filter ingredients
  const ingredientesFiltrados = ingredientes.filter((i) =>
    i.nome.toLowerCase().includes(busca.toLowerCase()) || i.categoria.toLowerCase().includes(busca.toLowerCase())
  );

  // Dynamic statistics
  const totalItens = ingredientes.length;
  const itensBaixos = ingredientes.filter((i) => i.quantidade < i.minimo && i.quantidade > i.minimo * 0.4).length;
  const itensCriticos = ingredientes.filter((i) => i.quantidade <= i.minimo * 0.4).length;
  
  // Simulated stock value (assuming a mock cost per item for stats richness)
  const valorEstoqueSimulado = ingredientes.reduce((sum, i) => {
    let custoPorUnidade = 15; // default
    if (i.nome.includes('Queijo')) custoPorUnidade = 45;
    if (i.nome.includes('Frango')) custoPorUnidade = 22;
    if (i.nome.includes('Refrigerante')) custoPorUnidade = 3.5;
    if (i.nome.includes('Óleo')) custoPorUnidade = 9;
    return sum + i.quantidade * custoPorUnidade;
  }, 0);

  const formatCurrency = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const handleOpenAdicionar = () => {
    setIngredienteEditando(null);
    setNome('');
    setCategoria('Produção');
    setQuantidade(10);
    setUnidade('Kg');
    setMinimo(5);
    setModalOpen(true);
  };

  const handleOpenEditar = (insumo: Ingrediente) => {
    setIngredienteEditando(insumo);
    setNome(insumo.nome);
    setCategoria(insumo.categoria);
    setQuantidade(insumo.quantidade);
    setUnidade(insumo.unidade);
    setMinimo(insumo.minimo);
    setModalOpen(true);
  };

  const handleSalvar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return;

    if (ingredienteEditando) {
      onEditarIngrediente({
        ...ingredienteEditando,
        nome,
        categoria,
        quantidade,
        unidade,
        minimo,
      });
    } else {
      onAdicionarIngrediente({
        nome,
        categoria,
        quantidade,
        unidade,
        minimo,
      });
    }

    setModalOpen(false);
  };

  const triggerQuickAdjust = (insumo: Ingrediente) => {
    setQuickAdjustId(insumo.id);
    setQuickAdjustValue(insumo.quantidade);
  };

  const saveQuickAdjust = (id: string) => {
    onAjustarEstoque(id, quickAdjustValue);
    setQuickAdjustId(null);
  };

  return (
    <div className="space-y-6 select-none">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <span>📦</span> Controle de Insumos & Estoque
          </h1>
          <p className="text-slate-500 mt-1">Monitore e ajuste o estoque de ingredientes ativos na salgadaria.</p>
        </div>

        <div className="flex w-full md:w-auto gap-3 shrink-0">
          <div className="relative flex-1 md:w-64">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <Search size={18} />
            </span>
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Pesquisar ingrediente..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>
          <button
            onClick={handleOpenAdicionar}
            className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5 shadow-md shadow-orange-500/10 shrink-0 cursor-pointer"
          >
            <Plus size={15} /> + Novo Item
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Itens Cadastrados</span>
          <span className="text-2xl font-extrabold text-slate-800 mt-2">{totalItens}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Estoque Baixo</span>
          <span className="text-2xl font-extrabold text-amber-500 mt-2">{itensBaixos}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Itens Críticos</span>
          <span className="text-2xl font-extrabold text-rose-500 mt-2">{itensCriticos}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Valor do Estoque (Aprox)</span>
          <span className="text-2xl font-extrabold text-emerald-600 mt-2">{formatCurrency(valorEstoqueSimulado)}</span>
        </div>
      </div>

      {/* Ingredients Table & Cards */}
      <div className="hidden md:block bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-xs font-semibold bg-slate-50/50">
                <th className="py-4 px-6 font-semibold uppercase tracking-wider">Ingrediente</th>
                <th className="py-4 px-6 font-semibold uppercase tracking-wider">Categoria</th>
                <th className="py-4 px-6 font-semibold uppercase tracking-wider">Quantidade Atual</th>
                <th className="py-4 px-6 font-semibold uppercase tracking-wider">Estoque Mínimo</th>
                <th className="py-4 px-6 font-semibold uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 font-semibold uppercase tracking-wider text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-slate-700 text-sm">
              {ingredientesFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                    Nenhum ingrediente em estoque.
                  </td>
                </tr>
              ) : (
                ingredientesFiltrados.map((insumo) => {
                  const baixo = insumo.quantidade < insumo.minimo && insumo.quantidade > insumo.minimo * 0.4;
                  const critico = insumo.quantidade <= insumo.minimo * 0.4;

                  const statusTexto = critico ? 'Crítico' : baixo ? 'Baixo' : 'Normal';
                  const statusClasse = critico
                    ? 'bg-rose-50 text-rose-600 border border-rose-100 font-bold'
                    : baixo
                    ? 'bg-amber-50 text-amber-600 border border-amber-100 font-bold'
                    : 'bg-emerald-50 text-emerald-600 border border-emerald-100 font-bold';

                  const isAdjusting = quickAdjustId === insumo.id;

                  return (
                    <tr key={insumo.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-800">{insumo.nome}</td>
                      <td className="py-4 px-6">
                        <span className="px-2.5 py-1 bg-slate-50 border border-slate-150 text-slate-500 rounded-md text-[10px] font-bold uppercase">
                          {insumo.categoria}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        {isAdjusting ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={quickAdjustValue}
                              onChange={(e) => setQuickAdjustValue(Number(e.target.value))}
                              className="w-16 px-1.5 py-1 text-center bg-slate-50 border border-slate-200 rounded-md font-bold focus:outline-none"
                            />
                            <span className="text-xs text-slate-400">{insumo.unidade}</span>
                            <button
                              onClick={() => saveQuickAdjust(insumo.id)}
                              className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg cursor-pointer"
                            >
                              Salvar
                            </button>
                          </div>
                        ) : (
                          <span className="font-bold text-slate-800">
                            {insumo.quantidade} <span className="text-xs text-slate-400 font-medium">{insumo.unidade}</span>
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-slate-500 font-semibold">
                        {insumo.minimo} {insumo.unidade}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs ${statusClasse}`}>
                          {statusTexto}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => triggerQuickAdjust(insumo)}
                            className="p-2 hover:bg-slate-100 text-slate-500 hover:text-slate-700 rounded-lg cursor-pointer transition"
                            title="Ajuste Rápido de Qtd"
                          >
                            <Layers size={13} />
                          </button>
                          <button
                            onClick={() => handleOpenEditar(insumo)}
                            className="p-2 hover:bg-slate-100 text-slate-500 hover:text-slate-700 rounded-lg cursor-pointer transition"
                            title="Editar Parâmetros"
                          >
                            <Edit size={13} />
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

      {/* Mobile Stock Cards */}
      <div className="md:hidden space-y-4">
        {ingredientesFiltrados.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs bg-white rounded-3xl border border-slate-100">
            Nenhum ingrediente em estoque.
          </div>
        ) : (
          ingredientesFiltrados.map((insumo) => {
            const baixo = insumo.quantidade < insumo.minimo && insumo.quantidade > insumo.minimo * 0.4;
            const critico = insumo.quantidade <= insumo.minimo * 0.4;

            const statusTexto = critico ? 'Crítico' : baixo ? 'Baixo' : 'Normal';
            const statusClasse = critico
              ? 'bg-rose-50 text-rose-600 border border-rose-100 font-bold'
              : baixo
              ? 'bg-amber-50 text-amber-600 border border-amber-100 font-bold'
              : 'bg-emerald-50 text-emerald-600 border border-emerald-100 font-bold';

            const isAdjusting = quickAdjustId === insumo.id;

            return (
              <div key={insumo.id} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm space-y-3.5">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{insumo.nome}</h4>
                    <span className="mt-1 inline-block px-2 py-0.5 bg-slate-50 border border-slate-150 text-slate-500 rounded-md text-[9px] font-bold uppercase">
                      {insumo.categoria}
                    </span>
                  </div>
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] ${statusClasse}`}>
                    {statusTexto}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs border-t border-b border-slate-50 py-2.5 font-medium text-slate-600">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Mínimo Ideal</span>
                    {insumo.minimo} {insumo.unidade}
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Quantidade</span>
                    {isAdjusting ? (
                      <div className="flex items-center gap-1.5 mt-1">
                        <input
                          type="number"
                          value={quickAdjustValue}
                          onChange={(e) => setQuickAdjustValue(Number(e.target.value))}
                          className="w-14 px-1 py-0.5 text-center bg-slate-50 border border-slate-200 rounded-md font-bold focus:outline-none text-xs"
                        />
                        <button
                          onClick={() => saveQuickAdjust(insumo.id)}
                          className="px-2 py-0.5 bg-emerald-500 text-white text-[10px] font-bold rounded-md cursor-pointer"
                        >
                          OK
                        </button>
                      </div>
                    ) : (
                      <span className="font-bold text-slate-800">
                        {insumo.quantidade} <span className="text-[10px] text-slate-400">{insumo.unidade}</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex justify-end items-center pt-1 gap-1.5 border-t border-slate-50">
                  <button
                    onClick={() => triggerQuickAdjust(insumo)}
                    className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg cursor-pointer transition flex items-center gap-1 text-[11px] font-bold"
                  >
                    <Layers size={11} /> Ajuste Rápido
                  </button>
                  <button
                    onClick={() => handleOpenEditar(insumo)}
                    className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-700 rounded-lg cursor-pointer transition"
                  >
                    <Edit size={14} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal - Create/Edit */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/55 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-slate-100 animate-scale-up">
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              {ingredienteEditando ? '✏️ Editar Ingrediente' : '📦 Adicionar Novo Item Insumo'}
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Registre o ingrediente básico para controle de estoque mínimo e receitas automáticas.
            </p>

            <form onSubmit={handleSalvar} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Nome do Insumo *</label>
                <input
                  type="text"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Frango Desfiado Swift"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Categoria *</label>
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-semibold"
                  >
                    {categoriasInsumos.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Unidade de Medida *</label>
                  <input
                    type="text"
                    required
                    value={unidade}
                    onChange={(e) => setUnidade(e.target.value)}
                    placeholder="Ex: Kg, Litros, Un."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Qtd Inicial em Estoque *</label>
                  <input
                    type="number"
                    required
                    value={quantidade}
                    onChange={(e) => setQuantidade(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Limite Alerta Mínimo *</label>
                  <input
                    type="number"
                    required
                    value={minimo}
                    onChange={(e) => setMinimo(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-semibold"
                  />
                </div>
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
                  Salvar Insumo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

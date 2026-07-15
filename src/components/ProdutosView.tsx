/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Tag, Percent, ToggleLeft, ToggleRight } from 'lucide-react';
import { Produto } from '../types';

interface ProdutosViewProps {
  produtos: Produto[];
  onAdicionarProduto: (produto: Omit<Produto, 'id'>) => void;
  onEditarProduto: (produto: Produto) => void;
  onExcluirProduto: (id: string) => void;
}

export default function ProdutosView({
  produtos,
  onAdicionarProduto,
  onEditarProduto,
  onExcluirProduto,
}: ProdutosViewProps) {
  const [busca, setBusca] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState('Todos');
  const [modalOpen, setModalOpen] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null);

  // Form states
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('Salgados');
  const [preco, setPreco] = useState(7.0);
  const [emoji, setEmoji] = useState('🥟');
  const [status, setStatus] = useState<'Disponível' | 'Indisponível'>('Disponível');

  const categorias = ['Todos', 'Salgados', 'Especial', 'Bebidas', 'Doces'];

  // Filter products
  const produtosFiltrados = produtos.filter((p) => {
    const atendeBusca = p.nome.toLowerCase().includes(busca.toLowerCase());
    const atendeCategoria = categoriaAtiva === 'Todos' || p.categoria === categoriaAtiva;
    return atendeBusca && atendeCategoria;
  });

  const handleOpenAdicionar = () => {
    setProdutoEditando(null);
    setNome('');
    setCategoria('Salgados');
    setPreco(7.0);
    setEmoji('🥟');
    setStatus('Disponível');
    setModalOpen(true);
  };

  const handleOpenEditar = (p: Produto) => {
    setProdutoEditando(p);
    setNome(p.nome);
    setCategoria(p.categoria);
    setPreco(p.preco);
    setEmoji(p.emoji);
    setStatus(p.status);
    setModalOpen(true);
  };

  const handleSalvar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return;

    if (produtoEditando) {
      onEditarProduto({
        ...produtoEditando,
        nome,
        categoria,
        preco,
        emoji,
        status,
      });
    } else {
      onAdicionarProduto({
        nome,
        categoria,
        preco,
        emoji,
        status,
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
            <span>🍔</span> Catálogo de Produtos
          </h1>
          <p className="text-slate-500 mt-1">Gerencie os preços, disponibilidades e categorias do cardápio.</p>
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
              placeholder="Pesquisar produto..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>
          <button
            onClick={handleOpenAdicionar}
            className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5 shadow-md shadow-orange-500/10 shrink-0 cursor-pointer"
          >
            <Plus size={15} /> + Novo Produto
          </button>
        </div>
      </div>

      {/* Category filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {categorias.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoriaAtiva(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              categoriaAtiva === cat
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/10'
                : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Card Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {produtosFiltrados.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-400 text-xs">
            Nenhum produto cadastrado nesta categoria.
          </div>
        ) : (
          produtosFiltrados.map((prod) => {
            const indisp = prod.status === 'Indisponível';
            return (
              <div
                key={prod.id}
                className={`bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition duration-200 flex flex-col justify-between relative ${
                  indisp ? 'opacity-65' : ''
                }`}
              >
                {/* Emoji Banner */}
                <div className="bg-orange-50/50 py-6 sm:py-10 text-center text-5xl sm:text-7xl select-none relative">
                  {prod.emoji}
                  {indisp && (
                    <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-rose-100 border border-rose-200 text-rose-600 text-[8px] font-bold rounded-md uppercase tracking-wide">
                      Esgotado
                    </span>
                  )}
                </div>

                {/* Info block */}
                <div className="p-3 sm:p-5 flex-1 flex flex-col justify-between space-y-3 sm:space-y-4">
                  <div>
                    <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-slate-50 text-slate-500 border border-slate-150 rounded-md text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">
                      {prod.categoria}
                    </span>
                    <h2 className="text-sm sm:text-lg font-bold text-slate-800 mt-1.5 sm:mt-2 truncate" title={prod.nome}>{prod.nome}</h2>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 sm:gap-0 pt-1">
                    <p className="text-lg sm:text-2xl font-black text-orange-500 tracking-tight">
                      {formatCurrency(prod.preco)}
                    </p>

                    {/* Quick action actions */}
                    <div className="inline-flex items-center gap-0.5 sm:gap-1">
                      <button
                        onClick={() => handleOpenEditar(prod)}
                        className="p-1.5 sm:p-2 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-lg transition cursor-pointer"
                        title="Editar Produto"
                      >
                        <Edit size={13} />
                      </button>
                      <button
                        onClick={() => onExcluirProduto(prod.id)}
                        className="p-1.5 sm:p-2 hover:bg-rose-50 text-rose-400 hover:text-rose-600 rounded-lg transition cursor-pointer"
                        title="Excluir Produto"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
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
              {produtoEditando ? '✏️ Editar Produto' : '🍔 Adicionar Novo Produto'}
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Insira as informações de preço e categoria para expor no PDV.
            </p>

            <form onSubmit={handleSalvar} className="space-y-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-3">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Nome do Produto *</label>
                  <input
                    type="text"
                    required
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Ex: Coxinha de Frango Catupiry"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Emoji *</label>
                  <input
                    type="text"
                    required
                    maxLength={2}
                    value={emoji}
                    onChange={(e) => setEmoji(e.target.value)}
                    placeholder="Ex: 🥟"
                    className="w-full text-center px-2 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-base focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Categoria *</label>
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-semibold"
                  >
                    {categorias.filter(c => c !== 'Todos').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Preço de Venda (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={preco}
                    onChange={(e) => setPreco(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Disponibilidade</label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-700">
                    <input
                      type="radio"
                      name="status"
                      value="Disponível"
                      checked={status === 'Disponível'}
                      onChange={() => setStatus('Disponível')}
                      className="text-orange-500 focus:ring-orange-500"
                    />
                    Disponível no PDV
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-700">
                    <input
                      type="radio"
                      name="status"
                      value="Indisponível"
                      checked={status === 'Indisponível'}
                      onChange={() => setStatus('Indisponível')}
                      className="text-orange-500 focus:ring-orange-500"
                    />
                    Indisponível / Esgotado
                  </label>
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
                  Salvar Produto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

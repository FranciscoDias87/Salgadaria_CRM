/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, ShoppingCart, Plus, Minus, Trash2, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { Cliente, Produto, ItemCarrinho, Pedido } from '../types';

interface NovoPedidoViewProps {
  clientes: Cliente[];
  produtos: Produto[];
  onFinalizarPedido: (pedido: Omit<Pedido, 'id' | 'data' | 'status'>) => Promise<{ success: boolean; error?: string }> | { success: boolean; error?: string };
}

export default function NovoPedidoView({ clientes, produtos, onFinalizarPedido }: NovoPedidoViewProps) {
  const [buscaCliente, setBuscaCliente] = useState('');
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null);
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);
  const [formaPagamento, setFormaPagamento] = useState<string>('');
  const [sucessoModal, setSucessoModal] = useState<{ open: boolean; total: number; id: string } | null>(null);
  const [erroMensagem, setErroMensagem] = useState<string | null>(null);
  const [abaAtiva, setAbaAtiva] = useState<'produtos' | 'carrinho'>('produtos');

  // Filter clients based on search
  const clientesFiltrados = buscaCliente.trim()
    ? clientes.filter((c) => c.nome.toLowerCase().includes(buscaCliente.toLowerCase()) || c.telefone.includes(buscaCliente))
    : [];

  const handleSelecionarCliente = (cliente: Cliente) => {
    setClienteSelecionado(cliente);
    setBuscaCliente('');
  };

  const handleAdicionarAoCarrinho = (produto: Produto) => {
    if (produto.status === 'Indisponível') return;

    setCarrinho((prev) => {
      const existente = prev.find((item) => item.produtoId === produto.id);
      if (existente) {
        return prev.map((item) =>
          item.produtoId === produto.id ? { ...item, quantidade: item.quantidade + 1 } : item
        );
      } else {
        return [
          ...prev,
          {
            produtoId: produto.id,
            nome: produto.nome,
            quantidade: 1,
            preco: produto.preco,
            emoji: produto.emoji,
          },
        ];
      }
    });
  };

  const handleMudarQuantidade = (produtoId: string, delta: number) => {
    setCarrinho((prev) =>
      prev
        .map((item) => {
          if (item.produtoId === produtoId) {
            const novaQtd = item.quantidade + delta;
            return { ...item, quantidade: novaQtd };
          }
          return item;
        })
        .filter((item) => item.quantidade > 0)
    );
  };

  const handleRemoverDoCarrinho = (produtoId: string) => {
    setCarrinho((prev) => prev.filter((item) => item.produtoId !== produtoId));
  };

  const totalCarrinho = carrinho.reduce((sum, item) => sum + item.preco * item.quantidade, 0);

  const handleFinalizar = async () => {
    if (carrinho.length === 0) {
      setErroMensagem('Adicione pelo menos um produto ao pedido!');
      return;
    }
    if (!formaPagamento) {
      setErroMensagem('Por favor, selecione uma forma de pagamento!');
      return;
    }

    const finalClienteNome = clienteSelecionado ? clienteSelecionado.nome : 'Consumidor Geral';
    const finalClienteId = clienteSelecionado ? clienteSelecionado.id : 'guest';

    // Verify Fiado rules if selected
    if (formaPagamento === 'Fiado') {
      if (!clienteSelecionado) {
        setErroMensagem('Pedidos no "Fiado" exigem o cadastro de um cliente!');
        return;
      }
      const limiteDisponivel = clienteSelecionado.fiadoLimite - clienteSelecionado.fiadoUsado;
      if (totalCarrinho > limiteDisponivel) {
        setErroMensagem(
          `Limite de Fiado insuficiente! Disponível: R$ ${limiteDisponivel.toFixed(2)}. Total: R$ ${totalCarrinho.toFixed(2)}.`
        );
        return;
      }
    }

    const resultado = await onFinalizarPedido({
      clienteId: finalClienteId,
      clienteNome: finalClienteNome,
      itens: carrinho,
      total: totalCarrinho,
      pagamento: formaPagamento as any,
    });

    if (resultado.success) {
      setSucessoModal({
        open: true,
        total: totalCarrinho,
        id: Math.random().toString(36).substr(2, 5).toUpperCase(),
      });
      // Clear cart
      setCarrinho([]);
      setClienteSelecionado(null);
      setFormaPagamento('');
      setErroMensagem(null);
    } else {
      setErroMensagem(resultado.error || 'Erro ao finalizar o pedido.');
    }
  };

  return (
    <div className="space-y-6 select-none relative">
      {/* View Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <span>🛒</span> Frente de Vendas (PDV)
          </h1>
          <p className="text-slate-500 mt-1">Clique nos produtos para montar a venda de forma rápida.</p>
        </div>

        {/* Client Selection Bar */}
        <div className="relative w-full md:w-80 z-20">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <Search size={18} />
            </span>
            <input
              type="text"
              value={buscaCliente}
              onChange={(e) => setBuscaCliente(e.target.value)}
              placeholder="Vincular cliente..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>

          {/* Client suggestions dropdown */}
          {clientesFiltrados.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-100 rounded-xl shadow-lg max-h-56 overflow-y-auto z-30">
              {clientesFiltrados.map((cliente) => (
                <button
                  key={cliente.id}
                  onClick={() => handleSelecionarCliente(cliente)}
                  className="w-full text-left px-4 py-3 hover:bg-orange-50/50 transition-colors flex flex-col border-b border-slate-50 last:border-b-0 cursor-pointer"
                >
                  <span className="text-sm font-semibold text-slate-800">{cliente.nome}</span>
                  <span className="text-[11px] text-slate-400 font-medium">{cliente.telefone}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {erroMensagem && (
        <div className="p-3 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-xs font-semibold flex items-center gap-2">
          <AlertCircle size={16} />
          {erroMensagem}
        </div>
      )}

      {/* Mobile-Only Tabs Navigation */}
      <div className="flex lg:hidden bg-slate-100 p-1 rounded-2xl gap-1">
        <button
          onClick={() => setAbaAtiva('produtos')}
          className={`flex-1 py-3 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
            abaAtiva === 'produtos' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          🍕 Cardápio ({produtos.length})
        </button>
        <button
          onClick={() => setAbaAtiva('carrinho')}
          className={`flex-1 py-3 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
            abaAtiva === 'carrinho' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          🛒 Carrinho
          {carrinho.length > 0 && (
            <span className="bg-orange-500 text-white font-mono text-[10px] px-1.5 py-0.5 rounded-full flex items-center justify-center font-black">
              {carrinho.reduce((sum, item) => sum + item.quantidade, 0)}
            </span>
          )}
        </button>
      </div>

      {/* Main Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products Grid (2/3 columns on desktop) */}
        <div className={`lg:col-span-2 space-y-4 ${abaAtiva === 'produtos' ? 'block' : 'hidden lg:block'}`}>
          {clienteSelecionado && (
            <div className="p-3.5 bg-orange-50/70 border border-orange-100 rounded-2xl flex items-center justify-between text-slate-700 text-xs">
              <div>
                Cliente selecionado: <span className="font-bold text-orange-600">{clienteSelecionado.nome}</span>
                {clienteSelecionado.fiadoLimite > 0 && (
                  <span className="ml-3 text-slate-500 font-medium">
                    (Limite Fiado: R$ {(clienteSelecionado.fiadoLimite - clienteSelecionado.fiadoUsado).toFixed(2)})
                  </span>
                )}
              </div>
              <button
                onClick={() => setClienteSelecionado(null)}
                className="text-orange-500 hover:text-orange-700 font-bold underline cursor-pointer"
              >
                Remover
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {produtos.map((produto) => {
              const isIndisponivel = produto.status === 'Indisponível';
              return (
                <div
                  key={produto.id}
                  onClick={() => handleAdicionarAoCarrinho(produto)}
                  className={`bg-white rounded-2xl p-5 border border-slate-100 shadow-sm text-center flex flex-col justify-between select-none transition-all duration-200 cursor-pointer ${
                    isIndisponivel
                      ? 'opacity-50 pointer-events-none'
                      : 'hover:shadow-md hover:border-orange-500/20 hover:bg-orange-50/10 active:scale-[0.98]'
                  }`}
                >
                  <div className="text-4xl sm:text-5xl mb-3">{produto.emoji}</div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm sm:text-base line-clamp-2">{produto.nome}</h3>
                    <p className="text-[10px] sm:text-xs text-slate-400 font-medium mt-1">{produto.categoria}</p>
                    <p className="text-lg sm:text-xl font-extrabold text-orange-500 mt-2 sm:mt-3">
                      R$ {produto.preco.toFixed(2)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Current Order Cart (1/3 column) */}
        <div className={`bg-white rounded-3xl p-6 shadow-sm border border-slate-100 h-fit space-y-6 ${abaAtiva === 'carrinho' ? 'block' : 'hidden lg:block'}`}>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Pedido Atual</h2>
            <p className="text-xs text-slate-400 mt-1">
              Vinculado a: <span className="font-bold text-slate-700">{clienteSelecionado ? clienteSelecionado.nome : 'Consumidor Geral'}</span>
            </p>
          </div>

          {/* Cart item list */}
          <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto pr-1">
            {carrinho.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
                <ShoppingCart className="text-slate-300" size={32} />
                Nenhum item adicionado ao carrinho.
              </div>
            ) : (
              carrinho.map((item) => (
                <div key={item.produtoId} className="py-3 flex items-center justify-between gap-3 text-sm">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xl">{item.emoji}</span>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 truncate text-xs">{item.nome}</p>
                      <p className="text-[10px] text-slate-400 font-semibold">
                        R$ {item.preco.toFixed(2)} x {item.quantidade}
                      </p>
                    </div>
                  </div>

                  {/* Increment/Decrement counter */}
                  <div className="flex items-center gap-1 bg-slate-50 border border-slate-100 rounded-lg p-0.5 shrink-0">
                    <button
                      onClick={() => handleMudarQuantidade(item.produtoId, -1)}
                      className="p-1 hover:bg-slate-200 text-slate-600 rounded cursor-pointer"
                    >
                      <Minus size={11} />
                    </button>
                    <span className="w-5 text-center text-xs font-bold text-slate-800">
                      {item.quantidade}
                    </span>
                    <button
                      onClick={() => handleMudarQuantidade(item.produtoId, 1)}
                      className="p-1 hover:bg-slate-200 text-slate-600 rounded cursor-pointer"
                    >
                      <Plus size={11} />
                    </button>
                  </div>

                  {/* Remove button */}
                  <button
                    onClick={() => handleRemoverDoCarrinho(item.produtoId)}
                    className="p-1.5 hover:bg-rose-50 text-rose-400 hover:text-rose-600 rounded-lg cursor-pointer shrink-0"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="h-px bg-slate-100"></div>

          {/* Total calculation */}
          <div className="flex justify-between items-end">
            <span className="text-slate-400 text-xs font-semibold">Total do Pedido</span>
            <span className="text-3xl font-black text-slate-800 tracking-tight">
              R$ {totalCarrinho.toFixed(2)}
            </span>
          </div>

          {/* Payment selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Forma de Pagamento *
            </label>
            <select
              value={formaPagamento}
              onChange={(e) => setFormaPagamento(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-medium"
            >
              <option value="">Selecione...</option>
              <option value="PIX">⚡ PIX</option>
              <option value="Dinheiro">💵 Dinheiro</option>
              <option value="Cartão de Crédito">💳 Cartão de Crédito</option>
              <option value="Cartão de Débito">💳 Cartão de Débito</option>
              <option value="Fiado">📝 Fiado (Caderneta)</option>
            </select>
          </div>

          {/* Checkout button */}
          <button
            onClick={handleFinalizar}
            className="w-full py-4 bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white font-bold rounded-2xl shadow-lg shadow-orange-500/10 cursor-pointer text-sm tracking-wide transition-all"
          >
            ✅ FINALIZAR PEDIDO
          </button>
        </div>
      </div>

      {/* Success Receipt Popup */}
      {sucessoModal && (
        <div className="fixed inset-0 bg-black/55 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl border border-slate-100 text-center animate-scale-up space-y-4">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto text-3xl">
              <CheckCircle2 size={36} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">Pedido Finalizado!</h3>
              <p className="text-xs text-slate-400 mt-1">Salgado fresco a caminho da produção.</p>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-left font-mono text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Cupom ID:</span>
                <span className="font-bold text-slate-700">#{sucessoModal.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Pagamento:</span>
                <span className="font-bold text-slate-700">{formaPagamento || 'PIX'}</span>
              </div>
              <div className="h-px bg-dashed bg-slate-200 my-2"></div>
              <div className="flex justify-between text-sm font-bold">
                <span className="text-slate-800">VALOR PAGO:</span>
                <span className="text-orange-500">R$ {sucessoModal.total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => setSucessoModal(null)}
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs transition cursor-pointer"
            >
              OK, Continuar Vendendo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

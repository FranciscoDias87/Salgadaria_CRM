/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Plus, Minus, Lock, Unlock, FileText, Calendar, PlusCircle, MinusCircle, CheckCircle } from 'lucide-react';
import { CaixaTransacao, Pedido } from '../types';

interface CaixaViewProps {
  transacoes: CaixaTransacao[];
  pedidos: Pedido[];
  onLancarTransacao: (transacao: Omit<CaixaTransacao, 'id' | 'hora'>) => void;
}

export default function CaixaView({ transacoes, pedidos, onLancarTransacao }: CaixaViewProps) {
  const [caixaAberto, setCaixaAberto] = useState(true);
  const [modalEntradaOpen, setModalEntradaOpen] = useState(false);
  const [modalSaidaOpen, setModalSaidaOpen] = useState(false);
  const [modalFechamentoOpen, setModalFechamentoOpen] = useState(false);

  // Form states
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState(0);
  const [formaPagamento, setFormaPagamento] = useState('Dinheiro');

  // Dynamic statistics
  const saldoInicial = transacoes.find(t => t.descricao === 'Abertura de Caixa')?.valor || 200;

  const totalEntradas = transacoes
    .filter(t => t.tipo === 'entrada' && t.descricao !== 'Abertura de Caixa')
    .reduce((sum, t) => sum + t.valor, 0);

  const totalSaidas = transacoes
    .filter(t => t.tipo === 'saida')
    .reduce((sum, t) => sum + t.valor, 0);

  const totalVendasContador = pedidos.length;

  const saldoAtual = saldoInicial + totalEntradas - totalSaidas;

  const formatCurrency = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const handleSalvarEntrada = (e: React.FormEvent) => {
    e.preventDefault();
    if (!descricao.trim() || valor <= 0) return;

    onLancarTransacao({
      descricao,
      tipo: 'entrada',
      formaPagamento,
      valor,
      status: 'Confirmado',
    });

    setDescricao('');
    setValor(0);
    setFormaPagamento('Dinheiro');
    setModalEntradaOpen(false);
  };

  const handleSalvarSaida = (e: React.FormEvent) => {
    e.preventDefault();
    if (!descricao.trim() || valor <= 0) return;

    onLancarTransacao({
      descricao,
      tipo: 'saida',
      formaPagamento,
      valor,
      status: 'Pago',
    });

    setDescricao('');
    setValor(0);
    setFormaPagamento('Dinheiro');
    setModalSaidaOpen(false);
  };

  const toggleCaixaStatus = () => {
    if (caixaAberto) {
      // Trigger a soft warning or proceed to close
      setModalFechamentoOpen(true);
    } else {
      // Open box
      setCaixaAberto(true);
      onLancarTransacao({
        descricao: 'Abertura de Caixa',
        tipo: 'entrada',
        formaPagamento: 'Dinheiro',
        valor: 200,
        status: 'Confirmado',
      });
    }
  };

  return (
    <div className="space-y-6 select-none relative">
      {/* View Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
              <span>💰</span> Fluxo de Caixa Diário
            </h1>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border ${
                caixaAberto
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                  : 'bg-rose-50 text-rose-600 border-rose-100'
              }`}
            >
              {caixaAberto ? '● Caixa Aberto' : '● Caixa Fechado'}
            </span>
          </div>
          <p className="text-slate-500 mt-1">
            Lance suprimentos, faça sangrias e confira o fechamento fiscal do dia de trabalho.
          </p>
        </div>

        <button
          onClick={() => setModalFechamentoOpen(true)}
          className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5 shadow-md shadow-orange-500/10 cursor-pointer"
        >
          <FileText size={15} /> Gerar Fechamento
        </button>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Saldo Inicial</span>
          <span className="text-xl font-extrabold text-slate-700 mt-2">{formatCurrency(saldoInicial)}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Entradas</span>
          <span className="text-xl font-extrabold text-emerald-600 mt-2">{formatCurrency(totalEntradas)}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Saídas</span>
          <span className="text-xl font-extrabold text-rose-500 mt-2">{formatCurrency(totalSaidas)}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Vendas Balcão</span>
          <span className="text-xl font-extrabold text-orange-500 mt-2">{totalVendasContador}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between col-span-2 md:col-span-1">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Saldo Atual</span>
          <span className="text-2xl font-black text-emerald-600 mt-2">{formatCurrency(saldoAtual)}</span>
        </div>
      </div>

      {/* Block box warnings if closed */}
      {!caixaAberto && (
        <div className="p-8 bg-rose-50 border border-rose-100 rounded-3xl text-center space-y-4">
          <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto text-2xl">
            <Lock size={28} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">O Caixa Está Fechado!</h3>
            <p className="text-xs text-slate-400 mt-1">Você deve abrir o caixa para iniciar transações ou novos pedidos.</p>
          </div>
          <button
            onClick={toggleCaixaStatus}
            className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs transition shadow-md shadow-orange-500/10 cursor-pointer"
          >
            🔓 Abrir Caixa Diário
          </button>
        </div>
      )}

      {/* Cash Log Table & Cards */}
      {caixaAberto && (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 text-xs font-semibold bg-slate-50/50">
                    <th className="py-4 px-6 font-semibold uppercase tracking-wider">Hora</th>
                    <th className="py-4 px-6 font-semibold uppercase tracking-wider">Descrição</th>
                    <th className="py-4 px-6 font-semibold uppercase tracking-wider">Forma de Pagamento</th>
                    <th className="py-4 px-6 font-semibold uppercase tracking-wider">Valor</th>
                    <th className="py-4 px-6 font-semibold uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-slate-700 text-sm">
                  {[...transacoes].reverse().map((t) => {
                    const isEntrada = t.tipo === 'entrada';
                    return (
                      <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-6 text-slate-400 font-mono text-xs font-semibold">{t.hora}</td>
                        <td className="py-4 px-6 font-bold text-slate-800">{t.descricao}</td>
                        <td className="py-4 px-6">
                          <span className="px-2 py-0.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-500 font-medium">
                            {t.formaPagamento}
                          </span>
                        </td>
                        <td className={`py-4 px-6 font-bold ${isEntrada ? 'text-emerald-600' : 'text-rose-500'}`}>
                          {isEntrada ? '+' : '-'} {formatCurrency(t.valor)}
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              t.status === 'Confirmado' || t.status === 'Recebido'
                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {t.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Transaction Cards */}
          <div className="md:hidden space-y-4">
            {[...transacoes].reverse().map((t) => {
              const isEntrada = t.tipo === 'entrada';
              return (
                <div key={t.id} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] text-slate-400 font-mono font-bold block">{t.hora}</span>
                      <h4 className="font-bold text-slate-800 text-sm mt-0.5">{t.descricao}</h4>
                    </div>
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        t.status === 'Confirmado' || t.status === 'Recebido'
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-slate-50">
                    <span className="px-2 py-0.5 bg-slate-50 border border-slate-200 rounded text-[10px] text-slate-500 font-bold">
                      {t.formaPagamento}
                    </span>
                    <span className={`font-extrabold text-sm ${isEntrada ? 'text-emerald-600' : 'text-rose-500'}`}>
                      {isEntrada ? '+' : '-'} {formatCurrency(t.valor)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Cash drawer bottom actions */}
      {caixaAberto && (
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={() => setModalEntradaOpen(true)}
            className="w-full sm:flex-1 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2 cursor-pointer text-sm"
          >
            <PlusCircle size={18} /> Nova Entrada (Suprimento)
          </button>
          <button
            onClick={() => setModalSaidaOpen(true)}
            className="w-full sm:flex-1 py-4 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-2xl shadow-lg shadow-rose-500/10 flex items-center justify-center gap-2 cursor-pointer text-sm"
          >
            <MinusCircle size={18} /> Nova Saída (Sangria / Despesa)
          </button>
          <button
            onClick={toggleCaixaStatus}
            className="w-full sm:flex-1 py-4 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-2xl shadow-lg shadow-slate-800/10 flex items-center justify-center gap-2 cursor-pointer text-sm"
          >
            <Lock size={18} /> Fechar Caixa Diário
          </button>
        </div>
      )}

      {/* Modal - Nova Entrada */}
      {modalEntradaOpen && (
        <div className="fixed inset-0 bg-black/55 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl border border-slate-100 animate-scale-up">
            <h3 className="text-xl font-bold text-slate-800 mb-2">➕ Registrar Entrada</h3>
            <p className="text-xs text-slate-400 mb-6">Insira um aporte ou troco manual de caixa (suprimento).</p>

            <form onSubmit={handleSalvarEntrada} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Descrição / Motivo *</label>
                <input
                  type="text"
                  required
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Ex: Reforço de moedas"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Valor (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={valor}
                    onChange={(e) => setValor(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Forma *</label>
                  <select
                    value={formaPagamento}
                    onChange={(e) => setFormaPagamento(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none"
                  >
                    <option value="Dinheiro">Dinheiro</option>
                    <option value="PIX">PIX</option>
                    <option value="Cartão">Cartão</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setModalEntradaOpen(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl text-xs transition cursor-pointer"
                >
                  Confirmar Aporte
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal - Nova Saída */}
      {modalSaidaOpen && (
        <div className="fixed inset-0 bg-black/55 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl border border-slate-100 animate-scale-up">
            <h3 className="text-xl font-bold text-slate-800 mb-2">➖ Sangria / Registrar Despesa</h3>
            <p className="text-xs text-slate-400 mb-6">Retirada de valor em dinheiro do caixa para despesas urgentes.</p>

            <form onSubmit={handleSalvarSaida} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Descrição / Destinatário *</label>
                <input
                  type="text"
                  required
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Ex: Compra de Gás ou Verduras"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Valor (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={valor}
                    onChange={(e) => setValor(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Forma *</label>
                  <select
                    value={formaPagamento}
                    onChange={(e) => setFormaPagamento(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none"
                  >
                    <option value="Dinheiro">Dinheiro</option>
                    <option value="PIX">PIX</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setModalSaidaOpen(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-xl text-xs transition cursor-pointer"
                >
                  Confirmar Sangria
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Fechamento Fiscal Report Modal */}
      {modalFechamentoOpen && (
        <div className="fixed inset-0 bg-black/55 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl border border-slate-100 animate-scale-up space-y-4">
            <div className="text-center">
              <span className="text-4xl text-orange-500">📄</span>
              <h3 className="text-xl font-bold text-slate-800 mt-2">Fechamento do Caixa</h3>
              <p className="text-xs text-slate-400">Resumo de movimentações diárias para conciliação.</p>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 font-mono text-xs space-y-2.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Abertura:</span>
                <span className="font-bold text-slate-700">{formatCurrency(saldoInicial)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">(+) Entradas Totais:</span>
                <span className="font-bold text-emerald-600">+{formatCurrency(totalEntradas)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">(-) Saídas/Sangrias:</span>
                <span className="font-bold text-rose-500">-{formatCurrency(totalSaidas)}</span>
              </div>
              <div className="flex justify-between border-t border-dashed border-slate-200 pt-2 text-sm font-black">
                <span className="text-slate-800">SALDO LÍQUIDO:</span>
                <span className="text-emerald-600">{formatCurrency(saldoAtual)}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setModalFechamentoOpen(false)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition cursor-pointer"
              >
                Voltar
              </button>
              <button
                onClick={() => {
                  setCaixaAberto(false);
                  setModalFechamentoOpen(false);
                }}
                className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs transition cursor-pointer"
              >
                Confirmar Fechamento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

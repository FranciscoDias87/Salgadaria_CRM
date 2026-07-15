/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ChefHat, Clock, CheckCircle2, Play, Check } from 'lucide-react';
import { Pedido } from '../types';

interface CozinhaViewProps {
  pedidos: Pedido[];
  onAtualizarStatusPedido: (id: string, status: Pedido['status']) => void;
}

export default function CozinhaView({ pedidos, onAtualizarStatusPedido }: CozinhaViewProps) {
  // Filter only active orders for the kitchen
  const activeOrders = pedidos.filter((p) => p.status !== 'Entregue');

  const formatTime = (isoString: string) => {
    try {
      if (isoString.includes('T')) {
        return isoString.split('T')[1].substr(0, 5);
      }
      return '12:00';
    } catch {
      return '12:00';
    }
  };

  return (
    <div className="space-y-6 select-none">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <span>🍳</span> Monitor da Cozinha (KDS)
          </h1>
          <p className="text-slate-500 mt-1">
            Fila de produção em tempo real para fritos, assados e entrega.
          </p>
        </div>

        {/* Kitchen Stats */}
        <div className="flex gap-4">
          <div className="bg-orange-500 text-white px-4 py-2 rounded-2xl flex items-center gap-2 shadow-sm">
            <ChefHat size={18} />
            <span className="text-xs font-bold font-mono">
              {activeOrders.filter((o) => o.status === 'Preparando').length} em preparo
            </span>
          </div>
          <div className="bg-emerald-500 text-white px-4 py-2 rounded-2xl flex items-center gap-2 shadow-sm">
            <CheckCircle2 size={18} />
            <span className="text-xs font-bold font-mono">
              {activeOrders.filter((o) => o.status === 'Pronto').length} prontos
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Pending Kitchen Tickets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeOrders.length === 0 ? (
          <div className="col-span-full py-20 bg-white rounded-3xl border border-slate-100 shadow-sm text-center space-y-4">
            <ChefHat size={48} className="text-slate-300 mx-auto animate-bounce" />
            <div>
              <h3 className="font-bold text-slate-700">Tudo em ordem na cozinha!</h3>
              <p className="text-xs text-slate-400 mt-1">Nenhum pedido pendente para produção.</p>
            </div>
          </div>
        ) : (
          activeOrders.map((pedido) => {
            const isPreparando = pedido.status === 'Preparando';
            const isPronto = pedido.status === 'Pronto';

            return (
              <div
                key={pedido.id}
                className={`bg-white rounded-3xl overflow-hidden shadow-sm border flex flex-col justify-between ${
                  isPronto
                    ? 'border-emerald-200 ring-2 ring-emerald-500/20'
                    : isPreparando
                    ? 'border-orange-200 ring-2 ring-orange-500/10'
                    : 'border-slate-100'
                }`}
              >
                {/* Card Title Header */}
                <div
                  className={`p-4 flex justify-between items-center ${
                    isPronto ? 'bg-emerald-50/50' : isPreparando ? 'bg-orange-50/50' : 'bg-slate-50'
                  }`}
                >
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">Freguês: {pedido.clienteNome}</h3>
                    <p className="text-[10px] text-slate-400 font-bold font-mono">Código: #{pedido.id}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                    <Clock size={12} />
                    {formatTime(pedido.data)}
                  </div>
                </div>

                {/* Items body */}
                <div className="p-5 flex-1 space-y-3">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Itens do Cupom</p>
                  <ul className="space-y-2 text-sm text-slate-700 font-medium">
                    {pedido.itens.map((item, idx) => (
                      <li key={idx} className="flex justify-between border-b border-slate-50 pb-1.5 last:border-b-0">
                        <span className="flex items-center gap-1.5">
                          <span>{item.emoji}</span>
                          <span>
                            {item.quantidade}x {item.nome}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Interactive Status Controls Footer */}
                <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex gap-2">
                  {!isPreparando && !isPronto && (
                    <button
                      onClick={() => onAtualizarStatusPedido(pedido.id, 'Preparando')}
                      className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Play size={13} /> Começar Preparo
                    </button>
                  )}

                  {isPreparando && (
                    <button
                      onClick={() => onAtualizarStatusPedido(pedido.id, 'Pronto')}
                      className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      🔔 Pronto para Retirada
                    </button>
                  )}

                  {isPronto && (
                    <button
                      onClick={() => onAtualizarStatusPedido(pedido.id, 'Entregue')}
                      className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Check size={13} /> Entregar ao Cliente
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

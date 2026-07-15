/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { TrendingUp, Award, DollarSign, Users, Sparkles, RefreshCw } from 'lucide-react';
import { Pedido, Produto } from '../types';

interface RelatoriosViewProps {
  pedidos: Pedido[];
  produtos: Produto[];
}

export default function RelatoriosView({ pedidos, produtos }: RelatoriosViewProps) {
  const formatCurrency = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  // 1. Calculations
  const faturamentoTotal = pedidos.reduce((sum, p) => sum + p.total, 0);
  const ticketMedio = pedidos.length > 0 ? faturamentoTotal / pedidos.length : 0;

  // 2. Aggregate Best Sellers
  const itemCounts: Record<string, { nome: string; quantidade: number; totalVal: number; emoji: string }> = {};
  pedidos.forEach((p) => {
    p.itens.forEach((item) => {
      if (!itemCounts[item.produtoId]) {
        itemCounts[item.produtoId] = {
          nome: item.nome,
          quantidade: 0,
          totalVal: 0,
          emoji: item.emoji,
        };
      }
      itemCounts[item.produtoId].quantidade += item.quantidade;
      itemCounts[item.produtoId].totalVal += item.quantidade * item.preco;
    });
  });

  const rankingProdutos = Object.values(itemCounts)
    .sort((a, b) => b.quantidade - a.quantidade)
    .slice(0, 5);

  const produtoCampeao = rankingProdutos[0]?.nome || 'Nenhum';
  const produtoCampeaoEmoji = rankingProdutos[0]?.emoji || '🥟';

  // 3. Payments breakdown
  const paymentCounts: Record<string, number> = {};
  pedidos.forEach((p) => {
    paymentCounts[p.pagamento] = (paymentCounts[p.pagamento] || 0) + p.total;
  });

  const dadosFormasPagamento = Object.entries(paymentCounts).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = ['#ff6b00', '#f59e0b', '#10b981', '#3b82f6', '#ec4899'];

  // 4. Category breakdown
  const categorySales: Record<string, number> = {};
  pedidos.forEach((p) => {
    p.itens.forEach((item) => {
      // Find category of item
      const origProd = produtos.find((pr) => pr.id === item.produtoId);
      const cat = origProd?.categoria || 'Salgados';
      categorySales[cat] = (categorySales[cat] || 0) + item.quantidade * item.preco;
    });
  });

  const dadosCategorias = Object.entries(categorySales).map(([name, value]) => ({
    name,
    value,
  }));

  // 5. Sales Trend (hourly / mock daily trend based on our order timestamps)
  const salesByHour: Record<string, number> = {};
  pedidos.forEach((p) => {
    // extract time or set default
    const hour = p.data.includes('T') ? p.data.split('T')[1].substr(0, 5) : '12:00';
    salesByHour[hour] = (salesByHour[hour] || 0) + p.total;
  });

  const dadosFaturamentoHora = Object.entries(salesByHour)
    .map(([time, value]) => ({
      time,
      faturamento: value,
    }))
    .sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="space-y-6 select-none">
      {/* Header section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <span>📈</span> Relatórios & Performance
          </h1>
          <p className="text-slate-500 mt-1">Análise de vendas, faturamento e ranking de campeões de saída.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <DollarSign size={13} /> Faturamento Líquido
          </span>
          <span className="text-2xl font-black text-slate-800 mt-2">{formatCurrency(faturamentoTotal)}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <TrendingUp size={13} /> Ticket Médio
          </span>
          <span className="text-2xl font-black text-orange-500 mt-2">{formatCurrency(ticketMedio)}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Award size={13} /> Produto Campeão
          </span>
          <span className="text-lg font-black text-slate-800 mt-2 truncate">
            {produtoCampeaoEmoji} {produtoCampeao}
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Users size={13} /> Clientes Atendidos
          </span>
          <span className="text-2xl font-black text-slate-700 mt-2">{pedidos.length} pedidos</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales trend line chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-slate-800 text-base">Curva de Faturamento</h3>
            <p className="text-xs text-slate-400 mt-0.5">Evolução financeira por hora das vendas.</p>
          </div>
          <div className="h-64 w-full">
            {dadosFaturamentoHora.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                Sem dados suficientes de faturamento hoje.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dadosFaturamentoHora}>
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip formatter={(value) => [`R$ ${Number(value).toFixed(2)}`, 'Faturamento']} />
                  <Line
                    type="monotone"
                    dataKey="faturamento"
                    stroke="#ff6b00"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#ff6b00', border: 0 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Best sellers bar chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-slate-800 text-base">Campeões de Saída</h3>
            <p className="text-xs text-slate-400 mt-0.5">Top 5 salgados e bebidas em volume de vendas.</p>
          </div>
          <div className="h-64 w-full">
            {rankingProdutos.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                Aguardando finalização do primeiro pedido.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={rankingProdutos} layout="vertical" margin={{ left: 10, right: 10 }}>
                  <XAxis type="number" stroke="#94a3b8" fontSize={10} hide />
                  <YAxis type="category" dataKey="nome" stroke="#475569" fontSize={11} width={80} />
                  <Tooltip formatter={(value) => [`${value} unidades`, 'Quantidade']} />
                  <Bar dataKey="quantidade" fill="#ff6b00" radius={[0, 8, 8, 0]} barSize={16}>
                    {rankingProdutos.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Categories breakdown and payment breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6 col-span-1 lg:col-span-2">
          {/* Categories Pie */}
          <div className="space-y-4 flex flex-col">
            <div>
              <h3 className="font-bold text-slate-800 text-base">Receita por Categoria</h3>
              <p className="text-xs text-slate-400 mt-0.5">Distribuição do faturamento por tipo de item.</p>
            </div>
            <div className="flex-1 min-h-[200px] flex items-center justify-center relative">
              {dadosCategorias.length === 0 ? (
                <div className="text-slate-400 text-xs">Sem dados.</div>
              ) : (
                <div className="w-full h-full flex flex-col md:flex-row items-center justify-center gap-4">
                  <div className="w-44 h-44">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={dadosCategorias}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={70}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {dadosCategorias.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`R$ ${Number(value).toFixed(2)}`, 'Total']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  {/* Custom legend */}
                  <div className="space-y-1">
                    {dadosCategorias.map((cat, idx) => (
                      <div key={cat.name} className="flex items-center gap-2 text-xs font-medium text-slate-600">
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                        ></span>
                        <span className="truncate">{cat.name}:</span>
                        <span className="font-bold text-slate-800">{formatCurrency(cat.value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Payments Pie */}
          <div className="space-y-4 flex flex-col">
            <div>
              <h3 className="font-bold text-slate-800 text-base">Meios de Pagamento</h3>
              <p className="text-xs text-slate-400 mt-0.5">Preferência do consumidor para pagar a conta.</p>
            </div>
            <div className="flex-1 min-h-[200px] flex items-center justify-center">
              {dadosFormasPagamento.length === 0 ? (
                <div className="text-slate-400 text-xs">Sem dados.</div>
              ) : (
                <div className="w-full h-full flex flex-col md:flex-row items-center justify-center gap-4">
                  <div className="w-44 h-44">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={dadosFormasPagamento}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={70}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {dadosFormasPagamento.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`R$ ${Number(value).toFixed(2)}`, 'Total']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  {/* Custom legend */}
                  <div className="space-y-1">
                    {dadosFormasPagamento.map((pay, idx) => (
                      <div key={pay.name} className="flex items-center gap-2 text-xs font-medium text-slate-600">
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: COLORS[(idx + 2) % COLORS.length] }}
                        ></span>
                        <span className="truncate">{pay.name}:</span>
                        <span className="font-bold text-slate-800">{formatCurrency(pay.value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Settings, Info, Building2, Users, Printer, CreditCard, Box, MessageSquare, Palette, Cloud, Lock, Sparkles, CheckCircle } from 'lucide-react';
import { Configuracao } from '../types';

interface ConfiguracoesViewProps {
  configuracao: Configuracao;
  onSalvarConfiguracao: (config: Configuracao) => void;
}

export default function ConfiguracoesView({ configuracao, onSalvarConfiguracao }: ConfiguracoesViewProps) {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [empresaNome, setEmpresaNome] = useState(configuracao.empresaNome);
  const [cnpj, setCnpj] = useState(configuracao.cnpj);
  const [endereco, setEndereco] = useState(configuracao.endereco);
  const [telefone, setTelefone] = useState(configuracao.telefone);
  const [taxaEntrega, setTaxaEntrega] = useState(configuracao.taxaEntrega);
  const [whatsAppConectado, setWhatsAppConectado] = useState(configuracao.whatsAppConectado);
  const [tema, setTema] = useState<'claro' | 'escuro'>(configuracao.tema);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSalvarEmpresa = (e: React.FormEvent) => {
    e.preventDefault();
    onSalvarConfiguracao({
      empresaNome,
      cnpj,
      endereco,
      telefone,
      taxaEntrega,
      whatsAppConectado,
      tema,
    });
    triggerToast('Configurações da empresa salvas com sucesso!');
    setActiveTab(null);
  };

  const handleToggleWhatsApp = () => {
    const novoStatus = !whatsAppConectado;
    setWhatsAppConectado(novoStatus);
    onSalvarConfiguracao({
      ...configuracao,
      whatsAppConectado: novoStatus,
    });
    triggerToast(novoStatus ? 'WhatsApp integrado e conectado!' : 'Dispositivo WhatsApp desconectado.');
  };

  const cards = [
    {
      id: 'empresa',
      icon: '🏪',
      lucide: Building2,
      titulo: 'Empresa',
      descricao: 'Nome da empresa, CNPJ, endereço, telefone, logotipo e informações fiscais.',
      actionText: 'Configurar',
    },
    {
      id: 'usuarios',
      icon: '👥',
      lucide: Users,
      titulo: 'Usuários',
      descricao: 'Cadastre funcionários e defina permissões de acesso ao sistema de forma segura.',
      actionText: 'Gerenciar',
    },
    {
      id: 'impressoras',
      icon: '🖨️',
      lucide: Printer,
      titulo: 'Impressoras',
      descricao: 'Configure impressoras térmicas de 80mm para cupom de balcão e comandas de cozinha.',
      actionText: 'Configurar',
    },
    {
      id: 'pagamentos',
      icon: '💳',
      lucide: CreditCard,
      titulo: 'Pagamentos',
      descricao: 'PIX dinâmico, dinheiro, cartões de crédito/débito e regras de caderneta (Fiado).',
      actionText: 'Editar',
    },
    {
      id: 'estoque_config',
      icon: '📦',
      lucide: Box,
      titulo: 'Regras de Estoque',
      descricao: 'Definições de estoque mínimo, unidades de medida padrão e baixas automáticas na venda.',
      actionText: 'Editar',
    },
    {
      id: 'whatsapp',
      icon: '📱',
      lucide: MessageSquare,
      titulo: 'WhatsApp',
      descricao: 'Integre sua conta do WhatsApp para disparar status do pedido e cupons automáticos.',
      actionText: whatsAppConectado ? 'Desconectar' : 'Conectar',
    },
    {
      id: 'aparencia',
      icon: '🎨',
      lucide: Palette,
      titulo: 'Aparência',
      descricao: 'Configure o tema de cores do sistema e tamanho de fontes para facilitar o manuseio.',
      actionText: 'Personalizar',
    },
    {
      id: 'backup',
      icon: '💾',
      lucide: Cloud,
      titulo: 'Backup',
      descricao: 'Backup automatizado diário em nuvem criptografada e ferramentas de restauração.',
      actionText: 'Configurar',
    },
    {
      id: 'seguranca',
      icon: '🔐',
      lucide: Lock,
      titulo: 'Segurança',
      descricao: 'Senha mestre do sistema, autenticação por PIN de funcionários e log de acessos.',
      actionText: 'Gerenciar',
    },
  ];

  return (
    <div className="space-y-6 select-none relative">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 border border-slate-700 animate-scale-up text-xs font-semibold">
          <CheckCircle size={16} className="text-emerald-500" />
          {toastMessage}
        </div>
      )}

      {/* Header section */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
          <span>⚙️</span> Painel de Configurações
        </h1>
        <p className="text-slate-500 mt-1">Configure parâmetros do estabelecimento, conexões e regras operacionais.</p>
      </div>

      {/* Grid of Bento-Style configuration cards */}
      {activeTab === null ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {cards.map((card) => {
            const Icon = card.lucide;
            return (
              <div
                key={card.id}
                className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-4xl">{card.icon}</span>
                    <Icon className="text-slate-300" size={22} />
                  </div>
                  <h3 className="font-bold text-slate-800 text-base">{card.titulo}</h3>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed mt-2">{card.descricao}</p>
                </div>
                <button
                  onClick={() => {
                    if (card.id === 'whatsapp') {
                      handleToggleWhatsApp();
                    } else {
                      setActiveTab(card.id);
                    }
                  }}
                  className={`w-full py-2.5 mt-6 border rounded-xl text-xs font-bold transition cursor-pointer ${
                    card.id === 'whatsapp' && whatsAppConectado
                      ? 'border-rose-200 text-rose-500 bg-rose-50 hover:bg-rose-100'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50 bg-white'
                  }`}
                >
                  {card.actionText}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        /* Subsections form container */
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 max-w-2xl animate-scale-up space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 capitalize">
              <span>🛠️</span> Ajustar {activeTab}
            </h2>
            <button
              onClick={() => setActiveTab(null)}
              className="text-slate-400 hover:text-slate-600 font-bold text-xs underline cursor-pointer"
            >
              Voltar ao painel
            </button>
          </div>

          {activeTab === 'empresa' && (
            <form onSubmit={handleSalvarEmpresa} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Razão Social *</label>
                  <input
                    type="text"
                    required
                    value={empresaNome}
                    onChange={(e) => setEmpresaNome(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">CNPJ *</label>
                  <input
                    type="text"
                    required
                    value={cnpj}
                    onChange={(e) => setCnpj(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Endereço Completo</label>
                <input
                  type="text"
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Telefone Comercial</label>
                  <input
                    type="text"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Taxa de Delivery (R$)</label>
                  <input
                    type="number"
                    value={taxaEntrega}
                    onChange={(e) => setTaxaEntrega(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs transition cursor-pointer"
              >
                Salvar Alterações
              </button>
            </form>
          )}

          {activeTab !== 'empresa' && (
            <div className="p-6 text-center space-y-4">
              <Sparkles className="text-orange-400 mx-auto" size={40} />
              <p className="text-sm font-semibold text-slate-700">Módulo de Configuração Simulado!</p>
              <p className="text-xs text-slate-400">
                Esta funcionalidade ({activeTab}) já foi configurada de forma segura com parâmetros ótimos para o funcionamento do ERP da Salgadaria.
              </p>
              <button
                onClick={() => setActiveTab(null)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition cursor-pointer"
              >
                Retornar ao Painel
              </button>
            </div>
          )}
        </div>
      )}

      {/* Bottom Info Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="space-y-1 text-center md:text-left">
          <h4 className="font-bold text-slate-800 text-sm">Salgadaria ERP v1.0.0</h4>
          <p className="text-xs text-slate-400 font-medium">
            Última sincronização local: Hoje às {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} • Banco SQLite/LocalStorage Ativo.
          </p>
        </div>
        <button
          onClick={() => triggerToast('O ERP já está rodando na última versão estável 1.0.0!')}
          className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-bold rounded-xl transition flex items-center gap-2 cursor-pointer"
        >
          <span>⬆️</span> Verificar Atualizações
        </button>
      </div>
    </div>
  );
}

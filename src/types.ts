/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  totalGasto: number;
  cadastroData: string;
  fiadoLimite: number;
  fiadoUsado: number;
}

export interface Produto {
  id: string;
  nome: string;
  categoria: string;
  preco: number;
  emoji: string;
  status: 'Disponível' | 'Indisponível';
}

export interface Ingrediente {
  id: string;
  nome: string;
  categoria: string;
  quantidade: number;
  unidade: string;
  minimo: number;
}

export interface ItemCarrinho {
  produtoId: string;
  nome: string;
  quantidade: number;
  preco: number;
  emoji: string;
}

export interface Pedido {
  id: string;
  clienteId: string;
  clienteNome: string;
  itens: ItemCarrinho[];
  total: number;
  data: string; // ISO String or format hh:mm
  status: 'Pendente' | 'Preparando' | 'Pronto' | 'Entregue';
  pagamento: 'PIX' | 'Dinheiro' | 'Cartão de Crédito' | 'Cartão de Débito' | 'Fiado';
}

export interface CaixaTransacao {
  id: string;
  hora: string;
  descricao: string;
  tipo: 'entrada' | 'saida';
  formaPagamento: string;
  valor: number;
  status: 'Confirmado' | 'Recebido' | 'Pago';
}

export interface Configuracao {
  empresaNome: string;
  cnpj: string;
  endereco: string;
  telefone: string;
  taxaEntrega: number;
  whatsAppConectado: boolean;
  tema: 'claro' | 'escuro';
}

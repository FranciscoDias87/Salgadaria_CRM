/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Cliente, Produto, Ingrediente, Pedido, CaixaTransacao, Configuracao } from '../types';

export const INITIAL_CLIENTES: Cliente[] = [
  {
    id: 'c1',
    nome: 'Maria Silva',
    telefone: '(11) 98765-4321',
    email: 'maria.silva@email.com',
    totalGasto: 182.50,
    cadastroData: '2026-02-15',
    fiadoLimite: 150.00,
    fiadoUsado: 0.00
  },
  {
    id: 'c2',
    nome: 'Carlos Lima',
    telefone: '(11) 97654-3210',
    email: 'carlos.lima@email.com',
    totalGasto: 245.00,
    cadastroData: '2026-03-10',
    fiadoLimite: 200.00,
    fiadoUsado: 45.00
  },
  {
    id: 'c3',
    nome: 'Ana Costa',
    telefone: '(11) 96543-2109',
    email: 'ana.costa@email.com',
    totalGasto: 420.00,
    cadastroData: '2026-04-05',
    fiadoLimite: 300.00,
    fiadoUsado: 0.00
  },
  {
    id: 'c4',
    nome: 'João Santos',
    telefone: '(11) 95432-1098',
    email: 'joao.santos@email.com',
    totalGasto: 95.00,
    cadastroData: '2026-05-12',
    fiadoLimite: 100.00,
    fiadoUsado: 12.00
  },
  {
    id: 'c5',
    nome: 'Bruna Melo',
    telefone: '(11) 94321-0987',
    email: 'bruna.melo@email.com',
    totalGasto: 0.00,
    cadastroData: '2026-07-01',
    fiadoLimite: 50.00,
    fiadoUsado: 0.00
  }
];

export const INITIAL_PRODUTOS: Produto[] = [
  {
    id: 'p1',
    nome: 'Coxinha',
    categoria: 'Salgados',
    preco: 7.00,
    emoji: '🥟',
    status: 'Disponível'
  },
  {
    id: 'p2',
    nome: 'Pastel',
    categoria: 'Salgados',
    preco: 8.00,
    emoji: '🌮',
    status: 'Disponível'
  },
  {
    id: 'p3',
    nome: 'Bomba',
    categoria: 'Especial',
    preco: 10.00,
    emoji: '💣',
    status: 'Disponível'
  },
  {
    id: 'p4',
    nome: 'Enrolado',
    categoria: 'Salgados',
    preco: 6.00,
    emoji: '🧀',
    status: 'Disponível'
  },
  {
    id: 'p5',
    nome: 'Refrigerante',
    categoria: 'Bebidas',
    preco: 7.00,
    emoji: '🥤',
    status: 'Disponível'
  },
  {
    id: 'p6',
    nome: 'Bolo',
    categoria: 'Doces',
    preco: 9.00,
    emoji: '🍰',
    status: 'Disponível'
  }
];

export const INITIAL_INGREDIENTES: Ingrediente[] = [
  {
    id: 'i1',
    nome: 'Frango Desfiado',
    categoria: 'Proteína',
    quantidade: 18,
    unidade: 'Kg',
    minimo: 10
  },
  {
    id: 'i2',
    nome: 'Massa',
    categoria: 'Produção',
    quantidade: 6,
    unidade: 'Kg',
    minimo: 8
  },
  {
    id: 'i3',
    nome: 'Óleo',
    categoria: 'Cozinha',
    quantidade: 2,
    unidade: 'Litros',
    minimo: 5
  },
  {
    id: 'i4',
    nome: 'Queijo Mozarela',
    categoria: 'Laticínios',
    quantidade: 12,
    unidade: 'Kg',
    minimo: 5
  },
  {
    id: 'i5',
    nome: 'Refrigerante em Lata',
    categoria: 'Bebidas',
    quantidade: 48,
    unidade: 'Un.',
    minimo: 15
  },
  {
    id: 'i6',
    nome: 'Farinha de Trigo',
    categoria: 'Produção',
    quantidade: 25,
    unidade: 'Kg',
    minimo: 10
  }
];

export const INITIAL_PEDIDOS: Pedido[] = [
  {
    id: 'pd123',
    clienteId: 'c1',
    clienteNome: 'Maria Silva',
    itens: [
      { produtoId: 'p1', nome: 'Coxinha', quantidade: 5, preco: 7.00, emoji: '🥟' },
      { produtoId: 'p5', nome: 'Refrigerante', quantidade: 1, preco: 7.00, emoji: '🥤' }
    ],
    total: 42.00,
    data: '2026-07-15T09:22:00-03:00',
    status: 'Entregue',
    pagamento: 'PIX'
  },
  {
    id: 'pd124',
    clienteId: 'c2',
    clienteNome: 'Carlos Lima',
    itens: [
      { produtoId: 'p2', nome: 'Pastel', quantidade: 10, preco: 8.00, emoji: '🌮' }
    ],
    total: 80.00,
    data: '2026-07-15T11:30:00-03:00',
    status: 'Entregue',
    pagamento: 'Cartão de Débito'
  },
  {
    id: 'pd125',
    clienteId: 'c3',
    clienteNome: 'Ana Costa',
    itens: [
      { produtoId: 'p3', nome: 'Bomba', quantidade: 12, preco: 10.00, emoji: '💣' }
    ],
    total: 120.00,
    data: '2026-07-15T12:15:00-03:00',
    status: 'Entregue',
    pagamento: 'PIX'
  },
  {
    id: 'pd126',
    clienteId: 'c4',
    clienteNome: 'João Santos',
    itens: [
      { produtoId: 'p1', nome: 'Coxinha', quantidade: 2, preco: 7.00, emoji: '🥟' },
      { produtoId: 'p5', nome: 'Refrigerante', quantidade: 1, preco: 7.00, emoji: '🥤' }
    ],
    total: 21.00,
    data: '2026-07-15T12:45:00-03:00',
    status: 'Preparando',
    pagamento: 'Dinheiro'
  }
];

export const INITIAL_TRANSACOES: CaixaTransacao[] = [
  {
    id: 't1',
    hora: '08:10',
    descricao: 'Abertura de Caixa',
    tipo: 'entrada',
    formaPagamento: 'Dinheiro',
    valor: 200.00,
    status: 'Confirmado'
  },
  {
    id: 't2',
    hora: '09:22',
    descricao: 'Venda #pd123',
    tipo: 'entrada',
    formaPagamento: 'PIX',
    valor: 42.00,
    status: 'Recebido'
  },
  {
    id: 't3',
    hora: '10:40',
    descricao: 'Compra de Gás',
    tipo: 'saida',
    formaPagamento: 'Dinheiro',
    valor: 120.00,
    status: 'Pago'
  },
  {
    id: 't4',
    hora: '11:30',
    descricao: 'Venda #pd124',
    tipo: 'entrada',
    formaPagamento: 'Cartão de Débito',
    valor: 80.00,
    status: 'Recebido'
  },
  {
    id: 't5',
    hora: '12:15',
    descricao: 'Venda #pd125',
    tipo: 'entrada',
    formaPagamento: 'PIX',
    valor: 120.00,
    status: 'Recebido'
  },
  {
    id: 't6',
    hora: '12:30',
    descricao: 'Compra de Embalagens',
    tipo: 'saida',
    formaPagamento: 'Dinheiro',
    valor: 125.00,
    status: 'Pago'
  }
];

export const INITIAL_CONFIGURACAO: Configuracao = {
  empresaNome: 'Salgadaria Delícias d\'Ouro',
  cnpj: '12.345.678/0001-90',
  endereco: 'Av. das Nações, 1050 - Centro',
  telefone: '(11) 3456-7890',
  taxaEntrega: 5.00,
  whatsAppConectado: false,
  tema: 'claro'
};

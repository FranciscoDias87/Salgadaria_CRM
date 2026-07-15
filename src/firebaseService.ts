/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { db } from './firebase';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  writeBatch,
  updateDoc
} from 'firebase/firestore';
import { Cliente, Produto, Ingrediente, Pedido, CaixaTransacao, Configuracao } from './types';
import {
  INITIAL_CLIENTES,
  INITIAL_PRODUTOS,
  INITIAL_INGREDIENTES,
  INITIAL_PEDIDOS,
  INITIAL_TRANSACOES,
  INITIAL_CONFIGURACAO
} from './data/mockData';

/**
 * Seeds the database if the 'produtos' collection is empty.
 * This ensures the client starts with excellent demonstration data.
 */
export async function seedDatabaseIfEmpty() {
  try {
    const prodSnap = await getDocs(collection(db, 'produtos'));
    if (prodSnap.empty) {
      console.log('Firestore is empty. Seeding initial data...');
      const batch = writeBatch(db);

      // Seed Clientes
      INITIAL_CLIENTES.forEach((c) => {
        const docRef = doc(db, 'clientes', c.id);
        batch.set(docRef, c);
      });

      // Seed Produtos
      INITIAL_PRODUTOS.forEach((p) => {
        const docRef = doc(db, 'produtos', p.id);
        batch.set(docRef, p);
      });

      // Seed Ingredientes
      INITIAL_INGREDIENTES.forEach((i) => {
        const docRef = doc(db, 'ingredientes', i.id);
        batch.set(docRef, i);
      });

      // Seed Pedidos
      INITIAL_PEDIDOS.forEach((pd) => {
        const docRef = doc(db, 'pedidos', pd.id);
        batch.set(docRef, pd);
      });

      // Seed Transações
      INITIAL_TRANSACOES.forEach((t) => {
        const docRef = doc(db, 'transacoes', t.id);
        batch.set(docRef, t);
      });

      // Seed Configuração
      const configRef = doc(db, 'configuracao', 'geral');
      batch.set(configRef, INITIAL_CONFIGURACAO);

      await batch.commit();
      console.log('Firestore successfully seeded with default values!');
    } else {
      console.log('Firestore already contains data. Skipping seeding.');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// --- CLIEBTES ---
export async function dbAdicionarCliente(cliente: Omit<Cliente, 'id' | 'totalGasto' | 'cadastroData' | 'fiadoUsado'>) {
  const docRef = doc(collection(db, 'clientes'));
  const novo: Cliente = {
    ...cliente,
    id: docRef.id,
    totalGasto: 0,
    fiadoUsado: 0,
    cadastroData: new Date().toISOString().split('T')[0]
  };
  await setDoc(docRef, novo);
  return novo;
}

export async function dbEditarCliente(cliente: Cliente) {
  await setDoc(doc(db, 'clientes', cliente.id), cliente);
}

export async function dbExcluirCliente(id: string) {
  await deleteDoc(doc(db, 'clientes', id));
}

// --- PRODUTOS ---
export async function dbAdicionarProduto(produto: Omit<Produto, 'id'>) {
  const docRef = doc(collection(db, 'produtos'));
  const novo: Produto = {
    ...produto,
    id: docRef.id
  };
  await setDoc(docRef, novo);
  return novo;
}

export async function dbEditarProduto(produto: Produto) {
  await setDoc(doc(db, 'produtos', produto.id), produto);
}

export async function dbExcluirProduto(id: string) {
  await deleteDoc(doc(db, 'produtos', id));
}

// --- INGREDIENTES ---
export async function dbAdicionarIngrediente(ingrediente: Omit<Ingrediente, 'id'>) {
  const docRef = doc(collection(db, 'ingredientes'));
  const novo: Ingrediente = {
    ...ingrediente,
    id: docRef.id
  };
  await setDoc(docRef, novo);
  return novo;
}

export async function dbEditarIngrediente(ingrediente: Ingrediente) {
  await setDoc(doc(db, 'ingredientes', ingrediente.id), ingrediente);
}

export async function dbAjustarEstoque(id: string, quantidade: number) {
  await updateDoc(doc(db, 'ingredientes', id), { quantidade: Math.max(0, quantidade) });
}

// --- TRANSAÇÕES ---
export async function dbLancarTransacao(transacao: Omit<CaixaTransacao, 'id' | 'hora'>) {
  const docRef = doc(collection(db, 'transacoes'));
  const timeNow = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const novo: CaixaTransacao = {
    ...transacao,
    id: docRef.id,
    hora: timeNow
  };
  await setDoc(docRef, novo);
  return novo;
}

// --- PEDIDOS ---
export async function dbSalvarPedido(pedido: Pedido) {
  await setDoc(doc(db, 'pedidos', pedido.id), pedido);
}

// --- CONFIGURAÇÃO ---
export async function dbSalvarConfiguracao(config: Configuracao) {
  await setDoc(doc(db, 'configuracao', 'geral'), config);
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { onSnapshot, collection, doc } from 'firebase/firestore';
import { db, auth } from './firebase';
import {
  seedDatabaseIfEmpty,
  dbAdicionarCliente,
  dbEditarCliente,
  dbExcluirCliente,
  dbAdicionarProduto,
  dbEditarProduto,
  dbExcluirProduto,
  dbAdicionarIngrediente,
  dbEditarIngrediente,
  dbAjustarEstoque,
  dbLancarTransacao,
  dbSalvarPedido,
  dbSalvarConfiguracao
} from './firebaseService';

// Models & Seed Data
import { Cliente, Produto, Ingrediente, Pedido, CaixaTransacao, Configuracao } from './types';
import { INITIAL_CONFIGURACAO } from './data/mockData';

// Modular Views
import LoginView from './components/LoginView';
import CentralModulosView from './components/CentralModulosView';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import NovoPedidoView from './components/NovoPedidoView';
import ClientesView from './components/ClientesView';
import ProdutosView from './components/ProdutosView';
import EstoqueView from './components/EstoqueView';
import CaixaView from './components/CaixaView';
import RelatoriosView from './components/RelatoriosView';
import ConfiguracoesView from './components/ConfiguracoesView';
import CozinhaView from './components/CozinhaView';

export default function App() {
  // --- 1. Router State ---
  const [usuarioNome, setUsuarioNome] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<string>('login');

  // --- 2. Databases State ---
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [transacoes, setTransacoes] = useState<CaixaTransacao[]>([]);
  const [configuracao, setConfiguracao] = useState<Configuracao>(INITIAL_CONFIGURACAO);

  // Auth State Listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const name = user.displayName || user.email || 'Usuário';
        setUsuarioNome(name);
        setCurrentView('central');
        await seedDatabaseIfEmpty();
      } else {
        setUsuarioNome(null);
        setCurrentView('login');
      }
    });
    return () => unsubscribe();
  }, []);

  // Real-time Firestore Sync Listeners
  useEffect(() => {
    if (!usuarioNome) return;

    const unsubClientes = onSnapshot(collection(db, 'clientes'), (snap) => {
      const items: Cliente[] = [];
      snap.forEach((doc) => items.push(doc.data() as Cliente));
      setClientes(items);
    });

    const unsubProdutos = onSnapshot(collection(db, 'produtos'), (snap) => {
      const items: Produto[] = [];
      snap.forEach((doc) => items.push(doc.data() as Produto));
      setProdutos(items);
    });

    const unsubIngredientes = onSnapshot(collection(db, 'ingredientes'), (snap) => {
      const items: Ingrediente[] = [];
      snap.forEach((doc) => items.push(doc.data() as Ingrediente));
      setIngredientes(items);
    });

    const unsubPedidos = onSnapshot(collection(db, 'pedidos'), (snap) => {
      const items: Pedido[] = [];
      snap.forEach((doc) => items.push(doc.data() as Pedido));
      setPedidos(items);
    });

    const unsubTransacoes = onSnapshot(collection(db, 'transacoes'), (snap) => {
      const items: CaixaTransacao[] = [];
      snap.forEach((doc) => items.push(doc.data() as CaixaTransacao));
      setTransacoes(items);
    });

    const unsubConfig = onSnapshot(doc(db, 'configuracao', 'geral'), (docSnap) => {
      if (docSnap.exists()) {
        setConfiguracao(docSnap.data() as Configuracao);
      }
    });

    return () => {
      unsubClientes();
      unsubProdutos();
      unsubIngredientes();
      unsubPedidos();
      unsubTransacoes();
      unsubConfig();
    };
  }, [usuarioNome]);

  // --- 3. Core Callbacks & Operations ---

  const handleLogin = (username: string) => {
    setUsuarioNome(username);
    setCurrentView('central');
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
    setUsuarioNome(null);
    setCurrentView('login');
  };

  // Client actions
  const handleAdicionarCliente = async (clienteData: Omit<Cliente, 'id' | 'totalGasto' | 'cadastroData' | 'fiadoUsado'>) => {
    await dbAdicionarCliente(clienteData);
  };

  const handleEditarCliente = async (edited: Cliente) => {
    await dbEditarCliente(edited);
  };

  const handleExcluirCliente = async (id: string) => {
    await dbExcluirCliente(id);
  };

  // Product actions
  const handleAdicionarProduto = async (prodData: Omit<Produto, 'id'>) => {
    await dbAdicionarProduto(prodData);
  };

  const handleEditarProduto = async (edited: Produto) => {
    await dbEditarProduto(edited);
  };

  const handleExcluirProduto = async (id: string) => {
    await dbExcluirProduto(id);
  };

  // Ingredient/Stock actions
  const handleAdicionarIngrediente = async (insData: Omit<Ingrediente, 'id'>) => {
    await dbAdicionarIngrediente(insData);
  };

  const handleEditarIngrediente = async (edited: Ingrediente) => {
    await dbEditarIngrediente(edited);
  };

  const handleAjustarEstoque = async (id: string, novaQtd: number) => {
    await dbAjustarEstoque(id, novaQtd);
  };

  // Financial actions
  const handleLancarTransacao = async (tData: Omit<CaixaTransacao, 'id' | 'hora'>) => {
    await dbLancarTransacao(tData);
  };

  // Order processing & stock depletion engine
  const handleFinalizarPedido = async (
    orderData: Omit<Pedido, 'id' | 'data' | 'status'>
  ): Promise<{ success: boolean; error?: string }> => {
    const orderId = 'pd' + (pedidos.length + 124);
    const dateStr = new Date().toISOString();

    // 1. Deplete raw ingredients proportional to orders (Recipe simulator)
    const auxIngredientes = [...ingredientes];
    let stockError = '';

    orderData.itens.forEach((item) => {
      // Find depletable ingredients
      let targetIngredienteNome = '';
      let depletionQtd = 0;

      if (item.produtoId === 'p1') {
        // Coxinha -> Frango Desfiado
        targetIngredienteNome = 'Frango Desfiado';
        depletionQtd = item.quantidade * 0.1; // 100g per coxinha
      } else if (item.produtoId === 'p2' || item.produtoId === 'p4') {
        // Pastel / Enrolado -> Queijo Mozarela
        targetIngredienteNome = 'Queijo Mozarela';
        depletionQtd = item.quantidade * 0.15; // 150g per item
      } else if (item.produtoId === 'p3') {
        // Bomba -> Massa
        targetIngredienteNome = 'Massa';
        depletionQtd = item.quantidade * 0.2;
      } else if (item.produtoId === 'p5') {
        // Refrigerante -> Refrigerante em Lata
        targetIngredienteNome = 'Refrigerante em Lata';
        depletionQtd = item.quantidade * 1;
      } else if (item.produtoId === 'p6') {
        // Bolo -> Farinha de Trigo
        targetIngredienteNome = 'Farinha de Trigo';
        depletionQtd = item.quantidade * 0.1;
      }

      if (targetIngredienteNome) {
        const insIndex = auxIngredientes.findIndex((i) => i.nome === targetIngredienteNome);
        if (insIndex !== -1) {
          if (auxIngredientes[insIndex].quantidade < depletionQtd) {
            stockError = `Estoque insuficiente de ${targetIngredienteNome}! Disponível: ${auxIngredientes[insIndex].quantidade} ${auxIngredientes[insIndex].unidade}.`;
          } else {
            auxIngredientes[insIndex].quantidade = Number(
              (auxIngredientes[insIndex].quantidade - depletionQtd).toFixed(2)
            );
          }
        }
      }
    });

    if (stockError) {
      return { success: false, error: stockError };
    }

    try {
      // 1. Save depleted ingredients in Firestore
      for (const ing of auxIngredientes) {
        await dbEditarIngrediente(ing);
      }

      // 2. Adjust client debt or total spent
      if (orderData.clienteId !== 'guest') {
        const clientRef = clientes.find((c) => c.id === orderData.clienteId);
        if (clientRef) {
          const updatedClient = {
            ...clientRef,
            totalGasto: Number((clientRef.totalGasto + orderData.total).toFixed(2)),
            fiadoUsado:
              orderData.pagamento === 'Fiado'
                ? Number((clientRef.fiadoUsado + orderData.total).toFixed(2))
                : clientRef.fiadoUsado,
          };
          await dbEditarCliente(updatedClient);
        }
      }

      // 3. Save new order
      const novoPedido: Pedido = {
        ...orderData,
        id: orderId,
        data: dateStr,
        status: 'Preparando', // goes directly to kitchen monitor!
      };
      await dbSalvarPedido(novoPedido);

      // 4. Record a cash transaction if payment is NOT "Fiado"
      if (orderData.pagamento !== 'Fiado') {
        await dbLancarTransacao({
          descricao: `Venda #${orderId}`,
          tipo: 'entrada',
          formaPagamento: orderData.pagamento,
          valor: orderData.total,
          status: 'Recebido',
        });
      }

      return { success: true };
    } catch (err: any) {
      console.error('Error finalizing order:', err);
      return { success: false, error: 'Ocorreu um erro ao salvar o pedido no Firestore.' };
    }
  };

  // Kitchen direct state action
  const handleAtualizarStatusPedido = async (id: string, status: Pedido['status']) => {
    const target = pedidos.find((p) => p.id === id);
    if (target) {
      await dbSalvarPedido({ ...target, status });
    }
  };

  // Configuration saver
  const handleSalvarConfiguracao = async (config: Configuracao) => {
    await dbSalvarConfiguracao(config);
  };

  // Render Controller Router
  const renderMainView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <DashboardView
            pedidos={pedidos}
            clientes={clientes}
            transacoes={transacoes}
            onNavigate={setCurrentView}
            onAdicionarCliente={handleAdicionarCliente}
          />
        );
      case 'novo_pedido':
        return (
          <NovoPedidoView
            clientes={clientes}
            produtos={produtos}
            onFinalizarPedido={handleFinalizarPedido}
          />
        );
      case 'clientes':
        return (
          <ClientesView
            clientes={clientes}
            onAdicionarCliente={handleAdicionarCliente}
            onEditarCliente={handleEditarCliente}
            onExcluirCliente={handleExcluirCliente}
          />
        );
      case 'produtos':
        return (
          <ProdutosView
            produtos={produtos}
            onAdicionarProduto={handleAdicionarProduto}
            onEditarProduto={handleEditarProduto}
            onExcluirProduto={handleExcluirProduto}
          />
        );
      case 'estoque':
        return (
          <EstoqueView
            ingredientes={ingredientes}
            onAdicionarIngrediente={handleAdicionarIngrediente}
            onEditarIngrediente={handleEditarIngrediente}
            onAjustarEstoque={handleAjustarEstoque}
          />
        );
      case 'caixa':
        return (
          <CaixaView
            transacoes={transacoes}
            pedidos={pedidos}
            onLancarTransacao={handleLancarTransacao}
          />
        );
      case 'cozinha':
        return (
          <CozinhaView
            pedidos={pedidos}
            onAtualizarStatusPedido={handleAtualizarStatusPedido}
          />
        );
      case 'relatorios':
        return <RelatoriosView pedidos={pedidos} produtos={produtos} />;
      case 'configuracoes':
        return (
          <ConfiguracoesView
            configuracao={configuracao}
            onSalvarConfiguracao={handleSalvarConfiguracao}
          />
        );
      default:
        return (
          <DashboardView
            pedidos={pedidos}
            clientes={clientes}
            transacoes={transacoes}
            onNavigate={setCurrentView}
            onAdicionarCliente={handleAdicionarCliente}
          />
        );
    }
  };

  // --- 4. Root JSX Layout ---

  // Auth-state routing
  if (currentView === 'login' || !usuarioNome) {
    return <LoginView onLogin={handleLogin} />;
  }

  if (currentView === 'central') {
    return (
      <CentralModulosView
        usuarioNome={usuarioNome}
        pedidos={pedidos}
        ingredientes={ingredientes}
        onLogout={handleLogout}
        onNavigate={setCurrentView}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 relative select-none">
      {/* Sidebar navigation */}
      <Sidebar
        currentView={currentView}
        onNavigate={setCurrentView}
        usuarioNome={usuarioNome}
        onLogout={handleLogout}
      />

      {/* Main viewport with transition effects */}
      <div className="flex-1 overflow-x-hidden min-h-screen pt-16 lg:pt-0">
        <main className="p-4 md:p-8 max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              {renderMainView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

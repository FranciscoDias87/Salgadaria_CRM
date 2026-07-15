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
import {
  INITIAL_CLIENTES,
  INITIAL_PRODUTOS,
  INITIAL_INGREDIENTES,
  INITIAL_PEDIDOS,
  INITIAL_TRANSACOES,
  INITIAL_CONFIGURACAO,
} from './data/mockData';

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
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(() => {
    return localStorage.getItem('crm_offline_mode') === 'true';
  });
  const [usuarioNome, setUsuarioNome] = useState<string | null>(() => {
    if (localStorage.getItem('crm_offline_mode') === 'true') {
      return localStorage.getItem('crm_user_offline') || null;
    }
    return null;
  });
  const [currentView, setCurrentView] = useState<string>('login');

  // --- 2. Databases State ---
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [transacoes, setTransacoes] = useState<CaixaTransacao[]>([]);
  const [configuracao, setConfiguracao] = useState<Configuracao>(INITIAL_CONFIGURACAO);

  // Local Save Helpers for Offline/Demo Mode
  const localSaveClientes = (data: Cliente[]) => {
    setClientes(data);
    localStorage.setItem('salgadaria_clientes', JSON.stringify(data));
  };
  const localSaveProdutos = (data: Produto[]) => {
    setProdutos(data);
    localStorage.setItem('salgadaria_produtos', JSON.stringify(data));
  };
  const localSaveIngredientes = (data: Ingrediente[]) => {
    setIngredientes(data);
    localStorage.setItem('salgadaria_ingredientes', JSON.stringify(data));
  };
  const localSavePedidos = (data: Pedido[]) => {
    setPedidos(data);
    localStorage.setItem('salgadaria_pedidos', JSON.stringify(data));
  };
  const localSaveTransacoes = (data: CaixaTransacao[]) => {
    setTransacoes(data);
    localStorage.setItem('salgadaria_transacoes', JSON.stringify(data));
  };
  const localSaveConfig = (data: Configuracao) => {
    setConfiguracao(data);
    localStorage.setItem('salgadaria_configuracao', JSON.stringify(data));
  };

  // Auth State Listener
  useEffect(() => {
    if (isOfflineMode) return;

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
  }, [isOfflineMode]);

  // Load offline data if offline mode is active
  useEffect(() => {
    if (isOfflineMode) {
      const localClientes = localStorage.getItem('salgadaria_clientes');
      const localProdutos = localStorage.getItem('salgadaria_produtos');
      const localIngredientes = localStorage.getItem('salgadaria_ingredientes');
      const localPedidos = localStorage.getItem('salgadaria_pedidos');
      const localTransacoes = localStorage.getItem('salgadaria_transacoes');
      const localConfig = localStorage.getItem('salgadaria_configuracao');

      setClientes(localClientes ? JSON.parse(localClientes) : INITIAL_CLIENTES);
      setProdutos(localProdutos ? JSON.parse(localProdutos) : INITIAL_PRODUTOS);
      setIngredientes(localIngredientes ? JSON.parse(localIngredientes) : INITIAL_INGREDIENTES);
      setPedidos(localPedidos ? JSON.parse(localPedidos) : INITIAL_PEDIDOS);
      setTransacoes(localTransacoes ? JSON.parse(localTransacoes) : INITIAL_TRANSACOES);
      if (localConfig) setConfiguracao(JSON.parse(localConfig));
    }
  }, [isOfflineMode]);

  // Real-time Firestore Sync Listeners
  useEffect(() => {
    if (!usuarioNome || isOfflineMode) return;

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
  }, [usuarioNome, isOfflineMode]);

  // --- 3. Core Callbacks & Operations ---

  const handleLogin = (username: string) => {
    if (isOfflineMode) {
      localStorage.setItem('crm_user_offline', username);
    }
    setUsuarioNome(username);
    setCurrentView('central');
  };

  const handleLogout = async () => {
    if (isOfflineMode) {
      localStorage.removeItem('crm_user_offline');
    } else {
      try {
        await auth.signOut();
      } catch (error) {
        console.error('Error signing out:', error);
      }
    }
    setUsuarioNome(null);
    setCurrentView('login');
  };

  const handleToggleMode = () => {
    localStorage.removeItem('crm_offline_mode');
    localStorage.removeItem('crm_user_offline');
    setIsOfflineMode(false);
    setUsuarioNome(null);
    setCurrentView('login');
  };

  // Client actions
  const handleAdicionarCliente = async (clienteData: Omit<Cliente, 'id' | 'totalGasto' | 'cadastroData' | 'fiadoUsado'>) => {
    if (isOfflineMode) {
      const novoCliente: Cliente = {
        ...clienteData,
        id: 'c' + (clientes.length + 1) + '_' + Math.random().toString(36).substring(2, 5),
        totalGasto: 0,
        fiadoUsado: 0,
        cadastroData: new Date().toISOString().split('T')[0],
      };
      localSaveClientes([...clientes, novoCliente]);
    } else {
      await dbAdicionarCliente(clienteData);
    }
  };

  const handleEditarCliente = async (edited: Cliente) => {
    if (isOfflineMode) {
      localSaveClientes(clientes.map((c) => (c.id === edited.id ? edited : c)));
    } else {
      await dbEditarCliente(edited);
    }
  };

  const handleExcluirCliente = async (id: string) => {
    if (isOfflineMode) {
      localSaveClientes(clientes.filter((c) => c.id !== id));
    } else {
      await dbExcluirCliente(id);
    }
  };

  // Product actions
  const handleAdicionarProduto = async (prodData: Omit<Produto, 'id'>) => {
    if (isOfflineMode) {
      const novoProd: Produto = {
        ...prodData,
        id: 'p' + (produtos.length + 1) + '_' + Math.random().toString(36).substring(2, 5),
      };
      localSaveProdutos([...produtos, novoProd]);
    } else {
      await dbAdicionarProduto(prodData);
    }
  };

  const handleEditarProduto = async (edited: Produto) => {
    if (isOfflineMode) {
      localSaveProdutos(produtos.map((p) => (p.id === edited.id ? edited : p)));
    } else {
      await dbEditarProduto(edited);
    }
  };

  const handleExcluirProduto = async (id: string) => {
    if (isOfflineMode) {
      localSaveProdutos(produtos.filter((p) => p.id !== id));
    } else {
      await dbExcluirProduto(id);
    }
  };

  // Ingredient/Stock actions
  const handleAdicionarIngrediente = async (insData: Omit<Ingrediente, 'id'>) => {
    if (isOfflineMode) {
      const novoIns: Ingrediente = {
        ...insData,
        id: 'i' + (ingredientes.length + 1) + '_' + Math.random().toString(36).substring(2, 5),
      };
      localSaveIngredientes([...ingredientes, novoIns]);
    } else {
      await dbAdicionarIngrediente(insData);
    }
  };

  const handleEditarIngrediente = async (edited: Ingrediente) => {
    if (isOfflineMode) {
      localSaveIngredientes(ingredientes.map((i) => (i.id === edited.id ? edited : i)));
    } else {
      await dbEditarIngrediente(edited);
    }
  };

  const handleAjustarEstoque = async (id: string, novaQtd: number) => {
    if (isOfflineMode) {
      localSaveIngredientes(
        ingredientes.map((i) => (i.id === id ? { ...i, quantidade: Math.max(0, novaQtd) } : i))
      );
    } else {
      await dbAjustarEstoque(id, novaQtd);
    }
  };

  // Financial actions
  const handleLancarTransacao = async (tData: Omit<CaixaTransacao, 'id' | 'hora'>) => {
    if (isOfflineMode) {
      const timeNow = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      const novaTransacao: CaixaTransacao = {
        ...tData,
        id: 't' + (transacoes.length + 1) + '_' + Math.random().toString(36).substring(2, 5),
        hora: timeNow,
      };
      localSaveTransacoes([...transacoes, novaTransacao]);
    } else {
      await dbLancarTransacao(tData);
    }
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

    if (isOfflineMode) {
      // 1. Save depleted ingredients in local state
      localSaveIngredientes(auxIngredientes);

      // 2. Adjust client debt or total spent
      if (orderData.clienteId !== 'guest') {
        const updatedClientes = clientes.map((c) => {
          if (c.id === orderData.clienteId) {
            return {
              ...c,
              totalGasto: Number((c.totalGasto + orderData.total).toFixed(2)),
              fiadoUsado:
                orderData.pagamento === 'Fiado'
                  ? Number((c.fiadoUsado + orderData.total).toFixed(2))
                  : c.fiadoUsado,
            };
          }
          return c;
        });
        localSaveClientes(updatedClientes);
      }

      // 3. Save new order
      const novoPedido: Pedido = {
        ...orderData,
        id: orderId,
        data: dateStr,
        status: 'Preparando',
      };
      localSavePedidos([...pedidos, novoPedido]);

      // 4. Record transaction if not Fiado
      if (orderData.pagamento !== 'Fiado') {
        const timeNow = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        const novaTransacao: CaixaTransacao = {
          descricao: `Venda #${orderId}`,
          tipo: 'entrada',
          formaPagamento: orderData.pagamento,
          valor: orderData.total,
          status: 'Recebido',
          id: 't' + (transacoes.length + 1) + '_' + Math.random().toString(36).substring(2, 5),
          hora: timeNow,
        };
        localSaveTransacoes([...transacoes, novaTransacao]);
      }

      return { success: true };
    } else {
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
    }
  };

  // Kitchen direct state action
  const handleAtualizarStatusPedido = async (id: string, status: Pedido['status']) => {
    if (isOfflineMode) {
      localSavePedidos(pedidos.map((p) => (p.id === id ? { ...p, status } : p)));
    } else {
      const target = pedidos.find((p) => p.id === id);
      if (target) {
        await dbSalvarPedido({ ...target, status });
      }
    }
  };

  // Configuration saver
  const handleSalvarConfiguracao = async (config: Configuracao) => {
    if (isOfflineMode) {
      localSaveConfig(config);
    } else {
      await dbSalvarConfiguracao(config);
    }
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
    return (
      <LoginView
        onLogin={handleLogin}
        onBypassOffline={() => {
          localStorage.setItem('crm_offline_mode', 'true');
          setIsOfflineMode(true);
          setUsuarioNome('Administrador Demo');
          localStorage.setItem('crm_user_offline', 'Administrador Demo');
          setCurrentView('central');
        }}
      />
    );
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
        isOfflineMode={isOfflineMode}
        onToggleMode={handleToggleMode}
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

# 🥟 Salgadaria CRM

Um sistema de gestão completo, moderno e de alta performance desenvolvido especialmente para salgadarias, confeitarias e comércios de alimentos. O **Salgadaria CRM** conecta de forma inteligente o balcão de atendimento, o controle financeiro, a gestão de estoque e a linha de produção na cozinha em tempo real.

---

## 🎨 Design & Experiência do Usuário (UX)

O sistema foi desenhado com foco absoluto em **velocidade de operação** e **responsividade total**, garantindo que tanto computadores no balcão quanto celulares dos funcionários na cozinha ou no salão tenham uma experiência de uso otimizada:

- **Tema Salmão/Laranja Quente**: Paleta de cores inspirada no setor de alimentação que estimula o apetite e mantém o ambiente de trabalho dinâmico e amigável.
- **Visualização Híbrida Inteligente**: Todas as telas principais contam com tabelas detalhadas em telas grandes (Desktop) e se transformam em cartões (Cards) interativos e fáceis de tocar em dispositivos móveis.
- **Navegação Fluida**: Animações suaves e transições de tela reativas utilizando o motor de animações `motion` (`framer-motion`).

---

## 🚀 Principais Funcionalidades

### 🔐 1. Autenticação Segura & Multi-dispositivo
- **Login e Cadastro em Nuvem**: Segurança robusta através do **Firebase Authentication**.
- **Sincronização em Tempo Real (Real-time Sync)**: Banco de dados **Cloud Firestore** sincronizado instantaneamente. Alterações de estoque ou novos pedidos feitos no celular aparecem no monitor do balcão ou na cozinha no mesmo segundo, sem precisar recarregar a página!

### 🛒 2. Ponto de Venda Inteligente (PDV)
- **Fácil Seleção**: Cardápio visual com ícones (emojis) dinâmicos e categorização rápida.
- **Aba Mobile Dedicada**: Alternância fácil entre o "Cardápio" e o "Carrinho" em telas de smartphone.
- **Baixa Automática de Insumos**: Cada produto vendido consome automaticamente os ingredientes e quantidades configuradas na receita do estoque.
- **Validação de Estoque**: Impede a venda de produtos cujos ingredientes necessários estejam esgotados em estoque.

### 👥 3. CRM & Gestão de Caderneta (Fiado)
- **Fidelização de Clientes**: Cadastro rápido com nome, telefone e limite de crédito.
- **Controle de Fiado**: Sistema de caderneta digital integrado que bloqueia novas vendas a prazo caso o cliente ultrapasse o limite de fiado predefinido.
- **Gráficos de Consumo**: Histórico detalhado de compras e valores totais gastos por cliente.

### 📦 4. Controle de Estoque de Insumos
- **Gestão de Ingredientes**: Monitoramento em Kg, Unidades, Litros ou Gramas.
- **Alertas de Níveis**: Classificação visual de status para insumos (**Normal**, **Baixo** ou **Crítico**) com base no estoque mínimo configurado.
- **Ajuste Rápido de Inventário**: Edição expressa direto do painel mobile, permitindo atualizar o estoque sem abrir janelas extras.

### 🍳 5. Monitor de Cozinha (KST - Kitchen Status)
- **Acompanhamento de Produção**: Painel limpo e direto para os cozinheiros e padeiros.
- **Mecanismo de Status**: Transição de pedidos com um clique de **Preparando** ➡️ **Pronto** ➡️ **Entregue**.
- **Indicadores Temporais**: Destaque para pedidos que estão esperando há mais tempo.

### 💰 6. Frente de Caixa & Financeiro
- **Abertura e Fechamento de Turno**: Declaração de saldo inicial (fundo de caixa).
- **Lançamentos de Caixa**: Registro de entradas automáticas (vendas) e saídas manuais (pagamento de fornecedores, despesas diárias).
- **Fechamento Detalhado**: Resumo com lucro líquido, faturamento por forma de pagamento (Dinheiro, PIX, Cartão, Fiado) e divergência de caixa.

### 📊 7. Relatórios & Métricas
- **Indicadores de Desempenho (KPIs)**: Total faturado, número de vendas e tíquete médio diário.
- **Gráficos Interativos**: Gráfico de faturamento diário para análise de crescimento.
- **Ranking de Produtos**: Lista dos salgados mais vendidos para otimização do cardápio.

---

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído utilizando as melhores ferramentas e práticas do ecossistema React contemporâneo:

- **React 18** + **Vite**: Inicialização e builds extremamente velozes.
- **TypeScript**: Garantia de integridade e segurança de tipos de dados.
- **Tailwind CSS**: Estilização moderna através de classes utilitárias responsivas e altamente customizáveis.
- **Firebase Auth & Firestore**: Autenticação de usuários e banco de dados NoSQL reativo na nuvem.
- **Motion (`motion/react`)**: Micro-interações e transições fluidas.
- **Lucide React**: Biblioteca de ícones elegantes e consistentes.
- **Recharts**: Renderização de gráficos financeiros de alta performance.

---

## ⚙️ Como Executar o Projeto Localmente

### Pré-requisitos
Certifique-se de ter o **Node.js** instalado em sua máquina.

### Passos para instalação e execução:

1. **Clone ou baixe** este repositório em sua máquina de desenvolvimento.
2. No diretório raiz do projeto, instale as dependências executando:
   ```bash
   npm install
   ```
3. Crie ou configure as chaves de ambiente no seu arquivo `.env` com base no arquivo `.env.example`.
4. Inicie o servidor de desenvolvimento local rodando:
   ```bash
   npm run dev
   ```
5. Abra o navegador no endereço indicado (por padrão, `http://localhost:3000`).

---

## 🗄️ Estrutura de Diretórios do Código

```text
├── src/
│   ├── components/            # Componentes visuais das telas e modulares
│   │   ├── CaixaView.tsx      # Tela de Frente de Caixa e Turnos
│   │   ├── ClientesView.tsx   # Gestão de Clientes e Caderneta
│   │   ├── CozinhaView.tsx    # Monitor de Cozinha em tempo real
│   │   ├── DashboardView.tsx  # Visão geral e atalhos rápidos
│   │   ├── EstoqueView.tsx    # Controle de insumos e matérias-primas
│   │   ├── LoginView.tsx      # Autenticação segura de funcionários
│   │   ├── NovoPedidoView.tsx # Ponto de venda e carrinho
│   │   ├── ProdutosView.tsx   # Cadastro de cardápio e receitas
│   │   └── ...
│   ├── data/
│   │   └── mockData.ts        # Dados iniciais para semente de banco de dados
│   ├── firebase.ts            # Inicialização e exportação das instâncias do Firebase
│   ├── firebaseService.ts     # CRUD e métodos utilitários do Firestore
│   ├── types.ts               # Tipos globais e interfaces TypeScript do sistema
│   ├── App.tsx                # Gerenciador de Estado principal e rotas
│   ├── main.tsx               # Ponto de entrada do React
│   └── index.css              # Estilos globais e configurações Tailwind
├── package.json               # Gerenciador de dependências e scripts do sistema
└── README.md                  # Documentação do sistema
```

---

## 🛡️ Segurança e Regras do Banco de Dados

Toda a leitura e gravação no **Cloud Firestore** é protegida pelas regras de segurança que garantem que:
- Apenas usuários devidamente cadastrados e autenticados no sistema possam realizar consultas e registrar transações.
- As operações sigam estritamente o fluxo comercial seguro do aplicativo.

---

Desenhado e desenvolvido para levar profissionalismo, tecnologia e facilidade para a gestão diária de qualquer salgadaria! 🥟✨

// Conteúdo do perfil. Edite aqui e rode `node scripts/build.mjs`.

export const PROFILE = {
  name: "Vitor Moura",
  initials: "VM",
  role: "Desenvolvedor Front-end · Full Stack",
  pitch: "Interfaces de produto com React e TypeScript, da tela ao banco de dados.",
  github: "vitormouramaker",
  highlights: [
    { value: "11 sistemas", label: "completos, com código público" },
    { value: "Web · Mobile · Desktop", label: "React, React Native e Tauri" },
    { value: "IA aplicada", label: "agentes, RAG e saída estruturada" },
  ],
  summary: [
    "Desenvolvedor front-end e full stack com foco em produto. Já construí sistemas completos, da interface à API e ao banco de dados: plataformas SaaS por assinatura, aplicativos mobile, ponto de venda desktop e assistentes com IA.",
    "Meu ponto forte é o front-end: interfaces claras e consistentes, que funcionam bem do celular ao desktop e se sustentam em uso real, com TypeScript, testes e atenção a desempenho e acessibilidade.",
  ],
  delivers: [
    "**Interfaces de produto** em React e TypeScript, com design system próprio, tema claro e escuro e layout responsivo.",
    "**Aplicativos mobile** com React Native e Expo, e **desktop** com Tauri.",
    "**APIs** em Node.js e PostgreSQL com autenticação, isolamento entre empresas (multi-tenant) e integrações de pagamento.",
    "**IA aplicada a produto**: agentes com saída estruturada e validada, busca semântica (RAG) e controle de custo por uso.",
    "**Qualidade**: testes automatizados, validação de dados com Zod e ambientes reproduzíveis com Docker.",
  ],
  skills: [
    ["Front-end", "React, TypeScript, Next.js, Vite, Tailwind CSS, TanStack Query, Zustand, React Hook Form, Zod"],
    ["Mobile e desktop", "React Native, Expo, Tauri"],
    ["Back-end e dados", "Node.js, Express, PostgreSQL, pgvector, Socket.IO, Firebase"],
    ["IA", "Claude API, OpenAI, RAG"],
    ["Integrações", "Stripe, Mercado Pago, Hubla, WhatsApp Cloud API"],
    ["Qualidade e infra", "Vitest, Jest, Docker, GitHub Actions"],
  ],
  projectsNote:
    "Versões anonimizadas de sistemas que desenvolvi: nomes, marcas e dados foram substituídos por fictícios. Cada repositório documenta a arquitetura e traz instruções para rodar localmente.",
  contacts: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/vitor-moura-dev" },
    { label: "webdesignervitorgox@gmail.com", href: "mailto:webdesignervitorgox@gmail.com" },
  ],
};

// Ordem = ordem no perfil. `slug` é o nome do repositório.
export const PROJECTS = [
  {
    slug: "gestao-360-platform",
    category: "SaaS · IA",
    title: "Gestão 360°",
    description: "Plataforma por assinatura em que um agente de IA redige o diagnóstico e o plano de ação de cada cliente, com revisão da equipe e painel administrativo.",
    stack: ["React 19", "TypeScript", "Node.js", "PostgreSQL", "Claude API"],
  },
  {
    slug: "mastermind-community-platform",
    category: "Web e mobile · Tempo real",
    title: "Círculo",
    description: "Plataforma de comunidade com app e web: chat em tempo real, eventos com check-in por QR code, aulas em vídeo e painel administrativo.",
    stack: ["Next.js", "React Native", "Socket.IO", "PostgreSQL"],
  },
  {
    slug: "task-management-saas",
    category: "SaaS · Produtividade",
    title: "Pauta",
    description: "Gestão de tarefas multiempresa com quadros kanban, lista, tabela, linha do tempo e calendário, automações e assinaturas.",
    stack: ["React 19", "TypeScript", "Express", "PostgreSQL", "Stripe"],
  },
  {
    slug: "event-quote-platform",
    category: "Web · Orçamentos",
    title: "Orça Eventos",
    description: "Sistema de orçamentos com motor de cálculo, aprovação de descontos, controle de versões, contratos e trilha de auditoria.",
    stack: ["React 19", "TypeScript", "TanStack Query", "Vitest"],
  },
  {
    slug: "comanda-digital-platform",
    category: "Web · Restaurantes",
    title: "Comanda Digital",
    description: "Pedidos por QR code: cardápio no celular do cliente, quadro de produção da cozinha, estoque, mesas e equipe por unidade.",
    stack: ["React 19", "TypeScript", "Express", "PostgreSQL"],
  },
  {
    slug: "acervo-knowledge-assistant",
    category: "IA · Busca semântica",
    title: "Acervo",
    description: "Assistente que responde com base nos documentos da empresa, com citações verificadas, isolamento por empresa e busca vetorial.",
    stack: ["React 19", "TypeScript", "pgvector", "Claude API"],
  },
  {
    slug: "marketplace-servicos-expo-firebase",
    category: "Mobile · Marketplace",
    title: "ProConecta",
    description: "Marketplace de serviços com carteira de créditos, vagas, chat, plano Premium e pagamentos, sobre regras de segurança do Firestore.",
    stack: ["React Native", "Expo", "Firebase", "TypeScript"],
  },
  {
    slug: "shared-calendar-ai",
    category: "Mobile · IA",
    title: "Calendo",
    description: "Agenda compartilhada com convites e permissões, e um assistente que cria compromissos por texto e aponta conflitos antes de salvar.",
    stack: ["React Native", "Expo", "Node.js", "OpenAI"],
  },
  {
    slug: "balcao-pdv-desktop",
    category: "Desktop · Varejo",
    title: "Balcão PDV",
    description: "Ponto de venda desktop operado por teclado e leitor de código de barras, com pagamento dividido na maquininha e controle de caixa.",
    stack: ["Tauri 2", "Rust", "React", "TypeScript"],
  },
  {
    slug: "crm-erp-saas-platform",
    category: "SaaS · Projeto de equipe",
    title: "Órbita CRM",
    description: "CRM e ERP multiempresa com atendimento pelo WhatsApp, funil de vendas, PDV, estoque e financeiro. Projeto desenvolvido em equipe.",
    stack: ["React 19", "React Native", "Express", "PostgreSQL"],
  },
  {
    slug: "lead-pipeline-dashboard",
    category: "Web · Projeto de equipe",
    title: "Painel de Leads",
    description: "Painel comercial com importação de planilhas, indicadores por etapa, gráficos e filtros. Projeto desenvolvido em equipe.",
    stack: ["React", "Recharts", "Express", "PostgreSQL"],
  },
];

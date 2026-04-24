# 🏋️ FlowTrack

> Aplicação full stack para rastreamento inteligente de treinos, com autenticação Google, visualização de métricas e integração com Google Calendar.

---

## 📌 Visão Geral

O **FlowTrack** é uma plataforma web focada em oferecer uma experiência completa de acompanhamento de atividades físicas. O usuário pode registrar treinos de musculação, cardio e artes marciais, visualizar a evolução do desempenho através de gráficos interativos, gerenciar dados de perfil pessoal e integrar seus treinos ao Google Calendar.

---

## 🚀 Tecnologias Utilizadas

### 🖥️ Frontend

| Tecnologia | Versão | Descrição |
|---|---|---|
| **React** | 19.x | Biblioteca JavaScript para construção de interfaces de usuário com componentes reutilizáveis |
| **Vite** | 8.x | Ferramenta de build moderna e ultrarrápida para projetos frontend, com Hot Module Replacement (HMR) |
| **React Router DOM** | 7.x | Solução de roteamento declarativo para Single Page Applications (SPA), gerenciando as rotas entre Login, Register, ProfileSetup e Dashboard |
| **Recharts** | 3.x | Biblioteca de gráficos declarativos baseada em React e SVG, utilizada para visualizar a evolução de treinos, calorias e peso corporal |
| **@react-oauth/google** | 0.13.x | Biblioteca oficial para integração do fluxo OAuth 2.0 do Google, permitindo autenticação com um clique via Google Identity Services |
| **Lucide React** | 1.x | Conjunto de ícones modernos e consistentes integrados como componentes React |
| **ESLint** | 9.x | Ferramenta de análise estática de código para garantir qualidade e padronização do JavaScript/JSX |

### ⚙️ Backend

| Tecnologia | Versão | Descrição |
|---|---|---|
| **Node.js** | — | Ambiente de execução JavaScript server-side, base da API REST do FlowTrack |
| **Express** | 5.x | Framework web minimalista para Node.js, responsável pelo roteamento HTTP, middlewares e estrutura da API |
| **Prisma ORM** | 6.x | ORM (Object-Relational Mapper) de próxima geração com schema tipado, migrations automáticas e Prisma Client para acesso ao banco de dados |
| **JSON Web Token (JWT)** | 9.x | Padrão aberto para geração e validação de tokens de autenticação stateless entre cliente e servidor |
| **bcryptjs** | 3.x | Biblioteca para hashing seguro de senhas utilizando o algoritmo Bcrypt, garantindo que credenciais nunca sejam armazenadas em texto puro |
| **google-auth-library** | 10.x | SDK oficial do Google para verificação e validação de tokens de identidade OAuth 2.0 no servidor |
| **googleapis** | 171.x | Biblioteca cliente oficial do Google para integração com APIs do ecossistema Google, incluindo Google Calendar API |
| **dotenv** | 17.x | Carregamento de variáveis de ambiente a partir de arquivos `.env`, separando configurações sensíveis do código-fonte |
| **CORS** | 2.x | Middleware Express para gerenciamento de Cross-Origin Resource Sharing, permitindo requisições seguras do frontend |
| **pg** | 8.x | Driver nativo PostgreSQL para Node.js, utilizado internamente pelo Prisma para comunicação com o banco de dados |
| **Nodemon** | 3.x | Utilitário de desenvolvimento que reinicia automaticamente o servidor Node.js ao detectar alterações nos arquivos |

### 🗄️ Banco de Dados & Infraestrutura

| Tecnologia | Versão | Descrição |
|---|---|---|
| **PostgreSQL / Supabase** | 15 | Banco de dados relacional para persistência de dados. Usado localmente (Docker) e em produção na nuvem via Supabase. |
| **Docker** | — | Empacota o banco PostgreSQL local em um container isolado para ambiente de desenvolvimento. |
| **Vercel** | — | Plataforma de hospedagem utilizada para deploy do monorepo, gerenciando o Frontend Estático e o Backend Serverless (Express) integrados via `vercel.json`. |

---

## 🧱 Arquitetura do Projeto

```
FlowTrack/
├── backend/                  # API REST - Node.js + Express
│   ├── prisma/
│   │   └── schema.prisma     # Schema do banco de dados (modelos e relações)
│   └── src/
│       ├── controllers/      # Lógica de negócio por domínio
│       ├── middleware/       # Autenticação JWT e validações
│       ├── routes/           # Definição dos endpoints da API
│       ├── services/         # Integração com Google Calendar API
│       └── utils/            # Instância do Prisma Client
├── frontend/                 # SPA - React + Vite
│   └── src/
│       ├── components/       # Componentes reutilizáveis (gráficos, modais)
│       └── pages/            # Páginas e fluxos principais (Autenticação, Dashboard, Formulários)
├── docker-compose.yml        # Configuração do banco PostgreSQL para desenvolvimento local
└── vercel.json               # Regras de Roteamento Serverless para produção na Vercel
```

---

## ⚡ Como Executar Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) (v18+)
- [Docker](https://www.docker.com/) e Docker Compose

### 1. Clone o repositório
```bash
git clone https://github.com/NayaraLF/FlowTrack.git
cd FlowTrack
```

### 2. Suba o banco de dados
```bash
docker-compose up -d
```

### 3. Configure o Backend
```bash
cd backend
cp .env.example .env   # Configure suas variáveis de ambiente
npm install
npx prisma migrate dev
npm run dev
```

### 4. Configure o Frontend
```bash
cd frontend
npm install
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

---

## ☁️ Como Publicar (Deploy em Produção)

O repositório já está configurado estruturalmente para um **Deploy Serverless na Vercel**:

1. Crie um banco online no [Supabase](https://supabase.com).
2. Importe o seu projeto no [Vercel](https://vercel.com).
3. Insira as **Environment Variables** vitais no painel da Vercel (aba Settings):
   - `DATABASE_URL` (Sua Connection String Pooler - `pgbouncer=true`)
   - `DIRECT_URL` (Sua Connection String Direta para o Prisma subir as tabelas na nuvem)
   - `GOOGLE_CLIENT_ID`
   - `JWT_SECRET`
4. A estrutura orquestrada por `backend/api/[...express].js` e `vercel.json` processará as funções de forma invisível.

---

## 🔐 Variáveis de Ambiente

### Backend (`.env`)
```env
DATABASE_URL="postgresql://flowtrack:mysecretpassword@localhost:5432/flowtrack"
JWT_SECRET="seu_jwt_secret"
GOOGLE_CLIENT_ID="seu_google_client_id"
GOOGLE_CLIENT_SECRET="seu_google_client_secret"
```

### Frontend (`.env`)
```env
VITE_GOOGLE_CLIENT_ID="seu_google_client_id"
VITE_API_URL="http://localhost:3000"
```

---

## 📄 Licença

Este projeto está licenciado sob os termos da licença MIT. Consulte o arquivo [LICENSE](./LICENSE) para mais detalhes.

---

## 🤖 Desenvolvido com Antigravity

Este projeto foi desenvolvido com o auxílio do **[Antigravity](https://antigravity.dev)**, o assistente de programação por IA da Google DeepMind. O Antigravity foi utilizado ao longo de todo o ciclo de desenvolvimento — desde a criação da arquitetura e configuração do ambiente, até a implementação das funcionalidades, integração de APIs e refinamento do código — acelerando significativamente o processo de desenvolvimento sem abrir mão da qualidade e das boas práticas de engenharia de software.

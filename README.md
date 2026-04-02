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
| **PostgreSQL** | 15 | Sistema de gerenciamento de banco de dados relacional robusto e open source, responsável pela persistência de todos os dados da aplicação |
| **Docker** | — | Plataforma de containerização que empacota o PostgreSQL em um ambiente isolado, reproduzível e independente do sistema operacional |
| **Docker Compose** | 3.8 | Ferramenta de orquestração de containers que define e gerencia o serviço de banco de dados com um único comando |

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
│       └── pages/            # Páginas principais da aplicação
│           ├── Login.jsx
│           ├── Register.jsx
│           ├── ProfileSetup.jsx
│           └── Dashboard.jsx
└── docker-compose.yml        # Configuração do banco de dados PostgreSQL
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

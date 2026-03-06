# CEDIME - Centro de Distribuição de Material Escolar

Sistema de gestão de materiais escolares desenvolvido com Next.js, React e Supabase.

## 🚀 Tecnologias

- **Next.js 16** - Framework React
- **TypeScript** - Tipagem estática
- **Supabase** - Banco de dados e autenticação
- **Tailwind CSS** - Estilização
- **Radix UI** - Componentes acessíveis
- **Recharts** - Gráficos e visualizações

## 📋 Pré-requisitos

- Node.js 18+ 
- npm, yarn ou pnpm
- Conta no Supabase

## 🔧 Instalação Local

1. Clone o repositório:
```bash
git clone <seu-repositorio>
cd CEDIME
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
# ou
pnpm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env.local
```

4. Edite o arquivo `.env.local` com suas credenciais do Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon
```

5. Execute o banco de dados:
   - Acesse o SQL Editor no painel do Supabase
   - Execute os arquivos SQL na seguinte ordem:
     1. `supabase-categories-table.sql`
     2. `supabase-units-table.sql`
     3. `supabase-suppliers-table.sql`
     4. `supabase-institutions-table.sql`
     5. `supabase-materials-table.sql`
     6. `supabase-entries-table.sql`
     7. `supabase-outputs-table.sql`
     8. `supabase-requests-table.sql`
     9. `supabase-deliveries-table.sql`
     10. `supabase-entries-triggers.sql`
     11. `supabase-outputs-triggers.sql`
     11. `supabase-materials-insert-initial-data.sql` (opcional - dados iniciais)

6. Inicie o servidor de desenvolvimento:
```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

7. Acesse [http://localhost:3000](http://localhost:3000)

## 🚀 Deploy no Vercel

### Opção 1: Deploy via Dashboard do Vercel

1. Acesse [vercel.com](https://vercel.com) e faça login
2. Clique em "Add New Project"
3. Conecte seu repositório Git (GitHub, GitLab ou Bitbucket)
4. Configure as variáveis de ambiente:
   - `NEXT_PUBLIC_SUPABASE_URL` - URL do seu projeto Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Chave anônima do Supabase
5. Clique em "Deploy"

### Opção 2: Deploy via CLI

1. Instale a CLI do Vercel:
```bash
npm i -g vercel
```

2. Faça login:
```bash
vercel login
```

3. Execute o deploy:
```bash
vercel
```

4. Configure as variáveis de ambiente no painel do Vercel ou via CLI:
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### Configuração de Variáveis de Ambiente no Vercel

1. Acesse o projeto no dashboard do Vercel
2. Vá em **Settings** > **Environment Variables**
3. Adicione as seguintes variáveis:
   - `NEXT_PUBLIC_SUPABASE_URL` - URL do seu projeto Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Chave anônima do Supabase

**Importante:** Após adicionar as variáveis, você precisará fazer um novo deploy para que elas sejam aplicadas.

## 📁 Estrutura do Projeto

```
CEDIME/
├── app/                    # Páginas e rotas (App Router)
│   ├── dashboard/         # Dashboard principal
│   ├── materials/        # Gestão de materiais
│   ├── suppliers/        # Gestão de fornecedores
│   ├── institutions/     # Gestão de instituições
│   ├── entries/           # Entradas de materiais
│   ├── outputs/          # Saídas de materiais
│   ├── requests/         # Requisições
│   ├── deliveries/       # Entregas
│   └── expenses-*/       # Páginas de despesas
├── components/           # Componentes React
│   ├── ui/              # Componentes de UI reutilizáveis
│   └── ...              # Componentes específicos
├── hooks/               # Custom hooks
├── lib/                 # Utilitários e configurações
│   └── supabase/        # Clientes Supabase
└── public/              # Arquivos estáticos
```

## 🔐 Autenticação

O sistema utiliza autenticação via Supabase. Certifique-se de configurar:
- Políticas RLS (Row Level Security) no Supabase
- Usuários no painel de autenticação do Supabase

## 📊 Funcionalidades

- ✅ Gestão de materiais e estoque
- ✅ Gestão de fornecedores
- ✅ Gestão de instituições
- ✅ Controle de entradas e saídas
- ✅ Requisições de materiais
- ✅ Entregas de fornecedores
- ✅ Relatórios de despesas
- ✅ Exportação para Excel e PDF
- ✅ Dashboard com gráficos

## 🛠️ Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run start` - Inicia servidor de produção
- `npm run lint` - Executa o linter

## 📝 Notas Importantes

- O sistema está configurado para usar Supabase como backend
- Certifique-se de executar todos os scripts SQL na ordem correta
- As variáveis de ambiente são obrigatórias para o funcionamento
- O deploy no Vercel é otimizado automaticamente para Next.js

## 🐛 Troubleshooting

### Erro de conexão com Supabase
- Verifique se as variáveis de ambiente estão corretas
- Confirme que o projeto Supabase está ativo
- Verifique as políticas RLS no Supabase

### Erro no build
- Execute `npm install` novamente
- Limpe o cache: `rm -rf .next node_modules`
- Verifique se todas as dependências estão instaladas

## 📄 Licença

Este projeto é privado e de uso interno.


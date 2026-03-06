# 🚀 Guia de Deploy no Vercel

Este guia irá ajudá-lo a fazer o deploy do CEDIME no Vercel.

## 📋 Pré-requisitos

1. Conta no [Vercel](https://vercel.com)
2. Conta no [Supabase](https://supabase.com)
3. Repositório Git (GitHub, GitLab ou Bitbucket)

## 🔧 Passo 1: Preparar o Supabase

1. Acesse [app.supabase.com](https://app.supabase.com)
2. Crie um novo projeto ou use um existente
3. Anote as seguintes informações:
   - **Project URL** (ex: `https://xxxxxxxxxxxxx.supabase.co`)
   - **Anon/Public Key** (encontrada em Settings > API)

## 📝 Passo 2: Executar Scripts SQL

No SQL Editor do Supabase, execute os scripts na seguinte ordem:

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
12. `supabase-materials-insert-initial-data.sql` (opcional - dados iniciais)

## 🚀 Passo 3: Deploy no Vercel

### Opção A: Deploy via Dashboard (Recomendado)

1. Acesse [vercel.com](https://vercel.com) e faça login
2. Clique em **"Add New Project"**
3. Conecte seu repositório Git:
   - Selecione o repositório do CEDIME
   - Clique em **"Import"**
4. Configure o projeto:
   - **Framework Preset**: Next.js (detectado automaticamente)
   - **Root Directory**: `./` (raiz do projeto)
   - **Build Command**: `npm run build` (padrão)
   - **Output Directory**: `.next` (padrão)
5. Configure as variáveis de ambiente:
   - Clique em **"Environment Variables"**
   - Adicione as seguintes variáveis:

   | Nome | Valor |
   |------|-------|
   | `NEXT_PUBLIC_SUPABASE_URL` | URL do seu projeto Supabase |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave anônima do Supabase |

   **Exemplo:**
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

6. Clique em **"Deploy"**
7. Aguarde o build completar (geralmente 2-5 minutos)

### Opção B: Deploy via CLI

1. Instale a CLI do Vercel:
```bash
npm i -g vercel
```

2. No diretório do projeto, faça login:
```bash
vercel login
```

3. Execute o deploy:
```bash
vercel
```

4. Siga as instruções no terminal:
   - Selecione o escopo (sua conta ou organização)
   - Confirme o diretório do projeto
   - Configure as variáveis de ambiente quando solicitado

5. Para produção:
```bash
vercel --prod
```

## ⚙️ Passo 4: Configurar Variáveis de Ambiente

Se você fez o deploy sem configurar as variáveis, pode adicioná-las depois:

1. Acesse seu projeto no dashboard do Vercel
2. Vá em **Settings** > **Environment Variables**
3. Adicione cada variável:
   - Clique em **"Add New"**
   - Digite o nome da variável
   - Digite o valor
   - Selecione os ambientes (Production, Preview, Development)
   - Clique em **"Save"**

4. **Importante:** Após adicionar variáveis, faça um novo deploy:
   - Vá em **Deployments**
   - Clique nos três pontos do último deployment
   - Selecione **"Redeploy"**

## ✅ Passo 5: Verificar o Deploy

1. Após o deploy completar, você receberá uma URL (ex: `cedime.vercel.app`)
2. Acesse a URL e verifique se o sistema está funcionando
3. Teste o login e as funcionalidades principais

## 🔄 Atualizações Futuras

O Vercel faz deploy automático quando você faz push para o repositório:

1. Faça suas alterações no código
2. Commit e push:
```bash
git add .
git commit -m "Sua mensagem"
git push
```

3. O Vercel detectará automaticamente e fará um novo deploy

## 🌍 Domínio Personalizado (Opcional)

1. No dashboard do Vercel, vá em **Settings** > **Domains**
2. Adicione seu domínio personalizado
3. Siga as instruções para configurar o DNS

## 🐛 Troubleshooting

### Build falha
- Verifique se todas as dependências estão no `package.json`
- Confirme que as variáveis de ambiente estão configuradas
- Veja os logs do build no dashboard do Vercel

### Erro de conexão com Supabase
- Verifique se as variáveis de ambiente estão corretas
- Confirme que o projeto Supabase está ativo
- Verifique as políticas RLS no Supabase

### Página em branco
- Verifique os logs do servidor no dashboard do Vercel
- Confirme que o middleware está configurado corretamente
- Verifique se há erros no console do navegador

## 📞 Suporte

Para mais informações:
- [Documentação do Vercel](https://vercel.com/docs)
- [Documentação do Next.js](https://nextjs.org/docs)
- [Documentação do Supabase](https://supabase.com/docs)


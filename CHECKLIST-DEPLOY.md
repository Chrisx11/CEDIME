# ✅ Checklist de Deploy - CEDIME

Use este checklist para garantir que tudo está pronto para o deploy no Vercel.

## 📋 Antes do Deploy

### 1. Configuração do Supabase
- [ ] Projeto criado no Supabase
- [ ] Todos os scripts SQL executados na ordem correta
- [ ] Políticas RLS configuradas (se necessário)
- [ ] Usuários de teste criados no Supabase Auth
- [ ] URL do projeto anotada
- [ ] Chave anônima (anon key) anotada

### 2. Código e Dependências
- [ ] Todas as dependências estão no `package.json`
- [ ] `package-lock.json` ou `pnpm-lock.yaml` commitado
- [ ] Código testado localmente
- [ ] Build local funciona (`npm run build`)
- [ ] Sem erros de TypeScript ou lint

### 3. Arquivos de Configuração
- [ ] `next.config.mjs` configurado
- [ ] `vercel.json` criado (opcional)
- [ ] `.gitignore` configurado corretamente
- [ ] `README.md` atualizado
- [ ] `DEPLOY.md` revisado

### 4. Variáveis de Ambiente
- [ ] Lista de variáveis necessárias documentada
- [ ] Valores do Supabase anotados
- [ ] Arquivo `env.example.txt` criado

## 🚀 Durante o Deploy

### 5. Deploy no Vercel
- [ ] Repositório conectado ao Vercel
- [ ] Framework detectado corretamente (Next.js)
- [ ] Build command: `npm run build`
- [ ] Variáveis de ambiente configuradas:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Deploy iniciado
- [ ] Build completado com sucesso

### 6. Pós-Deploy
- [ ] URL de produção funcionando
- [ ] Login testado
- [ ] Páginas principais acessíveis
- [ ] Conexão com Supabase funcionando
- [ ] Funcionalidades críticas testadas:
  - [ ] Dashboard carrega
  - [ ] Listagem de materiais
  - [ ] Criação de registros
  - [ ] Exportação de relatórios

## 🔍 Verificações Finais

### 7. Testes em Produção
- [ ] Autenticação funcionando
- [ ] CRUD de materiais funcionando
- [ ] CRUD de fornecedores funcionando
- [ ] CRUD de instituições funcionando
- [ ] Entradas e saídas funcionando
- [ ] Requisições funcionando
- [ ] Entregas funcionando
- [ ] Páginas de despesas funcionando
- [ ] Exportação PDF/Excel funcionando

### 8. Performance
- [ ] Páginas carregam em tempo razoável
- [ ] Imagens otimizadas
- [ ] Sem erros no console do navegador
- [ ] Sem erros nos logs do Vercel

### 9. Segurança
- [ ] Variáveis de ambiente não expostas no código
- [ ] RLS configurado no Supabase
- [ ] Autenticação obrigatória nas rotas protegidas
- [ ] HTTPS habilitado (automático no Vercel)

## 📝 Documentação

### 10. Documentação Atualizada
- [ ] README.md com instruções de instalação
- [ ] DEPLOY.md com guia de deploy
- [ ] Variáveis de ambiente documentadas
- [ ] Scripts SQL documentados

## 🎉 Deploy Concluído

- [ ] URL de produção anotada
- [ ] Equipe notificada
- [ ] Monitoramento configurado (opcional)
- [ ] Backup do banco de dados configurado (Supabase)

---

## 🆘 Em Caso de Problemas

1. Verifique os logs do build no dashboard do Vercel
2. Verifique os logs do servidor em tempo real
3. Confirme que todas as variáveis de ambiente estão corretas
4. Teste a conexão com o Supabase
5. Verifique se todos os scripts SQL foram executados
6. Consulte o arquivo `DEPLOY.md` para troubleshooting


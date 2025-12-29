# 🚀 Guia Completo de Configuração - Hydra City

## 📋 Pré-requisitos

1. **Node.js** (versão 16 ou superior)
2. **npm** ou **yarn**
3. **Conta Google Cloud Console** (para Google OAuth)
4. **Conta MercadoPago** (para pagamentos PIX)

## 🔧 Configuração Passo a Passo

### 3. Configuração do MercadoPago

#### 3.1 Criar Conta e Obter Token
1. Acesse: https://www.mercadopago.com.br/developers
2. Crie uma conta ou faça login
3. Vá para "Suas integrações" > "Credenciais"
4. Copie o "Access Token" de produção ou sandbox

### 4. Configuração do Arquivo .env

1. Copie o arquivo de exemplo:
```bash
cp backend/.env.example backend/.env
```

2. Edite o arquivo `backend/.env` com suas credenciais:
```env
# Configurações do Servidor
PORT=3001
NODE_ENV=development

# URL do Frontend
FRONTEND_URL=http://localhost:3000

# Configurações de Sessão
SESSION_SECRET=sua-chave-secreta-aqui-mude-para-uma-chave-segura

# Google OAuth Configuration
GOOGLE_CLIENT_ID=seu-client-id-aqui.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=seu-client-secret-aqui
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback

# MercadoPago Configuration
MERCADO_PAGO_ACCESS_TOKEN=seu-token-do-mercado-pago-aqui

# Configurações de Email (opcional)
EMAIL_USER=seu-email@gmail.com
EMAIL_PASS=sua-senha-do-email
```

### 5. Iniciar o Sistema

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend (se usar servidor local)
# Abrir http://localhost:3000 no navegador
```

## 🎯 URLs de Teste

### Backend
- **Health Check**: http://localhost:3001/health
- **Google OAuth**: http://localhost:3001/api/auth/google
- **PIX Create**: http://localhost:3001/api/payments/pix/create
- **Transactions**: http://localhost:3001/api/transactions/:userId

### Frontend
- **Login**: http://localhost:3000/pages/login.html
- **Home**: http://localhost:3000/index.html

## 🔍 Testando o Google OAuth

1. Acesse: http://localhost:3000/pages/login.html
2. Clique no botão "Google"
3. Autorize o aplicativo
4. Você será redirecionado para o perfil

## 💡 Dicas de Solução de Problemas

### Google OAuth não funciona:
- Verifique se as credenciais estão corretas no .env
- Confirme que a URL de callback está registrada no Google Cloud
- Verifique se o servidor está rodando na porta 3001

### PIX não funciona:
- Verifique se o token do MercadoPago está correto
- Use o modo sandbox para testes
- Verifique os logs do servidor

### Erro de CORS:
- Confirme que FRONTEND_URL no .env está correto
- Verifique se está acessando pela URL correta

## 🚀 Comandos Úteis

```bash
# Instalar dependências
npm install

# Iniciar em modo desenvolvimento
npm run dev

# Iniciar em modo produção
npm start

# Testar conexão com banco
node -e "require('./database').createTables()"
```

## ✅ Verificação Final

Após configurar, teste:
1. [ ] Backend inicia sem erros
2. [ ] Google OAuth redireciona corretamente
3. [ ] PIX cria pagamentos
4. [ ] Transações são salvas no banco
5. [ ] Webhooks recebem notificações

**Sistema 100% configurado e pronto para uso!**

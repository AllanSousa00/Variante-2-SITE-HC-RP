# Fix para Conexão da Loja com Sistema de Pagamento

## Problema Identificado
A loja.html não está conectada corretamente com o sistema de pagamento MercadoPago.

## Solução Implementada

### 1. Atualização do Frontend (shop.html)
- Adicionado JavaScript para conectar com endpoints corretos
- Integração com sistema de pagamento MercadoPago
- Validação de passaporte obrigatória

### 2. Backend Routes
- Configurado endpoints corretos para /api/shop/*
- Integração completa com MercadoPago
- Webhook para confirmação de pagamentos

### 3. Payment Flow
1. Usuário adiciona itens ao carrinho
2. Valida login obrigatório
3. Solicita passaporte do personagem
4. Cria preferência no MercadoPago
5. Redireciona para pagamento PIX
6. Processa confirmação via webhook
7. Entrega itens automaticamente

## Endpoints Configurados:
- GET /api/shop/items - Lista todos os itens disponíveis
- POST /api/shop/checkout - Cria pedido e preferência MercadoPago
- POST /api/shop/process-payment - Processa pagamento
- POST /api/mercadopago/webhook - Recebe confirmações de pagamento

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const mercadopago = require('mercadopago');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.')); // Serve static files from root

// MercadoPago configuration
mercadopago.configure({
    access_token: process.env.MERCADOPAGO_ACCESS_TOKEN
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hydra-city-shop', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Database models
const Order = mongoose.model('Order', {
    userId: String,
    userEmail: String,
    userName: String,
    passaporte: String,
    items: [{
        id: Number,
        name: String,
        price: Number,
        quantity: Number
    }],
    totalAmount: Number,
    status: { type: String, default: 'pending' },
    mercadoPagoPreferenceId: String,
    mercadoPagoPaymentId: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const ShopItem = mongoose.model('ShopItem', {
    id: Number,
    name: String,
    description: String,
    price: Number,
    category: String,
    icon: String,
    image: String,
    duration: { type: String, default: '30 dias' },
    active: { type: Boolean, default: true }
});

// API Routes

// Get shop items
app.get('/api/shop/items', async (req, res) => {
    try {
        const items = await ShopItem.find({ active: true });
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao carregar itens' });
    }
});

// Create MercadoPago preference
app.post('/api/mercadopago/create-preference', async (req, res) => {
    try {
        const { items, userId, userEmail, userName, passaporte } = req.body;
        
        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'Carrinho vazio' });
        }

        const totalAmount = items.reduce((sum, item) => sum + item.price, 0);

        // Create order in database
        const order = new Order({
            userId,
            userEmail,
            userName,
            passaporte,
            items: items.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: 1
            })),
            totalAmount
        });

        await order.save();

        // Create MercadoPago preference
        const preference = {
            items: items.map(item => ({
                id: item.id.toString(),
                title: item.name,
                quantity: 1,
                currency_id: 'BRL',
                unit_price: item.price
            })),
            payer: {
                email: userEmail,
                name: userName
            },
            back_urls: {
                success: `${process.env.BASE_URL}/pages/shop.html?success=true`,
                failure: `${process.env.BASE_URL}/pages/shop.html?failure=true`,
                pending: `${process.env.BASE_URL}/pages/shop.html?pending=true`
            },
            auto_return: 'approved',
            notification_url: `${process.env.BASE_URL}/api/mercadopago/webhook`,
            external_reference: order._id.toString()
        };

        const response = await mercadopago.preferences.create(preference);
        
        // Update order with MercadoPago preference ID
        order.mercadoPagoPreferenceId = response.body.id;
        await order.save();

        res.json({
            initPoint: response.body.init_point,
            sandboxInitPoint: response.body.sandbox_init_point,
            preferenceId: response.body.id
        });

    } catch (error) {
        console.error('Erro ao criar preferência:', error);
        res.status(500).json({ error: 'Erro ao processar pagamento' });
    }
});

// MercadoPago webhook
app.post('/api/mercadopago/webhook', async (req, res) => {
    try {
        const { type, data } = req.body;

        if (type === 'payment') {
            const payment = await mercadopago.payment.findById(data.id);
            
            if (payment.body.status === 'approved') {
                const orderId = payment.body.external_reference;
                
                // Update order status
                const order = await Order.findById(orderId);
                if (order) {
                    order.status = 'paid';
                    order.mercadoPagoPaymentId = data.id;
                    order.updatedAt = new Date();
                    await order.save();

                    // Here you would typically:
                    // 1. Send webhook to game server to deliver items
                    // 2. Send email confirmation
                    // 3. Log the transaction
                    
                    console.log(`Pagamento aprovado para pedido ${orderId}`);
                }
            }
        }

        res.status(200).send('OK');
    } catch (error) {
        console.error('Erro no webhook:', error);
        res.status(500).send('Error');
    }
});

// Get order status
app.get('/api/orders/:orderId/status', async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);
        if (!order) {
            return res.status(404).json({ error: 'Pedido não encontrado' });
        }
        
        res.json({
            status: order.status,
            items: order.items,
            totalAmount: order.totalAmount,
            passaporte: order.passaporte
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao verificar status' });
    }
});

// Initialize shop items (seed data)
async function initializeShopItems() {
    const existingItems = await ShopItem.countDocuments();
    if (existingItems === 0) {
        const defaultItems = [
            {
                id: 1,
                name: 'VIP Bronze',
                description: 'Acesso VIP básico com benefícios exclusivos',
                price: 29.90,
                category: 'vip',
                icon: 'crown'
            },
            {
                id: 2,
                name: 'VIP Prata',
                description: 'VIP intermediário com mais benefícios e vantagens',
                price: 49.90,
                category: 'vip',
                icon: 'crown'
            },
            {
                id: 3,
                name: 'VIP Ouro',
                description: 'VIP premium com todos os benefícios disponíveis',
                price: 79.90,
                category: 'vip',
                icon: 'crown'
            },
            {
                id: 4,
                name: 'Casa Moderna',
                description: 'Casa moderna com garagem e piscina',
                price: 99.90,
                category: 'properties',
                icon: 'home'
            },
            {
                id: 5,
                name: 'Apartamento Luxo',
                description: 'Apartamento de luxo no centro da cidade',
                price: 149.90,
                category: 'properties',
                icon: 'building'
            },
            {
                id: 6,
                name: 'Mansão',
                description: 'Mansão gigante com todas as comodidades',
                price: 299.90,
                category: 'properties',
                icon: 'home'
            },
            {
                id: 7,
                name: 'Carro Esportivo',
                description: 'Carro esportivo de alta performance',
                price: 199.90,
                category: 'vehicles',
                icon: 'car'
            },
            {
                id: 8,
                name: 'Moto Custom',
                description: 'Moto customizada com estilo único',
                price: 89.90,
                category: 'vehicles',
                icon: 'motorcycle'
            },
            {
                id: 9,
                name: 'Kit Armas Premium',
                description: 'Conjunto de armas premium para sua proteção',
                price: 159.90,
                category: 'weapons',
                icon: 'gun'
            },
            {
                id: 10,
                name: 'Roupa VIP',
                description: 'Conjunto de roupas exclusivas para VIPs',
                price: 39.90,
                category: 'clothes',
                icon: 'tshirt'
            }
        ];

        await ShopItem.insertMany(defaultItems);
        console.log('Itens da loja inicializados com sucesso!');
    }
}

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    await initializeShopItems();
});

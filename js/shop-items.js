// Shop items configuration (fallback if backend is not available)
const shopItems = [
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

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = shopItems;
}

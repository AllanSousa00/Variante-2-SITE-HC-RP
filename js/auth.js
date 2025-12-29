// Sistema de Autenticação
class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.users = JSON.parse(localStorage.getItem('hydra_users')) || [];
        this.init();
    }

    init() {
        // Verificar se há usuário logado
        const savedUser = localStorage.getItem('hydra_current_user');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.updateUI();
        }

        // Criar usuários de exemplo se não existirem
        if (this.users.length === 0) {
            this.createDefaultUsers();
        }
    }

    createDefaultUsers() {
        const defaultUsers = [
            {
                id: 1,
                username: 'admin',
                email: 'admin@hydra.city',
                password: 'admin123',
                role: 'admin',
                level: 100,
                money: 1000000,
                bank: 5000000,
                joinDate: '2024-01-01',
                lastLogin: new Date().toISOString(),
                avatar: 'https://via.placeholder.com/150/00d4ff/ffffff?text=ADMIN',
                stats: {
                    playTime: 2500,
                    kills: 1250,
                    deaths: 89,
                    arrests: 450,
                    robberies: 12
                }
            },
            {
                id: 2,
                username: 'player1',
                email: 'player1@example.com',
                password: '123456',
                role: 'player',
                level: 45,
                money: 150000,
                bank: 800000,
                joinDate: '2024-01-15',
                lastLogin: new Date().toISOString(),
                avatar: 'https://via.placeholder.com/150/7c3aed/ffffff?text=P1',
                stats: {
                    playTime: 890,
                    kills: 234,
                    deaths: 156,
                    arrests: 67,
                    robberies: 3
                }
            }
        ];

        this.users = defaultUsers;
        localStorage.setItem('hydra_users', JSON.stringify(this.users));
    }

    login(username, password) {
        const user = this.users.find(u => 
            (u.username === username || u.email === username) && u.password === password
        );

        if (user) {
            // Atualizar último login
            user.lastLogin = new Date().toISOString();
            this.updateUser(user);
            
            this.currentUser = user;
            localStorage.setItem('hydra_current_user', JSON.stringify(user));
            this.updateUI();
            
            return { success: true, user: user };
        }

        return { success: false, message: 'Usuário ou senha incorretos!' };
    }

    register(userData) {
        // Verificar se username já existe
        if (this.users.find(u => u.username === userData.username)) {
            return { success: false, message: 'Nome de usuário já existe!' };
        }

        // Verificar se email já existe
        if (this.users.find(u => u.email === userData.email)) {
            return { success: false, message: 'Email já está em uso!' };
        }

        // Criar novo usuário
        const newUser = {
            id: this.users.length + 1,
            username: userData.username,
            email: userData.email,
            password: userData.password,
            role: 'player',
            level: 1,
            money: 5000,
            bank: 10000,
            joinDate: new Date().toISOString().split('T')[0],
            lastLogin: new Date().toISOString(),
            avatar: `https://via.placeholder.com/150/00d4ff/ffffff?text=${userData.username.charAt(0).toUpperCase()}`,
            stats: {
                playTime: 0,
                kills: 0,
                deaths: 0,
                arrests: 0,
                robberies: 0
            }
        };

        this.users.push(newUser);
        localStorage.setItem('hydra_users', JSON.stringify(this.users));

        return { success: true, user: newUser };
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('hydra_current_user');
        this.updateUI();
        
        // Redirecionar para home se estiver em página protegida
        if (window.location.pathname.includes('profile.html')) {
            window.location.href = '../index.html';
        }
    }

    updateUser(userData) {
        const userIndex = this.users.findIndex(u => u.id === userData.id);
        if (userIndex !== -1) {
            this.users[userIndex] = { ...this.users[userIndex], ...userData };
            localStorage.setItem('hydra_users', JSON.stringify(this.users));
            
            // Atualizar usuário atual se for o mesmo
            if (this.currentUser && this.currentUser.id === userData.id) {
                this.currentUser = this.users[userIndex];
                localStorage.setItem('hydra_current_user', JSON.stringify(this.currentUser));
            }
        }
    }

    updateUI() {
        const loginNav = document.getElementById('loginNav');
        const logoutNav = document.getElementById('logoutNav');
        const profileNav = document.getElementById('profileNav');

        if (this.currentUser) {
            // Usuário logado
            if (loginNav) loginNav.style.display = 'none';
            if (logoutNav) logoutNav.style.display = 'block';
            if (profileNav) profileNav.style.display = 'block';

            // Atualizar nome do usuário se existir elemento
            const userNameElements = document.querySelectorAll('.user-name');
            userNameElements.forEach(el => {
                el.textContent = this.currentUser.username;
            });

            // Atualizar avatar se existir elemento
            const userAvatarElements = document.querySelectorAll('.user-avatar');
            userAvatarElements.forEach(el => {
                el.src = this.currentUser.avatar;
            });

        } else {
            // Usuário não logado
            if (loginNav) loginNav.style.display = 'block';
            if (logoutNav) logoutNav.style.display = 'none';
            if (profileNav) profileNav.style.display = 'none';
        }
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    requireAuth() {
        if (!this.isLoggedIn()) {
            window.location.href = '../pages/login.html';
            return false;
        }
        return true;
    }

    // Método para comprar itens da loja APENAS após confirmação de pagamento
    purchaseItem(item, paymentConfirmed = false, paymentId = null) {
        if (!this.isLoggedIn()) {
            return { success: false, message: 'Você precisa estar logado!' };
        }

        // PROTEÇÃO CRÍTICA: Só permite compra se o pagamento foi confirmado
        if (!paymentConfirmed || !paymentId) {
            return { success: false, message: 'Pagamento não confirmado! Complete o processo de pagamento PIX primeiro.' };
        }

        // Verificar se o pagamento já foi usado
        if (this.isPaymentAlreadyUsed(paymentId)) {
            return { success: false, message: 'Este pagamento já foi processado!' };
        }

        // Validações de segurança
        if (!item || !item.id || !item.price || !item.name) {
            return { success: false, message: 'Item inválido!' };
        }

        if (typeof item.price !== 'number' || item.price <= 0) {
            return { success: false, message: 'Preço inválido!' };
        }

        // Verificar se o item já existe no inventário ativo (evitar duplicatas)
        if (this.currentUser.inventory && this.currentUser.inventory.some(invItem => 
            invItem.id === item.id && new Date(invItem.expirationDate) > new Date())) {
            return { success: false, message: 'Você já possui este item ativo!' };
        }

        // Marcar pagamento como usado ANTES de processar
        this.markPaymentAsUsed(paymentId);
        
        // Adicionar item ao inventário com tempo de expiração
        if (!this.currentUser.inventory) {
            this.currentUser.inventory = [];
        }

        if (!this.currentUser.activities) {
            this.currentUser.activities = [];
        }
        
        // Todos os itens expiram em 30 dias
        let expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 30);

        const purchaseDate = new Date().toISOString();
        const inventoryItem = {
            id: item.id,
            name: item.name,
            category: item.category,
            icon: item.icon,
            price: item.price,
            purchaseDate: purchaseDate,
            expirationDate: expirationDate.toISOString(),
            paymentId: paymentId,
            purchaseHash: this.generatePurchaseHash(this.currentUser.username, item.id, purchaseDate)
        };

        this.currentUser.inventory.push(inventoryItem);

        // Adicionar à atividade recente
        const activityItem = {
            id: Date.now(),
            type: 'purchase',
            icon: this.getCategoryIcon(item.category),
            title: 'Nova Compra',
            description: `Comprou ${item.name}`,
            time: purchaseDate,
            paymentId: paymentId
        };

        this.currentUser.activities.unshift(activityItem);

        // Manter apenas as últimas 10 atividades
        if (this.currentUser.activities.length > 10) {
            this.currentUser.activities = this.currentUser.activities.slice(0, 10);
        }

        // Limpar itens expirados automaticamente
        this.cleanExpiredItems();

        // Salvar alterações
        this.updateUser(this.currentUser);

        return { success: true, message: 'Item comprado com sucesso!' };
    }

    // Verificar se pagamento já foi usado
    isPaymentAlreadyUsed(paymentId) {
        const usedPayments = JSON.parse(localStorage.getItem('usedPayments') || '[]');
        return usedPayments.includes(paymentId);
    }

    // Marcar pagamento como usado
    markPaymentAsUsed(paymentId) {
        const usedPayments = JSON.parse(localStorage.getItem('usedPayments') || '[]');
        if (!usedPayments.includes(paymentId)) {
            usedPayments.push(paymentId);
            localStorage.setItem('usedPayments', JSON.stringify(usedPayments));
        }
    }

    // Obter ícone da categoria
    getCategoryIcon(category) {
        switch(category) {
            case 'vip': return 'crown';
            case 'vehicles': return 'car';
            case 'properties': return 'home';
            case 'weapons': return 'crosshairs';
            case 'clothes': return 'tshirt';
            default: return 'shopping-cart';
        }
    }

    // Gerar hash de compra para validação de integridade
    generatePurchaseHash(username, itemId, date) {
        const data = username + itemId + date + 'hydra_secret_key_2024';
        let hash = 0;
        for (let i = 0; i < data.length; i++) {
            const char = data.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(36);
    }

    // Validar integridade do inventário
    validateInventory(user = null) {
        const targetUser = user || this.currentUser;
        if (!targetUser || !targetUser.inventory) return true;
        
        return targetUser.inventory.every(item => {
            if (!item.purchaseHash) return false; // Itens sem hash são inválidos
            const expectedHash = this.generatePurchaseHash(targetUser.username, item.id, item.purchaseDate);
            return item.purchaseHash === expectedHash;
        });
    }

    // Limpar itens expirados automaticamente
    cleanExpiredItems() {
        if (!this.currentUser || !this.currentUser.inventory) return;

        const now = new Date();
        const validItems = this.currentUser.inventory.filter(item => {
            const expiration = new Date(item.expirationDate);
            return expiration > now && this.validateInventory();
        });

        if (validItems.length !== this.currentUser.inventory.length) {
            this.currentUser.inventory = validItems;
        }
    }

    // Verificar integridade ao carregar usuário
    getCurrentUser() {
        if (this.currentUser && !this.validateInventory()) {
            // Se o inventário foi comprometido, limpar itens inválidos
            this.currentUser.inventory = [];
            this.updateUser(this.currentUser);
        }
        return this.currentUser;
    }

    // Método para adicionar dinheiro (para demonstração)
    addMoney(amount) {
        if (this.isLoggedIn()) {
            this.currentUser.money += amount;
            this.updateUser(this.currentUser);
        }
    }

    // Método para resetar dados (para desenvolvimento)
    resetData() {
        localStorage.removeItem('hydra_users');
        localStorage.removeItem('hydra_current_user');
        this.users = [];
        this.currentUser = null;
        this.createDefaultUsers();
        this.updateUI();
    }
}

// Instanciar sistema de autenticação
const auth = new AuthSystem();

// Função global para logout
function logout() {
    auth.logout();
}

// Verificar autenticação em páginas protegidas
function checkAuth() {
    return auth.requireAuth();
}

// Função para mostrar alertas
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    // Inserir no topo da página
    const container = document.querySelector('.container') || document.body;
    container.insertBefore(alertDiv, container.firstChild);
    
    // Remover após 5 segundos
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// Função para formatar dinheiro
function formatMoney(amount) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(amount);
}

// Função para formatar data
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('pt-BR');
}

// Função para calcular tempo de jogo
function formatPlayTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
}

// Exportar para uso global
window.auth = auth;
window.logout = logout;
window.checkAuth = checkAuth;
window.showAlert = showAlert;
window.formatMoney = formatMoney;
window.formatDate = formatDate;
window.formatPlayTime = formatPlayTime;

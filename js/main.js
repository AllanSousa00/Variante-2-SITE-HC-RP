// Main JavaScript para Hydra City
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Inicializar componentes
    initializeNavigation();
    initializeAnimations();
    initializeCounters();
    initializeServerStatus();
    initializeLazyLoading();
    
    // Atualizar UI baseado no estado de autenticação
    if (window.auth) {
        window.auth.updateUI();
    }
}

// Navegação Mobile
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Fechar menu ao clicar em um link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Fechar menu ao clicar fora
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
}

// Animações de entrada
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observar elementos para animação
    const animatedElements = document.querySelectorAll('.feature-card, .news-card, .hero-text');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Contadores animados
function initializeCounters() {
    const counters = document.querySelectorAll('.stat-number, .counter');
    
    const animateCounter = (counter) => {
        const target = counter.dataset.target ? parseInt(counter.dataset.target) : parseInt(counter.textContent.replace(/[^\d]/g, ''));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            // Formatar número baseado no target ou conteúdo original
            if (target > 1000) {
                counter.textContent = Math.floor(current).toLocaleString('pt-BR');
            } else if (target === 99) {
                counter.textContent = Math.floor(current) + '%';
            } else {
                counter.textContent = Math.floor(current);
            }
        }, 16);
    };

    // Observer para iniciar animação quando visível
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// Status do servidor
function initializeServerStatus() {
    updateServerStatus();
    setInterval(updateServerStatus, 30000); // Atualizar a cada 30 segundos
}

function updateServerStatus() {
    // Simular dados do servidor (em produção, isso viria de uma API)
    const basePlayerCount = 200;
    const variation = Math.floor(Math.random() * 100);
    const playersOnline = basePlayerCount + variation;

    // Atualizar contadores de jogadores online
    const playerElements = document.querySelectorAll('#playersOnline, #footerPlayersCount');
    playerElements.forEach(el => {
        if (el) {
            el.textContent = playersOnline;
        }
    });

    // Simular ping e status
    const ping = Math.floor(Math.random() * 50) + 10;
    const status = ping < 100 ? 'Excelente' : ping < 200 ? 'Bom' : 'Regular';
    
    // Atualizar status se existir elemento
    const statusElements = document.querySelectorAll('.server-status');
    statusElements.forEach(el => {
        el.textContent = status;
        el.className = `server-status ${ping < 100 ? 'status-excellent' : ping < 200 ? 'status-good' : 'status-regular'}`;
    });
}

// Função para conectar ao servidor
function connectToServer() {
    const serverIP = 'hydra.city:7777';
    
    // Tentar abrir no SA-MP
    const sampUrl = `samp://${serverIP}`;
    
    // Criar link temporário
    const link = document.createElement('a');
    link.href = sampUrl;
    link.click();
    
    // Mostrar instruções se não funcionar
    setTimeout(() => {
        showServerConnectModal();
    }, 1000);
}

// Modal de conexão
function showServerConnectModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-server"></i> Conectar ao Servidor</h3>
                <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <p>Para conectar ao Hydra City, siga os passos:</p>
                <ol>
                    <li>Abra o SA-MP (San Andreas Multiplayer)</li>
                    <li>Clique em "Add Server" ou "Adicionar Servidor"</li>
                    <li>Digite o IP: <strong>hydra.city:7777</strong></li>
                    <li>Clique em "Connect" ou "Conectar"</li>
                </ol>
                <div class="server-ip-copy">
                    <input type="text" value="hydra.city:7777" readonly id="serverIPInput">
                    <button class="btn btn-primary" onclick="copyServerIP()">
                        <i class="fas fa-copy"></i> Copiar IP
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Fechar ao clicar fora
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Copiar IP do servidor
function copyServerIP() {
    const serverIP = 'hydra.city:7777';
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(serverIP).then(() => {
            showAlert('IP do servidor copiado!', 'success');
        });
    } else {
        // Fallback para navegadores mais antigos
        const input = document.getElementById('serverIPInput');
        if (input) {
            input.select();
            document.execCommand('copy');
            showAlert('IP do servidor copiado!', 'success');
        }
    }
}

// Lazy loading para imagens
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Smooth scroll para links internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Efeitos de parallax suaves
function initializeParallaxEffects() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.particles');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Efeitos de hover dinâmicos
function initializeDynamicHoverEffects() {
    const cards = document.querySelectorAll('.feature-card, .news-card, .stat');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 20px 40px rgba(0, 123, 255, 0.4)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '';
        });
    });
}

// Efeito de digitação para elementos typewriter
function initializeTypewriterEffect() {
    const typewriterElements = document.querySelectorAll('.typewriter');
    
    typewriterElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        element.style.borderRight = '3px solid var(--primary-color)';
        
        let i = 0;
        const timer = setInterval(() => {
            element.textContent += text.charAt(i);
            i++;
            
            if (i >= text.length) {
                clearInterval(timer);
                // Manter o cursor piscando
                setInterval(() => {
                    element.style.borderRight = element.style.borderRight === 'none' 
                        ? '3px solid var(--primary-color)' 
                        : 'none';
                }, 750);
            }
        }, 100);
    });
}

// Atualizar função de inicialização
function initializeApp() {
    // Inicializar componentes
    initializeNavigation();
    initializeAnimations();
    initializeCounters();
    initializeServerStatus();
    initializeLazyLoading();
    initializeParallaxEffects();
    initializeDynamicHoverEffects();
    
    // Iniciar efeito de digitação após um pequeno delay
    setTimeout(() => {
        initializeTypewriterEffect();
    }, 500);
    
    // Atualizar UI baseado no estado de autenticação
    if (window.auth) {
        window.auth.updateUI();
    }
}

// ==================================================
// 1. MENU MOBILE E NAVEGAÇÃO
// ==================================================
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');

// Toggle Menu Mobile
if (mobileMenu) {
    mobileMenu.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        // Estilos dinâmicos para garantir visibilidade
        if (navLinks.classList.contains('active')) {
            navLinks.style.display = 'flex';
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '70px';
            navLinks.style.left = '0';
            navLinks.style.width = '100%';
            navLinks.style.backgroundColor = 'rgba(0,0,0,0.95)';
            navLinks.style.padding = '20px';
            navLinks.style.zIndex = '1000'; // Garante que fique por cima
        } else {
            navLinks.style.display = 'none';
        }
    });
}

// Scroll Suave ao clicar nos links (fecha o menu se estiver no celular)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId && targetId !== '#') {
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
                // Fecha menu mobile se estiver aberto
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    navLinks.style.display = 'none';
                }
            }
        }
    });
});

// ==================================================
// 2. FORMULÁRIO DE CADASTRO (GOOGLE SHEETS)
// ==================================================
const form = document.getElementById('mcForm');
const submitBtn = document.getElementById('submitBtn');
const statusMsg = document.getElementById('formStatus');

// URL do seu Google Script
const scriptURL = 'https://script.google.com/macros/s/AKfycbwanUDF_iWiHNn9lQJPaiG2vPTtSRvYHZPcj8RQPihmGhNnyYuJ17bvGGAU5DcduPnT/exec'; 

if (form) {
    form.addEventListener('submit', e => {
        e.preventDefault();
        
        // Bloqueia botão e mostra carregando
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<div class="loader" style="width:20px; height:20px; border-width:2px; margin:0 auto;"></div> Enviando...';
        if(statusMsg) {
            statusMsg.textContent = "";
            statusMsg.className = 'status-msg'; // Reseta classes
        }

        const formData = new FormData(form);
        
        // CORREÇÃO CRÍTICA: mode 'no-cors'
        // Isso evita o erro de "Network Error" ou "CORS" ao enviar para o Google.
        // O lado negativo é que não sabemos se o Google deu erro interno, 
        // mas assumimos sucesso se a requisição saiu.
        fetch(scriptURL, { 
            method: 'POST', 
            body: formData,
            mode: 'no-cors' 
        })
        .then(() => {
            // SUCESSO (Assumido)
            showSuccessState();
        })
        .catch(error => {
            console.error('Erro de Rede:', error);
            if(statusMsg) {
                statusMsg.style.color = "red";
                statusMsg.innerHTML = "Erro de conexão. Tente novamente ou chame no Zap.";
            }
            submitBtn.disabled = false;
            submitBtn.innerHTML = "TENTAR NOVAMENTE";
        });
    });
}

function showSuccessState() {
    if(submitBtn) {
        submitBtn.innerHTML = "INSCRIÇÃO REALIZADA! 🤘";
        submitBtn.style.backgroundColor = "#4CAF50"; // Verde
        submitBtn.style.color = "white";
        submitBtn.style.border = "none";
    }
    
    if(statusMsg) {
        statusMsg.style.color = "#4CAF50";
        statusMsg.innerHTML = "Tudo certo! Esperamos vocês em Pitangui.";
    }
    
    if(form) form.reset();
    
    // Restaura o botão após 5 segundos
    setTimeout(() => {
        if(submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = "CONFIRMAR INSCRIÇÃO";
            submitBtn.style.backgroundColor = ""; // Volta ao original
            submitBtn.style.color = "";
            submitBtn.style.border = "";
        }
        if(statusMsg) statusMsg.textContent = "";
    }, 5000);
}

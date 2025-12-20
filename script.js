// Configurações Gerais
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');

// Toggle Menu Mobile
if(mobileMenu) {
    mobileMenu.addEventListener('click', () => {
        // Alterna entre mostrar e esconder
        if (navLinks.style.display === 'flex') {
            navLinks.style.display = 'none';
        } else {
            navLinks.style.display = 'flex';
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '70px';
            navLinks.style.left = '0';
            navLinks.style.width = '100%';
            navLinks.style.background = 'rgba(0,0,0,0.95)';
            navLinks.style.padding = '20px';
        }
    });
}

// Scroll Suave para Links Internos (Correção do bug anterior)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId) {
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
                // Fecha menu mobile se estiver aberto em telas pequenas
                if(window.innerWidth <= 768) {
                    navLinks.style.display = 'none';
                }
            }
        }
    });
});

// Integração com Gemini API
const btnConsultar = document.getElementById('btnConsultar');

if(btnConsultar) {
    btnConsultar.addEventListener('click', callGeminiPlanner);
}

async function callGeminiPlanner() {
    // INSIRA SUA CHAVE API AQUI PARA TESTAR
    const apiKey = ""; 
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    const origin = document.getElementById('originCity').value;
    const bike = document.getElementById('bikeStyle').value;
    const vibe = document.getElementById('tripVibe').value;
    
    const resultDiv = document.getElementById('geminiResult');
    const placeholder = document.getElementById('placeholderText');
    const loader = document.getElementById('loadingIndicator');

    if (!origin) {
        alert("Irmão, diz aí de onde você vem pra gente traçar a rota!");
        return;
    }

    // Estado de Carregamento
    placeholder.classList.add('hidden');
    resultDiv.classList.add('hidden');
    loader.classList.remove('hidden');

    const systemPrompt = `Você é um 'Road Captain' veterano. Responda em Português com gírias de motociclista.
    Gere um roteiro curto:
    1. 🎸 Sugestão de 3 bandas de Rock.
    2. ⚠️ Uma dica de segurança na estrada.
    3. 🔥 Uma frase de efeito para a chegada.
    Use formatação simples sem Markdown complexo (apenas quebras de linha).`;

    const userQuery = `Origem: ${origin}, Moto: ${bike}, Vibe: ${vibe}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: userQuery }] }],
                systemInstruction: { parts: [{ text: systemPrompt }] }
            })
        });

        const data = await response.json();
        
        if (data.candidates && data.candidates[0].content) {
            let text = data.candidates[0].content.parts[0].text;
            
            // Limpeza simples de Markdown para HTML básico
            text = text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-primary">$1</strong>'); // Negrito
            text = text.replace(/\n/g, '<br>'); // Quebra de linha
            
            resultDiv.innerHTML = text;
            
            loader.classList.add('hidden');
            resultDiv.classList.remove('hidden');
        } else {
            throw new Error("Sem resposta");
        }

    } catch (error) {
        console.error('Erro:', error);
        loader.classList.add('hidden');
        resultDiv.innerHTML = "<p style='color:red'>O rádio pifou, irmão. Verifique sua chave API ou tente mais tarde.</p>";
        resultDiv.classList.remove('hidden');
    }
}
// --- LÓGICA DO FORMULÁRIO DE CADASTRO (CORRIGIDA) ---
const form = document.getElementById('mcForm');
const submitBtn = document.getElementById('submitBtn');
const statusMsg = document.getElementById('formStatus');

// Cole a URL do seu Google Script aqui (Cuidado para não ter espaços extras)
const scriptURL = 'https://script.google.com/macros/s/AKfycbwanUDF_iWiHNn9lQJPaiG2vPTtSRvYHZPcj8RQPihmGhNnyYuJ17bvGGAU5DcduPnT/exec'; 

if (form) {
    form.addEventListener('submit', e => {
        e.preventDefault();
        
        // UI de Carregamento
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<div class="loader" style="width:20px; height:20px; border-width:2px;"></div> Enviando...';
        statusMsg.textContent = "";

        // Captura os dados
        let requestBody = new FormData(form);
        
        fetch(scriptURL, { method: 'POST', body: requestBody})
            .then(response => {
                if (!response.ok) {
                    throw new Error('Falha na conexão com o servidor');
                }
                return response.json(); // Lê a resposta real do Google
            })
            .then(data => {
                if (data.result === 'success') {
                    // SUCESSO REAL
                    submitBtn.innerHTML = "INSCRIÇÃO REALIZADA! 🤘";
                    submitBtn.style.backgroundColor = "#4CAF50"; // Verde
                    submitBtn.style.color = "white";
                    statusMsg.style.color = "#4CAF50";
                    statusMsg.innerHTML = "Tudo certo! Esperamos vocês em Pitangui.";
                    form.reset();
                    
                    setTimeout(() => {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = "CONFIRMAR INSCRIÇÃO";
                        submitBtn.style.backgroundColor = "white";
                        submitBtn.style.color = "black";
                        statusMsg.textContent = "";
                    }, 5000);
                } else {
                    // O GOOGLE RESPONDEU COM ERRO (Ex: Planilha não encontrada)
                    throw new Error(data.error || 'Erro desconhecido no script');
                }
            })
            .catch(error => {
                // ERRO DE REDE OU CONFIGURAÇÃO
                console.error('Erro detalhado:', error);
                submitBtn.disabled = false;
                submitBtn.innerHTML = "TENTAR NOVAMENTE";
                statusMsg.style.color = "red";
                statusMsg.innerHTML = "Erro ao salvar: Verifique se a URL do Script está correta e se a função 'setup' foi executada.";
                
                // Dica extra no console para você (F12)
                console.log("Dica: Verifique se você rodou a função 'setup' no Apps Script e se o nome da aba é 'Página1'.");
            });
    });
}
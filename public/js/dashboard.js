/**
 * GUARDIX - Sistema Interno de Dashboard
 * Versão: 2.0 (Conexão Real com API)
 */

// --- CONFIGURAÇÕES GLOBAIS ---
const API = "http://localhost:3000";
let consultasRealizadas = 0;
const limiteCota = 5;

// ================= 1. INICIALIZAÇÃO E SEGURANÇA =================

window.onload = function() {
    const token = localStorage.getItem('guardix_token');
    const nomeUsuario = localStorage.getItem('usuario_nome');

    // Proteção: Se não houver token, redireciona para o login
    if (!token) {
        alert("Sessão expirada ou não autorizada. Faça login.");
        window.location.href = "index.html";
        return;
    }

    // Atualiza interface com dados do usuário logado
    const elementoNome = document.querySelector('.info-user .nome');
    if (elementoNome) {
        elementoNome.innerText = nomeUsuario || 'Usuário';
    }

    // Busca dados iniciais do servidor
    carregarHistorico();
    atualizarInterfaceCota();
};

// ================= 2. NAVEGAÇÃO SPA E MENU =================

function navegar(e, idAlvo) {
    if (e) e.preventDefault();

    // Esconde todas as seções de conteúdo
    document.querySelectorAll('.secao-conteudo').forEach(secao => {
        secao.style.display = 'none';
    });

    // Ativa a seção solicitada
    const secaoAtiva = document.getElementById(`secao-${idAlvo}`);
    if (secaoAtiva) {
        secaoAtiva.style.display = 'block';
    }

    // Gerenciamento visual do menu lateral
    document.querySelectorAll('.item-menu').forEach(item => {
        item.classList.remove('ativo');
    });
    
    if (e && e.currentTarget) {
        e.currentTarget.classList.add('ativo');
    }

    // Fecha o menu mobile após o clique
    if (window.innerWidth < 768) {
        document.getElementById('sidebar').classList.remove('ativo');
    }
}

function alternarMenu() {
    document.getElementById('sidebar').classList.toggle('ativo');
}

// ================= 3. LÓGICA DE VERIFICAÇÃO (API REAL) =================

document.getElementById('form-analise-interna').onsubmit = async function(e) {
    e.preventDefault();

    // Captura de inputs
    const link = document.getElementById("input-url").value.trim();
    const phone = document.getElementById("input-tel").value.trim();
    const file = document.getElementById("arquivo-print").files[0];
    
    // Elementos de UI
    const resBox = document.getElementById('resultado-analise');
    const veredito = document.getElementById('veredito');
    const loading = document.querySelector('.loading-container');
    const token = localStorage.getItem('guardix_token');

    // Validações básicas
    if (consultasRealizadas >= limiteCota) {
        alert("Limite de cota atingido. Faça upgrade para o plano PRO!");
        navegar(null, 'pro');
        return;
    }

    if (!link && !phone && !file) {
        alert("Por favor, forneça um link, telefone ou anexe um print.");
        return;
    }

    // Início do estado de carregamento
    resBox.style.display = 'block';
    veredito.style.display = 'none';
    loading.style.display = 'block';

    try {
        let resultado;
        const headers = {
            "Authorization": `Bearer ${token}`
        };

        // Lógica de decisão de rota da API
        if (file) {
            // Envio de arquivo (Multipart/Form-Data)
            const formData = new FormData();
            formData.append("imagem", file);

            const res = await fetch(`${API}/api/print`, {
                method: "POST",
                headers: headers, // O navegador define o Content-Type automaticamente para FormData
                body: formData
            });
            resultado = await res.json();

        } else if (link) {
            // Envio de Link (JSON)
            const res = await fetch(`${API}/api/link`, {
                method: "POST",
                headers: { ...headers, "Content-Type": "application/json" },
                body: JSON.stringify({ url: link })
            });
            resultado = await res.json();

        } else if (phone) {
            // Envio de Telefone (JSON)
            const res = await fetch(`${API}/api/phone`, {
                method: "POST",
                headers: { ...headers, "Content-Type": "application/json" },
                body: JSON.stringify({ numero: phone })
            });
            resultado = await res.json();
        }

        // Verifica se a API retornou erro de negócio
        if (resultado.error) throw new Error(resultado.error);

        // Sucesso na análise
        consultasRealizadas++;
        atualizarInterfaceCota();

        loading.style.display = 'none';
        veredito.style.display = 'block';
        veredito.innerHTML = formatarResultado(resultado);

        // Atualiza a tabela de histórico após nova análise
        carregarHistorico();

    } catch (err) {
        console.error("Erro na verificação:", err);
        loading.style.display = 'none';
        veredito.style.display = 'block';
        veredito.innerHTML = `<p style="color:#ff4444; padding:15px;">⚠️ Erro: ${err.message}</p>`;
    }
};

// ================= 4. FUNÇÕES AUXILIARES E UI =================

function atualizarInterfaceCota() {
    const contagem = document.getElementById('contagem-cota');
    const barra = document.getElementById('progresso-cota');
    
    if (contagem) contagem.innerText = consultasRealizadas;
    if (barra) {
        const percentual = (consultasRealizadas / limiteCota) * 100;
        barra.style.width = `${percentual}%`;
    }
}

function formatarResultado(data) {
    // Define a cor baseada no score (Score alto = Perigo)
    const cor = data.score >= 60 ? '#ff4444' : '#16f2e3';
    const icone = data.score >= 60 ? '⚠️' : '✅';

    return `
        <div class="alerta-resultado" style="border-left: 5px solid ${cor}; background: rgba(255,255,255,0.05); padding: 20px; border-radius: 8px;">
            <h2 style="color:${cor}; margin-bottom: 10px;">${icone} ${data.classificacao}</h2>
            <p style="font-size: 1.1em; line-height: 1.4;">${data.conclusao}</p>
            <div style="margin-top: 15px; border-top: 1px solid #334155; padding-top: 10px;">
                <small>Nível de Risco: <strong>${data.score}%</strong></small>
            </div>
        </div>
    `;
}

async function carregarHistorico() {
    const lista = document.getElementById('lista-historico');
    const token = localStorage.getItem('guardix_token');
    if (!lista) return;

    try {
        const res = await fetch(`${API}/historico`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const dados = await res.json();

        if (dados.length > 0) {
            lista.innerHTML = dados.map(h => `
                <tr>
                    <td>${h.data}</td>
                    <td>${h.alvo}</td>
                    <td><span class="badge-res" style="color: ${h.resultado === 'Seguro' ? '#16f2e3' : '#ff4444'}">${h.resultado}</span></td>
                </tr>
            `).join('');
        } else {
            lista.innerHTML = '<tr><td colspan="3" style="text-align:center; padding:20px;">Nenhuma consulta realizada ainda.</td></tr>';
        }
    } catch (err) {
        lista.innerHTML = '<tr><td colspan="3" style="text-align:center; color:#ff4444;">Erro ao carregar histórico.</td></tr>';
    }
}

// Monitor de Upload de Arquivo
document.getElementById('arquivo-print').addEventListener('change', function() {
    const nome = this.files[0] ? this.files[0].name : "Nenhum arquivo...";
    document.getElementById('nome-doc').innerText = nome;
});

// Função de Logout
function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}
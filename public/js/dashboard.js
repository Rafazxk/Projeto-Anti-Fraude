/**
 * GUARDIX DASH v2 — dashboard.js
 * Versão corrigida para Deploy (Aspas e Sintaxe)
 */

const API = "https://projeto-anti-fraude.onrender.com";

let consultasRealizadas = 0;
const limiteCota = 5;
let historicoCompleto = []; 
let ultimoScore = 0;        
let stepInterval = null; // Armazena o intervalo para poder limpá-lo

// ============================================================
// 1. INICIALIZAÇÃO
// ============================================================
window.onload = function () {
    const token = localStorage.getItem('guardix_token');
    const nomeUsuario = localStorage.getItem('usuario_nome') || 'Usuário';

    if (!token) {
        window.location.href = "index.html";
        return;
    }

    // Avatar e nome
    const nomeEl = document.querySelector('.info-user .nome');
    if (nomeEl) nomeEl.innerText = nomeUsuario;

    const avatarEl = document.getElementById('sidebar-avatar');
    if (avatarEl) {
        const parts = nomeUsuario.trim().split(' ');
        avatarEl.innerText = parts.length >= 2
            ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
            : parts[0].substring(0, 2).toUpperCase();
    }

    atualizarInterfaceCota();
    carregarHistorico();
    loadLiveAlerts();
    carregarFeedGolpes();
    carregarEstatisticas();
};

// ============================================================
// 2. NAVEGAÇÃO
// ============================================================
function navegar(e, idAlvo) {
    if (e) e.preventDefault();

    document.querySelectorAll('.content-section').forEach(s => {
        s.style.display = 'none';
        s.classList.remove('active');
    });

    const secao = document.getElementById(`secao-${idAlvo}`);
    if (secao) { 
        secao.style.display = 'block'; 
        secao.classList.add('active'); 
    }

    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    if (e && e.currentTarget) e.currentTarget.classList.add('active');

    if (window.innerWidth < 768) {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) sidebar.classList.remove('ativo');
    }
}

function alternarMenu() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.classList.toggle('ativo');
}

// ============================================================
// 3. FORMULÁRIO DE ANÁLISE
// ============================================================
const formAnalise = document.getElementById('form-analise-interna');
if (formAnalise) {
    formAnalise.onsubmit = async function (e) {
        e.preventDefault();

        const link  = document.getElementById("input-url")?.value.trim();
        const phone = document.getElementById("input-tel")?.value.trim();
        const file  = document.getElementById("arquivo-print")?.files[0];

        const resBox   = document.getElementById('resultado-analise');
        const veredito = document.getElementById('veredito');
        const loading  = document.getElementById('loading-container');
        const token    = localStorage.getItem('guardix_token');

        if (consultasRealizadas >= limiteCota) {
            abrirModalPro();
            return;
        }

        if (!link && !phone && !file) {
            showToast("⚠️ Preencha ao menos um campo.", "error");
            return;
        }

        resBox.style.display = 'block';
        veredito.style.display = 'none';
        loading.style.display = 'flex';
        iniciarStepAnimation();

        try {
            let resultado;
            const headers = { "Authorization": `Bearer ${token}` };

            let response;
            if (file) {
                const formData = new FormData();
                formData.append("imagem", file);
                response = await fetch(`${API}/api/print`, { method: "POST", headers, body: formData });
            } else if (link) {
                response = await fetch(`${API}/api/link`, {
                    method: "POST",
                    headers: { ...headers, "Content-Type": "application/json" },
                    body: JSON.stringify({ url: link })
                });
            } else if (phone) {
                response = await fetch(`${API}/api/phone`, {
                    method: "POST",
                    headers: { ...headers, "Content-Type": "application/json" },
                    body: JSON.stringify({ numero: phone })
                });
            }

            if (!response.ok) throw new Error("Erro na resposta do servidor");
            resultado = await response.json();

            if (resultado.error) throw new Error(resultado.error);

            consultasRealizadas++;
            atualizarInterfaceCota();

            loading.style.display = 'none';
            veredito.style.display = 'block';
            renderizarResultado(resultado);
            carregarHistorico();

        } catch (err) {
            loading.style.display = 'none';
            veredito.style.display = 'block';
            veredito.innerHTML = `
                <div style="padding:1.5rem; color: var(--danger); display:flex; align-items:center; gap:.75rem; background: var(--danger-dim); border-radius: var(--radius);">
                    <i class="fas fa-triangle-exclamation" style="font-size:1.3rem;"></i>
                    <p style="font-size:.9rem;">Erro: ${err.message}</p>
                </div>`;
        }
    };
}

// ============================================================
// 4. RENDERIZAÇÃO DO RESULTADO
// ============================================================
function renderizarResultado(data) {
    ultimoScore = data.score || 0;
    const isPerigo = ultimoScore >= 60;
    const isAltaAmeaca = ultimoScore >= 70;

    const cor    = isPerigo ? 'var(--danger)' : 'var(--success)';
    const icone  = isPerigo ? 'fa-triangle-exclamation' : 'fa-circle-check';
    const gradId = isPerigo ? 'url(#gaugeGradientDanger)' : 'url(#gaugeGradientSafe)';

    animarGauge(ultimoScore, gradId);
    
    document.getElementById('gauge-number').style.color = cor;
    const gaugeLabel = document.getElementById('gauge-label');
    if (gaugeLabel) {
        gaugeLabel.style.color = cor;
        gaugeLabel.innerText = isPerigo ? 'ALTO RISCO' : 'SEGURO';
    }

    document.getElementById('result-header').innerHTML = `
        <i class="fas ${icone}" style="color:${cor}; font-size:1.4rem;"></i>
        <h2 style="color:${cor}; font-size:1.25rem;">${data.classificacao || 'Análise Concluída'}</h2>`;

    document.getElementById('result-conclusao').innerText = data.conclusao || '';

    const pontosBox = document.getElementById('pontos-atencao');
    const listaEl   = document.getElementById('lista-pontos');
    const pontos = extrairPontosAtencao(data);

    if (pontos.length > 0 && listaEl) {
        listaEl.innerHTML = pontos.map(p =>
            `<li><i class="fas fa-circle-dot" style="color:${p.cor}; font-size:.5rem;"></i> ${p.texto}</li>`
        ).join('');
        pontosBox.style.display = 'block';
    } else if (pontosBox) {
        pontosBox.style.display = 'none';
    }

    const btnReportar = document.getElementById('btn-reportar');
    if (btnReportar) btnReportar.style.display = isAltaAmeaca ? 'flex' : 'none';
}

function animarGauge(score, gradId) {
    const fill   = document.getElementById('gauge-fill');
    const numEl  = document.getElementById('gauge-number');
    if (!fill || !numEl) return;

    const total  = 267; 
    const offset = total - (score / 100) * total;

    fill.setAttribute('stroke', gradId);

    let startTime = performance.now();
    const duration = 900;

    function step(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);

        const curOffset = 267 - ease * (267 - offset);
        fill.setAttribute('stroke-dashoffset', curOffset);
        numEl.innerText = Math.round(ease * score);

        if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

function extrairPontosAtencao(data) {
    const pontos = [];
    if (data.flags && Array.isArray(data.flags)) {
        data.flags.forEach(f => pontos.push({ texto: f, cor: 'var(--warn)' }));
        return pontos;
    }
    if (data.score >= 70) pontos.push({ texto: 'Alvo associado a relatos de fraude', cor: 'var(--danger)' });
    if (data.score >= 50) pontos.push({ texto: 'Padrão suspeito detectado nos dados', cor: 'var(--warn)' });
    if (data.score < 30)  pontos.push({ texto: 'Nenhum padrão de risco identificado', cor: 'var(--success)' });
    return pontos;
}

// ============================================================
// 5. REPORTAR E COTA
// ============================================================
async function reportarAmeaca() {
    const token = localStorage.getItem('guardix_token');
    try {
        await fetch(`${API}/api/reportar`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ score: ultimoScore })
        });
        showToast("🚩 Ameaça reportada para a comunidade Guardix!", "success");
        document.getElementById('btn-reportar').style.display = 'none';
    } catch (e) {
        showToast("Erro ao reportar. Tente novamente.", "error");
    }
}

function atualizarInterfaceCota() {
    const contagem = document.getElementById('contagem-cota');
    const barra    = document.getElementById('progresso-cota');
    if (contagem) contagem.innerText = `${consultasRealizadas}/${limiteCota}`;
    if (barra)    barra.style.width  = `${(consultasRealizadas / limiteCota) * 100}%`;
}

// ============================================================
// 6. FEEDS E STATS
// ============================================================
async function loadLiveAlerts() {
    const container = document.getElementById('live-alerts');
    if (!container) return;
    try {
        const response = await fetch(`${API}/api/stats/live`);
        const data = await response.json();
        container.innerHTML = data.map(item => `
            <div class="live-feed-item">
                <span style="color: var(--text-dim); font-size:.82rem;">${item.status}</span>
                <span class="feed-badge ${item.total_denuncias > 5 ? 'feed-badge-danger' : 'feed-badge-warn'}">${item.total_denuncias} relatos</span>
            </div>`).join('') || '<p>Nenhum alerta agora.</p>';
    } catch (e) {
        container.innerHTML = '<p>Sem conexão com a rede.</p>';
    }
}

async function carregarFeedGolpes() {
    const container = document.getElementById('feed-golpes');
    if (!container) return;
    const feedMock = [
        { tipo: 'link', titulo: 'Link de phishing detectado', local: 'Recife · PE', tempo: '3 min atrás', risco: 'alto' },
        { tipo: 'telefone', titulo: 'Golpe do PIX', local: 'São Paulo · SP', tempo: '11 min atrás', risco: 'alto' }
    ];
    const tipoIcon = { link: 'fa-link', telefone: 'fa-phone', print: 'fa-image' };
    container.innerHTML = feedMock.map(item => `
        <div class="feed-entry">
            <div class="feed-entry-icon"><i class="fas ${tipoIcon[item.tipo]}"></i></div>
            <div class="feed-entry-body"><p class="feed-entry-title">${item.titulo}</p></div>
            <span class="feed-badge feed-badge-danger">ALTO</span>
        </div>`).join('');
}

async function carregarHistorico() {
    const lista = document.getElementById('lista-historico');
    const token = localStorage.getItem('guardix_token');
    if (!lista) return;
    try {
        const res = await fetch(`${API}/api/historico`, { headers: { "Authorization": `Bearer ${token}` } });
        historicoCompleto = await res.json();
        renderizarHistorico(historicoCompleto);
    } catch (e) {
        lista.innerHTML = '<tr><td colspan="4">Erro de conexão.</td></tr>';
    }
}

function renderizarHistorico(dados) {
    const lista = document.getElementById('lista-historico');
    if (!lista || !Array.isArray(dados)) return;
    lista.innerHTML = dados.map(h => `
        <tr>
            <td>${h.data || '---'}</td>
            <td>${h.tipo || 'link'}</td>
            <td>${h.alvo || 'N/A'}</td>
            <td>${h.resultado}</td>
        </tr>`).join('');
}

// ============================================================
// 7. UTILITÁRIOS (MODAL, TOAST, ETC)
// ============================================================
function abrirModalPro(e) {
    if (e) e.preventDefault();
    document.getElementById('modal-pro').style.display = 'flex';
}

function fecharModalPro(e) {
    if (e && e.target.id === 'modal-pro') {
        document.getElementById('modal-pro').style.display = 'none';
    }
}

function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}

function showToast(msg, tipo = 'info') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.className = `toast toast-${tipo} show`;
    setTimeout(() => { toast.className = 'toast'; }, 3500);
}

function iniciarStepAnimation() {
    if (stepInterval) clearInterval(stepInterval);
    const steps = document.querySelectorAll('.step');
    if (!steps.length) return;
    
    let i = 0;
    steps.forEach(s => s.classList.remove('active'));
    steps[0].classList.add('active');

    stepInterval = setInterval(() => {
        i++;
        if (i >= steps.length) { clearInterval(stepInterval); return; }
        steps.forEach(s => s.classList.remove('active'));
        steps[i].classList.add('active');
    }, 1200);
}

function carregarEstatisticas() {
    // Implementar conforme sua API de stats
}
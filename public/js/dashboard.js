/**
 * GUARDIX - Sistema Interno de Dashboard
 * Versão: 2.1 (Ajustes de Segurança e Renderização)
 */

const API = "https://projeto-anti-fraude.onrender.com";

let consultasRealizadas = 0;
const limiteCota = 5;

// --- 1. INICIALIZAÇÃO ---
window.onload = function() {
    const token = localStorage.getItem('guardix_token');
    const nomeUsuario = localStorage.getItem('usuario_nome');

    if (!token) {
        window.location.href = "/inicio-guardix";
        return;
    }

    const elementoNome = document.querySelector('.info-user .nome');
    if (elementoNome) elementoNome.innerText = nomeUsuario || 'Usuário';

    carregarHistorico();
    atualizarInterfaceCota();
};

// --- 2. NAVEGAÇÃO ---
function navegar(e, idAlvo) {
    if (e) e.preventDefault();

    document.querySelectorAll('.secao-conteudo').forEach(s => s.style.display = 'none');
    const secaoAtiva = document.getElementById(`secao-${idAlvo}`);
    if (secaoAtiva) secaoAtiva.style.display = 'block';

    document.querySelectorAll('.item-menu').forEach(i => i.classList.remove('ativo'));
    if (e && e.currentTarget) e.currentTarget.classList.add('ativo');

    if (window.innerWidth < 768) {
        const sidebar = document.getElementById('sidebar');
        if(sidebar) sidebar.classList.remove('ativo');
    }
}

function alternarMenu() {
    const sidebar = document.getElementById('sidebar');
    if(sidebar) sidebar.classList.toggle('ativo');
}

// --- 3. VERIFICAÇÃO ---
const formAnalise = document.getElementById('form-analise-interna');
if (formAnalise) {
    formAnalise.onsubmit = async function(e) {
        e.preventDefault();

        const link = document.getElementById("input-url")?.value.trim();
        const phone = document.getElementById("input-tel")?.value.trim(); // Garanta que o ID no HTML seja este
        const file = document.getElementById("arquivo-print")?.files[0];
        
        const resBox = document.getElementById('resultado-analise');
        const veredito = document.getElementById('veredito');
        const loading = document.querySelector('.loading-container');
        const token = localStorage.getItem('guardix_token');

        if (consultasRealizadas >= limiteCota) {
            alert("Limite de cota atingido!");
            navegar(null, 'pro');
            return;
        }

        if (!link && !phone && !file) {
            alert("Preencha ao menos um campo para análise.");
            return;
        }

        resBox.style.display = 'block';
        veredito.style.display = 'none';
        loading.style.display = 'block';

        try {
            let resultado;
            const headers = { "Authorization": `Bearer ${token}` };

            if (file) {
                const formData = new FormData();
                formData.append("imagem", file);
                const res = await fetch(`${API}/api/print`, { method: "POST", headers, body: formData });
                resultado = await res.json();
            } else if (link) {
                const res = await fetch(`${API}/api/link`, { 
                    method: "POST", 
                    headers: { ...headers, "Content-Type": "application/json" },
                    body: JSON.stringify({ url: link }) 
                });
                resultado = await res.json();
            } else if (phone) {
                const res = await fetch(`${API}/api/phone`, { 
                    method: "POST", 
                    headers: { ...headers, "Content-Type": "application/json" },
                    body: JSON.stringify({ numero: phone }) 
                });
                resultado = await res.json();
            }

            if (resultado.error) throw new Error(resultado.error);

            consultasRealizadas++;
            atualizarInterfaceCota();

            loading.style.display = 'none';
            veredito.style.display = 'block';
            veredito.innerHTML = formatarResultado(resultado);
            carregarHistorico();

        } catch (err) {
            loading.style.display = 'none';
            veredito.style.display = 'block';
            veredito.innerHTML = `<p style="color:var(--perigo); padding:15px;">⚠️ Erro: ${err.message}</p>`;
        }
    };
}

// --- 4. UI ---
function atualizarInterfaceCota() {
    const contagem = document.getElementById('contagem-cota');
    const barra = document.getElementById('progresso-cota');
    if (contagem) contagem.innerText = `${consultasRealizadas}/${limiteCota}`;
    if (barra) barra.style.width = `${(consultasRealizadas / limiteCota) * 100}%`;
}

function formatarResultado(data) {
    const isPerigo = data.score >= 60;
    const cor = isPerigo ? 'var(--perigo)' : 'var(--sucesso)';
    const icone = isPerigo ? 'fa-triangle-exclamation' : 'fa-circle-check';

    return `
        <div class="alerta-resultado" style="border-left: 5px solid ${cor}; background: rgba(255,255,255,0.03); padding: 25px; border-radius: 12px;">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 10px;">
                <i class="fa-solid ${icone}" style="color: ${cor}; font-size: 1.5rem;"></i>
                <h2 style="color: ${cor}; margin: 0; font-size: 1.4rem;">${data.classificacao}</h2>
            </div>
            <p style="font-size: 1.05rem; line-height: 1.6; color: #cbd5e1;">${data.conclusao}</p>
            <div style="margin-top: 20px; border-top: 1px solid var(--borda); padding-top: 15px; display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 0.85rem; color: var(--texto-dim);">Risco:</span>
                <strong style="color: ${cor}; font-size: 1.2rem;">${data.score}%</strong>
            </div>
        </div>`;
}

async function carregarHistorico() {
    const lista = document.getElementById('lista-historico');
    const token = localStorage.getItem('guardix_token');
    if (!lista) return;

    try {
        const res = await fetch(`${API}/api/historico`, { headers: { "Authorization": `Bearer ${token}` } });
        if (!res.ok) throw new Error("Erro ao carregar dados");

        const dados = await res.json();

        if (dados && dados.length > 0) {
            lista.innerHTML = dados.map(h => {
                const resStr = String(h.resultado || "");
                const isRisco = resStr.includes('Risco') || resStr === 'Perigoso';
                const statusCor = isRisco ? 'var(--perigo)' : 'var(--sucesso)';
                const icon = isRisco ? 'fa-circle-xmark' : 'fa-circle-check';
                
                return `
                    <tr>
                        <td style="color: var(--texto-dim)">${h.data || '---'}</td>
                        <td style="font-weight: 600;">${(h.alvo || 'N/A').toUpperCase()}</td> 
                        <td>
                            <span style="color: ${statusCor}; font-weight: 700; display: flex; align-items: center; gap: 6px;">
                                <i class="fas ${icon}"></i> ${h.resultado}
                            </span>
                        </td>
                    </tr>`;
            }).join('');
        } else {
            lista.innerHTML = '<tr><td colspan="3" style="text-align:center; padding:40px; color: var(--texto-dim)">Sem consultas recentes.</td></tr>';
        }
    } catch (err) {
        lista.innerHTML = '<tr><td colspan="3" style="text-align:center; color:var(--perigo); padding:20px;">Erro de conexão.</td></tr>';
    }
}

// Evento de nome do arquivo
const inputFile = document.getElementById('arquivo-print');
if (inputFile) {
    inputFile.addEventListener('change', function() {
        const nome = this.files[0] ? this.files[0].name : "Nenhum arquivo...";
        const labelDoc = document.getElementById('nome-doc');
        if (labelDoc) labelDoc.innerText = nome;
    });
}

function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}
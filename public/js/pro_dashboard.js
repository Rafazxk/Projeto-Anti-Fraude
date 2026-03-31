// ... Mantenha as funções de navegação e logout do script anterior ...

// ... Mantenha as funções de navegação e logout do script anterior ...

document.getElementById('form-analise-interna').onsubmit = async function(e) {
    e.preventDefault();
    
    const resBox = document.getElementById('resultado-analise');
    const veredito = document.getElementById('veredito');
    const loading = document.querySelector('.loading-container');

    resBox.style.display = 'block';
    loading.style.display = 'block';
    veredito.style.display = 'none';

    // Simulação de processamento de IA (Forense Digital)
    let etapas = ["Quebrando metadados...", "Analisando artefatos OCR...", "Checando base policial...", "Finalizando Veredito IA..."];
    let statusText = document.getElementById('texto-status');

    for (let i = 0; i < etapas.length; i++) {
        statusText.innerText = etapas[i];
        await new Promise(r => setTimeout(r, 1000));
    }

    loading.style.display = 'none';
    veredito.style.display = 'block';
    
    // Veredito Pro Detalhado
    veredito.innerHTML = `
        <div class="alerta-resultado pro">
            <h2 style="color:var(--gold)"><i class="fas fa-certificate"></i> RELATÓRIO FORENSE CONCLUÍDO</h2>
            <div class="detalhes-pro">
                <p><strong>Risco Detectado:</strong> Crítico (98%)</p>
                <p><strong>IA Observação:</strong> Este print contém indícios de edição por software (Clone Stamp detectado). O número de origem está em 14 listas negras internacionais.</p>
                <button class="btn-detalhes" onclick="abrirRelatorioCompleto()">Ver Provas Técnicas</button>
            </div>
        </div>
    `;
    
    // Salva no histórico Pro
    carregarHistoricoPro();
};

function carregarHistoricoPro() {
    const lista = document.getElementById('lista-historico');
    // Exemplo de como ficaria a linha no histórico Pro
    lista.innerHTML = `
        <tr>
            <td>#GX-99281</td>
            <td><span class="badge-plano pro">PRINT IA</span></td>
            <td><span style="color: #ff4444">Bloqueio Preventivo</span></td>
            <td><button class="btn-view-rep"><i class="fas fa-eye"></i> Ler PDF</button></td>
        </tr>
    ` + lista.innerHTML;
}

function toggleChat() {
    const chat = document.getElementById('chat-wrapper');
    chat.style.height = chat.style.height === '40px' ? '350px' : '40px';
}

// Inicializa o histórico
window.addEventListener('load', carregarHistoricoPro);
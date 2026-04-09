/**
 * GUARDIX PRO - Forensic Engine v3.0
 * Core Controller: Senior Implementation
 */

const GuardixApp = (() => {
    // ── CONFIGURAÇÕES E ESTADO ──
    const CONFIG = {
        API_BASE_URL: "https://projeto-anti-fraude.onrender.com",
        GAUGE_MAX_DASH: 126,
        ANIMATION_DURATION: 1500
    };

    const state = {
        isAnalyzing: false,
        currentTab: 'dashboard',
        lastResult: null
    };

    // ── SELETORES CACHEADOS (Performance) ──
    const ui = {
        riskFill: () => document.getElementById('risk-fill'),
        riskValue: () => document.getElementById('risk-value'),
        statusText: () => document.getElementById('status-text'),
        statusDot: () => document.getElementById('status-dot'),
        resultsArea: () => document.getElementById('results-area'),
        btnScan: () => document.querySelector('.btn-primary'),
        inputArea: () => document.querySelector('.scan-textarea'),
        chatBot: () => document.getElementById('guardbot')
    };

    // ── MÓDULO DE INTERFACE (UI) ──
    const UIController = {
        init() {
            lucide.createIcons();
            this.setupEventListeners();
            console.log("🛡️ Guardix Engine: Operational");
        },

        setupEventListeners() {
            // Atalhos de teclado (CMD/CTRL + Enter para analisar)
            ui.inputArea()?.addEventListener('keydown', (e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                    AnalyticEngine.run();
                }
            });
        },

        toggleSidebar() {
            const elements = ['.sidebar', '.overlay'];
            elements.forEach(sel => document.querySelector(sel)?.classList.toggle('active'));
        },

        switchTab(element, tabId) {
            if (state.currentTab === tabId) return;

            // Update Menu
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            element.classList.add('active');

            // Update Sections
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            const target = document.getElementById(tabId);
            if (target) {
                target.classList.add('active');
                state.currentTab = tabId;
            }

            if (window.innerWidth < 768) this.toggleSidebar();
        },

        updateGauge(value) {
            const fill = ui.riskFill();
            const display = ui.riskValue();
            
            // Cálculo do arco SVG
            const offset = CONFIG.GAUGE_MAX_DASH - (value / 100) * CONFIG.GAUGE_MAX_DASH;
            if (fill) fill.style.strokeDashoffset = offset;

            // Lógica de Cores Dinâmicas
            const theme = value > 70 ? { color: "#ef4444", text: "PERIGOSO" } :
                          value > 30 ? { color: "#f59e0b", text: "SUSPEITO" } :
                                       { color: "#22c55e", text: "SEGURO" };

            this.applyGaugeTheme(theme);
            this.animateNumber(display, value);
        },

        applyGaugeTheme({ color, text }) {
            const { riskFill, statusText, statusDot } = ui;
            if (riskFill()) riskFill().style.stroke = color;
            if (statusText()) {
                statusText().innerText = text;
                statusText().style.color = color;
            }
            if (statusDot()) {
                statusDot().style.background = color;
                statusDot().style.boxShadow = `0 0 12px ${color}`;
            }
        },

        animateNumber(obj, endValue) {
            let startTimestamp = null;
            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / 500, 1);
                obj.innerHTML = Math.floor(progress * endValue);
                if (progress < 1) window.requestAnimationFrame(step);
            };
            window.requestAnimationFrame(step);
        },

        toggleChat() {
            ui.chatBot()?.classList.toggle('hidden');
        }
    };

    // ── MÓDULO DE ANÁLISE (API) ──
    const AnalyticEngine = {
        async run() {
            const input = ui.inputArea().value.trim();
            if (!input || state.isAnalyzing) return;

            this.setLoading(true);
            
            try {
                const endpoint = this.detectRoute(input);
                const response = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({ 
                        content: input,
                        timestamp: new Date().toISOString()
                    })
                });

                if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

                const data = await response.json();
                this.renderResults(data);

            } catch (err) {
                console.error("Critical Engine Failure:", err);
                alert("Render Engine está acordando ou offline. Tente em 30s.");
            } finally {
                this.setLoading(false);
            }
        },

        detectRoute(val) {
            // Regex para validar telefone brasileiro ou internacional
            const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
            return phoneRegex.test(val.replace(/\s/g, "")) ? "/api/phone" : "/api/link";
        },

        setLoading(isLoading) {
            state.isAnalyzing = isLoading;
            const btn = ui.btnScan();
            
            if (isLoading) {
                btn.disabled = true;
                btn.innerHTML = `<i data-lucide="loader-2" class="spin"></i> PROCESSANDO...`;
                ui.resultsArea().style.opacity = "0.5";
            } else {
                btn.disabled = false;
                btn.innerHTML = `<i data-lucide="zap"></i> INICIAR VARREDURA`;
                ui.resultsArea().style.opacity = "1";
            }
            lucide.createIcons();
        },

        renderResults(data) {
            UIController.updateGauge(data.risco || 0);
            
            // Exibe a área de resultados com efeito suave
            const area = ui.resultsArea();
            area.style.display = "block";
            
            // Injeção de dados via Template Strings (Protegido)
            this.mapDataToUI(data);
        },

        
mapDataToUI(data) {
    const xrayValues = document.querySelectorAll('.xray-value');
    if (xrayValues.length >= 3) {
        xrayValues[0].innerText = data.reputacao || "N/A";
        xrayValues[1].innerText = data.scripts || "N/A";
        xrayValues[2].innerText = data.blacklist || "N/A";
    }

    // Opcional: Adicionar logs no terminal visual se você tiver um
    console.log("Análise concluída para o Guardix Engine.");
}
    };

    // ── API PÚBLICA (O que o HTML pode acessar) ──
    return {
        init: () => UIController.init(),
        toggleSidebar: () => UIController.toggleSidebar(),
        switchTab: (el, id) => UIController.switchTab(el, id),
        realizarAnalise: () => AnalyticEngine.run(),
        toggleChat: () => UIController.toggleChat()
    };
})();

window.GuardixApp = GuardixApp;

window.addEventListener('DOMContentLoaded', () => GuardixApp.init());
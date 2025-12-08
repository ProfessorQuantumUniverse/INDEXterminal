// Terminal class for managing the cyber terminal
class CyberTerminal {
    constructor() {
        this.input = document.getElementById('terminal-input');
        this.output = document.getElementById('terminal-output');
        this.commandHistory = [];
        this.historyIndex = -1;
        this.currentPath = '~';
        this.currentCategory = null;
        this.projects = {};
        this.soundEnabled = true;
        
        // Initialize terminal
        this.init();
    }
    
    async init() {
        // Show boot sequence first
        await this.showBootSequence();
        
        // Load projects from JSON
        await this.loadProjects();
        
        // Show welcome message
        this.showWelcome();
        
        // Setup event listeners
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.playSound('enter');
                this.handleCommand();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.playSound('keypress');
                this.navigateHistory('up');
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.playSound('keypress');
                this.navigateHistory('down');
            } else if (e.key === 'Tab') {
                e.preventDefault();
                this.playSound('keypress');
                this.handleTabCompletion();
            } else if (e.key.length === 1) {
                this.playSound('keypress');
            }
        });
        
        // Keep input focused
        document.addEventListener('click', () => {
            this.input.focus();
        });
    }
    
    // Boot sequence
    async showBootSequence() {
        const bootContainer = document.getElementById('boot-screen');
        const bootText = document.getElementById('boot-text');
        
        const bootMessages = [
            'INITIALIZING QUANTUM TERMINAL...',
            'LOADING SYSTEM MODULES...',
            'CALIBRATING NEURAL INTERFACE...',
            'ESTABLISHING SECURE CONNECTION...',
            'LOADING PROJECT DATABASE...',
            'ACTIVATING CYBER PROTOCOLS...',
            'SYNCHRONIZING QUANTUM STATE...',
            'SYSTEM READY.'
        ];
        
        this.playSound('boot');
        
        for (let i = 0; i < bootMessages.length; i++) {
            bootText.textContent = bootMessages[i];
            await this.sleep(300 + Math.random() * 200);
        }
        
        await this.sleep(500);
        bootContainer.classList.add('fade-out');
        await this.sleep(800);
        bootContainer.style.display = 'none';
    }
    
    // Load projects from JSON file
    async loadProjects() {
        try {
            const response = await fetch('projects.json');
            this.projects = await response.json();
        } catch (error) {
            console.error('Error loading projects:', error);
            // Fallback to empty projects
            this.projects = this.initProjects();
        }
    }
    
    // Play sound effect
    playSound(type) {
        if (!this.soundEnabled) return;
        
        // Create audio context for sound synthesis
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        switch(type) {
            case 'keypress':
                oscillator.frequency.value = 800;
                gainNode.gain.value = 0.05;
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.03);
                break;
            case 'enter':
                oscillator.frequency.value = 600;
                gainNode.gain.value = 0.1;
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.05);
                break;
            case 'boot':
                oscillator.frequency.value = 440;
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.5);
                break;
            case 'error':
                oscillator.frequency.value = 200;
                gainNode.gain.value = 0.1;
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.1);
                break;
            case 'success':
                oscillator.frequency.value = 1000;
                gainNode.gain.value = 0.08;
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.08);
                break;
        }
    }
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    initProjects() {
        return {
            'experimente': [
                { name: 'Quantum-Simulator', description: 'Ein interaktiver Quantencomputer-Simulator mit Visualisierung', url: 'https://professorquantumuniverse.github.io/quantum-sim' },
                { name: 'Neural-Art', description: 'KI-generierte Kunst mit neuronalen Netzen', url: 'https://professorquantumuniverse.github.io/neural-art' },
                { name: 'Crypto-Analyzer', description: 'Echtzeit-Kryptowährungsanalyse und Vorhersagen', url: 'https://professorquantumuniverse.github.io/crypto-analyzer' },
                { name: 'DNA-Decoder', description: 'DNA-Sequenz-Visualisierung und Analyse-Tool', url: 'https://professorquantumuniverse.github.io/dna-decoder' },
                { name: 'Chaos-Theory', description: 'Visualisierung chaotischer Systeme und Fraktale', url: 'https://professorquantumuniverse.github.io/chaos-theory' },
                { name: 'Black-Hole-Sim', description: 'Schwarzes-Loch-Simulator mit Gravitationslinseneffekt', url: 'https://professorquantumuniverse.github.io/blackhole' },
                { name: 'Time-Dilation', description: 'Relativistische Zeitdilatation berechnen und visualisieren', url: 'https://professorquantumuniverse.github.io/time-dilation' },
                { name: 'Particle-Lab', description: 'Teilchenphysik-Labor mit Kollisionsexperimenten', url: 'https://professorquantumuniverse.github.io/particle-lab' }
            ],
            'kram': [
                { name: 'Retro-Music-Player', description: 'Musik-Player mit Retro-Visualisierungen', url: 'https://professorquantumuniverse.github.io/retro-music' },
                { name: 'Pixel-Editor', description: 'Pixelgrafik-Editor im Retro-Stil', url: 'https://professorquantumuniverse.github.io/pixel-editor' },
                { name: 'Terminal-Chat', description: 'Chat-Anwendung im Terminal-Style', url: 'https://professorquantumuniverse.github.io/terminal-chat' },
                { name: 'Code-Snippet-Manager', description: 'Verwalte deine Code-Snippets elegant', url: 'https://professorquantumuniverse.github.io/snippet-manager' },
                { name: 'Markdown-Preview', description: 'Live Markdown-Editor mit Vorschau', url: 'https://professorquantumuniverse.github.io/md-preview' },
                { name: 'Color-Palette-Generator', description: 'Generiere harmonische Farbpaletten', url: 'https://professorquantumuniverse.github.io/color-gen' },
                { name: 'ASCII-Art-Generator', description: 'Wandle Bilder in ASCII-Art um', url: 'https://professorquantumuniverse.github.io/ascii-gen' },
                { name: 'Typing-Speed-Test', description: 'Teste deine Tippgeschwindigkeit', url: 'https://professorquantumuniverse.github.io/typing-test' }
            ],
            'sonstiges': [
                { name: 'Portfolio', description: 'Mein persönliches Portfolio im Cyber-Style', url: 'https://professorquantumuniverse.github.io/portfolio' },
                { name: 'Blog', description: 'Blog über Wissenschaft und Technologie', url: 'https://professorquantumuniverse.github.io/blog' },
                { name: 'CV-Generator', description: 'Interaktiver Lebenslauf-Generator', url: 'https://professorquantumuniverse.github.io/cv-gen' },
                { name: 'Contact-Form', description: 'Cooles Kontaktformular mit Animationen', url: 'https://professorquantumuniverse.github.io/contact' },
                { name: 'About-Me', description: 'Über mich Seite mit Timeline', url: 'https://professorquantumuniverse.github.io/about' }
            ],
            'games': [
                { name: 'Space-Invaders', description: 'Klassisches Space Invaders im Terminal-Style', url: 'https://professorquantumuniverse.github.io/space-invaders' },
                { name: 'Snake-Game', description: 'Snake-Spiel mit Highscore', url: 'https://professorquantumuniverse.github.io/snake' },
                { name: 'Tetris', description: 'Tetris-Klon im Retro-Design', url: 'https://professorquantumuniverse.github.io/tetris' },
                { name: 'Pong', description: 'Pong-Spiel gegen KI', url: 'https://professorquantumuniverse.github.io/pong' },
                { name: 'Breakout', description: 'Breakout mit Power-Ups', url: 'https://professorquantumuniverse.github.io/breakout' }
            ],
            'tools': [
                { name: 'JSON-Formatter', description: 'JSON formatieren und validieren', url: 'https://professorquantumuniverse.github.io/json-tool' },
                { name: 'Base64-Encoder', description: 'Base64 kodieren und dekodieren', url: 'https://professorquantumuniverse.github.io/base64' },
                { name: 'Hash-Generator', description: 'Verschiedene Hash-Funktionen', url: 'https://professorquantumuniverse.github.io/hash-gen' },
                { name: 'Regex-Tester', description: 'Reguläre Ausdrücke testen', url: 'https://professorquantumuniverse.github.io/regex-test' },
                { name: 'QR-Code-Generator', description: 'QR-Codes erstellen', url: 'https://professorquantumuniverse.github.io/qr-gen' }
            ],
            'hidden': [
                { name: 'Secret-Project-X', description: '███████ ███████ ███████', url: 'https://professorquantumuniverse.github.io/secret-x' },
                { name: 'Matrix-Rain', description: 'The Matrix... everywhere', url: 'https://professorquantumuniverse.github.io/matrix' }
            ]
        };
    }
    
    showWelcome() {
        const welcomeText = `
  ██████  ██    ██  █████  ███    ██ ████████ ██    ██ ███    ███ 
 ██    ██ ██    ██ ██   ██ ████   ██    ██    ██    ██ ████  ████ 
 ██    ██ ██    ██ ███████ ██ ██  ██    ██    ██    ██ ██ ████ ██ 
 ██    ██ ██    ██ ██   ██ ██  ██ ██    ██    ██    ██ ██  ██  ██ 
  ██████   ██████  ██   ██ ██   ████    ██     ██████  ██      ██ 
                                                                    
 ████████ ███████ ██████  ███    ███ ██ ███    ██  █████  ██      
    ██    ██      ██   ██ ████  ████ ██ ████   ██ ██   ██ ██      
    ██    █████   ██████  ██ ████ ██ ██ ██ ██  ██ ███████ ██      
    ██    ██      ██   ██ ██  ██  ██ ██ ██  ██ ██ ██   ██ ██      
    ██    ███████ ██   ██ ██      ██ ██ ██   ████ ██   ██ ███████ 
                                                                    
<span class="info">═══════════════════════════════════════════════════════════════════</span>
<span class="success">  Willkommen im QUANTUM TERMINAL v1.337</span>
<span class="info">  System: ONLINE | Status: BEREIT | Sicherheit: OPTIMAL</span>
<span class="info">═══════════════════════════════════════════════════════════════════</span>

<span class="warning">Tippe 'help' für eine Liste aller verfügbaren Befehle.</span>
<span class="warning">Tippe 'projects' um alle Projekte zu sehen.</span>
<span class="info">Hinweis: Es gibt versteckte Easter Eggs... 🥚</span>
`;
        this.print(welcomeText, 'ascii-art');
    }
    
    handleCommand() {
        const command = this.input.value.trim();
        if (!command) return;
        
        // Add to history
        this.commandHistory.push(command);
        this.historyIndex = this.commandHistory.length;
        
        // Show command
        this.print(`<span class="prompt">guest@quantum:${this.currentPath}$</span> ${command}`, 'command-line');
        
        // Parse and execute command
        this.executeCommand(command);
        
        // Clear input
        this.input.value = '';
        
        // Scroll to bottom
        this.output.scrollTop = this.output.scrollHeight;
    }
    
    executeCommand(command) {
        const [cmd, ...args] = command.toLowerCase().split(' ');
        
        switch(cmd) {
            case 'help':
                this.showHelp();
                break;
            case 'projects':
            case 'ls':
                this.listProjects(args[0]);
                break;
            case 'cat':
                this.showProjectDetails(args.join(' '));
                break;
            case 'cd':
                this.changeDirectory(args[0]);
                break;
            case 'pwd':
                this.print(this.currentPath, 'info');
                break;
            case 'clear':
            case 'cls':
                this.clearScreen();
                break;
            case 'whoami':
                this.print('guest (but who are you really? 🤔)', 'info');
                break;
            case 'date':
                this.print(new Date().toString(), 'info');
                break;
            case 'echo':
                this.print(args.join(' '), 'success');
                break;
            case 'matrix':
                this.easterEggMatrix();
                break;
            case 'hack':
                this.easterEggHack();
                break;
            case 'sudo':
                this.easterEggSudo(args.join(' '));
                break;
            case 'exit':
            case 'quit':
                this.easterEggExit();
                break;
            case 'secret':
            case '42':
                this.easterEggSecret();
                break;
            case 'konami':
                this.easterEggKonami();
                break;
            case 'categories':
                this.showCategories();
                break;
            case 'search':
                this.searchProjects(args.join(' '));
                break;
            case 'about':
                this.showAbout();
                break;
            case 'contact':
                this.showContact();
                break;
            case 'fortune':
                this.showFortune();
                break;
            case 'tree':
                this.showTree();
                break;
            case 'history':
                this.showHistory();
                break;
            case 'credits':
                this.showCredits();
                break;
            case 'sound':
                this.toggleSound();
                break;
            default:
                this.playSound('error');
                this.print(`<span class="error">Befehl nicht gefunden: ${cmd}</span>`, 'error');
                this.print('Tippe "help" für eine Liste aller Befehle.', 'warning');
        }
    }
    
    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        const status = this.soundEnabled ? 'AKTIVIERT' : 'DEAKTIVIERT';
        this.print(`<span class="success">Sound-Effekte: ${status}</span>`);
    }
    
    showHelp() {
        const help = `
<span class="category-header">═══ VERFÜGBARE BEFEHLE ═══</span>

<span class="help-command">help</span>
<span class="help-description">Zeigt diese Hilfe an</span>

<span class="help-command">projects [kategorie]</span>
<span class="help-description">Listet alle Projekte oder Projekte einer bestimmten Kategorie</span>

<span class="help-command">categories</span>
<span class="help-description">Zeigt alle verfügbaren Kategorien</span>

<span class="help-command">cat &lt;projektname&gt;</span>
<span class="help-description">Zeigt Details zu einem Projekt</span>

<span class="help-command">cd &lt;kategorie&gt;</span>
<span class="help-description">Wechselt in eine Kategorie</span>

<span class="help-command">ls</span>
<span class="help-description">Listet Projekte in aktueller Kategorie (wie projects)</span>

<span class="help-command">pwd</span>
<span class="help-description">Zeigt aktuellen Pfad</span>

<span class="help-command">search &lt;suchbegriff&gt;</span>
<span class="help-description">Sucht nach Projekten</span>

<span class="help-command">tree</span>
<span class="help-description">Zeigt Projektstruktur als Baum</span>

<span class="help-command">clear / cls</span>
<span class="help-description">Löscht den Bildschirm</span>

<span class="help-command">whoami</span>
<span class="help-description">Zeigt Benutzerinformationen</span>

<span class="help-command">about</span>
<span class="help-description">Über dieses Terminal</span>

<span class="help-command">contact</span>
<span class="help-description">Kontaktinformationen</span>

<span class="help-command">fortune</span>
<span class="help-description">Zeigt ein zufälliges Zitat</span>

<span class="help-command">history</span>
<span class="help-description">Zeigt Befehlshistorie</span>

<span class="help-command">credits</span>
<span class="help-description">Credits anzeigen</span>

<span class="help-command">sound</span>
<span class="help-description">Sound-Effekte ein-/ausschalten</span>

<span class="info">═══════════════════════════════════════</span>
<span class="warning">💡 Tipp: Nutze ↑/↓ für Historie und Tab für Autovervollständigung</span>
<span class="easter-egg">🥚 Easter Eggs: Probiere 'matrix', 'hack', '42', 'sudo', 'konami'...</span>
`;
        this.print(help);
    }
    
    showCategories() {
        const categories = Object.keys(this.projects).filter(cat => cat !== 'hidden');
        this.print('<span class="category-header">═══ VERFÜGBARE KATEGORIEN ═══</span>');
        categories.forEach(cat => {
            const count = this.projects[cat].length;
            this.print(`<span class="success">▶ ${cat}</span> <span class="info">(${count} Projekte)</span>`);
        });
        this.print('');
        this.print('<span class="warning">Nutze "cd &lt;kategorie&gt;" um in eine Kategorie zu wechseln</span>');
        this.print('<span class="warning">Oder "projects &lt;kategorie&gt;" um Projekte anzuzeigen</span>');
    }
    
    listProjects(category = null) {
        const targetCategory = category || this.currentCategory;
        
        if (targetCategory && this.projects[targetCategory]) {
            this.displayCategoryProjects(targetCategory);
        } else if (!targetCategory) {
            // Show all projects organized by category
            this.print('<span class="category-header">═══ ALLE PROJEKTE ═══</span>');
            Object.keys(this.projects).forEach(cat => {
                if (cat !== 'hidden') {
                    this.displayCategoryProjects(cat);
                }
            });
        } else {
            this.print(`<span class="error">Kategorie nicht gefunden: ${targetCategory}</span>`, 'error');
            this.showCategories();
        }
    }
    
    displayCategoryProjects(category) {
        const projects = this.projects[category];
        this.print(`<span class="category-header">▼ ${category.toUpperCase()} (${projects.length})</span>`);
        projects.forEach((project, index) => {
            const projectDiv = document.createElement('div');
            projectDiv.className = 'project-item';
            projectDiv.style.cursor = 'pointer';
            projectDiv.onclick = () => {
                this.playSound('success');
                window.open(project.url, '_blank');
            };
            
            const title = document.createElement('span');
            title.className = 'project-title';
            title.textContent = `${index + 1}. ${project.name}`;
            
            const desc = document.createElement('div');
            desc.className = 'project-description';
            desc.textContent = project.description;
            
            const url = document.createElement('div');
            url.className = 'project-category';
            url.textContent = `→ ${project.url}`;
            
            projectDiv.appendChild(title);
            projectDiv.appendChild(desc);
            projectDiv.appendChild(url);
            
            const line = document.createElement('div');
            line.className = 'output-line';
            line.appendChild(projectDiv);
            this.output.appendChild(line);
        });
        this.print('');
    }
    
    showProjectDetails(projectName) {
        if (!projectName) {
            this.print('<span class="error">Bitte gib einen Projektnamen an: cat &lt;projektname&gt;</span>', 'error');
            return;
        }
        
        // Search for project
        let found = null;
        let foundCategory = null;
        
        for (const [category, projects] of Object.entries(this.projects)) {
            const project = projects.find(p => 
                p.name.toLowerCase().includes(projectName.toLowerCase())
            );
            if (project) {
                found = project;
                foundCategory = category;
                break;
            }
        }
        
        if (found) {
            const details = `
<span class="category-header">═══ PROJEKT DETAILS ═══</span>
<span class="highlight">Name:</span> <span class="success">${found.name}</span>
<span class="highlight">Kategorie:</span> <span class="warning">${foundCategory}</span>
<span class="highlight">Beschreibung:</span> <span class="info">${found.description}</span>
<span class="highlight">URL:</span> <a href="${found.url}" target="_blank">${found.url}</a>

<span class="success">▶ Klicke auf den Link oder nutze den Link zum Öffnen</span>
`;
            this.print(details);
        } else {
            this.print(`<span class="error">Projekt nicht gefunden: ${projectName}</span>`, 'error');
            this.print('<span class="warning">Nutze "projects" um alle Projekte zu sehen</span>');
        }
    }
    
    changeDirectory(directory) {
        if (!directory || directory === '~') {
            this.currentPath = '~';
            this.currentCategory = null;
            this.print('<span class="success">Zurück zum Home-Verzeichnis</span>');
        } else if (directory === '..') {
            this.currentPath = '~';
            this.currentCategory = null;
            this.print('<span class="success">Zurück zum Home-Verzeichnis</span>');
        } else if (this.projects[directory.toLowerCase()]) {
            this.currentCategory = directory.toLowerCase();
            this.currentPath = `~/${this.currentCategory}`;
            this.print(`<span class="success">Gewechselt zu: ${this.currentPath}</span>`);
            this.print('<span class="info">Nutze "ls" um Projekte in dieser Kategorie zu sehen</span>');
        } else {
            this.print(`<span class="error">Kategorie nicht gefunden: ${directory}</span>`, 'error');
            this.showCategories();
        }
    }
    
    searchProjects(query) {
        if (!query) {
            this.print('<span class="error">Bitte gib einen Suchbegriff an</span>', 'error');
            return;
        }
        
        this.print(`<span class="category-header">═══ SUCHERGEBNISSE FÜR: ${this.escapeHtml(query)} ═══</span>`);
        let found = false;
        
        for (const [category, projects] of Object.entries(this.projects)) {
            if (category === 'hidden') continue;
            
            const matches = projects.filter(p => 
                p.name.toLowerCase().includes(query.toLowerCase()) ||
                p.description.toLowerCase().includes(query.toLowerCase())
            );
            
            if (matches.length > 0) {
                found = true;
                matches.forEach((project) => {
                    const projectDiv = document.createElement('div');
                    projectDiv.className = 'project-item';
                    projectDiv.style.cursor = 'pointer';
                    projectDiv.onclick = () => window.open(project.url, '_blank');
                    
                    const titleSpan = document.createElement('span');
                    titleSpan.className = 'project-title';
                    titleSpan.textContent = project.name;
                    
                    const catSpan = document.createElement('span');
                    catSpan.className = 'project-category';
                    catSpan.textContent = ` [${category}]`;
                    
                    const desc = document.createElement('div');
                    desc.className = 'project-description';
                    desc.textContent = project.description;
                    
                    const url = document.createElement('div');
                    url.className = 'project-category';
                    url.textContent = `→ ${project.url}`;
                    
                    projectDiv.appendChild(titleSpan);
                    projectDiv.appendChild(catSpan);
                    projectDiv.appendChild(desc);
                    projectDiv.appendChild(url);
                    
                    const line = document.createElement('div');
                    line.className = 'output-line';
                    line.appendChild(projectDiv);
                    this.output.appendChild(line);
                });
            }
        }
        
        if (!found) {
            this.print('<span class="warning">Keine Projekte gefunden.</span>');
        }
    }
    
    showTree() {
        this.print('<span class="category-header">═══ PROJEKTSTRUKTUR ═══</span>');
        this.print('<span class="success">.</span>');
        
        Object.keys(this.projects).forEach(category => {
            if (category === 'hidden') return;
            
            const projects = this.projects[category];
            this.print(`<span class="info">├── ${category}/</span>`);
            
            projects.forEach((project, index) => {
                const isLast = index === projects.length - 1;
                const prefix = isLast ? '└──' : '├──';
                this.print(`<span class="warning">│   ${prefix}</span> <span class="success">${project.name}</span>`);
            });
        });
    }
    
    showHistory() {
        this.print('<span class="category-header">═══ BEFEHLSHISTORIE ═══</span>');
        if (this.commandHistory.length === 0) {
            this.print('<span class="warning">Keine Befehle in der Historie</span>');
        } else {
            this.commandHistory.forEach((cmd, index) => {
                this.print(`<span class="info">${index + 1}.</span> ${cmd}`);
            });
        }
    }
    
    showAbout() {
        const about = `
<span class="category-header">═══ ÜBER QUANTUM TERMINAL ═══</span>

<span class="ascii-art">
    ___                 _                 
   / _ \\ _   _  __ _ _ __ | |_ _   _ _ __ ___  
  | | | | | | |/ _\` | '_ \\| __| | | | '_ \` _ \\ 
  | |_| | |_| | (_| | | | | |_| |_| | | | | | |
   \\__\\_\\\\__,_|\\__,_|_| |_|\\__|\\__,_|_| |_| |_|
</span>

<span class="success">Version:</span> <span class="info">1.337</span>
<span class="success">Status:</span> <span class="info">Experimental</span>
<span class="success">Zweck:</span> <span class="info">Portfolio-Showcase im Cyber-Terminal-Style</span>

<span class="warning">Dieses Terminal ist eine interaktive Website, die alle GitHub Pages
Projekte von Professor Quantum Universe präsentiert.</span>

<span class="highlight">Features:</span>
<span class="info">▶ Echte Terminal-Befehle</span>
<span class="info">▶ Interaktive Navigation</span>
<span class="info">▶ Retro-futuristisches Design</span>
<span class="info">▶ Versteckte Easter Eggs</span>
<span class="info">▶ CRT-Monitor Effekte</span>
`;
        this.print(about);
    }
    
    showContact() {
        const contact = `
<span class="category-header">═══ KONTAKT ═══</span>

<span class="success">GitHub:</span> <a href="https://github.com/ProfessorQuantumUniverse" target="_blank">@ProfessorQuantumUniverse</a>
<span class="success">Email:</span> <span class="info">contact [at] quantumuniverse [dot] dev</span>
<span class="success">Web:</span> <a href="https://professorquantumuniverse.github.io" target="_blank">professorquantumuniverse.github.io</a>

<span class="warning">Für Projektanfragen, Kollaborationen oder einfach nur um Hallo zu sagen!</span>
`;
        this.print(contact);
    }
    
    showFortune() {
        const fortunes = [
            "Die Zukunft gehört denen, die an die Schönheit ihrer Träume glauben.",
            "Code ist Poesie in Logik gegossen.",
            "In jedem Bug steckt ein Feature, das darauf wartet, entdeckt zu werden.",
            "Die beste Zeit, einen Baum zu pflanzen, war vor 20 Jahren. Die zweitbeste Zeit ist jetzt.",
            "Scheitern ist nur eine weitere Möglichkeit zu lernen.",
            "Das einzige Limit ist deine Vorstellungskraft... und vielleicht RAM.",
            "Debugging ist wie ein Detektiv in einem Kriminalfall zu sein, wo du auch der Mörder bist.",
            "Es gibt keine Cloud, es ist nur der Computer von jemand anderem.",
            "Quantencomputer: Wo Bits gleichzeitig 0 und 1 sind, bis du hinschaust.",
            "Hacker tippen nicht schneller, sie machen nur weniger Fehler."
        ];
        const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
        this.print(`<span class="easter-egg">🔮 ${randomFortune}</span>`);
    }
    
    showCredits() {
        const credits = `
<span class="category-header">═══ CREDITS ═══</span>

<span class="ascii-art">
   ___             _ _ _       
  / __\\ __ ___  __| (_| |_ ___ 
 / / | '__/ _ \\/ _\` | | __/ __|
/ /__| | |  __| (_| | | |_\\__ \\
\\____/_|  \\___|\\__,_|_|\\__|___/
</span>

<span class="success">Entwickelt von:</span> <span class="highlight">Professor Quantum Universe</span>
<span class="success">Design:</span> <span class="info">Retro-Futuristic Cyber Terminal</span>
<span class="success">Inspiration:</span> <span class="info">80s Hacker Culture, The Matrix, Cyberpunk</span>
<span class="success">Technologie:</span> <span class="info">Vanilla JavaScript, CSS3, HTML5</span>

<span class="warning">Besonderer Dank an alle Open Source Contributors und die Hacker-Community!</span>

<span class="easter-egg">Made with ♥ and lots of ☕</span>
`;
        this.print(credits);
    }
    
    // Easter Eggs
    easterEggMatrix() {
        const matrix = `
<span class="ascii-art glitch">
▓▒░ MATRIX PROTOCOL ACTIVATED ░▒▓

Wake up, Neo...
The Matrix has you...
Follow the white rabbit.

 🐰 Knock, knock, Neo.

01010111 01100001 01101011 01100101 00100000 01110101 01110000
</span>
`;
        this.print(matrix);
        this.print('<span class="success">Zugriff auf versteckte Projekte gewährt...</span>');
        this.displayCategoryProjects('hidden');
    }
    
    easterEggHack() {
        const hackSequence = [
            '[▓▓▓▓▓▓▓▓▓▓] 10% - Initialisiere Hack-Protokoll...',
            '[▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓] 30% - Bypass Firewall...',
            '[▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓] 50% - Dekodiere Mainframe...',
            '[▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓] 75% - Zugriff erlangt...',
            '[▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓] 100% - COMPLETE!'
        ];
        
        this.print('<span class="warning">INITIIERE HACK-SEQUENZ...</span>');
        hackSequence.forEach(line => this.print(`<span class="success">${line}</span>`));
        this.print('<span class="easter-egg glitch">🚨 I\'M IN! 🚨</span>');
        this.print('<span class="info">Nur ein Scherz... oder? 😈</span>');
    }
    
    easterEggSudo(command) {
        if (!command) {
            this.print('<span class="error">sudo: Befehl fehlt</span>', 'error');
        } else if (command === 'make me a sandwich') {
            this.print('<span class="success">🥪 Okay, hier ist dein Sandwich!</span>');
        } else if (command.includes('rm -rf')) {
            this.print('<span class="error">🚨 NEIN! Das ist eine sehr schlechte Idee!</span>', 'error');
            this.print('<span class="warning">Zum Glück ist das nur ein Terminal-Simulator... 😅</span>');
        } else {
            this.print('<span class="warning">[sudo] password for guest:</span>');
            this.print('<span class="error">Sorry, try again.</span>', 'error');
            this.print('<span class="info">Hinweis: Probiere "sudo make me a sandwich" 😉</span>');
        }
    }
    
    easterEggExit() {
        this.print('<span class="warning">Möchtest du wirklich gehen? 🥺</span>');
        this.print('<span class="info">Du kannst nicht einfach aus der Matrix entkommen...</span>');
        this.print('<span class="success">Aber okay, tippe einfach "clear" um fortzufahren!</span>');
    }
    
    easterEggSecret() {
        const secret = `
<span class="easter-egg glitch">
╔═══════════════════════════════════════╗
║  ██████╗ ██████╗    ██████╗  ██████╗  ║
║  ██╔══██╗╚════██╗  ██╔═══██╗██╔═══██╗ ║
║  ██████╔╝ █████╔╝  ██║   ██║██║   ██║ ║
║  ██╔══██╗██╔═══╝   ██║   ██║██║   ██║ ║
║  ██║  ██║███████╗  ╚██████╔╝╚██████╔╝ ║
║  ╚═╝  ╚═╝╚══════╝   ╚═════╝  ╚═════╝  ║
╚═══════════════════════════════════════╝
</span>

<span class="highlight">Die Antwort auf die ultimative Frage nach dem Leben,
dem Universum und dem ganzen Rest ist:</span> <span class="success">42</span>

<span class="info">Vergiss dein Handtuch nicht! 🚀</span>

<span class="warning">Extra Secret: Tippe "konami" für mehr...</span>
`;
        this.print(secret);
    }
    
    easterEggKonami() {
        const konami = `
<span class="easter-egg glitch">
╔════════════════════════════════════════════╗
║  KONAMI CODE AKTIVIERT!                    ║
║  ↑ ↑ ↓ ↓ ← → ← → B A START                ║
╚════════════════════════════════════════════╝
</span>

<span class="success">🎮 30 Extra Leben gewährt!</span>
<span class="success">🚀 Unlimited Power Mode aktiviert!</span>
<span class="success">⭐ Alle Achievements freigeschaltet!</span>

<span class="highlight">Easter Egg Counter: ∞</span>

<span class="info">Du bist ein echter Retro-Gamer! 🕹️</span>
`;
        this.print(konami);
    }
    
    navigateHistory(direction) {
        if (this.commandHistory.length === 0) return;
        
        if (direction === 'up') {
            if (this.historyIndex > 0) {
                this.historyIndex--;
                this.input.value = this.commandHistory[this.historyIndex];
            }
        } else if (direction === 'down') {
            if (this.historyIndex < this.commandHistory.length - 1) {
                this.historyIndex++;
                this.input.value = this.commandHistory[this.historyIndex];
            } else {
                this.historyIndex = this.commandHistory.length;
                this.input.value = '';
            }
        }
    }
    
    handleTabCompletion() {
        const input = this.input.value.toLowerCase();
        const commands = ['help', 'projects', 'cat', 'cd', 'clear', 'ls', 'pwd', 
                         'whoami', 'date', 'echo', 'categories', 'search', 'about',
                         'contact', 'fortune', 'tree', 'history', 'credits',
                         'matrix', 'hack', 'sudo', 'exit', 'secret', 'konami'];
        
        const matches = commands.filter(cmd => cmd.startsWith(input));
        
        if (matches.length === 1) {
            this.input.value = matches[0] + ' ';
        } else if (matches.length > 1) {
            this.print(`<span class="info">Mögliche Befehle: ${matches.join(', ')}</span>`);
        }
    }
    
    clearScreen() {
        this.output.innerHTML = '';
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    print(text, className = '') {
        const line = document.createElement('div');
        line.className = `output-line ${className}`;
        line.innerHTML = text;
        this.output.appendChild(line);
    }
}

// Initialize terminal when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new CyberTerminal();
});

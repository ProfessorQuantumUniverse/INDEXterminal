// Matrix Background Effect
class MatrixEffect {
    constructor() {
        this.canvas = document.getElementById('matrix-bg');
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        
        this.characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?/\\';
        this.fontSize = 14;
        this.columns = 0;
        this.drops = [];
        
        window.addEventListener('resize', () => this.resize());
        this.initDrops();
        this.animate();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.columns = Math.floor(this.canvas.width / 14); // 14 is approx font width
        this.initDrops();
    }
    
    initDrops() {
        this.drops = [];
        for (let i = 0; i < this.columns; i++) {
            this.drops[i] = Math.random() * -100; // Start above screen randomly
        }
    }
    
    animate() {
        // Semi-transparent black to create trail effect
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#0F0'; // Green text
        this.ctx.font = this.fontSize + 'px monospace';
        
        for (let i = 0; i < this.drops.length; i++) {
            const text = this.characters.charAt(Math.floor(Math.random() * this.characters.length));
            this.ctx.fillText(text, i * this.fontSize, this.drops[i] * this.fontSize);
            
            if (this.drops[i] * this.fontSize > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }
            this.drops[i]++;
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

// Terminal class for managing the cyber terminal
class CyberTerminal {
    constructor() {
        // Initialize Matrix Effect
        new MatrixEffect();

        this.input = document.getElementById('terminal-input');
        this.output = document.getElementById('terminal-output');
        this.commandHistory = [];
        this.historyIndex = -1;
        this.currentPath = '~';
        this.fileSystem = {
            '~': {
                type: 'dir',
                children: {
                    'README.txt': { type: 'file', content: 'Welcome to Quantum Terminal v1.337\n\nThis is a fully interactive terminal portfolio.\nUse "help" to see available commands.' },
                    'about.txt': { type: 'file', content: 'Quantum Terminal is a showcase of projects by Professor Quantum Universe.' },
                    'projects': { type: 'dir', children: {} },
                    'system': { type: 'dir', children: {
                        'config.sys': { type: 'file', content: 'BOOT_SEQUENCE=1\nSOUND=1\nTHEME=CYBER' },
                        'logs': { type: 'dir', children: {
                            'boot.log': { type: 'file', content: 'System initialized successfully.' }
                        }}
                    }}
                }
            }
        };
        this.currentDir = this.fileSystem['~'];
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
        await this.showWelcome();
        
        // Setup event listeners
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Resume AudioContext on first interaction
        const resumeAudio = () => {
            const ctx = this.getAudioContext();
            if (ctx && ctx.state === 'suspended') {
                ctx.resume();
            }
            // Remove listeners after first interaction
            document.removeEventListener('click', resumeAudio);
            document.removeEventListener('keydown', resumeAudio);
        };
        document.addEventListener('click', resumeAudio);
        document.addEventListener('keydown', resumeAudio);

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
        const bootBar = document.getElementById('boot-bar');
        
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
        
        // Try to play sound (might be blocked until interaction)
        this.playSound('boot');
        
        for (let i = 0; i < bootMessages.length; i++) {
            bootText.textContent = bootMessages[i];
            // Update progress bar
            const progress = ((i + 1) / bootMessages.length) * 100;
            bootBar.style.width = `${progress}%`;
            
            await this.sleep(300 + Math.random() * 400);
        }
        
        await this.sleep(500);
        bootContainer.classList.add('fade-out');
        await this.sleep(1000);
        bootContainer.style.display = 'none';
    }
    
    // Load projects from JSON file
    async loadProjects() {
        try {
            const response = await fetch('projects.json');
            if (!response.ok) {
                throw new Error(`Failed to load projects: ${response.status} ${response.statusText}`);
            }
            this.projects = await response.json();
        } catch (error) {
            console.error('Error loading projects:', error);
            this.print('<span class="error">⚠ Fehler beim Laden der Projekte. Verwende Fallback-Daten.</span>', 'error');
            // Fallback to empty projects
            this.projects = this.initProjects();
        }
        
        this.buildFileSystem();
    }

    buildFileSystem() {
        const projectsDir = this.fileSystem['~'].children['projects'];
        
        for (const [category, projects] of Object.entries(this.projects)) {
            if (category === 'hidden') continue; // Skip hidden for now, or maybe put in a hidden folder
            
            projectsDir.children[category] = {
                type: 'dir',
                children: {}
            };
            
            projects.forEach(project => {
                // Create a "file" for each project
                const fileName = project.name.toLowerCase().replace(/\s+/g, '-') + '.lnk';
                projectsDir.children[category].children[fileName] = {
                    type: 'link',
                    url: project.url,
                    description: project.description,
                    name: project.name,
                    category: category
                };
            });
        }
        
        // Add hidden folder separately if we want
        if (this.projects['hidden']) {
             this.fileSystem['~'].children['.hidden'] = {
                type: 'dir',
                children: {}
            };
            this.projects['hidden'].forEach(project => {
                 const fileName = project.name.toLowerCase().replace(/\s+/g, '-') + '.lnk';
                 this.fileSystem['~'].children['.hidden'].children[fileName] = {
                    type: 'link',
                    url: project.url,
                    description: project.description,
                    name: project.name,
                    category: 'hidden'
                };
            });
        }
    }
    
    // Initialize audio context (reuse for performance)
    getAudioContext() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        return this.audioContext;
    }
    
    // Play sound effect
    playSound(type) {
        if (!this.soundEnabled) return;
        
        try {
            const audioContext = this.getAudioContext();
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
        } catch (error) {
            // Silently fail if audio context is not available
            console.warn('Audio playback failed:', error);
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
    
    async showWelcome() {
        const welcomeText = `
<span class="info">═══════════════════════════════════════════════════════════════════</span>
<span class="success">  Willkommen im QUANTUM TERMINAL v1.337</span>
<span class="info">  System: ONLINE | Status: BEREIT | Sicherheit: OPTIMAL</span>
<span class="info">═══════════════════════════════════════════════════════════════════</span>

<span class="warning">Tippe 'help' für eine Liste aller verfügbaren Befehle.</span>
<span class="warning">Tippe 'projects' um alle Projekte zu sehen.</span>
`;
        this.print(welcomeText, 'ascii-art');
        await this.typeText('System initialized. Waiting for input...', 'info', 30);
    }
    
    // Helper to resolve path to a node
    resolvePath(path) {
        if (!path || path === '' || path === '.') return { node: this.currentDir, path: this.currentPath };
        if (path === '~') return { node: this.fileSystem['~'], path: '~' };
        
        let parts = path.split('/').filter(p => p !== '');
        let current = (path.startsWith('~') || path.startsWith('/')) ? this.fileSystem['~'] : this.currentDir;
        let currentPathParts = (path.startsWith('~') || path.startsWith('/')) ? ['~'] : this.currentPath.split('/').filter(p => p !== '' && p !== '~');
        
        // Handle ~ at start of path
        if (parts[0] === '~') {
            parts.shift();
        }

        for (const part of parts) {
            if (part === '..') {
                if (currentPathParts.length > 0 && currentPathParts[0] !== '~') {
                     // Should not happen if root is ~
                } else if (currentPathParts.length > 1) {
                    currentPathParts.pop();
                    // Re-traverse from root to find parent (inefficient but simple for this structure)
                    current = this.fileSystem['~'];
                    for (let i = 1; i < currentPathParts.length; i++) {
                        current = current.children[currentPathParts[i]];
                    }
                }
            } else if (part === '.') {
                continue;
            } else {
                if (current.type === 'dir' && current.children[part]) {
                    current = current.children[part];
                    currentPathParts.push(part);
                } else {
                    return null; // Path not found
                }
            }
        }
        
        return { node: current, path: currentPathParts.join('/') };
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
    
    updatePrompt() {
        const promptText = document.getElementById('prompt-text');
        if (promptText) {
            promptText.textContent = `guest@quantum:${this.currentPath}$`;
        }
    }
    
    executeCommand(command) {
        const [cmd, ...args] = command.toLowerCase().split(' ');
        
        switch(cmd) {
            case 'help':
                this.showHelp();
                break;
            case 'projects':
                this.listProjects(args[0]);
                break;
            case 'ls':
            case 'dir':
                this.listDirectory(args[0]);
                break;
            case 'cat':
            case 'type':
                this.readFile(args.join(' '));
                break;
            case 'cd':
                this.changeDirectory(args[0]);
                break;
            case 'pwd':
                this.print(this.currentPath, 'info');
                break;
            case 'mkdir':
                this.makeDirectory(args[0]);
                break;
            case 'touch':
                this.touchFile(args[0]);
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

            case 'notes':
                this.openNotes();
                break;
            case 'audplayer':
                this.launchAudPlayer();
                break;
            default:
                this.playSound('error');
                this.print(`<span class="error">Befehl nicht gefunden: ${cmd}</span>`, 'error');
                this.print('Tippe "help" für eine Liste aller Befehle.', 'warning');
        }
    }
    
    async typeText(text, className = 'info', speed = 30) {
        const div = document.createElement('div');
        div.className = 'output-line ' + className;
        this.output.appendChild(div);
        
        for (let i = 0; i < text.length; i++) {
            div.textContent += text[i];
            this.output.scrollTop = this.output.scrollHeight;
            await this.sleep(speed);
        }
    }



    openNotes() {
        this.print('<span class="category-header">═══ NOTES APP ═══</span>');
        this.print('1. Weltherrschaftspläne (Verschlüsselt)');
        this.print('2. Einkaufsliste: Milch, Eier, Quantenflux-Kompensator');
        this.print('3. Ideen für neue Projekte');
        this.print('<span class="warning">Zugriff verweigert: Biometrischer Scan erforderlich.</span>');
    }

    launchAudPlayer() {
        this.print('<span class="category-header">═══ AUDIO PLAYER ═══</span>');
        this.print('Initialisiere Audio-Subsystem...');
        setTimeout(() => {
            this.print('<span class="error">Fehler: Keine Audio-Dateien gefunden.</span>', 'error');
            this.print('Bitte lege Kassetten ein.', 'info');
        }, 1000);
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

<span class="help-command">ls / dir</span>
<span class="help-description">Listet Verzeichnisinhalt auf</span>

<span class="help-command">cd &lt;pfad&gt;</span>
<span class="help-description">Wechselt das Verzeichnis</span>

<span class="help-command">cat &lt;datei&gt;</span>
<span class="help-description">Zeigt Dateiinhalt oder Projektdetails</span>

<span class="help-command">projects</span>
<span class="help-description">Listet alle Projekte (Shortcut)</span>

<span class="help-command">pwd</span>
<span class="help-description">Zeigt aktuellen Pfad</span>

<span class="help-command">mkdir &lt;name&gt;</span>
<span class="help-description">Erstellt ein Verzeichnis</span>

<span class="help-command">touch &lt;name&gt;</span>
<span class="help-description">Erstellt eine leere Datei</span>

<span class="help-command">search &lt;query&gt;</span>
<span class="help-description">Sucht nach Projekten</span>

<span class="help-command">tree</span>
<span class="help-description">Zeigt Struktur als Baum</span>

<span class="help-command">clear / cls</span>
<span class="help-description">Löscht den Bildschirm</span>

<span class="help-command">whoami</span>
<span class="help-description">Zeigt Benutzerinformationen</span>

<span class="help-command">about</span>
<span class="help-description">Über dieses Terminal</span>

<span class="help-command">contact</span>
<span class="help-description">Kontaktinformationen</span>

<span class="info">═══════════════════════════════════════</span>
<span class="warning">💡 Tipp: Nutze ↑/↓ für Historie und Tab für Autovervollständigung</span>
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
    
    changeDirectory(path) {
        if (!path || path === '~') {
            this.currentDir = this.fileSystem['~'];
            this.currentPath = '~';
            this.updatePrompt();
            return;
        }
        
        const result = this.resolvePath(path);
        
        if (result && result.node.type === 'dir') {
            this.currentDir = result.node;
            this.currentPath = result.path;
            this.updatePrompt();
        } else if (result && result.node.type !== 'dir') {
            this.print(`<span class="error">cd: ${path}: Ist kein Verzeichnis</span>`, 'error');
        } else {
            this.print(`<span class="error">cd: ${path}: Datei oder Verzeichnis nicht gefunden</span>`, 'error');
        }
    }

    listDirectory(path) {
        let targetNode = this.currentDir;
        
        if (path) {
            const result = this.resolvePath(path);
            if (result) {
                targetNode = result.node;
            } else {
                this.print(`<span class="error">ls: ${path}: Datei oder Verzeichnis nicht gefunden</span>`, 'error');
                return;
            }
        }
        
        if (targetNode.type === 'dir') {
            const items = Object.keys(targetNode.children).sort();
            if (items.length === 0) {
                // Empty directory
                return;
            }
            
            // Format output
            const outputDiv = document.createElement('div');
            outputDiv.className = 'ls-output';
            outputDiv.style.display = 'flex';
            outputDiv.style.flexWrap = 'wrap';
            outputDiv.style.gap = '20px';
            
            items.forEach(item => {
                const child = targetNode.children[item];
                const span = document.createElement('span');
                span.textContent = item + (child.type === 'dir' ? '/' : '');
                span.className = child.type === 'dir' ? 'ls-dir' : (child.type === 'link' ? 'ls-link' : 'ls-file');
                if (child.type === 'dir') span.style.color = '#00d4ff';
                if (child.type === 'link') span.style.color = '#00ff41';
                outputDiv.appendChild(span);
            });
            
            this.output.appendChild(outputDiv);
            this.print(''); // New line
        } else {
            // List single file
            this.print(path);
        }
    }

    readFile(path) {
        if (!path) {
            this.print('<span class="error">cat: Dateiname fehlt</span>', 'error');
            return;
        }
        
        const result = this.resolvePath(path);
        
        if (result) {
            const node = result.node;
            if (node.type === 'file') {
                this.print(this.escapeHtml(node.content), 'file-content');
            } else if (node.type === 'link') {
                this.print(`<span class="category-header">═══ PROJEKT DETAILS ═══</span>`);
                this.print(`<span class="highlight">Name:</span> <span class="success">${node.name}</span>`);
                this.print(`<span class="highlight">Kategorie:</span> <span class="warning">${node.category}</span>`);
                this.print(`<span class="highlight">Beschreibung:</span> <span class="info">${node.description}</span>`);
                this.print(`<span class="highlight">URL:</span> <a href="${node.url}" target="_blank">${node.url}</a>`);
                this.print(`<span class="success">▶ Klicke auf den Link um das Projekt zu öffnen</span>`);
            } else if (node.type === 'dir') {
                this.print(`<span class="error">cat: ${path}: Ist ein Verzeichnis</span>`, 'error');
            }
        } else {
            this.print(`<span class="error">cat: ${path}: Datei oder Verzeichnis nicht gefunden</span>`, 'error');
        }
    }

    makeDirectory(path) {
        if (!path) {
            this.print('<span class="error">mkdir: Verzeichnisname fehlt</span>', 'error');
            return;
        }
        
        // Simple implementation: only in current directory for now
        if (this.currentDir.children[path]) {
            this.print(`<span class="error">mkdir: ${path}: Existiert bereits</span>`, 'error');
            return;
        }
        
        this.currentDir.children[path] = {
            type: 'dir',
            children: {}
        };
        this.print(`<span class="success">Verzeichnis erstellt: ${path}</span>`);
    }

    touchFile(path) {
        if (!path) {
            this.print('<span class="error">touch: Dateiname fehlt</span>', 'error');
            return;
        }
        
        if (this.currentDir.children[path]) {
            // Update timestamp (simulated)
            return;
        }
        
        this.currentDir.children[path] = {
            type: 'file',
            content: ''
        };
        this.print(`<span class="success">Datei erstellt: ${path}</span>`);
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
        this.print('<span class="category-header">═══ DATEISYSTEM ═══</span>');
        this.print('<span class="success">~</span>');
        this.traverseTreeChildren(this.fileSystem['~'], '');
    }

    traverseTreeChildren(node, prefix) {
        const children = Object.keys(node.children).sort();
        children.forEach((childName, index) => {
            const isLast = index === children.length - 1;
            const childNode = node.children[childName];
            const pointer = isLast ? '└── ' : '├── ';
            const nextPrefix = prefix + (isLast ? '    ' : '│   ');
            
            const typeClass = childNode.type === 'dir' ? 'ls-dir' : (childNode.type === 'link' ? 'ls-link' : 'ls-file');
            const suffix = childNode.type === 'dir' ? '/' : '';
            
            this.print(`<span class="warning">${prefix}${pointer}</span><span class="${typeClass}">${childName}${suffix}</span>`);
            
            if (childNode.type === 'dir') {
                this.traverseTreeChildren(childNode, nextPrefix);
            }
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
        const input = this.input.value;
        const parts = input.split(' ');
        
        if (parts.length === 1) {
            // Command completion
            const cmd = parts[0].toLowerCase();
            const commands = ['help', 'projects', 'cat', 'cd', 'clear', 'ls', 'pwd', 
                             'whoami', 'date', 'echo', 'categories', 'search', 'about',
                             'contact', 'fortune', 'tree', 'history', 'credits',
                             'matrix', 'hack', 'sudo', 'exit', 'secret', 'konami',
                             'mkdir', 'touch'];
            
            const matches = commands.filter(c => c.startsWith(cmd));
            
            if (matches.length === 1) {
                this.input.value = matches[0] + ' ';
            } else if (matches.length > 1) {
                this.print(`<span class="info">Mögliche Befehle: ${matches.join(', ')}</span>`);
            }
        } else {
            // File/Directory completion
            const lastPart = parts[parts.length - 1];
            const currentItems = Object.keys(this.currentDir.children);
            
            const matches = currentItems.filter(item => item.startsWith(lastPart));
            
            if (matches.length === 1) {
                parts[parts.length - 1] = matches[0];
                // Add slash if it's a directory
                if (this.currentDir.children[matches[0]].type === 'dir') {
                    parts[parts.length - 1] += '/';
                }
                this.input.value = parts.join(' ');
            } else if (matches.length > 1) {
                this.print(`<span class="info">Mögliche Dateien: ${matches.join(', ')}</span>`);
            }
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

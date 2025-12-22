// Admin Panel JavaScript
// Handles GitHub API integration for scanning repositories and updating projects.json

class AdminPanel {
    constructor() {
        this.username = '';
        this.token = '';
        this.repositories = [];
        this.projectsData = {};
        this.repoName = 'INDEXterminal';
        
        // Category keywords mapping
        this.categoryKeywords = {
            'games': ['game', 'spiel', 'play', 'arcade', 'tetris', 'snake', 'pong', 'invaders', 'breakout'],
            'tools': ['tool', 'generator', 'converter', 'formatter', 'encoder', 'decoder', 'tester', 'checker'],
            'experimente': ['experiment', 'simulator', 'simulation', 'quantum', 'neural', 'ai', 'ml', 'science', 'physics', 'dna', 'chaos', 'particle'],
            'sonstiges': ['portfolio', 'blog', 'cv', 'contact', 'about', 'resume', 'personal'],
            'kram': [] // Default category for uncategorized
        };
        
        this.init();
    }
    
    init() {
        // Initialize Matrix Background
        this.initMatrix();
        
        // Bind event listeners
        document.getElementById('scan-btn').addEventListener('click', () => this.scanRepositories());
        document.getElementById('preview-btn').addEventListener('click', () => this.showPreview());
        document.getElementById('push-btn').addEventListener('click', () => this.pushToRepository());
        
        // Allow editing the JSON preview
        document.getElementById('json-preview').removeAttribute('readonly');
        
        this.log('Admin Panel initialisiert. Bereit zum Scannen.', 'info');
    }
    
    initMatrix() {
        const canvas = document.getElementById('matrix-bg');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        const drops = [];
        
        for (let i = 0; i < columns; i++) {
            drops[i] = Math.random() * -100;
        }
        
        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#0F0';
            ctx.font = fontSize + 'px monospace';
            
            for (let i = 0; i < drops.length; i++) {
                const text = chars.charAt(Math.floor(Math.random() * chars.length));
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
            
            requestAnimationFrame(draw);
        };
        
        draw();
        
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }
    
    log(message, type = 'info') {
        const statusLog = document.getElementById('status-log');
        const entry = document.createElement('div');
        entry.className = `log-entry ${type}`;
        entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        statusLog.appendChild(entry);
        statusLog.scrollTop = statusLog.scrollHeight;
    }
    
    updateProgress(percent, text = null) {
        const progressContainer = document.getElementById('progress-container');
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');
        
        if (percent === 0) {
            progressContainer.classList.remove('hidden');
        } else if (percent >= 100) {
            setTimeout(() => progressContainer.classList.add('hidden'), 1000);
        }
        
        progressFill.style.width = `${percent}%`;
        progressText.textContent = text || `${Math.round(percent)}%`;
    }
    
    async scanRepositories() {
        this.username = document.getElementById('github-username').value.trim();
        this.token = document.getElementById('github-token').value.trim();
        
        if (!this.username) {
            this.log('Fehler: Bitte GitHub Username eingeben!', 'error');
            return;
        }
        
        if (!this.token) {
            this.log('Fehler: Bitte GitHub Token eingeben!', 'error');
            return;
        }
        
        this.log(`Starte Scan für User: ${this.username}...`, 'info');
        this.updateProgress(0);
        
        try {
            // Fetch all repositories
            this.log('Lade Repositories...', 'info');
            this.updateProgress(10, 'Lade Repos...');
            
            const repos = await this.fetchAllRepositories();
            this.log(`${repos.length} Repositories gefunden.`, 'success');
            this.updateProgress(30);
            
            // Filter for repos with GitHub Pages
            this.log('Filtere Repositories mit GitHub Pages...', 'info');
            const pagesRepos = await this.filterPagesRepositories(repos);
            this.log(`${pagesRepos.length} Repositories mit GitHub Pages gefunden.`, 'success');
            this.updateProgress(70);
            
            // Generate projects data
            this.log('Generiere Projekt-Daten...', 'info');
            this.projectsData = this.generateProjectsData(pagesRepos);
            this.updateProgress(100, 'Fertig!');
            
            // Update stats
            document.getElementById('total-repos').textContent = `${repos.length} Repositories`;
            document.getElementById('pages-repos').textContent = `${pagesRepos.length} mit GitHub Pages`;
            
            // Enable buttons
            document.getElementById('preview-btn').disabled = false;
            document.getElementById('push-btn').disabled = false;
            
            // Auto-show preview
            this.showPreview();
            
            this.log('Scan abgeschlossen! Überprüfe die Vorschau und pushe bei Bedarf.', 'success');
            
        } catch (error) {
            this.log(`Fehler: ${error.message}`, 'error');
            this.updateProgress(0);
            console.error(error);
        }
    }
    
    async fetchAllRepositories() {
        const repos = [];
        let page = 1;
        const perPage = 100;
        
        while (true) {
            const response = await fetch(
                `https://api.github.com/users/${this.username}/repos?per_page=${perPage}&page=${page}&sort=updated`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.token}`,
                        'Accept': 'application/vnd.github.v3+json'
                    }
                }
            );
            
            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Invalid token or missing permissions');
                } else if (response.status === 404) {
                    throw new Error('User not found');
                }
                throw new Error(`GitHub API error: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.length === 0) break;
            
            repos.push(...data);
            
            if (data.length < perPage) break;
            
            page++;
        }
        
        return repos;
    }
    
    async filterPagesRepositories(repos) {
        const pagesRepos = [];
        let processed = 0;
        const total = repos.length;
        
        for (const repo of repos) {
            processed++;
            this.updateProgress(30 + (processed / total) * 40, `Prüfe ${repo.name}...`);
            
            // Check if repo has GitHub Pages
            if (repo.has_pages) {
                // Get the actual Pages URL
                try {
                    const pagesResponse = await fetch(
                        `https://api.github.com/repos/${this.username}/${repo.name}/pages`,
                        {
                            headers: {
                                'Authorization': `Bearer ${this.token}`,
                                'Accept': 'application/vnd.github.v3+json'
                            }
                        }
                    );
                    
                    if (pagesResponse.ok) {
                        const pagesData = await pagesResponse.json();
                        repo.pages_url = pagesData.html_url;
                        pagesRepos.push(repo);
                    }
                } catch (e) {
                    // Fallback to constructed URL
                    repo.pages_url = `https://${this.username.toLowerCase()}.github.io/${repo.name}`;
                    if (repo.has_pages) {
                        pagesRepos.push(repo);
                    }
                }
            }
            
            // Small delay to avoid rate limiting
            await this.sleep(50);
        }
        
        return pagesRepos;
    }
    
    generateProjectsData(repos) {
        const projects = {
            'experimente': [],
            'tools': [],
            'games': [],
            'sonstiges': [],
            'kram': [],
            'hidden': []
        };
        
        for (const repo of repos) {
            // Skip the current repository itself
            if (repo.name.toLowerCase() === this.repoName.toLowerCase()) {
                continue;
            }
            
            const name = this.formatName(repo.name);
            const description = this.getDescription(repo);
            const url = repo.pages_url || `https://${this.username.toLowerCase()}.github.io/${repo.name}`;
            
            const category = this.categorizeRepo(repo);
            
            projects[category].push({
                name: name,
                description: description,
                url: url
            });
        }
        
        // Remove empty categories except 'hidden' and 'kram'
        const cleanedProjects = {};
        for (const [category, items] of Object.entries(projects)) {
            if (items.length > 0 || category === 'hidden' || category === 'kram') {
                cleanedProjects[category] = items;
            }
        }
        
        return cleanedProjects;
    }
    
    formatName(repoName) {
        // Convert repo-name or repo_name to Title Case
        return repoName
            .replace(/[-_]/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
    }
    
    getDescription(repo) {
        if (repo.description) {
            // Truncate to first 100 characters if too long
            const desc = repo.description;
            if (desc.length > 100) {
                return desc.substring(0, 97) + '...';
            }
            return desc;
        }
        return `GitHub Pages Projekt: ${this.formatName(repo.name)}`;
    }
    
    categorizeRepo(repo) {
        const searchText = `${repo.name} ${repo.description || ''} ${(repo.topics || []).join(' ')}`.toLowerCase();
        
        for (const [category, keywords] of Object.entries(this.categoryKeywords)) {
            if (category === 'kram') continue; // Skip default category in search
            
            for (const keyword of keywords) {
                if (searchText.includes(keyword)) {
                    return category;
                }
            }
        }
        
        return 'kram'; // Default category
    }
    
    showPreview() {
        const previewSection = document.getElementById('preview-section');
        const jsonPreview = document.getElementById('json-preview');
        
        previewSection.classList.remove('hidden');
        jsonPreview.value = JSON.stringify(this.projectsData, null, 2);
    }
    
    async pushToRepository() {
        const jsonPreview = document.getElementById('json-preview');
        let finalData;
        
        try {
            finalData = JSON.parse(jsonPreview.value);
        } catch (e) {
            this.log('Fehler: Ungültiges JSON Format!', 'error');
            return;
        }
        
        this.log('Starte Push zu Repository...', 'info');
        this.updateProgress(0);
        
        try {
            // Get current file SHA (needed for update)
            this.log('Fetching current file info...', 'info');
            this.updateProgress(20);
            
            const currentFileResponse = await fetch(
                `https://api.github.com/repos/${this.username}/${this.repoName}/contents/projects.json`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.token}`,
                        'Accept': 'application/vnd.github.v3+json'
                    }
                }
            );
            
            let sha = null;
            if (currentFileResponse.ok) {
                const currentFile = await currentFileResponse.json();
                sha = currentFile.sha;
            }
            
            // Prepare content - use TextEncoder for proper UTF-8 handling
            const jsonString = JSON.stringify(finalData, null, 2);
            const content = btoa(String.fromCharCode(...new TextEncoder().encode(jsonString)));
            
            // Update file
            this.log('Updating projects.json...', 'info');
            this.updateProgress(50);
            
            const updateBody = {
                message: '🔄 Auto-update projects.json via Admin Panel',
                content: content,
                branch: 'main'
            };
            
            if (sha) {
                updateBody.sha = sha;
            }
            
            const updateResponse = await fetch(
                `https://api.github.com/repos/${this.username}/${this.repoName}/contents/projects.json`,
                {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${this.token}`,
                        'Accept': 'application/vnd.github.v3+json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updateBody)
                }
            );
            
            if (!updateResponse.ok) {
                const errorData = await updateResponse.json();
                throw new Error(errorData.message || 'Update failed');
            }
            
            this.updateProgress(100, 'Success!');
            this.log('✅ projects.json successfully updated!', 'success');
            this.log('Changes will be live after next GitHub Pages deploy.', 'info');
            
        } catch (error) {
            this.log(`Push error: ${error.message}`, 'error');
            this.updateProgress(0);
            console.error(error);
        }
    }
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new AdminPanel();
});

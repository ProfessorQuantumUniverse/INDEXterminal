# QUANTUM TERMINAL v1.337 🚀

Eine interaktive Cyber/Hacker-Terminal-Website im Retro-Futuristischen Stil, die alle GitHub Pages Projekte übersichtlich präsentiert.

## ✨ Features

- **Boot-Sequenz Animation**: Epische Boot-Screen mit Ladeanimation beim Start
- **Authentisches Terminal-Feeling**: Klassisches Terminal-Design mit erweiterten CRT-Effekten
- **Sound-Effekte**: Interaktive Tastatur-Sounds und Audio-Feedback (ein/ausschaltbar)
- **Interaktive Befehle**: Echte Terminal-Befehle für Navigation und Exploration
- **JSON-basierte Projektverwaltung**: Einfaches Hinzufügen neuer Projekte über JSON-Datei
- **Erweiterte Animationen**: Smooth Hover-Effekte, Glitch-Animationen, Glow-Effekte
- **Projekt-Kategorien**: Organisiert in Experimente, Kram, Sonstiges, Games, Tools
- **Versteckte Easter Eggs**: Geheime Befehle und Überraschungen für neugierige User
- **Retro-Futuristisch**: Verbesserte Scanline-Effekte, CRT-Glow, Neon-Leuchteffekte
- **Vollständig Responsive**: Funktioniert auf allen Geräten

## 🎮 Verfügbare Befehle

### Navigation & Projekte
- `help` - Zeigt alle verfügbaren Befehle
- `projects [kategorie]` - Listet alle Projekte oder nach Kategorie
- `categories` - Zeigt alle verfügbaren Kategorien
- `cat <projektname>` - Zeigt Details zu einem Projekt
- `cd <kategorie>` - Wechselt in eine Kategorie
- `ls` - Listet Projekte in aktueller Kategorie
- `pwd` - Zeigt aktuellen Pfad
- `search <term>` - Sucht nach Projekten
- `tree` - Zeigt Projektstruktur als Baum

### System-Befehle
- `clear` / `cls` - Löscht den Bildschirm
- `whoami` - Zeigt Benutzerinfo
- `date` - Zeigt aktuelles Datum
- `echo <text>` - Gibt Text aus
- `history` - Zeigt Befehlshistorie
- `sound` - Sound-Effekte ein-/ausschalten

### Info & Kontakt
- `about` - Über das Terminal
- `contact` - Kontaktinformationen
- `fortune` - Zufälliges Zitat
- `credits` - Credits anzeigen

### 🥚 Easter Eggs (versteckte Befehle)
- `matrix` - Aktiviert Matrix-Protokoll
- `hack` - Startet Hack-Sequenz
- `sudo [befehl]` - Probier's aus... 😉
- `42` / `secret` - Die Antwort auf alles
- `konami` - Für echte Gamer
- `exit` / `quit` - Versuch mal zu gehen...

## 🎨 Design-Features

- **Boot-Screen**: Animierte Boot-Sequenz mit ASCII-Logo und Ladebalken
- **CRT-Monitor Effekt**: Authentisches Röhrenmonitor-Feeling mit Radial-Glow
- **Animierte Scanlines**: Bewegliche Retro-Scanline-Overlays
- **Flicker Animation**: Subtiles Monitor-Flimmern
- **Enhanced Neon-Glow**: Pulsierende Leuchteffekte für Texte und Elemente
- **Smooth Hover-Animationen**: Gleitende Shine-Effekte bei Projekt-Hover
- **Glitch-Effekte**: Verbesserte Glitch-Animationen für Easter Eggs
- **Gradient-Backgrounds**: Mehrschichtige Farbverläufe für mehr Tiefe
- **Color Scheme**: Klassisches Grün auf Schwarz mit Cyan, Magenta und Orange-Akzenten

## 🚀 Verwendung

1. Terminal öffnen (einfach die Seite laden)
2. Boot-Sequenz genießen (lädt automatisch)
3. `help` eingeben für eine Liste aller Befehle
4. `projects` eingeben um alle Projekte zu sehen
5. Mit Pfeiltasten durch Historie navigieren
6. Tab-Taste für Autovervollständigung nutzen
7. `sound` eingeben um Sound-Effekte ein/auszuschalten
8. Easter Eggs entdecken!

## 📝 Neue Projekte hinzufügen

Das Hinzufügen neuer Projekte ist jetzt super einfach! Bearbeite einfach die `projects.json` Datei:

```json
{
  "kategorie-name": [
    {
      "name": "Projekt-Name",
      "description": "Eine kurze Beschreibung des Projekts",
      "url": "https://deine-projekt-url.com"
    }
  ]
}
```

**Beispiel:**
```json
{
  "experimente": [
    {
      "name": "Neues-Quantum-Projekt",
      "description": "Ein revolutionäres Quantenexperiment",
      "url": "https://professorquantumuniverse.github.io/new-project"
    }
  ]
}
```

Die Änderungen werden beim nächsten Laden der Seite automatisch übernommen!

## 📁 Projekt-Kategorien

- **Experimente**: Wissenschaftliche und experimentelle Projekte
- **Kram**: Nützliche Tools und kleine Projekte
- **Sonstiges**: Portfolio, Blog und persönliche Projekte
- **Games**: Retro-Spiele und interaktive Games
- **Tools**: Entwickler-Tools und Utilities
- **Hidden**: Geheime Projekte (mit Easter Egg freischaltbar)

## 🛠️ Technologie-Stack

- **HTML5**: Struktur mit Boot-Screen
- **CSS3**: Advanced Styling mit Keyframe-Animationen und erweiterten Effekten
- **Vanilla JavaScript**: Keine Dependencies, pure JS mit async/await
- **Web Audio API**: Synthesized Sound-Effekte
- **JSON**: Externe Projektverwaltung
- **GitHub Pages**: Hosting

## 🎵 Sound-Effekte

Das Terminal nutzt die Web Audio API um synthetisierte Sound-Effekte zu erzeugen:
- **Keypress**: Subtiler Tastatur-Sound beim Tippen
- **Enter**: Bestätigungs-Sound bei Befehlsausführung
- **Boot**: Startup-Sound bei der Boot-Sequenz
- **Error**: Fehler-Feedback-Sound
- **Success**: Erfolgs-Sound bei Projekt-Klicks

Sounds können jederzeit mit dem `sound` Befehl deaktiviert werden.

## 🎯 Tastatur-Shortcuts

- **↑/↓**: Durch Befehlshistorie navigieren
- **Tab**: Befehle automatisch vervollständigen
- **Enter**: Befehl ausführen
- **Ctrl+L**: Bildschirm löschen (kann auch `clear` nutzen)

## 📝 Lizenz

© 2024 - infinity Professor Quantum Universe

## 🌟 Fun Facts

- Über 30 Projekte kategorisiert
- 15+ interaktive Befehle
- 6+ Easter Eggs versteckt
- 100% Retro-Vibes

---

**Made with ♥ and lots of ☕ by Professor Quantum Universe**

*"In Code we trust, in Terminal we hack!"*

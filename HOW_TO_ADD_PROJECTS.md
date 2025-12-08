# 📝 How to Add New Projects

Adding new projects to your Quantum Terminal is now super easy! Just follow these simple steps:

## Step 1: Open projects.json

Open the `projects.json` file in your favorite text editor.

## Step 2: Find the Right Category

The file has several categories:
- `experimente` - Scientific and experimental projects
- `kram` - Useful tools and small projects
- `sonstiges` - Portfolio, blog, and personal projects
- `games` - Retro games and interactive games
- `tools` - Developer tools and utilities
- `hidden` - Secret projects (unlocked with Easter eggs)

## Step 3: Add Your Project

Add your new project to the appropriate category array:

```json
{
  "name": "Your-Project-Name",
  "description": "A brief description of what your project does",
  "url": "https://your-project-url.com"
}
```

### Example: Adding a new game

```json
{
  "games": [
    {
      "name": "Space-Invaders",
      "description": "Klassisches Space Invaders im Terminal-Style",
      "url": "https://professorquantumuniverse.github.io/space-invaders"
    },
    {
      "name": "My-New-Game",
      "description": "An awesome new retro game",
      "url": "https://professorquantumuniverse.github.io/my-new-game"
    }
  ]
}
```

## Step 4: Save and Test

1. Save the `projects.json` file
2. Refresh your browser
3. Type `projects` or `ls` in the terminal to see your new project!

## Creating a New Category

You can also create entirely new categories:

```json
{
  "experimente": [ /* existing projects */ ],
  "my-new-category": [
    {
      "name": "First-Project-In-Category",
      "description": "Description here",
      "url": "https://your-url.com"
    }
  ]
}
```

## Important Notes

✅ **DO:**
- Use valid JSON format (check with a JSON validator if unsure)
- Use descriptive project names with hyphens (e.g., `My-Cool-Project`)
- Write clear, concise descriptions
- Test your URLs before adding them

❌ **DON'T:**
- Forget commas between objects (but not after the last one!)
- Use trailing commas in JSON
- Break the JSON structure
- Use special characters that need escaping

## JSON Format Tips

```json
{
  "category": [
    {
      "name": "Project-One",
      "description": "Description",
      "url": "https://url.com"
    },  ← Comma here (not the last item)
    {
      "name": "Project-Two",
      "description": "Description",
      "url": "https://url.com"
    }  ← No comma here (last item)
  ]
}
```

## Validation

Before committing your changes, validate your JSON:
```bash
python3 -c "import json; json.load(open('projects.json')); print('✅ JSON is valid')"
```

Or use an online JSON validator like [jsonlint.com](https://jsonlint.com/)

## That's It!

Your terminal will automatically load and display your new projects. No code changes needed! 🎉

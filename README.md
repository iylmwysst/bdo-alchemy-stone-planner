# BDO Alchemy Stone Enhancement Planner

A comprehensive web-based calculator for planning Black Desert Online Alchemy Stone enhancements using the Ancient Anvil pity system.

## Features

- **Bilingual Support**: Full Thai and English language support
- **Resource Calculator**: Calculate exact Brimming Essence of Aether requirements
- **Pity System Tracker**: Track Ancient Anvil pity progress
- **Enhancement Planning**: Plan upgrades from any level to maximum
- **Cost Estimation**: Calculate total silver costs based on fixed 100M per stone
- **Real-time Progress**: Visual progress bars showing resource sufficiency
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Enhancement Levels

The calculator supports all Alchemy Stone enhancement levels:
- Imperfect (Base)
- Sturdy
- Sharp
- Resplendent
- Splendid
- Shining

## How to Use

1. **Input Your Resources**: Enter the number of Brimming Essence of Aether you currently own
2. **Select Current Level**: Choose your current Alchemy Stone enhancement level
3. **Enter Pity Stack**: (Optional) Input your current Agris Essence stack count
4. **View Results**: See exactly how many resources you need for each milestone

## Tech Stack

- **React 18**: Modern React with hooks
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful icon library

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Development

The project uses:
- **Vite** for blazing fast HMR and optimized builds
- **Tailwind CSS** for responsive, modern styling
- **ESLint** for code quality

## Build & Deploy

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

### Deploy to GitHub Pages

1. Push your code to GitHub
2. Go to repository Settings > Pages
3. Select "GitHub Actions" as the source
4. Use the provided workflow file or manually deploy the `dist` folder

Alternatively, you can use GitHub Actions for automatic deployment:

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## Project Structure

```
bdo-alchemy-stone-planner/
├── src/
│   ├── App.jsx          # Main application component
│   ├── main.jsx         # Application entry point
│   └── index.css        # Global styles (Tailwind)
├── public/              # Static assets
├── index.html           # HTML template
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind configuration
├── postcss.config.js    # PostCSS configuration
└── package.json         # Project dependencies
```

## Game Information

This calculator uses the **Ancient Anvil** pity system introduced in Black Desert Online:
- Each failed enhancement attempt accumulates Agris Essence
- When pity limit is reached, you can use the Ancient Anvil for guaranteed 100% success
- Fixed price: 100,000,000 Silver per Brimming Essence of Aether

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Acknowledgments

- Black Desert Online by Pearl Abyss
- Enhancement data based on official game mechanics
- Community feedback and testing

## Support

If you find this tool helpful, consider:
- Starring the repository on GitHub
- Sharing it with your guild members
- Reporting bugs or suggesting features via GitHub Issues

---

**Note**: This is a fan-made tool and is not affiliated with or endorsed by Pearl Abyss.

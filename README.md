# React Vite Boilerplate CLI

A production-ready CLI tool for creating React + Vite projects with TanStack Router, SEO tooling, and Shadcn/Tailwind CSS.

## Features

🚀 **Modern Tech Stack**
- React 18 with TypeScript
- Vite for lightning-fast development
- TanStack Router for type-safe routing
- Tailwind CSS for utility-first styling
- Shadcn/UI with pre-configured Button and Card components
- React Helmet Async for SEO

🛠️ **Developer Experience**
- Multiple package manager support (npm, yarn, pnpm, bun)
- Comprehensive error handling with rollback
- Network connectivity checks
- Input validation and sanitization
- Verbose logging and dry-run mode
- Git repository initialization

🧪 **Quality Assurance**
- Unit and integration tests
- ESLint configuration
- TypeScript support
- Environment variable management

## Installation

### Global Installation (Recommended)

```bash
npm install -g react-vite-boilerplate
```

### Using npx (No Installation Required)

```bash
npx react-vite-boilerplate my-project
```

## Usage

### Basic Usage

```bash
# Create a new project
react-vite-boilerplate my-project

# Using npx
npx react-vite-boilerplate my-project
```

### Advanced Options

```bash
# Skip interactive prompts
react-vite-boilerplate my-project --yes

# Specify package manager
react-vite-boilerplate my-project --pm yarn

# Skip package installation
react-vite-boilerplate my-project --skip-install

# Skip git initialization
react-vite-boilerplate my-project --skip-git

# Enable verbose output
react-vite-boilerplate my-project --verbose

# Dry run (show what would be created)
react-vite-boilerplate my-project --dry-run

# Use specific template
react-vite-boilerplate my-project --template default
```

## CLI Options

| Option | Description | Default |
|--------|-------------|---------|
| `--yes, -y` | Skip interactive prompts | `false` |
| `--pm <manager>` | Package manager (npm, yarn, pnpm, bun) | Auto-detected |
| `--skip-install` | Skip package installation | `false` |
| `--skip-git` | Skip git repository initialization | `false` |
| `--verbose` | Enable verbose output | `false` |
| `--dry-run` | Show what would be created | `false` |
| `--template <name>` | Use specific template | `default` |
| `--help` | Show help information | - |
| `--version` | Show version number | - |

## Project Structure

```
my-project/
├── public/
├── src/
│   ├── components/
│   │   └── ui/              # Shadcn/UI components (Button, Card)
│   ├── lib/
│   │   └── utils.ts         # Utility functions with cn() helper
│   ├── routes/
│   │   ├── __root.tsx       # Root layout
│   │   ├── index.tsx        # Home page with demo components
│   │   └── about.tsx        # About page
│   ├── styles/
│   │   └── globals.css      # Global styles with CSS variables
│   └── main.tsx             # Application entry
├── .env.example             # Environment variables template
├── .env.local               # Local environment variables
├── .gitignore               # Git ignore rules
├── components.json          # Shadcn/UI configuration
├── package.json             # Dependencies and scripts
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── vite.config.ts           # Vite configuration
```

## Shadcn/UI Integration

The CLI automatically sets up Shadcn/UI with:

- **Pre-installed Components**: Button and Card components ready to use
- **Required Dependencies**: All necessary packages including `class-variance-authority`, `clsx`, `lucide-react`, `tailwind-merge`, `tailwindcss-animate`
- **Proper Configuration**: `components.json` configured for optimal compatibility
- **CSS Variables**: Tailwind CSS setup with CSS variables for theming

### Adding More Components

After project creation, you can add more Shadcn/UI components:

```bash
cd my-project
npx shadcn@latest add dialog
npx shadcn@latest add input
npx shadcn@latest add toast
```

### Using the Pre-installed Components

```tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Get Started</Button>
      </CardContent>
    </Card>
  )
}
```

## Environment Variables

The generated project includes environment variable support:

```bash
# Copy example file
cp .env.example .env.local

# Edit with your values
VITE_APP_TITLE="My App"
VITE_APP_DESCRIPTION="My amazing app"
VITE_API_BASE_URL="https://api.example.com"
```

## Package Manager Support

The CLI automatically detects and uses the best available package manager:

1. **Automatic Detection**: Checks for lockfiles to determine preference
2. **Manual Override**: Use `--pm` flag to specify manager
3. **Fallback Priority**: pnpm → yarn → bun → npm

### Supported Package Managers

- **npm** - Default Node.js package manager
- **yarn** - Fast, reliable dependency management
- **pnpm** - Efficient package manager with hard links
- **bun** - Ultra-fast JavaScript runtime and package manager

## Error Handling

The CLI includes comprehensive error handling:

- **Input Validation**: Project name validation with helpful suggestions
- **Network Checks**: Verifies connectivity before installation
- **Rollback Mechanism**: Cleans up on failure
- **Detailed Messages**: Specific error messages with troubleshooting tips

### Common Issues

**Network Connection Error**
```bash
# Check internet connection
# Try different network
# Use --skip-install to install manually later
```

**Permission Denied**
```bash
# Check write permissions
# Try with elevated permissions (sudo on Unix)
# Ensure target directory is accessible
```

**Package Manager Error**
```bash
# Try different package manager: --pm yarn
# Clear cache: npm cache clean --force
# Update package manager to latest version
```

## Development

### Local Development

```bash
git clone https://github.com/yourusername/react-vite-boilerplate.git
cd react-vite-boilerplate
npm install

# Test locally
node bin/cli.js test-project --verbose

# Run tests
npm test

# Run with coverage
npm run test:coverage

# Lint code
npm run lint
```

### Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Project Structure (CLI)

```
react-vite-boilerplate/
├── bin/
│   └── cli.js              # CLI entry point
├── lib/
│   ├── error-handler.js    # Error handling utilities
│   ├── network.js          # Network connectivity checks
│   ├── package-managers.js # Package manager detection
│   └── validators.js       # Input validation
├── templates/              # Project template files
├── tests/                  # Test files
├── jest.config.js          # Jest configuration
└── package.json            # CLI package configuration
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Run tests: `npm test`
5. Commit changes: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open a pull request

### Development Guidelines

- Add tests for new features
- Follow existing code style
- Update documentation
- Ensure all tests pass
- Add meaningful commit messages

## Roadmap

- [ ] Multiple template variants
- [ ] Plugin system for extensibility
- [ ] Interactive component addition
- [ ] Project update command
- [ ] VS Code extension integration
- [ ] Docker support
- [ ] PWA configuration
- [ ] Testing framework options

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/yourusername/react-vite-boilerplate/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/yourusername/react-vite-boilerplate/discussions)
- 📖 **Documentation**: [GitHub Wiki](https://github.com/yourusername/react-vite-boilerplate/wiki)

---

**Happy coding!** 🚀

Created with ❤️ for the React community.
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a production-ready CLI tool for creating React + Vite projects with modern tooling including TanStack Router, Shadcn/UI, Tailwind CSS, and comprehensive SEO setup.

## Common Commands

### Development
```bash
npm install                    # Install dependencies
npm test                      # Run unit and integration tests
npm run test:watch           # Run tests in watch mode
npm run test:coverage        # Run tests with coverage report
npm run lint                 # Run ESLint
npm run dev                  # Test CLI locally
```

### Testing the CLI
```bash
node bin/cli.js my-test-project --verbose --skip-install --skip-git
node bin/cli.js my-test-project --dry-run
node bin/cli.js --help
```

### Publishing
```bash
npm version patch           # Bump version
npm publish                # Publish to npm registry
```

## Architecture

### CLI Structure
- `bin/cli.js` - Main CLI entry point with Commander.js
- `lib/validators.js` - Input validation and sanitization
- `lib/package-managers.js` - Package manager detection and handling
- `lib/error-handler.js` - Error handling with rollback mechanism
- `lib/network.js` - Network connectivity checks
- `templates/` - React + Vite project template files

### Key Features
- **Robust Error Handling**: Comprehensive error types with rollback mechanism
- **Package Manager Support**: Auto-detection of npm/yarn/pnpm/bun
- **Input Validation**: Project name validation with reserved word checking
- **Network Checks**: Connectivity validation before package installation
- **Template System**: File copying with variable substitution
- **Environment Config**: Pre-configured environment variable management

### Template Features
- React 18 + TypeScript + Vite
- TanStack Router with file-based routing
- Tailwind CSS + Shadcn/UI components
- React Helmet Async for SEO
- Environment variable management
- Git repository initialization
- ESLint configuration

## Testing

The project has comprehensive test coverage:
- Unit tests for validators, package managers, error handling
- Integration tests for CLI functionality
- Jest configuration with coverage reporting
- Mock setup for console methods

## Error Handling

The CLI includes production-ready error handling:
- Typed error classes with context
- Rollback mechanism for cleanup on failure
- Network connectivity validation
- Detailed error messages with troubleshooting suggestions
- Graceful degradation for non-critical failures

## Key Considerations

- Always validate user input before processing
- Use rollback mechanism for any file system operations
- Check network connectivity before package installation
- Provide helpful error messages with suggestions
- Support multiple package managers
- Maintain backward compatibility when making changes
- Add tests for any new functionality
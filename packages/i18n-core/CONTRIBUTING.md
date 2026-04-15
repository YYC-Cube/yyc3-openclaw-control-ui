# Contributing to @yyc3/i18n-core

Thank you for your interest in contributing to YYC³ i18n Core! This document provides guidelines and instructions for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)

## Code of Conduct

This project adheres to the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/). By participating, you are expected to uphold this code.

## Getting Started

### Prerequisites

- Node.js >= 16.0.0
- npm >= 8.0.0 (or yarn/pnpm)
- Git

### Setup Development Environment

```bash
# Fork and clone your fork
git clone https://github.com/YOUR_USERNAME/yyc3-i18n-core.git
cd yyc3-i18n-core

# Install dependencies
npm install

# Build the project
npm run build

# Run tests to verify setup
npm test
```

## Development Workflow

1. **Create a branch** from `main`
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, documented code
   - Follow existing code style
   - Add tests for new features

3. **Test your changes**
   ```bash
   npm run build        # Ensure TypeScript compiles
   npm test             # Run all tests
   npm run lint         # Check code style
   ```

4. **Commit your changes** (see [Commit Messages](#commit-messages))

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request**

## Coding Standards

### TypeScript

- Use strict mode (`"strict": true` in tsconfig.json)
- Prefer `const` over `let`, avoid `var`
- Use meaningful variable and function names (camelCase)
- Add JSDoc comments for public APIs
- Export types explicitly

Example:
```typescript
/**
 * Translates a key with optional parameters
 * @param key - Translation key (dot notation supported)
 * @param params - Optional interpolation parameters
 * @returns Translated string or key itself if not found
 */
export function t(key: string, params?: Record<string, string>): string {
  // Implementation
}
```

### File Organization

```
src/
├── index.ts           # Main entry point (exports only)
├── lib/               # Core library modules
│   ├── engine.ts      # Main engine class
│   ├── cache.ts       # Cache implementation
│   └── plugins.ts     # Plugin system
├── plugins/           # Built-in plugins
│   └── *.ts           # Individual plugin files
└── test/              # Test files
    └── *.test.ts      # Test suites
```

### Naming Conventions

- **Files**: kebab-case (`my-plugin.ts`)
- **Classes**: PascalCase (`I18nEngine`)
- **Functions/Variables**: camelCase (`translateKey`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_CACHE_SIZE`)
- **Types/Interfaces**: PascalCase with prefix (`I18nConfig`, `TranslationMap`)

## Testing Guidelines

### Writing Tests

- Use Vitest as the test framework
- Place test files in `src/test/` directory
- Name test files: `*.test.ts`
- Follow AAA pattern: Arrange, Act, Assert

Example:
```typescript
describe('I18nEngine', () => {
  describe('t()', () => {
    it('should translate a simple key', () => {
      // Arrange
      const engine = new I18nEngine({ locale: 'en' });
      
      // Act
      const result = engine.t('test.key');
      
      // Assert
      expect(result).toBe('translated value');
    });
  });
});
```

### Test Coverage Goals

- Core functions: 100% coverage
- Plugin system: 90%+ coverage
- Utilities: 85%+ coverage
- Overall target: 90%+ coverage

### Running Tests

```bash
# Run all tests
npm test

# Run specific file
npx vitest run src/test/engine.test.ts

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

## Commit Messages

We use [Conventional Commits](https://www.conventionalcommits.org/) specification.

Format:
```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Build process or tooling changes

Examples:
```bash
feat(engine): add batch translation support
fix(cache): resolve TTL expiration bug
docs(readme): update installation instructions
test(plugins): add coverage for MissingKeyReporter
```

## Pull Request Process

### Before Submitting

- ✅ All tests pass (`npm test`)
- ✅ No lint errors (`npm run lint`)
- ✅ Code is formatted (`npm run format`)
- ✅ Documentation updated if needed
- ✅ Commit messages follow conventions

### PR Template

Use this template when opening PRs:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests added/updated
- [ ] All tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings generated
```

### Review Process

1. Maintainer will review within 48 hours
2. Address review comments
3. Once approved, maintainer will merge
4. Your contribution will be credited in CHANGELOG.md

## Getting Help

- 📖 Check [API Documentation](./docs/api-documentation.md)
- 💬 Open a [Discussion](https://github.com/YYC-Cube/yyc3-i18n-core/discussions)
- 🐛 Report bugs via [Issues](https://github.com/YYC-Cube/yyc3-i18n-core/issues)
- 📧 Email: team@yyc3.dev

## Recognition

All contributors will be acknowledged in:
- CHANGELOG.md (for each release)
- README.md (in Contributors section)
- GitHub's contributor graph

Thank you for contributing to YYC³ i18n Core! 🎉

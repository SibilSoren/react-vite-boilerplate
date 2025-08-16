# React Vite Boilerplate

A modern React application boilerplate built with Vite, TanStack Router, Tailwind CSS, and Shadcn/UI.

## Features

- ⚡ **Vite** - Lightning fast build tool and development server
- ⚛️ **React 18** - Latest React with TypeScript support
- 🗂️ **TanStack Router** - Type-safe router with powerful features
- 🎨 **Tailwind CSS** - Utility-first CSS framework
- 🧩 **Shadcn/UI** - Beautiful and accessible component library
- 🔍 **SEO Ready** - React Helmet Async for meta tags and SEO
- 📱 **Responsive** - Mobile-first responsive design
- 🛠️ **TypeScript** - Full TypeScript support
- 🎯 **ESLint** - Code quality and consistency

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm, yarn, or pnpm

### Installation

1. Clone or download this project
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Project Structure

```
src/
├── components/         # Reusable UI components
│   └── ui/            # Shadcn/UI components
├── hooks/             # Custom React hooks
├── lib/               # Utility functions
├── pages/             # Page components
├── routes/            # TanStack Router routes
├── styles/            # Global styles
└── main.tsx           # Application entry point
```

## Adding New Routes

Create new route files in the `src/routes` directory. TanStack Router uses file-based routing:

- `src/routes/index.tsx` - Home page (/)
- `src/routes/about.tsx` - About page (/about)
- `src/routes/blog/index.tsx` - Blog index (/blog)
- `src/routes/blog/$postId.tsx` - Dynamic blog post (/blog/:postId)

## Adding Shadcn/UI Components

Add new Shadcn/UI components using the CLI:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
```

## Customization

### Tailwind Configuration

Edit `tailwind.config.js` to customize your design system:

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        // Add your custom colors
      },
    },
  },
}
```

### Component Styling

Shadcn/UI components use CSS variables defined in `src/styles/globals.css`. Customize the color palette by updating the CSS variables.

## Learn More

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [TanStack Router](https://tanstack.com/router)
- [Tailwind CSS](https://tailwindcss.com)
- [Shadcn/UI](https://ui.shadcn.com)

## License

MIT License - see LICENSE file for details.
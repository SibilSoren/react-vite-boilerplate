import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight mb-8">About This Boilerplate</h1>
        
        <div className="grid gap-6 mb-8">
          <div className="p-6 border border-gray-200 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-2">🚀 Features</h2>
            <p className="text-gray-600 mb-3">
              Everything you need to build modern React applications
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
              <li>React 18 with TypeScript</li>
              <li>Vite for fast development and building</li>
              <li>TanStack Router for type-safe routing</li>
              <li>Tailwind CSS for styling</li>
              <li>Shadcn/UI component library</li>
              <li>ESLint for code quality</li>
              <li>Path aliases configured</li>
            </ul>
          </div>

          <div className="p-6 border border-gray-200 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-2">📁 Project Structure</h2>
            <p className="text-gray-600 mb-3">
              Organized and scalable folder structure
            </p>
            <pre className="text-sm bg-gray-100 p-4 rounded-md overflow-x-auto">
{`src/
├── components/         # Reusable UI components
│   └── ui/            # Shadcn/UI components
├── hooks/             # Custom React hooks
├── pages/             # Page components
├── routes/            # TanStack Router routes
├── styles/            # Global styles
├── utils/             # Utility functions
└── main.tsx           # Application entry point`}
            </pre>
          </div>

          <div className="p-6 border border-gray-200 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-2">🛠️ Development</h2>
            <p className="text-gray-600 mb-3">
              Get started with development
            </p>
            <div className="space-y-2">
              <p className="font-medium">Available Scripts:</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                <li><code className="bg-gray-100 px-1 rounded">npm run dev</code> - Start development server</li>
                <li><code className="bg-gray-100 px-1 rounded">npm run build</code> - Build for production</li>
                <li><code className="bg-gray-100 px-1 rounded">npm run lint</code> - Run ESLint</li>
                <li><code className="bg-gray-100 px-1 rounded">npm run preview</code> - Preview production build</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
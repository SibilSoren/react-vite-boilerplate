import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Welcome to React Vite Boilerplate
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          A modern React application with Vite, TanStack Router, and Tailwind CSS
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="p-6 border border-gray-200 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-2">⚡ Vite</h3>
          <p className="text-gray-600 mb-3">
            Lightning fast build tool and development server
          </p>
          <p className="text-sm text-gray-500">
            Enjoy instant server start and lightning fast HMR for the best development experience.
          </p>
        </div>

        <div className="p-6 border border-gray-200 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-2">🗂️ TanStack Router</h3>
          <p className="text-gray-600 mb-3">
            Type-safe router with powerful features
          </p>
          <p className="text-sm text-gray-500">
            Built-in search params, loaders, and code splitting with full TypeScript support.
          </p>
        </div>

        <div className="p-6 border border-gray-200 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-2">🎨 Tailwind CSS</h3>
          <p className="text-gray-600 mb-3">
            Utility-first CSS framework
          </p>
          <p className="text-sm text-gray-500">
            Rapidly build modern websites with utility classes and custom design system.
          </p>
        </div>
      </div>

      <div className="text-center">
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Get Started
        </button>
      </div>

      <div className="mt-12 p-6 bg-green-50 border border-green-200 rounded-lg">
        <h3 className="text-lg font-semibold text-green-800 mb-2">✅ Shadcn/UI Components Available</h3>
        <p className="text-green-700">
          Shadcn/UI has been configured! You can now use components like Button and Card. 
          Add more components with: <code className="px-2 py-1 bg-green-100 rounded">npx shadcn@latest add [component]</code>
        </p>
      </div>
    </div>
  )
}
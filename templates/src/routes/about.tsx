import { createFileRoute } from '@tanstack/react-router'
import { Helmet } from 'react-helmet-async'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  return (
    <>
      <Helmet>
        <title>About - React Vite Boilerplate</title>
        <meta name="description" content="Learn more about this React Vite boilerplate and its features" />
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight mb-8">About This Boilerplate</h1>
          
          <div className="grid gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>🚀 Features</CardTitle>
                <CardDescription>
                  Everything you need to build modern React applications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>React 18 with TypeScript</li>
                  <li>Vite for fast development and building</li>
                  <li>TanStack Router for type-safe routing</li>
                  <li>Tailwind CSS for styling</li>
                  <li>Shadcn/UI component library</li>
                  <li>React Helmet Async for SEO</li>
                  <li>ESLint for code quality</li>
                  <li>Path aliases configured</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>📁 Project Structure</CardTitle>
                <CardDescription>
                  Organized and scalable folder structure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="text-sm bg-muted p-4 rounded-md overflow-x-auto">
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
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🛠️ Development</CardTitle>
                <CardDescription>
                  Get started with development
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-2">
                  <p className="font-medium">Available Scripts:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><code className="bg-muted px-1 rounded">npm run dev</code> - Start development server</li>
                    <li><code className="bg-muted px-1 rounded">npm run build</code> - Build for production</li>
                    <li><code className="bg-muted px-1 rounded">npm run lint</code> - Run ESLint</li>
                    <li><code className="bg-muted px-1 rounded">npm run preview</code> - Preview production build</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
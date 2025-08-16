import { createFileRoute } from '@tanstack/react-router'
import { Helmet } from 'react-helmet-async'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { env } from '@/lib/env'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <>
      <Helmet>
        <title>Home - {env.APP_TITLE}</title>
        <meta name="description" content={`Welcome to ${env.APP_TITLE} - ${env.APP_DESCRIPTION}`} />
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Welcome to {env.APP_TITLE}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {env.APP_DESCRIPTION}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>⚡ Vite</CardTitle>
              <CardDescription>
                Lightning fast build tool and development server
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Enjoy instant server start and lightning fast HMR for the best development experience.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🗂️ TanStack Router</CardTitle>
              <CardDescription>
                Type-safe router with powerful features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Built-in search params, loaders, and code splitting with full TypeScript support.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🎨 Tailwind CSS</CardTitle>
              <CardDescription>
                Utility-first CSS framework
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Rapidly build modern websites with utility classes and custom design system.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button size="lg">
            Get Started
          </Button>
        </div>
      </div>
    </>
  )
}
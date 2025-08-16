import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Helmet } from 'react-helmet-async'
import { env, isDevelopment } from '@/lib/env'

export const Route = createRootRoute({
  component: () => (
    <>
      <Helmet>
        <title>{env.APP_TITLE}</title>
        <meta name="description" content={env.APP_DESCRIPTION} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={env.APP_TITLE} />
        <meta property="og:description" content={env.APP_DESCRIPTION} />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <nav className="border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center space-x-8">
                <Link to="/" className="text-xl font-bold">
                  {env.APP_TITLE}
                </Link>
                <div className="flex space-x-4">
                  <Link 
                    to="/" 
                    className="text-foreground/60 hover:text-foreground transition-colors"
                    activeProps={{ className: "text-foreground font-medium" }}
                  >
                    Home
                  </Link>
                  <Link 
                    to="/about" 
                    className="text-foreground/60 hover:text-foreground transition-colors"
                    activeProps={{ className: "text-foreground font-medium" }}
                  >
                    About
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>
        <main>
          <Outlet />
        </main>
      </div>
      {isDevelopment() && <TanStackRouterDevtools />}
    </>
  ),
})
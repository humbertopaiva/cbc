import React from 'react'
import { Header } from './header'
import { Main } from './main'
import { Footer } from './footer'
import { cn } from '@/lib/utils'

interface LayoutProps {
  children: React.ReactNode
  withBackground?: boolean
  className?: string
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  withBackground = true,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col min-h-screen',
        withBackground && 'text-foreground dark:text-white',
        className,
      )}
    >
      <Header />
      <Main withBackground={withBackground} className="flex-1 flex flex-col">
        {children}
      </Main>
      <Footer />
    </div>
  )
}

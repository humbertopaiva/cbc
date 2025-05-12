import React from 'react'
import { cn } from '@/lib/utils'

interface MainProps {
  children: React.ReactNode
  className?: string
  withBackground?: boolean
}

export const Main: React.FC<MainProps> = ({
  children,
  className,
  withBackground = true,
}) => {
  return (
    <main
      className={cn(
        'flex-1 w-full relative flex flex-col',
        withBackground && 'bg-cover bg-center',
        className,
      )}
      style={
        withBackground
          ? { backgroundImage: 'url(/bg-cubos-movies.png)' }
          : undefined
      }
    >
      {withBackground && (
        <div className="absolute inset-0 bg-white/90 dark:bg-black/90 z-0"></div>
      )}
      <div
        className={cn(
          'relative z-10 flex-1 flex flex-col max-w-7xl mx-auto w-full px-0 md:px-6 lg:px-8 py-6 sm:py-8 md:py-10',
        )}
      >
        {children}
      </div>
    </main>
  )
}

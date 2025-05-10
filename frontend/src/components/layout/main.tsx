import React from 'react'

interface MainProps {
  children: React.ReactNode
}

export const Main: React.FC<MainProps> = ({ children }) => {
  return (
    <main className="flex-1 w-full bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10">
        {children}
      </div>
    </main>
  )
}

import React from 'react'
import { Header } from './header'
import { Main } from './main'
import { Footer } from './footer'

interface LayoutProps {
  children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Main>{children}</Main>
      <Footer />
    </div>
  )
}

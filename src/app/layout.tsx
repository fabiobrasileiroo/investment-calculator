import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Calculadora de Investimentos',
  description: 'Calcule rendimentos de CDB e Tesouro Direto',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className='bg-zinc-900'>
      <body className={inter.className +  " bg-zinc-900" }>
        <main className="container mx-auto py-10 dark">
          <h1 className="text-3xl font-bold mb-6 text-white text-center">Calculadora de Investimentos</h1>
          {children}
        </main>
      </body>
    </html>
  )
}


import './globals.css'
import Navigation from '../components/Navigation'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
        <Navigation />
        <main>
          {children}
        </main>
      </body>
    </html>
  )
}

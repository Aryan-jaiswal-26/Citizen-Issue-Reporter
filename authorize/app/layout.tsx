import './globals.css'

export const metadata = {
  title: 'Authority Dashboard',
  description: 'Civic Issues Management Dashboard for Authorities',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
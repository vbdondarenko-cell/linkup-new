import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'LinkUp',
  description: 'Premium platform for discovering real-life activities',
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

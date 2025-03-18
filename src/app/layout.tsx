import './globals.css'
import { Providers } from './providers';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'IssueBuilder AI - Convert Text to GitHub Issues',
  description: 'Transform any text into well-structured GitHub issues using AI. Streamline your issue creation process with automated formatting and priority assignment.',
  openGraph: {
    title: 'IssueBuilder AI - Convert Text to GitHub Issues',
    description: 'Transform any text into well-structured GitHub issues using AI',
    type: 'website',
    images: [
      {
        url: '/og-image.png', // You'll need to add this image to your public folder
        width: 1200,
        height: 630,
        alt: 'IssueBuilder AI Preview'
      }
    ],
    siteName: 'IssueBuilder AI'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IssueBuilder AI - Convert Text to GitHub Issues',
    description: 'Transform any text into well-structured GitHub issues using AI',
    images: ['/og-image.png'], // Same image as OG
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#111111" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}

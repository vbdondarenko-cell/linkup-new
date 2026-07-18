import type { Metadata } from 'next';
import { ThemeProvider } from '../ui/providers/theme-provider';
import { TelegramProvider } from './providers/telegram-provider';

export const metadata: Metadata = {
  title: 'LinkUp',
  description: 'Premium platform for discovering real-life activities',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider initialMode="dark">
          <TelegramProvider>
            {children}
          </TelegramProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

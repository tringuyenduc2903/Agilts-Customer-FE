import type { Metadata } from 'next';
import { Rajdhani } from 'next/font/google';
import './globals.css';
import Header from '@/components/common/Header/Header';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n/i18n';
const inter = Rajdhani({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${inter.className} h-screen`}>
        <I18nextProvider i18n={i18n}>
          <Header />
          {children}
        </I18nextProvider>
      </body>
    </html>
  );
}

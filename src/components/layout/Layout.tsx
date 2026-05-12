import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import DraftBar from '@/components/cms/DraftBar';
import StickyCTA from '@/components/StickyCTA';
import CookieConsent from '@/components/CookieConsent';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <DraftBar />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <StickyCTA />
      <CookieConsent />
    </div>
  );
};

export default Layout;

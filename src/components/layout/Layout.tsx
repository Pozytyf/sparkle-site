import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import DraftBar from '@/components/cms/DraftBar';

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
    </div>
  );
};

export default Layout;

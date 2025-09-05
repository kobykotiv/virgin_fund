import React from 'react';

const Footer: React.FC = () => (
  <footer className="flex items-center justify-between px-4 py-2 bg-footer text-footer-foreground text-xs shadow-inner">
    <span>&copy; {new Date().getFullYear()} Virgin Fund</span>
    <span>Connected</span>
  </footer>
);

export default Footer;

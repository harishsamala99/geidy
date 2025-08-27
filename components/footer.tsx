
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <p className="text-center text-sm text-slate-500">
          &copy; {new Date().getFullYear()} Sparkle Clean Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

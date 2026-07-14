import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-surface-container-lowest dark:bg-primary-container border-t border-outline-variant/20 py-12 px-margin-mobile md:px-margin-desktop transition-all duration-200">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-container-max mx-auto mb-12">
        <div className="col-span-2">
          <span className="font-sans text-xl font-black text-primary dark:text-white mb-4 block">CareerPartner</span>
          <p className="text-on-surface-variant dark:text-on-tertiary-container text-body-sm max-w-xs leading-relaxed">
            Empowering professionals to navigate their careers with clarity and confidence through technology and human-centric design.
          </p>
        </div>
        <div>
          <h5 className="font-sans text-label-caps text-primary dark:text-white uppercase mb-4 font-bold">Platform</h5>
          <ul className="space-y-2">
            <li><a className="text-on-surface-variant dark:text-on-tertiary-container text-body-sm hover:text-secondary transition-colors" href="#">Find Jobs</a></li>
            <li><a className="text-on-surface-variant dark:text-on-tertiary-container text-body-sm hover:text-secondary transition-colors" href="#">Companies</a></li>
            <li><a className="text-on-surface-variant dark:text-on-tertiary-container text-body-sm hover:text-secondary transition-colors" href="#">Resources</a></li>
          </ul>
        </div>
        <div>
          <h5 className="font-sans text-label-caps text-primary dark:text-white uppercase mb-4 font-bold">Company</h5>
          <ul className="space-y-2">
            <li><a className="text-on-surface-variant dark:text-on-tertiary-container text-body-sm hover:text-secondary transition-colors" href="#">About Us</a></li>
            <li><a className="text-on-surface-variant dark:text-on-tertiary-container text-body-sm hover:text-secondary transition-colors" href="#">Careers</a></li>
            <li><a className="text-on-surface-variant dark:text-on-tertiary-container text-body-sm hover:text-secondary transition-colors" href="#">Contact Support</a></li>
          </ul>
        </div>
      </div>
      <div className="pt-8 border-t border-outline-variant/10 max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-on-surface-variant dark:text-on-tertiary-container text-body-sm">
        <p>© 2024 CareerPartner Global Inc. All rights reserved.</p>
        <div className="flex gap-6">
          <a className="hover:text-secondary transition-colors" href="#">Privacy Policy</a>
          <a className="hover:text-secondary transition-colors" href="#">Terms of Service</a>
          <a className="hover:text-secondary transition-colors" href="#">Cookie Settings</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React from 'react';

const BasicFooter = () => {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    { label: 'About', url: '#about' },
    { label: 'Services', url: '#services' },
    { label: 'Contact', url: '#contact' },
    { label: 'Privacy', url: '#privacy' },
    { label: 'Terms', url: '#terms' }
  ];
  

  const socialLinks = [
    { label: 'Twitter', icon: 'X', url: '#twitter' },
    { label: 'LinkedIn', icon: 'in', url: '#linkedin' },
    { label: 'Instagram', icon: 'IG', url: '#instagram' }
  ];
  
  return (
    <footer className="bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">

        <div className="text-center mb-6">
          <div className="font-light text-xl text-gray-900">
            <span>Elevate</span>
            <span className="font-medium">X</span>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Creating thoughtful digital experiences through minimalist design.
          </p>
        </div>
        

    
        <div className="flex justify-center space-x-4 mb-6">
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.url}
              className="inline-flex items-center justify-center h-8 w-8 rounded-sm bg-gray-200 text-gray-700 hover:bg-gray-800 hover:text-white"
              aria-label={social.label}
            >
              <span className="text-xs font-medium">{social.icon}</span>
            </a>
          ))}
        </div>
        

        <div className="text-center text-sm text-gray-500">
          © {currentYear} ElevateX. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default BasicFooter;
'use client';

import { useState, useEffect } from 'react';

const NAV_LINKS = [
  { label: 'Team', href: 'https://seda.xyz/about' },
  { label: 'Developer', href: 'https://seda.xyz/dev' },
  { label: 'Docs', href: 'https://docs.seda.xyz/' },
  { label: 'Explorer', href: 'https://explorer.seda.xyz/' },
  { label: 'SEDA Token', href: 'https://docs.seda.xyz/home/token-overview/seda-token-information' },
  { label: 'Trends', href: 'https://seda.xyz/trends' },
];

const CTA_HREF = 'https://discord.com/invite/seda';

function SedaLogo() {
  return (
    <svg width="90" height="22" viewBox="0 0 759 188" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M355.139 83.4969L343.273 81.5076C323.848 78.2464 321.348 72.6709 321.348 68.1855C321.348 59.7982 330.693 54.586 345.726 54.586C359.32 54.586 369.65 60.0086 373.377 69.1132L373.918 70.4425H394.608L393.893 67.803C388.554 48.0254 370.403 35.7266 346.508 35.7266C330.462 35.7266 317.167 40.1545 309.076 48.1975C303.612 53.6201 300.793 60.4964 300.918 68.0803C301.266 84.874 314.329 95.6714 339.701 100.157L351.519 102.289C370.693 106.105 374.613 110.868 374.613 116.836C374.613 125.118 363.877 130.875 348.526 130.875C331.784 130.875 322.583 125.223 317.766 112.006L317.244 110.591H297.529L297.964 113.077C301.932 135.686 321.125 149.754 348.043 149.754C364.263 149.754 377.857 145.154 386.324 136.814C392.068 131.143 395.081 124.028 395.023 116.214C394.849 98.5978 381.796 87.8866 355.12 83.4969H355.158H355.139Z" fill="white"/>
      <path d="M575.148 37.2674L535.506 37.2674V148.225H575.148C610.542 148.225 634.303 125.932 634.303 92.7364C634.303 59.5411 610.542 37.2578 575.148 37.2578V37.2674ZM613.574 92.746C613.574 115.316 598.851 129.356 575.148 129.356H555.453V56.1268L575.148 56.1268C598.851 56.1268 613.574 70.1471 613.574 92.7364V92.746Z" fill="white"/>
      <path d="M738.58 37.2695V53.5946C728.607 42.5677 715.399 36.3418 701.554 36.3418C668.805 36.3418 645.035 60.0596 645.035 92.7289C645.035 125.398 668.805 149.116 701.554 149.116C715.389 149.116 728.597 142.89 738.58 131.863V148.208H758.053V37.2695L738.58 37.2695ZM738.58 92.7385C738.58 114.84 723.268 130.869 702.162 130.869C681.057 130.869 665.745 114.84 665.745 92.7385C665.745 70.637 681.057 54.6083 702.162 54.6083C723.268 54.6083 738.58 70.637 738.58 92.7385Z" fill="white"/>
      <path d="M504.49 52.4541C494.208 41.8481 479.223 35.7656 463.37 35.7656C430.708 35.7656 406.079 60.2676 406.079 92.7744C406.079 125.281 431.326 149.783 463.534 149.783C486.242 149.783 506.624 136.509 515.284 116.435H493.184C486.204 126.008 475.854 131.22 463.554 131.22C445.664 131.22 431.027 119.361 427.117 102.061L519.783 102.061L519.889 100.071C521.019 80.4851 515.68 64.007 504.509 52.4733H504.49V52.4541ZM426.895 83.469C430.496 65.6615 444.37 54.3095 462.897 54.3095C478.577 54.3095 496.293 65.3842 499.045 83.469L426.895 83.469Z" fill="white"/>
      <path d="M102.797 0C101.964 2.23565 101.102 4.99296 100.544 7.93656C98.9345 16.3855 100.459 22.4869 105.088 26.0547C109.443 29.4175 122.071 34.8575 135.439 40.6143C139.803 42.496 144.271 44.415 148.815 46.4177C143.618 29.2964 117.849 9.68782 102.797 0Z" fill="white"/>
      <path d="M76.2432 15.8454C59.5911 29.8555 50.787 42.4404 50.787 52.2493C50.787 71.7553 87.4898 85.1879 101.624 88.7184C103.801 89.2586 150.331 101.136 159.324 126.967C164.02 124.098 170.561 119.971 177.093 115.434C199.776 99.673 200.514 94.1864 200.533 93.9535C200.533 90.954 197.674 84.2284 178.542 73.1433C164.512 65.0204 146.695 57.3447 130.98 50.5725C115.748 44.0146 103.716 38.8261 98.2725 34.6249C88.2661 26.8933 87.8401 15.0629 89.7619 5.44963C85.6249 8.37461 80.9199 11.9144 76.2432 15.8454Z" fill="white"/>
      <path d="M95.4331 161.954C91.0784 158.592 78.4591 153.152 65.092 147.395C60.7278 145.513 56.2595 143.594 51.7154 141.582C56.9127 158.703 82.6813 178.312 97.7336 188C98.5666 185.764 99.4281 183.007 99.9867 180.073C101.596 171.624 100.072 165.522 95.4426 161.954H95.4331Z" fill="white"/>
      <path d="M124.29 172.155C140.942 158.144 149.746 145.56 149.746 135.741C149.746 116.235 113.053 102.803 98.9093 99.2723C96.7319 98.732 50.2025 86.8551 41.209 61.024C36.5135 63.8931 29.9719 68.0197 23.4398 72.5562C0.757347 88.3176 0.0189336 93.8043 0 94.0278C0 97.0273 2.85898 103.753 21.9914 114.838C36.0212 122.961 53.8378 130.637 69.5527 137.409C84.7848 143.967 96.8171 149.155 102.27 153.356C112.276 161.088 112.702 172.918 110.781 182.532C114.918 179.607 119.623 176.067 124.299 172.136L124.29 172.155Z" fill="white"/>
    </svg>
  );
}

function HamburgerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 5H17M3 10H17M3 15H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const stored = localStorage.getItem('seda-theme') as 'dark' | 'light' | null;
    if (stored) {
      setTheme(stored);
      document.body.setAttribute('data-theme', stored);
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.body.setAttribute('data-theme', next);
    localStorage.setItem('seda-theme', next);
  };

  return (
    <nav className="navbar">
      <div className="navbar__inner">
        <a href="https://seda.xyz/" className="navbar__logo" target="_blank" rel="noopener noreferrer">
          <SedaLogo />
        </a>

        <div className="navbar__links">
          {NAV_LINKS.map(({ label, href }) => (
            <a key={label} href={href} className="navbar__link" target="_blank" rel="noopener noreferrer">
              {label}
            </a>
          ))}
        </div>

        <div className="navbar__right">
          <a href={CTA_HREF} className="navbar__cta" target="_blank" rel="noopener noreferrer">
            Contact SEDA
          </a>
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
          <button className="navbar__hamburger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
            {mobileOpen ? <CloseIcon /> : <HamburgerIcon />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="navbar__mobile">
          {NAV_LINKS.map(({ label, href }) => (
            <a key={label} href={href} className="navbar__mobile-link" target="_blank" rel="noopener noreferrer" onClick={() => setMobileOpen(false)}>
              {label}
            </a>
          ))}
          <a href={CTA_HREF} className="navbar__mobile-cta" target="_blank" rel="noopener noreferrer" onClick={() => setMobileOpen(false)}>
            Contact SEDA
          </a>
        </div>
      )}
    </nav>
  );
}

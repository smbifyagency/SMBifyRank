// Logo Generator - Creates SVG text logos with business initials

export interface LogoConfig {
    businessName: string;
    primaryColor: string;
    secondaryColor: string;
}

// Generate SVG logo with business initials
export function generateSvgLogo(config: LogoConfig): string {
    const initials = getInitials(config.businessName);
    const primary = config.primaryColor || '#6366f1';
    const secondary = config.secondaryColor || '#3b82f6';

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 40" class="logo-svg">
  <defs>
    <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${primary};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${secondary};stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect x="2" y="2" width="36" height="36" rx="8" fill="url(#logoGrad)" />
  <text x="20" y="28" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="700" fill="white" text-anchor="middle">${initials}</text>
</svg>`;
}

// Generate inline logo for header
export function generateHeaderLogo(businessName: string, primaryColor: string): string {
    const initials = getInitials(businessName);
    const color = primaryColor || '#6366f1';

    return `
    <a href="/" class="header-logo">
      <div class="logo-icon" style="background: linear-gradient(135deg, ${color}, ${adjustColor(color, -20)});">
        <span>${initials}</span>
      </div>
      <span class="logo-text">${businessName}</span>
    </a>
  `;
}

// Generate footer logo
export function generateFooterLogo(businessName: string, tagline: string, primaryColor: string): string {
    const initials = getInitials(businessName);
    const color = primaryColor || '#6366f1';

    return `
    <div class="footer-brand">
      <div class="logo-icon" style="background: linear-gradient(135deg, ${color}, ${adjustColor(color, -20)});">
        <span>${initials}</span>
      </div>
      <div class="footer-brand-text">
        <span class="brand-name">${businessName}</span>
        <span class="brand-tagline">${tagline}</span>
      </div>
    </div>
  `;
}

// Get initials from business name
function getInitials(name: string): string {
    const words = name.split(' ').filter(word => word.length > 0);
    if (words.length === 1) {
        return words[0].substring(0, 2).toUpperCase();
    }
    return words.slice(0, 2).map(word => word[0]).join('').toUpperCase();
}

// Adjust color brightness
function adjustColor(color: string, amount: number): string {
    const hex = color.replace('#', '');
    const num = parseInt(hex, 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + amount));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
    const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

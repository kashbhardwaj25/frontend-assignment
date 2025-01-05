// Constants
export const ITEMS_PER_PAGE = 5;

// Currency formatting
export const CURRENCY_FORMATS = {
  usd: { symbol: '$', position: 'before' },
  gbp: { symbol: '£', position: 'before' },
  eur: { symbol: '€', position: 'before' },
  aud: { symbol: 'A$', position: 'before' },
  cad: { symbol: 'C$', position: 'before' },
  chf: { symbol: 'CHF', position: 'before' },
  dkk: { symbol: 'DKK', position: 'before' }
};

// Helper Functions
export function formatCurrency(amount, currency) {
  const format = CURRENCY_FORMATS[currency.toLowerCase()] || {
    symbol: currency.toUpperCase(),
    position: 'before'
  };

  const formattedAmount = amount.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });

  return format.position === 'before'
    ? `${format.symbol}${formattedAmount}`
    : `${formattedAmount} ${format.symbol}`;
}

// Theme handling
export function initializeTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
}

export function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeIcon(newTheme);
}

export function updateThemeIcon(theme) {
  const sunIcon = document.querySelector('.sun-icon');
  const moonIcon = document.querySelector('.moon-icon');

  if (theme === 'dark') {
    sunIcon.style.display = 'none';
    moonIcon.style.display = 'block';
  } else {
    sunIcon.style.display = 'block';
    moonIcon.style.display = 'none';
  }
}

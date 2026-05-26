// 5 pipeline/transform functions used across the app

// 1. Format price in EUR
export const formatPrice = (price) =>
  `€${Number(price).toLocaleString('de-DE', { minimumFractionDigits: 0 })}`;

// 2. Format date
export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
};

// 3. Truncate text
export const truncate = (text, length = 80) => {
  if (!text) return '';
  return text.length > length ? text.slice(0, length) + '...' : text;
};

// 4. Status badge color
export const statusColor = (status) => {
  const map = {
    pending: '#c8960a',
    confirmed: '#2e7d32',
    completed: '#555',
    cancelled: '#b00020',
  };
  return map[status] || '#555';
};

// 5. Capitalize first letter
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const rawBase = import.meta.env.VITE_IMAGE_URL || 'http://localhost:5000';
const IMAGE_BASE = rawBase.replace(/\/+$/, '');

const PLACEHOLDER =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC25aEAiktQktnpTX09SL8IKFB_pXN7w2AR7L-vuoRHYvckZ0-YoJ15JbCNBakkStp8KhAPNKoDXjtZ8Cn4yqw_K9ahE8aq4tayRw0zgYz86R5-rD0o9W027JM0VFJdWZ5eNUYyTu1oLGx8LO4-2zYi_LVZp5paYA9Z8WE_DMj8HZrSMzOLC3xIcgKmj8oX4CYjm2RLDj-yOnoWSHJZFu9TZ8EKXHkpuyj4ZEJzcn5W6BgfQc2y-S-i785B4xCHWTYDsPzKcbCMBSg';

export function getProductImage(product) {
  if (product?.images?.length) {
    const img = product.images[0] || '';
    if (img.startsWith('http')) return img;
    if (img.startsWith('/')) return `${IMAGE_BASE}${img}`;
    return `${IMAGE_BASE}/${img.replace(/^\/+/, '')}`;
  }
  return PLACEHOLDER;
}

export function formatPrice(price) {
  return `${Number(price).toLocaleString()} SYP`;
}

export function getTeamAbbr(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0])
    .join('')
    .slice(0, 3)
    .toUpperCase();
}

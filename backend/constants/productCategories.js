export const PRODUCT_CATEGORIES = [
  'magnetic-wallet',
  'long-wallet',
  'men-wallets',
  'women-bags',
  'leather-belts',
  'accessories',
];

export const normalizeCategory = (category = '') => String(category).trim().toLowerCase();

export const isValidProductCategory = (category = '') => {
  const normalizedCategory = normalizeCategory(category);
  return PRODUCT_CATEGORIES.includes(normalizedCategory);
};

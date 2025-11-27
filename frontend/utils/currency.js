export const formatCurrency = (amount) => {
  if (typeof amount !== 'number') {
    return '₹0';
  }
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatCurrencyWithDecimals = (amount) => {
  if (typeof amount !== 'number') {
    return '₹0.00';
  }
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export const parseCurrency = (currencyString) => {
  if (typeof currencyString !== 'string') {
    return 0;
  }
  
  const numericValue = currencyString.replace(/[₹,\s]/g, '');
  return parseFloat(numericValue) || 0;
};

export const formatIndianNumber = (number) => {
  if (typeof number !== 'number') {
    return '0';
  }
  
  return new Intl.NumberFormat('en-IN').format(number);
};

export const currencySymbol = '₹';

export const validateAmount = (amount) => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return !isNaN(numAmount) && numAmount >= 0;
};
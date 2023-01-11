/*
Array of all available currencies.

symbol - The currency symbol.
code - The currency code.
name - The currency name.
value - 1 USD in [currency].
 */
export const currencies = [
  {
    symbol: '€',
    code: 'EUR',
    name: 'Euro',
    value: 0.94
  },
  {
    symbol: '$',
    code: 'USD',
    name: 'US Dollar',
    value: 1
  },
  {
    symbol: '¥',
    code: 'JPY',
    name: 'Japanese Yen',
    value: 132.65
  },
  {
    symbol: '£',
    code: 'GBP',
    name: 'British Pound Sterling',
    value: 0.82
  },
  {
    symbol: '₽',
    code: 'RUB',
    name: 'Russian Ruble',
    value: 68.65
  },
  {
    symbol: '¥',
    code: 'CNY',
    name: 'Chinese Yuan',
    value: 6.96
  },
  {
    symbol: 'A$',
    code: 'AUD',
    name: 'Australian Dollar',
    value: 1.49
  },
  {
    symbol: 'C$',
    code: 'CAD',
    name: 'Canadian Dollar',
    value: 1.36
  },
  {
    symbol: 'CHF',
    code: 'CHF',
    name: 'Swiss Franc',
    value: 0.92
  },
  {
    symbol: 'HK$',
    code: 'HKD',
    name: 'Hong Kong Dollar',
    value: 7.78
  },
  {
    symbol: 'S$',
    code: 'SGD',
    name: 'Singapore Dollar',
    value: 1.35
  },
  {
    symbol: 'kr',
    code: 'SEK',
    name: 'Swedish Krona',
    value: 10.40
  },
  {
    symbol: '₹',
    code: 'INR',
    name: 'Indian Rupee',
    value: 82.67
  },
  {
    symbol: '₩',
    code: 'KRW',
    name: 'South Korean Won',
    value: 1284.95
  },
  {
    symbol: '$',
    code: 'MXN',
    name: 'Mexican Peso',
    value: 19.75
  }
];

/* converts a value from USD to another currency */
export const convertToCurrency = (value: number, toCode: string): number => {
  const toCurrency = currencies.find(currency => currency.code === toCode);
  return Math.round((value * toCurrency.value) * 100) / 100;
};

/* converts a value from another currency to USD */
export const convertFromCurrency = (value: number, fromCode: string): number => {
  const fromCurrency = currencies.find(currency => currency.code === fromCode);
  return Math.round((value / fromCurrency.value) * 100) / 100;
};

/* formats a value with the currency symbol */
export const formatCurrency = (value: number, currencyCode: string): string => {
  if (value === undefined || currencyCode === undefined) {
    return '';
  } else {
    return Number(value).toLocaleString('en-US', {style: 'currency', currency: currencyCode});
  }
};


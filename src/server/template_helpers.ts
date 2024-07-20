export const style = (stylesheet: any) =>
  `<link href="/css/${stylesheet}" rel="stylesheet" />`;

export const valueOrZero = (value: any) => (value !== undefined ? value : 0);

export const increment = (value: any) => Number(valueOrZero(value)) + 1;

export const isOdd = (value: any) => Number(valueOrZero(value)) % 2;

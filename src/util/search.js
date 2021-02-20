export const sanitizeRegExp = /([^\w]|_)/g;
export const clean = (x) => (x + "").replace(sanitizeRegExp, "").toLowerCase();
export const contains = (b, a) => clean(b).includes(a);

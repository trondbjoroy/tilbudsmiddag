// Lager en lesbar URL-del av et navn: "Fårikål med poteter" -> "farikal-med-poteter".
export const slugify = (s) =>
  s.toLowerCase()
    .replace(/æ/g, 'ae').replace(/ø/g, 'o').replace(/å/g, 'a')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/&/g, ' og ')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

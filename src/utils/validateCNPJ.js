function validateCNPJ(cnpj) {
  const cleanCNPJ = cnpj.replace(/[^\d]+/g, '');

  if (/^(\d)\1+$/.test(cleanCNPJ)) return false;

  // Valida o tamanho
  if (cleanCNPJ.length !== 14) return false;

  let size = 12;
  let sum = 0;
  let pos = 5;
  for (let i = 0; i < size; i++) {
    sum += cleanCNPJ[i] * pos--;
    if (pos < 2) pos = 9;
  }
  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result != cleanCNPJ[12]) return false;

  size = 13;
  sum = 0;
  pos = 6;
  for (let i = 0; i < size; i++) {
    sum += cleanCNPJ[i] * pos--;
    if (pos < 2) pos = 9;
  }
  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result != cleanCNPJ[13]) return false;

  return true;
}

module.exports = validateCNPJ;
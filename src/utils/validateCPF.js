function isValidCPF(cpf) {
  if (!cpf) return false;

  // Remove caracteres não numéricos
  cpf = cpf.replace(/[^\d]+/g, '');

  if (cpf.length !== 11) return false;

  // CPFs repetidos são inválidos
  if (/^(\d)\1+$/.test(cpf)) return false;

  let sum = 0;
  let remainder;

  // Validação primeiro dígito
  for (let i = 1; i <= 9; i++) sum += parseInt(cpf[i - 1]) * (11 - i);
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf[9])) return false;

  // Validação segundo dígito
  sum = 0;
  for (let i = 1; i <= 10; i++) sum += parseInt(cpf[i - 1]) * (12 - i);
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf[10])) return false;

  return true;
}

module.exports = isValidCPF;
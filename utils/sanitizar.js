export const sanitizarEntrada = (str) => {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;',
    '\\': '&#x5C;'
  }

  return str.replace(/[&<>"'`\\]/g, (char) => map[char]);
}


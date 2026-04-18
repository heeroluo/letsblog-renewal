export function formatDate(value: Date | string) {
  const date = typeof value === 'string'
    ? new Date(value)
    : value;
  return date.getFullYear()
    + '-'
    + (date.getMonth() + 1).toString().padStart(2, '0')
    + '-'
    + date.getDate().toString().padStart(2, '0')
    + ' '
    + date.getHours().toString().padStart(2, '0')
    + ':'
    + date.getMinutes().toString().padStart(2, '0')
    + ':'
    + date.getSeconds().toString().padStart(2, '0');
}

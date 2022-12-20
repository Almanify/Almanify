//prepare for database jeet
export function copyAndPrepare(item) {
  const copy = {...item}
  delete copy.id;
  return copy;
}

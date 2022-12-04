//prepare for database jeet
export function copyAndPrepare(item) {
  const copy = {...item}
  delete copy.id; //TODO fuer alle Daten passend
  return copy;
}

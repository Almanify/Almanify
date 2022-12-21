//prepare for database jeet
export const copyAndPrepare = item => {
  const copy = {...item};
  delete copy.id;
  return copy;
};

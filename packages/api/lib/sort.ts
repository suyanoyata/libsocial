export function sort(arr: string[]) {
  return arr.sort((a, b) => {
    const matchA = a.match(/\d+/);
    const numA = matchA ? parseInt(matchA[0], 10) : 0;
    const matchB = b.match(/\d+/);
    const numB = matchB ? parseInt(matchB[0], 10) : 0;

    if (a[0] === b[0]) {
      return numA - numB;
    }

    return a.localeCompare(b);
  });
}

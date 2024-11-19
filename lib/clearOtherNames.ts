export function clearOtherNames(names: string[]) {
  return names.filter((name) => !/[а-яА-ЯЁё]/.test(name));
}

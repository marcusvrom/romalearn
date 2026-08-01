/** Gera slugs legíveis em português (sem acentos, minúsculos, com hífen). */
export function slugify(value: string, maxLength = 120): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, maxLength)
    .replace(/-+$/g, '');
}

/** Acrescenta sufixo numérico enquanto o slug já estiver em uso. */
export function uniqueSlug(base: string, taken: Set<string>): string {
  const slug = slugify(base);
  if (!taken.has(slug)) return slug;

  let counter = 2;
  while (taken.has(`${slug}-${counter}`)) counter += 1;
  return `${slug}-${counter}`;
}

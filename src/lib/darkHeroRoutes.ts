/** Routes whose first section is a dark cinematic hero: the header floats over it and the shell adds no top padding. */
const DARK_HERO_ROUTES = ["/", "/about", "/services", "/contact", "/login"];

export function hasDarkHero(pathname: string | null | undefined): boolean {
  return !!pathname && DARK_HERO_ROUTES.includes(pathname);
}

import en from '../../content/locales/en.json';
import vi from '../../content/locales/vi.json';

export type LocaleCode = 'en' | 'vi';
export type LocaleContent = typeof en;

const locales: Record<LocaleCode, LocaleContent> = { en, vi };
const requestedLocale = process.env.NEXT_PUBLIC_LOCALE;

export const locale: LocaleCode = requestedLocale === 'vi' ? 'vi' : 'en';
export const content = locales[locale];
export const openGraphLocale = locale === 'vi' ? 'vi_VN' : 'en_US';

export type Theme = 'light' | 'dark'

export const updateThemeInDocument = (theme: Theme) => {
  const htmlClasses = document.documentElement.classList
  if (theme === 'light') {
    htmlClasses.remove('dark')
  } else {
    htmlClasses.add('dark')
  }
}

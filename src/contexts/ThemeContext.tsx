import React, { useEffect } from 'react'

import { THEMES } from '../constants'

const initialState = {
   theme: THEMES.IMOONGRAY,
   setTheme: (theme: string) => {
      THEMES.IMOONGRAY
   },
}
const ThemeContext = React.createContext(initialState)

type ThemeProviderProps = {
   children: React.ReactNode
}

function ThemeProvider({ children }: ThemeProviderProps) {
   const [theme, _setTheme] = React.useState<string>(initialState.theme)

   useEffect(() => {
      //old Theme const storedTheme = localStorage.getItem('theme')
      const storedTheme = THEMES.IMOONGRAY

      if (storedTheme) {
         // _setTheme(JSON.parse(storedTheme))
         _setTheme(storedTheme)
      }
   }, [])

   const setTheme = (theme: string) => {
      // localStorage.setItem('theme', JSON.stringify(theme))
      // _setTheme(theme)
   }

   return (
      <ThemeContext.Provider value={{ theme, setTheme }}>
         {children}
      </ThemeContext.Provider>
   )
}

export { ThemeContext, ThemeProvider }

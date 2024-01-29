import { Box, CircularProgress } from '@mui/material'
import React, { useEffect } from 'react'
import { useWindowSize } from 'react-use'
import createTheme from 'theme'
import { THEMES } from '../constants'
const initialState = {
   theme: THEMES.IMOONGRAY,
   setTheme: (theme: string) => {
      THEMES.IMOONGRAY
   },
}
function Loader() {
   // const Root = styled(MuiBox)`
   //    justify-content: center;
   //    align-items: center;
   //    display: flex;
   //    min-height: 100vh;
   // `
   const [theme, _setTheme] = React.useState<string>(initialState.theme)

   useEffect(() => {
      //old Theme const storedTheme = localStorage.getItem('theme')
      const storedTheme = THEMES.IMOONGRAY

      if (storedTheme) {
         // _setTheme(JSON.parse(storedTheme))
         _setTheme(storedTheme)
      }
   }, [])
   const { height } = useWindowSize()
   return (
      <Box
         sx={{
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
            minHeight: {height},
            background: createTheme(theme).palette.background.default,
         }}
      >
         <CircularProgress color="secondary" />
      </Box>
   )
}

export default Loader

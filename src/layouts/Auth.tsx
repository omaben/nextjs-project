import styled from '@emotion/styled'
import React from 'react'
// import { Outlet } from 'react-router-dom'

import { CssBaseline } from '@mui/material'

import GlobalStyle from '@/components/GlobalStyle'

const Root = styled.div`
   width: 100%;
   max-width: 520px;
   margin: 0;
   padding: 6px;
   @media (min-width: 540px) {
      justify-content: center;
      margin: auto;
   }
   align-items: center;
   display: flex;
   min-height: 100%;
   flex-direction: column;
`

interface AuthType {
   children?: React.ReactNode
}

const Auth: React.FC<AuthType> = ({ children }) => {
   return (
      <Root>
         <CssBaseline />
         <GlobalStyle />
         {children}
         {/* <Outlet /> */}
      </Root>
   )
}

export default Auth

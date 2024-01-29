import SignInComponent from '@/components/auth/SignIn'
import { useTheme } from '@emotion/react'
import styled from '@emotion/styled'
import { Box, Paper } from '@mui/material'
import type { ReactElement } from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { useWindowSize } from 'react-use'
import LogoDark from '../../Assets/logo-dark.svg'
import LogoWhite from '../../Assets/logo-white.svg'
import { THEMES } from '../../constants'
import AuthLayout from '../../layouts/Auth'

const Wrapper = styled(Paper)`
   padding: 12px 24px 24px 24px;
   border-top: 36px solid ${(props) => props.theme.sidebar.header.background};
   border-radius: 16px;
   width: 100%;
`
function SignIn() {
   const { t } = useTranslation()
   const theme = useTheme()
   const { height } = useWindowSize()

   return (
      <Box
         sx={{
            height: height,
            display: 'flex',
            alignItems: 'center',
            width: '100%',
         }}
      >
         <Wrapper>
            <Helmet title="iMoon | Sign In" />
            <Box textAlign={'center'}>
               {theme.name !== THEMES.DARK ? <LogoDark /> : <LogoWhite />}
            </Box>
            <SignInComponent />
         </Wrapper>
      </Box>
   )
}

SignIn.getLayout = function getLayout(page: ReactElement) {
   return <AuthLayout>{page}</AuthLayout>
}

export default SignIn

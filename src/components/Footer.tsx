import styled from '@emotion/styled'
import { Button, Chip, Grid } from '@mui/material'
import { ImoonGray } from 'colors'
import useAuth from 'hooks/useAuth'
import { Version } from 'types'

const Wrapper = styled.div`
   padding: ${(props) => props.theme.spacing(0.25)}
      ${(props) => props.theme.spacing(4)};
   background: #332c4a;
   position: relative;
   padding: 24px 10px;
`
const BadgeVersion = styled(Chip)`
   height: 20px;
   background: transparent;
   z-index: 1;
   text-transform: uppercase;
   span.MuiChip-label,
   span.MuiChip-label:hover {
      font-size: 11px;
      cursor: pointer;
      color: #746d89;
      padding-left: ${(props) => props.theme.spacing(2)};
      padding-right: ${(props) => props.theme.spacing(2)};
   }
`

function Footer() {
   const { signOut } = useAuth()
   const handleSignOut = async () => {
      await signOut()
   }
   return (
      <Wrapper>
         <Grid container spacing={0}>
            <Grid item xs={12} justifyContent="flex-end" textAlign={'center'}>
               <Button
                  onClick={handleSignOut}
                  fullWidth
                  variant="outlined"
                  color="inherit"
                  sx={{
                     borderRadius: '8px',
                     padding: '10px',
                     fontSize: '14px',
                     color: ImoonGray[12],
                     fontFamily: 'Nunito Sans SemiBold',
                     letterSpacing: '0.3px',
                     lineHeight: '16px',
                     border: `1px solid ${ImoonGray[6]}`,
                  }}
               >
                  Logout
               </Button>
            </Grid>
            <Grid
               item
               mt={'10px'}
               xs={12}
               justifyContent="flex-end"
               textAlign={'center'}
            >
               <BadgeVersion label={Version.NAME} />
            </Grid>
         </Grid>
      </Wrapper>
   )
}

export default Footer

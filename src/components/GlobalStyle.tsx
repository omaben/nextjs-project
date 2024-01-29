import { Global, css } from '@emotion/react'
import { useMediaQuery, useTheme } from '@mui/material'
import { secondary } from 'colors'

const GlobalStyle = (props: {}) => {
   const theme = useTheme()
   const isSmallScreen = useMediaQuery(theme.breakpoints.down('xl'))

   return (
      <Global
         {...props}
         styles={css`
            html,
            body,
            #__next {
               height: 100%;
            }

            html {
               overflow-y: scroll;
            }

            body {
               margin: 0;
            }

            .MuiCardHeader-action .MuiIconButton-root {
               padding: 4px;
               width: 28px;
               height: 28px;
            }

            .MuiDataGrid-row:hover {
               background: rgba(64, 122, 214, 0.075) !important;
            }
            .MuiButtonBase-root.MuiIconButton-root {
               border-radius: 6px;
            }
            .MuiCollapse-wrapper {
               .MuiCollapse-wrapperInner {
                  width: 100% !important;
               }
            }
            @media only screen and (max-width: 600px) {
               li.MuiBreadcrumbs-separator {
                  margin: 0 4px;
               }
               li.MuiBreadcrumbs-li {
                  .MuiTypography-h3 {
                     font-size: 0.75rem;
                  }
               }
            }

            a {
               color: ${secondary[6]};
               text-decoration: none;
               &:hover {
                  color: ${secondary[8]};
               }
            }

            .dataGridWrapper {
               ${isSmallScreen && { minHeight: '300px' }},
            }
         `}
      />
   )
}

export default GlobalStyle

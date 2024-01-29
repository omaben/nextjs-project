import styled from '@emotion/styled'
import { Badge } from '@mui/material'
import { tertiary } from 'colors'

export const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    backgroundColor: tertiary[6],
    color: tertiary[6],
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      border: '1px solid currentColor',
      borderRadius: '50%',
      content: '""',
    },
  },

  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}))

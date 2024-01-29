import PortalCopyValue from '@/components/custom/PortalCopyValue';
import { User, UserScope } from '@alienbackoffice/back-front';
import { OperatorList } from '@alienbackoffice/back-front/lib/operator/interfaces/operator-list.interface';
import { Box, TableCell, TableRow, useTheme } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectAuthOperators, selectAuthUser } from 'redux/authSlice';

function createData(opId: string, gameIds: string[], index: number) {
   return {
      opId: '',
      gameIds: [] as string[],
      index: 0,
   };
}

function CustomRowReport(props: { row: ReturnType<typeof createData> }) {
   const { row } = props;
   const theme = useTheme();
   const user = useSelector(selectAuthUser) as User;
   const operators = useSelector(selectAuthOperators) as OperatorList;
   const titleOpId = operators?.operators?.find(
      (item) => item.opId === row.opId
   )?.title;

   return (
      <React.Fragment>
         <TableRow
            sx={{
               '& > *': { borderBottom: 'unset' },
               fontSize: theme.breakpoints.down('sm') ? '10px' : '12px',
               th: {
                  background: `${theme.palette.background.paper}!important`,
               },
               '.MuiTableCell-root': {
                  padding: '5px',
               },
               '&:nth-of-type(odd), &:nth-of-type(odd) tr th': {
                  background: `${
                     (user?.scope === UserScope.OPERATOR &&
                        row.opId === user?.opId) ||
                     (user?.scope === UserScope.BRAND &&
                        row.opId === user?.opId)
                        ? '#E0EAFF'
                        : '#F6F5F9'
                  }!important`,
               },
               '&:nth-of-type(odd) th': {
                  background: `${
                     (user?.scope === UserScope.OPERATOR &&
                        row.opId === user?.opId) ||
                     (user?.scope === UserScope.BRAND &&
                        row.opId === user?.opId)
                        ? '#E0EAFF'
                        : '#F6F5F9'
                  }!important`,
               },
               '&:nth-of-type(even) th': {
                  background: `${
                     (user?.scope === UserScope.OPERATOR &&
                        row.opId === user?.opId) ||
                     (user?.scope === UserScope.BRAND &&
                        row.opId === user?.opId)
                        ? '#E0EAFF'
                        : theme.palette.background.paper
                  }!important`,
               },

               '&:nth-of-type(even), &:nth-of-type(even) tr th': {
                  background: `${
                     (user?.scope === UserScope.OPERATOR &&
                        row.opId === user?.opId) ||
                     (user?.scope === UserScope.BRAND &&
                        row.opId === user?.opId)
                        ? '#E0EAFF'
                        : theme.palette.background.paper
                  }!important`,
               },
               'th .MuiStack-root, th a': {
                  color: `${
                     (user?.scope === UserScope.OPERATOR &&
                        row.opId === user?.opId) ||
                     (user?.scope === UserScope.BRAND &&
                        row.opId === user?.opId)
                        ? '#6172F3'
                        : '#1570EF'
                  }!important`,
                  fontFamily: `${'Nunito Sans SemiBold'} !important`,
               },
               'td , td  span': {
                  color: `${
                     (user?.scope === UserScope.OPERATOR &&
                        row.opId === user?.opId) ||
                     (user?.scope === UserScope.BRAND &&
                        row.opId === user?.opId)
                        ? '#6172F3'
                        : '#04020B'
                  }!important`,
                  fontFamily: `${
                     (user?.scope === UserScope.OPERATOR &&
                        row.opId === user?.opId) ||
                     (user?.scope === UserScope.BRAND &&
                        row.opId === user?.opId)
                        ? 'Nunito Sans ExtraBold'
                        : 'Nunito Sans SemiBold'
                  } !important`,
               },
               // hide last border
               'td, th': {
                  border: 0,
                  textAlign: 'center',
                  alignContent: 'center',
               },
               td: {
                  '&:before': {
                     display: 'none',
                  },
               },
            }}
         >
            {/* <TableCell
               sx={{
                  h6: { p: '0 !important' },
                  textAlign: 'center !important',
               }}
            >
               {row.index + 1}
            </TableCell> */}

            <TableCell sx={{ textAlign: 'left' }}>
               <PortalCopyValue
                  value={`${row.opId}-${titleOpId}` || ''}
                  href={`operators/details?id=${row.opId}`}
                  sx={{
                     textOverflow: 'ellipsis',
                     overflow: 'hidden',
                     whiteSpace: 'nowrap',
                     maxWidth: '300px',
                     justifyContent: 'left !important',
                     textAlign: 'left !important',
                  }}
               />
            </TableCell>
            <TableCell
               sx={{ textAlign: 'left !important' }}
            >
               {row.gameIds.map((gameId: string, index: number) => (
                  <React.Fragment key={gameId}>
                     {gameId}
                     {index < row.gameIds.length - 1 && '-'}
                  </React.Fragment>
               ))}
            </TableCell>
         </TableRow>
      </React.Fragment>
   );
}

export default CustomRowReport;

import {
   renderPlayerStatusCell,
   renderTimeCell,
   renderWebhookLatencyCell,
   renderWebhookResultCell,
   renderWebhookStatusCell,
} from '@/components/custom/PortalRenderCells'
import { WebhookLog } from '@alienbackoffice/back-front'
import {
   Divider,
   Grid,
   Table,
   TableBody,
   TableCell,
   TableRow,
} from '@mui/material'
import React from 'react'
import { useSelector } from 'react-redux'
import { selectAuthOperator, selectAuthWebhookList } from 'redux/authSlice'
import {
   UseGetWebhookListQueryProps,
   useGetWebhookListQuery,
} from './lib/hooks/queries'
export function CustomFooterStatusComponent(props: {}) {
   return <Divider></Divider>
}
export default function WebhookDataDetails(
   dataFilter: UseGetWebhookListQueryProps
) {
   const [paginationModel, setPaginationModel] = React.useState({
      pageSize: 50,
      page: 0,
   })

   const opId = useSelector(selectAuthOperator)

   const post: UseGetWebhookListQueryProps = {
      limit: paginationModel.pageSize,
      page: paginationModel.page,
      uniqueId: dataFilter.uniqueId,
      opId: opId,
      from: dataFilter.from,
      playerId: dataFilter.playerId,
      to: dataFilter.to,
      webhook: dataFilter.webhook,
      playerToken: dataFilter.playerToken,
      gameId: dataFilter.gameId,
      level: dataFilter.level,
      betId: dataFilter.betId,
   }

   useGetWebhookListQuery(post)

   const data = useSelector(selectAuthWebhookList) as {
      webhookLogList: WebhookLog[]
      count: number
   }
   return (
      data &&
      data?.webhookLogList?.map((item) => (
         <Grid
            container
            direction="row"
            alignItems="center"
            mb={2}
            key={item.uuid}
            spacing={0}
            sx={{
               table: {
                  th: {
                     width: 130,
                     background: '#332C4A',
                     color: (props) => props.palette.primary.contrastText,
                     '&.MuiTableCell-root': {
                        fontFamily: 'Nunito Sans SemiBold',
                     },
                  },
                  'tbody tr': {
                     background: `#FFF!important`,
                  },
                  tr: {
                     'td, th': {
                        '&:after': {
                           display: 'none !important',
                        },
                     },
                  },
                  'tr: first-of-type th': {
                     borderTopLeftRadius: '8px',
                  },
                  ' tr: first-of-type td': {
                     borderTopRightRadius: '8px',
                  },
                  'tr: last-child th': {
                     borderBottomLeftRadius: '8px',
                  },
                  'tr: last-child td': {
                     borderBottomRightRadius: '8px',
                  },
                  'td, th': {
                     border: 0,
                     textAlign: 'left',
                     position: 'relative',
                     '.MuiStack-root': {
                        textAlign: 'left',
                        justifyContent: 'start',
                     },
                     '&:before': {
                        content: '""',
                        borderTop: '1px solid #5C5474',
                        position: 'absolute',
                        bottom: 0,
                        width: 'calc(100% - 22px)',
                        left: '11px',
                     },
                  },
                  td: {
                     '&:before': {
                        borderTop: '1px solid #D5D2DF',
                     },
                  },
                  'tr: last-child td, tr: last-child th': {
                     '&:before': {
                        borderTop: '0px solid #D5D2DF',
                     },
                  },
               },
            }}
         >
            <Table>
               <TableBody>
                  <TableRow>
                     <TableCell component="th" scope="row">
                        Date/Time
                     </TableCell>
                     <TableCell sx={{ h6: { p: '0 !important' } }}>
                        {renderTimeCell(
                           new Date(item.requestTimestamp).toString()
                        )}
                     </TableCell>
                  </TableRow>
                  <TableRow>
                     <TableCell component="th" scope="row">
                        Operator
                     </TableCell>
                     <TableCell>
                        {item?.opId}-{item?.opTitle}
                     </TableCell>
                  </TableRow>
                  <TableRow>
                     <TableCell component="th" scope="row">
                        Level
                     </TableCell>
                     <TableCell>{item?.level}</TableCell>
                  </TableRow>
                  <TableRow>
                     <TableCell component="th" scope="row">
                        Webhook
                     </TableCell>
                     <TableCell sx={{ h6: { p: '0 !important' } }}>
                        {renderWebhookResultCell(item.webhook)}
                     </TableCell>
                  </TableRow>
                  <TableRow>
                     <TableCell component="th" scope="row">
                        Game ID
                     </TableCell>
                     <TableCell>{item?.gameId}</TableCell>
                  </TableRow>
                  <TableRow>
                     <TableCell component="th" scope="row">
                        Player
                     </TableCell>
                     <TableCell sx={{ h6: { p: '0 !important' } }}>
                        {renderPlayerStatusCell(
                           item.playerId,
                           false,
                           false,
                           item.playerNickname,
                           false
                        )}
                     </TableCell>
                  </TableRow>
                  <TableRow>
                     <TableCell component="th" scope="row">
                        Message
                     </TableCell>
                     <TableCell sx={{ width: '300px', lineBreak: 'anywhere' }}>
                        {item.message}
                     </TableCell>
                  </TableRow>
                  <TableRow>
                     <TableCell component="th" scope="row">
                        Latency
                     </TableCell>
                     <TableCell>
                        {item.latency && renderWebhookLatencyCell(item.latency)}
                     </TableCell>
                  </TableRow>
                  <TableRow>
                     <TableCell component="th" scope="row">
                        Response Status
                     </TableCell>
                     <TableCell>
                        {renderWebhookStatusCell(
                           item.result.toLocaleUpperCase()
                        )}
                     </TableCell>
                  </TableRow>
               </TableBody>
            </Table>
         </Grid>
      ))
   )
}

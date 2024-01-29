import SelectTheme from '@/components/SelectTheme'
import GridStyle from '@/components/custom/GridStyle'
import PortalCopyValue from '@/components/custom/PortalCopyValue'
import {
   renderStatusTournamentCell,
   renderTimeCell,
} from '@/components/custom/PortalRenderCells'
import TransitionSlide from '@/components/custom/TransitionSlide'
import { Tournament } from '@alienbackoffice/back-front'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faCopy, faRectangleXmark } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import {
   Box,
   Button,
   Dialog,
   DialogContent,
   Grid,
   Tab,
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableRow,
   Typography,
   useMediaQuery,
   useTheme,
} from '@mui/material'
import { DataGridPro, GridColDef } from '@mui/x-data-grid-pro'
import { darkPurple } from 'colors'
import numeral from 'numeral'
import React, { useState } from 'react'
import { Check } from 'react-feather'
import { useSelector } from 'react-redux'
import { selectAuthTournamentIDs } from 'redux/authSlice'
import { selectLoadingTournamentIDs } from 'redux/loadingSlice'
import {
   CustomMenuSortAscendingIcon,
   CustomMenuSortDescendingIcon,
   CustomMenuSortIcon,
   CustomNoRowsOverlay,
   PageWith2Toolbar,
   PageWith3Toolbar,
   PageWith5Toolbar,
   fetchJsonData,
} from 'services/globalFunctions'
import { useGetTournamentIDsListQuery } from './lib/hooks/queries'

export default function AllTournamentIdsList(dataFilter: {
   autoRefresh: number
}) {
   const theme = useTheme()
   const [openTournament, setOpenTournament] = React.useState(false)
   const [currentTournament, setCurrentTournament] = React.useState({} as any)
   const [value, setValue] = React.useState('details')
   const [Transition, setTransition]: any = React.useState()
   const [checked, setChecked] = useState(false)
   const [paginationModel, setPaginationModel] = React.useState({
      pageSize: 50,
      page: 0,
   })
   const dataTournamentIDs = useSelector(selectAuthTournamentIDs)
   const [data, setData] = React.useState({
      count: 0,
      tournaments: [] as any[],
   })
   const [action, setAction] = React.useState(0)
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
   const isLgUp = useMediaQuery(theme.breakpoints.up('lg'))
   const loadingTournamentIDs = useSelector(selectLoadingTournamentIDs)
   const [rowCountState, setRowCountState] = React.useState(data?.count || 0)
   const Actions = (data: Tournament) => {
      let actiondata = [
         {
            value: '0',
            label: (
               <Typography
                  variant="caption"
                  sx={{ fontFamily: 'Nunito Sans Bold', fontSize: '0.75rem' }}
               >
                  Actions
               </Typography>
            ),
            disabled: true,
         },
         {
            value: '1',
            label: (
               <Typography
                  variant="bodySmallBold"
                  sx={{
                     svg: { position: 'relative', top: '3px', mr: '15px' },
                     flex: 1,
                  }}
               >
                  Details
               </Typography>
            ),
            onClick: () => handleOpenTournament(data),
         },
      ]

      return actiondata
   }
   const columns: GridColDef[] = [
      {
         field: 'tournamentId',
         align: 'center',
         headerAlign: 'center',
         headerName: 'ID',
         renderCell: (params) =>
            params &&
            params.value && <PortalCopyValue value={params.value} hideText />,
         width: 50,
         hideable: false,
         filterable: false,
         sortable: false,
      },
      {
         field: 'title',
         align: 'center',
         headerAlign: 'center',
         headerName: 'Title',
         renderCell: (params) => params && params.value,
         minWidth: 100,
         flex: 1,
         sortable: false,
      },
      {
         field: 'description',
         headerName: 'Description',
         align: 'center',
         headerAlign: 'center',
         renderCell: (params) => <PortalCopyValue value={params.value} />,
         minWidth: 250,
         hideable: false,
         flex: 1,
         sortable: false,
      },
      {
         field: 'from',
         headerName: 'From',
         align: 'center',
         headerAlign: 'center',
         renderCell: (params) =>
            params && params.value && renderTimeCell(params.value),
         minWidth: 130,
         hideable: false,
         flex: 1,
         sortable: false,
      },
      {
         field: 'to',
         headerName: 'To',
         align: 'center',
         headerAlign: 'center',
         renderCell: (params) =>
            params && params.value && renderTimeCell(params.value),
         minWidth: 130,
         flex: 1,
         sortable: false,
      },
      {
         field: 'winnersCount',
         align: 'center',
         headerAlign: 'center',
         type: 'number',
         headerName: 'Winners Count',
         renderCell: (params) =>
            numeral(params.row.winnersCount).format('0,00.[00]'),
         minWidth: 100,
         flex: 1,
         sortable: false,
      },
      {
         field: 'status',
         align: 'center',
         headerAlign: 'center',
         type: 'number',
         headerName: 'Status',
         renderCell: (params) =>
            params.row?.from &&
            renderStatusTournamentCell(params.row?.from, params.row?.to),
         minWidth: 100,
         flex: 1,
         sortable: false,
      },
      {
         field: 'actions',
         headerName: '',
         renderCell: (params) => {
            return (
               <Box className="showOnHover">
                  <SelectTheme
                     noPadd={true}
                     icon={''}
                     data={Actions(params.row)}
                     value={action}
                  />
               </Box>
            )
         },
         width: 10,
         sortable: false,
         filterable: false,
         disableColumnMenu: true,
      },
   ]

   useGetTournamentIDsListQuery(dataFilter.autoRefresh)

   const handleOpenTournament = (tournament: any) => {
      setTransition(TransitionSlide)
      setCurrentTournament(tournament)
      setOpenTournament(true)
      setValue('details')
   }

   const handleCloseTournamentDetails = () => {
      setOpenTournament(false)
   }

   const handleChange = (event: React.SyntheticEvent, newValue: string) => {
      setValue(newValue)
   }

   const handleCopyButtonClick = (json: {}) => {
      const data = JSON.stringify(json, null, 2)
      navigator.clipboard.writeText(data)
      setChecked(true)
      setTimeout(() => setChecked(false), 1000)
   }

   React.useEffect(() => {
      setRowCountState((prevRowCountState: any) =>
         data?.count !== undefined ? data?.count : prevRowCountState
      )
   }, [data?.count, setRowCountState])

   React.useEffect(() => {
      if (dataTournamentIDs && dataTournamentIDs.length > 0) {
         // Create an array of promises for all the fetch requests
         const fetchPromises = dataTournamentIDs.map((obj) =>
            fetchJsonData(`https://tournament.imoon.com/stats/new-${obj}.json`)
               .then((data) => ({ status: 'fulfilled', data }))
               .catch((error) => ({ status: 'rejected', error }))
         )

         // Use Promise.allSettled to wait for all fetch requests to complete
         Promise.allSettled(fetchPromises)
            .then((results) => {
               const successfulResults = results.filter(
                  (result) => result.status === 'fulfilled'
               )
               const dataArray = successfulResults
                  .map((result: any) =>
                     result.status === 'fulfilled' ? result.value.data : null
                  )
                  .filter(Boolean)
               // dataArray will contain the data from all successful fetch requests
               const sortedData = [...dataArray].sort((a, b) => b.to - a.to)
               setData({
                  count: dataArray.length,
                  tournaments: sortedData,
               })

               // Handle errors for unsuccessful fetch requests if needed
               const failedResults = results.filter(
                  (result: any) => result.status === 'rejected'
               )
               failedResults.forEach((result: any) => {
                  console.error('Error:', result.value.error)
                  // Handle error for each rejected promise as needed
               })
            })
            .catch((error) => {
               console.error('Error:', error)
            })
      }
   }, [dataTournamentIDs])

   return (
      <Box
         className="dataGridWrapper"
         mb={'0px'}
         p={isLgUp ? '12px' : '6px'}
         sx={{
            height: isDesktop ? PageWith2Toolbar : PageWith3Toolbar,
            width: isDesktop ? 'calc(100vw - 225px)' : '100%',
         }}
      >
         <DataGridPro
            disableVirtualization
            sx={GridStyle}
            getRowId={(row) => row?.tournamentId}
            disableRowSelectionOnClick
            rows={data?.tournaments || []}
            paginationMode="server"
            sortingMode="server"
            rowCount={rowCountState | 0}
            columns={columns}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pagination
            pageSizeOptions={[10, 20, 30, 40, 50, 100]}
            sortingOrder={['desc', 'asc']}
            loading={loadingTournamentIDs}
            getRowClassName={(params) =>
               params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
            }
            disableColumnMenu
            slots={{
               noRowsOverlay: CustomNoRowsOverlay,
               noResultsOverlay: CustomNoRowsOverlay,
               columnSortedAscendingIcon: CustomMenuSortAscendingIcon,
               columnSortedDescendingIcon: CustomMenuSortDescendingIcon,
               columnUnsortedIcon: CustomMenuSortIcon,
            }}
         />
         <Dialog
            open={openTournament}
            fullScreen
            TransitionComponent={Transition}
            keepMounted
            onClose={handleCloseTournamentDetails}
            aria-describedby="alert-dialog-slide-description"
            sx={{
               '.MuiDialog-container': {
                  alignItems: 'end',
                  justifyContent: 'end',
               },
               '.MuiPaper-root': {
                  p: '12px 4px!important',
               },
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
            <Grid
               container
               direction="row"
               alignItems="center"
               p={'8px'}
               spacing={0}
               sx={{
                  svg: {
                     fontSize: '16px',
                     height: '16px',
                     cursor: 'pointer',
                  },
               }}
            >
               <Grid item>
                  <Typography variant="h3" gutterBottom display="inline">
                     Tournament Details{' '}
                  </Typography>
               </Grid>
               <Grid item xs />
               <Grid item>
                  <FontAwesomeIcon
                     icon={faRectangleXmark as IconProp}
                     onClick={handleCloseTournamentDetails}
                     cursor={'pointer'}
                  />
               </Grid>
            </Grid>
            <DialogContent sx={{ p: 1, overflow: 'hidden' }}>
               <Grid
                  item
                  xs={12}
                  sx={{
                     '.MuiTabPanel-root': {
                        padding: '8px 0px',
                        '.dataGridWrapper': {
                           marginLeft: isDesktop ? '-12px' : 0,
                        },
                     },
                  }}
               >
                  <TabContext value={value}>
                     <Grid
                        container
                        direction="row"
                        alignItems="center"
                        p={'8px'}
                        spacing={0}
                        sx={{
                           svg: {
                              fontSize: '16px',
                              height: '16px',
                           },
                        }}
                     >
                        <Grid item>
                           <TabList
                              className="detail_tabs"
                              onChange={handleChange}
                              variant="scrollable"
                              scrollButtons={true}
                              sx={{
                                 mb: '0',
                                 pt: 0,
                                 px: isDesktop ? '12px' : '4px',
                                 '.MuiTabs-scroller': {
                                    justifyContent: 'center',
                                    width: 'fit-content',
                                    maxWidth: 'fit-content',
                                 },
                              }}
                              aria-label="lab API tabs example"
                           >
                              <Tab label="Details" value={'details'} />
                              {currentTournament?.tournamentData &&
                                 currentTournament?.tournamentData.length >
                                    0 && (
                                    <Tab label="Winners" value={'winners'} />
                                 )}
                           </TabList>
                        </Grid>
                        <Grid item xs />
                        <Grid item>
                           <Button
                              variant="outlined"
                              sx={{
                                 color: '#1F1933',
                                 path: {
                                    fill: checked
                                       ? theme.palette.success.main
                                       : darkPurple[9],
                                    stroke: 'unset !important',
                                 },
                                 svg: {
                                    mr: 1,
                                 },
                              }}
                              onClick={() => {
                                 handleCopyButtonClick(currentTournament)
                              }}
                           >
                              {checked ? (
                                 <Check />
                              ) : (
                                 <FontAwesomeIcon
                                    icon={faCopy as IconProp}
                                    fixedWidth
                                 />
                              )}
                              Copy JSON
                           </Button>
                        </Grid>
                     </Grid>
                     <TabPanel
                        value={'details'}
                        sx={{
                           height: PageWith5Toolbar,
                           pt: '6px !important',
                           overflow: 'auto',
                        }}
                     >
                        <Grid
                           container
                           direction="row"
                           alignItems="center"
                           mb={2}
                           spacing={0}
                        >
                           <Table>
                              <TableBody>
                                 <TableRow>
                                    <TableCell component="th" scope="row">
                                       Status
                                    </TableCell>
                                    <TableCell>
                                       {currentTournament?.from &&
                                          renderStatusTournamentCell(
                                             currentTournament?.from,
                                             currentTournament?.to
                                          )}
                                    </TableCell>
                                 </TableRow>
                                 <TableRow>
                                    <TableCell component="th" scope="row">
                                       Tournament ID
                                    </TableCell>
                                    <TableCell>
                                       <PortalCopyValue
                                          value={
                                             currentTournament?.tournamentId
                                          }
                                          sx={{
                                             textOverflow: 'ellipsis',
                                             overflow: 'hidden',
                                             whiteSpace: 'nowrap',
                                             maxWidth: '300px',
                                          }}
                                       />
                                    </TableCell>
                                 </TableRow>
                                 <TableRow>
                                    <TableCell component="th" scope="row">
                                       Title
                                    </TableCell>
                                    <TableCell>
                                       <PortalCopyValue
                                          value={currentTournament?.title}
                                          sx={{
                                             textOverflow: 'ellipsis',
                                             overflow: 'hidden',
                                             whiteSpace: 'nowrap',
                                             maxWidth: '300px',
                                          }}
                                       />
                                    </TableCell>
                                 </TableRow>
                                 <TableRow>
                                    <TableCell component="th" scope="row">
                                       Description
                                    </TableCell>
                                    <TableCell>
                                       <PortalCopyValue
                                          value={
                                             currentTournament?.description ||
                                             ''
                                          }
                                          sx={{
                                             textOverflow: 'ellipsis',
                                             overflow: 'hidden',
                                             whiteSpace: 'nowrap',
                                             maxWidth: '300px',
                                          }}
                                       />
                                    </TableCell>
                                 </TableRow>
                                 <TableRow>
                                    <TableCell component="th" scope="row">
                                       From
                                    </TableCell>
                                    <TableCell
                                       sx={{ h6: { p: '0 !important' } }}
                                    >
                                       {currentTournament?.from &&
                                          renderTimeCell(
                                             new Date(
                                                currentTournament?.from
                                             ).toString()
                                          )}
                                    </TableCell>
                                 </TableRow>
                                 <TableRow>
                                    <TableCell component="th" scope="row">
                                       To
                                    </TableCell>
                                    <TableCell
                                       sx={{ h6: { p: '0 !important' } }}
                                    >
                                       {currentTournament?.to &&
                                          renderTimeCell(
                                             new Date(
                                                currentTournament?.to
                                             ).toString()
                                          )}
                                    </TableCell>
                                 </TableRow>
                                 <TableRow>
                                    <TableCell component="th" scope="row">
                                       Eligibility
                                    </TableCell>
                                    <TableCell>
                                       {currentTournament?.currencyConditions &&
                                          currentTournament?.currencyConditions.map(
                                             (item: {
                                                currency: string
                                                minBetAmount: number
                                             }) => (
                                                <Typography
                                                   variant="h6"
                                                   key={`currency${item.currency}`}
                                                >
                                                   {item.currency}:{' '}
                                                   {item.minBetAmount}
                                                </Typography>
                                             )
                                          )}
                                    </TableCell>
                                 </TableRow>
                                 <TableRow>
                                    <TableCell component="th" scope="row">
                                       # of winners
                                    </TableCell>
                                    <TableCell>
                                       {currentTournament?.winnersCount}
                                    </TableCell>
                                 </TableRow>
                                 <TableRow>
                                    <TableCell component="th" scope="row">
                                       Unique winners only
                                    </TableCell>
                                    <TableCell>
                                       {currentTournament?.uniqueWinnerOnly
                                          ? 'Yes'
                                          : 'No'}
                                    </TableCell>
                                 </TableRow>
                                 <TableRow>
                                    <TableCell component="th" scope="row">
                                       Game Ids
                                    </TableCell>
                                    <TableCell>
                                       {currentTournament?.gameIds &&
                                          currentTournament?.gameIds.map(
                                             (item: string, index: number) => (
                                                <PortalCopyValue
                                                   value={item}
                                                   key={`${item}index`}
                                                   sx={{
                                                      textOverflow: 'ellipsis',
                                                      overflow: 'hidden',
                                                      whiteSpace: 'nowrap',
                                                      maxWidth: '300px',
                                                   }}
                                                />
                                             )
                                          )}
                                    </TableCell>
                                 </TableRow>
                              </TableBody>
                           </Table>
                        </Grid>
                     </TabPanel>
                     <TabPanel
                        value={'winners'}
                        sx={{
                           height: PageWith5Toolbar,
                           pt: '6px !important',
                           overflow: 'auto',
                        }}
                     >
                        <Grid
                           container
                           direction="row"
                           alignItems="center"
                           mb={2}
                           spacing={0}
                        >
                           <Table
                              sx={{
                                 '.MuiTableBody-root .MuiTableRow-root:nth-of-type(odd)>th':
                                    { padding: '5px' },
                                 'tr th,tr td': {
                                    borderRadius: '0 !important',
                                    borderBottomLeftRadius: '0 !important',
                                 },
                              }}
                           >
                              <TableHead>
                                 <TableRow>
                                    <TableCell
                                       component="th"
                                       scope="row"
                                    ></TableCell>
                                    <TableCell component="th" scope="row">
                                       Player ID
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                       Nickname
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                       Win Odds
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                       Prize
                                    </TableCell>
                                 </TableRow>
                              </TableHead>
                              <TableBody>
                                 {currentTournament?.tournamentData &&
                                    currentTournament?.tournamentData.length >
                                       0 &&
                                    currentTournament?.tournamentData?.map(
                                       (
                                          item: {
                                             playerId?: string
                                             winOdds?: number
                                             nickname?: string
                                          },
                                          index: number
                                       ) => (
                                          <TableRow
                                             key={`${index}${item.playerId}`}
                                          >
                                             <TableCell
                                                sx={{
                                                   h6: { p: '0 !important' },
                                                }}
                                             >
                                                {index + 1}
                                             </TableCell>
                                             <TableCell>
                                                <PortalCopyValue
                                                   value={item.playerId || ''}
                                                   sx={{
                                                      textOverflow: 'ellipsis',
                                                      overflow: 'hidden',
                                                      whiteSpace: 'nowrap',
                                                      maxWidth: '300px',
                                                   }}
                                                />
                                             </TableCell>
                                             <TableCell>
                                                <PortalCopyValue
                                                   value={item.nickname || ''}
                                                   sx={{
                                                      textOverflow: 'ellipsis',
                                                      overflow: 'hidden',
                                                      whiteSpace: 'nowrap',
                                                      maxWidth: '300px',
                                                   }}
                                                />
                                             </TableCell>
                                             <TableCell
                                                sx={{
                                                   h6: { p: '0 !important' },
                                                }}
                                             >
                                                {item.winOdds ? (
                                                   <Typography variant="bodySmall">
                                                      {(
                                                         Math.floor(
                                                            item.winOdds * 100
                                                         ) / 100
                                                      ).toFixed(2)}
                                                      x
                                                   </Typography>
                                                ) : (
                                                   ''
                                                )}
                                             </TableCell>
                                             <TableCell>
                                                {currentTournament?.prizes && (
                                                   <PortalCopyValue
                                                      value={
                                                         currentTournament
                                                            ?.prizes.length >
                                                            index &&
                                                         currentTournament
                                                            ?.prizes[index]
                                                      }
                                                      sx={{
                                                         textOverflow:
                                                            'ellipsis',
                                                         overflow: 'hidden',
                                                         whiteSpace: 'nowrap',
                                                         maxWidth: '300px',
                                                      }}
                                                   />
                                                )}
                                             </TableCell>
                                          </TableRow>
                                       )
                                    )}
                              </TableBody>
                           </Table>
                        </Grid>
                     </TabPanel>
                  </TabContext>
               </Grid>
            </DialogContent>
         </Dialog>
      </Box>
   )
}

import GridStyle from '@/components/custom/GridStyle'
import PortalCopyValue from '@/components/custom/PortalCopyValue'
import {
   renderPlayerStatusCell,
   renderTimeCell,
   renderWebhookLevelCell,
} from '@/components/custom/PortalRenderCells'
import { LaunchLog, WebhookLog } from '@alienbackoffice/back-front'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faClose, faExpand } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
   Box,
   Dialog,
   DialogContent,
   DialogProps,
   DialogTitle,
   Divider,
   IconButton,
   Tooltip,
   useMediaQuery,
   useTheme,
} from '@mui/material'
import { Stack } from '@mui/system'
import {
   DataGridPro,
   GridColDef,
   GridColumnVisibilityModel,
   GridRowParams,
   GridSortModel,
} from '@mui/x-data-grid-pro'
import { primary } from 'colors'
import dynamic from 'next/dynamic'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectAuthOperator, selectLaunchList } from 'redux/authSlice'
import { selectLoadingAuthLaunchList } from 'redux/loadingSlice'
import {
   CustomMenuSortAscendingIcon,
   CustomMenuSortDescendingIcon,
   CustomMenuSortIcon,
   CustomNoRowsOverlay,
   PageWith5Toolbar,
} from 'services/globalFunctions'
import SortedDescendingIcon from '../../../Assets/Icons/Basics/caret-vertical-small.svg'
import {
   UseGetWebhookListQueryProps,
   useGetLaunchListQuery,
} from './lib/hooks/queries'
export function CustomFooterStatusComponent(props: {}) {
   return <Divider></Divider>
}
export default function WebhookLaunchData(
   dataFilter: UseGetWebhookListQueryProps
) {
   /** start declare */
   const [page, setPage] = React.useState(0)
   const [dataSort, setDataSort]: any = React.useState({
      timestamp: -1,
   })
   const [paginationModel, setPaginationModel] = React.useState({
      pageSize: 50,
      page: 0,
   })
   const opId = useSelector(selectAuthOperator)

   /**  end declare */

   /** start function handle get list players */

   const post: UseGetWebhookListQueryProps = {
      limit: paginationModel.pageSize,
      page: paginationModel.page,
      uniqueId: dataFilter.uniqueId,
      opId: opId,
      from: dataFilter.from,
      playerId: dataFilter.playerId,
      to: dataFilter.to,
      playerToken: dataFilter.playerToken,
      level: dataFilter.level,
      refresh: dataFilter.refresh,
   }

   useGetLaunchListQuery(post)

   const data = useSelector(selectLaunchList)
   const [jsonData, setJsonData] = useState({} as LaunchLog)

   const [openFullScreen, setOpenFullScreen] = React.useState(false)
   const [maxWidth, setMaxWidth] = React.useState<DialogProps['maxWidth']>('xl')
   const [fullWidth, setFullWidth] = React.useState(true)
   const handleOpenFullClick = (data: LaunchLog) => {
      setJsonData(data)
      setOpenFullScreen(true)
   }

   const handleCloseFullScreen = () => {
      setOpenFullScreen(false)
   }
   const handleCopyJSON = (rowData: WebhookLog) => {
      const json = JSON.stringify(rowData, null, 2)
      // Copy 'json' to the clipboard
      navigator.clipboard
         .writeText(json)
         .then(() => alert('JSON copied to clipboard'))
         .catch((error) => console.error('Copy failed:', error))
   }

   const columns: GridColDef[] = [
      {
         field: 'uuid',
         headerName: '',
         renderCell: (params) =>
            params &&
            params.value && (
               <>
                  <PortalCopyValue
                     value={JSON.stringify(params.row, null, 2)}
                     hideText
                  />
                  <Box
                     component="svg"
                     sx={{
                        ml: 1,
                        cursor: 'pointer',
                        width: 10,
                        height: 10,
                        path: {
                           fill: primary[5],
                           stroke: 'unset !important',
                        },
                     }}
                     onClick={() => handleOpenFullClick(params.row)}
                  >
                     <FontAwesomeIcon
                        icon={faExpand as IconProp}
                        className="selectIcon"
                        size="sm"
                     />{' '}
                  </Box>
               </>
            ),
         width: 50,
         hideable: false,
         filterable: false,
         sortable: false,
      },
      {
         field: 'timestamp',
         headerName: 'Date/Time',
         headerAlign: 'center',
         align: 'center',
         renderCell: (params) => renderTimeCell(params.value),
         minWidth: 150,
         flex: 1,
         cellClassName: 'caption-column',
         sortable: false,
         hideable: false,
      },
      {
         field: 'opFullId',
         headerName: 'Operator',
         renderCell: (params) => (
            <Box px={0.5} lineHeight={1.2}>
               <Tooltip
                  title={params.row.operator?.opFullId || params.row.opId}
                  placement="top"
               >
                  <Stack>
                     <PortalCopyValue
                        value={params.row.operator?.opFullId || params.row.opId}
                        sx={{
                           '.MuiTypography-root': {
                              fontSize: isDesktop ? 12 : 11,
                              overflow: 'hidden',
                              whiteSpace: 'break-spaces',
                              maxWidth: '300px',
                           },
                        }}
                     />
                  </Stack>
               </Tooltip>
            </Box>
         ),
         flex: 1,
         sortable: false,
         minWidth: 100,
      },
      {
         field: 'level',
         headerName: 'Level',
         headerAlign: 'center',
         align: 'center',
         renderCell: (params) => renderWebhookLevelCell(params.value),
         flex: 1,
         sortable: false,
         minWidth: 120,
      },
      {
         field: 'playerId',
         headerName: 'Player',
         headerAlign: 'center',
         align: 'center',
         renderCell: (params) =>
            renderPlayerStatusCell(
               params.row.player?.playerId,
               params.row.player?.isTest,
               params.row.player?.playerStatus === true,
               params.row.player?.playerNickname,
               params.row.player?.blocked
            ),
         minWidth: 120,
         sortable: false,
         flex: 1,
      },

      {
         field: 'message',
         headerName: 'Message',
         headerAlign: 'center',
         align: 'center',
         sortable: false,
         renderCell: (params) => (
            <Box px={0.5} lineHeight={1.2}>
               <Tooltip title={params.value} placement="top">
                  <Stack>
                     <PortalCopyValue
                        value={params.value}
                        sx={{
                           '.MuiTypography-root': {
                              fontSize: isDesktop ? 12 : 11,
                              fontFamily: 'Nunito Sans SemiBold',
                              overflow: 'hidden',
                              whiteSpace: 'break-spaces',
                              wordBreak: ' break-all',
                              maxWidth: '200px',
                           },
                        }}
                     />
                  </Stack>
               </Tooltip>
            </Box>
         ),
         flex: 1,
         minWidth: 250,
      },
   ]

   const [rowCountState, setRowCountState] = React.useState(data?.count || 0)
   React.useEffect(() => {
      setRowCountState((prevRowCountState: number) =>
         data?.count !== undefined ? data?.count : prevRowCountState
      )
   }, [data?.count, setRowCountState])

   const handleSortModelChange = React.useCallback(
      (sortModel: GridSortModel) => {
         const fieldName = sortModel[0].field
         let data = {}
         fieldName === 'playerId'
            ? (data = {
                 playerId: sortModel[0].sort === 'asc' ? 1 : -1,
              })
            : fieldName === 'brandId'
            ? (data = {
                 brandName: sortModel[0].sort === 'asc' ? 1 : -1,
              })
            : fieldName === 'isTest'
            ? (data = {
                 isTest: sortModel[0].sort === 'asc' ? 1 : -1,
              })
            : fieldName === 'isBlocked'
            ? (data = {
                 isBlocked: sortModel[0].sort === 'asc' ? 1 : -1,
              })
            : fieldName === 'title'
            ? (data = {
                 title: sortModel[0].sort === 'asc' ? 1 : -1,
              })
            : fieldName === 'createdAt'
            ? (data = {
                 createdAt: sortModel[0].sort === 'asc' ? 1 : -1,
              })
            : fieldName === 'updatedAt'
            ? (data = {
                 updatedAt: sortModel[0].sort === 'asc' ? 1 : -1,
              })
            : (data = {
                 createdAt: sortModel[0].sort === 'asc' ? 1 : -1,
              })
         setDataSort(data)
         setPage(0)
      },
      []
   )
   const theme = useTheme()
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
   const isLgUp = useMediaQuery(theme.breakpoints.up('lg'))
   const [columnVisibilityModel, setColumnVisibilityModel] =
      React.useState<GridColumnVisibilityModel>({})
   const loadingWebHook = useSelector(selectLoadingAuthLaunchList)
   const DynamicReactJson = dynamic(import('react-json-view'), { ssr: false })

   const getDetailPanelContent = React.useCallback(({ row }: GridRowParams) => {
      return (
         <Box
            mb={2}
            sx={{
               width: 'calc(100% - 50px)',
               background: `${
                  row.index % 2 === 0
                     ? theme.palette.background.default
                     : theme.palette.background.paper
               }`,
               borderColor: theme.palette.divider,
            }}
         >
            {row && row.uuid && (
               <DynamicReactJson
                  key={`json${row.uuid}`}
                  src={row}
                  theme="tomorrow"
               />
            )}
         </Box>
      )
   }, [])

   return (
      <Box
         className="dataGridWrapper"
         mt={isDesktop ? '0px' : '6px'}
         px={isLgUp ? '12px' : '4px'}
         py={'6px'}
         pt={0}
         sx={{
            height: PageWith5Toolbar,
            width: isDesktop ? 'calc(100vw - 225px)' : '100%',
         }}
      >
         {/* <Typography variant="caption">
            {data.count && data.count > 0
               ? `${data.count > 50 ? 50 : data.count} of ${data.count}`
               : ''}
         </Typography> */}
         <DataGridPro
            disableVirtualization
            sx={GridStyle}
            rowHeight={isDesktop ? 44 : 30}
            getRowId={(row) => row.uuid}
            rows={data?.launchLogList || []}
            paginationMode="server"
            sortingMode="server"
            rowCount={rowCountState | 0}
            columns={columns}
            disableRowSelectionOnClick
            pagination
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[10, 20, 30, 40, 50, 100]}
            sortingOrder={['desc', 'asc']}
            onSortModelChange={handleSortModelChange}
            components={{
               ColumnSortedDescendingIcon: SortedDescendingIcon,
               ColumnSortedAscendingIcon: SortedDescendingIcon,
            }}
            loading={loadingWebHook}
            getRowClassName={(params) =>
               params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
            }
            columnVisibilityModel={columnVisibilityModel}
            onColumnVisibilityModelChange={(newModel) =>
               setColumnVisibilityModel(newModel)
            }
            // getDetailPanelContent={getDetailPanelContent}
            rowThreshold={0}
            disableColumnMenu
            slots={{
               noRowsOverlay: CustomNoRowsOverlay,
               noResultsOverlay: CustomNoRowsOverlay,
               footer: CustomFooterStatusComponent,
               columnSortedAscendingIcon: CustomMenuSortAscendingIcon,
               columnSortedDescendingIcon: CustomMenuSortDescendingIcon,
               columnUnsortedIcon: CustomMenuSortIcon,
            }}
         />

         <Dialog
            open={openFullScreen}
            onClose={handleCloseFullScreen}
            maxWidth={maxWidth}
            fullWidth={fullWidth}
            sx={{
               p: '12px !important',
               '.MuiPaper-root': {
                  m: 'auto',
                  borderRadius: '8px',
                  maxWidth: isDesktop ? '80% !important' : '100%',
               },
            }}
            disableEnforceFocus
         >
            <DialogTitle id="form-dialog-title">
               Launch logs Details
               <IconButton
                  edge="end"
                  color="inherit"
                  onClick={handleCloseFullScreen}
                  sx={{
                     position: 'absolute',
                     zIndex: 1,
                     top: '12px',
                     right: '12px',
                     '&:hover': {
                        background: 'initial',
                     },
                  }}
               >
                  <FontAwesomeIcon
                     icon={faClose as IconProp}
                     fixedWidth
                     fontSize={18}
                  />
               </IconButton>
            </DialogTitle>

            {jsonData && jsonData.uuid && (
               <DialogContent sx={{ p: 1, background: 'rgb(29, 31, 33)' }}>
                  <DynamicReactJson
                     key={`jsonDialog${jsonData.uuid}`}
                     src={jsonData}
                     theme="tomorrow"
                     enableClipboard={true}
                  />
               </DialogContent>
            )}
         </Dialog>
      </Box>
   )
}

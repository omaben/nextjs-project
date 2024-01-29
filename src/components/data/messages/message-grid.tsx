import SelectTheme from '@/components/SelectTheme'
import GridStyle from '@/components/custom/GridStyle'
import PortalCopyValue from '@/components/custom/PortalCopyValue'
import { OperatorMessageCode } from '@alienbackoffice/back-front'
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material'
import { DataGridPro, GridColDef } from '@mui/x-data-grid-pro'
import router from 'next/router'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectAuthMessagesInLanguageInBrand } from 'redux/authSlice'
import {
   CustomMenuSortAscendingIcon,
   CustomMenuSortDescendingIcon,
   CustomMenuSortIcon,
   CustomNoRowsOverlay,
   PageWith2Toolbar,
   keysToString,
} from 'services/globalFunctions'
import {
   GetMessagesInLanguageDtoParams,
   useGetMessagesInLanguageQuery,
} from './lib/hooks/queries'

export default function MessagesData(dataFilter: {
   opId: string
   brandId: string
}) {
   const theme = useTheme()
   const [paginationModel, setPaginationModel] = React.useState({
      pageSize: 50,
      page: 0,
   })
   const [data, setData] = React.useState({
      count: 0,
      messages: [] as {
         code: string
         data: {
            lang: string
            msg?: string
         }[]
         params?: string[]
      }[],
   })
   const [rowCountState, setRowCountState] = React.useState(data?.count || 0)
   type OperatorMessageCodeKeys = keyof typeof OperatorMessageCode
   const keys: OperatorMessageCodeKeys[] = Object.keys(
      OperatorMessageCode
   ).filter((key) => isNaN(Number(key))) as OperatorMessageCodeKeys[]
   const dataLanguages = useSelector(selectAuthMessagesInLanguageInBrand)
   const [action, setAction] = React.useState(0)
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
   const isLgUp = useMediaQuery(theme.breakpoints.up('lg'))
   const Actions = (data: {
      code: number
      title: string
      description?: string
      lang: { code: string; msg: string }[]
   }) => {
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
            onClick: () =>
               router.push(
                  `/messages?brandId=${dataFilter.brandId}&opId=${dataFilter.opId}&code=${data.code}`
               ),
         },
      ]

      return actiondata
   }
   const columns: GridColDef[] = [
      {
         field: 'code',
         headerName: 'ID',
         renderCell: (params) =>
            params &&
            params.value && <PortalCopyValue value={params.value} hideText />,
         width: 30,
         hideable: false,
         filterable: false,
      },
      {
         field: 'title',
         align: 'left',
         headerAlign: 'left',
         headerName: 'Title',
         renderCell: (params) =>
            params &&
            params.value && (
               <PortalCopyValue
                  value={params.value}
                  sx={{
                     '.MuiTypography-root': {
                        fontSize: 12,
                        fontFamily: 'Nunito Sans SemiBold',
                        overflow: 'hidden',
                        whiteSpace: 'break-spaces',
                        maxWidth: '300px',
                     },
                  }}
               />
            ),
         minWidth: 100,
         flex: 1,
         sortable: false,
         editable: true,
      },
      {
         field: 'data',
         headerName: 'Languages',
         headerAlign: 'left',
         align: 'left',
         renderCell: (params) => {
            if (params && params.value) {
               const languageItems = params.value.map(
                  (item: { lang: string; msg: string }, index: number) => (
                     <PortalCopyValue
                        key={index}
                        value={`${item.lang.toLocaleUpperCase()}: ${item.msg}`}
                        sx={{
                           '.MuiTypography-root': {
                              fontSize: 12,
                              fontFamily: 'Nunito Sans SemiBold',
                              textOverflow: 'ellipsis',
                              overflow: 'hidden',
                              maxWidth: '400px',
                              position: 'relative',
                              top: '-4px',
                           },
                        }}
                     />
                  )
               )

               return (
                  <Box
                     style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'left',
                     }}
                  >
                     {languageItems}
                  </Box>
               )
            } else {
               return ''
            }
         },
         minWidth: 300,
         hideable: false,
         editable: true,
         flex: 1,
         sortable: false,
      },
      {
         field: 'params',
         headerName: 'Params',
         headerAlign: 'left',
         align: 'left',
         renderCell: (params) =>
            params && params.value ? (
               <PortalCopyValue
                  value={params.value?.join(', ')}
                  sx={{
                     '.MuiTypography-root': {
                        fontSize: 12,
                        fontFamily: 'Nunito Sans SemiBold',
                        overflow: 'hidden',
                        whiteSpace: 'break-spaces',
                        maxWidth: '300px',
                     },
                  }}
               />
            ) : (
               ''
            ),
         minWidth: 100,
         maxWidth: 300,
         hideable: false,
         editable: true,
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
         width: 50,
         sortable: false,
         filterable: false,
         disableColumnMenu: true,
      },
   ]
   const post: GetMessagesInLanguageDtoParams = {}
   if (dataFilter.brandId && dataFilter.opId) {
      post.brandId = Array.isArray(dataFilter.brandId)
         ? dataFilter.brandId[0].toString()
         : dataFilter.brandId?.toString()
      post.opId = Array.isArray(dataFilter.opId)
         ? dataFilter.opId[0].toString()
         : dataFilter.opId?.toString()
   }

   useGetMessagesInLanguageQuery(post)

   useEffect(() => {
      if (dataFilter.brandId && dataFilter.opId) {
         const dataLast = keysToString(dataLanguages)
         const allMessages: {
            title?: string
            code: string
            data: {
               lang: string
               msg?: string
            }[]
            params?: string[]
         }[] = []
         Object.keys(dataLast).map((codeMessage) => {
            let dataMessage: {
               lang: string
               msg?: string
            }[] = []
            const dataUpdateType = dataLast[codeMessage] as {
               byLanguage?: {
                  [key: string]: {
                     messageText?: string
                  }
               }
               params?: string[]
            }
            const params = dataUpdateType.params
            if (dataUpdateType && dataUpdateType.byLanguage) {
               Object.keys(dataUpdateType.byLanguage).map((item) => {
                  const lang = item
                  const messageText =
                     dataUpdateType.byLanguage &&
                     dataUpdateType.byLanguage[item]?.messageText // Use optional chaining here

                  dataMessage.push({
                     lang,
                     msg: messageText,
                  })
               })
            } else {
               // Handle the case where dataUpdateType.byLanguage is undefined
               // You can add a default behavior or throw an error, depending on your use case.
            }
            const title = keys.find(
               (itemTitle) =>
                  OperatorMessageCode[itemTitle] === Number(codeMessage)
            )
            allMessages.push({
               title: title || '',
               code: codeMessage,
               data: dataMessage,
               params,
            })
         })

         setData({
            count: allMessages.length,
            messages: allMessages,
         })
      }
   }, [dataLanguages])

   React.useEffect(() => {
      setRowCountState((prevRowCountState: number) =>
         data?.count !== undefined ? data?.count : prevRowCountState
      )
   }, [data?.count, setRowCountState])

   return (
      <Box
         className="dataGridWrapper"
         mb={'0px'}
         px={isLgUp ? '12px' : '4px'}
         py={'6px'}
         sx={{
            height: PageWith2Toolbar,
            width: isDesktop ? 'calc(100vw - 225px)' : '100%',
         }}
      >
         <DataGridPro
            disableVirtualization
            sx={GridStyle}
            rowHeight={isDesktop ? 44 : 30}
            getRowId={(row) => row?.code}
            rows={data?.messages || []}
            paginationMode="server"
            sortingMode="server"
            rowCount={rowCountState | 0}
            columns={columns}
            disableRowSelectionOnClick
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pagination
            pageSizeOptions={[10, 20, 30, 40, 50, 100]}
            sortingOrder={['desc', 'asc']}
            loading={false}
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
      </Box>
   )
}

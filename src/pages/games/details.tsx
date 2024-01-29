import JSONEditor from '@/components/custom/CustomJsonEditor'
import CustomLoader from '@/components/custom/CustomLoader'
import PortalCopyValue from '@/components/custom/PortalCopyValue'
import CustomOperatorsBrandsToolbar from '@/components/custom/customOperatorsBrandsToolbar'
import { Configs } from '@/components/data/games/edit-configs'
import {
   useEditGameMutation,
   useGetGameListQuery,
} from '@/components/data/games/lib/hooks/queries'
import { EditGameDto, Game, User, UserScope } from '@alienbackoffice/back-front'
import styled from '@emotion/styled'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import {
   Avatar,
   Box,
   Card,
   CardContent,
   DialogActions,
   Grid,
   Button as MuiButton,
   Tab,
   Typography,
   useMediaQuery,
   useTheme,
} from '@mui/material'
import { Stack, spacing } from '@mui/system'
import { ImoonGray, darkPurple } from 'colors'
import { useRouter } from 'next/router'
import type { ReactElement } from 'react'
import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { selectAuthGamesList, selectAuthUser } from 'redux/authSlice'
import {
   PageWithdetails,
   PageWithdetails4Toolbar,
} from 'services/globalFunctions'
import DashboardLayout from '../../layouts/Dashboard'

const Button = styled(MuiButton)(spacing)
function OperatorDetails() {
   const router = useRouter()
   const { id }: any = router.query
   const [value, setValue] = React.useState('config')
   const data = useSelector(selectAuthGamesList)
   const theme = useTheme()
   const user = useSelector(selectAuthUser) as User
   const [extraData, setExtraData] = React.useState([] as any)
   const [extraDataError, setExtraDataError] = React.useState(false)
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
   const isLgUp = useMediaQuery(theme.breakpoints.up('lg'))
   const [ignore, setIgnore] = React.useState(false)

   useGetGameListQuery({ gameId: id })

   const { mutate } = useEditGameMutation({
      onSuccess: (data) => {
         toast.success('You Edit Game successfully', {
            position: toast.POSITION.TOP_CENTER,
         })
      },
      onError(error, variables, context) {
         toast.error(error, {
            position: toast.POSITION.TOP_CENTER,
         })
      },
   })

   const handleSubmit = React.useCallback(
      (dto: EditGameDto) => {
         mutate({ dto: dto })
      },
      [mutate]
   )
   const handleChangeTabs = (event: React.SyntheticEvent, newValue: string) => {
      event.preventDefault()
      setValue(newValue)
   }

   const UpdateExtraData = (data: { jsObject: {}; error: any }) => {
      setExtraDataError(data.error)
      setExtraData(data.jsObject as Game)
   }

   useEffect(() => {
      if (!ignore) {
         setTimeout(() => {
            setIgnore(true)
         }, 500)
      }
   })

   useEffect(() => {
      setExtraData((data && data.count > 0 && (data.games[0] as Game)) || [])
   }, [data])

   return (
      <React.Fragment>
         <Helmet title="Game Details" />
         <CustomOperatorsBrandsToolbar
            title={'Game Details'}
            background={
               isDesktop
                  ? theme.palette.secondary.dark
                  : theme.palette.primary.main
            }
         />
         {id && ignore && data && data?.games?.length > 0 ? (
            <>
               <Grid
                  container
                  alignItems="center"
                  p={2}
                  px={isLgUp ? '12px' : '4px'}
                  spacing={2}
                  sx={{
                     background: isDesktop ? 'initial' : darkPurple[4],
                  }}
               >
                  <Grid item xs={12}>
                     {data && (
                        <Grid
                           container
                           alignItems="center"
                           p={0}
                           px={isLgUp ? '0' : '4px'}
                           spacing={0.5}
                        >
                           <Grid
                              item
                              textAlign={'center'}
                              p={1}
                              display={'flex'}
                              justifyContent={'center'}
                           >
                              <Stack
                                 width={'fit-content'}
                                 alignItems="center"
                                 direction="column"
                                 gap={2}
                                 position={'relative'}
                              >
                                 <Avatar
                                    sx={{
                                       width: [54],
                                       height: [54],
                                    }}
                                 />
                              </Stack>
                           </Grid>
                           <Grid
                              item
                              textAlign={'center'}
                              p={1}
                              justifyContent={'center'}
                              width={
                                 isDesktop ? 'initial' : 'calc(100% - 60px)'
                              }
                           >
                              <Grid
                                 container
                                 alignItems="center"
                                 spacing={2}
                                 sx={{
                                    '.MuiGrid-root>.MuiBox-root': {
                                       position: 'relative',
                                       border: `1px solid ${ImoonGray[10]}`,
                                       height: '28px',
                                       p: '4px 6px',
                                       alignItems: 'center',
                                       display: 'grid',
                                       textAlign: 'center',
                                       borderRadius: '8px',
                                       pl: '20px',
                                    },
                                 }}
                              >
                                 {data?.games[0]?.gameId && (
                                    <Grid item pt={0} sm={'auto'} xs={12}>
                                       <Box
                                          mb={0}
                                          borderRadius={8}
                                          display={'inline-flex'}
                                          gap={2}
                                          width={'100%'}
                                          minWidth={'fit-content'}
                                          justifyContent={'center'}
                                       >
                                          <PortalCopyValue
                                             title={'Game ID:'}
                                             isVisible={true}
                                             sx={{
                                                color: (props) =>
                                                   isDesktop
                                                      ? ImoonGray[1]
                                                      : props.palette.primary
                                                           .contrastText,
                                             }}
                                             whiteSpace={'nowrap'}
                                             value={
                                                data?.games[0]?.gameId || ''
                                             }
                                          />
                                       </Box>
                                    </Grid>
                                 )}
                                 {data?.games[0]?.title && (
                                    <Grid item sm={'auto'} xs={12} pt={0}>
                                       <Box
                                          mb={0}
                                          borderRadius={8}
                                          display={'inline-flex'}
                                          gap={2}
                                          width={'100%'}
                                          minWidth={'fit-content'}
                                          justifyContent={'center'}
                                       >
                                          <PortalCopyValue
                                             title={'Game Name:'}
                                             isVisible={true}
                                             sx={{
                                                color: (props) =>
                                                   isDesktop
                                                      ? ImoonGray[1]
                                                      : props.palette.primary
                                                           .contrastText,
                                             }}
                                             whiteSpace={'nowrap'}
                                             value={data?.games[0]?.title || ''}
                                          />
                                       </Box>
                                    </Grid>
                                 )}
                              </Grid>
                           </Grid>
                        </Grid>
                     )}
                  </Grid>
               </Grid>
               <Grid
                  item
                  xs={12}
                  px={isDesktop ? '12px' : '4px'}
                  sx={{
                     '.MuiTabPanel-root': {
                        padding: '8px 0px',
                     },
                     '.MuiTabs-scroller': {
                        width: '230px !important',
                        maxWidth: 'fit-content !important',
                     },
                  }}
               >
                  <TabContext value={value}>
                     <TabList
                        className="detail_tabs"
                        onChange={handleChangeTabs}
                        variant="scrollable"
                        scrollButtons={true}
                        sx={{
                           mb: '6px',
                           pt: isDesktop ? 0 : '6px',
                           justifyContent: 'left',
                        }}
                     >
                        <Tab
                           label={
                              <Typography
                                 variant="bodySmallBold"
                                 component="span"
                              >
                                 Configs
                              </Typography>
                           }
                           value="config"
                        />
                        {user?.scope === UserScope.SUPERADMIN && (
                           <Tab
                              label={
                                 <Typography
                                    variant="bodySmallBold"
                                    component="span"
                                 >
                                    Configs JSON
                                 </Typography>
                              }
                              value="OPConfigsJson"
                           />
                        )}
                     </TabList>
                     <TabPanel
                        value="config"
                        sx={{
                           '.MuiPaper-root.MuiCard-root': {
                              height: PageWithdetails,
                           },
                        }}
                     >
                        {id && <Configs configs={id} />}
                     </TabPanel>
                     <TabPanel value="OPConfigsJson">
                        <Card
                           sx={{
                              m: 0,
                              '.box-texfield-style': {
                                 p: '16px',
                                 border: `1px solid ${darkPurple[11]}`,
                                 borderRadius: '8px',
                                 background: darkPurple[12],
                                 mb: '6px',
                              },
                           }}
                        >
                           <CardContent
                              sx={{
                                 p: 0,
                                 pb: '0 !important',
                                 height: PageWithdetails4Toolbar,
                                 overflowY: 'auto',
                              }}
                           >
                              <JSONEditor
                                 editable={
                                    user?.scope === UserScope.SUPERADMIN ||
                                    user?.scope === UserScope.ADMIN
                                 }
                                 data={data}
                                 setExtraData={(data: any) =>
                                    UpdateExtraData(data)
                                 }
                                 setExtraDataError={(data: any) =>
                                    setExtraDataError(data)
                                 }
                              />
                           </CardContent>
                        </Card>
                        {(user?.scope === UserScope.SUPERADMIN ||
                           user?.scope === UserScope.ADMIN) && (
                           <DialogActions sx={{ justifyContent: 'center' }}>
                              <Button
                                 onClick={() => handleSubmit({ ...extraData })}
                                 disabled={extraDataError !== false}
                                 color="secondary"
                                 variant="contained"
                                 sx={{ height: 32 }}
                              >
                                 Save
                              </Button>
                           </DialogActions>
                        )}
                     </TabPanel>
                  </TabContext>
               </Grid>
            </>
         ) : (
            <CustomLoader />
         )}
      </React.Fragment>
   )
}

OperatorDetails.getLayout = function getLayout(page: ReactElement) {
   return <DashboardLayout title="Operator Details">{page}</DashboardLayout>
}

export default OperatorDetails

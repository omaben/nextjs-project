import TransitionSlide from '@/components/custom/TransitionSlide'
import CustomOperatorsBrandsToolbar from '@/components/custom/customOperatorsBrandsToolbar'
import PermissionsSettingsDataEditable from '@/components/data/permissions/settings-permissions-editable-grid'
import PermissionsSettingsData from '@/components/data/permissions/settings-permissions-grid'
import {
   useGetReportConfigQuery,
   useSetReportConfigMutation,
   useSetReportRestartMutation,
} from '@/components/data/reports/lib/hooks/queries'
import { useSetRolesMutation } from '@/components/data/users/lib/hooks/queries'
import UserScopeFilter from '@/components/pages/dashboard/default/UserScopes'
import UserRolesFilter from '@/components/pages/dashboard/default/roles'
import {
   ElasticServer,
   ReportConfig,
   ReportProvider,
   RestartReportProviderDto,
   SetReportConfigDto,
   SetRolesDto,
   User,
   UserPermissionEvent,
   UserScope,
} from '@alienbackoffice/back-front'
import styled from '@emotion/styled'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import {
   faAdd,
   faAngleDown,
   faEdit,
   faRectangleXmark,
   faTrash,
} from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import {
   Card,
   CardContent,
   CardHeader,
   Dialog,
   DialogActions,
   DialogContent,
   DialogContentText,
   DialogTitle,
   FormControl,
   Grid,
   InputLabel,
   MenuItem,
   Button as MuiButton,
   Tab as MuiTab,
   Select,
   TextField,
   Toolbar,
   Typography,
   useMediaQuery,
   useTheme,
} from '@mui/material'
import { spacing } from '@mui/system'
import { ImoonGray, darkPurple } from 'colors'
import type { ReactElement } from 'react'
import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import {
   selectAuthCurrentRoleName,
   selectAuthCurrentScope,
   selectAuthPermissions,
   selectAuthReportConfig,
   selectAuthRoles,
} from 'redux/authSlice'
import { PageWith3Toolbar } from 'services/globalFunctions'
import { hasDetailsPermission } from 'services/permissionHandler'
import DashboardLayout from '../../layouts/Dashboard'
import { getUser } from '../../redux/slices/user'

function Settings() {
   const theme = useTheme()
   const Tab = styled(MuiTab)`
      color: ${(props) => props.theme.palette.primary};
   `
   const [Transition, setTransition]: any = React.useState()
   const [activeAddNewRole, setActiveAddNewRole] = React.useState(false)
   const [userPermissionEventInit, setUserPermissionEventInit]: any[] =
      React.useState(useSelector(selectAuthPermissions))
   const roleName = useSelector(selectAuthCurrentRoleName) as string
   const [openRemoveRole, setOpenRemoveRole] = React.useState(false)
   const [open, setOpen] = React.useState(false)
   const roles = useSelector(selectAuthRoles) as {
      name: string
      UserPermissionEvent: UserPermissionEvent[]
   }[]
   const [value, setValue] = React.useState('permissions')
   const [reportProvider, setReportProvider] = React.useState('')
   const [reportProviderSource, setReportProviderSource] = React.useState('')
   const [reportProviderRestart, setReportProviderRestart] = React.useState('')
   const currentScope = useSelector(selectAuthCurrentScope)
   const [permission, setPermission] = React.useState('')
   const UserPermissionEventInitKeys: any[] = useSelector(selectAuthPermissions)
   const [reportProviderSourceRestart, setReportProviderSourceRestart] =
      React.useState('')
   const Button = styled(MuiButton)(spacing)
   const user = useSelector(getUser) as User
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
   const reportConfig = useSelector(selectAuthReportConfig) as ReportConfig
   const reportRestart = useSelector(selectAuthReportConfig) as ReportConfig

   useGetReportConfigQuery()

   const handleChange = (event: React.SyntheticEvent, newValue: string) => {
      setValue(newValue)
   }

   const handleClickOpen = () => {
      setTransition(TransitionSlide)
      setOpen(true)
   }

   const handleClose = async () => {
      await setTransition(TransitionSlide)
      setOpen(false)
   }

   const { mutate: mutateReportConfig } = useSetReportConfigMutation({
      onSuccess: () => {
         toast.success('You update report config successfully', {
            position: toast.POSITION.TOP_CENTER,
         })
      },
      onError: (error) => {
         toast.error(error, {
            position: toast.POSITION.TOP_CENTER,
         })
      },
   })

   const { mutate: mutateReportRestart } = useSetReportRestartMutation({
      onSuccess: () => {
         toast.success('You restart report successfully', {
            position: toast.POSITION.TOP_CENTER,
         })
      },
      onError: (error) => {
         toast.error(error, {
            position: toast.POSITION.TOP_CENTER,
         })
      },
   })

   const { mutate } = useSetRolesMutation({
      onSuccess: () => {
         toast.success(`You Delete the ${roleName} Role Successfully`, {
            position: toast.POSITION.TOP_CENTER,
         })
         setOpenRemoveRole(false)
      },
   })

   const reportConfigSubmit = React.useCallback(
      (dto: SetReportConfigDto) => {
         mutateReportConfig({ dto })
      },
      [mutateReportConfig]
   )

   const reportRestartSubmit = React.useCallback(
      (dto: RestartReportProviderDto) => {
         mutateReportRestart({ dto })
      },
      [mutateReportRestart]
   )

   const handleManagePermissions = React.useCallback(
      (handleDto: {
         userScope: UserScope
         role: string
         roles: {
            name: string
            UserPermissionEvent: UserPermissionEvent[]
         }[]
      }) => {
         const previousRole = handleDto.roles.filter(
            (item) => item.name !== handleDto.role
         )
         let prevRole: any = []
         if (previousRole.length > 0) {
            prevRole = previousRole.reduce(
               (obj, cur) => ({
                  ...obj,
                  [cur.name]: cur.UserPermissionEvent,
               }),
               []
            )
         }
         const dto: SetRolesDto = {
            userScope: handleDto.userScope,
            roles: {
               ...prevRole,
            },
         }
         mutate({ dto })
      },
      [mutate]
   )

   useEffect(() => {
      setReportProvider(reportConfig?.reportProvider)
      setReportProviderSource(reportConfig?.reportProviderSource)
   }, [reportConfig])

   useEffect(() => {
      setReportProviderRestart(reportConfig?.reportProvider)
      setReportProviderSourceRestart(reportConfig?.reportProviderSource)
   }, [reportRestart])

   return (
      <React.Fragment>
         <Helmet title="Settings" />
         <CustomOperatorsBrandsToolbar
            title={'Settings'}
            sx={{
               mb: '0',
               height:
                  isDesktop || value !== 'permissions' ? '44px' : 'initial',
               p: '8px',
            }}
            background={theme.palette.secondary.dark}
            fullWidthBlock={isDesktop && value === 'permissions' ? false : true}
            actions={
               value === 'permissions' && (
                  <>
                     <Grid item xs={roles?.length > 0 ? 4 : 6} md={'auto'}>
                        <UserScopeFilter />
                     </Grid>
                     {roles?.length > 0 && (
                        <Grid item xs={4} md={'auto'}>
                           <UserRolesFilter />
                        </Grid>
                     )}
                     <Grid item xs={roles?.length > 0 ? 4 : 6} md={'auto'}>
                        <Button
                           onClick={() => {
                              setActiveAddNewRole(true)
                              handleClickOpen()
                           }}
                           color="info"
                           fullWidth
                           variant="contained"
                           sx={{
                              fontSize: 12,
                              fontFamily: 'Nunito Sans SemiBold',
                              borderRadius: '8px',
                              p: '4px 8px!important',
                              '&:hover': {
                                 background: '#8098F9',
                              },
                              padding: '4px 8px',
                              letterSpacing: '0.48px',
                              gap: '2px',
                              height: '28px',
                           }}
                        >
                           <FontAwesomeIcon
                              icon={faAdd as IconProp}
                              fixedWidth
                              fontSize={12}
                              height={'initial'}
                              width={'12px'}
                           />{' '}
                           New Role
                        </Button>
                     </Grid>
                  </>
               )
            }
         />
         <Toolbar
            variant="dense"
            sx={{
               flexDirection: ['column', 'row'],
               justifyContent: 'space-between',
               gap: 2,
               p: 0,
               px: '0 !important',
            }}
         >
            <Grid container alignItems="center">
               <Grid item xs={12}>
                  <TabContext value={value}>
                     {isDesktop ? (
                        <Grid
                           container
                           alignItems="center"
                           p={'8px 12px'}
                           spacing={1}
                           minHeight={'62px'}
                        >
                           <Grid item>
                              <TabList
                                 className="detail_tabs"
                                 onChange={handleChange}
                                 variant="scrollable"
                                 scrollButtons={false}
                              >
                                 <Tab
                                    label={
                                       <Typography
                                          variant="bodySmallBold"
                                          component="span"
                                       >
                                          Role Managements{' '}
                                       </Typography>
                                    }
                                    value="permissions"
                                 />
                                 <Tab
                                    label={
                                       <Typography
                                          variant="bodySmallBold"
                                          component="span"
                                       >
                                          Reports
                                       </Typography>
                                    }
                                    value="reports"
                                 />
                              </TabList>
                           </Grid>
                           <Grid item xs></Grid>
                           {value === 'permissions' && roles?.length > 0 && (
                              <>
                                 <Grid item>
                                    <Button
                                       color="info"
                                       variant="contained"
                                       onClick={() => setOpenRemoveRole(true)}
                                       sx={{
                                          textTransform: 'capitalize',
                                          fontFamily: 'Nunito Sans SemiBold',
                                          fontSize: '12px',
                                          borderRadius: '8px',
                                          '&:hover': {
                                             background: '#8098F9',
                                          },
                                          padding: '4px 8px',
                                          letterSpacing: '0.48px',
                                          gap: '2px',
                                          height: '28px',
                                       }}
                                    >
                                       <FontAwesomeIcon
                                          icon={faTrash as IconProp}
                                          fixedWidth
                                          fontSize={12}
                                          height={'initial'}
                                          width={'12px'}
                                       />{' '}
                                       Delete Role
                                    </Button>
                                 </Grid>
                                 <Grid item>
                                    <Button
                                       color="info"
                                       variant="contained"
                                       onClick={() => {
                                          setActiveAddNewRole(false)
                                          handleClickOpen()
                                       }}
                                       sx={{
                                          fontFamily: 'Nunito Sans SemiBold',
                                          fontSize: '12px',
                                          borderRadius: '8px',
                                          '&:hover': {
                                             background: '#8098F9',
                                          },
                                          padding: '4px 8px',
                                          letterSpacing: '0.48px',
                                          gap: '2px',
                                          height: '28px',
                                       }}
                                    >
                                       <FontAwesomeIcon
                                          icon={faEdit as IconProp}
                                          fixedWidth
                                          fontSize={12}
                                          height={'initial'}
                                          width={'12px'}
                                       />{' '}
                                       Role
                                    </Button>
                                 </Grid>
                              </>
                           )}
                           <Grid item justifyContent={'end'} display={'flex'}>
                              {value === 'permissions' && (
                                 <TextField
                                    label="Search"
                                    type="search"
                                    value={permission}
                                    fullWidth
                                    autoComplete="off"
                                    onChange={(e) => {
                                       setPermission(e.target.value)
                                       e.target.value !== ''
                                          ? setUserPermissionEventInit(
                                               UserPermissionEventInitKeys.filter(
                                                  (item: any) =>
                                                     item.event
                                                        .toLowerCase()
                                                        .includes(
                                                           e.target.value.toLowerCase()
                                                        ) ||
                                                     item.title
                                                        .toLowerCase()
                                                        .includes(
                                                           e.target.value.toLowerCase()
                                                        )
                                               )
                                            )
                                          : setUserPermissionEventInit(
                                               UserPermissionEventInitKeys
                                            )
                                    }}
                                    sx={{
                                       mt: 0,
                                       height: '42px',
                                       maxWidth: '226px',
                                       '.MuiInputBase-root': {
                                          minHeight: '42px',
                                          background: darkPurple[12],
                                          border: `1px solid ${darkPurple[11]}`,
                                          borderRadius: '8px',
                                       },
                                       '.MuiFormLabel-root': {
                                          top: '-4px',
                                       },
                                       '.MuiFormLabel-filled, &.Mui-focused, &.MuiInputLabel-shrink':
                                          {
                                             top: '16px !important',
                                          },
                                    }}
                                    className="searchTextField"
                                 />
                              )}
                           </Grid>
                        </Grid>
                     ) : (
                        <Grid
                           container
                           alignItems="center"
                           p={'4px 12px'}
                           spacing={1}
                        >
                           <Grid item xs={12} p={0}>
                              <TabList
                                 className="detail_tabs"
                                 onChange={handleChange}
                                 variant="scrollable"
                                 scrollButtons={false}
                                 sx={{
                                    justifyContent: 'left',
                                    alignItems: 'start',
                                    '.MuiTabs-scroller': {
                                       width: '100%',
                                       maxWidth: 'fit-content',
                                    },
                                 }}
                              >
                                 <Tab
                                    label={
                                       <Typography
                                          variant="bodySmallBold"
                                          component="span"
                                       >
                                          Role Managements{' '}
                                       </Typography>
                                    }
                                    value="permissions"
                                 />
                                 <Tab
                                    label={
                                       <Typography
                                          variant="bodySmallBold"
                                          component="span"
                                       >
                                          Reports
                                       </Typography>
                                    }
                                    value="reports"
                                 />
                              </TabList>
                           </Grid>
                           {/* {value === 'permissions' && (
                              <Grid item xs={12} p={0}>
                                 <Typography
                                    variant="h3"
                                    textTransform={'capitalize'}
                                    lineHeight={'16.24px'}
                                 >
                                    {roleName}
                                 </Typography>
                              </Grid>
                           )} */}
                           {value === 'permissions' && (
                              <>
                                 <Grid item p={0}>
                                    {roles?.length > 0 && (
                                       <Button
                                          color="info"
                                          variant="contained"
                                          onClick={() =>
                                             setOpenRemoveRole(true)
                                          }
                                          sx={{
                                             textTransform: 'capitalize',
                                             fontFamily: 'Nunito Sans SemiBold',
                                             fontSize: '12px',
                                             borderRadius: '8px',
                                             '&:hover': {
                                                background: '#8098F9',
                                             },
                                             padding: '4px 8px',
                                             letterSpacing: '0.48px',
                                             gap: '2px',
                                             height: '28px',
                                          }}
                                       >
                                          <FontAwesomeIcon
                                             icon={faTrash as IconProp}
                                             fixedWidth
                                             fontSize={12}
                                             height={'initial'}
                                             width={'12px'}
                                          />{' '}
                                          Delete Role
                                       </Button>
                                    )}
                                 </Grid>
                                 <Grid item>
                                    {roles?.length > 0 && (
                                       <Button
                                          color="info"
                                          variant="contained"
                                          onClick={() => {
                                             setActiveAddNewRole(false)
                                             handleClickOpen()
                                          }}
                                          sx={{
                                             fontFamily: 'Nunito Sans SemiBold',
                                             fontSize: '12px',
                                             borderRadius: '8px',
                                             '&:hover': {
                                                background: '#8098F9',
                                             },
                                             padding: '4px 8px',
                                             letterSpacing: '0.48px',
                                             gap: '2px',
                                             height: '28px',
                                          }}
                                       >
                                          <FontAwesomeIcon
                                             icon={faEdit as IconProp}
                                             fixedWidth
                                             fontSize={12}
                                             height={'initial'}
                                             width={'12px'}
                                          />{' '}
                                          Role
                                       </Button>
                                    )}
                                 </Grid>
                              </>
                           )}

                           <Grid item xs></Grid>
                           <Grid
                              item
                              justifyContent={'end'}
                              display={'flex'}
                              p={'0!important'}
                           >
                              {value === 'permissions' && (
                                 <TextField
                                    label="Search"
                                    type="search"
                                    value={permission}
                                    fullWidth
                                    autoComplete="off"
                                    onChange={(e) => {
                                       setPermission(e.target.value)
                                       e.target.value !== ''
                                          ? setUserPermissionEventInit(
                                               UserPermissionEventInitKeys.filter(
                                                  (item: any) =>
                                                     item.event
                                                        .toLowerCase()
                                                        .includes(
                                                           e.target.value.toLowerCase()
                                                        ) ||
                                                     item.title
                                                        .toLowerCase()
                                                        .includes(
                                                           e.target.value.toLowerCase()
                                                        )
                                               )
                                            )
                                          : setUserPermissionEventInit(
                                               UserPermissionEventInitKeys
                                            )
                                    }}
                                    sx={{
                                       mt: 0,
                                       height: '42px',
                                       width: isDesktop ? '226px' : '190px',
                                       '.MuiInputBase-root': {
                                          minHeight: '42px',
                                          background: darkPurple[12],
                                          border: `1px solid ${darkPurple[11]}`,
                                          borderRadius: '8px',
                                       },
                                       '.MuiFormLabel-root': {
                                          top: '-4px',
                                       },
                                       '.MuiFormLabel-filled, &.Mui-focused, &.MuiInputLabel-shrink':
                                          {
                                             top: '16px !important',
                                          },
                                    }}
                                    className="searchTextField"
                                 />
                              )}
                           </Grid>
                        </Grid>
                     )}

                     <TabPanel value="permissions" sx={{ padding: '0' }}>
                        {user && (
                           <PermissionsSettingsData
                              activeAddNewRole={activeAddNewRole}
                              userPermissionEventInit={userPermissionEventInit}
                           />
                        )}
                     </TabPanel>
                     <TabPanel
                        value="reports"
                        sx={{
                           padding: '0 12px !important',
                           height: PageWith3Toolbar,
                           overflow: 'auto',
                        }}
                     >
                        <Card
                           sx={{
                              width: '100%',
                              height: 'initial',
                              overflowY: 'auto',
                              mb: '8px',
                              '.box-texfield-style': {
                                 p: '16px',
                                 border: `1px solid ${darkPurple[11]}`,
                                 borderRadius: '8px',
                                 background: darkPurple[12],
                                 mb: '6px',
                              },
                              '&.MuiPaper-root': {
                                 maxWidth: '100%!important',
                              },
                              textAlign: 'left',
                           }}
                        >
                           <CardHeader
                              title="Config Report"
                              sx={{
                                 background: ImoonGray[4],
                                 p: '12px',
                                 borderTopLeftRadius: '8px',
                                 borderTopRightRadius: '8px',
                                 cursor: 'pointer',
                              }}
                           ></CardHeader>
                           <CardContent sx={{ pb: '0 !important' }}>
                              <FormControl
                                 sx={{
                                    width: '100%',
                                    mt: 2,
                                 }}
                              >
                                 <InputLabel id="demo-simple-select-disabled-label">
                                    Report Provider
                                 </InputLabel>
                                 <Select
                                    value={reportProvider}
                                    onChange={(e) =>
                                       setReportProvider(e.target.value)
                                    }
                                    label="Report Provider"
                                    fullWidth
                                    disabled={
                                       !hasDetailsPermission(
                                          UserPermissionEvent.BACKOFFICE_SET_REPORT_CONFIG_REQ
                                       )
                                    }
                                    IconComponent={() => (
                                       <FontAwesomeIcon
                                          icon={faAngleDown as IconProp}
                                          className="selectIcon"
                                          size="sm"
                                       /> // Use FontAwesome icon as the select icon
                                    )}
                                 >
                                    {Object.values(ReportProvider).map(
                                       (value) => (
                                          <MenuItem value={value} key={value}>
                                             {value}
                                          </MenuItem>
                                       )
                                    )}
                                 </Select>
                              </FormControl>
                              <FormControl
                                 sx={{
                                    width: '100%',
                                    mt: 2,
                                 }}
                              >
                                 <InputLabel id="demo-simple-select-disabled-label">
                                    Report Provider Source
                                 </InputLabel>
                                 <Select
                                    value={reportProviderSource}
                                    label="Report Provider Source"
                                    disabled={
                                       !hasDetailsPermission(
                                          UserPermissionEvent.BACKOFFICE_SET_REPORT_CONFIG_REQ
                                       )
                                    }
                                    fullWidth
                                    onChange={(e) =>
                                       setReportProviderSource(e.target.value)
                                    }
                                    IconComponent={() => (
                                       <FontAwesomeIcon
                                          icon={faAngleDown as IconProp}
                                          className="selectIcon"
                                          size="sm"
                                       /> // Use FontAwesome icon as the select icon
                                    )}
                                 >
                                    {Object.values(ElasticServer).map(
                                       (value) => (
                                          <MenuItem value={value} key={value}>
                                             {value}
                                          </MenuItem>
                                       )
                                    )}
                                 </Select>
                              </FormControl>
                              {hasDetailsPermission(
                                 UserPermissionEvent.BACKOFFICE_SET_REPORT_CONFIG_REQ
                              ) && (
                                 <DialogActions
                                    sx={{ justifyContent: 'center' }}
                                 >
                                    <Button
                                       onClick={() => {
                                          setReportProvider(
                                             reportConfig?.reportProvider || ''
                                          )
                                          setReportProviderSource(
                                             reportConfig?.reportProviderSource ||
                                                ''
                                          )
                                       }}
                                       color="secondary"
                                       variant="outlined"
                                       sx={{
                                          height: 32,
                                          borderColor: darkPurple[10],
                                       }}
                                    >
                                       Cancel
                                    </Button>
                                    <Button
                                       color="secondary"
                                       variant="contained"
                                       sx={{ height: 32 }}
                                       onClick={() => {
                                          reportConfigSubmit({
                                             reportProvider:
                                                reportProvider as ReportProvider,
                                             reportProviderSource:
                                                reportProviderSource as ElasticServer,
                                          })
                                       }}
                                    >
                                       Save
                                    </Button>
                                 </DialogActions>
                              )}
                           </CardContent>
                        </Card>

                        <Card
                           sx={{
                              width: '100%',
                              height: 'initial',
                              overflowY: 'auto',
                              mb: '8px',
                              '.box-texfield-style': {
                                 p: '16px',
                                 border: `1px solid ${darkPurple[11]}`,
                                 borderRadius: '8px',
                                 background: darkPurple[12],
                                 mb: '6px',
                              },
                              '&.MuiPaper-root': {
                                 maxWidth: '100%!important',
                              },
                              textAlign: 'left',
                           }}
                        >
                           <CardHeader
                              title="Restart Report"
                              sx={{
                                 background: ImoonGray[4],
                                 p: '12px',
                                 borderTopLeftRadius: '8px',
                                 borderTopRightRadius: '8px',
                                 cursor: 'pointer',
                              }}
                           ></CardHeader>
                           <CardContent sx={{ pb: '0 !important' }}>
                              <FormControl
                                 sx={{
                                    width: '100%',
                                    mt: 2,
                                 }}
                              >
                                 <InputLabel id="demo-simple-select-disabled-label">
                                    Report Provider
                                 </InputLabel>
                                 <Select
                                    value={reportProviderRestart}
                                    onChange={(e) =>
                                       setReportProviderRestart(e.target.value)
                                    }
                                    label="Report Provider"
                                    fullWidth
                                    disabled={
                                       !hasDetailsPermission(
                                          UserPermissionEvent.BACKOFFICE_SET_REPORT_CONFIG_REQ
                                       )
                                    }
                                    IconComponent={() => (
                                       <FontAwesomeIcon
                                          icon={faAngleDown as IconProp}
                                          className="selectIcon"
                                          size="sm"
                                       /> // Use FontAwesome icon as the select icon
                                    )}
                                 >
                                    {Object.values(ReportProvider).map(
                                       (value) => (
                                          <MenuItem value={value} key={value}>
                                             {value}
                                          </MenuItem>
                                       )
                                    )}
                                 </Select>
                              </FormControl>
                              <FormControl
                                 sx={{
                                    width: '100%',
                                    mt: 2,
                                 }}
                              >
                                 <InputLabel id="demo-simple-select-disabled-label">
                                    Report Provider Source
                                 </InputLabel>
                                 <Select
                                    value={reportProviderSourceRestart}
                                    label="Report Provider Source"
                                    disabled={
                                       !hasDetailsPermission(
                                          UserPermissionEvent.BACKOFFICE_SET_REPORT_CONFIG_REQ
                                       )
                                    }
                                    fullWidth
                                    onChange={(e) =>
                                       setReportProviderSourceRestart(
                                          e.target.value
                                       )
                                    }
                                    IconComponent={() => (
                                       <FontAwesomeIcon
                                          icon={faAngleDown as IconProp}
                                          className="selectIcon"
                                          size="sm"
                                       /> // Use FontAwesome icon as the select icon
                                    )}
                                 >
                                    {Object.values(ElasticServer).map(
                                       (value) => (
                                          <MenuItem value={value} key={value}>
                                             {value}
                                          </MenuItem>
                                       )
                                    )}
                                 </Select>
                              </FormControl>
                              {hasDetailsPermission(
                                 UserPermissionEvent.BACKOFFICE_SET_REPORT_CONFIG_REQ
                              ) && (
                                 <DialogActions
                                    sx={{ justifyContent: 'center' }}
                                 >
                                    <Button
                                       onClick={() => {
                                          setReportProviderRestart(
                                             reportRestart?.reportProvider || ''
                                          )
                                          setReportProviderSourceRestart(
                                             reportRestart?.reportProviderSource ||
                                                ''
                                          )
                                       }}
                                       color="secondary"
                                       variant="outlined"
                                       sx={{
                                          height: 32,
                                          borderColor: darkPurple[10],
                                       }}
                                    >
                                       Cancel
                                    </Button>
                                    <Button
                                       color="secondary"
                                       variant="contained"
                                       sx={{ height: 32 }}
                                       onClick={() => {
                                          reportRestartSubmit({
                                             reportProvider:
                                                reportProviderRestart as ReportProvider,
                                             reportProviderSource:
                                                reportProviderSourceRestart as ElasticServer,
                                          })
                                       }}
                                    >
                                       Restart
                                    </Button>
                                 </DialogActions>
                              )}
                           </CardContent>
                        </Card>
                     </TabPanel>
                     <Grid item xs={12} md={'auto'}></Grid>
                  </TabContext>
               </Grid>
            </Grid>
         </Toolbar>

         <Dialog
            open={open}
            fullScreen
            TransitionComponent={Transition}
            keepMounted
            aria-describedby="alert-dialog-slide-description"
            sx={{
               '.MuiDialog-container': {
                  alignItems: 'end',
                  justifyContent: 'end',
               },
               '.MuiPaper-root': {
                  width: '600px',
                  padding: '25px',
               },
            }}
         >
            <Grid
               container
               direction="row"
               alignItems="center"
               p={'4px 8px'}
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
                  <Typography variant="h5" gutterBottom display="inline" mb={0}>
                     {activeAddNewRole
                        ? 'Create New Role'
                        : `Edit ${roleName} Role`}
                  </Typography>
               </Grid>
               <Grid item xs></Grid>
               <Grid item>
                  <FontAwesomeIcon
                     icon={faRectangleXmark as IconProp}
                     onClick={handleClose}
                  />
               </Grid>
            </Grid>
            <DialogContent sx={{ p: 1 }}>
               <PermissionsSettingsDataEditable
                  activeAddNewRole={activeAddNewRole}
                  handleClose={handleClose}
               />
            </DialogContent>
         </Dialog>

         <Dialog
            open={openRemoveRole}
            onClose={() => setOpenRemoveRole(false)}
            aria-labelledby="form-dialog-title"
            sx={{
               p: '12px !important',
               '.MuiPaper-root': {
                  m: 'auto',
                  borderRadius: '8px',
               },
            }}
         >
            <DialogTitle id="form-dialog-title">
               Delete {roleName} Role
            </DialogTitle>
            <DialogContent>
               <DialogContentText id="alert-dialog-description">
                  Are you sure you want to delete this role?
               </DialogContentText>
            </DialogContent>
            <DialogActions>
               <Button
                  onClick={() => setOpenRemoveRole(false)}
                  color="secondary"
                  variant="outlined"
                  sx={{
                     height: 32,
                     borderColor: darkPurple[10],
                  }}
               >
                  Cancel
               </Button>
               <Button
                  color="secondary"
                  variant="contained"
                  sx={{ height: 32 }}
                  onClick={() =>
                     handleManagePermissions({
                        userScope: currentScope,
                        role: roleName,
                        roles: roles,
                     })
                  }
               >
                  Confirm
               </Button>
            </DialogActions>
         </Dialog>
      </React.Fragment>
   )
}

Settings.getLayout = function getLayout(page: ReactElement) {
   return <DashboardLayout>{page}</DashboardLayout>
}

export default Settings

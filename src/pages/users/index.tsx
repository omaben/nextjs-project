import CustomLoader from '@/components/custom/CustomLoader'
import HeaderFilterToolbar from '@/components/custom/HeaderFilterToolbar'
import HeaderTitleToolbar from '@/components/custom/HeaderTitleToolbar'
import MoreFiltersButton from '@/components/custom/MoreFiltersButton'
import { FilterChip } from '@/components/custom/PortalFilterChips'
import TransitionSlide from '@/components/custom/TransitionSlide'
import CustomOperatorsBrandsToolbar from '@/components/custom/customOperatorsBrandsToolbar'
import { useGetOperatorListQuery } from '@/components/data/operators/lib/hooks/queries'
import PermissionsCompareData from '@/components/data/permissions/compare-permissions-grid'
import { useCreateUserMutation } from '@/components/data/users/lib/hooks/queries'
import AllUsers from '@/components/data/users/users-grid'
import {
   Brand,
   CreateUserDto,
   Operator,
   User,
   UserPermissionEvent,
   UserScope,
} from '@alienbackoffice/back-front'
import { OperatorList } from '@alienbackoffice/back-front/lib/operator/interfaces/operator-list.interface'
import styled from '@emotion/styled'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import {
   faAdd,
   faAngleDown,
   faArrowsRotate,
   faRectangleXmark,
} from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import {
   Box,
   Dialog,
   DialogActions,
   DialogContent,
   FormHelperText,
   Grid,
   InputLabel,
   MenuItem,
   Button as MuiButton,
   FormControl as MuiFormControl,
   Select,
   Tab,
   TextField,
   Typography,
   useMediaQuery,
   useTheme,
} from '@mui/material'
import { Stack, spacing } from '@mui/system'
import { darkPurple } from 'colors'
import { Formik } from 'formik'
import type { ReactElement } from 'react'
import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import {
   saveUserDetails1,
   saveUserDetails2,
   saveUsersList,
   selectAuthBrandsList,
   selectAuthCurrentRoleName,
   selectAuthOperators,
   selectAuthRoles,
   selectAuthUser,
   selectAuthUserDetails1,
   selectAuthUserDetails2,
} from 'redux/authSlice'
import {
   saveLoadingUserDetails1,
   saveLoadingUsersList,
} from 'redux/loadingSlice'
import { selectBoClient } from 'redux/socketSlice'
import { store } from 'redux/store'
import {
   PageWith3Toolbar,
   PageWith4Toolbar,
   PageWithdetails3Toolbar,
   PageWithdetails4Toolbar,
} from 'services/globalFunctions'
import { hasDetailsPermission } from 'services/permissionHandler'
import { v4 as uuidv4 } from 'uuid'
import * as Yup from 'yup'
import DashboardLayout from '../../layouts/Dashboard'

const Button = styled(MuiButton)(spacing)
const FormControlSpacing = styled(MuiFormControl)(spacing)
const FormControl = styled(FormControlSpacing)`
   min-width: 148px;
`
function Users() {
   // Define and initialize state variables using React hooks
   const theme = useTheme()
   const isLgUp = useMediaQuery(theme.breakpoints.up('lg'))
   const [open, setOpen] = React.useState(false)
   const [keyDate, setKeyDate] = React.useState(0)
   const [Transition, setTransition]: any = React.useState()
   const [openFilter, setOpenFilter] = React.useState(false)
   const [keyDateFilter, setKeyDateFilter] = React.useState(0)
   const user = useSelector(selectAuthUser) as User
   const UserScopeIndex = Object.values(UserScope).findIndex(
      (item) => item === user?.scope
   )
   const scopeList = Object.values(UserScope).filter(
      (item, index) => index >= UserScopeIndex
   )
   const [initialValues, setInitialValues] = React.useState({
      newPassword: '',
      newUsername: '',
      opId: '*',
      scope: scopeList[0],
      brandId: '*',
      affDomain: '',
      roleName: '*',
   })
   const operators = useSelector(selectAuthOperators) as OperatorList
   const roles = useSelector(selectAuthRoles)
   const [transitionFilter, setTransitionFilter]: any = React.useState()
   const filterInitialState = {
      opId: '',
      username: '',
   }
   const [filters, setFilters] = React.useState(filterInitialState)
   const [filtersInput, setFiltersInput] = React.useState(filterInitialState)
   const [filterChips, setFilterChips] = React.useState<FilterChip[]>([])
   const [ignore, setIgnore] = React.useState(false)
   const boClient = useSelector(selectBoClient)
   const brands = useSelector(selectAuthBrandsList) as Brand[]
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
   const [autoRefresh, setAutoRefresh] = React.useState(0)
   const [value, setValue] = React.useState('users')
   const [username1, setUsername1] = React.useState('')
   const [username2, setUsername2] = React.useState('')
   const [users, setUsers] = React.useState(
      [] as {
         username: string
         userPermissionEventInit: UserPermissionEvent[]
      }[]
   )
   const userDetail1 = useSelector(selectAuthUserDetails1) as User
   const userDetail2 = useSelector(selectAuthUserDetails2) as User
   const roleName = useSelector(selectAuthCurrentRoleName) as string
   const [permissionData, setPermissionData]: any = React.useState(
      userDetail1?.permissions
   )
   const [permissionData2, setPermissionData2]: any = React.useState(
      userDetail2?.permissions
   )
   // const UserPermissionEventInitKeys: any[] = useSelector(selectAuthPermissions)
   // Query to get the list of operators
   useGetOperatorListQuery({ key: 'operatorsList' })

   // Mutation function to create a new user
   const { mutate } = useCreateUserMutation({
      onSuccess: () => {
         handleClose()
         toast.success('Your data has been submitted successfully!', {
            position: toast.POSITION.TOP_CENTER,
         })
      },

      onError(error, variables, context) {
         toast.error(error, {
            position: toast.POSITION.TOP_CENTER,
         })
      },
   })

   // Function to open the dialog for adding a new user
   const handleClickOpen = (value: any) => {
      setTransition(TransitionSlide)
      setOpen(true)
      setInitialValues({
         newPassword: '',
         newUsername: '',
         opId:
            hasDetailsPermission(
               UserPermissionEvent.BACKOFFICE_OPERATOR_LIST_REQ
            ) || [UserScope.SUPERADMIN, UserScope.ADMIN].includes(user?.scope)
               ? '*'
               : user?.opId,
         scope: scopeList[0],
         brandId:
            hasDetailsPermission(
               UserPermissionEvent.BACKOFFICE_GET_OPERATOR_BRANDS_REQ
            ) ||
            [
               UserScope.SUPERADMIN,
               UserScope.ADMIN,
               UserScope.OPERATOR,
            ].includes(user?.scope)
               ? '*'
               : user?.brandId,
         affDomain: '',
         roleName: '*',
      })

      boClient?.user.getRoles(
         { userScope: scopeList[0] as UserScope },
         {
            uuid: uuidv4(),
            meta: {
               ts: new Date(),
               sessionId: sessionStorage.getItem('sessionId'),
               type: 'list',
               event: UserPermissionEvent.BACKOFFICE_GET_ROLES_REQ,
            },
         }
      )
   }

   // Function to close the dialog for adding a new user
   const handleClose = async () => {
      setKeyDate(keyDate + 1)
      await setTransition(TransitionSlide)
      setOpen(false)
   }

   // Function to open the filter dialog
   const handleClickOpenFilter = (value: any) => {
      setTransitionFilter(TransitionSlide)
      setOpenFilter(true)
   }

   // Function to handle filter submission
   const handleSearchFilter = () => {
      setFilters(filtersInput)
      handleCloseFilter()
   }

   // Function to render the "More Filters" button
   const moreFiltersBtn = () => {
      return (
         // Render the MoreFiltersButton component with associated functions
         <MoreFiltersButton
            open={openFilter}
            onClick={handleClickOpenFilter}
            TransitionComponent={transitionFilter}
            onClose={handleCloseFilter}
            onSearch={handleSearchFilter}
         >
            <TextField
               name="opId"
               label="OpId"
               onChange={(e) => {
                  setFiltersInput((prev) => ({
                     ...prev,
                     opId: e.target.value,
                  }))
               }}
               value={filtersInput.opId}
               fullWidth
               variant="outlined"
            />
            <TextField
               name="username"
               label="Username"
               onChange={(e: any) => {
                  setFiltersInput((prev) => ({
                     ...prev,
                     username: e.target.value,
                  }))
               }}
               value={filtersInput.username}
               fullWidth
               variant="outlined"
            />
         </MoreFiltersButton>
      )
   }

   // Function to close the filter dialog
   const handleCloseFilter = async () => {
      setKeyDateFilter(keyDateFilter + 1)
      await setTransition(TransitionSlide)
      setOpenFilter(false)
   }

   // Function to handle form submission when creating a new user
   const handleSubmit = React.useCallback(
      (dataCreateUser: {
         newUsername: string
         newPassword: string
         opId: string
         brandId: string
         scope: UserScope
         affDomain: string
         roleName: string
      }) => {
         // Prepare the data to be sent for creating a user
         const dto: CreateUserDto = {
            username: dataCreateUser.newUsername,
            password: dataCreateUser.newPassword,
            opId:
               dataCreateUser.scope === UserScope.SUPERADMIN
                  ? '*'
                  : dataCreateUser.opId,
            brandId:
               dataCreateUser.scope === UserScope.SUPERADMIN
                  ? '*'
                  : dataCreateUser.brandId,
            scope: dataCreateUser.scope,
         }
         if (
            dataCreateUser.scope !== UserScope.SUPERADMIN &&
            dataCreateUser.roleName !== '*'
         ) {
            dto.roleName = dataCreateUser.roleName
         }
         // Call the mutation to create the user
         mutate({ dto })
      },
      [mutate]
   )

   // Function to handle deletion of filter chips
   const handleDeleteChip = (chipToDelete: FilterChip) => () => {
      setFilterChips((chips) =>
         chips.filter((chip) => chip.key !== chipToDelete.key)
      )

      // Function to find the key of an object by its value
      const getObjectKey = (obj: any, value: string) => {
         return Object.keys(obj).find((key) => obj[key] === value)
      }

      const objKey = getObjectKey(filters, chipToDelete.value)
      objKey &&
         setFilters((prev) => ({
            ...prev,
            [objKey]:
               filterInitialState[objKey as keyof typeof filterInitialState],
         }))
   }
   const handleChange = (event: React.SyntheticEvent, newValue: string) => {
      setValue(newValue)
      store.dispatch(saveUserDetails1([]))
      store.dispatch(saveUserDetails2([]))
      setPermissionData([])
      setPermissionData2([])
      setUsername1('')
      setUsername2('')
   }
   // Effect to update filter chips and input when filters change
   useEffect(() => {
      setFilterChips([
         { key: 0, label: 'Op ID', value: filters.opId },
         { key: 1, label: 'Username', value: filters.username },
      ])
      setFiltersInput(filters)
   }, [filters])

   // Effect to handle loading state
   useEffect(() => {
      if (!ignore) {
         store.dispatch(saveLoadingUsersList(true))
         store.dispatch(saveUsersList([]))
         setTimeout(() => {
            setIgnore(true)
         }, 500)
      }
   })

   React.useEffect(() => {
      setPermissionData(userDetail1?.permissions)
      setPermissionData2(userDetail2?.permissions)
      const dataUsers: {
         username: string
         userPermissionEventInit: UserPermissionEvent[]
      }[] = []
      if (username1 !== '') {
         dataUsers.push({
            username: username1,
            userPermissionEventInit: userDetail1?.permissions,
         })
      }
      if (username2 !== '') {
         dataUsers.push({
            username: username2,
            userPermissionEventInit: userDetail2?.permissions,
         })
      }
      setUsers(dataUsers)
   }, [userDetail1, userDetail2])

   // Render the main component
   return (
      <React.Fragment>
         <Helmet title="iMoon | Users" />
         {/* HeaderFilterToolbar component */}
         {isDesktop ? (
            <CustomOperatorsBrandsToolbar
               title={'User List'}
               filter={true}
               handleFilter={moreFiltersBtn}
               background={theme.palette.secondary.dark}
               sx={{
                  mb:
                     filterChips.filter(
                        (chip) => chip.value && chip.value !== 'all'
                     ).length > 0
                        ? 0
                        : '12px',
               }}
               actions={
                  <>
                     {hasDetailsPermission(
                        UserPermissionEvent.BACKOFFICE_CREATE_USER_REQ
                     ) && (
                        <Grid item>
                           <Button
                              onClick={() => handleClickOpen('card')}
                              color="info"
                              variant="contained"
                              sx={{
                                 fontSize: 12,
                                 fontFamily: 'Nunito Sans SemiBold',
                                 borderRadius: '8px',
                                 p: '4px',
                                 px: '8px',
                                 '&:hover': {
                                    background: '#8098F9',
                                 },
                                 padding: '4px 8px',
                                 letterSpacing: '0.48px',
                                 gap: '2px',
                                 height: '28px',
                              }}
                           >
                              {' '}
                              <FontAwesomeIcon
                                 icon={faAdd as IconProp}
                                 fixedWidth
                                 fontSize={12}
                                 height={'initial'}
                                 width={'12px'}
                              />{' '}
                              New User
                           </Button>
                        </Grid>
                     )}
                     <Grid item>
                        <Button
                           onClick={() => setAutoRefresh(autoRefresh + 1)}
                           color="primary"
                           variant={isDesktop ? 'outlined' : 'text'}
                           sx={{
                              p: isDesktop ? '4px 8px 4px 8px' : 0,
                              borderRadius: '8px',
                              height: '28px',
                              justifyContent: isDesktop ? 'initial' : 'end',
                              minWidth: 'auto !important',
                              borderColor: `${darkPurple[12]} !important`,
                              svg: {
                                 width: '16px !important',
                              },
                              gap: '10px',
                           }}
                        >
                           <FontAwesomeIcon
                              icon={faArrowsRotate as IconProp}
                              fixedWidth
                              fontSize={'16px'}
                              color={darkPurple[12]}
                           />
                           {isDesktop && (
                              <Typography
                                 component="p"
                                 variant="button"
                                 fontFamily={'Nunito Sans SemiBold'}
                                 fontSize={'14px'}
                                 whiteSpace="nowrap"
                                 color={darkPurple[12]}
                              >
                                 Refresh
                              </Typography>
                           )}
                        </Button>
                     </Grid>
                  </>
               }
            />
         ) : (
            <>
               <CustomOperatorsBrandsToolbar
                  title={'User List'}
                  actions={
                     <Grid item>
                        <Button
                           onClick={() => setAutoRefresh(autoRefresh + 1)}
                           color="primary"
                           variant={'text'}
                           sx={{
                              p: 0,
                              height: '28px',
                              justifyContent: 'end',
                              minWidth: 'auto !important',
                              borderColor: `${darkPurple[12]} !important`,
                              svg: {
                                 width: '16px !important',
                              },
                              gap: '10px',
                           }}
                        >
                           <FontAwesomeIcon
                              icon={faArrowsRotate as IconProp}
                              fixedWidth
                              fontSize={'16px'}
                              color={darkPurple[12]}
                           />
                        </Button>
                     </Grid>
                  }
               />
               <HeaderFilterToolbar
                  moreFiltersBtn={moreFiltersBtn}
                  sx={{
                     mb:
                        filterChips.filter(
                           (chip) => chip.value && chip.value !== 'all'
                        ).length > 0
                           ? 0
                           : '6px',
                  }}
                  actions={
                     <>
                        {hasDetailsPermission(
                           UserPermissionEvent.BACKOFFICE_CREATE_USER_REQ
                        ) && (
                           <Grid item>
                              <Button
                                 onClick={() => handleClickOpen('card')}
                                 color="info"
                                 variant="contained"
                                 sx={{
                                    fontSize: 12,
                                    fontFamily: 'Nunito Sans SemiBold',
                                    borderRadius: '8px',
                                    p: '4px',
                                    px: '8px',
                                    '&:hover': {
                                       background: '#8098F9',
                                    },
                                    padding: '4px 8px',
                                    letterSpacing: '0.48px',
                                    gap: '2px',
                                    height: '28px',
                                 }}
                              >
                                 {' '}
                                 <FontAwesomeIcon
                                    icon={faAdd as IconProp}
                                    fixedWidth
                                    fontSize={12}
                                    height={'initial'}
                                    width={'12px'}
                                 />{' '}
                                 New User
                              </Button>
                           </Grid>
                        )}
                     </>
                  }
               />
            </>
         )}
         {filterChips.filter((chip) => chip.value && chip.value !== 'all')
            .length > 0 && (
            <HeaderTitleToolbar
               filterChips={filterChips}
               handleDeleteChip={handleDeleteChip}
               sx={{
                  '.MuiStack-root': {
                     maxWidth: '100%',
                  },
               }}
            />
         )}
         {/* Conditionally render user list or loader */}
         {ignore ? (
            <TabContext value={value}>
               <TabList
                  className="detail_tabs"
                  onChange={handleChange}
                  variant="scrollable"
                  sx={{
                     mb: '6px',
                     pt: isDesktop ? 0 : '6px',
                     justifyContent: isDesktop ? 'left' : 'left',
                  }}
                  scrollButtons={true}
               >
                  <Tab
                     label={
                        <Typography variant="bodySmallBold" component="span">
                           Users
                        </Typography>
                     }
                     value="users"
                  />
                  {hasDetailsPermission(
                     UserPermissionEvent.BACKOFFICE_GET_USER_REQ
                  ) && (
                     <Tab
                        label={
                           <Typography variant="bodySmallBold" component="span">
                              Compare permissions
                           </Typography>
                        }
                        value="permissions"
                     />
                  )}
               </TabList>
               <TabPanel value="users" sx={{ padding: '0px' }}>
                  <AllUsers
                     opId={filters.opId}
                     username={filters.username}
                     autoRefresh={autoRefresh}
                  />
               </TabPanel>
               {hasDetailsPermission(
                  UserPermissionEvent.BACKOFFICE_GET_USER_REQ
               ) && (
                  <TabPanel value="permissions" sx={{ padding: '0px' }}>
                     <Box
                        className="dataGridWrapper"
                        mb={'0px'}
                        px={isLgUp ? '12px' : '4px'}
                        py={'6px'}
                        pt={0}
                        sx={{
                           height: isDesktop
                              ? PageWith3Toolbar
                              : PageWith4Toolbar,
                           width: isDesktop ? 'calc(100vw - 225px)' : '100%',
                        }}
                     >
                        <Grid
                           container
                           alignItems="center"
                           p={2}
                           px={isLgUp ? '0' : '4px'}
                           pt={0}
                           pb={0}
                           spacing={0.5}
                           justifyContent={isDesktop ? 'left' : 'center'}
                        >
                           <Grid item sm={'auto'} xs={6}>
                              <FormControl
                                 sx={{
                                    width: '100%',
                                    mt: 0,
                                 }}
                              >
                                 <TextField
                                    name="username1"
                                    label="Username"
                                    onChange={(e) => {
                                       setUsername1(e.target.value)
                                    }}
                                    value={username1}
                                    fullWidth
                                    variant="outlined"
                                 />
                              </FormControl>
                           </Grid>
                           <Grid item sm={'auto'} xs={6}>
                              <FormControl
                                 sx={{
                                    width: '100%',
                                    mt: 0,
                                 }}
                              >
                                 <TextField
                                    name="username2"
                                    label="Username"
                                    onChange={(e) => {
                                       setUsername2(e.target.value)
                                    }}
                                    value={username2}
                                    fullWidth
                                    variant="outlined"
                                 />
                              </FormControl>
                           </Grid>
                           <Grid item sm={'auto'} xs={12}>
                              <Button
                                 color="secondary"
                                 variant="contained"
                                 sx={{
                                    height: '40px',
                                    minWidth: '100px',
                                    width: '100%',
                                 }}
                                 onClick={() => {
                                    if (username1 === '') {
                                       store.dispatch(saveUserDetails1({}))
                                    } else {
                                       store.dispatch(
                                          saveLoadingUserDetails1(true)
                                       )
                                       const find = {
                                          username: username1,
                                       }
                                       boClient?.user.getUser(
                                          { ...find },
                                          {
                                             uuid: uuidv4(),
                                             meta: {
                                                type: 'username1',
                                                ts: new Date(),
                                                sessionId:
                                                   sessionStorage.getItem(
                                                      'sessionId'
                                                   ),
                                                event: UserPermissionEvent.BACKOFFICE_GET_USER_REQ,
                                             },
                                          }
                                       )
                                    }

                                    if (username2 === '') {
                                       store.dispatch(saveUserDetails2({}))
                                    } else {
                                       store.dispatch(
                                          saveLoadingUserDetails1(true)
                                       )
                                       const find = {
                                          username: username2,
                                       }
                                       boClient?.user.getUser(
                                          { ...find },
                                          {
                                             uuid: uuidv4(),
                                             meta: {
                                                type: 'username2',
                                                ts: new Date(),
                                                sessionId:
                                                   sessionStorage.getItem(
                                                      'sessionId'
                                                   ),
                                                event: UserPermissionEvent.BACKOFFICE_GET_USER_REQ,
                                             },
                                          }
                                       )
                                    }
                                 }}
                              >
                                 Compare
                              </Button>
                           </Grid>
                        </Grid>
                        <Grid
                           container
                           alignItems="center"
                           p={2}
                           px={isLgUp ? '0' : '4px'}
                           spacing={1}
                        >
                           <Grid
                              item
                              xs={12}
                              sx={{
                                 '.dataGridWrapper': {
                                    p: 0,
                                    width: '100%',
                                    height: isDesktop
                                       ? PageWithdetails3Toolbar
                                       : PageWithdetails4Toolbar,
                                 },
                              }}
                           >
                              <PermissionsCompareData
                                 users={users}
                              />
                           </Grid>
                           {/* <Grid
                                 item
                                 md={6}
                                 sx={{
                                    '.dataGridWrapper': {
                                       p: 0,
                                       width: '100%',
                                       height: isLgUp
                                          ? PageWithdetails3Toolbar
                                          : PageWithdetails3Toolbar,
                                    },
                                 }}
                              >
                                 <PermissionsCompareData
                                    userPermissionEventInit={
                                       (permissionData2 && permissionData && 
                                          permissionData2.filter(
                                             (item: UserPermissionEvent) =>
                                                permissionData.includes(item)
                                          )) ||
                                       []
                                    }
                                    userPermissionEventInitExtra={
                                       (permissionData2 && permissionData && 
                                          permissionData2.filter(
                                             (item: UserPermissionEvent) =>
                                                !permissionData.includes(item)
                                          )) ||
                                       []
                                    }
                                 />
                              </Grid> */}
                        </Grid>
                     </Box>
                  </TabPanel>
               )}
            </TabContext>
         ) : (
            <CustomLoader />
         )}

         {/* User creation dialog */}
         <Dialog
            open={open}
            sx={{ '.MuiPaper-root': { pt: '0px !important' } }}
            fullScreen
            TransitionComponent={Transition}
            keepMounted
            key={keyDate}
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
         >
            <Grid
               container
               direction="row"
               alignItems="center"
               p={'12px'}
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
                     Add New User
                  </Typography>
               </Grid>
               <Grid item xs></Grid>
               <Grid item>
                  <FontAwesomeIcon
                     icon={faRectangleXmark as IconProp}
                     onClick={handleClose}
                     cursor={'pointer'}
                  />
               </Grid>
            </Grid>
            <DialogContent sx={{ p: 1 }}>
               <Formik
                  initialValues={initialValues}
                  enableReinitialize={true}
                  validationSchema={Yup.object().shape({
                     newUsername: Yup.string()
                        .min(4)
                        .required('username is required'),
                     newPassword: Yup.string()
                        .matches(
                           /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z])/,
                           'Password must contain at least one uppercase, one lowercase character, numbers, and special characters'
                        )
                        .min(6)
                        .max(50)
                        .required('Password Required'),
                     affDomain: Yup.string().when(
                        ['scope'],
                        ([scope], schema) => {
                           if (scope === UserScope.AFFILIATE)
                              return Yup.string().required(
                                 'Affiliate Domain is required'
                              )
                           return schema
                        }
                     ),
                     opId: Yup.string().when(['scope'], ([scope], schema) => {
                        if (
                           scope === UserScope.AFFILIATE ||
                           scope === UserScope.BRAND ||
                           scope === UserScope.OPERATOR
                        )
                           return Yup.string()
                              .not(['*'], 'Operator is required')
                              .required('Operator is required')
                        return schema
                     }),
                     brandId: Yup.string().when(
                        ['scope'],
                        ([scope], schema) => {
                           if (
                              scope === UserScope.AFFILIATE ||
                              scope === UserScope.BRAND
                           )
                              return Yup.string()
                                 .not(['*'], 'Brand is required')
                                 .required('Brand is required')
                           return schema
                        }
                     ),
                     roleName: Yup.string().when(
                        ['scope'],
                        ([scope], schema) => {
                           if (
                              scope === UserScope.ADMIN ||
                              scope === UserScope.AFFILIATE ||
                              scope === UserScope.BRAND ||
                              scope === UserScope.OPERATOR
                           )
                              return Yup.string()
                                 .not(['*'], 'Role is required')
                                 .required('Role is required')
                           return schema
                        }
                     ),
                  })}
                  onSubmit={handleSubmit}
               >
                  {({
                     errors,
                     handleBlur,
                     handleChange,
                     handleSubmit,
                     isSubmitting,
                     touched,
                     values,
                     status,
                  }) => (
                     <form
                        noValidate
                        autoComplete="off"
                        onSubmit={handleSubmit}
                     >
                        <TextField
                           name="newUsername"
                           label="Username "
                           type="text"
                           value={values.newUsername}
                           error={Boolean(
                              touched.newUsername && errors.newUsername
                           )}
                           autoComplete="off"
                           fullWidth
                           helperText={
                              touched.newUsername && errors.newUsername
                           }
                           onBlur={handleBlur}
                           onChange={handleChange}
                           variant="outlined"
                           sx={{ mt: 0 }}
                        />
                        <TextField
                           name="newPassword"
                           label="Password"
                           value={values.newPassword}
                           error={Boolean(
                              touched.newPassword && errors?.newPassword
                           )}
                           fullWidth
                           inputProps={{
                              autoComplete: 'new-password',
                              'aria-autocomplete': 'none',
                           }}
                           type="password"
                           helperText={
                              touched?.newPassword && errors?.newPassword
                           }
                           onBlur={handleBlur}
                           onChange={handleChange}
                           variant="outlined"
                        />
                        <FormControl fullWidth>
                           <InputLabel id="demo-simple-select-disabled-label">
                              Scope
                           </InputLabel>
                           <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              label="Scope"
                              sx={{
                                 width: '100%',
                              }}
                              IconComponent={() => (
                                 <FontAwesomeIcon
                                    icon={faAngleDown as IconProp}
                                    className="selectIcon"
                                    size="sm"
                                 /> // Use FontAwesome icon as the select icon
                              )}
                              value={values.scope}
                              name="scope"
                              onChange={(e) => {
                                 boClient?.user.getRoles(
                                    { userScope: e.target.value as UserScope },
                                    {
                                       uuid: uuidv4(),
                                       meta: {
                                          ts: new Date(),
                                          sessionId:
                                             sessionStorage.getItem(
                                                'sessionId'
                                             ),
                                          type: 'list',
                                          event: UserPermissionEvent.BACKOFFICE_GET_ROLES_REQ,
                                       },
                                    }
                                 )
                                 handleChange(e)
                              }}
                           >
                              {scopeList.map((item, index: number) => {
                                 return (
                                    <MenuItem
                                       key={`scope${index}`}
                                       value={item}
                                    >
                                       <Stack
                                          direction="row"
                                          alignItems="center"
                                          gap={2}
                                          textTransform="capitalize"
                                       >
                                          {item}
                                       </Stack>
                                    </MenuItem>
                                 )
                              })}
                           </Select>
                        </FormControl>
                        {values.scope === UserScope.AFFILIATE && (
                           <TextField
                              name="affDomain"
                              label="Affiliate Domain "
                              type="text"
                              value={values.affDomain}
                              error={Boolean(
                                 touched.affDomain && errors?.affDomain
                              )}
                              helperText={
                                 touched?.affDomain && errors?.affDomain
                              }
                              autoComplete="off"
                              fullWidth
                              onBlur={handleBlur}
                              onChange={handleChange}
                              variant="outlined"
                           />
                        )}
                        {values.scope !== UserScope.SUPERADMIN && (
                           <>
                              <FormControl fullWidth>
                                 <InputLabel id="demo-simple-select-disabled-label">
                                    Role Name
                                 </InputLabel>
                                 <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Role Name"
                                    sx={{
                                       width: '100%',
                                    }}
                                    value={values.roleName}
                                    name="roleName"
                                    error={Boolean(errors?.roleName)}
                                    onChange={handleChange}
                                    IconComponent={() => (
                                       <FontAwesomeIcon
                                          icon={faAngleDown as IconProp}
                                          className="selectIcon"
                                          size="sm"
                                       /> // Use FontAwesome icon as the select icon
                                    )}
                                 >
                                    {roles?.map((item, index: number) => {
                                       return (
                                          <MenuItem
                                             key={`operator${index}`}
                                             value={item.name}
                                          >
                                             <Stack
                                                direction="row"
                                                alignItems="center"
                                                gap={2}
                                                textTransform="capitalize"
                                             >
                                                {item.name}
                                             </Stack>
                                          </MenuItem>
                                       )
                                    })}
                                 </Select>
                                 <FormHelperText color={'#ff8a80'}>
                                    {errors.roleName}
                                 </FormHelperText>
                              </FormControl>
                              {hasDetailsPermission(
                                 UserPermissionEvent.BACKOFFICE_OPERATOR_LIST_REQ
                              ) && (
                                 <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-disabled-label">
                                       Operator
                                    </InputLabel>
                                    <Select
                                       labelId="demo-simple-select-label"
                                       id="demo-simple-select"
                                       label="Operator"
                                       sx={{
                                          width: '100%',
                                       }}
                                       value={values.opId}
                                       name="opId"
                                       IconComponent={() => (
                                          <FontAwesomeIcon
                                             icon={faAngleDown as IconProp}
                                             className="selectIcon"
                                             size="sm"
                                          /> // Use FontAwesome icon as the select icon
                                       )}
                                       onChange={(e) => {
                                          hasDetailsPermission(
                                             UserPermissionEvent.BACKOFFICE_GET_OPERATOR_BRANDS_REQ
                                          ) &&
                                             values.opId !== '*' &&
                                             boClient?.operator?.getOperatorBrands(
                                                { opId: e.target.value },
                                                {
                                                   uuid: uuidv4(),
                                                   meta: {
                                                      ts: new Date(),
                                                      type: 'list',
                                                      sessionId:
                                                         sessionStorage.getItem(
                                                            'sessionId'
                                                         ),
                                                      event: UserPermissionEvent.BACKOFFICE_GET_OPERATOR_BRANDS_REQ,
                                                   },
                                                }
                                             )
                                          values.brandId = initialValues.brandId
                                          handleChange(e)
                                       }}
                                       error={Boolean(errors?.opId)}
                                    >
                                       {values.scope === UserScope.ADMIN && (
                                          <MenuItem
                                             key={`operator*`}
                                             value={'*'}
                                          >
                                             <Stack
                                                direction="row"
                                                alignItems="center"
                                                gap={2}
                                                textTransform="capitalize"
                                             >
                                                All Operators
                                             </Stack>
                                          </MenuItem>
                                       )}
                                       {operators?.operators.map(
                                          (item: Operator, index: number) => {
                                             return (
                                                <MenuItem
                                                   key={`operator${index}`}
                                                   value={item.opId}
                                                >
                                                   <Stack
                                                      direction="row"
                                                      alignItems="center"
                                                      gap={2}
                                                      textTransform="capitalize"
                                                   >
                                                      {item.opId}-{item.title}
                                                   </Stack>
                                                </MenuItem>
                                             )
                                          }
                                       )}
                                    </Select>
                                    <FormHelperText>
                                       {errors.opId}
                                    </FormHelperText>
                                 </FormControl>
                              )}
                              {user &&
                                 [
                                    UserScope.OPERATOR,
                                    UserScope.ADMIN,
                                    UserScope.SUPERADMIN,
                                 ].includes(user.scope) && (
                                    <FormControl fullWidth>
                                       <InputLabel id="demo-simple-select-disabled-label">
                                          Brands
                                       </InputLabel>
                                       <Select
                                          labelId="demo-simple-select-label"
                                          id="demo-simple-select"
                                          label="Operator"
                                          sx={{
                                             width: '100%',
                                          }}
                                          value={values.brandId}
                                          name="brandId"
                                          onChange={handleChange}
                                          IconComponent={() => (
                                             <FontAwesomeIcon
                                                icon={faAngleDown as IconProp}
                                                className="selectIcon"
                                                size="sm"
                                             /> // Use FontAwesome icon as the select icon
                                          )}
                                          error={Boolean(errors?.brandId)}
                                       >
                                          {values.scope !==
                                             UserScope.AFFILIATE &&
                                             values.scope !==
                                                UserScope.BRAND && (
                                                <MenuItem
                                                   key={`operator*`}
                                                   value={'*'}
                                                >
                                                   <Stack
                                                      direction="row"
                                                      alignItems="center"
                                                      gap={2}
                                                      textTransform="capitalize"
                                                   >
                                                      All Brands
                                                   </Stack>
                                                </MenuItem>
                                             )}

                                          {values.opId !== '*' &&
                                             brands &&
                                             brands.map(
                                                (item, index: number) => {
                                                   return (
                                                      <MenuItem
                                                         key={`brands${index}`}
                                                         value={item.brandId}
                                                      >
                                                         <Stack
                                                            direction="row"
                                                            alignItems="center"
                                                            gap={2}
                                                            textTransform="capitalize"
                                                         >
                                                            {item.brandName}
                                                         </Stack>
                                                      </MenuItem>
                                                   )
                                                }
                                             )}
                                       </Select>
                                       <FormHelperText color={'#ff8a80'}>
                                          {errors.brandId}
                                       </FormHelperText>
                                    </FormControl>
                                 )}
                           </>
                        )}
                        <DialogActions>
                           <Button
                              onClick={handleClose}
                              color="secondary"
                              variant="outlined"
                              sx={{ height: 32, borderColor: darkPurple[10] }}
                           >
                              Cancel
                           </Button>
                           <Button
                              type="submit"
                              color="secondary"
                              variant="contained"
                              sx={{ height: 32 }}
                           >
                              Save
                           </Button>
                        </DialogActions>
                     </form>
                  )}
               </Formik>
            </DialogContent>
         </Dialog>
      </React.Fragment>
   )
}

Users.getLayout = function getLayout(page: ReactElement) {
   return <DashboardLayout title="User List">{page}</DashboardLayout>
}

export default Users

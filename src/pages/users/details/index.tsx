import CustomLoader from '@/components/custom/CustomLoader';
import { renderUserScopeCell } from '@/components/custom/PortalRenderCells';
import CustomOperatorsBrandsToolbar from '@/components/custom/customOperatorsBrandsToolbar';
import PermissionsData from '@/components/data/permissions/permissions-grid';
import UserActivities from '@/components/data/user-activities/user-activities-grid';
import {
   useEditUserMutation,
   useGetUserDetailsQuery,
} from '@/components/data/users/lib/hooks/queries';
import UserRolesFilter from '@/components/pages/dashboard/default/roles';
import {
   EditUserDto,
   User,
   UserPermission,
   UserPermissionEvent,
   UserScope,
} from '@alienbackoffice/back-front';
import styled from '@emotion/styled';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import {
   Avatar,
   Card,
   CardContent,
   Grid,
   Button as MuiButton,
   Tab as MuiTab,
   TextField,
   Typography,
   useMediaQuery,
   useTheme,
} from '@mui/material';
import { Stack, spacing } from '@mui/system';
import { ImoonGray, darkPurple } from 'colors';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import type { ReactElement } from 'react';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
   saveUserDetails,
   selectAuthCurrentRoleName,
   selectAuthPermissions,
   selectAuthRoles,
   selectAuthUser,
   selectAuthUserDetails,
} from 'redux/authSlice';
import { store } from 'redux/store';
import { PageWithdetails3Toolbar } from 'services/globalFunctions';
import { hasDetailsPermission } from 'services/permissionHandler';
import { roleNameText } from 'types';
import DashboardLayout from '../../../layouts/Dashboard';
import Profile from './profile';

function DetailsUser() {
   const router = useRouter();
   const theme = useTheme();
   const [value, setValue] = React.useState('profile');
   const handleChange = (event: React.SyntheticEvent, newValue: string) => {
      setValue(newValue);
   };
   const { opId, username } = router.query;
   const post = {
      opId: opId as string,
      username: username as string,
   };
   const userDetail = useSelector(selectAuthUserDetails) as User;
   const Tab = styled(MuiTab)`
      color: ${(props) => props.theme.palette.primary};
      &.Mui-selected {
      }
   `;
   const DynamicReactJson = dynamic(import('react-json-view'), { ssr: false });
   const Button = styled(MuiButton)(spacing);
   const [ignore, setIgnore] = React.useState(false);
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
   const isMobile = useMediaQuery(theme.breakpoints.up(400));
   const isLgUp = useMediaQuery(theme.breakpoints.up('lg'));
   const roles = useSelector(selectAuthRoles);
   const roleName = useSelector(selectAuthCurrentRoleName) as string;
   const [permissionData, setPermissionData]: any = React.useState(
      userDetail?.permissions
   );
   const [permission, setPermission] = React.useState('');
   const UserPermissionEventInitKeys: any[] = useSelector(
      selectAuthPermissions
   );
   const [UserPermissionEventInit, setUserPermissionEventInit]: any[] =
      React.useState(
         useSelector(selectAuthPermissions).filter((item: UserPermission) =>
            item.scopes?.includes(userDetail.scope)
         )
      );
   const user: User = useSelector(selectAuthUser);
   useGetUserDetailsQuery(post);

   const { mutate } = useEditUserMutation({
      onSuccess: (data) => {
         store.dispatch(saveUserDetails(data.data));
         toast.success('You Set Permissions Successfully', {
            position: toast.POSITION.TOP_CENTER,
         });
      },
   });

   const handleManagePermissions = () => {
      // const permissionEdit = permissionData.filter(
      //    (item: UserPermissionEvent) => UserPermissionEventInit.includes(item)
      // )
      const dto: EditUserDto = {
         username: userDetail.username,
         permissions: permissionData,
      };
      mutate({ dto });
   };

   React.useEffect(() => {
      if (roleName === roleNameText.CURRENTUSEDROLE) {
         setPermissionData(userDetail?.permissions);
      } else {
         setPermissionData(
            (roles?.length > 0 &&
               roles.find((item) => item.name === roleName)
                  ?.UserPermissionEvent) ||
               []
         );
      }
   }, [roleName]);

   useEffect(() => {
      if (!ignore) {
         setTimeout(() => {
            setIgnore(true);
         }, 1000);
      }
   });

   return (
      <React.Fragment>
         <Helmet title="User Details" />
         <CustomOperatorsBrandsToolbar
            title={'User Details'}
            background={
               isDesktop
                  ? theme.palette.secondary.dark
                  : theme.palette.primary.main
            }
         />
         {ignore && userDetail ? (
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
                  <Grid item>
                     {userDetail && (
                        <Grid
                           container
                           alignItems="center"
                           p={2}
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
                              textAlign={'left'}
                              p={1}
                              justifyContent={'center'}
                              width={
                                 isDesktop ? 'initial' : 'calc(100% - 60px)'
                              }
                           >
                              <Typography
                                 fontFamily="Nunito Sans Bold"
                                 color={
                                    isDesktop ? ImoonGray[1] : ImoonGray[12]
                                 }
                                 fontSize="12px !important"
                                 lineHeight="13.92px"
                                 mb={'6px'}
                                 textTransform={'capitalize'}
                              >
                                 {userDetail?.username}
                              </Typography>
                              {renderUserScopeCell(userDetail?.scope)}
                           </Grid>
                        </Grid>
                     )}
                  </Grid>
                  <Grid item xs></Grid>
               </Grid>
               <Grid
                  item
                  xs={12}
                  px={isDesktop ? '12px' : '4px'}
                  sx={{
                     '.MuiTabPanel-root': {
                        padding: '8px 0px',
                        '.dataGridWrapper': {
                           marginLeft: isDesktop ? '-12px' : 0,
                           height: PageWithdetails3Toolbar,
                        },
                     },
                     '.MuiButtonBase-root.MuiTabScrollButton-root ': {
                        display: isMobile
                           ? 'none !important'
                           : 'initial !important',
                     },
                  }}
               >
                  <TabContext value={value}>
                     {isLgUp ? (
                        <Grid
                           container
                           alignItems="center"
                           p={'8px 12px'}
                           spacing={1}
                        >
                           <Grid item>
                              <TabList
                                 className="detail_tabs"
                                 onChange={handleChange}
                                 variant="scrollable"
                                 scrollButtons={isDesktop ? false : true}
                                 sx={{
                                    mb: '6px',
                                    pt: isDesktop ? 0 : '6px',
                                 }}
                              >
                                 <Tab
                                    label={
                                       <Typography
                                          variant="bodySmallBold"
                                          component="span"
                                       >
                                          Profile{' '}
                                       </Typography>
                                    }
                                    value="profile"
                                 />
                                 {hasDetailsPermission(
                                    UserPermissionEvent.BACKOFFICE_USER_ACTIVITY_LIST_REQ
                                 ) && (
                                    <Tab
                                       label={
                                          <Typography
                                             variant="bodySmallBold"
                                             component="span"
                                          >
                                             Activities{' '}
                                          </Typography>
                                       }
                                       value="activities"
                                    />
                                 )}

                                 {userDetail?.scope !==
                                    UserScope.SUPERADMIN && (
                                    <Tab
                                       label={
                                          <Typography
                                             variant="bodySmallBold"
                                             component="span"
                                          >
                                             Permissions{' '}
                                          </Typography>
                                       }
                                       value="permissions"
                                    />
                                 )}
                                 {user?.scope === UserScope.SUPERADMIN && (
                                    <Tab
                                       label={
                                          <Typography
                                             variant="bodySmallBold"
                                             component="span"
                                          >
                                             Json{' '}
                                          </Typography>
                                       }
                                       value="json"
                                    />
                                 )}
                              </TabList>
                           </Grid>
                           <Grid item xs></Grid>
                           {roles?.length > 0 && value === 'permissions' && (
                              <Grid
                                 item
                                 xs={12}
                                 md={'auto'}
                                 sx={{
                                    '.MuiInputBase-root': {
                                       color: ImoonGray[1],
                                       fontFamily: 'Nunito Sans Bold',
                                       svg: {
                                          color: `${ImoonGray[1]} !important`,
                                       },
                                    },
                                 }}
                              >
                                 <UserRolesFilter withEmptyValue={true} />
                              </Grid>
                           )}

                           {hasDetailsPermission(
                              UserPermissionEvent.BACKOFFICE_EDIT_USER_REQ
                           ) &&
                              value === 'permissions' && (
                                 <Grid item xs={12} md={'auto'}>
                                    <Button
                                       onClick={handleManagePermissions}
                                       color="info"
                                       variant="contained"
                                       sx={{
                                          fontSize: 12,
                                          fontFamily: 'Nunito Sans SemiBold',
                                          borderRadius: '8px',
                                          height: '28px',
                                          '&:hover': {
                                             background: '#8098F9',
                                          },
                                          padding: '4px 8px',
                                          letterSpacing: '0.48px',
                                          gap: '2px',
                                       }}
                                    >
                                       Set Permissions
                                    </Button>
                                 </Grid>
                              )}
                           {value === 'permissions' && (
                              <Grid
                                 item
                                 justifyContent={'end'}
                                 display={'flex'}
                              >
                                 <TextField
                                    label="Search"
                                    type="search"
                                    value={permission}
                                    fullWidth
                                    autoComplete="off"
                                    onChange={(e) => {
                                       setPermission(e.target.value);
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
                                               ).filter(
                                                  (item: UserPermission) =>
                                                     item.scopes?.includes(
                                                        userDetail.scope
                                                     )
                                               )
                                            )
                                          : setUserPermissionEventInit(
                                               UserPermissionEventInitKeys.filter(
                                                  (item: UserPermission) =>
                                                     item.scopes?.includes(
                                                        userDetail.scope
                                                     )
                                               )
                                            );
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
                              </Grid>
                           )}
                        </Grid>
                     ) : (
                        <Grid
                           container
                           alignItems="center"
                           p={'8px 12px'}
                           spacing={1}
                        >
                           <Grid item xs={12} p={0}>
                              <TabList
                                 className="detail_tabs"
                                 onChange={handleChange}
                                 variant="scrollable"
                                 sx={{ mb: '6px', pt: isDesktop ? 0 : '6px' }}
                                 scrollButtons={true}
                              >
                                 <Tab
                                    label={
                                       <Typography
                                          variant="bodySmallBold"
                                          component="span"
                                       >
                                          Profile{' '}
                                       </Typography>
                                    }
                                    value="profile"
                                 />
                                 {hasDetailsPermission(
                                    UserPermissionEvent.BACKOFFICE_USER_ACTIVITY_LIST_REQ
                                 ) && (
                                    <Tab
                                       label={
                                          <Typography
                                             variant="bodySmallBold"
                                             component="span"
                                          >
                                             Activities{' '}
                                          </Typography>
                                       }
                                       value="activities"
                                    />
                                 )}

                                 {userDetail?.scope !==
                                    UserScope.SUPERADMIN && (
                                    <Tab
                                       label={
                                          <Typography
                                             variant="bodySmallBold"
                                             component="span"
                                          >
                                             Permissions{' '}
                                          </Typography>
                                       }
                                       value="permissions"
                                    />
                                 )}
                                 {user?.scope === UserScope.SUPERADMIN && (
                                    <Tab
                                       label={
                                          <Typography
                                             variant="bodySmallBold"
                                             component="span"
                                          >
                                             Json{' '}
                                          </Typography>
                                       }
                                       value="json"
                                    />
                                 )}
                              </TabList>
                           </Grid>
                           {value === 'permissions' && (
                              <Grid
                                 item
                                 p={0}
                                 sm={'auto'}
                                 sx={{
                                    '.MuiInputBase-root': {
                                       color: ImoonGray[1],
                                       fontFamily: 'Nunito Sans Bold',
                                       svg: {
                                          color: `${ImoonGray[1]} !important`,
                                       },
                                    },
                                 }}
                                 xs={4}
                              >
                                 <UserRolesFilter withEmptyValue={true} />
                              </Grid>
                           )}
                           {hasDetailsPermission(
                              UserPermissionEvent.BACKOFFICE_EDIT_USER_REQ
                           ) &&
                              value === 'permissions' && (
                                 <Grid item sm={'auto'} xs={4}>
                                    <Button
                                       onClick={handleManagePermissions}
                                       color="info"
                                       variant="contained"
                                       fullWidth
                                       sx={{
                                          fontSize: 12,
                                          fontFamily: 'Nunito Sans SemiBold',
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
                                       Set Permissions
                                    </Button>
                                 </Grid>
                              )}
                           <Grid item sm p={'0 !important'} />
                           {value === 'permissions' && (
                              <Grid
                                 item
                                 justifyContent={'end'}
                                 display={'flex'}
                                 p={'0!important'}
                                 xs={4}
                                 sm={'auto'}
                              >
                                 <TextField
                                    label="Search"
                                    type="search"
                                    value={permission}
                                    fullWidth
                                    autoComplete="off"
                                    onChange={(e) => {
                                       setPermission(e.target.value);
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
                                               ).filter(
                                                  (item: UserPermission) =>
                                                     item.scopes?.includes(
                                                        userDetail.scope
                                                     )
                                               )
                                            )
                                          : setUserPermissionEventInit(
                                               UserPermissionEventInitKeys.filter(
                                                  (item: UserPermission) =>
                                                     item.scopes?.includes(
                                                        userDetail.scope
                                                     )
                                               )
                                            );
                                    }}
                                    sx={{
                                       mt: 0,
                                       height: '42px',
                                       maxWidth: '100%',
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
                              </Grid>
                           )}
                        </Grid>
                     )}

                     <TabPanel value="profile" sx={{ padding: '0px' }}>
                        <Profile userDetail={userDetail} />
                     </TabPanel>
                     <TabPanel
                        value="activities"
                        sx={{
                           padding: '0',
                           width: isDesktop ? 'calc(100vw - 245px)' : '100%',
                        }}
                     >
                        <UserActivities
                           username={userDetail?.username}
                           opId={userDetail?.opId}
                        />
                     </TabPanel>
                     <TabPanel value="permissions" sx={{ padding: '8px 0px' }}>
                        <PermissionsData
                           user={userDetail}
                           setPermissionEdit={(data: any) =>
                              setPermissionData(data)
                           }
                           userPermissionEventInit={UserPermissionEventInit}
                        />
                     </TabPanel>
                     <TabPanel value="json" sx={{ padding: '8px 0px' }}>
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
                                 maxHeight: PageWithdetails3Toolbar,
                                 overflowY: 'auto',
                              }}
                           >
                              <DynamicReactJson
                                 key={`jsonUsername${userDetail?.username}`}
                                 src={userDetail}
                                 theme="tomorrow"
                              />
                           </CardContent>
                        </Card>
                     </TabPanel>
                  </TabContext>
               </Grid>
            </>
         ) : (
            <CustomLoader />
         )}
      </React.Fragment>
   );
}

DetailsUser.getLayout = function getLayout(page: ReactElement) {
   return <DashboardLayout>{page}</DashboardLayout>;
};

export default DetailsUser;

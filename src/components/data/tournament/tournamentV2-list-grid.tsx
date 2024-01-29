import SelectTheme from '@/components/SelectTheme';
import GridStyle from '@/components/custom/GridStyle';
import PortalCopyValue from '@/components/custom/PortalCopyValue';
import {
   renderStatusTournamentCell,
   renderTimeCell,
} from '@/components/custom/PortalRenderCells';
import TransitionSlide from '@/components/custom/TransitionSlide';
import {
   SaveTournamentV2ResultDto,
   SendTournamentResultDto,
   SendTournamentV2ResultDto,
   TournamentV2,
   UpdateTournamentV2Dto,
   User,
   UserPermissionEvent,
   UserScope,
} from '@alienbackoffice/back-front';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
   faAngleDown,
   faCopy,
   faRectangleXmark,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import {
   Box,
   Button,
   Dialog,
   DialogActions,
   DialogContent,
   DialogContentText,
   DialogProps,
   DialogTitle,
   FormControl,
   Grid,
   InputLabel,
   MenuItem,
   Select,
   Tab,
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableRow,
   TextField,
   Typography,
   useMediaQuery,
   useTheme,
} from '@mui/material';
import { DataGridPro, GridColDef, GridSortModel } from '@mui/x-data-grid-pro';
import { darkPurple } from 'colors';
import { Formik } from 'formik';
import router from 'next/router';
import numeral from 'numeral';
import React, { MouseEventHandler } from 'react';
import { Check } from 'react-feather';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
   selectAuthAllOperatorGamesWithTournament,
   selectAuthOperators,
   selectAuthTournamentV2,
   selectAuthUser,
} from 'redux/authSlice';
import { selectLoadingTournamentV2 } from 'redux/loadingSlice';
import { selectBoClient } from 'redux/socketSlice';
import {
   CustomMenuSortAscendingIcon,
   CustomMenuSortDescendingIcon,
   CustomMenuSortIcon,
   CustomNoRowsOverlay,
   PageWith3Toolbar,
   PageWith4Toolbar,
   PageWith5Toolbar,
   fetchJsonData,
} from 'services/globalFunctions';
import { hasDetailsPermission } from 'services/permissionHandler';
import { v4 as uuidv4 } from 'uuid';
import * as Yup from 'yup';
import CustomRow from './customRow';
import CustomRowReport from './customRowReport';
import {
   UseGetTournamentListQueryProps,
   useGetTournamentListV2Query,
   useSaveResultTournamentV2Mutation,
   useSendResultTournamentV2Mutation,
   useUpdateTournamentV2Mutation,
} from './lib/hooks/queries';
interface MappedData {
   opId: string;
   gameIds: string[];
}
export default function AllTournamentV2List(dataFilter: any) {
   const loadingTournament = useSelector(selectLoadingTournamentV2);
   const user = useSelector(selectAuthUser) as User;
   const [dataSort, setDataSort]: any = React.useState({
      to: -1,
   });
   const [paginationModel, setPaginationModel] = React.useState({
      pageSize: 50,
      page: 0,
   });
   const theme = useTheme();
   const [boxRefrech, setBoxRefrech] = React.useState(0);
   const post: UseGetTournamentListQueryProps = {
      title: dataFilter.title,
      gameId: dataFilter.gameId,
      tournamentId: dataFilter.tournamentId,
      sort: dataSort,
      limit: paginationModel.pageSize,
      page: paginationModel.page,
      refresh: boxRefrech,
      autoRefresh: dataFilter.autoRefresh,
   };
   const { isLoading } = useGetTournamentListV2Query(post);
   const data = useSelector(selectAuthTournamentV2);
   const boClient = useSelector(selectBoClient);

   const [dataAllOperatorGames, setDataAllOperatorGames] = React.useState<
      MappedData[]
   >([]);

   const dataAllOperatorGamesWithTournament = useSelector(
      selectAuthAllOperatorGamesWithTournament
   ) as {
      opId: string;
      gameId: string;
      statsFileUrl: string;
      tournamentId: string;
   }[];
   const [action, setAction] = React.useState(0);
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
   const isLgUp = useMediaQuery(theme.breakpoints.up('lg'));
   const [Transition, setTransition]: any = React.useState();
   const [openSendTournament, setOpenSendTournament] = React.useState(false);
   const [rowCountState, setRowCountState] = React.useState(data?.count || 0);
   const operators = useSelector(selectAuthOperators);
   const [openUpdateTournament, setOpenUpdateTournament] =
      React.useState(false);
   const [openSaveResultTournament, setOpenSaveResultTournament] =
      React.useState(false);
   const [openTournament, setOpenTournament] = React.useState(false);
   const [value, setValue] = React.useState('details');
   const [currentTournament, setCurrentTournament] = React.useState(
      {} as TournamentV2 | any
   );
   const [currentTournamentSearch, setCurrentTournamentSearch] = React.useState(
      currentTournament?.tournamentData as TournamentV2 | any
   );
   const [maxWidth, setMaxWidth] =
      React.useState<DialogProps['maxWidth']>('sm');
   const [fullWidth, setFullWidth] = React.useState(true);
   const [initialValuesSendTournament, setInitialValuesSendTournament] =
      React.useState({
         tournamentId: '',
         opIds: [] as string[],
      });
   const [checked, setChecked] = React.useState(false);
   const [searchText, setSearchText] = React.useState('');

   const Actions = (data: TournamentV2) => {
      let actiondata: {
         value: string;
         label: React.ReactElement | string;
         onClick?: MouseEventHandler<any> | undefined;
         disabled?: boolean;
      }[] = [
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
                  Edit
               </Typography>
            ),
            onClick: () =>
               router.push(`/v2-Tournament/details?id=${data.tournamentId}`),
         },
      ];

      if (
         hasDetailsPermission(
            UserPermissionEvent.BACKOFFICE_UPDATE_TOURNAMENT_V2_REQ
         )
      ) {
         actiondata.push({
            value: '3',
            label: (
               <Typography
                  variant="bodySmallBold"
                  sx={{
                     svg: { position: 'relative', top: '3px', mr: '15px' },
                     flex: 1,
                  }}
               >
                  Update
               </Typography>
            ),
            onClick: () => handleOpenUpdateTournament(data),
         });
      }
      if (
         hasDetailsPermission(
            UserPermissionEvent.BACKOFFICE_SEND_TOURNAMENT_V2_RESULT_REQ
         )
      ) {
         actiondata.push({
            value: '4',
            label: (
               <Typography
                  variant="bodySmallBold"
                  sx={{
                     svg: { position: 'relative', top: '3px', mr: '15px' },
                     flex: 1,
                  }}
               >
                  Send Result
               </Typography>
            ),
            onClick: () => handleClickSendTournamentOpen(data),
         });
      }
      if (
         hasDetailsPermission(
            UserPermissionEvent.BACKOFFICE_SAVE_TOURNAMENT_V2_RESULT_REQ
         )
      ) {
         actiondata.push({
            value: '5',
            label: (
               <Typography
                  variant="bodySmallBold"
                  sx={{
                     svg: { position: 'relative', top: '3px', mr: '15px' },
                     flex: 1,
                  }}
               >
                  Save Result
               </Typography>
            ),
            onClick: () => handleOpenSaveTournamentResult(data),
         });
      }
      return actiondata;
   };

   const columns: GridColDef[] = [
      {
         field: 'tournamentId',
         headerName: 'ID',
         renderCell: (params) =>
            params &&
            params.value && (
               <PortalCopyValue value={params.value} hideText tooltip={true} />
            ),
         width: 50,
         hideable: false,
         filterable: false,
      },
      {
         field: 'title',
         headerAlign: 'center',
         align: 'center',
         headerName: 'Title',
         renderCell: (params) => params && params.value,
         minWidth: 100,
         flex: 1,
         sortable: false,
      },
      {
         field: 'description',
         headerName: 'URL',
         headerAlign: 'center',
         align: 'center',
         renderCell: (params) => (
            <PortalCopyValue
               value={`https://tournament.imoon.com/stats/${params.row?.tournamentId}-v2.json`}
               href={`https://tournament.imoon.com/stats/${params.row?.tournamentId}-v2.json`}
               sx={{
                  maxWidth: '230px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
               }}
               target="_blank"
               isVisible={true}
            />
         ),
         minWidth: 250,
         hideable: false,
         flex: 1,
         sortable: false,
      },
      {
         field: 'from',
         headerName: 'From',
         headerAlign: 'center',
         align: 'center',
         renderCell: (params) =>
            params && params.value && renderTimeCell(params.value),
         minWidth: 120,
         hideable: false,
         flex: 1,
         sortable: false,
      },
      {
         field: 'to',
         headerName: 'To',
         headerAlign: 'center',
         align: 'center',
         renderCell: (params) =>
            params && params.value && renderTimeCell(params.value),
         minWidth: 120,
         flex: 1,
         sortable: false,
      },
      {
         field: 'winnersCount',
         headerAlign: 'center',
         align: 'center',
         type: 'number',
         headerName: 'Winners Count',
         renderCell: (params) =>
            numeral(params.row?.winnersCount).format('0,00.[00]'),
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
            params.row?.from && (
               <Box
                  onClick={() => handleOpenTournament(params.row)}
                  sx={{ cursor: 'pointer' }}
               >
                  {renderStatusTournamentCell(params.row?.from, params.row?.to)}
               </Box>
            ),
         minWidth: 100,
         flex: 1,
         sortable: false,
      },
   ];
   if (
      hasDetailsPermission(UserPermissionEvent.BACKOFFICE_SET_TOURNAMENT_REQ)
   ) {
      columns.push({
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
            );
         },
         width: 10,
         sortable: false,
         filterable: false,
         disableColumnMenu: true,
      });
   }

   const { mutate: mutateUpdate } = useUpdateTournamentV2Mutation({
      onSuccess: () => {
         toast.success('You Update the tournament successfully', {
            position: toast.POSITION.TOP_CENTER,
         });
         handleCloseUpdateTournament();
         setBoxRefrech(boxRefrech + 1);
      },
      onError(error, variables, context) {
         const dataRows: any[] = [];
      },
   });

   const { mutate: mutateSendResult } = useSendResultTournamentV2Mutation({
      onSuccess: () => {
         toast.success('You send the result of tournament successfully', {
            position: toast.POSITION.TOP_CENTER,
         });
         handleCloseSendTournament();
         setBoxRefrech(boxRefrech + 1);
      },
      onError(error, variables, context) {
         const dataRows: any[] = [];
      },
   });

   const { mutate: mutateSaveResult } = useSaveResultTournamentV2Mutation({
      onSuccess: () => {
         toast.success('You save the tournament result successfully', {
            position: toast.POSITION.TOP_CENTER,
         });
         handleCloseSaveTournamentResult();
         setBoxRefrech(boxRefrech + 1);
      },
      onError(error, variables, context) {
         const dataRows: any[] = [];
      },
   });

   const handleOpenTournament = (tournament: TournamentV2) => {
      fetchJsonData(
         `https://tournament.imoon.com/stats/${tournament.tournamentId}-v2.json`
      )
         .then((data) => {
            setCurrentTournament(data);
            setCurrentTournamentSearch(data?.tournamentData);
            setTransition(TransitionSlide);
            setOpenTournament(true);
            if (
               hasDetailsPermission(
                  UserPermissionEvent.BACKOFFICE_GET_ALL_OPERATOR_GAMES_WITH_TOURNAMENT_REQ
               )
            ) {
               boClient?.tournamentV2.getAllOperatorGamesWithTournament(
                  {
                     tournamentId: data.tournamentId,
                  },
                  {
                     uuid: uuidv4(),
                     meta: {
                        ts: new Date(),
                        type: 'tournament',
                        sessionId: sessionStorage.getItem('sessionId'),
                        event: UserPermissionEvent.BACKOFFICE_GET_ALL_OPERATOR_GAMES_WITH_TOURNAMENT_REQ,
                     },
                  }
               );
            }
         })
         .catch((error) => {
            toast.error(error.message || 'An error occurred', {
               position: toast.POSITION.TOP_CENTER,
            });
         });

      setValue('details');
   };

   const handleCloseTournamentDetails = () => {
      setOpenTournament(false);
   };

   const handleChange = (event: React.SyntheticEvent, newValue: string) => {
      setValue(newValue);
   };

   const handleCopyButtonClick = (json: {}) => {
      const data = JSON.stringify(json, null, 2);
      navigator.clipboard.writeText(data);
      setChecked(true);
      setTimeout(() => setChecked(false), 1000);
   };

   const handleSortModelChange = React.useCallback(
      (sortModel: GridSortModel) => {},
      []
   );

   const handleOpenUpdateTournament = (data: TournamentV2 | any) => {
      setCurrentTournament(data);
      setCurrentTournamentSearch(data?.tournamentData);
      setOpenUpdateTournament(true);
   };

   const handleCloseUpdateTournament = () => {
      setOpenUpdateTournament(false);
   };

   const handleOpenSaveTournamentResult = (data: TournamentV2 | any) => {
      setCurrentTournament(data);
      setCurrentTournamentSearch(data?.tournamentData);
      setOpenSaveResultTournament(true);
   };

   const handleCloseSaveTournamentResult = () => {
      setOpenSaveResultTournament(false);
   };

   const handleClickSendTournamentOpen = (data: TournamentV2) => {
      setTransition(TransitionSlide);
      setOpenSendTournament(true);
      setInitialValuesSendTournament({
         tournamentId: data.tournamentId,
         opIds: [] as string[],
      });
   };

   const handleCloseSendTournament = async () => {
      await setTransition(TransitionSlide);
      setOpenSendTournament(false);
   };

   const handleUpdateTournament = (dto: UpdateTournamentV2Dto) => {
      mutateUpdate({ dto });
   };

   const handleSubmitMethodsSendTournament = React.useCallback(
      (dto: SendTournamentV2ResultDto) => {
         mutateSendResult({ dto });
      },
      [mutateSendResult]
   );

   const handleSaveTournamentResult = (dto: SaveTournamentV2ResultDto) => {
      mutateSaveResult({ dto });
   };

   const handleSubmitSendTournament = React.useCallback(
      (tournament: { tournamentId: string; opIds: string[] }) => {
         const dto: SendTournamentResultDto = {
            tournamentId: tournament.tournamentId,
            opIds: tournament.opIds,
         };
         handleSubmitMethodsSendTournament(dto);
      },
      []
   );

   React.useEffect(() => {
      setRowCountState((prevRowCountState: any) =>
         data?.count !== undefined ? data?.count : prevRowCountState
      );
   }, [data?.count, setRowCountState]);

   React.useEffect(() => {
      const result: Record<string, MappedData> = {};
      if (dataAllOperatorGamesWithTournament) {
         for (const entry of dataAllOperatorGamesWithTournament) {
            const { opId, gameId } = entry;

            if (!result[opId]) {
               result[opId] = { opId, gameIds: [] };
            }

            if (!result[opId].gameIds.includes(gameId)) {
               result[opId].gameIds.push(gameId);
            }
         }
         setDataAllOperatorGames(
            result ? (Object.values(result) as MappedData[]) : []
         );
      }
   }, [dataAllOperatorGamesWithTournament]);
   return (
      <Box
         key={boxRefrech}
         className="dataGridWrapper"
         mb={'0px'}
         p={isLgUp ? '12px' : '6px'}
         pt={0}
         sx={{
            height: isDesktop ? PageWith3Toolbar : PageWith4Toolbar,
            width: isDesktop ? 'calc(100vw - 225px)' : '100%',
         }}
      >
         <DataGridPro
            disableVirtualization
            rowHeight={isDesktop ? 44 : 30}
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
            onSortModelChange={handleSortModelChange}
            loading={loadingTournament || isLoading}
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
            open={openSendTournament}
            TransitionComponent={Transition}
            keepMounted
            sx={{ '.MuiPaper-root': { p: '12px 4px!important' } }}
            fullScreen
            aria-describedby="alert-dialog-slide-description"
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
                  <Typography variant="h5" gutterBottom display="inline" mb={0}>
                     Send tournament result
                  </Typography>
               </Grid>
               <Grid item xs></Grid>
               <Grid item>
                  <FontAwesomeIcon
                     icon={faRectangleXmark as IconProp}
                     onClick={handleCloseSendTournament}
                     cursor={'pointer'}
                  />
               </Grid>
            </Grid>
            <DialogContent
               sx={{
                  p: 1,
                  '.MuiPaper-root': {
                     p: '0 !important',
                  },
               }}
            >
               <Formik
                  initialValues={initialValuesSendTournament}
                  enableReinitialize={true}
                  validationSchema={Yup.object().shape({
                     opIds: Yup.array().required('opIds is required'),
                  })}
                  onSubmit={handleSubmitSendTournament}
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
                     setFieldValue,
                  }) => (
                     <form
                        noValidate
                        autoComplete="off"
                        onSubmit={handleSubmit}
                     >
                        {hasDetailsPermission(
                           UserPermissionEvent.BACKOFFICE_OPERATOR_LIST_REQ
                        ) && (
                           <>
                              <FormControl
                                 sx={{
                                    width: '100%',
                                 }}
                              >
                                 <InputLabel id="demo-simple-select-disabled-label">
                                    Operators
                                 </InputLabel>
                                 <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Operators"
                                    sx={{
                                       width: '100%',
                                    }}
                                    multiple
                                    value={values.opIds}
                                    name="opIds"
                                    IconComponent={(_props) => {
                                       return (
                                          <FontAwesomeIcon
                                             icon={faAngleDown as IconProp}
                                             size="sm"
                                             className="selectIcon"
                                          />
                                       );
                                    }}
                                    onChange={(e) => {
                                       handleChange(e);
                                    }}
                                 >
                                    {operators &&
                                       operators.operators?.map(
                                          (item, index: number) => {
                                             return (
                                                <MenuItem
                                                   key={`operators${index}`}
                                                   value={item.opId}
                                                >
                                                   {item.opId}-{item.title}
                                                </MenuItem>
                                             );
                                          }
                                       )}
                                 </Select>
                              </FormControl>
                           </>
                        )}
                        <DialogActions>
                           <Button
                              onClick={handleCloseSendTournament}
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

         <Dialog
            open={openUpdateTournament}
            aria-labelledby="form-dialog-title"
            maxWidth={maxWidth}
            fullWidth={fullWidth}
            sx={{
               p: '12px !important',
               '.MuiPaper-root': {
                  m: 'auto',
                  borderRadius: '8px',
               },
            }}
         >
            <DialogTitle id="form-dialog-title">Update Tournament</DialogTitle>
            <DialogContent>
               <DialogContentText id="alert-dialog-description">
                  Are you sure you want to update the tournament?
               </DialogContentText>
            </DialogContent>
            <DialogActions>
               <Button
                  onClick={handleCloseUpdateTournament}
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
                     const post: UpdateTournamentV2Dto = {
                        tournamentId: currentTournament.tournamentId,
                     };
                     handleUpdateTournament(post);
                  }}
               >
                  Confirm
               </Button>
            </DialogActions>
         </Dialog>

         <Dialog
            open={openSaveResultTournament}
            aria-labelledby="form-dialog-title"
            maxWidth={maxWidth}
            fullWidth={fullWidth}
            sx={{
               p: '12px !important',
               '.MuiPaper-root': {
                  m: 'auto',
                  borderRadius: '8px',
               },
            }}
         >
            <DialogTitle id="form-dialog-title">Save Result</DialogTitle>
            <DialogContent>
               <DialogContentText id="alert-dialog-description">
                  Are you sure you want to save the tournament result?
               </DialogContentText>
            </DialogContent>
            <DialogActions>
               <Button
                  onClick={handleCloseSaveTournamentResult}
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
                     const post: SaveTournamentV2ResultDto = {
                        tournamentId: currentTournament.tournamentId,
                     };
                     handleSaveTournamentResult(post);
                  }}
               >
                  Confirm
               </Button>
            </DialogActions>
         </Dialog>

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
                  '.MuiPaper-root': {
                     maxWidth: isDesktop ? '775px' : '100%',
                  },
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
                        spacing={0.5}
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
                              {hasDetailsPermission(
                                 UserPermissionEvent.BACKOFFICE_GET_ALL_OPERATOR_GAMES_WITH_TOURNAMENT_REQ
                              ) &&
                                 currentTournament?.tournamentId && (
                                    <Tab label="Operators" value={'reports'} />
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
                                 handleCopyButtonClick(currentTournament);
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
                        {value === 'winners' && (
                           <Grid item>
                              <TextField
                                 label="Search"
                                 type="search"
                                 value={searchText}
                                 fullWidth
                                 autoComplete="off"
                                 onChange={(e) => {
                                    setSearchText(e.target.value);
                                    if (e.target.value !== '') {
                                       setCurrentTournamentSearch(
                                          currentTournament?.tournamentData?.filter(
                                             (item: any) =>
                                                item.playerId.includes(
                                                   e.target.value
                                                ) ||
                                                item.opId.includes(
                                                   e.target.value
                                                ) ||
                                                item.nickname.includes(
                                                   e.target.value
                                                )
                                          )
                                       );
                                    } else {
                                       setCurrentTournamentSearch(
                                          currentTournament?.tournamentData
                                       );
                                    }
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
                                                currency: string;
                                                minBetAmount: number;
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
                                 '.MuiTableBody-root .MuiTableRow-root>th': {
                                    padding: '5px',
                                 },
                                 'tr th,tr td': {
                                    borderRadius: '0 !important',
                                    borderBottomLeftRadius: '0 !important',
                                 },

                                 '.topHead tr th:first-child': {
                                    borderTopLeftRadius: '8px !important',
                                 },
                                 '.topHead tr th:last-child': {
                                    borderTopRightRadius: '8px !important',
                                 },
                              }}
                           >
                              <TableHead className="topHead">
                                 <TableRow>
                                    <TableCell
                                       sx={{ width: '50px !important' }}
                                       component="th"
                                       scope="row"
                                    >
                                       Rank
                                    </TableCell>
                                    <TableCell
                                       component="th"
                                       scope="row"
                                       sx={{ textAlign: 'center !important' }}
                                    >
                                       Player ID
                                    </TableCell>
                                    <TableCell
                                       component="th"
                                       scope="row"
                                       sx={{ textAlign: 'left !important' }}
                                    >
                                       Nickname
                                    </TableCell>
                                    {[
                                       UserScope.SUPERADMIN,
                                       UserScope.ADMIN,
                                    ].includes(user?.scope) && (
                                       <TableCell
                                          component="th"
                                          scope="row"
                                          sx={{
                                             textAlign: 'center !important',
                                          }}
                                       >
                                          Operator
                                       </TableCell>
                                    )}
                                    <TableCell
                                       component="th"
                                       sx={{ textAlign: 'center !important' }}
                                       scope="row"
                                    >
                                       Win Odds
                                    </TableCell>
                                    <TableCell
                                       component="th"
                                       scope="row"
                                       sx={{ textAlign: 'center !important' }}
                                    >
                                       Prizes
                                    </TableCell>
                                    <TableCell
                                       component="th"
                                       sx={{ width: '50px !important' }}
                                    />
                                 </TableRow>
                              </TableHead>
                              <TableBody>
                                 {currentTournament?.tournamentData &&
                                    currentTournament?.tournamentData.length >
                                       0 &&
                                    currentTournament?.tournamentData?.map(
                                       (item: any, index: number) =>
                                          currentTournamentSearch?.findIndex(
                                             (itemSearch: any) =>
                                                itemSearch.playerId ===
                                                item.playerId
                                          ) > -1 && (
                                             <CustomRow
                                                key={item.playerId}
                                                row={{ ...item, index: index }}
                                             />
                                          )
                                    )}
                              </TableBody>
                           </Table>
                        </Grid>
                     </TabPanel>
                     <TabPanel
                        value={'reports'}
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
                                 '.MuiTableBody-root .MuiTableRow-root>th': {
                                    padding: '5px',
                                 },
                                 'tr th,tr td': {
                                    borderRadius: '0 !important',
                                    borderBottomLeftRadius: '0 !important',
                                 },

                                 '.topHead tr th:first-child': {
                                    borderTopLeftRadius: '8px !important',
                                 },
                                 '.topHead tr th:last-child': {
                                    borderTopRightRadius: '8px !important',
                                 },
                              }}
                           >
                              <TableHead className="topHead">
                                 <TableRow>
                                    {[
                                       UserScope.SUPERADMIN,
                                       UserScope.ADMIN,
                                    ].includes(user?.scope) && (
                                       <TableCell
                                          component="th"
                                          scope="row"
                                          sx={{
                                             textAlign: 'left !important',
                                          }}
                                       >
                                          Operator
                                       </TableCell>
                                    )}
                                    <TableCell
                                       component="th"
                                       scope="row"
                                       sx={{ textAlign: 'left !important' }}
                                    >
                                       Visible in Games
                                    </TableCell>
                                 </TableRow>
                              </TableHead>
                              <TableBody>
                                 {dataAllOperatorGames &&
                                    dataAllOperatorGames.length > 0 &&
                                    dataAllOperatorGames?.map(
                                       (item: MappedData, index: number) => (
                                          <CustomRowReport
                                             key={`${item.opId}`}
                                             row={{ ...item, index: index }}
                                          />
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
   );
}

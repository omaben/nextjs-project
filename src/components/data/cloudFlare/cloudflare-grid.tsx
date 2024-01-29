import SelectTheme from '@/components/SelectTheme';
import GridStyle from '@/components/custom/GridStyle';
import TransitionSlide from '@/components/custom/TransitionSlide';
import { DnsRecord, UserPermissionEvent } from '@alienbackoffice/back-front';
import { DeleteDnsRecordDto } from '@alienbackoffice/back-front/lib/devops/dto/delete-dns-record.dto';
import { UpdateDnsRecordDto } from '@alienbackoffice/back-front/lib/devops/dto/update-dns-record.dto';
import { DnsRecordType } from '@alienbackoffice/back-front/lib/devops/enum/dns-record-type.enum';
import { SortDirection } from '@alienbackoffice/back-front/lib/lib/dto/pagination.dto';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
   faAngleDown,
   faBan,
   faCheck,
   faRectangleXmark,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
   Box,
   Button,
   Checkbox,
   Dialog,
   DialogActions,
   DialogContent,
   DialogContentText,
   DialogProps,
   DialogTitle,
   FormControl,
   FormControlLabel,
   Grid,
   IconButton,
   InputLabel,
   MenuItem,
   Select,
   Stack,
   TextField,
   Tooltip,
   Typography,
   useMediaQuery,
   useTheme,
} from '@mui/material';
import {
   DataGridPro,
   GridColDef,
   GridColumnVisibilityModel,
   GridSortModel,
} from '@mui/x-data-grid-pro';
import { darkPurple, red } from 'colors';
import { Field, Formik } from 'formik';
import React, { MouseEventHandler } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { selectAuthDnsRecordList } from 'redux/authSlice';
import { selectloadingDnsRecordList } from 'redux/loadingSlice';
import {
   CustomMenuSortAscendingIcon,
   CustomMenuSortDescendingIcon,
   CustomMenuSortIcon,
   CustomNoRowsOverlay,
   PageWith4Toolbar,
} from 'services/globalFunctions';
import { hasDetailsPermission } from 'services/permissionHandler';
import * as Yup from 'yup';
import {
   useDeleteDNSMutation,
   useGetDnsRecordListQuery,
   useGetDnsRecordListQueryProps,
   useUpdateDNSMutation,
} from './lib/hooks/queries';
import { green } from '@mui/material/colors';
import PortalCopyValue from '@/components/custom/PortalCopyValue';

export default function CloudFlareData(dataFilter: {
   name?: string;
   autoRefresh: number;
}) {
   const theme = useTheme();
   const loadingCloudFlareList = useSelector(selectloadingDnsRecordList);
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
   const isLgUp = useMediaQuery(theme.breakpoints.up('lg'));
   const [Transition, setTransition]: any = React.useState();
   const [open, setOpen] = React.useState(false);
   const [currentData, setCurrentData] = React.useState({} as DnsRecord);
   const [maxWidth, setMaxWidth] =
      React.useState<DialogProps['maxWidth']>('sm');
   const [fullWidth, setFullWidth] = React.useState(true);
   const data = useSelector(selectAuthDnsRecordList) as {
      count: number;
      dnsRecords: DnsRecord[];
   };
   // const data = {
   //    count: 1,
   //    dnsRecords: [
   //       {
   //          comment: 'test aaaaaaaaa sdddddddddddddddddddddddddddddddd',
   //          content: 'test',
   //          id: '222',
   //          name: 'testaaaa',
   //          proxied: false,
   //          locked: false,
   //          updatedAt: 444444444,
   //          createdAt: 444444444,
   //          ttl: 1,
   //          tags: [],
   //          zoneId: '1',
   //          type: DnsRecordType.A,
   //          proxiable: false,
   //          zoneName: 'test',
   //          meta: {},
   //       },
   //       {
   //          comment: 'test',
   //          content: 'test',
   //          id: '222555',
   //          name: 'test',
   //          proxied: false,
   //          locked: false,
   //          updatedAt: 444444444,
   //          createdAt: 444444444,
   //          ttl: 200,
   //          tags: [],
   //          zoneId: '1',
   //          type: DnsRecordType.CNAME,
   //          proxiable: false,
   //          zoneName: 'test',
   //          meta: {},
   //       },
   //    ],
   // } as {
   //    count: number;
   //    dnsRecords: DnsRecord[];
   // };
   const [paginationModel, setPaginationModel] = React.useState({
      pageSize: 50,
      page: 0,
   });
   const [columnVisibilityModel, setColumnVisibilityModel] =
      React.useState<GridColumnVisibilityModel>({});
   const [dataSort, setDataSort] = React.useState<{
      readonly name?: SortDirection;
   }>({
      name: 1,
   });
   const [rowCountState, setRowCountState] = React.useState(data?.count || 0);
   const [openDeleteDNS, setOpenDeleteDNS] = React.useState(false);

   const [action, setAction] = React.useState(0);

   const Actions = (data: DnsRecord) => {
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
      ];
      if (
         hasDetailsPermission(
            UserPermissionEvent.BACKOFFICE_UPDATE_DNS_RECORD_REQ
         )
      ) {
         actiondata.push({
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
            onClick: () => {
               handleOpenUpdateDNS(data);
            },
         });
      }
      if (
         hasDetailsPermission(
            UserPermissionEvent.BACKOFFICE_DELETE_DNS_RECORD_REQ
         )
      ) {
         actiondata.push({
            value: '2',
            label: (
               <Typography
                  variant="bodySmallBold"
                  sx={{
                     svg: { position: 'relative', top: '3px', mr: '15px' },
                     flex: 1,
                  }}
               >
                  Delete
               </Typography>
            ),
            onClick: () => {
               handleOpenDeleteDNS(data);
            },
         });
      }
      return actiondata;
   };

   const columns: GridColDef[] = [
      {
         field: 'type',
         headerName: 'Type',
         renderCell: (params) => params.value,
         minWidth: 100,
         flex: 1,
         hideable: false,
         filterable: false,
      },
      {
         field: 'name',
         headerName: 'Name',
         renderCell: (params) => params.value,
         minWidth: 100,
         flex: 1,
         hideable: false,
         filterable: false,
         sortable: false,
         headerAlign: 'left',
         align: 'left',
      },
      {
         field: 'content',
         headerName: 'Content',
         renderCell: (params) => params.value,
         minWidth: 100,
         flex: 1,
         hideable: false,
         filterable: false,
         sortable: false,
         headerAlign: 'left',
         align: 'left',
      },
      {
         field: 'proxied',
         headerName: 'Proxy Status',
         renderCell: (params) => {
            return (
               <IconButton
                  sx={{
                     position: 'relative',
                     svg: {
                        height: '16px',
                        width: '16px',
                     },
                     color: params.value
                        ? `${green[500]} !important`
                        : `${red[2]} !important`,
                     cursor: 'default',
                     '&:hover': {
                        background: 'initial',
                     },
                  }}
               >
                  {params.value ? (
                     <FontAwesomeIcon icon={faCheck as IconProp} />
                  ) : (
                     <FontAwesomeIcon icon={faBan as IconProp} />
                  )}
               </IconButton>
            );
         },
         minWidth: 100,
         flex: 1,
         hideable: false,
         filterable: false,
         sortable: false,
         headerAlign: 'left',
         align: 'left',
      },
      {
         field: 'ttl',
         headerName: 'TTL',
         renderCell: (params) => params.value,
         minWidth: 100,
         flex: 1,
         hideable: false,
         filterable: false,
         sortable: false,
         headerAlign: 'left',
         align: 'left',
      },
      {
         field: 'comment',
         headerName: 'Comment',
         renderCell: (params) => (
            <Box px={0.5} lineHeight={1.2} sx={{ width: '100%' }}>
               <PortalCopyValue
                  value={params.value}
                  isVisible={true}
                  sx={{
                     '.MuiTypography-root': {
                        fontSize: 10,
                        fontFamily: 'Nunito Sans SemiBold',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        maxWidth: 'calc(100% - 20px)',
                     },
                  }}
               />
            </Box>
         ),
         minWidth: 120,
         flex: 1,
         hideable: false,
         filterable: false,
         sortable: false,
         headerAlign: 'left',
         align: 'left',
      },
   ];
   if (
      hasDetailsPermission(
         UserPermissionEvent.BACKOFFICE_UPDATE_DNS_RECORD_REQ
      ) ||
      hasDetailsPermission(UserPermissionEvent.BACKOFFICE_DELETE_DNS_RECORD_REQ)
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
         sortable: false,
         filterable: false,
         disableColumnMenu: true,
         width: 10,
         align: 'right',
      });
   }

   const post: useGetDnsRecordListQueryProps = {
      limit: paginationModel.pageSize,
      page: paginationModel.page,
      sort: dataSort,
      name: dataFilter.name,
      autoRefresh: dataFilter.autoRefresh,
   };

   useGetDnsRecordListQuery(post);

   const handleSortModelChange = React.useCallback(
      (sortModel: GridSortModel) => {
         const fieldName = sortModel[0].field;
         let data = {};
         fieldName === 'name'
            ? (data = {
                 name: sortModel[0].sort === 'asc' ? 1 : -1,
              })
            : (data = {
                 name: sortModel[0].sort === 'asc' ? 1 : -1,
              });
         setDataSort(data);
      },
      []
   );

   // Handle opening the main dialog
   const handleOpenUpdateDNS = (data: DnsRecord) => {
      setTransition(TransitionSlide);
      setCurrentData(data);
      setOpen(true);
   };

   // Handle closing the delete DNS dialog
   const handleCloseDeleteDNS = () => {
      setOpenDeleteDNS(false);
   };

   // Handle open the delete DNS dialog
   const handleOpenDeleteDNS = (data: DnsRecord) => {
      setCurrentData(data);
      setOpenDeleteDNS(true);
   };

   // Handle closing the update DNS dialog
   const handleCloseDNS = () => {
      setOpen(false);
   };

   // Mutation hook for update a DNS record
   const { mutate } = useUpdateDNSMutation({
      onSuccess: () => {
         handleCloseDNS();
      },
      onError(error, variables, context) {
         handleCloseDNS();
         toast.error(error, {
            position: toast.POSITION.TOP_CENTER,
         });
      },
   });

   // Mutation hook for delete a DNS record
   const { mutate: mutateDeleteDNS } = useDeleteDNSMutation({
      onSuccess: () => {
         handleCloseDeleteDNS();
      },
      onError(error, variables, context) {
         handleCloseDeleteDNS();
         toast.error(error, {
            position: toast.POSITION.TOP_CENTER,
         });
      },
   });

   const handleSubmitUpdateDns = React.useCallback(
      (dtoData: {
         id: string;
         type: DnsRecordType;
         name: string;
         content: string;
         proxied?: boolean;
         comment?: string;
         tags?: string;
         ttl: boolean;
         ttlValue: number;
      }) => {
         const dto: UpdateDnsRecordDto = {
            id: dtoData.id,
            type: dtoData.type,
            content: dtoData.content,
            name: dtoData.name,
            proxied: dtoData.proxied,
            ttl: dtoData.ttl ? 1 : dtoData.ttlValue,
         };
         if (dtoData.tags) {
            dto.tags = dtoData.tags.split(/\r?\n/);
         }
         if (dtoData.comment) {
            dto.comment = dtoData.comment;
         }

         mutate({ dto });
      },
      [mutate]
   );

   const handleDeleteDNS = React.useCallback(
      (dto: DeleteDnsRecordDto) => {
         mutateDeleteDNS({ dto });
      },
      [mutateDeleteDNS]
   );

   React.useEffect(() => {
      setRowCountState((prevRowCountState: number) =>
         data?.count !== undefined ? data?.count : prevRowCountState
      );
   }, [data?.count, setRowCountState]);

   return (
      <Box
         className="dataGridWrapper"
         mb={'0px'}
         px={isLgUp ? '12px' : '4px'}
         py={'6px'}
         pt={isDesktop ? '4px' : '6px'}
         sx={{
            height: PageWith4Toolbar,
            width: isDesktop ? 'calc(100vw - 225px)' : '100%',
         }}
      >
         <DataGridPro
            disableVirtualization
            sx={GridStyle}
            rowHeight={isDesktop ? 44 : 30}
            getRowId={(row) => row.id}
            rows={data?.dnsRecords || []}
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
            columnVisibilityModel={columnVisibilityModel}
            onColumnVisibilityModelChange={(newModel) =>
               setColumnVisibilityModel(newModel)
            }
            loading={loadingCloudFlareList}
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

         {/* dialog for update DNS */}
         <Dialog
            open={open}
            fullScreen
            TransitionComponent={Transition}
            keepMounted
            aria-labelledby="form-dialog-title"
            sx={{
               '.MuiDialog-container': {
                  alignItems: 'end',
                  justifyContent: 'end',
               },
               '.MuiPaper-root': {
                  width: '600px',
                  padding: '5px',
                  p: '12px 4px!important',
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
                     Edit DNS Record
                  </Typography>
               </Grid>
               <Grid item xs></Grid>
               <Grid item>
                  <FontAwesomeIcon
                     icon={faRectangleXmark as IconProp}
                     onClick={handleCloseDNS}
                  />
               </Grid>
            </Grid>
            <DialogContent
               sx={{
                  p: 1,
                  '.MuiButtonBase-root': {
                     p: 0,
                  },
               }}
            >
               <Formik
                  initialValues={{
                     id: currentData.id,
                     type: currentData.type as DnsRecordType,
                     name: currentData.name || '',
                     content: currentData.content || '',
                     proxied: currentData.proxied,
                     comment: currentData.comment || '',
                     tags: currentData.tags?.join('\n') || '',
                     ttl: currentData.ttl === 1 ? true : false,
                     ttlValue: currentData.ttl,
                  }}
                  enableReinitialize={true}
                  validationSchema={Yup.object().shape({
                     type: Yup.string().required('Type  is required'),
                     name: Yup.string().required('name  is required'),
                     content: Yup.string().required('content  is required'),
                     ttlValue: Yup.number().required('ttl  is required'),
                  })}
                  onSubmit={(values, { resetForm }) => {
                     handleSubmitUpdateDns(values);
                     setTimeout(() => {
                        resetForm();
                     }, 1500);
                  }}
               >
                  {({
                     errors,
                     resetForm,
                     handleBlur,
                     handleChange,
                     handleSubmit,
                     isSubmitting,
                     touched,
                     values,
                     status,
                  }) => (
                     <form noValidate onSubmit={handleSubmit}>
                        <FormControl fullWidth>
                           <InputLabel id="demo-simple-select-disabled-label">
                              Type
                           </InputLabel>
                           <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              label="Type"
                              fullWidth
                              value={values.type}
                              name="type"
                              onChange={handleChange}
                              IconComponent={(_props) => {
                                 return (
                                    <FontAwesomeIcon
                                       icon={faAngleDown as IconProp}
                                       size="sm"
                                       className="selectIcon"
                                    />
                                 );
                              }}
                           >
                              {Object.values(DnsRecordType).map(
                                 (item: any, index: number) => {
                                    return (
                                       <MenuItem
                                          key={`type${index}`}
                                          value={item}
                                       >
                                          <Stack
                                             direction="row"
                                             alignItems="center"
                                             gap={2}
                                          >
                                             {item}
                                          </Stack>
                                       </MenuItem>
                                    );
                                 }
                              )}
                           </Select>
                        </FormControl>
                        <TextField
                           name="name"
                           label="Name"
                           value={values.name}
                           error={Boolean(touched.name && errors.name)}
                           fullWidth
                           helperText={touched.name && errors.name}
                           onBlur={handleBlur}
                           onChange={handleChange}
                           variant="outlined"
                        />
                        <TextField
                           name="content"
                           label={
                              values.type === DnsRecordType.A
                                 ? 'IPv4 address'
                                 : values.type === DnsRecordType.CNAME
                                 ? 'Target'
                                 : 'Content'
                           }
                           value={values.content}
                           error={Boolean(touched.content && errors.content)}
                           fullWidth
                           helperText={touched.content && errors.content}
                           onBlur={handleBlur}
                           onChange={handleChange}
                           variant="outlined"
                        />
                        {/* {values.type === DnsRecordType.CNAME && (
                           <FormControl
                              sx={{
                                 width: '100%',
                                 '.errorInput': {
                                    color: (props) => props.palette.error.main,
                                    ml: '14px',
                                    fontSize: '0.75rem',
                                 },
                                 textarea: {
                                    paddingTop: '0 !important',
                                    marginTop: '12px',
                                 },
                                 '.MuiInputBase-root': {
                                    paddingRight: '5px !important',
                                 },
                              }}
                           >
                              <TextField
                                 name="tags"
                                 label="tags"
                                 value={values.tags}
                                 error={Boolean(touched.tags && errors.tags)}
                                 multiline
                                 rows={3}
                                 InputLabelProps={{
                                    sx: {
                                       position: 'absolute',
                                       top: '-8px',
                                       zIndex: 2,
                                    }, // Adjust top and zIndex as needed
                                 }}
                                 fullWidth
                                 helperText={touched.tags && errors.tags}
                                 onBlur={handleBlur}
                                 onChange={handleChange}
                                 variant="outlined"
                              />
                           </FormControl>
                        )} */}
                        <FormControl
                           sx={{
                              width: '100%',
                              '.errorInput': {
                                 color: (props) => props.palette.error.main,
                                 ml: '14px',
                                 fontSize: '0.75rem',
                              },
                              textarea: {
                                 paddingTop: '0 !important',
                                 marginTop: '12px',
                              },
                              '.MuiInputBase-root': {
                                 paddingRight: '5px !important',
                              },
                           }}
                        >
                           <TextField
                              name="comment"
                              label="Comment"
                              value={values.comment}
                              error={Boolean(touched.comment && errors.comment)}
                              fullWidth
                              helperText={touched.comment && errors.comment}
                              onBlur={handleBlur}
                              onChange={handleChange}
                              variant="outlined"
                              rows={3}
                              multiline
                           />
                        </FormControl>
                        {[DnsRecordType.A, DnsRecordType.CNAME].includes(
                           values.type
                        ) && (
                           <FormControl
                              variant="standard"
                              fullWidth
                              sx={{
                                 width: 'fit-content',
                                 paddingRight: 5,
                                 '.MuiCheckbox-root': {
                                    paddingLeft: 0,
                                 },
                              }}
                           >
                              <Field
                                 type="checkbox"
                                 name="proxied"
                                 value={values.proxied}
                                 as={FormControlLabel}
                                 control={<Checkbox checked={values.proxied} />}
                                 label={'Proxied'}
                              />
                           </FormControl>
                        )}

                        <FormControl
                           variant="standard"
                           fullWidth
                           sx={{
                              width: 'fit-content',
                              '.MuiCheckbox-root': {
                                 paddingLeft: 0,
                              },
                           }}
                        >
                           <Field
                              type="checkbox"
                              name="ttl"
                              value={values.ttl}
                              as={FormControlLabel}
                              control={<Checkbox checked={values.ttl} />}
                              label={'TTL Auto'}
                           />
                        </FormControl>
                        {!values.ttl && (
                           <TextField
                              name="ttlValue"
                              label="TTL Value"
                              type="number"
                              value={values.ttlValue}
                              error={Boolean(
                                 touched.ttlValue && errors.ttlValue
                              )}
                              fullWidth
                              helperText={touched.ttlValue && errors.ttlValue}
                              onBlur={handleBlur}
                              onChange={handleChange}
                              variant="outlined"
                           />
                        )}

                        <DialogActions>
                           <Button
                              onClick={() => {
                                 resetForm();
                                 handleCloseDNS();
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

         {/* dialog for delete DNS */}
         <Dialog
            open={openDeleteDNS}
            onClose={handleCloseDeleteDNS}
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
            <DialogTitle id="form-dialog-title">Delete DNS Record</DialogTitle>
            <DialogContent>
               <DialogContentText id="alert-dialog-description">
                  Are you sure you want to delete this DNS Record?
               </DialogContentText>
            </DialogContent>
            <DialogActions>
               <Button
                  onClick={handleCloseDeleteDNS}
                  color="secondary"
                  variant="outlined"
                  sx={{
                     height: 32,
                     borderColor: darkPurple[10],
                  }}
               >
                  Cancel
               </Button>
               {currentData && currentData.id && (
                  <Button
                     color="secondary"
                     variant="contained"
                     sx={{ height: 32 }}
                     onClick={() =>
                        handleDeleteDNS({
                           id: currentData.id,
                        })
                     }
                  >
                     Confirm
                  </Button>
               )}
            </DialogActions>
         </Dialog>
      </Box>
   );
}

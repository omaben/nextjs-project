import CustomLoader from '@/components/custom/CustomLoader';
import HeaderTitleToolbar from '@/components/custom/HeaderTitleToolbar';
import MoreFiltersButton from '@/components/custom/MoreFiltersButton';
import { FilterChip } from '@/components/custom/PortalFilterChips';
import TransitionSlide from '@/components/custom/TransitionSlide';
import CustomOperatorsBrandsToolbar from '@/components/custom/customOperatorsBrandsToolbar';
import CloudFlareData from '@/components/data/cloudFlare/cloudflare-grid';
import { useCreateDNSMutation } from '@/components/data/cloudFlare/lib/hooks/queries';
import { UserPermissionEvent } from '@alienbackoffice/back-front';
import { CreateDnsRecordDto } from '@alienbackoffice/back-front/lib/devops/dto/create-dns-record.dto';
import { DnsRecordType } from '@alienbackoffice/back-front/lib/devops/enum/dns-record-type.enum';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
   faAdd,
   faAngleDown,
   faArrowsRotate,
   faRectangleXmark,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import {
   Button,
   Checkbox,
   Dialog,
   DialogActions,
   DialogContent,
   FormControl,
   FormControlLabel,
   Grid,
   InputLabel,
   MenuItem,
   Select,
   Stack,
   Tab,
   TextField,
   Typography,
   useMediaQuery,
   useTheme,
} from '@mui/material';
import { darkPurple } from 'colors';
import { Field, Formik } from 'formik';
import type { ReactElement } from 'react';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import { saveDnsRecordList, saveGamesList } from 'redux/authSlice';
import { saveLoadingDnsRecordList, saveLoadingGamesList } from 'redux/loadingSlice';
import { store } from 'redux/store';
import { hasDetailsPermission } from 'services/permissionHandler';
import { CloudFlareTabs } from 'types';
import * as Yup from 'yup';
import DashboardLayout from '../../../layouts/Dashboard';

function CloudFlare() {
   const theme = useTheme();
   const [Transition, setTransition]: any = React.useState();
   const [openFilter, setOpenFilter] = React.useState(false);
   const [keyDateFilter, setKeyDateFilter] = React.useState(0);
   const [transitionFilter, setTransitionFilter]: any = React.useState();
   const filterInitialState = {
      name: '',
   };
   const [filters, setFilters] = React.useState(filterInitialState);
   const [filtersInput, setFiltersInput] = React.useState(filterInitialState);
   const [filterChips, setFilterChips] = React.useState<FilterChip[]>([]);
   const [ignore, setIgnore] = React.useState(false);
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
   const [autoRefresh, setAutoRefresh] = React.useState(0);
   const [open, setOpen] = React.useState(false);

   const [value, setValue] = React.useState(CloudFlareTabs.DNS);
   const handleCloseFilter = async () => {
      setKeyDateFilter(keyDateFilter + 1);
      await setTransition(TransitionSlide);
      setOpenFilter(false);
   };

   const handleClickOpenFilter = (value: any) => {
      setTransitionFilter(TransitionSlide);
      setOpenFilter(true);
   };

   const handleSearchFilter = () => {
      setFilters(filtersInput);
      handleCloseFilter();
   };

   const moreFiltersBtn = () => {
      return (
         <MoreFiltersButton
            open={openFilter}
            onClick={handleClickOpenFilter}
            TransitionComponent={transitionFilter}
            onClose={handleCloseFilter}
            onSearch={handleSearchFilter}
         >
            <TextField
               name="name"
               label="Name"
               onChange={(e) => {
                  setFiltersInput((prev) => ({
                     ...prev,
                     name: e.target.value,
                  }));
               }}
               value={filtersInput.name}
               fullWidth
               variant="outlined"
            />
         </MoreFiltersButton>
      );
   };

   const handleDeleteChip = (chipToDelete: FilterChip) => () => {
      setFilterChips((chips) =>
         chips.filter((chip) => chip.key !== chipToDelete.key)
      );

      const getObjectKey = (obj: any, value: string) => {
         return Object.keys(obj).find((key) => obj[key] === value);
      };

      const objKey = getObjectKey(filters, chipToDelete.value);
      objKey &&
         setFilters((prev) => ({
            ...prev,
            [objKey]:
               filterInitialState[objKey as keyof typeof filterInitialState],
         }));
   };

   const handleChangeTabs = (
      event: React.SyntheticEvent,
      newValue: CloudFlareTabs
   ) => {
      event.preventDefault();
      setValue(newValue);
   };

   // Mutation hook for creating an new DNS record
   const { mutate } = useCreateDNSMutation({
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

   // Handle opening the main dialog
   const handleClickOpen = () => {
      setTransition(TransitionSlide);
      setOpen(true);
   };

   // Handle closing the Add DNS dialog
   const handleCloseDNS = () => {
      setOpen(false);
   };

   const handleSubmitCreateNewDns = React.useCallback(
      (dtoData: {
         type: DnsRecordType;
         name: string;
         content: string;
         proxied?: boolean;
         comment?: string;
         tags?: string;
         ttl: boolean;
         ttlValue: number;
      }) => {
         const dto: CreateDnsRecordDto = {
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

   useEffect(() => {
      setFilterChips([{ key: 1, label: 'Name', value: filters.name }]);
      setFiltersInput(filters);
   }, [filters]);

   useEffect(() => {
      if (!ignore) {
         store.dispatch(saveLoadingDnsRecordList(true));
         store.dispatch(saveDnsRecordList([]));
         setTimeout(() => {
            setIgnore(true);
         }, 500);
      }
   });

   return (
      <React.Fragment>
         <Helmet title="CloudFlare List" />
         <CustomOperatorsBrandsToolbar
            title={`CloudFlare List`}
            filter={true}
            handleFilter={moreFiltersBtn}
            background={theme.palette.secondary.dark}
            sx={{
               mb:
                  isDesktop &&
                  filterChips.filter(
                     (chip) => chip.value && chip.value !== 'all'
                  ).length === 0
                     ? '8px'
                     : '0',
            }}
            actions={
               <>
                  <Grid item>
                     <Button
                        onClick={() => setAutoRefresh(autoRefresh + 1)}
                        color="primary"
                        variant={
                           useMediaQuery(theme.breakpoints.up('md'))
                              ? 'outlined'
                              : 'text'
                        }
                        sx={{
                           p: useMediaQuery(theme.breakpoints.up('md'))
                              ? '4px 8px 4px 8px'
                              : 0,
                           height: '28px',
                           borderRadius: '8px',
                           justifyContent: useMediaQuery(
                              theme.breakpoints.up('md')
                           )
                              ? 'initial'
                              : 'end',
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
                        {useMediaQuery(theme.breakpoints.up('md')) && (
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
                  {hasDetailsPermission(
                     UserPermissionEvent.BACKOFFICE_CREATE_DNS_RECORD_REQ
                  ) && (
                     <Grid item>
                        <Button
                           onClick={() => handleClickOpen()}
                           color="info"
                           variant="contained"
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
                           <FontAwesomeIcon
                              icon={faAdd as IconProp}
                              fixedWidth
                              fontSize={12}
                              height={'initial'}
                              width={'12px'}
                           />{' '}
                           New Record
                        </Button>
                     </Grid>
                  )}
               </>
            }
         />
         {ignore ? (
            <>
               <TabContext value={value}>
                  <TabList
                     className="detail_tabs"
                     onChange={handleChangeTabs}
                     variant="scrollable"
                     scrollButtons={true}
                     sx={{
                        mb: '6px',
                        pt: isDesktop ? 0 : '6px',
                        justifyContent: isDesktop ? 'left' : 'center',
                     }}
                     aria-label="lab API tabs example"
                  >
                     {hasDetailsPermission(
                        UserPermissionEvent.BACKOFFICE_DNS_RECORD_LIST_REQ
                     ) && (
                        <Tab
                           label={
                              <Typography
                                 variant="bodySmallBold"
                                 component="span"
                              >
                                 DNS Record
                              </Typography>
                           }
                           value={CloudFlareTabs.DNS}
                        />
                     )}
                  </TabList>
                  <TabPanel value={CloudFlareTabs.DNS}>
                     {filterChips.filter(
                        (chip) => chip.value && chip.value !== 'all'
                     ).length > 0 && (
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
                     <CloudFlareData
                        name={filters.name}
                        autoRefresh={autoRefresh}
                     />
                  </TabPanel>
               </TabContext>
               {/* dialog for adding an empty operator */}
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
                        <Typography
                           variant="h5"
                           gutterBottom
                           display="inline"
                           mb={0}
                        >
                           Create new Record
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
                           type: DnsRecordType.A,
                           name: '',
                           content: '',
                           proxied: false,
                           comment: '',
                           tags: '',
                           ttl: true,
                           ttlValue: 0,
                        }}
                        enableReinitialize={true}
                        validationSchema={Yup.object().shape({
                           type: Yup.string().required('Type  is required'),
                           name: Yup.string().required('name  is required'),
                           content: Yup.string().required((values) => {
                              return `Content is required for ${values.type}`;
                           }),
                           ttlValue: Yup.number().required('ttl  is required'),
                        })}
                        onSubmit={(values, { resetForm }) => {
                           handleSubmitCreateNewDns(values);
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
                                 error={Boolean(
                                    touched.content && errors.content
                                 )}
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
                                          color: (props) =>
                                             props.palette.error.main,
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
                                       error={Boolean(
                                          touched.tags && errors.tags
                                       )}
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
                              <TextField
                                 name="comment"
                                 label="Comment"
                                 value={values.comment}
                                 error={Boolean(
                                    touched.comment && errors.comment
                                 )}
                                 fullWidth
                                 helperText={touched.comment && errors.comment}
                                 onBlur={handleBlur}
                                 onChange={handleChange}
                                 variant="outlined"
                                 rows={5}
                              />
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
                                       control={
                                          <Checkbox checked={values.proxied} />
                                       }
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
                                    helperText={
                                       touched.ttlValue && errors.ttlValue
                                    }
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
            </>
         ) : (
            <CustomLoader />
         )}
      </React.Fragment>
   );
}

CloudFlare.getLayout = function getLayout(page: ReactElement) {
   return <DashboardLayout title="CloudFlare List">{page}</DashboardLayout>;
};

export default CloudFlare;

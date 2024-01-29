import JSONEditor from '@/components/custom/CustomJsonEditor'
import { PortalItemConfig } from '@/components/custom/configs'
import {
   EditOperatorGameDto,
   Operator,
   OperatorGame,
   User,
   UserScope,
} from '@alienbackoffice/back-front'
import { Add, Delete, ExpandMore as ExpandMoreIcon } from '@mui/icons-material'
import {
   Accordion,
   AccordionDetails,
   AccordionSummary,
   Button,
   Card,
   CardContent,
   CardHeader,
   DialogActions,
   Grid,
   Stack,
   TextField,
   Typography,
   useMediaQuery,
   useTheme,
} from '@mui/material'
import { ImoonGray, darkPurple } from 'colors'
import { useFormik } from 'formik'
import React from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import {
   selectAuthGameOperatorConfigs,
   selectAuthOperatorDetails,
   selectAuthUser,
} from 'redux/authSlice'
import { EventsHandler } from 'services/eventsHandler'
import { PageWithdetails3Toolbar } from 'services/globalFunctions'
import { useEditOperatorGameMutation } from './lib/hooks/queries'
export default function OperatorConfigs({ id, gameId }: any) {
   const theme = useTheme()
   const user = useSelector(selectAuthUser) as User
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
   const data = useSelector(selectAuthGameOperatorConfigs) as OperatorGame
   const operatorDetails = useSelector(selectAuthOperatorDetails) as Operator
   const [extraData, setExtraData] = React.useState(data?.gameConfig?.extraData)
   const [keyEditable, setkeyEditable] = React.useState(0)
   const [extraDataError, setExtraDataError] = React.useState(false)
   const [openAddMinStakeByCurrency, setOpenAddMinStakeByCurrency] =
      React.useState(false)
   const [currencyName, setCurrencyName] = React.useState('')
   const [currencyValue, setCurrencyValue] = React.useState(0)
   const [errorEmpty, setErrorEmpty] = React.useState(false)
   const [keyP, setKeyP] = React.useState(0)
   const eventHandler = new EventsHandler()
   const [expanded, setExpanded] = React.useState<string | false>('panel0')
   const disabledAll = true
   const formik2 = useFormik({
      initialValues: {},
      onSubmit: (values: any) => {},
   })
   const formikMinStake = useFormik({
      initialValues: {
         ...data?.minStakeByCurrency,
      },
      onSubmit: (values: any) => {},
   })
   const formikMaxStake = useFormik({
      initialValues: {
         ...data?.maxStakeByCurrency,
      },
      onSubmit: (values: any) => {},
   })
   const formikMaxWinStake = useFormik({
      initialValues: {
         ...data?.maxWinAmountByCurrency,
      },
      onSubmit: (values: any) => {},
   })
   const formik3 = useFormik({
      initialValues: {},
      onSubmit: (values: any) => {},
   })
   const formik = useFormik({
      initialValues: {
         opId: id,
         gameId: gameId,
         title: data?.title,
         gameStatus: data?.gameStatus,
         description: data?.description,
         devices: data?.devices,
         funModeUrl: data?.funModeUrl,
         gameProvider: data?.gameProvider,
         gameType: data?.gameType,
         gameSubType: data?.gameSubType,
         hasChat: data?.hasChat,
         hasFunMode: data?.hasFunMode,
         jd: data?.jd,
         live: data?.live,
         multiplayer: data?.multiplayer,
         rtp: data?.rtp,
         launchUrl: data?.launchUrl,
         allowableOperatorIDs: data?.allowableOperatorIDs,
         gamePlayURL: data?.gamePlayURL,
         minStake: data?.minStake,
         maxStake: data?.maxStake,
         maxWinAmount: data?.maxWinAmount,
         theme: data?.theme,
         lang: data?.lang,
         exchangeRate: data?.exchangeRate,
         chatIsEnable: data?.chatIsEnable,
         playMode: data?.playMode,
         showTotalBetAmount: data?.showTotalBetAmount,
         showPlayersCount: data?.showPlayersCount,
         soundsIsEnable: data?.soundsIsEnable,
         showInfoButton: data?.showInfoButton,
         tvModeIsEnable: data?.tvModeIsEnable,
         secretConfig: data?.secretConfig,
         gameConfig: data?.gameConfig,
      },
      onSubmit: (values: any) => {
         Object.keys(values)?.map((item: any) => {
            if (/\r|\n/.exec(values[item]) || item === 'ips') {
               values[item] = values[item].toString().split(/\r?\n/)
               if (item === 'retryTiming') {
                  values[item] = values[item]?.map(function (value: string) {
                     return parseInt(value, 10)
                  })
               }
            }
            values[item] === '' && delete values[item]
         })
         delete values['webhookAuthorizationToken']
         values['secretConfig'] = data?.secretConfig
         formik3.values['extraData'] = extraData
         values['gameConfig'] = formik3.values
         values['maxWinAmountByCurrency'] = formikMaxWinStake.values
         values['maxStakeByCurrency'] = formikMaxStake.values
         values['minStakeByCurrency'] = formikMinStake.values
         handleSubmit(values)
      },
   })
   const dataFormikValues = [
      { name: 'minStakeByCurrency', formik: formikMinStake },
      { name: 'maxStakeByCurrency', formik: formikMaxStake },
      { name: 'maxWinAmountByCurrency', formik: formikMaxWinStake },
   ]

   const { mutate } = useEditOperatorGameMutation({
      onSuccess: (data: any) => {
         eventHandler.HandleGetOperatorGameConfigs(data.data as OperatorGame)
         toast.success('You Edited Game Operator successfully', {
            position: toast.POSITION.TOP_CENTER
          })
      },
      onError(error, variables, context) {
         toast.error(error, {
            position: toast.POSITION.TOP_CENTER
          })
      },
   })

   const handleSubmit = React.useCallback(
      (dto: EditOperatorGameDto) => {
         mutate({ dto: dto })
      },
      [mutate]
   )

   const handleChangePannel =
      (panel: string) =>
      (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
         setExpanded(isExpanded ? panel : false)
         setOpenAddMinStakeByCurrency(false)
         setCurrencyName('')
         setErrorEmpty(false)
         setCurrencyValue(0)
         formikMinStake.values = {
            ...data['minStakeByCurrency'],
         }
      }

   const UpdateCurrency = (formik: any) => {
      if (currencyName !== '') {
         formik.initialValues[currencyName] = currencyValue
         formik.values[currencyName] = currencyValue
         setOpenAddMinStakeByCurrency(false)
         setCurrencyName('')
         setCurrencyValue(0)
         setErrorEmpty(false)
      } else {
         setErrorEmpty(true)
      }
   }

   let dataOp: any = data
   const deleteCurrency = (name: string, formik: any, currency: string) => {
      if (dataOp[name] && dataOp[name][currency]) {
         // Create a new object based on dataLog[name] without the 'currency' property
         const updatedDataLogName = { ...dataOp[name] }
         delete updatedDataLogName[currency]

         // Replace the original dataLog[name] with the updated object
         dataOp = updatedDataLogName
      }

      if (formik.values && formik.values[currency]) {
         delete formik.values[currency]
      }

      if (formik.initialValues && formik.initialValues[currency]) {
         delete formik.initialValues[currency]
      }
      setKeyP(keyP + 1)
   }

   React.useEffect(() => {
      setExtraData(data?.gameConfig?.extraData)
      setkeyEditable(keyEditable + 1)
   }, [data])

   return (
      <Card
         sx={{
            width: isDesktop ? 'calc(100vw - 245px)' : '100%',
            mb: '8px',
            height: PageWithdetails3Toolbar,
            background: 'transparent',
            overflowY: 'auto',
            '.box-texfield-style': {
               p: '16px',
               border: `1px solid ${darkPurple[11]}`,
               borderRadius: '8px',
               background: darkPurple[12],
               mb: '6px',
            },
         }}
      >
         <CardHeader
            sx={{
               background: ImoonGray[4],
               p: '12px',
               borderTopLeftRadius: '8px',
               borderTopRightRadius: '8px',
               textAlign: 'right',
               cursor: 'pointer',
            }}
         ></CardHeader>
         <CardContent
            sx={{
               p: '0 !important',
            }}
         >
            {data && (
               <form noValidate onSubmit={formik.handleSubmit}>
                  {(user?.scope === UserScope.SUPERADMIN ||
                     user?.scope === UserScope.ADMIN) &&
                     Object.keys(formik.initialValues)?.map(
                        (item: any, key) => {
                           if (item !== 'opId') {
                              formik.initialValues[item] = Array.isArray(
                                 dataOp[item]
                              )
                                 ? dataOp[item].join('\n') || ''
                                 : dataOp[item] || ''
                           } else {
                              formik.initialValues['opId'] = id
                           }
                           if (
                              item === 'secretConfig' ||
                              item === 'gameConfig'
                           ) {
                              let formikData = formik2
                              switch (item) {
                                 case 'secretConfig':
                                    formikData = formik2
                                    break
                                 case 'gameConfig':
                                    formikData = formik3
                                    break
                                 case 'minStakeByCurrency':
                                    formikData = formikMinStake
                                    break
                                 case 'maxStakeByCurrency':
                                    formikData = formikMaxStake
                                    break
                                 case 'maxWinAmountByCurrency':
                                    formikData = formikMaxWinStake
                                    break
                              }
                              const result = item.replace(/([A-Z])/g, ' $1')
                              const label =
                                 result.charAt(0).toUpperCase() +
                                 result.slice(1)
                              return (
                                 <Accordion
                                    key={'Accordion' + key}
                                    expanded={expanded === `panel${key}`}
                                    onChange={handleChangePannel(`panel${key}`)}
                                 >
                                    <AccordionSummary
                                       expandIcon={<ExpandMoreIcon />}
                                    >
                                       <Grid container alignItems="center">
                                          <Grid item>
                                             <Typography variant="h6">
                                                {label}
                                             </Typography>
                                          </Grid>
                                          <Grid xs item></Grid>
                                       </Grid>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                       {item !== 'secretConfig' &&
                                          Object.keys(formik.values[item])?.map(
                                             (data: any, keyData) => {
                                                formikData.initialValues[data] =
                                                   Array.isArray(
                                                      dataOp[item][data]
                                                   )
                                                      ? dataOp[item][
                                                           data
                                                        ]?.join('\n') || ''
                                                      : dataOp[item][data] || ''
                                                const result = data.replace(
                                                   /([A-Z])/g,
                                                   ' $1'
                                                )
                                                const label =
                                                   result
                                                      .charAt(0)
                                                      .toUpperCase() +
                                                   result.slice(1)
                                                return data === 'extraData' ? (
                                                   <Grid
                                                      key={`configOp1${keyData}`}
                                                      container
                                                      alignItems="center"
                                                   >
                                                      <Grid item xs={12}>
                                                         <Typography variant="headLine">
                                                            {label}
                                                         </Typography>
                                                         <JSONEditor
                                                            key={keyEditable}
                                                            editable={
                                                               operatorDetails.isLocked ||
                                                               disabledAll
                                                                  ? false
                                                                  : true
                                                            }
                                                            data={
                                                               formikData
                                                                  .values[data]
                                                            }
                                                            setExtraData={(
                                                               data: any
                                                            ) =>
                                                               setExtraData(
                                                                  data
                                                               )
                                                            }
                                                            setExtraDataError={(
                                                               data: any
                                                            ) =>
                                                               setExtraDataError(
                                                                  data
                                                               )
                                                            }
                                                         />
                                                      </Grid>
                                                      <Grid item xs></Grid>
                                                   </Grid>
                                                ) : (
                                                   <PortalItemConfig
                                                      text={data}
                                                      key={`configOp1${keyData}`}
                                                      handleChange={
                                                         formikData.handleChange
                                                      }
                                                      multiline={Array.isArray(
                                                         formikData
                                                            .initialValues[data]
                                                      )}
                                                      disabled={
                                                         operatorDetails.isLocked ||
                                                         disabledAll
                                                      }
                                                      value={
                                                         formikData.values[data]
                                                      }
                                                      typeMultine={
                                                         Array.isArray(
                                                            dataOp[item][data]
                                                         ) &&
                                                         typeof dataOp[item][
                                                            data
                                                         ][0]
                                                      }
                                                      type={
                                                         Array.isArray(
                                                            dataOp[item][data]
                                                         )
                                                            ? `${typeof formikData
                                                                 .values[
                                                                 data
                                                              ]}[]`
                                                            : typeof formikData
                                                                 .values[data]
                                                      }
                                                   />
                                                )
                                             }
                                          )}
                                    </AccordionDetails>
                                 </Accordion>
                              )
                           } else {
                              return (
                                 item !== 'gameId' &&
                                 item !== 'opId' &&
                                 item !== '__v' &&
                                 item !== '_id' &&
                                 item !== 'minStakeByCurrency' &&
                                 item !== 'maxStakeByCurrency' &&
                                 item !== 'maxWinAmountByCurrency' && (
                                    <PortalItemConfig
                                       text={item}
                                       disabled={
                                          operatorDetails.isLocked ||
                                          disabledAll
                                       }
                                       key={`configOp${key}`}
                                       handleChange={formik.handleChange}
                                       multiline={Array.isArray(dataOp[item])}
                                       value={formik.values[item]}
                                       typeMultine={
                                          Array.isArray(dataOp[item]) &&
                                          (dataOp[item][0]
                                             ? typeof dataOp[item][0]
                                             : 'string')
                                       }
                                       type={
                                          Array.isArray(dataOp[item])
                                             ? `${typeof formik.values[item]}[]`
                                             : typeof formik.values[item]
                                       }
                                       sx={{
                                          background: darkPurple[12],
                                          px: '6px',
                                       }}
                                    />
                                 )
                              )
                           }
                        }
                     )}
                  {id &&
                     dataFormikValues.map((itemStake: any, keyStake: any) => {
                        const result = itemStake.name.replace(/([A-Z])/g, ' $1')
                        const label =
                           result.charAt(0).toUpperCase() + result.slice(1)
                        return (
                           <Accordion
                              key={
                                 'Accordion' +
                                 itemStake.name +
                                 'keyStake' +
                                 keyP
                              }
                              expanded={expanded === `panel${itemStake.name}`}
                              onChange={handleChangePannel(
                                 `panel${itemStake.name}`
                              )}
                           >
                              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                 <Grid container alignItems="center">
                                    <Grid item>
                                       <Typography variant="h6">
                                          {label}
                                       </Typography>
                                    </Grid>
                                    <Grid xs item></Grid>
                                 </Grid>
                              </AccordionSummary>
                              <AccordionDetails>
                                 {Object.keys(itemStake.formik.values).map(
                                    (
                                       itemMinStakeByCurrency: any,
                                       keyMinStakeByCurrency
                                    ) => {
                                       return (
                                          <React.Fragment
                                             key={`configOpStake${itemMinStakeByCurrency}${itemStake.name}`}
                                          >
                                             <Grid
                                                container
                                                alignItems="center"
                                                justifyContent="space-between"
                                             >
                                                <Grid item xs>
                                                   <PortalItemConfig
                                                      disabled={
                                                         operatorDetails.isLocked ||
                                                         disabledAll
                                                      }
                                                      text={
                                                         itemMinStakeByCurrency
                                                      }
                                                      handleChange={
                                                         itemStake.formik
                                                            .handleChange
                                                      }
                                                      value={
                                                         itemStake.formik
                                                            .values[
                                                            itemMinStakeByCurrency
                                                         ]
                                                      }
                                                      type={'number'}
                                                   />
                                                </Grid>
                                                {!operatorDetails.isLocked &&
                                                   !disabledAll && (
                                                      <Grid item ml={5}>
                                                         <Button
                                                            color="error"
                                                            disabled={
                                                               operatorDetails.isLocked ||
                                                               disabledAll
                                                            }
                                                            variant="contained"
                                                            onClick={() =>
                                                               deleteCurrency(
                                                                  itemStake.name,
                                                                  itemStake.formik,
                                                                  itemMinStakeByCurrency
                                                               )
                                                            }
                                                            sx={{
                                                               mb: 2,
                                                            }}
                                                         >
                                                            <Delete />
                                                         </Button>
                                                      </Grid>
                                                   )}
                                             </Grid>
                                          </React.Fragment>
                                       )
                                    }
                                 )}
                                 {!operatorDetails.isLocked && !disabledAll && (
                                    <Grid
                                       container
                                       sx={{
                                          justifyContent: 'end',
                                          mt: 4,
                                       }}
                                    >
                                       <Button
                                          color="primary"
                                          variant="contained"
                                          onClick={() => {
                                             setOpenAddMinStakeByCurrency(true)
                                          }}
                                          disabled={
                                             operatorDetails.isLocked ||
                                             disabledAll
                                          }
                                       >
                                          <Add /> Add New Currency
                                       </Button>
                                    </Grid>
                                 )}

                                 {openAddMinStakeByCurrency && (
                                    <>
                                       <Grid
                                          container
                                          alignItems="center"
                                          spacing={3}
                                       >
                                          <Grid item xs={6}>
                                             <Stack
                                                direction="row"
                                                alignItems={'center'}
                                                justifyContent="space-between"
                                             >
                                                <Typography
                                                   variant="headLine"
                                                   sx={{ width: 400 }}
                                                >
                                                   Name
                                                </Typography>
                                             </Stack>
                                             <TextField
                                                name="currencyName"
                                                type="text"
                                                value={currencyName}
                                                error={errorEmpty}
                                                disabled={
                                                   operatorDetails.isLocked ||
                                                   disabledAll
                                                }
                                                onChange={(e) =>
                                                   setCurrencyName(
                                                      e.target.value
                                                   )
                                                }
                                                fullWidth
                                                variant="outlined"
                                             />
                                          </Grid>
                                          <Grid item xs={6}>
                                             <Stack
                                                direction="row"
                                                alignItems={'center'}
                                                justifyContent="space-between"
                                             >
                                                <Typography
                                                   variant="headLine"
                                                   sx={{ width: 400 }}
                                                >
                                                   Value
                                                </Typography>
                                             </Stack>
                                             <TextField
                                                name="currencyValue"
                                                type="number"
                                                disabled={
                                                   operatorDetails.isLocked ||
                                                   disabledAll
                                                }
                                                value={currencyValue}
                                                onChange={(e) =>
                                                   setCurrencyValue(
                                                      Number(e.target.value)
                                                   )
                                                }
                                                fullWidth
                                                variant="outlined"
                                             />
                                          </Grid>
                                       </Grid>
                                       <Grid
                                          container
                                          sx={{
                                             justifyContent: 'end',
                                             mt: 4,
                                          }}
                                       >
                                          <Button
                                             color="error"
                                             variant="contained"
                                             sx={{
                                                mr: 3,
                                             }}
                                             onClick={() => {
                                                setOpenAddMinStakeByCurrency(
                                                   false
                                                )
                                                setCurrencyName('')
                                                setErrorEmpty(false)
                                                setCurrencyValue(0)
                                             }}
                                          >
                                             Cancel
                                          </Button>
                                          <Button
                                             color="success"
                                             variant="contained"
                                             onClick={() =>
                                                UpdateCurrency(itemStake.formik)
                                             }
                                             disabled={
                                                operatorDetails.isLocked ||
                                                disabledAll
                                             }
                                          >
                                             save
                                          </Button>
                                       </Grid>
                                    </>
                                 )}
                              </AccordionDetails>
                           </Accordion>
                        )
                     })}
                  {!(
                     extraDataError !== false ||
                     operatorDetails.isLocked ||
                     disabledAll ||
                     disabledAll
                  ) && (
                     <DialogActions sx={{ justifyContent: 'center' }}>
                        <Button
                           type="submit"
                           disabled={
                              extraDataError !== false ||
                              operatorDetails.isLocked ||
                              disabledAll ||
                              disabledAll
                           }
                           color="secondary"
                           variant="contained"
                           sx={{ height: 32 }}
                        >
                           Save
                        </Button>
                     </DialogActions>
                  )}
               </form>
            )}
         </CardContent>
      </Card>
   )
}

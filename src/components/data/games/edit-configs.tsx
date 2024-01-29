import JSONEditor from '@/components/custom/CustomJsonEditor'
import CustomLoader from '@/components/custom/CustomLoader'
import { PortalItemConfig } from '@/components/custom/configs'
import { EditGameDto, Game } from '@alienbackoffice/back-front'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faAdd } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Delete, ExpandMore as ExpandMoreIcon } from '@mui/icons-material'
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
   TextField,
   Typography,
   useMediaQuery,
   useTheme,
} from '@mui/material'
import { ImoonGray, darkPurple } from 'colors'
import { useFormik } from 'formik'
import React, { FC } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { selectAuthGamesList } from 'redux/authSlice'
import { PageWithdetails3Toolbar } from 'services/globalFunctions'
import { useEditGameMutation, useGetGameListQuery } from './lib/hooks/queries'
export const Configs: FC<{ configs: any }> = (props) => {
   const theme = useTheme()
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
   const { isLoading } = useGetGameListQuery({ gameId: props.configs })
   const data = useSelector(selectAuthGamesList)?.games[0] as Game
   const [extraData, setExtraData] = React.useState(data?.gameConfig?.extraData)
   const [extraDataError, setExtraDataError] = React.useState(false)
   const [openAddMinStakeByCurrency, setOpenAddMinStakeByCurrency] =
      React.useState(false)
   const [currencyName, setCurrencyName] = React.useState('')
   const [currencyValue, setCurrencyValue] = React.useState(0)
   const [errorEmpty, setErrorEmpty] = React.useState(false)
   const [keyP, setKeyP] = React.useState(0)

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
         gameId: data.gameId,
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
         values['secretConfig'] = formik2.values
         formik3.values['extraData'] = extraData
         values['gameConfig'] = formik3.values
         values['maxWinAmountByCurrency'] = formikMaxWinStake.values
         values['maxStakeByCurrency'] = formikMaxStake.values
         values['minStakeByCurrency'] = formikMinStake.values
         handleSubmit(values)
         //  alert(JSON.stringify(values, null, 2))
      },
   })
   const dataFormikValues = [
      { name: 'minStakeByCurrency', formik: formikMinStake },
      { name: 'maxStakeByCurrency', formik: formikMaxStake },
      { name: 'maxWinAmountByCurrency', formik: formikMaxWinStake },
   ]
   const [expanded, setExpanded] = React.useState<string | false>('panel0')

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

   const dataOp: any = data
   const deleteCurrency = (name: string, formik: any, currency: string) => {
      const dataLog: any = data
      dataLog[name] && dataLog[name][currency] && delete dataLog[name][currency]
      delete formik.values[currency]
      delete formik.initialValues[currency]

      setKeyP(keyP + 1)
   }

   const UpdateExtraData = (data: { jsObject: {}; error: any }) => {
      setExtraDataError(data.error)
      setExtraData(data.jsObject)
   }

   const { mutate } = useEditGameMutation({
      onSuccess: (data) => {
         toast.success('You Edited Game successfully', {
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
            {!isLoading ? (
               <form noValidate onSubmit={formik.handleSubmit}>
                  {Object.keys(formik.initialValues)?.map((item: any, key) => {
                     if (item !== 'opId') {
                        formik.initialValues[item] = Array.isArray(dataOp[item])
                           ? dataOp[item].join('\n') || ''
                           : dataOp[item] || ''
                     }
                     if (item === 'secretConfig' || item === 'gameConfig') {
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
                           result.charAt(0).toUpperCase() + result.slice(1)
                        return (
                           <Accordion
                              key={'Accordion' + key}
                              expanded={expanded === `panel${key}`}
                              onChange={handleChangePannel(`panel${key}`)}
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
                                 {Object.keys(formik.values[item])?.map(
                                    (data: any, keyData) => {
                                       formikData.initialValues[data] =
                                          Array.isArray(dataOp[item][data])
                                             ? dataOp[item][data]?.join('\n') ||
                                               ''
                                             : dataOp[item][data] || ''
                                       const result = data.replace(
                                          /([A-Z])/g,
                                          ' $1'
                                       )
                                       const label =
                                          result.charAt(0).toUpperCase() +
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
                                                   editable={true}
                                                   setExtraData={(data: any) =>
                                                      UpdateExtraData(data)
                                                   }
                                                   setExtraDataError={(
                                                      data: any
                                                   ) => setExtraDataError(data)}
                                                   data={
                                                      formikData.values[
                                                         data
                                                      ] as any
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
                                                formikData.initialValues[data]
                                             )}
                                             value={formikData.values[data]}
                                             typeMultine={
                                                Array.isArray(
                                                   dataOp[item][data]
                                                ) &&
                                                typeof dataOp[item][data][0]
                                             }
                                             type={
                                                Array.isArray(
                                                   dataOp[item][data]
                                                )
                                                   ? `${typeof formikData
                                                        .values[data]}[]`
                                                   : typeof formikData.values[
                                                        data
                                                     ]
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
                  })}
                  {dataFormikValues?.map((itemStake: any, keyStake: any) => {
                     itemStake.formik.values = {
                        ...dataOp[itemStake.name],
                        ...itemStake.formik.values,
                     }
                     const result = itemStake.name.replace(/([A-Z])/g, ' $1')
                     const label =
                        result.charAt(0).toUpperCase() + result.slice(1)
                     return (
                        <Accordion
                           key={
                              'Accordion' + itemStake.name + 'keyStake' + keyP
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
                              {Object.keys(itemStake.formik.values)?.map(
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
                                                   text={itemMinStakeByCurrency}
                                                   handleChange={
                                                      itemStake.formik
                                                         .handleChange
                                                   }
                                                   value={
                                                      itemStake.formik.values[
                                                         itemMinStakeByCurrency
                                                      ]
                                                   }
                                                   type={'number'}
                                                />
                                             </Grid>
                                             <Grid item ml={5}>
                                                <Button
                                                   color="error"
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
                                          </Grid>
                                       </React.Fragment>
                                    )
                                 }
                              )}
                              <Grid
                                 container
                                 sx={{
                                    justifyContent: 'end',
                                    mt: 4,
                                 }}
                              >
                                 <Button
                                    onClick={() => {
                                       setOpenAddMinStakeByCurrency(true)
                                    }}
                                    color="info"
                                    variant="contained"
                                    sx={{
                                       fontSize: 12,
                                       fontFamily: 'Nunito Sans SemiBold',
                                       borderRadius: '8px',
                                       minHeight: '27px',
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
                                    New Currency
                                 </Button>
                              </Grid>
                              {openAddMinStakeByCurrency && (
                                 <>
                                    <Grid
                                       container
                                       alignItems="center"
                                       spacing={3}
                                    >
                                       <Grid item xs={6}>
                                          <TextField
                                             name="currencyName"
                                             label="Name"
                                             fullWidth
                                             value={currencyName}
                                             error={errorEmpty}
                                             onChange={(e) =>
                                                setCurrencyName(e.target.value)
                                             }
                                             variant="outlined"
                                          />
                                       </Grid>
                                       <Grid item xs={6}>
                                          <TextField
                                             name="currencyValue"
                                             label="Value"
                                             fullWidth
                                             value={currencyValue}
                                             onChange={(e) =>
                                                setCurrencyValue(
                                                   Number(e.target.value)
                                                )
                                             }
                                             variant="outlined"
                                          />
                                       </Grid>
                                    </Grid>
                                    <DialogActions
                                       sx={{ justifyContent: 'center' }}
                                    >
                                       <Button
                                          onClick={() => {
                                             setOpenAddMinStakeByCurrency(false)
                                             setCurrencyName('')
                                             setErrorEmpty(false)
                                             setCurrencyValue(0)
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
                                          onClick={() =>
                                             UpdateCurrency(itemStake.formik)
                                          }
                                          color="secondary"
                                          variant="contained"
                                          sx={{ height: 32 }}
                                       >
                                          Save
                                       </Button>
                                    </DialogActions>
                                 </>
                              )}
                           </AccordionDetails>
                        </Accordion>
                     )
                  })}

                  <DialogActions sx={{ justifyContent: 'center' }}>
                     <Button
                        type="submit"
                        disabled={extraDataError !== false}
                        color="secondary"
                        variant="contained"
                        sx={{ height: 32 }}
                     >
                        Save
                     </Button>
                  </DialogActions>
               </form>
            ) : (
               <CustomLoader />
            )}
         </CardContent>
      </Card>
   )
}

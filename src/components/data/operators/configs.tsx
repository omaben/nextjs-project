import CustomLoader from '@/components/custom/CustomLoader'
import { PortalItemConfig } from '@/components/custom/configs'
import {
   OperatorConfig,
   SetOperatorConfigDto,
} from '@alienbackoffice/back-front'
import {
   Button,
   Card,
   CardContent,
   CardHeader,
   DialogActions,
   useMediaQuery,
   useTheme,
} from '@mui/material'
import { ImoonGray, darkPurple } from 'colors'
import { useFormik } from 'formik'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { selectAuthOperatorConfigs } from 'redux/authSlice'
import { PageWithdetails4Toolbar } from 'services/globalFunctions'
import {
   useGetOperatorConfigQuery,
   useSetOperatorConfigMutation,
} from './lib/hooks/queries'

export default function OperatorConfigs({
   id,
   disabled,
}: {
   id: string
   disabled: boolean
}) {
   const theme = useTheme()
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
   const { isLoading: isloadingConfigs } = useGetOperatorConfigQuery({
      opId: id,
   })
   const data = useSelector(selectAuthOperatorConfigs) as OperatorConfig

   const formik = useFormik({
      initialValues: {
         opId: id,
         connectionType: data.connectionType || '',
         gameConnectorUrl: data.gameConnectorUrl || '',
      },
      onSubmit: (values: any) => {
         Object.keys(values).map((item: any) => {
            if (/\r|\n/.exec(values[item]) || item === 'ips') {
               values[item] = values[item].toString().split(/\r?\n/)
               if (item === 'retryTiming') {
                  values[item] = values[item].map(function (value: string) {
                     return parseInt(value, 10)
                  })
               }
            }
            if (Array.isArray(values[item])) {
               values[item] = values[item].filter((str: any) => str !== '')
            }
         })
         const data: SetOperatorConfigDto = {
            opId: values.opId,
            awpsExpirationTime: values.awpsExpirationTime,
            currency: values.currency,
            idlePlayerTimeout: values.idlePlayerTimeout,
            ips: values.ips,
            lang: values.lang,
            retryTiming: values.retryTiming,
            theme: values.theme,
            validateCurrency: values.validateCurrency,
            waitForPlayerDisconnectProcess:
               values.waitForPlayerDisconnectProcess,
            webhookAuthorizationToken: values.webhookAuthorizationToken,
            webhookBaseUrl: values.webhookBaseUrl,
            webhookBetTimeout: values.webhookBetTimeout,
            webhookPlayerInfoTimeout: values.webhookPlayerInfoTimeout,
            webhookResultTimeout: values.webhookResultTimeout,
            webhookRollbackTimeout: values.webhookRollbackTimeout,
            connectionType: values.connectionType,
            gameConnectorUrl: values.gameConnectorUrl,
         }
         handleSubmit(data)
      },
   })

   const { mutate } = useSetOperatorConfigMutation({
      onSuccess: () => {
         toast.success('Operator Configs Updated Successfully', {
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
      (data: SetOperatorConfigDto) => {
         mutate({ dto: data })
      },
      [mutate]
   )

   useEffect(() => {
      if (!Object.keys(data).includes('gameConnectorUrl')) {
         formik.initialValues['gameConnectorUrl'] = ''
      }
      if (!Object.keys(data).includes('connectionType')) {
         formik.initialValues['connectionType'] = ''
      }
   }, [data])

   return !isloadingConfigs ? (
      <Card
         sx={{
            width: isDesktop ? 'calc(100vw - 245px)' : '100%',
            mb: '8px',
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
               pb: '6px !important',
               height: PageWithdetails4Toolbar,
               overflowY: 'auto',
            }}
         >
            {data && (
               <form noValidate onSubmit={formik.handleSubmit}>
                  {Object.keys(data).map((item: any, key) => {
                     const dataOp: any = data
                     formik.initialValues[item] = Array.isArray(dataOp[item])
                        ? dataOp[item].join('\n')
                        : dataOp[item]
                     return (
                        item !== 'createdAt' &&
                        item !== 'minStakeByCurrency' &&
                        item !== 'maxStakeByCurrency' &&
                        item !== 'maxWinAmountByCurrency' &&
                        item !== 'defaultBetAmountByCurrency' &&
                        item !== 'updatedAt' &&
                        item !== '__v' &&
                        item !== '_id' && (
                           <PortalItemConfig
                              disabled={disabled}
                              text={item}
                              key={`configOp${key}`}
                              handleChange={formik.handleChange}
                              multiline={Array.isArray(dataOp[item])}
                              value={formik.values[item]}
                              typeMultine={
                                 Array.isArray(dataOp[item]) &&
                                 typeof dataOp[item][0]
                              }
                              type={
                                 Array.isArray(dataOp[item])
                                    ? `${typeof formik.values[item]}[]`
                                    : typeof formik.values[item]
                              }
                           />
                        )
                     )
                  })}
                  {!Object.keys(data).includes('connectionType') && (
                     <PortalItemConfig
                        disabled={disabled}
                        text={'connectionType'}
                        key={`configOp${'connectionType'}`}
                        handleChange={formik.handleChange}
                        value={formik.values['connectionType']}
                        typeMultine={
                           Array.isArray(data['connectionType']) &&
                           typeof data['connectionType'][0]
                        }
                        type={
                           Array.isArray(data['connectionType'])
                              ? `${typeof formik.values['connectionType']}[]`
                              : typeof formik.values['connectionType']
                        }
                     />
                  )}
                  {!Object.keys(data).includes('gameConnectorUrl') && (
                     <PortalItemConfig
                        disabled={disabled}
                        text={'gameConnectorUrl'}
                        key={`configOp${'gameConnectorUrl'}`}
                        handleChange={formik.handleChange}
                        value={formik.values['gameConnectorUrl']}
                        typeMultine={
                           Array.isArray(data['gameConnectorUrl']) &&
                           typeof data['gameConnectorUrl'][0]
                        }
                        type={
                           Array.isArray(data['gameConnectorUrl'])
                              ? `${typeof formik.values['gameConnectorUrl']}[]`
                              : typeof formik.values['gameConnectorUrl']
                        }
                     />
                  )}
                  <DialogActions sx={{ justifyContent: 'center' }}>
                     <Button
                        type="submit"
                        color="secondary"
                        variant="contained"
                        disabled={disabled}
                        sx={{ height: 32 }}
                     >
                        Save
                     </Button>
                  </DialogActions>
               </form>
            )}
         </CardContent>
      </Card>
   ) : (
      <CustomLoader />
   )
}

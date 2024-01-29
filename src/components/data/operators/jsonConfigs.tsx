import JSONEditor from '@/components/custom/CustomJsonEditor'
import CustomLoader from '@/components/custom/CustomLoader'
import {
   ConnectionType,
   OperatorConfig,
   SetOperatorConfigDto,
} from '@alienbackoffice/back-front'
import {
   Box,
   Button,
   Card,
   CardContent,
   DialogActions,
   useMediaQuery,
   useTheme,
} from '@mui/material'
import { darkPurple } from 'colors'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { selectAuthOperatorConfigs } from 'redux/authSlice'
import { PageWithdetails4ToolbarWithButton } from 'services/globalFunctions'
import {
   useGetOperatorConfigQuery,
   useSetOperatorConfigMutation,
} from './lib/hooks/queries'

export default function OperatorJsonConfigs({
   id,
   disabled,
}: {
   id: string
   disabled: boolean
}) {
   const { isLoading: isloadingConfigs } = useGetOperatorConfigQuery({
      opId: id,
   })
   const data = useSelector(selectAuthOperatorConfigs) as OperatorConfig
   const [extraData, setExtraData] = React.useState(data as OperatorConfig)
   const [refreshBox, setRefreshBox] = React.useState(0)
   const [extraDataError, setExtraDataError] = React.useState(false)
   const theme = useTheme()
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
   const { mutate: mutateJson } = useSetOperatorConfigMutation({
      onSuccess: (data) => {
         toast.success('You Edit Config Operator successfully', {
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
      (dto: SetOperatorConfigDto) => {
         const editData: {
            databaseConnectionString?: string
            opId: string
            webhookBaseUrl?: string
            webhookAuthorizationToken?: string
            ips?: string[]
            currency?: string
            lang?: string
            theme?: string
            waitForPlayerDisconnectProcess?: number
            awpsExpirationTime?: number
            idlePlayerTimeout?: number
            retryTiming?: number[]
            webhookPlayerInfoTimeout?: number
            webhookBetTimeout?: number
            webhookResultTimeout?: number
            webhookRollbackTimeout?: number
            validateCurrency?: boolean
            connectionType?: ConnectionType
            gameConnectorUrl?: string
         } = dto
         delete editData.databaseConnectionString
         delete editData.webhookBaseUrl
         mutateJson({ dto: editData })
      },
      [mutateJson]
   )

   useEffect(() => {
      setRefreshBox(refreshBox + 1)
      setExtraData(data)
   }, [data])

   return !isloadingConfigs ? (
      <Box
         sx={{
            width: isDesktop ? 'calc(100vw - 250px)' : '100%',
            maxWidth: 'initial',
            '.MuiDataGrid-row:hover, .MuiDataGrid-row:focus': {
               '.showOnHover,': {
                  opacity: 1,
               },
            },
            '.MuiDataGrid-row .showOnHover': {
               opacity: 0.2,
            },
            pb: 2,
         }}
      >
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
                  height: PageWithdetails4ToolbarWithButton,
                  overflowY: 'auto',
               }}
            >
               <JSONEditor
                  key={refreshBox}
                  editable={!disabled}
                  data={data}
                  setExtraData={(data: OperatorConfig) => setExtraData(data)}
                  setExtraDataError={(data: boolean) => setExtraDataError(data)}
               />
            </CardContent>
         </Card>
         <DialogActions sx={{ justifyContent: 'center' }}>
            <Button
               onClick={() => handleSubmit({ ...extraData, opId: id })}
               disabled={extraDataError !== false || disabled}
               color="secondary"
               variant="contained"
               sx={{ height: 32 }}
            >
               Save
            </Button>
         </DialogActions>
      </Box>
   ) : (
      <CustomLoader />
   )
}

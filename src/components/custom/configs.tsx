import {
   ConnectionType,
   GameStatus,
   OperatorStatus,
} from '@alienbackoffice/back-front'
import styled from '@emotion/styled'
import {
   Checkbox,
   FormControlLabel,
   InputLabel,
   MenuItem,
   FormControl as MuiFormControl,
   Select,
   Skeleton,
   Stack,
   TextField,
   useMediaQuery,
   useTheme,
} from '@mui/material'
import { spacing } from '@mui/system'
import { useSelector } from 'react-redux'
import {
   selectAuthCurrenciesDetail,
   selectAuthLanguages,
} from 'redux/authSlice'
import 'swiper/css'
import 'swiper/css/navigation'
import { THEME } from 'types'
import { IconAngleDown } from '../icons'
const FormControlSpacing = styled(MuiFormControl)(spacing)
const FormControl = styled(FormControlSpacing)`
   min-width: 148px;
`

export const PortalItemConfig = (props: any) => {
   const { value, text, type, isLoading, multiline, typeMultine, disabled } =
      props
   const theme = useTheme()
   const languages = useSelector(selectAuthLanguages)
   const result = text.replace(/([A-Z])/g, ' $1')
   const label = result.charAt(0).toUpperCase() + result.slice(1)
   const usedCurrencies = useSelector(selectAuthCurrenciesDetail) as string[]
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'))

   return (
      <Stack sx={{ flex: 1, ...props.sx }} minWidth={245}>
         {type === 'boolean' ? (
            <FormControlLabel
               sx={{
                  width: 'max-content',
               }}
               control={
                  <Checkbox
                     name={text}
                     onChange={props.handleChange}
                     checked={value}
                  />
               }
               label={label}
            />
         ) : type === 'object' && !Array.isArray(value) ? (
            value &&
            Object.keys(value).map((data: any, keyData) => {
               return (
                  <PortalItemConfig
                     text={data}
                     key={`extraData${keyData}`}
                     handleChange={props.handleChange}
                     multiline={Array.isArray(value[data])}
                     disabled={disabled}
                     value={value[data]}
                     typeMultine={
                        Array.isArray(value[data]) && typeof value[data][0]
                     }
                     type={
                        Array.isArray(value[data])
                           ? `${typeof value[data]}[]`
                           : typeof value[data]
                     }
                  />
               )
            })
         ) : (
            <FormControl
               mr={2}
               mb={'4px'}
               sx={{
                  width: '100%',
                  '.MuiOutlinedInput-notchedOutline': {
                     borderColor: theme.palette.divider,
                  },
               }}
            >
               <Stack gap={1}>
                  <Stack
                     direction="row"
                     alignItems={'center'}
                     justifyContent="space-between"
                     display={isDesktop ? 'flex' : 'block'}
                  >
                     {!isLoading ? (
                        text === 'currency' ? (
                           <FormControl fullWidth>
                              <InputLabel id="demo-simple-select-disabled-label">
                                 {label} {text === 'retryTiming' && '(seconds)'}
                                 (
                                 {typeMultine &&
                                 ![
                                    'minStakeByCurrency',
                                    'maxStakeByCurrency',
                                    'maxWinAmountByCurrency',
                                 ].includes(text)
                                    ? `${typeMultine}[]`
                                    : type}
                                 )
                              </InputLabel>
                              <Select
                                 labelId="demo-simple-select-label"
                                 id="demo-simple-select"
                                 sx={{
                                    width: '100%',
                                 }}
                                 disabled={disabled}
                                 value={value}
                                 name={text}
                                 onChange={props.handleChange}
                                 IconComponent={() => (
                                    <IconAngleDown className="selectIcon" />
                                 )}
                              >
                                 {usedCurrencies?.map((item, index: number) => {
                                    return (
                                       <MenuItem
                                          key={'currency' + index}
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
                        ) : text === 'lang' ? (
                           <FormControl fullWidth>
                              <InputLabel id="demo-simple-select-disabled-label">
                                 {label} {text === 'retryTiming' && '(seconds)'}
                                 (
                                 {typeMultine &&
                                 ![
                                    'minStakeByCurrency',
                                    'maxStakeByCurrency',
                                    'maxWinAmountByCurrency',
                                 ].includes(text)
                                    ? `${typeMultine}[]`
                                    : type}
                                 )
                              </InputLabel>
                              <Select
                                 labelId="demo-simple-select-label"
                                 id="demo-simple-select"
                                 sx={{
                                    width: '100%',
                                 }}
                                 disabled={disabled}
                                 value={value}
                                 name={text}
                                 onChange={props.handleChange}
                                 IconComponent={() => (
                                    <IconAngleDown className="selectIcon" />
                                 )}
                              >
                                 {languages &&
                                    languages.map((item, index: number) => {
                                       return (
                                          <MenuItem
                                             key={'lang' + index}
                                             value={item.value}
                                          >
                                             <Stack
                                                direction="row"
                                                alignItems="center"
                                                gap={2}
                                                textTransform="capitalize"
                                             >
                                                {item.label}
                                             </Stack>
                                          </MenuItem>
                                       )
                                    })}
                              </Select>
                           </FormControl>
                        ) : text === 'status' ? (
                           <FormControl fullWidth>
                              <InputLabel id="demo-simple-select-disabled-label">
                                 {label} {text === 'retryTiming' && '(seconds)'}
                                 (
                                 {typeMultine &&
                                 ![
                                    'minStakeByCurrency',
                                    'maxStakeByCurrency',
                                    'maxWinAmountByCurrency',
                                 ].includes(text)
                                    ? `${typeMultine}[]`
                                    : type}
                                 )
                              </InputLabel>
                              <Select
                                 labelId="demo-simple-select-label"
                                 id="demo-simple-select"
                                 sx={{
                                    width: '100%',
                                 }}
                                 disabled={disabled}
                                 value={value}
                                 name={text}
                                 onChange={props.handleChange}
                                 IconComponent={() => (
                                    <IconAngleDown className="selectIcon" />
                                 )}
                              >
                                 <MenuItem value={OperatorStatus.ACTIVE}>
                                    <Stack
                                       direction="row"
                                       alignItems="center"
                                       gap={2}
                                       textTransform="capitalize"
                                    >
                                       {OperatorStatus.ACTIVE}
                                    </Stack>
                                 </MenuItem>
                                 <MenuItem value={OperatorStatus.DISABLED}>
                                    <Stack
                                       direction="row"
                                       alignItems="center"
                                       gap={2}
                                       textTransform="capitalize"
                                    >
                                       {OperatorStatus.DISABLED}
                                    </Stack>
                                 </MenuItem>
                                 <MenuItem value={OperatorStatus.MAINTENANCE}>
                                    <Stack
                                       direction="row"
                                       alignItems="center"
                                       gap={2}
                                       textTransform="capitalize"
                                    >
                                       {OperatorStatus.MAINTENANCE}
                                    </Stack>
                                 </MenuItem>
                              </Select>
                           </FormControl>
                        ) : text === 'gameStatus' ? (
                           <FormControl fullWidth>
                              <InputLabel id="demo-simple-select-disabled-label">
                                 {label} {text === 'retryTiming' && '(seconds)'}
                                 (
                                 {typeMultine &&
                                 ![
                                    'minStakeByCurrency',
                                    'maxStakeByCurrency',
                                    'maxWinAmountByCurrency',
                                 ].includes(text)
                                    ? `${typeMultine}[]`
                                    : type}
                                 )
                              </InputLabel>
                              <Select
                                 labelId="demo-simple-select-label"
                                 id="demo-simple-select"
                                 disabled={disabled}
                                 sx={{
                                    width: '100%',
                                 }}
                                 value={value}
                                 name={text}
                                 onChange={props.handleChange}
                                 IconComponent={() => (
                                    <IconAngleDown className="selectIcon" />
                                 )}
                              >
                                 <MenuItem value={GameStatus.ACTIVE}>
                                    <Stack
                                       direction="row"
                                       alignItems="center"
                                       gap={2}
                                       textTransform="capitalize"
                                    >
                                       {GameStatus.ACTIVE}
                                    </Stack>
                                 </MenuItem>
                                 <MenuItem value={GameStatus.DISABLED}>
                                    <Stack
                                       direction="row"
                                       alignItems="center"
                                       gap={2}
                                       textTransform="capitalize"
                                    >
                                       {GameStatus.DISABLED}
                                    </Stack>
                                 </MenuItem>
                                 <MenuItem value={GameStatus.MAINTENANCE}>
                                    <Stack
                                       direction="row"
                                       alignItems="center"
                                       gap={2}
                                       textTransform="capitalize"
                                    >
                                       {GameStatus.MAINTENANCE}
                                    </Stack>
                                 </MenuItem>
                                 <MenuItem value={GameStatus.DEPRECATE}>
                                    <Stack
                                       direction="row"
                                       alignItems="center"
                                       gap={2}
                                       textTransform="capitalize"
                                    >
                                       {GameStatus.DEPRECATE}
                                    </Stack>
                                 </MenuItem>
                              </Select>
                           </FormControl>
                        ) : text === 'connectionType' ? (
                           <FormControl fullWidth>
                              <InputLabel id="demo-simple-select-disabled-label">
                                 {label} {text === 'retryTiming' && '(seconds)'}
                                 (
                                 {typeMultine &&
                                 ![
                                    'minStakeByCurrency',
                                    'maxStakeByCurrency',
                                    'maxWinAmountByCurrency',
                                 ].includes(text)
                                    ? `${typeMultine}[]`
                                    : type}
                                 )
                              </InputLabel>
                              <Select
                                 labelId="demo-simple-select-label"
                                 id="demo-simple-select"
                                 sx={{
                                    width: '100%',
                                 }}
                                 disabled={disabled}
                                 value={value}
                                 name={text}
                                 onChange={props.handleChange}
                                 IconComponent={() => (
                                    <IconAngleDown className="selectIcon" />
                                 )}
                              >
                                 {ConnectionType &&
                                    Object.values(ConnectionType).map(
                                       (item, index: number) => {
                                          return (
                                             <MenuItem
                                                key={'connectionType' + index}
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
                                       }
                                    )}
                              </Select>
                           </FormControl>
                        ) : text === 'theme' ? (
                           <FormControl fullWidth>
                              <InputLabel id="demo-simple-select-disabled-label">
                                 {label} {text === 'retryTiming' && '(seconds)'}
                                 (
                                 {typeMultine &&
                                 ![
                                    'minStakeByCurrency',
                                    'maxStakeByCurrency',
                                    'maxWinAmountByCurrency',
                                 ].includes(text)
                                    ? `${typeMultine}[]`
                                    : type}
                                 )
                              </InputLabel>
                              <Select
                                 labelId="demo-simple-select-label"
                                 id="demo-simple-select"
                                 sx={{
                                    width: '100%',
                                 }}
                                 disabled={disabled}
                                 value={value}
                                 name={text}
                                 onChange={props.handleChange}
                                 IconComponent={() => (
                                    <IconAngleDown className="selectIcon" />
                                 )}
                              >
                                 <MenuItem value={THEME.DARK}>
                                    <Stack
                                       direction="row"
                                       alignItems="center"
                                       gap={2}
                                       textTransform="capitalize"
                                    >
                                       {THEME.DARK}
                                    </Stack>
                                 </MenuItem>
                                 <MenuItem value={THEME.LIGHT}>
                                    <Stack
                                       direction="row"
                                       alignItems="center"
                                       gap={2}
                                       textTransform="capitalize"
                                    >
                                       {THEME.LIGHT}
                                    </Stack>
                                 </MenuItem>
                              </Select>
                           </FormControl>
                        ) : (
                           <TextField
                              name={text}
                              type={type}
                              label={`${label} ${
                                 text === 'retryTiming' ? '(seconds)' : ''
                              } (${
                                 typeMultine &&
                                 ![
                                    'minStakeByCurrency',
                                    'maxStakeByCurrency',
                                    'maxWinAmountByCurrency',
                                 ].includes(text)
                                    ? `${
                                         typeMultine !== 'undefined'
                                            ? typeMultine
                                            : ''
                                      }[]`
                                    : type
                              })`}
                              value={value}
                              disabled={
                                 text === 'opId' ||
                                 text === 'gameId' ||
                                 disabled
                              }
                              fullWidth
                              multiline={multiline}
                              onChange={props.handleChange}
                              variant="outlined"
                           />
                        )
                     ) : (
                        <Skeleton variant="text" sx={{ flex: 0.5 }} />
                     )}
                  </Stack>
               </Stack>
            </FormControl>
         )}
      </Stack>
   )
}

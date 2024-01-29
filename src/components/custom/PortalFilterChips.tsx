import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faCircleXmark } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Chip, Stack, useTheme } from '@mui/material'
import 'swiper/css'
import { Swiper, SwiperSlide } from 'swiper/react'

export interface FilterChip {
   key: number
   label: string
   value: string
   hideValue?: boolean
}

export interface PortalFilterChipsProps {
   chips: FilterChip[]
   handleDelete?: Function
}

const PortalFilterChips = (props: PortalFilterChipsProps) => {
   const { chips, handleDelete } = props
   const theme = useTheme()

   return (
      <Stack
         width={1}
         maxWidth={950}
         sx={{
            '.swiper': {
               m: 0,
               '&-slide': { width: 'auto !important' },
            },
         }}
         direction="row"
         p={0}
         alignItems="center"
         justifyContent={['flex-start', null, 'flex-end']}
         flexWrap="wrap"
      >
         <Swiper cssMode spaceBetween={3} slidesPerView={1}>
            {chips?.map((chip) => {
               return (
                  chip.value &&
                  chip.value !== 'all' && handleDelete && (
                     <SwiperSlide key={chip.key}>
                        <Chip
                           label={
                              chip.hideValue
                                 ? `${chip.label}`
                                 : `${chip.label}: ${chip.value}`
                           }
                           onDelete={handleDelete(chip)}
                           key={chip.key}
                           deleteIcon={
                              <FontAwesomeIcon
                                 icon={faCircleXmark as IconProp}
                                 fixedWidth
                              />
                           }
                           sx={{
                              background: '#1570EF',
                              color: theme.palette.secondary.contrastText,
                              fontSize: theme.breakpoints.up('sm')
                                 ? '12px'
                                 : '10px',
                              padding: '4px 8px',
                              gap: '6px',
                              borderRadius: '39px',
                              fontFamily: 'Nunito Sans SemiBold',
                              span: {
                                 padding: 0,
                              },
                              justifyContent: 'center',
                              alignItems: 'center',
                              '.MuiChip-deleteIcon': {
                                 margin: 0,
                                 color: '#fff',
                                 fontSize: '16px',
                                 height: '16px',
                                 width: '16px',
                              },
                           }}
                        />
                     </SwiperSlide>
                  )
               )
            })}
         </Swiper>
      </Stack>
   )
}

export default PortalFilterChips

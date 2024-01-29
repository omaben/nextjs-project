import useTheme from 'hooks/useTheme'
import createTheme from 'theme'
import { ImoonGray, secondary } from '../../colors'
function GridStyle() {
   const { theme } = useTheme()
   const gridStyle = {
      '&': {
         width: '100%',
         background: '#fff',
         borderRadius: '16px'
      },
      '.MuiTablePagination-selectIcon': {
         color: ImoonGray[1],
      },
      // '.MuiDataGrid-sortIcon': {
      //    opacity: ' 1 !important'
      // },
      '.MuiDataGrid-toolbarContainer': {
         position: 'fixed',
         zIndex: 1,
         width: '100%',
         left: 0,
         padding: 0,
         '&.isDesktop': {
            width: 'calc(100%- 220px)',
            left: '225px'
         },
         '.MuiToolbar-root': {
            width: '100%',
            border: 0
         }
      },
      '&.editToolbar': {
         background: 'transparent',
         '.MuiDataGrid-toolbarContainer': {
            position: 'fixed',
            left: 'initial',
            top: '47px',
            right: '24px',
            width: 'auto'
         },
         '.MuiDataGrid-main': {
            marginTop: '10px',
            background: '#fff',
            borderTopLeftRadius: '16px',
            borderTopRightRadius: '16px',
            '.MuiDataGrid-rowCount': {
               height: '100%'
            }
         },
         '&.details': {
            '.MuiDataGrid-toolbarContainer': {
               right: '98px',
               '&.isMobile': {
                  top: '38px',
                  right: '87px'
               }
            },
         }
      },
      '.MuiCheckbox-root': {
         padding: '0px',

      },
      // '.MuiDataGrid-cellCheckbox, .MuiDataGrid-cell--withRenderer':{
      //    minHeight: '38px !important',
      //    height: '38px !important'
      // },
      '&.MuiDataGrid-root.MuiDataGrid-autoHeight': {
         minHeight: '400px !important',
      },
      '&.MuiDataGrid-root.MuiDataGrid-autoHeight.detailGrid': {
         minHeight: 'initial !important',
      },
      '.even.MuiDataGrid-row': {
         backgroundColor: createTheme(theme).palette.background.paper,
         maxHeight: 'max-content!important',
         minHeight: '38px !important',
         '@media (max-width: 768px)': {
            // Font size for screens up to 768px width (mobile)
            minHeight: '30px !important',
         },
      },
      '.odd.MuiDataGrid-row': {
         backgroundColor: '#F6F5F9',
         maxHeight: 'max-content!important',
         minHeight: '38px !important',
         '@media (max-width: 768px)': {
            // Font size for screens up to 768px width (mobile)
            minHeight: '30px !important',
         },
      },
      '.errorClass.MuiDataGrid-row': {
         backgroundColor: createTheme(theme).palette.error.light,
      },
      '.MuiDataGrid-overlay': {
         backgroundColor: createTheme(theme).palette.background.default,
         height: 'calc(100% + 20px)'
      },

      '::-webkit-scrollbar': {
         height: '.5em',
      },
      '::-webkit-scrollbar-track': {
         boxShadow: `inset 0 0 6px ${createTheme(theme).palette.background.default}`,
      },
      '::-webkit-scrollbar-thumb': {
         backgroundColor: createTheme(theme).palette.background.default,
         outline: `1px solid ${createTheme(theme).palette.background.default}`,
      },
      border: 'none',

      '.detailGrid': {
         '.MuiDataGrid-columnHeaders': {
            backgroundColor: 'transparent',
            fontFamily: 'Nunito Sans Bold',
            fontSize: '0.75rem',
            height: '26px!important',
            minHeight: '26px !important',
            maxHeight: '26px !important',
            lineHeight: '26px !important',
         },
         '.MuiDataGrid-row': {
            backgroundColor: createTheme(theme).palette.divider,
            borderBottom: `1px solid ${createTheme(theme).palette.divider}`,
            color: secondary[5],
         },
         '.MuiDataGrid-virtualScroller': {
            marginTop: '26px !important',
         },
      },
      '.MuiDataGrid-editBooleanCell': {
         justifyContent: 'left'
      },
      '.MuiDataGrid-columnHeaders': {
         border: 'none',
         backgroundColor: createTheme(theme).components?.MuiTableHead?.styleOverrides?.root,
         borderBottom: `1px solid ${createTheme(theme).palette.divider}`,
         minHeight: '36px !important',
         maxHeight: '36px !important',
         lineHeight: '36px !important',
         fontFamily: 'Nunito Sans Bold',
         fontSize: createTheme(theme).components?.MuiTableHead?.styleOverrides?.root,
         borderTopLeftRadius: '8px',
         borderTopRightRadius: '8px'
      },
      '.MuiDataGrid-columnHeader--sorted ': {
         color: '#6172F3'
      },
      '.MuiDataGrid-columnHeader ': {
         height: '36px !important',
         justifyContent: 'center',
         '&:focus, &:focus-within': {
            outline: 'none',
         },
         '.MuiDataGrid-iconButtonContainer': {
            visibility: 'visible',
            width: 'auto',
            '.MuiButtonBase-root': {
               padding: 0,
               // opacity: '1 !important',
               '&:hover': {
                  background: 'transparent',
               },
               'svg path': {
                  stroke: createTheme(theme).palette.text.primary,
               },
            },
         },
         '.MuiDataGrid-columnHeaderTitleContainer': {
            fontFamily: 'Nunito Sans Bold',
         },
         '&::after': {
            content: '""',
            position: 'absolute',
            width: '1px',
            height: '12px',
            flexShrink: 0,
            right: 0,
            top: '12px',
            background: ImoonGray[6]
         },
         '&:last-child::after': {
            display: 'none'
         }

      },
      '.MuiDataGrid-cell': {
         border: 'none',
         fontFamily: 'Nunito Sans SemiBold',
         fontSize: '12px',
         paddingLeft: '6px',
         paddingRight: '6px',
         '.MuiStack-root': {
            lineHeight: '11.6px',
            '.MuiTypography-root': {
               lineHeight: '11.6px',
            }
         },

         maxHeight: 'max-content!important',
         position: 'relative',
         // minHeight: '30px !important',
         '&::after': {
            content: '""',
            position: 'absolute',
            width: '1px',
            height: '12px',
            flexShrink: 0,
            right: 0,
            top: '16px',
            background: ImoonGray[12]
         },
         '@media (max-width: 768px)': {
            // Font size for screens up to 768px width (mobile)
            fontSize: '10px !important',
            '&::after': {
               top: '12px',
            }
         },
         '&:last-child::after': {
            display: 'none'
         }
      },
      '.MuiDataGrid-columnSeparator--sideRight': {
         opacity: '0 !important',
      },
      '.full-name-column': {
         color: secondary[6],
         fontFamily: 'Nunito Sans Bold',
         fontSize: '0.875rem',
      },
      '.caption-column': {
         fontFamily: 'Nunito Sans SemiBold',
         fontSize: '0.75rem',
         color: ImoonGray[1],
      },
      '.MuiTablePagination-selectLabel': {
         fontSize: createTheme(theme).breakpoints.down('sm') ? '10px' : '12px',
         'svg': {
            color: ImoonGray[1],
         }
      },

      '.MuiDataGrid-footerContainer, .pagination-data': {
         width: '100%',
         display: 'block',
         color: ImoonGray[1],
         fontSize: createTheme(theme).breakpoints.down('sm') ? '10px' : '12px',
         minHeight: '30px !important',
         height: '30px !important',
         background: createTheme(theme).palette.primary.contrastText,
         borderTop: `1px solid ${ImoonGray[11]}`,
         borderBottomLeftRadius: '8px',
         borderBottomRightRadius: '8px',
         '.MuiSelect-select': {
            paddingTop: 0,
            paddingBottom: 0
         },
         '.MuiToolbar-root': {
            height: '30px'
         },
         '.MuiDataGrid-rowCount': {
            height: '100%'
         },
         '.MuiBox-root': {
            display: 'block',
            width: '100%',
            textAlign: 'center',
         },
         '.first_table_pagination': {
            display: 'inline-flex',
            float: 'left',
            fontFamily: 'Nunito Sans SemiBold',
            fontSize: '0.75rem',
            '.MuiToolbar-root': {
               padding: 0,
               minHeight: '30px !important',
            },
            '.MuiTablePagination-selectLabel': {
               display: 'none',
            },
            '.MuiInputBase-root': {
               display: 'none',
            },
            '.MuiTablePagination-actions': {
               display: 'none',
            },
         },
         '.MuiPagination-root': {
            display: 'inline-flex',
            position: 'relative',
            top: '10px',
            button: {
               fontFamily: 'Nunito Sans Bold',
               fontSize: '0.875rem',
               '&.Mui-selected': {
                  color: ImoonGray[1],
                  background: 'transparent',
                  fontFamily: 'Nunito Sans SemiBold',
                  fontSize: '1rem',
               },
            },
         },
         '.MuiInputBase-root': {
            margin: 0,
            marginRight: '20px',
            color: ImoonGray[1],
            padding: '0 !important',
            minHeight: 'initial'
         },
         '.last_table_pagination': {
            display: 'inline-flex',
            float: 'right',
            '.MuiToolbar-root': {
               padding: 0,
               minHeight: '30px !important',
            },

            '.MuiTablePagination-selectLabel': {
               color: ImoonGray[1],
               fontFamily: 'Nunito Sans SemiBold',
               fontSize: createTheme(theme).breakpoints.down('sm') ? '10px' : '12px',
               marginRight: '10px',
               'svg': {
                  color: ImoonGray[1],
               }
            },
            '.MuiTablePagination-displayedRows': {
               display: 'none',
            },
            '.MuiTablePagination-actions': {
               display: 'none',
            },
         },
      },
      '.MuiTablePagination-displayedRows': {
         margin: 0,
         fontSize: '10px'
      },
      '.MuiToolbar-root': {
         minHeight: '30px !important',
         borderTop: `1px solid ${ImoonGray[11]}`,
         color: ImoonGray[1]
      },
      '.MuiTablePagination-actions .MuiIconButton-root': {
         padding: 0
      },
      '.MuiTablePagination-actions svg': {
         color: ImoonGray[1]
      },
      '.MuiTablePagination-actions .Mui-disabled  svg': {
         color: ImoonGray[11]
      },
      '.MuiDataGrid-selectedRowCount': {
         display: 'none',
      },
      '.MuiDataGrid-columnHeaderTitleContainerContent': {
         justifyContent: 'center',
      },
      '.MuiDataGrid-cell:focus, .MuiDataGrid-cell:focus-within': {
         outline: 'none',
      },
   }
   return gridStyle
}

export default GridStyle

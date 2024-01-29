import { ImoonGray, darkPurple } from "colors"

// Define default component configurations for Material-UI components
const components = {
   MuiGrid: {
      styleOverrides: {
         root: {
            // marginTop: 0
         }
      }
   },
   MuiButtonBase: {
      defaultProps: {
         disableRipple: true,
      },
   },
   MuiButton: {
      styleOverrides: {
         root: {
            fontSize: '12px',
            fontFamily: 'Nunito Sans SemiBold',
            borderRadius: '8px',
            padding: '8px',
            lineHeight: '15.6px',
            boxShadow: 'none !important',
         }
      }
   },
   MuiLink: {
      defaultProps: {
         underline: 'hover',
      },
   },
   MuiList: {
      styleOverrides: {
         root: {
            paddingTop: 0,
            paddingBottom: 0,
            '.MuiButtonBase-root': {
               minHeight: 'initial'
            }
         }
      }
   },
   MuiCardHeader: {
      defaultProps: {
         titleTypographyProps: {
            color: darkPurple[12]
         },
      },
      styleOverrides: {
         root: {
            padding: '12px',
            background: darkPurple[4],
            color: darkPurple[12],
            minHeight: '40px'
         },
         action: {
            marginTop: '-4px',
            marginRight: '-4px',
         },
      },
   },
   MuiCard: {
      styleOverrides: {
         root: {
            boxShadow:
               'none',
            backgroundImage: 'none',
            marginBottom: '0',
            borderRadius: '8px !important',
         },
      },
   },
   MuiCardContent: {
      styleOverrides: {
         root: {
            padding: '10px'
         }
      }
   },
   MuiCardActions: {
      styleOverrides: {
         root: {
            '.MuiButton-root:hover': {
               backgroundColor: '#1570EF'
            }
         }
      }
   },
   MuiPaper: {
      styleOverrides: {
         root: {
            backgroundImage: 'none',
            position: 'relative',
            '&.MuiMenu-paper': {
               // marginLeft: '-6px !important'
            }
         },
      },
   },
   MuiPickersDay: {
      styleOverrides: {
         day: {
         },
      },
   },
   MuiPickersYear: {
      styleOverrides: {
         root: {
            height: '64px',
         },
      },
   },
   MuiPickersCalendar: {
      styleOverrides: {
         transitionContainer: {
            marginTop: '6px',
         },
      },
   },
   MuiPickersCalendarHeader: {
      styleOverrides: {
         iconButton: {
            backgroundColor: 'transparent',
            '& > *': {
               backgroundColor: 'transparent',
            },
         },
         switchHeader: {
            marginTop: '2px',
            marginBottom: '4px',
         },
      },
   },
   MuiPickersClock: {
      styleOverrides: {
         container: {
            margin: `32px 0 4px`,
         },
      },
   },
   MuiPickersClockNumber: {
      styleOverrides: {
         clockNumber: {
            left: `calc(50% - 16px)`,
            width: '32px',
            height: '32px',
         },
      },
   },
   MuiPickerDTHeader: {
      styleOverrides: {
         dateHeader: {
            '& h4': {
               fontSize: '2.125rem',
            },
         },
         timeHeader: {
            '& h3': {
               fontSize: '3rem',
            },
         },
      },
   },
   MuiPickersTimePicker: {
      styleOverrides: {
         hourMinuteLabel: {
            '& h2': {
               fontSize: '3.75rem',
            },
         },
      },
   },
   MuiToolbar: {
      styleOverrides: {
         root: {
            padding: '0 12px'
         }
      }
   },
   MuiPickersToolbar: {
      styleOverrides: {
         toolbar: {
            '& h4': {
               fontSize: '2.125rem',
            },
         },
      },
   },
   MuiChip: {
      styleOverrides: {
         root: {
            borderRadius: '10px',
            fontFamily: 'Nunito Sans Bold',
            height: '30px',
            '.MuiChip-label': { textOverflow: 'initial', overflow: 'initial' },
         },
      },
   },
   MuiTabs: {
      styleOverrides: {
         root: {
            textAlign: 'center',
            minHeight: 'initial',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            '.MuiTabs-indicator': {
               background: '#444CE7'
            },
            '.MuiTabs-flexContainer': {
               gap: '8px'
            },
            '.MuiButtonBase-root': {
               display: 'inline-block',
               minHeight: 'initial',
               minWidth: '80px',
               padding: '4px',
               fontSize: '12px !important',
               fontFamily: 'Nunito Sans Bold',
               color: ImoonGray[7],
               lineHeight: '16px',
               letterSpacing: '0.48px',
               height: '34px',
               svg: {
                  margin: 0,
                  marginRight: '10px',
                  height: '16px'
               },
               '&.Mui-selected': {
                  color: '#444CE7'
               }
            },
            '.MuiTabs-scrollButtons': {
               minWidth: 'max-content',
               width: '24px',
               height: 'max-content',
               lineHeight: 0,
               padding: 0,
               svg: {
                  width: '24px',
                  height: 'initial',
                  marginRight: '0',
               }
            },
            '.MuiTabs-scroller': {
               '@media (max-width: 768px)': {
                  width: '340px',
                  maxWidth: '340px'
               },
               margin: '0 8px',
               // justifyContent: 'center',
               display: 'flex',
               width: '80%',
               maxWidth: 'fit-content'
            }
         },
      },
   },
   MuiTabPanel: {
      styleOverrides: {
         root: {
            padding: '0 !important'
         }
      }
   },
   MuiSelect: {
      styleOverrides: {
         root: {
            '.MuiSelect-select': {
               padding: '0',
            },
            svg: {
               width: '16px',
               position: 'relative',
               top: '-4px',
               color: darkPurple[7]
            },
            '.MuiInputBase-input': {
               fontSize: '12px',
               '.MuiStack-root': {
                  position: 'relative',
                  top: '1px'
               }
            },
         },
      },
   },
   MuiInputBase: {
      styleOverrides: {
         root: {
            padding: '8px 16px !important',
            paddingBottom: '0!important',
            minHeight: '48px',
            borderRadius: '8px !important',
            '&.MuiOutlinedInput-root .MuiInputBase-input.MuiInputBase-inputMultiline': {
               paddingRight: '5px',
               paddingTop: 12
            },
            '.MuiInputBase-input': {
               // padding: '9.5px 14px'
               padding: '0',
               fontSize: '12px',
               '&:-webkit-autofill': {
                  boxShadow: 'none !important',
               },
            },
            'svg': {
               width: '20px',
               height: '20px'
            }
         },
      },
   },
   MuiFormControlLabel: {
      styleOverrides: {
         root: {
            margin: 0,
            '.MuiCheckbox-root': {
               padding: '2px',
               borderRadius: '4px',
               'svg': {
                  color: `${ImoonGray[10]}`,
                  width: '20px',
                  height: '20px'
               },
               '&.Mui-checked': {
                  svg: {
                     color: '#1570EF'
                  }
               }
            },
            '.MuiTypography-root': {
               fontFamily: 'Nunito Sans SemiBold',
               fontSize: '12px'
            },
         }
      }
   },
   MuiFormControl: {
      styleOverrides: {
         root: {
            // marginTop: '15px !important',
            '.MuiInputBase-root': {
               'svg.selectIcon': {
                  position: 'absolute',
                  cursor: 'pointer',
                  pointerEvents: 'none',
                  right: '16px',
                  height: '16px',
                  top: '16px',
                  width: '16px',
               },
            },
            marginTop: '6px',
            '&.withLeftIcon': {
               svg: {
                  height: '22px',
                  position: 'absolute',
                  left: '9px',
                  top: '12px',
                  color: darkPurple[7],
               },
               '.MuiInputBase-root': { paddingLeft: '35px !important' },
               label: {
                  paddingLeft: '25px !important',
               },
            },
            '.MuiFormControl-root': {
               marginTop: 0,
            },
            '.MuiCheckbox-root': {
               paddingRight: 0,
               paddingLeft: '20px',
            },
            '.MuiSvgIcon-root': {
               color: ImoonGray[10],
            },
            '.MuiFormLabel-root': {
               top: '0px',
               color: `${darkPurple[9]} !important`,
               fontFamily: 'Nunito Sans SemiBold',
               fontSize: 12,
               '&.MuiFormLabel-filled, &.Mui-focused, &.MuiInputLabel-shrink': {
                  top: 18,
               },
            },
            'input': {
               color: darkPurple[1],
               fontFamily: 'Nunito Sans SemiBold',
               fontSize: '12px !important'
            },
            'fieldset': {
               top: '0 !important',
               border: `1px solid ${darkPurple[9]}!important`
            },
            'fieldset legend': {
               display: 'none'
            }
         },
      },
   },
   MuiTableHead: {
      styleOverrides: {
         root: {
            fontSize: 10,
            '.MuiTableCell-root': {
               padding: '12px',
               background: darkPurple[4],
               height: '38px',
               '&:first-of-type': {
                  textAlign: 'left'
               }
            }
         },
      },
   },
   MuiTableCell: {
      styleOverrides: {
         root: {
            padding: '5px 12px',
            textAlign: 'center',
            '&:first-of-type': {
               textAlign: 'left'
            }
         },
      },
   },
   MuiDialog: {
      styleOverrides: {
         root: {
            height: `calc(100% - 40px)`,
            right: 0,
            // maxWidth: '600px',
            marginTop: '40px',
            '.MuiDialogActions-root ': {
               justifyContent: 'center'
            },
            '.MuiDialog-container': {
               alignItems: 'start',
               justifyContent: 'end',
               '.MuiPaper-root': {
                  maxWidth: '550px',
                  padding: '8px',
                  '@media (max-width: 768px)': {
                     maxWidth: '100%',
                  }
               },
            },
            '&.dateToolbar': {
               '.MuiDialog-container': {
                  '.MuiPaper-root': {
                     padding: '0 12px',
                  },
               }
            },
            '.MuiDialog-paper': {
               background: ImoonGray[12],
               margin: 0,
               maxWidth: 'initial',
               width: '100%',
               borderRadius: 0,
               padding: '24px 4px',
            },
            h6: {
               marginBottom: 0,
               padding: '12px'
            }
         },
      },
   },

   MuiTable: {
      styleOverrides: {
         root: {
            fontSize: 24,
            'tbody tr:nth-of-type(odd)': {
               background: '#F6F5F9'
            },
            'tbody tr td,tr th ': {
               padding: '6px 12px',
               position: 'relative'
            },
            'tbody tr td::after,  tr th::after': {
               content: '""',
               position: 'absolute',
               width: '1px',
               height: '12px',
               flexShrink: 0,
               right: 0,
               top: '12px',
               background: ImoonGray[12],
               '@media (max-width: 768px)': {
                  top: '6px',
               }
            },
            'tbody tr td:last-child::after,  tr th:last-child::after': {
               display: 'none'
            },
            'thead tr th::after': {
               top: 12,
               background: ImoonGray[6]
            }

         },
      },
   },

   MuiAccordion: {
      styleOverrides: {
         root: {
            margin: '0 !important',
            borderRadius: '8px',
            '.MuiAccordionSummary-root': {
               minHeight: '40px !important',
               height: '40px !important',
               padding: '12px',
               background: ImoonGray[4],
               borderTopLeftRadius: '8px',
               borderTopRightRadius: '8px',
               color: darkPurple[12],
               marginTop: '6px',
               h6: {
                  color: darkPurple[12],
               },
               svg: {
                  color: darkPurple[12],
                  width: '24px',
                  height: '24px'
               }
            },
            '.MuiCollapse-root': {
               background: darkPurple[12],
            }
         }
      }
   }
}

export default components

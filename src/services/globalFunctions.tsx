import { Currency } from '@alienbackoffice/back-front';
import styled from '@emotion/styled';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
   faArrowDownFromLine,
   faArrowUpFromLine,
   faArrowsLeftRightToLine,
   faCaretDown,
   faCaretUp,
   faChartLineUp,
   faCircleExclamation,
   faGamepad,
   faSort,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
   Autocomplete,
   AutocompleteValue,
   Box,
   Chip,
   TextField,
   Typography,
   UseAutocompleteProps,
   useMediaQuery,
   useTheme,
} from '@mui/material';
import {
   GridRenderEditCellParams,
   useGridApiContext,
} from '@mui/x-data-grid-pro';
import { ImoonGray, darkPurple } from 'colors';
import moment from 'moment';
import numeral from 'numeral';
import { useWindowSize } from 'react-use';
import { store } from 'redux/store';
import { BetMode } from 'types';

const passwordRegex = new RegExp(
   /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).{6,20}$/
);

const userNameRegex = new RegExp(/^[a-z0-9.]{4,20}$/);
/**
 * Format a number to a human-readable string with K (thousands) or M (millions) suffix.
 *
 * @param {number} num - The number to format.
 * @returns {string} - The formatted number as a string.
 */
const numFormatter = (num: number): string => {
   if (num >= 1000000) {
      // If the number is in millions, format with one decimal place and 'M' suffix.
      return (num / 1000000).toFixed(1) + 'M';
   } else if (num >= 1000) {
      // If the number is in thousands, format with one decimal place and 'K' suffix.
      return (num / 1000).toFixed(1) + 'K';
   } else {
      // For numbers less than 1000, no suffix or decimal places are added.
      return num.toString();
   }
};

/**
 * Format a number with commas as thousands separators and a minimum precision of two decimal places.
 * If the number is very close to zero (less than 0.000001), it will be formatted as 0.
 *
 * @param {number} value - The number to format.
 * @returns {string} - The formatted number as a string.
 */
const formatNumberWithCommas = (value: number): string => {
   if (Math.abs(value) < 0.000001) {
      return '0';
   }

   // Format the number with commas and a minimum precision of two decimal places.
   return numeral(value).format('0,0.[00]');
};

/**
 * Prevents specific characters ('e', 'E', '+', and '-') from being input into a div element.
 *
 * @param {React.KeyboardEvent<HTMLDivElement>} event - The keyboard event.
 */
const preventInvalidCharacters = (
   event: React.KeyboardEvent<HTMLDivElement>
) => {
   const invalidCharacters = ['e', 'E', '+', '-'];
   if (invalidCharacters.includes(event.key)) {
      event.preventDefault();
   }
};

const StyledGridOverlay = styled('div')(({ theme }) => ({
   display: 'flex',
   flexDirection: 'column',
   alignItems: 'center',
   justifyContent: 'center',
   height: '100%',
   paddingBottom: '20px',
   '& .ant-empty-img-1': {
      fill: theme.palette.mode === 'light' ? '#aeb8c2' : '#262626',
   },
   '& .ant-empty-img-2': {
      fill: theme.palette.mode === 'light' ? '#f5f5f7' : '#595959',
   },
   '& .ant-empty-img-3': {
      fill: theme.palette.mode === 'light' ? '#dce0e6' : '#434343',
   },
   '& .ant-empty-img-4': {
      fill: theme.palette.mode === 'light' ? '#fff' : '#1c1c1c',
   },
   '& .ant-empty-img-5': {
      fillOpacity: theme.palette.mode === 'light' ? '0.8' : '0.08',
      fill: theme.palette.mode === 'light' ? '#f5f5f5' : '#fff',
   },
}));

const StyledGridOverlayBrand = styled('div')(({ theme }) => ({
   display: 'flex',
   flexDirection: 'column',
   alignItems: 'center',
   justifyContent: 'center',
   width: '100%',
   height: '100%',
   paddingBottom: '20px',
   '& .ant-empty-img-1': {
      fill: theme.palette.mode === 'light' ? '#aeb8c2' : '#262626',
   },
   '& .ant-empty-img-2': {
      fill: theme.palette.mode === 'light' ? '#f5f5f7' : '#595959',
   },
   '& .ant-empty-img-3': {
      fill: theme.palette.mode === 'light' ? '#dce0e6' : '#434343',
   },
   '& .ant-empty-img-4': {
      fill: theme.palette.mode === 'light' ? '#fff' : '#1c1c1c',
   },
   '& .ant-empty-img-5': {
      fillOpacity: theme.palette.mode === 'light' ? '0.8' : '0.08',
      fill: theme.palette.mode === 'light' ? '#f5f5f5' : '#fff',
   },
}));
/**
 * SVG component for displaying empty rows.
 */
function EmptyRowsSVG() {
   return (
      <svg
         width="120"
         height="100"
         viewBox="0 0 184 152"
         aria-hidden
         focusable="false"
      >
         <g fill="none" fillRule="evenodd">
            <g transform="translate(24 31.67)">
               <ellipse
                  className="ant-empty-img-5"
                  cx="67.797"
                  cy="106.89"
                  rx="67.797"
                  ry="12.668"
               />
               <path
                  className="ant-empty-img-1"
                  d="M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z"
               />
               <path
                  className="ant-empty-img-2"
                  d="M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z"
               />
               <path
                  className="ant-empty-img-3"
                  d="M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z"
               />
            </g>
            <path
               className="ant-empty-img-3"
               d="M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z"
            />
            <g className="ant-empty-img-4" transform="translate(149.65 15.383)">
               <ellipse cx="20.654" cy="3.167" rx="2.849" ry="2.815" />
               <path d="M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z" />
            </g>
         </g>
      </svg>
   );
}

/**
 * Custom overlay component for displaying when there are no rows.
 */
function CustomNoRowsOverlay() {
   return (
      <StyledGridOverlay>
         <EmptyRowsSVG />
      </StyledGridOverlay>
   );
}

/**
 * Custom overlay component for sort.
 */
function CustomMenuSortAscendingIcon() {
   return (
      <FontAwesomeIcon
         icon={faCaretUp as IconProp}
         fixedWidth
         fontSize={10}
         color={'#6172F3'}
      />
   );
}

/**
 * Custom overlay component for sort.
 */
function CustomMenuSortDescendingIcon() {
   return (
      <FontAwesomeIcon
         icon={faCaretDown as IconProp}
         fixedWidth
         fontSize={10}
         color={'#6172F3'}
      />
   );
}

/**
 * Custom overlay component for sort.
 */
function CustomMenuSortIcon() {
   return (
      <FontAwesomeIcon
         icon={faSort as IconProp}
         fixedWidth
         fontSize={10}
         color={darkPurple[12]}
      />
   );
}

/**
 * AutocompleteEditCell component for rendering editable cells with autocompletion.
 *
 * @param props - Props for the component.
 */
function AutocompleteEditCell<
   T extends Currency,
   Multiple extends boolean = false,
   DisableClearable extends boolean = false,
   FreeSolo extends boolean = false
>(
   props: GridRenderEditCellParams & {
      options: UseAutocompleteProps<
         T,
         Multiple,
         DisableClearable,
         FreeSolo
      >['options'];
      disableClearable: DisableClearable;
      multiple: Multiple;
      freeSolo: FreeSolo;
   }
) {
   const { id, value, field, options, disableClearable, multiple, freeSolo } =
      props;

   const apiRef = useGridApiContext();

   const handleValueChange = (
      _: any,
      newValue: AutocompleteValue<T, Multiple, DisableClearable, FreeSolo>
   ) => {
      apiRef.current.setEditCellValue({
         id,
         field,
         // @ts-expect-error i can't figure out how to use AutocompleteValue
         value: typeof newValue === 'string' ? value : newValue?.value || '',
      });
   };

   const defaultValue = options.find((o) => o.code === value)?.currency || '';

   return (
      <Autocomplete<T, Multiple, DisableClearable, FreeSolo>
         fullWidth
         disableClearable={disableClearable}
         multiple={multiple}
         options={options}
         freeSolo={freeSolo}
         // @ts-expect-error i can't figure out how to use AutocompleteValue
         value={defaultValue}
         onChange={handleValueChange}
         renderInput={(params) => <TextField {...params} />}
      />
   );
}

/**
 * Returns a Date object representing the start of the current day (00:00:00).
 * @returns {Date} A Date object with the time set to midnight.
 */
function getDefaultStartDate() {
   // Step 1: Create a Date object representing the current date and time
   const currentDate = new Date();

   // Step 2: Create a new Date object representing the same year, month, and day,
   // but with the time set to midnight (00:00:00)
   const startOfDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      0, // Hours
      0, // Minutes
      0 // Seconds
   );

   // Step 3: Return the Date object representing the start of the day
   return startOfDay;
}

/**
 * Returns a Date object representing the start of the next day (00:00:00).
 * @returns {Date} A Date object with the time set to midnight of the next day.
 */
function getDefaultEndDate() {
   // Step 1: Create a Date object representing the current date and time
   const currentDate = new Date();

   // Step 2: Increment the date by one day to get the next day
   const nextDay = new Date(currentDate);
   nextDay.setDate(currentDate.getDate() + 1);

   // Step 3: Create a new Date object representing the next day with the time set to midnight (00:00:00)
   const startOfNextDay = new Date(
      nextDay.getFullYear(),
      nextDay.getMonth(),
      nextDay.getDate(),
      0, // Hours
      0, // Minutes
      0 // Seconds
   );

   // Step 4: Return the Date object representing the start of the next day
   return startOfNextDay;
}

/**
 * Converts a date to a date with the specified timezone and format.
 * @param {Date} date - The date to convert.
 * @param {string} timezone - The target timezone (e.g., 'America/New_York').
 * @returns {string} A formatted date string.
 */
const convertDateToDateByTimeZone = (date: Date, timezone: string) => {
   return moment(date).tz(timezone).format('YYYY-MM-DD HH:mm:ss:SSS');
};

/**
 * Custom overlay component for displaying when there there is action to do.
 */
function CustomAction() {
   return (
      <StyledGridOverlayBrand>
         <Box
            sx={{
               background: ImoonGray[6],
               p: '16px',
               borderRadius: '8px',
               maxWidth: '342px',
               textAlign: 'center',
               svg: {
                  height: '32px !important',
                  width: '32px !important',
               },
            }}
         >
            <FontAwesomeIcon
               icon={faCircleExclamation}
               fixedWidth
               color={ImoonGray[9]}
            />
            <Typography
               fontFamily={'Nunito Sans SemiBold'}
               fontSize={'14px'}
               lineHeight={'16.24px'}
               color={'#fff'}
               textAlign={'center'}
            >
               Please select a brand from the dropdown menu above to view the
               wallet balance
            </Typography>
         </Box>
      </StyledGridOverlayBrand>
   );
}

// Styled component for the badge role
const BadgeRole = styled(Chip)`
   height: 16px;
   padding: 4px 8px;
   margin-left: 5px;
   border-radius: 39px;
   background: ${(props) => props.theme.sidebar.badge.background};
   letter-spacing: 0.24px;
   line-height: normal;
   z-index: 1;
   font-size: 8px !important;
   font-family: Nunito Sans ExtraBold;
   span.MuiChip-label,
   span.MuiChip-label:hover {
      cursor: pointer;
      color: ${(props) => props.theme.sidebar.badge.color};
      padding-left: ${(props) => props.theme.spacing(2)};
      padding-right: ${(props) => props.theme.spacing(2)};
   }
`;

/**
 * Custom height of page with 1 toolbar.
 */
function PageWith1Toolbar() {
   const { height } = useWindowSize();
   return `calc(${height}px - 40px)`;
}
/**
 * Custom height of page with 2 toolbar.
 */
function PageWith2Toolbar() {
   const { height } = useWindowSize();
   return `calc(${height}px - 100px)`;
}

/**
 * Custom height of page with 3 toolbar.
 */
function PageWith3Toolbar() {
   const { height } = useWindowSize();
   return `calc(${height}px - 130px)`;
}

/**
 * Custom height of page with 4 toolbar.
 */
function PageWith4Toolbar() {
   const { height } = useWindowSize();
   // const height = 500;
   return height ? `calc(${height}px - 160px)` : 500;
}

/**
 * Custom height of page with 4 toolbar.
 */
function PageWith5Toolbar() {
   const { height } = useWindowSize();
   // const height = 500;
   return height ? `calc(${height}px - 200px)` : 500;
}

/**
 * Custom height of details page with 3 toolbar.
 */
function PageWithdetails2Toolbar() {
   const theme = useTheme();
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
   const { height } = useWindowSize();
   return isDesktop ? `calc(${height}px - 180px)` : `calc(${height}px - 200px)`;
}

/**
 * Custom height of details page with 3 toolbar.
 */
function PageWithdetails3Toolbar() {
   // const theme = useTheme()
   // const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
   const { height } = useWindowSize();
   return `calc(${height}px - 240px)`;
}

/**
 * Custom height of details page with 4 toolbar.
 */
function PageWithdetails4Toolbar() {
   // const theme = useTheme()
   // const isDesktop = useMediaQuery(theme.breakpoints.up('md')) || false
   const { height } = useWindowSize();
   return `calc(${height || 0}px - 280px)`;
}

/**
 * Custom height of details page with 4 toolbar.
 */
function PageWithdetails4ToolbarWithButton() {
   const theme = useTheme();
   const isDesktop = useMediaQuery(theme.breakpoints.up('md')) || false;
   const { height } = useWindowSize();
   return isDesktop
      ? `calc(${height}px - 280px) !important`
      : `calc(${height}px - 300px) !important`;
}

/**
 * Custom height of details page with 4 toolbar.
 */
function PageWithdetails4ToolbarWithFilter() {
   const { height } = useWindowSize();
   return `calc(${height}px - 350px) !important`;
}
/**
 * Custom height of details page with 4 toolbar.
 */
function PageWithdetails3ToolbarWithFilter() {
   const { height } = useWindowSize();
   return `calc(${height}px - 310px) !important`;
}
/**
 * Custom height of details page with toolbars.
 */
function PageWithdetails() {
   const { height } = useWindowSize();
   return `calc(${height}px - 220px)`;
}

// const sumFieldInArray = (arrayData: any[], fieldToSum: string) => {
//    const values = arrayData.map((item) => item?.data['totalInUSD'][fieldToSum])

//    // Calculate the sum using the reduce function
//    const sum = values.reduce((acc, currentValue) => acc + currentValue, 0)
//    return sum
// }

const sumFieldInArray = (
   arrayData: any[],
   fieldToSum: string,
   signUp?: boolean,
   currency?: string
) => {
   const values = signUp
      ? arrayData.map((item) =>
           item?.data[currency ? currency : 'totalInUSD']
              ? item?.data[currency ? currency : 'totalInUSD'][fieldToSum][
                   'total'
                ]
              : 0
        )
      : arrayData.map((item) =>
           item?.data[currency ? currency : 'totalInUSD']
              ? item?.data[currency ? currency : 'totalInUSD'][fieldToSum]
              : 0
        );
   const sum = values.reduce((acc, currentValue) => acc + currentValue, 0);
   return sum;
};
async function fetchJsonData(url: string): Promise<any> {
   try {
      const response = await fetch(url);

      if (!response.ok) {
         throw new Error(`Failed to fetch data from ${url}`);
      }

      const jsonData = await response.json();
      return jsonData;
   } catch (error) {
      console.error('Error fetching JSON data:', error);
      throw error;
   }
}

// function getQueryParams(): Record<string, string | null> {
//    const location = useLocation()
//    const searchParams = new URLSearchParams(location.search)
//    const queryParams: Record<string, string | null> = {}

//    // Iterate over each parameter and store it in the object
//    searchParams.forEach((value, key) => {
//       queryParams[key] = value
//    })

//    return queryParams
// }

const handleFormat = (
   number: number,
   displayCurrency?: string,
   formatter?: boolean,
   hideCurrency?: boolean
): string => {
   const currencies = store.getState().auth.currenciesInit;
   const maximumDigits = currencies?.find(
      (item) => item.currency === displayCurrency
   );
   const formattedNumber = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits:
         displayCurrency === 'USD'
            ? Math.min(2, (number.toString().split('.')[1] || '').length) || 0
            : maximumDigits?.acceptedDecimals || 0,
      compactDisplay: 'short',
      notation: formatter ? 'compact' : 'standard',
   }).format(number < 0 ? number * -1 : number);

   const numberWithCurrency = `${number < 0 ? '-' : ''}${
      displayCurrency === 'USD' && !hideCurrency ? '$' : ''
   }${formattedNumber}`;
   return numberWithCurrency;
};
interface TableRefType {
   getBoundingClientRect?: () => DOMRect;
}
const handleConvertToUSD = (minBetAmount: number, USDValue?: number) => {
   const amount = USDValue ? minBetAmount * USDValue : 0;
   return handleFormat(amount, 'USD');
};

function keysToString(obj: any) {
   const newObj: any = {};
   for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
         newObj[String(key)] = obj[key];
      }
   }
   return newObj;
}

export const getModeIcons = (betMode: string) => {
   switch (betMode) {
      case BetMode?.classic:
         return faChartLineUp as IconProp;
      case BetMode?.range:
         return faArrowsLeftRightToLine as IconProp;
      case BetMode?.over:
         return faArrowUpFromLine as IconProp;
      case BetMode?.under:
         return faArrowDownFromLine as IconProp;
      default:
         return faGamepad as IconProp;
   }
};

const formatSmall = (val: number, format: string) => {
   if (val > 0 && val < 1e-6) {
      return numeral(val * 1000000)
         .format(format)
         .replace('0.0', '0.0000000');
   }
   return numeral(val).format(format, (n) => (Math.floor(n) * 100) / 100);
};
export {
   AutocompleteEditCell,
   BadgeRole,
   CustomAction,
   CustomMenuSortAscendingIcon,
   CustomMenuSortDescendingIcon,
   CustomMenuSortIcon,
   CustomNoRowsOverlay,
   PageWith1Toolbar,
   PageWith2Toolbar,
   PageWith3Toolbar,
   PageWith4Toolbar,
   PageWith5Toolbar,
   PageWithdetails,
   PageWithdetails2Toolbar,
   PageWithdetails3Toolbar,
   PageWithdetails4Toolbar,
   PageWithdetails4ToolbarWithButton,
   PageWithdetails3ToolbarWithFilter,
   PageWithdetails4ToolbarWithFilter,
   convertDateToDateByTimeZone,
   fetchJsonData,
   formatNumberWithCommas,
   getDefaultEndDate,
   getDefaultStartDate,
   handleFormat,
   numFormatter,
   passwordRegex,
   preventInvalidCharacters,
   sumFieldInArray,
   userNameRegex,
   handleConvertToUSD,
   keysToString,
   formatSmall,
};

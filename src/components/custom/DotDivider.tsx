import React from 'react';
import Divider from '@mui/material/Divider';

const DottedDivider = () => {
   return (
      <Divider
         sx={{
            height: '2px',
            background: 'transparent',
            display: 'flex',
            alignItems: 'center',
            ':before': {
               display: 'none',
            },
            ':after': {
               display: 'none',
            },
         }}
      >
         <span
            style={{
               flex: 1,
               height: '2px',
               borderTop: '2px dotted #000', // Change color as needed
            }}
         />
      </Divider>
   );
};

export default DottedDivider;

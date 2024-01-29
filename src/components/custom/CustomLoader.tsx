import React from 'react';
import { CircularProgress, Stack } from '@mui/material';
import { useWindowSize } from 'react-use';
import { PageWith4Toolbar } from 'services/globalFunctions';

/**
 * CustomLoader component displays a circular loading indicator in the center of the screen.
 */
const CustomLoader = () => {
   const { height } = useWindowSize()
   return (
      <Stack
         minHeight={PageWith4Toolbar} // Set minimum height to ensure it covers most of the viewport
         justifyContent="center" // Center content vertically
         alignItems="center" // Center content horizontally
      >
         <CircularProgress color="primary" /> {/* Render the circular loading indicator */}
      </Stack>
   );
}

export default CustomLoader;

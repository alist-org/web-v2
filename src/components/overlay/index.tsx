import React from 'react';
import ToTop from './to-top';
import Ss from './site-settings';
import { Box } from '@chakra-ui/react';

const Overlay = (props:any) => {
  return <Box className="overlay" zIndex="100">
    <Ss {...props} />
    <ToTop />
    </Box>;
};

export default Overlay;
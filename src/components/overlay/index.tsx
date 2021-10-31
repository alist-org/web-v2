import React from 'react';
import ToTop from './to-top';
import Ss from './site-settings';

const Overlay = (props:any) => {
  return <div className="overlay">
    <Ss {...props} />
    <ToTop />
    </div>;
};

export default Overlay;
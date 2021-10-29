import React from 'react';
import ToTop from './to-top';
import Ss from './site-settings';

const Overlay = () => {
  return <div className="overlay">
    <Ss />
    <ToTop />
    </div>;
};

export default Overlay;
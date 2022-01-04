import { useEffect, useRef } from "react";

const useChangeEffect = (callback: () => void, deps: any[]) => {
  const didMountRef = useRef(false);
  useEffect(() => {
    if (didMountRef.current) {
      callback();
    } else {
      didMountRef.current = true;
    }
  }, deps);
};

export default useChangeEffect;
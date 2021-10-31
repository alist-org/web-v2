import { useContext, useEffect } from "react";
import { IContext } from "../pages/list";

const useUnfold = (display=true) => {
  const { setShowUnfold, unfold } = useContext(IContext);
  useEffect(() => {
    if (display) {
      setShowUnfold!(true);
    }
    return () => {
      setShowUnfold!(false);
    };
  }, []);
  return {unfold,setShowUnfold};
};

export default useUnfold;

import { useEffect } from "react";

const useTitle = (title: string, main: boolean = false) => {
  useEffect(() => {
    const pre = document.title;
    if (main) {
      document.title = `${title} - alist`;
    }else{
      document.title = title;
    }
    return () => {
      document.title = pre;
    };
  }, []);
};

export default useTitle;
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

//function to ensure every new page scroll to top on rendering

const ScrollToTop = () => {
  const { pathname } = useLocation(); //obtaiting the current url path

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
import { useEffect, useState } from "react";

const useMount = (isOpen: boolean) => {
  const [isMounted, setIsMounted] = useState(isOpen);

  useEffect(() => {
    if (isOpen && !isMounted) {
      setIsMounted(true);
    } else if (!isOpen && isMounted) {
      setTimeout(() => {
        setIsMounted(false);
      }, 200);
    }
  }, [isOpen]);

  return { isMounted };
};

export default useMount;

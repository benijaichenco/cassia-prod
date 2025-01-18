import { memo, useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

import "./preloader.css";

const Preloader = () => {
  const counterRef = useRef(null);
  const overlayRef = useRef(null);

  const [counter, setCounter] = useState<number>(0);
  const [triggerHeight, setTriggerHeight] = useState<boolean>(false);
  const [triggerCounter, setTriggerCounter] = useState<boolean>(false);
  const [triggerOverlay, setTriggerOverlay] = useState<boolean>(false);

  const revealSite = useCallback(() => {
    setTriggerHeight(true);
    setTriggerCounter(true);
    setTriggerOverlay(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prevCounter) => {
        if (prevCounter < 100) {
          return prevCounter + 1;
        } else {
          clearTimeout(interval);
          revealSite();
          return prevCounter;
        }
      });
    }, 20);

    return () => {
      clearInterval(interval);
    };
  }, [revealSite]);

  return (
    <>
      <motion.div
        id="preloader"
        initial={{
          height: "100vh",
        }}
        animate={{
          height: triggerHeight ? 0 : "100vh",
        }}
      >
        <motion.div
          className="preloader-counter"
          ref={counterRef}
          initial={{ opacity: 1 }}
          animate={{ opacity: triggerCounter ? 0 : 1 }}
          transition={{
            duration: 0.2,
            delay: 0.2,
          }}
        >
          {counter}
        </motion.div>

        <motion.div
          className="preloader-overlay"
          ref={overlayRef}
          initial={{
            width: "70%",
            height: 0,
          }}
          animate={{
            width: triggerOverlay ? "110%" : "60%",
            height: triggerOverlay ? "110%" : 0,
          }}
        ></motion.div>
      </motion.div>
    </>
  );
};

export default memo(Preloader);

import { memo, useCallback, useEffect, useState } from "react";
import { motion, useMotionValue } from "framer-motion";

import "./cursor.css";

function Cursor() {
  const [cursorScale, setCursorScale] = useState<number>(1);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    },
    [x, y]
  );

  const handleMouseDown = useCallback(() => {
    setCursorScale(0.85);
  }, []);

  const handleMouseUp = useCallback(() => {
    setCursorScale(1);
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseDown, handleMouseUp]);
  return (
    <motion.div
      id="cursor"
      initial={{
        y: "-100%",
        x: "-100%",
      }}
      style={{
        x: x,
        y: y,
        translateX: "-50%",
        translateY: "-50%",
      }}
      animate={{
        height: "20px",
        width: "20px",
        scale: cursorScale,
        originX: 0.5,
        originY: 0.5,
      }}
      transition={{
        height: { duration: 0.2, ease: "easeInOut" },
        width: { duration: 0.2, ease: "easeInOut" },
        scale: { duration: 0.1, ease: "easeInOut" },
      }}
    ></motion.div>
  );
}

export default memo(Cursor);

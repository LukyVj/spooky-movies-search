import { useState, useEffect } from "react";

export function useShrinkOnScroll(shrinkThreshold: number) {
  const [shrink, setShrink] = useState(false);

  const handleScroll = () => {
    setShrink(window.scrollY > shrinkThreshold);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return shrink;
}

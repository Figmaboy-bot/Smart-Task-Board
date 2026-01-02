import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";

export default function HamburgerMenu({ style, ...props }) {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    fetch("/Icons/Sidebar/lottieflow-menu-nav-08-ffffff-easey.json")
      .then((res) => res.json())
      .then(setAnimationData);
  }, []);

  if (!animationData) return null;
  return (
    <Lottie
      animationData={animationData}
      loop
      autoplay
      style={{ width: 36, height: 36, ...style }}
      {...props}
    />
  );
}

import React from "react";
import Player from "./player";

const Canvas = ({ draw, height, width }) => {
  const canvas = React.useRef();

  React.useEffect(() => {
    const context = canvas.current.getContext("2d");
    draw(context);
  });

  return <canvas ref={canvas} height={576} width={832} />;
};

export default Canvas;
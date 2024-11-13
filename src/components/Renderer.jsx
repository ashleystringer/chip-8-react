import React, { useEffect, useRef } from 'react'

export default function Renderer({ graphics }) {

  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    graphics.setCanvas(canvas);
    graphics.render();
    
  }, []);
  return (
    <canvas ref={canvasRef}></canvas>
  )
}

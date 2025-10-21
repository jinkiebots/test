import { useRef, useState, useEffect } from 'react';
import { Window, WindowHeader, WindowContent, Button, Frame } from '@react95/core';

function Whiteboard({ onClose }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isErasing, setIsErasing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(2);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setLastPos({ x, y });
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(x, y);

    if (isErasing) {
      ctx.strokeStyle = 'white';
      ctx.lineWidth = brushSize * 3;
    } else {
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
    }

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    setLastPos({ x, y });
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const colors = ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500'];
  const brushSizes = [1, 2, 4, 6, 8];

  return (
    <Window
      style={{
        position: 'absolute',
        left: '15%',
        top: '8%',
        width: '700px',
      }}
    >
      <WindowHeader>
        <span>Paint - Whiteboard</span>
        <Button onClick={onClose}>×</Button>
      </WindowHeader>
      <WindowContent>
        {/* Toolbar */}
        <Frame
          bg="white"
          boxShadow="in"
          padding={10}
          style={{ marginBottom: '10px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
            {/* Drawing/Erasing Mode */}
            <div>
              <Button
                active={!isErasing}
                onClick={() => setIsErasing(false)}
                style={{ marginRight: '5px' }}
              >
                ✏️ Draw
              </Button>
              <Button
                active={isErasing}
                onClick={() => setIsErasing(true)}
              >
                🧽 Erase
              </Button>
            </div>

            {/* Color Picker */}
            {!isErasing && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ fontSize: '12px' }}>Color:</span>
                {colors.map((c) => (
                  <div
                    key={c}
                    onClick={() => setColor(c)}
                    style={{
                      width: '24px',
                      height: '24px',
                      backgroundColor: c,
                      border: color === c ? '3px solid #000080' : '1px solid #000',
                      cursor: 'pointer',
                      boxShadow: color === c ? 'inset -1px -1px #fff, inset 1px 1px #000' : 'none'
                    }}
                  />
                ))}
              </div>
            )}

            {/* Brush Size */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ fontSize: '12px' }}>Size:</span>
              {brushSizes.map((size) => (
                <Button
                  key={size}
                  active={brushSize === size}
                  onClick={() => setBrushSize(size)}
                  style={{ padding: '4px 8px', fontSize: '11px' }}
                >
                  {size}px
                </Button>
              ))}
            </div>

            {/* Clear Button */}
            <Button onClick={clearCanvas}>
              🗑️ Clear All
            </Button>
          </div>
        </Frame>

        {/* Canvas */}
        <Frame bg="white" boxShadow="in">
          <canvas
            ref={canvasRef}
            width={660}
            height={400}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            style={{
              cursor: isErasing ? 'cell' : 'crosshair',
              display: 'block',
              backgroundColor: 'white'
            }}
          />
        </Frame>

        {/* Status Bar */}
        <div style={{
          marginTop: '5px',
          padding: '4px 8px',
          border: '2px inset',
          fontSize: '11px',
          backgroundColor: '#c0c0c0'
        }}>
          Mode: {isErasing ? 'Eraser' : 'Pen'} | Color: {color} | Size: {brushSize}px
        </div>
      </WindowContent>
    </Window>
  );
}

export default Whiteboard;

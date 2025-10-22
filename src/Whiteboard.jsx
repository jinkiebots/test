import { useRef, useState, useEffect } from 'react';

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
    ctx.strokeStyle = isErasing ? 'white' : color;
    ctx.lineWidth = isErasing ? brushSize * 3 : brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    setLastPos({ x, y });
  };

  const stopDrawing = () => setIsDrawing(false);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const colors = ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500'];
  const brushSizes = [1, 2, 4, 6, 8];

  return (
    <div style={{
      position: 'absolute',
      left: '10%',
      top: '8%',
      width: '700px',
      background: '#c0c0c0',
      border: '2px outset #dfdfdf',
      boxShadow: '2px 2px 10px rgba(0,0,0,0.3)'
    }}>
      {/* Title Bar */}
      <div style={{
        background: 'linear-gradient(to right, #000080, #1084d0)',
        color: 'white',
        padding: '3px 5px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontWeight: 'bold'
      }}>
        <span>Paint - Whiteboard</span>
        <button onClick={onClose} style={{ width: '20px', height: '20px', padding: 0 }}>×</button>
      </div>

      {/* Content */}
      <div style={{ padding: '10px', background: '#c0c0c0' }}>
        {/* Toolbar */}
        <div style={{ marginBottom: '10px', padding: '10px', background: 'white', border: '2px inset' }}>
          <button
            onClick={() => setIsErasing(false)}
            style={{ marginRight: '5px', background: isErasing ? '#c0c0c0' : '#000080', color: isErasing ? 'black' : 'white' }}
          >
            ✏️ Draw
          </button>
          <button
            onClick={() => setIsErasing(true)}
            style={{ marginRight: '15px', background: isErasing ? '#000080' : '#c0c0c0', color: isErasing ? 'white' : 'black' }}
          >
            🧽 Erase
          </button>

          {!isErasing && (
            <>
              <span style={{ fontSize: '12px', marginRight: '5px' }}>Color:</span>
              {colors.map((c) => (
                <div
                  key={c}
                  onClick={() => setColor(c)}
                  style={{
                    display: 'inline-block',
                    width: '24px',
                    height: '24px',
                    backgroundColor: c,
                    border: color === c ? '3px solid #000080' : '1px solid #000',
                    cursor: 'pointer',
                    marginRight: '5px'
                  }}
                />
              ))}
            </>
          )}

          <span style={{ fontSize: '12px', margin: '0 10px 0 15px' }}>Size:</span>
          {brushSizes.map((size) => (
            <button
              key={size}
              onClick={() => setBrushSize(size)}
              style={{
                padding: '4px 8px',
                fontSize: '11px',
                marginRight: '5px',
                background: brushSize === size ? '#000080' : '#c0c0c0',
                color: brushSize === size ? 'white' : 'black'
              }}
            >
              {size}px
            </button>
          ))}

          <button onClick={clearCanvas} style={{ marginLeft: '15px' }}>🗑️ Clear All</button>
        </div>

        {/* Canvas */}
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
            backgroundColor: 'white',
            border: '2px inset'
          }}
        />

        <div style={{
          marginTop: '5px',
          padding: '4px 8px',
          border: '2px inset',
          fontSize: '11px',
          backgroundColor: '#c0c0c0'
        }}>
          Mode: {isErasing ? 'Eraser' : 'Pen'} | Color: {color} | Size: {brushSize}px
        </div>
      </div>
    </div>
  );
}

export default Whiteboard;

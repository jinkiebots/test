import { useRef, useState, useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-jsx';

function SketchToUI() {
  const canvasRef = useRef(null);
  const previewRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(3);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const [generatedCode, setGeneratedCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(true);
  const [error, setError] = useState('');
  const [userDescription, setUserDescription] = useState('');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Load API key from localStorage
    const savedKey = localStorage.getItem('claudeApiKey');
    if (savedKey) {
      setApiKey(savedKey);
      setShowApiKeyInput(false);
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
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
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
    setGeneratedCode('');
    setError('');
  };

  const saveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('claudeApiKey', apiKey.trim());
      setShowApiKeyInput(false);
      setError('');
    } else {
      setError('Please enter a valid API key');
    }
  };

  const generateUI = async () => {
    if (!apiKey) {
      setError('Please enter your Claude API key first');
      setShowApiKeyInput(true);
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const canvas = canvasRef.current;
      const imageData = canvas.toDataURL('image/png');
      const base64Image = imageData.split(',')[1];

      const prompt = userDescription
        ? `Convert this hand-drawn UI sketch into a React component with Tailwind CSS. The user describes the sketch as: "${userDescription}". Identify all UI elements (buttons, cards, weather widgets, charts, lists, text, icons, etc.) and recreate them functionally with proper styling. Return ONLY the React component code with JSX, including all imports. Use Tailwind CSS classes for styling. Make it beautiful and functional.`
        : `Convert this hand-drawn UI sketch into a React component with Tailwind CSS. Identify all UI elements (buttons, cards, weather widgets, charts, lists, text, icons, etc.) and recreate them functionally with proper styling. Return ONLY the React component code with JSX, including all imports. Use Tailwind CSS classes for styling. Make it beautiful and functional.`;

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 4096,
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'image',
                  source: {
                    type: 'base64',
                    media_type: 'image/png',
                    data: base64Image
                  }
                },
                {
                  type: 'text',
                  text: prompt
                }
              ]
            }
          ]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'API request failed');
      }

      const data = await response.json();
      const generatedText = data.content[0].text;

      // Extract code from markdown code blocks if present
      const codeMatch = generatedText.match(/```(?:jsx?|tsx?)?\n([\s\S]*?)```/);
      const code = codeMatch ? codeMatch[1] : generatedText;

      setGeneratedCode(code);
      renderPreview(code);

      // Highlight code after state update
      setTimeout(() => Prism.highlightAll(), 100);
    } catch (err) {
      console.error('Error generating UI:', err);
      setError(`Error: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const renderPreview = (code) => {
    // We'll render the code as HTML in an iframe for isolation
    if (previewRef.current) {
      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body {
      margin: 0;
      padding: 16px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    ${code}

    // Find the component to render
    const componentName = ${code}.match(/(?:function|const)\\s+(\\w+)/)?.[1] || 'App';
    const ComponentToRender = eval(componentName);

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<ComponentToRender />);
  </script>
</body>
</html>
      `;

      previewRef.current.srcdoc = htmlContent;
    }
  };

  const colors = ['#000000', '#2563eb', '#dc2626', '#16a34a', '#9333ea', '#ea580c'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      {/* API Key Modal */}
      {showApiKeyInput && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Enter Claude API Key</h2>
            <p className="text-gray-600 mb-4">
              To use the sketch-to-UI converter, you need a Claude API key from Anthropic.
            </p>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-ant-..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && saveApiKey()}
            />
            <div className="flex gap-2">
              <button
                onClick={saveApiKey}
                className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Save & Continue
              </button>
              <button
                onClick={() => setShowApiKeyInput(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Your API key is stored locally in your browser and never sent anywhere except to Anthropic's API.
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            ✨ Sketch-to-UI Converter
          </h1>
          <p className="text-gray-600">
            Draw a UI mockup and watch AI convert it into React code with Tailwind CSS
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel - Drawing Canvas */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Draw Your UI</h2>
            <button
              onClick={() => setShowApiKeyInput(true)}
              className="text-sm text-blue-600 hover:text-blue-700 underline"
            >
              Change API Key
            </button>
          </div>

          {/* Toolbar */}
          <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex flex-wrap gap-4 items-center">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Colors</label>
                <div className="flex gap-2">
                  {colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        color === c ? 'border-gray-800 scale-110' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Brush Size</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={brushSize}
                  onChange={(e) => setBrushSize(Number(e.target.value))}
                  className="w-32"
                />
                <span className="ml-2 text-sm text-gray-600">{brushSize}px</span>
              </div>

              <button
                onClick={clearCanvas}
                className="ml-auto px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
              >
                Clear Canvas
              </button>
            </div>
          </div>

          {/* Canvas */}
          <canvas
            ref={canvasRef}
            width={700}
            height={500}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className="w-full border-2 border-gray-300 rounded-lg cursor-crosshair bg-white shadow-inner"
          />

          {/* Description Input */}
          <div className="mt-4">
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Describe your sketch (optional)
            </label>
            <input
              type="text"
              value={userDescription}
              onChange={(e) => setUserDescription(e.target.value)}
              placeholder="e.g., Weather widget with temperature and location"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={generateUI}
            disabled={isGenerating}
            className={`w-full mt-4 px-6 py-3 rounded-lg font-bold text-lg transition-all ${
              isGenerating
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl'
            }`}
          >
            {isGenerating ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Generating UI...
              </span>
            ) : (
              '✨ Generate UI from Sketch'
            )}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
        </div>

        {/* Right Panel - Preview & Code */}
        <div className="space-y-6">
          {/* Preview */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Live Preview</h2>
            {!generatedCode ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-[300px] bg-gray-50 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                  </svg>
                  <p>Your generated UI will appear here</p>
                </div>
              </div>
            ) : (
              <iframe
                ref={previewRef}
                className="w-full h-[500px] border-2 border-gray-300 rounded-lg bg-white"
                title="UI Preview"
              />
            )}
          </div>

          {/* Generated Code */}
          {generatedCode && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Generated Code</h2>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedCode);
                    alert('Code copied to clipboard!');
                  }}
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium text-sm"
                >
                  Copy Code
                </button>
              </div>
              <div className="rounded-lg overflow-hidden max-h-[500px] overflow-y-auto bg-gray-900">
                <pre className="!m-0 !p-4">
                  <code className="language-jsx !text-sm">
                    {generatedCode}
                  </code>
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="max-w-7xl mx-auto mt-6 bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-3">How to Use</h3>
        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          <li>Draw your UI mockup on the canvas (buttons, cards, weather widgets, charts, lists, etc.)</li>
          <li>Optionally add a description to help the AI understand your sketch better</li>
          <li>Click "Generate UI" and watch as AI converts your sketch into React code</li>
          <li>View the live preview and copy the generated code</li>
          <li>The code uses Tailwind CSS for styling and is ready to use in your project</li>
        </ol>
      </div>
    </div>
  );
}

export default SketchToUI;

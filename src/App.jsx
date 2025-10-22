import { useState, useEffect } from 'react';
import './App.css';
import Whiteboard from './Whiteboard';
import Voicemail from './Voicemail';

function App() {
  const [showAbout, setShowAbout] = useState(false);
  const [showComputer, setShowComputer] = useState(false);
  const [showNotepad, setShowNotepad] = useState(false);
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  const [showVoicemail, setShowVoicemail] = useState(false);
  const [notepadText, setNotepadText] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      background: 'teal',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: '"MS Sans Serif", Arial, sans-serif'
    }}>
      {/* Desktop Icons */}
      <div style={{ padding: '20px' }}>
        <DesktopIcon
          icon="💻"
          label="My Computer"
          onClick={() => setShowComputer(true)}
        />
        <DesktopIcon
          icon="📝"
          label="Notepad"
          onClick={() => setShowNotepad(true)}
        />
        <DesktopIcon
          icon="🎨"
          label="Whiteboard"
          onClick={() => setShowWhiteboard(true)}
        />
        <DesktopIcon
          icon="📞"
          label="Voicemail"
          onClick={() => setShowVoicemail(true)}
        />
        <DesktopIcon
          icon="ℹ️"
          label="About"
          onClick={() => setShowAbout(true)}
        />
      </div>

      {/* My Computer Window */}
      {showComputer && (
        <Window title="My Computer" onClose={() => setShowComputer(false)}>
          <div style={{ padding: '20px' }}>
            <h3>Windows 95 Style Website</h3>
            <p>System Type: React Application</p>
            <hr />
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li>Processor: Intel Pentium (simulated)</li>
              <li>RAM: 16 MB (simulated)</li>
              <li>Hard Drive: 2 GB (simulated)</li>
            </ul>
          </div>
        </Window>
      )}

      {/* Notepad Window */}
      {showNotepad && (
        <Window title="Notepad - Untitled" onClose={() => setShowNotepad(false)}>
          <textarea
            value={notepadText}
            onChange={(e) => setNotepadText(e.target.value)}
            style={{
              width: '100%',
              height: '300px',
              fontFamily: 'monospace',
              fontSize: '12px',
              padding: '5px',
              border: 'none',
              resize: 'none'
            }}
            placeholder="Type something..."
          />
        </Window>
      )}

      {/* Whiteboard Window */}
      {showWhiteboard && (
        <Whiteboard onClose={() => setShowWhiteboard(false)} />
      )}

      {/* Voicemail Window */}
      {showVoicemail && (
        <Voicemail onClose={() => setShowVoicemail(false)} />
      )}

      {/* About Alert */}
      {showAbout && (
        <Window title="About" onClose={() => setShowAbout(false)}>
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <h3>About This Website</h3>
            <p>Welcome to Windows 95! This is a retro-styled interactive website built with React.</p>
            <p>Click around and explore the nostalgic interface!</p>
            <button
              onClick={() => setShowAbout(false)}
              style={{
                padding: '5px 20px',
                marginTop: '10px'
              }}
            >
              OK
            </button>
          </div>
        </Window>
      )}

      {/* TaskBar */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '40px',
        background: '#c0c0c0',
        borderTop: '2px solid white',
        display: 'flex',
        alignItems: 'center',
        padding: '0 5px',
        boxShadow: 'inset 1px 1px 0 white, inset -1px -1px 0 #808080'
      }}>
        <button style={{
          height: '32px',
          padding: '0 20px',
          marginRight: '10px',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '5px'
        }}>
          <span style={{ fontSize: '20px' }}>🪟</span>
          Start
        </button>
        <div style={{ marginLeft: 'auto', padding: '0 10px', fontSize: '12px' }}>
          {time}
        </div>
      </div>
    </div>
  );
}

function DesktopIcon({ icon, label, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '80px',
        cursor: 'pointer',
        marginBottom: '20px',
        userSelect: 'none'
      }}
    >
      <div style={{ fontSize: '48px' }}>{icon}</div>
      <span style={{
        color: 'white',
        marginTop: '5px',
        textShadow: '1px 1px black',
        fontSize: '12px',
        textAlign: 'center'
      }}>
        {label}
      </span>
    </div>
  );
}

function Window({ title, onClose, children }) {
  return (
    <div style={{
      position: 'absolute',
      left: '15%',
      top: '10%',
      width: '500px',
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
        fontWeight: 'bold',
        fontSize: '14px'
      }}>
        <span>{title}</span>
        <button
          onClick={onClose}
          style={{
            width: '20px',
            height: '20px',
            padding: 0,
            background: '#c0c0c0',
            border: '2px outset #dfdfdf',
            fontSize: '12px',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ×
        </button>
      </div>
      {/* Content */}
      <div style={{
        background: 'white',
        minHeight: '100px'
      }}>
        {children}
      </div>
    </div>
  );
}

export default App;

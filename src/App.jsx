import { useState, useEffect } from 'react';
import {
  ThemeProvider,
  Frame,
  TaskBar,
  List,
  Button,
  Window,
  WindowHeader,
  WindowContent,
  Divider,
  Tabs,
  Tab,
  Alert,
  TextInput,
} from '@react95/core';
import { Computer, Mmsys113, FileFind, Winpopup3, Mail, Pbrush } from '@react95/icons';
import './App.css';
import Whiteboard from './Whiteboard';

function App() {
  const [showAbout, setShowAbout] = useState(false);
  const [showComputer, setShowComputer] = useState(false);
  const [showNotepad, setShowNotepad] = useState(false);
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  const [notepadText, setNotepadText] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <ThemeProvider>
      <div style={{
        height: '100vh',
        width: '100vw',
        background: 'teal',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Desktop Icons */}
        <div style={{ padding: '20px' }}>
          <div
            onClick={() => setShowComputer(true)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '80px',
              cursor: 'pointer',
              marginBottom: '20px'
            }}
          >
            <Computer variant="32x32_4" />
            <span style={{ color: 'white', marginTop: '5px', textShadow: '1px 1px black' }}>
              My Computer
            </span>
          </div>

          <div
            onClick={() => setShowNotepad(true)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '80px',
              cursor: 'pointer',
              marginBottom: '20px'
            }}
          >
            <Winpopup3 variant="32x32_4" />
            <span style={{ color: 'white', marginTop: '5px', textShadow: '1px 1px black' }}>
              Notepad
            </span>
          </div>

          <div
            onClick={() => setShowWhiteboard(true)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '80px',
              cursor: 'pointer',
              marginBottom: '20px'
            }}
          >
            <Pbrush variant="32x32_4" />
            <span style={{ color: 'white', marginTop: '5px', textShadow: '1px 1px black' }}>
              Whiteboard
            </span>
          </div>

          <div
            onClick={() => setShowAbout(true)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '80px',
              cursor: 'pointer'
            }}
          >
            <FileFind variant="32x32_4" />
            <span style={{ color: 'white', marginTop: '5px', textShadow: '1px 1px black' }}>
              About
            </span>
          </div>
        </div>

        {/* My Computer Window */}
        {showComputer && (
          <Window
            style={{
              position: 'absolute',
              left: '20%',
              top: '10%',
              width: '500px',
            }}
          >
            <WindowHeader>
              <span>My Computer</span>
              <Button onClick={() => setShowComputer(false)}>×</Button>
            </WindowHeader>
            <WindowContent>
              <Tabs value={activeTab} onChange={setActiveTab}>
                <Tab value={0}>General</Tab>
                <Tab value={1}>System</Tab>
              </Tabs>

              {activeTab === 0 && (
                <div style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <Computer variant="32x32_4" />
                    <div style={{ marginLeft: '10px' }}>
                      <h3 style={{ margin: 0 }}>Windows 95 Style Website</h3>
                      <p style={{ margin: 0, fontSize: '12px' }}>System Type: React Application</p>
                    </div>
                  </div>
                  <Divider />
                  <List>
                    <List.Item>Processor: Intel Pentium (simulated)</List.Item>
                    <List.Item>RAM: 16 MB (simulated)</List.Item>
                    <List.Item>Hard Drive: 2 GB (simulated)</List.Item>
                  </List>
                </div>
              )}

              {activeTab === 1 && (
                <div style={{ padding: '20px' }}>
                  <h4>System Information</h4>
                  <List>
                    <List.Item>Built with: React + @react95/core</List.Item>
                    <List.Item>Theme: Windows 95</List.Item>
                    <List.Item>Status: Running</List.Item>
                  </List>
                </div>
              )}
            </WindowContent>
          </Window>
        )}

        {/* Notepad Window */}
        {showNotepad && (
          <Window
            style={{
              position: 'absolute',
              left: '25%',
              top: '15%',
              width: '450px',
            }}
          >
            <WindowHeader>
              <span>Notepad - Untitled</span>
              <Button onClick={() => setShowNotepad(false)}>×</Button>
            </WindowHeader>
            <WindowContent>
              <textarea
                value={notepadText}
                onChange={(e) => setNotepadText(e.target.value)}
                style={{
                  width: '100%',
                  height: '300px',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  padding: '5px',
                  border: '2px inset',
                  resize: 'none'
                }}
                placeholder="Type something..."
              />
            </WindowContent>
          </Window>
        )}

        {/* Whiteboard Window */}
        {showWhiteboard && (
          <Whiteboard onClose={() => setShowWhiteboard(false)} />
        )}

        {/* About Alert */}
        {showAbout && (
          <Alert
            title="About This Website"
            message="Welcome to Windows 95! This is a retro-styled interactive website built with React and @react95/core. Click around and explore the nostalgic interface!"
            closeAlert={() => setShowAbout(false)}
            buttons={[{ value: 'OK', onClick: () => setShowAbout(false) }]}
            type="info"
          />
        )}

        {/* TaskBar */}
        <TaskBar
          list={
            <List>
              <List.Item icon={<Mmsys113 variant="32x32_4" />}>
                Programs
                <List>
                  <List.Item onClick={() => setShowNotepad(true)}>Notepad</List.Item>
                  <List.Item onClick={() => setShowWhiteboard(true)}>Whiteboard</List.Item>
                  <List.Item onClick={() => setShowComputer(true)}>My Computer</List.Item>
                  <List.Item onClick={() => setShowAbout(true)}>About</List.Item>
                </List>
              </List.Item>
              <List.Item icon={<Mail variant="32x32_4" />}>
                Documents
              </List.Item>
            </List>
          }
        >
          <span style={{ marginLeft: 'auto', marginRight: '10px' }}>{time}</span>
        </TaskBar>
      </div>
    </ThemeProvider>
  );
}

export default App;

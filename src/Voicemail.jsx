function Voicemail({ onClose }) {
  return (
    <div style={{
      position: 'absolute',
      left: '10%',
      top: '5%',
      width: '650px',
      background: '#c0c0c0',
      border: '2px outset #dfdfdf',
      boxShadow: '2px 2px 10px rgba(0,0,0,0.3)'
    }}>
      <div style={{
        background: 'linear-gradient(to right, #000080, #1084d0)',
        color: 'white',
        padding: '3px 5px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontWeight: 'bold'
      }}>
        <span>📞 Voicemail From Your Future Self</span>
        <button onClick={onClose} style={{ width: '20px', height: '20px', padding: 0 }}>×</button>
      </div>

      <div style={{ padding: '20px', background: 'white' }}>
        <div style={{
          background: 'black',
          color: '#00ff00',
          padding: '15px',
          fontFamily: 'monospace',
          textAlign: 'center',
          marginBottom: '15px',
          border: '2px inset'
        }}>
          VOICEMAIL SYSTEM READY
          <div style={{ fontSize: '12px', marginTop: '5px' }}>
            RECORD A MESSAGE TO YOUR FUTURE SELF
          </div>
        </div>

        <p style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
          Voicemail feature coming soon!<br/>
          This will allow you to record messages to your future self.
        </p>
      </div>
    </div>
  );
}

export default Voicemail;

import { useState, useEffect } from 'react';
import './App.css';

// Sample dreams from different users
const INITIAL_DREAMS = [
  {
    id: 1,
    title: "The Library That Never Ends",
    author: "luna_moon",
    date: "2024-01-15",
    description: "I was in a library with infinite shelves spiraling upward. Each book whispered different stories. I found one that showed my future but woke up before I could read it.",
    theme: "Mystery",
    recurring: false,
    checkedOut: false,
    checkoutHistory: [],
    color: '#f8c8dc'
  },
  {
    id: 2,
    title: "Swimming Through Clouds",
    author: "sky_dreamer",
    date: "2024-01-20",
    description: "Instead of water, I was swimming through cotton candy clouds. They tasted like childhood memories. Below me, cities made of light sparkled.",
    theme: "Fantasy",
    recurring: true,
    checkedOut: false,
    checkoutHistory: [],
    color: '#c8b8db'
  },
  {
    id: 3,
    title: "The Forest of Forgotten Things",
    author: "moss_walker",
    date: "2024-01-18",
    description: "Walking through a forest where trees grew from lost items - forgotten passwords, missed chances, old phone numbers. I found a tree growing from a letter I never sent.",
    theme: "Melancholy",
    recurring: false,
    checkedOut: false,
    checkoutHistory: [],
    color: '#a8e6cf'
  },
  {
    id: 4,
    title: "Tea Party With My Anxieties",
    author: "worried_heart",
    date: "2024-01-22",
    description: "All my anxieties sat around a table having tea. They were actually quite polite and just wanted to talk. We made peace over chamomile.",
    theme: "Cathartic",
    recurring: true,
    checkedOut: false,
    checkoutHistory: [],
    color: '#fff9e6'
  }
];

function App() {
  const [dreams, setDreams] = useState([]);
  const [showAddCard, setShowAddCard] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const [showUserModal, setShowUserModal] = useState(true);
  const [newDream, setNewDream] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    theme: '',
    recurring: false
  });
  const [filter, setFilter] = useState('all');
  const [selectedDream, setSelectedDream] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('sharedDreamLibrary');
    const user = localStorage.getItem('dreamLibraryUser');

    if (saved) {
      setDreams(JSON.parse(saved));
    } else {
      setDreams(INITIAL_DREAMS);
      localStorage.setItem('sharedDreamLibrary', JSON.stringify(INITIAL_DREAMS));
    }

    if (user) {
      setCurrentUser(user);
      setShowUserModal(false);
    }
  }, []);

  const saveDreams = (updatedDreams) => {
    setDreams(updatedDreams);
    localStorage.setItem('sharedDreamLibrary', JSON.stringify(updatedDreams));
  };

  const setUser = (username) => {
    if (username.trim()) {
      setCurrentUser(username.trim());
      localStorage.setItem('dreamLibraryUser', username.trim());
      setShowUserModal(false);
    }
  };

  const addDream = () => {
    if (!newDream.title.trim()) return;

    const colors = ['#f8c8dc', '#c8b8db', '#a8e6cf', '#fff9e6', '#ffd4e5', '#e8dff5'];
    const dream = {
      ...newDream,
      id: Date.now(),
      author: currentUser,
      checkedOut: false,
      checkoutHistory: [],
      color: colors[Math.floor(Math.random() * colors.length)]
    };

    saveDreams([dream, ...dreams]);
    setNewDream({
      title: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
      theme: '',
      recurring: false
    });
    setShowAddCard(false);
  };

  const checkoutDream = (id) => {
    const updated = dreams.map(dream => {
      if (dream.id === id) {
        const now = new Date().toLocaleString();
        return {
          ...dream,
          checkedOut: true,
          currentReader: currentUser,
          checkoutHistory: [...dream.checkoutHistory, { user: currentUser, date: now }]
        };
      }
      return dream;
    });
    saveDreams(updated);
  };

  const returnDream = (id) => {
    const updated = dreams.map(dream => {
      if (dream.id === id) {
        return {
          ...dream,
          checkedOut: false,
          currentReader: null
        };
      }
      return dream;
    });
    saveDreams(updated);
  };

  const deleteDream = (id) => {
    const dream = dreams.find(d => d.id === id);
    if (dream.author === currentUser) {
      saveDreams(dreams.filter(d => d.id !== id));
    }
  };

  const filteredDreams = dreams.filter(dream => {
    if (filter === 'my-dreams') return dream.author === currentUser;
    if (filter === 'checked-out') return dream.checkedOut;
    if (filter === 'available') return !dream.checkedOut;
    return true;
  });

  const myCheckedOutDreams = dreams.filter(d => d.checkedOut && d.currentReader === currentUser);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#fafafa',
      padding: '40px 20px'
    }}>
      {/* User Selection Modal */}
      {showUserModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '20px'
        }}>
          <div style={{
            background: 'white',
            padding: '40px',
            maxWidth: '400px',
            width: '100%',
            border: '3px solid black',
            textAlign: 'center',
            borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px'
          }}>
            <h2 style={{ color: 'black', marginBottom: '10px', fontFamily: '"Reenie Beanie", cursive', fontWeight: 'normal', fontSize: '42px' }}>Welcome!</h2>
            <p style={{ color: '#333', fontSize: '14px', marginBottom: '25px' }}>
              enter your name:
            </p>
            <input
              type="text"
              placeholder="name..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') setUser(e.target.value);
              }}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid black',
                fontSize: '16px',
                marginBottom: '15px',
                textAlign: 'center',
                fontFamily: '"Courier New", monospace'
              }}
              autoFocus
            />
            <button
              onClick={(e) => {
                const input = e.target.parentElement.querySelector('input');
                setUser(input.value);
              }}
              style={{
                width: '100%',
                padding: '12px',
                background: 'white',
                border: '2px solid black',
                color: 'black',
                fontWeight: 'normal',
                cursor: 'pointer',
                fontSize: '16px',
                fontFamily: '"Courier New", monospace'
              }}
            >
              [ enter ]
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '40px'
      }}>
        <h1 className="animated-title" style={{
          fontSize: '84px',
          color: 'black',
          margin: '0 0 10px',
          fontFamily: '"Reenie Beanie", cursive',
          fontWeight: 'normal',
          letterSpacing: '2px'
        }}>
          Dream Library
        </h1>
        <p style={{
          fontSize: '28px',
          color: '#555',
          margin: '10px 0 20px',
          fontFamily: '"Reenie Beanie", cursive'
        }}>
          share your dreams with others ~
        </p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{
            display: 'inline-block',
            padding: '8px 20px',
            background: 'white',
            border: '2px solid black',
            fontSize: '16px',
            color: 'black',
            borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px'
          }}>
            user: {currentUser}
          </div>
          {myCheckedOutDreams.length > 0 && (
            <div style={{
              display: 'inline-block',
              padding: '8px 20px',
              background: 'white',
              border: '2px solid black',
              fontSize: '15px',
              color: 'black',
              borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px'
            }}>
              reading: {myCheckedOutDreams.length} dream{myCheckedOutDreams.length > 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>

      {/* Filter Buttons */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
        marginBottom: '30px',
        flexWrap: 'wrap'
      }}>
        {[
          { key: 'all', label: 'all' },
          { key: 'my-dreams', label: 'my dreams' },
          { key: 'available', label: 'available' },
          { key: 'checked-out', label: 'checked out' }
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={{
              padding: '8px 20px',
              background: filter === f.key ? 'black' : 'white',
              border: '2px solid black',
              cursor: 'pointer',
              fontSize: '16px',
              color: filter === f.key ? 'white' : 'black',
              transition: 'all 0.2s',
              borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px'
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Add New Dream Button */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <button
          onClick={() => setShowAddCard(true)}
          style={{
            padding: '15px 35px',
            background: 'white',
            border: '3px solid black',
            cursor: 'pointer',
            fontSize: '20px',
            color: 'black',
            fontWeight: 'bold',
            transition: 'all 0.2s',
            borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px'
          }}
          onMouseOver={(e) => {
            e.target.style.background = 'black';
            e.target.style.color = 'white';
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'white';
            e.target.style.color = 'black';
          }}
        >
          + share a dream
        </button>
      </div>

      {/* Add Dream Modal */}
      {showAddCard && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
          overflowY: 'auto'
        }}>
          <div style={{
            background: 'white',
            padding: '30px',
            maxWidth: '500px',
            width: '100%',
            border: '3px solid black',
            margin: '20px',
            borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px'
          }}>
            <h2 style={{ margin: '0 0 20px', color: 'black', textAlign: 'center', fontFamily: '"Reenie Beanie", cursive', fontWeight: 'normal', fontSize: '42px' }}>
              Share Your Dream
            </h2>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: 'black', fontSize: '13px', fontFamily: '"Courier New", monospace' }}>
                title:
              </label>
              <input
                type="text"
                value={newDream.title}
                onChange={(e) => setNewDream({...newDream, title: e.target.value})}
                placeholder="..."
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid black',
                  fontSize: '14px',
                  fontFamily: '"Courier New", monospace'
                }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: 'black', fontSize: '13px', fontFamily: '"Courier New", monospace' }}>
                date:
              </label>
              <input
                type="date"
                value={newDream.date}
                onChange={(e) => setNewDream({...newDream, date: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid black',
                  fontSize: '14px',
                  fontFamily: '"Courier New", monospace'
                }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: 'black', fontSize: '13px', fontFamily: '"Courier New", monospace' }}>
                theme/mood:
              </label>
              <input
                type="text"
                value={newDream.theme}
                onChange={(e) => setNewDream({...newDream, theme: e.target.value})}
                placeholder="..."
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid black',
                  fontSize: '14px',
                  fontFamily: '"Courier New", monospace'
                }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: 'black', fontSize: '13px', fontFamily: '"Courier New", monospace' }}>
                describe:
              </label>
              <textarea
                value={newDream.description}
                onChange={(e) => setNewDream({...newDream, description: e.target.value})}
                placeholder="what happened..."
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid black',
                  fontSize: '14px',
                  minHeight: '120px',
                  resize: 'vertical',
                  fontFamily: '"Courier New", monospace'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={newDream.recurring}
                  onChange={(e) => setNewDream({...newDream, recurring: e.target.checked})}
                  style={{ width: '16px', height: '16px' }}
                />
                <span style={{ color: 'black', fontSize: '13px', fontFamily: '"Courier New", monospace' }}>
                  recurring dream?
                </span>
              </label>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={addDream}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'black',
                  border: '2px solid black',
                  color: 'white',
                  cursor: 'pointer',
                  fontFamily: '"Courier New", monospace'
                }}
              >
                [share]
              </button>
              <button
                onClick={() => setShowAddCard(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'white',
                  border: '2px solid black',
                  color: 'black',
                  cursor: 'pointer',
                  fontFamily: '"Courier New", monospace'
                }}
              >
                [cancel]
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dream Reading Modal */}
      {selectedDream && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1500,
          padding: '20px',
          overflowY: 'auto'
        }}>
          <div style={{
            background: 'white',
            padding: '40px',
            maxWidth: '600px',
            width: '100%',
            border: '3px solid black',
            position: 'relative',
            margin: '20px',
            borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px'
          }}>
            <button
              onClick={() => setSelectedDream(null)}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'white',
                border: '2px solid black',
                width: '30px',
                height: '30px',
                cursor: 'pointer',
                fontSize: '16px',
                color: 'black',
                fontFamily: '"Courier New", monospace'
              }}
            >
              x
            </button>

            {selectedDream.recurring && (
              <div style={{
                display: 'inline-block',
                background: 'black',
                color: 'white',
                padding: '4px 12px',
                fontSize: '11px',
                marginBottom: '15px',
                fontFamily: '"Courier New", monospace'
              }}>
                [recurring]
              </div>
            )}

            <h2 style={{
              margin: '0 0 15px',
              color: 'black',
              fontSize: '36px',
              fontFamily: '"Reenie Beanie", cursive',
              fontWeight: 'normal'
            }}>
              {selectedDream.title}
            </h2>

            <div style={{
              marginBottom: '20px',
              fontSize: '12px',
              color: '#333',
              paddingBottom: '10px',
              borderBottom: '2px solid black'
            }}>
              <div>by: {selectedDream.author}</div>
              <div>date: {selectedDream.date}</div>
              {selectedDream.theme && <div>theme: {selectedDream.theme}</div>}
            </div>

            <div style={{
              padding: '20px',
              marginBottom: '20px',
              fontSize: '14px',
              lineHeight: '1.8',
              color: '#333',
              border: '1px solid black'
            }}>
              {selectedDream.description}
            </div>

            {selectedDream.checkoutHistory.length > 0 && (
              <div style={{
                padding: '15px',
                marginBottom: '20px',
                fontSize: '11px',
                color: '#333',
                border: '1px solid black'
              }}>
                <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                  read by {selectedDream.checkoutHistory.length} {selectedDream.checkoutHistory.length === 1 ? 'person' : 'people'}:
                </div>
                {selectedDream.checkoutHistory.slice(-3).map((entry, i) => (
                  <div key={i} style={{ marginTop: '4px' }}>
                    - {entry.user} on {entry.date}
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              {!selectedDream.checkedOut ? (
                <button
                  onClick={() => {
                    checkoutDream(selectedDream.id);
                    setSelectedDream(null);
                  }}
                  disabled={selectedDream.author === currentUser}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: selectedDream.author === currentUser ? '#e0e0e0' : 'black',
                    border: '2px solid black',
                    color: selectedDream.author === currentUser ? '#666' : 'white',
                    cursor: selectedDream.author === currentUser ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontFamily: '"Courier New", monospace'
                  }}
                >
                  {selectedDream.author === currentUser ? "[your dream]" : "[check out]"}
                </button>
              ) : selectedDream.currentReader === currentUser ? (
                <button
                  onClick={() => {
                    returnDream(selectedDream.id);
                    setSelectedDream(null);
                  }}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: 'white',
                    border: '2px solid black',
                    color: 'black',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontFamily: '"Courier New", monospace'
                  }}
                >
                  [return]
                </button>
              ) : (
                <div style={{
                  flex: 1,
                  padding: '12px',
                  background: 'black',
                  border: '2px solid black',
                  textAlign: 'center',
                  fontSize: '12px',
                  color: 'white',
                  fontFamily: '"Courier New", monospace'
                }}>
                  checked out by {selectedDream.currentReader}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Dream Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {filteredDreams.map(dream => (
          <LibraryCard
            key={dream.id}
            dream={dream}
            currentUser={currentUser}
            onOpen={() => setSelectedDream(dream)}
            onDelete={deleteDream}
          />
        ))}
      </div>

      {filteredDreams.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '80px 20px',
          color: '#333'
        }}>
          <div style={{
            display: 'inline-block',
            background: 'white',
            padding: '60px 80px',
            border: '3px solid black',
            borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px'
          }}>
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>...</div>
            <p style={{ fontSize: '16px', margin: 0, fontFamily: '"Courier New", monospace' }}>
              {filter === 'my-dreams' ? 'no dreams shared yet' :
               filter === 'checked-out' ? 'no dreams checked out' :
               filter === 'available' ? 'no dreams available' :
               'library is empty'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function LibraryCard({ dream, currentUser, onOpen, onDelete }) {
  const isOwn = dream.author === currentUser;
  const isCheckedOutByMe = dream.checkedOut && dream.currentReader === currentUser;

  return (
    <div
      onClick={onOpen}
      style={{
        background: 'white',
        border: '3px solid black',
        padding: '25px',
        position: 'relative',
        transition: 'all 0.2s',
        cursor: 'pointer',
        minHeight: '200px',
        borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateX(3px) translateY(-3px)';
        e.currentTarget.style.boxShadow = '-5px 5px 0 rgba(0,0,0,0.8)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateX(0) translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {dream.recurring && (
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          fontSize: '11px',
          fontFamily: '"Courier New", monospace'
        }}>
          [recurring]
        </div>
      )}

      <h3 style={{
        margin: '0 0 10px',
        color: 'black',
        fontSize: '26px',
        fontFamily: '"Reenie Beanie", cursive',
        fontWeight: 'normal',
        paddingRight: dream.recurring ? '80px' : '0'
      }}>
        {dream.title}
      </h3>

      <div style={{
        fontSize: '13px',
        color: '#555',
        marginBottom: '12px',
        borderBottom: '2px solid black',
        paddingBottom: '10px',
        fontFamily: '"Indie Flower", cursive'
      }}>
        <div style={{ marginBottom: '4px' }}>
          by: {dream.author} {isOwn && '(you)'}
        </div>
        <div>
          {dream.date}
          {dream.theme && <> • {dream.theme}</>}
        </div>
      </div>

      <p style={{
        fontSize: '15px',
        color: '#333',
        lineHeight: '1.7',
        margin: '0 0 15px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical'
      }}>
        {dream.description}
      </p>

      {dream.checkedOut && (
        <div style={{
          fontSize: '10px',
          padding: '4px 8px',
          background: 'black',
          color: 'white',
          marginBottom: '8px',
          display: 'inline-block'
        }}>
          {isCheckedOutByMe ? (
            <>reading now</>
          ) : (
            <>checked out by {dream.currentReader}</>
          )}
        </div>
      )}

      <div style={{
        fontSize: '10px',
        color: '#666',
        marginTop: 'auto'
      }}>
        {dream.checkoutHistory.length > 0 && (
          <span>{dream.checkoutHistory.length} read{dream.checkoutHistory.length === 1 ? '' : 's'}</span>
        )}
      </div>

      {isOwn && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (confirm('Delete your dream from the library?')) {
              onDelete(dream.id);
            }
          }}
          style={{
            position: 'absolute',
            bottom: '10px',
            right: '10px',
            padding: '4px 8px',
            background: 'white',
            border: '1px solid black',
            color: 'black',
            cursor: 'pointer',
            fontSize: '11px',
            fontFamily: '"Courier New", monospace'
          }}
        >
          [x]
        </button>
      )}
    </div>
  );
}

export default App;

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
    color: '#f8c8dc',
    coverColor: '#ff9eb3'
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
    color: '#c8b8db',
    coverColor: '#b19cd9'
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
    color: '#a8e6cf',
    coverColor: '#7ecfb0'
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
    color: '#fff9e6',
    coverColor: '#ffe8b3'
  }
];

function App() {
  const [dreams, setDreams] = useState([]);
  const [showAddCard, setShowAddCard] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const [showUserModal, setShowUserModal] = useState(true);
  const [showLibraryCard, setShowLibraryCard] = useState(false);
  const [newDream, setNewDream] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    theme: '',
    recurring: false
  });
  const [filter, setFilter] = useState('all');
  const [selectedDream, setSelectedDream] = useState(null);
  const [viewMode, setViewMode] = useState('details'); // 'details' or 'reading'

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
      setShowLibraryCard(true);

      // Auto-hide library card after 3 seconds
      setTimeout(() => {
        setShowLibraryCard(false);
      }, 3000);
    }
  };

  const addDream = () => {
    if (!newDream.title.trim()) return;

    const colors = ['#f8c8dc', '#c8b8db', '#a8e6cf', '#fff9e6', '#ffd4e5', '#e8dff5'];
    const coverColors = ['#ff9eb3', '#b19cd9', '#7ecfb0', '#ffe8b3', '#ffb3cc', '#d4c5f9'];
    const randomIndex = Math.floor(Math.random() * colors.length);

    const dream = {
      ...newDream,
      id: Date.now(),
      author: currentUser,
      checkedOut: false,
      checkoutHistory: [],
      color: colors[randomIndex],
      coverColor: coverColors[randomIndex]
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

    // Update selectedDream if it's the one being checked out
    setSelectedDream(updated.find(d => d.id === id));
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
    setViewMode('details');
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
      padding: '20px 10px'
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
            padding: '30px',
            maxWidth: '400px',
            width: '100%',
            border: '3px solid black',
            textAlign: 'center',
            borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px'
          }}>
            <h2 style={{
              color: 'black',
              marginBottom: '10px',
              fontFamily: '"Reenie Beanie", cursive',
              fontWeight: 'normal',
              fontSize: '42px'
            }}>
              Welcome to the Dream Library!
            </h2>
            <p style={{ color: '#333', fontSize: '16px', marginBottom: '25px', fontFamily: '"Courier New", monospace' }}>
              Please enter your name to get your library card:
            </p>
            <input
              type="text"
              placeholder="your name..."
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
                background: 'black',
                border: '2px solid black',
                color: 'white',
                fontWeight: 'normal',
                cursor: 'pointer',
                fontSize: '16px',
                fontFamily: '"Courier New", monospace'
              }}
            >
              [ Get Library Card ]
            </button>
          </div>
        </div>
      )}

      {/* Library Card Display */}
      {showLibraryCard && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2100,
          padding: '20px',
          animation: 'fadeIn 0.3s ease-in'
        }}>
          <div style={{
            background: 'white',
            padding: '40px',
            maxWidth: '400px',
            width: '100%',
            border: '4px solid black',
            borderRadius: '15px',
            boxShadow: '8px 8px 0 rgba(0,0,0,0.2)',
            animation: 'slideDown 0.5s ease-out'
          }}>
            <div style={{
              textAlign: 'center',
              marginBottom: '20px',
              fontSize: '32px',
              fontFamily: '"Reenie Beanie", cursive'
            }}>
              Dream Library Card
            </div>
            <div style={{
              border: '2px solid black',
              padding: '20px',
              marginBottom: '15px',
              background: '#fff9e6'
            }}>
              <div style={{
                fontSize: '12px',
                color: '#666',
                marginBottom: '8px',
                fontFamily: '"Courier New", monospace'
              }}>
                CARD HOLDER:
              </div>
              <div style={{
                fontSize: '24px',
                fontFamily: '"Reenie Beanie", cursive',
                marginBottom: '15px',
                borderBottom: '2px solid black',
                paddingBottom: '8px'
              }}>
                {currentUser}
              </div>
              <div style={{
                fontSize: '11px',
                color: '#666',
                fontFamily: '"Courier New", monospace'
              }}>
                ISSUED: {new Date().toLocaleDateString()}
              </div>
              <div style={{
                fontSize: '11px',
                color: '#666',
                fontFamily: '"Courier New", monospace'
              }}>
                CARD NO: {Math.floor(Math.random() * 900000 + 100000)}
              </div>
            </div>
            <div style={{
              textAlign: 'center',
              fontSize: '14px',
              color: '#666',
              fontFamily: '"Courier New", monospace'
            }}>
              Welcome to our community of dreamers!
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '30px',
        padding: '0 10px'
      }}>
        <h1 className="animated-title" style={{
          fontSize: '64px',
          color: 'black',
          margin: '0 0 10px',
          fontFamily: '"Reenie Beanie", cursive',
          fontWeight: 'normal',
          letterSpacing: '2px'
        }}>
          Dream Library
        </h1>
        <p style={{
          fontSize: '20px',
          color: '#555',
          margin: '10px 0 20px',
          fontFamily: '"Reenie Beanie", cursive'
        }}>
          a place to share and read dreams ~
        </p>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', padding: '0 10px' }}>
          <div style={{
            display: 'inline-block',
            padding: '6px 16px',
            background: 'white',
            border: '2px solid black',
            fontSize: '14px',
            color: 'black',
            borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px',
            fontFamily: '"Courier New", monospace'
          }}>
            {currentUser}
          </div>
          {myCheckedOutDreams.length > 0 && (
            <div style={{
              display: 'inline-block',
              padding: '6px 16px',
              background: 'white',
              border: '2px solid black',
              fontSize: '13px',
              color: 'black',
              borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px',
              fontFamily: '"Courier New", monospace'
            }}>
              reading: {myCheckedOutDreams.length}
            </div>
          )}
        </div>
      </div>

      {/* Filter Buttons */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '8px',
        marginBottom: '20px',
        flexWrap: 'wrap',
        padding: '0 10px'
      }}>
        {[
          { key: 'all', label: 'all' },
          { key: 'my-dreams', label: 'mine' },
          { key: 'available', label: 'available' },
          { key: 'checked-out', label: 'checked out' }
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={{
              padding: '6px 16px',
              background: filter === f.key ? 'black' : 'white',
              border: '2px solid black',
              cursor: 'pointer',
              fontSize: '14px',
              color: filter === f.key ? 'white' : 'black',
              transition: 'all 0.2s',
              borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px',
              fontFamily: '"Courier New", monospace'
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Add New Dream Button */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <button
          onClick={() => setShowAddCard(true)}
          style={{
            padding: '12px 28px',
            background: 'white',
            border: '3px solid black',
            cursor: 'pointer',
            fontSize: '18px',
            color: 'black',
            fontWeight: 'bold',
            transition: 'all 0.2s',
            borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px',
            fontFamily: '"Courier New", monospace'
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
            padding: '25px',
            maxWidth: '500px',
            width: '100%',
            border: '3px solid black',
            margin: '20px',
            borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px'
          }}>
            <h2 style={{
              margin: '0 0 20px',
              color: 'black',
              textAlign: 'center',
              fontFamily: '"Reenie Beanie", cursive',
              fontWeight: 'normal',
              fontSize: '38px'
            }}>
              Share Your Dream
            </h2>

            <div style={{ marginBottom: '15px' }}>
              <label style={{
                display: 'block',
                marginBottom: '5px',
                color: 'black',
                fontSize: '12px',
                fontFamily: '"Courier New", monospace'
              }}>
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
              <label style={{
                display: 'block',
                marginBottom: '5px',
                color: 'black',
                fontSize: '12px',
                fontFamily: '"Courier New", monospace'
              }}>
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
              <label style={{
                display: 'block',
                marginBottom: '5px',
                color: 'black',
                fontSize: '12px',
                fontFamily: '"Courier New", monospace'
              }}>
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
              <label style={{
                display: 'block',
                marginBottom: '5px',
                color: 'black',
                fontSize: '12px',
                fontFamily: '"Courier New", monospace'
              }}>
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
                  minHeight: '100px',
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
                <span style={{ color: 'black', fontSize: '12px', fontFamily: '"Courier New", monospace' }}>
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
                  fontFamily: '"Courier New", monospace',
                  fontSize: '14px'
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
                  fontFamily: '"Courier New", monospace',
                  fontSize: '14px'
                }}
              >
                [cancel]
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dream Details/Reading Modal */}
      {selectedDream && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1500,
          padding: '20px',
          overflowY: 'auto'
        }}>
          <div style={{
            background: 'white',
            padding: '30px',
            maxWidth: viewMode === 'reading' ? '700px' : '500px',
            width: '100%',
            border: '3px solid black',
            position: 'relative',
            margin: '20px',
            borderRadius: '15px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <button
              onClick={() => {
                setSelectedDream(null);
                setViewMode('details');
              }}
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
                fontFamily: '"Courier New", monospace',
                borderRadius: '3px'
              }}
            >
              x
            </button>

            {viewMode === 'details' ? (
              // Book Cover View
              <div>
                <div style={{
                  background: selectedDream.coverColor || '#f8c8dc',
                  border: '3px solid black',
                  padding: '40px 30px',
                  marginBottom: '20px',
                  minHeight: '250px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                  position: 'relative',
                  boxShadow: 'inset 0 0 50px rgba(0,0,0,0.1)'
                }}>
                  {selectedDream.recurring && (
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: 'black',
                      color: 'white',
                      padding: '4px 10px',
                      fontSize: '10px',
                      fontFamily: '"Courier New", monospace'
                    }}>
                      RECURRING
                    </div>
                  )}

                  <h2 style={{
                    margin: '0',
                    color: 'black',
                    fontSize: '36px',
                    fontFamily: '"Reenie Beanie", cursive',
                    fontWeight: 'normal',
                    textShadow: '2px 2px 0 rgba(255,255,255,0.5)'
                  }}>
                    {selectedDream.title}
                  </h2>

                  <div style={{
                    marginTop: '20px',
                    fontSize: '16px',
                    fontFamily: '"Indie Flower", cursive',
                    color: '#333'
                  }}>
                    by {selectedDream.author}
                  </div>
                </div>

                <div style={{
                  marginBottom: '20px',
                  padding: '15px',
                  border: '2px solid black',
                  background: '#f9f9f9'
                }}>
                  <div style={{
                    fontSize: '12px',
                    marginBottom: '10px',
                    fontFamily: '"Courier New", monospace',
                    color: '#666'
                  }}>
                    <div>Date: {selectedDream.date}</div>
                    {selectedDream.theme && <div>Theme: {selectedDream.theme}</div>}
                  </div>

                  <div style={{
                    fontSize: '14px',
                    lineHeight: '1.7',
                    color: '#333',
                    fontFamily: 'Georgia, serif',
                    fontStyle: 'italic'
                  }}>
                    {selectedDream.description}
                  </div>
                </div>

                {selectedDream.checkoutHistory.length > 0 && (
                  <div style={{
                    padding: '12px',
                    marginBottom: '15px',
                    fontSize: '11px',
                    color: '#666',
                    border: '1px solid #ccc',
                    background: '#fafafa',
                    fontFamily: '"Courier New", monospace'
                  }}>
                    Read by {selectedDream.checkoutHistory.length} {selectedDream.checkoutHistory.length === 1 ? 'person' : 'people'}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {!selectedDream.checkedOut ? (
                    <>
                      {selectedDream.author !== currentUser && (
                        <button
                          onClick={() => checkoutDream(selectedDream.id)}
                          style={{
                            flex: 1,
                            minWidth: '150px',
                            padding: '14px',
                            background: 'black',
                            border: '2px solid black',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontFamily: '"Courier New", monospace',
                            fontWeight: 'bold'
                          }}
                        >
                          [ Check Out to Read ]
                        </button>
                      )}
                      {selectedDream.author === currentUser && (
                        <div style={{
                          flex: 1,
                          padding: '14px',
                          background: '#e0e0e0',
                          border: '2px solid #999',
                          textAlign: 'center',
                          fontSize: '13px',
                          color: '#666',
                          fontFamily: '"Courier New", monospace'
                        }}>
                          This is your dream
                        </div>
                      )}
                    </>
                  ) : selectedDream.currentReader === currentUser ? (
                    <>
                      <button
                        onClick={() => setViewMode('reading')}
                        style={{
                          flex: 1,
                          minWidth: '150px',
                          padding: '14px',
                          background: 'black',
                          border: '2px solid black',
                          color: 'white',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontFamily: '"Courier New", monospace',
                          fontWeight: 'bold'
                        }}
                      >
                        [ Read Dream ]
                      </button>
                      <button
                        onClick={() => {
                          returnDream(selectedDream.id);
                          setSelectedDream(null);
                        }}
                        style={{
                          padding: '14px 20px',
                          background: 'white',
                          border: '2px solid black',
                          color: 'black',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontFamily: '"Courier New", monospace'
                        }}
                      >
                        [ Return ]
                      </button>
                    </>
                  ) : (
                    <div style={{
                      flex: 1,
                      padding: '14px',
                      background: 'black',
                      border: '2px solid black',
                      textAlign: 'center',
                      fontSize: '13px',
                      color: 'white',
                      fontFamily: '"Courier New", monospace'
                    }}>
                      Checked out by {selectedDream.currentReader}
                    </div>
                  )}
                </div>

                {selectedDream.author === currentUser && (
                  <button
                    onClick={() => {
                      if (confirm('Delete your dream from the library?')) {
                        deleteDream(selectedDream.id);
                        setSelectedDream(null);
                      }
                    }}
                    style={{
                      marginTop: '10px',
                      padding: '8px 16px',
                      background: 'white',
                      border: '1px solid #999',
                      color: '#666',
                      cursor: 'pointer',
                      fontSize: '11px',
                      fontFamily: '"Courier New", monospace',
                      width: '100%'
                    }}
                  >
                    [delete]
                  </button>
                )}
              </div>
            ) : (
              // Reading View
              <div>
                <button
                  onClick={() => setViewMode('details')}
                  style={{
                    marginBottom: '20px',
                    padding: '8px 16px',
                    background: 'white',
                    border: '2px solid black',
                    color: 'black',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontFamily: '"Courier New", monospace'
                  }}
                >
                  ← Back to Cover
                </button>

                {selectedDream.recurring && (
                  <div style={{
                    display: 'inline-block',
                    background: 'black',
                    color: 'white',
                    padding: '4px 12px',
                    fontSize: '10px',
                    marginBottom: '15px',
                    fontFamily: '"Courier New", monospace'
                  }}>
                    [RECURRING DREAM]
                  </div>
                )}

                <h2 style={{
                  margin: '0 0 15px',
                  color: 'black',
                  fontSize: '32px',
                  fontFamily: '"Reenie Beanie", cursive',
                  fontWeight: 'normal'
                }}>
                  {selectedDream.title}
                </h2>

                <div style={{
                  marginBottom: '25px',
                  fontSize: '12px',
                  color: '#666',
                  paddingBottom: '15px',
                  borderBottom: '2px solid black',
                  fontFamily: '"Courier New", monospace'
                }}>
                  <div>By: {selectedDream.author}</div>
                  <div>Date: {selectedDream.date}</div>
                  {selectedDream.theme && <div>Theme: {selectedDream.theme}</div>}
                </div>

                <div style={{
                  padding: '30px',
                  marginBottom: '25px',
                  fontSize: '16px',
                  lineHeight: '2',
                  color: '#222',
                  border: '2px solid black',
                  background: '#fffef8',
                  fontFamily: 'Georgia, serif',
                  minHeight: '200px'
                }}>
                  {selectedDream.description}
                </div>

                {selectedDream.checkoutHistory.length > 0 && (
                  <div style={{
                    padding: '15px',
                    marginBottom: '20px',
                    fontSize: '11px',
                    color: '#666',
                    border: '1px solid #ccc',
                    background: '#fafafa',
                    fontFamily: '"Courier New", monospace'
                  }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                      Read by {selectedDream.checkoutHistory.length} {selectedDream.checkoutHistory.length === 1 ? 'person' : 'people'}:
                    </div>
                    {selectedDream.checkoutHistory.slice(-3).map((entry, i) => (
                      <div key={i} style={{ marginTop: '4px' }}>
                        • {entry.user} on {entry.date}
                      </div>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => {
                    returnDream(selectedDream.id);
                    setSelectedDream(null);
                  }}
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: 'black',
                    border: '2px solid black',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontFamily: '"Courier New", monospace',
                    fontWeight: 'bold'
                  }}
                >
                  [ Return to Library ]
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bookshelf Grid - Books showing only titles */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
        gap: '15px',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 10px'
      }}>
        {filteredDreams.map(dream => (
          <BookSpine
            key={dream.id}
            dream={dream}
            currentUser={currentUser}
            onOpen={() => {
              setSelectedDream(dream);
              setViewMode('details');
            }}
          />
        ))}
      </div>

      {filteredDreams.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: '#666'
        }}>
          <div style={{
            display: 'inline-block',
            background: 'white',
            padding: '40px 60px',
            border: '3px solid black',
            borderRadius: '15px'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>📚</div>
            <p style={{ fontSize: '14px', margin: 0, fontFamily: '"Courier New", monospace' }}>
              {filter === 'my-dreams' ? 'No dreams shared yet' :
               filter === 'checked-out' ? 'No dreams checked out' :
               filter === 'available' ? 'No dreams available' :
               'Library is empty'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Book Spine Component - Shows on bookshelf
function BookSpine({ dream, currentUser, onOpen }) {
  const isOwn = dream.author === currentUser;
  const isCheckedOutByMe = dream.checkedOut && dream.currentReader === currentUser;

  return (
    <div
      onClick={onOpen}
      style={{
        background: dream.coverColor || dream.color || '#f8c8dc',
        border: '3px solid black',
        padding: '20px 15px',
        position: 'relative',
        transition: 'all 0.2s',
        cursor: 'pointer',
        minHeight: '200px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        borderRadius: '8px',
        boxShadow: '4px 4px 0 rgba(0,0,0,0.2)'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '6px 8px 0 rgba(0,0,0,0.3)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '4px 4px 0 rgba(0,0,0,0.2)';
      }}
    >
      {dream.recurring && (
        <div style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          fontSize: '16px'
        }}>
          ∞
        </div>
      )}

      <h3 style={{
        margin: '0',
        color: 'black',
        fontSize: '22px',
        fontFamily: '"Reenie Beanie", cursive',
        fontWeight: 'normal',
        lineHeight: '1.3',
        wordBreak: 'break-word',
        textShadow: '1px 1px 0 rgba(255,255,255,0.5)'
      }}>
        {dream.title}
      </h3>

      <div style={{
        marginTop: '15px',
        fontSize: '11px',
        fontFamily: '"Indie Flower", cursive',
        color: '#333',
        opacity: 0.8
      }}>
        {dream.author}
      </div>

      {dream.checkedOut && (
        <div style={{
          position: 'absolute',
          bottom: '8px',
          left: '8px',
          right: '8px',
          fontSize: '9px',
          padding: '3px 6px',
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          borderRadius: '3px',
          fontFamily: '"Courier New", monospace'
        }}>
          {isCheckedOutByMe ? '✓ checked out' : 'out'}
        </div>
      )}
    </div>
  );
}

export default App;

import { useState, useEffect } from 'react';
import './App.css';

// Sample dreams matching reference style
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
    bookColor: 'red'
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
    bookColor: 'blue'
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
    bookColor: 'green'
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
    bookColor: 'brown'
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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDream, setSelectedDream] = useState(null);
  const [viewMode, setViewMode] = useState('details');

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

      setTimeout(() => {
        setShowLibraryCard(false);
      }, 3000);
    }
  };

  const addDream = () => {
    if (!newDream.title.trim()) return;

    const colors = ['red', 'blue', 'green', 'brown', 'purple'];
    const dream = {
      ...newDream,
      id: Date.now(),
      author: currentUser,
      checkedOut: false,
      checkoutHistory: [],
      bookColor: colors[Math.floor(Math.random() * colors.length)]
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

  const filteredDreams = dreams
    .filter(dream => {
      if (filter === 'my-dreams') return dream.author === currentUser;
      if (filter === 'checked-out') return dream.checkedOut;
      if (filter === 'available') return !dream.checkedOut;
      return true;
    })
    .filter(dream => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        dream.title.toLowerCase().includes(q) ||
        dream.description.toLowerCase().includes(q) ||
        dream.author.toLowerCase().includes(q) ||
        (dream.theme || '').toLowerCase().includes(q)
      );
    });

  const myCheckedOutDreams = dreams.filter(d => d.checkedOut && d.currentReader === currentUser);

  const getBookPattern = (color) => {
    const patterns = {
      'red': 'repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(0, 0, 0, 0.04) 8px, rgba(0, 0, 0, 0.04) 16px)',
      'blue': 'repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(0, 0, 0, 0.04) 4px, rgba(0, 0, 0, 0.04) 8px)',
      'green': 'repeating-linear-gradient(0deg, transparent, transparent 6px, rgba(0, 0, 0, 0.04) 6px, rgba(0, 0, 0, 0.04) 12px)',
      'brown': 'linear-gradient(to right, #f8f8f8 0%, #fff 50%, #f8f8f8 100%)',
      'purple': 'radial-gradient(circle at 20% 20%, rgba(0, 0, 0, 0.03) 1px, transparent 1px), radial-gradient(circle at 80% 80%, rgba(0, 0, 0, 0.03) 1px, transparent 1px)'
    };
    return patterns[color] || patterns['brown'];
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', padding: '20px 10px' }}>
      {/* Welcome Screen */}
      {showUserModal && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '40px',
          animation: 'fadeIn 1s ease-in'
        }}>
          <div style={{
            background: '#fff',
            color: '#1a1a1a',
            padding: '60px 80px',
            border: '3px solid #000',
            borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px',
            boxShadow: '5px 5px 0px rgba(0, 0, 0, 0.1), 10px 10px 0px rgba(0, 0, 0, 0.05)',
            textAlign: 'center',
            maxWidth: '600px',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: '15px',
              left: '15px',
              width: '30px',
              height: '30px',
              border: '3px solid #000',
              borderRight: 'none',
              borderBottom: 'none',
              borderRadius: '50% 0 0 0'
            }}></div>
            <div style={{
              position: 'absolute',
              bottom: '15px',
              right: '15px',
              width: '30px',
              height: '30px',
              border: '3px solid #000',
              borderLeft: 'none',
              borderTop: 'none',
              borderRadius: '0 0 50% 0'
            }}></div>

            <h1 style={{
              fontSize: '3.5rem',
              marginBottom: '20px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '3px',
              position: 'relative',
              fontFamily: '"Caveat", cursive'
            }}>
              Dream Library
              <div style={{
                position: 'absolute',
                bottom: '-10px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '200px',
                height: '3px',
                background: '#000',
                borderRadius: '50%'
              }}></div>
            </h1>

            <p style={{
              fontSize: '1.5rem',
              marginBottom: '40px',
              fontStyle: 'italic',
              color: '#333',
              fontFamily: '"Caveat", cursive'
            }}>
              A Collection of Nocturnal Wanderings
            </p>

            <input
              type="text"
              placeholder="Enter your name..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') setUser(e.target.value);
              }}
              style={{
                width: '100%',
                padding: '15px 20px',
                fontFamily: '"Architects Daughter", cursive',
                fontSize: '1.3rem',
                border: '3px solid #000',
                borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px',
                background: '#fff',
                marginBottom: '20px'
              }}
              autoFocus
            />

            <button
              onClick={(e) => {
                const input = e.target.parentElement.querySelector('input');
                setUser(input.value);
              }}
              style={{
                padding: '15px 50px',
                fontFamily: '"Caveat", cursive',
                fontSize: '1.5rem',
                background: '#000',
                color: '#fff',
                border: '3px solid #000',
                cursor: 'pointer',
                borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '2px'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#fff';
                e.target.style.color = '#000';
              }}
              onMouseOut={(e) => {
                e.target.style.background = '#000';
                e.target.style.color = '#fff';
              }}
            >
              Enter the Library
            </button>
          </div>
        </div>
      )}

      {/* Library Card Screen */}
      {showLibraryCard && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2100,
          padding: '20px',
          animation: 'fadeIn 0.3s ease-in'
        }}>
          <div style={{
            background: '#fff',
            width: '500px',
            maxWidth: '90%',
            padding: '40px',
            border: '4px solid #000',
            borderRadius: '15px 255px 15px 255px/255px 15px 255px 15px',
            boxShadow: '8px 8px 0px rgba(0, 0, 0, 0.1), 12px 12px 0px rgba(0, 0, 0, 0.05)',
            fontFamily: '"Architects Daughter", cursive',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              right: '20px',
              bottom: '20px',
              border: '2px dashed #000',
              borderRadius: '10px 200px 10px 200px/200px 10px 200px 10px',
              pointerEvents: 'none'
            }}></div>

            <div style={{
              textAlign: 'center',
              marginBottom: '30px',
              fontSize: '2rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: '#000',
              letterSpacing: '3px',
              position: 'relative'
            }}>
              Library Card
              <div style={{ fontSize: '2rem', marginTop: '10px' }}>📚</div>
            </div>

            <div style={{ margin: '20px 0' }}>
              {[
                ['Name:', currentUser],
                ['Date Issued:', new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })],
                ['Department:', 'Dream Archives'],
                ['Privileges:', 'Unlimited']
              ].map(([label, value], i) => (
                <div key={i} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  margin: '15px 0',
                  padding: '12px 0',
                  borderBottom: '2px solid #000',
                  fontSize: '1.2rem',
                  color: '#000'
                }}>
                  <span style={{ fontWeight: 700 }}>{label}</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>

            <div style={{
              textAlign: 'center',
              marginTop: '30px',
              fontSize: '1.6rem',
              fontWeight: 700,
              color: '#000',
              letterSpacing: '4px',
              padding: '15px',
              border: '3px solid #000',
              borderRadius: '50px',
              background: '#f5f5f5'
            }}>
              № {Math.floor(Math.random() * 900000 + 100000)}
            </div>
          </div>
        </div>
      )}

      {/* Main Library Screen - only show if user has entered name and card is hidden */}
      {!showUserModal && !showLibraryCard && (
        <>
          {/* Header */}
          <div className="sketch-card" style={{
            background: '#fff',
            padding: '40px',
            textAlign: 'center',
            border: 'none',
            borderBottom: '4px solid #000',
            position: 'relative',
            marginBottom: '60px'
          }}>
            <div style={{
              position: 'absolute',
              bottom: '-8px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '80%',
              height: '4px',
              background: 'repeating-linear-gradient(90deg, #000 0px, #000 10px, transparent 10px, transparent 20px)'
            }}></div>

            <h1 className="animated-title sketch-title" style={{
              fontSize: '3rem',
              marginBottom: '15px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '4px',
              color: '#000',
              fontFamily: '"Caveat", cursive'
            }}>
              The Dream Library
            </h1>
            <p style={{
              fontSize: '1.4rem',
              fontStyle: 'italic',
              color: '#333',
              fontFamily: '"Caveat", cursive'
            }}>
              Welcome, {currentUser}
            </p>
          </div>

          {/* Bookshelf Container */}
          <div style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '0 20px'
          }}>
            {/* Toolbar */}
            <div style={{
              display: 'flex',
              gap: '12px',
              alignItems: 'center',
              marginBottom: '24px',
              flexWrap: 'wrap'
            }}>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="sketch-select"
                style={{
                  padding: '10px 14px',
                  fontFamily: '"Architects Daughter", cursive'
                }}
              >
                <option value="all">All Entries</option>
                <option value="my-dreams">My Entries</option>
                <option value="checked-out">Checked Out</option>
                <option value="available">Available</option>
              </select>

              <input
                type="text"
                placeholder="Search title, theme, author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="sketch-input"
                style={{
                  flex: 1,
                  minWidth: '220px',
                  padding: '10px 14px',
                  fontFamily: '"Architects Daughter", cursive'
                }}
              />

              <button
                onClick={() => setShowAddCard(true)}
                className="sketch-button"
                style={{
                  padding: '10px 20px',
                  cursor: 'pointer',
                  fontFamily: '"Caveat", cursive',
                  fontWeight: 700,
                  letterSpacing: '1px'
                }}
              >
                + New Entry
              </button>
            </div>

            {/* My Loans Shelf */}
            {myCheckedOutDreams.length > 0 && (
              <div style={{ marginBottom: '80px', position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  bottom: '-25px',
                  left: 0,
                  right: 0,
                  height: '40px',
                  background: '#fff',
                  border: '3px solid #000',
                  borderRadius: '5px',
                  boxShadow: '0 3px 0 #000, inset 0 -3px 0 rgba(0, 0, 0, 0.1)'
                }}></div>

                <h2 style={{
                  fontSize: '1.6rem',
                  marginBottom: '24px',
                  color: '#000',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  position: 'relative',
                  paddingBottom: '8px',
                  fontFamily: '"Caveat", cursive'
                }}>
                  My Loans
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '110px',
                    height: '3px',
                    background: '#000',
                    borderRadius: '50%'
                  }}></div>
                </h2>

                <div style={{
                  display: 'flex',
                  gap: '8px',
                  flexWrap: 'wrap',
                  paddingBottom: '40px'
                }}>
                  {myCheckedOutDreams.map(dream => (
                    <BookSpine
                      key={dream.id}
                      dream={dream}
                      onOpen={() => {
                        setSelectedDream(dream);
                        setViewMode('details');
                      }}
                      getPattern={getBookPattern}
                    />
                  ))}
                </div>
              </div>
            )}
            {/* Book Shelf */}
            <div style={{ marginBottom: '100px', position: 'relative' }}>
              <div style={{
                position: 'absolute',
                bottom: '-25px',
                left: 0,
                right: 0,
                height: '40px',
                background: '#fff',
                border: '3px solid #000',
                borderRadius: '5px',
                boxShadow: '0 3px 0 #000, inset 0 -3px 0 rgba(0, 0, 0, 0.1)'
              }}></div>

              <h2 style={{
                fontSize: '1.8rem',
                marginBottom: '30px',
                color: '#000',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '2px',
                position: 'relative',
                paddingBottom: '10px',
                fontFamily: '"Caveat", cursive'
              }}>
                Dream Collection
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '150px',
                  height: '3px',
                  background: '#000',
                  borderRadius: '50%'
                }}></div>
              </h2>

              <div style={{
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap',
                paddingBottom: '40px'
              }}>
                {filteredDreams.map(dream => (
                  <BookSpine
                    key={dream.id}
                    dream={dream}
                    onOpen={() => {
                      setSelectedDream(dream);
                      setViewMode('details');
                    }}
                    getPattern={getBookPattern}
                  />
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Add Entry Modal */}
      {showAddCard && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1500,
          padding: '20px',
          animation: 'fadeIn 0.3s ease-in'
        }}
        onClick={() => setShowAddCard(false)}
        >
          <div
            style={{
              background: '#fff',
              width: '640px',
              maxWidth: '95%',
              border: '4px solid #000',
              borderRadius: '15px 255px 15px 255px/255px 15px 255px 15px',
              boxShadow: '8px 8px 0 rgba(0,0,0,0.2)',
              padding: '28px',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{
              fontSize: '1.8rem',
              marginBottom: '16px',
              fontWeight: 700,
              letterSpacing: '1px',
              fontFamily: '"Caveat", cursive'
            }}>
              New Dream Entry
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ gridColumn: '1 / span 2' }}>
                <label style={{ fontWeight: 700, display: 'block', marginBottom: '6px' }}>Title</label>
                <input
                  type="text"
                  value={newDream.title}
                  onChange={(e) => setNewDream(d => ({ ...d, title: e.target.value }))}
                  placeholder="What should we call this dream?"
                  className="sketch-input"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    fontFamily: '"Architects Daughter", cursive'
                  }}
                />
              </div>

              <div>
                <label style={{ fontWeight: 700, display: 'block', marginBottom: '6px' }}>Date</label>
                <input
                  type="date"
                  value={newDream.date}
                  onChange={(e) => setNewDream(d => ({ ...d, date: e.target.value }))}
                  className="sketch-input"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    background: '#fff'
                  }}
                />
              </div>

              <div>
                <label style={{ fontWeight: 700, display: 'block', marginBottom: '6px' }}>Theme</label>
                <input
                  type="text"
                  value={newDream.theme}
                  onChange={(e) => setNewDream(d => ({ ...d, theme: e.target.value }))}
                  placeholder="e.g. Adventure, Mystery, Fantasy"
                  className="sketch-input"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    fontFamily: '"Architects Daughter", cursive'
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  id="recurring"
                  type="checkbox"
                  checked={newDream.recurring}
                  onChange={(e) => setNewDream(d => ({ ...d, recurring: e.target.checked }))}
                />
                <label htmlFor="recurring" style={{ fontWeight: 700 }}>Recurring</label>
              </div>

              <div style={{ gridColumn: '1 / span 2' }}>
                <label style={{ fontWeight: 700, display: 'block', marginBottom: '6px' }}>Description</label>
                <textarea
                  value={newDream.description}
                  onChange={(e) => setNewDream(d => ({ ...d, description: e.target.value }))}
                  rows={6}
                  placeholder="Write the dream as if it were a short story..."
                  className="sketch-textarea"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    fontFamily: '"Architects Daughter", cursive',
                    background: '#fff'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '16px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowAddCard(false)}
                className="sketch-button"
                style={{
                  padding: '10px 20px',
                  cursor: 'pointer',
                  fontFamily: '"Caveat", cursive'
                }}
              >
                Cancel
              </button>
              <button
                onClick={addDream}
                disabled={!newDream.title.trim()}
                className="sketch-button"
                style={{
                  padding: '10px 24px',
                  cursor: 'pointer',
                  fontFamily: '"Caveat", cursive',
                  opacity: newDream.title.trim() ? 1 : 0.6
                }}
              >
                Add Entry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Book Modal - showing when a book is selected */}
      {selectedDream && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.8)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          animation: 'fadeIn 0.3s ease-in',
          overflowY: 'auto'
        }}
        onClick={() => {
          setSelectedDream(null);
          setViewMode('details');
        }}
        >
          <div style={{
            background: '#fff',
            maxWidth: '800px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            border: '5px solid #000',
            borderRadius: '20px 255px 20px 255px/255px 20px 255px 20px',
            boxShadow: '10px 10px 0 rgba(0, 0, 0, 0.2), 15px 15px 0 rgba(0, 0, 0, 0.1)',
            position: 'relative'
          }}
          onClick={(e) => e.stopPropagation()}
          >
            {viewMode === 'details' ? (
              <>
                {/* Book Cover */}
                <div style={{
                  background: getBookPattern(selectedDream.bookColor),
                  padding: '60px 40px',
                  textAlign: 'center',
                  borderBottom: '4px solid #000',
                  color: '#000',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '30px',
                    left: '30px',
                    right: '30px',
                    bottom: '30px',
                    border: '3px dashed #000',
                    borderRadius: '10px'
                  }}></div>

                  <div style={{
                    position: 'absolute',
                    fontSize: '3rem',
                    color: '#000',
                    top: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)'
                  }}>✦</div>

                  <h2 style={{
                    fontSize: '2.8rem',
                    fontWeight: 700,
                    marginBottom: '20px',
                    textTransform: 'uppercase',
                    letterSpacing: '3px',
                    position: 'relative',
                    zIndex: 1,
                    marginTop: '30px',
                    fontFamily: '"Caveat", cursive'
                  }}>
                    {selectedDream.title}
                  </h2>

                  <div style={{
                    fontSize: '1.4rem',
                    fontStyle: 'italic',
                    position: 'relative',
                    zIndex: 1,
                    fontFamily: '"Architects Daughter", cursive'
                  }}>
                    by {selectedDream.author}
                  </div>
                </div>

                {/* Book Description */}
                <div style={{ padding: '40px', color: '#000', background: '#fff' }}>
                  <h3 style={{
                    fontSize: '2rem',
                    marginBottom: '20px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    color: '#000',
                    position: 'relative',
                    paddingBottom: '10px',
                    fontFamily: '"Caveat", cursive'
                  }}>
                    Synopsis
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '100px',
                      height: '3px',
                      background: '#000'
                    }}></div>
                  </h3>

                  <p style={{
                    fontSize: '1.3rem',
                    lineHeight: '1.8',
                    marginBottom: '30px',
                    fontFamily: '"Architects Daughter", cursive'
                  }}>
                    {selectedDream.description}
                  </p>

                  {/* Checkout History */}
                  <div style={{
                    marginTop: '10px',
                    marginBottom: '20px',
                    padding: '16px',
                    border: '2px dashed #000',
                    background: '#fdfdfd',
                    borderRadius: '10px'
                  }}>
                    <div style={{ fontWeight: 700, marginBottom: '10px' }}>Checkout History</div>
                    {selectedDream.checkoutHistory && selectedDream.checkoutHistory.length > 0 ? (
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontFamily: '"Architects Daughter", cursive' }}>
                        {selectedDream.checkoutHistory.map((h, idx) => (
                          <li key={idx} style={{ padding: '6px 0', borderBottom: '1px dotted #000' }}>
                            <span style={{ fontWeight: 700 }}>{h.user}</span> — <span>{h.date}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div style={{ fontStyle: 'italic', opacity: 0.8 }}>No history yet.</div>
                    )}
                  </div>

                  <div style={{
                    padding: '25px',
                    background: '#f9f9f9',
                    border: '3px dashed #000',
                    margin: '20px 0',
                    textAlign: 'center',
                    fontFamily: '"Architects Daughter", cursive',
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    borderRadius: '10px'
                  }}>
                    {!selectedDream.checkedOut ? (
                      <div>📚 STATUS: AVAILABLE FOR CHECKOUT</div>
                    ) : selectedDream.currentReader === currentUser ? (
                      <div>✓ CHECKED OUT • DUE DATE: NEVER</div>
                    ) : (
                      <div>CHECKED OUT BY {selectedDream.currentReader.toUpperCase()}</div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '20px', marginTop: '30px', flexWrap: 'wrap' }}>
                    {!selectedDream.checkedOut && selectedDream.author !== currentUser && (
                      <button
                        onClick={() => checkoutDream(selectedDream.id)}
                        style={{
                          flex: 1,
                          minWidth: '150px',
                          padding: '15px',
                          fontFamily: '"Caveat", cursive',
                          fontSize: '1.3rem',
                          border: '3px solid #000',
                          cursor: 'pointer',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px',
                          background: '#000',
                          color: '#fff'
                        }}
                      >
                        Check Out Book
                      </button>
                    )}

                    {selectedDream.checkedOut && selectedDream.currentReader === currentUser && (
                      <>
                        <button
                          onClick={() => setViewMode('reading')}
                          style={{
                            flex: 1,
                            minWidth: '150px',
                            padding: '15px',
                            fontFamily: '"Caveat", cursive',
                            fontSize: '1.3rem',
                            border: '3px solid #000',
                            cursor: 'pointer',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px',
                            background: '#000',
                            color: '#fff'
                          }}
                        >
                          Read Book
                        </button>
                        <button
                          onClick={() => {
                            returnDream(selectedDream.id);
                            setSelectedDream(null);
                          }}
                          style={{
                            flex: 1,
                            minWidth: '150px',
                            padding: '15px',
                            fontFamily: '"Caveat", cursive',
                            fontSize: '1.3rem',
                            border: '3px solid #000',
                            cursor: 'pointer',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px',
                            background: '#fff',
                            color: '#000'
                          }}
                        >
                          Return Book
                        </button>
                      </>
                    )}

                    {selectedDream.author === currentUser && !selectedDream.checkedOut && (
                      <button
                        onClick={() => {
                          deleteDream(selectedDream.id);
                          setSelectedDream(null);
                        }}
                        style={{
                          flex: 1,
                          minWidth: '150px',
                          padding: '15px',
                          fontFamily: '"Caveat", cursive',
                          fontSize: '1.3rem',
                          border: '3px solid #000',
                          cursor: 'pointer',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px',
                          background: '#fff',
                          color: '#000'
                        }}
                      >
                        Delete Entry
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setSelectedDream(null);
                        setViewMode('details');
                      }}
                      style={{
                        flex: 1,
                        minWidth: '150px',
                        padding: '15px',
                        fontFamily: '"Caveat", cursive',
                        fontSize: '1.3rem',
                        border: '3px solid #000',
                        cursor: 'pointer',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px',
                        background: '#fff',
                        color: '#000'
                      }}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </>
            ) : (
              // Reading View
              <div style={{ padding: '40px', background: '#fff', color: '#000' }}>
                <button
                  onClick={() => setViewMode('details')}
                  style={{
                    marginBottom: '20px',
                    padding: '8px 16px',
                    background: '#fff',
                    border: '2px solid #000',
                    color: '#000',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontFamily: '"Courier New", monospace',
                    borderRadius: '5px'
                  }}
                >
                  ← Back to Cover
                </button>

                <h2 style={{
                  margin: '0 0 30px',
                  textAlign: 'center',
                  fontWeight: 700,
                  color: '#000',
                  fontSize: '2.5rem',
                  textTransform: 'uppercase',
                  position: 'relative',
                  paddingBottom: '20px',
                  fontFamily: '"Caveat", cursive'
                }}>
                  {selectedDream.title}
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '200px',
                    height: '4px',
                    background: '#000',
                    borderRadius: '50%'
                  }}></div>
                </h2>

                <div style={{
                  marginBottom: '40px',
                  padding: '30px',
                  background: '#f9f9f9',
                  borderLeft: '5px solid #000',
                  borderRadius: '5px',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '15px',
                    right: '20px',
                    fontSize: '1.5rem',
                    color: '#000',
                    opacity: 0.3
                  }}>✦</div>

                  <div style={{
                    fontFamily: '"Architects Daughter", cursive',
                    fontSize: '1rem',
                    color: '#000',
                    marginBottom: '15px',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    fontWeight: 700,
                    padding: '8px 15px',
                    background: '#fff',
                    border: '2px solid #000',
                    display: 'inline-block',
                    borderRadius: '20px'
                  }}>
                    {selectedDream.date}
                  </div>

                  <div style={{
                    fontSize: '1.3rem',
                    lineHeight: '1.9',
                    fontFamily: '"Architects Daughter", cursive'
                  }}>
                    {selectedDream.description}
                  </div>
                </div>

                <button
                  onClick={() => {
                    returnDream(selectedDream.id);
                    setSelectedDream(null);
                  }}
                  style={{
                    width: '100%',
                    padding: '15px 40px',
                    fontFamily: '"Caveat", cursive',
                    fontSize: '1.3rem',
                    background: '#000',
                    color: '#fff',
                    border: '3px solid #000',
                    borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px',
                    cursor: 'pointer',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    display: 'block',
                    margin: '0 auto'
                  }}
                >
                  Return to Library
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Book Spine Component
function BookSpine({ dream, onOpen, getPattern }) {
  return (
    <div
      onClick={onOpen}
      className="book-spine"
      style={{
        width: '45px',
        height: '280px',
        background: '#fff',
        border: '2px solid #000',
        cursor: 'pointer',
        position: 'relative',
        transition: 'all 0.3s ease',
        boxShadow: '2px 2px 0 rgba(0, 0, 0, 0.15)',
        backgroundImage: getPattern(dream.bookColor)
      }}
    >
      {/* Dashed border decoration */}
      <div style={{
        position: 'absolute',
        top: '8px',
        left: '3px',
        right: '3px',
        bottom: '8px',
        border: '1px solid #000',
        borderStyle: 'dashed'
      }}></div>

      {/* Book Title */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%) rotate(-90deg)',
        transformOrigin: 'center',
        fontSize: '0.75rem',
        fontWeight: 600,
        color: '#000',
        whiteSpace: 'nowrap',
        letterSpacing: '0.5px',
        textTransform: 'none',
        width: '260px',
        textAlign: 'center',
        zIndex: 10,
        fontFamily: '"Architects Daughter", cursive'
      }}>
        {dream.title}
      </div>
    </div>
  );
}

export default App;

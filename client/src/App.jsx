import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Navigate, Route, Routes, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Bell, Bookmark, Camera, ChevronRight, Compass, ExternalLink, Film, FileText, Heart, Home as HomeIcon, LogIn, MessageCircle, Play, Plus, Search, ScrollText, Send, Sparkles, Upload, UserCircle, Users, WandSparkles } from 'lucide-react'
const learningTopics = ['Cinematography', 'Screenwriting', 'Lighting', 'Sound design', 'Film direction', 'Editing', 'Film history', 'Production design', 'Producing', 'Acting', 'Color grading', 'Documentary filmmaking', 'Animation', 'Visual effects', 'Camera operation', 'Script supervision', 'Casting', 'Costume design', 'Makeup and hair', 'Location scouting', 'Line producing', 'Production management', 'Film business', 'Distribution', 'Film festivals', 'Cinematography technology', 'Music for film', 'Voice and dialogue', 'Set decoration', 'Story development']
const learningResources = {
  Cinematography: { description: 'Build a visual language through framing, movement, lenses, and light.', books: ['Cinematography: Theory and Practice', 'The Five C’s of Cinematography', 'Painting with Light'], videos: ['The language of camera movement', 'Understanding focal length', 'Lighting a night interior'], websites: ['StudioBinder shot list guide', 'FilmSkills cinematography library', 'ARRI lighting resources'] },
  Screenwriting: { description: 'Shape clear scenes, strong characters, and stories that keep turning the page.', books: ['Story by Robert McKee', 'The Anatomy of Story', 'Save the Cat! Writes for TV'], videos: ['Writing a compelling scene', 'Building character arcs', 'The three-act structure'], websites: ['ScreenCraft writing guides', 'The Writers Store', 'John August’s screenwriting notes'] },
  Lighting: { description: 'Use contrast, color, and shadow to tell the story before a character speaks.', books: ['Light: Science and Magic', 'The Art of Dramatic Lighting', 'Painting with Light'], videos: ['Key, fill, and backlight explained', 'Practical lighting on set', 'Creating mood with color'], websites: ['No Film School lighting guides', 'CineD lighting tutorials', 'Nanlite learning center'] },
  'Sound design': { description: 'Create a richer world through field recording, atmosphere, dialogue, and silence.', books: ['Sound Design: The Expressive Power of Music', 'Audio-Vision', 'The Foley Grail'], videos: ['Recording clean production sound', 'Designing a cinematic atmosphere', 'Foley basics for filmmakers'], websites: ['A Sound Effect library', 'Pro Sound Effects guides', 'Audio Engineering Society'] },
  'Film direction': { description: 'Lead the room with intention, translate ideas into images, and protect the story.', books: ['Directing: Film Techniques and Aesthetics', 'Making Movies', 'Notes on Directing'], videos: ['Working with actors', 'Planning a scene', 'Directing a short film'], websites: ['MasterClass directing lessons', 'Indie Film Hustle', 'Film Courage interviews'] },
  Editing: { description: 'Find rhythm, meaning, and emotion by shaping time one cut at a time.', books: ['In the Blink of an Eye', 'The Technique of Film Editing', 'Cutting Rhythms'], videos: ['The grammar of editing', 'Building a scene in the cut', 'Sound and picture editing'], websites: ['Frame.io workflow guides', 'PremiumBeat editing tips', 'Adobe video tutorials'] },
  'Film history': { description: 'Trace the movements, artists, and ideas that shaped the language of cinema.', books: ['The Story of Film', 'Film Art: An Introduction', 'A History of Narrative Film'], videos: ['A tour through film movements', 'How cinema changed over time', 'Understanding film classics'], websites: ['BFI film history', 'Criterion essays', 'Library of Congress cinema archive'] },
  'Production design': { description: 'Build believable worlds through locations, props, color, texture, and visual detail.', books: ['The Filmmaker’s Guide to Production Design', 'Designing for Film', 'The Art of Production Design'], videos: ['Designing a visual world', 'Set dressing fundamentals', 'Color and story in production design'], websites: ['Art Department Masterclass', 'Production Design Studio', 'The Credits design guides'] },
  Producing: { description: 'Turn a creative idea into a practical, collaborative production from page to screen.', books: ['The Producer’s Business Handbook', 'Producer to Producer', 'The Film Producer’s Handbook'], videos: ['Breaking down a script', 'Planning a film budget', 'Building a strong crew'], websites: ['Film Independent resources', 'Sundance artist programs', 'Producer’s Guild guides'] },
  Acting: { description: 'Develop truthful performances through intention, listening, movement, and character work.', books: ['An Actor Prepares', 'Respect for Acting', 'The Intent to Live'], videos: ['Finding character intention', 'On-camera audition basics', 'Working through a scene'], websites: ['Backstage acting advice', 'Actors Access resources', 'The Actor’s Studio'] },
}

function storeScriptDocument(key, data) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('a-max-script-documents', 1)
    request.onupgradeneeded = () => request.result.createObjectStore('documents')
    request.onsuccess = () => { const transaction = request.result.transaction('documents', 'readwrite'); transaction.objectStore('documents').put(data, key); transaction.oncomplete = resolve; transaction.onerror = () => reject(transaction.error) }
    request.onerror = () => reject(request.error)
  })
}

function readScriptDocument(key) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('a-max-script-documents', 1)
    request.onupgradeneeded = () => request.result.createObjectStore('documents')
    request.onsuccess = () => { const transaction = request.result.transaction('documents', 'readonly'); const read = transaction.objectStore('documents').get(key); read.onsuccess = () => resolve(read.result || ''); read.onerror = () => reject(read.error) }
    request.onerror = () => reject(request.error)
  })
}

function Learn() { const [params] = useSearchParams(); const [search, setSearch] = useState(''); const showAll = params.get('view') === 'all'; const filteredTopics = learningTopics.filter(topic => topic.toLowerCase().includes(search.trim().toLowerCase())); const visibleTopics = search.trim() ? filteredTopics : showAll ? learningTopics : learningTopics.slice(0, 6); const lessonCounts = ['18 lessons', '12 lessons', '09 lessons', '14 lessons', '21 lessons', '16 lessons', '10 lessons', '13 lessons', '11 lessons', '15 lessons', '08 lessons', '17 lessons', '20 lessons', '12 lessons', '09 lessons', '11 lessons', '07 lessons', '10 lessons', '08 lessons', '13 lessons', '15 lessons', '18 lessons', '09 lessons', '06 lessons', '12 lessons', '14 lessons', '10 lessons', '08 lessons', '11 lessons', '16 lessons']; return <><div className="learn-page-header"><h1 className="marketplace-wordmark">LEARN</h1><label className="learn-search"><Search size={16}/><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search courses..." aria-label="Search courses"/></label>{showAll ? <Link className="text-button" to="/learn">Show featured topics <ChevronRight size={15}/></Link> : <Link className="text-button" to="/learn?view=all">View all learning <ChevronRight size={15}/></Link>}</div><div className="topic-grid">{visibleTopics.length ? visibleTopics.map((topic, i) => <Link className="topic-card-link" to={`/learn/${topic.toLowerCase().replace(/\s+/g, '-')}`} key={topic}><article><span>{String(learningTopics.indexOf(topic) + 1).padStart(2, '0')}</span><h3>{topic}</h3><p>{lessonCounts[learningTopics.indexOf(topic)]}</p><ChevronRight size={18}/></article></Link>) : <p className="learn-empty">No courses match your search.</p>}</div></> }

function LearnTopicPage() {
  const { topic } = useParams()
  const navigate = useNavigate()
  const topicName = learningTopics.find(item => item.toLowerCase().replace(/\s+/g, '-') === topic)
  const resource = topicName ? learningResources[topicName] || { description: `Build practical skills in ${topicName.toLowerCase()} for your next film.`, books: [`The essentials of ${topicName}`, `${topicName}: a practical guide`, `Mastering ${topicName}`], videos: [`${topicName} fundamentals`, `${topicName} on set`, `A working ${topicName} tutorial`], websites: [`${topicName} learning library`, `${topicName} community guides`, `${topicName} filmmaker resources`] } : null
  if (!resource) return <div className="placeholder"><h1>Lesson not found</h1><button className="primary-button" onClick={() => navigate('/learn')}>Back to Learn</button></div>
  const groups = [{ label: 'Books', icon: <FileText size={17}/>, items: resource.books }, { label: 'Video tutorials', icon: <Play size={17}/>, items: resource.videos }, { label: 'Recommended websites', icon: <ExternalLink size={17}/>, items: resource.websites }]
  return <div className="course-page"><button className="upload-back" onClick={() => navigate('/learn')}><ArrowLeft size={17}/> Back to Learn</button><header className="course-page-heading"><span className="eyebrow warm">THE WORKSHOP</span><h1>{topicName}</h1><p>{resource.description}</p></header><div className="course-resource-grid">{groups.map(group => <section className="course-resource-section" key={group.label}><div className="course-resource-heading"><span className="eyebrow">{group.icon} {group.label}</span><small>{group.items.length} resources</small></div><div className="course-resource-list">{group.items.map(item => <a href={`https://www.google.com/search?q=${encodeURIComponent(item + ' ' + topicName)}`} target="_blank" rel="noreferrer" key={item}><div><h2>{item}</h2><p>{group.label === 'Books' ? 'A foundational reference for your next study session.' : group.label === 'Video tutorials' ? 'A focused lesson to watch and practice.' : 'A useful guide, library, or working resource.'}</p></div><ExternalLink size={15}/></a>)}</div></section>)}</div></div>
}
import { useBookmarks } from './context/BookmarksContext'

const films = [
  { title: 'The Last Light', creator: 'Maya Chen', genre: 'Drama · 12 min', image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=900&q=80', accent: 'New release' },
  { title: 'Nocturne in Blue', creator: 'Elias Ford', genre: 'Experimental · 08 min', image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=80', accent: 'Trending' },
  { title: 'Field Notes', creator: 'Sofia Reyes', genre: 'Documentary · 18 min', image: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=900&q=80', accent: 'Staff pick' },
  { title: 'A Place Between', creator: 'Theo Hart', genre: 'Short film · 14 min', image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=900&q=80', accent: 'Most watched' },
]

const creators = [
  { name: 'Maya Chen', role: 'Director · Cinematographer', image: 'https://i.pravatar.cc/160?img=47', followers: '12.4k', color: '#e7b45e' },
  { name: 'Elias Ford', role: 'Editor · Storyteller', image: 'https://i.pravatar.cc/160?img=12', followers: '8.8k', color: '#85a9a4' },
  { name: 'Sofia Reyes', role: 'Documentary filmmaker', image: 'https://i.pravatar.cc/160?img=32', followers: '6.2k', color: '#bc8971' },
]

const scripts = [
  { title: 'The Shape of Rain', creator: 'Nia Okafor', type: 'Screenplay · 24 pages', image: 'https://images.unsplash.com/photo-1455390582262-044c7d9a9c2b?auto=format&fit=crop&w=700&q=80' },
  { title: 'Second Take', creator: 'Jon Bell', type: 'Short story · 08 pages', image: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=700&q=80' },
  { title: 'After the Static', creator: 'Priya Shah', type: 'Screenplay · 31 pages', image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=700&q=80' },
  { title: 'Blue Hour', creator: 'Rafael Costa', type: 'Story idea · 04 pages', image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=700&q=80' },
]

const equipment = [
  { title: 'ARRI Alexa Mini', seller: 'Frame House Rentals', detail: 'Camera · Excellent', price: '$180 / day', image: 'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?auto=format&fit=crop&w=700&q=80' },
  { title: 'Cooke S4 Prime Set', seller: 'Kiran Menon', detail: 'Lenses · Like new', price: '$4,200', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=700&q=80' },
  { title: 'Aputure 600D Pro', seller: 'Studio North', detail: 'Lighting · Good', price: '$95 / day', image: 'https://images.unsplash.com/photo-1580136579312-94651dfd596d?auto=format&fit=crop&w=700&q=80' },
  { title: 'Zoom F6 Recorder', seller: 'Sound Dept.', detail: 'Audio · Excellent', price: '$580', image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=700&q=80' },
]

const featuredTrailers = [
  { title: 'The Odyssey', rating: '8.7', poster: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=85', video: 'https://videos.pexels.com/video-files/3129595/3129595-uhd_2560_1440_25fps.mp4' },
  { title: 'Dune: Part Two', rating: '8.6', poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1600&q=85', video: 'https://videos.pexels.com/video-files/3129595/3129595-uhd_2560_1440_25fps.mp4' },
  { title: 'The Last Light', rating: '8.2', poster: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1600&q=85', video: 'https://videos.pexels.com/video-files/3129595/3129595-uhd_2560_1440_25fps.mp4' },
  { title: 'Nocturne in Blue', rating: '7.9', poster: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1600&q=85', video: 'https://videos.pexels.com/video-files/3129595/3129595-uhd_2560_1440_25fps.mp4' },
]

const notifications = [
  { type: 'like', title: 'Maya Chen liked your film', detail: 'The Last Light · 2 min ago' },
  { type: 'news', title: 'New film news is live', detail: 'The 2026 independent cinema shortlist · 18 min ago' },
  { type: 'follow', title: 'Elias Ford started following you', detail: 'Editor · Storyteller · 1 hr ago' },
  { type: 'community', title: 'New discussion in Independent Filmmakers', detail: 'What makes a scene unforgettable? · 3 hrs ago' },
]

const communityConversations = [
  { community: 'Screenwriters Room', members: '8.7k members', title: 'How do you write an ending that stays with people?', detail: 'Share the scenes you are still thinking about.' },
  { community: 'Cinematographers', members: '5.2k members', title: 'What is your favorite way to shape natural light?', detail: 'Trade setups, references, and happy accidents.' },
  { community: 'Independent Filmmakers', members: '12.4k members', title: 'What are you making this month?', detail: 'A place to share works in progress and find collaborators.' },
]

const messageSeed = {
  'maya-chen': [{ sender: 'them', text: 'The new cut is looking beautiful. I sent over the scene notes.', time: '10:42 AM' }],
  'elias-ford': [{ sender: 'me', text: 'Are you free to talk through the sound mix this week?', time: 'Yesterday' }],
  'sofia-reyes': [{ sender: 'them', text: 'Thank you for sharing your documentary notes.', time: 'Mon' }],
  'community:independent-filmmakers': [{ sender: 'them', text: 'Welcome to the group. Share what you are making this week.', time: 'Today' }],
  'community:screenwriters-room': [{ sender: 'them', text: 'New prompt: write a scene with no spoken dialogue.', time: 'Yesterday' }],
}
const messageCommunities = [
  { name: 'Independent Filmmakers', members: '12.4k', image: 'https://i.pravatar.cc/160?img=32', preview: 'A home for the brave, scrappy, and self-funded.' },
  { name: 'Screenwriters Room', members: '8.7k', image: 'https://i.pravatar.cc/160?img=12', preview: 'Pages, premises, and the messy middle.' },
  { name: 'Cinematographers', members: '5.2k', image: 'https://i.pravatar.cc/160?img=47', preview: 'Light chasers and lens obsessives.' },
  { name: 'Vintage Camera Collectors', members: '3.1k', image: 'https://i.pravatar.cc/160?img=57', preview: 'Old glass, new stories.' },
]

function Shell({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const isHome = location.pathname === '/'
  const isAuthenticated = Boolean(localStorage.getItem('a-max-token'))
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [recentSearches, setRecentSearches] = useState(() => { try { return JSON.parse(localStorage.getItem('a-max-recent-searches') || '[]').slice(0, 5) } catch { return [] } })
  const [createOpen, setCreateOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [navbarProfile, setNavbarProfile] = useState(() => { try { return JSON.parse(localStorage.getItem('a-max-profile') || 'null') } catch { return null } })
  const filmInputRef = useRef(null)
  const scriptInputRef = useRef(null)

  useEffect(() => {
    const syncProfile = () => {
      try { setNavbarProfile(JSON.parse(localStorage.getItem('a-max-profile') || 'null')) } catch { setNavbarProfile(null) }
    }
    syncProfile()
    window.addEventListener('storage', syncProfile)
    window.addEventListener('a-max-profile-updated', syncProfile)
    return () => {
      window.removeEventListener('storage', syncProfile)
      window.removeEventListener('a-max-profile-updated', syncProfile)
    }
  }, [])
  const submitSearch = event => {
    if (event.key === 'Enter' && searchQuery.trim()) {
      const value = searchQuery.trim()
      const next = [value, ...recentSearches.filter(item => item.toLowerCase() !== value.toLowerCase())].slice(0, 5)
      setRecentSearches(next)
      localStorage.setItem('a-max-recent-searches', JSON.stringify(next))
      navigate(`/explore?search=${encodeURIComponent(value)}`)
      setSearchFocused(false)
    }
  }
  const localFilms = (() => { try { return JSON.parse(localStorage.getItem('a-max-published-films') || '[]') } catch { return [] } })()
  const localScripts = (() => { try { return JSON.parse(localStorage.getItem('a-max-published-scripts') || '[]') } catch { return [] } })()
  const navProfile = navbarProfile || { name: 'Arjun Mehta', role: 'Director · Writer', image: 'https://i.pravatar.cc/80?img=57' }
  const query = searchQuery.trim().toLowerCase()
  const searchResults = query ? [
    ...creators.filter(creator => `${creator.name} ${creator.name.toLowerCase().replace(/\s+/g, '-')}`.toLowerCase().includes(query)).map(creator => ({ kind: 'Filmmaker', title: creator.name, detail: creator.role, image: creator.image, path: `/profile/${creator.name.toLowerCase().replace(/\s+/g, '-')}` })),
    ...[...films, ...localFilms].filter(film => `${film.title} ${film.creator}`.toLowerCase().includes(query)).map(film => ({ kind: 'Film', title: film.title, detail: film.creator, image: film.image, path: '/explore' })),
    ...[...scripts, ...localScripts].filter(script => `${script.title} ${script.creator}`.toLowerCase().includes(query)).map(script => ({ kind: 'Script / Story', title: script.title, detail: script.creator, image: script.image, path: '/explore' })),
  ].slice(0, 6) : []
  const chooseFilm = event => {
    const file = event.target.files?.[0]
    if (file) navigate('/upload?type=film', { state: { file } })
    event.target.value = ''
  }
  const chooseScript = event => {
    const file = event.target.files?.[0]
    if (file) navigate('/upload-script', { state: { file } })
    event.target.value = ''
  }
  return <div className="app-shell">
    <aside className="sidebar">
      <Link className="brand" to="/"><span className="imax-wordmark"><span className="logo-a">A</span><span className="logo-max">MAX</span></span></Link>
      <div className="sidebar-label">Your studio</div>
      <nav className="primary-nav">
        <NavItem to="/" icon={<HomeIcon size={17}/>} label="Home" />
        <NavItem to="/explore" icon={<Compass size={17}/>} label="Explore" />
        <NavItem to="/learn" icon={<WandSparkles size={17}/>} label="Learn" />
        <NavItem to="/marketplace" icon={<Film size={17}/>} label="Marketplace" />
        <NavItem to="/communities" icon={<Users size={17}/>} label="Communities" />
      </nav>
      <div className="sidebar-label space-label">Stay connected</div>
      <nav className="primary-nav">
        <NavItem to="/messages" icon={<MessageCircle size={17}/>} label="Messages" badge="3" />
        <NavItem to="/bookmarks" icon={<Bookmark size={17}/>} label="Bookmarks" />
        <NavItem to="/notifications" icon={<Bell size={17}/>} label="Notifications" badge="" />
      </nav>
      <div className="sidebar-bottom">
        {isAuthenticated ? <Link className="profile-mini" to="/profile"><img src={navProfile.image} /><span><strong>{navProfile.name}</strong><small>{navProfile.role}</small></span><ChevronRight size={15}/></Link> : <Link className="profile-mini guest-profile" to="/login"><UserCircle size={32}/><span><strong>Sign in</strong><small>Access your profile</small></span><LogIn size={15}/></Link>}
        <div className="studio-note"><Sparkles size={15}/><span>Make something<br/><strong>worth watching.</strong></span></div>
      </div>
    </aside>
    <main className="main-content">
      {isHome && <header className="topbar">
        <div className="mobile-brand"><span className="imax-wordmark"><span className="logo-a">A</span><span className="logo-max">MAX</span></span></div>
        <div className="search-wrap"><label className="search-trigger"><Search size={17}/><input value={searchQuery} onFocus={() => setSearchFocused(true)} onChange={event => setSearchQuery(event.target.value)} onKeyDown={submitSearch} placeholder="Search films, people, ideas..." aria-label="Search films, people, ideas"/></label>{searchFocused && (query ? <div className="search-results">{searchResults.length ? searchResults.map(result => <Link key={`${result.kind}-${result.title}`} to={result.path} onClick={() => { setSearchQuery(''); setSearchFocused(false) }}><img src={result.image} alt=""/><span><strong>{result.title}</strong><small>{result.kind} · {result.detail}</small></span><ChevronRight size={14}/></Link>) : <p className="search-empty">No films, filmmakers, or scripts found.</p>}</div> : recentSearches.length > 0 && <div className="search-results recent-searches"><div className="recent-heading"><span>Recent searches</span><button onMouseDown={event => event.preventDefault()} onClick={() => { setRecentSearches([]); localStorage.removeItem('a-max-recent-searches') }}>Clear</button></div>{recentSearches.slice(0, 5).map(item => <button className="recent-search-item" key={item} onMouseDown={event => event.preventDefault()} onClick={() => { setSearchQuery(item); navigate(`/explore?search=${encodeURIComponent(item)}`); setSearchFocused(false) }}><Search size={14}/><span>{item}</span><ArrowRight size={13}/></button>)}</div>)}</div>
        <div className="top-actions"><div className="notification-menu"><button className="icon-button" aria-label="Notifications" aria-expanded={notificationsOpen} onClick={() => setNotificationsOpen(!notificationsOpen)}><Bell size={18}/><i /></button>{notificationsOpen && <div className="notification-panel"><div className="notification-header"><div><span className="eyebrow">YOUR STUDIO</span><h2>Notifications</h2></div><span className="notification-count">4 new</span></div>{notifications.map((notification, index) => <article className="notification-item" key={notification.title}><span className={`notification-dot notification-${notification.type}`}><Bell size={13}/></span><div><strong>{notification.title}</strong><p>{notification.detail}</p></div>{index < 2 && <b />}</article>)}<Link className="notification-footer" to="/notifications" onClick={() => setNotificationsOpen(false)}>View all activity <ChevronRight size={14}/></Link></div>}</div><div className="create-menu"><button className="upload-button" onClick={() => setCreateOpen(!createOpen)} aria-expanded={createOpen}><Plus size={17}/> Create</button>{createOpen && <div className="create-dropdown"><button onClick={() => { setCreateOpen(false); filmInputRef.current?.click() }}><Film size={16}/><strong>Film</strong></button><button onClick={() => { setCreateOpen(false); scriptInputRef.current?.click() }}><ScrollText size={16}/><strong>Script/Story</strong></button><Link to="/upload?type=equipment" onClick={() => setCreateOpen(false)}><Camera size={16}/><strong>Equipment</strong></Link></div>}</div><input ref={filmInputRef} className="hidden-file-input" type="file" accept="video/mp4,.mp4" onChange={chooseFilm} /><input ref={scriptInputRef} className="hidden-file-input" type="file" accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,.pdf,.doc,.docx,.txt" onChange={chooseScript} /></div>
      </header>}
      <div className="page-wrap">{children}</div>
    </main>
  </div>
}

function NavItem({ to, icon, label, badge }) { return <NavLink className="nav-item" to={to}>{icon}<span>{label}</span>{badge !== undefined && <b>{badge || '•'}</b>}</NavLink> }

export function ScrollToTop() {
  const { pathname, search } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname, search])
  return null
}

function SectionTitle({ eyebrow, title, action = 'View all', to }) { return <div className="section-title"><div><span className="eyebrow">{eyebrow}</span>{title && <h2>{title}</h2>}</div>{to ? <Link className="text-button" to={to}>{action}<ChevronRight size={15}/></Link> : <button>{action}<ChevronRight size={15}/></button>}</div> }

function FilmCard({ film, wide = false }) { const { toggleBookmark, isBookmarked } = useBookmarks(); const liked = isBookmarked({ ...film, type: 'film' }); return <article className={`film-card ${wide ? 'wide' : ''}`}><div className="film-image"><img src={film.image} alt=""/><span className="film-accent">{film.accent}</span><button className="play-button"><Play size={15} fill="currentColor"/></button><button className={`heart-button ${liked ? 'liked' : ''}`} aria-label={liked ? `Unlike ${film.title}` : `Like ${film.title}`} aria-pressed={liked} onClick={() => toggleBookmark({ ...film, type: 'film' })}><Heart size={17} fill={liked ? 'currentColor' : 'none'}/></button></div><div className="film-meta"><div><h3>{film.title}</h3><p>{film.creator}</p></div><small>{film.genre}</small></div></article> }

function ScriptReader({ script, onClose }) {
  const [documentUrl, setDocumentUrl] = useState(script.documentUrl || '')
  useEffect(() => { if (!documentUrl && script.documentKey) readScriptDocument(script.documentKey).then(setDocumentUrl).catch(() => {}) }, [documentUrl, script.documentKey])
  useEffect(() => {
    const closeOnEscape = event => { if (event.key === 'Escape') onClose() }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [onClose])
  return <div className="script-viewer-backdrop" role="dialog" aria-modal="true" aria-label={`${script.title} reader`}><section className="script-viewer"><header className="script-viewer-header"><div><span className="eyebrow warm">READING NOW</span><h1>{script.title}</h1><p>{script.creator} · {script.type}</p></div><button className="script-viewer-close" onClick={onClose} aria-label="Close script reader">×</button></header><div className="script-viewer-page">{documentUrl ? <iframe className="script-document-frame" src={documentUrl} title={`${script.title} PDF`} /> : <article className="script-document"><h2>{script.title}</h2><p>By {script.creator}</p><p className="script-document-text">Loading uploaded document...</p></article>}</div></section></div>
}

function ScriptCard({ script }) { const { toggleBookmark, isBookmarked } = useBookmarks(); const [readerOpen, setReaderOpen] = useState(false); const saved = isBookmarked({ ...script, type: 'script' }); const openReader = () => setReaderOpen(true); return <><article className="script-card" onClick={openReader} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openReader() } }} role="button" tabIndex="0" aria-label={`Read ${script.title}`}><img src={script.image} alt=""/><div><span className="eyebrow">PUBLISHED SCRIPT</span><h3>{script.title}</h3><p>{script.creator}</p><small>{script.type}</small></div><button className={`script-bookmark-button ${saved ? 'saved' : ''}`} aria-label={saved ? `Remove ${script.title} from bookmarks` : `Save ${script.title} to bookmarks`} aria-pressed={saved} onClick={event => { event.stopPropagation(); toggleBookmark({ ...script, type: 'script' }) }}><Bookmark size={16} fill={saved ? 'currentColor' : 'none'}/></button></article>{readerOpen && <ScriptReader script={script} onClose={() => setReaderOpen(false)} />}</> }

function EquipmentCard({ item }) { const listing = marketplaceListings().find(candidate => candidate.title === item.title); return <Link className="equipment-card" to={`/marketplace/${listing.id}`}><div><img src={item.image} alt={item.title}/><span className="equipment-tag">AVAILABLE</span></div><div className="equipment-meta"><h3>{item.title}</h3><p>{item.seller}</p><small>{item.detail}</small><strong>{item.price}</strong></div></Link> }

function marketplaceListings() {
  const featured = equipment.map((item, index) => {
    const [category, condition] = item.detail.split(' · ')
    const isRental = item.price.includes('/ day')
    return { ...item, id: `featured-${index}`, category, condition, salePrice: isRental ? '' : item.price, rentalPrice: isRental ? item.price.replace(' / day', '') : '', location: 'A-MAX community', description: `${item.title} available from ${item.seller}. Contact the seller to confirm availability and collection details.` }
  })
  let posted = []
  try { posted = JSON.parse(localStorage.getItem('a-max-published-equipment') || '[]') } catch { posted = [] }
  return [...posted.map((item, index) => ({ ...item, id: item.id || `posted-${index}`, category: item.category || item.detail?.split(' · ')[0] || 'Equipment', condition: item.condition || item.detail?.split(' · ')[1] || 'Used', salePrice: item.salePrice || (item.price && !item.price.includes('/ day') ? item.price : ''), rentalPrice: item.rentalPrice || (item.price?.includes('/ day') ? item.price.replace(' / day', '') : ''), location: item.location || 'A-MAX community', description: item.description || 'A community marketplace listing. Contact the seller for more details.' })), ...featured]
}

function listingPrice(item) {
  return item.rentalPrice ? `$${item.rentalPrice} / day` : item.salePrice || 'Price on request'
}

function MarketplacePage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const listings = marketplaceListings().filter(item => {
    const matchesSearch = `${item.title} ${item.seller} ${item.category} ${item.location}`.toLowerCase().includes(search.trim().toLowerCase())
    const matchesFilter = filter === 'all' || (filter === 'rent' ? Boolean(item.rentalPrice) : Boolean(item.salePrice))
    return matchesSearch && matchesFilter
  })
  return <div className="marketplace-page"><div className="marketplace-heading"><h1 className="marketplace-wordmark"><span className="logo-a">M</span><span className="logo-max">ARKETPLACE</span></h1><label className="marketplace-search"><Search size={16}/><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search cameras, lenses, lighting..." aria-label="Search marketplace"/></label></div><div className="marketplace-toolbar"><div className="filter-row"><button className={filter === 'all' ? 'filter-active' : ''} onClick={() => setFilter('all')}>All items</button><button className={filter === 'sale' ? 'filter-active' : ''} onClick={() => setFilter('sale')}>For sale</button><button className={filter === 'rent' ? 'filter-active' : ''} onClick={() => setFilter('rent')}>For rent</button></div><small>{listings.length} listings</small></div>{listings.length ? <div className="equipment-table-wrap"><table className="equipment-table"><thead><tr><th>Item</th><th>Details</th><th>Seller</th><th>Price</th><th>Location</th></tr></thead><tbody>{listings.map(item => <tr key={item.id}><td><Link to={`/marketplace/${item.id}`}><img src={item.image} alt={`${item.title} listing`}/></Link></td><td><Link to={`/marketplace/${item.id}`}><strong>{item.title}</strong><small>{item.category} · {item.condition}</small><p>{item.description}</p></Link></td><td><strong>{item.seller}</strong></td><td><b>{listingPrice(item)}</b>{item.salePrice && item.rentalPrice && <small>Sale: ${item.salePrice}</small>}</td><td><small>{item.location}</small></td></tr>)}</tbody></table></div> : <div className="marketplace-empty">No marketplace listings match your search.</div>}</div>
}

function EquipmentDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const item = marketplaceListings().find(listing => listing.id === id)
  if (!item) return <div className="placeholder"><span className="eyebrow">THE EXCHANGE</span><h1>Listing not found</h1><button className="primary-button" onClick={() => navigate('/marketplace')}>Back to marketplace</button></div>
    return <div className="equipment-detail-page"><button className="upload-back" onClick={() => navigate('/marketplace')}><ArrowLeft size={17}/> Back to marketplace</button><div className="equipment-detail-layout"><div className="equipment-detail-image"><img src={item.image} alt={item.title}/><span className="equipment-tag">{item.rentalPrice ? 'AVAILABLE TO RENT' : 'FOR SALE'}</span></div><div className="equipment-detail-copy"><span className="eyebrow warm">{item.category}</span><h1>{item.title}</h1><p className="equipment-detail-seller">Listed by <strong>{item.seller}</strong></p><div className="equipment-detail-facts"><span><small>Condition</small>{item.condition}</span><span><small>Location</small>{item.location}</span></div><p className="equipment-detail-description">{item.description}</p><div className="equipment-detail-purchase"><strong>{listingPrice(item)}</strong><button className="primary-button" onClick={() => window.alert(`Message ${item.seller} about ${item.title}`)}>Message seller <ChevronRight size={15}/></button></div></div></div></div>
}

function HorizontalRail({ children, className = '', controls = false }) {
  const railRef = useRef(null)
  const scrollRail = direction => railRef.current?.scrollBy({ left: direction * railRef.current.clientWidth * 0.82, behavior: 'smooth' })
  return <div className={`rail-shell ${controls ? 'has-controls' : ''}`}><div ref={railRef} className={`horizontal-rail ${className}`}>{children}</div>{controls && <><div className="rail-zone rail-zone-left"><button className="rail-arrow rail-prev" onClick={() => scrollRail(-1)} aria-label="Show previous items"><ArrowLeft size={20}/></button></div><div className="rail-zone rail-zone-right"><button className="rail-arrow rail-next" onClick={() => scrollRail(1)} aria-label="Show more items"><ArrowRight size={20}/></button></div></>}</div>
}

function Home() {
  const [activeTrailer, setActiveTrailer] = useState(0)
  const [homeFilms, setHomeFilms] = useState(() => {
    try { return [...JSON.parse(localStorage.getItem('a-max-published-films') || '[]'), ...films] }
    catch { return films }
  })
  const [homeScripts] = useState(() => {
    try { return [...JSON.parse(localStorage.getItem('a-max-published-scripts') || '[]'), ...scripts] }
    catch { return scripts }
  })
  const trailerRef = useRef(null)
  const trailer = featuredTrailers[activeTrailer]

  useEffect(() => {
    const timer = window.setInterval(() => setActiveTrailer(current => (current + 1) % featuredTrailers.length), 9000)
    return () => window.clearInterval(timer)
  }, [])

  const previousTrailer = () => setActiveTrailer(current => (current - 1 + featuredTrailers.length) % featuredTrailers.length)
  const nextTrailer = () => setActiveTrailer(current => (current + 1) % featuredTrailers.length)
  const startTrailer = () => trailerRef.current?.play()

  return <>
  <section className="hero odyssey-hero" style={{ '--hero-poster': `url(${trailer.poster})` }}><video ref={trailerRef} key={trailer.video} className="hero-trailer" autoPlay muted loop playsInline poster={trailer.poster}><source src={trailer.video} type="video/mp4" /></video><button className="hero-click-zone hero-click-left" onClick={previousTrailer} aria-label="Previous trailer" /><div className="hero-click-zone hero-click-center" onClick={startTrailer} role="button" tabIndex="0" aria-label="Play trailer" /><button className="hero-click-zone hero-click-right" onClick={nextTrailer} aria-label="Next trailer" /><div className="hero-copy"><span className="eyebrow warm">FEATURED TRAILER</span><h1>{trailer.title}</h1><div className="odyssey-rating"><span>IMDb</span><strong>{trailer.rating}</strong><small>/ 10</small></div></div><div className="trailer-bubbles" aria-label="Featured trailers">{featuredTrailers.map((item, index) => <button key={item.title} className={index === activeTrailer ? 'active' : ''} onClick={() => setActiveTrailer(index)} aria-label={`Show ${item.title}`} />)}</div></section>
  <section className="home-section"><SectionTitle eyebrow="Latest short films" title="" to="/explore?section=short-films"/><HorizontalRail className="film-rail" controls>{homeFilms.map((film, index) => <FilmCard key={`${film.title}-${index}`} film={film}/>)}</HorizontalRail></section>
  <section className="home-section"><SectionTitle eyebrow="Published scripts" title="" action="Read more" to="/explore?section=scripts"/><HorizontalRail className="script-rail" controls>{homeScripts.map((script, index) => <ScriptCard key={`${script.title}-${index}`} script={script}/>)}</HorizontalRail></section>
  <section className="home-section creator-section"><SectionTitle eyebrow="Filmmaker profiles" title="" action="Discover people" to="/explore?section=profiles"/><HorizontalRail className="creator-rail" controls>{creators.map(creator => <Link className="creator-card creator-card-link" to={`/profile/${creator.name.toLowerCase().replace(/\s+/g, '-')}`} key={creator.name}><img src={creator.image} alt=""/><div><h3>{creator.name}</h3><p>{creator.role}</p><small>{creator.followers} followers</small></div><button onClick={event => event.preventDefault()}>Follow</button></Link>)}</HorizontalRail></section>
  <section className="home-section"><SectionTitle eyebrow="Film equipment" title="" action="Browse marketplace" to="/marketplace"/><HorizontalRail className="equipment-rail" controls>{equipment.map(item => <EquipmentCard key={item.title} item={item}/>)}</HorizontalRail></section>
  <section><SectionTitle eyebrow="The community cut" title="" to="/communities"/><div className="community-conversation-grid"><div className="community-banner"><div><span className="eyebrow warm">OPEN DISCUSSION · 2.4K MEMBERS</span><h2>What makes a scene<br/><em>unforgettable?</em></h2><p>Directors, editors, and actors are sharing the moments that changed how they work.</p><Link to="/communities" className="outline-button">Join the conversation <ChevronRight size={15}/></Link></div><div className="film-strip">{films.map(film => <img key={film.title} src={film.image} alt=""/>)}</div></div><div className="community-conversation-list">{communityConversations.map(conversation => <Link to="/communities" className="community-conversation" key={conversation.title}><span className="eyebrow warm">{conversation.community}</span><small>{conversation.members}</small><h3>{conversation.title}</h3><p>{conversation.detail}</p><ChevronRight size={17}/></Link>)}</div></div></section>
</> }

function Explore() {
  const [params, setParams] = useSearchParams()
  const search = params.get('search')?.trim().toLowerCase() || ''
  const section = params.get('section') || ''
  const category = section || 'for-you'
  const localFilms = (() => { try { return JSON.parse(localStorage.getItem('a-max-published-films') || '[]') } catch { return [] } })()
  const localScripts = (() => { try { return JSON.parse(localStorage.getItem('a-max-published-scripts') || '[]') } catch { return [] } })()
  const result = search ? [...films, ...localFilms, ...scripts, ...localScripts].find(item => `${item.title} ${item.creator}`.toLowerCase().includes(search)) : null
  const isScript = result && 'type' in result && !('genre' in result)
  const heading = category === 'short-films' ? 'Short films' : category === 'scripts' ? 'Scripts & stories' : category === 'documentary' ? 'Documentary' : category === 'trending' ? 'Trending' : category === 'profiles' ? 'Filmmaker profiles' : 'Explore'
  const exploreFilms = [...films, ...localFilms]
  const exploreScripts = [...scripts, ...localScripts]
  const displayedFilms = category === 'trending' ? exploreFilms.filter(film => film.accent === 'Trending') : category === 'documentary' ? exploreFilms.filter(film => film.genre.toLowerCase().includes('documentary')) : exploreFilms
  const chooseCategory = nextCategory => { const nextParams = new URLSearchParams(params); nextParams.delete('search'); nextParams.set('section', nextCategory); setParams(nextParams) }
  return <><div className="page-heading explore-heading"><span className="eyebrow">THE WORLD OF CINEMA</span><h1>{heading}</h1></div>{result && <article className="explore-feature"><img src={result.image} alt=""/><div><span className="eyebrow warm">{isScript ? 'SCRIPT / STORY' : 'FEATURED FILM'}</span><h2>{result.title}</h2><div className="feature-facts"><span><b>{isScript ? 'Writer' : 'Director'}</b>{result.creator}</span><span><b>{isScript ? 'Format' : 'Genre'}</b>{isScript ? result.type : result.genre}</span><span><b>IMDb</b>{isScript ? '—' : '8.7 / 10'}</span></div><p>{isScript ? 'A published story from the A-MAX creative library, ready to be discovered.' : 'An independent film selected from the A-MAX showcase.'}</p><button className="primary-button"><Play size={15} fill="currentColor"/> {isScript ? 'Read script' : 'Watch trailer'}</button></div></article>}<div className="filter-row"><button className={category === 'for-you' ? 'filter-active' : ''} onClick={() => chooseCategory('for-you')}>For you</button><button className={category === 'trending' ? 'filter-active' : ''} onClick={() => chooseCategory('trending')}>Trending</button><button className={category === 'short-films' ? 'filter-active' : ''} onClick={() => chooseCategory('short-films')}>Short films</button><button className={category === 'scripts' ? 'filter-active' : ''} onClick={() => chooseCategory('scripts')}>Scripts & stories</button><button className={category === 'documentary' ? 'filter-active' : ''} onClick={() => chooseCategory('documentary')}>Documentary</button></div>{category === 'scripts' ? <div className="explore-grid">{exploreScripts.map((script, index) => <ScriptCard key={`${script.title}-${index}`} script={script}/>)}</div> : category === 'profiles' ? <div className="creator-grid">{creators.map(creator => <Link className="creator-card creator-card-link" to={`/profile/${creator.name.toLowerCase().replace(/\s+/g, '-')}`} key={creator.name}><img src={creator.image} alt=""/><div><h3>{creator.name}</h3><p>{creator.role}</p><small>{creator.followers} followers</small></div></Link>)}</div> : <div className="explore-grid">{displayedFilms.map((film, index) => <FilmCard key={`${film.title}-${index}`} film={film} wide={index % 3 === 0}/>)}</div>}</>
}

function Profile() {
  const { username } = useParams()
  const creator = creators.find(item => item.name.toLowerCase().replace(/\s+/g, '-') === username) || { name: 'Arjun Mehta', role: 'Director · Writer · Editor', image: 'https://i.pravatar.cc/160?img=57', followers: '4.8k' }
  const isOwnProfile = !username || username === 'arjun-mehta'
  const savedProfile = (() => { try { return JSON.parse(localStorage.getItem('a-max-profile') || 'null') } catch { return null } })()
  const [profile, setProfile] = useState(() => savedProfile || creator)
  const [activeTab, setActiveTab] = useState('about')
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(() => savedProfile || creator)
  const editField = field => event => setDraft(current => ({ ...current, [field]: event.target.value }))
  const chooseProfileImage = event => { const image = event.target.files?.[0]; if (!image) return; const reader = new FileReader(); reader.onload = result => setDraft(current => ({ ...current, image: result.target.result })); reader.readAsDataURL(image) }
  const saveProfile = event => {
    event.preventDefault()
    const nextProfile = { ...profile, ...draft }
    setProfile(nextProfile)
    setDraft(nextProfile)
    localStorage.setItem('a-max-profile', JSON.stringify(nextProfile))
    window.dispatchEvent(new CustomEvent('a-max-profile-updated', { detail: nextProfile }))
    setEditing(false)
  }
  return <><div className="profile-hero"><img className="cover-image" src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1500&q=80" alt=""/><div className="profile-info"><img className="avatar" src={profile.image} alt=""/><div><span className="eyebrow warm">{profile.role}</span><h1>{profile.name}</h1><p>{profile.bio || 'Stories about the quiet, strange, and beautiful parts of being human.'}</p><span className="location">{profile.location || 'Mumbai, India'} · {profile.followers} followers</span></div>{isOwnProfile && <button className="outline-button" onClick={() => { setDraft(profile); setEditing(true) }}>Edit profile</button>}</div></div><div className="profile-tabs"><b>About</b><span>Portfolio <small>08</small></span><span>Films <small>12</small></span><span>Activity</span></div><div className="profile-body"><section><SectionTitle eyebrow="Selected work" title="A body of work in progress"/><div className="film-grid">{films.slice(1).map(film => <FilmCard key={film.title} film={film}/>)}</div></section><aside className="about-panel"><span className="eyebrow">About {profile.name}</span><p>{profile.bio || 'Filmmaker exploring the space between what we say and what we mean. Currently developing a debut feature.'}</p><div className="skill-list"><span>Direction</span><span>Screenwriting</span><span>Editing</span><span>Visual storytelling</span></div></aside></div>{editing && <div className="profile-editor-backdrop"><form className="profile-editor" onSubmit={saveProfile}><div className="editor-header"><div><span className="eyebrow warm">YOUR PROFILE</span><h2>Edit profile</h2></div><button type="button" onClick={() => setEditing(false)}>×</button></div><div className="editor-avatar"><img src={draft.image} alt="Profile preview"/><input id="profile-picture" className="hidden-file-input" type="file" accept="image/jpeg,image/png,.jpg,.jpeg,.png" onChange={chooseProfileImage}/><label htmlFor="profile-picture" className="outline-button">Change profile picture</label></div><label>Name<input required value={draft.name} onChange={editField('name')} /></label><label>Film profession<input required value={draft.role} onChange={editField('role')} placeholder="Director · Writer · DOP" /></label><label>About<textarea value={draft.bio || ''} onChange={editField('bio')} placeholder="Tell people what you make." /></label><label>Location<input value={draft.location || ''} onChange={editField('location')} placeholder="City, country" /></label><div className="editor-actions"><button type="button" className="upload-back" onClick={() => setEditing(false)}>Cancel</button><button className="publish-button" type="submit">Save profile <ArrowRight size={16}/></button></div></form></div>}</> }

function LegacyProfileView() {
  const { username } = useParams()
  const creator = creators.find(item => item.name.toLowerCase().replace(/\s+/g, '-') === username) || { name: 'Arjun Mehta', role: 'Director · Writer · Editor', image: 'https://i.pravatar.cc/160?img=57', followers: '4.8k' }
  const savedProfile = (() => { try { return JSON.parse(localStorage.getItem('a-max-profile') || 'null') } catch { return null } })()
  const profile = !username || username === 'arjun-mehta' ? savedProfile || creator : creator
  const isOwnProfile = !username || username === 'arjun-mehta'
  const [activeTab, setActiveTab] = useState('about')
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(profile)
  const editField = field => event => setDraft(current => ({ ...current, [field]: event.target.value }))
  const saveProfile = event => {
    event.preventDefault()
    localStorage.setItem('a-max-profile', JSON.stringify(draft))
    window.dispatchEvent(new CustomEvent('a-max-profile-updated', { detail: draft }))
    setEditing(false)
  }
  const localFilms = (() => { try { return JSON.parse(localStorage.getItem('a-max-published-films') || '[]') } catch { return [] } })()
  const profileFilms = [...localFilms, ...films]
  const profileActivity = [{ type: 'NEW WORK', text: 'Published a new film to the A-MAX showcase.', time: '2 days ago' }, { type: 'COLLABORATION', text: 'Joined the Independent Filmmakers community.', time: '1 week ago' }, { type: 'CURATION', text: 'Bookmarked Field Notes by Sofia Reyes.', time: '2 weeks ago' }]
  const tabContent = activeTab === 'portfolio' ? <><div className="profile-tab-heading"><span className="eyebrow">PORTFOLIO</span><h2>A visual language in progress</h2></div><div className="portfolio-photo-grid">{profileFilms.slice(0, 4).map(film => <img key={film.title} src={film.image} alt={film.title}/>)}</div><div className="portfolio-links"><a href="https://www.imdb.com" target="_blank" rel="noreferrer"><strong>IMDb profile</strong><span>imdb.com</span><b>↗</b></a><a href="https://www.instagram.com" target="_blank" rel="noreferrer"><strong>Behind the scenes</strong><span>instagram.com</span><b>↗</b></a></div></> : activeTab === 'films' ? <><div className="profile-tab-heading"><span className="eyebrow">FILMS</span><h2>Selected screen work</h2></div><div className="profile-film-list">{profileFilms.slice(0, 4).map(film => <article key={film.title}><img src={film.image} alt=""/><div><strong>{film.title}</strong><span>{film.creator} · {film.genre}</span><small>Available in the A-MAX showcase</small></div><b className="profile-recommend-mark">FEATURED</b></article>)}</div></> : activeTab === 'activity' ? <><div className="profile-tab-heading"><span className="eyebrow">ACTIVITY</span><h2>Recent movements</h2></div><div className="profile-activity-list">{profileActivity.map(item => <article key={item.text}><span>{item.type}</span><p>{item.text}</p><small>{item.time}</small></article>)}</div></> : <><section><SectionTitle eyebrow="Selected work" title="A body of work in progress"/><div className="film-grid">{films.slice(1).map(film => <FilmCard key={film.title} film={film}/>)}</div></section><aside className="about-panel"><span className="eyebrow">About {profile.name}</span><p>{profile.bio || 'Filmmaker exploring the space between what we say and what we mean. Currently developing a debut feature.'}</p><div className="skill-list"><span>Direction</span><span>Screenwriting</span><span>Editing</span><span>Visual storytelling</span></div></aside></>
  return <><div className="profile-hero"><img className="cover-image" src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1500&q=80" alt=""/><div className="profile-info"><img className="avatar" src={profile.image} alt=""/><div><span className="eyebrow warm">{profile.role}</span><h1>{profile.name}</h1><p>{profile.bio || 'Stories about the quiet, strange, and beautiful parts of being human.'}</p><span className="location">{profile.location || 'Mumbai, India'} · {profile.followers} followers</span></div>{isOwnProfile && <button className="outline-button" onClick={() => { setDraft(profile); setEditing(true) }}>Edit profile</button>}</div></div><div className="profile-tabs" role="tablist" aria-label="Profile sections"><button className={activeTab === 'about' ? 'active' : ''} role="tab" aria-selected={activeTab === 'about'} onClick={() => setActiveTab('about')}>About</button><button className={activeTab === 'portfolio' ? 'active' : ''} role="tab" aria-selected={activeTab === 'portfolio'} onClick={() => setActiveTab('portfolio')}>Portfolio <small>08</small></button><button className={activeTab === 'films' ? 'active' : ''} role="tab" aria-selected={activeTab === 'films'} onClick={() => setActiveTab('films')}>Films <small>12</small></button><button className={activeTab === 'activity' ? 'active' : ''} role="tab" aria-selected={activeTab === 'activity'} onClick={() => setActiveTab('activity')}>Activity</button></div><div className={`profile-body ${activeTab !== 'about' ? 'profile-tab-panel' : ''}`}>{tabContent}</div>{editing && <div className="profile-editor-backdrop"><form className="profile-editor" onSubmit={saveProfile}><div className="editor-header"><div><span className="eyebrow warm">YOUR PROFILE</span><h2>Edit profile</h2></div><button type="button" onClick={() => setEditing(false)}>×</button></div><label>Name<input value={draft.name || ''} onChange={editField('name')} /></label><label>Role<input value={draft.role || ''} onChange={editField('role')} /></label><label>Location<input value={draft.location || ''} onChange={editField('location')} /></label><label>Bio<textarea value={draft.bio || ''} onChange={editField('bio')} /></label><button className="primary-button" type="submit">Save changes</button></form></div>}</>
}

function ProfileView() {
  const { username } = useParams()
  const creator = creators.find(item => item.name.toLowerCase().replace(/\s+/g, '-') === username) || { name: 'Arjun Mehta', role: 'Director · Writer · Editor', image: 'https://i.pravatar.cc/160?img=57', followers: '4.8k' }
  const isOwnProfile = !username || username === 'arjun-mehta'
  const savedProfile = (() => { try { return JSON.parse(localStorage.getItem('a-max-profile') || 'null') } catch { return null } })()
  const [profile, setProfile] = useState(() => isOwnProfile ? savedProfile || creator : creator)
  const [draft, setDraft] = useState(() => isOwnProfile ? savedProfile || creator : creator)
  const [activeTab, setActiveTab] = useState('about')
  const [editing, setEditing] = useState(false)
  const editField = field => event => setDraft(current => ({ ...current, [field]: event.target.value }))
  const chooseProfileImage = event => {
    const image = event.target.files?.[0]
    if (!image) return
    const reader = new FileReader()
    reader.onload = result => setDraft(current => ({ ...current, image: result.target.result }))
    reader.readAsDataURL(image)
  }
  const saveProfile = event => {
    event.preventDefault()
    setProfile(draft)
    localStorage.setItem('a-max-profile', JSON.stringify(draft))
    window.dispatchEvent(new CustomEvent('a-max-profile-updated', { detail: draft }))
    setEditing(false)
  }
  const localFilms = (() => { try { return JSON.parse(localStorage.getItem('a-max-published-films') || '[]') } catch { return [] } })()
  const profileFilms = [...localFilms, ...films]
  const activities = [{ type: 'NEW WORK', text: 'Published a new film to the A-MAX showcase.', time: '2 days ago' }, { type: 'COLLABORATION', text: 'Joined the Independent Filmmakers community.', time: '1 week ago' }, { type: 'CURATION', text: 'Bookmarked Field Notes by Sofia Reyes.', time: '2 weeks ago' }]
  const content = activeTab === 'portfolio' ? <><div className="profile-tab-heading"><span className="eyebrow">PORTFOLIO</span><h2>A visual language in progress</h2></div><div className="portfolio-photo-grid">{profileFilms.slice(0, 4).map(film => <img key={film.title} src={film.image} alt={film.title}/>)}</div><div className="portfolio-links"><a href="https://www.imdb.com" target="_blank" rel="noreferrer"><strong>IMDb profile</strong><span>imdb.com</span><b>↗</b></a><a href="https://www.instagram.com" target="_blank" rel="noreferrer"><strong>Behind the scenes</strong><span>instagram.com</span><b>↗</b></a></div></> : activeTab === 'films' ? <><div className="profile-tab-heading"><span className="eyebrow">FILMS</span><h2>Selected screen work</h2></div><div className="profile-film-list">{profileFilms.slice(0, 4).map(film => <article key={film.title}><img src={film.image} alt=""/><div><strong>{film.title}</strong><span>{film.creator} · {film.genre}</span><small>Available in the A-MAX showcase</small></div><b className="profile-recommend-mark">FEATURED</b></article>)}</div></> : activeTab === 'activity' ? <><div className="profile-tab-heading"><span className="eyebrow">ACTIVITY</span><h2>Recent movements</h2></div><div className="profile-activity-list">{activities.map(item => <article key={item.text}><span>{item.type}</span><p>{item.text}</p><small>{item.time}</small></article>)}</div></> : <><section><SectionTitle eyebrow="Selected work" title="A body of work in progress"/><div className="film-grid">{films.slice(1).map(film => <FilmCard key={film.title} film={film}/>)}</div></section><aside className="about-panel"><span className="eyebrow">About {profile.name}</span><p>{profile.bio || 'Filmmaker exploring the space between what we say and what we mean. Currently developing a debut feature.'}</p><div className="skill-list"><span>Direction</span><span>Screenwriting</span><span>Editing</span><span>Visual storytelling</span></div></aside></>
  return <><div className="profile-hero"><img className="cover-image" src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1500&q=80" alt=""/><div className="profile-info"><img className="avatar" src={profile.image} alt=""/><div><span className="eyebrow warm">{profile.role}</span><h1>{profile.name}</h1><p>{profile.bio || 'Stories about the quiet, strange, and beautiful parts of being human.'}</p><span className="location">{profile.location || 'Mumbai, India'} · {profile.followers} followers</span></div>{isOwnProfile && <button className="outline-button" onClick={() => { setDraft(profile); setEditing(true) }}>Edit profile</button>}</div></div><div className="profile-tabs" role="tablist" aria-label="Profile sections">{[['about', 'About'], ['portfolio', 'Portfolio 08'], ['films', 'Films 12'], ['activity', 'Activity']].map(([tab, label]) => <button key={tab} className={activeTab === tab ? 'active' : ''} role="tab" aria-selected={activeTab === tab} onClick={() => setActiveTab(tab)}>{label}</button>)}</div><div className={`profile-body ${activeTab !== 'about' ? 'profile-tab-panel' : ''}`}>{content}</div>{editing && <div className="profile-editor-backdrop"><form className="profile-editor" onSubmit={saveProfile}><div className="editor-header"><div><span className="eyebrow warm">YOUR PROFILE</span><h2>Edit profile</h2></div><button type="button" onClick={() => setEditing(false)}>×</button></div><div className="editor-avatar"><img src={draft.image} alt="Profile preview"/><input id="profile-picture" className="hidden-file-input" type="file" accept="image/jpeg,image/png,.jpg,.jpeg,.png" onChange={chooseProfileImage}/><label htmlFor="profile-picture" className="outline-button">Change photo</label></div><label>Name<input value={draft.name || ''} onChange={editField('name')} /></label><label>Role<input value={draft.role || ''} onChange={editField('role')} /></label><label>Location<input value={draft.location || ''} onChange={editField('location')} /></label><label>Bio<textarea value={draft.bio || ''} onChange={editField('bio')} /></label><button className="primary-button" type="submit">Save changes</button></form></div>}</>
}

function LearnLegacy() { const topics = ['Cinematography', 'Screenwriting', 'Lighting', 'Sound design', 'Film direction', 'Editing']; return <><div className="page-heading compact"><span className="eyebrow">THE WORKSHOP</span><h1>Learn the craft.<br/><em>Shape the story.</em></h1><p>Practical knowledge from working filmmakers, built for the way you create.</p></div><div className="learning-feature"><div><span className="eyebrow warm">CONTINUE LEARNING · 42% COMPLETE</span><h2>The language<br/>of <em>light</em></h2><p>How contrast, color, and shadow tell a story before a character says a word.</p><div className="progress"><i style={{width: '42%'}} /></div><button className="primary-button">Continue lesson <ChevronRight size={15}/></button></div><div className="lesson-still"><span>Lesson 03 / 08</span></div></div><SectionTitle eyebrow="Browse the workshop" title="Build your toolkit"/><div className="topic-grid">{topics.map((topic, i) => <article key={topic}><span>0{i + 1}</span><h3>{topic}</h3><p>{['18 lessons', '12 lessons', '09 lessons', '14 lessons', '21 lessons', '16 lessons'][i]}</p><ChevronRight size={18}/></article>)}</div></> }

function Communities() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [joined, setJoined] = useState(() => { try { return JSON.parse(localStorage.getItem('a-max-joined-communities') || '[]') } catch { return [] } })
  const joinCommunity = community => {
    const next = joined.includes(community.name) ? joined : [...joined, community.name]
    setJoined(next)
    localStorage.setItem('a-max-joined-communities', JSON.stringify(next))
    navigate(`/messages?community=${encodeURIComponent(community.name.toLowerCase().replace(/\s+/g, '-'))}`)
  }
  const communities = ['Independent Filmmakers', 'Screenwriters Room', 'Cinematographers', 'Vintage Camera Collectors'].map((name, index) => ({ name, members: ['12.4k', '8.7k', '5.2k', '3.1k'][index], description: ['A home for the brave, scrappy, and self-funded.', 'Pages, premises, and the messy middle.', 'Light chasers and lens obsessives.', 'Old glass, new stories.'][index] }))
  const filteredCommunities = communities.filter(community => `${community.name} ${community.description}`.toLowerCase().includes(search.trim().toLowerCase()))
  return <><div className="page-heading compact"><span className="eyebrow">THE COMMONS</span><h1>Make room for<br/><em>good company.</em></h1><p>Find your people, trade notes, and build something together.</p><label className="community-search"><Search size={16}/><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search communities..." aria-label="Search communities"/></label></div><div className="community-list">{filteredCommunities.length ? filteredCommunities.map((community, index) => <article key={community.name}><div className={`community-icon icon-${index}`}><Users size={22}/></div><div><h2>{community.name}</h2><p>{community.description}</p><small>{community.members} members</small></div><button className="outline-button" onClick={() => joinCommunity(community)}>{joined.includes(community.name) ? 'Open chat' : 'Join'} <Plus size={14}/></button></article>) : <div className="community-search-empty">No communities match your search.</div>}</div></>
}

function MessagesPage() {
  const ownProfile = (() => { try { return JSON.parse(localStorage.getItem('a-max-profile') || 'null') } catch { return null } })()
  const currentUser = ownProfile || { name: 'Arjun Mehta', role: 'Director · Writer', image: 'https://i.pravatar.cc/160?img=57' }
  const users = [currentUser, ...creators.filter(creator => creator.name !== currentUser.name)]
  const [search, setSearch] = useState('')
  const [params] = useSearchParams()
  const [selectedUser, setSelectedUser] = useState(null)
  const [draft, setDraft] = useState('')
    const [conversations, setConversations] = useState(() => { try { return JSON.parse(localStorage.getItem('a-max-conversations') || JSON.stringify(messageSeed)) } catch { return messageSeed } })
  const joinedCommunities = (() => { try { return JSON.parse(localStorage.getItem('a-max-joined-communities') || '[]') } catch { return [] } })()
  const requestedCommunity = params.get('community') || ''
  const communities = messageCommunities.map(community => ({ ...community, isCommunity: true })).sort((first, second) => {
    const firstPriority = first.name.toLowerCase().replace(/\s+/g, '-') === requestedCommunity || joinedCommunities.includes(first.name) ? 0 : 1
    const secondPriority = second.name.toLowerCase().replace(/\s+/g, '-') === requestedCommunity || joinedCommunities.includes(second.name) ? 0 : 1
    return firstPriority - secondPriority
  })
  const otherUsers = [...users.filter(user => user.name !== currentUser.name), ...communities]
  const allTargets = otherUsers
  const filteredUsers = otherUsers.filter(user => !user.isCommunity && `${user.name} ${user.name.toLowerCase().replace(/\s+/g, '-')}`.toLowerCase().includes(search.trim().toLowerCase()))
  const username = user => user.name.toLowerCase().replace(/\s+/g, '-')
  const targetKey = target => target.isCommunity ? `community:${username(target)}` : username(target)
  const activeUser = allTargets.find(user => user.name === selectedUser) || null
  const activeMessages = activeUser ? conversations[targetKey(activeUser)] || [] : []
  useEffect(() => { if (requestedCommunity) { const community = otherUsers.find(user => user.isCommunity && user.name.toLowerCase().replace(/\s+/g, '-') === requestedCommunity); if (community) setSelectedUser(community.name) } }, [requestedCommunity])
  const chooseUser = user => { setSelectedUser(user.name); setSearch('') }
  const sendMessage = event => {
    event.preventDefault()
    const text = draft.trim()
    if (!text || !activeUser) return
    const key = targetKey(activeUser)
    const next = { ...conversations, [key]: [...(conversations[key] || []), { sender: 'me', text, time: 'now' }] }
    setConversations(next)
    localStorage.setItem('a-max-conversations', JSON.stringify(next))
    setDraft('')
  }
  return <div className="messages-page"><div className="messages-heading"><div><span className="eyebrow warm">YOUR STUDIO LINE</span><h1>Messages</h1><p>Keep the conversation moving.</p></div></div><label className="messages-search"><Search size={16}/><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search by username..." aria-label="Search users by username"/></label>{search && <div className="user-search-results">{filteredUsers.length ? filteredUsers.map(user => <button key={user.name} onClick={() => chooseUser(user)}><img src={user.image} alt=""/><span><strong>{user.name}</strong><small>@{username(user)}</small></span><ChevronRight size={15}/></button>) : <p>No users found.</p>}</div>}<div className="messages-layout"><section className="conversation-stack"><div className="conversation-stack-heading"><span className="eyebrow">Conversations</span><small>{otherUsers.length} chats</small></div><div className="message-list">{otherUsers.map(user => { const messages = conversations[targetKey(user)] || []; const lastMessage = messages[messages.length - 1]; return <button className={`message-thread ${user.isCommunity ? 'community-thread' : ''} ${selectedUser === user.name ? 'selected' : ''}`} key={user.name} onClick={() => chooseUser(user)}><img src={user.image} alt=""/><div className="message-thread-copy"><div className="message-thread-title"><strong>{user.name}</strong><small>{lastMessage?.time || 'Start chat'}</small></div><span>{user.isCommunity ? `${user.members} members` : `@${username(user)}`}</span><p>{lastMessage?.text || user.preview || 'Start a new conversation'}</p></div>{!user.isCommunity && user.name === 'Maya Chen' && <i aria-label="Unread message"/>}</button> })}</div></section>{activeUser && <section className="chat-panel"><header className="chat-panel-header"><div><img src={activeUser.image} alt=""/><span><strong>{activeUser.name}</strong><small>{activeUser.isCommunity ? `${activeUser.members} members · group chat` : `@${username(activeUser)} · active now`}</small></span></div><button aria-label="Close conversation" onClick={() => setSelectedUser(null)}>×</button></header><div className="chat-messages">{activeMessages.map((message, index) => <p className={message.sender === 'me' ? 'chat-sent' : 'chat-received'} key={`${message.time}-${index}`}>{message.text}<small>{message.time}</small></p>)}</div><form className="chat-composer" onSubmit={sendMessage}><input value={draft} onChange={event => setDraft(event.target.value)} placeholder={`Message ${activeUser.isCommunity ? activeUser.name : `@${username(activeUser)}`}`} aria-label={`Message ${activeUser.name}`}/><button className="primary-button" aria-label="Send message"><Send size={15}/></button></form></section>}</div></div>
}

function AuthPage({ mode = 'login' }) {
  const isSignup = mode === 'signup'
  const googleRef = useRef(null)
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '' })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

  useEffect(() => {
    if (!window.google || !import.meta.env.VITE_GOOGLE_CLIENT_ID || !googleRef.current) return
    window.google.accounts.id.initialize({ client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID, callback: handleGoogle })
    window.google.accounts.id.renderButton(googleRef.current, { theme: 'filled_black', size: 'large', width: 340, text: 'continue_with' })
  }, [])

  async function handleGoogle(response) {
    setLoading(true); setMessage('')
    try {
      const result = await fetch(`${apiUrl}/auth/google`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ credential: response.credential }) })
      const data = await result.json()
      if (!result.ok) throw new Error(data.message)
      localStorage.setItem('a-max-token', data.token)
      window.location.href = '/'
    } catch (error) { setMessage(error.message || 'Google sign-in failed.') } finally { setLoading(false) }
  }

  async function submit(event) {
    event.preventDefault(); setLoading(true); setMessage('')
    try {
      const endpoint = isSignup ? 'register' : 'login'
      const result = await fetch(`${apiUrl}/auth/${endpoint}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await result.json()
      if (!result.ok) throw new Error(data.message)
      localStorage.setItem('a-max-token', data.token)
      window.location.href = '/'
    } catch (error) { setMessage(error.message || 'Unable to continue.') } finally { setLoading(false) }
  }

  return <div className="auth-page"><Link className="auth-logo" to="/"><span className="imax-wordmark"><span className="logo-a">A</span><span className="logo-max">MAX</span></span></Link><div className="auth-frame"><div className="auth-art"><span className="eyebrow warm">WELCOME TO A-MAX</span><h1>Your next<br/><em>story starts here.</em></h1><p>A creative home for filmmakers, storytellers, and the people who make us look twice.</p><span className="auth-art-note">CREATE · CONNECT · CREATE AGAIN</span></div><div className="auth-form"><span className="eyebrow">{isSignup ? 'JOIN THE UNIVERSE' : 'WELCOME BACK'}</span><h2>{isSignup ? 'Create your account' : 'Sign in to A-MAX'}</h2><p className="auth-subtitle">{isSignup ? 'Bring your point of view to the room.' : 'Pick up where your story left off.'}</p><div ref={googleRef} className="google-button" />{!import.meta.env.VITE_GOOGLE_CLIENT_ID && <button className="google-fallback" onClick={() => setMessage('Google sign-in needs VITE_GOOGLE_CLIENT_ID configured in the client environment.')}>Continue with Google</button>}<div className="auth-divider"><span>or use email</span></div><form onSubmit={submit}>{isSignup && <><label>Full name<input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your name" /></label><label>Username<input required value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} placeholder="yourname" /></label></>}<label>Email address<input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" /></label><label>Password<input required type="password" minLength="8" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="At least 8 characters" /></label><button className="auth-submit" disabled={loading}>{loading ? 'Please wait...' : isSignup ? 'Create account' : 'Sign in'} <ChevronRight size={16}/></button></form>{message && <p className="auth-message">{message}</p>}<p className="auth-switch">{isSignup ? 'Already have an account?' : 'New to A-MAX?'} <Link to={isSignup ? '/login' : '/signup'}>{isSignup ? 'Sign in' : 'Create an account'}</Link></p></div></div><Link className="auth-back" to="/">← Back to A-MAX</Link></div>
}

function FilmUploadPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  if (params.get('type') === 'equipment') return <EquipmentUploadPage />
  const file = location.state?.file
  const [preview, setPreview] = useState('')
  const [posterFile, setPosterFile] = useState(null)
  const [posterPreview, setPosterPreview] = useState('')
  const [posterDataUrl, setPosterDataUrl] = useState('')
  const [published, setPublishedState] = useState(false)
  const [extraCrew, setExtraCrew] = useState([])
  const [form, setForm] = useState({ title: '', genre: '', logline: '', director: '', actors: '', producer: '', dop: '' })

  useEffect(() => {
    if (!file) return undefined
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  useEffect(() => {
    if (!posterFile) return undefined
    const reader = new FileReader()
    reader.onload = event => { setPosterDataUrl(event.target.result); setPosterPreview(event.target.result) }
    reader.readAsDataURL(posterFile)
  }, [posterFile])

  useEffect(() => {
    const longlineField = document.querySelector('.film-details textarea')
    if (longlineField) longlineField.placeholder = 'One line description of Film'
  }, [])

  const update = field => event => setForm({ ...form, [field]: event.target.value })
  const addCrewRole = () => setExtraCrew([...extraCrew, { role: '', name: '' }])
  const updateCrewRole = (index, field) => event => setExtraCrew(extraCrew.map((member, memberIndex) => memberIndex === index ? { ...member, [field]: event.target.value } : member))
  const hasRequiredCrew = form.director.trim() && form.actors.trim() && form.producer.trim() && form.dop.trim() && extraCrew.every(member => member.role.trim() && member.name.trim())
  const canPublish = Boolean(posterFile && posterDataUrl && form.title.trim() && form.genre.trim() && form.logline.trim() && hasRequiredCrew)
  const publishFilm = () => {
    if (!canPublish) {
      window.alert('Please complete the poster, film details, and every crew member before publishing.')
      return
    }
    const publishedFilm = { title: form.title.trim(), creator: 'Arjun Mehta', genre: `${form.genre.trim()} · Film`, image: posterDataUrl, accent: 'Just published' }
    const existing = JSON.parse(localStorage.getItem('a-max-published-films') || '[]')
    localStorage.setItem('a-max-published-films', JSON.stringify([publishedFilm, ...existing]))
    setPublishedState(true)
    navigate('/')
  }
  const setPublished = value => { if (value) publishFilm() }

  useEffect(() => {
    document.querySelectorAll('.film-upload-page .publish-button').forEach(button => {
      button.disabled = !canPublish
      button.setAttribute('aria-disabled', String(!canPublish))
    })
  }, [canPublish])
  if (!file) return <div className="upload-empty"><span className="eyebrow">NEW FILM</span><h1>Choose an MP4<br/><em>to begin.</em></h1><button className="primary-button" onClick={() => navigate('/')}>Back to home</button></div>

  return <div className="film-upload-page"><div className="upload-toolbar"><button className="upload-back" onClick={() => navigate('/')}><ArrowLeft size={17}/> Back</button><button className="publish-button" onClick={() => setPublished(true)}>{published ? 'Published' : 'Publish film'} <ArrowRight size={16}/></button></div><div className="film-preview"><video controls src={preview} /><div className="preview-caption"><Film size={15}/><span>Film preview</span><small>{file.name} · {(file.size / (1024 * 1024)).toFixed(1)} MB</small></div></div><div className="poster-upload"><div className="poster-copy"><input id="poster-file" className="hidden-file-input" type="file" accept="image/jpeg,image/png,.jpg,.jpeg,.png" onChange={event => setPosterFile(event.target.files?.[0] || null)} /><label className="poster-picker" htmlFor="poster-file"><Upload size={17}/>{posterFile ? 'Change poster' : 'Upload poster'}<small>JPG / PNG</small></label></div>{posterPreview && <img className="poster-preview" src={posterPreview} alt="Film poster preview" />}</div><form className="film-details" onSubmit={event => { event.preventDefault(); setPublished(true) }}><label>Title<input required value={form.title} onChange={update('title')} placeholder="Film title" /></label><label>Genre<input required value={form.genre} onChange={update('genre')} placeholder="Drama, documentary, experimental..." /></label><label>Logline<textarea required value={form.logline} onChange={update('logline')} placeholder="One or two lines that make someone want to watch." /></label><div className="crew-heading"><span>Crew</span><small>Add the people who made it happen</small></div><div className="crew-grid"><label>Director<input value={form.director} onChange={update('director')} placeholder="Name" /></label><label>Actor<input value={form.actors} onChange={update('actors')} placeholder="Name(s)" /></label><label>Producer<input value={form.producer} onChange={update('producer')} placeholder="Name" /></label><label>DOP<input value={form.dop} onChange={update('dop')} placeholder="Name" /></label>{extraCrew.map((member, index) => <div className="custom-crew" key={index}><label>Profession<input value={member.role} onChange={updateCrewRole(index, 'role')} placeholder="Profession" /></label><label>Name<input value={member.name} onChange={updateCrewRole(index, 'name')} placeholder="Name" /></label></div>)}<button className="add-crew-button" type="button" onClick={addCrewRole} aria-label="Add crew profession"><Plus size={20}/><span>Add crew</span></button></div><button className="publish-button form-publish" type="submit">{published ? 'Published' : 'Publish film'} <ArrowRight size={16}/></button></form></div>
}

function ScriptUploadPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const file = location.state?.file
  const [published, setPublished] = useState(false)
  const [coverPreview, setCoverPreview] = useState('')
  const [form, setForm] = useState({ writer: '', title: '', genre: '', logline: '' })
  const displayTitle = file?.name.replace(/\.[^/.]+$/, '').split(' -- ')[0] || ''
  const update = field => event => setForm({ ...form, [field]: event.target.value })
  const chooseCover = event => {
    const image = event.target.files?.[0]
    if (!image) return
    const reader = new FileReader()
    reader.onload = result => setCoverPreview(result.target.result)
    reader.readAsDataURL(image)
  }
  const canPublish = Boolean(file && form.writer.trim() && form.title.trim() && form.genre.trim() && form.logline.trim())
  const publishScript = event => {
    event?.preventDefault()
    if (!canPublish) return
    const saveScript = async documentUrl => {
      const publishedScript = { title: form.title.trim(), creator: form.writer.trim(), type: 'Script / Story', image: coverPreview || 'https://images.unsplash.com/photo-1455390582262-044c7d9a9c2b?auto=format&fit=crop&w=700&q=80', documentUrl, accent: 'Just published' }
      let existing = []
      try { existing = JSON.parse(localStorage.getItem('a-max-published-scripts') || '[]') } catch { existing = [] }
      try {
        localStorage.setItem('a-max-published-scripts', JSON.stringify([publishedScript, ...existing]))
      } catch {
        const documentKey = `script-${Date.now()}`
        await storeScriptDocument(documentKey, documentUrl)
        const lightweightScript = { ...publishedScript, documentUrl: '', documentKey }
        localStorage.setItem('a-max-published-scripts', JSON.stringify([lightweightScript, ...existing]))
      }
      setPublished(true)
      navigate('/')
    }
    if (!file) return
    const reader = new FileReader()
    reader.onload = result => saveScript(result.target.result)
    reader.readAsDataURL(file)
  }
  if (!file) return <div className="upload-empty"><span className="eyebrow">NEW SCRIPT / STORY</span><h1>Choose a document<br/><em>to begin.</em></h1><button className="primary-button" onClick={() => navigate('/')}>Back to home</button></div>

  return <div className="script-upload-page"><div className="upload-toolbar"><button className="upload-back" onClick={() => navigate('/')}><ArrowLeft size={17}/> Back</button><button className="publish-button" disabled={!canPublish} onClick={publishScript}>{published ? 'Published' : 'Publish script'} <ArrowRight size={16}/></button></div><div className="script-preview"><div className="script-cover-upload">{coverPreview ? <img src={coverPreview} alt="Script cover preview" /> : <FileText size={42}/>}<input id="script-cover" className="hidden-file-input" type="file" accept="image/jpeg,image/png,.jpg,.jpeg,.png" onChange={chooseCover} /><label htmlFor="script-cover"><Upload size={14}/> {coverPreview ? 'Change image' : 'Upload image'}</label></div><div><span className="eyebrow warm">SCRIPT / STORY READY</span><h1>{displayTitle}</h1><p>{(file.size / (1024 * 1024)).toFixed(1)} MB · {file.type || 'Document'}</p></div></div><form className="script-details" onSubmit={publishScript}><label>Writer<input required value={form.writer} onChange={update('writer')} placeholder="Writer name" /></label><label>Title<input required value={form.title} onChange={update('title')} placeholder="Script or story title" /></label><label>Genre<input required value={form.genre} onChange={update('genre')} placeholder="Drama, comedy, thriller..." /></label><label>Logline<textarea required value={form.logline} onChange={update('logline')} placeholder="One line description of Film" /></label><button className="publish-button script-form-publish" disabled={!canPublish} type="submit">{published ? 'Published' : 'Publish script'} <ArrowRight size={16}/></button></form></div>
}

function EquipmentUploadPage() {
  const navigate = useNavigate()
  const [imagePreview, setImagePreview] = useState('')
  const [form, setForm] = useState({ name: '', category: '', condition: '', price: '', rentalPrice: '', location: '', description: '' })
  const update = field => event => setForm({ ...form, [field]: event.target.value })
  const chooseImage = event => {
    const image = event.target.files?.[0]
    if (!image) return
    const reader = new FileReader()
    reader.onload = result => setImagePreview(result.target.result)
    reader.readAsDataURL(image)
  }
  const canPublish = Boolean(imagePreview && form.name.trim() && form.category.trim() && form.condition.trim() && (form.price.trim() || form.rentalPrice.trim()) && form.location.trim() && form.description.trim())
  const publishEquipment = event => {
    event.preventDefault()
    if (!canPublish) return
    const listing = { id: `posted-${Date.now()}`, title: form.name.trim(), seller: 'Arjun Mehta', category: form.category.trim(), condition: form.condition.trim(), salePrice: form.price.trim(), rentalPrice: form.rentalPrice.trim(), detail: `${form.category.trim()} · ${form.condition.trim()}`, price: form.rentalPrice.trim() ? `${form.rentalPrice.trim()} / day` : form.price.trim(), location: form.location.trim(), description: form.description.trim(), image: imagePreview, createdAt: new Date().toISOString() }
    const existing = JSON.parse(localStorage.getItem('a-max-published-equipment') || '[]')
    localStorage.setItem('a-max-published-equipment', JSON.stringify([listing, ...existing]))
    navigate('/')
  }
  return <div className="equipment-upload-page"><div className="upload-toolbar"><button className="upload-back" onClick={() => navigate('/')}><ArrowLeft size={17}/> Back</button><button className="publish-button" disabled={!canPublish} onClick={publishEquipment}>Publish listing <ArrowRight size={16}/></button></div><div className="equipment-upload-intro"><span className="eyebrow warm">NEW EQUIPMENT LISTING</span><h1>Put your gear<br/><em>to work.</em></h1><p>Share equipment with the filmmakers who need it next.</p></div><form className="equipment-details" onSubmit={publishEquipment}><div className="equipment-image-upload">{imagePreview ? <img src={imagePreview} alt="Equipment preview" /> : <Camera size={42}/>}<input id="equipment-image" className="hidden-file-input" type="file" accept="image/jpeg,image/png,.jpg,.jpeg,.png" onChange={chooseImage}/><label htmlFor="equipment-image"><Upload size={14}/> {imagePreview ? 'Change photo' : 'Upload equipment photo'}<small>JPG / PNG</small></label></div><div className="equipment-form-grid"><label>Equipment name<input required value={form.name} onChange={update('name')} placeholder="ARRI Alexa Mini" /></label><label>Category<input required value={form.category} onChange={update('category')} placeholder="Camera, lens, lighting..." /></label><label>Condition<input required value={form.condition} onChange={update('condition')} placeholder="Excellent, like new, good..." /></label><label>Location<input required value={form.location} onChange={update('location')} placeholder="City, country" /></label><label>Sale price <small>Optional</small><input type="number" min="0" value={form.price} onChange={update('price')} placeholder="0.00" /></label><label>Rental price / day <small>Optional</small><input type="number" min="0" value={form.rentalPrice} onChange={update('rentalPrice')} placeholder="0.00" /></label></div><label className="equipment-description">Description<textarea required value={form.description} onChange={update('description')} placeholder="Tell filmmakers what makes this equipment useful, and what is included." /></label><button className="publish-button equipment-form-publish" disabled={!canPublish} type="submit">Publish listing <ArrowRight size={16}/></button></form></div>
}

function NotificationsPage() { return <div className="notifications-page"><div className="notifications-page-heading"><span className="eyebrow warm">YOUR STUDIO</span><h1>Notifications</h1><p>Everything happening around your work and your creative universe.</p></div><div className="notification-history">{notifications.concat(notifications).map((notification, index) => <article className="history-item" key={`${notification.title}-${index}`}><span className={`notification-dot notification-${notification.type}`}><Bell size={15}/></span><div><strong>{notification.title}</strong><p>{notification.detail}</p></div><span className="history-time">{index < 4 ? 'Today' : 'Yesterday'}</span></article>)}</div></div> }

function BookmarksPage() {
  const { bookmarks, toggleBookmark } = useBookmarks()
  const savedFilms = bookmarks.filter(item => item.type === 'film')
  const savedScripts = bookmarks.filter(item => item.type === 'script')
  const renderRow = item => <article className="bookmark-row" key={item.key}><img src={item.image} alt=""/><div><strong>{item.title}</strong><span>{item.creator}</span><p>{item.type === 'film' ? item.genre : item.type}</p></div><button className="script-bookmark-button saved" aria-label={`Remove ${item.title} from bookmarks`} onClick={() => toggleBookmark(item)}><Bookmark size={16} fill="currentColor"/></button></article>
  return <div className="bookmarks-page"><div className="bookmarks-heading"><span className="eyebrow warm">YOUR LIBRARY</span><h1>Bookmarks</h1><p>Films and scripts you want to return to.</p></div>{bookmarks.length === 0 ? <div className="placeholder"><h2>Your library is empty</h2><p>Like a short film or save a script to find it here.</p></div> : <><section className="bookmark-section"><div className="bookmark-section-heading"><span className="eyebrow">Liked films</span><small>{savedFilms.length} saved</small></div><div className="bookmark-stack">{savedFilms.length ? savedFilms.map(renderRow) : <p className="bookmark-empty">No liked films yet.</p>}</div></section><section className="bookmark-section"><div className="bookmark-section-heading"><span className="eyebrow">Saved scripts</span><small>{savedScripts.length} saved</small></div><div className="bookmark-stack">{savedScripts.length ? savedScripts.map(renderRow) : <p className="bookmark-empty">No saved scripts yet.</p>}</div></section></>}</div>
}

function Placeholder({ title, eyebrow }) { return <div className="placeholder"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>This part of your creative universe is taking shape.</p><Link className="primary-button" to="/">Return home <ChevronRight size={15}/></Link></div> }

function ProtectedProfile() { return localStorage.getItem('a-max-token') ? <ProfileView/> : <Navigate to="/login" replace /> }

function App() { return <Routes><Route path="/login" element={<AuthPage/>}/><Route path="/signup" element={<AuthPage mode="signup"/>}/><Route path="*" element={<Shell><Routes><Route path="/" element={<Home/>}/><Route path="/explore" element={<Explore/>}/><Route path="/profile" element={<ProtectedProfile/>}/><Route path="/profile/:username" element={<ProtectedProfile/>}/><Route path="/learn" element={<Learn/>}/><Route path="/learn/:topic" element={<LearnTopicPage/>}/><Route path="/communities" element={<Communities/>}/><Route path="/messages" element={<MessagesPage/>}/><Route path="/marketplace" element={<MarketplacePage/>}/><Route path="/marketplace/:id" element={<EquipmentDetailPage/>}/><Route path="/upload" element={<FilmUploadPage/>}/><Route path="/upload-script" element={<ScriptUploadPage/>}/><Route path="/bookmarks" element={<BookmarksPage/>}/><Route path="/notifications" element={<NotificationsPage/>}/><Route path="*" element={<Home/>}/></Routes></Shell>}/></Routes> }

export default App
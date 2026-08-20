import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Route, Routes, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Bell, Bookmark, Camera, ChevronRight, Compass, Film, FileText, Heart, Home as HomeIcon, MessageCircle, Play, Plus, Search, ScrollText, Sparkles, Upload, Users, WandSparkles } from 'lucide-react'

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

function Shell({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const isHome = location.pathname === '/'
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [recentSearches, setRecentSearches] = useState(() => { try { return JSON.parse(localStorage.getItem('a-max-recent-searches') || '[]').slice(0, 5) } catch { return [] } })
  const [createOpen, setCreateOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const filmInputRef = useRef(null)
  const scriptInputRef = useRef(null)
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
        <Link className="profile-mini" to="/profile"><img src="https://i.pravatar.cc/80?img=57" /><span><strong>Arjun Mehta</strong><small>Director · Writer</small></span><ChevronRight size={15}/></Link>
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

function SectionTitle({ eyebrow, title, action = 'View all' }) { return <div className="section-title"><div><span className="eyebrow">{eyebrow}</span>{title && <h2>{title}</h2>}</div><button>{action}<ChevronRight size={15}/></button></div> }

function FilmCard({ film, wide = false }) { const [liked, setLiked] = useState(false); return <article className={`film-card ${wide ? 'wide' : ''}`}><div className="film-image"><img src={film.image} alt=""/><span className="film-accent">{film.accent}</span><button className="play-button"><Play size={15} fill="currentColor"/></button><button className={`heart-button ${liked ? 'liked' : ''}`} onClick={() => setLiked(!liked)}><Heart size={17} fill={liked ? 'currentColor' : 'none'}/></button></div><div className="film-meta"><div><h3>{film.title}</h3><p>{film.creator}</p></div><small>{film.genre}</small></div></article> }

function ScriptCard({ script }) { return <article className="script-card"><img src={script.image} alt=""/><div><span className="eyebrow">PUBLISHED SCRIPT</span><h3>{script.title}</h3><p>{script.creator}</p><small>{script.type}</small></div><Bookmark size={16}/></article> }

function EquipmentCard({ item }) { return <article className="equipment-card"><div><img src={item.image} alt=""/><span className="equipment-tag">AVAILABLE</span></div><div className="equipment-meta"><h3>{item.title}</h3><p>{item.seller}</p><small>{item.detail}</small><strong>{item.price}</strong></div></article> }

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
  <section className="home-section"><SectionTitle eyebrow="Latest short films" title=""/><HorizontalRail className="film-rail" controls>{homeFilms.map((film, index) => <FilmCard key={`${film.title}-${index}`} film={film}/>)}</HorizontalRail></section>
  <section className="home-section"><SectionTitle eyebrow="Published scripts" title="" action="Read more"/><HorizontalRail className="script-rail" controls>{homeScripts.map((script, index) => <ScriptCard key={`${script.title}-${index}`} script={script}/>)}</HorizontalRail></section>
  <section className="home-section creator-section"><SectionTitle eyebrow="Filmmaker profiles" title="" action="Discover people"/><HorizontalRail className="creator-rail" controls>{creators.map(creator => <Link className="creator-card creator-card-link" to={`/profile/${creator.name.toLowerCase().replace(/\s+/g, '-')}`} key={creator.name}><img src={creator.image} alt=""/><div><h3>{creator.name}</h3><p>{creator.role}</p><small>{creator.followers} followers</small></div><button onClick={event => event.preventDefault()}>Follow</button></Link>)}</HorizontalRail></section>
  <section className="home-section"><SectionTitle eyebrow="Film equipment" title="" action="Browse marketplace"/><HorizontalRail className="equipment-rail" controls>{equipment.map(item => <EquipmentCard key={item.title} item={item}/>)}</HorizontalRail></section>
  <section><SectionTitle eyebrow="The community cut" title=""/><div className="community-banner"><div><span className="eyebrow warm">OPEN DISCUSSION · 2.4K MEMBERS</span><h2>What makes a scene<br/><em>unforgettable?</em></h2><p>Directors, editors, and actors are sharing the moments that changed how they work.</p><Link to="/communities" className="outline-button">Join the conversation <ChevronRight size={15}/></Link></div><div className="film-strip">{films.map(film => <img key={film.title} src={film.image} alt=""/>)}</div></div></section>
</> }

function Explore() {
  const [params] = useSearchParams()
  const search = params.get('search')?.trim().toLowerCase() || ''
  const localFilms = (() => { try { return JSON.parse(localStorage.getItem('a-max-published-films') || '[]') } catch { return [] } })()
  const localScripts = (() => { try { return JSON.parse(localStorage.getItem('a-max-published-scripts') || '[]') } catch { return [] } })()
  const result = search ? [...films, ...localFilms, ...scripts, ...localScripts].find(item => `${item.title} ${item.creator}`.toLowerCase().includes(search)) : null
  const isScript = result && 'type' in result && !('genre' in result)
  return <><div className="page-heading explore-heading"><span className="eyebrow">THE WORLD OF CINEMA</span><h1>Explore</h1></div>{result && <article className="explore-feature"><img src={result.image} alt=""/><div><span className="eyebrow warm">{isScript ? 'SCRIPT / STORY' : 'FEATURED FILM'}</span><h2>{result.title}</h2><div className="feature-facts"><span><b>{isScript ? 'Writer' : 'Director'}</b>{result.creator}</span><span><b>{isScript ? 'Format' : 'Genre'}</b>{isScript ? result.type : result.genre}</span><span><b>IMDb</b>{isScript ? '—' : '8.7 / 10'}</span></div><p>{isScript ? 'A published story from the A-MAX creative library, ready to be discovered.' : 'An independent film selected from the A-MAX showcase.'}</p><button className="primary-button"><Play size={15} fill="currentColor"/> {isScript ? 'Read script' : 'Watch trailer'}</button></div></article>}<div className="filter-row"><button className="filter-active">For you</button><button>Trending</button><button>Short films</button><button>Scripts & stories</button><button>Documentary</button></div><div className="explore-grid">{[...films, ...films].map((film, index) => <FilmCard key={`${film.title}-${index}`} film={film} wide={index % 3 === 0}/>)}</div></>
}

function Profile() {
  const { username } = useParams()
  const creator = creators.find(item => item.name.toLowerCase().replace(/\s+/g, '-') === username) || { name: 'Arjun Mehta', role: 'Director · Writer · Editor', image: 'https://i.pravatar.cc/160?img=57', followers: '4.8k' }
  const isOwnProfile = !username || username === 'arjun-mehta'
  const savedProfile = (() => { try { return JSON.parse(localStorage.getItem('a-max-profile') || 'null') } catch { return null } })()
  const [profile, setProfile] = useState(savedProfile || creator)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(profile)
  const editField = field => event => setDraft({ ...draft, [field]: event.target.value })
  const chooseProfileImage = event => { const image = event.target.files?.[0]; if (!image) return; const reader = new FileReader(); reader.onload = result => setDraft({ ...draft, image: result.target.result }); reader.readAsDataURL(image) }
  const saveProfile = event => { event.preventDefault(); setProfile(draft); localStorage.setItem('a-max-profile', JSON.stringify(draft)); setEditing(false) }
  return <><div className="profile-hero"><img className="cover-image" src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1500&q=80" alt=""/><div className="profile-info"><img className="avatar" src={profile.image} alt=""/><div><span className="eyebrow warm">{profile.role}</span><h1>{profile.name}</h1><p>{profile.bio || 'Stories about the quiet, strange, and beautiful parts of being human.'}</p><span className="location">{profile.location || 'Mumbai, India'} · {profile.followers} followers</span></div>{isOwnProfile && <button className="outline-button" onClick={() => { setDraft(profile); setEditing(true) }}>Edit profile</button>}</div></div><div className="profile-tabs"><b>About</b><span>Portfolio <small>08</small></span><span>Films <small>12</small></span><span>Activity</span></div><div className="profile-body"><section><SectionTitle eyebrow="Selected work" title="A body of work in progress"/><div className="film-grid">{films.slice(1).map(film => <FilmCard key={film.title} film={film}/>)}</div></section><aside className="about-panel"><span className="eyebrow">About {profile.name}</span><p>{profile.bio || 'Filmmaker exploring the space between what we say and what we mean. Currently developing a debut feature.'}</p><div className="skill-list"><span>Direction</span><span>Screenwriting</span><span>Editing</span><span>Visual storytelling</span></div></aside></div>{editing && <div className="profile-editor-backdrop"><form className="profile-editor" onSubmit={saveProfile}><div className="editor-header"><div><span className="eyebrow warm">YOUR PROFILE</span><h2>Edit profile</h2></div><button type="button" onClick={() => setEditing(false)}>×</button></div><div className="editor-avatar"><img src={draft.image} alt="Profile preview"/><input id="profile-picture" className="hidden-file-input" type="file" accept="image/jpeg,image/png,.jpg,.jpeg,.png" onChange={chooseProfileImage}/><label htmlFor="profile-picture" className="outline-button">Change profile picture</label></div><label>Name<input required value={draft.name} onChange={editField('name')} /></label><label>Film profession<input required value={draft.role} onChange={editField('role')} placeholder="Director · Writer · DOP" /></label><label>About<textarea value={draft.bio || ''} onChange={editField('bio')} placeholder="Tell people what you make." /></label><label>Location<input value={draft.location || ''} onChange={editField('location')} placeholder="City, country" /></label><div className="editor-actions"><button type="button" className="upload-back" onClick={() => setEditing(false)}>Cancel</button><button className="publish-button" type="submit">Save profile <ArrowRight size={16}/></button></div></form></div>}</> }

function Learn() { const topics = ['Cinematography', 'Screenwriting', 'Lighting', 'Sound design', 'Film direction', 'Editing']; return <><div className="page-heading compact"><span className="eyebrow">THE WORKSHOP</span><h1>Learn the craft.<br/><em>Shape the story.</em></h1><p>Practical knowledge from working filmmakers, built for the way you create.</p></div><div className="learning-feature"><div><span className="eyebrow warm">CONTINUE LEARNING · 42% COMPLETE</span><h2>The language<br/>of <em>light</em></h2><p>How contrast, color, and shadow tell a story before a character says a word.</p><div className="progress"><i style={{width: '42%'}} /></div><button className="primary-button">Continue lesson <ChevronRight size={15}/></button></div><div className="lesson-still"><span>Lesson 03 / 08</span></div></div><SectionTitle eyebrow="Browse the workshop" title="Build your toolkit"/><div className="topic-grid">{topics.map((topic, i) => <article key={topic}><span>0{i + 1}</span><h3>{topic}</h3><p>{['18 lessons', '12 lessons', '09 lessons', '14 lessons', '21 lessons', '16 lessons'][i]}</p><ChevronRight size={18}/></article>)}</div></> }

function Communities() { return <><div className="page-heading compact"><span className="eyebrow">THE COMMONS</span><h1>Make room for<br/><em>good company.</em></h1><p>Find your people, trade notes, and build something together.</p></div><div className="community-list">{['Independent Filmmakers', 'Screenwriters Room', 'Cinematographers', 'Vintage Camera Collectors'].map((name, i) => <article key={name}><div className={`community-icon icon-${i}`}><Users size={22}/></div><div><h2>{name}</h2><p>{['A home for the brave, scrappy, and self-funded.', 'Pages, premises, and the messy middle.', 'Light chasers and lens obsessives.', 'Old glass, new stories.'][i]}</p><small>{['12.4k', '8.7k', '5.2k', '3.1k'][i]} members</small></div><button className="outline-button">Join <Plus size={14}/></button></article>)}</div></> }

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
  const [published, setPublished] = useState(false)
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

  useEffect(() => {
    const formElement = document.querySelector('.film-details')
    const topPublishButton = document.querySelector('.upload-toolbar .publish-button')
    const submit = event => { event.preventDefault(); publishFilm() }
    formElement?.addEventListener('submit', submit)
    topPublishButton?.addEventListener('click', submit)
    return () => {
      formElement?.removeEventListener('submit', submit)
      topPublishButton?.removeEventListener('click', submit)
    }
  }, [posterFile, posterDataUrl, form, extraCrew])

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
    setPublished(true)
    navigate('/')
  }

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
  const canPublish = Boolean(file && coverPreview && form.writer.trim() && form.title.trim() && form.genre.trim() && form.logline.trim())
  const publishScript = event => {
    event.preventDefault()
    if (!canPublish) return
    const publishedScript = { title: form.title.trim(), creator: form.writer.trim(), type: 'Script / Story', image: coverPreview, accent: 'Just published' }
    const existing = JSON.parse(localStorage.getItem('a-max-published-scripts') || '[]')
    localStorage.setItem('a-max-published-scripts', JSON.stringify([publishedScript, ...existing]))
    setPublished(true)
    navigate('/')
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
    const listing = { title: form.name.trim(), seller: 'Arjun Mehta', detail: `${form.category.trim()} · ${form.condition.trim()}`, price: form.rentalPrice.trim() ? `${form.rentalPrice.trim()} / day` : form.price.trim(), image: imagePreview }
    const existing = JSON.parse(localStorage.getItem('a-max-published-equipment') || '[]')
    localStorage.setItem('a-max-published-equipment', JSON.stringify([listing, ...existing]))
    navigate('/')
  }
  return <div className="equipment-upload-page"><div className="upload-toolbar"><button className="upload-back" onClick={() => navigate('/')}><ArrowLeft size={17}/> Back</button><button className="publish-button" disabled={!canPublish} onClick={publishEquipment}>Publish listing <ArrowRight size={16}/></button></div><div className="equipment-upload-intro"><span className="eyebrow warm">NEW EQUIPMENT LISTING</span><h1>Put your gear<br/><em>to work.</em></h1><p>Share equipment with the filmmakers who need it next.</p></div><form className="equipment-details" onSubmit={publishEquipment}><div className="equipment-image-upload">{imagePreview ? <img src={imagePreview} alt="Equipment preview" /> : <Camera size={42}/>}<input id="equipment-image" className="hidden-file-input" type="file" accept="image/jpeg,image/png,.jpg,.jpeg,.png" onChange={chooseImage}/><label htmlFor="equipment-image"><Upload size={14}/> {imagePreview ? 'Change photo' : 'Upload equipment photo'}<small>JPG / PNG</small></label></div><div className="equipment-form-grid"><label>Equipment name<input required value={form.name} onChange={update('name')} placeholder="ARRI Alexa Mini" /></label><label>Category<input required value={form.category} onChange={update('category')} placeholder="Camera, lens, lighting..." /></label><label>Condition<input required value={form.condition} onChange={update('condition')} placeholder="Excellent, like new, good..." /></label><label>Location<input required value={form.location} onChange={update('location')} placeholder="City, country" /></label><label>Sale price <small>Optional</small><input type="number" min="0" value={form.price} onChange={update('price')} placeholder="0.00" /></label><label>Rental price / day <small>Optional</small><input type="number" min="0" value={form.rentalPrice} onChange={update('rentalPrice')} placeholder="0.00" /></label></div><label className="equipment-description">Description<textarea required value={form.description} onChange={update('description')} placeholder="Tell filmmakers what makes this equipment useful, and what is included." /></label><button className="publish-button equipment-form-publish" disabled={!canPublish} type="submit">Publish listing <ArrowRight size={16}/></button></form></div>
}

function NotificationsPage() { return <div className="notifications-page"><div className="notifications-page-heading"><span className="eyebrow warm">YOUR STUDIO</span><h1>Notifications</h1><p>Everything happening around your work and your creative universe.</p></div><div className="notification-history">{notifications.concat(notifications).map((notification, index) => <article className="history-item" key={`${notification.title}-${index}`}><span className={`notification-dot notification-${notification.type}`}><Bell size={15}/></span><div><strong>{notification.title}</strong><p>{notification.detail}</p></div><span className="history-time">{index < 4 ? 'Today' : 'Yesterday'}</span></article>)}</div></div> }

function Placeholder({ title, eyebrow }) { return <div className="placeholder"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>This part of your creative universe is taking shape.</p><Link className="primary-button" to="/">Return home <ChevronRight size={15}/></Link></div> }

function App() { return <Routes><Route path="/login" element={<AuthPage/>}/><Route path="/signup" element={<AuthPage mode="signup"/>}/><Route path="*" element={<Shell><Routes><Route path="/" element={<Home/>}/><Route path="/explore" element={<Explore/>}/><Route path="/profile" element={<Profile/>}/><Route path="/profile/:username" element={<Profile/>}/><Route path="/learn" element={<Learn/>}/><Route path="/communities" element={<Communities/>}/><Route path="/messages" element={<Placeholder eyebrow="THE STUDIO LINE" title="Messages"/>}/><Route path="/marketplace" element={<Placeholder eyebrow="THE EXCHANGE" title="Marketplace"/>}/><Route path="/upload" element={<FilmUploadPage/>}/><Route path="/upload-script" element={<ScriptUploadPage/>}/><Route path="/bookmarks" element={<Placeholder eyebrow="YOUR LIBRARY" title="Bookmarks"/>}/><Route path="/notifications" element={<NotificationsPage/>}/><Route path="*" element={<Home/>}/></Routes></Shell>}/></Routes> }

export default App
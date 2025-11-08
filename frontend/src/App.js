import { useState, useEffect, useRef } from "react";
import bannerImage from "./assets/banner1.jpg";
import logoImage from "./assets/one-piece-logo.png";
import bgMusic from "./assets/music/Binks Sake.mp3";
import CardsList from "./CardsList";
import DeckBuilder from "./DeckBuilder";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  useLocation,
} from "react-router-dom";

function AppContent() {
  const location = useLocation();
  const [bannerOpacity, setBannerOpacity] = useState(1);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);

  const audioRef = useRef(null);
  const isHomePage = location.pathname === "/";

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  // Fade banner on scroll
  useEffect(() => {
    function handleScroll() {
      const scrollY = window.scrollY;
      setBannerOpacity(Math.max(1 - scrollY / 300, 0));
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Try autoplay immediately
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current
        .play()
        .then(() => {
          audioRef.current.muted = false; // unmute right after playback starts
        })
        .catch(() => {
          console.warn("Autoplay blocked, waiting for user interaction...");
          // Fallback: wait for user click to start
          document.addEventListener(
            "click",
            () => {
              audioRef.current.play();
              audioRef.current.muted = false;
            },
            { once: true }
          );
        });
    }
  }, []);

  // Keep <audio> in sync with state
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = muted;
      audioRef.current.volume = volume;
    }
  }, [muted, volume]);

  const toggleMute = () => setMuted((prev) => !prev);

  return (
    <div className="text-center">
      {/* Background Music */}
      <audio ref={audioRef} src={bgMusic} autoPlay loop muted />

      {/* Banner Section - Only show on home page */}
      {isHomePage && (
        <div
          className="bg-cover bg-center bg-no-repeat h-screen flex items-center justify-center text-center text-white mb-0 transition-opacity duration-100 ease-out relative shadow-[0_-8px_40px_rgba(0,0,0,0.5)]"
          style={{
            backgroundImage: `url(${bannerImage})`,
          }}
        >
          <div
            className="flex flex-col items-center gap-2.5 will-change-[opacity] relative transition-opacity duration-100 linear animate-fade-out"
            style={{
              opacity: bannerOpacity,
              animationTimeline: "scroll()",
              animationRange: "0 700px",
            }}
          >
            {/* Audio Controls */}
            <div className="absolute -top-28 right-4 flex flex-row items-center gap-2.5 z-10 animate-slide-down">
              <button
                onClick={toggleMute}
                className="w-[clamp(40px,5vw,70px)] h-[clamp(40px,5vw,70px)] flex items-center justify-center leading-none border-[3px] border-[rgba(11,102,138,0.95)] rounded-full bg-[rgba(19,164,219,0.95)] text-[clamp(1rem,1.5vw,2rem)] font-bold text-white cursor-pointer shadow-[0_2px_6px_rgba(0,0,0,0.3)] transition-all duration-300 ease-in-out hover:scale-110 hover:rotate-12 hover:border-white hover:shadow-[0_8px_20px_rgba(19,164,219,0.6)] active:scale-95"
                aria-pressed={muted}
                aria-label={
                  muted ? "Unmute background music" : "Mute background music"
                }
                title={muted ? "Unmute music" : "Mute Music"}
              >
                {muted ? "🔊" : "🔇"}
              </button>

              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="volume-slider transition-all duration-300 hover:scale-105"
              />
            </div>

            {/* Banner Logo and Title */}
            <img 
              src={logoImage} 
              alt="Logo" 
              className="w-[clamp(120px,70vw,900px)] h-auto max-w-full inline-block animate-float will-change-transform backface-hidden transform-gpu" 
            />
            <h1 className="font-one-piece text-[clamp(1.5rem,4vw,3.5rem)] font-bold [text-shadow:2px_2px_6px_rgba(0,0,0,2)] m-0">TRADING CARD GAME</h1>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex gap-8 justify-evenly py-4 w-full mx-auto bg-gradient-to-r from-[#1a5f7a] via-[#13a4db] to-[#1a5f7a] shadow-[0px_4px_12px_rgba(0,0,0,0.4)] sticky top-0 z-[100] backdrop-blur-md">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? "text-5xl font-one-piece [text-shadow:2px_2px_6px_rgba(0,0,0,2)] font-bold no-underline text-white transition-all duration-300 ease-in-out px-5 py-0 rounded-[30px] bg-[rgb(63,195,247)] hover:text-[#c7c7c7] hover:scale-110 hover:shadow-[0_8px_20px_rgba(63,195,247,0.5)] active:scale-95"
              : "text-5xl font-one-piece [text-shadow:2px_2px_6px_rgba(0,0,0,2)] font-bold no-underline text-white transition-all duration-300 ease-in-out hover:text-[#c7c7c7] hover:scale-110 hover:translate-y-[-4px]"
          }
        >
          CARD DATABASE
        </NavLink>
        <NavLink
          to="/deck-builder"
          className={({ isActive }) =>
            isActive
              ? "text-5xl font-one-piece [text-shadow:2px_2px_6px_rgba(0,0,0,2)] font-bold no-underline text-white transition-all duration-300 ease-in-out px-5 py-0 rounded-[30px] bg-[rgb(63,195,247)] hover:text-[#c7c7c7] hover:scale-110 hover:shadow-[0_8px_20px_rgba(63,195,247,0.5)] active:scale-95"
              : "text-5xl font-one-piece [text-shadow:2px_2px_6px_rgba(0,0,0,2)] font-bold no-underline text-white transition-all duration-300 ease-in-out hover:text-[#c7c7c7] hover:scale-110 hover:translate-y-[-4px]"
          }
        >
          DECK BUILDER
        </NavLink>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<CardsList />} />
        <Route path="/deck-builder" element={<DeckBuilder />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

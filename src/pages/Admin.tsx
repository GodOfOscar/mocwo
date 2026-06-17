import { useState, useEffect, useRef } from "react";
import { loginAdmin, verifyAdmin } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Lock, Users, CreditCard, TrendingUp, DollarSign, Calendar, Heart, BookOpen, Video, Image, Clock, ArrowLeft, Book, ShieldAlert } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Edit2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

/* ─── Inline styles for animations (scoped to admin page) ─── */
const adminStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Lato:wght@300;400;700&display=swap');

  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes characterFloat {
    0%, 100% { transform: translateY(0px) rotate(-1deg); }
    50%       { transform: translateY(-14px) rotate(1deg); }
  }
  @keyframes breathe {
    0%, 100% { transform: scaleY(1); }
    50%       { transform: scaleY(0.94); }
  }
  @keyframes eyeBlink {
    0%, 90%, 100% { transform: scaleY(1); }
    95%            { transform: scaleY(0.05); }
  }
  @keyframes hairSway {
    0%, 100% { transform: rotate(0deg); transform-origin: top center; }
    50%       { transform: rotate(3deg); transform-origin: top center; }
  }
  @keyframes rippleEffect {
    0%   { transform: scale(0); opacity: 0.5; }
    100% { transform: scale(4); opacity: 0; }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes orb1 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33%       { transform: translate(30px, -20px) scale(1.1); }
    66%       { transform: translate(-20px, 15px) scale(0.95); }
  }
  @keyframes orb2 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33%       { transform: translate(-25px, 20px) scale(1.05); }
    66%       { transform: translate(20px, -15px) scale(0.9); }
  }
  @keyframes danceKick {
    0%, 100% { transform: rotateX(0deg) rotateY(0deg); }
    25%      { transform: rotateX(8deg) rotateY(-12deg); }
    50%      { transform: rotateX(0deg) rotateY(0deg); }
    75%      { transform: rotateX(8deg) rotateY(12deg); }
  }
  @keyframes legSwing {
    0%, 100% { transform: rotate(-5deg); transform-origin: top center; }
    25%      { transform: rotate(25deg); transform-origin: top center; }
    50%      { transform: rotate(-5deg); transform-origin: top center; }
    75%      { transform: rotate(30deg); transform-origin: top center; }
  }
  @keyframes armWave {
    0%, 100% { transform: rotate(-10deg); transform-origin: top center; }
    25%      { transform: rotate(35deg); transform-origin: top center; }
    50%      { transform: rotate(-10deg); transform-origin: top center; }
    75%      { transform: rotate(-40deg); transform-origin: top center; }
  }
  @keyframes armWaveRight {
    0%, 100% { transform: rotate(10deg); transform-origin: top center; }
    25%      { transform: rotate(-40deg); transform-origin: top center; }
    50%      { transform: rotate(10deg); transform-origin: top center; }
    75%      { transform: rotate(35deg); transform-origin: top center; }
  }
  @keyframes slideInDance {
    0%   { transform: translateX(-400px) scale(0.6); opacity: 0; }
    50%  { transform: translateX(-100px) scale(0.85); opacity: 0.8; }
    100% { transform: translateX(0) scale(1); opacity: 1; }
  }
  @keyframes headBob {
    0%, 100% { transform: translateY(0px); }
    25%      { transform: translateY(-8px); }
    50%      { transform: translateY(-2px); }
    75%      { transform: translateY(-10px); }
  }
  @keyframes spinTorso {
    0%, 100% { transform: rotateZ(0deg); }
    25%      { transform: rotateZ(-6deg); }
    50%      { transform: rotateZ(0deg); }
    75%      { transform: rotateZ(6deg); }
  }
  @keyframes labelFloat {
    from { top: 50%; transform: translateY(-50%); font-size: 15px; color: #a0a0b8; }
    to   { top: 0px; transform: translateY(-100%); font-size: 11px; color: #7c6af7; }
  }

  .admin-page-wrap * { box-sizing: border-box; }

  .admin-page-wrap {
    font-family: 'Lato', sans-serif;
  }

  /* ── Background ── */
  .admin-bg {
    position: fixed; inset: 0;
    background: linear-gradient(135deg, #0d0b1e 0%, #1a1040 40%, #0f1a35 100%);
    overflow: hidden;
  }
  .admin-bg-orb {
    position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.18;
    pointer-events: none;
  }
  .admin-bg-orb-1 {
    width: 600px; height: 600px; top: -100px; left: -100px;
    background: radial-gradient(circle, #6c63ff, #a855f7);
    animation: orb1 12s ease-in-out infinite;
  }
  .admin-bg-orb-2 {
    width: 500px; height: 500px; bottom: -80px; right: -80px;
    background: radial-gradient(circle, #06b6d4, #3b82f6);
    animation: orb2 15s ease-in-out infinite;
  }
  .admin-bg-orb-3 {
    width: 300px; height: 300px; top: 50%; left: 50%;
    background: radial-gradient(circle, #f59e0b, #ef4444);
    animation: orb2 20s ease-in-out infinite reverse;
    opacity: 0.08;
  }

  /* ── Layout ── */
  .admin-split {
    display: flex;
    min-height: 100vh;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    gap: 4rem;
  }

  /* ── Character ── */
  .character-wrap {
    display: flex; flex-direction: column; align-items: center; gap: 1rem;
    animation: slideInDance 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) both;
    animation-delay: 0.2s;
    perspective: 1200px;
  }
  .character-svg {
    animation: characterFloat 5s ease-in-out infinite, danceKick 1.6s ease-in-out infinite;
    animation-delay: 1.4s, 1.4s;
    filter: drop-shadow(0 24px 40px rgba(108, 99, 255, 0.35)) drop-shadow(0 8px 24px rgba(168, 85, 247, 0.2));
    transform-style: preserve-3d;
    will-change: transform;
  }
  .character-bubble {
    background: rgba(255,255,255,0.07);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 20px;
    padding: 12px 20px;
    color: rgba(255,255,255,0.85);
    font-size: 14px;
    text-align: center;
    max-width: 220px;
    line-height: 1.5;
  }
  .character-bubble strong {
    display: block;
    font-size: 16px;
    font-family: 'Cinzel', serif;
    color: #c4b5fd;
    margin-bottom: 4px;
  }
  @media (max-width: 768px) {
    .character-wrap { display: none; }
    .admin-split { justify-content: center; }
  }

  /* ── Card ── */
  .admin-card {
    width: 100%;
    max-width: 420px;
    background: rgba(255,255,255,0.05);
    backdrop-filter: blur(24px);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 24px;
    padding: 2.5rem;
    animation: fadeSlideUp 0.7s cubic-bezier(0.22,1,0.36,1) both;
    animation-delay: 0.2s;
  }
  .admin-card-title {
    font-family: 'Cinzel', serif;
    font-size: 26px;
    font-weight: 700;
    color: #fff;
    text-align: center;
    margin-bottom: 4px;
  }
  .admin-card-sub {
    font-size: 13px;
    color: rgba(255,255,255,0.45);
    text-align: center;
    margin-bottom: 2rem;
  }

  /* ── Icon badge ── */
  .admin-icon-badge {
    width: 64px; height: 64px;
    border-radius: 50%;
    background: linear-gradient(135deg, #6c63ff, #a78bfa);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 1.2rem;
    box-shadow: 0 8px 32px rgba(108,99,255,0.4);
    animation: fadeSlideUp 0.6s ease both;
    animation-delay: 0.3s;
  }

  /* ── Floating label field ── */
  .field-wrap {
    position: relative;
    margin-bottom: 1.4rem;
    animation: fadeSlideUp 0.6s ease both;
  }
  .field-wrap:nth-child(1) { animation-delay: 0.35s; }
  .field-wrap:nth-child(2) { animation-delay: 0.45s; }
  .field-wrap:nth-child(3) { animation-delay: 0.55s; }

  .floating-label {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 15px;
    color: rgba(255,255,255,0.35);
    pointer-events: none;
    transition: all 0.22s cubic-bezier(0.4,0,0.2,1);
    background: transparent;
    padding: 0 4px;
    z-index: 2;
  }
  .floating-label.active {
    top: -1px;
    transform: translateY(-100%);
    font-size: 11px;
    color: #a78bfa;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .admin-input {
    width: 100%;
    height: 52px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 12px;
    padding: 0 16px;
    font-size: 15px;
    color: #fff;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    font-family: 'Lato', sans-serif;
  }
  .admin-input::placeholder { color: transparent; }
  .admin-input:focus {
    border-color: rgba(167,139,250,0.6);
    box-shadow: 0 0 0 3px rgba(167,139,250,0.15);
    background: rgba(255,255,255,0.09);
  }
  .admin-input:focus + .floating-label,
  .admin-input:not(:placeholder-shown) + .floating-label {
    top: -1px;
    transform: translateY(-100%);
    font-size: 11px;
    color: #a78bfa;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  /* ── Button ── */
  .admin-btn-wrap {
    position: relative;
    overflow: hidden;
    border-radius: 14px;
    margin-top: 0.5rem;
    animation: fadeSlideUp 0.6s ease both;
    animation-delay: 0.6s;
  }
  .admin-btn {
    width: 100%;
    height: 52px;
    background: linear-gradient(90deg, #6c63ff, #a855f7);
    background-size: 200% auto;
    border: none;
    border-radius: 14px;
    color: #fff;
    font-size: 15px;
    font-weight: 700;
    font-family: 'Lato', sans-serif;
    letter-spacing: 0.04em;
    cursor: pointer;
    transition: transform 0.15s, box-shadow 0.2s, background-position 0.4s;
    position: relative; overflow: hidden;
  }
  .admin-btn:hover {
    background-position: right center;
    box-shadow: 0 8px 28px rgba(108,99,255,0.45);
    transform: scale(1.02);
  }
  .admin-btn:active { transform: scale(0.98); }
  .admin-btn-ripple {
    position: absolute;
    border-radius: 50%;
    width: 40px; height: 40px;
    background: rgba(255,255,255,0.3);
    transform: scale(0);
    animation: rippleEffect 0.6s ease-out forwards;
    pointer-events: none;
  }

  /* ── Error ── */
  .admin-error {
    background: rgba(239,68,68,0.12);
    border: 1px solid rgba(239,68,68,0.3);
    border-radius: 10px;
    color: #fca5a5;
    padding: 10px 14px;
    font-size: 13px;
    margin-bottom: 1rem;
    animation: fadeSlideUp 0.3s ease both;
  }

  /* ── Pre-auth screen ── */
  .pre-auth-overlay {
    position: fixed; inset: 0;
    display: flex; align-items: center; justify-content: center;
    z-index: 9999;
    padding: 2rem;
  }
  .pre-auth-card {
    background: rgba(255,255,255,0.07);
    backdrop-filter: blur(24px);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 24px;
    padding: 2.5rem;
    max-width: 400px; width: 100%;
    animation: fadeSlideUp 0.7s cubic-bezier(0.22,1,0.36,1) both;
    text-align: center;
  }
  .pre-auth-emoji { font-size: 72px; display: block; margin-bottom: 1rem; }
  .pre-auth-title {
    font-family: 'Cinzel', serif;
    color: #fff; font-size: 22px; margin-bottom: 1.5rem;
  }
`;

/* ─── 3D-style SVG character with dancing animation ─── */
const CharacterSVG = () => (
  <svg
    className="character-svg"
    width="220"
    height="320"
    viewBox="0 0 220 320"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Shadow */}
    <ellipse cx="110" cy="305" rx="50" ry="10" fill="rgba(108,99,255,0.18)" />

    {/* Body Group - Torso with spin animation */}
    <g style={{ 
      animationName: "spinTorso", 
      animationDuration: "1.6s", 
      animationTimingFunction: "ease-in-out", 
      animationIterationCount: "infinite", 
      transformOrigin: "center center", 
      animationDelay: "1.4s" 
    }}>
      <g style={{ animationName: "breathe", animationDuration: "3.5s", animationTimingFunction: "ease-in-out", animationIterationCount: "infinite" }}>
        <rect x="68" y="175" width="84" height="95" rx="20" fill="#6c63ff" />
        {/* Collar / shirt detail */}
        <rect x="88" y="175" width="44" height="18" rx="6" fill="#a78bfa" />
        {/* Buttons */}
        <circle cx="110" cy="205" r="3" fill="#c4b5fd" />
        <circle cx="110" cy="218" r="3" fill="#c4b5fd" />
        <circle cx="110" cy="231" r="3" fill="#c4b5fd" />
      </g>
    </g>

    {/* Left Arm - Wave animation */}
    <g style={{ animationName: "armWave", animationDuration: "1.6s", animationTimingFunction: "ease-in-out", animationIterationCount: "infinite", transformOrigin: "53px 178px", animationDelay: "1.4s" }}>
      <rect x="38" y="178" width="30" height="68" rx="15" fill="#6c63ff" />
      <circle cx="53" cy="252" r="14" fill="#f5c5a3" />
    </g>

    {/* Right Arm - Counter wave animation */}
    <g style={{ animationName: "armWaveRight", animationDuration: "1.6s", animationTimingFunction: "ease-in-out", animationIterationCount: "infinite", transformOrigin: "167px 178px", animationDelay: "1.4s" }}>
      <rect x="152" y="178" width="30" height="68" rx="15" fill="#6c63ff" />
      <circle cx="167" cy="252" r="14" fill="#f5c5a3" />
    </g>

    {/* Legs - Left leg with swing */}
    <g style={{ animationName: "legSwing", animationDuration: "1.6s", animationTimingFunction: "ease-in-out", animationIterationCount: "infinite", transformOrigin: "90px 262px", animationDelay: "1.4s" }}>
      <rect x="76" y="262" width="28" height="48" rx="14" fill="#4f46e5" />
      <ellipse cx="90" cy="308" rx="20" ry="9" fill="#1e1b4b" />
    </g>

    {/* Legs - Right leg with swing (opposite) */}
    <g style={{ animationName: "legSwing", animationDuration: "1.6s", animationTimingFunction: "ease-in-out", animationIterationCount: "infinite", transformOrigin: "130px 262px", animationDelay: "1.8s" }}>
      <rect x="116" y="262" width="28" height="48" rx="14" fill="#4f46e5" />
      <ellipse cx="130" cy="308" rx="20" ry="9" fill="#1e1b4b" />
    </g>

    {/* Neck */}
    <rect x="98" y="155" width="24" height="24" rx="8" fill="#f5c5a3" />

    {/* Head Group - Bob animation */}
    <g style={{ animationName: "headBob", animationDuration: "1.6s", animationTimingFunction: "ease-in-out", animationIterationCount: "infinite", transformOrigin: "110px 128px", animationDelay: "1.4s" }}>
      <circle cx="110" cy="128" r="50" fill="#f5c5a3" />

      {/* Hair */}
      <g style={{ animationName: "hairSway", animationDuration: "4s", animationTimingFunction: "ease-in-out", animationIterationCount: "infinite" }}>
        <ellipse cx="110" cy="85" rx="50" ry="22" fill="#1a0a2e" />
        <ellipse cx="68" cy="108" rx="16" ry="32" fill="#1a0a2e" />
        <ellipse cx="152" cy="108" rx="16" ry="32" fill="#1a0a2e" />
        <rect x="60" y="78" width="100" height="28" rx="14" fill="#1a0a2e" />
        {/* Highlights */}
        <ellipse cx="88" cy="84" rx="12" ry="5" fill="#3d1f6e" opacity="0.7" />
      </g>

      {/* Eyes */}
      <g style={{ animationName: "eyeBlink", animationDuration: "4s", animationTimingFunction: "ease-in-out", animationIterationCount: "infinite" }}>
        <ellipse cx="95" cy="125" rx="7" ry="8" fill="#1a0a2e" />
        <ellipse cx="125" cy="125" rx="7" ry="8" fill="#1a0a2e" />
        {/* Shine */}
        <circle cx="98" cy="122" r="2.5" fill="#fff" />
        <circle cx="128" cy="122" r="2.5" fill="#fff" />
        {/* Iris */}
        <circle cx="95" cy="126" r="4" fill="#6c63ff" />
        <circle cx="125" cy="126" r="4" fill="#6c63ff" />
        <circle cx="95" cy="126" r="2" fill="#1a0a2e" />
        <circle cx="125" cy="126" r="2" fill="#1a0a2e" />
      </g>

      {/* Eyebrows */}
      <path d="M86 114 Q95 110 104 114" stroke="#1a0a2e" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M116 114 Q125 110 134 114" stroke="#1a0a2e" strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* Nose */}
      <ellipse cx="110" cy="136" rx="4" ry="3" fill="#e8a882" />

      {/* Smile */}
      <path d="M97 147 Q110 158 123 147" stroke="#c47b5a" strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* Cheeks */}
      <ellipse cx="84" cy="142" rx="10" ry="7" fill="#ffb3b3" opacity="0.45" />
      <ellipse cx="136" cy="142" rx="10" ry="7" fill="#ffb3b3" opacity="0.45" />

      {/* Earrings */}
      <circle cx="62" cy="132" r="5" fill="#a78bfa" />
      <circle cx="158" cy="132" r="5" fill="#a78bfa" />
    </g>

    {/* Sparkles - Enhanced glow */}
    <g opacity="0.8">
      <circle cx="30" cy="60" r="3" fill="#f59e0b" />
      <circle cx="185" cy="50" r="2" fill="#a78bfa" />
      <circle cx="195" cy="120" r="3" fill="#06b6d4" />
      <circle cx="20" cy="140" r="2" fill="#f59e0b" />
      {/* Additional shimmer sparkles */}
      <circle cx="15" cy="70" r="1.5" fill="#a78bfa" opacity="0.6" />
      <circle cx="200" cy="90" r="1.5" fill="#06b6d4" opacity="0.6" />
      <circle cx="25" cy="200" r="1" fill="#f59e0b" opacity="0.5" />
    </g>

    {/* Energy particles around character */}
    <g opacity="0.6">
      <circle cx="40" cy="150" r="2" fill="#6c63ff" />
      <circle cx="180" cy="160" r="2" fill="#a855f7" />
      <circle cx="110" cy="80" r="1.5" fill="#06b6d4" />
    </g>
  </svg>
);

/* ─── Floating-label input ─── */
const FloatingInput = ({
  id, label, type = "text", value, onChange, required = false
}: {
  id: string; label: string; type?: string;
  value: string; onChange: (v: string) => void; required?: boolean;
}) => {
  const [focused, setFocused] = useState(false);
  const isActive = focused || value.length > 0;
  return (
    <div className="field-wrap" style={{ position: "relative", marginBottom: "1.4rem" }}>
      <input
        id={id}
        type={type}
        className="admin-input"
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder=" "
        required={required}
        autoComplete={type === "password" ? "current-password" : "email"}
      />
      <label
        htmlFor={id}
        className={`floating-label${isActive ? " active" : ""}`}
        style={{
          position: "absolute",
          left: 16,
          top: isActive ? -1 : "50%",
          transform: isActive ? "translateY(-100%)" : "translateY(-50%)",
          fontSize: isActive ? 11 : 15,
          color: isActive ? "#a78bfa" : "rgba(255,255,255,0.35)",
          fontWeight: isActive ? 600 : 400,
          letterSpacing: isActive ? "0.04em" : "normal",
          textTransform: isActive ? "uppercase" : "none",
          pointerEvents: "none",
          transition: "all 0.22s cubic-bezier(0.4,0,0.2,1)",
          background: "transparent",
          padding: "0 4px",
          zIndex: 2,
        }}
      >
        {label}
      </label>
    </div>
  );
};

/* ─── Ripple Button ─── */
const RippleButton = ({
  children, onClick, style = {}, type = "button"
}: {
  children: React.ReactNode; onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties; type?: "button" | "submit";
}) => {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = btnRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left - 20;
    const y = e.clientY - rect.top - 20;
    const id = Date.now();
    setRipples(r => [...r, { x, y, id }]);
    setTimeout(() => setRipples(r => r.filter(rp => rp.id !== id)), 700);
    if (onClick) onClick(e);
  };

  return (
    <div className="admin-btn-wrap">
      <button
        ref={btnRef}
        type={type}
        className="admin-btn"
        onClick={handleClick}
        style={style}
      >
        {children}
        {ripples.map(r => (
          <span
            key={r.id}
            className="admin-btn-ripple"
            style={{ left: r.x, top: r.y }}
          />
        ))}
      </button>
    </div>
  );
};

const Admin = () => {
  const [preAuthPassed, setPreAuthPassed] = useState(false);
  const [preAuthAnswer, setPreAuthAnswer] = useState("");
  const [preAuthError, setPreAuthError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [masterPasswordFromDB, setMasterPasswordFromDB] = useState("");
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false); // New state for maintenance mode
  const [isMasterAdmin, setIsMasterAdmin] = useState(false);
  const [partnerships, setPartnerships] = useState([]);
  const [membershipRequests, setMembershipRequests] = useState([]);
  const [prayerRequests, setPrayerRequests] = useState<any[]>([]);
  const [newsItems, setNewsItems] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [newsForm, setNewsForm] = useState({ title: "", excerpt: "", content: "", date: "", image: "", link: "" });
  const [imageUploading, setImageUploading] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any | null>(null);
  const [selectedPrayer, setSelectedPrayer] = useState<any | null>(null);
  const [stats, setStats] = useState({
    totalPartnerships: 0, totalAmount: 0, pendingApplications: 0, activePartners: 0,
    totalMembers: 0, pendingMembers: 0, approvedMembers: 0
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const initAdmin = async () => {
      const response = await fetch("/api/admin/settings/master_password");
      const data = await response.json();
      if (data.success) setMasterPasswordFromDB(data.value);

      // Fetch maintenance mode status from the backend
      try {
        const maintenanceResponse = await fetch("/api/status");
        const maintenanceData = await maintenanceResponse.json();
        if (maintenanceData.success) setIsMaintenanceMode(maintenanceData.maintenanceMode);
      } catch (error) {
        console.error("Error fetching maintenance mode from backend:", error);
      }
      checkAuthState();
    };
    initAdmin();
  }, []);
  useEffect(() => {
    if (isAuthenticated) {
      fetchPartnerships(); fetchMembershipRequests(); fetchPrayerRequests();
      fetchStats(); fetchNews();
    }
  }, [isAuthenticated]);

  const fetchNews = async () => {
    try {
      const { data, error } = await (supabase as any).from("news").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      setNewsItems(data || []);
    } catch (error: any) {
      toast({ title: "Error fetching news", description: error.message, variant: "destructive" });
    }
  };

  const fetchMembershipRequests = async () => {
    try {
      const { data, error } = await (supabase as any).from('membership_requests').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setMembershipRequests(data || []);
    } catch (error: any) {
      toast({ title: "Error fetching membership requests", description: error.message, variant: "destructive" });
    }
  };

  const fetchPrayerRequests = async () => {
    try {
      const { data, error } = await supabase.from('prayer_requests').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setPrayerRequests(data || []);
    } catch (error: any) {
      toast({ title: "Error fetching prayer requests", description: error.message, variant: "destructive" });
    }
  };

  const updatePrayerStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase.from('prayer_requests').update({ status }).eq('id', id);
      if (error) throw error;
      toast({ title: "Status updated", description: `Prayer request marked as ${status}` });
      fetchPrayerRequests();
    } catch (error: any) {
      toast({ title: "Error updating status", description: error.message, variant: "destructive" });
    }
  };

  const handleNewsSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      if (editing) {
        const { error } = await (supabase as any).from("news").update({
          title: newsForm.title, excerpt: newsForm.excerpt, content: newsForm.content,
          date: newsForm.date, image: newsForm.image, link: newsForm.link,
        }).eq("id", editing.id);
        if (error) throw error;
        toast({ title: "News updated", description: "The news item was updated." });
      } else {
        const { error } = await (supabase as any).from("news").insert([{
          title: newsForm.title, excerpt: newsForm.excerpt, content: newsForm.content,
          date: newsForm.date, image: newsForm.image, link: newsForm.link,
        }]);
        if (error) throw error;
        toast({ title: "News created", description: "A new news item was created." });
      }
      setNewsForm({ title: "", excerpt: "", content: "", date: "", image: "", link: "" });
      setEditing(null);
      fetchNews();
    } catch (error: any) {
      toast({ title: "Error saving news", description: error.message, variant: "destructive" });
    }
  };

  const handleNewsEdit = (item: any) => {
    setEditing(item);
    setNewsForm({ title: item.title || "", excerpt: item.excerpt || "", content: item.content || "", date: item.date || "", image: item.image || "", link: item.link || "" });
  };

  const handleNewsDelete = async (id: string) => {
    if (!confirm("Delete this news item?")) return;
    try {
      const { error } = await (supabase as any).from("news").delete().eq("id", id);
      if (error) throw error;
      toast({ title: "Deleted", description: "News item deleted." });
      fetchNews();
    } catch (error: any) {
      toast({ title: "Error deleting news", description: error.message, variant: "destructive" });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const fileName = `${Date.now()}.${ext}`;
      const filePath = `news/${fileName}`;
      const { data: uploadData, error: uploadError } = await (supabase as any).storage.from('news-images').upload(filePath, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data: urlData } = await (supabase as any).storage.from('news-images').getPublicUrl(filePath);
      const publicUrl = (urlData as any)?.publicUrl || (urlData as any)?.public_url || '';
      setNewsForm(prev => ({ ...prev, image: publicUrl }));
      toast({ title: 'Image uploaded', description: 'Image uploaded to storage.' });
    } catch (err: any) {
      toast({ title: 'Upload failed', description: err.message || String(err), variant: 'destructive' });
    } finally {
      setImageUploading(false);
    }
  };

  const checkAuthState = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        const verifyData = await verifyAdmin(session.user.email);
        if (verifyData.success && verifyData.data?.isAdmin) {
          setIsAuthenticated(true);
          if (sessionStorage.getItem("is_master_admin") === "true") {
            setIsMasterAdmin(true);
          }
        } else {
          try { await supabase.auth.signOut(); } catch (e) {}
          setIsAuthenticated(false);
        }
      }
    } catch (error) {
      setIsAuthenticated(false);
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginError("");
    try {
      if (loginForm.password === masterPasswordFromDB) {
        setIsAuthenticated(true);
        setIsMasterAdmin(true);
        sessionStorage.setItem("is_master_admin", "true");
        setLoginForm({ email: "", password: "" });
        setLoginAttempts(0);
        toast({ title: "Login successful", description: "Master admin access granted" });
        return;
      }

      const loginResult = await loginAdmin(loginForm.email, loginForm.password);
      if (!loginResult.success) {
        throw new Error(loginResult.error || "Login failed");
      }

      const accessToken = loginResult.data?.access_token;
      const refreshToken = loginResult.data?.refresh_token;
      if (!accessToken || !refreshToken) {
        throw new Error("Login completed but no session tokens were returned.");
      }

      const { error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
      if (sessionError) throw sessionError;

      const verifyData = await verifyAdmin(loginForm.email);
      if (verifyData.success && verifyData.data?.isAdmin) {
        setIsAuthenticated(true);
        setLoginForm({ email: "", password: "" });
        setLoginAttempts(0);
        toast({ title: "Login successful", description: "Welcome to the admin dashboard" });
      } else {
        await supabase.auth.signOut();
        throw new Error(verifyData.error || "Unauthorized access");
      }
    } catch (error: any) {
      const message = error?.message || "Login failed";
      const networkIssue = /failed to fetch|network request failed|networkerror|connection refused|abort/i.test(message);
      const displayMessage = networkIssue
        ? "Unable to reach the admin backend. Please check that the backend server is running and reload the page."
        : message;

      const nextAttempts = loginAttempts + 1;
      setLoginAttempts(nextAttempts);
      setLoginError(displayMessage);

      if (nextAttempts >= 2) {
        navigate("/");
      }
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false); setPreAuthPassed(false);
    setIsMasterAdmin(false);
    sessionStorage.removeItem("is_master_admin");
    setLoginForm({ email: "", password: "" }); setLoginError("");
    setPreAuthAnswer(""); setPreAuthError("");
  };

  const handlePreAuth = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPreAuthError("");
    const answer = preAuthAnswer.trim();
    if (answer.toLowerCase() === "revprince" || answer === masterPasswordFromDB) {
      setPreAuthPassed(true); setPreAuthAnswer("");
      if (answer === masterPasswordFromDB) {
        setIsMasterAdmin(true);
        sessionStorage.setItem("is_master_admin", "true");
      }
    } else {
      setPreAuthError("Access denied"); setPreAuthAnswer("");
    }
  };

  const fetchPartnerships = async () => {
    try {
      const { data, error } = await supabase.from('partnerships').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setPartnerships(data || []);
    } catch (error: any) {
      toast({ title: "Error fetching partnerships", description: error.message, variant: "destructive" });
    }
  };

  const fetchStats = async () => {
    try {
      const { data: partnershipData, error: partnershipError } = await supabase.from('partnerships').select('*');
      if (partnershipError) throw partnershipError;
      const partnershipTotal = partnershipData?.length || 0;
      const partnershipTotalAmount = partnershipData?.reduce((sum, p) => sum + (parseFloat(p.amount?.toString() || '0') || 0), 0) || 0;
      const partnershipPending = partnershipData?.filter(p => p.status === 'pending').length || 0;
      const partnershipActive = partnershipData?.filter(p => p.status === 'approved').length || 0;
      const { data: membershipData, error: membershipError } = await supabase.from('membership_requests').select('*');
      if (membershipError) throw membershipError;
      const membershipTotal = membershipData?.length || 0;
      const membershipPending = membershipData?.filter(m => m.status === 'pending').length || 0;
      const membershipApproved = membershipData?.filter(m => m.status === 'approved').length || 0;
      setStats({ totalPartnerships: partnershipTotal, totalAmount: partnershipTotalAmount, pendingApplications: partnershipPending, activePartners: partnershipActive, totalMembers: membershipTotal, pendingMembers: membershipPending, approvedMembers: membershipApproved });
    } catch (error: any) {
      console.error('Error fetching stats:', error);
    }
  };

  const updatePartnershipStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase.from('partnerships').update({ status }).eq('id', id);
      if (error) throw error;
      toast({ title: "Status updated", description: `Partnership ${status} successfully` });
      fetchPartnerships(); fetchStats();
    } catch (error: any) {
      toast({ title: "Error updating status", description: error.message, variant: "destructive" });
    }
  };

  const updateMembershipStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase.from('membership_requests').update({ status }).eq('id', id);
      if (error) throw error;
      toast({ title: "Status updated", description: `Membership ${status} successfully` });
      fetchMembershipRequests(); fetchStats();
    } catch (error: any) {
      toast({ title: "Error updating status", description: error.message, variant: "destructive" });
    }
  };

  const deletePartnership = async (id: string) => {
    if (!confirm("Are you sure you want to delete this partnership?")) return;
    try {
      const { error } = await supabase.from('partnerships').delete().eq('id', id);
      if (error) throw new Error(error.message || 'Failed to delete partnership');
      toast({ title: "Partnership deleted", description: "Entry has been removed successfully" });
      fetchPartnerships(); fetchStats();
    } catch (error: any) {
      toast({ title: "Error deleting partnership", description: error.message || 'Check console for details', variant: "destructive" });
    }
  };

  const deleteMembershipRequest = async (id: string) => {
    if (!confirm("Are you sure you want to delete this membership request?")) return;
    try {
      const { error } = await supabase.from('membership_requests').delete().eq('id', id);
      if (error) throw new Error(error.message || 'Failed to delete membership request');
      toast({ title: "Membership request deleted", description: "Entry has been removed successfully" });
      fetchMembershipRequests(); fetchStats();
    } catch (error: any) {
      toast({ title: "Error deleting membership request", description: error.message || 'Check console for details', variant: "destructive" });
    }
  };

  const deletePrayerRequest = async (id: string) => {
    if (!confirm("Are you sure you want to delete this prayer request?")) return;
    try {
      const { error } = await supabase.from('prayer_requests').delete().eq('id', id);
      if (error) throw new Error(error.message || 'Failed to delete prayer request');
      toast({ title: "Prayer request deleted", description: "Entry has been removed successfully" });
      fetchPrayerRequests(); setSelectedPrayer(null);
    } catch (error: any) {
      toast({ title: "Error deleting prayer request", description: error.message || 'Check console for details', variant: "destructive" });
    }
  };

  const deleteNews = async (id: string) => {
    if (!confirm("Are you sure you want to delete this news item?")) return;
    try {
      const { error } = await supabase.from('news').delete().eq('id', id);
      if (error) throw new Error(error.message || 'Failed to delete news item');
      toast({ title: "News item deleted", description: "Entry has been removed successfully" });
      fetchNews();
    } catch (error: any) {
      toast({ title: "Error deleting news item", description: error.message || 'Check console for details', variant: "destructive" });
    }
  };

  /* ─── Pre-auth gate ─── */
  if (!preAuthPassed) {
    return (
      <div className="admin-page-wrap">
        <style>{adminStyles}</style>
        <div className="admin-bg">
          <div className="admin-bg-orb admin-bg-orb-1" />
          <div className="admin-bg-orb admin-bg-orb-2" />
          <div className="admin-bg-orb admin-bg-orb-3" />
        </div>
        <div className="pre-auth-overlay">
          <div className="pre-auth-card">
            <span className="pre-auth-emoji">🤔</span>
            <h2 className="pre-auth-title">Who sent you here?</h2>
            <form onSubmit={handlePreAuth}>
              <div style={{ position: "relative", marginBottom: "1.2rem" }}>
                <input
                  type="text"
                  className="admin-input"
                  value={preAuthAnswer}
                  onChange={e => setPreAuthAnswer(e.target.value)}
                  placeholder=" "
                  autoFocus
                  required
                  style={{ textAlign: "center", letterSpacing: "0.1em" }}
                /> 
                <label className={`floating-label${preAuthAnswer ? " active" : ""}`} style={{
                  position: "absolute", left: 16,
                  top: preAuthAnswer ? -1 : "50%",
                  transform: preAuthAnswer ? "translateY(-100%)" : "translateY(-50%)",
                  fontSize: preAuthAnswer ? 11 : 14,
                  color: preAuthAnswer ? "#a78bfa" : "rgba(255,255,255,0.35)",
                  textTransform: preAuthAnswer ? "uppercase" : "none",
                  letterSpacing: preAuthAnswer ? "0.05em" : "normal",
                  fontWeight: preAuthAnswer ? 600 : 400,
                  pointerEvents: "none",
                  transition: "all 0.22s",
                  padding: "0 4px", zIndex: 2,
                }}>Enter the answer</label>
              </div>
              {preAuthError && (
                <div className="admin-error">{preAuthError}</div>
              )}
              <RippleButton type="submit">Submit</RippleButton>
            </form>
          </div>
        </div>
      </div>
    );
  }

  /* ─── Login screen ─── */
  if (!isAuthenticated) {
    return (
      <div className="admin-page-wrap">
        <style>{adminStyles}</style>
        <div className="admin-bg">
          <div className="admin-bg-orb admin-bg-orb-1" />
          <div className="admin-bg-orb admin-bg-orb-2" />
          <div className="admin-bg-orb admin-bg-orb-3" />
        </div>
        <div className="admin-split">
          {/* Character */}
          <div className="character-wrap">
            <CharacterSVG />
            <div className="character-bubble">
              <strong>Welcome Back!</strong>
              Sign in to manage your church dashboard ✨
            </div>
          </div>

          {/* Login Card */}
          <div className="admin-card">
            <div className="admin-icon-badge">
              <Lock style={{ width: 28, height: 28, color: "#fff" }} />
            </div>
            <h1 className="admin-card-title">Admin Login</h1>
            <p className="admin-card-sub">Enter your credentials to access the dashboard</p>

            <form onSubmit={handleLogin}>
              {loginError && <div className="admin-error">{loginError}</div>}

              <FloatingInput
                id="email"
                label="Email address"
                type="email"
                value={loginForm.email}
                onChange={v => setLoginForm(prev => ({ ...prev, email: v }))}
                required
              />

              <FloatingInput
                id="password"
                label="Password"
                type="password"
                value={loginForm.password}
                onChange={v => setLoginForm(prev => ({ ...prev, password: v }))}
                required
              />

              <RippleButton type="submit">
                Login to Admin Panel
              </RippleButton>
            </form>

            <div style={{ marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
              <button
                type="button"
                onClick={() => window.location.href = '/'}
                style={{
                  width: "100%",
                  padding: "12px 24px",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "14px",
                  background: "rgba(255,255,255,0.08)",
                  color: "#fff",
                  fontSize: "15px",
                  fontWeight: 700,
                  fontFamily: "'Lato', sans-serif",
                  cursor: "pointer",
                  transition: "all 0.3s",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.12)";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.3)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.08)";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.2)";
                }}
              >
                ← Go Back Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ─── Authenticated Dashboard (updated) ─── */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700 shadow-lg">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl" />
          <div className="absolute -bottom-8 right-1/4 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl" />
        </div>
        
        <div className="w-full px-6 md:px-12 py-8 relative z-10">
          <div className="flex justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">
                Admin Dashboard
              </h1>
              <p className="text-blue-100 text-lg font-medium flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Welcome back, manage your ministry
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                onClick={() => navigate('/admin-master')} 
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95"
              >
                Master Admin
              </Button>
              <Button 
                onClick={handleLogout} 
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-6 md:px-8 lg:px-12 py-12">
        {/* Key Metrics - Top Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {/* Partnerships Card */}
          <div className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-blue-100 hover:border-blue-300">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="p-8 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <CreditCard className="w-7 h-7 text-white" />
                </div>
                <span className="text-xs font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full">Active</span>
              </div>
              <p className="text-slate-600 text-sm font-semibold mb-1">Total Partnerships</p>
              <p className="text-4xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">{stats.totalPartnerships}</p>
              <div className="h-1 bg-gradient-to-r from-blue-200 to-cyan-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 w-3/4" />
              </div>
            </div>
          </div>

          {/* Members Card */}
          <div className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-green-100 hover:border-green-300">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="p-8 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <span className="text-xs font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">{stats.pendingMembers} Pending</span>
              </div>
              <p className="text-slate-600 text-sm font-semibold mb-1">Total Members</p>
              <p className="text-4xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">{stats.totalMembers}</p>
              <div className="h-1 bg-gradient-to-r from-green-200 to-emerald-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 w-2/3" />
              </div>
            </div>
          </div>

          {/* Prayers Card */}
          <div className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-red-100 hover:border-red-300">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br from-red-100 to-pink-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="p-8 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Heart className="w-7 h-7 text-white" />
                </div>
                <span className="text-xs font-bold text-purple-600 bg-purple-100 px-3 py-1 rounded-full">{prayerRequests.filter((p: any) => p.status === 'received').length} New</span>
              </div>
              <p className="text-slate-600 text-sm font-semibold mb-1">Prayer Requests</p>
              <p className="text-4xl font-black bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-2">{prayerRequests.length}</p>
              <div className="h-1 bg-gradient-to-r from-red-200 to-pink-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-red-500 to-pink-500 w-4/5" />
              </div>
            </div>
          </div>

          {/* News Card */}
          <div className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-purple-100 hover:border-purple-300">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="p-8 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
                <span className="text-xs font-bold text-orange-600 bg-orange-100 px-3 py-1 rounded-full">Updated</span>
              </div>
              <p className="text-slate-600 text-sm font-semibold mb-1">News Articles</p>
              <p className="text-4xl font-black bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">{newsItems.length}</p>
              <div className="h-1 bg-gradient-to-r from-purple-200 to-indigo-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 w-1/3" />
              </div>
            </div>
          </div>
        </div>

        {/* Management Cards - Bottom Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Master Admin Card */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-700 to-indigo-800 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 min-h-96">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -right-12 -top-12 w-40 h-40 bg-white rounded-full" />
            </div>
            <div className="p-10 relative z-10 flex flex-col justify-between h-full">
              <div>
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <ShieldAlert className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Master Control</h3>
                <p className="text-purple-100 text-base leading-relaxed">
                  Access high-level administrative tools, manage admin users, and review system logs.
                </p>
              </div>
              <button
                onClick={() => navigate('/admin-master')}
                className="mt-8 w-full bg-white text-purple-700 font-bold py-4 rounded-xl hover:bg-purple-50 transition-all duration-300 hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Enter Master Panel</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Partnerships Manager */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 min-h-96">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -right-12 -top-12 w-40 h-40 bg-white rounded-full" />
            </div>
            <div className="p-10 relative z-10 flex flex-col justify-between h-full">
              <div>
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <CreditCard className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Partnerships</h3>
                <p className="text-blue-100 text-base leading-relaxed">
                  Manage partnership tiers, donations, and donor relationships efficiently.
                </p>
              </div>
              <button
                onClick={() => navigate('/admin-partnerships')}
                className="mt-8 w-full bg-white text-blue-600 font-bold py-4 rounded-xl hover:bg-blue-50 transition-all duration-300 hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Manage</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Memberships Manager */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-600 to-emerald-600 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 min-h-96">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -right-12 -top-12 w-40 h-40 bg-white rounded-full" />
            </div>
            <div className="p-10 relative z-10 flex flex-col justify-between h-full">
              <div>
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Memberships</h3>
                <p className="text-green-100 text-base leading-relaxed">
                  Review and process membership applications from your community.
                </p>
              </div>
              <button
                onClick={() => navigate('/admin-memberships')}
                className="mt-8 w-full bg-white text-green-600 font-bold py-4 rounded-xl hover:bg-green-50 transition-all duration-300 hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Manage</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Prayer Requests Manager */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-600 to-pink-600 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 min-h-96">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -right-12 -top-12 w-40 h-40 bg-white rounded-full" />
            </div>
            <div className="p-10 relative z-10 flex flex-col justify-between h-full">
              <div>
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Heart className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Prayers</h3>
                <p className="text-red-100 text-base leading-relaxed">
                  View and respond to prayer requests from your congregation.
                </p>
              </div>
              <button
                onClick={() => navigate('/admin-prayers')}
                className="mt-8 w-full bg-white text-red-600 font-bold py-4 rounded-xl hover:bg-red-50 transition-all duration-300 hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
              >
                <span>View</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Events Manager */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-600 to-amber-600 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 min-h-96">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -right-12 -top-12 w-40 h-40 bg-white rounded-full" />
            </div>
            <div className="p-10 relative z-10 flex flex-col justify-between h-full">
              <div>
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Calendar className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Events</h3>
                <p className="text-orange-100 text-base leading-relaxed">
                  Manage ministry programs and view member registration lists.
                </p>
              </div>
              <button
                onClick={() => navigate('/admin-events')}
                className="mt-8 w-full bg-white text-orange-600 font-bold py-4 rounded-xl hover:bg-orange-50 transition-all duration-300 hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Manage</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Devotionals Manager */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 min-h-96">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -right-12 -top-12 w-40 h-40 bg-white rounded-full" />
            </div>
            <div className="p-10 relative z-10 flex flex-col justify-between h-full">
              <div>
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Book className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Devotionals</h3>
                <p className="text-orange-100 text-base leading-relaxed">
                  Upload and manage daily devotional images for all 12 months.
                </p>
              </div>
              <button
                onClick={() => navigate('/admin-devotionals')}
                className="mt-8 w-full bg-white text-orange-600 font-bold py-4 rounded-xl hover:bg-orange-50 transition-all duration-300 hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Manage</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* News Manager */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 min-h-96">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -right-12 -top-12 w-40 h-40 bg-white rounded-full" />
            </div>
            <div className="p-12 relative z-10 flex flex-col justify-between h-full">
              <div>
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">News</h3>
                <p className="text-purple-100 text-base leading-relaxed">
                  Create, edit, and publish news articles and updates.
                </p>
              </div>
              <button
                onClick={() => navigate('/admin-news')}
                className="mt-8 w-full bg-white text-purple-600 font-bold py-4 rounded-xl hover:bg-purple-50 transition-all duration-300 hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Manage</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Resources Manager */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 min-h-96">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute -right-12 -top-12 w-40 h-40 bg-white rounded-full" />
              </div>
              <div className="p-12 relative z-10 flex flex-col justify-between h-full">
                <div>
                  <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <BookOpen className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Resources</h3>
                  <p className="text-fuchsia-100 text-base leading-relaxed">
                    Upload files for the resources page and keep your assets organized by category.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/admin-resources')}
                  className="mt-8 w-full bg-white text-violet-600 font-bold py-4 rounded-xl hover:bg-white/90 transition-all duration-300 hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
                >
                  <span>Manage</span>
                  <span>→</span>
                </button>
              </div>
            </div>

          {/* Media Files Manager */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-600 to-cyan-600 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 min-h-96">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute -right-12 -top-12 w-40 h-40 bg-white rounded-full" />
              </div>
              <div className="p-12 relative z-10 flex flex-col justify-between h-full">
                <div>
                  <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Video className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Media Files</h3>
                  <p className="text-cyan-100 text-base leading-relaxed">
                    Manage images and videos used across the site by uploading new media assets.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/admin-media-files')}
                  className="mt-8 w-full bg-white text-teal-600 font-bold py-4 rounded-xl hover:bg-white/90 transition-all duration-300 hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
                >
                  <span>Manage</span>
                  <span>→</span>
                </button>
              </div>
            </div>

          {/* Services Manager */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-700 to-indigo-700 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 min-h-96">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -right-12 -top-12 w-40 h-40 bg-white rounded-full" />
            </div>
            <div className="p-12 relative z-10 flex flex-col justify-between h-full">
              <div>
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Clock className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Services</h3>
                <p className="text-blue-100 text-base leading-relaxed">
                  Manage weekly service times, recurring programs, and live stream links.
                </p>
              </div>
              <button
                onClick={() => navigate('/admin-services')}
                className="mt-8 w-full bg-white text-blue-700 font-bold py-4 rounded-xl hover:bg-blue-50 transition-all duration-300 hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Manage</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Carousel Manager */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-sky-600 to-indigo-600 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 min-h-96">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -right-12 -top-12 w-40 h-40 bg-white rounded-full" />
            </div>
            <div className="p-12 relative z-10 flex flex-col justify-between h-full">
              <div>
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Image className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Carousel</h3>
                <p className="text-sky-100 text-base leading-relaxed">
                  Manage hero carousel images and banners across various pages of the website.
                </p>
              </div>
              <button
                onClick={() => navigate('/admin-carousel')}
                className="mt-8 w-full bg-white text-sky-600 font-bold py-4 rounded-xl hover:bg-sky-50 transition-all duration-300 hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Manage</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats Footer */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
          <h2 className="text-2xl font-bold mb-6 text-slate-800">Quick Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4 pb-6 md:pb-0 md:border-r border-slate-200">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <CreditCard className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <p className="text-slate-600 text-sm">Pending Partnerships</p>
                <p className="text-3xl font-bold text-blue-600">{stats.pendingApplications}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 pb-6 md:pb-0 md:border-r border-slate-200">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <p className="text-slate-600 text-sm">Pending Members</p>
                <p className="text-3xl font-bold text-green-600">{stats.pendingMembers}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <p className="text-slate-600 text-sm">Unread Prayers</p>
                <p className="text-3xl font-bold text-purple-600">{prayerRequests.filter((p: any) => p.status === 'received').length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;

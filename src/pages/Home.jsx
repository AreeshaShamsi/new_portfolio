import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import React from "react";
import About from "./About";
import Whatido from "./Whatido"

/* -- Stars -- */
const STARS = Array.from({ length: 100 }, (_, i) => ({
  id: i,
  size: Math.random() * 2 + 0.5,
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  dur: `${(Math.random() * 4 + 2).toFixed(1)}s`,
  delay: `${(Math.random() * 6).toFixed(1)}s`,
}));

/* --------------------------------------
   THREE.JS NAME CANVAS
-------------------------------------- */
function NameCanvas({ progress }) {
  const mountRef = useRef(null);
  const meshRef = useRef({ meshA: null, meshB: null, originA: 0, originB: 0 });

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const W = el.clientWidth;
    const H = el.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 50);
    camera.position.z = 5;

    function makeWordMesh(word) {
      const measure = document.createElement("canvas");
      const mCtx = measure.getContext("2d");
      mCtx.font = "bold 160px Georgia, serif";
      const tw = mCtx.measureText(word).width;

      const cvs = document.createElement("canvas");
      cvs.width = Math.ceil(tw) + 24;
      cvs.height = 210;
      const ctx = cvs.getContext("2d");

      ctx.font = "bold 160px Georgia, serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const grad = ctx.createLinearGradient(0, 0, cvs.width, 0);
      grad.addColorStop(0.0, "#f1f5f9");
      grad.addColorStop(0.5, "#94a3b8");
      grad.addColorStop(1.0, "#e2e8f0");
      ctx.fillStyle = grad;
      ctx.fillText(word, cvs.width / 2, cvs.height / 2);

      const tex = new THREE.CanvasTexture(cvs);
      const aspect = cvs.width / cvs.height;
      const height = 1.8;
      const geo = new THREE.PlaneGeometry(aspect * height, height);
      const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false });
      return new THREE.Mesh(geo, mat);
    }

    const meshA = makeWordMesh("Areesha");
    const meshB = makeWordMesh("Shamsi");

    const wA = meshA.geometry.parameters.width;
    const wB = meshB.geometry.parameters.width;
    const spacing = 0.10;
    const totalW = wA + spacing + wB;
    const originA = -totalW / 2 + wA / 2;
    const originB = totalW / 2 - wB / 2;

    meshA.position.set(originA, 0, 0);
    meshB.position.set(originB, 0, 0);
    scene.add(meshA, meshB);
    meshRef.current = { meshA, meshB, originA, originB };

    /* Particles */
    const pGeo = new THREE.BufferGeometry();
    const pArr = new Float32Array(160 * 3);
    for (let i = 0; i < 160; i++) {
      pArr[i * 3] = (Math.random() - 0.5) * 18;
      pArr[i * 3 + 1] = (Math.random() - 0.5) * 9;
      pArr[i * 3 + 2] = (Math.random() - 0.5) * 5 - 2;
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(pArr, 3));
    const pMat = new THREE.PointsMaterial({ color: 0x7a8899, size: 0.035, transparent: true, opacity: 0.4 });
    const parts = new THREE.Points(pGeo, pMat);
    scene.add(parts);

    const onResize = () => {
      const w = el.clientWidth, h = el.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    let raf;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      parts.rotation.y += 0.0004;
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => {
    const { meshA, meshB, originA, originB } = meshRef.current;
    if (!meshA || !meshB) return;

    // Map scroll: animation fires in first 40% of scroll zone = feels instant/fast
    const raw = Math.min(Math.max(progress / 0.65, 0), 1);
    // Sharp ease-out: explodes out fast then decelerates
    const e = 1 - Math.pow(1 - raw, 2.0);

    const spread = e * 10.0; // wide horizontal shoot
    const pushZ = e * -1.5; // subtle depth
    const opacity = Math.max(0, 1 - e * 1.0); // fully vanishes

    meshA.position.x = originA - spread;
    meshA.position.z = pushZ;
    meshA.material.opacity = opacity;

    meshB.position.x = originB + spread;
    meshB.position.z = pushZ;
    meshB.material.opacity = opacity;
  }, [progress]);

  return <div ref={mountRef} style={{ width: "100%", height: "200px" }} />;
}

/* --------------------------------------
   MAIN HERO
-------------------------------------- */
export default function PortfolioHero() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(window.scrollY / max, 1) : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const hintOpacity = Math.max(0, 1 - progress * 18);
  const scrollOpacity = Math.max(0, 1 - progress * 18);
  // Everything else fades out as user scrolls - starts fading at 10% scroll, gone by 70%
  const pageOpacity = Math.max(0, 1 - (progress / 0.65) * 1.0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Outfit:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #08090b; font-family: 'Outfit', sans-serif; overflow-x: hidden; }

        @keyframes twinkle     { 0%,100%{opacity:.05} 50%{opacity:.45} }
        @keyframes fadeUp      { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeDown    { from{opacity:0;transform:translateY(-12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes scrollPulse { 0%,100%{opacity:.15} 50%{opacity:.6} }
        @keyframes blobA       { 0%,100%{transform:translate(0,0)} 50%{transform:translate(40px,28px)} }
        @keyframes blobB       { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-36px,-22px)} }

        .an { animation: fadeDown .8s ease .2s  both; }
        .a1 { animation: fadeUp   .8s ease .45s both; }
        .a2 { animation: fadeUp   .8s ease .65s both; }
        .a3 { animation: fadeUp   .8s ease .80s both; }
        .a4 { animation: fadeUp   .8s ease .95s both; }
        .a5 { animation: fadeUp   .8s ease 1.1s both; }
        .a6 { animation: fadeUp   .8s ease 1.25s both; }
        .a7 { animation: fadeUp   .8s ease 1.9s  both; }
        .bA { animation: blobA 14s ease-in-out infinite; }
        .bB { animation: blobB 18s ease-in-out infinite; }

        .nav-link {
          color: #64748b; text-decoration: none; font-size: .72rem;
          letter-spacing: .14em; text-transform: uppercase; font-weight: 500;
          transition: color .25s;
        }
        .nav-link:hover { color: #e2e8f0; }

        .btn-solid {
          background: linear-gradient(135deg,#374151,#1f2937);
          border: 1px solid rgba(148,163,184,.22); color: #e2e8f0;
          font-family: 'Outfit',sans-serif; font-size: .72rem; font-weight: 500;
          letter-spacing: .13em; text-transform: uppercase;
          padding: 13px 32px; border-radius: 2px; cursor: pointer;
          transition: all .25s ease;
          box-shadow: 0 6px 24px rgba(0,0,0,.4), inset 0 1px 0 rgba(255,255,255,.06);
        }
        .btn-solid:hover {
          background: linear-gradient(135deg,#4b5563,#2d3748);
          border-color: rgba(148,163,184,.45);
          transform: translateY(-2px); box-shadow: 0 12px 32px rgba(0,0,0,.5);
        }
        .btn-outline {
          background: transparent; border: 1px solid rgba(148,163,184,.2); color: #94a3b8;
          font-family: 'Outfit',sans-serif; font-size: .72rem; font-weight: 500;
          letter-spacing: .13em; text-transform: uppercase;
          padding: 13px 32px; border-radius: 2px; cursor: pointer;
          transition: all .25s ease;
        }
        .btn-outline:hover {
          border-color: rgba(148,163,184,.45); color: #e2e8f0; transform: translateY(-2px);
        }
        .social-link {
          color: #475569; text-decoration: none; font-size: .72rem;
          letter-spacing: .1em; transition: color .25s;
        }
        .social-link:hover { color: #94a3b8; }

        .scroll-hint {
          font-size: .6rem; letter-spacing: .18em; text-transform: uppercase;
          color: #475569; transition: opacity .2s;
        }
      `}</style>

      <div style={{ height: "150vh" }}>
        <div style={{
          position: "sticky", top: 0, height: "100vh", overflow: "hidden",
          background: "radial-gradient(ellipse 130% 90% at 20% 10%, #252830 0%, #111318 50%, #08090b 100%)",
        }}>

          {/* Stars */}
          {STARS.map(s => (
            <div key={s.id} style={{
              position: "absolute", borderRadius: "50%", background: "#fff",
              width: s.size, height: s.size, top: s.top, left: s.left,
              animation: `twinkle ${s.dur} ease-in-out ${s.delay} infinite`,
              pointerEvents: "none",
            }} />
          ))}

          {/* Blobs */}
          <div className="bA" style={{ position:"absolute", borderRadius:"50%", pointerEvents:"none", width:600, height:400, top:-130, left:-130, background:"radial-gradient(circle,rgba(71,85,105,.22) 0%,transparent 70%)", filter:"blur(80px)" }} />
          <div className="bB" style={{ position:"absolute", borderRadius:"50%", pointerEvents:"none", width:500, height:500, bottom:-120, right:-120, background:"radial-gradient(circle,rgba(51,65,85,.18) 0%,transparent 70%)", filter:"blur(80px)" }} />

          {/* Corner brackets */}
          {[
            { top:16, left:16,  borderTop:"1px solid", borderLeft:"1px solid"   },
            { top:16, right:16, borderTop:"1px solid", borderRight:"1px solid"  },
            { bottom:16, left:16,  borderBottom:"1px solid", borderLeft:"1px solid"  },
            { bottom:16, right:16, borderBottom:"1px solid", borderRight:"1px solid" },
          ].map((s, i) => (
            <div key={i} style={{ position:"absolute", width:32, height:32, borderColor:"rgba(148,163,184,.13)", pointerEvents:"none", ...s }} />
          ))}

          {/* Grain */}
          <div style={{ position:"absolute", inset:0, pointerEvents:"none", opacity:.04,
            backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }} />

          {/* -- Layout -- */}
          <div style={{ display:"flex", flexDirection:"column", height:"100%", position:"relative", zIndex:10, opacity: pageOpacity, transition:"opacity 0.08s linear" }}>

            {/* Navbar */}
            <nav className="an" style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"28px 64px", flexShrink:0 }}>
              <span style={{ fontFamily:"'Playfair Display',serif", color:"#e2e8f0", fontSize:"1.1rem", letterSpacing:".04em" }}>AS</span>
              <ul style={{ display:"flex", gap:40, listStyle:"none" }}>
                {["About","Work","Projects","Contact"].map(l => (
                  <li key={l}><a href="#" className="nav-link">{l}</a></li>
                ))}
              </ul>
            </nav>

            {/* Hero center */}
            <main style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"0 24px" }}>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", width:"100%", maxWidth:960 }}>

                {/* -- Three.js Name -- */}
                <div className="a2" style={{ width:"100%", marginBottom:0 }}>
                  <NameCanvas progress={progress} />
                </div>

                {/* -- Divider -- */}
                <div className="a3" style={{ width:44, height:1, background:"linear-gradient(to right,transparent,rgba(148,163,184,.4),transparent)", marginBottom:20 }} />

                {/* -- Role title -- */}
                <p className="a4" style={{ fontSize:".72rem", letterSpacing:".28em", textTransform:"uppercase", color:"#64748b", fontWeight:500, marginBottom:36 }}>
                  Front End Software Engineer
                </p>

                {/* -- CTA Buttons -- */}
                <div className="a5" style={{ display:"flex", gap:16, flexWrap:"wrap", justifyContent:"center", marginBottom:32 }}>
                  <button className="btn-solid">View My Work</button>
                  <button className="btn-outline">Get In Touch</button>
                </div>

                {/* -- Social links -- */}
                <div className="a6" style={{ display:"flex", gap:32 }}>
                  {["GitHub","LinkedIn","Twitter"].map(s => (
                    <a key={s} href="#" className="social-link">{s}</a>
                  ))}
                </div>

              </div>
            </main>

            {/* -- Scroll indicator -- */}
            <div className="a7" style={{
              display:"flex", flexDirection:"column", alignItems:"center",
              paddingBottom:32, gap:8,
              opacity: scrollOpacity,
              transition: "opacity .2s",
            }}>
              <div style={{
                width:1, height:42,
                background:"linear-gradient(to bottom,transparent,#64748b,transparent)",
                animation:"scrollPulse 2.5s ease-in-out infinite",
              }} />
              <span style={{ fontSize:".58rem", letterSpacing:".2em", textTransform:"uppercase", color:"#475569", opacity:.5 }}>
                Scroll
              </span>
            </div>

          </div>
        </div>
      </div>

      <About />
      <Whatido/>
    </>
  );
}

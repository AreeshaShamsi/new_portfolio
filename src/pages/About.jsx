import { useEffect, useRef, useState } from "react";
import React from "react";

/* ── Animate-in on scroll hook ── */
function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return [ref, visible];
}

export default function About() {
  const [ref1, vis1] = useReveal();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;800&family=Outfit:wght@300;400;500;600&display=swap');
      `}</style>

      <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fafafa] font-['Outfit',sans-serif]">
        
        <div className="absolute top-0 left-1/2 h-px w-[60%] -translate-x-1/2 bg-gradient-to-r from-transparent via-black/15 to-transparent" />

        <div className="pointer-events-none absolute top-[15%] right-[-8%] h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,rgba(0,0,0,0.03)_0%,transparent_70%)] blur-[60px]" />

        <div className="w-full max-w-[1040px] px-[48px]">
          
          <div
            ref={ref1}
            className={`transition-all duration-700 ease-out ${
              vis1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            
            <div className="mb-14 flex items-center gap-4">
              <div className="h-px w-10 bg-gradient-to-r from-transparent to-black/20" />
              <span className="text-[0.65rem] font-medium uppercase tracking-[0.28em] text-stone-500">
                About Me
              </span>
            </div>

            <div className="grid grid-cols-2 items-start gap-[72px]">
              
              <div>
               <h2 className="mb-8 font-['Playfair_Display',serif] text-[clamp(2.2rem,4vw,3.4rem)] font-extrabold leading-[1.1] tracking-[-0.02em] text-stone-900">
  Building things
  <br />
  that actually work.
</h2>

                <div className="mt-6 h-[1.5px] w-12 bg-gradient-to-r from-black/20 to-transparent" />

                {/* THIS moves it down */}
                <p className="mt-8 text-[0.72rem] font-medium uppercase tracking-[0.2em] text-stone-500">
                  Full-Stack Developer
                </p>
              </div>

              <div>
                <p className="mb-5 text-base font-light leading-[1.9] text-stone-600">
                  I'm{" "}
                  <span className="font-medium text-stone-900">
                    Areesha Shamsi
                  </span>
                  , a full-stack developer focused on building scalable web
                  applications and AI-powered products.
                </p>

                <p className="mb-5 text-base font-light leading-[1.9] text-stone-600">
                  I work across the full stack — from clean React interfaces to
                  backend architecture, authentication systems, cloud storage
                  integrations, and payment systems.
                </p>

                <p className="text-base font-light leading-[1.9] text-stone-600">
                  I care about{" "}
                  <span className="font-medium text-stone-700">
                    performance, structure
                  </span>
                  , and building products that are actually usable — not just
                  impressive in demos.
                </p>
              </div>

            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-1/2 h-px w-[60%] -translate-x-1/2 bg-gradient-to-r from-transparent via-black/10 to-transparent" />
      
      </section>
    </>
  );
}
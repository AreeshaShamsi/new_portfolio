import React from "react";

// 👇 Replace this with your actual image import:
// import bgImage from "./assets/your-bg-image.jpg";
const bgImage =
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1600&q=80";

const services = [
  {
    id: 1,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="w-6 h-6"
      >
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    title: "WEB DEVELOPMENT",
    body: (
      <>
        Using HTML, CSS, and JavaScript with pre-processors and build tools such
        as Sass and Grunt, I have a passion for developing pixel-perfect websites
        and apps while maintaining a semantic, modular, and DRY code base.
      </>
    ),
  },
  {
    id: 2,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="w-6 h-6"
      >
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
    title: "RESPONSIVE UI DESIGN",
    body: (
      <>
        <span className="italic font-bold text-white">
          &ldquo;A user interface is like a joke. If you have to explain it,
          it&rsquo;s not that good.&rdquo;
        </span>{" "}
        I strive to develop and implement responsive and aesthetically pleasing
        interfaces for websites and apps that adapt to any type of device,
        platform, or browser.
      </>
    ),
  },
  {
    id: 3,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="w-6 h-6"
      >
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    title: "EXPERIENCE DESIGN",
    body: (
      <>
        There have been far too many times where I&rsquo;ve been trying to
        accomplish a simple task on a website, and ended up wanting to throw my
        computer out the window in frustration. Needless to say, user experience
        is an aspect of software I believe is vital to a successful product.
      </>
    ),
  },
  {
    id: 4,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="w-6 h-6"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
      </svg>
    ),
    title: "DIVERSITY IN TECH",
    body: (
      <>
        Beyond coding, I am a strong advocate for diversity in the tech industry,
        especially for women. I currently serve as President for
        Northeastern&rsquo;s women in tech club,{" "}
        <a
          href="#"
          className="underline underline-offset-2 hover:text-teal-300 transition-colors duration-200"
        >
          NUWIT
        </a>
        , and was a 2016{" "}
        <a
          href="#"
          className="underline underline-offset-2 hover:text-teal-300 transition-colors duration-200"
        >
          Grace Hopper Conference
        </a>{" "}
        Scholar.
      </>
    ),
  },
];

export default function WhatIDo() {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ minHeight: "100vh" }}
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      {/* Dark overlay — adjust rgba alpha to control darkness */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(8, 8, 8, 0.72)" }}
      />

      {/* Page content */}
      <div className="relative z-10 max-w-7xl mx-auto px-10 md:px-20 py-16 md:py-24">
        {/* ── Heading ── */}
        <div className="mb-14">
          <h2
            className="text-5xl md:text-6xl font-bold text-white leading-tight"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            What I Do
          </h2>
          <div className="mt-3 h-px w-16 bg-teal-400" />
        </div>

        {/* ── 2×2 Service Grid ── */}
        <div
          className="grid grid-cols-1 md:grid-cols-2"
          style={{ border: "1px solid rgba(255,255,255,0.18)" }}
        >
          {services.map((service, idx) => {
            const isRightCol = idx % 2 === 1;
            const isBottomRow = idx >= 2;

            return (
              <div
                key={service.id}
                className="flex flex-col gap-5 p-8 md:p-12"
                style={{
                  borderLeft: isRightCol
                    ? "1px solid rgba(255,255,255,0.18)"
                    : "none",
                  borderTop: isBottomRow
                    ? "1px solid rgba(255,255,255,0.18)"
                    : "none",
                }}
              >
                {/* Icon + Title */}
                <div className="flex items-center gap-3">
                  <span className="text-white flex-shrink-0">
                    {service.icon}
                  </span>
                  <h3
                    className="text-white font-extrabold text-sm md:text-sm tracking-widest uppercase"
                    style={{
                      fontFamily: "'Trebuchet MS', Arial, sans-serif",
                      letterSpacing: "0.13em",
                    }}
                  >
                    {service.title}
                  </h3>
                </div>

                {/* Body */}
                <p className="text-white/75 text-sm md:text-base leading-7">
                  {service.body}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
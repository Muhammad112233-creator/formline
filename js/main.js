/* =========================================================
   FORMLINE — main.js
   Vanilla JS, no dependencies. Everything degrades politely.
   ========================================================= */
(function () {
  "use strict";

  var prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  var finePointer = window.matchMedia(
    "(hover: hover) and (pointer: fine)",
  ).matches;

  /* ---------- 1. PRELOADER ---------- */
  var preloader = document.getElementById("preloader");
  var loadCount = document.getElementById("loadCount");
  var loadBar = document.getElementById("loadBar");

  function runPreloader() {
    if (prefersReduced) {
      finishPreloader();
      return;
    }
    var n = 0;
    var tick = setInterval(function () {
      // ease towards 100 with a little randomness so it feels organic
      n += Math.max(1, Math.round((100 - n) * 0.09 + Math.random() * 3));
      if (n >= 100) {
        n = 100;
        clearInterval(tick);
        setTimeout(finishPreloader, 350);
      }
      loadCount.textContent = n;
      loadBar.style.width = n + "%";
    }, 55);
  }

  function finishPreloader() {
    preloader.classList.add("is-done");
    document.body.classList.add("is-ready");
    // kick the hero title once the curtain starts lifting
    setTimeout(function () {
      document
        .querySelectorAll(".hero .split-title, .hero .reveal")
        .forEach(function (el) {
          el.classList.add("in-view");
        });
    }, 250);
    setTimeout(function () {
      preloader.style.display = "none";
    }, 1100);
  }

  /* ---------- 2. CUSTOM CURSOR ---------- */
  var cursor = document.getElementById("cursor");
  var cursorLabel = document.getElementById("cursorLabel");

  if (finePointer && !prefersReduced) {
    document.body.classList.add("has-cursor");

    var mx = -100,
      my = -100,
      rx = -100,
      ry = -100;
    var dot = cursor.querySelector(".cursor__dot");
    var ring = cursor.querySelector(".cursor__ring");

    window.addEventListener("mousemove", function (e) {
      mx = e.clientX;
      my = e.clientY;
    });
    window.addEventListener("mousedown", function () {
      cursor.classList.add("is-down");
    });
    window.addEventListener("mouseup", function () {
      cursor.classList.remove("is-down");
    });

    (function loop() {
      // dot follows instantly, ring lags behind with a lerp
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      dot.style.transform = "translate(" + (mx - 4) + "px," + (my - 4) + "px)";
      ring.style.left = rx + "px";
      ring.style.top = ry + "px";
      requestAnimationFrame(loop);
    })();

    var LABELS = { drag: "Drag", watch: "Watch", none: "" };

    document.addEventListener("mouseover", function (e) {
      var t = e.target.closest("[data-cursor]");
      cursor.classList.remove("is-link", "is-label");
      cursorLabel.textContent = "";
      if (!t) return;
      var kind = t.getAttribute("data-cursor");
      if (kind === "link") {
        cursor.classList.add("is-link");
      } else if (LABELS[kind]) {
        cursor.classList.add("is-label");
        cursorLabel.textContent = LABELS[kind];
      }
    });
  }

  /* ---------- 3. LETTER-ROLL BUTTONS ---------- */
  // Wrap each character in a pair of stacked spans so the label
  // "rolls" upward on hover, one letter after the next.
  document.querySelectorAll(".btn__label").forEach(function (label) {
    var text = label.textContent;
    label.textContent = "";
    var idx = 0;
    text.split("").forEach(function (ch) {
      var span = document.createElement("span");
      span.className = "char" + (ch === " " ? " space" : "");
      span.style.setProperty("--i", idx++);
      if (ch !== " ") {
        var a = document.createElement("i");
        a.textContent = ch;
        var b = document.createElement("i");
        b.textContent = ch;
        span.appendChild(a);
        span.appendChild(b);
      }
      label.appendChild(span);
    });
  });

  /* ---------- 4. SPLIT-TITLE HEADINGS ---------- */
  // Split into words, then characters, so lines never break mid-word.
  document.querySelectorAll(".split-title").forEach(function (title) {
    var words = title.innerHTML.split(/<br\s*\/?>/i).map(function (line) {
      return line.replace(/&rsquo;/g, "\u2019").replace(/&amp;/g, "&");
    });
    title.innerHTML = "";
    var charIndex = 0;
    words.forEach(function (line, li) {
      if (li > 0) title.appendChild(document.createElement("br"));
      line
        .trim()
        .split(/\s+/)
        .forEach(function (word, wi, arr) {
          var w = document.createElement("span");
          w.className = "w";
          word.split("").forEach(function (ch) {
            var c = document.createElement("span");
            c.className = "c";
            c.style.setProperty("--i", charIndex++);
            c.textContent = ch;
            w.appendChild(c);
          });
          title.appendChild(w);
          if (wi < arr.length - 1)
            title.appendChild(document.createTextNode(" "));
        });
    });
  });

  /* ---------- 5. SCROLL REVEALS ---------- */
  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -40px 0px" },
  );

  document.querySelectorAll(".reveal, .split-title").forEach(function (el) {
    // hero handles its own timing after the preloader
    if (!el.closest(".hero")) io.observe(el);
  });

  /* ---------- 6. NAV: hide on scroll down, solid after hero ---------- */
  var nav = document.getElementById("nav");
  var lastY = 0;
  window.addEventListener(
    "scroll",
    function () {
      var y = window.scrollY;
      nav.classList.toggle("is-solid", y > 60);
      if (y > 500 && y > lastY) nav.classList.add("is-hidden");
      else nav.classList.remove("is-hidden");
      lastY = y;
    },
    { passive: true },
  );

  /* ---------- 7. MOBILE MENU ---------- */
  var burger = document.getElementById("burger");
  var mobmenu = document.getElementById("mobmenu");
  burger.addEventListener("click", function () {
    var open = mobmenu.classList.toggle("is-open");
    burger.classList.toggle("is-open", open);
    document.body.style.overflow = open ? "hidden" : "";
  });
  mobmenu.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      mobmenu.classList.remove("is-open");
      burger.classList.remove("is-open");
      document.body.style.overflow = "";
    });
  });

  /* ---------- 8. DRAGGABLE HERO CARDS ---------- */
  document.querySelectorAll(".hero-card").forEach(function (card) {
    var ox = 0,
      oy = 0,
      sx = 0,
      sy = 0,
      dragging = false;

    card.addEventListener("pointerdown", function (e) {
      dragging = true;
      card.classList.add("is-dragging");
      card.setPointerCapture(e.pointerId);
      sx = e.clientX - ox;
      sy = e.clientY - oy;
    });
    card.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      ox = e.clientX - sx;
      oy = e.clientY - sy;
      card.style.transform = "translate(" + ox + "px," + oy + "px)";
    });
    ["pointerup", "pointercancel"].forEach(function (evt) {
      card.addEventListener(evt, function () {
        dragging = false;
        card.classList.remove("is-dragging");
      });
    });
  });

  /* ---------- 9. TOOLKIT TABS + FAKE APP ---------- */
  var tabs = document.querySelectorAll(".toolkit__tab");
  var frames = document.querySelectorAll(".app__frame");
  var layers = document.querySelectorAll(".app-layer");
  var badge = document.getElementById("appBadge");
  var promptText = document.getElementById("promptText");

  var PROMPTS = [
    "Loose sketch, keep the linework raw",
    "Render in matte bone white, brass hardware, soft studio light",
    "Give me four colorways: sage, terracotta, navy, cream",
    "Final pass. Tighten seams, export for tooling",
  ];

  var currentTab = 0;
  var typeTimer = null;
  var autoTimer = null;

  function typePrompt(text) {
    clearInterval(typeTimer);
    promptText.textContent = "";
    if (prefersReduced) {
      promptText.textContent = text;
      return;
    }
    var i = 0;
    typeTimer = setInterval(function () {
      promptText.textContent = text.slice(0, ++i);
      if (i >= text.length) clearInterval(typeTimer);
    }, 26);
  }

  function setTab(n) {
    currentTab = n;
    tabs.forEach(function (t, i) {
      t.classList.toggle("is-active", i === n);
    });
    frames.forEach(function (f) {
      f.classList.toggle("is-active", +f.getAttribute("data-frame") === n);
    });
    layers.forEach(function (l, i) {
      l.classList.toggle("is-active", layers.length - 1 - i <= n);
    });
    badge.classList.toggle("is-on", n === 3);
    typePrompt(PROMPTS[n]);
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener("click", function () {
      setTab(i);
      restartAuto();
    });
  });

  function restartAuto() {
    clearInterval(autoTimer);
    if (prefersReduced) return;
    autoTimer = setInterval(function () {
      setTab((currentTab + 1) % tabs.length);
    }, 5200);
  }

  // only start cycling when the app UI scrolls into view
  var appUI = document.getElementById("appUI");
  new IntersectionObserver(
    function (entries, obs) {
      if (entries[0].isIntersecting) {
        setTab(0);
        restartAuto();
        obs.disconnect();
      }
    },
    { threshold: 0.3 },
  ).observe(appUI);

  document.getElementById("appGenerate").addEventListener("click", function () {
    setTab((currentTab + 1) % tabs.length);
    restartAuto();
  });

  /* ---------- 10. ITERATE WIDGETS ---------- */
  // Palette swatches
  var swatches = document.querySelectorAll(".swatch");
  swatches.forEach(function (s) {
    s.addEventListener("click", function () {
      swatches.forEach(function (x) {
        x.classList.remove("is-active");
      });
      s.classList.add("is-active");
    });
  });

  // New-view angles rotate the image
  var tiltImg = document.getElementById("tiltImg");
  document.querySelectorAll(".angle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".angle").forEach(function (x) {
        x.classList.remove("is-active");
      });
      btn.classList.add("is-active");
      var deg = parseInt(btn.textContent, 10) || 0;
      tiltImg.style.transform =
        "rotateY(" + deg + "deg) scale(" + (deg % 180 === 0 ? 1 : 0.9) + ")";
    });
  });

  // Animate-card prompt cycles through a few lines
  var animPrompt = document.getElementById("animPrompt");
  var ANIM_LINES = [
    "Make the lamp glow, then slowly rotate",
    "Dim the room, keep the amber warm",
    "Pan around it, half a turn, gentle",
  ];
  if (!prefersReduced) {
    var lineIdx = 0;
    setInterval(function () {
      lineIdx = (lineIdx + 1) % ANIM_LINES.length;
      animPrompt.style.opacity = 0;
      setTimeout(function () {
        animPrompt.textContent = ANIM_LINES[lineIdx];
        animPrompt.style.opacity = 1;
      }, 300);
    }, 4200);
    animPrompt.style.transition = "opacity .3s";
  }

  /* ---------- 11. STORY MODAL ---------- */
  var modal = document.getElementById("modal");
  var modalImg = document.getElementById("modalImg");
  var modalTitle = document.getElementById("modalTitle");
  var modalDesc = document.getElementById("modalDesc");
  var modalTime = document.getElementById("modalTime");

  document.querySelectorAll(".story").forEach(function (story) {
    story.addEventListener("click", function () {
      modalImg.src = story.getAttribute("data-img");
      modalImg.alt = story.getAttribute("data-title");
      modalTitle.textContent = story.getAttribute("data-title");
      modalDesc.textContent = story.getAttribute("data-desc");
      modalTime.textContent = "00:00 / " + story.getAttribute("data-length");
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    });
  });

  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
  document.getElementById("modalClose").addEventListener("click", closeModal);
  document
    .getElementById("modalBackdrop")
    .addEventListener("click", closeModal);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeModal();
  });

  /* ---------- 12. FAQ: animated open/close ---------- */
  document.querySelectorAll(".faq__item").forEach(function (item) {
    var summary = item.querySelector("summary");
    var body = item.querySelector(".faq__body");
    summary.addEventListener("click", function (e) {
      if (prefersReduced) return; // let the native toggle handle it
      e.preventDefault();
      if (item.open) {
        body.style.height = body.scrollHeight + "px";
        requestAnimationFrame(function () {
          body.style.transition = "height .4s cubic-bezier(.22,1,.36,1)";
          body.style.height = "0px";
        });
        body.addEventListener("transitionend", function done() {
          item.open = false;
          body.style.height = "";
          body.style.transition = "";
          body.removeEventListener("transitionend", done);
        });
      } else {
        item.open = true;
        var h = body.scrollHeight;
        body.style.height = "0px";
        requestAnimationFrame(function () {
          body.style.transition = "height .4s cubic-bezier(.22,1,.36,1)";
          body.style.height = h + "px";
        });
        body.addEventListener("transitionend", function done() {
          body.style.height = "";
          body.style.transition = "";
          body.removeEventListener("transitionend", done);
        });
      }
    });
  });

  /* ---------- 13. LIGHT PARALLAX ---------- */
  var parallaxEls = document.querySelectorAll("[data-speed]");
  if (parallaxEls.length && !prefersReduced) {
    window.addEventListener(
      "scroll",
      function () {
        var y = window.scrollY;
        parallaxEls.forEach(function (el) {
          var rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            var speed = parseFloat(el.getAttribute("data-speed"));
            el.style.transform =
              "translateY(" +
              (rect.top - window.innerHeight / 2) * speed +
              "px)";
          }
        });
      },
      { passive: true },
    );
  }

  /* ---------- 14. FOOTER YEAR ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- GO ---------- */
  runPreloader();
})();

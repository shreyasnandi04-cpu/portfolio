(function () {
  const doc = document.documentElement;
  const nav = document.getElementById("siteNav");
  const scrollProgress = document.getElementById("scrollProgress");
  const menuButton = document.getElementById("menuButton");
  const mobileNav = document.getElementById("mobileNav");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (nav || scrollProgress) {
    let scrollFrame = null;
    const updateScrollUi = () => {
      scrollFrame = null;
      if (nav) nav.classList.toggle("scrolled", window.scrollY > 24);
      if (scrollProgress) {
        const maxScroll = Math.max(doc.scrollHeight - window.innerHeight, 1);
        const progress = Math.min(window.scrollY / maxScroll, 1);
        scrollProgress.style.transform = `scaleX(${progress.toFixed(4)})`;
      }
    };
    const scheduleScrollUi = () => {
      if (scrollFrame) return;
      scrollFrame = requestAnimationFrame(updateScrollUi);
    };
    updateScrollUi();
    window.addEventListener("scroll", scheduleScrollUi, { passive: true });
    window.addEventListener("resize", scheduleScrollUi, { passive: true });
  }

  if (menuButton && mobileNav) {
    menuButton.addEventListener("click", () => {
      const open = mobileNav.classList.toggle("open");
      menuButton.classList.toggle("open", open);
      menuButton.setAttribute("aria-expanded", String(open));
    });

    mobileNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileNav.classList.remove("open");
        menuButton.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
      });
    });
  }

  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealItems.forEach((item, index) => {
      item.style.transitionDelay = `${Math.min(index % 6, 5) * 45}ms`;
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach((item) => item.classList.add("visible"));
  }

  const counters = document.querySelectorAll("[data-count]");
  const animateCounter = (el) => {
    if (el.dataset.done) return;
    el.dataset.done = "true";
    const target = Number.parseInt(el.dataset.count || "0", 10);
    const start = performance.now();
    const duration = 1200;

    const tick = (time) => {
      const progress = Math.min((time - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      el.textContent = String(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if ("IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((counter) => counterObserver.observe(counter));
  } else {
    counters.forEach(animateCounter);
  }

  const navLinks = [...document.querySelectorAll(".desktop-nav a[href^='#']")];
  const navIndicator = document.getElementById("navIndicator");
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (sections.length) {
    const positionNavIndicator = (link) => {
      if (!navIndicator || !link || !link.offsetParent) return;
      navIndicator.style.width = `${link.offsetWidth}px`;
      navIndicator.style.transform = `translateX(${link.offsetLeft}px)`;
      navIndicator.style.opacity = "1";
    };

    const updateActiveNav = () => {
      const y = window.scrollY + 140;
      let activeId = sections[0].id;
      sections.forEach((section) => {
        if (section.offsetTop <= y) activeId = section.id;
      });
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${activeId}`);
      });
      positionNavIndicator(navLinks.find((link) => link.classList.contains("active")));
    };

    navLinks.forEach((link) => {
      link.addEventListener("mouseenter", () => positionNavIndicator(link));
    });
    navIndicator?.parentElement?.addEventListener("mouseleave", () => {
      positionNavIndicator(navLinks.find((link) => link.classList.contains("active")));
    });
    updateActiveNav();
    window.addEventListener("scroll", updateActiveNav, { passive: true });
    window.addEventListener("resize", updateActiveNav, { passive: true });
  }

  if (!reduceMotion) {
    document.querySelectorAll("[data-tilt]").forEach((card) => {
      let frame = null;
      const reset = () => {
        card.style.transform = "";
      };
      card.addEventListener("mousemove", (event) => {
        if (window.innerWidth < 860) return;
        const rect = card.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;
        if (frame) cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          card.style.transform = `perspective(900px) rotateX(${(-py * 4).toFixed(2)}deg) rotateY(${(px * 5).toFixed(2)}deg) translateY(-2px)`;
        });
      });
      card.addEventListener("mouseleave", reset);
      card.addEventListener("blur", reset);
    });
  }

  const pingForm = document.getElementById("pingDemoForm");
  const pingInput = document.getElementById("pingDemoInput");
  const pingStream = document.getElementById("pingChatStream");
  const pingQuestion = document.getElementById("pingQuestion");
  const pingReply = document.getElementById("pingReply");
  const pingExample = document.getElementById("pingExample");
  const pingTranslation = document.getElementById("pingTranslation");
  const pingPrompts = [...document.querySelectorAll("[data-ping-prompt]")];

  if (pingForm && pingInput && pingStream && pingQuestion && pingReply && pingExample && pingTranslation) {
    const pingAnswers = {
      word: {
        question: "What does ‘der Bahnhof’ mean?",
        reply: "Der Bahnhof means ‘the train station’. It is masculine, so the article is der.",
        example: "Der Bahnhof ist gleich um die Ecke.",
        translation: "The station is just around the corner.",
      },
      tip: {
        question: "What should I practise next?",
        reply: "Your article accuracy is improving. Do one short der · die · das round, then return to this lesson.",
        example: "der Bahnhof · die Straße · das Ticket",
        translation: "the station · the street · the ticket",
      },
      wrong: {
        question: "Why was my sentence wrong?",
        reply: "The meaning was clear. German usually places the time before the destination in this sentence.",
        example: "Ich fahre morgen nach Berlin.",
        translation: "I am travelling to Berlin tomorrow.",
      },
      speak: {
        question: "Can you help me say this naturally?",
        reply: "Keep ‘morgen’ light, then stress ‘Berlin’. Use the audio control to hear the full phrase again.",
        example: "Ich fahre morgen nach Berlin.",
        translation: "I am travelling to Berlin tomorrow.",
      },
    };

    const choosePingAnswer = (question) => {
      const text = question.toLowerCase();
      if (/wrong|why|mistake|correct/.test(text)) return pingAnswers.wrong;
      if (/tip|next|practise|practice|study/.test(text)) return pingAnswers.tip;
      if (/say|speak|sound|pronounc/.test(text)) return pingAnswers.speak;
      return pingAnswers.word;
    };

    const showPingAnswer = (answer, promptKey = "") => {
      pingQuestion.textContent = answer.question;
      pingStream.classList.add("responding");
      pingPrompts.forEach((button) => button.classList.toggle("active", button.dataset.pingPrompt === promptKey));
      window.setTimeout(() => {
        pingReply.textContent = answer.reply;
        pingExample.textContent = answer.example;
        pingTranslation.textContent = answer.translation;
        pingStream.classList.remove("responding");
      }, reduceMotion ? 0 : 260);
    };

    pingPrompts.forEach((button) => {
      button.addEventListener("click", () => showPingAnswer(pingAnswers[button.dataset.pingPrompt], button.dataset.pingPrompt));
    });

    pingForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const question = pingInput.value.trim();
      if (!question) {
        pingInput.focus();
        return;
      }
      const answer = { ...choosePingAnswer(question), question };
      showPingAnswer(answer);
      pingInput.value = "";
    });
  }

  const canvas = document.getElementById("motionCanvas");
  if (!canvas || reduceMotion) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let points = [];
  let pointer = { x: -1000, y: -1000 };

  const speakUpPage = document.body.classList.contains("site-speakup");
  const homePage = document.body.classList.contains("home-redesign");
  const getPalette = () => {
    if (speakUpPage) {
      return [
        [233, 166, 60],
        [105, 185, 137],
        [111, 159, 206],
        [201, 130, 115],
        [246, 207, 140],
      ];
    }
    if (homePage) {
      return [
        [195, 139, 53],
        [102, 128, 110],
        [110, 135, 163],
        [166, 110, 100],
        [72, 61, 50],
      ];
    }
    return doc.dataset.theme === "dark"
      ? [
          [220, 173, 95],
          [209, 154, 89],
          [163, 173, 140],
          [189, 146, 154],
          [236, 204, 145],
        ]
      : [
          [111, 74, 44],
          [198, 150, 67],
          [155, 105, 47],
          [104, 113, 87],
          [122, 91, 96],
        ];
  };

  const resize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const palette = getPalette();
    const count = Math.min(88, Math.max(34, Math.floor((width * height) / 23000)));
    points = Array.from({ length: count }, (_, index) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      r: 1.2 + Math.random() * 1.8,
      color: palette[index % palette.length],
    }));
  };

  const draw = () => {
    ctx.clearRect(0, 0, width, height);

    for (const point of points) {
      point.x += point.vx;
      point.y += point.vy;

      const dx = point.x - pointer.x;
      const dy = point.y - pointer.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 120 && dist > 0.1) {
        const force = (120 - dist) / 120;
        point.x += (dx / dist) * force * 1.2;
        point.y += (dy / dist) * force * 1.2;
      }

      if (point.x < -20) point.x = width + 20;
      if (point.x > width + 20) point.x = -20;
      if (point.y < -20) point.y = height + 20;
      if (point.y > height + 20) point.y = -20;
    }

    for (let i = 0; i < points.length; i += 1) {
      for (let j = i + 1; j < points.length; j += 1) {
        const a = points[i];
        const b = points[j];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < 150) {
          const darkTheme = doc.dataset.theme === "dark";
          const alpha = (1 - dist / 150) * (darkTheme ? 0.22 : 0.15);
          const lineColor = speakUpPage
            ? "105, 185, 137"
            : homePage
              ? "102, 128, 110"
              : darkTheme
                ? "220, 173, 95"
                : "111, 74, 44";
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${lineColor}, ${alpha.toFixed(3)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    for (const point of points) {
      const [r, g, b] = point.color;
      ctx.beginPath();
      ctx.arc(point.x, point.y, point.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.42)`;
      ctx.fill();
    }

    requestAnimationFrame(draw);
  };

  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener(
    "mousemove",
    (event) => {
      pointer = { x: event.clientX, y: event.clientY };
    },
    { passive: true }
  );
  window.addEventListener("mouseleave", () => {
    pointer = { x: -1000, y: -1000 };
  });

  resize();
  draw();
})();

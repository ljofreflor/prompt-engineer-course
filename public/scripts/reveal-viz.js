/**
 * Ilustraciones D3 (+ GSAP cuando está) para clases (identidad UAI).
 * Cada slide con [data-viz] se monta al entrar (slidechanged) y anima una vez.
 * Stack: D3 = geometría; GSAP = timeline cine (fallback a d3.transition).
 */
(function (global) {
  "use strict";

  var COLORS = {
    negro: "#15171a",
    primary: "#00afd8",
    primaryDark: "#007fb5",
    soft: "#f3f5f7",
    gray: "#616365",
    border: "#e5e7eb",
    white: "#ffffff",
  };

  var mounted = new WeakSet();
  var MOTION = !(
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  var gsap = global.gsap;
  var HAS_GSAP = !!(gsap && typeof gsap.timeline === "function");

  function tDelay(ms) {
    return MOTION ? ms : 0;
  }
  function tDur(ms) {
    return MOTION ? ms : 0;
  }

  /** Cinematic timeline; no-ops under reduced motion (instant state). */
  function cineTl(opts) {
    if (!HAS_GSAP || !MOTION) return null;
    return gsap.timeline(opts || { defaults: { ease: "power2.out" } });
  }

  /**
   * After a viz draws (often with d3.transition), replay enter with GSAP:
   * interrupt D3, hide shapes, stagger fade+rise. Skip if host has data-cine="manual".
   */
  function enhanceCine(host) {
    if (!HAS_GSAP || !MOTION || !host) return;
    if (host.getAttribute("data-cine") === "manual") return;
    var svg = host.querySelector("svg");
    if (!svg) return;
    d3.select(svg).selectAll("*").interrupt();
    var tags = {
      rect: 1,
      path: 1,
      circle: 1,
      line: 1,
      text: 1,
      polyline: 1,
      polygon: 1,
      ellipse: 1,
    };
    var nodes = Array.prototype.slice.call(svg.querySelectorAll("*")).filter(function (n) {
      if (!tags[n.tagName]) return false;
      if (n.closest("defs")) return false;
      return true;
    });
    if (!nodes.length) return;
    gsap.killTweensOf(nodes);
    // opacity only — SVG `y` attrs must not fight GSAP transforms
    gsap.set(nodes, { opacity: 0 });
    gsap.to(nodes, {
      opacity: 1,
      duration: 0.45,
      stagger: 0.045,
      ease: "power2.out",
      delay: 0.05,
      overwrite: true,
    });
  }

  /** Mark host so enhanceCine does not double-play a bespoke timeline. */
  function cineManual(host) {
    if (host && host.setAttribute) host.setAttribute("data-cine", "manual");
  }

  function clear(el) {
    while (el.firstChild) el.removeChild(el.firstChild);
  }

  function svgRoot(el, w, h) {
    clear(el);
    return d3
      .select(el)
      .append("svg")
      .attr("viewBox", "0 0 " + w + " " + h)
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("role", "img");
  }

  function label(sel, x, y, text, opts) {
    opts = opts || {};
    return sel
      .append("text")
      .attr("x", x)
      .attr("y", y)
      .attr("text-anchor", opts.anchor || "middle")
      .attr("fill", opts.fill || COLORS.negro)
      .attr("font-family", "Roboto, system-ui, sans-serif")
      .attr("font-size", opts.size || 14)
      .attr("font-weight", opts.weight || 500)
      .attr("opacity", 0)
      .text(text)
      .transition()
      .delay(tDelay(opts.delay || 0))
      .duration(tDur(450))
      .attr("opacity", 1);
  }

  /** Ciclo ReAct: Thought → Action → Observation (+ finish). */
  function vizReactLoop(el) {
    cineManual(el);
    var w = 920;
    var h = 380;
    var svg = svgRoot(el, w, h);
    svg.append("title").text("Ciclo ReAct: Thought, Action, Observation y Finish");

    var nodes = [
      { id: "thought", label: "Thought", x: 200, y: 120 },
      { id: "action", label: "Action", x: 460, y: 120 },
      { id: "obs", label: "Observation", x: 720, y: 120 },
      { id: "finish", label: "Finish", x: 460, y: 300 },
    ];

    var links = [
      { s: 0, t: 1 },
      { s: 1, t: 2 },
      { s: 2, t: 0, loop: true },
      { s: 0, t: 3, finish: true },
    ];

    svg
      .append("defs")
      .append("marker")
      .attr("id", "uai-arrow")
      .attr("viewBox", "0 0 10 10")
      .attr("refX", 9)
      .attr("refY", 5)
      .attr("markerWidth", 7)
      .attr("markerHeight", 7)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M 0 0 L 10 5 L 0 10 z")
      .attr("fill", COLORS.primary);

    var gLinks = svg.append("g");
    var gNodes = svg.append("g");
    var pathEls = [];
    var nodeGroups = [];

    links.forEach(function (L) {
      var a = nodes[L.s];
      var b = nodes[L.t];
      var path;
      if (L.loop) {
        path =
          "M" +
          (a.x - 40) +
          "," +
          (a.y + 36) +
          " C " +
          (a.x - 120) +
          "," +
          (a.y + 140) +
          " " +
          (b.x + 120) +
          "," +
          (b.y + 140) +
          " " +
          (b.x + 40) +
          "," +
          (b.y + 36);
      } else if (L.finish) {
        path = "M" + a.x + "," + (a.y + 36) + " L " + b.x + "," + (b.y - 36);
      } else {
        path = "M" + (a.x + 70) + "," + a.y + " L " + (b.x - 70) + "," + b.y;
      }
      var p = gLinks
        .append("path")
        .attr("d", path)
        .attr("fill", "none")
        .attr("stroke", L.finish ? COLORS.primaryDark : COLORS.primary)
        .attr("stroke-width", L.finish ? 2.5 : 2)
        .attr("stroke-dasharray", L.loop ? "6 4" : null)
        .attr("opacity", 0)
        .attr("marker-end", "url(#uai-arrow)");
      pathEls.push(p.node());
    });

    nodes.forEach(function (n) {
      var g = gNodes.append("g").attr("transform", "translate(" + n.x + "," + n.y + ")");
      g.append("rect")
        .attr("x", -70)
        .attr("y", -28)
        .attr("width", 140)
        .attr("height", 56)
        .attr("rx", 2)
        .attr("fill", n.id === "finish" ? COLORS.primary : COLORS.soft)
        .attr("stroke", COLORS.negro)
        .attr("stroke-width", n.id === "finish" ? 0 : 1.5);
      g.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .attr("fill", n.id === "finish" ? COLORS.white : COLORS.negro)
        .attr("font-family", "Roboto, system-ui, sans-serif")
        .attr("font-weight", 800)
        .attr("font-size", 16)
        .text(n.label);
      nodeGroups.push(g.node());
    });

    var tl = cineTl();
    if (tl) {
      var capEl = svg
        .append("text")
        .attr("x", 460)
        .attr("y", 28)
        .attr("text-anchor", "middle")
        .attr("fill", COLORS.gray)
        .attr("font-family", "Roboto, system-ui, sans-serif")
        .attr("font-size", 13)
        .attr("font-weight", 500)
        .attr("opacity", 0)
        .text("Presupuesto: pasos · tiempo · costo")
        .node();
      gsap.set(nodeGroups, { opacity: 0, scale: 0.82, transformOrigin: "50% 50%" });
      gsap.set(pathEls, { opacity: 0 });
      tl.to(nodeGroups, { opacity: 1, scale: 1, duration: 0.45, stagger: 0.14 }, 0.05)
        .to(pathEls, { opacity: 1, duration: 0.4, stagger: 0.16 }, 0.35)
        .to(capEl, { opacity: 1, duration: 0.35 }, 0.95);
    } else {
      pathEls.forEach(function (pe, i) {
        d3.select(pe)
          .transition()
          .delay(tDelay(200 + i * 180))
          .duration(tDur(500))
          .attr("opacity", 1);
      });
      nodeGroups.forEach(function (ng, i) {
        d3.select(ng)
          .select("rect")
          .attr("opacity", 0)
          .attr("transform", "scale(0.85)")
          .transition()
          .delay(tDelay(80 + i * 120))
          .duration(tDur(450))
          .attr("opacity", 1)
          .attr("transform", "scale(1)");
        d3.select(ng)
          .select("text")
          .attr("opacity", 0)
          .transition()
          .delay(tDelay(160 + i * 120))
          .duration(tDur(400))
          .attr("opacity", 1);
      });
      label(svg, 460, 28, "Presupuesto: pasos · tiempo · costo", {
        size: 13,
        fill: COLORS.gray,
        weight: 500,
        delay: 900,
      });
    }
  }

  /** Generación autorregresiva: tokens que se acumulan. */
  function vizAutoregressive(el) {
    var w = 920;
    var h = 360;
    var svg = svgRoot(el, w, h);
    svg.append("title").text("Generación autorregresiva token a token");

    var tokens = [
      { t: "El", ctx: true },
      { t: "modelo", ctx: true },
      { t: "predice", ctx: true },
      { t: "x_t", next: true },
    ];
    var startX = 140;
    var y = 170;
    var gap = 160;

    tokens.forEach(function (tok, i) {
      var g = svg.append("g").attr("transform", "translate(" + (startX + i * gap) + "," + y + ")");
      g.append("rect")
        .attr("x", -56)
        .attr("y", -32)
        .attr("width", 112)
        .attr("height", 64)
        .attr("rx", 2)
        .attr("fill", tok.next ? COLORS.primary : COLORS.soft)
        .attr("stroke", COLORS.negro)
        .attr("stroke-width", 1.5)
        .attr("opacity", 0)
        .attr("y", -12)
        .transition()
        .delay(tDelay(140 * i))
        .duration(tDur(420))
        .attr("opacity", 1)
        .attr("y", -32);
      g.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .attr("font-family", "Roboto, system-ui, sans-serif")
        .attr("font-weight", tok.next ? 800 : 500)
        .attr("font-size", 17)
        .attr("fill", tok.next ? COLORS.white : COLORS.negro)
        .attr("opacity", 0)
        .text(tok.t)
        .transition()
        .delay(tDelay(160 * i))
        .duration(tDur(400))
        .attr("opacity", 1);

      if (i < tokens.length - 1) {
        svg
          .append("path")
          .attr("d", "M" + (startX + i * gap + 60) + "," + y + " L" + (startX + (i + 1) * gap - 60) + "," + y)
          .attr("stroke", COLORS.primary)
          .attr("stroke-width", 2.5)
          .attr("opacity", 0)
          .attr("marker-end", "url(#uai-arrow-ar)")
          .transition()
          .delay(tDelay(200 + 140 * i))
          .duration(tDur(350))
          .attr("opacity", 1);
      }
    });

    svg
      .append("defs")
      .append("marker")
      .attr("id", "uai-arrow-ar")
      .attr("viewBox", "0 0 10 10")
      .attr("refX", 9)
      .attr("refY", 5)
      .attr("markerWidth", 7)
      .attr("markerHeight", 7)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M 0 0 L 10 5 L 0 10 z")
      .attr("fill", COLORS.primary);

    label(svg, 460, 56, "P(x_t | contexto) — cada paso condiciona al siguiente", {
      size: 15,
      weight: 700,
      fill: COLORS.negro,
      delay: 200,
    });
    label(svg, 460, 280, "Errores tempranos se propagan; el formato se decide paso a paso", {
      size: 13,
      fill: COLORS.gray,
      delay: 750,
    });
  }

  /** Topología multiagente simple: supervisor → especialistas. */
  function vizMultiagent(el) {
    var w = 920;
    var h = 380;
    var svg = svgRoot(el, w, h);
    svg.append("title").text("Topología supervisor con agentes especialistas");

    var nodes = [
      { id: "sup", label: "Supervisor", x: 460, y: 80 },
      { id: "a", label: "Agente A", x: 200, y: 260 },
      { id: "b", label: "Agente B", x: 460, y: 260 },
      { id: "c", label: "Agente C", x: 720, y: 260 },
    ];

    nodes.forEach(function (n, i) {
      var g = svg.append("g").attr("transform", "translate(" + n.x + "," + n.y + ")");
      g.append("rect")
        .attr("x", -72)
        .attr("y", -28)
        .attr("width", 144)
        .attr("height", 56)
        .attr("rx", 2)
        .attr("fill", n.id === "sup" ? COLORS.negro : COLORS.soft)
        .attr("stroke", n.id === "sup" ? COLORS.negro : COLORS.primary)
        .attr("stroke-width", 2)
        .attr("opacity", 0)
        .transition()
        .delay(tDelay(100 + i * 120))
        .duration(tDur(450))
        .attr("opacity", 1);
      g.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .attr("fill", n.id === "sup" ? COLORS.white : COLORS.negro)
        .attr("font-family", "Roboto, system-ui, sans-serif")
        .attr("font-weight", 800)
        .attr("font-size", 15)
        .attr("opacity", 0)
        .text(n.label)
        .transition()
        .delay(tDelay(160 + i * 120))
        .duration(tDur(400))
        .attr("opacity", 1);
    });

    svg
      .append("defs")
      .append("marker")
      .attr("id", "uai-arrow-ma")
      .attr("viewBox", "0 0 10 10")
      .attr("refX", 9)
      .attr("refY", 5)
      .attr("markerWidth", 7)
      .attr("markerHeight", 7)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M 0 0 L 10 5 L 0 10 z")
      .attr("fill", COLORS.primary);

    [1, 2, 3].forEach(function (i, k) {
      var b = nodes[i];
      svg
        .append("line")
        .attr("x1", 460)
        .attr("y1", 108)
        .attr("x2", 460)
        .attr("y2", 108)
        .attr("stroke", COLORS.primary)
        .attr("stroke-width", 2)
        .attr("marker-end", "url(#uai-arrow-ma)")
        .transition()
        .delay(tDelay(400 + k * 140))
        .duration(tDur(400))
        .attr("x2", b.x)
        .attr("y2", b.y - 28);
    });

    label(svg, 460, 350, "Cada hop multiplica latencia, costo y probabilidad de falla", {
      size: 13,
      fill: COLORS.gray,
      delay: 900,
    });
  }

  /** Tres niveles de evaluación. */
  function vizEvalLevels(el) {
    var w = 920;
    var h = 380;
    var svg = svgRoot(el, w, h);
    svg.append("title").text("Tres niveles: componente, sistema, organización");

    var levels = [
      { y: 70, label: "Organización", sub: "Resultado de negocio / decisión", w: 760 },
      { y: 170, label: "Sistema", sub: "Trayectoria · UX · costo · latencia", w: 620 },
      { y: 270, label: "Componente", sub: "Métrica del modelo / tool", w: 480 },
    ];

    levels.forEach(function (L, i) {
      var x = (w - L.w) / 2;
      svg
        .append("rect")
        .attr("x", x)
        .attr("y", L.y)
        .attr("width", L.w)
        .attr("height", 72)
        .attr("rx", 2)
        .attr("fill", i === 0 ? COLORS.negro : COLORS.soft)
        .attr("stroke", i === 0 ? COLORS.negro : COLORS.primary)
        .attr("stroke-width", 2)
        .attr("opacity", 0)
        .attr("transform", "translate(0,20)")
        .transition()
        .delay(tDelay(150 * i))
        .duration(tDur(500))
        .attr("opacity", 1)
        .attr("transform", "translate(0,0)");
      svg
        .append("text")
        .attr("x", w / 2)
        .attr("y", L.y + 30)
        .attr("text-anchor", "middle")
        .attr("fill", i === 0 ? COLORS.white : COLORS.negro)
        .attr("font-family", "UAI Corporativo, Roboto, system-ui, sans-serif")
        .attr("font-weight", 800)
        .attr("font-size", 18)
        .attr("opacity", 0)
        .text(L.label)
        .transition()
        .delay(tDelay(200 + 150 * i))
        .duration(tDur(400))
        .attr("opacity", 1);
      svg
        .append("text")
        .attr("x", w / 2)
        .attr("y", L.y + 52)
        .attr("text-anchor", "middle")
        .attr("fill", i === 0 ? "rgba(255,255,255,0.75)" : COLORS.gray)
        .attr("font-family", "Roboto, system-ui, sans-serif")
        .attr("font-size", 13)
        .attr("opacity", 0)
        .text(L.sub)
        .transition()
        .delay(tDelay(260 + 150 * i))
        .duration(tDur(400))
        .attr("opacity", 1);
    });
  }

  /** Riesgo del modelo ≠ controles del sistema. */
  function vizRiskLayers(el) {
    var w = 920;
    var h = 380;
    var svg = svgRoot(el, w, h);
    svg.append("title").text("Riesgos del modelo versus controles del sistema");

    var cols = [
      {
        x: 220,
        title: "Modelo",
        fill: COLORS.soft,
        ink: COLORS.negro,
        items: ["memorización", "extracción", "jailbreak / frontera"],
      },
      {
        x: 700,
        title: "Sistema",
        fill: COLORS.negro,
        ink: COLORS.white,
        items: ["filtros · schema", "logging · auditoría", "human review"],
      },
    ];

    cols.forEach(function (c, ci) {
      svg
        .append("rect")
        .attr("x", c.x - 150)
        .attr("y", 70)
        .attr("width", 300)
        .attr("height", 220)
        .attr("rx", 2)
        .attr("fill", c.fill)
        .attr("stroke", ci === 0 ? COLORS.primary : COLORS.negro)
        .attr("stroke-width", 2)
        .attr("opacity", 0)
        .transition()
        .delay(tDelay(80 + ci * 160))
        .duration(tDur(450))
        .attr("opacity", 1);
      svg
        .append("text")
        .attr("x", c.x)
        .attr("y", 110)
        .attr("text-anchor", "middle")
        .attr("fill", c.ink)
        .attr("font-family", "Roboto, system-ui, sans-serif")
        .attr("font-weight", 800)
        .attr("font-size", 18)
        .attr("opacity", 0)
        .text(c.title)
        .transition()
        .delay(tDelay(140 + ci * 160))
        .duration(tDur(400))
        .attr("opacity", 1);
      c.items.forEach(function (t, i) {
        svg
          .append("text")
          .attr("x", c.x)
          .attr("y", 160 + i * 40)
          .attr("text-anchor", "middle")
          .attr("fill", ci === 0 ? COLORS.negro : "rgba(255,255,255,0.85)")
          .attr("font-family", "Roboto, system-ui, sans-serif")
          .attr("font-size", 14)
          .attr("opacity", 0)
          .text(t)
          .transition()
          .delay(tDelay(220 + ci * 120 + i * 70))
          .duration(tDur(350))
          .attr("opacity", 1);
      });
    });

    svg
      .append("text")
      .attr("x", 460)
      .attr("y", 190)
      .attr("text-anchor", "middle")
      .attr("fill", COLORS.primary)
      .attr("font-family", "Roboto, system-ui, sans-serif")
      .attr("font-weight", 800)
      .attr("font-size", 22)
      .attr("opacity", 0)
      .text("≠")
      .transition()
      .delay(tDelay(650))
      .duration(tDur(400))
      .attr("opacity", 1);

    label(svg, 460, 330, "Puente a cursos 09–11: especificación, sistema y operación", {
      size: 13,
      fill: COLORS.gray,
      delay: 850,
    });
  }

  /** Evaluación: leaderboard público vs set de dominio + juez. */
  function vizEvalDomain(el) {
    var w = 920;
    var h = 380;
    var svg = svgRoot(el, w, h);
    svg.append("title").text("Leaderboard público versus set de dominio con juez");

    var cols = [
      {
        x: 220,
        title: "Leaderboard",
        fill: COLORS.soft,
        ink: COLORS.negro,
        items: ["benchmark público", "saturación / fuga", "ranking relativo"],
      },
      {
        x: 700,
        title: "Set de dominio",
        fill: COLORS.negro,
        ink: COLORS.white,
        items: ["casos difíciles", "umbral operativo", "juez + humano"],
      },
    ];

    cols.forEach(function (c, ci) {
      svg
        .append("rect")
        .attr("x", c.x - 150)
        .attr("y", 70)
        .attr("width", 300)
        .attr("height", 220)
        .attr("rx", 2)
        .attr("fill", c.fill)
        .attr("stroke", ci === 0 ? COLORS.primary : COLORS.negro)
        .attr("stroke-width", 2)
        .attr("opacity", 0)
        .transition()
        .delay(tDelay(80 + ci * 160))
        .duration(tDur(450))
        .attr("opacity", 1);
      svg
        .append("text")
        .attr("x", c.x)
        .attr("y", 110)
        .attr("text-anchor", "middle")
        .attr("fill", c.ink)
        .attr("font-family", "Roboto, system-ui, sans-serif")
        .attr("font-weight", 800)
        .attr("font-size", 18)
        .attr("opacity", 0)
        .text(c.title)
        .transition()
        .delay(tDelay(140 + ci * 160))
        .duration(tDur(400))
        .attr("opacity", 1);
      c.items.forEach(function (t, i) {
        svg
          .append("text")
          .attr("x", c.x)
          .attr("y", 160 + i * 40)
          .attr("text-anchor", "middle")
          .attr("fill", ci === 0 ? COLORS.negro : "rgba(255,255,255,0.85)")
          .attr("font-family", "Roboto, system-ui, sans-serif")
          .attr("font-size", 14)
          .attr("opacity", 0)
          .text(t)
          .transition()
          .delay(tDelay(220 + ci * 120 + i * 70))
          .duration(tDur(350))
          .attr("opacity", 1);
      });
    });

    svg
      .append("text")
      .attr("x", 460)
      .attr("y", 190)
      .attr("text-anchor", "middle")
      .attr("fill", COLORS.primary)
      .attr("font-family", "Roboto, system-ui, sans-serif")
      .attr("font-weight", 800)
      .attr("font-size", 22)
      .attr("opacity", 0)
      .text("≠")
      .transition()
      .delay(tDelay(650))
      .duration(tDur(400))
      .attr("opacity", 1);

    label(svg, 460, 330, "Concordancia humano–juez es el gate, no el score solo", {
      size: 13,
      fill: COLORS.gray,
      delay: 850,
    });
  }

  /** Latencia de inferencia: TTFT (prefill) vs TPOT (decode). */
  function vizLatencyTtftTpot(el) {
    var w = 920;
    var h = 360;
    var svg = svgRoot(el, w, h);
    svg.append("title").text("TTFT es prefill; TPOT es el ritmo de decode token a token");

    var y = 160;
    var x0 = 80;
    var prefillW = 220;
    var decodeW = 520;

    svg
      .append("rect")
      .attr("x", x0)
      .attr("y", y - 36)
      .attr("width", prefillW)
      .attr("height", 72)
      .attr("rx", 2)
      .attr("fill", COLORS.negro)
      .attr("opacity", 0)
      .transition()
      .delay(tDelay(80))
      .duration(tDur(450))
      .attr("opacity", 1);
    svg
      .append("text")
      .attr("x", x0 + prefillW / 2)
      .attr("y", y - 4)
      .attr("text-anchor", "middle")
      .attr("fill", COLORS.white)
      .attr("font-family", "Roboto, system-ui, sans-serif")
      .attr("font-weight", 800)
      .attr("font-size", 16)
      .attr("opacity", 0)
      .text("Prefill")
      .transition()
      .delay(tDelay(140))
      .duration(tDur(400))
      .attr("opacity", 1);
    svg
      .append("text")
      .attr("x", x0 + prefillW / 2)
      .attr("y", y + 22)
      .attr("text-anchor", "middle")
      .attr("fill", "rgba(255,255,255,0.75)")
      .attr("font-family", "Roboto, system-ui, sans-serif")
      .attr("font-size", 13)
      .attr("opacity", 0)
      .text("TTFT")
      .transition()
      .delay(tDelay(180))
      .duration(tDur(400))
      .attr("opacity", 1);

    svg
      .append("rect")
      .attr("x", x0 + prefillW + 24)
      .attr("y", y - 36)
      .attr("width", decodeW)
      .attr("height", 72)
      .attr("rx", 2)
      .attr("fill", COLORS.soft)
      .attr("stroke", COLORS.primary)
      .attr("stroke-width", 2)
      .attr("opacity", 0)
      .transition()
      .delay(tDelay(280))
      .duration(tDur(450))
      .attr("opacity", 1);
    svg
      .append("text")
      .attr("x", x0 + prefillW + 24 + decodeW / 2)
      .attr("y", y - 4)
      .attr("text-anchor", "middle")
      .attr("fill", COLORS.negro)
      .attr("font-family", "Roboto, system-ui, sans-serif")
      .attr("font-weight", 800)
      .attr("font-size", 16)
      .attr("opacity", 0)
      .text("Decode")
      .transition()
      .delay(tDelay(340))
      .duration(tDur(400))
      .attr("opacity", 1);
    svg
      .append("text")
      .attr("x", x0 + prefillW + 24 + decodeW / 2)
      .attr("y", y + 22)
      .attr("text-anchor", "middle")
      .attr("fill", COLORS.gray)
      .attr("font-family", "Roboto, system-ui, sans-serif")
      .attr("font-size", 13)
      .attr("opacity", 0)
      .text("TPOT × tokens out")
      .transition()
      .delay(tDelay(380))
      .duration(tDur(400))
      .attr("opacity", 1);

    // token ticks on decode
    for (var i = 0; i < 8; i++) {
      svg
        .append("line")
        .attr("x1", x0 + prefillW + 50 + i * 58)
        .attr("y1", y + 48)
        .attr("x2", x0 + prefillW + 50 + i * 58)
        .attr("y2", y + 48)
        .attr("stroke", COLORS.primary)
        .attr("stroke-width", 3)
        .transition()
        .delay(tDelay(450 + i * 60))
        .duration(tDur(250))
        .attr("y2", y + 62);
    }

    label(svg, 460, 80, "Tiempo de una generación", {
      size: 14,
      weight: 700,
      delay: 100,
    });
    label(svg, 460, 280, "Optimizar solo TTFT no arregla un stream lento", {
      size: 13,
      fill: COLORS.gray,
      delay: 900,
    });
  }

  /** Punto de cruce de costo: API variable vs local con idle. */
  function vizCostCrossover(el) {
    var w = 920;
    var h = 380;
    var svg = svgRoot(el, w, h);
    svg.append("title").text("Costo API vs local: el cruce depende del volumen y del idle");

    var margin = { l: 80, r: 40, t: 60, b: 70 };
    var iw = w - margin.l - margin.r;
    var ih = h - margin.t - margin.b;

    svg
      .append("line")
      .attr("x1", margin.l)
      .attr("y1", margin.t + ih)
      .attr("x2", margin.l + iw)
      .attr("y2", margin.t + ih)
      .attr("stroke", COLORS.border)
      .attr("stroke-width", 2);
    svg
      .append("line")
      .attr("x1", margin.l)
      .attr("y1", margin.t)
      .attr("x2", margin.l)
      .attr("y2", margin.t + ih)
      .attr("stroke", COLORS.border)
      .attr("stroke-width", 2);

    // API: rising line
    var api = svg
      .append("path")
      .attr("d", "M" + margin.l + "," + (margin.t + ih - 20) + " L" + (margin.l + iw) + "," + (margin.t + 30))
      .attr("fill", "none")
      .attr("stroke", COLORS.primary)
      .attr("stroke-width", 3)
      .attr("opacity", 0);
    api
      .transition()
      .delay(tDelay(120))
      .duration(tDur(600))
      .attr("opacity", 1);

    // Local: flatter with fixed + idle
    var loc = svg
      .append("path")
      .attr("d", "M" + margin.l + "," + (margin.t + ih - 90) + " L" + (margin.l + iw) + "," + (margin.t + ih - 70))
      .attr("fill", "none")
      .attr("stroke", COLORS.negro)
      .attr("stroke-width", 3)
      .attr("opacity", 0);
    loc
      .transition()
      .delay(tDelay(280))
      .duration(tDur(600))
      .attr("opacity", 1);

    // Crossover marker
    var cx = margin.l + iw * 0.45;
    var cy = margin.t + ih - 82;
    svg
      .append("circle")
      .attr("cx", cx)
      .attr("cy", cy)
      .attr("r", 0)
      .attr("fill", COLORS.primary)
      .transition()
      .delay(tDelay(700))
      .duration(tDur(400))
      .attr("r", 8);

    label(svg, margin.l + iw - 20, margin.t + 50, "API ($/req)", {
      anchor: "end",
      size: 13,
      fill: COLORS.primary,
      weight: 700,
      delay: 200,
    });
    label(svg, margin.l + 120, margin.t + ih - 110, "Local (GPU + idle)", {
      anchor: "start",
      size: 13,
      fill: COLORS.negro,
      weight: 700,
      delay: 360,
    });
    label(svg, cx, cy - 18, "cruce", {
      size: 12,
      fill: COLORS.gray,
      delay: 820,
    });
    label(svg, margin.l + iw / 2, h - 28, "Volumen →", {
      size: 12,
      fill: COLORS.gray,
      delay: 500,
    });
  }

  /** Tres vías de adaptación: prompting · RAG · fine-tune. */
  function vizAdaptRoutes(el) {
    var w = 920;
    var h = 380;
    var svg = svgRoot(el, w, h);
    svg.append("title").text("Vías: prompting, RAG y fine-tuning");

    var routes = [
      { x: 160, label: "Prompting", sub: "formato · tarea", gap: "falta instrucción" },
      { x: 460, label: "RAG", sub: "hechos · citas", gap: "falta conocimiento" },
      { x: 760, label: "Fine-tune", sub: "estilo · dominio", gap: "falta comportamiento" },
    ];

    routes.forEach(function (r, i) {
      var g = svg.append("g").attr("transform", "translate(" + r.x + ",170)");
      g.append("rect")
        .attr("x", -110)
        .attr("y", -70)
        .attr("width", 220)
        .attr("height", 140)
        .attr("rx", 2)
        .attr("fill", i === 1 ? COLORS.negro : COLORS.soft)
        .attr("stroke", i === 1 ? COLORS.negro : COLORS.primary)
        .attr("stroke-width", 2)
        .attr("opacity", 0)
        .attr("transform", "translate(0,16)")
        .transition()
        .delay(tDelay(100 + i * 140))
        .duration(tDur(450))
        .attr("opacity", 1)
        .attr("transform", "translate(0,0)");
      g.append("text")
        .attr("text-anchor", "middle")
        .attr("y", -28)
        .attr("fill", i === 1 ? COLORS.white : COLORS.negro)
        .attr("font-family", "Roboto, system-ui, sans-serif")
        .attr("font-weight", 800)
        .attr("font-size", 17)
        .attr("opacity", 0)
        .text(r.label)
        .transition()
        .delay(tDelay(160 + i * 140))
        .duration(tDur(400))
        .attr("opacity", 1);
      g.append("text")
        .attr("text-anchor", "middle")
        .attr("y", 4)
        .attr("fill", i === 1 ? "rgba(255,255,255,0.8)" : COLORS.gray)
        .attr("font-family", "Roboto, system-ui, sans-serif")
        .attr("font-size", 13)
        .attr("opacity", 0)
        .text(r.sub)
        .transition()
        .delay(tDelay(200 + i * 140))
        .duration(tDur(400))
        .attr("opacity", 1);
      g.append("text")
        .attr("text-anchor", "middle")
        .attr("y", 36)
        .attr("fill", i === 1 ? COLORS.primary : COLORS.primaryDark)
        .attr("font-family", "Roboto, system-ui, sans-serif")
        .attr("font-weight", 700)
        .attr("font-size", 12)
        .attr("opacity", 0)
        .text(r.gap)
        .transition()
        .delay(tDelay(240 + i * 140))
        .duration(tDur(400))
        .attr("opacity", 1);
    });

    label(svg, 460, 320, "Fine-tune no sustituye un índice fresco; RAG no enseña un schema", {
      size: 13,
      fill: COLORS.gray,
      delay: 780,
    });
  }

  /** Pipeline post-entrenamiento: Pretrain → SFT → Alineación. */
  function vizPosttrainPipeline(el) {
    var w = 920;
    var h = 360;
    var svg = svgRoot(el, w, h);
    svg.append("title").text("Pipeline: pretrain, SFT y alineación");

    var steps = [
      { x: 160, label: "Pretrain", sub: "continuar texto" },
      { x: 460, label: "SFT", sub: "seguir instrucciones" },
      { x: 760, label: "Alineación", sub: "preferencias" },
    ];

    svg
      .append("defs")
      .append("marker")
      .attr("id", "uai-arrow-pt")
      .attr("viewBox", "0 0 10 10")
      .attr("refX", 9)
      .attr("refY", 5)
      .attr("markerWidth", 7)
      .attr("markerHeight", 7)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M 0 0 L 10 5 L 0 10 z")
      .attr("fill", COLORS.primary);

    steps.forEach(function (s, i) {
      var g = svg.append("g").attr("transform", "translate(" + s.x + ",150)");
      g.append("rect")
        .attr("x", -90)
        .attr("y", -40)
        .attr("width", 180)
        .attr("height", 80)
        .attr("rx", 2)
        .attr("fill", i === 0 ? COLORS.negro : COLORS.soft)
        .attr("stroke", i === 0 ? COLORS.negro : COLORS.primary)
        .attr("stroke-width", 2)
        .attr("opacity", 0)
        .attr("transform", "scale(0.9)")
        .transition()
        .delay(tDelay(100 + i * 150))
        .duration(tDur(450))
        .attr("opacity", 1)
        .attr("transform", "scale(1)");
      g.append("text")
        .attr("text-anchor", "middle")
        .attr("y", -6)
        .attr("fill", i === 0 ? COLORS.white : COLORS.negro)
        .attr("font-family", "Roboto, system-ui, sans-serif")
        .attr("font-weight", 800)
        .attr("font-size", 17)
        .attr("opacity", 0)
        .text(s.label)
        .transition()
        .delay(tDelay(160 + i * 150))
        .duration(tDur(400))
        .attr("opacity", 1);
      g.append("text")
        .attr("text-anchor", "middle")
        .attr("y", 20)
        .attr("fill", i === 0 ? "rgba(255,255,255,0.75)" : COLORS.gray)
        .attr("font-family", "Roboto, system-ui, sans-serif")
        .attr("font-size", 12)
        .attr("opacity", 0)
        .text(s.sub)
        .transition()
        .delay(tDelay(200 + i * 150))
        .duration(tDur(400))
        .attr("opacity", 1);

      if (i < steps.length - 1) {
        svg
          .append("line")
          .attr("x1", s.x + 96)
          .attr("y1", 150)
          .attr("x2", s.x + 96)
          .attr("y2", 150)
          .attr("stroke", COLORS.primary)
          .attr("stroke-width", 2.5)
          .attr("marker-end", "url(#uai-arrow-pt)")
          .transition()
          .delay(tDelay(220 + i * 150))
          .duration(tDur(380))
          .attr("x2", steps[i + 1].x - 96);
      }
    });

    label(svg, 460, 280, "Cada etapa explica fallas distintas — no mezclar el diagnóstico", {
      size: 13,
      fill: COLORS.gray,
      delay: 780,
    });
  }

  /** Observabilidad: capa servicio ≠ capa modelo. */
  function vizObsLayers(el) {
    var w = 920;
    var h = 380;
    var svg = svgRoot(el, w, h);
    svg.append("title").text("Observabilidad de servicio versus observabilidad del modelo");

    var cols = [
      {
        x: 240,
        title: "Servicio",
        fill: COLORS.negro,
        ink: COLORS.white,
        items: ["latencia p95/p99", "errores · saturación", "costo / request"],
      },
      {
        x: 680,
        title: "Modelo",
        fill: COLORS.soft,
        ink: COLORS.negro,
        items: ["distribución inputs", "preds · subgrupos", "calidad / etiqueta"],
      },
    ];

    cols.forEach(function (c, ci) {
      svg
        .append("rect")
        .attr("x", c.x - 150)
        .attr("y", 60)
        .attr("width", 300)
        .attr("height", 250)
        .attr("rx", 2)
        .attr("fill", c.fill)
        .attr("stroke", ci === 0 ? COLORS.negro : COLORS.primary)
        .attr("stroke-width", 2)
        .attr("opacity", 0)
        .transition()
        .delay(tDelay(80 + ci * 160))
        .duration(tDur(450))
        .attr("opacity", 1);
      svg
        .append("text")
        .attr("x", c.x)
        .attr("y", 100)
        .attr("text-anchor", "middle")
        .attr("fill", c.ink)
        .attr("font-family", "Roboto, system-ui, sans-serif")
        .attr("font-weight", 800)
        .attr("font-size", 18)
        .attr("opacity", 0)
        .text(c.title)
        .transition()
        .delay(tDelay(140 + ci * 160))
        .duration(tDur(400))
        .attr("opacity", 1);

      c.items.forEach(function (t, i) {
        svg
          .append("text")
          .attr("x", c.x)
          .attr("y", 150 + i * 42)
          .attr("text-anchor", "middle")
          .attr("fill", ci === 0 ? "rgba(255,255,255,0.85)" : COLORS.negro)
          .attr("font-family", "Roboto, system-ui, sans-serif")
          .attr("font-size", 14)
          .attr("opacity", 0)
          .text(t)
          .transition()
          .delay(tDelay(220 + ci * 120 + i * 70))
          .duration(tDur(350))
          .attr("opacity", 1);
      });
    });

    svg
      .append("text")
      .attr("x", 460)
      .attr("y", 200)
      .attr("text-anchor", "middle")
      .attr("fill", COLORS.primary)
      .attr("font-family", "Roboto, system-ui, sans-serif")
      .attr("font-weight", 800)
      .attr("font-size", 22)
      .attr("opacity", 0)
      .text("≠")
      .transition()
      .delay(tDelay(650))
      .duration(tDur(400))
      .attr("opacity", 1);

    label(svg, 460, 340, "Deriva y sesgo viven en la capa modelo", {
      size: 13,
      fill: COLORS.gray,
      delay: 850,
    });
  }

  /** Despliegue canario: tráfico estable vs canaria + promote/rollback. */
  function vizCanaryDeploy(el) {
    var w = 920;
    var h = 380;
    var svg = svgRoot(el, w, h);
    svg.append("title").text("Despliegue canario con promoción o rollback automático");

    svg
      .append("defs")
      .append("marker")
      .attr("id", "uai-arrow-canary")
      .attr("viewBox", "0 0 10 10")
      .attr("refX", 9)
      .attr("refY", 5)
      .attr("markerWidth", 7)
      .attr("markerHeight", 7)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M 0 0 L 10 5 L 0 10 z")
      .attr("fill", COLORS.primary);

    var boxes = [
      { x: 140, y: 160, label: "Estable", sub: "~90% tráfico", fill: COLORS.soft, ink: COLORS.negro },
      { x: 140, y: 280, label: "Canaria", sub: "~10% tráfico", fill: COLORS.negro, ink: COLORS.white },
      { x: 460, y: 220, label: "Métricas", sub: "error · latencia · costo", fill: COLORS.soft, ink: COLORS.negro },
      { x: 760, y: 140, label: "Promover", sub: "ampliar canaria", fill: COLORS.primary, ink: COLORS.white },
      { x: 760, y: 300, label: "Rollback", sub: "volver a estable", fill: COLORS.soft, ink: COLORS.negro },
    ];

    boxes.forEach(function (b, i) {
      var g = svg.append("g").attr("transform", "translate(" + b.x + "," + b.y + ")");
      g.append("rect")
        .attr("x", -90)
        .attr("y", -32)
        .attr("width", 180)
        .attr("height", 64)
        .attr("rx", 2)
        .attr("fill", b.fill)
        .attr("stroke", b.fill === COLORS.soft ? COLORS.primary : b.fill)
        .attr("stroke-width", 2)
        .attr("opacity", 0)
        .transition()
        .delay(tDelay(80 + i * 100))
        .duration(tDur(420))
        .attr("opacity", 1);
      g.append("text")
        .attr("text-anchor", "middle")
        .attr("y", -4)
        .attr("fill", b.ink)
        .attr("font-family", "Roboto, system-ui, sans-serif")
        .attr("font-weight", 800)
        .attr("font-size", 15)
        .attr("opacity", 0)
        .text(b.label)
        .transition()
        .delay(tDelay(140 + i * 100))
        .duration(tDur(350))
        .attr("opacity", 1);
      g.append("text")
        .attr("text-anchor", "middle")
        .attr("y", 18)
        .attr("fill", b.ink === COLORS.white ? "rgba(255,255,255,0.75)" : COLORS.gray)
        .attr("font-family", "Roboto, system-ui, sans-serif")
        .attr("font-size", 12)
        .attr("opacity", 0)
        .text(b.sub)
        .transition()
        .delay(tDelay(180 + i * 100))
        .duration(tDur(350))
        .attr("opacity", 1);
    });

    [
      { x1: 230, y1: 160, x2: 370, y2: 210 },
      { x1: 230, y1: 280, x2: 370, y2: 230 },
      { x1: 550, y1: 200, x2: 670, y2: 150 },
      { x1: 550, y1: 240, x2: 670, y2: 290 },
    ].forEach(function (L, i) {
      svg
        .append("line")
        .attr("x1", L.x1)
        .attr("y1", L.y1)
        .attr("x2", L.x1)
        .attr("y2", L.y1)
        .attr("stroke", COLORS.primary)
        .attr("stroke-width", 2)
        .attr("marker-end", "url(#uai-arrow-canary)")
        .transition()
        .delay(tDelay(500 + i * 90))
        .duration(tDur(350))
        .attr("x2", L.x2)
        .attr("y2", L.y2);
    });

    label(svg, 460, 48, "Sombra observa; canaria decide con umbrales", {
      size: 13,
      fill: COLORS.gray,
      delay: 900,
    });
  }

  /** CI mínimo: lint → test → smoke → gate. */
  function vizCiPipeline(el) {
    var w = 920;
    var h = 360;
    var svg = svgRoot(el, w, h);
    svg.append("title").text("Pipeline CI: lint, test, smoke y gate");

    var steps = [
      { x: 120, label: "Lint", sub: "estilo" },
      { x: 320, label: "Test", sub: "unidad" },
      { x: 520, label: "Smoke", sub: "/health" },
      { x: 720, label: "Gate", sub: "pasar / fallar" },
    ];

    svg
      .append("defs")
      .append("marker")
      .attr("id", "uai-arrow-ci")
      .attr("viewBox", "0 0 10 10")
      .attr("refX", 9)
      .attr("refY", 5)
      .attr("markerWidth", 7)
      .attr("markerHeight", 7)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M 0 0 L 10 5 L 0 10 z")
      .attr("fill", COLORS.primary);

    steps.forEach(function (s, i) {
      var last = i === steps.length - 1;
      var g = svg.append("g").attr("transform", "translate(" + s.x + ",150)");
      g.append("circle")
        .attr("r", 0)
        .attr("fill", last ? COLORS.negro : COLORS.primary)
        .transition()
        .delay(tDelay(100 + i * 140))
        .duration(tDur(400))
        .attr("r", 20);
      g.append("text")
        .attr("text-anchor", "middle")
        .attr("y", -48)
        .attr("fill", COLORS.negro)
        .attr("font-family", "Roboto, system-ui, sans-serif")
        .attr("font-weight", 800)
        .attr("font-size", 16)
        .attr("opacity", 0)
        .text(s.label)
        .transition()
        .delay(tDelay(160 + i * 140))
        .duration(tDur(400))
        .attr("opacity", 1);
      g.append("text")
        .attr("text-anchor", "middle")
        .attr("y", 52)
        .attr("fill", COLORS.gray)
        .attr("font-family", "Roboto, system-ui, sans-serif")
        .attr("font-size", 12)
        .attr("opacity", 0)
        .text(s.sub)
        .transition()
        .delay(tDelay(200 + i * 140))
        .duration(tDur(400))
        .attr("opacity", 1);

      if (i < steps.length - 1) {
        svg
          .append("line")
          .attr("x1", s.x + 26)
          .attr("y1", 150)
          .attr("x2", s.x + 26)
          .attr("y2", 150)
          .attr("stroke", COLORS.primary)
          .attr("stroke-width", 2.5)
          .attr("marker-end", "url(#uai-arrow-ci)")
          .transition()
          .delay(tDelay(220 + i * 140))
          .duration(tDur(380))
          .attr("x2", steps[i + 1].x - 26);
      }
    });

    label(svg, 460, 280, "LM Studio puede ser el backend del smoke — sin cloud de pago", {
      size: 13,
      fill: COLORS.gray,
      delay: 800,
    });
  }

  /** Train/serve skew: dos caminos de features que divergen. */
  function vizTrainServeSkew(el) {
    var w = 920;
    var h = 380;
    var svg = svgRoot(el, w, h);
    svg.append("title").text("Train/serve skew: features distintas en entrenamiento y servicio");

    var cols = [
      { x: 220, title: "Train", items: ["feature A", "feature B", "label t+k"], ink: COLORS.negro },
      { x: 700, title: "Serve", items: ["feature A′", "feature B?", "score ahora"], ink: COLORS.negro },
    ];

    cols.forEach(function (c, ci) {
      svg
        .append("rect")
        .attr("x", c.x - 130)
        .attr("y", 56)
        .attr("width", 260)
        .attr("height", 240)
        .attr("rx", 2)
        .attr("fill", COLORS.soft)
        .attr("stroke", COLORS.primary)
        .attr("stroke-width", 2)
        .attr("opacity", 0)
        .transition()
        .delay(tDelay(80 + ci * 160))
        .duration(tDur(450))
        .attr("opacity", 1);
      svg
        .append("text")
        .attr("x", c.x)
        .attr("y", 92)
        .attr("text-anchor", "middle")
        .attr("fill", COLORS.negro)
        .attr("font-family", "Roboto, system-ui, sans-serif")
        .attr("font-weight", 800)
        .attr("font-size", 18)
        .attr("opacity", 0)
        .text(c.title)
        .transition()
        .delay(tDelay(140 + ci * 160))
        .duration(tDur(400))
        .attr("opacity", 1);

      c.items.forEach(function (t, i) {
        svg
          .append("rect")
          .attr("x", c.x - 100)
          .attr("y", 118 + i * 52)
          .attr("width", 200)
          .attr("height", 40)
          .attr("rx", 2)
          .attr("fill", ci === 1 && i > 0 ? COLORS.white : COLORS.white)
          .attr("stroke", ci === 1 && i > 0 ? COLORS.negro : COLORS.primary)
          .attr("stroke-width", ci === 1 && i > 0 ? 1.5 : 1.5)
          .attr("stroke-dasharray", ci === 1 && i > 0 ? "5 4" : null)
          .attr("opacity", 0)
          .transition()
          .delay(tDelay(220 + ci * 120 + i * 80))
          .duration(tDur(350))
          .attr("opacity", 1);
        svg
          .append("text")
          .attr("x", c.x)
          .attr("y", 144 + i * 52)
          .attr("text-anchor", "middle")
          .attr("fill", COLORS.negro)
          .attr("font-family", "Roboto, system-ui, sans-serif")
          .attr("font-size", 14)
          .attr("font-weight", 500)
          .attr("opacity", 0)
          .text(t)
          .transition()
          .delay(tDelay(260 + ci * 120 + i * 80))
          .duration(tDur(350))
          .attr("opacity", 1);
      });
    });

    svg
      .append("text")
      .attr("x", 460)
      .attr("y", 180)
      .attr("text-anchor", "middle")
      .attr("fill", COLORS.primary)
      .attr("font-family", "Roboto, system-ui, sans-serif")
      .attr("font-weight", 800)
      .attr("font-size", 16)
      .attr("opacity", 0)
      .text("≠ skew")
      .transition()
      .delay(tDelay(700))
      .duration(tDur(400))
      .attr("opacity", 1);

    label(svg, 460, 330, "Unificar el cálculo de features es el remedio de arquitectura", {
      size: 13,
      fill: COLORS.gray,
      delay: 900,
    });
  }

  /** Pipeline RAG como patrón de arquitectura. */
  function vizRagPipeline(el) {
    var w = 920;
    var h = 380;
    var svg = svgRoot(el, w, h);
    svg.append("title").text("Pipeline RAG: índice, retrieval, rerank y ensamblaje");

    var steps = [
      { x: 110, label: "Índice", sub: "chunk · embed" },
      { x: 310, label: "Retrieve", sub: "top-k" },
      { x: 510, label: "Rerank", sub: "relevancia" },
      { x: 710, label: "Ensamble", sub: "contexto → modelo" },
    ];

    svg
      .append("defs")
      .append("marker")
      .attr("id", "uai-arrow-rag")
      .attr("viewBox", "0 0 10 10")
      .attr("refX", 9)
      .attr("refY", 5)
      .attr("markerWidth", 7)
      .attr("markerHeight", 7)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M 0 0 L 10 5 L 0 10 z")
      .attr("fill", COLORS.primary);

    steps.forEach(function (s, i) {
      var g = svg.append("g").attr("transform", "translate(" + s.x + ",150)");
      g.append("rect")
        .attr("x", -72)
        .attr("y", -40)
        .attr("width", 144)
        .attr("height", 80)
        .attr("rx", 2)
        .attr("fill", i === 0 ? COLORS.negro : COLORS.soft)
        .attr("stroke", i === 0 ? COLORS.negro : COLORS.primary)
        .attr("stroke-width", 2)
        .attr("opacity", 0)
        .attr("transform", "translate(0,14)")
        .transition()
        .delay(tDelay(100 + i * 140))
        .duration(tDur(450))
        .attr("opacity", 1)
        .attr("transform", "translate(0,0)");
      g.append("text")
        .attr("text-anchor", "middle")
        .attr("y", -6)
        .attr("fill", i === 0 ? COLORS.white : COLORS.negro)
        .attr("font-family", "Roboto, system-ui, sans-serif")
        .attr("font-weight", 800)
        .attr("font-size", 16)
        .attr("opacity", 0)
        .text(s.label)
        .transition()
        .delay(tDelay(160 + i * 140))
        .duration(tDur(400))
        .attr("opacity", 1);
      g.append("text")
        .attr("text-anchor", "middle")
        .attr("y", 20)
        .attr("fill", i === 0 ? "rgba(255,255,255,0.75)" : COLORS.gray)
        .attr("font-family", "Roboto, system-ui, sans-serif")
        .attr("font-size", 12)
        .attr("opacity", 0)
        .text(s.sub)
        .transition()
        .delay(tDelay(200 + i * 140))
        .duration(tDur(400))
        .attr("opacity", 1);

      if (i < steps.length - 1) {
        svg
          .append("line")
          .attr("x1", s.x + 78)
          .attr("y1", 150)
          .attr("x2", s.x + 78)
          .attr("y2", 150)
          .attr("stroke", COLORS.primary)
          .attr("stroke-width", 2.5)
          .attr("marker-end", "url(#uai-arrow-rag)")
          .transition()
          .delay(tDelay(220 + i * 140))
          .duration(tDur(380))
          .attr("x2", steps[i + 1].x - 78);
      }
    });

    label(svg, 460, 280, "Fallar una etapa (índice stale, retrieve pobre) no se arregla con más prompt", {
      size: 13,
      fill: COLORS.gray,
      delay: 820,
    });
  }

  /** Cadena de valor: predicción → decisión → acción → resultado. */
  function vizDecisionChain(el) {
    var w = 920;
    var h = 380;
    var svg = svgRoot(el, w, h);
    svg.append("title").text("Cadena predicción, decisión, acción y resultado");

    var steps = [
      { x: 120, label: "Predicción", sub: "señal / score" },
      { x: 340, label: "Decisión", sub: "umbral · política" },
      { x: 560, label: "Acción", sub: "ejecución" },
      { x: 780, label: "Resultado", sub: "valor medido" },
    ];

    svg
      .append("defs")
      .append("marker")
      .attr("id", "uai-arrow-dc")
      .attr("viewBox", "0 0 10 10")
      .attr("refX", 9)
      .attr("refY", 5)
      .attr("markerWidth", 7)
      .attr("markerHeight", 7)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M 0 0 L 10 5 L 0 10 z")
      .attr("fill", COLORS.primary);

    steps.forEach(function (s, i) {
      var g = svg.append("g").attr("transform", "translate(" + s.x + ",160)");
      g.append("rect")
        .attr("x", -78)
        .attr("y", -40)
        .attr("width", 156)
        .attr("height", 80)
        .attr("rx", 2)
        .attr("fill", i === steps.length - 1 ? COLORS.negro : COLORS.soft)
        .attr("stroke", i === steps.length - 1 ? COLORS.negro : COLORS.primary)
        .attr("stroke-width", 2)
        .attr("opacity", 0)
        .attr("transform", "scale(0.9)")
        .transition()
        .delay(tDelay(100 + i * 140))
        .duration(tDur(450))
        .attr("opacity", 1)
        .attr("transform", "scale(1)");
      g.append("text")
        .attr("text-anchor", "middle")
        .attr("y", -6)
        .attr("fill", i === steps.length - 1 ? COLORS.white : COLORS.negro)
        .attr("font-family", "Roboto, system-ui, sans-serif")
        .attr("font-weight", 800)
        .attr("font-size", 16)
        .attr("opacity", 0)
        .text(s.label)
        .transition()
        .delay(tDelay(160 + i * 140))
        .duration(tDur(400))
        .attr("opacity", 1);
      g.append("text")
        .attr("text-anchor", "middle")
        .attr("y", 20)
        .attr("fill", i === steps.length - 1 ? "rgba(255,255,255,0.75)" : COLORS.gray)
        .attr("font-family", "Roboto, system-ui, sans-serif")
        .attr("font-size", 12)
        .attr("opacity", 0)
        .text(s.sub)
        .transition()
        .delay(tDelay(200 + i * 140))
        .duration(tDur(400))
        .attr("opacity", 1);

      if (i < steps.length - 1) {
        svg
          .append("line")
          .attr("x1", s.x + 84)
          .attr("y1", 160)
          .attr("x2", s.x + 84)
          .attr("y2", 160)
          .attr("stroke", COLORS.primary)
          .attr("stroke-width", 2.5)
          .attr("marker-end", "url(#uai-arrow-dc)")
          .transition()
          .delay(tDelay(220 + i * 140))
          .duration(tDur(380))
          .attr("x2", steps[i + 1].x - 84);
      }
    });

    label(svg, 460, 280, "Empezar por la decisión: el modelo solo alimenta un eslabón", {
      size: 13,
      fill: COLORS.gray,
      delay: 820,
    });
  }

  /** Fiabilidad compuesta ≈ producto de hops independientes. */
  function vizReliabilityProduct(el) {
    var w = 920;
    var h = 380;
    var svg = svgRoot(el, w, h);
    svg.append("title").text("Tres hops a 0.9 dan fiabilidad compuesta ~0.73");

    var hops = [
      { x: 140, p: "0.90" },
      { x: 340, p: "0.90" },
      { x: 540, p: "0.90" },
    ];

    hops.forEach(function (h0, i) {
      var g = svg.append("g").attr("transform", "translate(" + h0.x + ",160)");
      g.append("rect")
        .attr("x", -56)
        .attr("y", -40)
        .attr("width", 112)
        .attr("height", 80)
        .attr("rx", 2)
        .attr("fill", COLORS.soft)
        .attr("stroke", COLORS.primary)
        .attr("stroke-width", 2)
        .attr("opacity", 0)
        .transition()
        .delay(tDelay(100 + i * 140))
        .duration(tDur(420))
        .attr("opacity", 1);
      g.append("text")
        .attr("text-anchor", "middle")
        .attr("y", -6)
        .attr("fill", COLORS.gray)
        .attr("font-family", "Roboto, system-ui, sans-serif")
        .attr("font-size", 12)
        .attr("opacity", 0)
        .text("hop " + (i + 1))
        .transition()
        .delay(tDelay(140 + i * 140))
        .duration(tDur(350))
        .attr("opacity", 1);
      g.append("text")
        .attr("text-anchor", "middle")
        .attr("y", 22)
        .attr("fill", COLORS.negro)
        .attr("font-family", "Roboto, system-ui, sans-serif")
        .attr("font-weight", 800)
        .attr("font-size", 22)
        .attr("opacity", 0)
        .text(h0.p)
        .transition()
        .delay(tDelay(160 + i * 140))
        .duration(tDur(350))
        .attr("opacity", 1);

      if (i < hops.length - 1) {
        svg
          .append("text")
          .attr("x", (h0.x + hops[i + 1].x) / 2)
          .attr("y", 168)
          .attr("text-anchor", "middle")
          .attr("fill", COLORS.primary)
          .attr("font-family", "Roboto, system-ui, sans-serif")
          .attr("font-weight", 800)
          .attr("font-size", 28)
          .attr("opacity", 0)
          .text("×")
          .transition()
          .delay(tDelay(220 + i * 140))
          .duration(tDur(300))
          .attr("opacity", 1);
      }
    });

    var out = svg.append("g").attr("transform", "translate(760,160)");
    out
      .append("rect")
      .attr("x", -64)
      .attr("y", -40)
      .attr("width", 128)
      .attr("height", 80)
      .attr("rx", 2)
      .attr("fill", COLORS.negro)
      .attr("opacity", 0)
      .transition()
      .delay(tDelay(620))
      .duration(tDur(450))
      .attr("opacity", 1);
    out
      .append("text")
      .attr("text-anchor", "middle")
      .attr("y", -6)
      .attr("fill", "rgba(255,255,255,0.7)")
      .attr("font-family", "Roboto, system-ui, sans-serif")
      .attr("font-size", 12)
      .attr("opacity", 0)
      .text("sistema")
      .transition()
      .delay(tDelay(700))
      .duration(tDur(350))
      .attr("opacity", 1);
    out
      .append("text")
      .attr("text-anchor", "middle")
      .attr("y", 22)
      .attr("fill", COLORS.white)
      .attr("font-family", "Roboto, system-ui, sans-serif")
      .attr("font-weight", 800)
      .attr("font-size", 22)
      .attr("opacity", 0)
      .text("~0.73")
      .transition()
      .delay(tDelay(720))
      .duration(tDur(350))
      .attr("opacity", 1);

    svg
      .append("text")
      .attr("x", 650)
      .attr("y", 168)
      .attr("text-anchor", "middle")
      .attr("fill", COLORS.primary)
      .attr("font-family", "Roboto, system-ui, sans-serif")
      .attr("font-weight", 800)
      .attr("font-size", 28)
      .attr("opacity", 0)
      .text("=")
      .transition()
      .delay(tDelay(560))
      .duration(tDur(300))
      .attr("opacity", 1);

    label(svg, 460, 280, "Independientes: cada hop multiplica la chance de éxito", {
      size: 13,
      fill: COLORS.gray,
      delay: 900,
    });
  }

  /** Guardrails = política + medición + rollback (capas). */
  function vizGuardrails(el) {
    var w = 920;
    var h = 380;
    var svg = svgRoot(el, w, h);
    svg.append("title").text("Guardrails: política, medición y rollback");

    var layers = [
      { y: 70, label: "Política", sub: "límites · schema · herramientas", fill: COLORS.negro, ink: COLORS.white },
      { y: 170, label: "Medición", sub: "sample · jueces · señales de deriva", fill: COLORS.soft, ink: COLORS.negro },
      { y: 270, label: "Rollback", sub: "pin · canaria atrás · degradación", fill: COLORS.soft, ink: COLORS.negro },
    ];

    layers.forEach(function (L, i) {
      svg
        .append("rect")
        .attr("x", 120)
        .attr("y", L.y)
        .attr("width", 680)
        .attr("height", 78)
        .attr("rx", 2)
        .attr("fill", L.fill)
        .attr("stroke", i === 0 ? COLORS.negro : COLORS.primary)
        .attr("stroke-width", 2)
        .attr("opacity", 0)
        .attr("transform", "translate(0,18)")
        .transition()
        .delay(tDelay(120 * i))
        .duration(tDur(480))
        .attr("opacity", 1)
        .attr("transform", "translate(0,0)");
      svg
        .append("text")
        .attr("x", 460)
        .attr("y", L.y + 32)
        .attr("text-anchor", "middle")
        .attr("fill", L.ink)
        .attr("font-family", "Roboto, system-ui, sans-serif")
        .attr("font-weight", 800)
        .attr("font-size", 18)
        .attr("opacity", 0)
        .text(L.label)
        .transition()
        .delay(tDelay(160 + 120 * i))
        .duration(tDur(400))
        .attr("opacity", 1);
      svg
        .append("text")
        .attr("x", 460)
        .attr("y", L.y + 56)
        .attr("text-anchor", "middle")
        .attr("fill", i === 0 ? "rgba(255,255,255,0.75)" : COLORS.gray)
        .attr("font-family", "Roboto, system-ui, sans-serif")
        .attr("font-size", 13)
        .attr("opacity", 0)
        .text(L.sub)
        .transition()
        .delay(tDelay(220 + 120 * i))
        .duration(tDur(400))
        .attr("opacity", 1);
    });
  }

  /** Make vs buy: local · híbrido · managed bajo un contrato portable. */
  function vizMakeBuy(el) {
    var w = 920;
    var h = 380;
    var svg = svgRoot(el, w, h);
    svg.append("title").text("Opciones local, híbrido y managed bajo un contrato portable");

    var opts = [
      { x: 160, label: "Local", sub: "control · ops propias" },
      { x: 460, label: "Híbrido", sub: "borde propio + API" },
      { x: 760, label: "Managed", sub: "velocidad · acoplamiento" },
    ];

    svg
      .append("rect")
      .attr("x", 60)
      .attr("y", 48)
      .attr("width", 800)
      .attr("height", 56)
      .attr("rx", 2)
      .attr("fill", COLORS.negro)
      .attr("opacity", 0)
      .transition()
      .delay(tDelay(40))
      .duration(tDur(450))
      .attr("opacity", 1);
    svg
      .append("text")
      .attr("x", 460)
      .attr("y", 82)
      .attr("text-anchor", "middle")
      .attr("fill", COLORS.white)
      .attr("font-family", "Roboto, system-ui, sans-serif")
      .attr("font-weight", 800)
      .attr("font-size", 16)
      .attr("opacity", 0)
      .text("Contrato portable — API · artefactos · secretos fuera del vendor")
      .transition()
      .delay(tDelay(120))
      .duration(tDur(400))
      .attr("opacity", 1);

    opts.forEach(function (o, i) {
      var g = svg.append("g").attr("transform", "translate(" + o.x + ",220)");
      g.append("rect")
        .attr("x", -100)
        .attr("y", -48)
        .attr("width", 200)
        .attr("height", 96)
        .attr("rx", 2)
        .attr("fill", COLORS.soft)
        .attr("stroke", i === 1 ? COLORS.primary : COLORS.negro)
        .attr("stroke-width", i === 1 ? 2.5 : 1.5)
        .attr("opacity", 0)
        .attr("transform", "translate(0,16)")
        .transition()
        .delay(tDelay(200 + i * 140))
        .duration(tDur(450))
        .attr("opacity", 1)
        .attr("transform", "translate(0,0)");
      g.append("text")
        .attr("text-anchor", "middle")
        .attr("y", -8)
        .attr("fill", COLORS.negro)
        .attr("font-family", "Roboto, system-ui, sans-serif")
        .attr("font-weight", 800)
        .attr("font-size", 17)
        .attr("opacity", 0)
        .text(o.label)
        .transition()
        .delay(tDelay(260 + i * 140))
        .duration(tDur(400))
        .attr("opacity", 1);
      g.append("text")
        .attr("text-anchor", "middle")
        .attr("y", 18)
        .attr("fill", COLORS.gray)
        .attr("font-family", "Roboto, system-ui, sans-serif")
        .attr("font-size", 13)
        .attr("opacity", 0)
        .text(o.sub)
        .transition()
        .delay(tDelay(300 + i * 140))
        .duration(tDur(400))
        .attr("opacity", 1);

      svg
        .append("line")
        .attr("x1", o.x)
        .attr("y1", 104)
        .attr("x2", o.x)
        .attr("y2", 104)
        .attr("stroke", COLORS.primary)
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "5 4")
        .transition()
        .delay(tDelay(180 + i * 140))
        .duration(tDur(380))
        .attr("y2", 170);
    });

    label(svg, 460, 340, "Decidir por NFR; el plan de salida vive en el contrato", {
      size: 13,
      fill: COLORS.gray,
      delay: 780,
    });
  }

  /** Cadena claim → evidencia (design doc). */
  function vizClaimEvidence(el) {
    var w = 920;
    var h = 380;
    var svg = svgRoot(el, w, h);
    svg.append("title").text("Cadena claim, métrica, línea base, umbral; sin medir es riesgo");

    var steps = [
      { x: 110, label: "Claim", sub: "valor prometido" },
      { x: 310, label: "Métrica", sub: "observable" },
      { x: 510, label: "Baseline", sub: "hoy" },
      { x: 710, label: "Umbral", sub: "aceptar / no" },
    ];

    svg
      .append("defs")
      .append("marker")
      .attr("id", "uai-arrow-ce")
      .attr("viewBox", "0 0 10 10")
      .attr("refX", 9)
      .attr("refY", 5)
      .attr("markerWidth", 7)
      .attr("markerHeight", 7)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M 0 0 L 10 5 L 0 10 z")
      .attr("fill", COLORS.primary);

    steps.forEach(function (s, i) {
      var g = svg.append("g").attr("transform", "translate(" + s.x + ",140)");
      g.append("rect")
        .attr("x", -72)
        .attr("y", -36)
        .attr("width", 144)
        .attr("height", 72)
        .attr("rx", 2)
        .attr("fill", i === 0 ? COLORS.negro : COLORS.soft)
        .attr("stroke", i === 0 ? COLORS.negro : COLORS.primary)
        .attr("stroke-width", 2)
        .attr("opacity", 0)
        .attr("transform", "scale(0.9)")
        .transition()
        .delay(tDelay(100 + i * 140))
        .duration(tDur(450))
        .attr("opacity", 1)
        .attr("transform", "scale(1)");
      g.append("text")
        .attr("text-anchor", "middle")
        .attr("y", -4)
        .attr("fill", i === 0 ? COLORS.white : COLORS.negro)
        .attr("font-family", "Roboto, system-ui, sans-serif")
        .attr("font-weight", 800)
        .attr("font-size", 16)
        .attr("opacity", 0)
        .text(s.label)
        .transition()
        .delay(tDelay(160 + i * 140))
        .duration(tDur(400))
        .attr("opacity", 1);
      g.append("text")
        .attr("text-anchor", "middle")
        .attr("y", 18)
        .attr("fill", i === 0 ? "rgba(255,255,255,0.75)" : COLORS.gray)
        .attr("font-family", "Roboto, system-ui, sans-serif")
        .attr("font-size", 12)
        .attr("opacity", 0)
        .text(s.sub)
        .transition()
        .delay(tDelay(200 + i * 140))
        .duration(tDur(400))
        .attr("opacity", 1);

      if (i < steps.length - 1) {
        svg
          .append("line")
          .attr("x1", s.x + 78)
          .attr("y1", 140)
          .attr("x2", s.x + 78)
          .attr("y2", 140)
          .attr("stroke", COLORS.primary)
          .attr("stroke-width", 2.5)
          .attr("marker-end", "url(#uai-arrow-ce)")
          .transition()
          .delay(tDelay(220 + i * 140))
          .duration(tDur(380))
          .attr("x2", steps[i + 1].x - 78);
      }
    });

    var risk = svg.append("g").attr("transform", "translate(460,300)");
    risk
      .append("rect")
      .attr("x", -200)
      .attr("y", -28)
      .attr("width", 400)
      .attr("height", 56)
      .attr("rx", 2)
      .attr("fill", COLORS.soft)
      .attr("stroke", COLORS.negro)
      .attr("stroke-width", 1.5)
      .attr("stroke-dasharray", "6 4")
      .attr("opacity", 0)
      .transition()
      .delay(tDelay(780))
      .duration(tDur(450))
      .attr("opacity", 1);
    risk
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("fill", COLORS.negro)
      .attr("font-family", "Roboto, system-ui, sans-serif")
      .attr("font-weight", 700)
      .attr("font-size", 14)
      .attr("opacity", 0)
      .text("Sin medir → riesgo explícito en el doc")
      .transition()
      .delay(tDelay(860))
      .duration(tDur(400))
      .attr("opacity", 1);
  }

  /** De notebook a servicio (AI.Ops). */
  function vizNotebookToService(el) {
    var w = 920;
    var h = 360;
    var svg = svgRoot(el, w, h);
    svg.append("title").text("De cuaderno exploratorio a servicio versionado");

    var steps = [
      { x: 120, label: "Notebook", sub: "exploración" },
      { x: 340, label: "Artefactos", sub: "código · pesos · config" },
      { x: 560, label: "Imagen", sub: "contenedor + health" },
      { x: 780, label: "Servicio", sub: "API + SLO" },
    ];

    steps.forEach(function (s, i) {
      var g = svg.append("g").attr("transform", "translate(" + s.x + ",160)");
      g.append("circle")
        .attr("r", 0)
        .attr("fill", COLORS.primary)
        .transition()
        .delay(tDelay(100 + i * 160))
        .duration(tDur(400))
        .attr("r", 18);
      g.append("text")
        .attr("text-anchor", "middle")
        .attr("y", -48)
        .attr("fill", COLORS.negro)
        .attr("font-family", "Roboto, system-ui, sans-serif")
        .attr("font-weight", 800)
        .attr("font-size", 15)
        .attr("opacity", 0)
        .text(s.label)
        .transition()
        .delay(tDelay(160 + i * 160))
        .duration(tDur(400))
        .attr("opacity", 1);
      g.append("text")
        .attr("text-anchor", "middle")
        .attr("y", 48)
        .attr("fill", COLORS.gray)
        .attr("font-family", "Roboto, system-ui, sans-serif")
        .attr("font-size", 12)
        .attr("opacity", 0)
        .text(s.sub)
        .transition()
        .delay(tDelay(200 + i * 160))
        .duration(tDur(400))
        .attr("opacity", 1);

      if (i < steps.length - 1) {
        svg
          .append("line")
          .attr("x1", s.x + 28)
          .attr("y1", 160)
          .attr("x2", s.x + 28)
          .attr("y2", 160)
          .attr("stroke", COLORS.primary)
          .attr("stroke-width", 2.5)
          .transition()
          .delay(tDelay(220 + i * 160))
          .duration(tDur(400))
          .attr("x2", steps[i + 1].x - 28);
      }
    });
  }

  /** Anatomía de un prompt: capas de especificación. */
  function vizPromptAnatomy(el) {
    cineManual(el);
    var w = 920;
    var h = 400;
    var svg = svgRoot(el, w, h);
    svg.append("title").text("Anatomía de un prompt: rol, contexto, tarea, restricciones, formato, ejemplos");

    var layers = [
      { id: "rol", label: "Rol", sub: "quién actúa", y: 56 },
      { id: "ctx", label: "Contexto", sub: "mínimo útil", y: 112 },
      { id: "task", label: "Tarea", sub: "qué producir", y: 168 },
      { id: "rest", label: "Restricciones", sub: "límites / no-hacer", y: 224 },
      { id: "fmt", label: "Formato", sub: "salida validable", y: 280 },
      { id: "ex", label: "Ejemplos", sub: "few-shot si aportan", y: 336 },
    ];

    var x0 = 120;
    var barW = 680;
    var groups = [];

    layers.forEach(function (L, i) {
      var g = svg.append("g").attr("transform", "translate(" + x0 + "," + L.y + ")");
      var fill = i === 2 ? COLORS.primary : COLORS.soft;
      var stroke = i === 2 ? COLORS.primaryDark : COLORS.negro;
      g.append("rect")
        .attr("x", 0)
        .attr("y", -22)
        .attr("width", barW)
        .attr("height", 44)
        .attr("rx", 2)
        .attr("fill", fill)
        .attr("stroke", stroke)
        .attr("stroke-width", i === 2 ? 0 : 1.5);
      g.append("text")
        .attr("x", 20)
        .attr("y", 2)
        .attr("dominant-baseline", "middle")
        .attr("fill", i === 2 ? COLORS.white : COLORS.negro)
        .attr("font-family", "Roboto, system-ui, sans-serif")
        .attr("font-weight", 800)
        .attr("font-size", 16)
        .text(L.label);
      g.append("text")
        .attr("x", barW - 20)
        .attr("y", 2)
        .attr("text-anchor", "end")
        .attr("dominant-baseline", "middle")
        .attr("fill", i === 2 ? COLORS.white : COLORS.gray)
        .attr("font-family", "Roboto, system-ui, sans-serif")
        .attr("font-size", 13)
        .text(L.sub);
      groups.push(g.node());
    });

    var tl = cineTl();
    if (tl) {
      gsap.set(groups, { opacity: 0 });
      tl.to(groups, { opacity: 1, duration: 0.4, stagger: 0.1 }, 0.06);
    } else {
      groups.forEach(function (n, i) {
        d3.select(n)
          .attr("opacity", 0)
          .transition()
          .delay(tDelay(60 + i * 90))
          .duration(tDur(400))
          .attr("opacity", 1);
      });
    }
  }

  /** Misma semántica, distinto formato → score distinto (Sclar). */
  function vizPromptSensitivity(el) {
    cineManual(el);
    var w = 920;
    var h = 380;
    var svg = svgRoot(el, w, h);
    svg.append("title").text("Sensibilidad a features espurias del prompt");

    var rows = [
      { label: "Formato A · JSON + # headers", score: 0.92 },
      { label: "Formato B · mismo texto, bullets", score: 0.71 },
      { label: "Formato C · MAYÚSCULAS / orden", score: 0.58 },
    ];
    var x0 = 280;
    var maxW = 520;
    var bars = [];

    rows.forEach(function (r, i) {
      var y = 80 + i * 90;
      svg
        .append("text")
        .attr("x", x0 - 16)
        .attr("y", y + 18)
        .attr("text-anchor", "end")
        .attr("fill", COLORS.negro)
        .attr("font-family", "Roboto, system-ui, sans-serif")
        .attr("font-size", 14)
        .attr("font-weight", 500)
        .attr("opacity", 0)
        .text(r.label)
        .attr("class", "uai-sens-label");
      var g = svg.append("g");
      g.append("rect")
        .attr("x", x0)
        .attr("y", y)
        .attr("width", maxW * r.score)
        .attr("height", 36)
        .attr("rx", 2)
        .attr("fill", i === 0 ? COLORS.primary : COLORS.soft)
        .attr("stroke", i === 0 ? "none" : COLORS.negro)
        .attr("stroke-width", i === 0 ? 0 : 1.5);
      g.append("text")
        .attr("x", x0 + maxW * r.score + 12)
        .attr("y", y + 24)
        .attr("fill", COLORS.negro)
        .attr("font-family", "Roboto, system-ui, sans-serif")
        .attr("font-weight", 800)
        .attr("font-size", 15)
        .text(Math.round(r.score * 100) + "%");
      bars.push(g.node());
    });

    var cap = svg
      .append("text")
      .attr("x", 460)
      .attr("y", 350)
      .attr("text-anchor", "middle")
      .attr("fill", COLORS.gray)
      .attr("font-family", "Roboto, system-ui, sans-serif")
      .attr("font-size", 13)
      .attr("opacity", 0)
      .text("“Mismo significado” ≠ misma salida — fijá el formato canónico en el repo")
      .node();

    var labels = svg.selectAll(".uai-sens-label").nodes();
    var tl = cineTl();
    if (tl) {
      gsap.set(labels.concat(bars), { opacity: 0 });
      tl.to(labels, { opacity: 1, duration: 0.3, stagger: 0.12 }, 0.05)
        .to(bars, { opacity: 1, duration: 0.45, stagger: 0.14 }, 0.2)
        .to(cap, { opacity: 1, duration: 0.35 }, 0.85);
    } else {
      labels.concat(bars).forEach(function (n, i) {
        d3.select(n)
          .attr("opacity", 0)
          .transition()
          .delay(tDelay(80 + i * 100))
          .duration(tDur(400))
          .attr("opacity", 1);
      });
      d3.select(cap).transition().delay(tDelay(700)).duration(tDur(400)).attr("opacity", 1);
    }
  }

  /** CoT interno + verificación fuera del modelo. */
  function vizCotVerify(el) {
    cineManual(el);
    var w = 920;
    var h = 380;
    var svg = svgRoot(el, w, h);
    svg.append("title").text("Razonar adentro; verificar afuera");

    var boxes = [
      { x: 140, y: 140, w: 200, h: 100, title: "Scratchpad", sub: "pasos (privado)", fill: COLORS.soft },
      { x: 360, y: 140, w: 200, h: 100, title: "Respuesta", sub: "FINAL = n", fill: COLORS.soft },
      { x: 580, y: 140, w: 220, h: 100, title: "Verificador", sub: "eval / schema", fill: COLORS.primary },
    ];
    var nodes = [];

    boxes.forEach(function (b) {
      var g = svg.append("g").attr("transform", "translate(" + b.x + "," + b.y + ")");
      g.append("rect")
        .attr("width", b.w)
        .attr("height", b.h)
        .attr("rx", 2)
        .attr("fill", b.fill)
        .attr("stroke", b.fill === COLORS.primary ? "none" : COLORS.negro)
        .attr("stroke-width", 1.5);
      g.append("text")
        .attr("x", b.w / 2)
        .attr("y", 42)
        .attr("text-anchor", "middle")
        .attr("fill", b.fill === COLORS.primary ? COLORS.white : COLORS.negro)
        .attr("font-family", "Roboto, system-ui, sans-serif")
        .attr("font-weight", 800)
        .attr("font-size", 18)
        .text(b.title);
      g.append("text")
        .attr("x", b.w / 2)
        .attr("y", 68)
        .attr("text-anchor", "middle")
        .attr("fill", b.fill === COLORS.primary ? COLORS.white : COLORS.gray)
        .attr("font-family", "Roboto, system-ui, sans-serif")
        .attr("font-size", 13)
        .text(b.sub);
      nodes.push(g.node());
    });

    var arrows = [];
    [
      [340, 190, 360, 190],
      [560, 190, 580, 190],
    ].forEach(function (a) {
      arrows.push(
        svg
          .append("line")
          .attr("x1", a[0])
          .attr("y1", a[1])
          .attr("x2", a[2])
          .attr("y2", a[3])
          .attr("stroke", COLORS.primary)
          .attr("stroke-width", 2.5)
          .attr("opacity", 0)
          .node()
      );
    });

    var note = svg
      .append("text")
      .attr("x", 460)
      .attr("y", 300)
      .attr("text-anchor", "middle")
      .attr("fill", COLORS.gray)
      .attr("font-family", "Roboto, system-ui, sans-serif")
      .attr("font-size", 13)
      .attr("opacity", 0)
      .text("La cadena no es evidencia legal — el check externo sí")
      .node();

    var tl = cineTl();
    if (tl) {
      gsap.set(nodes, { opacity: 0, scale: 0.88, transformOrigin: "50% 50%" });
      tl.to(nodes, { opacity: 1, scale: 1, duration: 0.42, stagger: 0.16 }, 0.05)
        .to(arrows, { opacity: 1, duration: 0.35, stagger: 0.12 }, 0.45)
        .to(note, { opacity: 1, duration: 0.35 }, 0.9);
    } else {
      nodes.forEach(function (n, i) {
        d3.select(n)
          .attr("opacity", 0)
          .transition()
          .delay(tDelay(80 + i * 140))
          .duration(tDur(400))
          .attr("opacity", 1);
      });
      arrows.forEach(function (n, i) {
        d3.select(n)
          .transition()
          .delay(tDelay(400 + i * 120))
          .duration(tDur(350))
          .attr("opacity", 1);
      });
      d3.select(note).transition().delay(tDelay(800)).duration(tDur(400)).attr("opacity", 1);
    }
  }

  /** Instrucción vs contenido: la inyección indirecta cruza el canal de datos. */
  function vizInjectionSurface(el) {
    cineManual(el);
    var w = 920;
    var h = 360;
    var svg = svgRoot(el, w, h);
    svg.append("title").text("Superficie de inyección: instrucción vs contenido");

    var left = svg.append("g").attr("transform", "translate(80,80)");
    left
      .append("rect")
      .attr("width", 320)
      .attr("height", 180)
      .attr("rx", 2)
      .attr("fill", COLORS.soft)
      .attr("stroke", COLORS.negro)
      .attr("stroke-width", 1.5);
    left
      .append("text")
      .attr("x", 160)
      .attr("y", 48)
      .attr("text-anchor", "middle")
      .attr("fill", COLORS.primary)
      .attr("font-family", "Roboto, system-ui, sans-serif")
      .attr("font-weight", 800)
      .attr("font-size", 15)
      .text("Canal instrucción");
    left
      .append("text")
      .attr("x", 160)
      .attr("y", 100)
      .attr("text-anchor", "middle")
      .attr("fill", COLORS.negro)
      .attr("font-family", "Roboto, system-ui, sans-serif")
      .attr("font-size", 16)
      .text("System / developer");
    left
      .append("text")
      .attr("x", 160)
      .attr("y", 130)
      .attr("text-anchor", "middle")
      .attr("fill", COLORS.gray)
      .attr("font-family", "Roboto, system-ui, sans-serif")
      .attr("font-size", 13)
      .text("intención del producto");

    var right = svg.append("g").attr("transform", "translate(520,80)");
    right
      .append("rect")
      .attr("width", 320)
      .attr("height", 180)
      .attr("rx", 2)
      .attr("fill", COLORS.white)
      .attr("stroke", COLORS.primary)
      .attr("stroke-width", 2.5);
    right
      .append("text")
      .attr("x", 160)
      .attr("y", 48)
      .attr("text-anchor", "middle")
      .attr("fill", COLORS.primary)
      .attr("font-family", "Roboto, system-ui, sans-serif")
      .attr("font-weight", 800)
      .attr("font-size", 15)
      .text("Canal contenido");
    right
      .append("text")
      .attr("x", 160)
      .attr("y", 100)
      .attr("text-anchor", "middle")
      .attr("fill", COLORS.negro)
      .attr("font-family", "Roboto, system-ui, sans-serif")
      .attr("font-size", 16)
      .text("Web · correo · doc");
    right
      .append("text")
      .attr("x", 160)
      .attr("y", 130)
      .attr("text-anchor", "middle")
      .attr("fill", COLORS.gray)
      .attr("font-family", "Roboto, system-ui, sans-serif")
      .attr("font-size", 13)
      .text("puede traer “instrucciones”");

    var arrow = svg
      .append("line")
      .attr("x1", 410)
      .attr("y1", 170)
      .attr("x2", 510)
      .attr("y2", 170)
      .attr("stroke", COLORS.primaryDark)
      .attr("stroke-width", 2.5)
      .attr("stroke-dasharray", "6 4")
      .attr("opacity", 0)
      .node();

    var note = svg
      .append("text")
      .attr("x", 460)
      .attr("y", 310)
      .attr("text-anchor", "middle")
      .attr("fill", COLORS.gray)
      .attr("font-family", "Roboto, system-ui, sans-serif")
      .attr("font-size", 13)
      .attr("opacity", 0)
      .text("El modelo mezcla canales — el perímetro es de arquitectura")
      .node();

    var panels = [left.node(), right.node()];
    var tl = cineTl();
    if (tl) {
      gsap.set(panels, { opacity: 0 });
      tl.to(panels, { opacity: 1, duration: 0.4, stagger: 0.15 }, 0.05)
        .to(arrow, { opacity: 1, duration: 0.35 }, 0.45)
        .to(note, { opacity: 1, duration: 0.35 }, 0.7);
    } else {
      panels.forEach(function (n, i) {
        d3.select(n)
          .attr("opacity", 0)
          .transition()
          .delay(tDelay(60 + i * 120))
          .duration(tDur(400))
          .attr("opacity", 1);
      });
      d3.select(arrow).transition().delay(tDelay(400)).duration(tDur(350)).attr("opacity", 1);
      d3.select(note).transition().delay(tDelay(650)).duration(tDur(350)).attr("opacity", 1);
    }
  }

  /** Continuo de automatización (Parasuraman): de información a acción plena. */
  function vizAutomationLevels(el) {
    cineManual(el);
    var w = 920;
    var h = 360;
    var svg = svgRoot(el, w, h);
    svg.append("title").text("Niveles de automatización: de informar a actuar");

    var steps = [
      { label: "Informar", x: 100 },
      { label: "Sugerir", x: 300 },
      { label: "Consentir", x: 500 },
      { label: "Actuar", x: 700 },
    ];
    var nodes = [];

    svg
      .append("line")
      .attr("x1", 140)
      .attr("y1", 160)
      .attr("x2", 780)
      .attr("y2", 160)
      .attr("stroke", COLORS.border)
      .attr("stroke-width", 3);

    steps.forEach(function (s, i) {
      var g = svg.append("g").attr("transform", "translate(" + s.x + ",160)");
      g.append("circle")
        .attr("r", 18)
        .attr("fill", i === 3 ? COLORS.primary : COLORS.white)
        .attr("stroke", COLORS.negro)
        .attr("stroke-width", 2);
      g.append("text")
        .attr("y", 56)
        .attr("text-anchor", "middle")
        .attr("fill", COLORS.negro)
        .attr("font-family", "Roboto, system-ui, sans-serif")
        .attr("font-weight", 800)
        .attr("font-size", 15)
        .text(s.label);
      nodes.push(g.node());
    });

    var note = svg
      .append("text")
      .attr("x", 460)
      .attr("y", 280)
      .attr("text-anchor", "middle")
      .attr("fill", COLORS.gray)
      .attr("font-family", "Roboto, system-ui, sans-serif")
      .attr("font-size", 13)
      .attr("opacity", 0)
      .text("El nivel se elige por costo del error y reversibilidad — no por moda HITL")
      .node();

    var tl = cineTl();
    if (tl) {
      gsap.set(nodes, { opacity: 0 });
      tl.to(nodes, { opacity: 1, duration: 0.4, stagger: 0.12 }, 0.08).to(
        note,
        { opacity: 1, duration: 0.35 },
        0.65
      );
    } else {
      nodes.forEach(function (n, i) {
        d3.select(n)
          .attr("opacity", 0)
          .transition()
          .delay(tDelay(80 + i * 100))
          .duration(tDur(400))
          .attr("opacity", 1);
      });
      d3.select(note).transition().delay(tDelay(600)).duration(tDur(350)).attr("opacity", 1);
    }
  }

  /** Incertidumbre: actuar / abstenerse / escalar a humano. */
  function vizAbstainEscalate(el) {
    cineManual(el);
    var w = 920;
    var h = 360;
    var svg = svgRoot(el, w, h);
    svg.append("title").text("Ante incertidumbre: decidir, abstenerse o escalar");

    var start = svg.append("g").attr("transform", "translate(80,140)");
    start
      .append("rect")
      .attr("width", 160)
      .attr("height", 72)
      .attr("rx", 2)
      .attr("fill", COLORS.soft)
      .attr("stroke", COLORS.negro)
      .attr("stroke-width", 1.5);
    start
      .append("text")
      .attr("x", 80)
      .attr("y", 42)
      .attr("text-anchor", "middle")
      .attr("fill", COLORS.negro)
      .attr("font-family", "Roboto, system-ui, sans-serif")
      .attr("font-weight", 800)
      .attr("font-size", 15)
      .text("Predicción");

    var ends = [
      { x: 360, y: 60, label: "Actuar", sub: "bajo umbral de riesgo", fill: COLORS.soft },
      { x: 360, y: 144, label: "Abstenerse", sub: "salida legítima", fill: COLORS.primary },
      { x: 360, y: 228, label: "Escalar", sub: "humano / otro sistema", fill: COLORS.soft },
    ];
    var nodes = [start.node()];
    var lines = [];

    ends.forEach(function (e) {
      var g = svg.append("g").attr("transform", "translate(" + e.x + "," + e.y + ")");
      g.append("rect")
        .attr("width", 220)
        .attr("height", 72)
        .attr("rx", 2)
        .attr("fill", e.fill)
        .attr("stroke", e.fill === COLORS.primary ? "none" : COLORS.negro)
        .attr("stroke-width", 1.5);
      g.append("text")
        .attr("x", 110)
        .attr("y", 32)
        .attr("text-anchor", "middle")
        .attr("fill", e.fill === COLORS.primary ? COLORS.white : COLORS.negro)
        .attr("font-family", "Roboto, system-ui, sans-serif")
        .attr("font-weight", 800)
        .attr("font-size", 16)
        .text(e.label);
      g.append("text")
        .attr("x", 110)
        .attr("y", 54)
        .attr("text-anchor", "middle")
        .attr("fill", e.fill === COLORS.primary ? COLORS.white : COLORS.gray)
        .attr("font-family", "Roboto, system-ui, sans-serif")
        .attr("font-size", 12)
        .text(e.sub);
      nodes.push(g.node());
      lines.push(
        svg
          .append("line")
          .attr("x1", 240)
          .attr("y1", 176)
          .attr("x2", e.x)
          .attr("y2", e.y + 36)
          .attr("stroke", COLORS.primary)
          .attr("stroke-width", 2)
          .attr("opacity", 0)
          .node()
      );
    });

    var tl = cineTl();
    if (tl) {
      gsap.set(nodes, { opacity: 0 });
      tl.to(nodes, { opacity: 1, duration: 0.4, stagger: 0.12 }, 0.05).to(
        lines,
        { opacity: 1, duration: 0.35, stagger: 0.08 },
        0.4
      );
    } else {
      nodes.forEach(function (n, i) {
        d3.select(n)
          .attr("opacity", 0)
          .transition()
          .delay(tDelay(60 + i * 100))
          .duration(tDur(400))
          .attr("opacity", 1);
      });
      lines.forEach(function (n, i) {
        d3.select(n)
          .transition()
          .delay(tDelay(350 + i * 80))
          .duration(tDur(300))
          .attr("opacity", 1);
      });
    }
  }

  /** Lost in the middle: uso del contexto por posición (Liu et al.). */
  function vizLostMiddle(el) {
    cineManual(el);
    var w = 920;
    var h = 360;
    var svg = svgRoot(el, w, h);
    svg.append("title").text("Uso del contexto: peor en el medio");

    var zones = [
      { label: "Inicio", x: 120, h: 180, fill: COLORS.primary },
      { label: "Medio", x: 360, h: 90, fill: COLORS.soft },
      { label: "Final", x: 600, h: 165, fill: COLORS.primary },
    ];
    var bars = [];
    var baseY = 260;

    zones.forEach(function (z) {
      var g = svg.append("g");
      g.append("rect")
        .attr("x", z.x)
        .attr("y", baseY - z.h)
        .attr("width", 160)
        .attr("height", z.h)
        .attr("rx", 2)
        .attr("fill", z.fill)
        .attr("stroke", z.fill === COLORS.soft ? COLORS.negro : "none")
        .attr("stroke-width", 1.5);
      g.append("text")
        .attr("x", z.x + 80)
        .attr("y", baseY + 28)
        .attr("text-anchor", "middle")
        .attr("fill", COLORS.negro)
        .attr("font-family", "Roboto, system-ui, sans-serif")
        .attr("font-weight", 800)
        .attr("font-size", 15)
        .text(z.label);
      bars.push(g.node());
    });

    var note = svg
      .append("text")
      .attr("x", 460)
      .attr("y", 48)
      .attr("text-anchor", "middle")
      .attr("fill", COLORS.gray)
      .attr("font-family", "Roboto, system-ui, sans-serif")
      .attr("font-size", 13)
      .attr("opacity", 0)
      .text("Más contexto no basta si lo crítico queda en el valle")
      .node();

    var tl = cineTl();
    if (tl) {
      gsap.set(bars, { opacity: 0 });
      tl.to(bars, { opacity: 1, duration: 0.4, stagger: 0.14 }, 0.06).to(
        note,
        { opacity: 1, duration: 0.35 },
        0.55
      );
    } else {
      bars.forEach(function (n, i) {
        d3.select(n)
          .attr("opacity", 0)
          .transition()
          .delay(tDelay(60 + i * 120))
          .duration(tDur(400))
          .attr("opacity", 1);
      });
      d3.select(note).transition().delay(tDelay(500)).duration(tDur(350)).attr("opacity", 1);
    }
  }

  /** SFT vs alineación: dos objetivos distintos. */
  /** Suite de regresión: golden set → corrida → dims pass/fail. */
  function vizRegressionSuite(el) {
    cineManual(el);
    var w = 920;
    var h = 340;
    var svg = svgRoot(el, w, h);
    svg.append("title").text("Golden set versionado, corrida y veredicto por dimensión");

    var stages = [
      { title: "Golden set", sub: "cases.yaml", fill: COLORS.soft },
      { title: "Corrida", sub: "prompt × modelo", fill: COLORS.negro },
      { title: "Rúbrica", sub: "4 dimensiones", fill: COLORS.primary },
    ];
    var cardW = 220;
    var gap = 40;
    var startX = (w - (stages.length * cardW + (stages.length - 1) * gap)) / 2;
    var nodes = [];
    var arrows = [];

    stages.forEach(function (s, i) {
      var x = startX + i * (cardW + gap);
      var g = svg.append("g").attr("transform", "translate(" + x + ",70)");
      var ink = s.fill === COLORS.soft ? COLORS.negro : COLORS.white;
      var muted = s.fill === COLORS.soft ? COLORS.gray : "rgba(255,255,255,0.85)";
      g.append("rect")
        .attr("width", cardW)
        .attr("height", 160)
        .attr("rx", 2)
        .attr("fill", s.fill)
        .attr("stroke", s.fill === COLORS.soft ? COLORS.negro : "none")
        .attr("stroke-width", 1.5);
      g.append("text")
        .attr("x", cardW / 2)
        .attr("y", 58)
        .attr("text-anchor", "middle")
        .attr("fill", ink)
        .attr("font-family", "Roboto, system-ui, sans-serif")
        .attr("font-weight", 800)
        .attr("font-size", 20)
        .text(s.title);
      g.append("text")
        .attr("x", cardW / 2)
        .attr("y", 100)
        .attr("text-anchor", "middle")
        .attr("fill", muted)
        .attr("font-family", "Roboto, system-ui, sans-serif")
        .attr("font-size", 14)
        .text(s.sub);
      if (i === 2) {
        g.append("text")
          .attr("x", cardW / 2)
          .attr("y", 132)
          .attr("text-anchor", "middle")
          .attr("fill", COLORS.white)
          .attr("font-family", "Roboto, system-ui, sans-serif")
          .attr("font-size", 12)
          .attr("font-weight", 700)
          .text("formato · calidad · …");
      }
      nodes.push(g.node());
      if (i < stages.length - 1) {
        var ax = x + cardW + gap / 2;
        arrows.push(
          svg
            .append("text")
            .attr("x", ax)
            .attr("y", 160)
            .attr("text-anchor", "middle")
            .attr("fill", COLORS.gray)
            .attr("font-family", "Roboto, system-ui, sans-serif")
            .attr("font-weight", 800)
            .attr("font-size", 24)
            .attr("opacity", 0)
            .text("→")
            .node()
        );
      }
    });

    var foot = svg
      .append("text")
      .attr("x", w / 2)
      .attr("y", 300)
      .attr("text-anchor", "middle")
      .attr("fill", COLORS.gray)
      .attr("font-family", "Roboto, system-ui, sans-serif")
      .attr("font-size", 13)
      .attr("opacity", 0)
      .text("Lane 2: usar el LLM; el veredicto lo da el set + la rúbrica, no la intuición")
      .node();

    var tl = cineTl();
    if (tl) {
      gsap.set(nodes.concat(arrows), { opacity: 0 });
      tl.to(nodes[0], { opacity: 1, duration: 0.35 }, 0.05)
        .to(arrows[0], { opacity: 1, duration: 0.2 }, 0.3)
        .to(nodes[1], { opacity: 1, duration: 0.35 }, 0.4)
        .to(arrows[1], { opacity: 1, duration: 0.2 }, 0.65)
        .to(nodes[2], { opacity: 1, duration: 0.35 }, 0.75)
        .to(foot, { opacity: 1, duration: 0.28 }, 1.05);
    } else {
      nodes.forEach(function (n, i) {
        d3.select(n)
          .attr("opacity", 0)
          .transition()
          .delay(tDelay(70 + i * 160))
          .duration(tDur(360))
          .attr("opacity", 1);
      });
      arrows.forEach(function (a, i) {
        d3.select(a).transition().delay(tDelay(150 + i * 160)).duration(tDur(250)).attr("opacity", 1);
      });
      d3.select(foot).transition().delay(tDelay(650)).duration(tDur(280)).attr("opacity", 1);
    }
  }

  /** Multimodal: texto + imagen → modelo; OCR ≠ razonamiento. */
  function vizMultimodalSurface(el) {
    cineManual(el);
    var w = 920;
    var h = 360;
    var svg = svgRoot(el, w, h);
    svg.append("title").text("Canales multimodal: texto e imagen al mismo modelo");

    var nodes = [];
    var inputs = [
      { y: 50, title: "Imagen / PDF", sub: "píxeles · OCR" },
      { y: 180, title: "Texto", sub: "tokens" },
    ];
    inputs.forEach(function (inp) {
      var g = svg.append("g").attr("transform", "translate(70," + inp.y + ")");
      g.append("rect")
        .attr("width", 200)
        .attr("height", 100)
        .attr("rx", 2)
        .attr("fill", COLORS.soft)
        .attr("stroke", COLORS.negro)
        .attr("stroke-width", 1.5);
      g.append("text")
        .attr("x", 100)
        .attr("y", 42)
        .attr("text-anchor", "middle")
        .attr("fill", COLORS.negro)
        .attr("font-family", "Roboto, system-ui, sans-serif")
        .attr("font-weight", 800)
        .attr("font-size", 17)
        .text(inp.title);
      g.append("text")
        .attr("x", 100)
        .attr("y", 72)
        .attr("text-anchor", "middle")
        .attr("fill", COLORS.gray)
        .attr("font-family", "Roboto, system-ui, sans-serif")
        .attr("font-size", 13)
        .text(inp.sub);
      nodes.push(g.node());
      svg
        .append("line")
        .attr("x1", 280)
        .attr("y1", inp.y + 50)
        .attr("x2", 420)
        .attr("y2", 180)
        .attr("stroke", COLORS.border)
        .attr("stroke-width", 2);
    });

    var gModel = svg.append("g").attr("transform", "translate(430,110)");
    gModel
      .append("rect")
      .attr("width", 200)
      .attr("height", 140)
      .attr("rx", 2)
      .attr("fill", COLORS.negro);
    gModel
      .append("text")
      .attr("x", 100)
      .attr("y", 55)
      .attr("text-anchor", "middle")
      .attr("fill", COLORS.white)
      .attr("font-family", "Roboto, system-ui, sans-serif")
      .attr("font-weight", 800)
      .attr("font-size", 18)
      .text("Modelo");
    gModel
      .append("text")
      .attr("x", 100)
      .attr("y", 90)
      .attr("text-anchor", "middle")
      .attr("fill", "rgba(255,255,255,0.75)")
      .attr("font-family", "Roboto, system-ui, sans-serif")
      .attr("font-size", 13)
      .text("espacio común");
    nodes.push(gModel.node());

    svg
      .append("line")
      .attr("x1", 640)
      .attr("y1", 180)
      .attr("x2", 700)
      .attr("y2", 180)
      .attr("stroke", COLORS.border)
      .attr("stroke-width", 2);

    var gOut = svg.append("g").attr("transform", "translate(710,120)");
    gOut
      .append("rect")
      .attr("width", 160)
      .attr("height", 120)
      .attr("rx", 2)
      .attr("fill", COLORS.primary);
    gOut
      .append("text")
      .attr("x", 80)
      .attr("y", 50)
      .attr("text-anchor", "middle")
      .attr("fill", COLORS.white)
      .attr("font-family", "Roboto, system-ui, sans-serif")
      .attr("font-weight", 800)
      .attr("font-size", 16)
      .text("Salida");
    gOut
      .append("text")
      .attr("x", 80)
      .attr("y", 82)
      .attr("text-anchor", "middle")
      .attr("fill", "rgba(255,255,255,0.9)")
      .attr("font-family", "Roboto, system-ui, sans-serif")
      .attr("font-size", 12)
      .text("medir OCR ≠ CoT");
    nodes.push(gOut.node());

    var foot = svg
      .append("text")
      .attr("x", w / 2)
      .attr("y", 330)
      .attr("text-anchor", "middle")
      .attr("fill", COLORS.gray)
      .attr("font-family", "Roboto, system-ui, sans-serif")
      .attr("font-size", 13)
      .attr("opacity", 0)
      .text("Más modalidad → más superficie; costo/latencia suelen subir")
      .node();

    var tl = cineTl();
    if (tl) {
      gsap.set(nodes, { opacity: 0 });
      tl.to(nodes.slice(0, 2), { opacity: 1, duration: 0.35, stagger: 0.12 }, 0.05)
        .to(nodes[2], { opacity: 1, duration: 0.35 }, 0.4)
        .to(nodes[3], { opacity: 1, duration: 0.35 }, 0.65)
        .to(foot, { opacity: 1, duration: 0.25 }, 0.95);
    } else {
      nodes.forEach(function (n, i) {
        d3.select(n)
          .attr("opacity", 0)
          .transition()
          .delay(tDelay(60 + i * 120))
          .duration(tDur(360))
          .attr("opacity", 1);
      });
      d3.select(foot).transition().delay(tDelay(600)).duration(tDur(280)).attr("opacity", 1);
    }
  }

  /** Presupuesto del agente: pasos, tiempo, costo, HITL. */
  function vizAgentBudget(el) {
    cineManual(el);
    var w = 920;
    var h = 340;
    var svg = svgRoot(el, w, h);
    svg.append("title").text("Topes del agente: pasos, tiempo, costo, confirmación humana");

    var caps = [
      { title: "Pasos", sub: "máx. N", fill: COLORS.soft },
      { title: "Tiempo", sub: "timeout pared", fill: COLORS.soft },
      { title: "Costo", sub: "tokens / $", fill: COLORS.soft },
      { title: "HITL", sub: "irreversible", fill: COLORS.primary },
    ];
    var cardW = 180;
    var gap = 28;
    var startX = (w - (caps.length * cardW + (caps.length - 1) * gap)) / 2;
    var nodes = [];

    caps.forEach(function (c, i) {
      var x = startX + i * (cardW + gap);
      var g = svg.append("g").attr("transform", "translate(" + x + ",70)");
      var ink = c.fill === COLORS.primary ? COLORS.white : COLORS.negro;
      var muted = c.fill === COLORS.primary ? "rgba(255,255,255,0.85)" : COLORS.gray;
      g.append("rect")
        .attr("width", cardW)
        .attr("height", 180)
        .attr("rx", 2)
        .attr("fill", c.fill)
        .attr("stroke", c.fill === COLORS.soft ? COLORS.negro : "none")
        .attr("stroke-width", 1.5);
      g.append("text")
        .attr("x", cardW / 2)
        .attr("y", 70)
        .attr("text-anchor", "middle")
        .attr("fill", ink)
        .attr("font-family", "Roboto, system-ui, sans-serif")
        .attr("font-weight", 800)
        .attr("font-size", 22)
        .text(c.title);
      g.append("text")
        .attr("x", cardW / 2)
        .attr("y", 110)
        .attr("text-anchor", "middle")
        .attr("fill", muted)
        .attr("font-family", "Roboto, system-ui, sans-serif")
        .attr("font-size", 14)
        .text(c.sub);
      g.append("text")
        .attr("x", cardW / 2)
        .attr("y", 150)
        .attr("text-anchor", "middle")
        .attr("fill", c.fill === COLORS.primary ? COLORS.white : COLORS.primary)
        .attr("font-family", "Roboto, system-ui, sans-serif")
        .attr("font-weight", 700)
        .attr("font-size", 13)
        .text("tope " + (i + 1));
      nodes.push(g.node());
    });

    var foot = svg
      .append("text")
      .attr("x", w / 2)
      .attr("y", 300)
      .attr("text-anchor", "middle")
      .attr("fill", COLORS.gray)
      .attr("font-family", "Roboto, system-ui, sans-serif")
      .attr("font-size", 13)
      .attr("opacity", 0)
      .text("El runtime corta el loop — el prompt solo no basta")
      .node();

    var tl = cineTl();
    if (tl) {
      gsap.set(nodes, { opacity: 0 });
      tl.to(nodes, { opacity: 1, duration: 0.32, stagger: 0.1 }, 0.05).to(
        foot,
        { opacity: 1, duration: 0.28 },
        0.55
      );
    } else {
      nodes.forEach(function (n, i) {
        d3.select(n)
          .attr("opacity", 0)
          .transition()
          .delay(tDelay(70 + i * 110))
          .duration(tDur(360))
          .attr("opacity", 1);
      });
      d3.select(foot).transition().delay(tDelay(550)).duration(tDur(280)).attr("opacity", 1);
    }
  }

  /** Self-consistency: varias cadenas → voto (Wang et al. 2023). */
  function vizSelfConsistency(el) {
    cineManual(el);
    var w = 920;
    var h = 360;
    var svg = svgRoot(el, w, h);
    svg.append("title").text("Self-consistency: varias cadenas y un voto");

    var paths = [
      { y: 70, label: "cadena A", ans: "42" },
      { y: 150, label: "cadena B", ans: "42" },
      { y: 230, label: "cadena C", ans: "7" },
    ];
    var nodes = [];

    paths.forEach(function (p, i) {
      var g = svg.append("g");
      g.append("rect")
        .attr("x", 80)
        .attr("y", p.y)
        .attr("width", 280)
        .attr("height", 56)
        .attr("rx", 2)
        .attr("fill", COLORS.soft)
        .attr("stroke", COLORS.negro)
        .attr("stroke-width", 1.5);
      g.append("text")
        .attr("x", 100)
        .attr("y", p.y + 34)
        .attr("fill", COLORS.negro)
        .attr("font-family", "Roboto, system-ui, sans-serif")
        .attr("font-weight", 700)
        .attr("font-size", 15)
        .text(p.label);
      g.append("text")
        .attr("x", 330)
        .attr("y", p.y + 34)
        .attr("text-anchor", "end")
        .attr("fill", COLORS.primary)
        .attr("font-family", "Roboto, system-ui, sans-serif")
        .attr("font-weight", 800)
        .attr("font-size", 16)
        .text(p.ans);
      g.append("line")
        .attr("x1", 370)
        .attr("y1", p.y + 28)
        .attr("x2", 520)
        .attr("y2", 178)
        .attr("stroke", COLORS.border)
        .attr("stroke-width", 2);
      nodes.push(g.node());
    });

    var vote = svg.append("g").attr("transform", "translate(540,120)");
    vote
      .append("rect")
      .attr("width", 280)
      .attr("height", 120)
      .attr("rx", 2)
      .attr("fill", COLORS.primary);
    vote
      .append("text")
      .attr("x", 140)
      .attr("y", 48)
      .attr("text-anchor", "middle")
      .attr("fill", COLORS.white)
      .attr("font-family", "Roboto, system-ui, sans-serif")
      .attr("font-weight", 800)
      .attr("font-size", 18)
      .text("Voto / agregación");
    vote
      .append("text")
      .attr("x", 140)
      .attr("y", 84)
      .attr("text-anchor", "middle")
      .attr("fill", COLORS.white)
      .attr("font-family", "Roboto, system-ui, sans-serif")
      .attr("font-size", 22)
      .attr("font-weight", 800)
      .text("42");
    nodes.push(vote.node());

    var foot = svg
      .append("text")
      .attr("x", w / 2)
      .attr("y", 330)
      .attr("text-anchor", "middle")
      .attr("fill", COLORS.gray)
      .attr("font-family", "Roboto, system-ui, sans-serif")
      .attr("font-size", 13)
      .attr("opacity", 0)
      .text("Wang et al. 2023 — medir pass rate × tokens; diversidad ≠ verdad")
      .node();

    var tl = cineTl();
    if (tl) {
      gsap.set(nodes, { opacity: 0 });
      tl.to(nodes.slice(0, 3), { opacity: 1, duration: 0.3, stagger: 0.1 }, 0.05)
        .to(nodes[3], { opacity: 1, duration: 0.4 }, 0.45)
        .to(foot, { opacity: 1, duration: 0.25 }, 0.8);
    } else {
      nodes.forEach(function (n, i) {
        d3.select(n)
          .attr("opacity", 0)
          .transition()
          .delay(tDelay(60 + i * 100))
          .duration(tDur(350))
          .attr("opacity", 1);
      });
      d3.select(foot).transition().delay(tDelay(500)).duration(tDur(280)).attr("opacity", 1);
    }
  }

  /** Sesgos del juez LLM: posición, longitud, auto-preferencia (Zheng et al. 2023). */
  function vizJudgeBias(el) {
    cineManual(el);
    var w = 920;
    var h = 340;
    var svg = svgRoot(el, w, h);
    svg.append("title").text("Sesgos del juez: posición, longitud, familia del modelo");

    var biases = [
      { title: "Posición", sub: "A vs B primero", fix: "swap de orden" },
      { title: "Longitud", sub: "más tokens ≠ mejor", fix: "rúbrica fija" },
      { title: "Familia", sub: "auto-preferencia", fix: "juez distinto" },
    ];
    var cardW = 240;
    var gap = 36;
    var startX = (w - (biases.length * cardW + (biases.length - 1) * gap)) / 2;
    var nodes = [];

    biases.forEach(function (b, i) {
      var x = startX + i * (cardW + gap);
      var g = svg.append("g").attr("transform", "translate(" + x + ",55)");
      var fill = i === 1 ? COLORS.primary : COLORS.soft;
      var ink = i === 1 ? COLORS.white : COLORS.negro;
      var muted = i === 1 ? "rgba(255,255,255,0.85)" : COLORS.gray;
      g.append("rect")
        .attr("width", cardW)
        .attr("height", 200)
        .attr("rx", 2)
        .attr("fill", fill)
        .attr("stroke", fill === COLORS.soft ? COLORS.negro : "none")
        .attr("stroke-width", 1.5);
      g.append("text")
        .attr("x", cardW / 2)
        .attr("y", 48)
        .attr("text-anchor", "middle")
        .attr("fill", ink)
        .attr("font-family", "Roboto, system-ui, sans-serif")
        .attr("font-weight", 800)
        .attr("font-size", 20)
        .text(b.title);
      g.append("text")
        .attr("x", cardW / 2)
        .attr("y", 90)
        .attr("text-anchor", "middle")
        .attr("fill", muted)
        .attr("font-family", "Roboto, system-ui, sans-serif")
        .attr("font-size", 14)
        .text(b.sub);
      g.append("text")
        .attr("x", cardW / 2)
        .attr("y", 150)
        .attr("text-anchor", "middle")
        .attr("fill", i === 1 ? COLORS.white : COLORS.primary)
        .attr("font-family", "Roboto, system-ui, sans-serif")
        .attr("font-weight", 700)
        .attr("font-size", 13)
        .text("→ " + b.fix);
      nodes.push(g.node());
    });

    var foot = svg
      .append("text")
      .attr("x", w / 2)
      .attr("y", 300)
      .attr("text-anchor", "middle")
      .attr("fill", COLORS.gray)
      .attr("font-family", "Roboto, system-ui, sans-serif")
      .attr("font-size", 13)
      .attr("opacity", 0)
      .text("Zheng et al. 2023 — concordancia humano–juez como gate")
      .node();

    var tl = cineTl();
    if (tl) {
      gsap.set(nodes, { opacity: 0 });
      tl.to(nodes, { opacity: 1, duration: 0.35, stagger: 0.12 }, 0.05).to(
        foot,
        { opacity: 1, duration: 0.3 },
        0.55
      );
    } else {
      nodes.forEach(function (n, i) {
        d3.select(n)
          .attr("opacity", 0)
          .transition()
          .delay(tDelay(80 + i * 120))
          .duration(tDur(380))
          .attr("opacity", 1);
      });
      d3.select(foot).transition().delay(tDelay(550)).duration(tDur(300)).attr("opacity", 1);
    }
  }

  /** Prompt ⊂ contexto: system, tools/MCP, retrieval, historial, turno usuario. */
  function vizContextStack(el) {
    cineManual(el);
    var w = 920;
    var h = 360;
    var svg = svgRoot(el, w, h);
    svg.append("title").text("El prompt es una capa del contexto de inferencia");

    var layers = [
      { label: "System / instrucciones", note: "prompt base", fill: COLORS.negro, ink: COLORS.white },
      { label: "Tools · MCP · schemas", note: "capacidades", fill: COLORS.soft, ink: COLORS.negro },
      { label: "Retrieval / evidencias", note: "hechos externos", fill: COLORS.soft, ink: COLORS.negro },
      { label: "Historial · memoria", note: "estado multi-turno", fill: COLORS.soft, ink: COLORS.negro },
      { label: "Turno del usuario", note: "pedido actual", fill: COLORS.primary, ink: COLORS.white },
    ];
    var boxW = 520;
    var boxH = 44;
    var gap = 10;
    var totalH = layers.length * boxH + (layers.length - 1) * gap;
    var startY = (h - totalH) / 2;
    var x = (w - boxW) / 2 - 40;
    var nodes = [];

    layers.forEach(function (L, i) {
      var y = startY + i * (boxH + gap);
      var g = svg.append("g").attr("transform", "translate(" + x + "," + y + ")");
      g.append("rect")
        .attr("width", boxW)
        .attr("height", boxH)
        .attr("rx", 2)
        .attr("fill", L.fill)
        .attr("stroke", L.fill === COLORS.soft ? COLORS.negro : "none")
        .attr("stroke-width", 1.5);
      g.append("text")
        .attr("x", 18)
        .attr("y", 28)
        .attr("fill", L.ink)
        .attr("font-family", "Roboto, system-ui, sans-serif")
        .attr("font-weight", 800)
        .attr("font-size", 15)
        .text(L.label);
      g.append("text")
        .attr("x", boxW - 18)
        .attr("y", 28)
        .attr("text-anchor", "end")
        .attr("fill", L.fill === COLORS.soft ? COLORS.primary : L.fill === COLORS.negro ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.9)")
        .attr("font-family", "Roboto, system-ui, sans-serif")
        .attr("font-size", 13)
        .attr("font-weight", 600)
        .text(L.note);
      nodes.push(g.node());
    });

    var brace = svg
      .append("text")
      .attr("x", x + boxW + 36)
      .attr("y", startY + totalH / 2 + 6)
      .attr("fill", COLORS.gray)
      .attr("font-family", "Roboto, system-ui, sans-serif")
      .attr("font-weight", 800)
      .attr("font-size", 14)
      .attr("opacity", 0)
      .text("ventana")
      .node();

    var tl = cineTl();
    if (tl) {
      gsap.set(nodes, { opacity: 0 });
      tl.to(nodes, { opacity: 1, duration: 0.3, stagger: 0.08 }, 0.05).to(
        brace,
        { opacity: 1, duration: 0.25 },
        0.55
      );
    } else {
      nodes.forEach(function (n, i) {
        d3.select(n)
          .attr("opacity", 0)
          .transition()
          .delay(tDelay(60 + i * 90))
          .duration(tDur(320))
          .attr("opacity", 1);
      });
      d3.select(brace).transition().delay(tDelay(550)).duration(tDur(280)).attr("opacity", 1);
    }
  }

  /** Escalera de cuantización: FP16 → INT8 → INT4 (memoria ↓, riesgo de calidad ↑). */
  function vizQuantLadder(el) {
    cineManual(el);
    var w = 920;
    var h = 360;
    var svg = svgRoot(el, w, h);
    svg.append("title").text("Cuantización: menos bits, menos memoria, más riesgo de calidad");

    var steps = [
      { bits: "FP16", mem: "baseline", risk: "calidad ref.", fill: COLORS.negro, ink: COLORS.white },
      { bits: "INT8", mem: "memoria ↓", risk: "caída leve", fill: COLORS.soft, ink: COLORS.negro },
      { bits: "INT4", mem: "memoria ↓↓", risk: "medir set", fill: COLORS.primary, ink: COLORS.white },
    ];
    var cardW = 200;
    var gap = 40;
    var startX = (w - (steps.length * cardW + (steps.length - 1) * gap)) / 2;
    var nodes = [];
    var arrows = [];

    steps.forEach(function (s, i) {
      var x = startX + i * (cardW + gap);
      var g = svg.append("g").attr("transform", "translate(" + x + ",70)");
      g.append("rect")
        .attr("width", cardW)
        .attr("height", 200)
        .attr("rx", 2)
        .attr("fill", s.fill)
        .attr("stroke", s.fill === COLORS.soft ? COLORS.negro : "none")
        .attr("stroke-width", 1.5);
      g.append("text")
        .attr("x", cardW / 2)
        .attr("y", 58)
        .attr("text-anchor", "middle")
        .attr("fill", s.ink)
        .attr("font-family", "Roboto, system-ui, sans-serif")
        .attr("font-weight", 800)
        .attr("font-size", 26)
        .text(s.bits);
      g.append("text")
        .attr("x", cardW / 2)
        .attr("y", 110)
        .attr("text-anchor", "middle")
        .attr("fill", s.fill === COLORS.primary ? "rgba(255,255,255,0.9)" : s.fill === COLORS.negro ? "rgba(255,255,255,0.85)" : COLORS.gray)
        .attr("font-family", "Roboto, system-ui, sans-serif")
        .attr("font-size", 15)
        .text(s.mem);
      g.append("text")
        .attr("x", cardW / 2)
        .attr("y", 150)
        .attr("text-anchor", "middle")
        .attr("fill", s.fill === COLORS.soft ? COLORS.primary : s.ink)
        .attr("font-family", "Roboto, system-ui, sans-serif")
        .attr("font-weight", 700)
        .attr("font-size", 14)
        .text(s.risk);
      nodes.push(g.node());

      if (i < steps.length - 1) {
        var ax = x + cardW + gap / 2;
        var arrow = svg
          .append("text")
          .attr("x", ax)
          .attr("y", 180)
          .attr("text-anchor", "middle")
          .attr("fill", COLORS.gray)
          .attr("font-family", "Roboto, system-ui, sans-serif")
          .attr("font-weight", 800)
          .attr("font-size", 24)
          .attr("opacity", 0)
          .text("→")
          .node();
        arrows.push(arrow);
      }
    });

    var foot = svg
      .append("text")
      .attr("x", w / 2)
      .attr("y", 320)
      .attr("text-anchor", "middle")
      .attr("fill", COLORS.gray)
      .attr("font-family", "Roboto, system-ui, sans-serif")
      .attr("font-size", 13)
      .attr("opacity", 0)
      .text("Dettmers et al. 2023 — el claim de blog no reemplaza tu set de evaluación")
      .node();

    var tl = cineTl();
    if (tl) {
      gsap.set(nodes.concat(arrows), { opacity: 0 });
      tl.to(nodes[0], { opacity: 1, duration: 0.35 }, 0.05)
        .to(arrows[0], { opacity: 1, duration: 0.2 }, 0.3)
        .to(nodes[1], { opacity: 1, duration: 0.35 }, 0.4)
        .to(arrows[1], { opacity: 1, duration: 0.2 }, 0.65)
        .to(nodes[2], { opacity: 1, duration: 0.35 }, 0.75)
        .to(foot, { opacity: 1, duration: 0.3 }, 1.05);
    } else {
      nodes.forEach(function (n, i) {
        d3.select(n)
          .attr("opacity", 0)
          .transition()
          .delay(tDelay(80 + i * 180))
          .duration(tDur(380))
          .attr("opacity", 1);
      });
      arrows.forEach(function (a, i) {
        d3.select(a)
          .transition()
          .delay(tDelay(160 + i * 180))
          .duration(tDur(250))
          .attr("opacity", 1);
      });
      d3.select(foot).transition().delay(tDelay(700)).duration(tDur(300)).attr("opacity", 1);
    }
  }

  /** Apertura ≠ booleano: pesos, código, datos, licencia (Bommasani et al. 2021). */
  function vizOpennessAxes(el) {
    cineManual(el);
    var w = 920;
    var h = 340;
    var svg = svgRoot(el, w, h);
    svg.append("title").text("Apertura en cuatro ejes: pesos, código, datos, licencia");

    var axes = [
      { title: "Pesos", sub: "descargables", fill: COLORS.soft, ink: COLORS.negro },
      { title: "Código", sub: "entrenar / servir", fill: COLORS.soft, ink: COLORS.negro },
      { title: "Datos", sub: "trazables", fill: COLORS.soft, ink: COLORS.negro },
      { title: "Licencia", sub: "uso comercial", fill: COLORS.primary, ink: COLORS.white },
    ];
    var cardW = 190;
    var gap = 28;
    var startX = (w - (axes.length * cardW + (axes.length - 1) * gap)) / 2;
    var nodes = [];

    axes.forEach(function (a, i) {
      var x = startX + i * (cardW + gap);
      var g = svg.append("g").attr("transform", "translate(" + x + ",70)");
      g.append("rect")
        .attr("width", cardW)
        .attr("height", 180)
        .attr("rx", 2)
        .attr("fill", a.fill)
        .attr("stroke", a.fill === COLORS.primary ? "none" : COLORS.negro)
        .attr("stroke-width", 1.5);
      g.append("text")
        .attr("x", cardW / 2)
        .attr("y", 70)
        .attr("text-anchor", "middle")
        .attr("fill", a.ink)
        .attr("font-family", "Roboto, system-ui, sans-serif")
        .attr("font-weight", 800)
        .attr("font-size", 22)
        .text(a.title);
      g.append("text")
        .attr("x", cardW / 2)
        .attr("y", 110)
        .attr("text-anchor", "middle")
        .attr("fill", a.fill === COLORS.primary ? "rgba(255,255,255,0.85)" : COLORS.gray)
        .attr("font-family", "Roboto, system-ui, sans-serif")
        .attr("font-size", 14)
        .text(a.sub);
      g.append("text")
        .attr("x", cardW / 2)
        .attr("y", 150)
        .attr("text-anchor", "middle")
        .attr("fill", a.fill === COLORS.primary ? COLORS.white : COLORS.primary)
        .attr("font-family", "Roboto, system-ui, sans-serif")
        .attr("font-weight", 700)
        .attr("font-size", 13)
        .text("eje " + (i + 1));
      nodes.push(g.node());
    });

    var foot = svg
      .append("text")
      .attr("x", w / 2)
      .attr("y", 300)
      .attr("text-anchor", "middle")
      .attr("fill", COLORS.gray)
      .attr("font-family", "Roboto, system-ui, sans-serif")
      .attr("font-size", 13)
      .attr("opacity", 0)
      .text("Bommasani et al. 2021 — homogeneización si todos apuntan al mismo upstream")
      .node();

    var tl = cineTl();
    if (tl) {
      gsap.set(nodes, { opacity: 0 });
      tl.to(nodes, { opacity: 1, duration: 0.35, stagger: 0.1 }, 0.05).to(
        foot,
        { opacity: 1, duration: 0.3 },
        0.55
      );
    } else {
      nodes.forEach(function (n, i) {
        d3.select(n)
          .attr("opacity", 0)
          .transition()
          .delay(tDelay(80 + i * 120))
          .duration(tDur(380))
          .attr("opacity", 1);
      });
      d3.select(foot).transition().delay(tDelay(600)).duration(tDur(300)).attr("opacity", 1);
    }
  }

  /** LoRA: W congelado + ΔW = B·A de rango bajo (Hu et al. 2022). */
  function vizLoraAdapters(el) {
    cineManual(el);
    var w = 920;
    var h = 360;
    var svg = svgRoot(el, w, h);
    svg.append("title").text("LoRA: pesos congelados más adaptadores de bajo rango");

    var gW = svg.append("g").attr("transform", "translate(80,60)");
    gW.append("rect")
      .attr("width", 220)
      .attr("height", 220)
      .attr("rx", 2)
      .attr("fill", COLORS.soft)
      .attr("stroke", COLORS.negro)
      .attr("stroke-width", 1.5);
    // frozen grid
    for (var i = 0; i < 5; i++) {
      gW.append("line")
        .attr("x1", 20 + i * 40)
        .attr("y1", 30)
        .attr("x2", 20 + i * 40)
        .attr("y2", 190)
        .attr("stroke", COLORS.border)
        .attr("stroke-width", 1);
      gW.append("line")
        .attr("x1", 20)
        .attr("y1", 30 + i * 40)
        .attr("x2", 180)
        .attr("y2", 30 + i * 40)
        .attr("stroke", COLORS.border)
        .attr("stroke-width", 1);
    }
    gW.append("text")
      .attr("x", 110)
      .attr("y", 28)
      .attr("text-anchor", "middle")
      .attr("fill", COLORS.negro)
      .attr("font-family", "Roboto, system-ui, sans-serif")
      .attr("font-weight", 800)
      .attr("font-size", 20)
      .text("W congelado");
    gW.append("text")
      .attr("x", 110)
      .attr("y", 250)
      .attr("text-anchor", "middle")
      .attr("fill", COLORS.gray)
      .attr("font-family", "Roboto, system-ui, sans-serif")
      .attr("font-size", 13)
      .text("d × d · no se entrena");

    var plus = svg
      .append("text")
      .attr("x", 340)
      .attr("y", 180)
      .attr("text-anchor", "middle")
      .attr("fill", COLORS.gray)
      .attr("font-family", "Roboto, system-ui, sans-serif")
      .attr("font-weight", 800)
      .attr("font-size", 28)
      .text("+");

    var gBA = svg.append("g").attr("transform", "translate(390,60)");
    // B tall thin
    gBA
      .append("rect")
      .attr("x", 0)
      .attr("y", 40)
      .attr("width", 48)
      .attr("height", 160)
      .attr("rx", 2)
      .attr("fill", COLORS.primary);
    gBA
      .append("text")
      .attr("x", 24)
      .attr("y", 128)
      .attr("text-anchor", "middle")
      .attr("fill", COLORS.white)
      .attr("font-family", "Roboto, system-ui, sans-serif")
      .attr("font-weight", 800)
      .attr("font-size", 18)
      .text("B");
    gBA
      .append("text")
      .attr("x", 24)
      .attr("y", 220)
      .attr("text-anchor", "middle")
      .attr("fill", COLORS.gray)
      .attr("font-family", "Roboto, system-ui, sans-serif")
      .attr("font-size", 12)
      .text("d×r");
    // A wide short
    gBA
      .append("rect")
      .attr("x", 70)
      .attr("y", 100)
      .attr("width", 160)
      .attr("height", 48)
      .attr("rx", 2)
      .attr("fill", COLORS.negro);
    gBA
      .append("text")
      .attr("x", 150)
      .attr("y", 132)
      .attr("text-anchor", "middle")
      .attr("fill", COLORS.white)
      .attr("font-family", "Roboto, system-ui, sans-serif")
      .attr("font-weight", 800)
      .attr("font-size", 18)
      .text("A");
    gBA
      .append("text")
      .attr("x", 150)
      .attr("y", 175)
      .attr("text-anchor", "middle")
      .attr("fill", COLORS.gray)
      .attr("font-family", "Roboto, system-ui, sans-serif")
      .attr("font-size", 12)
      .text("r×d · r ≪ d");
    gBA
      .append("text")
      .attr("x", 115)
      .attr("y", 28)
      .attr("text-anchor", "middle")
      .attr("fill", COLORS.negro)
      .attr("font-family", "Roboto, system-ui, sans-serif")
      .attr("font-weight", 800)
      .attr("font-size", 18)
      .text("ΔW = B·A");

    var eq = svg
      .append("text")
      .attr("x", 700)
      .attr("y", 180)
      .attr("text-anchor", "middle")
      .attr("fill", COLORS.gray)
      .attr("font-family", "Roboto, system-ui, sans-serif")
      .attr("font-weight", 800)
      .attr("font-size", 28)
      .text("→");

    var gOut = svg.append("g").attr("transform", "translate(760,90)");
    gOut
      .append("rect")
      .attr("width", 120)
      .attr("height", 160)
      .attr("rx", 2)
      .attr("fill", COLORS.white)
      .attr("stroke", COLORS.primary)
      .attr("stroke-width", 2.5);
    gOut
      .append("text")
      .attr("x", 60)
      .attr("y", 70)
      .attr("text-anchor", "middle")
      .attr("fill", COLORS.negro)
      .attr("font-family", "Roboto, system-ui, sans-serif")
      .attr("font-weight", 800)
      .attr("font-size", 18)
      .text("W + ΔW");
    gOut
      .append("text")
      .attr("x", 60)
      .attr("y", 100)
      .attr("text-anchor", "middle")
      .attr("fill", COLORS.primary)
      .attr("font-family", "Roboto, system-ui, sans-serif")
      .attr("font-weight", 700)
      .attr("font-size", 13)
      .text("inferencia");
    gOut
      .append("text")
      .attr("x", 60)
      .attr("y", 190)
      .attr("text-anchor", "middle")
      .attr("fill", COLORS.gray)
      .attr("font-family", "Roboto, system-ui, sans-serif")
      .attr("font-size", 12)
      .text("Hu et al. 2022");

    var nodes = [gW.node(), plus.node(), gBA.node(), eq.node(), gOut.node()];
    var tl = cineTl();
    if (tl) {
      gsap.set(nodes, { opacity: 0 });
      tl.to(nodes[0], { opacity: 1, duration: 0.35 }, 0.05)
        .to(nodes[1], { opacity: 1, duration: 0.2 }, 0.3)
        .to(nodes[2], { opacity: 1, duration: 0.4 }, 0.4)
        .to(nodes[3], { opacity: 1, duration: 0.2 }, 0.7)
        .to(nodes[4], { opacity: 1, duration: 0.4 }, 0.8);
    } else {
      nodes.forEach(function (n, i) {
        d3.select(n)
          .attr("opacity", 0)
          .transition()
          .delay(tDelay(60 + i * 140))
          .duration(tDur(380))
          .attr("opacity", 1);
      });
    }
  }

  function vizSftAlign(el) {
    cineManual(el);
    var w = 920;
    var h = 340;
    var svg = svgRoot(el, w, h);
    svg.append("title").text("SFT enseña formato; alineación mueve preferencias");

    var cards = [
      {
        x: 100,
        title: "SFT",
        lines: ["Seguir instrucciones", "Formato y tareas", "Ouyang et al. 2022"],
        fill: COLORS.soft,
      },
      {
        x: 500,
        title: "Alineación",
        lines: ["Preferencias humanas", "RLHF o DPO", "Rafailov et al. 2023"],
        fill: COLORS.primary,
      },
    ];
    var nodes = [];

    cards.forEach(function (c) {
      var g = svg.append("g").attr("transform", "translate(" + c.x + ",70)");
      var ink = c.fill === COLORS.primary ? COLORS.white : COLORS.negro;
      var muted = c.fill === COLORS.primary ? COLORS.white : COLORS.gray;
      g.append("rect")
        .attr("width", 320)
        .attr("height", 200)
        .attr("rx", 2)
        .attr("fill", c.fill)
        .attr("stroke", c.fill === COLORS.primary ? "none" : COLORS.negro)
        .attr("stroke-width", 1.5);
      g.append("text")
        .attr("x", 160)
        .attr("y", 48)
        .attr("text-anchor", "middle")
        .attr("fill", ink)
        .attr("font-family", "Roboto, system-ui, sans-serif")
        .attr("font-weight", 800)
        .attr("font-size", 22)
        .text(c.title);
      c.lines.forEach(function (line, i) {
        g.append("text")
          .attr("x", 160)
          .attr("y", 100 + i * 28)
          .attr("text-anchor", "middle")
          .attr("fill", i === 2 ? muted : ink)
          .attr("font-family", "Roboto, system-ui, sans-serif")
          .attr("font-size", i === 2 ? 13 : 15)
          .attr("font-weight", i === 2 ? 500 : 500)
          .text(line);
      });
      nodes.push(g.node());
    });

    var plus = svg
      .append("text")
      .attr("x", 460)
      .attr("y", 180)
      .attr("text-anchor", "middle")
      .attr("fill", COLORS.gray)
      .attr("font-family", "Roboto, system-ui, sans-serif")
      .attr("font-weight", 800)
      .attr("font-size", 28)
      .attr("opacity", 0)
      .text("→")
      .node();

    var tl = cineTl();
    if (tl) {
      gsap.set(nodes, { opacity: 0 });
      tl.to(nodes[0], { opacity: 1, duration: 0.4 }, 0.05)
        .to(plus, { opacity: 1, duration: 0.25 }, 0.35)
        .to(nodes[1], { opacity: 1, duration: 0.4 }, 0.45);
    } else {
      nodes.forEach(function (n, i) {
        d3.select(n)
          .attr("opacity", 0)
          .transition()
          .delay(tDelay(80 + i * 200))
          .duration(tDur(400))
          .attr("opacity", 1);
      });
      d3.select(plus).transition().delay(tDelay(280)).duration(tDur(300)).attr("opacity", 1);
    }
  }


  /** Kleinberg: política de predicción (paraguas) vs causalidad (danza de la lluvia). */
  function vizPredictionPolicy(el) {
    cineManual(el);
    var w = 920;
    var h = 360;
    var svg = svgRoot(el, w, h);
    svg.append("title").text("Paraguas: basta predicción; danza de la lluvia: hace falta causalidad");

    var panels = [
      {
        x: 60,
        title: "Paraguas",
        need: "Basta predicción",
        why: "La acción no cambia\nsi lloverá: solo\nte prepara",
        ok: true,
      },
      {
        x: 490,
        title: "Danza de la lluvia",
        need: "Hace falta causalidad",
        why: "La acción pretende\ncausar lluvia:\npredicción no basta",
        ok: false,
      },
    ];

    var cards = [];
    var marks = [];
    var texts = [];

    panels.forEach(function (p) {
      var g = svg.append("g").attr("transform", "translate(" + p.x + ",48)");
      var fill = p.ok ? COLORS.soft : COLORS.white;
      var stroke = p.ok ? COLORS.primary : COLORS.negro;
      g.append("rect")
        .attr("width", 370)
        .attr("height", 240)
        .attr("rx", 2)
        .attr("fill", fill)
        .attr("stroke", stroke)
        .attr("stroke-width", 2.5);
      g.append("text")
        .attr("x", 24)
        .attr("y", 42)
        .attr("fill", COLORS.negro)
        .attr("font-family", "UAI Corporativo, Roboto, sans-serif")
        .attr("font-weight", 300)
        .attr("font-size", 26)
        .text(p.title);
      g.append("rect")
        .attr("x", 24)
        .attr("y", 58)
        .attr("width", 48)
        .attr("height", 3)
        .attr("fill", COLORS.primary);
      var need = g
        .append("text")
        .attr("x", 24)
        .attr("y", 100)
        .attr("fill", p.ok ? COLORS.primary : COLORS.negro)
        .attr("font-family", "Roboto, system-ui, sans-serif")
        .attr("font-weight", 800)
        .attr("font-size", 18)
        .text(p.need);
      texts.push(need.node());
      p.why.split("\n").forEach(function (line, i) {
        texts.push(
          g
            .append("text")
            .attr("x", 24)
            .attr("y", 148 + i * 28)
            .attr("fill", COLORS.gray)
            .attr("font-family", "Roboto, system-ui, sans-serif")
            .attr("font-size", 16)
            .text(line)
            .node()
        );
      });
      var badge = g
        .append("g")
        .attr("transform", "translate(290,28)");
      badge
        .append("circle")
        .attr("r", 22)
        .attr("fill", p.ok ? COLORS.primary : COLORS.negro);
      badge
        .append("text")
        .attr("text-anchor", "middle")
        .attr("dy", 6)
        .attr("fill", COLORS.white)
        .attr("font-family", "Roboto, system-ui, sans-serif")
        .attr("font-weight", 800)
        .attr("font-size", 16)
        .text(p.ok ? "OK" : "?");
      cards.push(g.node());
      marks.push(badge.node());
    });

    var foot = svg
      .append("text")
      .attr("x", w / 2)
      .attr("y", 330)
      .attr("text-anchor", "middle")
      .attr("fill", COLORS.gray)
      .attr("font-family", "Roboto, system-ui, sans-serif")
      .attr("font-size", 13)
      .attr("opacity", 0)
      .text("Kleinberg et al. (2015): ¿tu sistema solo anticipa, o pretende intervenir?")
      .node();

    var tl = cineTl();
    if (tl) {
      gsap.set(cards.concat(marks).concat(texts).concat([foot]), { opacity: 0 });
      tl.to(cards[0], { opacity: 1, duration: 0.4 }, 0.05)
        .to(marks[0], { opacity: 1, duration: 0.3 }, 0.25)
        .to(texts.slice(0, 4), { opacity: 1, duration: 0.35, stagger: 0.06 }, 0.35)
        .to(cards[1], { opacity: 1, duration: 0.4 }, 0.7)
        .to(marks[1], { opacity: 1, duration: 0.3 }, 0.95)
        .to(texts.slice(4), { opacity: 1, duration: 0.35, stagger: 0.06 }, 1.05)
        .to(foot, { opacity: 1, duration: 0.35 }, 1.45);
    } else {
      d3.selectAll(cards.concat(marks).concat(texts).concat([foot])).attr("opacity", 1);
    }
  }


  /** Regímenes de inferencia: batch / online / streaming / precómputo (desde NFR). */
  function vizInferenceRegimes(el) {
    cineManual(el);
    var w = 920;
    var h = 360;
    var svg = svgRoot(el, w, h);
    svg.append("title").text("Cuatro regímenes de inferencia elegidos por NFR, no por moda");

    var modes = [
      { title: "Batch", nfr: "Costo ↓", trade: "Frescura limitada", fill: COLORS.soft },
      { title: "Online", nfr: "Latencia estricta", trade: "Costo / request", fill: COLORS.negro },
      { title: "Streaming", nfr: "UX de tokens", trade: "Otra curva de falla", fill: COLORS.primary },
      { title: "Precómputo", nfr: "Carga anticipada", trade: "Frescura vs store", fill: COLORS.soft },
    ];
    var cardW = 200;
    var gap = 20;
    var startX = (w - (modes.length * cardW + (modes.length - 1) * gap)) / 2;
    var cards = [];
    var texts = [];

    modes.forEach(function (m, i) {
      var x = startX + i * (cardW + gap);
      var g = svg.append("g").attr("transform", "translate(" + x + ",56)");
      var dark = m.fill === COLORS.negro || m.fill === COLORS.primary;
      var ink = dark ? COLORS.white : COLORS.negro;
      var muted = dark ? "rgba(255,255,255,0.8)" : COLORS.gray;
      g.append("rect")
        .attr("width", cardW)
        .attr("height", 210)
        .attr("rx", 2)
        .attr("fill", m.fill)
        .attr("stroke", m.fill === COLORS.soft ? COLORS.negro : "none")
        .attr("stroke-width", 1.5);
      g.append("text")
        .attr("x", cardW / 2)
        .attr("y", 48)
        .attr("text-anchor", "middle")
        .attr("fill", ink)
        .attr("font-family", "Roboto, system-ui, sans-serif")
        .attr("font-weight", 800)
        .attr("font-size", 18)
        .text(m.title);
      g.append("rect")
        .attr("x", cardW / 2 - 24)
        .attr("y", 62)
        .attr("width", 48)
        .attr("height", 3)
        .attr("fill", dark ? COLORS.white : COLORS.primary);
      texts.push(
        g
          .append("text")
          .attr("x", cardW / 2)
          .attr("y", 110)
          .attr("text-anchor", "middle")
          .attr("fill", dark ? COLORS.white : COLORS.primary)
          .attr("font-family", "Roboto, system-ui, sans-serif")
          .attr("font-weight", 800)
          .attr("font-size", 13)
          .text(m.nfr)
          .node()
      );
      texts.push(
        g
          .append("text")
          .attr("x", cardW / 2)
          .attr("y", 150)
          .attr("text-anchor", "middle")
          .attr("fill", muted)
          .attr("font-family", "Roboto, system-ui, sans-serif")
          .attr("font-size", 13)
          .text(m.trade)
          .node()
      );
      cards.push(g.node());
    });

    var foot = svg
      .append("text")
      .attr("x", w / 2)
      .attr("y", 320)
      .attr("text-anchor", "middle")
      .attr("fill", COLORS.gray)
      .attr("font-family", "Roboto, system-ui, sans-serif")
      .attr("font-size", 13)
      .attr("opacity", 0)
      .text("Huyen (2022): el régimen se deriva del presupuesto NFR, no del modelo de moda")
      .node();

    var tl = cineTl();
    if (tl) {
      gsap.set(cards.concat(texts).concat([foot]), { opacity: 0 });
      tl.to(cards, { opacity: 1, duration: 0.35, stagger: 0.12 }, 0.05)
        .to(texts, { opacity: 1, duration: 0.3, stagger: 0.04 }, 0.35)
        .to(foot, { opacity: 1, duration: 0.35 }, 1.0);
    } else {
      d3.selectAll(cards.concat(texts).concat([foot])).attr("opacity", 1);
    }
  }

  var registry = {
    "react-loop": vizReactLoop,
    "prompt-anatomy": vizPromptAnatomy,
    "prompt-sensitivity": vizPromptSensitivity,
    "cot-verify": vizCotVerify,
    "injection-surface": vizInjectionSurface,
    "automation-levels": vizAutomationLevels,
    "abstain-escalate": vizAbstainEscalate,
    "lost-middle": vizLostMiddle,
    "sft-align": vizSftAlign,
    "lora-adapters": vizLoraAdapters,
    "openness-axes": vizOpennessAxes,
    "quant-ladder": vizQuantLadder,
    "context-stack": vizContextStack,
    "judge-bias": vizJudgeBias,
    "self-consistency": vizSelfConsistency,
    "agent-budget": vizAgentBudget,
    "multimodal-surface": vizMultimodalSurface,
    "regression-suite": vizRegressionSuite,
    "prediction-policy": vizPredictionPolicy,
    "inference-regimes": vizInferenceRegimes,
    autoregressive: vizAutoregressive,
    "eval-levels": vizEvalLevels,
    "notebook-to-service": vizNotebookToService,
    multiagent: vizMultiagent,
    "claim-evidence": vizClaimEvidence,
    "make-buy": vizMakeBuy,
    guardrails: vizGuardrails,
    "reliability-product": vizReliabilityProduct,
    "decision-chain": vizDecisionChain,
    "rag-pipeline": vizRagPipeline,
    "train-serve-skew": vizTrainServeSkew,
    "ci-pipeline": vizCiPipeline,
    "canary-deploy": vizCanaryDeploy,
    "obs-layers": vizObsLayers,
    "posttrain-pipeline": vizPosttrainPipeline,
    "adapt-routes": vizAdaptRoutes,
    "cost-crossover": vizCostCrossover,
    "latency-ttft-tpot": vizLatencyTtftTpot,
    "eval-domain": vizEvalDomain,
    "risk-layers": vizRiskLayers,
  };

  function mount(el) {
    if (!el || mounted.has(el)) return;
    var name = el.getAttribute("data-viz");
    var fn = registry[name];
    if (!fn || typeof d3 === "undefined") {
      el.textContent = "Ilustración no disponible (" + (name || "?") + ")";
      return;
    }
    mounted.add(el);
    fn(el);
    // requestAnimationFrame: let D3 finish sync attrs, then GSAP owns the enter
    requestAnimationFrame(function () {
      enhanceCine(el);
    });
  }

  function remount(el) {
    if (!el) return;
    gsap && gsap.killTweensOf && el.querySelector("svg") && gsap.killTweensOf(el.querySelectorAll("*"));
    mounted.delete(el);
    el.removeAttribute("data-cine");
    mount(el);
  }

  function scan(root) {
    (root || document)
      .querySelectorAll("[data-viz]")
      .forEach(function (el) {
        var section = el.closest("section");
        if (section && section.classList.contains("present")) mount(el);
      });
  }

  function bindReveal() {
    if (!global.Reveal || typeof global.Reveal.on !== "function") return;
    global.Reveal.on("slidechanged", function (ev) {
      var slide = ev.currentSlide;
      if (!slide) return;
      slide.querySelectorAll("[data-viz]").forEach(function (el) {
        remount(el);
      });
    });
    global.Reveal.on("ready", function () {
      scan(document);
    });
  }

  global.UaiRevealViz = { mount: mount, remount: remount, scan: scan, registry: registry };
  if (document.readyState === "complete") bindReveal();
  else window.addEventListener("load", bindReveal);
})(window);

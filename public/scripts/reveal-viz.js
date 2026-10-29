/**
 * Ilustraciones D3 para clases Reveal (identidad UAI).
 * Cada slide con [data-viz] se monta al entrar (slidechanged) y anima una vez.
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
  function tDelay(ms) {
    return MOTION ? ms : 0;
  }
  function tDur(ms) {
    return MOTION ? ms : 0;
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

    var gLinks = svg.append("g");
    var gNodes = svg.append("g");

    links.forEach(function (L, i) {
      var a = nodes[L.s];
      var b = nodes[L.t];
      var path;
      if (L.loop) {
        path = "M" + (a.x - 40) + "," + (a.y + 36) + " C " + (a.x - 120) + "," + (a.y + 140) + " " + (b.x + 120) + "," + (b.y + 140) + " " + (b.x + 40) + "," + (b.y + 36);
      } else if (L.finish) {
        path = "M" + a.x + "," + (a.y + 36) + " L " + b.x + "," + (b.y - 36);
      } else {
        path = "M" + (a.x + 70) + "," + a.y + " L " + (b.x - 70) + "," + b.y;
      }
      gLinks
        .append("path")
        .attr("d", path)
        .attr("fill", "none")
        .attr("stroke", L.finish ? COLORS.primaryDark : COLORS.primary)
        .attr("stroke-width", L.finish ? 2.5 : 2)
        .attr("stroke-dasharray", L.loop ? "6 4" : null)
        .attr("opacity", 0)
        .attr("marker-end", "url(#uai-arrow)")
        .transition()
        .delay(tDelay(200 + i * 180))
        .duration(tDur(500))
        .attr("opacity", 1);
    });

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

    nodes.forEach(function (n, i) {
      var g = gNodes.append("g").attr("transform", "translate(" + n.x + "," + n.y + ")");
      g.append("rect")
        .attr("x", -70)
        .attr("y", -28)
        .attr("width", 140)
        .attr("height", 56)
        .attr("rx", 2)
        .attr("fill", n.id === "finish" ? COLORS.primary : COLORS.soft)
        .attr("stroke", COLORS.negro)
        .attr("stroke-width", n.id === "finish" ? 0 : 1.5)
        .attr("opacity", 0)
        .attr("transform", "scale(0.85)")
        .transition()
        .delay(tDelay(80 + i * 120))
        .duration(tDur(450))
        .attr("opacity", 1)
        .attr("transform", "scale(1)");
      g.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .attr("fill", n.id === "finish" ? COLORS.white : COLORS.negro)
        .attr("font-family", "Roboto, system-ui, sans-serif")
        .attr("font-weight", 800)
        .attr("font-size", 16)
        .attr("opacity", 0)
        .text(n.label)
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

  var registry = {
    "react-loop": vizReactLoop,
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
  }

  function remount(el) {
    if (!el) return;
    mounted.delete(el);
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

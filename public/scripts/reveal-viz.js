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
      .delay(opts.delay || 0)
      .duration(450)
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
        .delay(200 + i * 180)
        .duration(500)
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
        .delay(80 + i * 120)
        .duration(450)
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
        .delay(160 + i * 120)
        .duration(400)
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

    var tokens = ["El", "modelo", "predice", "xₜ", "|", "x_<t"];
    var startX = 80;
    var y = 160;
    var gap = 118;

    tokens.forEach(function (t, i) {
      var g = svg.append("g").attr("transform", "translate(" + (startX + i * gap) + "," + y + ")");
      g.append("rect")
        .attr("x", -48)
        .attr("y", -30)
        .attr("width", 96)
        .attr("height", 60)
        .attr("rx", 2)
        .attr("fill", i >= 3 ? COLORS.primary : COLORS.soft)
        .attr("stroke", COLORS.negro)
        .attr("stroke-width", 1.5)
        .attr("opacity", 0)
        .attr("y", -10)
        .transition()
        .delay(120 * i)
        .duration(420)
        .attr("opacity", 1)
        .attr("y", -30);
      g.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .attr("font-family", "Roboto, system-ui, sans-serif")
        .attr("font-weight", i >= 3 ? 800 : 500)
        .attr("font-size", 16)
        .attr("fill", i >= 3 ? COLORS.white : COLORS.negro)
        .attr("opacity", 0)
        .text(t)
        .transition()
        .delay(140 * i)
        .duration(400)
        .attr("opacity", 1);

      if (i < tokens.length - 1 && t !== "|" && tokens[i + 1] !== "|") {
        svg
          .append("path")
          .attr("d", "M" + (startX + i * gap + 52) + "," + y + " L" + (startX + (i + 1) * gap - 52) + "," + y)
          .attr("stroke", COLORS.primary)
          .attr("stroke-width", 2)
          .attr("opacity", 0)
          .transition()
          .delay(180 + 120 * i)
          .duration(350)
          .attr("opacity", 1);
      }
    });

    label(svg, 460, 60, "P(xₜ | x_<t) — cada paso condiciona al siguiente", {
      size: 15,
      weight: 700,
      fill: COLORS.negro,
      delay: 200,
    });
    label(svg, 460, 290, "Errores tempranos se propagan; el formato se decide paso a paso", {
      size: 13,
      fill: COLORS.gray,
      delay: 800,
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
        .delay(150 * i)
        .duration(500)
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
        .delay(200 + 150 * i)
        .duration(400)
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
        .delay(260 + 150 * i)
        .duration(400)
        .attr("opacity", 1);
    });
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
        .delay(100 + i * 160)
        .duration(400)
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
        .delay(160 + i * 160)
        .duration(400)
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
        .delay(200 + i * 160)
        .duration(400)
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
          .delay(220 + i * 160)
          .duration(400)
          .attr("x2", steps[i + 1].x - 28);
      }
    });
  }

  var registry = {
    "react-loop": vizReactLoop,
    autoregressive: vizAutoregressive,
    "eval-levels": vizEvalLevels,
    "notebook-to-service": vizNotebookToService,
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

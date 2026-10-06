/* Mongabay 2026_089: interactive report card.
   Draws content.js + data.js into index.html and runs the hover cards:
   hover or focus shows a card, click or tap pins it, a click elsewhere or Escape closes it. */
(function () {
  "use strict";

  var C = window.RC_CONTENT;
  var D = window.RC_DATA;

  // ---------------------------------------------------------------- settings
  var CFG = {
    dotRows: 4,          // adjust dots per column here (each state's boats fill columns top to bottom)
    dotPitch: 9,         // adjust spacing between dot centres here (px)
    dotR: 3.6,           // adjust dot radius here (px)
    fundsMax: 1400,      // ₹ million at the right edge of the funds column
    ticks: [0, 500, 1000], // adjust the funds scale labels here
    minSeg: 0.005,       // a "not available" piece smaller than this share of its bar is not drawn
    cardGap: 10,         // adjust space between a mark and its hover card here (px)
    hideDelay: 140,      // ms before a card closes once the pointer leaves its mark
  };

  var NS = "http://www.w3.org/2000/svg";
  var fig = document.getElementById("rc");
  var tip = document.getElementById("rc-tip");
  var num = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 });
  var byKey = {};
  D.forEach(function (d) { byKey[d.key] = d; });
  var maxCols = Math.ceil(Math.max.apply(null, D.map(function (d) { return d.sanctioned || 0; })) / CFG.dotRows);

  // ---------------------------------------------------------------- helpers
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function svgEl(tag, attrs) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function name(key) { return C.names[key] || key; }
  function money(v) { return "₹" + num.format(v) + " " + C.tip.million; }
  function isNum(v) { return typeof v === "number"; }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  // the bar's pieces in drawing order. A missing share leaves a "not available" piece; shares that are all known but
  // don't add up to the total (Andaman and Nicobar Islands) leave none, since a footnote explains the gap
  function fundParts(d) {
    var parts = [], known = 0;
    [["central", d.central], ["state", d.state], ["beneficiary", d.beneficiary]].forEach(function (p) {
      if (isNum(p[1]) && p[1] > 0) { parts.push({ kind: p[0], value: p[1] }); known += p[1]; }
    });
    var missing = !isNum(d.central) || (d.state !== "ut" && !isNum(d.state)) || !isNum(d.beneficiary);
    var rest = missing ? d.total - known : 0;
    return { parts: parts, rest: rest > 0.05 ? rest : 0 };
  }

  // ---------------------------------------------------------------- title block, legend, callout, footer
  document.getElementById("rc-title").textContent = C.title;
  document.getElementById("rc-deck").textContent = C.deck;

  var L = C.legend;
  var legend = document.getElementById("rc-legend");
  function legendRow(title, items, unit) {
    var row = el("div", "rc-legend__row");
    var list = el("div", "rc-legend__items");
    row.appendChild(el("span", "rc-legend__title", title));
    items.forEach(function (it) {
      var item = el("span", "rc-legend__item");
      item.appendChild(el("span", it[0]));
      item.appendChild(document.createTextNode(it[1]));
      list.appendChild(item);
    });
    if (unit) list.appendChild(el("span", "rc-legend__unit", unit));
    row.appendChild(list);
    legend.appendChild(row);
  }
  var boatKeys = [["rc-key-dot k-built", L.built], ["rc-key-dot k-idle", L.idle]];
  if (D.some(function (d) { return d.sanctioned && d.built == null; })) boatKeys.push(["rc-key-dot k-unknown", L.unknown]);
  legendRow(L.boats, boatKeys, L.unit);
  legendRow(L.funds, [
    ["rc-key-bar rc-seg--central", L.central],
    ["rc-key-bar rc-seg--state", L.state],
    ["rc-key-bar rc-seg--beneficiary", L.beneficiary],
    ["rc-key-bar rc-seg--na", L.na],
  ]);

  var stat = document.getElementById("rc-stat");
  stat.appendChild(el("span", "rc-stat__value", C.callout.value));
  stat.appendChild(el("span", "rc-stat__label", C.callout.label));

  var notes = document.getElementById("rc-notes");
  C.notes.forEach(function (line) { notes.appendChild(el("p", null, line)); });
  document.getElementById("rc-source").textContent = C.source;

  // ---------------------------------------------------------------- table
  var table = document.getElementById("rc-table");

  function cell(cls, role) {
    var c = el("div", "rc-cell " + cls);
    c.setAttribute("role", role || "cell");
    return c;
  }

  var head = el("div", "rc-row rc-row--head");
  head.setAttribute("role", "row");
  ["name", "boats", "funds"].forEach(function (k) {
    var h = cell("rc-" + k, "columnheader");
    h.appendChild(el("span", null, C.headers[k]));
    if (k === "funds") {
      var ticks = el("div", "rc-ticks");
      ticks.setAttribute("aria-hidden", "true");
      CFG.ticks.forEach(function (t) {
        var s = el("span", null, num.format(t));
        s.style.left = (t / CFG.fundsMax) * 100 + "%";
        ticks.appendChild(s);
      });
      h.appendChild(ticks);
    }
    head.appendChild(h);
  });
  table.appendChild(head);

  C.order.forEach(function (key) {
    var d = byKey[key];
    if (!d) return;
    var row = el("div", "rc-row");
    row.setAttribute("role", "row");

    var nameCell = cell("rc-name", "rowheader");
    nameCell.appendChild(document.createTextNode(name(key)));
    if (C.ut.indexOf(key) > -1) nameCell.appendChild(el("span", "rc-ut", C.utTag)); // a plain tag: the footer note explains it

    var boats = cell("rc-boats");
    if (d.sanctioned == null) boats.appendChild(el("span", "rc-none", C.unavailable));
    else if (d.sanctioned) boats.appendChild(dots(d));
    else boats.appendChild(el("span", "rc-none", C.none));

    var funds = cell("rc-funds");
    if (isNum(d.total) && d.total > 0) funds.appendChild(fundsBar(d));

    row.appendChild(nameCell);
    row.appendChild(boats);
    row.appendChild(funds);
    table.appendChild(row);
  });

  // one dot per boat, filled column by column; every row shares one scale
  function dots(d) {
    var cols = Math.ceil(d.sanctioned / CFG.dotRows);
    var w = cols * CFG.dotPitch, h = CFG.dotRows * CFG.dotPitch;
    var wrap = el("div", "rc-dotwrap");
    wrap.style.maxWidth = maxCols * CFG.dotPitch + "px";
    var svg = svgEl("svg", {
      viewBox: "0 0 " + w + " " + h,
      class: "rc-dots rc-trigger",
      tabindex: "0",
      role: "img",
      "aria-label": boatsLabel(d),
    });
    svg.style.width = (cols / maxCols) * 100 + "%";
    for (var i = 0; i < d.sanctioned; i++) {
      var col = Math.floor(i / CFG.dotRows), r = i % CFG.dotRows;
      svg.appendChild(svgEl("circle", {
        cx: (col + 0.5) * CFG.dotPitch,
        cy: (r + 0.5) * CFG.dotPitch,
        r: CFG.dotR,
        class: d.built == null ? "d-unknown" : i < d.built ? "d-built" : "d-idle",
      }));
    }
    bind(svg, function () { return boatsCard(d); });
    wrap.appendChild(svg);
    return wrap;
  }

  function fundsBar(d) {
    var f = fundParts(d);
    var bar = el("div", "rc-bar rc-trigger");
    bar.style.width = (d.total / CFG.fundsMax) * 100 + "%";
    bar.tabIndex = 0;
    bar.setAttribute("role", "img");
    bar.setAttribute("aria-label", fundsLabel(d));
    f.parts.forEach(function (p) {
      var s = el("span", "rc-seg rc-seg--" + p.kind);
      s.style.width = (p.value / d.total) * 100 + "%";
      bar.appendChild(s);
    });
    if (f.rest / d.total >= CFG.minSeg) {
      var na = el("span", "rc-seg rc-seg--na");
      na.style.width = (f.rest / d.total) * 100 + "%";
      bar.appendChild(na);
    }
    bind(bar, function () { return fundsCard(d); });
    return bar;
  }

  // ---------------------------------------------------------------- card and label text
  function boatsLabel(d) {
    return name(d.key) + ": " + d.sanctioned + " boats " + C.tip.sanctioned + "; " +
      (d.built == null ? C.tip.awaited.toLowerCase() : d.built + " " + C.tip.built + ", as of September 2026") + ".";
  }
  function boatsCard(d) {
    var t = C.tip;
    var h = '<div class="rc-tip__title">' + esc(name(d.key)) + "</div>" +
      '<div class="rc-tip__line">' + d.sanctioned + " boats " + esc(t.sanctioned) + "</div>";
    if (d.built == null) {
      return h + '<div class="rc-tip__grid"><span class="rc-tip__key"><span class="rc-key-dot k-unknown"></span>' +
        esc(t.awaited) + "</span></div>";
    }
    return h + '<div class="rc-tip__grid">' +
      keyRow("rc-key-dot k-built", cap(t.built), d.built) +
      keyRow("rc-key-dot k-idle", cap(t.idle), d.sanctioned - d.built) + "</div>";
  }

  function shareText(d, kind) {
    var v = d[kind];
    if (kind === "state" && v === "ut") return { text: C.tip.ut, na: true };
    if (!isNum(v)) return { text: C.tip.na, na: true };
    return { text: money(v) + ((d.flags && d.flags[kind]) || ""), na: false }; // "*" points to a footnote
  }
  function fundsLabel(d) {
    var t = C.tip;
    return name(d.key) + ": " + money(d.total) + " " + t.total + "; " +
      ["central", "state", "beneficiary"].map(function (k) {
        return t[k] + " share " + shareText(d, k).text;
      }).join("; ") + ".";
  }
  function fundsCard(d) {
    var t = C.tip;
    var h = '<div class="rc-tip__title">' + esc(name(d.key)) + "</div>" +
      '<div class="rc-tip__line">' + esc(money(d.total)) + " " + esc(t.total) + "</div>" +
      '<div class="rc-tip__grid">';
    ["central", "state", "beneficiary"].forEach(function (k) {
      var s = shareText(d, k);
      h += keyRow("rc-key-bar rc-seg--" + k, t[k], s.text, s.na);
    });
    return h + "</div>";
  }
  function keyRow(swatch, label, value, na) {
    return '<span class="rc-tip__key"><span class="' + swatch + '"></span>' + esc(label) + "</span>" +
      '<span class="rc-tip__val' + (na ? " is-na" : "") + '">' + esc(value) + "</span>";
  }

  // ---------------------------------------------------------------- hover cards
  var active = null, pinned = false, hideTimer = null;

  function show(node, html) {
    clearTimeout(hideTimer);
    active = node;
    tip.innerHTML = html;
    tip.className = "rc-tip is-on";
    place(node);
  }
  function hide() {
    clearTimeout(hideTimer);
    active = null;
    pinned = false;
    tip.className = "rc-tip";
  }
  function hideSoon() {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(hide, CFG.hideDelay);
  }

  // a card sits centred above its mark, or below it when there's no room above
  function place(node) {
    var fr = fig.getBoundingClientRect(), r = node.getBoundingClientRect();
    var tw = tip.offsetWidth, th = tip.offsetHeight, g = CFG.cardGap;
    var x = r.left - fr.left + r.width / 2 - tw / 2;
    var y = r.top - fr.top - g - th;
    if (r.top - g - th < 0) y = r.bottom - fr.top + g;
    x = Math.max(4, Math.min(x, fr.width - tw - 4));
    tip.style.transform = "translate(" + Math.round(x) + "px, " + Math.round(y) + "px)";
  }

  function bind(node, html) {
    function toggle() {
      if (pinned && active === node) { hide(); return; }
      show(node, html());
      pinned = true;
    }
    node.addEventListener("pointerenter", function (e) {
      if (e.pointerType === "mouse" && !pinned) show(node, html());
    });
    node.addEventListener("pointerleave", function (e) {
      if (e.pointerType === "mouse" && !pinned) hideSoon();
    });
    node.addEventListener("focus", function () {
      if (node.matches(":focus-visible")) show(node, html());
    });
    node.addEventListener("blur", function () {
      if (!pinned) hideSoon();
    });
    node.addEventListener("click", toggle);
    node.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle(); // not node.click(): the dots are an <svg>, which has no click() method
      }
    });
  }

  document.addEventListener("pointerdown", function (e) {
    if (active && !active.contains(e.target)) hide();
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") hide(); });
  window.addEventListener("resize", function () { if (active) place(active); });
})();

/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const R = globalThis, F = R.ShadowRoot && (R.ShadyCSS === void 0 || R.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, G = Symbol(), K = /* @__PURE__ */ new WeakMap();
let ae = class {
  constructor(e, t, i) {
    if (this._$cssResult$ = !0, i !== G) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (F && e === void 0) {
      const i = t !== void 0 && t.length === 1;
      i && (e = K.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), i && K.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const pe = (r) => new ae(typeof r == "string" ? r : r + "", void 0, G), ue = (r, ...e) => {
  const t = r.length === 1 ? r[0] : e.reduce((i, s, o) => i + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + r[o + 1], r[0]);
  return new ae(t, r, G);
}, ge = (r, e) => {
  if (F) r.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const i = document.createElement("style"), s = R.litNonce;
    s !== void 0 && i.setAttribute("nonce", s), i.textContent = t.cssText, r.appendChild(i);
  }
}, Q = F ? (r) => r : (r) => r instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const i of e.cssRules) t += i.cssText;
  return pe(t);
})(r) : r;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: _e, defineProperty: ve, getOwnPropertyDescriptor: fe, getOwnPropertyNames: me, getOwnPropertySymbols: $e, getPrototypeOf: ye } = Object, y = globalThis, X = y.trustedTypes, we = X ? X.emptyScript : "", I = y.reactiveElementPolyfillSupport, V = (r, e) => r, j = { toAttribute(r, e) {
  switch (e) {
    case Boolean:
      r = r ? we : null;
      break;
    case Object:
    case Array:
      r = r == null ? r : JSON.stringify(r);
  }
  return r;
}, fromAttribute(r, e) {
  let t = r;
  switch (e) {
    case Boolean:
      t = r !== null;
      break;
    case Number:
      t = r === null ? null : Number(r);
      break;
    case Object:
    case Array:
      try {
        t = JSON.parse(r);
      } catch {
        t = null;
      }
  }
  return t;
} }, Z = (r, e) => !_e(r, e), Y = { attribute: !0, type: String, converter: j, reflect: !1, useDefault: !1, hasChanged: Z };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), y.litPropertyMetadata ?? (y.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let E = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = Y) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const i = Symbol(), s = this.getPropertyDescriptor(e, i, t);
      s !== void 0 && ve(this.prototype, e, s);
    }
  }
  static getPropertyDescriptor(e, t, i) {
    const { get: s, set: o } = fe(this.prototype, e) ?? { get() {
      return this[t];
    }, set(n) {
      this[t] = n;
    } };
    return { get: s, set(n) {
      const c = s == null ? void 0 : s.call(this);
      o == null || o.call(this, n), this.requestUpdate(e, c, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? Y;
  }
  static _$Ei() {
    if (this.hasOwnProperty(V("elementProperties"))) return;
    const e = ye(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(V("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(V("properties"))) {
      const t = this.properties, i = [...me(t), ...$e(t)];
      for (const s of i) this.createProperty(s, t[s]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const t = litPropertyMetadata.get(e);
      if (t !== void 0) for (const [i, s] of t) this.elementProperties.set(i, s);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t, i] of this.elementProperties) {
      const s = this._$Eu(t, i);
      s !== void 0 && this._$Eh.set(s, t);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const t = [];
    if (Array.isArray(e)) {
      const i = new Set(e.flat(1 / 0).reverse());
      for (const s of i) t.unshift(Q(s));
    } else e !== void 0 && t.push(Q(e));
    return t;
  }
  static _$Eu(e, t) {
    const i = t.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var e;
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (e = this.constructor.l) == null || e.forEach((t) => t(this));
  }
  addController(e) {
    var t;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(e), this.renderRoot !== void 0 && this.isConnected && ((t = e.hostConnected) == null || t.call(e));
  }
  removeController(e) {
    var t;
    (t = this._$EO) == null || t.delete(e);
  }
  _$E_() {
    const e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
    for (const i of t.keys()) this.hasOwnProperty(i) && (e.set(i, this[i]), delete this[i]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return ge(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    var e;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (e = this._$EO) == null || e.forEach((t) => {
      var i;
      return (i = t.hostConnected) == null ? void 0 : i.call(t);
    });
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    var e;
    (e = this._$EO) == null || e.forEach((t) => {
      var i;
      return (i = t.hostDisconnected) == null ? void 0 : i.call(t);
    });
  }
  attributeChangedCallback(e, t, i) {
    this._$AK(e, i);
  }
  _$ET(e, t) {
    var o;
    const i = this.constructor.elementProperties.get(e), s = this.constructor._$Eu(e, i);
    if (s !== void 0 && i.reflect === !0) {
      const n = (((o = i.converter) == null ? void 0 : o.toAttribute) !== void 0 ? i.converter : j).toAttribute(t, i.type);
      this._$Em = e, n == null ? this.removeAttribute(s) : this.setAttribute(s, n), this._$Em = null;
    }
  }
  _$AK(e, t) {
    var o, n;
    const i = this.constructor, s = i._$Eh.get(e);
    if (s !== void 0 && this._$Em !== s) {
      const c = i.getPropertyOptions(s), a = typeof c.converter == "function" ? { fromAttribute: c.converter } : ((o = c.converter) == null ? void 0 : o.fromAttribute) !== void 0 ? c.converter : j;
      this._$Em = s;
      const h = a.fromAttribute(t, c.type);
      this[s] = h ?? ((n = this._$Ej) == null ? void 0 : n.get(s)) ?? h, this._$Em = null;
    }
  }
  requestUpdate(e, t, i) {
    var s;
    if (e !== void 0) {
      const o = this.constructor, n = this[e];
      if (i ?? (i = o.getPropertyOptions(e)), !((i.hasChanged ?? Z)(n, t) || i.useDefault && i.reflect && n === ((s = this._$Ej) == null ? void 0 : s.get(e)) && !this.hasAttribute(o._$Eu(e, i)))) return;
      this.C(e, t, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: i, reflect: s, wrapped: o }, n) {
    i && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(e) && (this._$Ej.set(e, n ?? t ?? this[e]), o !== !0 || n !== void 0) || (this._$AL.has(e) || (this.hasUpdated || i || (t = void 0), this._$AL.set(e, t)), s === !0 && this._$Em !== e && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(e));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (t) {
      Promise.reject(t);
    }
    const e = this.scheduleUpdate();
    return e != null && await e, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var i;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [o, n] of this._$Ep) this[o] = n;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [o, n] of s) {
        const { wrapped: c } = n, a = this[o];
        c !== !0 || this._$AL.has(o) || a === void 0 || this.C(o, void 0, n, a);
      }
    }
    let e = !1;
    const t = this._$AL;
    try {
      e = this.shouldUpdate(t), e ? (this.willUpdate(t), (i = this._$EO) == null || i.forEach((s) => {
        var o;
        return (o = s.hostUpdate) == null ? void 0 : o.call(s);
      }), this.update(t)) : this._$EM();
    } catch (s) {
      throw e = !1, this._$EM(), s;
    }
    e && this._$AE(t);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    var t;
    (t = this._$EO) == null || t.forEach((i) => {
      var s;
      return (s = i.hostUpdated) == null ? void 0 : s.call(i);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(e) {
    return !0;
  }
  update(e) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((t) => this._$ET(t, this[t]))), this._$EM();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
};
E.elementStyles = [], E.shadowRootOptions = { mode: "open" }, E[V("elementProperties")] = /* @__PURE__ */ new Map(), E[V("finalized")] = /* @__PURE__ */ new Map(), I == null || I({ ReactiveElement: E }), (y.reactiveElementVersions ?? (y.reactiveElementVersions = [])).push("2.1.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const C = globalThis, D = C.trustedTypes, ee = D ? D.createPolicy("lit-html", { createHTML: (r) => r }) : void 0, ce = "$lit$", $ = `lit$${Math.random().toFixed(9).slice(2)}$`, de = "?" + $, be = `<${de}>`, A = document, O = () => A.createComment(""), H = (r) => r === null || typeof r != "object" && typeof r != "function", J = Array.isArray, xe = (r) => J(r) || typeof (r == null ? void 0 : r[Symbol.iterator]) == "function", B = `[ 	
\f\r]`, k = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, te = /-->/g, ie = />/g, w = RegExp(`>|${B}(?:([^\\s"'>=/]+)(${B}*=${B}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), se = /'/g, re = /"/g, le = /^(?:script|style|textarea|title)$/i, Ae = (r) => (e, ...t) => ({ _$litType$: r, strings: e, values: t }), p = Ae(1), S = Symbol.for("lit-noChange"), l = Symbol.for("lit-nothing"), oe = /* @__PURE__ */ new WeakMap(), b = A.createTreeWalker(A, 129);
function he(r, e) {
  if (!J(r) || !r.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return ee !== void 0 ? ee.createHTML(e) : e;
}
const Ee = (r, e) => {
  const t = r.length - 1, i = [];
  let s, o = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", n = k;
  for (let c = 0; c < t; c++) {
    const a = r[c];
    let h, u, d = -1, v = 0;
    for (; v < a.length && (n.lastIndex = v, u = n.exec(a), u !== null); ) v = n.lastIndex, n === k ? u[1] === "!--" ? n = te : u[1] !== void 0 ? n = ie : u[2] !== void 0 ? (le.test(u[2]) && (s = RegExp("</" + u[2], "g")), n = w) : u[3] !== void 0 && (n = w) : n === w ? u[0] === ">" ? (n = s ?? k, d = -1) : u[1] === void 0 ? d = -2 : (d = n.lastIndex - u[2].length, h = u[1], n = u[3] === void 0 ? w : u[3] === '"' ? re : se) : n === re || n === se ? n = w : n === te || n === ie ? n = k : (n = w, s = void 0);
    const m = n === w && r[c + 1].startsWith("/>") ? " " : "";
    o += n === k ? a + be : d >= 0 ? (i.push(h), a.slice(0, d) + ce + a.slice(d) + $ + m) : a + $ + (d === -2 ? c : m);
  }
  return [he(r, o + (r[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), i];
};
class U {
  constructor({ strings: e, _$litType$: t }, i) {
    let s;
    this.parts = [];
    let o = 0, n = 0;
    const c = e.length - 1, a = this.parts, [h, u] = Ee(e, t);
    if (this.el = U.createElement(h, i), b.currentNode = this.el.content, t === 2 || t === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (s = b.nextNode()) !== null && a.length < c; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const d of s.getAttributeNames()) if (d.endsWith(ce)) {
          const v = u[n++], m = s.getAttribute(d).split($), N = /([.?@])?(.*)/.exec(v);
          a.push({ type: 1, index: o, name: N[2], strings: m, ctor: N[1] === "." ? Pe : N[1] === "?" ? ke : N[1] === "@" ? Ve : z }), s.removeAttribute(d);
        } else d.startsWith($) && (a.push({ type: 6, index: o }), s.removeAttribute(d));
        if (le.test(s.tagName)) {
          const d = s.textContent.split($), v = d.length - 1;
          if (v > 0) {
            s.textContent = D ? D.emptyScript : "";
            for (let m = 0; m < v; m++) s.append(d[m], O()), b.nextNode(), a.push({ type: 2, index: ++o });
            s.append(d[v], O());
          }
        }
      } else if (s.nodeType === 8) if (s.data === de) a.push({ type: 2, index: o });
      else {
        let d = -1;
        for (; (d = s.data.indexOf($, d + 1)) !== -1; ) a.push({ type: 7, index: o }), d += $.length - 1;
      }
      o++;
    }
  }
  static createElement(e, t) {
    const i = A.createElement("template");
    return i.innerHTML = e, i;
  }
}
function P(r, e, t = r, i) {
  var n, c;
  if (e === S) return e;
  let s = i !== void 0 ? (n = t._$Co) == null ? void 0 : n[i] : t._$Cl;
  const o = H(e) ? void 0 : e._$litDirective$;
  return (s == null ? void 0 : s.constructor) !== o && ((c = s == null ? void 0 : s._$AO) == null || c.call(s, !1), o === void 0 ? s = void 0 : (s = new o(r), s._$AT(r, t, i)), i !== void 0 ? (t._$Co ?? (t._$Co = []))[i] = s : t._$Cl = s), s !== void 0 && (e = P(r, s._$AS(r, e.values), s, i)), e;
}
class Se {
  constructor(e, t) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: t }, parts: i } = this._$AD, s = ((e == null ? void 0 : e.creationScope) ?? A).importNode(t, !0);
    b.currentNode = s;
    let o = b.nextNode(), n = 0, c = 0, a = i[0];
    for (; a !== void 0; ) {
      if (n === a.index) {
        let h;
        a.type === 2 ? h = new T(o, o.nextSibling, this, e) : a.type === 1 ? h = new a.ctor(o, a.name, a.strings, this, e) : a.type === 6 && (h = new Ce(o, this, e)), this._$AV.push(h), a = i[++c];
      }
      n !== (a == null ? void 0 : a.index) && (o = b.nextNode(), n++);
    }
    return b.currentNode = A, s;
  }
  p(e) {
    let t = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(e, i, t), t += i.strings.length - 2) : i._$AI(e[t])), t++;
  }
}
class T {
  get _$AU() {
    var e;
    return ((e = this._$AM) == null ? void 0 : e._$AU) ?? this._$Cv;
  }
  constructor(e, t, i, s) {
    this.type = 2, this._$AH = l, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = i, this.options = s, this._$Cv = (s == null ? void 0 : s.isConnected) ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const t = this._$AM;
    return t !== void 0 && (e == null ? void 0 : e.nodeType) === 11 && (e = t.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, t = this) {
    e = P(this, e, t), H(e) ? e === l || e == null || e === "" ? (this._$AH !== l && this._$AR(), this._$AH = l) : e !== this._$AH && e !== S && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : xe(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== l && H(this._$AH) ? this._$AA.nextSibling.data = e : this.T(A.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var o;
    const { values: t, _$litType$: i } = e, s = typeof i == "number" ? this._$AC(e) : (i.el === void 0 && (i.el = U.createElement(he(i.h, i.h[0]), this.options)), i);
    if (((o = this._$AH) == null ? void 0 : o._$AD) === s) this._$AH.p(t);
    else {
      const n = new Se(s, this), c = n.u(this.options);
      n.p(t), this.T(c), this._$AH = n;
    }
  }
  _$AC(e) {
    let t = oe.get(e.strings);
    return t === void 0 && oe.set(e.strings, t = new U(e)), t;
  }
  k(e) {
    J(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let i, s = 0;
    for (const o of e) s === t.length ? t.push(i = new T(this.O(O()), this.O(O()), this, this.options)) : i = t[s], i._$AI(o), s++;
    s < t.length && (this._$AR(i && i._$AB.nextSibling, s), t.length = s);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, t); e !== this._$AB; ) {
      const s = e.nextSibling;
      e.remove(), e = s;
    }
  }
  setConnected(e) {
    var t;
    this._$AM === void 0 && (this._$Cv = e, (t = this._$AP) == null || t.call(this, e));
  }
}
class z {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, i, s, o) {
    this.type = 1, this._$AH = l, this._$AN = void 0, this.element = e, this.name = t, this._$AM = s, this.options = o, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = l;
  }
  _$AI(e, t = this, i, s) {
    const o = this.strings;
    let n = !1;
    if (o === void 0) e = P(this, e, t, 0), n = !H(e) || e !== this._$AH && e !== S, n && (this._$AH = e);
    else {
      const c = e;
      let a, h;
      for (e = o[0], a = 0; a < o.length - 1; a++) h = P(this, c[i + a], t, a), h === S && (h = this._$AH[a]), n || (n = !H(h) || h !== this._$AH[a]), h === l ? e = l : e !== l && (e += (h ?? "") + o[a + 1]), this._$AH[a] = h;
    }
    n && !s && this.j(e);
  }
  j(e) {
    e === l ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Pe extends z {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === l ? void 0 : e;
  }
}
class ke extends z {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== l);
  }
}
class Ve extends z {
  constructor(e, t, i, s, o) {
    super(e, t, i, s, o), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = P(this, e, t, 0) ?? l) === S) return;
    const i = this._$AH, s = e === l && i !== l || e.capture !== i.capture || e.once !== i.once || e.passive !== i.passive, o = e !== l && (i === l || s);
    s && this.element.removeEventListener(this.name, this, i), o && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var t;
    typeof this._$AH == "function" ? this._$AH.call(((t = this.options) == null ? void 0 : t.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class Ce {
  constructor(e, t, i) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    P(this, e);
  }
}
const W = C.litHtmlPolyfillSupport;
W == null || W(U, T), (C.litHtmlVersions ?? (C.litHtmlVersions = [])).push("3.3.1");
const Me = (r, e, t) => {
  const i = (t == null ? void 0 : t.renderBefore) ?? e;
  let s = i._$litPart$;
  if (s === void 0) {
    const o = (t == null ? void 0 : t.renderBefore) ?? null;
    i._$litPart$ = s = new T(e.insertBefore(O(), o), o, void 0, t ?? {});
  }
  return s._$AI(r), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const x = globalThis;
class M extends E {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var t;
    const e = super.createRenderRoot();
    return (t = this.renderOptions).renderBefore ?? (t.renderBefore = e.firstChild), e;
  }
  update(e) {
    const t = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Me(t, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var e;
    super.connectedCallback(), (e = this._$Do) == null || e.setConnected(!0);
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = this._$Do) == null || e.setConnected(!1);
  }
  render() {
    return S;
  }
}
var ne;
M._$litElement$ = !0, M.finalized = !0, (ne = x.litElementHydrateSupport) == null || ne.call(x, { LitElement: M });
const q = x.litElementPolyfillSupport;
q == null || q({ LitElement: M });
(x.litElementVersions ?? (x.litElementVersions = [])).push("4.2.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Oe = (r) => (e, t) => {
  t !== void 0 ? t.addInitializer(() => {
    customElements.define(r, e);
  }) : customElements.define(r, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const He = { attribute: !0, type: String, converter: j, reflect: !1, hasChanged: Z }, Ue = (r = He, e, t) => {
  const { kind: i, metadata: s } = t;
  let o = globalThis.litPropertyMetadata.get(s);
  if (o === void 0 && globalThis.litPropertyMetadata.set(s, o = /* @__PURE__ */ new Map()), i === "setter" && ((r = Object.create(r)).wrapped = !0), o.set(t.name, r), i === "accessor") {
    const { name: n } = t;
    return { set(c) {
      const a = e.get.call(this);
      e.set.call(this, c), this.requestUpdate(n, a, r);
    }, init(c) {
      return c !== void 0 && this.C(n, void 0, r, c), c;
    } };
  }
  if (i === "setter") {
    const { name: n } = t;
    return function(c) {
      const a = this[n];
      e.call(this, c), this.requestUpdate(n, a, r);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function L(r) {
  return (e, t) => typeof t == "object" ? Ue(r, e, t) : ((i, s, o) => {
    const n = s.hasOwnProperty(o);
    return s.constructor.createProperty(o, i), n ? Object.getOwnPropertyDescriptor(s, o) : void 0;
  })(r, e, t);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function f(r) {
  return L({ ...r, state: !0, attribute: !1 });
}
var Te = Object.defineProperty, Le = Object.getOwnPropertyDescriptor, _ = (r, e, t, i) => {
  for (var s = i > 1 ? void 0 : i ? Le(e, t) : e, o = r.length - 1, n; o >= 0; o--)
    (n = r[o]) && (s = (i ? n(e, t, s) : n(s)) || s);
  return i && s && Te(e, t, s), s;
};
function Ne(r, e) {
  let t;
  return (...i) => {
    clearTimeout(t), t = setTimeout(() => r(...i), e);
  };
}
let g = class extends M {
  constructor() {
    super(...arguments), this.narrow = !1, this._page = "views", this._config = null, this._views = [], this._devices = [], this._editingView = null, this._previewImage = null, this._previewLoading = !1, this._loading = !0, this._saving = !1, this._refreshPreview = Ne(async () => {
      if (this._editingView) {
        this._previewLoading = !0;
        try {
          const r = await this.hass.connection.sendMessagePromise({
            type: "geekmagic/preview/render",
            view_config: {
              layout: this._editingView.layout,
              theme: this._editingView.theme,
              widgets: this._editingView.widgets
            }
          });
          this._previewImage = r.image;
        } catch (r) {
          console.error("Failed to render preview:", r);
        } finally {
          this._previewLoading = !1;
        }
      }
    }, 500);
  }
  firstUpdated() {
    this._loadData();
  }
  async _loadData() {
    this._loading = !0;
    try {
      const [r, e, t] = await Promise.all([
        this.hass.connection.sendMessagePromise({
          type: "geekmagic/config"
        }),
        this.hass.connection.sendMessagePromise({
          type: "geekmagic/views/list"
        }),
        this.hass.connection.sendMessagePromise({
          type: "geekmagic/devices/list"
        })
      ]);
      this._config = r, this._views = e.views, this._devices = t.devices;
    } catch (r) {
      console.error("Failed to load GeekMagic config:", r);
    } finally {
      this._loading = !1;
    }
  }
  async _createView() {
    const r = prompt("Enter view name:", "New View");
    if (r)
      try {
        const e = await this.hass.connection.sendMessagePromise({
          type: "geekmagic/views/create",
          name: r,
          layout: "grid_2x2",
          theme: "classic",
          widgets: []
        });
        this._views = [...this._views, e.view], this._editView(e.view);
      } catch (e) {
        console.error("Failed to create view:", e);
      }
  }
  _editView(r) {
    this._editingView = { ...r, widgets: [...r.widgets] }, this._page = "editor", this._refreshPreview();
  }
  async _saveView() {
    if (this._editingView) {
      this._saving = !0;
      try {
        await this.hass.connection.sendMessagePromise({
          type: "geekmagic/views/update",
          view_id: this._editingView.id,
          name: this._editingView.name,
          layout: this._editingView.layout,
          theme: this._editingView.theme,
          widgets: this._editingView.widgets
        }), this._views = this._views.map(
          (r) => r.id === this._editingView.id ? this._editingView : r
        ), this._page = "views", this._editingView = null;
      } catch (r) {
        console.error("Failed to save view:", r);
      } finally {
        this._saving = !1;
      }
    }
  }
  async _deleteView(r) {
    if (confirm(`Delete view "${r.name}"?`))
      try {
        await this.hass.connection.sendMessagePromise({
          type: "geekmagic/views/delete",
          view_id: r.id
        }), this._views = this._views.filter((e) => e.id !== r.id);
      } catch (e) {
        console.error("Failed to delete view:", e);
      }
  }
  _updateEditingView(r) {
    this._editingView && (this._editingView = { ...this._editingView, ...r }, this._refreshPreview());
  }
  _updateWidget(r, e) {
    if (!this._editingView) return;
    const t = [...this._editingView.widgets], i = t.findIndex((s) => s.slot === r);
    i >= 0 ? t[i] = { ...t[i], ...e } : t.push({ slot: r, type: "", ...e }), this._editingView = { ...this._editingView, widgets: [...t] }, this.requestUpdate(), this._refreshPreview();
  }
  async _toggleDeviceView(r, e, t) {
    const i = t ? [...r.assigned_views, e] : r.assigned_views.filter((s) => s !== e);
    try {
      await this.hass.connection.sendMessagePromise({
        type: "geekmagic/devices/assign_views",
        entry_id: r.entry_id,
        view_ids: i
      }), this._devices = this._devices.map(
        (s) => s.entry_id === r.entry_id ? { ...s, assigned_views: i } : s
      );
    } catch (s) {
      console.error("Failed to update device views:", s);
    }
  }
  render() {
    return this._loading ? p`
        <div class="loading">
          <ha-circular-progress indeterminate></ha-circular-progress>
        </div>
      ` : p`
      <div class="header">
        <ha-icon icon="mdi:monitor-dashboard"></ha-icon>
        <span class="header-title">GeekMagic</span>
        ${this._page !== "editor" ? p`
              <div class="header-tabs">
                <button
                  class="tab-button ${this._page === "views" ? "active" : ""}"
                  @click=${() => this._page = "views"}
                >
                  Views
                </button>
                <button
                  class="tab-button ${this._page === "devices" ? "active" : ""}"
                  @click=${() => this._page = "devices"}
                >
                  Devices
                </button>
              </div>
            ` : l}
      </div>
      <div class="content">${this._renderPage()}</div>
    `;
  }
  _renderPage() {
    switch (this._page) {
      case "views":
        return this._renderViewsList();
      case "devices":
        return this._renderDevicesList();
      case "editor":
        return this._renderEditor();
    }
  }
  _renderViewsList() {
    return p`
      <div class="views-grid">
        ${this._views.map(
      (r) => {
        var e, t, i;
        return p`
            <ha-card class="view-card" @click=${() => this._editView(r)}>
              <div class="card-header">
                <h3>${r.name}</h3>
                <ha-icon-button
                  .path=${"M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"}
                  @click=${(s) => {
          s.stopPropagation(), this._deleteView(r);
        }}
                ></ha-icon-button>
              </div>
              <div class="card-content">
                <div class="card-meta">
                  ${((t = (e = this._config) == null ? void 0 : e.layout_types[r.layout]) == null ? void 0 : t.name) || r.layout}
                  &bull; ${((i = this._config) == null ? void 0 : i.themes[r.theme]) || r.theme}
                  &bull; ${r.widgets.length} widgets
                </div>
              </div>
            </ha-card>
          `;
      }
    )}
        <div class="add-card" @click=${this._createView}>
          <ha-icon icon="mdi:plus"></ha-icon>
          <span style="margin-left: 8px">Add View</span>
        </div>
      </div>
    `;
  }
  _renderDevicesList() {
    return this._devices.length === 0 ? p`
        <div class="empty-state">
          <ha-icon icon="mdi:monitor-off"></ha-icon>
          <p>No GeekMagic devices configured.</p>
          <p>Add a device through Settings → Devices & Services.</p>
        </div>
      ` : p`
      <div class="devices-list">
        ${this._devices.map(
      (r) => p`
            <ha-card>
              <div class="card-content" style="padding-top: 16px;">
                <div class="device-header">
                  <span class="device-name">${r.name}</span>
                  <span class="device-status ${r.online ? "online" : "offline"}">
                    ${r.online ? "Online" : "Offline"}
                  </span>
                </div>
                <div class="views-checkboxes">
                  <div class="section-title" style="margin-top: 8px;">Assigned Views</div>
                  ${this._views.length === 0 ? p`<p style="color: var(--secondary-text-color)">
                        No views available. Create a view first.
                      </p>` : this._views.map(
        (e) => p`
                          <label class="view-checkbox">
                            <ha-checkbox
                              .checked=${r.assigned_views.includes(e.id)}
                              @change=${(t) => this._toggleDeviceView(
          r,
          e.id,
          t.target.checked
        )}
                            ></ha-checkbox>
                            ${e.name}
                          </label>
                        `
      )}
                </div>
              </div>
            </ha-card>
          `
    )}
      </div>
    `;
  }
  _renderEditor() {
    var e;
    if (!this._editingView || !this._config) return l;
    const r = ((e = this._config.layout_types[this._editingView.layout]) == null ? void 0 : e.slots) || 4;
    return p`
      <div class="editor-header">
        <ha-icon-button
          .path=${"M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"}
          @click=${() => this._page = "views"}
        ></ha-icon-button>
        <ha-textfield
          .value=${this._editingView.name}
          @input=${(t) => this._updateEditingView({
      name: t.target.value
    })}
          placeholder="View name"
        ></ha-textfield>
        <ha-button
          raised
          ?disabled=${this._saving}
          @click=${this._saveView}
        >
          ${this._saving ? "Saving..." : "Save"}
        </ha-button>
      </div>

      <div class="editor-container">
        <div class="editor-form">
          <div class="form-row">
            <ha-select
              label="Layout"
              .value=${this._editingView.layout}
              @selected=${(t) => {
      const i = t.detail.index, o = Object.keys(this._config.layout_types)[i];
      o && this._updateEditingView({ layout: o });
    }}
              @closed=${(t) => t.stopPropagation()}
            >
              ${Object.entries(this._config.layout_types).map(
      ([t, i]) => p`
                  <mwc-list-item value=${t}>
                    ${i.name} (${i.slots} slots)
                  </mwc-list-item>
                `
    )}
            </ha-select>
            <ha-select
              label="Theme"
              .value=${this._editingView.theme}
              @selected=${(t) => {
      const i = t.detail.index, o = Object.keys(this._config.themes)[i];
      o && this._updateEditingView({ theme: o });
    }}
              @closed=${(t) => t.stopPropagation()}
            >
              ${Object.entries(this._config.themes).map(
      ([t, i]) => p`
                  <mwc-list-item value=${t}>${i}</mwc-list-item>
                `
    )}
            </ha-select>
          </div>

          <div class="section-title">Widgets</div>
          <div class="slots-grid">
            ${Array.from(
      { length: r },
      (t, i) => this._renderSlotEditor(i)
    )}
          </div>
        </div>

        <div class="editor-preview">
          <ha-card class="preview-card">
            <div class="card-header">
              <h3>Preview</h3>
              <ha-icon-button
                .path=${"M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z"}
                @click=${() => this._refreshPreview()}
              ></ha-icon-button>
            </div>
            <div class="card-content">
              ${this._previewLoading ? p`<div class="preview-placeholder">
                    <ha-circular-progress indeterminate></ha-circular-progress>
                  </div>` : this._previewImage ? p`<img
                      class="preview-image"
                      src="data:image/png;base64,${this._previewImage}"
                      alt="Preview"
                    />` : p`<div class="preview-placeholder">No preview</div>`}
            </div>
          </ha-card>
        </div>
      </div>
    `;
  }
  _renderSlotEditor(r) {
    var s;
    if (!this._config) return l;
    const e = (s = this._editingView) == null ? void 0 : s.widgets.find((o) => o.slot === r), t = (e == null ? void 0 : e.type) || "", i = this._config.widget_types[t];
    return p`
      <ha-card class="slot-card">
        <div class="card-content">
          <div class="slot-header">Slot ${r + 1}</div>

          <div class="slot-field">
            <ha-select
              label="Widget Type"
              .value=${t}
              @selected=${(o) => {
      const n = o.detail.index, a = ["", ...Object.keys(this._config.widget_types)][n] || "";
      this._updateWidget(r, { type: a });
    }}
              @closed=${(o) => o.stopPropagation()}
            >
              <mwc-list-item value="">-- Empty --</mwc-list-item>
              ${Object.entries(this._config.widget_types).map(
      ([o, n]) => p`
                  <mwc-list-item value=${o}>${n.name}</mwc-list-item>
                `
    )}
            </ha-select>
          </div>

          ${i != null && i.needs_entity ? p`
                <div class="slot-field">
                  <ha-selector
                    .hass=${this.hass}
                    .selector=${{
      entity: i.entity_domains ? { domain: i.entity_domains } : {}
    }}
                    .value=${(e == null ? void 0 : e.entity_id) || ""}
                    .label=${"Entity"}
                    @value-changed=${(o) => this._updateWidget(r, {
      entity_id: o.detail.value
    })}
                  ></ha-selector>
                </div>
              ` : l}

          <div class="slot-field">
            <ha-textfield
              label="Label (optional)"
              .value=${(e == null ? void 0 : e.label) || ""}
              @input=${(o) => this._updateWidget(r, {
      label: o.target.value
    })}
            ></ha-textfield>
          </div>
        </div>
      </ha-card>
    `;
  }
};
g.styles = ue`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      --mdc-theme-primary: var(--primary-color);
      --mdc-theme-on-primary: var(--text-primary-color);
    }

    /* Header */
    .header {
      display: flex;
      align-items: center;
      padding: 0 16px;
      height: 56px;
      border-bottom: 1px solid var(--divider-color);
      background: var(--app-header-background-color);
    }

    .header-title {
      font-size: 20px;
      font-weight: 400;
      margin-left: 8px;
    }

    .header-tabs {
      margin-left: auto;
      display: flex;
      gap: 4px;
    }

    .tab-button {
      background: transparent;
      border: none;
      padding: 8px 16px;
      font-size: 14px;
      font-weight: 500;
      color: var(--secondary-text-color);
      cursor: pointer;
      border-radius: 4px;
      transition: all 0.2s;
    }

    .tab-button:hover {
      background: var(--secondary-background-color);
    }

    .tab-button.active {
      color: var(--primary-color);
      background: var(--primary-color-alpha, rgba(3, 169, 244, 0.1));
    }

    .content {
      flex: 1;
      overflow: auto;
      padding: 16px;
      background: var(--primary-background-color);
    }

    .loading {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
    }

    /* Views Grid */
    .views-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 16px;
    }

    ha-card {
      --ha-card-border-radius: 12px;
    }

    .view-card {
      cursor: pointer;
    }

    .view-card:hover {
      --ha-card-background: var(--secondary-background-color);
    }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
    }

    .card-header h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 500;
    }

    .card-content {
      padding: 0 16px 16px;
    }

    .card-meta {
      font-size: 14px;
      color: var(--secondary-text-color);
    }

    .add-card {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 120px;
      border: 2px dashed var(--divider-color);
      border-radius: 12px;
      cursor: pointer;
      color: var(--secondary-text-color);
      transition: all 0.2s;
    }

    .add-card:hover {
      border-color: var(--primary-color);
      color: var(--primary-color);
    }

    /* Editor */
    .editor-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
    }

    .editor-header ha-textfield {
      flex: 1;
    }

    .editor-container {
      display: flex;
      gap: 24px;
      height: calc(100% - 80px);
    }

    .editor-form {
      flex: 7;
      overflow-y: auto;
    }

    .editor-preview {
      flex: 3;
      min-width: 280px;
    }

    .preview-card {
      position: sticky;
      top: 0;
    }

    .preview-card .card-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 16px;
    }

    .preview-image {
      width: 240px;
      height: 240px;
      border-radius: 8px;
      background: #000;
      object-fit: contain;
    }

    .preview-placeholder {
      width: 240px;
      height: 240px;
      border-radius: 8px;
      background: var(--secondary-background-color);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--secondary-text-color);
    }

    /* Form Layout */
    .form-row {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
    }

    .form-row > * {
      flex: 1;
    }

    .section-title {
      font-size: 14px;
      font-weight: 500;
      color: var(--primary-text-color);
      margin: 24px 0 16px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .section-title:first-child {
      margin-top: 0;
    }

    /* Slots Grid */
    .slots-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 16px;
    }

    .slot-card {
      --ha-card-border-radius: 8px;
    }

    .slot-card .card-content {
      padding: 16px;
    }

    .slot-header {
      font-weight: 500;
      margin-bottom: 16px;
      color: var(--primary-text-color);
    }

    .slot-field {
      margin-bottom: 16px;
    }

    .slot-field:last-child {
      margin-bottom: 0;
    }

    ha-select,
    ha-textfield {
      display: block;
      width: 100%;
    }

    ha-entity-picker {
      display: block;
      width: 100%;
    }

    /* Devices */
    .devices-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
      max-width: 800px;
    }

    .device-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .device-name {
      font-size: 16px;
      font-weight: 500;
    }

    .device-status {
      font-size: 12px;
      padding: 4px 12px;
      border-radius: 12px;
      font-weight: 500;
    }

    .device-status.online {
      background: var(--success-color, #4caf50);
      color: white;
    }

    .device-status.offline {
      background: var(--error-color, #f44336);
      color: white;
    }

    .views-checkboxes {
      margin-top: 16px;
    }

    .view-checkbox {
      display: flex;
      align-items: center;
      padding: 8px 0;
    }

    .view-checkbox ha-checkbox {
      margin-right: 8px;
    }

    /* Empty states */
    .empty-state {
      text-align: center;
      padding: 48px 16px;
      color: var(--secondary-text-color);
    }

    .empty-state ha-icon {
      --mdc-icon-size: 48px;
      margin-bottom: 16px;
      opacity: 0.5;
    }
  `;
_([
  L({ attribute: !1 })
], g.prototype, "hass", 2);
_([
  L({ type: Boolean })
], g.prototype, "narrow", 2);
_([
  L({ attribute: !1 })
], g.prototype, "route", 2);
_([
  L({ attribute: !1 })
], g.prototype, "panel", 2);
_([
  f()
], g.prototype, "_page", 2);
_([
  f()
], g.prototype, "_config", 2);
_([
  f()
], g.prototype, "_views", 2);
_([
  f()
], g.prototype, "_devices", 2);
_([
  f()
], g.prototype, "_editingView", 2);
_([
  f()
], g.prototype, "_previewImage", 2);
_([
  f()
], g.prototype, "_previewLoading", 2);
_([
  f()
], g.prototype, "_loading", 2);
_([
  f()
], g.prototype, "_saving", 2);
g = _([
  Oe("geekmagic-panel")
], g);
export {
  g as GeekMagicPanel
};

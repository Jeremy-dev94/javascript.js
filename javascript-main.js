(()=>{
    "use strict";
    var t, i = {
        795: (t,i,e)=>{
            var s = e(612);
            e(957);
            let n = null;
            class a {
                constructor() {
                    if (n)
                        return n;
                    this.px = 0,
                    this.py = 0,
                    n = this,
                    this.init()
                }
                static getInstance() {
                    return n || (n = new a),
                    n
                }
                static get x() {
                    return a.getInstance().px
                }
                static get y() {
                    return a.getInstance().py
                }
                init() {
                    document.addEventListener("pointermove", this.onPointerMove.bind(this))
                }
                onPointerMove(t) {
                    this.px = t.pageX,
                    this.py = t.pageY
                }
            }
            class o {
                static random(t, i) {
                    return void 0 === t ? Math.random() : void 0 === i ? Math.random() * t : t + Math.random() * (i - t)
                }
                static randomInt(t, i) {
                    return Math.floor(o.random(t, i))
                }
                static constrain(t, i, e) {
                    return Math.max(Math.min(t, e), i)
                }
                static map(t, i, e, s, n) {
                    return (t - i) / (e - i) * (n - s) + s
                }
                static radians(t) {
                    return t * (2 * Math.PI / 360)
                }
                static magnitude(t, i) {
                    return o.dist(0, 0, t, i)
                }
                static dist(t, i, e, s) {
                    return Math.sqrt((t - e) * (t - e) + (i - s) * (i - s))
                }
                static lerp(t, i, e) {
                    return t + (i - t) * e
                }
            }
            class r {
                constructor(t, i) {
                    let {x: e, y: s} = t;
                    this.position = {
                        x: e,
                        y: s
                    },
                    this.velocity = {
                        x: 0,
                        y: 0
                    },
                    this.omega = i,
                    this.direction = 0
                }
                lerp(t, i, e) {
                    return t + (i - t) * e
                }
                update(t, i) {
                    const e = Math.exp(-this.omega * i)
                      , s = this.lerp(t.x, this.position.x, e)
                      , n = this.lerp(t.y, this.position.y, e);
                    this.velocity.x = s - this.position.x,
                    this.velocity.y = n - this.position.y,
                    this.position.x = s,
                    this.position.y = n
                }
                calcDirection(t) {
                    this.direction = Math.atan2(this.position.y - t.y, this.position.x - t.x)
                }
                reset() {
                    this.position.x = 0,
                    this.position.y = 0,
                    this.velocity.x = 0,
                    this.velocity.y = 0,
                    this.direction = 0
                }
                set x(t) {
                    this.position.x = t
                }
                set y(t) {
                    this.position.y = t
                }
                get x() {
                    return this.position.x
                }
                get y() {
                    return this.position.y
                }
            }
            class l extends s.MxU {
                constructor(t) {
                    super(t);
                    const i = document.createElement("canvas");
                    i.width = 64,
                    i.height = 64;
                    const e = i.getContext("2d");
                    e.clearRect(0, 0, 64, 64),
                    e.fillStyle = "#fff",
                    e.beginPath(),
                    e.arc(32, 32, 32, 0, 2 * Math.PI),
                    e.fill(),
                    this.ball = s.jyi.from(i, {
                        width: 64,
                        height: 64,
                        resolution: this.renderer.resolution
                    }),
                    this.ball.anchor.set(.5),
                    this.ball.velocity = new s.E9j(0,0),
                    this.ball.prevPosition = new s.E9j(0,0),
                    this.stage.addChild(this.ball),
                    this.pointer = new s.E9j(a.x,a.y),
                    this.numParticles = 5e3,
                    this.emitCount = 0,
                    this.particles = new s.TYe(this.numParticles,{
                        scale: !0,
                        position: !0,
                        alpha: !0
                    }),
                    this.particles.blendMode = s.T$b.ADD,
                    this.stage.addChild(this.particles);
                    const n = [15095808, 15128320, 1566208, 59091, 20966, 15073357];
                    for (let t = 0; t < this.numParticles; t++) {
                        const t = s.jyi.from(i, {
                            width: 64,
                            height: 64,
                            resolution: this.renderer.resolution
                        })
                          , e = Math.floor(Math.random() * n.length);
                        t.tint = n[e],
                        t.anchor.set(.5),
                        t.x = Math.random() * this.screen.width,
                        t.y = Math.random() * this.screen.height,
                        t.alpha = 0,
                        t.target = {
                            x: 0,
                            y: 0
                        },
                        t.tween = new r({
                            x: 0,
                            y: 0
                        },1),
                        t.seed = Math.random(),
                        this.particles.addChild(t)
                    }
                    this.ticker.add(this.update.bind(this))
                }
                calcBallPosition(t) {
                    this.pointer.set(a.x, a.y);
                    const i = this.ball.position.subtract(this.pointer).multiplyScalar(-.1);
                    this.ball.prevPosition.x = this.ball.x,
                    this.ball.prevPosition.y = this.ball.y,
                    this.ball.velocity = this.ball.velocity.add(i.multiplyScalar(t)),
                    this.ball.position = this.ball.position.add(this.ball.velocity.multiplyScalar(t)),
                    this.ball.velocity = this.ball.velocity.multiplyScalar(Math.pow(.8, t))
                }
                update() {
                    const t = .001 * performance.now()
                      , i = this.ticker.deltaTime
                      , e = .001 * this.ticker.deltaMS;
                    this.calcBallPosition(i);
                    const s = o.constrain(this.ball.velocity.magnitude(), 0, 100)
                      , n = Math.atan2(this.ball.y - a.y, this.ball.x - a.x)
                      , r = Math.min(Math.floor(.2 * s), .1 * this.numParticles);
                    for (let t = 0; t < r; t++) {
                        const i = this.particles.children[this.emitCount]
                          , e = Math.random() * Math.PI * .25
                          , a = .2 + .8 * Math.random()
                          , l = o.lerp(this.ball.prevPosition.x, this.ball.x, t / r)
                          , h = o.lerp(this.ball.prevPosition.y, this.ball.y, t / r);
                        i.x = l,
                        i.y = h,
                        i.tween.x = l,
                        i.tween.y = h,
                        i.target.x = l + 10 * s * a * Math.cos(n + e),
                        i.target.y = h + 10 * s * a * Math.sin(n + e),
                        i.alpha = 1,
                        i.direction = n,
                        this.emitCount = ++this.emitCount % this.numParticles
                    }
                    for (let i = 0; i < this.numParticles; i++) {
                        const s = this.particles.children[i];
                        s.tween.update(s.target, e);
                        const n = Math.max(o.magnitude(s.tween.velocity.x, s.tween.velocity.y), .01)
                          , a = s.seed * Math.PI * 2 + t;
                        s.x = s.tween.x + 30 / n * Math.cos(a),
                        s.y = s.tween.y + 30 / n * Math.sin(a),
                        s.alpha = n,
                        s.scale.set(.15 * n)
                    }
                }
            }
            document.addEventListener("DOMContentLoaded", (()=>{
                const t = document.getElementById("CanvasContainer");
                new l({
                    view: t.querySelector("canvas"),
                    useContextAlpha: !1,
                    backgroundColor: 200218,
                    resolution: Math.min(window.devicePixelRatio, 2),
                    resizeTo: window
                })
            }
            ))
        }
    }, e = {};
    function s(t) {
        var n = e[t];
        if (void 0 !== n)
            return n.exports;
        var a = e[t] = {
            id: t,
            loaded: !1,
            exports: {}
        };
        return i[t].call(a.exports, a, a.exports, s),
        a.loaded = !0,
        a.exports
    }
    s.m = i,
    t = [],
    s.O = (i,e,n,a)=>{
        if (!e) {
            var o = 1 / 0;
            for (c = 0; c < t.length; c++) {
                for (var [e,n,a] = t[c], r = !0, l = 0; l < e.length; l++)
                    (!1 & a || o >= a) && Object.keys(s.O).every((t=>s.O[t](e[l]))) ? e.splice(l--, 1) : (r = !1,
                    a < o && (o = a));
                if (r) {
                    t.splice(c--, 1);
                    var h = n();
                    void 0 !== h && (i = h)
                }
            }
            return i
        }
        a = a || 0;
        for (var c = t.length; c > 0 && t[c - 1][2] > a; c--)
            t[c] = t[c - 1];
        t[c] = [e, n, a]
    }
    ,
    s.n = t=>{
        var i = t && t.__esModule ? ()=>t.default : ()=>t;
        return s.d(i, {
            a: i
        }),
        i
    }
    ,
    s.d = (t,i)=>{
        for (var e in i)
            s.o(i, e) && !s.o(t, e) && Object.defineProperty(t, e, {
                enumerable: !0,
                get: i[e]
            })
    }
    ,
    s.g = function() {
        if ("object" == typeof globalThis)
            return globalThis;
        try {
            return this || new Function("return this")()
        } catch (t) {
            if ("object" == typeof window)
                return window
        }
    }(),
    s.o = (t,i)=>Object.prototype.hasOwnProperty.call(t, i),
    s.nmd = t=>(t.paths = [],
    t.children || (t.children = []),
    t),
    (()=>{
        var t = {
            179: 0
        };
        s.O.j = i=>0 === t[i];
        var i = (i,e)=>{
            var n, a, [o,r,l] = e, h = 0;
            if (o.some((i=>0 !== t[i]))) {
                for (n in r)
                    s.o(r, n) && (s.m[n] = r[n]);
                if (l)
                    var c = l(s)
            }
            for (i && i(e); h < o.length; h++)
                a = o[h],
                s.o(t, a) && t[a] && t[a][0](),
                t[a] = 0;
            return s.O(c)
        }
          , e = globalThis.webpackChunkparticle_emmiter = globalThis.webpackChunkparticle_emmiter || [];
        e.forEach(i.bind(null, 0)),
        e.push = i.bind(null, e.push.bind(e))
    }
    )();
    var n = s.O(void 0, [736], (()=>s(795)));
    n = s.O(n)
}
)();

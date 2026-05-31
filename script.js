class Calc {
    constructor(p, c) { this.p = p; this.c = c; this.clr(); }
    clr() { this.cv = '0'; this.pv = ''; this.op = null; this.upd(); }
    del() { this.cv = (this.cv.length > 1 && this.cv !== 'Error') ? this.cv.slice(0, -1) : '0'; this.upd(); }
    add(n) { if(this.cv==='Error') this.clr(); if(n==='.' && this.cv.includes('.')) return; this.cv = (this.cv==='0' && n!=='.') ? n : this.cv + n; this.upd(1); }
    setOp(o) { if(this.cv==='Error') return; if(this.pv) this.calc(); this.op = o; this.pv = this.cv; this.cv = ''; }
    calc() {
        let p = +this.pv, c = +this.cv; if(isNaN(p) || isNaN(c)) return;
        let r = this.op==='+' ? p+c : this.op==='-' ? p-c : this.op==='×' ? p*c : c===0 ? 'E' : p/c;
        if(r==='E') { this.cv='Error'; this.op=null; this.pv=''; this.c.style.color='#f44'; setTimeout(()=>this.c.style.color='',1.5e3); return; }
        this.cv = Math.round(r*1e10)/1e10 + ''; this.op = null; this.pv = ''; this.upd(1);
    }
    upd(a=0) {
        this.c.innerText = this.cv; this.p.innerText = this.op ? `${this.pv} ${this.op}` : '';
        if(a) { this.c.classList.remove('update-anim'); void this.c.offsetWidth; this.c.classList.add('update-anim'); setTimeout(()=>this.c.classList.remove('update-anim'),200); }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const calc = new Calc(document.getElementById('previous-operand'), document.getElementById('current-operand'));
    const app = document.getElementById('app-container'), dev = document.getElementById('calculator-device');
    let act = false;

    dev.onclick = () => { if(!act) { dev.style.transform = ''; app.className = 'state-interactive'; act = true; } };
    document.getElementById('btn-close').onclick = e => { e.stopPropagation(); app.className = 'state-landing'; act = false; dev.style.transform = ''; };

    const btns = document.querySelectorAll('.btn');
    btns.forEach(b => b.onclick = e => {
        if(!act) return; e.stopPropagation();
        let a = b.getAttribute('data-action'), t = b.innerText;
        if(b.classList.contains('btn-number')) calc.add(t);
        else if(b.classList.contains('btn-operator')) calc.setOp(t);
        else if(a==='clear') calc.clr(); else if(a==='delete') calc.del();
        else calc.calc();
        
        b.classList.add('shockwave'); setTimeout(()=>b.classList.remove('shockwave'),400);
    });

    document.onkeydown = e => {
        if(!act) return; let k=e.key;
        if(/[\d\.]/.test(k)) calc.add(k);
        if(['+','-','*','/'].includes(k)) calc.setOp(k==='*'?'×':k==='/'?'÷':k);
        if(k==='Enter'||k==='=') { e.preventDefault(); calc.calc(); }
        if(k==='Backspace') calc.del(); if(k==='Escape') calc.clr();
    };

    if(window.matchMedia("(pointer: fine)").matches) {
        const spot = document.createElement('div'), glr = document.createElement('div');
        spot.className = 'mouse-spotlight'; glr.className = 'holographic-glare';
        document.body.appendChild(spot); dev.appendChild(glr);

        for(let i=0; i<15; i++) {
            let p = document.createElement('div'); p.className = 'bg-particle'; p.innerText = ['+','-','×','÷','='][i%5];
            Object.assign(p.style, { left: Math.random()*100+'vw', top: Math.random()*100+'vh', opacity: Math.random()*0.2, fontSize: Math.random()*30+10+'px', animationDuration: Math.random()*10+10+'s' });
            document.body.appendChild(p);
        }

        let t = 0;
        (function loop() {
            if(!act) dev.style.transform = `scale(${window.innerWidth<768?.45:.7}) translateY(${120+Math.sin(t*1.5)*20}px) rotateX(${15+Math.sin(t)*4}deg) rotateY(${Math.cos(t*.8)*8}deg)`;
            t+=0.02; requestAnimationFrame(loop);
        })();

        document.onmousemove = e => {
            spot.style.left = e.clientX+'px'; spot.style.top = e.clientY+'px';
            if(act) {
                dev.style.transition = 'none';
                dev.style.transform = `rotateY(${(innerWidth/2-e.clientX)/25}deg) rotateX(${(innerHeight/2-e.clientY)/-25}deg)`;
                let dr = dev.getBoundingClientRect();
                glr.style.opacity = 1; glr.style.background = `radial-gradient(circle at ${e.clientX-dr.left}px ${e.clientY-dr.top}px, rgba(255,255,255,0.15), transparent 60%)`;
            }
        };
        
        dev.onmouseleave = () => { if(act) { dev.style.transition = 'transform .5s, box-shadow .5s'; dev.style.transform = ''; glr.style.opacity = 0; } };
        dev.onmouseenter = () => { if(act) setTimeout(()=>dev.style.transition='none', 500); };
    }
});

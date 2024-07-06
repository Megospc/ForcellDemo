const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const size = 400;
const friction = 0.03;
const replusionRadius = 18;
const replusionForce = 0.25;
const radiusScale = 3;

const amount = 50;

function hex(c) {
    c = Math.floor(c*255);
    
    return (c < 16 ? "0":"")+c.toString(16);
}

function rgb(r, g, b) {
    return "#"+hex(r)+hex(g)+hex(b);
}

const backgroundColor = rgb(0.0, 0.0, 0.2);

const colors = [
    rgb(1.0, 0.5, 0.8),
    rgb(0.8, 0.5, 1.0),
    rgb(0.5, 1.0, 0.8),
    rgb(1.0, 0.8, 0.5),
    rgb(0.5, 0.8, 1.0),
    rgb(1.0, 0.55, 0.4),
    rgb(0.4, 0.4, 1.0)
];

const rule = [];

const randomSign = () => Math.random() < 0.5 ? -1:1;

for (let i = 0; i < colors.length; i++) {
    rule[i] = [];
    
    for (let j = 0; j < colors.length; j++) rule[i][j] = randomSign()*Math.random()*3;
}

canvas.width = size*2;
canvas.height = size*2;

const particles = [];

function Particle(type) {
    this.x = Math.random()*size*2-size;
    this.y = Math.random()*size*2-size;
    
    this.vx = 0;
    this.vy = 0;
    
    this.type = type;
}

function draw() {
    ctx.reset();
    
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, size*2, size*2);
    
    const grads = [];
    
    for (let i = 0; i < colors.length; i++) {
        grads[i] = ctx.createRadialGradient(0, 0, 0, 0, 0, 10*radiusScale);
        
        grads[i].addColorStop(0, colors[i]+"20");
        grads[i].addColorStop(0.2, colors[i]);
        grads[i].addColorStop(0.3, colors[i]);
        grads[i].addColorStop(0.31, colors[i]+"80");
        grads[i].addColorStop(1, colors[i]+"00");
    }
    
    for (const particle of particles) {
        ctx.save();
        
        ctx.translate(particle.x+size, particle.y+size);
        
        ctx.fillStyle = grads[particle.type];
        
        ctx.beginPath();
        
        ctx.arc(0, 0, 10*radiusScale, 0, 2*Math.PI);
        
        ctx.fill();
        
        ctx.restore();
    }
}

function step() {
    const r2 = replusionRadius**2;
    
    for (const particle of particles) {
        const r = rule[particle.type];
        
        for (const target of particles) {
            if (particle === target) continue;
            
            let dx = (target.x-particle.x);
            let dy = (target.y-particle.y);
            
            let d2 = dx**2+dy**2;
            
            let force;
            
            if (d2 < r2) {
                let d = Math.sqrt(d2);
                
                if (d < 0.1) d = 1.0, dx = 1.0, dy = 0.0;
                
                force = -replusionForce*(replusionRadius-d)/d;
            } else {
                force = r[target.type]/d2;
            }
            
            particle.vx += dx*force;
            particle.vy += dy*force;
        }
    }
    
    for (const particle of particles) {
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        particle.vx *= 1-friction;
        particle.vy *= 1-friction;
        
        if (particle.x < 10-size) particle.x = 10-size, particle.vx = Math.abs(particle.vx);
        if (particle.x > size-10) particle.x = size-10, particle.vx = -Math.abs(particle.vx);
        if (particle.y < 10-size) particle.y = 10-size, particle.vy = Math.abs(particle.vy);
        if (particle.y > size-10) particle.y = size-10, particle.vy = -Math.abs(particle.vy);
    }
}

for (let type = 0; type < colors.length; type++) for (let i = 0; i < amount; i++) particles.push(new Particle(type));

setInterval(() => {
    step();
    
    draw();
}, 20);
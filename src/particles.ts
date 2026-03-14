const PRIMARY_RGB = 'rgba(0,136,255,';
const CELL_SIZE = 110;

export class Particle {
  x: number;
  y: number;
  private size: number;
  private speedX: number;
  private speedY: number;
  private opacity: number;

  constructor(
    private canvas: HTMLCanvasElement,
    private mouse: { x: number; y: number }
  ) {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = Math.random() * 0.5 - 0.25;
    this.speedY = Math.random() * 0.5 - 0.25;
    this.opacity = Math.random() * 0.5 + 0.2;
  }

  update(): void {
    this.x += this.speedX;
    this.y += this.speedY;

    // Mouse repulsion
    const dx = this.mouse.x - this.x;
    const dy = this.mouse.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < 120 && distance > 0) {
      const force = (120 - distance) / 120;
      this.x -= (dx / distance) * force * 3;
      this.y -= (dy / distance) * force * 3;
    }

    // Wrap around
    if (this.x > this.canvas.width) this.x = 0;
    if (this.x < 0) this.x = this.canvas.width;
    if (this.y > this.canvas.height) this.y = 0;
    if (this.y < 0) this.y = this.canvas.height;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = `${PRIMARY_RGB}${this.opacity})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function getCellKey(x: number, y: number): string {
  return `${x >> 0},${y >> 0}`;
}

export class ParticleSystem {
  private particles: Particle[] = [];
  private ctx: CanvasRenderingContext2D;
  private mouse = { x: -1000, y: -1000 };
  private animationId = 0;
  private rafScheduled = false;

  constructor(
    private canvas: HTMLCanvasElement,
    particleCount?: number
  ) {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');
    this.ctx = ctx;

    this.resize();

    const count =
      particleCount ??
      (matchMedia('(max-width: 768px)').matches ? 80 : 150);
    for (let i = 0; i < count; i++) {
      this.particles.push(new Particle(this.canvas, this.mouse));
    }

    this.canvas.addEventListener(
      'mousemove',
      (e) => {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
      },
      { passive: true }
    );
    this.canvas.addEventListener('mouseleave', () => {
      this.mouse.x = -1000;
      this.mouse.y = -1000;
    });

    window.addEventListener('resize', () => this.resize());
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) this.pause();
      else this.animate();
    });
  }

  private resize(): void {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  private buildGrid(): Map<string, Particle[]> {
    const grid = new Map<string, Particle[]>();
    for (const p of this.particles) {
      const key = getCellKey(p.x / CELL_SIZE, p.y / CELL_SIZE);
      const cell = grid.get(key) ?? [];
      cell.push(p);
      grid.set(key, cell);
    }
    return grid;
  }

  private drawConnections(): void {
    const grid = this.buildGrid();
    const seen = new Set<string>();

    for (const p1 of this.particles) {
      const cx = (p1.x / CELL_SIZE) >> 0;
      const cy = (p1.y / CELL_SIZE) >> 0;
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          const cell = grid.get(getCellKey(cx + dx, cy + dy));
          if (!cell) continue;
          for (const p2 of cell) {
            if (p1 === p2) continue;
            const id =
              p1.x < p2.x
                ? `${p1.x},${p1.y}-${p2.x},${p2.y}`
                : `${p2.x},${p2.y}-${p1.x},${p1.y}`;
            if (seen.has(id)) continue;
            seen.add(id);

            const distX = p1.x - p2.x;
            const distY = p1.y - p2.y;
            const distance = Math.sqrt(distX * distX + distY * distY);
            if (distance < 100) {
              this.ctx.strokeStyle = `${PRIMARY_RGB}${0.1 * (1 - distance / 100)})`;
              this.ctx.lineWidth = 0.5;
              this.ctx.beginPath();
              this.ctx.moveTo(p1.x, p1.y);
              this.ctx.lineTo(p2.x, p2.y);
              this.ctx.stroke();
            }
          }
        }
      }
    }
  }

  animate(): void {
    if (this.rafScheduled) return;
    this.rafScheduled = true;

    const loop = () => {
      this.rafScheduled = false;
      if (document.hidden) return;

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.drawConnections();
      for (const p of this.particles) {
        p.update();
        p.draw(this.ctx);
      }
      this.animationId = requestAnimationFrame(loop);
    };
    this.animationId = requestAnimationFrame(loop);
  }

  private pause(): void {
    cancelAnimationFrame(this.animationId);
    this.rafScheduled = false;
  }

  stop(): void {
    this.pause();
  }
}

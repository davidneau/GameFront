<template>
    <div>
        <div id="layerTouch">
            <button class="btn topleft" @click="restartGame">
                {{ gameStarted ? (gameOver ? 'Rejouer' : 'Redémarrer') : 'Jouer' }}
            </button>
        </div>
        <h1>Geometry Trash</h1>
        <div class="game-wrapper">
            <div id="score">
                <div>Score : <strong>{{ score }}</strong></div>
            </div>

            <canvas ref="gameCanvas" id="canvas" width="1000" height="800"></canvas>

            <div class="ui">
                <div>
                    <div>Progression : {{ progression }}%</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default{
    name: "RunnerView",
    data() {
        return {
            canvas: null,
            ctx: null,
            animationId: null,

            width: 1000,
            height: 800,
            groundY: 720,

            gameStarted: false,
            gameOver: false,

            score: 0,
            speed: 6,
            frameCount: 0,
            frameCountMax: 2000,
            progression: 0,

            player: {
                x: 140,
                y: 0,
                width: 42,
                height: 42,
                velocityY: 0,
                gravity: 0.72,
                jumpForce: -13.5,
                grounded: false,
                rotation: 0
            },

            lastTime: 0,
            accumulator: 0,

            fixedDt: 1/60,

            obstacles: [],
            particles: [],
            groundes: [],

            spawnTimer: 0,
            spawnInterval: 95,

            bgOffset: 0,
            chrono: null,
        };
    },

    mounted() {
        this.canvas = this.$refs.gameCanvas;
        this.ctx = this.canvas.getContext("2d");

        this.resetPlayer();
        this.drawStartScreen();

        window.addEventListener("keydown", this.handleKeyDown);
        document.getElementById("layerTouch").addEventListener("click", this.handleJumpInput);
        document.getElementById("layerTouch").addEventListener("touchstart", this.handleTouch, { passive: false });
    },

    beforeUnmount() {
        window.removeEventListener("keydown", this.handleKeyDown);
        document.getElementById("layerTouch").removeEventListener("click", this.handleJumpInput);
        document.getElementById("layerTouch").removeEventListener("touchstart", this.handleTouch);

        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    },

    methods: {
        resetPlayer() {
            this.player.y = this.groundY - this.player.height;
            this.player.velocityY = 0;
            this.player.grounded = true;
            this.player.rotation = 0;
        },

        createObject(x, y, width, height, ground, type){
            return {
                type: type,
                x: x,
                y: y,
                width: width,
                height: height,
                counted: ground
            }
        },

        startGame() {
            this.chrono = performance.now();

            if (this.animationId) cancelAnimationFrame(this.animationId);

            this.gameStarted = true;
            this.gameOver = false;
            this.score = 0;
            this.speed = 6;
            this.frameCount = 0;
            this.spawnTimer = 0;
            this.spawnInterval = 95;
            this.obstacles = [
                this.createObject(1000, 685, 35, 35, false, "spike"),

                this.createObject(1400, 685, 35, 35, false, "spike"),
                this.createObject(1435, 685, 35, 35, false, "spike"),

                this.createObject(4100, 685, 35, 35, false, "spike"),
                this.createObject(4135, 685, 35, 35, false, "spike"),
                this.createObject(4170, 685, 35, 35, false, "spike"),
                this.createObject(4205, 685, 35, 35, false, "spike"),
                this.createObject(4240, 685, 35, 35, false, "spike"),
                this.createObject(4275, 685, 35, 35, false, "spike"),
                this.createObject(4310, 685, 35, 35, false, "spike"),
                this.createObject(4345, 685, 35, 35, false, "spike"),
                this.createObject(4380, 685, 35, 35, false, "spike"),
                this.createObject(4415, 685, 35, 35, false, "spike"),
                this.createObject(4460, 685, 35, 35, false, "spike"),
                this.createObject(4495, 685, 35, 35, false, "spike"),
                this.createObject(4530, 685, 35, 35, false, "spike"),
                this.createObject(4575, 685, 35, 35, false, "spike"),

                this.createObject(7565, 420, 35, 35, false, "spikeDown"),
                this.createObject(7600, 420, 35, 35, false, "spikeDown"),
            ];
            this.particles = [];
            this.groundes = [ 
                this.createObject(0, 720, 2000, 80, true, ""),
                this.createObject(2100, 720, 300, 80, true, ""),
                this.createObject(2500, 720, 100, 80, true, ""),
                this.createObject(2700, 720, 300, 80, true, ""),
                
                this.createObject(3050, 660, 100, 20, true, ""),
                this.createObject(3300, 600, 100, 20, true, ""),
                this.createObject(3550, 540, 100, 20, true, ""),
                
                this.createObject(3800, 720, 1200, 80, true, ""),

                this.createObject(4200, 660, 300, 20, true, ""),

                this.createObject(5128, 720, 100, 80, true, ""),
                this.createObject(5356, 720, 100, 80, true, ""),
                this.createObject(5584, 720, 100, 80, true, ""),
                this.createObject(5812, 720, 100, 80, true, ""),
                this.createObject(6000, 720, 500, 80, true, ""),
                
                this.createObject(6600, 660, 100, 140, true, ""),
                this.createObject(6800, 720, 300, 80, true, ""),
                
                this.createObject(7200, 660, 100, 20, true, ""),
                this.createObject(7400, 600, 100, 20, true, ""),
                this.createObject(7550, 400, 100, 20, true, ""),

                this.createObject(7600, 720, 600, 80, true, ""),
            ];

            this.bgOffset = 0;

            this.resetPlayer();

            // IMPORTANT : reset du timing pour le fixed timestep
            this.lastTime = 0;
            this.accumulator = 0;

            this.animationId = requestAnimationFrame(this.loop);
        },

        restartGame() {
            this.startGame();
        },

        handleKeyDown(e) {
            if (e.code === "Space") {
            e.preventDefault();
            this.handleJumpInput();
            }
        },

        handleTouch(e) {
            e.preventDefault();
            this.handleJumpInput();
        },

        handleJumpInput() {
            if (!this.gameStarted) {
                this.startGame();
            return;
            }

            if (this.gameOver) {
                this.restartGame();
            return;
            }

            this.jump();
        },

        jump() {
            console.log(this.frameCount)
            if (this.player.grounded) {
                this.player.velocityY = this.player.jumpForce;
                this.player.grounded = false;
                this.createJumpParticles();
            }
        },

        createJumpParticles() {
            for (let i = 0; i < 8; i++) {
            this.particles.push({
                x: this.player.x + this.player.width / 2,
                y: this.player.y + this.player.height,
                vx: (Math.random() - 0.5) * 4,
                vy: Math.random() * -2 - 1,
                size: Math.random() * 4 + 2,
                life: 30
            });
            }
        },

        spawnObstacle(type, x, y) {
            if (type === "spike") {
                const size = 38 + Math.random() * 20;
                this.obstacles.push({
                    type: "spike",
                    x: x,
                    y: y,
                    width: size,
                    height: size,
                    counted: false
                })
            }
        },
        updatePlayer(dt) {
            const step = 60 * dt;

            this.player.velocityY += this.player.gravity * step;
            this.player.y += this.player.velocityY * step;

            if (this.player.y >= 800) {
                this.endGame();
                return;
            }

            // Rotation en l'air (effet cube)
            if (!this.player.grounded) {
                this.player.rotation += 0.12 * step; // ~1 tour / 52 frames
            } else {
                console.log(this.frameCount)
                // snap rotation au multiple de 90°
                const quarterTurn = Math.PI / 2;
                this.player.rotation = Math.round(this.player.rotation / quarterTurn) * quarterTurn;
            }

            // On considère qu'il est en l'air tant qu'on n'a pas trouvé de sol
            this.player.grounded = false;

            for (const grd of this.groundes) {
                if (this.rectVsRect(this.player, grd)) {
                    const previousBottom = (this.player.y + this.player.height) - (this.player.velocityY * step);

                    // collision par le côté / par dessous sur plateformes flottantes = game over
                    if (
                        this.player.x + this.player.width >= grd.x &&
                        previousBottom > grd.y + 1 &&
                        !grd.ground
                    ) {
                        this.endGame();
                                return;
                            } else {
                                // atterrissage sur le dessus
                                this.player.y = grd.y - this.player.height;
                                this.player.velocityY = 0;
                                this.player.grounded = true;
                            }
                        }
                    }
                },

        updateObstacles(dt) {
            const step = 60 * dt;

            for (let i = this.obstacles.length - 1; i >= 0; i--) {
                const obs = this.obstacles[i];
                obs.x -= this.speed * step;

                if (!obs.counted && obs.x + obs.width < this.player.x) {
                    obs.counted = true;
                    this.score++;
                }

                if (obs.x + obs.width < -50) {
                    this.obstacles.splice(i, 1);
                }
            }

            for (let i = this.groundes.length - 1; i >= 0; i--) {
                const grd = this.groundes[i];
                grd.x -= this.speed * step;

                if (grd.x + grd.width < -50) {
                    this.groundes.splice(i, 1);
                }
            }
        },

        updateParticles(dt) {
            const step = 60 * dt;

            for (let i = this.particles.length - 1; i >= 0; i--) {
                const p = this.particles[i];
                p.x += p.vx * step;
                p.y += p.vy * step;
                p.vy += 0.08 * step;
                p.life -= step;

                if (p.life <= 0) {
                    this.particles.splice(i, 1);
                }
            }
        },

        updateDifficulty() {
            // augmente progressivement la vitesse
            this.speed = Math.min(14, 6 + this.score * 0.18);

            // réduit l'intervalle de spawn (plus dur)
            this.spawnInterval = Math.max(55, 95 - Math.floor(this.score * 0.7));
        },

        checkCollisions() {
            const playerBox = {
                x: this.player.x + 4,
                y: this.player.y + 4,
                width: this.player.width - 8,
                height: this.player.height - 8
            };

            for (const obs of this.obstacles) {
                if (obs.type === "spikeDown") {
                    // Collision plus précise pour le spike :
                    // 1) AABB grossière
                    if (!this.rectVsRect(playerBox, obs)) continue;

                    // 2) Test points du joueur contre triangle du spike
                    const spikeTriangle = [
                        { x: obs.x, y: obs.y},                 // bas gauche
                        { x: obs.x + obs.width / 2, y: obs.y  + obs.height},             // pointe
                        { x: obs.x + obs.width, y: obs.y}     // bas droite
                    ];

                    const playerPoints = [
                        { x: playerBox.x, y: playerBox.y },
                        { x: playerBox.x + playerBox.width, y: playerBox.y },
                        { x: playerBox.x, y: playerBox.y + playerBox.height },
                        { x: playerBox.x + playerBox.width, y: playerBox.y + playerBox.height },
                        { x: playerBox.x + playerBox.width / 2, y: playerBox.y + playerBox.height / 2 }
                    ];

                    for (const point of playerPoints) {
                        if (this.pointInTriangle(point, spikeTriangle[0], spikeTriangle[1], spikeTriangle[2])) {
                            this.endGame();
                            return;
                        }
                    }

                    // fallback si rectangle touche vraiment fort
                    if (this.rectVsRect(playerBox, {
                            x: obs.x + 6,
                            y: obs.y + 6,
                            width: obs.width - 12,
                            height: obs.height - 6
                        })) {
                        this.endGame();
                        return;
                    }
                } else if (obs.type === "spike") {
                    // Collision plus précise pour le spike :
                    // 1) AABB grossière
                    if (!this.rectVsRect(playerBox, obs)) continue;

                    // 2) Test points du joueur contre triangle du spike
                    const spikeTriangle = [
                        { x: obs.x, y: obs.y + obs.height },                 // bas gauche
                        { x: obs.x + obs.width / 2, y: obs.y },             // pointe
                        { x: obs.x + obs.width, y: obs.y + obs.height }     // bas droite
                    ];

                    const playerPoints = [
                        { x: playerBox.x, y: playerBox.y },
                        { x: playerBox.x + playerBox.width, y: playerBox.y },
                        { x: playerBox.x, y: playerBox.y + playerBox.height },
                        { x: playerBox.x + playerBox.width, y: playerBox.y + playerBox.height },
                        { x: playerBox.x + playerBox.width / 2, y: playerBox.y + playerBox.height / 2 }
                    ];

                    for (const point of playerPoints) {
                        if (this.pointInTriangle(point, spikeTriangle[0], spikeTriangle[1], spikeTriangle[2])) {
                            this.endGame();
                            return;
                        }
                    }

                    // fallback si rectangle touche vraiment fort
                    if (this.rectVsRect(playerBox, {
                            x: obs.x + 6,
                            y: obs.y + 6,
                            width: obs.width - 12,
                            height: obs.height - 6
                        })) {
                        this.endGame();
                        return;
                    }
                }
            }
        },

        rectVsRect(a, b) {
            return (
                a.x < b.x + b.width &&
                a.x + a.width > b.x &&
                a.y < b.y + b.height &&
                a.y + a.height > b.y
            );
        },

        pointInTriangle(p, a, b, c) {
            const area = (p1, p2, p3) => Math.abs((p1.x * (p2.y - p3.y) + p2.x * (p3.y - p1.y) + p3.x * (p1.y - p2.y)) / 2);

            const A = area(a, b, c);
            const A1 = area(p, b, c);
            const A2 = area(a, p, c);
            const A3 = area(a, b, p);

            return Math.abs(A - (A1 + A2 + A3)) < 0.5;
        },

        endGame() {
            if (this.gameOver) return;

            this.gameOver = true;

            if (this.animationId) {
                cancelAnimationFrame(this.animationId);
                this.animationId = null;
            }

            this.draw();
            this.drawGameOverOverlay();
        },

        update(dt) {
            if (this.gameOver) return;

            const step = 60 * dt;

            this.frameCount++;
            this.progression = ((this.frameCount / this.frameCountMax)*100).toFixed(1)
            if (this.frameCount == this.frameCountMax) this.endGame()
            this.bgOffset -= this.speed * 0.4 * step;

            this.updatePlayer(dt);
            if (this.gameOver) return;

            this.updateObstacles(dt);
            this.updateParticles(dt);
            //this.updateDifficulty();

            this.spawnTimer += step;
            if (this.spawnTimer >= this.spawnInterval) {
                // this.spawnObstacle();
                this.spawnTimer = 0;
            }

            this.checkCollisions();
        },

        drawBackground() {
            const ctx = this.ctx;

            // lignes décoratives type néon
            ctx.save();
            ctx.globalAlpha = 0.18;

            for (let i = 0; i < 8; i++) {
                const y = 60 + i * 35;
                const offset = (this.bgOffset * (0.5 + i * 0.1)) % 200;
                for (let x = -200; x < this.width + 200; x += 200) {
                    ctx.fillStyle = i % 2 === 0 ? "#22d3ee" : "#a78bfa";
                    ctx.fillRect(x + offset, y, 90, 4);
                }
            }

            ctx.restore();
        },

        drawGround() {
            const ctx = this.ctx;

            // Sol
            ctx.fillStyle = "#0f766e";
            ctx.fillRect(0, this.groundY, this.width, this.height - this.groundY);

            // ligne supérieure du sol
            ctx.fillStyle = "#5eead4";
            ctx.fillRect(0, this.groundY - 4, this.width, 4);

            // motifs au sol
            const tileSize = 40;
            for (let x = (this.bgOffset % tileSize) - tileSize; x < this.width + tileSize; x += tileSize) {
            ctx.strokeStyle = "rgba(255,255,255,0.12)";
            ctx.strokeRect(x, this.groundY + 10, tileSize, tileSize);
            }
        },

        drawPlayer() {
            const ctx = this.ctx;
            const p = this.player;

            ctx.save();
            ctx.translate(p.x + p.width / 2, p.y + p.height / 2);
            ctx.rotate(p.rotation);

            // glow
            ctx.shadowColor = "#22d3ee";
            ctx.shadowBlur = 18;

            // corps
            ctx.fillStyle = "#22d3ee";
            ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);

            // bordure
            ctx.shadowBlur = 0;
            ctx.strokeStyle = "#67e8f9";
            ctx.lineWidth = 3;
            ctx.strokeRect(-p.width / 2, -p.height / 2, p.width, p.height);

            // visage
            ctx.fillStyle = "#0f172a";
            ctx.fillRect(-10, -8, 6, 6);
            ctx.fillRect(4, -8, 6, 6);
            ctx.fillRect(-8, 8, 16, 4);

            ctx.restore();
        },

        drawObstacles() {
            const ctx = this.ctx;

            for (const obs of this.obstacles) {
                if (obs.type === "spikeDown") {
                    ctx.save();
                    ctx.shadowColor = "#facc15";
                    ctx.shadowBlur = 14;
                    ctx.fillStyle = "#facc15";

                    ctx.beginPath();
                    ctx.moveTo(obs.x, obs.y);
                    ctx.lineTo(obs.x + obs.width / 2, obs.y + obs.height);
                    ctx.lineTo(obs.x + obs.width, obs.y);
                    ctx.closePath();
                    ctx.fill();

                    ctx.shadowBlur = 0;
                    ctx.strokeStyle = "#fef08a";
                    ctx.lineWidth = 2;
                    ctx.stroke();
                    ctx.restore();
                    ctx.restore();
                } else if (obs.type === "spike") {
                    ctx.save();
                    ctx.shadowColor = "#facc15";
                    ctx.shadowBlur = 14;
                    ctx.fillStyle = "#facc15";

                    ctx.beginPath();
                    ctx.moveTo(obs.x, obs.y + obs.height);
                    ctx.lineTo(obs.x + obs.width / 2, obs.y);
                    ctx.lineTo(obs.x + obs.width, obs.y + obs.height);
                    ctx.closePath();
                    ctx.fill();

                    ctx.shadowBlur = 0;
                    ctx.strokeStyle = "#fef08a";
                    ctx.lineWidth = 2;
                    ctx.stroke();
                    ctx.restore();
                }
            }
            for (const grd of this.groundes) {
                ctx.save();
                ctx.shadowColor = "blue";
                ctx.shadowBlur = 14;
                ctx.fillStyle = "blue";
                ctx.fillRect(grd.x, grd.y, grd.width, grd.height);
                ctx.shadowBlur = 0;
                ctx.strokeStyle = "aquamarine";
                ctx.lineWidth = 2;
                ctx.strokeRect(grd.x, grd.y, grd.width, grd.height);
                ctx.restore();
            }
        },

        drawParticles() {
            const ctx = this.ctx;

            for (const p of this.particles) {
            ctx.save();
            ctx.globalAlpha = p.life / 30;
            ctx.fillStyle = "#67e8f9";
            ctx.fillRect(p.x, p.y, p.size, p.size);
            ctx.restore();
            }
        },

        drawHUD() {
            const ctx = this.ctx;

            ctx.save();
            ctx.fillStyle = "rgba(255,255,255,0.9)";
            ctx.font = "bold 24px Arial";
            ctx.fillText(`Score: ${this.score}`, 20, 36);
            ctx.restore();
        },

        drawGameOverOverlay() {
            const ctx = this.ctx;

            ctx.save();
            ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
            ctx.fillRect(0, 0, this.width, this.height);

            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 56px Arial";
            ctx.textAlign = "center";
            ctx.fillText("GAME OVER", this.width / 2, this.height / 2 - 20);

            ctx.font = "24px Arial";
            ctx.fillText("Clique ou appuie sur Espace pour rejouer", this.width / 2, this.height / 2 + 30);

            ctx.restore();
        },

        drawStartScreen() {
            const ctx = this.ctx;
            ctx.clearRect(0, 0, this.width, this.height);

            this.drawBackground();
            //this.drawGround();

            // petit cube statique
            this.drawPlayer();

            ctx.save();
            ctx.fillStyle = "rgba(0,0,0,0.35)";
            ctx.fillRect(0, 0, this.width, this.height);

            ctx.fillStyle = "blue";
            ctx.fillRect(0, 720, 2000, 80);

            ctx.fillStyle = "#ffffff";
            ctx.textAlign = "center";
            ctx.font = "bold 52px Arial";
            ctx.fillText("DASH CUBE", this.width / 2, 170);

            ctx.font = "24px Arial";
            ctx.fillText("Clique / Touche / Espace pour commencer", this.width / 2, 230);

            ctx.restore();
        },

        draw() {
            const ctx = this.ctx;
            ctx.clearRect(0, 0, this.width, this.height);

            this.drawBackground();
            //this.drawGround();
            this.drawParticles();
            this.drawObstacles();
            this.drawPlayer();
            this.drawHUD();
        },

        loop(timestamp) {
            let time_tok = document.getElementById("time_tokens").children[0]
            let time = (performance.now() - this.chrono) / 60000
            if (time > 1/60){
                this.chrono = performance.now()
                time_tok.innerText = (parseFloat(time_tok.innerText) - time).toFixed(2)
            }
            if (this.gameOver) return;

            if (!this.lastTime) {
                this.lastTime = timestamp;
            }

            let frameTime = (timestamp - this.lastTime) / 1000;
            this.lastTime = timestamp;

            // évite les gros bonds si freeze / onglet en pause / mobile lag
            frameTime = Math.min(frameTime, 0.05);

            this.accumulator += frameTime;

            while (this.accumulator >= this.fixedDt) {
                this.update(this.fixedDt);
                this.accumulator -= this.fixedDt;

                if (this.gameOver) break;
            }

            this.draw();

            if (!this.gameOver) {
                this.animationId = requestAnimationFrame(this.loop);
            }
        }
    },

    created() {
        // important pour garder le bon "this" dans requestAnimationFrame
        this.loop = this.loop.bind(this);
    }
}
</script>

<style>
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    user-select: none;
}

#canvas{
    aspect-ratio: 1.0;
    width: 100%;
}

#app {
    text-align: center;
}

.game-wrapper {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
}

canvas {
    height: auto;
    display: block;
    border: 3px solid #22d3ee;
    border-radius: 14px;
    background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
    box-shadow: 0 0 25px rgba(34, 211, 238, 0.25);
}

.ui {
    margin-top: 14px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
    font-size: 18px;
}

.btn {
    margin-top: 14px;
    padding: 10px 18px;
    border: none;
    border-radius: 10px;
    background: #22d3ee;
    color: #0f172a;
    font-weight: bold;
    cursor: pointer;
    transition: 0.2s;
}

.btn:hover {
    transform: scale(1.05);
}

.instructions {
    margin-top: 10px;
    opacity: 0.9;
    font-size: 14px;
}

#layerTouch{
    display: none;
}

@media (orientation: landscape) {
    .game-wrapper {
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        height: 100%;
    }

    .game-wrapper canvas{
        margin: 0;
        height: 100%;
        width: auto !important;
    }

    #score {
        color: white;
        flex: 0 0 20%;
    }

    .ui {
        color: white;
        width: 20%;
    }

    .banner {
        display: none
    }

    h1 {
        display: none
    }

    #routerView {
        height: 100vh;
    }

    #layerTouch{
        display: block;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 20;
    }

    .topleft{
        position: absolute;
        top: 10px;
        left: 10px;
    }
}
</style>
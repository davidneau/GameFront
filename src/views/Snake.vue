<template>
    <div>
        <div class="game-container">

            <div class="hud">
                <p>Score : <span id="score">{{ score }}</span></p>
                <h1>Snake</h1>
                <button id="restartBtn" style="margin: 5px">Recommencer</button>
            </div>

            <canvas id="gameCanvas" width="400" height="400"></canvas>

            <div id="touchpad">
                <div></div>
            </div>
            <p id="message">{{ messageEl }}</p>
        </div>
    </div>
</template>

<script>

export default {
    name: "SnakeGame",
    data(){
        return {
            canvas: "",
            ctx: "",
            score: 0,
            messageEl: "",
            cellSize: 20,
            snake: "",
            direction: "",
            food: "",
            gameInterval: "",
            gameOver: "",
            oxTP: 0,
            oyTP: 0,
            countFrame: 0,
        }
    },
    methods: {
        // Initialisation du jeu
        initGame() {
            this.snake = [
                { x: 10, y: 10 },
                { x: 9, y: 10 },
                { x: 8, y: 10 }
            ];

            this.direction = { x: 1, y: 0 }; // le serpent va vers la droite
            this.score = 0;
            this.gameOver = false;

            this.generateFood();

            // On évite d'avoir plusieurs setInterval en même temps
            clearInterval(this.gameInterval);
            this.gameInterval = setInterval(this.gameLoop, 120);
        },

        // Boucle principale du jeu
        gameLoop() {
            if (this.gameOver) return;

            this.update();
            this.draw();
        },

        // Mise à jour de l'état du jeu
        update() {
            // Nouvelle tête = tête actuelle + direction
            const head = {
                x: this.snake[0].x + this.direction.x,
                y: this.snake[0].y + this.direction.y
            };

            // Collision avec les murs
            if (
                head.x < 0 ||
                head.x >= this.tileCount ||
                head.y < 0 ||
                head.y >= this.tileCount
            ) {
                this.endGame();
                return;
            }

            // Collision avec soi-même
            for (let segment of this.snake) {
                if (head.x === segment.x && head.y === segment.y) {
                    this.endGame();
                    return;
                }
            }

            // Ajouter la nouvelle tête
            this.snake.unshift(head);

            // Si on mange la nourriture
            if (head.x === this.food.x && head.y === this.food.y) {
                this.score++;
                this.generateFood();
            } else {
                // Sinon on retire la queue
                this.snake.pop();
            }
        },

        // Dessin
        draw() {
            // Fond
            this.ctx.fillStyle = "#222";
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            // Optionnel : grille
            this.drawGrid();

            // Nourriture
            this.ctx.fillStyle = "red";
            this.ctx.fillRect(
                this.food.x * this.cellSize,
                this.food.y * this.cellSize,
                this.cellSize,
                this.cellSize
            );

            // Serpent
            this.snake.forEach((segment, index) => {
                this.ctx.fillStyle = index === 0 ? "#7CFC00" : "#32CD32";
                this.ctx.fillRect(
                    segment.x * this.cellSize,
                    segment.y * this.cellSize,
                    this.cellSize,
                    this.cellSize
                );
            });
        },

        // Dessiner la grille
        drawGrid() {
            this.ctx.strokeStyle = "#333";

            for (let i = 0; i <= this.tileCount; i++) {
                // lignes verticales
                this.ctx.beginPath();
                this.ctx.moveTo(i * this.cellSize, 0);
                this.ctx.lineTo(i * this.cellSize, this.canvas.height);
                this.ctx.stroke();

                // lignes horizontales
                this.ctx.beginPath();
                this.ctx.moveTo(0, i * this.cellSize);
                this.ctx.lineTo(this.canvas.width, i * this.cellSize);
                this.ctx.stroke();
            }
        },

        // Générer la nourriture
        generateFood() {
            let newFood;
            let bool = true

            while (bool) {
                newFood = {
                    x: Math.floor(Math.random() * this.tileCount),
                    y: Math.floor(Math.random() * this.tileCount)
                };

                // Vérifier que la nourriture n'apparaît pas sur le serpent
                let onSnake = this.snake.some(
                    segment => segment.x === newFood.x && segment.y === newFood.y
                );

                if (!onSnake) break;
            }

            this.food = newFood;
        },

        // Fin de partie
        endGame() {
            this.gameOver = true;
            clearInterval(this.gameInterval);
        },
        handleTouch(e) {
            this.countFrame += 1;
            e.preventDefault(); // empêche scroll / zoom par défaut
            if (this.countFrame % 7 == 0){
                let touchpad = document.getElementById('touchpad')
                const touches = e.touches;

                for (let i = 0; i < touches.length; i++) {
                    const touch = touches[i];
                    let nxTP = touch.clientX - touchpad.getBoundingClientRect().left + touchpad.clientWidth / 2 + window.scrollX
                    let nyTP = touch.clientY - touchpad.getBoundingClientRect().top + touchpad.clientHeight / 2 + window.scrollY
                    console.log(nyTP)
                    console.log(nxTP)

                    console.log(this.oyTP)
                    console.log(this.oxTP)
                    let yTP = nyTP - this.oyTP
                    let xTP = nxTP - this.oxTP
                    console.log(yTP)
                    console.log(xTP)

                    if ((-yTP > xTP) && (-yTP > -xTP)) {
                        console.log("en haut")
                        if (this.direction.y !== 1) this.direction = { x: 0, y: -1 };
                    }
                    else if ((-yTP < xTP) && (-yTP < -xTP)) {
                        if (this.direction.y !== -1) this.direction = { x: 0, y: 1 };
                        console.log("en bas")
                    }
                    else if ((-yTP > xTP) && (-yTP < -xTP)) {
                        if (this.direction.x !== 1) this.direction = { x: -1, y: 0 };
                        console.log("gauche")
                    }
                    else if ((-yTP < xTP) && (-yTP > -xTP)) {
                        if (this.direction.x !== -1) this.direction = { x: 1, y: 0 };
                        console.log("droite")
                    }

                    this.oyTP = nyTP;
                    this.oxTP = nxTP;
                }
            }
        }
    },
    mounted(){
        // Contrôles clavier
        document.addEventListener("keydown", (e) => {
            // Empêcher le demi-tour instantané
            switch (e.key) {
                case "ArrowUp":
                    if (this.direction.y === 1) return;
                    this.direction = { x: 0, y: -1 };
                    break;

                case "ArrowDown":
                    if (this.direction.y === -1) return;
                    this.direction = { x: 0, y: 1 };
                    break;

                case "ArrowLeft":
                    if (this.direction.x === 1) return;
                    this.direction = { x: -1, y: 0 };
                    break;

                case "ArrowRight":
                    if (this.direction.x === -1) return;
                    this.direction = { x: 1, y: 0 };
                    break;
            }
        })

        this.canvas = document.getElementById("gameCanvas")

        this.ctx = this.canvas.getContext("2d")
        this.tileCount = this.canvas.width / this.cellSize,
        // Bouton restart
        document.getElementById("restartBtn").addEventListener("click", this.initGame);


        let touchpad = document.getElementById('touchpad')

        touchpad.addEventListener('touchstart', (e) => this.handleTouch(e), { passive: false });
        touchpad.addEventListener('touchmove', (e) => this.handleTouch(e), { passive: false });
        touchpad.addEventListener('touchend', (e) => this.handleTouch(e), { passive: false });

        // Lancer le jeu
        this.initGame();
        this.draw();
    }
}
</script>

<style>
.game-container {
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  max-height: 100%;
  overflow: auto;
}

#touchpad{
    background-color: grey;
    width: 60%;
    aspect-ratio: 1.0;
    position: relative;
}

#touchpad>div {
    background-color: red;
    border-radius: 50%;
    width: 5px;
    height: 5px;
    position: absolute;
    top: 50%;
    left: 50%;
}

#gameCanvas {
  display: block;
  width: 100vw;   /* prend toute la largeur de l'écran */
  height: 100vw;  /* carré, même hauteur que largeur */
  max-width: 100%;
  background: #222;
}

h1 {
  margin-bottom: 10px;
}

.hud {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  gap: 20px;
}

canvas {
  border-top: 3px solid #fff;
  border-bottom: 3px solid #fff;
  background: #222;
  display: block;
  margin: 0 auto; 
}

button {
  padding: 8px 14px;
  border: none;
  cursor: pointer;
  border-radius: 6px;
  font-weight: bold;
}

#message {
  margin-top: 10px;
  min-height: 24px;
  font-size: 18px;
  color: #ff6b6b;
}
</style>

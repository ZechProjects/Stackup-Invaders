class Debris {
    constructor() {
        this.r = 5;
        this.resetDebris();
        this.angle = 0;
    }

    resetDebris() {
        this.y = random(height - 10);
        this.r = random(5, 10)

        let spawnLeftSide = random(1) < 0.5;

        if (spawnLeftSide) {
            this.x = random(-width, 0);
            this.isGoingLeft = false;
        } else {
            this.x = random(width, width * 2);
            this.isGoingLeft = true;
        }
    }

    update() {
        if (this.isGoingLeft) {
            this.x--;
        } else {
            this.x++;
        }

        this.angle++;

        if (this.isOffScreen()) {
            this.resetDebris();
        }
    }

    isOffScreen() {
        if (this.isGoingLeft && this.x < -5) {
            return true;
        } else if (!this.isGoingLeft && this.x > width + 5) {
            return true;
        }
        return false;
    }

    draw() {
        fill(100);
        noStroke();
        //ellipse(this.x, this.y, this.r * 2, this.r * 2);
        image(asteroidImg, this.x, this.y, this.r * 2, this.r * 2);
    }

    hasHitPlayer(player) {
        if (dist(this.x, this.y, player.x, player.y) < this.r + player.r) {
            return true;
        }
        return false
    }
}
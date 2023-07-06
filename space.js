//board

let tileSize = 32;
let rows = 16;
let columns = 16;

let board;
let boardWidth = tileSize * columns;  // 32 * 16
let boardHeight = tileSize * rows;  // 32 * 16
let context;

//ship

let shipWidth = tileSize * 2;
let shipHeight = tileSize;
let shipX = tileSize * columns/2 - tileSize; 
let shipY = tileSize * rows - tileSize*2; 


let ship = {
    x : shipX,
    y : shipY,
    width : shipWidth,
    height: shipHeight
}


let shipImg; 
let shipVelocityX = tileSize; //come si muove la navicella



//aliens

let alienArray = [];
let alienWidth = tileSize * 2;
let alienHeight = tileSize;
let alienX = tileSize;
let alienY = tileSize; 
let alienImg; 

let alienRows = 2; 
let alienColumns = 3; 
let alienCount = 0; 
let alienVelocityX = 1; //velocità alieni

//bullets
let bulletArray = []; 
let bulletVelocityY = -10; //proiettili velocità 

let score = 0;
let gameOver = false; 




window.onload = function() {
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d"); //lo usiamo per disegnare sullo schermo 


    //draw initial ship
    // context.fillStyle="blue";
    // context.fillRect(ship.x, ship.y, ship.width, ship.height);

        // carico immagini 
        shipImg = new Image();
        shipImg.src = "./ship.png";
        shipImg.onload = function() {
          context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);  
        }

        alienImg = new Image();
        alienImg.src = "./alien.png";
        createAliens();

        requestAnimationFrame(update);
        document.addEventListener("keydown", moveShip);
        document.addEventListener("keyup", shoot);
    }

        function update(){
            requestAnimationFrame(update);

            if (gameOver) {
                return; 
            }

            //elimina la ripetizione dell'immagine nel movimento 
            context.clearRect(0,0, board.width, board.height);


        //ship
        context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);

        //alien
        for(let i = 0; i < alienArray.length; i++) {
            let alien = alienArray[i];
            if (alien.alive){
                alien.x += alienVelocityX; 
                

                //gestiamo i bordi 
                if (alien.x + alien.width >= board.width || alien.x <= 0){
                    alienVelocityX *= -1;
                    alien.x += alienVelocityX*2;
                        //muoviamo gli alieni avanti di una linea
                    for (let j = 0; j < alienArray.length; j++){
                        alienArray[j].y += alienHeight; 
                    }
                }
                context.drawImage(alienImg, alien.x, alien.y, alien.width, alien.height);
                 
                if (alien.y >= ship.y){
                    gameOver = true; 
                }
                
            }
        }

        //bullets
        for (let i = 0; i < bulletArray.length; i++){
            let bullet = bulletArray[i];
            bullet.y += bulletVelocityY; 
            context.fillStyle="white";
            context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

            //bullet collision with aliens
            for (let j = 0; j < alienArray.length; j++){
                let alien = alienArray[j];
                if (!bullet.used && alien.alive && detectCollision(bullet, alien)) {
                    bullet.used = true;
                    alien.alive = false;
                    alienCount--;

                    score += 100; 
                }
            }

        }

        //clear bullets
        while (bulletArray.length > 0 && (bulletArray[0].used || bulletArray[0].y < 0)){
            bulletArray.shift(); //rimuove il primo elemento array
        }

        //next level
        if (alienCount == 0){
            //increase di uno
            alienColumns = Math.min(alienColumns + 1, columns/2 -2); // cap at 16/2 -2 = 6
            alienRows = Math.min(alienRows + 1, rows-4); // cap at 16-4 = 12
            alienVelocityX += 0.2; //increase the alien movement
            alienArray = []; 
            bulletArray = []; 
            createAliens();
        }

        //score

        context.fillStyle="white";
        context.font="16px courier";
        context.fillText(score, 5, 20);

    }

        function moveShip(e){
            if (gameOver){
                return;
            }

            if(e.code == "ArrowLeft" && ship.x - shipVelocityX >= 0){
                ship.x -= shipVelocityX; // si muove a sinistra 
            }
            else if (e.code == "ArrowRight" && ship.x + shipVelocityX + ship.width <= board.width){
                ship.x += shipVelocityX; // muove a destra la prima mattonella 
            }
        }

        function createAliens() {
            for (let c = 0; c < alienColumns; c++) {
                for (let r = 0; r < alienRows, r++){
                    let alien = {
                        img: alienImg,
                        x : alienX + c*alienWidth,
                        y : alienY + r*alienHeight,
                        width : alienWidth,
                        height : alienHeight,
                        alive : true
                    }

                    alienArray.push(alien);
 
                }
            }
        
            alienCount = alienArray.length; 

          }

          function shoot(e){

            if (gameOver){
                return; 
            }

            if(e.code == "Space"){
                //shot
                let bullet = {
                    x : ship.x + shipWidth*15/32,
                    y : ship.y,
                    width: tileSize/8,
                    height : tileSize/2,
                    used : false
                }

                bulletArray.push(bullet);
            }
          }

          function detectCollision(a, b){
            return a.x < b.x + b.width && // angolo superiore sinistro di a non tocca angolo destro superiore di b
                   a.x + a.width > b.x && // angolo superiore destro di a passa angolo superiore sinistro di b
                   a.y < b.y + b.height && // angolo superiore sinistro di a non tocca angolo inferiore sinistro di b 
                   a.y + a .height > b.y; //angolo infeirore sinistro di a passa angolo superiore sinistro di b 
          }
        
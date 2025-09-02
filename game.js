const canvas = document.getElementById("game")
const canvasCtx = canvas.getContext("2d")

const CANVAS_WIDTH = 1000
const CANVAS_HEIGHT = 600

const CW_CEN = CANVAS_WIDTH / 2
const CH_CEN = CANVAS_HEIGHT / 2

function inside(a, b) {
  return a.x >= b.x &&
         a.y >= b.y &&
         a.x + a.size <= b.x + b.size &&
         a.y + a.size <= b.y + b.size;
}



class TargetObject {
    constructor(x, y, targetType) {
        this.targetObject = new Image()
        switch (targetType) {
            case "target1":
                this.targetObject.src = "./assets/target1.png"
                break;
            case "target2":
                this.targetObject.src = "./assets/target2.png"
                break;
            case "target3":
                this.targetObject.src = "./assets/target3.png"
                break;


            default:
                this.targetObject.src = "./assets/target1.png"
        }


        this.x = x,
        this.y = y

        this.size = 100
    }
}


class PointerObject {
    constructor(x, y) {
        this.pointerObject = new Image()
        this.pointerObject.src = "./assets/pointer.png"

        this.x = x,
        this.y = y

        this.size = 50
    }
}

class BoomObject {
    constructor(x, y) {
        this.boomObject = new Image()
        this.boomObject.src = "./assets/boom.png"

        this.x = x
        this.y = y

        this.lifetime = 5
    }
}


class Board {
    constructor(ctx, username, timer, gunType, targetType) {
        this.ctx = ctx
        
        this.username = username
        this.timer = timer
        
        this.gunObject = new Image()
        switch (gunType.value) {
            case "gun1":
                this.gunObject.src = "./assets/gun1.png"
                break;
            case "gun2":
                this.gunObject.src = "./assets/gun2.png"
                break;

            default:
                this.gunObject.src = "./assets/gun1.png"
        }
        
        this.targetType = targetType.value
        this.targetObjects = []

        this.boomObjects = []
        
        this.cursorX = 0
        this.cursorY = 0 

        this.pointerObject = new PointerObject(this.cursorX, this.cursorY)

        this.bgObj = new Image()
        this.bgObj.src = "./assets/background.jpg"


        this.score = 0
    }


    initialize () {
        this.listenMouse()
        this.onFrame()
    }

    onFrame () {
        requestAnimationFrame(this.onFrame.bind(this))

        this.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
        this.ctx.drawImage(this.bgObj, 0, 0)

        if (this.targetObjects.length < 3) {
            const newTargetObject = new TargetObject((Math.random() * (CANVAS_WIDTH - 200) + 100 ), Math.random() * (CANVAS_HEIGHT - 200), this.targetType)
            this.targetObjects.push(
                newTargetObject
            )
        }

        this.ctx.font = "24px Arial"
        this.ctx.fillText(this.score, 20, 20)

        this.targetObjects.forEach((target) => {
            this.ctx.drawImage(target.targetObject, target.x, target.y, target.size, target.size)
        })

        this.boomObjects.forEach((boom,i) => {
            this.ctx.drawImage(boom.boomObject, boom.x - (100/2), boom.y - (100/2), 100, 100)
            boom.lifetime -= 1

            if (boom.lifetime < 1) {
                this.boomObjects.splice(i,1)
            }
        })

        this.ctx.drawImage(this.pointerObject.pointerObject,
            this.pointerObject.x,
            this.pointerObject.y,
        this.pointerObject.size, this.pointerObject.size)

        this.ctx.drawImage(this.gunObject,
            this.cursorX - (300 / 2),
            CANVAS_HEIGHT - 200,
        300, 200)
    }

    shoot () {
        for (const target of this.targetObjects) {
            if (inside(this.pointerObject, target)) {
                this.targetObjects = this.targetObjects.filter(t => t !== target)
                this.score += 1

                const newBoomObject = new BoomObject(this.cursorX, this.cursorY)
                this.boomObjects.push(newBoomObject)
                break;
            } 
        }
    }

    listenMouse() {
        canvas.addEventListener("mousemove", (ev) => { const rect = canvas.getBoundingClientRect();
            this.pointerObject.x = ev.x - rect.left - (this.pointerObject.size / 2);
            this.pointerObject.y = ev.y - rect.top - (this.pointerObject.size / 2);
            this.cursorX = ev.x - rect.left; this.cursorY = ev.y - rect.top; })
        canvas.addEventListener("mousedown", () => this.shoot())
    }
    // drawText(text, x, y, style) {
    //     this.ctx.font = style
    //     this.ctx.fillText(text, x, y)
    // }

    // drawBG() {
    //     this.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    //     this.ctx.drawImage(this.bgObj, 0,0)
    //     console.log("drawn bg")
    // }
}



let boardDrawer
// boardDrawer.drawBG()
// boardDrawer.drawText("heehe", CW_CEN, CH_CEN, "48px Arial")





const playGameButton = document.getElementById("playGameButton")
const inputUsn = document.getElementById("inputUsn")
const inputLevel = document.getElementById("inputLevel")

const mainScreen = document.getElementById("mainScreen")
const gameScreen = document.getElementById("gameScreen")

function getSelectedGun() {
    const selected = document.querySelector('input[name="gunSelect"]:checked')
    return selected
}
function getSelectedTargetStyle() {
    const selected = document.querySelector('input[name="targetSelect"]:checked')
    return selected
}


playGameButton.addEventListener("click", () => {
    const username = inputUsn.value
    const level = inputLevel.value

    const gun = getSelectedGun()
    const target = getSelectedTargetStyle()

    if (username && level != "Select Level" && gun && target) {
        console.log('ay')
        mainScreen.style.display = "none"
        gameScreen.style.display = "block"


        boardDrawer = new Board(canvasCtx, username, level, gun, target)
        boardDrawer.initialize()

    } else {
        alert("Fill all required fields!")
    }
})






const instructionShow = document.getElementById("instructionButton")
const instructionBox = document.getElementById("instructionsBox")
const instructionBoxClose = document.getElementById("instructionsBoxClose")

instructionShow.addEventListener("click", () => {
    instructionBox.style.display = "flex"
})


instructionBoxClose.addEventListener("click", () => {
    instructionBox.style.display = "none"
})


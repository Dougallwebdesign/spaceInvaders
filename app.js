document.addEventListener('DOMContentLoaded', () => {
    const squares = document.querySelectorAll('.grid div')
    const resultDisplay = document.querySelector('#result')
    let width = 15
    let currentShooterIndex = 202
    let currentInvaderIndex = 0
    let alienInvaderTakenDown = []
    let result = 0
    let direction = 1
    let invaderId


    //define the alien invader
    const alienInvader = [
       0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
       15,16,17,18,19,20,21,22,23,24,
       30,31,32,33,34,35,36,37,38,39
    ]

    //draw the alien invaders
    alienInvader.forEach( invader => squares[currentInvaderIndex + invader].classList.add('invader'))

    //draw the shooter
    squares[currentShooterIndex].classList.add('shooter')

    //move the shooter along a line
    function moveShooter(e) {
        squares[currentShooterIndex].classList.remove('shooter')
        switch(e.keyCode) {
            case 37:
                if(currentShooterIndex % width !== 0) currentShooterIndex -=1
                break
            case 39:
                if(currentShooterIndex % width < width -1) currentShooterIndex +=1
                break
        }
        squares[currentShooterIndex].classList.add('shooter')
    }
    document.addEventListener('keydown', moveShooter)

    //move the alien invaders
    function moveInvaders() {
        const leftEdge = alienInvader[0] % width === 0
        const rightEdge = alienInvader[alienInvader.length -1] % width === width -1

        if((leftEdge && direction === -1) || (rightEdge && direction === 1)) {
            direction = width
        } else if (direction === width) {
            if (leftEdge) direction = 1
            else direction = -1
        }
        for (let i = 0; i <= alienInvader.length -1; i++) {
            squares[alienInvader[i]].classList.remove("invader")
        }
        for (let i = 0; i <= alienInvader.length -1; i++) {
            alienInvader[i] += direction
        }
        for (let i = 0; i <= alienInvader.length -1; i++) {
            if (!alienInvaderTakenDown.includes(i)){
                squares[alienInvader[i]].classList.add("invader")
            }
        }

        //decide a game over
        if (squares[currentShooterIndex].classList.contains("invader", "shooter")) {
            resultDisplay.textContent = "Game Over"
            squares[currentShooterIndex].classList.add("boom")
            clearInterval(invaderId)
        }

        for (let i = 0; i <=alienInvader.length -1; i++) {
            if(alienInvader[i] > (squares.length - (width-1))) {
                resultDisplay.textContent = "Game Over"
                clearInterval(invaderId)
            }
        }

        //decide a win
        if(alienInvaderTakenDown.length === alienInvader.length) {
            resultDisplay.textContent = "You Win"
            clearInterval(invaderId)
        }

    }
    invaderId = setInterval(moveInvaders, 500)


    //shoot at aliens
    function shoot(e) {
        let lasedId
        let currentrLaserIndex = currentShooterIndex
        //move the laser from the shooter to the alien Invader
        function moveLaser() {
            squares[currentrLaserIndex].classList.remove("laser")
            currentrLaserIndex -= width
            squares[currentrLaserIndex].classList.add("laser")
            if(squares[currentrLaserIndex].classList.contains("invader")) {
                squares[currentrLaserIndex].classList.remove("laser")
                squares[currentrLaserIndex].classList.remove("invader")
                squares[currentrLaserIndex].classList.add("boom")

                setTimeout(() => squares[currentrLaserIndex].classList.remove("boom"), 250)
                clearInterval(lasedId)

                const alienTakenDown = alienInvader.indexOf(currentrLaserIndex)
                alienInvaderTakenDown.push(alienTakenDown)
                result++
                resultDisplay.textContent = result
            }

            if(currentrLaserIndex < width) {
                clearInterval(lasedId)
                setTimeout(() => squares[currentrLaserIndex].classList.remove("laser"), 100)
            }
        }

        // document.addEventListener("keyup", e => {
        //     if (e.keyCode === 32) {
        //         lasedId = setInterval(moveLaser, 100)
        //     }
        // })

        switch(e.keyCode) {
            case 32:
                laserId = setInterval(moveLaser, 100)
                break
        }
    }

    document.addEventListener("keyup", shoot)

})
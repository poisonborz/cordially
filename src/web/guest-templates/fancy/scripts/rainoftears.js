
const container = document.createElement('div')
container.id = 'emojirain'
container.style.cssText = 'position:absolute;width:100%;height:100%;opacity:0.3;z-index:100;background:#000;'
document.body.appendChild(container)

container.style.cssText = 'width: 100%;height: 100vh;position: fixed;top: 0;left: 50vw;pointer-events: none;z-index: 5000;'
const emoji = ['😥', '💧', '😰', '😞', '😣', '😨', '😧', '😢', '😥', '😪', '🥺', '😟', '🙄', '😕', '😭', '💧', '😰', '😥', '💧', '😰', '😞', '😣', '😨', '😧', '😢', '😥', '😪', '🥺', '😟', '🙄', '😕', '😭', '💧', '😰']
const circles = []

for (let i = 0; i < 25; i++) {
    addCircle(i * 150, [10 + 0, 300], emoji[Math.floor(Math.random() * emoji.length)])
    addCircle(i * 150, [10 + 0, -300], emoji[Math.floor(Math.random() * emoji.length)])
    addCircle(i * 150, [10 - 200, -300], emoji[Math.floor(Math.random() * emoji.length)])
    addCircle(i * 150, [10 + 200, 300], emoji[Math.floor(Math.random() * emoji.length)])
    addCircle(i * 150, [10 - 400, -300], emoji[Math.floor(Math.random() * emoji.length)])
    addCircle(i * 150, [10 + 400, 300], emoji[Math.floor(Math.random() * emoji.length)])
    addCircle(i * 150, [10 - 600, -300], emoji[Math.floor(Math.random() * emoji.length)])
    addCircle(i * 150, [10 + 600, 300], emoji[Math.floor(Math.random() * emoji.length)])
}

function addCircle (delay, range, color) {
    setTimeout(function () {
        const c = new Circle(range[0] + Math.random() * range[1], 80 + Math.random() * 4, color, {
            x: -0.15 + Math.random() * 0.3,
            y: 1 + Math.random() * 1
        }, range)
        circles.push(c)
    }, delay)
}

function Circle (x, y, c, v, range) {
    const _this = this
    this.x = x
    this.y = y
    this.color = c
    this.v = v
    this.range = range
    this.element = document.createElement('span')
    this.element.style.opacity = 0
    this.element.style.position = 'absolute'
    this.element.style.fontSize = '26px'
    this.element.style.color = 'hsl(' + (Math.random() * 360 | 0) + ',80%,50%)'
    this.element.innerHTML = c
    container.appendChild(this.element)

    this.update = function () {
        if (_this.y > 800 && !cancelled) {
            _this.y = 80 + Math.random() * 4
            _this.x = _this.range[0] + Math.random() * _this.range[1]
        }
        _this.y += _this.v.y * 3
        _this.x += _this.v.x
        this.element.style.opacity = 1
        this.element.style.transform = 'translate3d(' + _this.x + 'px, ' + _this.y + 'px, 0px)'
        this.element.style.webkitTransform = 'translate3d(' + _this.x + 'px, ' + _this.y + 'px, 0px)'
        this.element.style.mozTransform = 'translate3d(' + _this.x + 'px, ' + _this.y + 'px, 0px)'
    }
}


let cancelled = false
let animCancelled = false

function animate () {
    if (animCancelled) return false
    for (const i in circles) {
        circles[i].update()
    }
    const x = requestAnimationFrame(animate)
}

export const rainoftears = () => {
    cancelled = false
    animCancelled = false
    animate()
    setTimeout(() => {
        cancelled = true
    }, 2000)

    setTimeout(() => {
        animCancelled = true
    }, 15000)
}

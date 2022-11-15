import { timer } from "./src/data/db.js";
console.log(timer)

const ACTIVE = 'active'

//pomodoro's tabs
const tabs = document.querySelectorAll('[data-tab-target]')
//pomodoro's contents:focus-time, short-break, long-rest
const tabContent = document.querySelectorAll('[data-tab-content]')
const timeShow = document.querySelectorAll('.time')
//pomodoro's three contents' buttions
const startBtn = document.querySelectorAll('.start')
const pomoAmount = document.querySelectorAll

const audios = []

//Beep sound for pomodoro when complete one, there are three diffirent audios stored in the src, the three audiso correspond to three content's completed remind sound(focus, short break, long break). 
timer.forEach(element => {
    const audio = new Audio(`./src/sounds/${element.sound}`)
    audio.loop = true
    audios.push(audio)
})

//same logic as mainTabs
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabContent.forEach(content => {
            content.classList.remove(ACTIVE)
        })
        tabs.forEach(tab => {
            tab.classList.remove(ACTIVE)
        })
        tab.classList.toggle(ACTIVE)
        const target = document.querySelector(tab.dataset.tabTarget)
        target.classList.toggle(ACTIVE)
    })
})

//get the timer configuration from imported timer, the length for focus, short break and long-break
timeShow.forEach((element, index) => {
    const totalTime = calculateTotalSeconds(timer[index])
    elementTime(element, totalTime)
})

//transformed time to seconds for caculation
function calculateTotalSeconds(timer) {
    const { hours, minutes, seconds } = timer;
    return 3600 * hours + 60 * minutes + seconds;
}

//Standarize hour, minuts, seconds and make them displayed in the dom
function elementTime(element, time) {
    const { hours, minutes, seconds } = calculateTime(time)
    element.textContent = `${minutes}:${seconds}`
    if (hours) {
        element.textContent = `${hours}:` + element.textContent
    }
}

function calculateTime(time) {
    const hours = parseInt(time / 3600)
    const minutes = addZero(parseInt(parseInt(time % 3600) / 60))
    const seconds = addZero(time - hours * 3600 - minutes * 60)
    return { hours, minutes, seconds }
}

function addZero(time) {
    return (+time < 10 && +time >= 0) ? `0${time}` : time
}

/*
Set Click listener for start button, the original text displayed is "Start"
When clicked the button:
1. pause and set related audio's time
2. toggle the button's active status: active -> inactive, inactive->active
3. determine whether it is currently active and set the value to inActive
4. change buttion's text
5. according to active status, trigger differnt logic
if active: call "start" to start pomodoro timer and countdown
if inactive -> that means previously the pomodoro is active, we want to break that one thus making it inactive: clear previous timer and set the timer to default. 
*/
startBtn.forEach((element, index) => {
    element.textContent = "Start"
    let handle
    element.addEventListener('click', () => {
        audios[index].pause()
        audios[index].currentTime = 0;
        element.classList.toggle(ACTIVE)
        const isActive = element.classList.contains(ACTIVE)
        element.textContent = isActive ? "Stop" : "Start"
        if (isActive) {
            handle = start(index, timeShow[index],
                calculateTotalSeconds(timer[index]))
        } else {
            clearInterval(handle)
            const totalTime = calculateTotalSeconds(timer[index])
            elementTime(timeShow[index], totalTime)
        }
    })
})


/*
Timer logic:
Input: button index, element dom, time to countdown
Using setInterval to decrease time every second and use "elementTime" to display that changes
If time < 0, that means time is up and should play reminder audio
*/
function start(index, element, time) {
    let handle = null
    if (time) {
        handle = setInterval(() => {
            elementTime(element, --time)
            if (time <= 0) {
                clearInterval(handle)
                startBtn[index].textContent = "Reset"
                audios[index].play()
            }
        }, 1000)
    } else {
        startBtn[index].textContent = "Reset"
        audios[index].play()
    }
    return handle
}
import { timer } from "./src/data/db.js";
console.log(timer)

const ACTIVE = 'active'
//mainTabs are for Focus, Reminders and Feed
const mainTabs = document.querySelectorAll('[data-main-tab-target]')
//mainTabContent are for the content of the three
const mainTabContent = document.querySelectorAll('[data-main-tab-content]')

/*Set a click event listener to all the tabs
when clicked:
1. set all main tab contents' status to inactive
2. set all main tabs status to inactive
3. set current clicked tab's status to active
4. via html's dataset attribute to get main tab content's id name and get the content
5. set the related content's status to active
*/
mainTabs.forEach(mainTab => {
    mainTab.addEventListener('click', () => {
        //1. set all main tab contents' status to inactive
        mainTabContent.forEach(content => {
            content.classList.remove(ACTIVE)
        })
        //2. set all main tabs status to inactive
        mainTabs.forEach(mainTab => {
            mainTab.classList.remove(ACTIVE)
        })
        //3. set current clicked tab's status to active
        mainTab.classList.toggle(ACTIVE)
        //4.via html's dataset attribute to get main tab content's id name(mainTab.dataset.mainTabTarget) and get the content(querySelector)
        const target = document.querySelector(mainTab.dataset.mainTabTarget)
        //5. set the related content's status to active
        target.classList.toggle(ACTIVE)
    })
})
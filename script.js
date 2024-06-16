const daily = []
const special = []

function dailyTime() {
    const time = new Date()
    time.setHours(0)
    time.setMinutes(0)
    time.setSeconds(0)
    time.setMilliseconds(0)
    return time.getTime()
}

// Storage
function questsLoad() {
    const save = (localStorage["quests"] || "").split("\n")

    const dailyCount = parseInt(save[0])
    for (let i = 0; i < dailyCount; i++) {
        daily.push({
            title: save[2 + i * 2],
            last: parseInt(save[3 + i * 2])
        })
    }

    const specialCount = parseInt(save[1])
    for (let i = 0; i < specialCount; i++) {
        special.push({
            title: save[2 + (dailyCount + i) * 2],
            deadline: save[3 + (dailyCount + i) * 2]
        })
    }
}

function questsSave() {
    let save = daily.length + "\n" + special.length

    for (const quest of daily) {
        save += "\n" + quest.title + "\n" + quest.last
    }

    for (const quest of special) {
        save += "\n" + quest.title + "\n" + quest.deadline
    }

    localStorage["quests"] = save
}

// Draw
function drawDaily(main) {
    for (let i = 0; i < daily.length; i++) {
        if (main && daily[i].last === dailyTime()) {
            continue
        }

        const quest = document.createElement("div")
        quest.className = "quest horizontal"

        const heading = document.createElement("h1")
        heading.innerText = daily[i].title
        heading.className = "stretch"
        heading.onclick = () => pageDailyAdd(i, main)
        quest.appendChild(heading)

        if (main) {
            const done = document.createElement("button")
            done.innerText = "DONE"
            done.onclick = () => {
                daily[i].last = dailyTime()
                questsSave()
                document.body.removeChild(quest)
            }

            quest.appendChild(done)
        }

        document.body.appendChild(quest)
    }
}

function drawSpecial(main) {
    for (let i = 0; i < special.length; i++) {
        const quest = document.createElement("div")
        quest.className = "quest horizontal"

        const body = document.createElement("div")
        body.className = "vertical stretch"
        body.onclick = () => pageSpecialAdd(i, main)

        const heading = document.createElement("h1")
        heading.innerText = special[i].title
        body.appendChild(heading)

        const date = new Date(special[i].deadline)
        const deadline = "Deadline: " + date.getDate()
            + "/" + (date.getMonth() + 1)
            + "/" + date.getFullYear()
            + " " + date.getHours()
            + ":" + date.getMinutes()

        body.appendChild(document.createTextNode(deadline))
        quest.appendChild(body)

        if (main) {
            const done = document.createElement("button")
            done.innerText = "DONE"
            done.onclick = () => {
                special.splice(i, 1)
                questsSave()
                document.body.removeChild(quest)
            }

            quest.appendChild(done)
        }

        document.body.appendChild(quest)
    }
}

// Page
function pageDailyAdd(index, main) {
    const backFn = main ? pageMain : pageDaily

    const titleDiv = document.createElement("div")
    titleDiv.className = "horizontal"

    const titleLabel = document.createElement("label")
    titleLabel.innerText = "Title: "
    titleDiv.appendChild(titleLabel)

    const titleInput = document.createElement("input")
    titleInput.type = "text"
    titleInput.className = "stretch"
    titleDiv.appendChild(titleInput)

    const headerDiv = document.createElement("div")
    headerDiv.className = "horizontal"

    const headerBack = document.createElement("button")
    headerBack.innerText = "BACK"
    headerBack.className = "stretch"
    headerBack.onclick = backFn
    headerDiv.appendChild(headerBack)

    const headerDone = document.createElement("button")
    headerDone.innerText = "DONE"
    headerDone.className = "stretch"
    headerDone.onclick = () => {
        if (titleInput.value) {
            if (index === null) {
                daily.push({
                    title: titleInput.value,
                    last: dailyTime() - 8.64e7
                })
            } else {
                daily[index].title = titleInput.value
            }

            questsSave()
            backFn()
        }
    }
    headerDiv.appendChild(headerDone)

    if (index !== null) {
        titleInput.value = daily[index].title

        const remove = document.createElement("button")
        remove.innerText = "REMOVE"
        remove.className = "stretch"
        remove.onclick = () => {
            daily.splice(index, 1)
            questsSave()
            backFn()
        }
        headerDiv.appendChild(remove)
    }

    document.body.replaceChildren(headerDiv, titleDiv)
}

function pageSpecialAdd(index, main) {
    const backFn = main ? pageMain : pageSpecial

    const titleDiv = document.createElement("div")
    titleDiv.className = "horizontal"

    const titleLabel = document.createElement("label")
    titleLabel.innerText = "Title: "
    titleDiv.appendChild(titleLabel)

    const titleInput = document.createElement("input")
    titleInput.type = "text"
    titleInput.className = "stretch"
    titleDiv.appendChild(titleInput)

    const deadlineDiv = document.createElement("div")
    deadlineDiv.className = "horizontal"

    const deadlineLabel = document.createElement("label")
    deadlineLabel.innerText = "Deadline: "
    deadlineDiv.appendChild(deadlineLabel)

    const deadlineInput = document.createElement("input")
    deadlineInput.type = "datetime-local"
    deadlineInput.className = "stretch"
    deadlineDiv.appendChild(deadlineInput)

    const div = document.createElement("div")
    div.className = "horizontal"

    const back = document.createElement("button")
    back.innerText = "BACK"
    back.className = "stretch"
    back.onclick = backFn
    div.appendChild(back)

    const done = document.createElement("button")
    done.innerText = "DONE"
    done.className = "stretch"
    done.onclick = () => {
        const time = new Date(deadlineInput.value).getTime()
        if (titleInput.value && deadlineInput.value && !isNaN(time)) {
            if (index === null) {
                special.push({
                    title: titleInput.value,
                    deadline: time
                })
            } else {
                special[index].title = titleInput.value
                special[index].deadline = time
            }

            questsSave()
            backFn()
        }
    }
    div.appendChild(done)

    if (index !== null) {
        titleInput.value = special[index].title
        deadlineInput.value = special[index].deadline

        const remove = document.createElement("button")
        remove.innerText = "REMOVE"
        remove.className = "stretch"
        remove.onclick = () => {
            special.splice(index, 1)
            questsSave()
            backFn()
        }
        div.appendChild(remove)
    }

    document.body.replaceChildren(div, titleDiv, deadlineDiv)
}

function pageQuests(drawFn, pageAddFn) {
    const div = document.createElement("div")
    div.className = "horizontal"

    const back = document.createElement("button")
    back.innerText = "BACK"
    back.className = "stretch"
    back.onclick = pageMain
    div.appendChild(back)

    const add = document.createElement("button")
    add.innerText = "ADD"
    add.className = "stretch"
    add.onclick = () => pageAddFn(null, false)
    div.appendChild(add)

    document.body.replaceChildren(div)
    drawFn(false)
}

function pageDaily() {
    pageQuests(drawDaily, pageDailyAdd)
}

function pageSpecial() {
    pageQuests(drawSpecial, pageSpecialAdd)
}

let notifyLeft = true
let notifyDaily = true
let notifyIndex = 0

function notify(title, count) {
    document.body.style.alignItems = "center"
    document.body.style.justifyContent = "center"

    const div = document.createElement("div")
    div.className = "vertical notification"

    const header = document.createElement("h1")
    if (notifyDaily) {
        header.innerText = "Failed Daily Quest " + count + (count == 1 ? " time" : " times")
    } else {
        header.innerText = "Failed Special Quest"
    }
    div.appendChild(header)

    div.appendChild(document.createTextNode(title))

    const button = document.createElement("button")
    button.innerText = "OK"
    button.onclick = pageMain
    div.appendChild(button)

    document.body.replaceChildren(div)
}

function pageMain() {
    if (notifyLeft) {
        if (notifyDaily) {
            while (notifyIndex < daily.length) {
                const now = dailyTime()
                const failed = (now - daily[notifyIndex++].last) / 8.64e7
                if (failed > 1) {
                    notify(daily[notifyIndex - 1].title, failed - 1)
                    return
                }
            }

            notifyIndex = 0
            notifyDaily = false
        }

        while (notifyIndex < special.length) {
            const now = new Date().getTime()
            const deadline = special[notifyIndex++].deadline
            if (now > deadline) {
                notify(special[notifyIndex - 1].title, null)
                special.splice(notifyIndex - 1, 1)
                questsSave()
                return
            }
        }

        notifyLeft = false

        document.body.style.padding = "0.6rem"
        document.documentElement.style.height = "90%"

        document.body.style.alignItems = ""
        document.body.style.justifyContent = ""
    }

    const div = document.createElement("div")
    div.className = "horizontal"

    const dailyButton = document.createElement("button")
    dailyButton.innerText = "DAILY"
    dailyButton.className = "stretch"
    dailyButton.onclick = pageDaily
    div.appendChild(dailyButton)

    const specialButton = document.createElement("button")
    specialButton.innerText = "SPECIAL"
    specialButton.className = "stretch"
    specialButton.onclick = pageSpecial
    div.appendChild(specialButton)

    document.body.replaceChildren(div)
    drawDaily(true)
    drawSpecial(true)

}

window.onload = () => {
    questsLoad()
    pageMain()
}

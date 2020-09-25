//обєкт для перетворення статусу з інгл на укр
const statusUKR = {done: 'завершено', ongoing: 'триває', failed: 'провалено'}

showActivities()
showQuests()
showConfidence()
// показ дати і часу через кожну секунду
setInterval(showDateTime, 1000)
// виконуємо функції щоразу коли додається нова діяльність(activity)
saveNewActivityBtn.onclick = () => {
    saveNewActivity()
    showActivities()
}
// робимо функції для закриття модальних вікон
alertGlass.onclick = event => { 
    if (event.target == alertGlass || event.target.innerText == 'ok') {
        alertGlass.hidden = true
    }
}

takeQuestBtn.onclick = () => {
    takeNewQuest()
    showQuests()
    showConfidence()
    showActivities()
}

//////////////////////////////////////////////////////////////////////////////
// побудова елементу списку діяльностей
function buildActivityItem(activity) {
    const ongoing = quests.find(quest => quest.activityID == activity.id && quest.status == 'ongoing')
    return `
        <li>
            <details>
                <summary>
                    <span title="Діяльність">${activity.name}</span>
                    <span title="міра виконання">${activity.size}</span>
                    <span title="суб'єктивна складність">${activity.diff}</span>
                </summary>
                <div>
                ${ongoing ? '' :`
                    <button data-id="${activity.id}" data-diff="${activity.diff}">
                        Взяти квест
                    </button>`}

                    <button>Деталі</button>
                    <button>В архів</button>
                </div>
            </details>            
        </li>
    `
}
//побудова елементу списку квестів
function buildQuestItem(quest) {
    const activity = activities.find(activity => activity.id == quest.activityID)    

    return `
        <li>
            <details>
                <summary>
                    <span title="квест на діяльність">${activity.name}</span>
                    <span title="міра кожного виконання">${activity.size}</span>
                    <span title="суб'єктивна складність">${activity.diff}</span>
                    <span title="дата початку">з ${isoToGOST(quest.from)}</span>
                    <span title="можлива дата завершення">по ${isoToGOST(quest.to)}</span>
                    <span><span title="кількість днів виконання позаду">${quest.done}/</span><span title="передбачена тривалість квесту">${quest.total} днів</span></span>
                    <span title="завдаток/винагорода по завершенню">${quest.confidence}</span>
                    <span title="статус квесту">${statusUKR[quest.status]}</span>
                </summary>
                <div>
                    <button>Провалити</button>
                    <button>Деталі</button>
                    <button>В архів</button>
                </div>
            </details>            
        </li>
    `
}

// вивід списку діяльностей
function showActivities() {
    activityList.innerHTML = activities.map(buildActivityItem).join('')
    activityList.querySelectorAll('details').forEach(element => {
        element.ontoggle = closeOtherDetails
    });
    activityList.querySelectorAll('button').forEach(btn => {
        if (btn.innerText.trim() == 'Взяти квест') {
            btn.onclick = () => {
                if (confidence() >= +btn.dataset.diff) showGetQuestModal(btn.dataset.id)
                else showAlert('Недостатньо віри в себе на цей квест')
            }
        }
    })
}
// вивід списку квестів
function showQuests() {
    questList.innerHTML = quests.map(buildQuestItem).join('')
    questList.querySelectorAll('details').forEach(element => {
        element.ontoggle = closeOtherDetails
    });
}
//функція для збереження діяльностей з інпутів
function saveNewActivity() {
    if (nameInput.value && sizeInput.value && diffInput.value) {
        const newActivity = {
            id: newID(),
            name: nameInput.value, 
            size: sizeInput.value, 
            diff: diffInput.value
        }
        activities.push(newActivity)
        // записую масив діяльностей в localStorage
        localStorage.activities = JSON.stringify(activities) 
        nameInput.value = ''
        sizeInput.value = ''
        diffInput.value = ''
    } else {
        alert ('Не всі поля заповнені')
    }
}

// додається новий квест, новий план і закриваємо модальне вікно
function takeNewQuest() {
    const newQuest = {
        id: newID(), 
        activityID: takeQuestBtn.dataset.id, 
        from: questFromInput.value, 
        to: questToInput.value,
        done: 0, 
        total: +questDurationInput.value, 
        confidence: +questPledgeInput.value, 
        status: 'ongoing'
    }
    confidence(-newQuest.confidence)
    quests.push(newQuest)
    // записую масив квестів в localStorage
    localStorage.quests = JSON.stringify(quests)

    for (let i = 0; i < newQuest.total; i++) {
        const date = new Date(newQuest.from)
        date.setDate(date.getDate() + i)
        const newTodo = {
            id: newID(),
            questID: newQuest.id,
            date: dateToISO(date),
            confidence: Math.floor((i+1)**0.5),
            status: 'planned',
        }
        todos.push(newTodo)
    }
    // записую масив планів в localStorage
    localStorage.todos = JSON.stringify(todos)

    getQuestGlass.hidden = true //закримаэмо модалку  
}

//функція для згортання зайвих datails
//функція для закривання лишніх спойлерів, коли натискаєм на один із них
function closeOtherDetails(event) {
    if (closeOtherDetails.active) return 
    closeOtherDetails.active = true //флаг для функції

    this.closest('.brick-list').querySelectorAll('[open]').forEach(details => {
        if (details != event.target) details.open = false 
    }) 
    setTimeout(() => closeOtherDetails.active = false, 0)
}

// вивід показника віри в себе на екрані 
function showConfidence() {
    confidenceView.innerText = confidence()
}

// функція для запису дати у стандартному форматі ISO
function dateToISO(dateObject) {
    const year = dateObject.getFullYear()
    let month = dateObject.getMonth()+1
    if (month < 10) month = '0' + month
    let date = dateObject.getDate()
    if (date < 10) date = '0' + date
    return `${year}-${month}-${date}`
}
// функція для запису дати iso у форматі ГОСТ
function isoToGOST(isoDate) {
    const [year, month, date] = isoDate.split('-')
    return `${date}.${month}.${year}`
}
// функція для інформування про щось
function showAlert(msg) {
    alertMsg.innerText = msg
    alertGlass.hidden = false
}
// функція для показу актуальної дати та часу
function showDateTime() {
    dateTimeView.innerHTML = `<div>${getCurrentDate()}</div><h3>${getCurrentTime()}</h3>`
}
// функція для визначення поточної дати
function getCurrentDate() {
    return isoToGOST(dateToISO(new Date))
}
// функція для визначення поточного часу
function getCurrentTime() {
    const date = new Date
    let hour = date.getHours()
    let minute = date.getMinutes()
    if (hour < 10) hour = '0' + hour
    if (minute < 10) minute = '0' + minute
    return `${hour}:${minute}`
}
//функція для створення id з локалстореджа
function newID() {
    const nextID = +localStorage.nextID
    localStorage.nextID = nextID + 1
    return nextID
}
//функція для читання, редагування показника віри в себе у локалсторедж
function confidence(value) {
    let confidence = +localStorage.confidence
    if (value === undefined) return confidence
    confidence += value
    localStorage.confidence = confidence
}

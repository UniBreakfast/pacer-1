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
promptGlass.onclick = event => {
    if (event.target == promptGlass) {
        promptGlass.hidden = true
    }
}

questInfoGlass.onclick = event => {
    if (event.target == questInfoGlass || event.target.innerText == 'ok')
        questInfoGlass.hidden = true
}
//клік на кнопці взяти квест
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
                <div data-id="${activity.id}">
                ${ongoing ? '' :`
                    <button data-diff="${activity.diff}">
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
                    <span title="суб'єктивна складність">${quest.confidence/quest.total}</span>
                    <span title="дата початку">з ${isoToGOST(quest.from)}</span>
                    <span title="можлива дата завершення">по ${isoToGOST(quest.to)}</span>
                    <span><span title="кількість днів виконання позаду">${quest.progress}/</span><span title="передбачена тривалість квесту">${quest.total} днів</span></span>
                    <span title="завдаток/винагорода по завершенню">${quest.confidence}</span>
                    <span title="статус квесту">${statusUKR[quest.status]}</span>
                </summary>
                <div>
                    <button>Провалити</button>
                    <button data-id="${quest.id}">Деталі</button>
                    ${quest.status == 'ongoing'? '':
                        `<button data-id="${quest.id}">В архів</button>`}
                </div>
            </details>            
        </li>
    `
}

//функція для збереження діяльностей з інпутів
function saveNewActivity() {
    const diff = Math.min(Math.max(1, +diffInput.value), 10)
    if (nameInput.value && sizeInput.value && diffInput.value) {
        const newActivity = {
            id: newID(),
            name: nameInput.value, 
            size: sizeInput.value, 
            diff,
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
        progress: 0, 
        total: +questDurationInput.value, 
        confidence: +questPledgeInput.value, 
        status: 'ongoing'
    }
    confidence(-newQuest.confidence)
    quests.push(newQuest)
    // записую масив квестів в localStorage
    localStorage.quests = JSON.stringify(quests)

    populateQuestTodos(newQuest)

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

// функція для переміщення квестів та діяльностей в архів
function moveToArchive(id) {
    const activity = activities.find(activity => id == activity.id)
    if (activity) {
        activity.archived = true
        localStorage.activities = JSON.stringify(activities)
    } else {
        const quest = quests.find(quest => id == quest.id)
        if (quest) {
            quest.archived = true
            localStorage.quests = JSON.stringify(quests)
        }
    }
}

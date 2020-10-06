// вивід списку діяльностей
function showActivities() {
    activityList.innerHTML = activities.filter(activity => !activity.archived)
        .map(buildActivityItem).join('')
    activityList.querySelectorAll('details').forEach(element => {
        element.ontoggle = closeOtherDetails
    });
    activityList.querySelectorAll('button').forEach(btn => {
        const label = btn.innerText.trim()
        if (label == 'Взяти квест') {
            btn.onclick = () => {
                if (confidence() >= +btn.dataset.diff) showGetQuestModal(btn.parentElement.dataset.id)
                else showAlert('Недостатньо віри в себе на цей квест')
            }
        } else if (label == 'Деталі') {
            btn.onclick = () => {
                showActivityInfoModal(btn.parentElement.dataset.id)
            }
        } else if (label == 'В архів') {
            btn.onclick = () => {
                moveToArchive(btn.parentElement.dataset.id)
                showActivities()
            }
        }
        
    })
}
// вивід списку квестів
function showQuests() {
    questList.innerHTML = quests.filter(quest => !quest.archived)
        .map(buildQuestItem).join('')
    questList.querySelectorAll('details').forEach(element => {
        element.ontoggle = closeOtherDetails
    });
    questList.querySelectorAll('button').forEach(btn => {
        const label = btn.innerText.trim()
        if (label == 'В архів') {
            btn.onclick = () => {
                moveToArchive(btn.dataset.id)
                showQuests()
            }
        }
    })
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
//функція для запису віри в себе
function showPrompt(msg, type, handler) {
    promptMsg.innerText = msg
    promptInp.type = type
    promptGlass.hidden = false
    promptModal.querySelector('button').onclick = () => {
        if (handler(promptInp.value)) promptGlass.hidden = true
    }
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

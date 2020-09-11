// функція для взяття квесту у модальному вікні
getQuestGlass.onclick = event => { 
    if (event.target == getQuestGlass || event.target.innerText == 'Відмінити') {
        getQuestGlass.hidden = true
    }
}
// змінні для функцій з відкладеним запуском і ідентифікатора таймера
let nextHandleDateChange, nextHandleTimer

questFromInput.onchange = () => {
    if (nextHandleDateChange && nextHandleDateChange != handleChangeFrom) {
        nextHandleDateChange()
    }
    nextHandleDateChange = handleChangeFrom
    clearTimeout(nextHandleTimer)
    nextHandleTimer = setTimeout(() => {
        nextHandleDateChange()
        nextHandleDateChange = null
    }, 1000)
}
questToInput.onchange = handleChangeTo
questDurationInput.onchange = handleChangeDuration
questPledgeInput.onchange = handleChangePledge

// показ модального вікна з розрахунками параметрів квесту
function showGetQuestModal(activityID) {
    const activity = activities.find(activity => activityID == activity.id)
    
    prepGetQuestModal(activity)

    getQuestGlass.hidden = false
}
// функція для підготовки модального вікна
function prepGetQuestModal(activity) {
    const maxDuration = Math.floor(confidence / activity.diff)
    const duration = Math.floor((maxDuration+1)/2)
    let date = new Date
    const spans = getQuestModal.querySelectorAll('span')
    
    spans[0].innerText = activity.name
    spans[1].innerText = activity.size
    spans[2].innerText = activity.diff

    //мінімальний і максимальний день для вибору квесту
    questFromInput.value = questFromInput.min = dateToISO(date)
    date.setDate(date.getDate() + 2)
    questFromInput.max = dateToISO(date)
    date.setDate(date.getDate() - 1)
    questToInput.min = dateToISO(date)
    date.setDate(date.getDate() + maxDuration)
    questToInput.max = dateToISO(date)

    questDurationInput.max = maxDuration
    questPledgeInput.min = activity.diff
    questPledgeInput.max = activity.diff * maxDuration

    questDurationInput.value = duration
    questPledgeInput.value = duration * activity.diff

    date = new Date
    if (duration == 1) {
        date.setDate(date.getDate() + 1)
        questFromInput.value = dateToISO(date)
        if (maxDuration == 1) questFromInput.min = dateToISO(date)
    }

    date.setDate(date.getDate() + duration - 1)
    questToInput.value = dateToISO(date)

}

function handleChangeFrom() {
    if (questFromInput.value < questFromInput.min) {
        questFromInput.value = questFromInput.min
    } else if (questFromInput.value > questFromInput.max) {
        questFromInput.value = questFromInput.max
    }
}
function handleChangeTo() {}
function handleChangeDuration() {}
function handleChangePledge() {}

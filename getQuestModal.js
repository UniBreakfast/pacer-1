const MS_IN_DAY = 24*60*60*1000 // кількість мілісекунд у добі
// функція для взяття квесту у модальному вікні
getQuestGlass.onclick = event => { 
    if (event.target == getQuestGlass || event.target.innerText == 'Відмінити') {
        getQuestGlass.hidden = true
    }
}
// змінні для функцій з відкладеним запуском і ідентифікатора таймера
let nextHandleChange, nextHandleTimer
// відкладений виклик на зміну першого інпута
questFromInput.onchange = throttle(handleChangeFrom)
// відкладений виклик на зміну другого інпута
questToInput.onchange = throttle(handleChangeTo)
// відкладений виклик на зміну 3-ого інпута
questDurationInput.oninput = throttle(handleChangeDuration)

questPledgeInput.oninput = throttle(handleChangePledge)
// функція для відкладеного запуску оброблених інпутів
function throttle(handler) {
    return () => {
        if (nextHandleChange && nextHandleChange != handler) {
            nextHandleChange()
        }
        nextHandleChange = handler
        clearTimeout(nextHandleTimer)
        nextHandleTimer = setTimeout(() => {
            nextHandleChange()
            nextHandleChange = null
        }, 1000)
    }
}

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

    // збереження ID при натисканні кнопки взяти квест
    takeQuestBtn.dataset.id = activity.id

}
// функція для зміни інпутів відповідно до зміни першого інпута з початковою датою
function handleChangeFrom() {
    let date = new Date
    if (questFromInput.value < questFromInput.min) {
        questFromInput.value = questFromInput.min
    } else if (questFromInput.value > questFromInput.max) {
        questFromInput.value = questFromInput.max
    }
    if (questDurationInput.value == 1 && questFromInput.value == dateToISO(date)) {
        date.setDate(date.getDate() + 1)
        questFromInput.value = dateToISO(date)
    }
    date = new Date(questFromInput.value)
    date.setDate(date.getDate() + (questDurationInput.value - 1))
    questToInput.value = dateToISO(date)
}
// функція для зміни інпутів відповідно до зміни другого інпута з кінцевою датою
function handleChangeTo() {
    const date = new Date(questFromInput.value)
    date.setDate(date.getDate() + (questDurationInput.max - 1))
    if (questToInput.value < questFromInput.value) {
        questToInput.value = questFromInput.value
    } else if (questToInput.value > dateToISO(date)) {
        questToInput.value = dateToISO(date)
    }
    questDurationInput.value = (new Date(questToInput.value) - new Date(questFromInput.value))/MS_IN_DAY+1
    questPledgeInput.value = questDurationInput.value * questPledgeInput.min
}
// функція для зміни інпутів відповідно до зміни тривалості квесту (всього днів)
function handleChangeDuration() {
    if (+questDurationInput.value < +questDurationInput.min) {
        questDurationInput.value = questDurationInput.min
    } else if (+questDurationInput.value > +questDurationInput.max) {
        questDurationInput.value = questDurationInput.max
    }
    const date = new Date(questFromInput.value)
    date.setDate(date.getDate() + (questDurationInput.value - 1))
    questToInput.value = dateToISO(date)
    questPledgeInput.value = questDurationInput.value * questPledgeInput.min 

}
//функція для зміни інпутів відповідно до кількості очок
function handleChangePledge() {
    if (+questPledgeInput.value < +questPledgeInput.min) {
        questPledgeInput.value = questPledgeInput.min
    } else if (+questPledgeInput.value > +questPledgeInput.max) {
        questPledgeInput.value = questPledgeInput.max
    }
    questDurationInput.value = Math.floor(questPledgeInput.value / questPledgeInput.min)
    questPledgeInput.value = questDurationInput.value * questPledgeInput.min 
    const date = new Date(questFromInput.value)
    date.setDate(date.getDate() + (questDurationInput.value - 1))
    questToInput.value = dateToISO(date)

}

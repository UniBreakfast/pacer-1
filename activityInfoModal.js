activityInfoGlass.onclick = event => {
    if (event.target == activityInfoGlass || event.target.classList.contains('close'))
        activityInfoGlass.hidden = true
    else if (event.target.classList.contains('save')) {
        if (updateActivity(activityInfoModal.querySelector('.save').dataset.id)) {
            showActivities()
            showQuests()
            activityInfoGlass.hidden = true
        }
    }
}
activityInfoModal.querySelector('ul').onclick = event => {
    const questItem = event.target.closest('li')
    if (questItem) showQuestInfoModal(questItem.dataset.id)
}
// функція для підготовки модального вікна при натисканні кнопки Деталі 
function prepActivityInfoModal(activity) {
    const inputs = activityInfoModal.querySelectorAll('input')
    inputs[0].value = activity.name
    inputs[1].value = activity.size
    inputs[2].value = activity.diff

    const activityQuests = quests.filter(quest => quest.activityID == activity.id)
    activityInfoModal.querySelector('ul').innerHTML = 
        activityQuests.map(buildActivityQuest).join('')
    
    activityInfoModal.querySelector('.save').dataset.id = activity.id
}
// функція для показу модального вікна  при натисканні Деталі
function showActivityInfoModal(activityID) {
    const activity = activities.find(activity => activity.id == activityID)
    prepActivityInfoModal(activity)
    activityInfoGlass.hidden = false
}
//функція для побудови розмітки деталей квесту
function buildActivityQuest(quest) {
    return `
        <li data-id="${quest.id}">
            <details>
                <summary>
                    <span title="дата початку">з ${isoToGOST(quest.from)}</span>
                    <span title="можлива дата завершення">по ${isoToGOST(quest.to)}</span>
                    <span><span title="кількість днів виконання позаду">${quest.progress}/</span>
                    <span title="передбачена тривалість квесту">${quest.total} днів</span></span>
                    <span title="завдаток/винагорода по завершенню">${quest.confidence}</span>
                    <span title="статус квесту">${statusUKR[quest.status]}</span>
                </summary>
            </details>
        </li>
    `
}
//функція для перевірки інпутів та оновлення значень дыяльності
function updateActivity(activityID) {
    //const inputs = [...activityInfoModal.querySelectorAll('input')]
    const inputs = activityInfoModal.querySelectorAll('input')
    const activity = activities.find(activity => activity.id == activityID)
    if (inputs[0].value == activity.name &&
        inputs[1].value == activity.size &&
        inputs[2].value == activity.diff) return true
        
    //if (inputs.some(input => input.value == '')) alert('Заповніть пусті поля')
    if ([inputs[0].value, inputs[1].value, inputs[2].value].includes('')) {
        showAlert('Заповніть пусті поля')
        return false
    }

    activity.name = inputs[0].value
    activity.size = inputs[1].value
    const diff = Math.min(Math.max(1, +inputs[2].value), 10)
    activity.diff = diff
    localStorage.activities = JSON.stringify(activities)
    return true
}

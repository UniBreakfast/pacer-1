activityInfoGlass.onclick = event => {
    if (event.target == activityInfoGlass || event.target.classList.contains('close'))
    activityInfoGlass.hidden = true
}

// функція для підготовки модального вікна при натисканні кнопки Деталі 
function prepActivityInfoModal(activity) {
    const inputs = activityInfoModal.querySelectorAll('input')
    inputs[0].value = activity.name
    inputs[1].value = activity.size
    inputs[2].value = activity.diff

}
// функція для показу модального вікна  при натисканні Деталі
function showActivityInfoModal(activityID) {
    const activity = activities.find(activity => activity.id == activityID)
    prepActivityInfoModal(activity)
    const activityQuests = quests.filter(quest => quest.activityID == activity.id)
    activityInfoModal.querySelector('ul').innerHTML = activityQuests.map(buildActivityQuest).join('')
    activityInfoGlass.hidden = false
}
//функція для побудови розмітки деталей квесту
function buildActivityQuest(quest) {
    return `
        <li>
            <details>
                <summary>
                    <span title="дата початку">з ${isoToGOST(quest.from)}</span>
                    <span title="можлива дата завершення">по ${isoToGOST(quest.to)}</span>
                    <span><span title="кількість днів виконання позаду">${quest.progress}/</span><span title="передбачена тривалість квесту">${quest.total} днів</span></span>
                    <span title="завдаток/винагорода по завершенню">${quest.confidence}</span>
                    <span title="статус квесту">${statusUKR[quest.status]}</span>
                </summary>
            </details>
        </li>
    `
}

    

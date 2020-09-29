// закриття модального вікна архіва
archiveGlass.onclick = (event) => {
    if(event.target == archiveGlass || event.target.innerText == 'Ok') archiveGlass.hidden = true
} 
archiveBtn.onclick = () => {
    showArchiveModal()
}
archiveModal.getElementsByClassName('tabs')[0].onclick = (event) => {
    const label = event.target.innerText.trim()
    if (label === 'Квести') {
        showArchivedQuests()
    } else if (label === 'Діяльності') {
        showArchivedActivities()
    }
}

// функція для показу модального вікна зі списком архівних квестів та діяльностей
function showArchiveModal() {
    archiveGlass.hidden = false
}

function buildArchivedActivityItem(activity) {
    return `
        <li>
            <details>
                <summary>
                    <span title="Діяльність">${activity.name}</span>
                    <span title="міра виконання">${activity.size}</span>
                    <span title="суб'єктивна складність">${activity.diff}</span>
                </summary>
            </details>            
        </li>
    `
}    

function showArchivedActivities() {
    archiveList.innerHTML = activities.filter(activity => activity.archived)
        .map(buildArchivedActivityItem).join('')
}

function buildArchivedQuestItem(quest) {
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
            </details>            
        </li>
    `
}

function showArchivedQuests() {
    archiveList.innerHTML = quests.filter(quest => quest.archived)
        .map(buildArchivedQuestItem).join('')
}
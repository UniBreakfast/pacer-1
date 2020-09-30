// закриття модального вікна архіва
archiveGlass.onclick = (event) => {
    if(event.target == archiveGlass || event.target.innerText == 'Ok') archiveGlass.hidden = true
} 
archiveBtn.onclick = () => {
    showArchiveModal()
}
archiveModal.getElementsByClassName('tabs')[0].onclick = (event) => {
    const label = event.target.innerText.trim()
    if (label === 'Діяльності') {
        archiveModal.classList.add('activities')
        archiveModal.classList.remove('quests')
        showArchivedActivities()
    } else if (label === 'Квести') {
        archiveModal.classList.add('quests')
        archiveModal.classList.remove('activities')
        showArchivedQuests()
    }

}
// клік кнопку відновити
archiveList.onclick = (event) => {
    if (event.target.innerText == 'Відновити' && event.target.tagName == 'BUTTON') {
        restoreFromArchive(event.target.dataset.id)
        if (archiveModal.classList.contains('activities')) {
            showArchivedActivities()
            showActivities()
        } else {
            showArchivedQuests()    
            showQuests()
        }
    }
}

// функція для показу модального вікна зі списком архівних квестів та діяльностей
function showArchiveModal() {
    archiveGlass.hidden = false
}
// побудова розмітки архівних діяльностей
function buildArchivedActivityItem(activity) {
    return `
        <li>
            <details>
                <summary>
                    <span title="Діяльність">${activity.name}</span>
                    <span title="міра виконання">${activity.size}</span>
                    <span title="суб'єктивна складність">${activity.diff}</span>
                </summary>
                <div>
                    <button data-id="${activity.id}">Відновити</button>
                </div>
            </details>
        </li>
    `
}    
// показ архівних діяльностей
function showArchivedActivities() {
    archiveList.innerHTML = activities.filter(activity => activity.archived)
        .map(buildArchivedActivityItem).join('')
}
// побудова розмітки архівних квестів
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
                <div>
                    <button data-id="${quest.id}">Відновити</button>
                </div>
            </details>            
        </li>
    `
}
// показ архівних квестів
function showArchivedQuests() {
    archiveList.innerHTML = quests.filter(quest => quest.archived)
        .map(buildArchivedQuestItem).join('')
}
//відновлення квестів та діяльностей з архіву
function restoreFromArchive(id) {
    const activity = activities.find(activity => activity.id == id)
    if (activity) {
        delete activity.archived
        localStorage.activities = JSON.stringify(activities)
    } else {
        const quest = quests.find(quest => quest.id == id)
        if (quest) {
            delete quest.archived
            localStorage.quests = JSON.stringify(quests)
        }
    }
}
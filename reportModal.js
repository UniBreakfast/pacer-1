// закриваємо модальне вікно звітів
reportGlass.onclick = event => {
    if (event.target == reportGlass || event.target.classList.contains('close')) 
        reportGlass.hidden = true
}
// клік на кнопку Звіти
reportBtn.onclick = () => {
    const [groupedOverdueTodos, overdueTodos] = selectOverdueTodos()
    showOverdueTodos(groupedOverdueTodos, overdueTodos)
    if (!overdueTodos.length) {
        overdueTodoList.innerHTML = '<center>Відмінно! Прострочених звітів немає</center>'
    }
    showReportModal()

    overdueTodoList.onclick = event => {
        if (event.target.tagName == 'BUTTON') {
            const status = event.target.innerText == '✔️'? 'done' : 'failed'
            setTodoStatus(event.target.parentElement.dataset.id, status)
            showConfidence()
            showTodoToday()
            showOverdueTodos(groupedOverdueTodos, overdueTodos)
            showQuests()
            showActivities()
        }
    }
}

//функція для показу модального вікна зі списком прострочених завдань
function showReportModal() {
    reportGlass.hidden = false
}
// функція для вибірки планів, у яких статус за попередні дні залишився 'planned'
function selectOverdueTodos() {
    const today = dateToISO(new Date)
    const overdueTodos = todos.filter(todo => todo.status == 'planned' && todo.date < today)
    overdueTodos.sort((a, b) => {
        if (a.date < b.date) return -1
        //if (a.date > b.date) return 1 для експерименту!!!
    })
    const grouped = {}
    const dates = [...new Set(overdueTodos.map(todo => todo.date))]
    for (const date of dates) {
        grouped[date] = overdueTodos.filter(todo => todo.date == date)
    }
    return [grouped, overdueTodos]
}
// функція для побудови розмітки хтмл зі списком прострочених планів
function buildOverdueTodoItem(todo, overdueTodos) {
    const quest = quests.find(quest => quest.id == todo.questID)    
    const activity = activities.find(activity => activity.id == quest.activityID)
    const first = overdueTodos.find(otherTodo => otherTodo.questID == todo.questID &&
                                    otherTodo.status == 'planned') == todo
    return `
        <li class="${todo.status}" data-id="${todo.id}">
            ${todo.status == 'done' ? '<span>✔️</span>' 
            : todo.status == 'failed' ? '<span>❌</span>' 
            : first ? '<button>✔️</button><button>❌</button>' : ''}
            ${todo.status == 'planned' ? '' : '<div></div>'}
            <span>${activity.name}</span>
            <span>${activity.size}</span>
            <span>+${todo.confidence}</span>
        </li>
    `
}
// функція для виводу прострочених планів 
function showOverdueTodos(groupedOverdueTodos, overdueTodos) {
    const overdueTodoList = document.getElementById('overdueTodoList')
    let html = ''
    for (const date in groupedOverdueTodos) {
        if (!groupedOverdueTodos.hasOwnProperty(date)) continue
 
        const todos = groupedOverdueTodos[date]
        
        html += `
            <li>
                <h3>${isoToGOST(date)}</h3>
                <ul class="todos">
                    ${todos.map(todo => buildOverdueTodoItem(todo, overdueTodos)).join('')}
                </ul>
            </li>
        `    
    }
    overdueTodoList.innerHTML = html
}
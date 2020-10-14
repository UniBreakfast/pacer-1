let overdueTodos = []
let groupedOverdueTodos = {}
// закриваємо модальне вікно звітів
reportGlass.onclick = event => {
    if (event.target == reportGlass || event.target.classList.contains('close')) 
        reportGlass.hidden = true
}
// клік на кнопку Звіти
reportBtn.onclick = () => {
    selectOverdueTodos()
    showOverdueTodos()
    if (!overdueTodos.length) {
        overdueTodoList.innerHTML = '<center>Відмінно! Прострочених звітів немає</center>'
    }
    showReportModal()
    // клік по елементах списку прострочених планів
    overdueTodoList.onclick = event => {
        if (event.target.tagName == 'BUTTON') {
            const status = event.target.innerText == '✔️'? 'done' : 'failed'
            setTodoStatus(event.target.closest('li').dataset.id, status)
            showConfidence()
            showOverdueTodos()
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
    overdueTodos = todos.filter(todo => todo.status == 'planned' && todo.date < today)
    overdueTodos.sort((a, b) => {
        if (a.date < b.date) return -1
        //if (a.date > b.date) return 1 для експерименту!!!
    })
    groupedOverdueTodos = {}
    const dates = [...new Set(overdueTodos.map(todo => todo.date))]
    for (const date of dates) {
        groupedOverdueTodos[date] = overdueTodos.filter(todo => todo.date == date)
    }
}
// функція для побудови розмітки хтмл зі списком прострочених планів
function buildOverdueTodoItem(todo) {
    const quest = quests.find(quest => quest.id == todo.questID)    
    const activity = activities.find(activity => activity.id == quest.activityID)
    const first = overdueTodos.find(otherTodo => otherTodo.questID == todo.questID &&
                                    otherTodo.status == 'planned') == todo
    return `
        <li class="${todo.status}" data-id="${todo.id}">
            ${todo.status == 'done' ? '<span>✔️</span>' 
            : todo.status == 'failed' ? '<span>❌</span>' 
            : first ? '<span><button>✔️</button><button>❌</button></span>' : ''}
            ${todo.status == 'planned' ? '' : '<div></div>'}
            <span>${activity.name}</span>
            <span>${activity.size}</span>
            <span>+${todo.confidence}</span>
        </li>
    `
}
// функція для виводу прострочених планів 
function showOverdueTodos() {
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
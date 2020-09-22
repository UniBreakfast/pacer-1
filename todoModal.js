
// закриваэмо модальне вікно для планів квесту
todoGlass.onclick = event => { 
    if (event.target == todoGlass || event.target.innerText == 'Ok') {
        todoGlass.hidden = true
    }
}
// клік
showTodoBtn.onclick = () => {
    showTodoToday()
    showTodoModal()
}
//клік на кнопку ок чи фолс
todoList.onclick = event => {
    if (event.target.tagName == 'BUTTON') {
        const status = event.target.innerText == '✔️'? 'done' : 'failed'
        setTodoStatus(event.target.parentElement.dataset.id, status)
        showConfidence()
        showTodoToday()
        showQuests()
        showActivities()
    } 
}

// функція для показу модального вікна з планами на сьогодні
function showTodoModal() {
    todoGlass.hidden = false
}
// функція для побудови елементу списку планів
function buildTodoItem(todo) {
    const quest = quests.find(quest => quest.id == todo.questID)    
    const activity = activities.find(activity => activity.id == quest.activityID)    
    return `
        <li class="${todo.status}" data-id="${todo.id}">
            ${todo.status == 'done' ? '<span>✔️</span>' 
            : (todo.status == 'failed' ? '<span>❌</span>' 
            : '<button>✔️</button><button>❌</button>')}
            ${todo.status == 'planned' ? '' : '<div></div>'}
            <span>${activity.name}</span>
            <span>${activity.size}</span>
            <span>+${todo.confidence}</span>
        </li>
    `
}
// функція для виводу планів на сьогодні
function showTodoToday() {
    todoList.innerHTML = todos.filter(todo => todo.date == dateToISO(new Date))
        .map(buildTodoItem).join('')
} 
// функція для зміни статусу плану і кількості очок
function setTodoStatus(todoID, status) {
    const todo = todos.find(todo => todo.id == todoID)
    todo.status = status
    const quest = quests.find(quest => quest.id == todo.questID)
    if (status == 'done') {
        quest.done++
        confidence(todo.confidence)
        if (quest.done == quest.total) {
            quest.status = 'done'
            confidence(quest.confidence)
        }
    } else {
        quest.status = 'failed'
        const canceledTodos = todos.filter(todo => todo.questID == quest.id && todo.status == 'planned')
        canceledTodos.forEach(todo => todo.status = 'failed')
        todos = todos.filter(todo => !canceledTodos.includes(todo))
    }
    // зберігаю зміни в планах та квестах заново в localStorage
    localStorage.todos = JSON.stringify(todos)
    localStorage.quests = JSON.stringify(quests)
}
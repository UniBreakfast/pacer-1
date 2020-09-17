
// закриваэмо модальне вікно для планів квесту
todoGlass.onclick = event => { 
    if (event.target == todoGlass || event.target.innerText == 'Ok') {
        todoGlass.hidden = true
    }
}
showTodoBtn.onclick = () => {
    showTodoToday()
    showTodoModal()
}

// функція для показу модального вікна з планами на сьогодні
function showTodoModal() {
    todoGlass.hidden = false
}
// функція для побудови елемнту списку планів
function buildTodoItem(todo) {
    const quest = quests.find(quest => quest.id == todo.questID)    
    const activity = activities.find(activity => activity.id == quest.activityID)    
    return `
        <li>
            <input type="checkbox" ${todo.status == 'done' ? 'checked' : ''}>
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
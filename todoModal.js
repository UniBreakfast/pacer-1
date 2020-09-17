
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
// функція для побудови елементу списку планів
function buildTodoItem(todo) {
    const quest = quests.find(quest => quest.id == todo.questID)    
    const activity = activities.find(activity => activity.id == quest.activityID)    
    return `
        <li class="${todo.status}">
            ${todo.status == 'done' ? '<span>✔️</span>' 
            : (todo.status == 'failed' ? '<span>❌</span>' 
            : '<button>✔️</button><button>❌</button>')}
            ${todo.status == 'planed' ? '' : '<div></div>'}
            <span>${activity.name}</span>
            <span>${activity.size}</span>
            <span>+${todo.confidence}</span>
        </li>
    `
}
// function buildTodoItem(todo) {
//     const quest = quests.find(quest => quest.id == todo.questID)    
//     const activity = activities.find(activity => activity.id == quest.activityID)    
//     if (todo.status == 'planed') return `
//         <li>
//             <button>✔️</button>
//             <button>❌</button>
//             <span>${activity.name}</span>
//             <span>${activity.size}</span>
//             <span>+${todo.confidence}</span>
//         </li>
//     `
//     if (todo.status == 'done') return `
//         <li class="done">
//             <span>✔️</span>
//             <div></div>
//             <span>${activity.name}</span>
//             <span>${activity.size}</span>
//             <span>+${todo.confidence}</span>
//         </li>
//     `
//     if (todo.status == 'failed') return `
//         <li class="failed">
//             <span>❌</span>
//             <div></div>
//             <span>${activity.name}</span>
//             <span>${activity.size}</span>
//             <span>+${todo.confidence}</span>
//         </li>
//     `
// }
// функція для виводу планів на сьогодні
function showTodoToday() {
    todoList.innerHTML = todos.filter(todo => todo.date == dateToISO(new Date))
        .map(buildTodoItem).join('')
} 
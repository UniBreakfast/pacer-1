// масив обєктів для зберігання видів діяльності
const activities = [
    {id: 1, name: 'Програмування', size: '2 години', diff: 2},
    {id: 2, name: 'Англійська', size: '2 години', diff: 5},
    {id: 3, name: 'Фізкультура', size: '1 година', diff: 9},
]
// для збільшення значень ID
let nextID = 4
// показник віри в себе (кількість очок)
let confidence = 50 

showActivities()
showConfidence()

saveNewActivityBtn.onclick = () => {
    saveNewActivity()
    showActivities()
}
// робимо функції для закриття модальних вікон
alertGlass.onclick = event => { 
    if (event.target == alertGlass || event.target.innerText == 'ok') {
        alertGlass.hidden = true
    }
}

//////////////////////////////////////////////////////////////////////////////
// побудова діяльності в хтмл
function buildActivityItem(activity) {
    return `
        <li>
            <details>
                <summary>
                    <span>${activity.name}</span>
                    <span>${activity.size}</span>
                    <span>${activity.diff}</span>
                </summary>
                <div>
                    <button data-id="${activity.id}" data-diff="${activity.diff}">
                        Взяти квест
                    </button>
                    <button>Редагувати</button>
                    <button>🗑️</button>
                </div>
            </details>            
        </li>
    `
}
// вивід списку діяльностей
function showActivities() {
    activityList.innerHTML = activities.map(buildActivityItem).join('')
    activityList.querySelectorAll('details').forEach(element => {
        element.ontoggle = closeOtherDetails
    });
    activityList.querySelectorAll('button').forEach(btn => {
        if (btn.innerText.trim() == 'Взяти квест') {
            btn.onclick = () => {
                if (confidence >= +btn.dataset.diff) showGetQuestModal(btn.dataset.id)
                else showAlert('Недостатньо віри в себе на цей квест')
            }
        }
    })
}

//функція для збереження діяльностей з інпутів
function saveNewActivity() {
    if (nameInput.value && sizeInput.value && diffInput.value) {
        const newActivity = {
            id: nextID++,
            name: nameInput.value, 
            size: sizeInput.value, 
            diff: diffInput.value
        }
        activities.push(newActivity)
        nameInput.value = ''
        sizeInput.value = ''
        diffInput.value = ''
    } else {
        alert ('Не всі поля заповнені')
    }
}
//функція для закривання лишніх спойлерів, коли натискаєм на один із них
// metapokalipsis
function closeOtherDetails(event) {
    if (closeOtherDetails.active) return 
    closeOtherDetails.active = true //флаг для функції

    activityList.querySelectorAll('[open]').forEach(details => {
        if (details != event.target) details.open = false 
    })
      
    setTimeout(() => closeOtherDetails.active = false, 0)
}
// вивід показника віри в себе на екрані 
function showConfidence() {
    confidenceView.innerText = confidence
} 

// функція для запису дати у стандартному форматі ISO
function dateToISO(dateObject) {
    const year = dateObject.getFullYear()
    let month = dateObject.getMonth()+1
    if (month < 10) month = '0' + month
    let date = dateObject.getDate()
    if (date < 10) date = '0' + date
    return `${year}-${month}-${date}`
}
// функція для інформування про щось
function showAlert(msg) {
    alertMsg.innerText = msg
    alertGlass.hidden = false
}

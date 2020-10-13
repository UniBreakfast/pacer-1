// вхідні дані, збережені в локалсторедж
// масив обєктів для зберігання видів діяльності
// масив обєктів для зберігання квестів
// плани на виконання квесту
// пов'язуємо всі дані між собою
if (location.hostname !== '127.0.0.1') {
    if (!localStorage.nextID ||
        !localStorage.confidence ||
        !localStorage.activities ||
        !localStorage.quests ||
        !localStorage.todos) {
            localStorage.nextID = '12'
            localStorage.confidence = ''
            localStorage.activities = JSON.stringify([])
            localStorage.quests = JSON.stringify([])
            localStorage.todos = JSON.stringify([])
        }
} else {
    if (!localStorage.nextID ||
        !localStorage.confidence ||
        !localStorage.activities ||
        !localStorage.quests ||
        !localStorage.todos) {
            localStorage.nextID = '12'
            localStorage.confidence = '50'
            localStorage.activities = JSON.stringify([
                {id: 1, name: 'Програмування', size: '2 години', diff: 2},
                {id: 2, name: 'Англійська', size: '2 години', diff: 5},
                {id: 3, name: 'Фізкультура', size: '1 година', diff: 9},
            ])
            localStorage.quests = JSON.stringify([
                {id: 4, activityID: 1, from: '2020-10-04', to: '2020-10-10',
                progress: 4, total: 7, confidence: 14, status: 'ongoing'},
            ])
            localStorage.todos = JSON.stringify([
                {id: 5, questID: 4, date: '2020-10-04', confidence: 1, status: 'done'},
                {id: 6, questID: 4, date: '2020-10-05', confidence: 1, status: 'done'},
                {id: 7, questID: 4, date: '2020-10-06', confidence: 1, status: 'done'},
                {id: 8, questID: 4, date: '2020-10-07', confidence: 2, status: 'done'},
                {id: 9, questID: 4, date: '2020-10-08', confidence: 2, status: 'planned'},
                {id: 10, questID: 4, date: '2020-10-09', confidence: 2, status: 'planned'},
                {id: 11, questID: 4, date: '2020-10-10', confidence: 2, status: 'planned'},
            ])
        }
}
// початкове визначення віри в себе
if (!localStorage.etap) {
    showPrompt('Оцініть віру в себе за десятибальною шкалою: ', 'number', (answer) => {
        if (+answer < 2) {
            showAlert('Вибачте, ми не можемо взяти на себе відповідальність. З такою низькою вірою в себе зверністься до психолога')
            return false
        }
        if (+answer > 10) answer = 10
              
        localStorage.confidence = answer
        localStorage.etap = answer
        showConfidence()
        return true
    })
}
//створюємо змінну в ОЗУ для діяльностей 
let activities = JSON.parse(localStorage.activities)
//створюємо змінну в ОЗУ для квестів
let quests = JSON.parse(localStorage.quests)
//створюємо змінну в ОЗУ для планів
let todos = JSON.parse(localStorage.todos)
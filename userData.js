// вхідні дані, збережені в локалсторедж
// масив обєктів для зберігання видів діяльності
// масив обєктів для зберігання квестів
// плани на виконання квесту
// пов'язуємо всі дані між собою
if (!localStorage.nextID ||
    !localStorage.confidence ||
    !localStorage.activities ||
    !localStorage.quests ||
    !localStorage.todos ||
    !localStorage.archive) {
        localStorage.nextID = '12'
        localStorage.confidence = '50'
        localStorage.activities = JSON.stringify([
            {id: 1, name: 'Програмування', size: '2 години', diff: 2},
            {id: 2, name: 'Англійська', size: '2 години', diff: 5},
            {id: 3, name: 'Фізкультура', size: '1 година', diff: 9},
        ])
        localStorage.quests = JSON.stringify([
            {id: 4, activityID: 1, from: '2020-09-14', to: '2020-09-20',
            done: 4, total: 7, confidence: 14, status: 'ongoing'},
        ])
        localStorage.todos = JSON.stringify([
            {id: 5, questID: 4, date: '2020-09-14', confidence: 1, status: 'done'},
            {id: 6, questID: 4, date: '2020-09-15', confidence: 1, status: 'done'},
            {id: 7, questID: 4, date: '2020-09-16', confidence: 1, status: 'done'},
            {id: 8, questID: 4, date: '2020-09-17', confidence: 2, status: 'done'},
            {id: 9, questID: 4, date: '2020-09-18', confidence: 2, status: 'planned'},
            {id: 10, questID: 4, date: '2020-09-19', confidence: 2, status: 'planned'},
            {id: 11, questID: 4, date: '2020-09-20', confidence: 2, status: 'planned'},
        ])
        localStorage.archive = '[]'
    }

//створюємо змінну в ОЗУ для діяльностей 
const activities = JSON.parse(localStorage.activities)
//створюємо змінну в ОЗУ для квестів
const quests = JSON.parse(localStorage.quests)
//створюємо змінну в ОЗУ для планів
let todos = JSON.parse(localStorage.todos)

let archive = JSON.parse(localStorage.archive)



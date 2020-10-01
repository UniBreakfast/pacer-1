const resetBar = document.createElement('div')
resetBar.innerHTML = `<button id="resetBtn" onclick="resetLS()">Reset LS</button>`
document.body.append(resetBar)

// resetBtn.style.color = '#faf9f9'
// resetBtn.style.margin = '3px'
// resetBtn.style.minWidth = '70px'
// resetBtn.style.position = 'absolute'
// resetBtn.style.bottom = '20px'
// resetBtn.style.right = '20px'

Object.assign(resetBar.style, {
    margin: '3px',
    position: 'absolute',
    bottom: '20px',
    right: '20px',
})

// функція для очистки локал сторедж
function resetLS() {
    delete localStorage.nextID
    delete localStorage.confidence
    delete localStorage.activities
    delete localStorage.quests
    delete localStorage.todos
    location.reload() // F5
    // ['nextID', 'confidence', 'activities', 'quests', 'todos']
    //     .forEach(key => delete localStorage[key])
}

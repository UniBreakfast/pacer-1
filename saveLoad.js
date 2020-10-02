const saveLoadBar = document.createElement('div')
saveLoadBar.innerHTML = `
    <a class="button" href="javascript:saveState()" download="" style="text-decoration:none">Save</a>
    <button onclick="this.nextElementSibling.click()" >Load</button>
    <input type="file" onchange="loadState()" hidden>
`
document.body.append(saveLoadBar)

Object.assign(saveLoadBar.style, {
    position: 'absolute',
    bottom: '20px',
    left: '20px',
})

// функція для самостійного кліка на анкор і зберігання файлу
function saveState() {
    const state = {activities, 
        quests, 
        todos, 
        confidence: localStorage.confidence, 
        nextID: localStorage.nextID,}
    const contentLink = "data:text/plain;charset=utf-8," + encodeURI(JSON.stringify(state,0,2))
    const fileName = String(new Date).match(/ ([A-Z].+:\d\d)/)[1].replace(/:/g,'-')+'.json'
    const a = saveLoadBar.querySelectorAll('a')[0]
    a.href = contentLink
    a.download = fileName
    a.click()
    a.href = "javascript:saveState()"
}
// функція для завантаження прогресу з файлу
function loadState() {
    const fileReader = new FileReader()
    fileReader.onload = () => {
        const loadedState = JSON.parse(fileReader.result)
        activities = loadedState.activities
        localStorage.activities = JSON.stringify(activities)
        quests = loadedState.quests
        localStorage.quests = JSON.stringify(quests)
        todos = loadedState.todos
        localStorage.todos = JSON.stringify(todos)
        localStorage.confidence = loadedState.confidence
        localStorage.nextID = loadedState.nextID
        showActivities()
        showQuests()
        showConfidence()
    }
    fileReader.readAsText(saveLoadBar.querySelector('input').files[0])
}
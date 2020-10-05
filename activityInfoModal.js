activityInfoGlass.onclick = event => {
    if (event.target == activityInfoGlass || event.target.classList.contains('close'))
    activityInfoGlass.hidden = true
}

// функція для підготовки модального вікна при натисканні кнопки Деталі 
function prepActivityInfoModal(activity) {

}
// функція для показу модального вікна  при натисканні Деталі
function showActivityInfoModal(activityID) {
    const activity = activities.find(activity => activity.id == activityID)
    prepActivityInfoModal(activity)
    activityInfoGlass.hidden = false
}
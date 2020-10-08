// функція для підготовки значень діяльності та квесту в розмітку модалки "деталі" 
function prepQuestInfoModal(quest) {
    const activity = activities.find(activity => activity.id == quest.activityID)
    const spans = questInfoModal.querySelectorAll('div>span')
    spans[0].innerText = activity.name
    spans[1].innerText = activity.size
    spans[2].innerText = quest.confidence/quest.total
}
// функція для показу даних квесту та діяльності в модалці деталей
function showQuestInfoModal(questID) {
    const quest = quests.find(quest => quest.id == questID)
    prepQuestInfoModal(quest)
    questInfoGlass.hidden = false
}
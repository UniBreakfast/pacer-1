const saveLoadBar = document.createElement('div')
saveLoadBar.innerHTML = `
    <a class="button">Save</a>
    <a class="button">Load</a>
`
document.body.append(saveLoadBar)

Object.assign(saveLoadBar.style, {
    position: 'absolute',
    bottom: '20px',
    left: '20px',
})
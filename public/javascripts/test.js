window.onload = () => {

    const changeButton = document.getElementById('change');
    console.log(document)
    console.log(changeButton)
    changeButton.style.backgroundColor = 'red'

    changeButton.addEventListener('click', () => {
        console.log("clicked")
        const color = changeButton.style.backgroundColor;
        if (color === 'white') {
            changeButton.style.backgroundColor = 'red';
        } else {
            changeButton.style.backgroundColor = 'white';
        }
    });

}
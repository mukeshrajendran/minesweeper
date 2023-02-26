import { createBoard, revealtile, markTile, checkWin, checkLose } from './minesweeper.js'

window.addEventListener('load', () => {
    const boardElement = document.querySelector('#board');
    const subText = document.querySelector('.subText');
    const diffDropDownEl = document.querySelector('#diff-dropdown');
    const selectOptions = ['Easy', 'Medium', 'Hard'];
    const timer = document.querySelector('#timer-text');
    const resetBtn = document.querySelector('#resetBtn');
    let timeDuration = 60;
    let boardSize;
    let mineCount;
    let board;
    let timerInterval;

    function init() {
        boardSize = 5;
        mineCount = 5;
        resetBtn.addEventListener('click', onReset)
        board = createBoard(boardSize, mineCount);
        subText.textContent = `Mines left: ${mineCount}`;
        boardElement.style.setProperty('--size', boardSize)
        displayBoard();
        setSelectOptions();
        setTimerInterval();
    }

    function displayBoard() {
        boardElement.textContent = '';
        board.forEach((row) => {
            row.forEach(tile => {
                tile.element.addEventListener('click', () => {
                    revealtile(board, tile);
                    checkWinOrLose();
                })
                tile.element.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    markTile(tile);
                    listMinesLeft();
                })
                boardElement.appendChild(tile.element);
            })
        })
    }

    function setSelectOptions() {
        selectOptions.forEach((op) => {
            const option = document.createElement('option');
            const optionText = document.createTextNode(op);
            option.appendChild(optionText);
            option.setAttribute('value', op);
            diffDropDownEl.appendChild(option);
        })
        diffDropDownEl.addEventListener('change', onDiffChange)
    }


    function listMinesLeft() {
        const markedTilesCount = board.reduce((count, row) => {
            return count + row.filter(tile => tile.status === 'marked').length
        }, 0)

        subText.textContent = `Mines left: ${mineCount - markedTilesCount}`;
    }

    function checkWinOrLose() {
        const win = checkWin(board);
        const lose = checkLose(board);
        if (win || lose || timeDuration <= 0) {
            boardElement.addEventListener('click', stopProp, { capture: true });
            boardElement.addEventListener('contextmenu', stopProp, { capture: true });
            diffDropDownEl.disabled = true;
            clearInterval(timerInterval);
        }

        if (win) {
            subText.textContent = 'You Win'
        }

        if (lose || timeDuration <= 0) {
            subText.textContent = 'You Lose'
            board.forEach((row) => {
                row.forEach((tile) => {
                    if(tile.status === 'marked') {
                        markTile(tile)
                    }
                    if (tile.mine) {
                        revealtile(board, tile);
                    }
                })
            })
        }
    }

    function stopProp(e) {
        e.stopImmediatePropagation()
    }

    function onDiffChange(e) {
        setDifficulty(e.target.value)
        board = createBoard(boardSize, mineCount);
        console.log(board)
        subText.textContent = `Mines left: ${mineCount}`;
        boardElement.style.setProperty('--size', boardSize)
        displayBoard();
    }

    function setDifficulty(value) {
        switch (value) {
            case 'Medium':
                boardSize = 10;
                mineCount = 10;
                timeDuration = 120;
                break;
            case 'Hard':
                boardSize = 15;
                mineCount = 15;
                timeDuration = 240;
                break
            default:
                boardSize = 5;
                mineCount = 5;
                timeDuration = 60;
                break;
        }
    }

    function setTimerInterval() {
        timerInterval = setInterval(() => {
            if (timeDuration <= 0) {
                clearInterval(timerInterval);
                checkWinOrLose();
            }
            timer.textContent = timeDuration;
            timeDuration--;
        }, 1000);
    }

    function onReset(event) {
        setDifficulty(diffDropDownEl.value)
        board = createBoard(boardSize, mineCount);
        subText.textContent = `Mines left: ${mineCount}`;
        boardElement.style.setProperty('--size', boardSize)
        displayBoard();
        clearInterval(timerInterval);
        setTimerInterval();
        boardElement.removeEventListener('click', stopProp, { capture: true });
        boardElement.removeEventListener('contextmenu', stopProp, { capture: true });
        diffDropDownEl.disabled = false;
        subText.textContent = `Mines left: ${mineCount}`;
    }


    init();
});





function getAdjecentTiles(board, tile) {
    const tiles = [];
    for (let xAxis = -1; xAxis <= 1; xAxis++) {
        for (let yAxis = -1; yAxis <= 1; yAxis++) {
            console.log(tile.x + xAxis, tile.y + yAxis)
            if (board[tile.x + xAxis] && board[tile.x + xAxis][tile.y + yAxis]) {
                tiles.push(board[tile.x + xAxis][tile.y + yAxis])
            }
        }
    }
    return tiles;
}

export function revealtile(board, tile) {
    if (tile.status !== 'hidden') {
        return;
    }
    if (tile.mine) {
        tile.status = 'mine';
        return;
    }

    const adjacentTile = getAdjecentTiles(board, tile);
    const mines = adjacentTile.filter(tile => tile.mine)
    tile.status = 'number';
    console.log(adjacentTile)
    if (mines.length === 0) {
        adjacentTile.forEach(revealtile.bind(null,board))
    } else {
        tile.element.textContent = mines.length;
    }

}

export function createBoard(size, mines) {
    const board = [];
    const minePositions = generateMinePostions(size, mines);
    for (let x = 0; x < size; x++) {
        const row = [];
        for (let y = 0; y < size; y++) {
            const element = document.createElement('div');
            element.dataset.status = 'hidden';
            row.push({
                x,
                y,
                element,
                status: 'hidden',
                set status(status) {
                    this.element.dataset.status = status;
                },
                get status() {
                    return this.element.dataset.status;
                },
                mine: getMinePositions(minePositions, x, y)
            })
        }
        board.push(row);
    }
    return board
}

function getMinePositions(minePositions, x, y) {
    for (let i = 0; i < minePositions.length; i++) {
        if (minePositions[i].x === x && minePositions[i].y === y) {
            return true;
        }
    }
    return false;
}

function generateMinePostions(size, mineCount) {
    const minePositions = [];
    while (minePositions.length < mineCount) {
        const position = {
            x: Math.floor(Math.random() * size),
            y: Math.floor(Math.random() * size),
        }
        if (!isPositionExists(minePositions, position)) {
            minePositions.push(position)
        }
    }
    return minePositions;
}

function isPositionExists(minePositions, position) {
    for (let i = 0; i < minePositions.length; i++) {
        if (minePositions[i].x === position.x && minePositions[i].y === position.y) {
            return true;
        }
    }
    return false;
}

export function markTile(tile) {
    if(tile.status === 'hidden') {
        tile.status = 'marked';
    } else if (tile.status === 'marked'){
        tile.status = 'hidden';
    }
}

export function checkWin(board) {
    return board.every((row) => {
        return row.every((tile) => {
            return (tile.status === 'number' || (tile.mine && (tile.status === 'hidden' || tile.status ==='marked')))
        })
    })
}

export function checkLose(board) {
    return board.some((row) => {
        return row.some((tile) => {
            return (tile.mine  && (tile.status !== 'hidden' && tile.status !== 'marked' ) )
        })
    })
}
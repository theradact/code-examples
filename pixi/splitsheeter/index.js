const COLUMNS = [
  'moving-0',
  'idle',
  'moving-1',
]

const ROWS = [
  'down',
  'left',
  'right',
  'up',
];

const CHARACTERS_IN_ROW = 4;
const NUMBER_OF_CHARACTER_ROWS = 2;

const TILE_SIZE = 48;

const INPUT_FILENAME = `spritesheet 2.png`;
const SPRITE_NAME = `enemy`;

const sharp = require('sharp');

for (let i = 0; i < CHARACTERS_IN_ROW * NUMBER_OF_CHARACTER_ROWS; i++) {
  const spriteOffset = {
    column: (i % CHARACTERS_IN_ROW) * COLUMNS.length,
    row: Math.floor(i / CHARACTERS_IN_ROW) * ROWS.length
  }

  ROWS.forEach((row, rowIndex) => {
    COLUMNS.forEach((column, columnIndex) => {
      const tileCoordinates = {
        column: spriteOffset.column + columnIndex,
        row: spriteOffset.row + rowIndex
      }

      sharp(`input/${INPUT_FILENAME}`)
        .extract({
          left: tileCoordinates.column * TILE_SIZE,
          top: tileCoordinates.row * TILE_SIZE,
          width: TILE_SIZE,
          height: TILE_SIZE,
        })
        .toFile(`output/${SPRITE_NAME}-${i}-${row}-${column}.png`);
    })
  })
}

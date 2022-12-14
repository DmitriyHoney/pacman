// const tableMap = [];
// function generateTable() {
//   const table = document.getElementById('table');
//   for (let row = 0; row < 28; row++) {
//     const tr = document.createElement('tr');
//     tableMap[row] = [];
//     for (let col = 0; col < 24; col++) {
//       const td = document.createElement('td');
//       td.setAttribute('data-key', `${row}-${col}`);
//       td.addEventListener('click', () => {
//         const [ row, col ] = td.getAttribute('data-key').split('-');
//         if (td.classList.contains('td_act')) {
//           td.classList.remove('td_act');
//           tableMap[row][col] = 0;
//           return;
//         }
//         td.classList.add('td_act');
//         tableMap[row][col] = 1;
//       });
//       tr.append(td);
//       tableMap[row][col] = 0;
//     }
//     table.append(tr);
//   }
// }
// function fillTable(template) {
//   template.forEach((row, rowIdx) => {
//     row.forEach((col, colIdx) => {
//       if (!tableMap[rowIdx]) tableMap[rowIdx] = [];
//       tableMap[rowIdx][colIdx] = col;
//       const td =
// document.querySelector(`td[data-key="${rowIdx}-${colIdx}"]`);
//       if (td && col === 1) {
//         td.classList.add('td_act');
//       }
//     });
//   });
// }


// generateTable();

export const MAP_STATUS = {
  EMPTY: 0,
  FIGURE: 1,
  PORTAL: 2,
  COIN: 3
};


export const mapTemplate = [
  [3,3,3,3,3,3,3,3,3,3,3,1,1,3,3,3,3,3,3,3,3,3,3,3],
  [3,1,1,1,3,1,1,1,1,1,3,1,1,3,1,1,1,1,1,3,1,1,1,3],
  [3,1,0,1,3,1,0,0,0,1,3,1,1,3,1,0,0,0,1,3,1,0,1,3],
  [3,1,1,1,3,1,1,1,1,1,3,1,1,3,1,1,1,1,1,3,1,1,1,3],
  [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
  [3,1,1,1,1,3,1,3,1,1,1,1,1,1,1,1,3,1,3,1,1,1,1,3],
  [3,1,1,1,1,3,1,3,1,1,1,1,1,1,1,1,3,1,3,1,1,1,1,3],
  [3,3,3,3,3,3,1,3,3,3,3,1,1,3,3,3,3,1,3,3,3,3,3,3],
  [1,1,1,1,1,3,1,1,1,1,3,1,1,3,1,1,1,1,3,1,1,1,1,1],
  [1,1,1,1,1,3,1,1,1,1,3,1,1,3,1,1,1,1,3,1,1,1,1,1],
  [1,1,1,1,1,3,1,3,3,3,3,3,3,3,3,3,3,1,3,1,1,1,1,1],
  [1,1,1,1,1,3,1,3,1,1,1,0,0,1,1,1,3,1,3,1,1,1,1,1],
  [1,1,1,1,1,3,1,3,1,0,0,0,0,0,0,1,3,1,3,1,1,1,1,1],
  [2,3,3,3,3,3,3,3,1,0,0,0,0,0,0,1,3,3,3,3,3,3,3,2],
  [1,1,1,1,1,3,1,3,1,1,1,1,1,1,1,1,3,1,3,1,1,1,1,1],
  [1,1,1,1,1,3,1,3,3,3,3,3,3,3,3,3,3,1,3,1,1,1,1,1],
  [1,1,1,1,1,3,1,3,1,1,1,1,1,1,1,1,3,1,3,1,1,1,1,1],
  [3,3,3,3,3,3,1,3,1,1,1,1,1,1,1,1,3,1,3,3,3,3,3,3],
  [3,1,1,1,1,3,3,3,3,3,3,1,1,3,3,3,3,3,3,1,1,1,1,3],
  [3,1,1,1,1,3,1,1,1,1,3,1,1,3,1,1,1,1,3,1,1,1,1,3],
  [3,3,3,1,1,3,1,1,1,1,3,1,1,3,1,1,1,1,3,1,1,3,3,3],
  [1,1,3,1,1,3,3,3,3,3,3,3,3,3,3,3,3,3,3,1,1,3,1,1],
  [1,1,3,1,1,3,1,3,1,1,1,1,1,1,1,1,3,1,3,1,1,3,1,1],
  [1,1,3,1,1,3,1,3,1,1,1,1,1,1,1,1,3,1,3,1,1,3,1,1],
  [3,3,3,3,3,3,1,3,3,3,3,1,1,3,3,3,3,1,3,3,3,3,3,3],
  [3,1,1,1,1,1,1,1,1,1,3,1,1,3,1,1,1,1,1,1,1,1,1,3],
  [3,1,1,1,1,1,1,1,1,1,3,1,1,3,1,1,1,1,1,1,1,1,1,3],
  [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
];

// fillTable(mapTemplate);

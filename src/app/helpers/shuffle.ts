export function shuffle<TItem>(arr: TItem[], salt = Math.random()) {
  let currentIndex = arr.length,
    randomIndex;

  while (currentIndex > 0) {
    randomIndex = Math.floor(salt * currentIndex);
    currentIndex--;

    [arr[currentIndex], arr[randomIndex]] = [
      arr[randomIndex],
      arr[currentIndex],
    ];
  }

  return arr;
}

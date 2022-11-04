const pagenation = function (current, total) {
  const list = [];
  if (total <= 5) {
    for (let i = 1; i <= total; i++) {
      list.push(i);
    }
    return list;
  }
  let middle = current;
  while (middle + 1 > total) middle--;
  while (middle - 1 < 1) middle++;
  let i = middle - 1;
  while (i >= 1 && i <= middle + 1) {
    list.push(i);
    i++;
  }
  return list;
};

for (let i = 1; i <= 20; i++) {
  console.log(`element ${i} / 20: ${pagenation(i, 20)}`);
}

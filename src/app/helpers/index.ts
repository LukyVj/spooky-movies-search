export function sentenceToColor(sentence: string) {
  let r = 0;
  let g = 0;
  let b = 0;

  for (let i = 0; i < sentence.length; i++) {
    const charCode = sentence.charCodeAt(i);
    r += charCode % 255;
    g += charCode % 155;
    b += charCode % 55;
  }

  // Ensure values are within the valid range (0-255)
  r = r % 256;
  g = g % 256;
  b = b % 256;

  // Convert to hexadecimal format
  const hexColor = `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;

  return hexColor;
}

export function translatePopularityToStars(popularity: number) {
  // Ensure the popularity value is within the 0 to 1 range
  popularity = Math.min(1, Math.max(0, popularity));

  // Translate the popularity value to the 0-5 scale
  const stars = popularity * 10;

  console.log(stars);

  return stars;
}

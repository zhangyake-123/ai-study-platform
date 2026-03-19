export function chunkText(
  text: string,
  chunkSize: number = 500,
  overlap: number = 100
): string[] {
  const cleanedText = text.trim();

  if (!cleanedText) {
    return [];
  }

  const chunks: string[] = [];
  let start = 0;

  while (start < cleanedText.length) {
    const end = start + chunkSize;
    const chunk = cleanedText.slice(start, end).trim();

    if (chunk) {
      chunks.push(chunk);
    }

    start += chunkSize - overlap;
  }

  return chunks;
}
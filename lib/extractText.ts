export async function extractTextFromFile(file: File): Promise<string | null> {
  const fileName = file.name.toLowerCase();

  if (fileName.endsWith(".txt") || fileName.endsWith(".md")) {
    return await file.text();
  }

  return null;
}
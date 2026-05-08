export async function urlToFile(url: string, filename: string): Promise<File | null> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const extension = blob.type.split('/')[1] || 'jpg';
    return new File([blob], `${filename}.${extension}`, { type: blob.type });
  } catch (error) {
    console.error('Ошибка конвертации URL в File:', error);
    return null;
  }
}

export async function base64ToFile(base64: string, filename: string): Promise<File | null> {
  try {
    const res = await fetch(base64);
    const blob = await res.blob();
    const extension = blob.type.split('/')[1] || 'jpg';
    return new File([blob], `${filename}.${extension}`, { type: blob.type });
  } catch (error) {
    console.error('Ошибка конвертации Base64 в File:', error);
    return null;
  }
}

export function toNaiveISOString(date: Date) {
  const currentDate = new Date(date.getTime() + 3 * 3600000);
  return currentDate.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:MM"
}
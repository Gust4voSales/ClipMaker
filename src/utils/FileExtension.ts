export function getFileExtension(filename: string) {
  return filename.slice(filename.indexOf("."), filename.length);
}

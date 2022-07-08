export function getFileExtension(filename: string) {
  return filename.slice(filename.lastIndexOf("."), filename.length);
}

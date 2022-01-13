export const copyToClip = (content: string) => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(content);
    return;
  }
  const aux = document.createElement("textarea");
  // aux.setAttribute("value", content);
  aux.value = content;
  document.body.appendChild(aux);
  aux.select();
  document.execCommand("copy");
  document.body.removeChild(aux);
};

export const readFromClip = () => {
  if (navigator.clipboard) {
    return navigator.clipboard.readText();
  }
  return Promise.resolve('');
}
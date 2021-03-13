export const versionStringCompare = (preVersion='', lastVersion='') => {
  const sources = preVersion.split('.');
  const dests = lastVersion.split('.');
  const maxL = Math.max(sources.length, dests.length);
  let result = 0;
  for (let i = 0; i < maxL; i++) {  
      const preValue = sources.length>i ? sources[i]:'0';
      const preNum = isNaN(Number(preValue)) ? preValue.charCodeAt(0) : Number(preValue);
      const lastValue = dests.length>i ? dests[i]:'0';
      const lastNum =  isNaN(Number(lastValue)) ? lastValue.charCodeAt(0) : Number(lastValue);
      if (preNum < lastNum) {
          result = -1;
          break;
      } else if (preNum > lastNum) { 
          result = 1;
          break;
      }
  }
  return result;
}
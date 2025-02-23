export function unixToDate(strDate: number | null){
  if(!strDate){
    return null
  }
  return new Date(strDate*1000)
}
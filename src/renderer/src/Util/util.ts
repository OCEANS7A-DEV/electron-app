export const productGet = async (code, withDetails = false) => {
  const List = await window.myInventoryAPI.ListData()
  const productData = List.find((item) => item.code === Number(code))
  let detailsData = [{ value: '', label: '' }]
  if (withDetails) {
    const DetailsList = await window.myInventoryAPI.DetailsData()
    const foundDetails = DetailsList.find((item) => item.code === Number(code))
    if (foundDetails) {
      detailsData = foundDetails.map((item) => {
        return { value: item[1] ?? '', label: item[1] ?? '' }
      })
    }
  }
  return { productData, detailsData }
}

export const pageNums = (Data, maxRow) => {
  const dataRow = Data.length
  const Num = Math.ceil(dataRow / maxRow)
  return Num
}

export const getNearestMonday = (D): string => {
  const date = new Date(D)
  const dayOfWeek = date.getDay()
  const diffToMonday = dayOfWeek <= 3 ? 1 - dayOfWeek : 8 - dayOfWeek
  const nearestMonday = new Date(date)
  nearestMonday.setDate(date.getDate() + diffToMonday)
  const year = nearestMonday.getFullYear()
  const month = String(nearestMonday.getMonth() + 1).padStart(2, '0')
  const day = String(nearestMonday.getDate()).padStart(2, '0')
  const result = `${year}-${month}-${day}`
  return result
}

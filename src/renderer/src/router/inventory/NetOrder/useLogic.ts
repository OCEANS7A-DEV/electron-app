import { useLoaderData } from 'react-router-dom'
import { LoaderData } from './types'

export const loader = async (): Promise<LoaderData> => {
  const data = await window.myInventoryAPI.ListGet({
    sheetName: 'ネット発注',
    action: 'ListGet',
    ranges: 'B2:C'
  })
  const URLs = data.filter((item: string[]) => item[0] !== '')
  return { URLs }
}

export const useLogic = (): LoaderData => {
  const { URLs } = useLoaderData()
  return { URLs }
}

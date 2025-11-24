// React
import { useState, useEffect, useRef } from 'react'

// Form関連コンポーネント
import { useForm, useFieldArray } from 'react-hook-form'


import toast from 'react-hot-toast'

import { productGet } from '../../../Util/util'

import { formatStoreData } from './logic'


export const useLogic = () => {

  const [storeList, setStoreList] = useState([])

  const RegisterData = (data) => {
    console.log(data)
  }

  const GetStores = async () => {
    const data = await window.myInventoryAPI.storeGet('storeList')
    const result = formatStoreData(data)
    console.log(result)
    setStoreList(result)
  }


 const firstSet = async() => {
    GetStores()
  }

  useEffect(() => {
    firstSet()
  }, [])

  return {
    RegisterData,
  }
}
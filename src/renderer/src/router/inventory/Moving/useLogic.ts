// React
import { useState, useEffect, useRef } from 'react'

// Form関連コンポーネント
import { useForm, useFieldArray } from 'react-hook-form'


import toast from 'react-hot-toast'

import { productGet } from '../../../Util/util'



export const useLogic = () => {

  const RegisterData = (data) => {
    console.log(data)
  }

  return {
    RegisterData,
  }
}
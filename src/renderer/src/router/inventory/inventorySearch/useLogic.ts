import { useState, useEffect } from 'react'

export const useLogic = () => {
  const [SearchWord, setSearchWord] = useState('')

  useEffect(() => {

  }, [SearchWord])

  return {
    SearchWord,
    setSearchWord
  }
}

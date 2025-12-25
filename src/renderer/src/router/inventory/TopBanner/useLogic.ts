import { useState, useEffect } from 'react'
import { useNavigation, useNavigate } from 'react-router-dom'
import type { SvgIconProps } from '@mui/material/SvgIcon'
import { UseLogicReturn } from './types'

export const useLogic = (): UseLogicReturn => {
  const navigate = useNavigate()
  const [open, setopen] = useState(false)
  const navigation = useNavigation()
  const [loading, setLoading] = useState(navigation.state === 'loading')
  const [updateIconColor, setUpdateIconColor] = useState<SvgIconProps['color']>('disabled')

  useEffect(() => {
    if (navigation.state === 'loading') {
      setLoading(true)
    } else {
      setLoading(false)
    }
  }, [navigation.state])

  useEffect(() => {
    window.myInventoryAPI.onUpdateAvailable((flag) => {
      if (flag) {
        setUpdateIconColor('success')
      } else {
        setUpdateIconColor('disabled')
      }
    })
  }, [])

  const handleUpdateClick = (): void => {
    window.myInventoryAPI.upGrade()
  }

  const LauncherOpen = (): void => {
    window.myInventoryAPI.MainBoot()
  }

  const handleDrawerOpen = (): void => {
    if (open) {
      setopen(false)
    } else {
      setopen(true)
    }
  }

  return {
    handleDrawerOpen,
    LauncherOpen,
    handleUpdateClick,
    loading,
    updateIconColor,
    navigate,
    open
  }
}

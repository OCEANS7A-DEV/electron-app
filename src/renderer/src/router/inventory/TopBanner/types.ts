import type { SvgIconProps } from '@mui/material/SvgIcon'

export interface ButtonSelectType {
  data: {id: string}
  navigate: (page: string) => void
  open: boolean
}

export interface UseLogicReturn {
  handleDrawerOpen: () => void
  LauncherOpen: () => void
  handleUpdateClick: () => void
  loading: boolean
  updateIconColor: SvgIconProps['color']
  navigate: (page: string) => void
  open: boolean
}

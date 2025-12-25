import type { JSX } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import MenuIcon from '@mui/icons-material/Menu'
import IconButton from '@mui/material/IconButton'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import LinearProgress from '@mui/material/LinearProgress'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt'

import { useLogic } from './useLogic'
import styles from './style.module.css'
import ButtonSelect from './ButtonSelect'

const LinkBaner = (data: { id: string }): JSX.Element => {
  const {
    handleDrawerOpen,
    LauncherOpen,
    handleUpdateClick,
    loading,
    updateIconColor,
    navigate,
    open
  } = useLogic()

  return (
    <Box>
      {loading && (
        <Box className={styles.LinearProgress}>
          <LinearProgress sx={{ width: '100%', height: 2 }} />
        </Box>
      )}
      <Box className={styles.LinkArea}>
        <Box className={styles.ArrowArea}>
          <Box style={{ display: 'flex' }}>
            <Button
              variant="outlined"
              onClick={LauncherOpen}
              sx={{ height: '30px', margin: '0px 5px', width: 60 }}
            >
              Apps
            </Button>
            <IconButton
              onClick={() => window.history.back()}
              sx={{ color: 'white', height: '30px', width: '30px' }}
              aria-label="戻る"
            >
              <ArrowBackIcon />
            </IconButton>
            <IconButton
              onClick={() => window.history.forward()}
              sx={{ color: 'white', height: '30px', width: '30px' }}
              aria-label="進む"
            >
              <ArrowForwardIcon />
            </IconButton>
          </Box>
          <Box>
            {updateIconColor === 'success' ? (
              <Tooltip
                title="アップデートがあります！"
                children={
                  <IconButton onClick={handleUpdateClick}>
                    <SystemUpdateAltIcon color={updateIconColor} />
                  </IconButton>
                }
              />
            ) : (
              <IconButton disabled>
                <SystemUpdateAltIcon color={updateIconColor} />
              </IconButton>
            )}
            <IconButton sx={{ color: 'white' }} onClick={handleDrawerOpen}>
              <MenuIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>
      <Box>
        <ButtonSelect data={data} navigate={navigate} open={open} />
      </Box>
    </Box>
  )
}

export default LinkBaner

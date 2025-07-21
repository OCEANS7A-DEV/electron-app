import React, { useEffect, useState } from 'react'
import type { JSX } from 'react'
import '../css/updater.css'
import CircularProgress from '@mui/material/CircularProgress'

const UpdateWindow = (): JSX.Element => {
  const [number, setNumber] = useState<number>(0)
  const [message, setMessage] = useState<string>('')
  const [status, setStatus] = useState<string>('')
  const [updateCheck, setUpdateCheck] = useState<boolean>(false)
  const [DevCheck, setDevCheck] = useState<boolean>(false)
  const [Startup, setStartup] = useState<boolean>(false)
  const [Google, setGoogle] = useState<boolean>(false)

  useEffect(() => {
    window.myInventoryAPI.onProgressUpdate((value) => {
      setNumber(value.percent)
      setMessage(value.message)
      setStatus(value.status)
    })
  }, [])

  useEffect(() => {
    window.myInventoryAPI.onCheckedUpdate((value) => {
      if (value.status == 'dev') {
        setDevCheck(true)
      } else if (value.status == 'updateCheck') {
        setUpdateCheck(true)
      } else if (value.status == 'bootCheck') {
        window.myInventoryAPI.UpdaterClose()
      } else if (value.status == 'startup') {
        setStartup(true)
      } else if (value.status == 'google') {
        setGoogle(true)
      } else if (value.status == 'text') {
        setMessage('アップデートの確認中...')
      }
    })
  }, [])

  useEffect(() => {
    if ((updateCheck && Startup && Google) || (DevCheck && Google)) {
      window.myInventoryAPI.MainBoot()
    }
  }, [updateCheck, Startup, Google, DevCheck])

  return (
    <>
      <div className="update-window">
        <div className="update-progress">
          {status === 'start' ? (
            <div>
              <CircularProgress size="3rem" />
            </div>
          ) : status === 'downloading' ? (
            <div>
              <CircularProgress variant="determinate" value={number} />
            </div>
          ) : null}
        </div>
        <div className="update-message">{message}</div>
      </div>
    </>
  )
}

export default UpdateWindow

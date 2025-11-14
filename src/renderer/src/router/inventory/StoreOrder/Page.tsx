// React
import React from 'react'
import type { JSX } from 'react'

// MUI
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Autocomplete from '@mui/material/Autocomplete'

// MUIアイコン
import SendIcon from '@mui/icons-material/Send'

// 日付関連コンポーネント
import 'dayjs/locale/ja'
import dayjs, { Dayjs } from 'dayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
dayjs.locale('ja')

// 独自コンポーネント
import LinkBaner from '../../../comp/Linkbanar'
import WordSearch from '../../../comp/ProductSearchWord'

// トースト通知コンポーネント
import toast, { Toaster } from 'react-hot-toast'

const StoreOrderPage = () => {

  return (

  )
}

export default StoreOrderPage

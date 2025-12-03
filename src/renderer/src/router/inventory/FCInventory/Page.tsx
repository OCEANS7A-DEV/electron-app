import type { JSX } from 'react'
import Box from '@mui/material/Box'

// 自作コンポーネント
import WordSearch from '../../../comp/ProductSearchWord'
import LinkBaner from '../../../comp/Linkbanar'
import RowComp from './RowComp'
import SelectArea from './SelectArea'

import { useLogic } from './useLogic'


const FCInventoryPage = (): JSX.Element => {
  const {
    RegisterData,
    storenames,
    storeValue,
    handleStoreChange,
    yearList,
    yearValue,
    handleYearChange,
    monthList,
    monthValue,
    handleMonthChange,
    datas,
    types,
    fields,
    register
  } = useLogic()
  return (
    <Box>
      <Box>
        <LinkBaner id="zaiko" />
      </Box>
      <Box
        sx={{
          paddingTop: '60px',
          paddingLeft: '10px',
          display: 'flex'
        }}
      >
        <Box
          sx={{
            paddingTop: '60px'
          }}
        >
          <WordSearch RegisterData={RegisterData} />
        </Box>
        <Box
          sx={{
            paddingLeft: '20px'
          }}
        >
          <Box
            sx={{
              display: 'flex'
            }}
          >
            <SelectArea
              ListData={yearList}
              labelName="年"
              valueData={yearValue}
              handleValueChange={handleYearChange}
            />
            <SelectArea
              ListData={monthList}
              labelName="月"
              valueData={monthValue}
              handleValueChange={handleMonthChange}
            />
            <SelectArea
              ListData={storenames}
              labelName="店舗"
              valueData={storeValue}
              handleValueChange={handleStoreChange}
            />
          </Box>
          <Box
            sx={{
              paddingTop: '12px',
              paddingBottom: '80px'
            }}
          >
            <Box component="form">
              {fields.map((field, index) => (
                <Box key={field.id}>
                  <RowComp index={index} register={register} />
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default FCInventoryPage

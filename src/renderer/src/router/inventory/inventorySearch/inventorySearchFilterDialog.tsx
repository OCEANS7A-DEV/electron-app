import React, { useEffect } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  TextField,
  Typography,
  Box
} from '@mui/material'
import { SelectChangeEvent } from '@mui/material/Select'



interface SearchFilterDialogProps {
  FilterDialogOpen: boolean;
  setFilterDialogOpen: (open: boolean) => void;
  FilterConditions: any;
  setFilterConditions: (conditions: any) => void;
}

const SearchFilterDialog = ({
  FilterDialogOpen,
  setFilterDialogOpen,
  FilterConditions,
  setFilterConditions
}: SearchFilterDialogProps) => {

  if (!FilterDialogOpen) return null

  const [typeList, setTypeList] = React.useState<any[]>([])

  const Initialize = async () => {
    const List = await window.myInventoryAPI.ListData()
    const types = Array.from(new Set(List.map((item) => item.type))).filter((item) => item !== '')
    setTypeList(types)
  }

  useEffect(() => {
    Initialize()
  }, [])

  const FilterConditionChangeText = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    key: string
  ) => {
    const newConditions = { ...FilterConditions }
    newConditions[key] = e.target.value
    setFilterConditions(newConditions)
  }

  const handleClose = () => {
    setFilterDialogOpen(false)
  }

  return (
    <Dialog open={FilterDialogOpen} onClose={handleClose}>
      <DialogTitle>絞り込み検索</DialogTitle>
      <DialogContent sx={{ minWidth: 300, paddingTop: '16px !important' }}>
        <Box>
          <FormControl fullWidth>
            <InputLabel id="price-type-label">価格タイプ</InputLabel>
            <Select
              labelId="price-type-label"
              value={FilterConditions.PriceType}
              label="価格タイプ"
              displayEmpty
              size="small"
              onChange={(e: SelectChangeEvent) =>
                setFilterConditions({
                  ...FilterConditions,
                  PriceType: e.target.value as string
                })
              }
            >
              <MenuItem value={''}>選択なし</MenuItem>
              <MenuItem value={'newPrice'}>仕入価格</MenuItem>
              <MenuItem value={'sales'}>店販価格</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              marginTop: 2
            }}
          >
            <Typography
              variant="body1"
              sx={{
                marginRight: 1,
                whiteSpace: 'nowrap'
              }}
            >
              絞込価格:
            </Typography>
            <TextField
              label="最低価格"
              type="number"
              size="small"
              onChange={(e) => FilterConditionChangeText(e, 'LowestPrice')}
              sx={{ width: 150 }}
            />
            <Typography variant="body1" sx={{ marginX: 1 }}>
              ~
            </Typography>
            <TextField
              label="最高価格"
              type="number"
              size="small"
              onChange={(e) => FilterConditionChangeText(e, 'HighestPrice')}
              sx={{ width: 150 }}
            />
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            marginTop: 2
          }}
        >
          <FormControl fullWidth>
            <InputLabel id="product-type-label">商品タイプ</InputLabel>
            <Select
              labelId="product-type-label"
              value={FilterConditions.ProductType}
              label="商品タイプ"
              displayEmpty
              size="small"
              onChange={(e: SelectChangeEvent) =>
                setFilterConditions({
                  ...FilterConditions,
                  ProductType: e.target.value as string
                })
              }
            >
              <MenuItem value={''}>選択なし</MenuItem>
              {typeList.map((type, index) => (
                <MenuItem key={index} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button variant="contained" onClick={handleClose}>
          閉じる
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default SearchFilterDialog

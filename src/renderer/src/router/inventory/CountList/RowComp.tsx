import Box from '@mui/material/Box'
const RowComp = ({ data }) => {
  return (
    <>
      <Box>{data.code}</Box>
      <Box>{data.name}</Box>
    </>
  )
}

export default RowComp

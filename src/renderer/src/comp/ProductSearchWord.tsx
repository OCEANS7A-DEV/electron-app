import React, { useState, ChangeEvent, useEffect } from 'react'
import '../css/ProductSearchWord.css'
import { Button } from '@mui/material'
//import { searchStr } from '../backend/WebStorage.ts';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
/* @ts-ignore */
import jaconv from 'jaconv';




export default function WordSearch({DisplayStatus, setDisplayStatus, RegisterData}) {
  const [SWord, setSWord] = useState<string>('')
  const [tableData, setTableData] = useState<any[]>([])
  const [data, setData] = useState<any[]>([])
  const [buttonlabel, setButtonLabel] = useState('閉じる')

  // 入力値変更時に呼び出される
  const handlewordchange = (event: ChangeEvent<HTMLInputElement>) => {
    setSWord(event.target.value)
  }
  

  

  // データ更新
  const productListUpdate = async () => {
    const Lists = await window.myInventoryAPI.ListGet({
      sheetName: '在庫一覧',
      action: 'ListGet',
      ranges: 'A2:L'
    })
    localStorage.setItem('data', Lists)
  }


  // データ取得
  const dataSet = async () => {
    const data = await window.myInventoryAPI.ListData()
    //console.log(data)
    setData(data)
  }


  // 入力内容が変わったときに検索ワードをセット
  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      productReSearch()
    }
  }

  const switching = () => {
    setDisplayStatus(!DisplayStatus)
  }

  const buttonlabelSet = () => {
    let result = '開く'
    if(DisplayStatus){
      result = '閉じる'
    }
    setButtonLabel(result)
  }

  const ProductClick = async(row) => {
    RegisterData(row)
  }



  const productReSearch = async() => {
    if (!SWord){
      setTableData(data)
    } else {
      const swKZ = jaconv.toKatakana(SWord);
      const swHZ = jaconv.toHiragana(swKZ);
      const swKH = jaconv.toHan(swKZ);
      const SearchWords = [SWord,swKZ,swHZ,swKH]
      if (!SWord) {
        setTableData([])
        return
      }
      const searchresult = data.filter(item => {
        const nameStr = String(item.name ?? '');
        return SearchWords.some(sw => nameStr.includes(sw));
      });
      setTableData(searchresult)
    }
  }

  useEffect(() => {
    dataSet()
    buttonlabelSet()
  }, [])

  useEffect(() => {
    buttonlabelSet()
  }, [DisplayStatus])

  return (
    <div className="WordSearch-area">
      <div className="OandC">
        <Button variant='outlined' onClick={switching} sx={{ height: '30px' }}>
          {buttonlabel}
        </Button>
      </div>
      {DisplayStatus && (
        <div className="WordSearchA">
          <div className="search-input">
            <input
              type="text"
              value={SWord}
              onChange={handlewordchange}
              placeholder="検索ワードを入力"
              onKeyDown={(e) => handleKeyDown(e)}
            />
            <Button variant="outlined" onClick={productReSearch} sx={{ height: '30px' }}>
              検索
            </Button>
            <Button variant="outlined" onClick={productListUpdate} sx={{ height: '30px' }}>
              更新
            </Button>
          </div>
          <div className="search-table">
            <table className="search-data-table">
              <thead>
                <tr>
                  <th className="stcode">商品コード</th>
                  <th className="stname">商品名</th>
                </tr>
              </thead>
              <tbody className="datail">
                {tableData.map((row, index) => (
                  <tr key={index}>
                    <td className="scode">
                      <Button sx={{ height: '30px' }} onClick={() => ProductClick(row)}>
                        {row.code}
                      </Button>
                    </td>
                    <td className="sname">
                      <Button
                        sx={{ height: '30px', color: 'black' }}
                        onClick={() => ProductClick(row)}
                      >
                        {row.name}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
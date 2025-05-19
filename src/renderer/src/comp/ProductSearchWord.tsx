import React, { useState, ChangeEvent, useEffect } from 'react'
import '../css/ProductSearchWord.css'
import { Button } from '@mui/material'
//import { searchStr } from '../backend/WebStorage.ts';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
/* @ts-ignore */
import Fuse from 'fuse.js'
import jaconv from 'jaconv';




export default function WordSearch() {
  const [SWord, setSWord] = useState<string>('')
  const [tableData, setTableData] = useState<any[]>([])
  const [data, setData] = useState<any[]>([])
  const [fuse, setFuse] = useState<any>(null)

  // 入力値変更時に呼び出される
  const handlewordchange = (event: ChangeEvent<HTMLInputElement>) => {
    setSWord(event.target.value)
  }
  
  const productReSearch = async () => {
    if(!SWord){
      setTableData(data)
    }else {
      const swKZ = jaconv.toKatakana(SWord);
      const swHZ = jaconv.toHiragana(swKZ);
      const swKH = jaconv.toHan(swKZ);
      const SearchWords = [SWord,swKZ,swHZ,swKH]
      if (!SWord || !fuse) {
        console.warn('検索語またはfuseが無効')
        setTableData([])
        return
      }
      const resultSearch = SearchWords.map(row => {
        const result = fuse.search(row)
        return result
      })
      const flatData = resultSearch.flat(1)
      const matchedRowsF = flatData.map((r: any) => r.item)
      const NotDuplicated = [...new Set(matchedRowsF)]
      setTableData(NotDuplicated)
    }
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

  // fuseの初期化
  useEffect(() => {
    if (data.length > 0) {
      //console.log('Fuseに渡すデータ:', data)
  
      const fuse = new Fuse(data, {
        threshold: 0,
        includeScore: true,
        keys: ["code", "name"],
      })
  
      setFuse(fuse)
    }
  }, [data])

  // 入力内容が変わったときに検索ワードをセット
  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      productReSearch()
    }
  }

  useEffect(() => {
    dataSet()
  }, [])


  return (
    <div className="WordSearch-area">
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

      {/* テーブルを表示 */}
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
                <td className="scode">{row.code}</td> {/* 商品コードは配列の2番目の要素 */}
                <td className="sname">{row.name}</td> {/* 商品名は配列の3番目の要素 */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

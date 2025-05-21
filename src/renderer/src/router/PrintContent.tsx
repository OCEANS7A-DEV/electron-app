// PrintContent.tsx
import React, { useEffect, useState } from 'react'
//import { useLocation } from 'react-router-dom';
import '../css/PrintContent.css'
import '../css/orderPrint.css'
import { useLoaderData } from "react-router-dom";





export const loader = async () => {
  //console.log(window.myInventoryAPI);
  const printData = await window.myInventoryAPI.storeGet('printData')
  const printDate = await window.myInventoryAPI.storeGet('printDate')
  //setDate(printDate)
  //console.log(JSON.parse(printData))
  //setPrintData(JSON.parse(printData))
  const ordersGet = JSON.parse(printData)
  const stores = [...new Set(ordersGet.map(item => item[1]))]
  const rowNum = 19;
  const resultdata = await Promise.all(
    stores.map(async (storeName) => {
      const storeData = ordersGet.filter(row => row[1] === storeName);
      let printData = storeData;
      let pages = 1
      if(printData.length !== 0){
        pages = Math.ceil(printData.length / rowNum);
      }
      const EmptyRow = ['', '', '', '', '', '', '', '', '', '', '', ''];
      const restrows = (pages * rowNum) - printData.length;
      for (let i = 0; i < restrows; i++) {
        printData.push(EmptyRow);
      }
      return printData;
    })
  )
  // setPrintData(resultdata)
  // setStore(store)
  return {printDate,resultdata,stores}
}



const PrintContent = () => {
  const {printDate,resultdata,stores} = useLoaderData<typeof loader>();
  //const [date, setDate] = useState<any>(null)
  //const location = useLocation();
  //const [printData, setPrintData] = useState([]);
 // const [stores, setStore] = useState([])
  const SetRows = 19;
  const defaultText = '';
  const [WarningText, setWarningText] = useState(defaultText);

  setWarningText(defaultText)



  const storeTotalResult = (data) => {
    return data.reduce((sum, row) => sum + (Number(row[9]) || 0), 0);
  }

  const totalResult = (num: string, price: string) => {
    let result = '' 
    if(num !== '' && price !== '') {
      let total = Number(num) * Number(price)
      result = total.toLocaleString('ja-JP');
    }else {
      result = ''
    }
    return result
  };

  const hasDecimal = (num: number): boolean => {
    return !Number.isInteger(num);
  }

  const personalTotalAmount = (num: number, price: number, personal: string) => {
    let result = '';
    if(personal !== '') {
      let personalAmount = (num * price) * 1.1
      let calcError = Math.floor(personalAmount * 10) / 10;
      let roundUp = 0;
      if (hasDecimal(calcError)){
        roundUp = Math.ceil(calcError);
      }else{
        roundUp = calcError
      }
      
      result = `税込¥${roundUp.toLocaleString('ja-JP')}`
    }
    return result
  };
  
  const personalData = (personal: string) => {
    let result = '';
    if(personal !== '') {
      result = `${personal}様`
    }
    return result
  };

  const warningSet = (data) => {
    //console.log(data)
    let NonPriceData = data.filter(row => row[8] === '' && row[0] !== '');
    if(NonPriceData.length !== 0){
      return '警告 単価の入力がない商品があります'
    }else {
      return ''
    }
  }

    useEffect(() => {
      window.myInventoryAPI.PrintReady()
    },[])


  return (
    <div className="print-area">
      <div className="Printwarning">{WarningText}</div>
      <div className="printData">
        {stores.map((storerow,storeindex) => (
          <table className="printData" key={storeindex}>
            <thead>
              <tr>
                <th colSpan="10">
                  <div className="printDate">
                    <div className="print-date">発注日:　{printDate}</div>
                    <div className="print-title">納品書</div>
                  </div>
                </th>
              </tr>
              <tr className="storename">
                <th className="print-storename" colSpan="10">
                  <div className="print-storename-div">
                    <div className="Printwarning">{warningSet(resultdata[storeindex])}</div>
                    <div className="storeName">{storerow}</div>
                  </div>
                  
                </th>
              </tr>
              <tr className="print-table-header">
                <th>商品ナンバー・商品名</th>
                <th>商品詳細</th>
                <th>注文数</th>
                <th>単価</th>
                <th>合計金額</th>
                <th>個人購入</th>
                <th>個人税込</th>
                <th>備考</th>
              </tr>
            </thead>
            <tbody>
              {resultdata[storeindex].map((row, index) => (
                <>
                  {(index % SetRows === 0 && index > 1) && (
                    <>
                      <tr key={`condition`}>
                        <td colSpan="10" className="special-row no-break">
                          {index/SetRows}/{resultdata[storeindex].length / SetRows}
                        </td>
                      </tr>
                    </>
                  )}
                  <tr key={index} className="special-row no-break">
                    <td>
                      <div className="P-code">{row[3]}</div>
                      <div className="P-name">{row[4]}</div>
                    </td>
                    <td className="P-detail">{row[5]}</td>
                    <td className="P-number">{row[6]}</td>
                    <td className="P-price">{Number(row[8]).toLocaleString('ja-JP') ?? ''}</td>
                    <td className="P-totalprice">{totalResult(row[6],row[8])}</td>
                    <td className="P-personal">{personalData(row[10])}</td>
                    <td className="P-personal-taxin">{personalTotalAmount(row[6],row[8],row[10])}</td>
                    <td className="P-remarks">{row[11]}</td>
                  </tr>
                </>
              ))}
              <>
                <tr key="last-condition" className="special-row no-break">
                  <td colSpan="11" className="special-row">
                    <div className="last-row">
                      <div className="last-page-data">{resultdata[storeindex].length / SetRows}/{resultdata[storeindex].length / SetRows}</div>
                      <div className="last-page-amount">税抜注文合計金額(個人購入・欠品分含む): ¥{Number(storeTotalResult(resultdata[storeindex])).toLocaleString('ja-JP')}</div>
                    </div>
                  </td>
                </tr>
              </>
            </tbody>
          </table>
        ))}
      </div>
      
    </div>
  );
};

export default PrintContent;
// ReactDOM.createRoot(document.getElementById('root')!).render(<PrintContent />)
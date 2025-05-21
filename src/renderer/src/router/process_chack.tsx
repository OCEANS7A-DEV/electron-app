import React, { useEffect, useState } from 'react';
//import { ProcessConfirmationGet, OrderDeadline, orderGet, GASProcessUpdate, QuantityReset, shortageGet,kaigisituOrder } from '../backend/Server_end';
//import { localStoreSet, PrintDataSet, SelectlocalStoreSet, ETCDATAGET } from '../backend/WebStorage';
import Select from 'react-select';
import '../css/process_check.css';
// import '../css/a_button.css';
import LinkBaner from '../comp/Linkbanar';
//import DeadLineDialog from './DeadLineDialog';
//import QuantityResetDialog from './QuantityResetDialog';
import toast, { Toaster } from 'react-hot-toast';

import { Button } from '@mui/material';

import MoonLoader from 'react-spinners/MoonLoader';

//import { useNavigate } from "react-router-dom";


// import { useNavigate } from "@remix-run/react";


// import { useLoaderData, Link, useNavigation } from "@remix-run/react";





interface SelectOption {
  value: string;
  label: string;
}


const isoToJstYMD = (isoString) => {
  const date = new Date(isoString);
  const jst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  const yyyy = jst.getFullYear();
  const mm = String(jst.getMonth() + 1).padStart(2, '0');
  const dd = String(jst.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}


const getNearestMonday = () => {
  const date = new Date();
  const dayOfWeek = date.getDay();
  const diffToMonday = dayOfWeek <= 3 ? 1 - dayOfWeek : 8 - dayOfWeek;
  const nearestMonday = new Date(date);
  nearestMonday.setDate(date.getDate() + diffToMonday);
  const year = nearestMonday.getFullYear();
  const month = String(nearestMonday.getMonth() + 1).padStart(2, "0");
  const day = String(nearestMonday.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};



// const CurrentDate = () => {
//   const today = new Date()
//   const year = today.getFullYear()
//   const month = ('0' + (today.getMonth() + 1)).slice(-2)
//   const day = ('0' + today.getDate()).slice(-2)
//   const resultdate = year + '/' + month + '/' + day
//   return resultdate
// }
// const DateNow = CurrentDate();

export default function HQPage() {
  const [checkresult, setCheckResult] = useState([]);
  //const [isDialogOpen, setDialogOpen] = useState(false);
  const [storeSelect, setStoreSelect] = useState<SelectOption | null>(null);
  const [selectOptions, setSelectOptions] = useState<SelectOption[]>([]);
  //const message = `今回の店舗からの注文を${DateNow}で締め切りますか？`;
  const [getDate, setGetDate] = useState(getNearestMonday());
  
  const [vendorSelect, setVendorSelect] = useState<SelectOption | null>(null);
  const [VendorList, setVendorList] = useState<SelectOption | null>(null);
  const [AddressList, setAddressList] = useState<SelectOption | null>(null);
  const [addressSelect, setAdoressSelect] = useState<SelectOption | null>(null);
  const [orderData, setOrderData] = useState([]);

  const [Listload, setListload] = useState(false);

  //const navigate = useNavigate();




  const OceanListGet = async () => {
    const alllist = await window.myInventoryAPI.ListGet({sheetName: 'その他データ', action: 'ListGet', ranges: 'A2:H'})
    const list = alllist.filter(row => row[7] === 'オーシャン');
    const result = list.map((row) => ({
      value: row[0],
      label: row[0]
    }))
    setAddressList(result)
    setAdoressSelect(result[0])

    const vendorresult = [{value: '大洋商会', label: '大洋商会'}, {value: '大洋以外',label: '大洋以外'}]
    setVendorList(vendorresult)
  };


  const StoresGet = async () => {
    const stores = await window.myInventoryAPI.ListGet({
      sheetName: 'その他一覧',
      action: 'ListGet',
      ranges: 'A2:B'
    });

  
    const storenames: SelectOption[] = stores
      .filter(item => item[1] !== '')
      .map(item => ({
        value: item[0],
        label: item[0]
      }));
    setSelectOptions(storenames);
  };
  


  const PrintProcessList = async () => {
    setListload(true)
    const ordersGet = await window.myInventoryAPI.ListGet({sheetName: '店舗へ', action: 'InputDataGet', ranges: 'A2:M'})

    const storeData = await window.myInventoryAPI.ListGet({sheetName: 'その他一覧', action: 'ListGet', ranges: 'A2:B'})

    const storefilter = storeData.filter(item => item[1] !== '')

    const storeList = storefilter.map(item => item[0])

    const filterd = ordersGet.filter(row => isoToJstYMD(row[0]) == getDate)

    setOrderData(filterd)

    const storeOrders = storeList.map(item => {
      const storeOrder = filterd.filter(row => row[1] == item)
      let processdata = ''
      const processlist = storeOrder.map(process => process[12])
      const donere = processlist.includes('印刷済')
      const notre = processlist.includes('未印刷')
      const nonere = processlist.includes('注文無')
      if(donere && !notre && !nonere){
        processdata = '印刷済';
      }else if(!donere && notre && !nonere){
        processdata = '未印刷';
      }else if(donere && notre && !nonere){
        processdata = '一部未印刷';
      }else if(!donere && !notre && !nonere){
        processdata = '未注文';
      }else if(nonere && !donere && !notre){
        processdata = '注文無';
      }
      let resultdata = {storeName: item, process: processdata}
      return resultdata
    })
    setCheckResult(storeOrders)
    setListload(false)
  };



  


  useEffect(() => {
    StoresGet()
    OceanListGet()
    PrintProcessList()
    // const getLocalStorageSize = async () => {
    //   const cachedData = await JSON.parse(localStorage.getItem('storeData') ?? '');
    //   const storedatalist: SelectOption[] = [];
    //   for (let i = 0; i < cachedData.length; i++){
    //     storedatalist.push(
    //       {
    //         value: cachedData[i],
    //         label: cachedData[i],
    //       }
    //     )
    //   }
    //   setSelectOptions(storedatalist);
    //   await SelectlocalStoreSet(storedatalist);
    // }
    // setGetDate(sessionStorage.getItem('setDATE') ?? '');
    // VendorListGet();
    // OceanListGet();
  },[])

  useEffect(() => {
    if(getDate !== ''){
      PrintProcessList()
    }
  },[getDate])

  // useEffect(() =>{
  //   const resetDate = sessionStorage.getItem('printdate') ?? ''
  //   if(resetDate !== ''){
  //     setGetDate(resetDate);
  //     PrintProcessList(resetDate);
  //   }else{
  //     const utcDate = new Date();
  //     const japanTime = new Date(utcDate.getTime() + 9 * 60 * 60 * 1000);
  //     const formattedJapanDate = japanTime.toISOString().split('T')[0];
  //     setGetDate(formattedJapanDate)
  //   }
  // },[])

  // useEffect(() => {
  //   const setdate = sessionStorage.getItem('setDATE') ?? ''
  //   if (setdate === '') {
  //     const today = new Date();
  //     const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  //     setGetDate(formattedDate);
  //   }
  // }, []);
  




  // const handleConfirm = () => {
  //   OrderDeadline();
  //   alert('確認が完了しました');
  //   setDialogOpen(false);
  // };

  // const handleCancel = () => {
  //   alert('キャンセルされました');
  //   setDialogOpen(false);
  // };

  // const handleOrderPrint = async () => {
  //   //console.log(storeSelect)
  //   let storeprintname = '';
  //   if (storeSelect){
  //     storeprintname = storeSelect.value
  //   }

  //   //console.log(getDate)
    
  //   if (getDate !== '' && storeprintname !== '') {
  //     const setStore = [storeprintname]
  //     const params = new URLSearchParams();
  //     params.set("date", getDate);
  //     setStore.forEach(store => {
  //       params.append("store", store);
  //     });
  //     navigate(
  //       `/orderPrint?${params.toString()}`
  //     )
  //   }
  // };

  // const handleOrderPrintAll = async (setStore:any) => {
  //   const params = new URLSearchParams();
  //   if (getDate !== '' ) {
  //     params.set("date", getDate);
  //     setStore.forEach(store => {
  //       params.append("store", store);
  //     });
      
  //     await navigate(
  //       `/orderPrint?${params.toString()}`
  //     )
  //   }
  // };

  // const allPrint = async () => {
  //   const printstoreList = checkresult.filter(row => row.process == '未印刷' || row.process == '一部未印刷')
  //   const stores = printstoreList.map(item => item.storeName)
  //   handleOrderPrintAll(stores);
  // };

  // const allPrintTRUE = async () => {
  //   const printstoreList = checkresult.filter(row => row.process !== '未注文' && row.process !== '注文無')
  //   const stores = printstoreList.map(item => item.storeName)
  //   handleOrderPrintAll(stores);
  // }

  const VendorPrint = async () => {
    if (!addressSelect || !vendorSelect) {
      toast.error('業者の選択、もしくは配送先の選択がされていません。')
      return
    }
    const setdate = getDate
    const Vendorparams = new URLSearchParams();
    Vendorparams.set("date", setdate);
    Vendorparams.set("address", addressSelect.value);
    Vendorparams.set("vendor",vendorSelect.value)

    if (vendorSelect.value == '大洋商会') {
      window.myInventoryAPI.orderPrint(`taiyo?${Vendorparams.toString()}`)
    }else{
      window.myInventoryAPI.orderPrint(`VendorPrint?${Vendorparams.toString()}`)
      //navigate(`/etcPrint?${Vendorparams.toString()}`);
    }
  }

  // const detailPrint = () => {
  //   const setdate = sessionStorage.getItem('setDATE') ?? '';
  //   if(getDate === '') {
  //     toast.error('取得する日付が入力されていません。')
  //     return
  //   }
  //   const Orderparams = new URLSearchParams();
  //   Orderparams.set("date", getDate);
  //   navigate(`/detailPrint?${Orderparams.toString()}`)
  // }

  // const datalistElseCasePrint = () => {
  //   const setdate = sessionStorage.getItem('setDATE') ?? '';
  //   if(getDate === '') {
  //     toast.error('取得する日付が入力されていません。')
  //     return
  //   }
  //   const Orderparams = new URLSearchParams();
  //   Orderparams.set("date", getDate);
  //   navigate(`/elsecasePrint?${Orderparams.toString()}`)
  // }



  const Dateset = (date) => {
    setGetDate(date)
    sessionStorage.setItem('setDATE',date)
  }


  const VendorOrderData = async () => {
    const data = await window.myInventoryAPI.ListGet({sheetName: '在庫一覧', action: 'TotallingGet', ranges: 'A2:M'})
    //const FAX = VendorList.map(item => item.value)
    const filterdata = data.filter(item => item[12] < 0)

    console.log(data)
    console.log(filterdata)
    console.log(VendorList)
  }


  const casePrint = async () => {
    const setDate = new Date(getDate).toLocaleDateString()
    const stores = checkresult.filter(item => item.process !== '未注文' && item.process !== '印刷済' && item.process !== '注文無')
    const orderresult = stores.map(row => {
      const filterData = orderData.filter(item => item[1] == row.storeName)
      return filterData
    })
    if(orderresult.length === 0){
      toast.error('印刷できるデータがありません')
      return
    }

    const updataStore = stores.map(row => row.storeName)
    window.myInventoryAPI.DataInsert({
      sheetName: '店舗へ',
      action: 'PrintcellUpdate',
      searchData: updataStore,
      searchColumn: 1,
      updataColumnNumber: 13,
      updataValue: '印刷済',
      updataDate: setDate
    })
    await window.myInventoryAPI.storeSet('printData', JSON.stringify(orderresult.flat(1)));
    await window.myInventoryAPI.storeSet('printDate', setDate);
    window.myInventoryAPI.orderPrint('PrintContent');
  }

  const IndividualPrint = async() => {
    const setDate = new Date(getDate).toLocaleDateString()
    if(!storeSelect){
      toast.error('印刷できるデータがありません')
      return
    }
    const store = storeSelect.value
    const filterData = orderData.filter(item => item[1] == store)
    if(filterData.length === 0){
      return
    }
    //console.log(filterData)
    await window.myInventoryAPI.storeSet('printData', JSON.stringify(filterData))
    await window.myInventoryAPI.storeSet('printDate', setDate)
    //console.log(store)
    window.myInventoryAPI.orderPrint('PrintContent');
    window.myInventoryAPI.DataInsert({
      sheetName: '店舗へ',
      action: 'PrintcellUpdate',
      searchData: [store],
      searchColumn: 1,
      updataColumnNumber: 13,
      updataValue: '印刷済',
      updataDate: setDate
    })
  }

  const handleallPrint = async() => {
    const setDate = new Date(getDate).toLocaleDateString()
    const updataStore = checkresult
      .filter(row => !['注文無', '未注文'].includes(row.process))
      .map(row => row.storeName);
    //console.log(updataStore)
    if(orderData.length === 0){
      toast.error('印刷できるデータがありません')
      return
    }
    const filterd = orderData.filter(row => updataStore.includes(row[1]))
    //console.log(filterd)
    const setdata = JSON.stringify(filterd)
    await window.myInventoryAPI.storeSet('printData', setdata)
    await window.myInventoryAPI.storeSet('printDate', getDate)
    //store.set('printData',setData)
    //const setData = encodeURIComponent(JSON.stringify(orderData))
    window.myInventoryAPI.orderPrint('PrintContent');
    window.myInventoryAPI.DataInsert({
      sheetName: '店舗へ',
      action: 'PrintcellUpdate',
      searchData: updataStore,
      searchColumn: 1,
      updataColumnNumber: 13,
      updataValue: '印刷済',
      updataDate: setDate
    })
  };


  return (
    <div className='check_window'>
      <Toaster />
      <div className="banner">
        <LinkBaner/>
      </div>
      <div className="chack_etc">
        <div className="check_area">
          <div className="check_set">
            <Button variant="outlined" onClick={() => PrintProcessList()}>取得</Button>
            <input
              type="date"
              className="insert_order_date"
              max="9999-12-31"
              value={getDate}
              onChange={(e) => Dateset(e.target.value)}
            />
          </div>
          {/* テーブルを表示 */}
          <div className="check">
            <table className='check'>
              <thead>
                <tr>
                  <th>店舗名</th>
                  <th>処理状況</th>
                </tr>
              </thead>
              <tbody>
                {Listload ? (
                  <tr>
                    <td colSpan={2} style={{overflow: 'hidden'}}>
                      <MoonLoader loading={Listload} color="blue" />
                    </td>
                  </tr>
                ) : (
                  checkresult.map((row, index) => (
                    <tr key={index}>
                      <td className='PCstoreName'>{row.storeName}</td>
                      <td className='PCprocess'>{row.process}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div style={{padding: 20, position: 'sticky', top: 60}}>
          <div>
            {/* <div className='operation_area'>
              <a className="buttonUnderline" type="button" onClick={() => setDialogOpen(true)}>
                発注区切
              </a>
              <DeadLineDialog
                title="確認"
                message={message}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                isOpen={isDialogOpen}
              />
            </div> */}
            <div className="print-set-area">
              <div className="explanation" style={{color: 'red'}}>
                印刷の際は余白をデフォルトにしてください
              </div>
              <div className="print-select-area">
                <div className="order-print">
                  <div>
                    <div className="title-explanation" style={{color: 'white', textAlign: 'center'}}>納品書印刷</div>
                    <Select
                      className="store-select"
                      placeholder="店舗選択"
                      isSearchable={false}
                      value={storeSelect}
                      onChange={(e) => setStoreSelect(e)}
                      options={selectOptions}
                    />
                  </div>
                  <Button variant="outlined" onClick={IndividualPrint}>個別印刷</Button>
                  <Button variant='outlined' onClick={casePrint}>全未印刷</Button>
                  <Button variant='outlined' onClick={handleallPrint}>全印刷</Button>
                </div>
                <div className="order-print-vendor">
                  <div>
                    <div className="title-explanation" style={{color: 'white', textAlign: 'center'}}>業者への発注書印刷</div>
                    <Select
                      className="store-select"
                      placeholder="業者選択"
                      isSearchable={false}
                      value={vendorSelect}
                      onChange={(e) => setVendorSelect(e)}
                      options={VendorList}
                      // menuPlacement="auto"
                      // menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                    />
                  </div>
                  <div>
                    <Select
                      className="store-select"
                      placeholder="配送先選択"
                      isSearchable={false}
                      value={addressSelect}
                      onChange={(e) => setAdoressSelect(e)}
                      options={AddressList}
                      // menuPlacement="auto"
                      // menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                    />
                  </div>
                  <Button variant='outlined' onClick={VendorOrderData}>取得</Button>
                  <Button variant='outlined' onClick={VendorPrint}>印刷</Button>
                  {/* <a className="buttonUnderline" type="button" onClick={VendorPrint}>
                    業者発注印刷
                  </a> */}
                </div>
              </div>
            </div>
          </div>
          <div style={{display: 'flex', margin: '0px 10px'}}>
            <div
              style={{
                display: 'flex',
                flexFlow: 'column',
                minWidth: 160,
                padding: 5,
                border: '1px solid black'
              }}
            >
              <div style={{textAlign: 'center', color: 'white'}}>ネット発注用</div>
              <Button variant='outlined' onClick={() => console.log('ネット発注分印刷')}>
                通常商品印刷
              </Button>
              <Button variant='outlined' onClick={() => console.log('詳細印刷')}>
                詳細印刷
              </Button>
              <Button variant='outlined' onClick={() => console.log('商品一覧外印刷')}>
                商品一覧外印刷
              </Button>
            </div>
            <div
              style={{
                display: 'flex',
                flexFlow: 'column',
                minWidth: 160,
                padding: 5,
                border: '1px solid black'
              }}
            >
              <div></div>
            </div>
          </div>
          
        </div>
        
        <div>

        </div>
      </div>
    </div>
  );
}

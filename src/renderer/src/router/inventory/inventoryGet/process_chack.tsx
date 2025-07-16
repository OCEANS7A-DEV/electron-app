import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import '../../../css/process_check.css'
import LinkBaner from '../../../comp/Linkbanar'
import toast, { Toaster } from 'react-hot-toast'
import { Button } from '@mui/material'
import MoonLoader from 'react-spinners/MoonLoader'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs, { Dayjs } from 'dayjs'
import 'dayjs/locale/ja'

dayjs.locale('ja')


type CheckResultItem = {
  process: string
  storeName: string
  // 必要に応じて他のフィールドも
}


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



export default function HQPage() {
  const [checkresult, setCheckResult] = useState([])
  const [storeSelect, setStoreSelect] = useState<SelectOption | null>(null)
  const [selectOptions, setSelectOptions] = useState<SelectOption[]>([])
  const [getDate, setGetDate] = useState('')
  const [vendorSelect, setVendorSelect] = useState<SelectOption | null>(null)
  const [VendorList, setVendorList] = useState<SelectOption[]>([])
  const [AddressList, setAddressList] = useState<SelectOption[]>([])
  const [addressSelect, setAdoressSelect] = useState<SelectOption | null>(null)
  const [orderData, setOrderData] = useState([])
  const [Listload, setListload] = useState(false)
  const [dateValue, setDateValue] = useState<Dayjs | null>(null)


  useEffect(() => {
    const init = async () => {
      const nearestMondayStr = await sessionStorage.getItem('printDate')
      if (nearestMondayStr){
        setDateValue(dayjs(nearestMondayStr))
      } else {
        setDateValue(dayjs())
      }
    };
    init();
  }, []);

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
    })

  
    const storenames: SelectOption[] = stores
      .filter(item => item[1] !== '')
      .map(item => ({
        value: item[0],
        label: item[0]
      }))
    setSelectOptions(storenames);
  };
  


  const PrintProcessList = async () => {
    try{
      setListload(true)
      const Date = dateValue?.format('YYYY-MM-DD')
      const ordersGet = await window.myInventoryAPI.ListGet({sheetName: '店舗へ', action: 'InputDataGet', ranges: 'A2:M'})
      const storeData = await window.myInventoryAPI.ListGet({sheetName: 'その他一覧', action: 'ListGet', ranges: 'A2:B'})
      const storefilter = storeData.filter(item => item[1] !== '')
      const storeList = storefilter.map(item => item[0])
      const filterd = ordersGet.filter(row => isoToJstYMD(row[0]) == Date)
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
    } catch (error){
      toast(
        `${error}`,
        {
          duration: 6000,
        }
      )
    } finally {
      setListload(false)
    }
  };



  


  useEffect(() => {
    StoresGet()
    OceanListGet()
  }, [])

  useEffect(() => {
    setGetDate(dateValue?.format('YYYY-MM-DD') ?? "")
    if (dateValue?.format('YYYY-MM-DD')){
      PrintProcessList()
    }
  }, [dateValue])



  const VendorPrint = async () => {
    if (!addressSelect || !vendorSelect) {
      toast.error('業者の選択、もしくは配送先の選択がされていません。')
      return
    }
    const setdate = getDate
    const Vendorparams = new URLSearchParams();
    Vendorparams.set("date", setdate);
    sessionStorage.setItem('printDate', getDate)
    Vendorparams.set("address", addressSelect.value);
    Vendorparams.set("vendor",vendorSelect.value)

    if (vendorSelect.value == '大洋商会') {
      window.myInventoryAPI.orderPrint(`taiyo?${Vendorparams.toString()}`)
    } else {
      window.myInventoryAPI.orderPrint(`VendorPrint?${Vendorparams.toString()}`)
    }
  }



  const VendorOrderData = async () => {
    const data = await window.myInventoryAPI.ListGet({sheetName: '在庫一覧', action: 'TotallingGet', ranges: 'A2:M'})
    const filterdata = data.filter(item => item[12] < 0)
    console.log(data)
    console.log(filterdata)
    console.log(VendorList)
  }

  const casePrint = async () => {
    const setDate = new Date(getDate).toLocaleDateString()
    const stores = checkresult.filter((item: CheckResultItem) => item.process !== '未注文' && item.process !== '印刷済' && item.process !== '注文無')
    const orderresult = stores.map((row: CheckResultItem) => {
      const filterData = orderData.filter(item => item[1] == row.storeName)
      return filterData
    })
    if(orderresult.length === 0){
      toast.error('印刷できるデータがありません')
      return
    }

    const updataStore = stores.map((row: CheckResultItem) => row.storeName)
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
    sessionStorage.setItem('printDate', getDate)
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

    await window.myInventoryAPI.storeSet('printData', JSON.stringify(filterData))
    await window.myInventoryAPI.storeSet('printDate', setDate)
    sessionStorage.setItem('printDate', getDate)

    window.myInventoryAPI.orderPrint('PrintContent');
    window.myInventoryAPI.DataInsert({
      sheetName: '店舗へ',
      action: 'PrintcellUpdate',
      sub_action: 'insert',
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
      .filter((row: CheckResultItem) => !['注文無', '未注文'].includes(row.process))
      .map((row: CheckResultItem) => row.storeName);
    if(orderData.length === 0){
      toast.error('印刷できるデータがありません')
      return
    }
    const filterd = orderData.filter(row => updataStore.includes(row[1]))
    const setdata = JSON.stringify(filterd)
    await window.myInventoryAPI.storeSet('printData', setdata)
    await window.myInventoryAPI.storeSet('printDate', getDate)
    sessionStorage.setItem('printDate', getDate)
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
  }

  const nomalPrint = () => {
    window.myInventoryAPI.orderPrint('NetEtcPrint')
  }

  const NotListed = () => {
    const Vendorparams = new URLSearchParams();
    Vendorparams.set("date", getDate);
    window.myInventoryAPI.orderPrint(`NotListed?${Vendorparams.toString()}`)
  }


  const DetailsPrint = async() => {
    const setdate = getDate
    const Vendorparams = new URLSearchParams()
    Vendorparams.set("date", setdate)

    await window.myInventoryAPI.storeSet('printData', JSON.stringify(orderData))
    await window.myInventoryAPI.storeSet('printDate', setdate)
    window.myInventoryAPI.orderPrint(`OrderDetails`)
  }

  return (
    <div className='check_window'>
      <Toaster />
      <div className="banner">
        <LinkBaner id="zaiko"/>
      </div>
      <div className="chack_etc">
        <div className="check_area">
          <div className="check_set">
            <Button variant="outlined" onClick={() => PrintProcessList()}>取得</Button>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ja">
              <DatePicker
                slotProps={{
                  textField: {
                    size: 'small',
                    fullWidth: true,
                    sx: {
                      fontSize: '1rem',
                      '& input': {
                        height: '1.5em',
                      },
                      width: '150px',
                    },
                  },
                }}
                value={dateValue}
                onChange={(e) => setDateValue(e)}
              />
            </LocalizationProvider>
          </div>
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
                  checkresult.map((row: CheckResultItem, index) => (
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
        <div style={{ padding: 20, position: 'sticky', top: 60 }}>
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
              <Button variant='outlined' onClick={() => nomalPrint()}>
                通常商品印刷
              </Button>
              <Button variant='outlined' onClick={() => DetailsPrint()}>
                詳細印刷
              </Button>
              <Button variant='outlined' onClick={() => NotListed()}>
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

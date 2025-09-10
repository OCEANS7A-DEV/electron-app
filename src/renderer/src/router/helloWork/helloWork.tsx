import React, { useEffect, useState, useRef } from 'react'
import type { JSX } from 'react'
import LinkBaner from '../../comp/Linkbanar'
import '../../css/HelloWork.css'
import { useLoaderData } from 'react-router-dom'
import { Button, TextField } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import toast, { Toaster } from 'react-hot-toast'

interface Works {
  こだわり条件: string[]
  事業所名: string
  仕事の内容: string
  休日: string
  公開範囲: string
  受付年月日: string
  就業場所: string
  就業時間: string
  年齢: string
  求人区分: string
  求人番号: string
  求人票URL: string
  紹介期限日: string
  職種: string
  '賃金（手当等を含む）': string
  雇用形態: string
  status: string
  address: string
}

export const loader = async () => {
  const works = []
  return { works }
}

export default function HelloWork(): JSX.Element {
  const { works } = useLoaderData<typeof loader>()
  const [loading, setLoading] = React.useState(true)
  const [allPDFNum, setAllPDFNum] = useState(0)
  const allPDFNumRef = useRef(allPDFNum)
  const [DLnums, setDLnums] = useState(0)
  const [jobList, setJobList] = useState<Works[]>([])
  const [isOtpModalVisible, setOtpModalVisible] = useState(false)
  const [otpValue, setOtpValue] = useState('')

  const [publicNum, setPublicNum] = useState(0)
  const [standByNum, setStandByNum] = useState(0)
  //console.log(jobList)

  const start = (): void => {
    const PDFnums = works.length
    setAllPDFNum(PDFnums)
    setJobList(works)
  }

  useEffect(() => {
    allPDFNumRef.current = allPDFNum
  }, [allPDFNum])

  const PDFGet = async (): Promise<void> => {
    setLoading(true)
    setDLnums(0)
    const filterdata = jobList.filter((item) => item.status == '公開中')
    await window.myInventoryAPI.HelloWorkPDFGet(filterdata)
  }

  useEffect(() => {
    setAllPDFNum(jobList.length)
    setPublicNum(jobList.filter((item) => item.status == '公開中').length)
    setStandByNum(jobList.filter((item) => item.status == 'ハローワーク確認中').length)
    toast.success(`取得した求人数:${jobList.length}`)
  }, [jobList])

  useEffect(() => {
    start()
  }, [])

  useEffect(() => {
    const progressHandler = (data: {
      count: number
      total: number
      error?: string
      success?: string
      url?: string
    }): void => {
      if (data.success) {
        toast.success(`進捗: ${data.count}/${data.total}`)
      } else {
        toast.error(`求人番号:${data.error}のDLに失敗しました`)
      }
      setDLnums(data.count)
      setAllPDFNum(data.total)
      if (!loading) {
        setLoading(true)
      }
      if (data.count === data.total) {
        setLoading(false)
        setDLnums(0)
      }
    }
    window.myInventoryAPI.onHelloWorkProgress(progressHandler)
    return () => {
      window.myInventoryAPI.removeHelloWorkProgress()
    }
  }, [])

  useEffect(() => {
    const showOtpPromptHandler = (): void => {
      setOtpModalVisible(true)
    }
    window.myInventoryAPI.onShowOtpPrompt(showOtpPromptHandler)
    return () => {
      window.myInventoryAPI.removeShowOtpPromptListener()
    }
  }, [])
  useEffect(() => {
    initcode()
  }, [])

  const initcode = async (): Promise<void> => {
    const init = async () => {
      await window.myInventoryAPI.helloworkInit()
    }
    await toast.promise(
      init(),
      {
        loading: 'ログイン中',
        success: () => {
          setLoading(false)
          return 'ログイン成功'
        },
        error: () => {
          setLoading(false)
          return 'ログイン失敗'
        }
      }
    )
    workResearch('初期取得中...')
  }

  const handleOtpSubmit = (): void => {
    window.myInventoryAPI.sendOtp(otpValue)
    setOtpValue('')
    setOtpModalVisible(false)
  }

  const Research = async (): Promise<void> => {
    const result = await window.myInventoryAPI.WorkGet()
    setJobList(result[1])
  }

  const JOBupdateStatus = (dateString) => {
    if (!dateString || dateString == '') {
      return '更新不要'
    }
    const formattedString = dateString.replace(/年|月/g, '-').replace(/日/g, '')
    const limitDate = new Date(formattedString)
    if (isNaN(limitDate.getTime())) {
      return '更新不要'
    }
    limitDate.setDate(limitDate.getDate() - 10)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return today >= limitDate ? '更新可能' : '更新不要'
  }

  const WorksUpdate = async (num) => {
    setLoading(true)
    const update = async () => {
      const getdata = await window.myInventoryAPI.ListGet({
        sheetName: '履歴',
        action: 'StaffGet',
        sheetid: '1pRCJyZEI14EUoqNiF2SORoL5gawCI9PyRK7td6ygOQo'
      })
      const now = new Date()
      const searchDate = `${now.getFullYear()}/${now.getMonth() + 1}`
      const targetData = (date) => {
        const tDate = new Date(date)
        return `${tDate.getFullYear()}/${tDate.getMonth() + 1}`
      }
      const helloworkHistory = getdata.filter(
        (item) =>
          item[1] == 'hellowork' &&
          targetData(item[0]) == searchDate
      )
      const UpdatedNumbers = helloworkHistory.map((item) => item[2])
      const data = jobList.find((item) => item.求人番号 == num)
      if (data) {
        const status = JOBupdateStatus(data.紹介期限日)
        if (status == '更新可能' && !UpdatedNumbers.includes(num)) {
          await window.myInventoryAPI.helloworkUpdate([num])
        } else {
          return '更新不要'
        }
      }
      const updateLogInsert = [new Date().toLocaleString(), 'hellowork', num]
      await window.myInventoryAPI.DataInsert({
        action: 'KyujinLog',
        sub_action: 'insert',
        data: updateLogInsert
      })
      return '更新完了'
    }

    toast.promise(update(), {
      loading: '更新中…',
      success: (result) => {
        setLoading(false)
        return result
      },
      error: () => {
        setLoading(false)
        return 'エラーが発生しました'
      }
    })
  }

  const allUpdate = async () => {
    setLoading(true)
    const update = async () => {
      const getdata = await window.myInventoryAPI.ListGet({
        sheetName: '履歴',
        action: 'StaffGet',
        sheetid: '1pRCJyZEI14EUoqNiF2SORoL5gawCI9PyRK7td6ygOQo'
      })
      const now = new Date()
      const searchDate = `${now.getFullYear()}/${now.getMonth() + 1}`
      const targetData = (date) => {
        const tDate = new Date(date)
        return `${tDate.getFullYear()}/${tDate.getMonth() + 1}`
      }
      const helloworkHistory = getdata.filter(
        (item) =>
          item[1] == 'hellowork' &&
          targetData(item[0]) == searchDate
      )
      const UpdatedNumbers = helloworkHistory.map((item) => item[2])
      const updatas = jobList.filter((item) => JOBupdateStatus(item.紹介期限日) == '更新可能')
      const stillUpdatas = updatas.filter((item) => !UpdatedNumbers.includes(item.求人番号))
      const targets = stillUpdatas.map((item) => item.求人番号)
      if (targets.length === 0 || updatas.length === 0) {
        return '更新可能な求人はありません'
      }
      const updateLogInsert = targets.map((item) => {
        return [new Date().toLocaleString(), 'hellowork', item]
      })
      await window.myInventoryAPI.helloworkUpdate(targets)
      await window.myInventoryAPI.DataInsert({
        action: 'KyujinLog',
        sub_action: 'insert',
        data: updateLogInsert
      })
      return '更新完了'
    }
    toast.promise(update(), {
      loading: '更新中…',
      success: (result) => {
        setLoading(false)
        return result
      },
      error: () => {
        setLoading(false)
        return 'エラーが発生しました'
      }
    })
  }

  const workResearch = (name): void => {
    setLoading(true)
    toast.promise(Research(), {
      loading: `${name}`,
      success: () => {
        setLoading(false)
        return '取得完了'
      },
      error: () => {
        setLoading(false)
        return 'エラーが発生しました'
      }
    })
  }

  const storeName = (name: string): string => {
    const afterNewline = name
      .split(/\r?\n/)
      .filter((line) => line.trim() !== '')
      .pop()!
      .trim()
    return afterNewline
  }

  const handlePDFMarge = async (): Promise<void> => {
    await window.myInventoryAPI.PDFMarge()
  }


  return (
    <div className="HelloWorkWindow">
      <div className="banner">
        <LinkBaner id="helloWork" />
        <Toaster />
      </div>
      {isOtpModalVisible && (
        <div className="otp-modal-overlay" style={{ display: 'flex', zIndex: 10 }}>
          <div className="otp-modal-content">
            <p>ハローワークからGメールへ届いたワンタイムパスワードを入力してください。</p>
            <div className="otp-input-area">
              <TextField
                label="ワンタイムパスワード"
                value={otpValue}
                onChange={(e) => setOtpValue(e.target.value)}
                className="otp-input"
              />
              <Button
                variant="contained"
                onClick={handleOtpSubmit}
                className="otp-submit-btn"
              >
                送信
              </Button>
            </div>
          </div>
        </div>
      )}
      <div className="HelloWorkMainArea">
        <div className="ButtonArea">
          <Button variant="outlined" onClick={() => workResearch('再取得中...')} loading={loading}>
            再取得
          </Button>
          {jobList.length !== 0 ? (
            <Button variant="outlined" onClick={PDFGet} loading={loading}>
              PDFGet
            </Button>
          ) : (
            <Button variant="outlined" onClick={PDFGet} loading={loading} disabled>
              PDFGet
            </Button>
          )}
          <Button variant="outlined" onClick={handlePDFMarge}>
            PDF結合
          </Button>
          <Button variant="outlined" onClick={allUpdate} loading={loading}>
            一括更新
          </Button>
        </div>
        <div className="HelloWorkProgress">
          {loading && (
            <div>
              <CircularProgress variant="determinate" value={(DLnums / allPDFNum) * 100} />
            </div>
          )}
        </div>
        <div className="HelloWorkNumStatus">
          <div>公開中求人数: {publicNum}</div>
          <div>更新待ち: {standByNum}</div>
        </div>
        <div style={{ color: 'white', paddingBottom: 20, minWidth: 1100 }}>
          <div>フルタイム</div>
          <table className="fullTime">
            <thead>
              <tr>
                <td className="HelloType">職種</td>
                <td className="HelloWhere">就業場所</td>
                <td className="HelloLimit">紹介期限</td>
                <td className="HelloStatus">ステータス</td>
              </tr>
            </thead>
            <tbody>
              {jobList
                .filter((item) => item.求人区分 == 'フルタイム' && item.status == '公開中')
                .map((row, index) => (
                  <tr key={index}>
                    <td className="HelloType">{row.職種}</td>
                    <td className="HelloWhere">{storeName(row.address)}</td>
                    <td className="HelloLimit">{row.紹介期限日}</td>
                    <td>{row.status}</td>
                    <td className="HelloLimitStatus">{JOBupdateStatus(row.紹介期限日)}</td>
                    <td>
                      <Button variant="outlined" onClick={() => WorksUpdate(row.求人番号)}>
                        求人更新
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <div style={{ marginTop: 20 }}>パート</div>
          <table className="fullTime">
            <thead>
              <tr>
                <td className="HelloType">職種</td>
                <td className="HelloWhere">就業場所</td>
                <td className="HelloLimit">紹介期限</td>
                <td className="HelloStatus">ステータス</td>
              </tr>
            </thead>
            <tbody>
              {jobList
                .filter((item) => item.求人区分 == 'パート' && item.status == '公開中')
                .map((row, index) => (
                  <tr key={index}>
                    <td className="HelloType">{row.職種}</td>
                    <td className="HelloWhere">{storeName(row.address)}</td>
                    <td className="HelloLimit">{row.紹介期限日}</td>
                    <td>{row.status}</td>
                    <td className="HelloLimitStatus">{JOBupdateStatus(row.紹介期限日)}</td>
                    <td>
                      <Button variant="outlined" onClick={() => WorksUpdate(row.求人番号)}>
                        求人更新
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <div style={{ marginTop: 20 }}>その他</div>
          <table className="fullTime">
            <thead>
              <tr>
                <td className="HelloType">職種</td>
                <td className="HelloWhere">就業場所</td>
                <td className="HelloLimit">紹介期限</td>
                <td className="HelloStatus">ステータス</td>
                <td>求人区分</td>
              </tr>
            </thead>
            <tbody>
              {jobList
                .filter((item) => item.求人区分 !== 'パート' && item.求人区分 !== 'フルタイム' && item.status == '公開中')
                .map((row, index) => (
                  <tr key={index}>
                    <td className="HelloType">{row.職種}</td>
                    <td className="HelloWhere">{storeName(row.address)}</td>
                    <td className="HelloLimit">{row.紹介期限日}</td>
                    <td>{row.status}</td>
                    <td>{row.求人区分}</td>
                    <td className="HelloLimitStatus">{JOBupdateStatus(row.紹介期限日)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
          <div style={{ marginTop: 20 }}>更新待機(フルタイム)</div>
          <table className="fullTime">
            <thead>
              <tr>
                <td className="HelloType">職種</td>
                <td className="HelloWhere">就業場所</td>
                <td className="HelloStatus">ステータス</td>
              </tr>
            </thead>
            <tbody>
              {jobList
                .filter((item) => item.求人区分 == 'フルタイム' && item.status == 'ハローワーク確認中')
                .map((row, index) => (
                  <tr key={index}>
                    <td className="HelloType">{row.職種}</td>
                    <td className="HelloWhere">{storeName(row.address)}</td>
                    <td>{row.status}</td>
                  </tr>
                ))}
            </tbody>
          </table>
          <div style={{ marginTop: 20 }}>更新待機(パート)</div>
          <table className="fullTime">
            <thead>
              <tr>
                <td className="HelloType">職種</td>
                <td className="HelloWhere">就業場所</td>
                <td className="HelloStatus">ステータス</td>
              </tr>
            </thead>
            <tbody>
              {jobList
                .filter((item) => item.求人区分 == 'パート' && item.status == 'ハローワーク確認中')
                .map((row, index) => (
                  <tr key={index}>
                    <td className="HelloType">{row.職種}</td>
                    <td className="HelloWhere">{storeName(row.address)}</td>
                    <td>{row.status}</td>
                  </tr>
                ))}
            </tbody>
          </table>
          <div style={{ marginTop: 20 }}>更新待機(その他)</div>
          <table className="fullTime">
            <thead>
              <tr>
                <td className="HelloType">職種</td>
                <td className="HelloWhere">就業場所</td>
                <td className="HelloStatus">ステータス</td>
              </tr>
            </thead>
            <tbody>
              {jobList
                .filter((item) => item.求人区分 !== 'パート' && item.求人区分 !== 'フルタイム' && item.status == 'ハローワーク確認中')
                .map((row, index) => (
                  <tr key={index}>
                    <td className="HelloType">{row.職種}</td>
                    <td className="HelloWhere">{storeName(row.address)}</td>
                    <td>{row.status}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

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
  const [loading, setLoading] = React.useState(false)
  const [allPDFNum, setAllPDFNum] = useState(0)
  const allPDFNumRef = useRef(allPDFNum)
  const [DLnums, setDLnums] = useState(0)
  const [jobList, setJobList] = useState<Works[]>([])
  const [isOtpModalVisible, setOtpModalVisible] = useState(false)
  const [otpValue, setOtpValue] = useState('')

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
    await window.myInventoryAPI.HelloWorkPDFGet(jobList)
  }

  useEffect(() => {
    setAllPDFNum(jobList.length)
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
    // 1. 入力値が空やnullの場合は、安全に処理を終了する
    if (!dateString) {
      return '更新不要'
    }

    const formattedString = dateString.replace(/年|月/g, '-').replace(/日/g, '')
    const limitDate = new Date(formattedString)

    // 2. 文字列から有効な日付が生成できなかった場合は、処理を終了する
    if (isNaN(limitDate.getTime())) {
      return '更新不要' // 無効な日付の場合は更新不要とする
    }

    // 10日前の日付を計算
    limitDate.setDate(limitDate.getDate() - 10)

    // 3. 今日の日付の「時刻」をリセットして、純粋な日付で比較する
    const today = new Date()
    today.setHours(0, 0, 0, 0) // 時、分、秒、ミリ秒を0に設定

    // 比較して結果を返す
    return today >= limitDate ? '更新可能' : '更新不要'
  };

  const workResearch = (): void => {
    setLoading(true)
    toast.promise(Research(), {
      loading: '読み込み中…',
      success: () => {
        setLoading(false)
        return '読み込み完了'
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
          <Button variant="outlined" onClick={workResearch} loading={loading}>
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
        </div>
        <div className="HelloWorkProgress">
          {loading && (
            <div>
              <CircularProgress variant="determinate" value={(DLnums / allPDFNum) * 100} />
            </div>
          )}
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
                .filter((item) => item.求人区分 == 'フルタイム')
                .map((row, index) => (
                  <tr key={index}>
                    <td className="HelloType">{row.職種}</td>
                    <td className="HelloWhere">{storeName(row.address)}</td>
                    <td className="HelloLimit">{row.紹介期限日}</td>
                    <td>{row.status}</td>
                    <td>{JOBupdateStatus(row.紹介期限日)}</td>
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
                .filter((item) => item.求人区分 == 'パート')
                .map((row, index) => (
                  <tr key={index}>
                    <td className="HelloType">{row.職種}</td>
                    <td className="HelloWhere">{storeName(row.address)}</td>
                    <td className="HelloLimit">{row.紹介期限日}</td>
                    <td>{row.status}</td>
                    <td>{JOBupdateStatus(row.紹介期限日)}</td>
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
                .filter((item) => item.求人区分 !== 'パート' && item.求人区分 !== 'フルタイム')
                .map((row, index) => (
                  <tr key={index}>
                    <td className="HelloType">{row.職種}</td>
                    <td className="HelloWhere">{storeName(row.address)}</td>
                    <td className="HelloLimit">{row.紹介期限日}</td>
                    <td>{row.status}</td>
                    <td>{row.求人区分}</td>
                    <td>{JOBupdateStatus(row.紹介期限日)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

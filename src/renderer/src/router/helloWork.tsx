import React, { useEffect, useState, useRef } from 'react'
import LinkBaner from '../comp/Linkbanar'
import '../css/HelloWork.css'
import { useLoaderData } from "react-router-dom"
//import puppeteer from "puppeteer"
import { Button } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import toast, { Toaster } from 'react-hot-toast';


interface Works {
  'こだわり条件': any[];
  '事業所名': string;
  '仕事の内容': string;
  '休日': string;
  '公開範囲': string;
  '受付年月日': string;
  '就業場所': string;
  '就業時間': string;
  '年齢': string;
  '求人区分': string;
  '求人番号': string;
  '求人票URL': string;
  '紹介期限日': string;
  '職種': string;
  '賃金（手当等を含む）': string;
  '雇用形態': string;
}




export const loader = async() => {
  //const works = await window.myInventoryAPI.WorkGet()
  const works = []
  return { works }
};

export default function HelloWork() {
  const { works } = useLoaderData<typeof loader>()
  const [loading, setLoading] = React.useState(false);
  const [allPDFNum, setAllPDFNum] = useState(0)
  const allPDFNumRef = useRef(allPDFNum)
  const [DLnums, setDLnums] = useState(0)
  const [jobList, setJobList] = useState<Works[]>([])

  const start = () => {
    const PDFnums = works.length
    setAllPDFNum(PDFnums)
    setJobList(works)
  }

  useEffect(() => {
    allPDFNumRef.current = allPDFNum
  }, [allPDFNum])

  const PDFGet = async() => {
    setLoading(true)
    setDLnums(0)
    await window.myInventoryAPI.HelloWorkPDFGet(jobList);
  }

  useEffect(() => {
    setAllPDFNum(jobList.length)
    console.log(jobList)
    toast.success(`取得した求人数:${jobList.length}`)
  }, [jobList])


  useEffect(() => {
    start()
  },[])

  useEffect(() => {
    const progressHandler = (data: { count: number; total: number; error?: string; success?: string }) => {
      
      if (data.success) {
        toast.success(`進捗: ${data.count}/${data.total}`)
      } else {
        toast.error(`求人番号:${data.error}のDLに失敗しました`)
      }
      setDLnums(data.count)
      setAllPDFNum(data.total)
      if (!loading){
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


  const workResearch = async () => {
    setLoading(true)
    const result = await window.myInventoryAPI.WorkGet()
    setJobList(result)
    setLoading(false)
  }

  

  


  return(
    <div className="HelloWorkWindow">
      <div className="banner">
        <LinkBaner/>
        <Toaster />
      </div>
      <div className="HelloWorkMainArea">
        <div className="ButtonArea">
          <Button variant="outlined" onClick={workResearch} loading={loading}>再取得</Button>
          {jobList.length !== 0 ? (
            <Button variant="outlined" onClick={PDFGet} loading={loading}>PDFGet</Button>
          ) : (
            <Button variant="outlined" onClick={PDFGet} loading={loading} disabled>PDFGet</Button>
          )}
        </div>
        <div className="HelloWorkProgress">
          {loading && (
            <div>
              <CircularProgress variant="determinate" value={(DLnums / allPDFNum) * 100} />
            </div>
          )}
        </div>
        <div style={{color: 'white', padding: 20}}>
          <div>フルタイム</div>
          <table className="fullTime">
            <thead>
              <tr>
                <td className="HelloType">職種</td>
                <td className="HelloWhere">就業場所</td>
                <td className="HelloLimit">紹介期限</td>
              </tr>
            </thead>
            <tbody>
              {jobList.filter(item => item.求人区分 == 'フルタイム').map((row,index) => (
                <tr key={index}>
                  <td className="HelloType">{row.職種}</td>
                  <td>{row.就業場所}</td>
                  <td>{row.紹介期限日}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{marginTop: 20}}>パート</div>
          <table className="fullTime">
            <thead>
              <tr>
                <td className="HelloType">職種</td>
                <td className="HelloWhere">就業場所</td>
                <td className="HelloLimit">紹介期限</td>
              </tr>
            </thead>
            <tbody>
              {jobList.filter(item => item.求人区分 == 'パート').map((row,index) => (
                <tr key={index}>
                  <td className="HelloType">{row.職種}</td>
                  <td>{row.就業場所}</td>
                  <td>{row.紹介期限日}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}




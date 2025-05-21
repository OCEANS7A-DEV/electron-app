import { useLoaderData } from "react-router-dom";
// import { ListGet } from '../backend/Server_end';
import LinkBaner from '../comp/Linkbanar';
// import { TableRow } from "@mui/material";
import '../css/netOrder.css';
import React, { useState, useEffect } from 'react'
import { DataGrid, GridColDef } from '@mui/x-data-grid';


const columns: GridColDef[] = [
  { field: 'name', headerName: '業者名', minWidth: 180 },
  { field: 'link', headerName: 'URL', flex: 1, renderCell: (params) => params.value },
];




export const loader = async() => {
  const URLs = await window.myInventoryAPI.ListGet({sheetName: 'ネット発注', action: 'ListGet', ranges: 'A2:B'})
  return URLs;
};

export default function NETOrder() {
  const loaderData = useLoaderData();
  
  const [rows, setRows] = useState([])


  useEffect(() => {
    //console.log(loaderData)
    const pushData = loaderData.map((item,index) => {
      const result = {
        id: index,
        name: item[0],
        link: (
          <a href={item[1]} target="_blank">{item[1]}</a>
        )
      }
      return result
    })
    setRows(pushData)
  },[loaderData])





  return(
    <div className="NetOrderLinkWindow">
      <div className="banner">
        <LinkBaner/>
      </div>
      <div className="NetOrderLinkArea">
        <div className="NetOrderLinkTitle">ネット発注リンク一覧</div>
        <DataGrid
          rows={rows}
          columns={columns}
        />        
      </div>
    </div>
  );
}
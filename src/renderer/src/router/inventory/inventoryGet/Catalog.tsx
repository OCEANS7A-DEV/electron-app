
import { Select, MenuItem, TextField, Button } from '@mui/material';
import React, { useEffect, useState, useRef } from 'react';
import LinkBaner from '../../../comp/Linkbanar'

export default function CatalogView() {
  const [fileSelect, setFileSelect] = useState<{ value: string; label: string }[]>([]);
  const [selectFileName, setSelectFileName] = useState('')
  const [Filepath, setFilePath] = useState('')
  const [searchText, setSearchText] = useState('');
  const webviewRef = useRef<any>(null);
  

  const FilePath = async() => {
    const pathName = await window.myInventoryAPI.getFilePath(selectFileName)
    setFilePath(pathName)
  }

  useEffect(() => {
    const fetchFiles = async () => {
      const result = await window.myInventoryAPI.getFileList()
      const mapping = result.map((item: string) => ({
        value: item,
        label: item,
      }));
      setFileSelect(mapping)
    };
    fetchFiles();
  }, []);

  useEffect(() => {
    FilePath()
  }, [selectFileName])

  
  const handleFind = () => {
    if (webviewRef.current && searchText) {
      webviewRef.current.findInPage(searchText);
    }
  };

  const handleFindNext = () => {
    if (webviewRef.current && searchText) {
      webviewRef.current.findInPage(searchText, { findNext: true });
    }
  };

  const handleFindPrevious = () => {
    if (webviewRef.current && searchText) {
      webviewRef.current.findInPage(searchText, { findNext: true, forward: false });
    }
  };

  const handleStopFind = () => {
    if (webviewRef.current) {
      webviewRef.current.stopFindInPage('clearSelection');
    }
  };
  
  return (
    <div style={{ display: 'flex', flex: 1, flexFlow: 'column', height: '100%' }}>
      <div>
        <LinkBaner />
      </div>
      <div style={{color: 'white'}}>
        <div>{selectFileName}</div>
        <div style={{ paddingTop: 100 }}>
          <Select
            style={{ width: 200, backgroundColor: 'white' }}
            value={selectFileName}
            onChange={(e) => setSelectFileName(e.target.value)}
          >
            <MenuItem value="選択なし">
              <em>選択なし</em>
            </MenuItem>
            {fileSelect.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </div>
      </div>
      <div style={{ marginTop: 32, flex: 1 }}>
        <div style={{ marginBottom: 12, display: 'flex', gap: 8 }}>
          <TextField
            label="検索"
            variant="outlined"
            size="small"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ backgroundColor: 'white' }}
          />
          <Button variant="contained" onClick={handleFind}>検索</Button>
          <Button variant="outlined" onClick={handleFindNext}>次へ</Button>
          <Button variant="outlined" onClick={handleFindPrevious}>前へ</Button>
          <Button variant="text" onClick={handleStopFind}>ハイライト解除</Button>
        </div>
        <div style={{ height: 'calc(100% - 60px)' }}>
          <webview
            ref={webviewRef}
            src={`file://${Filepath}`}
            style={{ height: '100%', border: '1px solid gray' }}
          />
        </div>
      </div>
    </div>
  );
}

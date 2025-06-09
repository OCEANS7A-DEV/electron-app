
import { Select, MenuItem } from '@mui/material';
import React, { useEffect, useState } from 'react';
import LinkBaner from '../comp/Linkbanar'

export default function CatalogView() {
  const [files, setFiles] = useState<string[]>([]);
  const [fileSelect, setFileSelect] = useState<{ value: string; label: string }[]>([]);
  const [selectFileName, setSelectFileName] = useState('')
  const [Filepath, setFilePath] = useState('')
  

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
      setFileSelect(mapping);
      setFiles(result);
    };
    fetchFiles();
  }, []);

  useEffect(() => {
    FilePath()
  },[selectFileName])

  return (
    <div>
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
      <div style={{ marginTop: 32 }}>
        <iframe
          src={`file://${Filepath}`}
          width="100%"
          height="800px"
        />
      </div>
    </div>
  );
}

import React, { useState, useCallback, useMemo } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button, TextField } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#2a2a30',
      paper: '#333'
    },
    primary: {
      main: '#90caf9'
    },
    text: {
      primary: '#ffffff'
    }
  }
})

// --- スタイル定義 (変更なし) ---
const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  borderWidth: 2,
  borderRadius: 10,
  borderColor: '#cccccc',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: 'black',
  outline: 'none',
  transition: 'border .24s ease-in-out',
  cursor: 'pointer',
  width: '400px',
};

const activeStyle = {
  borderColor: '#2196f3',
  backgroundColor: '#f0f8ff',
};

// --- コンポーネント本体 ---
const PDFUnlocked = () => {
  // --- State管理 (変更なし) ---
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // --- メインプロセスからの結果を監視 ---

  // --- ファイルがドロップされた時の処理 (変更なし) ---
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const droppedFile = acceptedFiles[0];
      setFile(droppedFile);
      // ドロップ時にメッセージをリセットし、ファイル名を表示
      setStatusMessage(`ファイル: ${droppedFile.name}`);
    }
  }, []);

  // --- react-dropzone の設定 (変更なし) ---
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
  });

  const style = useMemo(() => ({
    ...baseStyle,
    ...(isDragActive ? activeStyle : {}),
  }), [isDragActive]);

  // --- ロック解除ボタンのクリック処理 ---
  // ★★★ 変更点 2 ★★★
  const handleUnlock = async() => {
    if (!file) {
      setStatusMessage('PDFファイルをドラッグ＆ドロップしてください。');
      return;
    }
    if (!password) {
      setStatusMessage('パスワードを入力してください。');
      return;
    }

    setIsProcessing(true);
    setStatusMessage('処理中...');


    try {
      // 1. FileReaderを使ってファイルの中身をArrayBufferとして読み込む
      const arrayBuffer = await file.arrayBuffer();

      // 2. ArrayBufferをNode.jsのBufferに変換
      const fileDataAsUint8Array = new Uint8Array(arrayBuffer)

      // 3. Bufferデータとパスワードをメインプロセスに送信し、結果を待つ
      //    (preload.jsで invoke を使うようにしたので、awaitで直接結果が返ってくる)
      const result = await window.myInventoryAPI.PDFUnlocked(fileDataAsUint8Array, password);

      // 4. 結果をUIに表示
      setStatusMessage(result.message);
      if (result.status === 'success') {
        setFile(null);
        setPassword('');
      }

    } catch (error) {
      console.error('An error occurred:', error);
      setStatusMessage(`エラーが発生しました: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };


  // --- レンダリング (変更なし) ---
  return (
    <div className="PDF-Lock-Remove" style={{ fontFamily: 'sans-serif' }}>
      <h1 style={{ color: 'white', margin: 0 }}>PDFのロック解除</h1>
      <div className="PDF-Lock-Remove-file-Insert-area" {...getRootProps({ style })}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>ここにファイルをドロップ...</p>
        ) : (
          <p>{file ? `選択中: ${file.name}` : 'ここにPDFをドロップ、またはクリックして選択'}</p>
        )}
      </div>
      <div>
        <ThemeProvider theme={darkTheme}>
          <div style={{ margin: '20px 0' }}>
            <TextField
              id="password"
              type="password"
              label="パスワード"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isProcessing}
            />
          </div>
          {isProcessing || !file ? (
            <Button variant="outlined" onClick={handleUnlock} loading={isProcessing}>
              ロック解除
            </Button>
          ) : (
            <Button variant="outlined" onClick={handleUnlock} loading={isProcessing} disabled>
              処理中...
            </Button>
          )}
        </ThemeProvider>
      </div>
      {statusMessage && <p style={{ marginTop: '20px', color: 'white' }}>{statusMessage}</p>}
    </div>
  )
}

export default PDFUnlocked;

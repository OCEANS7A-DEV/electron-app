// .png?asset のインポートを「文字列（パス）」としてTypeScriptに認識させます
declare module '*.png?asset' {
  const src: string
  export default src
}

// electron-prompt に型定義がないため、モジュールとして存在することだけを伝えます
declare module 'electron-prompt';

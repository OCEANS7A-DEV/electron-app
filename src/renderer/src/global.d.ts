// src/global.d.ts

export {}

declare global {
  interface Window {
    myInventoryAPI: {
      PDFUnlocked(data: { fileData: any; password: string; fileName: string }): Promise<any>
      helloworkInit(): Promise<any>
      helloworkUpdate(RecruitNumbers: any): Promise<any>
      PrivateMemoGet(): Promise<any>
      OfficeWorkWindow(): unknown
      SettingWindow(): unknown
      HelloWorkWindow(): unknown
      WindowZaiko(): unknown
      WindowInfoGet(): unknown
      GoogleConfirmation(): unknown
      GoogleLogout(): unknown
      archiveGet(): unknown
      TokenChange(): unknown
      PDFMarge: any
      onHelloWorkProgress(
        progressHandler: (data: { count: number; total: number }) => void
      ): unknown
      removeHelloWorkProgress(): unknown
      isDev: boolean
      UpdaterClose: any
      MainBoot: any
      getFileList: () => Promise<any>
      getFilePath: (filename: string) => Promise<any>
      onCheckedUpdate(arg0: (value: any) => void): unknown
      onProgressUpdate(arg0: (value: any) => void): unknown
      upGrade: any
      onUpdateAvailable(arg0: (flag: any) => void): unknown
      fetchData: () => Promise<any>
      postData: (endpoint: string, payload: any) => Promise<any>
      postDataGet: () => Promise<any>
      filePost: (endpoint: string, payload: any) => Promise<any>
      ListGet: (payload: any) => Promise<any>
      DataInsert: (payload: any) => Promise<any>
      PrivateMemoInsert: (payload: any) => Promise<any>
      PrivateMemoDelete: (payload: any) => Promise<any>
      UuidGet: (payload: any) => Promise<any>
      DetailsData: () => Promise<any>
      ListData: () => Promise<any>
      ListReload: () => Promise<void>
      VendorData: () => Promise<any>
      shortageGet: () => Promise<any>
      PrintReady: () => Promise<any>
      CountListPrint: (fileName: string, folderPath: string) => Promise<any>
      FolderBuild: (folderName: string) => Promise<any>
      NowGet: () => Promise<any>
      WorkGet: () => Promise<any>
      HelloWorkPDFGet: (lists: any) => Promise<void>
      orderPrint: (payload: string) => Promise<void>
      storeSet: (settitle: string, setData: any) => Promise<void>
      storeGet: (gettitle: string) => Promise<any>
      onShowOtpPrompt: (callback: () => void) => void
      removeShowOtpPromptListener: () => void
      sendOtp: (otp: string) => void
    }
  }
}

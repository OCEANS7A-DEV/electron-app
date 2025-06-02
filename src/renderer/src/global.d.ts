// src/global.d.ts

export {}

declare global {
  interface Window {
    myInventoryAPI: {
      UpdaterClose: any;
      MainBoot: any;
      onCheckedUpdate(arg0: (value: any) => void): unknown;
      onProgressUpdate(arg0: (value: any) => void): unknown;
      upGrade: any;
      onUpdateAvailable(arg0: (flag: any) => void): unknown;
      fetchData: () => Promise<any>
      postData: (endpoint: string, payload: any) => Promise<any>;
      postDataGet: () => Promise<any>;
      filePost: (endpoint: string, payload: any) => Promise<any>;
      ListGet: (payload:any) => Promise<any>;
      DataInsert: (payload:any) => Promise<any>;
      DetailsData: () => Promise<any>;
      ListData: () => Promise<any>;
      VendorData: () => Promise<any>;
      shortageGet: () => Promise<any>;
      PrintReady: () => Promise<any>;
      NowGet: () => Promise<any>;
      orderPrint: (payload: string) => Promise<void>;
      storeSet: (settitle: string, setData: any) => Promise<void>;
      storeGet: (gettitle: string) => Promise<any>;
    }
  }
}
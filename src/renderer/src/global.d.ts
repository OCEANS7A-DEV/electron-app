// src/global.d.ts

export {}

declare global {
  interface Window {
    myInventoryAPI: {
      fetchData: () => Promise<any>
      postData: (endpoint: string, payload: any) => Promise<any>;
      postDataGet: () => Promise<any>;
      filePost: (endpoint: string, payload: any) => Promise<any>;
      ListGet: (payload:any) => Promise<any>;
      DataInsert: (payload:any) => Promise<any>;
      ListData: () => Promise<any>;
      VendorData: () => Promise<any>;
      shortageGet: () => Promise<any>;
      PrintReady: () => Promise<any>;
      orderPrint: (payload: string) => Promise<void>;
      storeSet: (settitle: string, setData: any) => Promise<void>;
      storeGet: (gettitle: string) => Promise<any>;
    }
  }
}
export interface APIOptions {
  basePath?: string,
  sendTokenInUrl?: boolean,
  sendTokenInHeader?: boolean,
  body?: any,
  headers?: any,
  usePutMethod?: boolean,
  useDeleteMethod?: boolean,
  usePatchMethod?: boolean,
  isBlob?: boolean
}

export async function handleErrors(response: Response) {
  if (!response.ok) {
    const err = await response.json();
    throw Error(err.error.message);
  }
  return response.status === 200 ? response.json() : undefined;
}

export function getAccessToken(): string {
  return localStorage.getItem('access_token') as string;
}

export function setAccessToken(access_token: string) {
  localStorage.setItem('access_token', access_token);
}

export function clearAccessToken() {
  localStorage.removeItem('access_token');
}

function appendOptionsInUrl(url: string, options:any): any {

  Object.keys(options).map((key)=>{
    const value:any = options[key];
    const qsSeperator:string = url.includes('?') ? "&" : "?";
    url = url+qsSeperator+key+"="+value;
  })
  return url;
}

export async function getData(useBikeTheftCoreAPI:boolean = true, options:any = {}) {
  console.log(import.meta.env.REACT_APP_BIKE_THEFT_API);
  const basePath:string = useBikeTheftCoreAPI ? import.meta.env.VITE_REACT_APP_BIKE_THEFT_API! : '';
  const finalURL = appendOptionsInUrl(basePath,options);
  const finalOptions: any = { method: 'get' };
  const response = await fetch(finalURL, finalOptions)
  const responseData = options?.isBlob ? await response.blob  () : await response.json();

  if (responseData.error) {
    const { statusCode, name, message } = responseData.error;
    console.log(name, message);
    switch (statusCode) {
      case 401:
        return responseData;
        break;
      default:
        return responseData;
    }
  } else {
    return responseData;
  }
}
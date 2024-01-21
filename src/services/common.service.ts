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

function getAccessToken(): string {
  return localStorage.getItem('access_token') as string;
}

export function setAccessToken(access_token: string) {
  localStorage.setItem('access_token', access_token);
}

export function clearAccessToken() {
  localStorage.removeItem('access_token');
}

function addAccessToken(url: string): string {
  const qsSeperator = url.includes('?') ? '&' : '?';
  return url.concat(qsSeperator + 'access_token=' + getAccessToken());
}

export async function getData(url = '', options: APIOptions = {}) {
  const basePath = options.basePath || import.meta.env.REACT_APP_API_BASEPATH;
  const tokenRequiredInUrl = !!options.sendTokenInUrl;
  if (tokenRequiredInUrl) {
    url = addAccessToken(url);
  }
  const finalUrl = `${basePath}${url}`;
  const finalOptions: any = { method: 'get' };
  if (options.headers) {
    finalOptions.headers = options.headers;
  }
  const tokenRequiredInHeader = !!options.sendTokenInHeader;
  if (tokenRequiredInHeader) {
    finalOptions.headers = finalOptions.headers || {};
    finalOptions.headers['Authorization'] = `Bearer ${getAccessToken()}`
  }

  const response = await fetch(finalUrl, finalOptions)
  const responseData = options?.isBlob ? await response.blob() : await response.json();
  if (responseData.error) {
    const { statusCode, name, message } = responseData.error;
    console.log(name, message);
    switch (statusCode) {
      case 401:
        if (window.location.pathname !== '/login') {
        //   logoutUser()
        //     .then(() => {
        //       window.location.replace('/login')
        //     })
        }
        break;
      default:
        return responseData
    }
  } else {
    return responseData;
  }
}
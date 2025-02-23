const getData = async (res: Response) => {
  const contentType = res.headers.get('Content-Type')

  if(contentType == "application/json"){
    const json = await res.json()
    return json
  }
  return await res.text()
}

export const customInstance = async <T>(url: string, {
   method,
   headers = {},
   ...rest
 }: {
   method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
   body?: any;
   responseType?: string;
   headers?: HeadersInit
 }): Promise<T> => {
   const response = await fetch(url, {
    ...rest,
     method,
     headers: headers,
   });
 
   const data = await getData(response)
   return {status: response.status, data: data, headers: response.headers} as T
 };
 
 export default customInstance
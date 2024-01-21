import { getData } from "./common.service";

export const getBikesThefts = async (urlOptions:any) => {

  const useBikeTheftCoreAPI:boolean = true;
  const options:any = urlOptions;

  return getData(useBikeTheftCoreAPI, options);

}



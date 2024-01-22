import { UrlOptions } from "../interfaces";
import { getData } from "./common.service";

export const getBikesThefts = async (urlOptions:any={}) => {

  const useBikeTheftCoreAPI:boolean = true;
  const options:UrlOptions = urlOptions;

  return getData(useBikeTheftCoreAPI, options);

}



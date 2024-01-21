// import { CORE_API } from "../constants/api";
// import { KeyValues } from "../constants/interfaces";
import { getData } from "./common.service";

export const getAnomalousPlots = async () => {
  const url = '/get-anomalous-plots?sinceHours=24'
  return getData(url, {
    sendTokenInHeader: true,
    // basePath: CORE_API
  })
}



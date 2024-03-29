import React, { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";
import { Button, TextField } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";

import { getBikesThefts } from "../services/bikesThefts.service";
import Header from "../components/Header";
import "./HomePage.css";
import { noImage } from "../interfaces";
import { isArrayWithLength } from "../utils/helper";
import { blueGrey, purple } from "@mui/material/colors";
import dayjs from "dayjs";

interface StolenBikes {
  cycle_type_slug?: string,
  date_stolen?: string | null,
  description?: string | null,
  external_id?: null,
  frame_colors?: Array<string>,
  frame_model?: string,
  id: number,
  is_stock_img?: boolean,
  large_img?: string | null,
  location_found?: string,
  manufacturer_name?: string,
  propulsion_type_slug?: string,
  registry_name?: null,
  registry_url?: null,
  serial?: string,
  status?: string,
  stolen?: boolean,
  stolen_coordinates?: Array<number> | null,
  stolen_location?: string | null,
  thumb?: string | null,
  title?: string,
  url?: string,
  year?: string | number | null,
}

interface Error{
  text:string,
  isError:boolean
}

interface Loader{
  text:string, 
  isLoading:boolean
}

interface UrlOptions {
  location?: string,
  distance?: number,
  stolenness?: string,
  query?: string,
}    

const stolenBikesInfoLabels:string[] = ["Location", "Stolen", "Serial"];
const stolenBikesInfoLabelsKeys:string[] = ["stolen_location", "date_stolen", "serial"];


const HomePage: React.FC = (): JSX.Element => {

  const [stolenBikesArr, setStolenBikesArr] = useState<StolenBikes[]>([]);
  const [totalBikesCount, setTotalBikesCount] = useState<number>(0);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [userQuery, setUserQuery] = useState<string>("");
  const [fromDate, setFromDate] = useState<number>(0);
  const [toDate, setToDate] = useState<number>(0);
  const [currPage, setCurrPage] = useState<number>(1);
  const [showLoader, setShowLoader] = useState<Loader>({
    text: "Loading",
    isLoading: false,
  });
  const [showError, setShowError] = useState<Error>({
    text: "Error Fetching!",
    isError: false,
  });
  const [showNoResults, setShowNoResults] = useState<any>({
    text: "No Results!",
    areNoResults: false,
  });

  useEffect(() => {
    // initially, userQuery=""
    fetchStolenBikesUsingQuery(userQuery);
  }, []);


  const fetchStolenBikesUsingQuery = async (userQuery:string)=>{
    const urlOptions: UrlOptions = {
      location: "Berlin",
      distance: 10,
      stolenness: "stolen",
      query: userQuery,
    };
    // set loader
    setShowLoader({ text: "loading ...", isLoading:true });
    setShowNoResults({ text: "", areNoResults: false });
    setShowError({ text: "", isError: false });
    
    const updatedStolenBikes = await getBikesThefts(urlOptions);
    
    // error handling
    if(updatedStolenBikes?.error){
      setShowError({text:"Ooops, something went wrong!", isError:true});
      setShowNoResults({ text: "", areNoResults: false });
      setShowLoader({ text: "", isLoading: false });
      setStolenBikesArr([]);
      setTotalBikesCount(0);
      setTotalPage(0);
      setCurrPage(0);
      return;
    }
    const newStolenBikesArr:StolenBikes[] = updatedStolenBikes?.bikes;
    const stolenBikesCount:number = newStolenBikesArr.length;
    // no results
    if (!isArrayWithLength(newStolenBikesArr)) {
      setShowNoResults({ text: "No Results!", areNoResults: true });
      setShowError({ text: "", isError: false });
      setShowLoader({ text: "", isLoading: false });
      setStolenBikesArr([]);
      setTotalBikesCount(0);
      setTotalPage(0);
      setCurrPage(0);
      return;
    }
    // data
    setStolenBikesArr(newStolenBikesArr);
    setTotalBikesCount(stolenBikesCount);
    setTotalPage(Math.ceil(stolenBikesCount / 10)); // per_page = 10 
    setCurrPage(1);
    if (isArrayWithLength(updatedStolenBikes.bikes)){
      setShowLoader({ text: "", isLoading: false });
    }
    return;
  };

  const handleQuery = (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)=>{
    setUserQuery(e.target.value);
    fetchStolenBikesUsingQuery(e.target.value || "");
  }

  const handlePagination = (_: React.ChangeEvent<unknown>, pageNumber: number) => {
    setCurrPage(pageNumber);
  };

  const dateFormatter = (index:number)=>{
    const dateValue = stolenBikesArr[index]["date_stolen"];
    let readableDateFormat: string = "";
    if (dateValue) {
      // Unix time in seconds
      const unixTime = parseInt(dateValue);
      const utcDate = new Date(unixTime * 1000);
      // return formatted date
      readableDateFormat = dayjs(utcDate.toISOString().split("T")[0]).format("MMMM D, YYYY");
    }
    return readableDateFormat;
  }

  const handleFindCasesUsingDateRange = ()=>{
    if(!fromDate){
      window.alert("Select From Date!");
      return;
    }
    if(!toDate){
      window.alert("Select To Date!");
      return;
    }
    if (!isArrayWithLength(stolenBikesArr)){
      window.alert("There are no stolen bikes present!");
      return;
    }
    if (fromDate && toDate && isArrayWithLength(stolenBikesArr)) {
      const filteredStolenBikesArr = stolenBikesArr.filter(
        (stolenBike: StolenBikes) => {
          const bikeStolenDate: any = stolenBike["date_stolen" as keyof StolenBikes];
          if (bikeStolenDate) {
            return (
              parseInt(bikeStolenDate) >= fromDate &&
              parseInt(bikeStolenDate) <= toDate
            );
          }
        }
      );
      // date filtered stolen bikes array
      setStolenBikesArr(filteredStolenBikesArr);
      const filteredBikesCount:number = filteredStolenBikesArr.length;
      if(!filteredBikesCount){
        setShowNoResults({ text: "No Results!", areNoResults: true });
        setShowError({ text: "", isError: false });
        setShowLoader({ text: "", isLoading: false });
        setTotalBikesCount(0);
        setTotalPage(0);
        setCurrPage(0);
        return;
      }
      setTotalPage(Math.ceil(filteredBikesCount / 10));
      setShowNoResults({ text: "No Results!", areNoResults: false });
      setShowError({ text: "", isError: false });
      setShowLoader({ text: "", isLoading: false });
      setTotalBikesCount(filteredBikesCount);
      setCurrPage(1);
      return;
    }
  }

  return (
    <div className="homePage">
      <Header />

      <div className="bykes-theft-section dfc">
        {/* filters*/}
        <div className="filters dfr">
          {/* case description */}
          <ThemeProvider theme={theme}>
            <TextField
              sx={caseInputStyle}
              className="case-title"
              data-testid="case-description-input"
              label="Case Descriptions"
              placeholder="Case"
              // variant="filled"
              color="primary"
              value={userQuery}
              focused
              onChange={handleQuery}
            />
          </ThemeProvider>
          {/* date pickers */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker"]}>
              {/* from */}
              <DatePicker
                data-testid="from-datepicker"
                className="from-date-picker"
                label="From"
                sx={datePickerStyle}
                onChange={(e: any) => {
                  setFromDate(new Date(e.$d).getTime() / 1000);
                }}
              />
              {/* to */}
              <DatePicker
                data-testid="to-datepicker"
                className="to-date-picker"
                label="To"
                sx={datePickerStyle}
                onChange={(e: any) => {
                  setToDate(new Date(e.$d).getTime() / 1000);
                }}
              />
            </DemoContainer>
          </LocalizationProvider>
          <Button
            sx={findCaseButtonStyle}
            variant="outlined"
            data-testid="find-cases-submit-button"
            onClick={handleFindCasesUsingDateRange}
          >
            Find Cases
          </Button>
        </div>

        {/* Pagination */}
        <div className="navigator">
          <Stack className="navigator-page-count" spacing={2}>
            <Pagination
              count={totalPage}
              page={currPage}
              onChange={handlePagination}
              data-testid="pagination"
            />
          </Stack>
        </div>

        {/* Total Count */}
        <div className="total-stolen-bikes-count dfr">
          <p data-testid="cases-count">Total: {totalBikesCount}</p>
        </div>

        <div className="stolen-bykes-list dfc">
          {/* Requirements handling: Error, Loader, No Results */}
          {showError.isError && <p>{showError.text}</p>}
          {showNoResults.areNoResults && <p>{showNoResults.text}</p>}
          {showLoader.isLoading && <p>{showLoader.text}</p>}
          {isArrayWithLength(stolenBikesArr) &&
            !showLoader.isLoading &&
            !showError.isError &&
            !showNoResults.areNoResults &&
            stolenBikesArr
              .slice(10 * currPage - 10, 10 * currPage)
              .map((stolenBike: StolenBikes, index: number) => {
                return (
                  <div
                    key={`${index}-${index * 10 + stolenBike.id}`}
                    className="stolen-bike-card dfr"
                  >
                    <div className="stolen-img-div dfr">
                      <img
                        className="stolen-bike-img"
                        src={stolenBike.large_img || noImage}
                        alt="bike_image"
                      />
                    </div>
                    <div className="stolen-bike-info dfc">
                      {/* title */}
                      <p
                        data-testid="case-card-title"
                        className="stole-bike-title"
                      >
                        {stolenBike.title?.toLowerCase()}
                      </p>
                      {/* description */}
                      <p
                        data-testid="case-card-description"
                        className="stole-bike-description"
                      >
                        {stolenBike.description &&
                        stolenBike.description?.length > 100
                          ? stolenBike.description.slice(0, 100)
                          : stolenBike.description}
                      </p>

                      {/* stolen bikes details */}
                      <div className="stolen-bike-locators dfr">
                        {stolenBikesInfoLabels.map(
                          (label: string, i: number) => {
                            const key: string = stolenBikesInfoLabelsKeys[i];
                            const hasDate: boolean =
                              stolenBikesInfoLabelsKeys[i] == "date_stolen";
                            return (
                              <div
                                key={`${key}-${label}-${i}`}
                                className="stolen-bike-location dfr"
                              >
                                <p
                                  data-testid="case-card-info"
                                  className="stolen-bike-info-labels"
                                >
                                  {label}:
                                </p>
                                <p>
                                  {hasDate
                                    ? dateFormatter(index) || ""
                                    : stolenBike[key as keyof StolenBikes]}
                                </p>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>
      </div>
    </div>
  );
};

export default HomePage;

// Date Picker stylesObject
const caseInputStyle = {
  margin: 1,
  width: 550,
  minWidth: 200,
  "& .MuiOutlinedInput-root": {
    borderRadius: "50px",
    color:"gray",
  },
};

const datePickerStyle = {
  width: 20,
  "& .MuiOutlinedInput-root": {
    "&:hover > fieldset": { borderColor: "#C7C8CD" },
    borderRadius: "50px",
  },
}

const findCaseButtonStyle = {
  margin: 2,
  color: "red",
  borderColor: "red",
  borderRadius: 50,
};

// Theme for MUI components
const theme = createTheme({
  palette: {
    primary: blueGrey,
    secondary: purple,
  },
});

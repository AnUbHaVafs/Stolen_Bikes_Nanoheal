import React, { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";
import { Button, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";

import { getBikesThefts } from "../services/bikesThefts.service";
import Header from "../components/Header";
import "./HomePage.css";
import { noImage } from "../interfaces";
import { isArrayWithLength } from "../utils/helper";

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

  return (
    <div className="homePage">
      <Header />

      <div className="bykes-theft-section dfc">
        {/* filters*/}
        <div className="filters dfr">
          {/* case description */}
          <TextField
            sx={caseInputStyle}
            className="case-title"
            label="Search Case Descriptions"
            placeholder="Case"
            variant="filled"
            color="success"
            value={userQuery}
            focused
            onChange={handleQuery}
          />
          {/* date pickers */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker"]}>
              {/* from */}
              <DatePicker
                className="from-date-picker"
                label="From"
                sx={{ width: 20 }}
              />
              {/* to */}
              <DatePicker
                className="to-date-picker"
                label="To"
                sx={{ width: 20 }}
              />
            </DemoContainer>
          </LocalizationProvider>
          <Button
            sx={{ margin: 2, color: "red", borderColor: "red" }}
            variant="outlined"
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
            />
          </Stack>
        </div>

        {/* Total Count */}
        <div className="total-stolen-bikes-count dfr">
          <p>Total: {totalBikesCount}</p>
        </div>

        <div className="stolen-bykes-list dfc">
          {/* Requirements handling: Error, Loader, No Results */}
          {showError.isError && <p>{showError.text}</p>}
          {showNoResults.areNoResults && <p>{showNoResults.text}</p>}
          {showLoader.isLoading && <p>{showLoader.text}</p>}
          {isArrayWithLength(stolenBikesArr) &&
            !showLoader.isLoading &&
            stolenBikesArr
              .slice(10 * currPage - 10, 10 * currPage)
              .map((stolenBike: StolenBikes, index: number) => {
                return (
                  <div
                    key={`${index}-${index * 10 + stolenBike.id}`}
                    className="stolen-bike-card dfr"
                  >
                    <div className="stolen-img-div dfr">
                      <img className="stolen-bike-img" src={stolenBike.large_img || noImage} alt="bike_image"/>
                    </div>
                    <div className="stolen-bike-info dfc">
                      {/* title */}
                      <p className="stole-bike-title">{stolenBike.title}</p>
                      {/* description */}
                      <p className="stole-bike-description">
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
                            return (
                              <div
                                key={`${key}-${label}-${i}`}
                                className="stolen-bike-location dfr"
                              >
                                <p className="stolen-bike-info-labels">
                                  {label}:
                                </p>
                                <p>{stolenBike[key as keyof StolenBikes]} </p>
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

const caseInputStyle = {
  margin: 1,
  width: 550,
  minWidth: 200,
};

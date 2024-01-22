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

const stolenBikesInfoLabels:string[] = ["Location", "Stolen", "Serial"];
const stolenBikesInfoLabelsKeys:string[] = ["stolen_location", "date_stolen", "serial"];

const HomePage: React.FC = (): JSX.Element => {

  const [stolenBikesArr, setStolenBikesArr] = useState<any[]>([]);
  const [totalBikesCount, setTotalBikesCount] = useState<number>(0);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [userQuery, setUserQuery] = useState<string>("");
  const [currPage, setCurrPage] = useState<number>(1);
  const [showLoader, setShowLoader] = useState<any>({text:"Loading",isLoading:false});
  const [showError, setShowError] = useState<any>({text:"Error Fetching!", isError:false});

  useEffect(() => {
    // initially, userQuery=""
    fetchStolenBikesUsingQuery(userQuery);
  }, []);


  const fetchStolenBikesUsingQuery = async (userQuery:string)=>{

    const urlOptions: any = {
      location: "Berlin",
      distance: 10,
      stolenness: "stolen",
      query: userQuery,
    };
    
    // set loader
    setShowLoader({ text: "loading ...", isLoading:true });
    const updatedStolenBikes: any = await getBikesThefts(urlOptions);

    // error handling
    if(updatedStolenBikes?.error){
      setShowError({text:"Ooops, something went wrong!", isError:true});
      setShowLoader({ text: "", isLoading:false });
      return;
    }

    const stolenBikesCount: number = updatedStolenBikes?.bikes.length;
    // data
    setStolenBikesArr(updatedStolenBikes?.bikes);
    setTotalBikesCount(stolenBikesCount);
    setTotalPage(Math.ceil(stolenBikesCount / 10)); // per_page = 10 
    if (updatedStolenBikes) setShowLoader({ text: "", isLoading:false });
      
  };


  const handleDescriptionChange = (e:any)=>{
    setUserQuery(e.target.value);
    fetchStolenBikesUsingQuery(e.target.value);
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
            sx={{
              margin: 1,
              width: 550,
              minWidth: 200,
            }}
            className="case-title"
            label="Search Case Descriptions"
            placeholder="Case"
            variant="filled"
            color="success"
            value={userQuery}
            focused
            onChange={handleDescriptionChange}
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
            sx={{ margin: 2, color: "red", borderColor: "red"}}
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
          
          {/* Requirements handling: Error */}
          {showError.error && <p>{showError.text}</p>}

          {/* Requirements handling: Loader */}
          {showLoader.isLoading ? (
            <p>{showLoader.text}</p>
          ) : (
            stolenBikesArr.length > 0 &&
            !showLoader.isLoading &&
            stolenBikesArr
              .slice(10 * currPage - 10, 10 * currPage)
              .map((stolenBike: any, index: number) => {
                return (
                  <div
                    key={index + stolenBike.id}
                    className="stolen-bike-card dfr"
                  >
                    <div className="stolen-img-div dfr">
                      <img
                        className="stolen-bike-img"
                        src={stolenBike.large_img || "src/assets/no-image.png"}
                        alt="bike_image"
                      />
                    </div>
                    <div className="stolen-bike-info dfc">
                      {/* title */}
                      <p className="stole-bike-title">{stolenBike.title}</p>
                      {/* description */}
                      <p className="stole-bike-description">
                        {stolenBike.description?.length > 100
                          ? stolenBike.description.slice(0, 100)
                          : stolenBike.description}
                      </p>

                      {/* stolen bikes details */}
                      <div className="stolen-bike-locators dfr">
                        {stolenBikesInfoLabels.map(
                          (label: string, i: number) => {
                            const key = stolenBikesInfoLabelsKeys[i];
                            return (
                              <div className="stolen-bike-location dfr">
                                <p className="stolen-bike-info-labels">
                                  {label}:
                                </p>
                                <p>{stolenBike[key]} </p>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;

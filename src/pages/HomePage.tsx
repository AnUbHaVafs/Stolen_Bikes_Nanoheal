import React, { useEffect, useState } from "react";
import { getBikesThefts } from "../services/bikesThefts.service";
import Header from "../components/Header";
import { LocalizationProvider } from "@mui/x-date-pickers";
import "./HomePage.css";
import { Button, TextField } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
const HomePage: React.FC = (): JSX.Element => {
  const [stolenBikes, setStolenBikes] = useState<any>([]);

  const fetchStolenBikes = async ()=>{
    const urlOptions:any = {
      page: 1,
      per_page: 10,
      location: "Berlin",
      distance: 10,
      stolenness: "stolen",
      // access_token: "date",
    };
    const updatedStolenBikes: any = await getBikesThefts(urlOptions);
    setStolenBikes(updatedStolenBikes.bikes);
  };

  useEffect(()=>{
    fetchStolenBikes();
  },[]);

  console.log(stolenBikes);
  return (
    <div className="homePage">
      <Header />
      <div className="bykes-theft-section dfc">
        <div className="filters dfr">
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
            focused
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker"]}>
              <DatePicker
                className="from-date-picker"
                label="From"
                sx={{ width: 20 }}
              />
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
        {/* <div className="stolen-bykes-list dfc"></div> */}
      </div>
    </div>
  );
};

export default HomePage;

import React, { useEffect, useState } from "react";
import { getBikesThefts } from "../services/bikesThefts.service";

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
    <div>
      HomePage
    </div>
  );
};

export default HomePage;

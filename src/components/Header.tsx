import React from "react";
import "./Header.css";
import { Berlin_Dept, Heading, subHeading } from "../interfaces";

const Header:React.FC = ()=>{    
    return (
      <div className="header dfr">
        <img src={Berlin_Dept} alt="berlin_dept_logo" />
        <div className="dfc headings">
          <p className="department-name">{Heading}</p>
          <p className="department-motto">{subHeading}</p>
        </div>
      </div>
    );
};
export default Header;
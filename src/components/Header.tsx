import React from "react";
import "./Header.css";
import { Berlin_Dept, Heading, subHeading } from "../interfaces";

const Header:React.FC = ()=>{    
    return (
      <div className="header dfr">
        <img data-testid="header-logo" src={Berlin_Dept} alt="berlin_dept_logo" />
        <div className="dfc headings">
          <p data-testid="header-title" className="department-name">{Heading}</p>
          <p data-testid="header-sub-title" className="department-motto">{subHeading}</p>
        </div>
      </div>
    );
};
export default Header;
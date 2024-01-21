import React from "react";
import "./Header.css";

const Header:React.FC = ()=>{
    return (
        <div className="header dfr">
            <img src="src/assets/berlin.jpg" alt="" />
            <div className="dfc headings">
                <p className="department-name">Police Department Of Berlin</p>
                <p className="department-motto">Stolen bykes</p>
            </div>
        </div>
    );
};
export default Header;
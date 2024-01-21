import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { HomePage } from "../pages";

const AppRouter: React.FC = (): JSX.Element => {
    return (
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
};

export default AppRouter;

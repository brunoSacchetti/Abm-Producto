import { Route, Routes } from "react-router-dom";
import { MasterDetail } from "../components/screens/MasterDetail";

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="*" element={<MasterDetail />} />
    </Routes>
  );
};

import { Route, Routes } from "react-router-dom";
/* import { MasterDetail } from "../components/screens/MasterDetail"; */
import { ArticuloManufacturadoScreen } from "../components/screens/ArticuloManufacturadoScreen";
export const AppRouter = () => {
  return (
    <Routes>
      <Route path="*" element={<ArticuloManufacturadoScreen />} />
    </Routes>
  );
};

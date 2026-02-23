
import TenderForm from "../components/TenderForm";
import { useLocation } from "react-router-dom";

function TenderPage() {
  const { state } = useLocation();
  return <TenderForm editData={state?.item} editIndex={state?.i} />;
}

export default TenderPage;

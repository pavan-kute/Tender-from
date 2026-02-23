
import { getTenders, deleteTender } from "../utils/storage";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Report() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const load = async () => {
    const d = await getTenders();
    setData(d);
  };

  useEffect(() => {
    load();
  }, []);

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, "tender-report.xlsx");
  };

  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (item, i) => {
    const idOrIndex = item?._id ?? item?.id ?? i;
    const ok = window.confirm("Are you sure you want to delete this tender?");
    if (!ok) return;

    setDeletingId(idOrIndex);
    try {
      const res = await deleteTender(idOrIndex);
      if (!res) {
        alert("You must be logged in to delete a tender.");
        return;
      }
      await load();
    } catch (err) {
      console.error(err);
      alert("Failed to delete tender. See console for details.");
    } finally {
      setDeletingId(null);
    }
  };

  const isAuthed = !!(JSON.parse(localStorage.getItem("user") || "null")?.token);

  return (
    <div className="container mt-4">
      <h3>Report</h3>
      <button className="btn btn-success mb-2" onClick={exportExcel}>Export Excel</button>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Goods</th>
            <th>Mobile</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
  {data.map((item, i) => (
    <tr key={i}>
      <td>{item.fullName}</td>
      <td>{item.goodsType}</td>
      <td>{item.mobile}</td>
      <td>
        <button
          className="btn btn-warning btn-sm me-2"
          onClick={() => {
            if (!isAuthed) return alert("You must be logged in to edit a tender.");
            navigate("/tender", { state: { item, i } });
          }}
          disabled={!isAuthed}
        >
          Edit
        </button>
        <button
          className="btn btn-danger btn-sm"
          onClick={() => handleDelete(item, i)}
          disabled={deletingId === (item?._id ?? item?.id ?? i)}
        >
          {deletingId === (item?._id ?? item?.id ?? i) ? "Deleting..." : "Delete"}
        </button>
      </td>
    </tr>
  ))}
</tbody>
      </table>
    </div>
  );
}

export default Report;

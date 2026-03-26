import { getTenders, deleteTender } from "../utils/storage";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Report() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    setError("");

    try {
      const d = await getTenders();
      setData(d);
    } catch (err) {
      console.error(err);
      setData([]);
      setError(err.message || "Failed to load tenders.");
    } finally {
      setLoading(false);
    }
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
      alert(err.message || "Failed to delete tender.");
    } finally {
      setDeletingId(null);
    }
  };

  const isAuthed = !!(JSON.parse(localStorage.getItem("user") || "null")?.token);

  return (
    <section className="report-shell">
      <div className="page-header">
        <span className="page-kicker">Data Overview</span>
        <h1 className="page-title">Tender Report</h1>
      </div>

      <div className="report-toolbar">
        <button className="app-btn app-btn--accent" onClick={exportExcel}>Export Excel</button>
        <div className="report-summary">Total records: {data.length}</div>
      </div>

      {loading && <div className="status-banner status-banner--info">Loading tenders...</div>}
      {!!error && <div className="status-banner status-banner--danger">{error}</div>}
      {!loading && !error && data.length === 0 && (
        <div className="status-banner status-banner--neutral">No tenders found in the online database yet.</div>
      )}

      <div className="table-shell">
        <table className="table table-bordered table-wrap mb-0">
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
              <tr key={item?._id ?? item?.id ?? i}>
                <td data-label="Name">{item.fullName}</td>
                <td data-label="Goods">{item.goodsType}</td>
                <td data-label="Mobile">{item.mobile}</td>
                <td data-label="Actions">
                  <div className="action-row">
                    <button
                      className="app-btn app-btn--soft"
                      onClick={() => {
                        if (!isAuthed) return alert("You must be logged in to edit a tender.");
                        navigate("/tender", { state: { item, i } });
                      }}
                      disabled={!isAuthed}
                    >
                      Edit
                    </button>
                    <button
                      className="app-btn app-btn--danger"
                      onClick={() => handleDelete(item, i)}
                      disabled={deletingId === (item?._id ?? item?.id ?? i)}
                    >
                      {deletingId === (item?._id ?? item?.id ?? i) ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default Report;


import API from "../api";

// Attempt backend calls; if they fail, fall back to localStorage.
const LOCAL_KEY = "tenders";

export const saveTender = async (data) => {
  try {
    // Send as FormData to support file uploads
    const formData = new FormData();
    Object.keys(data).forEach((k) => {
      const val = data[k];
      if (val instanceof File) formData.append(k, val, val.name);
      else formData.append(k, typeof val === "object" ? JSON.stringify(val) : val);
    });

    const res = await API.post("/tenders", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    const old = JSON.parse(localStorage.getItem(LOCAL_KEY)) || [];
    const saved = { ...data };
    old.push(saved);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(old));
    return saved;
  }
};

export const getTenders = async () => {
  try {
    const res = await API.get("/tenders");
    return res.data;
  } catch (err) {
    return JSON.parse(localStorage.getItem(LOCAL_KEY)) || [];
  }
};

export const updateTender = async (identifier, updatedData) => {
  try {
    // If identifier looks like an id string/number, use it; otherwise treat as index
    if (identifier || identifier === 0) {
      // If updatedData contains files, use FormData
      const formData = new FormData();
      Object.keys(updatedData).forEach((k) => {
        const val = updatedData[k];
        if (val instanceof File) formData.append(k, val, val.name);
        else formData.append(k, typeof val === "object" ? JSON.stringify(val) : val);
      });
      await API.put(`/tenders/${identifier}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return true;
    }
  } catch (err) {
    // fallback to index-based update
    const data = JSON.parse(localStorage.getItem(LOCAL_KEY)) || [];
    if (typeof identifier === "number") {
      data[identifier] = updatedData;
      localStorage.setItem(LOCAL_KEY, JSON.stringify(data));
      return true;
    }
    return false;
  }
};

export const deleteTender = async (identifier) => {
  // require logged-in user (token) to perform deletions
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user && user.token;
  if (!token) {
    // not authenticated -> do not delete
    return false;
  }

  try {
    await API.delete(`/tenders/${identifier}`);
    return true;
  } catch (err) {
    // if authenticated but server fails, fall back to localStorage deletion for offline mode
    const data = JSON.parse(localStorage.getItem(LOCAL_KEY)) || [];
    if (typeof identifier === "number") {
      data.splice(identifier, 1);
      localStorage.setItem(LOCAL_KEY, JSON.stringify(data));
      return true;
    }
    return false;
  }
};

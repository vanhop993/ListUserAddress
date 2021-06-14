import React, { useEffect, useState } from "react";
import Autocomplete1 from "../Autocomplete1";

export default function FormSearch({ data, handleSearch }) {
  const [form, setForm] = useState({
    typeAddress: "",
    province: "",
    district: "",
    address: "",
  });
  const [dataDistrict, setDataDistrict] = useState([]);

  useEffect(() => {
    if (form.province) {
      const provinceData = data.find((item) => item.id === form.province);
      if (provinceData) {
        setDataDistrict(provinceData.districts);
      } else {
        form.district = "";
      }
    }
  }, [form]);

  const getValue = (name, value) => {
    const newObj = { ...form };
    newObj[name] = value;
    setForm(newObj);
  };

  const handleClearSearchBox = () => {
    const newObj = {
      typeAddress: "",
      province: "",
      district: "",
      address: "",
    };
    setForm(newObj);
    handleSearch(newObj);
  };

  const handleSubmit = () => {
    handleSearch(form);
  };
  return (
    <div className="card border-primary">
      <div className="card-body">
        <form>
          <div className="form-group">
            <select
              className="custom-select"
              name="typeAddress"
              placeholder="Type of address"
              value={form.typeAddress}
              onChange={(e) => {
                getValue(e.target.name, e.target.value);
              }}
            >
              <option value="">Type of address</option>
              <option value="home">Home</option>
              <option value="workingPlace">Working place</option>
            </select>
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <Autocomplete1
              placeholder={"Province"}
              name={"province"}
              data={data}
              value={form.province}
              getValue={getValue}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <Autocomplete1
              placeholder={"District"}
              name={"district"}
              data={dataDistrict}
              getValue={getValue}
              value={form.district}
              statusDisable={!form.province}
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              className="form-control"
              name="address"
              aria-describedby="helpId"
              placeholder="Address"
              value={form.address}
              onChange={(e) => {
                getValue(e.target.name, e.target.value);
              }}
            />
          </div>
        </form>
      </div>
      <div className="w-100 text-center">
        <button className="btn btn-success m-1" onClick={handleSubmit}>
          Search
        </button>
        <button className="btn btn-danger m-1" onClick={handleClearSearchBox}>
          Clear
        </button>
      </div>
    </div>
  );
}

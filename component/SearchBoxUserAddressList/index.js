import React, { useEffect, useMemo, useState } from "react";
import Table from "../Table";
import DataTable from "./Data.json";
import FormSearch from "../FormSearch";
import local from "./local.json";
import { NavLink } from "react-router-dom";
import {useHistory} from "react-router-dom";

const sortId = (data, reverse, sorting) => {
  return data.sort((a, b) => {
    return reverse * (a[sorting.feild] - b[sorting.feild]);
  });
};

const sortProvince = (data, reverse, sorting) => {
  return data.sort((a, b) => {
    return reverse * a[sorting.feild].localeCompare(b[sorting.feild]);
  });
};

const sortDistrict = (data, reverse, sorting) => {
  return data.sort((a, b) => {
    return reverse * a[sorting.feild].localeCompare(b[sorting.feild]);
  });
};

const tableHeaders = [
  { name: "#", feild: "id", sortable: true, sort: sortId },
  { name: "Address", feild: "address", sortable: false },
  { name: "Province", feild: "province", sortable: true, sort: sortProvince },
  { name: "District", feild: "district", sortable: true, sort: sortDistrict },
  { name: "Sub-district", feild: "sub-district", sortable: false },
  { name: "Action" },
];


export default function SearchBoxUserAddressList() {
  const [searchObj, setSearchObj] = useState({});
  const [data,setData] = useState([]);
  const history = useHistory();

  useEffect(() => {
    setData(DataTable);
  },[]);

  const dataMemo = useMemo(() => {
    let dataReturn = data;
    console.log(searchObj);
    if (searchObj.province) {
      const provinceSearch = local.find(item => item.id === searchObj.province);
      dataReturn = dataReturn.filter((item) => item.province == provinceSearch.name);
      if(searchObj.district){
        const districtSearch = provinceSearch.districts.find(item => item.id === searchObj.district);
        dataReturn = dataReturn.filter((item) => item.district == districtSearch.name);
      }
    }
    if(searchObj.address) {
      dataReturn = dataReturn.filter((item) => item.address.trim().toLowerCase().includes(searchObj.address.trim().toLowerCase()));
    }
    if(searchObj.typeAddress){
      dataReturn = dataReturn.filter((item) => item.typeAddress.trim().toLowerCase().includes(searchObj.typeAddress.trim().toLowerCase()));
    }
    console.log(dataReturn);

    return dataReturn;
  }, [searchObj,data]);

  const handleEdit = (id) => {
    history.push(`/edit_address/${id}`)
  }

  const handleDelete = (id) => {
    const index = data.findIndex(item => item.id === id);
    if(index !==-1){
      let newData = data.filter(item => item.id !== data[index].id);
      setData(newData)
    }
  } 

  const renderBodyTable = (arrayData) => {
    return arrayData.map((item) => (
      <tr key={item.id}>
        <td scope="row">{item.id}</td>
        <td>{item.address}</td>
        <td>{item.province}</td>
        <td>{item.district}</td>
        <td>{item.subDistrict}</td>
        <td className="d-flex">
          <button className="btn btn-primary m-1"onClick={() => handleEdit(item.id)}>Edit</button>
          <button className="btn btn-danger m-1" onClick={() => handleDelete(item.id)}>Delete</button>
        </td>
      </tr>
    ));
  };

  const getValueSearchForm = (value) => {
    setSearchObj(value);
  };
  return (
    <div className="container">
      <div className="text-center">
        <h4>
          <strong>
            Danh sách thông tin 
          </strong>
        </h4>
      </div>
      <div className="d-flex justify-content-end py-2">
        <NavLink className="btn btn-warning" to="/add_address">
          Add new info
        </NavLink>
      </div>
      <div className="row">
        <div className="col-4">
          <FormSearch data={local} handleSearch={getValueSearchForm} />
        </div>
        <div className="col-8">
          <Table
            headers={tableHeaders}
            body={dataMemo}
            renderBody={renderBodyTable}
          />
        </div>
      </div>
    </div>
  );
}

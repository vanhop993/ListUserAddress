import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Autocomplete1 from "../Autocomplete1";
import local from "../SearchBoxUserAddressList/local.json";
import dataApi from "../SearchBoxUserAddressList/Data.json";
import { useHistory } from "react-router-dom";

export default function FormUserAddressInfo(props) {
  const id = props.match.params.id;
  const [form, setForm] = useState({
    typeAddress: "",
    province: "",
    district: "",
    subDistrict: "",
    address: "",
  });
  const [dataDistrict, setDataDistrict] = useState([]);
  const [dataSubDistrict, setDataSubDistrict] = useState([]);
  const history = useHistory();

  const {
    control,
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm();

  useEffect(() => {
    if (id) {
      const dataId = dataApi.find((item) => item.id === id);
      const province = local.find((item) => item.name === dataId.province);
      const district = province.districts.find(
        (item) => item.name === dataId.district
      );
      const subDistrict = district.wards.find(
        (item) => item.name === dataId.subDistrict
      );
      const newObj = {
        typeAddress: dataId.typeAddress,
        province: province.id,
        district: district.id,
        subDistrict: subDistrict.id,
        address: dataId.address,
      };
      setForm(newObj);
      reset({
        typeAddress: dataId.typeAddress,
        province: province.name,
        district: district.name,
        subDistrict: subDistrict.name,
        address: dataId.address,
      });
    }
  }, []);

  useEffect(() => {
    if (form.province) {
      const provinceData = local.find((item) => item.id === form.province);
      if (provinceData) {
        setDataDistrict(provinceData.districts);
      } else {
        form.district = "";
      }
    }
    if (form.district) {
      const districtData = dataDistrict.find(
        (item) => item.id === form.district
      );
      if (districtData) {
        setDataSubDistrict(districtData.wards);
      } else {
        form.subDistrict = "";
      }
    }
  }, [form]);

  const getValue = (name, value) => {
    const newObj = { ...form };
    newObj[name] = value;
    setForm(newObj);
  };
  const onSubmit = (data) => {
    if(!id){
      const newData = {
        id: dataApi.length + 1,
        ...data,
      };
      dataApi.push(newData);
    }else{
      const index = dataApi.findIndex(item => item.id === id);
      dataApi[index] = {
        ...dataApi[index],
        ...data
      }
    }
    history.push("/");
  };
  return (
    <div className="container">
      <h4>
        {id ? <strong>Cập nhập thông tin</strong> :<strong>Thêm mới thông tin</strong>}
      </h4>
      <form className="w-100" onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <div className="col-6">
            <div className="form-group w-100">
              <input
                type="text"
                className="form-control"
                name="address"
                placeholder="Address"
                value={form.address}
                onInput={(e) => {
                  getValue(e.target.name, e.target.value);
                }}
                {...register("address", { required: "Address is required" })}
              />
              {errors.address?.type === "required" && (
                <span className="text-danger">{errors.address.message}</span>
              )}
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <Controller
                name="province"
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                  <Autocomplete1
                    placeholder={"Province"}
                    name={"province"}
                    data={local}
                    value={value}
                    getValue={getValue}
                    onChange={onChange}
                  />
                )}
              />
              {errors.province?.type === "required" && (
                <span className="text-danger">Province is required</span>
              )}
            </div>
          </div>
          <div className="col-6">
            <div style={{ marginBottom: "1rem" }}>
              <Controller
                name="district"
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                  <Autocomplete1
                    placeholder={"District"}
                    name={"district"}
                    data={dataDistrict}
                    getValue={getValue}
                    value={value}
                    statusDisable={!form.province}
                    onChange={onChange}
                  />
                )}
              />
              {errors.district?.type === "required" && (
                <span className="text-danger">District is required</span>
              )}
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <Controller
                name="subDistrict"
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                  <Autocomplete1
                    placeholder={"Sub district"}
                    name={"subDistrict"}
                    data={dataSubDistrict}
                    getValue={getValue}
                    value={value}
                    statusDisable={!form.district}
                    onChange={onChange}
                  />
                )}
              />
              {errors.subDistrict?.type === "required" && (
                <span className="text-danger">Sub district is required</span>
              )}
            </div>
          </div>
          <div className="form-group px-3 w-100">
            <Controller
              name="typeAddress"
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <select
                  className="custom-select"
                  name="typeAddress"
                  placeholder="Type of address"
                  value={value}
                  {...register("typeAddress", {
                    required: "Thông tin ko được để trống",
                  })}
                  onChange={(e) => {
                    onChange(e.target.value);
                    getValue(e.target.name, e.target.value);
                  }}
                >
                  <option value="">Type of address</option>
                  <option value="home">Home</option>
                  <option value="workingPlace">Working place</option>
                </select>
              )}
            />

            {errors.typeAddress?.type === "required" && (
              <span className="text-danger">{errors.typeAddress.message}</span>
            )}
          </div>
          <div className="text-center w-100">
            <button className="btn btn-success m-1" type="submit">
              {
                id ? "Edit" : "Add"
              }
            </button>
            <button className="btn btn-danger m-1" type="button">
              clear
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

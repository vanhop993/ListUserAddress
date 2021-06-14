import React from "react";

export default function Autocomplete({ placeholder, name, renderDataList , getValue , disable }) {
  return (
    <div className="form-group">
      <input
        onChange={getValue}
        className="form-control"
        type="search"
        list={name}
        name={name}
        placeholder={placeholder}
        data-list="brands-list"
        autoComplete="off"
        required
        disabled={disable}
      />
      <datalist id={name}>
        {renderDataList}
      </datalist>
    </div>
  );
}

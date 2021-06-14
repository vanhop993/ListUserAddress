import React, { useMemo, useState } from "react";
import TableHeader from "./TableHeader";

export default function Table({ headers , renderBody , body }) {
  const [sorting,setSorting] =useState({feild:"",order:"",sort:null});

  const localMemo = useMemo(() => {
    let data = body;
    if(sorting.feild) {
      const reverse = sorting.order === "asc" ? 1 : -1;
      data = sorting.sort(data,reverse,sorting);
    }
    return data;
  }, [sorting,body]);
  
  return (
    <table className="table table-striped table-inverse table-responsive">
      <TableHeader headers={headers} onSorting={(feild,order,sort) => setSorting({feild,order,sort})}/>
      <tbody>
        {renderBody(localMemo)}
      </tbody>
    </table>
  );
}

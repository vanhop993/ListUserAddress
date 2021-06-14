import React, { useState } from 'react'

export default function TableHeader({headers,onSorting}) {
    const [sortingFeild,setSortingFeild] = useState("");
    const [sortingOrder,setSortingOrder] = useState("asc");
    const onChangeSorting = (feild,sort) => {
        const order = feild === sortingFeild && sortingOrder === "asc" ? "decs" : "asc";
        setSortingFeild(feild);
        setSortingOrder(order);
        onSorting(feild,order,sort);
    }
    return (
        <thead className="thead-inverse">
            <tr>
                {
                    headers.map(({name,feild,sortable,sort}) => 
                    <td key={name}
                        onClick={() => sortable ? onChangeSorting(feild,sort) : null}
                    >
                        {name}
                        {
                            sortingFeild && sortingFeild === feild && (
                                sortingOrder === "asc" ? "v" : "^"
                            )
                        }
                    </td>)
                }
            </tr>
        </thead>
    )
}

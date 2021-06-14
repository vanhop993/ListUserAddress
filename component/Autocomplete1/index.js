import React, { useEffect, useMemo, useRef, useState } from "react";
import "./style.css";

export default function Autocomplete1({ name, placeholder, data , getValue , statusDisable , value , onChange}) {

  const [display, setDisplay] = useState(false);
  const [search, setSearch] = useState("");
  const [optionIndex, setOptionIndex] = useState(-1);

  const wrapperRef = useRef(null);
  const wrapResultRef = useRef(null);
  const oldOptionIndex = useRef(null);

  useEffect(() => {
    console.log(value);
    if(!value){
      setSearch("");
    }
  }, [])

  const scrollInterview = (position) => {
    if (position > wrapResultRef.current?.offsetHeight - 50 || oldOptionIndex.current > optionIndex || position === 0) {
      wrapResultRef.current?.scrollTo({
        top: position,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (optionIndex < 0 || optionIndex > suggestions.length || !wrapResultRef) {
      return () => {};
    }
    let listItems = Array.from(wrapResultRef.current.children);
    listItems[optionIndex] && scrollInterview(listItems[optionIndex].offsetTop);
  }, [optionIndex]);

  const suggestions = useMemo(() => {
    setOptionIndex(-1);
    scrollInterview(0);
    if (!search) return data;
    return data.filter((item) =>
      item.name.toLowerCase().trim().includes(search.toLowerCase().trim())
    );
  }, [data, search]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  const handleClickOutside = (event) => {
    const { current: wrap } = wrapperRef;
    const { current: searchBox } = wrapResultRef;
    if (searchBox && !wrap.contains(event.target)) {
      setDisplay(false);
      updateValue(search);
    }
  };
  const updateValue = (value) => {
    setDisplay(false);
    const itemFind = data.find(item => item.name.trim().toLowerCase() == value.trim().toLowerCase());
    if(itemFind){
      getValue(name,itemFind.id);
    }else{
      getValue(name,"");
    }
  };
  const handleKey = (e) => {
    const { keyCode } = e;
    let a;
    switch (keyCode) {
      case 40:
        oldOptionIndex.current = optionIndex;
        a = optionIndex + 1;
        if (a === suggestions.length) {
          a = 0;
        }
        setOptionIndex(a);
        break;
      case 38:
        oldOptionIndex.current = optionIndex;
        a = optionIndex - 1;
        if (a < 0) {
          a = suggestions.length - 1;
        }
        setOptionIndex(a);
        break;
      case 13: 
        if(optionIndex >= 0 ) {
          setSearch(suggestions[optionIndex].name);
          updateValue(suggestions[optionIndex].name);
          onChange && onChange(suggestions[optionIndex].name)
          setDisplay(false);
        }
        break;
      case 8:
        getValue(name,search)
        if(!display){
          setDisplay(true);
        }
        break;
      case 9:
        updateValue(search);
        setDisplay(false)
        break;
    }
  };

  return (
    <div
      className="form-group position-relative m-0"
      ref={wrapperRef}
      onKeyDown={handleKey}
    >
      <input
        type="text"
        className="form-control"
        name={name}
        placeholder={placeholder}
        value={search || value}
        onFocus={() => setDisplay(true)}
        onChange={(event) => {setSearch(event.target.value); onChange && onChange(event)}}
        // onBlur={(event) => {setSearch(event.target.value); updateValue(event.target.value);}}
        autoComplete="off"
        disabled={statusDisable}
      />
      {display && (
        <div className="autoContainer" ref={wrapResultRef}>
          {suggestions.map((item, i) => (
            <div
              onClick={() =>{ setSearch(item.name);updateValue(item.name); onChange && onChange(item.name)} }
              key={item.id}
              className={`option ${i === optionIndex && "optionSelect"}`}
            >
              {item.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

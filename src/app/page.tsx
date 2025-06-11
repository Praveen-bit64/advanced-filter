"use client";

import { useRef, useState } from "react";
import FilterPopup from "./components/FilterPopup";
import React from "react";
import getLocation from "@/app/data/locations.json";
import getPropertyTypes from "@/app/data/propertyTypes.json";
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter()
  const [showPopup, setShowPopup] = useState(false);
  const locationInputRef = useRef(null);
  const [suggLocation, setSuggLocation] = useState(false);
  const [locationDropDown, setLocationDropDown] = useState([]);
  const [limitLocation, setLimitLocation] = useState(false)
  const flatProperty = getPropertyTypes.flatMap(item => item.name)
  const [filterSearch, setFilterSearch] = useState({
    location: [],
    searchType: "Rent",
    propertyType: ""
  })
  const handleRedirect = () => {
    const { propertyType, searchType, location } = filterSearch;

    const queryParams = new URLSearchParams();

    queryParams.append('pType', propertyType);
    queryParams.append('sType', searchType);

    if (location.length > 0) {
      queryParams.append('pLocation', location.join(','));
    }

    router.push(`/properties?${queryParams.toString()}`);
  };

  const handleRemoveTag = (val) => {
    setFilterSearch((prev) => ({
      ...prev,
      location: prev.location.filter(item => (item).toLowerCase() !== val.toLowerCase())
    }))
    setLimitLocation(false)
  }
  const handleLocation = (e) => {
    const value = e.target.value;
    if (filterSearch.location.length >= 4) {
      setLimitLocation(true)
      return
    } else {
      setSuggLocation(true);
      setLocationDropDown(getLocation.filter(item => (item).toLowerCase().includes(value.toLowerCase())))
    }

    console.log(locationDropDown);
  }
  const handleSearchType = (e) => {
    const value = e.target.value
    setFilterSearch((prev) => ({
      ...prev,
      searchType: value
    }))
  }
  const handlePropertyType = (e) => {
    const value = e.target.value
    setFilterSearch((prev) => ({
      ...prev,
      propertyType: value
    }))
  }

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center gap-5">
      <h1 className="text-5xl font-bold text-blue-800/80"> Welcome Back!!</h1>
      <div className="w-full max-w-4xl mx-auto flex  justify-between items-center gap-4 bg-white border border-blue-500 p-2 rounded-2xl shadow-md">

        <div className="relative w-[70%] rounded-lg px-3 py-2 flex flex-wrap gap-2 bg-white">
          {/* Selected Locations */}
          {filterSearch.location.map((place, idx) => (
            <div
              key={idx}
              className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full shadow-sm"
              onClick={() => handleRemoveTag(place)}
            >
              {place} <span className="text-red-500 ml-2">x</span>
            </div>
          ))}

          {/* Input Field */}
          {!limitLocation && <input
            type="text"
            onChange={handleLocation}
            ref={locationInputRef}
            placeholder="Enter location..."
            className="flex-grow min-w-[150px] border-none outline-none text-sm text-gray-700 py-1 bg-transparent placeholder-gray-400"
          />}
          {/* Dropdown Suggestions */}
          {suggLocation && <div className="absolute w-[70%] max-h-[180px] overflow-y-auto bg-white shadow-md rounded-md mt-10 left-0 z-20 border border-gray-300">
            {locationDropDown.map((loc, idx) => (
              <h2
                key={idx}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 cursor-pointer"
                onClick={() => {
                  // setLocations(prev => prev.includes(loc) ? prev : [...prev, loc]);
                  setFilterSearch((prev) => ({
                    ...prev,
                    location: prev.location.includes(loc) ? prev.location : [...prev.location, loc]
                  }));
                  setLocationDropDown([]);
                  locationInputRef.current.value = "";
                  setSuggLocation(false);
                }}
              >
                {loc}
              </h2>
            ))}

          </div>}
        </div>

        <select
          onChange={handleSearchType}
          className="min-w-[120px] px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm"
        >
          <option value="Rent">Rent</option>
          <option value="Buy">Buy</option>
        </select>

        <select
          onChange={handlePropertyType}
          className="min-w-[140px] px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm"
        >
          <option value={""}>All</option>
          {flatProperty.length > 0 ? flatProperty.map((item, idx) => <option key={idx} value={item}>{item}</option>) : <option disabled>No suggestions available</option>}
        </select>

        <button
          onClick={handleRedirect}
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm transition duration-200">
          Search
        </button>
      </div>
      <div className="w-[57%] flex justify-end items-center cursor-pointer">
        <button
          onClick={() => setShowPopup(true)}
          className="border-b-2 border-b-blue-600 text-blue-800 px-4 py-0"
        >
          🔎 Advanced Search
        </button>
      </div>
      <div className="">
        <button className="p-3 bg-emerald-600 text-white cursor-pointer" onClick={() => router.push('/propertyListings')}>Properties</button>
      </div>
      <FilterPopup isOpen={showPopup} onClose={() => setShowPopup(false)} />
    </div>
  );
}

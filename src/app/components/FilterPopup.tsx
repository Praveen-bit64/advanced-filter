"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion"; // optional for animation
import getPropertyTypes from "@/app/data/propertyTypes.json";
import getLocation from "@/app/data/locations.json";
import getBedrooms from "@/app/data/bedrooms.json"
import getSize from "@/app/data/size.json"
import { p, pre, span } from "framer-motion/client";
import { useRouter } from "next/navigation";

type FilterPopupProps = {
    isOpen: boolean;
    onClose: () => void;
};

const FilterPopup = ({ isOpen, onClose }: FilterPopupProps) => {
    const router = useRouter()
    const [propertyTypes, setPropertyTypes] = useState(getPropertyTypes);
    const [bedrooms, setBedrooms] = useState([]);
    const [filtertypes, setFilterTypes] = useState(["Buy", "Rent"])
    const [locations, setLocations] = useState([]);
    const [sizeOptions, setSizeOptions] = useState([]);
    const [maxSizeOptions, setMaxSizeOptions] = useState([])
    const furnishingOptions = ["Furnished", "Semi Furnished", "Unfurnished"];
    const [selected, setSelected] = useState("rent");
    const locationInputRef = useRef(null);

    //for filter 
    const [filterprops, setFilterProps] = useState({
        filterType: "Rent",
        property: "Apartment",
        furnished: [],
        size: { minSize: 0, maxSize: 0 },
        budget: { min: 0, max: 0, err: false }
    })

    console.log(filterprops, 343);

    const [suggLocation, setSuggLocation] = useState(false);
    const [locationDropDown, setLocationDropDown] = useState([]);
    const [showMoreProp, setShowMoreProp] = useState(false)
    const [selectedBedrooms, setSelectedBedrooms] = useState([]);

    const handleResetFilter = () => {
        setFilterProps((prev) => ({
            ...prev,
            property: "Apartment",
            location: [],
            furnished: [],
            size: { minSize: 0, maxSize: 0 },
            budget: { min: 0, max: 0, err: false }
        }))
        setLocations([])
        setSelectedBedrooms([])
    }
    console.log(getLocation, 43434);

    useEffect(() => {
        // Mock data fetching
        // setPropertyTypes(["Apartment", "Villa", "Land", "Office"]);
        // setBedrooms(["Studio", "1BR", "2BR", "3BR", "4BR"]);
        // setLocations(["Manama", "Riffa", "Juffair", "Seef"]);
        // setSizeOptions(["50", "100", "200", "500", "1000"]);
    }, []);
    useEffect(() => {
        const betrooms = getBedrooms[filterprops.property] || [];
        const size = getSize[filterprops.property] || [];
        setBedrooms(betrooms && betrooms.length > 0 ? betrooms : []);
        setSizeOptions(size && size.length > 0 ? size : []);
        setMaxSizeOptions(size && size.length > 0 ? size : []);
        console.log(size);
    }, [filterprops.property]);

    if (!isOpen) return null;
    const handleFilterType = (e) => {
        const value = e.target.value
        setFilterProps((prev) => ({
            ...prev,
            filterType: value
        }))
    }

    const handleLocation = (e) => {
        const value = e.target.value;
        setSuggLocation(true);
        setLocationDropDown(getLocation.filter(item => (item).toLowerCase().includes(value.toLowerCase())))
        console.log(locationDropDown);
    }
    const handleRemoveTag = (val) => {
        setLocations((prev) => prev.filter(item => (item).toLowerCase() !== val.toLowerCase()))
    }
    const handleSize = (e) => {
        const size = e.target.value
        const name = e.target.name
        console.log("Selected size:", size, name);
        const sizeIdx = sizeOptions.findIndex((s) => s == size);

        if (sizeIdx !== -1 && name !== "maxSize") {
            const filtered = sizeOptions.slice(sizeIdx); // keep from sizeIdx to end
            setMaxSizeOptions(filtered);
            console.log("Updated maxSizeOptions:", filtered);
        } else {
            console.warn("Size not found in sizeOptions:", size);
        }
        if (size && name) {
            setFilterProps((prev) => ({
                ...prev,
                size: { ...prev.size, [name]: size }
            }))
        }
    };
    const handleFurnished = (e) => {
        const value = e.target.value;
        const isAlreadHad = filterprops.furnished.includes(value)
        if (isAlreadHad) {
            setFilterProps(prev => ({
                ...prev,
                furnished: [...(prev.furnished.filter(item => item !== value))]
            }))
        } else {
            setFilterProps((prev) => ({
                ...prev,
                furnished: [...(prev.furnished || []), value]
            }));
        };
    }
    const handleBudget = (e) => {
        const name = e.target.name;
        const value = Number(e.target.value);
        if (isNaN(value)) return;
        if (value < filterprops.budget.min) {
            setFilterProps((prev) => ({
                ...prev,
                budget: {
                    ...prev.budget,
                    err: true
                }
            }))
        } else {
            setFilterProps((prev) => ({
                ...prev,
                budget: {
                    ...prev.budget,
                    err: false
                }
            }))
        }
        setFilterProps((prev) => ({
            ...prev,
            budget: {
                ...prev.budget,
                [name === 'minBudget' ? 'min' : 'max']: value
            }
        }));
    };

    const handleRedirect = () => {
        const {
            property,
            filterType,
            size: { minSize, maxSize },
            furnished,
            budget: { min, max }
        } = filterprops;

        const queryParams = new URLSearchParams();

        queryParams.append('pType', property);
        queryParams.append('sType', filterType);

        if (locations.length > 0) {
            queryParams.append('pLocation', locations.join(','));
        }

        if (selectedBedrooms.length > 0) {
            queryParams.append('beds', selectedBedrooms.join(','));
        } else {
            queryParams.append('mnsize', minSize);
            if (maxSize !== 0) queryParams.append('mxsize', maxSize);
        }

        if (furnished.length > 0) {
            queryParams.append('frnsh', furnished.join(','));
        }

        if (min !== 0) queryParams.append('mnbug', min);
        if (max !== 0) queryParams.append('mxbug', max);

        router.push(`/properties?${queryParams.toString()}`);
    };



    return (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center backdrop-blur-sm">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white w-full max-w-3xl rounded-2xl p-8 shadow-2xl relative"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl font-bold"
                >
                    &times;
                </button>

                <h2 className="text-2xl font-semibold text-gray-800 mb-6">🔍 Advanced Property Search</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Rent / Buy */}
                    <div className="relative">

                        <div className="flex justify-center items-center gap-2">
                            {filtertypes.map((option) => (
                                <div key={option} className="relative flex justify-center items-center">
                                    <input
                                        type="radio"
                                        name="rentbuy"
                                        id={option}
                                        value={option}
                                        checked={filterprops.filterType === option}
                                        onChange={handleFilterType}
                                        className="hidden"
                                    />
                                    <label
                                        htmlFor={option}
                                        className={`cursor-pointer w-full px-12 py-2 rounded-full border-2 transition-all duration-300 ${filterprops.filterType === option ? "bg-blue-600 text-white" : "bg-white"} border-gray-300 text-gray-700 font-medium`}
                                    >
                                        {option.charAt(0).toUpperCase() + option.slice(1)}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Property Type */}
                    <div className="relative">
                        <label className="block text-lg font-medium text-gray-700 mb-1">Select Property</label>
                        <div className="w-full h-full flex justify-start items-center gap-2 flex-wrap">
                            {showMoreProp && propertyTypes.length > 4 ? propertyTypes.map((type, idx) => {
                                return (
                                    <React.Fragment key={type.name}>
                                        <input
                                            type="radio"
                                            name="propertyType"
                                            id={type.name}
                                            value={type.name}
                                            className="peer hidden"
                                            checked={filterprops.property === type.name}
                                            onChange={() =>
                                                setFilterProps(prev => ({
                                                    ...prev,
                                                    property: type.name,
                                                }))
                                            }
                                        />
                                        <label
                                            className={`${filterprops.property === type.name ? "bg-blue-600 text-white" : "bg-blue-50 border-1 border-blue-400"} cursor-pointer px-3 py-1 rounded`}
                                            htmlFor={type.name}
                                        >
                                            {type.name}
                                        </label>

                                    </React.Fragment>
                                );
                            }) : propertyTypes.slice(0, 4).map((type, idx) => {
                                return (
                                    <React.Fragment key={type.name}>
                                        <input
                                            type="radio"
                                            name="propertyType"
                                            id={type.name}
                                            value={type.name}
                                            className="peer hidden"
                                            checked={filterprops.property === type.name}
                                            onChange={() =>
                                                setFilterProps(prev => ({
                                                    ...prev,
                                                    property: type.name,
                                                }))
                                            }
                                        />
                                        <label
                                            className={`${filterprops.property === type.name ? "bg-blue-600 text-white" : "bg-blue-50 border-1 border-blue-400"} cursor-pointer px-3 py-1 rounded`}
                                            htmlFor={type.name}
                                        >
                                            {type.name}
                                        </label>

                                    </React.Fragment>
                                );
                            })}
                            <h5 onClick={() => setShowMoreProp(!showMoreProp)} className="cursor-pointer px-3 py-1 rounded underline text-blue-600">Show {`${showMoreProp ? "Less" : "More"}`}...</h5>
                        </div>
                    </div>

                    {/* Locations (multi-select simulation) */}
                    <div className="relative col-span-1 md:col-span-2">
                        <label className="block text-md font-semibold text-gray-800 mb-2">
                            Select Location(s)
                        </label>

                        <div className="w-[70%] border border-slate-300 rounded-lg px-3 py-2 flex flex-wrap gap-2 bg-white">
                            {/* Selected Locations */}
                            {locations.map((place, idx) => (
                                <div
                                    key={idx}
                                    className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full shadow-sm"
                                    onClick={() => handleRemoveTag(place)}
                                >
                                    {place} <span className="text-red-500 ml-2">x</span>
                                </div>
                            ))}

                            {/* Input Field */}
                            <input
                                type="text"
                                onChange={handleLocation}
                                ref={locationInputRef}
                                placeholder="Enter location..."
                                className="flex-grow min-w-[150px] border-none outline-none text-sm text-gray-700 py-1 bg-transparent placeholder-gray-400"
                            />
                        </div>

                        {/* Dropdown Suggestions */}
                        {suggLocation && <div className="absolute w-[70%] max-h-[180px] overflow-y-auto bg-white shadow-md rounded-md mt-2 z-20 border border-gray-300">
                            {locationDropDown.map((loc, idx) => (
                                <h2
                                    key={idx}
                                    className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 cursor-pointer"
                                    onClick={() => {
                                        setLocations(prev => prev.includes(loc) ? prev : [...prev, loc]);
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


                    {/* Bedrooms */}
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                        <div className="w-full flex flex-wrap gap-2">
                            {bedrooms.length > 0 ? bedrooms.map((item, idx) => {
                                const isChecked = selectedBedrooms.includes(item);

                                return (
                                    <React.Fragment key={idx}>
                                        <input
                                            type="checkbox"
                                            name="bedrooms"
                                            id={`bedroom-${item}`}
                                            checked={isChecked}
                                            onChange={(e) => {
                                                if (!isChecked) {
                                                    setSelectedBedrooms((prev) => [...prev, item]);
                                                } else {
                                                    setSelectedBedrooms((prev) => prev.filter((bed) => bed !== item));
                                                }
                                            }}
                                            className="hidden peer"
                                        />
                                        <label
                                            htmlFor={`bedroom-${item}`}
                                            className={`cursor-pointer px-3 py-1 rounded ${selectedBedrooms.includes(item) ? "bg-blue-600 text-white" : "border-1 border-blue-400 bg-blue-50"}`}
                                        >
                                            {item}
                                        </label>
                                    </React.Fragment>
                                );
                            }) : <span>Not Applicable for {filterprops.property}.</span>}
                        </div>
                    </div>


                    {/* Size */}
                    <div className="relative ">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Size (SQM)</label>
                        <div className="flex justify-center items-center gap-2">
                            {sizeOptions.length > 0 ? <div className="w-full flex justify-start items-start flex-col">
                                <select
                                    className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500 outline-none"
                                    onChange={handleSize}
                                    name="minSize"
                                >
                                    {sizeOptions.map((size) => (
                                        <option key={size} value={size}>
                                            {size}
                                        </option>
                                    ))}
                                </select>

                                <span className="ml-1 text-red-800">Min</span>
                            </div> : <p>Not Applicable.</p>}
                            {maxSizeOptions.length > 0 && <div className="w-full flex justify-start items-start flex-col">
                                <select
                                    name="maxSize"
                                    onChange={handleSize}
                                    className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500 outline-none">

                                    {maxSizeOptions.map((size) => (
                                        <option key={size} value={size}>{size}</option>
                                    ))}
                                </select>
                                <span className="ml-1 text-red-800">Max</span>
                            </div>}
                        </div>
                    </div>

                    {/* Furnishing */}
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Furnishing</label>
                        <div className="w-full flex justify-start items-center gap-2 flex-wrap">
                            {furnishingOptions.map((item, idx) => {
                                return (
                                    <div key={idx} className="">
                                        <input type="checkbox" name="furnished" onChange={handleFurnished} id={item} value={item} className="hidden" />
                                        <label htmlFor={item} className={`cursor-pointer p-2 rounded ${filterprops.furnished.includes(item) ? "bg-blue-600 text-white" : "border-1 border-blue-400 bg-blue-50"}`}>{item}</label>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Price / Rent */}
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rent / Price</label>
                        <div className="w-full flex justify-center items-center gap-1" >
                            <div className="flex flex-col w-full">
                                <input
                                    type="text"
                                    name="minBudget"
                                    placeholder="Min amount"
                                    value={filterprops.budget.min}
                                    onChange={handleBudget}
                                    className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                                <span className="ml-1 text-red-800">Min</span>
                            </div>
                            -
                            <div className="flex flex-col w-full">
                                <input
                                    type="text"
                                    name="maxBudget"
                                    value={filterprops.budget.max}
                                    onChange={handleBudget}
                                    placeholder="max amount"
                                    className={`w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 ${!filterprops.budget.err ? 'focus:ring-blue-500' : 'focus:ring-red-500'} outline-none`}
                                />
                                <span className="ml-1 text-red-800">Max</span>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="col-span-1 md:col-span-2 flex  justify-center mt-4 gap-5">
                        <div className="flex justify-center items-center underline text-blue-500 cursor-pointer" onClick={handleResetFilter}>Reset Filters</div>
                        <button
                            onClick={handleRedirect}
                            // type="submit"
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
                        >
                            🔎 Search Now
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default FilterPopup;

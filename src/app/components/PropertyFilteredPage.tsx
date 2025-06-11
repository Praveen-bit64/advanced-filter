'use client';
import { useSearchParams } from "next/navigation";
import getProperties from "@/app/data/propertyData.json";
import { useEffect, useState } from "react";
import { number } from "framer-motion";

const PropertyFilteredPage = () => {
    const searchParams = useSearchParams();

    const propertyType = searchParams.get('pType');
    const searchType = searchParams.get('sType');
    const filtLocation = searchParams.get('pLocation')?.split(",")
    const furnished = searchParams.get('frnsh')?.split(",")
    const bedrooms = searchParams.get('beds')?.split(",")
    const minSize = searchParams.get('mnsize')
    const maxSize = searchParams.get('mxsize')
    const minBudget = searchParams.get('mnbug')
    const maxBudget = searchParams.get('mxbug')
    const [properties, setProperties] = useState(getProperties)
    console.log(propertyType, furnished, bedrooms, minSize, maxSize, minBudget, maxBudget);
    useEffect(() => {
        let filteredProps = getProperties;
        console.log(filteredProps);
        if (propertyType) {
            filteredProps = filteredProps.filter(item => item.propertyType.toLowerCase() === propertyType.toLowerCase())
        }
        if (searchType) {
            filteredProps = filteredProps.filter(item => item.saleType.toLowerCase() === searchType.toLowerCase())
        }
        if (filtLocation) {
            filteredProps = filteredProps.filter(item => filtLocation.some(loc => item.location.toLowerCase().includes(loc.toLowerCase().trim())))
        }
        if (bedrooms) {
            filteredProps = filteredProps.filter(item => bedrooms.some(bed => item.bedrooms?.toLowerCase()?.includes(bed.toLowerCase().trim())))
        }
        if (Number(minBudget) > 0) {
            filteredProps = filteredProps.filter(item => item.price >= Number(minBudget))
        }
        if (Number(maxBudget) >= Number(minBudget) && Number(maxBudget) !== 0) {
            filteredProps = filteredProps.filter(item => item.price <= Number(maxBudget))
        }
        if (Number(minSize) > 0) {
            filteredProps = filteredProps.filter(item => Number(item.size) >= Number(minSize))
        }
        if (Number(maxSize) >= Number(minSize) && Number(maxSize) !== 0) {
            filteredProps = filteredProps.filter(item => Number(item.size) <= Number(maxSize))
        }
        console.log(filteredProps);

        setProperties(filteredProps)
    }, [propertyType, searchType])

    return (
        <div className="w-full h-full flex justify-center items-center flex-wrap gap-5 mt-10">
            {properties.length > 0 ? properties.map((item, idx) => {
                return (
                    <div key={idx} className="max-w-sm w-full bg-white rounded-2xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl border border-gray-100">
                        <div className="relative">
                            <img
                                src={item.image}
                                alt={item.propertyType}
                                className="w-full h-48 object-cover"
                            />
                            <span className={`absolute top-2 left-2 ${item.saleType == 'Rent' ? 'bg-fuchsia-500' : 'bg-emerald-500'} text-white text-sm px-5 py-2 rounded-lg shadow`}>
                                {item.saleType}
                            </span>
                        </div>
                        <div className="p-5">
                            <h2 className="text-lg font-bold text-gray-800 mb-1">
                                {item.title}
                            </h2>
                            <p className="text-sm text-gray-500 mb-3">Ref: {item.reference}</p>

                            <div className="space-y-1 text-sm text-gray-600">
                                <p><span className="font-medium text-gray-700">📍 Location:</span> {item.location}</p>
                                <p><span className="font-medium text-gray-700">{item.bedrooms ? "🛏️ Bedrooms:" : "Size (Sqm):"}</span> {item?.bedrooms || item.size}</p>
                                {/* Add conditionally only if size exists */}
                                {/* <p><span className="font-medium text-gray-700">📐 Size:</span> 800 SQM</p> */}
                            </div>

                            <div className="mt-4 flex items-center justify-between">
                                <span className="text-emerald-700 text-xl font-semibold">$ {item.price}</span>
                                <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-1.5 rounded-full shadow transition">
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }) : <p>No Result Found!</p>}
        </div>

    );
}

export default PropertyFilteredPage;
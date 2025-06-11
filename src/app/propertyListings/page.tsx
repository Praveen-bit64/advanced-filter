"use client";

import { Suspense } from "react";
import PropertyFilteredPage from "../components/PropertyFilteredPage";

const page = () => {
    return (
        <Suspense fallback={<div>Loading properties...</div>}>
            <PropertyFilteredPage />
        </Suspense>
    );
}

export default page;
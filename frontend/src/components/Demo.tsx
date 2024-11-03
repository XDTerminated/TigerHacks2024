"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Plus } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { ResetButtons } from "./ResetButtons";
import { ImageUploader } from "../components/ImageUploader";
import { useAuth } from "../context/AuthContext";

type Metric = {
    name: string;
    value: number;
    current: number;
    max: number;
    unit: string;
};

type MetricType = "fit" | "bodyBuilder" | "gainWeight" | "loseWeight";

const defaultMetrics = [
    { name: "Calories", value: 0, current: 0, max: 2000, unit: "kcal" },
    { name: "Total Fat", value: 0, current: 0, max: 78, unit: "g" },
    { name: "Cholesterol", value: 0, current: 0, max: 300, unit: "mg" },
    { name: "Sodium", value: 0, current: 0, max: 2300, unit: "mg" },
    { name: "Total Carbohydrates", value: 0, current: 0, max: 275, unit: "g" },
    { name: "Protein", value: 0, current: 0, max: 50, unit: "g" },
];

const metricsOptions = {
    fit: [
        { name: "Calories", max: 1800 },
        { name: "Total Fat", max: 60 },
        { name: "Cholesterol", max: 200 },
        { name: "Sodium", max: 2000 },
        { name: "Total Carbohydrates", max: 250 },
        { name: "Protein", max: 60 },
    ],
    bodyBuilder: [
        { name: "Calories", max: 2500 },
        { name: "Total Fat", max: 80 },
        { name: "Cholesterol", max: 300 },
        { name: "Sodium", max: 2400 },
        { name: "Total Carbohydrates", max: 300 },
        { name: "Protein", max: 120 },
    ],
    gainWeight: [
        { name: "Calories", max: 3000 },
        { name: "Total Fat", max: 100 },
        { name: "Cholesterol", max: 350 },
        { name: "Sodium", max: 2500 },
        { name: "Total Carbohydrates", max: 350 },
        { name: "Protein", max: 100 },
    ],
    loseWeight: [
        { name: "Calories", max: 1500 },
        { name: "Total Fat", max: 50 },
        { name: "Cholesterol", max: 200 },
        { name: "Sodium", max: 1800 },
        { name: "Total Carbohydrates", max: 200 },
        { name: "Protein", max: 70 },
    ],
};

export function Demo() {
    const progressSectionRef = useRef<HTMLDivElement>(null);
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const { isAuthenticated } = useAuth();
    const [metrics, setMetrics] = useState<Metric[]>(defaultMetrics);
    const [selectedGoal, setSelectedGoal] = useState<MetricType | "">("");
    const [isLoading, setIsLoading] = useState(false);
    const [ingredients, setIngredients] = useState<string>("");
    const [imageData, setImageData] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Fetch user data when authenticated
    useEffect(() => {
        if (!isAuthenticated) return;

        // In Demo.tsx, update the fetch call:

        // In Demo.tsx, update the fetch logic:

        // Update the fetch user data function to properly handle errors
        const fetchUserData = async () => {
            if (!isAuthenticated) return;

            try {
                const token = localStorage.getItem("access_token");
                if (!token) return;

                const response = await fetch("http://localhost:8000/api/v1/user-nutrition/", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) throw new Error("Failed to fetch user data");

                const data = await response.json();
                console.log("Fetched data:", data); // Debug log

                setMetrics((prev) =>
                    prev.map((metric) => {
                        const name = metric.name.toLowerCase().replace(" ", "_");
                        // Special handling for carbohydrates
                        const value = name === "total_carbohydrates" ? data["carbohydrates"] : data[name];
                        const maxValue = name === "total_carbohydrates" ? data["carbohydrates_limit"] : data[`${name}_limit`];

                        return {
                            ...metric,
                            value: value || 0,
                            max: maxValue || metric.max,
                        };
                    })
                );

                if (data.selected_goal) {
                    setSelectedGoal(data.selected_goal);
                }
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            }
        };

        fetchUserData();
    }, [isAuthenticated]);

    // In Demo.tsx, modify the saveUserData function and add a proper user check

    // Update the saveUserData function to handle carbohydrates correctly
    const saveUserData = useCallback(async () => {
        if (!isAuthenticated) return;

        try {
            const token = localStorage.getItem("access_token");
            if (!token) return;

            // Fix the naming for carbohydrates
            const data = {
                calories: metrics[0].value,
                total_fat: metrics[1].value,
                cholesterol: metrics[2].value,
                sodium: metrics[3].value,
                carbohydrates: metrics[4].value, // Make sure index is correct
                protein: metrics[5].value,
                calories_limit: metrics[0].max,
                total_fat_limit: metrics[1].max,
                cholesterol_limit: metrics[2].max,
                sodium_limit: metrics[3].max,
                carbohydrates_limit: metrics[4].max, // Make sure index is correct
                protein_limit: metrics[5].max,
                selected_goal: selectedGoal,
            };

            console.log("Saving data:", data); // Debug log

            const response = await fetch("http://localhost:8000/api/v1/user-nutrition/", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error("Failed to save data");
            }

            const savedData = await response.json();
            console.log("Saved data:", savedData); // Debug log
        } catch (error) {
            console.error("Failed to save user data:", error);
        }
    }, [metrics, selectedGoal, isAuthenticated]);
    // Add data restoration logic
    // Update the data fetching logic in useEffect
    useEffect(() => {
        const fetchUserData = async () => {
            if (!isAuthenticated) return;

            try {
                const token = localStorage.getItem("access_token");
                if (!token) return;

                const response = await fetch("http://localhost:8000/api/v1/user-nutrition/", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) throw new Error("Failed to fetch user data");

                const data = await response.json();
                console.log("Received data:", data); // Debug log

                setMetrics((prev) =>
                    prev.map((metric) => {
                        // Handle field name mapping
                        let value = 0;
                        let maxValue = metric.max;

                        if (metric.name === "Total Carbohydrates") {
                            value = data.carbohydrates || 0;
                            maxValue = data.carbohydrates_limit || metric.max;
                        } else {
                            const fieldName = metric.name.toLowerCase().replace(/\s+/g, "_");
                            value = data[fieldName] || 0;
                            maxValue = data[`${fieldName}_limit`] || metric.max;
                        }

                        console.log(`Mapping ${metric.name}:`, { value, maxValue }); // Debug log

                        return {
                            ...metric,
                            value: value,
                            max: maxValue,
                        };
                    })
                );

                if (data.selected_goal) {
                    setSelectedGoal(data.selected_goal);
                }
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            }
        };

        fetchUserData();
    }, [isAuthenticated]);

    const setCustomMetrics = (type: MetricType) => {
        const selectedMetrics = metricsOptions[type];
        setMetrics((currentMetrics) =>
            currentMetrics.map((metric, index) => ({
                ...metric,
                max: selectedMetrics[index]?.max ?? metric.max,
            }))
        );
    };

    const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const goal = e.target.value as MetricType;
        setSelectedGoal(goal);
        setCustomMetrics(goal);
        saveUserData();
    };

    // Update handleMaxChange
    const handleMaxChange = (index: number, value: string) => {
        const newValue = value === "" ? 0 : Math.max(0, parseInt(value));
        if (!isNaN(newValue)) {
            setMetrics((current) => current.map((metric, i) => (i === index ? { ...metric, max: newValue } : metric)));
        }
    };

    // Update the addToDailyTotal function
    const addToDailyTotal = () => {
        setMetrics((current) =>
            current.map((metric) => ({
                ...metric,
                value: metric.value + metric.current,
            }))
        );
    };
    // In Demo.tsx, update the resetProgress function
    const resetProgress = useCallback(async () => {
        try {
            // First update local state
            setMetrics((current) =>
                current.map((metric) => ({
                    ...metric,
                    value: 0,
                }))
            );

            // Then update database
            const token = localStorage.getItem("access_token");
            if (!token || !isAuthenticated) return;

            const data = {
                calories: 0,
                total_fat: 0,
                cholesterol: 0,
                sodium: 0,
                carbohydrates: 0,
                protein: 0,
                calories_limit: metrics[0].max,
                total_fat_limit: metrics[1].max,
                cholesterol_limit: metrics[2].max,
                sodium_limit: metrics[3].max,
                carbohydrates_limit: metrics[4].max,
                protein_limit: metrics[5].max,
                selected_goal: selectedGoal,
            };

            const response = await fetch("http://localhost:8000/api/v1/user-nutrition/", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error("Failed to reset progress");
            }
        } catch (error) {
            console.error("Failed to reset progress:", error);
        }
    }, [metrics, selectedGoal, isAuthenticated]);

    // Update resetMaxValues to include database persistence
    const resetMaxValues = useCallback(async () => {
        try {
            // First update local state
            setMetrics((current) =>
                current.map((metric, index) => ({
                    ...metric,
                    max: defaultMetrics[index].max,
                }))
            );
            setSelectedGoal("");

            // Then update database
            const token = localStorage.getItem("access_token");
            if (!token || !isAuthenticated) return;

            const data = {
                calories: metrics[0].value,
                total_fat: metrics[1].value,
                cholesterol: metrics[2].value,
                sodium: metrics[3].value,
                carbohydrates: metrics[4].value,
                protein: metrics[5].value,
                calories_limit: defaultMetrics[0].max,
                total_fat_limit: defaultMetrics[1].max,
                cholesterol_limit: defaultMetrics[2].max,
                sodium_limit: defaultMetrics[3].max,
                carbohydrates_limit: defaultMetrics[4].max,
                protein_limit: defaultMetrics[5].max,
                selected_goal: "",
            };

            const response = await fetch("http://localhost:8000/api/v1/user-nutrition/", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error("Failed to reset max values");
            }
        } catch (error) {
            console.error("Failed to reset max values:", error);
        }
    }, [metrics, isAuthenticated]);

    useEffect(() => {
        if (isAuthenticated && metrics.some((metric) => metric.max !== defaultMetrics[0].max)) {
            saveUserData();
        }
    }, [metrics, isAuthenticated, saveUserData]);

    const preventInvalidInput = (e: { key: string; preventDefault: () => void }) => {
        const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];
        if (allowedKeys.includes(e.key)) return;
        if (["-", ".", "e"].includes(e.key) || isNaN(Number(e.key))) {
            e.preventDefault();
        }
    };

    const handleImageUpload = async (file: File) => {
        setError(null);
        setIsLoading(true);
        setImageData(null);

        if (!file.type.startsWith("image/")) {
            setError("Please upload an image file");
            setIsLoading(false);
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError("Image size should be less than 5MB");
            setIsLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append("image", file);

        try {
            const response = await fetch("http://127.0.0.1:8000/api/v1/nutrition/", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Unable to process the image. Please try again.");
            }

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error.message);
            }

            setImageData(URL.createObjectURL(file));
            setIngredients(data.ingredients || "");

            if (Array.isArray(data.nutrition) && data.nutrition.length === 6) {
                setMetrics((current) =>
                    current.map((metric, index) => ({
                        ...metric,
                        current: data.nutrition[index] || 0,
                    }))
                );
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred while processing the image");
            setImageData(null);
        } finally {
            setIsLoading(false);
        }
    };

    const removeImage = () => {
        setImageData(null);
        setError(null);
        setIngredients("");
        setMetrics((current) =>
            current.map((metric) => ({
                ...metric,
                current: 0,
            }))
        );
    };

    const formatIngredients = (ingredients: string) => {
        if (!ingredients) return null;
        return ingredients
            .split("\n")
            .filter(Boolean)
            .map((ingredient, index) => (
                <li key={index} className="mb-2 last:mb-0 flex items-start">
                    <span className="mr-2">•</span>
                    <span>{ingredient.trim()}</span>
                </li>
            ));
    };

    const hasNonDefaultMax = metrics.some((metric, index) => metric.max !== defaultMetrics[index].max);

    return (
        <section id="demo" className="pt-32 pb-16 bg-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-white mb-4">Try It Now</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">Upload a photo of your meal to see NutriLens in action</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={inView ? { opacity: 1, scale: 1 } : {}} className="bg-gray-900 rounded-xl p-8 mb-8">
                    <ImageUploader isLoading={isLoading} error={error} imageData={imageData} onImageUpload={handleImageUpload} onImageRemove={removeImage} />
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={inView ? { opacity: 1, scale: 1 } : {}} className="bg-gray-900 rounded-xl p-6">
                        <h3 className="text-xl font-semibold text-white mb-4">Detected Ingredients</h3>
                        <div className="text-gray-400 h-[280px] overflow-y-auto">{ingredients ? <ul className="text-gray-400 list-none">{formatIngredients(ingredients)}</ul> : <p className="text-center text-gray-500 italic">No ingredients detected yet</p>}</div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={inView ? { opacity: 1, scale: 1 } : {}} className="bg-gray-900 rounded-xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold text-white">Nutrition Facts</h3>
                            <button onClick={addToDailyTotal} className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                <span>Add to Daily Total</span>
                            </button>
                        </div>

                        <div className="space-y-4 h-[280px]">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm text-gray-400">
                                    <span>Calories</span>
                                    <span>{metrics[0].current} kcal</span>
                                </div>
                                <div className="h-[1px] bg-gray-700" />
                            </div>
                            <div className="space-y-6">
                                {metrics.slice(1).map((metric, index) => (
                                    <div key={index} className="flex justify-between text-sm text-gray-400">
                                        <span>{metric.name}</span>
                                        <span>
                                            {metric.current}
                                            {metric.unit}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>

                <motion.div ref={progressSectionRef} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.3 }} className="mt-12 flex flex-col items-center scroll-mt-8 pt-12">
                    <div className="w-[calc(48rem+1rem)] flex flex-col space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-semibold text-white">Daily Progress</h3>
                            <label htmlFor="metric-select" className="text-white mb- block">
                                {" "}
                            </label>

                            <ResetButtons hasNonDefaultMax={hasNonDefaultMax} onResetMaxValues={resetMaxValues} onResetProgress={resetProgress} />
                        </div>

                        <div className="grid grid-cols-3 gap-x-4 gap-y-12">
                            {metrics.map((metric, index) => (
                                <div key={index} className="text-center">
                                    <div className="relative inline-block">
                                        <svg className="w-48 h-48 transform -rotate-90">
                                            <circle cx="96" cy="96" r="88" fill="transparent" stroke="#1f2937" strokeWidth="12" />
                                            <circle cx="96" cy="96" r="88" fill="transparent" stroke="#38bdf8" strokeWidth="12" strokeDasharray={2 * Math.PI * 88} strokeDashoffset={2 * Math.PI * 88 * Math.max(0, Math.min(1, 1 - metric.value / metric.max))} className="transition-all duration-500" />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="text-3xl text-white font-semibold">{metric.value}</span>
                                            <div className="w-16 h-[1px] bg-gray-600 my-2" />
                                            <div className="flex items-center gap-1">
                                                <input type="number" value={metric.max || ""} onChange={(e) => handleMaxChange(index, e.target.value)} onKeyDown={preventInvalidInput} placeholder="0" min="0" max="999999" step="1" className="w-16 bg-transparent text-gray-400 hover:bg-gray-800 focus:bg-gray-800 focus:outline-none text-center rounded text-sm" title="Click to edit daily limit" />
                                                <span className="text-gray-500 text-sm">{metric.unit}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-gray-400 mt-3 text-base">{metric.name}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8">
                            <label htmlFor="metric-select" className="text-white mb-2 block"></label>
                            <select id="metric-select" onChange={handleDropdownChange} value={selectedGoal} className="w-full py-2 px-3 rounded-lg bg-gray-900 text-gray-300 border border-gray-700 hover:border-sky-400 focus:border-sky-500 focus:outline-none transition-colors">
                                <option value="" disabled>
                                    Select your goal
                                </option>
                                <option value="fit">Fit</option>
                                <option value="bodyBuilder">Body-Builder</option>
                                <option value="gainWeight">Gain Weight</option>
                                <option value="loseWeight">Lose Weight</option>
                            </select>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

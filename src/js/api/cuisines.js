// fetch All Cuisines and display
// https://nutriplan-api.vercel.app/api/meals/areas

import { mealsUrl } from "../main.js";

export async function getCuisines() {
  try {
    const response = await fetch(`${mealsUrl}areas`);
    if (!response.ok) {
      throw new Error("Failed to fetch cuisines");
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching cuisines:", error);
    throw error;
  }
}

export async function displayCuisines() {
  try {
    let cuisinesList = await getCuisines();
    let temp = `<button class="area-filter-btn px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap hover:bg-emerald-700 hover:text-white transition-all bg-emerald-600 text-white" data-area="All Cuisines">
            All Cuisines
        </button>`;
    cuisinesList.slice(0, 10).forEach((cuisine) => {
      temp += `<button class="area-filter-btn px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap hover:bg-gray-200 transition-all bg-gray-100 text-gray-700" data-area="${cuisine.name}">
                ${cuisine.name}
            </button>`;
    });
    document.getElementById("cuisines-container").innerHTML = temp;
  } catch (error) {
    console.error("Error displaying cuisines:", error);
  }
}

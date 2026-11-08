// fetch recipes and show 25 recipes
import { mealsUrl } from "../main.js";

export async function getRecipes(page = 1, limit = 25) {
  try {
    const response = await fetch(
      `${mealsUrl}search?q=&page=${page}&limit=${limit}`,
    );
    if (!response.ok) {
      throw new Error("Failed to fetch recipes");
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching recipes:", error);
    throw error;
  }
}

// display recipes
const recipesGrid = document.getElementById("recipes-grid");
const recipesCount = document.getElementById("recipes-count");
export async function displayRecipes(recipesList = null, searchValue = "") {
  try {
    if (!recipesList) {
      recipesList = await getRecipes();
    }

    if (!recipesList || recipesList.length === 0) {
      recipesGrid.innerHTML = `<div class="flex flex-col items-center justify-center py-12 text-center">
                                        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                            <i class="text-2xl text-gray-400" data-fa-i2svg=""><svg class="svg-inline--fa fa-magnifying-glass" data-prefix="fas" data-icon="magnifying-glass" role="img" viewBox="0 0 512 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376C296.3 401.1 253.9 416 208 416 93.1 416 0 322.9 0 208S93.1 0 208 0 416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"></path></svg></i>
                                        </div>
                                        <p class="text-gray-500 text-lg">No recipes found. Try a different search term.</p>
                                    </div>`;
      // Showing 0 recipes for "search term"
      recipesCount.innerHTML = `Showing ${recipesList.length} recipes for "${searchValue}"`;
      return;
    }

    let temp = "";
    recipesList.forEach((recipe) => {
      temp += `<div class="recipe-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group" data-meal-id="${recipe.id}">
                <div class="relative h-48 overflow-hidden">
                    <img class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="${recipe.thumbnail}" alt="${recipe.name}" loading="lazy">
                    <div class="recipe-badge absolute bottom-3 left-3 flex gap-2">
                    <span class="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold rounded-full text-gray-700">
                        ${recipe.category}
                    </span>
                    ${
                      recipe.area
                        ? `
                    <span class="px-2 py-1 bg-emerald-500 text-xs font-semibold rounded-full text-white">
                        ${recipe.area}
                    </span>
                    `
                        : ""
                    }
                    </div>
                </div>
                <div class="p-4">
                    <h3 class="text-base font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1">
                        ${recipe.name}
                    </h3>
                    <p class="text-xs text-gray-600 mb-3 line-clamp-2">
                        ${recipe.instructions}
                    </p>
                    <div class="flex items-center justify-between text-xs">
                    <span class="font-semibold text-gray-900">
                        <i class="mr-1 text-emerald-600" data-fa-i2svg=""><svg class="svg-inline--fa fa-utensils" data-prefix="fas" data-icon="utensils" role="img" viewBox="0 0 512 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M63.9 14.4C63.1 6.2 56.2 0 48 0s-15.1 6.2-16 14.3L17.9 149.7c-1.3 6-1.9 12.1-1.9 18.2 0 45.9 35.1 83.6 80 87.7L96 480c0 17.7 14.3 32 32 32s32-14.3 32-32l0-224.4c44.9-4.1 80-41.8 80-87.7 0-6.1-.6-12.2-1.9-18.2L223.9 14.3C223.1 6.2 216.2 0 208 0s-15.1 6.2-15.9 14.4L178.5 149.9c-.6 5.7-5.4 10.1-11.1 10.1-5.8 0-10.6-4.4-11.2-10.2L143.9 14.6C143.2 6.3 136.3 0 128 0s-15.2 6.3-15.9 14.6L99.8 149.8c-.5 5.8-5.4 10.2-11.2 10.2-5.8 0-10.6-4.4-11.1-10.1L63.9 14.4zM448 0C432 0 320 32 320 176l0 112c0 35.3 28.7 64 64 64l32 0 0 128c0 17.7 14.3 32 32 32s32-14.3 32-32l0-448c0-17.7-14.3-32-32-32z"></path></svg></i>
                        ${recipe.category}
                    </span>
                    ${
                      recipe.area
                        ? `
                    <span class="font-semibold text-gray-500">
                        <i class="mr-1 text-blue-500" data-fa-i2svg=""><svg class="svg-inline--fa fa-globe" data-prefix="fas" data-icon="globe" role="img" viewBox="0 0 512 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M351.9 280l-190.9 0c2.9 64.5 17.2 123.9 37.5 167.4 11.4 24.5 23.7 41.8 35.1 52.4 11.2 10.5 18.9 12.2 22.9 12.2s11.7-1.7 22.9-12.2c11.4-10.6 23.7-28 35.1-52.4 20.3-43.5 34.6-102.9 37.5-167.4zM160.9 232l190.9 0C349 167.5 334.7 108.1 314.4 64.6 303 40.2 290.7 22.8 279.3 12.2 268.1 1.7 260.4 0 256.4 0s-11.7 1.7-22.9 12.2c-11.4 10.6-23.7 28-35.1 52.4-20.3 43.5-34.6 102.9-37.5 167.4zm-48 0C116.4 146.4 138.5 66.9 170.8 14.7 78.7 47.3 10.9 131.2 1.5 232l111.4 0zM1.5 280c9.4 100.8 77.2 184.7 169.3 217.3-32.3-52.2-54.4-131.7-57.9-217.3L1.5 280zm398.4 0c-3.5 85.6-25.6 165.1-57.9 217.3 92.1-32.7 159.9-116.5 169.3-217.3l-111.4 0zm111.4-48C501.9 131.2 434.1 47.3 342 14.7 374.3 66.9 396.4 146.4 399.9 232l111.4 0z"></path></svg></i>
                        ${recipe.area}
                    </span>
                    `
                        : ""
                    }
                    </div>
                </div>
                </div>`;
    });
    recipesGrid.innerHTML = temp;
    recipesCount.innerHTML = `Showing ${recipesList.length} ${searchValue ? `${searchValue} recipes` : "recipes"}`;
  } catch (error) {
    console.error("Error displaying recipes:", error);
    throw error;
  }
}

// load spiner
export function displaySpinner() {
  recipesGrid.innerHTML = `
        <div class="flex items-center justify-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
    `;
}

// search recipes
export async function searchRecipes(searchValue, page = 1, limit = 25) {
  try {
    const response = await fetch(
      `${mealsUrl}search?q=${encodeURIComponent(searchValue)}&page=${page}&limit=${limit}`,
    );
    if (!response.ok) {
      throw new Error("Failed to search recipes");
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error searching recipes:", error);
    throw error;
  }
}

// filter recipes by category
export async function filterRecipesByCategory(category, page = 1, limit = 25) {
  try {
    const response = await fetch(
      `${mealsUrl}filter?category=${encodeURIComponent(category)}&page=${page}&limit=${limit}`,
    );
    if (!response.ok) {
      throw new Error("Failed to filter recipes");
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error filtering recipes:", error);
    throw error;
  }
}

// filter recipes by area
export async function filterRecipesByArea(area, page = 1, limit = 25) {
  try {
    const response = await fetch(
      `${mealsUrl}filter?area=${encodeURIComponent(area)}&page=${page}&limit=${limit}`,
    );
    if (!response.ok) {
      throw new Error("Failed to filter recipes");
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error filtering recipes:", error);
    throw error;
  }
}

// get recipe by id
export async function getRecipeById(id) {
  try {
    const response = await fetch(`${mealsUrl}${id}`);
    if (!response.ok) {
      throw new Error("Failed to get recipe");
    }
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error("Error getting recipe:", error);
    throw error;
  }
}

// display meal details
const mealDetailsSection = document.getElementById("meal-details");
export function displayMealDetails(recipe, nutrition) {
  let ingredients = "";
  for (let i = 0; i < recipe.ingredients.length; i++) {
    ingredients += `<div
                        class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors"
                    >
                        <input
                        type="checkbox"
                        class="ingredient-checkbox w-5 h-5 text-emerald-600 rounded border-gray-300"
                        />
                        <span class="text-gray-700">
                        <span class="font-medium text-gray-900">${recipe.ingredients[i].measure}</span>
                        ${recipe.ingredients[i].ingredient}
                        </span>
                    </div>`;
  }

  let instructions = "";
  for (let i = 0; i < recipe.instructions.length; i++) {
    instructions += `<div
                        class="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                        <div
                        class="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0"
                        >
                        ${i + 1}
                        </div>
                        <p class="text-gray-700 leading-relaxed pt-2">
                        ${recipe.instructions[i]}
                        </p>
                    </div>`;
  }

  let totalCalories = nutrition.perServing.calories * nutrition.servings;
  mealDetailsSection.innerHTML = `<div class="max-w-7xl mx-auto">
            <!-- Back Button -->
            <button
                id="back-to-meals-btn"
                class="flex items-center gap-2 text-gray-600 hover:text-emerald-600 font-medium mb-6 transition-colors"
            >
                <i class="fa-solid fa-arrow-left"></i>
                <span>Back to Recipes</span>
            </button>

            <!-- Hero Section -->
            <div class="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
                <div class="relative h-80 md:h-96">
                <img
                    src="${recipe.thumbnail}"
                    alt="${recipe.name}"
                    class="w-full h-full object-cover"
                />
                <div
                    class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
                ></div>
                <div class="absolute bottom-0 left-0 right-0 p-8">
                    <div class="flex items-center gap-3 mb-3">
                    ${
                      recipe.category
                        ? `
                    <span
                        class="px-3 py-1 bg-emerald-500 text-white text-sm font-semibold rounded-full"
                        >${recipe.category}</span
                    >`
                        : ""
                    }
                    ${
                      recipe.area
                        ? `
                    <span
                        class="px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full"
                        >${recipe.area}</span
                    >`
                        : ""
                    }
                    ${
                      recipe.tags && recipe.tags.length > 0
                        ? `
                    <span
                        class="px-3 py-1 bg-purple-500 text-white text-sm font-semibold rounded-full"
                        >${recipe.tags[0]}</span
                    >`
                        : ""
                    }
                    ${
                      recipe.tags && recipe.tags.length > 1
                        ? `
                    <span
                        class="px-3 py-1 bg-purple-500 text-white text-sm font-semibold rounded-full"
                        >${recipe.tags[1]}</span
                    >`
                        : ""
                    }
                    </div>
                    <h1 class="text-3xl md:text-4xl font-bold text-white mb-2">
                    ${recipe.name}
                    </h1>
                    <div class="flex items-center gap-6 text-white/90">
                    <span class="flex items-center gap-2">
                        <i class="fa-solid fa-clock"></i>
                        <span>30 min</span>
                    </span>
                    <span class="flex items-center gap-2">
                        <i class="fa-solid fa-utensils"></i>
                        <span id="hero-servings">${nutrition.perServing.servings ? nutrition.perServing.servings : 4} servings</span>
                    </span>
                    <span class="flex items-center gap-2">
                        <i class="fa-solid fa-fire"></i>
                        <span id="hero-calories">${nutrition.perServing.calories} cal/serving</span>
                    </span>
                    </div>
                </div>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-wrap gap-3 mb-8">
                <button
                id="log-meal-btn"
                class="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all"
                data-meal-id="52772"
                >
                <i class="fa-solid fa-clipboard-list"></i>
                <span>Log This Meal</span>
                </button>
            </div>

            <!-- Main Content Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Left Column - Ingredients & Instructions -->
                <div class="lg:col-span-2 space-y-8">
                <!-- Ingredients -->
                <div class="bg-white rounded-2xl shadow-lg p-6">
                    <h2
                    class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"
                    >
                    <i class="fa-solid fa-list-check text-emerald-600"></i>
                    Ingredients
                    <span class="text-sm font-normal text-gray-500 ml-auto"
                        >${recipe.ingredients.length} items</span
                    >
                    </h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        ${ingredients}
                    </div>
                </div>

                <!-- Instructions -->
                <div class="bg-white rounded-2xl shadow-lg p-6">
                    <h2
                    class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"
                    >
                    <i class="fa-solid fa-shoe-prints text-emerald-600"></i>
                    Instructions
                    </h2>
                    <div class="space-y-4">
                    ${instructions}
                    </div>
                </div>

                <!-- Video Section -->
                <div class="bg-white rounded-2xl shadow-lg p-6">
                    <h2
                    class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"
                    >
                    <i class="fa-solid fa-video text-red-500"></i>
                    Video Tutorial
                    </h2>
                    <div
                    class="relative aspect-video rounded-xl overflow-hidden bg-gray-100"
                    >
                    ${
                      recipe.youtube
                        ? `
                    <iframe
                        src="${recipe.youtube}"
                        class="absolute inset-0 w-full h-full"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen
                    >
                    </iframe>
                    `
                        : ""
                    }
                    </div>
                </div>
                </div>

                <!-- Right Column - Nutrition -->
                <div class="space-y-6">
                <!-- Nutrition Facts -->
                <div class="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                    <h2
                    class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"
                    >
                    <i class="fa-solid fa-chart-pie text-emerald-600"></i>
                    Nutrition Facts
                    </h2>
                    <div id="nutrition-facts-container">
                    <p class="text-sm text-gray-500 mb-4">Per serving</p>

                    <div
                        class="text-center py-4 mb-4 bg-linear-to-br from-emerald-50 to-teal-50 rounded-xl"
                    >
                        <p class="text-sm text-gray-600">Calories per serving</p>
                        <p class="text-4xl font-bold text-emerald-600">${nutrition.perServing.calories}</p>
                        <p class="text-xs text-gray-500 mt-1">Total: ${totalCalories} cal</p>
                    </div>

                    <div class="space-y-4">
                        <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
                            <span class="text-gray-700">Protein</span>
                        </div>
                        <span class="font-bold text-gray-900">${nutrition.perServing.protein}g</span>
                        </div>
                        <div class="w-full bg-gray-100 rounded-full h-2">
                        <div
                            class="bg-emerald-500 h-2 rounded-full"
                            style="width: calc(${nutrition.perServing.protein} / 100 * 100%)"
                        ></div>
                        </div>

                        <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <div class="w-3 h-3 rounded-full bg-blue-500"></div>
                            <span class="text-gray-700">Carbs</span>
                        </div>
                        <span class="font-bold text-gray-900">${nutrition.perServing.carbs}g</span>
                        </div>
                        <div class="w-full bg-gray-100 rounded-full h-2">
                        <div
                            class="bg-blue-500 h-2 rounded-full"
                            style="width: calc(${nutrition.perServing.carbs} / 100 * 100%)"
                        ></div>
                        </div>

                        <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <div class="w-3 h-3 rounded-full bg-purple-500"></div>
                            <span class="text-gray-700">Fat</span>
                        </div>
                        <span class="font-bold text-gray-900">${nutrition.perServing.fat}g</span>
                        </div>
                        <div class="w-full bg-gray-100 rounded-full h-2">
                        <div
                            class="bg-purple-500 h-2 rounded-full"
                            style="width: calc(${nutrition.perServing.fat} / 100 * 100%)"
                        ></div>
                        </div>

                        <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <div class="w-3 h-3 rounded-full bg-orange-500"></div>
                            <span class="text-gray-700">Fiber</span>
                        </div>
                        <span class="font-bold text-gray-900">${nutrition.perServing.fiber}g</span>
                        </div>
                        <div class="w-full bg-gray-100 rounded-full h-2">
                        <div
                            class="bg-orange-500 h-2 rounded-full"
                            style="width: calc(${nutrition.perServing.fiber} / 100 * 100%)"
                        ></div>
                        </div>

                        <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <div class="w-3 h-3 rounded-full bg-pink-500"></div>
                            <span class="text-gray-700">Sugar</span>
                        </div>
                        <span class="font-bold text-gray-900">${nutrition.perServing.sugar}g</span>
                        </div>
                        <div class="w-full bg-gray-100 rounded-full h-2">
                        <div
                            class="bg-pink-500 h-2 rounded-full"
                            style="width: calc(${nutrition.perServing.sugar} / 100 * 100%)"
                        ></div>
                        </div>
                    </div>

                    <div class="mt-6 pt-6 border-t border-gray-100">
                        <div class="grid grid-cols-2 gap-3 text-sm">
                        <div class="flex justify-between">
                            <span class="text-gray-600">sodium</span>
                            <span class="font-medium">${nutrition.perServing.sodium} g</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">cholesterol</span>
                            <span class="font-medium">${nutrition.perServing.cholesterol} g</span>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </div>
    
        <div id="log-meal-modal" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div class="bg-white rounded-2xl p-6 max-w-md w-full mx-4">

                <!-- Meal Info -->
                <div class="flex items-center gap-4 mb-6">
                    <img src="${recipe.thumbnail}" alt="${recipe.name}" class="w-16 h-16 rounded-xl object-cover">

                    <div>
                        <h3 class="text-xl font-bold text-gray-900">
                            Log This Meal
                        </h3>

                        <p class="text-gray-500 text-sm">
                            ${recipe.name}
                        </p>
                    </div>
                </div>

                <!-- Number of Servings -->
                <div class="mb-6">
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                        Number of Servings
                    </label>

                    <div class="flex items-center gap-3">

                        <button id="decrease-servings"
                            class="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
                            <i class="fa-solid fa-minus text-gray-600"></i>
                        </button>

                        <input type="number" id="meal-servings" value="1" min="0.5" max="10" step="0.5"
                            class="w-20 text-center text-xl font-bold border-2 border-gray-200 rounded-lg py-2">

                        <button id="increase-servings"
                            class="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
                            <i class="fa-solid fa-plus text-gray-600"></i>
                        </button>

                    </div>
                </div>

                <!-- Nutrition Preview -->
                <div class="bg-emerald-50 rounded-xl p-4 mb-6">

                    <p class="text-sm text-gray-600 mb-2">
                        Estimated nutrition per serving:
                    </p>

                    <div class="grid grid-cols-4 gap-2 text-center">

                        <div>
                            <p class="text-lg font-bold text-emerald-600" id="modal-calories">
                                ${nutrition.perServing.calories}
                            </p>
                            <p class="text-xs text-gray-500">Calories</p>
                        </div>

                        <div>
                            <p class="text-lg font-bold text-blue-600" id="modal-protein">
                                ${nutrition.perServing.protein}g
                            </p>
                            <p class="text-xs text-gray-500">Protein</p>
                        </div>

                        <div>
                            <p class="text-lg font-bold text-amber-600" id="modal-carbs">
                                ${nutrition.perServing.carbs}g
                            </p>
                            <p class="text-xs text-gray-500">Carbs</p>
                        </div>

                        <div>
                            <p class="text-lg font-bold text-purple-600" id="modal-fat">
                                ${nutrition.perServing.fat}g
                            </p>
                            <p class="text-xs text-gray-500">Fat</p>
                        </div>

                    </div>
                </div>

                <!-- Buttons -->
                <div class="flex gap-3">

                    <button id="cancel-log-meal"
                        class="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all">
                        Cancel
                    </button>

                    <button id="confirm-log-meal"
                        class="flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all">
                        <i class="fa-solid fa-clipboard-list mr-2"></i>
                        Log Meal
                    </button>

                </div>

            </div>
        </div>`;
}

// get nutrition info
export async function getNutritionInfo(recipe) {
  try {
    const response = await fetch(
      "https://nutriplan-api.vercel.app/api/nutrition/analyze",
      {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          "x-api-key": "KdNzQLchTC6frKnqLhb9ffmWfbBGc6RndBhHbjCB",
        },
        body: JSON.stringify({
          recipeName: recipe.name,
          ingredients: recipe.ingredients.map(function (ingredient) {
            return ingredient.measure + " " + ingredient.ingredient;
          }),
        }),
      },
    );
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error getting nutrition info:", error);
    throw error;
  }
}

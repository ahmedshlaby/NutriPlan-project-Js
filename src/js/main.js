import { displayCategories } from "./api/categories.js";
import { displayCuisines } from "./api/cuisines.js";
import {
  displayRecipes,
  searchRecipes,
  filterRecipesByCategory,
  displaySpinner,
  filterRecipesByArea,
  getRecipeById,
  displayMealDetails,
  getNutritionInfo,
} from "./api/recipes.js";
import {
  searchProducts,
  getProductByBarcode,
  getAllProductsCategories,
  displayProductsCategory,
  displayProducts,
  getProductsByCategory,
  filterProductsByNutriScore,
  displayProductModal,
  addProductToLog,
} from "./api/products.js";

export const mealsUrl = `https://nutriplan-api.vercel.app/api/meals/`;
export const productsUrl = `https://nutriplan-api.vercel.app/api/products/`;

// get meal from local storage
let foodLog = JSON.parse(localStorage.getItem("foodLog")) || [];
displayCuisines();
displayCategories();
displayRecipes();
displayProductsCategory();

// get search value and display recipes
const searchInputElement = document.getElementById("search-input");
let searchTimeOut;
searchInputElement.addEventListener("input", async () => {
  let searchValue = searchInputElement.value.trim();

  clearTimeout(searchTimeOut);
  searchTimeOut = setTimeout(async () => {
    try {
      if (searchValue === "") {
        await displayRecipes();
        return;
      }
      let recipes = await searchRecipes(searchValue);
      await displayRecipes(recipes, searchValue);
    } catch (error) {
      console.error("Error searching recipes:", error);
    }
  }, 500);
});

// filter by category
const categoriesGrid = document.getElementById("categories-grid");
categoriesGrid.addEventListener("click", async (e) => {
  let categoryButton = e.target.closest(".category-card");
  if (!categoryButton) return;

  let categoryName = categoryButton.dataset.category;

  displaySpinner();
  try {
    let recipes = await filterRecipesByCategory(categoryName);
    await displayRecipes(recipes, categoryName);
  } catch (error) {
    console.error("Error filtering recipes:", error);
  }
});

// filter by cuisine
const cuisinesGrid = document.getElementById("cuisines-container");
cuisinesGrid.addEventListener("click", async (e) => {
  let cuisineButton = e.target.closest(".area-filter-btn");
  if (!cuisineButton) return;

  changeActiveButton(cuisineButton);
  let cuisineName = cuisineButton.dataset.area;
  displaySpinner();
  try {
    if (cuisineName == "All Cuisines") {
      await displayRecipes();
      return;
    }
    let recipes = await filterRecipesByArea(cuisineName);
    await displayRecipes(recipes, cuisineName);
  } catch (error) {
    console.error("Error filtering recipes:", error);
  }
});

// change style button for cuisine function
// hover:bg-emerald-700 hover:text-white transition-all bg-emerald-600 text-white
// hover:bg-gray-200 transition-all bg-gray-100 text-gray-700
const cuisineButtons = cuisinesGrid.children;
function changeActiveButton(activeButton) {
  for (let i = 0; i < cuisineButtons.length; i++) {
    cuisineButtons[i].classList.remove(
      "bg-emerald-600",
      "text-white",
      "hover:bg-emerald-700",
      "hover:text-white",
    );
    cuisineButtons[i].classList.add(
      "bg-gray-100",
      "text-gray-700",
      "hover:bg-gray-200",
    );
  }
  activeButton.classList.remove(
    "bg-gray-100",
    "text-gray-700",
    "hover:bg-gray-200",
  );
  activeButton.classList.add(
    "bg-emerald-600",
    "text-white",
    "hover:bg-emerald-700",
    "hover:text-white",
  );
}

// view toggle button event
const viewToggle = document.querySelectorAll("#view-toggle button");
const recipesGrid = document.getElementById("recipes-grid");
if (viewToggle) {
  viewToggle.forEach((button) => {
    button.addEventListener("click", () => {
      viewToggle.forEach((btn) =>
        btn.classList.remove("bg-white", "rounded-md", "shadow-sm"),
      );
      button.classList.add("bg-white", "rounded-md", "shadow-sm");

      const recipeCards = document.querySelectorAll(".recipe-card");
      const badgeElements = document.querySelectorAll(".recipe-badge");

      if (button.id === "list-view-btn") {
        recipeCards.forEach((card) => {
          card.classList.add("flex", "flex-row", "h-40");
          let imgContainer = card.children[0];
          let contentContainer = card.children[1];
          imgContainer.classList.remove("h-40");
          imgContainer.classList.add("h-full", "w-1/3", "shrink-0");
          contentContainer.classList.add("flex-1", "min-w-0");
        });
        badgeElements.forEach((badge) => {
          badge.classList.add("hidden");
        });

        recipesGrid.classList.remove("grid", "grid-cols-4", "gap-5");
        recipesGrid.classList.add("grid", "grid-cols-2", "gap-4");
      } else if (button.id === "grid-view-btn") {
        recipeCards.forEach((card) => {
          card.classList.remove("flex", "flex-row", "h-40");
          let imgContainer = card.children[0];
          let contentContainer = card.children[1];
          imgContainer.classList.add("h-48");
          imgContainer.classList.remove("h-full", "w-1/3", "shrink-0");
          contentContainer.classList.remove("flex-1", "min-w-0");
        });

        badgeElements.forEach((badge) => {
          badge.classList.remove("hidden");
        });

        recipesGrid.classList.remove("grid", "grid-cols-2", "gap-4");
        recipesGrid.classList.add("grid", "grid-cols-4", "gap-5");
      }
    });
  });
}

// show and hide sections , nav tabs
const mealSections = document.querySelectorAll(
  "#search-filters-section, #meal-categories-section, #all-recipes-section",
);
const mealDetailsSection = document.getElementById("meal-details");
const productSection = document.getElementById("products-section");
const foodLogSection = document.getElementById("foodlog-section");
const sidebarMenuList = document.querySelectorAll("#sidebar-menu-links li");
const headerTitle = document.getElementById("header-title");
const headerDescription = document.getElementById("header-description");

// linka event
if (sidebarMenuList) {
  sidebarMenuList.forEach((li) => {
    li.addEventListener("click", (e) => {
      e.preventDefault();
      let sectionName = li.dataset.section;
      showSection(sectionName);

      sidebarMenuList.forEach((item) => {
        const anchor = item.querySelector("a");
        anchor.classList.remove("bg-emerald-50", "text-emerald-700");
        anchor.classList.add("text-gray-600", "hover:bg-gray-50");
      });

      const anchorActive = li.querySelector("a");
      anchorActive.classList.remove("text-gray-600", "hover:bg-gray-50");
      anchorActive.classList.add("bg-emerald-50", "text-emerald-700");
    });
  });
}

// show and hide sections function
function showSection(sectionName) {
  mealSections.forEach((section) => {
    section.classList.add("hidden");
  });

  productSection.classList.add("hidden");
  foodLogSection.classList.add("hidden");
  mealDetailsSection.classList.add("hidden");

  if (sectionName === "meals") {
    mealSections.forEach((section) => {
      section.classList.remove("hidden");
      headerTitle.textContent = "Meals & Recipes";
      headerDescription.textContent =
        "Discover delicious and nutritious recipes tailored for you";
    });
  } else if (sectionName === "products") {
    productSection.classList.remove("hidden");
    headerTitle.textContent = "Product Scanner";
    headerDescription.textContent = "Search packaged foods by name or barcode";
  } else if (sectionName === "food-log") {
    foodLogSection.classList.remove("hidden");
    headerTitle.textContent = "Food Log";
    headerDescription.textContent =
      "Track your daily nutrition and food intake";
  }
}

// default section
showSection("meals");

//event to show meal details, get recipe by id
let currentMeal = null;
if (recipesGrid) {
  recipesGrid.addEventListener("click", async (e) => {
    const recipeCard = e.target.closest(".recipe-card");
    if (!recipeCard) return;

    mealSections.forEach((section) => {
      section.classList.add("hidden");
    });

    mealDetailsSection.classList.remove("hidden");

    try {
      const recipeId = Number(recipeCard.dataset.mealId);
      // console.log(recipeId);
      const mealDetails = await getRecipeById(recipeId);
      // console.log(mealDetails);
      const nutritionInfo = await getNutritionInfo(mealDetails);
      // console.log(nutritionInfo);

      currentMeal = {
        recipe: mealDetails,
        nutrition: nutritionInfo,
      };

      // console.log(currentMeal);

      displayMealDetails(mealDetails, nutritionInfo);
    } catch (error) {
      console.error("Error displaying recipe:", error);
    }
  });
}

// back to meals button event
if (mealDetailsSection) {
  mealDetailsSection.addEventListener("click", (e) => {
    if (e.target.closest("#back-to-meals-btn")) {
      mealDetailsSection.classList.add("hidden");
      mealSections.forEach((section) => {
        section.classList.remove("hidden");
      });
    }
  });
}

// show modal event
if (mealDetailsSection) {
  mealDetailsSection.addEventListener("click", (e) => {
    if (e.target.closest("#log-meal-btn")) {
      let modal = document.getElementById("log-meal-modal");
      modal.classList.remove("hidden");
    }
    if (e.target.closest("#cancel-log-meal")) {
      let modal = document.getElementById("log-meal-modal");
      modal.classList.add("hidden");
    }
    if (e.target.closest("#increase-servings")) {
      let servengsInput = document.getElementById("meal-servings");
      let currentValue = Number(servengsInput.value);
      let maxValue = Number(servengsInput.max);
      let step = Number(servengsInput.step);
      if (currentValue < maxValue) {
        servengsInput.value = currentValue + step;
      }
    }
    if (e.target.closest("#decrease-servings")) {
      let servengsInput = document.getElementById("meal-servings");
      let currentValue = Number(servengsInput.value);
      let minValue = Number(servengsInput.min);
      let step = Number(servengsInput.step);
      if (currentValue > minValue) {
        servengsInput.value = currentValue - step;
      }
    }
    if (e.target.closest("#confirm-log-meal")) {
      let modal = document.getElementById("log-meal-modal");
      let servingsInput = document.getElementById("meal-servings");
      let selectedServings = Number(servingsInput.value);

      let newMeal = {
        id: currentMeal.recipe.id,
        name: currentMeal.recipe.name,
        image: currentMeal.recipe.thumbnail,
        servings: selectedServings,
        date: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}-${String(new Date().getDate()).padStart(2, "0")}`,

        nutrition: {
          calories: currentMeal.nutrition.perServing.calories,
          protein: currentMeal.nutrition.perServing.protein,
          carbs: currentMeal.nutrition.perServing.carbs,
          fat: currentMeal.nutrition.perServing.fat,
        },
      };

      // save meal to meal local storage
      foodLog.push(newMeal);
      localStorage.setItem("foodLog", JSON.stringify(foodLog));
      // console.log(newMeal);
      displayFoodLog();
      updateDailyNutrition();
      displayWeeklyOverview();
      modal.classList.add("hidden");
    }
  });
}

// display food log function
const loggedItemsList = document.getElementById("logged-items-list");
const clearFoodlogBtn = document.getElementById("clear-foodlog");
const loggedItemsCount = document.getElementById("logged-items-count");
const caloriesPercentage = document.getElementById("calories-percentage");
const proteinPercentage = document.getElementById("protein-percentage");
const carbsPercentage = document.getElementById("carbs-percentage");
const fatPercentage = document.getElementById("fat-percentage");
const caloriesProgress = document.getElementById("calories-progress");
const proteinProgress = document.getElementById("protein-progress");
const carbsProgress = document.getElementById("carbs-progress");
const fatProgress = document.getElementById("fat-progress");
const dailyCalories = document.getElementById("daily-calories");
const dailyProtein = document.getElementById("daily-protein");
const dailyCarbs = document.getElementById("daily-carbs");
const dailyFat = document.getElementById("daily-fat");

function displayFoodLog() {
  if (foodLog.length === 0) {
    loggedItemsList.innerHTML = `<div class="text-center py-8 text-gray-500">
                    <i
                        class="fa-solid fa-utensils text-4xl mb-3 text-gray-300"
                    ></i>
                    <p class="font-medium">No meals logged today</p>
                    <p class="text-sm">
                        Add meals from the Meals page or scan products
                    </p>
                    </div>`;
    return;
  }
//   console.log(foodLog);
  clearFoodlogBtn.style.display = "block";
  loggedItemsCount.textContent = `Logged Items (${foodLog.length})`;

  let temp = "";
  foodLog.forEach((meal, index) => {
    let totalCalories = meal.nutrition.calories * meal.servings;
    temp += `
            <div class="flex items-center justify-between bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all">
                        <div class="flex items-center gap-4">
                            <img src="${meal.image}" alt="${meal.name}" class="w-14 h-14 rounded-xl object-cover">
                            <div>
                                <p class="font-semibold text-gray-900">${meal.name}</p>
                                <p class="text-sm text-gray-500">
                                    1 serving
                                    <span class="mx-1">•</span>
                                    <span class="text-emerald-600">Recipe</span>
                                </p> 
                                <p class="text-xs text-gray-400 mt-1">${new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })} </p>
                            </div>
                        </div>
                        <div class="flex items-center gap-4">
                            <div class="text-right">
                                <p class="text-lg font-bold text-emerald-600">${totalCalories}</p>
                                <p class="text-xs text-gray-500">kcal</p>
                            </div>
                            <div class="hidden md:flex gap-2 text-xs text-gray-500">
                                <span class="px-2 py-1 bg-blue-50 rounded">${meal.nutrition.protein}g P</span>
                                <span class="px-2 py-1 bg-amber-50 rounded">${meal.nutrition.carbs}g C</span>
                                <span class="px-2 py-1 bg-purple-50 rounded">${meal.nutrition.fat}g F</span>
                            </div>
                            <button class="remove-foodlog-item text-gray-400 hover:text-red-500 transition-all p-2" data-index="${index}">
                                <i data-fa-i2svg=""><svg class="svg-inline--fa fa-trash-can" data-prefix="fas" data-icon="trash-can" role="img" viewBox="0 0 448 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M136.7 5.9C141.1-7.2 153.3-16 167.1-16l113.9 0c13.8 0 26 8.8 30.4 21.9L320 32 416 32c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 96C14.3 96 0 81.7 0 64S14.3 32 32 32l96 0 8.7-26.1zM32 144l384 0 0 304c0 35.3-28.7 64-64 64L96 512c-35.3 0-64-28.7-64-64l0-304zm88 64c-13.3 0-24 10.7-24 24l0 192c0 13.3 10.7 24 24 24s24-10.7 24-24l0-192c0-13.3-10.7-24-24-24zm104 0c-13.3 0-24 10.7-24 24l0 192c0 13.3 10.7 24 24 24s24-10.7 24-24l0-192c0-13.3-10.7-24-24-24zm104 0c-13.3 0-24 10.7-24 24l0 192c0 13.3 10.7 24 24 24s24-10.7 24-24l0-192c0-13.3-10.7-24-24-24z"></path></svg></i>
                            </button>
                        </div>
            </div>`;
  });
  loggedItemsList.innerHTML = temp;
}

displayFoodLog();
updateDailyNutrition();

// clear all button event
clearFoodlogBtn.addEventListener("click", () => {
  foodLog = [];
  localStorage.removeItem("foodLog");
  displayFoodLog();
  updateDailyNutrition();
  displayWeeklyOverview();
});

// delete food log item event
loggedItemsList.addEventListener("click", (e) => {
  if (e.target.closest(".remove-foodlog-item")) {
    const index = e.target.closest(".remove-foodlog-item").dataset.index;
    foodLog.splice(index, 1);
    localStorage.setItem("foodLog", JSON.stringify(foodLog));
    displayFoodLog();
    updateDailyNutrition();
    displayWeeklyOverview();
  }
});

// update daily nutrition function
function updateDailyNutrition() {
  const goals = {
    calories: 2000,
    protein: 50,
    carbs: 250,
    fat: 65,
  };

  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;
console.log(foodLog);
  foodLog.forEach((meal) => {
    totalCalories += meal.nutrition.calories;
    totalProtein += meal.nutrition.protein;
    totalCarbs += meal.nutrition.carbs;
    totalFat += meal.nutrition.fat;
  });

  // calculate percentages
  let caloriesPercent = Math.round((totalCalories / goals.calories) * 100);
  let proteinPercent = Math.round((totalProtein / goals.protein) * 100);
  let carbsPercent = Math.round((totalCarbs / goals.carbs) * 100);
  let fatPercent = Math.round((totalFat / goals.fat) * 100);

  // update innerHTML
  // update calories
  dailyCalories.innerText = `${Math.round(totalCalories)} kcal`;
  caloriesPercentage.textContent = `${caloriesPercent}%`;
  caloriesProgress.style.width = `${Math.min(caloriesPercent, 100)}%`;

  // update protein
  dailyProtein.innerText = `${Math.round(totalProtein)} g`;
  proteinPercentage.textContent = `${proteinPercent}%`;
  proteinProgress.style.width = `${Math.min(proteinPercent, 100)}%`;

  // update carbs
  dailyCarbs.innerText = `${Math.round(totalCarbs)} g`;
  carbsPercentage.textContent = `${carbsPercent}%`;
  carbsProgress.style.width = `${Math.min(carbsPercent, 100)}%`;

  // update fat
  dailyFat.innerText = `${Math.round(totalFat)}g`;
  fatPercentage.textContent = `${fatPercent}%`;
  fatProgress.style.width = `${Math.min(fatPercent, 100)}%`;
}

// display current date function
const foodlogDate = document.getElementById("foodlog-date");
function displayCurrentDate() {
  const today = new Date();
  foodlogDate.textContent = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

displayCurrentDate();

// get last 7days
function getLastSevenDays() {
  let days = [];
  for (let i = 6; i >= 0; i--) {
    let date = new Date();
    date.setDate(date.getDate() - i);
    let dateString = date.toLocaleDateString("en-CA");
    let dayName = date.toLocaleDateString("en-US", { weekday: "short" });
    days.push({ day: dayName, date: dateString });
  }
  return days;
}

// calculate weekly calories function
function calculateWeeklyCalories() {
  let days = getLastSevenDays();
  let weaklyData = [];

  days.forEach((day) => {
    let dailyCalories = 0;
    foodLog.forEach((meal) => {
      if (meal.date === day.date) {
        dailyCalories += meal.nutrition.calories * meal.servings;
      }
    });
    weaklyData.push({
      date: day.date,
      day: day.day,
      calories: Math.round(dailyCalories),
    });
  });

  return weaklyData;
}

// display weekly overview function
const weeklyChart = document.getElementById("weekly-chart");
function displayWeeklyOverview() {
  let weeklyData = calculateWeeklyCalories();
  let temp = "";
  weeklyData.forEach((day) => {
    let today = new Date().toLocaleDateString("en-CA");
    let cardClass =
      day.date === today
        ? "text-center bg-indigo-100 rounded-xl"
        : "text-center";
    let dayNumber = day.date.split("-")[2];
    // console.log(dayNumber);
    temp += `
                        
                            <div class="${cardClass}">
                                <p class="text-xs text-gray-500 mb-1">${day.day}</p>
                                <p class="text-sm font-medium text-gray-900">${dayNumber}</p>
                                <div class="mt-2 text-gray-300">
                                    <p class="text-lg font-bold">${day.calories}</p>
                                    <p class="text-xs">kcal</p>
                                </div>
                                
                            </div>
                    
        `;
  });
  weeklyChart.innerHTML = temp;
  // console.log(weeklyData);
}

displayWeeklyOverview();

// add quick log from recipe again event
const quickLogBtn = document.querySelector(".quick-log-btn");
quickLogBtn.addEventListener("click", function () {
  showSection("meals");

  sidebarMenuList.forEach((li) => {
    const anchor = li.querySelector("a");

    anchor.classList.remove("bg-emerald-50", "text-emerald-700");
    anchor.classList.add("text-gray-600", "hover:bg-gray-50");

    if (li.dataset.section === "meals") {
      anchor.classList.remove("text-gray-600", "hover:bg-gray-50");
      anchor.classList.add("bg-emerald-50", "text-emerald-700");
    }
  });
});

// add quick scan from barcode event
const quickScanBtn = document.querySelector(".quick-scan-btn");
quickScanBtn.addEventListener("click", function () {
  showSection("products");

  sidebarMenuList.forEach((li) => {
    const anchor = li.querySelector("a");

    anchor.classList.remove("bg-emerald-50", "text-emerald-700");
    anchor.classList.add("text-gray-600", "hover:bg-gray-50");

    if (li.dataset.section === "products") {
      anchor.classList.remove("text-gray-600", "hover:bg-gray-50");
      anchor.classList.add("bg-emerald-50", "text-emerald-700");
    }
  });
});

// event for filter products by category
const productsCategories = document.getElementById("product-categories");
productsCategories.addEventListener("click", async (e) => {
  const button = e.target.closest(".product-category-btn");
  if (!button) return;

  let category = button.dataset.category;
  // console.log(category);
  let products = await getProductsByCategory(category);
  // console.log(products[0].nutritionGrade);

  displayProducts(products);
});

displayProducts([]);

// search products event
const productSearchInput = document.getElementById("product-search-input");
const searchProductBtn = document.getElementById("search-product-btn");
searchProductBtn.addEventListener("click", async () => {
  let searchValue = productSearchInput.value.trim();

  if (searchValue === "") {
    displayProducts([]);
    return;
  }

  let products = await searchProducts(searchValue);
  displayProducts(products);
});

// search by barcode event
const barcodeInput = document.getElementById("barcode-input");
const lookupBarcodeBtn = document.getElementById("lookup-barcode-btn");
lookupBarcodeBtn.addEventListener("click", async () => {
  let barcode = barcodeInput.value.trim();

  if (barcode === "") {
    displayProducts([]);
    return;
  }

  let product = await getProductByBarcode(barcode);
  if (product) {
    displayProducts([product]);
  } else {
    displayProducts([]);
  }
});

// filter products by nutri score event
const nutriScoreFilters = document.querySelectorAll(".nutri-score-filter");
nutriScoreFilters.forEach((filter) => {
  filter.addEventListener("click", () => {
    let grade = filter.dataset.grade;
    filterProductsByNutriScore(grade);
  });
});

// event on product card click to show product details
const productsGrid = document.getElementById("products-grid");
productsGrid.addEventListener("click", async (e) => {
  productModalContainer.classList.remove("hidden");
  const card = e.target.closest(".product-card");
  if (!card) return;

  let barcode = card.dataset.barcode;
  let product = await getProductByBarcode(barcode);

  displayProductModal(product);
  // console.log(product);
});

// close product modal
const productModalContainer = document.getElementById(
  "product-modal-container",
);
productModalContainer.addEventListener("click", async (e) => {
  if (e.target.closest(".close-product-modal")) {
    productModalContainer.classList.add("hidden");
  }

  if (e.target.id === "product-detail-modal") {
    productModalContainer.classList.add("hidden");
  }

  if (e.target.closest(".add-product-to-log")) {
    let barcode = e.target.closest(".add-product-to-log").dataset.barcode;
    let product = await getProductByBarcode(barcode);
    addProductToLog(product);
    productModalContainer.classList.add("hidden");
  }
});

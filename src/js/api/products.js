// get products from api
// https://nutriplan-api.vercel.app/api/products/
import { productsUrl } from "../main.js";

// get products
export async function searchProducts(searchValue = "", page = 1, limit = 24) {
  try {
    const response = await fetch(
      `${productsUrl}search?q=${searchValue}&page=${page}&limit=${limit}`,
    );
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

// get product by barcode
export async function getProductByBarcode(barcode) {
  try {
    const response = await fetch(`${productsUrl}barcode/${barcode}`);
    if (!response.ok) {
      throw new Error("Failed to fetch product");
    }
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
}

// get all products categories
export async function getAllProductsCategories() {
  try {
    const response = await fetch(`${productsUrl}categories`);
    if (!response.ok) {
      throw new Error("Failed to fetch products categories");
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching products categories:", error);
    throw error;
  }
}

// get products by category
export async function getProductsByCategory(category) {
  try {
    const response = await fetch(`${productsUrl}category/${category}`);
    if (!response.ok) {
      throw new Error("Failed to fetch products by category");
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching products by category:", error);
    throw error;
  }
}

// style for category card
let categoryStyles = {
  vegetables: {
    icon: "fa-carrot",
    color: "from-green-500 to-emerald-500",
  },

  snacks: {
    icon: "fa-cookie-bite",
    color: "from-orange-500 to-amber-500",
  },

  beverages: {
    icon: "fa-mug-hot",
    color: "from-blue-500 to-cyan-500",
  },

  "breakfast-cereals": {
    icon: "fa-egg",
    color: "from-yellow-500 to-orange-500",
  },

  desserts: {
    icon: "fa-cake-candles",
    color: "from-pink-500 to-rose-500",
  },

  dairies: {
    icon: "fa-cheese",
    color: "from-yellow-400 to-amber-500",
  },
  cheeses: {
    icon: "fa-cheese",
    color: "from-purple-500 to-pink-500",
  },
  fruits: {
    icon: "fa-apple-whole",
    color: "from-red-500 to-pink-500",
  },
  meats: {
    icon: "fa-drumstick-bite",
    color: "from-red-500 to-orange-500",
  },
  yogurts: {
    icon: "fa-glass-water",
    color: "from-blue-500 to-cyan-500",
  },
};

// display products category function
export async function displayProductsCategory() {
  try {
    let categories = await getAllProductsCategories();
    // console.log(categories);
    let temp = "";
    categories.forEach((category) => {
      let style = categoryStyles[category.id];
      if (!style) {
        style = {
          icon: "fa-box",
          color: "from-gray-500 to-gray-600",
        };
      }
      temp += `<button
                class="product-category-btn flex-shrink-0 px-5 py-3 bg-gradient-to-r ${style.color} text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                data-category="${category.id}"
            >
                <i class="fas ${style.icon} mr-2"></i>
                ${category.name}
            </button>`;
    });

    document.getElementById("product-categories").innerHTML = temp;
  } catch (error) {
    console.error("Error displaying products categories:", error);
    throw error;
  }
}

// display products function
let allProducts = [];
export function displayProducts(products, saveOriginal = true) {
  if (saveOriginal) {
    allProducts = products;
  }
  let temp = "";
  if (!products || products.length === 0) {
    temp = `<div class="col-span-full text-center">
                <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-box-open text-3xl text-gray-400"></i>
                </div>
                <p class="text-gray-500 text-lg mb-2">No products to display</p>
                <p class="text-gray-400 text-sm">Search for a product or browse by category</p>
            </div>`;
    document.getElementById("products-grid").innerHTML = temp;
    return;
  }
  products.forEach((product) => {
    temp += `
            <div class="product-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group" data-barcode="${product.barcode}">
                <div class="relative h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
                  <img class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300" src="${product.image}" alt="${product.name}" loading="lazy">

                  <!-- Nutri-Score Badge -->
                  ${
                    product.nutritionGrade
                      ? `
                  <div class="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded uppercase">
                    Nutri-Score ${product.nutritionGrade}
                  </div>
                  `
                      : ""
                  }
                  

                  <!-- NOVA Badge -->
                  ${
                    product.novaGroup
                      ? `
                  <div class="absolute top-2 right-2 bg-lime-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center" title="NOVA 2">
                    ${product.novaGroup}
                  </div>
                  `
                      : ""
                  }
                </div>

                <div class="p-4">
                  <p class="text-xs text-emerald-600 font-semibold mb-1 truncate">
                    ${product.brand}
                  </p>
                  <h3 class="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                    ${product.name}
                  </h3>

                  <div class="flex items-center gap-3 text-xs text-gray-500 mb-3">
                    <span><i class="mr-1" data-fa-i2svg=""><svg class="svg-inline--fa fa-weight-scale" data-prefix="fas" data-icon="weight-scale" role="img" viewBox="0 0 448 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M116.6 192c-3-10.1-4.6-20.9-4.6-32 0-61.9 50.1-112 112-112S336 98.1 336 160c0 11.1-1.6 21.9-4.6 32l-71 0 24.6-44.3c6.4-11.6 2.3-26.2-9.3-32.6s-26.2-2.3-32.6 9.3l-37.6 67.7-88.8 0zM128 32L64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64l-64 0C293.3 11.9 260 0 224 0s-69.3 11.9-96 32z"></path></svg></i>
                    200 g</span>
                    <span><i class="mr-1" data-fa-i2svg=""><svg class="svg-inline--fa fa-fire" data-prefix="fas" data-icon="fire" role="img" viewBox="0 0 448 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M160.5-26.4c9.3-7.8 23-7.5 31.9 .9 12.3 11.6 23.3 24.4 33.9 37.4 13.5 16.5 29.7 38.3 45.3 64.2 5.2-6.8 10-12.8 14.2-17.9 1.1-1.3 2.2-2.7 3.3-4.1 7.9-9.8 17.7-22.1 30.8-22.1 13.4 0 22.8 11.9 30.8 22.1 1.3 1.7 2.6 3.3 3.9 4.8 10.3 12.4 24 30.3 37.7 52.4 27.2 43.9 55.6 106.4 55.6 176.6 0 123.7-100.3 224-224 224S0 411.7 0 288c0-91.1 41.1-170 80.5-225 19.9-27.7 39.7-49.9 54.6-65.1 8.2-8.4 16.5-16.7 25.5-24.2zM225.7 416c25.3 0 47.7-7 68.8-21 42.1-29.4 53.4-88.2 28.1-134.4-4.5-9-16-9.6-22.5-2l-25.2 29.3c-6.6 7.6-18.5 7.4-24.7-.5-17.3-22.1-49.1-62.4-65.3-83-5.4-6.9-15.2-8-21.5-1.9-18.3 17.8-51.5 56.8-51.5 104.3 0 68.6 50.6 109.2 113.7 109.2z"></path></svg></i>
                    ${product.nutrients.calories} kcal/100g</span>
                  </div>

                  <!-- Mini Nutrition -->
                  <div class="grid grid-cols-4 gap-1 text-center">
                    <div class="bg-emerald-50 rounded p-1.5">
                      <p class="text-xs font-bold text-emerald-700">${product.nutrients.protein}g</p>
                      <p class="text-[10px] text-gray-500">Protein</p>
                    </div>
                    <div class="bg-blue-50 rounded p-1.5">
                      <p class="text-xs font-bold text-blue-700">${product.nutrients.carbs}g</p>
                      <p class="text-[10px] text-gray-500">Carbs</p>
                    </div>
                    <div class="bg-purple-50 rounded p-1.5">
                      <p class="text-xs font-bold text-purple-700">${product.nutrients.fat}g</p>
                      <p class="text-[10px] text-gray-500">Fat</p>
                    </div>
                    <div class="bg-orange-50 rounded p-1.5">
                      <p class="text-xs font-bold text-orange-700">${product.nutrients.sugar}g</p>
                      <p class="text-[10px] text-gray-500">Sugar</p>
                    </div>
                  </div>
                </div>
              </div>
        `;
  });
  document.getElementById("products-grid").innerHTML = temp;
}

// filter products by nutrition score
export function filterProductsByNutriScore(grade) {
  // console.log("filterProductsByNutritionScore", grade);
  // console.log("allProducts", allProducts);

  if (grade === "") {
    displayProducts(allProducts, false);
    return;
  }

  let filteredProducts = allProducts.filter((product) => {
    return product.nutritionGrade?.toLowerCase() === grade;
  });

  // console.log("Filtered Products:", filteredProducts);
  displayProducts(filteredProducts, false);
}

// display product in modal
export function displayProductModal(product) {
  let temp = `<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" id="product-detail-modal">

            <div class="bg-white rounded-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto p-6">

                <div class="flex items-start gap-6 mb-6">

                    <img
                        src="${product.image}"
                        alt="${product.name}"
                        class="w-32 h-32 object-contain bg-gray-100 rounded-xl"
                    >

                    <div class="flex-1">
                        <p class="text-sm text-emerald-600 font-semibold">${product.brand}</p>

                        <h2 class="text-2xl font-bold">${product.name}</h2>

                        <p class="text-sm text-gray-500 mt-2">
                            Nutri-Score: ${product.nutritionGrade || "Unknown"}
                        </p>

                        <p class="text-sm text-gray-500">
                            NOVA: ${product.novaGroup || "Unknown"}
                        </p>
                    </div>

                    <button class="close-product-modal text-gray-500 text-2xl">
                        &times;
                    </button>

                </div>

                <div class="bg-emerald-50 rounded-xl p-5 mb-6">

                    <h3 class="font-bold mb-4">Nutrition Facts (per 100g)</h3>

                    <p class="text-3xl font-bold text-center mb-4">
                        ${product.nutrients.calories} kcal
                    </p>

                    <div class="grid grid-cols-4 gap-4 text-center">

                        <div>
                            <p class="font-bold text-emerald-600">${product.nutrients.protein}g</p>
                            <p class="text-xs text-gray-500">Protein</p>
                        </div>

                        <div>
                            <p class="font-bold text-blue-600">${product.nutrients.carbs}g</p>
                            <p class="text-xs text-gray-500">Carbs</p>
                        </div>

                        <div>
                            <p class="font-bold text-purple-600">${product.nutrients.fat}g</p>
                            <p class="text-xs text-gray-500">Fat</p>
                        </div>

                        <div>
                            <p class="font-bold text-orange-600">${product.nutrients.sugar}g</p>
                            <p class="text-xs text-gray-500">Sugar</p>
                        </div>

                    </div>

                </div>

                <div class="flex gap-3">

                    <button class="add-product-to-log flex-1 py-3 bg-emerald-600 text-white rounded-xl font-semibold"
                        data-barcode="${product.barcode}">
                        <i class="fas fa-plus mr-2"></i>
                        Log This Food
                    </button>

                    <button class="close-product-modal flex-1 py-3 bg-gray-100 rounded-xl font-semibold">
                        Close
                    </button>

                </div>

            </div>
        </div>
    `;
  document.getElementById("product-modal-container").innerHTML = temp;
}

// add product to log
export function addProductToLog(product) {
  let foodLog = JSON.parse(localStorage.getItem("foodLog")) || [];

  let logProduct = {
    barcode: product.barcode,
    name: product.productName,
    calories: product.nutrients.calories,
    protein: product.nutrients.protein,
    carbs: product.nutrients.carbs,
    fat: product.nutrients.fat,
    sugar: product.nutrients.sugar,
    fiber: product.nutrients.fiber,
    sodium: product.nutrients.sodium,
    calcium: product.nutrients.calcium,
    iron: product.nutrients.iron,
    vitamina: product.nutrients.vitamina,
    vitaminc: product.nutrients.vitaminc,
    category: product.categories || "Unknown",
    novaGroup: product.novaGroup || "Unknown",
    image: product.imageUrl || "https://via.placeholder.com/150",
    date: new Date().toISOString(),
  };

  foodLog.push(logProduct);
  localStorage.setItem("foodLog", JSON.stringify(foodLog));
}

/* =====================================================
   RECIPEVAULT JAVASCRIPT
   CRUD + FILTER + SEARCH + LOCAL STORAGE
===================================================== */


/* ================= DATA ================= */

const STORAGE_KEY = "recipeVaultRecipes";

let recipes = JSON.parse(
    localStorage.getItem(STORAGE_KEY)
) || [];

let showOnlyFavorites = false;


/* ================= SAMPLE DATA ================= */

if (recipes.length === 0) {

    recipes = [

        {
            id: crypto.randomUUID(),
            name: "Creamy Garlic Pasta",
            category: "Dinner",
            difficulty: "Easy",
            time: 25,
            servings: 2,
            emoji: "🍝",
            ingredients:
                "Pasta, Garlic, Butter, Cream, Parmesan, Salt, Black Pepper",
            instructions:
                "Boil pasta until al dente.\n\nMelt butter and sauté garlic.\n\nAdd cream and parmesan.\n\nMix pasta with the sauce and serve hot.",
            favorite: true,
            createdAt: Date.now() - 5000
        },

        {
            id: crypto.randomUUID(),
            name: "Masala Dosa",
            category: "Breakfast",
            difficulty: "Medium",
            time: 35,
            servings: 3,
            emoji: "🥞",
            ingredients:
                "Rice, Urad Dal, Potato, Onion, Green Chilli, Mustard Seeds",
            instructions:
                "Prepare dosa batter.\n\nCook potato masala with spices.\n\nSpread batter on a hot pan.\n\nAdd masala and fold the dosa.",
            favorite: false,
            createdAt: Date.now() - 4000
        },

        {
            id: crypto.randomUUID(),
            name: "Fresh Garden Salad",
            category: "Lunch",
            difficulty: "Easy",
            time: 15,
            servings: 2,
            emoji: "🥗",
            ingredients:
                "Lettuce, Tomato, Cucumber, Onion, Corn, Lemon, Salt",
            instructions:
                "Wash and chop all vegetables.\n\nCombine everything in a bowl.\n\nAdd lemon juice, salt and pepper.\n\nMix and serve fresh.",
            favorite: true,
            createdAt: Date.now() - 3000
        },

        {
            id: crypto.randomUUID(),
            name: "Chocolate Cake",
            category: "Dessert",
            difficulty: "Medium",
            time: 50,
            servings: 6,
            emoji: "🍰",
            ingredients:
                "Flour, Cocoa Powder, Sugar, Eggs, Butter, Milk, Baking Powder",
            instructions:
                "Mix dry ingredients.\n\nAdd eggs, milk and melted butter.\n\nPour into a baking pan.\n\nBake until fully cooked.",
            favorite: false,
            createdAt: Date.now() - 2000
        },

        {
            id: crypto.randomUUID(),
            name: "Classic Margherita Pizza",
            category: "Dinner",
            difficulty: "Medium",
            time: 40,
            servings: 2,
            emoji: "🍕",
            ingredients:
                "Pizza Dough, Tomato Sauce, Mozzarella, Basil, Olive Oil",
            instructions:
                "Prepare the pizza base.\n\nSpread tomato sauce.\n\nAdd mozzarella and basil.\n\nBake until the crust becomes golden.",
            favorite: true,
            createdAt: Date.now() - 1000
        },

        {
            id: crypto.randomUUID(),
            name: "Fresh Mango Shake",
            category: "Drinks",
            difficulty: "Easy",
            time: 10,
            servings: 2,
            emoji: "🥤",
            ingredients:
                "Mango, Milk, Sugar, Ice Cubes",
            instructions:
                "Peel and cut mangoes.\n\nBlend mango, milk and sugar.\n\nAdd ice cubes.\n\nServe chilled.",
            favorite: false,
            createdAt: Date.now()
        }

    ];

    saveRecipes();
}


/* ================= DOM ================= */

const recipeGrid =
    document.getElementById("recipeGrid");

const emptyState =
    document.getElementById("emptyState");

const searchInput =
    document.getElementById("searchInput");

const categoryFilter =
    document.getElementById("categoryFilter");

const sortFilter =
    document.getElementById("sortFilter");

const recipeModal =
    document.getElementById("recipeModal");

const detailModal =
    document.getElementById("detailModal");

const recipeForm =
    document.getElementById("recipeForm");


/* ================= SAVE ================= */

function saveRecipes() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(recipes)
    );

}


/* ================= DISPLAY ================= */

function renderRecipes() {

    let result = [...recipes];

    const search =
        searchInput.value
            .toLowerCase()
            .trim();

    const category =
        categoryFilter.value;


    /* Search */

    if (search) {

        result = result.filter(recipe => {

            return (

                recipe.name
                    .toLowerCase()
                    .includes(search)

                ||

                recipe.ingredients
                    .toLowerCase()
                    .includes(search)

                ||

                recipe.category
                    .toLowerCase()
                    .includes(search)

            );

        });

    }


    /* Category filter */

    if (category !== "all") {

        result = result.filter(
            recipe =>
                recipe.category === category
        );

    }


    /* Favorites */

    if (showOnlyFavorites) {

        result = result.filter(
            recipe => recipe.favorite
        );

    }


    /* Sorting */

    const sort = sortFilter.value;

    if (sort === "newest") {

        result.sort(
            (a, b) => b.createdAt - a.createdAt
        );

    }

    if (sort === "oldest") {

        result.sort(
            (a, b) => a.createdAt - b.createdAt
        );

    }

    if (sort === "az") {

        result.sort(
            (a, b) =>
                a.name.localeCompare(b.name)
        );

    }

    if (sort === "time") {

        result.sort(
            (a, b) => a.time - b.time
        );

    }


    recipeGrid.innerHTML = "";


    result.forEach(recipe => {

        recipeGrid.innerHTML += createRecipeCard(recipe);

    });


    document.getElementById("recipeCount")
        .textContent =
        `${result.length} recipe${result.length !== 1 ? "s" : ""}`;


    emptyState.classList.toggle(
        "hidden",
        result.length !== 0
    );


    updateStats();

}


/* ================= CARD ================= */

function createRecipeCard(recipe) {

    const shortDescription =
        recipe.ingredients.length > 85
            ? recipe.ingredients.substring(0, 85) + "..."
            : recipe.ingredients;


    return `

        <article class="recipe-card">

            <div class="recipe-cover">

                <span class="category-badge">
                    ${recipe.category}
                </span>

                <button
                    class="favorite-btn
                    ${recipe.favorite ? "active" : ""}"
                    onclick="toggleFavorite('${recipe.id}')">

                    ${recipe.favorite ? "❤️" : "♡"}

                </button>

                <span>
                    ${recipe.emoji}
                </span>

            </div>


            <div class="recipe-info">

                <h3>
                    ${escapeHTML(recipe.name)}
                </h3>

                <p class="recipe-description">
                    ${escapeHTML(shortDescription)}
                </p>


                <div class="recipe-meta">

                    <span>
                        ⏱ ${recipe.time} min
                    </span>

                    <span>
                        👥 ${recipe.servings}
                    </span>

                    <span class="difficulty">
                        ${recipe.difficulty}
                    </span>

                </div>


                <div class="card-actions">

                    <button
                        class="view-btn"
                        onclick="viewRecipe('${recipe.id}')">

                        👁 View

                    </button>

                    <button
                        class="edit-btn"
                        onclick="editRecipe('${recipe.id}')">

                        ✏️ Edit

                    </button>

                </div>


                <button
                    class="delete-btn"
                    onclick="deleteRecipe('${recipe.id}')">

                    🗑 Delete Recipe

                </button>

            </div>

        </article>

    `;

}


/* ================= ADD ================= */

function openAddModal() {

    recipeForm.reset();

    document.getElementById("recipeId").value = "";

    document.getElementById("modalTitle")
        .textContent = "Add New Recipe";

    document.getElementById("recipeEmoji")
        .value = "🍝";


    document.querySelectorAll(".emoji-choice")
        .forEach((button, index) => {

            button.classList.toggle(
                "selected",
                index === 0
            );

        });


    recipeModal.classList.add("show");

}


/* ================= EDIT ================= */

function editRecipe(id) {

    const recipe =
        recipes.find(item => item.id === id);

    if (!recipe) return;


    document.getElementById("recipeId")
        .value = recipe.id;

    document.getElementById("recipeName")
        .value = recipe.name;

    document.getElementById("recipeCategory")
        .value = recipe.category;

    document.getElementById("recipeDifficulty")
        .value = recipe.difficulty;

    document.getElementById("recipeTime")
        .value = recipe.time;

    document.getElementById("recipeServings")
        .value = recipe.servings;

    document.getElementById("recipeIngredients")
        .value = recipe.ingredients;

    document.getElementById("recipeInstructions")
        .value = recipe.instructions;

    document.getElementById("recipeEmoji")
        .value = recipe.emoji;


    document.querySelectorAll(".emoji-choice")
        .forEach(button => {

            button.classList.toggle(
                "selected",
                button.textContent.trim() === recipe.emoji
            );

        });


    document.getElementById("modalTitle")
        .textContent = "Edit Recipe";


    recipeModal.classList.add("show");

}


/* ================= FORM SUBMIT ================= */

recipeForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const id =
            document.getElementById("recipeId")
                .value;


        const recipeData = {

            name:
                document.getElementById("recipeName")
                    .value.trim(),

            category:
                document.getElementById("recipeCategory")
                    .value,

            difficulty:
                document.getElementById("recipeDifficulty")
                    .value,

            time:
                Number(
                    document.getElementById("recipeTime")
                        .value
                ),

            servings:
                Number(
                    document.getElementById("recipeServings")
                        .value
                ),

            ingredients:
                document.getElementById("recipeIngredients")
                    .value.trim(),

            instructions:
                document.getElementById("recipeInstructions")
                    .value.trim(),

            emoji:
                document.getElementById("recipeEmoji")
                    .value

        };


        /* EDIT */

        if (id) {

            const index =
                recipes.findIndex(
                    recipe => recipe.id === id
                );


            if (index !== -1) {

                recipes[index] = {

                    ...recipes[index],

                    ...recipeData

                };

            }


            showToast(
                "Recipe updated successfully!",
                "✏️"
            );

        }


        /* ADD */

        else {

            recipes.unshift({

                id: crypto.randomUUID(),

                ...recipeData,

                favorite: false,

                createdAt: Date.now()

            });


            showToast(
                "Recipe added successfully!",
                "🍴"
            );

        }


        saveRecipes();

        renderRecipes();

        closeRecipeModal();

    }
);


/* ================= DELETE ================= */

function deleteRecipe(id) {

    const recipe =
        recipes.find(item => item.id === id);

    if (!recipe) return;


    const confirmed =
        confirm(
            `Are you sure you want to delete "${recipe.name}"?`
        );


    if (!confirmed) return;


    recipes =
        recipes.filter(
            item => item.id !== id
        );


    saveRecipes();

    renderRecipes();

    showToast(
        "Recipe deleted successfully!",
        "🗑️"
    );

}


/* ================= FAVORITE ================= */

function toggleFavorite(id) {

    const recipe =
        recipes.find(item => item.id === id);

    if (!recipe) return;


    recipe.favorite =
        !recipe.favorite;


    saveRecipes();

    renderRecipes();


    showToast(
        recipe.favorite
            ? "Added to favorites!"
            : "Removed from favorites!",
        recipe.favorite ? "❤️" : "♡"
    );

}


/* ================= DETAIL ================= */

function viewRecipe(id) {

    const recipe =
        recipes.find(item => item.id === id);

    if (!recipe) return;


    document.getElementById("detailBody")
        .innerHTML = `

        <div class="detail-emoji">
            ${recipe.emoji}
        </div>

        <span class="small-label">
            ${recipe.category.toUpperCase()}
        </span>

        <h2>
            ${escapeHTML(recipe.name)}
        </h2>

        <p class="detail-description">

            ⏱ ${recipe.time} minutes
            &nbsp; • &nbsp;
            👥 ${recipe.servings} servings
            &nbsp; • &nbsp;
            ⭐ ${recipe.difficulty}

        </p>


        <div class="detail-section">

            <h3>🥕 INGREDIENTS</h3>

            <p>
                ${escapeHTML(recipe.ingredients)}
            </p>

        </div>


        <div class="detail-section">

            <h3>👨‍🍳 COOKING INSTRUCTIONS</h3>

            <p>
                ${escapeHTML(recipe.instructions)}
            </p>

        </div>

    `;


    detailModal.classList.add("show");

}


/* ================= MODAL CLOSE ================= */

function closeRecipeModal() {

    recipeModal.classList.remove("show");

}


function closeDetailModal() {

    detailModal.classList.remove("show");

}


/* ================= STATS ================= */

function updateStats() {

    document.getElementById("totalRecipes")
        .textContent =
        recipes.length;


    document.getElementById("favoriteRecipes")
        .textContent =
        recipes.filter(
            recipe => recipe.favorite
        ).length;


    const categories =
        new Set(
            recipes.map(
                recipe => recipe.category
            )
        );


    document.getElementById("totalCategories")
        .textContent =
        categories.size;


    if (recipes.length === 0) {

        document.getElementById("averageTime")
            .textContent = "0 min";

        return;
    }


    const average =
        recipes.reduce(
            (sum, recipe) =>
                sum + Number(recipe.time),
            0
        ) / recipes.length;


    document.getElementById("averageTime")
        .textContent =
        `${Math.round(average)} min`;

}


/* ================= SEARCH ================= */

searchInput.addEventListener(
    "input",
    renderRecipes
);


categoryFilter.addEventListener(
    "change",
    renderRecipes
);


sortFilter.addEventListener(
    "change",
    renderRecipes
);


/* ================= FAVORITE FILTER ================= */

document.getElementById("favoritesBtn")
    .addEventListener(
        "click",
        function() {

            showOnlyFavorites =
                !showOnlyFavorites;


            this.classList.toggle(
                "active",
                showOnlyFavorites
            );


            renderRecipes();

        }
    );


/* ================= THEME ================= */

document.getElementById("themeBtn")
    .addEventListener(
        "click",
        function() {

            document.body.classList.toggle("dark");


            const dark =
                document.body.classList.contains("dark");


            this.textContent =
                dark ? "☀️" : "🌙";


            localStorage.setItem(
                "recipeVaultTheme",
                dark ? "dark" : "light"
            );

        }
    );


if (
    localStorage.getItem(
        "recipeVaultTheme"
    ) === "dark"
) {

    document.body.classList.add("dark");

    document.getElementById("themeBtn")
        .textContent = "☀️";

}


/* ================= EMOJI ================= */

document.querySelectorAll(".emoji-choice")
    .forEach(button => {

        button.addEventListener(
            "click",
            function() {

                document.querySelectorAll(
                    ".emoji-choice"
                )
                .forEach(btn =>
                    btn.classList.remove("selected")
                );


                this.classList.add("selected");


                document.getElementById(
                    "recipeEmoji"
                ).value =
                    this.textContent.trim();

            }
        );

    });


/* ================= BUTTON EVENTS ================= */

document.getElementById("addRecipeBtn")
    .addEventListener(
        "click",
        openAddModal
    );


document.getElementById("heroAddBtn")
    .addEventListener(
        "click",
        openAddModal
    );


document.getElementById("emptyAddBtn")
    .addEventListener(
        "click",
        openAddModal
    );


document.getElementById("closeModal")
    .addEventListener(
        "click",
        closeRecipeModal
    );


document.getElementById("cancelBtn")
    .addEventListener(
        "click",
        closeRecipeModal
    );


document.getElementById("closeDetail")
    .addEventListener(
        "click",
        closeDetailModal
    );


/* ================= CLICK OUTSIDE MODAL ================= */

recipeModal.addEventListener(
    "click",
    function(event) {

        if (event.target === recipeModal) {

            closeRecipeModal();

        }

    }
);


detailModal.addEventListener(
    "click",
    function(event) {

        if (event.target === detailModal) {

            closeDetailModal();

        }

    }
);


/* ================= ESC KEY ================= */

document.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Escape") {

            closeRecipeModal();

            closeDetailModal();

        }

    }
);


/* ================= TOAST ================= */

function showToast(message, icon = "✓") {

    const toast =
        document.getElementById("toast");

    document.getElementById("toastMessage")
        .textContent = message;

    document.getElementById("toastIcon")
        .textContent = icon;


    toast.classList.add("show");


    setTimeout(
        () => toast.classList.remove("show"),
        2500
    );

}


/* ================= SECURITY ================= */

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* ================= INITIAL LOAD ================= */

renderRecipes();
const removeAllIngredientsBtn = document.querySelector("button");
const filterRecipeItems = document.querySelector("#item");
const addForm = document.querySelector("#addForm");
const checkBoxEl = document.querySelector("#recipe-check");
const ingredientList = document.querySelector(".recipe-text");

let ingredients = [];

const filters = {
  searchText: "",
  hideCompleted: false,
};

// Check for existing saved data
const recipesJSON = localStorage.getItem("ingredients");
if (recipesJSON !== null) {
  ingredients = JSON.parse(recipesJSON);
}

// remove recipe by id
const removeIngredientBtn = (id) => {
  const ingredientIndex = ingredients.findIndex((ingredient) => {
    return ingredient.id === id;
  });
  if (ingredientIndex > -1) {
    ingredients.splice(ingredientIndex, 1);
  }
  localStorage.setItem("ingredients", JSON.stringify(ingredients));
  renderIngredients(ingredients, filters);
};

const updateHeading = (incompleteRecipes) => {
  const recipeSummary = document.querySelector("h2");
  const isPlural =
    incompleteRecipes.length === 1 ? "ingredient" : "ingredients";
  recipeSummary.textContent = `You have ${incompleteRecipes.length} ${isPlural} left`;

  localStorage.setItem("ingredients", JSON.stringify(ingredients));
};

const renderIngredients = (ingredients, filters) => {
  let filterRecipes = ingredients.filter((recipe) => {
    const searchTextMatch = recipe.text
      .toLowerCase()
      .includes(filters.searchText.toLowerCase());

    const hideCompletedMatch = !filters.hideCompleted || !recipe.completed;
    return searchTextMatch && hideCompletedMatch;
  });

  ingredientList.innerHTML = "";

  const incompleteRecipes = filterRecipes.filter((recipeText) => {
    return !recipeText.completed;
  });

  updateHeading(incompleteRecipes);

  filterRecipes.forEach(function (recipeText) {
    const divEl = document.createElement("div");
    divEl.classList.add("row");
    // divEl.className = "justify-content-end";
    const checkBox = document.createElement("input");
    const recipeEl = document.createElement("li");
    const removeBnt = document.createElement("button");

    checkBox.setAttribute("type", "checkbox");
    checkBox.className = "mr-4";
    checkBox.checked = recipeText.completed;
    divEl.appendChild(checkBox);
    checkBox.addEventListener("change", () => {
      // Toggle the completed value for a given ingredientss
      const toggleIngredient = (id) => {
        const ingredient = ingredients.find((ingredient) => {
          return ingredient.id === id;
        });
        if (ingredient !== undefined) {
          ingredient.completed = !ingredient.completed;
        }
      };
      toggleIngredient(recipeText.id);
      localStorage.setItem("ingredients", JSON.stringify(ingredients));
    });

    if (recipeText.text.length > 0) {
      recipeEl.textContent = recipeText.text;
    } else {
      recipeEl.textContent = "Unnamed ingredient";
    }
    recipeEl.classList.add("ml-3");
    divEl.appendChild(recipeEl);

    removeBnt.className = "btn btn-danger btn-sm  btn-inline ml-5 mb-5 delete";
    removeBnt.appendChild(document.createTextNode("X"));

    removeBnt.addEventListener("click", () => {
      removeIngredientBtn(recipeText.id);
    });
    divEl.appendChild(removeBnt);

    ingredientList.appendChild(divEl);
  });
};

renderIngredients(ingredients, filters);

filterRecipeItems.addEventListener("input", (e) => {
  filters.searchText = e.target.value;
  renderIngredients(ingredients, filters);
});

addForm.addEventListener("submit", (e) => {
  e.preventDefault();
  ingredients.push({
    id: uuidv4(),
    text: e.target.elements.addRecipes.value,
    completed: false,
  });
  localStorage.setItem("ingredients", JSON.stringify(ingredients));
  renderIngredients(ingredients, filters);
  e.target.elements.addRecipes.value = "";
});

checkBoxEl.addEventListener("change", (e) => {
  filters.hideCompleted = e.target.checked;
  localStorage.setItem("ingredients", JSON.stringify(ingredients));
  renderIngredients(ingredients, filters);
});

removeAllIngredientsBtn.addEventListener("click", () => {
  ingredientList.querySelectorAll(".row").forEach((ingredientRow) => {
    ingredientRow.querySelector("button").click();
  });

  renderIngredients(ingredients, filters);
});

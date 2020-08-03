const form = document.querySelector("#addForm");
const itemList = document.querySelector("#recipe-list");
const filterRecipeInput = document.querySelector("#filter-recipes");
const addRecipeInput = document.querySelector("#item");

let recipes = [];

filters = {
  searchText: "",
};

const recipesJSON = localStorage.getItem("recipes");
if (recipesJSON !== null) {
  recipes = JSON.parse(recipesJSON);
}

const removeRecipe = (id) => {
  const recipeIndex = recipes.findIndex((recipe) => {
    return recipe.id === id;
  });
  if (recipeIndex > -1) {
    recipes.splice(recipeIndex, 1);
  }
  localStorage.setItem("recipes", JSON.stringify(recipes));
  renderRecipesItems(recipes, filters);
};

const renderRecipesItems = (recipes, filters) => {
  const filteredRecipes = recipes.filter((recipe) => {
    const matchText = recipe.title
      .toLowerCase()
      .includes(filters.searchText.toLowerCase());

    return matchText;
  });

  document.querySelector("#recipe-list").innerHTML = "";

  filteredRecipes.forEach((recipe) => {
    const recipeListItem = document.createElement("li");
    const recipeLink = document.createElement("a");
    const deleteBtn = document.createElement("button");

    recipeLink.textContent = recipe.title;
    recipeListItem.classList.add("list-group-item");
    recipeLink.setAttribute("href", `edit.html#${recipe.id}`);

    recipeListItem.appendChild(recipeLink);
    recipeListItem.appendChild(deleteBtn);

    itemList.appendChild(recipeListItem);

    deleteBtn.className =
      "btn btn-outline-danger float-right btn-inline btn-sm mb-3 delete";
    deleteBtn.textContent = "X";
    deleteBtn.addEventListener("click", () => {
      removeRecipe(recipe.id);
    });
  });
};

renderRecipesItems(recipes, filters);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const id = uuidv4();
  recipes.push({
    id: id,
    title: addRecipeInput.value,
  });
  localStorage.setItem("recipes", JSON.stringify(recipes));

  renderRecipesItems(recipes, filters);
});

filterRecipeInput.addEventListener("input", (e) => {
  filters.searchText = e.target.value;
  renderRecipesItems(recipes, filters);
});

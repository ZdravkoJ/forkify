import * as model from './model.js';
import recipeView from './views/recipeView.js';
import SearchView from './views/searchView.js';
import bookmarksView from './views/bookmarksView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { async } from 'regenerator-runtime';
import { MODAL_CLOSE_SEC } from './config.js';

// for old browsers
// import 'core-js/stable';
// import 'regenerator-runtime/runtime';
// import { async } from 'regenerator-runtime';

// if (module.hot) {
//   module.hot.accept();
// }

///////////////////////////////////////

const controleRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();
    //0) Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    bookmarksView.update(model.state.bookmarks);
    //1) Loading recipe
    await model.loadRecipe(id);

    //2) Rendering recipe
    recipeView.render(model.state.recipe);
    // Updating bookmarks view
    // controlServings();
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    //Show loading spinner
    addRecipeView.renderSpinner();
    // 1) Get search query
    const query = SearchView.getQuery();
    if (!query) return;

    //2) Load search result
    SearchView.clearInput();
    await model.loadSearchResults(query);

    //3. Render results
    resultsView.render(model.getSearchResultsPage());

    //4) Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    throw err;
  }
};

const controlerPagination = function (goToPage) {
  //3. Render results
  resultsView.render(model.getSearchResultsPage(goToPage));

  //4) Render initial pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //Update the recepi servings (in data)
  model.updateServings(newServings);
  //Update the recepi view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //Add and remove bookmarks
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  //Update recipe view
  recipeView.update(model.state.recipe);
  //Render bookmark list
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();
    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);
    // console.log(model.state.recipe);

    //render new recipe
    recipeView.render(model.state.recipe);

    //Success message

    addRecipeView.renderMessage();

    //Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    //Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    //close new recipe form
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    // console.error('😡', err);
    addRecipeView.renderError(err.message);
  }
};

const newFeature = function () {
  console.log('Welcome to the aplication!');
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHendlerRender(controleRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  SearchView.addHandlerSearch(controlSearchResults);
  paginationView.addHeandlerClick(controlerPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  newFeature();
};

init();

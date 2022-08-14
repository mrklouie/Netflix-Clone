import * as module from "./api.js";
history.scrollRestoration = "manual";
const homeEl = document.querySelector(".home");
const searchResults = document.getElementById("search-results");
const searchInputEl = document.getElementById("search-bar");
const searchOverlay = document.querySelector(".search-movies");
const homePage = document.querySelector(".home-page");
const api_key = "98c19a5dad17bb7710c0f45c6815d610";
const base_url = "https://api.themoviedb.org/3";
const image_url = "https://image.tmdb.org/t/p/w500";
const genre = "/genre/movie/list?";
const discover = "/discover/movie?";

const popular = new module.default(
  base_url,
  api_key,
  image_url,
  genre,
  discover
);

popular.getCategories();
popular.getMovies();
searchInputEl.addEventListener("input", (e) => {
  const countResults = [];
  const value = e.target.value.toLowerCase();
  if (value) {
    searchActive();
    window.scrollTo(0, 0);
    const data = popular.getSearchedMovies;

    data.forEach((item) => {
      const isVisible = item.title.toLowerCase().includes(value);
      item.card.classList.toggle("hide", !isVisible);
    });
    const results = document.querySelectorAll("#copy-movie");
    results.forEach((card) => {
      if (card.classList.contains("hide")) {
        countResults.push(card);
      }
    });
    if (countResults.length == data.length) {
      searchResults.textContent = `No results found on "${value}"`;
    } else {
      searchResults.innerHTML = "";
    }
  } else {
    searchInactive();
    console.log("Walang laman");
  }
});

//Variables are here

window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (scrollY >= 50) {
    navbar.style.backgroundColor = "#141414";
    navbar.style.transition = "background-color 0.3s ease-out";
  } else {
    navbar.style.backgroundColor = "transparent";
    navbar.style.transition = "background-color 0.3s ease-out";
  }
});

const searchActive = () => {
  searchOverlay.classList.add("active");
  homePage.classList.add("hide");
};

const searchInactive = () => {
  searchOverlay.classList.remove("active");
  homePage.classList.remove("hide");
};

homeEl.addEventListener("click", () => {
  searchInactive();
  searchInputEl.value = "";
});

document.addEventListener("click", (e) => {
  if (e.target.closest(".swiper-slide")) {
    const movieId = e.target.closest(".swiper-slide").id;
    sessionStorage.setItem("movie_id", movieId);
  }
});

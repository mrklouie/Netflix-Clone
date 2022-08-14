export { tmdb as default };

class tmdb {
  constructor(base_url, api_key, image_url, genre, discover) {
    this.base_url = base_url;
    this.api_key = api_key;
    this.image_url = image_url;
    this.genre = genre;
    this.discover = discover;
    this.finalData = [];
    this.searchedMovies = [];
  }

  get getSearchedMovies() {
    return this.searchedMovies;
  }

  getCategories() {
    const url =
      this.base_url +
      this.genre +
      new URLSearchParams({
        api_key: this.api_key,
        language: "en-US",
      });
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        data.genres.forEach((genre) => {
          const netflixBody = document.querySelector(".netflix-body");

          const carouselTemplate = document
            .querySelector(".carouselTemplate")
            .content.children[0].cloneNode(true);
          const genreTitle =
            carouselTemplate.querySelector(".row__genre-title");
          genreTitle.textContent = `${genre.name}`;
          genreTitle.id = `${genre.id}`;
          netflixBody.append(carouselTemplate);
        });
        this.getMovies();
        this.createCarousel();
      });
  }
  createCarousel() {
    const swiperContainers = document.querySelectorAll(".swiper");
    swiperContainers.forEach((container) => {
      container.addEventListener("mouseenter", () => {
        container.classList.add("active");
      });

      container.addEventListener("mouseleave", () => {
        container.classList.remove("active");
      });
    });
    swiperContainers.forEach((swiperContainer, index) => {
      swiperContainer.classList.add("swiper-container-" + index);
      const thisPagination = swiperContainer
        .closest(".row")
        .querySelector(".swiper-pagination");

      const swiper = new Swiper(".swiper-container-" + index, {
        slidesPerView: 6,
        slidesPerGroup: 6,
        spaceBetween: 5,
        loop: true,

        pagination: {
          el: thisPagination,
        },

        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },

        breakpoints: {
          320: {
            slidesPerView: 2,
            slidesPerGroup: 2,
            loop: false,
            freeMode: true,

            navigation: false,
          },
          480: {
            slidesPerView: 3,
            slidesPerGroup: 3,
          },
          760: {
            slidesPerView: 4,
            slidesPerGroup: 4,
          },
          1025: {
            loop: true,
            slidesPerView: 5,
            slidesPerGroup: 5,
          },

          1200: {
            loop: true,
            slidesPerView: 6,
            slidesPerGroup: 6,
            loopFillGroupWithBlank: true,
            pagination: {
              el: thisPagination,
              type: "bullets",
            },
            // Navigation arrows
            navigation: {
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            },
          },
        },
      });
    });
  }

  getMovies() {
    const imageNotAvailable =
      "/dist/assets/Image not available placeholder.jpg";
    const promises = [];

    const swiperContainers = document.querySelectorAll(".swiper");
    swiperContainers.forEach((container) => {
      const genreId = container
        .closest(".row")
        .querySelector(".row__genre-title").id;
      const url =
        this.base_url +
        this.discover +
        new URLSearchParams({
          api_key: this.api_key,
          language: "en-US",
          page: Math.floor(Math.random() * 3) + 1,
          with_genres: genreId,
        });
      promises.push(fetch(url).then((res) => res.json()));
    });
    Promise.all(promises)
      .then((result) => {
        //For each carousel
        let allGenres = [];
        result.forEach((data, index) => {
          const swiperWrapper =
            swiperContainers[index].querySelector(".swiper-wrapper");
          //For each slider wrapper
          data.results.forEach((data) => {
            const templateSlides = document
              .querySelector(".templateSlide")
              .content.children[0].cloneNode(true);
            const backdrop_path = this.image_url + data.backdrop_path;
            const image = templateSlides.querySelector(".swiper__movie-image");
            const title = templateSlides.querySelector(".swiper__movie-title");
            const rating = templateSlides.querySelector(".rating");
            const genresEl = templateSlides.querySelector(
              ".swiper__genres > span"
            );
            const runtimeEl = templateSlides.querySelector(".runtime");

            templateSlides.id = `${data.id}`;
            rating.textContent = `${data.vote_average}%`;
            title.textContent = `${data.title}`;

            data.backdrop_path
              ? image.setAttribute("src", `${backdrop_path}`)
              : image.setAttribute("src", `${imageNotAvailable}`);

            const movieDetails = `${this.base_url}/movie/${
              data.id
            }?${new URLSearchParams({
              api_key: this.api_key,
              language: "en-US",
            })}`;

            fetch(movieDetails)
              .then((movieDetails_res) => movieDetails_res.json())
              .then((movieDetails_data) => {
                const runtime = tmdb.getRuntime(movieDetails_data.runtime);
                runtimeEl.textContent = runtime;

                allGenres = movieDetails_data.genres.map((data) => data.name);

                genresEl.textContent += allGenres.join(", ");
              })
              .catch((err) => {
                console.log("An Error has been occured", err.message);
              });
            this.finalData.push({
              id: templateSlides.id,
              title: data.title,
              rating: data.title,
              movieCard: templateSlides,
            });
            swiperWrapper.append(templateSlides);
          });
        }); //End of these two loops
      })
      .then(() => {
        this.searchInputsAppend();
      });
  }

  searchInputsAppend() {
    this.searchedMovies = this.finalData.map((movie) => {
      const template = document
        .querySelector(".search-movies-template")
        .content.children[0].cloneNode(true);
      const searchWrapper = document.querySelector(
        ".search-movies__movie-cards"
      );
      const shallowCopy = movie.movieCard.cloneNode(true);

      shallowCopy.id = "copy-movie";
      searchWrapper.append(shallowCopy);

      return {
        title: movie.title,
        card: shallowCopy,
      };
    });
  }

  static getRuntime(runtime) {
    const num = runtime;
    const hours = num / 60;
    const rhours = Math.floor(hours);
    const minutes = (hours - rhours) * 60;
    const rminutes = Math.round(minutes);
    if (rhours == 0) {
      return `${rminutes}m`;
    } else {
      return `${rhours}h ${rminutes}m`;
    }
  }
}

const autocompleteConfig = {
   renderOption: (movie) => {
      const imgsrc = movie.Poster === "N/A" ? "" : movie.Poster;

      return `
      <img src="${movie.Poster}" />
       ${movie.Title}(${movie.Year})`;
   },

   inputValue(movie) {
      return movie.title;
   },

   async fetchData(searchTerm) {
      const response = await axios.get("http://www.omdbapi.com/", {
         params: {
            apikey: "819a62e4",
            s: searchTerm,
         },
      });

      if (response.data.Error) {
         return [];
      }

      return response.data.Search;
   },
};

//                   First Input
createAutoComplete({
   ...autocompleteConfig,
   root: document.querySelector("#left-autocomplete"),

   onOptionSelect(movie) {
      document.querySelector(".tutorial").classList.add("is-hidden");
      onMovieSelect(movie, document.querySelector("#left-summary"), "left");
   },
});

//                   second input
createAutoComplete({
   ...autocompleteConfig,
   root: document.querySelector("#right-autocomplete"),
   onOptionSelect(movie) {
      document.querySelector(".tutorial").classList.add("is-hidden");
      onMovieSelect(movie, document.querySelector("#right-summary"), "right");
   },
});
let leftMovie;
let rightMovie;
const onMovieSelect = async (movie, summaryElement, side) => {
   const response = await axios.get("http://www.omdbapi.com/", {
      params: {
         apikey: "819a62e4",
         i: movie.imdbID,
      },
   });
   summaryElement.innerHTML = movieTemplate(response.data);
   if (side === "left") {
      leftMovie = response.data;
   } else {
      rightMovie = response.data;
   }
   if (leftMovie && rightMovie) {
      runComparison();
   }
};
//                                       Comparison code
const runComparison = () => {
   const leftSideStats = document.querySelectorAll(
      "#left-summary .notification"
   );

   const RightSideStats = document.querySelectorAll(
      "#right-summary .notification"
   );

   leftSideStats.forEach((leftstat, index) => {
      const rightstat = RightSideStats[index];
      const leftSideValue = leftstat.dataset.value;
      const rightSideValue = rightstat.dataset.value;
      if (rightSideValue > leftSideValue) {
         leftstat.classList.remove("is-primary");
         leftstat.classList.add("is-warning");
      } else {
         rightstat.classList.remove("is-primary");
         rightstat.classList.add("is-warning");
      }
   });
};

const movieTemplate = (movieDetail) => {
   //                                     BoxOffice
   const dollars = parseInt(
      movieDetail.BoxOffice.replace(/\$/g, "").replace(/,/g, "")
   );
   //                                        MetaScore
   const MetaScore = parseInt(movieDetail.Metascore);
   //                                     IMDB Rating
   const rating = parseFloat(movieDetail.imdbRating);
   //                                     IMDB Votes
   const votes = parseInt(movieDetail.imdbVotes.replace(/,/g, ""));
   //                                        Awards Count, it checks for numbers in a string and converts them to int
   const awards = movieDetail.Awards.split(" ").reduce((prev, word) => {
      const value = parseInt(word);
      if (isNaN(value)) {
         return prev;
      } else {
         return prev + value;
      }
   }, 0);
   console.log(MetaScore, rating, votes, awards);

   return `
   <article class="media">
   <figure class="media-left">
      <p class="image"><img src="${movieDetail.Poster}" alt="" /></p>
   </figure>
   <div class="media-content">
      <div class="content">
         <h1>${movieDetail.Title}</h1>
         <h4>${movieDetail.Genre}</h4>
         <p>${movieDetail.Plot}</p>
      </div>
   </div>
</article>

<article data-value=${awards} class="notification is-primary>
<p class="title><b>${movieDetail.Awards}</b></p>
<p class="subtitle">Awards</p>
</article>
<article data-value=${dollars} class="notification is-primary>
<p class="title><b>${movieDetail.BoxOffice}</b></p>
<p class="subtitle">Box Office</p>
</article>
<article data-value=${MetaScore} class="notification is-primary>
<p class="title><b>${movieDetail.Metascore}</b></p>
<p class="subtitle">Meta Score</p>
</article>
<article data-value=${rating} class="notification is-primary>
<p class="title><b>${movieDetail.imdbRating}</b></p>
<p class="subtitle">imdb Rating</p>
</article>
<article data-value=${votes} class="notification is-primary>
<p class="title><b>${movieDetail.imdbVotes}</b></p>
<p class="subtitle">imdb Votes</p>
</article>
   `;
};

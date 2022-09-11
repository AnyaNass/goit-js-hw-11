import Notiflix from 'notiflix';
const axios = require("axios").default;

const searchForm = document.querySelector("#search-form");
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more-btn');

let page = 1;
let searchQueryInput = '';

async function getImages(q) {
	const searchParams = new URLSearchParams({
		image_type: "photo",
		orientation: "horizontal",
		safesearch: "true",
		per_page: 40
	});

	const gallery = await axios.get(`https://pixabay.com/api/?key=29841815-11a861cc71d343152543274bc&q=${q}&page=${page}&${searchParams}`);

	return gallery;
}

searchForm.addEventListener("submit", onSubmit)

function onSubmit(e) {
	e.preventDefault();

	searchQueryInput = e.target.elements.searchQuery.value.trim();
	// console.log(searchQueryInput);

	gallery.innerHTML = '';

	if (searchQueryInput === '') {
		return;
	}

	getImages(searchQueryInput)
		.then(gallery => {

			if (!gallery) {
				throw new Error();
			}

			if (gallery.data.hits.length < 1) {
				gallery.innerHTML = '';
				return Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
			}

			getRendering(gallery.data.hits)
			loadMoreBtn.removeAttribute('hidden', false)
		}
		).catch(err => console.log(err));

	searchForm.reset()
}

function getRendering(arr) {
	const murkap = arr.map(arr => {
		return `<div class="photo-card">
<img src="${arr.webformatURL}" alt="${arr.tags}" loading="lazy" width="100" height="100"/>
<div class="info">
  <p class="info-item">
  <b>Likes</b>
	${arr.likes}
  </p>
  <p class="info-item">
  <b>Views</b>
	 ${arr.views}
  </p>
  <p class="info-item">
  <b>Comments</b>
	 ${arr.comments}
  </p>
  <p class="info-item">
  <b>Downloads</b>
	 ${arr.downloads}
  </p>
</div>
</div>`
	}).join('');
	gallery.insertAdjacentHTML('beforeend', murkap)
}

loadMoreBtn.addEventListener('click', onloadMoreBtnClick);

function onloadMoreBtnClick() {
	page += 1;
	getImages(searchQueryInput)
		.then(gallery => {

			if (!gallery) {
				throw new Error();
			}

			if (page >= Math.ceil(gallery.data.totalHits / gallery.data.hits.length)) {
				loadMoreBtn.setAttribute('hidden', true)
				// gallery.insertAdjacentHTML('afterend', "<div>We're sorry, but you've reached the end of search results.</div>")
			}

			getRendering(gallery.data.hits)
		}
		).catch(err => console.log(err));
}





















// class Gallery {
// 	baseURL = 'https://pixabay.com/api/?key=29841815-11a861cc71d343152543274bc';
// 	page = 1;
// 	per_page = 40;


// 	async getImages(q) {
// 		const config = {
// 			params: {
// 				image_type: "photo",
// 				orientation: "horizontal",
// 				safesearch: "true",
// 			}
// 		}
// 		return await axios.get(`${this.baseURL}&q=${q}`, config).then(resp => console.log(resp.data))
// 	}
// }

// const gallery = new Gallery();

// const searchForm = document.querySelector("#search-form");

// searchForm.addEventListener("submit", onSubmit)

// async function onSubmit(e) {
// 	e.preventDefault();

// 	const searchQueryInput = e.target.elements.searchQuery.value;
// 	console.log(searchQueryInput);

// 	gallery.getImages(searchQueryInput)

// }






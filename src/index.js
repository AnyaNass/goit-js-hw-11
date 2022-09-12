import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { Gallery } from './js/image-service';

const lightbox = new SimpleLightbox('.gallery a', { /* options */ });
const images = new Gallery();

const searchForm = document.querySelector("#search-form");
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more-btn');
const theEndOfCollection = document.querySelector('.the-end')

searchForm.addEventListener("submit", onSubmit)
loadMoreBtn.addEventListener('click', onloadMoreBtnClick);

function onSubmit(e) {
	e.preventDefault();

	images.searchQueryInput = e.target.elements.searchQuery.value.trim();

	images.page = 1;
	gallery.innerHTML = '';
	theEndOfCollection.classList.add('is-hidden')

	if (images.searchQueryInput === '') {
		return;
	}

	images.getImages(e.target.elements.searchQuery.value.trim())
		.then(gallery => {

			if (!gallery) {
				throw new Error();
			}

			if (gallery.data.hits.length < 1) {
				gallery.innerHTML = '';
				return Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
			}

			Notiflix.Notify.success(`Hooray! We found ${gallery.data.totalHits} images.`);
			getRendering(gallery.data.hits)
			lightbox.refresh();
			loadMoreBtn.removeAttribute('hidden', false)
		}
		).catch(err => console.log(err));

	searchForm.reset()
}

function getRendering(arr) {
	const murkap = arr.map(arr => {
		return `<div class="photo-card">
		<a href="${arr.largeImageURL}">
<img src="${arr.webformatURL}" alt="${arr.tags}" loading="lazy" width="300" height="150"/></a>
<div class="info">
  <p class="info-item">
  <b>❤</b>
	${arr.likes}
  </p>
  <p class="info-item">
  <b>👁</b>
	 ${arr.views}
  </p>
  <p class="info-item">
  <b>💭</b>
	 ${arr.comments}
  </p>
  <p class="info-item">
  <b>📥</b>
	 ${arr.downloads}
  </p>
</div>
</div>`
	}).join('');
	gallery.insertAdjacentHTML('beforeend', murkap)
}

function onloadMoreBtnClick() {
	images.pageIncrement();

	// page += 1;
	images.getImages(searchQueryInput)
		.then(gallery => {

			if (!gallery) {
				throw new Error();
			}

			if (page >= Math.ceil(gallery.data.totalHits / gallery.data.hits.length)) {
				loadMoreBtn.setAttribute('hidden', true)
				theEndOfCollection.classList.remove('is-hidden')
				// gallery.insertAdjacentHTML('afterend', "<div>We're sorry, but you've reached the end of search results.</div>")
			}

			getRendering(gallery.data.hits)
			lightbox.refresh();
		}
		).catch(err => console.log(err));

}

// const { height: cardHeight } = document
// 	.querySelector(".gallery")
// 	.firstElementChild.getBoundingClientRect();

// window.scrollBy({
// 	top: cardHeight * 2,
// 	behavior: "smooth",
// });

// console.log(gallery.firstElementChild);
































// let page = 1;
// let searchQueryInput = '';

// async function getImages(q) {
// 	const searchParams = new URLSearchParams({
// 		image_type: "photo",
// 		orientation: "horizontal",
// 		safesearch: "true",
// 		per_page: 200
// 	});

// 	const gallery = await axios.get(`https://pixabay.com/api/?key=29841815-11a861cc71d343152543274bc&q=${q}&page=${page}&${searchParams}`);
// 	return gallery;
// }
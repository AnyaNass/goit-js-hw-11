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
	loadMoreBtn.setAttribute('hidden', true);
	gallery.innerHTML = '';
	theEndOfCollection.classList.add('is-hidden')

	if (images.searchQueryInput === '') {
		return;
	}

	images.getImages(images.searchQueryInput)
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

	images.getImages(images.searchQueryInput)
		.then(gallery => {

			if (!gallery) {
				throw new Error();
			}

			if (images.page >= Math.ceil(gallery.data.totalHits / gallery.data.hits.length)) {
				loadMoreBtn.setAttribute('hidden', true)
				theEndOfCollection.classList.remove('is-hidden')
			}

			getRendering(gallery.data.hits)
			lightbox.refresh();
		}
		).catch(err => console.log(err));

}


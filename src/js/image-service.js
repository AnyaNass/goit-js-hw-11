// const axios = require("axios").default;

// let page = 1;
// let searchQueryInput = '';

// export async function getImages(q) {
// 	const searchParams = new URLSearchParams({
// 		image_type: "photo",
// 		orientation: "horizontal",
// 		safesearch: "true",
// 		per_page: 200
// 	});

// 	const gallery = await axios.get(`https://pixabay.com/api/?key=29841815-11a861cc71d343152543274bc&q=${q}&page=${page}&${searchParams}`);

// 	return gallery;
// }
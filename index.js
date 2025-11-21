// Import cat meme data (relative path for GitHub Pages compatibility)
import { catsData } from "./data.js";

// DOM element references
const emotionRadios = document.getElementById("emotion-radios");
const getImageBtn = document.getElementById("get-image-btn");
const gifsOnlyOption = document.getElementById("gifs-only-option");
const memeModalInner = document.getElementById("meme-modal-inner");
const memeModal = document.getElementById("meme-modal");
const memeModalCloseBtn = document.getElementById("meme-modal-close-btn");
const memeModalLeftBtn = document.getElementById("meme-modal-left");
const memeModalRightBtn = document.getElementById("meme-modal-right");
const generatedCats = [];
let currentCatIndex = null;

// Event listeners
emotionRadios.addEventListener("change", highlightCheckedOption);
memeModalCloseBtn.addEventListener("click", closeModal);
getImageBtn.addEventListener("click", renderCat);
// Close modal only when clicking outside the modal (overlay), and only if modal is open
document.addEventListener("mousedown", (e) => {
  if (memeModal.style.display === "flex" && !memeModal.contains(e.target)) {
    closeModal();
  }
});
memeModalLeftBtn.addEventListener("click", moveLeft);
memeModalRightBtn.addEventListener("click", moveRight);

function moveLeft() {
  if (currentCatIndex > 0) {
    currentCatIndex--;
    showCatAtIndex(currentCatIndex);
  }
}

function moveRight() {
  if (currentCatIndex < generatedCats.length - 1) {
    currentCatIndex++;
    showCatAtIndex(currentCatIndex);
  }
}

function showCatAtIndex(index) {
  const catObject = generatedCats[index];
  if (!catObject) return;
  memeModalInner.innerHTML = `
    <img 
      class="cat-img" 
      src="./images/${catObject.image}"
      alt="${catObject.alt}"
    >
    <div style="text-align:center; margin-top:8px; font-size:14px; color:#555;">${
      index + 1
    } / ${generatedCats.length}</div>
  `;
  memeModalLeftBtn.disabled = index <= 0;
  memeModalRightBtn.disabled = index >= generatedCats.length - 1;
}

// Highlight the selected emotion radio
function highlightCheckedOption(e) {
  const radios = document.getElementsByClassName("radio");
  for (let radio of radios) {
    radio.classList.remove("highlight");
  }
  document.getElementById(e.target.id).parentElement.classList.add("highlight");
}

// Close the meme modal
function closeModal() {
  memeModal.style.display = "none";
}

// Render a random cat meme based on selected emotion and GIF option
function renderCat() {
  const catObject = getSingleCatObject();
  if (!catObject) {
    memeModalLeftBtn.disabled = true;
    memeModalRightBtn.disabled = true;
    return;
  } else {
    // Prevent duplicates
    const alreadyExists = generatedCats.some(
      (cat) => cat.image === catObject.image
    );
    if (!alreadyExists) {
      generatedCats.push(catObject);
      currentCatIndex = generatedCats.length - 1;
    } else {
      // If duplicate, show the existing one
      currentCatIndex = generatedCats.findIndex(
        (cat) => cat.image === catObject.image
      );
    }
    showCatAtIndex(currentCatIndex);
  }
  memeModal.style.display = "flex";
}

// Get a single cat object (random if multiple match)
function getSingleCatObject() {
  const catsArray = getMatchingCatsArray();
  if (!catsArray || catsArray.length === 0) return null;
  if (catsArray.length === 1) {
    return catsArray[0];
  } else {
    const randomNumber = Math.floor(Math.random() * catsArray.length);
    return catsArray[randomNumber];
  }
}

// Get array of cats matching selected emotion and GIF option
function getMatchingCatsArray() {
  const checkedRadio = document.querySelector('input[type="radio"]:checked');
  if (checkedRadio) {
    const selectedEmotion = checkedRadio.value;
    const isGif = gifsOnlyOption.checked;
    return catsData.filter(
      (cat) =>
        cat.emotionTags.includes(selectedEmotion) && (isGif ? cat.isGif : true)
    );
  }
  return [];
}

// Get unique list of emotions from cats data
function getEmotionsArray(cats) {
  const emotionsSet = new Set();
  cats.forEach((cat) =>
    cat.emotionTags.forEach((emotion) => emotionsSet.add(emotion))
  );
  return Array.from(emotionsSet);
}

// Render emotion radio buttons
function renderEmotionsRadios(cats) {
  const emotions = getEmotionsArray(cats);
  emotionRadios.innerHTML = emotions
    .map(
      (emotion) => `
    <div class="radio">
      <label for="${emotion}">${emotion}</label>
      <input
        type="radio"
        id="${emotion}"
        value="${emotion}"
        name="emotions"
      >
    </div>
  `
    )
    .join("");
}

// Initial render
renderEmotionsRadios(catsData);

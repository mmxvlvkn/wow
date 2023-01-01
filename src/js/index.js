// HEADER

// Show contacts

const $HeaderContactsBtn = document.querySelector('.left-row__state-btn');
const $HeaderContactsList = document.querySelector('.left-row__state-list');

$HeaderContactsBtn.addEventListener('click', () => {
    $HeaderContactsList.classList.toggle('_shown');
});

window.addEventListener('click', (event) => {
    if ($HeaderContactsList.classList.contains('_shown')) {
        if (!(event.target.closest('.left-row__state-list') || event.target.closest('.left-row__state-btn'))) {
            $HeaderContactsList.classList.remove('_shown');
        }
    }
});

// PRODUCTS

// Adding slider functionality

const priceForOneLevel = 70;
document.querySelector('#product_card_form_1');
for (let i = 0; i < 11; i++) {
    const $productCards = document.querySelectorAll(`#product_card_form_${String(i + 1)}`);

    if ($productCards === 1) {
        addingSliderFunctionality($productCards);
    } else {
        $productCards.forEach($item => {
            addingSliderFunctionality($item);
        });
    }
}

function addingSliderFunctionality($form) {
    const $input = $form.querySelector('.product-card__levels-input');
    const $output = $form.querySelector('.product-card__levels-output');
    const $value = $form.querySelector('.product-card__price-value');

    $input.addEventListener('input', () => {
        $output.textContent = $input.value;
        $value.textContent = $input.value * priceForOneLevel;
    });
}

// REVIEW 

//Review slider

const $reviewContentContainer = document.querySelector('.reviews__content-container');
let $reviewsArray = $reviewContentContainer.querySelectorAll('.review');

const countReview = $reviewsArray.length;
let reviewWidth = $reviewsArray[0].clientWidth;
let countReviewInContainer = Math.floor($reviewContentContainer.clientWidth / reviewWidth);
let reviewGap = ($reviewContentContainer.clientWidth % reviewWidth) / (countReviewInContainer - 1);
window.addEventListener('resize', () => {
    reviewWidth = $reviewsArray[0].clientWidth;
    countReviewInContainer = Math.floor($reviewContentContainer.clientWidth / reviewWidth);
    reviewGap = ($reviewContentContainer.clientWidth % reviewWidth) / (countReviewInContainer - 1);
})

$reviewsArray[0].style.left = `-${reviewWidth + reviewGap}px`
$reviewsArray[1].style.left = `${0}px`
for (let i = 0; i < countReviewInContainer - 1; i++) {
    $reviewsArray[i + 2].style.left = `${(reviewWidth + reviewGap) * (i + 1)}px`
}
for (let i = 0; i < countReview - countReviewInContainer - 1; i++) {
    $reviewsArray[countReviewInContainer + i + 1].style.left = `${(reviewWidth + reviewGap) * countReviewInContainer}px`

}

setInterval(slide, 5000);

function slide() {
    for (let i = 0; i < countReviewInContainer + 1; i++) {
        $reviewsArray[i + 1].style.left = `${parseInt($reviewsArray[i + 1].style.left) - (reviewWidth + reviewGap)}px`;
    }
    
    $reviewsArray[0].style.left = `${(reviewWidth + reviewGap) * countReviewInContainer}px`
    $reviewContentContainer.append($reviewsArray[0]);
    $reviewsArray = $reviewContentContainer.querySelectorAll('.review');
}
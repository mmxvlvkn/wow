// MAIN_SCREEN

// Activate scroll button for products

const $mainScreenScrollBtn = $body.querySelector('.main-screen__view');
const $products = $body.querySelector('.product'); 

$mainScreenScrollBtn.addEventListener('click', () => {
    window.scrollBy(0, $products.getBoundingClientRect().y);
});

// REVIEW 

//Review slider

const $content = $body.querySelector('.content');
const $reviewContentContainer = $body.querySelector('.reviews__content-container');
let $reviewsArray = $reviewContentContainer.querySelectorAll('.review');

const countReview = $reviewsArray.length;
let contentWidth = $content.clientWidth - 30;
let reviewWidth = $reviewsArray[0].clientWidth;
let countReviewInContainer = ((contentWidth % reviewWidth) / (Math.floor(contentWidth / reviewWidth) - 1) >= 10) ? Math.floor(contentWidth / reviewWidth) : Math.floor(contentWidth / reviewWidth) - 1;
let reviewGap = ((contentWidth - (reviewWidth * countReviewInContainer)) / (countReviewInContainer - 1) < 25) ? (contentWidth - (reviewWidth * countReviewInContainer)) / (countReviewInContainer - 1) : 25;
let sidePadding = (contentWidth - (countReviewInContainer * reviewWidth + reviewGap * (countReviewInContainer - 1))) / 2;

$reviewContentContainer.style.width = `${(contentWidth - sidePadding * 2 > contentWidth) ? contentWidth : contentWidth - sidePadding * 2}px`;
$reviewContentContainer.style.height = `${$reviewsArray[0].clientHeight}px`;
$reviewsArray[0].style.left = `-${reviewWidth + reviewGap}px`
$reviewsArray[1].style.left = `${0}px`
for (let i = 0; i < countReviewInContainer - 1; i++) {
    $reviewsArray[i + 2].style.left = `${(reviewWidth + reviewGap) * (i + 1)}px`
}
for (let i = 0; i < countReview - countReviewInContainer - 1; i++) {
    $reviewsArray[countReviewInContainer + i + 1].style.left = `${(reviewWidth + reviewGap) * countReviewInContainer}px`
}

window.addEventListener('resize', () => {
    setTimeout(() => {
        contentWidth = $content.clientWidth - 30;
        reviewWidth = $reviewsArray[0].clientWidth;
        countReviewInContainer = ((contentWidth % reviewWidth) / (Math.floor(contentWidth / reviewWidth) - 1) >= 10) ? Math.floor(contentWidth / reviewWidth) : Math.floor(contentWidth / reviewWidth) - 1;
        reviewGap = ((contentWidth - (reviewWidth * countReviewInContainer)) / (countReviewInContainer - 1) < 25) ? (contentWidth - (reviewWidth * countReviewInContainer)) / (countReviewInContainer - 1) : 25;
        sidePadding = (contentWidth - (countReviewInContainer * reviewWidth + reviewGap * (countReviewInContainer - 1))) / 2;

        $reviewContentContainer.style.width = `${(contentWidth - sidePadding * 2 > contentWidth) ? contentWidth : contentWidth - sidePadding * 2}px`;
        $reviewContentContainer.style.height = `${$reviewsArray[0].clientHeight}px`;
        $reviewsArray[0].style.left = `-${reviewWidth + reviewGap}px`
        $reviewsArray[1].style.left = `${0}px`
        for (let i = 0; i < countReviewInContainer - 1; i++) {
            $reviewsArray[i + 2].style.left = `${(reviewWidth + reviewGap) * (i + 1)}px`
        } 
        for (let i = 0; i < countReview - countReviewInContainer - 1; i++) {
            $reviewsArray[countReviewInContainer + i + 1].style.left = `${(reviewWidth + reviewGap) * countReviewInContainer}px`
        }
    }, 500);
})

setInterval(slide, 5000);

function slide() {
    for (let i = 0; i < countReviewInContainer + 1; i++) {
        $reviewsArray[i + 1].style.left = `${parseInt($reviewsArray[i + 1].style.left) - (reviewWidth + reviewGap)}px`;
    }
    
    $reviewsArray[0].style.left = `${(reviewWidth + reviewGap) * countReviewInContainer}px`
    $reviewContentContainer.append($reviewsArray[0]);
    $reviewsArray = $reviewContentContainer.querySelectorAll('.review');
}

// FOOTER

// Activate navigation scroll buttons

const $footerNavServices = $body.querySelector('.footer__nav-services');
const $footerNavPersonalService = $body.querySelector('.footer__nav-personal-service');
const $footerNavAdvantages = $body.querySelector('.footer__nav-advantages');
const $footerNavReviews = $body.querySelector('.footer__nav-reviews');

//? $products;
const $personalService = $body.querySelector('.other-product');
const $advantages = $body.querySelector('.advantages');
const $reviews = $body.querySelector('.reviews');

activeteScrollButton($footerNavServices, $products);
activeteScrollButton($footerNavPersonalService, $personalService, 20);
activeteScrollButton($footerNavAdvantages, $advantages, 20);
activeteScrollButton($footerNavReviews, $reviews);

function activeteScrollButton($btn, $element, numberOfPixelsToMoveUp = 0) {
    $btn.addEventListener('click', () => {
        window.scrollBy(0, ($element.getBoundingClientRect().y - numberOfPixelsToMoveUp));
    });
}


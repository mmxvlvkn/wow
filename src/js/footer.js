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

function activateFooterList(prm1, prm2, prm3, prm4) {
    if (prm1) activeteScrollButton($footerNavServices, $products);
    if (prm2) activeteScrollButton($footerNavPersonalService, $personalService, 20);
    if (prm3) activeteScrollButton($footerNavAdvantages, $advantages, 20);
    if (prm4) activeteScrollButton($footerNavReviews, $reviews);
}


function activeteScrollButton($btn, $element, numberOfPixelsToMoveUp = 0) {
    $btn.addEventListener('click', () => {
        window.scrollBy(0, ($element.getBoundingClientRect().y - numberOfPixelsToMoveUp));
    });
}
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

// Languages

const $headerLanguage = document.querySelector('.header__languages');
const $headerLanguageEn = document.querySelector('.header__languages .languages__en');
const $headerLanguageRu = document.querySelector('.header__languages .languages__ru');

let currentLanguage = 'en';

languageChanges();

$headerLanguage.addEventListener('click', () => {
    if (currentLanguage === 'en') {
        currentLanguage = 'ru';

        $headerLanguageEn.classList.remove('languages__selected');
        $headerLanguageEn.classList.add('languages__not-selected');

        $headerLanguageRu.classList.remove('languages__not-selected');
        $headerLanguageRu.classList.add('languages__selected');
    } else {
        currentLanguage = 'en';

        $headerLanguageRu.classList.remove('languages__selected');
        $headerLanguageRu.classList.add('languages__not-selected');

        $headerLanguageEn.classList.remove('languages__not-selected');
        $headerLanguageEn.classList.add('languages__selected');
    }

    languageChanges();
});

function languageChanges() {
    const $enTextArray = document.querySelectorAll('.en');
    const $ruTextArray = document.querySelectorAll('.ru');

    if (currentLanguage === 'en') {
        $enTextArray.forEach($item => {
            $item.classList.add('_show');

            if ($item.classList.contains('_hide')) {
                $item.classList.remove('_hide');
            }
        });

        $ruTextArray.forEach($item => {
            $item.classList.add('_hide');

            if ($item.classList.contains('_show')) {
                $item.classList.remove('_show');
            }
        });
    } else {
        $ruTextArray.forEach($item => {
            $item.classList.add('_show');

            if ($item.classList.contains('_hide')) {
                $item.classList.remove('_hide');
            }
        });

        $enTextArray.forEach($item => {
            $item.classList.add('_hide');

            if ($item.classList.contains('_show')) {
                $item.classList.remove('_show');
            }
        });
    }
}

// PRODUCTS

// Adding slider functionality

const priceForOneLevelInRub = 70;
const priceForOneLevelInUsd = 1;

for (let i = 0; i < document.querySelectorAll('.product .product-card').length; i++) {
    const $productCards = document.querySelectorAll(`#product_card_form_${String(i + 1)}`);

    $productCards.forEach($item => {
        addingSliderFunctionality($item);
    });
}

function addingSliderFunctionality($form) {
    const $input = $form.querySelector('.product-card__levels-input');
    const $output = $form.querySelector('.product-card__levels-output');
    const $value = $form.querySelector('.product-card__price-value');

    $value.textContent = (currentLanguage === 'en') ? $input.value * priceForOneLevelInUsd : $input.value * priceForOneLevelInRub;

    $headerLanguage.addEventListener('click', () => {
        $value.textContent = (currentLanguage === 'en') ? $input.value * priceForOneLevelInUsd : $input.value * priceForOneLevelInRub;
    });

    $input.addEventListener('input', () => {
        $output.textContent = $input.value;
        $value.textContent = (currentLanguage === 'en') ? $input.value * priceForOneLevelInUsd : $input.value * priceForOneLevelInRub;
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
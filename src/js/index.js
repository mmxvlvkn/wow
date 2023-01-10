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

// Adoptive

const $headerBurgerButton = document.querySelector('.burger__button');
const $headerBurgerList = document.querySelector('.burger__list');
const $headerRightRow = document.querySelector('.right-row');
const $headerRightRowReg = $headerRightRow.querySelector('.right-row__reg');
const $headerRightRowLog = $headerRightRow.querySelector('.right-row__log');
const $headerLeftRow = document.querySelector('.left-row');
const $headerLeftRowLogo = $headerLeftRow.querySelector('.left-row__logo');
const $headerLeftRowTlg = $headerLeftRow.querySelector('.left-row__tlg');
const $headerLeftRowChat = $headerLeftRow.querySelector('.left-row__chat');
const $HeaderLeftRowContacts = $headerLeftRow.querySelector('.left-row__state');

if (document.documentElement.clientWidth <= 608) {
    headerAdoptiveLess880();
    headerAdoptiveLess608();
} else if (document.documentElement.clientWidth <= 880) {
    headerAdoptiveLess880();
}

window.addEventListener('resize', () => {
    if (document.documentElement.clientWidth <= 608) {
        if ($headerRightRowReg.closest('.burger__list') && !$HeaderLeftRowContacts.closest('.burger__list')) {
            headerAdoptiveLess608();
        } else if (!$headerRightRowReg.closest('.burger__list')) {
            headerAdoptiveLess880();
            headerAdoptiveLess608();
        }
    } else if (document.documentElement.clientWidth <= 880) {
        if ($HeaderLeftRowContacts.closest('.burger__list')) {
            headerAdoptiveMore608();
        } else if (!$headerRightRowReg.closest('.burger__list')) {
            headerAdoptiveLess880();
        }
    } else {
        if ($headerRightRowReg.closest('.burger__list') && !$HeaderLeftRowContacts.closest('.burger__list')) {
            headerAdoptiveMore880();
        } else if ($HeaderLeftRowContacts.closest('.burger__list')) {
            headerAdoptiveMore608();
            headerAdoptiveMore880();
        }
    }
});


function headerAdoptiveLess880() {
    $headerBurgerList.append($headerRightRowReg);
    $headerBurgerList.append($headerRightRowLog);
    $headerBurgerList.append($headerLeftRowTlg);
    $headerBurgerList.append($headerLeftRowChat);

    $headerRightRowReg.classList.add('burger__item');
    $headerRightRowLog.classList.add('burger__item');
    $headerLeftRowTlg.classList.add('burger__item');
    $headerLeftRowChat.classList.add('burger__item');
}

function headerAdoptiveMore880() {
    $headerRightRow.append($headerRightRowReg);
    $headerRightRow.append($headerRightRowLog);
    $headerLeftRow.append($headerLeftRowTlg);
    $headerLeftRow.append($headerLeftRowChat);

    $headerRightRowReg.classList.remove('burger__item');
    $headerRightRowLog.classList.remove('burger__item');
    $headerLeftRowTlg.classList.remove('burger__item');
    $headerLeftRowChat.classList.remove('burger__item');
}

function headerAdoptiveLess608() {
    $headerBurgerList.append($HeaderLeftRowContacts);
    $HeaderLeftRowContacts.classList.add('burger__item');
}

function headerAdoptiveMore608() {
    $headerLeftRowLogo.after($HeaderLeftRowContacts);
    $HeaderLeftRowContacts.classList.remove('burger__item');
}

// Show burger list

$headerBurgerButton.addEventListener('click', () => {
    $headerBurgerList.classList.toggle('_show');
});

window.addEventListener( 'click', (event) => {
    if ($headerBurgerList.classList.contains('_show')) {
        if (!event.target.closest('.burger')) {
            $headerBurgerList.classList.remove('_show');
        }
    }
});

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

const $content = document.querySelector('.content');
const $reviewContentContainer = document.querySelector('.reviews__content-container');
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
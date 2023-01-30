const HOST = 'http://localhost:3000';
const COLOR_2 = '#564fff';

// HEADER

// Login visualization in header when visiting the site

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('isLoggedIn') === 'true') {
        doLogin();
        checkToken();
    }
});

function checkToken() {
    fetch(`${HOST}/api/check_token`, {
        method: 'GET', 
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(async (res) => {
        if (res.status !== 200) {
            localStorage.setItem('isLoggedIn', 'false');
            doExit();
        }
    });
}

// Show contacts

const $body = document.querySelector('body')
const $HeaderContactsBtn = $body.querySelector('.left-row__state-btn');
const $HeaderContactsList = $body.querySelector('.left-row__state-list');

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

const $headerLanguage = $body.querySelector('.header__languages');
const $headerLanguageEn = $body.querySelector('.header__languages .languages__en');
const $headerLanguageRu = $body.querySelector('.header__languages .languages__ru');

let currentLanguage = localStorage.getItem('currentLanguage') || 'en';

if (currentLanguage !== 'en') {
    $headerLanguageEn.classList.remove('languages__selected');
    $headerLanguageEn.classList.add('languages__not-selected');

    $headerLanguageRu.classList.remove('languages__not-selected');
    $headerLanguageRu.classList.add('languages__selected');
}

setTimeout(() => {
    $headerLanguageEn.style.transitionDuration = '300ms';
    $headerLanguageRu.style.transitionDuration = '300ms';
}, 500);


languageChanges();

$headerLanguage.addEventListener('click', () => {
    if (currentLanguage === 'en') {
        localStorage.setItem('currentLanguage', 'ru');
        currentLanguage = 'ru';

        $headerLanguageEn.classList.remove('languages__selected');
        $headerLanguageEn.classList.add('languages__not-selected');

        $headerLanguageRu.classList.remove('languages__not-selected');
        $headerLanguageRu.classList.add('languages__selected');
    } else {
        localStorage.setItem('currentLanguage', 'en');
        currentLanguage = 'en';

        $headerLanguageRu.classList.remove('languages__selected');
        $headerLanguageRu.classList.add('languages__not-selected');

        $headerLanguageEn.classList.remove('languages__not-selected');
        $headerLanguageEn.classList.add('languages__selected');
    }

    languageChanges();
});

function languageChanges() {
    const $enTextArray = $body.querySelectorAll('.en');
    const $ruTextArray = $body.querySelectorAll('.ru');

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

const $headerBurgerButton = $body.querySelector('.burger__button');
const $headerBurgerList = $body.querySelector('.burger__list');
const $headerRightRow = $body.querySelector('.right-row');
const $headerRightRowReg = $headerRightRow.querySelector('.right-row__reg');
const $headerRightRowLog = $headerRightRow.querySelector('.right-row__log');
const $headerRightRowExit = $headerRightRow.querySelector('.right-row__exit');
const $headerRightRowAccount = $headerRightRow.querySelector('.right-row__account');
const $headerLeftRow = $body.querySelector('.left-row');
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
    $headerBurgerList.append($headerRightRowExit);
    $headerBurgerList.append($headerRightRowAccount);
    $headerBurgerList.append($headerLeftRowTlg);
    $headerBurgerList.append($headerLeftRowChat);

    $headerRightRowReg.classList.add('burger__item');
    $headerRightRowLog.classList.add('burger__item');
    $headerRightRowExit.classList.add('burger__item');
    $headerRightRowAccount.classList.add('burger__item');
    $headerLeftRowTlg.classList.add('burger__item');
    $headerLeftRowChat.classList.add('burger__item');
}

function headerAdoptiveMore880() {
    $headerRightRow.append($headerRightRowReg);
    $headerRightRow.append($headerRightRowLog);
    $headerRightRow.append($headerRightRowExit);
    $headerRightRow.append($headerRightRowAccount);
    $headerLeftRow.append($headerLeftRowTlg);
    $headerLeftRow.append($headerLeftRowChat);

    $headerRightRowReg.classList.remove('burger__item');
    $headerRightRowLog.classList.remove('burger__item');
    $headerRightRowExit.classList.remove('burger__item');
    $headerRightRowAccount.classList.remove('burger__item');
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

    if ($headerBurgerList.classList.contains('_show')) {
        $body.classList.add('_lock');
    } else {
        $body.classList.remove('_lock');
    }
});

window.addEventListener( 'click', (event) => {
    if ($headerBurgerList.classList.contains('_show')) {
        if (!event.target.closest('.burger') && !event.target.closest('.header__sign-up-popup')) {
            $headerBurgerList.classList.remove('_show');
            $body.classList.remove('_lock');
        }
    }
});

// Establishing a position burger list

$headerBurgerList.style.top = `${70 - document.documentElement.scrollTop}px`;
window.addEventListener('scroll', () => {
    $headerBurgerList.style.top = `${70 - document.documentElement.scrollTop}px`;
});

// SIGN UP

// Set width sign up

const $headerSignUpPopup = document.querySelector('.header__sign-up-popup');

window.addEventListener('resize', () => {
    $headerSignUpPopup.style.width = `${$body.clientWidth}px`
});

// Show sign up popup

//? $headerRightRowReg;
const $headerSignUpCloseBtn = $headerSignUpPopup.querySelector('.sign-up__close');


$headerRightRowReg.addEventListener('click', () => {
    $headerSignUpPopup.classList.toggle('_show');

    if ($headerSignUpPopup.classList.contains('_show')) {
        $body.classList.add('_lock');
    } else {
        $body.classList.remove('_lock');
    }
});

window.addEventListener( 'click', (event) => {
    if ($headerSignUpPopup.classList.contains('_show')) {
        if (!event.target.closest('.sign-up__container') && !event.target.closest('.right-row__reg')) {
            $headerSignUpPopup.classList.remove('_show');
            $body.classList.remove('_lock');
        }
    }
});

$headerSignUpCloseBtn.addEventListener('click', () => {
    if ($headerSignUpPopup.classList.contains('_show')) {
        $headerSignUpPopup.classList.remove('_show');
        $body.classList.remove('_lock');
    }
});

// Set position sign up

const $headerSignUpContainer = $headerSignUpPopup.querySelector('.sign-up__container');

if ($headerSignUpContainer.clientHeight + 40 > window.innerHeight) {
    $headerSignUpPopup.style.alignItems = 'flex-start';
    $headerSignUpPopup.style.marginTop = '20px';
} else {
    $headerSignUpPopup.style.alignItems = 'center';
    $headerSignUpPopup.style.marginTop = '0';
}

window.addEventListener('resize', () => {
    if ($headerSignUpContainer.clientHeight + 40 > window.innerHeight) {
        $headerSignUpPopup.style.alignItems = 'flex-start';
        $headerSignUpPopup.style.marginTop = '20px';
    } else {
        $headerSignUpPopup.style.alignItems = 'center';
        $headerSignUpPopup.style.marginTop = '0';
    }
})

// Register form Validation

const $headerSignUpFormReg = $headerSignUpPopup.querySelector('.sign-up__form-registration');
const $headerSignUpEmail = $headerSignUpFormReg.querySelector('.sign-up__email');
const $headerSignUpNickname = $headerSignUpFormReg.querySelector('.sign-up__nickname');
const $headerSignUpTlg = $headerSignUpFormReg.querySelector('.sign-up__tlg');
const $headerSignUpPassword = $headerSignUpFormReg.querySelector('.sign-up__password');
const $headerSignUpRepeatPassword = $headerSignUpFormReg.querySelector('.sign-up__repeat-password');
const $headerSignUpErrorMessage = $headerSignUpFormReg.querySelector('.sign-up__reg-error-message');

const $headerSignUpRegistration = $headerSignUpContainer.querySelector('.sign-up__registration');
const $headerSignUpActivation = $headerSignUpContainer.querySelector('.sign-up__activation');
const $headerSignUpBackBtn = $headerSignUpContainer.querySelector('.sign-up__back');
const $headerSignUpSubtitle = $headerSignUpContainer.querySelector('.sign-up__subtitle');
const $headerSignUpReorderBtn = $headerSignUpContainer.querySelector('.sign-up__reorder');
const $headerSignUpReorderCounter = $headerSignUpContainer.querySelector('.sign-up__reorder-counter');

let userEmail = ''

$headerSignUpFormReg.addEventListener('submit', (event) => {
    event.preventDefault();

    let errorMessage = '';

    if (!(/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu.test($headerSignUpEmail.value))) {
        $headerSignUpEmail.style.border = '1px solid red';
        errorMessage = (errorMessage) ? errorMessage : ((currentLanguage === 'en') ? 'Incorrect email' : 'Некорректная электронная почта');
    }

    if (!(/^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/.test($headerSignUpNickname.value))) {
        $headerSignUpNickname.style.border = '1px solid red';
        errorMessage = (errorMessage) ? errorMessage : ((currentLanguage === 'en') ? 'The nickname must start with a Latin letter, contain only Latin letters and numbers, and may contain the symbols -,_,.' : 'Никнейм должен начинаться с латинской буквы, содержать только латинские буквы и цифры, может содержать символы -,_,.');
    }

    if (!stringLengthCheck($headerSignUpNickname.value, 6)) {
        $headerSignUpNickname.style.border = '1px solid red';
        errorMessage = (errorMessage) ? errorMessage : ((currentLanguage === 'en') ? 'Nickname less than 6 characters' : 'Никнейм меньше 6 символов');
    }

    if (!(/^[@]{1}[^а-яё]+$/.test($headerSignUpTlg.value))) {
        $headerSignUpTlg.style.border = '1px solid red';
        errorMessage = (errorMessage) ? errorMessage : ((currentLanguage === 'en') ? 'Incorrect telegram' : 'Некорректный телеграм');
    }

    if (!stringLengthCheck($headerSignUpTlg.value, 2)) {
        $headerSignUpTlg.style.border = '1px solid red';
        errorMessage = (errorMessage) ? errorMessage : ((currentLanguage === 'en') ? 'Telegram less than 2 characters' : 'Телеграм меньше 2 символов');
    }

    if (!(/^(?=.*\d)(?=.*[a-zA-Z])(?!.*\s).*$/.test($headerSignUpPassword.value))) {
        $headerSignUpPassword.style.border = '1px solid red';
        $headerSignUpRepeatPassword.style.border = '1px solid red';
        errorMessage = (errorMessage) ? errorMessage : ((currentLanguage === 'en') ? 'Password must contain latin letters and numbers' : 'Пароль должен содержать латинские буквы и цифры');
    }

    if (!stringLengthCheck($headerSignUpPassword.value, 6)) {
        $headerSignUpPassword.style.border = '1px solid red';
        $headerSignUpRepeatPassword.style.border = '1px solid red';
        errorMessage = (errorMessage) ? errorMessage : ((currentLanguage === 'en') ? 'Password less than 6 characters' : 'Пароль меньше 6 символов');
    }

    if ($headerSignUpPassword.value !== $headerSignUpRepeatPassword.value) {
        $headerSignUpPassword.style.border = '1px solid red';
        $headerSignUpRepeatPassword.style.border = '1px solid red';
        errorMessage = (errorMessage) ? errorMessage : ((currentLanguage === 'en') ? 'Passwords do not match' : 'Пароли не совпадают');
    }

    if (errorMessage) {
        $headerSignUpErrorMessage.textContent = errorMessage;
    } else {
        if ($headerSignUpErrorMessage.textContent) {
            $headerSignUpErrorMessage.textContent = '';
        }

        // Query send for register

        fetch(`${HOST}/api/send_email_code`, {
            method: 'POST', 
            body: JSON.stringify({
                email: $headerSignUpEmail.value,
                nickname: $headerSignUpNickname.value,
                tlg: $headerSignUpTlg.value,
                pass: $headerSignUpPassword.value
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(async (res) => {
            const status = res.status;
            const data = await res.json();
            if (status !== 200) {
                try {
                    $headerSignUpErrorMessage.textContent = (currentLanguage === 'en') ? data.en : data.ru;
                } catch (error) {
                    console.error('Error: ' + error);
                }
            } else {
                userEmail = $headerSignUpEmail.value;

                $headerSignUpEmail.value = '';
                $headerSignUpNickname.value = '';
                $headerSignUpTlg.value = '';
                $headerSignUpPassword.value = '';
                $headerSignUpRepeatPassword.value = '';

                $headerSignUpEmail.style.border = `2px solid ${COLOR_2}`;
                $headerSignUpNickname.style.border = `2px solid ${COLOR_2}`;
                $headerSignUpTlg.style.border = `2px solid ${COLOR_2}`;
                $headerSignUpPassword.style.border = `2px solid ${COLOR_2}`;
                $headerSignUpRepeatPassword.style.border = `2px solid ${COLOR_2}`;

                $headerSignUpRegistration.classList.add('_hidden');
                $headerSignUpActivation.classList.add('_shown');
                $headerSignUpBackBtn.classList.add('_shown');

                $headerSignUpCodeError.textContent = (currentLanguage === 'en') ? data.en : data.ru;
                $headerSignUpSubtitle.textContent = (currentLanguage === 'en') ? `Email with code sent ${userEmail}` : `Сообщение с кодо отправлено на почту ${userEmail}`

                makeSendButtonInactive();
            }
        });
    }
});

// Remove red border by focus registration input

removeRedBorder($headerSignUpEmail);
removeRedBorder($headerSignUpNickname);
removeRedBorder($headerSignUpTlg);
removeRedBorder($headerSignUpPassword);
removeRedBorder($headerSignUpRepeatPassword);

function removeRedBorder($input) {
    $input.addEventListener('focus', () => {
        $input.style.border = `2px solid ${COLOR_2}`;
    });
}

function stringLengthCheck(str, len) {
    return str.length >= len;
}

// Return to the registration form on the button

$headerSignUpBackBtn.addEventListener('click', () => {
    $headerSignUpRegistration.classList.remove('_hidden');
    $headerSignUpActivation.classList.remove('_shown');
    $headerSignUpBackBtn.classList.remove('_shown');
});

// Send email-code again

const $headerSignUpFormActv = $headerSignUpPopup.querySelector('.sign-up__form-activation');
const $headerSignUpCodeInput = $headerSignUpFormActv.querySelector('.sign-up__code');
const $headerSignUpCodeError = $headerSignUpFormActv.querySelector('.sign-up__code-error-message');

$headerSignUpReorderBtn.addEventListener('click', () => {
    if (!$headerSignUpReorderBtn.classList.contains('_disables')) {
        const counter = makeSendButtonInactive();

        fetch(`${HOST}/api/send_code_again`, {
            method: 'POST', 
            body: JSON.stringify({
                email: userEmail,
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(async (res) => {
            const status = res.status;
            const data = await res.json();

            if (status !== 200) {
                try {
                    $headerSignUpCodeError.textContent = (currentLanguage === 'en') ? data.en : data.ru;

                    clearInterval(counter);
                    $headerSignUpReorderCounter.textContent = '';
                    $headerSignUpReorderBtn.classList.remove('_disabled');
                } catch (error) {
                    console.error('Error: ' + error);
                }
            }
        });
    }
});

// Activation form Validation

$headerSignUpFormActv.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!(/^[0-9]{6}$/.test($headerSignUpCodeInput.value))) {
        $headerSignUpCodeInput.style.border = `1px solid red`;

        $headerSignUpCodeError.textContent = (currentLanguage === 'en') ? 'Incorrect code' : 'Неверный код';
    } else {
        fetch(`${HOST}/api/sign_in`, {
            method: 'POST', 
            credentials: 'include',
            body: JSON.stringify({
                email: userEmail,
                code: $headerSignUpCodeInput.value
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(async (res) => {
            const status = res.status;
            const data = await res.json();

            if (status !== 200) {
                try {
                    $headerSignUpCodeError.textContent = (currentLanguage === 'en') ? data.en : data.ru;
                } catch (error) {
                    console.error('Error: ' + error);
                }
            } else {
                localStorage.setItem('isLoggedIn', 'true');
                
                doLogin();

                $headerSignUpCodeInput.value = '';
                $headerSignUpCodeInput.style.border = `2px solid ${COLOR_2}`;
                $headerSignUpCodeError.textContent = '';

                $headerSignUpRegistration.classList.remove('_hidden');
                $headerSignUpActivation.classList.remove('_shown');
                $headerSignUpBackBtn.classList.remove('_shown');

                $headerSignUpPopup.classList.remove('_show');
                $body.classList.remove('_lock');
            }
        });
    }
});

// Make the send button inactive

function makeSendButtonInactive() {
    $headerSignUpReorderBtn.classList.add('_disabled');

    let countOfSeconsd = 2 * 60;

    $headerSignUpReorderCounter.textContent = `${Math.floor(countOfSeconsd / 60)}:${(countOfSeconsd % 60 > 9) ? countOfSeconsd % 60 : '0' + countOfSeconsd % 60}`;

    const interval = setInterval(() => {
        countOfSeconsd -= 1;

        if (!countOfSeconsd) {
            clearInterval(interval);
            $headerSignUpReorderCounter.textContent = '';
            $headerSignUpReorderBtn.classList.remove('_disabled');
        } else {
            $headerSignUpReorderCounter.textContent = `${Math.floor(countOfSeconsd / 60)}:${(countOfSeconsd % 60 > 9) ? countOfSeconsd % 60 : '0' + countOfSeconsd % 60}`;
        }
    }, 1000)

    return interval;
}

// Remove red border and clean error message by focus

$headerSignUpCodeInput.addEventListener('focus', () => {
    $headerSignUpCodeInput.style.border = `2px solid ${COLOR_2}`;
    $headerSignUpCodeError.textContent = '';
});

// Exit visualization in header by button

$headerRightRowExit.addEventListener('click', () => {
    localStorage.setItem('isLoggedIn', 'false');

    doExit();
});

// Login visualization in header

function doLogin() {
    $headerRightRowReg.classList.add('_hidden');
    $headerRightRowLog.classList.add('_hidden');
    $headerRightRowExit.classList.add('_shown');
    $headerRightRowAccount.classList.add('_shown');
}

// Exit visualization in header

function doExit() {
    $headerRightRowReg.classList.remove('_hidden');
    $headerRightRowLog.classList.remove('_hidden');
    $headerRightRowExit.classList.remove('_shown');
    $headerRightRowAccount.classList.remove('_shown');
}

// MAIN_SCREEN

// Activate scroll button for products

const $mainScreenScrollBtn = $body.querySelector('.main-screen__view');
const $products = $body.querySelector('.product'); 

$mainScreenScrollBtn.addEventListener('click', () => {
    window.scrollBy(0, $products.getBoundingClientRect().y);
});

// PRODUCTS

// Adding slider functionality

const priceForOneLevelInRub = 70;
const priceForOneLevelInUsd = 1;

for (let i = 0; i < $body.querySelectorAll('.product .product-card').length; i++) {
    const $productCards = $body.querySelectorAll(`#product_card_form_${String(i + 1)}`);

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


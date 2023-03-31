// PRODUCT_PAGE

// Set min width for product page description

const $productPage = $body.querySelector('.produst-page');
const $productPageDescription = $body.querySelector('.produst-page__description');

$productPageDescription.style.minHeight = `${window.innerHeight - parseInt(window.getComputedStyle($body.querySelector('header')).height) - parseInt(window.getComputedStyle($productPage).paddingTop)}px`

// PRODUCT SETTINGS

// Set width for product settings container

const $productSettings = $body.querySelector('.product-settings');
const $productSettingsContainer = $productSettings.querySelector('.product-settings__container');
const productSettingsVerticalPadding = 10;

if (document.documentElement.clientWidth > 800) {
    $productSettingsContainer.style.height = `${document.documentElement.clientHeight - parseInt(window.getComputedStyle($body.querySelector('header')).height) - parseInt(window.getComputedStyle($productPage).paddingTop) - productSettingsVerticalPadding*2}px`;
}

// Set position for product settings container

let baseTopForDescription = parseInt(window.getComputedStyle($body.querySelector('header')).height) + parseInt(window.getComputedStyle($productPage).paddingTop);
let baseTopForProductSettingsContainer = baseTopForDescription + productSettingsVerticalPadding;
const $produstPageDescription = $productPage.querySelector('.produst-page__description');

if (window.clientWidth > 800) {
    if (window.scrollY >= (baseTopForDescription + $produstPageDescription.clientHeight - window.innerHeight)) {
        setPositionToEnd();
    } else {
        setPositionToStart();
    }
}

window.addEventListener('scroll', () => {
    if (window.innerWidth > 800) {
        if (window.scrollY >= (baseTopForDescription + $produstPageDescription.clientHeight - window.innerHeight)) {
            setPositionToEnd();
        } else {
            setPositionToStart();
        }
    }
});

function setPositionToStart() {
    $productSettingsContainer.style.top = `${baseTopForProductSettingsContainer}px`;
    parseFloat(window.getComputedStyle($productPageDescription).border.split(' ')[0])
    $productSettingsContainer.style.left = `${$productPageDescription.getBoundingClientRect().left + $productPageDescription.clientWidth + parseFloat(window.getComputedStyle($productPageDescription).border.split(' ')[0])*2 }px`;
    $productSettingsContainer.style.position = 'fixed';
}

function setPositionToEnd() {
    $productSettingsContainer.style.position = 'relative';
    $productSettingsContainer.style.left = `0px`;
    $productSettingsContainer.style.top = `${baseTopForDescription + $produstPageDescription.clientHeight - $productSettingsContainer.clientHeight - productSettingsVerticalPadding - baseTopForProductSettingsContainer}px`;
}

// Run radiobuttons

$body.querySelectorAll('.product-settings__radiobutton').forEach($item => {
    $item.addEventListener('click', runRadiobutton);
});

function runRadiobutton(event) {
    const $target = event.target.closest('.product-settings__radiobutton');
    const $parent = $target.parentNode;

    $parent.querySelectorAll('.product-settings__radiobutton').forEach($item => {
        if ($item.classList.contains('_checked')) {
            $item.classList.remove('_checked');
            $item.setAttribute('data-status', 'off');
        }
    });

    $target.classList.add('_checked');
    $target.setAttribute('data-status', 'on');
}

// Run slider range

const $optionsRange = $body.querySelectorAll('.product-settings__option.range');
const priceGaps = [1];

for (let i = 0; i < $optionsRange.length; i++) {
    const $progress = $optionsRange[i].querySelector('.product-settings__range-progress');
    const $inputsForRange = $optionsRange[i].querySelectorAll('.product-settings__input-for-range');
    const $ranges = $optionsRange[i].querySelectorAll('.product-settings__range');

    // Run input for slider range

    $inputsForRange.forEach($inputForRange => {
        $inputForRange.addEventListener('input', event => {
            const min = $ranges[0].getAttribute('min');
            const max = $ranges[0].getAttribute('max');
            let minVal = ($inputsForRange[0].value && $inputsForRange[0].value >= 0) ? parseInt($inputsForRange[0].value) : 0;
            let maxVal = ($inputsForRange[1].value && $inputsForRange[0].value >= 0) ? parseInt($inputsForRange[1].value) : 0;

            if ((maxVal - minVal >= priceGaps[i]) && (maxVal <= max)) {
                if (event.target.classList.contains('product-settings__input-for-range-min')) {
                    $ranges[0].value = minVal;
                    $progress.style.left = `${(minVal / max) * 100}%`;
                } else {
                    $ranges[1].value = maxVal;
                    $progress.style.right = `${100 - (maxVal / max) * 100}%`;
                }
            }
        });
    });

    // Run slider range

    $ranges.forEach($inputForRange => {
        $inputForRange.addEventListener('input', event => {
            const min = $ranges[0].getAttribute('min');
            const max = $ranges[0].getAttribute('max');
            let minVal = parseInt($ranges[0].value);
            let maxVal = parseInt($ranges[1].value);

            if (maxVal - minVal < priceGaps[i]) {
                if (event.target.classList.contains('product-settings__range-min')) {
                    $ranges[0].value = maxVal - priceGaps[i];
                } else {
                    $ranges[1].value = minVal + priceGaps[i];
                }
            } else {
                $inputsForRange[0].value = minVal;
                $inputsForRange[1].value = maxVal;
                $progress.style.left = `${(minVal / max) * 100}%`;
                $progress.style.right = `${100 - (maxVal / max) * 100}%`;
            }
        });
    });
}

// Adoptive

let windowWidth = document.documentElement.clientWidth;
let windowHeight = window.innerHeight;
let adobtiveStatus = 'null'

window.addEventListener('resize', () => {

    // Width adoptive

    baseTopForDescription = parseInt(window.getComputedStyle($body.querySelector('header')).height) + parseInt(window.getComputedStyle($productPage).paddingTop);
    baseTopForProductSettingsContainer = baseTopForDescription + productSettingsVerticalPadding;

    if (document.documentElement.clientWidth > 800) {
        $productSettingsContainer.style.left = `${$productPageDescription.getBoundingClientRect().left + $productPageDescription.clientWidth + 4}px`;
       
        $productSettingsContainer.style.height = `${document.documentElement.clientHeight - parseInt(window.getComputedStyle($body.querySelector('header')).height) - parseInt(window.getComputedStyle($productPage).paddingTop) - productSettingsVerticalPadding*2}px`;

        if (window.scrollY >= (baseTopForDescription + $produstPageDescription.clientHeight - window.innerHeight)) {
            setPositionToEnd();
        } else {
            setPositionToStart();
        }

        if (adobtiveStatus !== 'more') {
            adobtiveStatus = 'more';
        }
    } else if (adobtiveStatus !== 'less') {
        $productSettingsContainer.style.height = 'auto';
        $productSettingsContainer.style.position = 'relative';
        $productSettingsContainer.style.left = `0px`;
        $productSettingsContainer.style.top = `0px`;
        adobtiveStatus = 'less';
    }
});

// Price formation
let orderDescription;
const dataForPriceFormation = {
    base_price: 8.5,
    radio: {
        region: {
            eu: {
                is_coef: true,
                value: 1
            },
            us: {
                is_coef: true,
                value: 1.2
            }
        },
        faction: {
            horde: {
                is_coef: true,
                value: 1
            },
            alliance: {
                is_coef: true,
                value: 1
            }
        },
        boost_method: {
            self_play: {
                is_coef: true,
                value: 1
            },
            piloted: {
                is_coef: true,
                value: 1.06
            },
            remote_control: {
                is_coef: true,
                value: 1
            }
        },
        execution_options: {
            normal: {
                is_coef: true,
                value: 1
            },
            extra_fast: {
                is_coef: false,
                value: 8.28
            },
            faster_25: {
                is_coef: false,
                value: 3.31
            },
            faster_50: {
                is_coef: false,
                value: 5.8
            }
        }
    },
    range: {
        levels: {
            is_coef: false,
            value: 0.74
        }
    },
    checkbox: {
        additional_options: {
            additional_options_1: {
                is_coef: false,
                value: 18.15
            },
            additional_options_2: {
                is_coef: false,
                value: 40.59
            },
            additional_options_3: {
                is_coef: false,
                value: 45.93
            },
            additional_options_4: {
                is_coef: false,
                value: 32.04
            }
        }
    },
    select: {
        multiple_character_leveling: {
            characters_1: {
                is_coef: false,
                value: 0
            },
            characters_2: {
                is_coef: false,
                value: 15.12
            },
            characters_3: {
                is_coef: false,
                value: 29.43
            },
            characters_4: {
                is_coef: false,
                value: 43.24
            },
            characters_5: {
                is_coef: false,
                value: 56.71
            },
            characters_6: {
                is_coef: false,
                value: 68.71
            }
        }
    }
}

const $productPricesEn = $body.querySelectorAll('.product-price__price .en .product-price__text');
const $productPricesRu = $body.querySelectorAll('.product-price__price .ru .product-price__text');
const $radios = $body.querySelectorAll('.product-settings__option.radio');
const $ranges = $body.querySelectorAll('.product-settings__option.range');
const $checkboxes = $body.querySelectorAll('.product-settings__option.checkbox');
const $selects = $body.querySelectorAll('.product-settings__option.select');
let price = dataForPriceFormation.base_price;
let coef = 1;

priceFormation();

$radios.forEach($radio => {
    $radio.querySelectorAll('.product-settings__radiobutton').forEach($radioItem => {
        $radioItem.addEventListener('click', () => {
            priceFormation();
        });
    });
});

$ranges.forEach($range => {
    $range.querySelectorAll('input').forEach($rangeItem => {
        $rangeItem.addEventListener('input', () => {
            priceFormation();
        });
    });
});

$checkboxes.forEach($checkbox => {
    $checkbox.querySelectorAll('.product-settings__checkbox').forEach($checkboxItem => {
        $checkboxItem.addEventListener('input', () => {
            priceFormation();
        });
    });
});

$selects.forEach($select => {
    $select.querySelector('.product-settings__select').addEventListener('input', () => {
        priceFormation();
    });
});

function priceFormation() {
    orderDescription = '';
    price = dataForPriceFormation.base_price;
    coef = 1;

    orderDescription += 'radio:\n';
    $radios.forEach($radio => {
        $checked = $radio.querySelector('._checked');
        const data = dataForPriceFormation.radio[$checked.getAttribute('name')][$checked.getAttribute('value')];

        orderDescription += `  ${$checked.getAttribute('name')}:\n`;
        orderDescription += `    ${$checked.getAttribute('value')}:\n`;

        if (data.is_coef) {
            coef *= data.value;
        } else {
            price += data.value;
        }
    });

    orderDescription += 'range:\n';
    $ranges.forEach($range => {
        const delta = ($range.querySelector('.product-settings__input-for-range-max').value - $range.querySelector('.product-settings__input-for-range-min').value);
        const maxDelta = $range.querySelector('.product-settings__range-min').getAttribute('max') - $range.querySelector('.product-settings__range-min').getAttribute('min');

        orderDescription += `  ${$range.querySelector('.product-settings__input-for-range-min').getAttribute('name')}:\n`;
        orderDescription += `    ${$range.querySelector('.product-settings__range-min').getAttribute('min')} - ${$range.querySelector('.product-settings__range-min').getAttribute('max')}\n`;

        if (dataForPriceFormation.range[$range.querySelector('.product-settings__input-for-range-min').getAttribute('name')].is_coef) {
            if (delta >= 1 && delta <= maxDelta) {
                coef *= delta * dataForPriceFormation.range[$range.querySelector('.product-settings__input-for-range-min').getAttribute('name')].value;
            }
        } else {
            if (delta >= 1 && delta <= maxDelta) {
                price += delta * dataForPriceFormation.range[$range.querySelector('.product-settings__input-for-range-min').getAttribute('name')].value;
            }
        }
    });

    orderDescription += 'checkbox:\n';
    $checkboxes.forEach($checkbox => {
        let tempTitle = '';
        let tempSubtitle = '';

        $checkbox.querySelectorAll('.product-settings__checkbox').forEach($checkboxItem => {
            if ($checkboxItem.checked) {
                tempTitle = '  ' + String($checkboxItem.getAttribute('data-checkbox-name')) + '\n'; 
                tempSubtitle += '    ' + String($checkboxItem.getAttribute('name')) + '\n';

                if (dataForPriceFormation.checkbox[$checkboxItem.getAttribute('data-checkbox-name')][$checkboxItem.getAttribute('name')].is_coef) {
                    coef *= dataForPriceFormation.checkbox[$checkboxItem.getAttribute('data-checkbox-name')][$checkboxItem.getAttribute('name')].value;
                } else {
                    price += dataForPriceFormation.checkbox[$checkboxItem.getAttribute('data-checkbox-name')][$checkboxItem.getAttribute('name')].value;
                }
            }
        });

        orderDescription += tempTitle;
        orderDescription += tempSubtitle;
    });

    orderDescription += 'select:\n';
    $selects.forEach($select => {
        const $selectItem = $select.querySelector('.product-settings__select');

        orderDescription += `  ${$selectItem.getAttribute('name')}:\n`;
        orderDescription += `    ${$selectItem.value}:\n`;

        if (dataForPriceFormation.select[$selectItem.getAttribute('name')][$selectItem.value]) {
            if (dataForPriceFormation.select[$selectItem.getAttribute('name')][$selectItem.value].is_coef) {
                coef *= dataForPriceFormation.select[$selectItem.getAttribute('name')][$selectItem.value].value;
            } else {
                price += dataForPriceFormation.select[$selectItem.getAttribute('name')][$selectItem.value].value;
            }
        }
    });

    price *= coef;
    $productPricesEn[0].textContent = price.toFixed(2);
    $productPricesEn[1].textContent = price.toFixed(2);
    $productPricesRu[0].textContent = (price * 76).toFixed(2);
    $productPricesRu[1].textContent = (price * 76).toFixed(2);
}

// Submit and payment

const $form = $body.querySelector('.product-settings__form');

$form.addEventListener('submit', event => {
    event.preventDefault();

    if (localStorage.getItem('isLoggedIn') === 'true') {
        checkToken().then(checkTokenResult => {
            if (checkTokenResult) {
                //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                fetch(`${HOST}/api/send_email_code`, {
                    method: 'POST', 
                    credentials: 'include',
                    body: JSON.stringify({
                        price: price, 
                        description: orderDescription
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(async (res) => {
                    const status = res.status;
                    const data = await res.json();
                    if (status !== 200) {
                        
                    } else {
                        
                    }
                })
                .catch((error) => {
                    $headerSignUpErrorMessage.textContent = (currentLanguage === 'en') ? 'Unexpected error' : 'Непредвиденная ошибка';    
                    console.error('Fetch error');
                });

            } else {
                doExit();
    
                if (!$headerLogInPopup.classList.contains('_shown')) {
                    $headerLogInPopup.classList.add('_shown');
                    $body.classList.add('_lock');
                }
            }
        });
    } else {
        if (!$headerLogInPopup.classList.contains('_shown')) {
            $headerLogInPopup.classList.add('_shown');
            $body.classList.add('_lock');
        }
    }
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
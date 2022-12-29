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

console.log(1234)
const COLOR_WHITE = '#FFFFFF'
const $otherProductsForm = document.querySelector('.other-product__form');
const $otherProductsDescription = $otherProductsForm.querySelector('.other-product__textarea');
const $otherProductsPrice = $otherProductsForm.querySelectorAll('.other-product__inpit');
const $paymentError = $body.querySelector('.payment-error');
const $paymentSuccess = $body.querySelector('.payment-success');

let isOtherProductForm = true;

$otherProductsForm.addEventListener('submit', event => {
    event.preventDefault();

    if (isOtherProductForm) {    
        if (localStorage.getItem('isLoggedIn') === 'true') {    
            const otherProductsPrice = (currentLanguage === 'en') ? $otherProductsPrice[0].value : $otherProductsPrice[1].value;

            let isValid = true;

            if (!$otherProductsDescription.value) {
                $otherProductsDescription.style.border = '2px solid red';
                isValid = false;
            }

            if (!(/^[1-9]([0-9.,]{0,7})$/.test(otherProductsPrice) || /^[0][.]([0-9]{1,2})$/.test(otherProductsPrice))) {
                $otherProductsPrice[0].style.border = '2px solid red';
                $otherProductsPrice[1].style.border = '2px solid red';
                isValid = false;
            }

            if (isValid) {
                // Query send

                fetch(`${HOST}/api/create_other_product`, {
                    method: 'POST', 
                    credentials: 'include',
                    body: JSON.stringify({
                        orderDescription: $otherProductsDescription.value,
                        price: otherProductsPrice,
                        currentLanguage
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(async (res) => {
                    const status = res.status;
                    const data = await res.json();
                    if (status !== 200) {
                        $paymentError.classList.add('_shown');
                        $body.classList.add('_lock');
                        console.error("Fetch error: " + error);
                        isOtherProductForm = false;
                    } else {
                        $otherProductsDescription.value = '';
                        $otherProductsPrice[0].value = '';
                        $otherProductsPrice[1].value = '';

                        $otherProductsDescription.style.border = `2px solid ${COLOR_WHITE}`;
                        $otherProductsPrice[0].style.border = `2px solid ${COLOR_WHITE}`;
                        $otherProductsPrice[1].style.border = `2px solid ${COLOR_WHITE}`;

                        $paymentSuccess.classList.add('_shown');
                        isOtherProductForm = false;
                        $body.classList.add('_lock');
                    }
                })
                .catch((error) => {
                    $paymentError.classList.add('_shown');
                    isOtherProductForm = false;
                    $body.classList.add('_lock');
                    console.error("Fetch error: " + error);
                });
            }
        } else {
            $headerLogInPopup.classList.toggle('_shown');
            $body.classList.add('_lock');
        }
    }
});

removeRedBorder($otherProductsDescription, null, COLOR_WHITE);
removeRedBorder($otherProductsPrice[0], null, COLOR_WHITE);
removeRedBorder($otherProductsPrice[1], null, COLOR_WHITE);

window.addEventListener('click', (event) => {
    if ($paymentError.classList.contains('_shown')) {
        if (!event.target.closest('.payment-error__container') || event.target.classList.contains('payment-error__btn')) {
            $paymentError.classList.remove('_shown');
            $body.classList.remove('_lock');
            setTimeout(() => {
                isOtherProductForm = true;
            }, 2000);
        }
    }
    if ($paymentSuccess.classList.contains('_shown')) {
        if (!event.target.closest('.payment-success__container') || event.target.classList.contains('payment-success__btn')) {
            $paymentSuccess.classList.remove('_shown');
            $body.classList.remove('_lock');
            setTimeout(() => {
                isOtherProductForm = true;
            }, 2000);
        }
    }
});
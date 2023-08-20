const $accountOrders = $body.querySelector('.account__orders');

// Products display

window.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('isLoggedIn') === 'true') {
        // Main products display

        fetch(`${HOST}/api/get_user_products`, {
            method: 'GET', 
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(async (res) => {
            const status = res.status;
            const data = await res.json();
            if (status !== 200) {
                try {
                    $accountOrders.innerHTML = (currentLanguage === 'en') ? 'Error' : 'Ошибка';
                } catch (error) {
                    console.error('Error: ' + error);
                }
            } else {
                if (data.length) {
                    data.forEach(product => {
                        // Main product parse

                        // Price formation
                        product.price = Number(product.price)
                        if (product.current_language === 'ru') {
                            if (Number.isInteger(Number((product.price * usdRusCourse).toFixed(2)))) {
                                product.price = Math.round(product.price * usdRusCourse) + 'руб.';
                            } else {
                                product.price = (product.price * usdRusCourse).toFixed(2) + 'руб.';
                            }
                        } else {
                            if (Number.isInteger(Number((product.price).toFixed(2)))) {
                                product.price = Math.round(product.price) + '$';
                            } else {
                                product.price = (product.price).toFixed(2) + '$';
                            }
                        }

                        // Price description formation
                        const $productDescription = getNewOrderItemOptionElement();
                        let tempDescription = product.order_description.match(/radio:([\s\S]+?)range:/)[1];
                        formationProductDescriptionEmement(tempDescription, $productDescription)

                        tempDescription = product.order_description.match(/range:([\s\S]+?)checkbox:/)[1];
                        formationProductDescriptionEmement(tempDescription, $productDescription)

                        tempDescription = product.order_description.match(/checkbox:([\s\S]+?)select:/)[1];
                        tempDescription = tempDescription.split(' ').join('').split('\n').join('');
                        if (stringIsValid(tempDescription)) {
                            while (tempDescription.length) {
                                let descriptionSubtitle = tempDescription.match(/^([\s\S]+?):/)[1] + ':';
                                tempDescription = tempDescription.slice(tempDescription.match(/^([\s\S]+?):/)[1].length + 1);

                                while (tempDescription.indexOf(':') > tempDescription.indexOf(',') || (!tempDescription.includes(':') && tempDescription.includes(','))) {
                                    let descriptionElement = document.createElement('div');
                                    descriptionElement.className = 'payment__description-object';
                                    let HTMLForDescriptionElement = `<p class="payment__description-subtitle">${descriptionSubtitle}</p>`;
                                    HTMLForDescriptionElement += `<p class="payment__description-value">${tempDescription.match(/^([\s\S]+?),/)[1] + ','}</p>`;
                                    tempDescription = tempDescription.slice(tempDescription.match(/^([\s\S]+?),/)[1].length + 1);
                                    descriptionElement.innerHTML = HTMLForDescriptionElement;
                                    $productDescription.append(descriptionElement);
                                }
                            }
                        }

                        tempDescription = product.order_description.match(/select:([\s\S]+?)$/)[1];
                        formationProductDescriptionEmement(tempDescription, $productDescription)

                        // Formation info about user
                        const $productUserInfo = getNewOrderItemOptionElement(
                            `<div class="payment__description-object" style="margin-bottom: 10px;">
                                <p class="payment__description-subtitle">Status:</p>
                                <p class="payment__description-value">
                                    ${product.product_status}
                                </p>
                            </div>
                            <div class="payment__description-object">
                                <p class="payment__description-subtitle">Nickname:</p>
                                <p class="payment__description-value">${product.nickname + ','}</p>
                            </div>
                            <div class="payment__description-object">
                                <p class="payment__description-subtitle">Email:</p>
                                <p class="payment__description-value">${product.email + ','}</p>
                            </div>
                            <div class="payment__description-object">
                                <p class="payment__description-subtitle">Telegram:</p>
                                <p class="payment__description-value">${product.tlg + ','}</p>
                            </div>`
                        );

                        // Display products
                        let $productArticle = document.createElement('article');
                        $productArticle.className = "account__order order-item";
                        $productArticle.append(getNewOrderItemOptionElement(`<p style="margin-bottom: 7px">${product.create_date}</p><p>${product.create_time}</p>`));
                        $productArticle.append(getNewOrderItemOptionElement('#' + product.order_number));
                        $productArticle.append(getNewOrderItemOptionElement(`<p class="en">${product.title_en}</p><p class="ru">${product.title_ru}</p>`));
                        $productArticle.append(getNewOrderItemOptionElement(product.price));
                        $productArticle.append($productDescription);                      
                        $productArticle.append($productUserInfo);
                        $accountOrders.prepend($productArticle);
                        languageChanges();
                    });
                } else {
                    if (localStorage.getItem('isLoggedIn') === 'true') {
                        const $innerInfo = document.createElement('span');
                        $innerInfo.innerHTML = `<span class='en'>No orders</span><span class='ru'>Заказы отсутствуют</span>`;
                        $innerInfo.style.display = 'block';
                        $innerInfo.style.marginBottom = '10px';
                        $accountOrders.append($innerInfo);
                        languageChanges();
                    } else {
                        const $innerInfo = document.createElement('span');
                        $innerInfo.innerHTML = `<span class='en'>You are not logged in</span><span class='ru'>Вы не вошли в аккаунт</span>`;
                        $innerInfo.style.display = 'block';
                        $innerInfo.style.marginBottom = '10px';
                        $accountOrders.append($innerInfo);
                        languageChanges();
                    }
                }
            }
        })
        .then(() => {
            // Other products display

            fetch(`${HOST}/api/get_user_other_products`, {
                method: 'GET', 
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(async (res) => {
                const status = res.status;
                const data = await res.json();
                if (status !== 200) {
                    console.error('Bad status');
                } else {
                    if (data.length) {
                        // Other product parse
                        const $subtitle = document.createElement('h2');
                        $subtitle.className = "account__subtitle";
                        $subtitle.style.marginBottom = "2px";
                        $subtitle.innerHTML = `<span class='en'>Personal services</span><span class='ru'>Персональные услуги</span>`;
                        $accountOrders.append($subtitle);

                        data.forEach(product => {
                            // Formation info about user
                            const $productUserInfo = getNewOrderItemOptionElement(
                                `<div class="payment__description-object" style="margin-bottom: 10px;">
                                    <p class="payment__description-subtitle">Status:</p>
                                    <p class="payment__description-value">
                                        ${product.product_status}
                                    </p>
                                </div>
                                <div class="payment__description-object">
                                    <p class="payment__description-subtitle">Nickname:</p>
                                    <p class="payment__description-value">${product.nickname + ','}</p>
                                </div>
                                <div class="payment__description-object">
                                    <p class="payment__description-subtitle">Email:</p>
                                    <p class="payment__description-value">${product.email + ','}</p>
                                </div>
                                <div class="payment__description-object">
                                    <p class="payment__description-subtitle">Telegram:</p>
                                    <p class="payment__description-value">${product.tlg + ','}</p>
                                </div>`
                            );

                            // Display products
                            let $productArticle = document.createElement('article');
                            $productArticle.className = "account__order order-item";
                            $productArticle.append(getNewOrderItemOptionElement(`<p style="margin-bottom: 7px">${product.create_date}</p><p>${product.create_time}</p>`));
                            $productArticle.append(getNewOrderItemOptionElement('#' + product.order_number));
                            $productArticle.append(getNewOrderItemOptionElement(`<p class="ru">${'Персональная услуга'}</p><p class="en">${'Personal service'}</p>`));
                            $productArticle.append(getNewOrderItemOptionElement((product.current_language === 'en') ? product.price + "$" : product.price + "руб."));
                            $productArticle.append(getNewOrderItemOptionElement(product.order_description));
                            $productArticle.append($productUserInfo);
                            $subtitle.after($productArticle);
                            languageChanges();
                        });
                    }
                }
            })
            .catch((error) => {
                $accountOrders.innerHTML = (currentLanguage === 'en') ? 'Error' : 'Ошибка';
                console.error('Fetch error: ' + error);
            });
        })
        .catch((error) => {
            $accountOrders.innerHTML = (currentLanguage === 'en') ? 'Error' : 'Ошибка';
            console.error('Fetch error: ' + error);
        });
    } else {
        if (localStorage.getItem('isLoggedIn') === 'true') {
            const $innerInfo = document.createElement('span');
            $innerInfo.innerHTML = `<span class='en'>No orders</span><span class='ru'>Заказы отсутствуют</span>`;
            //!
            $innerInfo.style.display = 'block';
            $innerInfo.style.marginBottom = '10px';
            $accountOrders.append($innerInfo);
            languageChanges();
        } else {
            const $innerInfo = document.createElement('span');
            $innerInfo.innerHTML = `<span class='en'>You are not logged in</span><span class='ru'>Вы не вошли в аккаунт</span>`;
            $innerInfo.style.display = 'block';
            $innerInfo.style.marginBottom = '10px';
            $accountOrders.append($innerInfo);
            languageChanges();
        }
    }
});

function getNewOrderItemOptionElement(innerHTML = false) {
    const $orderItemOption = document.createElement('div');
    $orderItemOption.className = "order-item__option";
    if (innerHTML) {
        $orderItemOption.innerHTML = innerHTML;
    }

    return $orderItemOption;
}

function formationProductDescriptionEmement(tempDescription, $productDescription) {
    tempDescription = tempDescription.split(' ').join('').split('\n').join('');
    if (stringIsValid(tempDescription)) {
        while (tempDescription.length) {
            let descriptionElement = document.createElement('div');
            descriptionElement.className = 'payment__description-object';
            let HTMLForDescriptionElement = `<p class="payment__description-subtitle">${tempDescription.match(/^([\s\S]+?):/)[1] + ':'}</p>`;
            tempDescription = tempDescription.slice(tempDescription.match(/^([\s\S]+?):/)[1].length + 1);
            HTMLForDescriptionElement += `<p class="payment__description-value">${tempDescription.match(/^([\s\S]+?),/)[1] + ','}</p>`;
            tempDescription = tempDescription.slice(tempDescription.match(/^([\s\S]+?),/)[1].length + 1);
            descriptionElement.innerHTML = HTMLForDescriptionElement;
            $productDescription.append(descriptionElement);
        }
    }
}

// Check validation of getting data
function stringIsValid(str) {
    if (str.includes(':') && str.includes(',') && (str.indexOf(':') < str.indexOf(','))) {
        while (str.length) {
            str = str.slice(str.match(/^([\s\S]+?):/)[1].length + 1);
            if (str.indexOf(':') != -1) {
                if (str.indexOf(':') < str.indexOf(',') || !str.includes(',')) return false;
            }
            while (str.indexOf(':') > str.indexOf(',') || (!str.includes(':') && str.includes(','))) str = str.slice(str.match(/^([\s\S]+?),/)[1].length + 1);
        }
        return true;
    }
    return false;
}

// NAVIGATION ON PAGE

const $accountSubtitles = $body.querySelectorAll('.account__subtitle');
const $accountSubtitleOrders = $body.querySelector('.account__subtitle-orders');
const $accountSubtitleSettings = $body.querySelector('.account__subtitle-settings');
const $accountSubtitleSetPass = $body.querySelector('.account__subtitle-set-pass');
//? $accountOrders
const $accountSettings = $body.querySelector('.account__settings');
const $accountSetPass = $body.querySelector('.account__set-pass');

// Show selected subpage after load
if ($accountSubtitleOrders.classList.contains('_selected')) {
    $accountOrders.style.display = 'block';
    $accountSettings.style.display = 'none';
    $accountSetPass.style.display = 'none';
} else if ($accountSubtitleSettings.classList.contains('_selected')) {
    $accountOrders.style.display = 'none';
    $accountSettings.style.display = 'block';
    $accountSetPass.style.display = 'none';
} else if ($accountSubtitleSetPass.classList.contains('_selected')) {
    $accountOrders.style.display = 'none';
    $accountSettings.style.display = 'none';
    $accountSetPass.style.display = 'block';
}

// Hide user settings, if user isn't logged in 
if (localStorage.getItem('isLoggedIn') === 'false') {
    $accountSubtitleSettings.style.display = 'none';
    $accountSubtitleSetPass.style.display = 'none';
    $accountSettings.style.display = 'none';
    $accountSetPass.style.display = 'none';
}

// Set hight for set-pass-container
//? $accountSetPass
const $setPassForm = $accountSetPass.querySelector('.account__set-pass-form');
const $setPassFormCode = $accountSetPass.querySelector('.account__set-pass-form-code');

if ($setPassForm.clientHeight < $setPassFormCode.clientHeight) {
    $accountSetPass.style.height = `${$setPassFormCode.clientHeight + 40}px`;
} else {
    $accountSetPass.style.height = `${$setPassForm.clientHeight + 40}px`;
}

// Change selected subpage
$accountSubtitles.forEach($elem => {
    $elem.addEventListener('click', () => {
        if (!$elem.classList.contains('_selected')) {
            $accountSubtitles.forEach($item => {
                if ($item.classList.contains('_selected')) {
                    $item.classList.remove('_selected');
                }
            });

            $elem.classList.add('_selected');

            // Show selected subpage
            if ($accountSubtitleOrders.classList.contains('_selected')) {
                $accountOrders.style.display = 'block';
                $accountSettings.style.display = 'none';
                $accountSetPass.style.display = 'none';
            } else if ($accountSubtitleSettings.classList.contains('_selected')) {
                $accountOrders.style.display = 'none';
                $accountSettings.style.display = 'block';
                $accountSetPass.style.display = 'none';
            } else if ($accountSubtitleSetPass.classList.contains('_selected')) {
                $accountOrders.style.display = 'none';
                $accountSettings.style.display = 'none';
                $accountSetPass.style.display = 'block';
            }

            
            // Set hight for set-pass-container
            if ($setPassForm.clientHeight < $setPassFormCode.clientHeight) {
                $accountSetPass.style.height = `${$setPassFormCode.clientHeight + 40}px`;
            } else {
                $accountSetPass.style.height = `${$setPassForm.clientHeight + 40}px`;
            }
        }
    });
});

// Getting info about user 
let currentEmail;
if (localStorage.getItem('isLoggedIn') === 'true') {
    fetch(`${HOST}/api/get_user_info`, {
        method: 'GET', 
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(async (res) => {
        const status = res.status;
        const data = await res.json();

        if (status !== 200) {
            try {
                $body.querySelectorAll('.account__setting-error').forEach($errorMessage => {
                    $errorMessage.textContent = (currentLanguage === 'en') ? data.en : data.ru;
                });
            } catch (error) {
                console.error('Error: ' + error);
            }
        } else {
            $body.querySelector('.account__setting-input-nickname').value = data.nickname;
            $body.querySelector('.account__setting-input-email').value = data.email;
            $body.querySelector('.account__setting-input-tlg').value = data.tlg;
            currentEmail = data.email;
        }
    })
    .catch((error) => {
        $body.querySelectorAll('.account__setting-error').forEach($errorMessage => {
            $errorMessage.textContent = (currentLanguage === 'en') ? 'Unexpected error' : 'Непредвиденная ошибка';
        });
        console.error('Fetch error: ' + error);
    });
}

// Display user parameters
$body.querySelectorAll('.account__form').forEach($form => {
    changeUserParameter($form);
});

// Change user parameter function
const $backEmailBtn = $accountSettings.querySelector('.account__setting-email-back');

// 1: Send email
// 2: Confirm old Email
// 3: Confirm new Email
let setEmailStatus = 1;
function changeUserParameter($form) {
    const $input = $form.querySelector('.account__setting-input');
    const $setBtn = $form.querySelector('.account__setting-set');
    const $submitBtn = $form.querySelector('.account__setting-submit');
    const $errorMessage = $form.querySelector('.account__setting-error');
    
    $setBtn.addEventListener('click', () => {
        $setBtn.style.display = 'none';
        $submitBtn.style.display = 'block';

        $input.removeAttribute('readonly');
        $input.value = '';
        $input.focus();
    });

    $input.addEventListener('focus', () => {
        if ($errorMessage.textContent) {
            $input.style.border = '';
            $errorMessage.textContent = '';
        }
    });
    $input.addEventListener('input', () => {
        if ($errorMessage.textContent) {
            $input.style.border = '';
            $errorMessage.textContent = '';
        }
    });

    let newEmail;

    if (localStorage.getItem('isLoggedIn') === 'true') {
        $form.addEventListener('submit', (event) => {
            event.preventDefault();

            // Change nickname
            if ($input.classList.contains('account__setting-input-nickname')) {
                if (!(/^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/.test($input.value))) {
                    $input.style.border = '2px solid red';
                    $errorMessage.textContent = (currentLanguage === 'en') ? 'Incorrect nickname' : 'Неккоректный никнейм';
                } else {
                    $submitBtn.setAttribute('disabled', 'true');

                    fetch(`${HOST}/api/change_user_nickname`, {
                        method: 'POST', 
                        credentials: 'include',
                        body: JSON.stringify({
                            newNickname: $input.value,
                        }),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    .then(async (res) => {
                        $submitBtn.removeAttribute('disabled');

                        const status = res.status;
                        const data = await res.json();
            
                        if (status !== 200) {
                            try {
                                $errorMessage.textContent = (currentLanguage === 'en') ? data.en : data.ru;
                            } catch (error) {
                                console.error('Error: ' + error);
                            }
                        } else {
                            $input.setAttribute('readonly', 'true');
                            $errorMessage.style.color = '#33CC66';
                            $errorMessage.textContent = (currentLanguage === 'en') ? 'Success!' : 'Успешно!';
                            $errorMessage.style.fontSize = '12px';
                            setTimeout(() => {
                                $errorMessage.style.color = 'red';
                                $errorMessage.textContent = '';
                                $errorMessage.style.fontSize = '10px';
                            }, 2000);

                            $setBtn.style.display = 'block';
                            $submitBtn.style.display = 'none';
                        }
                    })
                    .catch((error) => {
                        $submitBtn.removeAttribute('disabled');

                        $errorMessage.textContent = (currentLanguage === 'en') ? 'Unexpected error' : 'Непредвиденная ошибка';    
                        console.error('Fetch error: ' + error);
                    });
                }
            // Change telegram
            } else if ($input.classList.contains('account__setting-input-tlg')) {
                if (!(/^[@]{1}[^а-яё]+$/.test($input.value))) {
                    $input.style.border = '2px solid red';
                    $errorMessage.textContent = (currentLanguage === 'en') ? 'Incorrect telegram' : 'Неккоректный телеграмм';
                } else {
                    $submitBtn.setAttribute('disabled', 'true');

                    fetch(`${HOST}/api/change_user_telegram`, {
                        method: 'POST', 
                        credentials: 'include',
                        body: JSON.stringify({
                            newTlg: $input.value,
                        }),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    .then(async (res) => {
                        $submitBtn.removeAttribute('disabled');

                        const status = res.status;
                        const data = await res.json();
            
                        if (status !== 200) {
                            try {
                                $errorMessage.textContent = (currentLanguage === 'en') ? data.en : data.ru;
                            } catch (error) {
                                console.error('Error: ' + error);
                            }
                        } else {
                            $input.setAttribute('readonly', 'true');
                            $errorMessage.style.color = '#33CC66';
                            $errorMessage.textContent = (currentLanguage === 'en') ? 'Success!' : 'Успешно!';
                            $errorMessage.style.fontSize = '12px';
                            setTimeout(() => {
                                $errorMessage.style.color = 'red';
                                $errorMessage.textContent = '';
                                $errorMessage.style.fontSize = '10px';
                            }, 2000);

                            $setBtn.style.display = 'block';
                            $submitBtn.style.display = 'none';
                        }
                    })
                    .catch((error) => {
                        $submitBtn.removeAttribute('disabled');

                        $errorMessage.textContent = (currentLanguage === 'en') ? 'Unexpected error' : 'Непредвиденная ошибка';    
                        console.error('Fetch error: ' + error);
                    });
                }
            // Change email
            } else if ($input.classList.contains('account__setting-input-email')) {
                // Input new email
                if (setEmailStatus === 1) {
                    if (!(/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu.test($input.value))) {
                        $input.style.border = '2px solid red';
                        $errorMessage.textContent = (currentLanguage === 'en') ? 'Incorrect email' : 'Неккоректный эл. почта';
                    } else {
                        $submitBtn.setAttribute('disabled', 'true');

                        fetch(`${HOST}/api/send_code_for_change_email`, {
                            method: 'POST', 
                            credentials: 'include',
                            body: JSON.stringify({
                                newEmail: $input.value,
                            }),
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                        .then(async (res) => {
                            $submitBtn.removeAttribute('disabled');

                            const status = res.status;
                            const data = await res.json();
                
                            if (status !== 200) {
                                try {
                                    $errorMessage.style.color = 'red';
                                    $errorMessage.textContent = (currentLanguage === 'en') ? data.en : data.ru;
                                } catch (error) {
                                    console.error('Error: ' + error);
                                }
                            } else {
                                $errorMessage.style.color = '#33CC66';
                                $errorMessage.textContent = (currentLanguage === 'en') ? `Enter the code from ${currentEmail}` : `Введите код из ${currentEmail}`;;
                                $errorMessage.style.fontSize = '14px';
                                newEmail = $input.value;
                                $input.value = '';
                                $input.setAttribute('placeholder', 'CODE');
                                setEmailStatus = 2;
                                $backEmailBtn.classList.remove('_hidden');
                            }
                        })
                        .catch((error) => {
                            $submitBtn.removeAttribute('disabled');

                            $errorMessage.style.color = 'red';
                            $errorMessage.textContent = (currentLanguage === 'en') ? 'Unexpected error' : 'Непредвиденная ошибка';    
                            console.error('Fetch error: ' + error);
                        });
                    }
                // Comfirm old email
                } else if (setEmailStatus === 2) {
                    $errorMessage.style.color = 'red';
                    if (!(/^[0-9]{6}$/.test($input.value))) {
                        $input.style.border = '2px solid red';
                        $errorMessage.textContent = (currentLanguage === 'en') ? 'Incorrect code' : 'Неккоректный код';
                    } else {
                        $submitBtn.setAttribute('disabled', 'true');

                        fetch(`${HOST}/api/change_user_email`, {
                            method: 'POST', 
                            credentials: 'include',
                            body: JSON.stringify({
                                // false: confirm old email
                                // true: confirm new email and set email
                                status: false,
                                code: $input.value,
                                oldEmail: currentEmail,
                                newEmail
                            }),
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                        .then(async (res) => {
                            $submitBtn.removeAttribute('disabled');

                            const status = res.status;
                            const data = await res.json();
                
                            if (status !== 200) {
                                try {
                                    $errorMessage.style.color = 'red';
                                    $errorMessage.textContent = (currentLanguage === 'en') ? data.en : data.ru;
                                } catch (error) {
                                    console.error('Error: ' + error);
                                }
                            } else {
                                $errorMessage.style.color = '#33CC66';
                                $errorMessage.textContent = (currentLanguage === 'en') ? `Enter the code from ${newEmail}` : `Введите код из ${newEmail}`;;
                                $errorMessage.style.fontSize = '14px';
                                $input.value = '';
                                setEmailStatus = 3;
                            }
                        })
                        .catch((error) => {
                            $submitBtn.removeAttribute('disabled');
                            
                            $errorMessage.style.color = 'red';
                            $errorMessage.textContent = (currentLanguage === 'en') ? 'Unexpected error' : 'Непредвиденная ошибка';    
                            console.error('Fetch error: ' + error);
                        });
                    }
                // Comfirm new email
                } else if (setEmailStatus === 3) {
                    $submitBtn.setAttribute('disabled', 'true');

                    fetch(`${HOST}/api/change_user_email`, {
                        method: 'POST', 
                        credentials: 'include',
                        body: JSON.stringify({
                            // false: confirm old email
                            // true: confirm new email and set email
                            status: true,
                            code: $input.value,
                            oldEmail: currentEmail,
                            newEmail
                        }),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    .then(async (res) => {
                        $submitBtn.removeAttribute('disabled');

                        const status = res.status;
                        const data = await res.json();
            
                        if (status !== 200) {
                            try {
                                $errorMessage.style.color = 'red';
                                $errorMessage.textContent = (currentLanguage === 'en') ? data.en : data.ru;
                            } catch (error) {
                                console.error('Error: ' + error);
                            }
                        } else {
                            $input.setAttribute('readonly', 'true');
                            $errorMessage.style.color = '#33CC66';
                            $errorMessage.textContent = (currentLanguage === 'en') ? 'Success!' : 'Успешно!';
                            $errorMessage.style.fontSize = '14px';
                            setTimeout(() => {
                                $errorMessage.style.color = 'red';
                                $errorMessage.textContent = '';
                                $errorMessage.style.fontSize = '10px';
                            }, 2000);
                            
                            $input.setAttribute('placeholder', '');
                            $input.value = newEmail;

                            $setBtn.style.display = 'block';
                            $submitBtn.style.display = 'none';

                            setEmailStatus = 1;
                            $backEmailBtn.classList.add('_hidden');
                        }
                    })
                    .catch((error) => {
                        $submitBtn.removeAttribute('disabled');
                        
                        $errorMessage.style.color = 'red';
                        $errorMessage.textContent = (currentLanguage === 'en') ? 'Unexpected error' : 'Непредвиденная ошибка';    
                        console.error('Fetch error: ' + error);
                    });   
                }
                
            }
        });
    }
}

// Activate email-back-button

const $setEmailInput = $accountSettings.querySelector('.account__setting-input-email');
const $setEmailBtn = $accountSettings.querySelector('.account__setting-set-email');
const $submitEmailBtn = $accountSettings.querySelector('.account__setting-submit-email');
const $setEmailErrorMessage = $accountSettings.querySelector('.account__setting-error-email');

$backEmailBtn.addEventListener('click', () => {
    $setEmailInput.setAttribute('readonly', 'true');
    $setEmailInput.setAttribute('placeholder', '');
    $setEmailInput.value = currentEmail;
    $setEmailErrorMessage.style.color = 'red';
    $setEmailErrorMessage.textContent = '';
    $setEmailErrorMessage.style.fontSize = '10px';
    $setEmailBtn.style.display = 'block';
    $submitEmailBtn.style.display = 'none';
    setEmailStatus = 1;
    $backEmailBtn.classList.add('_hidden');
});

// SET-PASS

const $currentPass = $setPassForm.querySelector('.account__set-pass-current-input');
const $newPass = $setPassForm.querySelector('.account__set-pass-new-input');
const $repeatPass = $setPassForm.querySelector('.account__set-pass-repeat-input');
const $setPassCurrentError = $setPassForm.querySelector('.account__set-pass-error-current');
const $setPassNewError = $setPassForm.querySelector('.account__set-pass-error-new');
console.log($backEmailBtn)

// Send pass by code

let newPass;
if (localStorage.getItem('isLoggedIn') === 'true') {
    $setPassForm.addEventListener('submit', (event) => {
        event.preventDefault();

        let isValid = true;

        if ($currentPass.value.length < 6) {
            $currentPass.style.border = '2px solid red';
            $setPassCurrentError.textContent = (currentLanguage === 'en') ? 'Password less than 6 characters' : 'Пароль меньше 6 символов';
            isValid = false;
        }

        if (!(/^(?=.*\d)(?=.*[a-zA-Z])(?!.*\s).*$/.test($currentPass.value))) {
            $currentPass.style.border = '2px solid red';
            $setPassCurrentError.textContent = (currentLanguage === 'en') ? 'Password must contain latin letters and numbers' : 'Пароль должен содержать латинские буквы и цифры';
            isValid = false;
        }

        if ($newPass.value !== $repeatPass.value) {
            $newPass.style.border = '2px solid red';
            $repeatPass.style.border = '2px solid red';
            $setPassNewError.textContent = (currentLanguage === 'en') ? 'Passwords do not match' : 'Пароли не совпадают';
            isValid = false;
        }
        
        if ($newPass.value.length < 6) {
            $newPass.style.border = '2px solid red';
            $setPassNewError.textContent = (currentLanguage === 'en') ? 'Password less than 6 characters' : 'Пароль меньше 6 символов';
            isValid = false;
        }

        if (!(/^(?=.*\d)(?=.*[a-zA-Z])(?!.*\s).*$/.test($newPass.value))) {
            $newPass.style.border = '2px solid red';
            $setPassNewError.textContent = (currentLanguage === 'en') ? 'Password must contain latin letters and numbers' : 'Пароль должен содержать латинские буквы и цифры';
            isValid = false;
        }

        if ($repeatPass.value.length < 6) {
            $repeatPass.style.border = '2px solid red';
            $setPassNewError.textContent = (currentLanguage === 'en') ? 'Password less than 6 characters' : 'Пароль меньше 6 символов';
            isValid = false;
        }

        if (!(/^(?=.*\d)(?=.*[a-zA-Z])(?!.*\s).*$/.test($repeatPass.value))) {
            $repeatPass.style.border = '2px solid red';
            $setPassNewError.textContent = (currentLanguage === 'en') ? 'Password must contain latin letters and numbers' : 'Пароль должен содержать латинские буквы и цифры';
            isValid = false;
        }

        if ($newPass.value === $currentPass.value) {
            $newPass.style.border = '2px solid red';
            $repeatPass.style.border = '2px solid red';
            $setPassNewError.textContent = (currentLanguage === 'en') ? 'Old and new passwords are match' : 'Старый и новый пароли совпадают';
            isValid = false;
        }

        if (isValid) {
            newPass = $repeatPass.value
            fetch(`${HOST}/api/send_code_for_set_pass`, {
                method: 'POST', 
                credentials: 'include',
                body: JSON.stringify({
                    currentPass: $currentPass.value,
                    newPass
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
                        $setPassNewError.textContent = (currentLanguage === 'en') ? data.en : data.ru;
                    } catch (error) {
                        console.error('Error: ' + error);
                    }
                } else {
                    $setPassForm.classList.add('_hidden');
                    $setPassFormCode.classList.remove('_hidden');

                    $currentPass.value = '';
                    $newPass.value = '';
                    $repeatPass.value = '';
                }
            })
            .catch((error) => {
                $setPassNewError.textContent = (currentLanguage === 'en') ? 'Unexpected error' : 'Непредвиденная ошибка';    
                console.error('Fetch error: ' + error);
            });
        }
    });
}

$currentPass.addEventListener('focus', () => {
    $currentPass.style.border = '';
    $setPassCurrentError.textContent = '';
}); 

$currentPass.addEventListener('input', () => {
    $currentPass.style.border = '';
    $setPassCurrentError.textContent = '';
}); 

[$newPass, $repeatPass].forEach($input => {
    $input.addEventListener('focus', () => {
        $newPass.style.border = '';
        $repeatPass.style.border = '';
        $setPassNewError.textContent = '';
    }); 
    
    $input.addEventListener('input', () => {
        $newPass.style.border = '';
        $repeatPass.style.border = '';
        $setPassNewError.textContent = '';
    }); 
});

// Actived back-button

const $setPassBackBtn = $setPassFormCode.querySelector('.account__set-pass-back');

$setPassBackBtn.addEventListener('click', () => {
    $setPassForm.classList.remove('_hidden');
    $setPassFormCode.classList.add('_hidden');
})

// Send code for set pass

const $setPassCodeInput = $setPassFormCode.querySelector('.account__set-pass-code-input');
const $setPassCodeError = $setPassFormCode.querySelector('.account__set-pass-error-code');

if (localStorage.getItem('isLoggedIn') === 'true') {
    $setPassFormCode.addEventListener('submit', (event) => {
        event.preventDefault();

        if (!(/^[0-9]{6}$/.test($setPassCodeInput.value))) {
            $setPassCodeInput.style.border = '2px solid red';
            $setPassCodeError.textContent = (currentLanguage === 'en') ? 'Incorrect email code' : 'Неверный код';
        } else {
            fetch(`${HOST}/api/set_user_password`, {
                method: 'POST', 
                credentials: 'include',
                body: JSON.stringify({
                    code: $setPassCodeInput.value, 
                    newPass
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
                        $setPassCodeError.textContent = (currentLanguage === 'en') ? data.en : data.ru;
                    } catch (error) {
                        console.error('Error: ' + error);
                    }
                } else {
                    $setPassCodeInput.value = '';
                    $setPassCodeError.textContent = (currentLanguage === 'en') ? 'Success!' : 'Успешно!';
                    $setPassCodeError.style.color = '#00FF66';
                    $setPassCodeError.style.fontSize = '14px';

                    setTimeout(() => {
                        $setPassForm.classList.remove('_hidden');
                        $setPassFormCode.classList.add('_hidden');

                        $setPassCodeError.textContent = '';
                        $setPassCodeError.style.color = 'red';
                        $setPassCodeError.style.fontSize = '10px';
                    }, 3000)
                }
            })
            .catch((error) => {
                $setPassNewError.textContent = (currentLanguage === 'en') ? 'Unexpected error' : 'Непредвиденная ошибка';    
                console.error('Fetch error: ' + error);
            });
        }
    });
}
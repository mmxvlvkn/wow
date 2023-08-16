const $accountOrders = $body.querySelector('.account__orders');

// Product display

window.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('isLoggedIn') === 'true') {
        // Main product display

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

                        let $productArticle = document.createElement('article');
                        $productArticle.className = "account__order order-item";
                        const $productDate = document.createElement('div');
                        $productDate.className = "order-item__option";
                        $productDate.innerHTML = `<p style="margin-bottom: 7px">${product.create_date}</p><p>${product.create_time}</p>`;
                        $productArticle.append($productDate);

                        const $productNumber = document.createElement('div');
                        $productNumber.className = "order-item__option";
                        $productNumber.innerHTML = '#' + product.order_number;
                        $productArticle.append($productNumber);

                        const $productTitle = document.createElement('div');
                        $productTitle.className = "order-item__option";
                        $productTitle.innerHTML = `<p class="en">${product.title_en}</p><p class="ru">${product.title_ru}</p>`;
                        $productArticle.append($productTitle);

                        const $productPrice = document.createElement('div');
                        $productPrice.className = "order-item__option";
                        product.price = Number(product.price)
                        if (product.current_language === 'ru') {
                            if (Number.isInteger(Number((product.price * usdRusCourse).toFixed(2)))) {
                                $productPrice.innerHTML = Math.round(product.price * usdRusCourse) + 'руб.';
                            } else {
                                $productPrice.innerHTML = (product.price * usdRusCourse).toFixed(2) + 'руб.';
                            }
                        } else {
                            if (Number.isInteger(Number((product.price).toFixed(2)))) {
                                $productPrice.innerHTML = Math.round(product.price) + '$';
                            } else {
                                $productPrice.innerHTML = (product.price).toFixed(2) + '$';
                            }
                        }
                        $productArticle.append($productPrice);

                        const $productDescription = document.createElement('div');
                        $productDescription.className = "order-item__option";
                        let tempDescription = product.order_description.match(/radio:([\s\S]+?)range:/)[1];
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

                        tempDescription = product.order_description.match(/range:([\s\S]+?)checkbox:/)[1];
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
                        $productArticle.append($productDescription);

                        const $productUserInfo = document.createElement('div');
                        $productUserInfo.className = "order-item__option";
                        const $productStatus = document.createElement('div');
                        let $userInfoElement = document.createElement('div');
                        $userInfoElement.className = 'payment__description-object';
                        $userInfoElement.style.marginBottom = '10px'
                        let HTMLForuserInfoElement = `<p class="payment__description-subtitle">${'Status' + ':'}</p>`;
                        HTMLForuserInfoElement += `<p class="payment__description-value">${product.product_status}</p>`;
                        $userInfoElement.innerHTML = HTMLForuserInfoElement;
                        $productStatus.append($userInfoElement);
                        $productUserInfo.append($productStatus);
                        const $productUserNick = document.createElement('div');
                        $userInfoElement = document.createElement('div');
                        $userInfoElement.className = 'payment__description-object';
                        HTMLForuserInfoElement = `<p class="payment__description-subtitle">${'Nickname' + ':'}</p>`;
                        HTMLForuserInfoElement += `<p class="payment__description-value">${product.nickname + ','}</p>`;
                        $userInfoElement.innerHTML = HTMLForuserInfoElement;
                        $productUserNick.append($userInfoElement);
                        $productUserInfo.append($productUserNick);
                        const $productUserEmail = document.createElement('div');
                        $userInfoElement = document.createElement('div');
                        $userInfoElement.className = 'payment__description-object';
                        HTMLForuserInfoElement = `<p class="payment__description-subtitle">${'Email' + ':'}</p>`;
                        HTMLForuserInfoElement += `<p class="payment__description-value">${product.email + ','}</p>`;
                        $userInfoElement.innerHTML = HTMLForuserInfoElement;
                        $productUserEmail.append($userInfoElement);
                        $productUserInfo.append($productUserEmail);
                        const $productUserTlg = document.createElement('div');
                        $userInfoElement = document.createElement('div');
                        $userInfoElement.className = 'payment__description-object';
                        HTMLForuserInfoElement = `<p class="payment__description-subtitle">${'Telegram' + ':'}</p>`;
                        HTMLForuserInfoElement += `<p class="payment__description-value">${product.tlg + ','}</p>`;
                        $userInfoElement.innerHTML = HTMLForuserInfoElement;
                        $productUserTlg.append($userInfoElement);
                        $productUserInfo.append($productUserTlg);
                        $productArticle.append($productUserInfo);


                        $accountOrders.prepend($productArticle);
                        languageChanges();
                    });
                } else {
                    const $innerInfo = document.createElement('span');
                    $innerInfo.innerHTML = (currentLanguage === 'en') ? 'No orders' : 'Заказы отсутствуют';
                    $innerInfo.style.display = 'block';
                    $innerInfo.style.marginBottom = '10px';
                    $accountOrders.append($innerInfo);
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

                        console.log(data)
                        const $subtitle = document.createElement('h2');
                        $subtitle.className = "account__subtitle account__personal-services-subtitle";
                        let $subtitleSpan = document.createElement('span');
                        if (localStorage.getItem('currentLanguage') === 'en') {
                            $subtitleSpan.className = "en _shown";
                        } else {
                            $subtitleSpan.className = "en _hidden";
                        }
                        $subtitleSpan.innerHTML = 'Personal services';
                        $subtitle.append($subtitleSpan);
                        $subtitleSpan = document.createElement('span');
                        if (localStorage.getItem('currentLanguage') === 'en') {
                            $subtitleSpan.className = "ru _hidden";
                        } else {
                            $subtitleSpan.className = "ru _shown";
                        }
                        $subtitleSpan.innerHTML = 'Персональные услуги';
                        $subtitle.append($subtitleSpan);
                        $accountOrders.append($subtitle);

                        data.forEach(product => {
                            let $productArticle = document.createElement('article');
                            $productArticle.className = "account__order order-item";
                            const $productDate = document.createElement('div');
                            $productDate.className = "order-item__option";
                            $productDate.innerHTML = `<p style="margin-bottom: 7px">${product.create_date}</p><p>${product.create_time}</p>`;
                            $productArticle.append($productDate);
    
                            const $productNumber = document.createElement('div');
                            $productNumber.className = "order-item__option";
                            $productNumber.innerHTML = '#' + product.order_number;
                            $productArticle.append($productNumber);
    
                            const $productTitle = document.createElement('div');
                            $productTitle.className = "order-item__option";
                            $productTitle.innerHTML = `<p class="ru">${'Персональная услуга'}</p><p class="en">${'Personal service'}</p>`;
                            $productArticle.append($productTitle);
    
                            const $productDescription = document.createElement('div');
                            $productDescription.className = "order-item__option";
                            $productDescription.innerHTML = (product.current_language === 'en') ? product.price + "$" : product.price + "руб.";
                            $productArticle.append($productDescription);

                            const $productPrice = document.createElement('div');
                            $productPrice.className = "order-item__option";
                            $productPrice.innerHTML = product.order_description;
                            $productArticle.append($productPrice);
    
                            const $productUserInfo = document.createElement('div');
                            $productUserInfo.className = "order-item__option";
                            const $productStatus = document.createElement('div');
                            let $userInfoElement = document.createElement('div');
                            $userInfoElement.className = 'payment__description-object';
                            $userInfoElement.style.marginBottom = '10px'
                            let HTMLForuserInfoElement = `<p class="payment__description-subtitle">${'Status' + ':'}</p>`;
                            HTMLForuserInfoElement += `<p class="payment__description-value">${product.product_status}</p>`;
                            $userInfoElement.innerHTML = HTMLForuserInfoElement;
                            $productStatus.append($userInfoElement);
                            $productUserInfo.append($productStatus);
                            const $productUserNick = document.createElement('div');
                            $userInfoElement = document.createElement('div');
                            $userInfoElement.className = 'payment__description-object';
                            HTMLForuserInfoElement = `<p class="payment__description-subtitle">${'Nickname' + ':'}</p>`;
                            HTMLForuserInfoElement += `<p class="payment__description-value">${product.nickname + ','}</p>`;
                            $userInfoElement.innerHTML = HTMLForuserInfoElement;
                            $productUserNick.append($userInfoElement);
                            $productUserInfo.append($productUserNick);
                            const $productUserEmail = document.createElement('div');
                            $userInfoElement = document.createElement('div');
                            $userInfoElement.className = 'payment__description-object';
                            HTMLForuserInfoElement = `<p class="payment__description-subtitle">${'Email' + ':'}</p>`;
                            HTMLForuserInfoElement += `<p class="payment__description-value">${product.email + ','}</p>`;
                            $userInfoElement.innerHTML = HTMLForuserInfoElement;
                            $productUserEmail.append($userInfoElement);
                            $productUserInfo.append($productUserEmail);
                            const $productUserTlg = document.createElement('div');
                            $userInfoElement = document.createElement('div');
                            $userInfoElement.className = 'payment__description-object';
                            HTMLForuserInfoElement = `<p class="payment__description-subtitle">${'Telegram' + ':'}</p>`;
                            HTMLForuserInfoElement += `<p class="payment__description-value">${product.tlg + ','}</p>`;
                            $userInfoElement.innerHTML = HTMLForuserInfoElement;
                            $productUserTlg.append($userInfoElement);
                            $productUserInfo.append($productUserTlg);
                            $productArticle.append($productUserInfo);
    
                            //!
                            $accountOrders.append($productArticle);
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
        const $innerInfo = document.createElement('span');
        $innerInfo.innerHTML = (currentLanguage === 'en') ? 'No orders' : 'Заказы отсутствуют';
        $innerInfo.style.display = 'block';
        $innerInfo.style.marginBottom = '10px';
        $accountOrders.append($innerInfo);
    }
});

// Check validation of data

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

// Navigation on page

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
    
    console.log($errorMessage)

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
    $form.addEventListener('submit', (event) => {
        event.preventDefault();

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
        } else if ($input.classList.contains('account__setting-input-email')) {
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

// Activate set email - back button

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

// Send code for set password

let newPass;
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

// Actived back button

const $setPassBackBtn = $setPassFormCode.querySelector('.account__set-pass-back');

$setPassBackBtn.addEventListener('click', () => {
    $setPassForm.classList.remove('_hidden');
    $setPassFormCode.classList.add('_hidden');
})

// Send code

const $setPassCodeInput = $setPassFormCode.querySelector('.account__set-pass-code-input');
const $setPassCodeError = $setPassFormCode.querySelector('.account__set-pass-error-code');

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
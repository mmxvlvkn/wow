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
                        $productDate.innerHTML = product.create_date;
                        $productArticle.append($productDate);

                        const $productNumber = document.createElement('div');
                        $productNumber.className = "order-item__option";
                        $productNumber.innerHTML = '#' + product.order_number;
                        $productArticle.append($productNumber);

                        const $productTitle = document.createElement('div');
                        $productTitle.className = "order-item__option";
                        $productTitle.innerHTML = product.title;
                        $productArticle.append($productTitle);

                        const $productPrice = document.createElement('div');
                        $productPrice.className = "order-item__option";
                        $productPrice.innerHTML = product.price + '$';
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
                        const $productUserNick = document.createElement('div');
                        let $userInfoElement = document.createElement('div');
                        $userInfoElement.className = 'payment__description-object';
                        let HTMLForuserInfoElement = `<p class="payment__description-subtitle">${'Nickname' + ':'}</p>`;
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


                        $accountOrders.append($productArticle);
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
                            console.log(product)
                            let $productArticle = document.createElement('article');
                            $productArticle.className = "account__order order-item";
                            const $productDate = document.createElement('div');
                            $productDate.className = "order-item__option";
                            $productDate.innerHTML = product.create_date;
                            $productArticle.append($productDate);
    
                            const $productNumber = document.createElement('div');
                            $productNumber.className = "order-item__option";
                            $productNumber.innerHTML = '#' + product.order_number;
                            $productArticle.append($productNumber);
    
                            const $productTitle = document.createElement('div');
                            $productTitle.className = "order-item__option";
                            $productTitle.innerHTML = product.title;
                            $productArticle.append($productTitle);
    
                            const $productDescription = document.createElement('div');
                            $productDescription.className = "order-item__option";
                            $productDescription.innerHTML = product.order_description;
                            $productArticle.append($productDescription);

                            const $productPrice = document.createElement('div');
                            $productPrice.className = "order-item__option";
                            $productPrice.innerHTML = product.price;
                            $productArticle.append($productPrice);
    
                            const $productUserInfo = document.createElement('div');
                            $productUserInfo.className = "order-item__option";
                            const $productUserNick = document.createElement('div');
                            let $userInfoElement = document.createElement('div');
                            $userInfoElement.className = 'payment__description-object';
                            let HTMLForuserInfoElement = `<p class="payment__description-subtitle">${'Nickname' + ':'}</p>`;
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
    
    
                            $accountOrders.append($productArticle);
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

// Change user parameters
$body.querySelectorAll('.account__form').forEach($form => {
    changeUserParameter($form);
});

// Change user parameter function
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

    let needSendEmailCode = true;
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
            if (needSendEmailCode) {
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
                            needSendEmailCode = false;
                        }
                    })
                    .catch((error) => {
                        $submitBtn.removeAttribute('disabled');

                        $errorMessage.textContent = (currentLanguage === 'en') ? 'Unexpected error' : 'Непредвиденная ошибка';    
                        console.error('Fetch error: ' + error);
                    });
                }
            } else {
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
                            code: $input.value,
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
                            $input.setAttribute('placeholder', '');
                            $input.value = newEmail

                            $setBtn.style.display = 'block';
                            $submitBtn.style.display = 'none';

                            needSendEmailCode = true;
                        }
                    })
                    .catch((error) => {
                        $submitBtn.removeAttribute('disabled');
                        
                        $errorMessage.textContent = (currentLanguage === 'en') ? 'Unexpected error' : 'Непредвиденная ошибка';    
                        console.error('Fetch error: ' + error);
                    });
                }
            }
            
        }
    });
}
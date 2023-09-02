const $adminOrders = $body.querySelector('.admin__orders');
const $paymentError = $body.querySelector('.payment-error');

// Products display
window.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('isLoggedIn') === 'true') {
        // Main products display
        fetch(`${HOST}/api/get_all_products`, {
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
                    $adminOrders.innerHTML = (currentLanguage === 'en') ? 'Error' : 'Ошибка';
                } catch (error) {
                    console.error('Error: ' + error);
                }
            } else {
                if (data.length) {
                    const sortData = mergeSort(data);
                    sortData.forEach(product => {
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

                        // Display admin-panel for product
                        let $productMenu = document.createElement('div');
                        $productMenu.classList.add('order-item__admin');
                        $productMenu.innerHTML = (
                            `
                            <div class="order-item__admin-status-container">
                                <form class="order-item__admin-status-form order-item__admin-product-status-form">
                                    <div class="en">
                                        <select disabled class="order-item__admin-status-select">
                                            <option value="0">Canceled</option>
                                            <option value="1">Paid</option>
                                            <option value="2">Performed</option>
                                            <option value="3">Completed</option>
                                        </select>
                                    </div>
                                    <div class="ru">
                                        <select disabled class="order-item__admin-status-select">
                                            <option value="0">Отменен</option>
                                            <option value="1">Оплачен</option>
                                            <option value="2">Выполняется</option>
                                            <option value="3"n>Выполнен</option>
                                        </select>
                                    </div>
                                    <button type="button" class="order-item__admin-status-btn"><span class="en">Set</span><span class="ru">Изменить</span></button>
                                    <button type="submit" class="order-item__admin-status-submit"><span class="en">Send</span><span class="ru">Отправить</span></button>
                                </form>
                            </div>
                            <button type="click" class="order-item__admin-delete"><span class="en">Delete</span><span class="ru">Удалить</span></button>
                            `.replaceAll(
                                `value="${String(product.product_status_number)}"`, 
                                `selected value="${String(product.product_status_number)}"`
                            )
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
                        $productArticle.append($productMenu);
                        $adminOrders.prepend($productArticle);
                        languageChanges();
                    });

                    // Product title formation
                    let $productTitle = document.createElement('article');
                    $productTitle.className = "order-title";
                    $productTitle.innerHTML = `
                        <div class="order-title__option"><span class="en">Date and time</span><span class="ru">Дата и время</span></div>
                        <div class="order-title__option"><span class="en">Order number</span><span class="ru">Номер заказа</span></div>
                        <div class="order-title__option"><span class="en">Product name</span><span class="ru">Наименование продукта</span></div>
                        <div class="order-title__option"><span class="en">Price</span><span class="ru">Цена</span></div>
                        <div class="order-title__option"><span class="en">Product description</span><span class="ru">Описание продукта</span></div>
                        <div class="order-title__option"><span class="en">User data</span><span class="ru">Данные пользователя</span></div>
                    `;
                    $adminOrders.prepend($productTitle);
                    languageChanges();
                } else {
                    if (localStorage.getItem('isLoggedIn') === 'true') {
                        const $innerInfo = document.createElement('span');
                        $innerInfo.innerHTML = `<span class='en'>No orders</span><span class='ru'>Заказы отсутствуют</span>`;
                        $innerInfo.style.display = 'block';
                        $innerInfo.style.marginBottom = '10px';
                        $adminOrders.append($innerInfo);
                        languageChanges();
                    } else {
                        const $innerInfo = document.createElement('span');
                        $innerInfo.innerHTML = `<span class='en'>You are not logged in</span><span class='ru'>Вы не вошли в аккаунт</span>`;
                        $innerInfo.style.display = 'block';
                        $innerInfo.style.marginBottom = '10px';
                        $adminOrders.append($innerInfo);
                        languageChanges();
                    }
                }
            }
        })
        .then(() => {
            // PRODUCT ADMIN PANEL

            // Active functionallity of set a status product
            $body.querySelectorAll('.order-item__admin-product-status-form .order-item__admin-status-btn').forEach($btn => {
                $btn.addEventListener('click', () => {
                    const $allElementsInForm = $btn.parentElement.children;
                    $allElementsInForm[0].children[0].removeAttribute('disabled');
                    $allElementsInForm[1].children[0].removeAttribute('disabled');
                    $allElementsInForm[2].classList.add('_hidden');
                    $allElementsInForm[3].classList.add('_shown');
                });
            });

            // Set product
            $body.querySelectorAll('.order-item__admin-product-status-form').forEach($form => {
                $form.addEventListener('submit', event => {
                    event.preventDefault();

                    if (localStorage.getItem('isLoggedIn') === 'true') {
                        fetch(`${HOST}/api/set_product`, {
                            method: 'POST', 
                            credentials: 'include',
                            body: JSON.stringify({
                                productNumber: $form
                                    .parentElement
                                    .parentElement
                                    .parentElement
                                    .children[1]
                                    .textContent
                                    .replace('#', ''),
                                productStatus: (currentLanguage === 'en') 
                                    ? 
                                        $form
                                        .children[0]
                                        .children[0]
                                        .value
                                    :
                                        $form
                                        .children[1]
                                        .children[0]
                                        .value
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
                            } else {
                                location.reload();
                            }
                        })
                        .catch((error) => {
                            $paymentError.classList.add('_shown');
                            $body.classList.add('_lock');
                            console.error("Fetch error: " + error);
                        });
                    } else {
                        location.href = './'
                    }
                });
            });

            //Delete product
            $body.querySelectorAll('.order-item__admin-product-status-form').forEach($form => {
                $form.parentElement.nextElementSibling.addEventListener('click', () => {
                    if (localStorage.getItem('isLoggedIn') === 'true') {
                        fetch(`${HOST}/api/delete_product`, {
                            method: 'POST', 
                            credentials: 'include',
                            body: JSON.stringify({
                                productNumber: $form
                                    .parentElement
                                    .parentElement
                                    .parentElement
                                    .children[1]
                                    .textContent
                                    .replace('#', ''),
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
                            } else {
                                location.reload();
                            }
                        })
                        .catch((error) => {
                            $paymentError.classList.add('_shown');
                            $body.classList.add('_lock');
                            console.error("Fetch error: " + error);
                        });
                    } else {
                        location.href = './'
                    }
                });
            });
        })
        .then(() => {
            // Other products display
            fetch(`${HOST}/api/get_all_other_products`, {
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
                        const $subtitle = document.createElement('h2');
                        $subtitle.className = "account__subtitle account__subtitle-personal-services";
                        $subtitle.style.marginBottom = "2px";
                        $subtitle.innerHTML = `<span class='en'>Personal services</span><span class='ru'>Персональные услуги</span>`;
                        $adminOrders.append($subtitle);

                        // Product title formation
                        let $productTitle = document.createElement('article');
                        $productTitle.className = "order-title";
                        $productTitle.innerHTML = `
                            <div class="order-title__option"><span class="en">Date and time</span><span class="ru">Дата и время</span></div>
                            <div class="order-title__option"><span class="en">Order number</span><span class="ru">Номер заказа</span></div>
                            <div class="order-title__option"><span class="en">Product name</span><span class="ru">Наименование продукта</span></div>
                            <div class="order-title__option"><span class="en">Price</span><span class="ru">Цена</span></div>
                            <div class="order-title__option"><span class="en">Product description</span><span class="ru">Описание продукта</span></div>
                            <div class="order-title__option"><span class="en">User data</span><span class="ru">Данные пользователя</span></div>
                        `;
                        $adminOrders.append($productTitle);
                        languageChanges();

                        const sortData = mergeSort(data);
                        sortData.forEach(product => {
                            // Display admin-panel for product
                            let $productMenu = document.createElement('div');
                            $productMenu.classList.add('order-item__admin');
                            $productMenu.innerHTML = (
                                `
                                <div class="order-item__admin-status-container">
                                    <form class="order-item__admin-status-form order-item__admin-other-product-status-form">
                                        <div class="en">
                                            <select disabled class="order-item__admin-status-select">
                                                <option value="0">Canceled</option>
                                                <option value="1">Consid-tion</option>
                                                <option value="2">Paid</option>
                                                <option value="3">Performed</option>
                                                <option value="4">Completed</option>
                                            </select>
                                        </div>
                                        <div class="ru">
                                            <select disabled class="order-item__admin-status-select">
                                                <option value="0">Отменен</option>
                                                <option value="1">Рассмотр.</option>
                                                <option value="2">Оплачен</option>
                                                <option value="3">Выполняется</option>
                                                <option value="4"n>Выполнен</option>
                                            </select>
                                        </div>
                                        <button type="button" class="order-item__admin-status-btn"><span class="en">Set</span><span class="ru">Изменить</span></button>
                                        <button type="submit" class="order-item__admin-status-submit"><span class="en">Send</span><span class="ru">Отправить</span></button>
                                    </form>
                                </div>
                                <button type="click" class="order-item__admin-delete"><span class="en">Delete</span><span class="ru">Удалить</span></button>
                                `.replaceAll(
                                    `value="${String(product.product_status_number)}"`, 
                                    `selected value="${String(product.product_status_number)}"`
                                )
                            );

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
                            $productArticle.append($productMenu);
                            $productTitle.after($productArticle);
                            languageChanges();
                        });
                    }
                }
            })
            .then(() => {
                // OTHER PRODUCT ADMIN PANEL
    
                // Active functionallity of set a status product
                $body.querySelectorAll('.order-item__admin-other-product-status-form .order-item__admin-status-btn').forEach($btn => {
                    $btn.addEventListener('click', () => {
                        const $allElementsInForm = $btn.parentElement.children;
                        $allElementsInForm[0].children[0].removeAttribute('disabled');
                        $allElementsInForm[1].children[0].removeAttribute('disabled');
                        $allElementsInForm[2].classList.add('_hidden');
                        $allElementsInForm[3].classList.add('_shown');
                    });
                });
    
                // Set product
                $body.querySelectorAll('.order-item__admin-other-product-status-form').forEach($form => {
                    $form.addEventListener('submit', event => {
                        event.preventDefault();
    
                        if (localStorage.getItem('isLoggedIn') === 'true') {
                            fetch(`${HOST}/api/set_other_product`, {
                                method: 'POST', 
                                credentials: 'include',
                                body: JSON.stringify({
                                    productNumber: $form
                                        .parentElement
                                        .parentElement
                                        .parentElement
                                        .children[1]
                                        .textContent
                                        .replace('#', ''),
                                    productStatus: (currentLanguage === 'en') 
                                        ? 
                                            $form
                                            .children[0]
                                            .children[0]
                                            .value
                                        :
                                            $form
                                            .children[1]
                                            .children[0]
                                            .value
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
                                } else {
                                    location.reload();
                                }
                            })
                            .catch((error) => {
                                $paymentError.classList.add('_shown');
                                $body.classList.add('_lock');
                                console.error("Fetch error: " + error);
                            });
                        } else {
                            location.href = './'
                        }
                    });
                });

                //Delete product
                $body.querySelectorAll('.order-item__admin-other-product-status-form').forEach($form => {
                    $form.parentElement.nextElementSibling.addEventListener('click', () => {
                        if (localStorage.getItem('isLoggedIn') === 'true') {
                            fetch(`${HOST}/api/delete_other_product`, {
                                method: 'POST', 
                                credentials: 'include',
                                body: JSON.stringify({
                                    productNumber: $form
                                        .parentElement
                                        .parentElement
                                        .parentElement
                                        .children[1]
                                        .textContent
                                        .replace('#', ''),
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
                                } else {
                                    location.reload();
                                }
                            })
                            .catch((error) => {
                                $paymentError.classList.add('_shown');
                                $body.classList.add('_lock');
                                console.error("Fetch error: " + error);
                            });
                        } else {
                            location.href = './'
                        }
                    });
                });
            })
            .catch((error) => {
                $accountOrders.innerHTML = (currentLanguage === 'en') ? 'Error' : 'Ошибка';
                console.error('Fetch error: ' + error);
            });
        })
        .catch((error) => {
            $adminOrders.innerHTML = (currentLanguage === 'en') ? 'Error' : 'Ошибка';
            console.error('Fetch error: ' + error);
        });
    } else {
        if (localStorage.getItem('isLoggedIn') === 'true') {
            const $innerInfo = document.createElement('span');
            $innerInfo.innerHTML = `<span class='en'>No orders</span><span class='ru'>Заказы отсутствуют</span>`;
            $innerInfo.style.display = 'block';
            $innerInfo.style.marginBottom = '10px';
            $adminOrders.append($innerInfo);
            languageChanges();
        } else {
            const $innerInfo = document.createElement('span');
            $innerInfo.innerHTML = `<span class='en'>You are not logged in</span><span class='ru'>Вы не вошли в аккаунт</span>`;
            $innerInfo.style.display = 'block';
            $innerInfo.style.marginBottom = '10px';
            $adminOrders.append($innerInfo);
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
    if (str.includes(':') && str.includes(',') && str.indexOf(':') < str.indexOf(',')) {
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

// Hide error popup

window.addEventListener('click', (event) => {
    if ($paymentError.classList.contains('_shown')) {
        if (!event.target.closest('.payment-error__container') || event.target.classList.contains('payment-error__btn')) {
            $paymentError.classList.remove('_shown');
            $body.classList.remove('_lock');
        }
    }
});


function mergeSort(unsortedArray) {
    const midle_index = Math.floor(unsortedArray.length / 2)
    if(unsortedArray.length < 2){
      return unsortedArray
    }
   
    const leftArray = unsortedArray.splice(0, midle_index)
    return mergeArrays(mergeSort(leftArray),mergeSort(unsortedArray))
}

function mergeArrays(leftArray, rightArray) {
    let arr = []
    while (leftArray.length && rightArray.length) {
        if (!dateAndTimeComparison(leftArray[0], rightArray[0])) {
            arr.push(leftArray.shift())  
        } else {
            arr.push(rightArray.shift())
        }
    }
    return [ ...arr, ...leftArray, ...rightArray ]
}

// Left is greater than right
function dateAndTimeComparison(leftElenemt, rightElenemt) {
    const leftDate = leftElenemt.create_date.split('.').map(elem => Number(elem));
    const rightDate = rightElenemt.create_date.split('.').map(elem => Number(elem));
    const leftTime = leftElenemt.create_time.split(':').map(elem => Number(elem));
    const rightTime = rightElenemt.create_time.split(':').map(elem => Number(elem));

    if (leftDate[2] > rightDate[2]) {
        return true;
    } else if (leftDate[2] === rightDate[2]) {
        if (leftDate[1] > rightDate[1]) {
            return true;
        } else if (leftDate[1] === rightDate[1]) {
            if (leftDate[0] > rightDate[0]) {
                return true;
            } else if (leftDate[0] === rightDate[0]) {
                if (leftTime[0] > rightTime[0]) {
                    return true;
                } else if (leftTime[0] === rightTime[0]) {
                    if (leftTime[1] >= rightTime[1]) {
                        return true;
                    }  else {
                        return false;
                    }
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    } else {
        return false;
    }
}
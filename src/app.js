// // this is an example of improting data from JSON
// import 'orders' from '../data/orders.json';

import orders from '../data/orders.json';
import users from '../data/users.json';
import companies from '../data/companies.json';

export default (function () {
    var template = document.querySelector('#row_template').content;
    var tbody = document.querySelector('tbody');

    var renderRow = function (order) {
        var userInfo = getJSONData(order.user_id, users, 'id');
        var companyInfo = getJSONData(userInfo.company_id, companies, 'id');
        var row = template.cloneNode(true);
        var userDetails = row.querySelector('.user-details');
        var toggleLink = row.querySelector('.user_toggle-link');

        toggleLink.addEventListener('click', function (e) {
            e.preventDefault();
            userDetails.classList.toggle('user-details--hide');
        });

        row.querySelector('tr').id = 'order_' + order.id;
        row.querySelector('td:nth-child(1)').textContent = order.transaction_id;
        row.querySelector('td:nth-child(2) a').textContent = getFullName(userInfo);
        row.querySelector('td:nth-child(3)').textContent = getDate(order.created_at);
        row.querySelector('td:nth-child(4)').textContent = '$' + order.total;
        row.querySelector('td:nth-child(5)').textContent = hideCardNumber(order.card_number);
        row.querySelector('td:nth-child(6)').textContent = order.card_type;
        row.querySelector('td:nth-child(7)').textContent = order.order_country + ' ('+ order.order_ip + ')';
        renderDetails(row, userInfo, companyInfo);
        return row;
    }

    var renderRows = function (orders) {
        var fragment = document.createDocumentFragment();
        for (var i = 0; i < orders.length; i++) {
            fragment.appendChild(renderRow(orders[i]));
            tbody.appendChild(fragment);
        }   
    }

    var getDate = function (timestamp) {
        var date = new Date();
        date.setTime(timestamp * 1000);
        return date.getDate() +'/'+ (date.getMonth() + 1) + '/' + date.getFullYear() + ' ' + date.toLocaleTimeString('en-US', date.getHours);
    }

    var hideCardNumber = function (cardNumber) {
        cardNumber += '';
        var mas = [];
        for (var i = 0; i < cardNumber.length; i++) {
            mas[i] = cardNumber[i];
        }
        cardNumber = '' + mas[0] + mas[1];
        for (var i = 2; i < mas.length - 4; i++) {
            mas[i] = '*';
            cardNumber += mas[i];
        }
        cardNumber += mas[mas.length - 4] + mas[mas.length - 3] + mas[mas.length - 2] + mas[mas.length - 1];
        return cardNumber;
    }

    var getJSONData = function (user_id, dataObject, field) {
        if (user_id === null) {
            return null;
        }
        if (user_id <= dataObject.length / 2) {
            var i = 0;
            while (1) {
                if (user_id === dataObject[i][field]) { 
                    // console.log(dataObject[i][field] + ', ' + user_id);
                    return dataObject[i];
                }
                i++;
            }
        } else {
            var i = dataObject.length - 1;
            while (1) {
                if (user_id === dataObject[i][field]) { 
                    // console.log(dataObject[i][field] + ', ' + user_id);
                    return dataObject[i];
                }
                i--;
            }
        }
    }    

    var getFullName = function (userInfo) {
        var str = userInfo.gender === 'Male' ? 'Mr. ' : 'Ms. ';
        str += userInfo.first_name + ' ' + userInfo.last_name;
        return str;
    }

    var renderDetails = function (row, userInfo, companyInfo) {
        if (userInfo.birthday != null) {
            var date = new Date();
            date.setTime(userInfo.birthday * 1000);
            row.querySelector('.user_birthday').textContent = 'Birthday: ' + date.getDate() +'/'+ (date.getMonth() + 1) + '/' + date.getFullYear();
        } else {
            row.querySelector('.user_birthday').remove(); 
        }

        if (userInfo.avatar != null) {
            row.querySelector('.user_image img').src = userInfo.avatar;
        } else {
            row.querySelector('.user_image').remove();
        }

        if (companyInfo != null) {
            row.querySelector('.user_company a').href = companyInfo.url;
            row.querySelector('.user_company a').textContent = companyInfo.title;
            row.querySelector('.user_industry').textContent = 'Industry: ' + companyInfo.industry + ' / ' + companyInfo.sector;
        } else {
            row.querySelector('.user_company').remove();
            row.querySelector('.user_industry').remove();
        }
    }

    var clearTbody = function () {
        var allRows = tbody.querySelectorAll('tr');
        allRows.forEach(function (row) {
            tbody.removeChild(row);
        });
    }

    var addArrow = function (node) {
        var span = document.createElement('span');
        span.innerHTML = '&#8595;';
        node.appendChild(span);
    }

    var deleteArrow = function () {
        var aa = document.querySelectorAll('.sort');
        aa.forEach(function (row) {
            console.log(row);
            var bb = row.querySelector('span');
            console.log(bb);
            if (bb != null) {
                row.removeChild(bb);
            }
            // 
        });
    } 
    
    var sortStringElem = function (obj, prop) {
        var objCopy = obj.slice();
        objCopy.sort(function (left, right) {
            if (left[prop] > right[prop]) {
                return 1;
            } else if (left[prop] < right[prop]) {
                return -1;
            } else {
                return 0;
            }
        });
        clearTbody();
        return objCopy;
    }

    var sortElem = function (obj, prop) {
        var objCopy = obj.slice();
        objCopy.sort(function (left, right) {
            return left[prop] - right[prop];
        });
        clearTbody();
        return objCopy;
    }

    var sortForLocation = function (obj, prop1, prop2) {
        var objCopy = obj.slice();
        objCopy.sort(function (left, right) {
            if ((left[prop1] + left[prop2]) > (right[prop1] + left[prop2])) {
                return 1;
            } else if ((left[prop1] + left[prop2]) < (right[prop1] + left[prop2])) {
                return -1;
            } else {
                return 0;
            }
        });
        clearTbody();
        return objCopy;
    }

    renderRows(orders);

    var transactionSortLink = document.querySelector('.sort_by-transaction');
    var amountSortLink = document.querySelector('.sort_by-amount');
    var dateSortLink = document.querySelector('.sort_by-date');
    var cardSortLink = document.querySelector('.sort_by-card');
    var locationSortLink = document.querySelector('.sort_by-location');

    transactionSortLink.addEventListener('click', function (e) {
        e.preventDefault();
        deleteArrow();
        addArrow(transactionSortLink);
        renderRows(sortStringElem(orders, 'transaction_id'));
    })

    dateSortLink.addEventListener('click', function (e) {
        e.preventDefault();
        deleteArrow();
        addArrow(dateSortLink);
        renderRows(sortElem(orders, 'created_at'));
    })

    amountSortLink.addEventListener('click', function (e) {
        e.preventDefault();
        deleteArrow();
        addArrow(amountSortLink);
        // orderSortLink.innerHTML += '<span>&#8595;</span>';
        renderRows(sortElem(orders, 'total'));
    });

    cardSortLink.addEventListener('click', function (e) {
        e.preventDefault();
        deleteArrow();
        addArrow(cardSortLink);
        renderRows(sortStringElem(orders, 'card_type'));
    });

    cardSortLink.addEventListener('click', function (e) {
        e.preventDefault();
        deleteArrow();
        addArrow(cardSortLink);
        renderRows(sortStringElem(orders, 'card_type'));
    });

    locationSortLink.addEventListener('click', function (e) {
        e.preventDefault();
        deleteArrow();
        addArrow(locationSortLink);
        var sortedArr =  sortForLocation(orders, 'order_country', 'order_ip');
        renderRows(sortedArr);
    });
}());

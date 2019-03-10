// // this is an example of improting data from JSON
// import 'orders' from '../data/orders.json';

import orders from '../data/orders.json';
import users from '../data/users.json';

export default (function () {
    var template = document.querySelector('#row_template').content;
    var tbody = document.querySelector('tbody');
    console.log(tbody);

    var renderRow = function (order) {
        var row = template.cloneNode(true);
        row.querySelector('tr').id = 'order_' + order.id;
        row.querySelector('td:nth-child(1)').textContent = order.transaction_id;
        row.querySelector('td:nth-child(2) a').textContent = getFullName(order.user_id);
        row.querySelector('td:nth-child(3)').textContent = getDate(order.created_at);
        row.querySelector('td:nth-child(4)').textContent = '$' + order.total;
        row.querySelector('td:nth-child(5)').textContent = hideCardNumber(order.card_number);
        row.querySelector('td:nth-child(6)').textContent = order.card_type;
        row.querySelector('td:nth-child(7)').textContent = order.order_country + ' ('+ order.order_ip + ')';
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
        date.setTime(timestamp*1000);
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

    var getFullName = function (user_id) {
        if (user_id <= users.length / 2) {
            var i = 0;
            while (1) {
                if (user_id === users[i].id) { 
                    var str = users[i].gender === 'Male' ? 'Mr. ' : 'Ms. ';
                    str += users[i].first_name + ' ' + users[i].last_name;
                    return str;
                }
                i++;
            }
        } else {
            var i = users.length - 1;
            while (1) {
                if (user_id === users[i].id) { 
                    var str = users[i].gender === 'Male' ? 'Mr. ' : 'Ms. ';
                    str += users[i].first_name + ' ' + users[i].last_name;
                    return str;
                }
                i--;
            }
        }
    }

    renderRows(orders);
}());

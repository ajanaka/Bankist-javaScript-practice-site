'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2023-07-05T10:17:24.185Z',
    '2023-07-07T14:11:59.604Z',
    '2023-07-08T17:01:17.194Z',
    '2023-07-09T23:36:17.929Z',
    '2023-07-10T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2023-05-28T17:01:17.194Z',
    '2023-05-29T23:36:17.929Z',
    '2023-05-30T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'ka-GE', //Georgian (Georgia)
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2023-05-28T17:01:17.194Z',
    '2023-05-29T23:36:17.929Z',
    '2023-06-10T10:51:36.790Z',
  ],
  currency: 'JPY',
  locale: 'ja-JP',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const NumberFormat = function (locale, value, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const calcDayPassed = function (local, value) {
  const daysPassed = (date2, date1) =>
    Math.trunc(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  const days = daysPassed(value, new Date());
  if (days === 0) return 'Today';
  if (days === 1) return 'yesterday';
  if (days <= 7) return `${days} days ago`;

  return new Intl.DateTimeFormat(local).format(value);
};
//stat point
const createDisplyMovment = function (acc, sort = false) {
  containerMovements.innerHTML = '';
  const moves = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  moves.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const movDate = new Date(acc.movementsDates[i]);
    const dateFormat = calcDayPassed(acc.locale, movDate);

    const movNumber = NumberFormat(acc.locale, mov, acc.currency);

    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date">${dateFormat} </div>
    <div class="movements__value">${movNumber}€</div>
  </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const createDisplaySummery = function (acc) {
  const deposit = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumIn.textContent = NumberFormat(acc.locale, deposit, acc.currency);
  const withdrawal = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, cur) => acc + cur);
  labelSumOut.textContent = NumberFormat(acc.locale, withdrawal, acc.currency);
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(mov => mov * 0.012)
    .filter(mov => mov >= 1)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumInterest.textContent = NumberFormat(
    acc.locale,
    interest,
    acc.currency
  );
};

const calcPrintBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);
  labelBalance.textContent = NumberFormat(
    acc.locale,
    acc.balance,
    acc.currency
  );
};

const createUserName = function (acc) {
  acc.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUserName(accounts);

//user loggin

const updateUi = function (acc) {
  //displyMovment
  createDisplyMovment(acc);
  //displaySummery
  createDisplaySummery(acc);
  //displayBalance
  calcPrintBalance(acc);
};
//time out
const startLogOut = function () {
  let time = 100;
  const tick = function () {
    time--;
    const minute = String(Math.trunc(time / 60)).padStart(2, 0);
    const second = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${minute}:${second}`;

    if (time === 0) {
      clearInterval(timer);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = `Log in to get started`;
    }
  };
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};
let currentAccount, timer;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );
  if (currentAccount.pin === Number(inputLoginPin.value)) {
    containerApp.style.opacity = 100;
    labelWelcome.textContent = `${
      currentAccount.owner.split(' ')[0]
    },welcome back`;
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    //date and time
    const now = new Date();

    const option = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      // weekday: 'long',
    };

    const dateFormat = new Intl.DateTimeFormat(
      currentAccount.locale,
      option
    ).format(now);

    labelDate.textContent = `${dateFormat}`;
    //startTimeOut
    if (timer) clearInterval(timer);
    timer = startLogOut();
    //updateUi
    updateUi(currentAccount);
  }
});
//funds transfer
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const receiverAcc = accounts.find(
    acc => acc.userName === inputTransferTo.value
  );
  const amount = Number(inputTransferAmount.value);
  if (
    amount > 0 &&
    currentAccount.userName !== receiverAcc.userName &&
    receiverAcc &&
    currentAccount.balance >= amount
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());
    inputTransferTo.value = inputTransferAmount.value = '';
    //reStart timer
    if (timer) clearInterval(timer);
    timer = startLogOut();
    //updateUi
    updateUi(currentAccount);
  }
});
//request loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  const condition = currentAccount.movements.some(
    mov => mov >= (amount / 100) * 10
  );
  if (amount > 0 && condition) {
    setTimeout(function () {
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());
      //reStart timer
      if (timer) clearInterval(timer);
      timer = startLogOut();
      //updateUi
      updateUi(currentAccount);
    }, 3000);
  }
  inputLoanAmount.value = '';
});

//close
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  const index = accounts.findIndex(
    acc => acc.userName === inputCloseUsername.value
  );
  console.log(index);
  if (
    currentAccount.userName === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
    labelWelcome.textContent = `Log in to get started`;
  }
});

//sorting
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  createDisplyMovment(currentAccount, !sorted);
  sorted = !sorted;
});
//date and time
// const DateTimeFormat = function (date, locale) {
//   const calcDayPassed = (date1, date2) =>
//     Math.trunc(Math.abs(date2 - date1) / (60 * 60 * 24 * 1000));
//   const daysPassed = calcDayPassed(new Date(), date);
//   if (daysPassed === 0) return 'Today';
//   if (daysPassed === 1) return 'yesterday';
//   if (daysPassed <= 7) return `${daysPassed} days ago`;
//   return new Intl.DateTimeFormat(locale).format(date);
// };
// //number formatting
// const NumberFormat = function (value, locale, currency) {
//   return new Intl.NumberFormat(locale, {
//     style: 'currency',
//     currency: currency,
//   }).format(value);
// };

// const displayMovment = function (acc, sort = false) {
//   containerMovements.innerHTML = '';
//   const movement = sort
//     ? acc.movements.slice().sort((a, b) => a - b)
//     : acc.movements;
//   movement.forEach(function (mov, i) {
//     const date = new Date(acc.movementsDates[i]);
//     const movDate = DateTimeFormat(date, acc.locale);

//     const movNumber = NumberFormat(mov, acc.locale, acc.currency);
//     const type = mov > 0 ? 'deposit' : 'withdrawal';
//     const html = `<div class="movements__row">
//     <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
//     <div class="movements__date">${movDate}</div>
//     <div class="movements__value">${movNumber}</div>
//   </div>`;
//     containerMovements.insertAdjacentHTML('afterbegin', html);
//   });
// };

// //dispaly summery
// const calckdisplaySummery = function (acc) {
//   const deposit = acc.movements
//     .filter(mov => mov > 0)
//     .reduce((acc, cur) => acc + cur, 0);
//   labelSumIn.textContent = NumberFormat(deposit, acc.locale, acc.currency);
//   const withdrawal = acc.movements
//     .filter(mov => mov < 0)
//     .reduce((acc, cur) => acc + cur, 0);
//   labelSumOut.textContent = NumberFormat(withdrawal, acc.locale, acc.currency);
//   const interest = acc.movements
//     .filter(mov => mov > 0)
//     .map(mov => (mov * 1.02) / 100)
//     .filter(mov => mov >= 1)
//     .reduce((acc, cur) => acc + cur, 0);
//   labelSumInterest.textContent = NumberFormat(
//     interest,
//     acc.locale,
//     acc.currency
//   );
// };

// //displayBalance
// const calcPrintBalance = function (acc) {
//   acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);
//   labelBalance.textContent = NumberFormat(
//     acc.balance,
//     acc.locale,
//     acc.currency
//   );
// };

// //create userName
// const createUserName = function (acc) {
//   acc.forEach(function (acc) {
//     acc.userName = acc.owner
//       .toLowerCase()
//       .split(' ')
//       .map(name => name[0])
//       .join('');
//   });
// };
// createUserName(accounts);

// //updateUi
// const updateUi = function (acc) {
//   //display movment
//   displayMovment(acc);
//   //display summery
//   calckdisplaySummery(acc);
//   //display balance
//   calcPrintBalance(acc);
// };

// //userLogging
// let currentAccount;
// btnLogin.addEventListener('click', function (e) {
//   e.preventDefault();
//   currentAccount = accounts.find(
//     acc => acc.userName === inputLoginUsername.value
//   );
//   if (currentAccount.pin === Number(inputLoginPin.value)) {
//     containerApp.style.opacity = 100;
//     labelWelcome.textContent = `${
//       currentAccount.owner.split(' ')[0]
//     } welcome back`;
//     //hidden user password and userName
//     inputLoginUsername.value = inputLoginPin.value = '';
//     inputLoginPin.blur();

//     //date and time
//     const now = new Date();
//     const option = {
//       hour: 'numeric',
//       minute: 'numeric',
//       day: 'numeric',
//       month: 'numeric',
//       year: 'numeric',
//     };
//     const DateTimeFormat = new Intl.DateTimeFormat(
//       currentAccount.locale,
//       option
//     ).format(now);
//     labelDate.textContent = DateTimeFormat;
//     //updateUi
//     updateUi(currentAccount);
//   }
// });

// //transfer funds
// btnTransfer.addEventListener('click', function (e) {
//   e.preventDefault();
//   const receiverAcc = accounts.find(
//     acc => acc.userName === inputTransferTo.value
//   );
//   const amount = Number(inputTransferAmount.value);
//   if (
//     amount > 0 &&
//     currentAccount.balance >= amount &&
//     receiverAcc.userName !== currentAccount.userName &&
//     receiverAcc
//   ) {
//     currentAccount.movements.push(-amount);
//     receiverAcc.movements.push(amount);

//     //insertNewDate to newTransaction
//     currentAccount.movementsDates.push(new Date());
//     receiverAcc.movementsDates.push(new Date());
//     //updateUi
//     updateUi(currentAccount);

//     inputTransferAmount.value = inputTransferTo.value = '';
//   }
// });

// btnLoan.addEventListener('click', function (e) {
//   e.preventDefault();
//   const loanAmount = Number(inputLoanAmount.value);
//   const reqLoan = currentAccount.movements.some(
//     mov => mov >= (loanAmount * 10) / 100
//   );
//   if (loanAmount > 0 && reqLoan) {
//     setTimeout(function () {
//       currentAccount.movements.push(loanAmount);
//       //insertNewDate to newTransaction
//       currentAccount.movementsDates.push(new Date());

//       //updateUi
//       updateUi(currentAccount);
//     }, 3000);
//   }
// });

// //close account
// btnClose.addEventListener('click', function (e) {
//   e.preventDefault();
//   const index = accounts.findIndex(
//     acc => acc.userName === inputCloseUsername.value
//   );

//   if (
//     currentAccount.userName === inputCloseUsername.value &&
//     currentAccount.pin === Number(inputClosePin.value)
//   ) {
//     accounts.splice(index, 1);
//     containerApp.style.opacity = 0;
//     labelWelcome.textContent = `Log in to get started`;
//     inputCloseUsername.value = inputClosePin.value = '';
//   }
// });
// let sorted = false;
// btnSort.addEventListener('click', function () {
//   displayMovment(currentAccount, !sorted);
//   sorted = !sorted;
// });

//dates and time
//create a date

// const evenNumber = n => n % 2 === 0;
// console.log(evenNumber(101));
// console.log(evenNumber(102));

// const displayMovment = function (movement, sort = false) {
//   containerMovements.innerHTML = '';
//   const movs = sort ? movement.slice().sort((a, b) => a - b) : movement;
//   movs.forEach(function (mov, i) {
//     const type = mov > 0 ? 'deposit' : 'withdrawal';
//     const html = ` <div class="movements__row">
//     <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>

//     <div class="movements__value">${mov}€</div>
//   </div>`;
//     containerMovements.insertAdjacentHTML('afterbegin', html);
//   });
// };
// const updateUI = function (acc) {
//   //update movments
//   displayMovment(acc.movements);
//   //upDateBalance
//   calcPrintBalance(acc);
//   //updateSummery
//   displaySummery(acc.movements);
// };

// const createUserName = function (acc) {
//   acc.forEach(function (acc) {
//     acc.userName = acc.owner
//       .toLowerCase()
//       .split(' ')
//       .map(name => name[0])
//       .join('');
//   });
// };
// createUserName(accounts);

// const calcPrintBalance = function (acc) {
//   acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);
//   labelBalance.textContent = `${acc.balance}€`;
// };

// const displaySummery = function (mov) {
//   const deposit = mov.filter(mov => mov > 0).reduce((acc, cur) => acc + cur, 0);

//   labelSumIn.textContent = `${deposit}€`;

//   const withdrows = mov
//     .filter(mov => mov < 0)
//     .reduce((acc, cur) => acc + cur, 0);
//   labelSumOut.textContent = `${Math.abs(withdrows)}€`;

//   const calcInterest = mov
//     .filter(mov => mov > 0)
//     .map(deposit => (deposit * 1.2) / 100)
//     .filter(inter => inter >= 1)
//     .reduce((acc, cur) => acc + cur, 0);
//   labelSumInterest.textContent = `${calcInterest}€`;
// };

// let currentAccount;
// btnLogin.addEventListener('click', function (e) {
//   e.preventDefault();
//   currentAccount = accounts.find(
//     acc => acc.userName === inputLoginUsername.value
//   );
//   if (currentAccount.pin === Number(inputLoginPin.value)) {
//     //cleane userInterFace
//     inputLoginUsername.value = inputLoginPin.value = '';
//     //opacity: 100;
//     containerApp.style.opacity = 100;

//     //disply wlcome msg
//     const welcome = currentAccount.owner.split(' ')[0];

//     labelWelcome.textContent = `${welcome} welcome back`;

//     //upDateUi
//     updateUI(currentAccount);
//   }
// });
// btnTransfer.addEventListener('click', function (e) {
//   e.preventDefault();
//   const receiverAcc = accounts.find(
//     acc => acc.userName === inputTransferTo.value
//   );
//   const amount = Number(inputTransferAmount.value);
//   if (
//     amount > 0 &&
//     receiverAcc !== currentAccount &&
//     currentAccount.balance >= amount
//   ) {
//     currentAccount.movements.push(-amount);
//     receiverAcc.movements.push(amount);
//     updateUI(currentAccount);
//   }
//   inputTransferTo.value = inputTransferAmount.value = '';
// });

// btnLoan.addEventListener('click', function (e) {
//   e.preventDefault();
//   const reqLoan = Number(inputLoanAmount.value);
//   if (
//     reqLoan > 0 &&
//     currentAccount.movements.some(mov => mov >= (reqLoan / 100) * 10)
//   ) {
//     currentAccount.movements.push(reqLoan);
//     updateUI(currentAccount);
//   }
//   inputLoanAmount.value = '';
// });

// btnClose.addEventListener('click', function (e) {
//   e.preventDefault();
//   if (
//     currentAccount.userName === inputCloseUsername.value &&
//     currentAccount.pin === Number(inputClosePin.value)
//   ) {
//     const index = accounts.findIndex(
//       acc => acc.userName === currentAccount.userName
//     );
//     accounts.splice(index, 1);
//     containerApp.style.opacity = 0;
//   }
// });
// let sorted = false;
// btnSort.addEventListener('click', function (e) {
//   e.preventDefault();
//   displayMovment(currentAccount.movements, !sorted);
//   sorted = !sorted;
// });

// const displayMovment = function (movements, sort = false) {
//   const moves = sort ? movements.slice().sort((a, b) => a - b) : movements;
//   containerMovements.innerHTML = '';

//   moves.forEach(function (mov, i, arr) {
//     const type = mov > 0 ? 'deposit' : 'withdrawal';
//     const html = `<div class="movements__row">
//     <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>

//     <div class="movements__value">${mov}€</div>
//   </div>`;
//     containerMovements.insertAdjacentHTML('afterbegin', html);
//   });
// };

// const calcPrintBalance = function (acc) {
//   acc.balance = acc.movements.reduce((acc, cur, i, arr) => acc + cur, 0);

//   labelBalance.textContent = `${acc.balance}€`;
// };

// const createUserName = function (acc) {
//   acc.forEach(function (acc) {
//     acc.userName = acc.owner
//       .toLowerCase()
//       .split(' ')
//       .map(name => name[0])
//       .join('');
//   });
// };
// createUserName(accounts);

// const calckdisplaySummery = function (acc) {
//   const summaryIn = acc.movements
//     .filter(mov => mov > 0)
//     .reduce((acc, cur) => acc + cur, 0);

//   labelSumIn.textContent = `${summaryIn}€`;

//   const summaruOut = acc.movements
//     .filter(mov => mov < 0)
//     .reduce((acc, cur) => acc + cur, 0);
//   labelSumOut.textContent = `${Math.abs(summaruOut)}€`;

//   const interest = acc.movements
//     .filter(mov => mov > 0)
//     .map(deposit => (deposit * acc.interestRate) / 100)
//     .filter(inter => inter >= 1)
//     .reduce((acc, cur) => acc + cur, 0);
//   labelSumInterest.textContent = `${interest}€`;

//   console.log(interest);
// };
// //updateUi
// const updateUI = function (cur) {
//   //disply movment
//   displayMovment(cur.movements);
//   //disply balance
//   calcPrintBalance(cur);
//   //disply summery
//   calckdisplaySummery(cur);
// };

// //add event lisner
// let currentAccount;
// btnLogin.addEventListener('click', function (e) {
//   e.preventDefault();
//   currentAccount = accounts.find(
//     acc => acc.userName === inputLoginUsername.value
//   );

//   if (currentAccount?.pin === Number(inputLoginPin.value)) {
//     //disply userName and welcome massage
//     labelWelcome.textContent = `welcome Back ${
//       currentAccount.owner.split(' ')[0]
//     }`;

//     //clear username pin data
//     inputLoginUsername.value = inputLoginPin.value = '';

//     containerApp.style.opacity = 100;

//     updateUI(currentAccount);
//   }
// });

// //funds transfer
// btnTransfer.addEventListener('click', function (e) {
//   e.preventDefault();
//   const receiverAcc = accounts.find(
//     acc => acc.userName === inputTransferTo.value
//   );
//   console.log(receiverAcc);
//   const money = Number(inputTransferAmount.value);
//   console.log(receiverAcc, money);
//   if (
//     money > 0 &&
//     receiverAcc.userName !== currentAccount.userName &&
//     receiverAcc &&
//     currentAccount.balance >= money
//   ) {
//     currentAccount?.movements.push(-money);
//     receiverAcc?.movements.push(money);

//     //upDate Ui
//     updateUI(currentAccount);
//     //clean input field
//     inputTransferAmount.value = inputTransferTo.value = '';
//   }
// });
// btnClose.addEventListener('click', function (e) {
//   e.preventDefault();
//   if (
//     currentAccount.userName === inputCloseUsername.value &&
//     currentAccount.pin === Number(inputClosePin.value)
//   ) {
//     const index = accounts.findIndex(
//       acc => acc.userName === currentAccount.userName
//     );

//     accounts.splice(index, 1);
//     containerApp.style.opacity = 0;
//     inputClosePin.value = inputCloseUsername.value = '';
//   }
// });

// btnLoan.addEventListener('click', function (e) {
//   e.preventDefault();
//   const amount = Number(inputLoanAmount.value);
//   if (amount > 0 && currentAccount.movements.some(mov => mov >= amount / 100)) {
//     currentAccount.movements.push(+amount);
//     updateUI(currentAccount);
//     inputLoanAmount.value = '';
//   }
// });
// let sorted = false;
// btnSort.addEventListener('click', function (e) {
//   e.preventDefault();
//   displayMovment(currentAccount.movements, !sorted);
//   sorted = !sorted;
// });

// //LECTURES

// // const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// // let arr = ['a', 'b', 'c', 'd', 'e'];
// // console.log(arr.slice(2));
// // console.log(arr.slice(1, 4));
// // console.log(arr.slice(-3));
// // console.log(arr.slice(1, -2));
// // console.log(arr.slice(1, -3));
// // console.log(arr.slice(0, -3));

// // console.log(arr.slice());
// // console.log([...arr]);

// // //splice
// // // console.log(arr.splice(-3));
// // arr.splice(-1);
// // arr.splice(1, 2);

// // console.log(arr);

// // //REVERS
// // arr = ['a', 'b', 'c', 'd', 'e'];
// // const arr2 = ['f', 'e', 'd', 'c', 'b', 'a'];
// // console.log(arr2.reverse());
// // console.log(arr2);

// // //concat
// // const letters = arr.concat(arr2);
// // console.log(letters);
// // console.log([...arr, ...arr2]);

// // //join
// // console.log(letters.join('- '));
// // arr.push(arr2);
// // console.log(arr);

// // const arr = [23, 11, 64];
// // console.log(arr[0]);
// // console.log(arr.at(0));
// // //getting the last element

// // console.log(arr[arr.length - 1]);
// // console.log(arr.slice(-1)[0]);

// // console.log(arr.at(-1));
// // console.log(arr);

// // console.log('ashan'.at(0));

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// // for (const [i, movement] of movements.entries()) {
// //   if (movement > 0) {
// //     console.log(`movment of ${i + 1} : you deposited ${movement}`);
// //   } else {
// //     console.log(`movment of ${i + 1} : you withdrow ${Math.abs(movement)}`);
// //   }
// // }

// // console.log('for each//////////');

// // movements.forEach(function (mov, i, arr) {
// //   if (mov > 0) {
// //     console.log(`movment of ${i + 1} : you deposited ${mov}`);
// //   } else {
// //     console.log(`movment of ${i + 1} :you withdrow ${Math.abs(mov)}`);
// //   }
// // });

// // const currencies = new Map([
// //   ['USD', 'United States dollar'],
// //   ['EUR', 'Euro'],
// //   ['GBP', 'Pound sterling'],
// // ]);

// // currencies.forEach(function (value, key, map) {
// //   console.log(`${key}:${value}`);
// // });

// // const currenciesUnique = new Set(['USD', 'EUR', 'GBP', 'LKR', 'USD', 'EUR']);
// // console.log(currenciesUnique);

// // currenciesUnique.forEach(function (value, _, set) {
// //   console.log(`${key}:${value}`);
// // });

// // const checkDogs = function (dogsJulia, dogsKate) {
// //   const copyJulia = dogsJulia.slice();
// //   copyJulia.splice(-2);
// //   copyJulia.splice(0, 1);
// //   console.log(copyJulia);
// //   const concat = copyJulia.concat(dogsKate);

// //   concat.forEach(function (dogs, i, arr) {
// //     const adalteDogs = dogs > 3 ? ' adult' : 'puppy';
// //     console.log(`Dog number ${i + 1}
// //     is an ${adalteDogs}, and is ${dogs} years old`);
// //   });
// // };
// // checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
// // checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);
// // const euroUsd = 1.1;
// // const movUsd = movements.map(mov => mov * euroUsd);
// // console.log(movUsd);
// // const movementUsd = [];
// // for (const mov of movements) movementUsd.push(mov * 1.1);
// // console.log(movementUsd);

// // const newArra = movements.map((mov, i, arr) => {
// //   const type = mov > 0 ? 'withdrows' : 'deposited';
// //   const html = `movment of ${i + 1} : you ${type} ${Math.abs(mov)}`;
// //   return html;
// // });
// // console.log(newArra.join(' '));

// //max Value
// // const max = movements.reduce((acc, mov) => {
// //   if (acc > mov) return acc;
// //   else return mov;
// // }, movements[0]);
// // console.log(max);

// // const calcAverageHumanAge = function (ages) {
// //   const humenAge = ages.map(ages => (ages <= 2 ? ages * 2 : 16 + ages * 4));
// //   console.log(ages);
// //   console.log(humenAge);
// //   const adalteDogs = humenAge.filter(humenAge => humenAge >= 18);
// //   console.log(adalteDogs);
// //   const average = adalteDogs.reduce(
// //     (acc, age, i, arr) => acc + age / arr.length,
// //     0
// //   );
// //   return average;
// // };
// // const data1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// // const data2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
// // console.log(data1, data2);
// // const euroUsd = 1.1;
// // const depositedInUsd = movements
// //   .filter(mov => mov > 0)
// //   .map(mov => mov * euroUsd)
// //   .reduce((acc, curr, i, arr) => acc + curr, 0);
// // console.log(depositedInUsd);
// // const calcAverageHumanAge = function (ages) {
// //   const humenAge = ages
// //     .map(age => (age <= 2 ? age * 2 : age * 4 + 16))
// //     .filter(age => age >= 18)
// //     .reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
// //   return humenAge;
// // };

// // const test1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// // const test2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
// // console.log(test1, test2);

// // const firstDeposit = movements.find(mov => mov > 0);
// // console.log(firstDeposit);
// // console.log(movements);

// // console.log(accounts);
// // const userName = accounts.find(acc => acc.userName === 'js');
// // console.log(userName);

// // const userNameMap = accounts.map(acc => acc.userName === 'js');
// // console.log(userNameMap);

// // const userNameFilter = accounts.filter(acc => acc.userName === 'js');
// // console.log(userNameFilter);

// // accounts.forEach(function (acc) {
// //   const userNameFE = acc.userName === 'js';
// //   console.log(userNameFE);
// // });
// // const deposit = mov => mov > 0;

// // console.log(movements.some(deposit));
// // console.log(movements.every(deposit));
// // console.log(movements.filter(deposit));

// // const arr = [[1, 2, 4], 2, 1, 2, [4, 5, 4]];
// // console.log(arr.flat());

// // const deepArr = [1, [4, 5, [1, 2, 2, [5, 2]]], 1, 4];
// // console.log(deepArr.flat(3));

// // const totalBalance = accounts
// //   .flatMap(acc => acc.movements)

// //   .reduce((acc, cur) => acc + cur, 0);
// // console.log(totalBalance);
// // //return >0 b,a
// // //return <0 a,b
// // //ascending
// // movements.sort((a, b) => a - b);
// // console.log(movements);

// // //descending

// // movements.sort((a, b) => b - a);
// // console.log(movements);

// // const r = [10, 9, 15, 13, 21, 25];
// // // console.log(new Array(1, 2, 3, 4, 5, 6, 7));
// // // const x = new Array(7);
// // // trunc;
// // // x.fill(1, 3, 5);
// // // console.log(x);
// // r.fill(1, 2, 4);
// // console.log(r);

// // const x = Array.from({ length: 7 }, () => 1);
// // console.log(x);

// // const z = Array.from({ length: 7 }, (_, i) => i + 1);
// // console.log(z);
// // const dice = Array.from({ length: 100 }, () =>
// //   Math.trunc(Math.random() * 6 + 1)
// // );
// // console.log(dice);

// document
//   .querySelector('.balance__label')
//   .addEventListener('click', function () {
//     const movementUI = Array.from(
//       document.querySelectorAll('.movements__value'),
//       el => el.textContent.replace('€', '')
//     );
//     console.log(movementUI);
//   });
// const assending = movements.sort((a, b) => a - b);
// console.log(assending);
// const desending = movements.sort((a, b) => b - a);
// console.log(desending);

//my answer
// const dogs = [
//   { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
//   { weight: 8, curFood: 200, owners: ['Matilda'] },
//   { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
//   { weight: 32, curFood: 340, owners: ['Michael'] },
// ];
// dogs.forEach(function (dogs) {
//   dogs.recommendedFood = Math.trunc(dogs.weight ** 0.75 * 28);
// });

// let SarahDog = dogs.find(dog => dog.owners.includes('Sarah'));
// console.log(SarahDog);
// if (
//   SarahDog.recommendedFood > SarahDog.curFood * 0.9 &&
//   SarahDog.recommendedFood < SarahDog.curFood * 1.1
// ) {
//   console.log('ok');
// } else if (SarahDog.recommendedFood > SarahDog.curFood * 0.9) {
//   console.log(`eating  litle than recomended`);
// } else if (SarahDog.recommendedFood < SarahDog.curFood * 1.1) {
//   console.log(`eating too much than recomended`);
// }
// let eatingTooMuch = [];
// let eatingTooLitele = [];
// let eatingOk = [];
// const recomendation = dogs.map(dogs => {
//   if (
//     dogs.recommendedFood > dogs.curFood * 0.9 &&
//     dogs.recommendedFood < dogs.curFood * 1.1
//   ) {
//     eatingOk.push(dogs.owners);
//   } else if (dogs.recommendedFood > dogs.curFood * 0.9) {
//     eatingTooLitele.push(dogs.owners);
//   } else if (dogs.recommendedFood < dogs.curFood * 1.1) {
//     eatingTooMuch.push(dogs.owners);
//   }
// });

// // eatingTooMuch.forEach(function (name) {
// //   console.log(` ${name}'s dogs eat too much`);
// // });
// // eatingTooLitele.forEach(function (v, i) {
// //   console.log(`${
// //     eatingTooLitele[i + 0]
// //   } and ${eatingTooLitele[i + 1]} 's dogs eat
// // too little!`);
// // });
// for (const [i, v] of dogs.entries()) {
//   console.log(`${eatingTooLitele[i + 0]} and ${
//     eatingTooLitele[i + 1]
//   } 's dogs eat
// too little!`);
//   break;
// }

// for (const [i, v] of dogs.entries()) {
//   console.log(`${eatingTooMuch[i + 0]}  's dogs eat
// too Much!`);
//   break;
// }

// const exaclySame = dogs.some(dogs => dogs.recomendation === dogs.curFood);
// console.log(exaclySame);
// const okAmount = dogs.some(
//   dogs =>
//     dogs.recommendedFood > dogs.curFood * 0.9 &&
//     dogs.recommendedFood < dogs.curFood * 1.1
// );
// console.log(eatingOk);
// const ascendingOrder = dogs
//   .slice()
//   .map(rf => rf.recommendedFood)
//   .sort((a, b) => a - b);
// console.log(ascendingOrder);
// const dogs = [
//   { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
//   { weight: 8, curFood: 200, owners: ['Matilda'] },
//   { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
//   { weight: 32, curFood: 340, owners: ['Michael'] },
// ];

// dogs.forEach(dogs => (dogs.recFood = Math.trunc(dogs.weight ** 0.75 * 28)));
// console.log(dogs);

// const SarahDog = dogs.find(dogs => dogs.owners.includes('Sarah'));
// console.log(
//   `eating too ${SarahDog.recFood < SarahDog.curFood ? 'much' : 'little'}`
// );

// const ownersEatTooMuch = dogs
//   .filter(dogs => dogs.recFood < dogs.curFood)
//   .map(dog => dog.owners)
//   .flat();
// console.log(ownersEatTooMuch);

// const ownersEatTooLittle = dogs
//   .filter(dog => dog.curFood < dog.recFood)
//   .map(dog => dog.owners)
//   .flat();
// console.log(ownersEatTooLittle);

// /*"Matilda and
// Alice and Bob's dogs eat too much!*/
// /*Sarah and John and Michael's dogs eat
// too little!"*/
// console.log(`${ownersEatTooMuch.join(' and ')}'s dogs eat too much!`);

// console.log(`${ownersEatTooLittle.join(' and ')}'s dogs eat
// too little!`);

// const exaclySame = dogs.some(dogs => dogs.curFood === dogs.recFood);
// console.log(exaclySame);
// const checkEatingOk = dog =>
//   dog.curFood > dog.recFood * 0.9 && dog.curFood < dog.recFood * 1.1;

// console.log(dogs.some(checkEatingOk));

// const okAmount = dogs.filter(checkEatingOk);
// console.log(okAmount);

// console.log(dogs.slice().sort((a, b) => a.recFood - b.recFood));

// console.log(Number.parseFloat('23rmb'));

// setInterval(function () {
//   const now = new Date();
//   const hour = now.getHours();
//   const minute = now.getMinutes();
//   const second = now.getSeconds();
//   labelTimer.textContent = `${hour}:${minute}:${second}`;
// }, 1000);

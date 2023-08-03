"use strict";
const btn = document.querySelector(".button_submit");
const work = document.querySelector(".work");
const amount = document.querySelector(".amount");
const phone = document.querySelector(".phone");
let lat, lng;
let myPlacemark;
let newPlacemark;

phone.addEventListener("click", function (e) {
  phone.value = "+7";
  phone.focus();
  phone.selectionStart = phone.value.length;
});

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    function (position) {
      const { latitude, longitude } = position.coords;
      lat = latitude;
      lng = longitude;
      const coords = [lat, lng];
      ymaps.ready(init);
      function init() {
        // Создание карты.
        const myMap = new ymaps.Map(
          "map",
          {
            // Координаты центра карты.
            // Порядок по умолчанию: «широта, долгота».
            // Чтобы не определять координаты центра карты вручную,
            // воспользуйтесь инструментом Определение координат.
            center: coords,
            // Уровень масштабирования. Допустимые значения:
            // от 0 (весь мир) до 19.
            zoom: 13,
          },
          {
            searchControlProvider: "yandex#search",
          }
        );

        myPlacemark = new ymaps.Placemark(
          coords,
          {
            iconCaption: "Вы здесь",
          },
          {
            preset: "islands#greenDotIconWithCaption",
          }
        );
        myMap.geoObjects.add(myPlacemark);

        myMap.events.add("click", function (event) {
          console.log(event.get("coords"));
          [lat, lng] = event.get("coords");
          if (newPlacemark) {
            myMap.geoObjects.remove(newPlacemark);
          }
          newPlacemark = new ymaps.Placemark(
            [lat, lng],
            {
              iconCaption: "Кординаты зафиксированы",
            },
            {
              preset: "islands#greenDotIconWithCaption",
            }
          );

          myMap.geoObjects.add(newPlacemark);
          console.log(myMap.geoObjects);
        });
      }
    },
    function () {
      alert("something wrong");
    }
  );
}
let key;
const getKey = async function () {
  const request = await fetch("http://localhost:8013");
  const data = await request.json();
  key = await data[0].key;
  console.log(data);
  console.log(key);
};
getKey();
btn.addEventListener("click", function () {
  console.log(phone.value.slice(0, 1));

  if (phone.value.slice(0, 1) === "8" || phone.value.length > 12) {
    alert("Пожалуйста введите номер в нужном формате");
    phone.value = "";
    return;
  }
  amount.value === "" ? (amount.value = "Клиент") : amount.value;
  fetch(`https://api.telegram.org/bot${key}/sendMessage`, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify({
      chat_id: "-981192490",
      text: `НОВЫЙ ЗАКАЗ:
Вид работ: ${work.value},
Имя клиента: ${amount.value},
Телефон клиента: ${phone.value}`,
    }),
  });

  fetch(`https://api.telegram.org/bot${key}/sendContact`, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify({
      chat_id: "-981192490",
      first_name: `${amount.value}`,
      phone_number: `${phone.value}`,
    }),
  });

  fetch(`https://api.telegram.org/bot${key}/sendMessage`, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify({
      chat_id: "-981192490",
      text: `https://yandex.ru/maps/?ll=${lng}%2C${lat}&mode=whatshere&whatshere%5Bpoint%5D=${lng}%2C${lat}&whatshere%5Bzoom%5D=16&z=16`,
    }),
  });
  amount.value = "";
  phone.value = "";
  alert("заявка отправлена");
});

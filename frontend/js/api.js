//api.js

// Překlady pro různé jazyky
const translations = {
  en: {
    noRooms: "No rooms available for selected dates and guests.",
    errorAvailability: "Error checking availibility!",
    msgSent: "Your message has been sent!",
    msgError: "Error sending message!",
    bookingSuccess: "Booking was successfully created!",
    bookingError: "Error creating booking:",
    reservationSuccess: "Reservation was successfully created!",
    reservationError: "Error creating reservation:",
    restaurantAvailable: "Restaurant is available for your selected time.",
    restaurantUnavailable: "No availability for the selected time.",
    restaurantCheckError: "Error checking availability.",
    selectRoom: "Please select the room!",
    availableRooms: "Available rooms",
    room: "Room",
    capacity: "Capacity"
  },
  de: {
    noRooms: "Keine Zimmer für das gewählte Datum und die Gäste verfügbar.",
    errorAvailability: "Fehler bei der Verfügbarkeitsprüfung!",
    msgSent: "Ihre Nachricht wurde gesendet!",
    msgError: "Fehler beim Senden der Nachricht!",
    bookingSuccess: "Buchung wurde erfolgreich erstellt!",
    bookingError: "Fehler beim Erstellen der Buchung:",
    reservationSuccess: "Reservierung wurde erfolgreich erstellt!",
    reservationError: "Fehler bei der Reservierung:",
    restaurantAvailable: "Tisch ist für die gewählte Zeit verfügbar.",
    restaurantUnavailable: "Kein Tisch verfügbar zur gewählten Zeit.",
    restaurantCheckError: "Fehler bei der Überprüfung der Verfügbarkeit.",
    selectRoom: "Bitte wählen Sie ein Zimmer aus!",
    availableRooms: "Verfügbare Zimmer",
    room: "Zimmer",
    capacity: "Kapazität"
  }
};

// Funkce vrací jazyk podle HTML tagu
function getLang() {
  return document.documentElement.lang === 'de' ? 'de' : 'en';
}

// Funkce pro překlad textu
function translate(key) {
  const lang = getLang();
  return translations[lang] && translations[lang][key] ? translations[lang][key] : key;
}

console.log("🌍 HTML lang:", document.documentElement.lang);
console.log("🌍 getLang():", getLang());
console.log("📣 Testovací překlad:", translate('msgSent'));

// Test backendu
fetch('/backend/ping')
  .then(response => response.text())
  .then(text => console.log('✅ Backend responded:', text))
  .catch(error => console.error('❌ Connection error with backend:', error));

// Notifikace
function showNotification(message, duration = 3000, type = 'success') {
  const notification = document.getElementById('notification');
  if (!notification) return;
  notification.textContent = message;
  notification.className = `notification show ${type}`;
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.className = 'notification hidden';
    }, 400);
  }, duration);
}


document.addEventListener('DOMContentLoaded', function () {
  const contactForm = document.querySelector('.contact--form-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const jmeno = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const zprava = document.getElementById('message').value;
      sendContact(jmeno, email, zprava);
    });
  }

  const bookForm = document.querySelector('.bookForm');
  if (bookForm) {
    bookForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const selectedRoom = document.querySelector('input[name="selectedRoom"]:checked');
      if (!selectedRoom) {
        showNotification(translate('selectRoom'), 3000, 'error');
        return;
      }
      const formData = {
        firstName: document.getElementById('bookForm--firstName').value,
        lastName: document.getElementById('bookForm--lastName').value,
        email: document.getElementById('bookForm--email').value,
        countryCode: document.getElementById('bookForm--countryCode').value,
        phone: document.getElementById('bookForm--phone').value,
        city: document.getElementById('bookForm--city').value,
        street: document.getElementById('bookForm--street').value,
        postalCode: document.getElementById('bookForm--postalCode').value,
        country: document.getElementById('bookForm--country').value,
        checkInDate: document.getElementById('bookForm--checkInDate').value,
        checkOutDate: document.getElementById('bookForm--checkOutDate').value,
        guests: document.getElementById('numberOfGuests').value,
        selectedRoomId: selectedRoom.value
      };
      sendBooking(formData);
    });
    const inputsToWatch = ['bookForm--checkInDate', 'bookForm--checkOutDate', 'numberOfGuests'];
    inputsToWatch.forEach(id => {
      document.getElementById(id).addEventListener('change', () => {
        const guests = document.getElementById('numberOfGuests').value;
        const checkInDate = document.getElementById('bookForm--checkInDate').value;
        const checkOutDate = document.getElementById('bookForm--checkOutDate').value;
        if (guests && checkInDate && checkOutDate) {
          checkAvailability(guests, checkInDate, checkOutDate);
        }
      });
    });
  }

  const restaurantForm = document.querySelector('.reservation--form');
  const restaurantFields = ['reservation-date', 'reservation-time', 'Number'];
  restaurantFields.forEach(id => {
    const field = document.getElementById(id);
    if (field) {
      field.addEventListener('change', () => {
        const date = document.getElementById('reservation-date').value;
        const time = document.getElementById('reservation-time').value;
        const guests = document.getElementById('Number').value;
        const result = document.getElementById('restaurantAvailabilityResult');
        if (date && time && guests) {
          fetch('/backend/restaurantAvailability', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reservationDate: date, reservationTime: time, guests })
          })
            .then(res => res.json())
            .then(data => {
              if (data.success) {
                result.textContent = translate('restaurantAvailable');
                result.style.color = 'green';
                result.style.fontSize = '17px';
                document.getElementById('submitReservation').disabled = false;
              } else {
                result.textContent = translate('restaurantUnavailable');
                result.style.color = 'red';
                result.style.fontSize = '17px';
                document.getElementById('submitReservation').disabled = true;
              }
            })
            .catch(error => {
              result.textContent = translate('restaurantCheckError');
              console.error('❌ Error checking restaurant availability:', error);
            });
        }
      });
    }
  });

  if (restaurantForm) {
    restaurantForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        reservationDate: document.getElementById('reservation-date').value,
        reservationTime: document.getElementById('reservation-time').value,
        guests: document.getElementById('Number').value
      };
      sendRestaurantReservation(formData);
    });
  }
});

function checkAvailability(guests, checkInDate, checkOutDate) {
  fetch('/backend/availability', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ guests, checkInDate, checkOutDate })
  })
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById('availableRooms');
      container.innerHTML = '';
      if (data.success && data.rooms.length > 0) {
        container.innerHTML = `<p>${translate('availableRooms')}:</p>`;
        data.rooms.forEach(room => {
          const option = document.createElement('div');
          option.innerHTML = `
            <label>
              <input type="radio" name="selectedRoom" value="${room.id_rooms}" required>
              ${translate('room')} ${room.number} (${translate('capacity')}: ${room.capacity})
            </label>
          `;
          container.appendChild(option);
        });
        document.querySelector('.personalData').style.display = 'block';
        document.querySelector('.adressData').style.display = 'block';
        document.getElementById('bookForm--submit').style.display = 'block';
      } else {
        container.innerHTML = `<p style="color: red; font-size: 17px; font-family: Arial, Helvetica, sans-serif;">${translate('noRooms')}</p>`;
      }
    })
    .catch(error => {
      console.error('❌ Availability check failed:', error);
      showNotification(translate('errorAvailability'), 3000, 'error');
    });
}

function sendContact(name, email, message) {
  fetch('/backend/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, message })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        showNotification(translate('msgSent'), 3000, 'success');
        document.querySelector('.contact--form-form').reset();
      } else {
        showNotification(translate('msgError') + data.error, 3000, 'error');
      }
    })
    .catch(error => console.error('❌ Contact error:', error));
}

function sendBooking(data) {
  fetch('/backend/bookNow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        showNotification(translate('bookingSuccess'), 3000, 'success');
        document.querySelector('.bookForm').reset();

        const availableRooms = document.getElementById('availableRooms');
        availableRooms.innerHTML = '';
        availableRooms.style.display = 'none';
      } else {
        showNotification(translate('bookingError') + data.error, 3000, 'error');
      }
    })
    .catch(error => console.error('❌ Error sending booking:', error));
}


function sendRestaurantReservation(data) {
  fetch('/backend/restaurantReservation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        showNotification(translate('reservationSuccess'), 3000, 'success');
        document.querySelector('.reservation--form').reset();
        document.getElementById('restaurantAvailabilityResult').textContent = '';
        document.getElementById('submitReservation').disabled = true;
      } else {
        showNotification(translate('reservationError') + data.error, 3000, 'error');
      }
    })
    .catch(error => console.error('❌ Error sending reservation:', error));
}
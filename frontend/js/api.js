// === api.js ===


//test backendu
fetch('/backend/ping')
  .then(response => response.text())
  .then(text => console.log('✅ Backend responded:', text))
  .catch(error => console.error('❌ Connection error with backend:', error));

//kontakt
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

  //ubytování
  const bookForm = document.querySelector('.bookForm');
  if (bookForm) {
    bookForm.addEventListener('submit', function (e) {
      e.preventDefault();

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
      };

      sendBooking(formData);
    });
  }
 //restaurace
  const restaurantForm = document.querySelector('.reservation--form');
  if (restaurantForm) {
    restaurantForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        reservationDate: document.getElementById('reservation-date').value,
        reservationTime: document.getElementById('reservation-time').value,
        guests: document.getElementById('Number').value,
      };

      sendRestaurantReservation(formData);
    });
  }
});

//kontakt
function sendContact(name, email, message) {
  fetch('/backend/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, message })
  })
    .then(res => res.json())
    .then(data => {
      console.log('✅ Contact saved:', data);
      if (data.success) {
        alert('Your message has been sent!');
        document.querySelector('.contact--form-form').reset();
      } else {
        alert('Error sending message: ' + data.error);
      }
    })
    .catch(error => console.error('❌ Contact error:', error));
}


//ubytování
function sendBooking(data) {
  console.log('📤 Sending data:', data);

  fetch('/backend/bookNow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert('Booking was successfully created!');
        document.querySelector('.bookForm').reset();
      } else {
        alert('Error creating booking: ' + data.error);
      }
    })
    .catch(error => console.error('❌ Error sending booking:', error));
}

//restaurace
function sendRestaurantReservation(data) {
  console.log('📤 Sending data:', data);

  fetch('/backend/restaurantReservation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert('Reservation was successfully created!');
        document.querySelector('.reservation--form').reset();
      } else {
        alert('Error creating reservation: ' + data.error);
      }
    })
    .catch(error => console.error('❌ Error sending reservation:', error));
}

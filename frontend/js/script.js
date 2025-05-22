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
//spuštění kódu až po načtení stránky
document.addEventListener('DOMContentLoaded', function () {
    
    // automaticky načti zprávy při otevření admin.html
    if (window.location.pathname.includes('admin.html')) {
    const roomPlan = document.getElementById('room-plan');
    const tablePlan = document.getElementById('table-plan');

    if (roomPlan) roomPlan.style.display = 'none';
    if (tablePlan) tablePlan.style.display = 'none';

    loadData('/admin/messages');
    }

    //změna průhlednosti navigace při scrollování
    const nav = document.querySelector('nav');
    const header = document.querySelector('header');
    if (nav && header) {
        const headerHeight = header.offsetHeight;
        window.addEventListener('scroll', function () {
            const scrollY = window.scrollY;
            const opacity = Math.min(scrollY / headerHeight, 0.95);
            nav.style.background = `rgba(33, 33, 33, ${opacity})`;
        });
    }


    //ikona menu
    const menuIcon = document.getElementById('menuIcon');
    const menuSmall = document.querySelector('.menu--small');
    if (menuIcon && menuSmall) {
        menuIcon.addEventListener('click', function (event) {
            event.stopPropagation();
            menuSmall.classList.toggle('visible');
        });
        document.addEventListener('click', function (event) {
            if (!menuSmall.contains(event.target) && !menuIcon.contains(event.target)) {
                menuSmall.classList.remove('visible');
            }
        });
    }


    //scroll element 
    const scrollElements = document.querySelectorAll('.scroll-element');
    if (scrollElements.length > 0) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        });
        scrollElements.forEach(element => observer.observe(element));
    }

    // SUMMER buttons
if (document.getElementById('biking')) {
    document.getElementById('biking').addEventListener('click', function (e) {
        e.preventDefault();
        document.getElementById('mtb').style.display = 'block';
        document.getElementById('mtb--text').style.display = 'block';

        document.getElementById('hiking--image').style.display = 'none';
        document.getElementById('hiking--text').style.display = 'none';

        document.getElementById('climbing--image').style.display = 'none';
        document.getElementById('climbing--text').style.display = 'none';

        document.getElementById('guided--image').style.display = 'none';
        document.getElementById('guided--text').style.display = 'none';
    });

    document.getElementById('hiking').addEventListener('click', function (e) {
        e.preventDefault();
        document.getElementById('mtb').style.display = 'none';
        document.getElementById('mtb--text').style.display = 'none';

        document.getElementById('hiking--image').style.display = 'block';
        document.getElementById('hiking--text').style.display = 'block';

        document.getElementById('climbing--image').style.display = 'none';
        document.getElementById('climbing--text').style.display = 'none';

        document.getElementById('guided--image').style.display = 'none';
        document.getElementById('guided--text').style.display = 'none';
    });

    document.getElementById('climbing').addEventListener('click', function (e) {
        e.preventDefault();
        document.getElementById('mtb').style.display = 'none';
        document.getElementById('mtb--text').style.display = 'none';

        document.getElementById('hiking--image').style.display = 'none';
        document.getElementById('hiking--text').style.display = 'none';

        document.getElementById('climbing--image').style.display = 'block';
        document.getElementById('climbing--text').style.display = 'block';

        document.getElementById('guided--image').style.display = 'none';
        document.getElementById('guided--text').style.display = 'none';
    });

    document.getElementById('guided-tour').addEventListener('click', function (e) {
        e.preventDefault();
        document.getElementById('mtb').style.display = 'none';
        document.getElementById('mtb--text').style.display = 'none';

        document.getElementById('hiking--image').style.display = 'none';
        document.getElementById('hiking--text').style.display = 'none';

        document.getElementById('climbing--image').style.display = 'none';
        document.getElementById('climbing--text').style.display = 'none';

        document.getElementById('guided--image').style.display = 'block';
        document.getElementById('guided--text').style.display = 'block';
    });
}

// WINTERbuttons
if (document.getElementById('skiing')) {
 
    document.getElementById('skiing').addEventListener('click', function (e) {
        e.preventDefault();
        document.getElementById('skiing--image').style.display = 'block';
        document.getElementById('skiing--text').style.display = 'block';

        document.getElementById('snowboarding--image').style.display = 'none';
        document.getElementById('snowboarding--text').style.display = 'none';

        document.getElementById('apres-ski--image').style.display = 'none';
        document.getElementById('apres-ski--text').style.display = 'none';

        document.getElementById('tobogganing--image').style.display = 'none';
        document.getElementById('tobogganing--text').style.display = 'none';
    });

    document.getElementById('snowboarding').addEventListener('click', function (e) {
        e.preventDefault();
        document.getElementById('skiing--image').style.display = 'none';
        document.getElementById('skiing--text').style.display = 'none';

        document.getElementById('snowboarding--image').style.display = 'block';
        document.getElementById('snowboarding--text').style.display = 'block';

        document.getElementById('apres-ski--image').style.display = 'none';
        document.getElementById('apres-ski--text').style.display = 'none';

        document.getElementById('tobogganing--image').style.display = 'none';
        document.getElementById('tobogganing--text').style.display = 'none';
    });

    document.getElementById('apres-ski').addEventListener('click', function (e) {
        e.preventDefault();
        document.getElementById('skiing--image').style.display = 'none';
        document.getElementById('skiing--text').style.display = 'none';

        document.getElementById('snowboarding--image').style.display = 'none';
        document.getElementById('snowboarding--text').style.display = 'none';

        document.getElementById('apres-ski--image').style.display = 'block';
        document.getElementById('apres-ski--text').style.display = 'block';

        document.getElementById('tobogganing--image').style.display = 'none';
        document.getElementById('tobogganing--text').style.display = 'none';
    });

    document.getElementById('tobogganing').addEventListener('click', function (e) {
        e.preventDefault();
        document.getElementById('skiing--image').style.display = 'none';
        document.getElementById('skiing--text').style.display = 'none';

        document.getElementById('snowboarding--image').style.display = 'none';
        document.getElementById('snowboarding--text').style.display = 'none';

        document.getElementById('apres-ski--image').style.display = 'none';
        document.getElementById('apres-ski--text').style.display = 'none';

        document.getElementById('tobogganing--image').style.display = 'block';
        document.getElementById('tobogganing--text').style.display = 'block';
    });
}

 

    // Flatpickr (datum a čas)
    const bookedDates = []; //obsazené datumy

    if (typeof flatpickr !== 'undefined') {
        const checkIn = document.querySelector('#bookForm--checkInDate');
        const checkOut = document.querySelector('#bookForm--checkOutDate');
        if (checkIn) {
            flatpickr(checkIn, {
                dateFormat: "Y-m-d",
                minDate: "today",
                disable: bookedDates || [],
                onChange: function (selectedDates, dateStr) {
                    if (checkOut) {
                        flatpickr(checkOut, {
                            dateFormat: "Y-m-d",
                            minDate: dateStr,
                            disable: bookedDates || []
                        });
                    }
                }
            });
        }
        const reservationDate = document.querySelector('#reservation-date');
        const reservationTime = document.querySelector('#reservation-time');
        if (reservationDate) {
            flatpickr(reservationDate, {
                dateFormat: "Y-m-d",
                minDate: "today"
            });
        }
        if (reservationTime) {
            flatpickr(reservationTime, {
                enableTime: true,
                noCalendar: true,
                dateFormat: "H:i",
                time_24hr: true,
                minTime: "10:00",
                maxTime: "22:00"
            });
        }
    }
   

    // Zoom obrázků
    const images = document.querySelectorAll('.zoomable');
    if (images.length > 0) {
        const overlay = document.createElement('div');
        overlay.classList.add('image-overlay');
        document.body.appendChild(overlay);

        const overlayImage = document.createElement('img');
        overlay.appendChild(overlayImage);

        images.forEach(image => {
            image.addEventListener('click', function () {
                overlayImage.src = image.src;
                overlay.style.display = 'flex';
            });
        });

        overlay.addEventListener('click', function () {
            overlay.style.display = 'none';
        });
    }




    // Admin tlačítko
    const loginLogin = document.getElementById('loginModal');
    const closeLoginModal = document.getElementById('closeLoginModal');
    const loginForm = document.getElementById('loginForm');
    const adminButton = document.getElementById('admin--button');
    if (adminButton && loginLogin && closeLoginModal && loginForm) {
        adminButton.addEventListener('click', function (event) {
            event.preventDefault();
            loginLogin.style.display = 'block';
        });
        closeLoginModal.addEventListener('click', function () {
            loginLogin.style.display = 'none';
        });
        window.addEventListener('click', function (event) {
            if (event.target === loginLogin) {
                loginLogin.style.display = 'none';
            }
        });
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            if (username === 'admin' && password === 'pass') {
                window.location.href = 'admin.html';
            } else {
                showNotification("Wrong user name or password!", 3000, "error");
            }
        });
    }

    //zobrazení dat pro administraci 
    const adminText = document.getElementById('admin--text');
    const messageBtn = document.getElementById('admin--message-btn');
    const accommodationBtn = document.getElementById('admin--accommodation-btn');
    const restaurantBtn = document.getElementById('admin--restaurant-btn');
    const roomPlan = document.getElementById('room-plan');
    const tablePlan = document.getElementById('table-plan');
    const roomGrid = document.getElementById('room-grid');
    const tableGrid = document.getElementById('table-grid');

    function loadData(endpoint) {
        fetch(`http://localhost:3000/backend${endpoint}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
    adminText.innerHTML = '';
    if (data.data.length === 0) {
        adminText.innerHTML = `<p style="color: gray; font-style: italic;">No reservations found.</p>`;
        return;
    }

    data.data.forEach(item => {
        const div = document.createElement('div');
        div.classList.add('admin-item');

        if (item.answered === true || item.answered === 1) {
            div.classList.add('answered');
        }

        const buttonWrapper = document.createElement('div');
        buttonWrapper.className = 'admin-item-buttons';

        const textElement = document.createElement('pre');
        textElement.textContent = item.text || item;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'DELETE';
        deleteBtn.className = 'delete-btn';

        if ('id_messages' in item) {
            const answerBtn = document.createElement('button');
            answerBtn.textContent = item.answered ? 'Unmark as answered' : 'Mark as answered';
            answerBtn.className = 'answered-btn';

            answerBtn.addEventListener('click', () => {
                const newStatus = !(item.answered === true || item.answered === 1);
                fetch(`/backend/admin/messages/${item.id_messages}/answered`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ answered: newStatus })
                })
                .then(res => res.json())
                .then(result => {
                    if (result.success) {
                        item.answered = newStatus;
                        answerBtn.textContent = newStatus ? 'Unmark as answered' : 'Mark as answered';
                        div.classList.toggle('answered', newStatus);
                    }
                });
            });

            deleteBtn.addEventListener('click', () => {
                if (confirm('Opravdu chcete smazat tuto zprávu?')) {
                    fetch(`/backend/admin/messages/${item.id_messages}`, {
                        method: 'DELETE'
                    })
                    .then(res => res.json())
                    .then(result => {
                        if (result.success) {
                            showNotification("Message deleted.", 3000, 'success');
                            loadData(endpoint);
                            div.remove();
                        }
                    });
                }
            });

            buttonWrapper.appendChild(answerBtn);
        }

        if ('id_reservations' in item) {
            deleteBtn.addEventListener('click', () => {
                if (confirm('Do you really want to delete this reservation?')) {
                    fetch(`/backend/admin/reservations/${item.id_reservations}`, {
                        method: 'DELETE'
                    })
                    .then(res => res.json())
                    .then(result => {
                        if (result.success) {
                            showNotification("Reservation deleted.", 3000, 'success');
                            loadData(endpoint);
                            div.remove();
                        }
                    });
                }
            });
        }

        div.appendChild(textElement);
        buttonWrapper.appendChild(deleteBtn);
        div.appendChild(buttonWrapper);
        adminText.appendChild(div);
    });
} else {
    adminText.innerHTML = `<p>Chyba při načítání dat: ${data.error}</p>`;
}

            })
            .catch(error => {
                console.error('❌ Chyba při načítání dat:', error);
                adminText.innerHTML = `<p>Chyba při načítání dat.</p>`;
            });
    }






function generateDynamicGrid(container, prefix, endpoint, callback) {
    fetch(`http://localhost:3000/backend/admin/${endpoint}`)
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                container.innerHTML = '';
                data.data.forEach(item => {
                    const button = document.createElement('button');
                    button.textContent = `${prefix} ${item.number}`;
                    button.addEventListener('click', () => {
                        
                        container.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
                        button.classList.add('active');

                        callback(item.number, button); 
                    });
                    container.appendChild(button);
                });
            } else {
                container.innerHTML = '<p>Chyba při načítání plánku.</p>';
            }
        })
        .catch(error => {
            console.error('❌ Chyba při načítání plánku:', error);
            container.innerHTML = '<p>Chyba při načítání plánku.</p>';
        });
}


if (messageBtn && adminText) {
    messageBtn.addEventListener('click', e => {
        e.preventDefault();

        // Zvýrazni aktivní záložku
        document.querySelectorAll('#admin--menu li a').forEach(btn => btn.classList.remove('active'));
        messageBtn.classList.add('active');

        roomPlan.style.display = 'none';
        tablePlan.style.display = 'none';
        loadData('/admin/messages');
    });
}

if (accommodationBtn && adminText && roomGrid) {
  accommodationBtn.addEventListener('click', e => {
    e.preventDefault();

    // Zvýrazni aktivní záložku
    document.querySelectorAll('#admin--menu li a').forEach(btn => btn.classList.remove('active'));
    accommodationBtn.classList.add('active');

    roomPlan.style.display = 'block';
    tablePlan.style.display = 'none';
    adminText.innerHTML = '';
    loadData('/admin/accommodation');

    generateDynamicGrid(roomGrid, 'Room', 'rooms', (roomId, button) => {
      document.querySelectorAll('.room-grid button').forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      loadData(`/admin/accommodation/${roomId}`);
    });
  });
}

if (restaurantBtn && adminText && tableGrid) {
  restaurantBtn.addEventListener('click', e => {
    e.preventDefault();

    // Zvýrazni aktivní záložku
    document.querySelectorAll('#admin--menu li a').forEach(btn => btn.classList.remove('active'));
    restaurantBtn.classList.add('active');

    tablePlan.style.display = 'block';
    roomPlan.style.display = 'none';
    adminText.innerHTML = '';
    loadData('/admin/restaurant');

    generateDynamicGrid(tableGrid, 'Table', 'tables', (tableId, button) => {
      document.querySelectorAll('.table-grid button').forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      loadData(`/admin/restaurant/${tableId}`);
    });
  });
}


    
});

document.addEventListener('DOMContentLoaded', function () {
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

 const bookedDates = [];
    // Flatpickr inicializace
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

    // Admin tlačítka
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
                alert('Nesprávné uživatelské jméno nebo heslo.');
            }
        });
    }

    const adminText = document.getElementById('admin--text');
    const messageBtn = document.getElementById('admin--message-btn');
    const accommodationBtn = document.getElementById('admin--accommodation-btn');
    const restaurantBtn = document.getElementById('admin--restaurant-btn');
    function loadData(endpoint) {
        fetch(`http://localhost:3000/backend${endpoint}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    adminText.innerHTML = '';
                    data.data.forEach(item => {
                        const div = document.createElement('div');
                        div.classList.add('admin-item');
                        div.textContent = item;
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
    if (messageBtn && adminText) {
        messageBtn.addEventListener('click', e => {
            e.preventDefault();
            loadData('/admin/messages');
        });
    }
    if (accommodationBtn && adminText) {
        accommodationBtn.addEventListener('click', e => {
            e.preventDefault();
            loadData('/admin/accommodation');
        });
    }
    if (restaurantBtn && adminText) {
        restaurantBtn.addEventListener('click', e => {
            e.preventDefault();
            loadData('/admin/restaurant');
        });
    }
    
});

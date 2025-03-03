document.addEventListener("DOMContentLoaded", function () {
    const haloScreen = document.getElementById("haloScreen");
    const profileSection = document.getElementById("profileSection");
    const roleAnimation = document.getElementById("roleAnimation");
    const toggleModeBtn = document.getElementById("toggleModeBtn");
    const body = document.body;
    const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
    const sections = document.querySelectorAll("section");
    const navbar = document.querySelector(".navbar");
    const navbarToggler = document.querySelector(".navbar-toggler");

    /*** 🔹 Fungsi untuk Mengambil Tinggi Navbar ***/
    function getNavbarHeight() {
        return navbar.offsetHeight;
    }

    /*** 🔹 Animasi "Halo" Sebelum Masuk ***/
    setTimeout(() => {
        requestAnimationFrame(() => {
            haloScreen.style.opacity = "0";
            setTimeout(() => {
                haloScreen.style.display = "none";
                profileSection.style.opacity = "1";
                profileSection.style.transform = "translateY(0)";
            }, 1000);
        });
    }, 1500);

    /*** 🔹 Animasi Bergantian untuk Role ***/
    const roles = ["Web Developer", "UI/UX Designer", "Software Engineer"];
    let roleIndex = 0;

    function changeRole() {
        roleAnimation.style.opacity = "0";
        setTimeout(() => {
            roleAnimation.innerText = roles[roleIndex];
            roleAnimation.style.opacity = "1";
            roleIndex = (roleIndex + 1) % roles.length;
        }, 500);
    }
    setInterval(changeRole, 3000);

    /*** 🔹 Mode Gelap/Terang ***/
    function updateThemeIcon() {
        toggleModeBtn.innerHTML = body.classList.contains("light-mode") ? "<i class='fa-solid fa-sun'></i>" : "<i class='fa-solid fa-moon'></i>";
    }

    if (localStorage.getItem("theme") === "light") {
        body.classList.add("light-mode");
    }
    updateThemeIcon();

    toggleModeBtn.addEventListener("click", function () {
        body.classList.toggle("light-mode");
        localStorage.setItem("theme", body.classList.contains("light-mode") ? "light" : "dark");
        updateThemeIcon();
    });

    /*** 🔹 Animasi Gelombang (GSAP) ***/
    if (typeof gsap !== "undefined") {
        function animateWave(waveId, amplitude, duration) {
            gsap.to(waveId, {
                attr: { d: `M0,250 Q250,${400 + amplitude} 500,${250 - amplitude} T1000,250` },
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                duration: duration,
            });
        }

        animateWave("#wave1", 30, 4);
        animateWave("#wave2", 40, 5);
        animateWave("#wave3", 25, 3);
    }

    /*** 🔹 Navigasi Aktif Berdasarkan Scroll ***/
    function setActiveNav() {
        let scrollPosition = window.scrollY + getNavbarHeight() + 50;

        sections.forEach((section) => {
            if (!section.id) return;

            const sectionTop = section.offsetTop - getNavbarHeight() - 50;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach((link) => link.classList.remove("active"));

                let activeLink = document.querySelector(`.navbar-nav .nav-link[href="#${section.id}"]`);
                if (activeLink) {
                    activeLink.classList.add("active");
                }
            }
        });
    }

    /*** 🔹 Event Listener untuk Scroll ***/
    let ticking = false;
    window.addEventListener("scroll", () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                setActiveNav();
                ticking = false;
            });
            ticking = true;
        }
    });

    /*** 🔹 Smooth Scroll Saat Klik Navbar ***/
    navLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const targetId = link.getAttribute("href");
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                let navbarHeight = getNavbarHeight();

                // Jika navbar dalam mode mobile terbuka, tutup dulu sebelum scroll
                if (navbarToggler && navbarToggler.getAttribute("aria-expanded") === "true") {
                    navbarToggler.click(); // Tutup navbar
                    setTimeout(() => {
                        window.scrollTo({
                            top: targetElement.offsetTop - navbarHeight - 10,
                            behavior: "smooth",
                        });
                    }, 300); // Tunggu navbar tertutup baru scroll
                } else {
                    window.scrollTo({
                        top: targetElement.offsetTop - navbarHeight - 10,
                        behavior: "smooth",
                    });
                }
            }
        });
    });

    /*** 🔹 Animasi Fade-In & Slide di About Section ***/
    gsap.from("#about", { 
        opacity: 0, 
        y: 50, 
        duration: 1, 
        scrollTrigger: {
            trigger: "#about",
            start: "top 80%",
            toggleActions: "play none none none"
        }
    });

    /*** 🔹 Animasi Skill Bar ***/
    const skillBars = document.querySelectorAll(".progress-bar");
    skillBars.forEach((bar) => {
        gsap.fromTo(bar, 
            { width: "0%" }, 
            { width: bar.style.width, duration: 1.5, ease: "power2.out", scrollTrigger: "#about" }
        );
    });

    /*** 🔹 Fade In Elements ***/
    const fadeInElements = document.querySelectorAll(".fade-in");
    function revealOnScroll() {
        fadeInElements.forEach((el) => {
            const elementTop = el.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            if (elementTop < windowHeight - 50) {
                el.classList.add("show");
            }
        });
    }
    window.addEventListener("scroll", revealOnScroll);
    revealOnScroll(); // Panggil sekali saat halaman dimuat

    // JavaScript untuk menampilkan detail proyek
    document.querySelectorAll('.detail-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const detailText = this.getAttribute('data-detail');
            document.getElementById('projectDetailText').innerText = detailText;
            const modal = new bootstrap.Modal(document.getElementById('projectDetailModal'));
            modal.show();
        });
    });
});

// Misalnya, jika Anda menggunakan jQuery
$('.detail-btn').click(function() {
    const detail = $(this).data('detail');
    $('#projectDetailText').text(detail); // Mengisi detail
    $('#projectDetailModal').modal('show'); // Tampilkan modal
});
(function () {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim();
    if (all) {
      return [...document.querySelectorAll(el)];
    } else {
      return document.querySelector(el);
    }
  };

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    if (all) {
      select(el, all).forEach((e) => e.addEventListener(type, listener));
    } else {
      select(el, all).addEventListener(type, listener);
    }
  };

  /**
   * Easy on scroll event listener
   */
  const onscroll = (el, listener) => {
    el.addEventListener("scroll", listener);
  };

  /**
   * Toggle .header-scrolled class to #header when page is scrolled
   */
  let selectHeader = select("#main-nav");
  if (selectHeader) {
    const headerScrolled = () => {
      if (window.scrollY > 100) {
        selectHeader.classList.add("header-scrolled");
        selectHeader.classList.add("fixed-top");
      } else {
        selectHeader.classList.remove("header-scrolled");
        selectHeader.classList.remove("fixed-top");
      }
    };
    window.addEventListener("load", headerScrolled);
    onscroll(document, headerScrolled);
  }

  /**
   * Back to top button
   */
  let backtotop = select(".back-to-top");
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add("active");
      } else {
        backtotop.classList.remove("active");
      }
    };
    window.addEventListener("load", toggleBacktotop);
    onscroll(document, toggleBacktotop);
  }

  /**
   * Mobile nav toggle
   */
  on("click", ".mobile-nav-toggle", function (e) {
    select("#navbar").classList.toggle("navbar-mobile");
    // select("#desktop-navbar").classList.toggle("d-none");
    this.classList.toggle("fa-bars");
    this.classList.toggle("fa-times");
  });

  /**
   * Mobile nav dropdowns activate
   */
  on(
    "click",
    ".navbar .dropdown > a",
    function (e) {
      if (select("#navbar").classList.contains("navbar-mobile")) {
        e.preventDefault();
        this.nextElementSibling.classList.toggle("dropdown-active");
      }
    },
    true
  );

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on(
    "click",
    ".scrollto",
    function (e) {
      if (select(this.hash)) {
        e.preventDefault();

        let navbar = select("#navbar");
        if (navbar.classList.contains("navbar-mobile")) {
          navbar.classList.remove("navbar-mobile");
          let navbarToggle = select(".mobile-nav-toggle");
          navbarToggle.classList.toggle("fa-bars");
          navbarToggle.classList.toggle("fa-times");
        }
        scrollto(this.hash);
      }
    },
    true
  );

  /**
   * Scroll with ofset on page load with hash links in the url
   */
  window.addEventListener("load", () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash);
      }
    }
  });

  // mobile search
  on("click", ".search-toggle", function (e) {
    e.preventDefault();
    let searchContent = select(".mobile-search .mobile-search-content");
    searchContent.classList.toggle("active");
  });

  /**
   * Hero Slider
   */
  let bgList = ["bg-primary-rgba", "bg-secondary-rgba", "bg-success-rgba"];
  let bgImage = ["./assets/img/hero-bg-1.png", "./assets/img/hero-bg-3.png"];
  new Swiper(".hero .swiper", {
    speed: 400,
    loop: false,
    spaceBetween: 100,
    autoplay: {
      delay: 10000,
      disableOnInteraction: false,
    },
    slidesPerView: 1,
    allowSlideNext: true,
    allowSlidePrev: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    on: {
      init: function () {
        var index = this.activeIndex;
        let hero = select(".hero");
        hero.classList.add("img-content");

        hero.classList.remove(bgList[index] - 1);
        hero.classList.add(bgList[index]);

        hero.style.backgroundImage = `url(${bgImage[index]})`;

        var heroWrapper = select(".hero .hero-wrapper");
        var heroImageWrapper = select(".hero .img-wrapper", true);

        for (let i = 0; i < heroImageWrapper.length; i++) {
          heroImageWrapper[i].classList.add("animate__rotateInUpRight");
        }
      },
    },
  }).on("slideChange", function () {
    var index = this.activeIndex;
    var hero = select(".hero");

    hero.classList.remove(bgList[index] - 1);
    hero.classList.add(bgList[index]);

    hero.style.backgroundImage = `url(${bgImage[index]})`;

    var heroWrapper = select(".hero .hero-wrapper");

    heroWrapper.classList.remove("active");
    heroWrapper.classList.add("active");

    var heroImageWrapper = select(".hero .img-wrapper", true);
    for (let i = 0; i < heroImageWrapper.length; i++) {
      heroImageWrapper[i].classList.add("animate__rotateInUpRight");
    }
  });

  /**
   * Porfolio isotope and filter
   */
  window.addEventListener("load", () => {
    let portfolioContainer = select(".portfolio-container");
    if (portfolioContainer) {
      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: ".portfolio-item",
        layoutMode: "fitRows",
      });

      let portfolioFilters = select("#portfolio-flters li", true);

      on(
        "click",
        "#portfolio-flters li",
        function (e) {
          e.preventDefault();
          portfolioFilters.forEach(function (el) {
            el.classList.remove("filter-active");
          });
          this.classList.add("filter-active");

          portfolioIsotope.arrange({
            filter: this.getAttribute("data-filter"),
          });
          aos_init();
        },
        true
      );
    }
  });

  /**
   * Initiate portfolio lightbox
   */
  const lightbox = GLightbox({
    touchNavigation: true,
    loop: true,
    autoplayVideos: true,
  });

  /**
   * Portfolio details slider
   */
  new Swiper(".portfolio-details-slider", {
    speed: 400,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      type: "bullets",
      clickable: true,
    },
  });

  /**
   * Testimonials slider
   */
  new Swiper(".testimonials-slider", {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    slidesPerView: "auto",
    pagination: {
      el: ".swiper-pagination",
      type: "bullets",
      clickable: true,
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 40,
      },

      1200: {
        slidesPerView: 3,
      },
    },
  });

  /**
   * Animation on scroll
   */
  function aos_init() {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
  }
  window.addEventListener("load", () => {
    aos_init();
  });
})();

(function ($) {
  "use strict";

  // Always hide spinner (even if other scripts fail)
  $(window).on("load", function () {
    const $spinner = $("#spinner");
    if ($spinner.length) $spinner.removeClass("show");
  });

  // WOW animation (only if WOW exists)
  if (typeof WOW === "function") {
    new WOW().init();
  }

  // Sticky Navbar
  $(window).on("scroll", function () {
    if ($(this).scrollTop() > 50) {
      $(".navbar").addClass("scrolled");
    } else {
      $(".navbar").removeClass("scrolled");
    }
  });

  // Back to top button
  $(window).on("scroll", function () {
    if ($(this).scrollTop() > 300) {
      $(".back-to-top").fadeIn("slow");
    } else {
      $(".back-to-top").fadeOut("slow");
    }
  });

  $(".back-to-top").on("click", function (e) {
    e.preventDefault();

    // Use easing if available, otherwise fallback
    const easing = $.easing && $.easing.easeInOutExpo ? "easeInOutExpo" : "swing";
    $("html, body").animate({ scrollTop: 0 }, 800, easing);
  });

  /* Testimonials carousel (only if owlCarousel exists) */
  const $testimonial = $(".testimonial-carousel");
  if ($testimonial.length && typeof $testimonial.owlCarousel === "function") {
    $testimonial.owlCarousel({
      autoplay: true,
      smartSpeed: 1000,
      loop: true,
      nav: false,
      dots: true,
      items: 1,
      dotsData: true
    });

    // Read more / Read less (safe)
    const MAX_CHARS = 170;

    function initReadMore() {
      document.querySelectorAll(".testimonial-item").forEach((item) => {
        const p = item.querySelector(".testimonial-text");
        if (!p) return;

        // prevent duplicate init (owl clones)
        if (item.dataset.readmoreInit === "1") return;
        item.dataset.readmoreInit = "1";

        const fullText = p.textContent.trim().replace(/\s+/g, " ");
        if (fullText.length <= MAX_CHARS) return;

        const shortText = fullText.slice(0, MAX_CHARS).trim() + "...";

        p.dataset.full = fullText;
        p.dataset.short = shortText;
        p.textContent = shortText;

        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "read-more-btn";
        btn.textContent = "Read more";
        p.insertAdjacentElement("afterend", btn);

        btn.addEventListener("click", () => {
          const expanded = item.dataset.expanded === "1";
          item.dataset.expanded = expanded ? "0" : "1";
          p.textContent = expanded ? p.dataset.short : p.dataset.full;
          btn.textContent = expanded ? "Read more" : "Read less";
        });
      });
    }

    initReadMore();

    // Collapse back when slide changes
    $testimonial.on("changed.owl.carousel", function () {
      document.querySelectorAll(".testimonial-item").forEach((item) => {
        const p = item.querySelector(".testimonial-text");
        const btn = item.querySelector(".read-more-btn");
        if (!p || !btn || !p.dataset.short) return;

        item.dataset.expanded = "0";
        p.textContent = p.dataset.short;
        btn.textContent = "Read more";
      });
    });
  }

  /* Close mobile navbar on click (works with or without bootstrap object) */
  document.querySelectorAll(".navbar-nav .nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      const navbar = document.querySelector(".navbar-collapse");
      if (!navbar || !navbar.classList.contains("show")) return;

      // Bootstrap 5
      if (window.bootstrap && window.bootstrap.Collapse) {
        new window.bootstrap.Collapse(navbar).hide();
        return;
      }

      // Bootstrap 4 fallback (jQuery)
      if (typeof $(navbar).collapse === "function") {
        $(navbar).collapse("hide");
      }
    });
  });

})(jQuery);

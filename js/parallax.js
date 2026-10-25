(function () {
        var layer = document.querySelector("[data-parallax]");
        if (!layer) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        var ticking = false;
        function update() {
          var y = window.scrollY || 0;
          var limit = layer.parentElement.offsetHeight;
          layer.style.transform = y > limit ? "" : "translate3d(0," + y * 0.22 + "px,0)";
          ticking = false;
        }

        window.addEventListener(
          "scroll",
          function () {
            if (!ticking) {
              ticking = true;
              requestAnimationFrame(update);
            }
          },
          { passive: true }
        );
      })();

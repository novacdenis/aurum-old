// header slider
function headerSlider() {
  if (!document.querySelector("#header-slider")) return;

  const displacementSlider = function (opts) {
    let vertex = `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
    `;

    let fragment = `
        
        varying vec2 vUv;

        uniform sampler2D currentImage;
        uniform sampler2D nextImage;

        uniform float dispFactor;

        void main() {

            vec2 uv = vUv;
            vec4 _currentImage;
            vec4 _nextImage;
            float intensity = 0.3;

            vec4 orig1 = texture2D(currentImage, uv);
            vec4 orig2 = texture2D(nextImage, uv);
            
            _currentImage = texture2D(currentImage, vec2(uv.x, uv.y + dispFactor * (orig2 * intensity)));

            _nextImage = texture2D(nextImage, vec2(uv.x, uv.y + (1.0 - dispFactor) * (orig1 * intensity)));

            vec4 finalTexture = mix(_currentImage, _nextImage, dispFactor);

            gl_FragColor = finalTexture;

        }
    `;

    let images = opts.images,
      image,
      sliderImages = [];
    let canvasWidth = images[0].clientWidth;
    let canvasHeight = images[0].clientHeight;
    let parent = opts.parent;
    let renderWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    let renderHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

    let renderW, renderH;

    if (renderWidth > canvasWidth) {
      renderW = renderWidth;
    } else {
      renderW = canvasWidth;
    }

    renderH = canvasHeight;

    let renderer = new THREE.WebGLRenderer({
      antialias: false,
    });

    const _w = () => {
      if (window.innerWidth < 720) {
        if (window.innerHeight / window.innerWidth > 1.78) {
          const _c =
            window.innerHeight / window.innerWidth -
            (window.innerHeight / window.innerWidth / 100) * 10;

          return renderW * _c;
        }

        return window.innerWidth * 1.77;
      }

      return renderW;
    };

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x23272a, 1.0);
    renderer.setSize(_w(), renderH);
    parent.appendChild(renderer.domElement);

    let loader = new THREE.TextureLoader();
    loader.crossOrigin = "anonymous";

    images.forEach((img) => {
      image = loader.load(img.getAttribute("src") + "?v=" + Date.now());
      image.magFilter = image.minFilter = THREE.LinearFilter;
      image.anisotropy = renderer.capabilities.getMaxAnisotropy();
      sliderImages.push(image);
    });

    let scene = new THREE.Scene();
    scene.background = new THREE.Color(0x23272a);
    let camera = new THREE.OrthographicCamera(
      renderWidth / -2,
      renderWidth / 2,
      renderHeight / 2,
      renderHeight / -2,
      1,
      1000
    );

    camera.position.z = 1;

    let mat = new THREE.ShaderMaterial({
      uniforms: {
        dispFactor: { type: "f", value: 0.0 },
        currentImage: { type: "t", value: sliderImages[0] },
        nextImage: { type: "t", value: sliderImages[1] },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      opacity: 1.0,
    });

    let geometry = new THREE.PlaneBufferGeometry(parent.offsetWidth, parent.offsetHeight, 1);
    let object = new THREE.Mesh(geometry, mat);
    object.position.set(0, 0, 0);
    scene.add(object);

    let addEvents = function () {
      let pagButtons = Array.from(document.getElementById("pagination").querySelectorAll("button"));
      let isAnimating = false;

      pagButtons.forEach((el) => {
        el.addEventListener("click", function () {
          if (!isAnimating) {
            isAnimating = true;

            document.getElementById("pagination").querySelectorAll(".active")[0].className = "";
            this.className = "active";

            let slideId = parseInt(this.dataset.slide, 10);

            mat.uniforms.nextImage.value = sliderImages[slideId];
            mat.uniforms.nextImage.needsUpdate = true;

            TweenLite.to(mat.uniforms.dispFactor, 1, {
              value: 1,
              ease: "Expo.easeInOut",
              onComplete: function () {
                mat.uniforms.currentImage.value = sliderImages[slideId];
                mat.uniforms.currentImage.needsUpdate = true;
                mat.uniforms.dispFactor.value = 0.0;
                isAnimating = false;
              },
            });

            let slideTitleEl = document.getElementById("slide-title");
            let slideStatusEl = document.getElementById("slide-status");
            let nextSlideTitle = document.querySelectorAll(`[data-slide-title="${slideId}"]`)[0]
              .innerHTML;
            let nextSlideStatus = document.querySelectorAll(`[data-slide-status="${slideId}"]`)[0]
              .innerHTML;

            TweenLite.fromTo(
              slideTitleEl,
              0.5,
              {
                autoAlpha: 1,
                filter: "blur(0px)",
                y: 0,
              },
              {
                autoAlpha: 0,
                filter: "blur(10px)",
                y: 20,
                ease: "Expo.easeIn",
                onComplete: function () {
                  slideTitleEl.innerHTML = nextSlideTitle;

                  TweenLite.to(slideTitleEl, 0.5, {
                    autoAlpha: 1,
                    filter: "blur(0px)",
                    y: 0,
                  });
                },
              }
            );

            TweenLite.fromTo(
              slideStatusEl,
              0.5,
              {
                autoAlpha: 1,
                filter: "blur(0px)",
                y: 0,
              },
              {
                autoAlpha: 0,
                filter: "blur(10px)",
                y: 20,
                ease: "Expo.easeIn",
                onComplete: function () {
                  slideStatusEl.innerHTML = nextSlideStatus;

                  TweenLite.to(slideStatusEl, 0.5, {
                    autoAlpha: 1,
                    filter: "blur(0px)",
                    y: 0,
                    delay: 0.1,
                  });
                },
              }
            );
          }
        });
      });

      // Animate slide on page load
      pagButtons[0].click();
    };

    addEvents();

    window.addEventListener("resize", function (e) {
      renderer.setSize(renderW, renderH);
    });

    let animate = function () {
      requestAnimationFrame(animate);

      renderer.render(scene, camera);
    };
    animate();
  };

  // Adjust images
  const sliderImgs = Array.from(
    document.querySelector("#header-slider").querySelectorAll("[data-mobile-image]")
  );
  if (window.innerWidth < 961) {
    sliderImgs.forEach((img) => {
      img.src = img.getAttribute("data-mobile-image");
    });
  }

  imagesLoaded(document.querySelectorAll("img"), () => {
    document.body.classList.remove("loading");

    const el = document.getElementById("slider");
    const imgs = Array.from(el.querySelectorAll("img"));
    new displacementSlider({
      parent: el,
      images: imgs,
    });
  });
}

function headerSliderM() {
  new Swiper("#header-slider-m .swiper", {
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      renderBullet: function (index, className) {
        return '<button class="' + className + '">' + "</button>";
      },
    },
  });
}

if (window.innerWidth < 840) {
  headerSliderM();
} else {
  headerSlider();
}

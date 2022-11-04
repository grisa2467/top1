import React, { useRef, useEffect } from "react";
import FlickitySlider from "./FlickitySlider";
import "react-photoswipe/lib/photoswipe.css";

import PhotoSwipe from "photoswipe";
import PhotoSwipeUI_Default from "photoswipe/dist/photoswipe-ui-default";

const PropertyPagePhotos = ({ photoIds }) => {
  const flickity = useRef(null);
  const eventsAreSet = useRef(false);

  useEffect(() => {
    if (!eventsAreSet.current) {
      eventsAreSet.current = true;
      flickity.current.on("staticClick", (e, p, cellElement, cellIndex) => {
        if (!cellElement) {
          return;
        }

        // Photoswipe functions
        const openPhotoSwipe = () => {
          const pswpElement = document.querySelectorAll(".pswp")[0];

          const items = photoIds.map((p, i) => {
            return {
              src: `https://i.simpalsmedia.com/999.md/BoardImages/900x900/${
                p.url.split("?")[0]
              }`,
              w: 0,
              h: 0,
              pid: i,
            };
          });
          const options = {
            history: false,
            index: cellIndex,
            tapToClose: true,
            galleryPIDs: true,
            maxSpreadZoom: 3,
            shareEl: false,
            fullscreenEl: false,
            bgOpacity: 0.9,
            captionEl: false,
            tapToToggleControls: false,
            mainClass: "pswp--minimal--dark",
            clickToCloseNonZoomable: false,
          };

          const gallery = new PhotoSwipe(
            pswpElement,
            PhotoSwipeUI_Default,
            items,
            options
          );
          gallery.listen("afterChange", (e) => {
            flickity.current.select(gallery.currItem.pid);
          });
          gallery.listen("gettingData", function (index, item) {
            if (item.w < 1 || item.h < 1) {
              // unknown size
              const img = new Image();
              img.onload = function () {
                // will get size after load
                const ratio = this.width / this.height;
                const K = 0.9;
                item.w = Math.max(this.width, K * window.innerWidth); // set image width
                item.h = Math.max(this.height, (K * window.innerWidth) / ratio); // set image height
                gallery.invalidateCurrItems(); // reinit Items
                gallery.updateSize(true); // reinit Items
              };
              img.src = item.src; // let's download image
            }
          });

          gallery.init();
        };

        openPhotoSwipe();
      });
    }
  });

  const data = photoIds.map((id, i) => (
    <img
      data-key={i}
      key={i}
      style={{
        height:
          window.innerWidth > 790 ? 550 : window.innerWidth > 400 ? 300 : 250,
        objectFit: "contain",
        width: "100%",
        // transform: "translateX(0)",
      }}
      data-flickity-lazyload-src={`https://i.simpalsmedia.com/999.md/BoardImages/900x900/${
        id.url.split("?")[0]
      }`}
      alt="img"
      className="img-fluid m-auto mr-3 fimg "
    />
  ));

  return (
    <>
      {data.length ? (
        <FlickitySlider
          data={data}
          flickity={flickity}
          options={
            {
              // fullscreen: true,
              // draggable: false,
            }
          }
        ></FlickitySlider>
      ) : (
        ""
      )}
      <div class="pswp" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="pswp__bg"></div>
        <div class="pswp__scroll-wrap">
          <div class="pswp__container">
            <div class="pswp__item"></div>
            <div class="pswp__item"></div>
            <div class="pswp__item"></div>
          </div>

          <div class="pswp__ui pswp__ui--hidden">
            <div class="pswp__top-bar">
              <div class="pswp__counter"></div>

              <button
                class="pswp__button pswp__button--close"
                title="Close (Esc)"
              ></button>

              <button
                class="pswp__button pswp__button--share"
                title="Share"
              ></button>

              <button
                class="pswp__button pswp__button--fs"
                title="Toggle fullscreen"
              ></button>

              <button
                class="pswp__button pswp__button--zoom"
                title="Zoom in/out"
              ></button>

              <div class="pswp__preloader">
                <div class="pswp__preloader__icn">
                  <div class="pswp__preloader__cut">
                    <div class="pswp__preloader__donut"></div>
                  </div>
                </div>
              </div>
            </div>

            <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
              <div class="pswp__share-tooltip"></div>
            </div>

            <button
              class="pswp__button pswp__button--arrow--left"
              title="Previous (arrow left)"
            ></button>

            <button
              class="pswp__button pswp__button--arrow--right"
              title="Next (arrow right)"
            ></button>

            <div class="pswp__caption">
              <div class="pswp__caption__center"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PropertyPagePhotos;

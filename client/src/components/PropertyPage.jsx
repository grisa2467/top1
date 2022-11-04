import React, { useEffect, useState } from 'react'
import SanitizedHTML from 'react-sanitized-html'
import { ReactComponent as MapPinIcon } from '../assets/icons/awesome-map-marker-alt.svg'
import { ReactComponent as TelIcon } from '../assets/icons/primary-telephone.svg'
import { ReactComponent as AddIcon } from '../assets/icons/avatar-placeholder.svg'
import { ReactComponent as Viber } from '../assets/icons/viber.svg'
import { ReactComponent as Whatsapp } from '../assets/icons/whatsapp.svg'
import { createRef } from 'react'
import { fetchProperty } from '../serverApi'
import { Link } from 'react-router-dom'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import ContactForViewingForm from './ContactForViewingForm'
import SimilarOffers from './SimilarOffers'
import Icon from './Icon'
import PropertyPagePhotos from './PropertyPagePhotos'
import { useCallback } from 'react'
const mouseClickEvents = ['mousedown', 'click', 'mouseup']
const touchEvents = ['touchstart', 'touchend']
function simulateMouseClick (element) {
  mouseClickEvents.forEach(mouseEventType =>
    element.dispatchEvent(
      new MouseEvent(mouseEventType, {
        view: window,
        bubbles: true,
        cancelable: true,
        buttons: 1
      })
    )
  )
  const touchObj = new Touch({
    identifier: Date.now(),
    target: element,
    clientX: 1,
    clientY: 1,
    radiusX: 2.5,
    radiusY: 2.5,
    rotationAngle: 10,
    force: 0.5
  })

  touchEvents.forEach(touchEventType =>
    element.dispatchEvent(
      new TouchEvent(touchEventType, {
        view: window,
        bubbles: true,
        cancelable: true,
        touches: [touchObj],
        targetTouches: [],
        changedTouches: [touchObj],
        shiftKey: true
      })
    )
  )
}

const PropertyPage = ({ match, location, ...props }) => {
  const { t } = useTranslation()
  const [property, setProperty] = useState(null)
  const [stickyHeight, setStickyHeight] = useState(200)
  const [status, setStatus] = useState('idle')
  const sticky = createRef(null)
  // const flickity = useRef(null);
  const zoom = useRef(false)
  const eventsAreSet = useRef(false)

  const getProperty = useCallback(async () => {
    setStatus('loading')
    const _p = await fetchProperty(match.params.id)
    setProperty(_p)

    setStatus('loaded')
  }, [match.params.id])

  useEffect(() => {
    window.scrollTo(0, 0)
    getProperty()
  }, [getProperty])

  useEffect(() => {
    if (sticky.current) {
      setStickyHeight(sticky.current.offsetHeight)
      setStatus('loaded')
    }
  }, [sticky])

  if (status !== 'loaded') {
    return (
      <div className='is-loading'>
        <div className='loader-bg'>
          <div className='loader'></div>
        </div>
      </div>
    )
  }

  const {
    street,
    houseNr,
    city,
    sector,
    sectorId,
    details,
    utilities,
    price,
    oldPrice,
    agent,
    offerTypeId,
    photoIds,
    description,
    title,
    ...params
  } = property
  // if (flickity.current && !eventsAreSet.current) {
  //   flickity.current.on("ready", (e) => {
  //     flickity.current.on("fullscreenChange", (e) => {
  //       [...document.querySelectorAll(".react-transform-element")].forEach(
  //         (i) => {
  //           simulateMouseClick(i);
  //           // i.style.transform = "translate(0,0) scale(1)";
  //         }
  //       );
  //     });
  //   });
  //   flickity.current.on("lazyLoad", (e) => {
  //     [...document.querySelectorAll(".react-transform-element")].forEach(
  //       (i) => {
  //         simulateMouseClick(i);
  //         // i.style.transform = "translate(0,0) scale(1)";
  //       }
  //     );
  //   });
  //   eventsAreSet.current = true;
  // }
  const color = offerTypeId === 5 ? 'sell-color' : 'rent-color'
  // const data = photoIds.map((img, i) => (
  //   <TransformWrapper
  //     reset={{ disabled: false }}
  //     key={i}
  //     positionY={500}
  //     defaultPositionX={0}
  //     positionX={0}
  //     doubleClick={{ mode: "reset" }}
  //     onPinchingStop={(e) => {}}
  //     onPanning={(e) => {
  //       console.log("paning");
  //     }}
  //     pan={{
  //       disabled: true,
  //     }}
  //     options={{
  //       // transformEnabled: false,
  //       minPositionX: 0,
  //       maxPositionX: 0,
  //       centerContent: true,
  //     }}
  //   >
  //     {({ setPositionX, setPositionY }) => {
  //       // setPositionX(0);
  //       // setPositionY(0);
  //       return (
  //         <TransformComponent>
  //           <img
  //             onTouchStart={(e) => {
  //               zoom.current = true;
  //               console.log("start");
  //             }}
  //             onTouchEnd={(e) => {
  //               if (zoom.current) flickity.current.toggleFullscreen();
  //               console.log("end");
  //             }}
  //             onTouchMove={(e) => {
  //               zoom.current = false;
  //               console.log("moving");
  //             }}
  //             style={{
  //               height:
  //                 window.innerWidth > 790
  //                   ? 550
  //                   : window.innerWidth > 400
  //                   ? 300
  //                   : 250,
  //               objectFit: "contain",
  //               // transform: "translateX(0)",
  //             }}
  //             data-flickity-lazyload-src={`https://i.simpalsmedia.com/999.md/BoardImages/900x900/${
  //               img.url.split("?")[0]
  //             }`}
  //             alt="img"
  //             // onClick={() => console.log(flickity.current)}
  //             // onClickCapture={() => console.log("sda")}
  //             // onclick
  //             className="img-fluid m-auto fimg "
  //           />
  //         </TransformComponent>
  //       );
  //     }}
  //   </TransformWrapper>
  // ));

  return (
    <div>
      {/* <MetaTags>
        <title>Top Estate - {title}</title>
        <meta property="og:title" content={`Top Estate - ${title}`}></meta>
        <meta
          property="og:image"
          content={
            photoIds.length
              ? `https://i.simpalsmedia.com/999.md/BoardImages/900x900/${
                  photoIds[0].url.split("?")[0]
                }`
              : "https://pngimg.com/uploads/house/house_PNG57.png"
          }
        ></meta>
        <meta
          property="og:image:secure"
          content={
            photoIds.length
              ? `https://i.simpalsmedia.com/999.md/BoardImages/900x900/${
                  photoIds[0].url.split("?")[0]
                }`
              : "https://pngimg.com/uploads/house/house_PNG57.png"
          }
        ></meta>
        <meta
          property="og:url"
          content={`https://topestate.md/property/${match.params.id}`}
        />
      </MetaTags> */}
      <div className='container my-5'>
        <div className='py-2'>
          {location.state && location.state.from && (
            <Link
              to={{
                ...location.state.from,
                state: {
                  fromId: match.params.id
                }
              }}
            >
              {`< ${t('backToResults')}`}
            </Link>
          )}
        </div>
        <div className='row'>
          <div className='col-xl-9 col-lg-8'>
            <div className='mb-3'>
              <h2>{title}</h2>
            </div>
            <div className='mb-3'>
              {/* {data.length ? (
                <FlickitySlider
                  data={data}
                  flickity={flickity}
                  options={{
                    fullscreen: true,
                    // draggable: false,
                  }}
                ></FlickitySlider>
              ) : (
                ""
              )} */}
              <PropertyPagePhotos photoIds={photoIds} />
            </div>
            <div className='d-flex justify-content-between mt-5'>
              <div>
                <MapPinIcon height={27} />
                {`${street} ${houseNr}${street ? ',' : ''} ${sector}, ${city}`}
              </div>
              {/* <div>Social media</div> */}
            </div>
            <div className='d-lg-none mt-3'>
              <div className='py-4 font-size-small'>
                <div className='d-flex'>
                  <span className='pr-3 font-weight-bold text-nowrap'>ID</span>
                  <span
                    className='overflow-hidden flex-grow-1 d-inline'
                    style={{ letterSpacing: 3 }}
                  >
                    ..........................................................................................................................................................
                  </span>
                  <span className='pl-3 text-nowrap'>{property.id}</span>
                </div>
                {details.map((d, i) => {
                  if (d.id === 203) return <></>
                  const isTooLong =
                    d.name.length + d.value.length > 32 &&
                    window.innerWidth < 350
                  return (
                    <div
                      key={i}
                      className={`d-flex ${isTooLong ? 'flex-column' : ''}`}
                    >
                      <span className='pr-3 font-weight-bold text-nowrap'>
                        {d.name}
                      </span>
                      {!isTooLong && (
                        <span
                          className='overflow-hidden flex-grow-1 d-inline'
                          style={{ letterSpacing: 3 }}
                        >
                          ..........................................................................................................................................................
                        </span>
                      )}

                      <span className='pl-3 text-nowrap'>{d.value}</span>
                    </div>
                  )
                })}
              </div>
              <div
                className={`py-3 text-center text-white ${color}`}
                style={{ fontSize: '1.25em' }}
              >
                {t('price')}:{' '}
                {oldPrice ? (
                  <span className='text-decoration-line-through mr-3'>{`${oldPrice
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}</span>
                ) : (
                  ''
                )}
                {`${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`} €
              </div>
              <div className='py-4 d-flex'>
                <div
                  className=' overflow-hidden border border-primary align-self-center
                   '
                  style={{ borderRadius: 5 }}
                >
                  {agent.image ? (
                    <img
                      src={`https://i.simpalsmedia.com/999.md/BoardImages/320x240/${agent.image}`}
                      alt=''
                      style={{
                        height: 100,
                        width: 100,
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <AddIcon width='100' height='100' />
                  )}
                </div>
                <div className='flex-column flex-grow-1 ml-3'>
                  <div>
                    <Link to={`/agent/${agent.id}`}>
                      <span className='font-weight-bold'>
                        {agent.givenName} {agent.familyName}
                      </span>
                    </Link>
                  </div>
                  <div className='mt-2'>
                    <TelIcon width={20} height={20} />
                    <a href={`tel:+${agent.tel}`}>
                      <span className='ml-2'>
                        {`+373 ${agent.tel.substring(3)}`}
                      </span>
                    </a>
                  </div>
                  <div className='mt-2'>
                    <a
                      href={`viber://chat?number=%2B${agent.tel}`}
                      className=''
                    >
                      <Viber width={25} height={25} />
                      <span className='ml-2'>Scrie-ne pe Viber</span>
                    </a>
                  </div>

                  <div className='mt-2'>
                    <Whatsapp width={25} height={25} />
                    <a className='ml-2' href={`https://wa.me/${agent.tel}`}>
                      Whatsapp
                    </a>
                  </div>
                </div>
              </div>
              {/* {contactForViewingForm} */}
              <ContactForViewingForm />
            </div>
            <div className='mt-4'>
              <h2>{t('description')}</h2>
              <SanitizedHTML
                allowedAttributes={{
                  span: ['style'],
                  div: ['style'],
                  p: ['style'],
                  a: ['href', 'style']
                }}
                html={description}
              />

              <p className='mt-3 font-weight-bold'>
                {t('price')}: €
                {`${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}
              </p>
            </div>

            <div className=''>
              <h2>{t('additional')}</h2>

              <div className='row'>
                {utilities.map((utility, i) => (
                  <div key={i} className='col-md-4 col-sm-6'>
                    {/* <FilledCheckbox /> */}
                    <Icon
                      pathFromIcons={`additional/${utility.id - 288}`}
                      style={{ width: 20, height: 20 }}
                    />
                    <span className='ml-2'>{utility.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            className='d-none d-lg-block col-xl-3 col-lg-4 position-lg-sticky '
            style={{ top: '5%', height: stickyHeight }}
          >
            <div
              className='border-primary border'
              ref={sticky}
              style={{ borderRadius: 5 }}
            >
              <div className='p-3 d-flex align-items-center'>
                <div
                  className=' overflow-hidden border border-primary'
                  style={{ borderRadius: 5 }}
                >
                  {agent.image ? (
                    <img
                      src={`https://i.simpalsmedia.com/999.md/BoardImages/320x240/${agent.image}`}
                      alt=''
                      style={{
                        height: 64,
                        width: 64,
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <AddIcon width='64' height='64' />
                  )}
                </div>

                <div className='ml-3 text-primary'>
                  <div>
                    <Link to={`/agent/${agent.id}`}>
                      <span className='font-weight-bold'>
                        {agent.givenName} {agent.familyName}
                      </span>
                    </Link>
                  </div>
                  <div className='mt-2'>
                    <TelIcon width={20} height={20} />
                    <a href={`tel:+${agent.tel}`}>
                      <span className='ml-2'>
                        {`+373 ${agent.tel.substring(3)}`}
                      </span>
                    </a>
                  </div>
                  <div className='mt-2'>
                    <a
                      href={`viber://chat?number=%2B${agent.tel}`}
                      className=''
                    >
                      <Viber width={25} height={25} />
                      <span className='ml-2'>Viber</span>
                    </a>
                  </div>
                  <div className='mt-2'>
                    <Whatsapp width={25} height={25} />
                    <a className='ml-2' href={`https://wa.me/${agent.tel}`}>
                      Whatsapp
                    </a>
                  </div>
                </div>
              </div>

              <div
                className={`py-3 text-center text-white ${color}`}
                style={{ fontSize: '1.25em' }}
              >
                {t('price')}:{' '}
                {oldPrice ? (
                  <span className='text-decoration-line-through mr-3'>{`${oldPrice
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}</span>
                ) : (
                  ''
                )}
                {`${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`} €
              </div>

              <div className='py-4 px-3 font-size-small'>
                <div className='d-flex'>
                  <span className='pr-3 font-weight-bold text-nowrap'>ID</span>
                  <span
                    className='overflow-hidden flex-grow-1 d-inline'
                    style={{ letterSpacing: 3 }}
                  >
                    ..........................................................................................................................................................
                  </span>
                  <span className='pl-3 text-nowrap'>{property.id}</span>
                </div>
                {details.map((d, i) => {
                  if (d.id === 203) return <></>
                  const isTooLong = d.name.length + d.value.length > 32
                  return (
                    <div
                      key={i}
                      className={`d-flex ${isTooLong ? 'flex-column' : ''}`}
                    >
                      <span className='pr-3 font-weight-bold text-nowrap'>
                        {d.name}
                      </span>
                      {!isTooLong && (
                        <span
                          className='overflow-hidden flex-grow-1 d-inline'
                          style={{ letterSpacing: 3 }}
                        >
                          ..........................................................................................................................................................
                        </span>
                      )}

                      <span className='pl-3 text-nowrap'>{d.value}</span>
                    </div>
                  )
                })}
              </div>
              <div className='px-3'></div>
              <ContactForViewingForm />
            </div>
          </div>
        </div>
        {/* {property.mapLocation && (
          <div className="mt-4">
            <div className="mt-5">
              <iframe
                title="map-location"
                allow="geolocation"
                width="100%"
                height="600"
                frameBorder="0"
                src={`https://map.md/ro/?embed=1#17/${property.mapLocation.lat}/${property.mapLocation.long}/0/0`}
              ></iframe>
            </div>
          </div>
        )} */}
        <div className='mt-4'>
          <iframe
            src='https://creditemaibune.md/calculator'
            frameBorder='0'
            width='100%'
            height='400'
          ></iframe>
        </div>
      </div>
      <div className='mt-5 py-5' style={{ backgroundColor: '#F9FBFF' }}>
        <SimilarOffers price={price} location={sectorId} />
      </div>
    </div>
  )
}

export default PropertyPage

import { Loader } from "@googlemaps/js-api-loader";

function initContactsMap() {
  const mapContainer = document.querySelector("#contacts-map");
  
  if (!mapContainer) return;
  
  const markers = [
    { lat: 47.02387549096925, lng: 28.85015074132132 },
    { lat: 47.02103102304033, lng: 28.855521935259297 },
  ];

  const loader = new Loader({
    apiKey: "AIzaSyDj3aUSMZkgFEyHrSxgnr5NaViztjFGOj8",
    version: "weekly",
  });

  const myStyles = [
    {
      featureType: "water",
      elementType: "geometry.fill",
      stylers: [
        {
          color: "#d3d3d3",
        },
      ],
    },
    {
      featureType: "transit",
      stylers: [
        {
          color: "#808080",
        },
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [
        {
          visibility: "on",
        },
        {
          color: "#b3b3b3",
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.fill",
      stylers: [
        {
          color: "#ffffff",
        },
      ],
    },
    {
      featureType: "road.local",
      elementType: "geometry.fill",
      stylers: [
        {
          visibility: "on",
        },
        {
          color: "#ffffff",
        },
        {
          weight: 1.8,
        },
      ],
    },
    {
      featureType: "road.local",
      elementType: "geometry.stroke",
      stylers: [
        {
          color: "#d7d7d7",
        },
      ],
    },
    {
      featureType: "poi",
      elementType: "geometry.fill",
      stylers: [
        {
          visibility: "on",
        },
        {
          color: "#ebebeb",
        },
      ],
    },
    {
      featureType: "administrative",
      elementType: "geometry",
      stylers: [
        {
          color: "#a7a7a7",
        },
      ],
    },
    {
      featureType: "road.arterial",
      elementType: "geometry.fill",
      stylers: [
        {
          color: "#ffffff",
        },
      ],
    },
    {
      featureType: "road.arterial",
      elementType: "geometry.fill",
      stylers: [
        {
          color: "#ffffff",
        },
      ],
    },
    {
      featureType: "landscape",
      elementType: "geometry.fill",
      stylers: [
        {
          visibility: "on",
        },
        {
          color: "#efefef",
        },
      ],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#696969",
        },
      ],
    },
    {
      featureType: "administrative",
      elementType: "labels.text.fill",
      stylers: [
        {
          visibility: "on",
        },
        {
          color: "#737373",
        },
      ],
    },
    {
      featureType: "poi",
      elementType: "labels.icon",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "road.arterial",
      elementType: "geometry.stroke",
      stylers: [
        {
          color: "#d6d6d6",
        },
      ],
    },
    {
      featureType: "road",
      elementType: "labels.icon",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {},
    {
      featureType: "poi",
      elementType: "geometry.fill",
      stylers: [
        {
          color: "#dadada",
        },
      ],
    },
  ];

  loader.load().then(() => {
    const map = new google.maps.Map(mapContainer, {
      center: { lat: 47.02288770201703, lng: 28.85333704285832 },
      zoom: 16,
      styles: myStyles,
    });

    const markerIcon = {
      url: "https://aurum.md/images/icons/marker.png",
      scaledSize: new google.maps.Size(50, 50),
    };

    markers.forEach((marker) => {
      new google.maps.Marker({
        position: marker,
        map: map,
        icon: markerIcon,
      });
    });
  });
}

initContactsMap();

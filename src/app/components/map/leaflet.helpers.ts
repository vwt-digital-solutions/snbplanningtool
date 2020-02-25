import { Layer } from '../../models/layer';
import * as L from 'leaflet';
import * as moment from 'moment';

function createClusterIcon(cluster: any): L.divIcon {
  const count = cluster.getChildCount();
  const size = (count + '').length;

  const iconSizes = {
    1: [52, 53],
    2: [55, 56],
    3: [65, 66],
    4: [77, 78],
    5: [89, 90]
  };

  return L.divIcon({
    html: count,
    iconUrl: `../../assets/images/clusters/m${size}.png`,
    className: `cluster size-${size}`,
    iconSize: iconSizes[size]
  });
}

function getCorrespondingIconUrl(layer: Layer): string {
  const iconPath = '../../../assets/images';
  const iconUrl = layer === 'cars' ?
    `${iconPath}/car-location.png` :
    `${iconPath}/work-location.png`;

  return iconUrl;
}

function featureUrgencyClass(feature: any): string {
  const shouldResolveTime = feature.properties.resolve_before_timestamp;
  const then = moment(shouldResolveTime, moment.ISO_8601);

  if (feature.properties.status.toLowerCase() !== 'te plannen'.toLowerCase()) {
    return '';
  }

  if (then.isValid()) {
    if (moment().add(1, 'days').isBefore(then)) {
      return 'on-schedule';
    } else {
      return 'urgent';
    }
  }
  
  return '';
}

function createWorkMarker(feature: any, options: any, coordinates: number[]): L.marker {
  const iconUrl = getCorrespondingIconUrl('work');
  const icon = new L.divIcon({
    html: `<div style="background-image: url(${iconUrl})"></div>`,
    className: `div-icon work-marker ${featureUrgencyClass(feature)}`,
    ...options.icon
  });

  const marker = L.marker(L.latLng(coordinates[1], coordinates[0]), {
    ...options.marker,
    icon
  });

  const popupOptions = {
    maxWidth: 600,
    minWidth: 400,
  };
  marker.bindPopup(createWorkPopup(feature), popupOptions);

  return marker;
}

function createCarMarker(feature: any, options: any, coordinates: number[]): L.marker {
  const iconUrl = getCorrespondingIconUrl('cars');
  let icon;

  if (feature.properties && feature.properties.driver_name) {
    icon = new L.divIcon({
      html: `
          <div style="background-image: url(${iconUrl})">
            <span>${ feature.properties.driver_name}</span>
          </div>
        `,
      className: 'div-icon',
      ...options.icon
    });
  } else {
    icon = new L.Icon({
      ...options.icon,
      iconUrl
    });
  }

  const marker = L.marker(L.latLng(coordinates[1], coordinates[0]), {
    ...options.marker,
    icon
  });

  const popupOptions = {
    maxWidth: 300,
    minWidth: 200,
  };
  marker.bindPopup(createCarPopup(feature), popupOptions);

  return marker;
}

function addResetZoomButton(): L.Control {
  const control = new L.Control({ position: 'bottomright' });
  control.onAdd = (map: L.map) => {
    const resetZoom = L.DomUtil.create('a', 'map-ui-element map-btn');
    resetZoom.innerHTML = '<i class="fas fa-home"></i>';

    L.DomEvent
      .disableClickPropagation(resetZoom)
      .addListener(resetZoom, 'click', () => {
        map.setView(map.options.center, map.options.zoom);
      }, resetZoom);
    return resetZoom;
  };
  return control;
}

function addZoomButtons(): L.Control {
  const control = new L.Control({ position: 'bottomright' });
  control.onAdd = (map: L.map) => {
    const wrapper = L.DomUtil.create('div', 'map-ui-element zoom-btns');
    const zoomIn = L.DomUtil.create('div', 'map-btn');
    const zoomOut = L.DomUtil.create('div', 'map-btn');
    zoomIn.innerHTML = '<i class="fas fa-plus"></i>';
    zoomOut.innerHTML = '<i class="fas fa-minus"></i>';

    L.DomEvent.disableClickPropagation(wrapper);

    L.DomEvent.addListener(zoomIn, 'click', () => {
      map.setZoom(map.getZoom() + 1);
    }, zoomIn);
    L.DomEvent.addListener(zoomOut, 'click', () => {
      map.setZoom(map.getZoom() - 1);
    }, zoomOut);

    wrapper.appendChild(zoomIn);
    wrapper.appendChild(zoomOut);

    return wrapper;
  };
  return control;
}

function createCarPopup(feature): string {
  return `
      <div class="row popup-car">
        <div class="col-12 item driver_name">
          <p>Naam bestuurder</p>
          <span>${feature.properties.driver_name || '-'}</span>
        </div>
        <div class="col-12 item driver_skill">
          <p>Rol bestuurder</p>
          <span>${feature.properties.driver_skill || '-'}</span>
        </div>
        <div class="col-12 item license_plate">
          <p>Kentekenplaat</p>
          <div class="license-plate license-nl">
            <span>${feature.properties.license_plate || 'N/B'}</span>
          </div>
        </div>
      </div>`;
}

function createWorkPopup(feature): string {
  const properties = feature.properties;
  let start_time = null;
  let end_time = null;
  let html = [
    `<div class="row popup-work no-gutters">`,
    `<div class="col-12 marker-work-inner">`
  ];

  if ('start_timestamp' in properties) {
    start_time = new Date(properties.start_timestamp).toLocaleString().split(',');
  }

  if ('end_timestamp' in properties) {
    end_time = new Date(properties.end_timestamp).toLocaleString().split(',');
  }

  html.push(`
    <div class="row">
      <div class="col-4 item project_number">
        <p>Projectnummer</p>
        <span> ${properties.project_number || '-'}</span>
      </div>
      <div class="col-4 item task_type">
        <p>Taaktype</p>
        <span> ${properties.task_type || '-'}</span>
      </div>
      <div class="col-4 item status">
        <p>Status</p>
        <span> ${properties.status || '-'}</span>
      </div>
    </div>

    <div class="row">
      <div class="col-12 item description">
        <p>Beschrijving</p>
        <span> ${properties.description || '-'}</span>
      </div>
    </div>

    <div class="row">
      <div class="col-6 item date">
        <p>Startdatum</p>
        <span> ${ start_time[0] || 'N/B'}</span>
        <span> ${ start_time[1] || 'N/B'}</span>
      </div>
      <div class="col-6 item date">
        <p>Einddatum</p>
        <span> ${ end_time[0] || '-'}</span>
        <span> ${ end_time[1] || '-'}</span>
      </div>
    </div>`);

  if (properties.city || properties.zip || properties.street) {
    const locationProperties = ['<div class="row">'];

    // Add city
    locationProperties.push(`
        <div class="col-4 item city">
          <p>Plaats</p>
          <span> ${properties.city || 'N/B'}</span>
        </div>`);

    // If exists add zip
    if (properties.zip) {
      locationProperties.push(`
          <div class="col-4 item zip">
            <p>Postcode</p>
            <span> ${properties.zip}</span>
          </div>`);
    }

    // If exists add street
    if (properties.street) {
      locationProperties.push(`
          <div class="col-4 item street">
            <p>Straat</p>
            <span> ${properties.street}</span>
          </div>`);
    }
    locationProperties.push('</div>');

    // If exists add employee name
    if (properties.employee_name) {
      locationProperties.push(`
        <div class="row">
          <div class="col-12 item employee_name">
            <p>Naam werknemer</p>
            <span> ${properties.employee_name}</span>
          </div>
        </div>`);
    }

    html = html.concat(locationProperties);
  }

  html.push('</div></div>');
  return html.join('');
}

export {
  createClusterIcon,
  createCarMarker,
  createWorkMarker,
  addResetZoomButton,
  addZoomButtons
};

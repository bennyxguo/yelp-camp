mapboxgl.accessToken = mapBoxToken
var map = new mapboxgl.Map({
  container: 'map', // container ID
  // style: 'mapbox://styles/mapbox/streets-v11', // Street Style
  // style: 'mapbox://styles/mapbox/outdoors-v11', // Street Style
  // style: 'mapbox://styles/mapbox/light-v10', // Light Style
  style: 'mapbox://styles/mapbox/dark-v10', // Dark Style
  center: campgroundData.geometry.coordinates,
  zoom: 9 // starting zoom
})

var size = 100

// This implements `StyleImageInterface`
// to draw a pulsing dot icon on the map.
var pulsingDot = {
  width: size,
  height: size,
  data: new Uint8Array(size * size * 4),

  // When the layer is added to the map,
  // get the rendering context for the map canvas.
  onAdd: function () {
    var canvas = document.createElement('canvas')
    canvas.width = this.width
    canvas.height = this.height
    this.context = canvas.getContext('2d')
  },

  // Call once before every frame where the icon will be used.
  render: function () {
    var duration = 1000
    var t = (performance.now() % duration) / duration

    var radius = (size / 2) * 0.3
    var outerRadius = (size / 2) * 0.7 * t + radius
    var context = this.context

    // Draw the outer circle.
    context.clearRect(0, 0, this.width, this.height)
    context.beginPath()
    context.arc(this.width / 2, this.height / 2, outerRadius, 0, Math.PI * 2)
    context.fillStyle = 'rgba(25, 68, 147,' + (1 - t) + ')'
    context.fill()

    // Draw the inner circle.
    context.beginPath()
    context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2)
    context.fillStyle = 'rgba(25, 68, 147, 1)'
    context.strokeStyle = 'white'
    context.lineWidth = 2 + 4 * (1 - t)
    context.fill()
    context.stroke()

    // Update this image's data with data from the canvas.
    this.data = context.getImageData(0, 0, this.width, this.height).data

    // Continuously repaint the map, resulting
    // in the smooth animation of the dot.
    map.triggerRepaint()

    // Return `true` to let the map know that the image was updated.
    return true
  }
}

map.on('load', function () {
  map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 })

  map.addSource('dot-point', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: campgroundData.geometry.coordinates // icon position [lng, lat]
          }
        }
      ]
    }
  })

  map.addLayer({
    id: 'layer-with-pulsing-dot',
    type: 'symbol',
    source: 'dot-point',
    layout: {
      'icon-image': 'pulsing-dot'
    }
  })

  map.on('click', 'layer-with-pulsing-dot', function (e) {
    new mapboxgl.Popup({ offset: 25 })
      .setLngLat(campgroundData.geometry.coordinates)
      .setHTML(
        `<h5>${campgroundData.title}</h5><p>${campgroundData.location}</p>`
      )
      .addTo(map)
  })

  // Add zoom and rotation controls to the map.
  map.addControl(new mapboxgl.NavigationControl())
})

// The buttons to start & stop stream and to capture the image
var btnStart = document.getElementById( "btn-start" );
var btnStop = document.getElementById( "btn-stop" );
var btnCapture = document.getElementById( "btn-capture" );

// The stream & capture
var stream = document.getElementById( "stream" );
var capture = document.getElementById( "capture" );
var snapshot = document.getElementById( "snapshot" );
// The video stream
var cameraStream = null;

// Attach listeners
btnStart.addEventListener( "click", startStreaming );



function startStreaming() {
  stream.style.display = "block"
  document.getElementById('layer-capture').innerHTML= ""
  var mediaSupport = 'mediaDevices' in navigator;

  if( mediaSupport && null == cameraStream ) {

    navigator.mediaDevices.getUserMedia( { video: true } )
    .then( function( mediaStream ) {

      cameraStream = mediaStream;

      stream.srcObject = mediaStream;

      stream.play();
    })
    .catch( function( err ) {

      console.log( "Unable to access camera: " + err );
    });
  }
  else {

    alert( 'Your browser does not support media devices.' );

    return;
  }
}

function stopStreaming() {

  if( null != cameraStream ) {

    var track = cameraStream.getTracks()[ 0 ];

    track.stop();
    stream.load();

    cameraStream = null;
  }
}


const imageUpload = document.getElementById('imageUpload')

Promise.all([
  faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
  faceapi.nets.ssdMobilenetv1.loadFromUri('./models')
]).then(start)

async function start() {
  const container = document.createElement('div')
  container.style.position = 'relative'
  document.body.append(container)
  const labeledFaceDescriptors = await loadLabeledImages()
  const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6)
  let image
  let canvas
 
  

btnCapture.addEventListener( "click",async () => {
    if( null != cameraStream ) {

    var ctx = capture.getContext( '2d' );
    var img = new Image();

    ctx.drawImage( stream, 0, 0, capture.width, capture.height );

    // img.src   = capture.toDataURL( "image/png" );
    // img.width = 240;

    // snapshot.innerHTML = '';

    // snapshot.appendChild( img );
  
    var data  = new FormData();
var dataURI = capture.toDataURL( "image/png" );
var imageData   = dataURItoBlob( dataURI );
var layer = document.getElementById('layer-capture')

    if (image) image.remove()
    if (canvas) canvas.remove()
    image = await faceapi.bufferToImage(imageData)
    container.append(image)
    canvas = faceapi.createCanvasFromMedia(image)
    container.append(canvas)
    layer.append(container)
    const displaySize = { width: image.width, height: image.height }
    faceapi.matchDimensions(canvas, displaySize)
    const detections = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))
    results.forEach((result, i) => {
      const box = resizedDetections[i].detection.box
      const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString().replace(/\([^]+$/, '') })
      document.getElementById('nip').innerHTML = "NIM&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;3111810251"
      document.getElementById('nama').innerHTML = "Nama&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: "+result.toString().replace(/\([^]+$/, '')
      document.getElementById('jabatan').innerHTML = "Jabatan&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: Staff"
      drawBox.draw(canvas)
     
    })
    stopStreaming()
    stream.style.display = "none"
}
})
 

}

function dataURItoBlob( dataURI ) {

  var byteString = atob( dataURI.split( ',' )[ 1 ] );
  var mimeString = dataURI.split( ',' )[ 0 ].split( ':' )[ 1 ].split( ';' )[ 0 ];
  
  var buffer  = new ArrayBuffer( byteString.length );
  var data  = new DataView( buffer );
  
  for( var i = 0; i < byteString.length; i++ ) {
  
    data.setUint8( i, byteString.charCodeAt( i ) );
  }
  
  return new Blob( [ buffer ], { type: mimeString } );
}

function loadLabeledImages() {
  const labels = ['Muhammad Husen', 'Affan Ghofar', 'Tengku Yoga', 'Galuh Eka', 'Salwa Zanjabila']
  return Promise.all(
    labels.map(async label => {
      const descriptions = []
      for (let i = 1; i <= 2; i++) {
        const img = await faceapi.fetchImage(`./labeled_images/${label}/${i}.jpg`)
        const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
        descriptions.push(detections.descriptor)
      }

      return new faceapi.LabeledFaceDescriptors(label, descriptions)
    })
  )
}

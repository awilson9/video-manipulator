import React from 'react';
import THREE from 'three';
var ReactTHREE = require('react-three');


var geometry = new THREE.BoxGeometry( 350, 350, 400 );

const { Renderer, Scene, Mesh, Object3d, PerspectiveCamera } = ReactTHREE;

export default class VideoPreview extends React.Component{
	
	constructor(props){
		super(props);
      	this.videos = [];
      	this.videoImageContexts = [];
      	this.videoTextures = [];
      	this.createVideoTexture("videos/video.mov", 1020, 1258);
      	this.createVideoTexture("videos/video2.mov", 1024, 1060);
		this.uniforms = {
        color: { type: "c", value: new THREE.Color( 0xff0000 ) }, // material is "red"
   		texture: {type: "t", value:this.videoTextures[0]},
   		texture2: {type: "t", value:this.videoTextures[1]},
   		time: {type:"f", value:this.time}
    	};
     this.material = new THREE.ShaderMaterial({
        uniforms        : this.uniforms,
        vertexShader    : $('#vertex_shader').text(),
        fragmentShader  : $('#fragment_shader').text(),
    });
     this.animate = () => {
     for(var i=0;i<this.videos.length; i++){
     if (this.videos[i].readyState === this.videos[i].HAVE_ENOUGH_DATA) {
            this.videoImageContexts[i].drawImage(this.videos[i], 0, 0);
            if (this.videoTextures[i]) {
                this.videoTextures[i].needsUpdate = true;
            }
        }
    }
        this.uniforms.time.value += .1;
      this.frameId = requestAnimationFrame(this.animate)
    }
	}
	createVideoTexture(src, height, width){
		 // Create the video element
        let video = document.createElement( 'video' );
        // Need to set crossOrigin to anonymous for remote videos
        video.crossOrigin = "anonymous";
        video.src = src;
        video.loop = true;
        video.load();
        video.play();
 
        // Create canvas element which will hold the current video image (1 image/frame)
        let videoImage = document.createElement( 'canvas' );
        videoImage.width = width;
        videoImage.height = height;
 
        // Create blank rect if no image
        let videoImageContext = videoImage.getContext( '2d' );
        videoImageContext.fillStyle = '#000000';
        videoImageContext.fillRect( 0, 0, videoImage.width, videoImage.height );
 
        // Create Three texture with canvas as map
        let videoTexture = new THREE.Texture( videoImage );
        videoTexture.minFilter = THREE.LinearFilter;
        videoTexture.magFilter = THREE.LinearFilter;
 		   this.time = 0.1;
        // Keep these elements in memory
        this.videos.push(video);
        this.videoImageContexts.push(videoImageContext);
        this.videoTextures.push(videoTexture);
	}

	componentDidMount(){
		this.animate();
	}
	dragOver(e){
		e.preventDefault();
	}
	dragLeave(e){
		e.preventDefault();
	}
	drop(e){
		e.preventDefault();
		var fileURL = e.dataTransfer.getData("text/plain");
    var playingVideos = this.state.playingVideos;
    playingVideos.push(fileURL);
    createVideoTexture(fileURL);
    this.setState({
      playingVideos:playingVideos
    })
	}
    render() {
    var cameraprops = {position:{x:0, y:0, z: 800}};

    return (
    	<div
    		onDragOver = {(e)=>this.dragOver(e)}
			onDragEnter = {(e)=>this.dragOver(e)}
			onDragLeave = {(e)=>this.dragLeave(e)}
			onDragEnd = {(e)=>this.dragLeave(e)}
			onDrop = {(e)=>this.drop(e)}
    	>
    	<Renderer width={768} height={432} pixelRatio={window.devicePixelRatio} >
        <Scene width={this.props.width} height={this.props.height} camera="maincamera">
            <PerspectiveCamera name="maincamera" {...cameraprops} />
            <Mesh geometry={geometry} material={this.material} />
        </Scene>
    </Renderer>
    </div>
    );
  }
  
}
/*
function shaderstart() { // eslint-disable-line no-unused-vars
  var renderelement = document.getElementById("three-box");

  ReactTHREE.render(<VideoPreview />, renderelement);
}

window.onload = shaderstart;

/*
constructor(props){
		super(props);
		var self = this;
		this.cameraPosition = new THREE.Vector3(0, 0, 250);
		this._onAnimate = () => {
		if (self.video.readyState === self.video.HAVE_ENOUGH_DATA) {
            self.videoImageContext.drawImage(self.video, 0, 0);
            if (self.videoTexture) {
                self.videoTexture.needsUpdate = true;
            }
        }
    		}
		}
	
	componentDidMount() {
       // Create the video element
        let video = document.createElement( 'video' );
        // Need to set crossOrigin to anonymous for remote videos
        video.crossOrigin = "anonymous";
        video.src = "before.mkv";
        video.load();
        video.play();
 
        // Create canvas element which will hold the current video image (1 image/frame)
        let videoImage = document.createElement( 'canvas' );
        videoImage.width = this.props.width;
        videoImage.height = this.props.height;
 
        // Create blank rect if no image
        let videoImageContext = videoImage.getContext( '2d' );
        videoImageContext.fillStyle = '#000000';
        videoImageContext.fillRect( 0, 0, videoImage.width, videoImage.height );
 
        // Create Three texture with canvas as map
        let videoTexture = new THREE.Texture( videoImage );
        videoTexture.minFilter = THREE.LinearFilter;
        videoTexture.magFilter = THREE.LinearFilter;
 
        // Create Three material with our canvas as texture
        // Canvas image is then updated in the _onAnimate() event, on each frame
        let movieMaterial = new THREE.MeshBasicMaterial( { map: videoTexture, overdraw: true, side:THREE.DoubleSide } );
     
        // Keep these elements in memory
        this.video = video;
        this.videoImageContext = videoImageContext;
        this.videoTexture = videoTexture;
 
        this.refs['screenPlane'].material = movieMaterial;
    }
 



render() {
const width = this.props.width; // canvas width
const height = this.props.height; // canvas height

return (
	<React3
  		mainCamera="camera" // this points to the perspectiveCamera which has the name set to "camera" below
  		width={width}
  		height={height}
  		onAnimate={this._onAnimate}
  		>
  		<resources>
  		<texture
            resourceId="texture"
            url="texture.jpg"
            wrapS={THREE.RepeatWrapping}
            wrapT={THREE.RepeatWrapping}
            anisotropy={16}
          />
  		 <meshLambertMaterial
            resourceId="material"
            side={THREE.DoubleSide}
          >
          <textureResource
              resourceId="texture"
            />
            </meshLambertMaterial> 
  		</resources>
  		<scene ref="scene">
  		<perspectiveCamera
          name="camera"
          fov={75}
          aspect={width / height}
          near={0.1}
          far={1000}

          position={this.cameraPosition}
        />
                    <mesh
                        ref="screenPlane"
                        name="screenPlane"
                    >
                        <planeBufferGeometry
                            width={this.props.width}
                            height={this.props.height}
                        />
                        <materialResource
              			resourceId="material"
            		/>
                        <meshLambertMaterial color={'#ffffff'} />
                    </mesh>
                </scene>
  	</React3>);
}
*/
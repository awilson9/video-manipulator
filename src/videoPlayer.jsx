import React from 'react';

import ActiveTextures from './activeTextures.jsx';

const THREE = require('three');
const ReactTHREE = require('react-three');
const geometry = new THREE.BoxGeometry( 25, 25, 1 );

const { Renderer, Scene, Mesh, Object3d, PerspectiveCamera } = ReactTHREE;

export default class VideoPreview extends React.Component{
	
	constructor(props) {
		super(props);
		this.videos = [];
		this.videoImageContexts = [];
		this.videoTextures = [];
		const numVideos = 0;
		this.uniforms = {
			color: { type: 'c', value: new THREE.Color( 0xffffff ) }, 
			time: { type:'f', value: this.time }
		};
	
		const material = new THREE.ShaderMaterial({
			uniforms: this.uniforms,
			vertexShader: $('#vertex_shader').text(),
			fragmentShader: $('#fragment_shader_' + 1).text(),
		});
	
		const position = { x: 0, y: 0, z: 27 };
		this.state = {
			numVideos: numVideos, 
			material:material, 
			targetColor:{ r: 0, g: 200, b: 102 }, 
			currColor: {r: 255, g: 0, b: 0 }, 
			updateC: true, 
			imgTextNum: 0, 
			position: position
		};
	
		this.animate = () => {
			for (let i=0; i < this.videos.length; i++) {
				if (this.videos[i].readyState === this.videos[i].HAVE_ENOUGH_DATA) {
					const canvasWidth = this.videoImageContexts[i].canvas.clientWidth;
					const canvasHeight = this.videoImageContexts[i].canvas.clientHeight;
					this.videoImageContexts[i].translate( -canvasWidth / 2, - canvasWidth / 2);
					this.videoImageContexts[i].drawImage(this.videos[i], 0, 0);
					if (this.videoTextures[i]) {
						this.videoTextures[i].needsUpdate = true;
					}
				}
			}
	
			this.uniforms.time.value += .1; 
			this.uniforms.numVideos = this.state.numVideos;
			this.state.material.needsUpdate = true;
			if (this.state.updateC) this.updateColor();
			this.frameId = requestAnimationFrame(this.animate)
		}
	}

	updateColor() {
		let r = this.state.currColor.r;
		let g = this.state.currColor.g;
		let b = this.state.currColor.b;
		if (this.state.currColor.r > this.state.targetColor.r) {
			r = this.state.currColor.r-1;
		}
		else if (this.state.currColor.r < this.state.targetColor.r) {
			r = this.state.currColor.r + 1;
		}
		if(this.state.currColor.g > this.state.targetColor.g) {
			g = this.state.currColor.g - 1;
		}
		else if (this.state.currColor.g < this.state.targetColor.g) {
			g = this.state.currColor.g + 1;
		}
		if (this.state.currColor.b > this.state.targetColor.b) {
			b = this.state.currColor.b - 1;
		}
		else if (this.state.currColor.b < this.state.targetColor.b) {
			b = this.state.currColor.b + 1;
		}
	
		if (this.state.currColor.r === this.state.targetColor.r 
			&& this.state.currColor.g === this.state.targetColor.g
			&& this.state.currColor.b === this.state.targetColor.b) 
		{
			const n_r = Math.round(255*Math.random());
			const n_g = Math.round(255*Math.random());
			const n_b = Math.round(255*Math.random());
			this.setState({
			targetColor:{r:n_r, g:n_g, b:n_b},
			currColor:{r:r, g:g, b:b},
			updateC:true
			});
		} else {
			this.setState({
			currColor:{r:r, g:g, b:b}
			});
		}
		this.uniforms.color = {type:'c', value:new THREE.Color('rgb(' + r + ', ' + g + ', ' + b + ')')};
	}

	createImageTextures(src) {
		const loader = new THREE.TextureLoader();
		for (let i=0; i<src.length; i++) {
			const self = this;
			loader.load(src[i], function(texture) {
				self.uniforms['imgtexture' + self.state.imgTextNum] = { type: 't', value: texture}
				self.setState({
					imgTextNum: self.state.imgTextNum + 1
				});
			});
		}	
	}

	constructImage(src) {
		const image = new Image();
		image.src = src;
		return image;
	}

	createVideoTexture(src) {
		// Create the video element
		let video = $('#' + src)[0];
		video.loop = true;
		video.play();
	
		// Create canvas element which will hold the current video image (1 image/frame)
		let videoImage = document.createElement( 'canvas' );
		videoImage.width = video.videoWidth;
		videoImage.height = video.videoHeight;
 	
		// Create blank rect if no image
		let videoImageContext = videoImage.getContext( '2d' );
		videoImageContext.fillStyle = '#000000';
		videoImageContext.fillRect(0, 0, videoImage.width, videoImage.height);
 	
		// Create Three texture with canvas as map
		let videoTexture = new THREE.Texture( videoImage );
		videoTexture.minFilter = THREE.LinearFilter;
		videoTexture.magFilter = THREE.LinearFilter;
		this.time = 0.1;
		
		// Keep these elements in memory
		this.videos.push(video);
		this.videoImageContexts.push(videoImageContext);
		this.videoTextures.push(videoTexture);
		return videoTexture;
	}

	componentDidMount() {
		this.createImageTextures(['textures/texture0.jpg','textures/texture1.jpg','textures/texture2.jpg','textures/texture3.jpg','textures/texture4.jpg'])
		this.animate();
	}

	dragOver(e) {
		e.preventDefault();
	}

	dragLeave(e) {
		e.preventDefault();
	}

	changeRange() {

	}

	applyTextures(id, index, self) {
		const texture = self.createVideoTexture(id);
		const numVideos = self.state.numVides + 1;
		if(index !== -1) {
			self.uniforms['imgtexture' + index] = {type:'t', value: texture};
		}
		else {
			self.uniforms['texture1'] = {type: 't', value: texture};
		}

		const material = new THREE.ShaderMaterial({
			uniforms: self.uniforms,
			vertexShader: $('#vertex_shader').text(),
			fragmentShader: $('#fragment_shader_' + 1).text(),
		});

		self.setState({
			numVideos: numVideos,
			material:material
		});
	}

	changePanels(num) {
		let pos;
		if (num === 1) {
			pos = {x:0, y:0, z:27};
		}
		else if (num === 4) {
			pos = {x:12.5, y:12.5, z:54};
		}
		else if (num === 16) {
			pos = {x:37, y:37, z:107};
		}
		else if(num === 64) {
			pos = {x:87.5, y:87.5, z:214};
		}
		else if (num === 256) {
			pos = {x:187, y:187, z:429};
		}
		this.setState({position: pos});
	}

	updateCamera(coord, inc) {
		const pos = this.state.position;
		if (coord === 'x') {
			if (inc) {
				pos.x += 1;
			} else {
				pos.x -=1;
			}
		} else if(coord === 'y') {
			if (inc) {
				pos.y += 1;
			} else {
				pos.y -= 1;
			}
		} else {
			if (inc) {
				pos.z += 1;
			} else {
				pos.z -= 1;
			}
		}
		this.setState({position:pos});
	}

	drop(e) {
		e.preventDefault();
		if (e.dataTransfer.types[0] === 'color') {
			const color = JSON.parse(e.dataTransfer.getData('color'));
			this.setState({
				targetColor: color,
				updateC: true
			});
	
			this.uniforms.color = {
				type:'c', 
				value:new THREE.Color('rgb(' + color.r + ', ' + color.g + ', ' + color.b + ')')
			};
		}
	}

	render() {	 
		const cameraprops = { position: this.state.position };
		const a = new THREE.Vector3(0, 0, 0);
		const a1 = new THREE.Vector3(0, 25, 0);
		const a2 = new THREE.Vector3(25, 0, 0);
		const a3 = new THREE.Vector3(25, 25, 0);
		const a4 = new THREE.Vector3(0, 50, 0);
		const a5 = new THREE.Vector3(0, 75, 0);
		const a6 = new THREE.Vector3(25, 50, 0);
		const a7 = new THREE.Vector3(25,75 , 0);
		const a8 = new THREE.Vector3(50, 0, 0);
		const a9 = new THREE.Vector3(50, 25, 0);
		const a10 = new THREE.Vector3(75,0 , 0);
		const a11 = new THREE.Vector3(75, 25, 0);
		const a12 = new THREE.Vector3(50, 50, 0);
		const a13 = new THREE.Vector3(50, 75, 0);
		const a14 = new THREE.Vector3(75, 50, 0);
		const a15 = new THREE.Vector3(75, 75, 0);
	
		const b = new THREE.Vector3(100, 0, 0);
		const b1 = new THREE.Vector3(100, 25, 0);
		const b2 = new THREE.Vector3(125, 0, 0);
		const b3 = new THREE.Vector3(125, 25, 0);
		const b4 = new THREE.Vector3(100, 50, 0);
		const b5 = new THREE.Vector3(100, 75, 0);
		const b6 = new THREE.Vector3(125, 50, 0);
		const b7 = new THREE.Vector3(125,75 , 0);
		const b8 = new THREE.Vector3(150, 0, 0);
		const b9 = new THREE.Vector3(150, 25, 0);
		const b10 = new THREE.Vector3(175,0 , 0);
		const b11 = new THREE.Vector3(175, 25, 0);
		const b12 = new THREE.Vector3(150, 50, 0);
		const b13 = new THREE.Vector3(150, 75, 0);
		const b14 = new THREE.Vector3(175, 50, 0);
		const b15 = new THREE.Vector3(175, 75, 0);
	
		const c = new THREE.Vector3(0, 100, 0);
		const c1 = new THREE.Vector3(0, 125, 0);
		const c2 = new THREE.Vector3(25, 100, 0);
		const c3 = new THREE.Vector3(25, 125, 0);
		const c4 = new THREE.Vector3(0, 150, 0);
		const c5 = new THREE.Vector3(0, 175, 0);
		const c6 = new THREE.Vector3(25, 150, 0);
		const c7 = new THREE.Vector3(25,175 , 0);
		const c8 = new THREE.Vector3(50, 100, 0);
		const c9 = new THREE.Vector3(50, 125, 0);
		const c10 = new THREE.Vector3(75,100 , 0);
		const c11 = new THREE.Vector3(75, 125, 0);
		const c12 = new THREE.Vector3(50, 150, 0);
		const c13 = new THREE.Vector3(50, 175, 0);
		const c14 = new THREE.Vector3(75, 150, 0);
		const c15 = new THREE.Vector3(75, 175, 0);
	
		const d = new THREE.Vector3(100, 100, 0);
		const d1 = new THREE.Vector3(100, 125, 0);
		const d2 = new THREE.Vector3(125, 100, 0);
		const d3 = new THREE.Vector3(125, 125, 0);
		const d4 = new THREE.Vector3(100, 150, 0);
		const d5 = new THREE.Vector3(100, 175, 0);
		const d6 = new THREE.Vector3(125, 150, 0);
		const d7 = new THREE.Vector3(125,175 , 0);
		const d8 = new THREE.Vector3(150, 100, 0);
		const d9 = new THREE.Vector3(150, 125, 0);
		const d10 = new THREE.Vector3(175,100 , 0);
		const d11 = new THREE.Vector3(175, 125, 0);
		const d12 = new THREE.Vector3(150, 150, 0);
		const d13 = new THREE.Vector3(150, 175, 0);
		const d14 = new THREE.Vector3(175, 150, 0);
		const d15 = new THREE.Vector3(175, 175, 0);
	
		 const aa = new THREE.Vector3(200, 0, 0);
		const aa1 = new THREE.Vector3(200, 25, 0);
		const aa2 = new THREE.Vector3(225, 0, 0);
		const aa3 = new THREE.Vector3(225, 25, 0);
		const aa4 = new THREE.Vector3(200, 50, 0);
		const aa5 = new THREE.Vector3(200, 75, 0);
		const aa6 = new THREE.Vector3(225, 50, 0);
		const aa7 = new THREE.Vector3(225,75 , 0);
		const aa8 = new THREE.Vector3(250, 0, 0);
		const aa9 = new THREE.Vector3(250, 25, 0);
		const aa10 = new THREE.Vector3(275,0 , 0);
		const aa11 = new THREE.Vector3(275, 25, 0);
		const aa12 = new THREE.Vector3(250, 50, 0);
		const aa13 = new THREE.Vector3(250, 75, 0);
		const aa14 = new THREE.Vector3(275, 50, 0);
		const aa15 = new THREE.Vector3(275, 75, 0);
	
		const ab = new THREE.Vector3(300, 0, 0);
		const ab1 = new THREE.Vector3(300, 25, 0);
		const ab2 = new THREE.Vector3(325, 0, 0);
		const ab3 = new THREE.Vector3(325, 25, 0);
		const ab4 = new THREE.Vector3(300, 50, 0);
		const ab5 = new THREE.Vector3(300, 75, 0);
		const ab6 = new THREE.Vector3(325, 50, 0);
		const ab7 = new THREE.Vector3(325,75 , 0);
		const ab8 = new THREE.Vector3(350, 0, 0);
		const ab9 = new THREE.Vector3(350, 25, 0);
		const ab10 = new THREE.Vector3(375,0 , 0);
		const ab11 = new THREE.Vector3(375, 25, 0);
		const ab12 = new THREE.Vector3(350, 50, 0);
		const ab13 = new THREE.Vector3(350, 75, 0);
		const ab14 = new THREE.Vector3(375, 50, 0);
		const ab15 = new THREE.Vector3(375, 75, 0);
	
		const ac = new THREE.Vector3(200, 100, 0);
		const ac1 = new THREE.Vector3(200, 125, 0);
		const ac2 = new THREE.Vector3(225, 100, 0);
		const ac3 = new THREE.Vector3(225, 125, 0);
		const ac4 = new THREE.Vector3(200, 150, 0);
		const ac5 = new THREE.Vector3(200, 175, 0);
		const ac6 = new THREE.Vector3(225, 150, 0);
		const ac7 = new THREE.Vector3(225,175 , 0);
		const ac8 = new THREE.Vector3(250, 100, 0);
		const ac9 = new THREE.Vector3(250, 125, 0);
		const ac10 = new THREE.Vector3(275,100 , 0);
		const ac11 = new THREE.Vector3(275, 125, 0);
		const ac12 = new THREE.Vector3(250, 150, 0);
		const ac13 = new THREE.Vector3(250, 175, 0);
		const ac14 = new THREE.Vector3(275, 150, 0);
		const ac15 = new THREE.Vector3(275, 175, 0);
	
		const ad = new THREE.Vector3(300, 100, 0);
		const ad1 = new THREE.Vector3(300, 125, 0);
		const ad2 = new THREE.Vector3(325, 100, 0);
		const ad3 = new THREE.Vector3(325, 125, 0);
		const ad4 = new THREE.Vector3(300, 150, 0);
		const ad5 = new THREE.Vector3(300, 175, 0);
		const ad6 = new THREE.Vector3(325, 150, 0);
		const ad7 = new THREE.Vector3(325,175 , 0);
		const ad8 = new THREE.Vector3(350, 100, 0);
		const ad9 = new THREE.Vector3(350, 125, 0);
		const ad10 = new THREE.Vector3(375,100 , 0);
		const ad11 = new THREE.Vector3(375, 125, 0);
		const ad12 = new THREE.Vector3(350, 150, 0);
		const ad13 = new THREE.Vector3(350, 175, 0);
		const ad14 = new THREE.Vector3(375, 150, 0);
		const ad15 = new THREE.Vector3(375, 175, 0);
	
		 const ba = new THREE.Vector3(0, 200, 0);
		const ba1 = new THREE.Vector3(0, 225, 0);
		const ba2 = new THREE.Vector3(25, 200, 0);
		const ba3 = new THREE.Vector3(25, 225, 0);
		const ba4 = new THREE.Vector3(0, 250, 0);
		const ba5 = new THREE.Vector3(0, 275, 0);
		const ba6 = new THREE.Vector3(25, 250, 0);
		const ba7 = new THREE.Vector3(25,275 , 0);
		const ba8 = new THREE.Vector3(50, 200, 0);
		const ba9 = new THREE.Vector3(50, 225, 0);
		const ba10 = new THREE.Vector3(75,200 , 0);
		const ba11 = new THREE.Vector3(75, 225, 0);
		const ba12 = new THREE.Vector3(50, 250, 0);
		const ba13 = new THREE.Vector3(50, 275, 0);
		const ba14 = new THREE.Vector3(75, 250, 0);
		const ba15 = new THREE.Vector3(75, 275, 0);
	
		const bb = new THREE.Vector3(100, 200, 0);
		const bb1 = new THREE.Vector3(100, 225, 0);
		const bb2 = new THREE.Vector3(125, 200, 0);
		const bb3 = new THREE.Vector3(125, 225, 0);
		const bb4 = new THREE.Vector3(100, 250, 0);
		const bb5 = new THREE.Vector3(100, 275, 0);
		const bb6 = new THREE.Vector3(125, 250, 0);
		const bb7 = new THREE.Vector3(125,275 , 0);
		const bb8 = new THREE.Vector3(150, 200, 0);
		const bb9 = new THREE.Vector3(150, 225, 0);
		const bb10 = new THREE.Vector3(175,200 , 0);
		const bb11 = new THREE.Vector3(175, 225, 0);
		const bb12 = new THREE.Vector3(150, 250, 0);
		const bb13 = new THREE.Vector3(150, 275, 0);
		const bb14 = new THREE.Vector3(175, 250, 0);
		const bb15 = new THREE.Vector3(175, 275, 0);
	
		const bc = new THREE.Vector3(0, 300, 0);
		const bc1 = new THREE.Vector3(0, 325, 0);
		const bc2 = new THREE.Vector3(25, 300, 0);
		const bc3 = new THREE.Vector3(25, 325, 0);
		const bc4 = new THREE.Vector3(0, 350, 0);
		const bc5 = new THREE.Vector3(0, 375, 0);
		const bc6 = new THREE.Vector3(25, 350, 0);
		const bc7 = new THREE.Vector3(25,375 , 0);
		const bc8 = new THREE.Vector3(50, 300, 0);
		const bc9 = new THREE.Vector3(50, 325, 0);
		const bc10 = new THREE.Vector3(75,300 , 0);
		const bc11 = new THREE.Vector3(75, 325, 0);
		const bc12 = new THREE.Vector3(50, 350, 0);
		const bc13 = new THREE.Vector3(50, 375, 0);
		const bc14 = new THREE.Vector3(75, 350, 0);
		const bc15 = new THREE.Vector3(75, 375, 0);
	
		const bd = new THREE.Vector3(100, 300, 0);
		const bd1 = new THREE.Vector3(100, 325, 0);
		const bd2 = new THREE.Vector3(125, 300, 0);
		const bd3 = new THREE.Vector3(125, 325, 0);
		const bd4 = new THREE.Vector3(100, 350, 0);
		const bd5 = new THREE.Vector3(100, 375, 0);
		const bd6 = new THREE.Vector3(125, 350, 0);
		const bd7 = new THREE.Vector3(125,375 , 0);
		const bd8 = new THREE.Vector3(150, 300, 0);
		const bd9 = new THREE.Vector3(150, 325, 0);
		const bd10 = new THREE.Vector3(175,300 , 0);
		const bd11 = new THREE.Vector3(175, 325, 0);
		const bd12 = new THREE.Vector3(150, 350, 0);
		const bd13 = new THREE.Vector3(150, 375, 0);
		const bd14 = new THREE.Vector3(175, 350, 0);
		const bd15 = new THREE.Vector3(175, 375, 0);
	
		const ca = new THREE.Vector3(200, 200, 0);
		const ca1 = new THREE.Vector3(200, 225, 0);
		const ca2 = new THREE.Vector3(225, 200, 0);
		const ca3 = new THREE.Vector3(225, 225, 0);
		const ca4 = new THREE.Vector3(200, 250, 0);
		const ca5 = new THREE.Vector3(200, 275, 0);
		const ca6 = new THREE.Vector3(225, 250, 0);
		const ca7 = new THREE.Vector3(225,275 , 0);
		const ca8 = new THREE.Vector3(250, 200, 0);
		const ca9 = new THREE.Vector3(250, 225, 0);
		const ca10 = new THREE.Vector3(275,200 , 0);
		const ca11 = new THREE.Vector3(275, 225, 0);
		const ca12 = new THREE.Vector3(250, 250, 0);
		const ca13 = new THREE.Vector3(250, 275, 0);
		const ca14 = new THREE.Vector3(275, 250, 0);
		const ca15 = new THREE.Vector3(275, 275, 0);
	
		const cb = new THREE.Vector3(300, 200, 0);
		const cb1 = new THREE.Vector3(300, 225, 0);
		const cb2 = new THREE.Vector3(325, 200, 0);
		const cb3 = new THREE.Vector3(325, 225, 0);
		const cb4 = new THREE.Vector3(300, 250, 0);
		const cb5 = new THREE.Vector3(300, 275, 0);
		const cb6 = new THREE.Vector3(325, 250, 0);
		const cb7 = new THREE.Vector3(325,275 , 0);
		const cb8 = new THREE.Vector3(350, 200, 0);
		const cb9 = new THREE.Vector3(350, 225, 0);
		const cb10 = new THREE.Vector3(375,200 , 0);
		const cb11 = new THREE.Vector3(375, 225, 0);
		const cb12 = new THREE.Vector3(350, 250, 0);
		const cb13 = new THREE.Vector3(350, 275, 0);
		const cb14 = new THREE.Vector3(375, 250, 0);
		const cb15 = new THREE.Vector3(375, 275, 0);
	
		const cc = new THREE.Vector3(200, 300, 0);
		const cc1 = new THREE.Vector3(200, 325, 0);
		const cc2 = new THREE.Vector3(225, 300, 0);
		const cc3 = new THREE.Vector3(225, 325, 0);
		const cc4 = new THREE.Vector3(200, 350, 0);
		const cc5 = new THREE.Vector3(200, 375, 0);
		const cc6 = new THREE.Vector3(225, 350, 0);
		const cc7 = new THREE.Vector3(225,375 , 0);
		const cc8 = new THREE.Vector3(250, 300, 0);
		const cc9 = new THREE.Vector3(250, 325, 0);
		const cc10 = new THREE.Vector3(275,300 , 0);
		const cc11 = new THREE.Vector3(275, 325, 0);
		const cc12 = new THREE.Vector3(250, 350, 0);
		const cc13 = new THREE.Vector3(250, 375, 0);
		const cc14 = new THREE.Vector3(275, 350, 0);
		const cc15 = new THREE.Vector3(275, 375, 0);
	
		const cd = new THREE.Vector3(300, 300, 0);
		const cd1 = new THREE.Vector3(300, 325, 0);
		const cd2 = new THREE.Vector3(325, 300, 0);
		const cd3 = new THREE.Vector3(325, 325, 0);
		const cd4 = new THREE.Vector3(300, 350, 0);
		const cd5 = new THREE.Vector3(300, 375, 0);
		const cd6 = new THREE.Vector3(325, 350, 0);
		const cd7 = new THREE.Vector3(325,375 , 0);
		const cd8 = new THREE.Vector3(350, 300, 0);
		const cd9 = new THREE.Vector3(350, 325, 0);
		const cd10 = new THREE.Vector3(375,300 , 0);
		const cd11 = new THREE.Vector3(375, 325, 0);
		const cd12 = new THREE.Vector3(350, 350, 0);
		const cd13 = new THREE.Vector3(350, 375, 0);
		const cd14 = new THREE.Vector3(375, 350, 0);
		const cd15 = new THREE.Vector3(375, 375, 0);
	

		return (
			<div
			onDragOver = {(e)=>this.dragOver(e)}
			onDragEnter = {(e)=>this.dragOver(e)}
			onDragLeave = {(e)=>this.dragLeave(e)}
			onDragEnd = {(e)=>this.dragLeave(e)}
			onDrop = {(e)=>this.drop(e)}
			>
			<Renderer	width={768} height={432} pixelRatio={window.devicePixelRatio} >
			<Scene	camera='maincamera' id='hey'>
				<PerspectiveCamera name='maincamera' {...cameraprops} />
				<Mesh geometry={geometry} material={this.state.material} position={a}/>
				<Mesh geometry={geometry} material={this.state.material} position={a1}/>
				<Mesh geometry={geometry} material={this.state.material} position={a2}/>
				<Mesh geometry={geometry} material={this.state.material} position={a3}/>
				<Mesh geometry={geometry} material={this.state.material} position={a4}/>
				<Mesh geometry={geometry} material={this.state.material} position={a5}/>
				<Mesh geometry={geometry} material={this.state.material} position={a6}/>
				<Mesh geometry={geometry} material={this.state.material} position={a7}/>
				<Mesh geometry={geometry} material={this.state.material} position={a8}/>
				<Mesh geometry={geometry} material={this.state.material} position={a9}/>
				<Mesh geometry={geometry} material={this.state.material} position={a10}/>
				<Mesh geometry={geometry} material={this.state.material} position={a11}/>
				<Mesh geometry={geometry} material={this.state.material} position={a12}/>
				<Mesh geometry={geometry} material={this.state.material} position={a13}/>
				<Mesh geometry={geometry} material={this.state.material} position={a14}/>
				<Mesh geometry={geometry} material={this.state.material} position={a15}/>
	
				<Mesh geometry={geometry} material={this.state.material} position={b}/>
				<Mesh geometry={geometry} material={this.state.material} position={b1}/>
				<Mesh geometry={geometry} material={this.state.material} position={b2}/>
				<Mesh geometry={geometry} material={this.state.material} position={b3}/>
				<Mesh geometry={geometry} material={this.state.material} position={b4}/>
				<Mesh geometry={geometry} material={this.state.material} position={b5}/>
				<Mesh geometry={geometry} material={this.state.material} position={b6}/>
				<Mesh geometry={geometry} material={this.state.material} position={b7}/>
				<Mesh geometry={geometry} material={this.state.material} position={b8}/>
				<Mesh geometry={geometry} material={this.state.material} position={b9}/>
				<Mesh geometry={geometry} material={this.state.material} position={b10}/>
				<Mesh geometry={geometry} material={this.state.material} position={b11}/>
				<Mesh geometry={geometry} material={this.state.material} position={b12}/>
				<Mesh geometry={geometry} material={this.state.material} position={b13}/>
				<Mesh geometry={geometry} material={this.state.material} position={b14}/>
				<Mesh geometry={geometry} material={this.state.material} position={b15}/>
	
				<Mesh geometry={geometry} material={this.state.material} position={c}/>
				<Mesh geometry={geometry} material={this.state.material} position={c1}/>
				<Mesh geometry={geometry} material={this.state.material} position={c2}/>
				<Mesh geometry={geometry} material={this.state.material} position={c3}/>
				<Mesh geometry={geometry} material={this.state.material} position={c4}/>
				<Mesh geometry={geometry} material={this.state.material} position={c5}/>
				<Mesh geometry={geometry} material={this.state.material} position={c6}/>
				<Mesh geometry={geometry} material={this.state.material} position={c7}/>
				<Mesh geometry={geometry} material={this.state.material} position={c8}/>
				<Mesh geometry={geometry} material={this.state.material} position={c9}/>
				<Mesh geometry={geometry} material={this.state.material} position={c10}/>
				<Mesh geometry={geometry} material={this.state.material} position={c11}/>
				<Mesh geometry={geometry} material={this.state.material} position={c12}/>
				<Mesh geometry={geometry} material={this.state.material} position={c13}/>
				<Mesh geometry={geometry} material={this.state.material} position={c14}/>
				<Mesh geometry={geometry} material={this.state.material} position={c15}/>
	
				<Mesh geometry={geometry} material={this.state.material} position={d}/>
				<Mesh geometry={geometry} material={this.state.material} position={d1}/>
				<Mesh geometry={geometry} material={this.state.material} position={d2}/>
				<Mesh geometry={geometry} material={this.state.material} position={d3}/>
				<Mesh geometry={geometry} material={this.state.material} position={d4}/>
				<Mesh geometry={geometry} material={this.state.material} position={d5}/>
				<Mesh geometry={geometry} material={this.state.material} position={d6}/>
				<Mesh geometry={geometry} material={this.state.material} position={d7}/>
				<Mesh geometry={geometry} material={this.state.material} position={d8}/>
				<Mesh geometry={geometry} material={this.state.material} position={d9}/>
				<Mesh geometry={geometry} material={this.state.material} position={d10}/>
				<Mesh geometry={geometry} material={this.state.material} position={d11}/>
				<Mesh geometry={geometry} material={this.state.material} position={d12}/>
				<Mesh geometry={geometry} material={this.state.material} position={d13}/>
				<Mesh geometry={geometry} material={this.state.material} position={d14}/>
				<Mesh geometry={geometry} material={this.state.material} position={d15}/>
	
				<Mesh geometry={geometry} material={this.state.material} position={aa}/>
				<Mesh geometry={geometry} material={this.state.material} position={aa1}/>
				<Mesh geometry={geometry} material={this.state.material} position={aa2}/>
				<Mesh geometry={geometry} material={this.state.material} position={aa3}/>
				<Mesh geometry={geometry} material={this.state.material} position={aa4}/>
				<Mesh geometry={geometry} material={this.state.material} position={aa5}/>
				<Mesh geometry={geometry} material={this.state.material} position={aa6}/>
				<Mesh geometry={geometry} material={this.state.material} position={aa7}/>
				<Mesh geometry={geometry} material={this.state.material} position={aa8}/>
				<Mesh geometry={geometry} material={this.state.material} position={aa9}/>
				<Mesh geometry={geometry} material={this.state.material} position={aa10}/>
				<Mesh geometry={geometry} material={this.state.material} position={aa11}/>
				<Mesh geometry={geometry} material={this.state.material} position={aa12}/>
				<Mesh geometry={geometry} material={this.state.material} position={aa13}/>
				<Mesh geometry={geometry} material={this.state.material} position={aa14}/>
				<Mesh geometry={geometry} material={this.state.material} position={aa15}/>
	
				<Mesh geometry={geometry} material={this.state.material} position={ab}/>
				<Mesh geometry={geometry} material={this.state.material} position={ab1}/>
				<Mesh geometry={geometry} material={this.state.material} position={ab2}/>
				<Mesh geometry={geometry} material={this.state.material} position={ab3}/>
				<Mesh geometry={geometry} material={this.state.material} position={ab4}/>
				<Mesh geometry={geometry} material={this.state.material} position={ab5}/>
				<Mesh geometry={geometry} material={this.state.material} position={ab6}/>
				<Mesh geometry={geometry} material={this.state.material} position={ab7}/>
				<Mesh geometry={geometry} material={this.state.material} position={ab8}/>
				<Mesh geometry={geometry} material={this.state.material} position={ab9}/>
				<Mesh geometry={geometry} material={this.state.material} position={ab10}/>
				<Mesh geometry={geometry} material={this.state.material} position={ab11}/>
				<Mesh geometry={geometry} material={this.state.material} position={ab12}/>
				<Mesh geometry={geometry} material={this.state.material} position={ab13}/>
				<Mesh geometry={geometry} material={this.state.material} position={ab14}/>
				<Mesh geometry={geometry} material={this.state.material} position={ab15}/>
	
				<Mesh geometry={geometry} material={this.state.material} position={ac}/>
				<Mesh geometry={geometry} material={this.state.material} position={ac1}/>
				<Mesh geometry={geometry} material={this.state.material} position={ac2}/>
				<Mesh geometry={geometry} material={this.state.material} position={ac3}/>
				<Mesh geometry={geometry} material={this.state.material} position={ac4}/>
				<Mesh geometry={geometry} material={this.state.material} position={ac5}/>
				<Mesh geometry={geometry} material={this.state.material} position={ac6}/>
				<Mesh geometry={geometry} material={this.state.material} position={ac7}/>
				<Mesh geometry={geometry} material={this.state.material} position={ac8}/>
				<Mesh geometry={geometry} material={this.state.material} position={ac9}/>
				<Mesh geometry={geometry} material={this.state.material} position={ac10}/>
				<Mesh geometry={geometry} material={this.state.material} position={ac11}/>
				<Mesh geometry={geometry} material={this.state.material} position={ac12}/>
				<Mesh geometry={geometry} material={this.state.material} position={ac13}/>
				<Mesh geometry={geometry} material={this.state.material} position={ac14}/>
				<Mesh geometry={geometry} material={this.state.material} position={ac15}/>
	
				<Mesh geometry={geometry} material={this.state.material} position={ad}/>
				<Mesh geometry={geometry} material={this.state.material} position={ad1}/>
				<Mesh geometry={geometry} material={this.state.material} position={ad2}/>
				<Mesh geometry={geometry} material={this.state.material} position={ad3}/>
				<Mesh geometry={geometry} material={this.state.material} position={ad4}/>
				<Mesh geometry={geometry} material={this.state.material} position={ad5}/>
				<Mesh geometry={geometry} material={this.state.material} position={ad6}/>
				<Mesh geometry={geometry} material={this.state.material} position={ad7}/>
				<Mesh geometry={geometry} material={this.state.material} position={ad8}/>
				<Mesh geometry={geometry} material={this.state.material} position={ad9}/>
				<Mesh geometry={geometry} material={this.state.material} position={ad10}/>
				<Mesh geometry={geometry} material={this.state.material} position={ad11}/>
				<Mesh geometry={geometry} material={this.state.material} position={ad12}/>
				<Mesh geometry={geometry} material={this.state.material} position={ad13}/>
				<Mesh geometry={geometry} material={this.state.material} position={ad14}/>
				<Mesh geometry={geometry} material={this.state.material} position={ad15}/>
	
				<Mesh geometry={geometry} material={this.state.material} position={ba}/>
				<Mesh geometry={geometry} material={this.state.material} position={ba1}/>
				<Mesh geometry={geometry} material={this.state.material} position={ba2}/>
				<Mesh geometry={geometry} material={this.state.material} position={ba3}/>
				<Mesh geometry={geometry} material={this.state.material} position={ba4}/>
				<Mesh geometry={geometry} material={this.state.material} position={ba5}/>
				<Mesh geometry={geometry} material={this.state.material} position={ba6}/>
				<Mesh geometry={geometry} material={this.state.material} position={ba7}/>
				<Mesh geometry={geometry} material={this.state.material} position={ba8}/>
				<Mesh geometry={geometry} material={this.state.material} position={ba9}/>
				<Mesh geometry={geometry} material={this.state.material} position={ba10}/>
				<Mesh geometry={geometry} material={this.state.material} position={ba11}/>
				<Mesh geometry={geometry} material={this.state.material} position={ba12}/>
				<Mesh geometry={geometry} material={this.state.material} position={ba13}/>
				<Mesh geometry={geometry} material={this.state.material} position={ba14}/>
				<Mesh geometry={geometry} material={this.state.material} position={ba15}/>
	
				<Mesh geometry={geometry} material={this.state.material} position={bb}/>
				<Mesh geometry={geometry} material={this.state.material} position={bb1}/>
				<Mesh geometry={geometry} material={this.state.material} position={bb2}/>
				<Mesh geometry={geometry} material={this.state.material} position={bb3}/>
				<Mesh geometry={geometry} material={this.state.material} position={bb4}/>
				<Mesh geometry={geometry} material={this.state.material} position={bb5}/>
				<Mesh geometry={geometry} material={this.state.material} position={bb6}/>
				<Mesh geometry={geometry} material={this.state.material} position={bb7}/>
				<Mesh geometry={geometry} material={this.state.material} position={bb8}/>
				<Mesh geometry={geometry} material={this.state.material} position={bb9}/>
				<Mesh geometry={geometry} material={this.state.material} position={bb10}/>
				<Mesh geometry={geometry} material={this.state.material} position={bb11}/>
				<Mesh geometry={geometry} material={this.state.material} position={bb12}/>
				<Mesh geometry={geometry} material={this.state.material} position={bb13}/>
				<Mesh geometry={geometry} material={this.state.material} position={bb14}/>
				<Mesh geometry={geometry} material={this.state.material} position={bb15}/>
	
				<Mesh geometry={geometry} material={this.state.material} position={bc}/>
				<Mesh geometry={geometry} material={this.state.material} position={bc1}/>
				<Mesh geometry={geometry} material={this.state.material} position={bc2}/>
				<Mesh geometry={geometry} material={this.state.material} position={bc3}/>
				<Mesh geometry={geometry} material={this.state.material} position={bc4}/>
				<Mesh geometry={geometry} material={this.state.material} position={bc5}/>
				<Mesh geometry={geometry} material={this.state.material} position={bc6}/>
				<Mesh geometry={geometry} material={this.state.material} position={bc7}/>
				<Mesh geometry={geometry} material={this.state.material} position={bc8}/>
				<Mesh geometry={geometry} material={this.state.material} position={bc9}/>
				<Mesh geometry={geometry} material={this.state.material} position={bc10}/>
				<Mesh geometry={geometry} material={this.state.material} position={bc11}/>
				<Mesh geometry={geometry} material={this.state.material} position={bc12}/>
				<Mesh geometry={geometry} material={this.state.material} position={bc13}/>
				<Mesh geometry={geometry} material={this.state.material} position={bc14}/>
				<Mesh geometry={geometry} material={this.state.material} position={bc15}/>
	
				<Mesh geometry={geometry} material={this.state.material} position={bd}/>
				<Mesh geometry={geometry} material={this.state.material} position={bd1}/>
				<Mesh geometry={geometry} material={this.state.material} position={bd2}/>
				<Mesh geometry={geometry} material={this.state.material} position={bd3}/>
				<Mesh geometry={geometry} material={this.state.material} position={bd4}/>
				<Mesh geometry={geometry} material={this.state.material} position={bd5}/>
				<Mesh geometry={geometry} material={this.state.material} position={bd6}/>
				<Mesh geometry={geometry} material={this.state.material} position={bd7}/>
				<Mesh geometry={geometry} material={this.state.material} position={bd8}/>
				<Mesh geometry={geometry} material={this.state.material} position={bd9}/>
				<Mesh geometry={geometry} material={this.state.material} position={bd10}/>
				<Mesh geometry={geometry} material={this.state.material} position={bd11}/>
				<Mesh geometry={geometry} material={this.state.material} position={bd12}/>
				<Mesh geometry={geometry} material={this.state.material} position={bd13}/>
				<Mesh geometry={geometry} material={this.state.material} position={bd14}/>
				<Mesh geometry={geometry} material={this.state.material} position={bd15}/>
				<Mesh geometry={geometry} material={this.state.material} position={ca}/>
				<Mesh geometry={geometry} material={this.state.material} position={ca1}/>
				<Mesh geometry={geometry} material={this.state.material} position={ca2}/>
				<Mesh geometry={geometry} material={this.state.material} position={ca3}/>
				<Mesh geometry={geometry} material={this.state.material} position={ca4}/>
				<Mesh geometry={geometry} material={this.state.material} position={ca5}/>
				<Mesh geometry={geometry} material={this.state.material} position={ca6}/>
				<Mesh geometry={geometry} material={this.state.material} position={ca7}/>
				<Mesh geometry={geometry} material={this.state.material} position={ca8}/>
				<Mesh geometry={geometry} material={this.state.material} position={ca9}/>
				<Mesh geometry={geometry} material={this.state.material} position={ca10}/>
				<Mesh geometry={geometry} material={this.state.material} position={ca11}/>
				<Mesh geometry={geometry} material={this.state.material} position={ca12}/>
				<Mesh geometry={geometry} material={this.state.material} position={ca13}/>
				<Mesh geometry={geometry} material={this.state.material} position={ca14}/>
				<Mesh geometry={geometry} material={this.state.material} position={ca15}/>
	
				<Mesh geometry={geometry} material={this.state.material} position={cb}/>
				<Mesh geometry={geometry} material={this.state.material} position={cb1}/>
				<Mesh geometry={geometry} material={this.state.material} position={cb2}/>
				<Mesh geometry={geometry} material={this.state.material} position={cb3}/>
				<Mesh geometry={geometry} material={this.state.material} position={cb4}/>
				<Mesh geometry={geometry} material={this.state.material} position={cb5}/>
				<Mesh geometry={geometry} material={this.state.material} position={cb6}/>
				<Mesh geometry={geometry} material={this.state.material} position={cb7}/>
				<Mesh geometry={geometry} material={this.state.material} position={cb8}/>
				<Mesh geometry={geometry} material={this.state.material} position={cb9}/>
				<Mesh geometry={geometry} material={this.state.material} position={cb10}/>
				<Mesh geometry={geometry} material={this.state.material} position={cb11}/>
				<Mesh geometry={geometry} material={this.state.material} position={cb12}/>
				<Mesh geometry={geometry} material={this.state.material} position={cb13}/>
				<Mesh geometry={geometry} material={this.state.material} position={cb14}/>
				<Mesh geometry={geometry} material={this.state.material} position={cb15}/>
	
				<Mesh geometry={geometry} material={this.state.material} position={cc}/>
				<Mesh geometry={geometry} material={this.state.material} position={cc1}/>
				<Mesh geometry={geometry} material={this.state.material} position={cc2}/>
				<Mesh geometry={geometry} material={this.state.material} position={cc3}/>
				<Mesh geometry={geometry} material={this.state.material} position={cc4}/>
				<Mesh geometry={geometry} material={this.state.material} position={cc5}/>
				<Mesh geometry={geometry} material={this.state.material} position={cc6}/>
				<Mesh geometry={geometry} material={this.state.material} position={cc7}/>
				<Mesh geometry={geometry} material={this.state.material} position={cc8}/>
				<Mesh geometry={geometry} material={this.state.material} position={cc9}/>
				<Mesh geometry={geometry} material={this.state.material} position={cc10}/>
				<Mesh geometry={geometry} material={this.state.material} position={cc11}/>
				<Mesh geometry={geometry} material={this.state.material} position={cc12}/>
				<Mesh geometry={geometry} material={this.state.material} position={cc13}/>
				<Mesh geometry={geometry} material={this.state.material} position={cc14}/>
				<Mesh geometry={geometry} material={this.state.material} position={cc15}/>
	
				<Mesh geometry={geometry} material={this.state.material} position={cd}/>
				<Mesh geometry={geometry} material={this.state.material} position={cd1}/>
				<Mesh geometry={geometry} material={this.state.material} position={cd2}/>
				<Mesh geometry={geometry} material={this.state.material} position={cd3}/>
				<Mesh geometry={geometry} material={this.state.material} position={cd4}/>
				<Mesh geometry={geometry} material={this.state.material} position={cd5}/>
				<Mesh geometry={geometry} material={this.state.material} position={cd6}/>
				<Mesh geometry={geometry} material={this.state.material} position={cd7}/>
				<Mesh geometry={geometry} material={this.state.material} position={cd8}/>
				<Mesh geometry={geometry} material={this.state.material} position={cd9}/>
				<Mesh geometry={geometry} material={this.state.material} position={cd10}/>
				<Mesh geometry={geometry} material={this.state.material} position={cd11}/>
				<Mesh geometry={geometry} material={this.state.material} position={cd12}/>
				<Mesh geometry={geometry} material={this.state.material} position={cd13}/>
				<Mesh geometry={geometry} material={this.state.material} position={cd14}/>
				<Mesh geometry={geometry} material={this.state.material} position={cd15}/>	
			</Scene>
		</Renderer>
		
		<div style={{float:'right'}}>
			<ActiveTextures applyTextures={this.applyTextures} parent={this} changeRange={this.changeRange}/>
		</div>
		<div>
			<button onClick={()=>this.changePanels(1)}> 1</button>
			<button onClick={()=>this.changePanels(4)}> 4</button>
			<button onClick={()=>this.changePanels(16)}> 16</button>
			<button onClick={()=>this.changePanels(64)}> 64</button>
			<button onClick={()=>this.changePanels(256)}> 256</button>
		</div>
		<div>
			<p> x={this.state.position.x}
			<button onClick={()=>this.updateCamera('x', true)} />
			<button onClick={()=>this.updateCamera('x', false)} />
			</p>
			<p> y={this.state.position.y}
			<button onClick={()=>this.updateCamera('y', true)} />
			<button onClick={()=>this.updateCamera('y', false)} />
			</p>
			<p>z={this.state.position.z}
			<button onClick={()=>this.updateCamera('z', true)} />
			<button onClick={()=>this.updateCamera('z', false)} />
			</p>
		</div>
		</div> 
	);
	}
	
}
/*
function shaderstart() { // eslint-disable-line no-unused-consts
	const renderelement = document.getElementById('three-box');

	ReactTHREE.render(<VideoPreview />, renderelement);
}

window.onload = shaderstart;

/*
constructor(props){
	super(props);
	const self = this;
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
		video.crossOrigin = 'anonymous';
		video.src = 'before.mkv';
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
		mainCamera='camera' // this points to the perspectiveCamera which has the name set to 'camera' below
		width={width}
		height={height}
		onAnimate={this._onAnimate}
		>
		<resources>
		<texture
			resourceId='texture'
			url='texture.jpg'
			wrapS={THREE.RepeatWrapping}
			wrapT={THREE.RepeatWrapping}
			anisotropy={16}
			/>
		 <meshLambertMaterial
			resourceId='material'
			side={THREE.DoubleSide}
			>
			<textureResource
				resourceId='texture'
			/>
			</meshLambertMaterial> 
		</resources>
		<scene ref='scene'>
		<perspectiveCamera
			name='camera'
			fov={75}
			aspect={width / height}
			near={0.1}
			far={1000}

			position={this.cameraPosition}
		/>
					<mesh
						ref='screenPlane'
						name='screenPlane'
					>
						<planeBufferGeometry
							width={this.props.width}
							height={this.props.height}
						/>
						<materialResource
					resourceId='material'
				/>
						<meshLambertMaterial color={'#ffffff'} />
					</mesh>
				</scene>
	</React3>);
}
*/
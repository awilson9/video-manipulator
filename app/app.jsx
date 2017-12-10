import React from 'react';
import ReactDOM from 'react-dom';
var path = require('path');
var appDir = path.resolve(__dirname);
import FileProcess from './app/fileProcess.jsx';
import VideoPreview from './app/videoPreview.jsx';
import VideoPlayer from './app/videoPlayer.jsx';
import fileData from './app/fileData.json';
import ColorPalette from './app/colorPalette.jsx';
import ActiveTextures from './app/activeTextures.jsx';
import SpriteSheetPlayer from './app/spriteSheetPlayer.jsx';
var ReactTHREE = require('react-three');
var fs = require('fs');

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {files: fileData.files};
	}

	addMedia(media){
		var files = this.state.files;
		for(var path in media){
			files.push(media[path]);
		}
		this.setState({
			files: files
		});
		
		var str = JSON.stringify(this.state);
		
		fs.writeFile(__dirname + '/app/fileData.json', str, function(err){
			if (err) console.log(err);
			else {
				console.log("success");
			}
		});	
	}
	render() {
		const style = {
			hidden: {
				display: 'none'
			},
			display: {
				display: 'inline-block',
				paddingTop:'40%',
				textAlign: 'center'
			},
			box: {
				background: 'white',
				outline: '2px dashed black',
			
				float: 'right',
				height: '30%',
				clear: 'both',

			},
			preview: {
				right: 0,
				float: 'right',
				display: 'block',
				clear: 'both'
			}
		}
		return (
			<div style={{height:500, width:'100%'}}>
				<div>
					<div style={style.box}>
						<FileProcess style={style} addMedia={(media)=>this.addMedia(media)} />
					</div>
					<div style={style.preview}>
						<VideoPreview style={style} files={this.state.files}/>
					</div>
				</div>
				<div>
					<VideoPlayer width={1258} height={1020} />
				</div>
				<ColorPalette />
			</div>
		);
	}
}/*
function shaderstart() { // eslint-disable-line no-unused-vars
  var renderelement = document.getElementById("three-box");

  ReactTHREE.render(<VideoPlayer width={512} height={256} />, renderelement);
}
window.onload = shaderstart;*/
ReactDOM.render(
	<App />,
	document.getElementById('root'),
	);
import React from 'react';

export default class FileProcess extends React.Component{

	dragOver(e) {
		e.preventDefault();
	}

	dragLeave(e) {
		e.preventDefault();
	}

	drop(e) {
		e.preventDefault();
		var media = [];
    	for (let f of e.dataTransfer.files) {
      		media.push(f.path);
    	}
    	this.props.addMedia(media);
	}

	render() {
		return(
			<div id="holder"
			onDragOver = {(e)=>this.dragOver(e)}
			onDragEnter = {(e)=>this.dragOver(e)}
			onDragLeave = {(e)=>this.dragLeave(e)}
			onDragEnd = {(e)=>this.dragLeave(e)}
			onDrop = {(e)=>this.drop(e)}
			>	
				<div id="box__input" style={this.props.style.display}>
					<strong>Choose a file </strong>
					 or drag it here
				</div>
			</div>
		)	
	}
}
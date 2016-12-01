import React from 'react';

export default class VideoPreview extends React.Component{

	dragStart(e){
		e.dataTransfer.setData("text/plain", e.target.childNodes[0].src);
		console.log(e.target.childNodes[0].src);
	}
	render(){
		
		return(
			<div id="preview-container">
				{
					this.props.files.map((path, index) => (
       				 <div key={index} draggable="true" onDragStart={this.dragStart}><video controls width='200' src={path}></video></div>
   					 )
					)
				}</div>
			);
		}
	}

import React from 'react';
import SketchPicker from 'react-color';

export default class ColorPalette extends React.Component{
	
	constructor(props) {
		super(props)
		this.state = {
			color:{
				r:0,
				g:0,
				b:0,
				a:1.0
			}
		}
		this.handleChangeComplete = (color) => {
			const rgba = color.rgb
			
			this.setState({
				color: rgba
			});
	
		}
	}
	
	generateRGBA() {
		const str = `rgba(${this.state.color.r},${this.state.color.g},${this.state.color.b},${this.state.color.a})`;
		return 	 str;
	}
	dragStart(e) {
		e.dataTransfer.setData('color', JSON.stringify(this.state.color));
	}

	render() {
		const style = {
			color:{
				height:100,
				width:100,
				backgroundColor: this.generateRGBA()
			}
		}
		return (
			<div>
				<SketchPicker onChangeComplete = { this.handleChangeComplete } color = { this.state.color }/>
				<div draggable='true' style = { style.color } onDragStart = { (e) => this.dragStart(e) } />
			</div>
		)
	}

}
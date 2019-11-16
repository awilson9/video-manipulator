import React from 'react';

export default class SpriteSheetPlayer extends React.Component{
	constructor(props) {
		super(props);
		this.image = new Image();
		this.image.src = this.props.src;
		const canvas = document.createElement('canvas');
		canvas.id = this.props.id;
		canvas.width = 192;
		canvas.height = 108;
		document.body.appendChild(canvas);
		
		
		const self = this;
		this.image.onload = () => {
			$('#'+self.props.id)[0].getContext('2d').drawImage(self.image, 0, 0, self.props.width, self.props.height, 0, 0, self.props.width, self.props.height);
			window.requestAnimationFrame(self.animate);
		}
		this.state = { play:false, wStart:0 }
		this.animate = () => {
			if(this.state.play){
				$('#'+self.props.id)[0].getContext('2d').clearRect(0, 0, 192, 108);
				$('#'+self.props.id)[0].getContext('2d').drawImage(this.image, this.state.wStart, 0, this.props.width, this.props.height, 0, 0, 192, 108);
				const wStart_u = (this.state.wStart+this.props.width<this.image.width) ? this.state.wStart + this.props.width : 0;
				this.setState({
					wStart:wStart_u
				});
			}
			window.requestAnimationFrame(self.animate);
			
		}
		
	}
	play() {
		this.setState({
			play: !this.state.play
		});
	}
	display() {
		return (this.state.play) ? 'pause' : 'play';
	}
	render() {
		return (
			<div>
				<div onClick={ () => this.setState({
					play:!this.state.play
				})}> { this.display() } </div>
			</div>
		);
	}
}
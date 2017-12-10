import React from 'react';

export default class ActiveTextures extends React.Component {
	dragStart(e){
		e.dataTransfer.setData("text/plain", e.target.childNodes[0].id);
		console.log(e.target.childNodes[0].id);
	}
	dragOver(e){
		e.preventDefault();
	}
	dragLeave(e){
		e.preventDefault();
	}
	drop(e, index, textureIndex){
		e.preventDefault();
		var div = $('#' + index);
		var children = div.children();
		if (children.length > 0){
			var child = children[0].remove();	
		}
		var id = e.dataTransfer.getData('text/plain');
		var vid = $('#' + id);
		div.width(vid.width()).height(vid.height() + 20);
		div.append(vid.remove());
		this.props.applyTextures(id, textureIndex, this.props.parent);
	}
	dropPattern(e){
		this.drop(e, 'pattern', -1);
	}
	drop1(e){
		this.drop(e, '1', 0);
	}
	drop2(e){
		this.drop(e, '2', 1);
	}
	drop3(e){
		this.drop(e, '3', 2);
	}
	drop4(e){
		this.drop(e, '4', 3);
	}
	drop5(e){
		this.drop(e, '5', 4);
	}
	sliderChange(val, index) {
		var value = Number(val.target.value);
		$('#slider-' + index).val(val.target.value);
		var targetDiv = $('#' + index);
		if (targetDiv.children().length > 0) {
			targetDiv.children()[0].playbackRate = value;
		}
	}
	sliderChange1(val) {
		this.sliderChange(val, '1');
	}
	sliderChange2(val) {
		this.sliderChange(val, '2');
	}	
	sliderChange3(val) {
		this.sliderChange(val, '3');
	}
	sliderChange4(val) {
		this.sliderChange(val, '4');
	}
	sliderChange5(val) {
		this.sliderChange(val, '5');
	}
	sliderChangePattern(val) {
		this.sliderChange(val, 'pattern');
	}
	changeInput(e) {
		this.props.changeRange()
	}

	render(){
		const style = {
			parent: {
				position:'relative'
			},
			slider: {
				transform: 'rotate(270deg)',
				position: 'relative',
				left: -70,
				top: 130,
				width: 100
			},
			table: {
				width: 200,
				tableLayout: 'fixed'
			},
			input: {
				width: 40
			}
		}
		return(
			<div>
				<p>Pattern Video</p>
				<div style={style.parent}>
					<input type="range" id="slider-pattern" style={style.slider}  min="0" max="5" step=".1" onChange={(e)=>this.sliderChangePattern(e)}/>
					<table style={style.table}>
						<tbody>
						<tr>
							<th></th>
							<th>R</th>
							<th>G</th>
							<th>B</th>	
						</tr>
						<tr>
							<td>min</td>
							<td><input style={style.input} id="1-r-min" onChange={(e)=>this.changeInput(e)}  type="number"/></td>
							<td><input style={style.input} type="number"/></td>
							<td><input style={style.input} type="number"/></td>
						</tr>
						<tr>
							<td>max</td>
							<td><input style={style.input} type="number"/></td>
							<td><input style={style.input} type="number"/></td>
							<td><input style={style.input} type="number"/></td>
						</tr>
						</tbody>
					</table>
					<div 
						id="pattern" 
						onDragOver = {(e)=>this.dragOver(e)}
						onDragEnter = {(e)=>this.dragOver(e)}
						onDragLeave = {(e)=>this.dragLeave(e)}
						onDragEnd = {(e)=>this.dragLeave(e)}
						onDrop = {(e)=>this.dropPattern(e)}
						style={{height:100, width:200, outline: '2px dashed black'}}>
					</div>
				</div>
				<p>Active Textures</p>
				<div>
					<input type="range" id="slider-1" style={style.slider} min="0" max="5" step=".1" onChange={(e)=>this.sliderChange1(e)}/>
					<table style={style.table}>
						<tbody>
						<tr>
							<th></th>
							<th>R</th>
							<th>G</th>
							<th>B</th>	
						</tr>
						<tr>
							<td>min</td>
							<td><input style={style.input} type="text"/></td>
							<td><input style={style.input} type="text"/></td>
							<td><input style={style.input} type="text"/></td>
						</tr>
						<tr>
							<td>max</td>
							<td><input style={style.input} type="text"/></td>
							<td><input style={style.input} type="text"/></td>
							<td><input style={style.input} type="text"/></td>
						</tr>
						</tbody>
					</table>
					<div 
						id="1" 
						onDragOver = {(e)=>this.dragOver(e)}
						onDragEnter = {(e)=>this.dragOver(e)}
						onDragLeave = {(e)=>this.dragLeave(e)}
						onDragEnd = {(e)=>this.dragLeave(e)}
						onDrop = {(e)=>this.drop1(e)}
						style={{height:100, width:200, outline: '2px dashed black'}}>
					</div>
				</div>
				<div>
					<input type="range" id="slider-2" style={style.slider} min="0" max="5" step=".1" onChange={(e)=>this.sliderChange2(e)}/>
					<table style={style.table}>
						<tbody>
						<tr>
							<th></th>
							<th>R</th>
							<th>G</th>
							<th>B</th>	
						</tr>
						<tr>
							<td>min</td>
							<td><input style={style.input} type="text"/></td>
							<td><input style={style.input} type="text"/></td>
							<td><input style={style.input} type="text"/></td>
						</tr>
						<tr>
							<td>max</td>
							<td><input style={style.input} type="text"/></td>
							<td><input style={style.input} type="text"/></td>
							<td><input style={style.input} type="text"/></td>
						</tr>
						</tbody>
					</table>
					<div 
						id="2" 
						onDragOver = {(e)=>this.dragOver(e)}
						onDragEnter = {(e)=>this.dragOver(e)}
						onDragLeave = {(e)=>this.dragLeave(e)}
						onDragEnd = {(e)=>this.dragLeave(e)}
						onDrop = {(e)=>this.drop2(e)}
						style={{height:100, width:200, outline: '2px dashed black'}}>
					</div>
				</div>
				<div>
					<input type="range" id="slider-3" style={style.slider} min="0" max="5" step=".1" onChange={(e)=>this.sliderChange3(e)}/>
					<table style={style.table}>
						<tbody>
						<tr>
							<th></th>
							<th>R</th>
							<th>G</th>
							<th>B</th>	
						</tr>
						<tr>
							<td>min</td>
							<td><input style={style.input} type="text"/></td>
							<td><input style={style.input} type="text"/></td>
							<td><input style={style.input} type="text"/></td>
						</tr>
						<tr>
							<td>max</td>
							<td><input style={style.input} type="text"/></td>
							<td><input style={style.input} type="text"/></td>
							<td><input style={style.input} type="text"/></td>
						</tr>
						</tbody>
					</table>
					<div 
						id="3" 
						onDragOver = {(e)=>this.dragOver(e)}
						onDragEnter = {(e)=>this.dragOver(e)}
						onDragLeave = {(e)=>this.dragLeave(e)}
						onDragEnd = {(e)=>this.dragLeave(e)}
						onDrop = {(e)=>this.drop3(e)}
						style={{height:100, width:200, outline: '2px dashed black'}}>
					</div>
				</div>
				<div>
					<input type="range" id="slider-4" style={style.slider} min="0" max="5" step=".1" onChange={(e)=>this.sliderChange4(e)}/>
					<table style={style.table}>
						<tbody>
						<tr>
							<th></th>
							<th>R</th>
							<th>G</th>
							<th>B</th>	
						</tr>
						<tr>
							<td>min</td>
							<td><input style={style.input} type="text"/></td>
							<td><input style={style.input} type="text"/></td>
							<td><input style={style.input} type="text"/></td>
						</tr>
						<tr>
							<td>max</td>
							<td><input style={style.input} type="text"/></td>
							<td><input style={style.input} type="text"/></td>
							<td><input style={style.input} type="text"/></td>
						</tr>
						</tbody>
					</table>
					<div 
						id="4" 
						onDragOver = {(e)=>this.dragOver(e)}
						onDragEnter = {(e)=>this.dragOver(e)}
						onDragLeave = {(e)=>this.dragLeave(e)}
						onDragEnd = {(e)=>this.dragLeave(e)}
						onDrop = {(e)=>this.drop4(e)}
						style={{height:100, width:200, outline: '2px dashed black'}}>
					</div>
				</div>
				<div>
					<input type="range" id="slider-1" style={style.slider} min="0" max="5" step=".1" onChange={(e)=>this.sliderChange5(e)}/>
					<table style={style.table}>
						<tbody>
						<tr>
							<th></th>
							<th>R</th>
							<th>G</th>
							<th>B</th>	
						</tr>
						<tr>
							<td>min</td>
							<td><input style={style.input} onChange={(e)=>changeInput(e)} type="text"/></td>
							<td><input style={style.input} type="text"/></td>
							<td><input style={style.input} type="text"/></td>
						</tr>
						<tr>
							<td>max</td>
							<td><input style={style.input} type="text"/></td>
							<td><input style={style.input} type="text"/></td>
							<td><input style={style.input} type="text"/></td>
						</tr>
						</tbody>
					</table>
					<div 
						id="5" 
						onDragOver = {(e)=>this.dragOver(e)}
						onDragEnter = {(e)=>this.dragOver(e)}
						onDragLeave = {(e)=>this.dragLeave(e)}
						onDragEnd = {(e)=>this.dragLeave(e)}
						onDrop = {(e)=>this.drop5(e)}
						style={{height:100, width:200, outline: '2px dashed black'}}>
					</div>
				</div>				
			</div>
		);
	}
}
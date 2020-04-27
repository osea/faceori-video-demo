import React, { Component } from 'react';
import { Text, View, Dimensions, StyleSheet } from 'react-native';
import {Video} from 'expo-av';
import { MaterialIcons, Octicons } from '@expo/vector-icons';
const io = require('socket.io-client');


// --------------- important
// The video play can not resume from where it pauses for now NEED!

const SocketEndpoint = 'http://192.168.0.11:5000/test';

export default class BlinkApp extends Component {
  
  state = {
    isConnected: false,
		mute: false,
		fullScreen: false,
		shouldPlay: true,
    data: null
	}

  componentDidMount() {
    const socket = io(SocketEndpoint, {
      transports: ['websocket']
    });

    socket.on('connect', () => {
      this.setState({ isConnected: true });
    });

    socket.on('result', data => {
      console.log(data.angle)
      this.setState({data:data.angle});
      if(data.angle == 1){
        this.handlePlay()
      }
      else {
        this.handlePause()
      }
    });
  }

  handlePlay = () => {
		this.setState({shouldPlay: true});
	}

  handlePause = () => {
		this.setState({shouldPlay: false});
	}

  handlePlayAndPause = () => {
		this.setState(prevState => ({
			shouldPlay: !prevState.shouldPlay
		}));
	}

	handleVolume = () => {
		this.setState(prevState => ({
			mute: !prevState.mute,
		}));
	}
  
  //state object
  state = { isShowingText: true };

  render() {
    
		const { width, height } = Dimensions.get('window');

    return (
      <View style={styles.container}>
				<View>
						<Video
            source={{ uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4' }}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            resizeMode="cover"
            shouldPlay
            isLooping
            style={{ width: 300, height: 300 }}
          />
						<Video
              
							source={{ uri: 'https://osea.github.io/faceori.github.io/sushi-roll.mp4' }}
							shouldPlay={this.state.shouldPlay}
              resizeMode={Video.RESIZE_MODE_COVER}
							style={{ width, height}}
							isMuted={this.state.mute}
						/>
						<View style={styles.controlBar}>
							
							<MaterialIcons 
								name={this.state.shouldPlay ? "pause" : "play-arrow"} 
								size={100} 
								color="white" 
								onPress={this.handlePlayAndPause} 
							/>
						</View>
					</View>
      </View>
		);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
	},
	controlBar: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 60,
		height: 100,
		flexDirection: "row",
		
		justifyContent: "flex-end",
		backgroundColor: "rgba(0, 0, 0, 0)",
	}
});
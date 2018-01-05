import React, { Component } from 'react';
import './App.css';

let defaultStyle = {
  color: '#fff'
};

let fakeServerData = {
  user: {
    name: 'Schuyler',
    playlists: [
      {
        name: 'My Favorites',
        songs: [
          {name: 'Old Black Hen', duration: 350000},
          {name: 'Man In the Mirror', duration: 300000},
          {name: 'Born in the USA', duration: 230000}
        ]
      },
      {
        name: 'Discov Weekly',
        songs: [
          {name: 'Song', duration: 550000},
          {name: 'Songery', duration: 500000},
          {name: 'Song Song Serooooo', duration: 290000}
        ]
      },
      {
        name: 'The Best',
        songs: [
          {name: 'NumberwAng Song', duration: 750000},
          {name: 'Second Best Song', duration: 600000},
          {name: 'Still Pretty Okay', duration: 590000}
        ]
      },
      {
        name: 'The Worst',
        songs: [
          {name: 'Sausage Song', duration: 700000},
          {name: 'Wiener Song', duration: 780000},
          {name: 'Texas Hots', duration: 190000}
        ]
      }
    ]
  }
};

class PlaylistCounter extends Component {
  render() {
    return (
      <div style={{...defaultStyle, width: "40%", display:'inline-block'}}>
        <h2>{this.props.playlists.length} playlists</h2>
      </div>
    ) ;
  }
}

class HoursCounter extends Component {
  render() {
    let allSongs = this.props.playlists.reduce((songs, eachPlaylist) => {
      return songs.concat(eachPlaylist.songs) 
    }, []);
    let totalDuration = allSongs.reduce((sum, eachSong) => {
      return sum + eachSong.duration
    }, 0)
    return (
      <div style={{...defaultStyle, width: "40%", display:'inline-block'}}>
        <h2>{((totalDuration/(1000)/(3600)).toFixed(2))} hours</h2>
      </div>
    );
  }
}
class Filter extends Component {
  render() {
    return (
      <div style={defaultStyle}>
        <img/>
        <input type="text"/>
      </div>
    );
  } 
}
class Playlist extends Component {
  render() {
    let playlist = this.props.playlist
    return (
      <div style={{...defaultStyle, 
      display:'inline-block', 
      width: '25%',
      'textAlign': 'left'
      }}>
        <img  />
        <h3>{playlist.name}</h3>
        <ul>
          {playlist.songs.map(song =>
            <li>{song.name}</li>
          )}
        </ul>
      </div>
    );
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {serverData: {}}
  } 
  componentDidMount() {
    setTimeout(() => {
      this.setState({serverData: fakeServerData});  
    }, 1000);
  }
  render() {
    return (
      <div className="App">
        {this.state.serverData.user ?
        
          <div>
            <h1 style={{ ...defaultStyle, 'fontSize': '54px'}}>
              {this.state.serverData.user.name}'s Playlists
            </h1>  
            <PlaylistCounter playlists={this.state.serverData.user.playlists} />
            <HoursCounter playlists={this.state.serverData.user.playlists}/>
            <Filter />
              {this.state.serverData.user.playlists.map(playlist =>
                <Playlist playlist={playlist}/>
              )}
          </div> :

        <h2 style={defaultStyle}>Loading...</h2>
        }
        
      </div>
    );
  }
}

export default App;

import React, { Component } from 'react';
import './App.css';

let defaultStyle = {
  color: '#fff',
  marginBottom: '2rem'
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
      <h2 style={defaultStyle}>
        {this.props.playlists.length} playlists
      </h2>
    );
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
      <h2 style={defaultStyle}>
        {((totalDuration/(1000)/(3600)).toFixed(2))} hours
      </h2>
    );
  }
}

class Filter extends Component {
  render() {
    return (
      <div style={defaultStyle}>
        <img/>
        <input type="text" onKeyUp={event => 
          this.props.onTextChange(event.target.value)}/>
      </div>
    );
  } 
}

class Playlist extends Component {
  render() {
    let playlist = this.props.playlist
    return (
      <div style={{...defaultStyle, 
        alignItems: 'flex-start',
        display: 'flex',
        flexDirection: 'column', 
        marginLeft: '1.2rem',
        textAlign: 'left',
        width: '200px',
        // border: '1px solid pink',
      }}>
        <img />
        <h3 style={{color: '#B9A', marginLeft: '1rem'}}> {playlist.name} </h3>
        <ul style={{
          display: 'flex',
          flexDirection: 'column',
          margin: 0
        }}>
          {playlist.songs.map(song =>
            <li> {song.name} </li>
          )}
        </ul>
      </div>
    );
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      serverData: {},
      filterString: ''
    }
  } 

  componentDidMount() {
    setTimeout(() => {
      this.setState({serverData: fakeServerData});  
    }, 1000);
  }

  render() {
    let playlistsToRender = this.state.serverData.user ? this.state.serverData.user.playlists
      .filter(playlist =>
        playlist.name.toLowerCase().includes(
          this.state.filterString.toLowerCase())
      ) : []

    return (
      <div className="App">
        {this.state.serverData.user ?
          <div>
            <h1 style={{ ...defaultStyle, 'fontSize': '54px'}}>
              {this.state.serverData.user.name}'s Playlists
            </h1>  
            
            <div className="Counters">
              <PlaylistCounter playlists={playlistsToRender} />
            </div>
            
            <div className="Counters">
              <HoursCounter playlists={playlistsToRender} />
            </div>
            
            <Filter onTextChange={text => this.setState({filterString: text})}/>
            
            <div className="PlaylistsContainer">
              {playlistsToRender.map(playlist =>
                <Playlist playlist={playlist} />
              )}
            </div>
          </div> :

        <h2 style={defaultStyle}>Loading...</h2>
        }
        
      </div>
    );
  }
}

export default App;

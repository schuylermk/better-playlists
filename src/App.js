import React, { Component } from 'react';
import './App.css';
import queryString from 'query-string';

let defaultStyle = {
  color: '#fff',
  marginBottom: '2rem'
};

let fakeServerData = {
  user: {
    name: 'Schuyler',
    playlists: [
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
        <img alt=''/>
        <input type='text' onKeyUp={event => 
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
      }}>
        <img src={playlist.imageUrl} alt='playlist cover' />
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
    let parsed = queryString.parse(window.location.search);
    let accessToken = parsed.access_token;

    fetch('https://api.spotify.com/v1/me', {
      headers: {'Authorization': 'Bearer ' + accessToken}
    }).then(response => response.json())
    .then(data => this.setState({
      user: {
        name: data.display_name
      }
    }))
    
    fetch('https://api.spotify.com/v1/me/playlists', {
      headers: {'Authorization': 'Bearer ' + accessToken}
    }).then(response => response.json())
    .then(data => this.setState({
      playlists: data.items.map(item => {
        console.log(data.items)
        return {
          name: item.name,
          imageUrl: item.images[2].url,
          songs: []
        }
      })
    }))

  }

  render() {
    let playlistsToRender = 
    this.state.user &&
    this.state.playlists 
      ? this.state.playlists.filter(playlist =>
        playlist.name.toLowerCase().includes(
          this.state.filterString.toLowerCase()))
      : []
    return (
      <div className="App">
        {this.state.user ?
        <div>
          <h1 style={{ ...defaultStyle, 'fontSize': '54px'}}>
            {this.state.user.name}'s Playlists
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
              <Playlist playlist={playlist} />)}
          </div>        
        </div> :  
        // <h2 style={defaultStyle}>Loading...</h2>
        <button onClick={() => window.location = 'http://localhost:8888/login'}
          style={{'borderRadius': '4px','fontSize': '32px', padding: '8px 16px', 'marginTop': '16px'}}>
          Sign in with Spotify</button>
        }
      </div>
    );
  }
}

export default App;

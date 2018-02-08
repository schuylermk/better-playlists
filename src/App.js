import React, { Component } from 'react';
import './App.css';
import queryString from 'query-string';

let defaultStyle = {
  color: '#fff',
  marginBottom: '2rem'
};

// let fakeServerData = {
//   user: {
//     name: 'Schuyler',
//     playlists: [
//       {
//         name: 'The Worst',
//         songs: [
//           {name: 'Sausage Song', duration: 700000},
//           {name: 'Wiener Song', duration: 780000},
//           {name: 'Texas Hots', duration: 190000}
//         ]
//       }
//     ]
//   }
// };

class PlaylistCounter extends Component {
  render() {
    return (
      <h2 style={defaultStyle}>{this.props.playlists.length} playlists</h2>
    );
  }
}

class HoursCounter extends Component {
  render() {
    let allSongs = this.props.playlists.reduce((songs, eachPlaylist) => {
      return songs.concat(eachPlaylist.songs) 
    }, [])
    let totalDuration = allSongs.reduce((sum, eachSong) => {
      return sum + eachSong.duration
    }, 0)
    let totalDurationHours = Math.round(totalDuration/60)
    return ( 
      <h2 style={defaultStyle}>
        {totalDurationHours} hours
      </h2>
    );
  }
}

class Filter extends Component {
  render() {
    return (
      <div style={defaultStyle}>
        <img alt=''/>
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
      }}>
        <h3 style={{color: '#B9A', marginLeft: '1rem'}}>{playlist.name}</h3>
        <img src={playlist.imageUrl} alt='playlist cover' />
        <ul style={{
          display: 'flex',
          flexDirection: 'column',
          margin: 0
        }}>
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
    this.state = {
      serverData: {},
      filterString: ''
    }
  } 
  componentDidMount() {
    let parsed = queryString.parse(window.location.search);
    let accessToken = parsed.access_token;
    if (!accessToken)
      return;
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
    .then(playlistData => {
        let playlists = playlistData.items
        let trackDataPromises = playlists.map(playlist => {
          let responsePromise = fetch(playlist.tracks.href, {
            headers: { 'Authorization': 'Bearer ' + accessToken }
          })
          let trackDataPromise = responsePromise
            .then(response => response.json())
          return trackDataPromise
        })
        let allTracksDataPromises =
          Promise.all(trackDataPromises)
        let playlistsPromise = allTracksDataPromises.then(trackDatas => {
          trackDatas.forEach((trackData, i) => {
            playlists[i].trackDatas = trackData.items
              .map(item => item.track)
              .map(trackData => ({
                name: trackData.name,
                duration: trackData.duration_ms / 1000
              }))
          })
          return playlists
        })
        return playlistsPromise
      })
      .then(playlists => this.setState({
        playlists: playlists.map(item => {
          return {
            name: item.name,
            imageUrl: item.images[0].url,
            songs: item.trackDatas.slice(0, 3)
          }
        })
      }))

  }
  render() {
    let playlistToRender = 
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
            <PlaylistCounter playlists={playlistToRender} />
          </div>
          <div className="Counters">
            <HoursCounter playlists={playlistToRender} />
          </div>
          <Filter onTextChange={text => {
            this.setState({filterString: text})
          }}/>
          <div className="PlaylistsContainer">
            {playlistToRender.map(playlist =>
              <Playlist playlist={playlist} />
            )}
          </div>        
        </div> : <button onClick={() => {
          window.location = window.location.href.includes('localhost')    
            ? 'http://localhost:8888/login'
            : 'https://protomartinez-backend.herokuapp.com/login'}
          }
          style={{'borderRadius': '4px','fontSize': '32px', padding: '8px 16px', 'marginTop': '16px'}}>Sign in with Spotify</button>
        }
      </div>
    );
  }
}

export default App;

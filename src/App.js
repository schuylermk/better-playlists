import React, { Component } from 'react';
import './App.css';
import queryString from 'query-string';
import Glide from '@glidejs/glide';


let defaultStyle = {
  color: '#404041',
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center'
}

class PlaylistCounter extends Component {
  render() {
    return (
      <h4 style={{defaultStyle}}>{this.props.playlists.length} playlists</h4>
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
    let totalDurationHours = Math.floor(totalDuration / 60) 
    let minutes = Math.floor(totalDuration % 60)
    if (totalDurationHours < 1) {    
      return ( 
        <h4 style={{defaultStyle}}>
          {minutes} minutes
        </h4>
      )
    } else if (2 > totalDurationHours >= 1) {
      return (
        <h4 style={{defaultStyle}}>
          {totalDurationHours} hour, {minutes} minutes
        </h4>
      )
    } else { 
      return (
        <h4 style={{defaultStyle}}>
          {totalDurationHours} hours, {minutes} minutes
        </h4>
      )
    }
  }
}

class Filter extends Component {
  render() {
    return (
      <div style={{
         ...defaultStyle,
        flexDirection: 'row'
      }}>
        <img style={{
          height: '1rem',
          width: '40px'
        }} 
          src="magnifying-glass.svg" alt="" />  
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
    <div className="playlist glide__slide">
      <h4 style={{
        marginBottom: '1rem'
      }}>
      {playlist.name}</h4>
      <img style={{
          height: '', 
          borderRadius: '.2rem'
        }}
        src={playlist.imageUrl} alt='playlist cover' />
      <ol style={{
        display: 'flex',
        flexDirection: 'column',
        margin: '0 0 0 1rem',
        maxHeight: '500px',
        overflowY: 'scroll',
        padding: '1rem',
        width: '82%'
      }}>
        {playlist.songs.map(song =>
          <li>
            {song.name}
          </li>
        )}
      </ol>
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
                duration: ((trackData.duration_ms/1000) / 60)
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
            songs: item.trackDatas
          }
        })
      }))

  }
  render() {
    let playlistToRender = 
    this.state.user &&
    this.state.playlists 
      ? this.state.playlists.filter(playlist => {
        let matchesPlaylist = playlist.name.toLowerCase().includes(
          this.state.filterString.toLowerCase()) 
        let matchesSong = playlist.songs.find(song => song.name.toLowerCase()
          .includes(this.state.filterString.toLowerCase()))
        return matchesPlaylist || matchesSong
      }) : []

    return (
      <div className="App">
        {this.state.user ?
          <div className="mainContainer" 
            style={{
               ...defaultStyle,
              flexDirection: 'row', 
              height: '100vh',
              width: '100vw'
            }}>
            
            <div className="left" style={{
               ...defaultStyle,
              height: '80vh', 
              padding: '2rem', 
              width: '36%'
            }}>
              
              <div className="intro-inner"
                style={{
                  ...defaultStyle,
                  background: 'rgba(193, 29, 29, 0.2)',
                  border: '1px dashed black',
                  borderRadius: '0.5rem',
                  fontSize: '2rem',
                  height: '100%',
                  padding: '2rem',
                  width: '80%'
                }}>
                <h1>
                {this.state.user.name}'s Playlists
                </h1>  
                
                <div className="Counters playCount">
                  <PlaylistCounter playlists={playlistToRender} />
                </div>
                
                <div className="Counters">
                  <HoursCounter playlists={playlistToRender} />
                </div>
              
                <Filter onTextChange={text => {
                  this.setState({filterString: text})
                }}/>

              </div>
            </div> 

            
            <div class="glide right">
              <div data-glide-el="track" class="glide__track">
                <div className="PlaylistsContainer glide__slides">
                  {playlistToRender.map(playlist =>
                    <Playlist playlist={playlist} />
                  )}
                </div>
              </div>
            </div>

          </div>
          : <button onClick={() => window.location = window.location.href.includes('localhost')
            ? 'http://localhost:8888/login'
            : 'https://protomartinez-backend.herokuapp.com/login'
            }
            style={{
              borderRadius: '4px',
              fontSize: '32px',
              padding: '8px 16px',
              marginTop: '16px'
            }}>
            Sign in with Spotify
            </button>
        }
      </div>  
    );
  }
}

export default App;

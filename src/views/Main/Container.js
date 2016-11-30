import React from 'react'
import Map, {GoogleApiWrapper} from 'google-maps-react'

import {searchNearby} from 'utils/googleApiHelpers'
import Header from 'components/Header/Header'

export class Container extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      places: [],
      pagination: null
    }
  }

  onReady(mapProps, map) {
    const google = this.props.google
    const opts = {
      location: map.center,
      radius: '500',
      types: ['cafe']
    }

    searchNearby(google, map, opts)
      .then((results, pagination) => {
        this.setState({
          places: results,
          pagination
        })
      })
      .catch((status, result) => {
        console.log('Error occured', status)
      })
  }

  render() {
    return (
      <div>
        Hello from the container
        <Header />
        <Map
          onReady={this.onReady.bind(this)}
          google={this.props.google}
          visible={false}>

          {this.state.places.map(place => {
            return (<div key={place.id}>{place.name}</div>)
          })}
        </Map>
      </div>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: __GAPI_KEY__
})(Container)

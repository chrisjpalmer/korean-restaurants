import Head from 'next/head'
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'

import mapboxgl, { GeoJSONSource } from 'mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import { ChangeEventHandler, useEffect, useRef, useState } from 'react';
import { Restaurant, RestaurantService } from '@/services/restaurant_service';
import { createCircle } from '@/utils/circle';
import { resolveConfig, Config } from '@/utils/config';
import { css } from '@emotion/css'
import Progress from '@mui/material/CircularProgress';
 
mapboxgl.accessToken = 'pk.eyJ1IjoiY2hyaXNqcGFsbWVyNiIsImEiOiJjbGl2ZXRuaTEwMWdrM2VwNWdlM3d5NnFmIn0.1UA6QogVDzWLngysTtpbEQ';

const startingCoordinates = new mapboxgl.LngLat(127.00280383971557, 37.25706750106049);
const zoomLevel = 12;
const startingRange = 500;

// initialize the services

export const getServerSideProps = (async (context) => {
  const config = resolveConfig();
  return { props: { config } }
}) satisfies GetServerSideProps<{
  config: Config
}>


export default function Home({config} : InferGetServerSidePropsType<typeof getServerSideProps>) {
  let mapContainer = useRef(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const restaurantService = new RestaurantService(config.restaurantServiceUrl)

  const [requestInProgress, setRequestInProgress] = useState(false);
  
  // selection marker
  const selectionMarker = useRef<mapboxgl.Marker | null>(null);
  const [selectionMarkerLatLng, setSelectionMarkerLatLng] = useState<mapboxgl.LngLat | null>(null);

  // range slider
  const [range, setRange] = useState(startingRange);
  const changeRange:ChangeEventHandler<HTMLInputElement> = (event) => {
    setRange(event.target.valueAsNumber);
  };

  // range circle
  const [rangeCircleInitialized, setRangeCircleInitialized] = useState(false);

  // nearest restaurant marker
  const nearestRstMarker = useRef<mapboxgl.Marker | null>(null);
  const [nearestRst, setNearestRst] = useState<Restaurant | null>(null);

  // findNearestRestaurant
  const findNearest = async () => {
    if(!map.current) return;
    if(!selectionMarkerLatLng) {
      console.log('selectionMarker not set... skipping')
      return;
    }
    setRequestInProgress(true);
    try {
      let restaurants = await restaurantService.FindRestaurants(selectionMarkerLatLng.lng, selectionMarkerLatLng.lat, range);
      setRequestInProgress(false);
      if(restaurants.length == 0) {
        setNearestRst(null)
      } else {
        setNearestRst(restaurants[0])
      }
    } catch(e) {
      console.log("error occurred while finding restaurants", e)
      setRequestInProgress(false);
    }
    
  }

  //setting the map
  useEffect(() => {
    if (!mapContainer.current) return;
    if (map.current) return; // initialize map only once

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: startingCoordinates,
        zoom: zoomLevel
      });

      map.current.on('load', () => {
        if(!map.current) {
          return
        }
        map.current.on('dragend', e => {
          if(!map.current) {
            return
          }
          console.log(map.current.getCenter())
        })
        map.current.addLayer({
            id: 'restaurants',
            type: 'circle',
            source: {
                type: 'geojson',
                data: './korean_restaurants.geojson'
            },
            paint: {
              "circle-color": "#FF0000",
              "circle-radius": 5,
            }
        });

        map.current.on('click', (e) => {
            setSelectionMarkerLatLng(e.lngLat);
        })
    });
  });

  // setting the selection marker
  useEffect(() => {
    if(!map.current) return;
    if (!selectionMarkerLatLng) return;

    // update the marker
    if (!!selectionMarker.current) {
      selectionMarker.current.setLngLat(selectionMarkerLatLng)
      return;
    }

    // create the marker
    selectionMarker.current = new mapboxgl.Marker()
      .setDraggable(true)
      .setLngLat(selectionMarkerLatLng)
      .on('drag', (e:any) => {
        if(!selectionMarker.current) return;
        setSelectionMarkerLatLng(selectionMarker.current.getLngLat())
      })
      .addTo(map.current);
  });

   // set the range circle
   useEffect(() => {
    if(!map.current) return;
    if (!selectionMarkerLatLng) return;
    
    let circle = createCircle(selectionMarkerLatLng, range);
    if (!rangeCircleInitialized) {
      map.current.addSource('range-circle', circle);
      map.current.addLayer({
          id: 'range-circle',
          type: 'fill',
          source: 'range-circle',
          paint: {
            "fill-color": "#0000FF",
            "fill-opacity": 0.3,
          }
      });
      setRangeCircleInitialized(true);
    } else {
      let rangeCircle:GeoJSONSource = map.current.getSource('range-circle') as GeoJSONSource;
      rangeCircle.setData(circle.data as GeoJSON.FeatureCollection<GeoJSON.Geometry>);
    }
  })

  // setting the nearestRst marker
  useEffect(() => {
    if(!map.current) return;
    if (!nearestRst) {
      //if no nearestRst... remove the marker
      nearestRstMarker.current?.remove()
      nearestRstMarker.current = null;
      return;
    };

    // update the marker
    let coord = nearestRst.coordinates;
    let lnglat = new mapboxgl.LngLat(coord.lon, coord.lat);
    if (!!nearestRstMarker.current) {
      nearestRstMarker.current.setLngLat(lnglat)
      return;
    }

    // create the marker
    nearestRstMarker.current = new mapboxgl.Marker(
      {color: "#ff0000"}
    )
      .setLngLat(lnglat)
      .addTo(map.current);
  });

 

  return (
    <>
    <Head>
      <link href='https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css' rel='stylesheet' />
    </Head>
    <main>
      <div ref={mapContainer} className="map-container" />
      <div className="controls">
        <label className="help-text">Click anywhere to add a marker.</label>
        <label className="help-text">Click Find Nearest to see the nearest restaurant to your marker <b>within the range</b>. (restaurants are red dots)</label>
        <label className="help-text">Adjust the slider to adjust the range.</label>
        <label className="range">
          <input type="range" min="0" max="2000" onChange={changeRange} value={range}></input> {range}m
          <button className="find" disabled={!selectionMarkerLatLng} onClick={findNearest}>Find Nearest</button>
          {requestInProgress ? (
            <Progress size={27} className={css`
            position:relative;
            top: 10px;
            margin-left: 7px;
            `}
            sx={{
              color: "#5cb0ff"
            }}></Progress>
          ) : <></>}
        </label>
        
        {(!!nearestRst) ? 
          (
          <div className="nearest-restaurant-info">
            <label className="name"><b>Found a restaurant!</b></label>
            <label className="name"><b>Name:</b> {nearestRst.name}</label>
            <label className="name"><b>Description:</b> {nearestRst.description}</label>
          </div>
          ) : <></>
        }
      </div>

    </main>
    </>
  )
}

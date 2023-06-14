# Korean Restaurants F/E

This is a simple app to help me find my favourite korean restaurants. I live in Korea and I like to eat great food! This app will help me not to get hungry!

![](./screenshot.png)

The accompanying B/E project for this is
[here](https://github.com/chrisjpalmer/korean-restaurants-be).

## Getting Started

### Requirements
- Docker
- Node JS (I used v18)

### Run the F/E app

```bash
git clone https://github.com/chrisjpalmer/korean-restaurants
cd korean-restaurants
npm install
npm run dev
```

### Run the B/E app

```bash
git clone https://github.com/chrisjpalmer/korean-restaurants-be
cd korean-restaurants-be
```

If you are a Makefile person:

```sh
make database
make build-docker
make serve-docker
```

If you are not a Makefile person:

```sh
./scripts/make-database.sh
./scripts/build-docker.sh
./scripts/serve-docker.sh
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## The Brief

I read
[this article](https://www.linkedin.com/pulse/right-size-your-geospatial-data-architecture-vector-michael-asher/?utm_source=share&utm_medium=member_ios&utm_campaign=share_via)
by Michael Asher and wanted to see how quickly I could pick up a new software
stack. I have never used postgis, mapbox, ogr2ogr OR geojson before. I'm also
not a F/E developer by trade.

I came up with a simple concept, to build an app that could showcase my
favourite korean restaurants and tell me where the closest one was - this is
rather helpful as I live in Korea (at least for the next 12 months).

I spent in total 16 hours comprised of:

- 4 hours of initial research
- 4 hours on the B/E
- 8 hours on the F/E

To build this, the steps I took were.

1. Plotted my favourite korean restaurants on google earth
2. Converted the KML file to GeoJSON using ogr2ogr
3. Loaded the GeoJSON into a Postgis enabled database using ogr2ogr.
4. Tested out some queries to familiarize myself with Postgis
5. Built a simple B/E to query the database.
6. Built a basic F/E app using react + mapbox.
7. Wired up my B/E and F/E

## Stuff Learnt

- Postgis
- Mapbox
- Ogr2Ogr
- GeoJSON
- Bit more react

## Why you should hire me ?

- I am a fast learner - learnt postgis, mapbox, ogr2ogr in a few hours
- I am versatile with technical detail
- I like to GSD (get stuff done) - if you dont ship it, you don't make money.
- I am organized - comments, code organization, documentation, diagrams are part
  of my trade.

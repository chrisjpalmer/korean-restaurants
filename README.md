# Korean Restaurants

This is a simple app to help me find my favourite korean restaurants. I live in
Korea and I like to eat great food! This app will help me not to get hungry!

View it live here: https://korean-restaurants-x1ncq0w8e0jnm.cpln.app/ . _Be
kind, its serverless so refresh a few times to trigger the first container
coming online (I'm a starving engineer)_. Hosted on **[Control Plane](https://controlplane.com)**

![](./screenshot.png)

The accompanying B/E project for this is
[here](https://github.com/chrisjpalmer/korean-restaurants-be).

## Getting Started

### Requirements

- Docker
- Node JS (I used v18)
- Port 3000 & 3001 free on your machine

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

## How it works

- A list of korean restaurants in geojson format is statically served to the
  F/E. These are displayed on the map when the app loads.
- To find the nearest korean restaurant to the marker point, the B/E service
  queries the postgres database which contains the same list of restaurants.

## The Brief

I read
[this article](https://www.linkedin.com/pulse/right-size-your-geospatial-data-architecture-vector-michael-asher/?utm_source=share&utm_medium=member_ios&utm_campaign=share_via)
by Michael Asher and wanted to see how quickly I could pick up a new software
stack. I have never used postgis, mapbox, ogr2ogr OR geojson before. I'm also
not a F/E developer by trade.

I came up with a simple concept, to build an app that could showcase my
favourite korean restaurants and tell me where the closest one was - this is
rather helpful as I live in Korea (at least for the next 12 months).

I spent in total 18 hours comprised of:

- 4 hours of initial research
- 4 hours on the B/E
- 8 hours on the F/E
- 2 hours of bug fixing/polishing/testing

To build this, the steps I took were.

1. Plotted my favourite korean restaurants on google earth
2. Converted the KML file to GeoJSON using ogr2ogr
3. Loaded the GeoJSON into a Postgis enabled database using ogr2ogr.
4. Tested out some queries to familiarize myself with Postgis
5. Built a simple B/E to query the database.
6. Built a basic F/E app using react + mapbox.
7. Wired up my B/E and F/E

**_Update: CI/CD with Control Plane_**

All commits after June 15 were to set up my hosting on
[Control Plane](https://controlplane.com/). The commit history is a bit of a
mess because I was just having some fun at this point.

I have implemented a continuous delivery pipeline that deploys to
[Control Plane](https://controlplane.com/). It does the following steps:

1. Builds a docker image
2. Runs trivy image scan
3. Publishes the docker image
4. Creates a Control Plane workload file
5. Applies it to Control Plane.

Control Plane is a tool that allows you to orchestrate multiple kubernetes
clusters across clouds, implementing the best DevSecOps practices under the hood
for you. My services are running serverless in both GCP, and AWS. Read more
[here](https://docs.controlplane.com/whatis).

## Stuff Learnt

- Postgis
- Mapbox
- Ogr2Ogr
- GeoJSON
- Bit more react

## Why should you hire me ?

- I am a fast learner - learnt postgis, mapbox, ogr2ogr in a few hours
- I am versatile with technical detail
- I like to GSD (get stuff done) - if you dont ship it, you don't make money.
- I am organized - comments, code organization, documentation, diagrams are part
  of my trade.

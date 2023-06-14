export class RestaurantService {
    constructor(private url: string) {}

    public async FindRestaurants(lon:number, lat:number, withinMeters:number): Promise<Restaurant[]> {
        let rs = await this.exec<FindRestaurantsResponse>(`/restaurant?nearby=${lon},${lat}&within_meters=${withinMeters}`);
        return rs.restaurants;
    }

    private async exec<D>(resource: string): Promise<D>{
        let rs:Response;
        try {
           rs = await fetch(this.url + resource)
        } catch(e) {
            throw new Error(`${e}`)
        }
        if(!rs.ok) {
            let ers = <ErrorResponse> <any>rs.json();
            throw new Error(ers.error)
        } else {
            return rs.json();
        }
    }
}

export class Error {
    constructor(public error:string){}
}

export interface ErrorResponse {
    error: string;
}

export interface FindRestaurantsResponse {
    restaurants: Restaurant[];
}

export interface Restaurant {
    name: string
    description: string;
    coordinates: Coordinates;
}

export interface Coordinates {
    lat: number;
    lon: number;
}

import { env } from "process";

export interface Config {
    restaurantServiceUrl: string;
}

export function resolveConfig() :Config {
    if(!env.RESTAURANT_SERVICE_URL) {
        throw 'RESTAURANT_SERVICE_URL not defined'
    }
    return {
        restaurantServiceUrl:  env.RESTAURANT_SERVICE_URL,
    };
}
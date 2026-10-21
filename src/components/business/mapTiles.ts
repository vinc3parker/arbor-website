// Basemap tiles for Leaflet maps. Production uses Mapbox raster tiles (commercial
// use is allowed within Mapbox's free allowance; billed beyond it). Without a
// token we fall back to OpenStreetMap's public tiles, which are only suitable
// for local development under the OSM tile usage policy.
//
// NEXT_PUBLIC_MAPBOX_TOKEN  public (pk.) token, restricted to Arbor's domains
// NEXT_PUBLIC_MAPBOX_STYLE  optional, default "mapbox/light-v11"

const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN?.trim();
const style = process.env.NEXT_PUBLIC_MAPBOX_STYLE?.trim() || "mapbox/light-v11";

export type TileConfig = {
  url: string;
  attribution: string;
  tileSize?: number;
  zoomOffset?: number;
  maxZoom: number;
};

export const MAP_TILES: TileConfig = token
  ? {
      // 512 px tiles need a quarter of the requests of 256 px ones.
      url: `https://api.mapbox.com/styles/v1/${style}/tiles/512/{z}/{x}/{y}@2x?access_token=${encodeURIComponent(token)}`,
      attribution:
        '&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank" rel="noreferrer">Improve this map</a></strong>',
      tileSize: 512,
      zoomOffset: -1,
      maxZoom: 20,
    }
  : {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    };

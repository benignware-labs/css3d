import { Vector3 } from "./Vector3.mjs";

export const clamp = ( value, min, max ) => Math.max( min, Math.min( max, value ) );

export const rad2deg = ( radians ) => radians * 180 / Math.PI;

export const deg2rad = ( degrees ) => degrees * Math.PI / 180;

export const centroid = ( ...vectors ) => {
  const sum = vectors.reduce( ( sum, vector ) => sum.add( vector ), new Vector3() );
  return sum.divide( vectors.length );
};

// export const centroid = (...vectors) => {
//   const sum = vectors.reduce((sum, vector) => sum.add(vector), new Vector3());
//   return sum.divide(vectors.length);
// }

export const euler = (x, y, z) => {
  const c1 = Math.cos(x / 2);
  const c2 = Math.cos(y / 2);
  const c3 = Math.cos(z / 2);
  const s1 = Math.sin(x / 2);
  const s2 = Math.sin(y / 2);
  const s3 = Math.sin(z / 2);

  return [
    s1 * c2 * c3 + c1 * s2 * s3,
    c1 * s2 * c3 - s1 * c2 * s3,
    c1 * c2 * s3 + s1 * s2 * c3,
    c1 * c2 * c3 - s1 * s2 * s3
  ];
}

export const convhulln = (points) => {
  const n = points.length;
  const indices = new Array(n).fill(0).map((_, i) => i);
  const hull = new Array(n).fill(0);
  let m = 0;

  for (let i = 0; i < n; i++) {
    while (m >= 2 && cross(points[hull[m - 2]], points[hull[m - 1]], points[i]) <= 0) {
      m--;
    }

    hull[m++] = i;
  }

  let k = m;

  for (let i = n - 2; i >= 0; i--) {
    while (m >= k && cross(points[hull[m - 2]], points[hull[m - 1]], points[i]) <= 0) {
      m--;
    }

    hull[m++] = i;
  }

  return hull.slice(0, m - 1);
};
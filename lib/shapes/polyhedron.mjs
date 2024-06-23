import qh_def from 'quickhull3d';
import { centroid, rad2deg } from '../math/utils.mjs';
import { Vector3 } from '../math/Vector3.mjs';

const qh = qh_def['default'];

export const polyhedron = (points) => {
  console.log('polyhedron...', points);
  points = points.map(point => [...point]);
  points = points.filter((point, index) => points.findIndex(p => p.join() === point.join()) === index);

  if (points.length < 4) {
    return '';
  }

  console.log('points', points);
  const faces = qh(points)
    .map(face => face.map(index => points[index]))
    .map(face => face.map(point => new Vector3(...point)))
    .map((face, index) => {
      const [a, b, c] = face;
      const center = centroid(a, b, c);

      const normal = b.clone().sub(a).cross(c.clone().sub(a)).normalize();
      const angle = Math.acos(normal.z);
      const axis = normal.clone().cross(new Vector3(0, 0, -1)).normalize();

      const points2d = face.map(point => point.clone().sub(center).applyAxisAngle(axis, -angle));

      const minX = Math.min(...points2d.map(point => point.x));
      const minY = Math.min(...points2d.map(point => point.y));
      const maxX = Math.max(...points2d.map(point => point.x));
      const maxY = Math.max(...points2d.map(point => point.y));

      const width = maxX - minX;
      const height = maxY - minY;

      const shiftX = minX + width / 2;
      const shiftY = minY + height / 2;

      const local2d = points2d.map(point => new Vector3(point.x - minX, point.y - minY, 0));

      const clipPath = `polygon(${local2d.map(point => `${point.x}px ${point.y}px`).join(', ')})`;

      const transform = `
        translate(-50%, -50%)
        translate3d(${center.x}px, ${center.y}px, ${center.z}px)
        rotate3d(${axis.x}, ${axis.y}, ${axis.z}, ${rad2deg(angle)}deg)
        translate(${shiftX}px, ${shiftY}px)
      `;

      return `
        <div
          class="face"
          style="
            width: ${width}px;
            height: ${height}px;
            transform:  ${transform};
            clip-path: ${clipPath};
          "
        >
        </div>
      `
    })
    
  return `
    <style scoped>
      :host {
        --background: rgba(0, 255, 255, 0.5);
        cursor: pointer;
      }

      .face {
        position: absolute;
        left: 0;
        top: 0;
        transform-style: preserve-3d;
        transform-origin: center;
        background: var(--background);
        /*backface-visibility: hidden;*/
        
      }

    </style>
    ${faces.join('')}
  `;
}

import { Camera } from './Camera.mjs';

const DEG2RAD = Math.PI / 180;

class PerspectiveCamera extends Camera {
	constructor( fov = 50, aspect = 1, near = 0.1, far = 2000 ) {
		super();

		this.isPerspectiveCamera = true;
		this.fov = fov;
		this.zoom = 1;
		this.near = near;
		this.far = far;
		this.focus = 10;
		this.aspect = aspect;
		this.view = null;
		this.filmGauge = 35;	// width of the film (default in millimeters)
		this.filmOffset = 0;	// horizontal film offset (same unit as gauge)

		this.updateProjectionMatrix();
	}

	updateProjectionMatrix() {
		const near = this.near;
		let top = near * Math.tan( DEG2RAD * 0.5 * this.fov ) / this.zoom;
		let height = 2 * top;
		let width = this.aspect * height;
		let left = - 0.5 * width;

		const skew = this.filmOffset;
		if ( skew !== 0 ) left += near * skew / this.getFilmWidth();

		this.projectionMatrix.makePerspective( left, left + width, top, top - height, near, this.far, this.coordinateSystem );

		this.projectionMatrixInverse.copy( this.projectionMatrix ).invert();
	}
}

export { PerspectiveCamera };
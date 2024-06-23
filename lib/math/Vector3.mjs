import { clamp } from './utils.mjs';
import { Quaternion } from './Quaternion.mjs';

class Vector3 {
	constructor( x = 0, y = 0, z = 0 ) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	set( x, y, z ) {
		if ( z === undefined ) z = this.z; // sprite.scale.set(x,y)

		this.x = x;
		this.y = y;
		this.z = z;

		return this;
	}

	clone() {
		return new this.constructor( this.x, this.y, this.z );
	}

	copy( v ) {
		this.x = v.x;
		this.y = v.y;
		this.z = v.z;

		return this;
	}

	add( v ) {
		return new Vector3( this.x + v.x, this.y + v.y, this.z + v.z );
	}

	divide( v ) {
		v = typeof v === 'number' ? new Vector3( v, v, v ) : v;
		return new Vector3( this.x / v.x, this.y / v.y, this.z / v.z );
	}

	dot( v ) {
		return this.x * v.x + this.y * v.y + this.z * v.z;
	}

	equals( v ) {
		return v.x === this.x && v.y === this.y && v.z === this.z;
	}

	cross( v ) {
		return new Vector3(
			this.y * v.z - this.z * v.y,
			this.z * v.x - this.x * v.z,
			this.x * v.y - this.y * v.x
		);
	}

	rotateX( angle ) {
		const cos = Math.cos( angle );
		const sin = Math.sin( angle );

		const y = this.y * cos - this.z * sin;
		const z = this.y * sin + this.z * cos;

		return new Vector3( this.x, y, z );
	}

	rotateY( angle ) {
		const cos = Math.cos( angle );
		const sin = Math.sin( angle );

		const x = this.x * cos - this.z * sin;
		const z = this.x * sin + this.z * cos;

		return new Vector3( x, this.y, z );
	}

	rotateZ( angle ) {
		const cos = Math.cos( angle );
		const sin = Math.sin( angle );

		const x = this.x * cos - this.y * sin;
		const y = this.x * sin + this.y * cos;

		return new Vector3( x, y, this.z );
	}
	

	valueOf() {
		return [ this.x, this.y, this.z ];
	}

	toString() {
		return `(${this.x}, ${this.y}, ${this.z})`;
	}

	applyAxisAngle( axis, angle ) {
		const quaternion = new Quaternion().setFromAxisAngle( axis, angle );
		return this.applyQuaternion( quaternion );
	}

	applyQuaternion( q ) {
		const x = this.x, y = this.y, z = this.z;
		const qx = q.x, qy = q.y, qz = q.z, qw = q.w;

		// calculate quat * vector

		const ix = qw * x + qy * z - qz * y;
		const iy = qw * y + qz * x - qx * z;
		const iz = qw * z + qx * y - qy * x;
		const iw = - qx * x - qy * y - qz * z;

		// calculate result * inverse quat

		this.x = ix * qw + iw * - qx + iy * - qz - iz * - qy;
		this.y = iy * qw + iw * - qy + iz * - qx - ix * - qz;
		this.z = iz * qw + iw * - qz + ix * - qy - iy * - qx;

		return this;
	}

	subVectors( a, b ) {
		this.x = a.x - b.x;
		this.y = a.y - b.y;
		this.z = a.z - b.z;

		return this;
	}

	multiplyScalar( scalar ) {
		this.x *= scalar;
		this.y *= scalar;
		this.z *= scalar;

		return this;
	}

	divideScalar( scalar ) {
		return this.multiplyScalar( 1 / scalar );
	}

	lengthSq() {
		return this.x * this.x + this.y * this.y + this.z * this.z;
	}

	length() {
		return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z );
	}

	normalize() {
		return this.divideScalar( this.length() || 1 );
	}

	sub( v ) {
		this.x -= v.x;
		this.y -= v.y;
		this.z -= v.z;

		return this;
	}

	crossVectors( a, b ) {
		const ax = a.x, ay = a.y, az = a.z;
		const bx = b.x, by = b.y, bz = b.z;

		this.x = ay * bz - az * by;
		this.y = az * bx - ax * bz;
		this.z = ax * by - ay * bx;

		return this;
	}

	setFromMatrixPosition( m ) {
		const e = m.elements;

		this.x = e[ 12 ];
		this.y = e[ 13 ];
		this.z = e[ 14 ];

		return this;
	}

	*[ Symbol.iterator ]() {
		yield this.x;
		yield this.y;
		yield this.z;
	}

}

export { Vector3 };
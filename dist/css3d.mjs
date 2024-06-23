const clamp = ( value, min, max ) => Math.max( min, Math.min( max, value ) );

const rad2deg = ( radians ) => radians * 180 / Math.PI;

const centroid = ( ...vectors ) => {
  const sum = vectors.reduce( ( sum, vector ) => sum.add( vector ), new Vector3() );
  return sum.divide( vectors.length );
};

class Quaternion {

	constructor( x = 0, y = 0, z = 0, w = 1 ) {

		this.isQuaternion = true;

		this._x = x;
		this._y = y;
		this._z = z;
		this._w = w;

	}

	static slerpFlat( dst, dstOffset, src0, srcOffset0, src1, srcOffset1, t ) {

		// fuzz-free, array-based Quaternion SLERP operation

		let x0 = src0[ srcOffset0 + 0 ],
			y0 = src0[ srcOffset0 + 1 ],
			z0 = src0[ srcOffset0 + 2 ],
			w0 = src0[ srcOffset0 + 3 ];

		const x1 = src1[ srcOffset1 + 0 ],
			y1 = src1[ srcOffset1 + 1 ],
			z1 = src1[ srcOffset1 + 2 ],
			w1 = src1[ srcOffset1 + 3 ];

		if ( t === 0 ) {

			dst[ dstOffset + 0 ] = x0;
			dst[ dstOffset + 1 ] = y0;
			dst[ dstOffset + 2 ] = z0;
			dst[ dstOffset + 3 ] = w0;
			return;

		}

		if ( t === 1 ) {

			dst[ dstOffset + 0 ] = x1;
			dst[ dstOffset + 1 ] = y1;
			dst[ dstOffset + 2 ] = z1;
			dst[ dstOffset + 3 ] = w1;
			return;

		}

		if ( w0 !== w1 || x0 !== x1 || y0 !== y1 || z0 !== z1 ) {

			let s = 1 - t;
			const cos = x0 * x1 + y0 * y1 + z0 * z1 + w0 * w1,
				dir = ( cos >= 0 ? 1 : - 1 ),
				sqrSin = 1 - cos * cos;

			// Skip the Slerp for tiny steps to avoid numeric problems:
			if ( sqrSin > Number.EPSILON ) {

				const sin = Math.sqrt( sqrSin ),
					len = Math.atan2( sin, cos * dir );

				s = Math.sin( s * len ) / sin;
				t = Math.sin( t * len ) / sin;

			}

			const tDir = t * dir;

			x0 = x0 * s + x1 * tDir;
			y0 = y0 * s + y1 * tDir;
			z0 = z0 * s + z1 * tDir;
			w0 = w0 * s + w1 * tDir;

			// Normalize in case we just did a lerp:
			if ( s === 1 - t ) {

				const f = 1 / Math.sqrt( x0 * x0 + y0 * y0 + z0 * z0 + w0 * w0 );

				x0 *= f;
				y0 *= f;
				z0 *= f;
				w0 *= f;

			}

		}

		dst[ dstOffset ] = x0;
		dst[ dstOffset + 1 ] = y0;
		dst[ dstOffset + 2 ] = z0;
		dst[ dstOffset + 3 ] = w0;

	}

	static multiplyQuaternionsFlat( dst, dstOffset, src0, srcOffset0, src1, srcOffset1 ) {

		const x0 = src0[ srcOffset0 ];
		const y0 = src0[ srcOffset0 + 1 ];
		const z0 = src0[ srcOffset0 + 2 ];
		const w0 = src0[ srcOffset0 + 3 ];

		const x1 = src1[ srcOffset1 ];
		const y1 = src1[ srcOffset1 + 1 ];
		const z1 = src1[ srcOffset1 + 2 ];
		const w1 = src1[ srcOffset1 + 3 ];

		dst[ dstOffset ] = x0 * w1 + w0 * x1 + y0 * z1 - z0 * y1;
		dst[ dstOffset + 1 ] = y0 * w1 + w0 * y1 + z0 * x1 - x0 * z1;
		dst[ dstOffset + 2 ] = z0 * w1 + w0 * z1 + x0 * y1 - y0 * x1;
		dst[ dstOffset + 3 ] = w0 * w1 - x0 * x1 - y0 * y1 - z0 * z1;

		return dst;

	}

	get x() {

		return this._x;

	}

	set x( value ) {

		this._x = value;
		this._onChangeCallback();

	}

	get y() {

		return this._y;

	}

	set y( value ) {

		this._y = value;
		this._onChangeCallback();

	}

	get z() {

		return this._z;

	}

	set z( value ) {

		this._z = value;
		this._onChangeCallback();

	}

	get w() {

		return this._w;

	}

	set w( value ) {

		this._w = value;
		this._onChangeCallback();

	}

	set( x, y, z, w ) {

		this._x = x;
		this._y = y;
		this._z = z;
		this._w = w;

		this._onChangeCallback();

		return this;

	}

	clone() {

		return new this.constructor( this._x, this._y, this._z, this._w );

	}

	copy( quaternion ) {

		this._x = quaternion.x;
		this._y = quaternion.y;
		this._z = quaternion.z;
		this._w = quaternion.w;

		this._onChangeCallback();

		return this;

	}

	setFromEuler( euler, update = true ) {

		const x = euler._x, y = euler._y, z = euler._z, order = euler._order;

		// http://www.mathworks.com/matlabcentral/fileexchange/
		// 	20696-function-to-convert-between-dcm-euler-angles-quaternions-and-euler-vectors/
		//	content/SpinCalc.m

		const cos = Math.cos;
		const sin = Math.sin;

		const c1 = cos( x / 2 );
		const c2 = cos( y / 2 );
		const c3 = cos( z / 2 );

		const s1 = sin( x / 2 );
		const s2 = sin( y / 2 );
		const s3 = sin( z / 2 );

		switch ( order ) {

			case 'XYZ':
				this._x = s1 * c2 * c3 + c1 * s2 * s3;
				this._y = c1 * s2 * c3 - s1 * c2 * s3;
				this._z = c1 * c2 * s3 + s1 * s2 * c3;
				this._w = c1 * c2 * c3 - s1 * s2 * s3;
				break;

			case 'YXZ':
				this._x = s1 * c2 * c3 + c1 * s2 * s3;
				this._y = c1 * s2 * c3 - s1 * c2 * s3;
				this._z = c1 * c2 * s3 - s1 * s2 * c3;
				this._w = c1 * c2 * c3 + s1 * s2 * s3;
				break;

			case 'ZXY':
				this._x = s1 * c2 * c3 - c1 * s2 * s3;
				this._y = c1 * s2 * c3 + s1 * c2 * s3;
				this._z = c1 * c2 * s3 + s1 * s2 * c3;
				this._w = c1 * c2 * c3 - s1 * s2 * s3;
				break;

			case 'ZYX':
				this._x = s1 * c2 * c3 - c1 * s2 * s3;
				this._y = c1 * s2 * c3 + s1 * c2 * s3;
				this._z = c1 * c2 * s3 - s1 * s2 * c3;
				this._w = c1 * c2 * c3 + s1 * s2 * s3;
				break;

			case 'YZX':
				this._x = s1 * c2 * c3 + c1 * s2 * s3;
				this._y = c1 * s2 * c3 + s1 * c2 * s3;
				this._z = c1 * c2 * s3 - s1 * s2 * c3;
				this._w = c1 * c2 * c3 - s1 * s2 * s3;
				break;

			case 'XZY':
				this._x = s1 * c2 * c3 - c1 * s2 * s3;
				this._y = c1 * s2 * c3 - s1 * c2 * s3;
				this._z = c1 * c2 * s3 + s1 * s2 * c3;
				this._w = c1 * c2 * c3 + s1 * s2 * s3;
				break;

			default:
				console.warn( 'THREE.Quaternion: .setFromEuler() encountered an unknown order: ' + order );

		}

		if ( update === true ) this._onChangeCallback();

		return this;

	}

	setFromAxisAngle( axis, angle ) {

		// http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm

		// assumes axis is normalized

		const halfAngle = angle / 2, s = Math.sin( halfAngle );

		this._x = axis.x * s;
		this._y = axis.y * s;
		this._z = axis.z * s;
		this._w = Math.cos( halfAngle );

		this._onChangeCallback();

		return this;

	}

	setFromRotationMatrix( m ) {

		// http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm

		// assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

		const te = m.elements,

			m11 = te[ 0 ], m12 = te[ 4 ], m13 = te[ 8 ],
			m21 = te[ 1 ], m22 = te[ 5 ], m23 = te[ 9 ],
			m31 = te[ 2 ], m32 = te[ 6 ], m33 = te[ 10 ],

			trace = m11 + m22 + m33;

		if ( trace > 0 ) {

			const s = 0.5 / Math.sqrt( trace + 1.0 );

			this._w = 0.25 / s;
			this._x = ( m32 - m23 ) * s;
			this._y = ( m13 - m31 ) * s;
			this._z = ( m21 - m12 ) * s;

		} else if ( m11 > m22 && m11 > m33 ) {

			const s = 2.0 * Math.sqrt( 1.0 + m11 - m22 - m33 );

			this._w = ( m32 - m23 ) / s;
			this._x = 0.25 * s;
			this._y = ( m12 + m21 ) / s;
			this._z = ( m13 + m31 ) / s;

		} else if ( m22 > m33 ) {

			const s = 2.0 * Math.sqrt( 1.0 + m22 - m11 - m33 );

			this._w = ( m13 - m31 ) / s;
			this._x = ( m12 + m21 ) / s;
			this._y = 0.25 * s;
			this._z = ( m23 + m32 ) / s;

		} else {

			const s = 2.0 * Math.sqrt( 1.0 + m33 - m11 - m22 );

			this._w = ( m21 - m12 ) / s;
			this._x = ( m13 + m31 ) / s;
			this._y = ( m23 + m32 ) / s;
			this._z = 0.25 * s;

		}

		this._onChangeCallback();

		return this;

	}

	setFromUnitVectors( vFrom, vTo ) {

		// assumes direction vectors vFrom and vTo are normalized

		let r = vFrom.dot( vTo ) + 1;

		if ( r < Number.EPSILON ) {

			// vFrom and vTo point in opposite directions

			r = 0;

			if ( Math.abs( vFrom.x ) > Math.abs( vFrom.z ) ) {

				this._x = - vFrom.y;
				this._y = vFrom.x;
				this._z = 0;
				this._w = r;

			} else {

				this._x = 0;
				this._y = - vFrom.z;
				this._z = vFrom.y;
				this._w = r;

			}

		} else {

			// crossVectors( vFrom, vTo ); // inlined to avoid cyclic dependency on Vector3

			this._x = vFrom.y * vTo.z - vFrom.z * vTo.y;
			this._y = vFrom.z * vTo.x - vFrom.x * vTo.z;
			this._z = vFrom.x * vTo.y - vFrom.y * vTo.x;
			this._w = r;

		}

		return this.normalize();

	}

	angleTo( q ) {
		return 2 * Math.acos( Math.abs( clamp( this.dot( q ), - 1, 1 ) ) );
	}

	rotateTowards( q, step ) {

		const angle = this.angleTo( q );

		if ( angle === 0 ) return this;

		const t = Math.min( 1, step / angle );

		this.slerp( q, t );

		return this;

	}

	identity() {

		return this.set( 0, 0, 0, 1 );

	}

	invert() {

		// quaternion is assumed to have unit length

		return this.conjugate();

	}

	conjugate() {

		this._x *= - 1;
		this._y *= - 1;
		this._z *= - 1;

		this._onChangeCallback();

		return this;

	}

	dot( v ) {

		return this._x * v._x + this._y * v._y + this._z * v._z + this._w * v._w;

	}

	lengthSq() {

		return this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w;

	}

	length() {

		return Math.sqrt( this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w );

	}

	normalize() {

		let l = this.length();

		if ( l === 0 ) {

			this._x = 0;
			this._y = 0;
			this._z = 0;
			this._w = 1;

		} else {

			l = 1 / l;

			this._x = this._x * l;
			this._y = this._y * l;
			this._z = this._z * l;
			this._w = this._w * l;

		}

		this._onChangeCallback();

		return this;

	}

	multiply( q ) {

		return this.multiplyQuaternions( this, q );

	}

	premultiply( q ) {

		return this.multiplyQuaternions( q, this );

	}

	multiplyQuaternions( a, b ) {

		// from http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm

		const qax = a._x, qay = a._y, qaz = a._z, qaw = a._w;
		const qbx = b._x, qby = b._y, qbz = b._z, qbw = b._w;

		this._x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
		this._y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
		this._z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
		this._w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;

		this._onChangeCallback();

		return this;

	}

	slerp( qb, t ) {

		if ( t === 0 ) return this;
		if ( t === 1 ) return this.copy( qb );

		const x = this._x, y = this._y, z = this._z, w = this._w;

		// http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/

		let cosHalfTheta = w * qb._w + x * qb._x + y * qb._y + z * qb._z;

		if ( cosHalfTheta < 0 ) {

			this._w = - qb._w;
			this._x = - qb._x;
			this._y = - qb._y;
			this._z = - qb._z;

			cosHalfTheta = - cosHalfTheta;

		} else {

			this.copy( qb );

		}

		if ( cosHalfTheta >= 1.0 ) {

			this._w = w;
			this._x = x;
			this._y = y;
			this._z = z;

			return this;

		}

		const sqrSinHalfTheta = 1.0 - cosHalfTheta * cosHalfTheta;

		if ( sqrSinHalfTheta <= Number.EPSILON ) {

			const s = 1 - t;
			this._w = s * w + t * this._w;
			this._x = s * x + t * this._x;
			this._y = s * y + t * this._y;
			this._z = s * z + t * this._z;

			this.normalize(); // normalize calls _onChangeCallback()

			return this;

		}

		const sinHalfTheta = Math.sqrt( sqrSinHalfTheta );
		const halfTheta = Math.atan2( sinHalfTheta, cosHalfTheta );
		const ratioA = Math.sin( ( 1 - t ) * halfTheta ) / sinHalfTheta,
			ratioB = Math.sin( t * halfTheta ) / sinHalfTheta;

		this._w = ( w * ratioA + this._w * ratioB );
		this._x = ( x * ratioA + this._x * ratioB );
		this._y = ( y * ratioA + this._y * ratioB );
		this._z = ( z * ratioA + this._z * ratioB );

		this._onChangeCallback();

		return this;

	}

	slerpQuaternions( qa, qb, t ) {

		return this.copy( qa ).slerp( qb, t );

	}

	random() {

		// sets this quaternion to a uniform random unit quaternnion

		// Ken Shoemake
		// Uniform random rotations
		// D. Kirk, editor, Graphics Gems III, pages 124-132. Academic Press, New York, 1992.

		const theta1 = 2 * Math.PI * Math.random();
		const theta2 = 2 * Math.PI * Math.random();

		const x0 = Math.random();
		const r1 = Math.sqrt( 1 - x0 );
		const r2 = Math.sqrt( x0 );

		return this.set(
			r1 * Math.sin( theta1 ),
			r1 * Math.cos( theta1 ),
			r2 * Math.sin( theta2 ),
			r2 * Math.cos( theta2 ),
		);

	}

	equals( quaternion ) {

		return ( quaternion._x === this._x ) && ( quaternion._y === this._y ) && ( quaternion._z === this._z ) && ( quaternion._w === this._w );

	}

	fromArray( array, offset = 0 ) {

		this._x = array[ offset ];
		this._y = array[ offset + 1 ];
		this._z = array[ offset + 2 ];
		this._w = array[ offset + 3 ];

		this._onChangeCallback();

		return this;

	}

	toArray( array = [], offset = 0 ) {

		array[ offset ] = this._x;
		array[ offset + 1 ] = this._y;
		array[ offset + 2 ] = this._z;
		array[ offset + 3 ] = this._w;

		return array;

	}

	fromBufferAttribute( attribute, index ) {

		this._x = attribute.getX( index );
		this._y = attribute.getY( index );
		this._z = attribute.getZ( index );
		this._w = attribute.getW( index );

		this._onChangeCallback();

		return this;

	}

	toJSON() {

		return this.toArray();

	}

	_onChange( callback ) {

		this._onChangeCallback = callback;

		return this;

	}

	_onChangeCallback() {}

	*[ Symbol.iterator ]() {

		yield this._x;
		yield this._y;
		yield this._z;
		yield this._w;

	}

}

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

const WebGLCoordinateSystem = 2000;
const WebGPUCoordinateSystem = 2001;

class Matrix4 {
	constructor( n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44 ) {
		Matrix4.prototype.isMatrix4 = true;

		this.elements = [
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		];

		if ( n11 !== undefined ) {
			this.set( n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44 );
		}

	}

	set( n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44 ) {
		const te = this.elements;
  
		te[ 0 ] = n11; te[ 4 ] = n12; te[ 8 ] = n13; te[ 12 ] = n14;
		te[ 1 ] = n21; te[ 5 ] = n22; te[ 9 ] = n23; te[ 13 ] = n24;
		te[ 2 ] = n31; te[ 6 ] = n32; te[ 10 ] = n33; te[ 14 ] = n34;
		te[ 3 ] = n41; te[ 7 ] = n42; te[ 11 ] = n43; te[ 15 ] = n44;

		return this;
	}

	identity() {
		this.set(

			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1

		);

		return this;
	}

	clone() {
		return new Matrix4().fromArray( this.elements );
	}

	copy( m ) {
		const te = this.elements;
		const me = m.elements;

		te[ 0 ] = me[ 0 ]; te[ 1 ] = me[ 1 ]; te[ 2 ] = me[ 2 ]; te[ 3 ] = me[ 3 ];
		te[ 4 ] = me[ 4 ]; te[ 5 ] = me[ 5 ]; te[ 6 ] = me[ 6 ]; te[ 7 ] = me[ 7 ];
		te[ 8 ] = me[ 8 ]; te[ 9 ] = me[ 9 ]; te[ 10 ] = me[ 10 ]; te[ 11 ] = me[ 11 ];
		te[ 12 ] = me[ 12 ]; te[ 13 ] = me[ 13 ]; te[ 14 ] = me[ 14 ]; te[ 15 ] = me[ 15 ];

		return this;
	}

	copyPosition( m ) {
		const te = this.elements, me = m.elements;

		te[ 12 ] = me[ 12 ];
		te[ 13 ] = me[ 13 ];
		te[ 14 ] = me[ 14 ];

		return this;
	}

	setFromMatrix3( m ) {
		const me = m.elements;

		this.set(

			me[ 0 ], me[ 3 ], me[ 6 ], 0,
			me[ 1 ], me[ 4 ], me[ 7 ], 0,
			me[ 2 ], me[ 5 ], me[ 8 ], 0,
			0, 0, 0, 1

		);

		return this;
	}

	extractBasis( xAxis, yAxis, zAxis ) {
		xAxis.setFromMatrixColumn( this, 0 );
		yAxis.setFromMatrixColumn( this, 1 );
		zAxis.setFromMatrixColumn( this, 2 );

		return this;
	}

	makeBasis( xAxis, yAxis, zAxis ) {
		this.set(
			xAxis.x, yAxis.x, zAxis.x, 0,
			xAxis.y, yAxis.y, zAxis.y, 0,
			xAxis.z, yAxis.z, zAxis.z, 0,
			0, 0, 0, 1
		);

		return this;
	}

	extractRotation( m ) {
		// this method does not support reflection matrices

		const te = this.elements;
		const me = m.elements;

		const scaleX = 1 / _v1.setFromMatrixColumn( m, 0 ).length();
		const scaleY = 1 / _v1.setFromMatrixColumn( m, 1 ).length();
		const scaleZ = 1 / _v1.setFromMatrixColumn( m, 2 ).length();

		te[ 0 ] = me[ 0 ] * scaleX;
		te[ 1 ] = me[ 1 ] * scaleX;
		te[ 2 ] = me[ 2 ] * scaleX;
		te[ 3 ] = 0;

		te[ 4 ] = me[ 4 ] * scaleY;
		te[ 5 ] = me[ 5 ] * scaleY;
		te[ 6 ] = me[ 6 ] * scaleY;
		te[ 7 ] = 0;

		te[ 8 ] = me[ 8 ] * scaleZ;
		te[ 9 ] = me[ 9 ] * scaleZ;
		te[ 10 ] = me[ 10 ] * scaleZ;
		te[ 11 ] = 0;

		te[ 12 ] = 0;
		te[ 13 ] = 0;
		te[ 14 ] = 0;
		te[ 15 ] = 1;

		return this;
	}

	makeRotationFromEuler( euler ) {
		const te = this.elements;

		const x = euler.x, y = euler.y, z = euler.z;
		const a = Math.cos( x ), b = Math.sin( x );
		const c = Math.cos( y ), d = Math.sin( y );
		const e = Math.cos( z ), f = Math.sin( z );

		if ( euler.order === 'XYZ' ) {

			const ae = a * e, af = a * f, be = b * e, bf = b * f;

			te[ 0 ] = c * e;
			te[ 4 ] = - c * f;
			te[ 8 ] = d;

			te[ 1 ] = af + be * d;
			te[ 5 ] = ae - bf * d;
			te[ 9 ] = - b * c;

			te[ 2 ] = bf - ae * d;
			te[ 6 ] = be + af * d;
			te[ 10 ] = a * c;

		} else if ( euler.order === 'YXZ' ) {

			const ce = c * e, cf = c * f, de = d * e, df = d * f;

			te[ 0 ] = ce + df * b;
			te[ 4 ] = de * b - cf;
			te[ 8 ] = a * d;

			te[ 1 ] = a * f;
			te[ 5 ] = a * e;
			te[ 9 ] = - b;

			te[ 2 ] = cf * b - de;
			te[ 6 ] = df + ce * b;
			te[ 10 ] = a * c;

		} else if ( euler.order === 'ZXY' ) {

			const ce = c * e, cf = c * f, de = d * e, df = d * f;

			te[ 0 ] = ce - df * b;
			te[ 4 ] = - a * f;
			te[ 8 ] = de + cf * b;

			te[ 1 ] = cf + de * b;
			te[ 5 ] = a * e;
			te[ 9 ] = df - ce * b;

			te[ 2 ] = - a * d;
			te[ 6 ] = b;
			te[ 10 ] = a * c;

		} else if ( euler.order === 'ZYX' ) {

			const ae = a * e, af = a * f, be = b * e, bf = b * f;

			te[ 0 ] = c * e;
			te[ 4 ] = be * d - af;
			te[ 8 ] = ae * d + bf;

			te[ 1 ] = c * f;
			te[ 5 ] = bf * d + ae;
			te[ 9 ] = af * d - be;

			te[ 2 ] = - d;
			te[ 6 ] = b * c;
			te[ 10 ] = a * c;

		} else if ( euler.order === 'YZX' ) {

			const ac = a * c, ad = a * d, bc = b * c, bd = b * d;

			te[ 0 ] = c * e;
			te[ 4 ] = bd - ac * f;
			te[ 8 ] = bc * f + ad;

			te[ 1 ] = f;
			te[ 5 ] = a * e;
			te[ 9 ] = - b * e;

			te[ 2 ] = - d * e;
			te[ 6 ] = ad * f + bc;
			te[ 10 ] = ac - bd * f;

		} else if ( euler.order === 'XZY' ) {

			const ac = a * c, ad = a * d, bc = b * c, bd = b * d;

			te[ 0 ] = c * e;
			te[ 4 ] = - f;
			te[ 8 ] = d * e;

			te[ 1 ] = ac * f + bd;
			te[ 5 ] = a * e;
			te[ 9 ] = ad * f - bc;

			te[ 2 ] = bc * f - ad;
			te[ 6 ] = b * e;
			te[ 10 ] = bd * f + ac;
		}

		// bottom row
		te[ 3 ] = 0;
		te[ 7 ] = 0;
		te[ 11 ] = 0;

		// last column
		te[ 12 ] = 0;
		te[ 13 ] = 0;
		te[ 14 ] = 0;
		te[ 15 ] = 1;

		return this;
	}

	makeRotationFromQuaternion( q ) {
		return this.compose( _zero, q, _one );
	}

	lookAt( eye, target, up ) {
		const te = this.elements;

		_z.subVectors( eye, target );

		if ( _z.lengthSq() === 0 ) {
			// eye and target are in the same position

			_z.z = 1;
		}

		_z.normalize();
		_x.crossVectors( up, _z );

		if ( _x.lengthSq() === 0 ) {
			// up and z are parallel

			if ( Math.abs( up.z ) === 1 ) {

				_z.x += 0.0001;

			} else {

				_z.z += 0.0001;

			}

			_z.normalize();
			_x.crossVectors( up, _z );

		}

		_x.normalize();
		_y.crossVectors( _z, _x );

		te[ 0 ] = _x.x; te[ 4 ] = _y.x; te[ 8 ] = _z.x;
		te[ 1 ] = _x.y; te[ 5 ] = _y.y; te[ 9 ] = _z.y;
		te[ 2 ] = _x.z; te[ 6 ] = _y.z; te[ 10 ] = _z.z;

		return this;

	}

	multiply( m ) {
		return this.multiplyMatrices( this, m );

	}

	premultiply( m ) {
		return this.multiplyMatrices( m, this );
	}

	multiplyMatrices( a, b ) {
		const ae = a.elements;
		const be = b.elements;
		const te = this.elements;

		const a11 = ae[ 0 ], a12 = ae[ 4 ], a13 = ae[ 8 ], a14 = ae[ 12 ];
		const a21 = ae[ 1 ], a22 = ae[ 5 ], a23 = ae[ 9 ], a24 = ae[ 13 ];
		const a31 = ae[ 2 ], a32 = ae[ 6 ], a33 = ae[ 10 ], a34 = ae[ 14 ];
		const a41 = ae[ 3 ], a42 = ae[ 7 ], a43 = ae[ 11 ], a44 = ae[ 15 ];

		const b11 = be[ 0 ], b12 = be[ 4 ], b13 = be[ 8 ], b14 = be[ 12 ];
		const b21 = be[ 1 ], b22 = be[ 5 ], b23 = be[ 9 ], b24 = be[ 13 ];
		const b31 = be[ 2 ], b32 = be[ 6 ], b33 = be[ 10 ], b34 = be[ 14 ];
		const b41 = be[ 3 ], b42 = be[ 7 ], b43 = be[ 11 ], b44 = be[ 15 ];

		te[ 0 ] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
		te[ 4 ] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
		te[ 8 ] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
		te[ 12 ] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

		te[ 1 ] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
		te[ 5 ] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
		te[ 9 ] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
		te[ 13 ] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

		te[ 2 ] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
		te[ 6 ] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
		te[ 10 ] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
		te[ 14 ] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

		te[ 3 ] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
		te[ 7 ] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
		te[ 11 ] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
		te[ 15 ] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

		return this;
	}

	multiplyScalar( s ) {
		const te = this.elements;

		te[ 0 ] *= s; te[ 4 ] *= s; te[ 8 ] *= s; te[ 12 ] *= s;
		te[ 1 ] *= s; te[ 5 ] *= s; te[ 9 ] *= s; te[ 13 ] *= s;
		te[ 2 ] *= s; te[ 6 ] *= s; te[ 10 ] *= s; te[ 14 ] *= s;
		te[ 3 ] *= s; te[ 7 ] *= s; te[ 11 ] *= s; te[ 15 ] *= s;

		return this;
	}

	determinant() {
		const te = this.elements;

		const n11 = te[ 0 ], n12 = te[ 4 ], n13 = te[ 8 ], n14 = te[ 12 ];
		const n21 = te[ 1 ], n22 = te[ 5 ], n23 = te[ 9 ], n24 = te[ 13 ];
		const n31 = te[ 2 ], n32 = te[ 6 ], n33 = te[ 10 ], n34 = te[ 14 ];
		const n41 = te[ 3 ], n42 = te[ 7 ], n43 = te[ 11 ], n44 = te[ 15 ];

		//TODO: make this more efficient
		//( based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm )

		return (
			n41 * (
				+ n14 * n23 * n32
				 - n13 * n24 * n32
				 - n14 * n22 * n33
				 + n12 * n24 * n33
				 + n13 * n22 * n34
				 - n12 * n23 * n34
			) +
			n42 * (
				+ n11 * n23 * n34
				 - n11 * n24 * n33
				 + n14 * n21 * n33
				 - n13 * n21 * n34
				 + n13 * n24 * n31
				 - n14 * n23 * n31
			) +
			n43 * (
				+ n11 * n24 * n32
				 - n11 * n22 * n34
				 - n14 * n21 * n32
				 + n12 * n21 * n34
				 + n14 * n22 * n31
				 - n12 * n24 * n31
			) +
			n44 * (
				- n13 * n22 * n31
				 - n11 * n23 * n32
				 + n11 * n22 * n33
				 + n13 * n21 * n32
				 - n12 * n21 * n33
				 + n12 * n23 * n31
			)

		);
	}

	transpose() {

		const te = this.elements;
		let tmp;

		tmp = te[ 1 ]; te[ 1 ] = te[ 4 ]; te[ 4 ] = tmp;
		tmp = te[ 2 ]; te[ 2 ] = te[ 8 ]; te[ 8 ] = tmp;
		tmp = te[ 6 ]; te[ 6 ] = te[ 9 ]; te[ 9 ] = tmp;

		tmp = te[ 3 ]; te[ 3 ] = te[ 12 ]; te[ 12 ] = tmp;
		tmp = te[ 7 ]; te[ 7 ] = te[ 13 ]; te[ 13 ] = tmp;
		tmp = te[ 11 ]; te[ 11 ] = te[ 14 ]; te[ 14 ] = tmp;

		return this;

	}

	setPosition( x, y, z ) {

		const te = this.elements;

		if ( x.isVector3 ) {

			te[ 12 ] = x.x;
			te[ 13 ] = x.y;
			te[ 14 ] = x.z;

		} else {

			te[ 12 ] = x;
			te[ 13 ] = y;
			te[ 14 ] = z;

		}

		return this;

	}

	invert() {

		// based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
		const te = this.elements,

			n11 = te[ 0 ], n21 = te[ 1 ], n31 = te[ 2 ], n41 = te[ 3 ],
			n12 = te[ 4 ], n22 = te[ 5 ], n32 = te[ 6 ], n42 = te[ 7 ],
			n13 = te[ 8 ], n23 = te[ 9 ], n33 = te[ 10 ], n43 = te[ 11 ],
			n14 = te[ 12 ], n24 = te[ 13 ], n34 = te[ 14 ], n44 = te[ 15 ],

			t11 = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44,
			t12 = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44,
			t13 = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44,
			t14 = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;

		const det = n11 * t11 + n21 * t12 + n31 * t13 + n41 * t14;

		if ( det === 0 ) return this.set( 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 );

		const detInv = 1 / det;

		te[ 0 ] = t11 * detInv;
		te[ 1 ] = ( n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44 ) * detInv;
		te[ 2 ] = ( n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44 ) * detInv;
		te[ 3 ] = ( n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43 ) * detInv;

		te[ 4 ] = t12 * detInv;
		te[ 5 ] = ( n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44 ) * detInv;
		te[ 6 ] = ( n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44 ) * detInv;
		te[ 7 ] = ( n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43 ) * detInv;

		te[ 8 ] = t13 * detInv;
		te[ 9 ] = ( n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44 ) * detInv;
		te[ 10 ] = ( n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44 ) * detInv;
		te[ 11 ] = ( n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43 ) * detInv;

		te[ 12 ] = t14 * detInv;
		te[ 13 ] = ( n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34 ) * detInv;
		te[ 14 ] = ( n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34 ) * detInv;
		te[ 15 ] = ( n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33 ) * detInv;

		return this;

	}

	scale( v ) {

		const te = this.elements;
		const x = v.x, y = v.y, z = v.z;

		te[ 0 ] *= x; te[ 4 ] *= y; te[ 8 ] *= z;
		te[ 1 ] *= x; te[ 5 ] *= y; te[ 9 ] *= z;
		te[ 2 ] *= x; te[ 6 ] *= y; te[ 10 ] *= z;
		te[ 3 ] *= x; te[ 7 ] *= y; te[ 11 ] *= z;

		return this;

	}

	getMaxScaleOnAxis() {

		const te = this.elements;

		const scaleXSq = te[ 0 ] * te[ 0 ] + te[ 1 ] * te[ 1 ] + te[ 2 ] * te[ 2 ];
		const scaleYSq = te[ 4 ] * te[ 4 ] + te[ 5 ] * te[ 5 ] + te[ 6 ] * te[ 6 ];
		const scaleZSq = te[ 8 ] * te[ 8 ] + te[ 9 ] * te[ 9 ] + te[ 10 ] * te[ 10 ];

		return Math.sqrt( Math.max( scaleXSq, scaleYSq, scaleZSq ) );

	}

	makeTranslation( x, y, z ) {

		if ( x.isVector3 ) {

			this.set(

				1, 0, 0, x.x,
				0, 1, 0, x.y,
				0, 0, 1, x.z,
				0, 0, 0, 1

			);

		} else {

			this.set(

				1, 0, 0, x,
				0, 1, 0, y,
				0, 0, 1, z,
				0, 0, 0, 1

			);

		}

		return this;

	}

	makeRotationX( theta ) {

		const c = Math.cos( theta ), s = Math.sin( theta );

		this.set(

			1, 0, 0, 0,
			0, c, - s, 0,
			0, s, c, 0,
			0, 0, 0, 1

		);

		return this;

	}

	makeRotationY( theta ) {

		const c = Math.cos( theta ), s = Math.sin( theta );

		this.set(

			 c, 0, s, 0,
			 0, 1, 0, 0,
			- s, 0, c, 0,
			 0, 0, 0, 1

		);

		return this;

	}

	makeRotationZ( theta ) {

		const c = Math.cos( theta ), s = Math.sin( theta );

		this.set(

			c, - s, 0, 0,
			s, c, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1

		);

		return this;

	}

	makeRotationAxis( axis, angle ) {

		// Based on http://www.gamedev.net/reference/articles/article1199.asp

		const c = Math.cos( angle );
		const s = Math.sin( angle );
		const t = 1 - c;
		const x = axis.x, y = axis.y, z = axis.z;
		const tx = t * x, ty = t * y;

		this.set(

			tx * x + c, tx * y - s * z, tx * z + s * y, 0,
			tx * y + s * z, ty * y + c, ty * z - s * x, 0,
			tx * z - s * y, ty * z + s * x, t * z * z + c, 0,
			0, 0, 0, 1

		);

		return this;

	}

	makeScale( x, y, z ) {

		this.set(

			x, 0, 0, 0,
			0, y, 0, 0,
			0, 0, z, 0,
			0, 0, 0, 1

		);

		return this;

	}

	makeShear( xy, xz, yx, yz, zx, zy ) {

		this.set(

			1, yx, zx, 0,
			xy, 1, zy, 0,
			xz, yz, 1, 0,
			0, 0, 0, 1

		);

		return this;

	}

	compose( position, quaternion, scale ) {

		const te = this.elements;

		const x = quaternion._x, y = quaternion._y, z = quaternion._z, w = quaternion._w;
		const x2 = x + x,	y2 = y + y, z2 = z + z;
		const xx = x * x2, xy = x * y2, xz = x * z2;
		const yy = y * y2, yz = y * z2, zz = z * z2;
		const wx = w * x2, wy = w * y2, wz = w * z2;

		const sx = scale.x, sy = scale.y, sz = scale.z;

		te[ 0 ] = ( 1 - ( yy + zz ) ) * sx;
		te[ 1 ] = ( xy + wz ) * sx;
		te[ 2 ] = ( xz - wy ) * sx;
		te[ 3 ] = 0;

		te[ 4 ] = ( xy - wz ) * sy;
		te[ 5 ] = ( 1 - ( xx + zz ) ) * sy;
		te[ 6 ] = ( yz + wx ) * sy;
		te[ 7 ] = 0;

		te[ 8 ] = ( xz + wy ) * sz;
		te[ 9 ] = ( yz - wx ) * sz;
		te[ 10 ] = ( 1 - ( xx + yy ) ) * sz;
		te[ 11 ] = 0;

		te[ 12 ] = position.x;
		te[ 13 ] = position.y;
		te[ 14 ] = position.z;
		te[ 15 ] = 1;

		return this;

	}

	decompose( position, quaternion, scale ) {

		const te = this.elements;

		let sx = _v1.set( te[ 0 ], te[ 1 ], te[ 2 ] ).length();
		const sy = _v1.set( te[ 4 ], te[ 5 ], te[ 6 ] ).length();
		const sz = _v1.set( te[ 8 ], te[ 9 ], te[ 10 ] ).length();

		// if determine is negative, we need to invert one scale
		const det = this.determinant();
		if ( det < 0 ) sx = - sx;

		position.x = te[ 12 ];
		position.y = te[ 13 ];
		position.z = te[ 14 ];

		// scale the rotation part
		_m1$1.copy( this );

		const invSX = 1 / sx;
		const invSY = 1 / sy;
		const invSZ = 1 / sz;

		_m1$1.elements[ 0 ] *= invSX;
		_m1$1.elements[ 1 ] *= invSX;
		_m1$1.elements[ 2 ] *= invSX;

		_m1$1.elements[ 4 ] *= invSY;
		_m1$1.elements[ 5 ] *= invSY;
		_m1$1.elements[ 6 ] *= invSY;

		_m1$1.elements[ 8 ] *= invSZ;
		_m1$1.elements[ 9 ] *= invSZ;
		_m1$1.elements[ 10 ] *= invSZ;

		quaternion.setFromRotationMatrix( _m1$1 );

		scale.x = sx;
		scale.y = sy;
		scale.z = sz;

		return this;

	}

	makePerspective( left, right, top, bottom, near, far, coordinateSystem = WebGLCoordinateSystem ) {

		const te = this.elements;
		const x = 2 * near / ( right - left );
		const y = 2 * near / ( top - bottom );

		const a = ( right + left ) / ( right - left );
		const b = ( top + bottom ) / ( top - bottom );

		let c, d;

		if ( coordinateSystem === WebGLCoordinateSystem ) {

			c = - ( far + near ) / ( far - near );
			d = ( - 2 * far * near ) / ( far - near );

		} else if ( coordinateSystem === WebGPUCoordinateSystem ) {

			c = - far / ( far - near );
			d = ( - far * near ) / ( far - near );

		} else {

			throw new Error( 'THREE.Matrix4.makePerspective(): Invalid coordinate system: ' + coordinateSystem );

		}

		te[ 0 ] = x;	te[ 4 ] = 0;	te[ 8 ] = a; 	te[ 12 ] = 0;
		te[ 1 ] = 0;	te[ 5 ] = y;	te[ 9 ] = b; 	te[ 13 ] = 0;
		te[ 2 ] = 0;	te[ 6 ] = 0;	te[ 10 ] = c; 	te[ 14 ] = d;
		te[ 3 ] = 0;	te[ 7 ] = 0;	te[ 11 ] = - 1;	te[ 15 ] = 0;

		return this;

	}

	makeOrthographic( left, right, top, bottom, near, far, coordinateSystem = WebGLCoordinateSystem ) {

		const te = this.elements;
		const w = 1.0 / ( right - left );
		const h = 1.0 / ( top - bottom );
		const p = 1.0 / ( far - near );

		const x = ( right + left ) * w;
		const y = ( top + bottom ) * h;

		let z, zInv;

		if ( coordinateSystem === WebGLCoordinateSystem ) {

			z = ( far + near ) * p;
			zInv = - 2 * p;

		} else if ( coordinateSystem === WebGPUCoordinateSystem ) {

			z = near * p;
			zInv = - 1 * p;

		} else {

			throw new Error( 'THREE.Matrix4.makeOrthographic(): Invalid coordinate system: ' + coordinateSystem );

		}

		te[ 0 ] = 2 * w;	te[ 4 ] = 0;		te[ 8 ] = 0; 		te[ 12 ] = - x;
		te[ 1 ] = 0; 		te[ 5 ] = 2 * h;	te[ 9 ] = 0; 		te[ 13 ] = - y;
		te[ 2 ] = 0; 		te[ 6 ] = 0;		te[ 10 ] = zInv;	te[ 14 ] = - z;
		te[ 3 ] = 0; 		te[ 7 ] = 0;		te[ 11 ] = 0;		te[ 15 ] = 1;

		return this;

	}

	equals( matrix ) {

		const te = this.elements;
		const me = matrix.elements;

		for ( let i = 0; i < 16; i ++ ) {

			if ( te[ i ] !== me[ i ] ) return false;

		}

		return true;

	}

	fromArray( array, offset = 0 ) {

		for ( let i = 0; i < 16; i ++ ) {

			this.elements[ i ] = array[ i + offset ];

		}

		return this;

	}

	toArray( array = [], offset = 0 ) {

		const te = this.elements;

		array[ offset ] = te[ 0 ];
		array[ offset + 1 ] = te[ 1 ];
		array[ offset + 2 ] = te[ 2 ];
		array[ offset + 3 ] = te[ 3 ];

		array[ offset + 4 ] = te[ 4 ];
		array[ offset + 5 ] = te[ 5 ];
		array[ offset + 6 ] = te[ 6 ];
		array[ offset + 7 ] = te[ 7 ];

		array[ offset + 8 ] = te[ 8 ];
		array[ offset + 9 ] = te[ 9 ];
		array[ offset + 10 ] = te[ 10 ];
		array[ offset + 11 ] = te[ 11 ];

		array[ offset + 12 ] = te[ 12 ];
		array[ offset + 13 ] = te[ 13 ];
		array[ offset + 14 ] = te[ 14 ];
		array[ offset + 15 ] = te[ 15 ];

		return array;

	}

}

const _v1 = /*@__PURE__*/ new Vector3();
const _m1$1 = /*@__PURE__*/ new Matrix4();
const _zero = /*@__PURE__*/ new Vector3( 0, 0, 0 );
const _one = /*@__PURE__*/ new Vector3( 1, 1, 1 );
const _x = /*@__PURE__*/ new Vector3();
const _y = /*@__PURE__*/ new Vector3();
const _z = /*@__PURE__*/ new Vector3();

const _matrix = /*@__PURE__*/ new Matrix4();
const _quaternion = /*@__PURE__*/ new Quaternion();

class Euler {

	constructor( x = 0, y = 0, z = 0, order = Euler.DEFAULT_ORDER ) {

		this.isEuler = true;

		this._x = x;
		this._y = y;
		this._z = z;
		this._order = order;

	}

	get x() {

		return this._x;

	}

	set x( value ) {

		this._x = value;
		this._onChangeCallback();

	}

	get y() {

		return this._y;

	}

	set y( value ) {

		this._y = value;
		this._onChangeCallback();

	}

	get z() {

		return this._z;

	}

	set z( value ) {

		this._z = value;
		this._onChangeCallback();

	}

	get order() {

		return this._order;

	}

	set order( value ) {

		this._order = value;
		this._onChangeCallback();

	}

	set( x, y, z, order = this._order ) {

		this._x = x;
		this._y = y;
		this._z = z;
		this._order = order;

		this._onChangeCallback();

		return this;

	}

	clone() {

		return new this.constructor( this._x, this._y, this._z, this._order );

	}

	copy( euler ) {

		this._x = euler._x;
		this._y = euler._y;
		this._z = euler._z;
		this._order = euler._order;

		this._onChangeCallback();

		return this;

	}

	setFromRotationMatrix( m, order = this._order, update = true ) {

		// assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

		const te = m.elements;
		const m11 = te[ 0 ], m12 = te[ 4 ], m13 = te[ 8 ];
		const m21 = te[ 1 ], m22 = te[ 5 ], m23 = te[ 9 ];
		const m31 = te[ 2 ], m32 = te[ 6 ], m33 = te[ 10 ];

		switch ( order ) {

			case 'XYZ':

				this._y = Math.asin( clamp( m13, - 1, 1 ) );

				if ( Math.abs( m13 ) < 0.9999999 ) {

					this._x = Math.atan2( - m23, m33 );
					this._z = Math.atan2( - m12, m11 );

				} else {

					this._x = Math.atan2( m32, m22 );
					this._z = 0;

				}

				break;

			case 'YXZ':

				this._x = Math.asin( - clamp( m23, - 1, 1 ) );

				if ( Math.abs( m23 ) < 0.9999999 ) {

					this._y = Math.atan2( m13, m33 );
					this._z = Math.atan2( m21, m22 );

				} else {

					this._y = Math.atan2( - m31, m11 );
					this._z = 0;

				}

				break;

			case 'ZXY':

				this._x = Math.asin( clamp( m32, - 1, 1 ) );

				if ( Math.abs( m32 ) < 0.9999999 ) {

					this._y = Math.atan2( - m31, m33 );
					this._z = Math.atan2( - m12, m22 );

				} else {

					this._y = 0;
					this._z = Math.atan2( m21, m11 );

				}

				break;

			case 'ZYX':

				this._y = Math.asin( - clamp( m31, - 1, 1 ) );

				if ( Math.abs( m31 ) < 0.9999999 ) {

					this._x = Math.atan2( m32, m33 );
					this._z = Math.atan2( m21, m11 );

				} else {

					this._x = 0;
					this._z = Math.atan2( - m12, m22 );

				}

				break;

			case 'YZX':

				this._z = Math.asin( clamp( m21, - 1, 1 ) );

				if ( Math.abs( m21 ) < 0.9999999 ) {

					this._x = Math.atan2( - m23, m22 );
					this._y = Math.atan2( - m31, m11 );

				} else {

					this._x = 0;
					this._y = Math.atan2( m13, m33 );

				}

				break;

			case 'XZY':

				this._z = Math.asin( - clamp( m12, - 1, 1 ) );

				if ( Math.abs( m12 ) < 0.9999999 ) {

					this._x = Math.atan2( m32, m22 );
					this._y = Math.atan2( m13, m11 );

				} else {

					this._x = Math.atan2( - m23, m33 );
					this._y = 0;

				}

				break;

			default:

				console.warn( 'THREE.Euler: .setFromRotationMatrix() encountered an unknown order: ' + order );

		}

		this._order = order;

		if ( update === true ) this._onChangeCallback();

		return this;

	}

	setFromQuaternion( q, order, update ) {

		_matrix.makeRotationFromQuaternion( q );

		return this.setFromRotationMatrix( _matrix, order, update );

	}

	setFromVector3( v, order = this._order ) {

		return this.set( v.x, v.y, v.z, order );

	}

	reorder( newOrder ) {

		// WARNING: this discards revolution information -bhouston

		_quaternion.setFromEuler( this );

		return this.setFromQuaternion( _quaternion, newOrder );

	}

	equals( euler ) {

		return ( euler._x === this._x ) && ( euler._y === this._y ) && ( euler._z === this._z ) && ( euler._order === this._order );

	}

	fromArray( array ) {

		this._x = array[ 0 ];
		this._y = array[ 1 ];
		this._z = array[ 2 ];
		if ( array[ 3 ] !== undefined ) this._order = array[ 3 ];

		this._onChangeCallback();

		return this;

	}

	toArray( array = [], offset = 0 ) {

		array[ offset ] = this._x;
		array[ offset + 1 ] = this._y;
		array[ offset + 2 ] = this._z;
		array[ offset + 3 ] = this._order;

		return array;

	}

	_onChange( callback ) {

		this._onChangeCallback = callback;

		return this;

	}

	_onChangeCallback() {}

	*[ Symbol.iterator ]() {

		yield this._x;
		yield this._y;
		yield this._z;
		yield this._order;

	}

}

Euler.DEFAULT_ORDER = 'XYZ';

const _m1 = /*@__PURE__*/ new Matrix4();
const _target = /*@__PURE__*/ new Vector3();
const _position = /*@__PURE__*/ new Vector3();

class Object3D {
	constructor() {
		this.up = Object3D.DEFAULT_UP.clone();
		this.position = new Vector3();
		this.rotation =  new Euler();
		this.quaternion = new Quaternion();
		this.scale = new Vector3( 1, 1, 1 );

		const onRotationChange = () => this.quaternion.setFromEuler( this.rotation, false );
		const onQuaternionChange = () => this.rotation.setFromQuaternion( this.quaternion, undefined, false );

		this.rotation._onChange( onRotationChange );
		this.quaternion._onChange( onQuaternionChange );

		this.matrix = new Matrix4();
		this.matrixWorld = new Matrix4();
		this.matrixWorldNeedsUpdate = false;
	}

	lookAt( x, y, z ) {
		if ( x.isVector3 ) {
			_target.copy( x );
		} else {
			_target.set( x, y, z );
		}

		this.updateWorldMatrix( true, false );
		_position.setFromMatrixPosition( this.matrixWorld );
		_m1.lookAt( _position, _target, this.up );
		this.quaternion.setFromRotationMatrix( _m1 );
	}

	updateMatrix() {
		this.matrix.compose( this.position, this.quaternion, this.scale );
		this.matrixWorldNeedsUpdate = true;
	}

	updateMatrixWorld( force ) {
		this.updateMatrix();
		
		if ( this.matrixWorldNeedsUpdate || force ) {
			this.matrixWorld.copy( this.matrix );
			this.matrixWorldNeedsUpdate = false;

			force = true;
		}
	}

	updateWorldMatrix( updateParents, updateChildren ) {
		this.updateMatrix();

		this.matrixWorld.copy( this.matrix );
	}
}

Object3D.DEFAULT_UP = /*@__PURE__*/ new Vector3( 0, 1, 0 );

class Camera extends Object3D {
	constructor() {
		super();

		this.matrixWorldInverse = new Matrix4();
		this.projectionMatrix = new Matrix4();
		this.projectionMatrixInverse = new Matrix4();
	}

	updateMatrixWorld( force ) {
		super.updateMatrixWorld( force );

		this.matrixWorldInverse.copy( this.matrixWorld ).invert();
	}
 
	updateWorldMatrix( updateParents, updateChildren ) {
		super.updateWorldMatrix( updateParents, updateChildren );

		this.matrixWorldInverse.copy( this.matrixWorld ).invert();
	}
}

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

const epsilon = value => Math.abs( value ) < 1e-10 ? 0 : value;

class CSS3DRenderer {
  constructor(camera, viewElement = null, cameraElement = null) {
    this.camera = camera;
    this.width = 0;
    this.height = 0;
    this.widthHalf = 0;
    this.heightHalf = 0;

    this.viewElement = viewElement || document.createElement( 'div' );

    this.cameraElement = cameraElement || document.createElement( 'div' );
		this.cameraElement.style.transformStyle = 'preserve-3d';
		this.viewElement.appendChild( this.cameraElement );
  }

  getCameraCSSMatrix( matrix ) {
    const elements = matrix.elements;

    return 'matrix3d(' +
      epsilon( elements[ 0 ] ) + ',' +
      epsilon( - elements[ 1 ] ) + ',' +
      epsilon( elements[ 2 ] ) + ',' +
      epsilon( elements[ 3 ] ) + ',' +
      epsilon( elements[ 4 ] ) + ',' +
      epsilon( - elements[ 5 ] ) + ',' +
      epsilon( elements[ 6 ] ) + ',' +
      epsilon( elements[ 7 ] ) + ',' +
      epsilon( elements[ 8 ] ) + ',' +
      epsilon( - elements[ 9 ] ) + ',' +
      epsilon( elements[ 10 ] ) + ',' +
      epsilon( elements[ 11 ] ) + ',' +
      epsilon( elements[ 12 ] ) + ',' +
      epsilon( - elements[ 13 ] ) + ',' +
      epsilon( elements[ 14 ] ) + ',' +
      epsilon( elements[ 15 ] ) +
    ')';
  }

  setSize(width, height) {
    this.width = width;
    this.height = height;
    this.widthHalf = width / 2;
    this.heightHalf = height / 2;

    this.viewElement.style.width = width + 'px';
    this.viewElement.style.height = height + 'px';

    this.cameraElement.style.width = width + 'px';
    this.cameraElement.style.height = height + 'px';
  }

  render () {
    console.log('render');
    const camera = this.camera;
    const cameraElement = this.cameraElement;
    this.viewElement;
    const _widthHalf = this.widthHalf;
    const _heightHalf = this.heightHalf;

    const fov = camera.projectionMatrix.elements[ 5 ] * _heightHalf;

    camera.updateMatrixWorld();

    let tx, ty;

    if ( camera.isOrthographicCamera ) {
      tx = - ( camera.right + camera.left ) / 2;
      ty = ( camera.top + camera.bottom ) / 2;
    }

    const p = fov * 40;

    const scaleByViewOffset = camera.view && camera.view.enabled ? camera.view.height / camera.view.fullHeight : 1;
    const cameraCSSMatrix = camera.isOrthographicCamera ?
      `scale( ${ scaleByViewOffset } )` + 'scale(' + fov + ')' + 'translate(' + epsilon( tx ) + 'px,' + epsilon( ty ) + 'px)' + this.getCameraCSSMatrix( camera.matrixWorldInverse ) :
      `scale( ${ scaleByViewOffset } )` + 'translateZ(' + fov + 'px)' + this.getCameraCSSMatrix( camera.matrixWorldInverse );
    const perspective = camera.isPerspectiveCamera ? 'perspective(' + p + 'px) ' : '';

    const style = perspective + cameraCSSMatrix +
      'translate(' + _widthHalf + 'px,' + _heightHalf + 'px)';

    cameraElement.style.transform = style;
  };
}

class EventDispatcher {
  constructor() {
    this.listeners = new Map();
  }

  addEventListener(type, callback) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, []);
    }
    this.listeners.get(type).push(callback);
  }

  removeEventListener(type, callback) {
    if (this.listeners.has(type)) {
      const callbacks = this.listeners.get(type);
      const index = callbacks.indexOf(callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  dispatchEvent(event) {
    if (this.listeners.has(event.type)) {
      const callbacks = this.listeners.get(event.type);
      for (const callback of callbacks) {
        callback(event);
      }
    }
  }
}

class OrbitControls extends EventDispatcher {
  constructor(camera, domElement) {
    super();

    this.camera = camera;
    this.domElement = domElement;

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onWheel = this.onWheel.bind(this);

    this.isDragging = false;
    this.rotation = {
      x: 0,
      y: 0,
    };
    this.mouse = {
      x: 0,
      y: 0,
    };
    this.z = camera.position.z;

    this.init();
  }

  init() {
    // Add event listeners for mouse down, mouse move, mouse up, and wheel events
    this.domElement.addEventListener('mousedown', this.onMouseDown);
    this.domElement.addEventListener('mousemove', this.onMouseMove);
    this.domElement.addEventListener('mouseup', this.onMouseUp);
    this.domElement.addEventListener('wheel', this.onWheel);
  }

  dispose() {
    // Remove event listeners for mouse down, mouse move, mouse up, and wheel events
    this.domElement.removeEventListener('mousedown', this.onMouseDown);
    this.domElement.removeEventListener('mousemove', this.onMouseMove);
    this.domElement.removeEventListener('mouseup', this.onMouseUp);
    this.domElement.removeEventListener('wheel', this.onWheel);
  }

  onMouseDown(event) {
    this.isDragging = true;
    this.mouse.x = event.clientX;
    this.mouse.y = event.clientY;
  }

  onMouseMove(event) {
    if (this.isDragging) {
      const deltaX = event.clientX - this.mouse.x;
      const deltaY = event.clientY - this.mouse.y;

      this.mouse.x = event.clientX;
      this.mouse.y = event.clientY;

      this.rotation.y -= deltaX * 0.5;
      this.rotation.x += deltaY * 0.5;

      const radius = Math.sqrt(this.camera.position.x ** 2 + this.camera.position.y ** 2 + this.camera.position.z ** 2);
      const theta = Math.atan2(this.camera.position.x, this.camera.position.z);
      const phi = Math.acos(this.camera.position.y / radius);

      const deltaTheta = deltaX * -0.01;
      const deltaPhi = deltaY * 0.01;

      const newTheta = theta + deltaTheta;
      const newPhi = Math.max(Math.min(phi - deltaPhi, Math.PI - 0.01), 0.01);

      const x = radius * Math.sin(newPhi) * Math.sin(newTheta);
      const y = radius * Math.cos(newPhi);
      const z = radius * Math.sin(newPhi) * Math.cos(newTheta);

      this.camera.position.set(x, y, z);
      this.camera.lookAt(0, 0, 0);
      this.camera.updateProjectionMatrix();

      this.update();
      
    }
  }

  onMouseUp(event) {
    this.isDragging = false;
  }

  onWheel(event) {
    // Handle wheel event
    const deltaZ = event.deltaY * 0.4;
    
    const direction = this.camera.position.clone().normalize();
    const newPosition = this.camera.position.clone().sub(direction.multiplyScalar(deltaZ));
    const { x, y, z } = newPosition;
    this.camera.position.set(x, y, z);
    this.camera.lookAt(0, 0, 0);
    this.camera.updateProjectionMatrix();
  
    this.update();
    // Update positionZ based on wheel delta

    event.preventDefault();
  }

  update() {
    // Update camera rotation and position
    



    // Dispatch a change event
    this.dispatchEvent({ type: 'change' });
  }
}

class C3Scene extends HTMLElement {
  #camera;
  #renderer;

  constructor() {
    super();

    this.handleResize = this.handleResize.bind(this);
    this.render = this.render.bind(this);

    // Add any initialization code here
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          min-height: 250px;
          display: flex;
          overflow: hidden;
          position: relative;
          perspective: 300px;
          -webkit-perspective: 300px;
          perspective-origin: center center;
          transform-style: preserve-3d;
          aspect-ratio: 16/9;
          padding: 0;
        }

        :host * {
          transform-style: preserve-3d;
          box-sizing: border-box;
        }

        :host .view {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          transform-style: preserve-3d;
        }

        :host slot {
          display: block;
          transform-style: preserve-3d;
        }

      </style>
      <div class="view">
        <div class="camera">
          <slot></slot>
        </div>
      </div>
    `;

    const { width, height } = this.getBoundingClientRect();

    this.#camera = new PerspectiveCamera(50, width / height, 0.1, 1000);
    this.#camera.position.x = 0;
    this.#camera.position.y = 100;
    this.#camera.position.z = 580;
    
    const viewElement = shadowRoot.querySelector('.view');
    const cameraElement = shadowRoot.querySelector('.camera');

    this.#renderer = new CSS3DRenderer(this.#camera, viewElement, cameraElement);
    this.#renderer.setSize(width, height);

    const controls = new OrbitControls(this.#camera, viewElement);
    controls.addEventListener('change', this.render);

    this.render();

    this.#camera.lookAt(0, 0, 0);
  }

  get camera() {
    return this.#camera;
  }

  connectedCallback() {
    window.addEventListener('resize', this.handleResize);

    this.render();
  }

  handleResize() {
    const { width, height } = this.getBoundingClientRect();

    this.#camera.aspect = width / height;
    this.#camera.updateProjectionMatrix();
    this.#renderer.setSize(width, height);
  }

  render() {
    this.#renderer.render();
  }
}

customElements.define('c3-scene', C3Scene);

const camelize = (str) => str.replace(/-./g, (s) => s.charAt(1).toUpperCase());

const decamelize = (str) => str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

const getStylesheet = (shadowRoot) => {
  let style = shadowRoot.querySelector('style[data-c3-style-handle]');

  if (!style) {
    style = document.createElement('style');
    style.setAttribute('data-c3-style-handle', '');
    shadowRoot.appendChild(style);
  }

  return style.sheet;
};

const CSSStyleMixin = (
  clazz,
  props,
  isVar = false,
  callback = (target, prop, newValue) =>
      target.dispatchEvent(new CustomEvent('change', { bubbles: false, detail: { name: prop, value: newValue } }))
) => {
  props.forEach(prop => {
    const name = typeof prop === 'string' ? prop : prop[1];
    prop = typeof prop === 'string' ? prop : prop[0];
  
    console.log('DEFINE: ', clazz.name, prop, name, isVar ? 'VAR' : 'VALUE');
    Object.defineProperty(clazz.prototype, prop, {
      configurable: true,
      get() {
        console.log('GET VALUE: ', clazz.name, prop);
        return window.getComputedStyle(this.shadowRoot.host).getPropertyValue(
          isVar ? `--${name}` : name
        );
      },
      set(value) {
        console.log('SET VALUE: ', clazz.name, prop, value);
        const sheet = getStylesheet(this.shadowRoot);
        const rule = [...sheet.cssRules].filter(rule => rule.selectorText === ':host')[0];
        const hyphenated = decamelize(name);
        const oldValue = this[prop];

        if (rule) {
          rule.style.setProperty(isVar ? `--${name}` : hyphenated, value);
        } else {
          sheet.insertRule(`:host {
            ${isVar ? `--${name}` : hyphenated}: ${value};
          }`, 0);
        }

        const newValue = this[prop];

        if (oldValue !== newValue && callback) {
          callback(this, prop, newValue, oldValue);
        }
      }
    });
  });
};

class C3Object extends HTMLElement {
  #style;

  constructor() {
    super();

    this.render = this.render.bind(this);

    this.attachShadow({ mode: 'open' });

    // Create stylesheet
    this.#style = document.createElement('style');
    this.#style.textContent = `
      :host {
        position: absolute;
        top: 0;
        left: 0;
        width: 0;
        height: 0;
        display: block;
        pointer-events: auto;
        user-select: none;
        transform-style: preserve-3d;
      }

      :host * {
        transform-style: preserve-3d;
      }

      :host::before {
        content: '';
        display: none;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        outline: 5px solid blue;
        transform-style: preserve-3d;
      }
    `;
  
    this.shadowRoot.appendChild(this.#style);
  }

  static get observedAttributes() {
    return [
      'position',
      'rotate',
      'scale',
      'animation',
      'background',
      'color'
    ];
  }

  static getPosition(target) {
    const position = window.getComputedStyle(target).getPropertyValue('translate');
    console.log('position', position);
    const [x = 0, y = 0, z = 0] = position
      .split(/\s+/)
      .map((n = '') => Number(n.replace(/px$/g, '')))
      .map(n => !isNaN(n) ? n : 0);

    return new Vector3(x, y, z);
  }

  connectedCallback() {
    window.requestAnimationFrame(() => this.render());
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    const prop = camelize(name);

    if (Reflect.has(this, prop)) {
      this[prop] = newValue;
    } else {
      this.render();
    }
  }

  get x() {
    return C3Object.getPosition(this).x;
  }

  get y() {
    return C3Object.getPosition(this).y;
  }

  get z() {
    return C3Object.getPosition(this).y;
  }

  get scene() {
    return this.closest('c3-scene');
  }

  render() {
    
  }
}

CSSStyleMixin(C3Object, [
  ['position', 'translate'],
  'rotate',
  'scale',
  'animation'
]);

const box = `
  <style scoped>
    :host {
      --width: 200px;
      --height: 200px;
      --depth: 200px;
      --background: rgba(0, 255, 255, 0.6);
    }

    :host .cube {
      position: absolute;
      top: 0;
      left: 0;
      width: var(--width);
      height: var(--height);
      transform-style: preserve-3d;
      transform: translate3d(-50%, -50%, calc(var(--depth) / 2 - var(--width) / 2));
      
    }

    :host .face {
      width: var(--width);
      height: var(--height);
      display: block;
      position: absolute;
      background: var(--background, 'gray');
      /* backface-visibility: hidden; */
      transform-style: preserve-3d;
      /*border: 1px solid red;*/
    }

    /*
    .face {
      position: absolute;
      width: var(--width);
      height: var(--height);
      border: 2px solid black;
      background: var(--background, 'gray');
      backface-visibility: hidden;
      transform-style: preserve-3d;
    }*/
  
    :host .front {
      transform: rotateY( 0deg) translateZ(calc(var(--width) / 2));
      transform-origin: ß 0;
    }

    :host .back {
      transform: rotateX( 180deg) translateZ(calc( var(--depth) - var(--width) / 2 )) ;
    }

    :host .right {
      width: var(--depth);
      transform: rotateY( 90deg) translateX(calc(var(--depth) / 2 - var(--width) / 2)) translateZ(calc( var(--width) - var(--depth) / 2 )) scaleX(-1);
    }

    :host .left {
      width: var(--depth);
      transform: rotateY( -90deg) translateX(calc(var(--width) / 2 - var(--depth) / 2)) translateZ(calc(var(--depth) / 2 ))  scaleX(-1); 
    }

    :host .top {
      height: var(--depth);
      transform: rotateX( 90deg) translateY(calc(var(--width) / 2 - var(--depth) / 2)) translateX(0)  translateZ(calc(var(--depth) / 2)) scaleY(-1);
    }

    :host .bottom {
      height: var(--depth);
      transform: rotateX( -90deg) translateY(calc( var(--depth) / 2 - var(--width) / 2))  translateZ(calc(var(--height) - var(--depth) / 2))  scaleY(-1);
    }
   
    
    
  </style>
  <div class="cube">
    <div class="face front"></div>
    <div class="face back"></div>
    <div class="face right"></div>
    <div class="face left"></div>
    <div class="face top"></div>
    <div class="face bottom"></div>
  </div>
`;

class C3Box extends C3Object {
  static get observedAttributes() {
    return [
      ...C3Object.observedAttributes,
      'background',
      'width',
      'height',
      'depth'
    ];
  }

  constructor() {
    super();

    const shape = document.createElement('div');
    shape.style.transformStyle = 'preserve-3d';
    shape.innerHTML = box;
    this.shadowRoot.appendChild(shape);
  }
}

CSSStyleMixin(C3Box, [
  'background',
  'width',
  'height',
  'depth'
], true);

customElements.define('c3-box', C3Box);

class C3Grid extends C3Object {
  #style;

  constructor() {
    super();

    this.#style = document.createElement('style');
    this.shadowRoot.appendChild(this.#style);
  }

  connectedCallback() {
    this.render();
  }

  render() {
    super.render();
    const size = parseFloat(this.getAttribute('size') || '200px');
    const divisions = parseInt(this.getAttribute('divisions') || '10');

    this.shadowRoot.host.style.setProperty('--color', 'rgba(2555, 255, 255, 0.5)');

   this.#style.textContent = `
      :host {
        --size: ${size}px;
        --divisions: ${divisions};
      }
      
      :host::after {
        --stroke: 2.5px;
        --tile: calc(var(--size) / var(--divisions));
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: calc(var(--size) + var(--stroke));
        height: calc(var(--size) + var(--stroke));
        background: repeating-linear-gradient(90deg, var(--color), var(--color) 1px, transparent 1px, transparent var(--tile)) 
            , repeating-linear-gradient(180deg, var(--color), var(--color) 1px, transparent 1px, transparent var(--tile));
        transform: rotateX(90deg)  translate(-50%, -50%);
        transform-style: preserve-3d;
        transform-origin: 0 0;
      }
    `;
  }
}

customElements.define('c3-grid', C3Grid);

class C3Group extends C3Object {
  #slot;
  // #mutationObserver;

  static get observedAttributes() {
    return [...C3Object.observedAttributes];
  }

  constructor() {
    super();

    this.handleSlotChange = this.handleSlotChange.bind(this);
    
    const slot = document.createElement('slot');
    slot.style.display = 'block';
    slot.style.transformStyle = 'preserve-3d';
    this.shadowRoot.appendChild(slot);

    slot.addEventListener('slotchange', this.handleSlotChange);

    // this.#mutationObserver = new MutationObserver(mutations => {
    //   console.log('MUTATION: ', mutations);
    //   for (let mutation of mutations) {
    //     if (mutation.type === 'childList') {
    //       console.log('A child node has been added or removed.');

    //       mutation.addedNodes.forEach(node => {
    //         if (node instanceof C3Object) {
    //           node.addEventListener('change', this.handleChildrenChange);
    //         }
    //       });

    //       mutation.removedNodes.forEach(node => {
    //         if (node instanceof C3Object) {
    //           node.removeEventListener('change', this.handleChildrenChange);
    //         }
    //       });
    //     }
    //   }
    // });

    this.#slot = slot;
    
    // this.#mutationObserver.observe(this.#slot, { childList: true });
  }

  disconnectedCallback() {
    // this.#mutationObserver.unobserve(this.#slot);
    // this.#mutationObserver.disconnect();
    this.#slot.removeEventListener('slotchange', this.handleSlotChange);
  }

  // handleChildrenChange() {
  //   console.log('*********** children change...');
  //   this.render();
  // }

  handleSlotChange() {
    // this.#slot.assignedNodes().forEach(node => {
    //   if (node instanceof C3Object) {
    //     node.removeEventListener('change', this.handleChildrenChange);
    //     node.addEventListener('change', this.handleChildrenChange);
    //   }
    // });
    console.log('****** slot change...');
    this.render();
  }
}

customElements.define('c3-group', C3Group);

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function getAugmentedNamespace(n) {
  if (n.__esModule) return n;
  var f = n.default;
	if (typeof f == "function") {
		var a = function a () {
			if (this instanceof a) {
        return Reflect.construct(f, arguments, this.constructor);
			}
			return f.apply(this, arguments);
		};
		a.prototype = f.prototype;
  } else a = {};
  Object.defineProperty(a, '__esModule', {value: true});
	Object.keys(n).forEach(function (k) {
		var d = Object.getOwnPropertyDescriptor(n, k);
		Object.defineProperty(a, k, d.get ? d : {
			enumerable: true,
			get: function () {
				return n[k];
			}
		});
	});
	return a;
}

var dist = {};

var QuickHull = {};

var subtract_1 = subtract$1;

/**
 * Subtracts vector b from vector a
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
function subtract$1(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    return out
}

var cross_1 = cross$2;

/**
 * Computes the cross product of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
function cross$2(out, a, b) {
    var ax = a[0], ay = a[1], az = a[2],
        bx = b[0], by = b[1], bz = b[2];

    out[0] = ay * bz - az * by;
    out[1] = az * bx - ax * bz;
    out[2] = ax * by - ay * bx;
    return out
}

var squaredLength_1 = squaredLength$1;

/**
 * Calculates the squared length of a vec3
 *
 * @param {vec3} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
function squaredLength$1(a) {
    var x = a[0],
        y = a[1],
        z = a[2];
    return x*x + y*y + z*z
}

var subtract = subtract_1;
var cross$1 = cross_1;
var squaredLength = squaredLength_1;
var ab = [];
var ap = [];
var cr = [];

var squared = function (p, a, b) {
  // // == vector solution
  // var normalize = require('gl-vec3/normalize')
  // var scaleAndAdd = require('gl-vec3/scaleAndAdd')
  // var dot = require('gl-vec3/dot')
  // var squaredDistance = require('gl-vec3/squaredDistance')
  // // n = vector `ab` normalized
  // var n = []
  // // projection = projection of `point` on `n`
  // var projection = []
  // normalize(n, subtract(n, a, b))
  // scaleAndAdd(projection, a, n, dot(n, p))
  // return squaredDistance(projection, p)

  // == parallelogram solution
  //
  //            s
  //      __a________b__
  //       /   |    /
  //      /   h|   /
  //     /_____|__/
  //    p
  //
  //  s = b - a
  //  area = s * h
  //  |ap x s| = s * h
  //  h = |ap x s| / s
  //
  subtract(ab, b, a);
  subtract(ap, p, a);
  var area = squaredLength(cross$1(cr, ap, ab));
  var s = squaredLength(ab);
  if (s === 0) {
    throw Error('a and b are the same point')
  }
  return area / s
};

/*
 * point-line-distance
 *
 * Copyright (c) 2015 Mauricio Poppe
 * Licensed under the MIT license.
 */

var distanceSquared = squared;

var pointLineDistance = function (point, a, b) {
  return Math.sqrt(distanceSquared(point, a, b))
};

var normalize_1 = normalize$1;

/**
 * Normalize a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to normalize
 * @returns {vec3} out
 */
function normalize$1(out, a) {
    var x = a[0],
        y = a[1],
        z = a[2];
    var len = x*x + y*y + z*z;
    if (len > 0) {
        //TODO: evaluate use of glm_invsqrt here?
        len = 1 / Math.sqrt(len);
        out[0] = a[0] * len;
        out[1] = a[1] * len;
        out[2] = a[2] * len;
    }
    return out
}

var normalize = normalize_1;
var sub = subtract_1;
var cross = cross_1;
var tmp = [0, 0, 0];

var getPlaneNormal = planeNormal;

function planeNormal (out, point1, point2, point3) {
  sub(out, point1, point2);
  sub(tmp, point2, point3);
  cross(out, out, tmp);
  return normalize(out, out)
}

var dot_1 = dot;

/**
 * Calculates the dot product of two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} dot product of a and b
 */
function dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
}

var VertexList = {};

(function (exports) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports["default"] = void 0;

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

	function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

	var VertexList = /*#__PURE__*/function () {
	  function VertexList() {
	    _classCallCheck(this, VertexList);

	    this.head = null;
	    this.tail = null;
	  }

	  _createClass(VertexList, [{
	    key: "clear",
	    value: function clear() {
	      this.head = this.tail = null;
	    }
	    /**
	     * Inserts a `node` before `target`, it's assumed that
	     * `target` belongs to this doubly linked list
	     *
	     * @param {*} target
	     * @param {*} node
	     */

	  }, {
	    key: "insertBefore",
	    value: function insertBefore(target, node) {
	      node.prev = target.prev;
	      node.next = target;

	      if (!node.prev) {
	        this.head = node;
	      } else {
	        node.prev.next = node;
	      }

	      target.prev = node;
	    }
	    /**
	     * Inserts a `node` after `target`, it's assumed that
	     * `target` belongs to this doubly linked list
	     *
	     * @param {Vertex} target
	     * @param {Vertex} node
	     */

	  }, {
	    key: "insertAfter",
	    value: function insertAfter(target, node) {
	      node.prev = target;
	      node.next = target.next;

	      if (!node.next) {
	        this.tail = node;
	      } else {
	        node.next.prev = node;
	      }

	      target.next = node;
	    }
	    /**
	     * Appends a `node` to the end of this doubly linked list
	     * Note: `node.next` will be unlinked from `node`
	     * Note: if `node` is part of another linked list call `addAll` instead
	     *
	     * @param {*} node
	     */

	  }, {
	    key: "add",
	    value: function add(node) {
	      if (!this.head) {
	        this.head = node;
	      } else {
	        this.tail.next = node;
	      }

	      node.prev = this.tail; // since node is the new end it doesn't have a next node

	      node.next = null;
	      this.tail = node;
	    }
	    /**
	     * Appends a chain of nodes where `node` is the head,
	     * the difference with `add` is that it correctly sets the position
	     * of the node list `tail` property
	     *
	     * @param {*} node
	     */

	  }, {
	    key: "addAll",
	    value: function addAll(node) {
	      if (!this.head) {
	        this.head = node;
	      } else {
	        this.tail.next = node;
	      }

	      node.prev = this.tail; // find the end of the list

	      while (node.next) {
	        node = node.next;
	      }

	      this.tail = node;
	    }
	    /**
	     * Deletes a `node` from this linked list, it's assumed that `node` is a
	     * member of this linked list
	     *
	     * @param {*} node
	     */

	  }, {
	    key: "remove",
	    value: function remove(node) {
	      if (!node.prev) {
	        this.head = node.next;
	      } else {
	        node.prev.next = node.next;
	      }

	      if (!node.next) {
	        this.tail = node.prev;
	      } else {
	        node.next.prev = node.prev;
	      }
	    }
	    /**
	     * Removes a chain of nodes whose head is `a` and whose tail is `b`,
	     * it's assumed that `a` and `b` belong to this list and also that `a`
	     * comes before `b` in the linked list
	     *
	     * @param {*} a
	     * @param {*} b
	     */

	  }, {
	    key: "removeChain",
	    value: function removeChain(a, b) {
	      if (!a.prev) {
	        this.head = b.next;
	      } else {
	        a.prev.next = b.next;
	      }

	      if (!b.next) {
	        this.tail = a.prev;
	      } else {
	        b.next.prev = a.prev;
	      }
	    }
	  }, {
	    key: "first",
	    value: function first() {
	      return this.head;
	    }
	  }, {
	    key: "isEmpty",
	    value: function isEmpty() {
	      return !this.head;
	    }
	  }]);

	  return VertexList;
	}();

	exports["default"] = VertexList; 
} (VertexList));

var Vertex = {};

(function (exports) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports["default"] = void 0;

	function _createClass(Constructor, protoProps, staticProps) { Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Vertex = /*#__PURE__*/_createClass(function Vertex(point, index) {
	  _classCallCheck(this, Vertex);

	  this.point = point; // index in the input array

	  this.index = index; // vertex is a double linked list node

	  this.next = null;
	  this.prev = null; // the face that is able to see this point

	  this.face = null;
	});

	exports["default"] = Vertex; 
} (Vertex));

var Face = {};

var add_1 = add;

/**
 * Adds two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
function add(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    return out
}

var copy_1 = copy;

/**
 * Copy the values from one vec3 to another
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the source vector
 * @returns {vec3} out
 */
function copy(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    return out
}

var length_1 = length;

/**
 * Calculates the length of a vec3
 *
 * @param {vec3} a vector to calculate length of
 * @returns {Number} length of a
 */
function length(a) {
    var x = a[0],
        y = a[1],
        z = a[2];
    return Math.sqrt(x*x + y*y + z*z)
}

var scale_1 = scale;

/**
 * Scales a vec3 by a scalar number
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec3} out
 */
function scale(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    return out
}

var scaleAndAdd_1 = scaleAndAdd;

/**
 * Adds two vec3's after scaling the second operand by a scalar value
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec3} out
 */
function scaleAndAdd(out, a, b, scale) {
    out[0] = a[0] + (b[0] * scale);
    out[1] = a[1] + (b[1] * scale);
    out[2] = a[2] + (b[2] * scale);
    return out
}

var HalfEdge = {};

var distance_1 = distance;

/**
 * Calculates the euclidian distance between two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} distance between a and b
 */
function distance(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2];
    return Math.sqrt(x*x + y*y + z*z)
}

var squaredDistance_1 = squaredDistance;

/**
 * Calculates the squared euclidian distance between two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} squared distance between a and b
 */
function squaredDistance(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2];
    return x*x + y*y + z*z
}

var global$1 = (typeof global !== "undefined" ? global :
  typeof self !== "undefined" ? self :
  typeof window !== "undefined" ? window : {});

// shim for using process in browser
// based off https://github.com/defunctzombie/node-process/blob/master/browser.js

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
var cachedSetTimeout = defaultSetTimout;
var cachedClearTimeout = defaultClearTimeout;
if (typeof global$1.setTimeout === 'function') {
    cachedSetTimeout = setTimeout;
}
if (typeof global$1.clearTimeout === 'function') {
    cachedClearTimeout = clearTimeout;
}

function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}
function nextTick(fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
}
// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
var title = 'browser';
var platform = 'browser';
var browser$1 = true;
var env = {};
var argv = [];
var version = ''; // empty string to avoid regexp issues
var versions = {};
var release = {};
var config = {};

function noop() {}

var on = noop;
var addListener = noop;
var once = noop;
var off = noop;
var removeListener = noop;
var removeAllListeners = noop;
var emit = noop;

function binding(name) {
    throw new Error('process.binding is not supported');
}

function cwd () { return '/' }
function chdir (dir) {
    throw new Error('process.chdir is not supported');
}function umask() { return 0; }

// from https://github.com/kumavis/browser-process-hrtime/blob/master/index.js
var performance = global$1.performance || {};
var performanceNow =
  performance.now        ||
  performance.mozNow     ||
  performance.msNow      ||
  performance.oNow       ||
  performance.webkitNow  ||
  function(){ return (new Date()).getTime() };

// generate timestamp or delta
// see http://nodejs.org/api/process.html#process_process_hrtime
function hrtime(previousTimestamp){
  var clocktime = performanceNow.call(performance)*1e-3;
  var seconds = Math.floor(clocktime);
  var nanoseconds = Math.floor((clocktime%1)*1e9);
  if (previousTimestamp) {
    seconds = seconds - previousTimestamp[0];
    nanoseconds = nanoseconds - previousTimestamp[1];
    if (nanoseconds<0) {
      seconds--;
      nanoseconds += 1e9;
    }
  }
  return [seconds,nanoseconds]
}

var startTime = new Date();
function uptime() {
  var currentTime = new Date();
  var dif = currentTime - startTime;
  return dif / 1000;
}

var browser$1$1 = {
  nextTick: nextTick,
  title: title,
  browser: browser$1,
  env: env,
  argv: argv,
  version: version,
  versions: versions,
  on: on,
  addListener: addListener,
  once: once,
  off: off,
  removeListener: removeListener,
  removeAllListeners: removeAllListeners,
  emit: emit,
  binding: binding,
  cwd: cwd,
  chdir: chdir,
  umask: umask,
  hrtime: hrtime,
  platform: platform,
  release: release,
  config: config,
  uptime: uptime
};

var src = {exports: {}};

var browser = {exports: {}};

/**
 * Helpers.
 */

var ms;
var hasRequiredMs;

function requireMs () {
	if (hasRequiredMs) return ms;
	hasRequiredMs = 1;
	var s = 1000;
	var m = s * 60;
	var h = m * 60;
	var d = h * 24;
	var w = d * 7;
	var y = d * 365.25;

	/**
	 * Parse or format the given `val`.
	 *
	 * Options:
	 *
	 *  - `long` verbose formatting [false]
	 *
	 * @param {String|Number} val
	 * @param {Object} [options]
	 * @throws {Error} throw an error if val is not a non-empty string or a number
	 * @return {String|Number}
	 * @api public
	 */

	ms = function(val, options) {
	  options = options || {};
	  var type = typeof val;
	  if (type === 'string' && val.length > 0) {
	    return parse(val);
	  } else if (type === 'number' && isFinite(val)) {
	    return options.long ? fmtLong(val) : fmtShort(val);
	  }
	  throw new Error(
	    'val is not a non-empty string or a valid number. val=' +
	      JSON.stringify(val)
	  );
	};

	/**
	 * Parse the given `str` and return milliseconds.
	 *
	 * @param {String} str
	 * @return {Number}
	 * @api private
	 */

	function parse(str) {
	  str = String(str);
	  if (str.length > 100) {
	    return;
	  }
	  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
	    str
	  );
	  if (!match) {
	    return;
	  }
	  var n = parseFloat(match[1]);
	  var type = (match[2] || 'ms').toLowerCase();
	  switch (type) {
	    case 'years':
	    case 'year':
	    case 'yrs':
	    case 'yr':
	    case 'y':
	      return n * y;
	    case 'weeks':
	    case 'week':
	    case 'w':
	      return n * w;
	    case 'days':
	    case 'day':
	    case 'd':
	      return n * d;
	    case 'hours':
	    case 'hour':
	    case 'hrs':
	    case 'hr':
	    case 'h':
	      return n * h;
	    case 'minutes':
	    case 'minute':
	    case 'mins':
	    case 'min':
	    case 'm':
	      return n * m;
	    case 'seconds':
	    case 'second':
	    case 'secs':
	    case 'sec':
	    case 's':
	      return n * s;
	    case 'milliseconds':
	    case 'millisecond':
	    case 'msecs':
	    case 'msec':
	    case 'ms':
	      return n;
	    default:
	      return undefined;
	  }
	}

	/**
	 * Short format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */

	function fmtShort(ms) {
	  var msAbs = Math.abs(ms);
	  if (msAbs >= d) {
	    return Math.round(ms / d) + 'd';
	  }
	  if (msAbs >= h) {
	    return Math.round(ms / h) + 'h';
	  }
	  if (msAbs >= m) {
	    return Math.round(ms / m) + 'm';
	  }
	  if (msAbs >= s) {
	    return Math.round(ms / s) + 's';
	  }
	  return ms + 'ms';
	}

	/**
	 * Long format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */

	function fmtLong(ms) {
	  var msAbs = Math.abs(ms);
	  if (msAbs >= d) {
	    return plural(ms, msAbs, d, 'day');
	  }
	  if (msAbs >= h) {
	    return plural(ms, msAbs, h, 'hour');
	  }
	  if (msAbs >= m) {
	    return plural(ms, msAbs, m, 'minute');
	  }
	  if (msAbs >= s) {
	    return plural(ms, msAbs, s, 'second');
	  }
	  return ms + ' ms';
	}

	/**
	 * Pluralization helper.
	 */

	function plural(ms, msAbs, n, name) {
	  var isPlural = msAbs >= n * 1.5;
	  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
	}
	return ms;
}

var common;
var hasRequiredCommon;

function requireCommon () {
	if (hasRequiredCommon) return common;
	hasRequiredCommon = 1;
	/**
	 * This is the common logic for both the Node.js and web browser
	 * implementations of `debug()`.
	 */

	function setup(env) {
		createDebug.debug = createDebug;
		createDebug.default = createDebug;
		createDebug.coerce = coerce;
		createDebug.disable = disable;
		createDebug.enable = enable;
		createDebug.enabled = enabled;
		createDebug.humanize = requireMs();
		createDebug.destroy = destroy;

		Object.keys(env).forEach(key => {
			createDebug[key] = env[key];
		});

		/**
		* The currently active debug mode names, and names to skip.
		*/

		createDebug.names = [];
		createDebug.skips = [];

		/**
		* Map of special "%n" handling functions, for the debug "format" argument.
		*
		* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
		*/
		createDebug.formatters = {};

		/**
		* Selects a color for a debug namespace
		* @param {String} namespace The namespace string for the debug instance to be colored
		* @return {Number|String} An ANSI color code for the given namespace
		* @api private
		*/
		function selectColor(namespace) {
			let hash = 0;

			for (let i = 0; i < namespace.length; i++) {
				hash = ((hash << 5) - hash) + namespace.charCodeAt(i);
				hash |= 0; // Convert to 32bit integer
			}

			return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
		}
		createDebug.selectColor = selectColor;

		/**
		* Create a debugger with the given `namespace`.
		*
		* @param {String} namespace
		* @return {Function}
		* @api public
		*/
		function createDebug(namespace) {
			let prevTime;
			let enableOverride = null;
			let namespacesCache;
			let enabledCache;

			function debug(...args) {
				// Disabled?
				if (!debug.enabled) {
					return;
				}

				const self = debug;

				// Set `diff` timestamp
				const curr = Number(new Date());
				const ms = curr - (prevTime || curr);
				self.diff = ms;
				self.prev = prevTime;
				self.curr = curr;
				prevTime = curr;

				args[0] = createDebug.coerce(args[0]);

				if (typeof args[0] !== 'string') {
					// Anything else let's inspect with %O
					args.unshift('%O');
				}

				// Apply any `formatters` transformations
				let index = 0;
				args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
					// If we encounter an escaped % then don't increase the array index
					if (match === '%%') {
						return '%';
					}
					index++;
					const formatter = createDebug.formatters[format];
					if (typeof formatter === 'function') {
						const val = args[index];
						match = formatter.call(self, val);

						// Now we need to remove `args[index]` since it's inlined in the `format`
						args.splice(index, 1);
						index--;
					}
					return match;
				});

				// Apply env-specific formatting (colors, etc.)
				createDebug.formatArgs.call(self, args);

				const logFn = self.log || createDebug.log;
				logFn.apply(self, args);
			}

			debug.namespace = namespace;
			debug.useColors = createDebug.useColors();
			debug.color = createDebug.selectColor(namespace);
			debug.extend = extend;
			debug.destroy = createDebug.destroy; // XXX Temporary. Will be removed in the next major release.

			Object.defineProperty(debug, 'enabled', {
				enumerable: true,
				configurable: false,
				get: () => {
					if (enableOverride !== null) {
						return enableOverride;
					}
					if (namespacesCache !== createDebug.namespaces) {
						namespacesCache = createDebug.namespaces;
						enabledCache = createDebug.enabled(namespace);
					}

					return enabledCache;
				},
				set: v => {
					enableOverride = v;
				}
			});

			// Env-specific initialization logic for debug instances
			if (typeof createDebug.init === 'function') {
				createDebug.init(debug);
			}

			return debug;
		}

		function extend(namespace, delimiter) {
			const newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
			newDebug.log = this.log;
			return newDebug;
		}

		/**
		* Enables a debug mode by namespaces. This can include modes
		* separated by a colon and wildcards.
		*
		* @param {String} namespaces
		* @api public
		*/
		function enable(namespaces) {
			createDebug.save(namespaces);
			createDebug.namespaces = namespaces;

			createDebug.names = [];
			createDebug.skips = [];

			let i;
			const split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
			const len = split.length;

			for (i = 0; i < len; i++) {
				if (!split[i]) {
					// ignore empty strings
					continue;
				}

				namespaces = split[i].replace(/\*/g, '.*?');

				if (namespaces[0] === '-') {
					createDebug.skips.push(new RegExp('^' + namespaces.slice(1) + '$'));
				} else {
					createDebug.names.push(new RegExp('^' + namespaces + '$'));
				}
			}
		}

		/**
		* Disable debug output.
		*
		* @return {String} namespaces
		* @api public
		*/
		function disable() {
			const namespaces = [
				...createDebug.names.map(toNamespace),
				...createDebug.skips.map(toNamespace).map(namespace => '-' + namespace)
			].join(',');
			createDebug.enable('');
			return namespaces;
		}

		/**
		* Returns true if the given mode name is enabled, false otherwise.
		*
		* @param {String} name
		* @return {Boolean}
		* @api public
		*/
		function enabled(name) {
			if (name[name.length - 1] === '*') {
				return true;
			}

			let i;
			let len;

			for (i = 0, len = createDebug.skips.length; i < len; i++) {
				if (createDebug.skips[i].test(name)) {
					return false;
				}
			}

			for (i = 0, len = createDebug.names.length; i < len; i++) {
				if (createDebug.names[i].test(name)) {
					return true;
				}
			}

			return false;
		}

		/**
		* Convert regexp to namespace
		*
		* @param {RegExp} regxep
		* @return {String} namespace
		* @api private
		*/
		function toNamespace(regexp) {
			return regexp.toString()
				.substring(2, regexp.toString().length - 2)
				.replace(/\.\*\?$/, '*');
		}

		/**
		* Coerce `val`.
		*
		* @param {Mixed} val
		* @return {Mixed}
		* @api private
		*/
		function coerce(val) {
			if (val instanceof Error) {
				return val.stack || val.message;
			}
			return val;
		}

		/**
		* XXX DO NOT USE. This is a temporary stub function.
		* XXX It WILL be removed in the next major release.
		*/
		function destroy() {
			console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
		}

		createDebug.enable(createDebug.load());

		return createDebug;
	}

	common = setup;
	return common;
}

var hasRequiredBrowser;

function requireBrowser () {
	if (hasRequiredBrowser) return browser.exports;
	hasRequiredBrowser = 1;
	(function (module, exports) {
		/**
		 * This is the web browser implementation of `debug()`.
		 */

		exports.formatArgs = formatArgs;
		exports.save = save;
		exports.load = load;
		exports.useColors = useColors;
		exports.storage = localstorage();
		exports.destroy = (() => {
			let warned = false;

			return () => {
				if (!warned) {
					warned = true;
					console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
				}
			};
		})();

		/**
		 * Colors.
		 */

		exports.colors = [
			'#0000CC',
			'#0000FF',
			'#0033CC',
			'#0033FF',
			'#0066CC',
			'#0066FF',
			'#0099CC',
			'#0099FF',
			'#00CC00',
			'#00CC33',
			'#00CC66',
			'#00CC99',
			'#00CCCC',
			'#00CCFF',
			'#3300CC',
			'#3300FF',
			'#3333CC',
			'#3333FF',
			'#3366CC',
			'#3366FF',
			'#3399CC',
			'#3399FF',
			'#33CC00',
			'#33CC33',
			'#33CC66',
			'#33CC99',
			'#33CCCC',
			'#33CCFF',
			'#6600CC',
			'#6600FF',
			'#6633CC',
			'#6633FF',
			'#66CC00',
			'#66CC33',
			'#9900CC',
			'#9900FF',
			'#9933CC',
			'#9933FF',
			'#99CC00',
			'#99CC33',
			'#CC0000',
			'#CC0033',
			'#CC0066',
			'#CC0099',
			'#CC00CC',
			'#CC00FF',
			'#CC3300',
			'#CC3333',
			'#CC3366',
			'#CC3399',
			'#CC33CC',
			'#CC33FF',
			'#CC6600',
			'#CC6633',
			'#CC9900',
			'#CC9933',
			'#CCCC00',
			'#CCCC33',
			'#FF0000',
			'#FF0033',
			'#FF0066',
			'#FF0099',
			'#FF00CC',
			'#FF00FF',
			'#FF3300',
			'#FF3333',
			'#FF3366',
			'#FF3399',
			'#FF33CC',
			'#FF33FF',
			'#FF6600',
			'#FF6633',
			'#FF9900',
			'#FF9933',
			'#FFCC00',
			'#FFCC33'
		];

		/**
		 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
		 * and the Firebug extension (any Firefox version) are known
		 * to support "%c" CSS customizations.
		 *
		 * TODO: add a `localStorage` variable to explicitly enable/disable colors
		 */

		// eslint-disable-next-line complexity
		function useColors() {
			// NB: In an Electron preload script, document will be defined but not fully
			// initialized. Since we know we're in Chrome, we'll just detect this case
			// explicitly
			if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
				return true;
			}

			// Internet Explorer and Edge do not support colors.
			if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
				return false;
			}

			// Is webkit? http://stackoverflow.com/a/16459606/376773
			// document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
			return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
				// Is firebug? http://stackoverflow.com/a/398120/376773
				(typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
				// Is firefox >= v31?
				// https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
				(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
				// Double check webkit in userAgent just in case we are in a worker
				(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
		}

		/**
		 * Colorize log arguments if enabled.
		 *
		 * @api public
		 */

		function formatArgs(args) {
			args[0] = (this.useColors ? '%c' : '') +
				this.namespace +
				(this.useColors ? ' %c' : ' ') +
				args[0] +
				(this.useColors ? '%c ' : ' ') +
				'+' + module.exports.humanize(this.diff);

			if (!this.useColors) {
				return;
			}

			const c = 'color: ' + this.color;
			args.splice(1, 0, c, 'color: inherit');

			// The final "%c" is somewhat tricky, because there could be other
			// arguments passed either before or after the %c, so we need to
			// figure out the correct index to insert the CSS into
			let index = 0;
			let lastC = 0;
			args[0].replace(/%[a-zA-Z%]/g, match => {
				if (match === '%%') {
					return;
				}
				index++;
				if (match === '%c') {
					// We only are interested in the *last* %c
					// (the user may have provided their own)
					lastC = index;
				}
			});

			args.splice(lastC, 0, c);
		}

		/**
		 * Invokes `console.debug()` when available.
		 * No-op when `console.debug` is not a "function".
		 * If `console.debug` is not available, falls back
		 * to `console.log`.
		 *
		 * @api public
		 */
		exports.log = console.debug || console.log || (() => {});

		/**
		 * Save `namespaces`.
		 *
		 * @param {String} namespaces
		 * @api private
		 */
		function save(namespaces) {
			try {
				if (namespaces) {
					exports.storage.setItem('debug', namespaces);
				} else {
					exports.storage.removeItem('debug');
				}
			} catch (error) {
				// Swallow
				// XXX (@Qix-) should we be logging these?
			}
		}

		/**
		 * Load `namespaces`.
		 *
		 * @return {String} returns the previously persisted debug modes
		 * @api private
		 */
		function load() {
			let r;
			try {
				r = exports.storage.getItem('debug');
			} catch (error) {
				// Swallow
				// XXX (@Qix-) should we be logging these?
			}

			// If debug isn't set in LS, and we're in Electron, try to load $DEBUG
			if (!r && typeof browser$1$1 !== 'undefined' && 'env' in browser$1$1) {
				r = browser$1$1.env.DEBUG;
			}

			return r;
		}

		/**
		 * Localstorage attempts to return the localstorage.
		 *
		 * This is necessary because safari throws
		 * when a user disables cookies/localstorage
		 * and you attempt to access it.
		 *
		 * @return {LocalStorage}
		 * @api private
		 */

		function localstorage() {
			try {
				// TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
				// The Browser also has localStorage in the global context.
				return localStorage;
			} catch (error) {
				// Swallow
				// XXX (@Qix-) should we be logging these?
			}
		}

		module.exports = requireCommon()(exports);

		const {formatters} = module.exports;

		/**
		 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
		 */

		formatters.j = function (v) {
			try {
				return JSON.stringify(v);
			} catch (error) {
				return '[UnexpectedJSONParseError]: ' + error.message;
			}
		}; 
	} (browser, browser.exports));
	return browser.exports;
}

var node = {exports: {}};

// MIT lisence
// from https://github.com/substack/tty-browserify/blob/1ba769a6429d242f36226538835b4034bf6b7886/index.js

function isatty() {
  return false;
}

function ReadStream() {
  throw new Error('tty.ReadStream is not implemented');
}

function WriteStream() {
  throw new Error('tty.ReadStream is not implemented');
}

var _polyfillNode_tty = {
  isatty: isatty,
  ReadStream: ReadStream,
  WriteStream: WriteStream
};

var _polyfillNode_tty$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  ReadStream: ReadStream,
  WriteStream: WriteStream,
  default: _polyfillNode_tty,
  isatty: isatty
});

var require$$0 = /*@__PURE__*/getAugmentedNamespace(_polyfillNode_tty$1);

var lookup = [];
var revLookup = [];
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;
var inited = false;
function init () {
  inited = true;
  var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  for (var i = 0, len = code.length; i < len; ++i) {
    lookup[i] = code[i];
    revLookup[code.charCodeAt(i)] = i;
  }

  revLookup['-'.charCodeAt(0)] = 62;
  revLookup['_'.charCodeAt(0)] = 63;
}

function toByteArray (b64) {
  if (!inited) {
    init();
  }
  var i, j, l, tmp, placeHolders, arr;
  var len = b64.length;

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  placeHolders = b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0;

  // base64 is 4/3 + up to two characters of the original data
  arr = new Arr(len * 3 / 4 - placeHolders);

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len;

  var L = 0;

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)];
    arr[L++] = (tmp >> 16) & 0xFF;
    arr[L++] = (tmp >> 8) & 0xFF;
    arr[L++] = tmp & 0xFF;
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4);
    arr[L++] = tmp & 0xFF;
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2);
    arr[L++] = (tmp >> 8) & 0xFF;
    arr[L++] = tmp & 0xFF;
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp;
  var output = [];
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2]);
    output.push(tripletToBase64(tmp));
  }
  return output.join('')
}

function fromByteArray (uint8) {
  if (!inited) {
    init();
  }
  var tmp;
  var len = uint8.length;
  var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes
  var output = '';
  var parts = [];
  var maxChunkLength = 16383; // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)));
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1];
    output += lookup[tmp >> 2];
    output += lookup[(tmp << 4) & 0x3F];
    output += '==';
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1]);
    output += lookup[tmp >> 10];
    output += lookup[(tmp >> 4) & 0x3F];
    output += lookup[(tmp << 2) & 0x3F];
    output += '=';
  }

  parts.push(output);

  return parts.join('')
}

function read (buffer, offset, isLE, mLen, nBytes) {
  var e, m;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var nBits = -7;
  var i = isLE ? (nBytes - 1) : 0;
  var d = isLE ? -1 : 1;
  var s = buffer[offset + i];

  i += d;

  e = s & ((1 << (-nBits)) - 1);
  s >>= (-nBits);
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1);
  e >>= (-nBits);
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

function write (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0);
  var i = isLE ? 0 : (nBytes - 1);
  var d = isLE ? 1 : -1;
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

  value = Math.abs(value);

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }

    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128;
}

var toString = {}.toString;

var isArray$1 = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */


var INSPECT_MAX_BYTES = 50;

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global$1.TYPED_ARRAY_SUPPORT !== undefined
  ? global$1.TYPED_ARRAY_SUPPORT
  : true;

/*
 * Export kMaxLength after typed array support is determined.
 */
kMaxLength();

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length);
    that.__proto__ = Buffer.prototype;
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length);
    }
    that.length = length;
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192; // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype;
  return arr
};

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
};

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype;
  Buffer.__proto__ = Uint8Array;
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) ;
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size);
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
};

function allocUnsafe (that, size) {
  assertSize(size);
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0);
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0;
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
};
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
};

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8';
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0;
  that = createBuffer(that, length);

  var actual = that.write(string, encoding);

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual);
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0;
  that = createBuffer(that, length);
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255;
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength; // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array);
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset);
  } else {
    array = new Uint8Array(array, byteOffset, length);
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array;
    that.__proto__ = Buffer.prototype;
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array);
  }
  return that
}

function fromObject (that, obj) {
  if (internalIsBuffer(obj)) {
    var len = checked(obj.length) | 0;
    that = createBuffer(that, len);

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len);
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray$1(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}
Buffer.isBuffer = isBuffer$1;
function internalIsBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!internalIsBuffer(a) || !internalIsBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length;
  var y = b.length;

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
};

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
};

Buffer.concat = function concat (list, length) {
  if (!isArray$1(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i;
  if (length === undefined) {
    length = 0;
    for (i = 0; i < list.length; ++i) {
      length += list[i].length;
    }
  }

  var buffer = Buffer.allocUnsafe(length);
  var pos = 0;
  for (i = 0; i < list.length; ++i) {
    var buf = list[i];
    if (!internalIsBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos);
    pos += buf.length;
  }
  return buffer
};

function byteLength (string, encoding) {
  if (internalIsBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string;
  }

  var len = string.length;
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false;
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase();
        loweredCase = true;
    }
  }
}
Buffer.byteLength = byteLength;

function slowToString (encoding, start, end) {
  var loweredCase = false;

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0;
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length;
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0;
  start >>>= 0;

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8';

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase();
        loweredCase = true;
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true;

function swap (b, n, m) {
  var i = b[n];
  b[n] = b[m];
  b[m] = i;
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length;
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1);
  }
  return this
};

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length;
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3);
    swap(this, i + 1, i + 2);
  }
  return this
};

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length;
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7);
    swap(this, i + 1, i + 6);
    swap(this, i + 2, i + 5);
    swap(this, i + 3, i + 4);
  }
  return this
};

Buffer.prototype.toString = function toString () {
  var length = this.length | 0;
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
};

Buffer.prototype.equals = function equals (b) {
  if (!internalIsBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
};

Buffer.prototype.inspect = function inspect () {
  var str = '';
  var max = INSPECT_MAX_BYTES;
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ');
    if (this.length > max) str += ' ... ';
  }
  return '<Buffer ' + str + '>'
};

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!internalIsBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0;
  }
  if (end === undefined) {
    end = target ? target.length : 0;
  }
  if (thisStart === undefined) {
    thisStart = 0;
  }
  if (thisEnd === undefined) {
    thisEnd = this.length;
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0;
  end >>>= 0;
  thisStart >>>= 0;
  thisEnd >>>= 0;

  if (this === target) return 0

  var x = thisEnd - thisStart;
  var y = end - start;
  var len = Math.min(x, y);

  var thisCopy = this.slice(thisStart, thisEnd);
  var targetCopy = target.slice(start, end);

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i];
      y = targetCopy[i];
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
};

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset;
    byteOffset = 0;
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff;
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000;
  }
  byteOffset = +byteOffset;  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1);
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1;
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0;
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding);
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (internalIsBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF; // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1;
  var arrLength = arr.length;
  var valLength = val.length;

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase();
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2;
      arrLength /= 2;
      valLength /= 2;
      byteOffset /= 2;
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i;
  if (dir) {
    var foundIndex = -1;
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i;
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex;
        foundIndex = -1;
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
    for (i = byteOffset; i >= 0; i--) {
      var found = true;
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false;
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
};

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
};

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
};

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0;
  var remaining = buf.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = Number(length);
    if (length > remaining) {
      length = remaining;
    }
  }

  // must be an even number of digits
  var strLen = string.length;
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2;
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16);
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed;
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8';
    length = this.length;
    offset = 0;
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset;
    length = this.length;
    offset = 0;
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0;
    if (isFinite(length)) {
      length = length | 0;
      if (encoding === undefined) encoding = 'utf8';
    } else {
      encoding = length;
      length = undefined;
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset;
  if (length === undefined || length > remaining) length = remaining;

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8';

  var loweredCase = false;
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase();
        loweredCase = true;
    }
  }
};

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
};

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return fromByteArray(buf)
  } else {
    return fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end);
  var res = [];

  var i = start;
  while (i < end) {
    var firstByte = buf[i];
    var codePoint = null;
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1;

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint;

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte;
          }
          break
        case 2:
          secondByte = buf[i + 1];
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F);
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint;
            }
          }
          break
        case 3:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F);
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint;
            }
          }
          break
        case 4:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          fourthByte = buf[i + 3];
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F);
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint;
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD;
      bytesPerSequence = 1;
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000;
      res.push(codePoint >>> 10 & 0x3FF | 0xD800);
      codePoint = 0xDC00 | codePoint & 0x3FF;
    }

    res.push(codePoint);
    i += bytesPerSequence;
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000;

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length;
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = '';
  var i = 0;
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    );
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = '';
  end = Math.min(buf.length, end);

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F);
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = '';
  end = Math.min(buf.length, end);

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i]);
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length;

  if (!start || start < 0) start = 0;
  if (!end || end < 0 || end > len) end = len;

  var out = '';
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i]);
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end);
  var res = '';
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length;
  start = ~~start;
  end = end === undefined ? len : ~~end;

  if (start < 0) {
    start += len;
    if (start < 0) start = 0;
  } else if (start > len) {
    start = len;
  }

  if (end < 0) {
    end += len;
    if (end < 0) end = 0;
  } else if (end > len) {
    end = len;
  }

  if (end < start) end = start;

  var newBuf;
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end);
    newBuf.__proto__ = Buffer.prototype;
  } else {
    var sliceLen = end - start;
    newBuf = new Buffer(sliceLen, undefined);
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start];
    }
  }

  return newBuf
};

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var val = this[offset];
  var mul = 1;
  var i = 0;
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul;
  }

  return val
};

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length);
  }

  var val = this[offset + --byteLength];
  var mul = 1;
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul;
  }

  return val
};

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length);
  return this[offset]
};

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  return this[offset] | (this[offset + 1] << 8)
};

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  return (this[offset] << 8) | this[offset + 1]
};

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
};

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
};

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var val = this[offset];
  var mul = 1;
  var i = 0;
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul;
  }
  mul *= 0x80;

  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

  return val
};

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var i = byteLength;
  var mul = 1;
  var val = this[offset + --i];
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul;
  }
  mul *= 0x80;

  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

  return val
};

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length);
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
};

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  var val = this[offset] | (this[offset + 1] << 8);
  return (val & 0x8000) ? val | 0xFFFF0000 : val
};

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  var val = this[offset + 1] | (this[offset] << 8);
  return (val & 0x8000) ? val | 0xFFFF0000 : val
};

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
};

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
};

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return read(this, offset, true, 23, 4)
};

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return read(this, offset, false, 23, 4)
};

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length);
  return read(this, offset, true, 52, 8)
};

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length);
  return read(this, offset, false, 52, 8)
};

function checkInt (buf, value, offset, ext, max, min) {
  if (!internalIsBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
    checkInt(this, value, offset, byteLength, maxBytes, 0);
  }

  var mul = 1;
  var i = 0;
  this[offset] = value & 0xFF;
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF;
  }

  return offset + byteLength
};

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
    checkInt(this, value, offset, byteLength, maxBytes, 0);
  }

  var i = byteLength - 1;
  var mul = 1;
  this[offset + i] = value & 0xFF;
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF;
  }

  return offset + byteLength
};

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
  this[offset] = (value & 0xff);
  return offset + 1
};

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1;
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8;
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff);
    this[offset + 1] = (value >>> 8);
  } else {
    objectWriteUInt16(this, value, offset, true);
  }
  return offset + 2
};

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8);
    this[offset + 1] = (value & 0xff);
  } else {
    objectWriteUInt16(this, value, offset, false);
  }
  return offset + 2
};

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1;
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff;
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24);
    this[offset + 2] = (value >>> 16);
    this[offset + 1] = (value >>> 8);
    this[offset] = (value & 0xff);
  } else {
    objectWriteUInt32(this, value, offset, true);
  }
  return offset + 4
};

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24);
    this[offset + 1] = (value >>> 16);
    this[offset + 2] = (value >>> 8);
    this[offset + 3] = (value & 0xff);
  } else {
    objectWriteUInt32(this, value, offset, false);
  }
  return offset + 4
};

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1);

    checkInt(this, value, offset, byteLength, limit - 1, -limit);
  }

  var i = 0;
  var mul = 1;
  var sub = 0;
  this[offset] = value & 0xFF;
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1;
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
  }

  return offset + byteLength
};

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1);

    checkInt(this, value, offset, byteLength, limit - 1, -limit);
  }

  var i = byteLength - 1;
  var mul = 1;
  var sub = 0;
  this[offset + i] = value & 0xFF;
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1;
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
  }

  return offset + byteLength
};

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80);
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
  if (value < 0) value = 0xff + value + 1;
  this[offset] = (value & 0xff);
  return offset + 1
};

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff);
    this[offset + 1] = (value >>> 8);
  } else {
    objectWriteUInt16(this, value, offset, true);
  }
  return offset + 2
};

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8);
    this[offset + 1] = (value & 0xff);
  } else {
    objectWriteUInt16(this, value, offset, false);
  }
  return offset + 2
};

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff);
    this[offset + 1] = (value >>> 8);
    this[offset + 2] = (value >>> 16);
    this[offset + 3] = (value >>> 24);
  } else {
    objectWriteUInt32(this, value, offset, true);
  }
  return offset + 4
};

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
  if (value < 0) value = 0xffffffff + value + 1;
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24);
    this[offset + 1] = (value >>> 16);
    this[offset + 2] = (value >>> 8);
    this[offset + 3] = (value & 0xff);
  } else {
    objectWriteUInt32(this, value, offset, false);
  }
  return offset + 4
};

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4);
  }
  write(buf, value, offset, littleEndian, 23, 4);
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
};

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
};

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8);
  }
  write(buf, value, offset, littleEndian, 52, 8);
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
};

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
};

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0;
  if (!end && end !== 0) end = this.length;
  if (targetStart >= target.length) targetStart = target.length;
  if (!targetStart) targetStart = 0;
  if (end > 0 && end < start) end = start;

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length;
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start;
  }

  var len = end - start;
  var i;

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start];
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start];
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    );
  }

  return len
};

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start;
      start = 0;
      end = this.length;
    } else if (typeof end === 'string') {
      encoding = end;
      end = this.length;
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0);
      if (code < 256) {
        val = code;
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255;
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0;
  end = end === undefined ? this.length : end >>> 0;

  if (!val) val = 0;

  var i;
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val;
    }
  } else {
    var bytes = internalIsBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString());
    var len = bytes.length;
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len];
    }
  }

  return this
};

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '');
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '=';
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity;
  var codePoint;
  var length = string.length;
  var leadSurrogate = null;
  var bytes = [];

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i);

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          continue
        }

        // valid lead
        leadSurrogate = codePoint;

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
        leadSurrogate = codePoint;
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
    }

    leadSurrogate = null;

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint);
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      );
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      );
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      );
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = [];
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF);
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo;
  var byteArray = [];
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i);
    hi = c >> 8;
    lo = c % 256;
    byteArray.push(lo);
    byteArray.push(hi);
  }

  return byteArray
}


function base64ToBytes (str) {
  return toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i];
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}


// the following is from is-buffer, also by Feross Aboukhadijeh and with same lisence
// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
function isBuffer$1(obj) {
  return obj != null && (!!obj._isBuffer || isFastBuffer(obj) || isSlowBuffer(obj))
}

function isFastBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isFastBuffer(obj.slice(0, 0))
}

var inherits;
if (typeof Object.create === 'function'){
  inherits = function inherits(ctor, superCtor) {
    // implementation from standard node.js 'util' module
    ctor.super_ = superCtor;
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  inherits = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor;
    var TempCtor = function () {};
    TempCtor.prototype = superCtor.prototype;
    ctor.prototype = new TempCtor();
    ctor.prototype.constructor = ctor;
  };
}
var inherits$1 = inherits;

var getOwnPropertyDescriptors = Object.getOwnPropertyDescriptors ||
  function getOwnPropertyDescriptors(obj) {
    var keys = Object.keys(obj);
    var descriptors = {};
    for (var i = 0; i < keys.length; i++) {
      descriptors[keys[i]] = Object.getOwnPropertyDescriptor(obj, keys[i]);
    }
    return descriptors;
  };

var formatRegExp = /%[sdj%]/g;
function format(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
}

// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
function deprecate(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global$1.process)) {
    return function() {
      return deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (browser$1$1.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (browser$1$1.throwDeprecation) {
        throw new Error(msg);
      } else if (browser$1$1.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
}

var debugs = {};
var debugEnviron;
function debuglog(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = browser$1$1.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = 0;
      debugs[set] = function() {
        var msg = format.apply(null, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
}

/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    _extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}

// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var length = output.reduce(function(prev, cur) {
    if (cur.indexOf('\n') >= 0) ;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}

function isBoolean(arg) {
  return typeof arg === 'boolean';
}

function isNull(arg) {
  return arg === null;
}

function isNullOrUndefined(arg) {
  return arg == null;
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isString(arg) {
  return typeof arg === 'string';
}

function isSymbol(arg) {
  return typeof arg === 'symbol';
}

function isUndefined(arg) {
  return arg === void 0;
}

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}

function isFunction(arg) {
  return typeof arg === 'function';
}

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}

function isBuffer(maybeBuf) {
  return Buffer.isBuffer(maybeBuf);
}

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
function log() {
  console.log('%s - %s', timestamp(), format.apply(null, arguments));
}

function _extend(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
}
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

var kCustomPromisifiedSymbol = typeof Symbol !== 'undefined' ? Symbol('util.promisify.custom') : undefined;

function promisify(original) {
  if (typeof original !== 'function')
    throw new TypeError('The "original" argument must be of type Function');

  if (kCustomPromisifiedSymbol && original[kCustomPromisifiedSymbol]) {
    var fn = original[kCustomPromisifiedSymbol];
    if (typeof fn !== 'function') {
      throw new TypeError('The "util.promisify.custom" argument must be of type Function');
    }
    Object.defineProperty(fn, kCustomPromisifiedSymbol, {
      value: fn, enumerable: false, writable: false, configurable: true
    });
    return fn;
  }

  function fn() {
    var promiseResolve, promiseReject;
    var promise = new Promise(function (resolve, reject) {
      promiseResolve = resolve;
      promiseReject = reject;
    });

    var args = [];
    for (var i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }
    args.push(function (err, value) {
      if (err) {
        promiseReject(err);
      } else {
        promiseResolve(value);
      }
    });

    try {
      original.apply(this, args);
    } catch (err) {
      promiseReject(err);
    }

    return promise;
  }

  Object.setPrototypeOf(fn, Object.getPrototypeOf(original));

  if (kCustomPromisifiedSymbol) Object.defineProperty(fn, kCustomPromisifiedSymbol, {
    value: fn, enumerable: false, writable: false, configurable: true
  });
  return Object.defineProperties(
    fn,
    getOwnPropertyDescriptors(original)
  );
}

promisify.custom = kCustomPromisifiedSymbol;

function callbackifyOnRejected(reason, cb) {
  // `!reason` guard inspired by bluebird (Ref: https://goo.gl/t5IS6M).
  // Because `null` is a special error value in callbacks which means "no error
  // occurred", we error-wrap so the callback consumer can distinguish between
  // "the promise rejected with null" or "the promise fulfilled with undefined".
  if (!reason) {
    var newReason = new Error('Promise was rejected with a falsy value');
    newReason.reason = reason;
    reason = newReason;
  }
  return cb(reason);
}

function callbackify(original) {
  if (typeof original !== 'function') {
    throw new TypeError('The "original" argument must be of type Function');
  }

  // We DO NOT return the promise as it gives the user a false sense that
  // the promise is actually somehow related to the callback's execution
  // and that the callback throwing will reject the promise.
  function callbackified() {
    var args = [];
    for (var i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }

    var maybeCb = args.pop();
    if (typeof maybeCb !== 'function') {
      throw new TypeError('The last argument must be of type Function');
    }
    var self = this;
    var cb = function() {
      return maybeCb.apply(self, arguments);
    };
    // In true node style we process the callback on `nextTick` with all the
    // implications (stack, `uncaughtException`, `async_hooks`)
    original.apply(this, args)
      .then(function(ret) { browser$1$1.nextTick(cb.bind(null, null, ret)); },
        function(rej) { browser$1$1.nextTick(callbackifyOnRejected.bind(null, rej, cb)); });
  }

  Object.setPrototypeOf(callbackified, Object.getPrototypeOf(original));
  Object.defineProperties(callbackified, getOwnPropertyDescriptors(original));
  return callbackified;
}

var _polyfillNode_util = {
  inherits: inherits$1,
  _extend: _extend,
  log: log,
  isBuffer: isBuffer,
  isPrimitive: isPrimitive,
  isFunction: isFunction,
  isError: isError,
  isDate: isDate,
  isObject: isObject,
  isRegExp: isRegExp,
  isUndefined: isUndefined,
  isSymbol: isSymbol,
  isString: isString,
  isNumber: isNumber,
  isNullOrUndefined: isNullOrUndefined,
  isNull: isNull,
  isBoolean: isBoolean,
  isArray: isArray,
  inspect: inspect,
  deprecate: deprecate,
  format: format,
  debuglog: debuglog,
  promisify: promisify,
  callbackify: callbackify,
};

var _polyfillNode_util$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  _extend: _extend,
  callbackify: callbackify,
  debuglog: debuglog,
  default: _polyfillNode_util,
  deprecate: deprecate,
  format: format,
  inherits: inherits$1,
  inspect: inspect,
  isArray: isArray,
  isBoolean: isBoolean,
  isBuffer: isBuffer,
  isDate: isDate,
  isError: isError,
  isFunction: isFunction,
  isNull: isNull,
  isNullOrUndefined: isNullOrUndefined,
  isNumber: isNumber,
  isObject: isObject,
  isPrimitive: isPrimitive,
  isRegExp: isRegExp,
  isString: isString,
  isSymbol: isSymbol,
  isUndefined: isUndefined,
  log: log,
  promisify: promisify
});

var require$$1 = /*@__PURE__*/getAugmentedNamespace(_polyfillNode_util$1);

var hasRequiredNode;

function requireNode () {
	if (hasRequiredNode) return node.exports;
	hasRequiredNode = 1;
	(function (module, exports) {
		const tty = require$$0;
		const util = require$$1;

		/**
		 * This is the Node.js implementation of `debug()`.
		 */

		exports.init = init;
		exports.log = log;
		exports.formatArgs = formatArgs;
		exports.save = save;
		exports.load = load;
		exports.useColors = useColors;
		exports.destroy = util.deprecate(
			() => {},
			'Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.'
		);

		/**
		 * Colors.
		 */

		exports.colors = [6, 2, 3, 4, 5, 1];

		try {
			// Optional dependency (as in, doesn't need to be installed, NOT like optionalDependencies in package.json)
			// eslint-disable-next-line import/no-extraneous-dependencies
			const supportsColor = require('supports-color');

			if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
				exports.colors = [
					20,
					21,
					26,
					27,
					32,
					33,
					38,
					39,
					40,
					41,
					42,
					43,
					44,
					45,
					56,
					57,
					62,
					63,
					68,
					69,
					74,
					75,
					76,
					77,
					78,
					79,
					80,
					81,
					92,
					93,
					98,
					99,
					112,
					113,
					128,
					129,
					134,
					135,
					148,
					149,
					160,
					161,
					162,
					163,
					164,
					165,
					166,
					167,
					168,
					169,
					170,
					171,
					172,
					173,
					178,
					179,
					184,
					185,
					196,
					197,
					198,
					199,
					200,
					201,
					202,
					203,
					204,
					205,
					206,
					207,
					208,
					209,
					214,
					215,
					220,
					221
				];
			}
		} catch (error) {
			// Swallow - we only care if `supports-color` is available; it doesn't have to be.
		}

		/**
		 * Build up the default `inspectOpts` object from the environment variables.
		 *
		 *   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
		 */

		exports.inspectOpts = Object.keys(browser$1$1.env).filter(key => {
			return /^debug_/i.test(key);
		}).reduce((obj, key) => {
			// Camel-case
			const prop = key
				.substring(6)
				.toLowerCase()
				.replace(/_([a-z])/g, (_, k) => {
					return k.toUpperCase();
				});

			// Coerce string value into JS value
			let val = browser$1$1.env[key];
			if (/^(yes|on|true|enabled)$/i.test(val)) {
				val = true;
			} else if (/^(no|off|false|disabled)$/i.test(val)) {
				val = false;
			} else if (val === 'null') {
				val = null;
			} else {
				val = Number(val);
			}

			obj[prop] = val;
			return obj;
		}, {});

		/**
		 * Is stdout a TTY? Colored output is enabled when `true`.
		 */

		function useColors() {
			return 'colors' in exports.inspectOpts ?
				Boolean(exports.inspectOpts.colors) :
				tty.isatty(browser$1$1.stderr.fd);
		}

		/**
		 * Adds ANSI color escape codes if enabled.
		 *
		 * @api public
		 */

		function formatArgs(args) {
			const {namespace: name, useColors} = this;

			if (useColors) {
				const c = this.color;
				const colorCode = '\u001B[3' + (c < 8 ? c : '8;5;' + c);
				const prefix = `  ${colorCode};1m${name} \u001B[0m`;

				args[0] = prefix + args[0].split('\n').join('\n' + prefix);
				args.push(colorCode + 'm+' + module.exports.humanize(this.diff) + '\u001B[0m');
			} else {
				args[0] = getDate() + name + ' ' + args[0];
			}
		}

		function getDate() {
			if (exports.inspectOpts.hideDate) {
				return '';
			}
			return new Date().toISOString() + ' ';
		}

		/**
		 * Invokes `util.formatWithOptions()` with the specified arguments and writes to stderr.
		 */

		function log(...args) {
			return browser$1$1.stderr.write(util.formatWithOptions(exports.inspectOpts, ...args) + '\n');
		}

		/**
		 * Save `namespaces`.
		 *
		 * @param {String} namespaces
		 * @api private
		 */
		function save(namespaces) {
			if (namespaces) {
				browser$1$1.env.DEBUG = namespaces;
			} else {
				// If you set a process.env field to null or undefined, it gets cast to the
				// string 'null' or 'undefined'. Just delete instead.
				delete browser$1$1.env.DEBUG;
			}
		}

		/**
		 * Load `namespaces`.
		 *
		 * @return {String} returns the previously persisted debug modes
		 * @api private
		 */

		function load() {
			return browser$1$1.env.DEBUG;
		}

		/**
		 * Init logic for `debug` instances.
		 *
		 * Create a new `inspectOpts` object in case `useColors` is set
		 * differently for a particular `debug` instance.
		 */

		function init(debug) {
			debug.inspectOpts = {};

			const keys = Object.keys(exports.inspectOpts);
			for (let i = 0; i < keys.length; i++) {
				debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
			}
		}

		module.exports = requireCommon()(exports);

		const {formatters} = module.exports;

		/**
		 * Map %o to `util.inspect()`, all on a single line.
		 */

		formatters.o = function (v) {
			this.inspectOpts.colors = this.useColors;
			return util.inspect(v, this.inspectOpts)
				.split('\n')
				.map(str => str.trim())
				.join(' ');
		};

		/**
		 * Map %O to `util.inspect()`, allowing multiple lines if needed.
		 */

		formatters.O = function (v) {
			this.inspectOpts.colors = this.useColors;
			return util.inspect(v, this.inspectOpts);
		}; 
	} (node, node.exports));
	return node.exports;
}

if (typeof browser$1$1 === 'undefined' || browser$1$1.type === 'renderer' || browser$1$1.browser === true || browser$1$1.__nwjs) {
	src.exports = requireBrowser();
} else {
	src.exports = requireNode();
}

var srcExports = src.exports;

(function (exports) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports["default"] = void 0;

	var _distance = _interopRequireDefault(distance_1);

	var _squaredDistance = _interopRequireDefault(squaredDistance_1);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

	function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

	var debug = srcExports('halfedge');

	var HalfEdge = /*#__PURE__*/function () {
	  function HalfEdge(vertex, face) {
	    _classCallCheck(this, HalfEdge);

	    this.vertex = vertex;
	    this.face = face;
	    this.next = null;
	    this.prev = null;
	    this.opposite = null;
	  }

	  _createClass(HalfEdge, [{
	    key: "head",
	    value: function head() {
	      return this.vertex;
	    }
	  }, {
	    key: "tail",
	    value: function tail() {
	      return this.prev ? this.prev.vertex : null;
	    }
	  }, {
	    key: "length",
	    value: function length() {
	      if (this.tail()) {
	        return (0, _distance["default"])(this.tail().point, this.head().point);
	      }

	      return -1;
	    }
	  }, {
	    key: "lengthSquared",
	    value: function lengthSquared() {
	      if (this.tail()) {
	        return (0, _squaredDistance["default"])(this.tail().point, this.head().point);
	      }

	      return -1;
	    }
	  }, {
	    key: "setOpposite",
	    value: function setOpposite(edge) {
	      var me = this;

	      if (debug.enabled) {
	        debug("opposite ".concat(me.tail().index, " <--> ").concat(me.head().index, " between ").concat(me.face.collectIndices(), ", ").concat(edge.face.collectIndices()));
	      }

	      this.opposite = edge;
	      edge.opposite = this;
	    }
	  }]);

	  return HalfEdge;
	}();

	exports["default"] = HalfEdge; 
} (HalfEdge));

(function (exports) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports["default"] = exports.VISIBLE = exports.NON_CONVEX = exports.DELETED = void 0;

	var _dot = _interopRequireDefault(dot_1);

	var _add = _interopRequireDefault(add_1);

	var _subtract = _interopRequireDefault(subtract_1);

	var _cross = _interopRequireDefault(cross_1);

	var _copy = _interopRequireDefault(copy_1);

	var _length = _interopRequireDefault(length_1);

	var _scale = _interopRequireDefault(scale_1);

	var _scaleAndAdd = _interopRequireDefault(scaleAndAdd_1);

	var _normalize = _interopRequireDefault(normalize_1);

	var _HalfEdge = _interopRequireDefault(HalfEdge);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

	function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

	var debug = srcExports('face');

	var VISIBLE = 0;
	exports.VISIBLE = VISIBLE;
	var NON_CONVEX = 1;
	exports.NON_CONVEX = NON_CONVEX;
	var DELETED = 2;
	exports.DELETED = DELETED;

	var Face = /*#__PURE__*/function () {
	  function Face() {
	    _classCallCheck(this, Face);

	    this.normal = [];
	    this.centroid = []; // signed distance from face to the origin

	    this.offset = 0; // pointer to the a vertex in a double linked list this face can see

	    this.outside = null;
	    this.mark = VISIBLE;
	    this.edge = null;
	    this.nVertices = 0;
	  }

	  _createClass(Face, [{
	    key: "getEdge",
	    value: function getEdge(i) {
	      if (typeof i !== 'number') {
	        throw Error('requires a number');
	      }

	      var it = this.edge;

	      while (i > 0) {
	        it = it.next;
	        i -= 1;
	      }

	      while (i < 0) {
	        it = it.prev;
	        i += 1;
	      }

	      return it;
	    }
	  }, {
	    key: "computeNormal",
	    value: function computeNormal() {
	      var e0 = this.edge;
	      var e1 = e0.next;
	      var e2 = e1.next;
	      var v2 = (0, _subtract["default"])([], e1.head().point, e0.head().point);
	      var t = [];
	      var v1 = [];
	      this.nVertices = 2;
	      this.normal = [0, 0, 0];

	      while (e2 !== e0) {
	        (0, _copy["default"])(v1, v2);
	        (0, _subtract["default"])(v2, e2.head().point, e0.head().point);
	        (0, _add["default"])(this.normal, this.normal, (0, _cross["default"])(t, v1, v2));
	        e2 = e2.next;
	        this.nVertices += 1;
	      }

	      this.area = (0, _length["default"])(this.normal); // normalize the vector, since we've already calculated the area
	      // it's cheaper to scale the vector using this quantity instead of
	      // doing the same operation again

	      this.normal = (0, _scale["default"])(this.normal, this.normal, 1 / this.area);
	    }
	  }, {
	    key: "computeNormalMinArea",
	    value: function computeNormalMinArea(minArea) {
	      this.computeNormal();

	      if (this.area < minArea) {
	        // compute the normal without the longest edge
	        var maxEdge;
	        var maxSquaredLength = 0;
	        var edge = this.edge; // find the longest edge (in length) in the chain of edges

	        do {
	          var lengthSquared = edge.lengthSquared();

	          if (lengthSquared > maxSquaredLength) {
	            maxEdge = edge;
	            maxSquaredLength = lengthSquared;
	          }

	          edge = edge.next;
	        } while (edge !== this.edge);

	        var p1 = maxEdge.tail().point;
	        var p2 = maxEdge.head().point;
	        var maxVector = (0, _subtract["default"])([], p2, p1);
	        var maxLength = Math.sqrt(maxSquaredLength); // maxVector is normalized after this operation

	        (0, _scale["default"])(maxVector, maxVector, 1 / maxLength); // compute the projection of maxVector over this face normal

	        var maxProjection = (0, _dot["default"])(this.normal, maxVector); // subtract the quantity maxEdge adds on the normal

	        (0, _scaleAndAdd["default"])(this.normal, this.normal, maxVector, -maxProjection); // renormalize `this.normal`

	        (0, _normalize["default"])(this.normal, this.normal);
	      }
	    }
	  }, {
	    key: "computeCentroid",
	    value: function computeCentroid() {
	      this.centroid = [0, 0, 0];
	      var edge = this.edge;

	      do {
	        (0, _add["default"])(this.centroid, this.centroid, edge.head().point);
	        edge = edge.next;
	      } while (edge !== this.edge);

	      (0, _scale["default"])(this.centroid, this.centroid, 1 / this.nVertices);
	    }
	  }, {
	    key: "computeNormalAndCentroid",
	    value: function computeNormalAndCentroid(minArea) {
	      if (typeof minArea !== 'undefined') {
	        this.computeNormalMinArea(minArea);
	      } else {
	        this.computeNormal();
	      }

	      this.computeCentroid();
	      this.offset = (0, _dot["default"])(this.normal, this.centroid);
	    }
	  }, {
	    key: "distanceToPlane",
	    value: function distanceToPlane(point) {
	      return (0, _dot["default"])(this.normal, point) - this.offset;
	    }
	    /**
	     * @private
	     *
	     * Connects two edges assuming that prev.head().point === next.tail().point
	     *
	     * @param {HalfEdge} prev
	     * @param {HalfEdge} next
	     */

	  }, {
	    key: "connectHalfEdges",
	    value: function connectHalfEdges(prev, next) {
	      var discardedFace;

	      if (prev.opposite.face === next.opposite.face) {
	        // `prev` is remove a redundant edge
	        var oppositeFace = next.opposite.face;
	        var oppositeEdge;

	        if (prev === this.edge) {
	          this.edge = next;
	        }

	        if (oppositeFace.nVertices === 3) {
	          // case:
	          // remove the face on the right
	          //
	          //       /|\
	          //      / | \ the face on the right
	          //     /  |  \ --> opposite edge
	          //    / a |   \
	          //   *----*----*
	          //  /     b  |  \
	          //           ▾
	          //      redundant edge
	          //
	          // Note: the opposite edge is actually in the face to the right
	          // of the face to be destroyed
	          oppositeEdge = next.opposite.prev.opposite;
	          oppositeFace.mark = DELETED;
	          discardedFace = oppositeFace;
	        } else {
	          // case:
	          //          t
	          //        *----
	          //       /| <- right face's redundant edge
	          //      / | opposite edge
	          //     /  |  ▴   /
	          //    / a |  |  /
	          //   *----*----*
	          //  /     b  |  \
	          //           ▾
	          //      redundant edge
	          oppositeEdge = next.opposite.next; // make sure that the link `oppositeFace.edge` points correctly even
	          // after the right face redundant edge is removed

	          if (oppositeFace.edge === oppositeEdge.prev) {
	            oppositeFace.edge = oppositeEdge;
	          } //       /|   /
	          //      / | t/opposite edge
	          //     /  | / ▴  /
	          //    / a |/  | /
	          //   *----*----*
	          //  /     b     \


	          oppositeEdge.prev = oppositeEdge.prev.prev;
	          oppositeEdge.prev.next = oppositeEdge;
	        } //       /|
	        //      / |
	        //     /  |
	        //    / a |
	        //   *----*----*
	        //  /     b  ▴  \
	        //           |
	        //     redundant edge


	        next.prev = prev.prev;
	        next.prev.next = next; //       / \  \
	        //      /   \->\
	        //     /     \<-\ opposite edge
	        //    / a     \  \
	        //   *----*----*
	        //  /     b  ^  \

	        next.setOpposite(oppositeEdge);
	        oppositeFace.computeNormalAndCentroid();
	      } else {
	        // trivial case
	        //        *
	        //       /|\
	        //      / | \
	        //     /  |--> next
	        //    / a |   \
	        //   *----*----*
	        //    \ b |   /
	        //     \  |--> prev
	        //      \ | /
	        //       \|/
	        //        *
	        prev.next = next;
	        next.prev = prev;
	      }

	      return discardedFace;
	    }
	  }, {
	    key: "mergeAdjacentFaces",
	    value: function mergeAdjacentFaces(adjacentEdge, discardedFaces) {
	      var oppositeEdge = adjacentEdge.opposite;
	      var oppositeFace = oppositeEdge.face;
	      discardedFaces.push(oppositeFace);
	      oppositeFace.mark = DELETED; // find the chain of edges whose opposite face is `oppositeFace`
	      //
	      //                ===>
	      //      \         face         /
	      //       * ---- * ---- * ---- *
	      //      /     opposite face    \
	      //                <===
	      //

	      var adjacentEdgePrev = adjacentEdge.prev;
	      var adjacentEdgeNext = adjacentEdge.next;
	      var oppositeEdgePrev = oppositeEdge.prev;
	      var oppositeEdgeNext = oppositeEdge.next; // left edge

	      while (adjacentEdgePrev.opposite.face === oppositeFace) {
	        adjacentEdgePrev = adjacentEdgePrev.prev;
	        oppositeEdgeNext = oppositeEdgeNext.next;
	      } // right edge


	      while (adjacentEdgeNext.opposite.face === oppositeFace) {
	        adjacentEdgeNext = adjacentEdgeNext.next;
	        oppositeEdgePrev = oppositeEdgePrev.prev;
	      } // adjacentEdgePrev  \         face         / adjacentEdgeNext
	      //                    * ---- * ---- * ---- *
	      // oppositeEdgeNext  /     opposite face    \ oppositeEdgePrev
	      // fix the face reference of all the opposite edges that are not part of
	      // the edges whose opposite face is not `face` i.e. all the edges that
	      // `face` and `oppositeFace` do not have in common


	      var edge;

	      for (edge = oppositeEdgeNext; edge !== oppositeEdgePrev.next; edge = edge.next) {
	        edge.face = this;
	      } // make sure that `face.edge` is not one of the edges to be destroyed
	      // Note: it's important for it to be a `next` edge since `prev` edges
	      // might be destroyed on `connectHalfEdges`


	      this.edge = adjacentEdgeNext; // connect the extremes
	      // Note: it might be possible that after connecting the edges a triangular
	      // face might be redundant

	      var discardedFace;
	      discardedFace = this.connectHalfEdges(oppositeEdgePrev, adjacentEdgeNext);

	      if (discardedFace) {
	        discardedFaces.push(discardedFace);
	      }

	      discardedFace = this.connectHalfEdges(adjacentEdgePrev, oppositeEdgeNext);

	      if (discardedFace) {
	        discardedFaces.push(discardedFace);
	      }

	      this.computeNormalAndCentroid(); // TODO: additional consistency checks

	      return discardedFaces;
	    }
	  }, {
	    key: "collectIndices",
	    value: function collectIndices() {
	      var indices = [];
	      var edge = this.edge;

	      do {
	        indices.push(edge.head().index);
	        edge = edge.next;
	      } while (edge !== this.edge);

	      return indices;
	    }
	  }], [{
	    key: "createTriangle",
	    value: function createTriangle(v0, v1, v2) {
	      var minArea = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
	      var face = new Face();
	      var e0 = new _HalfEdge["default"](v0, face);
	      var e1 = new _HalfEdge["default"](v1, face);
	      var e2 = new _HalfEdge["default"](v2, face); // join edges

	      e0.next = e2.prev = e1;
	      e1.next = e0.prev = e2;
	      e2.next = e1.prev = e0; // main half edge reference

	      face.edge = e0;
	      face.computeNormalAndCentroid(minArea);

	      if (debug.enabled) {
	        debug('face created %j', face.collectIndices());
	      }

	      return face;
	    }
	  }]);

	  return Face;
	}();

	exports["default"] = Face; 
} (Face));

(function (exports) {

	function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports["default"] = void 0;

	var _pointLineDistance = _interopRequireDefault(pointLineDistance);

	var _getPlaneNormal = _interopRequireDefault(getPlaneNormal);

	var _dot = _interopRequireDefault(dot_1);

	var _VertexList = _interopRequireDefault(VertexList);

	var _Vertex = _interopRequireDefault(Vertex);

	var _Face = _interopRequireWildcard(Face);

	function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

	function _interopRequireWildcard(obj, nodeInterop) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

	function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

	function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

	function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

	function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

	function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

	function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

	var debug = srcExports('quickhull'); // merge types
	// non convex with respect to the large face


	var MERGE_NON_CONVEX_WRT_LARGER_FACE = 1;
	var MERGE_NON_CONVEX = 2;

	var QuickHull = /*#__PURE__*/function () {
	  function QuickHull(points) {
	    _classCallCheck(this, QuickHull);

	    if (!Array.isArray(points)) {
	      throw TypeError('input is not a valid array');
	    }

	    if (points.length < 4) {
	      throw Error('cannot build a simplex out of <4 points');
	    }

	    this.tolerance = -1; // buffers

	    this.nFaces = 0;
	    this.nPoints = points.length;
	    this.faces = [];
	    this.newFaces = []; // helpers
	    //
	    // let `a`, `b` be `Face` instances
	    // let `v` be points wrapped as instance of `Vertex`
	    //
	    //     [v, v, ..., v, v, v, ...]
	    //      ^             ^
	    //      |             |
	    //  a.outside     b.outside
	    //

	    this.claimed = new _VertexList["default"]();
	    this.unclaimed = new _VertexList["default"](); // vertices of the hull(internal representation of points)

	    this.vertices = [];

	    for (var i = 0; i < points.length; i += 1) {
	      this.vertices.push(new _Vertex["default"](points[i], i));
	    }

	    this.discardedFaces = [];
	    this.vertexPointIndices = [];
	  }

	  _createClass(QuickHull, [{
	    key: "addVertexToFace",
	    value: function addVertexToFace(vertex, face) {
	      vertex.face = face;

	      if (!face.outside) {
	        this.claimed.add(vertex);
	      } else {
	        this.claimed.insertBefore(face.outside, vertex);
	      }

	      face.outside = vertex;
	    }
	    /**
	     * Removes `vertex` for the `claimed` list of vertices, it also makes sure
	     * that the link from `face` to the first vertex it sees in `claimed` is
	     * linked correctly after the removal
	     *
	     * @param {Vertex} vertex
	     * @param {Face} face
	     */

	  }, {
	    key: "removeVertexFromFace",
	    value: function removeVertexFromFace(vertex, face) {
	      if (vertex === face.outside) {
	        // fix face.outside link
	        if (vertex.next && vertex.next.face === face) {
	          // face has at least 2 outside vertices, move the `outside` reference
	          face.outside = vertex.next;
	        } else {
	          // vertex was the only outside vertex that face had
	          face.outside = null;
	        }
	      }

	      this.claimed.remove(vertex);
	    }
	    /**
	     * Removes all the visible vertices that `face` is able to see which are
	     * stored in the `claimed` vertext list
	     *
	     * @param {Face} face
	     * @return {Vertex|undefined} If face had visible vertices returns
	     * `face.outside`, otherwise undefined
	     */

	  }, {
	    key: "removeAllVerticesFromFace",
	    value: function removeAllVerticesFromFace(face) {
	      if (face.outside) {
	        // pointer to the last vertex of this face
	        // [..., outside, ..., end, outside, ...]
	        //          |           |      |
	        //          a           a      b
	        var end = face.outside;

	        while (end.next && end.next.face === face) {
	          end = end.next;
	        }

	        this.claimed.removeChain(face.outside, end); //                            b
	        //                       [ outside, ...]
	        //                            |  removes this link
	        //     [ outside, ..., end ] -┘
	        //          |           |
	        //          a           a

	        end.next = null;
	        return face.outside;
	      }
	    }
	    /**
	     * Removes all the visible vertices that `face` is able to see, additionally
	     * checking the following:
	     *
	     * If `absorbingFace` doesn't exist then all the removed vertices will be
	     * added to the `unclaimed` vertex list
	     *
	     * If `absorbingFace` exists then this method will assign all the vertices of
	     * `face` that can see `absorbingFace`, if a vertex cannot see `absorbingFace`
	     * it's added to the `unclaimed` vertex list
	     *
	     * @param {Face} face
	     * @param {Face} [absorbingFace]
	     */

	  }, {
	    key: "deleteFaceVertices",
	    value: function deleteFaceVertices(face, absorbingFace) {
	      var faceVertices = this.removeAllVerticesFromFace(face);

	      if (faceVertices) {
	        if (!absorbingFace) {
	          // mark the vertices to be reassigned to some other face
	          this.unclaimed.addAll(faceVertices);
	        } else {
	          // if there's an absorbing face try to assign as many vertices
	          // as possible to it
	          // the reference `vertex.next` might be destroyed on
	          // `this.addVertexToFace` (see VertexList#add), nextVertex is a
	          // reference to it
	          var nextVertex;

	          for (var vertex = faceVertices; vertex; vertex = nextVertex) {
	            nextVertex = vertex.next;
	            var distance = absorbingFace.distanceToPlane(vertex.point); // check if `vertex` is able to see `absorbingFace`

	            if (distance > this.tolerance) {
	              this.addVertexToFace(vertex, absorbingFace);
	            } else {
	              this.unclaimed.add(vertex);
	            }
	          }
	        }
	      }
	    }
	    /**
	     * Reassigns as many vertices as possible from the unclaimed list to the new
	     * faces
	     *
	     * @param {Faces[]} newFaces
	     */

	  }, {
	    key: "resolveUnclaimedPoints",
	    value: function resolveUnclaimedPoints(newFaces) {
	      // cache next vertex so that if `vertex.next` is destroyed it's still
	      // recoverable
	      var vertexNext = this.unclaimed.first();

	      for (var vertex = vertexNext; vertex; vertex = vertexNext) {
	        vertexNext = vertex.next;
	        var maxDistance = this.tolerance;
	        var maxFace = void 0;

	        for (var i = 0; i < newFaces.length; i += 1) {
	          var face = newFaces[i];

	          if (face.mark === _Face.VISIBLE) {
	            var dist = face.distanceToPlane(vertex.point);

	            if (dist > maxDistance) {
	              maxDistance = dist;
	              maxFace = face;
	            }

	            if (maxDistance > 1000 * this.tolerance) {
	              break;
	            }
	          }
	        }

	        if (maxFace) {
	          this.addVertexToFace(vertex, maxFace);
	        }
	      }
	    }
	    /**
	     * Computes the extremes of a tetrahedron which will be the initial hull
	     *
	     * @return {number[]} The min/max vertices in the x,y,z directions
	     */

	  }, {
	    key: "computeExtremes",
	    value: function computeExtremes() {
	      var me = this;
	      var min = [];
	      var max = []; // min vertex on the x,y,z directions

	      var minVertices = []; // max vertex on the x,y,z directions

	      var maxVertices = [];
	      var i, j; // initially assume that the first vertex is the min/max

	      for (i = 0; i < 3; i += 1) {
	        minVertices[i] = maxVertices[i] = this.vertices[0];
	      } // copy the coordinates of the first vertex to min/max


	      for (i = 0; i < 3; i += 1) {
	        min[i] = max[i] = this.vertices[0].point[i];
	      } // compute the min/max vertex on all 6 directions


	      for (i = 1; i < this.vertices.length; i += 1) {
	        var vertex = this.vertices[i];
	        var point = vertex.point; // update the min coordinates

	        for (j = 0; j < 3; j += 1) {
	          if (point[j] < min[j]) {
	            min[j] = point[j];
	            minVertices[j] = vertex;
	          }
	        } // update the max coordinates


	        for (j = 0; j < 3; j += 1) {
	          if (point[j] > max[j]) {
	            max[j] = point[j];
	            maxVertices[j] = vertex;
	          }
	        }
	      } // compute epsilon


	      this.tolerance = 3 * Number.EPSILON * (Math.max(Math.abs(min[0]), Math.abs(max[0])) + Math.max(Math.abs(min[1]), Math.abs(max[1])) + Math.max(Math.abs(min[2]), Math.abs(max[2])));

	      if (debug.enabled) {
	        debug('tolerance %d', me.tolerance);
	      }

	      return [minVertices, maxVertices];
	    }
	    /**
	     * Compues the initial tetrahedron assigning to its faces all the points that
	     * are candidates to form part of the hull
	     */

	  }, {
	    key: "createInitialSimplex",
	    value: function createInitialSimplex() {
	      var vertices = this.vertices;

	      var _this$computeExtremes = this.computeExtremes(),
	          _this$computeExtremes2 = _slicedToArray(_this$computeExtremes, 2),
	          min = _this$computeExtremes2[0],
	          max = _this$computeExtremes2[1];

	      var i, j; // Find the two vertices with the greatest 1d separation
	      // (max.x - min.x)
	      // (max.y - min.y)
	      // (max.z - min.z)

	      var maxDistance = 0;
	      var indexMax = 0;

	      for (i = 0; i < 3; i += 1) {
	        var distance = max[i].point[i] - min[i].point[i];

	        if (distance > maxDistance) {
	          maxDistance = distance;
	          indexMax = i;
	        }
	      }

	      var v0 = min[indexMax];
	      var v1 = max[indexMax];
	      var v2, v3; // the next vertex is the one farthest to the line formed by `v0` and `v1`

	      maxDistance = 0;

	      for (i = 0; i < this.vertices.length; i += 1) {
	        var vertex = this.vertices[i];

	        if (vertex !== v0 && vertex !== v1) {
	          var _distance = (0, _pointLineDistance["default"])(vertex.point, v0.point, v1.point);

	          if (_distance > maxDistance) {
	            maxDistance = _distance;
	            v2 = vertex;
	          }
	        }
	      } // the next vertes is the one farthest to the plane `v0`, `v1`, `v2`
	      // normalize((v2 - v1) x (v0 - v1))


	      var normal = (0, _getPlaneNormal["default"])([], v0.point, v1.point, v2.point); // distance from the origin to the plane

	      var distPO = (0, _dot["default"])(v0.point, normal);
	      maxDistance = -1;

	      for (i = 0; i < this.vertices.length; i += 1) {
	        var _vertex = this.vertices[i];

	        if (_vertex !== v0 && _vertex !== v1 && _vertex !== v2) {
	          var _distance2 = Math.abs((0, _dot["default"])(normal, _vertex.point) - distPO);

	          if (_distance2 > maxDistance) {
	            maxDistance = _distance2;
	            v3 = _vertex;
	          }
	        }
	      } // initial simplex
	      // Taken from http://everything2.com/title/How+to+paint+a+tetrahedron
	      //
	      //                              v2
	      //                             ,|,
	      //                           ,7``\'VA,
	      //                         ,7`   |, `'VA,
	      //                       ,7`     `\    `'VA,
	      //                     ,7`        |,      `'VA,
	      //                   ,7`          `\         `'VA,
	      //                 ,7`             |,           `'VA,
	      //               ,7`               `\       ,..ooOOTK` v3
	      //             ,7`                  |,.ooOOT''`    AV
	      //           ,7`            ,..ooOOT`\`           /7
	      //         ,7`      ,..ooOOT''`      |,          AV
	      //        ,T,..ooOOT''`              `\         /7
	      //     v0 `'TTs.,                     |,       AV
	      //            `'TTs.,                 `\      /7
	      //                 `'TTs.,             |,    AV
	      //                      `'TTs.,        `\   /7
	      //                           `'TTs.,    |, AV
	      //                                `'TTs.,\/7
	      //                                     `'T`
	      //                                       v1
	      //


	      var faces = [];

	      if ((0, _dot["default"])(v3.point, normal) - distPO < 0) {
	        // the face is not able to see the point so `planeNormal`
	        // is pointing outside the tetrahedron
	        faces.push(_Face["default"].createTriangle(v0, v1, v2), _Face["default"].createTriangle(v3, v1, v0), _Face["default"].createTriangle(v3, v2, v1), _Face["default"].createTriangle(v3, v0, v2)); // set the opposite edge

	        for (i = 0; i < 3; i += 1) {
	          var _j = (i + 1) % 3; // join face[i] i > 0, with the first face


	          faces[i + 1].getEdge(2).setOpposite(faces[0].getEdge(_j)); // join face[i] with face[i + 1], 1 <= i <= 3

	          faces[i + 1].getEdge(1).setOpposite(faces[_j + 1].getEdge(0));
	        }
	      } else {
	        // the face is able to see the point so `planeNormal`
	        // is pointing inside the tetrahedron
	        faces.push(_Face["default"].createTriangle(v0, v2, v1), _Face["default"].createTriangle(v3, v0, v1), _Face["default"].createTriangle(v3, v1, v2), _Face["default"].createTriangle(v3, v2, v0)); // set the opposite edge

	        for (i = 0; i < 3; i += 1) {
	          var _j2 = (i + 1) % 3; // join face[i] i > 0, with the first face


	          faces[i + 1].getEdge(2).setOpposite(faces[0].getEdge((3 - i) % 3)); // join face[i] with face[i + 1]

	          faces[i + 1].getEdge(0).setOpposite(faces[_j2 + 1].getEdge(1));
	        }
	      } // the initial hull is the tetrahedron


	      for (i = 0; i < 4; i += 1) {
	        this.faces.push(faces[i]);
	      } // initial assignment of vertices to the faces of the tetrahedron


	      for (i = 0; i < vertices.length; i += 1) {
	        var _vertex2 = vertices[i];

	        if (_vertex2 !== v0 && _vertex2 !== v1 && _vertex2 !== v2 && _vertex2 !== v3) {
	          maxDistance = this.tolerance;
	          var maxFace = void 0;

	          for (j = 0; j < 4; j += 1) {
	            var _distance3 = faces[j].distanceToPlane(_vertex2.point);

	            if (_distance3 > maxDistance) {
	              maxDistance = _distance3;
	              maxFace = faces[j];
	            }
	          }

	          if (maxFace) {
	            this.addVertexToFace(_vertex2, maxFace);
	          }
	        }
	      }
	    }
	  }, {
	    key: "reindexFaceAndVertices",
	    value: function reindexFaceAndVertices() {
	      // remove inactive faces
	      var activeFaces = [];

	      for (var i = 0; i < this.faces.length; i += 1) {
	        var face = this.faces[i];

	        if (face.mark === _Face.VISIBLE) {
	          activeFaces.push(face);
	        }
	      }

	      this.faces = activeFaces;
	    }
	  }, {
	    key: "collectFaces",
	    value: function collectFaces(skipTriangulation) {
	      var faceIndices = [];

	      for (var i = 0; i < this.faces.length; i += 1) {
	        if (this.faces[i].mark !== _Face.VISIBLE) {
	          throw Error('attempt to include a destroyed face in the hull');
	        }

	        var indices = this.faces[i].collectIndices();

	        if (skipTriangulation) {
	          faceIndices.push(indices);
	        } else {
	          for (var j = 0; j < indices.length - 2; j += 1) {
	            faceIndices.push([indices[0], indices[j + 1], indices[j + 2]]);
	          }
	        }
	      }

	      return faceIndices;
	    }
	    /**
	     * Finds the next vertex to make faces with the current hull
	     *
	     * - let `face` be the first face existing in the `claimed` vertex list
	     *  - if `face` doesn't exist then return since there're no vertices left
	     *  - otherwise for each `vertex` that face sees find the one furthest away
	     *  from `face`
	     *
	     * @return {Vertex|undefined} Returns undefined when there're no more
	     * visible vertices
	     */

	  }, {
	    key: "nextVertexToAdd",
	    value: function nextVertexToAdd() {
	      if (!this.claimed.isEmpty()) {
	        var eyeVertex, vertex;
	        var maxDistance = 0;
	        var eyeFace = this.claimed.first().face;

	        for (vertex = eyeFace.outside; vertex && vertex.face === eyeFace; vertex = vertex.next) {
	          var distance = eyeFace.distanceToPlane(vertex.point);

	          if (distance > maxDistance) {
	            maxDistance = distance;
	            eyeVertex = vertex;
	          }
	        }

	        return eyeVertex;
	      }
	    }
	    /**
	     * Computes a chain of half edges in ccw order called the `horizon`, for an
	     * edge to be part of the horizon it must join a face that can see
	     * `eyePoint` and a face that cannot see `eyePoint`
	     *
	     * @param {number[]} eyePoint - The coordinates of a point
	     * @param {HalfEdge} crossEdge - The edge used to jump to the current `face`
	     * @param {Face} face - The current face being tested
	     * @param {HalfEdge[]} horizon - The edges that form part of the horizon in
	     * ccw order
	     */

	  }, {
	    key: "computeHorizon",
	    value: function computeHorizon(eyePoint, crossEdge, face, horizon) {
	      // moves face's vertices to the `unclaimed` vertex list
	      this.deleteFaceVertices(face);
	      face.mark = _Face.DELETED;
	      var edge;

	      if (!crossEdge) {
	        edge = crossEdge = face.getEdge(0);
	      } else {
	        // start from the next edge since `crossEdge` was already analyzed
	        // (actually `crossEdge.opposite` was the face who called this method
	        // recursively)
	        edge = crossEdge.next;
	      } // All the faces that are able to see `eyeVertex` are defined as follows
	      //
	      //       v    /
	      //           / <== visible face
	      //          /
	      //         |
	      //         | <== not visible face
	      //
	      //  dot(v, visible face normal) - visible face offset > this.tolerance
	      //


	      do {
	        var oppositeEdge = edge.opposite;
	        var oppositeFace = oppositeEdge.face;

	        if (oppositeFace.mark === _Face.VISIBLE) {
	          if (oppositeFace.distanceToPlane(eyePoint) > this.tolerance) {
	            this.computeHorizon(eyePoint, oppositeEdge, oppositeFace, horizon);
	          } else {
	            horizon.push(edge);
	          }
	        }

	        edge = edge.next;
	      } while (edge !== crossEdge);
	    }
	    /**
	     * Creates a face with the points `eyeVertex.point`, `horizonEdge.tail` and
	     * `horizonEdge.tail` in ccw order
	     *
	     * @param {Vertex} eyeVertex
	     * @param {HalfEdge} horizonEdge
	     * @return {HalfEdge} The half edge whose vertex is the eyeVertex
	     */

	  }, {
	    key: "addAdjoiningFace",
	    value: function addAdjoiningFace(eyeVertex, horizonEdge) {
	      // all the half edges are created in ccw order thus the face is always
	      // pointing outside the hull
	      // edges:
	      //
	      //                  eyeVertex.point
	      //                       / \
	      //                      /   \
	      //                  1  /     \  0
	      //                    /       \
	      //                   /         \
	      //                  /           \
	      //          horizon.tail --- horizon.head
	      //                        2
	      //
	      var face = _Face["default"].createTriangle(eyeVertex, horizonEdge.tail(), horizonEdge.head());

	      this.faces.push(face); // join face.getEdge(-1) with the horizon's opposite edge
	      // face.getEdge(-1) = face.getEdge(2)

	      face.getEdge(-1).setOpposite(horizonEdge.opposite);
	      return face.getEdge(0);
	    }
	    /**
	     * Adds horizon.length faces to the hull, each face will be 'linked' with the
	     * horizon opposite face and the face on the left/right
	     *
	     * @param {Vertex} eyeVertex
	     * @param {HalfEdge[]} horizon - A chain of half edges in ccw order
	     */

	  }, {
	    key: "addNewFaces",
	    value: function addNewFaces(eyeVertex, horizon) {
	      this.newFaces = [];
	      var firstSideEdge, previousSideEdge;

	      for (var i = 0; i < horizon.length; i += 1) {
	        var horizonEdge = horizon[i]; // returns the right side edge

	        var sideEdge = this.addAdjoiningFace(eyeVertex, horizonEdge);

	        if (!firstSideEdge) {
	          firstSideEdge = sideEdge;
	        } else {
	          // joins face.getEdge(1) with previousFace.getEdge(0)
	          sideEdge.next.setOpposite(previousSideEdge);
	        }

	        this.newFaces.push(sideEdge.face);
	        previousSideEdge = sideEdge;
	      }

	      firstSideEdge.next.setOpposite(previousSideEdge);
	    }
	    /**
	     * Computes the distance from `edge` opposite face's centroid to
	     * `edge.face`
	     *
	     * @param {HalfEdge} edge
	     * @return {number}
	     * - A positive number when the centroid of the opposite face is above the
	     *   face i.e. when the faces are concave
	     * - A negative number when the centroid of the opposite face is below the
	     *   face i.e. when the faces are convex
	     */

	  }, {
	    key: "oppositeFaceDistance",
	    value: function oppositeFaceDistance(edge) {
	      return edge.face.distanceToPlane(edge.opposite.face.centroid);
	    }
	    /**
	     * Merges a face with none/any/all its neighbors according to the strategy
	     * used
	     *
	     * if `mergeType` is MERGE_NON_CONVEX_WRT_LARGER_FACE then the merge will be
	     * decided based on the face with the larger area, the centroid of the face
	     * with the smaller area will be checked against the one with the larger area
	     * to see if it's in the merge range [tolerance, -tolerance] i.e.
	     *
	     *    dot(centroid smaller face, larger face normal) - larger face offset > -tolerance
	     *
	     * Note that the first check (with +tolerance) was done on `computeHorizon`
	     *
	     * If the above is not true then the check is done with respect to the smaller
	     * face i.e.
	     *
	     *    dot(centroid larger face, smaller face normal) - smaller face offset > -tolerance
	     *
	     * If true then it means that two faces are non convex (concave), even if the
	     * dot(...) - offset value is > 0 (that's the point of doing the merge in the
	     * first place)
	     *
	     * If two faces are concave then the check must also be done on the other face
	     * but this is done in another merge pass, for this to happen the face is
	     * marked in a temporal NON_CONVEX state
	     *
	     * if `mergeType` is MERGE_NON_CONVEX then two faces will be merged only if
	     * they pass the following conditions
	     *
	     *    dot(centroid smaller face, larger face normal) - larger face offset > -tolerance
	     *    dot(centroid larger face, smaller face normal) - smaller face offset > -tolerance
	     *
	     * @param {Face} face
	     * @param {number} mergeType - Either MERGE_NON_CONVEX_WRT_LARGER_FACE or
	     * MERGE_NON_CONVEX
	     */

	  }, {
	    key: "doAdjacentMerge",
	    value: function doAdjacentMerge(face, mergeType) {
	      var edge = face.edge;
	      var convex = true;
	      var it = 0;

	      do {
	        if (it >= face.nVertices) {
	          throw Error('merge recursion limit exceeded');
	        }

	        var oppositeFace = edge.opposite.face;
	        var merge = false; // Important notes about the algorithm to merge faces
	        //
	        // - Given a vertex `eyeVertex` that will be added to the hull
	        //   all the faces that cannot see `eyeVertex` are defined as follows
	        //
	        //      dot(v, not visible face normal) - not visible offset < tolerance
	        //
	        // - Two faces can be merged when the centroid of one of these faces
	        // projected to the normal of the other face minus the other face offset
	        // is in the range [tolerance, -tolerance]
	        // - Since `face` (given in the input for this method) has passed the
	        // check above we only have to check the lower bound e.g.
	        //
	        //      dot(v, not visible face normal) - not visible offset > -tolerance
	        //

	        if (mergeType === MERGE_NON_CONVEX) {
	          if (this.oppositeFaceDistance(edge) > -this.tolerance || this.oppositeFaceDistance(edge.opposite) > -this.tolerance) {
	            merge = true;
	          }
	        } else {
	          if (face.area > oppositeFace.area) {
	            if (this.oppositeFaceDistance(edge) > -this.tolerance) {
	              merge = true;
	            } else if (this.oppositeFaceDistance(edge.opposite) > -this.tolerance) {
	              convex = false;
	            }
	          } else {
	            if (this.oppositeFaceDistance(edge.opposite) > -this.tolerance) {
	              merge = true;
	            } else if (this.oppositeFaceDistance(edge) > -this.tolerance) {
	              convex = false;
	            }
	          }
	        }

	        if (merge) {
	          debug('face merge'); // when two faces are merged it might be possible that redundant faces
	          // are destroyed, in that case move all the visible vertices from the
	          // destroyed faces to the `unclaimed` vertex list

	          var discardedFaces = face.mergeAdjacentFaces(edge, []);

	          for (var i = 0; i < discardedFaces.length; i += 1) {
	            this.deleteFaceVertices(discardedFaces[i], face);
	          }

	          return true;
	        }

	        edge = edge.next;
	        it += 1;
	      } while (edge !== face.edge);

	      if (!convex) {
	        face.mark = _Face.NON_CONVEX;
	      }

	      return false;
	    }
	    /**
	     * Adds a vertex to the hull with the following algorithm
	     *
	     * - Compute the `horizon` which is a chain of half edges, for an edge to
	     *   belong to this group it must be the edge connecting a face that can
	     *   see `eyeVertex` and a face which cannot see `eyeVertex`
	     * - All the faces that can see `eyeVertex` have its visible vertices removed
	     *   from the claimed VertexList
	     * - A new set of faces is created with each edge of the `horizon` and
	     *   `eyeVertex`, each face is connected with the opposite horizon face and
	     *   the face on the left/right
	     * - The new faces are merged if possible with the opposite horizon face first
	     *   and then the faces on the right/left
	     * - The vertices removed from all the visible faces are assigned to the new
	     *   faces if possible
	     *
	     * @param {Vertex} eyeVertex
	     */

	  }, {
	    key: "addVertexToHull",
	    value: function addVertexToHull(eyeVertex) {
	      var horizon = [];
	      this.unclaimed.clear(); // remove `eyeVertex` from `eyeVertex.face` so that it can't be added to the
	      // `unclaimed` vertex list

	      this.removeVertexFromFace(eyeVertex, eyeVertex.face);
	      this.computeHorizon(eyeVertex.point, null, eyeVertex.face, horizon);

	      if (debug.enabled) {
	        debug('horizon %j', horizon.map(function (edge) {
	          return edge.head().index;
	        }));
	      }

	      this.addNewFaces(eyeVertex, horizon);
	      debug('first merge'); // first merge pass
	      // Do the merge with respect to the larger face

	      for (var i = 0; i < this.newFaces.length; i += 1) {
	        var face = this.newFaces[i];

	        if (face.mark === _Face.VISIBLE) {
	          // eslint-disable-next-line
	          while (this.doAdjacentMerge(face, MERGE_NON_CONVEX_WRT_LARGER_FACE)) {}
	        }
	      }

	      debug('second merge'); // second merge pass
	      // Do the merge on non convex faces (a face is marked as non convex in the
	      // first pass)

	      for (var _i2 = 0; _i2 < this.newFaces.length; _i2 += 1) {
	        var _face = this.newFaces[_i2];

	        if (_face.mark === _Face.NON_CONVEX) {
	          _face.mark = _Face.VISIBLE; // eslint-disable-next-line

	          while (this.doAdjacentMerge(_face, MERGE_NON_CONVEX)) {}
	        }
	      }

	      debug('reassigning points to newFaces'); // reassign `unclaimed` vertices to the new faces

	      this.resolveUnclaimedPoints(this.newFaces);
	    }
	  }, {
	    key: "build",
	    value: function build() {
	      var iterations = 0;
	      var eyeVertex;
	      this.createInitialSimplex();

	      while (eyeVertex = this.nextVertexToAdd()) {
	        iterations += 1;
	        debug('== iteration %j ==', iterations);
	        debug('next vertex to add = %d %j', eyeVertex.index, eyeVertex.point);
	        this.addVertexToHull(eyeVertex);
	        debug('end');
	      }

	      this.reindexFaceAndVertices();
	    }
	  }]);

	  return QuickHull;
	}();

	exports["default"] = QuickHull; 
} (QuickHull));

(function (exports) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports["default"] = runner;
	exports.isPointInsideHull = isPointInsideHull;

	var _QuickHull = _interopRequireDefault(QuickHull);

	var _getPlaneNormal = _interopRequireDefault(getPlaneNormal);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function runner(points) {
	  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	  var instance = new _QuickHull["default"](points);
	  instance.build();
	  return instance.collectFaces(options.skipTriangulation);
	}
	/**
	 * Checks if a point is inside the convex hull.
	 *
	 * @param {Array<number>} point - The point to check.
	 * @param {Array<Array<number>>} points - The points used in the space where the
	 * convex hull is defined.
	 * @param {Array<Array<number>>} faces - The faces of the convex hull.
	 */


	function isPointInsideHull(point, points, faces) {
	  for (var i = 0; i < faces.length; i++) {
	    var face = faces[i];
	    var a = points[face[0]];
	    var b = points[face[1]];
	    var c = points[face[2]]; // Algorithm:
	    // 1. Get the normal of the face.
	    // 2. Get the vector from the point to the first vertex of the face.
	    // 3. Calculate the dot product of the normal and the vector.
	    // 4. If the dot product is positive, the point is outside the face.

	    var planeNormal = (0, _getPlaneNormal["default"])([], a, b, c); // Get the point

	    var pointAbsA = [point[0] - a[0], point[1] - a[1], point[2] - a[2]];
	    var dotProduct = planeNormal[0] * pointAbsA[0] + planeNormal[1] * pointAbsA[1] + planeNormal[2] * pointAbsA[2];

	    if (dotProduct > 0) {
	      return false;
	    }
	  }

	  return true;
	} 
} (dist));

var qh_def = /*@__PURE__*/getDefaultExportFromCjs(dist);

const qh = qh_def['default'];

const polyhedron = (points) => {
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
    });
    
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
};

class C3Polyhedron extends C3Group {
  #shape;

  static get observedAttributes() {
    return [
      ...C3Object.observedAttributes,
      'background'
    ];
  }

  constructor() {
    console.log('C3Polyhedron constructor...');
    super();

    this.handleSlotChange = this.handleSlotChange.bind(this);

    this.#shape = document.createElement('div');
    this.#shape.style.transformStyle = 'preserve-3d';
    
    this.shadowRoot.appendChild(this.#shape);
  }

  get vertices() {
    return [...this.querySelectorAll('c3-vertex')]
  }

  render() {
    console.log('render polyhedron...');
    super.render();

    console.log('this', this);

    const points = [...this.querySelectorAll('c3-vertex')]
      .map(vertex => [...C3Object.getPosition(vertex)]);

    console.log('points', points);


    this.#shape.innerHTML = polyhedron(points);
  }
}

CSSStyleMixin(C3Polyhedron, [
  'background'
], true);

customElements.define('c3-polyhedron', C3Polyhedron);

class C3Vertex extends C3Object {
  static get observedAttributes() {
    return [
      ...C3Object.observedAttributes,
    ];
  }
}

customElements.define('c3-vertex', C3Vertex);

const FACETS$1 = 16;

const cylinder = `
  <style scoped>
    :host {
      --radius: 100px;
      --topRadius: 100px;
      --bottomRadius: 100px;
      --height: 200px;
      --facets: ${FACETS$1};
      --background: rgba(0, 255, 255, 0.1);
    }

    /*
    :host::before,
    :host::after {
      --r: calc(max(var(--topRadius), var(--bottomRadius)));
      content: '';
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      width: calc(var(--r) * 2);
      height: var(--height);
      transform: translateX(-50%) translateY(-50%) translateZ(calc(var(--r)));
      outline: 2px solid green;
    }

    :host::after {
      transform: translateX(-50%) translateY(-50%) translateZ(calc(-1 * var(--r)));
    }
    */

    .shape {
      --_topRadius: var(--topRadius, var(--radius));
      --_bottomRadius: var(--bottomRadius, var(--radius));
    }

    .shape {
      transform: translate3d(-50%, -50%, calc(var(--radiusTop) / 2));
      transform-style: preserve-3d;
    }

    .top, .bottom, .body {
      transform-style: preserve-3d;
    }

    

    .facet {
      --r: calc((var(--_bottomRadius) + var(--_topRadius)) / 2);
      --angle: calc(var(--facet) * 360deg / var(--facets));
      --x: calc(var(--r) * cos(var(--angle)) - 50%);
      --y: -50%;
      --z: calc(var(--r) * sin(var(--angle)));
      --w2: calc(var(--_topRadius) * 2 * tan(180deg / var(--facets)));
      --w1: calc(var(--_bottomRadius) * 2 * tan(180deg / var(--facets)));

      --w: max(var(--w1), var(--w2));
      --ax: calc(atan2(var(--_bottomRadius) - var(--_topRadius), var(--height)));
      --lx: calc(min(var(--w1), var(--w2)) / 2);
      --h: calc(var(--height) + var(--lx) * sin(ax));
      --s: calc(var(--height) / cos(var(--ax) * -1));
      --a: calc(atan2(var(--s), var(--w2) / 2 - var(--w1) / 2) - 45deg);

      transform-style: preserve-3d;
    }

    .body .facet {
      position: absolute;
      top: 0;
      left: 0;
      width: var(--w);
      height: var(--s);
      transform-origin: 50% 50%;
      transform: translate3d(var(--x), var(--y), var(--z)) rotateY(calc(-1 * var(--angle) + 90deg)) rotateX(calc(var(--ax) * -1));
      
      background: var(--background);
      background-position-x: calc(100% * var(--facet));
      /* background-size: calc(100% * var(--facets)) 100%; */

      --mc: orange;
      --mt: rgba(0, 255, 0, 0.5);
      --mt: transparent; 
     
      mask-image:
        conic-gradient(
          from 135deg at calc( 50% - var(--w1) / 2) 0,
          var(--mt) 45deg,
          var(--mc) 0,
          var(--mc) calc(90deg - var(--a)),
          var(--mt) calc(90deg - var(--a))
        ),

        conic-gradient(
          from 135deg at calc( 50% + var(--w1) / 2) 0,
            var(--mt) calc(var(--a)),
            var(--mc) calc(45deg - var(--a)),
            var(--mc) calc(45deg),
            var(--mt) calc(45deg)
        ),

        conic-gradient(
          from -45deg at calc( 50% - var(--w2) / 2) 100%,
            var(--mt) calc(90deg - var(--a)),
            var(--mc) calc(90deg - var(--a)),
            var(--mc) 45deg,
            var(--mt) 45deg
        ),
        
        conic-gradient(
          from -45deg at calc( 50% + var(--w2) / 2) 100%,
            var(--mt) 45deg,
            var(--mc) 45deg,
            var(--mc) calc(var(--a)),
            var(--mt) calc(var(--a))
        ),
        
        linear-gradient(90deg,
          var(--mt) calc(50% - var(--lx)),
          var(--mc) calc(50% - var(--lx)),
          var(--mc) calc(50% + var(--lx) + 0.5px),
          var(--mt) calc(50% + var(--lx) + 0.5px)
        );
    }

    .top .facet {
      --sx: var(--w2);
      --w: calc(var(--topRadius, var(--radius)) * 2);
      --h: calc(var(--topRadius, var(--radius)) * 2);
    }

    .bottom .facet {
      --sx: var(--w1);
      --w: calc(var(--bottomRadius, var(--radius)) * 2);
      --h: calc(var(--bottomRadius, var(--radius)) * 2);
    }

    .bottom {
      position: absolute;
      top: calc( -1 * var(--height));
    }

    .top .facet,
    .bottom .facet {
      --mc: orange;
      --mt: transparent;
      --r: calc((var(--_bottomRadius) + var(--_topRadius)) / 2);
      --a: calc(atan2(var(--h), var(--sx)));
      --b: calc(atan2(var(--h), var(--sx) * -1));
      --fy: calc(var(--facet) * 0px); 
    }

    .bottom .facet {
      /*transform: translate(-50%, calc(var(--height) / -2 - 50% + var(--fy) )) rotateX(90deg) rotateZ(calc(var(--angle)));*/
    }

    .top .facet::before,
    .bottom .facet::before {
      content: '';
      display: block;
      position: absolute;
      top: 50%;
      left: 50%;
      width: calc(var(--_topRadius) * 2);
      height: calc(var(--_topRadius) * 2);
      background: var(--background);
     
      transform: translate(-50%, -50%) rotateZ(calc(-1 * var(--angle)));
      transform-origin: 50% 50%;
    }

    .bottom .facet::before {
      width: calc(var(--_bottomRadius) * 2);
      height: calc(var(--_bottomRadius) * 2);
      transform: translate(-50%, -50%) rotateZ(calc(-1 * var(--angle))) scaleX(-1);
    }

    .top .facet,
    .bottom .facet {
      background-size: auto 100%;
    }

    .top .facet,
    .bottom .facet {
      position: absolute;
      width: var(--w);
      height: var(--h);
      transform-origin: 50% 50%;
      transform: translate(-50%, calc(var(--height) / 2 - 50% + var(--fy) )) rotateX(90deg) rotateZ(calc(var(--angle)));
      mask-image: conic-gradient(from calc(0deg ) at 50% 50%, var(--mt) var(--a), var(--mc) var(--a), var(--mc) calc(var(--b)), var(--mt) calc(var(--b)));

      outline: 3px solid blue;
    }

    
  </style>
  <div class="shape cylinder">
    <div class="top">
      ${Array.from({length: FACETS$1}, (_, i) => `<div class="facet" style="--facet: ${i}"></div>`).join('\n')}
    </div>
    <div class="body">
      ${Array.from({length: FACETS$1}, (_, i) => `<div class="facet" style="--facet: ${i}"></div>`).join('\n')}
    </div>
    <div class="bottom">
      ${Array.from({length: FACETS$1}, (_, i) => `<div class="facet" style="--facet: ${i}"></div>`).join('\n')}
    </div>
  </div>
  
`;

class C3Cylinder extends C3Object {
  static get observedAttributes() {
    return [
      ...C3Object.observedAttributes,
      'background',
      'radius',
      'topRadius', 'top-radius',
      'bottomRadius', 'bottom-radius',
      'height',
      'facets'
    ];
  }

  constructor() {
    super();

    const shape = document.createElement('div');
    shape.style.transformStyle = 'preserve-3d';
    shape.innerHTML = cylinder;
    this.shadowRoot.appendChild(shape);
  }
}

CSSStyleMixin(C3Cylinder, [
  'background',
  'radius',
  'topRadius',
  'bottomRadius',
  'height',
  'facets'
], true);

customElements.define('c3-cylinder', C3Cylinder);

const SLICES = 32;
const FACETS = 16;

const sphere = `
  <style scoped>
    :host {
      --radius: 100px;
      --background: gray;
      display: grid;
    }

    .scene {
      width: calc(var(--radius) * 2);
      height: calc(var(--radius) * 2);
      /*transform: translateX(-50%) translateY(-50%) translateZ(calc(var(--radius) * -1));*/
      transform: translate(-50%, -50%);
    }

    :host * {
      transform-style: preserve-3d;
      backface-visibility: hidden;
    }

    .scene,
    .scene *,
    .scene *::before,
    .scene *::after {
      position: absolute;
    }

    .sphere, .slice {
      inset: 0;
    }

    .sphere {
      /* display: grid; */
      transform: scaleX(-1);
    }

    .slice {
      --ngon: 32;
      --angle: calc(360deg/var(--ngon));
      transform: rotateY(calc(var(--angle) * var(--sliceStep))) scaleX(calc(cos(var(--angle) / 2)));
      display: grid;
      place-items: center;
    }

    .facet {
      --facet-width: calc(var(--radius) * 2 * sin(var(--angle) / 2));
      width: var(--facet-width);
      aspect-ratio: 1;
      --ptAngle: calc( atan( (sin(var(--angle)*(var(--ptStep) + 1)) - sin(var(--angle)*var(--ptStep)))/2 ) );
      --peak: calc(-100% * sin(var(--angle)*(var(--facetStep) + 1))/(sin(var(--angle)*(var(--facetStep) + 1)) - sin(var(--angle)*var(--facetStep))) + 100%);
      --clr3: hsl(calc(360deg - 10deg/(var(--ngon)/2)*var(--facetStep)) 100% calc(50% + 38%/(var(--ngon)/2)*var(--facetStep)));  
      --clr4: hsl(calc(360deg - 10deg/(var(--ngon)/2)*(var(--facetStep) + 1)) 100% calc(50% + 38%/(var(--ngon)/2)*(var(--facetStep) + 1)));
      /*background-image: linear-gradient(var(--clr3), var(--clr4)), conic-gradient(from calc(90deg*(1 + var(--dir)) - 1*var(--ptAngle)) at 50% var(--peak), var(--clr1),var(--clr2) calc(2*var(--ptAngle)), transparent 0);*/
      background-blend-mode: difference;
      webkit-mask-image: conic-gradient(from calc(90deg*(1 + var(--dir)) - 1*var(--ptAngle)) at 50% var(--peak), black calc(2*var(--ptAngle)), transparent 0);
      mask-image: conic-gradient(from calc(90deg*(1 + var(--dir)) - 1*var(--ptAngle)) at 50% var(--peak), black calc(2*var(--ptAngle)), transparent 0);
      --pushZ: 52em;
      transform: rotate(calc(90deg + var(--angle)*(.5 + var(--facetStep)))) translateX(calc(var(--pushZ) * cos(var(--angle) / 2))) rotateY(calc(90deg));
      --dir: 1;
      padding-inline: 0;
      background: red;
      background: var(--background);
      background-position: calc(var(--sliceStep) / var(--ngon) * -100%) calc(var(--facetStep) / (var(--ngon) / 2) * 100%);
      background-size: 3200% 1600%;
      backface-visibility: hidden;
    }

    .facet:nth-child(n+9) {
      --dir: -1;
    }

    .slice:nth-child(n-17) .facet:nth-child(n+9),
    .slice:nth-child(n+17) .facet:nth-child(n-9) {
      --clr1: hsl(calc(60deg + 120deg/var(--ngon)*(var(--gradStep) + 1)) 100% calc(50% - 23%/var(--ngon)*(var(--gradStep) + 1)));  
      --clr2: hsl(calc(60deg + 120deg/var(--ngon)*var(--gradStep)) 100% calc(50% - 23%/var(--ngon)*var(--gradStep)));
    }

    :where(.facet),
    .slice:nth-child(n+17) .facet:nth-child(n+9) {
      --clr2: hsl(calc(60deg + 120deg/var(--ngon)*(var(--gradStep) + 1)) 100% calc(50% - 23%/var(--ngon)*(var(--gradStep) + 1)));  
      --clr1: hsl(calc(60deg + 120deg/var(--ngon)*var(--gradStep)) 100% calc(50% - 23%/var(--ngon)*var(--gradStep)));
    }


    .scene .facet {
      --pushZ: var(--radius);
    }

    .scene .facet {
      backface-visibility: hidden;
    }

    /* iterations */

    .slice:nth-child(1) {
      --sliceStep: 0;
    }

    .slice:nth-child(2) {
      --sliceStep: 1;
    }

    .slice:nth-child(3) {
      --sliceStep: 2;
    }

    .slice:nth-child(4) {
      --sliceStep: 3;
    }

    .slice:nth-child(5) {
      --sliceStep: 4;
    }

    .slice:nth-child(6) {
      --sliceStep: 5;
    }

    .slice:nth-child(7) {
      --sliceStep: 6;
    }

    .slice:nth-child(8) {
      --sliceStep: 7;
    }

    .slice:nth-child(9) {
      --sliceStep: 8;
    }

    .slice:nth-child(10) {
      --sliceStep: 9;
    }

    .slice:nth-child(11) {
      --sliceStep: 10;
    }

    .slice:nth-child(12) {
      --sliceStep: 11;
    }

    .slice:nth-child(13) {
      --sliceStep: 12;
    }

    .slice:nth-child(14) {
      --sliceStep: 13;
    }

    .slice:nth-child(15) {
      --sliceStep: 14;
    }

    .slice:nth-child(16) {
      --sliceStep: 15;
    }

    .slice:nth-child(17) {
      --sliceStep: 16;
    }

    .slice:nth-child(18) {
      --sliceStep: 17;
    }

    .slice:nth-child(19) {
      --sliceStep: 18;
    }

    .slice:nth-child(20) {
      --sliceStep: 19;
    }

    .slice:nth-child(21) {
      --sliceStep: 20;
    }

    .slice:nth-child(22) {
      --sliceStep: 21;
    }

    .slice:nth-child(23) {
      --sliceStep: 22;
    }

    .slice:nth-child(24) {
      --sliceStep: 23;
    }

    .slice:nth-child(25) {
      --sliceStep: 24;
    }

    .slice:nth-child(26) {
      --sliceStep: 25;
    }

    .slice:nth-child(27) {
      --sliceStep: 26;
    }

    .slice:nth-child(28) {
      --sliceStep: 27;
    }

    .slice:nth-child(29) {
      --sliceStep: 28;
    }

    .slice:nth-child(30) {
      --sliceStep: 29;
    }

    .slice:nth-child(31) {
      --sliceStep: 30;
    }

    .slice:nth-child(32) {
      --sliceStep: 31;
    }


    /* incrementing the facet's step variable */

    .facet:nth-child(1) {
      --facetStep: 0;
    }

    .facet:nth-child(2) {
      --facetStep: 1;
    }

    .facet:nth-child(3) {
      --facetStep: 2;
    }

    .facet:nth-child(4) {
      --facetStep: 3;
    }

    .facet:nth-child(5) {
      --facetStep: 4;
    }

    .facet:nth-child(6) {
      --facetStep: 5;
    }

    .facet:nth-child(7) {
      --facetStep: 6;
    }

    .facet:nth-child(8) {
      --facetStep: 7;
    }

    .facet:nth-child(9) {
      --facetStep: 8;
    }

    .facet:nth-child(10) {
      --facetStep: 9;
    }

    .facet:nth-child(11) {
      --facetStep: 10;
    }

    .facet:nth-child(12) {
      --facetStep: 11;
    }

    .facet:nth-child(13) {
      --facetStep: 12;
    }

    .facet:nth-child(14) {
      --facetStep: 13;
    }

    .facet:nth-child(15) {
      --facetStep: 14;
    }

    .facet:nth-child(16) {
      --facetStep: 15;
    }

    /* this switches the incrementation and goes backwards at the midpoint */

    .facet:nth-child(1), .facet:nth-last-child(1) {
      --ptStep: 0;
    }

    .facet:nth-child(2), .facet:nth-last-child(2) {
      --ptStep: 1;
    }

    .facet:nth-child(3), .facet:nth-last-child(3) {
      --ptStep: 2;
    }

    .facet:nth-child(4), .facet:nth-last-child(4) {
      --ptStep: 3;
    }

    .facet:nth-child(5), .facet:nth-last-child(5) {
      --ptStep: 4;
    }

    .facet:nth-child(6), .facet:nth-last-child(6) {
      --ptStep: 5;
    }

    .facet:nth-child(7), .facet:nth-last-child(7) {
      --ptStep: 6;
    }

    .facet:nth-child(8), .facet:nth-last-child(8) {
      --ptStep: 7;
    }
  </style>
  <div class="scene">
    <div class="sphere">
      ${[...Array(SLICES)].map((_, i) => `
        <div class="slice" style="--sliceStep: ${i}">
          ${[...Array(FACETS)].map((_, j) => `
            <div class="facet" style="--facetStep: ${j}"></div>
          `).join('')}
        </div>
      `).join('')}
    </div>
  </div>
  `;

class C3Sphere extends C3Object {
  #style;
  #radius;
  #background;

  constructor() {
    super();
    
    const shape = document.createElement('div');
    shape.style.transformStyle = 'preserve-3d';
    shape.innerHTML = sphere;
    this.shadowRoot.appendChild(shape);
  }

  static get observedAttributes() {
    return [
      ...C3Object.observedAttributes,
      'background',
      'radius'
    ];
  }
}

CSSStyleMixin(C3Sphere, [
  'background',
  'radius'
], true);

customElements.define('c3-sphere', C3Sphere);

export { C3Box, C3Cylinder, C3Grid, C3Group, C3Polyhedron, C3Scene, C3Sphere, C3Vertex };

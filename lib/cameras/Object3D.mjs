import { Quaternion } from '../math/Quaternion.mjs';
import { Vector3 } from '../math/Vector3.mjs';
import { Matrix4 } from '../math/Matrix4.mjs';
import { Euler } from '../math/Euler.mjs';

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

export { Object3D };
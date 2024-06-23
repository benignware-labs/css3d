import { Matrix4 } from '../math/Matrix4.mjs';
import { Object3D } from './Object3D.mjs';

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

export { Camera };
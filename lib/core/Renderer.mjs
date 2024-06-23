const epsilon = value => Math.abs( value ) < 1e-10 ? 0 : value;

export class CSS3DRenderer {
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

    this.render();
  }

  render () {
    const camera = this.camera;
    const cameraElement = this.cameraElement;
    const viewElement = this.viewElement;
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

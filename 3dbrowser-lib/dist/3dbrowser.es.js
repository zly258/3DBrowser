import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import React, { useState, useRef, useEffect, useMemo, useCallback, Component } from 'react';
import * as THREE from 'three';
import { Controls, Vector3, MOUSE, TOUCH, Quaternion, Spherical, Vector2, Ray, Plane, MathUtils, Loader, FileLoader, Color, Matrix4, BufferAttribute, REVISION, CompressedTexture, Source, NoColorSpace, RGBAFormat, ImageUtils, DoubleSide, PropertyBinding, InterpolateDiscrete, Scene, SRGBColorSpace, NearestFilter, NearestMipmapNearestFilter, NearestMipmapLinearFilter, LinearFilter, LinearMipmapNearestFilter, LinearMipmapLinearFilter, ClampToEdgeWrapping, RepeatWrapping, MirroredRepeatWrapping, InterpolateLinear } from 'three';
import { TilesRenderer } from '3d-tiles-renderer';
import pako from 'pako';
import { ChevronDown, ChevronRight, Trash2, X } from 'lucide-react';

/**
 * Fires when the camera has been transformed by the controls.
 *
 * @event OrbitControls#change
 * @type {Object}
 */
const _changeEvent = { type: 'change' };

/**
 * Fires when an interaction was initiated.
 *
 * @event OrbitControls#start
 * @type {Object}
 */
const _startEvent = { type: 'start' };

/**
 * Fires when an interaction has finished.
 *
 * @event OrbitControls#end
 * @type {Object}
 */
const _endEvent = { type: 'end' };

const _ray = new Ray();
const _plane = new Plane();
const _TILT_LIMIT = Math.cos( 70 * MathUtils.DEG2RAD );

const _v = new Vector3();
const _twoPI = 2 * Math.PI;

const _STATE = {
	NONE: -1,
	ROTATE: 0,
	DOLLY: 1,
	PAN: 2,
	TOUCH_ROTATE: 3,
	TOUCH_PAN: 4,
	TOUCH_DOLLY_PAN: 5,
	TOUCH_DOLLY_ROTATE: 6
};
const _EPS = 0.000001;


/**
 * Orbit controls allow the camera to orbit around a target.
 *
 * OrbitControls performs orbiting, dollying (zooming), and panning. Unlike {@link TrackballControls},
 * it maintains the "up" direction `object.up` (+Y by default).
 *
 * - Orbit: Left mouse / touch: one-finger move.
 * - Zoom: Middle mouse, or mousewheel / touch: two-finger spread or squish.
 * - Pan: Right mouse, or left mouse + ctrl/meta/shiftKey, or arrow keys / touch: two-finger move.
 *
 * ```js
 * const controls = new OrbitControls( camera, renderer.domElement );
 *
 * // controls.update() must be called after any manual changes to the camera's transform
 * camera.position.set( 0, 20, 100 );
 * controls.update();
 *
 * function animate() {
 *
 * 	// required if controls.enableDamping or controls.autoRotate are set to true
 * 	controls.update();
 *
 * 	renderer.render( scene, camera );
 *
 * }
 * ```
 *
 * @augments Controls
 * @three_import import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
 */
class OrbitControls extends Controls {

	/**
	 * Constructs a new controls instance.
	 *
	 * @param {Object3D} object - The object that is managed by the controls.
	 * @param {?HTMLElement} domElement - The HTML element used for event listeners.
	 */
	constructor( object, domElement = null ) {

		super( object, domElement );

		this.state = _STATE.NONE;

		/**
		 * The focus point of the controls, the `object` orbits around this.
		 * It can be updated manually at any point to change the focus of the controls.
		 *
		 * @type {Vector3}
		 */
		this.target = new Vector3();

		/**
		 * The focus point of the `minTargetRadius` and `maxTargetRadius` limits.
		 * It can be updated manually at any point to change the center of interest
		 * for the `target`.
		 *
		 * @type {Vector3}
		 */
		this.cursor = new Vector3();

		/**
		 * How far you can dolly in (perspective camera only).
		 *
		 * @type {number}
		 * @default 0
		 */
		this.minDistance = 0;

		/**
		 * How far you can dolly out (perspective camera only).
		 *
		 * @type {number}
		 * @default Infinity
		 */
		this.maxDistance = Infinity;

		/**
		 * How far you can zoom in (orthographic camera only).
		 *
		 * @type {number}
		 * @default 0
		 */
		this.minZoom = 0;

		/**
		 * How far you can zoom out (orthographic camera only).
		 *
		 * @type {number}
		 * @default Infinity
		 */
		this.maxZoom = Infinity;

		/**
		 * How close you can get the target to the 3D `cursor`.
		 *
		 * @type {number}
		 * @default 0
		 */
		this.minTargetRadius = 0;

		/**
		 * How far you can move the target from the 3D `cursor`.
		 *
		 * @type {number}
		 * @default Infinity
		 */
		this.maxTargetRadius = Infinity;

		/**
		 * How far you can orbit vertically, lower limit. Range is `[0, Math.PI]` radians.
		 *
		 * @type {number}
		 * @default 0
		 */
		this.minPolarAngle = 0;

		/**
		 * How far you can orbit vertically, upper limit. Range is `[0, Math.PI]` radians.
		 *
		 * @type {number}
		 * @default Math.PI
		 */
		this.maxPolarAngle = Math.PI;

		/**
		 * How far you can orbit horizontally, lower limit. If set, the interval `[ min, max ]`
		 * must be a sub-interval of `[ - 2 PI, 2 PI ]`, with `( max - min < 2 PI )`.
		 *
		 * @type {number}
		 * @default -Infinity
		 */
		this.minAzimuthAngle = - Infinity;

		/**
		 * How far you can orbit horizontally, upper limit. If set, the interval `[ min, max ]`
		 * must be a sub-interval of `[ - 2 PI, 2 PI ]`, with `( max - min < 2 PI )`.
		 *
		 * @type {number}
		 * @default -Infinity
		 */
		this.maxAzimuthAngle = Infinity;

		/**
		 * Set to `true` to enable damping (inertia), which can be used to give a sense of weight
		 * to the controls. Note that if this is enabled, you must call `update()` in your animation
		 * loop.
		 *
		 * @type {boolean}
		 * @default false
		 */
		this.enableDamping = false;

		/**
		 * The damping inertia used if `enableDamping` is set to `true`.
		 *
		 * Note that for this to work, you must call `update()` in your animation loop.
		 *
		 * @type {number}
		 * @default 0.05
		 */
		this.dampingFactor = 0.05;

		/**
		 * Enable or disable zooming (dollying) of the camera.
		 *
		 * @type {boolean}
		 * @default true
		 */
		this.enableZoom = true;

		/**
		 * Speed of zooming / dollying.
		 *
		 * @type {number}
		 * @default 1
		 */
		this.zoomSpeed = 1.0;

		/**
		 * Enable or disable horizontal and vertical rotation of the camera.
		 *
		 * Note that it is possible to disable a single axis by setting the min and max of the
		 * `minPolarAngle` or `minAzimuthAngle` to the same value, which will cause the vertical
		 * or horizontal rotation to be fixed at that value.
		 *
		 * @type {boolean}
		 * @default true
		 */
		this.enableRotate = true;

		/**
		 * Speed of rotation.
		 *
		 * @type {number}
		 * @default 1
		 */
		this.rotateSpeed = 1.0;

		/**
		 * How fast to rotate the camera when the keyboard is used.
		 *
		 * @type {number}
		 * @default 1
		 */
		this.keyRotateSpeed = 1.0;

		/**
		 * Enable or disable camera panning.
		 *
		 * @type {boolean}
		 * @default true
		 */
		this.enablePan = true;

		/**
		 * Speed of panning.
		 *
		 * @type {number}
		 * @default 1
		 */
		this.panSpeed = 1.0;

		/**
		 * Defines how the camera's position is translated when panning. If `true`, the camera pans
		 * in screen space. Otherwise, the camera pans in the plane orthogonal to the camera's up
		 * direction.
		 *
		 * @type {boolean}
		 * @default true
		 */
		this.screenSpacePanning = true;

		/**
		 * How fast to pan the camera when the keyboard is used in
		 * pixels per keypress.
		 *
		 * @type {number}
		 * @default 7
		 */
		this.keyPanSpeed = 7.0;

		/**
		 * Setting this property to `true` allows to zoom to the cursor's position.
		 *
		 * @type {boolean}
		 * @default false
		 */
		this.zoomToCursor = false;

		/**
		 * Set to true to automatically rotate around the target
		 *
		 * Note that if this is enabled, you must call `update()` in your animation loop.
		 * If you want the auto-rotate speed to be independent of the frame rate (the refresh
		 * rate of the display), you must pass the time `deltaTime`, in seconds, to `update()`.
		 *
		 * @type {boolean}
		 * @default false
		 */
		this.autoRotate = false;

		/**
		 * How fast to rotate around the target if `autoRotate` is `true`. The default  equates to 30 seconds
		 * per orbit at 60fps.
		 *
		 * Note that if `autoRotate` is enabled, you must call `update()` in your animation loop.
		 *
		 * @type {number}
		 * @default 2
		 */
		this.autoRotateSpeed = 2.0;

		/**
		 * This object contains references to the keycodes for controlling camera panning.
		 *
		 * ```js
		 * controls.keys = {
		 * 	LEFT: 'ArrowLeft', //left arrow
		 * 	UP: 'ArrowUp', // up arrow
		 * 	RIGHT: 'ArrowRight', // right arrow
		 * 	BOTTOM: 'ArrowDown' // down arrow
		 * }
		 * ```
		 * @type {Object}
		 */
		this.keys = { LEFT: 'ArrowLeft', UP: 'ArrowUp', RIGHT: 'ArrowRight', BOTTOM: 'ArrowDown' };

		/**
		 * This object contains references to the mouse actions used by the controls.
		 *
		 * ```js
		 * controls.mouseButtons = {
		 * 	LEFT: THREE.MOUSE.ROTATE,
		 * 	MIDDLE: THREE.MOUSE.DOLLY,
		 * 	RIGHT: THREE.MOUSE.PAN
		 * }
		 * ```
		 * @type {Object}
		 */
		this.mouseButtons = { LEFT: MOUSE.ROTATE, MIDDLE: MOUSE.DOLLY, RIGHT: MOUSE.PAN };

		/**
		 * This object contains references to the touch actions used by the controls.
		 *
		 * ```js
		 * controls.mouseButtons = {
		 * 	ONE: THREE.TOUCH.ROTATE,
		 * 	TWO: THREE.TOUCH.DOLLY_PAN
		 * }
		 * ```
		 * @type {Object}
		 */
		this.touches = { ONE: TOUCH.ROTATE, TWO: TOUCH.DOLLY_PAN };

		/**
		 * Used internally by `saveState()` and `reset()`.
		 *
		 * @type {Vector3}
		 */
		this.target0 = this.target.clone();

		/**
		 * Used internally by `saveState()` and `reset()`.
		 *
		 * @type {Vector3}
		 */
		this.position0 = this.object.position.clone();

		/**
		 * Used internally by `saveState()` and `reset()`.
		 *
		 * @type {number}
		 */
		this.zoom0 = this.object.zoom;

		// the target DOM element for key events
		this._domElementKeyEvents = null;

		// internals

		this._lastPosition = new Vector3();
		this._lastQuaternion = new Quaternion();
		this._lastTargetPosition = new Vector3();

		// so camera.up is the orbit axis
		this._quat = new Quaternion().setFromUnitVectors( object.up, new Vector3( 0, 1, 0 ) );
		this._quatInverse = this._quat.clone().invert();

		// current position in spherical coordinates
		this._spherical = new Spherical();
		this._sphericalDelta = new Spherical();

		this._scale = 1;
		this._panOffset = new Vector3();

		this._rotateStart = new Vector2();
		this._rotateEnd = new Vector2();
		this._rotateDelta = new Vector2();

		this._panStart = new Vector2();
		this._panEnd = new Vector2();
		this._panDelta = new Vector2();

		this._dollyStart = new Vector2();
		this._dollyEnd = new Vector2();
		this._dollyDelta = new Vector2();

		this._dollyDirection = new Vector3();
		this._mouse = new Vector2();
		this._performCursorZoom = false;

		this._pointers = [];
		this._pointerPositions = {};

		this._controlActive = false;

		// event listeners

		this._onPointerMove = onPointerMove.bind( this );
		this._onPointerDown = onPointerDown.bind( this );
		this._onPointerUp = onPointerUp.bind( this );
		this._onContextMenu = onContextMenu.bind( this );
		this._onMouseWheel = onMouseWheel.bind( this );
		this._onKeyDown = onKeyDown.bind( this );

		this._onTouchStart = onTouchStart.bind( this );
		this._onTouchMove = onTouchMove.bind( this );

		this._onMouseDown = onMouseDown.bind( this );
		this._onMouseMove = onMouseMove.bind( this );

		this._interceptControlDown = interceptControlDown.bind( this );
		this._interceptControlUp = interceptControlUp.bind( this );

		//

		if ( this.domElement !== null ) {

			this.connect( this.domElement );

		}

		this.update();

	}

	connect( element ) {

		super.connect( element );

		this.domElement.addEventListener( 'pointerdown', this._onPointerDown );
		this.domElement.addEventListener( 'pointercancel', this._onPointerUp );

		this.domElement.addEventListener( 'contextmenu', this._onContextMenu );
		this.domElement.addEventListener( 'wheel', this._onMouseWheel, { passive: false } );

		const document = this.domElement.getRootNode(); // offscreen canvas compatibility
		document.addEventListener( 'keydown', this._interceptControlDown, { passive: true, capture: true } );

		this.domElement.style.touchAction = 'none'; // disable touch scroll

	}

	disconnect() {

		this.domElement.removeEventListener( 'pointerdown', this._onPointerDown );
		this.domElement.removeEventListener( 'pointermove', this._onPointerMove );
		this.domElement.removeEventListener( 'pointerup', this._onPointerUp );
		this.domElement.removeEventListener( 'pointercancel', this._onPointerUp );

		this.domElement.removeEventListener( 'wheel', this._onMouseWheel );
		this.domElement.removeEventListener( 'contextmenu', this._onContextMenu );

		this.stopListenToKeyEvents();

		const document = this.domElement.getRootNode(); // offscreen canvas compatibility
		document.removeEventListener( 'keydown', this._interceptControlDown, { capture: true } );

		this.domElement.style.touchAction = 'auto';

	}

	dispose() {

		this.disconnect();

	}

	/**
	 * Get the current vertical rotation, in radians.
	 *
	 * @return {number} The current vertical rotation, in radians.
	 */
	getPolarAngle() {

		return this._spherical.phi;

	}

	/**
	 * Get the current horizontal rotation, in radians.
	 *
	 * @return {number} The current horizontal rotation, in radians.
	 */
	getAzimuthalAngle() {

		return this._spherical.theta;

	}

	/**
	 * Returns the distance from the camera to the target.
	 *
	 * @return {number} The distance from the camera to the target.
	 */
	getDistance() {

		return this.object.position.distanceTo( this.target );

	}

	/**
	 * Adds key event listeners to the given DOM element.
	 * `window` is a recommended argument for using this method.
	 *
	 * @param {HTMLElement} domElement - The DOM element
	 */
	listenToKeyEvents( domElement ) {

		domElement.addEventListener( 'keydown', this._onKeyDown );
		this._domElementKeyEvents = domElement;

	}

	/**
	 * Removes the key event listener previously defined with `listenToKeyEvents()`.
	 */
	stopListenToKeyEvents() {

		if ( this._domElementKeyEvents !== null ) {

			this._domElementKeyEvents.removeEventListener( 'keydown', this._onKeyDown );
			this._domElementKeyEvents = null;

		}

	}

	/**
	 * Save the current state of the controls. This can later be recovered with `reset()`.
	 */
	saveState() {

		this.target0.copy( this.target );
		this.position0.copy( this.object.position );
		this.zoom0 = this.object.zoom;

	}

	/**
	 * Reset the controls to their state from either the last time the `saveState()`
	 * was called, or the initial state.
	 */
	reset() {

		this.target.copy( this.target0 );
		this.object.position.copy( this.position0 );
		this.object.zoom = this.zoom0;

		this.object.updateProjectionMatrix();
		this.dispatchEvent( _changeEvent );

		this.update();

		this.state = _STATE.NONE;

	}

	update( deltaTime = null ) {

		const position = this.object.position;

		_v.copy( position ).sub( this.target );

		// rotate offset to "y-axis-is-up" space
		_v.applyQuaternion( this._quat );

		// angle from z-axis around y-axis
		this._spherical.setFromVector3( _v );

		if ( this.autoRotate && this.state === _STATE.NONE ) {

			this._rotateLeft( this._getAutoRotationAngle( deltaTime ) );

		}

		if ( this.enableDamping ) {

			this._spherical.theta += this._sphericalDelta.theta * this.dampingFactor;
			this._spherical.phi += this._sphericalDelta.phi * this.dampingFactor;

		} else {

			this._spherical.theta += this._sphericalDelta.theta;
			this._spherical.phi += this._sphericalDelta.phi;

		}

		// restrict theta to be between desired limits

		let min = this.minAzimuthAngle;
		let max = this.maxAzimuthAngle;

		if ( isFinite( min ) && isFinite( max ) ) {

			if ( min < - Math.PI ) min += _twoPI; else if ( min > Math.PI ) min -= _twoPI;

			if ( max < - Math.PI ) max += _twoPI; else if ( max > Math.PI ) max -= _twoPI;

			if ( min <= max ) {

				this._spherical.theta = Math.max( min, Math.min( max, this._spherical.theta ) );

			} else {

				this._spherical.theta = ( this._spherical.theta > ( min + max ) / 2 ) ?
					Math.max( min, this._spherical.theta ) :
					Math.min( max, this._spherical.theta );

			}

		}

		// restrict phi to be between desired limits
		this._spherical.phi = Math.max( this.minPolarAngle, Math.min( this.maxPolarAngle, this._spherical.phi ) );

		this._spherical.makeSafe();


		// move target to panned location

		if ( this.enableDamping === true ) {

			this.target.addScaledVector( this._panOffset, this.dampingFactor );

		} else {

			this.target.add( this._panOffset );

		}

		// Limit the target distance from the cursor to create a sphere around the center of interest
		this.target.sub( this.cursor );
		this.target.clampLength( this.minTargetRadius, this.maxTargetRadius );
		this.target.add( this.cursor );

		let zoomChanged = false;
		// adjust the camera position based on zoom only if we're not zooming to the cursor or if it's an ortho camera
		// we adjust zoom later in these cases
		if ( this.zoomToCursor && this._performCursorZoom || this.object.isOrthographicCamera ) {

			this._spherical.radius = this._clampDistance( this._spherical.radius );

		} else {

			const prevRadius = this._spherical.radius;
			this._spherical.radius = this._clampDistance( this._spherical.radius * this._scale );
			zoomChanged = prevRadius != this._spherical.radius;

		}

		_v.setFromSpherical( this._spherical );

		// rotate offset back to "camera-up-vector-is-up" space
		_v.applyQuaternion( this._quatInverse );

		position.copy( this.target ).add( _v );

		this.object.lookAt( this.target );

		if ( this.enableDamping === true ) {

			this._sphericalDelta.theta *= ( 1 - this.dampingFactor );
			this._sphericalDelta.phi *= ( 1 - this.dampingFactor );

			this._panOffset.multiplyScalar( 1 - this.dampingFactor );

		} else {

			this._sphericalDelta.set( 0, 0, 0 );

			this._panOffset.set( 0, 0, 0 );

		}

		// adjust camera position
		if ( this.zoomToCursor && this._performCursorZoom ) {

			let newRadius = null;
			if ( this.object.isPerspectiveCamera ) {

				// move the camera down the pointer ray
				// this method avoids floating point error
				const prevRadius = _v.length();
				newRadius = this._clampDistance( prevRadius * this._scale );

				const radiusDelta = prevRadius - newRadius;
				this.object.position.addScaledVector( this._dollyDirection, radiusDelta );
				this.object.updateMatrixWorld();

				zoomChanged = !! radiusDelta;

			} else if ( this.object.isOrthographicCamera ) {

				// adjust the ortho camera position based on zoom changes
				const mouseBefore = new Vector3( this._mouse.x, this._mouse.y, 0 );
				mouseBefore.unproject( this.object );

				const prevZoom = this.object.zoom;
				this.object.zoom = Math.max( this.minZoom, Math.min( this.maxZoom, this.object.zoom / this._scale ) );
				this.object.updateProjectionMatrix();

				zoomChanged = prevZoom !== this.object.zoom;

				const mouseAfter = new Vector3( this._mouse.x, this._mouse.y, 0 );
				mouseAfter.unproject( this.object );

				this.object.position.sub( mouseAfter ).add( mouseBefore );
				this.object.updateMatrixWorld();

				newRadius = _v.length();

			} else {

				console.warn( 'WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled.' );
				this.zoomToCursor = false;

			}

			// handle the placement of the target
			if ( newRadius !== null ) {

				if ( this.screenSpacePanning ) {

					// position the orbit target in front of the new camera position
					this.target.set( 0, 0, -1 )
						.transformDirection( this.object.matrix )
						.multiplyScalar( newRadius )
						.add( this.object.position );

				} else {

					// get the ray and translation plane to compute target
					_ray.origin.copy( this.object.position );
					_ray.direction.set( 0, 0, -1 ).transformDirection( this.object.matrix );

					// if the camera is 20 degrees above the horizon then don't adjust the focus target to avoid
					// extremely large values
					if ( Math.abs( this.object.up.dot( _ray.direction ) ) < _TILT_LIMIT ) {

						this.object.lookAt( this.target );

					} else {

						_plane.setFromNormalAndCoplanarPoint( this.object.up, this.target );
						_ray.intersectPlane( _plane, this.target );

					}

				}

			}

		} else if ( this.object.isOrthographicCamera ) {

			const prevZoom = this.object.zoom;
			this.object.zoom = Math.max( this.minZoom, Math.min( this.maxZoom, this.object.zoom / this._scale ) );

			if ( prevZoom !== this.object.zoom ) {

				this.object.updateProjectionMatrix();
				zoomChanged = true;

			}

		}

		this._scale = 1;
		this._performCursorZoom = false;

		// update condition is:
		// min(camera displacement, camera rotation in radians)^2 > EPS
		// using small-angle approximation cos(x/2) = 1 - x^2 / 8

		if ( zoomChanged ||
			this._lastPosition.distanceToSquared( this.object.position ) > _EPS ||
			8 * ( 1 - this._lastQuaternion.dot( this.object.quaternion ) ) > _EPS ||
			this._lastTargetPosition.distanceToSquared( this.target ) > _EPS ) {

			this.dispatchEvent( _changeEvent );

			this._lastPosition.copy( this.object.position );
			this._lastQuaternion.copy( this.object.quaternion );
			this._lastTargetPosition.copy( this.target );

			return true;

		}

		return false;

	}

	_getAutoRotationAngle( deltaTime ) {

		if ( deltaTime !== null ) {

			return ( _twoPI / 60 * this.autoRotateSpeed ) * deltaTime;

		} else {

			return _twoPI / 60 / 60 * this.autoRotateSpeed;

		}

	}

	_getZoomScale( delta ) {

		const normalizedDelta = Math.abs( delta * 0.01 );
		return Math.pow( 0.95, this.zoomSpeed * normalizedDelta );

	}

	_rotateLeft( angle ) {

		this._sphericalDelta.theta -= angle;

	}

	_rotateUp( angle ) {

		this._sphericalDelta.phi -= angle;

	}

	_panLeft( distance, objectMatrix ) {

		_v.setFromMatrixColumn( objectMatrix, 0 ); // get X column of objectMatrix
		_v.multiplyScalar( - distance );

		this._panOffset.add( _v );

	}

	_panUp( distance, objectMatrix ) {

		if ( this.screenSpacePanning === true ) {

			_v.setFromMatrixColumn( objectMatrix, 1 );

		} else {

			_v.setFromMatrixColumn( objectMatrix, 0 );
			_v.crossVectors( this.object.up, _v );

		}

		_v.multiplyScalar( distance );

		this._panOffset.add( _v );

	}

	// deltaX and deltaY are in pixels; right and down are positive
	_pan( deltaX, deltaY ) {

		const element = this.domElement;

		if ( this.object.isPerspectiveCamera ) {

			// perspective
			const position = this.object.position;
			_v.copy( position ).sub( this.target );
			let targetDistance = _v.length();

			// half of the fov is center to top of screen
			targetDistance *= Math.tan( ( this.object.fov / 2 ) * Math.PI / 180.0 );

			// we use only clientHeight here so aspect ratio does not distort speed
			this._panLeft( 2 * deltaX * targetDistance / element.clientHeight, this.object.matrix );
			this._panUp( 2 * deltaY * targetDistance / element.clientHeight, this.object.matrix );

		} else if ( this.object.isOrthographicCamera ) {

			// orthographic
			this._panLeft( deltaX * ( this.object.right - this.object.left ) / this.object.zoom / element.clientWidth, this.object.matrix );
			this._panUp( deltaY * ( this.object.top - this.object.bottom ) / this.object.zoom / element.clientHeight, this.object.matrix );

		} else {

			// camera neither orthographic nor perspective
			console.warn( 'WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.' );
			this.enablePan = false;

		}

	}

	_dollyOut( dollyScale ) {

		if ( this.object.isPerspectiveCamera || this.object.isOrthographicCamera ) {

			this._scale /= dollyScale;

		} else {

			console.warn( 'WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.' );
			this.enableZoom = false;

		}

	}

	_dollyIn( dollyScale ) {

		if ( this.object.isPerspectiveCamera || this.object.isOrthographicCamera ) {

			this._scale *= dollyScale;

		} else {

			console.warn( 'WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.' );
			this.enableZoom = false;

		}

	}

	_updateZoomParameters( x, y ) {

		if ( ! this.zoomToCursor ) {

			return;

		}

		this._performCursorZoom = true;

		const rect = this.domElement.getBoundingClientRect();
		const dx = x - rect.left;
		const dy = y - rect.top;
		const w = rect.width;
		const h = rect.height;

		this._mouse.x = ( dx / w ) * 2 - 1;
		this._mouse.y = - ( dy / h ) * 2 + 1;

		this._dollyDirection.set( this._mouse.x, this._mouse.y, 1 ).unproject( this.object ).sub( this.object.position ).normalize();

	}

	_clampDistance( dist ) {

		return Math.max( this.minDistance, Math.min( this.maxDistance, dist ) );

	}

	//
	// event callbacks - update the object state
	//

	_handleMouseDownRotate( event ) {

		this._rotateStart.set( event.clientX, event.clientY );

	}

	_handleMouseDownDolly( event ) {

		this._updateZoomParameters( event.clientX, event.clientX );
		this._dollyStart.set( event.clientX, event.clientY );

	}

	_handleMouseDownPan( event ) {

		this._panStart.set( event.clientX, event.clientY );

	}

	_handleMouseMoveRotate( event ) {

		this._rotateEnd.set( event.clientX, event.clientY );

		this._rotateDelta.subVectors( this._rotateEnd, this._rotateStart ).multiplyScalar( this.rotateSpeed );

		const element = this.domElement;

		this._rotateLeft( _twoPI * this._rotateDelta.x / element.clientHeight ); // yes, height

		this._rotateUp( _twoPI * this._rotateDelta.y / element.clientHeight );

		this._rotateStart.copy( this._rotateEnd );

		this.update();

	}

	_handleMouseMoveDolly( event ) {

		this._dollyEnd.set( event.clientX, event.clientY );

		this._dollyDelta.subVectors( this._dollyEnd, this._dollyStart );

		if ( this._dollyDelta.y > 0 ) {

			this._dollyOut( this._getZoomScale( this._dollyDelta.y ) );

		} else if ( this._dollyDelta.y < 0 ) {

			this._dollyIn( this._getZoomScale( this._dollyDelta.y ) );

		}

		this._dollyStart.copy( this._dollyEnd );

		this.update();

	}

	_handleMouseMovePan( event ) {

		this._panEnd.set( event.clientX, event.clientY );

		this._panDelta.subVectors( this._panEnd, this._panStart ).multiplyScalar( this.panSpeed );

		this._pan( this._panDelta.x, this._panDelta.y );

		this._panStart.copy( this._panEnd );

		this.update();

	}

	_handleMouseWheel( event ) {

		this._updateZoomParameters( event.clientX, event.clientY );

		if ( event.deltaY < 0 ) {

			this._dollyIn( this._getZoomScale( event.deltaY ) );

		} else if ( event.deltaY > 0 ) {

			this._dollyOut( this._getZoomScale( event.deltaY ) );

		}

		this.update();

	}

	_handleKeyDown( event ) {

		let needsUpdate = false;

		switch ( event.code ) {

			case this.keys.UP:

				if ( event.ctrlKey || event.metaKey || event.shiftKey ) {

					if ( this.enableRotate ) {

						this._rotateUp( _twoPI * this.keyRotateSpeed / this.domElement.clientHeight );

					}

				} else {

					if ( this.enablePan ) {

						this._pan( 0, this.keyPanSpeed );

					}

				}

				needsUpdate = true;
				break;

			case this.keys.BOTTOM:

				if ( event.ctrlKey || event.metaKey || event.shiftKey ) {

					if ( this.enableRotate ) {

						this._rotateUp( - _twoPI * this.keyRotateSpeed / this.domElement.clientHeight );

					}

				} else {

					if ( this.enablePan ) {

						this._pan( 0, - this.keyPanSpeed );

					}

				}

				needsUpdate = true;
				break;

			case this.keys.LEFT:

				if ( event.ctrlKey || event.metaKey || event.shiftKey ) {

					if ( this.enableRotate ) {

						this._rotateLeft( _twoPI * this.keyRotateSpeed / this.domElement.clientHeight );

					}

				} else {

					if ( this.enablePan ) {

						this._pan( this.keyPanSpeed, 0 );

					}

				}

				needsUpdate = true;
				break;

			case this.keys.RIGHT:

				if ( event.ctrlKey || event.metaKey || event.shiftKey ) {

					if ( this.enableRotate ) {

						this._rotateLeft( - _twoPI * this.keyRotateSpeed / this.domElement.clientHeight );

					}

				} else {

					if ( this.enablePan ) {

						this._pan( - this.keyPanSpeed, 0 );

					}

				}

				needsUpdate = true;
				break;

		}

		if ( needsUpdate ) {

			// prevent the browser from scrolling on cursor keys
			event.preventDefault();

			this.update();

		}


	}

	_handleTouchStartRotate( event ) {

		if ( this._pointers.length === 1 ) {

			this._rotateStart.set( event.pageX, event.pageY );

		} else {

			const position = this._getSecondPointerPosition( event );

			const x = 0.5 * ( event.pageX + position.x );
			const y = 0.5 * ( event.pageY + position.y );

			this._rotateStart.set( x, y );

		}

	}

	_handleTouchStartPan( event ) {

		if ( this._pointers.length === 1 ) {

			this._panStart.set( event.pageX, event.pageY );

		} else {

			const position = this._getSecondPointerPosition( event );

			const x = 0.5 * ( event.pageX + position.x );
			const y = 0.5 * ( event.pageY + position.y );

			this._panStart.set( x, y );

		}

	}

	_handleTouchStartDolly( event ) {

		const position = this._getSecondPointerPosition( event );

		const dx = event.pageX - position.x;
		const dy = event.pageY - position.y;

		const distance = Math.sqrt( dx * dx + dy * dy );

		this._dollyStart.set( 0, distance );

	}

	_handleTouchStartDollyPan( event ) {

		if ( this.enableZoom ) this._handleTouchStartDolly( event );

		if ( this.enablePan ) this._handleTouchStartPan( event );

	}

	_handleTouchStartDollyRotate( event ) {

		if ( this.enableZoom ) this._handleTouchStartDolly( event );

		if ( this.enableRotate ) this._handleTouchStartRotate( event );

	}

	_handleTouchMoveRotate( event ) {

		if ( this._pointers.length == 1 ) {

			this._rotateEnd.set( event.pageX, event.pageY );

		} else {

			const position = this._getSecondPointerPosition( event );

			const x = 0.5 * ( event.pageX + position.x );
			const y = 0.5 * ( event.pageY + position.y );

			this._rotateEnd.set( x, y );

		}

		this._rotateDelta.subVectors( this._rotateEnd, this._rotateStart ).multiplyScalar( this.rotateSpeed );

		const element = this.domElement;

		this._rotateLeft( _twoPI * this._rotateDelta.x / element.clientHeight ); // yes, height

		this._rotateUp( _twoPI * this._rotateDelta.y / element.clientHeight );

		this._rotateStart.copy( this._rotateEnd );

	}

	_handleTouchMovePan( event ) {

		if ( this._pointers.length === 1 ) {

			this._panEnd.set( event.pageX, event.pageY );

		} else {

			const position = this._getSecondPointerPosition( event );

			const x = 0.5 * ( event.pageX + position.x );
			const y = 0.5 * ( event.pageY + position.y );

			this._panEnd.set( x, y );

		}

		this._panDelta.subVectors( this._panEnd, this._panStart ).multiplyScalar( this.panSpeed );

		this._pan( this._panDelta.x, this._panDelta.y );

		this._panStart.copy( this._panEnd );

	}

	_handleTouchMoveDolly( event ) {

		const position = this._getSecondPointerPosition( event );

		const dx = event.pageX - position.x;
		const dy = event.pageY - position.y;

		const distance = Math.sqrt( dx * dx + dy * dy );

		this._dollyEnd.set( 0, distance );

		this._dollyDelta.set( 0, Math.pow( this._dollyEnd.y / this._dollyStart.y, this.zoomSpeed ) );

		this._dollyOut( this._dollyDelta.y );

		this._dollyStart.copy( this._dollyEnd );

		const centerX = ( event.pageX + position.x ) * 0.5;
		const centerY = ( event.pageY + position.y ) * 0.5;

		this._updateZoomParameters( centerX, centerY );

	}

	_handleTouchMoveDollyPan( event ) {

		if ( this.enableZoom ) this._handleTouchMoveDolly( event );

		if ( this.enablePan ) this._handleTouchMovePan( event );

	}

	_handleTouchMoveDollyRotate( event ) {

		if ( this.enableZoom ) this._handleTouchMoveDolly( event );

		if ( this.enableRotate ) this._handleTouchMoveRotate( event );

	}

	// pointers

	_addPointer( event ) {

		this._pointers.push( event.pointerId );

	}

	_removePointer( event ) {

		delete this._pointerPositions[ event.pointerId ];

		for ( let i = 0; i < this._pointers.length; i ++ ) {

			if ( this._pointers[ i ] == event.pointerId ) {

				this._pointers.splice( i, 1 );
				return;

			}

		}

	}

	_isTrackingPointer( event ) {

		for ( let i = 0; i < this._pointers.length; i ++ ) {

			if ( this._pointers[ i ] == event.pointerId ) return true;

		}

		return false;

	}

	_trackPointer( event ) {

		let position = this._pointerPositions[ event.pointerId ];

		if ( position === undefined ) {

			position = new Vector2();
			this._pointerPositions[ event.pointerId ] = position;

		}

		position.set( event.pageX, event.pageY );

	}

	_getSecondPointerPosition( event ) {

		const pointerId = ( event.pointerId === this._pointers[ 0 ] ) ? this._pointers[ 1 ] : this._pointers[ 0 ];

		return this._pointerPositions[ pointerId ];

	}

	//

	_customWheelEvent( event ) {

		const mode = event.deltaMode;

		// minimal wheel event altered to meet delta-zoom demand
		const newEvent = {
			clientX: event.clientX,
			clientY: event.clientY,
			deltaY: event.deltaY,
		};

		switch ( mode ) {

			case 1: // LINE_MODE
				newEvent.deltaY *= 16;
				break;

			case 2: // PAGE_MODE
				newEvent.deltaY *= 100;
				break;

		}

		// detect if event was triggered by pinching
		if ( event.ctrlKey && ! this._controlActive ) {

			newEvent.deltaY *= 10;

		}

		return newEvent;

	}

}

function onPointerDown( event ) {

	if ( this.enabled === false ) return;

	if ( this._pointers.length === 0 ) {

		this.domElement.setPointerCapture( event.pointerId );

		this.domElement.addEventListener( 'pointermove', this._onPointerMove );
		this.domElement.addEventListener( 'pointerup', this._onPointerUp );

	}

	//

	if ( this._isTrackingPointer( event ) ) return;

	//

	this._addPointer( event );

	if ( event.pointerType === 'touch' ) {

		this._onTouchStart( event );

	} else {

		this._onMouseDown( event );

	}

}

function onPointerMove( event ) {

	if ( this.enabled === false ) return;

	if ( event.pointerType === 'touch' ) {

		this._onTouchMove( event );

	} else {

		this._onMouseMove( event );

	}

}

function onPointerUp( event ) {

	this._removePointer( event );

	switch ( this._pointers.length ) {

		case 0:

			this.domElement.releasePointerCapture( event.pointerId );

			this.domElement.removeEventListener( 'pointermove', this._onPointerMove );
			this.domElement.removeEventListener( 'pointerup', this._onPointerUp );

			this.dispatchEvent( _endEvent );

			this.state = _STATE.NONE;

			break;

		case 1:

			const pointerId = this._pointers[ 0 ];
			const position = this._pointerPositions[ pointerId ];

			// minimal placeholder event - allows state correction on pointer-up
			this._onTouchStart( { pointerId: pointerId, pageX: position.x, pageY: position.y } );

			break;

	}

}

function onMouseDown( event ) {

	let mouseAction;

	switch ( event.button ) {

		case 0:

			mouseAction = this.mouseButtons.LEFT;
			break;

		case 1:

			mouseAction = this.mouseButtons.MIDDLE;
			break;

		case 2:

			mouseAction = this.mouseButtons.RIGHT;
			break;

		default:

			mouseAction = -1;

	}

	switch ( mouseAction ) {

		case MOUSE.DOLLY:

			if ( this.enableZoom === false ) return;

			this._handleMouseDownDolly( event );

			this.state = _STATE.DOLLY;

			break;

		case MOUSE.ROTATE:

			if ( event.ctrlKey || event.metaKey || event.shiftKey ) {

				if ( this.enablePan === false ) return;

				this._handleMouseDownPan( event );

				this.state = _STATE.PAN;

			} else {

				if ( this.enableRotate === false ) return;

				this._handleMouseDownRotate( event );

				this.state = _STATE.ROTATE;

			}

			break;

		case MOUSE.PAN:

			if ( event.ctrlKey || event.metaKey || event.shiftKey ) {

				if ( this.enableRotate === false ) return;

				this._handleMouseDownRotate( event );

				this.state = _STATE.ROTATE;

			} else {

				if ( this.enablePan === false ) return;

				this._handleMouseDownPan( event );

				this.state = _STATE.PAN;

			}

			break;

		default:

			this.state = _STATE.NONE;

	}

	if ( this.state !== _STATE.NONE ) {

		this.dispatchEvent( _startEvent );

	}

}

function onMouseMove( event ) {

	switch ( this.state ) {

		case _STATE.ROTATE:

			if ( this.enableRotate === false ) return;

			this._handleMouseMoveRotate( event );

			break;

		case _STATE.DOLLY:

			if ( this.enableZoom === false ) return;

			this._handleMouseMoveDolly( event );

			break;

		case _STATE.PAN:

			if ( this.enablePan === false ) return;

			this._handleMouseMovePan( event );

			break;

	}

}

function onMouseWheel( event ) {

	if ( this.enabled === false || this.enableZoom === false || this.state !== _STATE.NONE ) return;

	event.preventDefault();

	this.dispatchEvent( _startEvent );

	this._handleMouseWheel( this._customWheelEvent( event ) );

	this.dispatchEvent( _endEvent );

}

function onKeyDown( event ) {

	if ( this.enabled === false ) return;

	this._handleKeyDown( event );

}

function onTouchStart( event ) {

	this._trackPointer( event );

	switch ( this._pointers.length ) {

		case 1:

			switch ( this.touches.ONE ) {

				case TOUCH.ROTATE:

					if ( this.enableRotate === false ) return;

					this._handleTouchStartRotate( event );

					this.state = _STATE.TOUCH_ROTATE;

					break;

				case TOUCH.PAN:

					if ( this.enablePan === false ) return;

					this._handleTouchStartPan( event );

					this.state = _STATE.TOUCH_PAN;

					break;

				default:

					this.state = _STATE.NONE;

			}

			break;

		case 2:

			switch ( this.touches.TWO ) {

				case TOUCH.DOLLY_PAN:

					if ( this.enableZoom === false && this.enablePan === false ) return;

					this._handleTouchStartDollyPan( event );

					this.state = _STATE.TOUCH_DOLLY_PAN;

					break;

				case TOUCH.DOLLY_ROTATE:

					if ( this.enableZoom === false && this.enableRotate === false ) return;

					this._handleTouchStartDollyRotate( event );

					this.state = _STATE.TOUCH_DOLLY_ROTATE;

					break;

				default:

					this.state = _STATE.NONE;

			}

			break;

		default:

			this.state = _STATE.NONE;

	}

	if ( this.state !== _STATE.NONE ) {

		this.dispatchEvent( _startEvent );

	}

}

function onTouchMove( event ) {

	this._trackPointer( event );

	switch ( this.state ) {

		case _STATE.TOUCH_ROTATE:

			if ( this.enableRotate === false ) return;

			this._handleTouchMoveRotate( event );

			this.update();

			break;

		case _STATE.TOUCH_PAN:

			if ( this.enablePan === false ) return;

			this._handleTouchMovePan( event );

			this.update();

			break;

		case _STATE.TOUCH_DOLLY_PAN:

			if ( this.enableZoom === false && this.enablePan === false ) return;

			this._handleTouchMoveDollyPan( event );

			this.update();

			break;

		case _STATE.TOUCH_DOLLY_ROTATE:

			if ( this.enableZoom === false && this.enableRotate === false ) return;

			this._handleTouchMoveDollyRotate( event );

			this.update();

			break;

		default:

			this.state = _STATE.NONE;

	}

}

function onContextMenu( event ) {

	if ( this.enabled === false ) return;

	event.preventDefault();

}

function interceptControlDown( event ) {

	if ( event.key === 'Control' ) {

		this._controlActive = true;

		const document = this.domElement.getRootNode(); // offscreen canvas compatibility

		document.addEventListener( 'keyup', this._interceptControlUp, { passive: true, capture: true } );

	}

}

function interceptControlUp( event ) {

	if ( event.key === 'Control' ) {

		this._controlActive = false;

		const document = this.domElement.getRootNode(); // offscreen canvas compatibility

		document.removeEventListener( 'keyup', this._interceptControlUp, { passive: true, capture: true } );

	}

}

function calculateGeometryMemory(geometry) {
  let bytes = 0;
  if (geometry.attributes) {
    for (const name in geometry.attributes) {
      const attr = geometry.attributes[name];
      if (attr.array) {
        bytes += attr.array.byteLength;
      }
    }
  }
  if (geometry.index && geometry.index.array) {
    bytes += geometry.index.array.byteLength;
  }
  return bytes / (1024 * 1024);
}
function sanitizeGeometry(source) {
  if (!source.getAttribute("position")) return new THREE.BoxGeometry(0.1, 0.1, 0.1);
  const geometry = new THREE.BufferGeometry();
  const posAttr = source.getAttribute("position");
  const positions = new Float32Array(posAttr.count * 3);
  for (let i = 0; i < posAttr.count; i++) {
    positions[i * 3] = posAttr.getX(i);
    positions[i * 3 + 1] = posAttr.getY(i);
    positions[i * 3 + 2] = posAttr.getZ(i);
  }
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const normAttr = source.getAttribute("normal");
  if (normAttr) {
    const normals = new Float32Array(normAttr.count * 3);
    for (let i = 0; i < normAttr.count; i++) {
      normals[i * 3] = normAttr.getX(i);
      normals[i * 3 + 1] = normAttr.getY(i);
      normals[i * 3 + 2] = normAttr.getZ(i);
    }
    geometry.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
  } else {
    geometry.computeVertexNormals();
  }
  if (source.getIndex()) {
    const sourceIndex = source.getIndex();
    const indices = new Uint32Array(sourceIndex.count);
    for (let i = 0; i < sourceIndex.count; i++) {
      indices[i] = sourceIndex.getX(i);
    }
    geometry.setIndex(new THREE.BufferAttribute(indices, 1));
  }
  geometry.deleteAttribute("uv");
  geometry.deleteAttribute("uv2");
  geometry.deleteAttribute("color");
  geometry.computeBoundingBox();
  return geometry;
}
function extractColor(mesh) {
  if (mesh.userData.color !== void 0) return mesh.userData.color;
  const geo = mesh.geometry;
  if (geo && geo.attributes.color) {
    const colorAttr = geo.attributes.color;
    if (colorAttr.count > 0) {
      const r = colorAttr.getX(0);
      const g = colorAttr.getY(0);
      const b = colorAttr.getZ(0);
      const color = new THREE.Color();
      if (r > 1 || g > 1 || b > 1) color.setRGB(r / 255, g / 255, b / 255);
      else color.setRGB(r, g, b);
      return color.getHex();
    }
  }
  const material = mesh.material;
  if (Array.isArray(material)) {
    for (const mat of material) {
      if (mat.color) return mat.color.getHex();
    }
  } else if (material.color) {
    return material.color.getHex();
  }
  return getColorByComponentType(mesh.name);
}
function getColorByComponentType(name) {
  const n = name.toLowerCase();
  if (n.includes("col") || n.includes("柱")) return 12573694;
  if (n.includes("beam") || n.includes("梁")) return 9684477;
  if (n.includes("slab") || n.includes("板")) return 15067115;
  if (n.includes("wall") || n.includes("墙")) return 15987958;
  return 9741240;
}
function collectItems$1(root) {
  const items = [];
  const _m4 = new THREE.Matrix4();
  root.updateMatrixWorld(true);
  root.traverse((obj) => {
    if (obj.isMesh) {
      const mesh = obj;
      const geometry = mesh.geometry;
      const material = mesh.material;
      if (!geometry) return;
      if (!geometry.boundingBox) geometry.computeBoundingBox();
      const worldMatrix = mesh.matrixWorld;
      const center = new THREE.Vector3();
      geometry.boundingBox.getCenter(center);
      center.applyMatrix4(worldMatrix);
      const matUuid = Array.isArray(material) ? material[0]?.uuid : material?.uuid;
      const id = `${geometry.uuid}_${matUuid}`;
      if (mesh.isInstancedMesh) {
        const instancedMesh = mesh;
        for (let i = 0; i < instancedMesh.count; i++) {
          instancedMesh.getMatrixAt(i, _m4);
          _m4.premultiply(worldMatrix);
          const instanceCenter = new THREE.Vector3();
          geometry.boundingBox.getCenter(instanceCenter);
          instanceCenter.applyMatrix4(_m4);
          items.push({
            id,
            uuid: mesh.uuid,
            expressID: instancedMesh.userData.expressID,
            geometry,
            material,
            color: extractColor(mesh),
            matrix: _m4.clone(),
            center: instanceCenter
          });
        }
      } else {
        items.push({
          id,
          uuid: mesh.uuid,
          expressID: mesh.userData.expressID,
          geometry,
          material,
          color: extractColor(mesh),
          matrix: worldMatrix.clone(),
          center
        });
      }
    }
  });
  return items;
}
function buildOctree$1(items, bounds, config, level = 0) {
  if (items.length <= config.maxItemsPerNode || level >= config.maxDepth) {
    return { bounds: bounds.clone(), children: null, items, level };
  }
  const center = bounds.getCenter(new THREE.Vector3());
  const min = bounds.min;
  const max = bounds.max;
  const childrenItems = Array(8).fill(null).map(() => []);
  for (const item of items) {
    const c = item.center;
    const idx = (c.x >= center.x ? 1 : 0) | (c.y >= center.y ? 2 : 0) | (c.z >= center.z ? 4 : 0);
    childrenItems[idx].push(item);
  }
  const children = [];
  let hasChildren = false;
  for (let i = 0; i < 8; i++) {
    if (childrenItems[i].length > 0) {
      const cMin = new THREE.Vector3(i & 1 ? center.x : min.x, i & 2 ? center.y : min.y, i & 4 ? center.z : min.z);
      const cMax = new THREE.Vector3(i & 1 ? max.x : center.x, i & 2 ? max.y : center.y, i & 4 ? max.z : center.z);
      const childBounds = new THREE.Box3(cMin, cMax);
      children.push(buildOctree$1(childrenItems[i], childBounds, config, level + 1));
      hasChildren = true;
    }
  }
  if (!hasChildren) {
    return { bounds: bounds.clone(), children: null, items, level };
  }
  return { bounds: bounds.clone(), children, items: [], level };
}
function createBatchedMeshFromItems(items, material) {
  if (items.length === 0) return null;
  let vertexCount = 0;
  let indexCount = 0;
  const sanitizedItems = items.map((item) => ({
    ...item,
    geometry: sanitizeGeometry(item.geometry)
  }));
  for (const item of sanitizedItems) {
    vertexCount += item.geometry.attributes.position.count;
    if (item.geometry.index) {
      indexCount += item.geometry.index.count;
    }
  }
  const batchedMesh = new THREE.BatchedMesh(sanitizedItems.length, vertexCount, indexCount, material);
  batchedMesh.frustumCulled = true;
  const geometryMap = /* @__PURE__ */ new Map();
  const batchIdToExpressId = /* @__PURE__ */ new Map();
  const batchIdToUuid = /* @__PURE__ */ new Map();
  const batchIdToColor = /* @__PURE__ */ new Map();
  const batchIdToGeometry = /* @__PURE__ */ new Map();
  for (const item of sanitizedItems) {
    let geometryId = geometryMap.get(item.geometry);
    if (geometryId === void 0) {
      geometryId = batchedMesh.addGeometry(item.geometry);
      geometryMap.set(item.geometry, geometryId);
    }
    if (geometryId !== -1) {
      const instanceId = batchedMesh.addInstance(geometryId);
      batchedMesh.setMatrixAt(instanceId, item.matrix);
      const color = new THREE.Color(item.color);
      batchedMesh.setColorAt(instanceId, color);
      if (item.expressID !== void 0) {
        batchIdToExpressId.set(instanceId, item.expressID);
      }
      batchIdToUuid.set(instanceId, item.uuid);
      batchIdToColor.set(instanceId, item.color);
      batchIdToGeometry.set(instanceId, item.geometry);
    }
  }
  batchedMesh.userData.batchIdToExpressId = batchIdToExpressId;
  batchedMesh.userData.batchIdToUuid = batchIdToUuid;
  batchedMesh.userData.batchIdToColor = batchIdToColor;
  batchedMesh.userData.batchIdToGeometry = batchIdToGeometry;
  return batchedMesh;
}
function collectLeafNodes(node, leaves = []) {
  if (node.children) {
    for (const child of node.children) {
      collectLeafNodes(child, leaves);
    }
  } else if (node.items.length > 0) {
    leaves.push(node);
  }
  return leaves;
}

const setMaterialProperties = (material) => {
  if (!material) return;
  material.side = THREE.DoubleSide;
  material.flatShading = false;
  material.transparent = false;
  material.depthWrite = true;
  material.depthTest = true;
};
function decompressVertice(baseVertex, vertexScale, vertex) {
  const baseX = baseVertex[0];
  const baseY = baseVertex[1];
  const baseZ = baseVertex[2];
  const scaleX = vertexScale[0];
  const scaleY = vertexScale[1];
  const scaleZ = vertexScale[2];
  const qX = vertex[0];
  const qY = vertex[1];
  const qZ = vertex[2];
  const rx = baseX + qX / scaleX;
  const ry = baseY + qY / scaleY;
  const rz = baseZ + qZ / scaleZ;
  return { rx, ry, rz };
}
const decodeNormal = (packed) => {
  const INV_NORMAL_PRECISION = 1 / 511;
  let x = packed >> 20 & 1023;
  let y = packed >> 10 & 1023;
  let z = packed & 1023;
  x = x >= 512 ? x - 1024 : x;
  y = y >= 512 ? y - 1024 : y;
  z = z >= 512 ? z - 1024 : z;
  let nx = x * INV_NORMAL_PRECISION;
  let ny = y * INV_NORMAL_PRECISION;
  let nz = z * INV_NORMAL_PRECISION;
  const length = Math.sqrt(nx * nx + ny * ny + nz * nz);
  if (length > 0) {
    nx /= length;
    ny /= length;
    nz /= length;
  }
  return { nx, ny, nz };
};
const parseColor = (color) => {
  const r = color >> 16 & 255;
  const g = color >> 8 & 255;
  const b = color & 255;
  return r << 16 | g << 8 | b;
};
const extractScaleFromMatrix3 = (matrix) => {
  if (!matrix || matrix.length < 9) {
    return [1, 1, 1];
  }
  const sx = Math.sqrt(matrix[0] * matrix[0] + matrix[1] * matrix[1] + matrix[2] * matrix[2]);
  const sy = Math.sqrt(matrix[3] * matrix[3] + matrix[4] * matrix[4] + matrix[5] * matrix[5]);
  const sz = Math.sqrt(matrix[6] * matrix[6] + matrix[7] * matrix[7] + matrix[8] * matrix[8]);
  const processScale = (scale) => {
    if (Math.abs(scale - 0.01) < 1e-6) return 0.01;
    if (Math.abs(scale - 0.02) < 1e-6) return 0.02;
    return scale;
  };
  return [processScale(sx), processScale(sy), processScale(sz)];
};
const normalizeMatrix3 = (matrix) => {
  if (!matrix || matrix.length < 9) return Float32Array.from(matrix);
  const scales = extractScaleFromMatrix3(matrix);
  const normalized = Float32Array.from(matrix);
  for (let i = 0; i < 3; i++) {
    const offset = i * 3;
    const scale = scales[i];
    if (Math.abs(scale) > 1e-6) {
      normalized[offset] /= scale;
      normalized[offset + 1] /= scale;
      normalized[offset + 2] /= scale;
    }
  }
  return normalized;
};
const composeMatrixByMatrix3 = (matrix, position) => {
  const matrix4 = new THREE.Matrix4();
  if (matrix && matrix.length >= 9 && position && position.length >= 3) {
    if (matrix.some((x) => isNaN(x)) || position.some((x) => isNaN(x))) {
      matrix4.identity();
      return matrix4;
    }
    const scales = extractScaleFromMatrix3(matrix);
    const normalizedRotation = normalizeMatrix3(matrix);
    const array = [
      normalizedRotation[0] * scales[0],
      normalizedRotation[1] * scales[0],
      normalizedRotation[2] * scales[0],
      0,
      normalizedRotation[3] * scales[1],
      normalizedRotation[4] * scales[1],
      normalizedRotation[5] * scales[1],
      0,
      normalizedRotation[6] * scales[2],
      normalizedRotation[7] * scales[2],
      normalizedRotation[8] * scales[2],
      0,
      position[0],
      position[1],
      position[2],
      1
    ];
    matrix4.fromArray(array);
  } else {
    matrix4.identity();
    if (position && position.length >= 3 && !position.some((x) => isNaN(x))) {
      matrix4.setPosition(position[0], position[1], position[2]);
    }
  }
  return matrix4;
};
class LMBLoader extends Loader {
  static {
    this.expressIdCounter = 1e6;
  }
  // LMB 使用较大的起始值以避免与 IFC 冲突
  constructor(manager) {
    super(manager);
    this.manager = manager || THREE.DefaultLoadingManager;
  }
  async loadLmbAsync(url, t, onProgress) {
    const loader = new FileLoader(this.manager);
    loader.setPath(this.path);
    loader.setResponseType("arraybuffer");
    loader.setRequestHeader(this.requestHeader);
    loader.setWithCredentials(this.withCredentials);
    let buffer = await loader.loadAsync(url, (event) => {
      if (onProgress) {
        onProgress({
          loaded: event.loaded,
          total: event.total,
          percent: Math.floor(event.loaded / event.total * 100)
        });
      }
    });
    try {
      const compressedData = new Uint8Array(buffer);
      const decompressedData = pako.inflate(compressedData);
      buffer = decompressedData.buffer;
      console.log("[LMBLoader] File decompressed successfully.");
    } catch (error) {
      console.log("[LMBLoader] File is not compressed or decompression failed. URL:", url);
    }
    return this.parse(buffer, t);
  }
  parse(buffer, t, onProgress = () => {
  }) {
    const view = new DataView(buffer);
    let offset = 0;
    onProgress(0.05, t("lmb_parsing_header"));
    const position = new Float32Array(3);
    for (let i = 0; i < 3; i++) {
      position[i] = view.getFloat32(offset, true);
      offset += 4;
    }
    const colorCount = view.getUint32(offset, true);
    offset += 4;
    const nodeCount = view.getUint32(offset, true);
    offset += 4;
    let currentStep = 0;
    const totalSteps = colorCount + nodeCount;
    const colors = [];
    for (let i = 0; i < colorCount; i++) {
      onProgress(currentStep / totalSteps, "Parsing Colors...");
      currentStep++;
      const color = view.getUint32(offset, true);
      colors.push(color);
      offset += 4;
    }
    const root = new THREE.Group();
    root.name = "LMB_Root";
    if (!isNaN(position[0])) {
      root.position.set(position[0], position[1], position[2]);
    }
    const materials = colors.map((color) => {
      const material = new THREE.MeshPhongMaterial({
        color: new THREE.Color(parseColor(color)),
        side: THREE.DoubleSide,
        flatShading: false,
        shininess: 30
      });
      setMaterialProperties(material);
      return material;
    });
    for (let i = 0; i < nodeCount; i++) {
      onProgress(currentStep / totalSteps, `Parsing Node ${i + 1}/${nodeCount}...`);
      currentStep++;
      const node = this.parseNode(buffer, view, offset);
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.Float32BufferAttribute(node.vertices, 3));
      geometry.setAttribute("normal", new THREE.Float32BufferAttribute(node.normals, 3));
      geometry.setIndex(new THREE.Uint32BufferAttribute(node.indices, 1));
      geometry.computeBoundingBox();
      const nodeName = node.name && node.name.length > 0 ? node.name : `Node_${i}`;
      const expressID = LMBLoader.expressIdCounter++;
      const mesh = new THREE.Mesh(geometry, materials[node.colorIndex]);
      mesh.name = nodeName;
      mesh.userData.expressID = expressID;
      const matrix = composeMatrixByMatrix3(node.matrix, node.position);
      mesh.applyMatrix4(matrix);
      root.add(mesh);
      if (node.instances.length > 0) {
        node.instances.forEach((instance) => {
          const instanceMesh = new THREE.Mesh(geometry, materials[instance.colorIndex]);
          instanceMesh.name = nodeName;
          instanceMesh.userData.expressID = LMBLoader.expressIdCounter++;
          const instanceMatrix = composeMatrixByMatrix3(instance.matrix, instance.position);
          instanceMesh.applyMatrix4(instanceMatrix);
          root.add(instanceMesh);
        });
      }
      offset = node.nextOffset;
    }
    onProgress(1);
    return root;
  }
  parseNode(buffer, view, offset) {
    const nameLength = view.getUint16(offset, true);
    offset += 2;
    const name = new TextDecoder().decode(new Uint8Array(buffer, offset, nameLength));
    offset += nameLength;
    while (offset % 4 !== 0) offset++;
    const matrix = new Float32Array(9);
    for (let i = 0; i < 9; i++) {
      matrix[i] = view.getFloat32(offset, true);
      offset += 4;
    }
    const nodePosition = new Float32Array(3);
    for (let i = 0; i < 3; i++) {
      nodePosition[i] = view.getFloat32(offset, true);
      offset += 4;
    }
    const baseVertex = new Float32Array(3);
    for (let i = 0; i < 3; i++) {
      baseVertex[i] = view.getFloat32(offset, true);
      offset += 4;
    }
    const vertexScale = new Float32Array(3);
    for (let i = 0; i < 3; i++) {
      vertexScale[i] = view.getFloat32(offset, true);
      offset += 4;
    }
    const vertexCount = view.getUint32(offset, true);
    offset += 4;
    const vertices = new Float32Array(vertexCount * 3);
    vertices[0] = baseVertex[0];
    vertices[1] = baseVertex[1];
    vertices[2] = baseVertex[2];
    for (let i = 0; i < vertexCount - 1; i++) {
      const packedvertex = new Int16Array(3);
      for (let j = 0; j < 3; j++) {
        packedvertex[j] = view.getInt16(offset, true);
        offset += 2;
      }
      const { rx, ry, rz } = decompressVertice(baseVertex, vertexScale, packedvertex);
      vertices[(i + 1) * 3] = rx;
      vertices[(i + 1) * 3 + 1] = ry;
      vertices[(i + 1) * 3 + 2] = rz;
    }
    while (offset % 4 !== 0) offset++;
    const normalCount = vertexCount;
    const normals = new Float32Array(normalCount * 3);
    for (let i = 0; i < normalCount; i++) {
      const compressedNormal = view.getUint32(offset, true);
      offset += 4;
      const { nx, ny, nz } = decodeNormal(compressedNormal);
      normals[i * 3] = nx;
      normals[i * 3 + 1] = ny;
      normals[i * 3 + 2] = nz;
    }
    while (offset % 4 !== 0) offset++;
    const indexCount = view.getUint32(offset, true);
    offset += 4;
    const indexSize = vertexCount <= 255 ? 1 : vertexCount <= 65535 ? 2 : 4;
    let indices;
    if (vertexCount <= 255) indices = new Uint8Array(indexCount);
    else if (vertexCount <= 65535) indices = new Uint16Array(indexCount);
    else indices = new Uint32Array(indexCount);
    for (let i = 0; i < indexCount; i++) {
      if (indexSize === 1) indices[i] = view.getUint8(offset);
      else if (indexSize === 2) indices[i] = view.getUint16(offset, true);
      else indices[i] = view.getUint32(offset, true);
      offset += indexSize;
    }
    if (indexSize < 4) {
      while (offset % 4 !== 0) offset++;
    }
    const colorIndex = view.getUint32(offset, true);
    offset += 4;
    const instanceCount = view.getUint32(offset, true);
    offset += 4;
    const instances = [];
    if (instanceCount > 0) {
      for (let i = 0; i < instanceCount; i++) {
        const instanceNameLength = view.getUint16(offset, true);
        offset += 2;
        const instanceName = new TextDecoder().decode(new Uint8Array(buffer, offset, instanceNameLength));
        offset += instanceNameLength;
        const alignmentPadding = (4 - offset % 4) % 4;
        offset += alignmentPadding;
        const instanceMatrix = new Float32Array(9);
        for (let j = 0; j < 9; j++) {
          instanceMatrix[j] = view.getFloat32(offset, true);
          offset += 4;
        }
        const instancePosition = new Float32Array(3);
        for (let j = 0; j < 3; j++) {
          instancePosition[j] = view.getFloat32(offset, true);
          offset += 4;
        }
        const instanceColorIndex = view.getUint32(offset, true);
        offset += 4;
        instances.push({
          name: instanceName,
          matrix: instanceMatrix,
          position: instancePosition,
          colorIndex: instanceColorIndex
        });
      }
    }
    return {
      name,
      matrix,
      position: nodePosition,
      vertices,
      normals,
      indices,
      colorIndex,
      instances,
      nextOffset: offset
    };
  }
}

const loadModelFiles = async (files, onProgress, t, settings, libPath = "./libs") => {
  const loadedObjects = [];
  const totalFiles = files.length;
  for (let i = 0; i < totalFiles; i++) {
    const fileOrUrl = files[i];
    const isUrl = typeof fileOrUrl === "string";
    let fileName = "";
    let ext = "";
    let url = "";
    if (isUrl) {
      url = fileOrUrl;
      const urlPath = url.split("?")[0].split("#")[0];
      fileName = urlPath.split("/").pop() || "model";
      ext = fileName.split(".").pop()?.toLowerCase() || "";
      console.log(`[LoaderUtils] Loading URL: ${url}`);
      console.log(`[LoaderUtils] Parsed fileName: ${fileName}, ext: ${ext}`);
    } else {
      const file = fileOrUrl;
      fileName = file.name;
      ext = fileName.split(".").pop()?.toLowerCase() || "";
      url = URL.createObjectURL(file);
      console.log(`[LoaderUtils] Loading File: ${fileName}, ext: ${ext}`);
    }
    const fileBaseProgress = i / totalFiles * 100;
    const fileWeight = 100 / totalFiles;
    const updateFileProgress = (p, msg) => {
      const safeP = isNaN(p) ? 0 : Math.min(100, Math.max(0, p));
      const status = msg || `${t("loading")} ${fileName}`;
      onProgress(Math.round(fileBaseProgress + safeP * fileWeight / 100), status);
    };
    updateFileProgress(0);
    let object = null;
    try {
      console.log(`[LoaderUtils] Dispatching loader for ext: ${ext}`);
      if (ext === "lmb" || ext === "lmbz") {
        const loader = new LMBLoader();
        object = await loader.loadLmbAsync(url, t, (p) => updateFileProgress(p * 100));
      } else if (ext === "glb" || ext === "gltf") {
        const { GLTFLoader } = await import('./GLTFLoader-ADgnQB1v.js');
        const loader = new GLTFLoader();
        const gltf = await new Promise((resolve, reject) => {
          loader.load(url, resolve, (e) => {
            if (e.total && e.total > 0) updateFileProgress(e.loaded / e.total * 100);
            else updateFileProgress(50);
          }, reject);
        });
        object = gltf.scene;
      } else if (ext === "fbx") {
        console.log(`[LoaderUtils] Starting FBXLoader for ${url}`);
        const { FBXLoader } = await import('./FBXLoader-08JsL2Ep.js');
        const loader = new FBXLoader();
        object = await new Promise((resolve, reject) => {
          loader.load(url, (fbx) => {
            console.log(`[LoaderUtils] FBX loaded successfully:`, fbx);
            resolve(fbx);
          }, (e) => {
            if (e.total && e.total > 0) updateFileProgress(e.loaded / e.total * 100);
            else updateFileProgress(50);
          }, (err) => {
            console.error(`[LoaderUtils] FBXLoader error:`, err);
            reject(err);
          });
        });
      } else if (ext === "ifc") {
        const { loadIFC } = await import('./IFCLoader-BNSY_EXJ.js');
        object = await loadIFC(url, updateFileProgress, t, libPath);
      } else if (ext === "obj") {
        const { OBJLoader } = await import('./OBJLoader-CZLCO8Ct.js');
        const loader = new OBJLoader();
        object = await loader.loadAsync(url, (e) => {
          if (e.total && e.total > 0) updateFileProgress(e.loaded / e.total * 100);
        });
      } else if (ext === "stl") {
        const { STLLoader } = await import('./STLLoader-Ds51NTSt.js');
        const loader = new STLLoader();
        const geometry = await loader.loadAsync(url, (e) => {
          if (e.total && e.total > 0) updateFileProgress(e.loaded / e.total * 100);
        });
        object = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color: 8947848 }));
      } else if (ext === "ply") {
        const { PLYLoader } = await import('./PLYLoader-22HoDbcn.js');
        const loader = new PLYLoader();
        const geometry = await loader.loadAsync(url, (e) => {
          if (e.total && e.total > 0) updateFileProgress(e.loaded / e.total * 100);
        });
        object = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({
          color: 8947848,
          vertexColors: geometry.hasAttribute("color")
        }));
      } else if (ext === "3mf") {
        const { ThreeMFLoader } = await import('./3MFLoader-BEJHjtnv.js');
        const loader = new ThreeMFLoader();
        object = await loader.loadAsync(url, (e) => {
          if (e.total && e.total > 0) updateFileProgress(e.loaded / e.total * 100);
        });
      } else if (ext === "stp" || ext === "step" || ext === "igs" || ext === "iges") {
        const buffer = isUrl ? await fetch(url).then((r) => r.arrayBuffer()) : await fileOrUrl.arrayBuffer();
        const wasmUrl = `${libPath}/occt-import-js/occt-import-js.wasm`;
        const { OCCTLoader } = await import('./OCCTLoader-DRYc2Rfd.js');
        const loader = new OCCTLoader(wasmUrl);
        object = await loader.load(buffer, t, (p, msg) => {
          updateFileProgress(p, msg);
        });
      }
      if (object) {
        object.name = fileName;
        loadedObjects.push(object);
      }
    } catch (e) {
      console.error(`加载${fileName}失败`, e);
    } finally {
      if (!isUrl) URL.revokeObjectURL(url);
    }
  }
  onProgress(100, t("preparing_scene"));
  for (const object of loadedObjects) {
    object.traverse((child) => {
      if (child.isMesh) {
        const mesh = child;
        mesh.frustumCulled = true;
        if (!mesh.geometry.boundingBox) mesh.geometry.computeBoundingBox();
        if (!mesh.geometry.boundingSphere) mesh.geometry.computeBoundingSphere();
      }
    });
  }
  return loadedObjects;
};
const parseTilesetFromFolder = async (files, onProgress, t) => {
  onProgress(10, t("analyzing"));
  const fileMap = /* @__PURE__ */ new Map();
  let tilesetKey = "";
  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    const pathParts = f.webkitRelativePath.split("/");
    const relPath = pathParts.slice(1).join("/");
    if (relPath) {
      fileMap.set(relPath, f);
      if (f.name === "tileset.json") tilesetKey = relPath;
    } else {
      fileMap.set(f.name, f);
      if (f.name === "tileset.json") tilesetKey = f.name;
    }
  }
  if (!tilesetKey && fileMap.has("tileset.json")) tilesetKey = "tileset.json";
  if (!tilesetKey) {
    throw new Error(t("error_no_tileset"));
  }
  onProgress(50, t("reading"));
  const blobUrlMap = /* @__PURE__ */ new Map();
  fileMap.forEach((blob2, path) => {
    blobUrlMap.set(path, URL.createObjectURL(blob2));
  });
  const tilesetFile = fileMap.get(tilesetKey);
  if (!tilesetFile) return null;
  const text = await tilesetFile.text();
  const json = JSON.parse(text);
  const replaceUris = (node) => {
    if (node.content && node.content.uri) {
      const m = blobUrlMap.get(node.content.uri);
      if (m) node.content.uri = m;
    }
    if (node.children) node.children.forEach(replaceUris);
  };
  replaceUris(json.root);
  onProgress(100, t("success"));
  const blob = new Blob([JSON.stringify(json)], { type: "application/json" });
  return URL.createObjectURL(blob);
};

class SceneManager {
  constructor(canvas) {
    this.structureRoot = { id: "root", name: "Root", type: "Group", children: [] };
    this.componentCounter = 0;
    this.nodeMap = /* @__PURE__ */ new Map();
    this.componentMap = /* @__PURE__ */ new Map();
    this.tilesRenderer = null;
    this.lastSelectedUuid = null;
    this.measureType = "none";
    this.currentMeasurePoints = [];
    this.previewLine = null;
    this.measureRecords = /* @__PURE__ */ new Map();
    this.clippingPlanes = [];
    this.clipPlaneHelpers = [];
    this.sceneCenter = new THREE.Vector3();
    this.globalOffset = new THREE.Vector3();
    this.optimizedMapping = /* @__PURE__ */ new Map();
    this.settings = {
      ambientInt: 2,
      dirInt: 1,
      bgColor: "#1e1e1e",
      viewCubeSize: 100
    };
    this.sceneBounds = new THREE.Box3();
    this.precomputedBounds = new THREE.Box3();
    this.chunks = [];
    this.processingChunks = /* @__PURE__ */ new Set();
    this.frustum = new THREE.Frustum();
    this.projScreenMatrix = new THREE.Matrix4();
    this.logicTimer = 0;
    this.nbimFiles = /* @__PURE__ */ new Map();
    this.sharedMaterial = new THREE.MeshStandardMaterial({
      color: 16777215,
      roughness: 0.6,
      metalness: 0.1,
      side: THREE.DoubleSide
    });
    this.lastReportedProgress = { loaded: -1, total: -1 };
    this.canvas = canvas;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    this.dotTexture = this.createCircleTexture();
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      logarithmicDepthBuffer: true,
      precision: "highp",
      powerPreference: "high-performance"
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(width, height, false);
    this.renderer.setClearColor(this.settings.bgColor);
    this.renderer.localClippingEnabled = true;
    this.scene = new THREE.Scene();
    this.contentGroup = new THREE.Group();
    this.contentGroup.name = "Content";
    this.scene.add(this.contentGroup);
    this.helpersGroup = new THREE.Group();
    this.helpersGroup.name = "Helpers";
    this.scene.add(this.helpersGroup);
    this.measureGroup = new THREE.Group();
    this.measureGroup.name = "Measure";
    this.scene.add(this.measureGroup);
    this.ghostGroup = new THREE.Group();
    this.ghostGroup.name = "Ghost";
    this.scene.add(this.ghostGroup);
    this.clipHelpersGroup = new THREE.Group();
    this.clipHelpersGroup.name = "ClipHelpers";
    this.scene.add(this.clipHelpersGroup);
    const frustumSize = 100;
    const aspect = width / height;
    this.camera = new THREE.OrthographicCamera(
      frustumSize * aspect / -2,
      frustumSize * aspect / 2,
      frustumSize / 2,
      frustumSize / -2,
      0.1,
      2e5
    );
    this.camera.up.set(0, 0, 1);
    this.camera.position.set(1e3, 1e3, 1e3);
    this.camera.lookAt(0, 0, 0);
    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = false;
    this.controls.screenSpacePanning = true;
    this.controls.maxPolarAngle = Math.PI;
    this.ambientLight = new THREE.AmbientLight(16777215, this.settings.ambientInt);
    this.scene.add(this.ambientLight);
    this.dirLight = new THREE.DirectionalLight(16777215, this.settings.dirInt);
    this.dirLight.position.set(50, 50, 100);
    this.scene.add(this.dirLight);
    this.backLight = new THREE.DirectionalLight(16777215, 0.8);
    this.backLight.position.set(-50, -50, -10);
    this.scene.add(this.backLight);
    const box = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
    this.selectionBox = new THREE.Box3Helper(box, new THREE.Color(16776960));
    this.selectionBox.visible = false;
    this.helpersGroup.add(this.selectionBox);
    const highlightMat = new THREE.MeshBasicMaterial({
      color: 16755200,
      transparent: true,
      opacity: 0.4,
      depthTest: false,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    this.highlightMesh = new THREE.Mesh(new THREE.BufferGeometry(), highlightMat);
    this.highlightMesh.visible = false;
    this.highlightMesh.renderOrder = 999;
    this.helpersGroup.add(this.highlightMesh);
    const markerGeo = new THREE.BufferGeometry();
    markerGeo.setAttribute("position", new THREE.Float32BufferAttribute([0, 0, 0], 3));
    const markerMat = new THREE.PointsMaterial({
      color: 16711680,
      size: 8,
      sizeAttenuation: false,
      map: this.dotTexture,
      transparent: true,
      alphaTest: 0.5,
      depthTest: false
    });
    this.tempMarker = new THREE.Points(markerGeo, markerMat);
    this.tempMarker.visible = false;
    this.tempMarker.renderOrder = 1e3;
    this.helpersGroup.add(this.tempMarker);
    this.setupClipping();
    this.raycaster = new THREE.Raycaster();
    this.raycaster.params.Points.threshold = 10;
    if (!this.raycaster.params.Line) this.raycaster.params.Line = { threshold: 1 };
    this.raycaster.params.Line.threshold = 2;
    this.mouse = new THREE.Vector2();
    this.logicTimer = window.setInterval(() => {
      this.checkCullingAndLoad();
    }, 300);
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }
  // 全局导出接口
  static async batchConvert(files, t, filename, onProgress, libPath = "./libs") {
    const tempMgr = new SceneManager(document.createElement("canvas"));
    const total = files.length;
    for (let i = 0; i < total; i++) {
      const file = files[i];
      const pStart = i / total * 90;
      const pEnd = (i + 1) / total * 90;
      const loadedObjects = await loadModelFiles(
        [file],
        (p, msg) => {
          const globalP = pStart + p / 100 * (pEnd - pStart);
          if (onProgress) onProgress(globalP, msg || `${t("processing")} ${file.name}`);
        },
        t,
        tempMgr.settings,
        libPath
      );
      for (const obj of loadedObjects) {
        await tempMgr.addModel(obj, t);
      }
    }
    const allItems = collectItems$1(tempMgr.contentGroup);
    if (allItems.length === 0) {
      throw new Error(t("no_models"));
    }
    const sceneBounds = new THREE.Box3();
    allItems.forEach((item) => {
      if (!item.geometry.boundingBox) item.geometry.computeBoundingBox();
      const itemBox = item.geometry.boundingBox.clone().applyMatrix4(item.matrix);
      sceneBounds.union(itemBox);
    });
    tempMgr.sceneBounds.copy(sceneBounds);
    const octreeConfig = { maxItemsPerNode: 100, maxDepth: 8 };
    const octreeRoot = buildOctree$1(allItems, sceneBounds, octreeConfig);
    tempMgr.chunks = [];
    collectLeafNodes(octreeRoot, tempMgr.chunks);
    if (onProgress) onProgress(99, t("nbim_generating"));
    const blob = await tempMgr.exportNbim(t, filename, (p, msg) => {
      if (onProgress) onProgress(p, msg);
    });
    if (onProgress) onProgress(100, t("success"));
    tempMgr.dispose();
    return blob;
  }
  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    this.ambientLight.intensity = this.settings.ambientInt;
    this.dirLight.intensity = this.settings.dirInt;
    this.renderer.setClearColor(this.settings.bgColor);
    this.renderer.render(this.scene, this.camera);
  }
  createCircleTexture() {
    const size = 64;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext("2d");
    if (context) {
      context.beginPath();
      context.arc(size / 2, size / 2, size / 2 - 2, 0, 2 * Math.PI);
      context.fillStyle = "#ffffff";
      context.fill();
    }
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }
  animate() {
    requestAnimationFrame(this.animate);
    if (this.controls) this.controls.update();
    if (this.tilesRenderer) {
      this.camera.updateMatrixWorld();
      this.tilesRenderer.update();
    }
    this.updateCameraClipping();
    this.renderer.render(this.scene, this.camera);
  }
  updateCameraClipping() {
    if (!this.sceneBounds || this.sceneBounds.isEmpty()) return;
    const sphere = new THREE.Sphere();
    this.sceneBounds.getBoundingSphere(sphere);
    const dist = this.camera.position.distanceTo(sphere.center);
    const range = sphere.radius * 20 + dist;
    this.camera.near = -range;
    this.camera.far = range;
    this.camera.updateProjectionMatrix();
  }
  resize() {
    if (!this.canvas) return;
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;
    if (w === 0 || h === 0) return;
    const aspect = w / h;
    const cam = this.camera;
    const frustumHeight = cam.top - cam.bottom;
    const newWidth = frustumHeight * aspect;
    cam.left = -newWidth / 2;
    cam.right = newWidth / 2;
    cam.updateProjectionMatrix();
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(w, h, false);
    this.renderer.render(this.scene, this.camera);
  }
  checkCullingAndLoad() {
    if (this.chunks.length === 0) return;
    const loadedCount = this.chunks.filter((c) => c.loaded).length;
    const totalCount = this.chunks.length;
    if (this.onChunkProgress && (loadedCount !== this.lastReportedProgress.loaded || totalCount !== this.lastReportedProgress.total)) {
      this.lastReportedProgress = { loaded: loadedCount, total: totalCount };
      this.onChunkProgress(loadedCount, totalCount);
    }
    if (this.processingChunks.size >= 12) return;
    this.camera.updateMatrixWorld();
    this.projScreenMatrix.multiplyMatrices(this.camera.projectionMatrix, this.camera.matrixWorldInverse);
    this.frustum.setFromProjectionMatrix(this.projScreenMatrix);
    const padding = 0.2;
    const toLoad = [];
    const isClippingActive = this.renderer.clippingPlanes.length > 0;
    this.chunks.forEach((c) => {
      const paddedBounds = c.bounds.clone();
      const size = new THREE.Vector3();
      paddedBounds.getSize(size);
      paddedBounds.expandByVector(size.multiplyScalar(padding));
      const inFrustum = this.frustum.intersectsBox(paddedBounds);
      const isClipped = isClippingActive && this.isBoxClipped(c.bounds);
      const shouldBeVisible = inFrustum && !isClipped;
      if (c.loaded) {
        const optimizedGroup = this.contentGroup.getObjectByName(c.groupName);
        if (optimizedGroup) {
          const bm = optimizedGroup.getObjectByName(c.id);
          if (bm) bm.visible = shouldBeVisible;
        }
      } else if (!this.processingChunks.has(c.id) && shouldBeVisible) {
        toLoad.push(c);
      }
    });
    if (toLoad.length > 0) {
      toLoad.sort((a, b) => {
        const centerA = a.bounds.getCenter(new THREE.Vector3());
        const centerB = b.bounds.getCenter(new THREE.Vector3());
        return centerA.distanceToSquared(this.camera.position) - centerB.distanceToSquared(this.camera.position);
      });
      const batch = toLoad.slice(0, 6);
      batch.forEach((chunk) => this.loadChunk(chunk));
    }
  }
  async loadChunk(chunk) {
    this.processingChunks.add(chunk.id);
    try {
      let bm = null;
      if (chunk.node) {
        bm = createBatchedMeshFromItems(chunk.node.items, this.sharedMaterial);
      } else if (chunk.nbimFileId && this.nbimFiles.has(chunk.nbimFileId) && chunk.byteOffset) {
        const file = this.nbimFiles.get(chunk.nbimFileId);
        const buffer = await file.slice(chunk.byteOffset, chunk.byteOffset + chunk.byteLength).arrayBuffer();
        bm = this.parseChunkBinaryV7(buffer, this.sharedMaterial);
      }
      if (bm) {
        bm.name = chunk.id;
        bm.userData.chunkId = chunk.id;
        if (chunk.nbimFileId) {
          bm.position.sub(this.globalOffset);
          bm.updateMatrixWorld(true);
        }
        let optimizedGroup = this.contentGroup.getObjectByName(chunk.groupName);
        if (!optimizedGroup) {
          optimizedGroup = new THREE.Group();
          optimizedGroup.name = chunk.groupName;
          optimizedGroup.userData.isOptimizedGroup = true;
          optimizedGroup.userData.originalUuid = chunk.originalUuid;
          this.contentGroup.add(optimizedGroup);
        }
        optimizedGroup.add(bm);
        const batchIdToUuid = bm.userData.batchIdToUuid;
        const batchIdToColor = bm.userData.batchIdToColor;
        const batchIdToGeometry = bm.userData.batchIdToGeometry;
        if (batchIdToUuid) {
          for (const [batchId, originalUuid] of batchIdToUuid.entries()) {
            if (!this.optimizedMapping.has(originalUuid)) {
              this.optimizedMapping.set(originalUuid, []);
            }
            const originalColor = batchIdToColor?.get(batchId) ?? 16777215;
            const geometry = batchIdToGeometry?.get(batchId);
            this.optimizedMapping.get(originalUuid).push({
              mesh: bm,
              instanceId: batchId,
              originalColor,
              geometry
            });
          }
        }
      }
      chunk.loaded = true;
      const ghost = this.ghostGroup.getObjectByName(`ghost_${chunk.id}`);
      if (ghost) {
        this.ghostGroup.remove(ghost);
        if (ghost.geometry) ghost.geometry.dispose();
      }
    } catch (err) {
      console.error(`加载分块 ${chunk.id} 失败:`, err);
    } finally {
      this.processingChunks.delete(chunk.id);
    }
  }
  buildSceneGraph(object) {
    const node = {
      id: object.uuid,
      name: object.name || object.uuid,
      type: object.isMesh ? "Mesh" : "Group",
      children: [],
      userData: { ...object.userData },
      properties: object.userData?.properties
    };
    if (!this.nodeMap.has(object.uuid)) this.nodeMap.set(object.uuid, []);
    this.nodeMap.get(object.uuid).push(node);
    for (const child of object.children) {
      node.children.push(this.buildSceneGraph(child));
    }
    return node;
  }
  /**
   * 构建基于 IFC 图层和空间结构的复合树
   */
  /**
   * 构建基于 IFC 图层和空间结构的复合树
   */
  buildIFCStructure(object, t) {
    const buildSpatialRecursive = (obj) => {
      const node = {
        id: obj.uuid,
        name: obj.name || obj.isMesh ? `Mesh_${obj.id}` : `Group_${obj.id}`,
        type: obj.isMesh ? "Mesh" : "Group",
        children: [],
        bimId: obj.userData?.expressID,
        userData: { ...obj.userData },
        properties: obj.userData?.properties
      };
      if (!this.nodeMap.has(obj.uuid)) this.nodeMap.set(obj.uuid, []);
      this.nodeMap.get(obj.uuid).push(node);
      for (const child of obj.children) {
        node.children.push(buildSpatialRecursive(child));
      }
      return node;
    };
    const spatialRoot = buildSpatialRecursive(object);
    const layerMap = object.userData.layerMap;
    if (layerMap && layerMap.size > 0) {
      const layerRoot = {
        id: `layers_${object.uuid}`,
        name: "图层结构 (Layers)",
        type: "Group",
        children: [],
        userData: { originalUuid: object.uuid }
      };
      if (!this.nodeMap.has(layerRoot.id)) this.nodeMap.set(layerRoot.id, []);
      this.nodeMap.get(layerRoot.id).push(layerRoot);
      const layers = /* @__PURE__ */ new Map();
      object.traverse((child) => {
        if (child.isMesh && child.userData.expressID !== void 0) {
          const expressID = child.userData.expressID;
          const layerName = layerMap.get(expressID) || t("unclassified_layer");
          if (!layers.has(layerName)) {
            const lNode = {
              id: `layer_${layerName}_${object.uuid}`,
              name: layerName,
              type: "Group",
              children: [],
              userData: { originalUuid: object.uuid }
            };
            layers.set(layerName, lNode);
            if (!this.nodeMap.has(lNode.id)) this.nodeMap.set(lNode.id, []);
            this.nodeMap.get(lNode.id).push(lNode);
          }
          const layerNode = layers.get(layerName);
          const node = {
            id: child.uuid,
            name: child.name,
            type: "Mesh",
            bimId: expressID,
            userData: { ...child.userData },
            properties: child.userData?.properties
          };
          layerNode.children.push(node);
          if (!this.nodeMap.has(child.uuid)) this.nodeMap.set(child.uuid, []);
          this.nodeMap.get(child.uuid).push(node);
        }
      });
      layerRoot.children = Array.from(layers.values());
      if (layerRoot.children.length > 0) {
        const compositeRoot = {
          id: `composite_${object.uuid}`,
          name: object.name || "IFC Model",
          type: "Group",
          children: [spatialRoot, layerRoot],
          userData: { originalUuid: object.uuid }
        };
        if (!this.nodeMap.has(compositeRoot.id)) this.nodeMap.set(compositeRoot.id, []);
        this.nodeMap.get(compositeRoot.id).push(compositeRoot);
        return compositeRoot;
      }
    }
    return spatialRoot;
  }
  async addModel(object, t, onProgress) {
    object.updateMatrixWorld(true);
    const modelBox = new THREE.Box3().setFromObject(object);
    if (!modelBox.isEmpty()) {
      if (this.globalOffset.length() === 0) {
        modelBox.getCenter(this.globalOffset);
        console.log("初始化全局偏移以解决大坐标问题:", this.globalOffset);
      }
      object.position.sub(this.globalOffset);
      object.updateMatrixWorld(true);
    }
    if (onProgress) onProgress(5, t("preparing_scene"));
    let modelRoot;
    if (object.userData.isIFC) {
      modelRoot = this.buildIFCStructure(object, t);
    } else {
      modelRoot = this.buildSceneGraph(object);
    }
    const markOriginalUuid = (node) => {
      if (!node.userData) node.userData = {};
      node.userData.originalUuid = object.uuid;
      if (node.children) node.children.forEach(markOriginalUuid);
    };
    markOriginalUuid(modelRoot);
    if (modelRoot.name === "Root" && modelRoot.children && modelRoot.children.length > 0) {
      if (!this.structureRoot.children) this.structureRoot.children = [];
      this.structureRoot.children.push(...modelRoot.children);
    } else {
      if (!this.structureRoot.children) this.structureRoot.children = [];
      this.structureRoot.children.push(modelRoot);
    }
    modelBox.setFromObject(object);
    if (!modelBox.isEmpty()) {
      this.precomputedBounds.union(modelBox);
      this.sceneBounds.copy(this.precomputedBounds);
    }
    const maxAnisotropy = this.renderer.capabilities.getMaxAnisotropy();
    object.traverse((child) => {
      if (child.isMesh) {
        const mesh = child;
        this.componentMap.set(mesh.uuid, mesh);
        if (mesh.userData.expressID !== void 0) {
          this.componentMap.set(mesh.userData.expressID, mesh);
        }
        if (mesh.material) {
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          materials.forEach((mat) => {
            if (mat.map) mat.map.anisotropy = maxAnisotropy;
          });
        }
      }
    });
    if (onProgress) onProgress(80, t("analyzing"));
    const box = new THREE.Box3().setFromObject(object);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    if (maxDim > 50) {
      const items = collectItems$1(object);
      const octree = buildOctree$1(items, box, { maxItemsPerNode: 200, maxDepth: 5 });
      const leaves = [];
      collectLeafNodes(octree, leaves);
      leaves.forEach((node, idx) => {
        this.chunks.push({
          id: `chunk_${object.uuid}_${idx}`,
          bounds: node.bounds.clone(),
          loaded: true,
          // 原始模型已在场景中，标记为已加载
          node,
          groupName: `file_${object.uuid}`,
          originalUuid: object.uuid
        });
      });
    } else {
      const items = collectItems$1(object);
      this.chunks.push({
        id: `chunk_${object.uuid}_single`,
        bounds: box.clone(),
        loaded: true,
        node: { items, bounds: box.clone(), children: null, level: 0 },
        groupName: `file_${object.uuid}`,
        originalUuid: object.uuid
      });
    }
    const fileGroup = new THREE.Group();
    fileGroup.name = `file_${object.uuid}`;
    fileGroup.userData.originalUuid = object.uuid;
    fileGroup.add(object);
    object.visible = true;
    this.contentGroup.add(fileGroup);
    this.sceneBounds = this.computeTotalBounds(false);
    this.precomputedBounds = this.sceneBounds.clone();
    if (this.globalOffset.length() > 0) {
      this.precomputedBounds.translate(this.globalOffset);
    }
    this.updateSettings(this.settings);
    if (onProgress) onProgress(100, t("fitting_view"));
    this.fitView();
    if (onProgress) onProgress(100, t("model_loaded"));
  }
  removeObject(uuid) {
    const nodes = this.nodeMap.get(uuid);
    const originalUuid = nodes?.[0]?.userData?.originalUuid || uuid;
    const optimizedGroupsToRemove = [];
    this.contentGroup.traverse((child) => {
      const isMatch = child.name === `optimized_${uuid}` || child.name === `file_${uuid}` || child.userData.originalUuid === uuid || child.userData.originalUuid === originalUuid || child.name.startsWith("optimized_") && (child.userData.originalUuid === uuid || child.userData.originalUuid === originalUuid) || child.name.startsWith("file_") && (child.userData.originalUuid === uuid || child.userData.originalUuid === originalUuid);
      if (isMatch) {
        optimizedGroupsToRemove.push(child);
      }
    });
    optimizedGroupsToRemove.forEach((group) => {
      group.traverse((child) => {
        if (child.isBatchedMesh) {
          const bm = child;
          if (bm.geometry) bm.geometry.dispose();
          if (bm.material) {
            const materials = Array.isArray(bm.material) ? bm.material : [bm.material];
            materials.forEach((m) => m.dispose());
          }
        }
      });
      group.removeFromParent();
    });
    const obj = this.contentGroup.getObjectByProperty("uuid", uuid);
    const processRemoval = (o) => {
      const id = o instanceof THREE.Object3D ? o.uuid : o.id;
      const mappings = this.optimizedMapping.get(id);
      if (mappings) {
        mappings.forEach((m) => {
          m.mesh.setVisibleAt(m.instanceId, false);
        });
        this.optimizedMapping.delete(id);
      }
      if (o instanceof THREE.Mesh) {
        if (o.geometry) o.geometry.dispose();
        if (o.material) {
          const materials = Array.isArray(o.material) ? o.material : [o.material];
          materials.forEach((m) => m.dispose());
        }
      }
      this.componentMap.delete(id);
      if (o instanceof THREE.Object3D && o.userData.expressID !== void 0) {
        this.componentMap.delete(o.userData.expressID);
      }
      const nodeInfos = this.nodeMap.get(id);
      if (nodeInfos) {
        nodeInfos.forEach((nodeInfo) => {
          if (nodeInfo.bimId !== void 0) {
            this.componentMap.delete(String(nodeInfo.bimId));
          }
        });
      }
      this.nodeMap.delete(id);
    };
    if (obj) {
      obj.traverse(processRemoval);
      obj.removeFromParent();
    } else if (nodes && nodes.length > 0) {
      const traverseNode = (n) => {
        processRemoval(n);
        if (n.children) n.children.forEach(traverseNode);
      };
      traverseNode(nodes[0]);
    }
    this.chunks = this.chunks.filter((c) => {
      const isMatch = c.originalUuid === uuid || c.originalUuid === originalUuid || c.id.startsWith(uuid);
      if (isMatch) {
        const ghost = this.ghostGroup.getObjectByName(`ghost_${c.id}`);
        if (ghost) {
          this.ghostGroup.remove(ghost);
          if (ghost.geometry) ghost.geometry.dispose();
        }
        return false;
      }
      return true;
    });
    if (this.structureRoot) {
      const filterNodes = (nodes2) => {
        return nodes2.filter((n) => {
          if (n.id === uuid) return false;
          if (!this.nodeMap.has(n.id) && n.id !== "root") return false;
          if (n.children) {
            n.children = filterNodes(n.children);
          }
          return true;
        });
      };
      if (this.structureRoot.id === uuid) {
        this.structureRoot = { id: "root", name: "Root", type: "Group", children: [] };
      } else if (this.structureRoot.children) {
        this.structureRoot.children = filterNodes(this.structureRoot.children);
      }
    }
    this.precomputedBounds = this.computeTotalBounds();
    if (this.precomputedBounds.isEmpty()) {
      this.contentGroup.traverse((child) => {
        if (child.isMesh && child.visible) {
          const box = new THREE.Box3().setFromObject(child);
          if (!box.isEmpty()) this.precomputedBounds.union(box);
        }
      });
    }
    this.updateSceneBounds();
    if (this.onStructureUpdate) this.onStructureUpdate();
    return true;
  }
  async removeModel(uuid) {
    return this.removeObject(uuid);
  }
  addTileset(url, t, onProgress) {
    if (this.tilesRenderer) {
      this.tilesRenderer.dispose();
      this.contentGroup.remove(this.tilesRenderer.group);
    }
    if (onProgress) onProgress(10, t("tileset_initializing"));
    const renderer = new TilesRenderer(url);
    renderer.setCamera(this.camera);
    renderer.setResolutionFromRenderer(this.camera, this.renderer);
    renderer.errorTarget = 16;
    renderer.lruCache.maxSize = 500 * 1024 * 1024;
    renderer.group.name = "3D Tileset";
    let loadedTiles = 0;
    let hasError = false;
    renderer.onLoadTileSet = () => {
      if (onProgress) onProgress(50, t("tileset_structure_loaded"));
    };
    renderer.onLoadModel = () => {
      loadedTiles++;
      if (onProgress && !hasError) {
        onProgress(Math.min(99, 50 + loadedTiles), `${t("tileset_tile_loaded")}${loadedTiles}`);
      }
    };
    setTimeout(() => {
      if (!renderer.tileset && !hasError) {
        hasError = true;
        if (onProgress) onProgress(0, t("tileset_load_failed"));
      }
    }, 1e4);
    renderer.onLoadTile = (tile) => {
      if (this.onTilesUpdate) this.onTilesUpdate();
    };
    renderer.onDisposeTile = (tile) => {
      if (this.onTilesUpdate) this.onTilesUpdate();
    };
    this.contentGroup.add(renderer.group);
    this.tilesRenderer = renderer;
    renderer.group.position.copy(this.globalOffset.clone().negate());
    renderer.group.name = "3D Tileset";
    const buildTilesTree = (tile, depth = 0) => {
      const node = {
        id: tile.content?.uuid || THREE.MathUtils.generateUUID(),
        name: tile.content?.name || `Tile_${tile.level}_${tile.x || 0}_${tile.y || 0}`,
        type: "Group",
        children: []
      };
      if (tile.children) {
        node.children = tile.children.map((c) => buildTilesTree(c, depth + 1));
      }
      return node;
    };
    const tilesNode = {
      id: renderer.group.uuid,
      name: "3D Tileset",
      type: "Group",
      children: renderer.tileset ? [buildTilesTree(renderer.tileset.root)] : []
    };
    if (!this.structureRoot.children) this.structureRoot.children = [];
    this.structureRoot.children.push(tilesNode);
    this.nodeMap.set(tilesNode.id, [tilesNode]);
    this.updateSceneBounds();
    this.updateSettings(this.settings);
    return renderer.group;
  }
  // --- 辅助功能 (对齐 refs) ---
  getTypeIndex(type) {
    const types = ["Generic", "Column", "Beam", "Slab", "Wall", "Window", "Door", "Pipe", "Duct"];
    const idx = types.indexOf(type);
    return idx === -1 ? 0 : idx;
  }
  guessType(name) {
    const n = name.toLowerCase();
    if (n.includes("col") || n.includes("柱")) return "Column";
    if (n.includes("beam") || n.includes("梁")) return "Beam";
    if (n.includes("slab") || n.includes("板")) return "Slab";
    if (n.includes("wall") || n.includes("墙")) return "Wall";
    if (n.includes("window") || n.includes("窗")) return "Window";
    if (n.includes("door") || n.includes("门")) return "Door";
    return "Generic";
  }
  extractColor(mesh) {
    if (mesh.userData.color !== void 0) return mesh.userData.color;
    const geo = mesh.geometry;
    if (geo && geo.attributes.color) {
      const colorAttr = geo.attributes.color;
      if (colorAttr.count > 0) {
        const r = colorAttr.getX(0);
        const g = colorAttr.getY(0);
        const b = colorAttr.getZ(0);
        const color = new THREE.Color();
        if (r > 1 || g > 1 || b > 1) color.setRGB(r / 255, g / 255, b / 255);
        else color.setRGB(r, g, b);
        return color.getHex();
      }
    }
    const material = mesh.material;
    if (Array.isArray(material)) {
      for (const mat of material) {
        if (mat.color) return mat.color.getHex();
      }
    } else if (material.color) {
      return material.color.getHex();
    }
    return this.getColorByComponentType(mesh.name);
  }
  getColorByComponentType(name) {
    const n = name.toLowerCase();
    if (n.includes("col") || n.includes("柱")) return 12573694;
    if (n.includes("beam") || n.includes("梁")) return 9684477;
    if (n.includes("slab") || n.includes("板")) return 15067115;
    if (n.includes("wall") || n.includes("墙")) return 15987958;
    return 9741240;
  }
  // --- NBIM 导入/导出功能 (对齐 refs V7 逻辑) ---
  generateChunkBinaryV7(items) {
    const uniqueGeos = [];
    const geoMap = /* @__PURE__ */ new Map();
    items.forEach((item) => {
      if (item.geometry && !geoMap.has(item.geometry)) {
        geoMap.set(item.geometry, uniqueGeos.length);
        uniqueGeos.push(item.geometry);
      }
    });
    let size = 4;
    for (const geo of uniqueGeos) {
      const vertCount = geo.attributes.position.count;
      const index = geo.index;
      const indexCount = index ? index.count : 0;
      size += 4 + 4 + vertCount * 12 + vertCount * 12;
      if (indexCount > 0) size += indexCount * 4;
    }
    size += 4;
    size += items.length * (4 + 4 + 4 + 64 + 4);
    const buffer = new ArrayBuffer(size);
    const dv = new DataView(buffer);
    let offset = 0;
    dv.setUint32(offset, uniqueGeos.length, true);
    offset += 4;
    for (const geo of uniqueGeos) {
      const pos = geo.getAttribute("position");
      const norm = geo.getAttribute("normal");
      const count = pos.count;
      const index = geo.index;
      const indexCount = index ? index.count : 0;
      dv.setUint32(offset, count, true);
      offset += 4;
      dv.setUint32(offset, indexCount, true);
      offset += 4;
      for (let i = 0; i < count; i++) {
        dv.setFloat32(offset, pos.getX(i), true);
        offset += 4;
        dv.setFloat32(offset, pos.getY(i), true);
        offset += 4;
        dv.setFloat32(offset, pos.getZ(i), true);
        offset += 4;
      }
      for (let i = 0; i < count; i++) {
        dv.setFloat32(offset, norm.getX(i), true);
        offset += 4;
        dv.setFloat32(offset, norm.getY(i), true);
        offset += 4;
        dv.setFloat32(offset, norm.getZ(i), true);
        offset += 4;
      }
      if (index && indexCount > 0) {
        for (let i = 0; i < indexCount; i++) {
          dv.setUint32(offset, index.getX(i), true);
          offset += 4;
        }
      }
    }
    dv.setUint32(offset, items.length, true);
    offset += 4;
    for (const item of items) {
      const treeNodes = this.nodeMap.get(item.uuid);
      const firstNode = treeNodes?.[0];
      let id = item.expressID ?? firstNode?.bimId;
      if (id === void 0) {
        if (!this.componentMap.has(item.uuid)) {
          this.componentMap.set(item.uuid, ++this.componentCounter);
        }
        id = this.componentMap.get(item.uuid);
        if (firstNode) firstNode.bimId = id;
      }
      const typeStr = this.guessType(firstNode?.name || "");
      dv.setUint32(offset, id, true);
      offset += 4;
      dv.setUint32(offset, this.getTypeIndex(typeStr), true);
      offset += 4;
      dv.setUint32(offset, item.color, true);
      offset += 4;
      const elements = item.matrix.elements;
      for (let k = 0; k < 16; k++) {
        dv.setFloat32(offset, elements[k], true);
        offset += 4;
      }
      const geoId = geoMap.get(item.geometry) || 0;
      dv.setUint32(offset, geoId, true);
      offset += 4;
    }
    return buffer;
  }
  parseChunkBinaryV7(buffer, material) {
    const dv = new DataView(buffer);
    let offset = 0;
    const geoCount = dv.getUint32(offset, true);
    offset += 4;
    const geometries = [];
    for (let i = 0; i < geoCount; i++) {
      const vertCount = dv.getUint32(offset, true);
      offset += 4;
      const indexCount = dv.getUint32(offset, true);
      offset += 4;
      const posArr = new Float32Array(buffer, offset, vertCount * 3);
      offset += vertCount * 12;
      const normArr = new Float32Array(buffer, offset, vertCount * 3);
      offset += vertCount * 12;
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(posArr), 3));
      geo.setAttribute("normal", new THREE.BufferAttribute(new Float32Array(normArr), 3));
      if (indexCount > 0) {
        const indexArr = new Uint32Array(buffer, offset, indexCount);
        offset += indexCount * 4;
        geo.setIndex(new THREE.BufferAttribute(new Uint32Array(indexArr), 1));
      }
      geometries.push(geo);
    }
    const instanceCount = dv.getUint32(offset, true);
    offset += 4;
    let totalVerts = 0;
    let totalIndices = 0;
    geometries.forEach((g) => {
      totalVerts += g.attributes.position.count;
      if (g.index) totalIndices += g.index.count;
    });
    const bm = new THREE.BatchedMesh(instanceCount, totalVerts, totalIndices, material);
    const geoIds = geometries.map((g) => bm.addGeometry(g));
    const matrix = new THREE.Matrix4();
    const color = new THREE.Color();
    const batchIdToUuid = /* @__PURE__ */ new Map();
    const batchIdToColor = /* @__PURE__ */ new Map();
    const batchIdToGeometry = /* @__PURE__ */ new Map();
    for (let i = 0; i < instanceCount; i++) {
      const bimId = dv.getUint32(offset, true);
      offset += 4;
      dv.getUint32(offset, true);
      offset += 4;
      const hex = dv.getUint32(offset, true);
      offset += 4;
      color.setHex(hex);
      for (let k = 0; k < 16; k++) {
        matrix.elements[k] = dv.getFloat32(offset, true);
        offset += 4;
      }
      const geoIdx = dv.getUint32(offset, true);
      offset += 4;
      const instId = bm.addInstance(geoIds[geoIdx]);
      bm.setMatrixAt(instId, matrix);
      bm.setColorAt(instId, color);
      const bimStr = bimId.toString();
      const nodes = this.nodeMap.get(bimStr);
      const actualUuid = nodes?.[0]?.id || bimStr;
      batchIdToUuid.set(instId, actualUuid);
      batchIdToColor.set(instId, hex);
      batchIdToGeometry.set(instId, geometries[geoIdx]);
    }
    bm.userData.batchIdToUuid = batchIdToUuid;
    bm.userData.batchIdToColor = batchIdToColor;
    bm.userData.batchIdToGeometry = batchIdToGeometry;
    return bm;
  }
  async exportNbim(t, filename, onProgress) {
    if (this.chunks.length === 0) throw new Error(t("no_models"));
    const chunkBlobs = [];
    const exportChunks = this.chunks.map((c) => ({
      id: c.id,
      bounds: {
        min: { x: c.bounds.min.x, y: c.bounds.min.y, z: c.bounds.min.z },
        max: { x: c.bounds.max.x, y: c.bounds.max.y, z: c.bounds.max.z }
      },
      byteOffset: 0,
      byteLength: 0
    }));
    let currentOffset = 1024;
    for (let i = 0; i < this.chunks.length; i++) {
      const chunk = this.chunks[i];
      const exportChunk = exportChunks[i];
      if (onProgress) {
        const p = 90 + i / this.chunks.length * 9;
        onProgress(p, `${t("processing_chunk")} ${i + 1}/${this.chunks.length}`);
      }
      let buffer;
      if (chunk.node) {
        buffer = this.generateChunkBinaryV7(chunk.node.items);
      } else if (chunk.nbimFileId && this.nbimFiles.has(chunk.nbimFileId) && chunk.byteOffset) {
        const file = this.nbimFiles.get(chunk.nbimFileId);
        buffer = await file.slice(chunk.byteOffset, chunk.byteOffset + chunk.byteLength).arrayBuffer();
      } else {
        continue;
      }
      const uint8 = new Uint8Array(buffer);
      chunkBlobs.push(uint8);
      exportChunk.byteOffset = currentOffset;
      exportChunk.byteLength = uint8.byteLength;
      currentOffset += uint8.byteLength;
    }
    const optimizeNodeNaming = (node) => {
      if (!node.name || node.name === node.id) {
        const cleanId = String(node.bimId !== void 0 ? node.bimId : node.id);
        node.name = cleanId.replace(/^bim_/, "");
      }
      if (node.children) {
        node.children.forEach(optimizeNodeNaming);
      }
    };
    optimizeNodeNaming(this.structureRoot);
    const manifest = {
      globalBounds: {
        min: { x: this.sceneBounds.min.x, y: this.sceneBounds.min.y, z: this.sceneBounds.min.z },
        max: { x: this.sceneBounds.max.x, y: this.sceneBounds.max.y, z: this.sceneBounds.max.z }
      },
      chunks: exportChunks,
      structureTree: this.structureRoot
    };
    const getCircularReplacer = () => {
      const seen = /* @__PURE__ */ new WeakSet();
      return (key, value) => {
        if (key === "object" || key === "userData") return void 0;
        if (typeof value === "object" && value !== null) {
          if (seen.has(value)) {
            return;
          }
          seen.add(value);
        }
        return value;
      };
    };
    const manifestStr = JSON.stringify(manifest, getCircularReplacer());
    const manifestBytes = new TextEncoder().encode(manifestStr);
    const header = new ArrayBuffer(1024);
    const dv = new DataView(header);
    dv.setUint32(0, 1296646734, true);
    dv.setUint32(4, 7, true);
    dv.setUint32(8, currentOffset, true);
    dv.setUint32(12, manifestBytes.byteLength, true);
    const blobParts = [header, ...chunkBlobs, manifestBytes];
    const finalBlob = new Blob(blobParts, { type: "application/octet-stream" });
    if (filename) {
      const url = URL.createObjectURL(finalBlob);
      const a = document.createElement("a");
      a.href = url;
      const finalName = filename.endsWith(".nbim") ? filename : `${filename}.nbim`;
      a.download = finalName;
      a.click();
      URL.revokeObjectURL(url);
    }
    return finalBlob;
  }
  async loadNbim(file, t, onProgress) {
    const fileId = `nbim_${file.name}_${(/* @__PURE__ */ new Date()).getTime()}`;
    this.nbimFiles.set(fileId, file);
    if (onProgress) onProgress(10, t("nbim_parsing_header"));
    const headerBuffer = await file.slice(0, 1024).arrayBuffer();
    const dv = new DataView(headerBuffer);
    const magic = dv.getUint32(0, true);
    if (magic !== 1296646734) throw new Error(t("error_invalid_nbim"));
    const manifestOffset = dv.getUint32(8, true);
    const manifestLen = dv.getUint32(12, true);
    if (onProgress) onProgress(20, t("nbim_reading_metadata"));
    const manifestBlob = file.slice(manifestOffset, manifestOffset + manifestLen);
    const manifestText = await manifestBlob.text();
    const manifest = JSON.parse(manifestText);
    if (manifest.globalBounds) {
      const newBounds = new THREE.Box3(
        new THREE.Vector3(manifest.globalBounds.min.x, manifest.globalBounds.min.y, manifest.globalBounds.min.z),
        new THREE.Vector3(manifest.globalBounds.max.x, manifest.globalBounds.max.y, manifest.globalBounds.max.z)
      );
      if (this.globalOffset.length() === 0) {
        newBounds.getCenter(this.globalOffset);
        console.log("初始化全局偏移 (NBIM):", this.globalOffset);
      }
      if (this.precomputedBounds.isEmpty()) {
        this.precomputedBounds.copy(newBounds);
      } else {
        this.precomputedBounds.union(newBounds);
      }
      this.sceneBounds.copy(this.precomputedBounds);
    }
    const modelRoot = manifest.structureTree;
    if (!this.structureRoot.children) this.structureRoot.children = [];
    if (modelRoot) {
      if (modelRoot.children && modelRoot.name === "Root") {
        this.structureRoot.children.push(...modelRoot.children);
      } else {
        this.structureRoot.children.push(modelRoot);
      }
    }
    const rootId = modelRoot?.id || fileId;
    const fileGroup = new THREE.Group();
    fileGroup.name = `file_${rootId}`;
    fileGroup.userData.originalUuid = rootId;
    this.contentGroup.add(fileGroup);
    if (modelRoot) {
      const traverse = (node) => {
        if (!node.userData) node.userData = {};
        node.userData.originalUuid = rootId;
        if (!this.nodeMap.has(node.id)) this.nodeMap.set(node.id, []);
        this.nodeMap.get(node.id).push(node);
        if (node.bimId !== void 0) {
          const bimStr = String(node.bimId);
          if (!this.nodeMap.has(bimStr)) this.nodeMap.set(bimStr, []);
          if (!this.nodeMap.get(bimStr).includes(node)) {
            this.nodeMap.get(bimStr).push(node);
          }
        }
        if (node.children) node.children.forEach(traverse);
      };
      traverse(modelRoot);
    }
    if (onProgress) onProgress(30, t("nbim_initializing_chunks"));
    const boxGeo = new THREE.BoxGeometry(1, 1, 1);
    const boxMat = new THREE.LineBasicMaterial({ color: 4674921, transparent: true, opacity: 0.3 });
    manifest.chunks.forEach((c) => {
      const bounds = new THREE.Box3(
        new THREE.Vector3(c.bounds.min.x, c.bounds.min.y, c.bounds.min.z),
        new THREE.Vector3(c.bounds.max.x, c.bounds.max.y, c.bounds.max.z)
      );
      if (this.globalOffset.length() > 0) {
        bounds.translate(this.globalOffset.clone().negate());
      }
      const chunkId = c.id;
      this.chunks.push({
        id: chunkId,
        bounds,
        loaded: false,
        byteOffset: c.byteOffset,
        byteLength: c.byteLength,
        nbimFileId: fileId,
        groupName: `optimized_${rootId}`,
        originalUuid: rootId
      });
      const size = new THREE.Vector3();
      bounds.getSize(size);
      const center = new THREE.Vector3();
      bounds.getCenter(center);
      const edges = new THREE.LineSegments(
        new THREE.EdgesGeometry(boxGeo),
        boxMat
      );
      edges.name = `ghost_${chunkId}`;
      edges.scale.copy(size);
      edges.position.copy(center);
      this.ghostGroup.add(edges);
    });
    this.fitView();
    if (onProgress) onProgress(100, "NBIM 已就绪，正在按需加载...");
  }
  async clear() {
    console.log("开始清空场景...");
    try {
      this.lastSelectedUuid = null;
      this.highlightObject(null);
      const disposeObject = (obj) => {
        if (obj.isMesh) {
          const mesh = obj;
          if (mesh.geometry) mesh.geometry.dispose();
          if (mesh.material) {
            const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            materials.forEach((m) => m.dispose());
          }
        } else if (obj.isBatchedMesh) {
          const bm = obj;
          if (bm.geometry) bm.geometry.dispose();
          if (bm.material) {
            const materials = Array.isArray(bm.material) ? bm.material : [bm.material];
            materials.forEach((m) => m.dispose());
          }
        }
      };
      this.contentGroup.traverse(disposeObject);
      while (this.contentGroup.children.length > 0) {
        this.contentGroup.remove(this.contentGroup.children[0]);
      }
      if (this.tilesRenderer) {
        this.tilesRenderer.dispose();
        this.tilesRenderer = null;
      }
      this.ghostGroup.children.forEach(disposeObject);
      this.ghostGroup.clear();
      this.selectionBox.visible = false;
      this.highlightMesh.visible = false;
      this.clearAllMeasurements();
      this.optimizedMapping.clear();
      this.sceneBounds.makeEmpty();
      this.precomputedBounds.makeEmpty();
      this.nbimFiles.clear();
      this.structureRoot = { id: "root", name: "Root", type: "Group", children: [] };
      this.nodeMap.clear();
      this.chunks = [];
      this.componentMap.clear();
      this.componentCounter = 0;
      this.globalOffset.set(0, 0, 0);
      console.log("场景已清空");
    } catch (error) {
      console.error("清空场景失败:", error);
      throw error;
    }
  }
  setObjectVisibility(uuid, visible) {
    const nodes = this.nodeMap.get(uuid);
    if (nodes) {
      nodes.forEach((node) => {
        const setVisibleRecursive = (n) => {
          n.visible = visible;
          if (n.children) n.children.forEach(setVisibleRecursive);
          const otherNodes = this.nodeMap.get(n.id);
          if (otherNodes) {
            otherNodes.forEach((on) => on.visible = visible);
          }
        };
        setVisibleRecursive(node);
      });
    }
    const obj = this.contentGroup.getObjectByProperty("uuid", uuid);
    if (!obj) {
      if (nodes && nodes.length > 0) {
        const updateMappingsRecursive = (n) => {
          const mappings = this.optimizedMapping.get(n.id);
          if (mappings) {
            mappings.forEach((m) => {
              m.mesh.setVisibleAt(m.instanceId, visible);
            });
          }
          if (n.children) n.children.forEach(updateMappingsRecursive);
        };
        updateMappingsRecursive(nodes[0]);
      }
      return;
    }
    obj.traverse((o) => {
      if (o.name !== "Helpers" && o.name !== "Measure") {
        if (o.isMesh && o.userData.isOptimized) {
          o.visible = false;
        } else {
          o.visible = visible;
        }
        const mappings = this.optimizedMapping.get(o.uuid);
        if (mappings) {
          mappings.forEach((m) => {
            m.mesh.setVisibleAt(m.instanceId, visible);
          });
        }
      }
    });
    this.updateSceneBounds();
  }
  highlightObject(uuid) {
    if (this.lastSelectedUuid === uuid) return;
    if (this.lastSelectedUuid) {
      const prevMappings = this.optimizedMapping.get(this.lastSelectedUuid);
      if (prevMappings) {
        prevMappings.forEach((m) => {
          m.mesh.setColorAt(m.instanceId, new THREE.Color(m.originalColor));
          if (m.mesh.instanceColor) m.mesh.instanceColor.needsUpdate = true;
        });
      }
    } else {
      this.optimizedMapping.forEach((mappings2) => {
        mappings2.forEach((m) => {
          m.mesh.setColorAt(m.instanceId, new THREE.Color(m.originalColor));
          if (m.mesh.instanceColor) m.mesh.instanceColor.needsUpdate = true;
        });
      });
    }
    this.selectionBox.visible = false;
    this.highlightMesh.visible = false;
    this.lastSelectedUuid = uuid;
    if (!uuid) {
      if (this.onSelectionChange) this.onSelectionChange(null, null);
      return;
    }
    const mappings = this.optimizedMapping.get(uuid);
    if (mappings && mappings.length > 0) {
      mappings.forEach((m2) => {
        m2.mesh.setColorAt(m2.instanceId, new THREE.Color(16755200));
        if (m2.mesh.instanceColor) m2.mesh.instanceColor.needsUpdate = true;
      });
      const m = mappings[0];
      if (m.geometry) {
        this.highlightMesh.geometry = m.geometry;
        const matrix = new THREE.Matrix4();
        m.mesh.getMatrixAt(m.instanceId, matrix);
        matrix.premultiply(m.mesh.matrixWorld);
        const worldPos = new THREE.Vector3();
        const worldQuat = new THREE.Quaternion();
        const worldScale = new THREE.Vector3();
        matrix.decompose(worldPos, worldQuat, worldScale);
        if (!m.geometry.boundingBox) m.geometry.computeBoundingBox();
        const center = new THREE.Vector3();
        m.geometry.boundingBox.getCenter(center);
        if (center.length() > 1e4) {
          this.highlightMesh.position.set(0, 0, 0);
          const pureRotationMatrix = matrix.clone().setPosition(0, 0, 0);
          pureRotationMatrix.decompose(worldPos, worldQuat, worldScale);
          this.highlightMesh.quaternion.copy(worldQuat);
          this.highlightMesh.scale.copy(worldScale);
          const bmPos = new THREE.Vector3();
          const bmQuat = new THREE.Quaternion();
          const bmScale = new THREE.Vector3();
          m.mesh.matrixWorld.decompose(bmPos, bmQuat, bmScale);
          this.highlightMesh.position.add(bmPos);
        } else {
          this.highlightMesh.position.copy(worldPos);
          this.highlightMesh.quaternion.copy(worldQuat);
          this.highlightMesh.scale.copy(worldScale);
        }
        this.highlightMesh.visible = true;
      }
    }
    const obj = this.contentGroup.getObjectByProperty("uuid", uuid);
    if (obj) {
      if (obj.isMesh) {
        const mesh = obj;
        this.highlightMesh.geometry = mesh.geometry;
        obj.updateMatrixWorld(true);
        const worldPos = new THREE.Vector3();
        const worldQuat = new THREE.Quaternion();
        const worldScale = new THREE.Vector3();
        obj.matrixWorld.decompose(worldPos, worldQuat, worldScale);
        this.highlightMesh.position.copy(worldPos);
        this.highlightMesh.quaternion.copy(worldQuat);
        this.highlightMesh.scale.copy(worldScale);
        this.highlightMesh.visible = true;
      } else {
        const box = new THREE.Box3();
        if (obj.userData.boundingBox) {
          box.copy(obj.userData.boundingBox).applyMatrix4(obj.matrixWorld);
        } else {
          box.setFromObject(obj);
        }
        if (!box.isEmpty()) {
          this.selectionBox.box.copy(box);
          this.selectionBox.visible = true;
        }
      }
    }
    if (this.onSelectionChange) {
      let selectedObj = obj;
      if (mappings) {
        const nodes = this.nodeMap.get(uuid);
        const firstNode = nodes?.[0];
        selectedObj = {
          uuid,
          isOptimized: true,
          name: firstNode?.name || uuid,
          type: firstNode?.type || "Mesh",
          properties: firstNode?.properties,
          // 附加属性
          userData: firstNode?.userData || {}
        };
        if (mappings[0].geometry) {
          if (!mappings[0].geometry.boundingBox) mappings[0].geometry.computeBoundingBox();
          selectedObj.userData.boundingBox = mappings[0].geometry.boundingBox;
        }
      }
      this.onSelectionChange(uuid, selectedObj);
    }
  }
  pick(clientX, clientY) {
    const intersect = this.getRayIntersects(clientX, clientY);
    if (!intersect) return null;
    return { object: intersect.object, intersect };
  }
  getRayIntersects(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = (clientX - rect.left) / rect.width * 2 - 1;
    this.mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const interactables = [];
    this.contentGroup.traverse((o) => {
      if (o.visible && (o.isMesh || o.isBatchedMesh)) {
        if (o.userData.isOptimized) return;
        interactables.push(o);
      }
    });
    const intersects = this.raycaster.intersectObjects(interactables, false);
    if (intersects.length > 0) {
      const hit = intersects[0];
      if (hit.object.isBatchedMesh) {
        const bm = hit.object;
        const batchId = hit.batchId !== void 0 ? hit.batchId : hit.instanceId;
        if (batchId !== void 0) {
          const originalUuid = bm.userData.batchIdToUuid?.get(batchId);
          if (originalUuid) {
            const originalObj = this.contentGroup.getObjectByProperty("uuid", originalUuid);
            if (originalObj) {
              hit.object = originalObj;
            } else {
              const nodes = this.nodeMap.get(originalUuid);
              const node = nodes?.[0];
              const proxy = new THREE.Object3D();
              proxy.uuid = originalUuid;
              if (node) {
                proxy.name = node.name;
                proxy.type = node.type;
                proxy.isMesh = node.type === "Mesh";
                proxy.bimId = node.bimId;
                proxy.properties = node.properties;
              }
              proxy.getWorldPosition = (v) => {
                const mat = new THREE.Matrix4();
                bm.getMatrixAt(batchId, mat);
                mat.premultiply(bm.matrixWorld);
                return v.setFromMatrixPosition(mat);
              };
              proxy.position.setFromMatrixPosition(new THREE.Matrix4());
              hit.object = proxy;
            }
          }
        }
      }
      return hit;
    }
    return null;
  }
  computeTotalBounds(onlyVisible = false, forceRecompute = false) {
    if (!onlyVisible && !forceRecompute && !this.precomputedBounds.isEmpty()) {
      const box = this.precomputedBounds.clone();
      if (this.globalOffset.length() > 0) {
        box.translate(this.globalOffset.clone().negate());
      }
      return box;
    }
    const totalBox = new THREE.Box3();
    this.contentGroup.updateMatrixWorld(true);
    this.contentGroup.traverse((obj) => {
      if (onlyVisible && !obj.visible) return;
      if (obj.name === "3D Tileset" && this.tilesRenderer) {
        const tilesBox = new THREE.Box3();
        if (this.tilesRenderer.getBounds) {
          this.tilesRenderer.getBounds(tilesBox);
          if (!tilesBox.isEmpty() && this.globalOffset.length() > 0) {
            if (Math.abs(tilesBox.min.x) > 1e5 || Math.abs(tilesBox.min.y) > 1e5) {
              tilesBox.translate(this.globalOffset.clone().negate());
            }
          }
          if (!tilesBox.isEmpty()) totalBox.union(tilesBox);
        }
        obj.traverse((child) => {
          if (child !== obj) child._skipTraverse = true;
        });
      } else if (obj.isMesh && !obj._skipTraverse) {
        const mesh = obj;
        if (mesh.geometry) {
          const box = new THREE.Box3().setFromObject(mesh);
          if (!box.isEmpty()) totalBox.union(box);
        }
      } else if (obj.isBatchedMesh && !obj._skipTraverse) {
        const bm = obj;
        if (bm.computeBoundingBox) {
          bm.computeBoundingBox();
          if (bm.boundingBox) {
            const box = bm.boundingBox.clone().applyMatrix4(bm.matrixWorld);
            totalBox.union(box);
          }
        } else {
          const box = new THREE.Box3().setFromObject(bm);
          if (!box.isEmpty()) totalBox.union(box);
        }
      }
    });
    this.contentGroup.traverse((obj) => {
      delete obj._skipTraverse;
    });
    if (this.chunks.length > 0) {
      this.chunks.forEach((c) => {
        if (!onlyVisible || c.loaded) {
          totalBox.union(c.bounds);
        }
      });
    }
    if (totalBox.isEmpty() && !this.precomputedBounds.isEmpty()) {
      const fallback = this.precomputedBounds.clone();
      if (this.globalOffset.length() > 0) {
        fallback.translate(this.globalOffset.clone().negate());
      }
      return fallback;
    }
    return totalBox;
  }
  updateSceneBounds() {
    const fullBox = this.computeTotalBounds(false, true);
    this.precomputedBounds = fullBox.clone();
    if (this.globalOffset.length() > 0) {
      this.precomputedBounds.translate(this.globalOffset);
    }
    const visibleBox = this.computeTotalBounds(true);
    if (visibleBox.isEmpty()) {
      this.sceneBounds.copy(fullBox);
    } else {
      this.sceneBounds.copy(visibleBox);
    }
  }
  fitView(keepOrientation = false) {
    this.contentGroup.updateMatrixWorld(true);
    let box = this.computeTotalBounds(true);
    if (box.isEmpty()) {
      box = this.computeTotalBounds(false);
    }
    this.sceneBounds = box.clone();
    this.fitBox(box, !keepOrientation);
  }
  fitViewToObject(uuid) {
    const obj = this.contentGroup.getObjectByProperty("uuid", uuid);
    if (!obj) return;
    const box = new THREE.Box3();
    if (obj.userData.boundingBox) {
      box.copy(obj.userData.boundingBox).applyMatrix4(obj.matrixWorld);
    } else {
      box.setFromObject(obj);
    }
    if (!box.isEmpty()) this.fitBox(box);
  }
  fitBox(box, updateCameraPosition = true) {
    if (box.isEmpty()) {
      this.camera.zoom = 1;
      this.camera.position.set(1e3, 1e3, 1e3);
      this.camera.lookAt(0, 0, 0);
      this.controls.target.set(0, 0, 0);
      this.camera.updateProjectionMatrix();
      this.controls.update();
      return;
    }
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const extent = maxDim > 0 ? maxDim : 100;
    const padding = 1.2;
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;
    const aspect = w / h;
    let fH, fW;
    if (aspect >= 1) {
      fH = extent * padding;
      fW = fH * aspect;
    } else {
      fW = extent * padding;
      fH = fW / aspect;
    }
    this.camera.zoom = 1;
    this.camera.left = -fW / 2;
    this.camera.right = fW / 2;
    this.camera.top = fH / 2;
    this.camera.bottom = -fH / 2;
    const zBuffer = Math.max(extent * 5, 2e3);
    this.camera.near = -zBuffer;
    this.camera.far = zBuffer;
    if (updateCameraPosition) {
      const offset = new THREE.Vector3(1, 1, 1).normalize();
      const dist = Math.max(extent * 2, 2e3);
      this.camera.position.copy(center.clone().add(offset.multiplyScalar(dist)));
      this.camera.lookAt(center);
    } else {
      const direction = new THREE.Vector3();
      this.camera.getWorldDirection(direction);
      const dist = this.camera.position.distanceTo(this.controls.target);
      this.camera.position.copy(center).add(direction.multiplyScalar(-dist));
      this.camera.lookAt(center);
    }
    this.camera.updateProjectionMatrix();
    this.controls.target.copy(center);
    this.controls.update();
  }
  setView(view) {
    let box = new THREE.Box3();
    if (this.lastSelectedUuid) {
      const obj = this.contentGroup.getObjectByProperty("uuid", this.lastSelectedUuid);
      if (obj) {
        if (obj.userData.boundingBox) {
          box.copy(obj.userData.boundingBox).applyMatrix4(obj.matrixWorld);
        } else {
          box.setFromObject(obj);
        }
      } else {
        const mappings = this.optimizedMapping.get(this.lastSelectedUuid);
        if (mappings && mappings.length > 0) {
          const m = mappings[0];
          if (m.geometry) {
            if (!m.geometry.boundingBox) m.geometry.computeBoundingBox();
            box.copy(m.geometry.boundingBox);
            const matrix = new THREE.Matrix4();
            m.mesh.getMatrixAt(m.instanceId, matrix);
            matrix.premultiply(m.mesh.matrixWorld);
            box.applyMatrix4(matrix);
          }
        }
      }
    }
    if (box.isEmpty()) {
      box = this.computeTotalBounds(true);
      if (box.isEmpty()) box = this.computeTotalBounds(false);
    }
    if (box.isEmpty()) return;
    this.fitBox(box, false);
    this.sceneBounds = box.clone();
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const dist = maxDim > 0 ? maxDim * 2 : 5e3;
    let pos = new THREE.Vector3();
    switch (view) {
      case "top":
        pos.set(0, 0, 1);
        break;
      case "bottom":
        pos.set(0, 0, -1);
        break;
      case "front":
        pos.set(0, -1, 0);
        break;
      case "back":
        pos.set(0, 1, 0);
        break;
      case "left":
        pos.set(-1, 0, 0);
        break;
      case "right":
        pos.set(1, 0, 0);
        break;
      case "iso":
      case "se":
      case "top-front-right":
        pos.set(1, -1, 1);
        break;
      case "sw":
      case "top-front-left":
        pos.set(-1, -1, 1);
        break;
      case "ne":
      case "top-back-right":
        pos.set(1, 1, 1);
        break;
      case "nw":
      case "top-back-left":
        pos.set(-1, 1, 1);
        break;
      case "bottom-front-right":
        pos.set(1, -1, -1);
        break;
      case "bottom-front-left":
        pos.set(-1, -1, -1);
        break;
      case "bottom-back-right":
        pos.set(1, 1, -1);
        break;
      case "bottom-back-left":
        pos.set(-1, 1, -1);
        break;
      case "top-front":
        pos.set(0, -1, 1);
        break;
      case "top-back":
        pos.set(0, 1, 1);
        break;
      case "top-left":
        pos.set(-1, 0, 1);
        break;
      case "top-right":
        pos.set(1, 0, 1);
        break;
      case "bottom-front":
        pos.set(0, -1, -1);
        break;
      case "bottom-back":
        pos.set(0, 1, -1);
        break;
      case "bottom-left":
        pos.set(-1, 0, -1);
        break;
      case "bottom-right":
        pos.set(1, 0, -1);
        break;
      case "front-left":
        pos.set(-1, -1, 0);
        break;
      case "front-right":
        pos.set(1, -1, 0);
        break;
      case "back-left":
        pos.set(-1, 1, 0);
        break;
      case "back-right":
        pos.set(1, 1, 0);
        break;
    }
    if (pos.lengthSq() > 0) {
      pos.normalize().multiplyScalar(dist);
      this.camera.position.copy(center).add(pos);
      this.camera.lookAt(center);
      this.controls.target.copy(center);
      this.controls.update();
      this.fitBox(box, false);
    }
  }
  // --- 测量逻辑 ---
  startMeasurement(type) {
    this.measureType = type;
    this.currentMeasurePoints = [];
    this.clearMeasurementPreview();
  }
  addMeasurePoint(point) {
    if (this.measureType === "none") return null;
    this.currentMeasurePoints.push(point);
    this.addMarker(point, this.measureGroup);
    if (this.measureType === "dist" && this.currentMeasurePoints.length === 2) {
      return this.finalizeMeasurement();
    } else if (this.measureType === "angle" && this.currentMeasurePoints.length === 3) {
      return this.finalizeMeasurement();
    } else if (this.measureType === "coord") {
      return this.finalizeMeasurement();
    }
    this.updatePreviewLine();
    return null;
  }
  updateMeasureHover(clientX, clientY) {
    if (this.measureType === "none") {
      this.tempMarker.visible = false;
      return;
    }
    const intersect = this.getRayIntersects(clientX, clientY);
    if (intersect) {
      const p = intersect.point;
      const attr = this.tempMarker.geometry.attributes.position;
      attr.setXYZ(0, p.x, p.y, p.z);
      attr.needsUpdate = true;
      this.tempMarker.visible = true;
      if (this.currentMeasurePoints.length > 0) {
        this.updatePreviewLine(p);
      }
    } else {
      this.tempMarker.visible = false;
      if (this.previewLine) this.previewLine.visible = false;
    }
  }
  updatePreviewLine(hoverPoint) {
    if (this.previewLine) {
      this.measureGroup.remove(this.previewLine);
      this.previewLine = null;
    }
    const points = [...this.currentMeasurePoints];
    if (hoverPoint) points.push(hoverPoint);
    if (points.length < 2) return;
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineDashedMaterial({
      color: 16711680,
      dashSize: 5,
      gapSize: 2,
      depthTest: false
    });
    this.previewLine = new THREE.Line(geometry, material);
    this.previewLine.computeLineDistances();
    this.previewLine.renderOrder = 998;
    this.measureGroup.add(this.previewLine);
  }
  finalizeMeasurement() {
    const id = `measure_${Date.now()}`;
    const group = new THREE.Group();
    group.name = id;
    this.currentMeasurePoints.forEach((p) => this.addMarker(p, group));
    let valStr = "";
    let displayVal = "";
    let typeStr = this.measureType;
    let labelPos = new THREE.Vector3();
    if (this.measureType === "dist") {
      const p1 = this.currentMeasurePoints[0];
      const p2 = this.currentMeasurePoints[1];
      const dist = p1.distanceTo(p2);
      const dx = Math.abs(p2.x - p1.x);
      const dy = Math.abs(p2.y - p1.y);
      const dz = Math.abs(p2.z - p1.z);
      displayVal = dist.toFixed(3);
      valStr = `${displayVal} (Δx:${dx.toFixed(2)}, Δy:${dy.toFixed(2)}, Δz:${dz.toFixed(2)})`;
      this.addLine(this.currentMeasurePoints, group);
      labelPos.copy(p1).add(p2).multiplyScalar(0.5);
    } else if (this.measureType === "angle") {
      const p1 = this.currentMeasurePoints[0];
      const center = this.currentMeasurePoints[1];
      const p2 = this.currentMeasurePoints[2];
      const v1 = p1.clone().sub(center).normalize();
      const v2 = p2.clone().sub(center).normalize();
      const angle = v1.angleTo(v2) * (180 / Math.PI);
      displayVal = angle.toFixed(2) + "°";
      valStr = displayVal;
      this.addLine(this.currentMeasurePoints, group);
      labelPos.copy(center);
    } else {
      const p = this.currentMeasurePoints[0];
      displayVal = `(${p.x.toFixed(2)}, ${p.y.toFixed(2)}, ${p.z.toFixed(2)})`;
      valStr = displayVal;
      labelPos.copy(p);
    }
    const label = this.createLabel(displayVal, labelPos);
    group.add(label);
    this.measureGroup.add(group);
    this.measureRecords.set(id, { id, type: typeStr, val: valStr, group });
    this.currentMeasurePoints = [];
    this.clearMeasurementPreview();
    return { id, type: typeStr, val: valStr };
  }
  createLabel(text, position) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return new THREE.Sprite();
    const fontSize = 48;
    const padding = 24;
    ctx.font = `Bold ${fontSize}px "Segoe UI", Arial, sans-serif`;
    const textWidth = ctx.measureText(text).width;
    canvas.width = textWidth + padding * 2;
    canvas.height = fontSize + padding;
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 10;
    ctx.fillStyle = "rgba(30, 30, 30, 0.9)";
    const radius = 8;
    if (ctx.roundRect) {
      ctx.roundRect(5, 5, canvas.width - 10, canvas.height - 10, radius);
    } else {
      ctx.rect(5, 5, canvas.width - 10, canvas.height - 10);
    }
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "#ff0000";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.font = `Bold ${fontSize}px "Segoe UI", Arial, sans-serif`;
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    const spriteMaterial = new THREE.SpriteMaterial({
      map: texture,
      depthTest: false,
      sizeAttenuation: false
      // 关键：使文字不受相机缩放影响
    });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.position.copy(position);
    const baseScale = 0.035;
    sprite.scale.set(baseScale * (canvas.width / canvas.height), baseScale, 1);
    sprite.renderOrder = 1001;
    sprite.userData = { type: "label" };
    return sprite;
  }
  highlightMeasurement(id) {
    this.measureRecords.forEach((record, rid) => {
      const isHighlighted = rid === id;
      const color = isHighlighted ? 65280 : 16711680;
      record.group.traverse((child) => {
        if (child instanceof THREE.Line) {
          child.material.color.set(color);
        } else if (child instanceof THREE.Points) {
          child.material.color.set(color);
        } else if (child instanceof THREE.Sprite) {
          child.material.color.set(isHighlighted ? 65280 : 16777215);
        }
      });
    });
  }
  pickMeasurement(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = (clientX - rect.left) / rect.width * 2 - 1;
    this.mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const oldThreshold = this.raycaster.params.Line?.threshold || 0;
    if (this.raycaster.params.Line) this.raycaster.params.Line.threshold = 5;
    const intersects = this.raycaster.intersectObjects(this.measureGroup.children, true);
    if (this.raycaster.params.Line) this.raycaster.params.Line.threshold = oldThreshold;
    if (intersects.length > 0) {
      let obj = intersects[0].object;
      while (obj.parent && !obj.name.startsWith("measure_")) {
        obj = obj.parent;
      }
      if (obj.name.startsWith("measure_")) {
        return obj.name;
      }
    }
    return null;
  }
  addMarker(point, parent) {
    const markerGeo = new THREE.BufferGeometry().setAttribute("position", new THREE.Float32BufferAttribute([point.x, point.y, point.z], 3));
    const markerMat = new THREE.PointsMaterial({ color: 16711680, size: 8, map: this.dotTexture, transparent: true, alphaTest: 0.5, depthTest: false });
    const marker = new THREE.Points(markerGeo, markerMat);
    marker.renderOrder = 999;
    parent.add(marker);
  }
  addLine(points, parent) {
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 16711680, depthTest: false, linewidth: 2 });
    const line = new THREE.Line(geometry, material);
    line.renderOrder = 998;
    parent.add(line);
  }
  removeMeasurement(id) {
    if (this.measureRecords.has(id)) {
      const record = this.measureRecords.get(id);
      if (record) {
        this.measureGroup.remove(record.group);
        this.measureRecords.delete(id);
      }
    }
  }
  clearAllMeasurements() {
    this.measureRecords.forEach((record) => {
      this.measureGroup.remove(record.group);
    });
    this.measureRecords.clear();
    this.clearMeasurementPreview();
  }
  clearMeasurementPreview() {
    this.currentMeasurePoints = [];
    if (this.previewLine) {
      this.measureGroup.remove(this.previewLine);
      this.previewLine = null;
    }
    this.tempMarker.visible = false;
    for (let i = this.measureGroup.children.length - 1; i >= 0; i--) {
      const child = this.measureGroup.children[i];
      if (!child.name.startsWith("measure_") && child !== this.previewLine) {
        this.measureGroup.remove(child);
      }
    }
  }
  // --- 剖切逻辑 ---
  setupClipping() {
    this.clippingPlanes = [
      new THREE.Plane(new THREE.Vector3(1, 0, 0), 0),
      new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0),
      new THREE.Plane(new THREE.Vector3(0, 1, 0), 0),
      new THREE.Plane(new THREE.Vector3(0, -1, 0), 0),
      new THREE.Plane(new THREE.Vector3(0, 0, 1), 0),
      new THREE.Plane(new THREE.Vector3(0, 0, -1), 0)
    ];
    this.renderer.clippingPlanes = [];
    const colors = [16711680, 16711680, 65280, 65280, 255, 255];
    this.clipPlaneHelpers = [];
    this.clipHelpersGroup.clear();
    for (let i = 0; i < 6; i++) {
      const geom = new THREE.PlaneGeometry(1, 1);
      const mat = new THREE.MeshBasicMaterial({
        color: colors[i],
        transparent: true,
        opacity: 0.3,
        // 提高不透明度，使半透明效果更明显
        side: THREE.DoubleSide,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -4,
        polygonOffsetUnits: -4,
        clippingPlanes: []
      });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.visible = false;
      mesh.renderOrder = 9999;
      const edges = new THREE.EdgesGeometry(geom);
      const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({
        color: colors[i],
        transparent: true,
        opacity: 0.8,
        // 边框也调亮一点
        depthWrite: false
      }));
      line.renderOrder = 1e4;
      mesh.add(line);
      this.clipPlaneHelpers.push(mesh);
      this.clipHelpersGroup.add(mesh);
    }
  }
  setClippingEnabled(enabled) {
    this.renderer.clippingPlanes = enabled ? this.clippingPlanes : [];
    if (!enabled) {
      this.clipPlaneHelpers.forEach((h) => h.visible = false);
    }
  }
  updateClippingPlanes(bounds, values, active) {
    if (bounds.isEmpty()) return;
    const { min, max } = bounds;
    const size = max.clone().sub(min);
    const center = bounds.getCenter(new THREE.Vector3());
    const diagonal = size.length();
    const helperSize = diagonal > 0 ? diagonal * 1.2 : 1e3;
    const xMin = min.x + values.x[0] / 100 * size.x;
    const xMax = min.x + values.x[1] / 100 * size.x;
    const yMin = min.y + values.y[0] / 100 * size.y;
    const yMax = min.y + values.y[1] / 100 * size.y;
    const zMin = min.z + values.z[0] / 100 * size.z;
    const zMax = min.z + values.z[1] / 100 * size.z;
    const isEnabled = this.renderer.clippingPlanes.length > 0;
    if (active.x) {
      this.clippingPlanes[0].constant = -xMin;
      this.clippingPlanes[1].constant = xMax;
      this.updatePlaneHelper(0, new THREE.Vector3(1, 0, 0), xMin, center, helperSize, isEnabled);
      this.updatePlaneHelper(1, new THREE.Vector3(-1, 0, 0), xMax, center, helperSize, isEnabled);
    } else {
      this.clippingPlanes[0].constant = Infinity;
      this.clippingPlanes[1].constant = Infinity;
      this.clipPlaneHelpers[0].visible = false;
      this.clipPlaneHelpers[1].visible = false;
    }
    if (active.y) {
      this.clippingPlanes[2].constant = -yMin;
      this.clippingPlanes[3].constant = yMax;
      this.updatePlaneHelper(2, new THREE.Vector3(0, 1, 0), yMin, center, helperSize, isEnabled);
      this.updatePlaneHelper(3, new THREE.Vector3(0, -1, 0), yMax, center, helperSize, isEnabled);
    } else {
      this.clippingPlanes[2].constant = Infinity;
      this.clippingPlanes[3].constant = Infinity;
      this.clipPlaneHelpers[2].visible = false;
      this.clipPlaneHelpers[3].visible = false;
    }
    if (active.z) {
      this.clippingPlanes[4].constant = -zMin;
      this.clippingPlanes[5].constant = zMax;
      this.updatePlaneHelper(4, new THREE.Vector3(0, 0, 1), zMin, center, helperSize, isEnabled);
      this.updatePlaneHelper(5, new THREE.Vector3(0, 0, -1), zMax, center, helperSize, isEnabled);
    } else {
      this.clippingPlanes[4].constant = Infinity;
      this.clippingPlanes[5].constant = Infinity;
      this.clipPlaneHelpers[4].visible = false;
      this.clipPlaneHelpers[5].visible = false;
    }
  }
  updatePlaneHelper(idx, normal, dist, center, size, isEnabled) {
    const helper = this.clipPlaneHelpers[idx];
    if (!helper) return;
    helper.visible = isEnabled;
    helper.scale.set(size, size, 1);
    const pos = new THREE.Vector3(center.x, center.y, center.z);
    const epsilon = 1e-3;
    if (normal.x !== 0) pos.x = dist + normal.x * epsilon;
    else if (normal.y !== 0) pos.y = dist + normal.y * epsilon;
    else if (normal.z !== 0) pos.z = dist + normal.z * epsilon;
    helper.position.copy(pos);
    helper.lookAt(pos.clone().add(normal));
  }
  /**
   * 检查包围盒是否完全被当前剖切面裁剪掉
   * 如果包围盒完全在任意一个激活的剖切面的“背面”，则认为被裁剪
   */
  isBoxClipped(box) {
    for (const plane of this.clippingPlanes) {
      if (plane.constant === Infinity) continue;
      const planeNormal = plane.normal;
      const maxPoint = new THREE.Vector3(
        planeNormal.x > 0 ? box.max.x : box.min.x,
        planeNormal.y > 0 ? box.max.y : box.min.y,
        planeNormal.z > 0 ? box.max.z : box.min.z
      );
      if (plane.distanceToPoint(maxPoint) < 0) {
        return true;
      }
    }
    return false;
  }
  getStats() {
    let meshes = 0;
    let faces = 0;
    let memory = 0;
    this.contentGroup.traverse((obj) => {
      if (obj.name === "__EdgesHelper") return;
      if (obj.isMesh || obj.isBatchedMesh) {
        meshes++;
        const mesh = obj;
        if (mesh.isBatchedMesh) {
          const mapping = mesh.userData.batchIdToExpressId;
          if (mapping) {
            meshes += mapping.size - 1;
          }
        }
        if (mesh.geometry) {
          let meshFaces = 0;
          if (mesh.geometry.index) {
            meshFaces = mesh.geometry.index.count / 3;
          } else if (mesh.geometry.attributes.position) {
            meshFaces = mesh.geometry.attributes.position.count / 3;
          }
          if (mesh.isInstancedMesh) {
            meshFaces *= mesh.count;
          }
          faces += meshFaces;
          memory += calculateGeometryMemory(mesh.geometry);
        }
      }
    });
    const drawCalls = this.renderer.info.render.calls;
    return {
      meshes,
      faces: Math.floor(faces),
      memory: parseFloat(memory.toFixed(2)),
      drawCalls
    };
  }
  dispose() {
    this.renderer.dispose();
    if (this.tilesRenderer) this.tilesRenderer.dispose();
  }
}

/**
 * The KHR_mesh_quantization extension allows these extra attribute component types
 *
 * @see https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Khronos/KHR_mesh_quantization/README.md#extending-mesh-attributes
 */
const KHR_mesh_quantization_ExtraAttrTypes = {
	POSITION: [
		'byte',
		'byte normalized',
		'unsigned byte',
		'unsigned byte normalized',
		'short',
		'short normalized',
		'unsigned short',
		'unsigned short normalized',
	],
	NORMAL: [
		'byte normalized',
		'short normalized',
	],
	TANGENT: [
		'byte normalized',
		'short normalized',
	],
	TEXCOORD: [
		'byte',
		'byte normalized',
		'unsigned byte',
		'short',
		'short normalized',
		'unsigned short',
	],
};

/**
 * An exporter for `glTF` 2.0.
 *
 * glTF (GL Transmission Format) is an [open format specification](https://github.com/KhronosGroup/glTF/tree/master/specification/2.0)
 * for efficient delivery and loading of 3D content. Assets may be provided either in JSON (.gltf)
 * or binary (.glb) format. External files store textures (.jpg, .png) and additional binary
 * data (.bin). A glTF asset may deliver one or more scenes, including meshes, materials,
 * textures, skins, skeletons, morph targets, animations, lights, and/or cameras.
 *
 * GLTFExporter supports the [glTF 2.0 extensions](https://github.com/KhronosGroup/glTF/tree/master/extensions/):
 *
 * - KHR_lights_punctual
 * - KHR_materials_clearcoat
 * - KHR_materials_dispersion
 * - KHR_materials_emissive_strength
 * - KHR_materials_ior
 * - KHR_materials_iridescence
 * - KHR_materials_specular
 * - KHR_materials_sheen
 * - KHR_materials_transmission
 * - KHR_materials_unlit
 * - KHR_materials_volume
 * - KHR_mesh_quantization
 * - KHR_texture_transform
 * - EXT_materials_bump
 * - EXT_mesh_gpu_instancing
 *
 * The following glTF 2.0 extension is supported by an external user plugin:
 *
 * - [KHR_materials_variants](https://github.com/takahirox/three-gltf-extensions)
 *
 * ```js
 * const exporter = new GLTFExporter();
 * const data = await exporter.parseAsync( scene, options );
 * ```
 *
 * @three_import import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
 */
class GLTFExporter {

	/**
	 * Constructs a new glTF exporter.
	 */
	constructor() {

		/**
		 * A reference to a texture utils module.
		 *
		 * @type {?(WebGLTextureUtils|WebGPUTextureUtils)}
		 * @default null
		 */
		this.textureUtils = null;

		this.pluginCallbacks = [];

		this.register( function ( writer ) {

			return new GLTFLightExtension( writer );

		} );

		this.register( function ( writer ) {

			return new GLTFMaterialsUnlitExtension( writer );

		} );

		this.register( function ( writer ) {

			return new GLTFMaterialsTransmissionExtension( writer );

		} );

		this.register( function ( writer ) {

			return new GLTFMaterialsVolumeExtension( writer );

		} );

		this.register( function ( writer ) {

			return new GLTFMaterialsIorExtension( writer );

		} );

		this.register( function ( writer ) {

			return new GLTFMaterialsSpecularExtension( writer );

		} );

		this.register( function ( writer ) {

			return new GLTFMaterialsClearcoatExtension( writer );

		} );

		this.register( function ( writer ) {

			return new GLTFMaterialsDispersionExtension( writer );

		} );

		this.register( function ( writer ) {

			return new GLTFMaterialsIridescenceExtension( writer );

		} );

		this.register( function ( writer ) {

			return new GLTFMaterialsSheenExtension( writer );

		} );

		this.register( function ( writer ) {

			return new GLTFMaterialsAnisotropyExtension( writer );

		} );

		this.register( function ( writer ) {

			return new GLTFMaterialsEmissiveStrengthExtension( writer );

		} );

		this.register( function ( writer ) {

			return new GLTFMaterialsBumpExtension( writer );

		} );

		this.register( function ( writer ) {

			return new GLTFMeshGpuInstancing( writer );

		} );

	}

	/**
	 * Registers a plugin callback. This API is internally used to implement the various
	 * glTF extensions but can also used by third-party code to add additional logic
	 * to the exporter.
	 *
	 * @param {function(writer:GLTFWriter)} callback - The callback function to register.
	 * @return {GLTFExporter} A reference to this exporter.
	 */
	register( callback ) {

		if ( this.pluginCallbacks.indexOf( callback ) === -1 ) {

			this.pluginCallbacks.push( callback );

		}

		return this;

	}

	/**
	 * Unregisters a plugin callback.
	 *
	 * @param {Function} callback - The callback function to unregister.
	 * @return {GLTFExporter} A reference to this exporter.
	 */
	unregister( callback ) {

		if ( this.pluginCallbacks.indexOf( callback ) !== -1 ) {

			this.pluginCallbacks.splice( this.pluginCallbacks.indexOf( callback ), 1 );

		}

		return this;

	}

	/**
	 * Sets the texture utils for this exporter. Only relevant when compressed textures have to be exported.
	 *
	 * Depending on whether you use {@link WebGLRenderer} or {@link WebGPURenderer}, you must inject the
	 * corresponding texture utils {@link WebGLTextureUtils} or {@link WebGPUTextureUtils}.
	 *
	 * @param {WebGLTextureUtils|WebGPUTextureUtils} utils - The texture utils.
	 * @return {GLTFExporter} A reference to this exporter.
	 */
	setTextureUtils( utils ) {

		this.textureUtils = utils;

		return this;

	}

	/**
	 * Parses the given scenes and generates the glTF output.
	 *
	 * @param {Scene|Array<Scene>} input - A scene or an array of scenes.
	 * @param {GLTFExporter~OnDone} onDone - A callback function that is executed when the export has finished.
	 * @param {GLTFExporter~OnError} onError - A callback function that is executed when an error happens.
	 * @param {GLTFExporter~Options} options - options
	 */
	parse( input, onDone, onError, options ) {

		const writer = new GLTFWriter();
		const plugins = [];

		for ( let i = 0, il = this.pluginCallbacks.length; i < il; i ++ ) {

			plugins.push( this.pluginCallbacks[ i ]( writer ) );

		}

		writer.setPlugins( plugins );
		writer.setTextureUtils( this.textureUtils );
		writer.writeAsync( input, onDone, options ).catch( onError );

	}

	/**
	 * Async version of {@link GLTFExporter#parse}.
	 *
	 * @param {Scene|Array<Scene>} input - A scene or an array of scenes.
	 * @param {GLTFExporter~Options} options - options.
	 * @return {Promise<ArrayBuffer|string>} A Promise that resolved with the exported glTF data.
	 */
	parseAsync( input, options ) {

		const scope = this;

		return new Promise( function ( resolve, reject ) {

			scope.parse( input, resolve, reject, options );

		} );

	}

}

//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------

const WEBGL_CONSTANTS = {
	POINTS: 0x0000,
	LINES: 0x0001,
	LINE_LOOP: 0x0002,
	LINE_STRIP: 0x0003,
	TRIANGLES: 0x0004,
	BYTE: 0x1400,
	UNSIGNED_BYTE: 0x1401,
	SHORT: 0x1402,
	UNSIGNED_SHORT: 0x1403,
	INT: 0x1404,
	UNSIGNED_INT: 0x1405,
	FLOAT: 0x1406,

	ARRAY_BUFFER: 0x8892,
	ELEMENT_ARRAY_BUFFER: 0x8893,

	NEAREST: 0x2600,
	LINEAR: 0x2601,
	NEAREST_MIPMAP_NEAREST: 0x2700,
	LINEAR_MIPMAP_NEAREST: 0x2701,
	NEAREST_MIPMAP_LINEAR: 0x2702,
	LINEAR_MIPMAP_LINEAR: 0x2703,

	CLAMP_TO_EDGE: 33071,
	MIRRORED_REPEAT: 33648,
	REPEAT: 10497
};

const KHR_MESH_QUANTIZATION = 'KHR_mesh_quantization';

const THREE_TO_WEBGL = {};

THREE_TO_WEBGL[ NearestFilter ] = WEBGL_CONSTANTS.NEAREST;
THREE_TO_WEBGL[ NearestMipmapNearestFilter ] = WEBGL_CONSTANTS.NEAREST_MIPMAP_NEAREST;
THREE_TO_WEBGL[ NearestMipmapLinearFilter ] = WEBGL_CONSTANTS.NEAREST_MIPMAP_LINEAR;
THREE_TO_WEBGL[ LinearFilter ] = WEBGL_CONSTANTS.LINEAR;
THREE_TO_WEBGL[ LinearMipmapNearestFilter ] = WEBGL_CONSTANTS.LINEAR_MIPMAP_NEAREST;
THREE_TO_WEBGL[ LinearMipmapLinearFilter ] = WEBGL_CONSTANTS.LINEAR_MIPMAP_LINEAR;

THREE_TO_WEBGL[ ClampToEdgeWrapping ] = WEBGL_CONSTANTS.CLAMP_TO_EDGE;
THREE_TO_WEBGL[ RepeatWrapping ] = WEBGL_CONSTANTS.REPEAT;
THREE_TO_WEBGL[ MirroredRepeatWrapping ] = WEBGL_CONSTANTS.MIRRORED_REPEAT;

const PATH_PROPERTIES = {
	scale: 'scale',
	position: 'translation',
	quaternion: 'rotation',
	morphTargetInfluences: 'weights'
};

const DEFAULT_SPECULAR_COLOR = new Color();

// GLB constants
// https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#glb-file-format-specification

const GLB_HEADER_BYTES = 12;
const GLB_HEADER_MAGIC = 0x46546C67;
const GLB_VERSION = 2;

const GLB_CHUNK_PREFIX_BYTES = 8;
const GLB_CHUNK_TYPE_JSON = 0x4E4F534A;
const GLB_CHUNK_TYPE_BIN = 0x004E4942;

//------------------------------------------------------------------------------
// Utility functions
//------------------------------------------------------------------------------

/**
 * Compare two arrays
 *
 * @private
 * @param {Array} array1 Array 1 to compare
 * @param {Array} array2 Array 2 to compare
 * @return {boolean}        Returns true if both arrays are equal
 */
function equalArray( array1, array2 ) {

	return ( array1.length === array2.length ) && array1.every( function ( element, index ) {

		return element === array2[ index ];

	} );

}

/**
 * Converts a string to an ArrayBuffer.
 *
 * @private
 * @param {string} text
 * @return {ArrayBuffer}
 */
function stringToArrayBuffer( text ) {

	return new TextEncoder().encode( text ).buffer;

}

/**
 * Is identity matrix
 *
 * @private
 * @param {Matrix4} matrix
 * @returns {boolean} Returns true, if parameter is identity matrix
 */
function isIdentityMatrix( matrix ) {

	return equalArray( matrix.elements, [ 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1 ] );

}

/**
 * Get the min and max vectors from the given attribute
 *
 * @private
 * @param {BufferAttribute} attribute Attribute to find the min/max in range from start to start + count
 * @param {number} start Start index
 * @param {number} count Range to cover
 * @return {Object} Object containing the `min` and `max` values (As an array of attribute.itemSize components)
 */
function getMinMax( attribute, start, count ) {

	const output = {

		min: new Array( attribute.itemSize ).fill( Number.POSITIVE_INFINITY ),
		max: new Array( attribute.itemSize ).fill( Number.NEGATIVE_INFINITY )

	};

	for ( let i = start; i < start + count; i ++ ) {

		for ( let a = 0; a < attribute.itemSize; a ++ ) {

			let value;

			if ( attribute.itemSize > 4 ) {

				 // no support for interleaved data for itemSize > 4

				value = attribute.array[ i * attribute.itemSize + a ];

			} else {

				if ( a === 0 ) value = attribute.getX( i );
				else if ( a === 1 ) value = attribute.getY( i );
				else if ( a === 2 ) value = attribute.getZ( i );
				else if ( a === 3 ) value = attribute.getW( i );

				if ( attribute.normalized === true ) {

					value = MathUtils.normalize( value, attribute.array );

				}

			}

			output.min[ a ] = Math.min( output.min[ a ], value );
			output.max[ a ] = Math.max( output.max[ a ], value );

		}

	}

	return output;

}

/**
 * Get the required size + padding for a buffer, rounded to the next 4-byte boundary.
 * https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#data-alignment
 *
 * @private
 * @param {number} bufferSize The size the original buffer. Should be an integer.
 * @returns {number} new buffer size with required padding as an integer.
 *
 */
function getPaddedBufferSize( bufferSize ) {

	return Math.ceil( bufferSize / 4 ) * 4;

}

/**
 * Returns a buffer aligned to 4-byte boundary.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer Buffer to pad
 * @param {number} [paddingByte=0] Should be an integer
 * @returns {ArrayBuffer} The same buffer if it's already aligned to 4-byte boundary or a new buffer
 */
function getPaddedArrayBuffer( arrayBuffer, paddingByte = 0 ) {

	const paddedLength = getPaddedBufferSize( arrayBuffer.byteLength );

	if ( paddedLength !== arrayBuffer.byteLength ) {

		const array = new Uint8Array( paddedLength );
		array.set( new Uint8Array( arrayBuffer ) );

		if ( paddingByte !== 0 ) {

			for ( let i = arrayBuffer.byteLength; i < paddedLength; i ++ ) {

				array[ i ] = paddingByte;

			}

		}

		return array.buffer;

	}

	return arrayBuffer;

}

function getCanvas() {

	if ( typeof document === 'undefined' && typeof OffscreenCanvas !== 'undefined' ) {

		return new OffscreenCanvas( 1, 1 );

	}

	return document.createElement( 'canvas' );

}

function getToBlobPromise( canvas, mimeType ) {

	if ( typeof OffscreenCanvas !== 'undefined' && canvas instanceof OffscreenCanvas ) {

		let quality;

		// Blink's implementation of convertToBlob seems to default to a quality level of 100%
		// Use the Blink default quality levels of toBlob instead so that file sizes are comparable.
		if ( mimeType === 'image/jpeg' ) {

			quality = 0.92;

		} else if ( mimeType === 'image/webp' ) {

			quality = 0.8;

		}

		return canvas.convertToBlob( {

			type: mimeType,
			quality: quality

		} );

	} else {

		// HTMLCanvasElement code path

		return new Promise( ( resolve ) => canvas.toBlob( resolve, mimeType ) );

	}

}

/**
 * Writer
 *
 * @private
 */
class GLTFWriter {

	constructor() {

		this.plugins = [];

		this.options = {};
		this.pending = [];
		this.buffers = [];

		this.byteOffset = 0;
		this.buffers = [];
		this.nodeMap = new Map();
		this.skins = [];

		this.extensionsUsed = {};
		this.extensionsRequired = {};

		this.uids = new Map();
		this.uid = 0;

		this.json = {
			asset: {
				version: '2.0',
				generator: 'THREE.GLTFExporter r' + REVISION
			}
		};

		this.cache = {
			meshes: new Map(),
			attributes: new Map(),
			attributesNormalized: new Map(),
			materials: new Map(),
			textures: new Map(),
			images: new Map()
		};

		this.textureUtils = null;

	}

	setPlugins( plugins ) {

		this.plugins = plugins;

	}

	setTextureUtils( utils ) {

		this.textureUtils = utils;

	}

	/**
	 * Parse scenes and generate GLTF output
	 *
	 * @param {Scene|Array<Scene>} input Scene or Array of THREE.Scenes
	 * @param {Function} onDone Callback on completed
	 * @param {Object} options options
	 */
	async writeAsync( input, onDone, options = {} ) {

		this.options = Object.assign( {
			// default options
			binary: false,
			trs: false,
			onlyVisible: true,
			maxTextureSize: Infinity,
			animations: [],
			includeCustomExtensions: false
		}, options );

		if ( this.options.animations.length > 0 ) {

			// Only TRS properties, and not matrices, may be targeted by animation.
			this.options.trs = true;

		}

		await this.processInputAsync( input );

		await Promise.all( this.pending );

		const writer = this;
		const buffers = writer.buffers;
		const json = writer.json;
		options = writer.options;

		const extensionsUsed = writer.extensionsUsed;
		const extensionsRequired = writer.extensionsRequired;

		// Merge buffers.
		const blob = new Blob( buffers, { type: 'application/octet-stream' } );

		// Declare extensions.
		const extensionsUsedList = Object.keys( extensionsUsed );
		const extensionsRequiredList = Object.keys( extensionsRequired );

		if ( extensionsUsedList.length > 0 ) json.extensionsUsed = extensionsUsedList;
		if ( extensionsRequiredList.length > 0 ) json.extensionsRequired = extensionsRequiredList;

		// Update bytelength of the single buffer.
		if ( json.buffers && json.buffers.length > 0 ) json.buffers[ 0 ].byteLength = blob.size;

		if ( options.binary === true ) {

			// https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#glb-file-format-specification

			const reader = new FileReader();
			reader.readAsArrayBuffer( blob );
			reader.onloadend = function () {

				// Binary chunk.
				const binaryChunk = getPaddedArrayBuffer( reader.result );
				const binaryChunkPrefix = new DataView( new ArrayBuffer( GLB_CHUNK_PREFIX_BYTES ) );
				binaryChunkPrefix.setUint32( 0, binaryChunk.byteLength, true );
				binaryChunkPrefix.setUint32( 4, GLB_CHUNK_TYPE_BIN, true );

				// JSON chunk.
				const jsonChunk = getPaddedArrayBuffer( stringToArrayBuffer( JSON.stringify( json ) ), 0x20 );
				const jsonChunkPrefix = new DataView( new ArrayBuffer( GLB_CHUNK_PREFIX_BYTES ) );
				jsonChunkPrefix.setUint32( 0, jsonChunk.byteLength, true );
				jsonChunkPrefix.setUint32( 4, GLB_CHUNK_TYPE_JSON, true );

				// GLB header.
				const header = new ArrayBuffer( GLB_HEADER_BYTES );
				const headerView = new DataView( header );
				headerView.setUint32( 0, GLB_HEADER_MAGIC, true );
				headerView.setUint32( 4, GLB_VERSION, true );
				const totalByteLength = GLB_HEADER_BYTES
					+ jsonChunkPrefix.byteLength + jsonChunk.byteLength
					+ binaryChunkPrefix.byteLength + binaryChunk.byteLength;
				headerView.setUint32( 8, totalByteLength, true );

				const glbBlob = new Blob( [
					header,
					jsonChunkPrefix,
					jsonChunk,
					binaryChunkPrefix,
					binaryChunk
				], { type: 'application/octet-stream' } );

				const glbReader = new FileReader();
				glbReader.readAsArrayBuffer( glbBlob );
				glbReader.onloadend = function () {

					onDone( glbReader.result );

				};

			};

		} else {

			if ( json.buffers && json.buffers.length > 0 ) {

				const reader = new FileReader();
				reader.readAsDataURL( blob );
				reader.onloadend = function () {

					const base64data = reader.result;
					json.buffers[ 0 ].uri = base64data;
					onDone( json );

				};

			} else {

				onDone( json );

			}

		}


	}

	/**
	 * Serializes a userData.
	 *
	 * @param {THREE.Object3D|THREE.Material|THREE.BufferGeometry|THREE.AnimationClip} object
	 * @param {Object} objectDef
	 */
	serializeUserData( object, objectDef ) {

		if ( Object.keys( object.userData ).length === 0 ) return;

		const options = this.options;
		const extensionsUsed = this.extensionsUsed;

		try {

			const json = JSON.parse( JSON.stringify( object.userData ) );

			if ( options.includeCustomExtensions && json.gltfExtensions ) {

				if ( objectDef.extensions === undefined ) objectDef.extensions = {};

				for ( const extensionName in json.gltfExtensions ) {

					objectDef.extensions[ extensionName ] = json.gltfExtensions[ extensionName ];
					extensionsUsed[ extensionName ] = true;

				}

				delete json.gltfExtensions;

			}

			if ( Object.keys( json ).length > 0 ) objectDef.extras = json;

		} catch ( error ) {

			console.warn( 'THREE.GLTFExporter: userData of \'' + object.name + '\' ' +
				'won\'t be serialized because of JSON.stringify error - ' + error.message );

		}

	}

	/**
	 * Returns ids for buffer attributes.
	 *
	 * @param {Object} attribute
	 * @param {boolean} [isRelativeCopy=false]
	 * @return {number} An integer
	 */
	getUID( attribute, isRelativeCopy = false ) {

		if ( this.uids.has( attribute ) === false ) {

			const uids = new Map();

			uids.set( true, this.uid ++ );
			uids.set( false, this.uid ++ );

			this.uids.set( attribute, uids );

		}

		const uids = this.uids.get( attribute );

		return uids.get( isRelativeCopy );

	}

	/**
	 * Checks if normal attribute values are normalized.
	 *
	 * @param {BufferAttribute} normal
	 * @returns {boolean}
	 */
	isNormalizedNormalAttribute( normal ) {

		const cache = this.cache;

		if ( cache.attributesNormalized.has( normal ) ) return false;

		const v = new Vector3();

		for ( let i = 0, il = normal.count; i < il; i ++ ) {

			// 0.0005 is from glTF-validator
			if ( Math.abs( v.fromBufferAttribute( normal, i ).length() - 1.0 ) > 0.0005 ) return false;

		}

		return true;

	}

	/**
	 * Creates normalized normal buffer attribute.
	 *
	 * @param {BufferAttribute} normal
	 * @returns {BufferAttribute}
	 *
	 */
	createNormalizedNormalAttribute( normal ) {

		const cache = this.cache;

		if ( cache.attributesNormalized.has( normal ) )	return cache.attributesNormalized.get( normal );

		const attribute = normal.clone();
		const v = new Vector3();

		for ( let i = 0, il = attribute.count; i < il; i ++ ) {

			v.fromBufferAttribute( attribute, i );

			if ( v.x === 0 && v.y === 0 && v.z === 0 ) {

				// if values can't be normalized set (1, 0, 0)
				v.setX( 1.0 );

			} else {

				v.normalize();

			}

			attribute.setXYZ( i, v.x, v.y, v.z );

		}

		cache.attributesNormalized.set( normal, attribute );

		return attribute;

	}

	/**
	 * Applies a texture transform, if present, to the map definition. Requires
	 * the KHR_texture_transform extension.
	 *
	 * @param {Object} mapDef
	 * @param {THREE.Texture} texture
	 */
	applyTextureTransform( mapDef, texture ) {

		let didTransform = false;
		const transformDef = {};

		if ( texture.offset.x !== 0 || texture.offset.y !== 0 ) {

			transformDef.offset = texture.offset.toArray();
			didTransform = true;

		}

		if ( texture.rotation !== 0 ) {

			transformDef.rotation = texture.rotation;
			didTransform = true;

		}

		if ( texture.repeat.x !== 1 || texture.repeat.y !== 1 ) {

			transformDef.scale = texture.repeat.toArray();
			didTransform = true;

		}

		if ( didTransform ) {

			mapDef.extensions = mapDef.extensions || {};
			mapDef.extensions[ 'KHR_texture_transform' ] = transformDef;
			this.extensionsUsed[ 'KHR_texture_transform' ] = true;

		}

	}

	async buildMetalRoughTextureAsync( metalnessMap, roughnessMap ) {

		if ( metalnessMap === roughnessMap ) return metalnessMap;

		function getEncodingConversion( map ) {

			if ( map.colorSpace === SRGBColorSpace ) {

				return function SRGBToLinear( c ) {

					return ( c < 0.04045 ) ? c * 0.0773993808 : Math.pow( c * 0.9478672986 + 0.0521327014, 2.4 );

				};

			}

			return function LinearToLinear( c ) {

				return c;

			};

		}

		if ( metalnessMap instanceof CompressedTexture ) {

			metalnessMap = await this.decompressTextureAsync( metalnessMap );

		}

		if ( roughnessMap instanceof CompressedTexture ) {

			roughnessMap = await this.decompressTextureAsync( roughnessMap );

		}

		const metalness = metalnessMap ? metalnessMap.image : null;
		const roughness = roughnessMap ? roughnessMap.image : null;

		const width = Math.max( metalness ? metalness.width : 0, roughness ? roughness.width : 0 );
		const height = Math.max( metalness ? metalness.height : 0, roughness ? roughness.height : 0 );

		const canvas = getCanvas();
		canvas.width = width;
		canvas.height = height;

		const context = canvas.getContext( '2d', {
			willReadFrequently: true,
		} );
		context.fillStyle = '#00ffff';
		context.fillRect( 0, 0, width, height );

		const composite = context.getImageData( 0, 0, width, height );

		if ( metalness ) {

			context.drawImage( metalness, 0, 0, width, height );

			const convert = getEncodingConversion( metalnessMap );
			const data = context.getImageData( 0, 0, width, height ).data;

			for ( let i = 2; i < data.length; i += 4 ) {

				composite.data[ i ] = convert( data[ i ] / 256 ) * 256;

			}

		}

		if ( roughness ) {

			context.drawImage( roughness, 0, 0, width, height );

			const convert = getEncodingConversion( roughnessMap );
			const data = context.getImageData( 0, 0, width, height ).data;

			for ( let i = 1; i < data.length; i += 4 ) {

				composite.data[ i ] = convert( data[ i ] / 256 ) * 256;

			}

		}

		context.putImageData( composite, 0, 0 );

		//

		const reference = metalnessMap || roughnessMap;

		const texture = reference.clone();

		texture.source = new Source( canvas );
		texture.colorSpace = NoColorSpace;
		texture.channel = ( metalnessMap || roughnessMap ).channel;

		if ( metalnessMap && roughnessMap && metalnessMap.channel !== roughnessMap.channel ) {

			console.warn( 'THREE.GLTFExporter: UV channels for metalnessMap and roughnessMap textures must match.' );

		}

		console.warn( 'THREE.GLTFExporter: Merged metalnessMap and roughnessMap textures.' );

		return texture;

	}


	async decompressTextureAsync( texture, maxTextureSize = Infinity ) {

		if ( this.textureUtils === null ) {

			throw new Error( 'THREE.GLTFExporter: setTextureUtils() must be called to process compressed textures.' );

		}

		return await this.textureUtils.decompress( texture, maxTextureSize );

	}

	/**
	 * Process a buffer to append to the default one.
	 * @param {ArrayBuffer} buffer
	 * @return {0}
	 */
	processBuffer( buffer ) {

		const json = this.json;
		const buffers = this.buffers;

		if ( ! json.buffers ) json.buffers = [ { byteLength: 0 } ];

		// All buffers are merged before export.
		buffers.push( buffer );

		return 0;

	}

	/**
	 * Process and generate a BufferView
	 * @param {BufferAttribute} attribute
	 * @param {number} componentType
	 * @param {number} start
	 * @param {number} count
	 * @param {number} [target] Target usage of the BufferView
	 * @return {Object}
	 */
	processBufferView( attribute, componentType, start, count, target ) {

		const json = this.json;

		if ( ! json.bufferViews ) json.bufferViews = [];

		// Create a new dataview and dump the attribute's array into it

		let componentSize;

		switch ( componentType ) {

			case WEBGL_CONSTANTS.BYTE:
			case WEBGL_CONSTANTS.UNSIGNED_BYTE:

				componentSize = 1;

				break;

			case WEBGL_CONSTANTS.SHORT:
			case WEBGL_CONSTANTS.UNSIGNED_SHORT:

				componentSize = 2;

				break;

			default:

				componentSize = 4;

		}

		let byteStride = attribute.itemSize * componentSize;

		if ( target === WEBGL_CONSTANTS.ARRAY_BUFFER ) {

			// Each element of a vertex attribute MUST be aligned to 4-byte boundaries
			// inside a bufferView
			byteStride = Math.ceil( byteStride / 4 ) * 4;

		}

		const byteLength = getPaddedBufferSize( count * byteStride );
		const dataView = new DataView( new ArrayBuffer( byteLength ) );
		let offset = 0;

		for ( let i = start; i < start + count; i ++ ) {

			for ( let a = 0; a < attribute.itemSize; a ++ ) {

				let value;

				if ( attribute.itemSize > 4 ) {

					 // no support for interleaved data for itemSize > 4

					value = attribute.array[ i * attribute.itemSize + a ];

				} else {

					if ( a === 0 ) value = attribute.getX( i );
					else if ( a === 1 ) value = attribute.getY( i );
					else if ( a === 2 ) value = attribute.getZ( i );
					else if ( a === 3 ) value = attribute.getW( i );

					if ( attribute.normalized === true ) {

						value = MathUtils.normalize( value, attribute.array );

					}

				}

				if ( componentType === WEBGL_CONSTANTS.FLOAT ) {

					dataView.setFloat32( offset, value, true );

				} else if ( componentType === WEBGL_CONSTANTS.INT ) {

					dataView.setInt32( offset, value, true );

				} else if ( componentType === WEBGL_CONSTANTS.UNSIGNED_INT ) {

					dataView.setUint32( offset, value, true );

				} else if ( componentType === WEBGL_CONSTANTS.SHORT ) {

					dataView.setInt16( offset, value, true );

				} else if ( componentType === WEBGL_CONSTANTS.UNSIGNED_SHORT ) {

					dataView.setUint16( offset, value, true );

				} else if ( componentType === WEBGL_CONSTANTS.BYTE ) {

					dataView.setInt8( offset, value );

				} else if ( componentType === WEBGL_CONSTANTS.UNSIGNED_BYTE ) {

					dataView.setUint8( offset, value );

				}

				offset += componentSize;

			}

			if ( ( offset % byteStride ) !== 0 ) {

				offset += byteStride - ( offset % byteStride );

			}

		}

		const bufferViewDef = {

			buffer: this.processBuffer( dataView.buffer ),
			byteOffset: this.byteOffset,
			byteLength: byteLength

		};

		if ( target !== undefined ) bufferViewDef.target = target;

		if ( target === WEBGL_CONSTANTS.ARRAY_BUFFER ) {

			// Only define byteStride for vertex attributes.
			bufferViewDef.byteStride = byteStride;

		}

		this.byteOffset += byteLength;

		json.bufferViews.push( bufferViewDef );

		// @TODO Merge bufferViews where possible.
		const output = {

			id: json.bufferViews.length - 1,
			byteLength: 0

		};

		return output;

	}

	/**
	 * Process and generate a BufferView from an image Blob.
	 * @param {Blob} blob
	 * @return {Promise<number>} An integer
	 */
	processBufferViewImage( blob ) {

		const writer = this;
		const json = writer.json;

		if ( ! json.bufferViews ) json.bufferViews = [];

		return new Promise( function ( resolve ) {

			const reader = new FileReader();
			reader.readAsArrayBuffer( blob );
			reader.onloadend = function () {

				const buffer = getPaddedArrayBuffer( reader.result );

				const bufferViewDef = {
					buffer: writer.processBuffer( buffer ),
					byteOffset: writer.byteOffset,
					byteLength: buffer.byteLength
				};

				writer.byteOffset += buffer.byteLength;
				resolve( json.bufferViews.push( bufferViewDef ) - 1 );

			};

		} );

	}

	/**
	 * Process attribute to generate an accessor
	 * @param {BufferAttribute} attribute Attribute to process
	 * @param {?BufferGeometry} [geometry] Geometry used for truncated draw range
	 * @param {number} [start=0]
	 * @param {number} [count=Infinity]
	 * @return {?number} Index of the processed accessor on the "accessors" array
	 */
	processAccessor( attribute, geometry, start, count ) {

		const json = this.json;

		const types = {

			1: 'SCALAR',
			2: 'VEC2',
			3: 'VEC3',
			4: 'VEC4',
			9: 'MAT3',
			16: 'MAT4'

		};

		let componentType;

		// Detect the component type of the attribute array
		if ( attribute.array.constructor === Float32Array ) {

			componentType = WEBGL_CONSTANTS.FLOAT;

		} else if ( attribute.array.constructor === Int32Array ) {

			componentType = WEBGL_CONSTANTS.INT;

		} else if ( attribute.array.constructor === Uint32Array ) {

			componentType = WEBGL_CONSTANTS.UNSIGNED_INT;

		} else if ( attribute.array.constructor === Int16Array ) {

			componentType = WEBGL_CONSTANTS.SHORT;

		} else if ( attribute.array.constructor === Uint16Array ) {

			componentType = WEBGL_CONSTANTS.UNSIGNED_SHORT;

		} else if ( attribute.array.constructor === Int8Array ) {

			componentType = WEBGL_CONSTANTS.BYTE;

		} else if ( attribute.array.constructor === Uint8Array ) {

			componentType = WEBGL_CONSTANTS.UNSIGNED_BYTE;

		} else {

			throw new Error( 'THREE.GLTFExporter: Unsupported bufferAttribute component type: ' + attribute.array.constructor.name );

		}

		if ( start === undefined ) start = 0;
		if ( count === undefined || count === Infinity ) count = attribute.count;

		// Skip creating an accessor if the attribute doesn't have data to export
		if ( count === 0 ) return null;

		const minMax = getMinMax( attribute, start, count );
		let bufferViewTarget;

		// If geometry isn't provided, don't infer the target usage of the bufferView. For
		// animation samplers, target must not be set.
		if ( geometry !== undefined ) {

			bufferViewTarget = attribute === geometry.index ? WEBGL_CONSTANTS.ELEMENT_ARRAY_BUFFER : WEBGL_CONSTANTS.ARRAY_BUFFER;

		}

		const bufferView = this.processBufferView( attribute, componentType, start, count, bufferViewTarget );

		const accessorDef = {

			bufferView: bufferView.id,
			byteOffset: bufferView.byteOffset,
			componentType: componentType,
			count: count,
			max: minMax.max,
			min: minMax.min,
			type: types[ attribute.itemSize ]

		};

		if ( attribute.normalized === true ) accessorDef.normalized = true;
		if ( ! json.accessors ) json.accessors = [];

		return json.accessors.push( accessorDef ) - 1;

	}

	/**
	 * Process image
	 * @param {Image} image to process
	 * @param {number} format Identifier of the format (RGBAFormat)
	 * @param {boolean} flipY before writing out the image
	 * @param {string} mimeType export format
	 * @return {number}     Index of the processed texture in the "images" array
	 */
	processImage( image, format, flipY, mimeType = 'image/png' ) {

		if ( image !== null ) {

			const writer = this;
			const cache = writer.cache;
			const json = writer.json;
			const options = writer.options;
			const pending = writer.pending;

			if ( ! cache.images.has( image ) ) cache.images.set( image, {} );

			const cachedImages = cache.images.get( image );

			const key = mimeType + ':flipY/' + flipY.toString();

			if ( cachedImages[ key ] !== undefined ) return cachedImages[ key ];

			if ( ! json.images ) json.images = [];

			const imageDef = { mimeType: mimeType };

			const canvas = getCanvas();

			canvas.width = Math.min( image.width, options.maxTextureSize );
			canvas.height = Math.min( image.height, options.maxTextureSize );

			const ctx = canvas.getContext( '2d', {
				willReadFrequently: true,
			} );

			if ( flipY === true ) {

				ctx.translate( 0, canvas.height );
				ctx.scale( 1, -1 );

			}

			if ( image.data !== undefined ) { // THREE.DataTexture

				if ( format !== RGBAFormat ) {

					console.error( 'GLTFExporter: Only RGBAFormat is supported.', format );

				}

				if ( image.width > options.maxTextureSize || image.height > options.maxTextureSize ) {

					console.warn( 'GLTFExporter: Image size is bigger than maxTextureSize', image );

				}

				const data = new Uint8ClampedArray( image.height * image.width * 4 );

				for ( let i = 0; i < data.length; i += 4 ) {

					data[ i + 0 ] = image.data[ i + 0 ];
					data[ i + 1 ] = image.data[ i + 1 ];
					data[ i + 2 ] = image.data[ i + 2 ];
					data[ i + 3 ] = image.data[ i + 3 ];

				}

				ctx.putImageData( new ImageData( data, image.width, image.height ), 0, 0 );

			} else {

				if ( ( typeof HTMLImageElement !== 'undefined' && image instanceof HTMLImageElement ) ||
					( typeof HTMLCanvasElement !== 'undefined' && image instanceof HTMLCanvasElement ) ||
					( typeof ImageBitmap !== 'undefined' && image instanceof ImageBitmap ) ||
					( typeof OffscreenCanvas !== 'undefined' && image instanceof OffscreenCanvas ) ) {

					ctx.drawImage( image, 0, 0, canvas.width, canvas.height );

				} else {

					throw new Error( 'THREE.GLTFExporter: Invalid image type. Use HTMLImageElement, HTMLCanvasElement, ImageBitmap or OffscreenCanvas.' );

				}

			}

			if ( options.binary === true ) {

				pending.push(

					getToBlobPromise( canvas, mimeType )
						.then( blob => writer.processBufferViewImage( blob ) )
						.then( bufferViewIndex => {

							imageDef.bufferView = bufferViewIndex;

						} )

				);

			} else {

				imageDef.uri = ImageUtils.getDataURL( canvas, mimeType );

			}

			const index = json.images.push( imageDef ) - 1;
			cachedImages[ key ] = index;
			return index;

		} else {

			throw new Error( 'THREE.GLTFExporter: No valid image data found. Unable to process texture.' );

		}

	}

	/**
	 * Process sampler
	 * @param {Texture} map Texture to process
	 * @return {number}      Index of the processed texture in the "samplers" array
	 */
	processSampler( map ) {

		const json = this.json;

		if ( ! json.samplers ) json.samplers = [];

		const samplerDef = {
			magFilter: THREE_TO_WEBGL[ map.magFilter ],
			minFilter: THREE_TO_WEBGL[ map.minFilter ],
			wrapS: THREE_TO_WEBGL[ map.wrapS ],
			wrapT: THREE_TO_WEBGL[ map.wrapT ]
		};

		return json.samplers.push( samplerDef ) - 1;

	}

	/**
	 * Process texture
	 * @param {Texture} map Map to process
	 * @return {Promise<number>} Index of the processed texture in the "textures" array
	 */
	async processTextureAsync( map ) {

		const writer = this;
		const options = writer.options;
		const cache = this.cache;
		const json = this.json;

		if ( cache.textures.has( map ) ) return cache.textures.get( map );

		if ( ! json.textures ) json.textures = [];

		// make non-readable textures (e.g. CompressedTexture) readable by blitting them into a new texture
		if ( map instanceof CompressedTexture ) {

			map = await this.decompressTextureAsync( map, options.maxTextureSize );

		}

		let mimeType = map.userData.mimeType;

		if ( mimeType === 'image/webp' ) mimeType = 'image/png';

		const textureDef = {
			sampler: this.processSampler( map ),
			source: this.processImage( map.image, map.format, map.flipY, mimeType )
		};

		if ( map.name ) textureDef.name = map.name;

		await this._invokeAllAsync( async function ( ext ) {

			ext.writeTexture && await ext.writeTexture( map, textureDef );

		} );

		const index = json.textures.push( textureDef ) - 1;
		cache.textures.set( map, index );
		return index;

	}

	/**
	 * Process material
	 * @param {THREE.Material} material Material to process
	 * @return {Promise<?number>} Index of the processed material in the "materials" array
	 */
	async processMaterialAsync( material ) {

		const cache = this.cache;
		const json = this.json;

		if ( cache.materials.has( material ) ) return cache.materials.get( material );

		if ( material.isShaderMaterial ) {

			console.warn( 'GLTFExporter: THREE.ShaderMaterial not supported.' );
			return null;

		}

		if ( ! json.materials ) json.materials = [];

		// @QUESTION Should we avoid including any attribute that has the default value?
		const materialDef = {	pbrMetallicRoughness: {} };

		if ( material.isMeshStandardMaterial !== true && material.isMeshBasicMaterial !== true ) {

			console.warn( 'GLTFExporter: Use MeshStandardMaterial or MeshBasicMaterial for best results.' );

		}

		// pbrMetallicRoughness.baseColorFactor
		const color = material.color.toArray().concat( [ material.opacity ] );

		if ( ! equalArray( color, [ 1, 1, 1, 1 ] ) ) {

			materialDef.pbrMetallicRoughness.baseColorFactor = color;

		}

		if ( material.isMeshStandardMaterial ) {

			materialDef.pbrMetallicRoughness.metallicFactor = material.metalness;
			materialDef.pbrMetallicRoughness.roughnessFactor = material.roughness;

		} else {

			materialDef.pbrMetallicRoughness.metallicFactor = 0;
			materialDef.pbrMetallicRoughness.roughnessFactor = 1;

		}

		// pbrMetallicRoughness.metallicRoughnessTexture
		if ( material.metalnessMap || material.roughnessMap ) {

			const metalRoughTexture = await this.buildMetalRoughTextureAsync( material.metalnessMap, material.roughnessMap );

			const metalRoughMapDef = {
				index: await this.processTextureAsync( metalRoughTexture ),
				texCoord: metalRoughTexture.channel
			};
			this.applyTextureTransform( metalRoughMapDef, metalRoughTexture );
			materialDef.pbrMetallicRoughness.metallicRoughnessTexture = metalRoughMapDef;

		}

		// pbrMetallicRoughness.baseColorTexture
		if ( material.map ) {

			const baseColorMapDef = {
				index: await this.processTextureAsync( material.map ),
				texCoord: material.map.channel
			};
			this.applyTextureTransform( baseColorMapDef, material.map );
			materialDef.pbrMetallicRoughness.baseColorTexture = baseColorMapDef;

		}

		if ( material.emissive ) {

			const emissive = material.emissive;
			const maxEmissiveComponent = Math.max( emissive.r, emissive.g, emissive.b );

			if ( maxEmissiveComponent > 0 ) {

				materialDef.emissiveFactor = material.emissive.toArray();

			}

			// emissiveTexture
			if ( material.emissiveMap ) {

				const emissiveMapDef = {
					index: await this.processTextureAsync( material.emissiveMap ),
					texCoord: material.emissiveMap.channel
				};
				this.applyTextureTransform( emissiveMapDef, material.emissiveMap );
				materialDef.emissiveTexture = emissiveMapDef;

			}

		}

		// normalTexture
		if ( material.normalMap ) {

			const normalMapDef = {
				index: await this.processTextureAsync( material.normalMap ),
				texCoord: material.normalMap.channel
			};

			if ( material.normalScale && material.normalScale.x !== 1 ) {

				// glTF normal scale is univariate. Ignore `y`, which may be flipped.
				// Context: https://github.com/mrdoob/three.js/issues/11438#issuecomment-507003995
				normalMapDef.scale = material.normalScale.x;

			}

			this.applyTextureTransform( normalMapDef, material.normalMap );
			materialDef.normalTexture = normalMapDef;

		}

		// occlusionTexture
		if ( material.aoMap ) {

			const occlusionMapDef = {
				index: await this.processTextureAsync( material.aoMap ),
				texCoord: material.aoMap.channel
			};

			if ( material.aoMapIntensity !== 1.0 ) {

				occlusionMapDef.strength = material.aoMapIntensity;

			}

			this.applyTextureTransform( occlusionMapDef, material.aoMap );
			materialDef.occlusionTexture = occlusionMapDef;

		}

		// alphaMode
		if ( material.transparent ) {

			materialDef.alphaMode = 'BLEND';

		} else {

			if ( material.alphaTest > 0.0 ) {

				materialDef.alphaMode = 'MASK';
				materialDef.alphaCutoff = material.alphaTest;

			}

		}

		// doubleSided
		if ( material.side === DoubleSide ) materialDef.doubleSided = true;
		if ( material.name !== '' ) materialDef.name = material.name;

		this.serializeUserData( material, materialDef );

		await this._invokeAllAsync( async function ( ext ) {

			ext.writeMaterialAsync && await ext.writeMaterialAsync( material, materialDef );

		} );

		const index = json.materials.push( materialDef ) - 1;
		cache.materials.set( material, index );
		return index;

	}

	/**
	 * Process mesh
	 * @param {THREE.Mesh} mesh Mesh to process
	 * @return {Promise<?number>} Index of the processed mesh in the "meshes" array
	 */
	async processMeshAsync( mesh ) {

		const cache = this.cache;
		const json = this.json;

		const meshCacheKeyParts = [ mesh.geometry.uuid ];

		if ( Array.isArray( mesh.material ) ) {

			for ( let i = 0, l = mesh.material.length; i < l; i ++ ) {

				meshCacheKeyParts.push( mesh.material[ i ].uuid	);

			}

		} else {

			meshCacheKeyParts.push( mesh.material.uuid );

		}

		const meshCacheKey = meshCacheKeyParts.join( ':' );

		if ( cache.meshes.has( meshCacheKey ) ) return cache.meshes.get( meshCacheKey );

		const geometry = mesh.geometry;

		let mode;

		// Use the correct mode
		if ( mesh.isLineSegments ) {

			mode = WEBGL_CONSTANTS.LINES;

		} else if ( mesh.isLineLoop ) {

			mode = WEBGL_CONSTANTS.LINE_LOOP;

		} else if ( mesh.isLine ) {

			mode = WEBGL_CONSTANTS.LINE_STRIP;

		} else if ( mesh.isPoints ) {

			mode = WEBGL_CONSTANTS.POINTS;

		} else {

			mode = mesh.material.wireframe ? WEBGL_CONSTANTS.LINES : WEBGL_CONSTANTS.TRIANGLES;

		}

		const meshDef = {};
		const attributes = {};
		const primitives = [];
		const targets = [];

		// Conversion between attributes names in threejs and gltf spec
		const nameConversion = {
			uv: 'TEXCOORD_0',
			uv1: 'TEXCOORD_1',
			uv2: 'TEXCOORD_2',
			uv3: 'TEXCOORD_3',
			color: 'COLOR_0',
			skinWeight: 'WEIGHTS_0',
			skinIndex: 'JOINTS_0'
		};

		const originalNormal = geometry.getAttribute( 'normal' );

		if ( originalNormal !== undefined && ! this.isNormalizedNormalAttribute( originalNormal ) ) {

			console.warn( 'THREE.GLTFExporter: Creating normalized normal attribute from the non-normalized one.' );

			geometry.setAttribute( 'normal', this.createNormalizedNormalAttribute( originalNormal ) );

		}

		// @QUESTION Detect if .vertexColors = true?
		// For every attribute create an accessor
		let modifiedAttribute = null;

		for ( let attributeName in geometry.attributes ) {

			// Ignore morph target attributes, which are exported later.
			if ( attributeName.slice( 0, 5 ) === 'morph' ) continue;

			const attribute = geometry.attributes[ attributeName ];
			attributeName = nameConversion[ attributeName ] || attributeName.toUpperCase();

			// Prefix all geometry attributes except the ones specifically
			// listed in the spec; non-spec attributes are considered custom.
			const validVertexAttributes =
					/^(POSITION|NORMAL|TANGENT|TEXCOORD_\d+|COLOR_\d+|JOINTS_\d+|WEIGHTS_\d+)$/;

			if ( ! validVertexAttributes.test( attributeName ) ) attributeName = '_' + attributeName;

			if ( cache.attributes.has( this.getUID( attribute ) ) ) {

				attributes[ attributeName ] = cache.attributes.get( this.getUID( attribute ) );
				continue;

			}

			// Enforce glTF vertex attribute requirements:
			// - JOINTS_0 must be UNSIGNED_BYTE or UNSIGNED_SHORT
			// - Only custom attributes may be INT or UNSIGNED_INT
			modifiedAttribute = null;
			const array = attribute.array;

			if ( attributeName === 'JOINTS_0' &&
				! ( array instanceof Uint16Array ) &&
				! ( array instanceof Uint8Array ) ) {

				console.warn( 'GLTFExporter: Attribute "skinIndex" converted to type UNSIGNED_SHORT.' );
				modifiedAttribute = new BufferAttribute( new Uint16Array( array ), attribute.itemSize, attribute.normalized );

			} else if ( ( array instanceof Uint32Array || array instanceof Int32Array ) && ! attributeName.startsWith( '_' ) ) {

				console.warn( `GLTFExporter: Attribute "${ attributeName }" converted to type FLOAT.` );
				modifiedAttribute = GLTFExporter.Utils.toFloat32BufferAttribute( attribute );

			}

			const accessor = this.processAccessor( modifiedAttribute || attribute, geometry );

			if ( accessor !== null ) {

				if ( ! attributeName.startsWith( '_' ) ) {

					this.detectMeshQuantization( attributeName, attribute );

				}

				attributes[ attributeName ] = accessor;
				cache.attributes.set( this.getUID( attribute ), accessor );

			}

		}

		if ( originalNormal !== undefined ) geometry.setAttribute( 'normal', originalNormal );

		// Skip if no exportable attributes found
		if ( Object.keys( attributes ).length === 0 ) return null;

		// Morph targets
		if ( mesh.morphTargetInfluences !== undefined && mesh.morphTargetInfluences.length > 0 ) {

			const weights = [];
			const targetNames = [];
			const reverseDictionary = {};

			if ( mesh.morphTargetDictionary !== undefined ) {

				for ( const key in mesh.morphTargetDictionary ) {

					reverseDictionary[ mesh.morphTargetDictionary[ key ] ] = key;

				}

			}

			for ( let i = 0; i < mesh.morphTargetInfluences.length; ++ i ) {

				const target = {};
				let warned = false;

				for ( const attributeName in geometry.morphAttributes ) {

					// glTF 2.0 morph supports only POSITION/NORMAL/TANGENT.
					// Three.js doesn't support TANGENT yet.

					if ( attributeName !== 'position' && attributeName !== 'normal' ) {

						if ( ! warned ) {

							console.warn( 'GLTFExporter: Only POSITION and NORMAL morph are supported.' );
							warned = true;

						}

						continue;

					}

					const attribute = geometry.morphAttributes[ attributeName ][ i ];
					const gltfAttributeName = attributeName.toUpperCase();

					// Three.js morph attribute has absolute values while the one of glTF has relative values.
					//
					// glTF 2.0 Specification:
					// https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#morph-targets

					const baseAttribute = geometry.attributes[ attributeName ];

					if ( cache.attributes.has( this.getUID( attribute, true ) ) ) {

						target[ gltfAttributeName ] = cache.attributes.get( this.getUID( attribute, true ) );
						continue;

					}

					// Clones attribute not to override
					const relativeAttribute = attribute.clone();

					if ( ! geometry.morphTargetsRelative ) {

						for ( let j = 0, jl = attribute.count; j < jl; j ++ ) {

							for ( let a = 0; a < attribute.itemSize; a ++ ) {

								if ( a === 0 ) relativeAttribute.setX( j, attribute.getX( j ) - baseAttribute.getX( j ) );
								if ( a === 1 ) relativeAttribute.setY( j, attribute.getY( j ) - baseAttribute.getY( j ) );
								if ( a === 2 ) relativeAttribute.setZ( j, attribute.getZ( j ) - baseAttribute.getZ( j ) );
								if ( a === 3 ) relativeAttribute.setW( j, attribute.getW( j ) - baseAttribute.getW( j ) );

							}

						}

					}

					target[ gltfAttributeName ] = this.processAccessor( relativeAttribute, geometry );
					cache.attributes.set( this.getUID( baseAttribute, true ), target[ gltfAttributeName ] );

				}

				targets.push( target );

				weights.push( mesh.morphTargetInfluences[ i ] );

				if ( mesh.morphTargetDictionary !== undefined ) targetNames.push( reverseDictionary[ i ] );

			}

			meshDef.weights = weights;

			if ( targetNames.length > 0 ) {

				meshDef.extras = {};
				meshDef.extras.targetNames = targetNames;

			}

		}

		const isMultiMaterial = Array.isArray( mesh.material );

		if ( isMultiMaterial && geometry.groups.length === 0 ) return null;

		let didForceIndices = false;

		if ( isMultiMaterial && geometry.index === null ) {

			const indices = [];

			for ( let i = 0, il = geometry.attributes.position.count; i < il; i ++ ) {

				indices[ i ] = i;

			}

			geometry.setIndex( indices );

			didForceIndices = true;

		}

		const materials = isMultiMaterial ? mesh.material : [ mesh.material ];
		const groups = isMultiMaterial ? geometry.groups : [ { materialIndex: 0, start: undefined, count: undefined } ];

		for ( let i = 0, il = groups.length; i < il; i ++ ) {

			const primitive = {
				mode: mode,
				attributes: attributes,
			};

			this.serializeUserData( geometry, primitive );

			if ( targets.length > 0 ) primitive.targets = targets;

			if ( geometry.index !== null ) {

				let cacheKey = this.getUID( geometry.index );

				if ( groups[ i ].start !== undefined || groups[ i ].count !== undefined ) {

					cacheKey += ':' + groups[ i ].start + ':' + groups[ i ].count;

				}

				if ( cache.attributes.has( cacheKey ) ) {

					primitive.indices = cache.attributes.get( cacheKey );

				} else {

					primitive.indices = this.processAccessor( geometry.index, geometry, groups[ i ].start, groups[ i ].count );
					cache.attributes.set( cacheKey, primitive.indices );

				}

				if ( primitive.indices === null ) delete primitive.indices;

			}

			const material = await this.processMaterialAsync( materials[ groups[ i ].materialIndex ] );

			if ( material !== null ) primitive.material = material;

			primitives.push( primitive );

		}

		if ( didForceIndices === true ) {

			geometry.setIndex( null );

		}

		meshDef.primitives = primitives;

		if ( ! json.meshes ) json.meshes = [];

		await this._invokeAllAsync( function ( ext ) {

			ext.writeMesh && ext.writeMesh( mesh, meshDef );

		} );

		const index = json.meshes.push( meshDef ) - 1;
		cache.meshes.set( meshCacheKey, index );
		return index;

	}

	/**
	 * If a vertex attribute with a
	 * [non-standard data type](https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html#meshes-overview)
	 * is used, it is checked whether it is a valid data type according to the
	 * [KHR_mesh_quantization](https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Khronos/KHR_mesh_quantization/README.md)
	 * extension.
	 * In this case the extension is automatically added to the list of used extensions.
	 *
	 * @param {string} attributeName
	 * @param {THREE.BufferAttribute} attribute
	 */
	detectMeshQuantization( attributeName, attribute ) {

		if ( this.extensionsUsed[ KHR_MESH_QUANTIZATION ] ) return;

		let attrType = undefined;

		switch ( attribute.array.constructor ) {

			case Int8Array:

				attrType = 'byte';

				break;

			case Uint8Array:

				attrType = 'unsigned byte';

				break;

			case Int16Array:

				attrType = 'short';

				break;

			case Uint16Array:

				attrType = 'unsigned short';

				break;

			default:

				return;

		}

		if ( attribute.normalized ) attrType += ' normalized';

		const attrNamePrefix = attributeName.split( '_', 1 )[ 0 ];

		if ( KHR_mesh_quantization_ExtraAttrTypes[ attrNamePrefix ] && KHR_mesh_quantization_ExtraAttrTypes[ attrNamePrefix ].includes( attrType ) ) {

			this.extensionsUsed[ KHR_MESH_QUANTIZATION ] = true;
			this.extensionsRequired[ KHR_MESH_QUANTIZATION ] = true;

		}

	}

	/**
	 * Process camera
	 * @param {THREE.Camera} camera Camera to process
	 * @return {number} Index of the processed mesh in the "camera" array
	 */
	processCamera( camera ) {

		const json = this.json;

		if ( ! json.cameras ) json.cameras = [];

		const isOrtho = camera.isOrthographicCamera;

		const cameraDef = {
			type: isOrtho ? 'orthographic' : 'perspective'
		};

		if ( isOrtho ) {

			cameraDef.orthographic = {
				xmag: camera.right * 2,
				ymag: camera.top * 2,
				zfar: camera.far <= 0 ? 0.001 : camera.far,
				znear: camera.near < 0 ? 0 : camera.near
			};

		} else {

			cameraDef.perspective = {
				aspectRatio: camera.aspect,
				yfov: MathUtils.degToRad( camera.fov ),
				zfar: camera.far <= 0 ? 0.001 : camera.far,
				znear: camera.near < 0 ? 0 : camera.near
			};

		}

		// Question: Is saving "type" as name intentional?
		if ( camera.name !== '' ) cameraDef.name = camera.type;

		return json.cameras.push( cameraDef ) - 1;

	}

	/**
	 * Creates glTF animation entry from AnimationClip object.
	 *
	 * Status:
	 * - Only properties listed in PATH_PROPERTIES may be animated.
	 *
	 * @param {THREE.AnimationClip} clip
	 * @param {THREE.Object3D} root
	 * @return {?number}
	 */
	processAnimation( clip, root ) {

		const json = this.json;
		const nodeMap = this.nodeMap;

		if ( ! json.animations ) json.animations = [];

		clip = GLTFExporter.Utils.mergeMorphTargetTracks( clip.clone(), root );

		const tracks = clip.tracks;
		const channels = [];
		const samplers = [];

		for ( let i = 0; i < tracks.length; ++ i ) {

			const track = tracks[ i ];
			const trackBinding = PropertyBinding.parseTrackName( track.name );
			let trackNode = PropertyBinding.findNode( root, trackBinding.nodeName );
			const trackProperty = PATH_PROPERTIES[ trackBinding.propertyName ];

			if ( trackBinding.objectName === 'bones' ) {

				if ( trackNode.isSkinnedMesh === true ) {

					trackNode = trackNode.skeleton.getBoneByName( trackBinding.objectIndex );

				} else {

					trackNode = undefined;

				}

			}

			if ( ! trackNode || ! trackProperty ) {

				console.warn( 'THREE.GLTFExporter: Could not export animation track "%s".', track.name );
				continue;

			}

			const inputItemSize = 1;
			let outputItemSize = track.values.length / track.times.length;

			if ( trackProperty === PATH_PROPERTIES.morphTargetInfluences ) {

				outputItemSize /= trackNode.morphTargetInfluences.length;

			}

			let interpolation;

			// @TODO export CubicInterpolant(InterpolateSmooth) as CUBICSPLINE

			// Detecting glTF cubic spline interpolant by checking factory method's special property
			// GLTFCubicSplineInterpolant is a custom interpolant and track doesn't return
			// valid value from .getInterpolation().
			if ( track.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline === true ) {

				interpolation = 'CUBICSPLINE';

				// itemSize of CUBICSPLINE keyframe is 9
				// (VEC3 * 3: inTangent, splineVertex, and outTangent)
				// but needs to be stored as VEC3 so dividing by 3 here.
				outputItemSize /= 3;

			} else if ( track.getInterpolation() === InterpolateDiscrete ) {

				interpolation = 'STEP';

			} else {

				interpolation = 'LINEAR';

			}

			samplers.push( {
				input: this.processAccessor( new BufferAttribute( track.times, inputItemSize ) ),
				output: this.processAccessor( new BufferAttribute( track.values, outputItemSize ) ),
				interpolation: interpolation
			} );

			channels.push( {
				sampler: samplers.length - 1,
				target: {
					node: nodeMap.get( trackNode ),
					path: trackProperty
				}
			} );

		}

		const animationDef = {
			name: clip.name || 'clip_' + json.animations.length,
			samplers: samplers,
			channels: channels
		};

		this.serializeUserData( clip, animationDef );

		json.animations.push( animationDef );

		return json.animations.length - 1;

	}

	/**
	 * @param {THREE.Object3D} object
	 * @return {?number}
	 */
	 processSkin( object ) {

		const json = this.json;
		const nodeMap = this.nodeMap;

		const node = json.nodes[ nodeMap.get( object ) ];

		const skeleton = object.skeleton;

		if ( skeleton === undefined ) return null;

		const rootJoint = object.skeleton.bones[ 0 ];

		if ( rootJoint === undefined ) return null;

		const joints = [];
		const inverseBindMatrices = new Float32Array( skeleton.bones.length * 16 );
		const temporaryBoneInverse = new Matrix4();

		for ( let i = 0; i < skeleton.bones.length; ++ i ) {

			joints.push( nodeMap.get( skeleton.bones[ i ] ) );
			temporaryBoneInverse.copy( skeleton.boneInverses[ i ] );
			temporaryBoneInverse.multiply( object.bindMatrix ).toArray( inverseBindMatrices, i * 16 );

		}

		if ( json.skins === undefined ) json.skins = [];

		json.skins.push( {
			inverseBindMatrices: this.processAccessor( new BufferAttribute( inverseBindMatrices, 16 ) ),
			joints: joints,
			skeleton: nodeMap.get( rootJoint )
		} );

		const skinIndex = node.skin = json.skins.length - 1;

		return skinIndex;

	}

	/**
	 * Process Object3D node
	 * @param {THREE.Object3D} object Object3D to processNodeAsync
	 * @return {Promise<number>} Index of the node in the nodes list
	 */
	async processNodeAsync( object ) {

		const json = this.json;
		const options = this.options;
		const nodeMap = this.nodeMap;

		if ( ! json.nodes ) json.nodes = [];

		const nodeDef = {};

		if ( options.trs ) {

			const rotation = object.quaternion.toArray();
			const position = object.position.toArray();
			const scale = object.scale.toArray();

			if ( ! equalArray( rotation, [ 0, 0, 0, 1 ] ) ) {

				nodeDef.rotation = rotation;

			}

			if ( ! equalArray( position, [ 0, 0, 0 ] ) ) {

				nodeDef.translation = position;

			}

			if ( ! equalArray( scale, [ 1, 1, 1 ] ) ) {

				nodeDef.scale = scale;

			}

		} else {

			if ( object.matrixAutoUpdate ) {

				object.updateMatrix();

			}

			if ( isIdentityMatrix( object.matrix ) === false ) {

				nodeDef.matrix = object.matrix.elements;

			}

		}

		// We don't export empty strings name because it represents no-name in Three.js.
		if ( object.name !== '' ) nodeDef.name = String( object.name );

		this.serializeUserData( object, nodeDef );

		if ( object.isMesh || object.isLine || object.isPoints ) {

			const meshIndex = await this.processMeshAsync( object );

			if ( meshIndex !== null ) nodeDef.mesh = meshIndex;

		} else if ( object.isCamera ) {

			nodeDef.camera = this.processCamera( object );

		}

		if ( object.isSkinnedMesh ) this.skins.push( object );

		const nodeIndex = json.nodes.push( nodeDef ) - 1;
		nodeMap.set( object, nodeIndex );

		if ( object.children.length > 0 ) {

			const children = [];

			for ( let i = 0, l = object.children.length; i < l; i ++ ) {

				const child = object.children[ i ];

				if ( child.visible || options.onlyVisible === false ) {

					const childNodeIndex = await this.processNodeAsync( child );

					if ( childNodeIndex !== null ) children.push( childNodeIndex );

				}

			}

			if ( children.length > 0 ) nodeDef.children = children;

		}

		await this._invokeAllAsync( function ( ext ) {

			ext.writeNode && ext.writeNode( object, nodeDef );

		} );

		return nodeIndex;

	}

	/**
	 * Process Scene
	 * @param {Scene} scene Scene to process
	 */
	async processSceneAsync( scene ) {

		const json = this.json;
		const options = this.options;

		if ( ! json.scenes ) {

			json.scenes = [];
			json.scene = 0;

		}

		const sceneDef = {};

		if ( scene.name !== '' ) sceneDef.name = scene.name;

		json.scenes.push( sceneDef );

		const nodes = [];

		for ( let i = 0, l = scene.children.length; i < l; i ++ ) {

			const child = scene.children[ i ];

			if ( child.visible || options.onlyVisible === false ) {

				const nodeIndex = await this.processNodeAsync( child );

				if ( nodeIndex !== null ) nodes.push( nodeIndex );

			}

		}

		if ( nodes.length > 0 ) sceneDef.nodes = nodes;

		this.serializeUserData( scene, sceneDef );

	}

	/**
	 * Creates a Scene to hold a list of objects and parse it
	 * @param {Array<THREE.Object3D>} objects List of objects to process
	 */
	async processObjectsAsync( objects ) {

		const scene = new Scene();
		scene.name = 'AuxScene';

		for ( let i = 0; i < objects.length; i ++ ) {

			// We push directly to children instead of calling `add` to prevent
			// modify the .parent and break its original scene and hierarchy
			scene.children.push( objects[ i ] );

		}

		await this.processSceneAsync( scene );

	}

	/**
	 * @param {THREE.Object3D|Array<THREE.Object3D>} input
	 */
	async processInputAsync( input ) {

		const options = this.options;

		input = input instanceof Array ? input : [ input ];

		await this._invokeAllAsync( function ( ext ) {

			ext.beforeParse && ext.beforeParse( input );

		} );

		const objectsWithoutScene = [];

		for ( let i = 0; i < input.length; i ++ ) {

			if ( input[ i ] instanceof Scene ) {

				await this.processSceneAsync( input[ i ] );

			} else {

				objectsWithoutScene.push( input[ i ] );

			}

		}

		if ( objectsWithoutScene.length > 0 ) {

			await this.processObjectsAsync( objectsWithoutScene );

		}

		for ( let i = 0; i < this.skins.length; ++ i ) {

			this.processSkin( this.skins[ i ] );

		}

		for ( let i = 0; i < options.animations.length; ++ i ) {

			this.processAnimation( options.animations[ i ], input[ 0 ] );

		}

		await this._invokeAllAsync( function ( ext ) {

			ext.afterParse && ext.afterParse( input );

		} );

	}

	async _invokeAllAsync( func ) {

		for ( let i = 0, il = this.plugins.length; i < il; i ++ ) {

			await func( this.plugins[ i ] );

		}

	}

}

/**
 * Punctual Lights Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_lights_punctual
 *
 * @private
 */
class GLTFLightExtension {

	constructor( writer ) {

		this.writer = writer;
		this.name = 'KHR_lights_punctual';

	}

	writeNode( light, nodeDef ) {

		if ( ! light.isLight ) return;

		if ( ! light.isDirectionalLight && ! light.isPointLight && ! light.isSpotLight ) {

			console.warn( 'THREE.GLTFExporter: Only directional, point, and spot lights are supported.', light );
			return;

		}

		const writer = this.writer;
		const json = writer.json;
		const extensionsUsed = writer.extensionsUsed;

		const lightDef = {};

		if ( light.name ) lightDef.name = light.name;

		lightDef.color = light.color.toArray();

		lightDef.intensity = light.intensity;

		if ( light.isDirectionalLight ) {

			lightDef.type = 'directional';

		} else if ( light.isPointLight ) {

			lightDef.type = 'point';

			if ( light.distance > 0 ) lightDef.range = light.distance;

		} else if ( light.isSpotLight ) {

			lightDef.type = 'spot';

			if ( light.distance > 0 ) lightDef.range = light.distance;

			lightDef.spot = {};
			lightDef.spot.innerConeAngle = ( 1.0 - light.penumbra ) * light.angle;
			lightDef.spot.outerConeAngle = light.angle;

		}

		if ( light.decay !== undefined && light.decay !== 2 ) {

			console.warn( 'THREE.GLTFExporter: Light decay may be lost. glTF is physically-based, '
				+ 'and expects light.decay=2.' );

		}

		if ( light.target
				&& ( light.target.parent !== light
				|| light.target.position.x !== 0
				|| light.target.position.y !== 0
				|| light.target.position.z !== -1 ) ) {

			console.warn( 'THREE.GLTFExporter: Light direction may be lost. For best results, '
				+ 'make light.target a child of the light with position 0,0,-1.' );

		}

		if ( ! extensionsUsed[ this.name ] ) {

			json.extensions = json.extensions || {};
			json.extensions[ this.name ] = { lights: [] };
			extensionsUsed[ this.name ] = true;

		}

		const lights = json.extensions[ this.name ].lights;
		lights.push( lightDef );

		nodeDef.extensions = nodeDef.extensions || {};
		nodeDef.extensions[ this.name ] = { light: lights.length - 1 };

	}

}

/**
 * Unlit Materials Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_unlit
 *
 * @private
 */
class GLTFMaterialsUnlitExtension {

	constructor( writer ) {

		this.writer = writer;
		this.name = 'KHR_materials_unlit';

	}

	async writeMaterialAsync( material, materialDef ) {

		if ( ! material.isMeshBasicMaterial ) return;

		const writer = this.writer;
		const extensionsUsed = writer.extensionsUsed;

		materialDef.extensions = materialDef.extensions || {};
		materialDef.extensions[ this.name ] = {};

		extensionsUsed[ this.name ] = true;

		materialDef.pbrMetallicRoughness.metallicFactor = 0.0;
		materialDef.pbrMetallicRoughness.roughnessFactor = 0.9;

	}

}

/**
 * Clearcoat Materials Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_clearcoat
 *
 * @private
 */
class GLTFMaterialsClearcoatExtension {

	constructor( writer ) {

		this.writer = writer;
		this.name = 'KHR_materials_clearcoat';

	}

	async writeMaterialAsync( material, materialDef ) {

		if ( ! material.isMeshPhysicalMaterial || material.clearcoat === 0 ) return;

		const writer = this.writer;
		const extensionsUsed = writer.extensionsUsed;

		const extensionDef = {};

		extensionDef.clearcoatFactor = material.clearcoat;

		if ( material.clearcoatMap ) {

			const clearcoatMapDef = {
				index: await writer.processTextureAsync( material.clearcoatMap ),
				texCoord: material.clearcoatMap.channel
			};
			writer.applyTextureTransform( clearcoatMapDef, material.clearcoatMap );
			extensionDef.clearcoatTexture = clearcoatMapDef;

		}

		extensionDef.clearcoatRoughnessFactor = material.clearcoatRoughness;

		if ( material.clearcoatRoughnessMap ) {

			const clearcoatRoughnessMapDef = {
				index: await writer.processTextureAsync( material.clearcoatRoughnessMap ),
				texCoord: material.clearcoatRoughnessMap.channel
			};
			writer.applyTextureTransform( clearcoatRoughnessMapDef, material.clearcoatRoughnessMap );
			extensionDef.clearcoatRoughnessTexture = clearcoatRoughnessMapDef;

		}

		if ( material.clearcoatNormalMap ) {

			const clearcoatNormalMapDef = {
				index: await writer.processTextureAsync( material.clearcoatNormalMap ),
				texCoord: material.clearcoatNormalMap.channel
			};

			if ( material.clearcoatNormalScale.x !== 1 ) clearcoatNormalMapDef.scale = material.clearcoatNormalScale.x;

			writer.applyTextureTransform( clearcoatNormalMapDef, material.clearcoatNormalMap );
			extensionDef.clearcoatNormalTexture = clearcoatNormalMapDef;

		}

		materialDef.extensions = materialDef.extensions || {};
		materialDef.extensions[ this.name ] = extensionDef;

		extensionsUsed[ this.name ] = true;


	}

}

/**
 * Materials dispersion Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_dispersion
 *
 * @private
 */
class GLTFMaterialsDispersionExtension {

	constructor( writer ) {

		this.writer = writer;
		this.name = 'KHR_materials_dispersion';

	}

	async writeMaterialAsync( material, materialDef ) {

		if ( ! material.isMeshPhysicalMaterial || material.dispersion === 0 ) return;

		const writer = this.writer;
		const extensionsUsed = writer.extensionsUsed;

		const extensionDef = {};

		extensionDef.dispersion = material.dispersion;

		materialDef.extensions = materialDef.extensions || {};
		materialDef.extensions[ this.name ] = extensionDef;

		extensionsUsed[ this.name ] = true;

	}

}

/**
 * Iridescence Materials Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_iridescence
 *
 * @private
 */
class GLTFMaterialsIridescenceExtension {

	constructor( writer ) {

		this.writer = writer;
		this.name = 'KHR_materials_iridescence';

	}

	async writeMaterialAsync( material, materialDef ) {

		if ( ! material.isMeshPhysicalMaterial || material.iridescence === 0 ) return;

		const writer = this.writer;
		const extensionsUsed = writer.extensionsUsed;

		const extensionDef = {};

		extensionDef.iridescenceFactor = material.iridescence;

		if ( material.iridescenceMap ) {

			const iridescenceMapDef = {
				index: await writer.processTextureAsync( material.iridescenceMap ),
				texCoord: material.iridescenceMap.channel
			};
			writer.applyTextureTransform( iridescenceMapDef, material.iridescenceMap );
			extensionDef.iridescenceTexture = iridescenceMapDef;

		}

		extensionDef.iridescenceIor = material.iridescenceIOR;
		extensionDef.iridescenceThicknessMinimum = material.iridescenceThicknessRange[ 0 ];
		extensionDef.iridescenceThicknessMaximum = material.iridescenceThicknessRange[ 1 ];

		if ( material.iridescenceThicknessMap ) {

			const iridescenceThicknessMapDef = {
				index: await writer.processTextureAsync( material.iridescenceThicknessMap ),
				texCoord: material.iridescenceThicknessMap.channel
			};
			writer.applyTextureTransform( iridescenceThicknessMapDef, material.iridescenceThicknessMap );
			extensionDef.iridescenceThicknessTexture = iridescenceThicknessMapDef;

		}

		materialDef.extensions = materialDef.extensions || {};
		materialDef.extensions[ this.name ] = extensionDef;

		extensionsUsed[ this.name ] = true;

	}

}

/**
 * Transmission Materials Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_transmission
 *
 * @private
 */
class GLTFMaterialsTransmissionExtension {

	constructor( writer ) {

		this.writer = writer;
		this.name = 'KHR_materials_transmission';

	}

	async writeMaterialAsync( material, materialDef ) {

		if ( ! material.isMeshPhysicalMaterial || material.transmission === 0 ) return;

		const writer = this.writer;
		const extensionsUsed = writer.extensionsUsed;

		const extensionDef = {};

		extensionDef.transmissionFactor = material.transmission;

		if ( material.transmissionMap ) {

			const transmissionMapDef = {
				index: await writer.processTextureAsync( material.transmissionMap ),
				texCoord: material.transmissionMap.channel
			};
			writer.applyTextureTransform( transmissionMapDef, material.transmissionMap );
			extensionDef.transmissionTexture = transmissionMapDef;

		}

		materialDef.extensions = materialDef.extensions || {};
		materialDef.extensions[ this.name ] = extensionDef;

		extensionsUsed[ this.name ] = true;

	}

}

/**
 * Materials Volume Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_volume
 *
 * @private
 */
class GLTFMaterialsVolumeExtension {

	constructor( writer ) {

		this.writer = writer;
		this.name = 'KHR_materials_volume';

	}

	async writeMaterialAsync( material, materialDef ) {

		if ( ! material.isMeshPhysicalMaterial || material.transmission === 0 ) return;

		const writer = this.writer;
		const extensionsUsed = writer.extensionsUsed;

		const extensionDef = {};

		extensionDef.thicknessFactor = material.thickness;

		if ( material.thicknessMap ) {

			const thicknessMapDef = {
				index: await writer.processTextureAsync( material.thicknessMap ),
				texCoord: material.thicknessMap.channel
			};
			writer.applyTextureTransform( thicknessMapDef, material.thicknessMap );
			extensionDef.thicknessTexture = thicknessMapDef;

		}

		if ( material.attenuationDistance !== Infinity ) {

			extensionDef.attenuationDistance = material.attenuationDistance;

		}

		extensionDef.attenuationColor = material.attenuationColor.toArray();

		materialDef.extensions = materialDef.extensions || {};
		materialDef.extensions[ this.name ] = extensionDef;

		extensionsUsed[ this.name ] = true;

	}

}

/**
 * Materials ior Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_ior
 *
 * @private
 */
class GLTFMaterialsIorExtension {

	constructor( writer ) {

		this.writer = writer;
		this.name = 'KHR_materials_ior';

	}

	async writeMaterialAsync( material, materialDef ) {

		if ( ! material.isMeshPhysicalMaterial || material.ior === 1.5 ) return;

		const writer = this.writer;
		const extensionsUsed = writer.extensionsUsed;

		const extensionDef = {};

		extensionDef.ior = material.ior;

		materialDef.extensions = materialDef.extensions || {};
		materialDef.extensions[ this.name ] = extensionDef;

		extensionsUsed[ this.name ] = true;

	}

}

/**
 * Materials specular Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_specular
 *
 * @private
 */
class GLTFMaterialsSpecularExtension {

	constructor( writer ) {

		this.writer = writer;
		this.name = 'KHR_materials_specular';

	}

	async writeMaterialAsync( material, materialDef ) {

		if ( ! material.isMeshPhysicalMaterial || ( material.specularIntensity === 1.0 &&
		       material.specularColor.equals( DEFAULT_SPECULAR_COLOR ) &&
		     ! material.specularIntensityMap && ! material.specularColorMap ) ) return;

		const writer = this.writer;
		const extensionsUsed = writer.extensionsUsed;

		const extensionDef = {};

		if ( material.specularIntensityMap ) {

			const specularIntensityMapDef = {
				index: await writer.processTextureAsync( material.specularIntensityMap ),
				texCoord: material.specularIntensityMap.channel
			};
			writer.applyTextureTransform( specularIntensityMapDef, material.specularIntensityMap );
			extensionDef.specularTexture = specularIntensityMapDef;

		}

		if ( material.specularColorMap ) {

			const specularColorMapDef = {
				index: await writer.processTextureAsync( material.specularColorMap ),
				texCoord: material.specularColorMap.channel
			};
			writer.applyTextureTransform( specularColorMapDef, material.specularColorMap );
			extensionDef.specularColorTexture = specularColorMapDef;

		}

		extensionDef.specularFactor = material.specularIntensity;
		extensionDef.specularColorFactor = material.specularColor.toArray();

		materialDef.extensions = materialDef.extensions || {};
		materialDef.extensions[ this.name ] = extensionDef;

		extensionsUsed[ this.name ] = true;

	}

}

/**
 * Sheen Materials Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/main/extensions/2.0/Khronos/KHR_materials_sheen
 *
 * @private
 */
class GLTFMaterialsSheenExtension {

	constructor( writer ) {

		this.writer = writer;
		this.name = 'KHR_materials_sheen';

	}

	async writeMaterialAsync( material, materialDef ) {

		if ( ! material.isMeshPhysicalMaterial || material.sheen == 0.0 ) return;

		const writer = this.writer;
		const extensionsUsed = writer.extensionsUsed;

		const extensionDef = {};

		if ( material.sheenRoughnessMap ) {

			const sheenRoughnessMapDef = {
				index: await writer.processTextureAsync( material.sheenRoughnessMap ),
				texCoord: material.sheenRoughnessMap.channel
			};
			writer.applyTextureTransform( sheenRoughnessMapDef, material.sheenRoughnessMap );
			extensionDef.sheenRoughnessTexture = sheenRoughnessMapDef;

		}

		if ( material.sheenColorMap ) {

			const sheenColorMapDef = {
				index: await writer.processTextureAsync( material.sheenColorMap ),
				texCoord: material.sheenColorMap.channel
			};
			writer.applyTextureTransform( sheenColorMapDef, material.sheenColorMap );
			extensionDef.sheenColorTexture = sheenColorMapDef;

		}

		extensionDef.sheenRoughnessFactor = material.sheenRoughness;
		extensionDef.sheenColorFactor = material.sheenColor.toArray();

		materialDef.extensions = materialDef.extensions || {};
		materialDef.extensions[ this.name ] = extensionDef;

		extensionsUsed[ this.name ] = true;

	}

}

/**
 * Anisotropy Materials Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/main/extensions/2.0/Khronos/KHR_materials_anisotropy
 *
 * @private
 */
class GLTFMaterialsAnisotropyExtension {

	constructor( writer ) {

		this.writer = writer;
		this.name = 'KHR_materials_anisotropy';

	}

	async writeMaterialAsync( material, materialDef ) {

		if ( ! material.isMeshPhysicalMaterial || material.anisotropy == 0.0 ) return;

		const writer = this.writer;
		const extensionsUsed = writer.extensionsUsed;

		const extensionDef = {};

		if ( material.anisotropyMap ) {

			const anisotropyMapDef = { index: await writer.processTextureAsync( material.anisotropyMap ) };
			writer.applyTextureTransform( anisotropyMapDef, material.anisotropyMap );
			extensionDef.anisotropyTexture = anisotropyMapDef;

		}

		extensionDef.anisotropyStrength = material.anisotropy;
		extensionDef.anisotropyRotation = material.anisotropyRotation;

		materialDef.extensions = materialDef.extensions || {};
		materialDef.extensions[ this.name ] = extensionDef;

		extensionsUsed[ this.name ] = true;

	}

}

/**
 * Materials Emissive Strength Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/blob/5768b3ce0ef32bc39cdf1bef10b948586635ead3/extensions/2.0/Khronos/KHR_materials_emissive_strength/README.md
 *
 * @private
 */
class GLTFMaterialsEmissiveStrengthExtension {

	constructor( writer ) {

		this.writer = writer;
		this.name = 'KHR_materials_emissive_strength';

	}

	async writeMaterialAsync( material, materialDef ) {

		if ( ! material.isMeshStandardMaterial || material.emissiveIntensity === 1.0 ) return;

		const writer = this.writer;
		const extensionsUsed = writer.extensionsUsed;

		const extensionDef = {};

		extensionDef.emissiveStrength = material.emissiveIntensity;

		materialDef.extensions = materialDef.extensions || {};
		materialDef.extensions[ this.name ] = extensionDef;

		extensionsUsed[ this.name ] = true;

	}

}


/**
 * Materials bump Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/EXT_materials_bump
 *
 * @private
 */
class GLTFMaterialsBumpExtension {

	constructor( writer ) {

		this.writer = writer;
		this.name = 'EXT_materials_bump';

	}

	async writeMaterialAsync( material, materialDef ) {

		if ( ! material.isMeshStandardMaterial || (
		       material.bumpScale === 1 &&
		     ! material.bumpMap ) ) return;

		const writer = this.writer;
		const extensionsUsed = writer.extensionsUsed;

		const extensionDef = {};

		if ( material.bumpMap ) {

			const bumpMapDef = {
				index: await writer.processTextureAsync( material.bumpMap ),
				texCoord: material.bumpMap.channel
			};
			writer.applyTextureTransform( bumpMapDef, material.bumpMap );
			extensionDef.bumpTexture = bumpMapDef;

		}

		extensionDef.bumpFactor = material.bumpScale;

		materialDef.extensions = materialDef.extensions || {};
		materialDef.extensions[ this.name ] = extensionDef;

		extensionsUsed[ this.name ] = true;

	}

}

/**
 * GPU Instancing Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Vendor/EXT_mesh_gpu_instancing
 *
 * @private
 */
class GLTFMeshGpuInstancing {

	constructor( writer ) {

		this.writer = writer;
		this.name = 'EXT_mesh_gpu_instancing';

	}

	writeNode( object, nodeDef ) {

		if ( ! object.isInstancedMesh ) return;

		const writer = this.writer;

		const mesh = object;

		const translationAttr = new Float32Array( mesh.count * 3 );
		const rotationAttr = new Float32Array( mesh.count * 4 );
		const scaleAttr = new Float32Array( mesh.count * 3 );

		const matrix = new Matrix4();
		const position = new Vector3();
		const quaternion = new Quaternion();
		const scale = new Vector3();

		for ( let i = 0; i < mesh.count; i ++ ) {

			mesh.getMatrixAt( i, matrix );
			matrix.decompose( position, quaternion, scale );

			position.toArray( translationAttr, i * 3 );
			quaternion.toArray( rotationAttr, i * 4 );
			scale.toArray( scaleAttr, i * 3 );

		}

		const attributes = {
			TRANSLATION: writer.processAccessor( new BufferAttribute( translationAttr, 3 ) ),
			ROTATION: writer.processAccessor( new BufferAttribute( rotationAttr, 4 ) ),
			SCALE: writer.processAccessor( new BufferAttribute( scaleAttr, 3 ) ),
		};

		if ( mesh.instanceColor )
			attributes._COLOR_0 = writer.processAccessor( mesh.instanceColor );

		nodeDef.extensions = nodeDef.extensions || {};
		nodeDef.extensions[ this.name ] = { attributes };

		writer.extensionsUsed[ this.name ] = true;
		writer.extensionsRequired[ this.name ] = true;

	}

}

/**
 * Static utility functions
 *
 * @private
 */
GLTFExporter.Utils = {

	insertKeyframe: function ( track, time ) {

		const tolerance = 0.001; // 1ms
		const valueSize = track.getValueSize();

		const times = new track.TimeBufferType( track.times.length + 1 );
		const values = new track.ValueBufferType( track.values.length + valueSize );
		const interpolant = track.createInterpolant( new track.ValueBufferType( valueSize ) );

		let index;

		if ( track.times.length === 0 ) {

			times[ 0 ] = time;

			for ( let i = 0; i < valueSize; i ++ ) {

				values[ i ] = 0;

			}

			index = 0;

		} else if ( time < track.times[ 0 ] ) {

			if ( Math.abs( track.times[ 0 ] - time ) < tolerance ) return 0;

			times[ 0 ] = time;
			times.set( track.times, 1 );

			values.set( interpolant.evaluate( time ), 0 );
			values.set( track.values, valueSize );

			index = 0;

		} else if ( time > track.times[ track.times.length - 1 ] ) {

			if ( Math.abs( track.times[ track.times.length - 1 ] - time ) < tolerance ) {

				return track.times.length - 1;

			}

			times[ times.length - 1 ] = time;
			times.set( track.times, 0 );

			values.set( track.values, 0 );
			values.set( interpolant.evaluate( time ), track.values.length );

			index = times.length - 1;

		} else {

			for ( let i = 0; i < track.times.length; i ++ ) {

				if ( Math.abs( track.times[ i ] - time ) < tolerance ) return i;

				if ( track.times[ i ] < time && track.times[ i + 1 ] > time ) {

					times.set( track.times.slice( 0, i + 1 ), 0 );
					times[ i + 1 ] = time;
					times.set( track.times.slice( i + 1 ), i + 2 );

					values.set( track.values.slice( 0, ( i + 1 ) * valueSize ), 0 );
					values.set( interpolant.evaluate( time ), ( i + 1 ) * valueSize );
					values.set( track.values.slice( ( i + 1 ) * valueSize ), ( i + 2 ) * valueSize );

					index = i + 1;

					break;

				}

			}

		}

		track.times = times;
		track.values = values;

		return index;

	},

	mergeMorphTargetTracks: function ( clip, root ) {

		const tracks = [];
		const mergedTracks = {};
		const sourceTracks = clip.tracks;

		for ( let i = 0; i < sourceTracks.length; ++ i ) {

			let sourceTrack = sourceTracks[ i ];
			const sourceTrackBinding = PropertyBinding.parseTrackName( sourceTrack.name );
			const sourceTrackNode = PropertyBinding.findNode( root, sourceTrackBinding.nodeName );

			if ( sourceTrackBinding.propertyName !== 'morphTargetInfluences' || sourceTrackBinding.propertyIndex === undefined ) {

				// Tracks that don't affect morph targets, or that affect all morph targets together, can be left as-is.
				tracks.push( sourceTrack );
				continue;

			}

			if ( sourceTrack.createInterpolant !== sourceTrack.InterpolantFactoryMethodDiscrete
				&& sourceTrack.createInterpolant !== sourceTrack.InterpolantFactoryMethodLinear ) {

				if ( sourceTrack.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline ) {

					// This should never happen, because glTF morph target animations
					// affect all targets already.
					throw new Error( 'THREE.GLTFExporter: Cannot merge tracks with glTF CUBICSPLINE interpolation.' );

				}

				console.warn( 'THREE.GLTFExporter: Morph target interpolation mode not yet supported. Using LINEAR instead.' );

				sourceTrack = sourceTrack.clone();
				sourceTrack.setInterpolation( InterpolateLinear );

			}

			const targetCount = sourceTrackNode.morphTargetInfluences.length;
			const targetIndex = sourceTrackNode.morphTargetDictionary[ sourceTrackBinding.propertyIndex ];

			if ( targetIndex === undefined ) {

				throw new Error( 'THREE.GLTFExporter: Morph target name not found: ' + sourceTrackBinding.propertyIndex );

			}

			let mergedTrack;

			// If this is the first time we've seen this object, create a new
			// track to store merged keyframe data for each morph target.
			if ( mergedTracks[ sourceTrackNode.uuid ] === undefined ) {

				mergedTrack = sourceTrack.clone();

				const values = new mergedTrack.ValueBufferType( targetCount * mergedTrack.times.length );

				for ( let j = 0; j < mergedTrack.times.length; j ++ ) {

					values[ j * targetCount + targetIndex ] = mergedTrack.values[ j ];

				}

				// We need to take into consideration the intended target node
				// of our original un-merged morphTarget animation.
				mergedTrack.name = ( sourceTrackBinding.nodeName || '' ) + '.morphTargetInfluences';
				mergedTrack.values = values;

				mergedTracks[ sourceTrackNode.uuid ] = mergedTrack;
				tracks.push( mergedTrack );

				continue;

			}

			const sourceInterpolant = sourceTrack.createInterpolant( new sourceTrack.ValueBufferType( 1 ) );

			mergedTrack = mergedTracks[ sourceTrackNode.uuid ];

			// For every existing keyframe of the merged track, write a (possibly
			// interpolated) value from the source track.
			for ( let j = 0; j < mergedTrack.times.length; j ++ ) {

				mergedTrack.values[ j * targetCount + targetIndex ] = sourceInterpolant.evaluate( mergedTrack.times[ j ] );

			}

			// For every existing keyframe of the source track, write a (possibly
			// new) keyframe to the merged track. Values from the previous loop may
			// be written again, but keyframes are de-duplicated.
			for ( let j = 0; j < sourceTrack.times.length; j ++ ) {

				const keyframeIndex = this.insertKeyframe( mergedTrack, sourceTrack.times[ j ] );
				mergedTrack.values[ keyframeIndex * targetCount + targetIndex ] = sourceTrack.values[ j ];

			}

		}

		clip.tracks = tracks;

		return clip;

	},

	toFloat32BufferAttribute: function ( srcAttribute ) {

		const dstAttribute = new BufferAttribute( new Float32Array( srcAttribute.count * srcAttribute.itemSize ), srcAttribute.itemSize, false );

		if ( ! srcAttribute.normalized && ! srcAttribute.isInterleavedBufferAttribute ) {

			dstAttribute.array.set( srcAttribute.array );

			return dstAttribute;

		}

		for ( let i = 0, il = srcAttribute.count; i < il; i ++ ) {

			for ( let j = 0; j < srcAttribute.itemSize; j ++ ) {

				dstAttribute.setComponent( i, j, srcAttribute.getComponent( i, j ) );

			}

		}

		return dstAttribute;

	}

};

function collectItems(root) {
  const items = [];
  const _v3 = new THREE.Vector3();
  const _m4 = new THREE.Matrix4();
  root.updateMatrixWorld(true);
  root.traverse((obj) => {
    if (obj.isMesh) {
      const mesh = obj;
      const geometry = mesh.geometry;
      const material = mesh.material;
      if (!geometry) return;
      const matUuid = Array.isArray(material) ? material[0]?.uuid : material?.uuid;
      const id = `${geometry.uuid}_${matUuid}`;
      if (mesh.isInstancedMesh) {
        const instancedMesh = mesh;
        for (let i = 0; i < instancedMesh.count; i++) {
          instancedMesh.getMatrixAt(i, _m4);
          _m4.premultiply(instancedMesh.matrixWorld);
          _v3.setFromMatrixPosition(_m4);
          items.push({
            id,
            geometry,
            material,
            matrix: _m4.clone(),
            center: _v3.clone()
          });
        }
      } else {
        _m4.copy(mesh.matrixWorld);
        _v3.setFromMatrixPosition(_m4);
        items.push({
          id,
          geometry,
          material,
          matrix: _m4.clone(),
          center: _v3.clone()
        });
      }
    }
  });
  return items;
}
function buildOctree(items, bounds, config, level = 0) {
  if (items.length <= config.maxItemsPerNode || level >= config.maxDepth) {
    return { bounds: bounds.clone(), children: null, items, level };
  }
  const center = bounds.getCenter(new THREE.Vector3());
  const min = bounds.min;
  const max = bounds.max;
  const childrenBounds = [];
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      for (let k = 0; k < 2; k++) {
        const bMin = new THREE.Vector3(
          i === 0 ? min.x : center.x,
          j === 0 ? min.y : center.y,
          k === 0 ? min.z : center.z
        );
        const bMax = new THREE.Vector3(
          i === 0 ? center.x : max.x,
          j === 0 ? center.y : max.y,
          k === 0 ? center.z : max.z
        );
        childrenBounds.push(new THREE.Box3(bMin, bMax));
      }
    }
  }
  const childrenItems = Array(8).fill(null).map(() => []);
  for (const item of items) {
    let found = false;
    for (let i = 0; i < 8; i++) {
      if (childrenBounds[i].containsPoint(item.center)) {
        childrenItems[i].push(item);
        found = true;
        break;
      }
    }
    if (!found) childrenItems[0].push(item);
  }
  const children = [];
  let hasChildren = false;
  for (let i = 0; i < 8; i++) {
    if (childrenItems[i].length > 0) {
      children.push(buildOctree(childrenItems[i], childrenBounds[i], config, level + 1));
      hasChildren = true;
    }
  }
  if (!hasChildren) {
    return { bounds: bounds.clone(), children: null, items, level };
  }
  return { bounds: bounds.clone(), children, items: [], level };
}
function createSceneFromItems(items) {
  const scene = new THREE.Scene();
  const groups = /* @__PURE__ */ new Map();
  for (const item of items) {
    if (!groups.has(item.id)) {
      groups.set(item.id, []);
    }
    groups.get(item.id).push(item);
  }
  for (const groupItems of groups.values()) {
    if (groupItems.length === 0) continue;
    const template = groupItems[0];
    const geometry = template.geometry.clone();
    const material = template.material;
    const instancedMesh = new THREE.InstancedMesh(geometry, material, groupItems.length);
    instancedMesh.name = "tile_part";
    for (let i = 0; i < groupItems.length; i++) {
      instancedMesh.setMatrixAt(i, groupItems[i].matrix);
    }
    scene.add(instancedMesh);
  }
  return scene;
}
async function convertLMBTo3DTiles(root, onProgress) {
  onProgress("分析场景对象...");
  const items = collectItems(root);
  const totalItems = items.length;
  if (totalItems === 0) throw new Error("No meshes found in scene");
  const globalOffset = new THREE.Vector3(0, 0, 0);
  if (root.userData.originalCenter) {
    globalOffset.copy(root.userData.originalCenter);
    console.log("使用全局偏移进行瓦片集变换:", globalOffset);
  }
  let maxItemsPerNode = 2e3;
  if (totalItems < 5e3) maxItemsPerNode = 5e3;
  else if (totalItems > 1e5) maxItemsPerNode = 4e3;
  else maxItemsPerNode = 2500;
  let maxDepth = 5;
  if (totalItems > 2e5) maxDepth = 7;
  else if (totalItems > 5e4) maxDepth = 6;
  onProgress(`找到 ${totalItems} 个对象. 配置: 容量=${maxItemsPerNode}, 深度=${maxDepth}...`);
  const bounds = new THREE.Box3();
  for (const item of items) {
    bounds.expandByPoint(item.center);
  }
  bounds.min.subScalar(1);
  bounds.max.addScalar(1);
  const config = { maxItemsPerNode, maxDepth };
  const octree = buildOctree(items, bounds, config);
  const fileBlobs = /* @__PURE__ */ new Map();
  const exporter = new GLTFExporter();
  let tileCount = 0;
  const countTiles = (node) => {
    if (node.items.length > 0) tileCount++;
    if (node.children) node.children.forEach(countTiles);
  };
  countTiles(octree);
  let processedCount = 0;
  onProgress(`预计生成 ${tileCount} 个瓦片...`);
  const processNode = async (node, path) => {
    const boundingVolume = {
      box: [
        (node.bounds.min.x + node.bounds.max.x) / 2,
        (node.bounds.min.y + node.bounds.max.y) / 2,
        (node.bounds.min.z + node.bounds.max.z) / 2,
        (node.bounds.max.x - node.bounds.min.x) / 2,
        0,
        0,
        0,
        (node.bounds.max.y - node.bounds.min.y) / 2,
        0,
        0,
        0,
        (node.bounds.max.z - node.bounds.min.z) / 2
      ]
    };
    const tileObj = {
      boundingVolume,
      geometricError: 500 / Math.pow(2, node.level),
      refine: "ADD"
    };
    if (node.items.length > 0) {
      const scene = createSceneFromItems(node.items);
      const glbBuffer = await new Promise((resolve, reject) => {
        exporter.parse(
          scene,
          (result) => resolve(result),
          (err) => reject(err),
          { binary: true }
        );
      });
      processedCount++;
      const percent = Math.floor(processedCount / tileCount * 100);
      onProgress(`生成瓦片 (${processedCount}/${tileCount}): ${percent}%`);
      const filename = `tile_${path}.glb`;
      fileBlobs.set(filename, new Blob([glbBuffer], { type: "model/gltf-binary" }));
      tileObj.content = {
        uri: filename
      };
    }
    if (node.children) {
      const childPromises = node.children.map(
        (child, i) => processNode(child, path + "_" + i)
      );
      tileObj.children = await Promise.all(childPromises);
    }
    return tileObj;
  };
  onProgress("开始生成 GLB 瓦片...");
  const rootTile = await processNode(octree, "root");
  const transform = [
    1,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    1,
    0,
    globalOffset.x,
    globalOffset.y,
    globalOffset.z,
    1
  ];
  rootTile.transform = transform;
  const tileset = {
    asset: {
      version: "1.1",
      // 重要提示：GLTFExporter默认导出为Y轴向上。
      // 我们在这里设置"Y"，这样3d-tiles-renderer会自动将其旋转到Z轴向上。
      gltfUpAxis: "Y"
    },
    geometricError: 1e3,
    root: rootTile
  };
  const tilesetJson = JSON.stringify(tileset, null, 2);
  fileBlobs.set("tileset.json", new Blob([tilesetJson], { type: "application/json" }));
  return fileBlobs;
}
async function exportGLB(root) {
  const exporter = new GLTFExporter();
  return new Promise((resolve, reject) => {
    exporter.parse(
      root,
      (result) => {
        const blob = new Blob([result], { type: "model/gltf-binary" });
        resolve(blob);
      },
      (err) => reject(err),
      { binary: true }
    );
  });
}
async function exportLMB(root, onProgress) {
  onProgress("准备LMB导出...");
  const meshes = [];
  const colors = [];
  const colorMap = /* @__PURE__ */ new Map();
  root.updateMatrixWorld(true);
  const globalOffset = new THREE.Vector3(0, 0, 0);
  if (root.userData.originalCenter) globalOffset.copy(root.userData.originalCenter);
  root.traverse((obj) => {
    if (obj.isMesh && obj.visible) {
      meshes.push(obj);
      const mat = obj.material;
      const hex = mat.color ? mat.color.getHex() : 16777215;
      if (!colorMap.has(hex.toString())) {
        colorMap.set(hex.toString(), colors.length);
        colors.push(hex);
      }
    }
  });
  const parts = [];
  const textEncoder = new TextEncoder();
  const header = new ArrayBuffer(4 * 3 + 4 + 4);
  const headerView = new DataView(header);
  headerView.setFloat32(0, globalOffset.x, true);
  headerView.setFloat32(4, globalOffset.y, true);
  headerView.setFloat32(8, globalOffset.z, true);
  headerView.setUint32(12, colors.length, true);
  headerView.setUint32(16, meshes.length, true);
  parts.push(header);
  const colorsBuffer = new ArrayBuffer(colors.length * 4);
  const colorsView = new DataView(colorsBuffer);
  for (let i = 0; i < colors.length; i++) {
    colorsView.setUint32(i * 4, colors[i], true);
  }
  parts.push(colorsBuffer);
  for (let i = 0; i < meshes.length; i++) {
    const percent = Math.floor(i / meshes.length * 100);
    if (i % 10 === 0) onProgress(`Encoding mesh ${i + 1}/${meshes.length} (${percent}%)`);
    const mesh = meshes[i];
    const geo = mesh.geometry;
    if (!geo.getAttribute("position")) continue;
    const posAttr = geo.getAttribute("position");
    const normAttr = geo.getAttribute("normal");
    const indexAttr = geo.index;
    const nameBytes = textEncoder.encode(mesh.name || `Node_${i}`);
    const nameLen = new ArrayBuffer(2);
    new DataView(nameLen).setUint16(0, nameBytes.length, true);
    parts.push(nameLen);
    parts.push(nameBytes.buffer);
    const paddingLen = (4 - (2 + nameBytes.length) % 4) % 4;
    if (paddingLen > 0) parts.push(new Uint8Array(paddingLen).buffer);
    const m = mesh.matrixWorld;
    const e = m.elements;
    const matBuf = new ArrayBuffer(9 * 4);
    const matView = new DataView(matBuf);
    const indices = [0, 1, 2, 4, 5, 6, 8, 9, 10];
    for (let k = 0; k < 9; k++) matView.setFloat32(k * 4, e[indices[k]], true);
    parts.push(matBuf);
    const posBuf = new ArrayBuffer(3 * 4);
    const posView = new DataView(posBuf);
    posView.setFloat32(0, e[12], true);
    posView.setFloat32(4, e[13], true);
    posView.setFloat32(8, e[14], true);
    parts.push(posBuf);
    let minX = Infinity, minY = Infinity, minZ = Infinity;
    let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
    for (let k = 0; k < posAttr.count; k++) {
      const x = posAttr.getX(k);
      const y = posAttr.getY(k);
      const z = posAttr.getZ(k);
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (z < minZ) minZ = z;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
      if (z > maxZ) maxZ = z;
    }
    if (maxX === minX) maxX += 1e-3;
    if (maxY === minY) maxY += 1e-3;
    if (maxZ === minZ) maxZ += 1e-3;
    const rangeX = maxX - minX;
    const rangeY = maxY - minY;
    const rangeZ = maxZ - minZ;
    const baseX = (minX + maxX) / 2;
    const baseY = (minY + maxY) / 2;
    const baseZ = (minZ + maxZ) / 2;
    const scaleX = 32767 / (rangeX * 0.5);
    const scaleY = 32767 / (rangeY * 0.5);
    const scaleZ = 32767 / (rangeZ * 0.5);
    const compressionBuf = new ArrayBuffer(6 * 4);
    const compView = new DataView(compressionBuf);
    compView.setFloat32(0, baseX, true);
    compView.setFloat32(4, baseY, true);
    compView.setFloat32(8, baseZ, true);
    compView.setFloat32(12, scaleX, true);
    compView.setFloat32(16, scaleY, true);
    compView.setFloat32(20, scaleZ, true);
    parts.push(compressionBuf);
    const vertCount = posAttr.count;
    const countBuf = new ArrayBuffer(4);
    new DataView(countBuf).setUint32(0, vertCount, true);
    parts.push(countBuf);
    const firstX = posAttr.getX(0);
    const firstY = posAttr.getY(0);
    const firstZ = posAttr.getZ(0);
    compView.setFloat32(0, firstX, true);
    compView.setFloat32(4, firstY, true);
    compView.setFloat32(8, firstZ, true);
    const maxDeltaX = Math.max(Math.abs(maxX - firstX), Math.abs(minX - firstX));
    const maxDeltaY = Math.max(Math.abs(maxY - firstY), Math.abs(minY - firstY));
    const maxDeltaZ = Math.max(Math.abs(maxZ - firstZ), Math.abs(minZ - firstZ));
    const finalScaleX = maxDeltaX > 1e-4 ? 32767 / maxDeltaX : 1;
    const finalScaleY = maxDeltaY > 1e-4 ? 32767 / maxDeltaY : 1;
    const finalScaleZ = maxDeltaZ > 1e-4 ? 32767 / maxDeltaZ : 1;
    compView.setFloat32(12, finalScaleX, true);
    compView.setFloat32(16, finalScaleY, true);
    compView.setFloat32(20, finalScaleZ, true);
    const vertDataSize = (vertCount - 1) * 6;
    const vertBuf = new ArrayBuffer(vertDataSize > 0 ? vertDataSize : 0);
    if (vertDataSize > 0) {
      const vView = new DataView(vertBuf);
      for (let k = 1; k < vertCount; k++) {
        const x = posAttr.getX(k);
        const y = posAttr.getY(k);
        const z = posAttr.getZ(k);
        const qx = Math.round((x - firstX) * finalScaleX);
        const qy = Math.round((y - firstY) * finalScaleY);
        const qz = Math.round((z - firstZ) * finalScaleZ);
        const offset2 = (k - 1) * 6;
        vView.setInt16(offset2, qx, true);
        vView.setInt16(offset2 + 2, qy, true);
        vView.setInt16(offset2 + 4, qz, true);
      }
    }
    parts.push(vertBuf);
    const normBuf = new ArrayBuffer(vertCount * 4);
    const normView = new DataView(normBuf);
    for (let k = 0; k < vertCount; k++) {
      let nx = 0, ny = 0, nz = 1;
      if (normAttr) {
        nx = normAttr.getX(k);
        ny = normAttr.getY(k);
        nz = normAttr.getZ(k);
      }
      const packNormal = (x, y, z) => {
        const bias = (v) => Math.max(0, Math.min(1023, Math.round((v + 1) * 511)));
        return bias(x) << 20 | bias(y) << 10 | bias(z);
      };
      normView.setUint32(k * 4, packNormal(nx, ny, nz), true);
    }
    parts.push(normBuf);
    const indexCount = indexAttr ? indexAttr.count : vertCount;
    const indexSize = vertCount <= 255 ? 1 : vertCount <= 65535 ? 2 : 4;
    const indexBuf = new ArrayBuffer(indexCount * indexSize);
    const idxView = new DataView(indexBuf);
    if (indexAttr) {
      for (let k = 0; k < indexCount; k++) {
        const idx = indexAttr.getX(k);
        if (indexSize === 1) idxView.setUint8(k, idx);
        else if (indexSize === 2) idxView.setUint16(k * 2, idx, true);
        else idxView.setUint32(k * 4, idx, true);
      }
    } else {
      for (let k = 0; k < indexCount; k++) {
        if (indexSize === 1) idxView.setUint8(k, k);
        else if (indexSize === 2) idxView.setUint16(k * 2, k, true);
        else idxView.setUint32(k * 4, k, true);
      }
    }
    parts.push(indexBuf);
    const mat = mesh.material;
    const hex = mat.color ? mat.color.getHex() : 16777215;
    const colorIdx = colorMap.get(hex.toString()) || 0;
    const colorIdxBuf = new ArrayBuffer(4);
    new DataView(colorIdxBuf).setUint32(0, colorIdx, true);
    parts.push(colorIdxBuf);
    const instBuf = new ArrayBuffer(4);
    new DataView(instBuf).setUint32(0, 0, true);
    parts.push(instBuf);
  }
  onProgress("完成LMB文件...");
  const totalSize = parts.reduce((sum, buf) => sum + buf.byteLength, 0);
  const finalBuffer = new ArrayBuffer(totalSize);
  const finalView = new Uint8Array(finalBuffer);
  let offset = 0;
  for (const buf of parts) {
    finalView.set(new Uint8Array(buf), offset);
    offset += buf.byteLength;
  }
  return new Blob([finalBuffer], { type: "application/octet-stream" });
}

const themes = {
  dark: {
    bg: "#1b1b1c",
    panelBg: "#252526",
    headerBg: "#2d2d30",
    border: "#3f3f46",
    text: "#f1f1f1",
    textLight: "#ffffff",
    textMuted: "#999999",
    accent: "#007acc",
    highlight: "#3e3e42",
    itemHover: "rgba(255, 255, 255, 0.1)",
    success: "#4ec9b0",
    warning: "#ce9178",
    danger: "#f48771",
    canvasBg: "#1e1e1e",
    shadow: "rgba(0, 0, 0, 0.5)"
  },
  light: {
    bg: "#ffffff",
    // Office 2013 White
    panelBg: "#ffffff",
    headerBg: "#f3f3f3",
    // Light gray for tabs area
    border: "#d2d2d2",
    // Office 2013 border color
    text: "#444444",
    textLight: "#000000",
    textMuted: "#666666",
    accent: "#2b579a",
    // Office 2013 Blue (Word style)
    highlight: "#cfe3ff",
    itemHover: "#e1e1e1",
    success: "#217346",
    // Excel green
    warning: "#d24726",
    // PPT orange
    danger: "#a4262c",
    canvasBg: "#ffffff",
    shadow: "rgba(0, 0, 0, 0.15)"
  }
};
const DEFAULT_FONT = "'Segoe UI', 'Microsoft YaHei', sans-serif";
const createGlobalStyle = (theme) => `
    @keyframes fadeInDown {
        from { opacity: 0; transform: translate(-50%, -20px); }
        to { opacity: 1; transform: translate(-50%, 0); }
    }
    @keyframes slideInRight {
        from { opacity: 0; transform: translateX(100%); }
        to { opacity: 1; transform: translateX(0); }
    }
    ::-webkit-scrollbar { width: 12px; height: 12px; }
    ::-webkit-scrollbar-track { background: ${theme.bg}; }
    ::-webkit-scrollbar-thumb { background: #c2c2c2; border: 3px solid ${theme.bg}; border-radius: 0px; }
    ::-webkit-scrollbar-thumb:hover { background: #a8a8a8; }
    ::-webkit-scrollbar-corner { background: ${theme.bg}; }
    * { scrollbar-width: thin; scrollbar-color: #c2c2c2 ${theme.bg}; }
    body { background-color: ${theme.bg}; color: ${theme.text}; margin: 0; padding: 0; overflow: hidden; font-family: ${DEFAULT_FONT}; -webkit-font-smoothing: antialiased; }
    * { box-sizing: border-box; }
`;
const createStyles = (theme) => ({
  // Desktop / Shared
  container: { display: "flex", flexDirection: "column", height: "100%", width: "100%", backgroundColor: theme.bg, color: theme.text, fontSize: "11px", fontFamily: DEFAULT_FONT, userSelect: "none", overflow: "hidden" },
  // Classic Menu Styles
  classicMenuBar: {
    display: "flex",
    alignItems: "center",
    backgroundColor: theme.bg,
    borderBottom: `1px solid ${theme.border}`,
    padding: "0 8px",
    height: "24px",
    gap: "4px",
    WebkitAppRegion: "no-drag"
  },
  classicMenuItem: (active, hover) => ({
    padding: "0 10px",
    height: "100%",
    display: "flex",
    alignItems: "center",
    fontSize: "12px",
    color: theme.text,
    cursor: "pointer",
    backgroundColor: active ? theme.highlight : hover ? "rgba(128, 128, 128, 0.1)" : "transparent",
    transition: "background-color 0.1s"
  }),
  classicMenuDropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    backgroundColor: theme.panelBg,
    border: `1px solid ${theme.border}`,
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    zIndex: 2e3,
    minWidth: "160px",
    padding: "4px 0"
  },
  classicMenuSubItem: (hover) => ({
    padding: "6px 16px",
    fontSize: "12px",
    color: theme.text,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: hover ? theme.itemHover : "transparent"
  }),
  statusBar: {
    height: "20px",
    backgroundColor: "#ffffff",
    color: "#444444",
    display: "flex",
    alignItems: "center",
    padding: "0 12px",
    fontSize: "12px",
    justifyContent: "space-between",
    borderTop: `1px solid ${theme.border}`
  },
  statusBarRight: {
    display: "flex",
    alignItems: "center",
    gap: "16px"
  },
  statusMonitorItem: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontFamily: "'Segoe UI', monospace",
    opacity: 0.9
  },
  toolbarBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "24px",
    height: "24px",
    borderRadius: "0px",
    cursor: "pointer",
    color: theme.textMuted,
    backgroundColor: "transparent",
    transition: "all 0.1s ease",
    border: "none",
    outline: "none",
    position: "relative",
    WebkitAppRegion: "no-drag"
  },
  toolbarBtnHover: {
    backgroundColor: theme.itemHover,
    color: theme.text
  },
  // Checkbox Style
  checkboxContainer: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    cursor: "pointer",
    userSelect: "none",
    fontSize: "12px",
    color: theme.text,
    padding: "2px 0"
  },
  checkboxCustom: (checked) => ({
    width: "16px",
    height: "16px",
    borderRadius: "2px",
    border: `1px solid ${checked ? theme.accent : theme.border}`,
    backgroundColor: checked ? theme.accent : "transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
    position: "relative",
    cursor: "pointer"
  }),
  checkboxCheckmark: {
    width: "10px",
    height: "10px",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  floatingPanel: {
    position: "absolute",
    backgroundColor: theme.panelBg,
    border: `1px solid ${theme.border}`,
    boxShadow: theme.bg === "#ffffff" ? "0 10px 30px rgba(0,0,0,0.1)" : "0 10px 30px rgba(0,0,0,0.4)",
    borderRadius: "4px",
    display: "flex",
    flexDirection: "column",
    zIndex: 200,
    minWidth: "220px",
    minHeight: "120px",
    overflow: "hidden",
    color: theme.text
  },
  floatingHeader: {
    padding: "8px 12px",
    backgroundColor: theme.headerBg,
    borderBottom: `1px solid ${theme.border}`,
    cursor: "default",
    fontWeight: "600",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    userSelect: "none",
    fontSize: "12px",
    color: theme.text
  },
  floatingContent: {
    padding: "0",
    overflowY: "auto",
    flex: 1,
    position: "relative",
    display: "flex",
    flexDirection: "column"
  },
  resizeHandle: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: "12px",
    height: "12px",
    cursor: "se-resize",
    zIndex: 10,
    background: "transparent"
  },
  // Tree Styles
  treeContainer: {
    flex: 1,
    height: "100%",
    overflowY: "auto",
    overflowX: "hidden",
    padding: "2px 0"
  },
  treeNode: {
    display: "flex",
    alignItems: "center",
    height: "20px",
    cursor: "pointer",
    whiteSpace: "nowrap",
    fontSize: "12px",
    color: theme.text,
    transition: "background-color 0.1s ease",
    paddingRight: "8px"
  },
  treeNodeSelected: {
    backgroundColor: theme.highlight,
    color: theme.accent,
    fontWeight: "600"
  },
  expander: {
    width: "20px",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: theme.textMuted
  },
  nodeLabel: {
    flex: 1,
    overflow: "hidden",
    textOverflow: "ellipsis"
  },
  // Properties
  list: {
    flex: 1,
    overflowY: "auto",
    padding: "0",
    userSelect: "text"
  },
  propGroupTitle: {
    backgroundColor: theme.headerBg,
    padding: "4px 12px",
    fontWeight: "600",
    fontSize: "11px",
    color: theme.text,
    borderBottom: `1px solid ${theme.border}`,
    borderTop: `1px solid ${theme.border}`,
    marginTop: "-1px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    userSelect: "none"
  },
  propRow: {
    display: "flex",
    padding: "4px 12px",
    borderBottom: `1px solid ${theme.border}40`,
    alignItems: "center",
    fontSize: "11px",
    gap: "8px"
  },
  propKey: {
    width: "40%",
    color: theme.textMuted,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  },
  propValue: {
    width: "60%",
    color: theme.text,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    cursor: "text"
  },
  // UI Elements
  btn: {
    backgroundColor: theme.bg,
    color: theme.text,
    border: `1px solid ${theme.border}`,
    padding: "2px 8px",
    cursor: "pointer",
    borderRadius: "0px",
    fontSize: "12px",
    fontWeight: "400",
    transition: "all 0.1s",
    outline: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center"
  },
  btnActive: {
    backgroundColor: theme.accent,
    color: "#ffffff",
    borderColor: theme.accent
  },
  // View Grid Button
  viewGridBtn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.bg,
    border: `1px solid ${theme.border}`,
    borderRadius: "0px",
    padding: "4px",
    cursor: "pointer",
    transition: "all 0.1s",
    color: theme.text,
    fontSize: "11px",
    height: "56px",
    gap: "4px"
  },
  // Modal Overlay
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.bg === "#ffffff" ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2e3
  },
  modalContent: {
    backgroundColor: theme.panelBg,
    border: `1px solid ${theme.accent}`,
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    borderRadius: "0px",
    display: "flex",
    flexDirection: "column",
    width: "400px",
    maxHeight: "80vh",
    overflow: "hidden",
    color: theme.text
  },
  // Loading
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.bg === "#ffffff" ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.8)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 3e3
  },
  progressBox: {
    width: "320px",
    backgroundColor: theme.panelBg,
    padding: "20px",
    borderRadius: "0px",
    border: `1px solid ${theme.accent}`,
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    color: theme.text
  },
  progressBarContainer: {
    height: "4px",
    backgroundColor: theme.bg,
    borderRadius: "0px",
    overflow: "hidden",
    marginTop: "12px"
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: theme.accent,
    transition: "width 0.2s ease-out"
  },
  // Slider
  sliderRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "8px"
  },
  sliderLabel: {
    fontSize: "11px",
    color: theme.textMuted,
    width: "60px"
  },
  rangeSlider: {
    flex: 1,
    cursor: "pointer",
    height: "4px",
    outline: "none"
  },
  // Stats HUD (Top Center)
  statsOverlay: {
    position: "absolute",
    top: "8px",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: theme.panelBg,
    color: theme.text,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "10px",
    padding: "4px 12px",
    fontSize: "11px",
    zIndex: 100,
    pointerEvents: "none",
    borderRadius: "0px",
    border: `1px solid ${theme.border}`,
    boxShadow: `0 2px 8px ${theme.shadow}`
  },
  statsRow: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    whiteSpace: "nowrap"
  },
  statsDivider: {
    width: "1px",
    height: "10px",
    backgroundColor: theme.border
  }
});
const colors = themes.dark;

const resources = {
  en: {
    home: "Home",
    menu_open_file: "Open File",
    menu_open_folder: "Open Folder",
    menu_open_url: "Open URL",
    menu_batch_convert: "Batch Convert NBIM",
    enter_filename: "Enter output filename",
    menu_file: "File",
    menu_export: "Export",
    interface_display: "Display",
    view: "View",
    menu_fit_view: "Fit View",
    view_top: "Top",
    view_bottom: "Bottom",
    view_front: "Front",
    view_back: "Back",
    view_left: "Left",
    view_right: "Right",
    view_se: "SE",
    view_sw: "SW",
    view_ne: "NE",
    view_nw: "NW",
    cube_top: "Top",
    cube_bottom: "Bottom",
    cube_front: "Front",
    cube_back: "Back",
    cube_left: "Left",
    cube_right: "Right",
    op_pick: "Pick",
    op_clear: "Clear",
    tool_measure: "Measure",
    tool: "Tools",
    tool_clip: "Section",
    settings: "Settings",
    setting_general: "Preferences",
    interface_outline: "Structures",
    interface_props: "Properties",
    status_ready: "Ready",
    loading: "Loading...",
    loading_resources: "Loading resources...",
    analyzing: "Analyzing...",
    converting: "Converting...",
    reading: "Reading...",
    downloading: "Downloading...",
    initializing: "Initializing...",
    parsing: "Parsing...",
    processing_geometry: "Processing Geometry...",
    loading_textures: "Loading Textures...",
    preparing_scene: "Preparing Scene...",
    fitting_view: "Fitting View...",
    model_loaded: "Model Loaded",
    loading_cad_engine: "Loading CAD Engine...",
    parsing_cad_data: "Parsing CAD Data...",
    creating_geometry: "Creating Geometry...",
    error_cad_parse_failed: "Failed to parse CAD data",
    tileset_initializing: "Initializing TilesRenderer...",
    tileset_structure_loaded: "Tileset structure loaded",
    tileset_tile_loaded: "Tile loaded: ",
    tileset_load_failed: "Load failed: Cannot fetch Tileset configuration, please check network or path.",
    error_no_tileset: "tileset.json not found in the selected folder",
    nbim_parsing_header: "Parsing NBIM Header...",
    nbim_reading_metadata: "Reading Metadata...",
    nbim_initializing_chunks: "Initializing Chunks...",
    nbim_generating: "Generating NBIM Data...",
    nbim_loading_chunk: "Loading Chunk: ",
    processing_chunk: "Processing Chunk",
    error_invalid_nbim: "Not a valid NBIM file",
    lmb_parsing_header: "Parsing LMB Header...",
    error_invalid_lmb: "Not a valid LMB file",
    unclassified_layer: "Unclassified Layer",
    success: "Operation Successful",
    failed: "Failed",
    processing: "Processing",
    no_selection: "No selection",
    no_measurements: "No measurements",
    search_nodes: "Search nodes...",
    search_props: "Search properties...",
    monitor_meshes: "Meshes",
    monitor_faces: "Faces",
    monitor_mem: "Mem",
    monitor_calls: "Calls",
    expand_all: "Expand All",
    collapse_all: "Collapse All",
    delete_model: "Delete Model",
    confirm_delete: "Confirm delete",
    confirm_clear: "Are you sure you want to clear the scene?",
    app_title: "3D Browser - Professional Viewer",
    interface_display_short: "Display",
    view_perspective: "Perspective",
    view_ortho: "Orthographic",
    writing: "Writing files...",
    no_models: "No models found",
    delete_item: "Delete Item",
    btn_confirm: "Confirm",
    btn_cancel: "Cancel",
    // 属性
    pg_basic: "Basic Info",
    pg_geo: "Geometry Info",
    pg_ifc: "IFC Properties",
    prop_name: "Name",
    prop_id: "ID",
    prop_type: "Type",
    prop_pos: "Position",
    prop_dim: "Dimensions",
    prop_inst: "Instances",
    prop_vert: "Vertices",
    prop_tri: "Triangles",
    // 测量
    measure_title: "Measurement Tool",
    measure_type: "Type",
    measure_none: "None",
    measure_dist: "Distance",
    measure_angle: "Angle",
    measure_coord: "Coordinate",
    measure_instruct_dist: "Click 2 points to measure distance.",
    measure_instruct_angle: "Click 3 points (Start-Vertex-End).",
    measure_instruct_coord: "Click any point to get coordinates.",
    measure_clear: "Clear All",
    measure_start: "Start",
    measure_stop: "Stop",
    // 剖切
    clip_title: "Sectioning Tool",
    clip_enable: "Enable Clipping",
    clip_x: "X Axis",
    clip_y: "Y Axis",
    clip_z: "Z Axis",
    // 导出
    export_title: "Export Scene",
    export_format: "Format",
    export_glb: "GLB (Standard)",
    export_lmb: "LMB (Custom Compressed)",
    export_3dtiles: "3D Tiles (Web)",
    export_nbim: "NBIM (High Performance)",
    export_btn: "Export",
    // 设置
    st_lighting: "Lighting",
    st_ambient: "Ambient Int.",
    st_dir: "Direct Int.",
    st_bg: "Background Color",
    st_lang: "Language",
    st_theme: "Theme",
    st_monitor: "Performance Monitor",
    st_viewport: "Viewport Settings",
    st_viewcube_size: "ViewCube Size",
    unsupported_format: "Unsupported format",
    theme_dark: "Dark",
    theme_light: "Light",
    ready: "ready",
    all_chunks_loaded: "All model chunks loaded",
    loading_chunks: "Chunks",
    confirm_clear_title: "Clear Scene",
    confirm_clear_msg: "Are you sure you want to clear all models in the scene?",
    menu_about: "About",
    about_title: "About 3D Browser",
    about_author: "Author",
    about_license: "License",
    about_license_nc: "Non-commercial Use Only",
    error_title: "Application Error",
    error_msg: "Sorry, the application encountered an unexpected error. You can try reloading the page or contact the developer.",
    error_reload: "Reload Page"
  },
  zh: {
    home: "首页",
    view_home: "主视图",
    menu_open_file: "打开文件",
    menu_open_folder: "打开目录",
    menu_open_url: "打开 URL",
    menu_batch_convert: "批量转换 NBIM",
    enter_filename: "输入输出文件名",
    menu_file: "文件",
    menu_export: "导出场景",
    interface_display: "界面",
    view: "视图",
    menu_fit_view: "充满视图",
    view_top: "顶视",
    view_bottom: "底视",
    view_front: "前视",
    view_back: "后视",
    view_left: "左视",
    view_right: "右视",
    view_se: "东南",
    view_sw: "西南",
    view_ne: "东北",
    view_nw: "西北",
    cube_top: "顶",
    cube_bottom: "底",
    cube_front: "前",
    cube_back: "后",
    cube_left: "左",
    cube_right: "右",
    op_pick: "选取模型",
    op_clear: "清空场景",
    tool: "工具",
    tool_measure: "测量",
    tool_clip: "剖切",
    settings: "设置",
    setting_general: "全局设置",
    interface_outline: "模型结构",
    interface_props: "对象属性",
    status_ready: "准备就绪",
    loading: "正在加载...",
    loading_resources: "正在加载资源...",
    analyzing: "正在分析...",
    converting: "正在转换...",
    reading: "正在读取...",
    downloading: "正在下载...",
    initializing: "正在初始化...",
    parsing: "正在解析...",
    processing_geometry: "正在处理几何数据...",
    loading_textures: "正在加载贴图...",
    preparing_scene: "正在准备场景...",
    fitting_view: "正在自适应视图...",
    model_loaded: "模型加载完成",
    loading_cad_engine: "正在加载 CAD 引擎...",
    parsing_cad_data: "正在解析 CAD 数据...",
    creating_geometry: "正在创建几何体...",
    error_cad_parse_failed: "解析 CAD 数据失败",
    tileset_initializing: "正在初始化 TilesRenderer...",
    tileset_structure_loaded: "Tileset 结构已加载",
    tileset_tile_loaded: "已加载瓦片: ",
    tileset_load_failed: "加载失败: 无法获取 Tileset 配置文件，请检查网络或路径。",
    error_no_tileset: "在所选文件夹中未找到 tileset.json",
    nbim_parsing_header: "正在解析 NBIM 文件头...",
    nbim_reading_metadata: "正在读取元数据...",
    nbim_initializing_chunks: "正在初始化分块...",
    nbim_generating: "正在生成 NBIM 数据...",
    nbim_loading_chunk: "正在加载分块: ",
    processing_chunk: "正在处理分块",
    error_invalid_nbim: "不是有效的 NBIM 文件",
    lmb_parsing_header: "正在解析 LMB 文件头...",
    error_invalid_lmb: "不是有效的 LMB 文件",
    unclassified_layer: "未分类图层",
    success: "操作成功",
    failed: "失败",
    processing: "处理中",
    no_selection: "未选择对象",
    no_measurements: "无测量结果",
    search_nodes: "搜索节点...",
    search_props: "搜索属性...",
    monitor_meshes: "网格数",
    monitor_faces: "三角面",
    monitor_mem: "显存",
    monitor_calls: "绘制调用",
    expand_all: "全部展开",
    collapse_all: "全部折叠",
    delete_model: "删除模型",
    confirm_delete: "确定要删除吗？",
    confirm_clear: "确定要清空场景吗？",
    app_title: "3D Browser - 专业浏览器",
    interface_display_short: "显示",
    view_perspective: "透视",
    view_ortho: "正交",
    writing: "正在写入文件...",
    no_models: "未找到模型数据",
    delete_item: "删除项目",
    btn_confirm: "确定",
    btn_cancel: "取消",
    // 属性
    pg_basic: "基本信息",
    pg_geo: "几何信息",
    pg_ifc: "IFC 属性",
    prop_name: "名称",
    prop_id: "ID",
    prop_type: "类型",
    prop_pos: "位置",
    prop_dim: "尺寸",
    prop_inst: "实例数",
    prop_vert: "顶点数",
    prop_tri: "面数",
    // 测量
    measure_title: "测量面板",
    measure_type: "测量类型",
    measure_none: "无",
    measure_dist: "长度测量",
    measure_angle: "角度测量",
    measure_coord: "坐标测量",
    measure_instruct_dist: "请在场景中点击两个点以测量距离。",
    measure_instruct_angle: "请点击三个点测量角度 (起点-顶点-终点)。",
    measure_instruct_coord: "点击任意位置获取世界坐标。",
    measure_clear: "清空测量",
    measure_start: "开始测量",
    measure_stop: "停止测量",
    // 剖切
    clip_title: "剖切面板",
    clip_enable: "开启剖切",
    clip_x: "X 轴",
    clip_y: "Y 轴",
    clip_z: "Z 轴",
    // 导出
    export_title: "导出场景",
    export_format: "导出格式",
    export_glb: "GLB (标准通用)",
    export_lmb: "LMB (自定义压缩)",
    export_3dtiles: "3D Tiles (Web大模型)",
    export_nbim: "NBIM (高性能分块模型)",
    export_btn: "开始导出",
    // 设置
    st_lighting: "场景光照",
    st_ambient: "环境光强度",
    st_dir: "直射光强度",
    st_bg: "背景颜色",
    st_lang: "界面语言",
    st_theme: "界面主题",
    st_monitor: "显示性能面板",
    st_viewport: "视口设置",
    st_viewcube_size: "导航方块大小",
    unsupported_format: "不支持的文件格式",
    theme_dark: "深色模式",
    theme_light: "浅色模式",
    ready: "准备就绪",
    all_chunks_loaded: "所有模型分片已加载",
    loading_chunks: "分片",
    confirm_clear_title: "清空场景",
    confirm_clear_msg: "确定要清空场景中的所有模型吗？",
    menu_about: "关于",
    about_title: "关于 3D Browser",
    about_author: "作者",
    about_license: "授权协议",
    about_license_nc: "仅限非商业用途",
    error_title: "应用发生错误",
    error_msg: "抱歉，程序运行过程中遇到了未预期的错误。您可以尝试重新加载页面，或联系开发人员。",
    error_reload: "重新加载页面"
  }
};
const getTranslation = (lang, key) => {
  return resources[lang][key] || key;
};

async function performBatchConvert({
  files,
  t,
  filename,
  onProgress,
  libPath
}) {
  return await SceneManager.batchConvert(files, t, filename, onProgress, libPath);
}

const ClassicMenuItem = ({ label, children, styles, theme, enabled = true }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const menuRef = useRef(null);
  const closeMenu = () => {
    setIsOpen(false);
    setHover(false);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const itemStyle = {
    ...styles.classicMenuItem(isOpen, hover),
    opacity: enabled ? 1 : 0.5,
    cursor: enabled ? "pointer" : "not-allowed",
    pointerEvents: enabled ? "auto" : "none"
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: menuRef,
      style: { position: "relative", height: "100%" },
      onMouseEnter: () => enabled && setHover(true),
      onMouseLeave: () => setHover(false),
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            style: itemStyle,
            onClick: () => enabled && setIsOpen(!isOpen),
            children: label
          }
        ),
        isOpen && enabled && /* @__PURE__ */ jsx("div", { style: styles.classicMenuDropdown, children: children(closeMenu) })
      ]
    }
  );
};
const ClassicSubItem = ({ label, onClick, styles, enabled = true, checked }) => {
  const [hover, setHover] = useState(false);
  const itemStyle = {
    ...styles.classicMenuSubItem(hover),
    opacity: enabled ? 1 : 0.5,
    cursor: enabled ? "pointer" : "not-allowed",
    pointerEvents: enabled ? "auto" : "none"
  };
  return /* @__PURE__ */ jsx(
    "div",
    {
      style: itemStyle,
      onClick: () => {
        if (enabled) {
          setHover(false);
          onClick();
        }
      },
      onMouseEnter: () => enabled && setHover(true),
      onMouseLeave: () => setHover(false),
      children: /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [
        checked !== void 0 && /* @__PURE__ */ jsx("div", { style: styles.checkboxCustom(checked), children: checked && /* @__PURE__ */ jsx("div", { style: styles.checkboxCheckmark, children: "✓" }) }),
        label
      ] })
    }
  );
};
const MenuBar = (props) => {
  const {
    t,
    styles,
    theme,
    hiddenMenus = []
  } = props;
  const isHidden = (id) => (hiddenMenus || []).includes(id);
  const fileInputRef = React.useRef(null);
  const folderInputRef = React.useRef(null);
  return /* @__PURE__ */ jsxs("div", { style: styles.classicMenuBar, children: [
    /* @__PURE__ */ jsx(
      "input",
      {
        type: "file",
        ref: fileInputRef,
        style: { display: "none" },
        multiple: true,
        accept: ".lmb,.lmbz,.glb,.gltf,.ifc,.nbim,.fbx,.obj,.stl,.ply,.3ds,.dae,.stp,.step,.igs,.iges",
        onChange: props.handleOpenFiles
      }
    ),
    /* @__PURE__ */ jsx(
      "input",
      {
        type: "file",
        ref: folderInputRef,
        style: { display: "none" },
        ...{ webkitdirectory: "", directory: "" },
        accept: ".lmb,.lmbz,.glb,.gltf,.ifc,.nbim,.fbx,.obj,.stl,.ply,.3ds,.dae,.stp,.step,.igs,.iges",
        onChange: props.handleOpenFolder
      }
    ),
    !isHidden("file") && /* @__PURE__ */ jsx(ClassicMenuItem, { label: t("menu_file"), styles, theme, children: (close) => /* @__PURE__ */ jsxs(Fragment, { children: [
      !isHidden("open_file") && /* @__PURE__ */ jsx(ClassicSubItem, { label: t("menu_open_file"), onClick: () => {
        fileInputRef.current?.click();
        close();
      }, styles }),
      !isHidden("open_folder") && /* @__PURE__ */ jsx(ClassicSubItem, { label: t("menu_open_folder"), onClick: () => {
        folderInputRef.current?.click();
        close();
      }, styles }),
      !isHidden("open_url") && /* @__PURE__ */ jsx(ClassicSubItem, { label: t("menu_open_url"), onClick: () => {
        props.handleOpenUrl();
        close();
      }, styles }),
      !isHidden("export") && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("div", { style: { height: "1px", backgroundColor: theme.border, margin: "4px 0" } }),
        /* @__PURE__ */ jsx(ClassicSubItem, { label: t("menu_export"), onClick: () => {
          props.setActiveTool("export");
          close();
        }, styles })
      ] }),
      !isHidden("clear") && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("div", { style: { height: "1px", backgroundColor: theme.border, margin: "4px 0" } }),
        /* @__PURE__ */ jsx(ClassicSubItem, { label: t("op_clear"), onClick: () => {
          props.handleClear();
          close();
        }, styles })
      ] })
    ] }) }),
    !isHidden("view") && /* @__PURE__ */ jsx(ClassicMenuItem, { label: t("view"), styles, theme, children: (close) => /* @__PURE__ */ jsxs(Fragment, { children: [
      !isHidden("fit_view") && /* @__PURE__ */ jsx(ClassicSubItem, { label: t("menu_fit_view"), onClick: () => {
        props.sceneMgr?.fitView();
        close();
      }, styles }),
      !isHidden("views") && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("div", { style: { height: "1px", backgroundColor: theme.border, margin: "4px 0" } }),
        /* @__PURE__ */ jsx(ClassicSubItem, { label: t("view_front"), onClick: () => {
          props.handleView("front");
          close();
        }, styles }),
        /* @__PURE__ */ jsx(ClassicSubItem, { label: t("view_back"), onClick: () => {
          props.handleView("back");
          close();
        }, styles }),
        /* @__PURE__ */ jsx(ClassicSubItem, { label: t("view_top"), onClick: () => {
          props.handleView("top");
          close();
        }, styles }),
        /* @__PURE__ */ jsx(ClassicSubItem, { label: t("view_bottom"), onClick: () => {
          props.handleView("bottom");
          close();
        }, styles }),
        /* @__PURE__ */ jsx(ClassicSubItem, { label: t("view_left"), onClick: () => {
          props.handleView("left");
          close();
        }, styles }),
        /* @__PURE__ */ jsx(ClassicSubItem, { label: t("view_right"), onClick: () => {
          props.handleView("right");
          close();
        }, styles }),
        /* @__PURE__ */ jsx("div", { style: { height: "1px", backgroundColor: theme.border, margin: "4px 0" } }),
        /* @__PURE__ */ jsx(ClassicSubItem, { label: t("view_se"), onClick: () => {
          props.handleView("se");
          close();
        }, styles }),
        /* @__PURE__ */ jsx(ClassicSubItem, { label: t("view_sw"), onClick: () => {
          props.handleView("sw");
          close();
        }, styles }),
        /* @__PURE__ */ jsx(ClassicSubItem, { label: t("view_ne"), onClick: () => {
          props.handleView("ne");
          close();
        }, styles }),
        /* @__PURE__ */ jsx(ClassicSubItem, { label: t("view_nw"), onClick: () => {
          props.handleView("nw");
          close();
        }, styles })
      ] })
    ] }) }),
    !isHidden("interface") && /* @__PURE__ */ jsx(ClassicMenuItem, { label: t("interface_display"), styles, theme, children: (close) => /* @__PURE__ */ jsxs(Fragment, { children: [
      !isHidden("outline") && /* @__PURE__ */ jsx(ClassicSubItem, { label: t("interface_outline"), checked: props.showOutline, onClick: () => {
        props.setShowOutline(!props.showOutline);
        close();
      }, styles }),
      !isHidden("props") && /* @__PURE__ */ jsx(ClassicSubItem, { label: t("interface_props"), checked: props.showProps, onClick: () => {
        props.setShowProps(!props.showProps);
        close();
      }, styles }),
      !isHidden("stats") && /* @__PURE__ */ jsx(ClassicSubItem, { label: t("st_monitor"), checked: props.showStats, onClick: () => {
        props.setShowStats(!props.showStats);
        close();
      }, styles }),
      !isHidden("pick") && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("div", { style: { height: "1px", backgroundColor: theme.border, margin: "4px 0" } }),
        /* @__PURE__ */ jsx(ClassicSubItem, { label: t("op_pick"), checked: props.pickEnabled, onClick: () => {
          props.setPickEnabled(!props.pickEnabled);
          close();
        }, styles })
      ] })
    ] }) }),
    !isHidden("tool") && /* @__PURE__ */ jsx(ClassicMenuItem, { label: t("tool"), styles, theme, children: (close) => /* @__PURE__ */ jsxs(Fragment, { children: [
      !isHidden("measure") && /* @__PURE__ */ jsx(ClassicSubItem, { label: t("tool_measure"), onClick: () => {
        props.setActiveTool("measure");
        close();
      }, styles }),
      !isHidden("clip") && /* @__PURE__ */ jsx(ClassicSubItem, { label: t("tool_clip"), onClick: () => {
        props.setActiveTool("clip");
        close();
      }, styles })
    ] }) }),
    !isHidden("settings_panel") && /* @__PURE__ */ jsx(ClassicMenuItem, { label: t("settings"), styles, theme, children: (close) => /* @__PURE__ */ jsxs(Fragment, { children: [
      !isHidden("settings") && /* @__PURE__ */ jsx(ClassicSubItem, { label: t("settings"), onClick: () => {
        props.setActiveTool("settings");
        close();
      }, styles }),
      !isHidden("about") && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("div", { style: { height: "1px", backgroundColor: theme.border, margin: "4px 0" } }),
        /* @__PURE__ */ jsx(ClassicSubItem, { label: t("menu_about"), onClick: () => {
          props.onOpenAbout();
          close();
        }, styles })
      ] })
    ] }) })
  ] });
};

const iconSize = 18;
const iconStrokeWidth = 1.5;
const withThemeIcon = (Icon, props) => {
  const { size, color, ...rest } = props;
  return /* @__PURE__ */ jsx(
    Icon,
    {
      size: size || iconSize,
      strokeWidth: iconStrokeWidth,
      color: color || "currentColor",
      ...rest
    }
  );
};
const IconChevronRight = (props) => withThemeIcon(ChevronRight, props);
const IconChevronDown = (props) => withThemeIcon(ChevronDown, props);
const IconClear = (props) => withThemeIcon(Trash2, props);
const IconClose = (props) => withThemeIcon(X, props);

const Button = ({
  children,
  variant = "primary",
  active,
  styles,
  theme,
  style,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return active ? styles.btnActive : styles.btn;
      case "danger":
        return { ...styles.btn, backgroundColor: theme.danger, borderColor: theme.danger, color: "white" };
      case "ghost":
        return { ...styles.btn, backgroundColor: "transparent", borderColor: "transparent", boxShadow: "none" };
      default:
        return styles.btn;
    }
  };
  const baseStyle = {
    ...getVariantStyles(),
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    transition: "all 0.2s",
    border: variant === "ghost" ? "none" : active ? `1px solid ${theme.accent}` : `1px solid ${theme.border}`,
    boxShadow: variant === "ghost" ? "none" : "none",
    // Remove default black border/shadow if requested
    ...style
  };
  return /* @__PURE__ */ jsx("button", { style: baseStyle, ...props, children });
};
const PanelSection = ({ title, children, theme, style }) => /* @__PURE__ */ jsxs("div", { style: { marginBottom: 16, ...style }, children: [
  title && /* @__PURE__ */ jsxs("div", { style: {
    fontSize: 11,
    fontWeight: "bold",
    color: theme.textMuted,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    marginBottom: 8,
    display: "flex",
    alignItems: "center",
    gap: 8
  }, children: [
    title,
    /* @__PURE__ */ jsx("div", { style: { flex: 1, height: 1, background: theme.border, opacity: 0.5 } })
  ] }),
  children
] });
const SLIDER_TRACK_HEIGHT = 4;
const SLIDER_THUMB_SIZE = 14;
const Slider = ({ min, max, step = 1, value, onChange, theme, disabled, style }) => {
  return /* @__PURE__ */ jsxs("div", { style: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    height: 32,
    padding: "0 4px",
    opacity: disabled ? 0.5 : 1,
    ...style
  }, children: [
    /* @__PURE__ */ jsx(
      "input",
      {
        type: "range",
        min,
        max,
        step,
        value,
        disabled,
        onChange: (e) => onChange(parseFloat(e.target.value)),
        style: {
          flex: 1,
          cursor: disabled ? "not-allowed" : "pointer",
          height: SLIDER_TRACK_HEIGHT,
          appearance: "none",
          WebkitAppearance: "none",
          background: theme.border,
          borderRadius: SLIDER_TRACK_HEIGHT / 2,
          outline: "none"
        }
      }
    ),
    /* @__PURE__ */ jsx("style", { dangerouslySetInnerHTML: { __html: `
                input[type=range]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    height: ${SLIDER_THUMB_SIZE}px;
                    width: ${SLIDER_THUMB_SIZE}px;
                    border-radius: 50%;
                    background: #fff;
                    cursor: pointer;
                    border: 2px solid ${theme.accent};
                    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
                    margin-top: 0;
                }
                input[type=range]::-moz-range-thumb {
                    height: ${SLIDER_THUMB_SIZE}px;
                    width: ${SLIDER_THUMB_SIZE}px;
                    border-radius: 50%;
                    background: #fff;
                    cursor: pointer;
                    border: 2px solid ${theme.accent};
                    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
                }
            ` } })
  ] });
};
const DualSlider = ({ min, max, value, onChange, theme, disabled, style }) => {
  const trackRef = React.useRef(null);
  const getPercentage = (val) => (val - min) / (max - min) * 100;
  const handleMouseDown = (index) => (e) => {
    if (disabled || e.button !== 0) return;
    e.preventDefault();
    const startX = e.clientX;
    const startVal = value[index];
    const trackWidth = trackRef.current?.getBoundingClientRect().width || 1;
    const onMove = (moveEvent) => {
      moveEvent.preventDefault();
      const dx = moveEvent.clientX - startX;
      const diff = dx / trackWidth * (max - min);
      let newVal = startVal + diff;
      newVal = Math.max(min, Math.min(max, newVal));
      const nextValue = [value[0], value[1]];
      if (index === 0) {
        nextValue[0] = Math.min(newVal, value[1]);
      } else {
        nextValue[1] = Math.max(newVal, value[0]);
      }
      onChange(nextValue);
    };
    const onUp = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };
  return /* @__PURE__ */ jsxs("div", { ref: trackRef, style: {
    position: "relative",
    width: "100%",
    height: 32,
    display: "flex",
    alignItems: "center",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    padding: "0 4px",
    ...style
  }, children: [
    /* @__PURE__ */ jsx("div", { style: {
      position: "absolute",
      left: 4,
      right: 4,
      height: SLIDER_TRACK_HEIGHT,
      background: theme.border,
      borderRadius: SLIDER_TRACK_HEIGHT / 2
    } }),
    /* @__PURE__ */ jsx("div", { style: {
      position: "absolute",
      left: `calc(4px + ${getPercentage(value[0])}%)`,
      width: `calc(${getPercentage(value[1]) - getPercentage(value[0])}%)`,
      height: SLIDER_TRACK_HEIGHT,
      background: theme.accent,
      borderRadius: SLIDER_TRACK_HEIGHT / 2
    } }),
    /* @__PURE__ */ jsx(
      "div",
      {
        onMouseDown: handleMouseDown(0),
        style: {
          position: "absolute",
          left: `calc(4px + ${getPercentage(value[0])}% - ${SLIDER_THUMB_SIZE / 2}px)`,
          width: SLIDER_THUMB_SIZE,
          height: SLIDER_THUMB_SIZE,
          background: "white",
          borderRadius: "50%",
          cursor: disabled ? "not-allowed" : "pointer",
          boxShadow: `0 1px 3px rgba(0,0,0,0.2)`,
          zIndex: 2,
          border: `2px solid ${theme.accent}`
        }
      }
    ),
    /* @__PURE__ */ jsx(
      "div",
      {
        onMouseDown: handleMouseDown(1),
        style: {
          position: "absolute",
          left: `calc(4px + ${getPercentage(value[1])}% - ${SLIDER_THUMB_SIZE / 2}px)`,
          width: SLIDER_THUMB_SIZE,
          height: SLIDER_THUMB_SIZE,
          background: "white",
          borderRadius: "50%",
          cursor: disabled ? "not-allowed" : "pointer",
          boxShadow: `0 1px 3px rgba(0,0,0,0.2)`,
          zIndex: 2,
          border: `2px solid ${theme.accent}`
        }
      }
    )
  ] });
};

const FloatingPanel = ({ title, onClose, children, width = 300, height = 200, x = 100, y = 100, resizable = false, movable = true, styles, theme, storageId }) => {
  const panelRef = useRef(null);
  const [pos, setPos] = useState(() => {
    if (storageId) {
      try {
        const saved = localStorage.getItem(`panel_${storageId}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.pos && typeof parsed.pos.x === "number" && typeof parsed.pos.y === "number") {
            const loadedX = Math.min(Math.max(0, parsed.pos.x), window.innerWidth - 50);
            const loadedY = Math.min(Math.max(0, parsed.pos.y), window.innerHeight - 50);
            return { x: loadedX, y: loadedY };
          }
        }
      } catch (e) {
        console.error("Failed to load panel state", e);
      }
    }
    return { x, y };
  });
  const [size, setSize] = useState(() => {
    if (storageId && resizable) {
      try {
        const saved = localStorage.getItem(`panel_${storageId}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.size && typeof parsed.size.w === "number" && typeof parsed.size.h === "number") {
            return parsed.size;
          }
        }
      } catch (e) {
      }
    }
    return { w: width, h: height };
  });
  const isDragging = useRef(false);
  const isResizing = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const startPos = useRef({ x: 0, y: 0 });
  const startSize = useRef({ w: 0, h: 0 });
  const currentPosRef = useRef(pos);
  const currentSizeRef = useRef(size);
  const animationFrame = useRef(0);
  useEffect(() => {
    currentPosRef.current = pos;
  }, [pos]);
  useEffect(() => {
    currentSizeRef.current = size;
  }, [size]);
  useEffect(() => {
    const handleMove = (e) => {
      if (!isDragging.current && !isResizing.current) return;
      e.preventDefault();
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
      animationFrame.current = requestAnimationFrame(() => {
        const dx = e.clientX - dragStart.current.x;
        const dy = e.clientY - dragStart.current.y;
        if (isDragging.current) {
          let newX = startPos.current.x + dx;
          let newY = startPos.current.y + dy;
          let limitW = window.innerWidth;
          let limitH = window.innerHeight;
          if (panelRef.current?.parentElement) {
            limitW = panelRef.current.parentElement.clientWidth;
            limitH = panelRef.current.parentElement.clientHeight;
          }
          const maxX = limitW - size.w;
          const maxY = limitH - size.h;
          newX = Math.max(0, Math.min(newX, maxX));
          newY = Math.max(0, Math.min(newY, maxY));
          setPos({ x: newX, y: newY });
        } else if (isResizing.current) {
          setSize({
            w: Math.max(220, startSize.current.w + dx),
            h: Math.max(120, startSize.current.h + dy)
          });
        }
      });
    };
    const handleUp = () => {
      if ((isDragging.current || isResizing.current) && storageId) {
        try {
          const stateToSave = {
            pos: currentPosRef.current,
            size: currentSizeRef.current
          };
          localStorage.setItem(`panel_${storageId}`, JSON.stringify(stateToSave));
        } catch (e) {
          console.error("Failed to save panel state", e);
        }
      }
      isDragging.current = false;
      isResizing.current = false;
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
    };
    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleUp);
    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleUp);
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
    };
  }, [size, storageId]);
  const onHeaderDown = (e) => {
    if (e.button !== 0 || !movable) return;
    e.preventDefault();
    e.stopPropagation();
    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
    startPos.current = { ...pos };
  };
  const onResizeDown = (e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    isResizing.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
    startSize.current = { ...size };
  };
  return /* @__PURE__ */ jsxs("div", { ref: panelRef, style: { ...styles.floatingPanel, left: pos.x, top: pos.y, width: size.w, height: size.h }, children: [
    /* @__PURE__ */ jsxs("div", { style: { ...styles.floatingHeader, cursor: movable ? "move" : "default" }, onMouseDown: onHeaderDown, children: [
      /* @__PURE__ */ jsx("span", { children: title }),
      onClose && /* @__PURE__ */ jsx(
        "div",
        {
          onClick: (e) => {
            e.stopPropagation();
            onClose();
          },
          style: { cursor: "pointer", opacity: 0.8, display: "flex", padding: 4 },
          onMouseEnter: (e) => {
            e.currentTarget.style.backgroundColor = "#e81123";
            e.currentTarget.style.color = "white";
          },
          onMouseLeave: (e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "inherit";
          },
          children: /* @__PURE__ */ jsx(IconClose, { width: 16, height: 16 })
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { style: styles.floatingContent, children }),
    resizable && /* @__PURE__ */ jsx("div", { style: styles.resizeHandle, onMouseDown: onResizeDown })
  ] });
};
const Checkbox = ({ label, checked, onChange, styles, theme, style }) => {
  return /* @__PURE__ */ jsxs(
    "label",
    {
      style: {
        ...styles.checkboxContainer,
        ...style
      },
      onClick: (e) => {
        e.preventDefault();
        onChange(!checked);
      },
      children: [
        /* @__PURE__ */ jsx("div", { style: styles.checkboxCustom(checked), children: checked && /* @__PURE__ */ jsx("div", { style: styles.checkboxCheckmark, children: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "3", strokeLinecap: "round", strokeLinejoin: "round", style: { width: "100%", height: "100%" }, children: /* @__PURE__ */ jsx("polyline", { points: "20 6 9 17 4 12" }) }) }) }),
        label && /* @__PURE__ */ jsx("span", { style: { marginLeft: 8 }, children: label })
      ]
    }
  );
};
const MeasurePanel = ({ t, sceneMgr, measureType, setMeasureType, measureHistory, onDelete, onClear, onClose, styles, theme, highlightedId, onHighlight }) => {
  const groupedHistory = useMemo(() => {
    const groups = {
      "dist": [],
      "angle": [],
      "coord": []
    };
    measureHistory.forEach((item) => {
      if (groups[item.type]) groups[item.type].push(item);
    });
    return groups;
  }, [measureHistory]);
  const renderMeasureItem = (item) => /* @__PURE__ */ jsxs(
    "div",
    {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 16px",
        borderBottom: `1px solid ${theme.border}`,
        fontSize: 13,
        backgroundColor: highlightedId === item.id ? theme.highlight : "transparent",
        cursor: "pointer",
        transition: "background-color 0.2s"
      },
      onClick: () => onHighlight && onHighlight(item.id),
      children: [
        /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", flex: 1, marginRight: 8, overflow: "hidden" }, children: /* @__PURE__ */ jsx("span", { style: {
          color: highlightedId === item.id ? theme.accent : theme.text,
          fontFamily: "monospace",
          fontWeight: highlightedId === item.id ? "bold" : "normal",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis"
        }, children: item.val }) }),
        /* @__PURE__ */ jsx(
          "div",
          {
            style: { cursor: "pointer", opacity: 0.7, color: theme.danger, padding: 4, borderRadius: 4 },
            onClick: (e) => {
              e.stopPropagation();
              onDelete(item.id);
            },
            children: /* @__PURE__ */ jsx(IconClose, { width: 16, height: 16 })
          }
        )
      ]
    },
    item.id
  );
  const handleTypeChange = (type) => {
    setMeasureType(type);
    sceneMgr?.startMeasurement(type);
  };
  return /* @__PURE__ */ jsx(FloatingPanel, { title: t("measure_title"), onClose, width: 340, height: 580, resizable: true, styles, theme, storageId: "tool_measure", children: /* @__PURE__ */ jsxs("div", { style: { padding: "16px 16px 0 16px", display: "flex", flexDirection: "column", height: "100%" }, children: [
    /* @__PURE__ */ jsx(PanelSection, { title: t("measure_type"), theme, children: /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexWrap: "wrap", gap: 4 }, children: [
      /* @__PURE__ */ jsx(Button, { styles, theme, active: measureType === "none", onClick: () => handleTypeChange("none"), style: { flex: "1 1 45%", fontSize: 12, padding: "6px 0" }, children: t("measure_none") }),
      /* @__PURE__ */ jsx(Button, { styles, theme, active: measureType === "dist", onClick: () => handleTypeChange("dist"), style: { flex: "1 1 45%", fontSize: 12, padding: "6px 0" }, children: t("measure_dist") }),
      /* @__PURE__ */ jsx(Button, { styles, theme, active: measureType === "angle", onClick: () => handleTypeChange("angle"), style: { flex: "1 1 45%", fontSize: 12, padding: "6px 0" }, children: t("measure_angle") }),
      /* @__PURE__ */ jsx(Button, { styles, theme, active: measureType === "coord", onClick: () => handleTypeChange("coord"), style: { flex: "1 1 45%", fontSize: 12, padding: "6px 0" }, children: t("measure_coord") })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { style: { fontSize: 11, color: theme.textMuted, marginBottom: 12, minHeight: 32, padding: "0 4px", fontStyle: "italic", display: "flex", alignItems: "center" }, children: [
      measureType === "dist" && t("measure_instruct_dist"),
      measureType === "angle" && t("measure_instruct_angle"),
      measureType === "coord" && t("measure_instruct_coord"),
      measureType !== "none" && /* @__PURE__ */ jsx("span", { style: { marginLeft: "auto", color: theme.accent, fontWeight: "bold" }, children: "[ESC]退出" })
    ] }),
    /* @__PURE__ */ jsx("div", { style: {
      border: `1px solid ${theme.border}`,
      borderRadius: 4,
      backgroundColor: theme.bg,
      flex: 1,
      overflowY: "auto",
      marginBottom: 12
    }, children: measureHistory.length === 0 ? /* @__PURE__ */ jsx("div", { style: { padding: 40, textAlign: "center", color: theme.textMuted, fontSize: 12 }, children: t("no_measurements") }) : Object.entries(groupedHistory).map(([type, items]) => {
      if (items.length === 0) return null;
      return /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { style: {
          padding: "6px 12px",
          backgroundColor: theme.highlight,
          fontSize: 10,
          fontWeight: "bold",
          color: theme.accent,
          textTransform: "uppercase",
          borderBottom: `1px solid ${theme.border}`
        }, children: type === "dist" ? t("measure_dist") : type === "angle" ? t("measure_angle") : t("measure_coord") }),
        items.map(renderMeasureItem)
      ] }, type);
    }) }),
    /* @__PURE__ */ jsx("div", { style: { padding: "12px 0", borderTop: `1px solid ${theme.border}`, display: "flex", gap: 8, backgroundColor: theme.bg }, children: /* @__PURE__ */ jsxs(
      Button,
      {
        variant: "danger",
        styles,
        theme,
        onClick: onClear,
        style: { flex: 1, height: 36 },
        children: [
          /* @__PURE__ */ jsx(IconClear, { width: 16, height: 16 }),
          t("measure_clear")
        ]
      }
    ) })
  ] }) });
};
const ClipPanel = ({ t, onClose, clipEnabled, setClipEnabled, clipValues, setClipValues, clipActive, setClipActive, styles, theme }) => {
  const SliderRow = ({ axis, label }) => /* @__PURE__ */ jsxs("div", { style: { marginBottom: 28 }, children: [
    /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }, children: [
      /* @__PURE__ */ jsx(
        Checkbox,
        {
          label,
          checked: clipActive[axis],
          onChange: (v) => setClipActive({ ...clipActive, [axis]: v }),
          styles,
          theme,
          style: { fontWeight: "600", fontSize: 14 }
        }
      ),
      /* @__PURE__ */ jsxs("span", { style: {
        fontSize: 12,
        color: theme.accent,
        opacity: clipActive[axis] ? 1 : 0.5,
        fontFamily: "monospace",
        background: `${theme.accent}10`,
        padding: "3px 8px",
        borderRadius: 4,
        border: `1px solid ${theme.accent}30`,
        minWidth: "85px",
        textAlign: "center"
      }, children: [
        Math.round(clipValues[axis][0]),
        "% - ",
        Math.round(clipValues[axis][1]),
        "%"
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { style: { padding: "0 4px" }, children: /* @__PURE__ */ jsx(
      DualSlider,
      {
        min: 0,
        max: 100,
        value: clipValues[axis],
        onChange: (val) => setClipValues({ ...clipValues, [axis]: val }),
        theme,
        disabled: !clipActive[axis]
      }
    ) })
  ] });
  return /* @__PURE__ */ jsx(FloatingPanel, { title: t("clip_title"), onClose, width: 360, height: 480, resizable: false, styles, theme, storageId: "tool_clip", children: /* @__PURE__ */ jsxs("div", { style: { padding: "24px" }, children: [
    /* @__PURE__ */ jsx("div", { style: { marginBottom: 24, borderBottom: `1px solid ${theme.border}`, paddingBottom: 16 }, children: /* @__PURE__ */ jsx(
      Checkbox,
      {
        label: t("clip_enable"),
        checked: clipEnabled,
        onChange: (v) => setClipEnabled(v),
        styles,
        theme,
        style: { fontWeight: "bold", fontSize: 15 }
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { style: {
      opacity: clipEnabled ? 1 : 0.4,
      pointerEvents: clipEnabled ? "auto" : "none",
      transition: "all 0.3s ease"
    }, children: [
      /* @__PURE__ */ jsx(SliderRow, { axis: "x", label: t("clip_x") }),
      /* @__PURE__ */ jsx(SliderRow, { axis: "y", label: t("clip_y") }),
      /* @__PURE__ */ jsx(SliderRow, { axis: "z", label: t("clip_z") })
    ] })
  ] }) });
};
const ExportPanel = ({ t, onClose, onExport, styles, theme }) => {
  const [format, setFormat] = useState("glb");
  return /* @__PURE__ */ jsx(FloatingPanel, { title: t("export_title"), onClose, width: 320, height: 400, resizable: false, styles, theme, storageId: "tool_export", children: /* @__PURE__ */ jsxs("div", { style: { padding: 16 }, children: [
    /* @__PURE__ */ jsxs("div", { style: { marginBottom: 10, fontSize: 12, color: theme.textMuted }, children: [
      t("export_format"),
      ":"
    ] }),
    [
      { id: "glb", label: "GLB", desc: t("export_glb") },
      { id: "lmb", label: "LMB", desc: t("export_lmb") },
      { id: "3dtiles", label: "3D Tiles", desc: t("export_3dtiles") },
      { id: "nbim", label: "NBIM", desc: t("export_nbim") }
    ].map((opt) => /* @__PURE__ */ jsxs("label", { style: {
      display: "flex",
      alignItems: "center",
      padding: "10px",
      cursor: "pointer",
      border: `1px solid ${format === opt.id ? theme.accent : theme.border}`,
      borderRadius: 0,
      marginBottom: 8,
      backgroundColor: format === opt.id ? `${theme.accent}15` : "transparent",
      transition: "all 0.2s"
    }, children: [
      /* @__PURE__ */ jsx("input", { type: "radio", name: "exportFmt", checked: format === opt.id, onChange: () => setFormat(opt.id), style: { marginRight: 10 } }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { style: { color: theme.text, fontWeight: "bold", fontSize: 14 }, children: opt.label }),
        /* @__PURE__ */ jsx("div", { style: { fontSize: 11, color: theme.textMuted }, children: opt.desc })
      ] })
    ] }, opt.id)),
    /* @__PURE__ */ jsx(
      Button,
      {
        styles,
        theme,
        onClick: () => onExport(format),
        style: { width: "100%", marginTop: 10, height: 40 },
        children: t("export_btn")
      }
    )
  ] }) });
};

const flattenTree = (nodes, result = [], parentIsLast = []) => {
  if (!nodes) return result;
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    node.isLastChild = i === nodes.length - 1;
    node.parentIsLast = [...parentIsLast];
    result.push(node);
    if (node.expanded && node.children && node.children.length > 0) {
      flattenTree(node.children, result, [...parentIsLast, node.isLastChild]);
    }
  }
  return result;
};
const SceneTree = ({
  t,
  sceneMgr,
  treeRoot,
  setTreeRoot,
  selectedUuid,
  onSelect,
  onToggleVisibility,
  onDelete,
  showDeleteButton = true,
  styles,
  theme
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const filterTree = (nodes, query) => {
    if (!query) return nodes;
    const lowercaseQuery = query.toLowerCase();
    return nodes.reduce((acc, node) => {
      const matches = node.name.toLowerCase().includes(lowercaseQuery);
      const filteredChildren = filterTree(node.children, query);
      if (matches || filteredChildren.length > 0) {
        acc.push({
          ...node,
          expanded: query ? true : node.expanded,
          // 搜索时自动展开
          children: filteredChildren
        });
      }
      return acc;
    }, []);
  };
  const filteredTree = useMemo(() => filterTree(treeRoot, searchQuery), [treeRoot, searchQuery]);
  const flatData = useMemo(() => flattenTree(filteredTree), [filteredTree]);
  const rowHeight = 24;
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef(null);
  const [containerHeight, setContainerHeight] = useState(400);
  useEffect(() => {
    if (containerRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) setContainerHeight(entry.contentRect.height);
      });
      resizeObserver.observe(containerRef.current);
      return () => resizeObserver.disconnect();
    }
  }, []);
  const toggleNode = (nodeUuid) => {
    const toggle = (nodes) => {
      return nodes.map((n) => {
        if (n.uuid === nodeUuid) return { ...n, expanded: !n.expanded };
        if (n.children.length > 0) return { ...n, children: toggle(n.children) };
        return n;
      });
    };
    setTreeRoot((prev) => toggle(prev));
  };
  const [contextMenu, setContextMenu] = useState(null);
  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);
  const handleContextMenu = (e, node) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      node
    });
  };
  const expandAll = () => {
    const expandRecursive = (nodes) => {
      return nodes.map((n) => ({
        ...n,
        expanded: true,
        children: expandRecursive(n.children)
      }));
    };
    setTreeRoot((prev) => expandRecursive(prev));
  };
  const collapseAll = () => {
    const collapseRecursive = (nodes) => {
      return nodes.map((n) => ({
        ...n,
        expanded: false,
        children: collapseRecursive(n.children)
      }));
    };
    setTreeRoot((prev) => collapseRecursive(prev));
  };
  const totalHeight = flatData.length * rowHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight));
  const visibleCount = Math.ceil(containerHeight / rowHeight);
  const endIndex = Math.min(flatData.length, startIndex + visibleCount + 1);
  const visibleItems = flatData.slice(startIndex, endIndex);
  return /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }, children: [
    /* @__PURE__ */ jsx("div", { style: { padding: "8px", borderBottom: `1px solid ${theme.border}` }, children: /* @__PURE__ */ jsx(
      "input",
      {
        type: "text",
        placeholder: t("search_nodes"),
        value: searchQuery,
        onChange: (e) => setSearchQuery(e.target.value),
        style: {
          width: "100%",
          padding: "4px 8px",
          fontSize: "12px",
          backgroundColor: theme.bg,
          color: theme.text,
          border: `1px solid ${theme.border}`,
          borderRadius: "0px",
          outline: "none",
          boxSizing: "border-box"
        }
      }
    ) }),
    /* @__PURE__ */ jsx("div", { ref: containerRef, style: { ...styles.treeContainer, flex: 1 }, onScroll: (e) => setScrollTop(e.currentTarget.scrollTop), children: /* @__PURE__ */ jsx("div", { style: { height: totalHeight, position: "relative" }, children: /* @__PURE__ */ jsx("div", { style: { position: "absolute", top: startIndex * rowHeight, left: 0, right: 0 }, children: visibleItems.map((node, index) => /* @__PURE__ */ jsxs(
      "div",
      {
        style: {
          ...styles.treeNode,
          paddingLeft: 8,
          ...node.uuid === selectedUuid ? styles.treeNodeSelected : {}
        },
        onClick: () => onSelect(node.uuid, node.object),
        onContextMenu: (e) => handleContextMenu(e, node),
        children: [
          node.depth > 0 && /* @__PURE__ */ jsxs("div", { style: { display: "flex", height: "100%", alignItems: "center", flexShrink: 0 }, children: [
            node.parentIsLast?.map((isLast, i) => /* @__PURE__ */ jsx("div", { style: {
              width: 16,
              height: "100%",
              position: "relative",
              borderLeft: isLast ? "none" : `1px solid ${theme.border}60`
            } }, i)),
            /* @__PURE__ */ jsxs("div", { style: {
              width: 16,
              height: "100%",
              position: "relative",
              display: "flex",
              alignItems: "center"
            }, children: [
              /* @__PURE__ */ jsx("div", { style: {
                position: "absolute",
                left: 0,
                top: 0,
                bottom: node.isLastChild ? "50%" : 0,
                borderLeft: `1px solid ${theme.border}60`
              } }),
              /* @__PURE__ */ jsx("div", { style: {
                position: "absolute",
                left: 0,
                width: 8,
                borderTop: `1px solid ${theme.border}60`
              } })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { style: styles.expander, onClick: (e) => {
            e.stopPropagation();
            toggleNode(node.uuid);
          }, children: node.children.length > 0 ? node.expanded ? /* @__PURE__ */ jsx(IconChevronDown, { size: 14 }) : /* @__PURE__ */ jsx(IconChevronRight, { size: 14 }) : null }),
          /* @__PURE__ */ jsx(
            Checkbox,
            {
              checked: node.visible,
              onChange: (val) => onToggleVisibility(node.uuid, val),
              styles,
              theme,
              style: { marginRight: 6, padding: 0, flexShrink: 0 }
            }
          ),
          /* @__PURE__ */ jsx("div", { style: { ...styles.nodeLabel, flex: 1, whiteSpace: "nowrap" }, children: node.name })
        ]
      },
      node.uuid
    )) }) }) }),
    contextMenu && /* @__PURE__ */ jsxs("div", { style: {
      position: "fixed",
      top: contextMenu.y,
      left: contextMenu.x,
      backgroundColor: theme.bg,
      border: `1px solid ${theme.border}`,
      boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
      zIndex: 9999,
      padding: "4px 0",
      minWidth: "120px"
    }, children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          style: { padding: "6px 12px", cursor: "pointer", fontSize: "12px", color: theme.text },
          onClick: expandAll,
          onMouseEnter: (e) => e.currentTarget.style.backgroundColor = theme.hover,
          onMouseLeave: (e) => e.currentTarget.style.backgroundColor = "transparent",
          children: t("expand_all")
        }
      ),
      /* @__PURE__ */ jsx(
        "div",
        {
          style: { padding: "6px 12px", cursor: "pointer", fontSize: "12px", color: theme.text },
          onClick: collapseAll,
          onMouseEnter: (e) => e.currentTarget.style.backgroundColor = theme.hover,
          onMouseLeave: (e) => e.currentTarget.style.backgroundColor = "transparent",
          children: t("collapse_all")
        }
      ),
      contextMenu.node?.isFileNode && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("div", { style: { height: "1px", backgroundColor: theme.border, margin: "4px 0" } }),
        /* @__PURE__ */ jsx(
          "div",
          {
            style: { padding: "6px 12px", cursor: "pointer", fontSize: "12px", color: theme.danger },
            onClick: () => {
              if (contextMenu.node) onDelete(contextMenu.node.uuid);
              setContextMenu(null);
            },
            onMouseEnter: (e) => e.currentTarget.style.backgroundColor = theme.hover,
            onMouseLeave: (e) => e.currentTarget.style.backgroundColor = "transparent",
            children: t("delete_model")
          }
        )
      ] })
    ] })
  ] });
};

const Section = ({ title, children, theme }) => /* @__PURE__ */ jsxs("div", { style: { marginBottom: 20 }, children: [
  /* @__PURE__ */ jsx("div", { style: { fontSize: 11, fontWeight: "600", color: theme.accent, marginBottom: 10, borderBottom: `1px solid ${theme.border}`, paddingBottom: 6, opacity: 0.9, textTransform: "uppercase", letterSpacing: "0.5px" }, children: title }),
  children
] });
const Row = ({ label, children, theme }) => /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8, fontSize: 12, padding: "0 4px" }, children: [
  /* @__PURE__ */ jsx("span", { style: { color: theme.textMuted, fontWeight: "400" }, children: label }),
  /* @__PURE__ */ jsx("div", { style: { flex: 1, display: "flex", justifyContent: "flex-end", marginLeft: 12 }, children })
] });
const SettingsPanel = ({
  t,
  onClose,
  settings,
  onUpdate,
  currentLang,
  setLang,
  themeMode,
  setThemeMode,
  showStats,
  setShowStats,
  styles,
  theme
}) => {
  return /* @__PURE__ */ jsx("div", { style: styles.modalOverlay, children: /* @__PURE__ */ jsxs("div", { style: styles.modalContent, children: [
    /* @__PURE__ */ jsxs("div", { style: styles.floatingHeader, children: [
      /* @__PURE__ */ jsx("span", { children: t("settings") }),
      /* @__PURE__ */ jsx(
        "div",
        {
          onClick: onClose,
          style: { cursor: "pointer", opacity: 0.6, display: "flex", padding: 2, borderRadius: 0 },
          onMouseEnter: (e) => e.currentTarget.style.backgroundColor = theme.itemHover,
          onMouseLeave: (e) => e.currentTarget.style.backgroundColor = "transparent",
          children: /* @__PURE__ */ jsx(IconClose, { width: 20, height: 20 })
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { style: { padding: 20, overflowY: "auto", flex: 1 }, children: [
      /* @__PURE__ */ jsxs(Section, { title: t("setting_general"), theme, children: [
        /* @__PURE__ */ jsx(Row, { label: t("st_theme"), theme, children: /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 4, background: theme.bg, padding: 2, borderRadius: 0, border: `1px solid ${theme.border}` }, children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setThemeMode("light"),
              style: {
                padding: "4px 12px",
                borderRadius: 0,
                border: "none",
                fontSize: 11,
                cursor: "pointer",
                background: themeMode === "light" ? theme.accent : "transparent",
                color: themeMode === "light" ? "white" : theme.text
              },
              children: t("theme_light")
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setThemeMode("dark"),
              style: {
                padding: "4px 12px",
                borderRadius: 0,
                border: "none",
                fontSize: 11,
                cursor: "pointer",
                background: themeMode === "dark" ? theme.accent : "transparent",
                color: themeMode === "dark" ? "white" : theme.text
              },
              children: t("theme_dark")
            }
          )
        ] }) }),
        /* @__PURE__ */ jsx(Row, { label: t("st_lang"), theme, children: /* @__PURE__ */ jsxs(
          "select",
          {
            style: { background: theme.bg, color: theme.text, border: `1px solid ${theme.border}`, padding: 2, borderRadius: 0 },
            value: currentLang,
            onChange: (e) => setLang(e.target.value),
            children: [
              /* @__PURE__ */ jsx("option", { value: "zh", children: "简体中文" }),
              /* @__PURE__ */ jsx("option", { value: "en", children: "English" })
            ]
          }
        ) }),
        /* @__PURE__ */ jsx(Row, { label: t("st_bg"), theme, children: /* @__PURE__ */ jsx("input", { type: "color", value: settings.bgColor, onChange: (e) => onUpdate({ bgColor: e.target.value }) }) }),
        /* @__PURE__ */ jsx(Row, { label: t("st_monitor"), theme, children: /* @__PURE__ */ jsx(
          Checkbox,
          {
            checked: showStats,
            onChange: (val) => setShowStats(val),
            styles,
            theme
          }
        ) })
      ] }),
      /* @__PURE__ */ jsx(Section, { title: t("st_viewport"), theme, children: /* @__PURE__ */ jsx(Row, { label: `${t("st_viewcube_size")} (${settings.viewCubeSize || 100})`, theme, children: /* @__PURE__ */ jsx(
        Slider,
        {
          min: 80,
          max: 300,
          step: 10,
          value: settings.viewCubeSize || 100,
          onChange: (val) => onUpdate({ viewCubeSize: val }),
          theme
        }
      ) }) }),
      /* @__PURE__ */ jsxs(Section, { title: t("st_lighting"), theme, children: [
        /* @__PURE__ */ jsx(Row, { label: `${t("st_ambient")} (${settings.ambientInt.toFixed(1)})`, theme, children: /* @__PURE__ */ jsx(
          Slider,
          {
            min: 0,
            max: 5,
            step: 0.1,
            value: settings.ambientInt,
            onChange: (val) => onUpdate({ ambientInt: val }),
            theme
          }
        ) }),
        /* @__PURE__ */ jsx(Row, { label: `${t("st_dir")} (${settings.dirInt.toFixed(1)})`, theme, children: /* @__PURE__ */ jsx(
          Slider,
          {
            min: 0,
            max: 5,
            step: 0.1,
            value: settings.dirInt,
            onChange: (val) => onUpdate({ dirInt: val }),
            theme
          }
        ) })
      ] })
    ] })
  ] }) });
};

const LoadingOverlay = ({ t, loading, status, progress, styles, theme }) => {
  if (!loading) return null;
  return /* @__PURE__ */ jsx("div", { style: styles.overlay, children: /* @__PURE__ */ jsxs("div", { style: styles.progressBox, children: [
    /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }, children: [
      /* @__PURE__ */ jsx("div", { style: { fontWeight: "600", color: theme.text, fontSize: "14px" }, children: status }),
      /* @__PURE__ */ jsxs("div", { style: { color: theme.accent, fontSize: "14px", fontWeight: "bold", fontFamily: "monospace" }, children: [
        Math.round(progress),
        "%"
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { style: styles.progressBarContainer, children: /* @__PURE__ */ jsx(
      "div",
      {
        style: {
          ...styles.progressBarFill,
          width: `${progress}%`,
          transition: "width 0.3s ease-out",
          boxShadow: `0 0 10px ${theme.accent}40`
        }
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "8px", marginTop: "12px", fontSize: "12px", color: theme.textMuted }, children: [
      /* @__PURE__ */ jsxs("svg", { style: { width: "14px", height: "14px", animation: "spin 1s linear infinite" }, viewBox: "0 0 24 24", children: [
        /* @__PURE__ */ jsx("circle", { style: { opacity: 0.25 }, cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4", fill: "none" }),
        /* @__PURE__ */ jsx("path", { style: { opacity: 0.75 }, fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })
      ] }),
      /* @__PURE__ */ jsx("style", { children: `
                        @keyframes spin {
                            from { transform: rotate(0deg); }
                            to { transform: rotate(360deg); }
                        }
                    ` }),
      /* @__PURE__ */ jsx("span", { children: progress === 100 ? t("processing") : t("loading_resources") })
    ] })
  ] }) });
};

const PropertiesPanel = ({ t, selectedProps, styles, theme }) => {
  const [collapsed, setCollapsed] = useState(/* @__PURE__ */ new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const toggleGroup = (group) => {
    const next = new Set(collapsed);
    if (next.has(group)) next.delete(group);
    else next.add(group);
    setCollapsed(next);
  };
  const filteredProps = React.useMemo(() => {
    if (!selectedProps || !searchQuery) return selectedProps;
    const query = searchQuery.toLowerCase();
    const result = {};
    Object.entries(selectedProps).forEach(([group, props]) => {
      const filteredGroupProps = {};
      Object.entries(props).forEach(([k, v]) => {
        if (k.toLowerCase().includes(query) || String(v).toLowerCase().includes(query)) {
          filteredGroupProps[k] = v;
        }
      });
      if (Object.keys(filteredGroupProps).length > 0) {
        result[group] = filteredGroupProps;
      }
    });
    return result;
  }, [selectedProps, searchQuery]);
  return /* @__PURE__ */ jsxs("div", { style: { flex: 1, display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }, children: [
    selectedProps && /* @__PURE__ */ jsx("div", { style: { padding: "8px", borderBottom: `1px solid ${theme.border}` }, children: /* @__PURE__ */ jsx(
      "input",
      {
        type: "text",
        placeholder: t("search_props"),
        value: searchQuery,
        onChange: (e) => setSearchQuery(e.target.value),
        style: {
          width: "100%",
          padding: "4px 8px",
          fontSize: "12px",
          backgroundColor: theme.bg,
          color: theme.text,
          border: `1px solid ${theme.border}`,
          borderRadius: "0px",
          outline: "none",
          boxSizing: "border-box"
        }
      }
    ) }),
    /* @__PURE__ */ jsx("div", { style: { ...styles.list, flex: 1, overflowY: "auto" }, children: filteredProps ? Object.entries(filteredProps).map(([group, props]) => /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs(
        "div",
        {
          style: styles.propGroupTitle,
          onClick: () => toggleGroup(group),
          onMouseEnter: (e) => e.currentTarget.style.backgroundColor = theme.itemHover,
          onMouseLeave: (e) => e.currentTarget.style.backgroundColor = theme.bg,
          children: [
            /* @__PURE__ */ jsx("span", { children: group }),
            /* @__PURE__ */ jsx("span", { style: { opacity: 0.6, display: "flex", alignItems: "center" }, children: collapsed.has(group) ? /* @__PURE__ */ jsx(IconChevronRight, { width: 14, height: 14 }) : /* @__PURE__ */ jsx(IconChevronDown, { width: 14, height: 14 }) })
          ]
        }
      ),
      !collapsed.has(group) && Object.entries(props).map(([k, v]) => /* @__PURE__ */ jsxs("div", { style: styles.propRow, children: [
        /* @__PURE__ */ jsx("div", { style: styles.propKey, title: k, children: k }),
        /* @__PURE__ */ jsx("div", { style: styles.propValue, title: String(v), children: String(v) })
      ] }, k))
    ] }, group)) : /* @__PURE__ */ jsx("div", { style: { padding: 20, color: theme.textMuted, textAlign: "center", marginTop: 20 }, children: t("no_selection") }) })
  ] });
};

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, t, styles, theme }) => {
  if (!isOpen) return null;
  return /* @__PURE__ */ jsx("div", { style: styles.modalOverlay, children: /* @__PURE__ */ jsxs("div", { style: { ...styles.modalContent, width: "320px", height: "auto" }, children: [
    /* @__PURE__ */ jsxs("div", { style: styles.floatingHeader, children: [
      /* @__PURE__ */ jsx("span", { children: title }),
      /* @__PURE__ */ jsx("div", { onClick: onCancel, style: { cursor: "pointer", opacity: 0.6, display: "flex", padding: 2, borderRadius: 0 }, children: /* @__PURE__ */ jsx(IconClose, { width: 20, height: 20 }) })
    ] }),
    /* @__PURE__ */ jsx("div", { style: { padding: "20px", color: theme.text, fontSize: "13px", lineHeight: "1.5" }, children: message }),
    /* @__PURE__ */ jsxs("div", { style: { padding: "15px 20px", borderTop: `1px solid ${theme.border}`, display: "flex", gap: "10px", justifyContent: "flex-end" }, children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          style: { ...styles.btn, backgroundColor: "transparent", flex: "0 0 auto", width: "80px" },
          onClick: onCancel,
          children: t("btn_cancel")
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          style: { ...styles.btn, backgroundColor: theme.danger, borderColor: theme.danger, color: "white", flex: "0 0 auto", width: "80px" },
          onClick: onConfirm,
          children: t("btn_confirm")
        }
      )
    ] })
  ] }) });
};

const AboutModal = ({ isOpen, onClose, t, styles, theme }) => {
  if (!isOpen) return null;
  return /* @__PURE__ */ jsx("div", { style: styles.modalOverlay, onClick: onClose, children: /* @__PURE__ */ jsxs(
    "div",
    {
      style: { ...styles.modalContent, width: "360px", height: "auto" },
      onClick: (e) => e.stopPropagation(),
      children: [
        /* @__PURE__ */ jsxs("div", { style: styles.floatingHeader, children: [
          /* @__PURE__ */ jsx("span", { children: t("about_title") }),
          /* @__PURE__ */ jsx("div", { onClick: onClose, style: { cursor: "pointer", opacity: 0.6, display: "flex", padding: 2, borderRadius: 0 }, children: /* @__PURE__ */ jsx(IconClose, { width: 20, height: 20 }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { padding: "30px 20px", color: theme.text, display: "flex", flexDirection: "column", gap: "20px", alignItems: "center" }, children: [
          /* @__PURE__ */ jsxs("div", { style: { textAlign: "center" }, children: [
            /* @__PURE__ */ jsx("div", { style: { fontSize: "24px", fontWeight: "bold", marginBottom: "8px", color: theme.accent }, children: "3D Browser" }),
            /* @__PURE__ */ jsx("div", { style: { fontSize: "12px", opacity: 0.7 }, children: "Professional 3D Model Viewer" })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { width: "100%", display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px" }, children: [
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${theme.border}`, paddingBottom: "8px" }, children: [
              /* @__PURE__ */ jsx("span", { style: { opacity: 0.7 }, children: t("about_author") }),
              /* @__PURE__ */ jsx("span", { style: { fontWeight: "500" }, children: "zhangly1403@163.com" })
            ] }),
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${theme.border}`, paddingBottom: "8px" }, children: [
              /* @__PURE__ */ jsx("span", { style: { opacity: 0.7 }, children: t("about_license") }),
              /* @__PURE__ */ jsx("span", { style: { fontWeight: "500", color: theme.danger }, children: t("about_license_nc") })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { style: { fontSize: "12px", opacity: 0.5, textAlign: "center", marginTop: "10px" }, children: "Copyright © 2026. All rights reserved." })
        ] }),
        /* @__PURE__ */ jsx("div", { style: { padding: "15px 20px", borderTop: `1px solid ${theme.border}`, display: "flex", justifyContent: "center" }, children: /* @__PURE__ */ jsx(
          "button",
          {
            style: { ...styles.btn, backgroundColor: theme.accent, borderColor: theme.accent, color: "white", width: "100px" },
            onClick: onClose,
            children: t("btn_confirm")
          }
        ) })
      ]
    }
  ) });
};

const ViewCube = ({ sceneMgr, theme, lang = "zh" }) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const cubeRef = useRef(null);
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());
  const hoveredPart = useRef(null);
  const cubeSize = sceneMgr?.settings?.viewCubeSize || 100;
  const t = (key) => getTranslation(lang, key);
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;
    const width = cubeSize;
    const height = cubeSize;
    const canvas = canvasRef.current;
    const gl = canvas.getContext("webgl2", {
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: false
    });
    if (gl) {
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    }
    const renderer = new THREE.WebGLRenderer({
      canvas,
      context: gl || void 0,
      antialias: true,
      alpha: true,
      precision: "mediump"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    rendererRef.current = renderer;
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 3.5);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;
    const ambientLight = new THREE.AmbientLight(16777215, 1);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(16777215, 0.6);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);
    const cubeGroup = new THREE.Group();
    scene.add(cubeGroup);
    cubeRef.current = cubeGroup;
    const createFaceTexture = (text, rotation = 0) => {
      const canvas2 = document.createElement("canvas");
      canvas2.width = 128;
      canvas2.height = 128;
      const context = canvas2.getContext("2d");
      if (context) {
        context.fillStyle = "#f8f9fa";
        context.fillRect(0, 0, 128, 128);
        context.save();
        context.translate(64, 64);
        if (rotation !== 0) {
          context.rotate(rotation * Math.PI / 180);
        }
        context.fillStyle = "#333333";
        context.font = lang === "zh" ? 'bold 54px "Microsoft YaHei", sans-serif' : "bold 32px Arial, sans-serif";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(text, 0, 0);
        context.restore();
        context.strokeStyle = "#cccccc";
        context.lineWidth = 4;
        context.strokeRect(2, 2, 124, 124);
      }
      const texture = new THREE.CanvasTexture(canvas2);
      return texture;
    };
    const faceColor = 16316922;
    const edgeColor = 16316922;
    const cornerColor = 16316922;
    const createPart = (size, pos, name, color, text, rotation = 0) => {
      const geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
      let material;
      if (text) {
        const texture = createFaceTexture(text, rotation);
        material = new THREE.MeshPhongMaterial({
          map: texture,
          transparent: true,
          opacity: 0.98,
          shininess: 30
        });
      } else {
        material = new THREE.MeshPhongMaterial({
          color,
          transparent: true,
          opacity: 0.98,
          shininess: 30
        });
      }
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.copy(pos);
      mesh.name = name;
      mesh.userData.originalOpacity = material.opacity;
      mesh.userData.originalColor = material.color.clone();
      mesh.userData.isFace = !!text;
      cubeGroup.add(mesh);
      return mesh;
    };
    const faceSize = 0.88;
    const edgeSize = 0.12;
    const cornerSize = 0.12;
    const offset = 0.5;
    createPart(new THREE.Vector3(faceSize, 0.05, faceSize), new THREE.Vector3(0, -offset, 0), "front", faceColor, t("cube_front"));
    createPart(new THREE.Vector3(faceSize, 0.05, faceSize), new THREE.Vector3(0, offset, 0), "back", faceColor, t("cube_back"), 180);
    createPart(new THREE.Vector3(faceSize, faceSize, 0.05), new THREE.Vector3(0, 0, offset), "top", faceColor, t("cube_top"), 270);
    createPart(new THREE.Vector3(faceSize, faceSize, 0.05), new THREE.Vector3(0, 0, -offset), "bottom", faceColor, t("cube_bottom"));
    createPart(new THREE.Vector3(0.05, faceSize, faceSize), new THREE.Vector3(-offset, 0, 0), "left", faceColor, t("cube_left"), 90);
    createPart(new THREE.Vector3(0.05, faceSize, faceSize), new THREE.Vector3(offset, 0, 0), "right", faceColor, t("cube_right"), 270);
    createPart(new THREE.Vector3(faceSize, edgeSize, edgeSize), new THREE.Vector3(0, -offset, offset), "top-front", edgeColor);
    createPart(new THREE.Vector3(faceSize, edgeSize, edgeSize), new THREE.Vector3(0, offset, offset), "top-back", edgeColor);
    createPart(new THREE.Vector3(edgeSize, faceSize, edgeSize), new THREE.Vector3(-offset, 0, offset), "top-left", edgeColor);
    createPart(new THREE.Vector3(edgeSize, faceSize, edgeSize), new THREE.Vector3(offset, 0, offset), "top-right", edgeColor);
    createPart(new THREE.Vector3(faceSize, edgeSize, edgeSize), new THREE.Vector3(0, -offset, -offset), "bottom-front", edgeColor);
    createPart(new THREE.Vector3(faceSize, edgeSize, edgeSize), new THREE.Vector3(0, offset, -offset), "bottom-back", edgeColor);
    createPart(new THREE.Vector3(edgeSize, faceSize, edgeSize), new THREE.Vector3(-offset, 0, -offset), "bottom-left", edgeColor);
    createPart(new THREE.Vector3(edgeSize, faceSize, edgeSize), new THREE.Vector3(offset, 0, -offset), "bottom-right", edgeColor);
    createPart(new THREE.Vector3(edgeSize, edgeSize, faceSize), new THREE.Vector3(-offset, -offset, 0), "front-left", edgeColor);
    createPart(new THREE.Vector3(edgeSize, edgeSize, faceSize), new THREE.Vector3(offset, -offset, 0), "front-right", edgeColor);
    createPart(new THREE.Vector3(edgeSize, edgeSize, faceSize), new THREE.Vector3(-offset, offset, 0), "back-left", edgeColor);
    createPart(new THREE.Vector3(edgeSize, edgeSize, faceSize), new THREE.Vector3(offset, offset, 0), "back-right", edgeColor);
    createPart(new THREE.Vector3(cornerSize, cornerSize, cornerSize), new THREE.Vector3(-offset, -offset, offset), "top-front-left", cornerColor);
    createPart(new THREE.Vector3(cornerSize, cornerSize, cornerSize), new THREE.Vector3(offset, -offset, offset), "top-front-right", cornerColor);
    createPart(new THREE.Vector3(cornerSize, cornerSize, cornerSize), new THREE.Vector3(-offset, offset, offset), "top-back-left", cornerColor);
    createPart(new THREE.Vector3(cornerSize, cornerSize, cornerSize), new THREE.Vector3(offset, offset, offset), "top-back-right", cornerColor);
    createPart(new THREE.Vector3(cornerSize, cornerSize, cornerSize), new THREE.Vector3(-offset, -offset, -offset), "bottom-front-left", cornerColor);
    createPart(new THREE.Vector3(cornerSize, cornerSize, cornerSize), new THREE.Vector3(offset, -offset, -offset), "bottom-front-right", cornerColor);
    createPart(new THREE.Vector3(cornerSize, cornerSize, cornerSize), new THREE.Vector3(-offset, offset, -offset), "bottom-back-left", cornerColor);
    createPart(new THREE.Vector3(cornerSize, cornerSize, cornerSize), new THREE.Vector3(offset, offset, -offset), "bottom-back-right", cornerColor);
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      if (sceneMgr && cubeRef.current) {
        cubeRef.current.quaternion.copy(sceneMgr.camera.quaternion).invert();
      }
      renderer.render(scene, camera);
    };
    animate();
    return () => {
      cancelAnimationFrame(animationId);
      renderer.dispose();
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
    };
  }, [sceneMgr, cubeSize, lang]);
  const handleMouseMove = (event) => {
    if (!canvasRef.current || !sceneRef.current || !cameraRef.current || !cubeRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    mouse.current.x = (event.clientX - rect.left) / rect.width * 2 - 1;
    mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.current.setFromCamera(mouse.current, cameraRef.current);
    const intersects = raycaster.current.intersectObjects(cubeRef.current.children);
    if (intersects.length > 0) {
      const mesh = intersects[0].object;
      if (hoveredPart.current !== mesh) {
        if (hoveredPart.current) {
          const mat2 = hoveredPart.current.material;
          mat2.opacity = hoveredPart.current.userData.originalOpacity;
          mat2.color.copy(hoveredPart.current.userData.originalColor);
        }
        hoveredPart.current = mesh;
        const mat = mesh.material;
        mat.opacity = 1;
        mat.color.set(30932);
      }
      containerRef.current.style.cursor = "pointer";
    } else {
      if (hoveredPart.current) {
        const mat = hoveredPart.current.material;
        mat.opacity = hoveredPart.current.userData.originalOpacity;
        mat.color.copy(hoveredPart.current.userData.originalColor);
        hoveredPart.current = null;
      }
      containerRef.current.style.cursor = "default";
    }
  };
  const handleMouseLeave = () => {
    if (hoveredPart.current) {
      const mat = hoveredPart.current.material;
      mat.opacity = hoveredPart.current.userData.originalOpacity;
      mat.color.copy(hoveredPart.current.userData.originalColor);
      hoveredPart.current = null;
    }
  };
  const handleClick = (event) => {
    if (!canvasRef.current || !sceneRef.current || !cameraRef.current || !sceneMgr) return;
    const rect = canvasRef.current.getBoundingClientRect();
    mouse.current.x = (event.clientX - rect.left) / rect.width * 2 - 1;
    mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.current.setFromCamera(mouse.current, cameraRef.current);
    const intersects = raycaster.current.intersectObjects(cubeRef.current.children);
    if (intersects.length > 0) {
      const name = intersects[0].object.name;
      handleViewChange(name);
    }
  };
  const handleViewChange = (viewName) => {
    if (!sceneMgr) return;
    let targetView = viewName;
    if (viewName === "top-front-right") targetView = "se";
    else if (viewName === "top-front-left") targetView = "sw";
    else if (viewName === "top-back-right") targetView = "ne";
    else if (viewName === "top-back-left") targetView = "nw";
    sceneMgr.setView(targetView);
  };
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref: containerRef,
      style: {
        position: "absolute",
        top: "10px",
        right: "10px",
        width: `${cubeSize}px`,
        height: `${cubeSize}px`,
        zIndex: 100,
        pointerEvents: "auto",
        borderRadius: "8px",
        overflow: "hidden"
      },
      onClick: handleClick,
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave,
      children: /* @__PURE__ */ jsx("canvas", { ref: canvasRef })
    }
  );
};

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      const { t, styles, theme } = this.props;
      return /* @__PURE__ */ jsxs("div", { style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        width: "100%",
        backgroundColor: theme.bg,
        color: theme.text,
        fontFamily: DEFAULT_FONT,
        gap: "20px",
        padding: "40px",
        textAlign: "center"
      }, children: [
        /* @__PURE__ */ jsx("div", { style: { fontSize: "64px" }, children: "⚠️" }),
        /* @__PURE__ */ jsx("h1", { style: { fontSize: "24px", margin: 0 }, children: t("error_title") }),
        /* @__PURE__ */ jsx("p", { style: { color: theme.textMuted, maxWidth: "600px", lineHeight: "1.6" }, children: t("error_msg") }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => window.location.reload(),
            style: {
              padding: "10px 24px",
              backgroundColor: theme.accent,
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold"
            },
            children: t("error_reload")
          }
        )
      ] });
    }
    return this.props.children;
  }
}
const GlobalStyle = ({ theme }) => /* @__PURE__ */ jsx("style", { dangerouslySetInnerHTML: { __html: createGlobalStyle(theme) } });
const ThreeViewer = ({
  allowDragOpen = true,
  hiddenMenus = [],
  libPath = "./libs",
  defaultTheme,
  defaultLang,
  showStats: propShowStats,
  showOutline: propShowOutline,
  showProperties: propShowProperties,
  showDeleteButton: propShowDeleteButton,
  initialSettings,
  initialFiles,
  onSelect: propOnSelect,
  onLoad
}) => {
  const [themeMode, setThemeMode] = useState(() => {
    if (defaultTheme) return defaultTheme;
    try {
      const saved = localStorage.getItem("3dbrowser_themeMode");
      return saved === "dark" || saved === "light" ? saved : "light";
    } catch {
      return "light";
    }
  });
  const theme = useMemo(() => {
    return themes[themeMode];
  }, [themeMode]);
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [lang, setLang] = useState(() => {
    if (defaultLang) return defaultLang;
    try {
      const saved = localStorage.getItem("3dbrowser_lang");
      return saved === "zh" || saved === "en" ? saved : "zh";
    } catch {
      return "zh";
    }
  });
  useEffect(() => {
    if (defaultLang && defaultLang !== lang) {
      setLang(defaultLang);
    }
  }, [defaultLang]);
  const [treeRoot, setTreeRoot] = useState([]);
  const [selectedUuid, setSelectedUuid] = useState(null);
  const [selectedProps, setSelectedProps] = useState(null);
  const [status, setStatus] = useState(getTranslation(lang, "ready"));
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState({ meshes: 0, faces: 0, memory: 0, drawCalls: 0 });
  const [chunkProgress, setChunkProgress] = useState({ loaded: 0, total: 0 });
  const [activeTool, setActiveTool] = useState("none");
  const [measureType, setMeasureType] = useState("none");
  const [measureHistory, setMeasureHistory] = useState([]);
  const [highlightedMeasureId, setHighlightedMeasureId] = useState(null);
  const [clipEnabled, setClipEnabled] = useState(false);
  const [clipValues, setClipValues] = useState({ x: [0, 100], y: [0, 100], z: [0, 100] });
  const [clipActive, setClipActive] = useState({ x: false, y: false, z: false });
  const [pickEnabled, setPickEnabled] = useState(() => {
    try {
      return localStorage.getItem("3dbrowser_pickEnabled") === "true";
    } catch {
      return false;
    }
  });
  const [showStats, setShowStats] = useState(() => {
    if (propShowStats !== void 0) return propShowStats;
    try {
      const saved = localStorage.getItem("3dbrowser_showStats");
      return saved !== null ? saved === "true" : true;
    } catch {
      return true;
    }
  });
  const [showOutline, setShowOutline] = useState(() => {
    if (propShowOutline !== void 0) return propShowOutline;
    try {
      const saved = localStorage.getItem("3dbrowser_showOutline");
      return saved !== null ? saved === "true" : true;
    } catch {
      return true;
    }
  });
  const [showProps, setShowProps] = useState(() => {
    if (propShowProperties !== void 0) return propShowProperties;
    try {
      const saved = localStorage.getItem("3dbrowser_showProps");
      return saved !== null ? saved === "true" : true;
    } catch {
      return true;
    }
  });
  const showDeleteButton = propShowDeleteButton !== void 0 ? propShowDeleteButton : true;
  const [sceneSettings, setSceneSettings] = useState(() => {
    let baseSettings = {
      ambientInt: 2,
      dirInt: 1,
      bgColor: theme.canvasBg,
      viewCubeSize: 100
    };
    try {
      const saved = localStorage.getItem("3dbrowser_sceneSettings");
      if (saved) {
        const parsed = JSON.parse(saved);
        baseSettings = {
          ambientInt: typeof parsed.ambientInt === "number" ? parsed.ambientInt : 2,
          dirInt: typeof parsed.dirInt === "number" ? parsed.dirInt : 1,
          bgColor: typeof parsed.bgColor === "string" ? parsed.bgColor : theme.canvasBg,
          viewCubeSize: typeof parsed.viewCubeSize === "number" ? parsed.viewCubeSize : 100
        };
      }
    } catch (e) {
      console.error("Failed to load sceneSettings", e);
    }
    return initialSettings ? { ...baseSettings, ...initialSettings } : baseSettings;
  });
  const [confirmState, setConfirmState] = useState({ isOpen: false, title: "", message: "", action: () => {
  } });
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [leftWidth, setLeftWidth] = useState(260);
  const [rightWidth, setRightWidth] = useState(300);
  const resizingLeft = useRef(false);
  const resizingRight = useRef(false);
  const canvasRef = useRef(null);
  const viewportRef = useRef(null);
  const sceneMgr = useRef(null);
  const [mgrInstance, setMgrInstance] = useState(null);
  useRef(null);
  const [errorState, setErrorState] = useState({ isOpen: false, title: "", message: "" });
  const [toast, setToast] = useState(null);
  const cleanStatus = useCallback((msg) => {
    if (!msg) return "";
    return msg.replace(/:\s*\d+%/g, "").replace(/\(\d+%\)/g, "").replace(/\d+%/g, "").trim();
  }, []);
  const t = useCallback((key) => getTranslation(lang, key), [lang]);
  useEffect(() => {
    const handleError = (event) => {
      const message = event.message || "";
      if (!message && !event.error) return;
      if (message.includes("ResizeObserver loop completed") || message.includes("ResizeObserver loop limit") || message.includes("texImage3D: FLIP_Y or PREMULTIPLY_ALPHA")) {
        return;
      }
      console.error("Global Error:", event.error || message);
      setErrorState({
        isOpen: true,
        title: t("failed"),
        message: message || "An unexpected error occurred",
        detail: event.error?.stack || ""
      });
    };
    const handleRejection = (event) => {
      if (!event.reason) return;
      const message = event.reason?.message || String(event.reason);
      if (message.includes("ResizeObserver loop completed") || message.includes("ResizeObserver loop limit") || message.includes("texImage3D: FLIP_Y or PREMULTIPLY_ALPHA")) {
        return;
      }
      console.error("Unhandled Rejection:", event.reason);
      setErrorState({
        isOpen: true,
        title: t("failed"),
        message: message || "A promise was rejected without reason",
        detail: event.reason?.stack || ""
      });
    };
    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);
    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, [lang, t]);
  useEffect(() => {
    try {
      localStorage.setItem("3dbrowser_themeMode", themeMode);
    } catch (e) {
      console.error("Failed to save themeMode", e);
    }
  }, [themeMode]);
  useEffect(() => {
    try {
      localStorage.setItem("3dbrowser_lang", lang);
    } catch (e) {
      console.error("Failed to save lang", e);
    }
  }, [lang]);
  useEffect(() => {
    try {
      localStorage.setItem("3dbrowser_sceneSettings", JSON.stringify(sceneSettings));
    } catch (e) {
      console.error("Failed to save sceneSettings", e);
    }
  }, [sceneSettings]);
  useEffect(() => {
    const prevLang = lang === "zh" ? "en" : "zh";
    if (status === getTranslation(prevLang, "ready")) {
      setStatus(getTranslation(lang, "ready"));
    }
  }, [lang]);
  useEffect(() => {
    const handleMove = (e) => {
      if (resizingLeft.current) {
        setLeftWidth(Math.max(150, Math.min(500, e.clientX)));
      }
      if (resizingRight.current) {
        const newW = window.innerWidth - e.clientX;
        setRightWidth(Math.max(200, Math.min(600, newW)));
      }
    };
    const handleUp = () => {
      resizingLeft.current = false;
      resizingRight.current = false;
    };
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, []);
  const formatNumber = (num) => {
    if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(1) + "K";
    return num.toString();
  };
  const formatMemory = (mb) => {
    if (mb >= 1024) return (mb / 1024).toFixed(2) + " GB";
    return mb.toFixed(1) + " MB";
  };
  useEffect(() => {
    if (!viewportRef.current || !sceneMgr.current) return;
    let resizeId;
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(resizeId);
      resizeId = requestAnimationFrame(() => {
        sceneMgr.current?.resize();
      });
    });
    observer.observe(viewportRef.current);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(resizeId);
    };
  }, []);
  useEffect(() => {
    const handleDragOver2 = (e) => {
      if (!allowDragOpen) return;
      e.preventDefault();
      e.stopPropagation();
    };
    const handleDrop2 = async (e) => {
      if (!allowDragOpen) return;
      e.preventDefault();
      e.stopPropagation();
      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        const files = Array.from(e.dataTransfer.files);
        const supportedExtensions = [".lmb", ".lmbz", ".glb", ".gltf", ".ifc", ".nbim", ".fbx", ".obj", ".stl", ".ply", ".3ds", ".dae", ".stp", ".step", ".igs", ".iges"];
        const unsupportedFiles = files.filter((f) => {
          const ext = "." + f.name.split(".").pop()?.toLowerCase();
          return !supportedExtensions.includes(ext);
        });
        if (unsupportedFiles.length > 0) {
          setToast({
            message: `${t("failed")}: 不支持的格式 - ${unsupportedFiles.map((f) => f.name).join(", ")}`,
            type: "error"
          });
        }
        const supportedFiles = files.filter((f) => {
          const ext = "." + f.name.split(".").pop()?.toLowerCase();
          return supportedExtensions.includes(ext);
        });
        if (supportedFiles.length > 0) {
          await processFiles(supportedFiles);
        }
      }
    };
    window.addEventListener("dragover", handleDragOver2);
    window.addEventListener("drop", handleDrop2);
    return () => {
      window.removeEventListener("dragover", handleDragOver2);
      window.removeEventListener("drop", handleDrop2);
    };
  }, [lang, allowDragOpen, t]);
  useEffect(() => {
    if (sceneMgr.current) {
      requestAnimationFrame(() => {
        sceneMgr.current?.resize();
      });
    }
  }, [showOutline, showProps, leftWidth, rightWidth]);
  useEffect(() => {
    if (sceneSettings.bgColor === themes[themeMode === "light" ? "dark" : "light"].canvasBg) {
      const newBg = theme.canvasBg;
      handleSettingsUpdate({ bgColor: newBg });
    }
  }, [themeMode]);
  useEffect(() => {
    try {
      localStorage.setItem("3dbrowser_pickEnabled", String(pickEnabled));
    } catch (e) {
      console.warn("无法保存pickEnabled状态", e);
    }
  }, [pickEnabled]);
  useEffect(() => {
    try {
      localStorage.setItem("3dbrowser_showStats", String(showStats));
    } catch (e) {
      console.warn("无法保存showStats状态", e);
    }
  }, [showStats]);
  useEffect(() => {
    try {
      localStorage.setItem("3dbrowser_showOutline", String(showOutline));
    } catch (e) {
      console.warn("无法保存showOutline状态", e);
    }
  }, [showOutline]);
  useEffect(() => {
    try {
      localStorage.setItem("3dbrowser_showProps", String(showProps));
    } catch (e) {
      console.warn("无法保存showProps状态", e);
    }
  }, [showProps]);
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3e3);
      return () => clearTimeout(timer);
    }
  }, [toast]);
  const updateTree = useCallback(() => {
    if (!sceneMgr.current) return;
    const root = sceneMgr.current.structureRoot;
    if (!root) {
      setTreeRoot([]);
      return;
    }
    const convertNode = (node, depth = 0, isFileNode = false) => {
      let displayName = node.name;
      if (!displayName || displayName === node.id || displayName.startsWith("Mesh_") || displayName.startsWith("Group_")) {
        displayName = String(node.bimId !== void 0 ? node.bimId : node.id).replace(/^bim_/, "");
      }
      if (node.name && !node.name.startsWith("Mesh_") && !node.name.startsWith("Group_")) {
        displayName = node.name;
      } else {
        displayName = String(node.bimId !== void 0 ? node.bimId : node.id).replace(/^bim_/, "");
      }
      return {
        uuid: node.id,
        name: displayName,
        type: node.type === "Mesh" ? "MESH" : "GROUP",
        depth,
        children: (node.children || []).map((c) => convertNode(c, depth + 1, false)),
        expanded: false,
        visible: node.visible !== false,
        object: node,
        isFileNode
      };
    };
    const roots = [];
    (root.children || []).forEach((c) => {
      if (c.name === "ImportedModels" || c.name === "Tilesets") {
        (c.children || []).forEach((child) => {
          roots.push(convertNode(child, 0, true));
        });
      } else {
        roots.push(convertNode(c, 0, true));
      }
    });
    setTreeRoot(roots);
  }, []);
  const handleToggleVisibility = (uuid, visible) => {
    if (!sceneMgr.current) return;
    sceneMgr.current.setObjectVisibility(uuid, visible);
    updateTree();
  };
  const handleDeleteObject = (uuid) => {
    if (!sceneMgr.current) return;
    const obj = sceneMgr.current.contentGroup.getObjectByProperty("uuid", uuid);
    const node = sceneMgr.current.nodeMap.get(uuid);
    if (obj || node) {
      const name = obj?.name || node?.name || "Item";
      setConfirmState({
        isOpen: true,
        title: t("delete_item"),
        message: `${t("confirm_delete")} "${name}"?`,
        action: async () => {
          setLoading(true);
          setStatus(t("delete_item") + "...");
          try {
            await sceneMgr.current?.removeModel(uuid);
            if (selectedUuid === uuid) {
              setSelectedUuid(null);
              setSelectedProps(null);
              sceneMgr.current?.highlightObject(null);
            }
            updateTree();
            setStatus(t("ready"));
            setToast({ message: t("success"), type: "success" });
          } catch (error) {
            console.error("删除对象失败:", error);
            setToast({ message: t("failed") + ": " + (error instanceof Error ? error.message : String(error)), type: "error" });
          } finally {
            setLoading(false);
          }
        }
      });
    }
  };
  useEffect(() => {
    if (!canvasRef.current) return;
    const manager = new SceneManager(canvasRef.current);
    sceneMgr.current = manager;
    setMgrInstance(manager);
    if (onLoad) onLoad(manager);
    manager.updateSettings(sceneSettings);
    manager.resize();
    let lastReportedSuccess = false;
    manager.onChunkProgress = (loaded, total) => {
      setChunkProgress({ loaded, total });
      if (loaded === total && total > 0) {
        if (!lastReportedSuccess) {
          setToast({ message: t("all_chunks_loaded"), type: "success" });
          lastReportedSuccess = true;
        }
      } else {
        lastReportedSuccess = false;
      }
    };
    let debounceTimer;
    manager.onTilesUpdate = () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        updateTree();
      }, 500);
    };
    const statsInterval = setInterval(() => {
      if (manager) setStats(manager.getStats());
    }, 1e3);
    return () => {
      clearInterval(statsInterval);
      manager.dispose();
    };
  }, []);
  useEffect(() => {
    if (!mgrInstance || !initialFiles) return;
    const loadInitial = async () => {
      const itemsToProcess = Array.isArray(initialFiles) ? initialFiles : [initialFiles];
      console.log("[ThreeViewer] loadInitial with items:", itemsToProcess);
      const modelItems = [];
      for (const item of itemsToProcess) {
        if (typeof item === "string") {
          const urlPath = item.split("?")[0].split("#")[0];
          if (urlPath.toLowerCase().endsWith(".json") || urlPath.includes("tileset")) {
            console.log("[ThreeViewer] Initial URL detected as 3D Tiles:", item);
            mgrInstance.addTileset(item, t, (p, msg) => {
              setProgress(p);
              if (msg) setStatus(cleanStatus(msg));
            });
            updateTree();
            setStatus(t("tileset_loaded"));
            setTimeout(() => mgrInstance?.fitView(), 500);
          } else {
            modelItems.push(item);
          }
        } else {
          modelItems.push(item);
        }
      }
      if (modelItems.length > 0) {
        await processFiles(modelItems);
      }
    };
    loadInitial();
  }, [mgrInstance, initialFiles]);
  useEffect(() => {
    const mgr = sceneMgr.current;
    if (!mgr) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const handleClick = (e) => {
      if (activeTool === "measure") {
        if (measureType !== "none") {
          const intersect = mgr.getRayIntersects(e.clientX, e.clientY);
          if (intersect) {
            const record = mgr.addMeasurePoint(intersect.point);
            if (record) {
              const localizedRecord = { ...record, type: record.type };
              setMeasureHistory((prev) => [localizedRecord, ...prev]);
            }
            return;
          }
        }
        const mId = mgr.pickMeasurement(e.clientX, e.clientY);
        if (mId) {
          setHighlightedMeasureId(mId);
          mgr.highlightMeasurement(mId);
          return;
        }
        setHighlightedMeasureId(null);
        mgr.highlightMeasurement(null);
        return;
      }
      if (pickEnabled) {
        const result = mgr.pick(e.clientX, e.clientY);
        handleSelect(result ? result.object : null, result ? result.intersect : null);
      }
    };
    const handleMouseMove = (e) => {
      if (activeTool === "measure") {
        mgr.updateMeasureHover(e.clientX, e.clientY);
        return;
      }
      mgr.highlightObject(selectedUuid);
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (activeTool === "measure" && measureType !== "none") {
          setMeasureType("none");
          mgr.startMeasurement("none");
        }
      }
    };
    canvas.addEventListener("click", handleClick);
    canvas.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      canvas.removeEventListener("click", handleClick);
      canvas.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [pickEnabled, selectedUuid, activeTool, measureType]);
  useEffect(() => {
    const mgr = sceneMgr.current;
    if (!mgr) return;
    if (activeTool !== "measure") {
      mgr.clearMeasurementPreview();
      mgr.highlightMeasurement(null);
      setHighlightedMeasureId(null);
      setMeasureType("none");
    }
    if (activeTool !== "clip") {
      mgr.setClippingEnabled(false);
      setClipEnabled(false);
    }
  }, [activeTool]);
  const handleSettingsUpdate = (newSettings) => {
    const merged = { ...sceneSettings, ...newSettings };
    setSceneSettings(merged);
    if (sceneMgr.current) {
      sceneMgr.current.updateSettings(merged);
    }
  };
  useEffect(() => {
    if (activeTool === "clip" && sceneMgr.current) {
      sceneMgr.current.setClippingEnabled(clipEnabled);
      if (clipEnabled) {
        let box = sceneMgr.current.computeTotalBounds(true);
        if (box.isEmpty()) {
          box = sceneMgr.current.computeTotalBounds(false);
        }
        if (!box.isEmpty()) {
          sceneMgr.current.updateClippingPlanes(box, clipValues, clipActive);
        }
      }
    }
  }, [clipEnabled, clipValues, clipActive, activeTool]);
  useEffect(() => {
    if (sceneMgr.current) {
      sceneMgr.current.startMeasurement(measureType);
    }
  }, [measureType]);
  const handleSelect = useCallback(async (obj, intersect) => {
    if (!sceneMgr.current) return;
    if (!obj) {
      setSelectedUuid(null);
      setSelectedProps(null);
      sceneMgr.current.highlightObject(null);
      return;
    }
    const uuid = obj.uuid || obj.id;
    if (!uuid) return;
    setSelectedUuid(uuid);
    sceneMgr.current.highlightObject(uuid);
    if (propOnSelect) propOnSelect(uuid, obj);
    let realObj = obj instanceof THREE.Object3D ? obj : sceneMgr.current.contentGroup.getObjectByProperty("uuid", uuid);
    if (!realObj && sceneMgr.current) ;
    const target = realObj || obj;
    const basicProps = {};
    const geoProps = {};
    const ifcProps = {};
    const nodeID = String(target.bimId !== void 0 ? target.bimId : uuid).replace(/^bim_/, "");
    basicProps[t("prop_type")] = target.type || (target.children ? "Group" : "Mesh");
    basicProps[t("prop_id")] = nodeID;
    if (target.name && !target.name.startsWith("Mesh_") && !target.name.startsWith("Group_")) {
      basicProps[t("prop_name")] = target.name;
    }
    if (target instanceof THREE.Object3D) {
      const worldPos = new THREE.Vector3();
      target.getWorldPosition(worldPos);
      geoProps[t("prop_pos")] = `${worldPos.x.toFixed(2)}, ${worldPos.y.toFixed(2)}, ${worldPos.z.toFixed(2)}`;
    }
    if (target.isMesh || target.type === "Mesh") {
      if (target instanceof THREE.Mesh) {
        const box = new THREE.Box3().setFromObject(target);
        const size = new THREE.Vector3();
        box.getSize(size);
        geoProps[t("prop_dim")] = `${size.x.toFixed(2)} x ${size.y.toFixed(2)} x ${size.z.toFixed(2)}`;
        if (target.geometry) {
          geoProps[t("prop_vert")] = (target.geometry.attributes.position?.count || 0).toLocaleString();
          if (target.geometry.index) {
            geoProps[t("prop_tri")] = (target.geometry.index.count / 3).toLocaleString();
          } else {
            geoProps[t("prop_tri")] = ((target.geometry.attributes.position?.count || 0) / 3).toLocaleString();
          }
        }
      } else if (target.userData?.boundingBox) {
        const size = new THREE.Vector3();
        target.userData.boundingBox.getSize(size);
        geoProps[t("prop_dim")] = `${size.x.toFixed(2)} x ${size.y.toFixed(2)} x ${size.z.toFixed(2)}`;
      }
      if (target.isInstancedMesh) {
        geoProps[t("prop_inst")] = target.count.toLocaleString();
      }
      const userData = target.userData || {};
      const parentUserData = target.parent?.userData || {};
      if (target.properties) {
        Object.assign(ifcProps, target.properties);
      } else if (userData.isIFC || parentUserData.isIFC) {
        const ifcTarget = userData.isIFC ? target : target.parent;
        if (ifcTarget && ifcTarget.userData.ifcAPI && ifcTarget.userData.modelID !== void 0) {
          const expressID = userData.expressID;
          if (expressID) {
            try {
              const ifcMgr = ifcTarget.userData.ifcManager;
              const flatProps = await ifcMgr.getItemProperties(ifcTarget.userData.modelID, expressID);
              if (flatProps) {
                Object.assign(ifcProps, flatProps);
              }
            } catch (e) {
              console.error("IFC Props Error", e);
            }
          }
        }
      }
    } else if (target.userData?.boundingBox) {
      const size = new THREE.Vector3();
      target.userData.boundingBox.getSize(size);
      geoProps[t("prop_dim")] = `${size.x.toFixed(2)} x ${size.y.toFixed(2)} x ${size.z.toFixed(2)}`;
    }
    const finalProps = {
      [t("pg_basic")]: basicProps,
      [t("pg_geo")]: geoProps
    };
    if (Object.keys(ifcProps).length > 0) {
      finalProps[t("pg_ifc") || "IFC Properties"] = ifcProps;
    }
    setSelectedProps(finalProps);
  }, [sceneMgr, setSelectedUuid, setSelectedProps, propOnSelect, t]);
  const processFiles = useCallback(async (items) => {
    if (!items.length || !sceneMgr.current) return;
    console.log("[ThreeViewer] processFiles called with", items.length, "items");
    setLoading(true);
    setStatus(t("loading"));
    setProgress(0);
    try {
      const nbimItems = [];
      const otherItems = [];
      for (const item of items) {
        const path = typeof item === "string" ? item.split("?")[0].split("#")[0] : item.name;
        if (path.toLowerCase().endsWith(".nbim")) {
          nbimItems.push(item);
        } else {
          otherItems.push(item);
        }
      }
      console.log("[ThreeViewer] nbimItems:", nbimItems.length, "otherItems:", otherItems.length);
      for (const item of nbimItems) {
        if (sceneMgr.current) {
          if (typeof item === "string") {
            console.log("[ThreeViewer] Fetching NBIM URL:", item);
            const response = await fetch(item);
            if (!response.ok) throw new Error(`HTTP ${response.status} when fetching NBIM`);
            const blob = await response.blob();
            const fileName = item.split("?")[0].split("#")[0].split("/").pop() || "model.nbim";
            const file = new File([blob], fileName);
            await sceneMgr.current.loadNbim(file, t, (p, msg) => {
              setProgress(p);
              if (msg) setStatus(cleanStatus(msg));
            });
          } else {
            console.log("[ThreeViewer] Loading NBIM File:", item.name);
            await sceneMgr.current.loadNbim(item, t, (p, msg) => {
              setProgress(p);
              if (msg) setStatus(cleanStatus(msg));
            });
          }
        }
      }
      if (otherItems.length > 0) {
        console.log("[ThreeViewer] Loading other model files via loadModelFiles...");
        const loadedObjects = await loadModelFiles(
          otherItems,
          (p, msg) => {
            setProgress(p);
            if (msg) setStatus(cleanStatus(msg));
          },
          t,
          sceneSettings,
          // Pass settings
          libPath
        );
        console.log("[ThreeViewer] loadModelFiles returned", loadedObjects.length, "objects");
        for (const obj of loadedObjects) {
          await sceneMgr.current.addModel(obj, t);
        }
      }
      updateTree();
      setStatus(t("success"));
      console.log("[ThreeViewer] processFiles completed successfully");
      setTimeout(() => {
        if (sceneMgr.current) {
          sceneMgr.current.fitView();
          sceneMgr.current.setView("iso");
        }
      }, 500);
    } catch (err) {
      console.error("[ThreeViewer] processFiles error:", err);
      setStatus(t("failed"));
      setToast({ message: `${t("failed")}: ${err.message}`, type: "error" });
    } finally {
      setLoading(false);
    }
  }, [sceneMgr, setLoading, setStatus, setProgress, t, cleanStatus, sceneSettings, libPath, updateTree, setToast]);
  const handleOpenFiles = async (e) => {
    if (!e.target.files?.length) return;
    await processFiles(Array.from(e.target.files));
    e.target.value = "";
  };
  const handleOpenUrl = async () => {
    const url = window.prompt(t("menu_open_url"), "http://");
    if (!url || !url.startsWith("http")) return;
    console.log("[ThreeViewer] handleOpenUrl called with:", url);
    setLoading(true);
    setStatus(t("processing") + "...");
    try {
      const urlPath = url.split("?")[0].split("#")[0];
      console.log("[ThreeViewer] Parsed path:", urlPath);
      if (urlPath.toLowerCase().endsWith(".json") || urlPath.includes("tileset")) {
        console.log("[ThreeViewer] Detected as 3D Tiles");
        if (sceneMgr.current) {
          sceneMgr.current.addTileset(url, t, (p, msg) => {
            setProgress(p);
            if (msg) setStatus(cleanStatus(msg));
          });
          updateTree();
          setStatus(t("tileset_loaded"));
          setTimeout(() => sceneMgr.current?.fitView(), 500);
        }
      } else {
        await processFiles([url]);
      }
    } catch (err) {
      console.error("[ThreeViewer] handleOpenUrl error:", err);
      setStatus(t("failed"));
      setToast({ message: `${t("failed")}: ${err.message}`, type: "error" });
    } finally {
      setLoading(false);
    }
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      const supportedExtensions = [".lmb", ".lmbz", ".glb", ".gltf", ".ifc", ".nbim", ".fbx", ".obj", ".stl", ".ply", ".3mf", ".stp", ".step", ".igs", ".iges"];
      const validFiles = files.filter((file) => {
        const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
        return supportedExtensions.includes(ext);
      });
      if (validFiles.length < files.length) {
        setToast({ message: t("unsupported_format"), type: "info" });
      }
      if (validFiles.length > 0) {
        await processFiles(validFiles);
      }
    }
  };
  const handleOpenFolder = async (e) => {
    if (!e.target.files?.length || !sceneMgr.current) return;
    setLoading(true);
    setProgress(0);
    try {
      const url = await parseTilesetFromFolder(
        e.target.files,
        (p, msg) => {
          setProgress(p);
          if (msg) setStatus(cleanStatus(msg));
        },
        t
      );
      if (url) {
        sceneMgr.current.addTileset(url, t, (p, msg) => {
          setProgress(p);
          if (msg) setStatus(cleanStatus(msg));
        });
        updateTree();
        setStatus(t("tileset_loaded"));
        setTimeout(() => sceneMgr.current?.fitView(), 500);
      }
    } catch (err) {
      console.error(err);
      setStatus(t("failed") + ": " + err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleExport = async (format) => {
    if (!sceneMgr.current) return;
    const content = sceneMgr.current.contentGroup;
    if (format === "nbim") {
      if (content.children.length === 0) {
        setToast({ message: t("no_models"), type: "info" });
        return;
      }
      setLoading(true);
      setStatus(t("processing") + "...");
      setActiveTool("none");
      setTimeout(async () => {
        try {
          await sceneMgr.current?.exportNbim(t);
          setToast({ message: t("success"), type: "success" });
        } catch (e) {
          console.error(e);
          setToast({ message: t("failed") + ": " + e.message, type: "error" });
        } finally {
          setLoading(false);
        }
      }, 100);
      return;
    }
    const modelsToExport = content.children.filter((c) => !c.userData.isOptimizedGroup && c.name !== "TilesRenderer");
    if (modelsToExport.length === 0) {
      setToast({ message: t("no_models"), type: "info" });
      return;
    }
    const exportGroup = new THREE.Group();
    modelsToExport.forEach((m) => exportGroup.add(m.clone()));
    setLoading(true);
    setProgress(0);
    setStatus(t("processing") + "...");
    setActiveTool("none");
    setTimeout(async () => {
      try {
        let blob = null;
        let filename = `export.${format}`;
        if (format === "3dtiles") {
          if (!window.showDirectoryPicker) {
            setToast({ message: t("select_output"), type: "info" });
            throw new Error("Browser does not support directory picker");
          }
          const dirHandle = await window.showDirectoryPicker({ mode: "readwrite" });
          const filesMap = await convertLMBTo3DTiles(exportGroup, (msg) => {
            if (msg.includes("%")) {
              const p = parseInt(msg.match(/(\d+)%/)?.[1] || "0");
              setProgress(p);
            }
            setStatus(cleanStatus(msg));
          });
          setStatus(t("writing"));
          let writeCount = 0;
          for (const [name, b] of filesMap) {
            const fileHandle = await dirHandle.getFileHandle(name, { create: true });
            const writable = await fileHandle.createWritable();
            await writable.write(b);
            await writable.close();
            writeCount++;
            if (writeCount % 5 === 0) setProgress(Math.floor(writeCount / filesMap.size * 100));
          }
          setToast({ message: t("success"), type: "success" });
          return;
        } else if (format === "glb") {
          blob = await exportGLB(exportGroup);
        } else if (format === "lmb") {
          blob = await exportLMB(exportGroup, (msg) => setStatus(cleanStatus(msg)));
        }
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = filename;
          a.click();
          URL.revokeObjectURL(url);
          setToast({ message: t("success"), type: "success" });
        }
      } catch (e) {
        console.error(e);
        setToast({ message: t("failed") + ": " + e.message, type: "error" });
      } finally {
        setLoading(false);
        setProgress(0);
      }
    }, 100);
  };
  const handleView = (v) => {
    sceneMgr.current?.setView(v);
  };
  const handleClear = async () => {
    if (!sceneMgr.current) return;
    setConfirmState({
      isOpen: true,
      title: t("op_clear"),
      message: t("confirm_clear"),
      action: async () => {
        setLoading(true);
        setProgress(0);
        setStatus(t("op_clear") + "...");
        try {
          await sceneMgr.current?.clear();
          setSelectedUuid(null);
          setSelectedProps(null);
          setMeasureHistory([]);
          updateTree();
          setStatus(t("ready"));
        } catch (error) {
          console.error("清空场景失败:", error);
        } finally {
          setLoading(false);
        }
      }
    });
  };
  return /* @__PURE__ */ jsx(ErrorBoundary, { t, styles, theme, children: /* @__PURE__ */ jsxs(
    "div",
    {
      style: styles.container,
      onDragOver: handleDragOver,
      onDrop: handleDrop,
      children: [
        /* @__PURE__ */ jsx(GlobalStyle, { theme }),
        /* @__PURE__ */ jsx(
          MenuBar,
          {
            t,
            themeType: themeMode,
            setThemeType: setThemeMode,
            handleOpenFiles,
            handleOpenFolder,
            handleOpenUrl,
            handleBatchConvert: (files) => {
              const filename = window.prompt(t("enter_filename"), `batch_model_${(/* @__PURE__ */ new Date()).getTime()}.nbim`);
              if (filename === null) return;
              setLoading(true);
              setStatus(t("converting"));
              performBatchConvert({
                files,
                t,
                filename,
                onProgress: (p, msg) => {
                  setProgress(p);
                  if (msg) setStatus(msg);
                },
                libPath
              }).then(() => {
                setToast({ message: t("success"), type: "success" });
              }).catch((err) => {
                setToast({ message: err.message, type: "error" });
              }).finally(() => {
                setLoading(false);
              });
            },
            handleView,
            handleClear,
            pickEnabled,
            setPickEnabled,
            activeTool,
            setActiveTool,
            showOutline,
            setShowOutline,
            showProps,
            setShowProps,
            showStats,
            setShowStats: (v) => {
              setShowStats(v);
              localStorage.setItem("3dbrowser_showStats", String(v));
            },
            sceneMgr: sceneMgr.current,
            styles,
            theme,
            hiddenMenus,
            onOpenAbout: () => setIsAboutOpen(true)
          }
        ),
        /* @__PURE__ */ jsxs("div", { style: { flex: 1, display: "flex", position: "relative", overflow: "hidden" }, children: [
          showOutline && /* @__PURE__ */ jsxs("div", { style: {
            width: `${leftWidth}px`,
            backgroundColor: theme.panelBg,
            borderRight: `1px solid ${theme.border}`,
            display: "flex",
            flexDirection: "column",
            zIndex: 10,
            position: "relative"
          }, children: [
            /* @__PURE__ */ jsxs("div", { style: styles.floatingHeader, children: [
              /* @__PURE__ */ jsx("span", { children: t("interface_outline") }),
              /* @__PURE__ */ jsx(
                "div",
                {
                  onClick: () => setShowOutline(false),
                  style: { cursor: "pointer", opacity: 0.6, display: "flex", padding: 2, borderRadius: "50%" },
                  onMouseEnter: (e) => e.currentTarget.style.backgroundColor = theme.itemHover,
                  onMouseLeave: (e) => e.currentTarget.style.backgroundColor = "transparent",
                  children: /* @__PURE__ */ jsx(IconClose, { width: 16, height: 16 })
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { style: { flex: 1, overflow: "hidden" }, children: /* @__PURE__ */ jsx(
              SceneTree,
              {
                t,
                sceneMgr: sceneMgr.current,
                treeRoot,
                setTreeRoot,
                selectedUuid,
                onSelect: (uuid, obj) => handleSelect(obj),
                onToggleVisibility: handleToggleVisibility,
                onDelete: handleDeleteObject,
                showDeleteButton,
                styles,
                theme
              }
            ) }),
            /* @__PURE__ */ jsx(
              "div",
              {
                onMouseDown: () => resizingLeft.current = true,
                style: {
                  position: "absolute",
                  right: -2,
                  top: 0,
                  bottom: 0,
                  width: 4,
                  cursor: "col-resize",
                  zIndex: 20
                }
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { ref: viewportRef, style: {
            flex: 1,
            position: "relative",
            backgroundColor: theme.canvasBg,
            overflow: "hidden"
          }, children: [
            /* @__PURE__ */ jsx("canvas", { ref: canvasRef, style: { width: "100%", height: "100%", outline: "none" } }),
            /* @__PURE__ */ jsx(ViewCube, { sceneMgr: mgrInstance, theme, lang }),
            toast && /* @__PURE__ */ jsxs("div", { style: {
              position: "fixed",
              top: "140px",
              // 位于菜单栏下方
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: toast.type === "error" ? theme.danger : toast.type === "success" ? theme.accent : theme.panelBg,
              color: toast.type === "info" ? theme.text : "#fff",
              padding: "12px 20px 12px 24px",
              borderRadius: "4px",
              // 稍微增加一点圆角，更现代
              boxShadow: `0 8px 24px rgba(0,0,0,0.25)`,
              zIndex: 1e4,
              display: "flex",
              alignItems: "center",
              gap: "12px",
              fontSize: "14px",
              borderLeft: `4px solid rgba(255,255,255,0.4)`,
              animation: "fadeInDown 0.4s cubic-bezier(0.16, 1, 0.3, 1)"
            }, children: [
              /* @__PURE__ */ jsx("span", { children: toast.message }),
              /* @__PURE__ */ jsx(
                "div",
                {
                  onClick: () => setToast(null),
                  style: {
                    cursor: "pointer",
                    padding: "4px",
                    display: "flex",
                    borderRadius: "50%",
                    marginLeft: "8px",
                    backgroundColor: "rgba(255,255,255,0.1)"
                  },
                  onMouseEnter: (e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.2)",
                  onMouseLeave: (e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)",
                  children: /* @__PURE__ */ jsx(IconClose, { size: 14 })
                }
              )
            ] }),
            /* @__PURE__ */ jsx(LoadingOverlay, { t, loading, status, progress, styles, theme }),
            activeTool === "measure" && /* @__PURE__ */ jsx(
              MeasurePanel,
              {
                t,
                sceneMgr: sceneMgr.current,
                measureType,
                setMeasureType,
                measureHistory,
                highlightedId: highlightedMeasureId,
                onHighlight: (id) => {
                  setHighlightedMeasureId(id);
                  sceneMgr.current?.highlightMeasurement(id);
                },
                onDelete: (id) => {
                  sceneMgr.current?.removeMeasurement(id);
                  setMeasureHistory((prev) => prev.filter((i) => i.id !== id));
                  if (highlightedMeasureId === id) {
                    setHighlightedMeasureId(null);
                    sceneMgr.current?.highlightMeasurement(null);
                  }
                },
                onClear: () => {
                  sceneMgr.current?.clearAllMeasurements();
                  setMeasureHistory([]);
                  setHighlightedMeasureId(null);
                  setMeasureType("none");
                },
                onClose: () => setActiveTool("none"),
                styles,
                theme
              }
            ),
            activeTool === "clip" && /* @__PURE__ */ jsx(
              ClipPanel,
              {
                t,
                sceneMgr: sceneMgr.current,
                onClose: () => setActiveTool("none"),
                clipEnabled,
                setClipEnabled,
                clipValues,
                setClipValues,
                clipActive,
                setClipActive,
                styles,
                theme
              }
            ),
            activeTool === "export" && /* @__PURE__ */ jsx(ExportPanel, { t, onClose: () => setActiveTool("none"), onExport: handleExport, styles, theme }),
            activeTool === "settings" && /* @__PURE__ */ jsx(
              SettingsPanel,
              {
                t,
                onClose: () => setActiveTool("none"),
                settings: sceneSettings,
                onUpdate: handleSettingsUpdate,
                currentLang: lang,
                setLang,
                themeMode,
                setThemeMode,
                showStats,
                setShowStats,
                styles,
                theme
              }
            )
          ] }),
          showProps && /* @__PURE__ */ jsxs("div", { style: {
            width: `${rightWidth}px`,
            backgroundColor: theme.panelBg,
            borderLeft: `1px solid ${theme.border}`,
            display: "flex",
            flexDirection: "column",
            zIndex: 10,
            position: "relative"
          }, children: [
            /* @__PURE__ */ jsxs("div", { style: styles.floatingHeader, children: [
              /* @__PURE__ */ jsx("span", { children: t("interface_props") }),
              /* @__PURE__ */ jsx(
                "div",
                {
                  onClick: () => setShowProps(false),
                  style: { cursor: "pointer", opacity: 0.6, display: "flex", padding: 2, borderRadius: "50%" },
                  onMouseEnter: (e) => e.currentTarget.style.backgroundColor = theme.itemHover,
                  onMouseLeave: (e) => e.currentTarget.style.backgroundColor = "transparent",
                  children: /* @__PURE__ */ jsx(IconClose, { width: 16, height: 16 })
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { style: { flex: 1, overflow: "hidden" }, children: /* @__PURE__ */ jsx(PropertiesPanel, { t, selectedProps, styles, theme }) }),
            /* @__PURE__ */ jsx(
              "div",
              {
                onMouseDown: () => resizingRight.current = true,
                style: {
                  position: "absolute",
                  left: -2,
                  top: 0,
                  bottom: 0,
                  width: 4,
                  cursor: "col-resize",
                  zIndex: 20
                }
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: {
          height: "24px",
          backgroundColor: theme.accent,
          color: "white",
          display: "flex",
          alignItems: "center",
          padding: "0 12px",
          fontSize: "11px",
          zIndex: 1e3,
          justifyContent: "space-between"
        }, children: [
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "16px" }, children: [
            /* @__PURE__ */ jsx("span", { children: status }),
            loading && /* @__PURE__ */ jsxs("span", { children: [
              progress,
              "%"
            ] }),
            chunkProgress.total > 0 && /* @__PURE__ */ jsxs("span", { style: {
              display: "flex",
              alignItems: "center",
              gap: "8px",
              paddingLeft: "8px",
              borderLeft: "1px solid rgba(255,255,255,0.3)"
            }, children: [
              t("loading_chunks"),
              ": ",
              chunkProgress.loaded,
              " / ",
              chunkProgress.total,
              chunkProgress.loaded < chunkProgress.total && /* @__PURE__ */ jsx("div", { style: {
                width: "40px",
                height: "4px",
                backgroundColor: "rgba(255,255,255,0.2)",
                borderRadius: "2px",
                overflow: "hidden"
              }, children: /* @__PURE__ */ jsx("div", { style: {
                width: `${chunkProgress.loaded / chunkProgress.total * 100}%`,
                height: "100%",
                backgroundColor: "#fff"
              } }) })
            ] }),
            selectedUuid && /* @__PURE__ */ jsxs("span", { style: { opacity: 0.8, paddingLeft: "8px", borderLeft: "1px solid rgba(255,255,255,0.3)" }, children: [
              t("prop_id"),
              ": ",
              selectedUuid.substring(0, 8),
              "..."
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "16px", alignItems: "center" }, children: [
            showStats && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsxs("span", { children: [
                formatNumber(stats.meshes),
                " ",
                t("monitor_meshes")
              ] }),
              /* @__PURE__ */ jsxs("span", { children: [
                formatNumber(stats.faces),
                " ",
                t("monitor_faces")
              ] }),
              /* @__PURE__ */ jsx("span", { children: formatMemory(stats.memory) }),
              /* @__PURE__ */ jsxs("span", { children: [
                stats.drawCalls,
                " ",
                t("monitor_calls")
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { style: { width: "1px", height: "12px", backgroundColor: "rgba(255,255,255,0.3)" } }),
            /* @__PURE__ */ jsx("div", { style: { opacity: 0.9 }, children: lang === "zh" ? "简体中文" : "English" }),
            /* @__PURE__ */ jsx("div", { style: {
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginLeft: "8px",
              padding: "2px 8px",
              borderRadius: "4px",
              backgroundColor: "rgba(255,255,255,0.1)"
            }, children: /* @__PURE__ */ jsx("span", { style: { fontWeight: "600", letterSpacing: "0.5px" }, children: "3D BROWSER" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          ConfirmModal,
          {
            isOpen: confirmState.isOpen,
            title: confirmState.title,
            message: confirmState.message,
            onConfirm: () => {
              confirmState.action();
              setConfirmState({ ...confirmState, isOpen: false });
            },
            onCancel: () => setConfirmState({ ...confirmState, isOpen: false }),
            t,
            styles,
            theme
          }
        ),
        /* @__PURE__ */ jsx(
          AboutModal,
          {
            isOpen: isAboutOpen,
            onClose: () => setIsAboutOpen(false),
            t,
            styles,
            theme
          }
        ),
        errorState.isOpen && /* @__PURE__ */ jsx("div", { style: styles.modalOverlay, children: /* @__PURE__ */ jsxs("div", { style: { ...styles.modalContent, width: "450px" }, children: [
          /* @__PURE__ */ jsxs("div", { style: { ...styles.floatingHeader, backgroundColor: theme.danger, color: "white" }, children: [
            /* @__PURE__ */ jsx("span", { children: errorState.title }),
            /* @__PURE__ */ jsx(
              "div",
              {
                onClick: () => setErrorState((prev) => ({ ...prev, isOpen: false })),
                style: { cursor: "pointer", display: "flex", padding: 2, borderRadius: "50%" },
                onMouseEnter: (e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.2)",
                onMouseLeave: (e) => e.currentTarget.style.backgroundColor = "transparent",
                children: /* @__PURE__ */ jsx(IconClose, { width: 18, height: 18 })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }, children: [
            /* @__PURE__ */ jsx("div", { style: { fontWeight: "600", fontSize: "15px", color: theme.text }, children: errorState.message }),
            /* @__PURE__ */ jsx("div", { style: { display: "flex", justifyContent: "flex-end", marginTop: "8px" }, children: /* @__PURE__ */ jsx(
              "button",
              {
                style: { ...styles.btn, backgroundColor: theme.accent, color: "white", borderColor: theme.accent, padding: "8px 24px" },
                onClick: () => setErrorState((prev) => ({ ...prev, isOpen: false })),
                children: t("confirm") || "确定"
              }
            ) })
          ] })
        ] }) })
      ]
    }
  ) });
};

export { DEFAULT_FONT, SceneManager, ThreeViewer, colors, createGlobalStyle, createStyles, getTranslation, loadModelFiles, parseTilesetFromFolder, performBatchConvert, themes };

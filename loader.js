exports.after = function( paths, callback ) {

	var _callback, _paths, _count, 
		_loadedCount, _loadedImgs, _erroredImgs,
		_tmpImgs;

	_paths      = ( typeof paths    === 'object' )   ? paths : [paths];
	_callback   = ( typeof callback === 'function' ) ? callback : null;
	_count      = paths.length;

	_loadedCount = 0;
	_loadedImgs  = [];
	_errors = [];

	for (var i = 0; i < _count; i++) {

		_loadedImgs[i] = new Image();

		_loadedImgs[i].addEventListener('load', function(ev) {

			_loadedCount++;

			if ( _loadedCount === _count && _callback ) {

				_callback( _errors, _loadedImgs );

			}	

		}, false);

		
		_loadedImgs[i].addEventListener('error', function(ev) {

			_loadedCount++;
			_errors.push(ev);

			if ( _loadedCount === _count && _callback ) {

				_callback( _errors ,  _loadedImgs );
			}

		}, false);
		
		_loadedImgs[i].src = _paths[i];
	}

	return this;
}
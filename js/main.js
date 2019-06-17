var Snap = require('snapsvg');

var SIZE = [ 466, 87 ];

var text = document.getElementById( 'Layer_1' ).innerHTML;
var paths = [];
Snap.parse( text ).selectAll( 'path' ).forEach( path => paths.push( path ));

paths = paths
    .map( path => path.attr('d'))
    .map( d => Snap.path.toCubic( d ))

var mapPath = ( path, fn ) => path.map( parts => {
    var ret = [ parts[ 0 ] ];
    for ( var i = 1; i < parts.length; i += 2 ) {
        ret = ret.concat( fn([ parts[ i ], parts[ i + 1 ] ]) );
    }
    return ret;
})
var mapPaths = ( paths, fn ) => paths.map( path => mapPath( path, fn ) );

var compose = (...fns) => fns.reverse().reduce((f, g) => (...args) => f(g(...args)));
var curry = fn => ( a, b ) => b === undefined ? c => fn( a, c ) : fn( a, b );
var vop = op => curry( ([ x1, y1 ], [ x2, y2 ]) => [ op( x1, x2 ), op( y1, y2 ) ] );
var add = vop( ( a, b ) => a + b );
var multiply = vop( ( a, b ) => a * b );
var divide = vop( ( a, b ) => a / b );

// a^2 + b^2 = 1;
// a^2 = 1 - b^2;
// a = Math.sqrt( 1 - b^2 )

var log = p => { console.log( p ); return p };

paths = mapPaths( paths, compose(
    p => divide( p, SIZE ),
    log,
    p => {
        console.log( p );
        if ( p[ 1 ] === 5.686274509803921 ) debugger
        var p2 = add( p, [ 0, Math.sqrt( 1 - Math.pow( Math.abs( p[ 0 ] ), 2 ) ) ] )
        if ( p2.some( isNaN ) ) debugger
        return p2;
    },
    multiply( SIZE )
))

var s = Snap(window.innerWidth, window.innerHeight);
paths.forEach( path => s.path( path ));

// var draw = SVG( document.getElementById('out') );

// var text = draw.svg( document.getElementById( 'Layer_1' ).innerHTML )

// console.log( text.children() );
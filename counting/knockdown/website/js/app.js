
angular.module( 'knockdown', [] )
   
   .controller( 'GameController', function( $scope ) {
      $scope.working = "Say Hello to Zippy Owl";
   })
   
   .factory( 'D3Service', function() {
      
      function _createSvgAsChild( node, w, h ) {
         d3.select( node )
         .append( 'svg' )
         .attr( 'width', w || 100 )
         .attr( 'height', h || 100 );
         console.log( node );
         return node.lastChild
      }

      function _addPng( c ) {
         d3.select( c.node )
         .append( 'image' )
         .attr( 'x', c.x ).attr( 'y', c.y )
         .attr( 'width', c.width ).attr( 'height', c.height )
         .attr( "class", c.clazz )
         .attr( 'xlink:href', c.img );
         return c.node.lastChild
      }

      function _addText( c ) {
         d3.select( c.node )
         .append( 'text' )
         .attr( 'x', c.x ).attr( 'y', c.y )
         .text( c.text )
         .attr( "font-size", c.fontSize || 12 )
         .attr( "fill", c.fill || "black" )
         .on( 'click', c.onclick );
         return c.node.lastChild
      }

      function _addRectangle( c ) {
         d3.select( c.node ).append( 'rect' )
         .attr( 'width', c.width || 10  )
         .attr( 'height', c.height || 10 )
         .attr( 'x', c.x || 0 )
         .attr( 'y', c.y || 0 )
         .attr( 'fill', c.fill || 'white' )
         .attr( 'stroke', c.stroke || 'black' );
         return c.node.lastChild;
      }

      function _movePngTo( c ) {
         var t = d3.select( c.png )
         .transition()
         //.delay( 1000 )
         .attr( 'x', c.x )
         .attr( 'y', c.y );
         
         if ( c.size ) {
            t = t.attr( 'width', c.size.width )
            .attr( 'height', c.size.height )
         }

         t.duration( c.ms );
      }

      return {
         createSvgAsChild: _createSvgAsChild,
         addPng: _addPng,
         movePngTo: _movePngTo,
         addRectangle: _addRectangle,
         addText: _addText
      }
   })

   .controller( 'KnockdownGameController', function() {
   
   })

   .directive( 'knockdownGame', function( D3Service ) {

      function _shuffle( array ) {
         var ci = array.length, temporaryValue, randomIndex;

         while ( 0 !== ci ) {

            randomIndex = Math.floor( Math.random() * ci );
            ci -= 1;

            temporaryValue = array[ ci ];
            array[ ci ] = array[ randomIndex ];
            array[ randomIndex ] = temporaryValue;
         }

         return array;
      }

      function _addMouseRow( owlie, c ) {
   
         var currentx = c.startx;

         var i;
         for ( i=0; i<c.numMice; i++ ) { 
   
            var n = c.numbers[i];
            var digitAdjust = n < 10 ? 100 : 90;
   
            var mousie = D3Service.addPng({ 
               img: "clips/mouse.png", 
               node: c.node,
               x: currentx, y: c.y,
               height: c.mouseHeight,
               width: c.mouseWidth,
               clazz: 'mouse'
            });

            var text = D3Service.addText({
               node: c.node,
               text: n,
               x: currentx + digitAdjust, 
               y: c.y + 100,
               fontSize: 40,
               fill: 'black'
            });

            mousie.onclick = function( data ) {
                  
               console.log( "The mouse with the " + data.srcElement.innerHTML + " has been clicked" );
                  
               D3Service.movePngTo({ 
                  png: owlie, 
                  ms: 1000, 
                  x: data.x, 
                  y: data.y 
               });

               setTimeout( function() {
                  D3Service.movePngTo({ 
                     png: owlie, 
                     ms: 1000, 
                     x: 100, 
                     y: 100,
                     size: {
                        width: 0,
                        height: 0
                     }
                  });

                  D3Service.movePngTo({ 
                     png: data.srcElement, 
                     ms: 1000, 
                     x: 100, 
                     y: 100,
                     size: {
                        width: 0,
                        height: 0
                     }
                  });
               }, 500 );
            }; 

            c.mice.push({ 
               number: n,
               text: text, 
               image: mousie
            });

            currentx = currentx + c.mouseSeperator;
         }
      }

      function _addSky( c ) {
         return D3Service.addRectangle({
            node: c.svg,
            fill: 'lightblue',
            stroke: 'white',
            height: 300,
            width: c.svgWidth
         });
      }

      function _addGrass( c ) {
         return D3Service.addRectangle({
            node: c.svg,
            fill: 'green',
            stroke: 'white',
            height: 300,
            width: c.svgWidth,
            y: 300
         });
      }

      function _addSun( c ) {
         return D3Service.addPng({ 
               img: "clips/sun.png", 
               node: c.svg,
               x: 400, y: 0,
               height: 200,
               width: 300
         });
      }

      function _addCloud( c ) {
         return D3Service.addPng({ 
               img: "clips/cloud.png", 
               node: c.svg,
               x: c.x, y: c.y,
               height: c.height,
               width: c.width
         });
      }

      function _link( scope, element, attrs ) {

         var svgHeight = 1000;
         var svgWidth = 1000;

         var size = 500;
         var ms = 500;
         var mouseSeperator = 250;
         var currentx = 50;
         var mouseHeight = 200;
         var mouseWidth = 200;
         var mice = [];

         var svg = D3Service.createSvgAsChild( element[0], svgWidth, svgHeight );
        
         var pCfg = {
            mouseHeight: mouseHeight, 
            mouseWidth: mouseWidth,
            mouseSeperator: mouseSeperator,
            mice: mice
         }
         
         var grass = _addGrass({
            svg: svg,
            svgWidth: svgWidth
         });

         var sky = _addSky({
            svg: svg,
            svgWidth: svgWidth
         });

         var sun = _addSun({ 
            svg: svg 
         });

         var cloud1 = _addCloud({ 
               svg: svg,
               x: 0, y: -50,
               height: 250,
               width: 350
         });

         var cloud2 = _addCloud({ 
               svg: svg,
               x: 200, y: 50,
               height: 150,
               width: 250
         });

         var cloud3 = _addCloud({ 
               svg: svg,
               x: 700, y: 40,
               height: 200,
               width: 300
         });

         var numbers = [], i;
         for ( i=0; i<11; i++ ) {
            numbers[i] = i;
         }

         numbers = _shuffle( numbers );

         var owlie = D3Service.addPng({ 
               img: "clips/owl.png", 
               node: svg,
               x: 850, y: 5,
               height: 150,
               width: 150
         });

         _addMouseRow( owlie, Object.assign( pCfg, {
            node: svg,
            startx: 120,
            y: 280,
            numMice: 3,
            numbers: numbers.slice( 0, 3 )
         }));

         _addMouseRow( owlie, Object.assign( pCfg, {
            node: svg,
            startx: 250,
            y: 425,
            numMice: 2,
            numbers: numbers.slice( 3, 5 )
         }));

         var branch = D3Service.addPng({ 
               img: "clips/branch.png", 
               node: svg,
               x: 700, y: 40,
               height: 200,
               width: 300
         });
      }

      return {
         restrict: 'E',
         scope: {},
         link: _link,
         controller: 'KnockdownGameController'
      }
   });


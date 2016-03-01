
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
         .attr( 'xlink:href', c.img );
         return c.node.lastChild
      }

      function _movePngTo( png, ms, x, y ) {
         d3.select( png ).transition()
         .attr( 'x', x )
         .attr( 'y', y )
         .duration( ms );
      }

      return {
         createSvgAsChild: _createSvgAsChild,
         addPng: _addPng,
         movePngTo: _movePngTo
      }
   })

   .directive( 'knockdownGame', function( D3Service ) {

      function _link( scope, element, attrs ) {

         var size = 500;
         var ms = 500;
         var seperator = 150;
         var currentx = 50;
         var columns = [];
         
         var svg = D3Service.createSvgAsChild( element[0], 800, size );
         
         var i;
         for ( i=0; i<4; i++ ) { 
            columns.push( D3Service.addPng({ 
                  img: "clips/pillar.png", 
                  node: svg,
                  x: currentx, y: 227,
                  height: 223,
                  width: 100
            }));
            currentx = currentx + seperator;
         }

         var owlie = D3Service.addPng({ 
               img: "clips/owl.png", 
               node: svg,
               x: 0, y: 0,
               height: 50,
               width: 50
         });

         function _genRand() {
            return Math.floor( Math.random() * size ) + 1;
         }

         D3Service.movePngTo( owlie, ms, 300, 300 );
         function _move() {
            setTimeout( function() {
               var x = _genRand();
               var y = _genRand();

               D3Service.movePngTo( 
                  owlie, ms, 
                  _genRand() - 50, 
                  _genRand() - 50 );
               _move();
            }, ms );
         }

         _move();
      }

      return {
         restrict: 'E',
         link: _link
      }
   });


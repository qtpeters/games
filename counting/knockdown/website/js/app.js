
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

      function _addPng( bitmap, node ) {
         d3.select( node )
         .append( 'image' )
         .attr( 'x', 0 ).attr( 'y', 0 )
         .attr( 'width', 50 ).attr( 'height', 50 )
         .attr( 'xlink:href', bitmap );
         return node.lastChild
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

         var size = 1000;

         console.log( "Directive is running" + element );
         var svg = D3Service.createSvgAsChild( element[0], size, size );
         var imageElement = D3Service.addPng( "clips/owl.png", svg );

         var ms = 500;

         function _genRand() {
            return Math.floor( Math.random() * size ) + 1;
         }

         D3Service.movePngTo( imageElement, ms, 300, 300 );
         function _move() {
            setTimeout( function() {
               var x = _genRand();
               var y = _genRand();

               D3Service.movePngTo( 
                  imageElement, ms, 
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


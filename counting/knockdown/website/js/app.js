
angular.module( 'knockdown', [] )
   
   .controller( 'GameController', function( $scope ) {
      $scope.working = "Angular is working";

   })
   
   .factory( 'D3Service', function() {
      
      function _createSvgAsChild( node, w, h ) {
         return d3.select( node )
         .append( 'svg' )
         .attr( 'width', w )
         .attr( 'height', h );
      }

      return {
         createSvgAsChild: _createSvgAsChild
      }
   })

   .directive( 'knockdownGame', function( D3Service ) {

      function _link( scope, element, attrs ) {
         console.log( "Directive is running" + element );
         var svg = D3Service.createSvgAsChild( element[0], 500, 500 );
      }

      return {
         restrict: 'E',
         link: _link
      }
   });


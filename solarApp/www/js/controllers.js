angular.module('starter.controllers', [])

.controller('DashCtrl', ['$scope', '$timeout','ServerData', function($scope, $timeout, ServerData) {
	var tempGegegvens=[];
	$scope.energieprijs = 0.23;
	$scope.datum = '2014-09-09'; // startdatum
	$scope.refreshData = function(){
		$scope.refresh = 'ja';
		ServerData.update().then(
			function(data){
				console.log(data);
				$scope.setData();	
			}
		);
	}
	$scope.setData = function(){
		ServerData.getDay($scope.datum).then( 
			function(data){
				var arrayVermogenVandaag 	= data[0].data.split(",");	
				$scope.dag 					= moment(data[0].day).format('D MMMM');
				$scope.updatedTime 			= moment(data[0].timestamp).calendar();
				/* variables CHART*/
				var chart1 		= {};
			    chart1.type 	= "LineChart";
			    chart1.data		= [
							       	['Tijd(uren)', 'Vermogen (kW)']
							      ];
				chart1.options 	= {
							        displayExactValues: true,
							        explorer: {
								        maxZoomOut:2,
								        keepInBounds: true
								    },
								    axisTitlesPosition:'in',
								    hAxis: {
								    		title: 'Tijd in uren',  
								    		titleTextStyle: {color: '#333'},
								    		textPosition:'in',
								    		gridlines:{count:12},
								    		viewWindowMode:'explicit',
								    		viewWindow:{
								                max:22,
								                min:6
								              } },
								    vAxis :{title: 'Vermogen in kW',  titleTextStyle: {color: '#333'}, textPosition:'in',
					              },

								    is3D: true,
								    width:"100%",
								    colors:['green'],
							        chartArea: {left:0,top:0,bottom:0,height:"90%", width:"100%"}
			    };
			    chart1.formatters = {
								      number : [{
								        columnNum: 1,
								        pattern: " #,##0"
								      }]
			    };

			    // end of vars
			    // prepare data for Chart
				for (index = 0; index < (arrayVermogenVandaag.length-1); ++index) {
					chart1.data.push([(index*(1/6)),parseFloat(arrayVermogenVandaag[index])]);
				};
			    // assign chart
			    $scope.chart = chart1;

				// Calculate PeakPower for Today		    
			    $scope.piekvermogen = Math.max.apply(Math, arrayVermogenVandaag); // 99
		        
		        /* energie total is available in $data */
		        var energieGegevens 	= data[0].energie_dag.split(",");
		        
		        $scope.totaleEnergie=0;
		        for(var i in energieGegevens) { 
					$scope.totaleEnergie += parseFloat(energieGegevens[i]); 
				}
				// round it
				$scope.totaleEnergie = Math.round($scope.totaleEnergie * 100) / 100  

				// totaal geld bespaard
				$scope.getBespaardeEuros = function ()
				  {
				    return Math.round($scope.energieprijs * $scope.totaleEnergie * 100) / 100  
				  };
				/* energie uit index */
				var dagnummer = data[0].day.substr(8,2);
				var energieVandaag = energieGegevens[dagnummer-1];
				$scope.opbrengstVandaag = energieVandaag;

				/* huidig vermogen */
				var index = arrayVermogenVandaag.length -5; // there are 4 emtpy leading zero's...
				$scope.actueelvermogen = arrayVermogenVandaag[index];
				var tempCount=0;
				for (var i = arrayVermogenVandaag.length; i-- > 0; ){
					if(arrayVermogenVandaag[i] =="0"){
						tempCount++;
						if(tempCount>10){
							$scope.nacht = true;
							$scope.actueelvermogen = '0';
							return; // blijbaar nacht.
						}else{
							continue;
						}
					}else{
						$scope.actueelvermogen = arrayVermogenVandaag[i];
						return; // stop maar.
					}
				}
			}
		);
	};
	$scope.setData();
}])
.controller('AccountCtrl', function($scope) {
	/* save settings (energy price etc) to localstorage etc */
});
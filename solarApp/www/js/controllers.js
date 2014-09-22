angular.module('starter.controllers', ['LocalStorageModule'])

.controller('DashCtrl', ['$scope', '$timeout','ServerData','localStorageService', function($scope, $timeout, ServerData,localStorageService) {
	var tempGegegvens=[];
	$scope.energieprijs = 0.23;
	$scope.datum = '2014-09-09'; // startdatum
	$scope.vorigeZichtbaar = true;
	$scope.volgendeZichtbaar = false;
	$scope.changeDay = function(direction){
		if(direction=="yesterday"){
			if(moment($scope.datum).subtract(1, 'days').isAfter(moment('2014-09-08'))){
				$scope.datum = moment($scope.datum).subtract(1, 'days').format('YYYY-MM-DD').toString();

			}else{
				//console.log('ken niet eerder');
			}
		}else{
			if(moment($scope.datum).add(1, 'days').isBefore(moment())){
				$scope.datum = moment($scope.datum).add(1, 'days').format('YYYY-MM-DD').toString();	
			}else{
				//console.log('ken niet');

			}
			
		}
		$scope.setData($scope.datum);
	}

	$scope.setData = function(dedatum){
		$scope.datum = dedatum; // startdatum
		ServerData.getDay(dedatum).then( 
			function(data){
				//console.log(data);
				var arrayVermogenVandaag 		= data[0].data.split(",");	
				/* huidige dag */
				$scope.dag = moment(data[0].day).format('D MMMM');
				$scope.updatedTime = moment(data[0].timestamp).calendar();
				/* variables */
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
			    $scope.piekvermogenVandaag = Math.max.apply(Math, arrayVermogenVandaag); // 99
		        
			    var peakPowerOverall = localStorageService.get('peakPowerOverall');
			    //console.log(peakPowerOverall);
			    if($scope.piekvermogenVandaag > peakPowerOverall || peakPowerOverall === null ){
			    	localStorageService.set('peakPowerOverall', $scope.piekvermogenVandaag);	
			    }
			    //localStorageService.set('peakPowerOverall',);
				//$scope.overallPeak = peakPowerOverall;	

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
				$scope.getRoi = function ()
				  {
				    return Math.round(100*$scope.getBespaardeEuros() / 38)/100  
				  };
				//$scope.bespaardeEuros = $scope.energieprijs * $scope.totaleEnergie;
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

.controller('MonthCtrl', ['$scope', '$timeout','ServerData','localStorageService', function($scope, $timeout, ServerData,localStorageService) {
	var tempGegegvens=[];
	$scope.energieprijs = 0.23;
	$scope.datum = '2014-09-08'; // startdatum
	$scope.vorigeZichtbaar = true;
	$scope.volgendeZichtbaar = false;
	$scope.changeDay = function(direction){
		if(direction=="yesterday"){
			if(moment($scope.datum).subtract(1, 'days').isAfter(moment('2014-09-08'))){
				$scope.datum = moment($scope.datum).subtract(1, 'days').format('YYYY-MM-DD').toString();

			}else{
				//console.log('ken niet eerder');
			}
		}else{
			if(moment($scope.datum).add(1, 'days').isBefore(moment())){
				$scope.datum = moment($scope.datum).add(1, 'days').format('YYYY-MM-DD').toString();	
			}else{
				//console.log('ken niet');

			}
			
		}
		$scope.setData($scope.datum);
	}

	$scope.setData = function(dedatum){
		$scope.datum = dedatum; // startdatum
		ServerData.getDay(dedatum).then( 
			function(data){
				var arrayVermogenVandaag 		= data[0].data.split(",");	
				var arrayEnergyMonth			= data[0].energie_dag.split(",");	
				/* huidige dag */
				$scope.dag = moment(data[0].day).format('D MMMM');
				$scope.updatedTime = moment(data[0].timestamp).calendar();
				/* variables */
				var chart1 		= {};
			    chart1.type 	= "ColumnChart";
			    chart1.data		= [
							       	['Tijd(uren)', 'Vermogen (kW)']
							      ];
				chart1.options 	= {
							        displayExactValues: true,
							        
								    axisTitlesPosition:'in',
								    hAxis: {
								    		title: 'Tijd in dagen',  
								    		titleTextStyle: {color: '#333'},
								    		textPosition:'in',
								    		gridlines:{count:31},
								    		viewWindowMode:'explicit',
								    		viewWindow:{
								                max:31,
								                min:1
								              } },
								    vAxis :{title: 'Opbrengst in kWh',  titleTextStyle: {color: '#333'}, textPosition:'in',
					              },

								    is3D: false,
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
				for (index = 0; index < (arrayEnergyMonth.length-1); ++index) {
					chart1.data.push([index,parseFloat(arrayEnergyMonth[index])]);
				};
			    // assign chart
			    $scope.chartmonth = chart1;

				// Calculate PeakPower for Today		    
			    $scope.piekvermogen = Math.max.apply(Math, arrayVermogenVandaag); // 99
		        $scope.overallPeak = localStorageService.get('peakPowerOverall');
		        
		        $scope.totaleEnergie=0;
		        for(var i in arrayEnergyMonth) { 
					$scope.totaleEnergie += parseFloat(arrayEnergyMonth[i]); 
				}
				// round it
				$scope.totaleEnergie = Math.round($scope.totaleEnergie * 100) / 100  

				// totaal geld bespaard
				$scope.getBespaardeEuros = function ()
				  {
				    return Math.round($scope.energieprijs * $scope.totaleEnergie * 100) / 100  
				  };
				
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
}]);
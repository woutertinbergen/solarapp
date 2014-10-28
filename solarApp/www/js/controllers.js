angular.module('starter.controllers', ['LocalStorageModule'])

.controller('DashCtrl', ['$scope', '$timeout','ServerData','localStorageService', function($scope, $timeout, ServerData,localStorageService) {
	var tempGegegvens=[];
	$scope.energieprijs = 0.23;
	$scope.datum = '2014-09-09'; // startdatum
	$scope.vorigeZichtbaar = true;
	$scope.volgendeZichtbaar = false;
	$scope.vandaag = moment().format('YYYY-MM-DD');
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
	$scope.setData($scope.vandaag);
}])

.controller('MonthCtrl', ['$scope', '$timeout','ServerData','localStorageService', function($scope, $timeout, ServerData,localStorageService) {
	var tempGegegvens=[];
	$scope.energieprijs = 0.23;
	$scope.datum = '2014-09-08'; // startdatum
	$scope.vorigeZichtbaar = true;
	$scope.volgendeZichtbaar = false;

	$scope.setMonthData = function(givendate){
		if(angular.isDefined(givendate)){
			// andere maand --> laatste dag voor totalen.
			var lastDate = moment(givendate).endOf("month").format("YYYY-MM-DD");
			$scope.setData(lastDate);
		}else{
			$scope.setData();
		}
	}

	$scope.changeMonth = function(direction){
		if(direction=="previous"){
			if(moment($scope.datum).subtract(1, 'month').isAfter(moment('2014-09-08'))){
				$scope.datum = moment($scope.datum).subtract(1, 'month').format('YYYY-MM-DD').toString();

			}else{
				//console.log('ken niet eerder');
			}
			$scope.setMonthData($scope.datum);
		}else{
			if(moment($scope.datum).add(1, 'month').isBefore(moment(),'month') || moment($scope.datum).add(1, 'month').isSame(moment(),'month') ){
				if(moment($scope.datum).add(1, 'month').isSame(moment(),'month')){
					$scope.datum = moment().format('YYYY-MM-DD');
					$scope.setMonthData();
				}else{
					$scope.datum = moment($scope.datum).add(1, 'month').format('YYYY-MM-DD').toString();		
					$scope.setMonthData($scope.datum);
				}
			}else{
				//console.log('ken niet');
			}
			
		}
		
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
		        $scope.totaleEnergieDezeMaand = 0;
		        // haal totaal tot deze maand
				angular.forEach(localStorageService.get('totalen'),function(value,key){
					if(moment(key).isBefore(moment(dedatum).format('YYYY-MM'))){
						$scope.totaleEnergie += parseFloat(value);
					}else{
						//console.log('komt er bij');
					}
				})
				$scope.maand = moment(dedatum).format("MMMM");
		        for(var i in arrayEnergyMonth) { 
		        	$scope.totaleEnergieDezeMaand += parseFloat(arrayEnergyMonth[i]); 
					$scope.totaleEnergie += parseFloat(arrayEnergyMonth[i]); 
				}
				// round it
				$scope.totaleEnergieDezeMaand = Math.round($scope.totaleEnergieDezeMaand * 100) / 100  ;
				$scope.totaleEnergie = Math.round($scope.totaleEnergie * 100) / 100  ;

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

	var init = function(){
		initApp();
		$scope.setData($scope.vandaag);
	}

	var getMonthsBeforeToday = function(datum){
		var thismonth		= moment(datum).format("YYYY")+'-'+moment(datum).format("MM");;
				
		var start = moment("2014-09", "YYYY-MM");
		var end   = moment(thismonth, "YYYY-MM");
		var range = moment().range(start, end);
		var querydates = [];
		range.by('month', function(moment) {
	  		if(moment.endOf("month").isAfter(end)){
	  			// dan vandaag
	  			querydates.push(datum);
	  		}else{
	  			// laatste dag van de maanden ervoor
	  			querydates.push(moment.endOf("month").format('YYYY-MM-DD'));
	  		}	
		});
		return querydates;	
	};

	var initApp = function(){
		// get all totals:
		// -- maandtotalen sinds startdatum

		// startmaand is 2014-09
		// haal alle laatste dagen op per maand sinds 2014-09
		// tel de totalen door elk dagtotaal op te tellen
		// zet in object en store in local storage op index

		var today 			= moment().format('YYYY-MM-DD');
		var daysToRetrieve = getMonthsBeforeToday(today);
		$scope.totals = {};
		daysToRetrieve.forEach(function(dag) {
		    ServerData.getDay(dag).then( 
		    	function(data){
			    	var dezemaandtotaal=0;
			    	var arrayEnergyMonth	= data[0].energie_dag.split(",");	
			    	for(var i in arrayEnergyMonth) { 
						dezemaandtotaal += parseFloat(arrayEnergyMonth[i]); 
					}

					$scope.totals[moment(dag).format('YYYY-MM')] = dezemaandtotaal;	
					localStorageService.set('totalen',JSON.stringify($scope.totals));
		    	}
		    );
		});
	}
	initApp();
	init();
}]);
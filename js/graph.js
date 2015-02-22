/**
 * Created by geeth on 8/14/14.
 */


/*** @jsx React.DOM */

var r = 0;

var Chart = React.createClass({
    render: function() {
        return (
            <div>
                {drawChartObject()}
            </div>
            );
    }
});

function drawChartObject(mockData) {
    new Highcharts.Chart({
        chart: {
            type: 'line',
            animation: Highcharts.svg, // don't animate in old IE
            marginRight: 10,
            renderTo: 'highChart',
            events: {
                load: function() {
                    // set up the updating of the chart each second
                    var series = this.series[0];
                    var series1 = this.series[1];
                    //var series2 = this.series[2];
                    setInterval(function() {
                        $.ajax({
                            type : 'GET',
                            url : "perfdata",
                            data : {type : 'Infra', requestType :"getEntitledTree"},
                            dataType : "json",
                            async : false,
                            cache : false,
                            success : function(data) {
                                if(data != "error"){
                                    series.addPoint([data[0].time, (r)], true, true);
                                    series1.addPoint([data[0].time, data[1].value], true, true);
                                    r+=10000;
                                }else {
                                    console.log('What happened?');
                                }
                            }.bind(this),
                            error : function(error){
                                alert('We encountered an error');
                                $('#data').html(JSON.stringify(error));
                            }
                        });
                    }, 2000);
                }
            }
        },
        title: {
            text: 'Mock Data from Server'
        },
        xAxis: {
            type: 'datetime',
            tickPixelInterval: 150
        },
        yAxis: {
            title: {
                text: 'Value'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            formatter: function() {
                return '<b>'+ this.series.name +'</b><br/>'+
                    Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) +'<br/>'+
                    Highcharts.numberFormat(this.y, 2);
            }
        },
        legend: {
            enabled: false
        },
        exporting: {
            enabled: false
        },
        series: [{
            name: 'Random data',
            data: (function() {
                // generate an array of random data
                var data = [],
                    time = (new Date()).getTime(),
                    i;

                for (i = -19; i <= 0; i++) {
                    data.push({
                        x: time + i * 1000,
                        y: 0
                    });
                }
                return data;
            })() }, {
            name: 'Other Random data',
            data: (function() {
                // generate an array of random data
                var data = [],
                    time = (new Date()).getTime(),
                    i;

                for (i = -19; i <= 0; i++) {
                    data.push({
                        x: time + i * 1000,
                        y: 0
                    });
                }
                return data;
            })()
        }]
    })
}; //end chartObject

var dynamicLineData = {
    name: 'Dynamic data',
    values: []
};

var LineChartHC = React.createClass({
    render: function() {
        return (
            <div>
                <Chart />
            </div>
            ); // end of return for render
    } // end of render
}); // end of LineChartHC

var lineDataReact = React.createClass({
    getInitialState: function() {
        return {
            title: 'Changable component',
            values: [0]
        };
    },
    render: function() {
        return (
            <div>
				{this.state.values}
            </div>
            );
    }
});

var showLineData = React.createClass({
    render: function() {
        return (
            <div>
                <h5>Show dynamiceLineData Values:</h5>
				{dynamicLineData.values}
            </div>
            );
    }
});

var mockData =
    [{"time": 0 , "value": 0}]

var pushData =
{"time":'10', "value":7};

var tableReact =
    React.createClass({
        getInitialState: function() {
            return {
                chartObjects: mockData,
                deviceRows: null,
                data: {}
            };
        }, //end getInitialState
        loadData: function() {
            $.ajax({
                type : 'GET',
                url : "perfdata",
                data : {type : 'Infra', requestType :"getEntitledTree"},
                dataType : "json",
                async : false,
                cache : false,
                success : function(data) {
                    if(data != "error"){
                        this.setState({data: data});
                        this.setChartObjectsToDeviceRows();
                    }else {
                        console.log('What happened?');
                    }
                }.bind(this),
                error : function(error){
                    alert('We encountered an error');
                    $('#data').html(JSON.stringify(error));
                }
            });
            this.parseData();
        },
        parseData: function() {
            this.state.chartObjects.push( this.state.data[0] );
            //this.state.chartObjects.push( this.state.data[1] );
        }, //end parseData
        setChartObjectsToDeviceRows: function() {
            var devices = [];
            for(i=0;i<this.state.chartObjects.length;i++) {
                if (typeof this.state.chartObjects[i]!== 'undefined')
                    devices.push(<rowOfData data={this.state.chartObjects[i]} />);
            }
            this.setState({deviceRows: devices});
        }, //end setChartObjectsToDeviceRows
        componentWillMount: function() {
            this.loadData();
            setInterval(this.loadData, 2000);
        }, //end componentDidMount
        addDevice: function() {
            this.setChartObjectsToDeviceRows();
            this.forceUpdate();
        }, //end addItem
        render: function() {
            return (
                <div>
                    <h1>HighCahrt Name</h1>
                point 1 time: {this.state.data[0].time}

                point 1 value: {this.state.data[0].value}

                    <table>
                        <th>Time</th>
                        <th>Value</th>
                    	{this.state.deviceRows}
                    </table>
                    <button onClick={this.addDevice}>Get Data </button>
                </div>
                ); //end return
        } //end render
    }); //end tableReact

var rowOfData =
    React.createClass({
        render: function() {
            return (
                <tr>
                    <pointOfData dataPassed={this.props.data.time}/>
                    <pointOfData dataPassed={this.props.data.value}/>
                </tr>
                );
        }//end render
    }); //end of rowOfData

var pointOfData=
    React.createClass({
        render:function(){
            return (
                <td>{this.props.dataPassed}</td>
                ); //end return
        }//end render
    }); //end of pointOfData

var MainReact =
    React.createClass({
        componentDidMount: function() {
            console.log('MainReact componentDidMount');
        },
        render: function() {
            return (
                <div>
                    <Chart/>
                </div>
                );
        }
    });

React.renderComponent(
    <MainReact/>,
    document.getElementById('highChart')
);